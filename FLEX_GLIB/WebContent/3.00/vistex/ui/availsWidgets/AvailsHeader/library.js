sap.ui.define([ vistexConfig.rootFolder + "/ui/core/global" ], // referenced here to enable the
// Support feature
function(global) {

	sap.ui.getCore().initLibrary({
		name : vistexConfig.rootFolder + ".ui.availsWidgets.AvailsHeader",
		version : "3.00",
		dependencies : ["sap.tnt"],
		types : [],
		interfaces : [],
		controls : [vistexConfig.rootFolder + ".ui.availsWidgets.AvailsHeader.AvailsHeaderControl",			
			        vistexConfig.rootFolder + ".ui.availsWidgets.AvailsHeader.DialogHeader",
			        vistexConfig.rootFolder + ".ui.availsWidgets.AvailsHeader.Availability",
		],
		elements : [],
		noLibraryCSS:true
	});
	
	global.vui5.ui.controls.AvailsHeaderControl = eval(vistexConfig.rootFolder + ".ui.availsWidgets.AvailsHeader.AvailsHeaderControl");
	global.vui5.ui.controls.DialogHeader = eval(vistexConfig.rootFolder + ".ui.availsWidgets.AvailsHeader.DialogHeader");
	global.vui5.ui.controls.Availability = eval(vistexConfig.rootFolder + ".ui.availsWidgets.AvailsHeader.Availability");	

	jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath(vistexConfig.rootFolder + ".ui.availsWidgets.AvailsHeader") + "/styles.css");
	return eval(vistexConfig.rootFolder + ".ui.availsWidgets.AvailsHeader");
});