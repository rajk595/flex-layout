sap.ui.define([
    "sap/ui/core/Control",
    vistexConfig.rootFolder + "/ui/core/global",
    vistexConfig.rootFolder + "/ui/core/underscore-min",
    vistexConfig.rootFolder + "/ui/core/Formatter",
    vistexConfig.rootFolder + "/ui/core/commonUtils"
], function (control, global, underscoreJs, Formatter, commonUtils) {
    var A = control.extend(vistexConfig.rootFolder + ".ui.controls.Status", {
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
                stblk: {
                    type: "string",
                    defaultValue: null
                },
                sfcat: {
                    type: "string",
                    defaultValue: null
                },
                triggerText: {
                    type: "string",
                    defaultValue: null
                },
                enableTriggerUndo: {
                    type: "string",
                    defaultValue: null
                },
                flowText: {
                    type: "string",
                    defaultValue: null
                },
                enableStepUndo: {
                    type: "string",
                    defaultValue: null
                },
                selectedFlow: {
                    type: "string",
                    defaultValue: null
                },
                editable: {
                    type: "boolean",
                    defaultValue: false
                },
                //*****Rel 60E_SP6
                enableActivityNav: {
                    type: "boolean",
                    defaultValue: false
                },
                //*****
                fullScreen: {
                    type: "boolean",
                    defaultValue: false
                }
            },
            events: {
                onUpdate: {
                    parameters: {
                        selectionSet: {
                            type: "sap.ui.core.Control[]"
                        }
                    }
                },
                triggerSelect: {},
                flowSelect: {},
                triggerUndo: {},
                stepUndo: {},
                outcomeSelect: {},
                statusSet: {},
                inactiveSet: {},
                //*****Rel 60E_SP6
                activityNavigate: {},
                //*****
                onFullScreen: {}
            },
            aggregations: {
                _getProcessFlow: {
                    type: "sap.suite.ui.commons.ProcessFlow",
                    multiple: false,
                    visibility: "hidden"
                },
                _getProcessFlowBar: {
                    type: "sap.ui.core.Control",
                    multiple: false,
                    visibility: "hidden"
                }
            }
        },
        init: function () {
            //this.onStatusFlow();
            this._oBundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls");
        },

        onStatusFlow: function () {
            var oControl = this;
            var oController = this.getProperty("controller");
            var modelName = this.getModelName();
            var model = oController.getModel(modelName);
            var editable = this.getProperty("editable");
            var dataPath = this.getDataPath();
            var triggerText = this.getTriggerText();
            var triggerUndo = this.getEnableTriggerUndo();
            var flowText = this.getFlowText();
            var stepUndo = this.getEnableStepUndo();
            oControl.sectionData = oController.sectionData;

            oControl._oProcessFlow = new sap.suite.ui.commons.ProcessFlow({
                foldedCorners: true
            });

            oControl._oProcessFlow.setModel(model, modelName);
            oControl._oProcessFlow.bindAggregation("lanes", modelName + ">" + dataPath + "LEVELS", function (sId, oContext) {
                var nodePath = modelName + ">" + dataPath + "STEPS";
                var datapath = modelName + ">" + oContext.sPath + "/ID";
                return new sap.suite.ui.commons.ProcessFlowLaneHeader({
                    laneId: oContext.getObject("ID"),
                    text: oContext.getObject("DESCR"),
                    position: parseInt(oContext.getObject("POS"))
                }).bindProperty("iconSrc", {
                    parts: [{ path: datapath },
                            { path: nodePath }
                    ],
                    formatter: statusFormatter._getIcon,
                    mode: sap.ui.model.BindingMode.OneWay
                });
            });

            oControl._oProcessFlow.bindAggregation("nodes", modelName + ">" + dataPath + "STEPS", function (sId, oContext) {
                var texts;
                var dataPath = modelName + ">" + oContext.sPath + "/STPST";
                var tablePath = global.vui5.modelName + ">/DROPDOWNS/" + oControl.sectionData['DARID'] + "/STPST/";
                var oNode = new sap.suite.ui.commons.ProcessFlowNode({
                    title: oContext.getObject("FLSTP_D"),
                    laneId: oContext.getObject("LANEID"),
                    nodeId: oContext.getObject("NODEID")
                }).bindProperty("stateText", {
                    parts: [{ path: dataPath },
                            { path: tablePath }
                    ],
                    formatter: statusFormatter.stepStatus,
                    mode: sap.ui.model.BindingMode.OneWay
                }).bindProperty("state", dataPath, statusFormatter.stepState, sap.ui.model.BindingMode.OneWay);
                if (oContext.getObject("CHILD") != "") {
                    var children = [];
                    children = oContext.getObject("CHILD").split("_");
                    oNode.setChildren(children);
                }
                if (oContext.getObject("STPST") != 'A') {
                    texts = [oControl._oBundle.getText("ReviewOn") + "\n" + oContext.getObject("REVDATE"), oControl._oBundle.getText("ReviewBy") + "\n" + oContext.getObject("REFRNAM")];
                } else {
                    texts = [oControl._oBundle.getText("SetOn") + "\n" + oContext.getObject("SETDATE"), oControl._oBundle.getText("SetBy") + "\n" + oContext.getObject("SEFRNAM")];
                }
                oNode.setTexts(texts);
                oNode.attachBrowserEvent("click touchstart", function () {
                    oControl._onClick(this);
                });
                return oNode;
            });

            oControl._fullScreenButton = new sap.m.OverflowToolbarButton({
                type: sap.m.ButtonType.Transparent,
                icon: {
                    path: vui5.modelName + ">" + "/FULLSCREEN",
                    formatter: function (fullScreen) {
                        return fullScreen === true ? 'sap-icon://exit-full-screen' : 'sap-icon://full-screen';
                    },
                    mode: sap.ui.model.BindingMode.TwoWay
                },
                press: oControl.fullScreenDialog.bind(oControl)
            });

            var oBar = new sap.m.Toolbar({
                design: sap.m.ToolbarDesign.Solid,
                content: [
                  new sap.m.Text({}).bindText(modelName + ">" + triggerText, statusFormatter.trigrText, sap.ui.model.BindingMode.OneWay),
                  new sap.m.Button({
                      icon: "sap-icon://arrow-down",
                      type: sap.m.ButtonType.Transparent,
                      tooltip: oControl._oBundle.getText("Triggers"),
                      enabled: editable,
                      press: [oControl._onTriggerDrdn, oControl]
                  }).bindProperty("visible", modelName + ">" + dataPath + "TRIGGERS", statusFormatter.trigrDrdn, sap.ui.model.BindingMode.OneWay),
                  new sap.m.Button({
                      icon: "sap-icon://undo",
                      type: sap.m.ButtonType.Transparent,
                      press: [oControl._onFlowUndo, oControl]
                  }).bindProperty("visible", modelName + ">" + triggerUndo, statusFormatter.returnBoolean, sap.ui.model.BindingMode.OneWay),
                  new sap.m.ToolbarSeparator({}),
                  new sap.m.Text({}).bindText(modelName + ">" + flowText, statusFormatter.flowText, sap.ui.model.BindingMode.OneWay),
                  new sap.m.Button({
                      icon: "sap-icon://arrow-down",
                      type: sap.m.ButtonType.Transparent,
                      tooltip: oControl._oBundle.getText("Flows"),
                      //enabled: editable,
                      press: [oControl._onFlowDrdn, oControl]
                  }).bindProperty("visible", modelName + ">" + dataPath + "FLOWS", statusFormatter.flowDrdn, sap.ui.model.BindingMode.OneWay),
                  new sap.m.Button({
                      icon: "sap-icon://undo",
                      type: sap.m.ButtonType.Transparent,
                      press: [oControl._onStepUndo, oControl]
                  }).bindProperty("visible", modelName + ">" + stepUndo, statusFormatter.returnBoolean, sap.ui.model.BindingMode.OneWay),
                  new sap.m.ToolbarSpacer({}),
                  oControl._fullScreenButton
                ]
            });

            oControl.setAggregation("_getProcessFlowBar", oBar);
            oControl.setAggregation("_getProcessFlow", oControl._oProcessFlow);
        },
        renderer: function (oRM, oControl) {
            oRM.write("<style>");
            oRM.write(".outcomesList, .reviewList{padding: 0px !important;}");
            oRM.write(".reviewCell{padding-top: 10px !important;}");
            oRM.write(".reviewLabel{font-size: small !important; padding-right: 5px !important; color: gray !important;}");
            //*****Rel 60E_SP6
            oRM.write(".activitiesLabel{font-size: small !important; padding-right: 5px !important;}");
            //*****
            oRM.write(".reviewValue{font-size: small; !important");
            oRM.write("</style>");
            oRM.write("<div");
            oRM.writeControlData(oControl);
            oRM.write(">");
            oRM.renderControl(oControl.getAggregation("_getProcessFlowBar"));
            oRM.renderControl(oControl.getAggregation("_getProcessFlow"));
            oRM.write("</div>");
        }
    });

    A.prototype.setModelName = function (value) {
        this.setProperty("modelName", value, true);
    };

    A.prototype.setDataPath = function (value) {
        this.setProperty("dataPath", value, true);
    };

    A.prototype.setStblk = function (value) {
        this.setProperty("stblk", value, true);
    };

    A.prototype.setTriggerText = function (value) {
        this.setProperty("triggerText", value, true);
    };

    A.prototype.setEnableTriggerUndo = function (value) {
        this.setProperty("enableTriggerUndo", value, true);
    };

    A.prototype.setEnableStepUndo = function (value) {
        this.setProperty("enableStepUndo", value, true);
    };

    A.prototype.setFlowText = function (value) {
        this.setProperty("flowText", value, true);
    };

    A.prototype.setSelectedFlow = function (value) {
        this.setProperty("selectedFlow", value, true);
    };

    A.prototype.setSfcat = function (value) {
        this.setProperty("sfcat", value, true);
    };

    A.prototype.setEditable = function (value) {
        this.setProperty("editable", value, true);
    };

    A.prototype.setFullScreen = function (value) {
        this.setProperty("fullScreen", value, true);
    };

    A.prototype.statusInfocusSet = function () {
        var oControl = this;
        var oController = this.getProperty("controller");
        var modelName = this.getProperty("modelName");
        var model = oController.getModel(modelName);
        var stblkPath = this.getProperty("stblk");
        var stblk = model.getProperty(stblkPath);
        if (stblk == "" || stblk == undefined) {
            var oMessagePage = new sap.m.MessagePage({
                text: oControl._oBundle.getText("NoStatus"),
                description: "",
                showHeader: false
            });
            var statusFrag = new sap.m.Panel({
                width: "100%",
                height: "300px",
                content: [oMessagePage]
            });
            oControl.setAggregation("_getProcessFlowBar", statusFrag);
            oControl.setAggregation("_getProcessFlow", "");
            return;
        }
        else if (stblk == "2") {
            if (oControl._oProcessFlow) {
                var id = oControl._oProcessFlow.sId;
                sap.ui.getCore().byId(id).updateModel();
            }
            oControl.onStatusFlow();
        }
        else {
            oControl._onOldStatus();
        }
    };

    A.prototype._onClick = function (oEvt) {
        var oControl = this;
        var oController = this.getProperty("controller");
        var modelName = this.getProperty("modelName");
        var model = oController.getModel(modelName);
        var dataPath = this.getProperty("dataPath");
        var editable = this.getProperty("editable");
        var scontr = oEvt.getProperty("nodeId");
        var bindingContext = underscoreJS.findWhere(model.getProperty(dataPath + "STEPS"), { SCONTR: scontr });
        //*****Rel 60E_SP6
        var activitiesContent = [];
        var activities = bindingContext['ACTIVITIES'] || [];
        var activitiesLength = activities.length;
        var enableActivityNav = this.getProperty("enableActivityNav");
        //*****
        if (bindingContext['STPST'] == "A") {
            //*****Rel 60E_SP6
            if (!editable) {
                var title = oControl._oBundle.getText("Activities");
            }
            else {
                var title = oControl._oBundle.getText("SetOutcome");
                //*****
                var oFlstp = bindingContext['FLSTP'];
                var outcomes = underscoreJS.where(model.getProperty(dataPath + "OUTCOMES"), { FLSTP: oFlstp });
                var list = new sap.m.List({}).addStyleClass("outcomesList").addStyleClass("sapUiSizeCompact");
                for (var i = 0; i < outcomes.length; i++) {
                    var id = outcomes[i]['ROWID'];
                    var oItem = new sap.m.ActionListItem({
                        text: outcomes[i]['DESCR'],
                        type: sap.m.ListType.Active,
                        press: [oControl._onOutcome, oControl]
                    }).data({
                        "ID": id,
                        //*****Rel 60E_SP6 - Negotiation Step Changes
                        "NGSTP": bindingContext['NGSTP']
                    }
        //*****
                    );
                    list.addItem(oItem);
                }
                //*****Rel 60E_SP6
            }
            if (editable) {
                activitiesContent.push(new sap.m.Text({
                    text: oControl._oBundle.getText("Activities") + ":"
                }).addStyleClass("activitiesLabel"));
            }
            underscoreJS.each(activities, function (obj, i) {
                if (enableActivityNav) {
                    activitiesContent.push(new sap.m.Link({
                        text: obj['ACNUM'].replace(/^0+/, ''),
                        press: [oControl.onActivityNavigate, oControl]
                    }).data({ "ACNUM": obj['ACNUM'] }));
                }
                else {
                    activitiesContent.push(new sap.m.Text({ text: obj['ACNUM'].replace(/^0+/, '') }));
                }
            });
            var activityFooter = new sap.m.OverflowToolbar({ content: activitiesContent });

            //var oPopover = new sap.m.ResponsivePopover({
            var oPopover = new sap.m.Popover({
                //*****
                title: title,
                contentWidth: "200px",
                customHeader: [
                  new sap.m.Bar({
                      contentMiddle: [
                        new sap.m.Text({
                            text: title
                        })
                      ],
                      contentRight: [
                        new sap.m.Button({
                            icon: "sap-icon://decline",
                            tooltip: oControl._oBundle.getText("Close"),
                            press: function (oEvt) {
                                oEvt.getSource().getParent().getParent().close();
                            }
                        })
                      ]
                  })
                ],
                content: [list]
            });
            //*****Rel 60E_SP6
            if (activitiesLength) {
                oPopover.setFooter(activityFooter);
            }
            //*****
            oPopover.openBy(oEvt);
        } else {
            var reviewData = bindingContext;
            var oTable = new sap.m.Table({
                width: "100%",
                inset: true,
                fixedLayout: false,
                columns: [
                  new sap.m.Column({
                      hAlign: "Left",
                      demandPopin: true,
                      popinDisplay: "Block",
                      minScreenWidth: sap.m.ScreenSize.Small
                  })
                ]
            }).addStyleClass("reviewList");
            var oTemplate = new sap.m.ColumnListItem({
                type: sap.m.ListType.Active
            });
            var oLayout = new sap.ui.commons.layout.MatrixLayout({
                layoutFixed: true,
                columns: 1,
                width: "100%"
            });
            var oRow4 = new sap.ui.commons.layout.MatrixLayoutRow({
                cells: [
                  new sap.ui.commons.layout.MatrixLayoutCell({
                      padding: sap.ui.commons.layout.Padding.None,
                      content: [
                        new sap.m.Text({
                            text: oControl._oBundle.getText("Outcome")
                        }).addStyleClass("reviewLabel"),
                        new sap.m.Text({
                            text: reviewData['SOUTC_D']
                        }).addStyleClass("reviewValue")
                      ]
                  }).addStyleClass("reviewCell")
                ]
            });
            var oRow2 = new sap.ui.commons.layout.MatrixLayoutRow({
                cells: [
                  new sap.ui.commons.layout.MatrixLayoutCell({
                      padding: sap.ui.commons.layout.Padding.None,
                      content: [
                        new sap.m.Text({
                            text: oControl._oBundle.getText("SetOn")
                        }).addStyleClass("reviewLabel"),
                        new sap.m.Text({
                            text: reviewData['SETDATE']
                        }).addStyleClass("reviewValue")
                      ]
                  }).addStyleClass("reviewCell")
                ]
            });
            //*****Rel 60E_SP6
            var oRow22 = new sap.ui.commons.layout.MatrixLayoutRow({
                cells: [
                  new sap.ui.commons.layout.MatrixLayoutCell({
                      padding: sap.ui.commons.layout.Padding.None,
                      content: [
                        new sap.m.Text({
                            text: oControl._oBundle.getText("at")
                        }).addStyleClass("reviewLabel"),
                        new sap.m.Text({
                            text: reviewData['SEZET']
                        }).addStyleClass("reviewValue")
                      ]
                  })
                ]
            });
            //*****
            var oRow21 = new sap.ui.commons.layout.MatrixLayoutRow({
                cells: [
                  new sap.ui.commons.layout.MatrixLayoutCell({
                      padding: sap.ui.commons.layout.Padding.None,
                      content: [
                        new sap.m.Text({
                            text: oControl._oBundle.getText("by")
                        }).addStyleClass("reviewLabel"),
                        new sap.m.Text({
                            text: reviewData['SEFNAM']
                        }).addStyleClass("reviewValue")
                      ]
                  })
                ]
            });
            var oRow3 = new sap.ui.commons.layout.MatrixLayoutRow({
                cells: [
                  new sap.ui.commons.layout.MatrixLayoutCell({
                      padding: sap.ui.commons.layout.Padding.None,
                      content: [
                        new sap.m.Text({
                            text: oControl._oBundle.getText("ReviewOn")
                        }).addStyleClass("reviewLabel"),
                        new sap.m.Text({
                            text: reviewData['REVDATE']
                        }).addStyleClass("reviewValue")
                      ]
                  }).addStyleClass("reviewCell")
                ]
            });
            //*****Rel 60E_SP6
            var oRow32 = new sap.ui.commons.layout.MatrixLayoutRow({
                cells: [
                  new sap.ui.commons.layout.MatrixLayoutCell({
                      padding: sap.ui.commons.layout.Padding.None,
                      content: [
                        new sap.m.Text({
                            text: oControl._oBundle.getText("at")
                        }).addStyleClass("reviewLabel"),
                        new sap.m.Text({
                            text: reviewData['REZET']
                        }).addStyleClass("reviewValue")
                      ]
                  })
                ]
            });
            //*****
            var oRow31 = new sap.ui.commons.layout.MatrixLayoutRow({
                cells: [
                  new sap.ui.commons.layout.MatrixLayoutCell({
                      padding: sap.ui.commons.layout.Padding.None,
                      content: [
                        new sap.m.Text({
                            text: oControl._oBundle.getText("by")
                        }).addStyleClass("reviewLabel"),
                        new sap.m.Text({
                            text: reviewData['REFNAM']
                        }).addStyleClass("reviewValue")
                      ]
                  })
                ]
            });
            //*****Rel 60E_SP6
            activitiesContent.push(new sap.m.Label({
                text: oControl._oBundle.getText("Activities")
            }).addStyleClass("reviewLabel"));
            underscoreJS.each(activities, function (obj, i) {
                if (i == activitiesLength - 1) {
                    if (enableActivityNav) {
                        activitiesContent.push(new sap.m.Link({
                            text: obj['ACNUM'].replace(/^0+/, ''),
                            press: [oControl.onActivityNavigate, oControl]
                        }).data({ "ACNUM": obj['ACNUM'] }));
                    }
                    else {
                        activitiesContent.push(new sap.m.Text({ text: obj['ACNUM'].replace(/^0+/, '') }));
                    }
                }
                else {
                    if (enableActivityNav) {
                        activitiesContent.push(new sap.m.Link({
                            text: obj['ACNUM'].replace(/^0+/, '') + ",",
                            press: [oControl.onActivityNavigate, oControl]
                        }).data({ "ACNUM": obj['ACNUM'] }));
                    }
                    else {
                        activitiesContent.push(new sap.m.Text({ text: obj['ACNUM'].replace(/^0+/, '') + "," }));
                    }
                }
            });
            var activitiesRow = new sap.ui.commons.layout.MatrixLayoutRow({
                cells: [
                  new sap.ui.commons.layout.MatrixLayoutCell({
                      padding: sap.ui.commons.layout.Padding.None,
                      content: activitiesContent
                  }).addStyleClass("reviewCell")
                ]
            });
            //*****
            oLayout.addRow(oRow2);
            //*****Rel 60E_SP6
            oLayout.addRow(oRow22);
            //*****
            oLayout.addRow(oRow21);
            oLayout.addRow(oRow3);
            //*****Rel 60E_SP6
            oLayout.addRow(oRow32);
            //*****
            oLayout.addRow(oRow31);
            oLayout.addRow(oRow4);
            //*****Rel 60E_SP6
            if (activitiesLength) {
                oLayout.addRow(activitiesRow);
            }
            //*****
            oTemplate.addCell(oLayout);
            oTable.addItem(oTemplate);
            var oCommentPopover = new sap.m.ResponsivePopover({                
                contentWidth: "250px",
                content: [oTable],
                customHeader: [
                  new sap.m.Bar({
                      contentMiddle: [
                        new sap.m.Text({
                            text: oControl._oBundle.getText("Review")
                        })
                      ],
                      contentRight: [
                        new sap.m.Button({
                            icon: "sap-icon://decline",
                            tooltip: oControl._oBundle.getText("Close"),
                            press: function (oEvt) {
                                oEvt.getSource().getParent().getParent().close();
                            }
                        })
                      ]
                  })
                ]
            });
            oCommentPopover.openBy(oEvt);
        }
    };

    //*****Rel 60E_SP6
    A.prototype.onActivityNavigate = function (oEvent) {
        var oControl = this;
        var acnum = oEvent.getSource().data("ACNUM");
        var params = {};
        params[global.vui5.cons.params.acnum] = acnum;
        var promise = oControl.fireActivityNavigate({ acnum: params });
    };
    //*****

    A.prototype._onOutcome = function (oEvent) {
        var oControl = this;
        var oController = this.getProperty("controller");
        var modelName = oControl.getModelName();
        var dataPath = oControl.getDataPath();
        var model = oController.getModel(modelName);
        oEvent.getSource().getParent().getParent().close();
        var rowId = oEvent.getSource().data("ID");
        var outcomes = model.getProperty(dataPath + "OUTCOMES");
        var selRecord = underscoreJS.findWhere(outcomes, { "ROWID": rowId });

        //*****Rel 60E_SP6 - Negotiation Step Changes
        var ngstp = oEvent.getSource().data("NGSTP");
        if (ngstp && ngstp == "N") {
            sap.m.MessageBox.show(oControl._oBundle.getText("NegotiationInProcess"), {
                icon: sap.m.MessageBox.Icon.INFORMATION,
                title: oControl._oBundle.getText("ConfirmAction"),
                actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction == sap.m.MessageBox.Action.YES) {
                        var promise = oControl.fireOutcomeSelect([{ callBack: function (resp) { } },
                                         { record: selRecord }]);
                    }
                }
            });

        }
        else {
            //*****
            var promise = oControl.fireOutcomeSelect([{ callBack: function (resp) { } },
                                                    { record: selRecord }]);
            //*****Rel 60E_SP6 - Negotiation Step Changes
        }
        //*****
    };

    A.prototype._onTriggerClick = function (oEvt) {
        var oControl = this;
        var oController = this.getProperty("controller");
        var modelName = oControl.getModelName();
        var dataPath = oControl.getDataPath();
        var model = oController.getModel(modelName);
        var triggers = model.getProperty(dataPath + "TRIGGERS");
        var oTrigrId = oEvt.getSource().getProperty("selectedKey");
        var selRecord = underscoreJS.findWhere(triggers, { "TRIGR": oTrigrId });

        var promise = oControl.fireTriggerSelect([{ callBack: function (resp) { } },
                                                  { record: selRecord }]);
    };

    A.prototype._onFlowChange = function (oEvt) {
        var oControl = this;
        var oController = this.getProperty("controller");
        var modelName = this.getProperty("modelName");
        var model = oController.getModel(modelName);
        var dataPath = this.getProperty("dataPath");
        var flows = model.getProperty(dataPath + "FLOWS");

        var fcontr = oEvt.getSource().getProperty("selectedKey");
        var selRecord = underscoreJS.findWhere(flows, { "FCONTR": fcontr });

        var promise = oControl.fireFlowSelect([{ callBack: function (resp) { } },
                                               { record: selRecord }]);
    };

    A.prototype._onFlowUndo = function () {
        var oControl = this;
        var promise = oControl.fireTriggerUndo({ callBack: function (resp) { } });
    };

    A.prototype._onStepUndo = function () {
        var oControl = this;
        var promise = oControl.fireStepUndo({ callBack: function (resp) { } });
    };

    A.prototype._onTriggerDrdn = function (oEvt) {
        var oControl = this;
        var oController = this.getProperty("controller");
        var modelName = this.getProperty("modelName");
        var model = oController.getModel(modelName);
        var dataPath = this.getProperty("dataPath");
        var triggerList = new sap.m.SelectList({
            selectionChange: [oControl._onTriggerClick, oControl]
        }).setModel(model, modelName);

        triggerList.bindAggregation("items", modelName + ">" + dataPath + "TRIGGERS", function (sId, oContext) {
            return new sap.ui.core.Item({
                key: oContext.getObject("TRIGR"),
                text: oContext.getObject("DESCR")
            });
        });

        var triggerPopover = new sap.m.ResponsivePopover({
            placement: sap.m.PlacementType.Bottom,
            title: oControl._oBundle.getText("Trigger"),
            content: triggerList
        });
        triggerPopover.openBy(oEvt.getSource());
    };

    A.prototype._onFlowDrdn = function (oEvt) {
        var oControl = this;
        var oController = this.getProperty("controller");
        var modelName = this.getProperty("modelName");
        var model = oController.getModel(modelName);
        var mainModel = oController.getModel(global.vui5.modelName);
        var dataPath = this.getProperty("dataPath");
        var selectedFlow = this.getSelectedFlow();
        var flowList = new sap.m.SelectList({
            selectionChange: [oControl._onFlowChange, oControl]
        }).bindProperty("selectedKey", modelName + ">" + selectedFlow, null, sap.ui.model.BindingMode.OneWay)
          .setModel(model, modelName)
          .setModel(mainModel, global.vui5.modelName);

        flowList.bindAggregation("items", modelName + ">" + dataPath + "FLOWS", function (sId, oContext) {
            var dataPath = modelName + ">" + oContext.sPath;
            var tablePath = global.vui5.modelName + ">/DROPDOWNS/" + oControl.sectionData['DARID'] + "/FSTAT";
            return new sap.ui.core.Item({
                key: oContext.getObject("FCONTR")
            }).bindProperty("text", {
                parts: [{ path: dataPath },
                        { path: tablePath }
                ],
                formatter: statusFormatter.flowStatus,
                mode: sap.ui.model.BindingMode.OneWay
            });
        });

        var flowPopover = new sap.m.ResponsivePopover({
            placement: sap.m.PlacementType.Bottom,
            title: oControl._oBundle.getText("Flows"),
            content: flowList
        });
        flowPopover.openBy(oEvt.getSource());
    };

    A.prototype._onOldStatus = function () {
        var oControl = this;
        var oController = this.getProperty("controller");
        var modelName = this.getProperty("modelName");
        var stfct = this.getProperty("sfcat");
        var dataPath = this.getProperty("dataPath");
        var editable = this.getProperty("editable");

        var oStatus = new sap.m.Table({
            growing: false,
            visibleRowCount: 5,
            inset: false,
            showUnread: true,
            width: "100%",
            mode: "None"
        });

        oControl.columns = [];
        oStatus.bindAggregation("columns", modelName + ">" + stfct, function (sId, oContext) {
            var columnName = oContext.getObject('FLDNAME');
            oControl.columns.push(columnName);
            var label = oContext.getObject('LABEL');
            var width = "50px";
            var oLabel = new sap.m.Label({
                text: label
            });
            var oTemplate = new sap.m.Text({}).bindProperty("text", columnName);
            return new sap.m.Column({
                visible: true,
                header: oLabel,
                demandPopin: true,
                template: oTemplate,
                width: width
            });
        });

        oStatus.bindItems(modelName + ">" + dataPath + "USER_STATUS", function (sId, oContext) {
            var contextObject = oContext.getObject();
            var name = oContext.getPath().substr(oContext.getPath().lastIndexOf("/") + 1);
            var cells = [];
            underscoreJS.each(oControl.columns, function (obj) {
                if (obj == "AEDAT") {
                    if (contextObject[obj] != "0000-00-00") {
                        var selection = new sap.m.DatePicker({
                            //displayFormat: "MMM d, y",
                            //*****Rel 60E_SP6
                            //valueFormat: "yyyy-mm-dd",
                            valueFormat: vui5.cons.date_format,
                            //*****
                            editable: false,
                            value: contextObject[obj]
                        });
                        selection.bindProperty("displayFormat", global.vui5.modelName + ">" + global.vui5.cons.modelPath.sessionInfo + "/DATFM", Formatter.displayFormat, sap.ui.model.Binding.OneWay);
                        cells.push(selection);
                    } else {
                        cells.push(new sap.m.Text({}));
                    }
                } else if (obj == "AEZET") {
                    if (contextObject[obj] == "00:00:00") {
                        cells.push(new sap.m.Text({}));
                    } else {
                        cells.push(new sap.m.Text({
                            text: contextObject[obj]
                        }));
                    }
                } else if (obj == "TXT30") {
                    cells.push(new sap.m.Text({
                        text: contextObject[obj]
                    }));
                } else if (obj == "INACT") {
                    var selected = false;
                    if (contextObject[obj] == "X") {
                        selected = true;
                    }
                    cells.push(new sap.m.CheckBox({
                        selected: selected,
                        name: name,
                        enabled: editable,
                        select: [oControl._onInactSet, oControl]
                    }));
                }
            });
            return new sap.m.ColumnListItem({
                type: sap.m.ListType.Inactive,
                vAlign: "Middle",
                cells: cells
            });
        });

        var oBar = new sap.m.Bar({
            contentLeft: [
              new sap.m.Button({
                  icon: "sap-icon://action",
                  enabled: editable,
                  press: [oControl._onOutcomeDrdn, oControl]
              })
            ]
        });

        var oFlexBox = new sap.m.FlexBox({
            direction: sap.m.FlexDirection.Column,
            items: [oBar, oStatus]
        });
        oControl.setAggregation("_getProcessFlowBar", oFlexBox);
        oControl.setAggregation("_getProcessFlow", "");
    };

    A.prototype._onOutcomeDrdn = function (oEvt) {
        var oControl = this;
        var oController = this.getProperty("controller");
        var modelName = this.getProperty("modelName");
        var model = oController.getModel(modelName);
        var dataPath = this.getProperty("dataPath");

        var oList = new sap.m.SelectList({
            selectionChange: [oControl._onStatSet, oControl]
        }).setModel(model, modelName);

        oList.bindAggregation("items", modelName + ">" + dataPath + "STATUS", function (sId, oContext) {
            return new sap.ui.core.Item({
                key: oContext.getObject("NAME"),
                text: oContext.getObject("VALUE")
            });
        });

        var oPopover = new sap.m.ResponsivePopover({
            placement: sap.m.PlacementType.Bottom,
            title: oControl._oBundle.getText("SetStatus"),
            content: oList
        });
        oPopover.openBy(oEvt.getSource());
    };

    A.prototype._onStatSet = function (oEvt) {
        var oControl = this;
        var oController = this.getProperty("controller");
        var modelName = oControl.getModelName();
        var dataPath = oControl.getDataPath();
        var model = oController.getModel(modelName);
        var statuses = model.getProperty(dataPath + "STATUS");
        var Id = oEvt.getSource().getProperty("selectedKey");
        var selRecord = underscoreJS.findWhere(statuses, { NAME: Id });

        var promise = oControl.fireStatusSet({ record: selRecord });
    };

    A.prototype._onInactSet = function (oEvt) {
        var oControl = this;
        var oController = this.getProperty("controller");
        var modelName = this.getModelName();
        var model = oController.getModel(modelName);
        var path = oEvt.getSource().getBindingContext(modelName).getPath();
        var selRecord = model.getProperty(path);

        var promise = oControl.fireInactiveSet({ record: selRecord });
    };

    A.prototype.fullScreenDialog = function (oEvent) {
        var source = oEvent.getSource();
        this.fireOnFullScreen({
            "fullScreen": oEvent.getSource().getIcon() === 'sap-icon://full-screen'
        });
    };

    //*****Rel 60E_SP6
    A.prototype.updateModel = function (oEvt) {
        var oControl = this;
        if (oControl._oProcessFlow) {
            var id = oControl._oProcessFlow.sId;
            sap.ui.getCore().byId(id).updateModel();
        }
    };
    
    A.prototype.setStatusZoomLevel = function (oEvt) {
    	var oControl = this;
    	if (oControl._oProcessFlow) {
    		oControl._oProcessFlow.setZoomLevel(sap.suite.ui.commons.ProcessFlowZoomLevel.Two);
    	}
    };
    //*****

    statusFormatter = {
        stepStatus: function (value, table) {
            if (value != undefined && table != undefined) {
                var status = underscoreJS.findWhere(table, { NAME: value });
                return status['VALUE'];
            }
        },
        stepState: function (value) {
            var oState;
            if (value != undefined) {
                if (value == "A") {
                    oState = sap.suite.ui.commons.ProcessFlowNodeState.Neutral;
                } else if (value == "B") {
                    oState = sap.suite.ui.commons.ProcessFlowNodeState.Positive;
                } else if (value == "C") {
                    oState = sap.suite.ui.commons.ProcessFlowNodeState.Negative;
                } else {
                    oState = sap.suite.ui.commons.ProcessFlowNodeState.PlannedNegative;
                }
                return oState;
            }
        },
        flowStatus: function (value, table) {
            if (value != undefined && table != undefined) {
                var status = underscoreJS.findWhere(table, { NAME: value.FSTAT });
                var oDescr = value['DESCR'] + " (" + status['VALUE'] + ")";
                return oDescr;
            }
        },
        returnBoolean: function (value) {
            if (value != undefined) {
                if (value == "" || value == "A") {
                    return false;
                }
                else {
                    return true;
                }
            }
        },
        trigrText: function (value) {
            if (value != undefined && value != "") {
                return sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls").getText("Trigger") + ": " + value;
            }
        },
        flowText: function (value) {
            if (value != undefined && value != "") {
                return sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls").getText("Flow") + ": " + value;
            }
        },
        _getIcon: function (id, nodes) {
            var node = underscoreJS.find(nodes, { LANEID: id });
            if (node != undefined) {

                var name = node.SEFNAM;
                var icon = commonUtils.getAvatarURI(name);
                return icon;
            }
            else {

                return "sap-icon://person-placeholder";
            }

        },
        trigrDrdn: function (table) {
            if (table != undefined) {
                if (table.length != 0) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        flowDrdn: function (table) {
            if (table != undefined) {
                if (table.length <= 1) {
                    return false;
                } else {
                    return true;
                }
            }
        }
    };
});