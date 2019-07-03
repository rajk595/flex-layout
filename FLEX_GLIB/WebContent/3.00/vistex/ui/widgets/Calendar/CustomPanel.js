sap.m.P13nPanel.extend(vistexConfig.rootFolder + ".ui.widgets.Calendar.customPanel" , /** @lends sap.m.sample.P13nDialogWithCustomPanel.CustomPanel */
{
	constructor: function(sId, mSettings) {
		sap.m.P13nPanel.apply(this, arguments);
	},
	metadata: {
		library: "sap.m",
		aggregations: {
 
			/**
			 * Control embedded into CustomPanel
			 */
			content:{
				type: "sap.m.VBox",
				multiple: false
				
			},
    	panel:{
		type: "sap.m.Panel",
		multiple: false
		
	},
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
		oRm.renderControl(oControl.getContent());

		oRm.renderControl(oControl.getParentControl());
		oRm.renderControl(oControl.getAggregation('panel'));
	}
});