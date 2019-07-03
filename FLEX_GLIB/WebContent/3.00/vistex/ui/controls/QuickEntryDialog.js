sap.ui.define(["sap/m/Dialog",
    vistexConfig.rootFolder + "/ui/core/global",
    vistexConfig.rootFolder + "/ui/core/underscore-min",
    "sap/ui/model/json/JSONModel",
    vistexConfig.rootFolder + "/ui/core/Formatter",
    "sap/m/MessageBox"],
    function (control, global, underscoreJS, JSONModel, Formatter, MessageBox) {

        var Q = control.extend(vistexConfig.rootFolder + ".ui.controls.QuickEntryDialog", {
            metadata: {
                library: vistexConfig.rootFolder + ".ui",
                properties: {
                    controller: {
                        type: "object",
                        defaultValue: null
                    },
                    dataAreaID: {
                        type: "string"
                    },
                    dataAreaPath: {
                        type: "string"
                    },
                    modelName: {
                        type: "string",
                        defaultValue: null
                    },
                    formFieldsPath: {
                        type: "string"
                    },
                    lineEntryFieldsPath: {
                        type: "string"
                    },
                    dataPath: {
                        type: "string"
                    }
                },
                events: {
                    onValueHelpRequest: {},
                    onContinue: {},
                    onCancel: {},
                    onCheck: {},
                    onFieldEvent: {}
                }
            },

            init: function () {
                control.prototype.init.apply(this);
                var sLocale = sap.ui.getCore().getConfiguration().getLanguage();
                if (sLocale.length > 2) {
                    sLocale = sLocale.substring(0, 2);
                }
                this._oBundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls");
            },

            renderer: function (oRM, oControl) {
                jQuery.sap.require("sap.m.DialogRenderer");
                sap.m.DialogRenderer.render(oRM, oControl);
            }

        });

        Q.prototype.setModelName = function (value) {
            this.setProperty("modelName", value, true);
        };

        Q.prototype.setDataAreaID = function (value) {
            this.setProperty("dataAreaID", value, true);
        };

        Q.prototype.setDataAreaPath = function (value) {
            this.setProperty("dataAreaPath", value, true);
        };

        Q.prototype.setFormFieldsPath = function (value) {
            this.setProperty("formFieldsPath", value, true);
        };

        Q.prototype.setLineEntryFieldsPath = function (value) {
            this.setProperty("lineEntryFieldsPath", value, true);
        };

        Q.prototype.setDataPath = function (value) {
            this.setProperty("dataPath", value, true);
        };


        Q.prototype.prepareQuickEntry = function () {
            var oControl = this, fields;
            oControl.removeAllContent();

            var continueBtn = new sap.m.Button({
                text: oControl._oBundle.getText("Continue"),
                press: function () {
                    oControl.fireOnContinue();
                }
            });


            var checkBtn = new sap.m.Button({
                text: oControl._oBundle.getText("Check"),
                type: sap.m.ButtonType.Emphasized,
                press: function () {
                    oControl.fireOnCheck();
                }
            });


            var cancelBtn = new sap.m.Button({
                text: oControl._oBundle.getText("Cancel"),
                press: function () {
                    oControl.fireOnCancel();
                }
            });

            var oMessageBtn = new sap.m.Button({
                icon: "sap-icon://message-popup",
                type: "Emphasized",
                press: function (oEvent) {
                    oControl.showMessages(oEvent);
                }
            }).bindProperty("visible", "mainModel>/POPUP_MESSAGES",
                            Formatter.showPopupMessages, sap.ui.model.BindingMode.OneWay)
               .bindProperty("text", "mainModel>/POPUP_MESSAGES",
                            Formatter.popupMessagesText, sap.ui.model.BindingMode.OneWay);;

            var page = new sap.m.Page({
                showHeader: false,
                showSubHeader: false,
                footer: [new sap.m.Bar({
                    contentLeft: [oMessageBtn],
                    contentRight: [checkBtn, continueBtn, cancelBtn]
                })]
            });

            page.setModel(oControl.getModel(global.vui5.modelName), global.vui5.modelName);

            if (oControl.getModel(oControl.getModelName()).getProperty(oControl.getFormFieldsPath()).length > 0) {


                var quickEntryFormControl = new global.vui5.ui.controls.QuickEntryForm({
                    modelName: oControl.getModelName(),
                    fieldPath: oControl.getFormFieldsPath(),
                    dataPath: oControl.getDataPath(),
                    dataAreaID: oControl.getDataAreaID(),
                    onValueHelpRequest: function (oEvent) {
                        oControl.fireOnValueHelpRequest({
                            oEvent: oEvent.getParameter("oEvent"),
                            fieldInfo: oEvent.getParameter("fieldInfo")
                        });
                        // oControl.fireOnValueHelpRequest(oEvent);
                    }
                });

                quickEntryFormControl.processOnInputChange = function (oEvent) {
                    return oControl.processOnInputChange(oEvent);
                };

                quickEntryFormControl.preProcessFieldEvent = function (oEvent) {
                    return oControl.preProcessFieldEvent(oEvent);
                }

                quickEntryFormControl.handleCheckFieldsMessages = function (text, type, target) {
                    return oControl.handleCheckFieldsMessages(text, type, target);
                };

                quickEntryFormControl.setModel(oControl.getModel(oControl.getModelName()), oControl.getModelName());
                quickEntryFormControl.setModel(oControl.getModel(global.vui5.modelName), global.vui5.modelName);
                page.addContent(quickEntryFormControl.prepareFields());
            }
            fields = oControl.getModel(oControl.getModelName()).getProperty(oControl.getLineEntryFieldsPath());

            if (fields.length !== 0) {
                var oTable = new global.vui5.ui.controls.ResponsiveTable({
                    controller: oControl.getController(),
                    modelName: oControl.getModelName(),
                    dataAreaPath: oControl.getDataAreaPath(),
                    fieldPath: oControl.getLineEntryFieldsPath(),
                    dataPath: oControl.getDataPath() + "__MLE__DATA/",
                    showTitle: false,
                    listItemType: sap.m.ListType.Active,
                    enableSearchAndReplace: false,
                    editable: true,
                    enablePersonalization: false,
                    disableExcelExport: true,
                    onValueHelpRequest: function (oEvent) {
                        oControl.fireOnValueHelpRequest({
                            oEvent: oEvent.getParameter("oEvent"),
                            fieldInfo: oEvent.getParameter("fieldInfo")
                        });
                    },
                    mode: sap.m.ListMode.Delete,
                    delete: function (oEvent) {
                        var listItem = oEvent.getParameter("listItem");
                        MessageBox.confirm(oControl._oBundle.getText('DeleteEntry'), {
                            title: oControl._oBundle.getText('ConfirmAction'),
                            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                            onClose: function (oAction) {
                                if (oAction === MessageBox.Action.YES) {
                                    var emptyLine = oControl.getModel(oControl.getModelName()).getProperty(oControl.getDataPath() + "EMPTY_MLE_DATA");
                                    var path = listItem.getBindingContext("infocusModel").getPath();
                                    var multiLineData = $.extend(true, [], oControl.getModel(oControl.getModelName()).getProperty(oControl.getDataPath() + "__MLE__DATA/"));
                                    multiLineData.splice(path.split("/")[4], 1);
                                    multiLineData.push($.extend(true, {}, emptyLine));
                                    oControl.getModel(oControl.getModelName()).setProperty(oControl.getDataPath() + "__MLE__DATA/", multiLineData);
                                }
                            }
                        });

                    }
                });

                oTable.processOnInputChange = function (oEvent) {
                    return oControl.processOnInputChange.apply(this, arguments);
                };

                oTable.preProcessFieldEvent = function (oEvent) {
                    return oControl.preProcessFieldEvent.apply(this, arguments);
                };

                oTable.addStyleClass("vuiTableBottomPadding");

                oTable.setModel(oControl.getModel(oControl.getModelName()), oControl.getModelName());
                oTable.prepareTable();
                oTable.getHeaderToolbar().setVisible(false);

                //oTable.addToolBarButton(clearBtn);
                page.addContent(oTable);
            }


            oControl.addContent(page);

        };

        return Q;
    });
