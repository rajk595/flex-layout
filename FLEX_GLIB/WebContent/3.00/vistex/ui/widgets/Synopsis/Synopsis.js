jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath(vistexConfig.rootFolder + ".ui.widgets.Synopsis") + "/dist/assets/fonts/font-awesome.min.css");
sap.ui.define(["sap/ui/core/Control",
	"./dist/umd/synopsis.native.css",
	"./dist/umd/synopsis.bundle.min"
	],
        function(control) {
          var S = control.extend(vistexConfig.rootFolder + ".ui.widgets.Synopsis.Synopsis", {
                metadata : {
                  properties : {
                	  controller: {
                          type: "string",
                          defaultValue: null
                      },
                    modelName: {
                        type: "string",
                        defaultValue: null
                    },
                    dataPath : {
                      type : "string",
                      defaultValue : null
                    }
                  
                  },
                  events : {},
                  aggregations : {
            
                    _getPanel: {
                      type: "sap.ui.core.Control",
                      multiple: false
                    }
                  }
                },
                onAfterRendering: function (){
                    //called after instance has been rendered (it's in the DOM)
                	var oControl = this;
                	if(oControl.jsonData){
                        oControl.synopsis = new Synopsis(document.getElementById(oControl.synopsisDomId),oControl.jsonData);    
                    }
                },
                renderer : function(oRM, oControl) {
                  oRM.write("<div");
                  oRM.writeControlData(oControl);
                  oRM.write(">");
                  
                  oRM.renderControl(oControl.getAggregation("_getPanel"));
                  oRM.write("</div>");
                }
              });
          S.prototype.renderSynopsis= function() {
              var oControl = this,modelName,model,path,oHtml;
                modelName = this.getModelName();
                model = oControl.getModel(modelName);
                path = oControl.getDataPath();
                
                oControl.synopsisDomId = 'vis_synopsis'+ Math.floor((Math.random() * 100) + 1);
                
                oHtml = new sap.ui.core.HTML({
                 content : "<div id='"+ oControl.synopsisDomId +"'> </div>;"
                 });
                oControl.jsonData = model.getProperty(path);
                
                oControl.setAggregation("_getPanel",oHtml);
                
  

          };

          return S;
        });