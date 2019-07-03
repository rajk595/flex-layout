sap.ui.define(["jquery.sap.global",
        "sap/m/Table",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Sorter",
        "sap/ui/model/Filter",
        "sap/m/TableRenderer",
        "sap/ui/comp/variants/VariantItem",
        vistexConfig.rootFolder + "/ui/core/global",
        vistexConfig.rootFolder + "/ui/core/Formatter",
        vistexConfig.rootFolder + "/ui/core/underscore-min",
//*****Rel 60E_SP5
        vistexConfig.rootFolder + "/ui/core/commonUtils",
        "sap/m/P13nConditionPanel",
        'sap/ui/core/format/DateFormat',
        'sap/ui/core/format/NumberFormat',
//*****
        "sap/m/ColumnListItemRenderer",
        vistexConfig.rootFolder + "/ui/controls/PersonalizationDialog",
        vistexConfig.rootFolder + "/ui/controls/MassEditDialog"
],
    function (q, Table, JSONModel, Sorter, Filter, TableRender, VariantItem, global, Formatter, underscoreJS,
              //*****Rel 60E_SP5
              commonUtils, P13nConditionPanel, DateFormat, NumberFormat, ColumnListRenderer,
        //*****
              MassEditDialog
    ) { // ,Parameters)
        // {

        var T = Table.extend(vistexConfig.rootFolder + ".ui.controls.ResponsiveTable", {
            metadata: {
                properties: {
                    controller: {
                        type: "object",
                        defaultValue: null
                    },
                    modelName: {
                        type: "string",
                        defaultValue: null
                    },
                    fieldPath: {
                        type: "string",
                        defaultValue: null
                    },
                    fieldGroupPath: {
                        type: "string",
                        defaultValue: null
                    },
                    dataPath: {
                        type: "string",
                        defaultValue: null
                    },
                    dataAreaPath: {
                        type: "string",
                        defaultValue: null
                    },
                    title: {
                        type: "string",
                        defaultValue: null
                    },
                    showTitle: {
                        type: "boolean",
                        defaultValue: false
                    },
                    pagingType: {
                        type: "string",
                        defaultValue: "none"
                    },
                    totalNumberOfRows: {
                        type: "string"
                    },
                    pagingThreshold: {
                        type: "string",
                        defaultValue: 0
                    },
                    editable: {
                        type: "boolean",
                        defaultValue: false
                    },
                    listItemType: {
                        type: "sap.m.ListType",
                        defaultValue: sap.m.ListType.Inactive
                    },
                    handle: {
                        type: "string",
                        defaultValue: null
                    },
                    /* onF4HelpRequest: {
               type: "function",
               defaultValue: null
           },*/
                    enableLocalSearch: {
                        type: "boolean",
                        defaultValue: false
                    },
                    enableSearchAndReplace: {
                        type: "boolean",
                        defaultValue: true
                    }, enablePersonalization: {
                        type: "boolean",
                        defaultValue: true
                    },
                    enableSetValues: {
                        type: "boolean",
                        defaultValue: false
                    },
                    disableExcelExport: {
                        type: "string",
                        // defaultValue: false
                    },
                    /****** Rel 60E_SP7 TASK #52848  */
                    mergeDuplicates: {
                        type: "boolean",
                        defaultValue: false
                    },
                    /***/
                    searchProfile: {
                        type: "string",
                        defaultValue: ""
                    },
                    uiProfile: {
                        type: "string",
                        defaultValue: ""
                    },
                    backendSortFilter: {
                        type: "boolean",
                        defaultValue: true
                    },
                    sectionID: {
                        type: "string",
                        defaultValue: ""
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
                    totalDataPath: {
                        type: "string"
                    },
                    enableQuickEntry: {
                        type: "boolean",
                        defaultValue: false
                    },
                    hideVariantSave: {
                        type: "boolean",
                        defaultValue: false
                    },
                    /***Rel 60E SP6 ECDM #4728 - Start ***/
                    hideShare: {
                        type: "boolean",
                    },
                    /***Rel 60E SP6 ECDM #4728 - End ***/
                    //MassEdit
                    enableBulkEdit: {
                        type: "boolean",
                        defaultValue: false
                    },
                    /***Rel 60E SP7 Layout Control - Start ***/
                    disableTableHeader: {
                        type: "boolean",
                        defaultValue: false
                    },
                    /***Rel 60E SP7 Layout Control - End ***/
                    //*****Rel 60E_SP7
                    hideHeader: {
                        type: "boolean",
                        defaultValue: false
                    }
                    //*****
                },
                events: {
                    onDetailPress: {},
                    onItemSelect: {},
                    onServerSidePaging: {},
                    onFieldChange: {},
                    onSortFilter: {},
                    onFieldClick: {},
                    onValueHelpRequest: {},
                    variantSave: {},
                    variantSelect: {},
                    layoutManage: {},
                    pageChange: {},
                    onFullScreen: {},
                    onSetValues: {},
                    onSetValuesApply: {},
                    onSetValuesClose: {},
                    onExport: {},
                    onQuickEntry: {},
                    onMassEdit: {},
                    //*****Rel 60E_SP6 - QA #9410
                    onUpdate: {}
                    //*****
                }
            },

            renderer: function (r, c) { // "sap.m.TableRenderer"
                TableRender.render(r, c);

                if (c.getPagingType() == global.vui5.cons.pagingType.serverPaging && c.dataPrepared) {
                    c.triggerDisplayed = true;
                    $('#' + c.getId() + '-triggerList').remove();
                    r.write('<ul');
                    r.addClass('sapMListUl');
                    r.addClass('sapMGrowingList');
                    r.addClass('vuiGrowingTopPadding');
                    r.addClass("sapMList");
                    //r.addClass("sapUiResponsiveContentPadding");
                    // r.addClass(c.getDomRef().className);
                    r.writeAttribute('role', 'presentation');
                    r.writeAttribute('id', c.getId() + '-triggerList');
                    r.writeClasses();
                    r.writeStyles();
                    r.write('>');
                    r.renderControl(c._getTrigger());
                    r.write('</ul>');
                }
            }
        });

        T.prototype.setTriggeredDisplayed = function (value) {
            this.triggerDisplayed = value;
        };

        T.prototype.init = function () {
            Table.prototype.init.apply(this);

            var oControl = this;


            ColumnListRenderer.renderHighlight = function (rm, oLI) {
                rm.write('<td class="sapMListTblHighlightCell" aria-hidden="true">');

                // let the list item base render the highlight
                var object = {};
                if (oLI.getBindingContext(oControl.getModelName())) {
                    object = oLI.getBindingContext(oControl.getModelName()).getObject();
                }
                if (object['ROWCOLOR']) {
                    var rowColorStyleClass = 'vui_tblrowcolor_' + object['ROWCOLOR'];
                    rm.write("<div");
                    rm.addClass("sapMLIBHighlight");
                    rm.addClass(rowColorStyleClass);
                    rm.writeClasses();
                    rm.write("></div>");
                }
                rm.write('</td>');

            };

            var sLocale = sap.ui.getCore().getConfiguration().getLanguage();
            if (sLocale.length > 2) {
                sLocale = sLocale.substring(0, 2);
            }
            //
            this._oBundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls");

            this._oChangedRowsPath = [];

            this._oChangedRowFields = [];

            this._oChangedCellControls = [];


            this.attachUpdateFinished(function (oEvent) {
                if (!underscoreJS.isEmpty(oControl._oChangedCellControls)) {
                    underscoreJS.each(oControl._oChangedCellControls, function (cellControl) {
                        oControl.setCellValueChangeColor(cellControl);
                    });
                }
            });

            this._oVuiTitle = new sap.m.Title();

            this._oVuiSeparator = new sap.m.ToolbarSeparator({
                visible: oControl.getShowTitle()
            });

            this._functionRef = [];

            this._oSearchField = new sap.m.SearchField({
                //*****Rel 60E_SP6 - QA #11652
                //width: "25%",
                width: "20%",
                //*****
                search: oControl._onFilterTable.bind(oControl),
                visible: oControl.getEnableLocalSearch(),
                layoutData: new sap.m.OverflowToolbarLayoutData({
                    priority: sap.m.OverflowToolbarPriority.High
                })
            });

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
                press: oControl._onSettingPressed.bind(oControl),
                layoutData: new sap.m.OverflowToolbarLayoutData({
                    priority: sap.m.OverflowToolbarPriority.High
                }),
                visible: this.getProperty("enablePersonalization")
            });
            this._exportButton = new sap.m.OverflowToolbarButton({
                type: sap.m.ButtonType.Transparent,
                icon: "sap-icon://excel-attachment",
                text: this._oBundle.getText("Export"),
                tooltip: this._oBundle.getText("Export"),
                press: oControl._ExportPress.bind(oControl),
                layoutData: new sap.m.OverflowToolbarLayoutData({
                    //*****Rel 60E_SP6 - QA #11652
                    //priority: sap.m.OverflowToolbarPriority.High
                    priority: sap.m.OverflowToolbarPriority.Low
                    //*****
                }),
                visible: true
                //              visible: {
                //                  path: this.getModelName() + ">" + this.getDataPath(),
                //                  formatter: function (data) {
                //                      data && data.length !== 0 ? true : false;
                //                  },
                //                  mode: sap.ui.model.BindingMode.TwoWay
                //              }
            });


            this._searchAndReplaceButton = new sap.m.OverflowToolbarButton({
                type: sap.m.ButtonType.Transparent,
                icon: "sap-icon://inspection",
                text: this._oBundle.getText("SearchReplace"),
                tooltip: this._oBundle.getText("SearchReplace"),
                press: oControl.searchAndReplaceDialog.bind(oControl),
                visible: false,
                layoutData: new sap.m.OverflowToolbarLayoutData({
                    //*****Rel 60E_SP6 - QA #11652
                    //priority: sap.m.OverflowToolbarPriority.High
                    priority: sap.m.OverflowToolbarPriority.Low
                    //*****
                })
            });

            this._setValuesButton = new sap.m.OverflowToolbarButton({
                type: sap.m.ButtonType.Transparent,
                icon: "sap-icon://request",
                text: this._oBundle.getText("SetValues"),
                tooltip: this._oBundle.getText("SetValues"),
                press: oControl.processSetValues.bind(oControl),
                //press: oControl.setValuesDialog.bind(oControl),
                visible: false,
                layoutData: new sap.m.OverflowToolbarLayoutData({
                    //*****Rel 60E_SP6 - QA #11652
                    //priority: sap.m.OverflowToolbarPriority.High
                    priority: sap.m.OverflowToolbarPriority.Low
                    //*****
                })
            });

            this._fullScreenButton = new sap.m.OverflowToolbarButton({
                type: sap.m.ButtonType.Transparent,
                icon: {
                    path: global.vui5.modelName + ">" + "/FULLSCREEN",
                    formatter: function (fullScreen) {
                        if (fullScreen === true) {
                            this.setText(sap.ui.core.IconPool.getIconInfo("exit-full-screen")['text']);
                            this.setTooltip(sap.ui.core.IconPool.getIconInfo("exit-full-screen")['text']);
                            return "sap-icon://exit-full-screen";
                        }
                        else {
                            this.setText(sap.ui.core.IconPool.getIconInfo("full-screen")['text']);
                            this.setTooltip(sap.ui.core.IconPool.getIconInfo("full-screen")['text']);
                            return "sap-icon://full-screen";
                        }
                        //return fullScreen === true ? 'sap-icon://exit-full-screen' : 'sap-icon://full-screen';
                    },
                    mode: sap.ui.model.BindingMode.TwoWay
                },
                visible: true,
                press: oControl.fullScreenDialog.bind(oControl),
                layoutData: new sap.m.OverflowToolbarLayoutData({
                    priority: sap.m.OverflowToolbarPriority.High
                })
            });

            //Mass Edit Button
            this._massEditButton = new sap.m.OverflowToolbarButton({
                type: sap.m.ButtonType.Transparent,
                icon: "sap-icon://write-new-document",
                press: oControl._onMassEdit.bind(oControl),
                text: this._oBundle.getText("MassEditTooltip"),
                tooltip: this._oBundle.getText("MassEditTooltip"),
                visible: false,
                //*****Rel 60E_SP6 - QA #11652            	
                priority: sap.m.OverflowToolbarPriority.Low
                //*****
            });

            this.fieldRef = [];

            var model = new JSONModel();

            var data = {
                'MAX_ITEMS': 0
            };
            model.setData(data);
            this.setModel(model, "VUI_TABLE");

            this._sortItems = [];
            this._filterItems = [];
            this._groupItems = [];
            this.errorList = {};
        };

        T.prototype.isGroupingPresent = function () {
            var model = this.getModel(this.getModelName());
            var fields = model.getProperty(this.getFieldPath());

            if (underscoreJS.isEmpty(model.getProperty(this.getFieldGroupPath()))) {
                return false;
            }
            return underscoreJS.where(fields, { FLGRP: '' }).length !== fields.length;
        };

        T.prototype._prepareTableControls = function () {
            var oControl = this;
            this._initializeVariants();
            this._quickEntryButton = new sap.m.OverflowToolbarButton({
                type: sap.m.ButtonType.Transparent,
                icon: "sap-icon://customer-order-entry",
                visible: this.getEnableQuickEntry(),
                text: this._oBundle.getText("QuickEntry"),
                tooltip: this._oBundle.getText("QuickEntry"),
                enabled: true,
                iconFirst: true,
                activeIcon: "",
                iconDensityAware: true,
                textDirection: "Inherit",
                press: function (oEvent) {
                    oControl.fireOnQuickEntry();
                }
            });



            var headerToolBar = new sap.m.OverflowToolbar({
                content: [oControl._oVuiTitle,
                		  oControl._oVuiSeparator,
                		  oControl._oVariants,
                		  new sap.m.ToolbarSpacer(),
                		  oControl._oSearchField,
                		  oControl._searchAndReplaceButton,
                          oControl._setValuesButton,
                		  oControl._quickEntryButton,
                		  oControl._massEditButton,
                		  oControl._exportButton,
                		  oControl._oPersonalizationButton,
                		  oControl._fullScreenButton
                ]
            });

            var infoToolbar = new sap.m.Toolbar({
                active: true,
                visible: false,
                press: oControl._onInfoToolbar.bind(oControl),
                content: [new sap.m.Label({
                    text: ""
                })]
            });

            //*****Rel 60E_SP6
            var variant = this._oVariants.getSelectionKey();
            if (this.isGroupingPresent() && !oControl._fields && (variant == "*standard*")) {
                oControl._fields = [];
                var fields = this.getModel(this.getModelName()).getProperty(this.getFieldPath());
                underscoreJS.each(fields, function (field, i) {
                    oControl._fields.push(underscoreJS.object(["FLDNAME", "ADFLD", "NO_OUT"], [field["FLDNAME"], field["ADFLD"], field["NO_OUT"]]));
                });
            }
            //*****

            //*****Rel 60E_SP7
            if (!oControl.getHideHeader()) {
                //*****
                oControl.setHeaderToolbar(headerToolBar);
                oControl.setInfoToolbar(infoToolbar);
                //*****Rel 60E_SP7
            }
            //*****            
            oControl.setFixedLayout(false);
        };
        //*****Rel 60E_SP6
        T.prototype.applyElementFeature = function () {
            var oControl = this;
            var oController = this.getController();
            var model = oController.getCurrentModel();
            var layoutData = model.getProperty(oControl.getLayoutDataPath());

            if (layoutData && !oControl._applyElmtFeature) {
                oControl._applyElmtFeature = true;
                if (!underscoreJS.isEmpty(layoutData['FILTERITEMS']) || !underscoreJS.isEmpty(layoutData['SORTITEMS'])) {
                    if (!oControl._PersonalizationDialog) {
                        oControl.createPersonalizationDialog();
                    }

                    oControl.addGroupPanelItem(oControl._PersonalizationDialog);
                    var columns = this._columnPanel.getColumnsItems();
                    this._columnItems = [];
                    underscoreJS.each(columns, function (column) {
                        oControl._columnItems.push({
                            'COLUMNKEY': column.mProperties.columnKey,
                            'INDEX': column.mProperties.index,
                            'VISIBLE': column.mProperties.visible
                        });
                    });
                    oControl._filterItems = layoutData['FILTERITEMS'];
                    oControl._sortItems = layoutData['SORTITEMS'];
                    oControl.updatePersonalizationItems(true);

                }
            }
        };
        //*****        
        T.prototype.addToolBarButton = function (control) {
            var toolbar = this.getHeaderToolbar();
            var index = toolbar.indexOfContent(this._searchAndReplaceButton);
            toolbar.insertContent(control, index);
        };

        T.prototype.removeToolBarButton = function (control) {
            var toolbar = this.getHeaderToolbar();
            toolbar.removeContent(control);
        };


        T.prototype._getTrigger = function () {
            var oControl = this,
                oController;
            oController = oControl.getProperty("controller");
            var t = this.getId() + '-trigger_',
                T = this.getGrowingTriggerText();
            T = T || sap.ui.getCore().getLibraryResourceBundle('sap.m').getText('LOAD_MORE_DATA');
            this.addNavSection(t);
            if (this._oTrigger) {
                this.setTriggerText(T);
                return this._oTrigger;
            }
            this._oTrigger = new sap.m.CustomListItem({
                id: t,
                busyIndicatorDelay: 0,
                type: sap.m.ListType.Active,
                // visible : "{=${"+ this.getModelName() +
                // ">" + this.getDataPath() +"}.length
                // !== " + "${VUI_TABLE>/MAX_ITEMS}" + "}",
                visible: {
                    parts: [{
                        path: this.getModelName() + ">" + this.getDataPath()
                    },
                        {
                            path: this.getModelName() + ">" + this.getTotalNumberOfRows()
                        }],
                    formatter: function (value1, value2) {

                        if (value1 && this.getDomRef()) {
                            if (value1.length != value2) {
                                this.getDomRef().style.display = "";
                            } else {
                                this.getDomRef().style.display = "none";
                            }
                        }
                        if (value1) {
                            return value1.length != value2;
                        } else {
                            return true;
                        }

                    }
                },
                content: new sap.ui.core.HTML({
                    content: '<div class="sapMGrowingListTrigger">' +
                    '<div class="sapMSLITitleDiv sapMGrowingListTriggerText">' +
                    '<h1 class="sapMSLITitle" id="' + t + 'Text">' + jQuery.sap.encodeHTML(T) + '</h1>' +
                    '</div>' +
                    '<div class="vuisapMGrowingListDescription sapMGrowingListDescription sapMSLIDescription" id="' + t + 'Info">' + this._getListItemInfo() + '</div>' +
                    '</div>'
                })
            }).setParent(this, null, true);

            this._oTrigger.attachPress(this.onMoreRows.bind(this));

            this._oTrigger.addEventDelegate({
                onAfterRendering: function (oEvent) {
                    oEvent.srcControl.$().attr({
                        "tabindex": 0,
                        "role": "button",
                        "aria-live": "polite"
                    });
                }
            });
            // .attachPress(function(oEvent){
            // var oControl = this;
            // }, this).addEventDelegate({
            // onsapenter: function(e) {
            // // this.requestNewPage();
            // e.preventDefault();
            // },
            // onsapspace: function(e) {
            // // this.requestNewPage(e);
            // e.preventDefault();
            // },
            // onAfterRendering: function(e) {
            // this._oTrigger.$().attr({
            // 'tabindex': 0,
            // 'role': 'button',
            // 'aria-live': 'polite'
            // });
            // }
            // }, this);
            this._oTrigger.getMode = function () {
                return sap.m.ListMode.None;
            };
            return this._oTrigger;
        };


        T.prototype.onMoreRows = function () {
            var oControl = this,
                params = {};
            var pagingThreshold = parseInt(this.getPagingThreshold());
            var numberOfRowsVisible = this.getModel(this.getModelName()).getProperty(this.getDataPath()).length;
            var pageNumber = numberOfRowsVisible / pagingThreshold;
            pageNumber = pageNumber + 1;
            params[global.vui5.cons.params.pageNumber] = pageNumber;
            oControl.firePageChange({
                urlParams: params
            });


        };


        T.prototype._getListItemInfo = function () {
            return ('[ ' + "{=${" + this.getModelName() + ">" + this.getDataPath() + "}.length}" + ' / ' + "{" + this.getModelName() + ">" + this.getTotalNumberOfRows() + "}" + ' ]');
        };
        T.prototype.setTriggerText = function (t) {
            this.$('triggerText').text(t);
        };

        T.prototype.setTotalNumberOfRows = function (value) {
            this.setProperty("totalNumberOfRows", value, true);
        };

        T.prototype.setDataAreaPath = function (value) {
            this.setProperty("dataAreaPath", value, true);
            // this.prepareTableData();
        };

        T.prototype.setPagingThreshold = function (value) {
            this.setProperty("pagingThreshold", value, true);
            if (value && parseInt(value) != "Nan") {
                this.setProperty("growingScrollToLoad", false, true);
                this.setProperty("growingThreshold", parseInt(value), true);
            } else {
                this.setProperty("growingThreshold", 0, true);
                this.setProperty("growingScrollToLoad", true, true);
            }
            if (this.getProperty("pagingType") == global.vui5.cons.pagingType.noPaging) {
                this.setProperty("growingThreshold", 100, true);
            }
        };

        T.prototype.setTitle = function (value) {
            this.setProperty("title", value, true);
            this._oVuiTitle.setText(value);
        };

        T.prototype.setEnableLocalSearch = function (value) {
            this.setProperty("enableLocalSearch", value, true);
            this._oSearchField.setVisible(value);
        };
        /****** Rel 60E_SP7 TASK #52848  */
        T.prototype.setMergeDuplicates = function (value) {
            this.setProperty("mergeDuplicates", value, true);
        };
        /***/
        T.prototype.setShowTitle = function (value) {
            this.setProperty("showTitle", value, true);
            this._oVuiTitle.setVisible(value);
            this.showSeparator();
            // this._oVuiSeparator.setVisible(value);
        };

        T.prototype.setPagingType = function (value) {
            this.setProperty("pagingType", value, true);
            if (value == global.vui5.cons.pagingType.serverPaging) {
                this.setGrowing(false);
            } else { // if(value == "1") {
                this.setGrowing(true);
                // }else {
                // this.setGrowing(false);
            }
            // if (value == c) {
            this.setProperty("growingThreshold", 100, true);
            //}
        };

        T.prototype.setFieldPath = function (value) {
            this.setProperty("fieldPath", value, true);
        };

        T.prototype.setDataPath = function (value) {
            this.setProperty("dataPath", value, true);
        };

        T.prototype.setModelName = function (value) {
            this.setProperty("modelName", value, true);
        };

        T.prototype.setSectionID = function (value) {
            this.setProperty("sectionID", value, true);
        };

        T.prototype.setVariantDataPath = function (value) {
            this.setProperty("variantDataPath", value, true);
        };

        T.prototype.setLayoutDataPath = function (value) {
            this.setProperty("layoutDataPath", value, true);
        };

        T.prototype.setTotalDataPath = function (value) {
            this.setProperty("totalDataPath", value, true);
        };

        T.prototype.setSelectedVariant = function (value) {
            this.setProperty("selectedVariant", value, true);
        };

        T.prototype.setFullScreen = function (value) {
            this.setProperty("fullScreen", value, true);
            if (this._fullScreenButton) {

                this._fullScreenButton.setVisible(value);
            }
        };

        T.prototype.setEnablePersonalization = function (value) {
            this.setProperty("enablePersonalization", value, true);
            if (this._oPersonalizationButton) {
                this._oPersonalizationButton.setVisible(value)
            }
        };

        T.prototype.setEditable = function (value) {
            if (value != this.getEditable()) {
                this.setProperty("editable", value, true);
                if (value) {
                    var enable = this.getEnableSearchAndReplace();
                    if (enable) {
                        this._searchAndReplaceButton.setVisible(true);
                    }
                    else {
                        this._searchAndReplaceButton.setVisible(false);
                    }

                    var enableSetValues = this.getEnableSetValues();
                    if (enableSetValues) {
                        this._setValuesButton.setVisible(true);
                    }
                    else {
                        this._setValuesButton.setVisible(false);
                    }
                    if (this.getEnableBulkEdit()) {
                        this._massEditButton.setVisible(true);
                    } else {
                        this._massEditButton.setVisible(false);
                    }
                }
            }
        };

        T.prototype.setHideVariantSave = function (value) {
            this.setProperty("hideVariantSave", value, true);
        };

        /***Rel 60E SP6 ECDM #4728 - Start ***/
        T.prototype.setHideShare = function (value) {
            this.setProperty("hideShare", value, true);
        };
        /***Rel 60E SP6 ECDM #4728 - End ***/

        T.prototype.setEnableSetValues = function (value) {
            this.setProperty("enableSetValues", value, true);
            var editable = this.getEditable();
            if (editable && !value) {
                this._setValuesButton.setVisible(true);
            } else {
                this._setValuesButton.setVisible(false);
            }
        };

        T.prototype.setEnableSearchAndReplace = function (value) {
            this.setProperty("enableSearchAndReplace", value, true);
            var editable = this.getEditable();
            if (editable && !value) {
                this._searchAndReplaceButton.setVisible(true);
            } else {
                this._searchAndReplaceButton.setVisible(false);
            }
        };
        T.prototype.setDisableExcelExport = function (value) {
            this.setProperty("disableExcelExport", value, true);
            var excelExport = this._exportButton;
            if (value && excelExport) {
                this._exportButton.setVisible(false);
            }
            else {
                this._exportButton.setVisible(true);
            }
        };

        //*****Rel 60E_SP7
        T.prototype.setHideHeader = function (value) {
            this.setProperty("hideHeader", value, true);
        };
        //*****

        T.prototype.prepareTable = function () {
            var oControl = this;
            oControl._prepareTableControls();
            oControl.prepareTableFields();
            oControl.prepareTableData();
            /***Rel 60E SP7 Layout Control - Start ***/
            if (oControl.getDisableTableHeader()) {
                oControl.addStyleClass("vuiNoHeaders");
            }
            /***Rel 60E SP7 Layout Control - End ***/
        };

        T.prototype.setHandle = function (value) {
            this.setProperty("handle", value, true);
            this.showSeparator();
        };

        T.prototype.getSelectedRows = function () {
            var oControl = this;

            var selectedRows = this.getSelectedItems();

            var selectedItems = [];
            for (var i = 0; i < selectedRows.length; i++) {
                var rowData = selectedRows[i].getBindingContext(oControl.getModelName()).getObject();
                selectedItems.push(rowData);
            }
            return selectedItems;
        };

        T.prototype.getContextByIndex = function (i) {
            var B = this.getBinding("items");
            return i >= 0 && B ? B.getContexts(i, 1)[0] : null;
        };

        T.prototype.showSeparator = function () {
            var showTitle = this.getShowTitle();
            var handle = this.getHandle();
            if (showTitle && handle) {
                this._oVuiSeparator.setVisible(true);
            } else {
                this._oVuiSeparator.setVisible(false);
            }


            if (this.getHideVariantSave()) {
                this._oVuiSeparator.setVisible(false);

            }
        };

        T.prototype.onChangeUpdateIndicator = function (oEvent) {
            var oControl = this;
            var source = oEvent.getSource();
            /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - Start ***/
            //var path = source.getBindingContext(oControl.getModelName()).getPath();

            var path, oController, arr;
            oController = oControl.getProperty("controller");
            if (oController._isMultiInputField(source)) {
                arr = source.data("dataPath").split("/");
                arr.pop();
                path = arr.join("/");
            }
            else {
                path = source.getBindingContext(oControl.getModelName()).getPath();
            }
            /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - End ***/
            var object = underscoreJS.find(this._oChangedRowsPath, {
                'PATH': path
            });

            if (!object) {
                this._oChangedRowsPath.push({
                    'PATH': path
                });
            }

            // var rowLine = model.getProperty(path);
            // rowLine.__UPDKZ = 'X';
            // model.setProperty(path,rowLine);
        };

        T.prototype.prepareTableFieldGroups = function () {

            var oControl = this;
            var fieldPath = this.getFieldPath();
            var fieldGroupPath = this.getFieldGroupPath();
            var modelName = this.getModelName();

            this.bindAggregation("columns", modelName + ">" + fieldGroupPath, function (sId, oContext) {
                var contextObject = oContext.getObject();
                var groupPath = oContext.getPath();
                var demandPopin = !contextObject['KEY'];

                var visible;
                var modelName = oControl.getModelName();
                var editable = oControl.getEditable();

                var oText = new sap.m.Text({
                    //text: contextObject['LABEL']
                    //                    text: "{" + modelName + ">" + oContext.getPath() + "/LABEL}"
                    //*****Rel 60E_SP6
                    visible: "{= ${" + modelName + ">" + oContext.getPath() + "/HDLBL} === '' }",
                    //*****
                    text: "{" + modelName + ">" + oContext.getPath() + "/DESCR}"
                });

                var columnobject = underscoreJS.find(oControl._columnItems, {
                    'COLUMNKEY': contextObject['FLDNAME']
                });
                if (columnobject) {
                    if (columnobject['VISIBLE'] == "true" || columnobject['VISIBLE'] == true || columnobject['VISIBLE'] == "X") {
                        visible = true;
                    }
                    else {
                        visible = false;
                    }
                }

                var halign;
                if (contextObject['FLSTL'] == global.vui5.cons.styleType.icon) {
                    halign = sap.ui.core.TextAlign.Center;
                }
                else if (contextObject['INTTYPE'] == global.vui5.cons.intType.number ||
                    contextObject['INTTYPE'] == global.vui5.cons.intType.date ||
                contextObject['INTTYPE'] == global.vui5.cons.intType.time || contextObject['INTTYPE'] == global.vui5.cons.intType.integer
                || contextObject['INTTYPE'] == global.vui5.cons.intType.oneByteInteger || contextObject['INTTYPE'] == global.vui5.cons.intType.twoByteInteger
                || contextObject['INTTYPE'] == global.vui5.cons.intType.packed || contextObject['INTTYPE'] == global.vui5.cons.intType.float
                || contextObject['INTTYPE'] == global.vui5.cons.intType.decimal16 || contextObject['INTTYPE'] == global.vui5.cons.intType.decimal32) {
                    halign = sap.ui.core.TextAlign.Right;
                }
                else {
                    halign = sap.ui.core.TextAlign.Left;
                }

                var column;
                if (demandPopin) {
                    if (contextObject['SHPOP'] == "X") {
                        column = new sap.m.Column({
                            header: oText,
                            visible: "{= ${" + modelName + ">" + groupPath + "/HDGRP} === '' }",
                            demandPopin: demandPopin,
                            minScreenWidth: global.vui5.cons.screenSize.desktop,
                            width: "auto",
                            hAlign: halign,
                            popinDisplay: sap.m.PopinDisplay.Inline
                        });
                    } else {
                        column = new sap.m.Column({
                            header: oText,
                            visible: "{= ${" + modelName + ">" + groupPath + "/HDGRP} === '' }",
                            demandPopin: demandPopin,
                            minScreenWidth: "Tablet",
                            width: "auto",
                            hAlign: halign,
                            popinDisplay: sap.m.PopinDisplay.Inline
                        });
                    }
                } else {
                    column = new sap.m.Column({
                        header: oText,
                        visible: "{= ${" + modelName + ">" + groupPath + "/HDGRP} === '' }",
                        demandPopin: demandPopin,
                        width: "auto",
                        hAlign: halign,
                        popinDisplay: sap.m.PopinDisplay.Inline
                    });
                }
                column.data("contextObject", contextObject)
                return column;
            });
        };
        T.prototype.prepareTableFields = function () {

            var oControl = this;
            var fieldPath = this.getFieldPath();
            var fieldGroupPath = oControl.getFieldGroupPath();
            var modelName = this.getModelName();
            var model = oControl.getModel(modelName);
            var fieldGroups = model.getProperty(fieldGroupPath);
            var fields = model.getProperty(fieldPath);
            if (oControl.isGroupingPresent()) {
                this.prepareTableFieldGroups();
            }
            else {
                if (fieldPath && modelName) {

                    this.bindAggregation("columns", modelName + ">" + fieldPath, function (sId, oContext) {
                        var contextObject = oContext.getObject();
                        var demandPopin = !contextObject['KEY'];

                        var visible;
                        var modelName = oControl.getModelName();
                        var editable = oControl.getEditable();
                        var width = 'auto';
                        /****** Rel 60E_SP7 TASK #52848  */
                        var mergeDuplicates, allowMergeDuplicates = false;
                        mergeDuplicates = oControl.getMergeDuplicates();
                        /***/
                        var oText = new sap.m.Text({
                            //text: contextObject['LABEL']
                            //*****Rel 60E_SP6
                            visible: "{= ${" + modelName + ">" + oContext.getPath() + "/HDLBL} === '' }",
                            //*****
                            text: "{" + modelName + ">" + oContext.getPath() + "/LABEL}"
                        });

                        if (editable) {
                            visible = "{= ${" + modelName + ">" + oContext.getPath() + "/NO_OUT} === '' }";
                        } else {
                            visible = "{= ${" + modelName + ">" + oContext.getPath() + "/NO_OUT} === '' &&" + " ${" + modelName + ">" + oContext.getPath() + "/ADFLD} === '' }";
                        }
                        var columnobject = underscoreJS.find(oControl._columnItems, {
                            'COLUMNKEY': contextObject['FLDNAME']
                        });
                        if (columnobject) {
                            if (columnobject['VISIBLE'] == "true" || columnobject['VISIBLE'] == true || columnobject['VISIBLE'] == "X") {
                                visible = true;
                            }
                            else {
                                visible = false;
                            }
                        }
                        /****** Rel 60E_SP7 TASK #52848  */
                        if (mergeDuplicates && contextObject['MERGE_DUPLICATES'] == "X" && !editable) {
                            allowMergeDuplicates = true;
                        }
                        /***/
                        var halign;

                        if (contextObject['HALIGN']) {
                            halign = contextObject['HALIGN'];
                        }
                        else if (contextObject['FLSTL'] == global.vui5.cons.styleType.icon) {
                            halign = sap.ui.core.TextAlign.Center;
                        }
                        else if (
                            contextObject['INTTYPE'] == global.vui5.cons.intType.number ||
                            contextObject['INTTYPE'] == global.vui5.cons.intType.date ||
                        contextObject['INTTYPE'] == global.vui5.cons.intType.time || contextObject['INTTYPE'] == global.vui5.cons.intType.integer
                        || contextObject['INTTYPE'] == global.vui5.cons.intType.oneByteInteger || contextObject['INTTYPE'] == global.vui5.cons.intType.twoByteInteger
                        || contextObject['INTTYPE'] == global.vui5.cons.intType.packed || contextObject['INTTYPE'] == global.vui5.cons.intType.float
                        || contextObject['INTTYPE'] == global.vui5.cons.intType.decimal16 || contextObject['INTTYPE'] == global.vui5.cons.intType.decimal32) {
                            halign = sap.ui.core.TextAlign.Right;
                        }
                        else {
                            halign = sap.ui.core.TextAlign.Left;
                        }

                        if (contextObject['WIDTH']) {
                            width = contextObject['WIDTH'];
                        }
                        var column;
                        if (demandPopin) {
                            if (contextObject['SHPOP'] == "X") {
                                column = new sap.m.Column({
                                    visible: visible,
                                    header: oText,
                                    /****** Rel 60E_SP7 TASK #52848  */
                                    mergeDuplicates: allowMergeDuplicates,
                                    /***/
                                    demandPopin: demandPopin,
                                    minScreenWidth: global.vui5.cons.screenSize.desktop,
                                    width: width,
                                    hAlign: halign,
                                    popinDisplay: sap.m.PopinDisplay.Inline
                                });
                            } else {
                                column = new sap.m.Column({
                                    visible: visible,
                                    header: oText,
                                    /****** Rel 60E_SP7 TASK #52848  */
                                    mergeDuplicates: allowMergeDuplicates,
                                    /***/
                                    demandPopin: demandPopin,
                                    minScreenWidth: "Tablet",
                                    width: width,
                                    hAlign: halign,
                                    popinDisplay: sap.m.PopinDisplay.Inline
                                });
                            }
                        } else {
                            column = new sap.m.Column({
                                visible: visible,
                                header: oText,
                                /****** Rel 60E_SP7 TASK #52848  */
                                mergeDuplicates: allowMergeDuplicates,
                                /***/
                                demandPopin: demandPopin,
                                width: width,
                                hAlign: halign,
                                popinDisplay: sap.m.PopinDisplay.Inline
                            });
                        }

                        column.data("contextObject", contextObject)
                        if (columnobject) {
                            column.setOrder(columnobject['INDEX']);
                        }
                        return column;
                    });

                }
            }
        };

        T.prototype.setFieldType = function (selection, fieldInfo) {
            // var oController = this.getController();
            if (fieldInfo['SDSCR'] == global.vui5.cons.fieldValue.value || fieldInfo['SDSCR'] == global.vui5.cons.fieldValue.value_descr) {
                if (fieldInfo['INTTYPE'] == global.vui5.cons.intType.number ||
                    // fieldInfo['INTTYPE'] == 'I' ||
                    // fieldInfo['INTTYPE'] == 'P' ||
                    fieldInfo['INTTYPE'] == global.vui5.cons.intType.oneByteInteger || fieldInfo['INTTYPE'] == global.vui5.cons.intType.twoByteInteger || fieldInfo['INTTYPE'] == global.vui5.cons.intType.float
                    || fieldInfo['INTTYPE'] == global.vui5.cons.intType.decimal16 || fieldInfo['INTTYPE'] == global.vui5.cons.intType.decimal32) {
                    selection.setType(sap.m.InputType.Number);
                }
            }
        };

        T.prototype.handleDescriptionField = function (selection, fieldInfo, dataPath, fieldPath, bindingMode) {

            // var oController = this.getController();
            var modelName = this.getModelName();
            var descriptionPath;

            /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - Start ***/
            if (fieldInfo['MULTISELECT']) {
                return;
            }
            /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - End ***/

            if (fieldInfo['SDSCR'] == global.vui5.cons.fieldValue.description || fieldInfo['SDSCR'] == global.vui5.cons.fieldValue.value_cont_descr) {

                // descriptionPath = dataPath + "/" +
                // fieldInfo['TXTFL'] ;
                descriptionPath = fieldInfo['TXTFL'];
                selection.bindValue(modelName + ">" + descriptionPath, null, bindingMode);
                selection.data("model", modelName);
                selection.data("path", fieldPath);
                // selection.attachChange(oController.getDescription.bind(oController));
                selection.setMaxLength(60);
            } else if (fieldInfo['SDSCR'] == global.vui5.cons.fieldValue.value_descr) {
                selection.bindValue(modelName + ">" + fieldInfo['FLDNAME'], null, bindingMode);
                selection.data("model", modelName);
                selection.data("path", fieldPath);
                // selection.attachChange(oController.getDescription.bind(oController));
            } else {
                selection.bindValue(modelName + ">" + fieldInfo['FLDNAME'], null, bindingMode);
            }
        };

        T.prototype.resetControl = function () {
            this._oChangedRowsPath = [];
            this._oChangedCellControls = [];
            this._oChangedRowFields = [];

        };

        T.prototype.getChangedRows = function () {
            var model = this.getModel(this.getModelName());
            var items = [];
            underscoreJS.each(this._oChangedRowsPath, function (path) {
                items.push(model.getProperty(path['PATH']));
            });

            // this.resetControl();

            return items;


        };


        T.prototype._onInputChange = function (selection, fieldInfo, rowDataPath, refPath, refFields, rowIndex) {
            var oControl = this,
                binding;
            binding = oControl.getBinding("items");

            if (fieldInfo['MULTISELECT']) {
                return;
            }

            if (fieldInfo['ELTYP'] === global.vui5.cons.element.checkBox) {
                selection.attachSelect(function (oEvent) {
                    binding.bSuspended = true;
                    oControl._oEvent = underscoreJS.clone(oEvent);
                    oControl._preProcessOnInputChange(oEvent, selection, fieldInfo, rowDataPath, refPath, refFields, rowIndex);
                    oControl.processOnInputChange(oEvent).then(function () {
                        oControl._postProcessOnInputChange(oControl._oEvent);
                    }).fail(function (errorContext) {
                        oControl._postProcessOnInputChange(oControl._oEvent, errorContext);
                    });

                });
                //*****Rel 60E_SP6 - Task #39097
            } else if (fieldInfo['ELTYP'] === global.vui5.cons.element.toggle) {
                selection.attachChange(function (oEvent) {
                    binding.bSuspended = true;
                    oControl._oEvent = underscoreJS.clone(oEvent);
                    oControl._preProcessOnInputChange(oEvent, selection, fieldInfo, rowDataPath, refPath, refFields, rowIndex);
                    oControl.processOnInputChange(oEvent).then(function () {
                        oControl._postProcessOnInputChange(oControl._oEvent);
                    }).fail(function (errorContext) {
                        oControl._postProcessOnInputChange(oControl._oEvent, errorContext);
                    });
                });
                //*****
            } else if (fieldInfo['ELTYP'] === global.vui5.cons.element.dropDown) {
                selection.attachChange(function (oEvent) {
                    binding.bSuspended = true;
                    oControl._oEvent = underscoreJS.clone(oEvent);
                    oControl._preProcessOnInputChange(oEvent, selection, fieldInfo, rowDataPath, refPath, refFields, rowIndex);
                    oControl.processOnInputChange(oEvent).then(function () {
                        oControl._postProcessOnInputChange(oControl._oEvent);
                    }).fail(function (errorContext) {
                        oControl._postProcessOnInputChange(oControl._oEvent, errorContext);
                    });

                });
            } else if (fieldInfo['ELTYP'] !== global.vui5.cons.element.link && fieldInfo['ELTYP'] !== global.vui5.cons.element.button && fieldInfo['ELTYP'] !== vui5.cons.element.label &&
                //*****Rel 60E_SP7  
            	       fieldInfo['ELTYP'] != global.vui5.cons.element.objectStatus &&
               		   fieldInfo['ELTYP'] !== global.vui5.cons.element.toggle_inputs) {
                //*****            	
                selection.attachChange(function (oEvent) {
                    binding.bSuspended = true;
                    oControl._oEvent = underscoreJS.clone(oEvent);
                    oControl._preProcessOnInputChange(oEvent, selection, fieldInfo, rowDataPath, refPath, refFields, rowIndex);
                    oControl.processOnInputChange(oEvent).then(function () {
                        oControl._postProcessOnInputChange(oControl._oEvent);
                    }).fail(function (errorContext) {
                        oControl._postProcessOnInputChange(oControl._oEvent, errorContext);
                    });

                });
            }
        };

        T.prototype._preProcessOnInputChange = function (oEvent, selection, fieldInfo, rowDataPath, refPath, refFields, rowIndex) {
            var oControl = this;
            if (!oEvent.mParameters) {
                oEvent.mParameters = {};
            }
            var source = oEvent.getSource();

            var pathFieldName;

            if (fieldInfo['ELTYP'] === global.vui5.cons.element.checkBox || fieldInfo['ELTYP'] === global.vui5.cons.element.toggle) {
                pathFieldName = fieldInfo['FLDNAME'];
            }
            else if (fieldInfo['ELTYP'] === global.vui5.cons.element.dropDown) {
                pathFieldName = source.getBinding("selectedKey").getPath();
            }
            else {
                pathFieldName = source.getBinding("value").getPath();
            }

            source.data("dataPath", source.getBindingContext(oControl.getModelName()).getPath() + "/" + pathFieldName);


            oEvent.mParameters['fieldInfo'] = fieldInfo;
            oEvent.mParameters['refPath'] = refPath;
            oEvent.mParameters['dataPath'] = rowDataPath;
            oEvent.mParameters['refFields'] = refFields;
            oEvent.mParameters['fieldRefControl'] = oControl.fieldRef;
            oEvent.mParameters['selection'] = selection;
            oEvent.mParameters['rowIndex'] = rowIndex;

            //*****Rel 60E_SP6
            if (fieldInfo['ELTYP'] !== global.vui5.cons.element.checkBox &&
                fieldInfo['ELTYP'] !== global.vui5.cons.element.toggle/* &&
                fieldInfo['ELTYP'] !== global.vui5.cons.element.dropDown*/) {
                //*****
                if (underscoreJS.isEmpty(oControl._oChangedRowFields)) {
                    oControl._oChangedRowFields.push({
                        "FLDNAME": pathFieldName,
                        "INDEX": rowIndex
                    });
                }
                else if (!underscoreJS.isObject(underscoreJS.findWhere(oControl._oChangedRowFields, { 'FLDNAME': pathFieldName, "INDEX": rowIndex }))) {
                    oControl._oChangedRowFields.push({
                        "FLDNAME": pathFieldName,
                        "INDEX": rowIndex
                    });
                }

                oControl.resetCellValueChangeColor(oEvent.getSource());
                //*****Rel 60E_SP6
            }
            //*****            

        };

        T.prototype._postProcessOnInputChange = function (oEvent, errorContext) {
            var oControl = this,
                binding,
                refFields;
            switch (errorContext) {
                case global.vui5.cons.errorContext.onInputValueChange:
                case global.vui5.cons.errorContext.onInputValueCheck:
                    oControl.errorList[oEvent.getSource().getId()] = true;
                    break;

                case global.vui5.cons.errorContext.onInputValueConversion:
                    refFields = oEvent.getParameter("refFields");
                    refFields = refFields ? underscoreJS.isArray(refFields) ? refFields : [refFields] : undefined;
                    if (underscoreJS.isEmpty(refFields)) {
                        oControl.errorList[oEvent.getSource().getId()] = true;
                    } else {
                        underscoreJS.each(refFields, function (obj) {
                            if (obj['CONTROL'].getValueState() === sap.ui.core.ValueState.Error) {
                                oControl.errorList[obj['CONTROL'].getId()] = true;
                            } else {
                                delete oControl.errorList[obj['CONTROL'].getId()];
                            }
                        });
                    }

                    break;
                default:
                    delete oControl.errorList[oEvent.getSource().getId()];
                    oControl.setCellValueChangeColor(oEvent.getSource());
                    binding = oControl.getBinding("items");
                    if (Object.keys(oControl.errorList).length > 0) {
                        binding.bSuspended = true;
                    } else {
                        binding.bSuspended = false;
                        binding.checkUpdate(false);
                    }

                    break;

            }
        };
        T.prototype.setDateValue = function (value) {
            return this.setVuiDateValue(value == "0000-00-00" ? "" : value);
        },

        T.prototype.prepareFieldGroupControl = function (oContext) {

            var oControl = this;
            var modelName = oControl.getModelName();
            var model = oControl.getModel(modelName);
            var fieldsPath = oControl.getFieldPath();
            var fieldGroups = model.getProperty(oControl.getFieldGroupPath());
            var fields = model.getProperty(fieldsPath);
            var cells = [];

            var columnL, columnM, emptyL, emptyM, singleGroup, labelSpanL, labelSpanS, columnXL, columnS;

            underscoreJS.each(fieldGroups, function (group, grpIndex) {
                var group_fields;
                group_fields = group['FLDNAME'] ? underscoreJS.where(fields, { FLDNAME: group['FLDNAME'], ADFLD: '' }) :
        						   underscoreJS.where(fields, { FLGRP: group['FLGRP'], ADFLD: '' });
                if (group_fields.length != 0) {
                    var vBox, hBox;
                    vBox = new sap.m.VBox();
                    underscoreJS.each(group_fields, function (field, fieldIndex) {
                        if (field['ADFLD'] === 'X' && field['FLGRP'] !== '') {
                            return;
                        }
                        hBox = new sap.m.HBox({
                            width: "100%",
                            height: "100%",
                            justifyContent: sap.m.FlexJustifyContent.Inherit,
                            alignItems: sap.m.FlexAlignItems.Start

                        });
                        var actualFieldIndex = underscoreJS.findIndex(fields, field);
                        if (!group['FLDNAME'] && !field['HDLBL']) {
                            var fieldLabel = new sap.m.Label({
                                text: "{" + modelName + ">" + fieldsPath + actualFieldIndex + "/LABEL}",
                                textAlign: sap.ui.core.TextAlign.End,
                                design: sap.m.LabelDesign.Bold,
                                visible: "{= ${" + modelName + ">" + fieldsPath + actualFieldIndex + "/NO_OUT} === '' &&" +
	                					" ${" + modelName + ">" + fieldsPath + actualFieldIndex + "/ADFLD} === ''}"
                            });
                            fieldLabel.setTextAlign(sap.ui.core.TextAlign.Right);
                            hBox.addItem(fieldLabel);
                            hBox.addItem(new sap.m.Text({
                                text: ":",
                                visible: "{= ${" + modelName + ">" + fieldsPath + actualFieldIndex + "/NO_OUT} === '' &&" +
            							 " ${" + modelName + ">" + fieldsPath + actualFieldIndex + "/ADFLD} === '' }"
                            }).addStyleClass("vuiSmallMarginEnd"));
                        }
                        var controlFields = [field];
                        var refField;
                        if (field['CFIELDNAME']) {
                            refField = underscoreJS.where(fields, { FLDNAME: field['CFIELDNAME'], ADFLD: 'X' })[0];
                        } else if (field['QFIELDNAME']) {
                            refField = underscoreJS.where(fields, { FLDNAME: field['QFIELDNAME'], ADFLD: 'X' })[0];
                        }
                        if (refField) controlFields.push(refField);
                        var fieldInputs = oControl.getEditable() ? oControl.prepareTableRowData(controlFields, oContext) :
                        	[oControl.prepareTableRowData(controlFields, oContext)[0]];
                        underscoreJS.each(fieldInputs, function (fieldInput) {
                            fieldInput.bindProperty("visible", {
                                parts: [{ path: modelName + ">" + fieldsPath + actualFieldIndex + "/NO_OUT" }],
                                formatter: function (no_out) {
                                    return no_out !== 'X';
                                },
                                mode: sap.ui.model.BindingMode.TwoWay
                            });

                            hBox.addItem(fieldInput);
                        });


                        vBox.addItem(hBox);
                    });

                    cells.push(vBox);
                }
            });
            return cells;

        },

        T.prototype.prepareTableRowData = function (fields, oContext) {

            var oControl = this;
            var oController = oControl.getController();
            var contextObject = oContext.getObject();
            var arr = oContext.getPath().split('/');
            var contextIndex = arr[arr.length - 1];
            var modelName = oControl.getModelName();
            var model = oControl.getModel(modelName);
            var dataArea = model.getProperty(oControl.getDataAreaPath());
            var dataPath = oControl.getDataPath();
            var cells = [];
            var editable = oControl.getEditable();
            if (editable) {

                underscoreJS.each(fields, function (obj, index) {

                    var selection;

                    var actualFieldIndex = underscoreJS.findIndex(model.getProperty(oControl.getFieldPath()), obj);

                    var fieldPath = oControl.getFieldPath() + actualFieldIndex;

                    var txtflPath;
                    var path = obj['FLDNAME'];

                    bindingMode = sap.ui.model.BindingMode.TwoWay;

                    if (obj['FLSTL'] == global.vui5.cons.styleType.icon) {

                        selection = oControl.__createIconControl(obj, modelName, oContext.getObject());
                        cells.push(selection);

                    } else if (obj['SETCONTROL'] != undefined && obj['SETCONTROL'] != "") {
                        func = obj['SETCONTROL'];
                        selection = func(oContext.getPath() + "/" + path);
                        cells.push(selection);
                    } else {

                        if (obj['DATATYPE'] == global.vui5.cons.dataType.date || obj['DATATYPE'] == global.vui5.cons.dataType.time || obj['DATATYPE'] == global.vui5.cons.dataType.amount
                            || obj['DATATYPE'] == global.vui5.cons.dataType.quantity || obj['DATATYPE'] == global.vui5.cons.dataType.decimal ||
                            obj['DATATYPE'].substr(0, 3) == global.vui5.cons.dataType.integer) {
                            obj['ELTYP'] = global.vui5.cons.element.input;
                        }

                        var refPath;
                        /*
     * Rel 60E_SP5
     */
                        if (model.getProperty(dataPath + "/EDITABLECELLS") || model.getProperty(dataPath + "/READONLYCOLUMNS")) {
                            var sectionPath = oControl.getFieldPath().substring(0, oControl.getFieldPath().lastIndexOf("/") - 6);

                            /*  var lv_editable =
          "{= (${" + global.vui5.modelName + ">/DOCUMENT_MODE} !== 'A' || ${" + oControl.getModelName() + ">" + sectionPath + "EDIT} === 'X' ) &&" + "${" + modelName + ">" + "EDITABLECELLS}.indexOf('<" + obj['FLDNAME']
        + ">') !== -1 &&" + "${" + modelName + ">" + fieldPath + "/DISABLED} === '' &&" + "${" + modelName + ">" + "READONLYCOLUMNS}.indexOf('<"
        + obj['FLDNAME'] + ">') === -1 }";*/

                            var lv_editable =
                                "{= ( ${" + global.vui5.modelName + ">/DOCUMENT_MODE} !== 'A' || ${" + oControl.getModelName() + ">" + sectionPath + "EDIT} === 'X' ) && " +
                                "(( ${" + modelName + ">" + oContext.getPath() + "/EDITABLECELLS} === '' || ${" + modelName + ">" + oContext.getPath() + "/EDITABLECELLS}.indexOf('<" + obj['FLDNAME'] + ">') === -1 || ${" + modelName + ">" + oContext.getPath() + "/EDITABLECELLS}.indexOf('<" + obj['FLDNAME'] + ">') !== -1) &&" +
                                "${" + modelName + ">" + fieldPath + "/DISABLED} === '' ) && " +
                                "${" + modelName + ">" + oContext.getPath() + "/READONLYCOLUMNS}.indexOf('<" + obj['FLDNAME'] + ">') === -1 }";
                        } else {
                            var lv_editable = "{= (${" + global.vui5.modelName + ">/DOCUMENT_MODE} !== 'A' || ${" + oControl.getModelName() + ">" + sectionPath + "/EDIT} === 'X' ) &&" + " ${" + modelName + ">" + fieldPath + "/DISABLED} === '' }";
                        }
                        /*
     * Rel 60E_SP5
     */

                        switch (obj['ELTYP']) {
                            case global.vui5.cons.element.input:
                                if (obj['DATATYPE'] == global.vui5.cons.dataType.date) {
                                    selection = new sap.m.DatePicker({
                                        //displayFormat: "long",
                                        //*****Rel 60E_SP6
                                        //valueFormat: "YYYY-MM-dd",
                                        valueFormat: vui5.cons.date_format,
                                        //*****
                                        placeholder: " ",
                                        change: function (oEvent) {
                                            oControl.resetCellValueChangeColor(oEvent.getSource());
                                            oController.dateFieldCheck(oEvent);
                                        },
                                        editable: lv_editable
                                    }).bindValue(modelName + ">" + path, null, bindingMode);
                                    selection.addStyleClass('vuiDatePicker');
                                    selection.bindProperty("displayFormat",
                                        global.vui5.modelName + ">" + global.vui5.cons.modelPath.sessionInfo + "/DATFM",
                                        Formatter.displayFormat,
                                        sap.ui.model.Binding.OneWay);
                                    selection.setVuiDateValue = selection.setValue;
                                    selection.setValue = oControl.setDateValue.bind(selection);
                                } else if (obj['DATATYPE'] == global.vui5.cons.dataType.time) {
                                    selection = new sap.m.TimePicker({
                                        valueFormat: "HH:mm:ss",
                                        displayFormat: "HH:mm:ss",
                                        editable: lv_editable
                                    }).bindValue(modelName + ">" + path, null, bindingMode);
                                    selection.addStyleClass('vuiTimePicker');
                                } else if (obj['DATATYPE'] == global.vui5.cons.dataType.amount) {

                                    selection = new sap.m.Input({
                                        showValueHelp: false,
                                        maxLength: parseInt(obj['OUTPUTLEN']),
                                        editable: lv_editable
                                    });
                                    if (obj['TXTFL'] != '') {
                                        // txtflPath
                                        // =
                                        // oContext.getPath()
                                        // +
                                        // "/"
                                        // +
                                        // obj['TXTFL'];
                                        txtflPath = obj['TXTFL'];
                                        selection.bindValue(modelName + ">" + txtflPath, null, bindingMode);
                                    }
                                    selection.setTextAlign(sap.ui.core.TextAlign.End);

                                    /*
                                 * QA Issue 7022 Changes - START
                                 */
                                    if (obj['CFIELDNAME'] && contextObject[obj['CFIELDNAME']] != '') {
                                        refPath = oContext.getPath() + "/" + obj['CFIELDNAME'];
                                    } else if (obj['CURRENCY'] != '') {
                                        refPath = oControl.getFieldPath() + index + '/' + obj['CURRENCY'];
                                    } else if (obj['CFIELDNAME']) {
                                        refPath = oContext.getPath() + "/" + obj['CFIELDNAME'];
                                    }

                                    /*
                                 * if(obj['CFIELDNAME'] &&
                                 * contextObject[obj['CFIELDNAME']] !=
                                 * '') { refPath = oContext.getPath() +
                                 * "/" + obj['CFIELDNAME']; }else {
                                 * if(obj['CURRENCY'] != ''){ refPath =
                                 * oControl.getFieldPath() + index + '/' +
                                 * obj['CURRENCY']; }else{ refPath =
                                 * oContext.getPath() + "/" +
                                 * obj['CFIELDNAME']; } }
                                 */
                                    if (refPath)
                                        selection.data("currencyPath", refPath);

                                    /*
                                 * QA Issue 7022 Changes - END
                                 */

                                    selection.data("FLDNAME", obj['FLDNAME']);
                                    selection.data("TABNAME", obj['TABNAME']);
                                } else if (obj['DATATYPE'] == global.vui5.cons.dataType.quantity) {
                                    selection = new sap.m.Input({
                                        showValueHelp: false,
                                        maxLength: parseInt(obj['OUTPUTLEN']),
                                        editable: lv_editable
                                    });
                                    if (obj['TXTFL'] != '') {
                                        // txtflPath
                                        // =
                                        // oContext.getPath()
                                        // +
                                        // "/"
                                        // +
                                        // obj['TXTFL'];
                                        txtflPath = obj['TXTFL'];
                                        selection.bindValue(modelName + ">" + txtflPath, null, bindingMode);
                                    }
                                    selection.setTextAlign(sap.ui.core.TextAlign.End);

                                    /*
                                 * QA Issue 7022 Changes - START
                                 */
                                    if (obj['QFIELDNAME'] && contextObject[obj['QFIELDNAME']] != '') {
                                        refPath = oContext.getPath() + "/" + obj['QFIELDNAME'];
                                    } else if (obj['QUANTITY'] != '') {
                                        refPath = oControl.getFieldPath() + index + '/' + obj['QUANTITY'];
                                    } else if (obj['QFIELDNAME']) {
                                        refPath = oContext.getPath() + "/" + obj['QFIELDNAME'];
                                    }
                                    /*
                                 * if(contextObject[obj['QFIELDNAME']] !=
                                 * '') { refPath = oContext.getPath() +
                                 * "/" + obj['QFIELDNAME']; }else {
                                 * if(obj['QUANTITY'] != ''){ refPath =
                                 * oControl.getFieldPath() + index + '/' +
                                 * obj['QUANTITY']; }else{ refPath =
                                 * oContext.getPath() + "/" +
                                 * obj['QFIELDNAME']; } }
                                 */
                                    if (refPath) {
                                        selection.data("unitPath", refPath);
                                    }
                                    /*
                                 * QA Issue 7022 Changes - END
                                 */
                                    selection.data("FLDNAME", obj['FLDNAME']);
                                    selection.data("TABNAME", obj['TABNAME']);
                                    // selection.data("unitPath",refPath);
                                    /*
                                 * Decimal Conversion
                                 */
                                } else if (obj['DATATYPE'] == global.vui5.cons.dataType.decimal ||
                                    obj['DATATYPE'].substr(0, 3) == global.vui5.cons.dataType.integer) {

                                    selection = new sap.m.Input({
                                        showValueHelp: false,
                                        maxLength: parseInt(obj['OUTPUTLEN']),
                                        editable: lv_editable
                                    });
                                    if (obj['TXTFL'] != '') {
                                        txtflPath = obj['TXTFL'];
                                        selection.bindValue(modelName + ">" + txtflPath, null, bindingMode);
                                    }
                                    selection.setTextAlign(sap.ui.core.TextAlign.End);
                                    selection.data("FLDNAME", obj['FLDNAME']);
                                    selection.data("TABNAME", obj['TABNAME']);
                                    /*
                                 * Decimal Conversion
                                 */
                                } else {
                                    selection = new sap.m.Input({
                                        showValueHelp: false,
                                        maxLength: parseInt(obj['OUTPUTLEN']),
                                        editable: lv_editable
                                    });

                                    oControl.setFieldType(selection, obj);
                                    oControl.handleDescriptionField(selection, obj, oContext.getPath(), fieldPath, bindingMode);

                                }
                                break;
                            case global.vui5.cons.element.objectStatus:
                                var metadata, metadataObj, fldname, icon, active, label, state, path1;
                                metadata = obj['METADATA'];
                                metadataObj = JSON.parse(metadata);

                                fldname = metadataObj['TEXT_FIELD'];
                                icon = metadataObj['ICON_FIELD'];
                                active = metadataObj['ACTIVE'] == "X" ? true : false;
                                label = metadataObj['TITLE_FIELD'];
                                state = metadataObj['STATE_FIELD'];
                                path1 = obj['FLDNAME'];
                                if ((obj['SDSCR'] === global.vui5.cons.fieldValue.description ||
                        	          obj['SDSCR'] === global.vui5.cons.fieldValue.value_cont_descr) && obj['TXTFL']) {
                                    path1 = obj['TXTFL'];
                                }
                                selection = new sap.m.ObjectStatus({
                                    active: active
                                }).bindProperty("text", modelName + ">" + fldname, null, bindingMode)
	                        	.bindProperty("icon", modelName + ">" + icon, null, bindingMode)
	                        	.bindProperty("state", modelName + ">" + state, function (val) {
	                        	    if (val === global.vui5.cons.stateConstants.Error) {
	                        	        return sap.ui.core.ValueState.Error;
	                        	    }
	                        	    else if (val === global.vui5.cons.stateConstants.Warning) {
	                        	        return sap.ui.core.ValueState.Information;

	                        	    } else if (val === global.vui5.cons.stateConstants.None) {
	                        	        return sap.ui.core.ValueState.None;

	                        	    } else if (val === global.vui5.cons.stateConstants.Success) {
	                        	        return sap.ui.core.ValueState.Success;
	                        	    }
	                        	    else
	                        	        return sap.ui.core.ValueState.None;
	                        	}, sap.ui.model.BindingMode.OneWay);

                                selection.data("fieldname", path1);
                                selection.data("fieldInfo", obj);

                                if (label)
                                    selection.bindProperty('title', modelName + ">" + label, null, bindingMode);
                                if (active)
                                    selection.attachPress(oControl.onFieldClick, oControl);
                                break;
                            case global.vui5.cons.element.valueHelp:
                                /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - Start ***/
                                if (obj['MULTISELECT']) {
                                    var multiValue = new global.vui5.ui.controls.MultiValue({
                                        modelName: oControl.getModelName(),
                                        elementType: obj['ELTYP'],
                                        /***Rel 60E SP7 QA #12093 Start**/
                                        //fieldPath: fieldPath
                                        fieldPath: fieldPath + "/",
                                        /***/
                                        dataPath: oControl.getDataPath() + contextIndex + "/" + path,
                                        commaSeparator: obj['MVFLD'] === "",
                                        editable: lv_editable,
                                        enabled: lv_editable,
                                        onInputChange: function (oEvent) {
                                            oControl.processOnInputChange(oEvent.getParameter("oEvent"));
                                        }
                                    });

                                    multiValue.setModel(oControl.getModel(oControl.getModelName()), oControl.getModelName());
                                    multiValue.setModel(oControl.getModel(global.vui5.modelName), global.vui5.modelName);
                                    selection = multiValue.prepareField();

                                }
                                else {
                                    /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - End ***/
                                    selection = new sap.m.Input({
                                        showValueHelp: true,
                                        fieldWidth: "100%",
                                        maxLength: parseInt(obj['OUTPUTLEN']),
                                        editable: lv_editable
                                    });
                                    /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - Start ***/
                                }
                                /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - Start ***/
                                oControl.setFieldType(selection, obj);

                                oControl.handleDescriptionField(selection, obj, oContext.getPath(), fieldPath, bindingMode);

                                selection.attachValueHelpRequest(oControl.onValueHelpRequest.bind(oControl));

                                /* func = oControl.getOnF4HelpRequest();
                             if (func && typeof func == "function")
                                 selection.attachValueHelpRequest(func.bind(oController));*/

                                selection.data("model", oControl.getModelName());
                                selection.data("path", obj);
                                selection.data("dataArea", dataArea);

                                oControl.bindTypeAheadField(selection, fieldPath, obj);

                                break;

                            case global.vui5.cons.element.dropDown:
                                // selection
                                // =
                                // new
                                // sap.m.ComboBox({
                                // editable:
                                // lv_editable
                                // });
                                selection = new global.vui5.ui.controls.ComboBox({
                                    editable: lv_editable
                                });

                                selection.bindAggregation("items", global.vui5.modelName + '>' + "/DROPDOWNS/" + dataArea + "/" + obj['FLDNAME'], function (sid, oContext) {
                                    var contextObject = oContext.getObject();
                                    return new sap.ui.core.Item({
                                        key: contextObject['NAME'],
                                        text: contextObject['VALUE']
                                    });
                                });
                                selection.bindProperty("selectedKey", modelName + ">" + path, null, bindingMode);

                                break;
                            case global.vui5.cons.element.progressIndicator:
                                var txtPath;
                                if (contextObject['TXTFL'])
                                    txtPath = modelName + ">" + contextObject['TXTFL'];
                                else
                                    txtPath = modelName + ">" + contextObject['FLDNAME'];

                                selection = new sap.m.ProgressIndicator({
                                    //displayValue :"{= parseFloat(${"+txtPath+"})}"
                                    //*****Rel 60E_SP6
                                    state: sap.ui.core.ValueState.Success
                                    //*****
                                }).bindProperty("displayValue", {
                                    parts: [{ path: txtPath }
                                    ],
                                    formatter: function (val) {
                                        return parseFloat(val) + "%";
                                    },
                                    mode: sap.ui.model.BindingMode.OneWay
                                }).bindProperty("percentValue", {
                                    parts: [{ path: txtPath }],
                                    formatter: function (val) {
                                        return parseFloat(val);
                                    },
                                    mode: sap.ui.model.BindingMode.OneWay
                                })
                                //.bindProperty("percentValue", modelName + ">" + path, null, sap.ui.model.BindingMode.OneWay);
                                break;
                            case global.vui5.cons.element.checkBox:

                                selection = new sap.m.CheckBox({
                                    select: [oController._onCheckBoxSelect, oController],
                                    //*****Rel 60E_SP6
                                    //selected: "{= ${" + modelName + ">" + path + "} === 'X' }",
                                    selected: "{= ${" + modelName + ">" + oContext.getPath() + "/" + path + "} === 'X' }",
                                    //*****
                                    editable: lv_editable
                                });
                                selection.data("model", modelName);
                                //*****Rel 60E_SP6
                                selection.data("dataPath", oContext.getPath() + "/" + path);
                                //*****
                                selection.attachSelect(oControl.onChangeUpdateIndicator.bind(oControl));
                                break;
                                //*****Rel 60E_SP6 - Task #39097
                            case global.vui5.cons.element.toggle:
                                selection = new sap.m.Switch({
                                    state: "{= ${" + modelName + ">" + oContext.getPath() + "/" + path + "} === 'X' }",
                                    enabled: lv_editable,
                                    change: [oController._onToggleButtonChange, oController]
                                });
                                selection.data("model", modelName);
                                selection.data("dataPath", oContext.getPath() + "/" + path);
                                selection.attachChange(oControl.onChangeUpdateIndicator.bind(oControl));
                                break;
                                //*****
                            case global.vui5.cons.element.link:
                            case global.vui5.cons.element.button:

                                /*
                             * selection = new sap.m.Link({
                             * press:[oControl.onFieldClick, oControl]
                             * }).bindProperty("text",
                             * modelName+">"+oContext.getPath() + "/" +
                             * path, null,
                             * sap.ui.model.BindingMode.OneWay);
                             *
                             * selection.data("fieldname", path);
                             */

                                //*****Rel 60E_SP6 - Button Style Changes
                                var enabled = true, oType = sap.m.ButtonType.Default, style;
                                if (obj['ELTYP'] === global.vui5.cons.element.button) {
                                    enabled = "{= ${" + modelName + ">" + oContext.getPath() + "/READONLYCOLUMNS}.indexOf('<" + obj['FLDNAME'] + ">') === -1 }";

                                    if (!underscoreJS.isEmpty(obj['STYLES'])) {
                                        style = underscoreJS.findWhere(obj['STYLES'], { "VALUE": contextObject[obj['FLDNAME']] });
                                        if (style && style['BTNTP'] == global.vui5.cons.buttonType.accept) {
                                            oType = sap.m.ButtonType.Accept;
                                        }
                                        else if (style && style['BTNTP'] == global.vui5.cons.buttonType.reject) {
                                            oType = sap.m.ButtonType.Reject;
                                        }
                                        else if (style && style['BTNTP'] == global.vui5.cons.buttonType.transparent) {
                                            oType = oType = sap.m.ButtonType.Transparent;
                                        }
                                    }
                                    else if (!underscoreJS.isEmpty(obj['BTSTL'])) {
                                        if (obj['BTSTL'] === global.vui5.cons.buttonStyle.accept) {
                                            oType = sap.m.ButtonType.Accept;
                                        }
                                        else if (obj['BTSTL'] === global.vui5.cons.buttonStyle.reject) {
                                            oType = sap.m.ButtonType.Reject;
                                        }
                                        else if (obj['BTSTL'] === global.vui5.cons.buttonStyle.transparent) {
                                            oType = oType = sap.m.ButtonType.Transparent;
                                        }
                                        else if (obj['BTSTL'] === global.vui5.cons.buttonStyle.message) {
                                            oType = oType = sap.m.ButtonType.Emphasized;
                                        }
                                    }
                                }
                                //*****

                                if (obj['CFIELDNAME'] == "") {

                                    path = obj['FLDNAME'];
                                    if ((obj['SDSCR'] === global.vui5.cons.fieldValue.description ||
                                            obj['SDSCR'] === global.vui5.cons.fieldValue.value_cont_descr) && obj['TXTFL']) {
                                        path = obj['TXTFL'];
                                    }
                                    //*****Rel 60E_SP6 - Button Style Changes
                                    if (obj['ELTYP'] === global.vui5.cons.element.button) {
                                        var params = {
                                            press: [oControl.onFieldClick, oControl],
                                            text: contextObject[path],
                                            enabled: enabled,
                                            type: oType
                                        }

                                        if (!underscoreJS.isEmpty(obj['BTSTL']) && obj['BTSTL'] === global.vui5.cons.buttonStyle.message) {
                                            params['icon'] = "sap-icon://message-popup";
                                        }
                                    }
                                    else {
                                        //*****
                                        var params = {
                                            press: [oControl.onFieldClick, oControl],
                                            text: contextObject[path]
                                        }
                                        //*****Rel 60E_SP6
                                    }
                                    //*****
                                    selection = obj['ELTYP'] === global.vui5.cons.element.link ? new sap.m.Link(params) : new sap.m.Button(params);

                                    selection.data("fieldname", path);
                                    selection.data("fieldInfo", obj);
                                } else if (obj['CFIELDNAME'] != "") {

                                    var cfieldname;
                                    var cfield = underscoreJS.find(fields, {
                                        'FLDNAME': obj['CFIELDNAME']
                                    });
                                    if (cfield) {
                                        if (cfield['TXTFL'] != '') {
                                            cfieldname = cfield['TXTFL'];
                                        }
                                        else {
                                            cfieldname = obj['CFIELDNAME'];
                                        }
                                    }
                                    //*****Rel 60E_SP6 - Button Style Changes
                                    if (obj['ELTYP'] === global.vui5.cons.element.button) {
                                        var params = {
                                            press: [oControl.onFieldClick, oControl],
                                            text: {
                                                parts: [{ path: modelName + ">" + obj['TXTFL'] },
                                                 	    { path: modelName + ">" + cfieldname }],
                                                mode: bindingMode
                                            },
                                            enabled: enabled,
                                            type: oType
                                        }

                                        if (!underscoreJS.isEmpty(obj['BTSTL']) && obj['BTSTL'] === global.vui5.cons.buttonStyle.message) {
                                            params['icon'] = "sap-icon://message-popup";
                                        }

                                    }
                                    else {
                                        //*****
                                        var params = {
                                            press: [oControl.onFieldClick, oControl],
                                            text: {
                                                parts: [{ path: modelName + ">" + obj['TXTFL'] },
                                                	    { path: modelName + ">" + cfieldname }],
                                                mode: bindingMode
                                            }
                                        }
                                        //*****Rel 60E_SP6 - Button Style Changes
                                    }
                                    //*****

                                    selection = obj['ELTYP'] === global.vui5.cons.element.link ? new sap.m.Link(params) : new sap.m.Button(params);

                                    selection.data("fieldname", path);
                                    selection.data("fieldInfo", obj);
                                }

                                //*****Rel 60E_SP6 - Button Style Changes
                                if (obj['ELTYP'] === global.vui5.cons.element.button &&
                                    obj['BTSTL'] === global.vui5.cons.buttonStyle.message) {
                                    selection.bindProperty("visible", modelName + ">" + obj['FLDNAME'], function (val) {
                                        if (val != undefined) {
                                            if (parseInt(val) === 0) {
                                                return false;
                                            }
                                            else {
                                                return true;
                                            }
                                        }
                                    }, sap.ui.model.BindingMode.OneWay);
                                }
                                //*****

                                break;
                                //        
                                //*****Rel 60E_SP7 
                            case global.vui5.cons.element.toggle_inputs:
                                var metadata = JSON.parse(obj['METADATA'])[path];
                                selection = new global.vui5.ui.controls.Switch({
                                    controller: oController,
                                    modelName: modelName,
                                    dataPath: oControl.getDataPath() + contextIndex + "/",
                                    fields: metadata['FIELDS'],
                                    switchButtons: metadata['SWITCH'],
                                    switchFieldName: metadata['SWFLDNAME'],
                                    valueHelpRequest: function (evt) {
                                        oControl.fireOnValueHelpRequest({
                                            oEvent: evt.getParameter('oEvent'),
                                            fieldInfo: evt.getParameter('fieldInfo'),
                                            rowId: oControl._getCurrentRow(evt)
                                        });
                                    },
                                    fieldEvent: function (evt) {
                                        var params = {};
                                        evt.mParameters['eventType'] = global.vui5.cons.fieldSubEvent.typeAhead;
                                        evt.mParameters['fieldInfo'] = evt.getParameter('fieldInfo');
                                        evt.mParameters['fieldValue'] = evt.getParameter('fieldValue');
                                        evt.mParameters['oEvent'] = evt.getParameter('oEvent');
                                        evt.mParameters['rowId'] = oControl._getCurrentRow(evt);
                                        oController.preProcessFieldEvent(oControl.getSectionID(), evt);
                                    },
                                    switchChange: function (oEvent) {
                                        var blockPath, params = {};
                                        blockPath = oControl.getDataPath().replace(oController._getPath(), "");
                                        blockPath = blockPath.substr(0, blockPath.indexOf("/"));
                                        params['$BLOCK_PATH'] = blockPath;
                                        params['$SWFLD'] = oEvent.getParameter('switchField');
                                        oEvent.mParameters['fieldInfo'] = obj;
                                        oEvent.mParameters['urlParams'] = params;
                                        oController.preProcessFieldClickEvent(oControl.getSectionID(), oEvent);

                                    }
                                });
                                selection.switchControlPrepare();
                                selection.data("model", modelName);
                                break;
                                //*****
                            default:
                                selection = new sap.m.Input({
                                    showValueHelp: false,
                                    maxLength: parseInt(obj['OUTPUTLEN']),
                                    editable: lv_editable
                                });

                                oControl.setFieldType(selection, obj);
                                oControl.handleDescriptionField(selection, obj, oContext.getPath(), fieldPath, bindingMode);

                                break;
                        }

                        var refFields;

                        if (obj['ELTYP'] != global.vui5.cons.element.checkBox && obj['ELTYP'] != global.vui5.cons.element.toggle &&
                                obj['ELTYP'] != global.vui5.cons.element.link && obj['ELTYP'] != global.vui5.cons.element.button &&
                            //*****Rel 60E_SP7
                                obj['ELTYP'] != global.vui5.cons.element.objectStatus &&
                                obj['ELTYP'] != global.vui5.cons.element.toggle_inputs && obj['ELTYP'] != global.vui5.cons.element.progressIndicator) {

                            //*****                        	
                            if (obj['ELTYP'] == global.vui5.cons.element.dropDown) {
                                selection.attachSelectionChange(oControl.onChangeUpdateIndicator.bind(oControl));
                            } else {
                                selection.attachChange(oControl.onChangeUpdateIndicator.bind(oControl));
                            }
                        }
                        if (selection) {

                            var reference = underscoreJS.find(oControl.fieldRef, {
                                'INDEX': contextIndex,
                                'FLDNAME': obj['FLDNAME'],
                                'TABNAME': obj['TABNAME']
                            });
                            if (reference) {
                                reference['CONTROL'] = selection;
                            } else {
                                oControl.fieldRef.push({
                                    'INDEX': contextIndex,
                                    'FLDNAME': obj['FLDNAME'],
                                    'TABNAME': obj['TABNAME'],
                                    'CONTROL': selection
                                });
                            }

                            if (obj['DATATYPE'] == global.vui5.cons.dataType.currencyKey) {
                                refFields = underscoreJS.where(fields, {
                                    'CFIELDNAME': obj['FLDNAME']//, 'ADFLD': 'X'
                                });
                                refPath = oContext.getPath() + "/" + path;

                            } else if (obj['DATATYPE'] == global.vui5.cons.dataType.unit) {
                                refFields = underscoreJS.where(fields, {
                                    'QFIELDNAME': obj['FLDNAME']//, 'ADFLD': 'X'
                                });
                                refPath = oContext.getPath() + "/" + path;

                            }
                            oControl._onInputChange(selection, obj, oContext.getPath() + "/", refPath, refFields, contextIndex);
                        }

                        if (selection) {

                            selection.data("fieldInfo", obj);

                            if (!underscoreJS.isEmpty(oControl._oChangedRowFields)) {
                                var changedRowField = underscoreJS.findWhere(oControl._oChangedRowFields, { 'FLDNAME': obj['TXTFL'] ? obj['TXTFL'] : obj['FLDNAME'], 'INDEX': contextIndex });
                                if (changedRowField) {
                                    oControl._oChangedCellControls.push(selection);
                                }
                            }
                            // selection.data("dataPath", oContext.getPath() + "/" + obj['FLDNAME']);
                            oControl.changeFieldColor(selection, obj, contextObject, fields);
                            if (obj['REQUIRED']) {
                                selection.addStyleClass('vuiRequired')
                            }

                            /*
       * Search and Replace Changes
       */
                            selection.data("FLDNAME", obj['FLDNAME']);
                            /*
       * Search and Replace Changes
       */                   if (contextObject['FLSTL'] == global.vui5.cons.styleType.icon) {

           selection.setTextAlign(sap.ui.core.TextAlign.Center);

       } else if (obj['INTTYPE'] == global.vui5.cons.intType.number ||
            obj['INTTYPE'] == global.vui5.cons.intType.date || obj['INTTYPE'] == global.vui5.cons.intType.time
            || obj['INTTYPE'] == global.vui5.cons.intType.integer || obj['INTTYPE'] == global.vui5.cons.intType.oneByteInteger
            || obj['INTTYPE'] == global.vui5.cons.intType.twoByteInteger || obj['INTTYPE'] == global.vui5.cons.intType.packed
            || obj['INTTYPE'] == global.vui5.cons.intType.float || obj['INTTYPE'] == global.vui5.cons.intType.decimal16
            || obj['INTTYPE'] == global.vui5.cons.intType.decimal32) {
           if (selection.setTextALign)
               selection.setTextAlign(sap.ui.core.TextAlign.Right);
       }
       else {
           if (selection.setTextALign)
               selection.setTextAlign(sap.ui.core.TextAlign.Left);
       }


                            cells.push(selection);
                        }
                    }
                });

            } else {

                underscoreJS.each(fields, function (obj, index) {
                    // var
                    // path
                    // =
                    // oContext.getPath()
                    // + "/"
                    // +
                    // obj['FLDNAME'];
                    var path = obj['FLDNAME'];
                    var selection;

                    // var
                    // fieldPath
                    // =
                    // oControl.getFieldPath()
                    // +
                    // index;
                    var bindingMode = sap.ui.model.BindingMode.OneWay;

                    if (obj['FLSTL'] == global.vui5.cons.styleType.icon) {

                        selection = oControl.__createIconControl(obj, modelName, oContext.getObject());
                        cells.push(selection);

                    } else if (obj['SETCONTROL'] != undefined && obj['SETCONTROL'] != "") {
                        var func = obj['SETCONTROL'];
                        selection = func(oContext.getPath() + "/" + path);
                        cells.push(selection);
                    } else {
                        if (obj['KEY'] == 'X') {

                            if (obj['ELTYP'] == global.vui5.cons.element.dropDown) {

                                objectIdentifier = new sap.m.ObjectIdentifier({
                                    title: {
                                        mode: bindingMode,
                                        formatter: Formatter.dropdownDescriptionGet,
                                        parts: [{
                                            path: modelName + ">" + path
                                        }, {
                                            path: global.vui5.modelName + '>' + "/DROPDOWNS/" + dataArea + "/" + obj['FLDNAME']
                                        }]
                                    }
                                });

                                oControl.changeFieldColor(objectIdentifier, obj, contextObject, fields);
                                cells.push(objectIdentifier);

                            } else if (obj['DATATYPE'] == global.vui5.cons.dataType.date) {
                                objectIdentifier = new sap.m.ObjectIdentifier({
                                    title: {
                                        path: modelName + ">" + path,
                                        mode: sap.ui.model.Binding.OneWay,
                                        formatter: Formatter.dateFormat
                                    }
                                });
                                oControl.changeFieldColor(objectIdentifier, obj, contextObject, fields);
                                cells.push(objectIdentifier);
                                // }else
                                // if(obj['DATATYPE']
                                // ==
                                // global.vui5.cons.dataType.time){
                                // cells.push(new
                                // sap.m.TimePicker({
                                // valueFormat:"HH:mm:ss",
                                // displayFormat:"hh:mm:ss
                                // a",
                                // editable:false
                                // }).bindValue(modelName
                                // +
                                // ">"
                                // +
                                // path,null,bindingMode));
                            } else if (obj['ELTYP'] == global.vui5.cons.element.dropDown) {

                                objectIdentifier = new sap.m.ObjectIdentifier({
                                    title: {
                                        mode: bindingMode,
                                        formatter: Formatter.dropdownDescriptionGet,
                                        parts: [{
                                            path: modelName + ">" + path
                                        }, {
                                            path: global.vui5.modelName + '>' + "/DROPDOWNS/" + dataArea + "/" + obj['FLDNAME']
                                        }]
                                    }
                                });
                                oControl.changeFieldColor(objectIdentifier, obj, contextObject, fields);
                                cells.push(objectIdentifier);
                            } else if (obj['ELTYP'] === global.vui5.cons.element.objectStatus) {
                                var metadata, metadataObj, fldname, icon, active, label, state;
                                metadata = obj['METADATA'];
                                metadataObj = JSON.parse(metadata);

                                fldname = metadataObj['TEXT_FIELD'];
                                icon = metadataObj['ICON_FIELD'];
                                active = metadataObj['ACTIVE'] == "X" ? true : false;
                                label = metadataObj['TITLE_FIELD'];
                                state = metadataObj['STATE_FIELD'];
                                path1 = obj['FLDNAME'];
                                if ((obj['SDSCR'] === global.vui5.cons.fieldValue.description ||
    	                                obj['SDSCR'] === global.vui5.cons.fieldValue.value_cont_descr) && obj['TXTFL']) {
                                    path1 = obj['TXTFL'];
                                }
                                selection = new sap.m.ObjectStatus({
                                    active: active
                                }).bindProperty("text", modelName + ">" + fldname, null, bindingMode)
	                        	.bindProperty("icon", modelName + ">" + icon, null, bindingMode)
	                        	.bindProperty("state", modelName + ">" + state, function (val) {
	                        	    if (val === global.vui5.cons.stateConstants.Error) {
	                        	        return sap.ui.core.ValueState.Error;
	                        	    }
	                        	    else if (val === global.vui5.cons.stateConstants.Warning) {
	                        	        return sap.ui.core.ValueState.Information;

	                        	    } else if (val === global.vui5.cons.stateConstants.None) {
	                        	        return sap.ui.core.ValueState.None;

	                        	    } else if (val === global.vui5.cons.stateConstants.Success) {
	                        	        return sap.ui.core.ValueState.Success;
	                        	    }
	                        	    else
	                        	        return sap.ui.core.ValueState.None;
	                        	}, sap.ui.model.BindingMode.OneWay);
                                selection.data("fieldname", path1);
                                selection.data("fieldInfo", obj);
                                if (label)
                                    selection.bindProperty('title', modelName + ">" + label, null, bindingMode);
                                if (active)
                                    selection.attachPress(oControl.onFieldClick, oControl);
                            }
                            else if (obj['ELTYP'] == global.vui5.cons.element.progressIndicator) {

                                var txtPath;
                                if (obj['TXTFL'])
                                    txtPath = modelName + ">" + obj['TXTFL'];
                                else
                                    txtPath = modelName + ">" + obj['FLDNAME'];

                                objectIdentifier = new sap.m.ProgressIndicator({
                                    //*****Rel 60E_SP6
                                    state: sap.ui.core.ValueState.Success
                                    //*****
                                }).bindProperty("displayValue", {
                                    parts: [{ path: txtPath }
                                    ],
                                    formatter: function (val) {
                                        return parseFloat(val) + "%";
                                    },
                                    mode: sap.ui.model.BindingMode.OneWay
                                }).bindProperty("percentValue", {
                                    parts: [{ path: txtPath }
                                    ],
                                    formatter: function (val) {
                                        return parseFloat(val);
                                    },
                                    mode: sap.ui.model.BindingMode.OneWay
                                })
                                //                            	objectIdentifier  = new sap.m.ProgressIndicator({
                                //          		        		  displayValue:"{" + modelName + ">" + path + "}%",
                                //          		        	   }).bindProperty("percentValue", modelName + ">" + path, null, sap.ui.model.BindingMode.OneWay);
                                cells.push(objectIdentifier);

                            }
                                // Hotspot
                                // Click
                                // Changes
                                // -
                                // Start

                            else if (obj['ELTYP'] == global.vui5.cons.element.link || obj['ELTYP'] == global.vui5.cons.element.button) {

                                //*****Rel 60E_SP6 - Button Style Changes
                                var enabled = true, oType = sap.m.ButtonType.Default, style;
                                if (obj['ELTYP'] === global.vui5.cons.element.button) {
                                    enabled = "{= ${" + modelName + ">" + oContext.getPath() + "/READONLYCOLUMNS}.indexOf('<" + obj['FLDNAME'] + ">') === -1 }";

                                    if (!underscoreJS.isEmpty(obj['STYLES'])) {
                                        style = underscoreJS.findWhere(obj['STYLES'], { "VALUE": contextObject[obj['FLDNAME']] });
                                        if (style && style['BTNTP'] == global.vui5.cons.buttonType.accept) {
                                            oType = sap.m.ButtonType.Accept;
                                        }
                                        else if (style && style['BTNTP'] == global.vui5.cons.buttonType.reject) {
                                            oType = sap.m.ButtonType.Reject;
                                        }
                                        else if (style && style['BTNTP'] == global.vui5.cons.buttonType.transparent) {
                                            oType = oType = sap.m.ButtonType.Transparent;
                                        }
                                    }
                                    else if (!underscoreJS.isEmpty(obj['BTSTL'])) {
                                        if (obj['BTSTL'] === global.vui5.cons.buttonStyle.accept) {
                                            oType = sap.m.ButtonType.Accept;
                                        }
                                        else if (obj['BTSTL'] === global.vui5.cons.buttonStyle.reject) {
                                            oType = sap.m.ButtonType.Reject;
                                        }
                                        else if (obj['BTSTL'] === global.vui5.cons.buttonStyle.transparent) {
                                            oType = oType = sap.m.ButtonType.Transparent;
                                        }
                                        else if (obj['BTSTL'] === global.vui5.cons.buttonStyle.message) {
                                            oType = oType = sap.m.ButtonType.Emphasized;
                                        }
                                    }
                                }
                                //*****

                                if (obj['CFIELDNAME'] == "") {
                                    path = obj['FLDNAME'];
                                    if ((obj['SDSCR'] === global.vui5.cons.fieldValue.description ||
                                            obj['SDSCR'] === global.vui5.cons.fieldValue.value_cont_descr) && obj['TXTFL']) {
                                        path = obj['TXTFL'];
                                    }
                                    //*****Rel 60E_SP6 - Button Style Changes
                                    if (obj['ELTYP'] === global.vui5.cons.element.button) {
                                        var params = {
                                            press: [oControl.onFieldClick, oControl],
                                            text: contextObject[path],
                                            enabled: enabled,
                                            type: oType
                                        }

                                        if (!underscoreJS.isEmpty(obj['BTSTL']) && obj['BTSTL'] === global.vui5.cons.buttonStyle.message) {
                                            params['icon'] = "sap-icon://message-popup";
                                        }
                                    }
                                    else {
                                        //*****
                                        var params = {
                                            press: [oControl.onFieldClick, oControl],
                                            text: contextObject[path]
                                        }
                                        //*****Rel 60E_SP6
                                    }
                                    //*****

                                    selection = obj['ELTYP'] == global.vui5.cons.element.link ? new sap.m.Link(params) : new sap.m.Button(params);
                                    //                                  
                                    selection.data("fieldInfo", obj);
                                    selection.data("fieldname", path);
                                } else if (obj['CFIELDNAME'] != "") {

                                    var cfieldname;
                                    var cfield = underscoreJS.find(fields, {
                                        'FLDNAME': obj['CFIELDNAME']
                                    });
                                    if (cfield) {
                                        if (cfield['TXTFL'] != '')
                                            cfieldname = cfield['TXTFL'];
                                        else
                                            cfieldname = obj['CFIELDNAME'];
                                    }
                                    //*****Rel 60E_SP6 - Button Style Changes
                                    if (obj['ELTYP'] === global.vui5.cons.element.button) {
                                        var params = {
                                            press: [oControl.onFieldClick, oControl],
                                            text: {
                                                parts: [{ path: modelName + ">" + obj['TXTFL'] },
                                                 	    { path: modelName + ">" + cfieldname }],
                                                mode: bindingMode
                                            },
                                            enabled: enabled,
                                            type: oType
                                        }

                                        if (!underscoreJS.isEmpty(obj['BTSTL']) && obj['BTSTL'] === global.vui5.cons.buttonStyle.message) {
                                            params['icon'] = "sap-icon://message-popup";
                                        }
                                    }
                                    else {
                                        //*****
                                        var params = {
                                            press: [oControl.onFieldClick, oControl],
                                            text: {
                                                parts: [{ path: modelName + ">" + obj['TXTFL'] },
                                                	    { path: modelName + ">" + cfieldname }],
                                                mode: bindingMode
                                            }
                                        }
                                        //*****Rel 60E_SP6
                                    }
                                    //*****

                                    selection = obj['ELTYP'] == global.vui5.cons.element.link ? new sap.m.Link(params) : new sap.m.Button(params);

                                    selection.data("fieldname", path);
                                    selection.data("fieldInfo", obj);
                                }

                                //*****Rel 60E_SP6 - Button Style Changes
                                if (obj['ELTYP'] === global.vui5.cons.element.button &&
                                    obj['BTSTL'] === global.vui5.cons.buttonStyle.message) {
                                    selection.bindProperty("visible", modelName + ">" + obj['FLDNAME'], function (val) {
                                        if (val != undefined) {
                                            if (parseInt(val) === 0) {
                                                return false;
                                            }
                                            else {
                                                return true;
                                            }
                                        }
                                    }, sap.ui.model.BindingMode.OneWay);
                                }
                                //*****                                
                            }
                                //                           
                                // Hotspot
                                // Click
                                // Changes
                                // -
                                // End
                            else {
                                var objectIdentifier;

                                if (obj['SDSCR'] == global.vui5.cons.fieldValue.description || obj['SDSCR'] == global.vui5.cons.fieldValue.value_cont_descr) {
                                    objectIdentifier = new sap.m.ObjectIdentifier({
                                        title: contextObject[obj['TXTFL']]
                                    });
                                } else if (obj['SDSCR'] == global.vui5.cons.fieldValue.value) {
                                    objectIdentifier = new sap.m.ObjectIdentifier({
                                        title: contextObject[obj['FLDNAME']]
                                    });
                                } else if (obj['SDSCR'] == global.vui5.cons.fieldValue.value_descr) {
                                    objectIdentifier = new sap.m.ObjectIdentifier({
                                        /**
                                         * *** Show Value and Description
                                         * separate Field in Display Mode
                                         */
                                        title: contextObject[obj['FLDNAME']]
                                        // title
                                        // :
                                        // contextObject[obj['FLDNAME']]
                                        // + "
                                        // " +
                                        // contextObject[obj['TXTFL']]
                                        /** *** */
                                    });
                                }
                                oControl.changeFieldColor(objectIdentifier, obj, contextObject, fields);
                                cells.push(objectIdentifier);
                            }
                        } else if (obj['ELTYP'] == global.vui5.cons.element.dropDown) {

                            selection = new sap.m.Text({
                                text: {
                                    mode: bindingMode,
                                    formatter: Formatter.dropdownDescriptionGet,
                                    parts: [{
                                        path: modelName + ">" + path
                                    }, {
                                        path: global.vui5.modelName + '>' + "/DROPDOWNS/" + dataArea + "/" + obj['FLDNAME']
                                    }]
                                }
                            });

                        }
                        else if (obj['ELTYP'] == global.vui5.cons.element.objectStatus) {
                            var metadata, metadataObj, fldname, icon, active, label, state, path1;
                            metadata = obj['METADATA'];
                            metadataObj = JSON.parse(metadata);
                            //                        	               	    
                            fldname = metadataObj['TEXT_FIELD'];
                            icon = metadataObj['ICON_FIELD'];
                            active = metadataObj['ACTIVE'] == "X" ? true : false;
                            label = metadataObj['TITLE_FIELD'];
                            state = metadataObj['STATE_FIELD'];
                            path1 = obj['FLDNAME'];
                            if ((obj['SDSCR'] === global.vui5.cons.fieldValue.description ||
                                 obj['SDSCR'] === global.vui5.cons.fieldValue.value_cont_descr) && obj['TXTFL']) {
                                path1 = obj['TXTFL'];
                            }
                            selection = new sap.m.ObjectStatus({
                                active: active
                            }).bindProperty("text", modelName + ">" + fldname, null, bindingMode)
                            .bindProperty("icon", modelName + ">" + icon, null, bindingMode)
                                    .bindProperty("state", modelName + ">" + state, function (val) {
                                        if (val === global.vui5.cons.stateConstants.Error) {
                                            return sap.ui.core.ValueState.Error;
                                        }
                                        else if (val === global.vui5.cons.stateConstants.Information) {
                                            return sap.ui.core.ValueState.Information;

                                        } else if (val === global.vui5.cons.stateConstants.None) {
                                            return sap.ui.core.ValueState.None;

                                        } else if (val === global.vui5.cons.stateConstants.Success) {
                                            return sap.ui.core.ValueState.Success;
                                        }
                                        else
                                            return sap.ui.core.ValueState.None;
                                    }, sap.ui.model.BindingMode.OneWay);
                            selection.data("fieldname", path1);
                            selection.data("fieldInfo", obj);
                            if (label)
                                selection.bindProperty('title', modelName + ">" + label, null, bindingMode);
                            if (active)
                                selection.attachPress(oControl.onFieldClick, oControl);
                        }
                        else if (obj['ELTYP'] == global.vui5.cons.element.progressIndicator) {

                            var txtPath;
                            if (obj['TXTFL'])
                                txtPath = modelName + ">" + obj['TXTFL'];
                            else
                                txtPath = modelName + ">" + obj['FLDNAME'];

                            selection = new sap.m.ProgressIndicator({
                                //*****Rel 60E_SP6
                                state: sap.ui.core.ValueState.Success
                                //*****
                            }).bindProperty("displayValue", {
                                parts: [{ path: txtPath }
                                ],
                                formatter: function (val) {
                                    return parseFloat(val) + "%";
                                },
                                mode: sap.ui.model.BindingMode.OneWay
                            }).bindProperty("percentValue", {
                                parts: [{ path: txtPath }
                                ],
                                formatter: function (val) {
                                    return parseFloat(val);
                                },
                                mode: sap.ui.model.BindingMode.OneWay
                            })
                            //                        	selection  = new sap.m.ProgressIndicator({
                            //      		        		  displayValue:"{" + modelName + ">" + path + "}%",
                            //      		        	   }).bindProperty("percentValue", modelName + ">" + path, null, sap.ui.model.BindingMode.OneWay);
                            //                        	
                        } else if (obj['ELTYP'] == global.vui5.cons.element.checkBox) {
                            selection = new sap.m.CheckBox({
                                editable: false,
                                selected: "{= ${" + modelName + ">" + path + "} === 'X' }"
                            });
                        }
                            //*****Rel 60E_SP6 - Task #39097
                        else if (obj['ELTYP'] == global.vui5.cons.element.toggle) {
                            selection = new sap.m.Switch({
                                enabled: false,
                                state: "{= ${" + modelName + ">" + path + "} === 'X' }"
                            });
                        }
                            //*****
                            //*****Rel 60E_SP7
                        else if (obj['ELTYP'] == global.vui5.cons.element.toggle_inputs) {
                            var metadata = JSON.parse(obj['METADATA'])[path];
                            selection = new global.vui5.ui.controls.Switch({
                                controller: oController,
                                modelName: modelName,
                                dataPath: oControl.getDataPath() + contextIndex + "/",
                                fields: metadata['FIELDS'],
                                switchButtons: metadata['SWITCH'],
                                switchFieldName: metadata['SWFLDNAME'],
                                valueHelpRequest: function (evt) {
                                    oControl.fireOnValueHelpRequest({
                                        oEvent: evt.getParameter('oEvent'),
                                        fieldInfo: evt.getParameter('fieldInfo'),
                                        rowId: oControl._getCurrentRow(evt)
                                    });
                                },
                                fieldEvent: function (evt) {
                                    var params = {};
                                    evt.mParameters['eventType'] = global.vui5.cons.fieldSubEvent.typeAhead;
                                    evt.mParameters['fieldInfo'] = evt.getParameter('fieldInfo');
                                    evt.mParameters['fieldValue'] = evt.getParameter('fieldValue');
                                    evt.mParameters['oEvent'] = evt.getParameter('oEvent');
                                    evt.mParameters['rowId'] = oControl._getCurrentRow(evt);
                                    oController.preProcessFieldEvent(oControl.getSectionID(), evt);
                                }
                            });
                            selection.switchControlPrepare();
                            selection.data("model", modelName);
                        }
                            //*****
                        else if (obj['ELTYP'] == global.vui5.cons.element.link || obj['ELTYP'] == global.vui5.cons.element.button) {

                            //*****Rel 60E_SP6 - Button Style Changes
                            var enabled = true, oType = sap.m.ButtonType.Default, style;
                            if (obj['ELTYP'] === global.vui5.cons.element.button) {
                                enabled = "{= ${" + modelName + ">" + oContext.getPath() + "/READONLYCOLUMNS}.indexOf('<" + obj['FLDNAME'] + ">') === -1 }";

                                if (!underscoreJS.isEmpty(obj['STYLES'])) {
                                    style = underscoreJS.findWhere(obj['STYLES'], { "VALUE": contextObject[obj['FLDNAME']] });
                                    if (style && style['BTNTP'] == global.vui5.cons.buttonType.accept) {
                                        oType = sap.m.ButtonType.Accept;
                                    }
                                    else if (style && style['BTNTP'] == global.vui5.cons.buttonType.reject) {
                                        oType = sap.m.ButtonType.Reject;
                                    }
                                    else if (style && style['BTNTP'] == global.vui5.cons.buttonType.transparent) {
                                        oType = oType = sap.m.ButtonType.Transparent;
                                    }
                                }
                                else if (!underscoreJS.isEmpty(obj['BTSTL'])) {
                                    if (obj['BTSTL'] === global.vui5.cons.buttonStyle.accept) {
                                        oType = sap.m.ButtonType.Accept;
                                    }
                                    else if (obj['BTSTL'] === global.vui5.cons.buttonStyle.reject) {
                                        oType = sap.m.ButtonType.Reject;
                                    }
                                    else if (obj['BTSTL'] === global.vui5.cons.buttonStyle.transparent) {
                                        oType = oType = sap.m.ButtonType.Transparent;
                                    }
                                    else if (obj['BTSTL'] === global.vui5.cons.buttonStyle.message) {
                                        oType = oType = sap.m.ButtonType.Emphasized;
                                    }
                                }
                            }
                            //*****
                            if (obj['CFIELDNAME'] == "") {
                                path = obj['FLDNAME'];
                                if ((obj['SDSCR'] === global.vui5.cons.fieldValue.description ||
                                        obj['SDSCR'] === global.vui5.cons.fieldValue.value_cont_descr) && obj['TXTFL']) {
                                    path = obj['TXTFL'];
                                }

                                //*****Rel 60E_SP6 - Button Style Changes
                                if (obj['ELTYP'] === global.vui5.cons.element.button) {
                                    var params = {
                                        press: [oControl.onFieldClick, oControl],
                                        text: contextObject[path],
                                        enabled: enabled,
                                        type: oType
                                    }

                                    if (!underscoreJS.isEmpty(obj['BTSTL']) && obj['BTSTL'] === global.vui5.cons.buttonStyle.message) {
                                        params['icon'] = "sap-icon://message-popup";
                                    }
                                }
                                else {
                                    //*****
                                    var params = {
                                        press: [oControl.onFieldClick, oControl],
                                        text: contextObject[path]
                                    }
                                    //*****Rel 60E_SP6
                                }
                                //*****

                                selection = obj['ELTYP'] == global.vui5.cons.element.link ? new sap.m.Link(params) : new sap.m.Button(params);

                                selection.data("fieldname", path);
                                selection.data("fieldInfo", obj);
                            } else if (obj['CFIELDNAME'] != "") {

                                var cfieldname;
                                var cfield = underscoreJS.find(fields, {
                                    'FLDNAME': obj['CFIELDNAME']
                                });
                                if (cfield) {
                                    if (cfield['TXTFL'] != '') {
                                        cfieldname = cfield['TXTFL'];
                                    }
                                    else {
                                        cfieldname = obj['CFIELDNAME'];
                                    }
                                }
                                //*****Rel 60E_SP6 - Button Style Changes
                                if (obj['ELTYP'] === global.vui5.cons.element.button) {
                                    var params = {
                                        press: [oControl.onFieldClick, oControl],
                                        text: {
                                            parts: [{ path: modelName + ">" + obj['TXTFL'] },
                                             	    { path: modelName + ">" + cfieldname }],
                                            mode: bindingMode
                                        },
                                        enabled: enabled,
                                        type: oType
                                    }

                                    if (!underscoreJS.isEmpty(obj['BTSTL']) && obj['BTSTL'] === global.vui5.cons.buttonStyle.message) {
                                        params['icon'] = "sap-icon://message-popup";
                                    }
                                }
                                else {
                                    //*****
                                    var params = {
                                        press: [oControl.onFieldClick, oControl],
                                        text: {
                                            parts: [{ path: modelName + ">" + obj['TXTFL'] },
                                            	    { path: modelName + ">" + cfieldname }],
                                            mode: bindingMode
                                        }
                                    }
                                    //*****Rel 60E_SP6
                                }
                                //*****

                                selection = obj['ELTYP'] == global.vui5.cons.element.link ? new sap.m.Link(params) : new sap.m.Button(params);

                                selection.data("fieldname", path);
                                selection.data("fieldInfo", obj);
                            }

                            //*****Rel 60E_SP6 - Button Style Changes
                            if (obj['ELTYP'] === global.vui5.cons.element.button &&
                                obj['BTSTL'] === global.vui5.cons.buttonStyle.message) {
                                selection.bindProperty("visible", modelName + ">" + obj['FLDNAME'], function (val) {
                                    if (val != undefined) {
                                        if (parseInt(val) === 0) {
                                            return false;
                                        }
                                        else {
                                            return true;
                                        }
                                    }
                                }, sap.ui.model.BindingMode.OneWay);
                            }
                            //*****                            
                        }
                            // Hotspot
                            // Click
                            // Changes
                            // -
                            // End

                        else {
                            /***Rel 60E SP6 - Object Number Changes - Start ***/
                            //if (obj['DATATYPE'] == global.vui5.cons.dataType.amount && obj['CFIELDNAME'] != "") {
                            if (obj['DATATYPE'] == global.vui5.cons.dataType.amount) {
                                /***Rel 60E SP6 - Object Number Changes - End ***/
                                var cfieldname;

                                var cfield = underscoreJS.find(fields, {
                                    'FLDNAME': obj['CFIELDNAME'], 'ADFLD': 'X'
                                });
                                if (cfield) {
                                    if (cfield['TXTFL'] != '') {
                                        cfieldname = cfield['TXTFL'];
                                    }
                                    else {
                                        cfieldname = obj['CFIELDNAME'];
                                    }
                                }
                                /***Rel 60E SP6 - Object Number Changes - Start ***/

                                if (obj['TXTFL']) {
                                    selection = new sap.m.ObjectNumber({
                                        emphasized: false,
                                        number: {
                                            path: modelName + ">" + obj['TXTFL']
                                        }
                                    });
                                }
                                else {
                                    selection = new sap.m.ObjectNumber({
                                        emphasized: false,
                                        number: {
                                            path: modelName + ">" + obj['FLDNAME'],
                                            type: new sap.ui.model.type.Float({
                                                decimals: parseInt(obj['DECIMALS'])
                                            })
                                        }
                                    });
                                }

                                if (cfieldname) {
                                    selection.bindProperty("unit", modelName + ">" + cfieldname, null, sap.ui.model.BindingMode.TwoWay);
                                }
                                /*selection = new sap.m.Text({
                                    text: {
                                        parts: [{
                                            path: modelName + ">" + obj['TXTFL']
                                        }, {
                                            path: modelName + ">" + cfieldname
                                        }],
                                        mode: bindingMode
                                    }
                                });*/

                                /***Rel 60E SP6 - Object Number Changes - End ***/
                            }
                                /***Rel 60E SP6 - Object Number Changes - Start ***/
                                //else if (obj['DATATYPE'] == global.vui5.cons.dataType.quantity && obj['QFIELDNAME'] != "") {
                            else if (obj['DATATYPE'] == global.vui5.cons.dataType.quantity) {
                                /***Rel 60E SP6 - Object Number Changes - End ***/
                                var qfieldname;
                                var qfield = underscoreJS.find(fields, {
                                    'FLDNAME': obj['QFIELDNAME'], 'ADFLD': 'X'
                                });
                                if (qfield) {
                                    if (qfield['TXTFL'] != '') {
                                        qfieldname = qfield['TXTFL'];
                                    }
                                    else {
                                        qfieldname = obj['QFIELDNAME'];
                                    }
                                }


                                /***Rel 60E SP6 - Object Number Changes - Start ***/
                                if (obj['TXTFL']) {
                                    selection = new sap.m.ObjectNumber({
                                        emphasized: false,
                                        number: {
                                            path: modelName + ">" + obj['TXTFL']
                                        }
                                    });
                                }
                                else {
                                    selection = new sap.m.ObjectNumber({
                                        emphasized: false,
                                        number: {
                                            path: modelName + ">" + obj['FLDNAME'],

                                            type: new sap.ui.model.type.Float({
                                                decimals: parseInt(obj['DECIMALS'])
                                            })
                                        }
                                    });
                                }

                                if (qfieldname) {
                                    selection.bindProperty("unit", modelName + ">" + qfieldname, null, sap.ui.model.BindingMode.TwoWay);
                                }
                                /* selection = new sap.m.Text({
                                     text: {
                                         parts: [{
                                             path: modelName + ">" + obj['TXTFL']
                                         }, {
                                             path: modelName + ">" + qfieldname
                                         }],
                                         mode: bindingMode
                                     }
                                 });*/
                                /***Rel 60E SP6 - Object Number Changes - End***/
                                /*
                             * Decimal Conversion
                             */
                            } else if (obj['DATATYPE'] == global.vui5.cons.dataType.decimal ||
                                obj['DATATYPE'].substr(0, 3) == global.vui5.cons.dataType.integer) {
                                /***Rel 60E SP6 - Object Number Changes - Start***/
                                if (obj['TXTFL']) {
                                    selection = new sap.m.ObjectNumber({
                                        emphasized: false,
                                        number: {
                                            path: modelName + ">" + obj['TXTFL']
                                        }
                                    });
                                }
                                else {
                                    selection = new sap.m.ObjectNumber({
                                        emphasized: false,
                                        number: {
                                            path: modelName + ">" + obj['FLDNAME'],
                                            type: new sap.ui.model.type.Float({
                                                decimals: parseInt(obj['DECIMALS'])
                                            })
                                        }
                                    });
                                }
                                /*selection = new sap.m.Text({
                                    text: {
                                        parts: [{
                                            path: modelName + ">" + obj['TXTFL']
                                        }],
                                        mode: sap.ui.model.Binding.OneWay
                                    }
                                });*/
                                /***Rel 60E SP6 - Object Number Changes - End***/
                            } else if (obj['DATATYPE'] == global.vui5.cons.dataType.date) {
                                selection = new sap.m.Text({
                                    text: {
                                        parts: [{
                                            path: modelName + ">" + path
                                        }],
                                        mode: sap.ui.model.Binding.OneWay,
                                        formatter: Formatter.dateFormat
                                    }
                                });
                            } else if (obj['DATATYPE'] == global.vui5.cons.dataType.time) {

                                /*selection = new sap.m.TimePicker({
            valueFormat: "HH:mm:ss",
            displayFormat: "hh:mm:ss a",
            editable: false
        }).bindValue(modelName + ">" + path, null, bindingMode); */
                                selection = new sap.m.Text({
                                }).bindText(modelName + ">" + path, null, bindingMode);

                            }
                            else if (obj['MULTISELECT'] && obj['ELTYP'] === global.vui5.cons.element.valueHelp) {
                                var multiValue = new global.vui5.ui.controls.MultiValue({
                                    modelName: oControl.getModelName(),
                                    elementType: obj['ELTYP'],
                                    /***Rel 60E SP7 QA #12093**/
                                    //fieldPath: oControl.getFieldPath() + underscoreJS.findIndex(oControl.getModel(oControl.getModelName()).getProperty(oControl.getFieldPath()), {'FLDNAME': obj['FLDNAME']}),
                                    fieldPath: oControl.getFieldPath() + underscoreJS.findIndex(oControl.getModel(oControl.getModelName()).getProperty(oControl.getFieldPath()), { 'FLDNAME': obj['FLDNAME'] }) + "/",
                                    /***/
                                    dataPath: oControl.getDataPath() + contextIndex + "/" + path,
                                    commaSeparator: obj['MVFLD'] === "",
                                    editable: false,
                                    enabled: true,

                                });


                                multiValue.setModel(oControl.getModel(oControl.getModelName()), oControl.getModelName());
                                multiValue.setModel(oControl.getModel(global.vui5.modelName), global.vui5.modelName);
                                selection = multiValue.prepareField();
                            }
                            else {
                                if (obj['SDSCR'] == global.vui5.cons.fieldValue.description || obj['SDSCR'] == global.vui5.cons.fieldValue.value_cont_descr) {
                                    selection = new sap.m.Text({
                                        text: contextObject[obj['TXTFL']]
                                    });
                                } else if (obj['SDSCR'] == global.vui5.cons.fieldValue.value) {
                                    selection = new sap.m.Text({
                                        text: contextObject[obj['FLDNAME']]
                                    });
                                } else if (obj['SDSCR'] == global.vui5.cons.fieldValue.value_descr) {
                                    selection = new sap.m.Text({
                                        /**
                                         * *** Show Value and Description
                                         * separate Field in Display Mode
                                         */
                                        // text:
                                        // contextObject[obj['FLDNAME']]
                                        // + '
                                        // ' +
                                        // contextObject[obj['TXTFL']]
                                        text: contextObject[obj['FLDNAME']]
                                        /** ** */
                                    });
                                }
                            }
                        }

                        if (selection) {

                            // selection.data("dataPath", oContext.getPath() + "/" + obj['FLDNAME']);
                            oControl.changeFieldColor(selection, obj, contextObject, fields);


                            if (obj['HALIGN'] && selection.setTextAlign) {
                                selection.setTextAlign(contextObject['HALIGN']);
                            }
                            else if (contextObject['FLSTL'] == global.vui5.cons.styleType.icon) {
                                selection.setTextAlign(sap.ui.core.TextAlign.Center);

                            } else if (obj['INTTYPE'] == global.vui5.cons.intType.number || obj['INTTYPE'] == global.vui5.cons.intType.date ||
                                  obj['INTTYPE'] == global.vui5.cons.intType.time || obj['INTTYPE'] == global.vui5.cons.intType.integer || obj['INTTYPE'] == global.vui5.cons.intType.oneByteInteger
                                  || obj['INTTYPE'] == global.vui5.cons.intType.twoByteInteger || obj['INTTYPE'] == global.vui5.cons.intType.packed
                                  || obj['INTTYPE'] == global.vui5.cons.intType.float || obj['INTTYPE'] == global.vui5.cons.intType.decimal16
                                  || obj['INTTYPE'] == global.vui5.cons.intType.decimal32) {
                                if (selection.setTextAlign) {
                                    selection.setTextAlign(sap.ui.core.TextAlign.Right);
                                }
                            }
                            else {
                                if (selection.setTextAlign) {
                                    selection.setTextAlign(sap.ui.core.TextAlign.Left);
                                }
                            }


                            if (contextObject['ROWBOLD']) {
                                selection.addStyleClass("rowBold");
                            }
                            if (contextObject['ROWDISABLE']) {
                                selection.addStyleClass("rowDisable");
                            }

                            cells.push(selection);
                        }
                    }
                });
            }
            return cells;
        },

            T.prototype.prepareTableData = function () {
                var oControl = this;

                var oController = this.getController();
                var dataPath = this.getDataPath();
                var vuifieldPath = this.getFieldPath();
                var modelName = this.getModelName();

                var dataAreaPath = this.getDataAreaPath();

                if (vuifieldPath && dataPath && modelName && dataAreaPath) {

                    this.unbindAggregation("items");
                    this.bindAggregation("items", modelName + ">" + dataPath, function (sId, oContext) {

                        oControl.dataPrepared = true;
                        var editable = oControl.getEditable();
                        var contextObject = oContext.getObject();

                        var oContextPath = oContext.getPath();
                        var arr = oContextPath.split('/');

                        var contextIndex = arr[arr.length - 1];

                        var model = oControl.getModel(modelName);
                        var fieldGroups = model.getProperty(oControl.getFieldGroupPath());
                        var fields = model.getProperty(oControl.getFieldPath());
                        var dataArea = model.getProperty(oControl.getDataAreaPath());

                        var cells = [];

                        if (oControl.isGroupingPresent()) {

                            cells = oControl.prepareFieldGroupControl(oContext);
                        }
                        else {
                            cells = oControl.prepareTableRowData(fields, oContext);
                        }
                        var bindingMode,
                            func;


                        var listItem = new sap.m.ColumnListItem({
                            type: oControl.getListItemType(),
                            vAlign: sap.ui.core.VerticalAlign.Middle,
                            cells: cells,
                            highlight: sap.ui.core.MessageType.Success
                        });

                        /*if (contextObject['ROWCOLOR']) {
                            var rowColorStyleClass = 'vui_tblrowcolor_' + contextObject['ROWCOLOR'];
                            listItem.addStyleClass(rowColorStyleClass);
                        }*/

                        if (oControl.getListItemType() === sap.m.ListType.Navigation) {
                            listItem.attachPress(function (oEvent) {
                                var record = oEvent.getSource().getBindingContext(oControl.getProperty('modelName')).getObject();
                                oControl.fireOnItemSelect({
                                    oEvent: oEvent,
                                    record: record
                                });
                            });
                            listItem.attachDetailPress(function (oEvent) {
                                var record = oEvent.getSource().getBindingContext(oControl.getProperty('modelName')).getObject();
                                oControl.fireOnDetailPress({
                                    oEvent: oEvent,
                                    record: record
                                });
                            });
                        } else {
                            listItem.attachPress(function (oEvent) {
                                var record = oEvent.getSource().getBindingContext(oControl.getProperty('modelName')).getObject();
                                oControl.fireOnItemSelect({
                                    oEvent: oEvent,
                                    record: record
                                });
                            });
                        }
                        return listItem;
                    });
                }
            };

        T.prototype.__createIconControl = function (fieldInfo, modelName, object) {
            var oControl = this;
            var template = new sap.ui.core.Icon({
                useIconTooltip: false,
                //press: [oControl.onFieldClick, oControl],
                //tooltip: fieldInfo['TOOLTIP']
            });

            /***Rel 60E SP6 QA #10234 - Start*///
            /*if (!object['READONLYCOLUMNS'].includes(fieldInfo['FLDNAME'])) {
                template.attachPress(oControl.onFieldClick, oControl);
            }*/

            if (object['READONLYCOLUMNS'].indexOf("<" + fieldInfo['FLDNAME'] + ">") === -1) {
                template.attachPress(oControl.onFieldClick, oControl);
            }
            /***Rel 60E SP6 QA #10234 - End*///
            var dataPath;
            if (fieldInfo['SDSCR'] == global.vui5.cons.fieldValue.description || fieldInfo['SDSCR'] == global.vui5.cons.fieldValue.value_cont_descr) {
                dataPath = fieldInfo['TXTFL'];
            } else {
                dataPath = fieldInfo['FLDNAME'];
            }

            //*****Rel 60E_SP6            
            template.bindProperty("tooltip", modelName + ">" + dataPath, function (value) {
                if (value != undefined && !underscoreJS.isEmpty(value)) {
                    return value;
                }
                else {
                    return fieldInfo['TOOLTIP'];
                }
            }, sap.ui.model.BindingMode.OneWay);
            //*****

            template.bindProperty("src", modelName + ">" + dataPath, function (value) {
                var bindingContext = this.getBindingContext(oControl.getModelName());
                if (bindingContext) {
                    var rowData = bindingContext.getObject();
                    if (rowData) {
                        var objectValue = rowData[fieldInfo['FLDNAME']];

                        var iconProperty = underscoreJS.find(fieldInfo['STYLES'], {
                            'VALUE': objectValue
                        });
                        if (iconProperty) {
                            this.addStyleClass('vuisapText' + iconProperty['COLOR']);
                            return iconProperty.ICON;
                        }
                    }
                }
                //                return "sap-icon://status-positive";
            });
            template.data("fieldname", dataPath);
            template.data("fieldInfo", fieldInfo);
            return template;
        };

        T.prototype.changeFieldColor = function (selection, fieldInfo, contextObject, fields) {
            if (fieldInfo['FLSTL'] == global.vui5.cons.styleType.color) {
                var colorValue;
                colorValue = underscoreJS.find(fieldInfo['STYLES'], {
                    'VALUE': contextObject[fieldInfo['FLDNAME']]
                });
                if (!colorValue) {

                    fieldInfo = underscoreJS.find(fields, {
                        'TXTFL': fieldInfo['FLDNAME']
                    });
                    if (fieldInfo) {
                        colorValue = underscoreJS.find(fieldInfo['STYLES'], {
                            'VALUE': contextObject[fieldInfo['FLDNAME']]
                        });
                    }
                }
                if (colorValue) {
                    selection.addStyleClass('vuisapText' + colorValue['COLOR']); // className);
                }
            }
        };

        T.prototype.bindTypeAheadField = function (selection, fieldPath, fieldInfo) {
            var oControl = this;
            var oController = this.getController();
            selection.setShowSuggestion(true);
            selection.setFilterSuggests(false);

            if (fieldInfo['INTLEN'] == 1) {
                selection.setStartSuggestion(1);
            }
            else {
                selection.setStartSuggestion(2);
            }

            selection.setMaxSuggestionWidth("50%");
            selection.attachSuggest(function (oEvent) {
                var source = oEvent.getSource();

                var model = source.getModel(source.data("model"));
                var fieldInfo = model.getProperty(source.data("path"));


                oEvent.mParameters['eventType'] = global.vui5.cons.fieldSubEvent.typeAhead;
                oEvent.mParameters['fieldInfo'] = fieldInfo;
                oEvent.mParameters['fieldValue'] = oEvent.getParameter('suggestValue');
                oEvent.mParameters['oEvent'] = oEvent;
                oEvent.mParameters['rowId'] = oControl._getCurrentRow(oEvent);
                oControl.preProcessFieldEvent(oEvent);


                source.bindAggregation("suggestionColumns", global.vui5.modelName + ">/TYPEAHEAD/" + fieldInfo['FLDNAME'] + "/FIELDS", function (sid, oContext) {
                    var contextObject = oContext.getObject();
                    return new sap.m.Column({
                        header: new sap.m.Text({
                            text: contextObject['LABEL']
                        })
                    });
                });
                source.bindAggregation("suggestionRows", global.vui5.modelName + ">/TYPEAHEAD/" + fieldInfo['FLDNAME'] + "/DATA", function (sid, oContext) {
                    var contextObject = oContext.getObject();
                    var model = oControl.getModel(global.vui5.modelName);
                    var fields = model.getProperty("/TYPEAHEAD/" + fieldInfo['FLDNAME'] + "/FIELDS");
                    var cells = [];
                    underscoreJS.each(fields, function (obj) {
                        var label = new sap.m.Label({
                            text: contextObject[obj['FLDNAME']]
                        });
                        cells.push(label);
                    });
                    var listItem = new sap.m.ColumnListItem({
                        vAlign: sap.ui.core.VerticalAlign.Middle,
                        cells: cells
                    });
                    return listItem;
                });
            });
            if (!fieldInfo['MULTISELECT']) {
                selection.attachSuggestionItemSelected(function (oEvent) {
                    oControl.handleSuggestionItemSelected(oEvent);
                });
            }

            selection.data("model", oControl.getModelName());
            selection.data("path", fieldPath);
        };

        T.prototype.handleSuggestionItemSelected = function (oEvent) {
            var oControl = this;
            var source = oEvent.getSource();
            var model = source.getModel(source.data("model"));
            var fieldInfo = model.getProperty(source.data("path"));
            var item = oEvent.getParameter("selectedRow");
            var rowData = item.getBindingContext(global.vui5.modelName).getObject();
            var mainModel = oControl.getProperty("controller").getMainModel();
            var returnField = mainModel.getProperty("/TYPEAHEAD/" + fieldInfo['FLDNAME'] + "/RETURNFIELD");
            var descrField = mainModel.getProperty("/TYPEAHEAD/" + fieldInfo['FLDNAME'] + "/DESCRFIELD");
            /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - Start ***/
            //source.setValue(rowData[returnField]);
            if (!source.data(global.vui5.cons.fromTableForm)) {
                source.setValue(rowData[returnField]);
            }
            /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - End ***/

            /*Description Buffer Changes*/
            if (descrField && descrField != '') {
                var descriptionBuffer = mainModel.getProperty("/DESCRIPTION_BUFFER");
                var bufferEntry = underscoreJS.find(descriptionBuffer, {
                    'FLDNAME': fieldInfo['FLDNAME'],
                    'TABNAME': fieldInfo['TABNAME'],
                    'FLDVAL': rowData[returnField]
                });
                if (bufferEntry) {
                    bufferEntry['DESCRIPTION'] = rowData[descrField];
                } else {
                    descriptionBuffer.push({
                        'FLDNAME': fieldInfo['FLDNAME'],
                        'TABNAME': fieldInfo['TABNAME'],
                        'FLDVAL': rowData[returnField],
                        'DESCRIPTION': rowData[descrField]
                    });
                }
            }
            /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - Start ***/
            if (!source.data(global.vui5.cons.fromTableForm)) {
                //No Need to raise fire change event here in case of Multi Input field from
                //form or table because from onMultiF4Select fire change event will be raised
                /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - End ***/
                source.fireChange();
                /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - Start ***/
            }
            /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - End ***/
        };
        // T.prototype.setListItemType = function(listItemType) {
        // listItemType = listItemType;
        // var tableItems = this._oTable.getItems();
        // if(tableItems.length > 0){
        // underscoreJS.each(tableItems,function(obj){
        // obj.setProperty("type",listItemType);
        // });
        // }
        // };

        T.prototype._onFilterTable = function (event) {
            var value = event.getParameter("query");
            this.filterTable(value);
        };

        T.prototype.filterTable = function (value) {
            this._applyFilter();
            // this.getInfoToolbar().setVisible(false);
            // var binding = this.getBinding("items");

            // if(value != "" && value != undefined) {
            // var mainModel = this.getModel(this.getModelName());
            // var fields =
            // mainModel.getProperty(this.getFieldPath());

            // var filter = [];
            // underscoreJS.each(fields,function(field){
            // var sPath;
            // if(field){
            // if(field['SDSCR'] != 'A' && field['SDSCR'] != 'B') {
            // sPath = field['TXTFL'];
            // }else{
            // sPath = field['FLDNAME'];
            // }
            // }
            // if(field['INTTYPE'] != 'P')
            // filter.push(new
            // Filter(sPath,sap.ui.model.FilterOperator.Contains,value));
            // });

            // binding.filter(new
            // Filter(filter,false),sap.ui.model.FilterType.Application);
            // }
            // else {
            // binding.filter();
            // }
        };

        T.prototype._applyFilter = function () {
            var filters = [];
            var binding = this.getBinding("items");

            /* Perform Filter and Sorting in Backend */
            var appFilter = this._prepareFilter(true);
            if (appFilter && this.getBackendSortFilter() == false) {
                filters.push(appFilter);
            }

            var searchFilter = this._prepareFilter(false);
            if (searchFilter) {
                filters.push(searchFilter);
            }

            if (filters.length > 0) {
                binding.filter(new Filter(filters, true), sap.ui.model.FilterType.Application);
            } else {
                binding.filter();
            }
        };

        T.prototype._prepareFilter = function (fromPersonalization) {
            var appFilter;
            var fields;
            var filter = [];
            if (fromPersonalization && this._filterItems) {
                if (this._filterItems.length > 0) {

                    fields = this.getModel(this.getModelName()).getProperty(this.getFieldPath());

                    var fieldnames = underscoreJS.uniq(underscoreJS.pluck(this._filterItems, 'COLUMNKEY'));

                    for (var j = 0; j < fieldnames.length; j++) {
                        var field = underscoreJS.find(fields, {
                            FLDNAME: fieldnames[j]
                        });
                        if (field) {
                            var sPath;
                            if (field['SDSCR'] != global.vui5.cons.fieldValue.value && field['SDSCR'] != global.vui5.cons.fieldValue.value_descr) {
                                sPath = field['TXTFL'];
                            } else {
                                sPath = fieldnames[j];
                            }

                            var includeFilter = [];
                            var items = underscoreJS.where(this._filterItems, {
                                'COLUMNKEY': fieldnames[j]
                            });

                            for (var i = 0; i < items.length; i++) {
                                var operation;
                                if (items[i]['EXCLUDE'] == true || items[i]['EXCLUDE'] == "true" || items[i]['EXCLUDE'] == "X") {
                                    operation = 'NE';
                                    filter.push(new Filter(sPath, operation, items[i]['VALUE1'], items[i]['VALUE2']));
                                } else {
                                    operation = items[i]['OPERATION'];
                                    includeFilter.push(new Filter(sPath, operation, items[i]['VALUE1'], items[i]['VALUE2']));
                                }
                            }
                            if (includeFilter.length > 0) {
                                filter.push(new Filter(includeFilter, false));
                            }
                        }
                    }

                    appFilter = new Filter(filter, true);
                }
            } else {
                var value = this._oSearchField.getValue();
                if (value != "" && value != undefined) {
                    var mainModel = this.getModel(this.getModelName());
                    fields = mainModel.getProperty(this.getFieldPath());

                    underscoreJS.each(fields, function (field) {
                        var sPath;
                        if (field) {
                            if (field['SDSCR'] != global.vui5.cons.fieldValue.value && field['SDSCR'] != global.vui5.cons.fieldValue.value_descr) {
                                sPath = field['TXTFL'];
                            } else if (field['DATATYPE'] == global.vui5.cons.dataType.amount || field['DATATYPE'] == global.vui5.cons.dataType.quantity
                                || field['DATATYPE'] == global.vui5.cons.dataType.decimal || field['DATATYPE'].substr(0, 3) == global.vui5.cons.dataType.integer) {
                                sPath = field['TXTFL'];
                            } else {
                                sPath = field['FLDNAME'];
                            }
                        }
                        if (sPath) {
                            if (field['INTTYPE'] != global.vui5.cons.intType.packed) {
                                filter.push(new Filter(sPath, sap.ui.model.FilterOperator.Contains, value));
                            }
                            else {
                                filter.push(new Filter(sPath, sap.ui.model.FilterOperator.EQ, value));
                            }
                        }
                    });
                    appFilter = new Filter(filter, false);
                }
            }
            return appFilter;
        };

        T.prototype._addPanel = function (dialog) {

            var oControl = this;
            /*
       * referring i18n from global utilities instead of application i18n -
       * START
       */
            // var bundle =
            // this.getModel("i18n").getResourceBundle();
            //var bundle = this.getModel("i18n").getResourceBundle();
            /*
       * referring i18n from global utilities instead of application i18n -
       * END
       */


            var columns = this.getModel(this.getModelName()).getProperty(this.getFieldPath());

            var editable = this.getEditable();

            this._columnPanel = new sap.m.P13nColumnsPanel({
                title: oControl._oBundle.getText("Columns"),
                visible: true,
                type: "columns",
                changeColumnsItems: this.updateColumnsItems.bind(this)
            });

            //            oControl._columnPanel.bindItems(this.getModelName() + ">" + this.getFieldPath(), function (sid, oContext) {
            //                var object = oContext.getObject();
            //                return new sap.m.P13nItem({
            //                    columnKey: object['FLDNAME'],
            //                    text: object['LABEL']
            //                });
            //            });

            // underscoreJS.each(columns,function(object) {
            // oControl._columnPanel.addItem(new sap.m.P13nItem({
            // columnKey: object['FLDNAME'],
            // text: object['LABEL']
            // }));
            // });

            underscoreJS.each(columns, function (object, index) {
                var visible;
                if (editable) {
                    if (object['NO_OUT'] == '') {
                        visible = true;
                    } else {
                        visible = false;
                    }
                } else {
                    if (object['NO_OUT'] != '' || object['ADFLD'] != '') {
                        visible = false;
                    } else {
                        visible = true;
                    }
                }
                if (object['ADFLD'] === '') {
                    oControl._columnPanel.addItem(new sap.m.P13nItem({
                        columnKey: object['FLDNAME'],
                        text: object['LABEL'],
                    }));
                    oControl._columnPanel.addColumnsItem(new sap.m.P13nColumnsItem({
                        columnKey: object['FLDNAME'],
                        index: index, // object['POSTN'],
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

            /* Add none in Sort Panel item */
            this._sortPanel.removeAllItems();
            /*this._sortPanel.addItem(new sap.m.P13nItem({
                columnKey: "",
                text: oControl._oBundle.getText("none")
            }));*/

            /*** Rel 60E SP6 - Filter values sorting based on Label - Start ***/
            columns = underscoreJS.sortBy(columns, 'LABEL');
            /*** Rel 60E SP6 - Filter values sorting based on Label - End ***/

            underscoreJS.each(columns, function (object) {
                oControl._sortPanel.addItem(new sap.m.P13nItem({
                    columnKey: object['FLDNAME'],
                    text: object['LABEL']
                }));
            });

            // oControl._sortPanel.bindItems(this.getModelName() +
            // ">" +
            // this.getFieldPath(),function(sid,oContext){
            // var object = oContext.getObject();
            // return new sap.m.P13nItem({
            // columnKey: object['FLDNAME'],
            // text: object['LABEL']
            // })
            // });

            /** ** */
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

            /*oControl._filterPanel.bindItems(this.getModelName() + ">" + this.getFieldPath(), function (sid, oContext) {
                var object = oContext.getObject();
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

                return new sap.m.P13nItem({
                    columnKey: object['FLDNAME'],
                    text: object['LABEL'],
                    type: type
                });
            });*/

            /*** Rel 60E SP6 - Filter values sorting based on Label - End ***/
            // underscoreJS.each(columns,function(object) {
            // // if(object['TXTFL'] == '') {
            // var type;
            // if(object['INTTYPE'] == 'N' ||
            // object['INTTYPE'] == 'T' ||
            // object['INTTYPE'] == 'I' ||
            // object['INTTYPE'] == 'b' ||
            // object['INTTYPE'] == 's' ||
            // object['INTTYPE'] == 'P' ||
            // object['INTTYPE'] == 'F' ||
            // object['INTTYPE'] == 'a' ||
            // object['INTTYPE'] == 'e'){
            // type = 'numeric';
            // }else if(object['INTTYPE'] == 'D'){
            // type = 'date';
            // }else {
            // type = 'string';
            // }

            // oControl._filterPanel.addItem(new sap.m.P13nItem({
            // columnKey: object['FLDNAME'],
            // text: object['LABEL'],
            // type : type
            // }));
            // // }
            // });
            dialog.addPanel(this._filterPanel);
        };

        T.prototype.addGroupPanelItem = function (dialog) {

            var oControl = this;
            if(oControl.isGroupingPresent()){
            	return;
            }
            /*
       * referring i18n from global utilities instead of application i18n -
       * START
       */
            // var bundle =
            // this.getModel("i18n").getResourceBundle();
            //var bundle = this.getModel("i18n").getResourceBundle();
            /*
       * referring i18n from global utilities instead of application i18n -
       * END
       */

            /*** Rel 60E SP6 - Filter values sorting based on Label - Start ***/
            //var columns = this.getModel(this.getModelName()).getProperty(this.getFieldPath());
            var columns = $.extend(true, [], this.getModel(this.getModelName()).getProperty(this.getFieldPath()));
            columns = underscoreJS.sortBy(columns, 'LABEL');
            /*** Rel 60E SP6 - Filter values sorting based on Label - End ***/

            if (!this._groupPanel) {
                this._groupPanel = new sap.m.P13nGroupPanel({
                    maxGroups: '1',
                    title: oControl._oBundle.getText("Group"),
                    visible: true,
                    type: "group",
                    containerQuery: true,
                    layoutMode: "Desktop",
                    addGroupItem: this.addGroupItem.bind(this),
                    removeGroupItem: this.removeGroupItem.bind(this),
                    updateGroupItem: this.updateGroupItem.bind(this)
                });

                this._groupPanel.setMaxGroups(1);
                dialog.addPanel(this._groupPanel);
            }

            this._groupPanel.removeAllItems();
            /*this._groupPanel.addItem(new sap.m.P13nItem({
                columnKey: "",
                text: oControl._oBundle.getText("none")
            }));*/
            underscoreJS.each(columns, function (object) {
                oControl._groupPanel.addItem(new sap.m.P13nItem({
                    columnKey: object['FLDNAME'],
                    text: object['LABEL']
                }));
            });


            this.addAggregatePanelItem(dialog);
        };

        T.prototype.updateColumnsItems = function () {
            this._oVariants.currentVariantSetModified(true);
            //*****Rel 60E_SP7
            this._updateShowResetEnabled(true);
            //*****
        };

        //*****Rel 60E_SP7
        T.prototype._updateShowResetEnabled = function (showReset) {
            if (this._PersonalizationDialog.getShowResetEnabled && this._PersonalizationDialog.getShowResetEnabled() != showReset)
                this._PersonalizationDialog.setProperty("showResetEnabled", showReset);
        }
        //*****

        T.prototype.createPersonalizationDialog = function () {
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

            jQuery.sap.syncStyleClass(_sContentDensityClass, this, this._PersonalizationDialog);
        };

        /*** Rel 60E SP6 - Raise Update event in case of Editable Table - Start ***/
        T.prototype.processSettingsPressed = function () {
            if (!this._PersonalizationDialog) {
                this.createPersonalizationDialog();
            }
                /*** Rel 60E SP6 - Personalization Issue after 1.50 Upgrade - Start ***/
            else {
                this.updatePersonalizationItems();
            }
            /*** Rel 60E SP6 - Personalization Issue after 1.50 Upgrade - End ***/
            this.currentVaraintModified = this._oVariants.currentVariantGetModified();

            this.addGroupPanelItem(this._PersonalizationDialog);


            this.fillPersonalizationItems();
            this._PersonalizationDialog.open();
        };
        T.prototype._onSettingPressed = function () {
            var oControl = this;
            if (oControl.getEditable()) {
                oControl.fireOnUpdate({
                    callFrom: global.vui5.cons.updateCallFrom.personalization,
                    callBack: function () {
                        oControl.processSettingsPressed();
                    }
                });
            }
            else {
                oControl.processSettingsPressed();
            }
        };
        //T.prototype._onSettingPressed = function () {
        //    //this.fireOnUpdate();
        //    if (!this._PersonalizationDialog) {
        //        this.createPersonalizationDialog();
        //    }
        //        /*** Rel 60E SP6 - Personalization Issue after 1.50 Upgrade - Start ***/
        //    else {
        //        this.updatePersonalizationItems();
        //    }
        //    /*** Rel 60E SP6 - Personalization Issue after 1.50 Upgrade - End ***/
        //    this.currentVaraintModified = this._oVariants.currentVariantGetModified();

        //    this.addGroupPanelItem(this._PersonalizationDialog);


        //    this.fillPersonalizationItems();
        //    this._PersonalizationDialog.open();
        //};

        /*** Rel 60E SP6 - Raise Update event in case of Editable Table - End ***/
        T.prototype._ExportPress = function () {
            var oControl = this;
            var oController = this.getController();
            var rowCount = oController.getModel(oController.modelName).getProperty(this.getTotalNumberOfRows());
            var pageSize = oControl.getPagingThreshold();
            var paging = this.getPagingType();
            if ((oControl._filterItems && oControl._filterItems.length != 0) && oControl.getItems().length == 0) {
                oControl._ExportAllPress(oControl);
            }
            else if ((paging == global.vui5.cons.pagingType.serverPaging && (pageSize !== rowCount)) || (oControl._filterItems && oControl._filterItems.length != 0)) {

                var oMenuSet = new sap.ui.unified.Menu();
                oControl._menu = oMenuSet;
                var oMenu1 = new sap.ui.unified.MenuItem({

                    text: oControl._oBundle.getText("ExportExisting"),
                    select: function (event) {
                        oControl._menu.close();
                        oController._processExport({
                            table: oControl
                        });
                    }

                })
                var oMenu2 = new sap.ui.unified.MenuItem({

                    text: oControl._oBundle.getText("ExportAll"),
                    select: function (event) {
                        oControl._menu.close();
                        oControl._ExportAllPress(oControl);
                    }

                })
                this._menu.addItem(oMenu1);
                this._menu.addItem(oMenu2);
                var eDock = sap.ui.core.Popup.Dock;
                this._menu.open(false, this._exportButton, eDock.BeginTop, eDock.BeginBottom, this._exportButton);
            }
            else {
                oController._processExport({
                    table: oControl
                });
            }
        };

        //Mass Edit
        T.prototype._onMassEdit = function () {
            var oControl = this, tableData = {}, sectionConfig = oControl.getController().sectionConfig[oControl.getSectionID()];
            var sPaths;

            sPaths = oControl.getSelectedContexts();

            if (underscoreJS.isEmpty(sPaths)) {
                sap.m.MessageToast.show(oControl._oBundle.getText("SelectRowMsg"));
                return;
            }
            tableData['SPATHS'] = underscoreJS.pluck(sPaths, 'sPath');
            tableData['DATAAREAPATH'] = oControl.getDataAreaPath();
            tableData['FIELDSPATH'] = oControl.getFieldPath();
            tableData['LAYOUTDATAPATH'] = oControl.getLayoutDataPath();
            tableData['DATAPATH'] = oControl.getDataPath();
            tableData['ENABLEAPPLYBACKGROUND'] = sectionConfig.attributes[global.vui5.cons.attributes.enableBulkEdit] === global.vui5.cons.bulkEditType.server &&
                                                 sPaths.length === oControl.getModel(oControl.getModelName()).getProperty(oControl.getDataPath()).length;
            oControl.fireOnMassEdit({
                tableData: tableData
            });
        };


        T.prototype._ExportAllPress = function (oEvent) {
            var oControl = this, oController, action;
            oController = this.getController();
            action = {
                "FNCNM": global.vui5.cons.eventName.excelExport
            }
            oControl.fireOnExport({
                action: action,
                callBack: function () {
                    oController._processExport({
                        table: oControl,
                        fromServer: true
                    });
                }
            })
        };
        T.prototype.onAfterRendering = function (oEvent) {
            var oControl = this;
            var columns = oEvent.srcControl.getColumns(), headerText;
            var layoutData = oControl.getModel(oControl.getModelName()).getProperty(oControl.getLayoutDataPath());

            //       jQuery.each($("#"+oEvent.srcControl.getId() + ">table>thead>tr>th"), function (index,column) {
            //         $("#"+column.id).css("cursor","pointer");
            //         $("#"+column.id).on("click", function(){
            //           oControl.onColumnClick(index-1,column)
            //           });
            // });

            if (oControl.getEnablePersonalization()) {


                underscoreJS.each(columns, function (column, index) {
                    var headerText = column.getHeader();
                    var object = column.getBindingContext(oControl.getModelName()).getObject();


                    $('#' + headerText.getId()).css('cursor', 'pointer');
                    jQuery('#' + headerText.getId()).click(function () {
                        oControl.onColumnClick(index, jQuery('#' + headerText.getId()).parent()[0]);
                    });
                });

            }
        };
        T.prototype.onColumnClick = function (index, ref) {
            var oControl = this;
            var oMenuSet = new sap.ui.unified.Menu();
            var model = oControl.getModel(oControl.getModelName());
            var field_groups = model.getProperty(oControl.getFieldGroupPath());
            var fields = model.getProperty(oControl.getFieldPath());
            if (oControl.isGroupingPresent() && field_groups.length > 0 && field_groups[index]['FLGRP']) {
                var group_fields = underscoreJS.where(fields, { FLGRP: field_groups[index]['FLGRP'], NO_OUT: '' });
                underscoreJS.each(group_fields, function (field) {
                    var subMenu = new sap.ui.unified.Menu();
                    var oMenuItemDescending = new sap.ui.unified.MenuItem({
                        icon: "sap-icon://sort-descending",
                        text: oControl._oBundle.getText("Sort Descending"),
                        select: function (oEvent) {
                            oMenuSet.close();
                            oControl.SortItemClick(oEvent, field['FLDNAME'])
                        }

                    });
                    var oMenuItemAscending = new sap.ui.unified.MenuItem({
                        text: oControl._oBundle.getText("Sort Ascending"),
                        icon: "sap-icon://sort-ascending",
                        select: function (oEvent) {
                            oMenuSet.close();
                            oControl.SortItemClick(oEvent, field['FLDNAME'])
                        }
                    });
                    subMenu.addItem(oMenuItemAscending);
                    subMenu.addItem(oMenuItemDescending);
                    var oMenu1 = new sap.ui.unified.MenuItem({
                        text: field["LABEL"]
                    });
                    oMenuSet.addItem(oMenu1);
                    oMenu1.setSubmenu(subMenu);;
                });
            } else {
                var oMenu1 = new sap.ui.unified.MenuItem({
                    text: oControl._oBundle.getText("Sort Ascending"),
                    icon: "sap-icon://sort-ascending",
                    select: function (oEvent) {
                        oMenuSet.close();
                        oControl.SortItemClick(oEvent, oControl.getColumns()[index].data("contextObject")['FLDNAME'])
                    }
                })
                var oMenu2 = new sap.ui.unified.MenuItem({
                    icon: "sap-icon://sort-descending",
                    text: oControl._oBundle.getText("Sort Descending"),
                    select: function (oEvent) {
                        oMenuSet.close();
                        oControl.SortItemClick(oEvent, oControl.getColumns()[index].data("contextObject")['FLDNAME'])
                    }

                })
                oMenuSet.addItem(oMenu1);
                oMenuSet.addItem(oMenu2);
            }

            var eDock = sap.ui.core.Popup.Dock;
            oMenuSet.open(false, ref, eDock.BeginTop, eDock.BeginBottom, ref)
        };
        T.prototype.SortItemClick = function (oEvent, fldname) {

            var oControl = this, oText, oFound;
            if (!oControl._PersonalizationDialog) {
                oControl.createPersonalizationDialog();
                oControl.addGroupPanelItem(oControl._PersonalizationDialog);
                oControl.fillPersonalizationItems();
            }

            var sortItems = oControl._sortPanel.getSortItems();

            underscoreJS.each(sortItems, function (sortItem) {
                if (sortItem.getColumnKey() === fldname) {
                    oControl._sortPanel.removeSortItem(sortItem)
                }

            });
            //            oText = column.getHeader();
            if (oEvent.getSource().getText() === "Sort Ascending") {
                // $('#' + oText.getId()).parent().removeClass("vuisapUiTableColSF vuisapUiTableColSortedD");
                // $('#' + oText.getId()).parent().addClass("vuisapUiTableColSF vuisapUiTableColSorted");
                oControl._sortPanel.addSortItem(new sap.m.P13nSortItem({
                    columnKey: fldname,
                    operation: sap.m.P13nConditionOperation.Ascending
                }));
                this._oVariants.currentVariantSetModified(true);

            }
            else {
                //$('#' + oText.getId()).parent().removeClass("vuisapUiTableColSF vuisapUiTableColSorted");
                // $('#' + oText.getId()).parent().addClass("vuisapUiTableColSF vuisapUiTableColSortedD");
                oControl._sortPanel.addSortItem(new sap.m.P13nSortItem({
                    columnKey: fldname,
                    operation: sap.m.P13nConditionOperation.Descending
                }));
                this._oVariants.currentVariantSetModified(true);
            }


            oControl.handlePersonalizationOk();
            /****** Rel 60E_SP7 TASK #52848  */
            var fields = oControl.getModel(this.getModelName()).getProperty(this.getFieldPath());
            var currentField = underscoreJS.find(fields, { FLDNAME: fldname });
            var grpField = currentField['FLGRP'] ? true : false;
            var columnObj;
//            if(oControl.isGroupingPresent()){
//              var field_groups = oControl.getModel(oControl.getModelName()).getProperty(oControl.getFieldGroupPath());
//            	if(field['FLGRP']){
//            		columnObj = underscoreJS.find(field_groups,{FLGRP:field['FLGRP']})
//            	}
//            	else if(field['FLDNAME']){
//            		columnObj = underscoreJS.find(field_groups,{FLDNAME:field['FLDNAME']})
//            	}
//            	 if (columnObj && !columnObj.getMergeDuplicates() && oControl.getMergeDuplicates())
//                     columnObj.setMergeDuplicates(true);
//            }
//            else{
            if(!oControl.isGroupingPresent()){
            	underscoreJS.each(oControl.getColumns(), function (column) {
                    if (column.data('contextObject')['FLDNAME'] === fldname) {
                        columnObj = column;
                    }
                })
                //if (!grpField && columnObj) {
                if(columnObj){
                    if (!columnObj.getMergeDuplicates() && oControl.getMergeDuplicates())
                        columnObj.setMergeDuplicates(true);

                }
            }
          //  }
            
            

            /***/
            oEvent.getSource().getParent().close();


        };
        T.prototype._onInfoToolbar = function () {
            if (!this._PersonalizationDialog) {
                this.createPersonalizationDialog();
            }

            this._PersonalizationDialog.setInitialVisiblePanelType('filter');
            var panels = this._PersonalizationDialog.getPanels();
            for (var i = 0; i < panels.length; i++) {
                this._PersonalizationDialog._setVisibilityOfPanel(panels[i]);
            }

            this.currentVaraintModified = this._oVariants.currentVariantGetModified();

            this.addGroupPanelItem(this._PersonalizationDialog);
            this.fillPersonalizationItems();
            this._PersonalizationDialog.open();
        };

        T.prototype.handleClose = function () {

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
            if(oControl._groupPanel){
            	oControl._groupPanel.removeAllGroupItems();
                underscoreJS.each(this._groupItems, function (item) {
                    var showIfGrouped;
                    if (item['SHOWIFGROUPED'] == "true" || item['SHOWIFGROUPED'] == true || item['SHOWIFGROUPED'] == "X") {
                        showIfGrouped = true;
                    }
                    else {
                        showIfGrouped = false;
                    }

                    oControl._groupPanel.addGroupItem(new sap.m.P13nGroupItem({
                        columnKey: item['COLUMNKEY'],
                        operation: item['OPERATION'],
                        showIfGrouped: showIfGrouped
                    }));
                });
            }
            this._oVariants.currentVariantSetModified(this.currentVaraintModified);
            this._PersonalizationDialog.close();
        };

        T.prototype.handleReset = function (oEvent) {
            var oControl = this;
            var variant = this._oVariants.getSelectionKey();
            if (variant != "*standard*") {
                if (!oEvent.mParameters) {
                    oEvent.mParameters = {};
                }
                oEvent.mParameters['key'] = variant;
                oControl._onVariantSelect(oEvent);
            } else {
            	if(oControl._aggrPanel)
                this._aggrPanel.clearValues();
                this._columnPanel.removeAllColumnsItems();

                //*****Rel 60E_SP6 
                if (this.isGroupingPresent() && this._fields) {
                    var columns = this._fields;
                }
                else {
                    var columns = this.getModel(this.getModelName()).getProperty(this.getFieldPath());
                }
                //*****

                var editable = oControl.getEditable();

                underscoreJS.each(columns, function (object, index) {
                    var visible;

                    if (editable) {
                        if (object['NO_OUT'] == '') {
                            visible = true;
                        } else {
                            visible = false;
                        }
                    } else {
                        if (object['NO_OUT'] != '' || object['ADFLD'] != '') {
                            visible = false;
                        } else {
                            visible = true;
                        }
                    }

                    oControl._columnPanel.addColumnsItem(new sap.m.P13nColumnsItem({
                        columnKey: object['FLDNAME'],
                        index: index, // object['POSTN'],
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

        T.prototype.fillPersonalizationItems = function (tableItems) {

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
          /*****Rel 60E_SP7 - QA #12832 Start **/
	        if(tableItems && this._sortItems.length>0){
	        	var sortedFieldNames = underscoreJS.pluck(this._sortItems,'COLUMNKEY');
	          	underscoreJS.each(oControl.getColumns(), function (column) {
	          		var fieldName = column.data('contextObject')['FLDNAME'];
	          		if(fieldName){
	          			var fieldExists = underscoreJS.indexOf(sortedFieldNames,fieldName);
	          			if(fieldExists>=0){
	          				if(column.getMergeDuplicates()){
	    		              	column.setMergeDuplicates(false);
	    		            }
	          			}
	          		}
	          		
	            })
	          }
	        /********Rel 60E_SP7 - QA #12832 End ***/
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
            if(oControl._groupPanel){
	            var groupItems = this._groupPanel.getGroupItems();
	            this._groupItems = [];
	            underscoreJS.each(groupItems, function (obj) {
	                oControl._groupItems.push({
	                    'COLUMNKEY': obj.mProperties.columnKey,
	                    'OPERATION': obj.mProperties.operation
	                });
	            });
            }
        };

        //*****Rel 60E_SP5
        T.prototype.timeFormat = function (value) {
            var output;
            if (value) {
                var hours = value.substr(0, 2);
                var minutes = value.substr(2, 2);
                var seconds = value.substr(4, 2);
                output = hours + ":" + minutes + ":" + seconds;
            }
            return output;
        };

        T.prototype.dateFormat = function (value) {
            var output;
            if (value) {

                if (value == "0000-00-00") {
                    return '';
                }
                var mainModel = this.getModel(vui5.modelName);
                if (mainModel.getProperty("/SESSION_INFO/DATFM") != undefined) {
                    var year = value.substr(0, 4);
                    var month = value.substr(4, 2);
                    var day = value.substr(6, 2);
                    switch (mainModel.getProperty("/SESSION_INFO/DATFM")) {
                        case vui5.cons.dateFormat.type0:
                            var months = mainModel.getProperty("/DROPDOWNS/" + vui5.cons.dropdownsDatar + "/MONTHS");
                            if (months) {
                                var monthData = underscoreJS.find(months, { NAME: month });
                                if (monthData) {
                                    output = monthData['VALUE'] + " " + day + ", " + year;
                                } else {
                                    output = value;
                                }
                            } else {
                                output = value;
                            }
                            break;
                        case vui5.cons.dateFormat.type1:
                            output = day + "." + month + "." + year;
                            break;
                        case vui5.cons.dateFormat.type2:
                            output = month + "/" + day + "/" + year;
                            break;
                        case vui5.cons.dateFormat.type3:
                            output = month + "-" + day + "-" + year;
                            break;
                        case vui5.cons.dateFormat.type4:
                            output = year + "." + month + "." + day;
                            break;
                        case vui5.cons.dateFormat.type5:
                        case vui5.cons.dateFormat.typeA:
                        case vui5.cons.dateFormat.typeB:
                        case vui5.cons.dateFormat.typeC:
                            output = year + "/" + month + "/" + day;
                            break;
                        case vui5.cons.dateFormat.type6:
                            output = year + "-" + month + "-" + day;
                            break;
                        default:
                            output = value;
                            break;
                    }
                }

            } else {
                output = "";
            }

            return output;
        };

        P13nConditionPanel.prototype._getValueTextFromField = function (oControl, oFormatter) {
            if (oControl.getDateValue && oControl.getDateValue()) {
                return oFormatter.format(oControl.getDateValue());
            }

            if (oControl instanceof sap.m.Select) {
                return oControl.getSelectedItem() ? oControl.getSelectedItem().getText() : "";
            }
            //*****Rel 60E_SP5
            if (oControl instanceof global.vui5.ui.controls.ComboBox || oControl.data("instance")) {
                return oControl.getSelectedItem() ? oControl.getSelectedKey() : "";
            }
            //*****

            return oControl.getValue();
        };

        P13nConditionPanel.prototype._changeOperationValueFields = function (oTargetGrid, oConditionGrid) {
            // var oKeyfield = oConditionGrid.keyField;
            var oOperation = oConditionGrid.operation;
            var sOperation = oOperation.getSelectedKey();
            var oValue1 = oConditionGrid.value1;
            var oValue2 = oConditionGrid.value2;
            var oShowIfGroupedvalue = oConditionGrid.showIfGrouped;

            if (!sOperation) {
                return;
            }

            if (sOperation === sap.m.P13nConditionOperation.BT) {
                // for the "between" operation we enable both fields
                if (oValue1.setPlaceholder && oValue1.getPlaceholder() !== this._sFromLabelText) {
                    oValue1.setPlaceholder(this._sFromLabelText);
                }
                if (!oValue1.getVisible()) {
                    oValue1.setVisible(true);
                    // workaround: making fields invisible for all mode L/M/S does not work, so we remove the fields from the grid.
                    oConditionGrid.insertContent(oValue1, oConditionGrid.getContent().length - 1);
                }

                if (oValue2.setPlaceholder && oValue2.getPlaceholder() !== this._sToLabelText) {
                    oValue2.setPlaceholder(this._sToLabelText);
                }
                if (!oValue2.getVisible()) {
                    oValue2.setVisible(true);
                    // workaround: making fields invisible for all mode L/M/S does not work, so we remove the fields from the grid.
                    oConditionGrid.insertContent(oValue2, oConditionGrid.getContent().length - 1);
                }
                //*****Rel 60E_SP5
                oValue1.setVisible(true);
                oValue2.setVisible(true);
                oConditionGrid.insertContent(oValue2, oConditionGrid.getContent().length - 1);
                //*****
            } else {
                if (sOperation === sap.m.P13nConditionOperation.GroupAscending || sOperation === sap.m.P13nConditionOperation.GroupDescending) {

                    // update visible of fields
                    if (oValue1.getVisible()) {
                        oValue1.setVisible(false);
                        // workaround: making fields invisible for all mode L/M/S does not work, so we remove the fields from the grid.
                        oConditionGrid.removeContent(oValue1);
                    }
                    if (oValue2.getVisible()) {
                        oValue2.setVisible(false);
                        oConditionGrid.removeContent(oValue2);
                    }
                    if (oOperation.getVisible()) {
                        oOperation.setVisible(false);
                        oConditionGrid.removeContent(oOperation);
                    }
                    oShowIfGroupedvalue.setVisible(this._getMaxConditionsAsNumber() != 1);
                } else {
                    if (sOperation === sap.m.P13nConditionOperation.NotEmpty || sOperation === sap.m.P13nConditionOperation.Empty || sOperation === sap.m.P13nConditionOperation.Initial || sOperation === sap.m.P13nConditionOperation.Ascending || sOperation
                        === sap.m.P13nConditionOperation.Descending || sOperation === sap.m.P13nConditionOperation.Total || sOperation === sap.m.P13nConditionOperation.Average || sOperation === sap.m.P13nConditionOperation.Minimum || sOperation ===
                        sap.m.P13nConditionOperation.Maximum) {

                        // for this operations we disable both value fields
                        if (oValue1.getVisible()) {
                            oValue1.setVisible(false);
                            // workaround: making fields invisible for all mode L/M/S does not work, so we remove the fields from the grid.
                            oConditionGrid.removeContent(oValue1);
                        }
                        if (oValue2.getVisible()) {
                            oValue2.setVisible(false);
                            oConditionGrid.removeContent(oValue2);
                        }

                        // workaround: making fields invisible for all mode L/M/S does not work, so we remove the fields from the grid.
                        oConditionGrid.removeContent(oShowIfGroupedvalue);
                    } else {
                        // for all other operations we enable only the Value1 fields
                        if (oValue1.setPlaceholder && oValue1.getPlaceholder() !== this._sValueLabelText) {
                            oValue1.setPlaceholder(this._sValueLabelText);
                        }
                        if (!oValue1.getVisible()) {
                            oValue1.setVisible(true);
                            // workaround: making fields invisible for all mode L/M/S does not work, so we remove the fields from the grid.
                            oConditionGrid.insertContent(oValue1, oConditionGrid.getContent().length - 1);
                        }
                        if (oValue2.getVisible()) {
                            oValue2.setVisible(false);
                            oConditionGrid.removeContent(oValue2);
                        }
                    }
                }
            }

            this._adjustValue1Span(oConditionGrid);
        };


        P13nConditionPanel.prototype._handleChangeOnOperationField = function (oTargetGrid, oConditionGrid) {
            //*****Rel 60E_SP5
            this._createAndUpdateValueFields(oTargetGrid, oConditionGrid);
            //*****

            this._changeOperationValueFields(oTargetGrid, oConditionGrid);
            this._changeField(oConditionGrid);
        };

        //To clear value when column is changed
        P13nConditionPanel.prototype._handleSelectionChangeOnKeyField = function (oTargetGrid, oConditionGrid) {
            if (this._sConditionType === "Filter") {
                this._updateOperationItems(oTargetGrid, oConditionGrid);
                //*****Rel 60E_SP5
                //this._createAndUpdateValueFields(oTargetGrid, oConditionGrid);
                this._createAndUpdateValueFields(oTargetGrid, oConditionGrid, true);
                //*****
                this._changeOperationValueFields(oTargetGrid, oConditionGrid);
            }

            this._changeField(oConditionGrid);
        };

        P13nConditionPanel.prototype._createAndUpdateValueFields = function (oTargetGrid, oConditionGrid, clearSelection) {
            // update the value fields for the KeyField
            var oCurrentKeyField = this._getCurrentKeyFieldItem(oConditionGrid.keyField);

            var fnCreateAndUpdateField = function (oConditionGrid, oCtrl, index, clearSelection) {
                var sOldValue = oCtrl.getValue ? oCtrl.getValue() : "";

                var ctrlIndex = oConditionGrid.indexOfContent(oCtrl);
                //oConditionGrid.removeContent(oCtrl);
                oConditionGrid.removeAggregation("content", oCtrl, true);
                if (oCtrl._oSuggestProvider) {
                    oCtrl._oSuggestProvider.destroy();
                    oCtrl._oSuggestProvider = null;
                }
                oCtrl.destroy();
                var fieldInfo = this._aConditionsFields[index];
                oCtrl = this._createValueField(oCurrentKeyField, fieldInfo, oConditionGrid);
                oConditionGrid[fieldInfo["ID"]] = oCtrl;
                //oConditionGrid.insertContent(oCtrl, ctrlIndex);
                oConditionGrid.insertAggregation("content", oCtrl, ctrlIndex, true);

                var oValue, sValue;
                if (oConditionGrid.oFormatter && sOldValue) {
                    oValue = oConditionGrid.oFormatter.parse(sOldValue);
                    if (!isNaN(oValue) && oValue !== null) {
                        sValue = oConditionGrid.oFormatter.format(oValue);
                        oCtrl.setValue(sValue);
                    }
                }
                if (!sValue) {
                    oCtrl.setValue(sOldValue);
                }

                //*****Rel 60E_SP5
                if (clearSelection) {
                    oCtrl.setValue("");
                }
                //*****
            };

            // update Value1 field control
            jQuery.proxy(fnCreateAndUpdateField, this)(oConditionGrid, oConditionGrid.value1, 5, clearSelection);

            // update Value2 field control
            jQuery.proxy(fnCreateAndUpdateField, this)(oConditionGrid, oConditionGrid.value2, 6, clearSelection);
        };
        //

        P13nConditionPanel.prototype._createValueField = function (oCurrentKeyField, oFieldInfo, oConditionGrid) {
            var oControl;
            var sCtrlType = oCurrentKeyField ? oCurrentKeyField.type : "";
            var that = this;

            //*****Rel 60E_SP5
            var selField, selFieldIndex;
            if (this.getParent() && this.getParent().getParent() && this.getParent().getParent().data("fieldPath")) {
                var conditionKey = oConditionGrid.operation.getProperty("selectedKey");
                var keyField = oCurrentKeyField['key'];
                var control = this.getParent().getParent().data("oControl");
                var fieldPath = this.getParent().getParent().data("fieldPath");
                var modelName = this.getParent().getParent().data("modelName");
                var dataAreaPath = this.getParent().getParent().data("dataAreaPath");
                var model = this.getModel(modelName);
                var fields = model.getProperty(fieldPath);
                var dataArea = model.getProperty(dataAreaPath);
                selField = underscoreJS.findWhere(fields, { FLDNAME: keyField });
                selFieldIndex = underscoreJS.findIndex(fields, { FLDNAME: keyField });
            }
            //*****
            var params = {
                value: oFieldInfo["Value"],
                width: "100%",
                placeholder: oFieldInfo["Label"],
                change: function (oEvent) {
                    var source = oEvent.getSource();
                    var value = source.getValue();
                    source.setValueState(sap.ui.core.ValueState.None);
                    source.setValueStateText("");
                    if (vui5.cons['inputHelpFieldInfo'] && vui5.cons['controller']) {
                        var field = vui5.cons['inputHelpFieldInfo'];
                        var oController = vui5.cons['controller'];
                        if (field['DATATYPE'] === global.vui5.cons.dataType.quantity) {
                            if (oController.checkQuantityValue(value)) {
                                if (that._validateFormatFieldValue)
                                    that._validateFormatFieldValue(oEvent);
                                that._changeField(oConditionGrid);
                            }
                            else {
                                source.setValueState(sap.ui.core.ValueState.Error);
                                source.setValueStateText("Enter valid" + field['LABEL']);
                            }
                        }
                        else if (field['DATATYPE'] === global.vui5.cons.dataType.amount) {
                            if (oController.checkAmountValue(value)) {
                                if (that._validateFormatFieldValue)
                                    that._validateFormatFieldValue(oEvent);
                                that._changeField(oConditionGrid);
                            }
                            else {
                                source.setValueState(sap.ui.core.ValueState.Error);
                                source.setValueStateText("Enter valid" + field['LABEL']);
                            }
                        }
                    } else {
                        if (that._validateFormatFieldValue)
                            that._validateFormatFieldValue(oEvent);
                        that._changeField(oConditionGrid);
                    }

                },
                layoutData: new sap.ui.layout.GridData({
                    span: oFieldInfo["Span" + this._sConditionType]
                })
            };

            //            var params = {
            //                value: oFieldInfo["Value"],
            //                width: "100%",
            //                placeholder: oFieldInfo["Label"],
            //                change: function (oEvent) {
            //                    that._validateFormatFieldValue(oEvent);
            //                    that._changeField(oConditionGrid);
            //                },
            //                layoutData: new sap.ui.layout.GridData({
            //                    span: oFieldInfo["Span" + this._sConditionType]
            //                })
            //            };

            switch (sCtrlType) {
                case "boolean":
                case "enum":
                    var aItems = [];

                    //        if (sCtrlType === "boolean") {
                    //          aItems.push(new sap.ui.core.Item({
                    //            key: "",
                    //            text: ""
                    //          }));
                    //        }
                    var aValues = oCurrentKeyField.values || this._oTypeValues[sCtrlType] || ["", false, true];
                    aValues.forEach(function (oValue, index) {
                        aItems.push(new sap.ui.core.Item({
                            key: sCtrlType === "boolean" ? (index === aValues.length - 1).toString() : oValue.toString(),
                            text: oValue.toString()
                        }));
                    });

                    params = {
                        width: "100%",
                        items: aItems,
                        change: function () {
                            that._changeField(oConditionGrid);
                        },
                        layoutData: new sap.ui.layout.GridData({
                            span: oFieldInfo["Span" + this._sConditionType]
                        })
                    };
                    oConditionGrid.oFormatter = null;
                    oControl = new sap.m.Select(params);
                    break;
                case "numeric":
                    var oFloatFormatOptions;
                    if (oCurrentKeyField.precision || oCurrentKeyField.scale) {
                        oFloatFormatOptions = {};
                        if (oCurrentKeyField.precision) {
                            oFloatFormatOptions["maxIntegerDigits"] = parseInt(oCurrentKeyField.precision, 10);
                        }
                        if (oCurrentKeyField.scale) {
                            oFloatFormatOptions["maxFractionDigits"] = parseInt(oCurrentKeyField.scale, 10);
                        }
                    }
                    oConditionGrid.oFormatter = NumberFormat.getFloatInstance(oFloatFormatOptions);

                    oControl = new sap.m.Input(params);
                    break;
                case "date":
                    oConditionGrid.oFormatter = DateFormat.getDateInstance();
                    oControl = new sap.m.DatePicker(params);
                    oControl.bindProperty("displayFormat", global.vui5.modelName + ">" + global.vui5.cons.modelPath.sessionInfo + "/DATFM", Formatter.displayFormat, sap.ui.model.Binding.OneWay);

                    break;
                case "time":
                    oConditionGrid.oFormatter = DateFormat.getTimeInstance();
                    oControl = new sap.m.TimePicker(params);

                    //        var oLocale = sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale();
                    //        var oLocaleData = sap.ui.core.LocaleData.getInstance(oLocale);
                    //        oControl.setDisplayFormat( oLocaleData.getTimePattern("short"));

                    break;
                default:
                    oConditionGrid.oFormatter = null;

                    //*****Rel 60E_SP5
                    if (selField && (selField['ELTYP'] === global.vui5.cons.element.valueHelp ||
                            selField['ELTYP'] === global.vui5.cons.element.dropDown) &&
                        (conditionKey == "EQ" || conditionKey == "BT")) {
                        if (selField['ELTYP'] === global.vui5.cons.element.valueHelp) {
                            oControl = new sap.m.Input({
                                value: oFieldInfo["Value"],
                                width: "100%",
                                placeholder: oFieldInfo["Label"],
                                showValueHelp: true,
                                change: function (oEvent) {
                                    if (that._validateFormatFieldValue)
                                        that._validateFormatFieldValue(oEvent);
                                    that._changeField(oConditionGrid);
                                },
                                layoutData: new sap.ui.layout.GridData({
                                    span: oFieldInfo["Span" + this._sConditionType]
                                }),
                                valueHelpRequest: function (oEvent) {
                                    control.fireOnValueHelpRequest({
                                        oEvent: oEvent,
                                        fieldInfo: selField,
                                    });
                                }
                            });
                            oControl.data("model", modelName);
                            control.bindTypeAheadField(oControl, fieldPath + selFieldIndex, selField);
                        }
                        else if (selField['ELTYP'] === global.vui5.cons.element.dropDown) {
                            oControl = new global.vui5.ui.controls.ComboBox({
                                width: "100%",
                                placeholder: oFieldInfo["Label"],
                                selectedKey: oFieldInfo["Value"],
                                change: function (oEvent) {
                                    if (that._validateFormatFieldValue)
                                        that._validateFormatFieldValue(oEvent);
                                    that._changeField(oConditionGrid);
                                },
                                layoutData: new sap.ui.layout.GridData({
                                    span: oFieldInfo["Span" + this._sConditionType]
                                })
                            }).data("instance", "global.vui5.ui.controls.ComboBox");

                            oControl.bindAggregation("items", global.vui5.modelName + '>' + "/DROPDOWNS/" + dataArea + "/" + selField['FLDNAME'], function (sId, oContext) {
                                var contextObject = oContext.getObject(), key;
                                if (selField['SDSCR'] == vui5.cons.fieldValue.description || selField['SDSCR'] == vui5.cons.fieldValue.value_cont_descr) {
                                    key = contextObject['VALUE'];
                                }
                                else {
                                    key = contextObject['NAME'];
                                }
                                return new sap.ui.core.Item({
                                    key: key,
                                    text: contextObject['VALUE']
                                });
                            });
                        }
                    }
                    else {
                        //*****
                        oControl = new sap.m.Input(params);
                        //*****Rel 60E_SP5
                    }
                    //*****

                    if (this._fSuggestCallback) {
                        var oCurrentKeyField = this._getCurrentKeyFieldItem(oConditionGrid.keyField);
                        if (oCurrentKeyField && oCurrentKeyField.key) {
                            var oSuggestProvider = this._fSuggestCallback(oControl, oCurrentKeyField.key);
                            if (oSuggestProvider) {
                                oControl._oSuggestProvider = oSuggestProvider;
                            }
                        }
                    }

            }

            if (sCtrlType !== "boolean" && sCtrlType !== "enum") {
                oControl.onpaste = function (oEvent) {

                    var sOriginalText;
                    // for the purpose to copy from column in excel and paste in MultiInput/MultiComboBox
                    if (window.clipboardData) {
                        //IE
                        sOriginalText = window.clipboardData.getData("Text");
                    } else {
                        // Chrome, Firefox, Safari
                        sOriginalText = oEvent.originalEvent.clipboardData.getData('text/plain');
                    }

                    var oConditionGrid = oEvent.srcControl.getParent();
                    var aSeparatedText = sOriginalText.split(/\r\n|\r|\n/g);

                    if (aSeparatedText) {
                        setTimeout(function () {
                            var iLength = aSeparatedText ? aSeparatedText.length : 0;
                            if (iLength > 1) {

                                var oKeyField = that._getCurrentKeyFieldItem(oConditionGrid.keyField);
                                var oOperation = oConditionGrid.operation;

                                for (var i = 0; i < iLength; i++) {
                                    if (that._aConditionKeys.length >= that._getMaxConditionsAsNumber()) {
                                        break;
                                    }

                                    if (aSeparatedText[i]) {
                                        var oCondition = {
                                            "key": that._createConditionKey(),
                                            "exclude": that.getExclude(),
                                            "operation": oOperation.getSelectedKey(),
                                            "keyField": oKeyField.key,
                                            "value1": aSeparatedText[i],
                                            "value2": null
                                        };
                                        that._addCondition2Map(oCondition);

                                        that.fireDataChange({
                                            key: oCondition.key,
                                            index: oCondition.index,
                                            operation: "add",
                                            newData: oCondition
                                        });
                                    }
                                }

                                that._clearConditions();
                                that._fillConditions();
                            }
                        }, 0);
                    }
                }
                ;
            }

            if (oCurrentKeyField && oCurrentKeyField.maxLength && oControl.setMaxLength) {
                var l = -1;
                if (typeof oCurrentKeyField.maxLength === "string") {
                    l = parseInt(oCurrentKeyField.maxLength, 10);
                }
                if (typeof oCurrentKeyField.maxLength === "number") {
                    l = oCurrentKeyField.maxLength;
                }
                if (l > 0 && (!oControl.getShowSuggestion || !oControl.getShowSuggestion())) {
                    oControl.setMaxLength(l);
                }
            }

            return oControl;
        };

        //*****

        T.prototype.handlePersonalizationOk = function (event) {
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
                    "AGRGTITEMS": oControl.allKeysToUpperCase(oControl._aggrPanel ? oControl._aggrPanel.getItems():[])
                }
            };

            oControl.fireLayoutManage({
                callBack: function () {
                    oControl._applyPersonalization(oControl._columnItems);
                    oControl._PersonalizationDialog.close();
                }
            });

        };

        T.prototype.addSortItem = function (oEvent) {
            this._sortPanel.addSortItem(oEvent.getParameter("sortItemData"));
            this._oVariants.currentVariantSetModified(true);
            //*****Rel 60E_SP7
            this._updateShowResetEnabled(true);
            //*****
        };

        T.prototype.removeSortItem = function (oEvent) {
            var index = oEvent.getParameter("index");
            var item = this._sortPanel.getSortItems()[index];
//            var columnObj;
//            if(this.getColumns.length>0){
//            	underscoreJS.each(this.getColumns(), function (column) {
//                    if (column.data('contextObject')['FLDNAME'] === item.getColumnKey() ) {
//                        columnObj = column;
//                    }
//                })
//                if(columnObj.getMergeDuplicates()){
//                	columnObj.setMergeDuplicates(false);
//                }
//            }
            this._sortPanel.removeSortItem(item);
            this._oVariants.currentVariantSetModified(true);
            //*****Rel 60E_SP7
            this._updateShowResetEnabled(true);
            //*****
        };

        T.prototype.updateSortItem = function (oEvent) {
            this._oVariants.currentVariantSetModified(true);
            //*****Rel 60E_SP7
            this._updateShowResetEnabled(true);
            //*****
        };

        T.prototype.addFilterItem = function (oEvent) {
            this._filterPanel.addFilterItem(oEvent.getParameter("filterItemData"));
            this._oVariants.currentVariantSetModified(true);
            //*****Rel 60E_SP7
            this._updateShowResetEnabled(true);
            //*****
        };

        T.prototype.removeFilterItem = function (oEvent) {
            var index = oEvent.getParameter("index");
            var item = this._filterPanel.getFilterItems()[index];
            this._filterPanel.removeFilterItem(item);
            this._oVariants.currentVariantSetModified(true);
            //*****Rel 60E_SP7
            this._updateShowResetEnabled(true);
            //*****
        };

        T.prototype.updateFilterItem = function () {
            this._oVariants.currentVariantSetModified(true);
            //*****Rel 60E_SP7
            this._updateShowResetEnabled(true);
            //*****
        };

        T.prototype.addGroupItem = function (oEvent) {
            this._groupPanel.addGroupItem(oEvent.getParameter("groupItemData"));
            this._oVariants.currentVariantSetModified(true);
            //*****Rel 60E_SP7
            this._updateShowResetEnabled(true);
            //*****
        };

        T.prototype.removeGroupItem = function (oEvent) {
            var index = oEvent.getParameter("index");
            var item = this._groupPanel.getGroupItems()[index];
            this._groupPanel.removeGroupItem(item);
            this._oVariants.currentVariantSetModified(true);
            //*****Rel 60E_SP7
            this._updateShowResetEnabled(true);
            //*****
        };

        T.prototype.updateGroupItem = function () {
            this._oVariants.currentVariantSetModified(true);
            //*****Rel 60E_SP7
            this._updateShowResetEnabled(true);
            //*****
        };

        T.prototype._initializeVariants = function () {
            var oControl = this,
                object,
                global,
                oController;
            var modelName = this.getModelName();
            oController = oControl.getProperty("controller");
            var variantDataPath = this.getVariantDataPath();
            this._oVariants = new sap.ui.comp.variants.VariantManagement({
                enabled: true,
                /***Rel 60E SP6 ECDM #4728 - Start ***/
                //showShare: true,
                showShare: !oControl.getHideShare(),
                /***Rel 60E SP6 ECDM #4728 - End ***/
                save: oControl._onVariantSave.bind(oControl),
                manage: oControl._onVariantManage.bind(oControl),
                select: oControl._onVariantSelect.bind(oControl),
                visible: oControl.getProperty("handle") !== ""
            });

            this._oVariants.bVariantItemMode = true;
            this._oVariants._setStandardText();

            /* Over Riding Tooltip */

            this._oVariants.oVariantPopoverTrigger.setTooltip(oControl._oBundle.getText('SelectVariant'));
            /**/

            this._oVariants.bindAggregation("variantItems", modelName + ">" + variantDataPath, function (sid, oContext) {

                object = oContext.getObject();

                if (object['DEFLT'] == "X") {
                    oControl._oVariants.setDefaultVariantKey(object['VARID']);
                }

                /*if (object['SELVAR'] === "X") {
            oControl._onVariantSelect1(true, object['VARID']);
        }*/

                var item = new VariantItem({
                    text: object['DESCR'],
                    key: object['VARID'],
                    global: object['UNAME'] === "",
                    author: object['AENAM_TXT']
                });

                /***Rel 60E SP6 ECDM #4754 - Start ***/
                if (object['UNAME'] === "" && oControl.getHideShare()) {
                    item.setReadOnly(true);
                }
                /***Rel 60E SP6 ECDM #4754 - End ***/

                oControl._oVariants.setInitialSelectionKey('');
                return item;
            });

            this._oVariants.addEventDelegate({
                onAfterRendering: function (e) {
                    var oControl = this;
                    var model = oControl.getModel(oControl.getModelName());
                    var selectedVariant = model.getProperty(oControl.getSelectedVariant());
                    if (selectedVariant && ((e.srcControl.getInitialSelectionKey() === "") || (e.srcControl.getInitialSelectionKey() !== selectedVariant))) {
                        e.srcControl.setInitialSelectionKey(selectedVariant);
                        oControl._onVariantSelect1(true);
                    }
                        //*****Rel 60E_SP6                    
                    else {
                        oControl.applyElementFeature();

                    }
                    //*****

                    if (oControl.getHideVariantSave()) {
                        oControl._oVariants.setVisible(false);
                    }
                }
            }, this);
        };


        T.prototype._onVariantSave = function (oEvent) {
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

            saveData.push(header);
            header['HANDLE'] = oControl.getHandle();
            oControl._variantData = {
                "VARIANTS": saveData,
                "LAYOUT": {
                    "COLITEMS": this.allKeysToUpperCase(this._columnItems),
                    "SORTITEMS": this.allKeysToUpperCase(this._sortItems),
                    "FILTERITEMS": this.allKeysToUpperCase(this._filterItems),
                    "GRPITEMS": this.allKeysToUpperCase(this._groupItems),
                    "AGRGTITEMS": oControl.allKeysToUpperCase(oControl._aggrPanel ? oControl._aggrPanel.getItems():[])

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
                },
                urlParams: params
            });


        };

        T.prototype.getVariantData = function () {
            var data = {};
            if (!underscoreJS.isEmpty(this._variantData)) {
                data = this._variantData;
                this._variantData = {};
            }
            return data;
        };

        T.prototype._onVariantManage = function (oEvent) {

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

        T.prototype._onVariantSelect = function (oEvent) {
            var oControl = this, variantData, selectedVariant;
            var variant = oEvent.getParameter("key");
            var columns = this.getColumns();
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
                callBack: function () {
                    if (selectedVariant['ROWID'] === 0) {
                        oControl.handleReset();
                        oControl.fillPersonalizationItems();
                        oControl._applyPersonalization(oControl._columnItems);
                        /****** Rel 60E_SP7 TASK #52848  */
                        /*** on standard variant select the data which is merged is not getting removed.so removing merge duplicates**/
                        underscoreJS.each(columns, function (column) {
                            if (column.getMergeDuplicates() && oControl.getMergeDuplicates()) {
                                column.setMergeDuplicates(false);
                            }
                        })
                        /***/
                    }
                    else {
                        oControl._onVariantSelect1(true);
                    }
                },
                record: selectedVariant
            });


            /*if (variant === global.vui5.cons.variant.standard) {
              oControl.handleReset();
              oControl.fillPersonalizationItems();
              oControl._applyPersonalization(oControl._columnItems);
          } else {
              oControl.fireVariantSelect({
                  callBack: function () {
                      oControl._onVariantSelect1(true);
                  },
                  record: selectedVariant
              });
          }*/


        };

        T.prototype._onVariantSelect1 = function (applyPersonalization) {
            if (!this._PersonalizationDialog) {
                this.createPersonalizationDialog();
            }
            this.addGroupPanelItem(this._PersonalizationDialog);

            var variant = this._oVariants.getSelectionKey();
            return this.fetchVariantData(variant, applyPersonalization);
        };


        T.prototype.fetchVariantData = function (variant, applyPersonalization) {

            var oControl = this,
                oController;
            oController = oControl.getProperty("controller");
            var columns = this.getColumns();
            var layoutData = oController.getCurrentModel().getProperty(oControl.getLayoutDataPath());

            if (variant === global.vui5.cons.variant.standard) {

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
            oControl.updatePersonalizationItems(applyPersonalization);

        };

        T.prototype.updatePersonalizationItems = function (applyPersonalization) {

            var oControl = this;
            var fields = oControl.getModel(oControl.getModelName()).getProperty(oControl.getFieldPath());
            this._columnPanel.removeAllColumnsItems();
            this._sortPanel.removeAllSortItems();
            this._filterPanel.removeAllFilterItems();
            if(this._groupPanel)
            this._groupPanel.removeAllGroupItems();
            var visible;
            // Column List Items
            underscoreJS.each(oControl._columnItems, function (object) {
                var visible
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
                //                /****** Rel 60E_SP7 TASK #52819  */  
                //                var field = underscoreJS.find(fields, {
                //                    FLDNAME: object['COLUMNKEY']
                //                });                 
                //                var grpField = field['FLGRP'] ? true : false;
                //                var columnObj;
                //                underscoreJS.each(oControl.getColumns(),function(column){
                //                	if(column.data('contextObject')['FLDNAME'] === field['FLDNAME']){
                //                		columnObj = column;
                //                	}	
                //                })
                //                if(!grpField && columnObj){
                //                	columnObj.setMergeDuplicates(true);
                //                }
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
            if(this._groupPanel){
            // Group Items
	            underscoreJS.each(oControl._groupItems, function (object) {
	                oControl._groupPanel.addGroupItem(new sap.m.P13nGroupItem({
	                    columnKey: object['COLUMNKEY'],
	                    operation: object['OPERATION']
	                }));
	            });
            }

            if (applyPersonalization) {
                oControl.fillPersonalizationItems();
                oControl._applyPersonalization(oControl._columnItems);
            }
        };


        T.prototype._applyPersonalization = function (tableItems) {

            var oControl = this;
            var oBinding = this.getBinding("items");

            if (this.getPagingType() == global.vui5.cons.pagingType.serverPaging) {

                this._getSortItems(this._groupItems, this._sortItems);
                this._getFilterItems(this._filterItems);


            } else {

                if (oControl.getBackendSortFilter() == false) {
                    /* Filter and Sorting Performed in Backend */
                    var fields = oControl.getModel(oControl.getModelName()).getProperty(oControl.getFieldPath());
                    var aSorters = [];
                    if (this._groupItems.length > 0) {
                        underscoreJS.each(this._groupItems, function (object) {
                            var bDescending = true;
                            if (object['OPERATION'] == "GroupAscending")
                                bDescending = false;
                            // var vGroup = true;

                            var sPath;

                            var field = underscoreJS.find(fields, {
                                FLDNAME: object['COLUMNKEY']
                            });
                            if (field) {
                                if (field.ELTYP == global.vui5.cons.element.dropDown) {
                                    var dropdowns = oControl.getModel(global.vui5.modelName).getProperty("/DROPDOWNS/" + field.FLDNAME);

                                    sPath = object['COLUMNKEY'];

                                    aSorters.push(new Sorter(sPath, bDescending, function (oContext) {
                                        var fieldName = this._groupItems[0]['COLUMNKEY'];
                                        var contextObject = oContext.getObject();

                                        var text = '';
                                        if (dropdowns) {
                                            var dropdownObject = underscoreJS.find(dropdowns, {
                                                VALUE: contextObject[fieldName]
                                            });
                                            if (dropdownObject)
                                                text = dropdownObject.TEXT;
                                        }

                                        if (text == '')
                                            text = contextObject[fieldName];


                                        var returnobject = {
                                            key: contextObject[fieldName],
                                            text: text
                                        };
                                        return returnobject;
                                    }));
                                } else {

                                    if (field['SDSCR'] != global.vui5.cons.fieldValue.value && field['SDSCR'] != global.vui5.cons.fieldValue.value_descr && field['TXTFL']) {
                                        sPath = field['TXTFL'];
                                    } else if (field['DATATYPE'] == global.vui5.cons.dataType.amount || field['DATATYPE'] == global.vui5.cons.dataType.quantity
                                        || field['DATATYPE'] == global.vui5.cons.dataType.decimal || field['DATATYPE'].substr(0, 3) == global.vui5.cons.dataType.integer) {
                                        sPath = field['TXTFL'];
                                    } else {
                                        sPath = field['FLDNAME'];
                                    }

                                    aSorters.push(new Sorter(sPath, bDescending, true));
                                }
                            }
                        });
                    }

                    underscoreJS.each(this._sortItems, function (obj) {
                        var sPath;
                        var bDescending = false;
                        if (obj['OPERATION'] == "Descending")
                            bDescending = true;

                        var field = underscoreJS.find(fields, {
                            FLDNAME: obj['COLUMNKEY']
                        });
                        /****** Rel 60E_SP7 TASK #52848  */
                        var grpField = field['FLGRP'] ? true : false;
                        var columnObj;
                        if(!oControl.isGroupingPresent()){
	                        underscoreJS.each(oControl.getColumns(), function (column) {
	                            if (column.data('contextObject')['FLDNAME'] === field['FLDNAME']) {
	                                columnObj = column;
	                            }
	                        })
                        //if (!grpField && columnObj) {
	                      if(columnObj){
	                            if (!columnObj.getMergeDuplicates() && oControl.getMergeDuplicates())
	                                columnObj.setMergeDuplicates(true);
	
	                       }
                       }

                        /***/
                        if (field) {


                            if (field['SDSCR'] != vui5.cons.fieldValue.value && field['SDSCR'] != vui5.cons.fieldValue.value_descr) {
                                sPath = field['TXTFL'];
                            } else {
                                sPath = object['COLUMNKEY'];
                            }

                        }
                        aSorters.push(new Sorter(sPath, bDescending));
                    });
                    oBinding.sort(aSorters);
                    this._applyFilter();
                    if (this._filterItems.length > 0) {
                        // oBinding.filter();
                        /*
             * referring i18n from global utilities instead of
             * application i18n - START
             */
                        // var bundle =
                        // oControl.getModel("i18n").getResourceBundle();
                        //var bundle = oControl.getModel("i18n").getResourceBundle();
                        /*
             * referring i18n from global utilities instead of
             * application i18n - END
             */

                        var infoText = '';
                        // var filter = [];
                        underscoreJS.each(this._filterItems, function (object) {
                            var operation;
                            if (object['EXCLUDE'] == true || object['EXCLUDE'] == "true" || object['EXCLUDE'] == "X")
                                operation = 'NE';
                            else
                                operation = object['OPERATION'];

                            var arr = [object['VALUE1'], object['VALUE2']];
                            var field = underscoreJS.find(fields, {
                                FLDNAME: object['COLUMNKEY']
                            });
                            var str = field['LABEL'] + " (" + oControl._oBundle.getText("FilterOperations" + operation, arr) + ")";

                            if (infoText == '')
                                infoText = str;
                            else
                                infoText = infoText + ', ' + str;
                        });
                        var string = bundle.getText("Filtered_By", [infoText]);
                        var infobar = oControl.getInfoToolbar();
                        infobar.setVisible(true);
                        infobar.getAggregation("content")[0].setText(string);
                    } else {
                        oControl.getInfoToolbar().setVisible(false);
                    }
                } else {
                    /*
           * Sort and Filter in Backend Changes for Normal Data
           */
                    this._getSortItems(this._groupItems, this._sortItems);
                    this._getFilterItems(this._filterItems);

                    /*oControl.fireOnSortFilter({
                        sort: this._getSortItems(this._groupItems, this._sortItems),
                        filter: this._getFilterItems(this._filterItems)
                    });*/
                }
            }
            var columns = this.getColumns();

            var positionChanged = false, determineColumnVisible;
            var model = oControl.getModel(oControl.getModelName());
            var fields_path = oControl.getFieldPath();
            var field_groups_path = oControl.getFieldGroupPath();
            var field_groups = model.getProperty(field_groups_path);
            var fields = model.getProperty(fields_path);
            if (oControl.isGroupingPresent()) {
                underscoreJS.each(columns, function (column) {
                    var groupObject = column.getBindingContext(oControl.getModelName()).getObject();
                    var group_fields;
                    group_fields = groupObject['FLDNAME'] ? underscoreJS.where(fields, { FLDNAME: groupObject['FLDNAME'] }) :
            										  underscoreJS.where(fields, { FLGRP: groupObject['FLGRP'] });

                    determineColumnVisible = 0;

                    underscoreJS.each(group_fields, function (field) {
                        var actualFieldIndex = underscoreJS.findIndex(fields, field);
                        var item = underscoreJS.find(tableItems, {
                            'COLUMNKEY': field['FLDNAME']
                        });
                        if (item) {

                            var visible = 'X';
                            if (item['VISIBLE'] == true || item['VISIBLE'] == "true" || item['VISIBLE'] == 'X') {
                                visible = '';
                                determineColumnVisible++;
                            }
                            model.setProperty(fields_path + actualFieldIndex + "/NO_OUT", visible);
                            var fieldPosition = model.getProperty(fields_path + actualFieldIndex + "/POSTN");
                            if (item['INDEX'] != fieldPosition) {
                                model.setProperty(fields_path + actualFieldIndex + "/POSTN", item['INDEX']);
                                positionChanged = true;
                            }
                        }
                    });
                    var visible_fields;
                    visible_fields = groupObject['FLDNAME'] ? underscoreJS.where(fields, { FLDNAME: groupObject['FLDNAME'], NO_OUT: '', ADFLD: '' }) :
            												  underscoreJS.where(fields, { FLGRP: groupObject['FLGRP'], NO_OUT: '', ADFLD: '' });
                    if (visible_fields.length > 0 && determineColumnVisible > 0) {
                        groupObject['HDGRP'] = '';
                        column.setVisible(true);
                    } else {
                        groupObject['HDGRP'] = 'X';
                        column.setVisible(false);
                    }
                });
                //Changing group position based on fields
                if (positionChanged) {
                    fields = underscoreJS.sortBy(fields, 'POSTN');
                    var returnIndex;
                    field_groups = underscoreJS.sortBy(field_groups, function (group) {
                        if (group['FLDNAME']) {
                            returnIndex = underscoreJS.findIndex(fields, { FLDNAME: group['FLDNAME'] });
                        }
                        else {
                            var grpFields = underscoreJS.where(fields, { FLGRP: group['FLGRP'], NO_OUT: '' });
                            if (!underscoreJS.isEmpty(grpFields)) {
                                returnIndex = underscoreJS.findIndex(fields, { 'FLDNAME': grpFields[0]['FLDNAME'] });
                            }
                            else {
                                returnIndex = -1;
                            }
                        }
                        return returnIndex;
                        /*return group['FLDNAME'] ? underscoreJS.findIndex(fields, { FLDNAME: group['FLDNAME'], NO_OUT: '' }) :
							underscoreJS.findIndex(fields, { FLGRP: group['FLGRP'], NO_OUT: '' });*/
                    });

                    model.setProperty(fields_path, []);
                    model.setProperty(field_groups_path, []);
                    model.setProperty(field_groups_path, field_groups);
                    model.setProperty(fields_path, fields);

                    var tableData = model.getProperty(oControl.getDataPath());
                    model.setProperty(oControl.getDataPath(), []);
                    model.setProperty(oControl.getDataPath(), tableData);

                }

            } else {
                underscoreJS.each(columns, function (column) {

                    var object = column.getBindingContext(oControl.getModelName()).getObject();
                    var item = underscoreJS.find(tableItems, {
                        'COLUMNKEY': object['FLDNAME']
                    });

                    if (item === undefined && oControl._oVariants.getSelectionKey() !== "*standard*") {
                        column.setVisible(false);
                    }

                    if (item) {

                        var visible = false;
                        if (item['VISIBLE'] == true || item['VISIBLE'] == "true" || item['VISIBLE'] == 'X')
                            visible = true;

                        if (visible != column.getVisible()) {
                            column.setVisible(visible);
                        }

                        if (item['INDEX'] != column.getOrder()) {
                            column.setOrder(item['INDEX']);
                            positionChanged = true;
                        }
                    }
                });
            }

            oControl.vuiPrepareFooter();
            if (positionChanged)
                this.invalidate();
        };

        T.prototype._getSortItems = function (groupItems, sortItems) {
            var oControl = this;
            var oBinding = this.getBinding("items");
            var sortObjects = [];

            var fields = this.getModel(this.getModelName()).getProperty(this.getFieldPath());

            var aSorters = [];
            if (groupItems && groupItems.length > 0) {
                underscoreJS.each(groupItems, function (object, index) {

                    var up,
                        down;
                    if (object['OPERATION'] == "GroupAscending") {
                        down = '';
                        up = 'X';
                    } else {
                        down = 'X';
                        up = '';
                    }

                    var sPath;
                    var bDescending = true;
                    if (object['OPERATION'] == "GroupAscending")
                        bDescending = false;
                    // var vGroup = true;

                    var field = underscoreJS.find(fields, {
                        FLDNAME: object['COLUMNKEY']
                    });

                    if (field) {
                        var dropdowns = oControl.getModel(global.vui5.modelName).getProperty("/DROPDOWNS/" +
                            oControl.getModel(oControl.getModelName()).getProperty(oControl.getDataAreaPath()) + "/" + field['FLDNAME']);

                        if (field['ELTYP'] === global.vui5.cons.element.dropDown) {
                            sPath = object['COLUMNKEY']
                        }
                        else {
                            if (field['SDSCR'] != global.vui5.cons.fieldValue.value && field['SDSCR'] != global.vui5.cons.fieldValue.value_descr && field['TXTFL']) {
                                sPath = field['TXTFL'];
                            } else if (field['DATATYPE'] == global.vui5.cons.dataType.amount || field['DATATYPE'] == global.vui5.cons.dataType.quantity
                                || field['DATATYPE'] == global.vui5.cons.dataType.decimal || field['DATATYPE'].substr(0, 3) == global.vui5.cons.dataType.integer) {
                                sPath = field['TXTFL'];
                            } else {
                                sPath = field['FLDNAME'];
                            }
                        }

                        aSorters.push(new Sorter(sPath, bDescending, function (oContext) {

                            var fieldName = oControl._groupItems[0]['COLUMNKEY'];
                            var contextObject = oContext.getObject();

                            var text = '';
                            if (dropdowns) {
                                var dropdownObject = underscoreJS.find(dropdowns, {
                                    NAME: contextObject[fieldName]
                                });
                                if (dropdownObject)
                                    text = dropdownObject.VALUE;
                            }

                            if (field['TXTFL']) {
                                text = contextObject[field['TXTFL']];
                            }

                            if (text == '')
                                text = contextObject[fieldName];

                            /*if (field['DATATYPE'] == global.vui5.cons.dataType.date) {
                                text = Formatter.dateFormat(contextObject[fieldName], oControl);
                            }*/
                            var returnobject = {
                                key: contextObject[fieldName],
                                text: text
                            };
                            return returnobject;

                        }));

                    }




                    oControl.getBindingInfo("items").groupHeaderFactory = function (data) {

                        var totalValue = oControl.getModel(oControl.getModelName()).getProperty(oControl.getTotalDataPath());

                        var layoutData = oControl.getModel(oControl.getModelName()).getProperty(oControl.getLayoutDataPath());

                        var object = {}, title, subAggregateTitle;

                        var subAggregateColumns = [];

                        underscoreJS.each(layoutData['AGRGTITEMS'], function (item) {
                            var columnItem = underscoreJS.findWhere(oControl.getModel(oControl.getModelName()).getProperty(oControl.getFieldPath()), {
                                'FLDNAME': item['COLUMNKEY']
                            });

                            if (columnItem) {
                                if (item['AGGAT'] || item['SBAGT']) {
                                    subAggregateColumns.push(columnItem);
                                }
                            }


                        });

                        object[groupItems[0]['COLUMNKEY']] = data['key'];

                        if (totalValue) {


                            var subAggregateData = underscoreJS.findWhere(totalValue['GRP_TOTAL'], object);

                            if (subAggregateData) {
                                underscoreJS.each(subAggregateColumns, function (subAggField) {
                                    if (subAggregateTitle === undefined) {

                                        if (subAggregateData[subAggField['FLDNAME']]) {
                                            subAggregateTitle = subAggField['LABEL'] + ": " + subAggregateData[subAggField['FLDNAME']];
                                        }
                                        else if (subAggregateData['MAXIMUM'] && subAggregateData['MAXIMUM'][subAggField['FLDNAME']]) {
                                            subAggregateTitle = oControl._oBundle.getText("Max") + ". " + subAggField['LABEL'] + ": " + subAggregateData['MAXIMUM'][subAggField['FLDNAME']];
                                        }
                                        else if (subAggregateData['MINIMUM'] && subAggregateData['MINIMUM'][subAggField['FLDNAME']]) {
                                            subAggregateTitle = oControl._oBundle.getText("Min") + ". " + subAggField['LABEL'] + ": " + subAggregateData['MINIMUM'][subAggField['FLDNAME']];
                                        }
                                        else if (subAggregateData['AVERAGE'] && subAggregateData['AVERAGE'][subAggField['FLDNAME']]) {
                                            subAggregateTitle = oControl._oBundle.getText("Avg") + ". " + subAggField['LABEL'] + ": " + subAggregateData['AVERAGE'][subAggField['FLDNAME']];
                                        }
                                    }
                                    else {

                                        if (subAggregateData[subAggField['FLDNAME']]) {
                                            subAggregateTitle = subAggregateTitle + ", " + subAggField['LABEL'] + ": " + subAggregateData[subAggField['FLDNAME']];
                                        }
                                        else if (subAggregateData['MAXIMUM'] && subAggregateData['MAXIMUM'][subAggField['FLDNAME']]) {
                                            subAggregateTitle = subAggregateTitle + ", " + oControl._oBundle.getText("Max") + ". " + subAggField['LABEL'] + ": " + subAggregateData['MAXIMUM'][subAggField['FLDNAME']];
                                        }
                                        else if (subAggregateData['MINIMUM'] && subAggregateData['MINIMUM'][subAggField['FLDNAME']]) {
                                            subAggregateTitle = subAggregateTitle + ", " + oControl._oBundle.getText("Min") + ". " + subAggField['LABEL'] + ": " + subAggregateData['MINIMUM'][subAggField['FLDNAME']];
                                        }
                                        else if (subAggregateData['AVERAGE'] && subAggregateData['AVERAGE'][subAggField['FLDNAME']]) {
                                            subAggregateTitle = subAggregateTitle + ", " + oControl._oBundle.getText("Avg") + ". " + subAggField['LABEL'] + ": " + subAggregateData['AVERAGE'][subAggField['FLDNAME']];
                                        }
                                    }
                                });

                            }
                        }

                        if (subAggregateTitle) {
                            return new sap.m.GroupHeaderListItem({
                                title: data['text'] + " (" + subAggregateTitle + ")",
                                upperCase: false
                            });
                        }
                        else {
                            return new sap.m.GroupHeaderListItem({
                                title: data['text'],
                                upperCase: false
                            });
                        }

                    }
                    sortObjects.push({
                        'SPOS': index + 1,
                        'FIELDNAME': sPath,
                        'UP': up,
                        'DOWN': down,
                        'GROUP': 'X'
                    });
                });
            }


            oBinding.sort();
            oBinding.sort(aSorters);

            var groupIndex = sortObjects.length;

            underscoreJS.each(sortItems, function (object, index) {
                var up,
                    down;
                if (object['OPERATION'] == "Descending") {
                    down = 'X';
                    up = '';
                } else {
                    down = '';
                    up = 'X';
                }

                var sPath;
                var field = underscoreJS.find(fields, {
                    FLDNAME: object['COLUMNKEY']
                });
                /*****Rel 60E_sp7 Task #52848*/
                
                if (field) {
                	if(!oControl.isGroupingPresent()){
                        var columnObj;
                      	underscoreJS.each(oControl.getColumns(), function (column) {
                              if (column.data('contextObject')['FLDNAME'] === field['FLDNAME']) {
                                  columnObj = column;
                              }
                          })
                         //if (!grpField && columnObj) {
                          if(columnObj){
                              if (!columnObj.getMergeDuplicates() && oControl.getMergeDuplicates())
                                  columnObj.setMergeDuplicates(true);

                          }
                	}

                }
                /****/
                if (field) {

                    if (field['SDSCR'] != vui5.cons.fieldValue.value && field['SDSCR'] != vui5.cons.fieldValue.value_descr) {
                        sPath = field['TXTFL'];
                    } else {
                        sPath = object['COLUMNKEY'];
                    }

                }
                sortObjects.push({
                    'SPOS': index + 1 + groupIndex,
                    'FIELDNAME': sPath,
                    'UP': up,
                    'DOWN': down
                });
            });
            return sortObjects;
        };

        T.prototype._getFilterItems = function (filterItems) {
            var oControl = this;
            var filterObjects = [];

            if (filterItems && filterItems.length > 0) {
                //var bundle = oControl.getModel("i18n").getResourceBundle();

                var fields = oControl.getModel(this.getModelName()).getProperty(this.getFieldPath());

                var infoText = '';
                // var filter = [];
                underscoreJS.each(filterItems, function (object, index) {
                    var sign, operationString, arr;
                    if (object['EXCLUDE'] == true || object['EXCLUDE'] == "true" || object['EXCLUDE'] == "X") {
                        sign = 'E';
                        operationString = 'NE';
                    } else {
                        sign = 'I';
                        operationString = object['OPERATION'];
                    }
                    var operation, value1;
                    if (object['OPERATION'] == sap.ui.model.FilterOperator.Contains) {
                        value1 = '*' + object['VALUE1'] + '*';
                        operation = 'CP';
                    } else if (object['OPERATION'] == sap.ui.model.FilterOperator.EndsWith) {
                        value1 = '*' + object['VALUE1'];
                        operation = 'CP';
                    } else if (object['OPERATION'] == sap.ui.model.FilterOperator.StartsWith) {
                        value1 = object['VALUE1'] + '*';
                        operation = 'CP';
                    } else {
                        value1 = object['VALUE1'];
                        operation = object['OPERATION'];
                    }

                    //*****Rel 60E_SP5
                    var selObj = underscoreJS.findWhere(fields, { FLDNAME: object['COLUMNKEY'] });
                    if (selObj['DATATYPE'] === vui5.cons.dataType.date) {
                        arr = [oControl.dateFormat(object['VALUE1']), oControl.dateFormat(object['VALUE2'])];
                    }
                    else if (selObj['DATATYPE'] === vui5.cons.dataType.time) {
                        arr = [oControl.timeFormat(object['VALUE1']), oControl.timeFormat(object['VALUE2'])];
                    }
                    else {
                        //*****
                        arr = [object['VALUE1'], object['VALUE2']];
                        //*****Rel 60E_SP5
                    }
                    //*****

                    var field = underscoreJS.find(fields, {
                        FLDNAME: object['COLUMNKEY']
                    });
                    var str = field['LABEL'] + " (" + oControl._oBundle.getText("FilterOperations" + operationString, arr) + ")";

                    if (infoText == '')
                        infoText = str;
                    else
                        infoText = infoText + ', ' + str;

                    var sPath;
                    if (field) {

                        if (field['SDSCR'] != vui5.cons.fieldValue.value && field['SDSCR'] != vui5.cons.fieldValue.value_descr) {
                            sPath = field['TXTFL'];
                        } else {
                            sPath = object['COLUMNKEY'];
                        }

                    }

                    filterObjects.push({
                        'FIELDNAME': sPath,
                        'ORDER': index,
                        'SIGN': sign,
                        'LOW': value1,
                        'HIGH': object['VALUE2'],
                        'OPTION': operation
                    });

                });

                var string = oControl._oBundle.getText("Filtered_By", [infoText]);
                var infobar = oControl.getInfoToolbar();
                infobar.setVisible(true);
                infobar.getAggregation("content")[0].setText("");
                infobar.getAggregation("content")[0].setText(string);
            } else {
                oControl.getInfoToolbar().setVisible(false);
            }
            return filterObjects;
        };

        T.prototype.allKeysToUpperCase = function (obj) {
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

        /* Search and Replace Changes */
        /* Create Search andd Replace Dialog */
        T.prototype.searchAndReplaceDialog = function () {
            var oControl = this;
            var model;
            if (!oControl._oSearchAndReplaceDialog) {
                oControl._searchAndReplaceModelName = "SEARCHREPLACE";

                oControl._oSearchAndReplaceDialog = new sap.m.Dialog({
                    title: oControl._oBundle.getText("FindAndReplace"),
                    showHeader: true,
                    draggable: true,
                    buttons: [new sap.m.Button({
                        text: oControl._oBundle.getText("Find"),
                        visible: "{" + oControl._searchAndReplaceModelName + ">/VISIBLE}",
                        press: [oControl.findValue, oControl]
                    }), new sap.m.Button({
                        text: oControl._oBundle.getText("Replace"),
                        visible: "{" + oControl._searchAndReplaceModelName + ">/VISIBLE}",
                        press: [oControl.replaceValue, oControl]
                    }), new sap.m.Button({
                        text: oControl._oBundle.getText("ReplaceAll"),
                        visible: "{" + oControl._searchAndReplaceModelName + ">/VISIBLE}",
                        press: [oControl.replaceAll, oControl]
                    }), new sap.m.Button({
                        text: oControl._oBundle.getText("Cancel"),
                        press: function () {
                            if (oControl.searchAndReplace.control)
                                $(oControl.searchAndReplace.control.getDomRef()).parent().css('background-color', '');
                            //*****Rel 60E_SP6 - QA #9410
                            if (oControl.itemFound) {
                                oControl.itemFound = false;
                                oControl.fireOnUpdate();
                            }
                            //*****
                            oControl._oSearchAndReplaceDialog.close();
                        }
                    })]
                });

                oControl.addDependent(oControl._oSearchAndReplaceDialog);
                var _sContentDensityClass;
                if (!sap.ui.Device.support.touch) {
                    _sContentDensityClass = "sapUiSizeCompact";
                } else {
                    _sContentDensityClass = "sapUiSizeCozy";
                }
                jQuery.sap.syncStyleClass(_sContentDensityClass, oControl, oControl._oSearchAndReplaceDialog);

                model = new JSONModel();
                var data = {
                    'VISIBLE': false
                };
                model.setData(data);
                oControl._oSearchAndReplaceDialog.setModel(model, oControl._searchAndReplaceModelName);

                // oControl._selectField = new sap.m.ComboBox({
                // selectionChange :
                // [oControl._onSearchFieldChange,oControl]
                // });
                oControl._selectField = new global.vui5.ui.controls.ComboBox({
                    selectionChange: [oControl._onSearchFieldChange, oControl]
                });

                model = undefined;
                model = this.getModel(oControl.getModelName());
                var fields = model.getProperty(oControl.getFieldPath());
                underscoreJS.each(fields, function (field) {
                    if (field['NO_OUT'] == '') {
                        oControl._selectField.addItem(new sap.ui.core.Item({
                            key: field['FLDNAME'],
                            text: field['LABEL']
                        }));
                    }
                });
            }
            oControl._selectField.setSelectedKey("");
            model = undefined;
            model = oControl._oSearchAndReplaceDialog.getModel(oControl._searchAndReplaceModelName);
            model.setProperty("/VISIBLE", false);

            oControl._oSearchAndReplaceDialog.removeAllContent();

            var contentData = [];
            contentData.push(new sap.ui.core.Title({
                text: ""
            }));
            contentData.push(new sap.m.Label({
                text: oControl._oBundle.getText("Fields")
            }));

            contentData.push(oControl._selectField);

            var simpleForm = new sap.ui.layout.form.SimpleForm({
                layout: sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout,
                editable: true,
                content: contentData
            });

            oControl._oSearchAndReplaceDialog.addContent(simpleForm);

            oControl.searchAndReplace = {
                itemFindIndex: -1
            };
            oControl._oSearchAndReplaceDialog.open();

        };

        /*
     * On Field Change, re-create Serach For and Replace With Control
     */
        T.prototype._onSearchFieldChange = function () {
            var oControl = this;
            // var oController = oControl.getController();

            oControl.searchAndReplace.itemFindIndex = -1;

            var selectedField = oControl._selectField.getSelectedKey();

            var simpleForm = oControl._oSearchAndReplaceDialog.getContent()[0];
            var contentData = simpleForm.getContent();
            if (contentData.length > 3) {
                for (var i = 3; i < contentData.length; i++) {
                    simpleForm.removeContent(contentData[i]);
                    contentData[i].destroy();
                }
            }
            var searchReplaceModel;
            if (selectedField == "") {
                searchReplaceModel = oControl._oSearchAndReplaceDialog.getModel(oControl._searchAndReplaceModelName);
                searchReplaceModel.setProperty("/VISIBLE", false);
            } else {
                searchReplaceModel = oControl._oSearchAndReplaceDialog.getModel(oControl._searchAndReplaceModelName);
                searchReplaceModel.setProperty("/VISIBLE", true);

                var model = oControl.getModel(oControl.getModelName());
                var fields = model.getProperty(oControl.getFieldPath());

                var field = underscoreJS.find(fields, {
                    'FLDNAME': selectedField
                });
                if (field) {

                    var data = {};
                    data.FIELDS = [field];
                    data.DATA = {};
                    data.DATA[field['FLDNAME']] = "";
                    if (field['SDSCR'] != global.vui5.cons.fieldValue.value) {
                        data.DATA[field['TXTFL']] = "";
                    }
                    model.setProperty("/__SEARCH", data);
                    var data = {};
                    data.FIELDS = [field];
                    data.DATA = {};
                    data.DATA[field['FLDNAME']] = "";
                    if (field['SDSCR'] != global.vui5.cons.fieldValue.value) {
                        data.DATA[field['TXTFL']] = "";
                    }
                    model.setProperty("/__REPLACE", data);

                    simpleForm.addContent(new sap.m.Label({
                        text: oControl._oBundle.getText("SearchFor")
                    }));

                    oControl._oSearchFor = oControl._createSearchReplaceControl("/__SEARCH/FIELDS/0/", "/__SEARCH/DATA/", true);
                    simpleForm.addContent(oControl._oSearchFor);

                    simpleForm.addContent(new sap.m.Label({
                        text: oControl._oBundle.getText("ReplaceWith")
                    }));
                    oControl._oReplaceWith = oControl._createSearchReplaceControl("/__REPLACE/FIELDS/0/", "/__REPLACE/DATA/", false);
                    simpleForm.addContent(oControl._oReplaceWith);
                }
            }
        };

        /*
     * Used to create Search and Replace Control Based on Field Properties
     */
        T.prototype._createSearchReplaceControl = function (fieldPath, dataPath, forSearch) {
            var oControl = this;
            var oController = this.getController();

            var modelName = this.getModelName();
            var model = this.getModel(modelName);
            var field = model.getProperty(fieldPath);

            if (field['DATATYPE'] == global.vui5.cons.dataType.date || field['DATATYPE'] == global.vui5.cons.dataType.time) {
                field['ELTYP'] = global.vui5.cons.element.input;
            }

            var dataArea = model.getProperty(oControl.getDataAreaPath());
            var bindingMode = sap.ui.model.BindingMode.TwoWay;
            var selection;
            switch (field['ELTYP']) {
                case global.vui5.cons.element.input:
                    if (field['DATATYPE'] == global.vui5.cons.dataType.date) {
                        selection = new sap.m.DatePicker({
                            //displayFormat: "long",
                            //*****Rel 60E_SP6
                            //valueFormat: "YYYY-MM-dd",
                            valueFormat: vui5.cons.date_format,
                            //*****
                            placeholder: " ",
                            change: [oController.dateFieldCheck, oController]
                        }).bindValue(modelName + ">" + dataPath + field['FLDNAME'], null, bindingMode);
                        selection.bindProperty("displayFormat", global.vui5.modelName + ">" + global.vui5.cons.modelPath.sessionInfo + "/DATFM",
                            Formatter.displayFormat, sap.ui.model.Binding.OneWay);
                        selection.addStyleClass('vuiDatePicker');
                        selection.setVuiDateValue = selection.setValue;
                        selection.setValue = oControl.setDateValue.bind(selection);
                    } else if (field['DATATYPE'] == global.vui5.cons.dataType.time) {
                        selection = new sap.m.TimePicker({
                            valueFormat: "HH:mm:ss",
                            displayFormat: "HH:mm:ss"
                        }).bindValue(modelName + ">" + dataPath + field['FLDNAME'], null, bindingMode);
                        selection.addStyleClass('vuiTimePicker');
                    } else if (field['DATATYPE'] == global.vui5.cons.dataType.amount) {
                        selection = new sap.m.Input({
                            showValueHelp: false,
                            maxLength: parseInt(field['OUTPUTLEN'])
                        });
                        selection.setTextAlign(sap.ui.core.TextAlign.End);
                        selection.bindValue(modelName + ">" + dataPath + field['FLDNAME'], null, bindingMode);
                    } else if (field['DATATYPE'] == global.vui5.cons.dataType.quantity) {
                        selection = new sap.m.Input({
                            showValueHelp: false,
                            maxLength: parseInt(field['OUTPUTLEN'])
                        });
                        selection.setTextAlign(sap.ui.core.TextAlign.End);
                        selection.bindValue(modelName + ">" + dataPath + field['FLDNAME'], null, bindingMode);
                    } else if (field['DATATYPE'] == global.vui5.cons.dataType.decimal || field['DATATYPE'].substr(0, 3) == global.vui5.cons.dataType.integer) {
                        selection = new sap.m.Input({
                            showValueHelp: false,
                            maxLength: parseInt(field['OUTPUTLEN'])
                        });
                        selection.setTextAlign(sap.ui.core.TextAlign.End);
                        selection.bindValue(modelName + ">" + dataPath + field['FLDNAME'], null, bindingMode);
                    } else {
                        selection = new sap.m.Input({
                            showValueHelp: false
                        });
                        oControl.setFieldType(selection, field);
                        oControl._searchReplaceFieldCheck(selection, field);

                        if (field['SDSCR'] == global.vui5.cons.fieldValue.description || field['SDSCR'] == global.vui5.cons.fieldValue.value_cont_descr) {
                            selection.bindValue(modelName + ">" + dataPath + field['TXTFL'], null, bindingMode);
                            selection.data("model", modelName);
                            selection.data("path", fieldPath);
                            selection.attachChange(oController.getDescription.bind(oController));
                            selection.setMaxLength(60);
                        } else {
                            selection.bindValue(modelName + ">" + dataPath + field['FLDNAME'], null, bindingMode);
                        }
                    }
                    if (forSearch)
                        selection.attachChange(oControl._onSearchValueChange.bind(oControl));
                    break;
                case global.vui5.cons.element.valueHelp:
                    selection = new sap.m.Input({
                        showValueHelp: true,
                        fieldWidth: "100%"
                    });
                    oControl.setFieldType(selection, field);
                    oControl._searchReplaceFieldCheck(selection, field);
                    if (field['SDSCR'] == global.vui5.cons.fieldValue.description || field['SDSCR'] == global.vui5.cons.fieldValue.value_cont_descr) {
                        selection.bindValue(modelName + ">" + dataPath + field['TXTFL'], null, bindingMode);
                        selection.data("model", modelName);
                        selection.data("path", fieldPath);
                        selection.attachChange(oController.getDescription.bind(oController));
                        selection.setMaxLength(60);
                    } else {
                        selection.bindValue(modelName + ">" + dataPath + field['FLDNAME'], null, bindingMode);
                    }
                    selection.attachValueHelpRequest(oControl.onValueHelpRequest.bind(oControl));
                    /*var func = oControl.getOnF4HelpRequest();
                    if (func && typeof func == "function")
                        selection.attachValueHelpRequest(func.bind(oController));*/

                    selection.data("model", oControl.getModelName());
                    selection.data("path", fieldPath);
                    selection.data("dataArea", dataArea);
                    oControl.bindTypeAheadField(selection, fieldPath, field);
                    if (forSearch)
                        selection.attachChange(oControl._onSearchValueChange.bind(oControl));
                    break;

                case global.vui5.cons.element.dropDown:
                    // selection = new sap.m.ComboBox({
                    // });
                    selection = new global.vui5.ui.controls.ComboBox({});
                    selection.bindAggregation("items", global.vui5.modelName + '>' + "/DROPDOWNS/" + dataArea + "/" + field['FLDNAME'], function (sid, oContext) {
                        var contextObject = oContext.getObject();
                        return new sap.ui.core.Item({
                            key: contextObject['NAME'],
                            text: contextObject['VALUE']
                        });
                    });
                    selection.bindProperty("selectedKey", modelName + ">" + dataPath + field['FLDNAME'], null, bindingMode);
                    if (forSearch)
                        selection.attachSelectionChange(oControl._onSearchValueChange.bind(oControl));
                    break;

                case global.vui5.cons.element.checkBox:
                    selection = new sap.m.CheckBox({
                        select: [oController._onCheckBoxSelect, oController],
                        selected: "{= ${" + modelName + ">" + dataPath + field['FLDNAME'] + "} === 'X' }"
                    });
                    if (forSearch)
                        selection.attachSelect(oControl._onSearchValueChange.bind(oControl));
                    selection.data("model", modelName);
                    //*****Rel 60E_SP6 - Task #39097
                    selection.data("dataPath", dataPath + field['FLDNAME']);
                    //*****
                    break;
                    //*****Rel 60E_SP6 - Task #39097
                case global.vui5.cons.element.toggle:
                    selection = new sap.m.Switch({
                        state: "{= ${" + modelName + ">" + dataPath + field['FLDNAME'] + "} === 'X' }",
                        change: [oController._onToggleButtonChange, oController]
                    });
                    if (forSearch)
                        selection.attachChange(oControl._onSearchValueChange.bind(oControl));
                    selection.data("model", modelName);
                    selection.data("dataPath", dataPath + field['FLDNAME']);
                    break;
                    //*****    
                default:
                    selection = new sap.m.Input({
                        showValueHelp: false,
                        maxLength: parseInt(field['OUTPUTLEN'])
                    });

                    oControl.setFieldType(selection, field);
                    oControl._searchReplaceFieldCheck(selection, field);

                    if (field['SDSCR'] == global.vui5.cons.fieldValue.description || field['SDSCR'] == global.vui5.cons.fieldValue.value_cont_descr) {
                        selection.bindValue(modelName + ">" + dataPath + field['TXTFL'], null, bindingMode);
                        selection.data("model", modelName);
                        selection.data("path", fieldPath);
                        selection.attachChange(oController.getDescription.bind(oController));
                        selection.setMaxLength(60);
                    } else {
                        selection.bindValue(modelName + ">" + dataPath + field['FLDNAME'], null, bindingMode);
                    }
                    break;
            }
            return selection;
        };

        T.prototype._onSearchValueChange = function () {
            var oControl = this;
            oControl.searchAndReplace.itemFindIndex = -1;
        };

        /* Check Field Properties */
        T.prototype._searchReplaceFieldCheck = function (selection, field) {
            var oController = this.getController();

            if (field['INTTYPE'] == global.vui5.cons.intType.number) {
                selection.attachChange(oController.checkNumericField.bind(oController));
            } else if (field['INTTYPE'] == global.vui5.cons.intType.packed) {
                selection.attachChange(oController.checkPackedField.bind(oController));
            } else if (field['INTTYPE'] == global.vui5.cons.intType.integer) {
                selection.attachChange(oController.checkIntegerField.bind(oController));
            }
        };

        /* Replace All */
        T.prototype.replaceAll = function () {
            var oControl = this;

            var selectedField = oControl._selectField.getSelectedKey();

            var items = oControl.getSelectedItems();
            if (items.length == 0) {
                items = oControl.getItems();
            }
            var model = oControl.getModel(oControl.getModelName());
            var fields = model.getProperty(oControl.getFieldPath());

            var searchFor = model.getProperty("/__SEARCH/DATA/" + selectedField);
            var replaceWith = model.getProperty("/__REPLACE/DATA/" + selectedField);

            var controls = [];
            /* Search and Replace Issue - 6446 */
            if (!searchFor || !replaceWith)
                return;
            /* Search and Replace Issue - 6446 */

            for (var itemIndex = 0; itemIndex < items.length; itemIndex++) {

                var rowPath = items[itemIndex].getBindingContext(oControl.getModelName()).getPath();
                var dataModified = false;

                var cells = items[itemIndex].getCells();

                for (var cellIndex = 0; cellIndex < cells.length; cellIndex++) {

                    controls = oControl.getSearchReplaceControl(cells, cellIndex);

                    for (var controlIndex = 0 ; controlIndex < controls.length ; controlIndex++) {
                    	var fieldname = controls[controlIndex].data("FLDNAME");
                        if (fieldname == selectedField) {
                            var field = underscoreJS.find(fields, {
                                'FLDNAME': selectedField
                            });
                            if (field) {
                                if (controls[controlIndex].getEditable()) {
                                    var value,
                                        path;
                                    switch (field['ELTYP']) {
                                        case global.vui5.cons.element.input:
                                            if (field['SDSCR'] == global.vui5.cons.fieldValue.value || field['SDSCR'] == global.vui5.cons.fieldValue.value_descr) {
                                                value = "" + controls[controlIndex].getValue();
                                                if (value.indexOf(searchFor) != -1) {
                                                    value = value.replace(searchFor, replaceWith);
                                                    controls[controlIndex].setValue(value);
                                                    controls[controlIndex].fireChange();
                                                    dataModified = true;
                                                }
                                            } else {
                                                path = controls[controlIndex].getBindingContext(oControl.getModelName()).getPath();
                                                path = path + "/" + controls[controlIndex].getBinding("value").getPath();

                                                value = model.getProperty(path);
                                                if (value == searchFor) {
                                                    value = replaceWith;
                                                    controls[controlIndex].setValue(value);
                                                    controls[controlIndex].fireChange();
                                                    dataModified = true;
                                                }
                                            }
                                            break;
                                        case global.vui5.cons.element.valueHelp:
                                            if (field['SDSCR'] == global.vui5.cons.fieldValue.value || field['SDSCR'] == global.vui5.cons.fieldValue.value_descr) {
                                                value = "" + controls[controlIndex].getValue();
                                                if (value.indexOf(searchFor) != -1) {
                                                    value = value.replace(searchFor, replaceWith);
                                                    controls[controlIndex].setValue(value);
                                                    controls[controlIndex].fireChange();
                                                    dataModified = true;
                                                }
                                            } else {
                                                path = controls[controlIndex].getBindingContext(oControl.getModelName()).getPath();
                                                path = path + "/" + controls[controlIndex].getBinding("value").getPath();

                                                value = model.getProperty(path);
                                                if (value == searchFor) {
                                                    value = replaceWith;
                                                    controls[controlIndex].setValue(value);
                                                    controls[controlIndex].fireChange();
                                                    dataModified = true;
                                                }
                                            }
                                            break;
                                        case global.vui5.cons.element.dropDown:
                                            value = controls[controlIndex].getSelectedKey();
                                            if (value == searchFor) {
                                                value = replaceWith;
                                                controls[controlIndex].setSelectedKey(value);
                                                controls[controlIndex].fireChange();
                                                dataModified = true;
                                            }
                                            break;
                                        case global.vui5.cons.element.checkBox:
                                            value = controls[controlIndex].getSelected();
                                            if (value == searchFor) {
                                                value = replaceWith;
                                                controls[controlIndex].setSelected(value);
                                                controls[controlIndex].fireSelect();
                                                dataModified = true;
                                            }
                                            break;
                                            //*****Rel 60E_SP6 - Task #39097
                                        case global.vui5.cons.element.toggle:
                                            value = controls[controlIndex].getState();
                                            if (value == searchFor) {
                                                value = replaceWith;
                                                controls[controlIndex].setState(value);
                                                controls[controlIndex].fireChange();
                                                dataModified = true;
                                            }
                                            break;
                                            //*****
                                    }
                                }
                            }
                            //*****Rel 60E_SP6
                            if (dataModified) {
                                oControl.itemFound = true;
                            }
                            //*****

                        }
                        if (dataModified) {
                            var object = underscoreJS.find(oControl._oChangedRowsPath, {
                                'PATH': rowPath
                            });
                            if (!object) {
                                this._oChangedRowsPath.push({
                                    'PATH': rowPath
                                });
                            }
                            break;
                        }
                    }
                    if (dataModified) {
                        break;
                    }
                    
                }
            }
        };

        T.prototype.getSearchReplaceControl = function (cells, cellIndex) {
            var oControl = this, vBoxItems, hBoxItems, control = [];

            if (!oControl.isGroupingPresent()) {
                control.push(cells[cellIndex]);
            }
            else {
                vBoxItems = cells[cellIndex].getItems();
                underscoreJS.each(vBoxItems, function (vboxItem) {
                    hBoxItems = vboxItem.getItems();
                    underscoreJS.each(hBoxItems, function (hBoxItem) {
                        if (hBoxItem.data("FLDNAME")) {
                            control.push(hBoxItem);

                        }
                    })
                });
            }

            return control;
        };

        /* Find */
        T.prototype.findValue = function () {
            var oControl = this;

            var items = oControl.getSelectedItems();
            if (items.length == 0) {
                items = oControl.getItems();
            }
            var model = oControl.getModel(oControl.getModelName());
            var fields = model.getProperty(oControl.getFieldPath());
            var itemFound = false;

            var selectedField = oControl._selectField.getSelectedKey();
            var searchFor = model.getProperty("/__SEARCH/DATA/" + selectedField);


            var controls = [];


            /* Search and Replace Issue - 6446 */
            if (!searchFor)
                return;
            /* Search and Replace Issue - 6446 */
            //*****Rel 60E_SP6 - QA #9410
            oControl.itemFound = true;
            //*****
            for (var itemIndex = 0; itemIndex < items.length; itemIndex++) {

                if (itemIndex > oControl.searchAndReplace.itemFindIndex) {

                    var rowPath = items[itemIndex].getBindingContext(oControl.getModelName()).getPath();
                    // var rowData = model.getProperty(rowPath);

                    var cells = items[itemIndex].getCells();

                    for (var cellIndex = 0; cellIndex < cells.length; cellIndex++) {

                        controls = oControl.getSearchReplaceControl(cells, cellIndex);

                        for (var controlIndex = 0 ; controlIndex < controls.length ; controlIndex++) {
                            var fieldname = controls[controlIndex].data("FLDNAME");

                            if (fieldname == selectedField) {
                                var field = underscoreJS.find(fields, {
                                    'FLDNAME': selectedField
                                });
                                if (field) {
                                    var value,
                                        path;
                                    switch (field['ELTYP']) {
                                        case global.vui5.cons.element.input:
                                            if (field['SDSCR'] == global.vui5.cons.fieldValue.value || field['SDSCR'] == global.vui5.cons.fieldValue.value_descr) {
                                                value = "" + controls[controlIndex].getValue();
                                                if (value.indexOf(searchFor) != -1) {
                                                    itemFound = true;
                                                }
                                            } else {
                                                path = controls[controlIndex].getBindingContext(oControl.getModelName()).getPath();
                                                path = path + "/" + controls[controlIndex].getBinding("value").getPath();

                                                value = model.getProperty(path);
                                                if (value == searchFor) {
                                                    itemFound = true;
                                                }
                                            }
                                            break;
                                        case global.vui5.cons.element.valueHelp:
                                            if (field['SDSCR'] == global.vui5.cons.fieldValue.value || field['SDSCR'] == global.vui5.cons.fieldValue.value_descr) {
                                                value = "" + controls[controlIndex].getValue();
                                                if (value.indexOf(searchFor) != -1) {
                                                    itemFound = true;
                                                }
                                            } else {
                                                path = controls[controlIndex].getBindingContext(oControl.getModelName()).getPath();
                                                path = path + "/" + controls[controlIndex].getBinding("value").getPath();

                                                value = model.getProperty(path);
                                                if (value == searchFor) {
                                                    itemFound = true;
                                                }
                                            }
                                            break;
                                        case global.vui5.cons.element.dropDown:
                                            value = controls[controlIndex].getSelectedKey();
                                            if (value == searchFor) {
                                                itemFound = true;
                                            }
                                            break;
                                        case global.vui5.cons.element.checkBox:
                                            value = controls[controlIndex].getSelected();
                                            if (value == searchFor) {
                                                itemFound = true;
                                            }
                                            break;
                                            //*****Rel 60E_SP6 - Task #39097
                                        case global.vui5.cons.element.toggle:
                                            value = controls[controlIndex].getState();
                                            if (value == searchFor) {
                                                itemFound = true;
                                            }
                                            break;
                                            //*****
                                    }

                                    if (itemFound) {
                                        if (oControl.searchAndReplace.control) {
                                            $(oControl.searchAndReplace.control.getDomRef()).parent().css('background-color', '');
                                        }
                                        oControl.searchAndReplace.searchRowPath = rowPath;
                                        oControl.searchAndReplace.itemFindIndex = itemIndex;
                                        oControl.searchAndReplace.control = controls[controlIndex];
                                        $(oControl.searchAndReplace.control.getDomRef()).parent().css('background-color', 'yellow');
                                        oControl.searchAndReplace.control.focus();
                                    }
                                }
                                break;
                            }
                        }
                        if (itemFound) {
                            break;
                        }
                    }
                }
                if (itemFound)
                    break;
            }
        };

        /* Replace Value */
        T.prototype.replaceValue = function () {
            var oControl = this;

            if (oControl.searchAndReplace.control && oControl.searchAndReplace.control.getEditable()) {

                var selectedField = oControl._selectField.getSelectedKey();

                var model = oControl.getModel(oControl.getModelName());

                var fields = model.getProperty(oControl.getFieldPath());
                var field = underscoreJS.find(fields, {
                    'FLDNAME': selectedField
                });

                var searchFor = model.getProperty("/__SEARCH/DATA/" + selectedField);
                var replaceWith = model.getProperty("/__REPLACE/DATA/" + selectedField);

                /* Search and Replace Issue - 6446 */
                if (!searchFor || !replaceWith)
                    return;
                /* Search and Replace Issue - 6446 */

                //*****Rel 60E_SP6 - QA #9410
                oControl.itemFound = true;
                //*****

                var selection = oControl.searchAndReplace.control;
                var value;
                switch (field['ELTYP']) {
                    case global.vui5.cons.element.input:
                        if (field['SDSCR'] == global.vui5.cons.fieldValue.value || field['SDSCR'] == global.vui5.cons.fieldValue.value_descr) {
                            value = "" + selection.getValue();
                            value = value.replace(searchFor, replaceWith);
                            selection.setValue(value);
                            selection.fireChange();
                        } else {
                            value = replaceWith;
                            selection.setValue(value);
                            selection.fireChange();
                        }
                        break;

                    case global.vui5.cons.element.valueHelp:
                        if (field['SDSCR'] == global.vui5.cons.fieldValue.value || field['SDSCR'] == global.vui5.cons.fieldValue.value_descr) {
                            value = "" + selection.getValue();
                            value = value.replace(searchFor, replaceWith);
                            selection.setValue(value);
                            selection.fireChange();
                        } else {
                            value = replaceWith;
                            selection.setValue(value);
                            selection.fireChange();
                        }
                        break;

                    case global.vui5.cons.element.dropDown:
                        value = replaceWith;
                        /*** Rel 60E SP6 - Search & Replace not working when we click on Replace Button in Popup - Start**/
                        selection.setSelectedKey(value);
                        /*** Rel 60E SP6 - Search & Replace not working when we click on Replace Button in Popup - End **/
                        selection.setValue(value);
                        selection.fireChange();
                        break;

                    case global.vui5.cons.element.checkBox:
                        value = replaceWith;
                        selection.setSelected(value);
                        selection.fireSelect();
                        break;
                        //*****Rel 60E_SP6 - Task #39097
                    case global.vui5.cons.element.toggle:
                        value = replaceWith;
                        selection.setState(value);
                        selection.fireChange();
                        break;
                        //*****
                }
                var object = underscoreJS.find(oControl._oChangedRowsPath, {
                    'PATH': oControl.searchAndReplace.searchRowPath
                });
                if (!object) {
                    oControl._oChangedRowsPath.push({
                        'PATH': oControl.searchAndReplace.searchRowPath
                    });
                }
            }
            oControl.findValue();
        };
        /* Search and Replace Changes */

        T.prototype.onFieldClick = function (oEvent) {
            var oControl = this;
            var rowPath = oEvent.getSource().getParent().getBindingContext(oControl.getModelName());
            var rowdata = oControl.getModel(oControl.getModelName()).getProperty(rowPath.sPath);

            var params = {};

            params[global.vui5.cons.params.selectedRow] = rowdata['ROWID'] || "";
            params[global.vui5.cons.params.fieldName] = oEvent.getSource().data("fieldname") || "";
            oControl.fireOnFieldClick({
                'urlParams': params,
                'fieldInfo': oEvent.getSource().data("fieldInfo")
            });
        };

        T.prototype._getCurrentRow = function (oEvent) {
            var source = oEvent.getSource();
            var model = source.getModel(source.data("model"));
            return model.getProperty(oEvent.getSource().getParent().getBindingContext(oEvent.getSource().data("model")).getPath())['ROWID'] || '';
        };

        T.prototype.onValueHelpRequest = function (oEvent) {
            var oControl = this;
            var source = oEvent.getSource();
            var model = source.getModel(source.data("model"));
            var fieldInfo = model.getProperty(source.data("path"));

            var rowid = model.getProperty(oEvent.getSource().getParent().getBindingContext(source.data("model")).getPath())['ROWID'] || '';

            this.fireOnValueHelpRequest({
                oEvent: oEvent,
                fieldInfo: fieldInfo,
                rowId: oControl._getCurrentRow(oEvent)
            });
        };


        T.prototype.fullScreenDialog = function (oEvent) {
            var source = oEvent.getSource();
            this.fireOnFullScreen({
                "fullScreen": oEvent.getSource().getIcon() === 'sap-icon://full-screen'
            });

        };

        T.prototype.processSetValues = function (oEvent) {
            var oControl = this;
            oControl.fireOnSetValues({
                callBack: function () {
                    oControl.setValuesDialog();
                }
            });
        };

        T.prototype.setValuesDialog = function () {
            var oControl = this;
            oControl._setValuesdialog = new global.vui5.ui.controls.SetValues({
                controller: this.getController(),
                modelName: this.getModelName(),
                fieldPath: this.getFieldPath(),
                dataPath: this.getDataPath(),
                dataAreaPath: this.getDataAreaPath(),
                onValueHelpRequest: function (oEvent) {
                    oControl.fireOnValueHelpRequest({
                        oEvent: oEvent.getParameter("oEvent"),
                        fieldInfo: oEvent.getParameter("fieldInfo")
                    });

                },

                onApply: function (oEvent) {
                    oControl._setValuesData = oEvent.getParameter("DATA");
                    oControl.fireOnSetValuesApply();
                    oControl._setValuesdialog.close();
                },
                onClose: function (oEvent) {
                    oControl.fireOnSetValuesClose();
                }
            });

            oControl._setValuesdialog.preProcessFieldEvent = function (oEvent) {
                return oControl.preProcessFieldEvent(oEvent);
            };

            var _sContentDensityClass;
            if (!sap.ui.Device.support.touch) {
                _sContentDensityClass = "sapUiSizeCompact";
            } else {
                _sContentDensityClass = "sapUiSizeCozy";
            }

            jQuery.sap.syncStyleClass(_sContentDensityClass, this, oControl._setValuesdialog);

            var model = this.getModel(this.getModelName());
            oControl._setValuesdialog.setModel(model, this.getModelName());
            oControl._setValuesdialog.setModel(this.getProperty("controller").getMainModel(), global.vui5.modelName);
            oControl._setValuesdialog.prepareDialog();
            oControl._setValuesdialog.open();

        };

        T.prototype.getSetValueData = function () {
            var data = {};
            if (!underscoreJS.isEmpty(this._setValuesData)) {
                data = this._setValuesData;
                this._setValuesData = {};
            }
            return data;
        };


        T.prototype.addAggregatePanelItem = function (dialog) {
            var oControl = this;
            if(oControl.isGroupingPresent()){
            	return;
            }

            if (!oControl._aggrPanel) {
                oControl._aggrPanel = new global.vui5.ui.controls.AggregationPanel({
                    title: this._oBundle.getText("Aggregation"),
                    visible: true,
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


        };


        T.prototype.vuiPrepareFooter = function () {
            var oControl = this;
            var columns = oControl.getColumns();
            var layoutData = oControl.getModel(oControl.getModelName()).getProperty(oControl.getLayoutDataPath());
            var totalData = oControl.getModel(oControl.getModelName()).getProperty(oControl.getTotalDataPath());

            if (!layoutData) {
                return;
            }

            if (!totalData) {
                return;
            }

            if (totalData && !totalData['TOTAL']) {
                return;
            }
            var object, prepareFooter;
            underscoreJS.each(columns, function (column) {
                object = column.getBindingContext(oControl.getModelName()).getObject();

                prepareFooter = false;

                prepareFooter = !underscoreJS.isEmpty(underscoreJS.findWhere(layoutData['AGRGTITEMS'], { 'COLUMNKEY': object['FLDNAME'], 'AGGAT': global.vui5.cons.aggregate.sum })) ||
                                !underscoreJS.isEmpty(underscoreJS.findWhere(layoutData['AGRGTITEMS'], { 'COLUMNKEY': object['FLDNAME'], 'AGGAT': global.vui5.cons.aggregate.minimum })) ||
                                !underscoreJS.isEmpty(underscoreJS.findWhere(layoutData['AGRGTITEMS'], { 'COLUMNKEY': object['FLDNAME'], 'AGGAT': global.vui5.cons.aggregate.maximum })) ||
                                !underscoreJS.isEmpty(underscoreJS.findWhere(layoutData['AGRGTITEMS'], { 'COLUMNKEY': object['FLDNAME'], 'AGGAT': global.vui5.cons.aggregate.average }));
                if (prepareFooter) {
                    var footer = new sap.m.Text({});

                    /*footer.bindProperty("visible", {
                        path: oControl.getModelName() + ">" + oControl.getTotalDataPath() + "TOTAL" + "/" + object['FLDNAME'],
                        formatter: function (value) {
                            return !!value;
                        }
                    });*/

                    footer.bindProperty("visible", {
                        parts: [{ path: oControl.getModelName() + ">" + oControl.getTotalDataPath() + "TOTAL" + "/" + object['FLDNAME'] },
                        { path: oControl.getModelName() + ">" + oControl.getTotalDataPath() + "MAX" + "/" + object['FLDNAME'] },
                        { path: oControl.getModelName() + ">" + oControl.getTotalDataPath() + "MIN" + "/" + object['FLDNAME'] },
                        { path: oControl.getModelName() + ">" + oControl.getTotalDataPath() + "AVG" + "/" + object['FLDNAME'] }],

                        formatter: function (total, max, min, avg) {
                            return !!total || !!max || !!min || !!avg;
                        }
                    });

                    footer.bindProperty("text", {
                        parts: [{ path: oControl.getModelName() + ">" + oControl.getTotalDataPath() + "TOTAL" + "/" + object['FLDNAME'] },
                       { path: oControl.getModelName() + ">" + oControl.getTotalDataPath() + "MAX" + "/" + object['FLDNAME'] },
                       { path: oControl.getModelName() + ">" + oControl.getTotalDataPath() + "MIN" + "/" + object['FLDNAME'] },
                        { path: oControl.getModelName() + ">" + oControl.getTotalDataPath() + "AVG" + "/" + object['FLDNAME'] }],

                        formatter: function (total, max, min, avg) {
                            //return total || max || min;
                            var title = "";

                            if (total) {
                                return total;
                            }
                            else if (max) {
                                return oControl._oBundle.getText("Max") + ":" + max;
                            }
                            else if (min) {
                                return oControl._oBundle.getText("Min") + ":" + min;
                            }
                            else if (avg) {
                                return oControl._oBundle.getText("Avg") + ":" + avg;
                            }


                        }
                    });

                    column.setFooter(footer);
                }
            });
        };

        T.prototype.setCellValueChangeColor = function (source) {

            if (!source.getValueState) {
                return;
            }
            if (source.getValueState() === sap.ui.core.ValueState.Error) {
                return;
            }

            jQuery.sap.delayedCall(1, this, function () {
                source.$().addClass("vuiInputBase vuiChangedRowField");
                source.$("inner").addClass("vuiInputBase vuiChangedRowField");
            });

            /* if (source instanceof sap.m.DatePicker ||
                 source instanceof sap.m.TimePicker) {
                 jQuery.sap.delayedCall(1, this, function () {
                     source.$().addClass("vuiInputBase vuiChangedRowField");
                     source.$("inner").addClass("vuiInputBase vuiChangedRowField");
                 });
             }
             else {
                 jQuery.sap.delayedCall(1, this, function () {
                     source.$().addClass("vuiInputBase vuiChangedRowField");
                     source.$("inner").addClass("vuiInputBase vuiChangedRowField");
                 });
             }*/
        };

        T.prototype.resetCellValueChangeColor = function (source) {
            if (!source.getValueState) {
                return;
            }

            if (source.getValueState() === sap.ui.core.ValueState.Error) {
                return;
            }
            if (source.$().hasClass("vuiInputBase vuiChangedRowField")) {
                source.$().removeClass("vuiInputBase vuiChangedRowField");
                source.$("inner").removeClass("vuiInputBase vuiChangedRowField");
            }
        };


        T.prototype.postProcessMassEditFields = function (changedFieldsContext) {
            var oControl = this;
            var items = oControl.getItems(),
                itemBindingContextPath,
                changedFieldContext,
                cells, index, arr;
            oControl.setBusy(true);
            //            oControl._oChangedRowsPath = underscoreJS.pluck(changedFieldsContext, "PATH");
            if (!underscoreJS.isEmpty(oControl._oChangedRowsPath)) {
                var newlyChangedRowsPaths = underscoreJS.map(changedFieldsContext, function (path) {
                    return { "PATH": path["PATH"] };
                });
                underscoreJS.each(newlyChangedRowsPaths, function (newPath) {
                    if (underscoreJS.find(oControl._oChangedRowsPath, { PATH: newPath['PATH'] }) == undefined) {
                        oControl._oChangedRowsPath.push(newPath);
                    }
                })
            } else {
                oControl._oChangedRowsPath = underscoreJS.map(changedFieldsContext, function (path) {
                    return { "PATH": path["PATH"] };
                });
            }

            underscoreJS.each(items, function (item) {
                itemBindingContextPath = item.getBindingContext(oControl.getModelName()).getPath();
                changedFieldContext = underscoreJS.findWhere(changedFieldsContext, { 'PATH': itemBindingContextPath });

                if (!underscoreJS.isEmpty(changedFieldContext)) {
                    cells = item.getCells();

                    underscoreJS.each(cells, function (cell) {
                        arr = changedFieldContext['PATH'].split("/");
                        index = arr[arr.length - 1];

                        if (changedFieldContext['FIELDS'].indexOf(cell.data("FLDNAME")) !== -1) {
                            oControl.setCellValueChangeColor(cell);
                            if (underscoreJS.isEmpty(oControl._oChangedRowFields)) {
                                oControl._oChangedRowFields.push({
                                    "FLDNAME": cell.data("fieldInfo")['TXTFL'] ? cell.data("fieldInfo")['TXTFL'] : cell.data("fieldInfo")['FLDNAME'],
                                    "INDEX": index
                                });
                            }
                            else if (!underscoreJS.isObject(underscoreJS.findWhere(oControl._oChangedRowFields, { 'FLDNAME': cell.data("FLDNAME"), "INDEX": index }))) {
                                oControl._oChangedRowFields.push({
                                    "FLDNAME": cell.data("fieldInfo")['TXTFL'] ? cell.data("fieldInfo")['TXTFL'] : cell.data("fieldInfo")['FLDNAME'],
                                    "INDEX": index
                                });
                            }
                        }
                    });
                }
            });
            oControl.setBusy(false);
            oControl.removeSelections();


        };

        T.prototype.getVariantModified = function () {
            return this._oVariants.currentVariantGetModified();
        };

        T.prototype.setVariantModified = function (value) {
            this._oVariants.currentVariantSetModified(value);
        };

        T.prototype.applyOnDemandPersonalization = function () {
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
        return T;
    });