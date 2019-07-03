sap.ui.define(['sap/ui/core/Control',
  "vistex/ui/core/global",
  "vistex/ui/core/underscore-min",
 // "vistex/ui/widgets/Vcharts/ViziChart"
], function (control, global, underscoreJS) {
    var C = control.extend("vistex.ui.controls.SummaryView", {
        metadata: {
            properties: {
                sectionId: {
                    type: "string"
                },
                //*****Rel 60E_SP6
                darid: {
                    type: "string"
                },
                sectionFunctionsPath: {
                    type: "string",
                    defaultValue: null
                },
                //*****
                controller: {
                    type: "object",
                    defaultValue: null
                },
                modelName: {
                    type: "string",
                    defaultValue: null
                },
                chartDetailsPath: {
                    type: "string",
                    defaultValue: null
                },
                chartDataPath: {
                    type: "string",
                    defaultValue: null
                }
            },
            aggregations: {
                oControl: {
                    type: "sap.ui.core.Control",
                    multiple: false,
                    visibility: "public"
                }
            },
            events: {
            }
        },
        init: function () { },
        renderer: function (oRM, oControl) {
            oRM.write("<style>");
            oRM.write(".vuiChartAlignMiddle { margin: 0 auto}");
            oRM.write("</style>");
            oRM.write("<div");
            oRM.writeControlData(oControl);
            oRM.write(">");
            oRM.renderControl(oControl.getAggregation("oControl"));
            oRM.write("</div>");
        }
    });

    C.prototype.setSectionId = function (value) {
        this.setProperty("sectionId", value, true);
    };
    //*****Rel 60E_SP6
    C.prototype.setDarid = function (value) {
        this.setProperty("darid", value, true);
    };
    C.prototype.setSectionFunctionsPath = function (value) {
        this.setProperty("sectionFunctionsPath", value, true);
    };
    //*****
    C.prototype.setController = function (controller) {
        this.setProperty('controller', controller);
    },
    C.prototype.setModelName = function (name) {
        this.setProperty('modelName', name);
    },
    C.prototype.setChartDetailsPath = function (path) {
        this.setProperty('chartDetailsPath', path);
    },

    C.prototype.setChartDataPath = function (path) {
        this.setProperty('chartDataPath', path);
    },

    C.prototype.renderSummaryView = function (path) {
        var oController = this.getController();
        var oControl = this;
        var modelName = this.getModelName();
        var sectionID = this.getSectionId();
        //*****Rel 60E_SP6
        var darid = this.getDarid();
        //*****
        var chartDetailsPath = this.getChartDetailsPath();
        var chartDataPath = this.getChartDataPath();
        var oModel = oController.getModel(modelName);
        var mainModel = oController.getMainModel();
        var sectionConfig = oController.sectionConfig[sectionID];
        var section = oController.getSectionBy("SECTN", sectionID);

        //*****Rel 60E_SP6
        var sectionFunPath = oControl.getSectionFunctionsPath();
        var sectionFunctions = oModel.getProperty(sectionFunPath);

        var summaryToolbar = new sap.m.Toolbar({
            content: [new sap.m.ToolbarSpacer({})]
        }).bindProperty("visible", {
            path: modelName + ">" + sectionFunPath,
            formatter: function (functions) {
                return underscoreJS.find(functions, { "HIDFN": "" }) ? true : false;
            }
        }).addStyleClass('VuiFormToolBar');

        underscoreJS.each(sectionFunctions, function (obj, i) {
            var button = oControl._prepareButtonControl(obj, obj['SECTN'], true);
            summaryToolbar.addContent(button);
        });
        //*****

        if (sectionConfig.attributes[global.vui5.cons.attributes.onClick]) {
            sectionConfig.onClick = underscoreJS.findWhere(section['FUNC'], {
                FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onClick]
            });
        }

        if (oModel) {
            var chartData = oModel.getProperty(this.getChartDataPath());
            var oDisplayControls = [], handle;
            var oRow = "";

            if (oController._summaryChartDetails === undefined) {
                oController._summaryChartDetails = [];
            }
            var chartDetailsData = underscoreJS.isEmpty(oController._summaryChartDetails) ? oModel.getProperty(chartDetailsPath) : oController._summaryChartDetails;
            underscoreJS.each(oModel.getProperty(chartDetailsPath), function (chartDetails, i) {
                var oContent, oRightContent;
                handle = oController.getProfileInfo()['UIPRF'] + oControl.getProperty("sectionId") + chartDetails.SUMID;

                if (oRow != chartDetails['ROWNO'] || oRow == "00") {
                    oRow = chartDetails['ROWNO'];

                    if (chartDetails['VWTYP'] == global.vui5.cons.viewType.grid) {

                        if (chartDetails['TBTYP'] === global.vui5.cons.tableType.nonresponsive) {
                            oContent = new global.vui5.ui.controls.NonResponsiveTable({
                                controller: oController,
                                modelName: oController.modelName,
                                fieldPath: chartDetailsPath + i + "/TABFLDS",
                                dataPath: chartDataPath + chartDetails['SUMID'] + "/",
                                sectionID: oControl.getProperty("sectionId"),
                                title: chartDetails['DESCR'],
                                dataAreaPath: "/DATAR",
                                showTitle: true,
                                fullScreen: false,
                                editable: false,
                                enablePersonalization: false,
                                enableLocalSearch: false,
                                backendSortFilter: false,
                                hideDetailButton: true,
                                selectionMode: sap.ui.table.SelectionMode.None,
                                onFullScreen: function (oEvent) {
                                    if (!oEvent.getParameter("fullScreen")) {
                                        oController._summaryChartDetails = [];
                                    }
                                    else {
                                        oController._summaryChartDetails.push(chartDetails);
                                    }
                                    oController.processFullScreen(sectionID, oEvent.getParameter("fullScreen"), true);
                                },
                                onExport: function (oEvent) {
                                    var object = oEvent.getParameter('action');
                                    object['DARID'] = darid;
                                    callBack = oEvent.getParameter("callBack");
                                    oController.processAction.call(oController, sectionID, object, null).then(function () {
                                        if (callBack && callBack instanceof Function) {
                                            callBack();
                                        }
                                    });
                                }
                            });
                        }
                        else {


                            oContent = new global.vui5.ui.controls.ResponsiveTable({
                                controller: oController,
                                modelName: oController.modelName,
                                fieldPath: chartDetailsPath + i + "/TABFLDS",
                                dataPath: chartDataPath + chartDetails['SUMID'] + "/",
                                listItemType: sap.m.ListType.Inactive,
                                editable: false,
                                showTitle: true,
                                fullScreen: true,
                                title: chartDetails['DESCR'],
                                enableLocalSearch: false,
                                //*****Rel 60E_SP6
                                enablePersonalization: false,
                                //*****
                                dataAreaPath: "/DATAR",
                                //handle : handle,
                                growing: true,
                                backendSortFilter: false,
                                layoutDataPath: chartDataPath + chartDetails['SUMID'] + global.vui5.cons.nodeName.layout + "/",
                                onFullScreen: function (oEvent) {
                                    if (!oEvent.getParameter("fullScreen")) {
                                        oController._summaryChartDetails = [];
                                    }
                                    else {
                                        oController._summaryChartDetails.push(chartDetails);
                                    }
                                    oController.processFullScreen(sectionID, oEvent.getParameter("fullScreen"), true);
                                },
                                //*****Rel 60E_SP6
                                onExport: function (oEvent) {
                                    var object = oEvent.getParameter('action');
                                    object['DARID'] = darid;
                                    callBack = oEvent.getParameter("callBack");
                                    oController.processAction.call(oController, sectionID, object, null).then(function () {
                                        if (callBack && callBack instanceof Function) {
                                            callBack();
                                        }
                                    });
                                }
                                //*****
                            });
                        }
                        oContent.setModel(oModel, modelName);
                        oContent.setModel(mainModel, vui5.modelName);
                        oContent.prepareTable();
                    } else if (chartDetails['VWTYP'] == global.vui5.cons.viewType.chart) {
                        sap.ui.getCore().loadLibrary("vistex.ui.widgets.Vcharts", {
                            //url: vistex.uiResourcePath + "/1.00/vistex/ui/widgets/Vcharts"
                            url: vistexConfig.uiResourcePath + "/" + vistexConfig.vchartsLibraryVersion + "/vistex/ui/widgets/Vcharts"

                        });
                        oContent = new global.vui5.ui.controls.ViziChart({
                            controller: oController,
                            modelName: modelName,
                            sumId: chartDetails['SUMID'],
                            metadataPath: chartDetailsPath + i + "/METADATA",
                            configPath: chartDetailsPath + i + "/CONFIG",
                            dataPath: chartDataPath + chartDetails.SUMID + "/",
                            onNavigate: function (oEvent) {
                                var params = oEvent.getParameter("params");
                                oController.processAction(sectionID, sectionConfig.onClick, null, params);
                            }
                        });
                        if (oModel.getProperty(chartDataPath + chartDetails.SUMID + "/")) {
                            oContent.onRenderViziChart();
                        }

                    } else if (chartDetails['VWTYP'] == global.vui5.cons.viewType.value) {

                        var tileContent = new sap.m.TileContent({
                            content: new sap.m.NumericContent()
                                       .bindProperty("value", modelName + ">" + chartDataPath + chartDetails.SUMID + "/0/" + chartDetails['FIELDS'][0]['FLDNM'],
                                              null, sap.ui.model.BindingMode.OneWay)
                        });

                        oRightContent = new sap.m.GenericTile({
                            header: chartDetails['FIELDS'][0]['DESCR'],
                            tileContent: [tileContent],
                            //*****Rel 60E_SP6          	            		  
                            press: function (oEvent) {
                                var params = {};
                                params[vui5.cons.params.sumId] = chartDetails['SUMID'];
                                oController.processAction(sectionID, sectionConfig.onClick, null, params);
                            }
                            //*****          	
                        })
                    } else if (chartDetails['VWTYP'] == global.vui5.cons.viewType.microchart) {
                        //*****Rel 60E_SP6            
                        var title = oModel.getProperty(chartDetailsPath + i + "/DESCR");
                        //*****
                        oContent = new global.vui5.ui.controls.MicroChartControl({
                            controller: oController,
                            modelName: modelName,
                            chartDetailsPath: chartDetailsPath + i,
                            chartDataPath: chartDataPath + chartDetails.SUMID + "/",
                            //*****Rel 60E_SP6
                            title: title,
                            onNavigate: function (oEvent) {
                                var params = oEvent.getParameter("params");
                                oController.processAction(sectionID, sectionConfig.onClick, null, params);
                            }
                            //*****              
                        });
                        if (oModel.getProperty(chartDataPath + chartDetails.SUMID + "/")) {
                            oContent.chartObjectGet();
                        }
                    }

                    var oSameRowChart = underscoreJS.where(oModel.getProperty(chartDetailsPath), {
                        ROWNO: chartDetails['ROWNO']
                    });

                    if (oSameRowChart.length > 1 && oRow != "00") {
                        var index = underscoreJS.findLastIndex(oModel.getProperty(chartDetailsPath), {
                            ROWNO: chartDetails['ROWNO']
                        });

                        if (oSameRowChart[1]['VWTYP'] == global.vui5.cons.viewType.grid) {
                            if (oSameRowChart[1]['TBTYP'] === global.vui5.cons.tableType.nonresponsive) {
                                oRightContent = new global.vui5.ui.controls.NonResponsiveTable({
                                    controller: oController,
                                    modelName: oController.modelName,
                                    fieldPath: chartDetailsPath + index + "/TABFLDS",
                                    dataPath: chartDataPath + oSameRowChart[1]['SUMID'] + "/",
                                    title: oSameRowChart[1]['DESCR'],
                                    dataAreaPath: "/DATAR",
                                    showTitle: true,
                                    fullScreen: true,
                                    editable: false,
                                    enablePersonalization: false,
                                    enableLocalSearch: false,
                                    backendSortFilter: false,
                                    hideDetailButton: true,
                                    selectionMode: sap.ui.table.SelectionMode.None,
                                    onFullScreen: function (oEvent) {
                                        if (!oEvent.getParameter("fullScreen")) {
                                            oController._summaryChartDetails = [];
                                        }
                                        else {
                                            oController._summaryChartDetails.push(chartDetails);
                                        }
                                        oController.processFullScreen(sectionID, oEvent.getParameter("fullScreen"), true);
                                    },
                                    onExport: function (oEvent) {
                                        var object = oEvent.getParameter('action');
                                        object['DARID'] = darid;
                                        callBack = oEvent.getParameter("callBack");
                                        oController.processAction.call(oController, sectionID, object, null).then(function () {
                                            if (callBack && callBack instanceof Function) {
                                                callBack();
                                            }
                                        });
                                    }

                                });
                            }
                            else {
                                oRightContent = new global.vui5.ui.controls.ResponsiveTable({
                                    controller: oController,
                                    modelName: oController.modelName,
                                    fieldPath: chartDetailsPath + index + "/TABFLDS",
                                    dataPath: chartDataPath + oSameRowChart[1]['SUMID'] + "/",
                                    listItemType: sap.m.ListType.Inactive,
                                    editable: false,
                                    showTitle: true,
                                    title: oSameRowChart[1]['DESCR'],
                                    fullScreen: true,
                                    enableLocalSearch: false,
                                    //*****Rel 60E_SP6
                                    enablePersonalization: false,
                                    //*****
                                    dataAreaPath: "/DATAR",
                                    //handle : handle,
                                    growing: true,
                                    backendSortFilter: false,
                                    layoutDataPath: chartDataPath + oSameRowChart[1]['SUMID'] + global.vui5.cons.nodeName.layout + "/",
                                    onFullScreen: function (oEvent) {
                                        if (!oEvent.getParameter("fullScreen")) {
                                            oController._summaryChartDetails = [];
                                        }
                                        else {
                                            oController._summaryChartDetails.push(chartDetails);
                                        }
                                        oController.processFullScreen(sectionID, oEvent.getParameter("fullScreen"), true);
                                    },
                                    //*****Rel 60E_SP6
                                    onExport: function (oEvent) {
                                        var object = oEvent.getParameter('action');
                                        object['DARID'] = darid;
                                        callBack = oEvent.getParameter("callBack");
                                        oController.processAction.call(oController, sectionID, object, null).then(function () {
                                            if (callBack && callBack instanceof Function) {
                                                callBack();
                                            }
                                        });
                                    }
                                    //*****
                                });
                            }
                            oRightContent.setModel(oModel, modelName);
                            oRightContent.setModel(mainModel, vui5.modelName);
                            oRightContent.prepareTable();
                        } else if (oSameRowChart[1]['VWTYP'] == global.vui5.cons.viewType.chart) {
                            sap.ui.getCore().loadLibrary("vistex.ui.widgets.Vcharts", {
                                //url: vistex.uiResourcePath + "/1.00/vistex/ui/widgets/Vcharts"
                                url: vistexConfig.uiResourcePath + "/" + vistexConfig.vchartsLibraryVersion + "/vistex/ui/widgets/Vcharts"

                            });
                            oRightContent = new global.vui5.ui.controls.ViziChart({
                                controller: oController,
                                modelName: modelName,
                                sumId: oSameRowChart[1]['SUMID'],
                                metadataPath: chartDetailsPath + index + "/METADATA",
                                configPath: chartDetailsPath + index + "/CONFIG",
                                dataPath: chartDataPath + oSameRowChart[1]['SUMID'] + "/",
                                onNavigate: function (oEvent) {
                                    var params = oEvent.getParameter("params");
                                    oController.processAction(sectionID, sectionConfig.onClick, null, params);
                                }
                            });
                            if (oModel.getProperty(chartDataPath + oSameRowChart[1]['SUMID'] + "/")) {
                                oRightContent.onRenderViziChart();
                            }

                        }
                        else if (oSameRowChart[1]['VWTYP'] == global.vui5.cons.viewType.value) {

                            var tileContent = new sap.m.TileContent({
                                content: new sap.m.NumericContent()
                                           .bindProperty("value", modelName + ">" + chartDataPath + chartDetails.SUMID + "/0/" + oSameRowChart[1]['FIELDS'][0]['FLDNM'],
                                                  null, sap.ui.model.BindingMode.OneWay)
                            });

                            oRightContent = new sap.m.GenericTile({
                                header: oSameRowChart[1]['FIELDS'][0]['DESCR'],
                                tileContent: [tileContent],
                                //*****Rel 60E_SP6              		
                                press: function (oEvent) {
                                    var params = {};
                                    params[vui5.cons.params.sumId] = oSameRowChart[1]['SUMID'];
                                    oController.processAction(sectionID, sectionConfig.onClick, null, params);
                                }
                                //*****              	
                            })
                        }
                        else if (oSameRowChart[1]['VWTYP'] == global.vui5.cons.viewType.microchart) {
                            //*****Rel 60E_SP6
                            var title = oModel.getProperty(chartDetailsPath + index + "/DESCR");
                            //*****              
                            oRightContent = new global.vui5.ui.controls.MicroChartControl({
                                controller: oController,
                                modelName: modelName,
                                chartDetailsPath: chartDetailsPath + index,
                                chartDataPath: chartDataPath + oSameRowChart[1]['SUMID'] + "/",
                                //*****Rel 60E_SP6
                                title: title,
                                onNavigate: function (oEvent) {
                                    var params = oEvent.getParameter("params");
                                    oController.processAction(sectionID, sectionConfig.onClick, null, params);
                                }
                                //*****              
                            });
                            if (oModel.getProperty(chartDataPath + oSameRowChart[1]['SUMID'] + "/")) {
                                oRightContent.chartObjectGet();
                            }

                        }

                    }

                }
                if (!underscoreJS.isEmpty(oController._summaryChartDetails)) {
                    if (oRightContent) {
                        oDisplayControls.push(oRightContent);
                    }
                    else if (oContent) {
                        oDisplayControls.push(oContent);
                    }
                }
                else {
                    if (oRightContent) {
                        oDisplayControls.push(
                          new sap.ui.layout.Grid({
                              defaultSpan: "L6 M6 S12",
                              content: [oContent, oRightContent]
                          }).addStyleClass("VuiChartGrid")
                        );
                    } else if (oContent) {
                        oDisplayControls.push(
                          new sap.ui.layout.Grid({
                              defaultSpan: "L12 M12 S12",
                              content: [oContent]
                          }).addStyleClass("VuiChartGrid")
                        );
                    }
                }
            });
        }

        var oFlexBox = new sap.m.FlexBox({
            justifyContent: sap.m.FlexJustifyContent.Center,
            direction: sap.m.FlexDirection.Column,
            items: [summaryToolbar, oDisplayControls]
        });

        this.setAggregation('oControl', oFlexBox);
    },

    C.prototype.getChangedData = function () {
        return this._variantData;
        this._variantData = {};
    }

    return C;
}, true);