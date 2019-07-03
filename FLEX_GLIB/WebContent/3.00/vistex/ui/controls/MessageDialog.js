sap.ui.define([
    "sap/ui/core/Control",
    "sap/m/Dialog",
    "sap/m/Text",
    "sap/m/ObjectStatus",
    "sap/m/MessageView",
    "sap/m/MessageItem"
], function (Control, Dialog, Text, ObjectStatus, MessageView, MessageItem) {
    "use strict";
    var oControl = Control.extend(vistexConfig.rootFolder + ".ui.controls.MessageDialog", {
        metadata: {
            properties: {
                dialogTitle: {type: "string", defaultValue: ""},
                dialogState: {type: "sap.ui.core.ValueState", defaultValue: ""},
                dialogIcon: {type: "sap.ui.core.URI"},
                messages:{type:"object[]", defaultValue:[]},

            },
            aggregations: {
                _dialog: {type: "sap.m.Dialog", multiple: false, visibility: "hidden"},
            },
            associations: {
                _messageView: {type: "sap.m.MessageView", multiple: false, visibility: "hidden"},
                _messageText: {type: "sap.m.Text", multiple: false, visibility: "hidden"},

                _messageTitle: {type: "sap.m.ObjectStatus", multiple: false, visibility: "hidden"},
            },
            events: {
                dialogOpen: {},
                dialogSubmit: {}
            }
        },

        init: function () {
            this._initMessageTitle();
            this._initDescriptionText();
            this._initMessageView();
            this._initDialog();
        },

        open: function(){
            var oDialog = this._getDialog();
            this.fireDialogOpen();
            oDialog.open();
        },

        setProperty: function (sPropertyName, vValue, bSuppressInvalidate) {
            switch (sPropertyName) {
                case "dialogTitle":
                    this._getDialog().setTitle(vValue);
                    break;
                case "dialogState":
                    this._getDialog().setState(vValue);
                    this._getDialog().setIcon("sap-icon://none");

                    this._getMessageTitle().setState(vValue);
                    break;
                case "dialogIcon":
                    this._getDialog().setIcon(vValue);

                    this._getMessageTitle().setIcon(vValue);
                    break;
                case "messages":
                    if (Array.isArray(vValue) && vValue.length > 1){
                        var that = this;
                        var oBackButton = new sap.m.Button({
                            icon: sap.ui.core.IconPool.getIconURI("nav-back"),
                            visible: false,
                            press: function () {
                                that._getMessageView().navigateBack();
                                this.setVisible(false);
                            }
                        });
                        for (var idx = 0; idx < vValue.length; idx++) {
                            var oMessageTemplate = new MessageItem({
                                type: vValue[idx].type,
                                title: vValue[idx].title,
                                description: vValue[idx].description,
                                subtitle: vValue[idx].subtitle
                            });
                            this._getMessageView().addItem(oMessageTemplate);
                        }
                        this._getMessageView().attachItemSelect(function () {
                            oBackButton.setVisible(true);
                        });
                        var oCustomHeader = new sap.m.Bar({
                                contentMiddle: [
                                    new sap.m.Text({ text: this._getDialog().getTitle()})
                                ],
                                contentLeft: [oBackButton]
                            });
                        this._getDialog().setState("None");
                        this._getDialog().setContentHeight("400px");
                        this._getDialog().setCustomHeader(oCustomHeader);
                        this._getDialog().addContent(this._getMessageView());
                    } else if (Array.isArray(vValue) && vValue.length === 1) {
                        this._getMessageTitle().setText(vValue[0].title);
                        this._getDscriptionText().setText(vValue[0].description);
                        this._getDialog().addContent(this._getMessageTitle());
                        this._getDialog().addContent(this._getDscriptionText());
                    }
                    break;
            }

            return Control.prototype.setProperty.apply(this, arguments);
        },

        _initMessageView: function(){
            var oMessageView = this._createMessageView();
            this.setAssociation("_messageView", oMessageView);
        },

        _getMessageView: function () {
            return sap.ui.getCore().byId(this.getAssociation("_messageView"));
        },

        _createMessageView: function(){
            return new MessageView({showDetailsPageHeader: false});
        },

        _initDialog: function () {
            var oDialog = this._createDialog();

            oDialog.setBeginButton(new sap.m.Button({
                press: function () {
                    this.getParent().close();
                },
                text: "Close"
            }));

            this.setAggregation("_dialog", oDialog);
        },

        _createDialog: function () {
            return new Dialog({type: "Message", contentWidth: "370px", verticalScrolling: false}).addStyleClass("sapUiContentPadding sapUiSizeCompact");
        },

        _initDialogSubmitBtn: function () {
            var oBtn = this._createButton();
            oBtn.setText("Close");
            oBtn.attachEvent("press", this._onClosePress.bind(this));
            this.setAssociation("_dialogCloseBtn", oBtn);
        },

        _initDescriptionText: function () {
            var oText = this._createDescriptonText();
            this.setAssociation("_messageText", oText);
        },

        _createMessageTitle: function(){
            return new ObjectStatus().addStyleClass("dialogButtonMessageTitle");
        },

        _initMessageTitle: function(){
            var oMessageTitle = this._createMessageTitle();
            this.setAssociation("_messageTitle", oMessageTitle);
        },

        _getMessageTitle: function () {
            return sap.ui.getCore().byId(this.getAssociation("_messageTitle"));
        },

        _createDescriptonText: function () {
            return new Text().addStyleClass("sapUiSmallMarginTop sapUiMediumMarginBegin");
        },

        _getDscriptionText: function () {
            return sap.ui.getCore().byId(this.getAssociation("_messageText"));
        },

        _getDialog: function () {
            return this.getAggregation("_dialog");
        },

        renderer: {
            render: function (oRm, oControl) {
                oRm.write("<div");
                oRm.writeControlData(oControl);
                oRm.write(">");
                var oBtn = oControl.getAggregation("_dialog");
                oRm.renderControl(oBtn);
                oRm.write("</div>");
            }
        }
    });

    return oControl;
});