sap.ui.define([
    "sap/ui/core/Control",
], function(Control) {
    "use strict";
    var oControl = Control.extend(vistexConfig.rootFolder + ".ui.availsWidgets.HierarchyTree.TreeTableColumn", {
        metadata: {
            properties: {
                "text":{type:"string", defaultValue:""}
            },
            aggregations: {},
            events: {}
        },

        init: function () {},

        onBeforeRendering: function () {}
    })

    return oControl;
});