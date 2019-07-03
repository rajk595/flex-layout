jQuery.sap.includeStyleSheet("//maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css");
jQuery.sap.includeStyleSheet(vistexConfig.vzuiResourcePath + "/" + vistexConfig.vuiGridLibraryVersion + "/" + vistexConfig.vzrootFolder + "/ui/widgets/VuiGrid/dist/grid-native.css");
sap.ui.define([ "sap/ui/core/Control",
                vistexConfig.rootFolder + "/ui/core/commonUtils",
                vistexConfig.rootFolder + "/ui/core/global",
                "sap/ui/comp/variants/VariantItem",
                vistexConfig.rootFolder + "/ui/core/Formatter",
                "./dist/grid.one",
                "./dist/grid.one.poly",
                "./dist/webcomponents-poly"],
        function(control, commonUtils,global,VariantItem,Formatter) {
          var G = control.extend(vistexConfig.rootFolder + ".ui.widgets.VuiGrid.VuiGrid", {
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
                    dataPath : {
                      type: "string",
                      defaultValue: null
                    },
                    title:{
                    	type: "string",
                        defaultValue: null
                    },
                    sectionID: {
                        type: "string",
                        defaultValue: null
                    },
                    fieldPath : {
                        type: "string",
                        defaultValue: null
                    },
                    enableLocalSearch: {
                        type: "boolean",
                        defaultValue: false
                    },
                    handle: {
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
                    fullScreen: {
                        type: "boolean",
                        defaultValue: false
                    },
                    enablePersonalization: {
                        type: "boolean",
                        defaultValue: true
                    },
                    dataAreaPath:{
                    	type: "string",
                        defaultValue: null
                    },
                    hideVariantSave: {
                        type: "boolean",
                        defaultValue: false
                    },
                    hideShare: {
                        type: "boolean",
                    },
                    /*Export Button - Start*/
                    disableExcelExport: {
                        type: "boolean",
                        defaultValue: true
                    }
                    /*Export Button - End*/
                    
                  },
                  events : {
                	  onDetailButton: {},
                	  variantSave: {},
                      variantSelect: {},
                      layoutManage: {},
                      pageChange: {},
                      onFullScreen: {},
                      onModeChange: {},
                      onExport: {},
                      onFieldClick: {},
                  },
                  aggregations : {
                    _vuiGrid : {
                      type : "sap.ui.core.Control",
                      multiple : false,
                      visibility : "hidden"
                    },
                    _toolbar : {
                        type : "sap.ui.core.Control",
                        multiple : false,
                        visibility : "hidden"
                      }
                  }
                },
                renderer : function(oRM, oControl) {
                  oRM.write("<div");
                  oRM.writeControlData(oControl);
                  oRM.write(">");
                  oRM.renderControl(oControl.getAggregation("_toolbar"));
                  oRM.renderControl(oControl.getAggregation("_vuiGrid"));
                  oRM.write("</div>");
                }
          });
          G.prototype.setModelName = function(value) {
              this.setProperty("modelName", value, true);
            };
            G.prototype.setDataPath = function(value) {
                this.setProperty("dataPath",value,true);
            };
            G.prototype.setSectionID = function(value){
          	  this.setProperty("sectionID",value,true);
            };
            G.prototype.setHandle = function(value){
            	this.setProperty("handle",value,true);
            	this.showSeparator();
            };
            G.prototype.setVariantDataPath = function(value){
            	  this.setProperty("variantDataPath",value,true);
            };
            G.prototype.setLayoutDataPath = function(value){
          	  this.setProperty("layoutDataPath",value,true);
            };
            G.prototype.setDataAreaPath = function(value){
            	  this.setProperty("dataAreaPath",value,true);
              };
            G.prototype.setEnableLocalSearch = function (value) {
                this.setProperty("enableLocalSearch", value, true);
                this._oSearchField.setVisible(value);
            };
            G.prototype.setEnableLocalSearch = function (value) {
                this.setProperty("enableLocalSearch", value, true);
                this._oSearchField.setVisible(value);
            }
            G.prototype.setSelectedVariant = function(value){
            	  this.setProperty("selectedVariant",value,true);
             };
            G.prototype.getVariantModified = function () {
                 return this._oVariants.currentVariantGetModified();
             };

            G.prototype.setVariantModified = function (value) {
                 this._oVariants.currentVariantSetModified(value);
             };
            G.prototype.setHideVariantSave = function (value) {
                 this.setProperty("hideVariantSave", value, true);
             };
            G.prototype.setHideShare = function (value) {
                 this.setProperty("hideShare", value, true);
             };
            G.prototype.setEnablePersonalization = function (value) {
                this.setProperty("enablePersonalization", value, true);
                if (this._oPersonalizationButton) {
                    this._oPersonalizationButton.setVisible(value);
                }
            };
            G.prototype.setFullScreen = function (value) {
                this.setProperty("fullScreen", value, true);
                if (this._fullScreenButton) {
                    this._fullScreenButton.setVisible(value);
                }
            };
            G.prototype.showSeparator = function () {
                var handle = this.getHandle();
                if (handle) {
                    this._oVuiSeparator.setVisible(true);
                } else {
                    this._oVuiSeparator.setVisible(false);
                }
                if (this.getHideVariantSave()) {
                    this._oVuiSeparator.setVisible(false);

                }
            };
            G.prototype.applyOnDemandPersonalization = function () {
                var oControl = this;
                if (!oControl._PersonalizationDialog) {
                    oControl.createPersonalizationDialog();
                    oControl.addGroupPanelItem(oControl._PersonalizationDialog);
                }
                var layoutData = oControl.getModel(oControl.getModelName()).getProperty(oControl.getLayoutDataPath());

                if (underscoreJS.isEmpty(layoutData['COLITEMS'])) {
                    oControl.handleReset();
                    oControl.fillPersonalizationItems();
                    oControl._applyPersonalization(oControl._columnItems);
                    return;
                }
                oControl._columnItems = layoutData['COLITEMS'];
                oControl._sortItems = layoutData['SORTITEMS'];
                oControl._filterItems = layoutData['FILTERITEMS'];
                oControl._groupItems = layoutData['GRPITEMS'];
                if(oControl._aggrPanel)
                oControl._aggrPanel.getPanelContent();
                oControl.updatePersonalizationItems(true);

            };
            
            G.prototype.setDisableExcelExport = function (value) {
                this.setProperty("disableExcelExport", value, true);
                var excelExport = this._oExportButton;
                if (value && excelExport) {
                    this._oExportButton.setVisible(false);
                }
                else {
                    this._oExportButton.setVisible(true);
                }
            };
            G.prototype.init = function(){
              this._oBundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.widgets.VuiGrid");
          	  this._oPersonalizationButton = new sap.m.OverflowToolbarButton({
                    type: sap.m.ButtonType.Transparent,
                    icon: "sap-icon://action-settings",
                    text: this._oBundle.getText("Personalization"),
                    tooltip: this._oBundle.getText("Personalization"),
                    enabled: true,
                    iconFirst: true,
                    activeIcon: "",
                    iconDensityAware: true,
                    textDirection: "Inherit",
                    press: this._onSettingPressed.bind(this),
                    layoutData: new sap.m.OverflowToolbarLayoutData({
                        priority: sap.m.OverflowToolbarPriority.High
                    }),
                    visible: true
                   });

          	 this._oSearchField = new sap.m.SearchField({            
            	width: "20%",
                search: this._onFilterTable.bind(this),
                visible: this.getEnableLocalSearch(),
                layoutData: new sap.m.OverflowToolbarLayoutData({
                    priority: sap.m.OverflowToolbarPriority.High
                })
             });
          	
		     this._oSearchField = new sap.m.SearchField({            
					width: "20%",
				    search: this._onFilterTable.bind(this),
				    visible: this.getEnableLocalSearch(),
				    layoutData: new sap.m.OverflowToolbarLayoutData({
				        priority: sap.m.OverflowToolbarPriority.High
				    })
			  });
          	
          	 this._modeButton = new sap.m.OverflowToolbarButton({
                type: sap.m.ButtonType.Transparent,
                text: "",
                tooltip:"",
                enabled: true,
                //iconFirst: true,
                activeIcon: "",
                iconDensityAware: true,
                textDirection: "Inherit",
                press: this._onModeChange.bind(this),
                layoutData: new sap.m.OverflowToolbarLayoutData({
                    priority: sap.m.OverflowToolbarPriority.Low
                }),
                visible: true
               });
        	  
        	  
          	  /*Export Button - Start*/
				this._oExportButton = new sap.m.OverflowToolbarButton({
				    type: sap.m.ButtonType.Transparent,
				    icon: "sap-icon://excel-attachment",
				    text: this._oBundle.getText("Export"),
				    tooltip: this._oBundle.getText("Export"),
				    press: this._ExportPress.bind(this),
				    layoutData: new sap.m.OverflowToolbarLayoutData({
				    	priority: sap.m.OverflowToolbarPriority.Low
				    }),
				    visible: true
				    });
				
          	  /*Export Button - End*/
				
				this._fullScreenButton = new sap.m.OverflowToolbarButton({
		            type: sap.m.ButtonType.Transparent,
		            icon: {
		                path: global.vui5.modelName + ">" + "/FULLSCREEN",
		                formatter: function (fullScreen) {
		                    return fullScreen === true ? 'sap-icon://exit-full-screen' : 'sap-icon://full-screen';
		                },
		                mode: sap.ui.model.BindingMode.TwoWay
		            },
		            visible: true,
		            press: this.fullScreenDialog.bind(this)
		        });
				this._oVuiSeparator = new sap.m.ToolbarSeparator({
		            visible: true
		        });

				
				/*Filter Indicator - Start*/
				this._oVuiFilterSeparator = new sap.m.ToolbarSeparator({
		            visible: false
		        });
				
				this._oFilterTitle = new sap.m.Link({
		            visible: false,
		            press: this._onFilterLink.bind(this)
		        });
				/*Filter Indicator - End*/
				
          	  this.title = new sap.m.Title({
          		  text:""
          	  })
//          	  
          	
               
            };
            G.prototype.setTitle = function (value) {
                this.setProperty("title", value, true);
                this.title.setText(value);
            };
            G.prototype.fullScreenDialog = function (oEvent) {
                var source = oEvent.getSource();
                this.fireOnFullScreen({
                    "fullScreen": oEvent.getSource().getIcon() === 'sap-icon://full-screen'
                });

            };
            G.prototype._onModeChange = function(oEvent){
            	var oControl = this,params = {};
            	var buttonText = oEvent.getSource().getText();
            	  var data = oControl.getModel(oControl.getModelName()).getProperty(oControl.getDataPath());
            	
            	/**** compact mode ,condensed mode, grid treats compact as condensed and default as compact mode **/
            	if(buttonText == oControl._oBundle.getText("Compact")){
            		oControl._VuiGrid.api.view.theme.layout.set('default'); // applying compact mode
            		params['mode'] = 'compact';	
            		data['attributes']['mode'] =  'compact';
            		this._modeButton.setText(this._oBundle.getText("Condensed"));
	           	    this._modeButton.setTooltip(this._oBundle.getText("Condensed"));
	           		this._modeButton.setIcon("sap-icon://decrease-line-height");
           		 
	           	 }else{
	           		 oControl._VuiGrid.api.view.theme.layout.set('compact'); //  applying condensed mode
	           		 params['mode'] = 'condense';
	           		 data['attributes']['mode'] =  'condense';
	           		 this._modeButton.setText(this._oBundle.getText("Compact"));
	           		 this._modeButton.setTooltip(this._oBundle.getText("Compact"));
	           		 this._modeButton.setIcon("sap-icon://increase-line-height");
	           		 
	           	 }
            	var action = {
   						FNCNM: "MODECHANGE",
				     	RQTYP: "2"	
   				}
            	oControl.fireOnModeChange({
            		'urlParams': params,
            		'action': action
            		
                });
            	/***/
            };
            G.prototype.onVuiGridInfocusSet = function(){
          	  var oControl = this,oController,layoutData;
          	      oController = oControl.getController();
          	      layoutData = oController.getCurrentModel().getProperty(this.getLayoutDataPath());
          	      oControl._oExportButton.setVisible(oControl.getDisableExcelExport() ? false : true);
          	    oControl._applyElmtFeature = false
          	       if(!this._oVariants){
          	    	 oControl.prepareGridControls();
          	       }
//          	       if(fromLayoutManage){
//        	    	   oControl._fromLayoutManage = true;
//          	          // oControl._visited = false;
//          	       }
          	   /***on Default Variant***/
    	         if(layoutData && layoutData['COLITEMS'].length !==0 ){
    	        		 //&& !fromLayoutManage){
    	        		  oControl._fromLayoutManage = true;
    	        		  if (!oControl._PersonalizationDialog) {
    	                      oControl.createPersonalizationDialog();
    	                      oControl.addGroupPanelItem(this._PersonalizationDialog);
    	        		  }
    	        		  oControl._columnItems = [];
    	                      underscoreJS.each(layoutData['COLITEMS'], function (object) {
    	                    	  
    	                    	  oControl._columnItems.push({
    	                              'COLUMNKEY': object['COLUMNKEY'],
    	                              'INDEX': object['INDEX'],
    	                              'VISIBLE': object['VISIBLE'] === 'true' ? true : false
    	                          });
    	                      })
    	                      
    	                  }
    	        
    	        	
    	          	  oControl.prepareGrid();
            };
            
            G.prototype.prepareGridControls = function(){
          	  var oControl = this;
          	      oControl._initializeVariants();
          	  this._toolbar  = new sap.m.OverflowToolbar({
                	  content:[
                		  this.title,
                		  this._oVuiSeparator,
                		  //new sap.m.ToolbarSeparator(),
                		  this._oVariants,
                		  /*Filter Indicator-START*/
                          this._oVuiFilterSeparator,
                          this._oFilterTitle,
                          /*Filter Indicator-END*/
                		  new sap.m.ToolbarSpacer(),
                		  this._oSearchField,
                		  this._modeButton,
                		  this._oExportButton,
                		  this._oPersonalizationButton,
                		  this._fullScreenButton
                	  ]
                   });
                   this.setAggregation("_toolbar", this._toolbar);
            };
            G.prototype._initializeVariants = function () {
                var oControl = this;
                var modelName = this.getModelName();
                oController = oControl.getProperty("controller");
                this._oVariants = new sap.ui.comp.variants.VariantManagement({
                    enabled: true,
                    showShare: !oControl.getHideShare(),
                    save: oControl._onVariantSave.bind(oControl),
                    manage: oControl._onVariantManage.bind(oControl),
                    select: oControl._onVariantSelect.bind(oControl),
                    visible: oControl.getProperty("handle") !== ""
                });

                this._oVariants.bVariantItemMode = true;
                this._oVariants._setStandardText();

                /*Over Riding Tooltip*/

                this._oVariants.oVariantPopoverTrigger.setTooltip(oControl._oBundle.getText('SelectVariant'));
                /**/

                this._oVariants.bindAggregation("variantItems", modelName + ">" + this.getVariantDataPath(), function (sId, oContext) {
                    object = oContext.getObject();

                    if (object['DEFLT'] == "X") {
                        oControl._oVariants.setDefaultVariantKey(object['VARID']);
                    }
                    var item = new VariantItem({
                        text: object['DESCR'],
                        key: object['VARID'],
                        global: object['UNAME'] === "",
                        author: object['AENAM_TXT']
                    });
                    if (object['UNAME'] === "" && oControl.getHideShare()) {
                        item.setReadOnly(true);
                    }
                    oControl._oVariants.setInitialSelectionKey('');
                    return item;
                });

                this._oVariants.addEventDelegate({
                    onAfterRendering: function (e) {
                        var oControl = this;
                        var model = oControl.getModel(oControl.getModelName());
                        var selectedVariant = model.getProperty(oControl.getSelectedVariant());
                        jQuery.sap.delayedCall(300, this, function () {
                        	if (selectedVariant && ((e.srcControl.getInitialSelectionKey() === "") || (e.srcControl.getInitialSelectionKey() !== selectedVariant))) {
                                e.srcControl.setInitialSelectionKey(selectedVariant);
                                oControl._onVariantSelect1(true);
                            }
                            else {
                                oControl.applyElementFeature();
                            }
                        	 if (oControl.getHideVariantSave()) {
                                 oControl._oVariants.setVisible(false);
                             }
                        })
                    }
                }, this);
            };

            G.prototype.prepareGrid = function() {
              var oControl = this, params = {},metadataJSON,layoutData,personalizedFields,fields, fieldObj,oController = oControl.getController(),
              randomClass = 'VuiGridRandomClass';
                  metadataJSON = oControl.getModel(oControl.getModelName()).getProperty(oControl.getDataPath());
                  //title = oControl.getToolbarTitle();
                 // this.title.setText(title);
                  this.showSeparator();
                  if(oControl.getModel(global.vui5.modelName).getProperty("/FULLSCREEN")){
                	  randomClass += "FLSCR";
                  }
	               oControl.metadata = metadataJSON;
	              if(document.getElementsByClassName(randomClass).length !== 0){
	            	  var element = document.getElementsByClassName(randomClass)[0];
	            	    element.parentNode.removeChild(element);
	              }
	              oControl.randomClass = randomClass + Math.floor((Math.random() * 100) + 1) + '' + Math.floor((Math.random() * 100) + 1);
	             var oHtml = new sap.ui.core.HTML({
	                content : '<div  width= "100%" class="'+oControl.randomClass+  '"></div>;'
	              }).addEventDelegate({
	              	 onAfterRendering : function(e) {
	              		 if(document.getElementsByClassName(oControl.randomClass)[0].innerHTML === ""){
	              			 
	              			 var data,grid,metadata,metadataUrl,metadataBlob,rows=[],rowsUrl,dictionaries,
	              			     dictionariesUrl,dictionariesBlob,rowsBlob,attributes = {};
	              			     data = oControl.getModel(oControl.getModelName()).getProperty(oControl.getDataPath()) ;
	              			     oControl._gridData = data;
	              			     metadata =  Object.assign({},data); 
	              			     
	              			     if(metadata.attributes){
	              			    	 attributes = {
	              			    			 mode : metadata.attributes['mode'],
	              			    			 pagingType : metadata.attributes['pagingType'],
	              			    			 pageSize : metadata.attributes['pageSize']
	              			    	 }
	              			    	 oControl.attributes = attributes;
	              			    	 delete metadata.attributes;
	              			    	 if(oControl.attributes['mode'] == 'compact'){
			                      		 oControl._modeButton.setText(oControl._oBundle.getText("Condensed"));
			                      		 oControl._modeButton.setTooltip(oControl._oBundle.getText("Condensed"));
			                      		 oControl._modeButton.setIcon("sap-icon://decrease-line-height");
			                      		 
			                      	 }else{
			                      		oControl._modeButton.setText(oControl._oBundle.getText("Compact"));
			                      		oControl._modeButton.setIcon("sap-icon://increase-line-height");
			                      		oControl._modeButton.setTooltip(oControl._oBundle.getText("Compact"));
			                      	 }
	              			     }
		              			
	              			    if(metadata.rows){
		              				rows = metadata.rows;
	              		        	 metadata.rows = [];
	              		        	 rowsBlob= new Blob([JSON.stringify(rows)], {type : 'application/json'}); 
	  		              			 rowsUrl = URL.createObjectURL(rowsBlob);
	              		        	 
	              			      }
	              			     dictionaries = metadata.dictionaries;
	              			     dictionariesBlob =  new Blob([JSON.stringify(dictionaries)], {type : 'application/json'});
            		        	 delete metadata.dictionaries;
            		        	 dictionariesUrl = URL.createObjectURL(dictionariesBlob);
            		        	 
		              		     metadataBlob = new Blob([JSON.stringify(metadata)], {type : 'application/json'}); 
		              		     metadataUrl = URL.createObjectURL(metadataBlob);
		              		     // grid and its child div creation through js is not working as some functions are missing. so created through html***/
			     		         var gridWrapper = document.createElement('div');
			     		         if(oControl['attributes'] && oControl.attributes['pagingType'] == global.vui5.cons.pagingType.serverPaging){
			     		        	 gridWrapper.innerHTML = `<vc-grid-one  metadata="${metadataUrl}" dictionaries="${dictionariesUrl}">`+
				     		        	 '</vc-grid-one>';
			     		         }
			     		         else{
			     		        	 gridWrapper.innerHTML = `<vc-grid-one rows="${rowsUrl}" metadata="${metadataUrl}" dictionaries="${dictionariesUrl}">` 
			     		        		 +
				     		        	 '</vc-grid-one>';
			     		         }
			     		         var _grid = gridWrapper.children[0];
			     		        // _grid.style.height = '100%'
		              			 document.getElementsByClassName(oControl.randomClass)[0].appendChild(_grid);
			     		         /*** pagingType attribute  comes at dataLevel***/
			     		         if(attributes['pagingType'] == global.vui5.cons.pagingType.serverPaging){
				     		        	var action = {
			               						FNCNM: "GETDATA",
			       								RQTYP: "2"	
			               				}
			               				var obj = {
			               						action: action['FNCNM'],
			               					    method: action['RQTYP'] === global.vui5.cons.reqTypeValue.post ? global.vui5.cons.reqType.post : global.vui5.cons.reqType.get,
			               							actionRef:{
			               								FNCNM: "GETDATA",
			               								RQTYP: "2"
			               							},
			               				        context:oController.currentRoute,
			               				        sectionId: oControl.getSectionID()
			               				}
			               				
			        				    _grid.modules.ServerSideData({
			        				    	url: oController.getServerURL(obj),
			        				        packageSize: attributes['pageSize'],
			        				        frameCatchDelay: 150,
			        				        frameCatchAll: false
			        				    }); 
			     		         }
			     		        
		              			 ;
		                   		 console.log(_grid);
		                   		 oControl._VuiGrid = _grid;
		                   		_grid.boot().then(() => {
		              				 oControl._VuiGrid.api.view.header.setVisible(false);
		              				 oControl._VuiGrid.api.view.footer.setVisible(true);
		              				 /*** mode attribute  comes at dataLevel***/
		                			if(oControl.attributes['mode'] === 'condense'){
		                				oControl._VuiGrid.api.view.theme.layout.set('compact');	
		                			}else{
		                				oControl._VuiGrid.api.view.theme.layout.set('default');
		                			}
		              				oControl._VuiGrid.api.event.join('ClickCell', (rowData, event) => {
		              					fields = oControl.getModel(oControl.getModelName()).getProperty(oControl.getFieldPath());
		              					fieldObj = underscoreJS.find(fields, {FLDNAME:rowData.columnId})
		              					if(fieldObj && (fieldObj['ELTYP'] === global.vui5.cons.element.link || fieldObj['FLSTL'] === global.vui5.cons.styleType.icon)){
		              						oControl.onFieldClick(rowData,event);
		              					}
			              			 });
		              			    
		              				//**** on CustomGroup ***/
		              				oControl._VuiGrid.api.event.join('ActionDataGroup', (column, event) => {
		              					if (!oControl._PersonalizationDialog) {
		              			            oControl.createPersonalizationDialog();
		              			            oControl.addGroupPanelItem(oControl._PersonalizationDialog);
		              			            oControl.fillPersonalizationItems();
		              			        }
		              					var variant = oControl._oVariants.getSelectionKey();
		              					if(variant == "*standard*" && oControl._groupItems === undefined){
		              						oControl._groupItems = [];
		              					}
		              					var column = oControl._VuiGrid.api.column.group.get()[0];
		              					var existingGroupItem = underscoreJS.find(oControl._groupItems, {COLUMNKEY :column.columnId});
		              					if(existingGroupItem)
		              					 return;
//		              					if(existingGroupItem){
//		              						oControl._groupItems = underscoreJS.without(oControl._groupItems, _.findWhere(oControl._groupItems, {
//		              							COLUMNKEY :column.columnId
//		              						}));
//		              						if(existingGroupItem['OPERATION'] === 'GroupAscending'){
//		              							oControl._groupItems.push({
//				                                    'COLUMNKEY': column.columnId,
//				                                    'OPERATION': 'GroupDescending'
//			              						});
//		              						}else{
//		              							oControl._groupItems.push({
//				                                    'COLUMNKEY': column.columnId,
//				                                    'OPERATION': 'GroupAscending',
//			              						});
//		              						}
//		              					}else{
		              						oControl._groupItems.push({
			                                    'COLUMNKEY': column.columnId,
			                                    'OPERATION': 'GroupAscending'
			              					});
		              					//}
		              					oControl._oVariants.currentVariantSetModified(true);
		              					oControl._variantData = {
		              		                    "VARIANTS": [],
		              		                    "LAYOUT": {
		              		                        "COLITEMS": oControl.allKeysToUpperCase(oControl._columnItems),
		              		                        "SORTITEMS": oControl.allKeysToUpperCase(oControl._sortItems),
		              		                        "FILTERITEMS": oControl.allKeysToUpperCase(oControl._filterItems),
		              		                        "GRPITEMS": oControl.allKeysToUpperCase(oControl._groupItems),
		              		                        "AGRGTITEMS": oControl.allKeysToUpperCase(oControl._aggrPanel ? oControl._aggrPanel.getItems():[]),
		              		                    }
		              		                };
		              					oControl.fireLayoutManage({
		              	                    callBack: function () {
		              	                        oControl._applyPersonalization(oControl._columnItems);
		              	                        oControl._PersonalizationDialog.close();
		              	                    }
		              	                });
		              				});
		              				
		              				oControl._VuiGrid.api.event.join('ChangeColumnVisibilityApply', (column, event) => {
		              					if (!oControl._PersonalizationDialog) {
		              			            oControl.createPersonalizationDialog();
		              			            oControl.addGroupPanelItem(oControl._PersonalizationDialog);
		              			            oControl.fillPersonalizationItems();
		              			        }
		              					
		              					var existingColumnItemIndex = underscoreJS.findIndex(oControl._columnItems, {COLUMNKEY :column.columnId}); 
		              					 
		              				    oControl._columnItems[existingColumnItemIndex]['VISIBLE'] = column['visibility'];
		              					oControl._oVariants.currentVariantSetModified(true);
		              					oControl._variantData = {
		              		                    "VARIANTS": [],
		              		                    "LAYOUT": {
		              		                        "COLITEMS": oControl.allKeysToUpperCase(oControl._columnItems),
		              		                        "SORTITEMS": oControl.allKeysToUpperCase(oControl._sortItems),
		              		                        "FILTERITEMS": oControl.allKeysToUpperCase(oControl._filterItems),
		              		                        "GRPITEMS": oControl.allKeysToUpperCase(oControl._groupItems),
		              		                        "AGRGTITEMS": oControl.allKeysToUpperCase(oControl._aggrPanel ? oControl._aggrPanel.getItems(): []),
		              		                    }
		              		                };
		              					oControl.fireLayoutManage({
		              	                    callBack: function () {
		              	                        oControl._applyPersonalization(oControl._columnItems);
		              	                        oControl._PersonalizationDialog.close();
		              	                    }
		              	                });
		              				})
		              				
		              				/*** on CustomSort ***/
		              				oControl._VuiGrid.api.event.join('ActionDataSort', (column, event) => {
		              					if (!oControl._PersonalizationDialog) {
		              			            oControl.createPersonalizationDialog();
		              			            oControl.addGroupPanelItem(oControl._PersonalizationDialog);
		              			            oControl.fillPersonalizationItems();
		              			        }
		              					var variant = oControl._oVariants.getSelectionKey();
		              					if(variant == "*standard*" && oControl._sortItems === undefined){
		              						oControl._sortItems = [];
		              					}
		              					var existingSortItem = underscoreJS.find(oControl._sortItems, {COLUMNKEY :column.columnId}); 
		              					if(existingSortItem){
		              						oControl._sortItems = underscoreJS.without(oControl._sortItems, _.findWhere(oControl._sortItems, {
		              							COLUMNKEY :column.columnId
		              						}));
		              						if(existingSortItem['OPERATION'] === 'Ascending'){
		              							oControl._sortItems.push({
				                                    'COLUMNKEY': column.columnId,
				                                    'OPERATION': 'Descending',
			              						});
		              						}else{
		              							oControl._sortItems.push({
				                                    'COLUMNKEY': column.columnId,
				                                    'OPERATION': 'Ascending',
			              						});
		              						}
		              					}else{
		              						oControl._sortItems.push({
			                                    'COLUMNKEY': column.columnId,
			                                    'OPERATION': 'Ascending',
			              					});
		              					}
		              					oControl._oVariants.currentVariantSetModified(true);
		              					oControl._variantData = {
		              		                    "VARIANTS": [],
		              		                    "LAYOUT": {
		              		                        "COLITEMS": oControl.allKeysToUpperCase(oControl._columnItems),
		              		                        "SORTITEMS": oControl.allKeysToUpperCase(oControl._sortItems),
		              		                        "FILTERITEMS": oControl.allKeysToUpperCase(oControl._filterItems),
		              		                        "GRPITEMS": oControl.allKeysToUpperCase(oControl._groupItems),
		              		                        "AGRGTITEMS": oControl.allKeysToUpperCase(oControl._aggrPanel ? oControl._aggrPanel.getItems():[]),
		              		                    }
		              		                };
		              					oControl.fireLayoutManage({
		              	                    callBack: function () {
		              	                        oControl._applyPersonalization(oControl._columnItems);
		              	                        oControl._PersonalizationDialog.close();
		              	                    }
		              	                });
			              			 });
		              				if(oControl._fromLayoutManage){
		              						oControl._applyPersonalization(oControl._columnItems);
//		              						if(oControl._PersonalizationDialog)
//			                                 oControl._PersonalizationDialog.close();
			                                 delete oControl._fromLayoutManage;
		              				}
		                   	        });
	              			    
	              			 window.grid = oControl._VuiGrid;
	              			 
	              		 }
	              	 }
	              }); 
		          var scrollContainer = new sap.m.ScrollContainer({
		          	  content: oHtml
		            })
	              oControl.setAggregation("_vuiGrid", scrollContainer);
	              
            };
            G.prototype.addAggregatePanelItem = function (dialog) {
                var oControl = this;
                var oController = oControl.getController();
                var data = oController.getCurrentModel().getProperty(this.getDataPath());
                if(data && data['attributes'] && data.attributes['pagingType'] != global.vui5.cons.pagingType.serverPaging){
                	 if (!oControl._aggrPanel) {
                         oControl._aggrPanel = new global.vui5.ui.controls.AggregationPanel({
                             title: this._oBundle.getText("Aggregation"),
                             visible: true,
                             fromGrid:true,
                             modelName: oControl.getModelName(),
                             fieldPath: oControl.getFieldPath(),
                             dataAreaPath: oControl.getDataAreaPath(),
                             layoutDataPath: oControl.getLayoutDataPath(),
                             controller: oControl.getController(),
                             onSelectionChange: function (oEvent) {
                                 dialog.setShowResetEnabled(true);
                                 oControl._oVariants.currentVariantSetModified(true);
                             }
                         });

                         oControl._aggrPanel.setModel(oControl.getModel(oControl.getModelName()), oControl.getModelName());
                         oControl._aggrPanel.setModel(oControl.getModel(vui5.modelName), vui5.modelName);
                         oControl._aggrPanel.getPanelContent();

                         if (oControl._aggrPanel.addPanelToDialog()) {
                             dialog.addPanel(oControl._aggrPanel);
                         }

                     };

                     oControl._aggrPanel.getPanelContent();
			     }
               
            };
            G.prototype.onFieldClick = function (rowData,oEvent) {
                var oControl = this,params = {},fldname,fields,fieldInfo;
                    fldname = rowData['columnId'] || "";
                    fields = this.getModel(this.getModelName()).getProperty(this.getFieldPath());
                    fieldInfo = underscoreJS.find(fields,{FLDNAME:fldname})
	                params[global.vui5.cons.params.selectedRow] =  rowData['rowDescriptor']['id'];
	                params[global.vui5.cons.params.fieldName] = fldname;
	                oControl.fireOnFieldClick({
	                    'urlParams': params,
	                    'fieldInfo': fieldInfo
	                });
            };
            G.prototype.onRowClick = function(rowData,oEvent){
          	  var oControl = this;
          	  oControl.fireOnDetailButton({
                    record: rowData
                 });
            };
            G.prototype._onSettingPressed = function(oEvent){
          	  var oControl = this;
                if (!this._PersonalizationDialog) {
                    this.createPersonalizationDialog();
                }/*** Rel 60E SP6 - Personalization Issue after 1.50 Upgrade - Start ***/
                else {
                    this.updatePersonalizationItems();
                }
                /*** Rel 60E SP6 - Personalization Issue after 1.50 Upgrade - End ***/
                this.currentVaraintModified = this._oVariants.currentVariantGetModified();

                this.addGroupPanelItem(this._PersonalizationDialog);


                this.fillPersonalizationItems();
                this._PersonalizationDialog.open();
            };
            G.prototype.createPersonalizationDialog = function () {
                var oControl = this;
                var oDialog = new global.vui5.ui.controls.PersonalizationDialog();
                oDialog.onHandlePersonalizationOk = function (oEvent) {
                    oControl.handlePersonalizationOk(oEvent);
                };
                oDialog.onHandlePersonalizationClose = function (oEvent) {
                    oControl.handleClose(oEvent);
                };
                oDialog.onHandlePersonalizationReset = function (oEvent) {
                    oControl.handleReset(oEvent);
                };
                this._PersonalizationDialog = oDialog.getAggregation("_p13nDialog");
                this._addPanel(this._PersonalizationDialog);
                this.addDependent(this._PersonalizationDialog);
                var _sContentDensityClass;
                if (!sap.ui.Device.support.touch) {
                    _sContentDensityClass = "sapUiSizeCompact";
                    
                } else {
                    _sContentDensityClass = "sapUiSizeCozy";
                }
                
                if(sap.ui.version > "1.54.1"){
                	this._PersonalizationDialog._setVisibilityOfPanel1 = function(oPanel) {
                		var bVisible;
                		if (sap.ui.Device.system.phone) {
                			bVisible = this.getPanels().length === 1;
                			if (bVisible) {
                				oPanel.beforeNavigationTo();
                				if (!this.getModel()) {
                					this.setModel(oPanel.getModel("$sapmP13nPanel"), "$sapmP13nDialog");
                				}
                			}
                			oPanel.setVisible(bVisible);
                			this._setVisibilityOfOtherPanels1(oPanel, false);

                		} else {
                			bVisible = this.getInitialVisiblePanelType() === oPanel.getType() || this.getPanels().length === 1;
                			if (bVisible) {
                				oPanel.beforeNavigationTo();
                				if (!this.getModel()) {
                					this.setModel(oPanel.getModel("$sapmP13nPanel"), "$sapmP13nDialog");
                				}
                			}
                			oPanel.setVisible(bVisible);
                			if (bVisible) {
                				this._setVisibilityOfOtherPanels1(oPanel, false);
                				this.setVerticalScrolling(oPanel.getVerticalScrolling());
                				var oButton = this._getNavigationItemByPanel(oPanel);
                				var oNavigationControl = this._getNavigationControl();
                				if (oNavigationControl) {
                					oNavigationControl.setSelectedButton(oButton);
                				}
                			}
                		}
                	};
                	this._PersonalizationDialog._setVisibilityOfOtherPanels1 = function(oPanel, bVisible) {
                		for (var i = 0, aPanels = this.getPanels(), iPanelsLength = aPanels.length; i < iPanelsLength; i++) {
                			if (aPanels[i] === oPanel) {
                				continue;
                			}
                			aPanels[i].setVisible(bVisible);
                		}
                	};
                }

                jQuery.sap.syncStyleClass(_sContentDensityClass, this, this._PersonalizationDialog);
                this._PersonalizationDialog.addStyleClass("sapUiSizeCompact");
                
            };
            G.prototype._addPanel = function (dialog) {

                var oControl = this;
                var columns = this.getModel(this.getModelName()).getProperty(this.getFieldPath());
               // var editable = this.getEditable();
                this._columnPanel = new sap.m.P13nColumnsPanel({
                    title: oControl._oBundle.getText("Columns"),
                    visible: true,
                    type: "columns",
                    changeColumnsItems: this.updateColumnsItems.bind(this)
                });
                underscoreJS.each(columns, function (object, index) {
                    var visible;
                        if (object['NO_OUT'] != '' || object['ADFLD'] != '') {
                            visible = false;
                        } else {
                            visible = true;
                        }
                    if (object['ADFLD'] === '') {
                        oControl._columnPanel.addItem(new sap.m.P13nItem({
                            columnKey: object['FLDNAME'],
                            text: object['LABEL'],
                        }));
                        oControl._columnPanel.addColumnsItem(new sap.m.P13nColumnsItem({
                            columnKey: object['FLDNAME'],
                            index: index, 
                            visible: visible
                        }));
                    }
                });
                dialog.addPanel(this._columnPanel);


                this._sortPanel = new sap.m.P13nSortPanel({
                    title: oControl._oBundle.getText("Sort"),
                    visible: true,
                    type: "sort",
                    containerQuery: true,
                    layoutMode: "Desktop",
                    addSortItem: this.addSortItem.bind(this),
                    removeSortItem: this.removeSortItem.bind(this),
                    updateSortItem: this.updateSortItem.bind(this)
                });

                
                this._sortPanel.removeAllItems();
                /*** Rel 60E SP6 - Filter values sorting based on Label - Start ***/
                columns = underscoreJS.sortBy(columns, 'LABEL');
                /*** Rel 60E SP6 - Filter values sorting based on Label - End ***/

                underscoreJS.each(columns, function (object) {
                    oControl._sortPanel.addItem(new sap.m.P13nItem({
                        columnKey: object['FLDNAME'],
                        text: object['LABEL']
                    }));
                });

                
                dialog.addPanel(this._sortPanel);

                this._filterPanel = new sap.m.P13nFilterPanel({
                    title: oControl._oBundle.getText("Filter"),
                    visible: true,
                    type: "filter",
                    containerQuery: true,
                    layoutMode: "Desktop",
                    addFilterItem: this.addFilterItem.bind(this),
                    removeFilterItem: this.removeFilterItem.bind(this),
                    updateFilterItem: this.updateFilterItem.bind(this)
                })
                //*****Rel 60E_SP5
                    .data("fieldPath", this.getFieldPath())
                    .data("dataAreaPath", this.getDataAreaPath())
                    .data("modelName", this.getModelName())
                    .data("oControl", oControl);
                //*****

                /*** Rel 60E SP6 - Filter values sorting based on Label - Start ***/

                underscoreJS.each(columns, function (object) {
                    var type;
                    if (object['INTTYPE'] == global.vui5.cons.intType.number ||
                        // object['INTTYPE'] == 'T'
                        // ||
                        object['INTTYPE'] == global.vui5.cons.intType.integer || object['INTTYPE'] == global.vui5.cons.intType.oneByteInteger || object['INTTYPE'] == global.vui5.cons.intType.twoByteInteger
                        || object['INTTYPE'] == global.vui5.cons.intType.packed || object['INTTYPE'] == global.vui5.cons.intType.float || object['INTTYPE'] == global.vui5.cons.intType.decimal16
                        || object['INTTYPE'] == global.vui5.cons.intType.decimal32) {
                        type = 'numeric';
                    } else if (object['INTTYPE'] == global.vui5.cons.intType.date) {
                        type = 'date';
                    } else if (object['INTTYPE'] == global.vui5.cons.intType.time) {
                        type = 'time';
                    } else {
                        type = 'string';
                    }

                    oControl._filterPanel.addItem(new sap.m.P13nItem({
                        columnKey: object['FLDNAME'],
                        text: object['LABEL'],
                        type: type
                    }));
                });
                
                dialog.addPanel(this._filterPanel);

            };
            G.prototype.addGroupPanelItem = function (dialog) {

                var oControl = this;
                var oController = oControl.getController();
                var data = oController.getCurrentModel().getProperty(this.getDataPath());
                if(data && data['attributes'] && data.attributes['pagingType'] != global.vui5.cons.pagingType.serverPaging){
			    	 var columns = $.extend(true, [], this.getModel(this.getModelName()).getProperty(this.getFieldPath()));
		                columns = underscoreJS.sortBy(columns, 'LABEL');
		                
		                if (!this._groupPanel) {
		                	oControl._groupPanel = new global.vui5.ui.controls.MultiGroupPanel({
		            			title: oControl._oBundle.getText("Grouping"),
		                        visible: true,
		                        modelName: oControl.getModelName(),
		                        fieldPath: oControl.getFieldPath(),
		                        dataAreaPath: oControl.getDataAreaPath(),
		                        layoutDataPath: oControl.getLayoutDataPath(),
		                        controller: oControl.getController(),
		                        updateMultiGroupItems: function(oEvent) {
		                        	dialog.setShowResetEnabled(true);
		                            oControl._oVariants.currentVariantSetModified(true);
		                        }
		            		});
		                	oControl._groupPanel.setModel(oControl.getModel(oControl.getModelName()), oControl.getModelName());
		                    oControl._groupPanel.setModel(oControl.getModel(vui5.modelName), vui5.modelName);
		                    oControl._groupPanel.getPanelContent();
		                    //this._groupPanel.setMaxGroups(1);
		                    dialog.addPanel(oControl._groupPanel);
		                }

		                this._groupPanel.removeAllItems();
		                
		                underscoreJS.each(columns, function (object) {
		                    oControl._groupPanel.addItem(new sap.m.P13nItem({
		                        columnKey: object['FLDNAME'],
		                        text: object['LABEL']
		                    }));
		                });
		                this.addAggregatePanelItem(dialog);

			     }

                
            };
            G.prototype.fillPersonalizationItems = function (tableItems) {

                var oControl = this;

                if (tableItems) {
                    this._columnItems = [];
                    underscoreJS.each(tableItems, function (column) {
                        oControl._columnItems.push({
                            'COLUMNKEY': column.columnKey,
                            'INDEX': column.index,
                            'VISIBLE': column.visible
                        });
                    });
                } else {
                    var columns = this._columnPanel.getColumnsItems();
                    this._columnItems = [];
                    underscoreJS.each(columns, function (column) {
                        oControl._columnItems.push({
                            'COLUMNKEY': column.mProperties.columnKey,
                            'INDEX': column.mProperties.index,
                            'VISIBLE': column.mProperties.visible
                        });
                    });
                }

                var sortItems = this._sortPanel.getSortItems();
                this._sortItems = [];
                underscoreJS.each(sortItems, function (obj, index) {
                    oControl._sortItems.push({
                        'COLUMNKEY': obj.mProperties.columnKey,
                        'OPERATION': obj.mProperties.operation,
                        'INDEX': index
                    });
                });

                var filterItems = this._filterPanel.getFilterItems();
                this._filterItems = [];
                //*****Rel 60E_SP5
                var fields = oControl.getModel(this.getModelName()).getProperty(this.getFieldPath());
                //*****
                underscoreJS.each(filterItems, function (obj) {
                    //*****Rel 60E_SP5
                    var selField = underscoreJS.findWhere(fields, { FLDNAME: obj.mProperties.columnKey }), value1, value2;
                    value1 = obj.mProperties.value1;
                    value2 = obj.mProperties.value2;
                    if (selField['DATATYPE'] === vui5.cons.dataType.date) {
                        if (!underscoreJS.isEmpty(value1) && (new Date(value1) != "Invalid Date")) {
                            value1 = new Date(value1);
                            value1 = value1.toDateString();
                            value1 = commonUtils.convertToSimpleDate(value1);
                        }

                        if (!underscoreJS.isEmpty(value2) && (new Date(value2) != "Invalid Date")) {
                            value2 = new Date(value2);
                            value2 = value2.toDateString();
                            value2 = commonUtils.convertToSimpleDate(value2);
                        }
                    }
                    else if (selField['DATATYPE'] === vui5.cons.dataType.time) {
                        if (!underscoreJS.isEmpty(value1) && (new Date(value1) != "Invalid Date")) {
                            value1 = new Date(value1);
                            value1 = commonUtils.convertToSimpleTime(value1);
                        }

                        if (!underscoreJS.isEmpty(value2) && (new Date(value2) != "Invalid Date")) {
                            value2 = new Date(value2);
                            value2 = commonUtils.convertToSimpleTime(value2);
                        }
                    }
                    //*****
                    var exclude = false;
                    if (obj.mProperties.exclude)
                        exclude = true;

                    oControl._filterItems.push({
                        'COLUMNKEY': obj.mProperties.columnKey,
                        'OPERATION': obj.mProperties.operation,
                        //*****Rel 60E_SP5
                        'VALUE1': value1,
                        'VALUE2': value2,
                        //*****
                        'EXCLUDE': exclude
                    });
                });
                if(this._groupPanel) {
                    var groupItems = this._groupPanel.getGroupItems();
	                this._groupItems = [];
	                underscoreJS.each(groupItems, function (obj) {
	                    oControl._groupItems.push({
	                        'COLUMNKEY': obj['COLUMNKEY'],
	                        'OPERATION': obj['OPERATION']
	                    });
	                });
                }
                if(oControl._aggrPanel){
                	var aggrItems = oControl._aggrPanel.getItems();
                    this._aggrItems = [];
                    underscoreJS.each(aggrItems, function (obj) {
                        oControl._aggrItems.push({
                            'COLUMNKEY': obj['COLUMNKEY'],
                             'AGGAT': obj['AGGT']
                        });
                    });
                }
                
                
            };
            G.prototype.handlePersonalizationOk = function (event) {
                var oControl = this, layoutData, variant, tableItems;
                if (event) {
                    tableItems = event.getParameter("payload").columns.tableItems;

                    /*** Rel 60E SP6 - Personalization Issue after 1.50 Upgrade - Start ***/
                    underscoreJS.each(tableItems, function (tableItem, index) {
                        tableItem['index'] = index;
                    });
                    /*** Rel 60E SP6 - Personalization Issue after 1.50 Upgrade - End ***/
                }
                else {
                    tableItems = [];
                    underscoreJS.each(oControl._columnItems, function (object) {
                        tableItems.push({
                            columnKey: object['COLUMNKEY'],
                            index: object['INDEX'],
                            visible: object['VISIBLE'],
                            width: ""
                        })
                    })
                }
                this.fillPersonalizationItems(tableItems);
                variant = this._oVariants.getSelectionKey();


                oControl._variantData = {
                    "VARIANTS": [],
                    "LAYOUT": {
                        "COLITEMS": oControl.allKeysToUpperCase(oControl._columnItems),
                        "SORTITEMS": oControl.allKeysToUpperCase(oControl._sortItems),
                        "FILTERITEMS": oControl.allKeysToUpperCase(oControl._filterItems),
                        "GRPITEMS": oControl.allKeysToUpperCase(oControl._groupItems),
                        "AGRGTITEMS": oControl.allKeysToUpperCase(oControl._aggrPanel ? oControl._aggrPanel.getItems(): []),
                    }
                };

                oControl.fireLayoutManage({
                    callBack: function () {
                       // oControl._applyPersonalization(oControl._columnItems);
                        oControl._PersonalizationDialog.close();
                        //delete oControl._fromLayoutManage;
                    }
                });

            };
            G.prototype.getSelectedRows = function(){
            	var oControl = this,model,rows,indexes,selectedRows = [];
            	    model = oControl.getController().getModel(oControl.getModelName());
            	    rows = model.getProperty(oControl.getDataPath())['rows'];
            	    indexes = oControl._VuiGrid.api.row.mark.get();
            	    underscoreJS.each(indexes,function(index){
            	    	selectedRows.push(rows[index]['data']);
            	    })
            	    
            	    return selectedRows;
            	
            };
            G.prototype.handleClose = function () {
                var oControl = this;
                oControl._columnPanel.removeAllColumnsItems();

                underscoreJS.each(this._columnItems, function (item) {
                    var visible;
                    if (item['VISIBLE'] == "true" || item['VISIBLE'] == true || item['VISIBLE'] == "X") {
                        visible = true;
                    }
                    else {
                        visible = false;
                    }

                    oControl._columnPanel.addColumnsItem(new sap.m.P13nColumnsItem({
                        columnKey: item['COLUMNKEY'],
                        index: item['INDEX'],
                        visible: visible
                    }));
                });

                oControl._sortPanel.removeAllSortItems();
                oControl._sortItems = underscoreJS.sortBy(oControl._sortItems, 'INDEX');
                underscoreJS.each(oControl._sortItems, function (item) {
                    oControl._sortPanel.addSortItem(new sap.m.P13nSortItem({
                        columnKey: item['COLUMNKEY'],
                        operation: item['OPERATION']
                    }));
                });

                oControl._filterPanel.removeAllFilterItems();
                underscoreJS.each(this._filterItems, function (item) {
                    var exclude;
                    if (item['EXCLUDE'] == "true" || item['EXCLUDE'] == true || item['EXCLUDE'] == "X")
                        exclude = true;
                    else
                        exclude = false;

                    oControl._filterPanel.addFilterItem(new sap.m.P13nFilterItem({
                        columnKey: item['COLUMNKEY'],
                        operation: item['OPERATION'],
                        value1: item['VALUE1'],
                        value2: item['VALUE2'],
                        exclude: exclude
                    }));
                });
                if(this._groupPanel){
                	 oControl._groupPanel.removeAllGroupItems();
                     oControl._groupPanel.addGroupItems(this._groupItems);
                }
                this._oVariants.currentVariantSetModified(this.currentVaraintModified);
                this._PersonalizationDialog.close();
            };
            G.prototype.handleReset = function (oEvent) {
                var oControl = this;
                var variant = this._oVariants.getSelectionKey();
                if (variant != "*standard*") {
                    if (!oEvent.mParameters) {
                        oEvent.mParameters = {};
                    }
                    oEvent.mParameters['key'] = variant;
                    oControl._onVariantSelect(oEvent);
                } else {
                    this._columnPanel.removeAllColumnsItems();
                        var columns = this.getModel(this.getModelName()).getProperty(this.getFieldPath());
                    
                    underscoreJS.each(columns, function (object, index) {
                        var visible;

                       
                            if (object['NO_OUT'] != '' || object['ADFLD'] != '') {
                                visible = false;
                            } else {
                                visible = true;
                            }
                        oControl._columnPanel.addColumnsItem(new sap.m.P13nColumnsItem({
                            columnKey: object['FLDNAME'],
                            index: index, 
                            visible: visible
                        }));
                    });

                    this._sortPanel.removeAllSortItems();
                    this._filterPanel.removeAllFilterItems();
                    if(this._groupPanel)
                    this._groupPanel.removeAllGroupItems();
                }

                this._oVariants.currentVariantSetModified(false);
            };
            G.prototype._addSortIndicator = function(element, order) {
            	if (!element) {
            		return void 0;
            	}
            	let sorter = document.createElement('div');
            	
            	sorter.classList.add('cell__sorter');
            	element.appendChild(sorter);
            	
            	let direction = order === 'asc' ? 'up' : 'down';
            	sorter.innerHTML = `<vui-icon-chevron-${direction}
            		class="sort-ungrouped"
            		size="medium"
            		style="display: block"></vui-icon-chevron-${direction}>`;
            };
            G.prototype._applyPersonalization = function (tableItems) {
            	var oControl = this;
            	if(oControl._VuiGrid && oControl._VuiGrid.api){
            		underscoreJS.each(oControl._sortItems, function (object) {
   	        		 var columnKey = object['COLUMNKEY'];
   	        		 var operation = object['OPERATION'];
   	        		 var order;
   	        		 if(operation == "Ascending")
   	        			 order = 'asc';
   	        		 else
   	        			 order = 'desc';
   	        		 
   	        		 let gridCore = oControl._VuiGrid.shadowRoot.children[1].querySelector('.core').shadowRoot;
   	        		oControl._addSortIndicator(gridCore.querySelector('.header .cell_'+columnKey), order);
   	        	 })
		       	/*Filter Indicator - Start*/
		         if (this._filterItems && this._filterItems.length > 0) {
		             this._oFilterTitle.setVisible(true);
		             this._oVuiFilterSeparator.setVisible(true);

		             var s = '';
		             if (this._filterItems.length > 1) {
		                 s = 's';
		             }
		             this._oFilterTitle.setText(oControl._oBundle.getText("ActiveFilter", [this._filterItems.length, s]));
		         } else {
		             this._oFilterTitle.setVisible(false);
		             this._oVuiFilterSeparator.setVisible(false);
		         }
		         /*Filter Indicator - End*/
            	}
            };
            G.prototype._onVariantSave = function (oEvent) {
            	 var oControl = this, overwrite, header, overwrite_properties, saveData = [], params = {}, globalVariant;
                 var variantsData = oControl.getProperty("controller").getCurrentModel().getProperty(oControl.getVariantDataPath());

                 overwrite = overwrite_properties = oEvent.getParameter("overwrite") || '';
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
                     header['OBJTP'] = global.vui5.cons.applnObject;
                     header['APPLN'] = global.vui5.cons.application;
                     header['UPDKZ'] = global.vui5.cons.updkz.ins;
                     header['DEFLT'] = oEvent.getParameter("def") === true ? 'X' : '';

                 }

                 if (!oControl._PersonalizationDialog) {
                     oControl.createPersonalizationDialog();
                     oControl.addGroupPanelItem(this._PersonalizationDialog);
                     oControl.fillPersonalizationItems();
                 }
                // if (selectedVariant['ROWID'] !== 0) {
                	 //oControl._fromLayoutManage = true;
                // }
                 saveData.push(header);
                 header['HANDLE'] = oControl.getHandle();
                 oControl._variantData = {
                     "VARIANTS": saveData,
                     "LAYOUT": {
                         "COLITEMS": this.allKeysToUpperCase(this._columnItems),
                         "SORTITEMS": this.allKeysToUpperCase(this._sortItems),
                         "FILTERITEMS": this.allKeysToUpperCase(this._filterItems),
                         "GRPITEMS": oControl.allKeysToUpperCase(oControl._groupItems),
                         "AGRGTITEMS": oControl.allKeysToUpperCase(oControl._aggrPanel ? oControl._aggrPanel.getItems() : []),
                     }
                 };

                 params[global.vui5.cons.params.overwrite] = overwrite;
                 params[global.vui5.cons.params.overwrite_properties] = overwrite_properties;
                 params[global.vui5.cons.params.global] = globalVariant;
                 params[global.vui5.cons.params.handle] = oControl.getHandle();
                 params[global.vui5.cons.params.variantID] = header['VARID'];
                 oControl.fireVariantSave({
                     callBack: function () {
                         oControl._onVariantSelect1(true);
                         //delete oControl._fromLayoutManage;
                     },
                     urlParams: params
                 });


            };
            G.prototype._onVariantManage = function (oEvent) {
            	 var oControl = this,
                 oController,
                 variantData,
                 params = {},
                 variantData;
             oController = oControl.getProperty("controller");

             var deleted = oEvent.getParameter("deleted");
             var renamed = oEvent.getParameter("renamed");

             var defaultVariant = oEvent.getParameter("def");

             var variantList = oControl.getProperty("controller").getCurrentModel().getProperty(oControl.getVariantDataPath());
             variantData = {
                 'NEWVARIANTS': [],
                 'UPDATEVARIANTS': [],
                 'DELETEVARIANTS': []
             };
             var item;
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
                 var variant = underscoreJS.find(variantList, {
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

             /* Global Variant Changes-START */
             var markStandardAsDefault = "";
             if (defaultVariant == "*standard*") {
                 markStandardAsDefault = 'X';
             }
             /* Global Variant Changes-END */

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
            G.prototype._onVariantSelect = function (oEvent) {
            	 var oControl = this, variantData, selectedVariant;
                 var variant = oEvent.getParameter("key");
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
                 if (!oControl._PersonalizationDialog) {
                     oControl.createPersonalizationDialog();
                     oControl.addGroupPanelItem(this._PersonalizationDialog);
                     oControl.fillPersonalizationItems();
                 }
                 
                 oControl.fireVariantSelect({
                     callBack: function () {
                         if (selectedVariant['ROWID'] === 0) {
                             oControl.handleReset();
                             oControl.fillPersonalizationItems();
                             oControl._applyPersonalization(oControl._columnItems);
                         }
                         else {
                             oControl._onVariantSelect1(true,selectedVariant);
//                             if (selectedVariant['ROWID'] !== 0) {
//                            	 oControl._fromLayoutManage = true;
//                             }
                             //oControl.onVuiGridInfocusSet();
                            // delete oControl._fromLayoutManage;
                         }
                     },
                     record: selectedVariant
                 });
            };
            G.prototype._onVariantSelect1 = function (applyPersonalization,selectedVariant) {
                if (!this._PersonalizationDialog) {
                    this.createPersonalizationDialog();
                }
                this.addGroupPanelItem(this._PersonalizationDialog);

                var variant = this._oVariants.getSelectionKey();
                return this.fetchVariantData(variant, applyPersonalization,selectedVariant);
            };


            G.prototype.fetchVariantData = function (variant, applyPersonalization,selectedVariant) {

                var oControl = this,
                    oController;
                oController = oControl.getProperty("controller");
                var layoutData = oController.getCurrentModel().getProperty(oControl.getLayoutDataPath());
                if(layoutData){
                oControl._columnItems = layoutData['COLITEMS'];
                oControl._sortItems = layoutData['SORTITEMS'];
                oControl._filterItems = layoutData['FILTERITEMS'];
                oControl._groupItems = layoutData['GRPITEMS'];
                    if(this_aggrPanel)
	                this._aggrPanel.getPanelContent();
	            oControl.updatePersonalizationItems(applyPersonalization);
	                //oControl._fromLayoutManage = true;
                }
                
                //if (variant === global.vui5.cons.variant.standard) {
                if(selectedVariant ? selectedVariant['ROWID'] === 0 : variant === global.vui5.cons.variant.standard){
                    oControl.handleReset();
                    oControl.fillPersonalizationItems();
                    oControl._applyPersonalization(oControl._columnItems);
                    return;
                }

            };

            G.prototype.updatePersonalizationItems = function (applyPersonalization) {

                var oControl = this;
                this._columnPanel.removeAllColumnsItems();
                this._sortPanel.removeAllSortItems();
                this._filterPanel.removeAllFilterItems();
                if(this._groupPanel)
                this._groupPanel.removeAllGroupItems();
                var visible;
                // Column List Items
                underscoreJS.each(oControl._columnItems, function (object) {
                    var visible;
                    if (object['VISIBLE'] == "true" || object['VISIBLE'] == true || object['VISIBLE'] == "X")
                        visible = true;
                    else
                        visible = false;

                    oControl._columnPanel.addColumnsItem(new sap.m.P13nColumnsItem({
                        columnKey: object['COLUMNKEY'],
                        index: object['INDEX'],
                        visible: visible
                    }));
                });

                // Sort Items
                oControl._sortItems = underscoreJS.sortBy(oControl._sortItems, 'INDEX');
                underscoreJS.each(oControl._sortItems, function (object) {
                    oControl._sortPanel.addSortItem(new sap.m.P13nSortItem({
                        columnKey: object['COLUMNKEY'],
                        operation: object['OPERATION']
                    }));
                });

                // Filter Items
                underscoreJS.each(oControl._filterItems, function (object) {
                    var exclude;
                    if (object['EXCLUDE'] == "true" || object['EXCLUDE'] == true || object['EXCLUDE'] == "X")
                        exclude = true;
                    else
                        exclude = false;

                    oControl._filterPanel.addFilterItem(new sap.m.P13nFilterItem({
                        columnKey: object['COLUMNKEY'],
                        operation: object['OPERATION'],
                        value1: object['VALUE1'],
                        value2: object['VALUE2'],
                        exclude: exclude
                    }));
                });

                // Group Items
                if(oControl._groupPanel)
                oControl._groupPanel.addGroupItems(oControl._groupItems);
                if (applyPersonalization) {
                    oControl.fillPersonalizationItems();
                    oControl._applyPersonalization(oControl._columnItems);
                }
            };
            G.prototype.applyElementFeature = function () {
                var oControl = this;
                var oController = this.getController();
                var model = oController.getCurrentModel();
                var layoutData = model.getProperty(oControl.getLayoutDataPath());

                if (layoutData && !oControl._applyElmtFeature) {
                    oControl._applyElmtFeature = true;
                    if (!underscoreJS.isEmpty(layoutData['GRPITEMS'])||!underscoreJS.isEmpty(layoutData['FILTERITEMS']) || !underscoreJS.isEmpty(layoutData['SORTITEMS'])) {
                        if (!oControl._PersonalizationDialog) {
                            oControl.createPersonalizationDialog();
                            oControl.addGroupPanelItem(this._PersonalizationDialog);
                        }
                        oControl._filterItems = layoutData['FILTERITEMS'];
                        oControl._sortItems = layoutData['SORTITEMS'];
                        oControl._groupItems = layoutData['GRPITEMS'];
                        oControl.updatePersonalizationItems(true);
                    }
                }
            };
            G.prototype.updateColumnsItems = function () {
                this._oVariants.currentVariantSetModified(true);
            };
            G.prototype.addSortItem = function (oEvent) {
                this._sortPanel.addSortItem(oEvent.getParameter("sortItemData"));
                this._oVariants.currentVariantSetModified(true);
            };
            G.prototype.removeSortItem = function (oEvent) {
                var index = oEvent.getParameter("index");
                var item = this._sortPanel.getSortItems()[index];
                this._sortPanel.removeSortItem(item);
                this._oVariants.currentVariantSetModified(true);
            };
            G.prototype.updateSortItem = function () {
                this._oVariants.currentVariantSetModified(true);
            };

            G.prototype.addFilterItem = function (oEvent) {
                this._filterPanel.addFilterItem(oEvent.getParameter("filterItemData"));
                this._oVariants.currentVariantSetModified(true);
            };

            G.prototype.removeFilterItem = function (oEvent) {
                var index = oEvent.getParameter("index");
                var item = this._filterPanel.getFilterItems()[index];
                this._filterPanel.removeFilterItem(item);
                this._oVariants.currentVariantSetModified(true);
            };

            G.prototype.updateFilterItem = function () {
                this._oVariants.currentVariantSetModified(true);
            };
            G.prototype.getVariantData = function () {
                var data = {};
                if (!underscoreJS.isEmpty(this._variantData)) {
                    data = this._variantData;
                    this._variantData = {};
                }
                return data;
            };
//            G.prototype.getToolbarTitle = function(){
//            	  var oControl = this,controller,section,sectionConfig;
//                      oController = this.getController();
//                      section = oController.getSectionBy("SECTN",oControl.getSectionID());
//                      sectionConfig = oController.sectionConfig[oControl.getSectionID()]
//            	  if(section['DESCR']){
//                  	var descr = section['DESCR'];
//                  	var displayedPages = sectionConfig.attributes[global.vui5.cons.attributes.displayedPages];
//                  	var count = sectionConfig.attributes[global.vui5.cons.attributes.maxItems];
//                  	if (descr != undefined) {
//                          if (displayedPages != "" && displayedPages != undefined && parseInt(displayedPages) != 0 &&
//                              count != "" && count != undefined && parseInt(count) != 0) {
//                              return descr + " " + "(" + displayedPages + "/" + count + ")";
//                          }
//                          if (count != "" && count != undefined && parseInt(count) != 0) {
//                        	  return  descr + " " + "(" + count + ")";
//                          } else {
//                        	  return descr;
//                          }
//                      }
//                 }
//              };
              G.prototype.allKeysToUpperCase = function (obj) {
                  var output = {};
                  for (var i in obj) {
                      if (Object.prototype.toString.apply(obj[i]) === '[object Object]') {
                          output[i.toUpperCase()] = this.allKeysToUpperCase(obj[i]);
                      } else {
                          output[i.toUpperCase()] = obj[i];
                      }
                  }
                  return output;
              };
              
              /*Export Button - Start*/
              G.prototype._ExportPress = function () {
                  var oControl = this;
                  var oController = this.getController();
                	  if ((oControl._filterItems && oControl._filterItems.length != 0) && oControl._gridData.rows.length == 0) {
                    	  oControl._ExportAllPress(oControl);
                      }
                  else if (oControl._filterItems && oControl._filterItems.length != 0){
                	  var oMenuSet = new sap.ui.unified.Menu();
                      oControl._menu = oMenuSet;
                      var oMenu1 = new sap.ui.unified.MenuItem({
                          text: oControl._oBundle.getText("ExportExisting"),
                          select: function (event) {
                              oControl._menu.close();
                              var params = {};
                              params[global.vui5.cons.params.entireData] = "";
                              var action = {
                                  "FNCNM": global.vui5.cons.eventName.excelExport,
                                  "DNLDTP":global.vui5.cons.downloadType.server
                              }
                              oControl.fireOnExport({
                                  action: action,
                                  urlParams:params
//                                  callBack: function () {
//                                      oController._processExport({
//                                          table: oControl,
//                                          fromServer: true
//                                      });
//                                  }
                              })
                          }
                      });
                      var oMenu2 = new sap.ui.unified.MenuItem({
                          text: oControl._oBundle.getText("ExportAll"),
                          select: function(event){
                        	  oControl._menu.close();
                        	  oControl._ExportAllPress(oControl);
                          }
                      });
                      this._menu.addItem(oMenu1);
                      this._menu.addItem(oMenu2);
                      var eDock = sap.ui.core.Popup.Dock;
                      this._menu.open(false, this._oExportButton, eDock.BeginTop, eDock.BeginBottom, this._oExportButton);
                  }
                  else {
                	  oControl._ExportAllPress(oControl);
                  }
              };
              
              G.prototype._ExportAllPress = function (oEvent) {
                  var oControl = this, oController, action;
                  oController = this.getController();
                  var params = {};
                  params[global.vui5.cons.params.entireData] = "X";
                  action = {
                      "FNCNM": global.vui5.cons.eventName.excelExport,
                      "DNLDTP":global.vui5.cons.downloadType.server
                  }
                  oControl.fireOnExport({
                      action: action,
                      urlParams:params
//                      callBack: function () {
//                          oController._processExport({
//                              table: oControl,
//                              fromServer: true
//                          });
//                      }
                  })
              };
              /*Export Button - End*/

              /*Filter Indicator - Start*/
              G.prototype._onFilterLink = function () {
                  if (!this._PersonalizationDialog) {
                      this.createPersonalizationDialog();
                  } else {
                      this.updatePersonalizationItems();
                  }

                  this._PersonalizationDialog.setInitialVisiblePanelType('filter');
                  var panels = this._PersonalizationDialog.getPanels();
                  for (var i = 0; i < panels.length; i++) {
                  	/*** Higher version changes  for setVisibilityOfPanel- private method as it is not available from 1.54**/
                  	 if(sap.ui.version > "1.54.1")
                     	  this._PersonalizationDialog._setVisibilityOfPanel1(panels[i]);
                  	 
                     	else
                     		this._PersonalizationDialog._setVisibilityOfPanel(panels[i]);
                  	 /***/
                  }
                  
                  this.currentVaraintModified = this._oVariants.currentVariantGetModified();

                  this.addGroupPanelItem(this._PersonalizationDialog);

                  this.fillPersonalizationItems();
                  this._PersonalizationDialog.open();
              };
              /*Filter Indicator - End*/
              
           
             G.prototype._onFilterTable = function (event) {
            	 var oControl = this;
                 var value = event.getParameter("query");
                 oControl._VuiGrid.api.data.search.set(value);
             };
              
          
});
