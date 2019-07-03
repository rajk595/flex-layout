sap.ui.define([
    "sap/ui/core/Control",
    "sap/m/HBox",
    "sap/m/VBox",
    "sap/m/Image",
    "sap/m/Label",
    "sap/m/ObjectStatus",
    vistexConfig.rootFolder + "/ui/availsWidgets/AvailsHeader/Availability"
], function (Control, HBox, VBox, Image, Label, ObjectStatus, Availability) {
    "use strict";
    var oControl = Control.extend(vistexConfig.rootFolder + ".ui.availsWidgets.AvailsHeader.DialogHeader", {
        metadata: {
            properties: {
                imageSrc: {type: "sap.ui.core.URI"},
                header: {type: "string", defaultValue: ""},
                subHeader: {type: "string", defaultValue: ""},
                type: {type: "string", defaultValue: ""},
                typeState: {type: "string", defaultValue: ""},
                availability: {type: "int", defaultValue: 0},
                color:{type: "string", defaultValue: "#FFF"},
                availabilityText:{type: "string", defaultValue: ""},
                displayMode: {type: "string", defaultValue: ""},
                availabilityDate: {type: "string", defaultValue: ""}
            },
            aggregations: {
                _headerContainer: {type: "sap.m.HBox", multiple: false}
            },
            associations: {
                _leftHbox: {type: "sap.m.HBox", multiple: false, visibility: "hidden"},
                _image: {type: "sap.m.Image", multiple: false, visibility: "hidden"},
                _header: {type: "sap.m.Label", multiple: false, visibility: "hidden"},
                _subHeader: {type: "sap.m.Label", multiple: false, visibility: "hidden"},
                _vbox: {type: "sap.m.VBox", multiple: false, visibility: "hidden"},
                _typeLabel: {type: "sap.m.ObjectStatus", multiple: false, visibility: "hidden"},
                _availability: {type: vistexConfig.rootFolder + ".ui.availsWidgets.AvailsHeader.Availability", multiple: false},
                _rightVbox: {type: "sap.m.VBox", multiple: false, visibility: "hidden"},
                _availabilityDate: {type: "sap.m.Label", multiple: false, visibility: "hidden"}
            },
            events: {}
        },

        init: function () {
            this._initImage();
            this._initHeader();
            this._initSubHeader();
            this._initLeftHbox();
            this._initVbox();
            this._initStatusLabel();
            this._initAvailabilityControl();
            this._initAvailabilityDate();
            this._initRightVbox();
            this._initHeaderContainer();
        },

        setProperty: function (sPropertyName, vValue, bSuppressInvalidate) {
            switch (sPropertyName) {
                case "imageSrc":
                    this._getImageControl().setSrc(vValue);
                    break;
                case "header":
                    this._getHeaderControl().setText(vValue);
                    break;
                case "subHeader":
                    this._getSubHeaderControl().setText(vValue);
                    break;
                case "type":
                    this._getStatusLabelControl().setText(vValue);
                    break;
                case "typeState":
                    this._getStatusLabelControl().setState(vValue);
                    break;
                case "availability":
                    this._getAvailabilityControl().setAvailability(vValue);
                    break;
                case "availabilityText":
                    this._getAvailabilityControl().setAvailabilityText(vValue);
                    break;
                case "color":
                    this._getAvailabilityControl().setColor(vValue);
                    break;
                case "displayMode":
                    this._getAvailabilityControl().setDisplayMode(vValue);
                    break;
                case "availabilityDate":
                    this._getAvailabilityDateControl().setText(vValue);
                    break;
            }

            return Control.prototype.setProperty.apply(this, arguments);
        },

        _initImage: function () {
            var oImg = this._createImage();
            this.setAssociation("_image", oImg);
        },

        _createImage: function () {
            return new Image({width: "68px", height: "96px"});
        },

        _getImageControl: function(){
            return sap.ui.getCore().byId(this.getAssociation("_image"));
        },

        _initHeader: function () {
            var oLabel = this._createLabel();
            oLabel.addStyleClass("dialogHeader");
            this.setAssociation("_header", oLabel);
        },

        _createLabel: function () {
            return new Label();
        },

        _getHeaderControl: function(){
            return sap.ui.getCore().byId(this.getAssociation("_header"));
        },

        _initSubHeader: function () {
            var oLabel = this._createLabel();
            oLabel.addStyleClass("dialogSubHeader");
            this.setAssociation("_subHeader", oLabel);
        },

        _getSubHeaderControl: function(){
            return sap.ui.getCore().byId(this.getAssociation("_subHeader"));
        },

        _initLeftHbox: function(){
            var oLeftHbox = this._createHeaderContainer();
            this.setAssociation("_leftHbox", oLeftHbox);
        },

        _getLeftHbox: function(){
            return sap.ui.getCore().byId(this.getAssociation("_leftHbox"));
        },

        _initVbox: function () {
            var oVbox = this._createVbox();
            oVbox.addStyleClass("sapUiSmallMarginBegin");
            this.setAssociation("_vbox", oVbox);
        },

        _createVbox: function () {
            return new VBox();
        },

        _getVboxControl: function(){
            return sap.ui.getCore().byId(this.getAssociation("_vbox"));
        },

        _initStatusLabel: function () {
            var oStatusLabel = this._createStatusLabel();
            this.setAssociation("_typeLabel", oStatusLabel);
        },

        _initRightVbox: function(){
            var oRightVbox = this._createVbox();
            this.setAssociation("_rightVbox", oRightVbox);
        },

        _getRightVboxControl: function(){
            return sap.ui.getCore().byId(this.getAssociation("_rightVbox"));
        },

        _initAvailabilityDate: function(){
            var oAvailabilityDate = this._createLabel();
            oAvailabilityDate.addStyleClass("sapUiTinyMarginTop");
            this.setAssociation("_availabilityDate", oAvailabilityDate);
        },

        _getAvailabilityDateControl: function(){
            return sap.ui.getCore().byId(this.getAssociation("_availabilityDate"));
        },

        _createStatusLabel: function () {
            return new ObjectStatus().addStyleClass("sapUiTinyMarginTop");
        },

        _getStatusLabelControl: function(){
            return sap.ui.getCore().byId(this.getAssociation("_typeLabel"));
        },

        _initAvailabilityControl: function () {
            var oAvailability = this._createAvailabilityControl();
            this.setAssociation("_availability", oAvailability);
        },

        _createAvailabilityControl: function () {
            return new Availability();
        },

        _getAvailabilityControl: function(){
            return sap.ui.getCore().byId(this.getAssociation("_availability"));
        },

        _initHeaderContainer: function () {
            var oHeaderContainer = this._createHeaderContainer(),
                oLeftHbox = this._getLeftHbox(),
                oImage = this._getImageControl(),
                oHeader = this._getHeaderControl(),
                oVbox = this._getVboxControl(),
                oSubHeader = this._getSubHeaderControl(),
                oStatusLabel = this._getStatusLabelControl(),
                oRightVbox = this._getRightVboxControl(),
                oAvailability = this._getAvailabilityControl(),
                oAvailabilityDate = this._getAvailabilityDateControl();

            var oHeaderBox = new HBox();
            // oHeaderBox.setJustifyContent("SpaceBetween");
            oRightVbox.setAlignItems("Center");

            oHeaderContainer.addStyleClass("sapUiSmallMargin");
            oStatusLabel.addStyleClass("sapUiLargeMarginBegin");
            oVbox.addStyleClass("sapUiMediumMarginEnd");
            oHeaderContainer.setJustifyContent("SpaceBetween");
            oLeftHbox.addItem(oImage);
            oLeftHbox.addItem(oVbox);
            oHeaderBox.addItem(oHeader);
            oHeaderBox.addItem(oStatusLabel);
            oVbox.addItem(oHeaderBox);
            // oVbox.addItem(oHeader);
            oVbox.addItem(oSubHeader);
            // oLeftHbox.addItem(oStatusLabel);
            oHeaderContainer.addItem(oLeftHbox);
            oRightVbox.addItem(oAvailability);
            oRightVbox.addItem(oAvailabilityDate);
            oHeaderContainer.addItem(oRightVbox);

            this.setAggregation("_headerContainer", oHeaderContainer);
        },

        _createHeaderContainer: function () {
            return new HBox();
        },

        _getHeaderContainer: function(){
            return this.getAggregation("_headerContainer");
        },

        renderer: {
            render: function (oRm, oControl) {
                oRm.write("<div");
                oRm.writeControlData(oControl);
                oRm.write(">");
                var oHdr = oControl.getAggregation("_headerContainer");
                oRm.renderControl(oHdr);
                oRm.write("</div>");
                oRm.write("<div class='dialogHeaderBorder'/>");
            }
        }
    });

    return oControl;
});