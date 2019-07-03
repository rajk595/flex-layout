sap.ui.define([ vistexConfig.rootFolder + "/ui/core/global" ], // referenced here to enable the
// Support feature
function(global) {

	sap.ui.getCore().initLibrary({
		name : vistexConfig.rootFolder + ".ui.widgets.OverviewPage",
		version : "1.00",
		dependencies : ["sap.ovp"],
		types : [],
		interfaces : [],
		controls : [vistexConfig.rootFolder + ".ui.widgets.OverviewPage.OverviewPage" ],
		elements : [],
		noLibraryCSS:true
	});
	
	global.vui5.ui.controls.OverviewPage = eval(vistexConfig.rootFolder + ".ui.widgets.OverviewPage.OverviewPage");
	

	jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath(vistexConfig.rootFolder + ".ui.widgets.OverviewPage") + "/css/styles.css");
	
	return eval(vistexConfig.rootFolder + ".ui.widgets.OverviewPage");
});