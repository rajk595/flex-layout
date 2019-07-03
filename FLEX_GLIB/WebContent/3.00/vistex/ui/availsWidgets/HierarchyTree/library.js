sap.ui.define([ vistexConfig.rootFolder + "/ui/core/global" ], // referenced here to enable the
// Support feature
function(global) {

	sap.ui.getCore().initLibrary({
		name : vistexConfig.rootFolder + ".ui.availsWidgets.HierarchyTree",
		version : "3.00",
		dependencies : [],
		types : [],
		interfaces : [],
		controls : [vistexConfig.rootFolder + ".ui.availsWidgets.HierarchyTree.HierarchyTreeControl",			
			        vistexConfig.rootFolder + ".ui.availsWidgets.HierarchyTree.TreeTable",
			        vistexConfig.rootFolder + ".ui.availsWidgets.HierarchyTree.TreeTableCell",
			        vistexConfig.rootFolder + ".ui.availsWidgets.HierarchyTree.TreeTableColumn",
			        vistexConfig.rootFolder + ".ui.availsWidgets.HierarchyTree.TreeTableRow",		
		],
		elements : [],
		noLibraryCSS:true
	});
	
	global.vui5.ui.controls.HierarchyTreeControl = eval(vistexConfig.rootFolder + ".ui.availsWidgets.HierarchyTree.HierarchyTreeControl");
	global.vui5.ui.controls.TreeTable = eval(vistexConfig.rootFolder + ".ui.availsWidgets.HierarchyTree.TreeTable");
	global.vui5.ui.controls.TreeTableCell = eval(vistexConfig.rootFolder + ".ui.availsWidgets.HierarchyTree.TreeTableCell");
	global.vui5.ui.controls.TreeTableColumn = eval(vistexConfig.rootFolder + ".ui.availsWidgets.HierarchyTree.TreeTableColumn");
	global.vui5.ui.controls.TreeTableRow = eval(vistexConfig.rootFolder + ".ui.availsWidgets.HierarchyTree.TreeTableRow");

	return eval(vistexConfig.rootFolder + ".ui.availsWidgets.HierarchyTree");
});