sap.ui.define(["sap/ui/core/Control",
], function(Control) {
    "use strict";
    var oControl = Control.extend(vistexConfig.rootFolder + ".ui.availsWidgets.HeatMap.HeatMapCell", {
        metadata: {
            properties: {
                color:{"type":"string", defaultValue:"#fff"},
                columnId:{"type": "string", defaultValue:""},
                value:{"type": "int", defaultValue: 0}
            },
            events: {},
            aggregations: {}
        },

        init: function () {}
    });

    return oControl;
});