sap.m.Table.extend("sap.viz.ui5.controls.VizFrame" ,
{
	metadata: {
		library: "sap.m,sap.ui.commons,sap.viz,sap.ui.suite",

		aggregations: {
 
	parentControl:{
		
		type:'sap.ui.core.Control',
		multiple:false
		
	}
	
		}
	},
	renderer: function(oRm, oControl) {
		if (!oControl.getVisible()) {
			return;
		}
		oRm.renderControl(oControl.getAggregation('parentControl'));
	}
});