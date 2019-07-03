sap.ui.define([
    "sap/ui/core/Control"
], function (Control) {
    "use strict";
    var oControl = Control.extend(vistexConfig.rootFolder + ".ui.availsWidgets.AvailsHeader.Availability", {
        metadata: {
            properties: {
                availability: {type: "int", defaultValue: 0},
                color:{type: "string", defaultValue: "#FFF"},
                availabilityText:{type: "string", defaultValue: ""},
                displayMode: {type: "string", defaultValue: ""}
            },
            aggregations: {

            },
            associations: {

            },
            events: {}
        },


        renderer: {
            render: function (oRm, oControl) {
                oRm.write("<div");
                oRm.writeControlData(oControl);
                oRm.write(">");
                oRm.write("<div class='vuiAvaCntRowCell vuiAvaCntRowCellPadding'>");
                var iAvailiabitity = oControl.getAvailability();

                var sStatusText = oControl.getAvailabilityText();

                var sDisplayMode = oControl.getDisplayMode();

                if (sDisplayMode === "Ball") {
                    oRm.write("<span");
                    oRm.addClass("vuiAvaCntRowBall");
                    if (iAvailiabitity == 0) oRm.addClass("vuiAvaCntRowBallZero");
                    if (iAvailiabitity == 100) oRm.addClass("vuiAvaCntRowBall100");
                    if (iAvailiabitity > 0 && iAvailiabitity < 33.333) oRm.addClass("vuiAvaCntRowBall25");
                    if (iAvailiabitity >= 33.333 && iAvailiabitity < 66.666) oRm.addClass("vuiAvaCntRowBall50");
                    if (iAvailiabitity >= 66.666 && iAvailiabitity < 100) oRm.addClass("vuiAvaCntRowBall75");
                    oRm.writeClasses();
                    oRm.write(">");
                    if ((iAvailiabitity > 0 && iAvailiabitity < 33.333) || (iAvailiabitity >= 66.666 && iAvailiabitity < 100)) {
                        oRm.write("<span class='vuiAvaCntRowPie'/>");
                    }
                    oRm.write("</span>");
                }

                else if(sDisplayMode === "Label") {
                    oRm.write("<span");
                    oRm.addClass("vuiAvaCntRowStatusLabel");
                    /* if (sStatus == "available") {
                         oRm.addClass("vuiTrTbCntRowStatusAvailable");
                     } else {
                         oRm.addClass("vuiTrTbCntRowStatusNotAvailable");
                     }*/
                    oRm.writeClasses();
                    oRm.addStyle("background",  oControl.getColor());
                    oRm.writeStyles();
                    oRm.write(">");

                    oRm.write("<span>");
                    oRm.writeEscaped(oControl.getAvailabilityText());
                    oRm.write("</span>");
                    oRm.write("</span>");
                }
                oRm.write("</div>");
                oRm.write("</div>");
            }
        }
    });

    return oControl;
});