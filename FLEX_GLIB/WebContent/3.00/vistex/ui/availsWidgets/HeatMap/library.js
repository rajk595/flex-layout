sap.ui.define([ vistexConfig.rootFolder + "/ui/core/global" ], // referenced here to enable the
// Support feature
function(global) {

	sap.ui.getCore().initLibrary({
		name : vistexConfig.rootFolder + ".ui.availsWidgets.HeatMap",
		version : "2.00",
		dependencies : [],
		types : [],
		interfaces : [],
		controls : [vistexConfig.rootFolder + ".ui.availsWidgets.HeatMap.HeatMapControl",			
			        vistexConfig.rootFolder + ".ui.availsWidgets.HeatMap.HeatMap",
			        vistexConfig.rootFolder + ".ui.availsWidgets.HeatMap.HeatMapCell",
			        vistexConfig.rootFolder + ".ui.availsWidgets.HeatMap.HeatMapColumn",
			        vistexConfig.rootFolder + ".ui.availsWidgets.HeatMap.HeatMapRow",	
			        vistexConfig.rootFolder + ".ui.availsWidgets.HeatMap.HeatMapLegend",	
		],
		elements : [],
		noLibraryCSS:true
	});
	
	global.vui5.ui.controls.HeatMapControl = eval(vistexConfig.rootFolder + ".ui.availsWidgets.HeatMap.HeatMapControl");
	global.vui5.ui.controls.HeatMap = eval(vistexConfig.rootFolder + ".ui.availsWidgets.HeatMap.HeatMap");
	global.vui5.ui.controls.HeatMapCell = eval(vistexConfig.rootFolder + ".ui.availsWidgets.HeatMap.HeatMapCell");
	global.vui5.ui.controls.HeatMapColumn = eval(vistexConfig.rootFolder + ".ui.availsWidgets.HeatMap.HeatMapColumn");
	global.vui5.ui.controls.HeatMapRow = eval(vistexConfig.rootFolder + ".ui.availsWidgets.HeatMap.HeatMapRow");
	global.vui5.ui.controls.HeatMapLegend = eval(vistexConfig.rootFolder + ".ui.availsWidgets.HeatMap.HeatMapLegend");

	return eval(vistexConfig.rootFolder + ".ui.availsWidgets.HeatMap");
});