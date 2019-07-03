define = undefined;
sap.ui.define([vistexConfig.rootFolder + "/ui/core/global",
    vistexConfig.rootFolder + "/ui/core/underscore-min",
    "./jquery-ui-min",
    "./powerTip",
    "./bootstrap-min",
    "./jquery-svg-min",
    "./jquery-svgdom",
    "./ganttDrawerSVG",
    "./jquery-treegrid",
    "./CustomPanel",
    "./extendedCalendarContainer",
    "./TcGlobalMolecule"
], function(global, underscoreJS) {
    var A = sap.ui.core.Control.extend(
        vistexConfig.rootFolder + ".ui.widgets.Calendar.TradeCalendar", {
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
                    dataPath: {
                        type: "string",
                        defaultValue: null
                    },
                    sectionPath: {
                        type: "string",
                        defaultValue: null
                    }
                },
                events: {
                    messagesShow: {
                        parameters: {
                            selectionSet: {
                                type: "sap.ui.core.Control[]"
                            }
                        }
                    },
                    onAdditionalInfoPress: {},
                    onAddPress: {},
                    onDeletePress: {},
                    onViewChange: {}
                },
                aggregations: {
                    _calendar: {
                        type: "sap.ui.core.Control",
                        multiple: false

                    },
                    _toolbar: {
                        type: "sap.m.Bar",
                        multiple: false,
                        visibility: "hidden"
                    }
                }
            },
            init: function() {
                var oControl = this;
                this.modelName = 'calendarModel';
                this._oBundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.widgets.Calendar");
                $('#calendarContainer').empty();
                $('#calendarContainer').remove();
                var calendarModel = new sap.ui.model.json.JSONModel();


                var data = { // for backend

                    "DISPLAY_SECOBJ": false,
                    "DISPLAY_PRIOBJ": true,
                    "DIVIDERLINES": true,
                    "SPLITVIEW": true,
                    "OVERLAPMODE": false,
                    "LINKVIEW": false,
                    "DISPLAY_MODE": "2",
                    "ANCHORDATE": '',
                    "ZOOMCOUNT": 1 //always start with 1
                };
                var internalSettingsForCalendar = {
                    "SWITCHSTATE": true,
                    "VALIDITYPOPUPSTART": "",
                    "VALIDITYPOPUPEND": "",
                    "MAXSLIDERRANGE": 5,
                    "RBINDEX": 0,
                    "SECONDINSTANCE": false,
                    "TIMESLOT": true

                }
                calendarModel.setProperty('/CALENDARSETTINGS', data);
                calendarModel.setProperty('/INTERNALSETTINGSFORCALENDAR', internalSettingsForCalendar);
                this.setModel(calendarModel, "calendarModel");

            },
            renderer: function(oRM, oControl) {

                oRM.write("<div");
                oRM.writeControlData(oControl);
                oRM.write(">");
                oRM.write("<style>");
                oRM.write(".dupFileDialogBox > .sapMDialogSection { background-color:white !important; }");
                oRM.write("</style>");
                oRM.renderControl(oControl.pBody);
                oRM.write("</div>");


            }
        });
    A.prototype.prepareChartBody = function() {
        var oControl = this;
        var sLocale = sap.ui.getCore().getConfiguration().getLanguage();
        if (sLocale.length > 2) {
            sLocale = sLocale.substring(0, 2);
        }
        oControl.innerButtons = [];
        var calendarModel = oControl.getModel("calendarModel");

        oControl.pBody.bindAggregation('content', oControl.getModelName() + '>' + oControl.getDataPath(), function(id, ctx) {
            oControl.updateCalendarData(oControl.section)
            return new sap.suite.ui.commons.ChartContainerContent({
                content: [new sap.viz.ui5.controls.VizFrame({
                    parentControl: [
                        new sap.ui.core.HTML({
                            preferDOM: false,
                            sanitizeContent: true,
                            content: "<div id='calendarContainer'></div>",
                            afterRendering: [oControl.afterRender, oControl],
                        })
                    ]
                })]
            })
        }).setModel(oControl.getController().getCurrentModel(), oControl.getModelName()).addStyleClass("sapUiSizeCompact")
        oControl.pBody.setModel(calendarModel, "calendarModel")
        oControl.menuButton.getAggregation('items')[0].removeAllItems()
        oControl.menuButton.getAggregation('items')[1].removeAllItems()


        for (var i = 0; i < oControl.section.FUNC.length; i++) {
            var ctxObj = oControl.section.FUNC[i];
            oControl.menuButton.getAggregation('items')[0].insertItem(
                new sap.m.MenuItem({
                    icon: ctxObj['FNICN'],
                    text: ctxObj['DESCR'],
                    key: ctxObj['FNCNM'],
                    visible: (ctxObj['HIDFN'] == "X") ? false : true
                }))
            oControl.menuButton.getAggregation('items')[1].insertItem(
                new sap.m.MenuItem({
                    icon: ctxObj['FNICN'],
                    text: ctxObj['DESCR'],
                    key: ctxObj['FNCNM'],
                    visible: (ctxObj['HIDFN'] == "X") ? false : true
                }))

        }
    }
    A.prototype.prepareGantt = function() {
        var oControl = this;
        var calendarModel = oControl.getModel("calendarModel");
        var sLocale = sap.ui.getCore().getConfiguration().getLanguage();
        if (sLocale.length > 2) {
            sLocale = sLocale.substring(0, 2);
        }
        oControl.menuButton = new sap.m.Menu({
                itemSelected: [oControl.onActionPress, oControl],
                items: [
                    new sap.m.MenuItem({
                        text: {
                            path: oControl.modelName + '>/OBJDESCR',
                            formatter: function(e) {
                                return e ? e.split('(')[0] : '';
                            }
                        },
                        visible: '{' + oControl.modelName + '>/CALENDARSETTINGS/DISPLAY_PRIOBJ' + '}',

                    }).data({
                        'chartId': '1'
                    }),
                    new sap.m.MenuItem({
                        text: {
                            path: oControl.modelName + '>/REQOBJDESCR',
                            formatter: function(e) {
                                return e ? e.split('(')[0] : '';
                            }

                        },
                        visible: '{' + oControl.modelName + '>/CALENDARSETTINGS/DISPLAY_SECOBJ' + '}',
                    }).data({
                        'chartId': '2'
                    })
                ]
            }),

            oControl.zoomInObj = new sap.m.Button({
                press: [oControl.zoomIn, oControl],
                icon: "sap-icon://zoom-out",
                visible: "{= ${calendarModel>/INTERNALSETTINGSFORCALENDAR/MAXSLIDERRANGE} > 1 ? true : false }"
            }),
            oControl.sliderObj = new sap.m.Slider({
                step: 1,
                min: 1,
                max: '{' + oControl.modelName + '>/INTERNALSETTINGSFORCALENDAR/MAXSLIDERRANGE}',
                value: '{' + oControl.modelName + '>/CALENDARSETTINGS/ZOOMCOUNT}',
                width: "18%",
                enableTickmarks: true,
                change: [oControl.scaleChange, oControl],
                visible: "{= ${calendarModel>/INTERNALSETTINGSFORCALENDAR/MAXSLIDERRANGE} > 1 ? true : false }",
                
            }),
            oControl.zoomOutObj = new sap.m.Button({
                icon: "sap-icon://zoom-in",
                press: [oControl.zoomOut, oControl],
                visible: "{= ${calendarModel>/INTERNALSETTINGSFORCALENDAR/MAXSLIDERRANGE} > 1 ? true : false }"
            }),


            oControl.hbox = new sap.m.HBox({
                items: [

                    new sap.m.Button({
                        icon: "sap-icon://share",
                        tooltip:this._oBundle.getText('SwapCalendar'),
                        visible: '{calendarModel>/INTERNALSETTINGSFORCALENDAR/SECONDINSTANCE}',
                        press: [oControl.switchCharts, oControl],
                    }),

                ]
            })

        oControl.toolbar = new sap.m.OverflowToolbar({
            content: [
                new sap.m.ToolbarSpacer({}),
                oControl.hbox,
                new sap.m.Button({
                    icon: "sap-icon://outdent",
                    tooltip:this._oBundle.getText('ToggleTree'),
                    press: [oControl.treeToggle, oControl],
                }),
                new sap.m.Button({
                    icon: "sap-icon://appointment-2",
                    tooltip:this._oBundle.getText('ToggleCalendar'),
                    press: [oControl.calendarToggle, oControl],
                }),
                new sap.m.Button({
                    icon: "sap-icon://indent",
                    tooltip:this._oBundle.getText('ToggleEvents'),
                    press: [oControl.eventToggle, oControl],
                }),
                new sap.m.SearchField({
                    width: "25%",
                    liveChange: [oControl.filterTasks, oControl],
                    placeholder: this._oBundle.getText("Filter"),
                }),
                new sap.m.MenuButton({
                    text: this._oBundle.getText('Actions'),
                    icon: 'sap-icon://action',
                    buttonMode: "Split",
                    visible: "{= !${calendarModel>/CALENDARSETTINGS/OVERLAPMODE} && ${calendarModel>/MODE} !== 'A' }",
                    useDefaultActionOnly: true,
                    menu: [oControl.menuButton]
                }),
                oControl.zoomInObj,
                oControl.sliderObj,
                oControl.zoomOutObj,
                new sap.m.Button({
                    icon: "sap-icon://undo",
                    visible: "{= ${calendarModel>/MODE} !== 'A' }",
                    press: [oControl.undo, oControl]
                }),
                new sap.m.Button({
                    icon: "sap-icon://redo",
                    visible: "{= ${calendarModel>/MODE} !== 'A' }",
                    press: [oControl.redo, oControl]
                }),
                new sap.m.Button({
                    tooltip: {
                        path: oControl.modelName + '>/SECTIONFUNC',
                        formatter: function(val) {
                            return underscoreJS.find(val, {
                                'FNCNM': "CALVIEW"
                            }) ? underscoreJS.find(val, {
                                'FNCNM': "CALVIEW"
                            }).DESCR : '';
                        }
                    },
                    icon: {
                        path: oControl.modelName + '>/SECTIONFUNC',
                        formatter: function(val) {
                            return underscoreJS.find(val, {
                                'FNCNM': "CALVIEW"
                            }) ? underscoreJS.find(val, {
                                'FNCNM': "CALVIEW"
                            }).FNICN : '';
                        }
                    },
                    visible: {
                        path: oControl.modelName + '>/SECTIONFUNC',
                        formatter: function(e) {
                            return underscoreJS.find(e, {
                                'FNCNM': "CALVIEW"
                            }) ? true : false
                        }

                    },
                    press: [oControl.viewChange, oControl]
                }),
                new sap.suite.ui.commons.ChartContainerToolbarPlaceholder({})
            ]
        }).setModel(calendarModel, "calendarModel").addStyleClass('appToolbar');
        oControl.pBody = new sap.suite.ui.commons.ChartContainer({
            showPersonalization: true,
            showFullScreen: true,
            fullScreen: false,
            showLegend: false,
            autoAdjustHeight: false,
            showZoom: false,
            showLegendButton: false,
            personalizationPress: [oControl.onPressSettingsButton, oControl],
            toolbar: [oControl.toolbar]
        }).addStyleClass('parentChartContainer')

    }, A.prototype.filterTasks = function(oEvt) {
        var oControl = this;
        var searchText = oEvt.getSource().getValue();
        oControl.ganttChart.filterTasks(searchText);
    }, A.prototype._getChangedData = function(oEvt) {
        var oControl = this;
        return self.sendData ? self.sendData : [];
    };
    A.prototype.treeToggle = function(oEvt) {
    	this.ganttChart.toggleBothCharts();
        },
        A.prototype.switchCharts = function(oEvt) {
            var oControl = this;
            var oController = this.getProperty("controller");
            var calendarModel = this.getModel(this.modelName); // calendar
            oControl.ganttChart.switchCharts();


        },
        A.prototype.eventToggle = function(oEvt) {
        	this.ganttChart.toggleEvents();
        },
        A.prototype.calendarToggle = function(oEvt) {
        	this.ganttChart.toggleCalendar();
        },

        A.prototype.updateCalendarData = function(section) {

            var oControl = this;
            oControl.section = section;
            var oController = this.getProperty("controller");
            var calendarModel = this.getModel(this.modelName); // calendar
            var mainModel = oController.getModel('mainModel'); // main
            calendarModel.setProperty("/MODE", mainModel.getProperty("/DOCUMENT_MODE"));
            var model = oController.getModel(oController.modelName); // infocus
            var response = model.getProperty(oControl.getDataPath())
            response = (response[0] == undefined) ? response : response[0];
            oControl.dateFormat = response['DATEFORMAT'];
            oControl.document_mode = mainModel.getProperty('/DOCUMENT_MODE');
            oControl.events_p = response['EVENTS_P'];
            oControl.levels_p = response['LEVELS_P'];
            calendarModel.setProperty("/LAYOUT_P", response['LAYOUT_P']);
            calendarModel.setProperty("/LAYOUTID_P", response['LAYOUTID_P']);
            oControl.start_p = response['START_P'];
            oControl.end_p = response['END_P'];
            oControl.data_p = response['DATA_P'];
            oControl.columns_p = response['TREEFCAT_P'];
            //oControl.quickInfo = response['QUICKINFO'];
            oControl.barData_p = response['BARDATA_P'];
            oControl.primaryObjectTitle = response['PRIMARY_TITLE'];
            calendarModel.setProperty("/OBJDESCR", response['PRIMARY_TITLE']);
            var acDate = (new Date() > new Date(oControl.end_p)) ? new Date(oControl.end_p) : new Date();
            calendarModel.setProperty('/CALENDARSETTINGS/ANCHORDATE', acDate.getFullYear() + "-" + (acDate.getMonth() + 1) + "-" + acDate.getDate())
            oControl.CALENDARSETTINGS = oControl.getModel('calendarModel').getProperty('/CALENDARSETTINGS');
            oControl.INTERNALSETTINGSFORCALENDAR = oControl.getModel('calendarModel').getProperty('/INTERNALSETTINGSFORCALENDAR');
            calendarModel.setProperty("/INTERNALSETTINGSFORCALENDAR/MAXSLIDERRANGE", oControl.levels_p.length - 1);
            calendarModel.setProperty("/LAYOUTID_S", response['LAYOUTID_S']);
            calendarModel.setProperty("/LAYOUT_S", response['LAYOUT_S']);
            oControl.start_s = response['START_S']
            oControl.end_s = response['END_S']
            oControl.events_s = response['EVENTS_S'] ? response['EVENTS_S'] : [];
            oControl.levels_s = response['LEVELS_S'] ? response['LEVELS_S'] : [];
            oControl.columns_s = response['TREEFCAT_S'] ? response['TREEFCAT_S'] : [];
            oControl.data_s = response['DATA_S'] ? response['DATA_S'] : [];

            if (oControl.columns_s.length > 0 && oControl.data_s) {
                calendarModel.setProperty("/CALENDARSETTINGS/DISPLAY_SECOBJ", true);
                calendarModel.setProperty("/INTERNALSETTINGSFORCALENDAR/SECONDINSTANCE", true);
            }
            oControl.secondaryObjectTitle = response['SECONDARY_TITLE'] ? response['SECONDARY_TITLE'] : "";
            calendarModel.setProperty("/REQOBJDESCR", response['SECONDARY_TITLE']);
            oControl.barData_s = response['BARDATA_S'] ? response['BARDATA_S'] : [];
            // oControl.requestQuickInfo = response['QUICKINFO_S'] ? response['QUICKINFO_S'] : [];
        }
    A.prototype.DataPrepare = function(oController, section) {


        var oControl = this;
        oControl.section = section;
        var oController = this.getProperty("controller");
        var calendarModel = this.getModel(this.modelName); // calendar
        var mainModel = oController.getModel('mainModel'); // main
        calendarModel.setProperty("/MODE", mainModel.getProperty("/DOCUMENT_MODE"));
        var model = oController.getModel(oController.modelName);
        calendarModel.setProperty('/SECTIONFUNC', section.FUNC);
        underscoreJS.each(section.FUNC, function(f, i, l) {
            if ((f['FNCNM'] == 'DETAILS') ||
                (f['FNCNM'] == 'CALVIEW') || (f['FNCNM'] == 'LYCHNG')) {
                f['HIDFN'] = "X";
            }
        })

        var response = model.getProperty(oControl.getDataPath());
        if (response != undefined) {
            oControl.prepareGantt();
            oControl.prepareChartBody(section);
            oControl.afterRender();

        }
    }

    A.prototype.removeBusyIndicator = function() {

        var oControl = this;
        setTimeout(function() {
            oControl.pBody.setBusyIndicatorDelay(0);
            oControl.pBody.setBusy(false);
        }, 500)



    }
    A.prototype.addBusyIndicator = function() {

        var oControl = this;
        oControl.pBody.setBusyIndicatorDelay(0);
        oControl.pBody.setBusy(true);

    }

    A.prototype.onClickChangeValidity = function(oEvt) {
            var oControl = this;
            var calendarModel = oControl.getModel('calendarModel');
            var reqObject = calendarModel.getProperty('/INTERNALSETTINGSFORCALENDAR');
            if (new Date(reqObject.VALIDITYPOPUPSTART) > new Date(reqObject.VALIDITYPOPUPEND)) {
                //StartdatecannotbeafterEnddate = Start date cannot be after End date
                sap.m.MessageToast.show(this._oBundle.getText('StartdatecannotbeafterEnddate'), {
                    width: "19em",
                });

            } else {
                oControl.validityDialog.close()
                this.ganttChart.onClickChangeValidity(reqObject.VALIDITYPOPUPSTART, reqObject.VALIDITYPOPUPEND)
            }

        },
        A.prototype.scalingFunction = function(oCtrl, zoomCount) {

            var oControl = this;
            var calendarModel = oControl.getModel('calendarModel');
            var reqObject = calendarModel.getProperty('/CALENDARSETTINGS');
            calendarModel.setProperty('/CALENDARSETTINGS/ZOOMCOUNT', (self.zoomCount))
        },

        A.prototype.zoomIn = function(oEvt) {
            var oControl = this;
            var calendarModel = oControl.getModel("calendarModel");
            this.ganttChart.zoomIn();
            calendarModel.setProperty('/CALENDARSETTINGS/ZOOMCOUNT', (self.zoomCount))
        },

        A.prototype.zoomOut = function(oEvt) {
            var oControl = this;
            var calendarModel = oControl.getModel("calendarModel");
            this.ganttChart.zoomOut();
            calendarModel.setProperty('/CALENDARSETTINGS/ZOOMCOUNT', (self.zoomCount))
        }
    A.prototype.scaleChange = function(oEvt) {
            var oControl = this;
            var calendarModel = oControl.getModel('calendarModel');
            var currentLevel = oEvt.getSource().getValue();
            this.ganttChart.zoomThroughScale(currentLevel)
            calendarModel.setProperty('/CALENDARSETTINGS/ZOOMCOUNT', (self.zoomCount))

        },

        A.prototype.undo = function(oEvt) {
            this.ganttChart.undoMove();
        }
    A.prototype.viewChange = function() {
            var oControl = this;
            oControl.fireOnViewChange({});
        },
        A.prototype.redo = function(oEvt) {
            this.ganttChart.redoMove();
        },
        A.prototype.modelBackupFunction = function() {
            var oControl = this;
            var calendarModel = oControl.getModel('calendarModel');
            calendarModel.setProperty("/BACKUP", underscoreJS.clone(calendarModel.getProperty("/CALENDARSETTINGS")));
        }
    A.prototype.onClickOkDialog = function(oEvt) {

            var oControl = this;
            var calendarModel = oControl.getModel('calendarModel');
            var reqObject = calendarModel.getProperty('/CALENDARSETTINGS');
            var backUpObject = calendarModel.getProperty('/BACKUP');



            if (oEvt.getSource().getVisiblePanel().getType() == 'layout') {
                var data = [{
                        "NAME": "PL",
                        "VALUE": calendarModel.getProperty('/LAYOUTID_P')
                    },
                    {
                        "NAME": "SL",
                        "VALUE": calendarModel.getProperty('/LAYOUTID_S')
                    }
                ]
                var oFunction = underscoreJS.find(oControl.section.FUNC, {
                    "FNCNM": "LYCHNG"
                });
                oControl.getController().processAction(oControl.section.SECTN, oFunction, data)

            } else {


                oEvt.getSource().close();
                /////////////////////////////////////////////
                if (reqObject.DISPLAY_MODE != backUpObject.DISPLAY_MODE) {
                    this.ganttChart.continueMaxMinFun(reqObject.DISPLAY_MODE);
                    //oEvt.getSource().close();
                    return false;
                }
                /////////////////////////////////////////////

                if (reqObject.DISPLAY_PRIOBJ && reqObject.DISPLAY_SECOBJ) {
                    calendarModel.setProperty("/INTERNALSETTINGSFORCALENDAR/SECONDINSTANCE", true);
                } else {
                    calendarModel.setProperty("/INTERNALSETTINGSFORCALENDAR/SECONDINSTANCE", false);
                }

                ////////////////////////////////////////////////////////////

                if (reqObject.OVERLAPMODE != backUpObject.OVERLAPMODE) { // handling overlap mode
                    //oEvt.getSource().close();
                    if (reqObject.OVERLAPMODE) {
                        underscoreJS.filter(underscoreJS.union(self.data_p, self.data_s), function(f, i, l) {
                            f.EXPANDED = true;
                        })
                        this.ganttChart.segregateElements()
                    } else {
                        underscoreJS.filter(underscoreJS.union(self.data_p, self.data_s), function(f, i, l) {
                            f.EXPANDED = true;
                        })
                        self.noChilds = false;
                        self.hideTree = false;
                        self.noChilds1 = false;
                        self.hideTree1 = false;
                    }
                    if (reqObject.SPLITVIEW != backUpObject.SPLITVIEW) { // handling splitmode
                        if (reqObject.SPLITVIEW) {
                            self.secondInstanceExists = "X";
                            calendarModel.setProperty("/INTERNALSETTINGSFORCALENDAR/SECONDINSTANCE", true);
                        } else {
                            self.secondInstanceExists = "";
                            calendarModel.setProperty("/INTERNALSETTINGSFORCALENDAR/SECONDINSTANCE", false);
                            $('#secondaryChart').remove();
                        }
                        self.renderFirstTime = true;
                        this.ganttChart.getChartPrepare();
                        return false;

                    } else {


                        self.renderFirstTime = true
                        self.getChartPrepare(oControl.start_p, oControl.end_p)
                        return false;
                    }



                }



                ////////////////////////////////////////////////////////////////////////////////
                if (reqObject.SPLITVIEW != backUpObject.SPLITVIEW) { // handling splitmode
                    underscoreJS.filter(underscoreJS.union(self.data_p, self.data_s), function(f, i, l) {
                        f.EXPANDED = true;
                    })
                    if (reqObject.OVERLAPMODE) {
                        this.ganttChart.segregateElements()
                    }

                    if (reqObject.SPLITVIEW) {
                        self.secondInstanceExists = "X";
                        calendarModel.setProperty("/INTERNALSETTINGSFORCALENDAR/SECONDINSTANCE", true);


                    } else {
                        self.secondInstanceExists = "";
                        calendarModel.setProperty("/INTERNALSETTINGSFORCALENDAR/SECONDINSTANCE", false);
                        $('#secondaryChart').remove();

                    }
                    self.renderFirstTime = true;
                    this.ganttChart.getChartPrepare();
                    // oEvt.getSource().close();
                    return false;

                }
                /////////////////////////////////////////////////////////////////////////////////////


                this.ganttChart.onClickOkSettings();
                //oEvt.getSource().close();
            }

        },
        A.prototype.openValidityPopover = function(oEvt, id, obj, chartType) {
            var oController = this;
            var calendarModel = oController.getModel('calendarModel');
            var reqObject = calendarModel.getProperty('/CALENDARSETTINGS');
            // added for fiori issue
            var startD = (new Date(self.tappedObj.START));
            var endD = (new Date(self.tappedObj.END));
            calendarModel.setProperty("/INTERNALSETTINGSFORCALENDAR/VALIDITYPOPUPSTART", ('0' + ((startD.getMonth() + 1))).slice(-2) + '/' + (('0' + startD.getDate()).slice(-2)) + '/' + startD.getFullYear())
            calendarModel.setProperty("/INTERNALSETTINGSFORCALENDAR/VALIDITYPOPUPEND", ('0' + ((endD.getMonth() + 1))).slice(-2) + '/' + (('0' + endD.getDate()).slice(-2)) + '/' + endD.getFullYear())
            oController.validityDialog = new sap.m.Dialog({
                type: sap.m.DialogType.Standard,
                contentWidth: "250px",
                contentHeight: "200px",
                draggable: true,
                resizable: true,
                title: self.tappedObj["DOCID"],
                resizable: true,
                afterClose: function() {
                    oController.validityDialog.destroy();
                },
                content: [new sap.ui.layout.form.SimpleForm({
                    maxContainerCols: 2,
                    editable: true,
                    layout: "ResponsiveGridLayout",
                    labelSpanL: 3,
                    labelSpanM: 5,
                    emptySpanL: 4,
                    emptySpanM: 4,
                    columnsL: 1,
                    columnsM: 1,
                    content: [
                        new sap.m.Label({
                            text: this._oBundle.getText("StartDate")
                        }),
                        new sap.m.DatePicker({
                            valueFormat: "MM/dd/yyyy",
                            displayFormat: 'long',
                            value: '{' + oController.modelName + '>/INTERNALSETTINGSFORCALENDAR/VALIDITYPOPUPSTART}',
                        }),
                        new sap.m.Label({
                            text: this._oBundle.getText("EndDate")
                        }),
                        new sap.m.DatePicker({
                            valueFormat: "MM/dd/yyyy",
                            displayFormat: 'long',
                            value: '{' + oController.modelName + '>/INTERNALSETTINGSFORCALENDAR/VALIDITYPOPUPEND}',

                        })
                    ]
                })],
                buttons: [
                    new sap.m.Button({
                        type: sap.m.ButtonType.Emphasized,
                        text: "Done",
                        press: [
                            oController.onClickChangeValidity, oController
                        ]
                    }),
                    new sap.m.Button({
                        text: "Cancel",
                        press: function(oEvt) {
                            this.oParent.close()
                        }
                    })
                ]
            }).setModel(calendarModel, "calendarModel").addStyleClass('sapUiSizeCompact')

            this.getController().getView().addDependent();
            oController.validityDialog.open()
        },
        A.prototype.onActionPress = function(oEvt) {


            var oControl = this;
            var oItem = oEvt.getParameter("item");
            var key = oItem.getProperty('key');
            var sectionID = oControl.section['SECTN'];
            if (key == 'ADD') {

                var oFunction = underscoreJS.find(oControl.section.FUNC, {
                    "FNCNM": "ADD"
                });
                oControl.getController().processAction(sectionID, oFunction, [{
                    "NAME": "CHARTID",
                    "VALUE": oItem.getParent().data().chartId
                }], {
                    'CHARTID': oItem.getParent().data().chartId
                });

            } else if (key == 'DELE') {
                var deleArr = [];
                var selectedObjs = underscoreJS.filter(underscoreJS.union(self.data_p, self.data_s), {
                    "SELECTED": true
                })
                for (var i = 0; i < selectedObjs.length; i++) {
                    deleArr.push({
                        "DOCNO": selectedObjs[i].DOCID,
                        "ROWID": Number(selectedObjs[i].ROWID),
                        "DATAB": self.convertToInternalFormat((selectedObjs[i].START)),
                        "DATBI": self.convertToInternalFormat((selectedObjs[i].END)),
                        "CHARTID": selectedObjs[i].CHARTID,
                        "UPDKZ": "D"
                    })
                }
                var oFunction = underscoreJS.find(oControl.section.FUNC, {
                    "FNCNM": "DELE"
                });
                oControl.getController().processAction(sectionID, oFunction, deleArr);

                // oControl.getController().processAction.call(oControl.getController(), sectionID, oFunction, deleArr);

            } else if (key == 'COPY') {


                var copyArr = [];
                var oFunction = underscoreJS.find(oControl.section.FUNC, {
                    "FNCNM": "COPY"
                });
                var selectedObjs = underscoreJS.filter(underscoreJS.union(self.data_p, self.data_s), {
                    "SELECTED": true
                })
                if (selectedObjs.length == 1) {
                    copyArr.push({
                        "DOCNO": selectedObjs[0].DOCID,
                        "CHARTID": selectedObjs[0].CHARTID
                    })
                } else {
                    sap.m.MessageToast.show(this._oBundle.getText('Pleaseselectsinglerow'), {
                        width: "19em"
                    });

                }

                oControl.getController().processAction(sectionID, oFunction, copyArr, {
                    'CHARTID': oItem.getParent().data().chartId
                });




            }
        }
    A.prototype.openAdditionalInfo = function(obj, chartType) {
        var oControl = this;

        var oFunction = underscoreJS.find(oControl.section.FUNC, {
            "FNCNM": "DETAILS"
        });
        var sectionID = oControl.section['SECTN'];
        oControl.getController().processAction(sectionID, oFunction, obj, {
            "CHARTID": obj.CHARTID,
            "DOCNO": obj.DOCNO
        });


    }, A.prototype.afterRender = function(oEvt) {

        var oControl = this;

        if (!underscoreJS.isEmpty(oControl.columns_p)) {

            console.log('After Render Method')
            $('#calendarContainer').empty()
            oControl.ganttChart = new ganttChart();
            oControl.ganttChart.chartRender(
                oControl,
                oControl.data_p,
                oControl.columns_p,
                //oControl.quickInfo,
                oControl.events_p,
                oControl.barData_p,
                oControl.CALENDARSETTINGS,
                oControl.INTERNALSETTINGSFORCALENDAR,
                oControl.dateFormat,
                oControl.primaryObjectTitle,
                oControl.document_mode,
                oControl.levels_p,
                oControl.columns_s,
                oControl.data_s,
                oControl.secondaryObjectTitle,
                oControl.barData_s,
                //oControl.requestQuickInfo,
                oControl.levels_s,
                oControl.events_s);


            $("[aria-pressed=false]").click(function() {
                setTimeout(function() {
                    self.appToolbarWidth = $(".appToolbar").width();
                    self.onClickOkSettings();
                })


            })
            setTimeout(function() {
                self.onClickOkSettings();
            })


        }
    }
    A.prototype.onPressSettingsButton = function(oEvt) {
        var oControl = this;
        var sLocale = sap.ui.getCore().getConfiguration()
            .getLanguage();
        if (sLocale.length > 2) {
            sLocale = sLocale.substring(0, 2);
        }

        var calendarModel = oControl.getModel('calendarModel');
        var reqObject = calendarModel.getProperty('/CALENDARSETTINGS');
        var cb1 = new sap.m.CheckBox({
            text: this._oBundle.getText("ShowVerticalLines"),
            selected: '{' + oControl.modelName + '>/CALENDARSETTINGS/DIVIDERLINES}'
        });
        /*if (oControl.dateFormat == "ENGLISH") {
            var ChangedDateFormat = 'long';
        } else {
            var ChangedDateFormat = (self.dateFormat).replace('YYYY', 'yyyy').replace('DD', 'dd')
        }*/
        var cb2 = new sap.m.HBox({
            items: [
                new sap.m.CheckBox({
                    text: this._oBundle.getText("ShowAnchorDate"),
                    selected: '{' + oControl.modelName + '>/INTERNALSETTINGSFORCALENDAR/TIMESLOT}'
                }),
                new sap.m.DatePicker({
                    enabled: '{' + oControl.modelName + '>/INTERNALSETTINGSFORCALENDAR/TIMESLOT}',
                    value: '{' + oControl.modelName + '>/CALENDARSETTINGS/ANCHORDATE}',
                    valueFormat: "yyyy-MM-dd",
                    displayFormat: 'long',
                    dateValue: new Date(),
                    minDate: new Date(self.start_p),
                    maxDate: new Date(self.end_p)
                }).addStyleClass('dateElement')
            ]
        })
        var cb3 = new sap.m.CheckBox({
            text: this._oBundle.getText("Show") + " " + self.primaryObjectTitle.split('(')[0],
            selected: '{' + oControl.modelName + '>/CALENDARSETTINGS/DISPLAY_PRIOBJ}',
            enabled: '{= ${calendarModel>/CALENDARSETTINGS/SPLITVIEW} }'

        });
        var cb4 = new sap.m.CheckBox({
            text: this._oBundle.getText("Show") + " " + self.secondaryObjectTitle.split('(')[0],
            selected: '{calendarModel>/CALENDARSETTINGS/DISPLAY_SECOBJ}',
            enabled: '{= ${calendarModel>/CALENDARSETTINGS/SPLITVIEW} }'
        });




        var rb1 = new sap.m.RadioButton({
            width: '100%',
            selected: '{calendarModel>/CALENDARSETTINGS/SPLITVIEW}',
            text: this._oBundle.getText("ShowinSplitView"),
        })
        var rb2 = new sap.m.RadioButton({
            width: '100%',
            selected: {
                path: oControl.modelName + '>/CALENDARSETTINGS/SPLITVIEW',
                formatter: function(val) {
                    if (!val) {
                        calendarModel.setProperty('/CALENDARSETTINGS/OVERLAPMODE', false)
                        return !val;
                    }
                }
            },
            text: this._oBundle.getText("ShowinLinkedView")
        })

        var cb5 = new sap.m.RadioButtonGroup({
            width: '100%',
            selectedIndex: '{calendarModel>/INTERNALSETTINGSFORCALENDAR/RBINDEX}',
            buttons: [rb1, rb2]
        }).addStyleClass('viewTypeRadioButtonClass')

        var showViewType = new sap.m.HBox({
            items: [

                new sap.m.VBox({
                    items: [new sap.m.Label({
                        text: this._oBundle.getText("ShowViewType")
                    })]
                }),

                new sap.m.VBox({

                    items: [cb5]

                }).addStyleClass('viewTypeVBoxClass')

            ]

        }).addStyleClass('viewTypeClass')

        var cb7 = new sap.m.CheckBox({
            text: this._oBundle.getText("ShowOverlapMode"),
            selected: '{' + oControl.modelName + '>/CALENDARSETTINGS/OVERLAPMODE}',
            enabled: '{= ${calendarModel>/CALENDARSETTINGS/SPLITVIEW} }'
        });

        var layoutTab = new sap.m.VBox({
            items: [

                new sap.ui.layout.form.SimpleForm({
                    maxContainerCols: 2,
                    editable: true,
                    layout: "ResponsiveGridLayout",
                    labelSpanL: 3,
                    labelSpanM: 5,
                    emptySpanL: 4,
                    emptySpanM: 4,
                    columnsL: 1,
                    columnsM: 1,
                    content: [
                        new sap.m.Label({
                            text: self.primaryObjectTitle.split('(')[0] + " " + this._oBundle.getText("Layout"),
                            design: 'Bold',
                            visible: '{' + oControl.modelName + '>/CALENDARSETTINGS/DISPLAY_PRIOBJ' + '}'
                        }),
                        new sap.m.ComboBox({
                            selectedKey: '{calendarModel>/LAYOUTID_P}',
                            visible: '{' + oControl.modelName + '>/CALENDARSETTINGS/DISPLAY_PRIOBJ' + '}'
                        }).bindAggregation('items', 'calendarModel>/LAYOUT', function(id, ctx) {
                            var ctxObj = ctx.getObject();
                            return new sap.ui.core.Item({
                                text: ctxObj.DESCR,
                                key: ctxObj.LYTID
                            })

                        }),

                        new sap.m.Label({
                            text: self.secondaryObjectTitle.split('(')[0] + " " + this._oBundle.getText("Layout"),
                            design: 'Bold',
                            visible: '{' + oControl.modelName + '>/CALENDARSETTINGS/DISPLAY_SECOBJ' + '}'
                        }),
                        new sap.m.ComboBox({
                            selectedKey: '{calendarModel>/LAYOUTID_S}',
                            visible: '{' + oControl.modelName + '>/CALENDARSETTINGS/DISPLAY_SECOBJ' + '}'
                        }).bindAggregation('items', 'calendarModel>/LAYOUT_S', function(id, ctx) {
                            var ctxObj = ctx.getObject();
                            return new sap.ui.core.Item({
                                text: ctxObj.DESCR,
                                key: ctxObj.LYTID
                            })
                        })
                    ]
                })
            ]
        })

        var modebtn = new sap.ui.layout.form.SimpleForm({
            maxContainerCols: 2,
            editable: true,
            width: "75%",
            content: [
                new sap.m.Label({
                    text: this._oBundle.getText('Mode'),
                    design: 'Bold'
                }),
                new sap.m.SegmentedButton({
                    width: '70%',
                    selectedKey: '{' + oControl.modelName + '>/CALENDARSETTINGS/DISPLAY_MODE}',
                    items: [
                        new sap.m.SegmentedButtonItem({
                            text: this._oBundle.getText('Compact'),
                            key: '1'
                        }),
                        new sap.m.SegmentedButtonItem({
                            text: this._oBundle.getText('Auto'),
                            key: '2'
                        }),
                        new sap.m.SegmentedButtonItem({
                            text: this._oBundle.getText('Wide'),
                            key: '3'
                        })
                    ]
                })
            ]
        });
        var settingsPanel = new sap.m.P13nDialog({
            showReset: false,
            contentHeight: '20rem',
            contentWidth: '45rem',

            initialVisiblePanelType: 'custom1',
            title: this._oBundle.getText('Personalize'),
            afterOpen: [oControl.modelBackupFunction, oControl],
            afterClose: function(oEvt) {
                oControl.hbox.rerender()
                oControl.menuButton.oParent.rerender()
            },
            ok: [oControl.onClickOkDialog, oControl],
            buttons: [new sap.m.Button({
                text: 'Cancel',
                press: function() {
                    this.oParent.close();
                }

            })],
            panels: [
                new vistex.ui.widgets.Calendar.customPanel({
                    title: this._oBundle.getText('GeneralSettings'),
                    type: 'custom1',
                    content: [new sap.m.VBox({
                        items: [cb1, cb2, cb7, modebtn]
                    })]
                }), new vistex.ui.widgets.Calendar.customPanel({
                    title: this._oBundle.getText('Layout'),
                    type: 'layout',
                    panel: [new sap.m.Panel({
                        content: [layoutTab]
                    })]
                })
            ]
        }).setModel(calendarModel, "calendarModel").addStyleClass("sapUiSizeCompact");
        settingsPanel.open();
        settingsPanel.getAggregation('buttons')[1].setVisible(false); // to hide cancel button
        if (self.secondInstanceExists == "X" || !reqObject.SPLITVIEW) {
            settingsPanel.getAggregation('panels')[0].getContent().insertItem(cb3, 2);
            settingsPanel.getAggregation('panels')[0].getContent().insertItem(cb4, 3);

            if ((new Date(self.start_p).getTime() == new Date(self.start_s).getTime()) && (new Date(self.end_p).getTime() == new Date(self.end_s).getTime())) {
                settingsPanel.getAggregation('panels')[0].getContent().insertItem(showViewType, 5);
            }
        }
    }
})