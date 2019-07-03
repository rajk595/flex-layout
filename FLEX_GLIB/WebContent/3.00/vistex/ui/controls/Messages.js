sap.ui.define([
  "sap/ui/core/Control",
  ], function(control) {
  var M = control.extend(vistexConfig.rootFolder + ".ui.controls.Messages", {
	  metadata : {
	      properties : {},
	      events : {},
	      aggregations : {
	        _messagesPopPover : {
	    		type : "sap.m.MessagePopover",
				multiple : false
		    }
	      }
	    },
	    init:function(){
	      var oControl = this;
	          oControl.messagesPrepare();
	    },
	    renderer : function(oRM, oControl) {
	      oRM.write("<div");
	      oRM.writeControlData(oControl);
	      oRM.write(">");
	      oRM.renderControl(oControl.getAggregation("_messagesPopPover"));
	      oRM.write("</div>");
	    }
	    
  });
  M.prototype.messagesPrepare = function(){
	  var oControl = this;
	  var messagePopover = new sap.m.MessagePopover({
          items: {
              path: "message>/",
              template: new sap.m.MessagePopoverItem({
                  description: "{message>description}",
                  type: "{message>type}",
                  title: "{message>message}"
              })
          }
      });
 	 messagePopover.setModel(sap.ui.getCore().getMessageManager().getMessageModel(), "message");
 	 oControl.setAggregation("_messagesPopPover", messagePopover);
  };
 return M;
});
	    
	