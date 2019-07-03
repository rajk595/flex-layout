sap.ui.define([ vistexConfig.rootFolder + "/ui/core/global" ], // referenced here to enable the
				// Support feature
				function(global) {

					sap.ui.getCore().initLibrary(
									{
										name : vistexConfig.rootFolder + ".ui.widgets.Calendar",
										version : "1.00",
										dependencies : ["sap.viz"],
										types : [],
										interfaces : [],
										controls : [ vistexConfig.rootFolder + ".ui.widgets.Calendar.TradeCalendar" ],
										elements : [],
										noLibraryCSS : true
									});

					global.vui5.ui.controls.TradeCalendar = eval(vistexConfig.rootFolder + ".ui.widgets.Calendar.TradeCalendar");
					jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath(vistexConfig.rootFolder + ".ui.widgets.Calendar") + "/Content/css/bootstrap-min.css");
					jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath(vistexConfig.rootFolder + ".ui.widgets.Calendar") + "/Content/css/font-awsome.css");
					jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath(vistexConfig.rootFolder + ".ui.widgets.Calendar") + "/Content/css/fontStyles.css");
					//jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath(vistexConfig.rootFolder + ".ui.widgets.Calendar") + "/Content/css/jquery-contextMenu.css");
					jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath(vistexConfig.rootFolder + ".ui.widgets.Calendar") + "/Content/css/jquery-treegrid.css");
					jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath(vistexConfig.rootFolder + ".ui.widgets.Calendar") + "/Content/css/jquery-ui.css");
					jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath(vistexConfig.rootFolder + ".ui.widgets.Calendar") + "/Content/css/myStyles.css");
					jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath(vistexConfig.rootFolder + ".ui.widgets.Calendar") + "/Content/css/gantt.css");
					return eval(vistexConfig.rootFolder + ".ui.widgets.Calendar");
				});