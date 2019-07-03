sap.ui.define([ vistexConfig.rootFolder + "/ui/core/global" ], // referenced here to enable the
// Support feature
function(global) {

	sap.ui.getCore().initLibrary({
		name : vistexConfig.rootFolder + ".ui.widgets.Dashboard",
		version : "1.00",
		dependencies : [],
		types : [],
		interfaces : [],
		controls : [vistexConfig.rootFolder + ".ui.widgets.Dashboard.Dashboard",
			        vistexConfig.rootFolder + ".ui.widgets.Dashboard.DashboardV2"],
		elements : [],
		noLibraryCSS:true
	});
	global.vui5.ui.controls.Dashboard = eval(vistexConfig.rootFolder + ".ui.widgets.Dashboard.Dashboard");
	global.vui5.ui.controls.DashboardV2 = eval(vistexConfig.rootFolder + ".ui.widgets.Dashboard.DashboardV2");

	return eval(vistexConfig.rootFolder + ".ui.widgets.Dashboard");
});