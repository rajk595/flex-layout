sap.ui.define([ vistexConfig.rootFolder + "/ui/core/global" ], // referenced here to enable the
// Support feature
function(global) {

	sap.ui.getCore().initLibrary({
		name : vistexConfig.rootFolder + ".ui.widgets.VuiGrid",
		version : "2.00",
		dependencies : [],
		types : [],
		interfaces : [],
		controls : [vistexConfig.rootFolder + ".ui.widgets.VuiGrid.VuiGrid" ],
		elements : [],
		noLibraryCSS:true
	});
	global.vui5.ui.controls.VuiGrid = eval(vistexConfig.rootFolder + ".ui.widgets.VuiGrid.VuiGrid");
	
	return eval(vistexConfig.rootFolder + ".ui.widgets.VuiGrid");
});