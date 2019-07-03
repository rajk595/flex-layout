sap.ui.define([ vistexConfig.rootFolder + "/ui/core/global" ], // referenced here to enable the
// Support feature
function(global) {

	sap.ui.getCore().initLibrary({
		name : vistexConfig.rootFolder + ".ui.widgets.Synopsis",
		version : "1.00",
		dependencies : [],
		types : [],
		interfaces : [],
		controls : [vistexConfig.rootFolder + ".ui.widgets.Synopsis.Synopsis" ],
		elements : [],
		noLibraryCSS:true
	});
	global.vui5.ui.controls.Synopsis = eval(vistexConfig.rootFolder + ".ui.widgets.Synopsis.Synopsis");

	return eval(vistexConfig.rootFolder + ".ui.widgets.Synopsis");
});