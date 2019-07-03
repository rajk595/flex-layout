sap.ui.define(["sap/ui/core/Control",
], function(Control) {
    "use strict";
    var oControl = Control.extend(vistexConfig.rootFolder + ".ui.availsWidgets.HeatMap.HeatMapColumn", {
        metadata: {
            properties: {
                columnid:{type:"string", defaultValue:""},
                text:{type:"string", defaultValue:""}
            },
            events: {},
            aggregations: {
                columns:{"type":vistexConfig.rootFolder + ".ui.availsWidgets.HeatMap.HeatMapColumn", "multiple":true, defaultValue:[]}
            }
        },

        init: function () {}
    });

    return oControl;
});