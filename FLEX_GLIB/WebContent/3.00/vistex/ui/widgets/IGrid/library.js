sap.ui.define([vistexConfig.rootFolder + "/ui/core/global"], // referenced here to enable the Support feature
	function(global) {

		sap.ui.getCore().initLibrary({
			name : vistexConfig.rootFolder + ".ui.widgets.IGrid",
			version : "1.00",
			dependencies : [],
			types : [],
			interfaces : [],
			controls : [ vistexConfig.rootFolder + ".ui.widgets.IGrid.IGrid",
				vistexConfig.rootFolder + ".ui.widgets.IGrid.PlanningGrid",
				vistexConfig.rootFolder + ".ui.widgets.IGrid.PricingGrid" ],
			elements : [],
			noLibraryCSS:true
		});
		
		global.vui5.ui.controls.PlanningGrid = eval(vistexConfig.rootFolder + ".ui.widgets.IGrid.PlanningGrid");
		global.vui5.ui.controls.PricingGrid = eval(vistexConfig.rootFolder + ".ui.widgets.IGrid.PricingGrid");
		global.vui5.ui.controls.IGrid = eval(vistexConfig.rootFolder + ".ui.widgets.IGrid.IGrid");
		
/**ESP6 Task# 31147 - Grid Integration**/	
		//jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath(vistexConfig.rootFolder + ".ui.widgets.IGrid") + "/Content/css/bootstrap.custom.css");
		//jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath(vistexConfig.rootFolder + ".ui.widgets.IGrid") + "/Content/css/grid-wrapper.css");
		jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath(vistexConfig.rootFolder + ".ui.widgets.IGrid") + "/Content/css/inGrid.css");
		/**ESP6 Task#43143 Integrating grid version 31.0.2.**/
		//jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath(vistexConfig.rootFolder + ".ui.widgets.IGrid") + "/Content/css/gfonts.css");
		/****/
/****/
		
		jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath(vistexConfig.rootFolder + ".ui.widgets.IGrid") + "/Content/css/styles.css");

		return eval(vistexConfig.rootFolder + ".ui.widgets.IGrid");
	});