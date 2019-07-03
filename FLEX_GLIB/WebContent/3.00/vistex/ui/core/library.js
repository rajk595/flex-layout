sap.ui.define(['jquery.sap.global', 'sap/ui/Device', 'sap/ui/base/DataType',
	'sap/ui/core/library', // library dependency
	'jquery.sap.mobile'], // referenced here to enable the Support feature
	function(jQuery, Device, DataType, CoreLibrary) {
 
    sap.ui.getCore().initLibrary({
		name : vistexConfig.rootFolder + ".ui.core",
		version: "2.00",
		dependencies : [],
		types: [
		],
		interfaces: [],
		controls: [],
		elements: [],
		noLibraryCSS:true
	});
    
    
    return eval(vistexConfig.rootFolder + ".ui.core");
});