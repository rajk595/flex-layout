sap.ui.define([vistexConfig.rootFolder + "/ui/core/global"], // referenced here to enable the Support feature
function(global) {

	sap.ui.getCore().initLibrary({
		name : vistexConfig.rootFolder + ".ui.widgets.Designer",
		version : "2.00",
		dependencies : [],
		types : [],
		interfaces : [],
		controls : [vistexConfig.rootFolder + ".ui.widgets.Designer.Designer"],
		elements : [],
		noLibraryCSS:true
	});
	global.vui5.ui.controls.Designer = eval(vistexConfig.rootFolder + ".ui.widgets.Designer.Designer");
	
	return eval(vistexConfig.rootFolder + ".ui.widgets.Designer");
});