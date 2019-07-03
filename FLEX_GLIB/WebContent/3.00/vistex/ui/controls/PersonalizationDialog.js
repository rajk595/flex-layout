sap.ui.define([
         "sap/ui/core/Control",
         "sap/m/P13nGroupPanel",
         "sap/m/P13nGroupItem"
  ], function(control) {
  var P = control.extend(vistexConfig.rootFolder + ".ui.controls.PersonalizationDialog", {
	  metadata : {
	      properties : {},
	      events : {},
	      aggregations : {
	        _p13nDialog : {
	    		type : "sap.m.P13nDialog",
				multiple : false
		    }
	      }
	    },
	    init:function(){
	      var oControl = this;
	          oControl.p13nDialogPrepare();
	    },
	    renderer : function(oRM, oControl) {
	      oRM.write("<div");
	      oRM.writeControlData(oControl);
	      oRM.write(">");
	      oRM.renderControl(oControl.getAggregation("_p13nDialog"));
	      oRM.write("</div>");
	    }
	    
  });
  P.prototype.p13nDialogPrepare = function(){
	  var oControl = this;
	  
	  var p13nDialog = new sap.m.P13nDialog({
          ok: [oControl.onHandleOk, oControl],
          cancel: [oControl.onHandleClose, oControl],
          initialVisiblePanelType: "columns",
          showReset: true,
          reset: [oControl.onHandleReset, oControl]
      });

 	 oControl.setAggregation("_p13nDialog", p13nDialog);
  };
  P.prototype.onHandleOk= function(oEvent) {
      var oControl = this;
      oControl.onHandlePersonalizationOk(oEvent);
  };
  P.prototype.onHandleClose = function(oEvent) {
      var oControl = this;
      oControl.onHandlePersonalizationClose(oEvent);
  };
  P.prototype.onHandleReset = function(oEvent) {
      var oControl = this;
      oControl.onHandlePersonalizationReset(oEvent);
  };
 return P;
});
	    
	