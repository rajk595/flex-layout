sap.ui.define(["sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    vistexConfig.rootFolder + "/ui/core/global",
    vistexConfig.rootFolder + "/ui/core/commonUtils",
    "sap/m/MultiInput",
    'sap/ui/base/ManagedObjectMetadata',
    vistexConfig.rootFolder + "/ui/core/plugins/excelplus-2.5.min",
    vistexConfig.rootFolder + "/ui/core/plugins/xlsx.core.min"

],
    function (Controller, MessageBox, JSONModel, global, commonUtils, MultiInput, ManagedObjectMetadata) {
        window.commonUtils = commonUtils;
        return Controller.extend(vistexConfig.rootFolder + ".ui.core.BaseController", {
            _config: {
                lastActionRef: {}
            },
          
            _preparePageContent: false,
            _lastVisitedViewRef: undefined,
            constructor: function () {
                console.log("<MuTest");
                console.log("Conflict YTest");
                var oController = this,
                    onInitFn;
                onInitFn = oController.onInit;
                oController.onInit = function () {
                    if (!oController.getMainModel()) {
                        var mainModel = new JSONModel();
                        mainModel.loadData(jQuery.sap.getModulePath(vistexConfig.rootFolder + ".ui.core") + "/model.json", "", false);
                        mainModel.setSizeLimit(global.vui5.cons.maxDataLimit);
                        this.getOwnerComponent().setModel(mainModel, global.vui5.modelName);
                    }
                    oController.getView().addStyleClass(oController.getOwnerComponent().getContentDensityClass());
                    // oController._serverInit();
                    if (oController.modelName) {
                        oController._createModel();
                    }
                    if (onInitFn && onInitFn instanceof Function) {
                        onInitFn.call(oController);
                    }

                    if (sap.ui.getVersionInfo().version > "1.58") {


                        MultiInput.prototype.setTokens = function (aTokens) {

                            var oValidatedToken,
                                aValidatedTokens = [],
                                i;

                            if (Array.isArray(aTokens)) {
                                for (i = 0; i < aTokens.length; i++) {
                                    oValidatedToken = this.validateAggregation("tokens", aTokens[i], true);
                                    ManagedObjectMetadata.addAPIParentInfoBegin(aTokens[i], this, "tokens");
                                    aValidatedTokens.push(oValidatedToken);
                                }

                                this._tokenizer.setTokens(aValidatedTokens);

                                /*for (i = 0; i < aTokens.length; i++) {
                                    ManagedObjectMetadata.addAPIParentInfoEnd(aTokens[i]);
                                }*/
                            } else {
                                throw new Error("\"" + aTokens + "\" is of type " + typeof aTokens + ", expected array for aggregation tokens of " + this);
                            }

                            return this;
                        };
                    }
                };
            },
            clearRefs: function () {
                this.sectionRef = {};
                this.sectionConfig = {};
                this.functionRef = [];
                delete this.onCancelAction;
                delete this.tabBar;
                delete this.ObjectPageLayout;


            },
            getDrillDownBuffer: function () {
                var oController = this,
                    mainModel;
                mainModel = oController.getMainModel();

                return mainModel.getProperty("/DRILLDOWN_BUFFER");
            },

            getPageNavBuffer: function () {
                var oController = this,
                    mainModel;
                mainModel = oController.getMainModel();

                return mainModel.getProperty("/PAGENAV_BUFFER");
            },

            getLoadFullPage: function () {
                var oController = this,
                    mainModel;
                mainModel = oController.getMainModel();

                return mainModel.getProperty("/LOAD_FULLPAGE") === 'X';
            },
            //*****Rel 60E_SP6
            dashboardBufferFill: function (sectn, dshbdBuffer) {
                var oController = this;
                var mainModel = oController.getOwnerComponent().getModel(global.vui5.modelName);
                var section = oController.getSectionBy("SECTN", sectn);
                var dashboardBuffer = mainModel.getProperty("/DSHBD_BUFFER") || [];
                var bufferData, bufferIndex;

                if (section && section['DAPPT'] === global.vui5.cons.propertyType.dashboard && oController.sectionRef[section['SECTN']]) {
                    var bufferData = oController.sectionRef[section['SECTN']].getDashboardActiveState();
                }
                else if (dshbdBuffer) {
                    bufferData = dshbdBuffer;
                }

                if (!bufferData) {
                    return;
                }
                bufferIndex = underscoreJS.findIndex(dashboardBuffer, { KEY: bufferData['KEY'] });
                if (bufferIndex != -1) {
                    dashboardBuffer[bufferIndex] = bufferData;
                }
                else {
                    dashboardBuffer.push(bufferData);
                }
                mainModel.setProperty("/DSHBD_BUFFER", dashboardBuffer);
            },
            //*****
            bufferDrillDown: function (bufferFill, sectionId) {
                if (this._itemSwitch) {
                    this._initializeCurrentModel();
                    return;
                }
                var oController = this,
                    mainModel,
                    currentModel,
                    drilldownBuffer,
                    bufferedData;
                var section = oController.getSectionBy("SECTN", sectionId) || {};
                var lineLayout = oController.getProfileInfo()['UILYT'] === global.vui5.cons.layoutType.line;
                mainModel = oController.getMainModel();
                currentModel = oController.getCurrentModel();
                drilldownBuffer = oController.getDrillDownBuffer();
                var modelData = jQuery.extend({}, currentModel.getData());
                modelData['DATA'] = {};
                if (bufferFill) {
                    oController.prepareBreadCrumbText(sectionId);
                    drilldownBuffer.push({
                        "DATA": modelData,
                        "BCLINKS": mainModel.getProperty("/BCLINKS"),
                        "PASCT": section['PASCT'],
                        "SECTN": sectionId,
                        "SELECTED_SECTION": lineLayout ? oController._sectionKey ? oController._sectionKey : "" : "",
                        "SELECTED_SUBSECTION": lineLayout ? oController._subSectionKey ? oController._subSectionKey : "" : "",
                        "LOAD_FULLPAGE": oController.getLoadFullPage(),
                        "DRILLDOWNKEYS": mainModel.getProperty("/DRILLDOWNKEYS"),
                        "FNBVR_OBJ": mainModel.getProperty("/FNBVR_OBJ"),
                        //*****Rel 60E_SP6
                        "DSHBD_BUFFER": mainModel.getProperty("/DSHBD_BUFFER")
                        //*****

                    });
                    lineLayout ? oController._sectionKey || oController._subSectionKey ? oController._clearSectionkeys() : "" : "";
                    oController._initializeCurrentModel();
                } else {
                    if (underscoreJS.isArray(drilldownBuffer) && drilldownBuffer.length > 0) {
                        bufferedData = drilldownBuffer.pop();
                        oController._initializeCurrentModel();
                        if (bufferedData['LOAD_FULLPAGE']) {
                            oController._preparePageContent = true;
                            oController._prepareCurrentView();
                        }
                        oController.sectionConfig = bufferedData['DATA']['SECCFG'];
                        if (lineLayout) {
                            oController._sectionKey = bufferedData['SELECTED_SECTION'];
                            oController._subSectionKey = bufferedData['SELECTED_SUBSECTION'];
                        }
                        currentModel.setData(bufferedData['DATA']);
                        bufferedData['BCLINKS'].pop();
                        mainModel.setProperty("/BCLINKS", bufferedData['BCLINKS']);
                        mainModel.setProperty("/LOAD_FULLPAGE", bufferedData['LOAD_FULLPAGE']);
                        mainModel.setProperty("/FNBVR_OBJ", bufferedData['FNBVR_OBJ']);
                        //*****Rel 60E_SP6
                        mainModel.setProperty("/DSHBD_BUFFER", bufferedData['DSHBD_BUFFER']);
                        //*****
                        if (drilldownBuffer.length > 0) {
                            mainModel.setProperty("/DRILLDOWNKEYS", drilldownBuffer[drilldownBuffer.length - 1]['DRILLDOWNKEYS']);
                        }

                    } else {
                        oController._initializeCurrentModel();
                    }


                }
            },
            /**** Rel 60E SP6 - FullScreen Support changes - Start ***/

            prepareFullScreenControl: function (section, variantModified) {
                var oController = this;
                var mainModel = oController.getMainModel();
                var currentModel = oController.getCurrentModel();
                var prepareFullScreen = mainModel.getProperty("/FULLSCREEN") || currentModel.getProperty("/POPUP_PROP/FLVIW") === 'X';

                oController.fullScreenControl = new sap.m.FlexBox().addStyleClass("vuiFullScreenFlexBox");
                oController.getView().addContent(oController.fullScreenControl);

                oController.fullScreenControl.addItem(oController.getViewContent(oController._formDialog));

                /***Rel 60E SP7 QA #12797 - Start ***/
                if (section && section['DAPPT'] === global.vui5.cons.propertyType.table &&
                    section['TBTYP'] === global.vui5.cons.tableType.responsive &&
                    oController.sectionRef[section['SECTN']] &&
                    oController.sectionRef[section['SECTN']].getPagingType() === global.vui5.cons.pagingType.virtualPaging &&
                    oController.sectionRef[section['SECTN']]._oGrowingDelegate) {

                    oController.sectionRef[section['SECTN']]._oGrowingDelegate._iLimit =
                        parseInt(oController.sectionRef[section['SECTN']].getPagingThreshold());

                }
                /***Rel 60E SP7 QA #12797 - End ***/
                oController.fullScreenControl.addEventDelegate({
                    onAfterRendering: function (e) {
                        if (prepareFullScreen && !oController.fullScreenPopup) {
                            oController.fullScreenPopup = new sap.ui.core.Popup({
                                modal: true,
                                shadow: false,
                                autoClose: false,
                            });
                            if (!jQuery.support.touch) {
                                e.srcControl.getItems()[0].addStyleClass("sapUiSizeCompact");
                            }
                            if (variantModified) {
                                oController.sectionRef[section['SECTN']].setVariantModified(variantModified);
                                oController.sectionRef[section['SECTN']].applyOnDemandPersonalization();
                            }

                            //*****Rel 60E_SP6
                            if (section && (section['DAPPT'] === global.vui5.cons.propertyType.processFlow ||
                                section['DAPPT'] === global.vui5.cons.propertyType.status)) {
                                oController.sectionRef[section['SECTN']].setStatusZoomLevel();
                            }
                            //*****                            

                            oController.fullScreenPopup.$content = e.srcControl.getItems()[0].$();
                            oController.fullScreenPopup.$tempNode = jQuery("<div></div>");
                            oController.fullScreenPopup.$content.before(oController.fullScreenPopup.$tempNode);
                            oController.fullScreenPopup.$overlay = jQuery("<div id='" + jQuery.sap.uid() + "'></div>");
                            oController.fullScreenPopup.$overlay.addClass("vuiFullScreenOverlay");
                            oController.fullScreenPopup.$overlay.append(oController.fullScreenPopup.$content);
                            oController.fullScreenPopup.setContent(oController.fullScreenPopup.$overlay);
                            oController.fullScreenPopup.open(0, sap.ui.core.Popup.Dock.BeginTop, sap.ui.core.Popup.Dock.BeginTop, jQuery("body"));
                        }
                    }
                });
            },

            destroyFullScreenControl: function () {
                var oController = this;
                var mainModel = oController.getMainModel();
                if (mainModel.getProperty("/FULLSCREEN") || oController.getCurrentModel().getProperty("/POPUP_PROP/FLVIW") === 'X') {
                    underscoreJS.each(oController.getView().getContent(), function (content) {
                        if (content instanceof sap.m.FlexBox) {
                            oController.fullScreenPopup.destroy();
                            oController.fullScreenPopup = undefined;
                            oController.fullScreenControl.destroy();
                            oController.getView().removeContent(content);
                            oController.fullScreenControl = undefined;

                            mainModel.setProperty("/FULLSCREEN", false);
                            mainModel.setProperty("/FULLSCREEN_SECTN", "");
                            mainModel.setProperty("/FULLSCR_SKIPUPDATE", false);
                            oController._bufferSectionConfig();

                        }
                    });
                    oController.getCurrentModel().setProperty("/FLSCR_SECTN", []);
                    oController.getCurrentModel().setProperty("/FLSCR_DATA", []);
                }
            },
            /**** Rel 60E SP6 - FullScreen Support changes - Start ***/
            prepareFullScreenPopupModel: function (section, currentModel) {
                var oController = this, data, nodes;
                currentModel.setProperty(oController._getPath(true), underscoreJS.where(currentModel.getProperty("/SECTN"), { 'SECTN': section['SECTN'] }));
                var currSection = underscoreJS.findWhere(currentModel.getProperty("/SECTN"), { DARID: section['DARID'] });
                if (currSection['DAPPT'] === vui5.cons.propertyType.summary || currSection['DAPPT'] === vui5.cons.propertyType.reportingView) {
                    underscoreJS.each(currSection['SUMDATA'], function (obj) {
                        //if (obj['VWTYP'] === vui5.cons.viewType.grid) {
                        data = $.extend(true, [], currentModel.getProperty("/DATA/" + obj['SUMID']));
                        currentModel.setProperty(oController._getPath() + obj['SUMID'], data);
                        //}
                    });
                }
                else {

                    nodes = oController.getNode(currentModel.getProperty("/DATA"), false);

                    data = $.extend(true, [], currentModel.getProperty("/DATA/" + section['DARID']));
                    currentModel.setProperty(oController._getPath() + section['DARID'], data);

                    underscoreJS.each(nodes, function (node) {
                        if (node.indexOf(section['DARID'] + "_") !== -1) {
                            data = $.extend(true, [], currentModel.getProperty("/DATA/" + node));
                            currentModel.setProperty(oController._getPath() + node, data);
                        }
                    });


                    /* data = $.extend(true, [], currentModel.getProperty("/DATA/" + section['DARID'] + global.vui5.cons.nodeName.layout));
                     currentModel.setProperty(oController._getPath() + section['DARID'] + global.vui5.cons.nodeName.layout, data);
 
                     data = $.extend(true, [], currentModel.getProperty("/DATA/" + section['DARID'] + global.vui5.cons.nodeName.variant));
                     currentModel.setProperty(oController._getPath() + section['DARID'] + global.vui5.cons.nodeName.variant, data);*/
                }
            },
            /**** Rel 60E SP6 - FullScreen Support changes - End ***/
            determineMinRowCount: function (tableRef, data) {
                var oController = this, mainModel, minRowCount = 10;
                mainModel = oController.getMainModel();

                if (mainModel.getProperty("/FULLSCREEN")) {
                    minRowCount = 14;
                }
                if (underscoreJS.isEmpty(data)) {
                    if (sap.ui.getVersionInfo().version < "1.50") {
                        jQuery.sap.delayedCall(0.5, tableRef, function () {
                            tableRef.setProperty("visibleRowCountMode", sap.ui.table.VisibleRowCountMode.Auto, true);
                        });
                    }
                    else {
                        tableRef.setProperty("visibleRowCountMode", sap.ui.table.VisibleRowCountMode.Auto, true);
                    }

                    return parseInt(minRowCount);
                }
                if (tableRef.getPageSize()) {
                    if (tableRef.getPagingType() === global.vui5.cons.pagingType.serverPaging) {
                        if (data.length < parseInt(tableRef.getPageSize())) {
                            if (sap.ui.getVersionInfo().version < "1.50") {
                                jQuery.sap.delayedCall(0.5, tableRef, function () {
                                    tableRef.setProperty("visibleRowCountMode", sap.ui.table.VisibleRowCountMode.Fixed, true);
                                    tableRef.setVisibleRowCount(data.length);
                                });
                            }
                            else {
                                tableRef.setProperty("visibleRowCountMode", sap.ui.table.VisibleRowCountMode.Fixed, true);
                                tableRef.setVisibleRowCount(data.length);
                            }
                        }
                        else {
                            if (sap.ui.getVersionInfo().version < "1.50") {
                                jQuery.sap.delayedCall(0.5, tableRef, function () {
                                    tableRef.setProperty("visibleRowCountMode", sap.ui.table.VisibleRowCountMode.Fixed, true);
                                    tableRef.setVisibleRowCount(parseInt(tableRef.getPageSize()));
                                });
                            }
                            else {
                                tableRef.setProperty("visibleRowCountMode", sap.ui.table.VisibleRowCountMode.Fixed, true);
                                tableRef.setVisibleRowCount(parseInt(tableRef.getPageSize()));
                            }
                        }
                    }
                    else if (tableRef.getPagingType() === global.vui5.cons.pagingType.virtualPaging) {
                        if (data.length < parseInt(tableRef.getPageSize())) {
                            if (sap.ui.getVersionInfo().version < "1.50") {
                                jQuery.sap.delayedCall(0.5, tableRef, function () {
                                    tableRef.setProperty("visibleRowCountMode", sap.ui.table.VisibleRowCountMode.Fixed, true);
                                    tableRef.setVisibleRowCount(data.length);
                                });
                            }
                            else {
                                tableRef.setProperty("visibleRowCountMode", sap.ui.table.VisibleRowCountMode.Fixed, true);
                                tableRef.setVisibleRowCount(data.length);
                            }

                        }
                        else {

                            if (sap.ui.getVersionInfo().version < "1.50") {
                                jQuery.sap.delayedCall(0.5, tableRef, function () {
                                    tableRef.setProperty("visibleRowCountMode", sap.ui.table.VisibleRowCountMode.Fixed, true);
                                    tableRef.setVisibleRowCount(parseInt(tableRef.getPageSize()));
                                });
                            }
                            else {
                                tableRef.setProperty("visibleRowCountMode", sap.ui.table.VisibleRowCountMode.Fixed, true);
                                tableRef.setVisibleRowCount(parseInt(tableRef.getPageSize()));
                            }
                        }


                    }
                    else if (data && data.length < minRowCount) {

                        if (sap.ui.getVersionInfo().version < "1.50") {
                            jQuery.sap.delayedCall(0.5, tableRef, function () {
                                tableRef.setProperty("visibleRowCountMode", sap.ui.table.VisibleRowCountMode.Fixed, true);
                                tableRef.setVisibleRowCount(data.length);
                            });
                        }
                        else {
                            tableRef.setProperty("visibleRowCountMode", sap.ui.table.VisibleRowCountMode.Fixed, true);
                            tableRef.setVisibleRowCount(data.length);
                        }
                    }
                    else {

                        if (sap.ui.getVersionInfo().version < "1.50") {
                            jQuery.sap.delayedCall(0.5, tableRef, function () {
                                tableRef.setProperty("visibleRowCountMode", sap.ui.table.VisibleRowCountMode.Fixed, true);
                                tableRef.setVisibleRowCount(minRowCount);
                            });
                        }
                        else {
                            tableRef.setProperty("visibleRowCountMode", sap.ui.table.VisibleRowCountMode.Fixed, true);
                            tableRef.setVisibleRowCount(minRowCount);
                        }
                    }
                }
                else if (data && data.length < minRowCount) {
                    if (sap.ui.getVersionInfo().version < "1.50") {
                        jQuery.sap.delayedCall(0.5, tableRef, function () {
                            tableRef.setProperty("visibleRowCountMode", sap.ui.table.VisibleRowCountMode.Fixed, true);
                            tableRef.setVisibleRowCount(data.length);
                        });
                    }
                    else {
                        tableRef.setProperty("visibleRowCountMode", sap.ui.table.VisibleRowCountMode.Fixed, true);
                        tableRef.setVisibleRowCount(data.length);
                    }
                }
                else {

                    if (sap.ui.getVersionInfo().version < "1.50") {
                        jQuery.sap.delayedCall(0.5, tableRef, function () {
                            tableRef.setProperty("visibleRowCountMode", sap.ui.table.VisibleRowCountMode.Fixed, true);
                            tableRef.setVisibleRowCount(minRowCount);
                        });
                    }
                    else {
                        tableRef.setProperty("visibleRowCountMode", sap.ui.table.VisibleRowCountMode.Fixed, true);
                        tableRef.setVisibleRowCount(minRowCount);
                    }
                }

                return parseInt(minRowCount);
            },
            processFullScreen: function (sectionId, fullScreen, skipUpdate) {
                var oController = this, section, currentModel, mainModel, data, objDefer = $.Deferred(), variantModified, currentSectionConfig, sectionConfig, nodes;
                currentModel = oController.getCurrentModel();
                mainModel = oController.getMainModel();
                section = oController.getSectionBy("SECTN", sectionId);
                if (section['DISOL']) {
                    skipUpdate = true;
                }

                oController._skipRequest = oController.getProfileInfo()['UITYP'] === global.vui5.cons.UIType.worklist;


                mainModel.setProperty("/FULLSCR_SKIPUPDATE", !!skipUpdate);
                var promise = oController._UpdateChanges(sectionId);
                promise.then(function () {
                    if (fullScreen) {
                        oController.getData(sectionId).then(function () {
                            mainModel.setProperty("/FULLSCREEN", true);
                            mainModel.setProperty("/FULLSCREEN_SECTN", sectionId);

                            if (oController.sectionRef[sectionId].getVariantModified) {
                                variantModified = oController.sectionRef[sectionId].getVariantModified();
                            }

                            oController._bufferSectionConfig(true);

                            oController.prepareFullScreenPopupModel(section, currentModel);

                            oController.prepareFullScreenControl(section, variantModified);
                            objDefer.resolve();
                        });

                    }
                    else {
                        if (oController.sectionRef[sectionId].getVariantModified) {
                            variantModified = oController.sectionRef[sectionId].getVariantModified();
                        }
                        nodes = oController.getNode(currentModel.getProperty(oController._getPath()), false);

                        data = $.extend(true, [], currentModel.getProperty(oController._getPath() + section['DARID']));
                        currentModel.setProperty("/DATA/" + section['DARID'], data);

                        underscoreJS.each(nodes, function (node) {
                            if (node.indexOf(section['DARID'] + "_") !== -1) {
                                data = $.extend(true, [], currentModel.getProperty(oController._getPath() + node));
                                currentModel.setProperty("/DATA/" + node, data);
                            }
                        });

                        currentSectionConfig = oController.sectionConfig[section['SECTN']];

                        oController.destroyFullScreenControl();

                        oController.sectionConfig[section['SECTN']] = currentSectionConfig;

                        currentModel.setProperty("/SECCFG", oController.sectionConfig);
                        if (section['TBTYP'] == global.vui5.cons.tableType.grid) {
                            if (oController.sectionRef[sectionId].setVariantModified) {
                                oController.sectionRef[sectionId].setVariantModified(variantModified);
                                oController.sectionRef[sectionId].onVuiGridInfocusSet();
                            }
                        }
                        else {
                            oController.getData(sectionId).then(function () {
                                if (oController.sectionRef[sectionId].setVariantModified) {
                                    oController.sectionRef[sectionId].setVariantModified(variantModified);
                                    oController.sectionRef[sectionId].applyOnDemandPersonalization();
                                }
                                objDefer.resolve();
                            });
                        }

                    }

                });
                return objDefer.promise();
            },
            /*processFullScreen: function (sectionId, fullScreen, skipUpdate) {
                var oController = this, section, currentModel, mainModel, data, objDefer = $.Deferred();
                currentModel = oController.getCurrentModel();
                mainModel = oController.getMainModel();
                section = oController.getSectionBy("SECTN", sectionId);
                if (section['DISOL']) {
                    skipUpdate = true;
                }
                mainModel.setProperty("/FULLSCR_SKIPUPDATE", !!skipUpdate);
                var promise = oController._UpdateChanges(sectionId);
                promise.then(function () {
                    if (fullScreen) {
                        oController.getData(sectionId).then(function () {
                            mainModel.setProperty("/FULLSCREEN", true);
                            mainModel.setProperty("/FULLSCREEN_SECTN", sectionId);

                            oController._formDialog = {
                                "FNCNM": global.vui5.cons.eventName.fullScreen
                            };
                            oController._bufferSectionConfig(true);

                            currentModel.setProperty(oController._getPath(true), underscoreJS.where(currentModel.getProperty("/SECTN"), { 'SECTN': sectionId }));
                            var currSection = underscoreJS.findWhere(currentModel.getProperty("/SECTN"), { DARID: section['DARID'] });
                            if (currSection['DAPPT'] === vui5.cons.propertyType.summary || currSection['DAPPT'] === vui5.cons.propertyType.reportingView) {
                                underscoreJS.each(currSection['SUMDATA'], function (obj) {
                                    if (obj['VWTYP'] === vui5.cons.viewType.grid) {
                                        data = $.extend(true, [], currentModel.getProperty("/DATA/" + obj['SUMID']));
                                        currentModel.setProperty(oController._getPath() + obj['SUMID'], data);
                                    }
                                });
                            }
                            else {
                                data = $.extend(true, [], currentModel.getProperty("/DATA/" + section['DARID']));
                                currentModel.setProperty(oController._getPath() + section['DARID'], data);
                            }
                            oController._popup = new sap.m.Dialog({
                                title: section['DESCR'],
                                showHeader: false,
                                content: [oController.getViewContent(oController._formDialog)],
                                stretch: true
                            }).setModel(currentModel, oController.modelName);
                            // currentModel.setProperty(oController._getPath() + section['DARID'], currentModel.getProperty("/DATA/" + section['DARID']));


                            if (!jQuery.support.touch) { // apply compact
                                // mode if touch is
                                // not supported
                                oController._popup.addStyleClass("sapUiSizeCompact");
                            }

                            oController._popup.open();
                            objDefer.resolve();
                        });

                    }
                    else {
                        mainModel.setProperty("/FULLSCREEN", false);
                        mainModel.setProperty("/FULLSCREEN_SECTN", "");
                        mainModel.setProperty("/FULLSCR_SKIPUPDATE", false);
                        oController._popupClose(true);
                        oController._refreshPopupModel();
                        oController.getData(sectionId).then(function () {
                            objDefer.resolve();
                        });
                    }

                });
                return objDefer.promise();
            },*/
            /**** Rel 60E SP6 - FullScreen Support changes - End ***/
            prepareBreadCrumbText: function (sectionId) {
                var oController = this,
                    mainModel,
                    currentModel,
                    bcLinks,
                    section,
                    lineLayout,
                    linkText;

                lineLayout = oController.getProfileInfo()['UILYT'] !== global.vui5.cons.layoutType.tab;

                if (!lineLayout) {
                    return;
                }
                section = oController.getSectionBy("SECTN", sectionId) || {};
                var dataPath = oController._getPath();
                currentModel = oController.getCurrentModel();
                mainModel = oController.getMainModel();
                bcLinks = mainModel.getProperty("/BCLINKS");

                linkText = currentModel.getProperty(dataPath + "OBHDR_TITLE/TITLE") || section['DESCR'];

                bcLinks.push({
                    "TEXT": linkText,
                    "PASCT": section['PASCT'],
                    "SECTN": sectionId
                });

            },

            refreshSectionConfig: function () {
                var oController = this, mainModel;
                mainModel = oController.getMainModel();
                underscoreJS.each(oController.getDrillDownBuffer(), function (drilldownBuffer) {
                    drilldownBuffer['DATA']['SECCFG'] = {};
                });

            },

            bufferPageNavigation: function (sectionId, bufferFill, dependentApp) {
                var oController = this,
                    mainModel,
                    currentModel,
                    pageNavigationBuffer,
                    bufferedData;
                mainModel = oController.getMainModel();
                currentModel = oController.getCurrentModel();
                pageNavigationBuffer = oController.getPageNavBuffer();
                if (bufferFill) {
                    if (!dependentApp) {
                        oController.refreshSectionConfig();
                    }
                    pageNavigationBuffer.push({
                        "UIPRFINFO": oController.getProfileInfo(),
                        "DEPAPP": dependentApp,
                        "ENTITY": oController.getSubEntities(),
                        "DRILLDOWN": oController.getDrillDownBuffer(),
                        "DROPDOWNS": dependentApp ? mainModel.getProperty("/DROPDOWNS") : [],
                        "SECTION": sectionId,
                        "MODELDATA": dependentApp ? currentModel.getData() : {},
                        "BCLINKS": mainModel.getProperty("/BCLINKS"),
                        "DRILLDOWNKEYS": mainModel.getProperty("/DRILLDOWNKEYS"),
                        "FNBVR_OBJ": mainModel.getProperty("/FNBVR_OBJ"),
                        //*****Rel 60E_SP6
                        "DSHBD_BUFFER": mainModel.getProperty("/DSHBD_BUFFER")
                        //*****
                    });

                    oController.refreshDrillDownBuffer();
                    oController._initializeCurrentModel();
                } else {
                    bufferedData = pageNavigationBuffer.pop();
                    if (!bufferedData) {
                        return {};
                    }
                    oController.setProfileInfo(bufferedData);
                    delete bufferedData['UIPRFINFO'];
                    mainModel.setProperty("/DRILLDOWN_BUFFER", bufferedData['DRILLDOWN']);
                    mainModel.setProperty("/BCLINKS", bufferedData['BCLINKS']);
                    mainModel.setProperty("/FNBVR_OBJ", bufferedData['FNBVR_OBJ']);
                    //*****Rel 60E_SP6
                    mainModel.setProperty("/DSHBD_BUFFER", bufferedData['DSHBD_BUFFER']);
                    //*****
                    oController._initializeCurrentModel();
                    if (bufferedData['DEPAPP']) {
                        oController.sectionConfig = bufferedData['MODELDATA']['SECCFG'];
                        oController._prepareCurrentView();
                        //currentModel.setProperty("/DATA/", bufferedData['MODELDATA']);
                        /***Rel 60E SP6 ECIP #17325 - Start ****/
                        //currentModel.setData(bufferedData['MODELDATA']);
                        underscoreJS.each(oController.getNode(bufferedData['MODELDATA'], true), function (node) {
                            currentModel.setProperty("/" + node, bufferedData['MODELDATA'][node]);
                        });

                        underscoreJS.each(oController.getNode(bufferedData['MODELDATA']), function (node) {
                            currentModel.setProperty("/" + node, bufferedData['MODELDATA'][node]);
                        });
                        /***Rel 60E SP6 ECIP #17325 - End ****/
                        oController._skipListRepDataReq();
                        mainModel.setProperty("/DROPDOWNS", bufferedData['DROPDOWNS']);
                        /*** Rel 60E SP6 ECIP #17620 - Start ***/
                        //mainModel.setProperty("/DRILLDOWNKEYS", bufferedData['DRILLDOWNKEYS']);
                        /*** Rel 60E SP6 ECIP #17620 - End ***/
                    }
                    /*** Rel 60E SP6 ECIP #17620 - Start ***/
                    mainModel.setProperty("/DRILLDOWNKEYS", bufferedData['DRILLDOWNKEYS']);
                    /*** Rel 60E SP6 ECIP #17620 - End ***/
                    return bufferedData;
                }
            },

            refreshDrillDownBuffer: function () {
                var oController = this,
                    mainModel;
                mainModel = oController.getMainModel();
                mainModel.setProperty("/DRILLDOWN_BUFFER", []);
                mainModel.setProperty("/BCLINKS", []);
                mainModel.setProperty("/DRILLDOWNKEYS", []);
            },

            applicationInitialize: function () {
                var oController = this,
                    urlParams = {},
                    objConfig = {},
                    promise,
                    prePageNavInfo,
                    initialCall = false,
                    deferred = $.Deferred();

                prePageNavInfo = oController.bufferPageNavigation();
                if (!oController.sectionConfig[prePageNavInfo['SECTION']]) {
                    initialCall = true;
                }

                objConfig = {
                    sectionId: prePageNavInfo['SECTION'],
                    initialCall: initialCall,
                    context: oController.currentRoute,
                    action: global.vui5.cons.eventName.applicationInitialize
                };

                if (prePageNavInfo['ENTITY']) {
                    urlParams[global.vui5.cons.params.entity] = prePageNavInfo['ENTITY'];
                }


                objConfig.urlParams = urlParams;

                promise = this.callServer(objConfig);

                promise.then(function (response) {
                    oController.processResultNode(response);
                    oController._prepareCurrentView();
                    oController.updateMetadata(response);
                    oController.updateDocumentData(response);
                    oController.updateProperties(response);


                    deferred.resolve();
                });

                return deferred.promise();
            },
            //*****Rel 60E_SP7
            summaryMetadataFill: function (serverResponse) {
                var oController = this, model, sections, response, callFrom, keys, flag = false;
                model = oController.getModel(oController.modelName);
                response = serverResponse['response'];
                callFrom = serverResponse['callFrom'];
                keys = underscoreJS.keys(response);
                underscoreJS.each(keys, function (key, i) {
                    if (key.indexOf("SUMMARY__") != -1) {
                        flag = true;
                    }
                });
                if (!callFrom && flag) {
                    sections = response['SECTN'] || oController.getSections();

                    underscoreJS.each(keys, function (key, i) {
                        if (key.indexOf("SUMMARY__") != -1) {
                            var index, darid, section;
                            index = key.indexOf("__") + 2;
                            darid = key.slice(index, key.indexOf("_PROP"));
                            section = underscoreJS.findWhere(sections, { "DARID": darid });
                            section['SUMDATA'] = response[key];
                        }
                    });

                }
            },
            //*****
            getApplicationIdentifier: function () {
                var oController = this,
                    hashUrl,
                    componentData;
                componentData = oController.getOwnerComponent().getComponentData();
                var profileInfo = oController.getProfileInfo() || {};

                if (profileInfo['APPID']) {
                    return profileInfo['APPID'];
                } else if (componentData && componentData.startupParameters.APPID) {
                    global.vui5.session.fromFioriLaunchpad = true;
                    return componentData.startupParameters.APPID;

                } else {
                    if (location.hash.indexOf("#/") !== -1) {
                        hashUrl = location.hash.replace("#/", "");
                    } else {
                        hashUrl = location.hash.replace("#", "");
                    }

                    return hashUrl.split('?')[0].split("/")[0];

                }

            },
            getUrlParamsFromUrl: function (excludeTab) {
                var oController = this,
                    queryParams;
                var mainModel = oController.getMainModel(),
                    params;
                var dMode = mainModel.getProperty("/DOCUMENT_MODE");
                var hashUrl;

                if (location.hash.indexOf("#/") !== -1) {
                    hashUrl = location.hash.replace("#/", "");
                } else {
                    hashUrl = location.hash.replace("#", "");
                }

                params = hashUrl.split('?')[1] || '';

                if (dMode) {
                    queryParams = commonUtils._getQueryParams(params);

                    if (excludeTab) {
                        if (queryParams['tab']) {
                            delete queryParams['tab'];
                        }
                    }

                    switch (dMode) {
                        case global.vui5.cons.mode.display:
                            queryParams['mode'] = global.vui5.cons.modeText.display;
                            break;
                        case global.vui5.cons.mode.change:
                            queryParams['mode'] = global.vui5.cons.modeText.change;
                            break;
                        case global.vui5.cons.mode.create:
                            queryParams['mode'] = global.vui5.cons.modeText.create;
                            break;
                    }

                    if (queryParams) {
                        params = "";
                        underscoreJS.each(queryParams, function (value, key) {
                            params = params + (params ? '&' : '') + key + '=' + value;
                        });
                    }
                }


                return underscoreJS.isEmpty(params) ? '' : '?' + params;
            },
            getDocumentNumberFromUrl: function () {
                var hashUrl,
                    hashUrlParts,
                    hashUrlParts2;
                if (location.hash.indexOf("#/") !== -1) {
                    hashUrl = location.hash.replace("#/", "");
                } else {
                    hashUrl = location.hash.replace("#", "");
                }
                hashUrlParts = hashUrl.split('?')[0].split("/");

                if (hashUrl.split('?')[1]) {
                    hashUrlParts2 = hashUrl.split('?')[1].split("/");
                }


                if (hashUrlParts.indexOf(global.vui5.cons.applicationContext.document) !== -1) {
                    return decodeURI(hashUrlParts[hashUrlParts.indexOf(global.vui5.cons.applicationContext.document) + 1]);
                }
                else if (hashUrlParts2 && hashUrlParts2.indexOf(global.vui5.cons.applicationContext.document) !== -1) {
                    return decodeURI(hashUrlParts2[hashUrlParts2.indexOf(global.vui5.cons.applicationContext.document) + 1]);
                }
                else if (hashUrlParts.indexOf(global.vui5.cons.applicationContext.listProcess) !== -1) {
                    return decodeURI(hashUrlParts[hashUrlParts.indexOf(global.vui5.cons.applicationContext.listProcess) + 1]);
                }
                else if (hashUrlParts2 && hashUrlParts2.indexOf(global.vui5.cons.applicationContext.listProcess) !== -1) {
                    return decodeURI(hashUrlParts[hashUrlParts2.indexOf(global.vui5.cons.applicationContext.listProcess) + 1]);
                }

                else {
                    return false;
                }

            },
            getSubEntities: function (hashUrl) {
                var oController = this;
                var routeParams = oController.getRouteParams();
                var entities = routeParams['all*'] || '',
                    allEntities = '';

                if (oController.oldHashUrl) {
                    entities = oController.oldHashUrl;
                }
                underscoreJS.each(entities.split('?')[0].split("/"), function (entity, index) {
                    if (index > 1) {
                        if (allEntities) {
                            allEntities += '/';
                        }
                        allEntities += entity;

                    }
                });
                return allEntities;
            },

            getPreviousSubEntity: function () {
                var oController = this;
                var allSubEntities = oController.getSubEntities() || '';
                var section = '',
                    key = '',
                    matches;
                var regExp = /\(([^)]+)\)/;

                if (allSubEntities) {
                    allSubEntities = allSubEntities.split('/');
                    if (allSubEntities[allSubEntities.length - 2]) {
                        allSubEntities = allSubEntities[allSubEntities.length - 2];
                        matches = regExp.exec(allSubEntities);
                        section = allSubEntities.split('(')[0];
                        key = matches[1];
                    }
                }

                return {
                    section: section,
                    key: key
                };
            },
            getCurrentSubEntity: function () {
                var oController = this;
                var allSubEntities = oController.getSubEntities() || '';
                var section = '',
                    key = '',
                    matches;
                var regExp = /\(([^)]+)\)/;


                if (allSubEntities) {
                    allSubEntities = allSubEntities.split('/');
                    allSubEntities = underscoreJS.last(allSubEntities);
                    matches = regExp.exec(allSubEntities);
                    section = allSubEntities.split('(')[0];
                    key = matches[1];
                }

                return {
                    section: section,
                    key: key
                };
            },
            setSubEntity: function (sectionID, key, refreshAction) {
                var oController = this,
                    switchEntities;
                var allSubEntities = oController.getSubEntities();

                if (oController._itemSwitch || refreshAction) {
                    switchEntities = allSubEntities.split("/");

                    switchEntities.pop();
                    allSubEntities = switchEntities.join('/');

                }

                if (allSubEntities) {
                    allSubEntities += '/';
                }


                allSubEntities += sectionID + '(' + key + ')';

                return allSubEntities;
            },
            getRouteParams: function () {

                var oController = this;
                var routerRef = oController.getRouter();
                var routerPvtObj = routerRef._oRouter;
                var hashManager = routerRef.oHashChanger;
                var currentHash,
                    matchedRoutes,
                    routeParams = {};

                if (hashManager) {
                    currentHash = hashManager.getHash();
                    matchedRoutes = routerPvtObj._getMatchedRoutes(currentHash);

                    underscoreJS.each(matchedRoutes, function (matchedRoute) {
                        underscoreJS.each(matchedRoute.params, function (g, h) {
                            routeParams[matchedRoute.route._paramsIds[h]] = g;
                        });
                    });
                }

                return routeParams;
            },
            getRouteParam: function (key) {
                var oController = this;

                return oController.getRouteParams()[key];
            },
            getQueryParams: function () {
                var oController = this,
                    params;
                params = oController.getRouteParam('all*') || '';
                return commonUtils.paramsUnserialize(params);
            },
            getQueryParam: function (key) {
                var oController = this,
                    params;
                params = oController.getQueryParams('') || {};
                return params[key];
            },
            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            },
            onNavBack: function () {
                if (!this.browserNavBack) {
                    window.history.go(-1);

                }

            },
            getModel: function (sName) {
                return this.getView().getModel(sName);
            },
            getMainModel: function () {
                return this.getOwnerComponent().getModel(global.vui5.modelName);
            },
            getCurrentModel: function () {
                return this.getModel(this.modelName);
            },
            geti18nResourceBundle: function () {
                return sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.core");
            },
            getBaseURL: function () {
                var baseURL = global.vui5.server.url.baseURL,
                    guiId;
                if (!baseURL) {

                    baseURL = global.vui5.server.url.icf;
                    if (global.vui5.server.url.guiId == null || global.vui5.server.url.guiId == "") {
                        guiId = Math.floor((Math.random() * 100) + 1) + '' + Math.floor((Math.random() * 100) + 1);
                        global.vui5.server.url.guiId = guiId;
                    } else {
                        guiId = global.vui5.server.url.guiId;
                    }
                    guiId = 'sid(' + guiId + ')';
                    if (baseURL.substring(baseURL.length - 1) != '/') {
                        baseURL += '/';
                    }
                    baseURL += guiId + '/';
                    global.vui5.server.url.baseURL = baseURL;

                }
                return baseURL;
            },
            getServerURL: function (config) {
                var oController = this;
                var url,
                    profileInfo,
                    params = '',
                    subEntityInfo, funcBehaviourObj;

                profileInfo = oController.getProfileInfo();

                subEntityInfo = oController._itemSwitch === true &&
                    config.action !== global.vui5.cons.eventName.update ?
                    oController.getPreviousSubEntity() : oController.getCurrentSubEntity();

                if (oController.getMainModel().getProperty("/FNBVR_OBJ")) {
                    if (oController.getMainModel().getProperty("/FNBVR_OBJ")['FNBVR'] == global.vui5.cons.functionBehaviour.add &&
                        (config['actionRef'] && config['actionRef']["FNBVR"] == global.vui5.cons.functionBehaviour.delete)) {
                        funcBehaviourObj = config['actionRef'];
                    }
                    else {
                        funcBehaviourObj = oController.getMainModel().getProperty("/FNBVR_OBJ");
                    }
                }
                else if (config.actionRef &&
                    underscoreJS.isEmpty(config.actionRef['SECTN']) &&
                    config.actionRef['FNBVR'] === global.vui5.cons.functionBehaviour.delete) {
                    funcBehaviourObj = config.actionRef;
                }
                //funcBehaviourObj = oController.getMainModel().getProperty("/FNBVR_OBJ") || "";

                /* 
                 As Add Next is refresh action, for the metadata event we have to pass the section from frontend so that the details section
                 will be the 1st section
                */
                if (underscoreJS.isEmpty(config.sectionId) && this._config.lastActionRef &&
                    this._config.lastActionRef['FNBVR'] === global.vui5.cons.functionBehaviour.add &&
                    oController.getMainModel().getProperty("/FNBVR_OBJ")) {
                    config.sectionId = oController.getMainModel().getProperty("/FNBVR_OBJ")['SECTN'];
                }
                config = config || {};
                url = oController.getBaseURL();
                if (!config.method || config.method === '') {
                    config.method = global.vui5.cons.reqType.get;
                }

                url += '$appid=' + oController.getApplicationIdentifier();

                if (config.context) {
                    url += '/' + config.context;
                }
                if (config.sectionId) {
                    url += '/' + config.sectionId;
                }
                if (config.action) {
                    switch (config.method) {
                        case global.vui5.cons.reqType.get:
                            if (config.selectedRows) {
                                url += '(' + config.selectedRows + ')';
                            }
                            url += '/$' + config.action;
                            break;
                        case global.vui5.cons.reqType.post:
                            if (config.selectedRows) {
                                if (!config.data) {
                                    config.data = {};
                                }
                                config.data['selectedRows'] = config.selectedRows;
                            }
                            if (config.filters) {
                                if (!config.data) {
                                    config.data = {};
                                }
                                config.data['filters'] = config.filters;
                            }
                            url += '/$action=' + config.action;
                            break;
                    }
                }
                if (config.metadata) {
                    // url += '/' + global.vui5.cons.params.metadata;
                    url += '/' + global.vui5.cons.params.metadatanData;

                }
                if (profileInfo) {
                    if (!config.urlParams) {
                        config.urlParams = {};
                    }
                    config.urlParams[global.vui5.cons.params.uiProfile] = profileInfo['UIPRF'];
                    if (!underscoreJS.isEmpty(profileInfo['DEP_OBJECT'])) {
                        config.urlParams[global.vui5.cons.params.depObject] = profileInfo['DEP_OBJECT'];
                    }

                    config.urlParams[global.vui5.cons.params.displayOnly] = profileInfo['DISOL'];
                }


                if (oController.getDocumentNumberFromUrl()) {
                    if (!config.urlParams) {
                        config.urlParams = {};
                    }

                    if (!config.urlParams['$OBJID']) {
                        config.urlParams[global.vui5.cons.params.objid] = oController.getDocumentNumberFromUrl();
                        //config.urlParams[global.vui5.cons.params.objid] = decodeURI(config.urlParams[global.vui5.cons.params.objid]);
                    }
                }

                if (oController.getQueryParam("mode")) {
                    if (!config.urlParams) {
                        config.urlParams = {};
                    }

                    config.urlParams[global.vui5.cons.params.mode] = oController.getQueryParam("mode");
                }

                if (config.initialCall) {
                    if (!config.urlParams) {
                        config.urlParams = {};
                    }

                    config.urlParams[global.vui5.cons.params.initialCall] = 'X';
                }
                if (funcBehaviourObj) {
                    if (!config.urlParams) {
                        config.urlParams = {};
                    }
                    config.urlParams[global.vui5.cons.params.functionBehaviour] = funcBehaviourObj['FNBVR'];
                }

                if (subEntityInfo && subEntityInfo.section && subEntityInfo.key) {
                    if (!config.urlParams) {
                        config.urlParams = {};
                    }
                    config.urlParams[global.vui5.cons.params.parentSection] = subEntityInfo.section;
                    config.urlParams[global.vui5.cons.params.parentSectionKey] = subEntityInfo.key;
                }

                if (config.urlParams) {
                    underscoreJS.each(config.urlParams, function (value, key) {
                        params = params + (params ? '&' : '') + key + '=' + value;
                    });
                    if (!(underscoreJS.isEmpty(params))) {
                        url = commonUtils.addQueryParams(url, params);
                    }
                }
                return url;
            },
            callServer: function (config) {
                var oController = this;
                var objConfig = underscoreJS.clone(config) || {},
                    objDefer = null,
                    urlParts = null;
                objConfig.hideLoader = objConfig.hideLoader === true;
                objConfig.action = objConfig.action || '';
                objConfig.method = objConfig.method || global.vui5.cons.reqType.get;
                objConfig.cache = false; // IE
                objConfig.withCredentials = true;
                objConfig.xhrFields = {};
                objConfig.xhrFields['withCredentials'] = true;
                objConfig.contentType = "application/json";
                objConfig.dataType = "json";

                if (oController[global.vui5.ui.callBack.callServer] instanceof Function) {
                    oController[global.vui5.ui.callBack.callServer].call(oController, {
                        objConfig: objConfig
                    });
                }

                objConfig.crossDomain = true;
                if (objConfig.mimeType) {
                    objConfig.mimeType = objConfig.mimeType;
                    objConfig.contentType = false;
                    objConfig.processData = false;
                }

                if (oController.ajaxAsync === false) {
                    objConfig.async = oController.ajaxAsync;
                }



                if (objConfig.async != "") {
                    objConfig.async = objConfig.async;
                }
                if (!objConfig.url) {
                    objConfig.url = this.getServerURL(objConfig);
                }
                if (objConfig.actionRef) {
                    this._config.lastActionRef = objConfig.actionRef;
                }
                //*****Rel 60E_SP7 - QA# 11929
                else {
                    this._config.lastActionRef = {
                        'FNCNM': objConfig.action
                    }
                }
                //*****


                if (!objConfig.url) {
                    return false;
                }
                if (objConfig.url.indexOf('?') === -1) {
                    objConfig.url += '?';
                }
                urlParts = objConfig.url.split('?');
                objConfig.url = encodeURI(urlParts[0]);
                if (urlParts[1]) {
                    objConfig.url += '?' + encodeURI(urlParts[1]);
                }
                objDefer = $.Deferred();
                if (!objConfig.hideLoader) {
                    commonUtils.startLoader();
                }
                objConfig.beforeSend = function (request) {
                    request.setRequestHeader('x-csrf-token', commonUtils.server.initialCall ? 'fetch' : commonUtils.server.xcsrftoken);
                };
                if (objConfig.data) {
                    objConfig.data = JSON.stringify(objConfig.data);
                }
                global.vui5.session.counterPause = false;


                var successCb = function (data, status, xhr) {

                    //*****Rel 60E_SP7
                    oController.summaryMetadataFill({ response: data, objConfig: objConfig });
                    //*****
                    if (oController[global.vui5.ui.callBack.serverResponse] instanceof Function) {
                        oController[global.vui5.ui.callBack.serverResponse].call(oController, {
                            response: data,
                            objConfig: objConfig
                        });
                    }

                    if (global.vui5.session.fromFioriLaunchpad == false) {
                        global.vui5.session.counterPause = true;
                    }
                    commonUtils.sessionTimeReset();
                    commonUtils.server.initialCall = false;
                    commonUtils.server.xcsrftoken = xhr.getResponseHeader("x-csrf-token");
                    if (!objConfig.hideLoader) {
                        if (/* objConfig.metadata || */ objConfig.loadPartially) {
                            // commonUtils.partialLoader();
                        } else {
                            commonUtils.stopLoader();
                        }
                    }
                    objDefer.resolve(data);
                };
                var errorCb = function (response) {
                    objDefer.fail(response.data);
                    if (!objConfig.hideLoader) {
                        commonUtils.stopLoader();
                    }
                };

                $.ajax(objConfig).done(successCb).fail(errorCb);
                return objDefer.promise();
            },
            loginDataSet: function (data) {
                var mainModel = this.getModel(global.vui5.modelName);
                var theme;
                if (data) {
                    mainModel.setProperty(global.vui5.cons.modelPath.login, data['USERINFO']);
                    mainModel.setProperty(global.vui5.cons.modelPath.appContext, data['APCTX']);
                    mainModel.setProperty(global.vui5.cons.modelPath.sessionInfo, data['SESSION_INFO']);
                    mainModel.setProperty(global.vui5.cons.modelPath.themes, data['THEMES']);
                    // global.vui5.session.ccounter = global.vui5.session.maxTime =
                    // parseInt(mainModel.getProperty(global.vui5.cons.modelPath.login
                    // + '/DATA/TIMEOUT'));
                    if (underscoreJS.isEmpty(mainModel.getProperty(global.vui5.cons.modelPath.sessionInfo + '/THEME')) || mainModel.getProperty(global.vui5.cons.modelPath.sessionInfo + '/THEME') === "sap_bluecrystal") {
                        theme = sap.ui.getVersionInfo().version < "1.40" ? 'sap_bluecrystal' : 'sap_belize';
                        mainModel.setProperty(global.vui5.cons.modelPath.sessionInfo + '/THEME', theme);
                    }
                    /****Rel 60E SP6 ECIP #19825 - Start ****/
                    //global.vui5.session.ccounter = global.vui5.session.maxTime = parseInt(mainModel.getProperty(global.vui5.cons.modelPath.sessionInfo + '/SSTIM'));
                    global.vui5.session.scounter = global.vui5.session.ccounter = global.vui5.session.maxTime = parseInt(mainModel.getProperty(global.vui5.cons.modelPath.sessionInfo + '/SSTIM'));
                    /****Rel 60E SP6 ECIP #19825 - End ****/
                    global.vui5.session.user = mainModel.getProperty(global.vui5.cons.modelPath.sessionInfo + "/USER_TEXT");
                    global.vui5.themeRoot = mainModel.getProperty(global.vui5.cons.modelPath.sessionInfo + '/THMRT');
                    global.vui5.session.extensionPath = mainModel.getProperty(global.vui5.cons.modelPath.appContext + '/DATA/EXTENSIONPATH');
                    commonUtils.applyTheme(mainModel.getProperty(global.vui5.cons.modelPath.sessionInfo + '/THEME'));
                    if (data['APCTX']) {
                        global.vui5.cons.applnObject = data['APCTX']['OBJTP'];
                        global.vui5.cons.application = data['APCTX']['APPLN'];
                    }
                    if (data['APCTX']['VZDBURL']) {
                        mainModel.setProperty("/DASHBOARD_URL", data['APCTX']['VZDBURL']);
                    }

                    var decimalNotation = this.getMainModel().getProperty(vui5.cons.modelPath.sessionInfo + "/DCPFM");

                    var oFormatSettings = sap.ui.getCore().getConfiguration().getFormatSettings();

                    oFormatSettings.setLegacyNumberFormat(decimalNotation === "" ? ' ' : decimalNotation);

                    if (mainModel.getProperty(global.vui5.cons.modelPath.sessionInfo)['SPRAS_EXT']) {
                        sap.ui.getCore().getConfiguration().setLanguage(mainModel.getProperty(global.vui5.cons.modelPath.sessionInfo)['SPRAS_EXT']);
                    }

                    //this.initializeWidgetGlobalVariables();
                }
            },
            getProfileInfo: function () {
                var modelPath;
                var mainModel = this.getOwnerComponent().getModel(global.vui5.modelName);
                return mainModel.getProperty(global.vui5.cons.modelPath.infocusUIPrf);
            },
            setProfileInfo: function (data) {
                // TODO - check if this storage at
                // main model is required.
                var modelPath;
                var mainModel = this.getMainModel();

                if (!data['UIPRFINFO']) {
                    return false;
                }
                modelPath = global.vui5.cons.modelPath.infocusUIPrf;
                mainModel.setProperty(modelPath, data['UIPRFINFO']);
            },

            registerFlpHomeBackClickEvent: function () {
                var oController = this, mainModel = this.getMainModel();
                if (global.vui5.session.fromFioriLaunchpad && !oController.homeBtnClickEvent) {
                    oController.homeBtnClickEvent = true;

                    if (sap.ui.getCore().byId("shellNavigationMenu")) {
                        var shellMenuItems = sap.ui.getCore().byId("shellNavigationMenu").getItems();
                        var homeListItemFound, homeListItem;
                        underscoreJS.each(shellMenuItems, function (menuItem) {
                            if (homeListItemFound) {
                                return;
                            }
                            var M = menuItem.getCustomData();
                            if (M && M.length > 0) {
                                for (var i = 0; i < M.length; i++) {
                                    if (M[i].getKey() === "intent") {
                                        var N = M[i].getValue();
                                        if (N && N[0] === "#") {
                                            homeListItem = menuItem;
                                            homeListItemFound = true;
                                        }
                                    }
                                }
                            }
                        });
                    }
                    if (homeListItem) {
                        homeListItem.attachBrowserEvent("click", function () {
                            event.preventDefault();
                            if (mainModel.getProperty("/DATA_CHANGED")) {
                                if (!sap.ushell.resources.browserI18n) {
                                    sap.ushell.resources.browserI18n = sap.ushell.resources.getTranslationModel(window.navigator.language).getResourceBundle();
                                }
                                if (confirm(sap.ushell.resources.browserI18n.getText("dataLossInternalMessage"))) {
                                    oController.sessionClose();
                                    window.location.hash = "Shell-home";
                                    window.fioriLaunchpadHomeBtnClick = true;

                                }
                            } else {
                                oController.sessionClose();
                                window.location.hash = "Shell-home";
                                window.fioriLaunchpadHomeBtnClick = true;
                            }

                            return false;

                        });

                    }

                    $("#homeBtn").click(function () {
                        event.preventDefault();
                        if (mainModel.getProperty("/DATA_CHANGED")) {
                            if (!sap.ushell.resources.browserI18n) {
                                sap.ushell.resources.browserI18n = sap.ushell.resources.getTranslationModel(window.navigator.language).getResourceBundle();
                            }
                            if (confirm(sap.ushell.resources.browserI18n.getText("dataLossInternalMessage"))) {
                                oController.sessionClose();
                                window.location.hash = "Shell-home";
                                window.fioriLaunchpadHomeBtnClick = true;

                            }
                        }
                        else {
                            oController.sessionClose();
                            window.location.hash = "Shell-home";
                            window.fioriLaunchpadHomeBtnClick = true;
                        }

                        return false;
                    });

                    $("#backBtn").click(function (event) {

                        event.preventDefault();
                        if (oController.currentRoute === global.vui5.cons.route.dashboard) {
                            oController.processOnNavBack({

                            });
                        }
                        else {
                            oController.processAction.call(oController, "", oController.onNavAction);
                        }

                        return false;
                    });

                    oController.handleBrowserActions();



                }
            },

            getMetaDataNData: function (section, initialCall, action, objConfig) {
                var oController = this, promise, callBackUrlParams, fromFullScreen, fullScreenSection, currentModel, mainModel
                urlParams = {};
                var objDefer = $.Deferred(), terminateHomeClickEvent = false;

                var sectionConfig = oController.sectionConfig[section];
                var profileInfo = oController.getProfileInfo();
                if (initialCall && !underscoreJS.isEmpty(profileInfo['VARID'])) {
                    urlParams[global.vui5.cons.params.variantID] = profileInfo['VARID'];
                }

                /**** Rel 60E SP6 - FullScreen Support changes - Start ***/
                mainModel = oController.getMainModel();
                fromFullScreen = mainModel.getProperty("/FULLSCREEN");
                if (fromFullScreen && !oController._formDialog && !oController._setValuesAction) {
                    mainModel.setProperty("/FULLSCREEN", false);
                }
                /**** Rel 60E SP6 - FullScreen Support changes - End ***/

                /*if(oController[global.vui5.ui.callBack.getUrlParams] instanceof Function){
                	callBackUrlParams = oController[global.vui5.ui.callBack.getUrlParams].call(oController, global.vui5.cons.callBackCallFrom.metadata_data);
                	
                	if(underscoreJS.isObject(callBackUrlParams) &&
                	   !underscoreJS.isEmpty(callBackUrlParams)){
                		urlParams = jQuery.extend({}, urlParams, callBackUrlParams);
                	}
                }*/
                /*** Tabbed layout support in popup**/
                if (oController._formDialog && !objConfig) {
                    urlParams[global.vui5.cons.params.modal_action] = oController._formDialog['FNCNM'];
                    urlParams[global.vui5.cons.params.modalFunctionSection] = oController._formDialog['SECTN'];

                }
                /***/
                var object = {
                    sectionId: section,
                    initialCall: initialCall,
                    context: oController.currentRoute,
                    metadata: true,
                    urlParams: urlParams
                };
                /*** Tabbed layout support in popup**/
                //if (oController._formDialog || oController._setValuesAction) {
                if ((oController._formDialog && objConfig) || oController._setValuesAction) {
                    object = objConfig;
                }
                /***/

                promise = this.callServer(object);

                promise.then(function (response) {

                    /*** Rel 60E SP6 ECIP #4215 - Start ***/
                    oController.registerFlpHomeBackClickEvent();
                    /*** Rel 60E SP6 ECIP #4215 - End ***/

                    // oController._processSelectedSection(response);


                    oController.processResultNode(response);
                    oController.updateMetadata(response);

                    if (oController[global.vui5.ui.callBack.serverResponse] instanceof Function) {
                        oController[global.vui5.ui.callBack.serverResponse].call(oController, {
                            callFrom: global.vui5.cons.callBackCallFrom.metadata_data,
                            response: response
                        });
                    }


                    oController.updateDocumentData(response);
                    oController.updateProperties(response);


                    if (oController._config.lastActionRef['ACTYP'] === global.vui5.cons.actionType.drilldown) {
                        oController._updateTabBarItems();
                    }
                    //oController.processResultNode(response);

                    if (oController.getMainModel().getProperty("/DOCUMENT_ERRORS")) {

                        oController.getMainModel().setProperty("/DOCUMENT_ERRORS", "");
                        objDefer.reject();
                        return;
                    }
                    if (oController._bufferProcessAction) {
                        oController._processBufferAction();
                    }
                    if (response['RESULT'] && response['RESULT']["FUNCTION"]) {
                        oController.processSubSequentAction(response, object, objDefer);
                    }
                    /**** Rel 60E SP6 - FullScreen Support changes - Start ***/
                    if (fromFullScreen && !oController._formDialog && !oController._setValuesAction) {
                        fullScreenSection = oController.getSectionBy("SECTN", section);
                        currentModel = oController.getCurrentModel();
                        mainModel.setProperty("/FULLSCREEN", fromFullScreen);
                        oController.prepareFullScreenPopupModel(fullScreenSection, currentModel);
                    }
                    /**** Rel 60E SP6 - FullScreen Support changes - End ***/

                    objDefer.resolve(response);

                });

                return objDefer.promise();
            },

            getData: function (section) {
                var oController = this,
                    objDefer = $.Deferred(),
                    promise,
                    context,
                    urlParams = {},
                    action;

                if (oController._skipRequest) {
                    oController._skipRequest = undefined;
                    objDefer.resolve();
                    return objDefer.promise();
                }

                if (oController._formDialog || oController._setValuesAction) { // copy popup
                    action = oController._formDialog || oController._setValuesAction;
                    context = global.vui5.cons.applicationContext.popup;
                    urlParams[global.vui5.cons.params.modal_action] = action['FNCNM'];
                    urlParams[global.vui5.cons.params.modalFunctionSection] = action['SECTN'] || "";
                } else {
                    context = oController.currentRoute;
                }


                promise = this.callServer({
                    context: context,
                    sectionId: section,
                    urlParams: urlParams
                });
                if (promise) {
                    promise.then(function (response) {
                        oController.processResultNode(response);
                        oController.updateDocumentData(response);
                        oController.updateProperties(response);
                        if (oController._bufferProcessAction) {
                            oController._processBufferAction();
                        }
                        oController._updateSwitchFieldValues(section);
                        objDefer.resolve(response);
                    });
                }
                return objDefer.promise();
            },
            getSections: function () {
                var oController = this;
                var model = oController.getModel(oController.modelName);
                var path = oController._getPath(true); // copy popup
                return model.getProperty(path);
            },

            getNonFixedSections: function (name, value) {
                var oController = this;
                var sections = underscoreJS.filter(oController.getSections(), function (section) {
                    return underscoreJS.isEmpty(section['FXSCT']);
                });
                var obj = {};

                obj[name] = value;
                return underscoreJS.where(sections, obj);
            },
            getSectionsBy: function (name, value) {

                var oController = this;
                var sections = oController.getSections();
                var obj = {};

                obj[name] = value;

                return underscoreJS.where(sections, obj);
            },
            getSectionBy: function (name, value) {

                var oController = this;
                var sections = oController.getSections();
                var obj = {};

                obj[name] = value;

                return underscoreJS.findWhere(sections, obj);
            },
            processSearchData: function (searchSection, selections) {
                var oController = this;
                var model = oController.getModel(oController.modelName);
                var dataArea = searchSection['DARID'];
                var fields = searchSection['FIELDS'];
                var path = oController._getPath();
                var searchDataAreaPath = path + dataArea;
                var searchModelPath = searchDataAreaPath + "/SRCH_DATA";
                var searchData;
                searchData = model.getProperty(searchModelPath);
                if (!searchData) {
                    searchData = {};
                    model.setProperty(searchDataAreaPath, searchData);
                }
                if (Object.keys(searchData).length === 0) {
                    searchData = commonUtils.prepareSearchFields(fields);
                }
                if (selections) {
                    oController.modifySpecialCharacters({ "SELECTIONS": selections });
                    searchData = commonUtils.selectionsFill(selections, fields);
                }
                model.setProperty(searchModelPath, searchData);
            },

            modifyVirtualRootNodeData: function (section, data) {
                var oController = this, field, virtualNodeObject = {};
                var attributes = oController._flattenAttributes(section['ATTRB']);
                var parentColumn = attributes.parentColumn;
                var keyColumn = attributes.keyColumn;
                var childCheck = attributes.childCheckColumn;

                virtualNodeObject[vui5.rowID] = data[vui5.rowID];
                virtualNodeObject[parentColumn] = data[parentColumn];
                virtualNodeObject[keyColumn] = data[keyColumn];
                virtualNodeObject[childCheck] = data[childCheck];
                virtualNodeObject[vui5.editableCells] = data[vui5.editableCells];
                virtualNodeObject[vui5.readOnlyColumns] = data[vui5.readOnlyColumns];
                virtualNodeObject[vui5.virtualRoot] = data[vui5.virtualRoot];
                var charFields = underscoreJS.where(section['FIELDS'], { 'DATATYPE': global.vui5.cons.dataType.character });

                underscoreJS.each(charFields, function (field) {
                    virtualNodeObject[field['FLDNAME']] = data[field['FLDNAME']];
                    if (field['TXTFL']) {
                        virtualNodeObject[field['TXTFL']] = data[field['TXTFL']];
                    }
                });

                return virtualNodeObject;

            },

            processTreeTableDataClear: function (section, data) {
                var oController = this;
                underscoreJS.each(data, function (treeData, index) {
                    if (treeData[global.vui5.initColumns]) {
                        oController.clearValuesInColumns(section, treeData);
                    }

                    if (treeData['CHILDNODE'] && treeData['CHILDNODE'].length > 0) {
                        oController.processTreeTableChildNodeDataClear(section, treeData['CHILDNODE']);
                    }
                });
            },

            processTreeTableChildNodeDataClear: function (section, treeData) {
                var oController = this;

                underscoreJS.each(treeData, function (obj) {
                    if (obj[global.vui5.initColumns]) {
                        oController.clearValuesInColumns(section, obj);
                    }
                    if (obj['CHILDNODE'] && obj['CHILDNODE'].length > 0) {
                        oController.processTreeTableChildNodeDataClear(section, obj['CHILDNODE']);
                    }
                });
            },

            clearValuesInColumns: function (section, treeData) {
                var field;
                var columns = treeData[global.vui5.initColumns].split(",");
                underscoreJS.each(columns, function (columnName) {
                    field = underscoreJS.findWhere(section['FIELDS'], { 'FLDNAME': columnName });
                    treeData[columnName] = '';
                    if (field && field['TXTFL']) {
                        treeData[field['TXTFL']] = '';
                    }
                });
            },
            processTreeTableData: function (section, data) {
                var oController = this;
                var attributes = oController._flattenAttributes(section['ATTRB']);
                var parentColumn = attributes.parentColumn;
                var keyColumn = attributes.keyColumn;
                var childCheck = attributes.childCheckColumn;
                var data_temp = [];
                var finalTree = [];
                var n = 0;

                for (var i = n; i < data.length; i++) {
                    if (data[i] === undefined) {
                        break;
                    }

                    if (data[i][vui5.virtualRoot]) {
                        data[i] = oController.modifyVirtualRootNodeData(section, data[i]);
                    }

                    if (data[i][childCheck]) {
                        data[i]['CHILDNODE'] = oController.childNodePrepare(data[i], parentColumn, keyColumn, childCheck, data, i + 1);
                    }
                }
                oController.processTreeTableDataClear(section, data);

            },
            childNodePrepare: function (parentNode, parentColumn, keyColumn, childCheck, data, j) {
                var oController = this;
                var treeTable = [];
                var n = 0;
                ///**Rel 60E SP6 - Tree Table Issue - Start
                /* var object = {};
                 object[parentColumn] = parentNode[keyColumn];

                 var items = underscoreJS.where(data, object);

                 if (items) {
                     underscoreJS.each(items, function (item) {
                         var treeObject = underscoreJS.findWhere(data, item);
                         treeTable.push(item);
                         if (treeObject[childCheck]) {
                             treeObject['CHILDNODE'] = oController.childNodePrepare(data[j], parentColumn, keyColumn, childCheck, data, j + 1);
                         }
                         data.splice(underscoreJS.findIndex(data, item), 1);
                     });
                 }
                 return treeTable;*/

                while (data[j][parentColumn] === parentNode[keyColumn]) {
                    treeTable.push(data[j]);

                    if (data[j][childCheck]) {
                        data[j]['CHILDNODE'] = oController.childNodePrepare(data[j], parentColumn, keyColumn, childCheck, data, j + 1);
                    }
                    data.splice(j, 1);
                    if (!data[j]) {
                        break;
                    }
                }
                return treeTable;
                ///**Rel 60E SP6 - Tree Table Issue - End
            },


            prepareNavBackButton: function () {
                var oController = this;

                return !!(global.vui5.fromOtherApp || global.vui5.session.fromFioriLaunchpad || (this.currentRoute === global.vui5.cons.route.infocus && (oController.getDrillDownBuffer().length > 0 ||
                    oController.getPageNavBuffer().length > 0)));

            },


            getViewContent: function (action) {
                var oController = this, mainModel, profileInfo, pageControl,
                    renderDynamicPage = false, oShell;

                mainModel = oController.getMainModel();
                profileInfo = oController.getProfileInfo();

                renderDynamicPage = profileInfo['UILYT'] === global.vui5.cons.layoutType.line ||
                    profileInfo['UILYT'] === global.vui5.cons.layoutType.pageWithTabs;


                //renderDynamicPage = profileInfo['UITYP'] === global.vui5.cons.UIType.worklist;

                if (underscoreJS.isObject(action)) {
                    renderDynamicPage = false;
                }
                if (mainModel.getProperty("/FULLSCREEN") && !oController._formDialog) {
                    renderDynamicPage = false;
                }

                mainModel.setProperty("/DYNAMIC_PAGE", renderDynamicPage);


                if (!oController._formDialog && !mainModel.getProperty("/FULLSCREEN")) {
                    var parentSection = oController.getCurrentSubEntity();
                    if (parentSection['section'] || profileInfo['DEP_OBJECT']) {
                        oController.onNavAction = {
                            "FNCNM": global.vui5.cons.eventName.continue,
                            "RQTYP": global.vui5.cons.reqTypeValue.post,
                            "ACTYP": global.vui5.cons.actionType.back
                        };

                    } else {
                        oController.onNavAction = {
                            "FNCNM": global.vui5.cons.eventName.cancel,
                            "RQTYP": global.vui5.cons.reqTypeValue.post,
                            "ACTYP": global.vui5.cons.actionType.back
                        };
                    }



                    var msgBtn = oController.msgBtn = new sap.m.semantic.MessagesIndicator({
                        //icon: "sap-icon://alert",
                        //type: sap.m.ButtonType.Emphasized,
                        press: [oController._showMessages, oController]
                    });

                    oController.navDownButton = new sap.m.Button({
                        icon: "sap-icon://navigation-down-arrow",
                        visible: false,
                        tooltip: oController._getBundleText('Next'),
                        press: [oController.processItemSwitch, oController]
                    }).data("itemSwitch", "NEXT");
                    oController.navUpButton = new sap.m.Button({
                        icon: "sap-icon://navigation-up-arrow",
                        visible: false,
                        tooltip: oController._getBundleText('Previous'),
                        press: [oController.processItemSwitch, oController]
                    });
                }


                if (renderDynamicPage) {
                    pageControl = oController.prepareDynamicPageView();
                }
                else {
                    pageControl = oController.prepareSemanticPageView({
                        action: action,
                        parentSection: parentSection
                    });
                }

                if (!global.vui5.headerLess && !global.vui5.fromOtherApp && !oController._formDialog && !global.vui5.session.fromFioriLaunchpad && !mainModel.getProperty("/FULLSCREEN")) {
                    var oShell = new sap.ui.unified.Shell({
                        user: [new sap.ui.unified.ShellHeadUserItem({
                            showPopupIndicator: true,
                            press: [oController.processUserOptions, oController]
                        }).bindProperty("image", {
                            parts: [{
                                path: global.vui5.modelName + ">" + global.vui5.cons.modelPath.sessionInfo + "/USER_TEXT"
                            }],
                            formatter: commonUtils.getAvatarURI,
                            mode: sap.ui.model.BindingMode.OneWay
                        }).bindProperty("username", global.vui5.modelName + ">" + global.vui5.cons.modelPath.sessionInfo + "/USER_TEXT", null, sap.ui.model.BindingMode.OneWay)
                        ]
                    }).bindProperty("icon", global.vui5.modelName + ">" + global.vui5.cons.modelPath.sessionInfo + "/LLOGO", null, sap.ui.model.BindingMode.OneWay).addStyleClass("ushell");
                    oShell.addContent(pageControl);
                    return oShell;
                } else {
                    return pageControl;
                }

            },


            prepareDynamicPageView: function () {
                var oController = this, profileInfo, renderLineLayout = false, objectPageLayout, oBar, nextSectnFunction = {},
                    saveFunction = {}, cancelFunction = {};
                profileInfo = oController.getProfileInfo();

                if (oController.getProfileInfo()['UILYT'] === global.vui5.cons.layoutType.line) {
                    renderLineLayout = true;
                }

                if (renderLineLayout) {
                    if (profileInfo['UITYP'] === global.vui5.cons.UIType.worklist) {
                        objectPageLayout = oController._getObjectPageWithTabs();
                    }
                    else {
                        objectPageLayout = oController._getObjectPageContent();
                    }
                }
                else {
                    objectPageLayout = oController._getObjectPageWithTabs();
                }

                objectPageLayout.bindProperty("showFooter", {
                    parts: [{
                        path: global.vui5.modelName + ">/MESSAGES",
                    },
                    {
                        path: oController.modelName + ">/DOFUN"
                    }],
                    formatter: function (messages, functions) {
                        if (messages && messages.length > 0) {
                            return true;
                        }
                        saveFunction = underscoreJS.findWhere(functions, { 'FNCNM': global.vui5.cons.eventName.save, 'HIDFN': '' });
                        cancelFunction = underscoreJS.findWhere(functions, { 'FNCNM': global.vui5.cons.eventName.cancel, 'HIDFN': '' });
                        nextSectnFunction = underscoreJS.find(functions, function (dofunction) {
                            return dofunction['NXSCT'] !== "";
                        });

                        if (underscoreJS.isEmpty(saveFunction) &&
                            underscoreJS.isEmpty(cancelFunction) &&
                            underscoreJS.isEmpty(nextSectnFunction)) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    }
                });



                oBar = new sap.m.OverflowToolbar();

                oBar.bindAggregation("content", oController.modelName + ">/DOFUN", function (sid, oContext) {
                    var object = oContext.getObject();

                    if (object['FNCNM'] === global.vui5.cons.eventName.messageButton) {
                        return new sap.m.Button({
                            icon: "sap-icon://message-popup",
                            type: sap.m.ButtonType.Emphasized,
                            press: [oController._showMessages, oController]
                        }).bindProperty("visible", "mainModel>/MESSAGES",
                            Formatter.showPopupMessages, sap.ui.model.BindingMode.OneWay)
                            .bindProperty("text", "mainModel>/MESSAGES",
                                Formatter.popupMessagesText, sap.ui.model.BindingMode.OneWay);
                    }
                    else if (object['FNCNM'] === global.vui5.cons.eventName.toolBarSpacer) {
                        return new sap.m.ToolbarSpacer()
                    }
                    else {
                        return oController._prepareButtonControl(object, "");
                    }
                });

                objectPageLayout.setFooter(oBar);

                if (oController.getApplicationIdentifier() === global.vui5.cons.applicationIdentifier.overviewPage) {
                    objectPageLayout.addStyleClass("ovpObjectPageLayout");
                }

                oController.ObjectPageLayout = objectPageLayout;
                return objectPageLayout;
            },

            prepareDynamicHeadingContent: function () {
                var oController = this;
                return new sap.m.FlexBox({
                    fitContainer: true,
                    wrap: sap.m.FlexWrap.Wrap,
                    items: [new sap.m.FlexBox({
                        fitContainer: true,
                        wrap: sap.m.FlexWrap.Wrap,
                        items: [new sap.m.Title({
                            text: {
                                path: oController.modelName + ">" + oController._getPath() + "OBHDR_TITLE/TITLE"
                            },

                        }).addStyleClass("sapUiTinyMarginEnd"),
                        new sap.m.FlexBox({
                            fitContainer: true,
                            wrap: sap.m.FlexWrap.Wrap,
                            items: [new sap.m.Text({
                                text: {
                                    path: oController.modelName + ">" + oController._getPath() + "OBHDR_TITLE/SUBTITLE"
                                },
                            }).addStyleClass("sapUiTinyMarginEnd")]
                        })]
                    }).addStyleClass("sapUiSmallMarginTop")]
                });
            },

            determineDynamicHeaderTitleVisiblity: function (response) {
                var oController = this, fixedSections = [], mainModel;
                mainModel = oController.getMainModel();

                if (response['DOFUN'] && response['SECTN']) {

                    fixedSections = underscoreJS.where(response['SECTN'], { 'FXSCT': 'X' });

                    if (global.vui5.fromOtherApp) {
                        mainModel.setProperty("/RENDER_DYNTITLE", true);
                    }
                    else if (response['DOFUN'].length > 0) {
                        mainModel.setProperty("/RENDER_DYNTITLE", true);
                    }
                    else if (fixedSections.length > 0) {
                        mainModel.setProperty("/RENDER_DYNTITLE", true);

                    }
                    else {
                        mainModel.setProperty("/RENDER_DYNTITLE", false);
                    }
                }
            },

            prepareDynamicHeaderTitle: function (cfg) {

                var oController = this, objectPageLayout, dynamicHeaderTitle, mainModel;
                objectPageLayout = cfg.objectPageLayout;

                mainModel = oController.getMainModel();

                if (!mainModel.getProperty("/DYNAMIC_PAGE")) {
                    return;
                }

                dynamicHeaderTitle = new sap.uxap.ObjectPageDynamicHeaderTitle({
                    visible: "{" + global.vui5.modelName + ">" + "/RENDER_DYNTITLE" + "}"
                });

                /*dynamicHeaderTitle.bindProperty("visible", {
                    path: global.vui5.modelName + ">" + "/RENDER_DYNTITLE",
                    formatter: function (value) {
                        
                        if (value === undefined) {
                            return true;
                        }
                        return value;
                    }
                })*/


                if (oController.getApplicationIdentifier() === global.vui5.cons.applicationIdentifier.overviewPage) {
                    dynamicHeaderTitle.addStyleClass("ovpNoMargin");
                }
                dynamicHeaderTitle.setAreaShrinkRatio("0:1.6:1.6");
                dynamicHeaderTitle.setExpandedHeading(oController.prepareDynamicHeadingContent());
                dynamicHeaderTitle.setSnappedHeading(oController.prepareDynamicHeadingContent());

                dynamicHeaderTitle.bindAggregation("actions", oController.modelName + ">/DOFUN", function (sid, oContext) {
                    return oController._prepareButtonControl(oContext.getObject(), "", "", "", true);
                });


                objectPageLayout.setHeaderTitle(dynamicHeaderTitle);
            },

            prepareBreadCrumbs: function (dynamicPageTitleControl) {
                var oController = this, mainModel, link, breadCrumb;

                mainModel = oController.getMainModel();

                breadCrumb = new sap.m.Breadcrumbs();
                underscoreJS.each(mainModel.getProperty("/BCLINKS"), function (bclink) {
                    link = new sap.m.Link({
                        text: bclink['TEXT'],
                        press: function (oEvent) {
                            oEvent.mParameters['parentSection'] = oEvent.getSource().data("parentSection");
                            oController.processBreadCrumbLink(oEvent);
                        }
                    }).data("parentSection", bclink['PASCT']);

                    breadCrumb.addLink(link);
                });

                dynamicPageTitleControl.setBreadcrumbs(breadCrumb);

            },

            prepareFixedSections: function (cfg) {

                var oController = this, mainModel, objectPageLayout, contextObject, variantSection, variantSectionConfig;
                objectPageLayout = cfg.objectPageLayout;
                contextObject = cfg.contextObject;

                variantSection = oController.getSectionBy("DAPPT", global.vui5.cons.propertyType.variant) || {};

                variantSectionConfig = oController.sectionConfig[variantSection['SECTN']] || {};

                mainModel = oController.getMainModel();


                if (contextObject['DAPPT'] === global.vui5.cons.propertyType.snappingHeader) {

                    objectPageLayout.getHeaderTitle().destroyHeading();

                    objectPageLayout.destroyHeaderContent()

                    oController.prepareNavActions(objectPageLayout.getHeaderTitle());
                    oController.showPanelContent(contextObject['SECTN']);


                    oController.prepareBreadCrumbs(objectPageLayout.getHeaderTitle());

                } else if (contextObject['DAPPT'] === global.vui5.cons.propertyType.selections) {

                    if (!oController.sectionRef[contextObject['SECTN']] || oController._preparePageContent) {
                        oController.showPanelContent(contextObject['SECTN']);
                        var headerContent = oController.sectionRef[contextObject['SECTN']];
                        headerContent.oFilter.setPersistencyKey("");
                        headerContent.oFilter.addStyleClass("vuiFilterBar");
                        headerContent.oFilter.setUseToolbar(false);


                        objectPageLayout.getHeaderTitle().setHeading(headerContent.oFilter._oVariantManagement);

                        if (variantSectionConfig) {
                            headerContent.oFilter._oVariantManagement.setVisible(variantSectionConfig.attributes[global.vui5.cons.attributes.hideVariantSave] !== 'X');
                        }

                        headerContent.addStyleClass('paddingAdjust');
                        objectPageLayout.destroyHeaderContent();

                        oController.prepareNavActions(objectPageLayout.getHeaderTitle());
                        objectPageLayout.addHeaderContent(headerContent);



                    }
                } else if (contextObject['DAPPT'] === global.vui5.cons.propertyType.variant) {
                    oController.showPanelContent(contextObject['SECTN']);
                }
                else if (contextObject['DAPPT'] === global.vui5.cons.propertyType.availsHeader) {

                    oController.showPanelContent(contextObject['SECTN']);
                    objectPageLayout.addStyleClass("availsNoPadding");
                    objectPageLayout.addHeaderContent(oController.sectionRef[contextObject['SECTN']]);
                }

            },

            prepareNavActions: function (dynamicPageTitleControl) {
                var oController = this, mainModel, navBackButton, parentSection, doFunctions, continueFunction = {};

                mainModel = oController.getMainModel();

                if (!mainModel.getProperty("/DYNAMIC_PAGE")) {
                    return;
                }


                parentSection = oController.getCurrentSubEntity();

                if (parentSection['section']) {
                    doFunctions = [];
                    doFunctions = oController.getCurrentModel().getProperty("/DOFUN");
                    if (doFunctions) {
                        continueFunction = underscoreJS.findWhere(doFunctions, { 'FNCNM': global.vui5.cons.eventName.continue });
                        if (continueFunction) {
                            continueFunction['HIDFN'] = 'X';
                            oController.onNavAction = continueFunction;
                        }
                    }
                }


                if (dynamicPageTitleControl instanceof sap.f.DynamicPageTitle &&
                    underscoreJS.isEmpty(dynamicPageTitleControl.getNavigationActions())) {

                    if (!global.vui5.session.fromFioriLaunchpad) {
                        navBackButton = new sap.m.Button({
                            type: sap.m.ButtonType.Back,
                            text: (continueFunction && continueFunction['DESCR']) || oController._getBundleText("Back"),
                            visible: oController.prepareNavBackButton(),
                            press: function () {
                                oController.processAction("", oController.onNavAction);
                            }
                        });

                        dynamicPageTitleControl.addNavigationAction(navBackButton);
                    }

                    dynamicPageTitleControl.addNavigationAction(oController.navDownButton);
                    dynamicPageTitleControl.addNavigationAction(oController.navUpButton);
                }
            },

            /***Rel 60E SP7 - Dynamic Page Approach - End ***/
            prepareSemanticPageView: function (cfg) {

                var oController = this,
                    contextObject,
                    navButtonVisible = false,
                    lineLayout = false,
                    tabBar,
                    preparePanelContent = true,
                    doFunctions,
                    continueFunction;

                var action, parentSection;

                action = cfg.action;
                parentSection = cfg.parentSection;
                var mainModel = oController.getOwnerComponent().getModel(global.vui5.modelName);
                var profileInfo = oController.getProfileInfo();
                action = action === undefined ? {} : action;
                var popupLayoutInfo = action['UILYT'];

                lineLayout = underscoreJS.isObject(action) ? popupLayoutInfo === global.vui5.cons.layoutType.line || popupLayoutInfo === "" :
                    oController.getProfileInfo()['UILYT'] === global.vui5.cons.layoutType.line || oController.getLoadFullPage();

                if (mainModel.getProperty("/FULLSCREEN") && !oController._formDialog) {
                    lineLayout = true;
                }

                navButtonVisible = !!(global.vui5.fromOtherApp || global.vui5.session.fromFioriLaunchpad || (this.currentRoute === global.vui5.cons.route.infocus && (oController.getDrillDownBuffer().length > 0 ||
                    oController.getPageNavBuffer().length > 0)));

                if (!oController._formDialog && !mainModel.getProperty("/FULLSCREEN")) {
                    var pageObject = oController.pageObject = new sap.m.semantic.FullscreenPage({
                        title: oController.getBindingExpression('pageTitle'),
                        showNavButton: navButtonVisible,
                        messagesIndicator: oController.msgBtn,
                        customHeaderContent: [oController.navUpButton, oController.navDownButton],
                        navButtonPress: function (oEvent) {
                            if (parentSection['section']) {
                                doFunctions = [];
                                doFunctions = oController.getCurrentModel().getProperty("/DOFUN");
                                if (doFunctions) {
                                    continueFunction = underscoreJS.findWhere(doFunctions, { 'FNCNM': global.vui5.cons.eventName.continue });
                                    if (continueFunction) {
                                        oController.onNavAction = continueFunction;
                                    }
                                }
                            }

                            oController.processAction("", oController.onNavAction);

                        }
                    });



                } else {
                    var pageObject;
                    var continue_action = oController._popupContn = {
                        "FNCNM": global.vui5.cons.eventName.continue,
                        "RQTYP": global.vui5.cons.reqTypeValue.post,
                        "ACTYP": global.vui5.cons.actionType.back,
                    };
                    var cancel_action = {
                        "FNCNM": global.vui5.cons.eventName.cancel,
                        "RQTYP": global.vui5.cons.reqTypeValue.get,
                        "ACTYP": global.vui5.cons.actionType.cancel
                    };

                    var check_action = {};

                    if (mainModel.getProperty("/FULLSCREEN") && oController.getCurrentModel()) {
                        doFunctions = oController.getCurrentModel().getProperty("/DOFUN");
                        if (doFunctions) {
                            check_action = underscoreJS.findWhere(doFunctions, {
                                'FNCNM': global.vui5.cons.eventName.check
                            }) ||
                                underscoreJS.findWhere(doFunctions, {
                                    'FNCNM': global.vui5.cons.eventName.chck
                                });
                        }
                    }


                    var continueUrlParams = {},
                        cancelUrlParams = {};

                    if (action['FNCNM']) {
                        continueUrlParams[global.vui5.cons.params.modal_action] = action['FNCNM'];
                        cancelUrlParams[global.vui5.cons.params.modal_action] = action['FNCNM'];
                    }

                    var continueBtn = new sap.m.Button({
                        type: sap.m.ButtonType.Emphasized,
                        text: oController._getBundleText('Continue'),
                        press: oController.processAction.bind(oController, "", continue_action, "", continueUrlParams)
                    }).bindProperty("visible", {
                        parts: [
                            {
                                path: global.vui5.modelName + ">/FULLSCREEN"
                            },
                            {
                                path: oController.modelName + ">/POPUP_PROP/DISOL"
                            }
                        ],
                        formatter: function (fullscreen, displayOnly) {
                            return displayOnly ? displayOnly != "X" : fullscreen == false;
                            // return (fullscreen == false || !displayOnly ) ?
                            // true : false
                        },
                        mode: sap.ui.model.BindingMode.OneWay
                    });
                    var oMessageBtn = new sap.m.Button({
                        icon: "sap-icon://message-popup",
                        type: "Emphasized",
                        press: [oController._showMessages, oController]
                    })
                        .bindProperty("visible", "mainModel>/POPUP_MESSAGES",
                            Formatter.showPopupMessages, sap.ui.model.BindingMode.OneWay)
                        .bindProperty("text", "mainModel>/POPUP_MESSAGES",
                            Formatter.popupMessagesText, sap.ui.model.BindingMode.OneWay);
                    var cancelBtn = new sap.m.Button({
                        // text: oController._getBundleText('Cancel'),
                        visible: mainModel.getProperty("/FULLSCREEN") === false,
                        press: oController.processAction.bind(oController, "", cancel_action, "", cancelUrlParams)
                    }).bindProperty("text", {
                        parts: [
                            {
                                path: oController.modelName + ">/POPUP_PROP/FLVIW"
                            },
                            {
                                path: oController.modelName + ">/POPUP_PROP/DISOL"
                            }
                        ],
                        formatter: function (fullscreen, displayOnly) {
                            if (fullscreen && displayOnly) {
                                return oController._getBundleText('Back');
                            } else if (fullscreen && !displayOnly) {
                                return oController._getBundleText("DiscardChangesBtn");
                            } else if (!fullscreen) {
                                return oController._getBundleText('Cancel');
                            }
                        },
                        mode: sap.ui.model.BindingMode.OneWay
                    });

                    var checkBtn = new sap.m.Button({
                        text: oController._getBundleText("Check"),
                        visible: mainModel.getProperty("/DOCUMENT_MODE") !== global.vui5.cons.mode.display && mainModel.getProperty("/FULLSCREEN") && !underscoreJS.isEmpty(check_action),
                        press: oController.processAction.bind(oController, mainModel.getProperty("/FULLSCREEN_SECTN"), check_action)
                    });

                    var oBar = new sap.m.Bar({
                        contentLeft: [oMessageBtn]
                    });

                    if (!mainModel.getProperty("/FULLSCREEN") || oController._formDialog) {
                        oBar.bindAggregation("contentRight", oController.modelName + ">/" + global.vui5.cons.nodeName.popupFunctions, function (sid, oContext) {
                            return oController._prepareButtonControl(oContext.getObject(), "", false, true);
                        });
                    }
                    else {
                        oBar.addContentRight(checkBtn);
                    }
                    pageObject = oController.pageObject = new sap.m.Page({
                        showHeader: false,
                        showSubHeader: false,
                        footer: oBar
                    });
                    pageObject.setModel(mainModel, "mainModel");
                    // pageObject.setModel(oController.getCurrentModel(),
                    // oController.modelName);

                }
                if (!oController._formDialog && !mainModel.getProperty("/FULLSCREEN")) {
                    pageObject.bindAggregation("customFooterContent", oController.modelName + ">/DOFUN", function (sid, oContext) {
                        return oController._prepareButtonControl(oContext.getObject(), "");
                    });
                }
                if (lineLayout) {
                    var path = oController._getPath(true); // copy popup
                    if (oController.getProfileInfo()['UITYP'] == global.vui5.cons.UIType.worklist ||
                        popupLayoutInfo === "" || oController.getLoadFullPage() || mainModel.getProperty("/FULLSCREEN")) {
                        pageObject.bindAggregation("content", oController.modelName + ">" + path, function (sid, oContext) {
                            var contextObject = oContext.getObject();
                            //*****Rel 60E_SP7
                            /*if (!contextObject['FXSCT'] && contextObject['HDSCT']) {
                                oController.sectionRef[contextObject['SECTN']] = new sap.m.Text({
                                    text: "",
                                    visible: false
                                });
                            } else {*/
                            //*****
                            oController.showPanelContent(contextObject['SECTN']);
                            if (!underscoreJS.isEmpty(contextObject['FILTER'])) {
                                var filter = oController.addFilterContent(contextObject);
                                if (!underscoreJS.isEmpty(filter)) {
                                    underscoreJS.each(filter, function (ob, i) {
                                        pageObject.addContent(ob);

                                    });
                                }
                            }
                            //}
                            // oController.sectionRef[contextObject['SECTN']].setVisible(contextObject['HDSCT']
                            // === "");
                            return oController.sectionRef[contextObject['SECTN']];
                        });
                    } else {
                        oController.ObjectPageLayout = oController._getObjectPageContent();
                        pageObject.addContent(oController.ObjectPageLayout);
                    }
                } else if (popupLayoutInfo ? popupLayoutInfo === global.vui5.cons.layoutType.tab : oController.getProfileInfo()['UILYT'] == global.vui5.cons.layoutType.tab) {
                    oController._prepareTabBarControl();
                } else if (popupLayoutInfo ? popupLayoutInfo === global.vui5.cons.layoutType.pageWithTabs : oController.getProfileInfo()['UILYT'] == global.vui5.cons.layoutType.pageWithTabs) {

                    var objectPageLayout = oController.ObjectPageLayout = oController._getObjectPageWithTabs();
                    pageObject.addContent(objectPageLayout);
                }

                return pageObject;
            },
            processResultNode: function (response) {
                var oController = this,
                    mainModel,
                    result,
                    currentModel,
                    profileInfo = {},
                    action = {};

                mainModel = oController.getMainModel();
                currentModel = oController.getCurrentModel();
                profileInfo['UIPRFINFO'] = oController.getProfileInfo() || {};
                /* Clear */
                mainModel.setProperty("/REFRESH_DATA", '');

                if (response && response['RESULT']) {
                    result = response['RESULT'];

                    mainModel.setProperty("/DOCUMENT_MODE", result['DOCUMENT_MODE']);
                    mainModel.setProperty("/DATA_CHANGED", result['DATA_CHANGED']);
                    mainModel.setProperty("/DOCUMENT_ERRORS", result['ERROR']);
                    mainModel.setProperty("/REFRESH_DATA", result['REFRESH_DATA']);
                    mainModel.setProperty("/DOWNLOAD_DATA", result['DOWNLOAD_DATA']);
                    mainModel.setProperty("/REFRESH_METADATA", result['REFRESH_METADATA']);
                    mainModel.setProperty("/DRILLDOWN_ROWID", result['DRILLDOWN_ROWID']);
                    mainModel.setProperty("/LOAD_FULLPAGE", result['LOAD_FULLPAGE']);
                    mainModel.setProperty("/COLLAPSE_HEADER", result['COLLAPSE_HEADER']);

                    /*if (result['COLLAPSE_HEADER'] &&
                            oController.objectPageLayout &&
                            oController.objectPageLayout._handleDynamicTitlePress) {
                        oController.objectPageLayout._handleDynamicTitlePress();
                    }*/

                    // mainModel.setProperty("/CLOSE_MODAL",
                    // result['CLOSE_MODAL']);
                    if (profileInfo && profileInfo['UIPRFINFO']['OBJID'] != response['RESULT']['OBJID']) {
                        profileInfo['UIPRFINFO']['OBJID'] = response['RESULT']['OBJID'];
                        oController.setProfileInfo(profileInfo);


                    }

                    if (underscoreJS.isEmpty(response['RESULT']['HOLD_MESSAGES'])) {
                        mainModel.setProperty("/MESSAGES", result['MESSAGES']);
                        oController._messagesPrepare(result['MESSAGES']);
                    }

                    if (((oController._popup && oController._popup.isOpen() || oController.fullScreenPopup && oController.fullScreenPopup.isOpen()) && result['MESSAGES']) ||
                        (oController.getCurrentModel() && !underscoreJS.isEmpty(oController.getCurrentModel().getProperty("/_VUI_QE")))) {
                        mainModel.setProperty("/POPUP_MESSAGES", result['MESSAGES']);
                    }


                    if (response['RESULT']['SELECTED_SECTION']) {
                        currentModel.setProperty("/SELECTED_SECTION", response['RESULT']['SELECTED_SECTION']);
                    }


                    // /oController._popupClose(result['CLOSE_MODAL']);
                }
            },
            processUserOptions: function (oEvent) {
                var oController = this;
                var oActionSheet = new sap.m.ActionSheet({
                    buttons: [
                        new sap.m.Button({
                            icon: "sap-icon://person-placeholder",
                            text: oController._getBundleText("UserPreferences"),
                            press: [oController.processUserPref, oController]
                        }).bindProperty("visible", global.vui5.modelName + ">/SHUPF", function (shupf) {
                            return underscoreJS.isEmpty(shupf) ? false : true;
                        }, sap.ui.model.BindingMode.OneWay),
                        new sap.m.Button({
                            icon: "sap-icon://log",
                            text: oController._getBundleText("LogOut"),
                            press: function () {
                                sap.m.MessageBox.show(oController._getBundleText("LogOut?"), {
                                    icon: sap.m.MessageBox.Icon.QUESTION,
                                    title: oController._getBundleText("Confirmation"),
                                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                                    onClose: function (oAction) {
                                        if (oAction == sap.m.MessageBox.Action.YES) {
                                            oController._logOff();
                                        }
                                    }
                                });
                            }
                        })
                    ]
                });
                oActionSheet.openBy(oEvent.getSource());
            },
            processUserPref: function (oEvent) {
                var oController = this;
                var mainModel = oController.getModel(global.vui5.modelName);
                oController._userPrefPopup = new sap.m.Dialog({
                    showHeader: false,
                    contentHeight: "40%",
                    contentWidth: "42%",
                    beginButton: [new sap.m.Button({
                        text: oController._getBundleText("Save"),
                        press: [oController.processThemeSave, oController]
                    }).bindProperty("enabled", global.vui5.modelName + ">/TEMP_THEME", function (theme) {
                        var selTheme = mainModel.getProperty(global.vui5.cons.modelPath.sessionInfo + "/THEME");
                        if (theme == selTheme || underscoreJS.isEmpty(theme)) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    }, sap.ui.model.BindingMode.OneWay)
                    ],
                    endButton: [new sap.m.Button({
                        text: oController._getBundleText("Cancel"),
                        press: function () {
                            mainModel.setProperty("/TEMP_THEME", "");
                            oController._userPrefPopup.close();
                        }
                    })
                    ]
                }).setModel(mainModel, global.vui5.modelName);
                oController.processUserPrefList();
                oController._userPrefPopup.open();
            },
            processUserPrefList: function (oEvent) {
                var oController = this;
                var mainModel = oController.getModel(global.vui5.modelName);
                var userPref = new global.vui5.ui.controls.UserPreferences()
                    .setModel(mainModel, "mainModel");
                userPref.processThemes = function (oEvent) {
                    oController.processThemes(oEvent);
                }
                userPref.listPrepare();

                oController._userPrefPopup.setCustomHeader(new sap.m.Bar({
                    contentMiddle: [new sap.m.Text({
                        text: oController._getBundleText("UserPreferences")
                    })]
                }));
                oController._userPrefPopup.removeAllContent();
                oController._userPrefPopup.insertContent(userPref);
            },
            processThemes: function (oEvent) {
                var oController = this;
                var mainModel = oController.getModel(global.vui5.modelName);

                var oBar = new sap.m.Bar({
                    contentLeft: [new sap.m.Button({
                        icon: "sap-icon://nav-back",
                        press: [oController.processUserPrefList, oController]
                    })],
                    contentMiddle: [new sap.m.Text({
                        text: oController._getBundleText("Themes")
                    })]
                });
                var oList = new sap.m.List({
                    mode: sap.m.ListMode.SingleSelectLeft,
                    selectionChange: [oController.processThemeChange, oController]
                }).setModel(mainModel, global.vui5.modelName);
                oList.bindAggregation("items", global.vui5.modelName + ">" + global.vui5.cons.modelPath.themes, function (sId, oContext) {
                    var dataPath1 = global.vui5.modelName + ">" + global.vui5.cons.modelPath.sessionInfo + "/THEME";
                    var dataPath2 = global.vui5.modelName + ">" + oContext.sPath + "/ID";
                    return new sap.m.StandardListItem({
                        title: oContext.getObject("NAME")
                    }).bindProperty("selected", {
                        parts: [
                            {
                                path: dataPath1
                            },
                            {
                                path: dataPath2
                            }
                        ],
                        formatter: function (selTheme, theme) {
                            var tempTheme = mainModel.getProperty("/TEMP_THEME");
                            if (!underscoreJS.isEmpty(tempTheme)) {
                                selTheme = tempTheme;
                            }
                            if (selTheme == theme) {
                                return true;
                            }
                            else {
                                return false;
                            }
                        },
                        mode: sap.ui.model.BindingMode.OneWay
                    });
                });
                oController._userPrefPopup.setCustomHeader(oBar);
                oController._userPrefPopup.removeAllContent();
                oController._userPrefPopup.insertContent(oList);
            },
            processThemeChange: function (oEvent) {
                var oController = this;
                var mainModel = oController.getModel(global.vui5.modelName);
                var path = oEvent.getSource().getSelectedContextPaths()[0];
                var newTheme = mainModel.getProperty(path);
                mainModel.setProperty("/TEMP_THEME", newTheme['ID']);
            },
            processThemeSave: function (oEvent) {
                var objConfig;
                var oController = this,
                    params = {};
                var mainModel = oController.getModel(global.vui5.modelName);
                var theme = mainModel.getProperty("/TEMP_THEME");
                mainModel.setProperty("/TEMP_THEME", "");
                oController._userPrefPopup.close();
                mainModel.setProperty(global.vui5.cons.modelPath.sessionInfo + '/THEME', theme);
                params['THEME'] = theme;
                commonUtils.applyTheme(theme);

                var themeName = underscoreJS.findWhere(mainModel.getProperty(global.vui5.cons.modelPath.themes), {
                    'ID': theme
                });
                sap.m.MessageToast.show(oController._getBundleText("Theme") + " " + themeName['NAME'] + " " + oController._getBundleText("applied"));

                var action = {
                    "FNCNM": global.vui5.cons.eventName.themeSave,
                    "RQTYP": global.vui5.cons.reqTypeValue.post,
                    hideLoader: false
                };

                objConfig = {
                    method: action['RQTYP'] === global.vui5.cons.reqTypeValue.post ? global.vui5.cons.reqType.post : global.vui5.cons.reqType.get,
                    action: action['FNCNM'],
                    actionRef: action,
                    dataArea: "",
                    urlParams: params,
                    sectionId: "",
                    context: oController.currentRoute,
                    hideLoader: !!action.hideLoader
                };

                return oController.callServer(objConfig);
            },
            processLaunchNavigation: function (routingUrl, replace) {
                var oController = this;
                var mainModel = oController.getModel(global.vui5.modelName);
                mainModel.setProperty("/SHUPF", "");
                oController.getRouter().navTo(global.vui5.cons.route.launch);
            },
            processNavigation: function (routingUrl, replace) {
                var oController = this;

                if (oController.getApplicationIdentifier() == "vzdshbd") {
                    oController.getRouter().navTo(global.vui5.cons.route.dashboard, routingUrl, replace);
                } else {
                    oController.getRouter().navTo(global.vui5.cons.route.infocus, routingUrl, replace);
                }
            },
            prepareRoutingUrl: function (initCall, fromPageNavigation, docNo, mode, subEntity, selSection) {
                var oController = this, routingPattern, profileInfo, params, dbidIndex;

                profileInfo = oController.getProfileInfo();
                if (oController.getApplicationIdentifier() === global.vui5.cons.applicationIdentifier.dashboard) {

                    if (!profileInfo['VZDBD']) {
                        params = location.hash.split("/");
                        dbidIndex = params.indexOf(global.vui5.cons.applicationIdentifier.dashboard);
                        routingPattern = {
                            'entity': params[dbidIndex + 1].split("?")[0],
                            'all*': ''
                        };
                    }
                    else {
                        routingPattern = {
                            'entity': profileInfo['VZDBD'],
                            'all*': ''
                        };
                    }

                    if (initCall) {
                        if (oController.getUrlParamsFromUrl()) {
                            routingPattern['all*'] += '/' + oController.getUrlParamsFromUrl();
                        }

                    }
                    return routingPattern;
                } else {
                    routingPattern = {
                        'appid': '',
                        'all*': ''
                    };
                }
                var profileInfo = oController.getProfileInfo() || {};
                switch (profileInfo['UITYP']) {
                    case global.vui5.cons.UIType.infocus:
                        routingPattern['all*'] += global.vui5.cons.applicationContext.document;
                        break;
                    case global.vui5.cons.UIType.listWithProcessing:
                        routingPattern['all*'] += global.vui5.cons.applicationContext.listProcess;
                        break;
                    default:
                        routingPattern['all*'] += global.vui5.cons.applicationContext.list;
                        break;
                }

                if (docNo) {
                    routingPattern['all*'] += '/' + docNo;
                } else if (oController.getDocumentNumberFromUrl()) {
                    routingPattern['all*'] += '/' + oController.getDocumentNumberFromUrl();
                }

                if (subEntity) {
                    routingPattern['all*'] += '/' + subEntity;
                }


                if (initCall) {
                    if (oController.getUrlParamsFromUrl()) {
                        routingPattern['all*'] += '/' + oController.getUrlParamsFromUrl();
                    }

                } else {
                    if (mode) {
                        mode = global.vui5.cons.modeValue[mode] || global.vui5.cons.modeText.display;
                        routingPattern['all*'] += '?mode=' + mode;
                        if (oController.getQueryParam("tab") && (!fromPageNavigation || oController._itemSwitch)) {
                            routingPattern['all*'] += '&tab=' + oController.getQueryParam("tab");
                        }
                        //*****Rel 60E_SP7
                        else if (fromPageNavigation && !underscoreJS.isEmpty(selSection)) {
                            routingPattern['all*'] += '&tab=' + selSection;
                        }
                        //*****
                        /* subtab */
                        if (oController.getQueryParam("subsectn") && !fromPageNavigation) {
                            routingPattern['all*'] += '&subsectn=' + oController.getQueryParam("subsectn");
                        }
                    }
                }

                routingPattern['appid'] = oController.getApplicationIdentifier();

                return routingPattern;
            },

            processSectionChange: function (action) {
                var oController = this, sections, currentSection,
                    lineLayout,
                    currentTab,
                    promise,
                    subEntities,
                    queryParams;
                lineLayout = oController.getProfileInfo()['UILYT'] === global.vui5.cons.layoutType.line;
                if (lineLayout || !action['NXSCT']) {
                    return;
                }

                currentTab = oController.getQueryParam("tab");
                if (!currentTab) {
                    currentTab = underscoreJS.findWhere(oController.getSections(), {
                        'HDSCT': ''
                    })['SECTN'];
                }

                if (oController.objectPageLayout) {
                    sections = oController.objectPageLayout.getSections();
                    currentSection = underscoreJS.find(sections, function (sectn) {
                        if (sectn.data("id") === action['NXSCT']) {
                            return sectn;
                        }
                    });

                    if (currentSection) {
                        jQuery.sap.delayedCall(750, oController.objectPageLayout.getAggregation('_anchorBar'), oController.objectPageLayout.getAggregation('_anchorBar')._requestScrollToSection, [currentSection.getId(), action]);
                        //oController.objectPageLayout.getAggregation('_anchorBar')._requestScrollToSection(currentSection.getId(), action);
                    }
                } else if (oController.tabBar) {
                    promise = oController._UpdateChanges(currentTab, action);
                    if (promise && promise.then) {
                        promise.then(function () {
                            subEntities = oController.routeParams["all*"].split('?')[0];
                            queryParams = oController.getQueryParams() || {};
                            queryParams['tab'] = action['NXSCT'];
                            oController.routeParams["all*"] = commonUtils.addQueryParams(subEntities, jQuery.param(queryParams));
                            oController._updateTabBarAggregations = true;
                            oController.getRouter().navTo(oController.currentRoute, oController.routeParams, true);
                            oController.tabBar.setSelectedKey(action['NXSCT']);
                        });
                    }
                }


            },
            processOnAddNextBehvr: function (sectionID, actionObject) {
                var oController = this;
                var promise = oController._UpdateChanges(sectionID);
                promise.then(function () {

                    oController.processAction(sectionID, actionObject)
                })
            },

            /***Rel 60E SP7 - QA #12546 - Handling Double Click on Buttons - Start ***/
            processAction: function (sectionID, actionObject, rowData, urlParams, skipUpdate) {
                var oController = this, objDefer = $.Deferred(), promise;
                commonUtils.debounce(oController.actionProcessing.bind(this, sectionID, actionObject, rowData, urlParams, skipUpdate), 400, actionObject).then(function (response) {
                    objDefer.resolve(response);
                }).fail(function (response) {
                    objDefer.reject(response);
                });

                return objDefer.promise();
            },


            actionProcessing: function (sectionID, actionObject, rowData, urlParams, skipUpdate) {
                var oController = this,
                    promise,
                    objDefer = $.Deferred(), bPreventDefault = false;
                var action = $.extend({}, actionObject);
                if (underscoreJS.isEmpty(action)) {
                    return false;
                }

                if (oController[global.vui5.ui.callBack.processAction] instanceof Function) {
                    bPreventDefault = oController[global.vui5.ui.callBack.processAction].call(oController, {
                        sectionID: sectionID,
                        actionObject: actionObject,
                        rowData: rowData,
                        urlParams: urlParams

                    });

                    if (bPreventDefault) {
                        objDefer.resolve();
                        return objDefer.promise();
                    }
                }


                //*****Rel 60E_SP6                
                if (!underscoreJS.isEmpty(action['MNITM']) && !underscoreJS.isEmpty(urlParams) && urlParams['$SELMNITM']) {
                    var selMenuitem = underscoreJS.findWhere(action['MNITM'], { NAME: urlParams['$SELMNITM'] });
                    if (selMenuitem && !underscoreJS.isEmpty(selMenuitem['ACTYP'])) {
                        action['ACTYP'] = selMenuitem['ACTYP'];
                    }
                }
                //*****

                if (action['FNCNM'] === global.vui5.cons.eventName.quickEntry) {
                    return oController.processQuickEntry({
                        sectionID: sectionID,
                        action: actionObject
                    });
                }
                else if (action['FNCNM'] === global.vui5.cons.eventName.massEditApply) {
                    return oController.processMassEdit({
                        sectionID: sectionID,
                        action: actionObject,
                        urlParams: urlParams
                    });
                }
                if (oController.inputChangeDefer) {
                    oController.inputChangeDefer.done(function () {
                        if (oController.inputChangeDefer.state() === "resolved") {
                            oController.inputChangeDefer = undefined;
                            oController.processAction(sectionID, actionObject, rowData, urlParams).then(function () {
                                objDefer.resolve();
                            }).fail(function () {
                                objDefer.reject();
                            });
                        } else {
                            oController.inputChangeDefer = undefined;
                            objDefer.reject();
                        }


                    });

                    return objDefer.promise();
                }
                /*When we click on Add Next DMR team is preparing Dynamic Section for the details Section 
                  so if the section is empty we fetch the section from determineDataareasToUpdate but it is giving Dynamic section so in the URL the section is getting changed  
                  So In case of Add Function Behaviour we have pass the section which we have stored in FNBVR_OBJ Model
                  */
                if (underscoreJS.isEmpty(sectionID) && oController.getMainModel().getProperty("/FNBVR_OBJ")) {
                    if (action['FNCNM'] === oController.getMainModel().getProperty("/FNBVR_OBJ")['FNCNM'] &&
                        action['FNBVR'] === oController.getMainModel().getProperty("/FNBVR_OBJ")['FNBVR']) {
                        sectionID = oController.getMainModel().getProperty("/FNBVR_OBJ")['SECTN'];
                    }
                }
                var dmode = oController.getMainModel().getProperty("/DOCUMENT_MODE");
                var lineLayout = oController.getProfileInfo()['UILYT'] === global.vui5.cons.layoutType.line;


                if (action['FNCNM'] == global.vui5.cons.eventName.expand) {
                    oController._onExpandAction = action;
                }

                //             
                if (action['ACTYP'] != global.vui5.cons.actionType.cancel &&
                    action['FNCNM'] !== global.vui5.cons.eventName.addMoreRowsDelete &&
                    action['FNCNM'] != 'CANCEL' && oController.checkRequiredFields(sectionID)) {
                    objDefer.reject();
                    return objDefer.promise();
                }
                if (action['SVCFM'] && dmode !== global.vui5.cons.mode.display) {
                    oController._handleSaveConfirmation(sectionID, action, rowData, urlParams).then(function () {
                        objDefer.resolve();
                    }).fail(function () {
                        objDefer.reject();
                    });

                    return objDefer.promise();

                } else {
                    switch (action['ACTYP']) {
                        case global.vui5.cons.actionType.section_change:
                            oController.processSectionChange(action);
                            objDefer.resolve();
                            return objDefer.promise();
                            break;
                        case global.vui5.cons.actionType.drilldown:
                        case global.vui5.cons.actionType.back:
                            promise = oController._UpdateChanges(sectionID, action);
                            promise.then(function () {
                                switch (action['ACTYP']) {
                                    case global.vui5.cons.actionType.drilldown:
                                        if (lineLayout && oController.ObjectPageLayout) {
                                            oController._storeSectionKeys();
                                        }

                                        if (!sectionID) {
                                            sectionID = action['FNCNM'];
                                            action['FNCNM'] = global.vui5.cons.eventName.expand;
                                        }

                                        oController.processEvent(sectionID, action, rowData, urlParams, true).then(function () {
                                            oController.processDrillDownNavigation(sectionID, action, rowData);
                                        });
                                        break;

                                    case global.vui5.cons.actionType.back:
                                        promise = oController._checkDocumentChanges(action);
                                        promise.then(function () {
                                            oController.processEvent(sectionID, action, rowData, urlParams).then(function () {
                                                objDefer.resolve();
                                            });
                                        });
                                        break;

                                }
                            });
                            return objDefer.promise();
                            break;
                        case global.vui5.cons.actionType.refresh:
                        //*****Rel 60E_SP6 - QA #9419
                        case vui5.cons.actionType.filters:
                            //*****
                            if (lineLayout && oController.ObjectPageLayout) {
                                oController._storeSectionKeys();
                            }
                            return oController.processEvent(sectionID, action, rowData, urlParams, skipUpdate);
                            break;
                        //*****Rel 60E_SP6
                        case vui5.cons.actionType.outcome:
                            return oController.processOutcomePopup(sectionID, action, rowData, urlParams);
                            break;
                        //*****
                        default:
                            return oController.processEvent(sectionID, action, rowData, urlParams);
                    }
                }
            },

            /***Rel 60E SP7 - QA #12546 - Handling Double Click on Buttons - End ***/
            //*****Rel 60E_SP6
            processOutcomePopup: function (sectionID, action, rowData, params) {
                var oController = this, outcomes, contentData = [], continueUrlParams = {}, selection, title, type, actionFunc;
                var deferred = $.Deferred();
                var model = oController.getModel(this.modelName);
                var mainModel = oController.getMainModel();
                var fncnm = action['FNCNM'].split("__")[0];
                var type = action['FNCNM'].split("__")[1];
                //*****Rel 60E_SP6
                //var outcomeData = model.getProperty("/DATA/" + fncnm + "__DATA");
                var outcomeData = model.getProperty(oController._getPath() + fncnm + "__DATA");
                //*****
                if (type == "APR") {
                    type = sap.m.ButtonType.Accept;
                    title = oController._getBundleText('Approve');
                    outcomes = underscoreJS.where(outcomeData, { TYPE: global.vui5.cons.outcomeType.accept }) || [];
                }
                else if (type == "REJ") {
                    type = sap.m.ButtonType.Reject;
                    title = oController._getBundleText('Reject');
                    outcomes = underscoreJS.where(outcomeData, { TYPE: global.vui5.cons.outcomeType.reject }) || [];
                }

                var continue_action = {
                    "FNCNM": fncnm,
                    "RQTYP": global.vui5.cons.reqTypeValue.post,
                    "ACTYP": global.vui5.cons.actionType.refresh,
                };

                var oComment = new sap.m.TextArea({ rows: 4 });
                if (outcomes.length > 1 || outcomes.length == 0) {
                    var items = [];
                    underscoreJS.each(outcomes, function (obj) {
                        items.push(new sap.ui.core.Item({
                            key: obj['NAME'],
                            text: obj['VALUE']
                        }));
                    });
                    selection = new vui5.ui.controls.ComboBox({
                        width: "50%",
                        items: items
                    });

                    if (outcomes.length > 1) {
                        selection.setSelectedKey(outcomes[0]['NAME']);
                    }
                }
                else {
                    selection = new sap.m.Text({
                        text: outcomes[0]['VALUE']
                    }).data({ "key": outcomes[0]['NAME'] });
                }

                contentData.push(new sap.m.Label({ text: oController._getBundleText('Comment') }));
                contentData.push(oComment);
                contentData.push(new sap.m.Label({ text: oController._getBundleText('Outcome') }));
                contentData.push(selection);

                var simpleForm = new sap.ui.layout.form.SimpleForm({
                    layout: sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout,
                    editable: true,
                    emptySpanL: 0,
                    emptySpanM: 1,
                    columnsL: 2,
                    columnsM: 1,
                    singleContainerFullSize: false,
                    content: contentData
                });

                var pageObject = new sap.m.Page({
                    showHeader: false,
                    showSubHeader: false,
                    content: simpleForm,
                    footer: [new sap.m.Bar({
                        contentLeft: [new sap.m.Button({
                            icon: "sap-icon://message-popup",
                            type: sap.m.ButtonType.Emphasized,
                            press: [oController._showMessages, oController]
                        }).bindProperty("visible", "mainModel>/POPUP_MESSAGES",
                            Formatter.showPopupMessages, sap.ui.model.BindingMode.OneWay)],
                        contentRight: [
                            new sap.m.Button({
                                type: type,
                                text: title,
                                press: function (oEvt) {
                                    var comment = oComment.getValue(), selOutcome, error;
                                    if (outcomes.length > 1 || outcomes.length == 0) {
                                        if (selection.getSelectedItem()) {
                                            selOutcome = selection.getSelectedItem().getKey();
                                        }
                                        else {
                                            error = true;
                                        }
                                    }
                                    else {
                                        selOutcome = selection.data("key");
                                    }

                                    if (error) {
                                        selection.setValueState(sap.ui.core.ValueState.Error);
                                        selection.setValueStateText(oController._getBundleText('SelectOutcome'));
                                        oController.handleOutcomePopupMessages(oController._getBundleText('SelectOutcome'),
                                            sap.ui.core.MessageType.Error, selection.getId() + "/value");
                                        return;
                                    }
                                    else if (selection instanceof sap.m.ComboBox) {
                                        selection.setValueState(sap.ui.core.ValueState.None);
                                        selection.setValueStateText("");
                                        oController.handleOutcomePopupMessages("", "", selection.getId() + "/value");
                                    }

                                    outcomePopup.close();
                                    continueUrlParams[global.vui5.cons.params.comment] = comment;
                                    continueUrlParams[global.vui5.cons.params.outcome] = selOutcome;
                                    oController.processAction("", continue_action, "", continueUrlParams);
                                }
                            }),
                            new sap.m.Button({
                                text: oController._getBundleText('Cancel'),
                                press: function (oEvt) {
                                    mainModel.setProperty("/POPUP_MESSAGES", []);
                                    outcomePopup.close();
                                }
                            })]
                    })]
                });
                pageObject.setModel(mainModel, "mainModel");

                var outcomePopup = new sap.m.Dialog({
                    title: oController._getBundleText('SetOutcome'),
                    content: [pageObject],
                    resizable: true,
                    draggable: true,
                    contentHeight: "40%",
                    contentWidth: "35%",
                });

                if (!jQuery.support.touch) {
                    outcomePopup.addStyleClass("sapUiSizeCompact");
                }
                outcomePopup.open();

                deferred.resolve();
                return deferred.promise();
            },

            handleOutcomePopupMessages: function (text, type, target) {
                var oController = this;
                var mainModel = oController.getMainModel();
                mainModel.setProperty("/POPUP_MESSAGES", []);

                if (!this.oMessageProcessor) {
                    this.oMessageProcessor = new sap.ui.core.message.ControlMessageProcessor();
                }
                var oMessageManager = sap.ui.getCore().getMessageManager();
                oMessageManager.registerMessageProcessor(this.oMessageProcessor);
                var messageModel = oMessageManager.getMessageModel();
                var data = messageModel.getData();
                messageModel.setSizeLimit(global.vui5.cons.maxDataLimit);
                var messageData = underscoreJS.find(data, {
                    target: target
                });
                if (messageData) {
                    oMessageManager.removeMessages(messageData);
                }
                if (text != '') {
                    oMessageManager.addMessages(
                        new sap.ui.core.message.Message({
                            message: text,
                            type: type,
                            target: target,
                            processor: this.oMessageProcessor
                        })
                    );

                    var obj = { "MSGLI": text, "MSGTY": type };
                    mainModel.setProperty("/POPUP_MESSAGES", [obj]);
                }

            },
            //*****
            processDrillDownNavigation: function (sectionID, action, params) {
                var oController = this,
                    mainModel,
                    currentMode,
                    currentProfileInfo,
                    keys,
                    subEntity,
                    mainModel,
                    routingUrl,
                    replace,
                    fromPageNavigation = true;
                mainModel = oController.getMainModel();
                var section = oController.getSectionBy('SECTN', sectionID) || {};
                var sectionConfig = oController.sectionConfig[sectionID] || {};

                if (underscoreJS.isEmpty(params) || (params instanceof sap.ui.base.Event)) {
                    params = {};
                    params['ROWID'] = mainModel.getProperty("/DRILLDOWN_ROWID") || '$1';

                }

                oController.destroyFullScreenControl();

                currentMode = mainModel.getProperty("/DOCUMENT_MODE");
                currentProfileInfo = oController.getProfileInfo();

                keys = underscoreJS.isObject(params) ?
                    underscoreJS.pluck([params], sectionConfig.keyField || global.vui5.rowID) :
                    underscoreJS.pluck(params, sectionConfig.keyField || global.vui5.rowID);

                subEntity = oController.setSubEntity(sectionID, keys[0]);
                //*****Rel 60E_SP6
                if (oController.getProfileInfo()['UILYT'] === global.vui5.cons.layoutType.line) {
                    var sections = oController.getSections();
                    underscoreJS.each(sections, function (sectn) {
                        oController.dashboardBufferFill(sectn['SECTN']);
                    });
                }
                //*****
                /* Clear current Ref's */
                oController.clearRefs();

                /* navigation Up and down */
                if (section['RWDTL'] === global.vui5.cons.rowAsDetails.subPage &&
                    oController._onExpandAction &&
                    section['DAPPT'] !== global.vui5.cons.propertyType.treeTable) {
                    oController.processBufferRowIds(sectionID, params);
                }


                /* Buffering Drilldown Model */

                // fromPageNavigation = !oController._itemSwitch;
                replace = oController._itemSwitch || null;
                oController.bufferDrillDown(true, sectionID);

                oController._preparePageContent = true;
                oController._lastVisitedViewRef = oController.getView();
                if (action['FNBVR'] == global.vui5.cons.functionBehaviour.add) {
                    oController.getMainModel().setProperty("/FNBVR_OBJ", action);
                }
                // oController._config.lastActionRef = action;
                // oController._updateTabBarAggregations = true;

                // todo remove tab

                /*
            * In case of drilldown we have to remove the tab from URL , so
            * we are using fromPageNavigation in the below method to
            * acheive it
            */
                routingUrl = oController.prepareRoutingUrl(false, fromPageNavigation, currentProfileInfo['OBJID'], currentMode, subEntity);
                oController.processNavigation(routingUrl, replace);
            },
            processBufferRowIds: function (sectionId, params) {
                var oController = this, mainModel, currentModel, currentSectionData, sectionIndex, presentSection,
                    index, bufferRows = [],
                    object = {}, bufferCurrent = {}, selectedField, switchFieldName, currentRow;
                if (oController._itemSwitch) {
                    return;
                }
                presentSection = oController.getSectionBy('SECTN', sectionId);
                mainModel = oController.getMainModel();
                currentModel = oController.getCurrentModel();
                currentSectionData = currentModel.getProperty("/DATA/" + presentSection['DARID']);

                oController.switchField = presentSection['SWFLD'];
                sectionIndex = underscoreJS.indexOf(oController.getSections(), underscoreJS.findWhere(oController.getSections(), {
                    'SECTN': sectionId
                }));
                if (presentSection['SWFLD'] != "") {
                    selectedField = underscoreJS.findWhere(currentModel.getProperty("/SECTN/" + sectionIndex + "/FIELDS"), {
                        "FLDNAME": presentSection['SWFLD']
                    }) || {};


                    if (selectedField) {

                        switchFieldName = selectedField['SDSCR'] !== global.vui5.cons.fieldValue.value ? selectedField['TXTFL'] : selectedField['FLDNAME'];

                    }


                    underscoreJS.each(currentSectionData, function (obj, i) {
                        bufferRows.push({
                            'ROWID': obj['ROWID'],
                            'TEXT': obj[switchFieldName]
                        });
                    });
                    if (selectedField['LABEL']) {
                        bufferCurrent['SWFLD'] = selectedField['LABEL'];
                    } else {
                        bufferCurrent['SWFLD'] = oController.switchField;
                    }
                    bufferCurrent['ROWID'] = bufferRows;


                } else {
                    underscoreJS.each(currentSectionData, function (obj, i) {
                        bufferRows.push({
                            'ROWID': obj['ROWID'],
                            'TEXT': ""
                        });
                    });
                    bufferCurrent['SWFLD'] = oController.switchField;
                    bufferCurrent['ROWID'] = bufferRows;

                }

                currentRow = underscoreJS.findWhere(bufferRows, {
                    "ROWID": params['ROWID']
                });
                index = underscoreJS.indexOf(bufferRows, currentRow);
                if (bufferCurrent['SWFLD'] == "") {
                    oController._processItemSwitchVisibility(index);
                }
                mainModel.setProperty("/DRILLDOWNKEYS", bufferCurrent);

            },
            _processItemSwitchVisibility: function (currentIndex) {
                var oController = this,
                    mainModel,
                    lastIndex,
                    bufferRows;
                mainModel = oController.getModel(global.vui5.modelName);
                bufferRows = mainModel.getProperty("/DRILLDOWNKEYS/ROWID");
                lastIndex = underscoreJS.findLastIndex(bufferRows);
                if (!underscoreJS.isEmpty(bufferRows)) {
                    if (bufferRows.length == 1) {
                        oController.navUpButton.setVisible(false);
                        oController.navDownButton.setVisible(false);
                    } else {
                        if (currentIndex == 0) {
                            oController.navUpButton.setVisible(false);
                            oController.navDownButton.setVisible(true);
                        } else {
                            if (lastIndex == currentIndex) {
                                oController.navUpButton.setVisible(true);
                                oController.navDownButton.setVisible(false);
                            } else {
                                oController.navUpButton.setVisible(true);
                                oController.navDownButton.setVisible(true);
                            }
                        }
                    }
                }
            },

            processItemSwitch: function (oEvent) {
                var oController = this,
                    rowKey,
                    params = {},
                    mainModel,
                    bufferRows = [],
                    itemSwitch,
                    index,
                    processIndex,
                    switchIndex;
                itemSwitch = oEvent.getSource().data("itemSwitch");
                oController._itemSwitch = true;
                mainModel = oController.getModel(global.vui5.modelName);
                rowKey = oController.getCurrentSubEntity().key;
                bufferRows = mainModel.getProperty("/DRILLDOWNKEYS/ROWID");

                index = underscoreJS.indexOf(bufferRows, underscoreJS.findWhere(bufferRows, {
                    "ROWID": parseInt(rowKey)
                }));
                if (itemSwitch == "NEXT") {
                    processIndex = index + 1;
                } else {
                    processIndex = index - 1;
                }
                oController._processItemSwitchVisibility(processIndex, bufferRows);
                params['ROWID'] = bufferRows[processIndex]['ROWID'];
                oController.processAction.call(oController, oController.getCurrentSubEntity().section, oController._onExpandAction, params);
            },

            processPopupAction: function (sectionID, action, objConfig) {
                var oController = this,
                    deferred = $.Deferred(), renderFullScreenControl;
                var promise = oController._UpdateChanges(sectionID);
                promise.then(function () {
                    oController._modalDialogPrepare(action);
                    oController.getMetaDataNData(sectionID, "", action, objConfig).then(function () {
                        if (oController._popupContn) {
                            oController._popupContn["SELTP"] = oController.getCurrentModel().getProperty("/POPUP_PROP/SELTP");
                        }


                        if (!oController._setValuesAction || oController._setValuesAction['FNCNM'] !== global.vui5.cons.eventName.setValues) {
                            /***Rel 60E SP6 QA #11815 - Start **/
                            renderFullScreenControl = oController.getCurrentModel().getProperty("/POPUP_PROP/FLVIW") === 'X' && !oController.fullScreenPopup;

                            if (renderFullScreenControl &&
                                !underscoreJS.isEmpty(oController.getSectionBy("DAPPT", global.vui5.cons.propertyType.pdfViewer))) {
                                renderFullScreenControl = sap.ui.Device.browser.chrome === true;

                                if (!renderFullScreenControl) {
                                    oController._popup.setShowHeader(false);
                                    oController._popup.addStyleClass("vuiDialog");
                                }
                            }

                            if (renderFullScreenControl) {
                                oController.prepareFullScreenControl();
                            }
                            else {
                                oController._popup.open();
                            }
                            /***Rel 60E SP6 QA #11815 - End **/
                        }

                    }).fail(function () {
                        oController._popup.destroy();
                        oController._refreshPopupModel();
                        delete oController._formDialog;
                        oController._bufferSectionConfig();
                        deferred.reject();
                    });

                    deferred.resolve();
                });

                return deferred.promise();
            },

            _bufferSectionConfig: function (bufferFill, fromPopup) {
                var oController = this,
                    mainModel,
                    currentModel,
                    currentModelBuffer,
                    bufferedData;
                mainModel = oController.getMainModel();
                currentModel = oController.getCurrentModel();
                currentModelBuffer = mainModel.getProperty("/CURRENTSECTION_BUFFER");
                if (bufferFill) {
                    if (!currentModelBuffer) {
                        currentModelBuffer = [];
                    }
                    currentModelBuffer.push({
                        "SECCFG": this.sectionConfig,
                        "SECREF": this.sectionRef,
                        "DOFUN": currentModel.getProperty("/DOFUN")
                    });
                    this.sectionRef = {};
                    this.sectionConfig = {};
                    mainModel.setProperty("/CURRENTSECTION_BUFFER", currentModelBuffer);

                } else {
                    if (underscoreJS.isArray(currentModelBuffer) && mainModel.getProperty("/CURRENTSECTION_BUFFER").length > 0) {
                        bufferedData = currentModelBuffer.pop();
                        oController.sectionConfig = bufferedData['SECCFG'];
                        currentModel.setProperty("/SECCFG", bufferedData['SECCFG']);
                        currentModel.setProperty("/DOFUN", bufferedData['DOFUN']);
                        oController.sectionRef = bufferedData['SECREF'];
                    }

                    /****Rel 60E SP6 QA #11929 - Start ***/
                    if (oController._config &&
                        oController._config.lastActionRef &&
                        oController._config.lastActionRef['ACTYP'] === global.vui5.cons.actionType.pageNavigation) {
                        oController.clearRefs();
                    }
                    /****Rel 60E SP6 QA #11929 - End ***/
                }

            },
            processEvent: function (sectionID, action, rowData, urlParams, skipBufferProcessEvent) {
                var oController = this, currentSection, objDefer = $.Deferred(), actionObject,
                    skipCurrentSectionUpdate = false,
                    lineLayout, objParams = {}, objData = {}, triggerGetChangedData, triggerUpdateEvent;
                var mainModel = oController.getMainModel();
                currentSection = oController.getSectionBy("SECTN", sectionID) || {};
                lineLayout = oController.getProfileInfo()['UILYT'] === global.vui5.cons.layoutType.line;
                var dMode = mainModel.getProperty("/DOCUMENT_MODE");
                /*
            * Skip Current Section -> Used to update all Sections Except
            * Current Section in Case of Line Layout or Section Grouping
            *
            * In case of Filter Action we have to update the current
            * Section including all sections & then perform filter action
            */

                triggerUpdateEvent = (!underscoreJS.isEmpty(currentSection['SCGRP']) ||
                    (lineLayout && action['ACTYP'] !== global.vui5.cons.actionType.popup) ||
                    action['ACTYP'] === global.vui5.cons.actionType.filters ||
                    action['FNCNM'] === global.vui5.cons.eventName.pageChange) &&
                    !oController._bufferProcessEvent &&
                    !skipBufferProcessEvent &&
                    action['ACTYP'] !== global.vui5.cons.actionType.cancel &&
                    !underscoreJS.isEmpty(action['SECTN']) &&
                    ((dMode && dMode !== global.vui5.cons.mode.display) || currentSection['EDIT'] === 'X') &&
                    action['FNCNM'] !== global.vui5.cons.eventName.fieldValueChange &&
                    action['FNCNM'] !== global.vui5.cons.eventName.setValuesApply;

                if (triggerUpdateEvent) {
                    skipCurrentSectionUpdate = action['ACTYP'] !== global.vui5.cons.actionType.filters &&
                        action['FNCNM'] !== global.vui5.cons.eventName.pageChange;
                    oController._bufferProcessEvent = {
                        sectionID: sectionID,
                        action: action,
                        params: rowData,
                        urlParams: urlParams
                    };

                    if (action['FNCNM'] === global.vui5.cons.eventName.pageChange) {
                        action = {
                            "FNCNM": global.vui5.cons.eventName.update,
                            "RQTYP": global.vui5.cons.reqTypeValue.post,
                            "SECTN": sectionID
                        };
                    }
                    else {
                        action = {
                            "FNCNM": global.vui5.cons.eventName.update,
                            "RQTYP": global.vui5.cons.reqTypeValue.post
                        };
                    }


                }

                /*if(action['FNCNM'] === global.vui5.cons.eventName.attachmentDownload){
                    action['RQTYP'] = global.vui5.cons.reqTypeValue.get;
                }*/

                /* if ((currentSection['SCGRP'] || (lineLayout && action['ACTYP'] !== global.vui5.cons.actionType.popup) || action['ACTYP'] === global.vui5.cons.actionType.filters) && !oController._bufferProcessEvent &&
                         dMode && dMode !== global.vui5.cons.mode.display && !skipBufferProcessEvent &&
                         action['ACTYP'] !== global.vui5.cons.actionType.cancel && action['SECTN']) {
                         skipCurrentSectionUpdate = action['ACTYP'] !== global.vui5.cons.actionType.filters;
                         oController._bufferProcessEvent = {
                             sectionID: sectionID,
                             action: action,
                             params: rowData
                         };
                         action = {
                             "FNCNM": global.vui5.cons.eventName.update,
                             "RQTYP": global.vui5.cons.reqTypeValue.post
                         };
        
                     }*/
                else {
                    oController._bufferProcessEvent = undefined;
                }
                var sectionConfig = oController.sectionConfig[sectionID] || {};

                if (action['RQTYP'] === global.vui5.cons.reqTypeValue.post &&
                    (dMode !== global.vui5.cons.mode.display || oController._formDialog)) {
                    var dataArea = oController._determineDataAreasToUpdate(sectionID, skipCurrentSectionUpdate, action)['DATAAREA'];
                }

                if (!sectionID) {
                    sectionID = oController._determineDataAreasToUpdate(sectionID, skipCurrentSectionUpdate, action)['SECTIONID'] || '';
                };

                if (currentSection['SCGRP'] && oController._bufferProcessEvent) {
                    sectionID = underscoreJS.findWhere(oController.getSections(), {
                        'GRPNM': currentSection['SCGRP']
                    })['SECTN'];
                }
                if (action['ACTYP'] === global.vui5.cons.actionType.popup) {

                    var actionParam = global.vui5.cons.params.metadatanData.split('$')[1].toUpperCase();
                    objParams[global.vui5.cons.params.action] = actionParam;
                    objParams[global.vui5.cons.params.modal_action] = action ? action['FNCNM'] : "";
                    objParams[global.vui5.cons.params.modalFunctionSection] = action['SECTN'] || "";

                    if (!underscoreJS.isEmpty(urlParams)) {
                        objParams = underscoreJS.extend(objParams, urlParams);
                    }
                    var objConfig = {
                        //sectionId: sectionID,
                        method: global.vui5.cons.reqType.post,
                        initialCall: true,
                        urlParams: objParams,
                        context: global.vui5.cons.applicationContext.popup
                    };
                    /*** Tabbed layout support in popup***/
                    oController.popupInitCall = true;
                    /***/
                    /****Rel 60E SP6 QA #10495 - Start ***/
                    if (underscoreJS.isEmpty(action['UILYT'])) {
                        objConfig['sectionId'] = sectionID;
                    }
                    /****Rel 60E SP6 QA #10495 - End ***/
                } else {

                    var objConfig = {
                        method: action['RQTYP'] === global.vui5.cons.reqTypeValue.post ? global.vui5.cons.reqType.post : global.vui5.cons.reqType.get,
                        action: action['FNCNM'],
                        hideLoader: !!action.hideLoader,
                        actionRef: action,
                        dataArea: dataArea,
                        params: '',
                        context: oController.currentRoute,
                        sectionId: sectionID
                        // urlParams: urlParams
                    };

                    if (oController._formDialog || oController._setValuesAction) {
                        actionObject = oController._formDialog || oController._setValuesAction;
                        objParams[global.vui5.cons.params.modal_action] = actionObject['FNCNM'];
                        objParams[global.vui5.cons.params.modalFunctionSection] = actionObject['SECTN'];

                    }

                    //objConfig['urlParams'] = underscoreJS.isEmpty(urlParams) ? objParams : underscoreJS.extend(objParams, urlParams);

                    if (urlParams) {
                        objConfig['urlParams'] = underscoreJS.isEmpty(urlParams) ? objParams : underscoreJS.extend(objParams, urlParams);
                    }
                    else {
                        objConfig['urlParams'] = objParams;
                    }

                }
                if ((action['SELTP'] === global.vui5.cons.rowSelection.single
                    || action['SELTP'] === global.vui5.cons.rowSelection.multiple) && action['ACTYP'] !== global.vui5.cons.actionType.filters) {

                    if (underscoreJS.isEmpty(rowData) || (rowData instanceof sap.ui.base.Event)) {
                        rowData = {};
                        if (oController._formDialog && action['FNCNM'] === global.vui5.cons.eventName.continue) {
                            if (underscoreJS.isEmpty(currentSection)) {
                                //currentSection = oController.getCurrentModel().getProperty("/POPUP_SECTN")[0];
                                currentSection = underscoreJS.find(oController.getCurrentModel().getProperty("/POPUP_SECTN"), { DAPPT: global.vui5.cons.propertyType.table });
                                sectionID = currentSection['SECTN'];
                            }
                        }
                        if (currentSection['DAPPT'] === global.vui5.cons.propertyType.table) {
                            rowData = oController.sectionRef[sectionID].getSelectedRows();
                        }
                        if (currentSection['DAPPT'] === global.vui5.cons.propertyType.treeTable) {
                            rowData = oController.sectionRef[sectionID].getSelectedItems();
                        }
                        if (underscoreJS.isEmpty(rowData) && action['FNCNM'] !== global.vui5.cons.eventName.setValues) {
                            /*if (action['FNBVR'] === global.vui5.cons.functionBehaviour.delete  && 
                                    sectionID === oController.getCurrentSubEntity().section) {
                                rowData['ROWID'] = oController.getCurrentSubEntity().key;
                            }
                            else {
                                sap.m.MessageToast.show(oController._getBundleText("SelectRowMsg"));
                                return;
                            }*/

                            //*****Rel 60E_SP6 = QA #11460
                            if (action['STCTL'] === global.vui5.cons.selectionControl.none) {
                                if (action['SELTP'] === global.vui5.cons.rowSelection.single) {
                                    sap.m.MessageToast.show(oController._getBundleText("SelectARow"));
                                }
                                else if (action['SELTP'] === global.vui5.cons.rowSelection.multiple) {
                                    sap.m.MessageToast.show(oController._getBundleText("SelectRowMsg"));
                                }
                                return;
                            }
                            //*****                        	                            
                        }
                        if (action['SELTP'] === global.vui5.cons.rowSelection.single &&
                            underscoreJS.isArray(rowData) && rowData.length > 1) {
                            sap.m.MessageToast.show(oController._getBundleText("selectOneRowMsg"));
                            return;
                        }
                    }
                    objConfig.selectedRows = underscoreJS.isArray(rowData) ?
                        underscoreJS.pluck(rowData, sectionConfig.keyField || global.vui5.rowID) :
                        underscoreJS.pluck([rowData], sectionConfig.keyField || global.vui5.rowID);

                    if (action['ACTYP'] === global.vui5.cons.actionType.popup) {
                        objConfig.data = {};
                        objConfig.data['selectedRows'] = objConfig.selectedRows;
                    }

                }

                if (action['ACTYP'] === global.vui5.cons.actionType.filters &&
                    (action['SELTP'] === global.vui5.cons.rowSelection.single ||
                        action['SELTP'] === global.vui5.cons.rowSelection.multiple)) {

                    //*****Rel 60E_SP6 
                    if (action['STCTL'] === global.vui5.cons.selectionControl.none) {
                        //*****
                        if (underscoreJS.isEmpty(rowData) || (rowData instanceof sap.ui.base.Event)) {
                            sap.m.MessageToast.show(oController._getBundleText("SelectFilter"));
                            return;
                        }
                        //*****Rel 60E_SP6
                    }

                    if (!underscoreJS.isEmpty(rowData)) {
                        //*****
                        objConfig.filters = underscoreJS.isArray(rowData) ?
                            underscoreJS.pluck(rowData, 'NAME') : underscoreJS.pluck([rowData], 'NAME');
                        //*****Rel 60E_SP6
                    }
                    //*****
                }

                triggerGetChangedData = objConfig.method === global.vui5.cons.reqType.post &&
                    action['ACTYP'] !== global.vui5.cons.actionType.popup &&
                    action['ACTYP'] !== global.vui5.cons.actionType.filters &&
                    //action['BTNTP'] !== global.vui5.cons.buttonType.menuButton &&
                    ((dMode && dMode !== global.vui5.cons.mode.display) ||
                        oController.getProfileInfo()['UITYP'] === global.vui5.cons.UIType.worklist ||
                        currentSection['EDIT'] === 'X' ||
                        //*****Rel 60E_SP6
                        currentSection['DAPPT'] === global.vui5.cons.propertyType.attachments ||
                        currentSection['DAPPT'] === global.vui5.cons.propertyType.notes ||
                        //*****                        
                        oController.getProfileInfo()['UITYP'] === global.vui5.cons.UIType.listWithProcessing ||
                        action['FNCNM'] === global.vui5.cons.eventName.variantMaintain ||
                        action['FNCNM'] === global.vui5.cons.eventName.layoutManage ||
                        action['FNCNM'] === global.vui5.cons.eventName.commentUpdate ||
                        action['FNCNM'] === global.vui5.cons.eventName.dictionaryUpdate ||
                        action['FNCNM'] === global.vui5.cons.eventName.snapshotManage ||
                        oController._formDialog);

                /*** Rel 60E SP6 - Planning/Pricing related Changes - Start ***/
                /*if (triggerGetChangedData) {
                    objConfig.data = oController.getChangedData(dataArea);
                }*/
                var changedDataPromise;
                if (triggerGetChangedData) {
                    /** Rel SP7 - Cursor Position Changes Start**/
                    //                  changedDataPromise = oController.getChangedData(dataArea);
                    changedDataPromise = oController.getChangedData(dataArea, action);
                    /** Rel SP7 - Cursor Position Changes End**/
                }
                else {
                    changedDataPromise = $.Deferred();
                    changedDataPromise.resolve();
                }

                changedDataPromise.then(function (data) {
                    if (data) {
                        objConfig.data = data;
                    }
                    /*** Rel 60E SP6 - Planning/Pricing related Changes - End ***/
                    if (currentSection['DAPPT'] === global.vui5.cons.propertyType.dashboard && action['FNCNM'] === vui5.cons.eventName.navigate) {
                        objData[currentSection['DARID']] = rowData;
                        objConfig.data = objData;
                    }

                    //*****Rel 60E SP6
                    if (currentSection['DAPPT'] === global.vui5.cons.propertyType.hierarchyTree && rowData && !underscoreJS.isEmpty(rowData)) {
                        objData[currentSection['DARID']] = rowData;
                        objConfig.data = objData;
                    }
                    //*****

                    //*****Rel 60E_SP6 - QA #10505
                    var cfmsg, selMenuitem;
                    cfmsg = action['CFMSG'];
                    if (!underscoreJS.isEmpty(action['MNITM']) && !underscoreJS.isEmpty(urlParams) && urlParams['$SELMNITM']) {
                        selMenuitem = underscoreJS.findWhere(action['MNITM'], { NAME: urlParams['$SELMNITM'] });
                        if (selMenuitem && !underscoreJS.isEmpty(selMenuitem['CFMSG'])) {
                            cfmsg = selMenuitem['CFMSG'];
                        }
                    }
                    //*****                

                    //*****Rel 60E_SP6 - QA #10505

                    if (cfmsg) {
                        MessageBox.confirm(cfmsg, {
                            //*****
                            title: oController._getBundleText('ConfirmAction'),
                            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                            onClose: function (oAction) {
                                if (oAction === MessageBox.Action.YES) {
                                    oController.processServerEvent(objConfig).then(function (response) {
                                        objDefer.resolve(response);
                                    });
                                }
                                else if (action['FNCNM'] === global.vui5.cons.eventName.save) {
                                    if (oController._bufferProcessAction) {
                                        delete oController._bufferProcessAction;
                                    }
                                }
                            }
                        });
                    } else {
                        if (action['ACTYP'] === global.vui5.cons.actionType.popup) {
                            oController.processPopupAction(sectionID, action, objConfig).then(function () {
                                objDefer.resolve();
                            });

                        } else {
                            oController.processServerEvent(objConfig).then(function (response) {
                                objDefer.resolve(response);
                            }).fail(function (response) {
                                objDefer.reject(response);
                            });
                        }

                    }

                    /*** Rel 60E SP6 - Planning/Pricing related Changes - Start ***/
                });
                /*** Rel 60E SP6 - Planning/Pricing related Changes - End ***/
                return objDefer.promise();
            },
            processServerEvent: function (config) {
                var oController = this,
                    objDefer = $.Deferred(),
                    routingUrl,
                    messageDialog,
                    promise,
                    mainModel,
                    resolvePromise = true,
                    prevMode,
                    bufferProcessEvent,
                    navigation;
                var pageNavBuffer = oController.getPageNavBuffer(),
                    listReport = false,
                    dependentApp,
                    cancelPromise,
                    section, currentSection;
                var drillDownBuffer = oController.getDrillDownBuffer(),
                    popupEve = false;
                mainModel = oController.getOwnerComponent().getModel(global.vui5.modelName);
                if (!underscoreJS.isEmpty(mainModel.getProperty("/DOCUMENT_ERRORS"))) {
                    mainModel.setProperty("/DOCUMENT_ERRORS", "");
                    objDefer.reject();
                    return objDefer.promise();
                }

                promise = oController.callServer(config);
                if (promise) {
                    promise.then(function (response) {

                        prevMode = mainModel.getProperty("/DOCUMENT_MODE");

                        //*****Rel 60E_SP6
                        if (config.actionRef && config.actionRef['ACTYP'] === global.vui5.cons.actionType.messageLog) {
                            oController.processMessageDialog(response, config.actionRef);
                            return;
                        }
                        //                        /** Rel SP7 - Cursor Position Changes Start**/
                        //                            if(config.data && config.actionRef['FNCNM']== gloabl.vui5.cons.eventName.check){
                        //                        	var nodes = oController.getNode(config.data,false)
                        //                        	var gridDataAreas = ['PG', 'HG','PL'];
                        //                            var gridDataAreaList = _.filter(nodes , function(node){return gridDataAreas.includes(node)});
                        //                            for (var i in gridDataAreaList) {
                        //                            	
                        //                            var section = oController.getSectionBy("DARID",gridDataAreaList[i]);
                        //                            if(oController.sectionRef[section['SECTN']].gridConfig.gridAPI !== "")
                        //                            	{
                        //                            	
                        //                            	oController.sectionRef[section['SECTN']].cursorPosition(true);
                        //                            	}
                        //                            	}
                        //                            }
                        //                            
                        //                            /** Rel SP7 - Cursor Position Changes End**/

                        //*****

                        if (config.actionRef
                            && (config.actionRef['ACTYP'] === global.vui5.cons.actionType.back ||
                                config.actionRef['ACTYP'] === global.vui5.cons.actionType.cancel)
                            && oController._formDialog) {
                            popupEve = true;
                            if (!response['RESULT']['ERROR']) {
                                // oController._popup.close();
                                //oController._popup.destroy();
                                oController._setPreparePageContent({
                                    response: response,
                                    action: config.actionRef
                                });

                                if (!oController._formDialog || oController.getCurrentModel().getProperty("/POPUP_PROP/FLVIW") === 'X') {
                                    oController.destroyFullScreenControl();
                                }

                                oController._popupClose(true);

                                oController._refreshPopupModel();

                                delete oController._formDialog;
                                /**** Rel 60E SP6 - FullScreen Support changes - Start ***/
                                //oController._bufferSectionConfig();
                                /**** Rel 60E SP6 - FullScreen Support changes - End ***/
                            }

                        }
                        /* Result Node */
                        oController.processResultNode(response);

                        if (mainModel.getProperty("/DOCUMENT_ERRORS")) {
                            if (oController._bufferProcessAction) {
                                delete oController._bufferProcessAction;
                            }

                            if (oController._bufferProcessEvent) {
                                oController._bufferProcessEvent = undefined;
                            }

                            if (oController._config &&
                                oController._config.lastActionRef &&
                                oController._config.lastActionRef['ACTYP'] === global.vui5.cons.actionType.refresh) {
                                oController._config.lastActionRef = {};
                            }
                            mainModel.setProperty("/DOCUMENT_ERRORS", "");

                            //*****Rel 60E_SP7 - EPPD #1979
                            if (response['UIPRFINFO'] && !underscoreJS.isEmpty(response['UIPRFINFO']['APPID'])) {
                                oController.clearRefs();
                            }
                            //*****

                            oController._itemSwitch = false;

                            /*if (response) {
                                oController.updateDocumentData(response);
                                oController.updateProperties(response);
                            }*/


                            objDefer.reject(response);

                            return;
                        }
                        else {
                            oController.clearTableChangedRows();
                        }

                        if (config.actionRef && config.actionRef['FNCNM'] == global.vui5.cons.eventName.excelExport && config.actionRef['DNLDTP'] !== global.vui5.cons.downloadType.server) {
                            var darid = config.actionRef['DARID'];
                            var exceldata = response[darid];
                            oController.getModel(oController.modelName).setProperty("/EXCEL_DATA", exceldata);
                            objDefer.resolve(response);
                            return;
                        }
                        /* Refresh Navigation Type */

                        if (config.actionRef && config.actionRef['ACTYP'] === global.vui5.cons.actionType.refresh ||
                            (response['RESULT'] && !underscoreJS.isEmpty(response['RESULT']['REFRESH_PAGE']))) {
                            oController.processRefreshAction(config, response, prevMode);
                            objDefer.resolve(response);
                            return objDefer.promise();
                        }
                        /*if (config.actionRef && config.actionRef['ACTYP'] === global.vui5.cons.actionType.refresh ||
                   (prevMode != "" && prevMode !== mainModel.getProperty("/DOCUMENT_MODE") &&
                    config.actionRef && config.actionRef['ACTYP'] !== global.vui5.cons.actionType.cancel &&
                    config.actionRef && config.actionRef['ACTYP'] !== global.vui5.cons.actionType.pageNavigation)) {
                oController.processRefreshAction(config, response, prevMode);
                objDefer.resolve(response);
                return objDefer.promise();
            }*/

                        if (config.actionRef && config.actionRef['FNCNM'] === global.vui5.cons.eventName.setValuesApply) {
                            delete oController._setValuesAction;
                        }

                        if (global.vui5.refreshData) {
                            mainModel.setProperty("/REFRESH_DATA", true);
                            global.vui5.refreshData = false;
                        }

                        /* Raise Data Request */
                        if (mainModel.getProperty("/REFRESH_DATA") &&
                            config.method === global.vui5.cons.reqType.post) {
                            resolvePromise = false;
                            if (oController._bufferProcessEvent) {
                                global.vui5.refreshData = true;
                                global.vui5.refreshSection = config.sectionId;
                            } else {
                                section = oController._determineSection(config);
                                oController.getData(global.vui5.refreshSection === undefined ? section['SECTN'] : global.vui5.refreshSection).then(function (response) {
                                    global.vui5.refreshSection = undefined;
                                    objDefer.resolve(response);
                                });
                            }

                        }


                        /* Raise Metadata Request */

                        if (mainModel.getProperty("/REFRESH_METADATA")) {
                            resolvePromise = false;
                            mainModel.setProperty("/REFRESH_METADATA", false);
                            section = oController._determineSection(config);
                            /*** Rel 60E SP6 - QA #11099 - Start ***/
                            // oController.getMetaDataNData(underscoreJS.isEmpty(config.sectionId) ? section['SECTN'] : config.sectionId).then(function (response) {
                            oController.getMetaDataNData(section['SECTN'] ? section['SECTN'] : "").then(function (response) {
                                /*** Rel 60E SP6 - QA #11099 - End ***/
                                objDefer.resolve(response);
                            });
                        }
                        if (response['RESULT'] && response['RESULT']['DFFMT'] == global.vui5.cons.fileFormat.excel_format) {
                            var exceldata = response['EXCEL_DATA'];
                            oController.getModel(oController.modelName).setProperty("/EXCEL_DATA", exceldata);
                            oController._processExport({
                                fromServer: true,
                                fileName: response['FILENAME']
                            });

                        }
                        else if (mainModel.getProperty("/DOWNLOAD_DATA") && (config.method === global.vui5.cons.reqType.post || config.actionRef['DNLDTP'] === global.vui5.cons.downloadType.server)) {
                            {
                                resolvePromise = false;
                            }

                            ///**Rel 60E SP6 - Attachment download Issue from HCP - Start
                            //var oUrl = response['PREVIEW_URL'] ? response['PREVIEW_URL'] : "/sap/bc/bsp/vui/gatdnl/download.htm";
                            var oUrl = response['PREVIEW_URL'] ? response['PREVIEW_URL'] : oController.getServerURL(config);
                            ///**Rel 60E SP6 - Attachment download Issue from HCP - End


                            if (response['PREVIEW_URL'] && response['RESULT']['DFFMT'] == global.vui5.cons.fileFormat.pdf_format) {
                                oController._processPdfViewer({
                                    url: response['PREVIEW_URL']
                                });
                            }
                            else {
                                window.open(oUrl, "_self");
                                objDefer.resolve(response);
                                return;
                            }

                            /* if (mainModel.getProperty("/DOWNLOAD_DATA") === '1') {
                               window.open(oUrl, "_self");
                           }
                           else if (mainModel.getProperty("/DOWNLOAD_DATA") === '2') {
                               window.open(oUrl);
                           }*/
                        }

                        /* Profile/Page Navigation */
                        if (config.actionRef
                            && config.actionRef['ACTYP'] === global.vui5.cons.actionType.pageNavigation
                            && response['UIPRFINFO']) {
                            if (!underscoreJS.isEmpty(response['UIPRFINFO']['APPID'])) {
                                //*****Rel 60E_SP6
                                if (oController.getProfileInfo()['UILYT'] === global.vui5.cons.layoutType.line) {
                                    var sections = oController.getSections();
                                    underscoreJS.each(sections, function (sectn) {
                                        oController.dashboardBufferFill(sectn['SECTN']);
                                    });
                                }
                                //*****
                                oController.clearRefs();
                            }
                            if (oController._formDialog) {
                                //*****Rel 60E_SP6 - QA #11929
                                if (!underscoreJS.isEmpty(oController.getQueryParam("tab"))) {
                                    currentSection = oController.getQueryParam("tab");
                                }
                                //*****
                                oController._popupClose(true);
                            }


                            oController.destroyFullScreenControl();

                            cancelPromise = oController.processCancelAction(config.sectionId, response['UIPRFINFO']['DEP_OBJECT'] || underscoreJS.isEmpty(response['UIPRFINFO']['APPID']));

                            cancelPromise.then(function () {
                                if (underscoreJS.isEmpty(response['UIPRFINFO']['APPID']) && !underscoreJS.isEmpty(response['UIPRFINFO']['URL'])) {
                                    if (response['UIPRFINFO']['NAVTP'] === global.vui5.cons.navType.ui_application) {
                                        response['UIPRFINFO']['URL'] += "&GUIID=" + global.vui5.server.url.guiId;
                                        mainModel.setProperty("/LAUNCHURL", response['UIPRFINFO']['URL']);
                                        commonUtils.startLoader();
                                        global.vui5.showBusyIndicator = true;
                                        oController.processLaunchNavigation();
                                    } else if (response['UIPRFINFO']['NAVTP'] === global.vui5.cons.navType.webgui || response['UIPRFINFO']['NAVTP'] === global.vui5.cons.navType.bsp_application) {
                                        window.open(response['UIPRFINFO']['URL']);
                                    }
                                } else {
                                    if (oController.getApplicationIdentifier() === global.vui5.cons.applicationIdentifier.dashboard) {
                                        mainModel.setProperty("/PREPARE_PAGE_CONTENT", true);
                                    }
                                    dependentApp = response['UIPRFINFO']['DEP_OBJECT'] === 'X' ||
                                        oController.getProfileInfo()['UITYP'] === global.vui5.cons.UIType.worklist;
                                    if (response['UIPRFINFO']['APPID'] === 'vzdshbd' && (response['DSHBD_FLTR'] || response['DSHBD_TAB'])) {
                                        if (response['DSHBD_FLTR']) {
                                            oController.getMainModel().setProperty("/DSHBD_FLTR", response['DSHBD_FLTR']);
                                        }
                                        if (response['DSHBD_TAB']) {
                                            oController.getMainModel().setProperty("/DSHBD_TAB", response['DSHBD_TAB']);
                                        }
                                    }

                                    //*****Rel 60E_SP6 - QA #11929
                                    //oController.bufferPageNavigation(config.sectionId, true, dependentApp);
                                    if (!underscoreJS.isEmpty(currentSection)) {
                                        oController.bufferPageNavigation(currentSection, true, dependentApp);
                                    }
                                    else {
                                        oController.bufferPageNavigation(config.sectionId, true, dependentApp);
                                    }
                                    //*****         
                                    oController.setProfileInfo(response);

                                    //*****Rel 60E_SP6
                                    if (oController.getApplicationIdentifier() == "vzdshbd" && response['APTIT']) {
                                        mainModel.setProperty("/APTIT", response['APTIT']);
                                    }
                                    //*****
                                    oController._preparePageContent = true;
                                    oController._lastVisitedViewRef = oController.getView();
                                    routingUrl = oController.prepareRoutingUrl(false, true, response['UIPRFINFO']['OBJID'], response['UIPRFINFO']['MODE'], null, response['RESULT']['SELECTED_SECTION']);
                                    oController.processNavigation(routingUrl);
                                }
                            });

                        }

                        /* Data Node */
                        if (response) {
                            oController.updateDocumentData(response);
                            oController.updateProperties(response);
                        }

                        if (config.actionRef
                            && (config.actionRef['ACTYP'] === global.vui5.cons.actionType.back ||
                                config.actionRef['ACTYP'] === global.vui5.cons.actionType.cancel)
                            && !mainModel.getProperty('/DOCUMENT_ERRORS') && !popupEve) {

                            oController.clearRefs();

                            if (underscoreJS.isObject(mainModel.getProperty("/FNBVR_OBJ")) && !underscoreJS.isEmpty(mainModel.getProperty("/FNBVR_OBJ"))) {
                                oController._previousFnbvrObj = $.extend(true, [], mainModel.getProperty("/FNBVR_OBJ"));
                                ;
                            }

                            if (!underscoreJS.isEmpty(pageNavBuffer) &&
                                (pageNavBuffer[pageNavBuffer.length - 1]['UIPRFINFO']['UITYP'] === global.vui5.cons.UIType.worklist /*||
                                 pageNavBuffer[pageNavBuffer.length - 1]['UIPRFINFO']['UITYP'] === global.vui5.cons.UIType.listWithProcessing*/ ) &&
                                underscoreJS.isEmpty(drillDownBuffer)) {

                                listReport = true;
                            }

                            if (response['RESULT'] &&
                                underscoreJS.isEmpty(pageNavBuffer) &&
                                !listReport &&
                                !underscoreJS.isEmpty(response['RESULT']['MESSAGES']) &&
                                config.actionRef &&
                                config.actionRef['FNBVR'] !== global.vui5.cons.functionBehaviour.delete) {

                                messageDialog = new sap.m.Dialog({
                                    type: sap.m.DialogType.Message,
                                    title: oController._getBundleText("Success"),
                                    state: sap.ui.core.ValueState.Success,
                                    content: [new sap.m.Text({
                                        text: response['RESULT']['MESSAGES'][0]['MSGLI']
                                    })],
                                    beginButton: new sap.m.Button({
                                        text: oController._getBundleText("Ok"),
                                        press: function () {
                                            messageDialog.close();
                                            oController.processOnNavBack({
                                                listReport: listReport
                                            });
                                        }
                                    }),

                                    afterClose: function () {
                                        messageDialog.destroy();
                                    }
                                });

                                messageDialog.open();

                                if (resolvePromise) {
                                    objDefer.resolve(response);
                                    return;
                                }
                            }

                            oController.processOnNavBack({
                                listReport: listReport
                            });

                        }

                        if (oController._bufferProcessEvent) {
                            resolvePromise = false;
                            oController.processEvent(oController._bufferProcessEvent.sectionID, oController._bufferProcessEvent.action, oController._bufferProcessEvent.params, oController._bufferProcessEvent.urlParams)
                                .then(function (response) {
                                    objDefer.resolve(response);
                                });
                        }
                        if (response['RESULT'] && response['RESULT']["FUNCTION"]) {
                            oController.processSubSequentAction(response, config, objDefer);
                        }
                        if (resolvePromise) {
                            objDefer.resolve(response);
                        }
                    });
                }
                return objDefer.promise();
            },


            processOnNavBack: function (config) {
                var oController = this,
                    pageNavBuffer,
                    drillDownBuffer,
                    listReport,
                    mainModel;
                mainModel = oController.getMainModel();
                drillDownBuffer = oController.getDrillDownBuffer();
                pageNavBuffer = oController.getPageNavBuffer();
                listReport = config.listReport;

                oController._dependentObject = (listReport || oController.getProfileInfo()['DEP_OBJECT'] === 'X') &&
                    underscoreJS.isEmpty(drillDownBuffer);


                /*** Rel 60E SP6 ECIP #4215 - Start ***/
                if (global.vui5.session.fromFioriLaunchpad && !listReport &&
                    underscoreJS.isEmpty(drillDownBuffer) &&
                    underscoreJS.isEmpty(pageNavBuffer)) {
                    oController.sessionClose();
                }

                /*** Rel 60E SP6 ECIP #4215 - End ***/
                if (!underscoreJS.isEmpty(drillDownBuffer)) {
                    oController.bufferDrillDown(false);
                }

                if (underscoreJS.isEmpty(drillDownBuffer)) {
                    if (oController.navUpButton && oController.navDownButton) {
                        oController.navUpButton.setVisible(false);
                        oController.navDownButton.setVisible(false);
                    }

                    mainModel.setProperty("/DRILLDOWNKEYS", {});
                }


                oController._initializeApp = !listReport &&
                    oController.getCurrentSubEntity()['section'] === '' &&
                    !underscoreJS.isEmpty(pageNavBuffer) && !oController._dependentObject &&
                    pageNavBuffer[pageNavBuffer.length - 1]['UIPRFINFO']['APPID'] !== global.vui5.cons.applicationIdentifier.dashboard;


                /* if (oController._initializeApp && !underscoreJS.isEmpty(pageNavBuffer)) {
                     if (pageNavBuffer[0]['UIPRFINFO']['APPID'] === 'vzdshbd') {
                         oController._initializeApp = false;
                     }
                 }*/


                oController._preparePageContent = true;
                oController._lastVisitedViewRef = oController.getView();
                oController.onNavBack();
            },

            processSubSequentAction: function (response, config, objDefer) {
                var oController = this,
                    section,
                    action;
                section = oController.getSectionBy("SECTN", config.sectionId);
                action = underscoreJS.find(section['FUNC'], {
                    FNCNM: response['RESULT']['FUNCTION']
                });
                oController.processAction(config.sectionId, action).then(function () {
                    objDefer.resolve(response);
                });
            },
            processCancelAction: function (sectionId, dependentApp) {
                var oController = this,
                    deferred = $.Deferred();

                if (dependentApp || !oController.getDocumentNumberFromUrl()) {
                    deferred.resolve();
                    return deferred.promise();
                }
                var action = {
                    "FNCNM": global.vui5.cons.eventName.cancel,
                    "RQTYP": global.vui5.cons.reqType.post
                };

                oController.processAction(sectionId, action).then(function () {
                    deferred.resolve();
                });
                return deferred.promise();

            },
            processRefreshAction: function (config, response, prevDocMode) {
                var oController = this,
                    currentProfileInfo,
                    currentMode,
                    mainModel,
                    routingUrl,
                    fromPageNavigation, subEntity, formDialog, currentModel, section;

                mainModel = oController.getOwnerComponent().getModel(global.vui5.modelName);



                oController.sectionConfig = {};
                oController._refreshModelData();
                currentMode = mainModel.getProperty("/DOCUMENT_MODE");
                currentProfileInfo = oController.getProfileInfo();

                if (response &&
                    response['RESULT'] &&
                    response['UIPRFINFO'] &&
                    !underscoreJS.isEmpty(response['RESULT']['REFRESH_PAGE']) &&
                    currentProfileInfo['UIPRF'] !== response['UIPRFINFO']['UIPRF']) {

                    oController.setProfileInfo(response);
                }
                if (currentProfileInfo['UITYP'] === global.vui5.cons.UIType.listWithProcessing) {
                    oController._preparePageContent = true;
                    subEntity = oController.getSubEntities();
                }
                if (response['RESULT']['DRILLDOWN_ROWID']) {
                    subEntity = oController.setSubEntity(config.sectionId, response['RESULT']['DRILLDOWN_ROWID'], true);
                    routingUrl = oController.prepareRoutingUrl(false, true, currentProfileInfo['OBJID'], currentMode, subEntity);
                    oController.processNavigation(routingUrl, true);
                    return;
                }
                if (currentMode !== prevDocMode) {

                    oController.destroyFullScreenControl();

                    // oController._refreshModelData();
                    /**** In case of Price Review Application, on Tab Shift they are passing Refresh Page as they want to change 
                    document mode - Start**/
                    if (config.actionRef &&
                        config.actionRef['FNCNM'] === global.vui5.cons.eventName.update &&
                        config.urlParams &&
                        config.urlParams[global.vui5.cons.params.updateCallFrom] === global.vui5.cons.updateCallFrom.tabChange) {
                        routingUrl = oController.prepareRoutingUrl(false, true, currentProfileInfo['OBJID'], currentMode, subEntity);
                    }
                    /**** In case of Price Review Application, on Tab Shift they are passing Refresh Page as they want to change 
                document mode - End**/
                    else if (oController.getDocumentNumberFromUrl() &&
                        currentProfileInfo['OBJID'] !== oController.getDocumentNumberFromUrl() &&
                        prevDocMode !== global.vui5.cons.mode.create) {

                        /***Rel 60E SP6 QA #11892 - Start ***/
                        if (oController.getProfileInfo()['UILYT'] === global.vui5.cons.layoutType.tab &&
                            oController.tabBar &&
                            oController.tabBar.getSelectedKey()) {
                            oController.tabBar.setSelectedKey("");
                        }
                        /***Rel 60E SP6 QA #11892 - End ***/

                        routingUrl = oController.prepareRoutingUrl(false, oController.getDocumentNumberFromUrl() !== false, currentProfileInfo['OBJID'], currentMode, subEntity);
                    }
                    else {
                        routingUrl = oController.prepareRoutingUrl(false, false, currentProfileInfo['OBJID'], currentMode, subEntity);
                    }

                    oController.processNavigation(routingUrl, true);
                } else {
                    oController.getMetaDataNData(config.sectionId, true);
                }
            },
            updateChangedData: function (section, action, params, updateCallFrom) {
                var oController = this, urlParams = {};

                if (underscoreJS.isEmpty(action)) {
                    action = {
                        "FNCNM": global.vui5.cons.eventName.update,
                        "RQTYP": global.vui5.cons.reqTypeValue.post
                    };
                }
                if (updateCallFrom) {
                    urlParams[global.vui5.cons.params.updateCallFrom] = updateCallFrom;
                }
                return oController.processEvent(section, action, params, urlParams, true);
            },

            //*****Rel 60E_SP6 - Sanofi Req
            removeInvalidSelections: function (selections) {
                var oController = this;
                var oSelections = [];
                underscoreJS.each(selections, function (selection) {
                    var object = underscoreJS.clone(selection);
                    if (object['LOW'] && object['LOW'].indexOf("$$REMOVE$$") != -1) {
                        object['LOW'] = "";
                    }

                    if (object['HIGH'] && object['HIGH'].indexOf("$$REMOVE$$") != -1) {
                        object['HIGH'] = "";
                    }

                    oSelections.push(object);
                });

                return oSelections;
            },
            //*****

            modifySpecialCharacters: function (response) {
                var oController = this,
                    sections,
                    fields,
                    readOnlyColumns,
                    editableCells,
                    data;

                underscoreJS.each(response['SECTN'], function (section) {
                    if (section['DAPPT'] === global.vui5.cons.propertyType.form || section['DAPPT'] === global.vui5.cons.propertyType.table) {
                        data = [];
                        if (section['DAPPT'] === global.vui5.cons.propertyType.form) {
                            if (response[section['DARID']]) {
                                data.push(response[section['DARID']]);
                            }
                        } else if (section['DAPPT'] === global.vui5.cons.propertyType.table) {
                            data = response[section['DARID']] || [];
                        }

                        underscoreJS.each(data, function (obj) {
                            readOnlyColumns = [], editableCells = [];
                            if (obj.hasOwnProperty('READONLYCOLUMNS')) {
                                fields = obj['READONLYCOLUMNS'].split(",") || [];
                                underscoreJS.each(fields, function (field) {
                                    readOnlyColumns.push(oController._specialCharacterReplace(field));
                                });
                                obj['READONLYCOLUMNS'] = readOnlyColumns.toString();
                            }

                            if (obj.hasOwnProperty('EDITABLECELLS')) {
                                fields = obj['EDITABLECELLS'].split(",") || [];
                                underscoreJS.each(fields, function (field) {
                                    editableCells.push(oController._specialCharacterReplace(field));
                                });
                                obj['EDITABLECELLS'] = editableCells.toString();
                            }
                        });
                    }
                    else if (section['DAPPT'] === global.vui5.cons.propertyType.summary) {
                        underscoreJS.each(section['SUMDATA'], function (sumData) {
                            underscoreJS.each(sumData['TABFLDS'], function (field) {
                                field['FLDNAME'] = oController._specialCharacterReplace(field['FLDNAME']);
                                if (field['TXTFL']) {
                                    field['TXTFL'] = oController._specialCharacterReplace(field['TXTFL']);
                                }
                            });
                        })
                    }
                    underscoreJS.each(section['FIELDS'], function (field) {
                        field['FLDNAME'] = oController._specialCharacterReplace(field['FLDNAME']);
                        if (field['TXTFL']) {
                            field['TXTFL'] = oController._specialCharacterReplace(field['TXTFL']);
                        }
                    });
                });

                if (response['RSLTFCAT']) {
                    underscoreJS.each(response['RSLTFCAT'], function (result_fcat) {
                        result_fcat['FLDNAME'] = oController._specialCharacterReplace(result_fcat['FLDNAME']);
                    });
                }

                if (response['RESULT_FCAT']) {
                    underscoreJS.each(response['RESULT_FCAT'], function (result_fcat) {
                        result_fcat['FLDNAME'] = oController._specialCharacterReplace(result_fcat['FLDNAME']);
                    });
                }

                if (response['RETFLD']) {
                    response['RETFLD'] = oController._specialCharacterReplace(response['RETFLD']);
                }

                if (response['DESCRFLD']) {
                    response['DESCRFLD'] = oController._specialCharacterReplace(response['DESCRFLD']);
                }

                if (response['RETFIELD']) {
                    response['RETFIELD'] = oController._specialCharacterReplace(response['RETFIELD']);
                }

                if (response['DESCRFIELD']) {
                    response['DESCRFIELD'] = oController._specialCharacterReplace(response['DESCRFIELD']);
                }


                if (response['SELECTIONS']) {
                    underscoreJS.each(response['SELECTIONS'], function (selection) {
                        selection['SELNAME'] = oController._specialCharacterReplace(selection['SELNAME']);
                    });
                }


            },

            updateProperties: function (response) {
                var oController = this,
                    model,
                    data,
                    nodes, sections, gridSections, allNodes, fxsctPropExists = false;
                model = oController.getCurrentModel();
                data = response;

                nodes = oController.getNode(data, false, true);

                //*****Rel 60E_SP7 - QA #12664
                allNodes = underscoreJS.keys(response);
                if (underscoreJS.contains(allNodes, global.vui5.cons.nodeName.fixedSectionProp)) {
                    fxsctPropExists = true;
                }
                //*****

                underscoreJS.each(nodes, function (node) {
                    oController.updateMetdataProperties(node, data[node], fxsctPropExists);
                });


                if (!underscoreJS.isEmpty(nodes)) {
                    var path = oController._getPath(true);
                    model.setProperty(path, oController.getSections());
                    model.setProperty("/SECCFG", oController.sectionConfig);
                }
                sections = oController.getSectionsBy('DAPPT', global.vui5.cons.propertyType.table);
                gridSections = underscoreJS.where(sections, { "TBTYP": global.vui5.cons.tableType.grid });
                underscoreJS.each(gridSections, function (obj) {
                    oController.sectionRef[obj['SECTN']].onVuiGridInfocusSet();
                });

            },
            updateDocumentData: function (response) {

                var oController = this, model, data, setsdata, section, metadataRefresh = false, nodes, darid,
                    summarySection = {}, summaryDetails = {};
                var enableGrouping = false;

                model = oController.getModel(oController.modelName);
                data = response;

                nodes = oController.getNode(data, false);

                underscoreJS.each(nodes, function (node) {

                    //summaryDetails = {};
                    if (node === global.vui5.cons.nodeName.dropdowns) {
                        oController.updateDropdowns(data[node]);
                    } else {
                        if (commonUtils.checkStartsWith(global.vui5.cons.nodeName.evalGridPrefix, node)) {
                            return;
                        }
                        if (commonUtils.checkEndsWith(global.vui5.cons.nodeName.summaryViewSuffix, node)) {
                            darid = node.replace(global.vui5.cons.nodeName.summaryViewSuffix, "");
                            darid = darid.substr(0, darid.lastIndexOf("__"));
                            section = oController.getSectionBy('DARID', darid);
                        } else if (commonUtils.checkEndsWith(global.vui5.cons.nodeName.reportingViewSuffix, node)) {
                            darid = node.replace(global.vui5.cons.nodeName.reportingViewSuffix, "");
                            section = oController.getSectionBy('DARID', darid);
                            //*****Rel 60E_SP7
                        } else if (commonUtils.checkEndsWith(global.vui5.cons.nodeName.eventsSuffix, node)) {
                            darid = node.substr(0, node.indexOf("_"));
                            section = oController.getSectionBy('DARID', darid);
                            //*****
                        } else {
                            section = underscoreJS.findWhere(response[global.vui5.cons.nodeName.sections], {
                                'DARID': node
                            }) || oController.getSectionBy('DARID', node);
                        }

                        if (node.indexOf(global.vui5.cons.nodeName.layout) !== -1) {
                            section = underscoreJS.findWhere(response[global.vui5.cons.nodeName.sections], {
                                'DARID': node.substr(0, node.lastIndexOf("_"))
                            }) || oController.getSectionBy('DARID', node.substr(0, node.lastIndexOf("_")));
                        }

                        /***Rel 60E SP6 - QA #12006 - Start ***/
                        if (section && section['FXSCT'] &&
                            oController.getProfileInfo()['UITYP'] === global.vui5.cons.UIType.infocus) {

                            if (underscoreJS.findWhere(oController.getSections(), { 'DARID': node, 'FXSCT': '' })) {
                                section = underscoreJS.findWhere(oController.getSections(), { 'DARID': node, 'FXSCT': '' });
                            }

                            if (node.indexOf(global.vui5.cons.nodeName.layout) !== -1) {
                                section = underscoreJS.findWhere(oController.getSections(), { 'DARID': node.substr(0, node.lastIndexOf("_")), 'FXSCT': '' });
                            }
                        }
                        /***Rel 60E SP6 - QA #12006 - End ***/
                        if (!model.getProperty(oController._getPath())) {
                            model.setProperty(oController._getPath(), {});
                        }

                        switch (section && section['DAPPT']) {
                            case global.vui5.cons.propertyType.selections:
                                oController.processSearchData(section, data[node]);
                                break;
                            case global.vui5.cons.propertyType.evaluationForm:
                                if (!model.getProperty(oController._getPath())) {
                                    model.setProperty(oController._getPath(), {});
                                }
                                model.setProperty(oController._getPath() + node, data[node]);
                                underscoreJS.each(nodes, function (obj) {
                                    if (commonUtils.checkStartsWith(global.vui5.cons.nodeName.evalGridPrefix, obj)) {
                                        model.setProperty(oController._getPath() + obj, data[obj]);
                                    }
                                });

                                oController.sectionRef[section['SECTN']].updateModel();
                                break;
                            case global.vui5.cons.propertyType.reportingView:
                            case global.vui5.cons.propertyType.summary:
                                if (!model.getProperty(oController._getPath())) {
                                    model.setProperty(oController._getPath(), {});
                                }
                                //model.setProperty(oController._getPath() + node, data[node]);
                                /*if (oController._config &&
                                        oController._config.lastActionRef &&
                                        oController._config.lastActionRef['FNCNM'] === global.vui5.cons.eventName.layoutManage) {

                                    summaryDetails = underscoreJS.findWhere(section['SUMDATA'], { 'SUMID': node });

                                    if (summaryDetails) {
                                        if (summaryDetails['VWTYP'] === global.vui5.cons.viewType.chart) {
                                            oController.sectionRef[section['SECTN']].renderCharts(node);
                                        }
                                    }

                                }
                                else if (!summarySection[section['SECTN']]) {
                                    summarySection[section['SECTN']] = section['SECTN'];*/
                                //oController.sectionRef[section['SECTN']].renderSummaryView();
                                //}

                                if (!summarySection[section['SECTN']]) {
                                    if (section['SUMDATA'] && !underscoreJS.isEmpty(section['SUMDATA'])) {
                                        summarySection[section['SECTN']] = section['SECTN'];
                                        underscoreJS.each(section['SUMDATA'], function (sumdata, i) {
                                            var sumid = sumdata['SUMID'];
                                            if (data[sumid]) {
                                                model.setProperty(oController._getPath() + sumid, data[sumid]);
                                            }
                                        });
                                    }
                                    oController.sectionRef[section['SECTN']].renderSummaryView();
                                }

                                break;
                            //*****Rel 60E_SP7
                            case global.vui5.cons.propertyType.events:
                                if (!model.getProperty(oController._getPath())) {
                                    model.setProperty(oController._getPath(), {});
                                }
                                model.setProperty(oController._getPath() + node, data[node]);
                                break;
                            //*****                                
                            case global.vui5.cons.propertyType.synopsis:
                                if (!model.getProperty(oController._getPath())) {
                                    model.setProperty(oController._getPath(), {});
                                }
                                model.setProperty(oController._getPath() + node, data[node]);
                                oController.sectionRef[section['SECTN']].renderSynopsis();
                                break;
                            case global.vui5.cons.propertyType.treeTable:
                                oController.processTreeTableData(section, data[node]);
                                if (!model.getProperty(oController._getPath())) {
                                    model.setProperty(oController._getPath(), {});
                                }
                                model.setProperty(oController._getPath() + node, data[node]);

                                //*****Rel 60E_SP7
                                oController.sectionRef[section['SECTN']].prepareTableData();
                                //*****

                                //*****Rel 60E_SP6
                                var sectionPath = oController._getPath(true);
                                var sections = model.getProperty(sectionPath);
                                var sectionIndex = underscoreJS.indexOf(sections, section);
                                var sectionModelPath = sectionPath + sectionIndex + "/FUNC";
                                var segIndex = underscoreJS.findIndex(model.getProperty(sectionModelPath), function (obj) {
                                    if (!underscoreJS.isEmpty(obj['SEL_SEGMNT'])) { return obj; }
                                });
                                if (segIndex != -1) {
                                    oController._prepareToolBarContent(section['SECTN'], model.getProperty(sectionModelPath));
                                }
                                //*****                                
                                break;
                            case global.vui5.cons.propertyType.planningGrid:
                                if (model.getProperty(oController._getPath() + node)) {
                                    model.setProperty(oController._getPath() + node, []);
                                }
                                model.setProperty(oController._getPath() + node, data[node]);
                                oController.rdrgrid = true;
                                break;
                            case global.vui5.cons.propertyType.pricingGrid:
                                if (model.getProperty(oController._getPath() + node)) {
                                    model.setProperty(oController._getPath() + node, []);
                                }
                                model.setProperty(oController._getPath() + node, data[node]);
                                oController.rendergrid = true;
                                break;
                            case global.vui5.cons.propertyType.tree:
                                oController._processTreeData(section, data[node], node);
                                break;
                            case global.vui5.cons.propertyType.sets:
                                if (model.getProperty(oController._getPath() + node)) {
                                    model.setProperty(oController._getPath() + node, []);
                                }
                                setsdata = oController._processSetsData(data[node]);
                                model.setProperty(oController._getPath() + node, setsdata);
                                break;
                            case global.vui5.cons.propertyType.tradecalendar:
                                if (model.getProperty(oController._getPath() + node)) {
                                    model.setProperty(oController._getPath() + node, []);
                                }
                                model.setProperty(oController._getPath() + node, data[node]);
                                oController.sectionRef[section['SECTN']].DataPrepare(oController, section);
                                break;
                            case global.vui5.cons.propertyType.postings:
                                if (model.getProperty(oController._getPath() + node)) {
                                    model.setProperty(oController._getPath() + node, []);
                                }
                                model.setProperty(oController._getPath() + node, data[node]);
                                oController.sectionRef[section['SECTN']].postingInfocusSet()
                                break;
                            case global.vui5.cons.propertyType.dashboard:
                                var path = oController._getPath();
                                if (!model.getProperty(path)) {
                                    model.setProperty(path, {});
                                }
                                model.setProperty(path + node, data[node]);

                                //*****Rel 60E_SP6
                                //var filt = model.getProperty(path + node);
                                //oController.sectionRef[section['SECTN']].setProperty("filters", filt);
                                //*****
                                oController.sectionRef[section['SECTN']].renderDashboard(oController, section);
                                break;
                            //*****Rel 60E_SP6
                            case global.vui5.cons.propertyType.status:
                                var path = oController._getPath();
                                if (!model.getProperty(path)) {
                                    model.setProperty(path, {});
                                }
                                model.setProperty(path + node, data[node]);
                                oController.sectionRef[section['SECTN']].updateModel();
                                break;
                            case global.vui5.cons.propertyType.table:
                                var path = oController._getPath();
                                if (!model.getProperty(path)) {
                                    model.setProperty(path, {});
                                }
                                /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - Start ***/
                                if (node.indexOf(global.vui5.cons.nodeName.layout) === -1 && section['TBTYP'] !== global.vui5.cons.tableType.grid) {
                                    oController._prepareMultiTokenField(data, node);

                                    oController.applyTotalSubTotal(data, node + global.vui5.cons.nodeName.layout);
                                }
                                /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - End ***/



                                if (section['TBTYP'] === global.vui5.cons.tableType.nonresponsive &&
                                    oController.sectionRef[section['SECTN']] &&
                                    oController.sectionRef[section['SECTN']].getEnableGrouping() &&
                                    node.indexOf(global.vui5.cons.nodeName.layout) === -1) {
                                    oController.sectionRef[section['SECTN']].clearGrouping();
                                    if (oController.sectionRef[section['SECTN']].getGroupBy()) {
                                        oController.sectionRef[section['SECTN']].setGroupBy("")
                                    }
                                }

                                //oController.applyTotalSubTotal(data, node);
                                model.setProperty(path + node, data[node]);

                                //*****Rel 60E_SP6
                                var sectionPath = oController._getPath(true);
                                var sections = model.getProperty(sectionPath);
                                var sectionIndex = underscoreJS.indexOf(sections, section);
                                var sectionModelPath = sectionPath + sectionIndex + "/FUNC";
                                var segIndex = underscoreJS.findIndex(model.getProperty(sectionModelPath), function (obj) {
                                    if (!underscoreJS.isEmpty(obj['SEL_SEGMNT'])) { return obj; }
                                });
                                if (segIndex != -1) {
                                    oController._prepareToolBarContent(section['SECTN'], model.getProperty(sectionModelPath));
                                }
                                //*****

                                if (node.indexOf(global.vui5.cons.nodeName.layout) !== -1) {
                                    //oController.applyTotalSubTotal(data, node);
                                    if (section['TBTYP'] === global.vui5.cons.tableType.responsive &&
                                        oController.sectionRef[section['SECTN']]) {

                                        oController.sectionRef[section['SECTN']].vuiPrepareFooter();
                                    }
                                }
                                if (section['TBTYP'] === global.vui5.cons.tableType.nonresponsive &&
                                    node.indexOf(global.vui5.cons.nodeName.layout) === -1 &&
                                    oController.sectionRef[section['SECTN']]) {
                                    oController.sectionRef[section['SECTN']].clearSelection();
                                }
                                break;
                            //*****
                            //*****Rel 60E_SP6    
                            case global.vui5.cons.propertyType.heatMap:
                                var path = oController._getPath();
                                if (!model.getProperty(path)) {
                                    model.setProperty(path, {});
                                }
                                model.setProperty(path + node, data[node]);

                                oController.sectionRef[section['SECTN']].onHeatMapInfocusSet();
                                var sectionPath = oController._getPath(true);
                                var sections = model.getProperty(sectionPath);
                                var sectionIndex = underscoreJS.indexOf(sections, section);
                                var sectionModelPath = sectionPath + sectionIndex + "/FUNC";
                                var segIndex = underscoreJS.findIndex(model.getProperty(sectionModelPath), function (obj) {
                                    if (!underscoreJS.isEmpty(obj['SEL_SEGMNT'])) { return obj; }
                                });
                                if (segIndex != -1) {
                                    oController._prepareToolBarContent(section['SECTN'], model.getProperty(sectionModelPath));
                                }
                                break;
                            case global.vui5.cons.propertyType.hierarchyTree:
                                var path = oController._getPath();
                                if (!model.getProperty(path)) {
                                    model.setProperty(path, {});
                                }
                                model.setProperty(path + node, data[node]);

                                oController.sectionRef[section['SECTN']].onHierarchyTreeInfocusSet();
                                var sectionPath = oController._getPath(true);
                                var sections = model.getProperty(sectionPath);
                                var sectionIndex = underscoreJS.indexOf(sections, section);
                                var sectionModelPath = sectionPath + sectionIndex + "/FUNC";
                                var segIndex = underscoreJS.findIndex(model.getProperty(sectionModelPath), function (obj) {
                                    if (!underscoreJS.isEmpty(obj['SEL_SEGMNT'])) { return obj; }
                                });
                                if (segIndex != -1) {
                                    oController._prepareToolBarContent(section['SECTN'], model.getProperty(sectionModelPath));
                                }
                                break;
                            case global.vui5.cons.propertyType.availsHeader:
                                var path = oController._getPath();
                                if (!model.getProperty(path)) {
                                    model.setProperty(path, {});
                                }
                                model.setProperty(path + node, data[node]);

                                oController.sectionRef[section['SECTN']].onAvailsHeaderInfocusSet();

                                break;
                            //*****    
                            case global.vui5.cons.propertyType.pdfViewer:

                                var path = oController._getPath(); // copy
                                // popup
                                if (!model.getProperty(path)) {
                                    model.setProperty(path, {});
                                }

                                data[node] = data[node].replace("GUIID", global.vui5.server.url.guiId);
                                data[node] = data[node].replace("APPID", oController.getApplicationIdentifier());

                                model.setProperty(path + node, data[node]);
                                break;
                            case global.vui5.cons.propertyType.overviewPage:
                                if (!model.getProperty(oController._getPath())) {
                                    model.setProperty(oController._getPath(), {});
                                }
                                model.setProperty(oController._getPath() + node, data[node]);

                                oController.sectionRef[section['SECTN']].renderPageContent();
                                break;
                            default:

                                if (section && (section['DAPPT'] === global.vui5.cons.propertyType.form ||
                                    section['DAPPT'] === global.vui5.cons.propertyType.snappingHeader)) {
                                    oController._prepareMultiTokenField(data, node);
                                }

                                var path = oController._getPath(); // copy
                                // popup
                                if (!model.getProperty(path)) {
                                    model.setProperty(path, {});
                                }
                                model.setProperty(path + node, data[node]);

                                //*****Rel 60E_SP7
                                if (oController[global.vui5.ui.callBack.updateDocumentData] instanceof Function) {
                                    oController[global.vui5.ui.callBack.updateDocumentData].call(oController, section);
                                }
                            //*****
                        }
                    }
                });

                oController.collapseDynamicPageHeader();
            },
            updateMetdataProperties: function (node, response, fxsctPropExists) {

                var oController = this;

                switch (node) {
                    case global.vui5.cons.nodeName.elementAttributes:
                        oController._processElementAttributes(response);
                        break;
                    case global.vui5.cons.nodeName.docFuncProp:
                    case global.vui5.cons.nodeName.popupFunctionProp:
                        oController._processDocumentFunctionProp(response);
                        break;
                    case global.vui5.cons.nodeName.sectionProperties:
                        oController._processSectionProperties(response);
                        break;
                    default:
                        oController._processDataAreaProperties(node, response, fxsctPropExists);
                }
            },

            getNode: function (response, metadata, properties) {
                return underscoreJS.filter(Object.keys(response).sort(), function (node) {
                    if (properties) {
                        return node === global.vui5.cons.nodeName.elementAttributes ||
                            // node.indexOf(global.vui5.cons.nodeName.propSuffix) !== -1;
                            // node.endsWith(global.vui5.cons.nodeName.propSuffix);
                            commonUtils.checkEndsWith(global.vui5.cons.nodeName.propSuffix, node);
                    }

                    if (metadata) {
                        return node === global.vui5.cons.nodeName.sections ||
                            /***Rel 60E SP6 ECIP #17325 - Start ****/
                            //node === global.vui5.cons.nodeName.documentFunctions;
                            node === global.vui5.cons.nodeName.popupFunctions ||
                            node === global.vui5.cons.nodeName.documentFunctions ||
                            node === global.vui5.cons.nodeName.sectionConfig
                        /***Rel 60E SP6 ECIP #17325 - End ****/
                    } else {
                        return node !== global.vui5.cons.nodeName.elementAttributes &&
                            !commonUtils.checkEndsWith(global.vui5.cons.nodeName.propSuffix, node) &&
                            node !== global.vui5.cons.nodeName.sections &&
                            /***Rel 60E SP6 ECIP #17325 - Start ****/
                            node !== global.vui5.cons.nodeName.sectionConfig &&
                            /***Rel 60E SP6 ECIP #17325 - End ****/
                            node !== global.vui5.cons.nodeName.documentFunctions;
                        /* &&
                                       node !== global.vui5.cons.nodeName.tradeCalendar &&
                                     //  node !== global.vui5.cons.nodeName.postings &&
                                      // node !== global.vui5.cons.nodeName.inclusions &&
                                       //node !== global.vui5.cons.nodeName.exclusions &&
                                       node !== global.vui5.cons.nodeName.review;*/

                    }
                });


            },
            updateMetadata: function (response) {

                var oController = this,
                    data,
                    nodes,
                    section,
                    params,
                    locationHash, documentFunctions = [];
                var model = oController.getModel(oController.modelName);
                var mainModel = oController.getMainModel();
                var lineLayout = oController.getProfileInfo()['UILYT'];
                /**** Rel 60E SP6 - FullScreen Support changes - Start ***/
                /*** Tabbed layout support in popup***/
                // if(oController._formDialog)
                if (oController._formDialog && oController.popupInitCall) {
                    /****/
                    delete oController.popupInitCall;
                    oController._bufferSectionConfig(true);
                }
                /**** Rel 60E SP6 - FullScreen Support changes - End ***/
                if (response['SECTN']) {

                    if (oController.getProfileInfo()['UITYP'] === global.vui5.cons.UIType.worklist && response['SECTN'] && !oController._formDialog) {
                        if (underscoreJS.isObject(underscoreJS.findWhere(response['SECTN'], { 'DAPPT': global.vui5.cons.propertyType.variant }))) {
                            response['SECTN'][0]['FXSCT'] = 'X';
                            response['SECTN'][1]['FXSCT'] = 'X';
                        }
                        else if (underscoreJS.isObject(underscoreJS.findWhere(response['SECTN'], { 'DAPPT': global.vui5.cons.propertyType.selections }))) {
                            response['SECTN'][0]['FXSCT'] = 'X';
                        }
                    }

                    /*In case of Dynamic Page, even though there is no Fixed Section we need to add Fixed Section
                    in order to show Back Button/Document Functions
                    */
                    if (mainModel.getProperty("/DYNAMIC_PAGE")) {
                        if (global.vui5.fromOtherApp || (oController.getDocumentNumberFromUrl() &&
                            !oController._formDialog /*&& oController.getApplicationIdentifier() !== global.vui5.cons.applicationIdentifier.reportingView*/)) {

                            if (global.vui5.session.fromFioriLaunchpad && oController.getApplicationIdentifier() === global.vui5.cons.applicationIdentifier.reportingView) {
                            }
                            else {
                                if (underscoreJS.isEmpty(underscoreJS.findWhere(response['SECTN'], { 'FXSCT': 'X' }))) {
                                    response['SECTN'].push({
                                        'FXSCT': "X",
                                        'SCGRP': '',
                                        'HDSCT': '',
                                        'DAPPT': 'SH',
                                        'FIELDS': [],
                                        'SECTN': '$$SH$$',
                                        'LDMDT': global.vui5.cons.loadMetaData.once


                                    });
                                }
                            }

                        }
                    }

                    oController._updateSectionConfig(response['SECTN']);
                    model.setProperty("/SECCFG", oController.sectionConfig);
                    var fSections = underscoreJS.find(response['SECTN'], { FXSCT: "X" });
                    fSections ? model.setProperty("/FIXED_SECTN", fSections) : "";
                }
                data = response;

                oController.modifySpecialCharacters(data);
                nodes = oController.getNode(response, true);


                /* Temporary Fix for Posting & Trade Cal. */
                var postings = underscoreJS.where(underscoreJS.isEmpty(oController.getSections()) ? response['SECTN'] : oController.getSections()
                    , {
                        DAPPT: global.vui5.cons.propertyType.postings
                    });
                underscoreJS.each(postings, function (obj, i) {

                    if (data[obj['DARID']]) {
                        if (!model.getProperty(oController._getPath())) {
                            model.setProperty(oController._getPath(), {});
                        }
                        model.setProperty(oController._getPath() + obj['DARID'], data[obj['DARID']]);
                    }
                });

                oController.determineDynamicHeaderTitleVisiblity(response);
                underscoreJS.each(nodes, function (node) {
                    switch (node) {
                        case global.vui5.cons.nodeName.sections:
                            /*** Tabbed layout support in popup**/
                            //   if (lineLayout === global.vui5.cons.layoutType.line || oController._formDialog || oController.getLoadFullPage()) {
                            if (lineLayout === global.vui5.cons.layoutType.line || oController.getLoadFullPage()) {
                                /***/
                                if (oController._formDialog || oController.getLoadFullPage()) {
                                    var fixedSections = underscoreJS.where(data[node], {
                                        FXSCT: "X"
                                    });
                                    if (fixedSections.length > 0) {
                                        var indexes = [];
                                        indexes = $.map(data[node], function (obj, index) {
                                            if (obj.FXSCT == "X") {
                                                data[node].splice(index, 1);
                                                data[node].splice(0, 0, obj);
                                            }
                                        });
                                    }
                                    /*** Tabbed layout support in popup**/
                                    //                                    if (oController._formDialog) {
                                    //                                        oController.getCurrentModel().setProperty("/POPUP_PROP", []);
                                    //                                        model.setProperty('/POPUP_TITLE', data['POPUP_TITLE']);
                                    //                                        if (data['POPUP_PROP']) {
                                    //                                            model.setProperty('/POPUP_PROP', data['POPUP_PROP']);
                                    //                                        }
                                    //                                        // oController._bufferSectionConfig(true);
                                    //                                        // data['POPUP_TITLE'] ?
                                    //                                        // oController._popup.setTitle(data['POPUP_TITLE'])
                                    //                                        // : "";
                                    //                                        // data['FULLVIEW'] === "X" ?
                                    //                                        // oController._popup.setStretch(true) :
                                    //                                        // "";
                                    //                                    }

                                }

                                var path = oController._getPath(true); // popup
                                //*****Rel 60E_SP7
                                var eventsSections = underscoreJS.where(data[node], { DAPPT: global.vui5.cons.propertyType.events });
                                if (eventsSections) {
                                    underscoreJS.each(eventsSections, function (eventSection) {
                                        if (!underscoreJS.isObject(eventSection["METADATA"])) {
                                            eventSection['METADATA'] = JSON.parse(eventSection['METADATA']);
                                        }
                                    });
                                }
                                //*****

                                model.setProperty(path, data[node]);

                            } else if (lineLayout === global.vui5.cons.layoutType.tab || global.vui5.cons.layoutType.pageWithTabs) {

                                var path = oController._getPath(true); // popup
                                var sections = model.getProperty(path);
                                /*** Tabbed layout support in popup**/
                                // if (sections) {
                                if (sections && sections.length > 0) {
                                    underscoreJS.each(data[node], function (obj) {
                                        var index = underscoreJS.findIndex(sections, {
                                            SECTN: obj.SECTN
                                        });
                                        if (index != undefined) {
                                            if (sections[index] === obj) {
                                                // oController._updateTabBarAggregations
                                                // = true;
                                            }
                                            sections[index] = obj;
                                        }
                                    });

                                } else {
                                    sections = data[node];
                                }

                                //*****Rel 60E_SP7
                                var eventsSections = underscoreJS.where(sections, { DAPPT: global.vui5.cons.propertyType.events });
                                if (eventsSections) {
                                    underscoreJS.each(eventsSections, function (eventSection) {
                                        if (!underscoreJS.isObject(eventSection["METADATA"])) {
                                            eventSection['METADATA'] = JSON.parse(eventSection['METADATA']);
                                        }
                                    });
                                }
                                //*****

                                model.setProperty(path, sections);

                                if (oController.getQueryParam("tab")) {
                                    section = oController.getSectionBy("SECTN", oController.getQueryParam("tab"));
                                    if (section && section['HDSCT']) {
                                        params = oController.getUrlParamsFromUrl(true); // Remove
                                        // Tab
                                        // from
                                        // URL
                                        locationHash = location.hash.split("?")[0] + params;
                                        window.location.replace(window.location.origin + window.location.pathname + locationHash);
                                    }
                                }
                            }
                            /*** Tabbed layout support in popup**/
                            if (oController._formDialog) {
                                oController.getCurrentModel().setProperty("/POPUP_PROP", []);
                                model.setProperty('/POPUP_TITLE', data['POPUP_TITLE']);
                                if (data['POPUP_PROP']) {
                                    model.setProperty('/POPUP_PROP', data['POPUP_PROP']);
                                }
                                // oController._bufferSectionConfig(true);
                                // data['POPUP_TITLE'] ?
                                // oController._popup.setTitle(data['POPUP_TITLE'])
                                // : "";
                                // data['FULLVIEW'] === "X" ?
                                // oController._popup.setStretch(true) :
                                // "";
                            }

                            break;
                        case global.vui5.cons.nodeName.documentFunctions:


                            data[node].unshift({
                                'FNCNM': global.vui5.cons.eventName.toolBarSpacer,
                                'NXSCT': ""
                            });

                            data[node].unshift({
                                'FNCNM': global.vui5.cons.eventName.messageButton,
                                'NXSCT': ""
                            });


                            underscoreJS.each(data[node], function (doFunction) {
                                doFunction['SECTN'] = "";

                                if (global.vui5.session.fromFioriLaunchpad &&
                                    doFunction['FNCNM'] === global.vui5.cons.eventName.continue &&
                                    !underscoreJS.isEmpty(oController.getDrillDownBuffer())) {
                                    doFunction['HIDFN'] = 'X';
                                }
                            });
                            model.setProperty("/DOFUN", data[node]);

                            break;
                        case global.vui5.cons.nodeName.popupFunctions:
                            oController.processPopupFunctions(response);
                            break;
                    }

                });


            },
            updateDropdowns: function (dropdowns) {

                var oController = this;
                var mainModel,
                    final_values;

                mainModel = this.getOwnerComponent().getModel(global.vui5.modelName);
                final_values = mainModel.getProperty("/DROPDOWNS");
                underscoreJS.each(dropdowns, function (obj) {
                    if (!final_values[obj['DARID']]) {
                        final_values[obj['DARID']] = {};
                    }
                    final_values[obj['DARID']][oController._specialCharacterReplace(obj['FIELD'])] = obj['VALUE'];
                });
                mainModel.setProperty("/DROPDOWNS", final_values);
            },
            _handleSaveConfirmation: function (sectionID, action, params, urlParams) {
                var oController = this,
                    objDefer = $.Deferred(),
                    promise;

                if (oController.getMainModel().getProperty("/DATA_CHANGED")) {
                    oController._processBufferAction(true, sectionID, action, params, urlParams).then(function () {
                        objDefer.resolve();
                    }).fail(function () {
                        objDefer.reject();
                    });
                } else {
                    promise = oController._UpdateChanges(sectionID);
                    promise.then(function () {
                        if (oController.getMainModel().getProperty("/DATA_CHANGED")) {
                            oController._processBufferAction(true, sectionID, action, params, urlParams).then(function () {
                                objDefer.resolve();
                            }).fail(function () {
                                objDefer.reject();
                            });
                        } else {
                            action['SVCFM'] = "";
                            oController.processAction(sectionID, action, params, urlParams).then(function () {
                                objDefer.resolve();
                            }).fail(function () {
                                objDefer.reject();
                            });
                        }
                    }).fail(function () {
                        objDefer.reject();
                    })
                }

                return objDefer.promise();

            },
            getChangedNodes: function (modelPath, section) {
                var oController = this,
                    model = oController.getModel(oController.modelName), changedData = [];

                if (underscoreJS.isEmpty(section['UPDDT'])) {
                    underscoreJS.each(model.getProperty(modelPath), function (obj, i) {
                        var childNodes = obj['CHILDNODE'];
                        if (obj['__UPDKZ']) {
                            changedData.push(obj)
                        }
                        if (obj['CHILDNODE'] && obj['CHILDNODE'].length != 0) {
                            oController.getChangedChildNodes(childNodes, changedData);
                        }
                    })
                }

                underscoreJS.each(changedData, function (data) {
                    if (data['CHILDNODE']) {
                        delete data['CHILDNODE'];
                    }
                });
                return changedData;
            },
            getChangedChildNodes: function (childNodes, changedData) {
                var oController = this;
                //  childNodes = node['CHILDNODE'];
                for (var j = 0; j < childNodes.length; j++) {

                    if (childNodes[j]['__UPDKZ']) {
                        changedData.push(childNodes[j])
                    }
                    if (childNodes[j]['CHILDNODE'] && childNodes[j]['CHILDNODE'].length != 0) {
                        oController.getChangedChildNodes(childNodes[j]['CHILDNODE'], changedData)
                    }
                }
            },

            /*** Rel 60E SP6 - Planning/Pricing Related changes - Start **/
            /** Rel SP7 - Cursor Position Changes Start**/
            //            getChangedData: function (dataAreaList) {
            getChangedData: function (dataAreaList, action) {
                /** Rel SP7 - Cursor Position Changes End**/
                var oController = this, variantData, setValuesData;
                var model = oController.getModel(oController.modelName),
                    docData,
                    section,
                    objData = {},
                    dataArea,
                    modelPath,
                    changedData,
                    objDefer = $.Deferred(),
                    count = 0, applicationPromise;
                var mainModel = oController.getModel(global.vui5.modelName);
                var path = oController._getPath();
                docData = model.getProperty(path);

                for (var i in docData) {
                    if (docData.hasOwnProperty(i)) {
                        //*****Rel 60E_SP7
                        if (i.indexOf(global.vui5.cons.nodeName.eventsSuffix) != -1) {
                            var nodeName = i;
                            i = i.substr(0, i.indexOf(global.vui5.cons.nodeName.eventsSuffix));
                            i = i.substr(0, i.lastIndexOf("_"));
                        }
                        //*****
                        if ((underscoreJS.isArray(dataAreaList) && dataAreaList.indexOf(i) !== -1) || (i === dataAreaList) || (!dataAreaList)) {
                            dataArea = i;
                            modelPath = path + dataArea;
                            section = oController.getSectionBy('DARID', dataArea);
                            if (section && section['DISOL'] && section['DAPPT'] !== global.vui5.cons.propertyType.table) {
                                continue;
                            }
                            switch (section && section['DAPPT']) {
                                case global.vui5.cons.propertyType.selections:
                                    var oSel = commonUtils.selectionsPrepare(model.getProperty(modelPath + "/SRCH_DATA"));
                                    //*****Rel 60E_SP6 - Sanofi Req
                                    changedData = oController.removeInvalidSelections(oSel);
                                    //*****
                                    oController.modifySpecialCharacters({ "SELECTIONS": changedData });
                                    break;
                                //*****Rel 60E_SP7
                                case global.vui5.cons.propertyType.events:
                                    objData[nodeName] = model.getProperty(path + nodeName);
                                    break;
                                //*****
                                case global.vui5.cons.propertyType.treeTable:
                                    if (oController.sectionRef[section['SECTN']]) {
                                        changedData = oController.getChangedNodes(modelPath, section);
                                    }
                                    break;
                                case global.vui5.cons.propertyType.table:
                                    if (oController.sectionRef[section['SECTN']]) {


                                        if (section['TBTYP'] === global.vui5.cons.tableType.responsive) {

                                            changedData = underscoreJS.isEmpty(section['UPDDT']) ?
                                                oController.sectionRef[section['SECTN']].getChangedRows() :
                                                model.getProperty(modelPath);

                                            if (!underscoreJS.isEmpty(changedData)) {
                                                if (oController.changedRowsSections === undefined) {
                                                    oController.changedRowsSections = [];
                                                }
                                                oController.changedRowsSections.push(section['SECTN']);
                                            }


                                        }  /**REL 60E_SP7 Grid 3.0 **/
                                        else if (section['TBTYP'] === global.vui5.cons.tableType.nonresponsive) {
                                            // else  {
                                            /***/

                                            changedData = underscoreJS.isEmpty(section['UPDDT']) ?
                                                underscoreJS.reject(model.getProperty(modelPath), function (obj) {
                                                    return (obj['__UPDKZ'] == undefined || obj['__UPDKZ'] == "");
                                                }) : model.getProperty(modelPath);

                                            if (!underscoreJS.isEmpty(changedData)) {
                                                if (oController.changedRowsSections === undefined) {
                                                    oController.changedRowsSections = [];
                                                }
                                                oController.changedRowsSections.push(section['SECTN']);
                                            }

                                        }



                                        variantData = oController.sectionRef[section['SECTN']].getVariantData();
                                        if (!underscoreJS.isEmpty(variantData)) {
                                            changedData = variantData;
                                        }
                                        /**REL 60E_SP7 Grid 3.0 **/
                                        if (section['TBTYP'] !== global.vui5.cons.tableType.grid) {
                                            /***/
                                            setValuesData = oController.sectionRef[section['SECTN']].getSetValueData();
                                            if (!underscoreJS.isEmpty(setValuesData)) {
                                                changedData = setValuesData;
                                            }
                                        }

                                    }

                                    break;
                                case global.vui5.cons.propertyType.notes:
                                    if (oController.sectionRef[section['SECTN']]) {
                                        changedData = oController.sectionRef[section['SECTN']]._getChangedData();
                                        break;
                                    }
                                    break;
                                case global.vui5.cons.propertyType.attachments:
                                    if (oController.sectionRef[section['SECTN']]) {
                                        changedData = oController.sectionRef[section['SECTN']]._getChangedData();
                                        break;
                                    }
                                    break;
                                case global.vui5.cons.propertyType.texts:
                                    if (oController.sectionRef[section['SECTN']]) {
                                        changedData = oController.sectionRef[section['SECTN']]._getChangedData();
                                        break;
                                    }

                                    break;
                                case global.vui5.cons.propertyType.evaluationForm:
                                    if (oController.sectionRef[section['SECTN']]) {
                                        changedData = oController.sectionRef[section['SECTN']]._getChangedData(dataArea);
                                        objData = underscoreJS.extend(objData, changedData);
                                        break;
                                    }
                                    break;
                                case global.vui5.cons.propertyType.tradecalendar:
                                    if (oController.sectionRef[section['SECTN']]) {
                                        changedData = oController.sectionRef[section['SECTN']]._getChangedData();
                                        break;
                                    }
                                    break;
                                case global.vui5.cons.propertyType.partners:
                                    if (oController.sectionRef[section['SECTN']]) {
                                        changedData = oController.sectionRef[section['SECTN']]._getChangedData();
                                        break;
                                    }
                                    break;
                                /* Attribute Molecule Changes */
                                case global.vui5.cons.propertyType.attributes:
                                    //-start -getchangedRows
                                    //                                    var sectionData = model.getProperty(modelPath);
                                    //                                    var updateData = [];
                                    //                                    underscoreJS.each(sectionData, function(attribute) {
                                    //                                        if (attribute.__UPDKZ == 'X') {
                                    //                                            var updateDataTemp = underscoreJS.filter(attribute.DATA, function(row) {
                                    //                                                return row.__UPDKZ == 'X';
                                    //                                            });
                                    //                                            updateData = underscoreJS.union(updateData, updateDataTemp);
                                    //                                        };
                                    //                                    });
                                    //                                    changedData = updateData;
                                    var updateData = [];
                                    if (oController.sectionRef[section['SECTN']]) {
                                        changedData = oController.sectionRef[section['SECTN']].__getChangedRows();

                                        underscoreJS.each(changedData, function (attribute) {

                                            var updateDataTemp = underscoreJS.filter(attribute.DATA, function (row) {
                                                //                                              return row.__UPDKZ == 'X';
                                                return row;
                                            });
                                            updateData = underscoreJS.union(updateData, updateDataTemp);

                                        });
                                        changedData = updateData;
                                        break;
                                    }
                                    //-getchangedRows -end
                                    break;

                                case global.vui5.cons.propertyType.tree:
                                    if (oController.sectionRef[section['SECTN']]) {
                                        changedData = oController.sectionRef[section['SECTN']].getChangedRows();
                                        break;
                                    }
                                    break;
                                case global.vui5.cons.propertyType.statementEditor:
                                    if (oController.sectionRef[section['SECTN']]) {
                                        changedData = {
                                            "DGFLD": JSON.stringify(oController.sectionRef[section['SECTN']].getUpdatedData() || {})
                                        };
                                    }
                                    break;
                                case global.vui5.cons.propertyType.reportingView:
                                case global.vui5.cons.propertyType.summary:
                                    if (oController.sectionRef[section['SECTN']]) {
                                        changedData = oController.sectionRef[section['SECTN']].getChangedData(dataArea);
                                    }
                                    break;
                                case global.vui5.cons.propertyType.planningGrid:
                                case global.vui5.cons.propertyType.pricingGrid:
                                    if (oController.sectionRef[section['SECTN']]) {
                                        var darid = section['DARID'];
                                        var sectionId = section['SECTN'];
                                        var sectionConfig = oController.sectionConfig[section['SECTN']];
                                        changedData = oController.sectionRef[section['SECTN']].getChangedData();
                                        if (changedData && $.isFunction(changedData.promise)) {
                                            count++;
                                            changedData.then(function (data) {
                                                count--;
                                                var gridLayoutData = oController.sectionRef[sectionId].getGridSettingsData();
                                                var gridVariantsData = oController.sectionRef[sectionId].getGridVariantsData();
                                                var section = oController.getSectionBy('DARID', darid);
                                                if (section['DAPPT'] == global.vui5.cons.propertyType.planningGrid) {
                                                    objData[darid + sectionConfig.attributes['selectedLayout'] + '__PGLAYOUT'] = gridLayoutData;
                                                    objData[darid + sectionConfig.attributes['selectedLayout'] + '__PGVARIANT'] = gridVariantsData;
                                                }
                                                else {
                                                    objData[darid + '__PGLAYOUT'] = gridLayoutData;
                                                    objData[darid + '__PGVARIANT'] = gridVariantsData;
                                                }
                                                /** Rel SP7 - Cursor Position Changes Start**/
                                                if (action && (action['FNCNM'] == global.vui5.cons.eventName.check ||
                                                    action['FNCNM'] == global.vui5.cons.eventName.chck)) {
                                                    oController.sectionRef[sectionId].setCursrPosition(true);
                                                }
                                                else {
                                                    oController.sectionRef[sectionId].setCursrPosition(false);
                                                }
                                                /** Rel SP7 - Cursor Position Changes End**/

                                                if (data && ((underscoreJS.isArray(data) && data.length > 0) || (underscoreJS.isObject(data) && !underscoreJS.isArray(data)))) {
                                                    objData[darid] = data;

                                                }
                                                if (count === 0) {
                                                    objDefer.resolve(underscoreJS.isEmpty(objData) ? '' : objData)
                                                }
                                            });
                                        }
                                    }
                                    break;
                                //                                case global.vui5.cons.propertyType.pricingGrid:
                                //                                    if (oController.sectionRef[section['SECTN']]) {
                                //                                        var darid = section['DARID'];
                                //                                        var sectionId = section['SECTN'];
                                //                                        var sectionConfig = oController.sectionConfig[section['SECTN']];
                                //                                        changedData = oController.sectionRef[section['SECTN']].getChangedData();
                                //                                        if (changedData && $.isFunction(changedData.promise)) {
                                //                                            count++;
                                //                                            changedData.then(function (data) {
                                //                                                count--;
                                //                                                var gridLayoutData = oController.sectionRef[sectionId].getGridSettingsData();
                                //                                                objData[darid + sectionConfig.attributes['selectedLayout'] + '__PGLAYOUT'] = gridLayoutData;
                                //
                                //                                                var gridVariantsData = oController.sectionRef[sectionId].getGridVariantsData();
                                //                                                objData[darid + sectionConfig.attributes['selectedLayout'] + '__PGVARIANT'] = gridVariantsData;
                                //                                                
                                //                                                if (data && ((underscoreJS.isArray(data) && data.length > 0) || (underscoreJS.isObject(data) && !underscoreJS.isArray(data)))) {
                                //                                                    objData[darid] = data;
                                //                                                }
                                //                                                if (count === 0) {
                                //                                                    objDefer.resolve(underscoreJS.isEmpty(objData) ? '' : objData)
                                //                                                }
                                //                                            });
                                //                                        }
                                //                                    }
                                //                                    break;
                                default:
                                    //*****Rel 60E_SP7
                                    if (oController[global.vui5.ui.callBack.getChangedData] instanceof Function) {
                                        changedData = oController[global.vui5.ui.callBack.getChangedData].call(oController, section);
                                        if (changedData) {
                                            var darid = section['DARID'];
                                            count++;
                                            changedData.then(function () {
                                                count--;
                                                if (count === 0) {
                                                    objData[darid] = model.getProperty(modelPath);
                                                    objDefer.resolve(underscoreJS.isEmpty(objData) ? '' : objData)
                                                }

                                            })
                                        }
                                    }
                                    //*****

                                    changedData = model.getProperty(modelPath);
                            }
                            if (section && section['DAPPT'] == global.vui5.cons.propertyType.evaluationForm) {
                                continue;
                            }
                            if (changedData && ((underscoreJS.isArray(changedData) && changedData.length > 0) || (underscoreJS.isObject(changedData) && !underscoreJS.isArray(changedData)))) {
                                objData[dataArea] = changedData;
                            }
                        }
                    }
                }

                if (count === 0) {
                    objDefer.resolve(underscoreJS.isEmpty(objData) ? '' : objData)
                }

                return objDefer.promise();
            },

            //getChangedData: function (dataAreaList) {

            //    var oController = this,
            //        variantData,
            //        setValuesData;
            //    var model = oController.getModel(oController.modelName),
            //        docData,
            //        section,
            //        objData = {},
            //        dataArea,
            //        modelPath,
            //        changedData;
            //    var mainModel = oController.getModel(global.vui5.modelName);
            //    var path = oController._getPath();
            //    docData = model.getProperty(path);

            //    for (var i in docData) {
            //        if (docData.hasOwnProperty(i)) {
            //            if ((underscoreJS.isArray(dataAreaList) && dataAreaList.indexOf(i) !== -1) || (i === dataAreaList) || (!dataAreaList)) {
            //                dataArea = i;
            //                modelPath = path + dataArea;
            //                section = oController.getSectionBy('DARID', dataArea);
            //                if (section && section['DISOL']) {
            //                    continue;
            //                }
            //                switch (section && section['DAPPT']) {
            //                    case global.vui5.cons.propertyType.selections:
            //                        changedData = commonUtils.selectionsPrepare(model.getProperty(modelPath + "/SRCH_DATA"));
            //                        oController.modifySpecialCharacters({ "SELECTIONS": changedData });
            //                        break;
            //                    case global.vui5.cons.propertyType.treeTable:
            //                        if (oController.sectionRef[section['SECTN']]) {
            //                            changedData = oController.getChangedNodes(modelPath, section);
            //                        }
            //                        break;
            //                    case global.vui5.cons.propertyType.table:
            //                        if (oController.sectionRef[section['SECTN']]) {


            //                            if (section['TBTYP'] === global.vui5.cons.tableType.responsive) {

            //                                changedData = underscoreJS.isEmpty(section['UPDDT']) ?
            //                                    oController.sectionRef[section['SECTN']].getChangedRows() :
            //                                    model.getProperty(modelPath);

            //                                if (!underscoreJS.isEmpty(changedData)) {
            //                                    if (oController.changedRowsSections === undefined) {
            //                                        oController.changedRowsSections = [];
            //                                    }
            //                                    oController.changedRowsSections.push(section['SECTN']);
            //                                }


            //                            } else {

            //                                changedData = underscoreJS.isEmpty(section['UPDDT']) ?
            //                                    underscoreJS.reject(model.getProperty(modelPath), function (obj) {
            //                                        return (obj['__UPDKZ'] == undefined || obj['__UPDKZ'] == "");
            //                                    }) : model.getProperty(modelPath);

            //                                if (!underscoreJS.isEmpty(changedData)) {
            //                                    if (oController.changedRowsSections === undefined) {
            //                                        oController.changedRowsSections = [];
            //                                    }
            //                                    oController.changedRowsSections.push(section['SECTN']);
            //                                }

            //                            }



            //                            variantData = oController.sectionRef[section['SECTN']].getVariantData();
            //                            if (!underscoreJS.isEmpty(variantData)) {
            //                                changedData = variantData;
            //                            }

            //                            setValuesData = oController.sectionRef[section['SECTN']].getSetValueData();
            //                            if (!underscoreJS.isEmpty(setValuesData)) {
            //                                changedData = setValuesData;
            //                            }


            //                        }

            //                        break;
            //                    case global.vui5.cons.propertyType.notes:
            //                        if (oController.sectionRef[section['SECTN']]) {
            //                            changedData = oController.sectionRef[section['SECTN']]._getChangedData();
            //                            break;
            //                        }
            //                        break;
            //                    case global.vui5.cons.propertyType.attachments:
            //                        if (oController.sectionRef[section['SECTN']]) {
            //                            changedData = oController.sectionRef[section['SECTN']]._getChangedData();
            //                            break;
            //                        }
            //                        break;
            //                    case global.vui5.cons.propertyType.texts:
            //                        if (oController.sectionRef[section['SECTN']]) {
            //                            changedData = oController.sectionRef[section['SECTN']]._getChangedData();
            //                            break;
            //                        }

            //                        break;
            //                    case global.vui5.cons.propertyType.evaluationForm:
            //                        if (oController.sectionRef[section['SECTN']]) {
            //                            changedData = oController.sectionRef[section['SECTN']]._getChangedData(dataArea);
            //                            objData = underscoreJS.extend(objData, changedData);
            //                            break;
            //                        }
            //                        break;
            //                    case global.vui5.cons.propertyType.tradecalendar:
            //                        if (oController.sectionRef[section['SECTN']]) {
            //                            changedData = oController.sectionRef[section['SECTN']]._getChangedData();
            //                            break;
            //                        }
            //                        break;
            //                    case global.vui5.cons.propertyType.partners:
            //                        if (oController.sectionRef[section['SECTN']]) {
            //                            changedData = oController.sectionRef[section['SECTN']]._getChangedData();
            //                            break;
            //                        }
            //                        break;
            //                        /* Attribute Molecule Changes */
            //                    case global.vui5.cons.propertyType.attributes:
            //                        //-start -getchangedRows
            //                        //                                    var sectionData = model.getProperty(modelPath);
            //                        //                                    var updateData = [];
            //                        //                                    underscoreJS.each(sectionData, function(attribute) {
            //                        //                                        if (attribute.__UPDKZ == 'X') {
            //                        //                                            var updateDataTemp = underscoreJS.filter(attribute.DATA, function(row) {
            //                        //                                                return row.__UPDKZ == 'X';
            //                        //                                            });
            //                        //                                            updateData = underscoreJS.union(updateData, updateDataTemp);
            //                        //                                        };
            //                        //                                    });
            //                        //                                    changedData = updateData;
            //                        var updateData = [];
            //                        if (oController.sectionRef[section['SECTN']]) {
            //                            changedData = oController.sectionRef[section['SECTN']].__getChangedRows();

            //                            underscoreJS.each(changedData, function (attribute) {

            //                                var updateDataTemp = underscoreJS.filter(attribute.DATA, function (row) {
            //                                    //                                              return row.__UPDKZ == 'X';
            //                                    return row;
            //                                });
            //                                updateData = underscoreJS.union(updateData, updateDataTemp);

            //                            });
            //                            changedData = updateData;
            //                            break;
            //                        }
            //                        //-getchangedRows -end
            //                        break;

            //                    case global.vui5.cons.propertyType.tree:
            //                        if (oController.sectionRef[section['SECTN']]) {
            //                            changedData = oController.sectionRef[section['SECTN']].getChangedRows();
            //                            break;
            //                        }
            //                        break;
            //case global.vui5.cons.propertyType.planningGrid:
            //    if (oController.sectionRef[section['SECTN']]) {
            //        changedData = oController.sectionRef[section['SECTN']].getChangedData();

            //    }
            //    break;
            //case global.vui5.cons.propertyType.pricingGrid:
            //    if (oController.sectionRef[section['SECTN']]) {
            //        changedData = oController.sectionRef[section['SECTN']].getChangedData();
            //    }
            //    break;

            //                    case global.vui5.cons.propertyType.statementEditor:
            //                        if (oController.sectionRef[section['SECTN']]) {
            //                            changedData = {
            //                                "DGFLD": JSON.stringify(oController.sectionRef[section['SECTN']].getUpdatedData() || {})
            //                            };
            //                        }
            //                        break;
            //                    case global.vui5.cons.propertyType.reportingView:
            //                    case global.vui5.cons.propertyType.summary:
            //                        if (oController.sectionRef[section['SECTN']]) {
            //                            changedData = oController.sectionRef[section['SECTN']].getChangedData();
            //                        }
            //                        break;
            //                    default:
            //                        changedData = model.getProperty(modelPath);
            //                }
            //                if (section && section['DAPPT'] == global.vui5.cons.propertyType.evaluationForm) {
            //                    continue;
            //                }
            //                if (changedData && ((underscoreJS.isArray(changedData) && changedData.length > 0) || (underscoreJS.isObject(changedData) && !underscoreJS.isArray(changedData)))) {
            //                    objData[dataArea] = changedData;
            //                }
            //            }
            //        }
            //    }

            //    return underscoreJS.isEmpty(objData) ? '' : objData;
            //},
            /*** Rel 60E SP6 - Planning/Pricing Related changes - End **/
            _processBufferAction: function (bufferFill, sectionID, action, params, urlParams) {

                var oController = this;
                var currentSection = oController.getSectionBy("SECTN", sectionID) || {};
                var objDefer = $.Deferred();
                if (bufferFill) {

                    oController._bufferProcessAction = {
                        'SECTIONID': sectionID,
                        'ACTION': action,
                        'PARAMS': oController._getSelectedRecords(currentSection, action, params),
                        'URL_PARAMS': urlParams
                    };
                    action = $.extend({}, underscoreJS.find(oController.getModel(oController.modelName).getProperty("/DOFUN"), {
                        FNCNM: global.vui5.cons.eventName.save
                    }));

                    action['CFMSG'] = oController._getBundleText("ConfirmSave");
                    oController.processAction(sectionID, action).then(function () {
                        objDefer.resolve();
                    }).fail(function () {
                        objDefer.reject();
                    });
                } else {
                    oController._bufferProcessAction['ACTION']['SVCFM'] = "";
                    var sectionId = oController._bufferProcessAction['SECTIONID'];
                    var action = oController._bufferProcessAction['ACTION'];
                    var params = oController._bufferProcessAction['PARAMS'];
                    var urlParams = oController._bufferProcessAction['URL_PARAMS'] === undefined ? "" : oController._bufferProcessAction['URL_PARAMS'];
                    delete oController._bufferProcessAction;
                    /*
                    In case of Filter Action Type with Save Confirmation, we have to skip Update Event 
                    as already Save Event has being raised, Hence passing skipUpdate as True
                    for ProcessAction
                    */
                    oController.processAction(sectionId, action, params, urlParams, action['ACTYP'] === global.vui5.cons.actionType.filters).then(function () {
                        objDefer.resolve();
                    }).fail(function () {
                        objDefer.reject();
                    });;
                }

                return objDefer.promise();

            },
            processOnInputChange: function (sectionID, oEvent) {

                var oController = this, source, value;
                var fieldInfo = oEvent.getParameter('fieldInfo') || oEvent.getSource().data("fieldInfo") || {};
                var dataPath = oEvent.getParameter("dataPath") || oEvent.getSource().data("dataPath") || {};
                var selectedRow = oController.getCurrentModel().getProperty(dataPath)['ROWID'] || '';
                var rejectReason = "", error = false;
                /*** Rel 60E SP6 - Required Fields Issue - Start ****/

                if (fieldInfo['DATATYPE'] === global.vui5.cons.dataType.date) {
                    if (oEvent.getSource().getValueState() === sap.ui.core.ValueState.Error) {
                        error = true;
                        rejectReason = global.vui5.cons.errorContext.onInputValueCheck;
                    }
                    // error = oController.dateFieldCheck(oEvent);

                }
                else if (oEvent.getSource().setValueState) {
                    oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
                }

                /*** Rel 60E SP6 - Required Fields Issue - End ****/
                var _oEvent = underscoreJS.clone(oEvent);
                source = _oEvent.getSource();
                var getDescription, fieldCheckPromise, fieldConversionPromise, checkValue, objDefer;
                if (fieldInfo['REQUIRED'] && !error) {
                    error = oController._handleRequiredFieldCheck(oEvent);
                }

                oController.inputChangeDefer = objDefer = $.Deferred();

                if (!error) {
                    if (fieldInfo['SDSCR'] === global.vui5.cons.fieldValue.value
                        || fieldInfo['SDSCR'] === global.vui5.cons.fieldValue.value_descr) {
                        if (fieldInfo['INTTYPE'] === global.vui5.cons.intType.number) {
                            error = oController._checkNumericField(_oEvent);
                        } else if (fieldInfo['INTTYPE'] === global.vui5.cons.intType.packed) {
                            error = oController._checkPackedField(_oEvent);
                        } else if (fieldInfo['INTTYPE'] === global.vui5.cons.intType.integer) {
                            error = oController._checkIntegerField(_oEvent);
                        }

                    }

                    if (fieldInfo['LOWERCASE'] == ''
                        && fieldInfo['INTTYPE'] == global.vui5.cons.intType.character
                        && (fieldInfo['ELTYP'] == global.vui5.cons.element.input
                            || fieldInfo['ELTYP'] == global.vui5.cons.element.valueHelp)) {
                        source = _oEvent.getSource();
                        value = source.getValue();
                        value = value.toUpperCase();
                        source.setValue(value);
                    }


                    if (!error) {

                        if (fieldInfo['ELTYP'] != global.vui5.cons.element.checkBox &&
                            ((fieldInfo['SDSCR'] != global.vui5.cons.fieldValue.value
                                && fieldInfo['DATATYPE'] != global.vui5.cons.dataType.amount
                                && fieldInfo['DATATYPE'] != global.vui5.cons.dataType.decimal
                                && fieldInfo['DATATYPE'] != global.vui5.cons.dataType.quantity)
                                || fieldInfo['SCRCHK'] == 'X')) {
                            getDescription = '';
                            if (fieldInfo['SDSCR'] != global.vui5.cons.fieldValue.value
                                && fieldInfo['DATATYPE'] != global.vui5.cons.dataType.amount
                                && fieldInfo['DATATYPE'] != global.vui5.cons.dataType.decimal
                                && fieldInfo['DATATYPE'] != global.vui5.cons.dataType.quantity) {
                                getDescription = 'X';
                            }
                            checkValue = fieldInfo['SCRCHK'];

                            fieldCheckPromise = oController.processFieldValueCheckEvent(sectionID, source, fieldInfo, getDescription, checkValue, selectedRow);

                        }
                        /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - Start ***/
                        else if (oController._isMultiInputField(source)) {
                            oController._fillMultiValueField(source, fieldInfo)
                        }
                        /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - End ***/
                        if (fieldCheckPromise) {
                            fieldCheckPromise.then(function (skipConversion) {
                                fieldConversionPromise = oController.processFieldConversion(sectionID, _oEvent, skipConversion, selectedRow);
                                fieldConversionPromise.then(function () {
                                    objDefer.resolve();
                                }).fail(function () {
                                    objDefer.reject(global.vui5.cons.errorContext.onInputValueConversion);
                                    oController.inputChangeDefer = undefined;
                                });

                            }).fail(function () {
                                objDefer.reject(global.vui5.cons.errorContext.onInputValueCheck);
                                oController.inputChangeDefer = undefined;
                            });
                            ;
                        } else {
                            fieldConversionPromise = oController.processFieldConversion(sectionID, _oEvent, false, selectedRow);
                            fieldConversionPromise.then(function () {
                                objDefer.resolve();
                            }).fail(function () {
                                objDefer.reject(global.vui5.cons.errorContext.onInputValueConversion);
                                oController.inputChangeDefer = undefined;
                            });
                            ;
                        }

                    } else {
                        objDefer.reject();
                        oController.inputChangeDefer = undefined;
                    }


                } else {
                    objDefer.reject(rejectReason);
                    oController.inputChangeDefer = undefined;
                }

                return objDefer.promise();

            },

            processFieldConversion: function (sectionID, oEvent, skipConversion, selectedRow) {
                var oController = this, action, promise, refFields, amountRef, objDefer, errror, fieldRefControl;
                var data = {
                    "PARAMS": {},
                    "RSPARAMS": []
                };

                objDefer = $.Deferred();
                var fieldInfo = oEvent.getParameter("fieldInfo") || oEvent.getSource().data("fieldInfo") || {};
                var model = oController.getCurrentModel();
                var path = oEvent.getParameter("dataPath");
                var fullDataPath, considerFullDataPath, section;
                section = oController.getSectionBy("SECTN", sectionID) || {};
                var oBinding;
                var triggerFieldConversion;
                var source = oEvent.getSource();

                if ((fieldInfo['DATATYPE'] === global.vui5.cons.dataType.currencyKey ||
                    fieldInfo['DATATYPE'] === global.vui5.cons.dataType.unit) && section) {

                    skipConversion = underscoreJS.isEmpty(underscoreJS.findWhere(section['FIELDS'], { 'CFIELDNAME': fieldInfo['FLDNAME'] })) ||
                        underscoreJS.isEmpty(underscoreJS.findWhere(section['FIELDS'], { 'QFIELDNAME': fieldInfo['FLDNAME'] }))

                }
                if (!!fieldInfo['MULTISELECT']) {
                    oBinding = source.getBinding("tokens");
                }
                else {
                    oBinding = source.getBinding("value");
                }

                if (!skipConversion) {

                    if (fieldInfo['ELTYP'] !== global.vui5.cons.element.dropDown &&
                        fieldInfo['ELTYP'] !== global.vui5.cons.element.checkBox && (
                            fieldInfo['DATATYPE'] === global.vui5.cons.dataType.amount ||
                            fieldInfo['DATATYPE'] === global.vui5.cons.dataType.quantity ||
                            fieldInfo['DATATYPE'] === global.vui5.cons.dataType.currencyKey ||
                            fieldInfo['DATATYPE'] === global.vui5.cons.dataType.unit ||
                            fieldInfo['DATATYPE'] === global.vui5.cons.dataType.decimal ||
                            fieldInfo['DATATYPE'].substr(0, 3) === global.vui5.cons.dataType.integer)) {
                        var source = oEvent.getSource();

                        var model = oController.getCurrentModel();
                        var oBinding = source.getBinding("value");
                        var path = oEvent.getParameter("dataPath");
                        var fieldName = oBinding.getPath();

                        if (section && section['DAPPT'] === global.vui5.cons.propertyType.form ||
                            oEvent.getParameter("fromMassEdit")) { //MassEdit
                            considerFullDataPath = true;
                            fullDataPath = fieldName;
                        }

                        if (fieldInfo['DATATYPE'] === global.vui5.cons.dataType.amount) {
                            data = oController.performAmountConversion(oEvent, fieldInfo, oEvent.getParameter("refPath"));

                        } else if (fieldInfo['DATATYPE'] === global.vui5.cons.dataType.quantity) {
                            data = oController.performQuantityConversion(oEvent, fieldInfo, oEvent.getParameter("refPath"));
                        } else if (fieldInfo['DATATYPE'] === global.vui5.cons.dataType.currencyKey ||
                            fieldInfo['DATATYPE'] === global.vui5.cons.dataType.unit) {
                            data = oController.performCurrencyAndUnitConversion(oEvent, fieldInfo, oEvent.getParameter("refPath"), oEvent.getParameter("dataPath"));
                        } else if (fieldInfo['DATATYPE'] === global.vui5.cons.dataType.decimal) {
                            data = oController.performDecimalConversion(oEvent, fieldInfo);
                        } else if (fieldInfo['DATATYPE'].substr(0, 3) === global.vui5.cons.dataType.integer) {
                            data = oController.performIntegerConversion(oEvent, fieldInfo);
                        }

                        triggerFieldConversion = !underscoreJS.isEmpty(data['PARAMS']) || !underscoreJS.isEmpty(data['RSPARAMS']);


                        if (selectedRow) {
                            data['PARAMS'][global.vui5.cons.params.selectedRow] = selectedRow;
                        }
                        action = {
                            "FNCNM": global.vui5.cons.eventName.fieldValueConversion,
                            "RQTYP": global.vui5.cons.reqTypeValue.post,
                            hideLoader: true
                        };
                        if (triggerFieldConversion) {
                            promise = oController.processFieldEvent(sectionID, action, data['PARAMS'], data['RSPARAMS']);
                            if (promise && promise.then) {
                                promise.then(function (response) {
                                    if (fieldInfo['DATATYPE'] === global.vui5.cons.dataType.currencyKey ||
                                        fieldInfo['DATATYPE'] === global.vui5.cons.dataType.unit) {
                                        fieldRefControl = oEvent.getParameter("fieldRefControl");
                                        underscoreJS.each(response['DATA'], function (obj) {
                                            model.setProperty(path + obj['TXTFL'], obj['VALUE']);
                                            amountRef = underscoreJS.find(fieldRefControl, {
                                                "FLDNAME": obj['FLDNAME'],
                                                "TABNAME": obj['TABNAME']
                                            });
                                            if (obj['ERROR']) {
                                                amountRef['CONTROL'].setValueState(sap.ui.core.ValueState.Error);
                                                amountRef['CONTROL'].setValueStateText(obj['MESSAGE']);
                                                oController._handleCheckFieldsMessages(
                                                    obj['MESSAGE'],
                                                    sap.ui.core.MessageType.Error,
                                                    amountRef['CONTROL'].getId() + "/value");
                                                errror = true;
                                            } else {
                                                amountRef['CONTROL'].setValueState(sap.ui.core.ValueState.None);
                                                amountRef['CONTROL'].setValueStateText("");
                                                oController._handleCheckFieldsMessages(
                                                    "",
                                                    "",
                                                    amountRef['CONTROL'].getId() + "/value");
                                            }
                                        });
                                    } else {
                                        underscoreJS.each(response['DATA'], function (obj) {
                                            if (oController.isVuiMultiInputField(source)) {
                                                if (obj['ERROR']) {
                                                    error = true;
                                                    errorText = obj['MESSAGE'];
                                                }

                                                mulValues[index] = {};
                                                mulValues[index][fieldInfo['FLDNAME']] = obj['VALUE'];
                                                if (fieldInfo['TXTFL']) {
                                                    mulValues[index][fieldInfo['TXTFL']] = obj['VALUE'];
                                                }
                                            }
                                            else {
                                                if (considerFullDataPath) {
                                                    model.setProperty(fullDataPath, obj['VALUE']);
                                                }
                                                else {
                                                    model.setProperty(path + fieldName, obj['VALUE']);
                                                }

                                                if (obj['ERROR'] != '') {
                                                    source.setValueState(sap.ui.core.ValueState.Error);
                                                    source.setValueStateText(obj['MESSAGE']);
                                                    oController._handleCheckFieldsMessages(
                                                        obj['MESSAGE'],
                                                        sap.ui.core.MessageType.Error,
                                                        source.getId() + "/value");
                                                    errror = true;

                                                } else {
                                                    source.setValueState(sap.ui.core.ValueState.None);
                                                    source.setValueStateText("");
                                                    oController._handleCheckFieldsMessages(
                                                        "",
                                                        "",
                                                        source.getId() + "/value");
                                                }
                                            }
                                        });

                                        if (oController.isVuiMultiInputField(source)) {
                                            if (error) {
                                                source.setValueState(sap.ui.core.ValueState.Error);
                                                source.setValueStateText(errorText);
                                                oController._handleCheckFieldsMessages(
                                                    errorText,
                                                    sap.ui.core.MessageType.Error,
                                                    source.getId() + "/value");
                                            }

                                            model.setProperty(path + fieldName, mulValues);
                                        }
                                    }
                                    if (!errror) {
                                        if (fieldInfo['CHEVT'] === global.vui5.cons.changeEventType.serverEvent) {
                                            oController.processFieldValueChange(sectionID, fieldInfo, selectedRow).then(function () {
                                                objDefer.resolve();
                                            }).fail(function () {
                                                objDefer.reject(global.vui5.cons.errorContext.onInputValueChange);
                                            });

                                        } else {
                                            objDefer.resolve();
                                        }
                                    } else {
                                        objDefer.reject();
                                    }

                                });

                            }
                        }
                        else {
                            oController.inputChangeDefer = undefined;
                            objDefer.reject(global.vui5.cons.errorContext.onInputValueConversion);
                        }

                    } else if (fieldInfo['CHEVT'] === global.vui5.cons.changeEventType.serverEvent) {
                        oController.processFieldValueChange(sectionID, fieldInfo, selectedRow).then(function () {
                            objDefer.resolve();
                        }).fail(function () {
                            objDefer.reject(global.vui5.cons.errorContext.onInputValueChange);
                        });
                    } else {
                        if (oController.isVuiMultiInputField(oEvent.getSource())) {
                            oEvent.getSource().vuiParentControl.fillMultiValueField(oEvent.getSource());
                        }
                        objDefer.resolve();
                    }

                } else if (fieldInfo['CHEVT'] === global.vui5.cons.changeEventType.serverEvent) {
                    oController.processFieldValueChange(sectionID, fieldInfo, selectedRow).then(function () {
                        objDefer.resolve();
                    }).fail(function () {
                        objDefer.reject();
                    });
                } else {
                    if (oController.isVuiMultiInputField(oEvent.getSource())) {
                        underscoreJS.each(oEvent.getSource().getTokens(), function (tokenData, index) {
                            multiValues[index] = {};

                            if (fieldInfo['MVLFLD']) {
                                multiValues[index][fieldInfo['MVLFLD']] = tokenData.getKey();
                            }
                            else {
                                multiValues[index][fieldInfo['FLDNAME']] = tokenData.getKey();
                            }

                            if (fieldInfo['MTXFLD']) {
                                if (fieldInfo['SDSCR'] === global.vui5.cons.fieldValue.value_descr) {
                                    multiValues[index][fieldInfo['MTXFLD']] = tokenData.getKey() + " " + tokenData.getText();
                                }
                                else if (fieldInfo['SDSCR'] === global.vui5.cons.fieldValue.value_cont_descr) {
                                    multiValues[index][fieldInfo['MTXFLD']] = tokenData.getText() + "(" + tokenData.getKey() + ")";
                                }
                                else {
                                    multiValues[index][fieldInfo['MTXFLD']] = tokenData.getText();
                                }
                            }
                            else if (fieldInfo['TXTFL']) {
                                if (fieldInfo['SDSCR'] === global.vui5.cons.fieldValue.value_descr) {
                                    multiValues[index][fieldInfo['TXTFL']] = tokenData.getKey() + " " + tokenData.getText();
                                }
                                else if (fieldInfo['SDSCR'] === global.vui5.cons.fieldValue.value_cont_descr) {
                                    multiValues[index][fieldInfo['TXTFL']] = tokenData.getText() + "(" + tokenData.getKey() + ")";
                                }
                                else {
                                    multiValues[index][fieldInfo['TXTFL']] = tokenData.getText();
                                }

                            }

                        });
                        oController._fillDescription(model, path, fieldInfo, multiValues);
                    }
                    objDefer.resolve();
                }

                return objDefer.promise();
            },
            processFieldValueChange: function (sectionID, fieldInfo, selectedRow) {
                var oController = this,
                    action,
                    urlParams = {}, objDefer = $.Deferred(), error, index = 0, focusedInput;


                jQuery('input[aria-invalid=true]').each(function () {
                    var id = $(this).closest(' .sapMMultiInput.sapMMultiInputMultiLine').attr('id');
                    var oInput = sap.ui.getCore().byId(this.parentNode.id) || sap.ui.getCore().byId(id);
                    if (oInput) {
                        error = true;
                        if (index == 0) {
                            oInput.focus();
                        }

                    }
                    else {
                        error = true;
                        if (index === 0) {
                            this.focus();
                            focusedInput = this;
                        }

                    }
                    index++;

                });

                if (error) {
                    return objDefer.reject(focusedInput);
                }
                /*if (oController.checkRequiredFields()) {
                    return objDefer.reject();
                }*/


                action = {
                    "FNCNM": global.vui5.cons.eventName.fieldValueChange,
                    "RQTYP": global.vui5.cons.reqTypeValue.post,
                    //"SECTN": sectionID
                };

                urlParams[global.vui5.cons.params.fieldName] = fieldInfo['FLDNAME'];

                if (selectedRow) {
                    urlParams[global.vui5.cons.params.selectedRow] = selectedRow;
                }
                return oController.processEvent(sectionID, action, null, urlParams);

            },
            _storeSectionKeys: function () {
                var oController = this;
                var sectionkey = oController.ObjectPageLayout._sScrolledSectionId || oController.ObjectPageLayout.getSelectedSection();
                var section = underscoreJS.find(oController.ObjectPageLayout.getSections(), {
                    sId: sectionkey
                });
                oController._sectionKey = section.data('id');
                var subsectionKey = section.getSelectedSubSection();
                oController._subSectionKey = subsectionKey ? underscoreJS.find(section.getSubSections(), {
                    sId: subsectionKey
                }).data('id') : ""

            },

            performIntegerConversion: function (oEvent, fieldInfo) {
                return this.performDecimalConversion(oEvent, fieldInfo);
            },
            performDecimalConversion: function (oEvent, fieldInfo) {
                var data = {
                    "PARAMS": {},
                    "RSPARAMS": []
                };
                var oController = this,
                    newValue;
                var newValue = oEvent.getSource().getValue();

                data['RSPARAMS'].push({
                    "FLDNAME": fieldInfo['FLDNAME'],
                    "TABNAME": fieldInfo['TABNAME'],
                    "VALUE": newValue
                });

                return data;
            },
            performCurrencyAndUnitConversion: function (oEvent, fieldInfo, refPath, path) {
                var data = {
                    "PARAMS": {},
                    "RSPARAMS": []
                };
                var oController = this, refFields, fields, amountControl, amountRef, model, value, refValue,
                    functionCall, rowIndex, propertyName;
                refFields = oEvent.getParameter("refFields");
                amountRef = oEvent.getParameter("fieldRefControl");
                rowIndex = oEvent.getParameter("rowIndex") || "";
                refFields = underscoreJS.isArray(refFields) ? refFields : [refFields];
                model = oController.getCurrentModel();
                refValue = model.getProperty(refPath) || "";
                var massEditDialogPath = path; //MassEdit
                underscoreJS.each(refFields, function (obj) {
                    amountControl = underscoreJS.find(amountRef, {
                        'FLDNAME': obj['FLDNAME'],
                        'TABNAME': obj['TABNAME'],
                        'INDEX': rowIndex
                    });
                    if (amountControl && amountControl['CONTROL']) {
                        if (oEvent.getParameter("fromMassEdit")) { //MassEdit
                            massEditDialogPath = oEvent.getParameter("dataPath") + obj["TXTFL"] + "/VALUE";
                            value = model.getProperty(massEditDialogPath);
                        } else {
                            value = model.getProperty(path + obj['TXTFL']);
                        }

                        functionCall = fieldInfo['DATATYPE'] === global.vui5.cons.dataType.currencyKey ?
                            'checkAmountValue' : 'checkQuantityValue';
                        if (functionCall) {
                            if (oController[functionCall](value)) {
                                data['RSPARAMS'].push({
                                    'TABNAME': obj['TABNAME'],
                                    'FLDNAME': obj['FLDNAME'],
                                    'VALUE': value,
                                    'TXTFL': obj['TXTFL']
                                });
                            }


                        } else {
                            oController.setErrorStateToControl(amountControl['CONTROL']);
                        }
                    }
                });

                if (data['RSPARAMS'].length > 0) {
                    propertyName = fieldInfo['DATATYPE'] === global.vui5.cons.dataType.currencyKey ? global.vui5.cons.params.currency : global.vui5.cons.params.unit;
                    data['PARAMS'][propertyName] = refValue;
                }

                return data;
            },
            performQuantityConversion: function (oEvent, fieldInfo, refPath) {
                var data = {
                    "PARAMS": {},
                    "RSPARAMS": []
                };
                var oController = this,
                    model,
                    unit;
                var source = oEvent.getSource();
                var newValue = source.getValue();
                if (oController.checkQuantityValue(newValue)) {
                    source.setValueState(sap.ui.core.ValueState.None);
                    source.setValueStateText("");
                    oController._handleCheckFieldsMessages(
                        "",
                        "",
                        source.getId() + "/value");

                    model = oController.getCurrentModel();
                    unit = model.getProperty(refPath) || "";
                    data['PARAMS'][global.vui5.cons.params.unit] = unit;
                    data['RSPARAMS'].push({
                        "FLDNAME": fieldInfo['FLDNAME'],
                        "TABNAME": fieldInfo['TABNAME'],
                        "VALUE": newValue
                    });

                } else {
                    oController.setErrorStateToControl(source);
                }
                return data;
            },
            checkQuantityValue: function (value) {
                var regex;
                var oController = this;
                var mainModel = oController.getMainModel();
                var decimalNotation = mainModel.getProperty(global.vui5.cons.modelPath.sessionInfo + "/DCPFM");

                value = value.trim();
                if (value) {
                    regex = oController._getDecimalNotationRegex(decimalNotation);
                    return regex.test(value);
                } else {
                    return false;
                }
            },
            performAmountConversion: function (oEvent, fieldInfo, refPath) {
                var data = {
                    "PARAMS": {},
                    "RSPARAMS": []
                };
                var oController = this, model, currency, dataPath;
                var source = oEvent.getSource();
                var newValue = source.getValue();

                model = oController.getCurrentModel();
                currency = model.getProperty(refPath) || "";

                if (oController.isVuiMultiInputField(source)) {

                    underscoreJS.each(source.getTokens(), function (token) {
                        if (oController.checkAmountValue(token.getKey())) {
                            source.setValueState(sap.ui.core.ValueState.None);
                            source.setValueStateText("");
                            oController._handleCheckFieldsMessages(
                                "",
                                "",
                                source.getId() + "/value");
                            data['PARAMS'][global.vui5.cons.params.currency] = currency;
                            data['RSPARAMS'].push({
                                "FLDNAME": fieldInfo['FLDNAME'],
                                "TABNAME": fieldInfo['TABNAME'],
                                "VALUE": token.getKey(),
                                "KRECH": model.getProperty(dataPath + "KRECH") || ''
                            });

                        }
                        else {
                            oController.setErrorStateToControl(source);
                            data = {
                                "PARAMS": {},
                                "RSPARAMS": []
                            };
                            return;
                        }
                    });
                }
                else {
                    dataPath = oEvent.getParameter("dataPath");
                    if (oController.checkAmountValue(newValue)) {
                        source.setValueState(sap.ui.core.ValueState.None);
                        source.setValueStateText("");
                        oController._handleCheckFieldsMessages(
                            "",
                            "",
                            source.getId() + "/value");

                        data['PARAMS'][global.vui5.cons.params.currency] = currency;
                        data['RSPARAMS'].push({
                            "FLDNAME": fieldInfo['FLDNAME'],
                            "TABNAME": fieldInfo['TABNAME'],
                            "VALUE": newValue,
                            "KRECH": model.getProperty(dataPath + "KRECH") || ''
                        });


                    } else {
                        oController.setErrorStateToControl(source);
                    }
                }


                return data;

            },
            checkAmountValue: function (value) {
                var regex;
                var mainModel = this.getMainModel();
                var decimalNotation = mainModel.getProperty(global.vui5.cons.modelPath.sessionInfo + "/DCPFM");

                value = value.trim();
                if (value) {
                    switch (decimalNotation) {
                        case 'X':
                            regex = /^[0-9\-.]\d*(((,\d{1,}){0,})?(\.\d{0,})?)([0-9\-]{0,1})$/;
                            break;
                        case 'Y':
                            regex = /^[0-9\-,]\d*(((\s\d{1,}){0,})?(,\d{0,})?)([0-9\-]{0,1})$/;
                            break;
                        default:
                            regex = /^[0-9\-,]\d*(((\.\d{1,}){0,})?(,\d{0,})?)([0-9\-]{0,1})$/;
                            break;
                    }
                    return regex.test(value);
                } else {
                    return false;
                }
            },
            setErrorStateToControl: function (source, fromSelections) {
                var oController = this;
                var text,
                    ariaLabelledBy,
                    textElement,
                    bundle,
                    errorText, targetId, fromFilterBar;

                fromFilterBar = fromSelections;

                if (!fromFilterBar) {
                    fromFilterBar = source.data("fromQuickEntry");
                }
                source.setValueState(sap.ui.core.ValueState.Error);
                if (source.getParent().getAggregation("label")) {
                    text = source.getParent().getAggregation("label").getText();
                }
                else if (fromFilterBar) {
                    text = source.getParent().getAggregation('content')[0].getText()
                }
                else {
                    if (source.data("sap-ui-colid")) {
                        text = sap.ui.getCore().byId(source.data("sap-ui-colid")).getAggregation("label").getText();
                    } else {
                        ariaLabelledBy = source.getAriaLabelledBy();
                        for (var i = 0; i < ariaLabelledBy.length; i++) {
                            textElement = sap.ui.getCore().byId(ariaLabelledBy[i]);
                            if (textElement) {
                                text = textElement.getText();
                                break;
                            }
                        }
                    }
                }

                bundle = oController.geti18nResourceBundle();
                errorText = oController._getBundleText('SessionPopup'),
                    errorText = oController._getBundleText("EnterValid", [text]);
                source.setValueStateText(errorText);
                /* Combobox value is getting cleared  when it is initial even it is required field on check. 
                selectedKey should be passed as its id */
                //                oController._handleCheckFieldsMessages(
                //                    errorText,
                //                    sap.ui.core.MessageType.Error,
                //                    source.getId() + "/value");
                if (source instanceof sap.m.ComboBox)
                    targetId = source.getId() + "/selectedKey";
                else
                    targetId = source.getId() + "/value";
                oController._handleCheckFieldsMessages(
                    errorText,
                    sap.ui.core.MessageType.Error,
                    targetId);
                /**/


            },
            processFieldValueCheckEvent: function (sectionID, source, fieldInfo, getDescription, checkValue, selectedRow) {

                var oController = this, model;
                // var model = oController.getCurrentModel();
                if (source.data("model")) {
                    model = source.getModel(source.data("model"));
                }
                if (oController.isVuiMultiInputField(source)) {
                    if (!model) {
                        model = oController.getCurrentModel();
                    }
                }

                if (!model) {
                    return;
                }
                var mainModel = oController.getMainModel();
                var newValue = source.getValue(),
                    descriptionBuffer,
                    deffered,
                    bufferEntry,
                    oBinding,
                    /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - Start ***/
                    response_descr = [],
                    /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - End ***/
                    path;
                var params = {},
                    action,
                    promise,
                    rsparams = [];

                var error, mulValues;

                var fieldname = source.data("fieldname");
                /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - Start ***/
                var fieldValueChangeFromF4 = !!source.data("descrField");
                newValue = oController._isMultiInputField(source) ? source.data("tokenValues") : newValue;
                /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - End ***/

                if (oController.isVuiMultiInputField(source)) {
                    newValue = source.getTokens();
                }

                //*****Rel 60E_SP6 - Sanofi Req
                var dappt = source.data("dappt"), dataPath;
                if (dappt && dappt === vui5.cons.propertyType.selections) {
                    dataPath = source.data("dataPath");
                    newValue = model.getProperty(dataPath + "/LOW");
                }
                //*****                

                if (model) {
                    deffered = $.Deferred();
                    /***Rel 60E SP7 - McCain Issue in Fast Entry Fields - Start */
                    /*if (underscoreJS.isArray(newValue) && oController.isVuiMultiInputField(source) &&
                        fieldInfo['INTTYPE'] !== global.vui5.cons.intType.string) {
                        underscoreJS.each(newValue, function (tokenValue) {
                            if (tokenValue.getKey().length > parseInt(fieldInfo['OUTPUTLEN'])) {
                                error = true;
                                return false;
                            }
                        });
                    }

                    if (fieldInfo['ELTYP'] !== global.vui5.cons.element.dropDown &&
                        parseInt(fieldInfo['OUTPUTLEN']) !== 0 && parseInt(fieldInfo['OUTPUTLEN']) < newValue.length) {
                        oController.setErrorStateToControl(source);
                        deffered.reject();
                    }*/

                    if (underscoreJS.isArray(newValue) && oController.isVuiMultiInputField(source)) {
                        if (fieldInfo['TXTFL']) {
                            underscoreJS.each(newValue, function (tokenValue) {
                                if (tokenValue.getKey().length > 60) {
                                    error = true;
                                    return false;
                                }
                            });
                        }
                        else {
                            underscoreJS.each(newValue, function (tokenValue) {
                                if (tokenValue.getKey().length > parseInt(fieldInfo['OUTPUTLEN'])) {
                                    error = true;
                                    return false;
                                }
                            });
                        }
                    }
                    if (fieldInfo['ELTYP'] !== global.vui5.cons.element.dropDown &&
                        !oController.isVuiMultiInputField(source) &&
                        parseInt(fieldInfo['OUTPUTLEN']) !== 0 && parseInt(fieldInfo['OUTPUTLEN']) < newValue.length) {
                        oController.setErrorStateToControl(source);
                        deffered.reject();
                    }
                    /***Rel 60E SP7 - McCain Issue in Fast Entry Fields - End */
                    else {
                        source.setValueState(sap.ui.core.ValueState.None);
                        source.setValueStateText('');
                        /* Combobox value is getting cleared  when it is initial even it is required field on check. 
                        selectedKey should be passed as its id */
                        var targetId;
                        if (source instanceof sap.m.ComboBox)
                            targetId = source.getId() + "/selectedKey";
                        else
                            targetId = source.getId() + "/value";
                        oController._handleCheckFieldsMessages(
                            "",
                            "",
                            targetId);
                        //                        oController._handleCheckFieldsMessages(
                        //                            "",
                        //                            "",
                        //                            source.getId() + "/value");
                        /**/
                        descriptionBuffer = mainModel.getProperty("/DESCRIPTION_BUFFER");
                        bufferEntry = underscoreJS.find(descriptionBuffer, {
                            'FLDNAME': fieldInfo['FLDNAME'],
                            'TABNAME': fieldInfo['TABNAME'],
                            'FLDVAL': newValue
                        });
                        if (fieldInfo['MULTISELECT']) {
                            oBinding = source.getBinding("tokens");
                        } else {
                            oBinding = source.getBinding("value");
                        }


                        path = source.data("dataPath") || oBinding.getPath();
                        if (path.indexOf("/VUI_MASS_EDIT/DATA/") !== -1) { //MassEdit
                            path = oBinding.getPath();
                        }

                        //path = oBinding.getPath();
                        /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - Start ***/
                        if (oController._isMultiInputField(source)) {
                            path = oController._getMultiInputDataPath(source);
                            oController._fillDescription(model, path, fieldInfo, source.data("tokenValues"), newValue, fieldname, source);
                            if (fieldValueChangeFromF4) {
                                deffered.resolve(true);
                                return;
                            }

                        }
                        /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - End ***/
                        if (bufferEntry) {
                            oController._fillDescription(model, path, fieldInfo, bufferEntry['DESCRIPTION'], newValue, fieldname, source);
                            deffered.resolve(true);
                        } else {
                            rsparams = oController._getDependentFields(sectionID, source, fieldInfo);


                            if (newValue && !oController.isVuiMultiInputField(source)) {
                                /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - Start ***/
                                //params[global.vui5.cons.params.fieldValue] = newValue;
                                params[global.vui5.cons.params.fieldValue] = oController._isMultiInputField(source) ?
                                    underscoreJS.pluck(newValue, "KEY").join(",") : newValue;
                                /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - End ***/
                            } else {
                                underscoreJS.each(newValue, function (tokenData) {
                                    if (!params[global.vui5.cons.params.fieldValue]) {
                                        params[global.vui5.cons.params.fieldValue] = tokenData.getKey();
                                    }
                                    else {
                                        params[global.vui5.cons.params.fieldValue] =
                                            params[global.vui5.cons.params.fieldValue] + "," + tokenData.getKey();
                                    }
                                });

                            }
                            if (fieldInfo['FLDNAME']) {
                                params[global.vui5.cons.params.fieldName] = fieldInfo['FLDNAME'];
                            }
                            if (fieldInfo['TABNAME']) {
                                params[global.vui5.cons.params.tableName] = fieldInfo['TABNAME'];
                            }
                            if (fieldInfo['CONVEXIT']) {
                                params[global.vui5.cons.params.conversionExit] = fieldInfo['CONVEXIT'];
                            }
                            if (fieldInfo['NRART']) {
                                params[global.vui5.cons.params.nrart] = fieldInfo['NRART'];
                            }
                            if (checkValue) {
                                params[global.vui5.cons.params.checkValue] = checkValue;
                            }
                            if (getDescription) {
                                params[global.vui5.cons.params.getDescription] = getDescription;
                            }

                            if (selectedRow) {
                                params[global.vui5.cons.params.selectedRow] = selectedRow;
                            }

                            params[global.vui5.cons.params.multiValue] = oController.isVuiMultiInputField(source) ?
                                'X' : '';

                            action = {
                                "FNCNM": global.vui5.cons.eventName.fieldValueCheck,
                                "RQTYP": global.vui5.cons.reqTypeValue.post,
                                hideLoader: true
                            };

                            promise = oController.processFieldEvent(sectionID, action, params, rsparams);
                            if (promise && promise.then) {
                                promise.then(function (response) {
                                    if (params[global.vui5.cons.params.multiValue]) {
                                        var value_not_found, multiValues = [];
                                        value_not_found = !!underscoreJS.findWhere(response['FIELD_CHECK'], { "VALUE_NOT_FOUND": "X" });
                                        if (value_not_found && checkValue) {
                                            oController.setErrorStateToControl(source);
                                            deffered.reject();
                                            return;
                                        }
                                        source.setValueState(sap.ui.core.ValueState.None);
                                        source.setValueStateText('');
                                        /* Combobox value is getting cleared  when it is initial even it is required field on check. 
                                          selectedKey should be passed as its id */
                                        var targetId;
                                        if (source instanceof sap.m.ComboBox)
                                            targetId = source.getId() + "/selectedKey";
                                        else
                                            targetId = source.getId() + "/value";
                                        //                                        oController._handleCheckFieldsMessages(
                                        //                                            "",
                                        //                                            "",
                                        //                                            source.getId() + "/value");
                                        /**/
                                        if (params[global.vui5.cons.params.fieldValue]) {
                                            underscoreJS.each(params[global.vui5.cons.params.fieldValue].split(","), function (values, index) {
                                                multiValues[index] = {};

                                                if (fieldInfo['MVLFLD']) {
                                                    multiValues[index][fieldInfo['MVLFLD']] = values;
                                                }
                                                else {
                                                    multiValues[index][fieldInfo['FLDNAME']] = values;
                                                }

                                                if (fieldInfo['MTXFLD']) {
                                                    if (fieldInfo['SDSCR'] === global.vui5.cons.fieldValue.value_descr) {
                                                        multiValues[index][fieldInfo['MTXFLD']] = values + " " + response['FIELD_CHECK'][index]['DESCR'];
                                                    }
                                                    else if (fieldInfo['SDSCR'] === global.vui5.cons.fieldValue.value_cont_descr) {
                                                        multiValues[index][fieldInfo['MTXFLD']] = response['FIELD_CHECK'][index]['DESCR'] + "(" + values + ")";
                                                    }
                                                    else {
                                                        multiValues[index][fieldInfo['MTXFLD']] = response['FIELD_CHECK'][index]['DESCR'];
                                                    }
                                                }
                                                else if (fieldInfo['TXTFL']) {
                                                    if (fieldInfo['SDSCR'] === global.vui5.cons.fieldValue.value_descr) {
                                                        multiValues[index][fieldInfo['TXTFL']] = values + " " + response['FIELD_CHECK'][index]['DESCR'];
                                                    }
                                                    else if (fieldInfo['SDSCR'] === global.vui5.cons.fieldValue.value_cont_descr) {
                                                        multiValues[index][fieldInfo['TXTFL']] = response['FIELD_CHECK'][index]['DESCR'] + "(" + values + ")";
                                                    }
                                                    else {
                                                        multiValues[index][fieldInfo['TXTFL']] = response['FIELD_CHECK'][index]['DESCR'];
                                                    }

                                                }
                                            });
                                        }
                                        oController._fillDescription(model, path, fieldInfo, multiValues, newValue, fieldname, source);
                                        deffered.resolve("");
                                    }
                                    else {


                                        if (checkValue == 'X') {
                                            if (response['FIELD_CHECK'][0]['VALUE_NOT_FOUND'] == 'X') {
                                                oController.setErrorStateToControl(source);
                                                deffered.reject();
                                            } else {
                                                source.setValueState(sap.ui.core.ValueState.None);
                                                source.setValueStateText('');
                                                oController._handleCheckFieldsMessages(
                                                    "",
                                                    "",
                                                    source.getId() + "/value");
                                                if (getDescription == 'X') {
                                                    // path = oBinding.getPath();
                                                    /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - Start ***/
                                                    //oController._fillDescription(model, path, fieldInfo, response['DESCR'], newValue, fieldname);
                                                    if (oController._isMultiInputField(source)) {
                                                        underscoreJS.each(response['FIELD_CHECK'][0]['DESCR'].split(","), function (descr, index) {
                                                            response_descr.push({
                                                                "KEY": newValue[index]['KEY'],
                                                                "TEXT": descr
                                                            });
                                                        })

                                                        oController._fillDescription(model, path, fieldInfo, response_descr, newValue, fieldname, source);
                                                    }
                                                    else {
                                                        oController._fillDescription(model, path, fieldInfo, response['FIELD_CHECK'][0]['DESCR'], newValue, fieldname, source);
                                                    }

                                                    /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - End ***/
                                                }
                                                deffered.resolve(response['FIELD_CHECK'][0]['SKIP_CONVERSION']);
                                            }
                                        } else if (getDescription == 'X') {
                                            /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - Start ***/
                                            //oController._fillDescription(model, path, fieldInfo, response['DESCR'], newValue, fieldname);
                                            if (oController._isMultiInputField(source)) {
                                                underscoreJS.each(response['FIELD_CHECK'][0]['DESCR'].split(","), function (descr, index) {
                                                    response_descr.push({
                                                        "KEY": newValue[index]['KEY'],
                                                        "TEXT": descr
                                                    });
                                                })

                                                oController._fillDescription(model, path, fieldInfo, response_descr, newValue, fieldname, source);
                                            }
                                            else {
                                                oController._fillDescription(model, path, fieldInfo, response['DESCR'], newValue, fieldname, source);
                                            }

                                            /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - End ***/

                                            deffered.resolve(response['FIELD_CHECK'][0]['SKIP_CONVERSION']);
                                        } else {
                                            deffered.resolve(response['FIELD_CHECK'][0]['SKIP_CONVERSION']);
                                        }
                                    }
                                });
                            }

                        }
                    }

                    return deffered.promise();
                }
            },

            preProcessFieldClickEvent: function (sectionID, oEvent) {
                var oController = this,
                    urlParams = {},
                    section,
                    fieldInfo,
                    oFunction;
                urlParams = oEvent.getParameter("urlParams");

                fieldInfo = oEvent.getParameter("fieldInfo") || oEvent.getSource().data("fieldInfo") || {};
                urlParams[global.vui5.cons.params.fieldName] = fieldInfo['FLDNAME'] || "";
                section = oController.getSectionBy("SECTN", sectionID) || {};

                if (underscoreJS.isEmpty(section)) return;

                oFunction = underscoreJS.findWhere(section['FUNC'], {
                    'FNCNM': fieldInfo['FLEVT']
                });

                if (oFunction) {
                    return oController.processAction(sectionID, oFunction, null, urlParams);
                }


            },
            processDashboardNavigation: function (params, rowData) {
                var oController = this, objDefer = $.Deferred();
                var action = {
                    "FNCNM": vui5.cons.eventName.navigate,
                    "RQTYP": global.vui5.cons.reqTypeValue.post,
                    "ACTYP": global.vui5.cons.actionType.pageNavigation,
                    hideLoader: false
                };
                var model = oController.getCurrentModel();
                var objConfig = {
                    method: action['RQTYP'] === global.vui5.cons.reqTypeValue.post ? global.vui5.cons.reqType.post : global.vui5.cons.reqType.get,
                    action: action['FNCNM'],
                    actionRef: action,
                    context: oController.currentRoute,
                    hideLoader: !!action.hideLoader,
                    urlParams: params,
                    data: rowData
                };

                oController.processServerEvent(objConfig).then(function (response) {
                    //objDefer.resolve();
                });

                return objDefer.resolve();
            },
            processFileUpload: function (sectionID, oEvent, dataPath, field) {
                var oController = this;
                var isExcel = "",
                    oTabFile, sheetNames;

                var files = oEvent.getParameter('files');
                if (files.length == 0) {
                    oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
                    return;
                }
                oController._oExcelData = [];
                oController._fileData = "";
                var dataIDField = field["CFIELDNAME"];
                var dataIdPath = dataPath + field["CFIELDNAME"];

                //   oTabFile = 'TXT';
                oTabFile = oController.getModel(oController.modelName).getProperty(dataPath)['FLFMT']

                if (!/.csv$/.test(files[0].name) && !/.txt$/.test(files[0].name) && oTabFile != "TAB") {
                    isExcel = "X";
                }

                var oFileReader = new FileReader();
                oFileReader.onload = function (evt) {
                    var data = evt.target.result,
                        workbook = '';

                    if (isExcel) {
                        var covData = "",
                            l = 0,
                            w = 10240;
                        for (; l < data.byteLength / w; ++l)
                            covData += String.fromCharCode.apply(null, new Uint8Array(
                                data.slice(l * w, l * w + w)));
                        covData += String.fromCharCode.apply(null, new Uint8Array(data
                            .slice(l * w)));
                        if (covData.indexOf('html') != -1) {
                            var tableData = "",
                                trData;
                            covData = $(covData).find('tr');
                            underscoreJS.each(covData, function (_tr, _ind) {
                                if (tableData) {
                                    tableData += '\n';
                                }
                                trData = "";
                                underscoreJS.each($(_tr).find('td'), function (_td, _i) {
                                    if (trData) {
                                        trData += del;
                                    }
                                    trData += $(_td).text();
                                });
                                tableData += trData;
                            });
                            oController._fileData = tableData;
                        } else {
                            this.oGenerator = new ExcelPlus();
                            this.oGenerator.open(btoa(covData), {
                                type: 'base64',
                                dateNF: "mm/dd/yyyy"
                            })
                            sheetNames = this.oGenerator.oFile.SheetNames;
                            var sheet = this.oGenerator.oFile.Sheets[sheetNames[0]]
                            this.oGenerator.selectSheet(sheetNames[0]);
                            //*****Rel 60E_SP6 - ECIP #16807*/
                            var region = commonUtils.getRegionValue();
                            var keys = underscoreJS.keys(sheet);
                            underscoreJS.each(keys, function (key) {
                                var sheetData = sheet[key];
                                if (sheetData && underscoreJS.isObject(sheetData)) {
                                    if (sheetData.t === "n" && sheetData.w.indexOf('.') !== -1) {
                                        sheetData.w = parseFloat(sheetData.w).toLocaleString(region);
                                    }
                                }

                            });
                            /**/
                            oController._fileData = this.oGenerator.readAll()
                            // oController._fileData = this.oGenerator.readAll({parseDate:true,propertiesOnly:true})

                        }
                    } else {
                        oController._fileData = data;
                    }

                    if (isExcel) {
                        var oRows = oController._fileData;
                        var oRowCount = 0;
                        var oLength = oRows.length;
                        var regex = /^[null,]+$/;
                        for (var i = 0; i < oRows.length; i++) {
                            var oColCount = 0;
                            for (var j = 0; j < oRows[i].length; j++) {

                                if (regex.test(oRows[i])) {
                                    break;
                                }

                                if (oRows[i][j] === null) {
                                    oRows[i][j] = ""
                                }
                                oColCount = oColCount + 1;
                                oController._oExcelData.push({
                                    "ROW": i + 1,
                                    "COL": j + 1,
                                    "VALUE": oRows[i][j]
                                });
                            }
                        }
                    }
                    /*** Rel 60E_SP6 - QA #12514 ***/
                    else {
                        oController._fileData = oController._fileData.replace(/\n/g, '@$'); // Row
                        if (oTabFile == "TAB") {
                            oController._fileData = oController._fileData.replace(/\t/g, "@#"); // Cell
                        }
                        else {
                            oController._fileData = oController._fileData.replace(/\n/g, '@$'); // Row
                        }
                        oController._oExcelData = oController._fileData.split("@$");
                        if (oTabFile != "FIX") {
                            for (var i in oController._oExcelData) {
                                oController._oExcelData[i] = oController._oExcelData[i].trim()
                            }
                        }
                        else {
                            for (var i in oController._oExcelData) {
                                oController._oExcelData[i] = oController._oExcelData[i].replace(/[\s\r\n\t]*$/, '');
                            }
                            while (oController._oExcelData[oController._oExcelData.length - 1] === "") {
                                oController._oExcelData.pop();
                            }

                        }

                    }
                    //                      else if (oTabFile == "TAB") {
                    //
                    //                          oController._fileData = oController._fileData.replace(/\n/g, '@$'); // Row
                    //                          oController._fileData = oController._fileData.replace(/\t/g, "@#"); // Cell
                    //                          oController._oExcelData = oController._fileData.split("@$");
                    //                          for (var i in oController._oExcelData) {
                    //                              oController._oExcelData[i] = oController._oExcelData[i].trim()
                    //                          }
                    //                      }
                    //                      else {
                    //                          oController._fileData = oController._fileData.replace(/\n/g, '@$'); // Row
                    //                          oController._oExcelData = oController._fileData.split("@$");
                    //                          if (oTabFile != "FIX") {
                    //                              for (var i in oController._oExcelData) {
                    //                                  oController._oExcelData[i] = oController._oExcelData[i].trim()
                    //                              }
                    //                          }
                    //                      }
                    /****/
                    var action = {
                        "FNCNM": global.vui5.cons.eventName.fileUpload,
                        "RQTYP": global.vui5.cons.reqTypeValue.post,
                        hideLoader: true
                    };
                    var section = oController.getSectionBy('SECTN', sectionID);
                    var model = oController.getCurrentModel();
                    var dataArea = section['DATAR'];
                    var objConfig = {
                        method: action['RQTYP'] === global.vui5.cons.reqTypeValue.post ? global.vui5.cons.reqType.post : global.vui5.cons.reqType.get,
                        action: action['FNCNM'],
                        actionRef: action,
                        sectionId: sectionID,
                        context: oController.currentRoute,
                        hideLoader: !!action.hideLoader
                    };
                    if (isExcel) {
                        var objParams = {};
                        objParams["isExcel"] = isExcel;
                        objConfig['urlParams'] = objParams;
                        objConfig.data = oController._oExcelData;
                    } else {
                        //objConfig.data = oController._fileData;
                        objConfig.data = oController._oExcelData;
                    }
                    return oController.processServerEvent(objConfig).then(function (response) {
                        if (response[dataIDField]) {
                            oController.getCurrentModel().setProperty(dataIdPath, response['DATAID'])
                        }
                    });
                };

                if (isExcel) {
                    oFileReader.readAsArrayBuffer(files[0]);
                } else {
                    oFileReader.readAsText(files[0]);
                }
            },
            //            processFileUpload: function (sectionID, oEvent, dataPath, field) {
            //                //jQuery.sap.require("globalUtilsPath" + "/plugins/xls_jszip");
            //                //jQuery.sap.require("globalUtilsPath" + "/plugins/xls_fileRead");
            //                var oController = this;
            //                var isExcel = "",
            //                    oTabFile;
            //
            //                var files = oEvent.getParameter('files');
            //                if (files.length == 0) {
            //                    oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
            //                    return;
            //                }
            //                oController._oExcelData = [];
            //                oController._fileData = "";
            //                var dataIDField = field["CFIELDNAME"];
            //                var dataIdPath = dataPath + field["CFIELDNAME"];
            //
            //                oTabFile = 'TXT';
            //
            //                if (!/.csv$/.test(files[0].name) && !/.txt$/.test(files[0].name) && oTabFile != "TAB") {
            //                    isExcel = "X";
            //                }
            //
            //                var oFileReader = new FileReader();
            //                oFileReader.onload = function (evt) {
            //                    var data = evt.target.result,
            //                        workbook = '';
            //
            //                    if (isExcel) {
            //                        var covData = "",
            //                            l = 0,
            //                            w = 10240;
            //                        for (; l < data.byteLength / w; ++l)
            //                            covData += String.fromCharCode.apply(null, new Uint8Array(
            //                                data.slice(l * w, l * w + w)));
            //                        covData += String.fromCharCode.apply(null, new Uint8Array(data
            //                            .slice(l * w)));
            //                        if (covData.indexOf('html') != -1) {
            //                            var tableData = "",
            //                                trData;
            //                            covData = $(covData).find('tr');
            //                            underscoreJS.each(covData, function (_tr, _ind) {
            //                                if (tableData) {
            //                                    tableData += '\n';
            //                                }
            //                                trData = "";
            //                                underscoreJS.each($(_tr).find('td'), function (_td, _i) {
            //                                    if (trData) {
            //                                        trData += del;
            //                                    }
            //                                    trData += $(_td).text();
            //                                });
            //                                tableData += trData;
            //                            });
            //                            oController._fileData = tableData;
            //                        } else {
            //                            workbook = vuiXLSX.read(btoa(covData), {
            //                                type: 'base64'
            //                            });
            //                            var sheetName = '';
            //                            underscoreJS.each(workbook.Sheets, function (data, inx) {
            //                                if (!sheetName) {
            //                                    sheetName = inx;
            //                                }
            //                            });
            //                            oController._fileData = vuiXLSX.utils
            //                                .sheet_to_csv(workbook.Sheets[sheetName]);
            //                        }
            //                    } else {
            //                        oController._fileData = data;
            //                    }
            //
            //                    if (isExcel) {
            //                    // oController._fileData = oController._fileData.replace(/,/g, '@#'); // Cell
            //                      oController._fileData = oController._fileData.replace(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/g,'@#')
            //                      oController._fileData = oController._fileData.replace(/"/g,'')
            //                      oController._fileData = oController._fileData.replace(/\n/g, '@$'); // Row
            //
            //                        var oRows = oController._fileData.split("@$");
            //                        var oRowCount = 0;
            //                        var oLength = "";
            //
            //                        if (isExcel) {
            //                            oLength = oRows.length - 1;
            //                        } else {
            //                            oLength = oRows.length;
            //                        }
            //
            //                        for (var i = 0; i < oLength; i++) {
            //                            var oRowData = oRows[i].split("@#");
            //                            oRowCount = oRowCount + 1;
            //                            var oColCount = 0;
            //
            //                            for (var j = 0; j < oRowData.length; j++) {
            //                                oColCount = oColCount + 1;
            //                                oController._oExcelData.push({
            //                                    "ROW": oRowCount,
            //                                    "COL": oColCount,
            //                                    "VALUE": oRowData[j]
            //                                });
            //                            }
            //                        }
            //                    } else if (oTabFile == "TAB") {
            //                        oController._fileData = oController._fileData.replace(/\n/g, '@$'); // Row
            //                        oController._fileData = oController._fileData.replace(/\t/g, "@#"); // Cell
            //                        oController._oExcelData = oController._fileData.split("@$");
            //                    } else {
            //                        oController._fileData = oController._fileData.replace(/\n/g, '@$'); // Row
            //                        oController._oExcelData = oController._fileData.split("@$");
            //                    }
            //
            //                    var action = {
            //                        "FNCNM": global.vui5.cons.eventName.fileUpload,
            //                        "RQTYP": global.vui5.cons.reqTypeValue.post,
            //                        hideLoader: true
            //                    };
            //                    var section = oController.getSectionBy('SECTN', sectionID);
            //                    var model = oController.getCurrentModel();
            //                    var dataArea = section['DATAR'];
            //                    var objConfig = {
            //                        method: action['RQTYP'] === global.vui5.cons.reqTypeValue.post ? global.vui5.cons.reqType.post : global.vui5.cons.reqType.get,
            //                        action: action['FNCNM'],
            //                        actionRef: action,
            //                        sectionId: sectionID,
            //                        context: oController.currentRoute,
            //                        hideLoader: !!action.hideLoader
            //                    };
            //                    if (isExcel) {
            //                        var objParams = {};
            //                        objParams["isExcel"] = isExcel;
            //                        objConfig['urlParams'] = objParams;
            //                        objConfig.data = oController._oExcelData;
            //                    } else {
            //                        //objConfig.data = oController._fileData;
            //                        objConfig.data = oController._oExcelData;
            //                    }
            //                    return oController.processServerEvent(objConfig).then(function (response) {
            //                        if (response[dataIDField]) {
            //                            oController.getCurrentModel().setProperty(dataIdPath, response['DATAID'])
            //                        }
            //                    });
            //                };
            //
            //                if (isExcel) {
            //                    oFileReader.readAsArrayBuffer(files[0]);
            //                } else {
            //                    oFileReader.readAsText(files[0]);
            //                }
            //
            //
            //            },
            preProcessFieldEvent: function (sectionID, oEvent) {
                var oController = this;
                var subEventType = oEvent.getParameter('eventType');
                var fieldInfo = oEvent.getParameter('fieldInfo') || oEvent.getSource().data("fieldInfo") || {};
                var fieldValue = oEvent.getParameter('fieldValue');
                var rsparams = oEvent.getParameter('rsparams');
                var maxRows = oEvent.getParameter('maxRows');
                var _oEvent = oEvent.getParameter('oEvent');
                var source = _oEvent ? _oEvent.getSource() : '';
                var mainModel = oController.getModel(global.vui5.modelName);
                var params = {},
                    promise,
                    action,
                    fieldName,
                    typeAhead = {}, hideLoader = true;
                var objDefer = $.Deferred();
                var rowId = oEvent.getParameter('rowId') || '';
                fieldName = fieldInfo['FLDNAME'];

                switch (subEventType) {
                    case global.vui5.cons.fieldSubEvent.typeAhead:
                        mainModel.setProperty("/TYPEAHEAD", typeAhead);
                        rsparams = underscoreJS.isEmpty(rsparams) ? oController._getDependentFields(sectionID, source, fieldInfo) : rsparams;
                        break;
                    case global.vui5.cons.fieldSubEvent.search:
                        hideLoader = false;
                        break;
                }
                if (subEventType)
                    params[global.vui5.cons.params.eventType] = subEventType;
                if (fieldValue)
                    params[global.vui5.cons.params.fieldValue] = fieldValue;
                if (fieldName)
                    params[global.vui5.cons.params.fieldName] = oController._specialCharacterReplace(fieldName);
                if (maxRows)
                    params[global.vui5.cons.params.maxRows] = maxRows;
                if (fieldInfo['TABNAME'])
                    params[global.vui5.cons.params.tableName] = fieldInfo['TABNAME'];
                /***Rel 60E SP6 ECIP #19732 - Start ***/
                if (fieldInfo['SHLPNAME'] || oEvent.getParameter('currentSearchHelp'))
                    params[global.vui5.cons.params.searchHelpName] = fieldInfo['SHLPNAME'] || oEvent.getParameter('currentSearchHelp');
                /***Rel 60E SP6 ECIP #19732 - End ***/
                if (fieldInfo['SELECTED_SHLP'])
                    params[global.vui5.cons.params.selectedSearchHelpName] = fieldInfo['SELECTED_SHLP'];
                if (rowId) {
                    params[global.vui5.cons.params.selectedRow] = rowId;
                }
                if (fieldInfo['NRART']) {
                    params[global.vui5.cons.params.nrart] = fieldInfo['NRART'];
                }
                
                if(fieldInfo['ROLLNAME']){
                	params[global.vui5.cons.params.rollName] = fieldInfo['ROLLNAME'];
                }

                //*****Rel 60E_SP6 - Sanofi Req
                var flag = false;
                var section = oController.getSectionBy('SECTN', sectionID);
                if (section && section['DAPPT'] === vui5.cons.propertyType.selections && oController.sectionRef[sectionID] &&
                    oController.sectionRef[sectionID].getEnableDescrSearch && oController.sectionRef[sectionID].getEnableDescrSearch()) {
                    flag = true;
                }
                if (flag) {
                    if (fieldInfo['SDSCR'] == global.vui5.cons.fieldValue.description || fieldInfo['SDSCR'] == global.vui5.cons.fieldValue.value_cont_descr ||
                        fieldInfo['SDSCR'] == global.vui5.cons.fieldValue.value_descr)
                        params[global.vui5.cons.params.searchType] = 'DSC';
                    else if (fieldInfo['SDSCR'] == global.vui5.cons.fieldValue.value)
                        params[global.vui5.cons.params.searchType] = 'VAL';
                }
                else {
                    //*****
                    if (fieldInfo['SDSCR'] == global.vui5.cons.fieldValue.description || fieldInfo['SDSCR'] == global.vui5.cons.fieldValue.value_cont_descr)
                        params[global.vui5.cons.params.searchType] = 'DSC';
                    else if (fieldInfo['SDSCR'] == global.vui5.cons.fieldValue.value || fieldInfo['SDSCR'] == global.vui5.cons.fieldValue.value_descr)
                        params[global.vui5.cons.params.searchType] = 'VAL';

                    //*****Rel 60E_SP6 - Sanofi Req
                }
                //*****

                action = {
                    "FNCNM": global.vui5.cons.eventName.helpValuesGet,
                    "RQTYP": global.vui5.cons.reqTypeValue.post,
                    hideLoader: hideLoader
                };

                promise = oController.processFieldEvent(sectionID, action, params, rsparams);
                if (promise && promise.then) {
                    promise.then(function (response) {
                        oController.modifySpecialCharacters(response);
                        switch (subEventType) {
                            case global.vui5.cons.fieldSubEvent.typeAhead:
                                // response = response['DATA'];
                                typeAhead = {};
                                typeAhead[fieldName] = {};
                                typeAhead[fieldName]['FIELDS'] = response['RESULT_FCAT'];
                                typeAhead[fieldName]['DATA'] = response['RESULT_DATA'];
                                typeAhead[fieldName]['RETURNFIELD'] = response['RETFIELD'];
                                typeAhead[fieldName]['DESCRFIELD'] = response['DESCRFIELD'];
                                mainModel.setProperty("/TYPEAHEAD", typeAhead);
                                /* Set list width */
                                if (typeAhead[fieldName]['FIELDS'] && source) {
                                    var length = typeAhead[fieldName]['FIELDS'].length;
                                    var width = (length + 1) * 10;
                                    if (width > 90)
                                        width = 90;
                                    width = width + "%";
                                    source.setMaxSuggestionWidth(width);
                                }
                                break;
                        }

                        objDefer.resolve(response);
                    });
                }
                return objDefer.promise();
            },
            processFieldEvent: function (sectionID, action, fieldInfo, rsparams) {
                var oController = this;
                var section = oController.getSectionBy('SECTN', sectionID);
                var model = oController.getCurrentModel();
                var dataArea = section['DATAR'];
                /*** Rel 60E SP6 - Planning/Pricing related Changes - Start ***/
                var objDefer = $.Deferred();
                /*** Rel 60E SP6 - Planning/Pricing related Changes - End ***/
                var objConfig = {
                    method: action['RQTYP'] === global.vui5.cons.reqTypeValue.post ? global.vui5.cons.reqType.post : global.vui5.cons.reqType.get,
                    action: action['FNCNM'],
                    actionRef: action,
                    dataArea: dataArea,
                    urlParams: fieldInfo,
                    sectionId: sectionID,
                    context: oController.currentRoute,
                    hideLoader: !!action.hideLoader
                };

                /*** Rel 60E SP6 - Planning/Pricing related Changes - Start ***/
                /*if (objConfig.action === global.vui5.cons.eventName.helpValuesGet ||
                    objConfig.action === global.vui5.cons.eventName.fieldValueConversion ||
                    objConfig.action === global.vui5.cons.eventName.fieldValueCheck) {
            
                    if (rsparams) {
                        objConfig.data = rsparams;
                    } else {
                        objConfig.data = oController.getChangedData(dataArea);
                    }
                }
                return oController.callServer(objConfig);*/
                if (objConfig.action === global.vui5.cons.eventName.helpValuesGet ||
                    objConfig.action === global.vui5.cons.eventName.fieldValueConversion ||
                    objConfig.action === global.vui5.cons.eventName.fieldValueCheck) {

                    if (rsparams) {
                        objConfig.data = rsparams;
                        return oController.callServer(objConfig);
                    } else {
                        oController.getChangedData(dataArea).then(function (data) {
                            objConfig.data = data;
                            //*****Rel 60E_SP6 - QA #11193
                            /*oController.callServer(objConfig).then(function () {
                                objDefer.resolve();
                            });*/
                            oController.callServer(objConfig).then(function (result) {
                                objDefer.resolve(result);
                            });
                            //*****
                        });
                        return objDefer.promise();
                    }
                }
                //*****Rel 60E_SP6 - QA #11081
                else {
                    return oController.callServer(objConfig);
                }
                //*****

                /*** Rel 60E SP6 - Planning/Pricing related Changes - End ***/
            },
            onValueHelpRequest: function (sectionID, oEvent) {

                var oController = this, modelName, path, model, fieldInfo, dataArea, valueHelpEvent, section,
                    mainModel, src, _oInputHelpDialog, multiselect, supportRanges, dappt, tokenDisplayBehaviour;
                valueHelpEvent = oEvent.getParameter('oEvent') || oEvent;
                mainModel = oController.getMainModel();
                section = oController.getSectionBy('SECTN', sectionID)
                src = valueHelpEvent.getSource();
                modelName = src.data("model");
                path = src.data("path");
                //*****Rel 60E_SP6 - Sanofi Req
                dappt = src.data("dappt");
                //*****
                if (modelName && path) {
                    model = src.getModel(modelName);
                    fieldInfo = model.getProperty(path);
                    dataArea = src.data("dataArea");
                } else if (oEvent.getParameter("fieldInfo")) {
                    fieldInfo = oEvent.getParameter("fieldInfo") || oEvent.getSource().data("fieldInfo") || {};
                }
                fieldInfo['SELECTED_SHLP'] = '';
                if (section['DAPPT'] === global.vui5.cons.propertyType.selections && (fieldInfo['DATATYPE'] === global.vui5.cons.dataType.quantity || fieldInfo['DATATYPE'] === global.vui5.cons.dataType.amount)) {
                    global.vui5.cons['inputHelpFieldInfo'] = fieldInfo;
                    global.vui5.cons['controller'] = oController;
                }

                multiselect = fieldInfo['MULTISELECT'] === "X" || fieldInfo['QENTP'] === global.vui5.cons.quickEntryType.multiValue;
                supportRangesOnly = fieldInfo['SUPPORTRANGESONLY'] === true;

                //*****Rel 60E_SP6 - Sanofi Req
                if (dappt && dappt === vui5.cons.propertyType.selections) {
                    if (fieldInfo['SDSCR'] === vui5.cons.fieldValue.value) {
                        tokenDisplayBehaviour = sap.ui.comp.smartfilterbar.DisplayBehaviour.idOnly;
                    }
                    else if (fieldInfo['SDSCR'] === vui5.cons.fieldValue.description) {
                        tokenDisplayBehaviour = sap.ui.comp.smartfilterbar.DisplayBehaviour.descriptionOnly;
                    }
                    else if (fieldInfo['SDSCR'] === vui5.cons.fieldValue.value_cont_descr) {
                        tokenDisplayBehaviour = sap.ui.comp.smartfilterbar.DisplayBehaviour.descriptionAndId;
                    }
                    else if (fieldInfo['SDSCR'] === vui5.cons.fieldValue.value_descr) {
                        tokenDisplayBehaviour = sap.ui.comp.smartfilterbar.DisplayBehaviour.idAndDescription;
                    }
                }
                else {
                    tokenDisplayBehaviour = "DropDown Text";
                }
                //*****

                _oInputHelpDialog = new global.vui5.ui.controls.InputHelp({
                    //*****Rel 60E_SP6 - Sanofi Req
                    controller: oController,
                    //*****
                    modelName: modelName,
                    fieldInfo: fieldInfo,
                    fieldID: src.getId(),
                    rowId: oEvent.getParameter("rowId"),
                    supportMultiselect: multiselect,
                    supportRanges: multiselect,
                    supportRangesOnly: !!src.data("SUPPORTRANGESONLY"),
                    dataArea: dataArea,
                    /***Rel 60E SP6 ECDM #4695 - Start ***/
                    //typeAheadActive: oEvent.getParameters("fromSuggestions").fromSuggestions,
                    typeAheadActive: valueHelpEvent.getParameters("fromSuggestions").fromSuggestions,
                    /***Rel 60E SP6 ECDM #4695 - End ***/
                    //*****Rel 60E_SP6 - Sanofi Req
                    //tokenDisplayBehaviour: "DropDown Text",
                    tokenDisplayBehaviour: tokenDisplayBehaviour,
                    //*****
                    stretch: sap.ui.Device.system.phone
                });
                _oInputHelpDialog.setModel(oController.getModel(global.vui5.modelName), global.vui5.modelName);
                _oInputHelpDialog.setModel(oController.getModel(modelName), oController.modelName);
                _oInputHelpDialog.preProcessFieldEvent = function (oEvent) {
                    return oController.preProcessFieldEvent(sectionID, oEvent);
                };
                _oInputHelpDialog.getDependentFields = function (source, fieldInfo) {
                    return oController._getDependentFields(sectionID, source, fieldInfo);
                };
                _oInputHelpDialog._isMultiInputField = function (source, fieldInfo) {
                    return oController._isMultiInputField(source, fieldInfo);
                };
                _oInputHelpDialog._handleCheckFieldsMessages = function (source, fieldInfo) {
                    return oController._handleCheckFieldsMessages(sectionID, source, fieldInfo);
                };
                _oInputHelpDialog.onF4Select = function (oEvent) {
                    return oController.onF4Select(oEvent);
                };
                _oInputHelpDialog._onCheckBoxSelect = function (oEvent) {
                    return oController._onCheckBoxSelect(oEvent);
                };
                _oInputHelpDialog.onValueHelpRequest = function (oEvent) {
                    return oController.onValueHelpRequest(sectionID, oEvent);
                };
                _oInputHelpDialog._getMultiInputDataPath = function (input) {
                    return oController._getMultiInputDataPath(input)
                }
                _oInputHelpDialog.prepareInputHelpDialog();
                jQuery.sap.syncStyleClass(oController.getOwnerComponent().getContentDensityClass(), oController.getView(), _oInputHelpDialog);

            },
            /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - Start ***/
            onMultiF4Select: function (oEvent) {
                var oController = this, found = false, type, source, object, model, tokens,
                    tokenValues = [], objectValues = [], descrValue;
                source = oEvent.getSource();
                model = source.getModel(source.data('model'));
                type = oEvent.getParameter("type");
                if (type === "tokensChanged") {

                    object = model.getProperty(oController._getMultiInputDataPath(source)) || [];
                    tokens = source.getTokens();
                    underscoreJS.each(tokens, function (tokenData) {
                        if (tokenData.data("row")) {
                            descrValue = tokenData.data("row")[source.data("descrField")];
                        }
                        else if (tokenData.getKey() !== tokenData.getText()) {
                            descrValue = tokenData.getText();
                        }
                        else {
                            descrValue = tokenData.getKey();
                        }
                        tokenValues.push({
                            "KEY": tokenData.getKey(),
                            "TEXT": descrValue
                        });
                    }
                    );
                    source.data("tokenValues", tokenValues);
                    source.fireChange();

                }
            },
            onF4Select: function (oEvent, flag, source) {

                var type = oEvent.getParameter("type");
                if ((type != undefined && type === "tokensChanged") || flag) {
                    var oSource;
                    if (flag) {
                        oSource = source;
                    }
                    else {
                        oSource = oEvent.getSource();
                    }
                    var fieldPath = oSource.data('path');
                    var model = oSource.getModel(oSource.data('model'));
                    var fieldInfo = model.getProperty(fieldPath);
                    var token = oSource.getBinding("tokens");
                    var object = model.getProperty(token.getPath());
                    var tokens = oSource.getTokens();
                    var newTokens = [];
                    var newTexts = [];
                    underscoreJS.each(tokens, function (obj) {
                        var range = obj.data("range");
                        if (range) {
                            var sign = global.vui5.cons.seloptSign.include;
                            if (range.exclude)
                                sign = global.vui5.cons.seloptSign.exclude;
                            newTokens.push({
                                "SHLPNAME": fieldInfo['SHLPNAME'],
                                "FIELDNAME": fieldInfo['FLDNAME'],
                                "SHLPFIELD": fieldInfo['FLDNAME'],
                                "SELNAME": fieldInfo['FLDNAME'],
                                "TABNAME": fieldInfo['TABNAME'],
                                "OPTION": range.operation,
                                "LOW": range.value1,
                                "HIGH": range.value2,
                                "SIGN": sign,
                                "TEXT": obj.getText(),
                                //*****Rel 60E_SP6 - Sanofi Req
                                "LOW_TXT": "",
                                "HIGH_TXT": ""
                                //*****
                            });
                        } else {
                            //*****Rel 60E_SP6 - Sanofi Req
                            var dappt = oSource.data("dappt"), low;
                            if (dappt && dappt === vui5.cons.propertyType.selections) {
                                low = obj.getKey();
                            }
                            else {
                                low = obj.getText();
                            }
                            //*****
                            newTokens.push({
                                "SHLPNAME": fieldInfo['SHLPNAME'],
                                "FIELDNAME": fieldInfo['FLDNAME'],
                                "SHLPFIELD": fieldInfo['FLDNAME'],
                                "SELNAME": fieldInfo['FLDNAME'],
                                "TABNAME": fieldInfo['TABNAME'],
                                "OPTION": '',
                                //*****Rel 60E_SP6 - Sanofi Req
                                //"LOW": obj.getText(),
                                "LOW": low,
                                //*****
                                "HIGH": '',
                                "SIGN": "",
                                "TEXT": obj.getText(),
                                //*****Rel 60E_SP6 - Sanofi Req
                                "LOW_TXT": "",
                                "HIGH_TXT": ""
                                //*****
                            });
                        }
                        newTexts.push(obj.getText());
                    });
                    var oldTexts = [];
                    for (var i = 0; i < object.length; i++) {
                        oldTexts.push(object[i]['TEXT']);
                    }
                    var diff = underscoreJS.difference(oldTexts, newTexts);
                    if (diff.length == 0)
                        diff = underscoreJS.difference(newTexts, oldTexts);
                    if (diff.length != 0) {
                        object = newTokens;
                        model.setProperty(token.getPath(), object);
                        oSource.fireChange();
                    }
                }
            }
            ,
            getBindingExpression: function (name, section, index) {
                var result;
                var oController = this;
                var mainModel = oController.getModel(global.vui5.modelName);
                var model = oController.getCurrentModel();
                var path = oController._getPath(true);
                var dataPath = oController._getPath();
                switch (name) {
                    case 'pageTitle':
                        result = "{" + oController.modelName + ">" + dataPath + "APTIT}";
                        break;
                    case 'visible':
                        result = "{= ${" + oController.modelName + ">" + path + index + "/HDSCT} === ''}";
                        break;
                    case 'title':
                        result = section['DESCR'] + " (" + "{" + oController.modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.maxItems + "}" + ")";
                        break;
                    case 'totalNumberOfRows':
                        result = "{parseInt(" + oController.modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.maxItems + ")}";
                        break;
                    case 'pageSize':
                        // result = "{parseInt(" + oController.modelName +
                        // ">/SECCFG/" + section['SECTN'] + "/attributes/" +
                        // global.vui5.cons.attributes.pageSize + ")}";
                        result = "{" + oController.modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.pageSize + "}";
                        break;
                    case 'pageType':
                        result = "{" + oController.modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.pageType + "}";
                        break;
                    //*****Rel 60E_SP6
                    case 'hideFilterBar':
                        result = "{= ${" + oController.modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.hideFilterBar + "} === 'X'}";
                        break;
                    //*****
                    case 'showFilterConfiguration':
                        result = oController.modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.showFilterConfiguration;
                        break;
                    /**** Rel 60E SP6 - FullScreen Support changes - Start ***/
                    case 'editable':
                        result = "{= (${" + global.vui5.modelName + ">/DOCUMENT_MODE} !== 'A' || ${" + oController.modelName + ">" + path + index + "/EDIT} === 'X' ) && " +
                            " ${" + oController.modelName + ">" + path + index + "/INEDT} === 'X' &&" + " ${" + oController.modelName + ">" + path + index + "/DISOL} === '' }";
                        break;
                    case 'enableLocalSearch':
                        result = "{= ${" + oController.modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.enableLocalSearch + "} === 'X' }";
                        break;
                    case 'attachmentEditable':
                        result = "{= (${" + oController.modelName + ">" + path + index + "/EDIT} === 'X' ) && " +
                            " ${" + oController.modelName + ">" + path + index + "/INEDT} === 'X' &&" + " ${" + oController.modelName + ">" + path + index + "/DISOL} === '' }";
                        break;
                    case 'noteEditable':
                        // result = "{= ${" + global.vui5.modelName + ">/DOCUMENT_MODE} !== 'A' &&" +
                        //    " ${" + oController.modelName + ">" + path + index + "/DISOL} === '' }";
                        result = "{=${" + oController.modelName + ">" + path + index + "/DISOL} === '' }";
                        break;
                    case 'handle':
                        result = "{" + oController.modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.handle + "}";
                        break;
                    case 'enablePersonalization':
                        result = "{= ${" + oController.modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.enablePersonalization + "} === 'X' }";
                        break;
                    case 'mode':
                        result = "{= ${" + oController.modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.rowSelection + "} === 'X' ? " +
                            sap.m.ListMode.MultiSelect + ":" + sap.m.ListMode.None + "}";
                        break;
                    case 'listTitle':
                        result = "{" + oController.modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.title + "}";
                        break;
                    case 'description':
                        result = "{" + oController.modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.description + "}";
                        break;
                    case 'iconField':
                        result = "{" + oController.modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.iconField + "}";
                        break;
                    case 'counter':
                        result = "{" + oController.modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.counter + "}";
                        break;
                    case 'backendSortFilter':
                        result = "{= ${" + oController.modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.backendSortFilter + "} === 'X' }";
                        break;
                    case 'totalNumberOfPages':
                        result = "{" + oController.modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.totalNumberofPages + "}";
                        break;
                    case 'descriptionField':
                        result = "{" + oController.modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.descriptionField + "}";
                        break;
                    case 'selectedField':
                        result = "{" + oController.modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.selectedField + "}";
                        break;
                    case 'sectionVisible':
                        result = "{= ${" + oController.modelName + ">" + path + index + "/HDSCT} === '' &&  ${" + oController.modelName + ">" + path + index + "/SCGRP} === ''}";
                        break;
                    case 'selectedlayout':
                        result = "{" + oController.modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.selectedLayout + "}";
                        break;

                }
                return result;
            }
            ,
            _filterDropdownPrepare: function (sectionObject, currObj, filterFunction) {
                var oController = this, mainModel, model, sectionID;
                mainModel = oController.getModel(global.vui5.modelName);
                model = oController.getModel(oController.modelName);
                sectionID = sectionObject['SECTN'];
                var oBox = new global.vui5.ui.controls.ComboBox({
                    selectionChange: function (oEvent) {
                        var params = {},
                            urlParams = {},
                            fieldName,
                            filter;
                        filter = oEvent.getParameter('selectedItem');
                        fieldName = oEvent.getSource().getBinding('items').getPath().split("/")[3];
                        params['NAME'] = filter.getKey();
                        params['VALUE'] = filter.getText();
                        urlParams[global.vui5.cons.params.fieldName] = fieldName;
                        oController.processAction(sectionID, filterFunction, params, urlParams).fail(function () {
                            oBox.setSelectedKey(oController.getCurrentModel().getProperty("/SECCFG/" + sectionObject['SECTN'] + "/attributes/" + currObj['SFATR']));
                        });
                    }
                }).setModel(model, oController.modelName);
                oBox.setModel(mainModel, global.vui5.modelName);
                oBox.bindProperty('selectedKey', oController.modelName + ">" + "/SECCFG/" + sectionObject['SECTN'] + "/attributes/" + currObj['SFATR'], function (val) {
                    return val;
                }, sap.ui.model.BindingMode.OneWay);
                oBox.bindAggregation("items", global.vui5.modelName + ">" + "/DROPDOWNS/" + sectionObject['DARID'] + "/" + currObj['FIELD'] + "/", function (sId, oContext) {
                    return new sap.ui.core.Item({
                        key: oContext.getObject("NAME"),
                        text: oContext.getObject("VALUE")
                    });
                });
                return oBox;

            }
            ,
            addFilterContent: function (sectionObject, fromToolbar) {

                var oController = this,
                    sectionID,
                    sectionConfig,
                    filterFunction,
                    horzBox,
                    fieldName;
                var dropdowns = [];
                var mainModel = oController.getModel(global.vui5.modelName);
                var model = oController.getModel(oController.modelName);
                sectionID = sectionObject['SECTN'];
                sectionConfig = oController.sectionConfig[sectionID];
                if (!underscoreJS.isEmpty(sectionObject['FILTER'])) {
                    // var drpdns = underscoreJS.find(sectionObject['FILTER'], { "FLDTP":
                    // global.vui5.cons.fieldType.dropdown });
                    underscoreJS.each(sectionObject['FILTER'], function (obj, i) {
                        filterFunction = underscoreJS.findWhere(sectionObject['FUNC'], {
                            FNCNM: obj['FNCNM']
                        });
                        oController._sectionObject = sectionObject;
                        if (obj['FTDTP'] == global.vui5.cons.fieldType.dropdown && !fromToolbar) {

                            var oBox = oController._filterDropdownPrepare(sectionObject, obj, filterFunction);
                            horzBox = new sap.ui.layout.HorizontalLayout({
                                content: [
                                    new sap.m.Text({
                                        text: obj['LABEL']
                                    }).addStyleClass('labelClass'),
                                    oBox
                                ]
                            });
                            dropdowns.push(horzBox);
                        } else if (obj['FTDTP'] == global.vui5.cons.fieldType.segment && !fromToolbar) {
                            var segments = new sap.m.SegmentedButton({
                                select: function (oEvent) {
                                    var params = {},
                                        urlParams = {},
                                        fieldName;
                                    fieldName = oEvent.getSource().getBinding('items').getPath().split("/")[3];
                                    params['NAME'] = oEvent.getParameter("key");
                                    urlParams[global.vui5.cons.params.fieldName] = fieldName;
                                    oController.processAction(sectionID, filterFunction, params, urlParams);
                                }
                            }).setModel(model, oController.modelName);
                            segments.setModel(mainModel, global.vui5.modelName);
                            segments.bindProperty('selectedKey', oController.modelName + ">" + "/SECCFG/" + sectionObject['SECTN'] + "/attributes/" + obj['SFATR'], null, sap.ui.model.BindingMode.OneWay);
                            segments.bindAggregation("items", global.vui5.modelName + ">" + "/DROPDOWNS/" + global.vui5.cons.dropdownsDatar + "/SMODE/", function (sId, oContext) {
                                return new sap.m.SegmentedButtonItem({
                                    key: oContext.getObject("NAME"),
                                    text: oContext.getObject("VALUE")
                                });
                            });
                            var toolbar = new sap.m.Toolbar({
                                content: [new sap.m.ToolbarSpacer({
                                    width: "40%"
                                }),
                                    segments]
                            });
                            dropdowns.push(toolbar);
                        } else if (obj['FTDTP'] == global.vui5.cons.fieldType.toolbar && fromToolbar) {
                            var oBox = oController._filterDropdownPrepare(sectionObject, obj, filterFunction);
                            dropdowns = oBox;
                        }
                        //*****Rel 60E_SP6
                        else if (obj['FTDTP'] === global.vui5.cons.fieldType.facetFilter && fromToolbar) {
                            //                            var facetFilter = new sap.m.FacetFilter({
                            //                                type: sap.m.FacetFilterType.Simple,
                            //                                showPersonalization: false,
                            //                                showReset: false,
                            //                                confirm: function (oEvent) {
                            //                                    var oSource = oEvent.getSource(), params = {};
                            //                                    underscoreJS.each(oSource.getLists(), function (list) {
                            //                                        underscoreJS.each(list.getSelectedItems(), function (item) {
                            //                                            if (underscoreJS.isEmpty(params['NAME'])) {
                            //                                                params['NAME'] = item.getKey();
                            //                                            }
                            //                                            else {
                            //                                                params['NAME'] = params['NAME'] + "," + item.getKey();
                            //                                            }
                            //                                        })
                            //                                    });
                            //
                            //                                    oController.processAction(sectionID, filterFunction, params);
                            //                                },
                            //                                lists: [
                            //                                	new sap.m.FacetFilterList({
                            //                                	    title: obj['LABEL'],
                            //                                	    key: obj['FLDNAME']
                            //                                	}).bindAggregation("items", global.vui5.modelName + ">" + "/DROPDOWNS/" + sectionObject['DARID'] + "/" + obj['FIELD'] + "/", function (sId, oContext) {
                            //                                	    var oPath = oContext.getPath() + "/NAME";
                            //                                	    return new sap.m.FacetFilterItem({
                            //                                	        key: oContext.getObject("NAME"),
                            //                                	        text: oContext.getObject("VALUE")
                            //                                	    }).bindProperty("selected", {
                            //                                	        parts: [{ path: global.vui5.modelName + ">" + oPath },
                            //                                                    { path: oController.modelName + ">" + "/SECCFG/" + sectionObject['SECTN'] + "/attributes/" + obj['SFATR'] }],
                            //                                	        formatter: function (val, selectedKey) {
                            //                                	            if (val != undefined && selectedKey != undefined) {
                            //                                	                if (selectedKey.indexOf(",") === -1) {
                            //                                	                    if (selectedKey === val) { return true; }
                            //                                	                }
                            //                                	                else {
                            //                                	                    var selectedKeys = selectedKey.split(",") || [];
                            //                                	                    return selectedKeys.includes(val);
                            //                                	                }
                            //                                	                return false;
                            //                                	            }
                            //                                	        },
                            //                                	        mode: sap.ui.model.BindingMode.OneWay
                            //                                	    })
                            //                                	})
                            //                                ]
                            //                            });
                            //                            dropdowns = facetFilter;
                            var resetButton = new sap.m.Button({
                                text: "Clear",
                                //enabled:false

                            });
                            var list = new sap.m.List({
                                mode: sap.m.ListMode.MultiSelect,
                                //                    			selectionChange: function(oEvent){
                                //                    				if(oEvent.getSource().getSelectedItems().length !=0)
                                //                    					resetButton.setEnabled(true);
                                //                    				else
                                //                    					resetButton.setEnabled(false);
                                //                    			}
                            }).bindAggregation("items", global.vui5.modelName + ">" + "/DROPDOWNS/" + sectionObject['DARID'] + "/" + obj['FIELD'] + "/", function (sId, oContext) {

                                var oPath = oContext.getPath() + "/NAME";
                                return new sap.m.StandardListItem({
                                    title: oContext.getObject("VALUE")
                                }).data('key', oContext.getObject("NAME"))
                                    .bindProperty("selected", {
                                        parts: [{ path: global.vui5.modelName + ">" + oPath },
                                        { path: oController.modelName + ">" + "/SECCFG/" + sectionObject['SECTN'] + "/attributes/" + obj['SFATR'] }],
                                        formatter: function (val, selectedKey) {
                                            if (val != undefined && selectedKey != undefined) {
                                                if (selectedKey.indexOf(",") === -1) {
                                                    if (selectedKey === val) { return true; }
                                                }
                                                else {
                                                    var selectedKeys = selectedKey.split(",") || [];
                                                    return selectedKeys.includes(val);
                                                }
                                                return false;
                                            }
                                        },
                                        mode: sap.ui.model.BindingMode.OneWay
                                    })
                            });
                            list.setModel(model, oController.modelName);
                            list.setModel(mainModel, global.vui5.modelName);
                            var popover = new sap.m.Popover({
                                placement: sap.m.PlacementType.Bottom,
                                //modal:true,
                                showHeader: false,
                                footer: new sap.m.Toolbar({
                                    content: [
                                        new sap.m.ToolbarSpacer(),
                                        new sap.m.Button({
                                            text: "OK",
                                            press: function (oEvent) {
                                                var oSource = oEvent.getSource(), params = {};
                                                underscoreJS.each(list.getSelectedItems(), function (item) {
                                                    if (underscoreJS.isEmpty(params['NAME'])) {
                                                        params['NAME'] = item.data('key');
                                                    }
                                                    else {
                                                        params['NAME'] = params['NAME'] + "," + item.data('key');
                                                    }
                                                })

                                                oController.processAction(sectionID, filterFunction, params);
                                                popover.close();
                                            }
                                        }),
                                        new sap.m.Button({
                                            text: "Cancel",
                                            press: function (oEvent) {
                                                list.removeSelections();
                                                popover.close();
                                            }
                                        }),
                                        resetButton
                                    ]

                                }),
                                content: [list]
                            });
                            //                        	if(list.getSelectedItems().length != 0){
                            //                        		resetButton.setEnabled(true);
                            //                        	};
                            resetButton.attachPress(function (oEvent) {
                                //oEvent.getSource().setEnabled(false);
                                list.removeSelections();

                            });


                            var button = new sap.m.Button({
                                icon: "sap-icon://filter",
                                tooltip: obj['LABEL'],
                                press: function (oEvent) {
                                    list.getModel(global.vui5.modelName).updateBindings(true);
                                    popover.openBy(oEvent.getSource());
                                }
                            });
                            dropdowns = button;
                        }
                        //*****
                        else if (obj['FTDTP'] == global.vui5.cons.fieldType.date && !fromToolbar) {
                            var datePicker = new sap.m.DatePicker({
                                valueFormat: "yyyyMMdd",
                                placeholder: " ",
                                strictParsing: true,
                                change: function (oEvent) {
                                    var params = {},
                                        urlParams = {},
                                        fieldName;
                                    fieldName = oEvent.getSource().data("field")['FIELD'];
                                    params['NAME'] = oEvent.getParameter('value');
                                    urlParams[global.vui5.cons.params.fieldName] = fieldName;
                                    oController.processAction(sectionID, oEvent.getSource().data('function'), params, urlParams);
                                }
                            });
                            datePicker.setModel(model, oController.modelName);
                            datePicker.setModel(mainModel, global.vui5.modelName);
                            datePicker.data("field", obj);
                            datePicker.data("function", filterFunction)
                            datePicker.addStyleClass('vuiDatePicker');
                            datePicker.bindValue(oController.modelName + ">" + "/SECCFG/" + sectionObject['SECTN'] + "/attributes/" + obj['SFATR'], function (val) {
                                return val;
                            }, sap.ui.model.BindingMode.OneWay);

                            datePicker.bindProperty("displayFormat", global.vui5.modelName + ">" + global.vui5.cons.modelPath.sessionInfo + "/DATFM", Formatter.displayFormat, sap.ui.model.Binding.OneWay);
                            horzBox = new sap.ui.layout.HorizontalLayout({
                                content: [
                                    new sap.m.Text({
                                        text: obj['LABEL']
                                    }).addStyleClass('labelClass'),
                                    datePicker
                                ]
                            });
                            dropdowns.push(horzBox);

                        }
                        else if (obj['FTDTP'] != global.vui5.cons.fieldType.toolbar && fromToolbar) {
                            dropdowns = null;
                        }


                    });


                }
                return dropdowns;
            }
            ,
            switchSelection: function (oEvent) {
                var oController = this,
                    params = {},
                    switchKey,
                    index,
                    mainModel,
                    selectedSwitch;
                selectedSwitch = oEvent.getParameter('selectedItem');
                mainModel = oController.getModel(global.vui5.modelName);
                oController._itemSwitch = true;
                bufferRows = mainModel.getProperty("/DRILLDOWNKEYS/ROWID");
                switchKey = selectedSwitch.getKey();
                index = underscoreJS.indexOf(bufferRows, underscoreJS.findWhere(bufferRows, {
                    "ROWID": parseInt(switchKey)
                }));
                params['ROWID'] = bufferRows[index]['ROWID'];
                oController.processAction.call(oController, oController.getCurrentSubEntity().section, oController._onExpandAction, params, null);
            }
            ,
            addSwitchField: function () {
                var oController = this,
                    mainModel,
                    currentModel,
                    bufferRows = [],
                    horzBox;
                mainModel = oController.getModel(global.vui5.modelName);
                currentModel = oController.getCurrentModel();
                bufferRows = mainModel.getProperty("/DRILLDOWNKEYS/ROWID");
                var oBox = new global.vui5.ui.controls.ComboBox({
                    selectionChange: [oController.switchSelection, oController]
                }).setModel(currentModel, oController.modelName);
                oBox.setModel(mainModel, global.vui5.modelName);
                rowKey = oController.getCurrentSubEntity().key;
                bufferRows = mainModel.getProperty("/DRILLDOWNKEYS/ROWID");
                index = underscoreJS.indexOf(bufferRows, underscoreJS.findWhere(bufferRows, {
                    "ROWID": parseInt(rowKey)
                }));
                oBox.bindProperty('selectedKey', global.vui5.modelName + ">" + "/DRILLDOWNKEYS/ROWID/" + index + "/ROWID", null, sap.ui.model.BindingMode.OneWay);
                oBox.bindAggregation("items", global.vui5.modelName + ">" + "/DRILLDOWNKEYS/ROWID", function (sId, oContext) {
                    var contextObject = oContext.getObject();
                    return new sap.ui.core.Item({
                        key: contextObject['ROWID'],
                        text: contextObject['TEXT']
                    });
                });
                var oText = new sap.m.Text({
                    text: mainModel.getProperty("/DRILLDOWNKEYS/SWFLD")
                }).addStyleClass('labelClass');
                horzBox = new sap.ui.layout.HorizontalLayout({
                    content: [oText, oBox]
                });
                return horzBox;

            },

            _processEvents: function (cfg) {
                var oController = this,
                    section = cfg.section,
                    mainModel = oController.getModel(global.vui5.modelName),
                    index = cfg.index,
                    sectionID = section['SECTN'],
                    sectionPath = oController._getPath(true),
                    modelName = oController.modelName,
                    model = oController.getModel(modelName),
                    sectionModelPath = sectionPath + index + "/";
                var sectionConfig = oController.sectionConfig[sectionID];

                if (sectionConfig.attributes[global.vui5.cons.attributes.onDateResolChange]) {
                    sectionConfig.onDateResolChange = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onDateResolChange]
                    });
                }

                if (sectionConfig.attributes[global.vui5.cons.attributes.onEventAdd]) {
                    sectionConfig.onEventAdd = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onEventAdd]
                    });
                }

                if (sectionConfig.attributes[global.vui5.cons.attributes.onEventDelete]) {
                    sectionConfig.onEventDelete = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onEventDelete]
                    });
                }

                if (sectionConfig.attributes[global.vui5.cons.attributes.onNoEarlierThanChange]) {
                    sectionConfig.onNoEarlierThanChange = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onNoEarlierThanChange]
                    });
                }

                if (sectionConfig.attributes[global.vui5.cons.attributes.onNoLaterThanChange]) {
                    sectionConfig.onNoLaterThanChange = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onNoLaterThanChange]
                    });
                }

                if (sectionConfig.attributes[global.vui5.cons.attributes.onSwitchChange]) {
                    sectionConfig.onSwitchChange = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onSwitchChange]
                    });
                }

                var eventsRef = oController.sectionRef[sectionID] = new global.vui5.ui.controls.Events({
                    controller: oController,
                    modelName: modelName,
                    sectionID: sectionID,
                    sectionPath: sectionPath + index + "/",
                    noEarlierThan: "/SECCFG/" + section['SECTN'] + "/attributes/noEarlierThan",
                    noLaterThan: "/SECCFG/" + section['SECTN'] + "/attributes/noLaterThan",
                    hideBlock1: "/SECCFG/" + section['SECTN'] + "/attributes/hideBlock1",
                    hideBlock2: "/SECCFG/" + section['SECTN'] + "/attributes/hideBlock2",
                    hideBlock5: "/SECCFG/" + section['SECTN'] + "/attributes/hideBlock5",
                    editable: oController.getBindingExpression("editable", section, index),
                    dateResolChange: function (oEvent) {
                        oController.processAction(sectionID, sectionConfig.onDateResolChange);
                    },
                    eventAdd: function (oEvent) {
                        oController.processAction(sectionID, sectionConfig.onEventAdd);
                    },
                    eventDelete: function (oEvent) {
                        oController.processAction(sectionID, sectionConfig.onEventDelete);
                    },
                    noEarlierThanChange: function (oEvent) {
                        var params = oEvent.getParameter("params");
                        oController.processAction(sectionID, sectionConfig.onNoEarlierThanChange, null, params);
                    },
                    noLaterThanChange: function (oEvent) {
                        var params = oEvent.getParameter("params");
                        oController.processAction(sectionID, sectionConfig.onNoLaterThanChange, null, params);
                    },
                    switchChange: function (oEvent) {
                        oController.processAction(sectionID, sectionConfig.onSwitchChange);
                    }
                });

                eventsRef.prepareEventsControl();
            },
            showPanelContent: function (key) {
                var oController = this;
                var panelObj;
                var mainModel = oController.getModel(global.vui5.modelName);
                var section = oController.getSectionBy('SECTN', key);
                var model = oController.getModel(oController.modelName);
                var path = oController._getPath(true);
                var sections = model.getProperty(path);
                var sectionID = section['SECTN'];
                var index = underscoreJS.indexOf(sections, section);

                if (oController.getPanel) {
                    panelObj = oController.getPanel();
                }
                oController.sectionData = section;
                /* Prepare section config */
                if (oController.sectionConfig[sectionID] === undefined) {
                    oController.sectionConfig[sectionID] = {
                        keyField: section['KEYS'] || global.vui5.rowID,
                        fields: {},
                        metaDataLoaded: false
                    };
                }
                oController.sectionConfig[sectionID]['attributes'] = oController._flattenAttributes(section['ATTRB']);

                underscoreJS.each(section['FIELDS'], function (fld) {
                    oController.sectionConfig[sectionID]['fields'][fld['FLDNAME']] = {
                        attributes: oController._flattenAttributes(fld['ATTRB'])
                    }
                });

                oController._processCommonSections({
                    section: section
                });
                switch (section['DAPPT']) {
                    case global.vui5.cons.propertyType.form:
                        oController._processForm({
                            section: section,
                            index: index
                        });
                        break;
                    case global.vui5.cons.propertyType.table:
                        oController._processTable({
                            section: section,
                            index: index
                        });
                        break;
                    case global.vui5.cons.propertyType.selections:
                        oController._processSelections({
                            section: section,
                            index: index
                        });
                        break;
                    case global.vui5.cons.propertyType.variant:
                        oController.sectionRef[sectionID] = new sap.m.Button({
                            visible: false
                        });
                        break;
                    case global.vui5.cons.propertyType.postings:
                        oController._processPostings({
                            section: section,
                            index: index
                        });
                        break;
                    case global.vui5.cons.propertyType.tradecalendar:
                        oController._processCalendar({
                            section: section,
                            index: index
                        });
                        break;
                    case global.vui5.cons.propertyType.processFlow:
                        oController._processProcessFlow({
                            section: section,
                            index: index
                        });
                        break;
                    case global.vui5.cons.propertyType.status:
                        oController._processStatus({
                            section: section,
                            index: index
                        });
                        break;
                    case global.vui5.cons.propertyType.partners:
                        oController._processPartners({
                            section: section,
                            index: index
                        });

                        break;
                    case global.vui5.cons.propertyType.pdfViewer:
                        oController._processPdfViewer({
                            section: section,
                            index: index
                        });
                        break;
                    case global.vui5.cons.propertyType.synopsis:
                        oController._processSynopsis({
                            section: section,
                            index: index
                        });
                        break;
                    case global.vui5.cons.propertyType.texts:
                        oController._processTexts({
                            section: section,
                            index: index
                        });
                        break;
                    case global.vui5.cons.propertyType.reportingView:
                    case global.vui5.cons.propertyType.summary:
                        oController._processSummary({
                            section: section,
                            index: index
                        });
                        break;
                    case global.vui5.cons.propertyType.evaluationForm:
                        oController._processEvaluationForm({
                            section: section,
                            index: index
                        });
                        break;
                    //*****Rel 60E_SP6
                    case global.vui5.cons.propertyType.heatMap:
                        oController._processHeatMap({
                            section: section,
                            index: index
                        });
                        break;
                    case global.vui5.cons.propertyType.hierarchyTree:
                        oController._processHierarchyTree({
                            section: section,
                            index: index
                        });
                        break;
                    case global.vui5.cons.propertyType.availsHeader:
                        oController._processAvailsHeader({
                            section: section,
                            index: index
                        });
                        break;
                    //*****
                    case global.vui5.cons.propertyType.dashboard:
                        oController._processDashBoard({
                            section: section,
                            index: index
                        });
                        break;
                    case global.vui5.cons.propertyType.notes:
                        oController._processNotes({
                            section: section,
                            index: index
                        });
                        break;

                    case global.vui5.cons.propertyType.attachments:
                        oController._processAttachments({
                            section: section,
                            index: index
                        });
                        break;
                    case global.vui5.cons.propertyType.objectheader:
                        oController._processObjectHeader({
                            section: section,
                            index: index
                        });
                        break;
                    case global.vui5.cons.propertyType.snappingHeader:
                        oController._processSnappingHeader({
                            section: section,
                            index: index
                        });
                        break;
                    case global.vui5.cons.propertyType.tilesGroup:
                        oController._processTilesGroup({
                            section: section,
                            index: index
                        });
                        break;
                    case global.vui5.cons.propertyType.attributes:
                        oController._processAttributes({
                            section: section,
                            index: index
                        });
                        break;
                    case global.vui5.cons.propertyType.sets:
                        oController._processSets({
                            section: section,
                            index: index
                        });
                        break;
                    case global.vui5.cons.propertyType.tree:
                        oController._processTree({
                            section: section,
                            index: index
                        });
                        break;
                    case global.vui5.cons.propertyType.address:
                        oController._processAddress({
                            section: section,
                            index: index
                        });
                        break;
                    case global.vui5.cons.propertyType.treeTable:
                        oController._processTreeTable({
                            section: section,
                            index: index
                        });
                        break;
                    case global.vui5.cons.propertyType.list:
                        oController._processList({
                            section: section,
                            index: index
                        });
                        break;
                    case global.vui5.cons.propertyType.HTML:
                        oController._processHtml({
                            section: section,
                            index: index
                        });
                        break;
                    case global.vui5.cons.propertyType.planningGrid:
                        oController._processPlanningGrid({
                            section: section,
                            index: index
                        });
                        break;
                    case global.vui5.cons.propertyType.pricingGrid:
                        oController._processPricingGrid({
                            section: section,
                            index: index
                        });
                        break;

                    case global.vui5.cons.propertyType.statementEditor:
                        oController._processStatementEditor({
                            section: section,
                            index: index
                        });
                        break;
                    case global.vui5.cons.propertyType.events:
                        oController._processEvents({
                            section: section,
                            index: index
                        });
                        break;
                    case global.vui5.cons.propertyType.overviewPage:
                        oController._processOverviewPage({
                            section: section,
                            index: index
                        });
                        break;
                    default:
                        if (oController[global.vui5.ui.callBack.showPanelContent] instanceof Function) {
                            oController[global.vui5.ui.callBack.showPanelContent].call(oController, key);
                        }

                }
                if (section['DAPPT'] === global.vui5.cons.propertyType.table || section['DAPPT'] === global.vui5.cons.propertyType.partners ||
                    section['DAPPT'] === global.vui5.cons.propertyType.treeTable) {
                    oController.getControlTitleVisibility(oController.sectionRef[section['SECTN']], section);
                } else if (section['DAPPT'] === global.vui5.cons.propertyType.list) {

                    if ((oController.getProfileInfo()['UILYT'] === global.vui5.cons.layoutType.line && oController.getProfileInfo()['UITYP'] !== global.vui5.cons.UIType.worklist) ||
                        (oController.getProfileInfo()['UILYT'] === global.vui5.cons.layoutType.pageWithTabs && section && section['SCGRP'])) {
                        oController.sectionRef[section['SECTN']].getAggregation("_getListControl").setHeaderText("");
                    }
                } else if (section['DAPPT'] === global.vui5.cons.propertyType.attachments) {
                    //oController.sectionRef[section['SECTN']].getAggregation("_uploadCollection").setNumberOfAttachmentsText(null);
                }
            }
            ,
            dateFieldCheck: function (oEvent) {
                var oController = this,
                    valid;
                var source = oEvent.getSource();

                if (oEvent.getParameter("valid")) {
                    valid = true;
                } else if (oEvent.getParameter("valid") === false) {
                    valid = false;
                } else {
                    valid = source._bValid;
                }

                if (valid) {
                    source.setValueState(sap.ui.core.ValueState.None);
                    source.setValueStateText("");
                    oController._handleCheckFieldsMessages(
                        "",
                        "",
                        source.getId() + "/value");
                } else {
                    oController.setErrorStateToControl(source);
                }

                return !valid;
            }
            ,
            getControlTitleVisibility: function (oControl, section) {
                /**** Rel 60E SP6 - FullScreen Support changes - Start ***/
                var oController = this;
                var mainModel = oController.getMainModel();
                if ((oController.getProfileInfo()['UILYT'] === global.vui5.cons.layoutType.line && oController.getProfileInfo()['UITYP'] !== global.vui5.cons.UIType.worklist) ||
                    (oController.getProfileInfo()['UILYT'] === global.vui5.cons.layoutType.pageWithTabs && section && section['SCGRP'])) {

                    if (mainModel.getProperty("/FULLSCREEN")) {
                        oControl.setShowTitle(true);
                    }
                    else {
                        oControl.setShowTitle(false);
                    }

                }
                /**** Rel 60E SP6 - FullScreen Support changes - End ***/
            }
            ,
            setSectionTitle: function (path1, path2, oControl, propertyType, description, path3) {
                if (propertyType === global.vui5.cons.propertyType.table || propertyType === global.vui5.cons.propertyType.list) {

                    var str = "title";
                    str = propertyType === global.vui5.cons.propertyType.list && !(oControl instanceof sap.uxap.ObjectPageSection || oControl instanceof sap.uxap.ObjectPageSubSection) ? "headerText" : "title";

                    if (propertyType === global.vui5.cons.propertyType.table && path3) {
                        oControl.bindProperty(str, {
                            parts: [{ path: path1 },
                            { path: path2 },
                            { path: path3 }
                            ],
                            formatter: function (descr, count, displayedPages) {
                                if (descr != undefined) {
                                    if (displayedPages != "" && displayedPages != undefined && parseInt(displayedPages) != 0 &&
                                        count != "" && count != undefined && parseInt(count) != 0) {
                                        return descr + " " + "(" + displayedPages + "/" + count + ")";
                                    }
                                    if (count != "" && count != undefined && parseInt(count) != 0) {
                                        return descr + " " + "(" + count + ")";
                                    } else {
                                        return descr;
                                    }
                                }
                            },
                            mode: sap.ui.model.BindingMode.OneWay
                        });
                    }
                    else {
                        oControl.bindProperty(str, {
                            parts: [{ path: path1 },
                            { path: path2 }],
                            formatter: function (descr, count) {
                                if (descr != undefined) {
                                    if (count != "" && count != undefined && parseInt(count) != 0) {
                                        return descr + " " + "(" + count + ")";
                                    } else {
                                        return descr;
                                    }
                                }
                            },
                            mode: sap.ui.model.BindingMode.OneWay
                        });
                    }
                } else if (propertyType === global.vui5.cons.propertyType.partners) {
                    oControl.bindProperty("title", {
                        parts: [
                            {
                                path: path1
                            },
                            {
                                path: path2
                            }
                        ],
                        formatter: function (descr, count) {
                            if (descr != undefined) {
                                if (count != "" && count != undefined && count.length != 0) {
                                    return descr + " " + "(" + count.length + ")";
                                } else {
                                    return descr;
                                }
                            }
                        },
                        mode: sap.ui.model.BindingMode.OneWay
                    });
                } else if (propertyType === global.vui5.cons.propertyType.treeTable) {
                    oControl.bindProperty("title", {
                        parts: [
                            {
                                path: path1
                            }
                        ],
                        formatter: function (descr) {
                            if (descr != undefined) {
                                return descr;
                            }
                        },
                        mode: sap.ui.model.BindingMode.OneWay
                    });
                } else if (propertyType === global.vui5.cons.propertyType.attachments) {
                    var str = "title";
                    str = !(oControl instanceof sap.uxap.ObjectPageSection || oControl instanceof sap.uxap.ObjectPageSubSection) ? "numberOfAttachmentsText" : "title";
                    //var control = global.vui5.cons.propertyType.attachments ? oControl.getAggregation("_uploadCollection") : oControl;
                    oControl.bindProperty(str, {
                        parts: [
                            {
                                path: path1
                            },
                            {
                                path: path2
                            }
                        ],
                        formatter: function (descr, count) {
                            if (descr != undefined) {
                                if (count != "" && count != undefined && count.length != 0) {
                                    return descr + " " + "(" + count.length + ")";
                                } else {
                                    return descr;
                                }
                            } else if (description) {
                                if (count != "" && count != undefined && count.length != 0) {
                                    return description + " " + "(" + count.length + ")";
                                } else {
                                    return description;
                                }

                            }
                            //                             else if(!descr || !count){
                            //                               return  description;
                            //                             }
                        },
                        mode: sap.ui.model.BindingMode.OneWay
                    });
                }
            }
            ,
            onSectionChange: function (oEvent) {

                // oEvent.preventDefault();
                var oController = this;
                var sectionID = oEvent.getParameter('section').data()['id'];
                var currentModel = oController.getCurrentModel();
                /* Add tab in URL */
                var selectedItem = oEvent.getParameter('section');
                // var tabStripRef = selectedItem.oParent;
                var tabIndex = oEvent.getSource().indexOfSection(selectedItem);
                var queryParams,
                    subEntities;
                if (oController._subSectionID) {

                    var subsection = underscoreJS.find(oEvent.getParameter('section').getSubSections(), {
                        sId: oController._subSectionID
                    });
                    oController._subSectionID = null;
                    /*
               * if(subsection){ oController._subSectionSelectID =
               * subsection.data("id"); }
               */
                }
                subEntities = oController.routeParams["all*"].split('?')[0];
                queryParams = oController.getQueryParams() || {};
                /*
            * if (tabIndex === 0) { delete queryParams['tab']; } else {
            */
                queryParams['tab'] = sectionID;
                // }
                /* subtab */
                if (subsection) {
                    queryParams['subsectn'] = subsection.data("id");
                } else {
                    queryParams['subsectn'] ?
                        delete queryParams['subsectn']
                        : "";
                }
                oController.routeParams["all*"] = commonUtils.addQueryParams(subEntities, jQuery.param(queryParams));
                oController._updateTabBarAggregations = true;


                if (!oController._formDialog) {
                    oController.getRouter().navTo(oController.currentRoute, oController.routeParams, true);
                }
                else {
                    currentModel.setProperty("/POPUP_TAB", sectionID);
                    oController._processHandleRouteMatched({ sectionID: sectionID });
                }




            }
            ,


            processBreadCrumbLink: function (oEvent) {
                var oController = this,
                    parentSection,
                    drillDownBuffer,
                    mainModel,
                    entities = [],
                    bcLinks,
                    count,
                    action,
                    subEntitySections = [];
                var objConfig = {},
                    urlParams = {},
                    subEntities;
                mainModel = oController.getMainModel();
                bcLinks = mainModel.getProperty("/BCLINKS");
                parentSection = oEvent.getParameter("parentSection");
                drillDownBuffer = oController.getDrillDownBuffer();
                currentLink = underscoreJS.findWhere(mainModel.getProperty("/BCLINKS"), {
                    'PASCT': parentSection
                });
                count = drillDownBuffer.length - underscoreJS.findIndex(drillDownBuffer, {
                    'PASCT': parentSection
                });
                historyBack = underscoreJS.findIndex(drillDownBuffer, {
                    'PASCT': parentSection
                }) - drillDownBuffer.length;
                subEntities = oController.getSubEntities();


                underscoreJS.each(subEntities.split("/"), function (subEntity) {
                    subEntitySections.push({
                        'PASCT': subEntity.split("(")[0]
                    });
                });

                if (parentSection === "") {
                    entities = underscoreJS.pluck(subEntitySections, "PASCT");
                } else {
                    underscoreJS.each(subEntitySections, function (obj, index) {
                        if (obj['PASCT'] !== currentLink['PASCT']) {
                            entities.push(obj['PASCT']);
                        }
                    });
                }

                action = {
                    "FNCNM": global.vui5.cons.eventName.multiLevelContinue,
                    "RQTYP": global.vui5.cons.reqTypeValue.post,
                };


                if (!underscoreJS.isEmpty(entities)) {
                    urlParams[global.vui5.cons.params.entity] = entities.toString();
                }

                oController._preparePageContent = true;
                oController._lastVisitedViewRef = oController.getView();

                oController.processAction(currentLink['SECTN'], action, null, urlParams).then(function (response) {
                    oController.processResultNode(response);
                    if (mainModel.getProperty("/DOCUMENT_ERRORS") === '') {
                        while (count > 0) {
                            oController.bufferDrillDown(false, null);
                            count--;
                        }
                        ;
                        if (underscoreJS.isEmpty(drillDownBuffer)) {
                            if (oController.navUpButton && oController.navDownButton) {
                                oController.navUpButton.setVisible(false);
                                oController.navDownButton.setVisible(false);
                            }

                            mainModel.setProperty("/DRILLDOWNKEYS", {});
                        }
                        window.history.go(historyBack);
                    }
                });

            }
            ,
            _processTreeTable: function (cfg) {
                var oController = this,
                    section,
                    index,
                    sectionID,
                    dataArea,
                    sectionPath,
                    dataPath;
                var model = oController.getModel(oController.modelName);
                var mainModel = oController.getModel(global.vui5.modelName);
                var enableSearchAndReplace,
                    enableSetValues,
                    oMode,
                    oListItemType,
                    tableRef,
                    maxItems,
                    hasDrillDown,
                    sectionModelPath,
                    sectionModelFullPath,
                    sectionConfig;
                section = cfg.section;
                index = cfg.index;
                sectionID = section['SECTN'];
                dataArea = section['DATAR'];
                sectionPath = oController._getPath(true);
                dataPath = oController._getPath();
                sectionModelPath = sectionPath + index;
                sectionModelFullPath = oController.modelName + ">" + sectionModelPath;
                sectionConfig = oController.sectionConfig[sectionID];

                //*****Rel 60E_SP6
                var dmode = mainModel.getProperty("/DOCUMENT_MODE")
                //*****
                /* Process Attributes */
                hasDrillDown = sectionConfig.onDrillDownAction;
                hideExpanderControl = !!sectionConfig.attributes[global.vui5.cons.attributes.hideExpanderControl];

                tableRef = oController.sectionRef[section['SECTN']] = new global.vui5.ui.controls.TreeTable({
                    sectionID: section['SECTN'],
                    controller: oController,
                    modelName: oController.modelName,
                    /*** Rel 60E_SP7 - TreeTable Field Grouping - Start***/
                    fieldGroupPath: sectionModelPath + "/FLGRP/",
                    /*** Rel 60E_SP7 - TreeTable Field Grouping - End***/
                    fieldPath: sectionModelPath + "/FIELDS/",
                    expandedIndicesPath: "/TREE_INDICES/",
                    dataPath: dataPath + section['DARID'] + "/",
                    dataAreaPath: sectionModelPath + "/DARID/",
                    enableSearchAndReplace: enableSearchAndReplace,
                    enableSetValues: enableSetValues,
                    showTitle: true,
                    enableColumnFreeze: true,
                    enableCustomFilter: true,
                    hideDetailButton: !hasDrillDown,
                    hideExpanderControl: hideExpanderControl,
                    title: section['DESCR'],
                    // enablePersonalization: oController.getBindingExpression("enablePersonalization", section, index),
                    //handle: oController.getBindingExpression('handle', section, index),
                    visible: oController.getBindingExpression('visible', section, index),
                    totalNumberOfRows: oController.getBindingExpression("totalNumberOfRows", section, index),
                    editable: oController.getBindingExpression("editable", section, index),
                    enableLocalSearch: oController.getBindingExpression("enableLocalSearch", section, index),
                    //*****Rel 60E_SP6
                    enableQuickEntry: !!sectionConfig.onQuickEntryAction && dmode !== global.vui5.cons.mode.display && section['DISOL'] === '' && !oController._formDialog,
                    //*****
                    onPageChange: [oController.onNRServerSidePaging, oController],
                    onValueHelpRequest: oController.onValueHelpRequest.bind(oController, sectionID),
                    //*****Rel 60E_SP6
                    onQuickEntry: function (oEvent) {
                        oController.processAction.call(oController, sectionID, sectionConfig.onQuickEntryAction);
                    },
                    //*****
                });
                tableRef.bindProperty("selectionMode", {
                    path: oController.modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.rowSelection,
                    formatter: function (rowSelection) {
                        var mode = rowSelection === 'X' ? sap.ui.table.SelectionMode.MultiToggle : sap.ui.table.SelectionMode.None;
                        return mode;
                    },
                    mode: sap.ui.model.BindingMode.OneWay
                });
                //tableRef.setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);

                if (hasDrillDown) {
                    tableRef.attachOnDetailButton(function (evt) {
                        oController.processAction.call(oController, sectionID, sectionConfig.onDrillDownAction, evt.getParameter('record'))
                    });
                }

                tableRef.attachOnFieldClick(function (evt) {
                    oController.preProcessFieldClickEvent(sectionID, evt);
                });

                tableRef.processOnInputChange = function (oEvent) {
                    return oController.processOnInputChange(sectionID, oEvent);
                };

                tableRef.preProcessFieldEvent = function (oEvent) {
                    return oController.preProcessFieldEvent(sectionID, oEvent);
                };
                //                tableRef.addEventDelegate({
                //                    onAfterRendering: function (e) {
                //                        var tableRef = e.srcControl;
                //                            tableRef._onExpand(e);
                //
                //                    }
                //                });

                // tableRef.setOnF4HelpRequest(oController.onValueHelpRequest.bind(oController));
                // tableRef.attachOnSortFilter(oController.onSortFilter.bind(oController));
                tableRef.addStyleClass("sapUiResponsiveContentPadding");
                tableRef.setModel(mainModel, global.vui5.modelName);
                tableRef.setModel(model, oController.modelName);
                tableRef.prepareTable();
                oController._prepareToolBarContent(sectionID, model.getProperty(sectionModelPath + "/FUNC"));
            }
            ,
            _processSetsData: function (data) {
                var oController = this;
                var setsData = data ? data[0]['DETAILS'] ? data[0]['DETAILS'] : data : undefined;

                for (var i = 0; i < setsData.length; i++) {
                    var currSetsData = setsData[i]['REVIEW'];
                    underscoreJS.map(currSetsData, function (obj) {
                        obj['NODES'] = [];
                        obj['SELECTED'] == "X" ? obj['SELECTED'] = true : obj['SELECTED'] = false;
                        return obj;
                    });
                    //oController._prepareTreeData(currSetsData,"NODE","PARENT");
                }
                for (var i = 0; i < setsData.length; i++) {
                    var currSetsData = setsData[i]['REVIEW'];
                    oController._prepareTreeData(currSetsData, "NODE", "PARENT");
                }
                return setsData;
            }
            ,
            _processTreeData: function (section, data, node) {
                var oController = this;
                var model = oController.getModel(oController.modelName);
                var attributes = oController._flattenAttributes(section['ATTRB']);
                var keyNode = attributes[global.vui5.cons.attributes.keyField];
                var selectedField = attributes.selectedField;
                var parentKeyNode = attributes[global.vui5.cons.attributes.parentKeyField];
                underscoreJS.map(data['DATA'], function (obj) {
                    obj['NODES'] = [];
                    obj[selectedField] == "X" ? obj[selectedField] = true : obj[selectedField] = false;
                    return obj;
                });
                var treeData = data['DATA'];
                //              for (var i=0;i<treeData.length;i++){
                //                var currSetsData = treeData[i]['REVIEW'];
                //                this._prepareTreeData(currSetsData,keyNode,parentKeyNode)
                //              }

                this._prepareTreeData(treeData, keyNode, parentKeyNode);
                var path = oController._getPath();
                model.setProperty(path + node, data)
            }
            ,
            _prepareTreeData: function (treeData, keyNode, parentKeyNode) {
                var oControl = this;
                var indices = [];
                //              var descriptionFi`  eld = attributes.DESCRIPTIONFIELD;
                underscoreJS.each(treeData, function (obj, i) {
                    var object = {};
                    if (obj == undefined || obj['ESCAPE']) {
                        treeData[i]['DELETE'] = true;
                        indices.push(i);
                        return;
                    }
                    object[parentKeyNode] = obj[keyNode];
                    var items = underscoreJS.where(treeData, object);
                    // var items = underscoreJS.where(treeData,{[parentKeyNode] :obj[keyNode]});
                    for (var k = 0; k < items.length; k++) {
                        var arr = [];
                        var flag = oControl._checkChild(items[k], treeData, keyNode, parentKeyNode);
                        if (!flag) {
                            obj['NODES'].push(items[k]);
                        } else {

                        }
                    }
                });
                for (var i = 0; i < indices.length; i++) {
                    var index = indices[i] - i;
                    treeData[index].ESCAPE = "";
                    treeData.splice(index, 1);

                }
            }
            ,
            _checkChild: function (nodeObj, treeData, keyNode, parentKeyNode) {
                var oControl = this;
                nodeObj['ESCAPE'] = true;
                var object = {};
                object[parentKeyNode] = nodeObj[keyNode];
                var childs = underscoreJS.where(treeData, object);
                // var childs = underscoreJS.where(treeData,{[parentKeyNode]:nodeObj[keyNode]});
                //var childs = underscoreJS.where(treeData,{PARENT:nodeObj.NODE});
                if (childs.length > 0) {
                    underscoreJS.each(childs, function (obj, i) {
                        var arr = [];

                        var flag = oControl._checkChild(obj, treeData, keyNode, parentKeyNode);
                        if (flag) {

                        } else {
                            nodeObj['NODES'].push(obj);
                        }

                    })
                } else {
                    return false;
                }
            }
            ,
            _UpdateChanges: function (sectionID, action, updateCallFrom) {
                var oController = this, triggerUpdateChangedData;
                var mainModel = oController.getMainModel();
                var promise, objDefer = $.Deferred();
                var dMode = mainModel.getProperty("/DOCUMENT_MODE");
                var section = oController.getSectionBy("SECTN", sectionID) || {};
                /**** Rel 60E SP6 QA #10446 - Start ***/
                if (oController.inputChangeDefer) {
                    oController.inputChangeDefer.done(function () {
                        if (oController.inputChangeDefer.state() === "resolved") {
                            oController.inputChangeDefer = undefined;
                            oController._UpdateChanges(sectionID, action, updateCallFrom).then(function () {
                                objDefer.resolve();
                            });
                        } else {
                            oController.inputChangeDefer = undefined;
                            objDefer.reject();
                        }


                    });

                    return objDefer.promise();
                }
                /**** Rel 60E SP6 QA #10446 - End ***/
                if (oController.checkRequiredFields(sectionID)) {
                    objDefer.reject();
                    return objDefer.promise();
                }

                if (mainModel.getProperty("/FULLSCR_SKIPUPDATE")) {
                    if (/*oController.getProfileInfo()['UILYT'] === global.vui5.cons.layoutType.tab &&*/
                        underscoreJS.isEmpty(section['SCGRP'])) {
                        objDefer.resolve();
                        return objDefer.promise();
                    }
                }


                if (action && action['FNCNM'] === global.vui5.cons.eventName.continue) {
                    triggerUpdateChangedData = false;
                }
                else {
                    triggerUpdateChangedData = underscoreJS.isObject(oController._formDialog) ||
                        (action && action['ACTYP'] === global.vui5.cons.actionType.section_change) ||
                        oController.getProfileInfo()['UITYP'] === global.vui5.cons.UIType.listWithProcessing;

                    if (!triggerUpdateChangedData) {
                        triggerUpdateChangedData = dMode && dMode !== global.vui5.cons.mode.display;
                    }

                    /* 
                    When coming out of FullScreen, as formDialog variable will be filled we have check 
                    below conditions before raising update event
                    */

                    if (triggerUpdateChangedData &&
                        oController._formDialog &&
                        oController._formDialog['FNCNM'] === global.vui5.cons.eventName.fullScreen &&
                        (dMode === global.vui5.cons.mode.display || underscoreJS.isEmpty(section['EDIT']))) {
                        triggerUpdateChangedData = false;
                    }

                }


                if (triggerUpdateChangedData) {
                    promise = oController.updateChangedData(sectionID, null, null, updateCallFrom);
                    if (promise) {
                        if (promise.then) {
                            promise.then(function () {
                                if (mainModel.getProperty('/DOCUMENT_ERRORS') === 'X') {
                                    objDefer.reject();
                                } else {
                                    objDefer.resolve();
                                }
                            });
                        }
                    }
                } else {
                    objDefer.resolve();
                }
                return objDefer.promise();
            }
            ,
            _onTabSelect: function (evt) {
                var oController = this;
                var sectionID = evt.getParameter('key');
                var currentModel = oController.getCurrentModel();
                /* Add tab in URL */
                var selectedItem = evt.getParameter('selectedItem');
                var tabStripRef = selectedItem.oParent;
                var tabIndex = tabStripRef.indexOfItem(selectedItem);
                var queryParams,
                    subEntities;

                subEntities = oController.routeParams["all*"].split('?')[0];
                queryParams = oController.getQueryParams() || {};

                if (tabIndex === 0) {
                    delete queryParams['tab'];
                } else {
                    queryParams['tab'] = sectionID;
                }
                // queryParams['tab'] = sectionID;

                oController.routeParams["all*"] = commonUtils.addQueryParams(subEntities, jQuery.param(queryParams));
                oController._updateTabBarAggregations = true;

                if (!oController._formDialog) {
                    oController.getRouter().navTo(oController.currentRoute, oController.routeParams, true);
                }
                else {
                    currentModel.setProperty("/POPUP_TAB", sectionID);
                    oController._processHandleRouteMatched({ sectionID: sectionID });
                }



            }
            ,
            _createModel: function () {
                var oController = this;
                oController._initializeCurrentModel(true);
                //*****Rel 60E_SP6 - ECDM #4638
                this.sectionRef = {};
                this.sectionConfig = {};
                this.functionRef = [];
                //*****

                if (oController.currentRoute !== "overviewPage") {
                    oController.getRouter().getRoute(oController.currentRoute).attachMatched(oController._handleRouteMatched, oController);
                }

            }
            ,


            _prepareCurrentView: function () {
                var oController = this, bufferRows, currentRow, currentIndex, mainModel;
                mainModel = oController.getMainModel();
                if (mainModel.getProperty("/PREPARE_PAGE_CONTENT")) {
                    oController._preparePageContent = mainModel.getProperty("/PREPARE_PAGE_CONTENT");
                    oController._lastVisitedViewRef = oController.getView();
                    oController.clearRefs();
                    mainModel.setProperty("/PREPARE_PAGE_CONTENT", false);
                }
                if (oController._preparePageContent && oController._lastVisitedViewRef) {
                    oController._lastVisitedViewRef.destroyContent();
                    oController._lastVisitedViewRef.addContent(oController._lastVisitedViewRef.createContent(oController));
                    oController._preparePageContent = false;
                    oController._lastVisitedViewRef = undefined;
                }
                oController._updateTabBarItems();

                bufferRows = oController.getMainModel().getProperty("/DRILLDOWNKEYS");
                if (!underscoreJS.isEmpty(bufferRows) && bufferRows['SWFLD'] == "") {
                    currentRow = parseInt(oController.getCurrentSubEntity()['key']);
                    currentIndex = underscoreJS.indexOf(bufferRows['ROWID'], underscoreJS.findWhere(bufferRows['ROWID'], {
                        'ROWID': currentRow
                    }));
                    oController._processItemSwitchVisibility(currentIndex);
                }
            }
            ,

            _processHandleRouteMatched: function (config) {
                var oController = this,
                    promise,
                    currentViewSections = [],
                    grpSectionConfig,
                    mainModel, sectionConfig, sectionID;

                oController._prepareCurrentView();
                mainModel = oController.getMainModel();

                currentViewSections = oController.getSections();
                sectionConfig = oController.getCurrentModel().getProperty("/SECCFG");
                if ((oController._config.lastActionRef['ACTYP'] == global.vui5.cons.actionType.back) && (oController.getProfileInfo()['UILYT'] == global.vui5.cons.layoutType.line)) {

                    var obj = underscoreJS.find(currentViewSections, { "LDMDT": global.vui5.cons.loadMetaData.always, "HDSCT": "" });
                    if (obj) {
                        obj = obj['SECTN']
                    }
                    var obj1 = underscoreJS.findKey(sectionConfig, function (obj, key) {
                        if (!obj.metaDataLoaded && oController.getSectionBy("SECTN", key)['HDSCT'] != "X") {
                            return key;
                        }
                    })
                    sectionID = obj || obj1 || oController.getQueryParam('tab') || '';

                }
                else {

                    sectionID = oController.getQueryParam('tab') || '';
                }
                if (!sectionID) {
                    sectionID = !underscoreJS.isEmpty(currentViewSections) ? currentViewSections[0]['SECTN'] : '';
                    if (!sectionID) {
                        if (oController._config.lastActionRef['ACTYP'] === global.vui5.cons.actionType.drilldown) {
                            sectionID = oController._config.lastActionRef['SECTN'] || '';
                        }
                    }
                }

                /* In case of Tabbed/Page Layout with Tabs in Popup, handle route matched will not be called as we won't be 
                changing the URL, so we are externally calling processhandleroutematched method in onTabSelect & OnSectionChange method, 
                so we are considering the section which is sent */

                if (config &&
                    config.sectionID) {
                    sectionID = config.sectionID;
                }

                /* In case of bookmarking we won't be having any sections, so we
                * have prepare section config for the section which is in the
                * URL
                */
                if (oController.sectionConfig[sectionID] === undefined && oController.getQueryParam('tab')) {
                    oController.sectionConfig[sectionID] = {
                        keyField: global.vui5.rowID,
                        fields: {},
                        metaDataLoaded: false
                    };
                }
                var section = oController.getSectionBy('SECTN', sectionID) || {};
                var sectionConfig = oController.sectionConfig[sectionID] || {};
                var loadMetaData = underscoreJS.isEmpty(section);
                var initialCall = oController.getSections() === undefined;
                if (section['GRPNM']) {
                    oController.subSectionsArr = [];
                    underscoreJS.each(oController._getGroupingSections(section['GRPNM']), function (grpSection) {
                        grpSectionConfig = oController.sectionConfig[grpSection['SECTN']];
                        switch (grpSection[global.vui5.cons.propName.loadMetaData]) {
                            case global.vui5.cons.loadMetaData.always:
                                loadMetaData = true;
                                break;
                            case global.vui5.cons.loadMetaData.once:
                                if (!grpSectionConfig.metaDataLoaded) {
                                    loadMetaData = true;
                                }
                                grpSectionConfig.metaDataLoaded = true;
                                break;
                        }
                    });
                } else {
                    switch (section[global.vui5.cons.propName.loadMetaData]) {
                        case global.vui5.cons.loadMetaData.always:
                            loadMetaData = true;
                            break;
                        case global.vui5.cons.loadMetaData.once:
                            if (!sectionConfig.metaDataLoaded) {
                                loadMetaData = true;
                            }
                            sectionConfig.metaDataLoaded = true;
                            break;
                    }
                }

                /*
            * In case of Refresh Action (or) Item Switch we have to initial
            * call as True
            *
            *
            */
                if (!initialCall && (this._config
                    && this._config.lastActionRef
                    && this._config.lastActionRef['ACTYP'] === global.vui5.cons.actionType.refresh) || oController._itemSwitch) {
                    oController._itemSwitch = false;
                    initialCall = true;
                }


                if (!initialCall
                    && this._config
                    && this._config.lastActionRef
                    && this._config.lastActionRef['ACTYP'] === global.vui5.cons.actionType.refresh) {
                    initialCall = true;
                }

                if (loadMetaData || initialCall) {
                    promise = oController.getMetaDataNData(sectionID, initialCall);
                } else {
                    promise = oController.getData(sectionID);
                }

                promise.then(function (response) {
                    oController._updateTabBarItems();
                    oController._updateSwitchFieldValues();
                    /*if (oController._previousFnbvrObj && (oController._config.lastActionRef['ACTYP'] === global.vui5.cons.actionType.back ||
                            oController._config.lastActionRef['ACTYP'] === global.vui5.cons.actionType.cancel)) {
                        oController._updateSwitchFieldValues();
                        drilldownKeys = mainModel.getProperty("/DRILLDOWNKEYS/ROWID");
                        if (drilldownKeys) {
                            drilldownKeys[oController.getCurrentSubEntity().key - 1]['TEXT'] = oController.sectionRef[oController._previousFnbvrObj.SECTN].getTitle();
                            mainModel.setProperty("/DRILLDOWNKEYS/ROWID", {});
                            mainModel.setProperty("/DRILLDOWNKEYS/ROWID", drilldownKeys);
                            oController._previousFnbvrObj = undefined;
                        }
            
                    }*/
                });

                mainModel.setProperty("/SHUPF", "X");

            },

            _updateSwitchFieldValues: function (section) {
                var oController = this, drilldownKeys, mainModel, switchField;
                mainModel = oController.getMainModel();
                switchField = mainModel.getProperty("/DRILLDOWNKEYS/SWFLD") || "";
                if (switchField && (section || oController._previousFnbvrObj) && (oController._config.lastActionRef['ACTYP'] === global.vui5.cons.actionType.back ||
                    oController._config.lastActionRef['ACTYP'] === global.vui5.cons.actionType.cancel)) {
                    drilldownKeys = mainModel.getProperty("/DRILLDOWNKEYS/ROWID");
                    if (drilldownKeys) {
                        drilldownKeys[oController.getCurrentSubEntity().key - 1]['TEXT'] = oController.sectionRef[section ? section : oController._previousFnbvrObj.SECTN].getProperty("title");
                        mainModel.setProperty("/DRILLDOWNKEYS/ROWID", {});
                        mainModel.setProperty("/DRILLDOWNKEYS/ROWID", drilldownKeys);
                        oController._previousFnbvrObj = undefined;
                    }
                }
            },

            _handleRouteMatched: function (oEvent) {
                var oController = this;

                //*****Rel 60E_SP7
                if (oController.skipDataEvent) {
                    oController.skipDataEvent = false;
                    return;
                }
                //*****

                if (oController.currentRoute === global.vui5.cons.route.dashboard) {
                    oController.bufferPageNavigation();

                    //*****Rel 60E_SP6 - ECIP #17878
                    var mainModel = oController.getMainModel();
                    var dashboardBuffer = mainModel.getProperty("/DSHBD_BUFFER") || [];
                    var index = underscoreJS.findLastIndex(dashboardBuffer, { DSHBD: oEvent.getParameter('arguments')['entity'] });
                    if (index != -1) {
                        var prevDashboard = dashboardBuffer[index];
                        mainModel.setProperty("/APTIT", prevDashboard['APTIT']);
                    }
                    //*****

                    oController.getMainModel().setProperty("/DASHBOARD_ID", oEvent.getParameter('arguments')['entity']);
                    //*****Rel 60E_SP6
                    var cfg;
                    var params = oEvent.getParameter('arguments')['all*'] || "";
                    var workspace = commonUtils.paramsUnserialize(params);
                    var dashboard = oController._processDashBoard(cfg, workspace);
                    //*****
                    if (oController.getView().getContent()[0] instanceof sap.m.Page) {
                        if (oController.getView().getContent()[0].getContent().length != 0) {
                            oController.getView().getContent()[0].removeAllContent();
                        }
                        oController.getView().getContent()[0].addContent(dashboard);
                    } else {
                        if (oController.getView().getContent()[0].getContent()[0].getContent().length != 0) {
                            oController.getView().getContent()[0].getContent()[0].removeAllContent();
                        }
                        oController.getView().getContent()[0].getContent()[0].addContent(dashboard);
                    }
                    if (!underscoreJS.isEmpty(oController.getPageNavBuffer())) {
                        oController.bufferPageNavigation();
                    }

                    /***Rel 60E SP7 ECIP #21284 - Start ***/
                    oController.registerFlpHomeBackClickEvent();
                    /***Rel 60E SP7 ECIP #21284 - End ***/
                    return;
                }

                if (oController[global.vui5.ui.callBack.handleRouteMatched] instanceof Function) {
                    oController[global.vui5.ui.callBack.handleRouteMatched].call(oController, oEvent);
                }

                if (oController._initializeApp) {
                    oController._initializeApp = false;
                    oController.applicationInitialize();
                } else {
                    if (oController._dependentObject) {
                        oController._dependentObject = false;
                        oController.bufferPageNavigation();
                    }
                    oController._processHandleRouteMatched();
                }

                oController.routeParams = oController.getRouteParams();
            }
            ,

            _updateTabBarItems: function () {
                var oController = this;
                if (oController._formDialog && oController._formDialog['UILYT'] != global.vui5.cons.layoutType.tab) {
                    return;
                }
                if (oController.tabBar && oController._updateTabBarAggregations) {
                    oController._updateTabBarAggregations = undefined;
                    oController.tabBar._getIconTabHeader().updateAggregation("items");
                } else if (oController.objectPageLayout && oController._updateTabBarAggregations) {
                    oController._updateTabBarAggregations = undefined;
                    // oController.ObjectPageLayout.updateAggregation('sections');
                }
            }
            ,
            _mergeProperties: function (propObj, key, fieldName, attributes) {

                if (!propObj[key]) {
                    propObj[key] = {
                        attributes: {},
                        fields: {}
                    };
                }

                if (fieldName && !propObj[key]['fields'][fieldName]) {
                    propObj[key]['fields'][fieldName] = {
                        attributes: {}
                    };
                }

                commonUtils.moveObjectByProperty(attributes, (fieldName ? propObj[key]['fields'][fieldName].attributes
                    : propObj[key].attributes));
            }
            ,
            _flattenAttributes: function (attributes) {
                return underscoreJS.object(underscoreJS.pluck(attributes, "NAME"), underscoreJS.pluck(attributes, "VALUE"));
            }
            ,
            _processDocumentFunctionProp: function (docFuncProp) {
                var oController = this,
                    source = {},
                    dest;
                var model = oController.getModel(oController.modelName);
                var doFunctionPath = oController._formDialog ? "/POPUP_FUNC" : "/DOFUN";
                var dofun = $.extend(true, [], model.getProperty(doFunctionPath));

                for (i in docFuncProp) {
                    source['HIDFN'] = docFuncProp[i]['HIDFN'];
                    //*****Rel 60E_SP6
                    if (docFuncProp[i]['MNITM'] && !underscoreJS.isEmpty(docFuncProp[i]['MNITM'])) {
                        source['MNITM'] = docFuncProp[i]['MNITM'];
                    }
                    if (docFuncProp[i]['SEL_SEGMNT'] && !underscoreJS.isEmpty(docFuncProp[i]['SEL_SEGMNT'])) {
                        source['SEL_SEGMNT'] = docFuncProp[i]['SEL_SEGMNT'];
                    }


                    //*****
                    dest = underscoreJS.findWhere(dofun, {
                        FNCNM: docFuncProp[i]['FNCNM']
                    });

                    if (dest) {
                        commonUtils.moveObjectByProperty(source, dest);
                    }
                }

                model.setProperty(doFunctionPath, dofun);
            },

            _processElementAttributes: function (elmProps) {

                var oController = this,
                    section,
                    sectionAttrb,
                    elmProp,
                    sectionProps = {},
                    dataAreaProps = {},
                    allFields,
                    sectionId,
                    dataArea,
                    fieldName,
                    attributes,
                    fields,
                    field,
                    sections,
                    section,
                    i,
                    dataArea,
                    sectionConfig;

                /*
            * Get section properties & data-area properties
            */
                for (i in elmProps) {
                    if (elmProps.hasOwnProperty(i)) {
                        elmProp = elmProps[i];

                        fieldName = elmProp['FLDNAME'];
                        fieldName = oController._specialCharacterReplace(elmProp['FLDNAME']);
                        sectionId = elmProp['SECTN'];
                        dataArea = elmProp['DATAR'];
                        attributes = elmProp['ATTRB'];

                        section = oController.getSectionBy("SECTN", sectionId);

                        if (section && section['ATTRB']) {
                            underscoreJS.each(attributes, function (attribute) {
                                sectionAttrb = underscoreJS.findWhere(section['ATTRB'], {
                                    'NAME': attribute['NAME']
                                });

                                if (sectionAttrb) {
                                    sectionAttrb['VALUE'] = attribute['VALUE'];
                                } else {
                                    section['ATTRB'].push(attribute);
                                }
                            });

                        }

                        if (attributes && attributes.length) {
                            attributes = elmProp.attributes = oController._flattenAttributes(attributes);

                            if (sectionId) {
                                oController._mergeProperties(sectionProps, sectionId, fieldName, attributes);
                            } else if (dataArea) {
                                oController._mergeProperties(dataAreaProps, dataArea, fieldName, attributes);
                            }


                        }
                    }
                }

                /*
            * convert data-area properties to section properties
            */
                for (dataArea in dataAreaProps) {
                    if (dataAreaProps.hasOwnProperty(dataArea)) {
                        fields = dataAreaProps[dataArea].fields;
                        sections = oController.getSectionsBy('DATAR', dataArea);

                        for (var k in sections) {
                            if (sections.hasOwnProperty(k)) {
                                section = sections[k];
                                sectionId = section['SECTN'];

                                oController._mergeProperties(sectionProps, sectionId, '', attributes);
                                sectionProps[sectionId].$ref = section;

                                for (var j in fields) {
                                    if (fields.hasOwnProperty(j)) {
                                        attributes = fields[j].attributes;
                                        fieldName = j;

                                        oController._mergeProperties(sectionProps, sectionId, fieldName, attributes);
                                    }
                                }
                            }
                        }
                    }
                }

                /*
            * Merge attributes and prepare pre-process list
            */

                for (i in sectionProps) {
                    if (sectionProps.hasOwnProperty(i)) {
                        sectionId = i;
                        attributes = sectionProps[i].attributes;
                        fields = sectionProps[i].fields;
                        section = sectionProps[i].$ref || oController.getSectionBy('SECTN', sectionId);
                        sectionConfig = oController.sectionConfig[sectionId];

                        if (!section) continue;

                        if (!underscoreJS.isEmpty(attributes) && sectionConfig) {
                            commonUtils.moveObjectByProperty(attributes, sectionConfig.attributes);

                            var currentSection = oController.getSectionBy('SECTN', sectionId);
                            if (currentSection['DAPPT'] == global.vui5.cons.propertyType.texts && oController.sectionRef[sectionId]) {
                                oController.sectionRef[sectionId]._setTextSelectedKey();
                            }
                        }

                        for (var j in fields) {
                            if (fields.hasOwnProperty(j)) {
                                attributes = fields[j].attributes;
                                fieldName = j;

                                if (!_Utils.isEmpty(attributes)) {
                                    allFields = underscoreJS.where(section['FIELDS'], {
                                        FLDNAME: fieldName
                                    });

                                    for (var k in allFields) {
                                        if (allFields.hasOwnProperty(k)) {
                                            field = allFields[k];
                                            if (!sectionConfig[sectionId][fieldName])
                                                sectionConfig[sectionId][fieldName] = {};
                                            commonUtils.moveObjectByProperty(attributes, sectionConfig[sectionId][fieldName].attributes);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            ,
            _processSectionProperties: function (data) {

                var oController = this,
                    filterObj,
                    sectionProps,
                    sectionProp;

                for (var j = 0; j < data.length; j += 1) {
                    filterObj = {};
                    if (data[j]['DARID']) {
                        filterObj['DARID'] = data[j]['DARID'];
                    }
                    sectionProps = underscoreJS.where(oController.getSections(), filterObj);
                    for (var k = 0; k < sectionProps.length; k += 1) {
                        sectionProp = sectionProps[k];
                        sectionProp['HDSCT'] = data[j]['HDSCT'];
                        if (data[j]['HDSCT'] && !sectionProp['FXSCT']) {
                            if (oController.sectionConfig[sectionProp['SECTN']]) {
                                oController.sectionConfig[sectionProp['SECTN']].metaDataLoaded = false;
                            }
                        }
                        if (oController.sectionRef &&
                            oController.sectionRef[sectionProp['SECTN']] &&
                            oController.sectionRef[sectionProp['SECTN']].setVisible) {

                            oController.sectionRef[sectionProp['SECTN']].setVisible(data[j]['HDSCT'] === '');
                        }
                    }
                }
            },

            //*****Rel 60E_SP7
            _processEventsDataAreaProperties: function (node, data) {
                var oController = this, darid, section, sectionProps, fieldProps, fieldProp, fields, field;
                var darid, section;
                darid = node.substr(0, node.indexOf(global.vui5.cons.nodeName.eventsSuffix));
                darid = darid.substr(0, darid.lastIndexOf("_"));
                section = oController.getSectionBy('DARID', darid);
                if (!section) { return; }
                sectionProps = section['METADATA'][node.substring(0, node.lastIndexOf(global.vui5.cons.nodeName.propSuffix))]

                fieldProps = data[global.vui5.cons.nodeName.fieldProperties] || [];

                for (var k = 0; k < fieldProps.length; k += 1) {
                    fieldProp = fieldProps[k];
                    fieldProp['FLDNAME'] = oController._specialCharacterReplace(fieldProp['FLDNAME']);

                    fields = underscoreJS.where(sectionProps['FIELDS'], {
                        FLDNAME: fieldProp['FLDNAME'],
                        TABNAME: fieldProp['TABNAME']
                    });
                    for (var l = 0; l < fields.length; l++) {
                        field = fields[l];
                        field['DISABLED'] = fieldProp['DISABLED'];
                        field['ELTYP'] = fieldProp['ELTYP'];
                        field['NRART'] = fieldProp['NRART'];
                        field['REQUIRED'] = fieldProp['REQUIRED'];
                        field['LABEL'] = fieldProp['LABEL'];
                        field['NO_OUT'] = fieldProp['NO_OUT'];
                    }
                }
            },
            //*****

            _processDataAreaProperties: function (node, data, fxsctPropExists) {

                var oController = this,
                    fieldProps,
                    fieldProp,
                    actionProps,
                    actionProp,
                    sectionProps,
                    sectionProp,
                    fields,
                    field,
                    actions,
                    action;

                fieldProps = data[global.vui5.cons.nodeName.fieldProperties] || [];
                actionProps = data[global.vui5.cons.nodeName.functionProperties] || [];


                //*****Rel 60E_SP7 - QA #12664
                if (fxsctPropExists) {
                    sectionProps = node === global.vui5.cons.nodeName.fixedSectionProp ?
                        oController.getSectionsBy("FXSCT", "X") :
                        //*****Rel 60E_SP6
                        //oController.getNonFixedSections('DARID', node.split(global.vui5.cons.nodeName.propSuffix)[0]);
                        oController.getNonFixedSections('DARID', node.substring(0, node.lastIndexOf(global.vui5.cons.nodeName.propSuffix)));
                    //*****	
                }
                else {
                    sectionProps = oController.getSectionsBy("DARID", node.substring(0, node.lastIndexOf(global.vui5.cons.nodeName.propSuffix)));
                }
                //*****

                //*****Rel 60E_SP7
                if (!underscoreJS.isEmpty(node) && node.indexOf(global.vui5.cons.nodeName.eventsSuffix) != -1) {
                    oController._processEventsDataAreaProperties(node, data);
                }
                //*****

                for (var j = 0; j < sectionProps.length; j += 1) {
                    sectionProp = sectionProps[j];

                    for (var k = 0; k < fieldProps.length; k += 1) {
                        fieldProp = fieldProps[k];
                        fieldProp['FLDNAME'] = oController._specialCharacterReplace(fieldProp['FLDNAME']);

                        fields = underscoreJS.where(sectionProp['FIELDS'], {
                            FLDNAME: fieldProp['FLDNAME'],
                            TABNAME: fieldProp['TABNAME']
                        });
                        for (var l = 0; l < fields.length; l++) {
                            field = fields[l];
                            field['DISABLED'] = fieldProp['DISABLED'];
                            field['ELTYP'] = fieldProp['ELTYP'];
                            field['NRART'] = fieldProp['NRART'];
                            field['REQUIRED'] = fieldProp['REQUIRED'];
                            field['LABEL'] = fieldProp['LABEL'];
                            field['NO_OUT'] = fieldProp['NO_OUT'];
                            /*if (underscoreJS.isEmpty(sectionProp['FXSCT'])) {
                  //field['NO_OUT'] = fieldProp['NO_OUT'];
                  field['DISABLED'] = fieldProp['DISABLED'];
                  field['ELTYP'] = fieldProp['ELTYP'];
                  field['NRART'] = fieldProp['NRART'];
                  field['REQUIRED'] = fieldProp['REQUIRED'];
              }
              field['LABEL'] = fieldProp['LABEL'];
              field['NO_OUT'] = fieldProp['NO_OUT'];*/

                        }
                    }

                    /* Field Properties */
                    /*for (var k = 0; k < fieldProps.length; k += 1) {
              fieldProp = fieldProps[k];
            
              fields = underscoreJS.where(sectionProp['FIELDS'], {
                  FLDNAME: fieldProp['FLDNAME'],
                  TABNAME: fieldProp['TABNAME']
              });
              for (var l = 0; l < fields.length; l++) {
                  field = fields[l];
                  field['NO_OUT'] = fieldProp['NO_OUT'];
                  field['DISABLED'] = fieldProp['DISABLED'];
                  field['LABEL'] = fieldProp['LABEL'];
                  field['ELTYP'] = fieldProp['ELTYP'];
                  field['NRART'] = fieldProp['NRART'];
                  field['REQUIRED'] = fieldProp['REQUIRED'];
            
              }
            
              if (sectionProp['DAPPT'] == "") {
                  fields = underscoreJS.where(sectionProp['FLGRP'], {
                      FLGRP: fieldProp['FLGRP']
                  });
                  for (var l = 0; l < fields.length; l++) {
                      field = fields[l]['FLDS'];
            
                      field['NO_OUT'] = fieldProp['NO_OUT'];
                      field['DISABLED'] = fieldProp['DISABLED'];
                      field['LABEL'] = fieldProp['LABEL'];
                      field['ELTYP'] = fieldProp['ELTYP'];
                      field['NRART'] = fieldProp['NRART'];
                      field['REQUIRED'] = fieldProp['REQUIRED'];
                  }
              }
              else {
                  fields = underscoreJS.where(sectionProp['FIELDS'], {
                      FLDNAME: fieldProp['FLDNAME']
                  });
                  for (var l = 0; l < fields.length; l++) {
                      field = fields[l];
                      field['NO_OUT'] = fieldProp['NO_OUT'];
                      field['DISABLED'] = fieldProp['DISABLED'];
                      field['LABEL'] = fieldProp['LABEL'];
                      field['ELTYP'] = fieldProp['ELTYP'];
                      field['NRART'] = fieldProp['NRART'];
                      field['REQUIRED'] = fieldProp['REQUIRED'];
            
                  }
              }
            }*/
                    /*Field Groups HDGRP Handling*/
                    var fieldGroups = sectionProp['FLGRP'];
                    var sectionFields = sectionProp['FIELDS'];
                    for (var m = 0; m < fieldGroups.length; m += 1) {
                        fieldGroup = fieldGroups[m];
                        if (fieldGroup['FLDNAME'] == '') {
                            visibleGroupFields = underscoreJS.where(sectionFields, { FLGRP: fieldGroup['FLGRP'], NO_OUT: '' });
                            fieldGroup['HDGRP'] = visibleGroupFields.length > 0 ? '' : 'X';
                        } else {
                            correspondingField = underscoreJS.find(sectionFields, { FLDNAME: fieldGroup['FLDNAME'] });
                            fieldGroup['DESCR'] = correspondingField['LABEL'];
                            fieldGroup['HDGRP'] = correspondingField['NO_OUT'];
                        }
                    }
                    /* Action Properties */
                    for (var k = 0; k < actionProps.length; k += 1) {
                        actionProp = actionProps[k];

                        actions = underscoreJS.where(sectionProp['FUNC'], {
                            FNCNM: actionProp['FNCNM']
                        });
                        for (var l = 0; l < actions.length; l++) {
                            action = actions[l];
                            action['HIDFN'] = actionProp['HIDFN'];
                            //*****Rel 60E_SP6
                            if (actionProp['SEL_SEGMNT'] && !underscoreJS.isEmpty(actionProp['SEL_SEGMNT'])) {
                                action['SEL_SEGMNT'] = actionProp['SEL_SEGMNT'];
                            }
                            //*****
                        }
                    }
                }
            }
            ,

            checkInvalidFields: function () {
                var oController = this, error = false, oInput, index = 0;
                $('input[aria-invalid=true]').each(function () {
                    error = true;
                    oInput = sap.ui.getCore().byId(this.parentNode.id);
                    if (oInput) {
                        oController.setErrorStateToControl(oInput);
                        if (index === 0) {
                            oInput.focus();
                        }
                        index++;

                    }

                });

                return error;

            }
            ,
            //            checkRequiredFields: function (sectionId) {
            //                var error = false;
            //                var oController = this;
            //                var mainModel = oController.getModel(global.vui5.modelName);
            //                var model = oController.getModel(this.modelName);
            //                var dMode = mainModel.getProperty("/DOCUMENT_MODE");
            //                var index = 0,
            //                    path;
            //                var section = oController.getSectionBy('SECTN', sectionId) || {};
            //
            //                if (dMode && dMode !== global.vui5.cons.mode.display || oController._formDialog || section['DAPPT'] === global.vui5.cons.propertyType.selections) {
            //                    if (oController.checkInvalidFields()) {
            //                        return true;
            //                    }
            //                    $('input[aria-required=true],.vuiFileUploader input[type="file"],.vuiDatePicker input[aria-required=true],.vuiTimePicker input[aria-required=true]').each(function (i) {
            //                        if (section['DAPPT'] === global.vui5.cons.propertyType.selections) {
            //                            var oInput = sap.ui.getCore().byId(this.parentNode.id);
            //                            if (!oInput) {
            //                                oInput = sap.ui.getCore().byId(this.parentNode.parentNode.parentNode.id);
            //                            }
            //                            if (oInput) {
            //                                path = oInput.data("path");
            //                            }
            //                        } else {
            //                            var oInput = sap.ui.getCore().byId(this.parentNode.id);
            //                        }
            //
            //                        if (!oInput) {
            //                            var id = $(this).closest("form").parent().attr('id');
            //                            oInput = sap.ui.getCore().byId(id);
            //                        }
            //                        if (!oInput) {
            //                            return;
            //                        }
            //
            //                        var errorflag = false;
            //                        if (oInput.$().is(":visible")) {
            //                            var item;
            //                            if (oInput instanceof sap.m.ComboBox) {
            //                                item = oInput.getSelectedItem();
            //                                if (!item) {
            //                                    errorflag = true;
            //                                } else if (!item.getKey()) {
            //                                    errorflag = true;
            //                                }
            //                            } else if (oInput instanceof sap.m.MultiComboBox) {
            //                                item = oInput.getSelectedItems();
            //                                if (!item) {
            //                                    errorflag = true;
            //                                } else if (underscoreJS.isEmpty(item)) {
            //                                    errorflag = true;
            //                                }
            //                            } else if (oInput instanceof sap.m.MultiInput) {
            //                                if (oInput.getTokens) {
            //                                    oInput.getTokens().length === 0 ? errorflag = true : errorflag = false;
            //                                }
            //                                if (errorflag && oInput.getValue) {
            //                                    underscoreJS.isEmpty(oInput.getValue()) ? errorflag = true : errorflag = false;
            //                                    if (errorflag && this.getAttribute('readonly') == 'readonly') {
            //                                        errorflag = false;
            //                                    }
            //                                }
            //                            } else if (oInput.getValue && oInput.getValue() && $(this).parent().hasClass('vuiDatePicker')) {
            //                                oInput.getValue() === '0000-00-00' ? errorflag = true : errorflag = false;
            //                            } else if (oInput.getValue && oInput.getValue() && $(this).parent().hasClass('vuiTimePicker')) {
            //                                oInput.getValue() === '00:00:00' ? errorflag = true : errorflag = false;
            //                            } else if (oInput.getValue && oInput.getValue() == '') {
            //                                errorflag = true;
            //                                if (errorflag && this.getAttribute('readonly') == 'readonly') {
            //                                    errorflag = false;
            //                                }
            //                            }
            //
            //                            if (errorflag) {
            //                                oInput.setValueState(sap.ui.core.ValueState.Error);
            //                                if (section['DAPPT'] === global.vui5.cons.propertyType.selections)
            //                                    var text = model.getProperty(path + "/LABEL");
            //                                else
            //                                    var text = oInput.getParent().getAggregation("label").getText();
            //
            //                                //var bundle = oController.geti18nResourceBundle();
            //                                var errorText = oController._getBundleText("Enter", [text]);
            //                                if ($(this).attr('type') !== "file") {
            //                                    oInput.setValueStateText(errorText);
            //                                }
            //
            //                                oController._handleCheckFieldsMessages(
            //                                    errorText,
            //                                    sap.ui.core.MessageType.Error,
            //                                    oInput.getId() + "/value");
            //                                error = true;
            //                                if (index == 0) {
            //                                    oInput.focus();
            //                                }
            //                                index++;
            //                            }
            //                        }
            //                    });
            //                }
            //
            //                return error;
            //            },
            checkRequiredFields: function (sectionId) {
                var error = false, oController, sectionData, performCheck = true, mainModel, model, dMode, index, section, path, inputFocused = false;
                oController = this;
                mainModel = oController.getMainModel();
                model = oController.getModel(this.modelName);
                dMode = mainModel.getProperty("/DOCUMENT_MODE");
                index = 0, path;
                section = oController.getSectionBy('SECTN', sectionId) || {};

                if (section['TBTYP'] === global.vui5.cons.tableType.nonresponsive &&
                    section['INEDT']) {
                    sectionData = model.getProperty(oController._getPath() + section['DARID']);

                    if (sectionData && sectionData.length === 0) {
                        performCheck = false;
                    }
                }


                if (dMode && dMode !== global.vui5.cons.mode.display || oController._formDialog || section['DAPPT'] === global.vui5.cons.propertyType.selections) {
                    /*** Rel 60E SP6 - Required Fields Issue - Start ****/
                    if (performCheck) {


                        jQuery('input[aria-invalid=true]').each(function () {
                            var id = $(this).closest(' .sapMMultiInput.sapMMultiInputMultiLine').attr('id');
                            var oInput = sap.ui.getCore().byId(this.parentNode.id) || sap.ui.getCore().byId(id);
                            if (oInput) {
                                error = true;
                                if (index == 0) {
                                    oInput.focus();
                                    inputFocused = true;
                                }

                            }
                            else {
                                error = true;
                                if (index === 0) {
                                    this.focus();
                                    inputFocused = true;
                                }

                            }

                            index++;
                        });

                        /*** Rel 60E SP6 - Required Fields Issue - End ****/
                        $('.vuiRequired').each(function (i, d) {
                            var element = this, oInput, input, errorflag;

                            oInput = sap.ui.getCore().byId($(this).attr('id'));
                            if (oInput instanceof sap.ui.unified.FileUploader) {
                                input = $('.vuiFileUploader input[type="file"]');
                            }
                            else {
                                input = $('.vuiRequired input[aria-required=true]');
                            }
                            errorflag = false;
                            if (oInput.$().is(":visible")) {
                                var item;
                                var dataType = oInput.data("dataType");
                                if (oInput instanceof sap.m.ComboBox) {
                                    item = oInput.getSelectedItem();
                                    if (!item) {
                                        errorflag = true;
                                    } else if (!item.getKey()) {
                                        errorflag = true;
                                    }
                                } else if (oInput instanceof sap.m.MultiComboBox) {
                                    item = oInput.getSelectedItems();
                                    if (!item) {
                                        errorflag = true;
                                    } else if (underscoreJS.isEmpty(item)) {
                                        errorflag = true;
                                    }
                                } else if (oInput instanceof sap.m.MultiInput) {
                                    //*****Rel 60E_SP6
                                    //oInput.getTokens().length === 0 ? errorflag = true : errorflag = false;
                                    if (oInput.getTokens().length !== 0) {
                                        errorflag = false;
                                    }
                                    else {
                                        if (oInput.getValue && oInput.getValue().length === 0) {
                                            errorflag = true;
                                        }
                                        else {
                                            errorflag = false;
                                        }
                                    }
                                    //*****
                                } else if (oInput.getValue && oInput.getValue() && $(this).parent().hasClass('vuiDatePicker')) {
                                    oInput.getValue() === '0000-00-00' ? errorflag = true : errorflag = false;
                                } else if (oInput.getValue && oInput.getValue() && $(this).parent().hasClass('vuiTimePicker')) {
                                    oInput.getValue() === '00:00:00' ? errorflag = true : errorflag = false;
                                } else if (oInput.getValue && oInput.getValue() == '' && this.getAttribute('readonly') != 'readonly') {
                                    errorflag = true;
                                } else if (oInput.getValue && oInput.getValue() && dataType &&
                                    (dataType === global.vui5.cons.dataType.amount || dataType === global.vui5.cons.dataType.quantity)) {
                                    var checkValue = oInput.getValue().replace(/([-\,\.])/g, "");
                                    if (!isNaN(checkValue) && !eval(checkValue)) {
                                        errorflag = true;
                                    }
                                }

                                if (errorflag) {
                                    oInput.setValueState(sap.ui.core.ValueState.Error);
                                    if (section && section['DAPPT'] === global.vui5.cons.propertyType.selections) {
                                        path = oInput.data("path");
                                        var text = model.getProperty(path + "/LABEL");
                                    }
                                    //*****Rel 60E_SP6 - ECIP #18999
                                    else if (oInput.data("fieldInfo") && oInput.data("fieldInfo")['LABEL']) {
                                        var text = oInput.data("fieldInfo")["LABEL"];
                                    }
                                    else if (oInput.getParent().getAggregation("label")) {
                                        var text = oInput.getParent().getAggregation("label").getText();
                                    }
                                    //*****                                                                                               
                                    var errorText = oController._getBundleText("Enter", [text]);
                                    if ($(input).attr('type') !== "file") {
                                        oInput.setValueStateText(errorText);
                                    }

                                    oController._handleCheckFieldsMessages(
                                        errorText,
                                        sap.ui.core.MessageType.Error,
                                        oInput.getId() + "/value");
                                    error = true;
                                    if (index == 0 && !inputFocused) {
                                        oInput.focus();
                                    }
                                    index++;
                                }
                            }
                        });
                    }

                }
                return error;
            }
            ,
            _checkDocumentChanges: function (action) {
                var oController = this,
                    bundle;
                var mainModel = oController.getMainModel();
                var objDefer = $.Deferred();

                if (mainModel.getProperty("/DATA_CHANGED") && action && action['FNCNM'] !== global.vui5.cons.eventName.continue && !oController._formDialog) {
                    //bundle = oController.geti18nResourceBundle();
                    MessageBox.confirm(oController._getBundleText("ConfirmCancelMsg"), {
                        title: oController._getBundleText("Confirm"),
                        actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                        onClose: function (oAction) {
                            if (oAction == MessageBox.Action.OK) {
                                objDefer.resolve();
                            } else {
                                objDefer.reject();
                            }
                        }
                    });
                } else {
                    objDefer.resolve();
                }

                return objDefer.promise();
            }
            ,
            _processCommonSections: function (cfg) {
                var oController = this,
                    section,
                    index,
                    sectionID,
                    dataArea,
                    sectionConfig;

                section = cfg.section;
                index = cfg.index;
                sectionID = section['SECTN'];
                dataArea = section['DATAR'];
                sectionConfig = oController.sectionConfig[sectionID];

                /* Process Attributes */
                if (sectionConfig.attributes[global.vui5.cons.attributes.onDrillDown]) {
                    sectionConfig.onDrillDownAction = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onDrillDown]
                    });
                    if (sectionConfig.onDrillDownAction) {
                        sectionConfig.onDrillDownAction['HIDFN'] = 'X';
                    }

                }
                if (sectionConfig.attributes[global.vui5.cons.attributes.onRowSelect]) {
                    sectionConfig.onRowSelect = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onRowSelect]
                    });
                    if (sectionConfig.onRowSelect) {
                        sectionConfig.onRowSelect['HIDFN'] = 'X';
                    }

                }
                /**ESP6 Task#53345 Supporting variants in Grid**/
                if (section['DAPPT'] === global.vui5.cons.propertyType.planningGrid ||
                    section['DAPPT'] === global.vui5.cons.propertyType.pricingGrid) {
                    sectionConfig.onVariantMaintain = {
                        "FNCNM": global.vui5.cons.eventName.variantMaintain,
                        "RQTYP": global.vui5.cons.reqTypeValue.post
                    };

                    sectionConfig.onVariantSelect = {
                        "FNCNM": global.vui5.cons.eventName.variantSelect,
                        "SELTP": global.vui5.cons.selectionType.single,
                        "RQTYP": global.vui5.cons.reqTypeValue.post
                    };

                    sectionConfig.onLayoutManage = {
                        "FNCNM": global.vui5.cons.eventName.layoutManage,
                        "RQTYP": global.vui5.cons.reqTypeValue.post
                    };
                    if (sectionConfig.attributes[global.vui5.cons.attributes.enableLazyLoading]) {
                        sectionConfig.iGridDataGet= {
                            "FNCNM": global.vui5.cons.eventName.iGridDataGet,
                            "RQTYP": global.vui5.cons.reqTypeValue.get,
                        };
                    }               
                }
                /****/
                if (section['DAPPT'] === global.vui5.cons.propertyType.table ||
                    section['DAPPT'] === global.vui5.cons.propertyType.reportingView ||
                    section['DAPPT'] === global.vui5.cons.propertyType.summary) {
                    sectionConfig.onVariantMaintain = {
                        "FNCNM": global.vui5.cons.eventName.variantMaintain,
                        "RQTYP": global.vui5.cons.reqTypeValue.post
                    };

                    sectionConfig.onVariantSelect = {
                        "FNCNM": global.vui5.cons.eventName.variantSelect,
                        "SELTP": global.vui5.cons.selectionType.single
                    };

                    sectionConfig.onLayoutManage = {
                        "FNCNM": global.vui5.cons.eventName.layoutManage,
                        "RQTYP": global.vui5.cons.reqTypeValue.post
                    };

                    sectionConfig.onPageChange = {
                        "FNCNM": global.vui5.cons.eventName.pageChange,
                        "SECTN": sectionID
                    };


                    sectionConfig.onSetValues = {
                        "FNCNM": global.vui5.cons.eventName.setValues,
                        "RQTYP": global.vui5.cons.reqTypeValue.post,
                        "ACTYP": global.vui5.cons.actionType.popup,
                        "SECTN": sectionID,
                        "SELTP": global.vui5.cons.rowSelection.multiple
                    };

                    sectionConfig.onSetValuesApply = {
                        "FNCNM": global.vui5.cons.eventName.setValuesApply,
                        "RQTYP": global.vui5.cons.reqTypeValue.post,
                        "SECTN": sectionID
                    };

                    sectionConfig.onMassEditAction = {
                        "FNCNM": global.vui5.cons.eventName.massEditApply,
                        "RQTYP": global.vui5.cons.reqTypeValue.post,
                        "SECTN": sectionID
                    };

                }

                if (sectionConfig.attributes[global.vui5.cons.attributes.enableQuickEntry]) {
                    sectionConfig.onQuickEntryAction = {
                        "FNCNM": global.vui5.cons.eventName.quickEntry,
                        "RQTYP": global.vui5.cons.reqTypeValue.post,
                        "SECTN": sectionID,
                        "ACTYP": global.vui5.cons.actionType.popup
                    };
                }
            },

            _processOverviewPage: function (cfg) {
                sap.ui.getCore().loadLibrary(vistexConfig.rootFolder + ".ui.widgets.OverviewPage", {
                    url: vistexConfig.uiResourcePath + "/" + vistexConfig.ovpLibraryVersion + "/" + vistexConfig.rootFolder + "/ui/widgets/OverviewPage"
                });

                if (!global.vui5.ui.controls.OverviewPage &&
                    eval(vistexConfig.rootFolder + ".ui.widgets.OverviewPage.OverviewPage")) {
                    global.vui5.ui.controls.OverviewPage = eval(vistexConfig.rootFolder + ".ui.widgets.OverviewPage.OverviewPage");
                }


                var oController = this;
                var section = cfg.section;
                var sectionID = section['SECTN'];
                oController.sectionRef[sectionID] = new global.vui5.ui.controls.OverviewPage({
                    controller: oController,
                    onNavigate: function (oEvent) {
                        oController.processOvpActions(oEvent);
                    }
                });

                oController.sectionRef[sectionID].setModel(oController.getCurrentModel(), global.vui5.modelName);
                oController.sectionRef[sectionID].setModel(oController.getCurrentModel(), oController.modelName);

            },
            _processForm: function (cfg) {
                var oController = this, section, index, mainModel, dmode, formRef, sectionID, sectionEditable,
                    sectionPath, dataPath, formRef;
                mainModel = oController.getModel(global.vui5.modelName);
                dmode = mainModel.getProperty("/DOCUMENT_MODE");
                sectionPath = oController._getPath(true);
                dataPath = oController._getPath();
                section = cfg.section;
                index = cfg.index;
                sectionID = section['SECTN'];
                if (oController._formDialog) {
                    sectionEditable = (section['DISOL'] === '')
                } else {
                    sectionEditable = section['DISOL'] === '' && (section['EDIT'] !== '' || dmode !== global.vui5.cons.mode.display);
                }
                formRef = oController.sectionRef[sectionID] = new global.vui5.ui.controls.Form({
                    modelName: oController.modelName,
                    dropDownModelName: global.vui5.modelName,
                    sectionPath: sectionPath + index + "/",
                    sectionFieldPath: sectionPath + index + "/FLGRP/",
                    sectionDataPath: dataPath + section['DARID'] + "/",
                    fieldsPath: sectionPath + index + "/FIELDS/",
                    sectionFunctionsPath: sectionPath + index + "/FUNC/",
                    titlePath: sectionPath + index + "/DESCR",
                    dataArea: section['DARID'],
                    sectionEditable: sectionEditable,
                    formDialog: underscoreJS.isObject(oController._formDialog)
                }).setModel(oController.getModel(oController.modelName), oController.modelName)
                    .setModel(oController.getModel(global.vui5.modelName), global.vui5.modelName);

                oController.handleSuggestionItemSelected = function () { };
                formRef._prepareButtonControl = function (object, sectionID, fromToolBar) {
                    return oController._prepareButtonControl(object, sectionID, fromToolBar)
                };
                formRef.processFileUpload = function (oEvent, dataPath, field) {
                    oController.processFileUpload(sectionID, oEvent, dataPath, field)
                };
                formRef._onCheckBoxSelect = function (oEvent) {
                    oController._onCheckBoxSelect(oEvent)
                };
                //*****Rel 60E_SP6 - Task #39097
                formRef._onToggleButtonChange = function (oEvent) {
                    oController._onToggleButtonChange(oEvent)
                };
                //*****                
                formRef.dateFieldCheck = function (oEvent) {
                    oController.dateFieldCheck(oEvent)
                };
                formRef.onValueHelpRequest = function (oEvent) {
                    oController.onValueHelpRequest(sectionID, oEvent);
                };
                formRef.processOnInputChange = function (oEvent) {
                    return oController.processOnInputChange(sectionID, oEvent);
                };
                formRef.preProcessFieldEvent = function (oEvent) {
                    return oController.preProcessFieldEvent(sectionID, oEvent);
                };
                formRef.preProcessFieldClickEvent = function (oEvent) {
                    return oController.preProcessFieldClickEvent(sectionID, oEvent);
                };

                formRef.getDropdownValues = function (oEvent, fieldInfo) {
                    return oController.getDropdownValues(sectionID, oEvent, fieldInfo);
                };
                jQuery.sap.syncStyleClass(oController.getOwnerComponent().getContentDensityClass(),
                    oController.getView(), formRef);
                formRef.prepareFormControl();
            },
            /** Rel 60E_SP7 Grid 3.0**/
            //            _processTable: function (cfg) {
            //                var oController = this,
            //                    section,
            //                    index,
            //                    sectionID,
            //                    dataArea;
            //                var model = oController.getCurrentModel(),
            //                    callBack;
            //                var mainModel = oController.getModel(global.vui5.modelName);
            //                var enableSearchAndReplace,
            //                    enableSetValues,
            //                    enableBulkEdit,
            //                    oMode,
            //                    oListItemType,
            //                    tableRef,
            //                    maxItems,
            //                    hasDrillDown,
            //                    sectionModelPath,
            //                    sectionModelFullPath,
            //                    enableRowColor,
            //                    mergeDuplicates,
            //                    sectionConfig;
            //                section = cfg.section;
            //                index = cfg.index;
            //                sectionID = section['SECTN'];
            //                dataArea = section['DATAR'];
            //                var sectionPath = oController._getPath(true);
            //                var dataPath = oController._getPath();
            //                var dmode = mainModel.getProperty("/DOCUMENT_MODE")
            //                sectionModelPath = sectionPath + index;
            //                sectionModelFullPath = oController.modelName + ">" + sectionModelPath;
            //                sectionConfig = oController.sectionConfig[sectionID];
            //
            //                /**** Rel 60E SP6 - FullScreen Support changes - Start ***/
            //                enableSearchAndReplace = !!sectionConfig.attributes[global.vui5.cons.attributes.enableSearchAndReplace];
            //                enableSetValues = !!sectionConfig.attributes[global.vui5.cons.attributes.enableSetValues];
            //                /**** Rel 60E SP6 - FullScreen Support changes - End ***/
            //                enableBulkEdit = !!sectionConfig.attributes[global.vui5.cons.attributes.enableBulkEdit] &&
            //                                dmode !== global.vui5.cons.mode.display && section['DISOL'] === '';
            //
            //                enableRowColor = !!sectionConfig.attributes[global.vui5.cons.attributes.enableRowColor];
            //
            //                /***Rel 60E SP7 - Layout Control - Start ***/
            //                disableTableHeader = !!sectionConfig.attributes[global.vui5.cons.attributes.noHeaders];
            //                /***Rel 60E SP7 - Layout Control - End ***/
            //
            //                hasDrillDown = !!sectionConfig.onDrillDownAction;
            //                oListItemType = hasDrillDown ? sap.m.ListType.Navigation : sap.m.ListType.Active;
            //                /* Prepare Element */
            //
            //                if (section['TBTYP'] == global.vui5.cons.tableType.responsive) {
            //                    /****** Rel 60E_SP7 TASK #52848  */
            //                    mergeDuplicates = !!sectionConfig.attributes[global.vui5.cons.attributes.mergeDuplicates];
            //                    /***/
            //                    tableRef = oController.sectionRef[section['SECTN']] = new global.vui5.ui.controls.ResponsiveTable({
            //                        sectionID: section['SECTN'],
            //                        controller: oController,
            //                        modelName: oController.modelName,
            //                        fieldPath: sectionModelPath + "/FIELDS/",
            //                        fieldGroupPath: sectionModelPath + "/FLGRP/",
            //                        dataPath: dataPath + section['DARID'] + "/",
            //                        dataAreaPath: sectionModelPath + "/DARID/",
            //                        layoutDataPath: dataPath + section['DARID'] + global.vui5.cons.nodeName.layout + "/",
            //                        totalDataPath: dataPath + section['DARID'] + global.vui5.cons.nodeName.total + "/",
            //                        variantDataPath: dataPath + section['DARID'] + global.vui5.cons.nodeName.variant + "/",
            //                        selectedVariant: "/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.selectedVariant,
            //                        totalNumberOfRows: "/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.maxItems,
            //                        hideVariantSave: !!sectionConfig.attributes[global.vui5.cons.attributes.hideVariantSave] ||
            //                            !sectionConfig.attributes[global.vui5.cons.attributes.enablePersonalization],
            //                        /***Rel 60E SP6 ECDM #4728 - Start ***/
            //                        hideShare: !!sectionConfig.attributes[global.vui5.cons.attributes.hideShare],
            //                        /***Rel 60E SP6 ECDM #4728 - End ***/
            //                        showTitle: true,
            //                        /****** Rel 60E_SP7 TASK #52848  */
            //                        mergeDuplicates: mergeDuplicates,
            //                        /***/
            //                        growingScrollToLoad: true,
            //                        rememberSelections: false,
            //                        listItemType: oListItemType,
            //                        enableSearchAndReplace: enableSearchAndReplace,
            //                        enableSetValues: enableSetValues,
            //                        enableQuickEntry: !!sectionConfig.onQuickEntryAction && dmode !== global.vui5.cons.mode.display && section['DISOL'] === '' && !oController._formDialog,
            //                        enableBulkEdit: enableBulkEdit,
            //                        uiProfile: oController.getProfileInfo()['UIPRF'],
            //                        fullScreen: !oController._formDialog,
            //                        backendSortFilter: oController.getBindingExpression("backendSortFilter", section, index),
            //                        handle: oController.getBindingExpression("handle", section, index),
            //                        visible: oController.getBindingExpression('visible', section, index),
            //                        // title: oController.getBindingExpression("title",
            //                        // section, index),
            //                        editable: oController.getBindingExpression("editable", section, index),
            //                        enableLocalSearch: oController.getBindingExpression("enableLocalSearch", section, index),
            //                        enablePersonalization: oController.getBindingExpression("enablePersonalization", section, index),
            //                        pagingType: oController.getBindingExpression("pageType", section, index),
            //                        pagingThreshold: oController.getBindingExpression("pageSize", section, index),
            //                        onValueHelpRequest: oController.onValueHelpRequest.bind(oController, sectionID),
            //                        /***Rel 60E SP7 Layout Control - Start ***/
            //                        disableTableHeader: disableTableHeader,
            //                        /***Rel 60E SP7 Layout Control - End ***/
            //                        onFullScreen: function (oEvent) {
            //                            oController.processFullScreen(sectionID, oEvent.getParameter("fullScreen"));
            //                        },
            //                        variantSelect: function (oEvent) {
            //                            callBack = oEvent.getParameter("callBack");
            //                            oController.processAction.call(oController, sectionID, sectionConfig.onVariantSelect, oEvent.getParameter("record")).then(function () {
            //                                if (callBack && callBack instanceof Function) {
            //                                    callBack();
            //                                }
            //                            });
            //                        },
            //                        variantSave: function (oEvent) {
            //                            callBack = oEvent.getParameter("callBack");
            //                            oController.processAction.call(oController, sectionID, sectionConfig.onVariantMaintain, null, oEvent.getParameter("urlParams")).then(function () {
            //                                if (callBack && callBack instanceof Function) {
            //                                    callBack();
            //                                }
            //                            });
            //                        },
            //                        layoutManage: function (oEvent) {
            //                            callBack = oEvent.getParameter("callBack");
            //                            oController.processAction.call(oController, sectionID, sectionConfig.onLayoutManage).then(function () {
            //                                if (callBack && callBack instanceof Function) {
            //                                    callBack();
            //                                }
            //                            });
            //                        },
            //                        pageChange: function (oEvent) {
            //                            oController.processAction.call(oController, sectionID, sectionConfig.onPageChange, null, oEvent.getParameter("urlParams"));
            //                        },
            //                        onSetValues: function (oEvent) {
            //                            callBack = oEvent.getParameter("callBack");
            //                            oController.processAction.call(oController, sectionID, sectionConfig.onSetValues).then(function () {
            //                                if (callBack && callBack instanceof Function) {
            //                                    callBack();
            //                                }
            //                            });
            //                        },
            //                        onSetValuesApply: function () {
            //                            oController.processAction.call(oController, sectionID, sectionConfig.onSetValuesApply).then(function () {
            //                                oController._setValuesAction = undefined;
            //                            });
            //
            //                        },
            //                        onSetValuesClose: function () {
            //                            oController._setValuesAction = undefined;
            //                        },
            //                        onExport: function (oEvent) {
            //                            var object = oEvent.getParameter('action');
            //                            object['DARID'] = section['DARID'];
            //                            callBack = oEvent.getParameter("callBack");
            //                            oController.processAction.call(oController, sectionID, object, null).then(function () {
            //                                if (callBack && callBack instanceof Function) {
            //                                    callBack();
            //                                }
            //                            });
            //                        },
            //                        onQuickEntry: function (oEvent) {
            //                            oController.processAction.call(oController, sectionID, sectionConfig.onQuickEntryAction);
            //                        },
            //                        onMassEdit: function (oEvent) {
            //                            var urlParams = {};
            //                            urlParams['DATA'] = oEvent.getParameter("tableData");
            //                            oController.processAction.call(oController, sectionID, sectionConfig.onMassEditAction, {}, urlParams);
            //                        },
            //                        //*****Rel 60E_SP6 - QA #9410
            //                        onUpdate: function (oEvent) {
            //                            var callBack = oEvent.getParameter("callBack");
            //                            if (oEvent.getParameter("callFrom") === global.vui5.cons.updateCallFrom.personalization) {
            //                                oController.updateChangedData(sectionID, null, null, null).then(function () {
            //                                    if (callBack && callBack instanceof Function) {
            //                                        callBack();
            //                                    }
            //                                });
            //                            }
            //                            else {
            //                                oController.updateChangedData(sectionID, null, null, global.vui5.cons.updateCallFrom.searchAndReplace);
            //                            }
            //
            //                        }
            //                        //*****
            //                    });
            //                    tableRef.bindProperty("mode", {
            //                        path: oController.modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.rowSelection,
            //                        formatter: function (rowSelection) {
            //                            var mode = rowSelection === 'X' ? sap.m.ListMode.MultiSelect : sap.m.ListMode.None;
            //                            if (mode === sap.m.ListMode.MultiSelect) {
            //                                this.attachSelectionChange(function (evt) {
            //                                    // var record = evt.getParameter('listItem').getBindingContext(oController.modelName).getObject();
            //                                    oController.processAction.call(oController, sectionID, sectionConfig.onRowSelect, this.getSelectedRows())
            //                                });
            //                            }
            //                            return mode;
            //                        },
            //                        mode: sap.ui.model.BindingMode.OneWay
            //                    });
            //                    tableRef.addStyleClass("vuiTableBottomPadding");
            //                } else {
            //                    tableRef = oController.sectionRef[section['SECTN']] = new global.vui5.ui.controls.NonResponsiveTable({
            //                        sectionID: section['SECTN'],
            //                        controller: oController,
            //                        modelName: oController.modelName,
            //                        fieldPath: sectionModelPath + "/FIELDS/",
            //                        dataPath: dataPath + section['DARID'] + "/",
            //                        dataAreaPath: sectionModelPath + "/DARID/",
            //                        fieldGroupPath: sectionModelPath + "/FLGRP/",
            //                        layoutDataPath: dataPath + section['DARID'] + global.vui5.cons.nodeName.layout + "/",
            //                        totalDataPath: dataPath + section['DARID'] + global.vui5.cons.nodeName.total + "/",
            //                        variantDataPath: dataPath + section['DARID'] + global.vui5.cons.nodeName.variant + "/",
            //                        selectedVariant: "/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.selectedVariant,
            //                        enableSearchAndReplace: enableSearchAndReplace,
            //                        enableSetValues: enableSetValues,
            //                        enableQuickEntry: !!sectionConfig.onQuickEntryAction && !oController._formDialog && dmode !== global.vui5.cons.mode.display && section['DISOL'] === '',
            //                        enableBulkEdit: enableBulkEdit,
            //                        enableRowColor: enableRowColor,
            //                        //enableGrouping: true,
            //                        hideVariantSave: !!sectionConfig.attributes[global.vui5.cons.attributes.hideVariantSave] ||
            //                            !sectionConfig.attributes[global.vui5.cons.attributes.enablePersonalization],
            //                        /***Rel 60E SP6 ECDM #4728 - Start ***/
            //                        hideShare: !!sectionConfig.attributes[global.vui5.cons.attributes.hideShare],
            //                        /***Rel 60E SP6 ECDM #4728 - End ***/
            //                        showTitle: true,
            //                        enableColumnFreeze: true,
            //                        enableCustomFilter: true,
            //                        hideDetailButton: !hasDrillDown,
            //                        fullScreen: !oController._formDialog,
            //                        backendSortFilter: oController.getBindingExpression("backendSortFilter", section, index),
            //                        pagingType: oController.getBindingExpression("pageType", section, index),
            //                        numberOfPages: oController.getBindingExpression("totalNumberOfPages", section, index),
            //                        // title: oController.getBindingExpression("title",
            //                        // section, index),
            //                        pageSize: oController.getBindingExpression("pageSize", section, index),
            //                        totalNumberOfRows: "/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.maxItems,
            //                        enablePersonalization: oController.getBindingExpression("enablePersonalization", section, index),
            //                        handle: oController.getBindingExpression('handle', section, index),
            //                        visible: oController.getBindingExpression('visible', section, index),
            //                        editable: oController.getBindingExpression("editable", section, index),
            //                        enableLocalSearch: oController.getBindingExpression("enableLocalSearch", section, index),
            //                        onFullScreen: function (oEvent) {
            //                            oController.processFullScreen(sectionID, oEvent.getParameter("fullScreen"));
            //                        },
            //                        onValueHelpRequest: oController.onValueHelpRequest.bind(oController, sectionID),
            //                        variantSelect: function (oEvent) {
            //                            callBack = oEvent.getParameter("callBack");
            //                            oController.processAction.call(oController, sectionID, sectionConfig.onVariantSelect, oEvent.getParameter("record")).then(function () {
            //                                if (callBack && callBack instanceof Function) {
            //                                    callBack();
            //                                }
            //                            });
            //                        },
            //                        variantSave: function (oEvent) {
            //                            callBack = oEvent.getParameter("callBack");
            //                            oController.processAction.call(oController, sectionID, sectionConfig.onVariantMaintain, null, oEvent.getParameter("urlParams")).then(function () {
            //                                if (callBack && callBack instanceof Function) {
            //                                    callBack();
            //                                }
            //                            });
            //                        },
            //                        layoutManage: function (oEvent) {
            //                            callBack = oEvent.getParameter("callBack");
            //                            oController.processAction.call(oController, sectionID, sectionConfig.onLayoutManage).then(function () {
            //                                if (callBack && callBack instanceof Function) {
            //                                    callBack();
            //                                }
            //                            });
            //                        },
            //                        pageChange: function (oEvent) {
            //                            oController.processAction.call(oController, sectionID, sectionConfig.onPageChange, null, oEvent.getParameter("urlParams"));
            //                        },
            //                        onSetValues: function (oEvent) {
            //                            callBack = oEvent.getParameter("callBack");
            //                            oController.processAction.call(oController, sectionID, sectionConfig.onSetValues).then(function () {
            //                                if (callBack && callBack instanceof Function) {
            //                                    callBack();
            //                                }
            //                            });
            //                        },
            //                        onSetValuesApply: function () {
            //                            oController.processAction.call(oController, sectionID, sectionConfig.onSetValuesApply).then(function () {
            //                                oController._setValuesAction = undefined;
            //                            });
            //
            //                        },
            //                        onSetValuesClose: function () {
            //                            oController._setValuesAction = undefined;
            //                        },
            //                        onExport: function (oEvent) {
            //                            var object = oEvent.getParameter('action');
            //                            object['DARID'] = section['DARID'];
            //                            callBack = oEvent.getParameter("callBack");
            //                            oController.processAction.call(oController, sectionID, object, null).then(function () {
            //                                if (callBack && callBack instanceof Function) {
            //                                    callBack();
            //                                }
            //                            });
            //                        },
            //                        group: function (oEvent) {
            //                            oEvent.bPreventDefault = true;
            //                            tableRef.onColumnGroup(oEvent);
            //                            return false;
            //                        },
            //                        onQuickEntry: function (oEvent) {
            //                            oController.processAction.call(oController, sectionID, sectionConfig.onQuickEntryAction);
            //                        },
            //                        onMassEdit: function (oEvent) {
            //                            var urlParams = {};
            //                            urlParams['DATA'] = oEvent.getParameter("tableData");
            //                            oController.processAction.call(oController, sectionID, sectionConfig.onMassEditAction, {}, urlParams);
            //                        },
            //                        //*****Rel 60E_SP6 - QA #9410
            //                        onUpdate: function (oEvent) {
            //                            var callBack = oEvent.getParameter("callBack");
            //                            if (oEvent.getParameter("callFrom") === global.vui5.cons.updateCallFrom.personalization) {
            //                                oController.updateChangedData(sectionID, null, null, null).then(function () {
            //                                    if (callBack && callBack instanceof Function) {
            //                                        callBack();
            //                                    }
            //                                });
            //                            }
            //                            else {
            //                                oController.updateChangedData(sectionID, null, null, global.vui5.cons.updateCallFrom.searchAndReplace);
            //                            }
            //
            //                        }
            //                        //*****
            //                    });
            //
            //
            //
            //                    tableRef.bindProperty("minAutoRowCount", {
            //                        path: oController.modelName + ">" + dataPath + section['DARID'] + "/",
            //                        formatter: function (data) {
            //                            return oController.determineMinRowCount(tableRef, data);
            //                        }
            //                    });
            //
            //                    tableRef.bindProperty("enableGrouping", {
            //                        path: oController.modelName + ">" + dataPath + section['DARID'] + "/",
            //                        formatter: function (data) {
            //                            return data && data.length > 0;
            //                        }
            //                    })
            //
            //                    tableRef.bindProperty("selectionMode", {
            //                        path: oController.modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.rowSelection,
            //                        formatter: function (rowSelection) {
            //                            var mode = rowSelection === 'X' ? sap.ui.table.SelectionMode.MultiToggle : sap.ui.table.SelectionMode.None;
            //                            if (mode === sap.ui.table.SelectionMode.MultiToggle) {
            //                                this.attachRowSelectionChange(function (evt) {
            //                                    //var record = evt.getSource().getBindingContext(oController.modelName).getObject();
            //                                    if (evt.getParameter("rowContext")) {
            //                                        var path = evt.getParameter("rowContext").sPath;
            //                                        var record = oController.getCurrentModel().getProperty(path);
            //                                        oController.processAction.call(oController, sectionID, sectionConfig.onRowSelect, record)
            //                                    }
            //
            //                                });
            //                            }
            //                            return mode;
            //                        },
            //                        mode: sap.ui.model.BindingMode.OneWay
            //                    });
            //                    //                    tableRef.setSelectionMode(sap.ui.table.SelectionMode.MultiToggle);
            //                    //                    tableRef.attachRowSelectionChange(function (evt) {
            //                    //                        var record = evt.getSource().getBindingContext(oController.modelName).getObject();
            //                    //                        oController.processAction.call(oController, sectionID, sectionConfig.onRowSelect, record)
            //                    //                    });
            //                }
            //                oController.setSectionTitle(sectionModelFullPath + "/DESCR", oController.modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.maxItems, tableRef, section['DAPPT'], "",
            //                    oController.modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.displayedPages);
            //
            //                tableRef.bindProperty("disableExcelExport", {
            //                    parts: [{
            //                        path: oController.modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.disableExcelExport
            //                    },
            //                        { path: oController.modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.maxItems },
            //                        {
            //                            path: oController.modelName + ">" + dataPath + section['DARID'] + "/"
            //                        }
            //                    ],
            //                    formatter: function (disable, rowCount, data) {
            //                        if (disable) {
            //                            return true;
            //                        }
            //                        else if (parseInt(rowCount) == 0 && (data && data.length == 0)) {
            //                            return true;
            //                        }
            //                        else {
            //                            return false;
            //                        }
            //
            //                    }
            //                })
            //
            //                //                tableRef.bindProperty("title", {
            //                //                    parts: [
            //                //                          {
            //                //                              path: sectionModelFullPath + "/DESCR"
            //                //                          },
            //                //                          { path: oController.modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.maxItems }
            //                //                    ],
            //                //                    formatter: function (descr, count) {
            //                //                        if (descr != undefined) {
            //                //                            if (count != "" && count != undefined) {
            //                //                                return descr + " " + "(" + count + ")";
            //                //                            }
            //                //                            else {
            //                //                                return descr;
            //                //                            }
            //                //                        }
            //                //                    },
            //                //                    mode: sap.ui.model.BindingMode.OneWay
            //                //                });
            //
            //                if (hasDrillDown) {
            //                    if (section['TBTYP'] === global.vui5.cons.tableType.responsive) {
            //                        tableRef.attachOnItemSelect(function (evt) {
            //                            oController.processAction.call(oController, sectionID, sectionConfig.onDrillDownAction, evt.getParameter('record'))
            //                        });
            //
            //                    } else {
            //                        tableRef.attachOnDetailButton(function (evt) {
            //                            oController.processAction.call(oController, sectionID, sectionConfig.onDrillDownAction, evt.getParameter('record'))
            //                        });
            //
            //                    }
            //                } else {
            //                    if (section['TBTYP'] === global.vui5.cons.tableType.responsive) {
            //                        tableRef.attachOnItemSelect(function (evt) {
            //                            oController.processAction.call(oController, sectionID, sectionConfig.onRowSelect, evt.getParameter('record'))
            //                        });
            //
            //                    } else {
            //                        tableRef.attachOnDetailButton(function (evt) {
            //                            oController.processAction.call(oController, sectionID, sectionConfig.onRowSelect, evt.getParameter('record'))
            //                        });
            //                    }
            //                }
            //
            //                tableRef.processOnInputChange = function (oEvent) {
            //                    return oController.processOnInputChange(sectionID, oEvent);
            //                };
            //                //*****Rel 60E_SP6 - Task #39097
            //                tableRef._onToggleButtonChange = function (oEvent) {
            //                    return oController._onToggleButtonChange(oEvent);
            //                };
            //                //*****
            //
            //                tableRef.attachOnFieldClick(function (evt) {
            //                    oController.preProcessFieldClickEvent(sectionID, evt);
            //                });
            //
            //                tableRef.preProcessFieldEvent = function (oEvent) {
            //                    return oController.preProcessFieldEvent(sectionID, oEvent);
            //                };
            //
            //
            //                // tableRef.setOnF4HelpRequest(oController.onValueHelpRequest.bind(oController));
            //                // tableRef.attachOnSortFilter(oController.onSortFilter.bind(oController));
            //                // tableRef.addStyleClass("sapUiResponsiveContentPadding");
            //                tableRef.setModel(mainModel, global.vui5.modelName);
            //                tableRef.setModel(model, oController.modelName);
            //                tableRef.prepareTable();
            //                oController._prepareToolBarContent(sectionID, model.getProperty(sectionModelPath + "/FUNC"));
            //
            //            },
            _processTable: function (cfg) {
                var oController = this,
                    section,
                    index,
                    sectionID,
                    dataArea;
                var model = oController.getCurrentModel(),
                    callBack;
                var mainModel = oController.getModel(global.vui5.modelName);
                var enableSearchAndReplace,
                    enableSetValues,
                    enableBulkEdit,
                    oMode,
                    oListItemType,
                    tableRef,
                    maxItems,
                    hasDrillDown,
                    sectionModelPath,
                    sectionModelFullPath,
                    enableRowColor,
                    mergeDuplicates,
                    sectionConfig;
                section = cfg.section;
                index = cfg.index;
                sectionID = section['SECTN'];
                dataArea = section['DATAR'];
                var sectionPath = oController._getPath(true);
                var dataPath = oController._getPath();
                var dmode = mainModel.getProperty("/DOCUMENT_MODE")
                sectionModelPath = sectionPath + index;
                sectionModelFullPath = oController.modelName + ">" + sectionModelPath;
                sectionConfig = oController.sectionConfig[sectionID];

                /**** Rel 60E SP6 - FullScreen Support changes - Start ***/
                enableSearchAndReplace = !!sectionConfig.attributes[global.vui5.cons.attributes.enableSearchAndReplace];
                enableSetValues = !!sectionConfig.attributes[global.vui5.cons.attributes.enableSetValues];
                /**** Rel 60E SP6 - FullScreen Support changes - End ***/
                enableBulkEdit = !!sectionConfig.attributes[global.vui5.cons.attributes.enableBulkEdit] &&
                    dmode !== global.vui5.cons.mode.display && section['DISOL'] === '';

                enableRowColor = !!sectionConfig.attributes[global.vui5.cons.attributes.enableRowColor];

                /***Rel 60E SP7 - Layout Control - Start ***/
                disableTableHeader = !!sectionConfig.attributes[global.vui5.cons.attributes.noHeaders];
                /***Rel 60E SP7 - Layout Control - End ***/

                hasDrillDown = !!sectionConfig.onDrillDownAction;
                oListItemType = hasDrillDown ? sap.m.ListType.Navigation : sap.m.ListType.Active;
                /* Prepare Element */
                if (section['TBTYP'] !== global.vui5.cons.tableType.grid) {
                    if (section['TBTYP'] == global.vui5.cons.tableType.responsive) {
                        /****** Rel 60E_SP7 TASK #52848  */
                        mergeDuplicates = !!sectionConfig.attributes[global.vui5.cons.attributes.mergeDuplicates];
                        /***/
                        tableRef = oController.sectionRef[section['SECTN']] = new global.vui5.ui.controls.ResponsiveTable({
                            sectionID: section['SECTN'],
                            controller: oController,
                            modelName: oController.modelName,
                            fieldPath: sectionModelPath + "/FIELDS/",
                            fieldGroupPath: sectionModelPath + "/FLGRP/",
                            dataPath: dataPath + section['DARID'] + "/",
                            dataAreaPath: sectionModelPath + "/DARID/",
                            layoutDataPath: dataPath + section['DARID'] + global.vui5.cons.nodeName.layout + "/",
                            totalDataPath: dataPath + section['DARID'] + global.vui5.cons.nodeName.total + "/",
                            variantDataPath: dataPath + section['DARID'] + global.vui5.cons.nodeName.variant + "/",
                            selectedVariant: "/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.selectedVariant,
                            totalNumberOfRows: "/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.maxItems,
                            hideVariantSave: !!sectionConfig.attributes[global.vui5.cons.attributes.hideVariantSave] ||
                                !sectionConfig.attributes[global.vui5.cons.attributes.enablePersonalization],
                            /***Rel 60E SP6 ECDM #4728 - Start ***/
                            hideShare: !!sectionConfig.attributes[global.vui5.cons.attributes.hideShare],
                            /***Rel 60E SP6 ECDM #4728 - End ***/
                            showTitle: true,
                            /****** Rel 60E_SP7 TASK #52848  */
                            mergeDuplicates: mergeDuplicates,
                            /***/
                            //growingScrollToLoad: false,
                            rememberSelections: false,
                            listItemType: oListItemType,
                            enableSearchAndReplace: enableSearchAndReplace,
                            enableSetValues: enableSetValues,
                            enableQuickEntry: !!sectionConfig.onQuickEntryAction && dmode !== global.vui5.cons.mode.display && section['DISOL'] === '' && !oController._formDialog,
                            enableBulkEdit: enableBulkEdit,
                            uiProfile: oController.getProfileInfo()['UIPRF'],
                            fullScreen: !oController._formDialog,
                            backendSortFilter: oController.getBindingExpression("backendSortFilter", section, index),
                            handle: oController.getBindingExpression("handle", section, index),
                            visible: oController.getBindingExpression('visible', section, index),
                            // title: oController.getBindingExpression("title",
                            // section, index),
                            editable: oController.getBindingExpression("editable", section, index),
                            enableLocalSearch: oController.getBindingExpression("enableLocalSearch", section, index),
                            enablePersonalization: oController.getBindingExpression("enablePersonalization", section, index),
                            pagingType: oController.getBindingExpression("pageType", section, index),
                            pagingThreshold: oController.getBindingExpression("pageSize", section, index),
                            onValueHelpRequest: oController.onValueHelpRequest.bind(oController, sectionID),
                            /***Rel 60E SP7 Layout Control - Start ***/
                            disableTableHeader: disableTableHeader,
                            /***Rel 60E SP7 Layout Control - End ***/
                            onFullScreen: function (oEvent) {
                                oController.processFullScreen(sectionID, oEvent.getParameter("fullScreen"));
                            },
                            variantSelect: function (oEvent) {
                                callBack = oEvent.getParameter("callBack");
                                oController.processAction.call(oController, sectionID, sectionConfig.onVariantSelect, oEvent.getParameter("record")).then(function () {
                                    if (callBack && callBack instanceof Function) {
                                        callBack();
                                    }
                                });
                            },
                            variantSave: function (oEvent) {
                                callBack = oEvent.getParameter("callBack");
                                oController.processAction.call(oController, sectionID, sectionConfig.onVariantMaintain, null, oEvent.getParameter("urlParams")).then(function () {
                                    if (callBack && callBack instanceof Function) {
                                        callBack();
                                    }
                                });
                            },
                            layoutManage: function (oEvent) {
                                callBack = oEvent.getParameter("callBack");
                                oController.processAction.call(oController, sectionID, sectionConfig.onLayoutManage).then(function () {
                                    if (callBack && callBack instanceof Function) {
                                        callBack();
                                    }
                                });
                            },
                            pageChange: function (oEvent) {
                                oController.processAction.call(oController, sectionID, sectionConfig.onPageChange, null, oEvent.getParameter("urlParams"));
                            },
                            onSetValues: function (oEvent) {
                                callBack = oEvent.getParameter("callBack");
                                oController.processAction.call(oController, sectionID, sectionConfig.onSetValues).then(function () {
                                    if (callBack && callBack instanceof Function) {
                                        callBack();
                                    }
                                });
                            },
                            onSetValuesApply: function () {
                                oController.processAction.call(oController, sectionID, sectionConfig.onSetValuesApply).then(function () {
                                    oController._setValuesAction = undefined;
                                });

                            },
                            onSetValuesClose: function () {
                                oController._setValuesAction = undefined;
                            },
                            onExport: function (oEvent) {
                                var object = oEvent.getParameter('action');
                                object['DARID'] = section['DARID'];
                                callBack = oEvent.getParameter("callBack");
                                oController.processAction.call(oController, sectionID, object, null).then(function () {
                                    if (callBack && callBack instanceof Function) {
                                        callBack();
                                    }
                                });
                            },
                            onQuickEntry: function (oEvent) {
                                oController.processAction.call(oController, sectionID, sectionConfig.onQuickEntryAction);
                            },
                            onMassEdit: function (oEvent) {
                                var urlParams = {};
                                urlParams['DATA'] = oEvent.getParameter("tableData");
                                oController.processAction.call(oController, sectionID, sectionConfig.onMassEditAction, {}, urlParams);
                            },
                            //*****Rel 60E_SP6 - QA #9410
                            onUpdate: function (oEvent) {
                                var callBack = oEvent.getParameter("callBack");
                                if (oEvent.getParameter("callFrom") === global.vui5.cons.updateCallFrom.personalization) {
                                    oController.updateChangedData(sectionID, null, null, null).then(function () {
                                        if (callBack && callBack instanceof Function) {
                                            callBack();
                                        }
                                    });
                                }
                                else {
                                    oController.updateChangedData(sectionID, null, null, global.vui5.cons.updateCallFrom.searchAndReplace);
                                }

                            }
                            //*****
                        });
                        tableRef.bindProperty("mode", {
                            path: oController.modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.rowSelection,
                            formatter: function (rowSelection) {
                                var mode = rowSelection === 'X' ? sap.m.ListMode.MultiSelect : sap.m.ListMode.None;
                                if (mode === sap.m.ListMode.MultiSelect) {
                                    this.attachSelectionChange(function (evt) {
                                        // var record = evt.getParameter('listItem').getBindingContext(oController.modelName).getObject();
                                        oController.processAction.call(oController, sectionID, sectionConfig.onRowSelect, this.getSelectedRows())
                                    });
                                }
                                return mode;
                            },
                            mode: sap.ui.model.BindingMode.OneWay
                        });
                        tableRef.addStyleClass("vuiTableBottomPadding");
                    } else {
                        tableRef = oController.sectionRef[section['SECTN']] = new global.vui5.ui.controls.NonResponsiveTable({
                            sectionID: section['SECTN'],
                            controller: oController,
                            modelName: oController.modelName,
                            fieldPath: sectionModelPath + "/FIELDS/",
                            dataPath: dataPath + section['DARID'] + "/",
                            dataAreaPath: sectionModelPath + "/DARID/",
                            fieldGroupPath: sectionModelPath + "/FLGRP/",
                            layoutDataPath: dataPath + section['DARID'] + global.vui5.cons.nodeName.layout + "/",
                            totalDataPath: dataPath + section['DARID'] + global.vui5.cons.nodeName.total + "/",
                            variantDataPath: dataPath + section['DARID'] + global.vui5.cons.nodeName.variant + "/",
                            selectedVariant: "/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.selectedVariant,
                            enableSearchAndReplace: enableSearchAndReplace,
                            enableSetValues: enableSetValues,
                            enableQuickEntry: !!sectionConfig.onQuickEntryAction && !oController._formDialog && dmode !== global.vui5.cons.mode.display && section['DISOL'] === '',
                            enableBulkEdit: enableBulkEdit,
                            enableRowColor: enableRowColor,
                            //enableGrouping: true,
                            hideVariantSave: !!sectionConfig.attributes[global.vui5.cons.attributes.hideVariantSave] ||
                                !sectionConfig.attributes[global.vui5.cons.attributes.enablePersonalization],
                            /***Rel 60E SP6 ECDM #4728 - Start ***/
                            hideShare: !!sectionConfig.attributes[global.vui5.cons.attributes.hideShare],
                            /***Rel 60E SP6 ECDM #4728 - End ***/
                            showTitle: true,
                            enableColumnFreeze: true,
                            enableCustomFilter: true,
                            hideDetailButton: !hasDrillDown,
                            fullScreen: !oController._formDialog,
                            backendSortFilter: oController.getBindingExpression("backendSortFilter", section, index),
                            pagingType: oController.getBindingExpression("pageType", section, index),
                            numberOfPages: oController.getBindingExpression("totalNumberOfPages", section, index),
                            // title: oController.getBindingExpression("title",
                            // section, index),
                            pageSize: oController.getBindingExpression("pageSize", section, index),
                            totalNumberOfRows: "/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.maxItems,
                            enablePersonalization: oController.getBindingExpression("enablePersonalization", section, index),
                            handle: oController.getBindingExpression('handle', section, index),
                            visible: oController.getBindingExpression('visible', section, index),
                            editable: oController.getBindingExpression("editable", section, index),
                            enableLocalSearch: oController.getBindingExpression("enableLocalSearch", section, index),
                            onFullScreen: function (oEvent) {
                                oController.processFullScreen(sectionID, oEvent.getParameter("fullScreen"));
                            },
                            onValueHelpRequest: oController.onValueHelpRequest.bind(oController, sectionID),
                            variantSelect: function (oEvent) {
                                callBack = oEvent.getParameter("callBack");
                                oController.processAction.call(oController, sectionID, sectionConfig.onVariantSelect, oEvent.getParameter("record")).then(function () {
                                    if (callBack && callBack instanceof Function) {
                                        callBack();
                                    }
                                });
                            },
                            variantSave: function (oEvent) {
                                callBack = oEvent.getParameter("callBack");
                                oController.processAction.call(oController, sectionID, sectionConfig.onVariantMaintain, null, oEvent.getParameter("urlParams")).then(function () {
                                    if (callBack && callBack instanceof Function) {
                                        callBack();
                                    }
                                });
                            },
                            layoutManage: function (oEvent) {
                                callBack = oEvent.getParameter("callBack");
                                oController.processAction.call(oController, sectionID, sectionConfig.onLayoutManage).then(function () {
                                    if (callBack && callBack instanceof Function) {
                                        callBack();
                                    }
                                });
                            },
                            pageChange: function (oEvent) {
                                oController.processAction.call(oController, sectionID, sectionConfig.onPageChange, null, oEvent.getParameter("urlParams"));
                            },
                            onSetValues: function (oEvent) {
                                callBack = oEvent.getParameter("callBack");
                                oController.processAction.call(oController, sectionID, sectionConfig.onSetValues).then(function () {
                                    if (callBack && callBack instanceof Function) {
                                        callBack();
                                    }
                                });
                            },
                            onSetValuesApply: function () {
                                oController.processAction.call(oController, sectionID, sectionConfig.onSetValuesApply).then(function () {
                                    oController._setValuesAction = undefined;
                                });

                            },
                            onSetValuesClose: function () {
                                oController._setValuesAction = undefined;
                            },
                            onExport: function (oEvent) {
                                var object = oEvent.getParameter('action');
                                object['DARID'] = section['DARID'];
                                callBack = oEvent.getParameter("callBack");
                                oController.processAction.call(oController, sectionID, object, null).then(function () {
                                    if (callBack && callBack instanceof Function) {
                                        callBack();
                                    }
                                });
                            },
                            group: function (oEvent) {
                                oEvent.bPreventDefault = true;
                                tableRef.onColumnGroup(oEvent);
                                return false;
                            },
                            onQuickEntry: function (oEvent) {
                                oController.processAction.call(oController, sectionID, sectionConfig.onQuickEntryAction);
                            },
                            onMassEdit: function (oEvent) {
                                var urlParams = {};
                                urlParams['DATA'] = oEvent.getParameter("tableData");
                                oController.processAction.call(oController, sectionID, sectionConfig.onMassEditAction, {}, urlParams);
                            },
                            //*****Rel 60E_SP6 - QA #9410
                            onUpdate: function (oEvent) {
                                var callBack = oEvent.getParameter("callBack");
                                if (oEvent.getParameter("callFrom") === global.vui5.cons.updateCallFrom.personalization) {
                                    oController.updateChangedData(sectionID, null, null, null).then(function () {
                                        if (callBack && callBack instanceof Function) {
                                            callBack();
                                        }
                                    });
                                }
                                else {
                                    oController.updateChangedData(sectionID, null, null, global.vui5.cons.updateCallFrom.searchAndReplace);
                                }

                            }
                            //*****
                        });



                        tableRef.bindProperty("minAutoRowCount", {
                            path: oController.modelName + ">" + dataPath + section['DARID'] + "/",
                            formatter: function (data) {
                                return oController.determineMinRowCount(tableRef, data);
                            }
                        });

                        tableRef.bindProperty("enableGrouping", {
                            path: oController.modelName + ">" + dataPath + section['DARID'] + "/",
                            formatter: function (data) {
                                return data && data.length > 0;
                            }
                        })

                        tableRef.bindProperty("selectionMode", {
                            path: oController.modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.rowSelection,
                            formatter: function (rowSelection) {
                                var mode = rowSelection === 'X' ? sap.ui.table.SelectionMode.MultiToggle : sap.ui.table.SelectionMode.None;
                                if (mode === sap.ui.table.SelectionMode.MultiToggle) {
                                    this.attachRowSelectionChange(function (evt) {
                                        //var record = evt.getSource().getBindingContext(oController.modelName).getObject();
                                        if (evt.getParameter("rowContext")) {
                                            var path = evt.getParameter("rowContext").sPath;
                                            var record = oController.getCurrentModel().getProperty(path);
                                            oController.processAction.call(oController, sectionID, sectionConfig.onRowSelect, record)
                                        }

                                    });
                                }
                                return mode;
                            },
                            mode: sap.ui.model.BindingMode.OneWay
                        });
                    }

                    if (hasDrillDown) {
                        if (section['TBTYP'] === global.vui5.cons.tableType.responsive) {
                            tableRef.attachOnItemSelect(function (evt) {
                                oController.processAction.call(oController, sectionID, sectionConfig.onDrillDownAction, evt.getParameter('record'))
                            });

                        } else {
                            tableRef.attachOnDetailButton(function (evt) {
                                oController.processAction.call(oController, sectionID, sectionConfig.onDrillDownAction, evt.getParameter('record'))
                            });

                        }
                    } else {
                        if (section['TBTYP'] === global.vui5.cons.tableType.responsive) {
                            tableRef.attachOnItemSelect(function (evt) {
                                oController.processAction.call(oController, sectionID, sectionConfig.onRowSelect, evt.getParameter('record'))
                            });

                        } else {
                            tableRef.attachOnDetailButton(function (evt) {
                                oController.processAction.call(oController, sectionID, sectionConfig.onRowSelect, evt.getParameter('record'))
                            });
                        }
                    }

                    tableRef.processOnInputChange = function (oEvent) {
                        return oController.processOnInputChange(sectionID, oEvent);
                    };
                    //*****Rel 60E_SP6 - Task #39097
                    tableRef._onToggleButtonChange = function (oEvent) {
                        return oController._onToggleButtonChange(oEvent);
                    };
                    //*****

                    tableRef.preProcessFieldEvent = function (oEvent) {
                        return oController.preProcessFieldEvent(sectionID, oEvent);
                    };

                }
                else {

                    sap.ui.getCore().loadLibrary(vistexConfig.rootFolder + ".ui.widgets.VuiGrid", {
                        url: vistexConfig.uiResourcePath + "/" + vistexConfig.vuiGridLibraryVersion + "/" + vistexConfig.rootFolder + "/ui/widgets/VuiGrid"

                    });
                    var enableLocalSearch = sectionConfig.attributes[global.vui5.cons.attributes.enableLocalSearch] === 'X';
                    if (!global.vui5.ui.controls.VuiGrid &&
                        eval(vistexConfig.rootFolder + ".ui.widgets.VuiGrid.VuiGrid")) {
                        global.vui5.ui.controls.VuiGrid = eval(vistexConfig.rootFolder + ".ui.widgets.VuiGrid.VuiGrid");
                    }
                    oController.sectionRef[sectionID] = tableRef = new global.vui5.ui.controls.VuiGrid({
                        controller: oController,
                        modelName: oController.modelName,
                        dataPath: dataPath + section['DARID'] + "/",
                        dataAreaPath: sectionModelPath + "/DARID/",
                        fieldPath: sectionModelPath + "/FIELDS/",
                        hideVariantSave: !!sectionConfig.attributes[global.vui5.cons.attributes.hideVariantSave] ||
                            !sectionConfig.attributes[global.vui5.cons.attributes.enablePersonalization],
                        hideShare: !!sectionConfig.attributes[global.vui5.cons.attributes.hideShare],
                        // fieldGroupPath: sectionModelPath + "/FLGRP/",
                        enableLocalSearch: enableLocalSearch,
                        enablePersonalization: oController.getBindingExpression("enablePersonalization", section, index),
                        sectionID: sectionID,
                        selectedVariant: "/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.selectedVariant,
                        layoutDataPath: dataPath + section['DARID'] + global.vui5.cons.nodeName.layout + "/",
                        variantDataPath: dataPath + section['DARID'] + global.vui5.cons.nodeName.variant + "/",
                        handle: oController.getBindingExpression("handle", section, index),
                        pagingType: oController.getBindingExpression("pageType", section, index),
                        pageSize: oController.getBindingExpression("pageSize", section, index),
                        fullScreen: !oController._formDialog,
                        onFullScreen: function (oEvent) {
                            oController.processFullScreen(sectionID, oEvent.getParameter("fullScreen"));
                        },
                        variantSelect: function (oEvent) {
                            var callBack = oEvent.getParameter("callBack");
                            oController.processAction(sectionID, sectionConfig.onVariantSelect, oEvent.getParameter("record")).then(function () {
                                if (callBack && callBack instanceof Function) {
                                    callBack();

                                }
                            });
                        },
                        variantSave: function (oEvent) {
                            var callBack = oEvent.getParameter("callBack");
                            oController.processAction(sectionID, sectionConfig.onVariantMaintain, null, oEvent.getParameter("urlParams")).then(function () {
                                if (callBack && callBack instanceof Function) {
                                    callBack();

                                }
                            });
                        },
                        layoutManage: function (oEvent) {
                            var callBack = oEvent.getParameter("callBack");
                            oController.processAction(sectionID, sectionConfig.onLayoutManage).then(function (response) {
                                if (callBack && callBack instanceof Function) {
                                    callBack();
                                }
                            });
                        },
                        onExport: function (oEvent) {
                            var object = oEvent.getParameter('action');
                            object['DARID'] = section['DARID'];
                            var callBack = oEvent.getParameter("callBack");
                            oController.processAction.call(oController, sectionID, object, null, oEvent.getParameter("urlParams")).then(function () {
                                if (callBack && callBack instanceof Function) {
                                    callBack();
                                }
                            });
                        },

                        onModeChange: function (oEvent) {
                            var callBack = oEvent.getParameter("callBack");
                            oController.processAction.call(oController, sectionID, oEvent.getParameter('action'), null, oEvent.getParameter("urlParams"));

                        }
                    });
                }

                tableRef.bindProperty("disableExcelExport", {
                    parts: [{
                        path: oController.modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.disableExcelExport
                    },
                    { path: oController.modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.maxItems },
                    {
                        path: oController.modelName + ">" + dataPath + section['DARID'] + "/"
                    }
                    ],
                    formatter: function (disable, rowCount, data) {
                        if (disable) {
                            return true;
                        }
                        else if (parseInt(rowCount) == 0 && (data && data.length == 0)) {
                            return true;
                        }
                        else {
                            return false;
                        }

                    }
                })

                tableRef.attachOnFieldClick(function (evt) {
                    oController.preProcessFieldClickEvent(sectionID, evt);
                });
                oController.setSectionTitle(sectionModelFullPath + "/DESCR", oController.modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.maxItems, tableRef, section['DAPPT'], "",
                        oController.modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.displayedPages);
                tableRef.setModel(mainModel, global.vui5.modelName);
                tableRef.setModel(model, oController.modelName);
                if (section['TBTYP'] !== global.vui5.cons.tableType.grid) {
                    tableRef.prepareTable();
                    oController._prepareToolBarContent(sectionID, model.getProperty(sectionModelPath + "/FUNC"));
                }
                else
                    tableRef.onVuiGridInfocusSet();

            },
            /****/
            _processAttributes: function (cfg) {
                var oController = this, section, index, effectiveDatePath;
                var mainModel = oController.getModel(global.vui5.modelName);
                var model = oController.getModel(oController.modelName);
                var dmode = mainModel.getProperty("/DOCUMENT_MODE"), formRef, sectionID, sectionEditable;
                var sectionPath = oController._getPath(true);
                var dataPath = oController._getPath();

                section = cfg.section;
                index = cfg.index;
                sectionID = section['SECTN'];
                sectionEditable = (dmode !== global.vui5.cons.mode.display && section['DISOL'] === '');
                var sectionConfig = oController.sectionConfig[sectionID];

                if (section['PASCT'] == "") {
                    var headerSection = underscoreJS.findWhere(model.getProperty("/SECTN"), { "DATAR": "HD" });
                    effectiveDatePath = dataPath + headerSection['DARID'] + "/EFFFR";
                } else {
                    effectiveDatePath = dataPath + section['PASCT'] + "/EFFFR";
                }
                oController.handleSuggestionItemSelected = function () { };
                oController.attributeFieldname = sectionConfig.attributes[global.vui5.cons.attributes.attributeFieldName];

                formRef = oController.sectionRef[sectionID] = new global.vui5.ui.controls.Attributes({
                    controller: oController,
                    modelName: oController.modelName,
                    dropdownModelName: global.vui5.modelName,
                    sectionFieldPath: sectionPath + index + "/FLGRP/",
                    sectionDataPath: dataPath + section['DARID'] + "/",
                    fieldsPath: sectionPath + index + "/FIELDS/",
                    functionsPath: sectionPath + index + "/FUNC/",
                    effectiveDatePath: effectiveDatePath,
                    attributeFieldname: sectionConfig.attributes[global.vui5.cons.attributes.attributeFieldName],
                    showCurrentAttrVal: sectionConfig.attributes[global.vui5.cons.attributes.showCurrentAttrVal],
                    dataArea: section['DARID'],
                    sectionEditable: sectionEditable
                }).setModel(oController.getModel(oController.modelName), oController.modelName)
                    .setModel(oController.getModel(global.vui5.modelName), global.vui5.modelName);

                formRef.onValueHelpRequest = function (oEvent) {
                    oController.onValueHelpRequest(sectionID, oEvent);
                };

                formRef.handleSuggestionItemSelected = function (oEvent) {
                    oController.handleSuggestionItemSelected(oEvent);
                };

                formRef.dateFieldCheck = function (oEvent) {
                    oController.dateFieldCheck(oEvent);
                };

                formRef.prepareAttributeSwitchButton = function (oEvent, sectn) {
                    return oController._prepareAttributeSwitchButton(oEvent, sectn);
                };

                formRef.onCheckBoxSelect = function (oEvent) {
                    oController._onCheckBoxSelect(oEvent);
                };

                //*****Rel 60E_SP6 - Task #39097
                formRef._onToggleButtonChange = function (oEvent) {
                    return oController._onToggleButtonChange(oEvent);
                };
                //*****

                formRef.processOnInputChange = function (oEvent) {
                    return oController.processOnInputChange(sectionID, oEvent);
                };

                formRef.preProcessFieldEvent = function (oEvent) {
                    return oController.preProcessFieldEvent(sectionID, oEvent);
                };

                formRef.onDetailView = function (record) {
                    oController.processAction.call(oController, sectionID, sectionConfig.onDrillDownAction, record);
                };

                jQuery.sap.syncStyleClass(oController.getOwnerComponent().getContentDensityClass(), oController.getView(), formRef);
                formRef.prepareAttributesControl();
            },

            _prepareAttributeSwitchButton: function (object, sectionID) {
                var oController = this,
                    buttonConfig,
                    buttonType;
                var mainModel = oController.getModel(global.vui5.modelName);
                buttonType = sap.m.Switch;

                buttonConfig = {
                    change: oController.processAction.bind(oController, sectionID, object),
                    visible: "{= ${" + global.vui5.modelName + ">/DOCUMENT_MODE} === 'A' }",
                    state: oController._showAllAttributes,
                    tooltip: object['DESCR'],
                };
                return new buttonType(buttonConfig);
            }
            ,
            _processSets: function (cfg) {
                var oController = this,
                    section,
                    index,
                    sectionID,
                    dataArea,
                    sectionConfig,
                    setsRef;
                var mainModel = oController.getModel(global.vui5.modelName);
                var model = oController.getModel(oController.modelName);
                var dmode = mainModel.getProperty("/DOCUMENT_MODE"),
                    formRef,
                    sectionEditable;
                section = cfg.section;
                index = cfg.index;
                sectionID = section['SECTN'];
                dataArea = section['DATAR'];
                var dataPath = oController._getPath();
                sectionConfig = oController.sectionConfig[sectionID];
                if (sectionConfig.attributes[global.vui5.cons.attributes.onNodeSelect]) {
                    sectionConfig.onNodeSelect = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onNodeSelect]
                    });
                }
                setsRef = oController.sectionRef[sectionID] = new global.vui5.ui.controls.Sets({
                    controller: oController,
                    dataPath: dataPath + section['DARID'] + "/",
                    // dataPath: "/DATA/" + dataArea,
                    modelName: oController.modelName,
                    nodeSelect: "/SECCFG/" + sectionID + "/attributes/" + global.vui5.cons.attributes.rowSelection,
                    enableSearch: "/SECCFG/" + sectionID + "/attributes/" + global.vui5.cons.attributes.enableLocalSearch
                });
                setsRef.attachOnNodeSelect(function (evt) {
                    oController.processAction.call(oController, sectionID, sectionConfig.onNodeSelect, null, evt.getParameter('params'))
                });
                oController.sectionRef[sectionID].setModel(mainModel, global.vui5.modelName);
                oController.sectionRef[sectionID].setModel(model, oController.modelName);
                oController.sectionRef[sectionID]._processSetsData();
            },
            //*****Rel 60E_SP6
            _processHeatMap: function (cfg) {
                sap.ui.getCore().loadLibrary(vistexConfig.rootFolder + ".ui.availsWidgets.HeatMap", {
                    url: vistexConfig.uiResourcePath + "/" + vistexConfig.globalLibraryVersion + "/" + vistexConfig.rootFolder + "/ui/availsWidgets/HeatMap"
                });

                if (!global.vui5.ui.controls.HeatMapControl &&
                    eval(vistexConfig.rootFolder + ".ui.availsWidgets.HeatMap.HeatMapControl")) {
                    global.vui5.ui.controls.HeatMapControl = eval(vistexConfig.rootFolder + ".ui.availsWidgets.HeatMap.HeatMapControl");
                    global.vui5.ui.controls.HeatMap = eval(vistexConfig.rootFolder + ".ui.availsWidgets.HeatMap.HeatMap");
                    global.vui5.ui.controls.HeatMapCell = eval(vistexConfig.rootFolder + ".ui.availsWidgets.HeatMap.HeatMapCell");
                    global.vui5.ui.controls.HeatMapColumn = eval(vistexConfig.rootFolder + ".ui.availsWidgets.HeatMap.HeatMapColumn");
                    global.vui5.ui.controls.HeatMapRow = eval(vistexConfig.rootFolder + ".ui.availsWidgets.HeatMap.HeatMapRow");
                    global.vui5.ui.controls.HeatMapLegend = eval(vistexConfig.rootFolder + ".ui.availsWidgets.HeatMap.HeatMapLegend");
                }

                var oController = this, section, index, sectionID, dataArea, sectionModelPath, sectionConfig;
                var model = oController.getCurrentModel();
                var mainModel = oController.getModel(global.vui5.modelName);
                var sectionPath = oController._getPath(true);
                var dataPath = oController._getPath();
                section = cfg.section;
                index = cfg.index;
                sectionID = section['SECTN'];
                sectionConfig = oController.sectionConfig[sectionID];
                sectionModelPath = sectionPath + index;

                if (sectionConfig.attributes[global.vui5.cons.attributes.onDimensionChange]) {
                    sectionConfig.onDimensionChange = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onDimensionChange]
                    });
                }

                if (sectionConfig.attributes[global.vui5.cons.attributes.onCellClick]) {
                    sectionConfig.onCellClick = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onCellClick]
                    });
                }

                if (sectionConfig.attributes[global.vui5.cons.attributes.onDoubleClick]) {
                    sectionConfig.onDoubleClick = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onDoubleClick]
                    });
                }

                if (sectionConfig.attributes[global.vui5.cons.attributes.onLinkClick]) {
                    sectionConfig.onLinkClick = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onLinkClick]
                    });
                }

                if (sectionConfig.attributes[global.vui5.cons.attributes.onSwitchState]) {
                    sectionConfig.onSwitchState = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onSwitchState]
                    });
                }

                oController.sectionRef[section['SECTN']] = new global.vui5.ui.controls.HeatMapControl({
                    controller: oController,
                    modelName: oController.modelName,
                    columnPath: dataPath + section['DARID'] + "/VerticalAxis",
                    rowPath: dataPath + section['DARID'] + "/HorizontalAxis",
                    legendPath: dataPath + section['DARID'] + "/LEGEND",
                    filtersPath: dataPath + section['DARID'] + "/DIMENSIONS",
                    linksPath: dataPath + section['DARID'] + "/LINKS",
                    switchPath: dataPath + section['DARID'] + "/MODE",
                    currentLocationText: "/SECCFG/" + section['SECTN'] + "/attributes/currentLocation",
                    dimensionChange: function (oEvent) {
                        oController.processAction(sectionID, sectionConfig.onDimensionChange, null, oEvent.getParameter('params'));
                    },
                    cellClick: function (oEvent) {
                        oController.processAction(sectionID, sectionConfig.onCellClick, null, oEvent.getParameter('params'));
                    },
                    doubleClick: function (oEvent) {
                        oController.processAction(sectionID, sectionConfig.onDoubleClick, null, oEvent.getParameter('params'));
                    },
                    linkClick: function (oEvent) {
                        oController.processAction(sectionID, sectionConfig.onLinkClick, oEvent.getParameter("rowData"), null);
                    },
                    switchState: function (oEvent) {
                        oController.processAction(sectionID, sectionConfig.onSwitchState, null, oEvent.getParameter("state"));
                    },
                    onFullScreen: function (oEvent) {
                        oController.processFullScreen(sectionID, oEvent.getParameter("fullScreen"));
                    }
                });

                oController.sectionRef[section['SECTN']].setModel(mainModel, global.vui5.modelName);
                oController.sectionRef[section['SECTN']].setModel(model, oController.modelName);
                oController.sectionRef[section['SECTN']].onHeatMapInfocusSet();
                oController._prepareToolBarContent(sectionID, model.getProperty(sectionModelPath + "/FUNC"));
            },

            _processHierarchyTree: function (cfg) {
                sap.ui.getCore().loadLibrary(vistexConfig.rootFolder + ".ui.availsWidgets.HierarchyTree", {
                    url: vistexConfig.uiResourcePath + "/" + vistexConfig.globalLibraryVersion + "/" + vistexConfig.rootFolder + "/ui/availsWidgets/HierarchyTree"
                });

                if (!global.vui5.ui.controls.HierarchyTreeControl &&
                    eval(vistexConfig.rootFolder + ".ui.availsWidgets.HierarchyTree.HierarchyTreeControl")) {
                    global.vui5.ui.controls.HierarchyTreeControl = eval(vistexConfig.rootFolder + ".ui.availsWidgets.HierarchyTree.HierarchyTreeControl");
                    global.vui5.ui.controls.TreeTable = eval(vistexConfig.rootFolder + ".ui.availsWidgets.HierarchyTree.TreeTable");
                    global.vui5.ui.controls.TreeTableCell = eval(vistexConfig.rootFolder + ".ui.availsWidgets.HierarchyTree.TreeTableCell");
                    global.vui5.ui.controls.TreeTableColumn = eval(vistexConfig.rootFolder + ".ui.availsWidgets.HierarchyTree.TreeTableColumn");
                    global.vui5.ui.controls.TreeTableRow = eval(vistexConfig.rootFolder + ".ui.availsWidgets.HierarchyTree.TreeTableRow");
                }

                var oController = this, section, index, sectionID, dataArea, sectionModelPath, sectionConfig;
                var model = oController.getCurrentModel();
                var mainModel = oController.getModel(global.vui5.modelName);
                var sectionPath = oController._getPath(true);
                var dataPath = oController._getPath();
                section = cfg.section;
                index = cfg.index;
                sectionID = section['SECTN'];
                sectionConfig = oController.sectionConfig[sectionID];
                sectionModelPath = sectionPath + index;

                if (sectionConfig.attributes[global.vui5.cons.attributes.onCellExpand]) {
                    sectionConfig.onCellExpand = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onCellExpand]
                    });
                }

                if (sectionConfig.attributes[global.vui5.cons.attributes.onDetails]) {
                    sectionConfig.onDetails = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onDetails]
                    });
                }

                //*****Rel 60E_SP7
                if (sectionConfig.attributes[global.vui5.cons.attributes.onAvailabilityClick]) {
                    sectionConfig.onAvailabilityClick = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onAvailabilityClick]
                    });
                }
                //*****

                oController.sectionRef[section['SECTN']] = new global.vui5.ui.controls.HierarchyTreeControl({
                    controller: oController,
                    modelName: oController.modelName,
                    columnPath: dataPath + section['DARID'] + "/Columns",
                    rowPath: dataPath + section['DARID'] + "/Rows",
                    onCellExpand: function (oEvent) {
                        oController.processAction(sectionID, sectionConfig.onCellExpand, oEvent.getParameter("rowData"), oEvent.getParameter("params"));
                    },
                    onDetails: function (oEvent) {
                        oController.processAction(sectionID, sectionConfig.onDetails, oEvent.getParameter("rowData"), oEvent.getParameter("params"));
                    },
                    //*****Rel 60E_SP7
                    onAvailabilityClick: function (oEvent) {
                        oController.processAction(sectionID, sectionConfig.onAvailabilityClick, null, oEvent.getParameter("params"));
                    },
                    //*****
                    onFullScreen: function (oEvent) {
                        oController.processFullScreen(sectionID, oEvent.getParameter("fullScreen"));
                    }
                });

                oController.sectionRef[section['SECTN']].setModel(mainModel, global.vui5.modelName);
                oController.sectionRef[section['SECTN']].setModel(model, oController.modelName);
                oController.sectionRef[section['SECTN']].onHierarchyTreeInfocusSet();
            },

            _processAvailsHeader: function (cfg) {
                sap.ui.getCore().loadLibrary(vistexConfig.rootFolder + ".ui.availsWidgets.AvailsHeader", {
                    url: vistexConfig.uiResourcePath + "/" + vistexConfig.globalLibraryVersion + "/" + vistexConfig.rootFolder + "/ui/availsWidgets/AvailsHeader"
                });

                if (!global.vui5.ui.controls.AvailsHeaderControl &&
                    eval(vistexConfig.rootFolder + ".ui.availsWidgets.AvailsHeader.AvailsHeaderControl")) {
                    global.vui5.ui.controls.AvailsHeaderControl = eval(vistexConfig.rootFolder + ".ui.availsWidgets.AvailsHeader.AvailsHeaderControl");
                    global.vui5.ui.controls.DialogHeader = eval(vistexConfig.rootFolder + ".ui.availsWidgets.AvailsHeader.DialogHeader");
                    global.vui5.ui.controls.Availability = eval(vistexConfig.rootFolder + ".ui.availsWidgets.AvailsHeader.Availability");
                }

                var oController = this, section, index, sectionID, dataArea, sectionModelPath, sectionConfig;
                var model = oController.getCurrentModel();
                var mainModel = oController.getModel(global.vui5.modelName);
                var sectionPath = oController._getPath(true);
                var dataPath = oController._getPath();
                section = cfg.section;
                index = cfg.index;
                sectionID = section['SECTN'];
                sectionConfig = oController.sectionConfig[sectionID];
                sectionModelPath = sectionPath + index;

                oController.sectionRef[section['SECTN']] = new global.vui5.ui.controls.AvailsHeaderControl({
                    controller: oController,
                    modelName: oController.modelName,
                    dataPath: dataPath + section['DARID'],
                });

                oController.sectionRef[section['SECTN']].setModel(mainModel, global.vui5.modelName);
                oController.sectionRef[section['SECTN']].setModel(model, oController.modelName);
            },
            //*****

            _processDashBoard: function (cfg, workspace) {
                sap.ui.getCore().loadLibrary(vistexConfig.rootFolder + ".ui.widgets.Dashboard", {
                    url: vistexConfig.uiResourcePath + "/" + vistexConfig.dashboardLibraryVersion + "/" + vistexConfig.rootFolder + "/ui/widgets/Dashboard",

                });

                var oController = this, section, index, sectionID, dataArea, dashboard, sectionConfig, fullScreen = false, initialTab;
                //*****Rel 60E_SP7
                var version, dashboardConfig, urlPath, defaultBookMarkPath, dictionaries, versionValue;
                //*****   
                var bufferKey, filters;
                var mainModel = oController.getModel(global.vui5.modelName);
                var model = oController.getModel(oController.modelName);
                var dataPath = oController._getPath();
                var dmode = mainModel.getProperty("/DOCUMENT_MODE");
                if (cfg) {
                    fullScreen = true;
                    section = cfg.section;
                    index = cfg.index;
                    sectionID = section['SECTN'];
                    dataArea = section['DATAR'];
                    sectionConfig = oController.sectionConfig[sectionID];
                    if (sectionConfig.attributes[global.vui5.cons.attributes.onClick]) {
                        sectionConfig.onClick = underscoreJS.findWhere(section['FUNC'], {
                            FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onClick]
                        });
                    }
                    //*****Rel 60E_SP6
                    bufferKey = sectionID;
                    filters = dataPath + section['DARID'] + "/FILTERS";
                    initialTab = model.getProperty("/SECCFG/" + section['SECTN'] + "/attributes/initialTab");
                    //*****
                    //*****Rel 60E_SP7
                    version = "/SECCFG/" + section['SECTN'] + "/attributes/version";
                    dashboardConfig = dataPath + section['DARID'] + "/DASHBOARDCONFIG";
                    urlPath = dataPath + section['DARID'] + "/URL";
                    defaultBookMarkPath = dataPath + section['DARID'] + "/BOOKMARK";
                    dictionaries = dataPath + section['DARID'] + "/DICTIONARIES";
                    //*****
                }
                else {
                    //*****Rel 60E_SP7
                    model.setProperty("/DSHBD", mainModel.getProperty("/DSHBD"));
                    if (workspace) {
                        bufferKey = workspace['WRKSP'] + "_" + workspace['CONTR'];
                    }
                    else {
                        bufferKey = Math.random().toString().substring(2, 5);
                    }
                    filters = "/DSHBD/FILTERS";
                    initialTab = mainModel.getProperty("/DSHBD/TAB");
                    version = "/DSHBD/VERSION";
                    dashboardConfig = "/DSHBD/DASHBOARDCONFIG";
                    urlPath = "/DSHBD/URL";
                    defaultBookMarkPath = "/DSHBD/BOOKMARK";
                    dictionaries = "/DSHBD/DICTIONARIES";
                    //*****
                }

                versionValue = model.getProperty(version);

                if (versionValue === "V2") {
                    if (!global.vui5.ui.controls.DashboardV2 && eval(vistexConfig.rootFolder + ".ui.widgets.Dashboard.DashboardV2")) {
                        global.vui5.ui.controls.DashboardV2 = eval(vistexConfig.rootFolder + ".ui.widgets.Dashboard.DashboardV2");
                    }

                    oController.sectionRef[sectionID] = dashboard = new global.vui5.ui.controls.DashboardV2({
                        controller: oController,
                        jsonUrl: mainModel.getProperty("/DASHBOARD_URL"),
                        userId: mainModel.getProperty(global.vui5.cons.modelPath.sessionInfo + "/USERID"),
                        dashboardId: cfg ? section['DAQLF'] : mainModel.getProperty("/DASHBOARD_ID"),
                        fullScreen: fullScreen,
                        language: mainModel.getProperty(global.vui5.cons.modelPath.sessionInfo + "/SPRAS"),
                        clientId: mainModel.getProperty(global.vui5.cons.modelPath.sessionInfo + "/MANDT"),
                        modelName: oController.modelName,
                        version: version,
                        dashboardConfig: dashboardConfig,
                        urlPath: urlPath,
                        defaultBookMarkPath: defaultBookMarkPath,
                        onFullScreen: function (oEvent) {
                            oController.processFullScreen(sectionID, oEvent.getParameter("fullScreen"), true);
                        },
                        onBookmarkManage: function (oEvent) {
                            oController.processDashboardBookMarkManage(sectionID, oEvent);
                        }
                    });

                }
                else {
                    if (!global.vui5.ui.controls.Dashboard && eval(vistexConfig.rootFolder + ".ui.widgets.Dashboard.Dashboard")) {
                        global.vui5.ui.controls.Dashboard = eval(vistexConfig.rootFolder + ".ui.widgets.Dashboard.Dashboard");
                    }

                    oController.sectionRef[sectionID] = dashboard = new global.vui5.ui.controls.Dashboard({
                        controller: oController,
                        jsonUrl: mainModel.getProperty("/DASHBOARD_URL"),
                        userId: mainModel.getProperty(global.vui5.cons.modelPath.sessionInfo + "/USERID"),
                        dashboardId: cfg ? section['DAQLF'] : mainModel.getProperty("/DASHBOARD_ID"),
                        fullScreen: fullScreen,
                        initialTab: initialTab,
                        bufferKey: bufferKey,
                        dashboardBuffer: mainModel.getProperty("/DSHBD_BUFFER"),
                        filters: filters,
                        language: mainModel.getProperty(global.vui5.cons.modelPath.sessionInfo + "/SPRAS"),
                        clientId: mainModel.getProperty(global.vui5.cons.modelPath.sessionInfo + "/MANDT"),
                        modelName: oController.modelName,
                        version: version,
                        dictionariesPath: dictionaries,
                        onNavigate: function (oEvent) {
                            var cb = oEvent.getParameter('callBack');
                            if (cfg) {
                                oController.processAction(sectionID, sectionConfig.onClick, oEvent.getParameter("rowData"), oEvent.getParameter("params")).then(function (resp) {
                                    if (cb && cb instanceof Function) {
                                        cb(resp);
                                    }
                                });
                            }
                            else {
                                oController.processDashboardNavigation(oEvent.getParameter("params"), oEvent.getParameter("rowData")).then(function (resp) {
                                    if (cb && cb instanceof Function) {
                                        cb(resp);
                                    }
                                });
                            }
                        },
                        onFullScreen: function (oEvent) {
                            oController.processFullScreen(sectionID, oEvent.getParameter("fullScreen"), true);
                        }
                    });

                }

                oController.sectionRef[sectionID].setModel(mainModel, global.vui5.modelName);
                oController.sectionRef[sectionID].setModel(model, oController.modelName);
                oController.sectionRef[sectionID].onDashboardInfocusSet();
                // from launchpad
                if (!fullScreen || mainModel.getProperty("/FULLSCREEN")) {
                    oController.sectionRef[sectionID].renderDashboard();
                }

                return dashboard;
            },

            _processSynopsis: function (cfg) {
                sap.ui.getCore().loadLibrary(vistexConfig.rootFolder + ".ui.widgets.Synopsis", {
                    url: vistexConfig.uiResourcePath + "/" + vistexConfig.synopsisLibraryVersion + "/" + vistexConfig.rootFolder + "/ui/widgets/Synopsis"

                });

                if (!global.vui5.ui.controls.Synopsis &&
                    eval(vistexConfig.rootFolder + ".ui.widgets.Synopsis.Synopsis")) {
                    global.vui5.ui.controls.Synopsis = eval(vistexConfig.rootFolder + ".ui.widgets.Synopsis.Synopsis");
                }
                var oController = this, section, index, sectionID, dataArea, dashboard, sectionConfig, path,
                    fullScreen = false;
                var mainModel = oController.getModel(global.vui5.modelName);
                var model = oController.getModel(oController.modelName);
                var dataPath = oController._getPath();
                var dmode = mainModel.getProperty("/DOCUMENT_MODE");
                if (cfg) {
                    fullScreen = true;
                    section = cfg.section;
                    index = cfg.index;
                    sectionID = section['SECTN'];
                    dataArea = section['DATAR'];
                    sectionConfig = oController.sectionConfig[sectionID];
                    path = dataPath + section['DARID'] + "/";
                }
                oController.sectionRef[sectionID] = synopsis = new global.vui5.ui.controls.Synopsis({
                    controller: oController,
                    modelName: oController.modelName,
                    dataPath: path

                });
                oController.sectionRef[sectionID].setModel(mainModel, global.vui5.modelName);
                oController.sectionRef[sectionID].setModel(model, oController.modelName);
                oController.sectionRef[sectionID].renderSynopsis();

                return synopsis;
            },
            _processPdfViewer: function (cfg) {
                var oController = this, pdf_url, section, sectionID, dataArea, sectionConfig, pdfViewerRef;
                var mainModel = oController.getModel(global.vui5.modelName);
                var model = oController.getModel(oController.modelName);
                var dataPath = oController._getPath();
                pdfViewerRef = new sap.m.PDFViewer({
                    // title: "PDF Preview",
                    showDownloadButton: false
                });
                if (cfg.url) {
                    pdf_url = cfg.url;
                    pdfViewerRef.setProperty("source", pdf_url);

                    pdfViewerRef.open();
                    var oPopup = pdfViewerRef._objectsRegister.getPopup();
                    oPopup.setShowHeader(false);
                    oPopup.setStretch(true);
                    oPopup.addStyleClass("vuiDialog");
                }
                else {
                    section = cfg.section;
                    sectionID = section['SECTN'];
                    pdfViewerRef.bindProperty("source", oController.modelName + ">" + dataPath + section['DARID'] + "/", null, sap.ui.model.BindingMode.TwoWay);
                    oController.sectionRef[sectionID] = pdfViewerRef;

                }
                pdfViewerRef.setModel(mainModel, global.vui5.modelName);
                pdfViewerRef.setModel(model, oController.modelName);
            },
            _processTree: function (cfg) {
                var oController = this,
                    section,
                    index,
                    sectionID,
                    dataArea,
                    sectionConfig,
                    treeRef;
                var mainModel = oController.getModel(global.vui5.modelName);
                var model = oController.getModel(oController.modelName);
                var dmode = mainModel.getProperty("/DOCUMENT_MODE"),
                    formRef,
                    sectionEditable;
                section = cfg.section;
                index = cfg.index;
                sectionID = section['SECTN'];
                dataArea = section['DATAR'];
                sectionConfig = oController.sectionConfig[sectionID];
                if (sectionConfig.attributes[global.vui5.cons.attributes.onNodeSelect]) {
                    sectionConfig.onNodeSelect = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onNodeSelect]
                    });
                }
                treeRef = oController.sectionRef[sectionID] = new global.vui5.ui.controls.Tree({
                    controller: oController,
                    dataPath: "/DATA/" + dataArea + "/DATA",
                    titlePath: "/DATA/" + dataArea + "/TITLE",
                    modelName: oController.modelName,
                    dropDownPath: global.vui5.modelName + ">/DROPDOWNS/" + dataArea + "/",
                    //  parentKeyField :  "/SECCFG/" + sectionID +"/attributes/" + global.vui5.cons.attributes.parentKeyField,
                    // keyField :  "/SECCFG/" + sectionID + "/attributes/" + global.vui5.cons.attributes.keyField,
                    descriptionField: oController.getBindingExpression('descriptionField', section, index),
                    selectedField: oController.getBindingExpression('selectedField', section, index),
                    nodeSelect: "/SECCFG/" + sectionID + "/attributes/" + global.vui5.cons.attributes.nodeSelect,
                    enableSearch: "/SECCFG/" + sectionID + "/attributes/" + global.vui5.cons.attributes.enableLocalSearch
                });
                treeRef.attachOnNodeSelect(function (evt) {
                    oController.processAction.call(oController, sectionID, sectionConfig.onNodeSelect, null, evt.getParameter('params'))
                });
                oController.sectionRef[sectionID].setModel(mainModel, global.vui5.modelName);

                oController.sectionRef[sectionID].setModel(model, oController.modelName);
                oController.sectionRef[sectionID]._prepareTreeControl();
            }
            ,

            _prepareToolBarContent: function (sectionID, functions) {
                var oController = this,
                    oButtonControl,
                    sectionFunctions,
                    visible,
                    oType,
                    priority,
                    buttonType,
                    buttonConfig,
                    showIcon,
                    funcIndex;
                var mainModel = oController.getModel(global.vui5.modelName);
                var model = oController.getModel(oController.modelName);
                var dmode = mainModel.getProperty("/DOCUMENT_MODE");
                var path = oController._getPath(true);
                var section = oController.getSectionBy("SECTN", sectionID);
                var index = underscoreJS.findIndex(model.getProperty(path), {
                    SECTN: sectionID
                });

                sectionFunctions = underscoreJS.where(oController.functionRef, {
                    "SECTN": sectionID
                });
                underscoreJS.each(sectionFunctions, function (object) {
                    if (object && object['CONTROL']) {
                        oController.sectionRef[sectionID].removeToolBarButton(object['CONTROL']);
                    }
                });

                //*****Rel 60E_SP6
                if (mainModel.getProperty("/FULLSCREEN")) {
                    functions = underscoreJS.filter(functions, function (obj) {
                        if (obj['BTNTP'] !== global.vui5.cons.buttonType.segmentedButton) {
                            return obj;
                        }
                        //if (//obj['ACTYP'] != global.vui5.cons.actionType.pageNavigation &&
                        //obj['ACTYP'] != global.vui5.cons.actionType.drilldown &&
                        //obj['ACTYP'] != global.vui5.cons.actionType.refresh &&
                        //obj['ACTYP'] != global.vui5.cons.actionType.popup)
                        //  return obj;
                    });

                }
                //*****

                underscoreJS.each(functions, function (object) {
                    oButtonControl = oController._prepareButtonControl(object, sectionID, true);
                    if (oButtonControl) {
                        oController.sectionRef[sectionID].addToolBarButton(oButtonControl);

                        oController.functionRef.push({
                            "SECTN": sectionID,
                            "FNCNM": object['FNCNM'],
                            "CONTROL": oButtonControl
                        });
                    }
                });
                if (section['FILTER'] && section['FILTER'].length != 0) {

                    //if(section['FILTER'] == global.vui5.cons.fieldType.toolbar){
                    oButtonControl = oController.addFilterContent(section, true);
                    if (oButtonControl) {
                        oController.sectionRef[sectionID].addToolBarButton(oButtonControl, true);
                        oController.functionRef.push({
                            "SECTN": sectionID,
                            "FNCNM": "",
                            "CONTROL": oButtonControl
                        });
                    }

                    // }
                }

            }
            ,
            _processNotes: function (cfg) {
                var oController = this,
                    section,
                    index,
                    sectionID,
                    dataArea,
                    sectionConfig,
                    sectionPath,
                    dataPath,
                    sectionModelPath;
                var model = oController.getModel(oController.modelName);
                section = cfg.section;
                index = cfg.index;
                sectionID = section['SECTN'];

                var mainModel = oController.getModel(global.vui5.modelName);
                var dmode = mainModel.getProperty("/DOCUMENT_MODE");
                sectionPath = oController._getPath(true);
                dataPath = oController._getPath();
                sectionModelPath = sectionPath + index;
                var editable = (section['DISOL'] === '');
                sectionConfig = oController.sectionConfig[sectionID];
                if (sectionConfig.attributes[global.vui5.cons.attributes.onUpdateNote]) {
                    sectionConfig.onUpdateNote = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onUpdateNote]
                    });
                }
                oController.sectionRef[section['SECTN']] = new global.vui5.ui.controls.Notes({
                    controller: oController,
                    modelName: oController.modelName,
                    dataPath: dataPath + section['DARID'] + "/",
                    nauth: sectionModelPath + "/NAUTH",
                    notyp: section['DAQLF'],
                    updateNote: oController.processAction.bind(oController, sectionID, sectionConfig.onUpdateNote),
                    editable: editable
                    // editable: oController.getBindingExpression('noteEditable', section, index),
                });

                oController.sectionRef[sectionID].setModel(model, oController.modelName);


            }
            ,
            _processPostings: function (cfg) {

                var oController = this,
                    section,
                    index,
                    sectionID,
                    dataArea,
                    sectionConfig,
                    sectionPath,
                    dataPath,
                    sectionModelPath;
                var model = oController.getModel(oController.modelName);
                section = cfg.section;
                index = cfg.index;
                sectionID = section['SECTN'];
                dataArea = section['DATAR'];
                var mainModel = oController.getModel(global.vui5.modelName);
                var dmode = mainModel.getProperty("/DOCUMENT_MODE");
                var editable = (dmode !== global.vui5.cons.mode.display && section['DISOL'] === '');
                sectionConfig = oController.sectionConfig[sectionID];

                sectionPath = oController._getPath(true);
                dataPath = oController._getPath();
                sectionModelPath = sectionPath + index;
                if (sectionConfig.attributes[global.vui5.cons.attributes.onTriggerCreate]) {
                    sectionConfig.onTriggerSelect = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onTriggerCreate]
                    });
                }

                if (sectionConfig.attributes[global.vui5.cons.attributes.onPostingClick]) {
                    sectionConfig.onFlowSelect = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onPostingClick]
                    });
                }
                oController.sectionRef[section['SECTN']] = new global.vui5.ui.controls.Postings({
                    controller: oController,
                    modelName: oController.modelName,
                    dataPath: dataPath + section['DARID'] + "/",
                    enableTriggerCreate: "/SECCFG/" + section['SECTN'] + "/attributes/enableTriggerUndo",
                    postingCreate: function (oEvent) {
                        var aynum = oEvent.getParameters('aynum')['aynum'];
                        var data = {
                            'SECTN': sectionID,
                            'DATAR': dataArea,
                            'AYNUM': aynum
                        };
                        var oFunction = {
                            'ACTYP': "9",
                            'BTNTP': "",
                            'CFMSG': "",
                            'DESCR': "",
                            'FDTYP': "2",
                            'FNBVR': "",
                            'FNCTL': "1",
                            'FNDTP': "",
                            'FNICN': "",
                            'FNPPT': "",
                            'HIDFN': "X",
                            'MNITM': [],
                            'NXSCT': "",
                            'PAFUN': "",
                            'POSTN': "000",
                            'SECTN': "",
                            'SELTP': "",
                            'SFCHG': "X",
                            'SFCRT': "",
                            'SFDSP': "X",
                            'SVCFM': "",
                            'UILYT': "PL",
                            "FNCNM": "PSCRT",
                            "RQTYP": global.vui5.cons.reqTypeValue.post
                        };

                        oController.processAction.call(oController, sectionID, oFunction, null, data);


                    }
                });

                oController.sectionRef[sectionID].attachTriggerClick(function (evt) {
                    oController.preProcessFieldClickEvent(sectionID, evt);
                });

                oController.sectionRef[sectionID].postingInfocusSet();
                oController.sectionRef[sectionID].setModel(model, oController.modelName);

            },

            _processCalendar: function (cfg) {
                sap.ui.getCore().loadLibrary(vistexConfig.rootFolder + ".ui.widgets.Calendar", {
                    url: vistexConfig.uiResourcePath + "/" + vistexConfig.calendarLibraryVersion + "/" + vistexConfig.rootFolder + "/ui/widgets/Calendar"
                });

                if (!global.vui5.ui.controls.TradeCalendar &&
                    eval(vistexConfig.rootFolder + ".ui.widgets.Calendar.TradeCalendar")) {
                    global.vui5.ui.controls.TradeCalendar = eval(vistexConfig.rootFolder + ".ui.widgets.Calendar.TradeCalendar");
                }

                var oController = this,
                    section,
                    index,
                    sectionID,
                    dataArea,
                    sectionConfig,
                    sectionPath,
                    dataPath,
                    sectionModelPath;
                var model = oController.getModel(oController.modelName);
                section = cfg.section;
                index = cfg.index;
                sectionID = section['SECTN'];
                var mainModel = oController.getModel(global.vui5.modelName);
                var dmode = mainModel.getProperty("/DOCUMENT_MODE");
                sectionPath = oController._getPath(true);
                dataPath = oController._getPath();
                sectionModelPath = sectionPath + index;
                var editable = (dmode !== global.vui5.cons.mode.display && section['DISOL'] === '');
                //                sectionConfig = oController.sectionConfig[sectionID];
                var sectionConfig = oController.sectionConfig[sectionID] || {};
                var attributes = sectionConfig['attributes'] || {};
                for (var _attr in attributes) {
                    sectionConfig[_attr] = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: attributes[_attr]
                    });
                }
                oController.sectionRef[section['SECTN']] = new global.vui5.ui.controls.TradeCalendar({
                    controller: oController,
                    modelName: oController.modelName,
                    //                  onAddPress: function (obj) {
                    //                      var oControl = this;
                    //                      console.log(sectionID)
                    //                      var oFunction = underscoreJS.find(oControl.section.FUNC, {
                    //                          "FNCNM": "ADD"
                    //                      });
                    //                      oControl.getController().processAction(sectionID, oFunction, '');
                    //
                    //                  },
                    //                  onDeletePress: function (obj) {
                    //                      var oControl = this;
                    //                      console.log(sectionID)
                    //
                    //                      var selectedObjs = obj.getParameters().dataObj;
                    //                      var oFunction = underscoreJS.find(oControl.section.FUNC, {
                    //                          "FNCNM": "DELE"
                    //                      });
                    //                      oControl.getController().processAction(sectionID, oFunction, selectedObjs);
                    //
                    //
                    //                  },
                    //                  onAdditionalInfoPress: function (obj) {
                    //
                    //                      var oControl = this;
                    //                      console.log(sectionID)
                    //                      var selectedObj = obj.getParameters().dataObj;
                    //                      var oFunction = underscoreJS.find(oControl.section.FUNC, {
                    //                          "FNCNM": "DETAILS"
                    //                      });
                    //                      oControl.getController().processAction(sectionID, oFunction, selectedObj, {
                    //                          "CHARTID": selectedObj.CHARTID
                    //                      });
                    //
                    //                  },
                    //****Temp FIX
                    onViewChange: function () {
                        var oControl = this;
                        oControl.getController().processAction(sectionID, sectionConfig.gridview);
                    },
                    //******
                    dataPath: dataPath + section['DARID'] + "/",
                    sectionPath: sectionPath + index,
                    enableTriggerCreate: "/SECCFG/" + section['SECTN'] + "/attributes/enableTriggerUndo",
                });
                oController.section = section;
                oController.sectionRef[section['SECTN']].DataPrepare(oController, oController.section);
                oController.sectionRef[sectionID].setModel(model, oController.modelName);
            }
            ,

            _processProcessFlow: function (cfg) {
                var oController = this, section, index, sectionID, dataArea, sectionConfig, sectionPath,
                    sectionModelPath, dataPath;
                var model = oController.getModel(oController.modelName);
                section = cfg.section;
                index = cfg.index;
                sectionPath = oController._getPath(true);
                dataPath = oController._getPath();
                sectionModelPath = sectionPath + index;
                sectionID = section['SECTN'];
                var mainModel = oController.getModel(global.vui5.modelName);
                var dmode = mainModel.getProperty("/DOCUMENT_MODE");
                var editable = (dmode !== global.vui5.cons.mode.display && section['DISOL'] === '');
                sectionConfig = oController.sectionConfig[sectionID];

                if (sectionConfig.attributes[global.vui5.cons.attributes.onOutcomeSelect]) {
                    sectionConfig.onOutcomeSelect = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onOutcomeSelect]
                    });
                }

                if (sectionConfig.attributes[global.vui5.cons.attributes.onOutcomeUndo]) {
                    sectionConfig.onOutcomeUndo = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onOutcomeUndo]
                    });
                }

                oController.sectionRef[section['SECTN']] = new global.vui5.ui.controls.ProcessFlow({
                    controller: oController,
                    modelName: oController.modelName,
                    fieldPath: sectionModelPath + "/FIELDS",
                    dataPath: dataPath + section['DARID'] + "/",
                    editable: editable,
                    enableOutcomeUndo: "/SECCFG/" + section['SECTN'] + "/attributes/enableOutcomeUndo",
                    fullScreen: true,
                    outcomeUndo: function (oEvent) {
                        var cb = oEvent.getParameter('callBack');
                        oController.processAction(sectionID, sectionConfig.onOutcomeUndo).then(function (resp) {
                            if (cb && cb instanceof Function) {
                                cb(resp);
                            }
                        });
                    },
                    outcomeSelect: function (oEvent) {
                        var parameters = oEvent.getParameters();
                        var params = parameters[1]['record'];
                        var cb = parameters[0]['callBack'];
                        oController.processAction(sectionID, sectionConfig.onOutcomeSelect, params).then(function (resp) {
                            if (cb && cb instanceof Function) {
                                cb(resp);
                            }
                        });
                    },
                    onFullScreen: function (oEvent) {
                        oController.processFullScreen(sectionID, oEvent.getParameter("fullScreen"), true);
                    }
                });

                oController.sectionRef[sectionID].onProcessFlow();
                oController.sectionRef[sectionID].setModel(model, oController.modelName);

            },

            //*****Rel 60E_SP6
            processMessageDialog: function (response, action) {
                var oController = this;
                var dialogData = response[action['FNCNM']];

                var messageDialog = new global.vui5.ui.controls.MessageDialog({
                    dialogTitle: dialogData["dialogTitle"],
                    dialogState: dialogData["dialogState"],
                    dialogIcon: dialogData["dialogIcon"],
                    messages: dialogData["messages"]
                });
                this.getView().addDependent(messageDialog);
                messageDialog.open();
            },
            //*****

            _processStatus: function (cfg) {
                var oController = this,
                    section,
                    index,
                    sectionID,
                    dataArea,
                    sectionConfig,
                    sectionPath,
                    dataPath,
                    sectionModelPath,
                    //*****Rel 60E_SP6
                    enableActivityNav = false;
                //*****
                var model = oController.getModel(oController.modelName);
                section = cfg.section;
                index = cfg.index;
                sectionID = section['SECTN'];
                sectionPath = oController._getPath(true);
                dataPath = oController._getPath();
                sectionModelPath = sectionPath + index;
                var mainModel = oController.getModel(global.vui5.modelName);
                var dmode = mainModel.getProperty("/DOCUMENT_MODE");
                var editable = (dmode !== global.vui5.cons.mode.display && section['DISOL'] === '');
                sectionConfig = oController.sectionConfig[sectionID];

                if (sectionConfig.attributes[global.vui5.cons.attributes.onTriggerSelect]) {
                    sectionConfig.onTriggerSelect = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onTriggerSelect]
                    });
                }

                if (sectionConfig.attributes[global.vui5.cons.attributes.onFlowSelect]) {
                    sectionConfig.onFlowSelect = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onFlowSelect]
                    });
                }

                if (sectionConfig.attributes[global.vui5.cons.attributes.onOutcomeSelect]) {
                    sectionConfig.onOutcomeSelect = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onOutcomeSelect]
                    });
                }

                if (sectionConfig.attributes[global.vui5.cons.attributes.onTriggerUndo]) {
                    sectionConfig.onTriggerUndo = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onTriggerUndo]
                    });
                }

                if (sectionConfig.attributes[global.vui5.cons.attributes.onStepUndo]) {
                    sectionConfig.onStepUndo = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onStepUndo]
                    });
                }

                if (sectionConfig.attributes[global.vui5.cons.attributes.onStatusSet]) {
                    sectionConfig.onStatusSet = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onStatusSet]
                    });
                }

                if (sectionConfig.attributes[global.vui5.cons.attributes.onInactiveSet]) {
                    sectionConfig.onInactiveSet = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onInactiveSet]
                    });
                }
                //*****Rel 60E_SP6
                if (sectionConfig.attributes[global.vui5.cons.attributes.onActivityNavigate]) {
                    sectionConfig.onActivityNavigate = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onActivityNavigate]
                    });
                    if (sectionConfig.onActivityNavigate) {
                        enableActivityNav = true;
                    }
                }

                /*var layoutType = oController.getProfileInfo()['UILYT'];
                if (layoutType == vui5.cons.layoutType.tab && model.getProperty(dataPath + section['DARID'] + "/") && dataPath != "/POPUP_DATA/") {
                    model.setProperty(dataPath + section['DARID'] + "/", undefined);
                }*/
                //*****
                oController.sectionRef[section['SECTN']] = new global.vui5.ui.controls.Status({
                    controller: oController,
                    modelName: oController.modelName,
                    dataPath: dataPath + section['DARID'] + "/",
                    stblk: sectionModelPath + "/STBLK",
                    sfcat: sectionModelPath + "/FIELDS",
                    triggerText: "/SECCFG/" + section['SECTN'] + "/attributes/selectedTriggerText",
                    enableTriggerUndo: "/SECCFG/" + section['SECTN'] + "/attributes/enableTriggerUndo",
                    flowText: "/SECCFG/" + section['SECTN'] + "/attributes/selectedFlowText",
                    enableStepUndo: "/SECCFG/" + section['SECTN'] + "/attributes/enableStepUndo",
                    selectedFlow: "/SECCFG/" + section['SECTN'] + "/attributes/selectedFlow",
                    fullScreen: true,
                    //*****Rel 60E_SP6
                    enableActivityNav: enableActivityNav,
                    //*****
                    triggerSelect: function (oEvent) {
                        var parameters = oEvent.getParameters();
                        var params = parameters[1]['record'];
                        var cb = parameters[0]['callBack'];
                        oController.processAction(sectionID, sectionConfig.onTriggerSelect, params).then(function (resp) {
                            if (cb && cb instanceof Function) {
                                cb(resp);
                            }
                        });
                    },
                    flowSelect: function (oEvent) {
                        var parameters = oEvent.getParameters();
                        var params = parameters[1]['record'];
                        var cb = parameters[0]['callBack'];
                        oController.processAction(sectionID, sectionConfig.onFlowSelect, params).then(function (resp) {
                            if (cb && cb instanceof Function) {
                                cb(resp);
                            }
                        });
                    },
                    outcomeSelect: function (oEvent) {
                        var parameters = oEvent.getParameters();
                        var params = parameters[1]['record'];
                        var cb = parameters[0]['callBack'];
                        oController.processAction(sectionID, sectionConfig.onOutcomeSelect, params).then(function (resp) {
                            if (cb && cb instanceof Function) {
                                cb(resp);
                            }
                        });
                    },
                    triggerUndo: function (oEvent) {
                        var cb = oEvent.getParameter('callBack');
                        oController.processAction(sectionID, sectionConfig.onTriggerUndo).then(function (resp) {
                            if (cb && cb instanceof Function) {
                                cb(resp);
                            }
                        });
                    },
                    stepUndo: function (oEvent) {
                        var cb = oEvent.getParameter('callBack');
                        oController.processAction(sectionID, sectionConfig.onStepUndo).then(function (resp) {
                            if (cb && cb instanceof Function) {
                                cb(resp);
                            }
                        });
                    },
                    statusSet: function (oEvent) {
                        var params = oEvent.getParameter('record');
                        oController.processAction(sectionID, sectionConfig.onStatusSet, params);
                    },
                    inactiveSet: function (oEvent) {
                        var params = oEvent.getParameter('record');
                        oController.processAction(sectionID, sectionConfig.onInactiveSet, params);
                    },
                    //*****Rel 60E_SP6
                    activityNavigate: function (oEvent) {
                        var params = oEvent.getParameter('acnum');
                        oController.processAction(sectionID, sectionConfig.onActivityNavigate, null, params);
                    },
                    //*****
                    onFullScreen: function (oEvent) {
                        var promise = oController.processFullScreen(sectionID, oEvent.getParameter("fullScreen"), true).then(function () {
                            oController.sectionRef[section['SECTN']].updateModel();
                        });
                    },
                    editable: editable
                });

                oController.sectionRef[sectionID].statusInfocusSet();
                oController.sectionRef[sectionID].setModel(model, oController.modelName);
            }
            ,
            _processTexts: function (cfg) {
                var oController = this,
                    section,
                    index,
                    sectionID,
                    dataArea,
                    sectionConfig,
                    sectionPath,
                    dataPath,
                    sectionModelPath;

                var model = oController.getModel(oController.modelName);
                section = cfg.section;
                index = cfg.index;
                sectionID = section['SECTN'];

                sectionPath = oController._getPath(true);
                dataPath = oController._getPath();
                sectionModelPath = sectionPath + index;
                var mainModel = oController.getModel(global.vui5.modelName);
                sectionConfig = oController.sectionConfig[sectionID];
                if (sectionConfig.attributes[global.vui5.cons.attributes.onTextUpdate]) {
                    sectionConfig.onTextUpdate = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onTextUpdate]
                    });
                }

                if (sectionConfig.attributes[global.vui5.cons.attributes.onTabSelect]) {
                    sectionConfig.onTabSelect = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onTabSelect]
                    });
                }
                oController.sectionRef[section['SECTN']] = new global.vui5.ui.controls.Texts({
                    controller: oController,
                    modelName: oController.modelName,
                    dataPath: dataPath + section['DARID'] + "/",
                    textIdsPath: sectionModelPath + "/TXTID",
                    // selectedTextId: "{" + oController.modelName + ">/SECCFG/"
                    // + section['SECTN'] + "/attributes/selectedTextId}",
                    selectedTextId: "/SECCFG/" + section['SECTN'] + "/attributes/selectedTextID",
                    editable: oController.getBindingExpression('noteEditable', sectionID, index),
                    textUpdate: function (oEvent) {
                        var cb = oEvent.getParameter('callBack');
                        oController.processAction(sectionID, sectionConfig.onTextUpdate).then(function (resp) {
                            if (cb && cb instanceof Function) {
                                cb(resp);
                            }
                        });
                    },
                    tabSelect: function (oEvent) {
                        var params = oEvent.getParameter('filter');
                        oController.processAction(sectionID, sectionConfig.onTabSelect, params);
                    },
                });

                oController.sectionRef[sectionID].setModel(model, oController.modelName);

                oController.sectionRef[sectionID].onTextsInfocusSet();
            }
            ,
            _prepareExportColumns: function (config) {
                var oColumns = config.oColumns;
                var oGenerator = config.generator;
                var oContent = {
                    "content": [[]]
                };
                var exportColumns = [];

                underscoreJS.each(oColumns, function (obj) {
                    if (obj['ELTYP'] == global.vui5.cons.element.dropDown) {
                        exportColumns.push({
                            field: obj['FLDNAME'],
                            description: "",
                            eltyp: "C"
                        })
                    }
                    else if (obj['DATATYPE'] == global.vui5.cons.dataType.date) {
                        exportColumns.push({
                            field: obj['FLDNAME'],
                            description: "",
                            eltyp: "D"
                        })
                    }
                    else if (obj['DATATYPE'] == global.vui5.cons.dataType.amount || obj['DATATYPE'] == global.vui5.cons.dataType.quantity || obj['DATATYPE'] == global.vui5.cons.dataType.decimal ||
                        obj['DATATYPE'].substr(0, 3) == global.vui5.cons.dataType.integer ||
                        obj['SDSCR'] == global.vui5.cons.fieldValue.description ||
                        obj['SDSCR'] == global.vui5.cons.fieldValue.value_cont_descr) {
                        if (obj['TXTFL']) {
                            exportColumns.push({
                                field: obj['TXTFL'],
                                description: ""
                            })
                        }
                        else {
                            exportColumns.push({
                                field: obj['FLDNAME'],
                                description: "",
                                eltyp: "P",
                                decimals: obj['DECIMALS']
                            })
                        }

                    }
                    else if (obj['DATATYPE'] == global.vui5.cons.dataType.time ||
                        obj['SDSCR'] == global.vui5.cons.fieldValue.value ||
                        obj['SDSCR'] == global.vui5.cons.fieldValue.value_descr) {
                        exportColumns.push({
                            field: obj['FLDNAME'],
                            description: ""
                        })
                    }


                })

                /*
                 * Iterate the Columns array and add the first row to the excel file for the columns
                 */

                for (var i = 0; i < oColumns.length; i++) {
                    oContent.content[0].push(oColumns[i].LABEL);
                }

                oGenerator.write(oContent);

                return exportColumns;
            }
            ,
            _processExport: function (details) {
                sap.ui.core.BusyIndicator.show(0);
                var that = this, oController, oModel, oColumns, oRows, darid, drpdowns, sectionID, section,
                    oContent,
                    editable, exp, oContent;
                oController = this;
                oModel = oController.getModel(oController.modelName);
                mainModel = oController.getMainModel();
                var columns = [];
                if (details.table) {
                    oColumns = oModel.getProperty(details.table.getFieldPath());
                    editable = details.table.getEditable();
                    sectionID = details.table.getSectionID();
                    section = oController.getSectionBy('SECTN', sectionID);
                    darid = section['DARID']
                    drpdowns = this.getModel(global.vui5.modelName).getProperty("/DROPDOWNS/" + darid + "/");
                    if (details.table._columnItems && details.table._columnItems.length != 0) {
                        var visibleColumnItems = underscoreJS.where(details.table._columnItems, { VISIBLE: true });
                        columns = oController._getColumnsToDownload({
                            oColumns: oColumns,
                            visibleColumnItems: visibleColumnItems
                        });

                    } else {
                        var visibleColumns = underscoreJS.filter(oColumns, function (obj) {
                            // editable ? exp = obj['NO_OUT'] === "" : exp = (obj['NO_OUT'] === "" && obj['ADFLD'] === "");
                            if (obj['NO_OUT'] != "X" && obj['ADFLD'] != "X")
                                return obj;
                        });
                        if (visibleColumns)
                            columns = oController._getColumnsToDownload({
                                oColumns: oColumns,
                                visibleColumns: visibleColumns
                            });

                    }
                    oColumns = columns;
                    this.tabRef = details.table;
                }
                if (!details.fromServer && details.table) {
                    oRows = oModel.getProperty(details.table.getDataPath());
                }
                else {
                    oRows = oModel.getProperty("/EXCEL_DATA");
                }
                if (!oRows || oRows.length == 0) {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show(oController._getBundleText('NoDataToImport'));
                    return;
                }


                this.oGenerator = new ExcelPlus();
                this.oGenerator.createFile("export");


                if (oColumns && oColumns.length != 0) {
                    var exportColumns = oController._prepareExportColumns({
                        oColumns: oColumns,
                        generator: this.oGenerator
                    })
                }
                /*
                 * Start adding the rows to the excel file
                 */
                var index = 0;
                //
                /*** Rel 60E SP6 - Performance Changes for Export - Start ***/
                jQuery.sap.delayedCall(0, that, function () {
                    while (index < oRows.length) {
                        oContent = [];
                        if (exportColumns) {

                            underscoreJS.each(exportColumns, function (obj) {
                                var fldname = obj['field'];
                                var desc = obj['description'];
                                var eltyp = obj['eltyp'];
                                var value = oRows[index][fldname];
                                if (eltyp == "C") {
                                    var drpdownData = drpdowns ? drpdowns[fldname] : undefined;
                                    value = Formatter.dropdownDescriptionGet(value, drpdownData);
                                }
                                else if (eltyp == "D") {
                                    value = Formatter.dateFormat(value, that.tabRef);
                                }
                                else if (eltyp == "P") {
                                    /*If value is '100' it should display as '100.00' if its decimals are '000002'.
                                    These changes are to support this scenario in excel download and Totals*/
                                    //value = this.convertValueToUserFormat(value);
                                    value = this.convertValueToUserFormat(value, obj['decimals']);
                                    /**/
                                }
                                oContent.push(value);

                            }, that)

                            that.oGenerator.writeRow(index + 2, oContent);

                        }
                        else {

                            oContent = oRows[index].split("\t");

                            that.oGenerator.writeRow(index + 1, oContent);
                        }

                        index++;

                        if (index >= oRows.length) {
                            sap.ui.core.BusyIndicator.hide();
                            that.oGenerator.saveAs(details.fileName ? details.fileName : section['DESCR']);
                        }
                    }

                });

                /*this.intervalId = jQuery.sap.intervalCall(1, null, function () {
            
                    oContent = [];
                    if (exportColumns) {
            
                        underscoreJS.each(exportColumns, function (obj) {
                            var fldname = obj['field'];
                            var desc = obj['description'];
                            var eltyp = obj['eltyp'];
                            var value = oRows[index][fldname];
                            if (eltyp == "C") {
                                var drpdownData = drpdowns ? drpdowns[fldname] : undefined;
                                value = Formatter.dropdownDescriptionGet(value, drpdownData);
                            }
                            else if (eltyp == "D") {
                                value = Formatter.dateFormat(value, that.tabRef);
                            }
                            oContent.push(value);
            
                        }, that)
            
                        that.oGenerator.writeRow(index + 2, oContent);
            
                    }
                    else {
            
                        oContent = oRows[index].split("\t");
            
                        that.oGenerator.writeRow(index + 1, oContent);
                    }
            
                    index++;
            
                    if (index >= oRows.length) {
                        jQuery.sap.clearIntervalCall(that.intervalId);
                        sap.ui.core.BusyIndicator.hide();
                        that.oGenerator.saveAs(details.fileName ? details.fileName : section['DESCR']);
                    }
                }, this);*/
                /*** Rel 60E SP6 - Performance Changes for Export - End ***/
            }
            ,
            _getColumnsToDownload: function (params) {
                var oColumns = params['oColumns'],
                    visibleColumnItems = params['visibleColumnItems'],
                    visibleColumns = params['visibleColumns'];
                var columns = [], columnsToDownload = [];
                if (visibleColumnItems)
                    columns = visibleColumnItems;
                else
                    columns = visibleColumns;

                for (var i in columns) {
                    var column;
                    if (visibleColumnItems) {
                        var key = columns[i]['COLUMNKEY'];
                        column = underscoreJS.find(oColumns, { FLDNAME: key });
                    }
                    else {
                        column = columns[i];
                    }

                    if (column) {
                        columnsToDownload.push(column);
                        if (column['CFIELDNAME'] || column['QFIELDNAME']) {
                            var fldname = column['CFIELDNAME'] || column['QFIELDNAME'];
                            var adjfld = underscoreJS.find(oColumns, { FLDNAME: fldname });
                            if (adjfld && adjfld['ADFLD'] == "X") {
                                columnsToDownload.push(adjfld);
                            }

                        }
                    }

                }
                return columnsToDownload;

            },

            _processEvaluationForm: function (cfg) {
                var oController = this,
                    section,
                    index,
                    sectionID,
                    dataArea,
                    sectionConfig,
                    sectionPath,
                    dataPath,
                    sectionModelPath;

                var model = oController.getModel(oController.modelName);
                section = cfg.section;
                index = cfg.index;
                sectionID = section['SECTN'];
                sectionPath = oController._getPath(true);
                dataPath = oController._getPath();
                sectionModelPath = sectionPath + index;
                var mainModel = oController.getModel(global.vui5.modelName);
                var dmode = mainModel.getProperty("/DOCUMENT_MODE");
                var editable = (dmode !== global.vui5.cons.mode.display && section['DISOL'] === '');
                sectionConfig = oController.sectionConfig[sectionID];

                if (sectionConfig.attributes[global.vui5.cons.attributes.gridElementKeyAdd]) {
                    sectionConfig.gridElementKeyAdd = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.gridElementKeyAdd]
                    });
                }

                if (sectionConfig.attributes[global.vui5.cons.attributes.onReevaluate]) {
                    sectionConfig.onReevaluate = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onReevaluate]
                    });
                }

                if (sectionConfig.attributes[global.vui5.cons.attributes.onButtonProcess]) {
                    sectionConfig.onButtonProcess = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onButtonProcess]
                    });
                }

                if (sectionConfig.attributes[global.vui5.cons.attributes.onHyperLinkNav]) {
                    sectionConfig.onHyperLinkNav = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onHyperLinkNav]
                    });
                }

                oController.sectionRef[section['SECTN']] = new global.vui5.ui.controls.EvaluationForm({
                    controller: oController,
                    modelName: oController.modelName,
                    sectionId: sectionID,
                    dataPath: dataPath + section['DARID'],
                    tmphdr: sectionModelPath + "/EVFORM/EVTPHDR",
                    tmpae: sectionModelPath + "/EVFORM/EVTPAE",
                    elements: sectionModelPath + "/EVFORM/EVELMS",
                    subelements: sectionModelPath + "/EVFORM/EVSUBELMS",
                    fullScreen: true,
                    gridElementKeyAdd: function (oEvent) {
                        var params = oEvent.getParameter("params");
                        oController.processAction(sectionID, sectionConfig.gridElementKeyAdd, null, params);
                    },
                    onReevaluate: function (oEvent) {
                        oController.processAction(sectionID, sectionConfig.onReevaluate);
                    },
                    onButtonProcess: function (oEvent) {
                        var params = oEvent.getParameter('params');
                        oController.processAction(sectionID, sectionConfig.onButtonProcess, null, params);
                    },
                    hyperLinkNav: function (oEvent) {
                        var params = oEvent.getParameter('params');
                        oController.processAction(sectionID, sectionConfig.onHyperLinkNav, null, params);
                    },
                    fieldEvent: oController.preProcessFieldEvent.bind(oController, sectionID),
                    onValueHelpRequest: function (oEvent) {
                        oController.onValueHelpRequest(sectionID, oEvent);
                    },
                    onFullScreen: function (oEvent) {
                        oController.processFullScreen(sectionID, oEvent.getParameter("fullScreen"), true);
                    }
                });

                oController.sectionRef[sectionID].evaluationFormPrepare();
                oController.sectionRef[sectionID].setModel(model, oController.modelName);
            }
            ,

            _processList: function (cfg) {
                var oController = this,
                    section,
                    index,
                    sectionID,
                    hasDrillDown,
                    oListItemType,
                    sectionConfig,
                    sectionPath,
                    dataPath,
                    sectionModelPath,
                    titlePath,
                    listCountPath;

                var model = oController.getModel(oController.modelName);
                var mainModel = oController.getModel(global.vui5.modelName);
                section = cfg.section;
                index = cfg.index;
                sectionID = section['SECTN'];
                sectionPath = oController._getPath(true);
                dataPath = oController._getPath();
                sectionModelPath = sectionPath + index;
                sectionConfig = oController.sectionConfig[sectionID];
                sectionModelFullPath = oController.modelName + ">" + sectionModelPath;
                titlePath = sectionModelFullPath + "/DESCR";
                listCountPath = oController.modelName + ">/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.maxItems;
                hasDrillDown = !!sectionConfig.onDrillDownAction;
                oListItemType = hasDrillDown ? sap.m.ListType.Navigation : sap.m.ListType.Active;
                oController.sectionRef[section['SECTN']] = new global.vui5.ui.controls.List({
                    controller: oController,
                    modelName: oController.modelName,
                    listMode: oListItemType,
                    listTitle: sectionModelFullPath + "/DESCR",
                    dataPath: dataPath + section['DARID'] + "/",
                    fieldsPath: sectionModelPath + "/FIELDS/",
                    title: oController.getBindingExpression("listTitle", section, index),
                    listCount: "/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.maxItems,
                    description: oController.getBindingExpression("description", section, index),
                    icon: oController.getBindingExpression("iconField", section, index),
                    counter: oController.getBindingExpression("counter", section, index),
                });
                oController.sectionRef[sectionID].setModel(model, oController.modelName);

                oController.sectionRef[section['SECTN']].listPrepare();
                if (hasDrillDown) {
                    oController.sectionRef[section['SECTN']].attachOnItemSelect(function (evt) {
                        oController.processAction.call(oController, sectionID, sectionConfig.onDrillDownAction, evt.getParameter('record'))
                    })
                }
                if (!((oController.getProfileInfo()['UILYT'] === global.vui5.cons.layoutType.line && oController.getProfileInfo()['UITYP'] !== global.vui5.cons.UIType.worklist) ||
                    (oController.getProfileInfo()['UILYT'] === global.vui5.cons.layoutType.pageWithTabs && section && section['SCGRP']))) {
                    oController.setSectionTitle(titlePath, listCountPath, oController.sectionRef[section['SECTN']].getAggregation("_getListControl"), section['DAPPT'])
                }
                // else{
                // oController.sectionRef[section['SECTN']].attachOnItemSelect(function(evt)
                // {
                // oController.processAction.call(oController, sectionID,
                // sectionConfig.onRowSelect, evt.getParameter('record'))
                // })
                // }
            }
            ,

            _processHtml: function (cfg) {
                var oController = this,
                    section,
                    sectionID,
                    htmlRef;
                var model = oController.getModel(oController.modelName);
                var mainModel = oController.getModel(global.vui5.modelName);
                section = cfg.section;
                sectionID = section['SECTN'];
                var path = oController._getPath();
                dataPath = path + section['DARID'] + "/";
                htmlRef = oController.sectionRef[section['SECTN']] = new sap.ui.core.HTML({
                    content: {
                        path: oController.modelName + ">" + dataPath,
                        formatter: function (data) {
                            if (data) {
                                var div = "<div>" + data + "</div>";
                                return div;
                            }

                        },
                        mode: sap.ui.model.BindingMode.OneWay
                    }
                });
                htmlRef.setPreferDOM(false);
                // oController.sectionRef[section['SECTN']] = new sap.ui.core.HTML().bindProperty('content',oController.modelName + ">" + dataPath,null,sap.ui.model.BindingMode.TwoWay)
                oController.sectionRef[sectionID].setModel(model, oController.modelName);

            },

            _processSummary: function (cfg) {
                sap.ui.getCore().loadLibrary(vistexConfig.rootFolder + ".ui.widgets.Summaries", {
                    url: vistexConfig.uiResourcePath + "/" + vistexConfig.summaryLibraryVersion + "/" + vistexConfig.rootFolder + "/ui/widgets/Summaries"
                });


                var oController = this,
                    section,
                    index,
                    sectionID,
                    dataArea,
                    sectionConfig,
                    sectionPath,
                    dataPath,
                    sectionModelPath;
                var model = oController.getModel(oController.modelName);
                section = cfg.section;
                index = cfg.index;
                sectionID = section['SECTN'];
                sectionPath = oController._getPath(true);
                dataPath = oController._getPath();
                sectionModelPath = sectionPath + index;
                var mainModel = oController.getModel(global.vui5.modelName);
                var dmode = mainModel.getProperty("/DOCUMENT_MODE");
                var editable = (dmode !== global.vui5.cons.mode.display && section['DISOL'] === '');
                sectionConfig = oController.sectionConfig[sectionID];

                /*jQuery.sap.require("globalUtilsPath" + "/Controls/VuiReportingView");
            oController.sectionRef[section['SECTN']] = new vistex.utility.ReportingView({
            sectionId: sectionID,
            controller: oController,
            modelName: oController.modelName,
            chartDetailsPath: sectionModelPath + "/SUMDATA/",
            chartDataPath: dataPath,
            selectedVariant: "/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.selectedVariant,
            editable: editable, variantSelect: function(oEvent) {
                callBack = oEvent.getParameter("callBack");
                oController.processAction.call(oController, sectionID, sectionConfig.onVariantSelect, oEvent.getParameter("record")).then(function() {
                    if (callBack && callBack instanceof Function) {
                        callBack();
                    }
                });
            },
            variantSave: function(oEvent) {
                callBack = oEvent.getParameter("callBack");
                oController.processAction.call(oController, sectionID, sectionConfig.onVariantMaintain, null, oEvent.getParameter("urlParams")).then(function() {
                    if (callBack && callBack instanceof Function) {
                        callBack();
                    }
                });
            },
            layoutManage: function(oEvent) {
                callBack = oEvent.getParameter("callBack");
                oController.processAction.call(oController, sectionID, sectionConfig.onLayoutManage).then(function() {
                    if (callBack && callBack instanceof Function) {
                        callBack();
                    }
                });
            },
            });*/

                if (!global.vui5.ui.controls.SummaryView &&
                    eval(vistexConfig.rootFolder + ".ui.widgets.Summaries.SummaryView")) {
                    global.vui5.ui.controls.SummaryView = eval(vistexConfig.rootFolder + ".ui.widgets.Summaries.SummaryView");
                    global.vui5.ui.controls.ViziChart = eval(vistexConfig.rootFolder + ".ui.widgets.Summaries.ViziChart");
                }

                oController.sectionRef[section['SECTN']] = new global.vui5.ui.controls.SummaryView({
                    sectionId: sectionID,
                    //*****Rel 60E_SP6
                    darid: section['DARID'],
                    sectionFunctionsPath: sectionPath + index + "/FUNC/",
                    //*****
                    controller: oController,
                    modelName: oController.modelName,
                    chartDetailsPath: sectionModelPath + "/SUMDATA/",
                    chartDataPath: dataPath
                });

                //*****Rel 60E_SP6
                oController.sectionRef[sectionID]._prepareButtonControl = function (object, sectionID, fromToolBar) {
                    return oController._prepareButtonControl(object, sectionID, fromToolBar)
                };
                //*****

                oController.sectionRef[section['SECTN']].renderSummaryView();
                // oController.sectionRef[section['SECTN']].chartObjectGet();
                oController.sectionRef[sectionID].setModel(model, oController.modelName);
            },
            _processPartners: function (cfg) {

                var oController = this,
                    section,
                    index,
                    sectionID,
                    dataArea,
                    sectionConfig,
                    sectionPath,
                    dataPath,
                    sectionModelPath,
                    sectionModelFullPath;

                var model = oController.getModel(oController.modelName);
                section = cfg.section;
                index = cfg.index;
                sectionID = section['SECTN'];
                sectionPath = oController._getPath(true);
                dataPath = oController._getPath();
                sectionModelPath = sectionPath + index;
                sectionModelFullPath = oController.modelName + ">" + sectionModelPath;
                var mainModel = oController.getModel(global.vui5.modelName);
                var dmode = mainModel.getProperty("/DOCUMENT_MODE");
                var editable = (dmode !== global.vui5.cons.mode.display && section['DISOL'] === '');
                sectionConfig = oController.sectionConfig[sectionID];

                if (sectionConfig.attributes[global.vui5.cons.attributes.onPartnerUpdate]) {
                    sectionConfig.onPartnerUpdate = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onPartnerUpdate]
                    });
                }

                if (sectionConfig.attributes[global.vui5.cons.attributes.onPartnerDelete]) {
                    sectionConfig.onPartnerDelete = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onPartnerDelete]
                    });
                }

                if (sectionConfig.attributes[global.vui5.cons.attributes.onPartnerFunctionChange]) {
                    sectionConfig.onPartnerFunctionChange = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onPartnerFunctionChange]
                    });
                }

                if (sectionConfig.attributes[global.vui5.cons.attributes.onFilterSelect]) {
                    sectionConfig.onFilterSelect = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onFilterSelect]
                    });
                }

                var sfatr = model.getProperty(sectionModelPath + "/FILTER/0/SFATR");
                oController.sectionRef[section['SECTN']] = new global.vui5.ui.controls.Partners({
                    controller: oController,
                    modelName: oController.modelName,
                    dataPath: dataPath + section['DARID'] + "/",
                    ptrflds: sectionModelPath + "/FIELDS",
                    // ptrdata: "/SECTN/" + index + "/PTRDATA",
                    selectedFilter: "/SECCFG/" + section['SECTN'] + "/attributes/" + sfatr,
                    partnerUpdate: function (oEvent) {
                        var cb = oEvent.getParameter('callBack');
                        oController.processAction(sectionID, sectionConfig.onPartnerUpdate).then(function (resp) {
                            if (cb && cb instanceof Function) {
                                cb(resp);
                            }
                        });
                    },
                    partnerDelete: function (oEvent) {
                        var params = oEvent.getParameter('record');
                        oController.processAction(sectionID, sectionConfig.onPartnerDelete, params);
                    },
                    filterSelect: function (oEvent) {
                        var parameters = oEvent.getParameters();
                        var params = parameters[0]['filter'];
                        var cb = parameters[1]['callBack'];
                        oController.processAction(sectionID, sectionConfig.onFilterSelect, params).then(function (resp) {
                            if (cb && cb instanceof Function) {
                                cb(resp);
                            }
                        });
                    },
                    partnerFunctionChange: function (oEvent) {
                        oController._partnerFunctionChange(sectionID, sectionConfig.onPartnerFunctionChange, oEvent);
                    },
                    fieldEvent: oController.preProcessFieldEvent.bind(oController, sectionID),
                    onValueHelpRequest: function (oEvent) {
                        oController.onValueHelpRequest(sectionID, oEvent);
                    },
                    editable: editable,
                    messagesShow: function (oEvent) {
                        var messages = oEvent.getParameter("MESSAGES");
                        oController._messagesPrepare(messages);
                    }
                });
                oController.setSectionTitle(sectionModelFullPath + "/DESCR", oController.modelName + ">" + dataPath + section['DARID'] + "/", oController.sectionRef[section['SECTN']], section['DAPPT']);
                oController.sectionRef[sectionID].partnerInfocusSet();
                oController.sectionRef[sectionID].setModel(model, oController.modelName);
            }
            ,
            _partnerFunctionChange: function (sectionID, action, oEvent) {
                var oController = this;
                var model = oController.getModel(oController.modelName);
                var parvw = oEvent.getParameters()[0]['parvw'];
                var path = oEvent.getParameters()[1]['path'];
                var objDefer = $.Deferred();
                var params = {},
                    promise;

                params['PARVW'] = parvw;
                promise = oController.processFieldEvent(sectionID, action, params);
                if (promise && promise.then) {
                    promise.then(function (response) {
                        model.setProperty(path + "/SHLPNAME", response['SHLPNAME']);
                        model.setProperty(path + "/FIELDNAME", response['FIELDNAME']);
                        objDefer.resolve(response);
                    });
                }

            }
            ,
            _processAttachments: function (cfg) {
                var oController = this,
                    section,
                    index,
                    sectionID,
                    dataArea,
                    sectionConfig,
                    variantSectionConfig,
                    variantSection,
                    sectionPath,
                    dataPath,
                    sectionModelPath;

                var model = oController.getModel(oController.modelName);
                section = cfg.section;
                index = cfg.index;
                sectionID = section['SECTN'];
                dataArea = section['DATAR'];
                sectionPath = oController._getPath(true);
                dataPath = oController._getPath();
                sectionModelPath = sectionPath + index;
                sectionConfig = oController.sectionConfig[sectionID];

                /* Process Attributes */
                if (sectionConfig.attributes[global.vui5.cons.attributes.onUpload]) {
                    sectionConfig.onUpload = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onUpload]
                    });
                }
                if (sectionConfig.attributes[global.vui5.cons.attributes.onReplace]) {
                    sectionConfig.onReplace = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onReplace]
                    });
                }
                if (sectionConfig.attributes[global.vui5.cons.attributes.onDelete]) {
                    sectionConfig.onDelete = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onDelete]
                    });
                }
                if (sectionConfig.attributes[global.vui5.cons.attributes.onRename]) {
                    sectionConfig.onRename = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onRename]
                    });
                }
                if (sectionConfig.attributes[global.vui5.cons.attributes.onDownload]) {
                    sectionConfig.onDownload = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onDownload]
                    });
                }
                //

                /* Prepare Element */

                oController.sectionRef[sectionID] = new global.vui5.ui.controls.Attachments({
                    controller: oController,
                    modelName: oController.modelName,
                    sectionPath: sectionPath + index,
                    dataPath: dataPath + section['DARID'] + "/",
                    mimtp: "/DROPDOWNS/" + section['DARID'] + "/MIMTP",
                    enableUpload: !!sectionConfig.onUpload,
                    enableReplace: !!sectionConfig.onReplace,
                    enableRename: !!sectionConfig.onRename,
                    enableDelete: !!sectionConfig.onDelete,
                    enableDownload: !!sectionConfig.onDownload,
                    editable: oController.getBindingExpression('attachmentEditable', section, index),
                    onUpload: oController.processAction.bind(oController, sectionID, sectionConfig.onUpload),
                    onReplace: oController.processAction.bind(oController, sectionID, sectionConfig.onReplace),
                    onDelete: function (oEvent) {
                        var params = oEvent.getParameter('record');
                        oController.processAction(sectionID, sectionConfig.onDelete, params);
                    },
                    onRename: oController.processAction.bind(oController, sectionID, sectionConfig.onRename),
                    onDownload: function (oEvent) {
                        var params = oEvent.getParameter('record');
                        oController.processAction(sectionID, sectionConfig.onDownload, params);
                    },
                    messagesShow: function (oEvent) {
                        var messages = oEvent.getParameter("MESSAGES_DATA");
                        oController._messagesPrepare(messages);
                    },
                    disableUploadPath: "/SECCFG/" + sectionID + "/attributes/disableUpload"
                });
                oController.sectionRef[sectionID].setModel(model, oController.modelName);

                oController.sectionRef[sectionID].attachmentProcess();


            }
            ,
            _processSnappingHeader: function (cfg) {
                var oController = this,
                    section,
                    index,
                    sectionID,
                    sectionConfig,
                    snappingHeader,
                    sectionPath,
                    dataPath,
                    sectionModelPath;
                ;
                var model = oController.getModel(oController.modelName);
                section = cfg.section;
                index = cfg.index;
                sectionID = section['SECTN'];
                sectionPath = oController._getPath(true);
                dataPath = oController._getPath();
                sectionModelPath = sectionPath + index;
                sectionConfig = oController.sectionConfig[sectionID];
                oController.sectionRef[sectionID] = new global.vui5.ui.controls.SnappingHeader({
                    controller: oController,
                    //*****Rel 60E_SP6
                    sectionId: sectionID,
                    //*****                    
                    modelName: oController.modelName,
                    dataPath: dataPath + section['DARID'] + "/",
                    facetGroupsPath: sectionModelPath + '/FCTGRP/',
                    fieldsPath: sectionModelPath + "/FIELDS/",
                    chartDetailsPath: sectionModelPath + "/SUMDATA/",
                    chartDataPath: dataPath,
                    titlePath: dataPath + "OBHDR_TITLE/"
                });
                oController.sectionRef[sectionID].preProcessFieldClickEvent = function (oEvent) {
                    return oController.preProcessFieldClickEvent(sectionID, oEvent);
                };
                oController.sectionRef[sectionID].setModel(model, oController.modelName);
                oController.sectionRef[sectionID].setModel(oController.getModel(global.vui5.modelName), global.vui5.modelName);
                oController.sectionRef[sectionID].snappingHeaderProcess({
                    objectPageLayout: oController.objectPageLayout
                });



            }
            ,
            _processSelections: function (cfg) {
                var oController = this,
                    section,
                    index,
                    sectionID,
                    dataArea,
                    sectionPath,
                    dataPath,
                    sectionModelPath,
                    sectionConfig,
                    variantSectionConfig,
                    variantSection,
                    callback;
                var model = oController.getModel(oController.modelName);

                section = cfg.section;
                index = cfg.index;
                sectionID = section['SECTN'];
                dataArea = section['DARID'];
                sectionPath = oController._getPath(true);
                dataPath = oController._getPath();
                sectionModelPath = sectionPath + index;
                sectionConfig = oController.sectionConfig[sectionID];
                variantSection = oController.getSectionBy("DAPPT", global.vui5.cons.propertyType.variant) || {};
                variantSectionConfig = oController.sectionConfig[variantSection['SECTN']] || {};

                // sectionModelFullPath = oController.modelName + ">" +
                // sectionModelPath;

                /* Process Attributes */
                if (sectionConfig.attributes[global.vui5.cons.attributes.onSearch]) {
                    sectionConfig.onSearchAction = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onSearch]
                    });
                }

                if (!underscoreJS.isEmpty(variantSectionConfig)) {
                    if (variantSectionConfig.attributes[global.vui5.cons.attributes.onVariantMaintain]) {
                        variantSectionConfig.onVariantMaintain = underscoreJS.findWhere(variantSection['FUNC'], {
                            FNCNM: variantSectionConfig.attributes[global.vui5.cons.attributes.onVariantMaintain]
                        });
                    }


                    if (variantSectionConfig && variantSectionConfig.attributes[global.vui5.cons.attributes.onVariantSelect]) {
                        variantSectionConfig.onVariantSelect = underscoreJS.findWhere(variantSection['FUNC'], {
                            FNCNM: variantSectionConfig.attributes[global.vui5.cons.attributes.onVariantSelect]
                        });
                    }
                }

                /* Prepare Element */

                selRef = oController.sectionRef[sectionID] = new global.vui5.ui.controls.Selections({
                    controller: oController,
                    dataAreaID: section['DARID'],
                    sectionPath: sectionModelPath,
                    dataPath: dataPath + dataArea + "/SRCH_DATA/",
                    fieldsPath: sectionModelPath + "/FIELDS/",
                    modelName: oController.modelName,
                    dropdownModel: global.vui5.modelName,
                    variantDataPath: dataPath + variantSection['DARID'] + "/",
                    showVariants: variantSectionConfig.onVariantMaintain !== undefined,
                    goVisibleProperty: sectionConfig.onSearchAction !== undefined,
                    hideVariantSave: !!variantSectionConfig.attributes && !!variantSectionConfig.attributes[global.vui5.cons.attributes.hideVariantSave],
                    /***Rel 60E SP6 ECDM #4728 - Start ***/
                    hideShare: !!variantSectionConfig.attributes && !!variantSectionConfig.attributes[global.vui5.cons.attributes.hideShare],
                    /***Rel 60E SP6 ECDM #4728 - End ***/
                    //*****Rel 60E_SP6
                    hideFilterBar: "/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.hideFilterBar, //oController.getBindingExpression("hideFilterBar", section, index),
                    //*****
                    showFilterConfiguration: oController.getBindingExpression("showFilterConfiguration", section, index),
                    selectedVariant: "/SECCFG/" + variantSection['SECTN'] + "/attributes/" + global.vui5.cons.attributes.selectedVariant,
                    //*****Rel 60E_SP6 - Sanofi Req
                    enableDescriptionSearch: "/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.enableDescriptionSearch,
                    //*****
                    visible: oController.getBindingExpression('visible', section, index),
                    search: oController.processAction.bind(oController, sectionID, sectionConfig.onSearchAction),
                    variantSave: function (oEvent) {
                        callback = oEvent.getParameter("callback");
                        oController.processAction(variantSection['SECTN'], variantSectionConfig.onVariantMaintain).then(function () {
                            if (callback && callback instanceof Function) {
                                callback();
                            }
                        });
                    },
                    fieldEvent: oController.preProcessFieldEvent.bind(oController, sectionID),
                    onValueHelpRequest: oController.onValueHelpRequest.bind(oController, sectionID),
                    variantSelect: function (evt) {
                        callback = evt.getParameter("callback");
                        oController.processAction(variantSection['SECTN'], variantSectionConfig.onVariantSelect, evt.getParameter('record')).then(function () {
                            if (callback && callback instanceof Function) {
                                callback();
                            }
                        });
                        // oController.processAction.call(oController,
                        // variantSection['SECTN'],
                        // variantSectionConfig.onVariantSelect,
                        // evt.getParameter('record'))
                    }
                });
                oController.sectionRef[sectionID].setModel(model, oController.modelName);
                oController.sectionRef[sectionID].selectionInfocusSet(global.vui5.cons.applnObject, global.vui5.cons.application);

                selRef.processOnInputChange = function (oEvent) {
                    return oController.processOnInputChange(sectionID, oEvent);
                };

                //*****Rel 60E_SP6 - Task #39097
                selRef._onToggleButtonChange = function (oEvent) {
                    return oController._onToggleButtonChange(oEvent);
                };
                //*****         

            }
            ,

            _processObjectHeader: function (cfg) {
                var oController = this,
                    section,
                    index,
                    sectionID,
                    sectionPath,
                    dataPath,
                    sectionModelPath,
                    sectionConfig,
                    objectHeader;
                var model = oController.getModel(oController.modelName);
                section = cfg.section;
                index = cfg.index;
                sectionID = section['SECTN'];
                sectionPath = oController._getPath(true);
                dataPath = oController._getPath();
                sectionModelPath = sectionPath + index;
                sectionConfig = oController.sectionConfig[sectionID];
                /* Process Attributes */
                if (sectionConfig.attributes[global.vui5.cons.attributes.onLinkPress]) {
                    sectionConfig.onLinkPress = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onLinkPress]
                    });
                }
                /* Prepare Element */
                objectHeader = new global.vui5.ui.controls.ObjectHeader({
                    controller: oController,
                    modelName: oController.modelName,
                    dataPath: dataPath + section['DARID'] + "/",
                    dataAreaPath: sectionModelPath + "/" + section['DARID'],
                    fieldsPath: sectionModelPath + "/FIELDS/",
                    // titlePath: "/DATA/OBHDR_TITLE/",
                    titlePath: dataPath + "OBHDR_TITLE/",
                    onLinkPress: oController.processAction.bind(oController, sectionID, sectionConfig.onLinkPress)
                });
                objectHeader.setModel(model, oController.modelName);
                objectHeader.setModel(oController.getModel(global.vui5.modelName), global.vui5.modelName);
                oController.sectionRef[sectionID] = objectHeader.getObjectHeader();


            }
            ,
            _processAddress: function (cfg) {
                var oController = this,
                    section,
                    index,
                    sectionPath,
                    dataPath,
                    sectionModelPath,
                    sectionConfig,
                    addressRef;
                var mainModel = oController.getModel(global.vui5.modelName);
                var model = oController.getModel(oController.modelName);
                var dmode = mainModel.getProperty("/DOCUMENT_MODE"),
                    formRef,
                    sectionID,
                    sectionEditable;

                section = cfg.section;
                index = cfg.index;
                sectionID = section['SECTN'];
                sectionPath = oController._getPath(true);
                dataPath = oController._getPath();
                sectionModelPath = sectionPath + index;

                sectionEditable = (dmode !== global.vui5.cons.mode.display && section['DISOL'] === '');
                oController.sectionFieldPath = sectionModelPath + "/FLGRP/";
                oController.sectionDataPath = dataPath + section['DARID'] + "/"; // "/DATA/"
                // +
                // section['DATAR']
                // +
                // "/";
                oController.fieldsPath = sectionModelPath + "/FIELDS/";
                oController.dataArea = section['DARID'];
                // oController.sectionFunPath = "/SECTN/" + index + "/FUNC/";
                oController.titlePath = sectionModelPath + "/DESCR";
                oController.sectionEditable = sectionEditable;
                oController.handleTypeAhead = function () {
                };
                oController.handleSuggestionItemSelected = function () {
                };

                sectionConfig = oController.sectionConfig[sectionID];

                if (sectionConfig.attributes[global.vui5.cons.attributes.onPrintPreview]) {
                    sectionConfig.onPrintPreview = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onPrintPreview]
                    });
                }
                if (sectionConfig.attributes[global.vui5.cons.attributes.onCreateAddress]) {
                    sectionConfig.onCreateAddress = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onCreateAddress]
                    });
                }
                if (sectionConfig.attributes[global.vui5.cons.attributes.onDeleteAddress]) {
                    sectionConfig.onDeleteAddress = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onDeleteAddress]
                    });
                }

                addressRef = oController.sectionRef[section['SECTN']] = new global.vui5.ui.controls.Address({
                    controller: oController,
                    modelName: oController.modelName,
                    sectionID: sectionID,
                    showCreateTile: "/SECCFG/" + section['SECTN'] + "/attributes/showCreateTile",
                    showMessagePage: "/SECCFG/" + section['SECTN'] + "/attributes/showMessagePage",
                    showDeleteButton: "/SECCFG/" + section['SECTN'] + "/attributes/showDeleteButton",
                    showPrintButton: "/SECCFG/" + section['SECTN'] + "/attributes/showPrintButton",
                    createTileText: "/SECCFG/" + section['SECTN'] + "/attributes/createTileText",
                    messagePageText: "/SECCFG/" + section['SECTN'] + "/attributes/messagePageText",
                    printPreview: function (oEvent) {
                        var cb = oEvent.getParameter('callBack');
                        oController.processAction(sectionID, sectionConfig.onPrintPreview).then(function (resp) {
                            if (cb && cb instanceof Function) {
                                cb(resp);
                            }
                        });
                    },
                    deleteAddress: function (oEvent) {
                        var cb = oEvent.getParameter('callBack');
                        oController.processAction(sectionID, sectionConfig.onDeleteAddress).then(function () {
                            if (cb && cb instanceof Function) {
                                cb();
                            }
                        });
                    },
                    createAddress: function (oEvent) {
                        var cb = oEvent.getParameter('callBack');
                        oController.processAction(sectionID, sectionConfig.onCreateAddress).then(function () {
                            if (cb && cb instanceof Function) {
                                cb();
                            }
                        });
                    }
                });

                addressRef.setModel(mainModel, global.vui5.modelName);
                // addressRef.setOnF4HelpRequest(oController.onValueHelpRequest.bind(oController));
                addressRef.setModel(model, oController.modelName);

                addressRef.addressInfocusSet();

                // formRef = oController.sectionRef[sectionID] =
                // sap.ui.jsfragment(global.vui5.utilitiesDomain +
                // ".fragments.Form", oController);
                // formRef.onValueHelpRequest = function (oEvent) {
                // oController.onValueHelpRequest(sectionID, oEvent);
                // };
                //
                // formRef.processOnInputChange = function (oEvent) {
                // return oController.processOnInputChange(sectionID, oEvent);
                // };
                //
                // formRef.preProcessFieldEvent = function (oEvent) {
                // return oController.preProcessFieldEvent(sectionID, oEvent);
                // };
                // jQuery.sap.syncStyleClass(oController.getOwnerComponent().getContentDensityClass(),
                // oController.getView(), formRef);


                // - start
                // var oController = this, section, index, sectionID, dataArea,
                // sectionConfig, addressRef;
                // var model = oController.getModel(oController.modelName);
                // section = cfg.section;
                // index = cfg.index;
                // sectionID = section['SECTN'];
                // var mainModel = oController.getModel(global.vui5.modelName);
                // var dmode = mainModel.getProperty("/DOCUMENT_MODE");
                // var editable = (dmode !== global.vui5.cons.mode.display &&
                // section['DISOL'] === '');
                // sectionConfig = oController.sectionConfig[sectionID];
                //
                // if
                // (sectionConfig.attributes[global.vui5.cons.attributes.onPrintPreview])
                // {
                // sectionConfig.onPrintPreview =
                // underscoreJS.findWhere(cfg.section['FUNC'], {
                // FNCNM:
                // sectionConfig.attributes[global.vui5.cons.attributes.onPrintPreview]
                // });
                // }
                //
                // jQuery.sap.require("globalUtilsPath" +
                // "/Controls/VuiAddress");
                // addressRef = oController.sectionRef[section['SECTN']] = new
                // vistex.utility.address({
                // controller: oController,
                // modelName: oController.modelName,
                // dataPath: "/DATA/" + section['DARID'] + "/",
                // fieldPath: "/SECTN/" + index + "/FIELDS",
                // fieldGroupPath: "/SECTN/" + index + "/FLGRP",
                // editable: editable,
                // addressMode: "/DATA/" + section['DARID'] + "/" + "ADRMODE",
                // // dialog: "/SECCFG/" + section['SECTN'] +
                // "/attributes/addressInDialog",
                // printPreview: function (oEvent) {
                // var cb = oEvent.getParameter('callBack');
                // oController.processAction(sectionID,
                // sectionConfig.onPrintPreview).then(function (resp) {
                // if (cb && cb instanceof Function) {
                // cb(resp);
                // }
                // });
                // },
                // // messagesShow: [oController.messagesShow, oController],
                // });
                // addressRef.processOnInputChange = function (oEvent) {
                // return oController.processOnInputChange(sectionID, oEvent);
                // };
                //
                // addressRef.setModel(mainModel, global.vui5.modelName);
                // addressRef.setOnF4HelpRequest(oController.onValueHelpRequest.bind(oController));
                // addressRef.setModel(model, oController.modelName);
                // addressRef.setModel(oController.getModel("i18n"), "i18n");
                // addressRef.addressInfocusSet();
            },

            _processPlanningGrid: function (cfg) {

                sap.ui.getCore().loadLibrary(vistexConfig.rootFolder + ".ui.widgets.IGrid", {
                    url: vistexConfig.uiResourcePath + "/" + vistexConfig.planningGridLibraryVersion + "/" + vistexConfig.rootFolder + "/ui/widgets/IGrid"
                });

                if (!global.vui5.ui.controls.PlanningGrid &&
                    eval(vistexConfig.rootFolder + ".ui.widgets.IGrid.PlanningGrid")) {
                    global.vui5.ui.controls.PlanningGrid = eval(vistexConfig.rootFolder + ".ui.widgets.IGrid.PlanningGrid");
                    global.vui5.ui.controls.PricingGrid = eval(vistexConfig.rootFolder + ".ui.widgets.IGrid.PricingGrid");
                    global.vui5.ui.controls.IGrid = eval(vistexConfig.rootFolder + ".ui.widgets.IGrid.IGrid");
                }

                var oController = this,
                    section,
                    index,
                    sectionID,
                    sectionPath,
                    dataPath,
                    sectionModelPath,
                    sectionConfig;
                var model = oController.getModel(oController.modelName);
                section = cfg.section;
                index = cfg.index;
                sectionID = section['SECTN'];

                sectionPath = oController._getPath(true);
                dataPath = oController._getPath();
                sectionModelPath = sectionPath + index;
                var mainModel = oController.getModel(global.vui5.modelName);
                var sectionConfig = oController.sectionConfig[sectionID];
                var sectionPath = oController._getPath(true);
                var dataPath = oController._getPath();
                /**ESP6#33583 Static changes removal from planning grid molecule.**/
                var sfatr = model.getProperty(sectionModelPath + "/FILTER/0/SFATR");
                /****/
                if (sectionConfig.attributes[global.vui5.cons.attributes.layoutChange]) {
                    sectionConfig.layoutChange = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.layoutChange]
                    });
                }

                if (sectionConfig.attributes[global.vui5.cons.attributes.procedureExecute]) {
                    sectionConfig.procedureExecute = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.procedureExecute]
                    });
                }

                if (sectionConfig.attributes[global.vui5.cons.attributes.refreshDerivation]) {
                    sectionConfig.refreshDerivation = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.refreshDerivation]
                    });
                }
                if (sectionConfig.attributes[global.vui5.cons.attributes.saveAsSnapshot]) {
                    sectionConfig.saveAsSnapshot = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.saveAsSnapshot]
                    });
                }
                if (sectionConfig.attributes[global.vui5.cons.attributes.overwriteSnapshot]) {
                    sectionConfig.overwriteSnapshot = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.overwriteSnapshot]
                    });
                }
                /**ESP6 Task#43143 Integrating grid version 31.0.1**/
                if (sectionConfig.attributes[global.vui5.cons.attributes.dictionaryUpdate]) {
                    sectionConfig.dictionaryUpdate = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.dictionaryUpdate]
                    });
                }
                /****/
                if (sectionConfig.attributes[global.vui5.cons.attributes.saveAsProforma]) {
                    sectionConfig.saveAsProforma = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.saveAsProforma]
                    });
                }
                if (sectionConfig.attributes[global.vui5.cons.attributes.refreshLiveProforma]) {
                    sectionConfig.refreshLiveProforma = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.refreshLiveProforma]
                    });
                }
                /**Rel - SP7 Supporting Snapshots in Grid**/
                if (sectionConfig.attributes[global.vui5.cons.attributes.snapshotManage]) {
                    sectionConfig.snapshotManage = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.snapshotManage]
                    });
                }
                /****/
                if (oController.sectionRef[section['SECTN']]) {
                    oController.sectionRef[section['SECTN']].disposeIGrid();
                    if (oController.sectionRef[section['SECTN']].gridConfig && oController.rdrgrid == false) { //Prevent Grid Multiple binds
                        if (oController.sectionRef[section['SECTN']]['gridConfig']) {
                            model.setProperty("/DATA/" + section['DARID'], []);
                            console.log(' grid data cleared....');
                        }
                    }
                }
                /**ESP6 Task#43744 Pricing Grid Integration 31.0.3**/
                //              if (dataPath == "/POPUP_DATA/") { //Prevent Grid Multiple binds in Full Screen
                //                  model.setProperty("/DATA/" + section['DARID'], []);
                //              }
                if (dataPath == "/FLSCR_DATA/") { //Prevent Grid Multiple binds in Full Screen
                    model.setProperty("/DATA/" + section['DARID'], []);
                }
                /****/


                oController.sectionRef[section['SECTN']] = {};
                oController.sectionRef[section['SECTN']] = new global.vui5.ui.controls.PlanningGrid({
                    controller: oController,
                    modelName: oController.modelName,
                    sectionModelPath: sectionPath + index,
                    iGridDataPath: dataPath + section['DARID'],
                    fullScreen: mainModel.getProperty("/FULLSCREEN"),
                    /**ESP6 Task#53345 Supporting variants in Grid**/
                    layoutDataPath: dataPath + section['DARID'] + global.vui5.cons.nodeName.layout + "/",
                    variantDataPath: dataPath + section['DARID'] + global.vui5.cons.nodeName.variant + "/",
                    selectedVariant: "/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.selectedVariant,
//                    handlePath: dataPath + section['DARID'] + global.vui5.cons.nodeName.layout + "/" + global.vui5.cons.handle,
                    //                    handle : oController.getBindingExpression('handle', section, index) + oController.getBindingExpression('selectedLayout', section, index),
                    hideVariantSave: !!sectionConfig.attributes[global.vui5.cons.attributes.hideVariantSave],
                    hideShare: !!sectionConfig.attributes[global.vui5.cons.attributes.hideShare],
                    /****/
                    /**ESP6#33583 Static changes removal from planning grid molecule.**/
                    /**ESP6 Bug#39423 QA#10453 Unable to view layouts in layout drop down of Snapshot data in FIORI Planning Document. 
                    dropdownPath: ">/DROPDOWNS/" + section['DATAR'] + "/",**/
                    dropdownPath: ">/DROPDOWNS/" + section['DARID'] + "/",
                    /****/
                    selectedFilter: ">/SECCFG/" + section['SECTN'] + "/attributes/" + sfatr,
                    fullscreenPath: ">/FULLSCREEN",
                    /****/
                    layoutChange: function (oEvent) {
                        var params = oEvent.getParameter('filter');
                        oController.processAction(sectionID, sectionConfig.layoutChange, params);
                    },
                    procedureExecute: function (oEvent) {
                        oController.processAction(sectionID, sectionConfig.procedureExecute);
                    },
                    overwriteSnapshot: function (oEvent) {
                        oController.processAction(sectionID, sectionConfig.overwriteSnapshot);
                    },
                    saveAsSnapshot: function (oEvent) {
                        var urlParams = oEvent.getParameter('params');
                        oController.processAction(sectionID, sectionConfig.saveAsSnapshot, null, urlParams);
                    },
                    saveAsProforma: function (oEvent) {
                        var urlParams = oEvent.getParameter('params');
                        oController.processAction(sectionID, sectionConfig.saveAsProforma, null, urlParams);
                    },
                    refreshDerivation: function (oEvent) {
                        oController.processAction(sectionID, sectionConfig.refreshDerivation);
                    },
                    onFullScreen: function (oEvent) {
                        oController.processFullScreen(sectionID, oEvent.getParameter("fullScreen"));
                    },
                    refreshLiveProforma: function (oEvent) {
                        oController.processAction(sectionID, sectionConfig.refreshLiveProforma);
                    },
                    /**ESP6 Create Plan Doc from Scenario**/
                    externalEvent: function (oEvent) {
                        oController.processAction(sectionID, oEvent.getParameter("func"));
                    },
                    /****/
                    /**ESP6 Task#43143 Integrating grid version 31.0.1**/
                    dictionaryUpdate: function (oEvent) {

                        callBack = oEvent.getParameter("callBack");
                        oController.processAction.call(oController, sectionID, sectionConfig.dictionaryUpdate, null).then(function (response) {
                            if (callBack && callBack instanceof Function) {
                                callBack(response);
                            }
                        });

                    },
                    /****/
                    /**ESP6 Task#53345 Supporting variants in Grid**/
                    variantSave: function (oEvent) {
                        oController.processAction.call(oController, sectionID, sectionConfig.onVariantMaintain, null, oEvent.getParameter("urlParams"));
                    },
                    variantSelect: function (oEvent) {
                        oController.processAction.call(oController, sectionID, sectionConfig.onVariantSelect, oEvent.getParameter("record"));
                    },
                    /****/
                    /**Rel - SP7 Supporting Snapshots in Grid**/
                    snapshotManage: function (oEvent) {

                        callBack = oEvent.getParameter("callBack");
                        oController.processAction.call(oController, sectionID, sectionConfig.snapshotManage, null).then(function (response) {
                            if (callBack && callBack instanceof Function) {
                                callBack(response);
                            }
                        });

                    },
                    /****/


                });
                //  model.setProperty("/DATA/" + section['DARID'], []);
                oController.sectionRef[sectionID].setModel(model, oController.modelName);
                oController.sectionRef[sectionID].loadGridContainer();
                oController.sectionRef[sectionID].prepareHeaderToolbarContent();
            }
            ,
            _processPricingGrid: function (cfg) {
                //sap.ui.core.BusyIndicator.show();
                sap.ui.getCore().loadLibrary(vistexConfig.rootFolder + ".ui.widgets.IGrid", {
                    //url: vistex.uiResourcePath + "/2.00/vistex/ui/widgets/IGrid"
                    url: vistexConfig.uiResourcePath + "/" + vistexConfig.pricingGridLibraryVersion + "/" + vistexConfig.rootFolder + "/ui/widgets/IGrid",
                    async: false
                });
                // sap.ui.core.BusyIndicator.hide();
                var oController = this,
                    section,
                    index,
                    sectionID,
                    dataArea,
                    sectionPath,
                    dataPath,
                    sectionModelPath,
                    sectionConfig,
                    layoutSfatr = '',
                    snapshotSfatr = '';
                var model = oController.getModel(oController.modelName);
                section = cfg.section;
                index = cfg.index;
                sectionID = section['SECTN'];
                sectionPath = oController._getPath(true);
                dataPath = oController._getPath();
                sectionModelPath = sectionPath + index;
                var mainModel = oController.getModel(global.vui5.modelName);
                sectionConfig = oController.sectionConfig[sectionID];
                var sectionPath = oController._getPath(true);
                var dataPath = oController._getPath();
                /**ESP6#33626 Static changes removal from Pricing grid molecule.**/
                var sfatr = model.getProperty(sectionModelPath + "/FILTER/0/SFATR");
                /****/
                if (sectionConfig.attributes[global.vui5.cons.attributes.layoutChange]) {
                    sectionConfig.layoutChange = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.layoutChange]
                    });
                }

                if (sectionConfig.attributes[global.vui5.cons.attributes.procedureExecute]) {
                    sectionConfig.procedureExecute = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.procedureExecute]
                    });
                }
                if (sectionConfig.attributes[global.vui5.cons.attributes.refreshDerivation]) {
                    sectionConfig.refreshDerivation = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.refreshDerivation]
                    });
                }
                if (sectionConfig.attributes[global.vui5.cons.attributes.saveAsSnapshot]) {
                    sectionConfig.saveAsSnapshot = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.saveAsSnapshot]
                    });
                }
                if (sectionConfig.attributes[global.vui5.cons.attributes.saveAsPriceProposal]) {
                    sectionConfig.saveAsPriceProposal = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.saveAsPriceProposal]
                    });
                }
                if (sectionConfig.attributes[global.vui5.cons.attributes.overwriteSnapshot]) {
                    sectionConfig.overwriteSnapshot = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.overwriteSnapshot]
                    });
                }
                if (sectionConfig.attributes[global.vui5.cons.attributes.commentUpdate]) {
                    sectionConfig.commentUpdate = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.commentUpdate]
                    });
                }
                /**ESP6 Task#43744 Pricing Grid Integration 31.0.3**/
                if (sectionConfig.attributes[global.vui5.cons.attributes.dictionaryUpdate]) {
                    sectionConfig.dictionaryUpdate = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.dictionaryUpdate]
                    });
                }
                /****/
                /**Rel - SP7 Supporting Snapshots in Grid**/
                if (sectionConfig.attributes[global.vui5.cons.attributes.snapshotManage]) {
                    sectionConfig.snapshotManage = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.snapshotManage]
                    });
                }
                /****/
                if (oController.sectionRef[section['SECTN']]) {
                    oController.sectionRef[section['SECTN']].disposeIGrid();
                    if (oController.sectionRef[section['SECTN']].gridConfig && oController.rendergrid == false) { //Prevent Grid Multiple binds
                        if (oController.sectionRef[section['SECTN']]['gridConfig']) {
                            model.setProperty("/DATA/" + section['DARID'], []);
                            console.log(' grid data cleared....');
                        }
                    }
                }
                /**ESP6 Task#43744 Pricing Grid Integration 31.0.3**/
                //                if (dataPath == "/POPUP_DATA/") { //Prevent Grid Multiple binds in Full Screen
                //                    model.setProperty("/DATA/" + section['DARID'], []);
                //                }
                if (dataPath == "/FLSCR_DATA/") { //Prevent Grid Multiple binds in Full Screen
                    model.setProperty("/DATA/" + section['DARID'], []);
                }
                /****/
                oController.sectionRef[section['SECTN']] = {};
                oController.sectionRef[section['SECTN']] = new global.vui5.ui.controls.PricingGrid({
                    controller: oController,
                    fullScreen: mainModel.getProperty("/FULLSCREEN"),
                    modelName: oController.modelName,
                    sectionModelPath: sectionPath + index,
                    iGridDataPath: dataPath + section['DARID'],
                    /**ESP6 Task#53345 Supporting variants in Grid**/
                    layoutDataPath: dataPath + section['DARID'] + global.vui5.cons.nodeName.layout + "/",
                    variantDataPath: dataPath + section['DARID'] + global.vui5.cons.nodeName.variant + "/",
                    selectedVariant: "/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.selectedVariant,
                    //                    handlePath: dataPath + section['DARID'] + global.vui5.cons.nodeName.layout + "/" + global.vui5.cons.handle,
                    handle: oController.getBindingExpression('handle', section, index),
                    hideVariantSave: !!sectionConfig.attributes[global.vui5.cons.attributes.hideVariantSave],
                    hideShare: !!sectionConfig.attributes[global.vui5.cons.attributes.hideShare],
                    /****/
                    /**ESP6#33626 Static changes removal from Pricing grid molecule.**/
                    /**ESP6 Bug#39423 QA#10453 Unable to view layouts in layout drop down of Snapshot data in FIORI Planning Document. 
                    dropdownPath: ">/DROPDOWNS/" + section['DATAR'] + "/",**/
                    dropdownPath: ">/DROPDOWNS/" + section['DARID'] + "/",
                    /****/
                    selectedFilter: ">/SECCFG/" + section['SECTN'] + "/attributes/" + sfatr,
                    fullscreenPath: ">/FULLSCREEN",
                    /**ESP6 Task#53345 Supporting variants in Grid**/
                    layoutDataPath: dataPath + section['DARID'] + global.vui5.cons.nodeName.layout + "/",
                    variantDataPath: dataPath + section['DARID'] + global.vui5.cons.nodeName.variant + "/",
                    selectedVariant: "/SECCFG/" + section['SECTN'] + "/attributes/" + global.vui5.cons.attributes.selectedVariant,
//                    handlePath: dataPath + section['DARID'] + global.vui5.cons.nodeName.layout + "/" + global.vui5.cons.handle,
                    /****/
                    layoutChange: function (oEvent) {
                        var params = oEvent.getParameter('filter');
                        oController.processAction(sectionID, sectionConfig.layoutChange, params);
                    },
                    procedureExecute: function (oEvent) {
                        oController.processAction(sectionID, sectionConfig.procedureExecute);

                    },
                    refreshDerivation: function (oEvent) {
                        oController.processAction(sectionID, sectionConfig.refreshDerivation);

                    },
                    overwriteSnapshot: function (oEvent) {
                        oController.processAction(sectionID, sectionConfig.overwriteSnapshot);
                    },
                    saveAsSnapshot: function (oEvent) {
                        var urlParams = oEvent.getParameter('params');
                        oController.processAction(sectionID, sectionConfig.saveAsSnapshot, null, urlParams);
                    },
                    saveAsPriceProposal: function (oEvent) {
                        var urlParams = oEvent.getParameter('params');
                        oController.processAction(sectionID, sectionConfig.saveAsPriceProposal, null, urlParams);
                    },
                    commentUpdate: function (oEvent) {
                        var params = oEvent.getParameter('filter');
                        oController.processAction(sectionID, sectionConfig.commentUpdate, params);
                    },
                    onFullScreen: function (oEvent) {
                        oController.processFullScreen(sectionID, oEvent.getParameter("fullScreen"));
                    },
                    /**ESP6 Task#43744 Pricing Grid Integration 31.0.3**/
                    dictionaryUpdate: function (oEvent) {

                        callBack = oEvent.getParameter("callBack");
                        oController.processAction.call(oController, sectionID, sectionConfig.dictionaryUpdate, null).then(function (response) {
                            if (callBack && callBack instanceof Function) {
                                callBack(response);
                            }
                        });

                    },
                    externalEvent: function (oEvent) {
                        oController.processAction(sectionID, oEvent.getParameter("func"));
                    },
                    /****/
                    //                    pageChange: function (oEvent) {
                    //                        var urlParams = oEvent.getParameter('params');
                    //                        oController.processAction(sectionID, sectionConfig.pageChange, null, urlParams);
                    //                    },
                    /**ESP6 Task#53345 Supporting variants in Grid**/
                    variantSave: function (oEvent) {
                        oController.processAction.call(oController, sectionID, sectionConfig.onVariantMaintain, null, oEvent.getParameter("urlParams"));
                    },
                    variantSelect: function (oEvent) {
                        oController.processAction.call(oController, sectionID, sectionConfig.onVariantSelect, oEvent.getParameter("record"));
                    },
                    /****/
                    /**Rel - SP7 Supporting Snapshots in Grid**/
                    snapshotManage: function (oEvent) {

                        callBack = oEvent.getParameter("callBack");
                        oController.processAction.call(oController, sectionID, sectionConfig.snapshotManage, null).then(function (response) {
                            if (callBack && callBack instanceof Function) {
                                callBack(response);
                            }
                        });

                    },
                    /****/
                    /**ESP7 Task#56827 Supporting Lazy Loading in Grid**/
                    iGridDataGet: function (oEvent) {
                        callBack = oEvent.getParameter("callBack");
                        oController.processAction.call(oController, sectionID, sectionConfig.iGridDataGet, null).then(function (response) {
                            if (callBack && callBack instanceof Function) {
                                callBack(response);
                            }
                        });
                    },
                    /****/

                });
                //  model.setProperty("/DATA/" + section['DARID'], []);
                oController.sectionRef[sectionID].loadGridContainer();
                oController.sectionRef[sectionID].setModel(model, oController.modelName);
                oController.sectionRef[sectionID].prepareHeaderToolbarContent();
            },

            _processStatementEditor: function (cfg) {
                sap.ui.getCore().loadLibrary(vistexConfig.rootFolder + ".ui.widgets.Designer", {
                    url: vistexConfig.uiResourcePath + "/" + vistexConfig.designerLibraryVersion + "/" + vistexConfig.rootFolder + "/ui/widgets/Designer"
                });

                if (!global.vui5.ui.controls.Designer &&
                    eval(vistexConfig.rootFolder + ".ui.widgets.Designer.Designer")) {
                    global.vui5.ui.controls.Designer = eval(vistexConfig.rootFolder + ".ui.widgets.Designer.Designer");
                }

                var oController = this,
                    section = "",
                    index = "",
                    sectionID = "",
                    dataArea = "",
                    sectionConfig = {},
                    model = "",
                    globalModel = "",
                    dmode = "",
                    editable = "";
                var sectionPath,
                    dataPath,
                    sectionModelPath;
                model = oController.getModel(oController.modelName);
                section = cfg.section;
                index = cfg.index;
                sectionID = section['SECTN'];
                sectionPath = oController._getPath(true);
                dataPath = oController._getPath();
                sectionModelPath = sectionPath + index;
                globalModel = oController.getModel(global.vui5.modelName);
                dmode = globalModel.getProperty("/DOCUMENT_MODE");
                editable = (dmode !== global.vui5.cons.mode.display && section['DISOL'] === '');
                sectionConfig = oController.sectionConfig[sectionID] || {},
                    attributes = sectionConfig['attributes'] || {};
                for (var _attr in attributes) {
                    sectionConfig[_attr] = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: attributes[_attr]
                    });
                }

                oController.sectionRef[section['SECTN']] = new global.vui5.ui.controls.Designer({
                    controller: oController,
                    modelName: oController.modelName,
                    sectionName: section['DARID'],
                    dataPath: dataPath + section['DARID'] + "/",
                    fullScreen: true,
                    hideLanguage: !!sectionConfig.attributes.hideLanguage,
                    hidePreview: !!sectionConfig.attributes.hidePreview,
                    configGet: function (oEvent) {
                        var cb = oEvent.getParameter('callBack');
                        oController.processAction(sectionID, sectionConfig.onConfigGet).then(function (resp) {
                            if (cb && cb instanceof Function) {
                                cb(resp);
                            }
                        });
                    },
                    dataGet: function (oEvent) {
                        var cb = oEvent.getParameter('callBack');
                        oController.processAction(sectionID, sectionConfig.onDataGet).then(function (resp) {
                            if (cb && cb instanceof Function) {
                                cb(resp);
                            }
                        });
                    },
                    languageChange: function (oEvent) {
                        var cb = oEvent.getParameter('callBack');
                        var language = oEvent.getParameter('SPRAS') || "EN";
                        var urlParams = {
                            "SPRAS": language
                        };
                        oController.processAction(sectionID, sectionConfig.onLanguageChange, null, urlParams).then(function (resp) {
                            if (cb && cb instanceof Function) {
                                cb(resp);
                            }
                        });
                    },
                    assignedLanguages: function () {
                        oController.processAction(sectionID, sectionConfig.onAssignedLanguages, null, {}).then(function (resp) {
                        });
                    },
                    preview: function (oEvent) {
                        oController.processAction(sectionID, sectionConfig.onPreview, null, {}).then(function (resp) {
                        });
                    },
                    onFullScreen: function (oEvent) {
                        oController.processFullScreen(sectionID, oEvent.getParameter("fullScreen"));
                    }
                });

                oController.sectionRef[sectionID].setDesignerInfocus(dmode);
                oController.sectionRef[sectionID].setModel(model, oController.modelName);
            }
            ,
            _messagesPrepare: function (messages, prevHold) {
                var oController = this,
                    messageModel,
                    msgType;
                var oMessageManager = sap.ui.getCore().getMessageManager();
                /*** Rel 60E SP7 - Display Messages in Dialog - Start***/
                var bundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.core");
                var oMessageView = new sap.m.MessageView({
                });
                var mainModel = oController.getModel(global.vui5.modelName);
                var messageDisplayType = mainModel.getProperty(global.vui5.cons.modelPath.sessionInfo + "/MSGDT");
                /*** Rel 60E SP7 - Display Messages in Dialog - End***/


                if (!oController.oMessageProcessor) {
                    oController.oMessageProcessor = new sap.ui.core.message.ControlMessageProcessor();
                }
                oMessageManager.registerMessageProcessor(oController.oMessageProcessor);
                messageModel = oMessageManager.getMessageModel();
                messageModel.setSizeLimit(global.vui5.cons.maxDataLimit);
                if (!prevHold) {
                    oMessageManager.removeAllMessages();
                }
                underscoreJS.each(messages, function (obj) {
                    switch (obj['MSGTY']) {
                        case 'S':
                            msgType = sap.ui.core.MessageType.Success;
                            break;
                        case 'I':
                            msgType = sap.ui.core.MessageType.Information;
                            break;
                        case 'E':
                            msgType = sap.ui.core.MessageType.Error;
                            break;
                        case 'W':
                            msgType = sap.ui.core.MessageType.Warning;
                            break;
                    }
                    oMessageManager.addMessages(
                        new sap.ui.core.message.Message({
                            message: obj['MSGLI'],
                            type: msgType,
                            processor: oController.oMessageProcessor
                        })
                    );
                    /*** Rel 60E SP7 - Display Messages in Dialog - Start***/
                    oMessageView.addItem(
                        new sap.m.MessageItem({
                            type: msgType,
                            title: obj['MSGLI'],
                        })
                    );
                    /*** Rel 60E SP7 - Display Messages in Dialog - End***/
                });
                /*** Rel 60E SP7 - Display Messages in Dialog - Start***/
                if (messageDisplayType === global.vui5.cons.messageDisplayType.dialog && messages.length > 0) {
                    var messagesDialog = new sap.m.Dialog({
                        resizable: true,
                        content: oMessageView,
                        title: bundle.getText("Messages"),
                        beginButton: new sap.m.Button({
                            press: function () {
                                messagesDialog.close();
                            },
                            text: bundle.getText("Close")
                        }),
                        contentHeight: "30%",
                        contentWidth: "35%",
                        verticalScrolling: false
                    }).addStyleClass("sapUiSizeCompact");;
                    messagesDialog.open();
                }
                /*** Rel 60E SP7 - Display Messages in Dialog - End***/
            },

            _showMessages: function (oEvent) {
                var oController = this;
                var oSource = oEvent.getSource();

                /*
            * if(oController._messagePopover) {
            * oController._messagePopover.destroy(); }
            */
                oController._messagePopover = new global.vui5.ui.controls.Messages();
                oSource.addDependent(oController._messagePopover);
                jQuery.sap.syncStyleClass(oController.getOwnerComponent().getContentDensityClass(),
                    oController.getView(), oController._messagePopover);

                oController._messagePopover.getAggregation("_messagesPopPover").toggle(oSource);
            },

            _prepareButtonControl: function (object, sectionID, fromToolBar, fromDialogFooter, fromSnappingHeader) {
                var oController = this,
                    prepareInvisibleControl,
                    visible,
                    oType,
                    priority,
                    buttonType,
                    buttonConfig,
                    showIcon,
                    dmode,
                    index,
                    funcIndex;
                var mainModel = oController.getModel(global.vui5.modelName);
                var model = oController.getModel(oController.modelName);
                var path = oController._getPath(true);
                var profileInfo = oController.getProfileInfo();
                dmode = mainModel.getProperty("/DOCUMENT_MODE") || global.vui5.cons.mode.display;
                var doFunctionsPath = fromDialogFooter ? '/' + global.vui5.cons.nodeName.popupFunctions : '/DOFUN';
                /*prepareInvisibleControl = underscoreJS.isObject(underscoreJS.find(oController.getSections(), {
                  'DAPPT': global.vui5.cons.propertyType.snappingHeader
              })) &&
            object['ACTYP'] !== global.vui5.cons.actionType.pageNavigation &&
            object['ACTYP'] !== global.vui5.cons.actionType.back &&
            object['ACTYP'] !== global.vui5.cons.actionType.cancel;*/


                /* 
                 There is a scenario where UITYPE will be List With processing & there will be Snapping Header section, so
                 if there is Snapping Header section we must not prepare Button in page Footer
                */


                if (profileInfo['UILYT'] === global.vui5.cons.layoutType.tab) {
                    prepareInvisibleControl = false;
                }

                if (!prepareInvisibleControl &&
                    profileInfo['UILYT'] !== global.vui5.cons.layoutType.tab &&
                    !fromDialogFooter) {

                    if (fromSnappingHeader) {
                        prepareInvisibleControl = object['FNCNM'] === global.vui5.cons.eventName.save ||
                            object['FNCNM'] === global.vui5.cons.eventName.cancel ||
                            object['NXSCT'] !== '';
                    }
                    else {
                        prepareInvisibleControl = object['FNCNM'] !== global.vui5.cons.eventName.save &&
                            object['FNCNM'] !== global.vui5.cons.eventName.cancel &&
                            object['NXSCT'] === "";
                    }
                }


                /* prepareInvisibleControl = (oController.getProfileInfo()['UILYT'] === global.vui5.cons.layoutType.line ||
                     oController.getProfileInfo()['UILYT'] === global.vui5.cons.layoutType.pageWithTabs) &&
                     oController.getProfileInfo()['UITYP'] !== global.vui5.cons.UIType.worklist &&
                     //oController.getProfileInfo()['UITYP'] !== global.vui5.cons.UIType.listWithProcessing &&
                     ((model.getProperty("/FIXED_SECTN") &&
                       model.getProperty("/FIXED_SECTN").length !== 0 &&
                       model.getProperty("/FIXED_SECTN")['DAPPT'] === global.vui5.cons.propertyType.snappingHeader));*/


                if (prepareInvisibleControl && !fromToolBar) {
                    return new sap.m.Text({
                        visible: false
                    });
                }

                oType = sap.m.ButtonType.Transparent;
                //*****Rel 60E_SP6
                if (object['BTNTP'] == global.vui5.cons.buttonType.segmentedButton) {
                    var sItems = [], key;

                    if (!underscoreJS.isEmpty(object['MNITM'])) {
                        underscoreJS.each(object['MNITM'], function (obj) {
                            var segButtonItems = new sap.m.SegmentedButtonItem({
                                key: obj['NAME'],
                                text: " "
                            });
                            if (object['FDTYP'] == global.vui5.cons.menuDisplay.icon) {
                                segButtonItems.setIcon(obj['FNICN']);
                                segButtonItems.setTooltip(obj['VALUE']);
                            }
                            else {
                                segButtonItems.setText(obj['VALUE']);
                            }

                            sItems.push(segButtonItems);
                        });
                    }

                    if (underscoreJS.isEmpty(object['SECTN'])) {
                        index = underscoreJS.findIndex(model.getProperty("/DOFUN"), {
                            SECTN: object['SECTN'],
                            FNCNM: object['FNCNM']
                        });
                        var segKeyPath = oController.modelName + ">/DOFUN/" + index + "/SEL_SEGMNT";
                    } else {
                        index = underscoreJS.findIndex(model.getProperty(path), {
                            SECTN: object['SECTN']

                        });
                        funcIndex = underscoreJS.findIndex(model.getProperty(path + index + "/FUNC"), {
                            FNCNM: object['FNCNM']
                        });
                        var segKeyPath = oController.modelName + ">" + path + index + "/FUNC/" + funcIndex + "/SEL_SEGMNT";
                    }

                    priority = object['FNDTP'] === global.vui5.cons.func.showInList ? sap.m.OverflowToolbarPriority.AlwaysOverflow : sap.m.OverflowToolbarPriority.High;
                    var oSegmentedButton = new sap.m.SegmentedButton({
                        items: sItems,
                        layoutData: new sap.m.OverflowToolbarLayoutData({
                            priority: priority
                        }),
                        select: function (oEvent) {
                            var params = {};
                            params['$SELMNITM'] = oEvent.getParameter("key");
                            oController.processAction(sectionID, object, null, params);
                        }
                    }).bindProperty("selectedKey", segKeyPath, function (value) {
                        return value;
                    }, sap.ui.model.BindingMode.OneWay);

                    return oSegmentedButton;
                    //*****
                } else if (object['BTNTP'] == global.vui5.cons.buttonType.menuButton ||
                    //*****Rel 60E_SP6
                    !underscoreJS.isEmpty(object['MNITM'])) {
                    //*****
                    var sMenu = [];
                    if (underscoreJS.isEmpty(object['SECTN'])) {
                        index = underscoreJS.findIndex(model.getProperty("/DOFUN"), {
                            SECTN: object['SECTN'],
                            FNCNM: object['FNCNM']
                        });
                        var visible = "{=${" + oController.modelName + ">/DOFUN/" + index + "/HIDFN} === ''}";
                    } else {
                        index = underscoreJS.findIndex(model.getProperty(path), {
                            SECTN: object['SECTN']

                        });
                        funcIndex = underscoreJS.findIndex(model.getProperty(path + index + "/FUNC"), {
                            FNCNM: object['FNCNM']
                        });
                        var visible = "{=${" + oController.modelName + ">" + path + index + "/FUNC/" + funcIndex + "/HIDFN} === ''}";
                    }
                    priority = object['FNDTP'] === global.vui5.cons.func.showInList ? sap.m.OverflowToolbarPriority.AlwaysOverflow : sap.m.OverflowToolbarPriority.High;
                    if (!underscoreJS.isEmpty(object['MNITM'])) {

                        underscoreJS.each(object['MNITM'], function (obj) {
                            var subactions = new sap.m.MenuItem({
                                text: obj['VALUE'],
                                key: obj['NAME']
                            });
                            sMenu.push(subactions);
                        });
                    }
                    var oMenu = new sap.m.Menu({
                        items: sMenu,
                        itemSelected: function (oEvt) {
                            var params = {};
                            var selectedAction = oEvt.getParameter('item');
                            params['$SELMNITM'] = selectedAction.getKey();
                            oController.processAction(sectionID, object, null, params);
                        }
                    });
                    //*****Rel 60E_SP6
                    oType = sap.m.ButtonType.Default;
                    if (object['BTNTP'] === global.vui5.cons.buttonType.accept) {
                        oType = sap.m.ButtonType.Accept;
                    } else if (object['BTNTP'] === global.vui5.cons.buttonType.reject) {
                        oType = sap.m.ButtonType.Reject;
                    }
                    //*****
                    oButtonControl = new sap.m.MenuButton({
                        //*****Rel 60E_SP6
                        type: oType,
                        //*****
                        menu: oMenu,
                        icon: object['FNICN'],
                        tooltip: object['DESCR'],
                        visible: visible,
                        layoutData: new sap.m.OverflowToolbarLayoutData({
                            priority: priority
                        })
                    });
                    if (object['FDTYP'] == global.vui5.cons.menuDisplay.text) {
                        oButtonControl.setText(object['DESCR'])
                    }
                    return oButtonControl;

                } else {
                    if (fromToolBar) {
                        index = underscoreJS.findIndex(model.getProperty(path), {
                            SECTN: object['SECTN']
                        });
                        funcIndex = underscoreJS.findIndex(model.getProperty(path + index + "/FUNC"), {
                            FNCNM: object['FNCNM']
                        });
                        visible = "{=${" + oController.modelName + ">" + path + index + "/FUNC/" + funcIndex + "/HIDFN} === ''}";
                    } else {
                        /*index = underscoreJS.findIndex(model.getProperty("/DOFUN"), {
                            FNCNM: object['FNCNM']
                        });*/
                        index = underscoreJS.findIndex(model.getProperty(doFunctionsPath), {
                            FNCNM: object['FNCNM']
                        });

                        //visible = "{= ${" + oController.modelName + ">/DOFUN/" + index + "/HIDFN} === '' }";
                        visible = "{= ${" + oController.modelName + ">" + doFunctionsPath + "/" + index + "/HIDFN} === '' }";
                    }
                    //*****Rel 60E_SP6 - QA #11652
                    //priority = object['FNDTP'] === global.vui5.cons.func.showInList ? sap.m.OverflowToolbarPriority.AlwaysOverflow : sap.m.OverflowToolbarPriority.High;
                    if (object['FNDTP'] === global.vui5.cons.func.showInList) {
                        priority = sap.m.OverflowToolbarPriority.AlwaysOverflow;
                    }
                    else {
                        if (object['FDTYP'] === global.vui5.cons.functionDisplayType.icon) {
                            priority = sap.m.OverflowToolbarPriority.High;
                        }
                        else {
                            priority = sap.m.OverflowToolbarPriority.Low;
                        }
                    }
                    //*****

                    showIcon = object['FDTYP'] === global.vui5.cons.functionDisplayType.icon;

                    if (fromSnappingHeader) {
                        buttonType = sap.uxap.ObjectPageHeaderActionButton;
                    }
                    else {
                        buttonType = showIcon ? sap.m.OverflowToolbarButton : sap.m.Button;
                    }


                    if (object['BTNTP'] === global.vui5.cons.buttonType.accept) {
                        oType = sap.m.ButtonType.Accept;
                    } else if (object['BTNTP'] === global.vui5.cons.buttonType.reject) {
                        oType = sap.m.ButtonType.Reject;
                    } else if (object['BTNTP'] === global.vui5.cons.buttonType.emphasize) {
                        oType = sap.m.ButtonType.Emphasized;
                    }

                    buttonConfig = {
                        type: oType,
                        // text: object['DESCR'],
                        tooltip: object['DESCR'],
                        press: oController.processAction.bind(oController, sectionID, object),
                        layoutData: new sap.m.OverflowToolbarLayoutData({
                            priority: priority
                        }),
                        visible: visible,
                        // visible: "{" + oController.modelName + ">/DATA/APTIT}"
                    };
                    if (object['FNBVR'] == global.vui5.cons.functionBehaviour.add && object['ACTYP'] == global.vui5.cons.actionType.refresh) {
                        buttonConfig['press'] = oController.processOnAddNextBehvr.bind(oController, sectionID, object);
                    }
                    if (priority == sap.m.OverflowToolbarPriority.AlwaysOverflow) {
                        buttonConfig['icon'] = object['FNICN'];
                        buttonConfig['text'] = object['DESCR'];
                    } else {
                        //showIcon ? buttonConfig['icon'] = object['FNICN'] : buttonConfig['text'] = object['DESCR'];
                        if (showIcon) {
                            buttonConfig['icon'] = object['FNICN'];
                            buttonConfig['text'] = object['DESCR'];
                        } else {
                            buttonConfig['text'] = object['DESCR'];
                        }
                    }

                    if (fromSnappingHeader) {
                        buttonConfig['importance'] = sap.uxap.Importance.Low;
                        if (showIcon) {
                            buttonConfig['hideIcon'] = false;
                            buttonConfig['hideText'] = false;
                        }
                        else {
                            buttonConfig['hideText'] = false;
                        }
                    }
                    return new buttonType(buttonConfig);
                }
            },



            _refreshPopupModel: function () {
                this.getCurrentModel().setProperty("/POPUP_SECTN", []);
                this.getCurrentModel().setProperty("/POPUP_DATA", []);
            }
            ,
            _refreshModelData: function () {
                delete this.getCurrentModel().getData()['SECTN'];
                delete this.getCurrentModel().getData()['SECCFG'];
                delete this.getCurrentModel().getData()['FIXED_SECTN'];
                this.getCurrentModel().setProperty("/DATA/", {});

            }
            ,
            _handleRequiredFieldCheck: function (oEvent) {
                var oController = this;
                var newValue = oEvent.getParameter("newValue");
                var oSource = oEvent.getSource();
                var error;
                if (oSource instanceof sap.m.ComboBox || oSource instanceof sap.m.MultiComboBox) {
                    var item = oSource.getSelectedItem();
                    if (!item) {
                        newValue = "";
                    }
                }

                if (newValue === "") {
                    oSource.setValueState(sap.ui.core.ValueState.Error); // if
                    // the
                    // field
                    // is
                    // empty
                    // after
                    // change,
                    // it
                    // will
                    // go
                    // red
                    var text = oSource.getParent().getAggregation("label").getText();
                    // var bundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.core");
                    var errorText = oController._getBundleText("Enter", [text]);
                    oSource.setValueStateText(errorText);
                    /* Combobox value is getting cleared  when it is initial even it is required field on check. 
                    selectedKey should be passed as its id */
                    var targetId;
                    if (oSource instanceof sap.m.ComboBox)
                        targetId = oSource.getId() + "/selectedKey";
                    else
                        targetId = oSource.getId() + "/value";
                    oController._handleCheckFieldsMessages(
                        errorText,
                        sap.ui.core.MessageType.Error,
                        targetId);
                    //                    oController._handleCheckFieldsMessages(
                    //                        errorText,
                    //                        sap.ui.core.MessageType.Error,
                    //                        oSource.getId() + "/value");
                    /**/
                    error = true;
                } else {
                    oSource.setValueState(sap.ui.core.ValueState.None); // if
                    // the
                    // field
                    // is
                    // not
                    // empty
                    // after
                    // change,
                    // the
                    // value
                    // state
                    // (if
                    // any)
                    // is
                    // removed
                    oSource.setValueStateText("");
                    /* Combobox value is getting cleared  when it is initial even it is required field on check. 
                    selectedKey should be passed as its id */
                    if (oSource instanceof sap.m.ComboBox)
                        targetId = oSource.getId() + "/selectedKey";
                    else
                        targetId = oSource.getId() + "/value";
                    oController._handleCheckFieldsMessages(
                        "",
                        "",
                        targetId);
                    /**/
                    error = false;
                }
                return error;
            }
            ,
            _onCheckBoxSelect: function (oEvent) {
                var source = oEvent.getSource();
                var path;

                if (source.data("dataPath")) {
                    path = source.data("dataPath");
                }
                else if (source.getBindingContext(source.data("model"))) {
                    path = source.getBindingContext(source.data("model")).getPath();
                    path = path + "/" + source.getBinding("selected").getBindings()[0].getPath();

                }
                else {
                    path = source.getBinding("selected").getBindings()[0].getPath();
                }
                //path = source.data("dataPath") || source.getBinding("selected").getBindings()[0].getPath();
                var model = source.getModel(source.data("model"));
                if (oEvent.getParameter("selected"))
                    model.setProperty(path, 'X');
                else
                    model.setProperty(path, '');
            },

            //*****Rel 60E_SP6 - Task #39097
            _onToggleButtonChange: function (oEvent) {
                var dataPath, path, fieldname;
                var source = oEvent.getSource();
                var model = source.getModel(source.data("model"));
                dataPath = source.data("dataPath");
                fieldname = source.data("fieldname");

                if (!dataPath && fieldname) {
                    path = source.getBindingContext(source.data("model")).getPath();
                    if (path) {
                        dataPath = path + "/" + model.getProperty(fieldname);
                    }
                }

                if (oEvent.getParameter("state")) {
                    model.setProperty(dataPath, "X");
                }
                else {
                    model.setProperty(dataPath, "");
                }
            },
            //*****

            _handleCheckFieldsMessages: function (text, type, target) {
                var oController = this;
                if (!this.oMessageProcessor) {
                    this.oMessageProcessor = new sap.ui.core.message.ControlMessageProcessor();
                }
                var oMessageManager = sap.ui.getCore().getMessageManager();
                oMessageManager.registerMessageProcessor(this.oMessageProcessor);
                var messageModel = oMessageManager.getMessageModel();
                var data = messageModel.getData();
                messageModel.setSizeLimit(global.vui5.cons.maxDataLimit);
                var messageData = underscoreJS.find(data, {
                    target: target
                });
                if (messageData) {
                    oMessageManager.removeMessages(messageData);
                }
                if (text != '') {
                    oMessageManager.addMessages(
                        new sap.ui.core.message.Message({
                            message: text,
                            type: type,
                            target: target,
                            processor: this.oMessageProcessor
                        })
                    );
                }
                if (oController._formDialog || !underscoreJS.isEmpty(oController.getCurrentModel().getProperty("/_VUI_QE"))) {

                    if (text == "" && type == "") {
                        if (oController.getMainModel().getProperty("/POPUP_MESSAGES") &&
                            oController.getMainModel().getProperty("/POPUP_MESSAGES").length > 0) {
                            oController.getMainModel().setProperty("/POPUP_MESSAGES", []);
                        }
                    } else {
                        var obj = {
                            "MSGLI": text,
                            "MSGTY": type = "Error" ? sap.ui.core.MessageType.Error : ""
                        };
                        oController.getMainModel().setProperty("/POPUP_MESSAGES", [obj]);
                    }
                }

            }
            ,
            /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - Start ***/
            //_fillDescription: function (model, path, fieldInfo, descr, newValue, fieldname) {
            _fillDescription: function (model, path, fieldInfo, descr, newValue, fieldname, source) {
                /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - End ***/


                //*****Rel 60E_SP6 - Sanofi Req
                if (source) {
                    var dappt = source.data("dappt");
                    if (dappt && dappt === vui5.cons.propertyType.selections) {
                        return;
                    }
                }
                //*****

                if (source && source.vuiParentControl) {
                    source.vuiParentControl.fillDescription({
                        path: path,
                        values: descr
                    });
                    return;
                }

                if (!fieldname)
                    fieldname = fieldInfo['FLDNAME'];

                if (fieldInfo['SDSCR'] === global.vui5.cons.fieldValue.value_cont_descr) {
                    var description = descr;
                    if (newValue && newValue != '') {
                        description = description + " (" + newValue + ")";
                    }
                    model.setProperty(path, description);
                    path = path.replace(fieldInfo['TXTFL'], fieldname);
                    model.setProperty(path, newValue);
                } else if (fieldInfo['SDSCR'] === global.vui5.cons.fieldValue.description) {
                    model.setProperty(path, descr);
                    path = path.replace(fieldInfo['TXTFL'], fieldname);
                    model.setProperty(path, newValue);
                    /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - Start ***/
                    if (this._isMultiInputField(source)) {
                        path = path.replace(fieldInfo['FLDNAME'] + global.vui5.cons.multiValueField, fieldname);
                        model.setProperty(path, underscoreJS.pluck(newValue, "KEY").join(","));

                    }
                    /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - End ***/
                } else if (fieldInfo['SDSCR'] === global.vui5.cons.fieldValue.value_descr) {
                    path = path.replace(fieldname, fieldInfo['TXTFL']);
                    model.setProperty(path, descr);
                }
            }
            ,
            _checkFloatField: function (oEvent) {
                var oController = this;
                var oSource = oEvent.getSource();
                var value = oSource.getValue();
                var regx;
                var mainModel = oController.getModel(global.vui5.modelName);
                var decimalNotation = mainModel.getProperty(global.vui5.cons.modelPath.sessionInfo + "/DCPFM");
                switch (decimalNotation) {
                    case 'X':
                        regx = /^[-+]?[0-9]*(\,\d{0,})*?\.?[0-9]+([eE][-+]?[0-9]+)?$/;
                        break;
                    case 'Y':
                        regx = /^[-+]?[0-9]*(\s\d{0,})*?\,?[0-9]+([eE][-+]?[0-9]+)?$/;
                        break;
                    default:
                        regx = /^[-+]?[0-9]*(\.\d{0,})*?\,?[0-9]+([eE][-+]?[0-9]+)?$/;
                        break;
                }
                value = value.trim();
                if (value && !regx.test(value)) {
                    oController.setErrorStateToControl(oSource);

                } else {
                    oSource.setValueState(sap.ui.core.ValueState.None);
                    oSource.setValueStateText('');
                    oController._handleCheckFieldsMessages(
                        "",
                        "",
                        oSource.getId() + "/value");
                }
            }
            ,
            _checkNumericField: function (oEvent) {
                var oController = this;
                var source = oEvent.getSource();
                var value;

                if (source instanceof sap.m.ComboBox || source instanceof sap.m.MultiComboBox) {
                    value = source.getSelectedKey();
                } else if (oEvent.oSource._$input[0]['attributes']['role']) {
                    if (oEvent.oSource._$input[0]['attributes']['role']['nodeValue'] === 'combobox') {
                        value = source.getSelectedKey();
                    } else {
                        value = source.getValue();
                    }

                } else {
                    value = source.getValue();
                }

                var regex;
                regex = /^[0-9]*$/;
                var error;

                value = value.trim();
                if (value && !regex.test(value)) {
                    oController.setErrorStateToControl(source);
                    error = true;
                } else {
                    source.setValueState(sap.ui.core.ValueState.None);
                    source.setValueStateText('');
                    oController._handleCheckFieldsMessages(
                        "",
                        "",
                        source.getId() + "/value");
                    error = false;
                }
                return error;
            }
            ,
            _checkPackedField: function (oEvent) {
                var oController = this;
                var source = oEvent.getSource();
                var value = source.getValue();
                var regex;
                var mainModel = oController.getModel(global.vui5.modelName);
                var decimalNotation = mainModel.getProperty(global.vui5.cons.modelPath.sessionInfo + "/DCPFM");
                regex = oController._getDecimalNotationRegex(decimalNotation);
                var error;

                value = value.trim();
                if (value && !regex.test(value)) {
                    oController.setErrorStateToControl(source);
                    error = true;
                } else {
                    source.setValueState(sap.ui.core.ValueState.None);
                    source.setValueStateText('');
                    oController._handleCheckFieldsMessages(
                        "",
                        "",
                        source.getId() + "/value");
                    error = false;
                }
                return error;
            }
            ,
            _checkIntegerField: function (oEvent) {
                var oController = this;
                var source = oEvent.getSource();
                var value = source.getValue();
                var regex;
                regex = /^[0-9\-]\d*(((,\d{1,}){0,})?)(([0-9\-])?)$/;
                var error;
                value = value.trim();
                if (value && !regex.test(value)) {
                    oController.setErrorStateToControl(source);
                    error = true;
                } else {
                    source.setValueState(sap.ui.core.ValueState.None);
                    source.setValueStateText('');
                    oController._handleCheckFieldsMessages(
                        "",
                        "",
                        source.getId() + "/value");
                    error = false;
                }
                return error;
            }
            ,

            _getDependentFields: function (sectionID, source, fieldInfo, rsparams) {
                var oController = this,
                    selectionsData;
                var model = oController.getCurrentModel();
                var section = oController.getSectionBy('SECTN', sectionID) || {};
                if (!source) {
                    return;
                }
                if (!rsparams) {
                    rsparams = [];
                }

                var oController = this,
                    path,
                    depflPath,
                    arr,
                    fieldname,
                    binding;
                if (source.getBinding) {
                    binding = source.getBinding("value") || source.getBinding("tokens");
                    if (binding) {
                        path = binding.getPath() || "";
                    }

                    if (path && path.indexOf(oController._getPath()) === -1) {
                        if (binding.getContext()) {
                            path = binding.getContext().getPath() + "/" + binding.getPath() || "";
                        }
                    }
                }

                if (!path) {
                    return;
                }
                arr = path.split("/");
                fieldname = arr[arr.length - 1];

                if (section['DAPPT'] === global.vui5.cons.propertyType.selections) {

                    fieldname = source.data("fieldName").split("-")[0];
                    selectionsData = commonUtils.selectionsPrepare(model.getProperty(oController._getPath() + section['DARID'] + "/SRCH_DATA"));
                    if (underscoreJS.isArray(fieldInfo['DEPFL']) && fieldInfo['DEPFL'].length > 0) {
                        underscoreJS.each(fieldInfo['DEPFL'], function (obj) {
                            if (!underscoreJS.find(rsparams, {
                                "SHLPFIELD": obj
                            })) {
                                rsparams.push(underscoreJS.findWhere(selectionsData, {
                                    'FIELDNAME': obj
                                }));
                            }
                        });
                    }

                } else {
                    if (underscoreJS.isArray(fieldInfo['DEPFL']) && fieldInfo['DEPFL'].length > 0) {
                        underscoreJS.each(fieldInfo['DEPFL'], function (obj) {
                            depflPath = path.replace(fieldname, obj);
                            if (!underscoreJS.find(rsparams, {
                                "SHLPFIELD": obj
                            })) {
                                rsparams.push({
                                    "SHLPNAME": "",
                                    "SHLPFIELD": obj,
                                    "SIGN": global.vui5.cons.seloptSign.include,
                                    "OPTION": "EQ",
                                    "LOW": model.getProperty(depflPath) || "",
                                    "HIGH": ""
                                });
                            }

                        });
                    }
                }


                return rsparams;
            }
            ,

            _getDecimalNotationRegex: function (decimalNotation) {
                var regex;
                switch (decimalNotation) {
                    case 'X':
                        regex = /^[0-9\-.]\d*(((,\d{1,}){0,})?(\.\d{0,})?)([0-9\-]{0,1})$/;
                        break;
                    case 'Y':
                        regex = /^[0-9\-,]\d*(((\s\d{1,}){0,})?(,\d{0,})?)([0-9\-]{0,1})$/;
                        break;
                    default:
                        regex = /^[0-9\-,]\d*(((\.\d{1,}){0,})?(,\d{0,})?)([0-9\-]{0,1})$/;
                        break;
                }

                return regex;


            }
            ,
            _initializeCurrentModel: function (fromOnInitFunction) {
                var oController = this;
                var model = new sap.ui.model.json.JSONModel();
                model.setSizeLimit(global.vui5.cons.maxDataLimit);
                if (fromOnInitFunction) {
                    model.setProperty("/DATA", {});
                    oController.getView().setModel(model, oController.modelName);
                } else {
                    oController.getCurrentModel().setData(model.getData());
                }
            }
            ,
            _clearSectionkeys: function () {
                delete this._sectionKey;
                delete this._subSectionKey;
            }
            ,
            _prepareTabBarControl: function () {
                var oController = this;
                var path = oController._getPath(true);
                var modelName = this.modelName;
                oController.tabBar = new sap.m.IconTabBar({
                    showOverflowSelectList: true,
                    select: [oController._onTabSelect, oController],
                    selectedKey: oController.getQueryParam('tab')
                })
                    .addStyleClass("tabBarSelected")
                    .addEventDelegate({
                        onBeforeRendering: function (e) {
                            var tabRef = e.srcControl;
                            var selectedKey = tabRef.getSelectedKey();
                            var currentKey = oController.getQueryParam('tab');

                            //*****Rel 60E_SP7
                            var currentModel = oController.getCurrentModel();
                            var tabSections = tabRef.getItems();
                            if (currentModel.getProperty("/SELECTED_SECTION")) {
                                var currentSection = underscoreJS.find(tabSections, function (sectn) {
                                    if (sectn.data("id") === currentModel.getProperty("/SELECTED_SECTION")) {
                                        return sectn;
                                    }
                                });

                                if (currentSection) {
                                    currentKey = currentModel.getProperty("/SELECTED_SECTION");
                                    currentModel.setProperty("/SELECTED_SECTION", "");
                                }
                            }
                            //*****

                            if (oController._formDialog) {
                                currentKey = selectedKey;
                            }
                            var tabItems = tabRef.getItems();
                            var firstKey;
                            var sections = oController.getSections();

                            if (selectedKey !== currentKey) {
                                if (!currentKey && tabItems.length) {
                                    firstKey = underscoreJS.findWhere(sections, {
                                        'HDSCT': ''
                                    })['SECTN'] || tabItems[0].getKey();
                                    currentKey = firstKey;
                                }
                                if (currentKey && selectedKey !== firstKey) {
                                    tabRef.setSelectedKey(currentKey, true);
                                    tabRef.setShowSelection(!tabRef.getShowSelection());
                                }
                            }
                        },
                        onAfterRendering: function (e) {
                            //*****Rel 60E_SP6 - QA #9415
                            //if(oController._separatorID && $('#'+oController._separatorID)){
                            //$('#'+oController._separatorID).hide();
                            if (oController._separatorID) {
                                for (var i = 0; i < oController._separatorID.length; i++) {
                                    if ($('#' + oController._separatorID[i])) {
                                        $('#' + oController._separatorID[i]).hide();
                                    }
                                }
                                //*****
                            }
                            if (e.srcControl.overRideSelectedFn) {
                                var tabBarHeader = e.srcControl.getAggregation("_header");
                                if (tabBarHeader.oSelectedItem) {
                                    tabBarHeader._scrollIntoView(tabBarHeader.oSelectedItem);
                                }

                                return;
                            };

                            var setSelectedItemFn = e.srcControl._getIconTabHeader().setSelectedItem;
                            e.srcControl.overRideSelectedFn = true;
                            e.srcControl._getIconTabHeader().setSelectedItem = function (oEvent, skipUpdate) {
                                var controlRef = this,
                                    controlArgs = arguments,
                                    promise;

                                //*****Rel 60E_SP6
                                oController.dashboardBufferFill(controlRef.getSelectedKey());
                                //*****
                                if (skipUpdate !== true) {
                                    promise = oController._UpdateChanges(controlRef.getSelectedKey(), null, global.vui5.cons.updateCallFrom.tabChange);
                                    if (promise) {
                                        if (promise.then) {
                                            promise.then(function () {
                                                setSelectedItemFn.apply(controlRef, controlArgs);
                                            });
                                            return false;
                                        }
                                    }
                                }

                                return setSelectedItemFn.apply(controlRef, controlArgs);
                            };
                        }
                    });

                oController.tabBar.bindAggregation("items", oController.modelName + ">" + path, function (sId, oContext) {
                    var contextObject = oContext.getObject(),
                        currentTab,
                        preparePanelContent = false,
                        switchField,
                        iconTabFilter,
                        path = oContext.getPath(),
                        index = path.substring(path.lastIndexOf("/") + 1, path.length),
                        currentModel = oController.getCurrentModel();

                    //currentTab = oController.getQueryParam("tab") || "";
                    if (oController._formDialog) {
                        currentTab = currentModel.getProperty("/POPUP_TAB") ? currentModel.getProperty("/POPUP_TAB") : ""
                    }
                    else {
                        currentTab = oController.getQueryParam("tab") || "";
                    }

                    preparePanelContent = currentTab === "" && underscoreJS.findIndex(oController.getSections(), contextObject) === 0;
                    if (!preparePanelContent) {
                        preparePanelContent = currentTab === contextObject['SECTN'];
                    }
                    if (contextObject['DAPPT'] == global.vui5.cons.propertyType.objectheader ||
                        //*****Rel 60E_SP6 - QA #9415
                        !underscoreJS.isEmpty(contextObject['HDSCT'])
                        //*****
                    ) {
                        iconTabFilter = new sap.m.IconTabSeparator({ visible: false });
                        //*****Rel 60E_SP6 - QA #9415
                        //oController._separatorID = iconTabFilter.getId();
                        if (!oController._separatorID) {
                            oController._separatorID = [];
                        }
                        oController._separatorID.push(iconTabFilter.getId());
                        //*****
                    }
                    else {
                        iconTabFilter = new sap.m.IconTabFilter({
                            design: sap.m.IconTabFilterDesign.Vertical,
                            text: contextObject['DESCR'],
                            tooltip: contextObject['DESCR'],
                            icon: contextObject['DAICN'],
                            key: contextObject['SECTN'],
                            visible: oController.getBindingExpression("sectionVisible", contextObject, index)
                            //visible: contextObject['HDSCT'] === '' && contextObject['SCGRP'] === '' // &&
                            // oController.getSections().length
                            // !==
                            // 2
                            /*
                     * When Section is hide section and in case of drilldown
                     * when we get only 2 section(Details & Object Header
                     * section we have to hide Icon Tab Filter according to
                     * SAPUI5 Guidelines
                     */
                            //*****Rel 60E_SP7
                            //});
                        }).data("id", contextObject['SECTN']);
                        //*****
                    }

                    if (contextObject['FXSCT']) {
                        if (!oController.sectionRef[contextObject['SECTN']] || oController._preparePageContent) {
                            oController.showPanelContent(contextObject['SECTN']);
                            oController.pageObject.insertContent(oController.sectionRef[contextObject['SECTN']]);
                            if (contextObject['DAPPT'] !== global.vui5.cons.propertyType.snappingHeader) {
                                oController.sectionRef[contextObject['SECTN']].setHeaderContainer(oController.tabBar);
                            } else {
                                oController.pageObject.insertContent(oController.tabBar);
                            }


                        }

                    } else if (preparePanelContent) {

                        if (contextObject['GRPNM']) {
                            oController.subSectionsArr = [];
                            underscoreJS.each(oController._getGroupingSections(contextObject['GRPNM']), function (section) {
                                oController.showPanelContent(section['SECTN']);
                                if (!underscoreJS.isEmpty(section['FILTER'])) {
                                    var filter = oController.addFilterContent(section);
                                    if (!underscoreJS.isEmpty(filter)) {
                                        underscoreJS.each(filter, function (ob, i) {
                                            iconTabFilter.insertContent(ob, 0);

                                        });
                                    }
                                }

                                if ((section['DAPPT'] == global.vui5.cons.propertyType.notes || section['DAPPT'] == global.vui5.cons.propertyType.sets ||
                                    section['DAPPT'] == global.vui5.cons.propertyType.status || section['DAPPT'] == global.vui5.cons.propertyType.HTML) ||
                                    (section['DAPPT'] == global.vui5.cons.propertyType.form && underscoreJS.isEmpty(section['FUNC']))) {
                                    iconTabFilter.addContent(new sap.m.Toolbar({
                                        content: [
                                            new sap.m.Title({
                                                titleStyle: sap.ui.core.TitleLevel.H4,
                                                text: section['DESCR']
                                            })
                                        ]
                                    }));
                                }

                                switchField = oController._prepareSwitchField();
                                if (switchField) {
                                    iconTabFilter.insertContent(switchField, 1);
                                }
                                if (section['DAPPT'] == global.vui5.cons.propertyType.table) {
                                    iconTabFilter.addContent(new sap.ui.layout.VerticalLayout({
                                        width: '100%',
                                        content: [
                                            oController.sectionRef[section['SECTN']]
                                        ]
                                    }));
                                } else {
                                    iconTabFilter.addContent(oController.sectionRef[section['SECTN']]);
                                }
                            });
                        } else {
                            oController.showPanelContent(contextObject['SECTN']);
                            if (!underscoreJS.isEmpty(contextObject['FILTER'])) {
                                var filter = oController.addFilterContent(contextObject);
                                if (!underscoreJS.isEmpty(filter)) {
                                    underscoreJS.each(filter, function (ob, i) {
                                        iconTabFilter.insertContent(ob, 0);

                                    });
                                }
                            }
                            switchField = oController._prepareSwitchField();
                            if (switchField) {
                                iconTabFilter.insertContent(switchField, 1);
                            }
                            iconTabFilter.addContent(oController.sectionRef[contextObject['SECTN']]);
                        }
                    }

                    return iconTabFilter;


                });
                oController.pageObject.addContent(oController.tabBar);

            }
            ,

            _prepareSwitchField: function (iconTabFilter) {
                var oController = this,
                    drillDownKeys;
                drillDownKeys = oController.getMainModel().getProperty("/DRILLDOWNKEYS") || {};
                if (underscoreJS.isEmpty(drillDownKeys) || !drillDownKeys['SWFLD']) {
                    return;
                }

                return oController.addSwitchField();


            }
            ,

            // _getGroupingSections: function (sectionGroupName) {
            // return underscoreJS.where(this.getSections(), { 'SCGRP': sectionGroupName,
            // 'HDSCT': '' });
            // },
            _getGroupingSections: function (sectionGroupName, sections) {
                var oController = this;
                var currSections = sections ? sections : this.getSections();
                var subsections = underscoreJS.where(currSections, {
                    'SCGRP': sectionGroupName,
                    'HDSCT': ''
                });
                underscoreJS.each(subsections, function (obj, i) {
                    if (obj['GRPNM']) {
                        oController._getGroupingSections(obj['GRPNM']);
                    } else {
                        oController.subSectionsArr.push(obj);
                    }
                });
                return oController.subSectionsArr;
            }
            ,

            _getBundleText: function (propertyName, params) {
                var oController = this;
                var bundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.core");
                if (params) {
                    return bundle.getText(propertyName, params);
                }
                else {
                    return bundle.getText(propertyName);
                }

            }
            ,

            _registerUnloadEvent: function () {
                var oController = this;

                if (!global.vui5.session.fromFioriLaunchpad) {
                    window.addEventListener("unload", function () {
                        oController._sessionEnd();
                    });

                }


            }
            ,

            /* Session Popup */

            _prepareSessionPopup: function () {
                if (global.vui5.fromOtherApp) {
                    return;
                }
                var oController = this;
                // if(global.vui5.fromOtherApp == false){
                var sessionPopup = new sap.m.Dialog({
                    title: oController._getBundleText('SessionPopup'),
                    state: sap.ui.core.ValueState.Warning,
                    content: [
                        new sap.m.Label({
                            text: {
                                parts: [
                                    "/SESSION/ACTION_TYPE",
                                    "/SESSION/TIME_LEFT"
                                ],
                                formatter: function (actionType, timeLeft) {

                                    var text = oController._getBundleText('timeleft') + " " + timeLeft + " " + oController._getBundleText("seconds");
                                    if (actionType == 'TIMEOUT') {
                                        text = oController._getBundleText('expired');
                                    }
                                    return text;
                                }
                            }
                        })
                    ],
                    buttons: [
                        new sap.m.Button({
                            text: {
                                parts: [
                                    "/SESSION/ACTION_TYPE"
                                ],
                                formatter: function (actionType) {
                                    var text = oController._getBundleText('SessionContinue');
                                    if (actionType == 'TIMEOUT') {
                                        text = oController._getBundleText('Restart');

                                        /***Rel 60E SP6 ECIP #19825 - Start **/
                                        oController._logOff(true);

                                        /***Rel 60E SP6 ECIP #19825 - End **/
                                    }
                                    return text;
                                }
                            },
                            press: function (evt) {
                                sessionPopup.enableOpen = false;
                                /***Rel 60E SP6 ECIP #19825 - Start **/
                                //if (!global.vui5.session.ccounter) {
                                if (evt.getSource().getText() === oController._getBundleText('Restart')) {
                                    /***Rel 60E SP6 ECIP #19825 - End **/

                                    /***Rel 60E SP6 ECIP #19825 - Start **/
                                    //oController._logOff();
                                    oController.postLogOff();
                                    /***Rel 60E SP6 ECIP #19825 - End **/
                                } else {
                                    oController.callServer({
                                        /***Rel 60E SP6 ECIP #19825 - Start **/
                                        //url: global.vui5.server.url.baseURL,
                                        url: global.vui5.server.url.baseURL + '$appid=' + oController.getApplicationIdentifier(),
                                        /***Rel 60E SP6 ECIP #19825 - End **/
                                    }).then(function (data) {
                                        global.vui5.session.scounter = global.vui5.session.ccounter = global.vui5.session.maxTime;
                                    });
                                }
                                sessionPopup.close();
                            }
                        })
                    ]
                });
                sessionPopup.enableOpen = false;
                sessionPopup.addStyleClass("sapUiPopupWithPadding");

                var dialogJSON = new JSONModel();
                dialogJSON.setData({
                    SESSION: {
                        ACTION_TYPE: 'NOTIFY',
                        TIME_LEFT: ''
                    }
                });
                sessionPopup.setModel(dialogJSON);
                var sessionTime = setInterval(function () {
                    if (global.vui5.session.counterPause) {
                        if (global.vui5.session.ccounter <= global.vui5.session.notify) {
                            if (global.vui5.session.ccounter == 0) {
                                dialogJSON.setProperty('/SESSION/ACTION_TYPE', 'TIMEOUT');
                                clearInterval(sessionTime);
                                return false;
                            }
                            dialogJSON.setProperty('/SESSION/TIME_LEFT', global.vui5.session.ccounter);
                            if (!sessionPopup.enableOpen) {
                                sessionPopup.open();
                                sessionPopup.enableOpen = true;
                            }
                        }
                        if (global.vui5.session.scounter == global.vui5.session.notify &&
                            global.vui5.session.scounter < global.vui5.session.ccounter) {
                            oController.callServer({
                                /***Rel 60E SP6 ECIP #19825 - Start **/
                                //url: global.vui5.server.url.baseURL,
                                url: global.vui5.server.url.baseURL + '$appid=' + oController.getApplicationIdentifier(),
                                /***Rel 60E SP6 ECIP #19825 - End **/
                                async: false
                            }).then(function () {
                                global.vui5.session.scounter = global.vui5.session.ccounter = global.vui5.session.maxTime;
                            });
                        }
                        global.vui5.session.ccounter -= 1;
                        global.vui5.session.scounter -= 1;
                    }
                }, 1000);

                // }

            }
            ,

            _sessionEnd: function () {
                var oController = this;
                var oUrl;
                if (oController.getBaseURL().indexOf("?") == -1) {
                    oUrl = oController.getBaseURL() + '?sap-sessioncmd=close';
                } else {
                    oUrl = oController.getBaseURL() + '&sap-sessioncmd=close';
                }

                if ("sendBeacon" in navigator) {
                    navigator.sendBeacon(oUrl);
                }
                else {
                    oController.callServer({
                        url: oUrl,
                        async: false
                    });
                }
            }
            ,

            _logout: function (url) {
                var str = url.replace("http://", "http://" + new Date().getTime() + "@");
                var xmlhttp;
                if (window.XMLHttpRequest)
                    xmlhttp = new XMLHttpRequest();
                else
                    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4) location.reload();
                };
                xmlhttp.open("GET", str, true);
                xmlhttp.setRequestHeader("Authorization", "Basic YXNkc2E6");
                xmlhttp.send();
                return false;
            }
            ,
            /***Rel 60E SP6 ECIP #19825 - Start **/
            postLogOff: function () {

                var oController = this;

                $('body').children().detach();

                $.ajax({
                    data: [],
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    type: 'POST',
                    /*** Rel 60E SP6 - Logoff Issue from HCP - Start***/
                    //url: '/sap/public/bc/icf/logoff' + '?sap-sessioncmd=logoff',
                    url: vistexConfig.hcpDestination ? vistexConfig.hcpDestination + '/sap/public/bc/icf/logoff' + '?sap-sessioncmd=logoff' :
                        '/sap/public/bc/icf/logoff' + '?sap-sessioncmd=logoff',
                    /*** Rel 60E SP6 - Logoff Issue from HCP - End***/

                    async: false
                }).done(function () {
                    if (sap.ui.Device.browser.msie) {

                        document.execCommand("ClearAuthenticationCache", false);
                        location.reload();
                    } else {

                        var url = location.href;
                        oController._logout(url);
                    }
                });
            },
            /***Rel 60E SP6 ECIP #19825 - End **/

            _logOff: function (skipPageReload) {
                var oController = this;

                oController.preLogOff().then(function () {


                    // window.removeEventListener("unload", onWindowUnload);

                    // window.removeEventListener("beforeunload",
                    // onWindowBeforeUnload);
                    $.ajax({
                        /*** Rel 60E SP6 - Logoff Issue from HCP - Start***/
                        //url: "/sap/public/bc/icf/logoff",
                        url: vistexConfig.hcpDestination ? vistexConfig.hcpDestination + "/sap/public/bc/icf/logoff" : "/sap/public/bc/icf/logoff",
                        /*** Rel 60E SP6 - Logoff Issue from HCP - End***/
                        async: true
                    }).done(function () {
                        /***Rel 60E SP6 ECIP #19825 - Start **/
                        if (!skipPageReload) {


                            $('body').children().detach();

                            $.ajax({
                                data: [],
                                xhrFields: {
                                    withCredentials: true
                                },
                                crossDomain: true,
                                type: 'POST',
                                /*** Rel 60E SP6 - Logoff Issue from HCP - Start***/
                                //url: '/sap/public/bc/icf/logoff' + '?sap-sessioncmd=logoff',
                                url: vistexConfig.hcpDestination ? vistexConfig.hcpDestination + '/sap/public/bc/icf/logoff' + '?sap-sessioncmd=logoff' :
                                    '/sap/public/bc/icf/logoff' + '?sap-sessioncmd=logoff',
                                /*** Rel 60E SP6 - Logoff Issue from HCP - End***/

                                async: false
                            }).done(function () {
                                if (sap.ui.Device.browser.msie) {

                                    document.execCommand("ClearAuthenticationCache", false);
                                    location.reload();
                                } else {

                                    var url = location.href;
                                    oController._logout(url);
                                }
                            });
                        }
                        /***Rel 60E SP6 ECIP #19825 - End **/
                    });
                });
            }
            ,
            _getSelectedRecords: function (currentSection, action, params) {
                var oController = this;
                var sectionConfig = oController.sectionConfig[currentSection['SECTN']] || {};
                if ((action['SELTP'] === global.vui5.cons.rowSelection.single
                    || action['SELTP'] === global.vui5.cons.rowSelection.multiple) && action['ACTYP'] !== global.vui5.cons.actionType.filters && action['ACTYP'] !== global.vui5.cons.actionType.subaction) {

                    if (underscoreJS.isEmpty(params) || (params instanceof sap.ui.base.Event)) {
                        params = {};
                        if (currentSection['DAPPT'] === global.vui5.cons.propertyType.table) {
                            params = oController.sectionRef[currentSection['SECTN']].getSelectedRows();
                        }
                        //*****Rel 60E_SP6
                        else if (currentSection['DAPPT'] === global.vui5.cons.propertyType.treeTable) {
                            params = oController.sectionRef[currentSection['SECTN']].getSelectedItems();
                        }
                        //*****
                        if (underscoreJS.isEmpty(params)) {
                            sap.m.MessageToast.show(oController._getBundleText("SelectRowMsg"));
                            return;
                        }

                    }
                    return params;
                }
                else if (action['ACTYP'] === global.vui5.cons.actionType.filters) {
                    return params;
                }
            }
            ,
            /* copy popup */
            _getPath: function (metadata) {
                var oController = this;
                var currentModel = oController.getCurrentModel();
                /**** Rel 60E SP6 - FullScreen Support changes - Start ***/
                var mainModel = oController.getMainModel();
                /**** Rel 60E SP6 - FullScreen Support changes - End ***/
                if (currentModel) {
                    if (!currentModel.getProperty("/POPUP_SECTN")) {
                        currentModel.setProperty("/POPUP_SECTN", {});
                    }

                    if (!currentModel.getProperty("/POPUP_DATA")) {
                        currentModel.setProperty("/POPUP_DATA", {});
                    }

                    /**** Rel 60E SP6 - FullScreen Support changes - Start ***/
                    if (!currentModel.getProperty("/FLSCR_SECTN")) {
                        currentModel.setProperty("/FLSCR_SECTN", {});
                    }

                    if (!currentModel.getProperty("/FLSCR_DATA")) {
                        currentModel.setProperty("/FLSCR_DATA", {});
                    }
                    /**** Rel 60E SP6 - FullScreen Support changes - End ***/
                }

                /**** Rel 60E SP6 - FullScreen Support changes - Start ***/
                if (metadata) {
                    if (oController._formDialog) {
                        return "/POPUP_SECTN/";
                    }
                    else if (mainModel.getProperty("/FULLSCREEN")) {
                        return "/FLSCR_SECTN/";
                    }
                    else {
                        return "/SECTN/";
                    }
                }
                else {
                    if (oController._formDialog) {
                        return "/POPUP_DATA/";
                    }
                    else if (mainModel.getProperty("/FULLSCREEN")) {
                        return "/FLSCR_DATA/";
                    }
                    else {
                        return "/DATA/";
                    }
                }
                //return metadata ? oController._formDialog ? "/POPUP_SECTN/" : "/SECTN/" : oController._formDialog ? "/POPUP_DATA/" : "/DATA/";
                /**** Rel 60E SP6 - FullScreen Support changes - End ***/
            }
            ,
            _getSectionIndex: function (section) {
                var oController = this,
                    curr_path,
                    sections,
                    i;
                curr_path = oController._getPath(true);
                sections = oController.getModel(oController.modelName).getProperty(curr_path);
                i = underscoreJS.indexOf(sections, section);
                return i;

            }
            ,
            _getObjectPageWithTabs: function () {
                var oController = this;
                var mainModel = oController.getOwnerComponent().getModel(global.vui5.modelName);
                var currentModel = oController.getCurrentModel();
                var path = oController._getPath(true);
                var objectPageLayout = oController.objectPageLayout = new sap.uxap.ObjectPageLayout({
                    useIconTabBar: true,
                    enableLazyLoading: true,
                    upperCaseAnchorBar: false,
                    navigate: [oController.onSectionChange, oController]
                }).addEventDelegate({
                    onAfterRendering: function (e) {
                        var tabRef = e.srcControl;
                        var currentKey = oController.getQueryParam('tab');
                        var currentModel = oController.getCurrentModel();
                        var scrollFlag;
                        var tabSections = tabRef.getSections(),
                            currSection,
                            currSectionId;
                        if (underscoreJS.isEmpty(tabSections)) {
                            return;
                        }
                        var flag = underscoreJS.find(tabSections, {
                            sId: oController._currentSectionKey
                        });
                        if (flag || oController.getQueryParam('subsectn')) {
                            currSectionId = oController._currentSectionKey;
                            oController._subSectionSelectID = null;
                        } else {
                            currSectionId = tabSections[0].getId();
                        }
                        if (!e.srcControl.overRideSelectedFn) {
                            var scrollToSectionFn = e.srcControl.getAggregation('_anchorBar')._requestScrollToSection;
                            e.srcControl.overRideSelectedFn = true;
                            e.srcControl.getAggregation('_anchorBar')._requestScrollToSection = function (sectionId, action) {
                                var controlRef = this,
                                    controlArgs = arguments,
                                    promise,
                                    sectionID = sectionId;
                                //*****Rel 60E_SP6
                                if (oController._currentSectionKey && sap.ui.getCore().byId(oController._currentSectionKey)) {

                                    var prevSectionId = sap.ui.getCore().byId(oController._currentSectionKey).data("id");
                                    oController.dashboardBufferFill(prevSectionId);
                                }
                                //*****
                                var subsectionsExists = sap.ui.getCore().byId(sectionID).getParent().getAggregation('subSections');
                                if (subsectionsExists) {
                                    var currSubSections = sap.ui.getCore().byId(sectionID).getParent().getSubSections();
                                    oController._currentSectionKey = sap.ui.getCore().byId(sectionID).getParent().sId;
                                    var flag = false;
                                    flag = currSubSections.length > 1;
                                    if (flag) {
                                        oController._subSectionID = sectionID;
                                    }
                                } else {
                                    oController._currentSectionKey = sectionID;
                                }
                                /*** Rel 60E SP7 QA #12504 **/
                                //var secId = this.getSelectedSection() ? this.getSelectedSection().data('id') : sap.ui.getCore().byId(oController._currentSectionKey).data('id');
                                var secId = this.getSelectedSection() ? this.getSelectedSection().data('id') : prevSectionId ? prevSectionId : sap.ui.getCore().byId(oController._currentSectionKey).data('id');
                                /***/
                                if (action) {
                                    promise = oController._UpdateChanges(secId, action, global.vui5.cons.updateCallFrom.tabChange);
                                } else {
                                    promise = oController._UpdateChanges(secId, null, global.vui5.cons.updateCallFrom.tabChange);
                                }
                                if (promise) {
                                    if (promise.then) {
                                        promise.then(function () {
                                            scrollToSectionFn.apply(controlRef, controlArgs);
                                        });

                                        return false;
                                    }
                                }
                                return scrollToSectionFn.apply(controlRef, controlArgs);
                            };
                            if (currentModel.getProperty("/SELECTED_SECTION")) {
                                var currentSection = underscoreJS.find(tabSections, function (sectn) {
                                    if (sectn.data("id") === currentModel.getProperty("/SELECTED_SECTION")) {
                                        return sectn;
                                    }
                                });

                                if (currentSection) {
                                    //currSectionId = currentSection.sId;
                                    currentModel.setProperty("/SELECTED_SECTION", "");
                                    scrollFlag = true;
                                    oController.objectPageLayout.getAggregation('_anchorBar')._requestScrollToSection(currentSection.getId());
                                }
                            }

                        }
                        if (!scrollFlag) {
                            jQuery.sap.delayedCall(500, tabRef, tabRef.scrollToSection, [currSectionId]);
                        }


                    }
                });


                oController.prepareDynamicHeaderTitle({
                    objectPageLayout: objectPageLayout
                });

                objectPageLayout.bindAggregation("sections", oController.modelName + ">" + path, function (sId, oContext) {
                    var contextObject = oContext.getObject(),
                        switchField,
                        currentTab,
                        preparePanelContent = false,
                        currSubSection,
                        subSectionKey,
                        path = oContext.getPath(),
                        index = path.substring(path.lastIndexOf("/") + 1, path.length);
                    var sectionModelFullPath = oController.modelName + ">" + path;
                    //*****Rel 60E_SP7 - QA #12658
                    if (oController._formDialog) {
                        currentTab = oController.getCurrentModel().getProperty("/POPUP_TAB");
                    }
                    else {
                        currentTab = oController.getQueryParam("tab") || "";
                    }
                    //*****                    
                    currSubSection = oController.getQueryParam("subsectn") || "";

                    if (contextObject['SCGRP'] != "") {
                        return new sap.uxap.ObjectPageSection({
                            visible: false
                        });
                    }
                    if (contextObject['FXSCT']) {

                        oController.prepareFixedSections({
                            contextObject: contextObject,
                            objectPageLayout: objectPageLayout
                        });


                        var objectPageSection = new sap.uxap.ObjectPageSection({
                            visible: false
                        });
                    } else {
                        if (contextObject['GRPNM']) {
                            var subsection;
                            var objectPageSection = new sap.uxap.ObjectPageSection({
                                // id:
                                // oController.createId(contextObject['SECTN']),
                                title: contextObject['DESCR'],
                                titleUppercase: false,
                                // visible: contextObject['HDSCT'] === '' && contextObject['SCGRP'] === ''
                                visible: oController.getBindingExpression("sectionVisible", contextObject, index)
                            }).data("id", contextObject['SECTN']);
                            oController.subSectionsArr = [];
                            underscoreJS.each(oController._getGroupingSections(contextObject['GRPNM']), function (obj, i) {
                                var blocksArr = [],
                                    sectionModelPath,
                                    curr_path,
                                    sectionIndex,
                                    path1;
                                curr_path = oController._getPath(true);
                                sectionIndex = oController._getSectionIndex(obj);
                                sectionModelPath = curr_path + sectionIndex;
                                path1 = oController.modelName + ">" + sectionModelPath + "/DESCR";
                                oController.showPanelContent(obj['SECTN']);
                                if (!underscoreJS.isEmpty(obj['FILTER'])) {
                                    var oBlock = oController.addFilterContent(obj);
                                    if (!underscoreJS.isEmpty(oBlock)) {
                                        underscoreJS.each(oBlock, function (ob, i) {
                                            blocksArr.push(ob);
                                        });

                                    }
                                }

                                switchField = oController._prepareSwitchField();
                                if (switchField) {
                                    blocksArr.push(switchField);
                                }
                                // blocksArr.push(oController.sectionRef[obj['SECTN']]);
                                if (!underscoreJS.isEmpty(blocksArr)) {
                                    var vLayout = new sap.ui.layout.VerticalLayout({
                                        width: '100%',
                                        content: [blocksArr, oController.sectionRef[obj['SECTN']]]
                                    });
                                    subsection = new sap.uxap.ObjectPageSubSection({
                                        title: obj['DESCR'],
                                        blocks: [vLayout]
                                    }).data("id", obj["SECTN"]);
                                } else {

                                    subsection = new sap.uxap.ObjectPageSubSection({
                                        title: obj['DESCR'],
                                        blocks: oController.sectionRef[obj['SECTN']]
                                    }).data("id", obj["SECTN"]);
                                    if (obj['DAPPT'] == global.vui5.cons.propertyType.table || obj['DAPPT'] == global.vui5.cons.propertyType.list) {
                                        var path2 = oController.modelName + ">/SECCFG/" + obj['SECTN'] + "/attributes/" + global.vui5.cons.attributes.maxItems;
                                        oController.setSectionTitle(path1, path2, subsection, obj['DAPPT']);
                                    } else if (obj['DAPPT'] == global.vui5.cons.propertyType.partners) {
                                        var path2 = oController.modelName + ">" + oController._getPath() + obj['DARID'] + "/";
                                        oController.setSectionTitle(path1, path2, subsection, obj['DAPPT']);
                                    } else if (obj['DAPPT'] == global.vui5.cons.propertyType.treeTable) {
                                        oController.setSectionTitle(path1, null, subsection, obj['DAPPT']);
                                    } else if (obj['DAPPT'] == global.vui5.cons.propertyType.attachments) {
                                        var descr_path = oController.modelName + ">/DATA/" + obj['DATAR'] + "__" + obj['DAQLF'] + "/TITLE";
                                        path2 = oController.modelName + ">" + oController._getPath() + obj['DARID'] + "/";
                                        oController.setSectionTitle(descr_path, path2, subsection, obj['DAPPT'], obj['DESCR']);
                                    } else if (obj['DAPPT'] == global.vui5.cons.propertyType.form && !underscoreJS.isEmpty(obj['FUNC'])) {

                                        oController.sectionRef[obj['SECTN']].getAggregation("_Form").getAggregation("form").getAggregation("toolbar")
                                            .getContent()[0].setVisible(false);
                                    }
                                }
                                if (currSubSection == obj["SECTN"]) {
                                    subSectionKey = subsection.getId();
                                }
                                objectPageSection.addSubSection(subsection);
                            })
                        } else {
                            var subsection;
                            var blocksArr = [];
                            var objectPageSection = new sap.uxap.ObjectPageSection({
                                // id:
                                // oController.createId(contextObject['SECTN']),
                                title: contextObject['DESCR'],
                                titleUppercase: false,
                                visible: oController.getBindingExpression("sectionVisible", contextObject, index)
                                //visible: contextObject['HDSCT'] === '' && contextObject['SCGRP'] === ''
                            }).data("id", contextObject['SECTN']);
                            oController.showPanelContent(contextObject['SECTN']);
                            if (!underscoreJS.isEmpty(contextObject['FILTER'])) {
                                var oBlock = oController.addFilterContent(contextObject);
                                if (!underscoreJS.isEmpty(oBlock)) {
                                    underscoreJS.each(oBlock, function (ob, i) {
                                        blocksArr.push(ob);
                                    });

                                }
                            }
                            switchField = oController._prepareSwitchField();
                            if (switchField) {
                                blocksArr.push(switchField);
                            }
                            // blocksArr.push(oController.sectionRef[contextObject['SECTN']]);
                            if (!underscoreJS.isEmpty(blocksArr)) {
                                var vLayout = new sap.ui.layout.VerticalLayout({
                                    width: '100%',
                                    content: [blocksArr, oController.sectionRef[contextObject['SECTN']]]
                                });
                                subsection = new sap.uxap.ObjectPageSubSection({
                                    blocks: [vLayout]
                                }).data("id", contextObject['SECTN']);
                            } else {
                                subsection = new sap.uxap.ObjectPageSubSection({
                                    blocks: oController.sectionRef[contextObject['SECTN']]
                                }).data("id", contextObject['SECTN']);
                            }
                            if (currSubSection == contextObject["SECTN"]) {
                                subSectionKey = subsection.getId();
                            }
                            objectPageSection.addSubSection(subsection);

                        }
                    }
                    if (currentTab === contextObject['SECTN']) {
                        if (currSubSection) {
                            oController._currentSectionKey = subSectionKey;
                        } else {
                            oController._currentSectionKey = objectPageSection.getId();
                        }
                        if (objectPageLayout.setSelectedSection) {
                            objectPageLayout.setSelectedSection(objectPageSection.getId());
                        }
                    } else if (currentTab == "" && sId.split('-')[1] == "0") {
                        oController._currentSectionKey = objectPageSection.getId();
                        if (objectPageLayout.setSelectedSection) {
                            objectPageLayout.setSelectedSection(objectPageSection.getId());
                        }
                    }
                    return objectPageSection;
                });

                return objectPageLayout;
            }
            ,
            /*** Rel 60E SP6 QA #11547  **/
            onLineLayoutSectionChange: function (oEvent) {
                var oController = this;
                var sectionID = oEvent.getParameter('section').data()['id'];
                var queryParams, subEntities;

                subEntities = oController.routeParams["all*"].split('?')[0];
                queryParams = oController.getQueryParams() || {};
                queryParams['tab'] = sectionID;

                oController.routeParams["all*"] = commonUtils.addQueryParams(subEntities, jQuery.param(queryParams));
                /*** Rel 60E SP7 QA #12698  **/
                //oController._scrollID = sectionID;
                oController._sectionKey = sectionID;
                /**Rel 60E SP7 QA #12698 End*/
                //*****Rel 60E_SP7
                oController.skipDataEvent = true;
                //*****

                if (!oController._formDialog) {
                    oController.getRouter().navTo(oController.currentRoute, oController.routeParams, true);
                }

            },
            /***/
            _getObjectPageContent: function () {
                var oController = this;
                var scrollID;
                var path = oController._getPath(true);
                var objectPageLayout = oController.objectPageLayout = new sap.uxap.ObjectPageLayout({
                    upperCaseAnchorBar: false,
                    /*** Rel 60E SP6 QA #11547  **/
                    navigate: [oController.onLineLayoutSectionChange, oController]
                    /***/
                });
                objectPageLayout.addEventDelegate({
                    onAfterRendering: function (e) {
                        var tabRef = e.srcControl;
                        /*** Rel 60E SP6 QA #11547  **/
                        //                        if (scrollID) {
                        //                            // var scrollID = oController._subSectionToSelect;
                        //                            // delete oController._subSectionToSelect;
                        //                            jQuery.sap.delayedCall(500, tabRef, tabRef.scrollToSection, [scrollID]);
                        //                        }
                        var oController = tabRef.data('controller');
                        var scrollSectionID;
                        ///*** Rel 60E SP7 QA #12698 -Start **/
                        //                        //*****Rel 60E_SP7
                        /**bookmarking**/
                        var currentKey = oController.getQueryParam('tab'), currentSectionID, flag;
                        var tabSections = tabRef.getSections();
                        var flag = underscoreJS.find(tabSections, function (sectn) {
                            if (sectn.data("id") === currentKey) {
                                currentSectionID = sectn.getId();
                                return currentSectionID;
                            }
                        });
                        if (flag && currentSectionID) {
                            scrollID = currentSectionID;
                        }
                        /***/
                        ///** Rel 60E SP7 QA #12698 -End**/
                        var currentModel = oController.getCurrentModel();
                        if (currentModel.getProperty("/SELECTED_SECTION")) {
                            var currentSection = underscoreJS.find(tabSections, function (sectn) {
                                if (sectn.data("id") === currentModel.getProperty("/SELECTED_SECTION")) {
                                    return sectn;
                                }
                            });

                            if (currentSection) {
                                currentModel.setProperty("/SELECTED_SECTION", "");
                                scrollID = currentSection.getId();
                            }
                        }
                        //*****
                        /*** Rel 60E SP7 QA #12698 -Start**/
                        //scrollSectionID = oController._scrollID ? oController._scrollID : scrollID
                        scrollSectionID = scrollID ? scrollID : oController._scrollID;
                        /**Rel 60E SP7 QA #12698 -End**/
                        if (scrollSectionID) {
                            // var scrollID = oController._subSectionToSelect;
                            // delete oController._subSectionToSelect;
                            jQuery.sap.delayedCall(500, tabRef, tabRef.scrollToSection, [scrollSectionID]);
                        }
                        /****/

                    }
                });
                /*** Rel 60E SP6 QA #11547  **/
                objectPageLayout.data('controller', oController);
                /***/

                oController.prepareDynamicHeaderTitle({
                    objectPageLayout: objectPageLayout
                });


                objectPageLayout.bindAggregation("sections", oController.modelName + ">" + path, function (sId, oContext) {

                    var selectedSection = oController._sectionKey ? oController._sectionKey : "",
                        switchField,
                        index;
                    var selectedSubSection = oController._subSectionKey ? oController._subSectionKey : "";
                    var path = oContext.getPath(),
                        index = path.substring(path.lastIndexOf("/") + 1, path.length);

                    var contextObject = oContext.getObject(),
                        subSectionToSelect;
                    if (contextObject['SCGRP'] != "") {
                        return new sap.uxap.ObjectPageSection({
                            visible: false
                        });
                    }
                    if (contextObject['FXSCT']) {
                        oController.prepareFixedSections({
                            contextObject: contextObject,
                            objectPageLayout: objectPageLayout
                        });

                        var objectPageSection = new sap.uxap.ObjectPageSection(oController.createId('dummySection'), {
                            visible: false
                        });

                    } else {
                        if (contextObject['GRPNM'] != "") {

                            var objectPageSection = new sap.uxap.ObjectPageSection({
                                // id:
                                // oController.createId(contextObject['SECTN']),
                                title: contextObject['DESCR'],
                                titleUppercase: false,
                                visible: oController.getBindingExpression("sectionVisible", contextObject, index)
                                //visible: contextObject['HDSCT'] === '' && contextObject['SCGRP'] === ''
                            }).data("id", contextObject['SECTN']);
                            ;
                            oController.subSectionsArr = [];
                            underscoreJS.each(oController._getGroupingSections(contextObject['GRPNM']), function (obj, i) {
                                var blocksArr = [],
                                    sectionModelPath,
                                    curr_path,
                                    sectionIndex,
                                    path1,
                                    path2;
                                curr_path = oController._getPath(true);
                                sectionIndex = oController._getSectionIndex(obj);
                                sectionModelPath = curr_path + sectionIndex;
                                path1 = oController.modelName + ">" + sectionModelPath + "/DESCR";

                                oController.showPanelContent(obj['SECTN']);
                                if (!underscoreJS.isEmpty(obj['FILTER'])) {
                                    var oBlock = oController.addFilterContent(obj);
                                    if (!underscoreJS.isEmpty(oBlock)) {
                                        underscoreJS.each(oBlock, function (ob, i) {
                                            blocksArr.push(ob)
                                        });

                                    }
                                }

                                switchField = oController._prepareSwitchField();
                                if (switchField) {
                                    blocksArr.push(switchField);
                                }
                                // blocksArr.push(oController.sectionRef[obj['SECTN']]);
                                if (!underscoreJS.isEmpty(blocksArr)) {
                                    var vLayout = new sap.ui.layout.VerticalLayout({
                                        width: '100%',
                                        content: [blocksArr, oController.sectionRef[obj['SECTN']]]
                                    });

                                    var subsection = new sap.uxap.ObjectPageSubSection({
                                        title: obj['DESCR'],
                                        blocks: [vLayout]
                                    }).data('id', obj['SECTN']);

                                } else {
                                    var subsection = new sap.uxap.ObjectPageSubSection({
                                        title: obj['DESCR'],
                                        blocks: oController.sectionRef[obj['SECTN']]
                                    }).data('id', obj['SECTN']);

                                    if (obj['DAPPT'] == global.vui5.cons.propertyType.table || obj['DAPPT'] == global.vui5.cons.propertyType.list) {
                                        path2 = oController.modelName + ">/SECCFG/" + obj['SECTN'] + "/attributes/" + global.vui5.cons.attributes.maxItems;
                                        oController.setSectionTitle(path1, path2, subsection, obj['DAPPT']);
                                    } else if (obj['DAPPT'] == global.vui5.cons.propertyType.partners) {
                                        path2 = oController.modelName + ">" + oController._getPath() + obj['DARID'] + "/";
                                        oController.setSectionTitle(path1, path2, subsection, obj['DAPPT']);
                                    } else if (obj['DAPPT'] == global.vui5.cons.propertyType.attachments) {
                                        var descr_path = oController.modelName + ">/DATA/" + obj['DATAR'] + "__" + obj['DAQLF'] + "/TITLE";
                                        path2 = oController.modelName + ">" + oController._getPath() + obj['DARID'] + "/";
                                        oController.setSectionTitle(descr_path, path2, subsection, obj['DAPPT'], obj['DESCR']);
                                    } else if (obj['DAPPT'] == global.vui5.cons.propertyType.treeTable) {
                                        oController.setSectionTitle(path1, null, subsection, obj['DAPPT']);
                                    } else if (obj['DAPPT'] == global.vui5.cons.propertyType.form && !underscoreJS.isEmpty(obj['FUNC'])) {
                                        oController.sectionRef[obj['SECTN']].getAggregation("_Form").getAggregation("form").getAggregation("toolbar")
                                            .getContent()[0].setVisible(false);
                                    }
                                }
                                if (selectedSubSection === obj['SECTN']) {
                                    subSectionToSelect = subsection
                                }
                                if (selectedSection === contextObject['SECTN']) {
                                    sectionToSelect = objectPageSection
                                }
                                objectPageSection.addSubSection(subsection);
                            })
                        } else {

                            var subsection;
                            var blocksArr = [],
                                sectionModelPath,
                                curr_path,
                                sectionIndex,
                                path1,
                                path2;
                            var objectPageSection = new sap.uxap.ObjectPageSection({
                                // id:
                                // oController.createId(contextObject['SECTN']),
                                title: contextObject['DESCR'],
                                titleUppercase: false,
                                visible: oController.getBindingExpression("sectionVisible", contextObject, index)
                                //visible: contextObject['HDSCT'] === '' && contextObject['SCGRP'] === ''
                            }).data("id", contextObject['SECTN']);
                            oController.showPanelContent(contextObject['SECTN']);
                            curr_path = oController._getPath(true);
                            sectionIndex = oController._getSectionIndex(contextObject);
                            sectionModelPath = curr_path + sectionIndex;
                            path1 = oController.modelName + ">" + sectionModelPath + "/DESCR";
                            if (contextObject['DAPPT'] == global.vui5.cons.propertyType.table || contextObject['DAPPT'] == global.vui5.cons.propertyType.list) {
                                path2 = oController.modelName + ">/SECCFG/" + contextObject['SECTN'] + "/attributes/" + global.vui5.cons.attributes.maxItems;
                                oController.setSectionTitle(path1, path2, objectPageSection, contextObject['DAPPT']);
                            } else if (contextObject['DAPPT'] == global.vui5.cons.propertyType.partners) {
                                path2 = oController.modelName + ">" + oController._getPath() + contextObject['DARID'] + "/";
                                oController.setSectionTitle(path1, path2, objectPageSection, contextObject['DAPPT']);
                            } else if (contextObject['DAPPT'] == global.vui5.cons.propertyType.treeTable) {
                                oController.setSectionTitle(path1, null, objectPageSection, contextObject['DAPPT']);
                            } else if (contextObject['DAPPT'] == global.vui5.cons.propertyType.attachments) {
                                var descr_path = oController.modelName + ">/DATA/" + contextObject['DATAR'] + "__" + contextObject['DAQLF'] + "/TITLE";
                                path2 = oController.modelName + ">" + oController._getPath() + contextObject['DARID'] + "/";
                                oController.setSectionTitle(descr_path, path2, objectPageSection, contextObject['DAPPT'], contextObject['DESCR']);
                            } else if (contextObject['DAPPT'] == global.vui5.cons.propertyType.form && !underscoreJS.isEmpty(contextObject['FUNC'])) {
                                //objectPageSection.setTitle(null);
                                oController.sectionRef[contextObject['SECTN']].getAggregation("_Form").getAggregation("form").getAggregation("toolbar")
                                    .getContent()[0].setVisible(false);
                            }
                            if (!underscoreJS.isEmpty(contextObject['FILTER'])) {
                                var oBlock = oController.addFilterContent(contextObject);
                                if (!underscoreJS.isEmpty(oBlock)) {
                                    underscoreJS.each(oBlock, function (ob, i) {
                                        blocksArr.push(ob)
                                    });

                                }
                            }
                            switchField = oController._prepareSwitchField();
                            if (switchField) {
                                blocksArr.push(switchField);
                            }
                            // blocksArr.push(oController.sectionRef[contextObject['SECTN']]);
                            if (!underscoreJS.isEmpty(blocksArr)) {
                                var vLayout = new sap.ui.layout.VerticalLayout({
                                    width: '100%',
                                    content: [blocksArr, oController.sectionRef[contextObject['SECTN']]]
                                });

                                subsection = new sap.uxap.ObjectPageSubSection({
                                    blocks: [vLayout]
                                }).data('id', contextObject['SECTN']);

                            } else {
                                subsection = new sap.uxap.ObjectPageSubSection({
                                    blocks: oController.sectionRef[contextObject['SECTN']]
                                }).data('id', contextObject['SECTN']);

                            }
                            if (selectedSubSection === contextObject['SECTN']) {
                                subSectionToSelect = subsection;
                                //scrollID = subsection.getId();
                            }
                            if (selectedSection === contextObject['SECTN']) {
                                sectionToSelect = objectPageSection;

                            }
                            objectPageSection.addSubSection(subsection);

                        }

                    }
                    if (selectedSection === contextObject['SECTN']) {
                        if (objectPageLayout.setSelectedSection) {
                            objectPageLayout.setSelectedSection(objectPageSection.getId());
                            scrollID = objectPageSection.getId();
                        }
                        if (selectedSubSection && subSectionToSelect) {
                            objectPageSection.setAssociation("selectedSubSection", subSectionToSelect, true);
                            scrollID = subSectionToSelect.getId();
                        }
                    }
                    return objectPageSection;
                });
                return objectPageLayout;
            },

            _determinePopupSection: function (action) {
                var oController = this;
                if (oController._formDialog && oController._formDialog['UILYT']) {
                    if (action['FNCNM'] === global.vui5.cons.eventName.continue) {
                        return "";
                    }

                    if (oController._formDialog['UILYT'] === global.vui5.cons.layoutType.tab &&
                        oController.tabBar) {
                        return oController.tabBar.getSelectedKey();
                    }

                    if (oController._formDialog['UILYT'] === global.vui5.cons.layoutType.pageWithTabs &&
                        oController.objectPageLayout) {

                        return sap.ui.getCore().byId(oController.objectPageLayout.getSelectedSection()).data("id");
                    }



                }
                else {
                    return "";
                }

            },

            _determineDataAreasToUpdate: function (sectionID, skipCurrentSection, action) {
                var oController = this,
                    lineLayout,
                    section,
                    oSelectionSection,
                    sections,
                    updateSections;
                sections = oController.getSections();
                var dataArea = [];
                lineLayout = oController.getProfileInfo()['UILYT'] === global.vui5.cons.layoutType.line;


                if (oController._formDialog &&
                    oController._formDialog['UILYT'] &&
                    oController._formDialog['UILYT'] !== global.vui5.cons.layoutType.line) {
                    lineLayout = false;
                }

                if (!sectionID && oController._formDialog) {
                    sectionID = oController._determinePopupSection(action);
                    /*In Case of Page Layout/Tabbed layout in Popup, we have to determine selected section
                    */
                }

                oSelectionSection = oController.getSectionBy('DAPPT', global.vui5.cons.propertyType.selections);
                if (!sectionID && oController._formDialog) {
                    return sectionID;
                } else if (!sectionID) {
                    sectionID = oController.getQueryParam("tab") || sections[0]['SECTN'];
                }
                section = oController.getSectionBy('SECTN', sectionID) || {};
                if (lineLayout) {
                    if (skipCurrentSection) {
                        updateSections = underscoreJS.filter(sections, function (section) {
                            return section['SECTN'] !== sectionID && section['DAPPT'] !== global.vui5.cons.propertyType.sets;
                        });

                        underscoreJS.each(updateSections, function (sectn) {
                            if (sectn['HDSCT'] === '' && sectn['GRPNM'] === '') {
                                dataArea.push(sectn['DARID']);
                            }
                        });
                        // dataArea = underscoreJS.pluck(updateSections, 'DARID') || [];
                    } else if (oController.getProfileInfo()['UITYP'] !== global.vui5.cons.UIType.worklist || oController._formDialog) {
                        if (underscoreJS.isEmpty(action['SECTN'])) {
                            underscoreJS.each(sections, function (sectn) {
                                if (sectn['HDSCT'] === '' && sectn['GRPNM'] === '') {
                                    dataArea.push(sectn['DARID']);
                                }
                            });
                            //dataArea = underscoreJS.pluck(sections, 'DARID');
                        } else {
                            if (section['DAPPT'] === global.vui5.cons.propertyType.variant) {
                                dataArea.push(oSelectionSection['DARID']);
                            } else {
                                dataArea.push(underscoreJS.findWhere(sections, {
                                    'SECTN': sectionID
                                })['DARID']);
                            }
                        }
                    }

                    return {
                        'DATAAREA': underscoreJS.isEmpty(dataArea) ? '' : dataArea,
                        'SECTIONID': sectionID
                    };

                }

                if (section['GRPNM'] || section['SCGRP']) {
                    oController.subSectionsArr = [];
                    underscoreJS.each(oController._getGroupingSections(section['GRPNM'] || section['SCGRP']), function (grpSection) {

                        if (grpSection['SECTN'] === sectionID) {
                            if (skipCurrentSection) {
                                return;
                            } else {
                                dataArea.push(grpSection['DARID']);
                            }
                        } else {
                            //if (!skipCurrentSection) {
                            if (skipCurrentSection && grpSection['SECTN'] != sectionID) {
                                dataArea.push(grpSection['DARID']);
                            } else {
                                return;
                            }
                        }

                    });
                } else {
                    if (section['DARID']) {
                        dataArea.push(section['DARID']);
                    }

                    if (section['DAPPT'] === global.vui5.cons.propertyType.variant) {
                        dataArea.push(oSelectionSection['DARID']);
                    }
                }

                return {
                    'DATAAREA': underscoreJS.isEmpty(dataArea) ? '' : dataArea,
                    'SECTIONID': sectionID
                };


            }
            ,
            _updateSectionConfig: function (sections) {
                var oController = this,
                    sectionConfig,
                    currentSection,
                    currentTabSection,
                    flag,
                    lineLayout;

                //*****Rel 60E_SP7 - QA #11929
                //var lineLayout = oController.getProfileInfo()['UILYT'];
                if (oController._formDialog) {
                    if (underscoreJS.isEmpty(oController._formDialog["UILYT"])) {
                        lineLayout = global.vui5.cons.layoutType.line;
                    } else {
                        lineLayout = oController._formDialog["UILYT"]
                    }
                } else {
                    lineLayout = oController.getProfileInfo()['UILYT'];
                }
                //*****

                /**tabbed layout support in popup**/
                // if (lineLayout == global.vui5.cons.layoutType.line || lineLayout === global.vui5.cons.layoutType.pageWithTabs || oController._formDialog) {
                if (lineLayout == global.vui5.cons.layoutType.line || lineLayout === global.vui5.cons.layoutType.pageWithTabs) {
                    /****/
                    underscoreJS.each(sections, function (section) {
                        oController._sectionConfigPrepare(section);
                    });
                } else if (lineLayout === global.vui5.cons.layoutType.tab) {
                    /*
            * if (oController.getQueryParam("tab")) { var
            * currentTabSection = oController.getSectionBy("SECTN",
            * oController.getQueryParam("tab"));
            *
            * if (currentTabSection && currentTabSection['GRPNM']) {
            * underscoreJS.each(oController._getGroupingSections(currentTabSection['GRPNM']),
            * function(obj, i) {
            * oController._sectionConfigPrepare(obj); }); } else {
            * currentSection = underscoreJS.findWhere(sections, { 'SECTN':
            * oController.getQueryParam("tab") }); /*
            * underscoreJS.each(oController._getGroupingSections(currentSection['GRPNM']),
            * function(obj, i) {
            * oController._sectionConfigPrepare(obj); }); }
            *  } else { currentSection = sections[0];
            * oController._sectionConfigPrepare(currentSection); }
            */
                    /**tabbed layout support in popup**/
                    //                    if (oController.getQueryParam("tab")) {
                    //                        var currSection = oController.getSectionBy("SECTN", oController.getQueryParam("tab"));
                    //                        if (currSection) {
                    //                            flag = true;
                    //                        }
                    //                        currentTabSection = currSection || underscoreJS.find(sections, {
                    //                            'SECTN': oController.getQueryParam("tab")
                    //                        })
                    //
                    //                    } 
                    if (oController._formDialog) {
                        section = oController.getCurrentModel().getProperty("/POPUP_TAB");
                    }
                    else {
                        section = oController.getQueryParam("tab")
                    }
                    if (section) {
                        var currSection = oController.getSectionBy("SECTN", section);
                        if (currSection) {
                            flag = true;
                        }
                        currentTabSection = currSection || underscoreJS.find(sections, {
                            'SECTN': section
                        })

                    }
                    /****/
                    else {
                        currentTabSection = sections[0];
                    }
                    if (currentTabSection['GRPNM']) {
                        var sectionsToGrp;
                        if (!flag) {
                            sectionsToGrp = sections;
                        }
                        oController.subSectionsArr = [];
                        underscoreJS.each(oController._getGroupingSections(currentTabSection['GRPNM'], sectionsToGrp), function (obj, i) {
                            oController._sectionConfigPrepare(obj);
                        });

                    } else {
                        oController._sectionConfigPrepare(currentTabSection);
                    }
                    var fixedSection = oController.getSectionBy("FXSCT", "X") || underscoreJS.find(sections, { FXSCT: "X" });
                    if (fixedSection) {
                        oController._sectionConfigPrepare(fixedSection);
                    }
                }

            }
            ,
            _sectionConfigPrepare: function (obj) {
                var oController = this;
                var sectionConfig = oController.sectionConfig[obj['SECTN']] = {
                    keyField: global.vui5.rowID,
                    fields: {},
                    metaDataLoaded: false
                };
                switch (obj[global.vui5.cons.propName.loadMetaData]) {
                    case global.vui5.cons.loadMetaData.once:
                        sectionConfig.metaDataLoaded = true;
                        break;
                }
            }
            ,
            _modalDialogPrepare: function (action) {
                if (action['FNCNM'] === global.vui5.cons.eventName.setValues) {
                    this._setValuesAction = action;
                    return;
                }
                var oController = this;
                oController._formDialog = action;
                var pageObject = oController.getViewContent(action);
                var model = oController.getCurrentModel();
                // var title = model.getProperty("/POPUP_TITLE");
                pageObject.setModel(oController.getModel(oController.modelName), oController.modelName);
                oController._popup = new sap.m.Dialog({
                    // title: title ? title : action['DESCR'],
                    content: [pageObject],
                    resizable: true,
                    draggable: true,
                    //contentHeight: "40%",
                    //contentWidth: "42%",
                    // stretch: oController.getBindingExpression('fullView')
                    // model.getProperty("/FULL_VIEW") ? true : false
                }).bindProperty("title", oController.modelName + ">/POPUP_TITLE", function (title) {
                    return title ? title : action['DESCR']
                }, sap.ui.model.BindingMode.OneWay)
                    .bindProperty("stretch", {
                        parts: [
                            {
                                path: oController.modelName + ">/POPUP_PROP/FLVIW"
                            }
                        ],
                        formatter: function (fullscreen) {
                            var flag = fullscreen === "X" ? true : false;
                            return flag;
                        },
                        mode: sap.ui.model.BindingMode.OneWay
                    })
                    .bindProperty("contentHeight", {
                        parts: [
                            {
                                path: oController.modelName + ">/POPUP_PROP/HEIGHT"
                            },
                            {
                                path: oController.modelName + ">/POPUP_PROP/FLVIW"
                            }
                        ],
                        formatter: function (height, fullView) {
                            if (fullView === 'X') {
                                return "";
                            }
                            return height && height != '000' ? height + "%" : "40%";
                        },
                        mode: sap.ui.model.BindingMode.OneWay
                    })
                    .bindProperty("contentWidth", {
                        parts: [
                            {
                                path: oController.modelName + ">/POPUP_PROP/WIDTH"

                            },
                            {
                                path: oController.modelName + ">/POPUP_PROP/FLVIW"
                            }
                        ],
                        formatter: function (width, fullView) {
                            if (fullView === 'X') {
                                return "";
                            }
                            return width && width != '000' ? width + "%" : "42%";
                        },
                        mode: sap.ui.model.BindingMode.OneWay
                    });
                oController._popup.setModel(oController.getMainModel(), global.vui5.modelName);
                oController._popup.setModel(oController.getModel(oController.modelName), oController.modelName);
                if (!jQuery.support.touch) { // apply compact mode if touch
                    // is not supported
                    oController._popup.addStyleClass("sapUiSizeCompact");
                }

                function sizeChanged(mParams) {
                    var bSmallSize = mParams.name === "Phone";
                    if (bSmallSize) {
                        oController._popup.setStretch(true);
                    } else {
                        oController._popup.setStretch(false);
                    }
                }
                ;
                sap.ui.Device.media.attachHandler(sizeChanged, null, sap.ui.Device.media.RANGESETS.SAP_STANDARD);
                sizeChanged(sap.ui.Device.media.getCurrentRange(sap.ui.Device.media.RANGESETS.SAP_STANDARD));

            }
            ,
            _popupClose: function (popup_close) {
                var oController = this;
                var mainModel = oController.getMainModel();
                var currentModel = oController.getCurrentModel();
                if (popup_close) {
                    mainModel.setProperty("/POPUP_MESSAGES", []);

                    if (oController._popup) {
                        oController._popup.close();
                        oController._popup.destroy();
                        oController._popup = undefined;
                    }
                    delete oController._formDialog;
                    oController._bufferSectionConfig();
                    currentModel.setProperty("/POPUP_TAB", "");
                }
            }
            ,
            _processTilesGroup: function (cfg) {
                var oController = this;
                var section,
                    index,
                    sectionID,
                    sectionConfig;

                var model = oController.getModel(oController.modelName);
                section = cfg.section;
                index = cfg.index;
                sectionID = section['SECTN'];
                var dataPath = oController._getPath();
                var mainModel = oController.getModel(global.vui5.modelName);

                var dmode = mainModel.getProperty("/DOCUMENT_MODE");
                var editable = (dmode !== global.vui5.cons.mode.display && section['DISOL'] === '');
                sectionConfig = oController.sectionConfig[sectionID];

                if (sectionConfig.attributes[global.vui5.cons.attributes.onTileClick]) {
                    sectionConfig.onTileClick = underscoreJS.findWhere(cfg.section['FUNC'], {
                        FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onTileClick]
                    });
                }
                oController.sectionRef[section['SECTN']] = new global.vui5.ui.controls.TilesGroup({
                    controller: oController,
                    dataPath: dataPath + section['DARID'] + "/",
                    tileClick: function (oEvent) {
                        oController.processAction(sectionID, sectionConfig.onTileClick, oEvent.getParameter("tileData"));
                    }
                });
                oController.sectionRef[sectionID].setGroupBy("SCGRP");
                oController.sectionRef[sectionID].tilesInfocusSet();
                oController.sectionRef[sectionID].setModel(model, oController.modelName);
            }
            ,


            _specialCharacterReplace: function (fieldName) {
                if (!fieldName) {
                    return;
                }
                var field,
                    regex;
                field = fieldName;
                if (parseInt(fieldName.charAt(0)) || parseInt(fieldName.charAt(0)) === 0) {
                    field = global.vui5.cons.specialCharacters.numeric + fieldName;
                } else if (fieldName.indexOf(global.vui5.cons.specialCharacters.numeric) !== -1) {
                    field = field.replace(global.vui5.cons.specialCharacters.numeric, "");
                } else if (fieldName.indexOf("/") !== -1) {
                    field = field.replace(/\//g, global.vui5.cons.specialCharacters.slash);
                } else if (fieldName.indexOf(global.vui5.cons.specialCharacters.slash) !== -1) {
                    //regex = '/' + global.vui5.cons.specialCharacters.slash + '/g';
                    field = field.replace(/_-/g, "/");
                }
                else if (fieldName.substr(0, 2) === "<0") {
                    field = field.replace(field.substr(0, 2), "<" + global.vui5.cons.specialCharacters.numeric + 0);
                }

                return field;
            }
            ,

            _determineSection: function (config) {
                var oController = this,
                    section;
                section = oController.getSectionBy("SECTN", config.sectionId);
                if (!section || section['FXSCT']) {
                    if (oController.getQueryParam("tab")) {
                        section = oController.getSectionBy("SECTN", oController.getQueryParam("tab"));
                    } else {
                        section = underscoreJS.find(oController.getSections(), function (sectn) {
                            if (sectn['HDSCT'] === '' && sectn['FXSCT'] === '') {
                                return sectn;
                            }
                        });
                    }
                }

                return section;
            }
            ,

            _skipListRepDataReq: function () {
                var oController = this,
                    currentModel,
                    variantData,
                    variantSection,
                    currentVariant;
                if (oController.getProfileInfo()['UITYP'] === global.vui5.cons.UIType.worklist) {
                    currentModel = oController.getCurrentModel();
                    variantSection = oController.getSectionBy("DAPPT", global.vui5.cons.propertyType.variant) || {};
                    variantData = currentModel.getProperty("/DATA/" + variantSection['DARID']);
                    currentVariant = underscoreJS.findWhere(variantData, {
                        'SELVAR': 'X'
                    }) || {};

                    if (currentVariant['EXESL']) {
                        oController._skipRequest = true;
                    }
                }
            }
            ,
            /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - Start ***/
            _isMultiInputField: function (source) {
                return source ? source.data(global.vui5.cons.fromTableForm) || false : false;
            }
            ,

            _prepareMultiTokenField: function (data, node) {
                var oController = this, section, multiInputFields, daridSections;

                /***Rel 60E SP6 QA #12006 - Start */
                //section = oController.getSectionBy("DARID", node);

                daridSections = underscoreJS.where(oController.getSections(), {
                    'DARID': node,
                    'FXSCT': ''
                });

                if (daridSections.length === 0) {
                    daridSections = underscoreJS.where(oController.getSections(), {
                        'DARID': node,
                        'FXSCT': 'X'
                    });
                }


                /***Rel 60E SP6 QA #12006 - End */
                if (underscoreJS.isEmpty(daridSections) || underscoreJS.isEmpty(data[node])) {
                    return;
                }

                underscoreJS.each(daridSections, function (section) {


                    multiInputFields = underscoreJS.where(section['FIELDS'], { 'MULTISELECT': 'X', 'MVLFLD': '' });
                    underscoreJS.each(multiInputFields, function (fields) {
                        underscoreJS.each((section['DAPPT'] === global.vui5.cons.propertyType.form || section['DAPPT'] === global.vui5.cons.propertyType.snappingHeader) ? [data[node]] : data[node], function (data) {
                            var keyValues = [], textValues = [], finalValues = [];
                            data[fields['FLDNAME'] + global.vui5.cons.multiValueField] = [];
                            if (data[fields['FLDNAME']]) {
                                //data[fields['FLDNAME'] + global.vui5.cons.multiValueField] = data[fields['FLDNAME']].split(",");
                                keyValues = data[fields['FLDNAME']].split(",");
                            }

                            if (fields['TXTFL']) {
                                if (data[fields['TXTFL']]) {
                                    //data[fields['TXTFL'] + global.vui5.cons.multiValueField] = data[fields['TXTFL']].split(",");
                                    textValues = data[fields['TXTFL']].split(",");
                                    data[fields['TXTFL']] = '';
                                }

                            }

                            finalValues = [];
                            underscoreJS.each(keyValues, function (keyValue, index) {
                                finalValues[index] = {};
                                finalValues[index][fields['FLDNAME']] = keyValue;
                                if (fields['TXTFL']) {
                                    if (fields['SDSCR'] === global.vui5.cons.fieldValue.value_descr) {
                                        finalValues[index][fields['TXTFL']] = keyValue + " " + textValues[index];
                                    }
                                    else {
                                        finalValues[index][fields['TXTFL']] = textValues[index];
                                    }
                                }
                                /*finalValues.push({
                                    "KEY": keyValue,
                                    "TEXT": fields['TXTFL'] ? textValues[index] : keyValue
                                });*/
                            });
                            data[fields['FLDNAME'] + global.vui5.cons.multiValueField] = finalValues;


                        });

                    });
                });


            }
            ,

            _fillMultiValueField: function (source, fieldInfo) {
                var oController = this, currentModel, path;
                path = oController._getMultiInputDataPath(source);
                currentModel = oController.getCurrentModel();
                if (source.data("tokenValues") !== null) {
                    currentModel.setProperty(path, source.data("tokenValues"));
                    path = path.replace(fieldInfo['FLDNAME'] + global.vui5.cons.multiValueField, fieldInfo['FLDNAME']);
                    currentModel.setProperty(path, underscoreJS.pluck(source.data("tokenValues"), "KEY").join(","));
                }

            },

            _getMultiInputDataPath: function (source) {
                return source.getBinding("tokens").getContext().getPath() + "/" + source.getBinding("tokens").getPath();
            },
            /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - End ***/

            /****Rel 60E SP6 QA #9779 - Start ***/
            checkNumericValue: function (control) {
                var oController = this, mainModel, useCommaAsDecimalSeparator, noDecimalSeparator = true,
                    allowSign = false;
                mainModel = oController.getMainModel();
                control.attachBrowserEvent("keyup", function (e) {
                    var v = this._$input.val();
                    if (false) {
                    } else if (v) {
                        if (!noDecimalSeparator) {
                            v = (v[0] === '-' ? '-' : '') +
                                (useCommaAsDecimalSeparator ?
                                    v.replace(/[^0-9\,]/g, '') :
                                    v.replace(/[^0-9\.]/g, ''));

                            if (useCommaAsDecimalSeparator) {
                                v = v.replace(/,(?=(.*),)+/g, '');
                            } else {
                                v = v.replace(/\.(?=(.*)\.)+/g, '');
                            }
                        }
                        else {
                            var sign;
                            sign = v[0] === '-' ? '-' : '';
                            v = v.replace(/[^0-9\,]/g, '');
                            v = v.replace(/[^0-9\.]/g, '');
                            if (allowSign) {
                                v = sign + v;
                            }
                        }
                        jQuery(this._$input).val(v);
                    }
                });

                control.attachBrowserEvent("keydown", function (e) {
                    var key = e.which || e.keyCode; // http://keycode.info/
                    if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
                        // alphabet
                        key >= 65 && key <= 90 ||
                        // spacebar
                        key == 32) {
                        e.preventDefault();
                        return false;
                    }
                    if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
                        // numbers
                        key >= 48 && key <= 57 ||
                        // Numeric keypad
                        key >= 96 && key <= 105 ||
                        // allow: Ctrl+A
                        (e.keyCode == 65 && e.ctrlKey === true) ||
                        // allow: Ctrl+C
                        (key == 67 && e.ctrlKey === true) ||
                        // Allow: Ctrl+X
                        (key == 88 && e.ctrlKey === true) ||
                        // allow: home, end, left, right
                        (key >= 35 && key <= 39) ||
                        // Backspace and Tab and Enter
                        key == 8 || key == 9 || key == 13 ||
                        // Del and Ins
                        key == 46 || key == 45) {
                        return true;
                    }
                    var v = this._$input.val(); // v can be null, in case textbox is number and does not valid
                    // if minus, dash
                    if (key == 109 || key == 189) {
                        // if already has -, ignore the new one
                        if (v[0] === '-') {
                            // console.log('return, already has - in the beginning');
                            return false;
                        }
                    }
                    if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
                        // comma, period and numpad.dot
                        key == 190 || key == 188 || key == 110) {
                        // console.log('already having comma, period, dot', key);
                        if (/[\.,]/.test(v)) {
                            // console.log('return, already has , . somewhere');
                            return false;
                        }
                    }
                });

            },
            /****Rel 60E SP6 QA #9779 - End ***/

            isVuiMultiInputField: function (source) {
                if (source.vuiParentControl) {
                    return true;
                }
                else if (source.data("vuiControl")) {
                    source.vuiParentControl = source.data("vuiControl");
                    return true;
                }
                else {
                    return false;
                }

            },



            applyTotalSubTotal: function (data, node) {

                var oController = this, totalSubTotal = {}, currentModel = this.getCurrentModel();

                currentModel.setProperty(oController._getPath() + node.substr(0, node.lastIndexOf("_")) + "_TOTAL", totalSubTotal);

                if (underscoreJS.isEmpty(data[node])) {
                    return;
                }

                if (node.indexOf(global.vui5.cons.nodeName.layout) !== -1) {
                    if (underscoreJS.isEmpty(data[node.substr(0, node.lastIndexOf("_"))])) {
                        return;
                    }
                }

                totalSubTotal['TOTAL'] = oController.prepareTotal(data, node);

                totalSubTotal['GRP_TOTAL'] = oController.prepareSubTotal(data, node);

                totalSubTotal['MAX'] = oController.prepareMaxValue(data, node);

                totalSubTotal['MIN'] = oController.prepareMinValue(data, node);

                totalSubTotal['AVG'] = oController.prepareAvgValue(data, node);

                currentModel.setProperty(oController._getPath() + node.substr(0, node.lastIndexOf("_")) + "_TOTAL", totalSubTotal);
            },

            prepareMinValue: function (data, node) {
                var oController = this, section, minColumns = [], minColumnsData = {}, layoutData;
                section = oController.getSectionBy("DARID", node.substr(0, node.lastIndexOf("_")));

                layoutData = data[node];
                if (!layoutData) {
                    return {};
                }

                underscoreJS.each(layoutData['AGRGTITEMS'], function (item) {
                    var columnItem = underscoreJS.findWhere(section['FIELDS'], {
                        'FLDNAME': item['COLUMNKEY']
                    });

                    if (columnItem && (item['AGGAT'] === global.vui5.cons.aggregate.minimum)) {
                        minColumns.push(columnItem);
                    }

                });

                return oController.determineMinValue(minColumns, data, node);

            },

            determineAvgValue: function (columns, values) {
                var oController = this, avgColumnsData = {};

                underscoreJS.each(columns, function (field) {
                    avgColumnsData[field['FLDNAME']] = underscoreJS.pluck(values, field['FLDNAME']).reduceRight(function (a, b) { return a + b; })

                    avgColumnsData[field['FLDNAME']] = avgColumnsData[field['FLDNAME']] / values.length;
                    /*If value is '100' it should display as '100.00' if its decimals are '000002'.
                    These changes are to support this scenario in excel download and Totals*/
                    //avgColumnsData[field['FLDNAME']] = oController.convertValueToUserFormat(avgColumnsData[field['FLDNAME']]);
                    avgColumnsData[field['FLDNAME']] = oController.convertValueToUserFormat(avgColumnsData[field['FLDNAME']], field['DECIMALS']);
                    /**/
                    if (field['CFIELDNAME'] && values[0][field['CFIELDNAME']]) {
                        avgColumnsData[field['FLDNAME']] = avgColumnsData[field['FLDNAME']] + " " + values[0][field['CFIELDNAME']];
                    }

                    if (field['QFIELDNAME'] && values[0][field['QFIELDNAME']]) {
                        avgColumnsData[field['FLDNAME']] = avgColumnsData[field['FLDNAME']] + " " + values[0][field['QFIELDNAME']];
                    }
                });

                return avgColumnsData;
            },

            determineMinValue: function (columns, data, node, values) {
                var oController = this, minColumnsData = {};

                var filteredData = values ? values : data[node.substr(0, node.lastIndexOf("_"))];

                underscoreJS.each(columns, function (column) {
                    minColumnsData[column['FLDNAME']] = underscoreJS.pluck(filteredData, column['FLDNAME']).reduce(function (a, b) {
                        return Math.min(a, b);
                    });
                    /*If value is '100' it should display as '100.00' if its decimals are '000002'.
                    These changes are to support this scenario in excel download and Totals*/
                    //minColumnsData[column['FLDNAME']] = oController.convertValueToUserFormat(minColumnsData[column['FLDNAME']]);
                    minColumnsData[column['FLDNAME']] = oController.convertValueToUserFormat(minColumnsData[column['FLDNAME']], column['DECIMALS']);
                    /**/
                    if (column['CFIELDNAME'] && filteredData[0][column['CFIELDNAME']]) {
                        minColumnsData[column['FLDNAME']] = minColumnsData[column['FLDNAME']] + " " + filteredData[0][column['CFIELDNAME']];
                    }

                    if (column['QFIELDNAME'] && filteredData[0][column['QFIELDNAME']]) {
                        minColumnsData[column['FLDNAME']] = minColumnsData[column['FLDNAME']] + " " + filteredData[0][column['QFIELDNAME']];
                    }
                });

                return minColumnsData;
            },


            determineMaxValue: function (columns, data, node, values) {
                var oController = this, section, maxColumnsData = {};
                var filteredData = values ? values : data[node.substr(0, node.lastIndexOf("_"))];

                underscoreJS.each(columns, function (column) {
                    maxColumnsData[column['FLDNAME']] = underscoreJS.pluck(filteredData, column['FLDNAME']).reduce(function (a, b) {
                        return Math.max(a, b);
                    });
                    /*If value is '100' it should display as '100.00' if its decimals are '000002'.
                    These changes are to support this scenario in excel download and Totals*/
                    //maxColumnsData[column['FLDNAME']] = oController.convertValueToUserFormat(maxColumnsData[column['FLDNAME']]);
                    maxColumnsData[column['FLDNAME']] = oController.convertValueToUserFormat(maxColumnsData[column['FLDNAME']], column['DECIMALS']);
                    /**/
                    if (column['CFIELDNAME'] && filteredData[0][column['CFIELDNAME']]) {
                        maxColumnsData[column['FLDNAME']] = maxColumnsData[column['FLDNAME']] + " " + filteredData[0][column['CFIELDNAME']];
                    }

                    if (column['QFIELDNAME'] && filteredData[0][column['QFIELDNAME']]) {
                        maxColumnsData[column['FLDNAME']] = maxColumnsData[column['FLDNAME']] + " " + filteredData[0][column['QFIELDNAME']];
                    }
                });

                return maxColumnsData;
            },

            prepareMaxValue: function (data, node) {
                var oController = this, section, maxColumns = [], maxColumnsData = {}, layoutData;
                section = oController.getSectionBy("DARID", node.substr(0, node.lastIndexOf("_")));

                layoutData = data[node];
                if (!layoutData) {
                    return {};
                }

                underscoreJS.each(layoutData['AGRGTITEMS'], function (item) {
                    var columnItem = underscoreJS.findWhere(section['FIELDS'], {
                        'FLDNAME': item['COLUMNKEY']
                    });

                    if (columnItem && (item['AGGAT'] === global.vui5.cons.aggregate.maximum)) {
                        maxColumns.push(columnItem);
                    }

                });

                return oController.determineMaxValue(maxColumns, data, node);

            },

            prepareAvgValue: function (data, node) {
                var oController = this, section, aggregateColumns, aggregateColumnsData = {}, layoutData;
                section = oController.getSectionBy("DARID", node.substr(0, node.lastIndexOf("_")));


                layoutData = data[node];

                if (!layoutData) {
                    return {};
                }


                aggregateColumns = [];

                underscoreJS.each(layoutData['AGRGTITEMS'], function (item) {
                    var columnItem = underscoreJS.findWhere(section['FIELDS'], {
                        'FLDNAME': item['COLUMNKEY']
                    });

                    if (columnItem && item['AGGAT'] === global.vui5.cons.aggregate.average) {
                        aggregateColumns.push(columnItem);
                    }

                });

                if (underscoreJS.isEmpty(aggregateColumns)) {
                    return {};
                }


                underscoreJS.each(aggregateColumns, function (column) {
                    aggregateColumnsData[column['FLDNAME']] = underscoreJS.pluck(data[node.substr(0, node.lastIndexOf("_"))], column['FLDNAME']).reduceRight(function (a, b) { return a + b; });
                    // aggregateColumnsData[column['FLDNAME']] = aggregateColumnsData[column['FLDNAME']].toFixed(column['DECIMALS']);
                    aggregateColumnsData[column['FLDNAME']] = aggregateColumnsData[column['FLDNAME']] / data[node.substr(0, node.lastIndexOf("_"))].length;

                    /*If value is '100' it should display as '100.00' if its decimals are '000002'.
                    These changes are to support this scenario in excel download and Totals*/
                    //aggregateColumnsData[column['FLDNAME']] = oController.convertValueToUserFormat(aggregateColumnsData[column['FLDNAME']]);
                    aggregateColumnsData[column['FLDNAME']] = oController.convertValueToUserFormat(aggregateColumnsData[column['FLDNAME']], column['DECIMALS']);
                    /**/
                    if (column['CFIELDNAME'] && data[node.substr(0, node.lastIndexOf("_"))][0][column['CFIELDNAME']]) {
                        aggregateColumnsData[column['FLDNAME']] = aggregateColumnsData[column['FLDNAME']] + " " + data[node.substr(0, node.lastIndexOf("_"))][0][column['CFIELDNAME']];
                    }

                    if (column['QFIELDNAME'] && data[node.substr(0, node.lastIndexOf("_"))][0][column['QFIELDNAME']]) {
                        aggregateColumnsData[column['FLDNAME']] = aggregateColumnsData[column['FLDNAME']] + " " + data[node.substr(0, node.lastIndexOf("_"))][0][column['QFIELDNAME']];
                    }
                });

                return aggregateColumnsData;

            },
            prepareTotal: function (data, node) {
                var oController = this, section, aggregateColumns, aggregateColumnsData = {}, layoutData, avgColumns = [];
                section = oController.getSectionBy("DARID", node.substr(0, node.lastIndexOf("_")));


                layoutData = data[node];

                if (!layoutData) {
                    return {};
                }


                aggregateColumns = [];

                underscoreJS.each(layoutData['AGRGTITEMS'], function (item) {
                    var columnItem = underscoreJS.findWhere(section['FIELDS'], {
                        'FLDNAME': item['COLUMNKEY']
                    });

                    if (columnItem && (item['AGGAT'] === global.vui5.cons.aggregate.sum)) {

                        if (item['AGGAT'] === global.vui5.cons.aggregate.average) {
                            avgColumns.push(columnItem['FLDNAME']);
                        }
                        aggregateColumns.push(columnItem);
                    }

                });

                if (underscoreJS.isEmpty(aggregateColumns)) {
                    return {};
                }


                underscoreJS.each(aggregateColumns, function (column) {
                    aggregateColumnsData[column['FLDNAME']] = underscoreJS.pluck(data[node.substr(0, node.lastIndexOf("_"))], column['FLDNAME']).reduceRight(function (a, b) { return a + b; });
                    //aggregateColumnsData[column['FLDNAME']] = aggregateColumnsData[column['FLDNAME']].toFixed(column['DECIMALS']);
                    /*If value is '100' it should display as '100.00' if its decimals are '000002'.
                    These changes are to support this scenario in excel download and Totals*/
                    //aggregateColumnsData[column['FLDNAME']] = oController.convertValueToUserFormat(aggregateColumnsData[column['FLDNAME']]);
                    aggregateColumnsData[column['FLDNAME']] = oController.convertValueToUserFormat(aggregateColumnsData[column['FLDNAME']], column['DECIMALS']);
                    /**/
                    if (column['CFIELDNAME'] && data[node.substr(0, node.lastIndexOf("_"))][0][column['CFIELDNAME']]) {
                        aggregateColumnsData[column['FLDNAME']] = aggregateColumnsData[column['FLDNAME']] + " " + data[node.substr(0, node.lastIndexOf("_"))][0][column['CFIELDNAME']];
                    }

                    if (column['QFIELDNAME'] && data[node.substr(0, node.lastIndexOf("_"))][0][column['QFIELDNAME']]) {
                        aggregateColumnsData[column['FLDNAME']] = aggregateColumnsData[column['FLDNAME']] + " " + data[node.substr(0, node.lastIndexOf("_"))][0][column['QFIELDNAME']];
                    }
                });

                return aggregateColumnsData;
            },

            prepareSubTotal: function (data, node) {
                var oController = this, section, subAggregateColumns, maxColumns, minColumns, avgColumns, layoutData,
                    subAggregateColumnsData = [], uniqGrpValuesObject = {}, subTotalValue;
                section = oController.getSectionBy("DARID", node.substr(0, node.lastIndexOf("_")));

                layoutData = data[node];

                if (!layoutData) {
                    return [];
                }

                if (underscoreJS.isEmpty(layoutData['GRPITEMS'])) {
                    return [];
                }


                subAggregateColumns = [];
                maxColumns = [];
                minColumns = [];
                avgColumns = [];

                underscoreJS.each(layoutData['AGRGTITEMS'], function (item) {
                    var columnItem = underscoreJS.findWhere(section['FIELDS'], {
                        'FLDNAME': item['COLUMNKEY']
                    });

                    if (columnItem) {
                        if (item['SBAGT'] === global.vui5.cons.aggregate.sum) {
                            subAggregateColumns.push(columnItem);
                        }
                        else if (item['SBAGT'] === global.vui5.cons.aggregate.maximum) {
                            maxColumns.push(columnItem);
                        }
                        else if (item['SBAGT'] === global.vui5.cons.aggregate.minimum) {
                            minColumns.push(columnItem);
                        }
                        else if (item['SBAGT'] === global.vui5.cons.aggregate.average) {
                            avgColumns.push(columnItem);
                        }
                    }

                });

                underscoreJS.each(layoutData['GRPITEMS'], function (grpColumn) {
                    underscoreJS.each(underscoreJS.uniq(underscoreJS.pluck(data[node.substr(0, node.lastIndexOf("_"))], grpColumn['COLUMNKEY'])), function (value) {
                        uniqGrpValuesObject = {};
                        uniqGrpValuesObject[grpColumn['COLUMNKEY']] = value;
                        uniqGrpValues = underscoreJS.where(data[node.substr(0, node.lastIndexOf("_"))], uniqGrpValuesObject);


                        underscoreJS.each(subAggregateColumns, function (field) {
                            uniqGrpValuesObject[field['FLDNAME']] = underscoreJS.pluck(uniqGrpValues, field['FLDNAME']).reduceRight(function (a, b) { return a + b; })
                            //uniqGrpValuesObject[field['FLDNAME']] = uniqGrpValuesObject[field['FLDNAME']].toFixed(field['DECIMALS']);
                            /*If value is '100' it should display as '100.00' if its decimals are '000002'.
                              These changes are to support this scenario in excel download and Totals*/
                            //uniqGrpValuesObject[field['FLDNAME']] = oController.convertValueToUserFormat(uniqGrpValuesObject[field['FLDNAME']]);
                            uniqGrpValuesObject[field['FLDNAME']] = oController.convertValueToUserFormat(uniqGrpValuesObject[field['FLDNAME']], field['DECIMALS']);
                            /**/
                            if (field['CFIELDNAME'] && uniqGrpValues[0][field['CFIELDNAME']]) {
                                uniqGrpValuesObject[field['FLDNAME']] = uniqGrpValuesObject[field['FLDNAME']] + " " + uniqGrpValues[0][field['CFIELDNAME']];
                            }

                            if (field['QFIELDNAME'] && uniqGrpValues[0][field['QFIELDNAME']]) {
                                uniqGrpValuesObject[field['FLDNAME']] = uniqGrpValuesObject[field['FLDNAME']] + " " + uniqGrpValues[0][field['QFIELDNAME']];
                            }
                        });

                        uniqGrpValuesObject['MINIMUM'] = oController.determineMinValue(minColumns, data, node, uniqGrpValues);
                        uniqGrpValuesObject['MAXIMUM'] = oController.determineMaxValue(maxColumns, data, node, uniqGrpValues);
                        uniqGrpValuesObject['AVERAGE'] = oController.determineAvgValue(avgColumns, uniqGrpValues);

                        subAggregateColumnsData.push(uniqGrpValuesObject);
                    });
                });

                return subAggregateColumnsData;
            },

            convertValueToStandardFormat: function (value) {
                var oController = this;
                var mainModel = oController.getModel(global.vui5.modelName);
                var decimalNotation = mainModel.getProperty(global.vui5.cons.modelPath.sessionInfo + "/DCPFM");
                switch (decimalNotation) {
                    case 'X':
                        return value.replace(/[\,]+/g, '').replace(/,/, '\.');
                        break;
                    default:
                        return value.replace(/[\.\s]+/g, '').replace(/,/, '\.');
                        break;
                }
            },

            convertValueToUserFormat: function (value, decimals) {
                var oController = this;
                var mainModel = oController.getModel(global.vui5.modelName);
                var decimalNotation = mainModel.getProperty(global.vui5.cons.modelPath.sessionInfo + "/DCPFM");
                switch (decimalNotation) {
                    case 'X':
                        /*If value is '100' it should display as '100.00' if its decimals are '000002'.
                            These changes are to support this scenario in excel download and Totals*/
                        //return value.toLocaleString("en-US");
                        return value.toLocaleString("en-US", { useGrouping: false, minimumFractionDigits: parseInt(decimals) });
                        /**/
                        break;
                    case 'Y':
                        /*If value is '100' it should display as '100.00' if its decimals are '000002'.
                        These changes are to support this scenario in excel download and Totals*/
                        //return value.toLocaleString("pl-PL");
                        return value.toLocaleString("pl-PL", { useGrouping: false, minimumFractionDigits: parseInt(decimals) });
                        /**/
                        break;
                    default:
                        /*If value is '100' it should display as '100.00' if its decimals are '000002'.
                        These changes are to support this scenario in excel download and Totals*/

                        //return value.toLocaleString("de-DE");
                        return value.toLocaleString("de-DE", { useGrouping: false, minimumFractionDigits: parseInt(decimals) });
                        /**/
                        break;
                }
            },


            clearTableChangedRows: function () {
                var oController = this;
                if (underscoreJS.isEmpty(oController.changedRowsSections)) {
                    return;
                }

                underscoreJS.each(oController.changedRowsSections, function (section) {
                    if (oController.sectionRef[section]) {
                        oController.sectionRef[section].resetControl();
                    }
                });

                oController.changedRowsSections = [];
            },

            processPopupFunctions: function (response) {
                var oController = this;
                var currentModel = oController.getCurrentModel();
                var mainModel = oController.getMainModel();
                var functions = response[global.vui5.cons.nodeName.popupFunctions];
                var funct, index;
                index = underscoreJS.findIndex(functions, { 'FNCNM': global.vui5.cons.eventName.continue });



                /**** Rel 60E SP6 - FullScreen Support changes - Start ***/
                /*
                if (functions[index]) {
                    if (response['POPUP_PROP']) {
                        if (functions[index]['HIDFN'] === "") {
            
                            if (response['POPUP_PROP']['DISOL'] === 'X') {
                                functions[index]['HIDFN'] = 'X';
                            }
                            else if (mainModel.getProperty("/FULLSCREEN") !== false) {
                                functions[index]['HIDFN'] = 'X';
                            }
                        }
                    }
                    else {
                        if (functions[index]['HIDFN'] === "") {
                            if (mainModel.getProperty("/FULLSCREEN") !== false) {
                                functions[index]['HIDFN'] = 'X';
                            }
                        }
                    }
                }*/
                /**** Rel 60E SP6 - FullScreen Support changes - Emd ***/
                index = underscoreJS.findIndex(functions, { 'FNCNM': global.vui5.cons.eventName.cancel });

                if (functions[index]) {
                    if (response['POPUP_PROP']) {
                        if (response['POPUP_PROP']['FLVIW'] && response['POPUP_PROP']['DISOL']) {
                            functions[index]['DESCR'] = oController._getBundleText('Back');
                        }
                        else if (response['POPUP_PROP']['FLVIW'] && !response['POPUP_PROP']['DISOL']) {
                            functions[index]['DESCR'] = oController._getBundleText("DiscardChangesBtn")
                        }
                    }
                }

                index = underscoreJS.findIndex(functions, { 'FNCNM': global.vui5.cons.eventName.check });
                if (!index || index === -1) {
                    index = underscoreJS.findIndex(functions, { 'FNCNM': global.vui5.cons.eventName.chck });
                }

                if (functions[index]) {
                    if (functions[index]['HIDFN'] === "") {
                        if (mainModel.getProperty("/DOCUMENT_MODE") === global.vui5.cons.mode.display || !mainModel.getProperty("/FULLSCREEN")) {
                            functions[index]['HIDFN'] = 'X'
                        }
                    }
                }

                if (mainModel.getProperty("/FULLSCREEN") && response['POPUP_PROP']) {
                    response['POPUP_PROP']['FLVIW'] = "";
                }

                currentModel.setProperty("/" + global.vui5.cons.nodeName.popupFunctions, functions);
            },

            pushWidgetReference: function (widgetArray) {
                if (eval(widgetArray['VALUE'])) {
                    global.vui5.ui.controls[widgetArray['NAME']] = eval(widgetArray['VALUE']);
                }
            },

            initializeWidgetGlobalVariables: function () {
                var oController = this;
                underscoreJS.each(window.loadedWidgets, function (widget) {
                    global.vui5.ui.controls[widget['NAME']] = widget['VALUE'];
                })

                /*underscoreJS.each(global.vui5.ui.widgetsArray, function (widgetArray) {
                    
                    switch (widgetArray['TYPE']) {
                        case "GLBWIDGET":

                            if (loadedLibraries[vistexConfig.rootFolder + ".ui.widgets"]) {
                                oController.pushWidgetReference(widgetArray);
                            }
                            break;
                        case "AVLWIDGET":
                            if (loadedLibraries[vistexConfig.rootFolder + ".ui.availsWidgets"]) {
                                oController.pushWidgetReference(widgetArray);
                            }

                            break;
                        case "VZWIDGET":
                            if (loadedLibraries[vistexConfig.vzrootFolder + ".ui.widgets"]) {
                                oController.pushWidgetReference(widgetArray);
                            }

                            break;

                    }
                });*/
            },

            /*** Rel 60E SP6 ECIP #4215 - Start ***/
            sessionClose: function () {
                var oController = this;
                var oUrlParams = {};
                oUrlParams['sap-sessioncmd'] = "close";
                oController.currentRoute = global.vui5.currentRoute;
                oController.callServer({
                    url: oController.getServerURL({
                        urlParams: oUrlParams
                    }),
                    async: false
                }).then(function () {
                    global.vui5 = window.vui5 = global.initializeGlobalVariables();
                    global.documentInitializeVariables();
                    commonUtils.server.initialCall = true;
                    commonUtils.server.xcsrftoken = undefined;

                });
            },
            /*** Rel 60E SP6 ECIP #4215 - End ***/

            prepareQuickEntryModel: function (config) {
                var quickEntry = {
                    "FORM_FIELDS": [],
                    "TABLE_FIELDS": [],
                    "DATA": {}
                };

                var quickEntryModel = this.getCurrentModel().getProperty("/_VUI_QE");
                var section, fields;
                if (config.initCall) {
                    section = this.getSectionBy("SECTN", config.sectionID);
                    fields = config.response[section['DARID'] + global.vui5.cons.nodeName.quickEntry];
                    underscoreJS.each(fields, function (field) {
                        if (field['QENTP'] === global.vui5.cons.quickEntryType.multiLineEntry) {
                            quickEntry['TABLE_FIELDS'].push(field);
                        }
                        else {
                            if (field['QENTP'] === global.vui5.cons.quickEntryType.multiValue) {
                                if (config.response[field['FLDNAME'] + '__DATA']) {
                                    quickEntry['DATA'][field['FLDNAME'] + '__DATA'] = config.response[field['FLDNAME'] + '__DATA'];
                                }
                            }
                            quickEntry['FORM_FIELDS'].push(field);
                        }
                    });
                }

                if (config.initCall) {
                    quickEntry['DATA']['__SE__DATA'] = config.response['__SE__DATA'];
                    if (config.response['__MLE__DATA']) {
                        quickEntry['DATA']['EMPTY_MLE_DATA'] = $.extend(true, {}, config.response['__MLE__DATA'][0]);
                    }

                }
                else {
                    quickEntry['FORM_FIELDS'] = quickEntryModel['FORM_FIELDS'];
                    quickEntry['TABLE_FIELDS'] = quickEntryModel['TABLE_FIELDS'];
                }
                quickEntry['DATA']['__MLE__DATA'] = config.response['__MLE__DATA'];

                return quickEntry;
            },

            fillQuickEntryModel: function (config) {
                var currentModel = this.getCurrentModel();
                currentModel.setProperty("/_VUI_QE", this.prepareQuickEntryModel(config));
            },

            clearQuickEntryModel: function () {
                this.getCurrentModel.setProperty("/_VUI_QE", {});
            },


            modifyQuickEntryModel: function () {
                var oController = this, newMultiLineEntryData = [];
                multiLineEntryData = oController.getCurrentModel().getProperty("/_VUI_QE/DATA/__MLE__DATA"),
                    emptyLineData = $.extend(true, {}, oController.getCurrentModel().getProperty("/_VUI_QE/DATA/EMPTY_MLE_DATA"));

                underscoreJS.each(multiLineEntryData, function (data) {
                    if (!underscoreJS.isEqual(data, emptyLineData)) {
                        newMultiLineEntryData.push(data);
                    }
                });

                underscoreJS.times(5, function () {
                    newMultiLineEntryData.push($.extend(true, {}, emptyLineData));
                });

                oController.getCurrentModel().setProperty("/_VUI_QE/DATA/__MLE__DATA", newMultiLineEntryData);

            },

            processMassEditAction: function (config) {
                var oController = this, objConfig, action, promise, callback;
                var data = {};
                data[config.sectionID + "_MASSEDITDATA"] = config.data['DATA'];
                data[config.sectionID + "_MASSEDITFIELDS"] = config.data['FIELDS'];

                if (underscoreJS.isEmpty(config.data['FIELDS'])) {
                    if (config.callBack && config.callBack instanceof Function) {
                        config.callBack();
                    }
                    return;
                }
                action = {
                    "FNCNM": global.vui5.cons.eventName.massEditApply,
                    "RQTYP": global.vui5.cons.reqTypeValue.post
                };

                objConfig = {
                    method: action['RQTYP'] === global.vui5.cons.reqTypeValue.post ? global.vui5.cons.reqType.post : global.vui5.cons.reqType.get,
                    action: action['FNCNM'],
                    hideLoader: !!action.hideLoader,
                    actionRef: action,
                    context: oController.currentRoute,
                    sectionId: config.sectionID,
                    data: data
                };
                promise = oController.processServerEvent(objConfig);
                if (promise) {
                    promise.then(function (response) {
                        if (config.callBack && config.callBack instanceof Function) {
                            config.callBack();
                        }
                    });
                }

            },

            processQuickEntryAction: function (config) {
                var oController = this, modalAction, urlParams = {}, objConfig, action = config.action,
                    objDefer = $.Deferred(), promise;

                /*** Rel 60E SP6 QA #10738 - Start **/
                if (oController.inputChangeDefer) {
                    oController.inputChangeDefer.done(function () {
                        if (oController.inputChangeDefer.state() === "resolved") {
                            oController.inputChangeDefer = undefined;
                            oController.processQuickEntryAction(config).then(function () {
                                objDefer.resolve();
                            });
                        } else {
                            oController.inputChangeDefer = undefined;
                            objDefer.reject();
                        }


                    });

                    return objDefer.promise();
                }

                if (action['FNCNM'] !== global.vui5.cons.eventName.cancel && oController.checkRequiredFields()) {
                    objDefer.reject();
                    return objDefer.promise();
                }
                /*** Rel 60E SP6 QA #10738 - End **/
                modalAction = oController.sectionConfig[config.sectionID].onQuickEntryAction;
                urlParams[global.vui5.cons.params.modal_action] = modalAction['FNCNM'];
                urlParams[global.vui5.cons.params.modalFunctionSection] = config.sectionID;


                objConfig = {
                    method: action['RQTYP'] === global.vui5.cons.reqTypeValue.post ? global.vui5.cons.reqType.post : global.vui5.cons.reqType.get,
                    action: action['FNCNM'],
                    hideLoader: !!action.hideLoader,
                    actionRef: action,
                    context: oController.currentRoute,
                    sectionId: config.sectionID,
                    urlParams: urlParams,
                    data: oController.getCurrentModel().getProperty("/_VUI_QE/DATA")
                };

                promise = oController.callServer(objConfig);

                if (promise) {
                    promise.then(function (response) {
                        oController.processResultNode(response);
                        if (response['RESULT']['ERROR']) {
                            objDefer.reject();
                        }
                        else if (objConfig.action === global.vui5.cons.eventName.check) {
                            oController.modifyQuickEntryModel();

                        }
                        else if (response['RESULT']['REFRESH_DATA']) {

                            oController.getData(config.sectionID).then(function (response) {
                                objDefer.resolve(response);
                            });
                        }


                    });
                }

                return objDefer.promise();
            },

            processMassEdit: function (config) {
                var oController = this, objDefer = $.Deferred(), promise, massEditDialog;
                section = oController.getSectionBy("SECTN", config.sectionID);

                oController._UpdateChanges(config.sectionID).then(function () {
                    massEditDialog = new global.vui5.ui.controls.MassEditDialog({
                        title: oController._getBundleText("MassEdit", section['DESCR']),
                        resizable: true,
                        draggable: true,
                        stretchOnPhone: true,
                        dataAreaPath: config.urlParams['DATA']['DATAAREAPATH'],
                        fieldsPath: config.urlParams['DATA']['FIELDSPATH'],
                        layoutDataPath: config.urlParams['DATA']['LAYOUTDATAPATH'],
                        dataPath: config.urlParams['DATA']['DATAPATH'],
                        modelName: oController.modelName,
                        selectedSPaths: config.urlParams['DATA']['SPATHS'],
                        enableApplyInBackground: config.urlParams['DATA']['ENABLEAPPLYBACKGROUND'],
                        onValueHelpRequest: oController.onValueHelpRequest.bind(oController, config.sectionID),
                        onInputChange: function (oEvent) {
                            oController.processOnInputChange(config.sectionID, oEvent.getParameter("oEvent"));
                        },
                        onRequiredFieldsCheck: function (oEvent) {
                            if (!oController.checkRequiredFields(config.sectionID)) {
                                if (oEvent.getParameter("background")) {
                                    massEditDialog.processApplyBackground();
                                }
                                else {
                                    var changedFieldsContext = massEditDialog.onMassEditApply();
                                    oController.sectionRef[config.sectionID].postProcessMassEditFields(changedFieldsContext);
                                }

                            }
                        },
                        onApplyBackground: function (oEvent) {
                            oController.processMassEditAction({
                                data: oEvent.getParameter("DATA"),
                                sectionID: config.sectionID,
                                callBack: oEvent.getParameter("CALLBACK")
                            });
                        }
                    }).addStyleClass("sapUiPopupWithPadding");

                    var _sContentDensityClass;
                    if (!sap.ui.Device.support.touch) {
                        _sContentDensityClass = "sapUiSizeCompact";
                    } else {
                        _sContentDensityClass = "sapUiSizeCozy";
                    }

                    jQuery.sap.syncStyleClass(_sContentDensityClass, this, massEditDialog);

                    massEditDialog.setModel(oController.getCurrentModel(), oController.modelName);
                    massEditDialog.setModel(oController.getMainModel(), global.vui5.modelName);
                    massEditDialog.prepareMassEditForm();
                    massEditDialog.open();
                    objDefer.resolve();
                });

                return objDefer.promise();
            },

            processQuickEntry: function (config) {
                var oController = this, objDefer = $.Deferred(),
                    promise, objParams = {}, objConfig, section, continueAction, cancelAction, checkAction;
                section = oController.getSectionBy("SECTN", config.sectionID);
                sectionPath = oController._getPath(true) + underscoreJS.findIndex(oController.getSections(), oController.getSectionBy("SECTN", config.sectionID)) + "/DARID";
                oController._UpdateChanges(config.sectionID).then(function () {
                    objParams[global.vui5.cons.params.action] = global.vui5.cons.params.metadatanData.split('$')[1].toUpperCase();
                    objParams[global.vui5.cons.params.modal_action] = config.action ? config.action['FNCNM'] : "";
                    objParams[global.vui5.cons.params.modalFunctionSection] = config.action['SECTN'] || "";

                    var objConfig = {
                        sectionId: config.sectionID,
                        method: global.vui5.cons.reqType.post,
                        initialCall: true,
                        urlParams: objParams,
                        context: global.vui5.cons.applicationContext.popup
                    };

                    continueAction = {
                        "FNCNM": global.vui5.cons.eventName.continue,
                        "RQTYP": global.vui5.cons.reqTypeValue.post
                    };

                    checkAction = {
                        "FNCNM": global.vui5.cons.eventName.check,
                        "RQTYP": global.vui5.cons.reqTypeValue.post
                    };

                    cancelAction = {
                        "FNCNM": global.vui5.cons.eventName.cancel,
                        "RQTYP": global.vui5.cons.reqTypeValue.post
                    };

                    promise = oController.callServer(objConfig);
                    promise.then(function (response) {

                        oController.fillQuickEntryModel({
                            sectionID: config.sectionID,
                            response: response,
                            initCall: true
                        });
                        var quickEntryDialog = new global.vui5.ui.controls.QuickEntryDialog({
                            modelName: oController.modelName,
                            controller: oController,
                            dataAreaID: section['DARID'],
                            dataAreaPath: sectionPath,
                            formFieldsPath: "/_VUI_QE/FORM_FIELDS",
                            lineEntryFieldsPath: "/_VUI_QE/TABLE_FIELDS/",
                            dataPath: "/_VUI_QE/DATA/",
                            title: oController._getBundleText("QuickEntryTitle", [section['DESCR']]),
                            resizable: true,
                            draggable: true,
                            //contentWidth: "70%",
                            //contentHeight: "60%",
                            onValueHelpRequest: function (oEvent) {
                                oController.onValueHelpRequest(config.sectionID, oEvent);
                            },
                            onContinue: function (oEvent) {
                                oController.processQuickEntryAction({
                                    sectionID: config.sectionID,
                                    action: continueAction
                                }).then(function () {
                                    //oController.msgBtn.setVisible(true);
                                    quickEntryDialog.destroy();
                                });

                            },
                            onCheck: function (oEvent) {
                                oController.processQuickEntryAction({
                                    sectionID: config.sectionID,
                                    action: checkAction
                                }).fail(function () {
                                    //oController.msgBtn.setVisible(false);
                                });
                            },
                            onCancel: function (oEvent) {
                                oController.processQuickEntryAction({
                                    sectionID: config.sectionID,
                                    action: cancelAction
                                });
                                //oController.msgBtn.setVisible(true);
                                quickEntryDialog.destroy();
                            },
                            onFieldEvent: oController.preProcessFieldEvent.bind(oController, config.sectionID)

                        });
                        quickEntryDialog.setModel(oController.getCurrentModel(), oController.modelName);
                        quickEntryDialog.setModel(oController.getMainModel(), global.vui5.modelName);
                        quickEntryDialog.prepareQuickEntry();

                        if (oController.getCurrentModel().getProperty("/_VUI_QE/TABLE_FIELDS") &&
                            oController.getCurrentModel().getProperty("/_VUI_QE/TABLE_FIELDS").length > 0) {
                            quickEntryDialog.setContentWidth("70%");
                            quickEntryDialog.setContentHeight("60%");

                        }
                        else {
                            quickEntryDialog.setContentWidth("38%");
                            quickEntryDialog.setContentHeight("45%");
                        }




                        quickEntryDialog.open();
                        quickEntryDialog.processOnInputChange = function (oEvent) {
                            return oController.processOnInputChange(config.sectionID, oEvent);
                        };

                        quickEntryDialog.showMessages = function (oEvent) {
                            oController._showMessages(oEvent);
                        }

                        quickEntryDialog.preProcessFieldEvent = function (oEvent) {
                            return oController.preProcessFieldEvent(config.sectionID, oEvent);
                        };

                        quickEntryDialog.handleCheckFieldsMessages = function (text, type, target) {
                            return oController._handleCheckFieldsMessages(text, type, target);
                        };
                        jQuery.sap.syncStyleClass(oController.getOwnerComponent().getContentDensityClass(), oController.getView(), quickEntryDialog);
                        objDefer.resolve();

                    });
                });


                return objDefer.promise();
            },


            _setPreparePageContent: function (config) {
                var oController = this;
                var mainModel = oController.getMainModel();
                if (config.action['FNCNM'] === global.vui5.cons.eventName.cancel) {
                    return;
                }

                if (config.response['RESULT']['REFRESH_PAGE']) {
                    mainModel.setProperty("/PREPARE_PAGE_CONTENT", oController._formDialog['UILYT'] === global.vui5.cons.layoutType.tab ||
                        oController._formDialog['UILYT'] === global.vui5.cons.layoutType.pageWithTabs);
                }

            },


            getDropdownValues: function (sectionID, oEvent, fieldInfo) {

                var oController = this, source, depFieldInfo, section, source, valueState;
                source = oEvent.getSource();
                section = oController.getSectionBy("SECTN", sectionID);
                if (source.getValueState) {
                    valueState = source.getValueState();
                    source.setValueState(sap.ui.core.ValueState.None);
                }
                if (section) {
                    depFieldInfo = underscoreJS.findWhere(section['FIELDS'], { 'FLDNAME': fieldInfo['DEPFL'][0] });

                    oController.processFieldValueChange(sectionID, depFieldInfo).then(function () {


                        if (source.setValueState) {
                            source.setValueState(valueState);
                        }
                    }).fail(function (focusedInput) {
                        source.bProcessingLoadItemsEvent = false;
                        if (source.setValueState) {
                            source.setValueState(valueState);
                        }
                        if (focusedInput) {
                            focusedInput.focus();
                        }
                    });
                }

                /*
                var oController = this;
                var source = oEvent.getSource();
                var object = {};
            
                oController.updateChangedData(sectionID).then(function () {
                    source.bProcessingLoadItemsEvent = false;
            
            
                    source.getBinding("items").resume();
                });
                /*object['DROPDOWNS'] = [];
                object['DROPDOWNS'].push({
                    'DARID': 'HD',
                    'FIELD': 'SPART',
                    'VALUE': [{
                        'NAME': "01",
                        'VALUE': "S1"
                    },
                    {
                        'NAME': "02",
                        'VALUE': "S2"
                    }]
                });
            
                oController.updateDropdowns(object['DROPDOWNS']);*/



            },

            registerFioriLaunchpadCallBacks: function () {
                var oController = this, standardNavigationFilters = [], vistexCustomNavigationFilter = [];

                if (sap.ushell.Container.getService("ShellNavigation") && !window.vistexNavigationFilters) {
                    window.vistexNavigationFilters = true;
                    standardNavigationFilters = sap.ushell.Container.getService("ShellNavigation").hashChanger.aNavigationFilters;
                    vistexCustomNavigationFilter.push(function (newHash, oldHash) {
                        return oController.setDirtyFlag(newHash, oldHash);
                    });

                    sap.ushell.Container.getService("ShellNavigation").hashChanger.aNavigationFilters =
                        underscoreJS.union(vistexCustomNavigationFilter, standardNavigationFilters);

                    sap.ushell.Container.getService("ShellNavigation").hashChanger.registerNavigationFilter(function (newHash, oldHash) {
                        return oController.handleDataLoss(newHash, oldHash);
                    });
                }

            },

            handleBrowserActions: function () {
                var oController = this, mainModel = this.getMainModel(), navigationFilters = [], customFilters = [];
                if (global.vui5.session.fromFioriLaunchpad && !mainModel.getProperty("/BROWSER_ACTION")) {
                    mainModel.setProperty("/BROWSER_ACTION", true);

                    oController.registerFioriLaunchpadCallBacks();
                }
            },

            setDirtyFlag: function (newHash, oldHash) {
                var oController = this, mainModel, result = oController.getOwnerComponent().getRouter().oHashChanger.NavigationFilterStatus.Continue;


                if (window.fioriLaunchpadHomeBtnClick) {
                    return result;
                }

                mainModel = oController.getMainModel();

                if (oController.triggerUpdateEvent(newHash, oldHash)) {
                    if (mainModel.getProperty("/DATA_CHANGED")) {
                        sap.ushell.Container.setDirtyFlag(true);
                    }
                    else {
                        oController.ajaxAsync = false;
                        oController._UpdateChanges("", oController.onNavAction).then(function () {
                            oController.ajaxAsync = undefined;
                            if (mainModel.getProperty("/DATA_CHANGED")) {
                                sap.ushell.Container.setDirtyFlag(true);
                            }

                            result = oController.getOwnerComponent().getRouter().oHashChanger.NavigationFilterStatus.Continue;
                        }).fail(function () {
                            result = oController.getOwnerComponent().getRouter().oHashChanger.NavigationFilterStatus.Abandon;
                        });
                    }
                }

                return result;
            },

            triggerUpdateEvent: function (newHash, oldHash) {
                var oController = this, triggerUpdateEvent = false;

                if (oController.getApplicationIdentifier() === global.vui5.cons.applicationIdentifier.overviewPage) {
                    return triggerUpdateEvent;
                }
                triggerUpdateEvent = newHash.indexOf(global.vui5.cons.applicationContext.document) === -1 &&
                    oldHash.indexOf(global.vui5.cons.applicationContext.document) !== -1;

                if (!triggerUpdateEvent) {
                    triggerUpdateEvent = oldHash.indexOf(global.vui5.cons.applicationContext.list) !== -1 &&
                        newHash.indexOf(global.vui5.cons.applicationContext.document) === -1;
                }

                return triggerUpdateEvent;
            },

            handleDataLoss: function (newHash, oldHash) {

                var oController = this, mainModel, movingOutofSearch,
                    movingOutOfDocument, oldHashUrl, parentSection = {}, result = this.getOwnerComponent().getRouter().oHashChanger.NavigationFilterStatus.Continue;

                /*
                 * Whenever session close gets called , commonUtils.server.xcsrftoken will become undefined
                 * so we are using that variable to skip logic
                 */
                if (!commonUtils.server.xcsrftoken || window.fioriLaunchpadHomeBtnClick) {
                    window.fioriLaunchpadHomeBtnClick = false;
                    return result;
                }


                mainModel = oController.getMainModel();



                if (!underscoreJS.isEmpty(oController.getDrillDownBuffer()) &&
                    underscoreJS.isEmpty(newHash.split('?')[0].split(oController.getDocumentNumberFromUrl())[1]) &&
                    !underscoreJS.isEmpty(oldHash.split('?')[0].split(oController.getDocumentNumberFromUrl())[1])) {
                    oController.oldHashUrl = oldHashUrl = oldHash.split(oController.getApplicationIdentifier() + "/")[1];
                }

                if (oldHashUrl) {
                    parentSection = oController.getCurrentSubEntity();
                }

                movingOutOfDocument = newHash.indexOf(global.vui5.cons.applicationContext.document) === -1 &&
                    oldHash.indexOf(global.vui5.cons.applicationContext.document) !== -1;


                movingOutofSearch = oldHash.indexOf(global.vui5.cons.applicationContext.list) !== -1 &&
                    newHash.indexOf(global.vui5.cons.applicationContext.document) === -1;

                if (parentSection['section']) {
                    oController.browserNavBack = true;

                    oController.ajaxAsync = false;
                    oController.processAction.call(oController, "", oController.onNavAction).then(function () {
                        oController.browserNavBack = false;
                        oController.oldHashUrl = undefined;
                        oController.ajaxAsync = undefined;

                    });

                }
                else if (movingOutOfDocument) {

                    oController.browserNavBack = true;
                    oController.ajaxAsync = false;

                    oController.processEvent("", oController.onNavAction).then(function () {
                        oController.browserNavBack = false;
                        oController.oldHashUrl = undefined;
                        oController.ajaxAsync = undefined;
                    });

                }
                else if (movingOutofSearch) {
                    oController.browserNavBack = true;
                    oController.ajaxAsync = false;

                    oController.processEvent("", oController.onNavAction).then(function () {
                        oController.browserNavBack = false;
                        oController.oldHashUrl = undefined;
                        oController.ajaxAsync = undefined;
                    });

                }
                return oController.getOwnerComponent().getRouter().oHashChanger.NavigationFilterStatus.Continue;
            },

            preLogOff: function () {
                var oController = this, objDefer = $.Deferred();
                var oUrlParams = {};
                oUrlParams['sap-sessioncmd'] = "preLogOff";
                oController.currentRoute = global.vui5.currentRoute;
                oController.callServer({
                    url: oController.getServerURL({
                        urlParams: oUrlParams
                    }),
                    async: false
                }).done(function () {
                    objDefer.resolve();
                });

                return objDefer.promise();
            },


            processOvpActions: function (oEvent) {
                this.processServerEvent(oEvent.getParameter("objConfig"));
            },

            collapseDynamicPageHeader: function () {
                var oController = this, mainModel;
                mainModel = oController.getMainModel();

                if (mainModel.getProperty("/COLLAPSE_HEADER") &&
                    mainModel.getProperty("/DYNAMIC_PAGE")) {

                    mainModel.setProperty("/COLLAPSE_HEADER", "");
                    oController.objectPageLayout._getHeaderContent().fireEvent(sap.uxap.ObjectPageLayout.EVENTS.HEADER_VISUAL_INDICATOR_PRESS);
                }
            }

        });
    });
