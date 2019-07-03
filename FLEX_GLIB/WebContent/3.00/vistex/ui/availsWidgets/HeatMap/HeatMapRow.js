sap.ui.define(["sap/ui/core/Control",
], function(Control) {
    "use strict";
    var oControl = Control.extend(vistexConfig.rootFolder + ".ui.availsWidgets.HeatMap.HeatMapRow", {
        metadata: {
            properties: {
                rowid:{type:"string", defaultValue:""},
                text:{type:"string", defaultValue:""},
                expanded:{type:"boolean", defaultValue:false}
            },
            events: {},
            aggregations: {
                rows:{"type":vistexConfig.rootFolder + ".ui.availsWidgets.HeatMap.HeatMapRow", "multiple":true, defaultValue:[]},
                cells:{"type":vistexConfig.rootFolder + ".ui.availsWidgets.HeatMap.HeatMapCell", "multiple":true, defaultValue:[]}
            }
        },

        init: function () {}
    });

    return oControl;
});