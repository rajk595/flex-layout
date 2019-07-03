sap.ui.define([ "sap/ui/core/Control",
                vistexConfig.rootFolder + "/ui/core/commonUtils",
                vistexConfig.rootFolder + "/ui/core/global"],
        function(control, commonUtils, global) {
          var A = control.extend(vistexConfig.rootFolder + ".ui.availsWidgets.AvailsHeader.AvailsHeaderControl", {
                metadata : {
                  properties : {
                    controller : {
                      type : "object",
                      defaultValue : null
                    },
                    modelName: {
                      type: "string",
                      defaultValue: null
                    },
                    dataPath: {
                      type: "string",
                      defaultValue: null
                    }                                        
                  },
                  events : {                    
                  },
                  aggregations : {
                    _getAvailsHeader: {
                      type : "sap.ui.core.Control",
                      multiple : false,
                      visibility : "hidden"
                    }
                  }
                },
                renderer : function(oRM, oControl) {
                  oRM.write("<div");
                  oRM.writeControlData(oControl);
                  oRM.write(">");
                  oRM.renderControl(oControl.getAggregation("_getAvailsHeader"));
                  oRM.write("</div>");
                }
          });

          A.prototype.setModelName = function(value) {
            this.setProperty("modelName", value, true);
          };
          A.prototype.setDataPath = function(value) {
            this.setProperty("dataPath", value, true);
          };
          

          A.prototype.onAvailsHeaderInfocusSet = function() {
            var oControl = this;
            var oController = this.getController();
            var modelName = this.getModelName();
            var model = oController.getModel(modelName);
            var dataPath = this.getDataPath();
            
            var oAvailsHeader = new global.vui5.ui.controls.DialogHeader({
            	imageSrc: "{" + modelName + ">" + dataPath + "/imageSrc}",
            	header: "{" + modelName + ">" + dataPath + "/header}",
            	subHeader: "{" + modelName + ">" + dataPath + "/subHeader}",
			    type: "{" + modelName + ">" + dataPath + "/type}",
				availability: "{=parseInt(${" + modelName + ">" + dataPath + "/availability})}",			    
				availabilityText: "{" + modelName + ">" + dataPath + "/availabilityText}",
				color: "{" + modelName + ">" + dataPath + "/color}",
				displayMode: "{" + modelName + ">" + dataPath + "/displayMode}",
				availabilityDate: "{" + modelName + ">" + dataPath + "/availabilityDate}"
            });                       
            
            oControl.setAggregation("_getAvailsHeader", oAvailsHeader);

          };

          return A;
        });