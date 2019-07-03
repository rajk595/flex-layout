sap.ui.define([
    "sap/ui/core/Control",
], function(Control) {
    "use strict";
    var oControl = Control.extend(vistexConfig.rootFolder + ".ui.availsWidgets.HierarchyTree.TreeTableRow", {
        metadata: {
            properties: {
            	rowId:{type:"string", defaultValue:""},
                availibility: {type: "int", defaultValue: 0},
                color:{type: "string", defaultValue: "#FFF"},
                availibilityText:{type: "string", defaultValue: ""}
            },
            aggregations: {
                cells:{type:vistexConfig.rootFolder + ".ui.availsWidgets.HierarchyTree.TreeTableCell", multiple:true},
                rows:{type:vistexConfig.rootFolder + ".ui.availsWidgets.HierarchyTree.TreeTableRow", multiple:true}
            },
            events: {}
        },

        init: function () {
        },

        onBeforeRendering: function () {}
    });

    return oControl;
});