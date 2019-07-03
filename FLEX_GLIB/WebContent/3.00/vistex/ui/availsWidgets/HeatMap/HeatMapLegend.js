sap.ui.define([
    "jquery.sap.global",
    "sap/ui/core/Control"
], function (jQuery, oControl) {
    "use strict"

    var HeatMapLegend = oControl.extend(vistexConfig.rootFolder + ".ui.availsWidgets.HeatMap.HeatMapLegend", {

        metadata:{
            properties:{
                data:{type:"object[]", defaultValue:[]}
            }
        },

        renderer: {
            render: function (oRm, oControl) {
                oRm.write("<div");
                oRm.writeControlData(oControl);
                oRm.addClass("vuiHtMpLegend");
                oRm.writeClasses();
                oRm.write(">");

                oRm.write("<div class='vuiHtMpLegendCnt'>");

                var aData = oControl.getData();

                aData.forEach(function (oItem) {

                    oRm.write("<div class='vuiHtMpLegendItem'>");

                        var sColor = oItem.Color;
                        oRm.write("<div class='vuiHtMpLegendItemBox'");
                            oRm.addStyle("background", sColor);
                            oRm.writeStyles();
                        oRm.write("></div>");

                        oRm.write("<div class='vuiHtMpLegendItemDescription'>");
                            oRm.writeEscaped(oItem.Description);
                        oRm.write("</div>");
                    oRm.write("</div>");



                });
                oRm.write("</div>");
                oRm.write("</div>");
            }
        }
    });

    return HeatMapLegend;
});