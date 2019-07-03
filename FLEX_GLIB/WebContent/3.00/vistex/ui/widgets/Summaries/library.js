sap.ui.define([vistexConfig.rootFolder + "/ui/core/global"], // referenced here to enable the Support feature
function(global) {

	sap.ui.getCore().initLibrary({
		name : vistexConfig.rootFolder + ".ui.widgets.Summaries",
		version : "1.00",
		dependencies : [],
		types : [],
		interfaces : [],
		controls : [ vistexConfig.rootFolder + ".ui.widgets.Summaries.ViziChart",
				     vistexConfig.rootFolder + ".ui.widgets.Summaries.SummaryView"],
		elements : [],
		noLibraryCSS:true
	});
	
	global.vui5.ui.controls.SummaryView = eval(vistexConfig.rootFolder + ".ui.widgets.Summaries.SummaryView");
	global.vui5.ui.controls.ViziChart = eval(vistexConfig.rootFolder + ".ui.widgets.Summaries.ViziChart");	
	
	return eval(vistexConfig.rootFolder + ".ui.widgets.Summaries");
});