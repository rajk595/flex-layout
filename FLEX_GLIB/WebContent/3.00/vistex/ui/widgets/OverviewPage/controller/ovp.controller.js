sap.ui.define([
    vistexConfig.rootFolder + "/ui/core/BaseController",
    vistexConfig.rootFolder + "/ui/core/global"
], function (BaseController, global) {
    "use strict";

    return BaseController.extend(vistexConfig.rootFolder + ".ui.widgets.OverviewPage.controller.ovp", {
    	currentRoute : 'overviewPage',
		modelName : 'overviewPageModel',
		sectionRef : {},
		sectionConfig : {},
		functionRef : [],
		
        

    });
});