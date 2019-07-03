sap.ui.define([
         "sap/ui/core/Control",
  ], function(control) {
  var U = control.extend(vistexConfig.rootFolder + ".ui.controls.UserPreferences", {
	  metadata : {
	      properties : {},
	      events : {},
	      aggregations : {
	        _list : {
	    		type : "sap.m.List",
				multiple : false
		    }
	      }
	    },
	    init:function(){
		      var oControl = this;
		          //oControl.listPrepare();
		 },
	    renderer : function(oRM, oControl) {
		      oRM.write("<div");
		      oRM.writeControlData(oControl);
		      oRM.write(">");
		      oRM.renderControl(oControl.getAggregation("_list"));
		      oRM.write("</div>");
		    }
	  
	  });
  U.prototype.listPrepare = function(){
	  var oControl = this;
	  var mainModel = oControl.getModel(vui5.modelName);
      var bundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls");
      var list =  new sap.m.List({
          items: [
            new sap.m.DisplayListItem({
                label: mainModel.getProperty(vui5.cons.modelPath.login + "/USERNAME")
            }),
            new sap.m.DisplayListItem({
                label: bundle.getText("Server"),
                value: mainModel.getProperty(vui5.cons.modelPath.login + "/HOST")
            }),
            new sap.m.DisplayListItem({
                label: bundle.getText("Language"),
                value: mainModel.getProperty(vui5.cons.modelPath.login + "/LANGUAGE_TEXT")
            }),
            new sap.m.DisplayListItem({
                label: bundle.getText("Theme"),
                type: sap.m.ListType.Navigation,
                press: [oControl.processThemes, oControl]
            }).bindProperty("value", vui5.modelName + ">" + vui5.cons.modelPath.sessionInfo + "/THEME",
                function (value) {
                    var tempTheme = mainModel.getProperty("/TEMP_THEME");
                    if (!underscoreJS.isEmpty(tempTheme)) {
                        var themeName = underscoreJS.findWhere(mainModel.getProperty(vui5.cons.modelPath.themes), { 'ID': tempTheme });
                    }
                    if (themeName) {
                  	       return themeName['NAME'];
                     }
                    else{
                  	  return value;
                     }
                }, sap.ui.model.BindingMode.TwoWay)
          ]
      }).setModel(mainModel, vui5.modelName);
      
      oControl.setAggregation("_list",list);

  };
})