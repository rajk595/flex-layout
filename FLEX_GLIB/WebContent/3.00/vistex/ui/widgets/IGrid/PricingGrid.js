define = undefined;
sap.ui.define([ "sap/ui/core/Control",
	"./IGrid",
	vistexConfig.rootFolder + "/ui/core/global",
	"./uicore",
	"./inGrid",
], function(control, IGrid,global,uicore) {

	var A = control.extend(vistexConfig.rootFolder + ".ui.widgets.IGrid.PricingGrid", {
		metadata : {
			properties : {
				controller : {
					type : "object",
					defaultValue : null
				},
				modelName : {
					type : "string",
					defaultValue : null
				},
				sectionModelPath : {
					type : "string",
					defaultValue : null
				},
				iGridDataPath : {
					type : "string",
					defaultValue : null
				},
				fullScreen : {
					type : "boolean",
				},
				dropdownPath : {
					type: "string",
					defaultValue : null
				},
				selectedFilter : {
					type:"string",
					defaultValue : null
				},
				fullscreenPath :{
					type:"string",
					defaultValue : null
				},
	             handle : {
	                	type: "string",
	                    defaultValue: null
	             },
	             variantDataPath: {
	                    type: "string"
	             },
	             layoutDataPath: {
	                    type: "string"
	             },
	             selectedVariant: {
	                    type: "string"
	             },		
	             hideVariantSave: {
	                    type: "boolean",
	                    defaultValue: false
	                },
	             hideShare: {
	                    type: "boolean",
	               },              
	       
			},
			aggregations : {
				_getGridContainer : {
					type : "sap.ui.core.Control",
					multiple : false,
					visibility : "hidden"
				}
			},
			events : {
				layoutChange : {
					parameters : {
						selectionSet : {
							type : "sap.ui.core.Control[]"
						}
					}
				},
				procedureExecute : {},
				refreshDerivation : {},
				saveAsSnapshot : {},
				overwriteSnapshot : {},
				addMembers : {},
				importMembers : {},
				commentUpdate : {},
				saveAsPriceProposal : {},
				onFullScreen : {},
				/**ESP6 Task#43744 Pricing Grid Integration 31.0.3**/				
				dictionaryUpdate :{},
				externalEvent : {},
				/****/
				/**ESP6 Task#53345 Supporting variants in Grid**/
				variantSave : {},
	            variantSelect: {},
	            /****/
                /**Rel - SP7 Supporting Snapshots in Grid**/  
                snapshotManage : {},
                /****/
	            /**ESP7 Task#56827 Supporting Lazy Loading in Grid**/
                iGridDataGet : {}
                /****/
			}
		},
		init : function() {
			this._oBundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.widgets.IGrid");
			this.gridConfig = {
					/**ESP6 Task# 31147 - Grid Integration**/
					//gridVM : '',
					gridAPI:'',
					baseGridName:'',
					gridDefs:[],
					/****/					
				refreshApp : {
					/**ESP6 Task# 31147 - Grid Integration**/
					//gridSettings : ko.observable(null)
					/**ESP6 Task# 34966 - Grid Integration Version 28.0.0**/   
//					gridSettings : vendor.ko.observable(null)
					gridSettings : inGrid.ko.observable(null)
					/****/
					/****/
				},
				cons : {
					toUpper : 'U',
					toLower : 'L',
					camelToUnderscored : 'CU', 
					UnderscoredToCamel : 'UC'
				}
			}
			/**ESP6#33626 Static changes removal from Pricing grid molecule.**/
			var oData = {
					"gridAttributes":{
						"Type":"",
						"Descr":""
					}
			};					
			var oModel = new sap.ui.model.json.JSONModel({});
			oModel.setData(oData);
			this.setModel(oModel,"gridModel");
			/****/
		},

		renderer : function(oRM, oControl) {
			oRM.write("<div");
			oRM.writeControlData(oControl);
			   if(oControl.getFullScreen()){
	            	oRM.addClass('iGridMoleculeFullScreen');	
	            }
	            else{
	            	oRM.addClass('iGridMolecule');	
	            }
			oRM.writeClasses();
			oRM.write(">");
			oRM.renderControl(oControl.getAggregation("_getGridContainer"));
			oRM.write("</div>");
		},
	    exit: function(){
	        	 console.log("Pricing Grid Exit....");
	        	 this.disposeIGrid();
	    }  
	});

	A.procedureParams = [];
	A.prototype.setModelName = function(value) {
		this.setProperty("modelName", value, true);
	};

	A.prototype.setController = function(value) {
		this.setProperty("controller", value, true);
	};

	A.prototype.setSectionModelPath = function(value) {
		this.setProperty("sectionModelPath", value, true);
	};

	A.prototype.setIGridDataPath = function(value) {
		this.setProperty("iGridDataPath", value, true);
	};
	A.prototype.setFullScreen = function(value) {
		this.setProperty("fullScreen", value, true);
		if (this._fullScreenButton) {
			this._fullScreenButton.setVisible(value);
		}
	};
	/**ESP6#33626 Static changes removal from Pricing grid molecule.**/
	A.prototype.setdropdownPath = function(value) {
		this.setProperty("dropdownPath", value, true);
	};
	
	A.prototype.setselectedFilter = function(value) {
		this.setProperty("selectedFilter", value, true);
	};
	
	A.prototype.setfullscreenPath = function(value) {
		this.setProperty("fullscreenPath", value, true);
	};
	/****/
	/**ESP6 Task#53345 Supporting variants in Grid**/
    A.prototype.setVariantDataPath = function (value) {
        this.setProperty("variantDataPath", value, true);
    };

    A.prototype.setLayoutDataPath = function (value) {
        this.setProperty("layoutDataPath", value, true);
    };
    A.prototype.setSelectedVariant = function (value) {
        this.setProperty("selectedVariant", value, true);
    };
    A.prototype.setHandle = function (value) {
        this.setProperty("handle", value, true);
    };
    A.prototype.setHideVariantSave = function (value) {
        this.setProperty("hideVariantSave", value, true);
    };
    A.prototype.setHideShare = function (value) {
        this.setProperty("hideShare", value, true);
    };
	/****/
	A.prototype.loadGridContainer = function() {
		var oControl = this;
		var modelName = oControl.getProperty("modelName");
		var dataPath = oControl.getProperty("iGridDataPath");
		if (oControl.oGridContainer) {
			oControl.oGridContainer.destroy();
		}
		var gridPage = new sap.m.Page({
			showHeader : false,
			showSubHeader : true,
			subHeader : new sap.m.OverflowToolbar({
			})
		}).addStyleClass("gridPageScrolling");
		oControl.oGridContainer = new sap.m.NavContainer({
			pages : [ gridPage ]
		});

		 if(!oControl.getFullScreen()){
	        	gridPage.addStyleClass("iGridMolecule");
	        }
		 
		gridPage.bindAggregation("content", modelName + ">" + dataPath, function(sId, oContext) {
			/**Rel SP7 - Busy Indicator Changes Start**/
            sap.ui.core.BusyIndicator.show();
            /**Rel SP7 - Busy Indicator End**/
			setTimeout(function() {
				oControl.renderGrid();
			}, 2000);
			return new IGrid({});
		});
		oControl.setAggregation("_getGridContainer", oControl.oGridContainer);
	};
    /**ESP6 Task#53345 Supporting variants in Grid**/
    A.prototype.initialiseVariants = function() {
        var oControl = this,
            object,
            global,
            oController,
            modelName,
            variantDataPath;        
            modelName = oControl.getModelName();
            oController = oControl.getProperty("controller");
            variantDataPath = oControl.getVariantDataPath();
            
         oControl._oVariants = new sap.ui.comp.variants.VariantManagement({
            enabled: true,
            showShare: true,
            save: oControl._onVariantSave.bind(oControl),
            manage: oControl._onVariantManage.bind(oControl),
            select: oControl._onVariantSelect.bind(oControl),
             visible: true
         });
         oControl._oVariants.bVariantItemMode = true;
         oControl._oVariants._setStandardText();
         oControl._oVariants.oVariantPopoverTrigger.setTooltip(oControl._oBundle.getText('SelectVariant'));    
         
         oControl._oVariants.bindAggregation("variantItems", modelName + ">" + variantDataPath, function (sid, oContext) {

             object = oContext.getObject();

             if (object['DEFLT'] == "X") {
                 oControl._oVariants.setDefaultVariantKey(object['VARID']);
             }
             var item = new sap.ui.comp.variants.VariantItem({
                 text: object['DESCR'],
                 key: object['VARID'],
                 global: object['UNAME'] === "",
                 author: object['AENAM_TXT']
             });
             if (object['UNAME'] === "" && oControl.getHideShare()) {
                 item.setReadOnly(true);
             }

             oControl._oVariants.setInitialSelectionKey();
             return item;
         });
         oControl._oVariants.addEventDelegate({
             onAfterRendering: function (e) {
                 var oControlData = this;
                 var model = oControlData.getModel(oControlData.getModelName());
                 var selectedVariant = model.getProperty(oControlData.getSelectedVariant());
                 if (selectedVariant && ((e.srcControl.getInitialSelectionKey() === "") || (e.srcControl.getInitialSelectionKey() !== selectedVariant))) {
                     e.srcControl.setInitialSelectionKey(selectedVariant);
                 } 
                     if (oControl.getHideVariantSave()) {
                     	oControl._oVariants.setVisible(false);
                     }
             }
         },oControl );

    };
    A.prototype._onVariantSave = function (oEvent) {
        var oControl = this, 
            overwrite, 
            header,
            overwrite_properties, 
            params = {}, 
            globalVariant,
            oController,
            mainModel,
            appContext,
            variantsData;
        
        oControl.fromSaveVariant = true;
        oController = oControl.getProperty("controller");
        mainModel = oController.getModel(global.vui5.modelName);
        appContext = mainModel.getProperty("/APPCTX");
        overwrite = overwrite_properties = oEvent.getParameter("overwrite") || '';        
        variantsData = oControl.getProperty("controller").getCurrentModel().getProperty(oControl.getVariantDataPath());       
        header = underscoreJS.find(variantsData, {
            'VARID': oEvent.getParameter("key")
        });
        if (header) {
            globalVariant = header['UNAME'] === '' ? 'X' : false;
        }
        else {
            globalVariant = oEvent.getParameter("global") === true ? 'X' : false;
        }

        if (overwrite) {
            header['UPDKZ'] = global.vui5.cons.updkz.upd;
        } else {
            header = {};
            header['VARID'] = oEvent.getParameter("key");
            header['DESCR'] = oEvent.getParameter("name");
            header['OBJTP'] = appContext['OBJTP'];
            header['APPLN'] = global.vui5.cons.application;
            header['UPDKZ'] = global.vui5.cons.updkz.ins;
            header['DEFLT'] = oEvent.getParameter("def") === true ? 'X' : '';         
            header['HANDLE'] = oControl.getHandle();
        }

        oControl.saveData = [];
        oControl.saveData.push(header);
                                 
        params[global.vui5.cons.params.overwrite] = overwrite;
        params[global.vui5.cons.params.overwrite_properties] = overwrite_properties;
        params[global.vui5.cons.params.global] = globalVariant;
        params[global.vui5.cons.params.handle] = oControl.getHandle();
        params[global.vui5.cons.params.variantID] = header['VARID'];
        oControl.fireVariantSave({
            urlParams: params
        });
    };
    
    A.prototype._onVariantSelect = function(oEvent) {
        var oControl = this, 
            variantData,
            selectedVariant,
            variant;
        
        oControl.fromVariant = true;
        variant = oEvent.getParameter("key");
        variantData = oControl.getProperty("controller").getCurrentModel().getProperty(oControl.getVariantDataPath());
        selectedVariant = underscoreJS.findWhere(variantData, {
            'VARID': variant
        });

        if (!selectedVariant) {
            selectedVariant = {
                "ROWID": 0
            };

            oControl._applyElmtFeature = false;
        }

        oControl.fireVariantSelect({
            record: selectedVariant
        });
    };
    A.prototype._onVariantManage = function (oEvent) {

        var oControl = this,
            oController,
            variantData,
            params = {},
            variantData,
            deleted,
            renamed,
            defaultVariant,
            variantList,
            item,
            variant;
        
        oControl.fromVariant = true;
        oController = oControl.getProperty("controller");

        deleted = oEvent.getParameter("deleted");
        renamed = oEvent.getParameter("renamed");

        defaultVariant = oEvent.getParameter("def");

        variantList = oControl.getProperty("controller").getCurrentModel().getProperty(oControl.getVariantDataPath());
        variantData = {
            'NEWVARIANTS': [],
            'UPDATEVARIANTS': [],
            'DELETEVARIANTS': []
        };
        var overwriteItems = [];
        if (renamed.length > 0) {
            underscoreJS.each(renamed, function (renamedItem) {
                item = underscoreJS.find(variantList, {
                    'VARID': renamedItem.key
                });
                if (item && item.UPDKZ !== global.vui5.cons.updkz.del) {
                    item.DESCR = renamedItem.name;
                    item.UPDKZ = global.vui5.cons.updkz.upd;
                    overwriteItems.push(item);
                }
            });
        }


        if (defaultVariant != '') {
            variant = underscoreJS.find(variantList, {
                'VARID': defaultVariant
            });
            if (variant) {
                if (variant['UNAME'] == "") {
                    underscoreJS.each(variantList, function (obj) {
                        if (obj['VARID'] != variant['VARID']) {
                            item = underscoreJS.find(overwriteItems, {
                                'VARID': obj.VARID
                            });
                            if (item) {
                                item.DEFLT = '';
                            } else {
                                obj.DEFLT = '';
                                obj.UPDKZ = global.vui5.cons.updkz.upd;
                                overwriteItems.push(obj);
                            }
                        }
                    });
                } else {
                    underscoreJS.each(variantList, function (obj) {
                        if (obj['VARID'] != variant['VARID'] && obj['UNAME'] != "") {
                            item = underscoreJS.find(overwriteItems, {
                                'VARID': obj.VARID
                            });
                            if (item) {
                                item.DEFLT = '';
                            } else {
                                obj.DEFLT = '';
                                obj.UPDKZ = global.vui5.cons.updkz.upd;
                                overwriteItems.push(obj);
                            }
                        }
                    });
                }

                item = underscoreJS.find(overwriteItems, {
                    'VARID': defaultVariant
                });
                if (item) {
                    item.DEFLT = 'X';
                    item.UPDKZ = global.vui5.cons.updkz.upd;
                } else {
                    variant.DEFLT = 'X';
                    variant.UPDKZ = global.vui5.cons.updkz.upd;
                    overwriteItems.push(variant);
                }
            } else if (defaultVariant == "*standard*") {
                underscoreJS.each(variantList, function (obj) {
                    obj.DEFLT = '';
                    obj.UPDKZ = global.vui5.cons.updkz.upd;
                    overwriteItems.push(obj);
                });
            } else {
                underscoreJS.each(variantList, function (obj) {
                    if (obj['VARID'] != defaultVariant && obj['UNAME'] != "") {
                        item = underscoreJS.find(overwriteItems, {
                            'VARID': obj.VARID
                        });
                        if (item) {
                            item.DEFLT = '';
                        } else {
                            obj.DEFLT = '';
                            obj.UPDKZ = global.vui5.cons.updkz.upd;
                            overwriteItems.push(obj);
                        }
                    }
                });
            }
        }

        var markStandardAsDefault = "";
        if (defaultVariant == "*standard*") {
            markStandardAsDefault = 'X';
        }

        var data = [];
        if (deleted.length > 0) {
            var deletedItems = [];
            underscoreJS.each(deleted, function (value) {
                var item = underscoreJS.findWhere(variantList, {
                    "VARID": value
                });
                if (item && item.UPDKZ !== global.vui5.cons.updkz.del) {
                    item.UPDKZ = global.vui5.cons.updkz.del;
                    deletedItems.push(item);
                }
                var overwriteItem = underscoreJS.find(overwriteItems, {
                    'VARID': value
                });
                if (overwriteItem) {
                    overwriteItems.pop(overwriteItem);
                }
            });

            variantData['DELETEVARIANTS'] = deletedItems;
        }

        if (overwriteItems.length > 0) {
            params[global.vui5.cons.params.overwrite] = 'X';
            params[global.vui5.cons.params.handle] = oControl.getHandle();
            params[global.vui5.cons.params.markStandardAsDefault] = markStandardAsDefault

            variantData['UPDATEVARIANTS'] = overwriteItems;

        }

        if (underscoreJS.isEmpty(variantData['DELETEVARIANTS']) && underscoreJS.isEmpty(variantData['UPDATEVARIANTS'])) {
            return;
        }

        oControl._variantData = {
            "VARIANTS": underscoreJS.union(variantData['DELETEVARIANTS'], variantData['UPDATEVARIANTS'])
        };

        params[global.vui5.cons.params.variantID] = oControl._oVariants.getSelectionKey();

        oControl.fireVariantSave({
            urlParams: params
        });
    };
    
	A.prototype.prepareHeaderToolbarContent = function() {
		var oControl = this;
		/**ESP6 Task#53345 Supporting variants in Grid**/
		oControl.initialiseVariants();
		/****/
		var oController = oControl.getProperty("controller");
		var modelName = oControl.getProperty("modelName");
		var oModel = oController.getModel(modelName);
		var mainModel = oController.getModel(global.vui5.modelName);
		var section = oModel.getProperty(oControl.getProperty("sectionModelPath"));
		var sectionFunctions = section['FUNC'];
		var sectionFilters = section['FILTER'] || [];
		var gridPage = {},
			toolbarControl;
		/**ESP6#33583 Static changes removal from planning grid molecule.**/
		var selectedFilter = oControl.getProperty("selectedFilter");
		var dropdownPath = oControl.getProperty("dropdownPath");
		var fullscreenPath = oControl.getProperty("fullscreenPath")
		/****/
		if (oControl.oGridContainer) {
			gridPage = oControl.oGridContainer.getPages()[0];
			gridPage.getSubHeader().removeAllContent();
		}
		 gridPage.getSubHeader().addContent(oControl._oVariants);
		gridPage.getSubHeader().addContent(new sap.m.ToolbarSpacer({}));
		var visible,
			oType,
			priority,
			buttonType,
			buttonConfig,
			showIcon;
		sectionFunctions.forEach(function(funct, idx) {
			oType = sap.m.ButtonType.Transparent;
			visible = funct['HIDFN'] !== 'X';
			priority = funct['FNDTP'] === global.vui5.cons.func.showInList ? sap.m.OverflowToolbarPriority.AlwaysOverflow : sap.m.OverflowToolbarPriority.High;
			if (funct['ACTYP'] != global.vui5.cons.actionType.filters) {
				showIcon = funct['FDTYP'] === global.vui5.cons.functionDisplayType.icon;
				buttonType = showIcon ? sap.m.OverflowToolbarButton : sap.m.Button

				if (funct['BTNTP'] === global.vui5.cons.buttonType.accept) {
					oType = sap.m.ButtonType.Accept;
				} else if (funct['BTNTP'] === global.vui5.cons.buttonType.reject) {
					oType = sap.m.ButtonType.Reject;
				} else if (funct['BTNTP'] === global.vui5.cons.buttonType.emphasize) {
					oType = sap.m.ButtonType.Emphasized;
				}

				buttonConfig = {
					type : oType,
					text : funct['DESCR'],
					tooltip : funct['DESCR'],
					press : oControl.processGridActions.bind(oControl, funct),
					layoutData : new sap.m.OverflowToolbarLayoutData({
						priority : priority
					}),
					visible : visible
				};
				if (showIcon) {
					buttonConfig['icon'] = funct['FNICN'];
				}
				toolbarControl = new buttonType(buttonConfig);
				gridPage.getSubHeader().addContent(toolbarControl);
			}
		});
	       
		sectionFilters.forEach(function(filter, idx) {
			var funct = underscoreJS.findWhere(section['FUNC'], {
				"FNCNM" : filter['FNCNM']
			}) || {};
			var functAttr = underscoreJS.find(section['ATTRB'], {
				VALUE : filter['FNCNM']
			}) || {};
			visible = funct['HIDFN'] !== 'X';
			priority = funct['FNDTP'] === global.vui5.cons.func.showInList ? sap.m.OverflowToolbarPriority.AlwaysOverflow : sap.m.OverflowToolbarPriority.High;
			if (filter['FTDTP'] === global.vui5.cons.fieldType.dropdown || filter['FNCNM'] === 'LTCHNG') { //Dropdown
				toolbarControl = new sap.m.Select({
					width : "17%",
					layoutData : new sap.m.OverflowToolbarLayoutData({
						priority : priority
					}),
					selectedKey : "{" + 
					/**ESP6#33626 Static changes removal from Pricing grid molecule.**/
					//modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/" + filter['SFATR'] + "}",
					 modelName + selectedFilter + "}",
					/****/
					change : function(oEvent) {
						var drdn = oEvent.getSource();
						var oPath = drdn.getSelectedItem().getBindingContext(global.vui5.modelName).getPath();
//						if (!oControl.hasValidationRulesError()) {
							oControl.fireEvent(functAttr['NAME'], {
								filter : mainModel.getProperty(oPath)
							});
//						} else {
//							drdn.setSelectedKey(oControl.prevLayout);
//						}
					},
				}).bindAggregation("items",
					/**ESP6#33626 Static changes removal from Pricing grid molecule.**/
					//global.vui5.modelName + ">/DROPDOWNS/" + section['DARID'] + "/" + filter['FIELD'],
					global.vui5.modelName + dropdownPath + filter['FIELD'],
					/****/
					function(id, context) {
						return new sap.ui.core.Item({
							key : "{" + global.vui5.modelName + ">NAME}",
							text : "{" + global.vui5.modelName + ">VALUE}"
						});
					});

			} else if (filter['FTDTP'] === global.vui5.cons.fieldType.toolbar) { 
				showIcon = funct['FDTYP'] === global.vui5.cons.functionDisplayType.icon;
				buttonType = showIcon ? sap.m.OverflowToolbarButton : sap.m.Button;
				//Preparing Content to Display in Popover in case of Filter in Toolbar
				var oFilterList = new sap.m.SelectList({
					selectedKey : "{" + modelName +  
					/**ESP6#33626 Static changes removal from Pricing grid molecule.**/
					//">/SECCFG/" + section['SECTN'] + "/attributes/" + filter['SFATR']
					selectedFilter
					/****/
					+ "}",
					showSecondaryValues : true,
					selectionChange : function(oEvent) {
						oEvent.getSource().getParent().close();
						var oPath = oEvent.getParameter("selectedItem").getBindingContext(global.vui5.modelName).getPath();

						oControl.fireEvent(functAttr['NAME'], {
							filter : mainModel.getProperty(oPath)
						});
					}
				}).bindAggregation("items",
					global.vui5.modelName + 
					/**ESP6#33626 Static changes removal from Pricing grid molecule.**/
					//">/DROPDOWNS/" + section['DARID'] + "/" ,
					dropdownPath
					/****/
					+ filter['FIELD'],
					
					function(sId, oContext) {
						return new sap.ui.core.ListItem({
							key : "{" + global.vui5.modelName + ">NAME}",
							text : "{" + global.vui5.modelName + ">VALUE}",
							additionalText : "{" + global.vui5.modelName + ">NAME}"
						});
					}).setModel(mainModel, global.vui5.modelName).setModel(oModel, modelName);

				var oPopover = new sap.m.ResponsivePopover({
					title : filter['LABEL'],
					bounce : true,
					placement : sap.m.PlacementType.Bottom,
					content : [ oFilterList ],
					afterClose : function(oEvent) {
						oModel.setProperty( 
								/**ESP6#33626 Static changes removal from Pricing grid molecule.**/
								//"/SECCFG/" + section['SECTN'] + "/attributes/" + filter['SFATR']
								selectedFilter
						/****/
						, "");
					}
				});
				buttonConfig = {
					text : funct['DESCR'],
					tooltip : funct['DESCR'],
					press : function(oEvent) {
						oPopover.openBy(oEvent.getSource());
					},
					layoutData : new sap.m.OverflowToolbarLayoutData({
						priority : priority
					})
				};
				if (showIcon) {
					buttonConfig['icon'] = funct['FNICN'];
				}
				toolbarControl = new buttonType(buttonConfig);
			}
			gridPage.getSubHeader().addContent(toolbarControl);
		});
		oControl._fullScreenButton = new sap.m.OverflowToolbarButton({
			type : sap.m.ButtonType.Transparent,
			icon : {
				path : 
					/**ESP6#33626 Static changes removal from Pricing grid molecule.**/
					//global.vui5.modelName + ">" + "/FULLSCREEN",
					global.vui5.modelName + fullscreenPath,
					/****/
				formatter : function(fullScreen) {
					return fullScreen === true ? 'sap-icon://exit-full-screen' : 'sap-icon://full-screen';
				},
				mode : sap.ui.model.BindingMode.TwoWay
			},
	        tooltip: {
	        	path : 
	        		/**ESP6#33626 Static changes removal from Pricing grid molecule.**/
					//global.vui5.modelName + ">" + "/FULLSCREEN",
					global.vui5.modelName + fullscreenPath,
					/****/
	                 formatter: function(fullScreen) {
	                	 return fullScreen === true ?  oControl._oBundle.getText("ExitFullScreenView") : oControl._oBundle.getText("FullScreenView");
	                 },
	                 mode: sap.ui.model.BindingMode.TwoWay
	         },
			press : oControl.fullScreenDialog.bind(oControl)
		});
		gridPage.getSubHeader().addContent(oControl._fullScreenButton);
		


	};

	A.prototype.fullScreenDialog = function(oEvent) {
		var oControl = this;
		var source = oEvent.getSource();
		var oController = oControl.getProperty("controller");
		if (oControl.gridConfig.gridAPI) {
			oController.gridAPI = oControl.gridConfig.gridAPI;
		}
		this.fireOnFullScreen({
			"fullScreen" : oEvent.getSource().getIcon() === 'sap-icon://full-screen'
		});
	};

//	A.prototype.prepereSaveSnapshotPopover = function(oEvent, funct) {
//		var oControl = this;
//		var modelName = oControl.getProperty("modelName");
//		var oController = oControl.getProperty("controller");
//		var oModel = oController.getModel(modelName);
//		var mainModel = oController.getModel(global.vui5.modelName);
//		var section = oModel.getProperty(oControl.getProperty("sectionModelPath"));
//		/**ESP6#33626 Static changes removal from Pricing grid molecule.**/
//		var dropdownPath = oControl.getProperty("dropdownPath")
//		var gridModel = oControl.getModel("gridModel")
//		/****/
//		var snapshotTypesDrdn = new sap.m.ComboBox({
//			editable : true,
//			visible : true
//		}).addStyleClass('sapUiTinyMarginBottom');
//		/**ESP6#33626 Static changes removal from Pricing grid molecule.**/
//		//snapshotTypesDrdn.bindProperty("selectedKey", modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/selectedSnapshotType", null, sap.ui.model.BindingMode.TwoWay);
//		snapshotTypesDrdn.bindProperty("selectedKey", "gridModel>/gridAttributes/Type", null, sap.ui.model.BindingMode.TwoWay);
//		/****/
//		snapshotTypesDrdn.bindItems(global.vui5.modelName + 
//				/**ESP6#33626 Static changes removal from Pricing grid molecule.**/
//				//">/DROPDOWNS/" + section['DARID'] + "/SNTYP", function(id, obj) {
//				dropdownPath + "SNTYP", function(id, obj) {
//			/****/
//			var item = obj.getObject();
//			return new sap.ui.core.Item({
//				key : item['NAME'],
//				text : item['VALUE']
//			});
//		});
//
//		var snapshotForm = new sap.ui.layout.form.SimpleForm({
//			editable : false,
//			layout : "ResponsiveGridLayout",
//			labelSpanS : 5,
//			content : [
//				new sap.m.Label({
//					text : oControl._oBundle.getText('SnapshotType')
//				}).addStyleClass('sapUiTinyMarginTop'),
//				snapshotTypesDrdn,
//				new sap.m.Label({
//					text : oControl._oBundle.getText('Description') 
//				}).addStyleClass('sapUiTinyMarginTop'),
//				new sap.m.Input({
//					maxLength : 40,
//					/**ESP6#33626 Static changes removal from Pricing grid molecule.**/
//					//value : "{" + modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/snapshotDescr}"
//					value : "{gridModel>/gridAttributes/Descr}"
//					/****/
//				})
//			]
//		}).setModel(mainModel, global.vui5.modelName).setModel(oModel, modelName);
//		var oSnapshotDialog = new sap.m.Dialog({
//			title : oControl._oBundle.getText('SnapshotTypeTitle'),
//			content : [ snapshotForm ],
//			afterClose : function(oEvent) {
//				/**ESP6#33626 Static changes removal from Pricing grid molecule.**/
//				//oModel.setProperty("/SECCFG/" + section['SECTN'] + "/attributes/selectedSnapshotType", "");
//				//oModel.setProperty("/SECCFG/" + section['SECTN'] + "/attributes/snapshotDescr", "");
//				gridModel.setProperty("/gridAttributes/Type", "");
//				gridModel.setProperty("/gridAttributes/Descr", "");
//				/****/
//			},
//			beginButton : new sap.m.Button({
//				text : oControl._oBundle.getText('Ok'),
//				tooltip : oControl._oBundle.getText('Ok'),
//				press : function(oEvent) {
//					/**ESP6#33626 Static changes removal from Pricing grid molecule.**/
//					//if (oModel.getProperty("/SECCFG/" + section['SECTN'] + "/attributes/selectedSnapshotType") === ""
//						//|| oModel.getProperty("/SECCFG/" + section['SECTN'] + "/attributes/selectedSnapshotType") === undefined) {
//					if (gridModel.getProperty("/gridAttributes/Type") === ""
//						|| gridModel.getProperty("/gridAttributes/Type") === undefined) {
//						/****/
//					sap.m.MessageToast.show(oControl._oBundle.getText('PleaseSelectSnapshotType'));
//					} else {
//						oSnapshotDialog.close();
//						var snpParams = {
//								/**ESP6#33626 Static changes removal from Pricing grid molecule.**/
//							//$SNTYP : oModel.getProperty("/SECCFG/" + section['SECTN'] + "/attributes/selectedSnapshotType") || "",
//							//$EDESCR : oModel.getProperty("/SECCFG/" + section['SECTN'] + "/attributes/snapshotDescr") || ""
//							$SNTYP : gridModel.getProperty("/gridAttributes/Type") || "",
//							$EDESCR : gridModel.getProperty("/gridAttributes/Descr")|| ""
//							/****/
//						};
//						oControl.fireSaveAsSnapshot({
//							params : snpParams
//						});
//					}
//				}
//			}),
//			endButton : new sap.m.Button({
//				text : oControl._oBundle.getText('Cancel'),
//				tooltip : oControl._oBundle.getText('Cancel'),
//				press : function(oEvent) {
//					oSnapshotDialog.close();
//				}
//			})
//		}).addStyleClass("sapUiSizeCompact");
//		oSnapshotDialog.open();
//		oSnapshotDialog.setModel(gridModel,"gridModel");
//	};

	A.prototype.preparePriceProposalPopover = function(oEvent, funct) {
		var oControl = this;
		var modelName = oControl.getProperty("modelName");
		var oController = oControl.getProperty("controller");
		var oModel = oController.getModel(modelName);
		var mainModel = oController.getModel(global.vui5.modelName);
		var section = oModel.getProperty(oControl.getProperty("sectionModelPath"));
		/**ESP6#33626 Static changes removal from Pricing grid molecule.**/
		var dropdownPath = oControl.getProperty("dropdownPath")
		var gridModel = oControl.getModel("gridModel")
		/****/
		var priceproposalTypesDrdn = new sap.m.ComboBox({
			editable : true,
			visible : true
		}).addStyleClass('sapUiTinyMarginBottom');
		priceproposalTypesDrdn.bindProperty("selectedKey",
				/**ESP6#33626 Static changes removal from Pricing grid molecule.**/
				// modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/selectedPriceProposalType", 
				"gridModel>/gridAttributes/Type",
				/****/
				null, sap.ui.model.BindingMode.TwoWay);
		priceproposalTypesDrdn.bindItems(global.vui5.modelName + 
				/**ESP6#33626 Static changes removal from Pricing grid molecule.**/
				//">/DROPDOWNS/" + section['DARID'] + "/PPTYP", function(id, obj) {
			dropdownPath + "PPTYP", function(id, obj) {
			/****/
			var item = obj.getObject();
			return new sap.ui.core.Item({
				key : item['NAME'],
				text : item['VALUE']
			});
		});
		var priceproposalForm = new sap.ui.layout.form.SimpleForm({
			editable : false,
			layout : "ResponsiveGridLayout",
			labelSpanS : 5,
			content : [
				new sap.m.Label({
					text : oControl._oBundle.getText('PriceProposalType')
				}).addStyleClass('sapUiTinyMarginTop'),
				priceproposalTypesDrdn,
				new sap.m.Label({
					text : oControl._oBundle.getText('Description')
				}).addStyleClass('sapUiTinyMarginTop'),
				new sap.m.Input({
					maxLength : 40,
					value : 
					/**ESP6#33626 Static changes removal from Pricing grid molecule.**/
					//"{ modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/priceproposalDescr}"
						"{gridModel>/gridAttributes/Descr}"
					/****/
				})

			]
		}).setModel(mainModel, global.vui5.modelName).setModel(oModel, modelName);
		var oPriceProposalDialog = new sap.m.Dialog({
			title : oControl._oBundle.getText('PriceProposalTypeTitle'),
			content : [ priceproposalForm ],
			afterClose : function(oEvent) {
				/**ESP6#33626 Static changes removal from Pricing grid molecule.**/
				//oModel.setProperty("/SECCFG/" + section['SECTN'] + "/attributes/selectedPriceProposalType", "");
				//oModel.setProperty("/SECCFG/" + section['SECTN'] + "/attributes/priceproposalDescr", "");
				gridModel.setProperty("/gridAttributes/Type", "");
				gridModel.setProperty("/gridAttributes/Descr", "");
				/****/
			},
			beginButton : new sap.m.Button({
				text : oControl._oBundle.getText('Ok'),
				tooltip : oControl._oBundle.getText('Ok'),
				press : function(oEvent) {
					/**ESP6#33626 Static changes removal from Pricing grid molecule.**/
					//if (oModel.getProperty("/SECCFG/" + section['SECTN'] + "/attributes/selectedPriceProposalType") === ""
						//|| oModel.getProperty("/SECCFG/" + section['SECTN'] + "/attributes/selectedPriceProposalType") === undefined) {
						if (gridModel.getProperty("/gridAttributes/Type") === ""
							|| gridModel.getProperty("/gridAttributes/Type") === undefined) {
						/****/
						sap.m.MessageToast.show(oControl._oBundle.getText('PleaseSelectPriceProposalType'));
					} else {
						oPriceProposalDialog.close();
						var ppParams = {
								/**ESP6#33626 Static changes removal from Pricing grid molecule.**/
							//$PPTYP : oModel.getProperty("/SECCFG/" + section['SECTN'] + "/attributes/selectedPriceProposalType") || "",
							//$EDESCR : oModel.getProperty("/SECCFG/" + section['SECTN'] + "/attributes/priceproposalDescr") || ""
							$PPTYP : gridModel.getProperty("/gridAttributes/Type") || "",
							$EDESCR : gridModel.getProperty("/gridAttributes/Descr") || ""
							/****/
						};
						oControl.fireSaveAsPriceProposal({
							params : ppParams
						});
					}
				}
			}),
			endButton : new sap.m.Button({
				text : oControl._oBundle.getText('Cancel'),
				tooltip : oControl._oBundle.getText('Cancel'),
				press : function(oEvent) {
					oPriceProposalDialog.close();
				}
			})
		}).addStyleClass("sapUiSizeCompact");
		oPriceProposalDialog.open();
		oPriceProposalDialog.setModel(gridModel,"gridModel");
	};

	A.prototype.processGridActions = function(funct, oEvent) {
		var oControl = this;
		switch (funct['FNCNM']) {
		case 'RFRDRV':
			oControl.fireRefreshDerivation();
			break;
//		case 'SAVESNP':
//			oControl.prepereSaveSnapshotPopover(oEvent, funct);
//			break;
		case 'SAVEPP':
			oControl.preparePriceProposalPopover(oEvent, funct);
			break;
//		case 'OVERWRITE':
//			oControl.fireOverwriteSnapshot();
//			break;
		case 'CTUPD':
			oControl.fireCommentUpdate();
			break;
		default:
               oControl.fireExternalEvent({
                   func: funct
               });		
		}
	};

	A.prototype.prepareMatrixRowsString = function(rows) {
		var floatArrayLength = 0,
			i = 0,
			innerArrayString,
			mainString = "";
		if(rows.length>0){
		rows.forEach(function(floatArray, i) {
			floatArrayLength = floatArray.length;
			innerArrayString = "";
			for (i = 0; i < floatArrayLength; i++) {
				if (innerArrayString) {
					innerArrayString += ",";
				}
				innerArrayString += floatArray[i];
			}
			if (mainString) {
				mainString += "],[";
			}
			mainString += innerArrayString;
		});
		}
		return mainString;
	};
	/**ESP6 Task#43207 Pricing Grid Integration Release 30.0.1**/   
	function DictionaryServiceThrottler(dictionaryService, maximumNumberOfRequests) {
        this.queue = [];
        this.processingQueue = [];
        this.count = 0;
        this.maximumNumberOfRequests = 1;
        this.dictionaryService = dictionaryService;
        this.maximumNumberOfRequests = maximumNumberOfRequests;
    }
    DictionaryServiceThrottler.prototype.addToQueue = function (methodName, args) {
        var _this = this;
        var resolver;
        var promise = new Promise(function (r) { return resolver = r; });
        var request = function () {
            var response = _this.dictionaryService[methodName](args);
            if(response && $.isFunction(response.promise)){  
                _this.count = _this.count + 1;
                response.then(function (data) {
                	   _this.count = _this.count - 1;;
                    if (_this.count === 0) {
                    	resolver(data);
                    }
                });
                return response;
            }
            else{
            	resolver(response);
            	return response;
            }
            
        };
        this.queue.push(request);
        this.processQueue();
        return promise;
    };
    DictionaryServiceThrottler.prototype.processQueue = function () {
        var _this = this;
        if (this.processingQueue.length >= this.maximumNumberOfRequests) {
            return;
        }
        if (this.queue.length > 0) {
            var request_1 = this.queue.pop();
            this.processingQueue.push(request_1);
                request_1();
                var index = _this.processingQueue.indexOf(request_1);
                _this.processingQueue.splice(index, 1);
                _this.processQueue();
        }
    };
    DictionaryServiceThrottler.prototype.search = function (query) {
        return this.addToQueue("search", query);
    };
    DictionaryServiceThrottler.prototype.getMetadata = function () {
        return this.addToQueue("getMetadata", void 0);
    };
    DictionaryServiceThrottler.prototype.getMetadataFor = function (dictionaryName) {
        return this.addToQueue("getMetadataFor", dictionaryName);
    };
    /**ESP7 Integrating Grid version 35.0.0 version **/
//    DictionaryServiceThrottler.prototype.getDetails = function (dictionaries) {
//        if (Array.isArray(dictionaries)) {
//            return this.addToQueue("getDetails", dictionaries);
//        }
//        else {
//            return this.addToQueue("getDetails", dictionaries);
//        }
//    };
    /****/
    DictionaryServiceThrottler.prototype.isValidHierarchy = function (request) {
        return this.addToQueue("isValidHierarchy", request);
    };
    DictionaryServiceThrottler.prototype.onNewItemsAdded = function(request) {
        return this.addToQueue("onNewItemsAdded", request);
    };
        	

	var DictionaryService = (function(oControl){
		oControl.newDictionaries = {};
		 oControl.fromDictUpdate;
		var deferred;
		DictionaryService.getMetadata = function(){
				var dictionaryData = {
				   dictionaries:  oControl.dictionaries,
			       groups:[]
				};
				return dictionaryData;
					    	
		}
		DictionaryService.getMetadataFor = function(dictionaryName){
			  if(dictionaryName){
					var dictData = _.find(oControl.dictionaries,{name : dictionaryName});
					  	return dictData;
			  }				  
		}
	    /**ESP7 Integrating Grid version 35.0.0 version **/
//		DictionaryService.getDetails = function(dictionaries){
//	  		if(dictionaries){		  			
//	  		   if(Array.isArray(dictionaries)){
//	  			 dictDetails = [];
//	  				dictionaries.forEach(function(dictionary){
//		  				var dictData = _.find(oControl.dictionaries,{name : dictionary});
//			  			dictDetails.push(dictData);				  			
//		  			});
//	  				 return dictDetails;
//	  		        }
//	  				else{
//			  			var dictData = _.find(oControl.dictionaries,{name : dictionaries});
//			  			return dictData;
//	  					}		  		  
//		}
//      }
		/****/
		DictionaryService.isValidHierarchy = function(vldtnObj){
		   return true;	
		}
	    DictionaryService.onNewItemsAdded = function(f) {
            oControl.dictionaryFunction = f;
            return function(){
            	oControl.dictionaryFunction = null
            	}
        }
		DictionaryService.search = function(srchObj){
			if(srchObj.dictionary !== null){
  			 var srchData = {
  					 items:[]
  					},
  				  dictPromise,
	  		      newDict = {
  					 "ITEMS":[] ,
  			         "DICTIONARY" :""
  					};
  			 
	  		var dictData = _.find(oControl.dictionaries,{name : srchObj.dictionary});
	  		 switch(srchObj['__type']){
	  		 
	  		 case 0 ://id
	  			 srchData.dictionary = srchObj.dictionary;
	  			 srchObj.ids.forEach(function(id){
	  				 var item = {};
	  				 var ditm = _.find(dictData.items,{key : id});
			  		  if(ditm == undefined){
			  			item.id =  id;
		  				item.label =  "";					  	
			  		  }
			  		  else{
			  			 item.id = ditm.key;
				  	     item.label = ditm.value;  
			  		  }		  				
	  				srchData.items.push(item);	  				
	  			 })
	  			 break;
	  			 
	  		 case 1:   //label
	  	         srchData.dictionary = srchObj.dictionary;
	  			 srchObj.labels.forEach(function(lbl){
	  				 var item = {};		  				
	  				 var ditm = _.find(dictData.items,{value : lbl});
			  		  if(ditm == undefined){
			  			 newDict['DICTIONARY'] = srchObj.dictionary;
				  			if(srchObj.allowNew == true )
				  			{	
					  	    oControl.fromDictUpd = true;		
			  				newDict['ITEMS'].push(lbl);
			  				deferred = $.Deferred();
				  			}
			  		  }		
			  		  else{
			  	       item.id = ditm.key;
			  	       item.label = ditm.value;
			  	     srchData.items.push(item);	
			  		  }  
	  				
	  				
	  			 });
			  		if(newDict['ITEMS'].length>0 ){
			  			oControl.newDictionaries = {};
				  		oControl.newDictionaries = newDict;
				  		srchData = deferred.promise();
				  	    oControl.fireDictionaryUpdate({
			                callBack: function (response) {	                		
			                	var data = response['DI'];
			                 	data = oControl.convertNotation(data, oControl.gridConfig.cons.toLower);
			                	if(data.dictionary != ""){
			                    	 srchData = {
				          					 items:[]
				          					},
				            			 srchData.dictionary =  data.dictionary;
				            				var dictData = _.find(oControl.dictionaries,{name : data.dictionary});
	                                        
				            				data.items.forEach(function(itm){						            					
				            						dictData.items.push(itm);	
				            						dictData.count = dictData.count + 1;
				            					var item2 = {};
				            					 item2.id =  itm.key;
				            					 item2.label =  itm.value;
				            			  	    srchData.items.push(item2);
				            				});			            		
						              deferred.resolve(srchData);
						              oControl.fromDictUpd = false;
			                	}
			            		oControl.newDictionaries = {};
			                }});
			  		}  		       	
			  		 
	  			 break;
	  		 case 3: //contains
	  			 srchData.dictionary = srchObj.dictionary;
	  			var items = _.filter(dictData.items, function(obj){	
	  	        if ((obj.value.search(new RegExp(srchObj.contains, "i")) != -1)) 
	  			{return obj;}
	  			});
	  		  /**ESP7 QA#12184 Fiori Filters in Scenario Fiori application is not working as expected**/
                //items = items.slice(srchObj.offset, srchObj.limit); 
                  var offset = srchObj.offset == null ?  0 : srchObj.offset;
                  var limit  = srchObj.limit  == null ?  Number.MAX_SAFE_INTEGER : srchObj.limit;
                  var limitation = offset + limit;
                  items = items.slice(offset, limitation);
                  /****/
	  			srchData.items = _.map(items, function(obj){ return { id : obj["key"] , label : obj["value"] }; });
	  			srchData.count = dictData.count;	
	  			 break;
	  		 case 4: //All		  			 
	  			srchData.dictionary = srchObj.dictionary;
	  			var limit = srchObj.offset + srchObj.limit;
	  			var items = dictData.items.slice(srchObj.offset,limit);
	  			srchData.items = _.map(items, function(obj){ return { id : obj["key"] , label : obj["value"] }; });
	  			srchData.count = dictData.count;		  			 		  			
	  		 }

	  				 return srchData; 
		 }
	    }
        return DictionaryService;
	});
	/****/
    /**ESP7 Task#56827 Supporting Lazy Loading in Grid**/
    var dataLoader = (function(oControl){
        dataLoader.next = function() {
               deferred = $.Deferred();
                oControl.fireIGridDataGet({
              callBack: function(response) {                                   
                   deferred.resolve(response);
                }
         });
                return deferred.promise();
        }
         return dataLoader;
     });
    /****/
	A.prototype.renderGrid = function() {
		console.log("render Grid Method Triggered....");
		var oControl = this;
		 oControl.dictionaryFunction = {};
        /**Rel - SP7 Supporting Snapshots in Grid**/
    	var payload = {},
	    status ,
        snapshotsObj = {
                "EVTYP": "",
                "DATA": ""
            },
    	convertedMetrics = [];
	    oControl.snapshotsObject = {};
    	/****/
		var oController = oControl.getProperty("controller");
		if(oController.rendergrid){ 
		var gridModel = oControl.getModel("gridModel");
		var dataPath = oControl.getProperty("iGridDataPath");
		var model = oController.getModel(oControl.getProperty("modelName"));
		var section = model.getProperty(oControl.getProperty("sectionModelPath"));
		var selLayout =  underscoreJS.find(section['ATTRB'], {
			NAME : 'selectedLayout'
		})||{};
//		oControl.prevLayout =selLayout['VALUE']||'';
		oControl.procedureParams = [];
		var gData = model.getProperty(dataPath) || [];
		var gridData = {};
		var gridsData = [],gridsComments = [];gridsScales = [];
		if (gData.length) {
			  /**ESP6 Task#43744 Pricing Grid Integration V 31.0.3**/		
			if (!oControl.fromDictUpd){
				/****/
			gridData = $.extend({}, gData[0]);
			if (gridData) {
				gridData['IGRID_METADATA'] = JSON.parse(gridData['IGRID_METADATA']); 
				
				var enableLazyLoading =  underscoreJS.find(section['ATTRB'], {
                    NAME : 'enableLazyLoading'
                })||{};
                if(enableLazyLoading.VALUE){
                  var dataLoaderObj = new dataLoader(oControl);
                }				
                gridData['IGRID_DATA'].forEach(function(data){
					
					var obj = {
						'name':data['NAME'],
						'values':JSON.parse(data['VALUES'])
					};
					gridsData.push(obj);
				});
				gridData['IGRID_COMMENTS'].forEach(function(data){
					
					var obj = {
						'name':data['NAME'],
						'values':JSON.parse(data['VALUES'])
					};
					gridsComments.push(obj);
				});
				/**Supporting Multiple Sheets as Tabs**/
//				if(gridData['IGRID_SCALES']!== "")
//				{
//				     var scalesObj = JSON.parse(gridData['IGRID_SCALES']);
//		                gridsScales.push(scalesObj);
//				}
				gridData['IGRID_SCALES'] = JSON.parse(gridData['IGRID_SCALES']);
				/****/				
				/**Hybrid Configuration changes**/
			    if (!gridData["IGRID_METADATA"].hasOwnProperty('dictionaries')) {
                    gridData["IGRID_METADATA"]['dictionaries'] = [];
                    gridData["IGRID_METADATA"]["gridDefinitions"].forEach(function(grid) {
                        grid['fields'].forEach(function(flds) {
                            if (flds.hasOwnProperty('dictionary')) {
                                if (_.find(gridData["IGRID_METADATA"]['dictionaries'], {
                                        name: flds['dictionary']
                                    }) === undefined) {
                                	  var dict = {items:[]},item = {};
                                	  if( flds.id === 'IRM_PROGN'){
                                		  item = {key : 1,value :oControl._oBundle.getText('NEWRCRD')};
                                		  dict.items.push(item);
                                		  item = {key : 2,value :oControl._oBundle.getText('CHNGRCRD')};
                                		  dict.items.push(item);
                                	  }
                                	  else{
                                		  item = {key : 1,value :flds.name};
                                		  dict.items.push(item);
                                	  }
                                    dict.name = flds.dictionary;
                                    dict.description = flds.name;
                                    gridData["IGRID_METADATA"]['dictionaries'].push(dict);
                                }
                            }
                        })
                    })
                    if(gridData["IGRID_METADATA"]['variables']){
                    gridData["IGRID_METADATA"]['variables'].forEach(function(vrbs) {
                        if (vrbs.hasOwnProperty('dictionary')) {
                            if (_.find(gridData["IGRID_METADATA"]['dictionaries'], {
                                    name: vrbs['dictionary']
                                }) === undefined) {                           	
                            	 var dict = {items:[]},item = {};
                                item = {key : 1,value :vrbs.description};
                                dict.name = vrbs.dictionary;
                                dict.description = vrbs.description;                                
                                dict.items.push(item);
                                gridData["IGRID_METADATA"]['dictionaries'].push(dict);
                            }
                        }
                    })
                    }
                        
                }						
			    /**Hybrid Configuration changes**/
			    
		oControl.dictionaries = gridData['IGRID_METADATA']['dictionaries'];
		/****/
		/**ESP6 Task# 31147 - Grid Integration**/
		oControl.gridConfig.gridDefs = [];
		gridData['IGRID_METADATA']['gridDefinitions'].forEach(function(grid){
			if(grid.gridType === 'Pricing'){
				oControl.gridConfig.baseGridName = 	grid.name;			
				if (grid['filters']){
					var filterObj = {
										'formulas':grid['filters']['formulas'] || [],
										'conditions':[]
									};
					if(grid['filters']['conditions']){
					grid['filters']['conditions'].forEach(function(conditions){
						if(typeof conditions['value'] == "string"){
							conditions['value'] = JSON.parse(conditions['value']);
						}
					});
					filterObj['conditions'] = grid['filters']['conditions'];
				}
					grid['filters'] = filterObj;	
			 }
				
			}
            if(grid.gridType === inGrid.GridType[1]){
                if (grid['parentDataFilters']) {
                    if (grid['parentDataFilters']['conditions']) {
                        grid['parentDataFilters']['conditions'].forEach(function(conditions) {
                            if (typeof conditions['value'] == "string") {
                                conditions['value'] = JSON.parse(conditions['value']);
                            }
                        });
                    }
                }
            }
			var obj={ gridType:grid.gridType,
					  name: grid.name,
					  description:grid.description };
			oControl.gridConfig.gridDefs.push(obj);
		});
		
//		var cultureObj = underscoreJS.find(gridData['IGRID_METADATA']['settings'],{'key':'CultureInfo'}) || {};
//		var cultureInfo = cultureObj['value'] || "en-US";
		/**ESP6 TASK#32432 - Supporting internationalisation in Grid**/
		/*var translationsObject = {
								 "url": vistex.uiResourcePath + "/1.00/vistex/ui/widgets/IGrid/culture/"+ cultureInfo +".json"					
								 };	*/
//		var lang = gridData['IGRID_METADATA']['langu'] || "en";
//		var translationsObject = {
//				"cultureInfo":cultureInfo,
//				 "url": vistexConfig.uiResourcePath + "/" + vistexConfig.globalLibraryVersion + "/" + vistexConfig.rootFolder + "/ui/widgets/IGrid/i18n/i18n_" + lang + ".json"
//				 };	
		/****/
//		translations.push(translationsObject);
//		gridData['IGRID_METADATA']['translationsSources']= translations;
		if(gridData['IGRID_METADATA']){
			if(gridData["IGRID_METADATA"]["currencyPrecision"]){
			if(gridData["IGRID_METADATA"]["currencyPrecision"]['values']){
				gridData["IGRID_METADATA"]["currencyPrecision"]['values'] = JSON.parse(gridData["IGRID_METADATA"]['currencyPrecision']['values'])
			}
		}
	}
	
  }
 /**ESP6 Task#43744 Pricing Grid Integration V 31.0.3**/					
}
			else{
				 oControl.fromDictUpd = false;		
			}
/****/
}
			

//			if (gridData['IGRID_METADATA']) {
//				
//				 if(gridData['IGRID_ASMP']){
//		        	 (gridData['IGRID_ASMP']['data'] || []).forEach(function(obj, index) {
//		                 if (obj['values']) {
//		                     obj['values'] = JSON.parse(obj['values']);
//		                 }
//		             });
//		         }   
			
		/****/			
		if (gridsData.length ) {
						
//				if (oController.gridAPI) {
//					console.log("old Grid disposed....");
//					oController.gridAPI.destroy();
//					oController.gridAPI = "";
//				}
				if (oController.gridAPI) {
			        	if(oController.gridAPI.isDestroyed)
			            { oController.gridAPI = "";}
			        	else{
			        		oController.gridAPI.destroy();
			        		 oController.gridAPI = "";
			        	}
			        	console.log("old Grid disposed....");
			      }
				
				 var mainModel = oController.getModel(global.vui5.modelName);
				var appContext = mainModel.getProperty("/APPCTX");
				if(appContext['OBJTP'] == "/IRM/IPPD" && appContext['APPLN'] == "1" ){
					var freeText_val = []
				}
				else{
				var freeText_val = [],count = 0;
	            if(freeText_val){
	            	gridsData.forEach(function(grid){
	            		currGridDef = {};
	            		var currGridDef = underscoreJS.find(gridData['IGRID_METADATA']["gridDefinitions"] , {name : grid.name})
	            		if(currGridDef){
	            			grid["values"].forEach(function(data){
	            				
	            				currGridDef['fields'].forEach(function(flds,index){
	                    			if(flds.typeAndFormat === 'FreeText'){ 
	                    				
	                    				var ind = freeText_val.indexOf(data[index]);
	                    					if(ind != -1){
	                            				data[index] = ind;
	                    					}
	                    					else {
	                    						if(data[index] === ""){
	                    							data[index] = NaN
	                    						}
	                    						else{
	                                				freeText_val.push(data[index])
	                                				data[index] = count;
	                                				count = count + 1;
	                    						}
	                    					}
	                    			}
	                    		})
	                    	})
	            		}
	            	})
	            	
	            }
				}
				
				
	            /****/
				   /**Rel - SP7 Supporting Snapshots in Grid**/
	            var snapshots = [];
	            if(gridData['IGRID_SNAPSHOTS']){
	            	snapshots = JSON.parse(gridData['IGRID_SNAPSHOTS'])
	            }
	            /****/
	            var lang = gridData['IGRID_METADATA']['langu'] || "en";
	            var jsonUrl =  jQuery.sap.getModulePath(vistexConfig.rootFolder + ".ui.widgets.IGrid") + "/i18n/i18n_" + lang + ".json";
	            
	            $.getJSON(jsonUrl, function(json) {
				oControl.disposeIGrid();				
				var gridSettings = {
		/**ESP6 Task# 31147 - Grid Integration**/
//					data : gridData['IGRID_DATA'],
//					assumptions: gridData['IGRID_ASMP'] || [],
				    /**ESP7 Task#56827 Supporting Lazy Loading in Grid**/
	                       dataLoader : dataLoaderObj,
	                /****/	
				    data : gridsData,		
					comments : gridsComments,
					scales : gridData['IGRID_SCALES'],					
					config : gridData['IGRID_METADATA'],	
					strings: freeText_val||[],
					type : "LocalStorage",
					/**ESP6 Task#43143 Integrating grid version 31.0.1.**/
					translation: json,
					DictionaryService: new DictionaryService(oControl),
					dictionaryService : new DictionaryServiceThrottler(DictionaryService , 1),
					/****/	
					/**Rel - SP7 Supporting Snapshots in Grid**/                
	                snapshotsMetadata : snapshots,
	                /****/
					callbacks : {
						/**ESP6 TASK#31147 - Grid Integration**/
						onGridVMInitialized: function (gridAPI) { 
							 var minHeight = "570";
		              		  oControl.gridConfig.gridAPI = gridAPI;
		                        oController.gAPI = gridAPI;
		                        $(".iGridMolecule").css("height" , minHeight);		                        
		              	},
						onGridVMReady: function (gridAPI) {
							var baseController;                      
	                        /** Rel SP7 - Cursor Position Changes Start**/
	                        if(oControl.cursorPosition!== undefined && Object.keys(oControl.cursorPosition).length !== 0){
	                       	 gridAPI.setCursorPosition(oControl.cursorPosition);
	                       }
	                        /** Rel SP7 Cursor Position Changes End**/
	                        
	                        /**Rel SP7 - Busy Indicator Changes Start**/
	                        sap.ui.core.BusyIndicator.hide();
	                        /**Rel SP7 - Busy Indicator End**/
	                      },
//						onGridReady : function(tab, gridVM) {
	                      onGridReady : function(tabId) {
							/*if (gridVM) {
								oControl.gridConfig.gridVM = gridVM;
								if (tab) {
									
									if (tab.gridType != TsGrid.Enums.GridType.PlanningSummary) {
								
									oControl.gridConfig.gridVM.grid = tab.grid;
									
									}
								
									 TsGrid.MessageBus.getInstance().publish(TsGrid.Enums.Channel.GridChangeValidationMode, {
				                            tabId: tab.grid.getName(),
				                            body: TsGrid.Enums.UpdateMode.Auto
				                        });		
									 TsGrid.MessageBus.getInstance().publish(TsGrid.Enums.Channel.ToolbarToggleFitMode, {
				                            tabId: tab.grid.getName(),
				                            body: true
				                        });	
								  
								}
							}*/
	                    	  /**ESP6 Task#34966- Grid Integration Version 28.0.0**/
	                    	 /* inGrid.MessageBus.getInstance().publish(inGrid.Enums.Channel.ToolbarToggleFitMode, {
									
		                            tabId: tabId,
		                            body: true
		                        });	*/
	                    		
	                    	//  inGrid.MessageBus.getInstance().publish(inGrid.Channel.ToolbarToggleFitMode, {
	                    		  
//	                    		  inGrid.MessageBus.publish(inGrid.Channel.ToolbarToggleFitMode, {
//									
//		                            tabId: tabId,
//		                            body: true
//		                        });	
	                    		  /**ESP7**/
	                              var ignoredTags = ['select', 'input', 'textarea', 'button'];
	                              $('#gridWrapper'+ oControl.oGridContainer.getPages()[0].getContent()[0].randomNumber).bind('keydown', function(e) {	                              	
	                                 var activeElementTag = (document.activeElement || document.body).tagName.toLowerCase();
	                                 var isCorrectActiveElement = !_.contains(ignoredTags, activeElementTag);
	                                 if (isCorrectActiveElement) {
	                                         var isCopy = e.ctrlKey && !e.altKey && !e.shiftKey && ( e.key === 'c'|| e.key === 'C' );
	                                         var isPaste = e.ctrlKey && !e.altKey && !e.shiftKey && ( e.key === 'v'||e.key === 'V' );
	                                         if(isCopy){
	                                      	   inGrid.MessageBus.publish(inGrid.Channel.GridCopy, {
	                                                 tabId: tabId,
	                                                 body: true
	                                             });
	                                         }
	                                         if(isPaste){
	                                      	   inGrid.MessageBus.publish(inGrid.Channel.GridPaste, {
	                                                 tabId: tabId,
	                                                 body: true
	                                             });
	                                         }
	                                      
	                                     }

	                               }); 
	                              /****/  
						},
						/**ESP6 TASK#31147 - Grid Integration**/
					/*	onBeforeTabFocus : function(targetGridModule, sourceGridModule, gridvm) {},
						onTabFocus : function(tab, gridvm) {},
						onTabBlur : function(tab, gridvm) {}*/
						onBeforeTabFocus : function(targetGridModule, sourceGridModule) {},
						onTabFocus : function(tab) {},
						onTabBlur : function(tab) {},
						/****/
					}
				}	
				oControl.gridConfig.refreshApp.gridSettings(gridSettings);
				oController.rendergrid = false;
				/**ESP6 TASK#31147 - Grid Integration**/
//				ko.applyBindings(oControl.gridConfig.refreshApp, $('#gridWrapper')[0]);
				 /**ESP6 Task# 34966 - Grid Integration Version 28.0.0**/   
//				vendor.ko.applyBindings(oControl.gridConfig.refreshApp, $('#gridWrapper')[0]);
				inGrid.ko.applyBindings(oControl.gridConfig.refreshApp, $('#gridWrapper'+ oControl.oGridContainer.getPages()[0].getContent()[0].randomNumber)[0]);
				/****/
				console.log("Grid Bindings Applied....." + $('#gridWrapper'+ oControl.oGridContainer.getPages()[0].getContent()[0].randomNumber)[0]);
				/**ESP6 Task# 31147 - Grid Integration**/
				//var msgBus = TsGrid.MessageBus.getInstance();
				var msgBus = inGrid.MessageBus;
				/****/
				if (msgBus) {
					/**ESP6 Task# 31147 - Grid Integration**/
					/*var gridVMInitialzedSubscriptions = msgBus.channelSubscribers.get("GridVMInitialized") || [];
					gridVMInitialzedSubscriptions.forEach(function(subscId) {
						msgBus.unsubscribe(subscId);
					});
					
					msgBus.subscribe(TsGrid.Enums.Channel.GridVMInitialized, function(msg) {
						oControl.gridConfig.gridVM = msg.body;
					});*/
					/****/
					var procedureSubscriptions = msgBus.channelSubscribers.get("GridExecuteFunction") || [];
					procedureSubscriptions.forEach(function(subscId) {
						msgBus.unsubscribe(subscId);
					});
					  var configSubscriptions = msgBus.channelSubscribers.get("ExternalConfigUpdated") || [];
		                configSubscriptions.forEach(function(subscId) {
		                    msgBus.unsubscribe(subscId);
		                });
		                msgBus.subscribe(inGrid.Channel.ExternalConfigUpdated, function(msg) {
		                	 oControl._oVariants.currentVariantSetModified(true);
		                }, oController);
		                /**Rel - SP7 Supporting Snapshots in Grid**/               		                
		                var addSnpSubscriptions = msgBus.channelSubscribers.get("AddSnapshot") || [];
		                addSnpSubscriptions.forEach(function(subscId) {
		                    msgBus.unsubscribe(subscId);
		                });
		                                
		                msgBus.subscribe(inGrid.Channel.AddSnapshot, function(msg) {
		                	 status = inGrid.Enums.RequestStatus.Error;
		                	      convertedMetrics = [];
		                    	  deferred = $.Deferred();
		                    	  oControl.fromSnapshots = true;
		                    	  snpData = $.extend(true , {}, msg.body);
		                    	  delete snpData.config.currencyPrecision;
		                    	  Object.keys(snpData).forEach(function(key) {
		                    		  if(snpData[key] == false)   
		                    			  {snpData[key] = ''}                    				  
		                    		  else {
		                    			  if(snpData[key] == true)
		                    		         {snpData[key] = 'X'}
		                    			  };
		                    		});
		                    	  snpData["config"].gridDefinitions.forEach(function(gridDefn){
		                    		  convertedMetrics = [];
		                    		  gridDefn.fields.forEach(function(obj) {
		                                  oControl.convertIGridFields(obj);
		                                  convertedMetrics.push(obj);
		                              });
		                    		  gridDefn.fields = convertedMetrics;
		                    	  });
		                    	  snpData.data.forEach(function(data){
		                    		  data['values'] = JSON.stringify(data['values']);
		                    	  });
		                    	  snpData = oControl.convertNotation(snpData, oControl.gridConfig.cons.camelToUnderscored);
		                    	  snpData = oControl.convertNotation(snpData, oControl.gridConfig.cons.toUpper);
		                    	  snapshotsObj['EVTYP'] = 'ADD';
		                    	  snapshotsObj['DATA'] = snpData;
		                    	  oControl.snapshotsObject = snapshotsObj;
		                    	    payload = {
		                                    description: msg.body.description,
		                                    id: msg.body.id,
		                                    isRemovableByOthers: msg.body.isRemovableByOthers,
		                                    isVisibleToOthers: msg.body.isVisibleToOthers,
		                                    name: msg.body.name,
		                                    timestamp: msg.body.timestamp,
		                                    userName: msg.body.userName
		                            }
		                    	  oControl.fireSnapshotManage({
		                              callBack: function(response) {                            	     
		                            	     deferred.resolve(msgBus.publish(inGrid.Enums.Channel.AddSnapshotResponse, {
		                                         body: {
		                                             payload: payload,
		                                             status: inGrid.Enums.RequestStatus.Success,
		                                         },
		                                         tabId: msg.tabId
		                                     }));
		                            	     oControl.fromSnapshots = false;
		                            	     oControl.snapshotsObject = {};
		                            	  }
		                    	  });
		                    	  return deferred.promise();
		                }, oController);
		                
		                
		                var loadSnpSubscriptions = msgBus.channelSubscribers.get("LoadSnapshot") || [];
		                loadSnpSubscriptions.forEach(function(subscId) {
		                    msgBus.unsubscribe(subscId);
		                });
		                
		                msgBus.subscribe(inGrid.Enums.Channel.LoadSnapshot, function (msg) {
		                    	  deferred = $.Deferred();
		                    	  oControl.fromSnapshots = true;
		                    	  snapshotsObj['EVTYP'] = 'LOAD';
		                    	  snapshotsObj['DATA'] = {'ID' : msg.body};
		                    	  oControl.snapshotsObject = snapshotsObj;
		                    	  oControl.fireSnapshotManage({
		                              callBack: function(response) {      
		                            	    var sn = JSON.parse(response['SN']) ||{};		                            	   
		                            	    var editable = underscoreJS.find(sn.config.settings , {key : 'AllowEdit'})
		                            	    editable.value = false;
		                            	    sn.data.forEach(function(data){
		                                		  data['values'] = JSON.parse(data['values']);
		                                	    });   
		                            	    sn["config"].gridDefinitions.forEach(function(gridDefn){
		                                		  gridDefn.fields.forEach(function(obj) {
		                                            obj.editable = 'Never';
		                                          });
		                                	  });
		                            	    if(sn.config.dictionaries !== undefined){
		                              	 		 oControl.dictionaries = sn.config.dictionaries;
		                              	 	  var dictionaryData = {
		                        	 	                dictionaries: oControl.dictionaries,
		                        	 	                groups: []
		                        	 	             };
		                        	 	             oControl.dictionaryFunction(dictionaryData);
		                              	 	    }
		                            	     deferred.resolve(msgBus.publish(inGrid.Enums.Channel.LoadSnapshotResponse, {
		                                         body: {
		                                             payload: sn,
		                                             status: inGrid.Enums.RequestStatus.Success,
		                                         },
		                                         tabId: msg.tabId
		                                     }));
		                            	     oControl.fromSnapshots = false;
		                            	     oControl.snapshotsObject = {};
		                            	  }
		                    	  });
		                    	  return deferred.promise();                  
		                }, oController);
		                
		                var delSnpSubscriptions = msgBus.channelSubscribers.get("DeleteSnapshot") || [];
		                delSnpSubscriptions.forEach(function(subscId) {
		                    msgBus.unsubscribe(subscId);
		                });
		                
		                msgBus.subscribe(inGrid.Enums.Channel.DeleteSnapshot, function (msg) {
		                    status = inGrid.Enums.RequestStatus.Error;
		                    	 deferred = $.Deferred();
		                   	  oControl.fromSnapshots = true;
		                   	  snapshotsObj['EVTYP'] = 'DELETE';
		                   	  snapshotsObj['DATA'] = {'ID' : msg.body};
		                   	  oControl.snapshotsObject = snapshotsObj;
		                   	  oControl.fireSnapshotManage({
		                             callBack: function(response) {                            	     
		                           	     deferred.resolve(msgBus.publish(inGrid.Enums.Channel.DeleteSnapshotResponse, {
		                                        body: {
		                                            payload: msg.body,
		                                            status: inGrid.Enums.RequestStatus.Success,                                          
		                                        },
		                                        tabId: msg.tabId
		                                    }));
		                           	     oControl.fromSnapshots = false;
		                           	     oControl.snapshotsObject = {};
		                           	     
		                           	  }
		                   	  });
		                   	  return deferred.promise();
		                }, oController);
		                /****/  
					/**ESP6 Task# 31147 - Grid Integration**/
					//msgBus.subscribe(TsGrid.Enums.Channel.GridExecuteFunction, function(msg) {
					/**ESP6 Task#34966- Grid Integration Version 28.0.0**/
					//msgBus.subscribe(inGrid.Enums.Channel.GridExecuteFunction, function(msg) {
				    msgBus.subscribe(inGrid.Channel.GridExecuteFunction, function(msg) {
					/****/
						var task = msg['body'] || {};
						var taskName = task.name.toUpperCase();
						var procedureParams = [ {
							NAME : 'PROCEDURE',
							VALUE : taskName
						} ];
						var rowsData = task['rows'] || [];
						var rowsString = oControl.prepareMatrixRowsString(rowsData);
						task.parameters.forEach(function(obj) {
							procedureParams.push({
								NAME : obj['key'],
								VALUE : obj['value'] || ""
							});
						});
						procedureParams.push({
							"NAME" : "ROWS",
							"VALUE" : rowsString
						});
//						if (taskName.startsWith('#')) { //Function
//							taskName = taskName.substr(1, taskName.length);
//							procedureParams[0]['NAME'] = 'FUNCTION';
//							procedureParams[0]['VALUE'] = taskName;
//						}
						oControl.procedureParams = procedureParams;
						oControl.fireProcedureExecute();
					}, oController);
				}
				console.log(json); 
	            });
			}
		
		}
	};
	A.prototype.getGridComments = function(gridName) {
		var oControl = this,
			comments = [],
			convertedComments = [];
		/**ESP6 Task# 31147 - Grid Integration**/
		/*if (oControl.gridConfig.gridVM.grid) {
			comments = oControl.gridConfig.gridVM.getComments(oControl.gridConfig.gridVM.grid.getName());
		}*/
		if(oControl.gridConfig.gridAPI){
			var allGridsComments = oControl.gridConfig.gridAPI.getComments();
			var gridComments = underscoreJS.find(allGridsComments,{name:gridName}) || {};
			comments = gridComments['values'] || [];
		}	
		/****/
		if (comments.length) {
			comments.forEach(function(comment) {
				if (comment['cellAddress']) {
					if (comment['cellAddress']['xPath']) {
						comment['cellAddress']['xPath'] = comment['cellAddress']['xPath'].toUpperCase();
					}
					if (comment['cellAddress']['yPath']) {
						comment['cellAddress']['yPath'] = comment['cellAddress']['yPath'].toUpperCase();
					}
					/**ESP6 Task# 31147 - Grid Integration**/
//					if (comment['cellAddress'].hasOwnProperty('isCellLocked')) {
//						delete comment['cellAddress']['isCellLocked'];
//					}
					if (comment['cellAddress'].hasOwnProperty('xFullPath')) {
						delete comment['cellAddress']['xFullPath'];
					}
					if (comment['cellAddress'].hasOwnProperty('yFullPath')) {
						delete comment['cellAddress']['yFullPath'];
					}
					/****/
				}
				if (comment['comments'].length) {

					comment = oControl.convertNotation(comment, oControl.gridConfig.cons.camelToUnderscored);
					comment = oControl.convertNotation(comment, oControl.gridConfig.cons.toUpper);
					convertedComments.push(comment);
				}
			});

		}
		return convertedComments;
	},
	A.prototype.getGridScales = function(gridName) {
		var oControl = this;
		var scales = [],
			changedrowids = [];
		var allGridsScales = oControl.gridConfig.gridAPI.getScales();
		var gridScales = underscoreJS.find(allGridsScales,{name:gridName}) || {};
		scales = gridScales['data'] || [];
		/****/
		if (scales.length) {
			var floatArrayLength = 0,
				i = 0,
				innerArrayString,
				mainString = "";
			scales.forEach(function(scalesData, i) {
				
				mainString = mainString + "],[" + scalesData.field; scalesData.data.forEach(function(floatArray, i) {

					floatArrayLength = floatArray.length;
					innerArrayString = "";
					for (i = 0; i < floatArrayLength; i++) {
						if (innerArrayString) {
							innerArrayString += ",";
						}
						innerArrayString += floatArray[i];
					}
					if (mainString) {
						mainString += "],[";
					}
					mainString += innerArrayString;
			
				});
			});


		}
		return {
			LINES : mainString
		}
	},
	/**ESP6 Task# 31147 - Grid Integration**/	
	   A.prototype.convertIGridFields = function(field){
        for(var met in field){
          if(field[met] === true){
          	field[met] = 'X';
          }else if(field[met] === false){
          	field[met] = '';
          }
          else if(met === 'precisionType'){
             delete field[met] ;
            }
          else if( typeof field[met] == "object"){

        	  if(met == 'graphicTemplate'){
              if(field[met]['percentage'] === true){
              	field[met]['percentage']  = 'X';
              }else{
              	field[met]['percentage']  = '';
              }
            }else if(met == 'distribution'){
              if(field[met]['delta']){
              	field[met]['delta']  = 'X';
              }else{
              	field[met]['delta']  = '';
              }
              if(field[met]['balanced']){
              	field[met]['balanced']  = 'X';
                }else{
              	  field[met]['balanced']  = '';
                }
            }
            else if (met == 'defaultValue'){
          	  if(field['required'] == false && (field['typeAndFormat'] == 'Text' || field['typeAndFormat'] == 'DateTime') )
          		  delete field[met];
            }
          }
  }
	   return field;
 },	
 /****/
 A.prototype.getSettings = function(gridConfigJson ,gridsData ){
	 var oControl = this;
     var assumptionsData = [], 
         variablesData = [],
         settingsData = [],
         convertedAssumption = [],
         convertedMetrics = [],
         asmpObj = {};
     
 	var assumptionsDef = gridConfigJson.gridDefinitions.filter(function(r){if(r.gridType=='Assumptions') return r;});
	if(assumptionsDef.length>0){
		convertedAssumption = [];
		assumptionsDef.forEach(function(obj){
		asmpObj = {},convertedMetrics = [];
		if(gridsData){
			asmpObj = underscoreJS.find(gridsData,{name:obj.name});
			asmpObj['values'] = oControl.prepareMatrixRowsString(asmpObj['values']);						   
		}					
		asmpObj['name'] = obj['name'];											
		obj.fields.forEach(function (obj) {					         				        
              oControl.convertIGridFields(obj);
                    convertedMetrics.push(obj);
          });
		asmpObj['fields'] = convertedMetrics;	
		var gridDefObj = underscoreJS.find(oControl.gridConfig.gridDefs,{gridType : obj.gridType,name:obj.name});
		asmpObj['description'] = gridDefObj['description'];
		var asmp = oControl.convertNotation(asmpObj, oControl.gridConfig.cons.camelToUnderscored);
		asmp = oControl.convertNotation(asmp, oControl.gridConfig.cons.toUpper);
		convertedAssumption.push(asmp);
	});
	assumptionsData = underscoreJS.extend([], convertedAssumption);
	}
	
	if (gridConfigJson['variables']) {
		variablesData = gridConfigJson['variables'];				
	var convertedVariables = [];
	variablesData.forEach(function(obj) {
		if (obj['required'] === true) {
			obj['required'] = 'X';
		} else {
			obj['required'] = '';
		}
		var varb = oControl.convertNotation(obj, oControl.gridConfig.cons.camelToUnderscored);
		varb = oControl.convertNotation(varb, oControl.gridConfig.cons.toUpper);
		convertedVariables.push(varb);
	});
	variablesData = underscoreJS.extend([], convertedVariables);
    }
         
          return {
        	'ACTIVEGRID' : gridConfigJson.activeGrid,
  		    'ASSUMPTIONS': assumptionsData,
			'VARIABLES'  : variablesData,
			"PROC_PARAMS" : oControl.procedureParams || [],
          }
 	}, 
 	 A.prototype.getGridVariantUISettings =  function(gridConfigJson) {
 		var oControl = this,
 		visible,
 		gridSettings = {},
 		metricsData = [],
 		convertedMetrics = [],
 		proceduresData = [];
        convertedProcedures = [],
    	settingsData = [],
        convertedSettings = [],
        variablesData = [],
        convertedVariables = [],
        convertedModalProperties = {},
        filtersData = [],
        convertedFilter = [],
        convertedFilters = {},
        gridsVConfig = [],
        gridDefinitions = [];
 		
        
        gridDefinitions = gridConfigJson.gridDefinitions;
 		for(var i in gridDefinitions){
 			gridVarntConfig = {};
            gridSettings = gridDefinitions[i];
 			
           if (gridSettings['fields']) {
 				
        	    convertedMetrics = [];
 				metricsData = gridSettings['fields'];			
 				metricsData.forEach(function (obj) {
 					
 				
 					if (obj['textTemplate'] != undefined && obj['textTemplate']['__type'] == "Ranges" && obj['textTemplate']['ranges']!= undefined){
 						
 					     length = obj['textTemplate']['ranges'].length;
 						if ( obj['textTemplate']['ranges'][0].from == undefined ) obj['textTemplate']['ranges'][0].from = "-999999999.999999999";
 						if ( obj['textTemplate']['ranges'][length-1].to == undefined ) obj['textTemplate']['ranges'][length-1].to = "999999999.999999999";
 					}

 					if (obj['graphicTemplate'] != undefined && obj['graphicTemplate']['ranges']!= undefined ){
 						
 					     length = obj['graphicTemplate']['ranges'].length;
 						if ( obj['graphicTemplate']['ranges'][0].from == undefined ) obj['graphicTemplate']['ranges'][0].from = "-999999999.999999999";
 						if ( obj['graphicTemplate']['ranges'][length-1].to == undefined ) obj['graphicTemplate']['ranges'][length-1].to = "999999999.999999999";
 					}
 					
 		                  metric = oControl.convertNotation(oControl.convertIGridFields(obj) ,oControl.gridConfig.cons.camelToUnderscored);
 		                  metric = oControl.convertNotation(metric,oControl.gridConfig.cons.toUpper);
 		                       convertedMetrics.push(metric);
 		          });
 				metricsData = underscoreJS.extend([], convertedMetrics);
 			}
           
           if (gridSettings['procedures']) {
               proceduresData = gridSettings['procedures'];
               convertedProcedures = [];
               proceduresData.forEach(function(obj) {
               	  for (var prop in obj) {
                         if (obj[prop] === true) {
                             obj[prop] = 'X';
                         } else if (obj[prop] === false) {
                             obj[prop] = '';
                         }
                     }
               	     var proc = oControl.convertNotation(obj, oControl.gridConfig.cons.camelToUnderscored);
                        proc = oControl.convertNotation(proc, oControl.gridConfig.cons.toUpper); 
               	  convertedProcedures.push(proc);
                 });
               proceduresData = underscoreJS.extend([], convertedProcedures);
           }
           
           
           if (gridSettings['filters']) {
               filtersData = gridSettings['filters']['conditions'];
               convertedFilter = [];
               filtersData.forEach(function(obj) {
                   if (obj['value']) {
                       if (typeof obj['value'] != "string") {
                           obj['value'] = JSON.stringify(obj['value']);
                       }
                   }
                   var filter = oControl.convertNotation(obj, oControl.gridConfig.cons.camelToUnderscored);
                   filter = oControl.convertNotation(filter, oControl.gridConfig.cons.toUpper);
                   convertedFilter.push(filter);
               });
               filtersData = underscoreJS.extend([], convertedFilter);
               convertedFilters = {
                   'CONDITIONS': filtersData,
                   'FORMULAS': gridSettings['filters']['formulas'] || []
               };
           }
           if (gridSettings['modalProperties']) {
        	   var modalData = gridSettings['modalProperties'];
        	   convertedModalProperties = {};
        	    var modalProp = oControl.convertNotation(modalData, oControl.gridConfig.cons.camelToUnderscored);
        	    modalProp = oControl.convertNotation(modalProp, oControl.gridConfig.cons.toUpper);        	   
           }
           convertedModalProperties = underscoreJS.extend({}, modalProp);
           
           visible = gridSettings.visible;
           if(gridSettings.visible == true)
        	  visible = 'X';
           if(gridSettings.visible == false)
         	  visible = '';
           
           gridVarntConfig = {
        	   "NAME" :  gridSettings.name,
        	   'VISIBLE' : visible,
        	   'FIELDS' : convertedMetrics,
        	   "FILTERS" : convertedFilters,
        	   'STATUSBARPLUGINS' : gridSettings.statusBarPlugins,
        	   'ROWTEXTSUMMARY' : gridSettings.rowTextSummary,
        	   'FREEZEPANESROWSUMMARY' : gridSettings.freezePanesRowSummary,
        	   'MODALPROPERTIES': convertedModalProperties,
        	   'PROCEDURES' : convertedProcedures
           }
 			
           gridsVConfig.push(gridVarntConfig);
 		}
 		
        if (gridConfigJson['settings']) {
           	settingsData = gridConfigJson['settings'];
               convertedSettings = [];
               
               settingsData.forEach(function(obj) {
                   for (var prop in obj) {
                       if (obj[prop] === true) {
                           obj[prop] = 'X';
                       } else if (obj[prop] === false) {
                           obj[prop] = '';
                       }
                   }
                   var setting = oControl.convertNotation(obj, oControl.gridConfig.cons.camelToUnderscored);
                   setting = oControl.convertNotation(setting, oControl.gridConfig.cons.toUpper);
                   convertedSettings.push(setting);
               });
               settingsData = underscoreJS.extend([], convertedSettings);
           }
           
           
           if (gridConfigJson['variables']) {
               variablesData = gridConfigJson['variables'];
               convertedVariables = [];
               variablesData.forEach(function(obj) {
                   for (var prop in obj) {
                       if (obj[prop] === true) {
                           obj[prop] = 'X';
                       } else if (obj[prop] === false) {
                           obj[prop] = '';
                       }
                   }
                   var varb = oControl.convertNotation(obj, oControl.gridConfig.cons.camelToUnderscored);
                   varb = oControl.convertNotation(varb, oControl.gridConfig.cons.toUpper);
                   convertedVariables.push(varb);
               });
               variablesData = underscoreJS.extend([], convertedVariables);
           }
           
           oControl.gridVariantSettingsObj = {
        		   'ACTIVEGRID' : gridConfigJson.activeGrid,
        		   'GRIDSCONFIG': gridsVConfig,
        		   'VARIABLES'  : convertedVariables,
        		   'SETTINGS'   : convertedSettings,        		   
           }	
 	},
 	
 	 A.prototype.getGridUISettings = function(gridsData,gridConfigJson) {
 		var oControl = this,
 		    convertedMetrics = [],
 		    metricsData = [],
 		    length,
 		    metric,
 		    convertedvRules = {},
 		    validnrulesData = [],
 		    gridDefs = [],
 		    gridsCfg = [],
 		    convertedFilter = [],
            convertedFilters = {},
            filtersData = [],
 		    chartsData = [],
 		    gridConfig = {};
 		
 		gridDefs  = underscoreJS.where(gridConfigJson.gridDefinitions, {
	         gridType: inGrid.GridType[2]
	     }); 
 		
 		for(var i in gridDefs){
 			gridConfig = {};chartsData = []; 
 			var gridSettings = gridDefs[i];
 			
 			if (gridSettings['fields']) {
 				
 				convertedMetrics = [];
 				metricsData = gridSettings['fields'];			
 				metricsData.forEach(function (obj) {
 					
 				
 					if (obj['textTemplate'] != undefined && obj['textTemplate']['__type'] == "Ranges" && obj['textTemplate']['ranges']!= undefined){
 						
 					     length = obj['textTemplate']['ranges'].length;
 						if ( obj['textTemplate']['ranges'][0].from == undefined ) obj['textTemplate']['ranges'][0].from = "-999999999.999999999";
 						if ( obj['textTemplate']['ranges'][length-1].to == undefined ) obj['textTemplate']['ranges'][length-1].to = "999999999.999999999";
 					}

 					if (obj['graphicTemplate'] != undefined && obj['graphicTemplate']['ranges']!= undefined ){
 						
 					     length = obj['graphicTemplate']['ranges'].length;
 						if ( obj['graphicTemplate']['ranges'][0].from == undefined ) obj['graphicTemplate']['ranges'][0].from = "-999999999.999999999";
 						if ( obj['graphicTemplate']['ranges'][length-1].to == undefined ) obj['graphicTemplate']['ranges'][length-1].to = "999999999.999999999";
 					}
 					
 		                  metric = oControl.convertNotation(oControl.convertIGridFields(obj) ,oControl.gridConfig.cons.camelToUnderscored);
 		                  metric = oControl.convertNotation(metric,oControl.gridConfig.cons.toUpper);
 		                       convertedMetrics.push(metric);
 		          });
 				metricsData = underscoreJS.extend([], convertedMetrics);
 			}
 			

 			if (gridSettings['validationRules']) {
 				convertedvRules = {};
 				validnrulesData = gridSettings['validationRules'];			
 				validnrulesData.forEach(function(obj) {
 					if (obj['required'] === false) {
 						obj['required'] = '';
 					} else {
 						obj['required'] = 'X';
 					}
 					if (obj['autorun'] === false) {
 						obj['autorun'] = '';
 					} else {
 						obj['autorun'] = 'X';
 					}
 				});
 				convertedvRules = oControl.convertNotation(validnrulesData, oControl.gridConfig.cons.camelToUnderscored);
 				convertedvRules = oControl.convertNotation(validnrulesData, oControl.gridConfig.cons.toUpper);

 				validnrulesData = underscoreJS.extend({}, convertedvRules);

 			};
 			 //Summaries 
 		    var convertedSummaries = [];

 		    var summariesData = underscoreJS.where(gridConfigJson.gridDefinitions, {
 		    	gridType: inGrid.GridType[1] , parent : gridSettings['name']
 		    })
 		  
 		    if (summariesData) {  
 		    	summariesData.forEach(function(obj) {
 		            for (var prop in obj) {
 		                if (obj[prop] === true) {
 		                    obj[prop] = 'X';
 		                } else if (obj[prop] === false) {
 		                    obj[prop] = '';
 		                }
 		            }
 		            if (obj['fields']) {
 		                var summaryFields = obj['fields'] || [];
 		                var tmpFlds = [];
 		                summaryFields.forEach(function(obj) {
 		                    tmpFlds.push(oControl.convertIGridFields(obj));
 		                });
 		                obj['fields'] = tmpFlds;
 		            }
 		            var summarycharts = underscoreJS.where(gridConfigJson['chartDefinitions'], {
 		 	 		     dataSourceName : obj['id']
 		 	 		    });
 		           chartsData.push(summarycharts);
 		          if (obj['parentDataFilters']) {                             
                  	obj['parentDataFilters']['conditions'].forEach(function(obj) {
                          if (obj['value']) {
                              if (typeof obj['value'] != "string") {
                                  obj['value'] = JSON.stringify(obj['value']);
                              }
                          }
                      });
                  }
 		            var summary = oControl.convertNotation(obj, oControl.gridConfig.cons.camelToUnderscored);
 		            summary = oControl.convertNotation(summary, oControl.gridConfig.cons.toUpper);
 		            convertedSummaries.push(summary);

 		        });
 		    	summariesData = underscoreJS.extend([], convertedSummaries);
 		    }
 		    
 	       if (chartsData.length>0) {
           var convertedChartDefinitions = [];
           chartsData.forEach(function(obj){
           	  var chart = oControl.convertNotation(obj, oControl.gridConfig.cons.camelToUnderscored);
                 chart = oControl.convertNotation(chart, oControl.gridConfig.cons.toUpper);
                 convertedChartDefinitions.push(chart);
           });        
			chartsData = underscoreJS.extend([], convertedChartDefinitions);			
		}
 	       
           if (gridSettings['filters']) {
               filtersData = gridSettings['filters']['conditions'];
               convertedFilter = [];
               filtersData.forEach(function(obj) {
                   if (obj['value']) {
                       if (typeof obj['value'] != "string") {
                           obj['value'] = JSON.stringify(obj['value']);
                       }
                   }
                   var filter = oControl.convertNotation(obj, oControl.gridConfig.cons.camelToUnderscored);
                   filter = oControl.convertNotation(filter, oControl.gridConfig.cons.toUpper);
                   convertedFilter.push(filter);
               });
               filtersData = underscoreJS.extend([], convertedFilter);
               convertedFilters = {
                   'CONDITIONS': filtersData,
                   'FORMULAS': gridSettings['filters']['formulas'] || []
               };
           }  
 	         
 	  	var statusIndex = underscoreJS.findIndex(gridSettings.fields,{role: 'RowStatus'});
		var changedData = underscoreJS.find(gridsData,{name: gridSettings.name});
	    changedData = changedData.values.filter(function(r){						
								if (r[statusIndex] != inGrid.ObjectStatus.NotModified && r[statusIndex] != inGrid.ObjectStatus.Readonly ) return r;
		}); 
 			
 			gridConfig = {
 				"ID"   : gridSettings['id'],	
 				"NAME" : gridSettings['name'],
 				"FIELDS" : metricsData,
 				'FILTERS' : convertedFilters,
 				'VALIDATIONRULES' : validnrulesData,
 				"COMMENTS" : oControl.getGridComments( gridSettings.name) || [],
				"MATRIX_DATA" : oControl.prepareMatrixRowsString(changedData),
				"SCALES" : oControl.getGridScales( gridSettings.name) || {},
 				'SUMMARIES' : convertedSummaries,
 				'CHART_DEFINITIONS':convertedChartDefinitions
 			}
 			gridsCfg.push(gridConfig);
 		}
 		return gridsCfg;
		},
        A.prototype.getChangedData = function(){	
    	
         if (!this.fromDictUpd && !this.fromSnapshots) {
  			var oControl = this,
  			    dataPath,
  			    model,
  			    mainModel,
  			    gData,
  			    data,
  			    appContext,
  			    dataPromise,
  			    validationError,
  			    count = 0,
  			    params = [],
  			    gridData = [],
  			    gridDefCfg = [],
  			    validationParams = {};
  			
  			mainModel = oControl.getProperty("controller").getModel(global.vui5.modelName);
  			if(mainModel.getProperty("/DOCUMENT_MODE") != global.vui5.cons.mode.display)
  			{
  				model = oControl.getProperty("controller").getModel(oControl.getProperty("modelName"));
  				dataPath = oControl.getProperty("iGridDataPath");
  				gData = model.getProperty(dataPath) || [];
  				if (gData.length) {
  					gridData = $.extend({}, gData[0]);
  					if(gridData){
  						appContext = mainModel.getProperty("/APPCTX");
  						if(appContext['OBJTP'] == "/IRM/IPPD" && appContext['APPLN'] == "1" ){
  							if (oControl.gridConfig.gridAPI) {
  								 deferred = $.Deferred();
  		                            var promise = oControl.gridConfig.gridAPI.getConfigJSON();
  		                            if (promise) {
  		                                promise.then(function(response) {
  		                                    
  		                                    response = oControl.convertNotation(response, oControl.gridConfig.cons.camelToUnderscored);
  		                                    response = oControl.convertNotation(response, oControl.gridConfig.cons.toUpper);		                                    
  		                                    
  		                                    if (response.hasOwnProperty('DICTIONARIES')) {
  		                                        delete response['DICTIONARIES'];
  		                                    }
  		                                    
  		                                    if (response.hasOwnProperty('DICTIONARY_GROUPS')) {
  		                                        delete response['DICTIONARY_GROUPS'];
  		                                    }
  		                                    
  		                                    response['GRID_DEFINITIONS'].forEach(function (gridDef){
  		                                    	gridDef['FIELDS'].forEach(function (obj) {
  		                							if (obj['TEXT_TEMPLATE'] != undefined && obj['TEXT_TEMPLATE']['__TYPE'] == "Ranges" && obj['TEXT_TEMPLATE']['RANGES']!= undefined){
  		                								
  		                							     var length = obj['TEXT_TEMPLATE']['RANGES'].length;
  		                								if ( obj['TEXT_TEMPLATE']['RANGES'][0].FROM == undefined ) obj['TEXT_TEMPLATE']['RANGES'][0].FROM = "-999999999.999999999";
  		                								if ( obj['TEXT_TEMPLATE']['RANGES'][length-1].TO == undefined ) obj['TEXT_TEMPLATE']['RANGES'][length-1].TO = "999999999.999999999";
  		                							}
  		                							if (obj['GRAPHIC_TEMPLATE'] != undefined && obj['GRAPHIC_TEMPLATE']['RANGES']!= undefined ){
  		                								
  		                							     var length = obj['GRAPHIC_TEMPLATE']['RANGES'].length;
  		                								if ( obj['GRAPHIC_TEMPLATE']['RANGES'][0].FROM == undefined ) obj['GRAPHIC_TEMPLATE']['RANGES'][0].FROM = "-999999999.999999999";
  		                								if ( obj['GRAPHIC_TEMPLATE']['RANGES'][length-1].TO == undefined ) obj['GRAPHIC_TEMPLATE']['RANGES'][length-1].TO = "999999999.999999999";
  		                							}
  		                				             
  		                				          });
  		                                    	/**ESP7 QA# 12785 Summaries which are configured with Filters are not getting saved to Hybrid Configuration Fiori **/
  		                                        if (gridDef.hasOwnProperty('PARENT_DATA_FILTERS')) {
  				                                        delete gridDef['PARENT_DATA_FILTERS'];
  				                                    }
  		                                        /****/
  		                                    });
  		                                    var data = {
  		                                        "CONFIG": response
  		                                    };
  		                                    deferred.resolve(response);
  		                                });
  		                                return deferred.promise();
  		                            }
  							     }
  						      }			
  						else{
  							 if (gridData['IGRID_METADATA'].length) {			
  								if (oControl.gridConfig.gridAPI) {		
  								   gridsData = oControl.gridConfig.gridAPI.getData() || [];				
  									if(gridsData.length){
  										deferred = $.Deferred();
  											
  											 dataPromise = oControl.gridConfig.gridAPI.getConfigJSON();

  												 dataPromise.then(function(response){
  													 var freeText_val = [];
			                                            freeText_val = oControl.gridConfig.gridAPI.getStrings();
			                                            if(freeText_val){
			                                            	gridsData.forEach(function(grid){
			                                            		var currentGridDef = underscoreJS.find(response.gridDefinitions , {name : grid.name});
			                                            		if(currentGridDef){
			                                            			grid["values"].forEach(function(data){
			                                            				currentGridDef['fields'].forEach(function(flds,index){
			                                                    			if(flds.typeAndFormat === 'FreeText'){
			                                                    				var val = data[index];
			                                                    				data[index] = freeText_val[val];
			                                                    			}
			                                                    		})
			                                                    	})
			                                            		}
			                                            	})
			                                            	
			                                            }	 
  											     oControl.changedGridData = oControl.getSettings(response,gridsData);
  												 oControl.changedGridData['GRID_ENVT'] = oControl.getGridUISettings(gridsData,response)	;
  												 oControl.getGridVariantUISettings(response);
  												 
  											     gridDefinitions  = underscoreJS.where(response.gridDefinitions, {
  											         gridType: inGrid.GridType[2]
  											     });	
  											     
  											 
  											    for (var i in gridDefinitions) {
  											    					   validationPromise = oControl.gridConfig.gridAPI.getValidationResult(gridDefinitions[i].name)|| [];	
  											    					   	 if(validationPromise){
  											    					   		   count++;
  																				validationPromise.then(function(response){
  																					count--;
  																                var	 validationIndex = underscoreJS.findIndex(response, {
  															                         severity  : inGrid.Enums.SeverityLevel.Error
  															                     }); 
  																					if (validationIndex!= -1) {
  																						validationParams['NAME'] = 'VALR_ERROR';
  																						validationParams['VALUE'] = 'X'; 
  																						count = 0;
  																					}
  																					else{
  																						validationParams['NAME'] = 'VALR_ERROR';
  																						validationParams['VALUE'] = ''; 
  																					}
  																				    if(count == 0){
  																				    	oControl.changedGridData['PARAMS'] = validationParams;
  																						deferred.resolve(oControl.changedGridData);
  																				    }
  																				});
  													                        }
  											    					   	 
//  											    					    				
  											                         }		
  											      
  												 });
  												
  											 return deferred.promise();
  									   }
  								      }
  							       }
  								}
  						       }
  						      }
  						    }
  			else{
  				if (oControl.gridConfig.gridAPI) {		
  					   gridsData = oControl.gridConfig.gridAPI.getData() || [];				
  						if(gridsData.length){
  							deferred = $.Deferred();
  			           	    dataPromise = oControl.gridConfig.gridAPI.getConfigJSON();
  				            dataPromise.then(function(response){
  				            	 oControl.getGridVariantUISettings(response);
  				            	 gridDefinitions  = underscoreJS.where(response.gridDefinitions, {
  							         gridType: inGrid.GridType[2]
  							     });    
  							    for (var i in gridDefinitions) {							    	
  								var gridConfig = {};													
  							    var comments = oControl.getGridComments(gridDefinitions[i].name) || [];
  							    gridConfig = {'NAME' : gridDefinitions[i].name,
  							    		      'COMMENTS' : comments}
  							    gridDefCfg.push(gridConfig);									
  							    }
  					         
  					           deferred.resolve(gridDefCfg);	 					 
  				         });
  				   }
  				}
  				 return deferred.promise();	 
  			}
  	
  	 }
  	 else{
  		 if(this.fromSnapshots){
       		return this.snapshotsObject;
       	}
       	else{
       		 return this.newDictionaries;
       	}
  	 }
  	 };
	 /****/
	A.prototype.disposeIGrid = function() {
		var oControl = this;
		var oController = oControl.getProperty("controller");
		   
		/**ESP6 Task# 31147 - Grid Integration**/		
		/*if (oControl.gridConfig.gridVM) {
			oControl.gridConfig.gridVM.destroy();
			oControl.gridConfig.gridVM = "";
			console.log("Grid disposed...");
		}*/
//		if (oControl.gridConfig.gridAPI) {
//			oControl.gridConfig.gridAPI.destroy();
//			oControl.gridConfig.gridAPI = "";
//			oController.gAPI = "";
//			console.log("Grid disposed...");
//
//		}
//		else{
//			if(oController.gAPI){
//				oController.gAPI.destroy();
//				oController.gAPI = "";
//				console.log("Grid disposed...");
//			}
//		}
			  if (oControl.gridConfig.gridAPI) {
	        	if(oControl.gridConfig.gridAPI.isDestroyed)
	            { oControl.gridConfig.gridAPI = "";
	          }
	        	else{
	        		oControl.gridConfig.gridAPI.destroy();
	        		 oControl.gridConfig.gridAPI = "";
	                 console.log("Grid disposed...");
	        	}
	        }
	        	if(oController.gAPI){
	            	if(oController.gAPI.isDestroyed)
	                    {oController.gAPI = "";}
	                	else{
	                		oController.gAPI.destroy();
	                		oController.gAPI = "";
	                        console.log("Grid disposed...");
	                	}
	        	}

		/****/		
	};
	A.prototype.convertNotation = function(object, type) {
		var oControl = this;
		var result = {};
		Object.keys(object).forEach(function(k) {
			var newKey = k;
			switch (type) {
			case oControl.gridConfig.cons.toLower:
				newKey = k.toLowerCase();
				break;
			case oControl.gridConfig.cons.toUpper:
				newKey = k.toUpperCase();
				break;
			case oControl.gridConfig.cons.underscoredToCamel:
				newKey = k.replace(/(\_[a-z])/g, function(str) {
					return str.substring(1).toUpperCase();
				});
				break;
			case oControl.gridConfig.cons.camelToUnderscored:
				newKey = k.replace(/([A-Z])/g, "\_$1").replace(/([A-Z])/g, function(str) {
					return str.toLowerCase();
				});
				break;
			}
			if (newKey === "_Type") {
				newKey = "__type";
			}
			var keyValue = object[k];
			/**ESP6 TASK#36021 - Hybrid Configuration in Pricing**/
			if(typeof keyValue === "boolean"){
				if(keyValue){
					keyValue = "X";
				}else{
					keyValue = "";
				}
			}
			/****/
			if (typeof keyValue !== "object") {
				result[newKey] = keyValue;
			} else if (keyValue !== null) {
				var isArray = (object[k].constructor != null) && (object[k].constructor == Array);
				if (isArray) {
					result[newKey] = [];
					object[k].forEach(function(item) {
						if (typeof item === "object") {
							result[newKey].push(oControl.convertNotation(item, type));
						} else {
							result[newKey].push(item);
						}
					});
				} else {
					result[newKey] = oControl.convertNotation(keyValue, type);
				}
			}
		});
		return result;
	};
	 /** Rel SP7 - Cursor Position Changes Start**/
	A.prototype.setCursrPosition = function(setCursorPosition){
		var oControl = this;
		if(setCursorPosition){
			oControl.cursorPosition = oControl.gridConfig.gridAPI.getCursorPosition();
		}
		else{
			if(oControl.cursorPosition!== undefined){
				oControl.cursorPosition = {};
			}
		
		}

	};
	/****/
    A.prototype.getGridVariantsData = function(){
    	var oControl = this;
    	if( oControl.fromSaveVariant){
    		oControl._variantData = {"VARIANTS": oControl.saveData,
    				                 "LAYOUT" : {
    				                	 "DATA":  oControl.gridVariantSettingsObj  
    				                 }
    				}
    		 oControl.fromSaveVariant = false;
    		
    	}
    
    		return oControl._variantData;
    	
    		
    };
    A.prototype.getGridSettingsData = function(){
     	if(!this.fromVariant&& !this.fromSaveVariant){
        	return this.gridVariantSettingsObj;  
    	}
       else{
    	   this.fromVariant = false;
            return ;		
        }     
    };
	return A;
}, true);