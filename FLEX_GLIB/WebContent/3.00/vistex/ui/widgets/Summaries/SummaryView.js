sap.ui.define(['sap/ui/core/Control',
  vistexConfig.rootFolder + "/ui/core/global",
  vistexConfig.rootFolder + "/ui/core/underscore-min",
 // vistexConfig.rootFolder + "/ui/widgets/Summaries/ViziChart"
], function (control, global, underscoreJS) {
    var C = control.extend(vistexConfig.rootFolder + ".ui.widgets.Summaries.SummaryView", {
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

                        oContent = oControl.prepareTable(chartDetails, i);
                                                
                    } else if (chartDetails['VWTYP'] == global.vui5.cons.viewType.chart) {
                        
                    	oContent = oControl.prepareChart(chartDetails, i);                    	                        

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
                        
                        	oRightContent = oControl.prepareTable(oSameRowChart[1], index);
                        	
                        } else if (oSameRowChart[1]['VWTYP'] == global.vui5.cons.viewType.chart) {

                        	oRightContent = oControl.prepareChart(oSameRowChart[1], index);                        	                            

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
    };

    C.prototype.prepareTable = function (chartDetails, i) {
    	var oControl = this, oController, tabRef, chartDetailsPath, chartDataPath, sectionID, darid, modelName, model, mainModel;
    	oController = this.getController();
    	chartDetailsPath = this.getChartDetailsPath();
    	chartDataPath = this.getChartDataPath();
    	sectionID = this.getSectionId();
    	darid = this.getDarid();
    	modelName = this.getModelName();
    	model = oController.getModel(modelName);
    	mainModel = oController.getModel(global.vui5.modelName);
    	
        if (chartDetails['TBTYP'] === global.vui5.cons.tableType.nonresponsive) {
           
        	tabRef = new global.vui5.ui.controls.NonResponsiveTable({
                controller: oController,
                modelName: oController.modelName,
                fieldPath: chartDetailsPath + i + "/TABFLDS",
                dataPath: chartDataPath + chartDetails['SUMID'] + "/",
                sectionID: sectionID,
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
        	tabRef.bindProperty("minAutoRowCount", {
                path: modelName + ">"+ chartDataPath + chartDetails['SUMID'] + "/",
                formatter: function (data) {
                    return oController.determineMinRowCount(tabRef, data);
                }
            });
        	tabRef.attachOnFieldClick(function (evt) {
                oController.preProcessFieldClickEvent(sectionID, evt);
            });
        }
        else if(chartDetails['TBTYP'] === global.vui5.cons.tableType.grid){
        	
        	if(!global.vui5.ui.controls.VuiGrid){
        		sap.ui.getCore().loadLibrary(vistexConfig.rootFolder + ".ui.widgets.VuiGrid", {
                    url: vistexConfig.uiResourcePath + "/" + vistexConfig.vuiGridLibraryVersion + "/" + vistexConfig.rootFolder + "/ui/widgets/VuiGrid"
                     
                 });
        	}
        	oController.chartDetails  = chartDetails;
        	tabRef  = new global.vui5.ui.controls.VuiGrid ({
                controller: oController,
                modelName: oController.modelName,
                dataPath: chartDataPath + chartDetails['SUMID'] + "/",
                dataAreaPath: "/DATAR",
                fieldPath : chartDetailsPath + i + "/TABFLDS",
                enableLocalSearch: false,
                enablePersonalization: false,
                title:chartDetails['DESCR'],
                sectionID : sectionID,
                fullScreen:false,
                onFullScreen: function (oEvent) {
                    oController.processFullScreen(sectionID, oEvent.getParameter("fullScreen"));
                },
                onExport: function (oEvent) {
                    var object = oEvent.getParameter('action');
                    object['DARID'] = darid;
                    var callBack = oEvent.getParameter("callBack");
                    oController.processAction.call(oController, sectionID, object, null,oEvent.getParameter("urlParams")).then(function () {
                        if (callBack && callBack instanceof Function) {
                            callBack();
                        }
                    });
                },
                onModeChange:function(oEvent){
                  var callBack = oEvent.getParameter("callBack");
                  oController.processAction.call(oController, sectionID, oEvent.getParameter('action'), null, oEvent.getParameter("urlParams"));
 
                }
            });
        	tabRef.attachOnFieldClick(function (evt) {
        		var urlParams = evt.getParameter("urlParams");
   		            urlParams[global.vui5.cons.params.sumId] = oController.chartDetails['SUMID'];
                oController.preProcessFieldClickEvent(sectionID, evt);
            });

        }
        else{

        	tabRef = new global.vui5.ui.controls.ResponsiveTable({
                controller: oController,
                modelName: oController.modelName,
                fieldPath: chartDetailsPath + i + "/TABFLDS",
                dataPath: chartDataPath + chartDetails['SUMID'] + "/",
                sectionID: sectionID,
                listItemType: sap.m.ListType.Inactive,
                editable: false,
                showTitle: true,
                fullScreen: false,
                title: chartDetails['DESCR'],
                enableLocalSearch: false,
                enablePersonalization: false,
                dataAreaPath: "/DATAR",
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
        	tabRef.attachOnFieldClick(function (evt) {
                oController.preProcessFieldClickEvent(sectionID, evt);
            });
        }
        
        tabRef.setModel(model, modelName);
        tabRef.setModel(mainModel, vui5.modelName);
        
        if(chartDetails['TBTYP'] === global.vui5.cons.tableType.grid)
        	tabRef.onVuiGridInfocusSet();
        else       
        	tabRef.prepareTable();
        
        return tabRef;
    	
    };
    
    C.prototype.prepareChart = function (chartDetails, i) {
    	var oControl = this, oController, chartRef, modelName, model, chartDetailsPath, chartDataPath, sectionID, sectionConfig, section;
    	oController = this.getController();
    	modelName = this.getModelName();
    	model = oController.getModel(modelName);    	
    	chartDetailsPath = this.getChartDetailsPath();
    	chartDataPath = this.getChartDataPath();
    	sectionID = this.getSectionId();
    	sectionConfig = oController.sectionConfig[sectionID];
    	section = oController.getSectionBy("SECTN", sectionID);
    	
    	if (sectionConfig.attributes[global.vui5.cons.attributes.onClick]) {
            sectionConfig.onClick = underscoreJS.findWhere(section['FUNC'], {
                FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onClick]
            });
        }
    	
    	chartRef = new global.vui5.ui.controls.ViziChart({
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
        
    	if (model.getProperty(chartDataPath + chartDetails['SUMID'] + "/")) {
            chartRef.onRenderViziChart();
        }
        
        return chartRef;
    	
    };
    
    C.prototype.getChangedData = function () {
        return this._variantData;
        this._variantData = {};
    };

    return C;
}, true);