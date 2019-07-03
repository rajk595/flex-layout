/*sap.ui.getCore().loadLibrary(vistexConfig.vzrootFolder + ".ui.widgets.DashboardBundle", {
    url: vistexConfig.vzuiResourcePath + "/" + vistexConfig.dashboardBundleLibraryVersion + "/" + vistexConfig.vzrootFolder + "/ui/widgets/DashboardBundle"
});*/

jQuery.sap.registerModulePath("ViziDashboard", vistexConfig.vzuiResourcePath + "/" + vistexConfig.dashboardBundleLibraryVersion + "/" + vistexConfig.vzrootFolder + "/ui/widgets/DashboardBundle")

jQuery.sap.includeStyleSheet("//maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css");
jQuery.sap.includeStyleSheet("//fonts.googleapis.com/css?family=Roboto"); 
sap.ui.define([ "sap/ui/core/Control",
	            //vistexConfig.vzrootFolder + "/ui/widgets/DashboardBundle/vizi" ],
	            "ViziDashboard/vizi",
	          ],
        function(control, vizi) {
          var A = control.extend(vistexConfig.rootFolder + ".ui.widgets.Summaries.ViziChart",
                  {
                    metadata : {
                      properties : {
                        controller : {
                          type : "object",
                          defaultValue : null
                        },
                        modelName : {
                          type : "string",
                          defaultValue : null
                        },
                        sumId : {
                          type : "string",
                          defaultValue : null
                        },
                        metadataPath : {
                          type : "string",
                          defaultValue : null
                        },
                        configPath : {
                          type : "string",
                          defaultValue : null
                        },
                        dataPath : {
                          type : "string",
                          defaultValue : null
                        }
                      },
                      events : {
                        renderViziChart : {},
                        onNavigate : {},
                      },
                      aggregations : {
                        _getViziChart : {
                          type : "sap.ui.core.Control",
                          multiple : false,
                          visibility : "hidden"
                        }
                      }
                    },
                    renderer : function(oRM, oControl) {
                      oRM.write("<style>");
                      oRM.write("svg {-webkit-user-select: none; -moz-user-select: none; -ms-user-select: none;user-select: none;}");
                      oRM.write("html, body {margin: 0;padding: 0;font-family: Arial;}");
                      /*
                       * oRM.write(".application {display:
                       * flex;flex-wrap: wrap;width:
                       * 100vw;height: 100vh;}");
                       */
                      oRM.write(".application {display: flex;flex-wrap: wrap;}");
                      oRM.write(".widget {min-height:320px!important;width:100vw; height:50vh;}");
                      oRM.write("</style>");
                      oRM.write("<div");
                      oRM.writeControlData(oControl);
                      oRM.write(">");
                      oRM
                          .renderControl(oControl
                              .getAggregation("_getViziChart"));
                      oRM.write("</div>");
                    }
                  });
          A.prototype.setModelName = function(value) {
            this.setProperty("modelName", value, true);
          };

          A.prototype.setSumId = function(value) {
            this.setProperty("sumId", value, true);
          };

          A.prototype.setMetadataPath = function(value) {
            this.setProperty("metadataPath", value, true);
          };

          A.prototype.setConfigPath = function(value) {
            this.setProperty("configPath", value, true);
          };

          A.prototype.setDataPath = function(value) {
            this.setProperty("dataPath", value, true);
          };

          A.prototype.onRenderViziChart = function() {
            var oControl = this, params = {};
            var oController = this.getController();
            var model = oController.getModel(this.getModelName());
            var sumId = this.getSumId() + Date.now();
            var metadataPath = this.getMetadataPath();
            var configPath = this.getConfigPath();
            var dataPath = this.getDataPath();

            var metadata = JSON.parse(model
                .getProperty(metadataPath));
            var config = JSON.parse(model.getProperty(configPath));
            var data = model.getProperty(dataPath) || [];

            var chartData = new Vizi.charts.RowDataSource(metadata,
                data);

            
            oControl.skipChartRendering = false;
            
            var type;            
            if(config && config['plots'] && config['plots'].length > 0) {
            	type = config['plots'][0]['type'];
            }
            
            var oHtml = new sap.ui.core.HTML({
              content : "<div class='application'> <svg id='"
                  + sumId + "' class='widget'></svg> </div>"
            }).addEventDelegate({
              onAfterRendering : function(e) {
                if(!oControl.skipChartRendering){
                oControl.skipChartRendering = true;
                
                var chart1 = new Vizi.charts.Chart(config,chartData, document.getElementById(sumId));
                chart1.on('ACTION',function(chart1,eventName,context) {
                  var oContext, rawData, rowId, selFieldLabel, selField, parsed, keys;
                  oContext = context[1][0];
                  rawData = oContext['raw'];
                  selFieldLabel = oContext['serie']['name'];
                  parsed = oContext['parsed'];
                  rowId = rawData[rawData.length - 1];
                  keys = underscoreJS.keys(parsed);
                  _.each(keys, function(obj,i){
                    if(parsed[obj]['fieldLabel'] == selFieldLabel){
                      selField = obj;
                      return;
                    }
                  });
                  params[vui5.cons.params.selectedRow] = rowId;
                  params[vui5.cons.params.fieldName] = selField;
                  params[vui5.cons.params.sumId] = oControl.getSumId();
                  var promise = oControl.fireOnNavigate({params: params});
                });

                chart1.on('SELECT',function(chart1,eventName,context) {
                  var oContext, rawData, rowId, selFieldLabel, selField, parsed, keys;
                  //var promise = oControl.fireOnNavigate({params: params});
                });

                chart1.on("INFO", function(chart2, eventName, context, data) {
                    //console.log("Hovered on chart");
                  var htmlElement = chart2.htmlElement;
                    var nodeData = context[1][0],
                        tooltipText = '';
                    if (nodeData) {
                       //*****Rel 60E_SP7
                     if(type && type === "Waterfall") {
                      var xField = nodeData['serie']['x']['id'];
                      var yField = nodeData['serie']['y']['id'];
                      var zField = nodeData['serie']['z']['id'];
                   	  if(zField) {
                      	tooltipText = nodeData.parsed[zField].label + ":" + "\n \n";
                      }
                      if(xField && yField) {
                      	tooltipText += nodeData.parsed[xField].label + ": " + nodeData.parsed[yField].label + "\n";	
                      }                    	                    	
                     }
                     else {            
                       //*****
                      
                      /*var selMetricField = nodeData['serie']['usedMetricFields'], selMetricName;                      
                      if(underscoreJS.isArray(selMetricField) && !underscoreJS.isEmpty(selMetricField)) {
                        selMetricName = selMetricField[0]['id'];  
                      }*/                    	 
                      var usedMetricFields = underscoreJS.pluck(nodeData['serie']['usedMetricFields'],"id");
                      
                      var fieldName = Object.keys(nodeData.parsed).filter(function(parsedKey) {
                        var parsedObject = nodeData.parsed[parsedKey];                        
                        if(parsedObject.metadata.type === "Characteristic") {
                          return parsedObject;
                        }
                        else if(parsedObject.metadata.type === "Metric" && underscoreJS.contains(usedMetricFields, parsedKey)) {
                          return parsedObject;
                        }
                      });                      
                      fieldName.forEach(function(eventName) {
                        tooltipText += nodeData.parsed[eventName].fieldLabel + ": " + nodeData.parsed[eventName].label + "\n";
                      });
                     
                     //*****Rel 60E_SP7
                     }
                     //*****
                    }
                    
                    htmlElement.parentNode['title'] = tooltipText;
                  });

              }
              }
            });
            oControl.setAggregation("_getViziChart", oHtml);

          };

          return A;

        });