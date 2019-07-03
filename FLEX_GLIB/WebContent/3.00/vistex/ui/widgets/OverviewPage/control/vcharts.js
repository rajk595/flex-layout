/*sap.ui.getCore().loadLibrary(vistexConfig.vzrootFolder + ".ui.widgets.DashboardBundle", {
    url: vistexConfig.vzuiResourcePath + "/" + vistexConfig.dashboardBundleLibraryVersion + "/" + vistexConfig.vzrootFolder + "/ui/widgets/DashboardBundle"
});*/

jQuery.sap.registerModulePath("ViziDashboard", vistexConfig.vzuiResourcePath + "/" + vistexConfig.dashboardBundleLibraryVersion + "/" + vistexConfig.vzrootFolder + "/ui/widgets/DashboardBundle")

sap.ui.define([
    "sap/ui/core/Control",
    //vistexConfig.vzrootFolder + "/ui/widgets/DashboardBundle/vizi" 
    "ViziDashboard/vizi",
], function (Control, vizi) {
    "use strict";

    return Control.extend(vistexConfig.rootFolder + ".ui.widgets.OverviewPage.VCharts", {
        metadata: {
            properties: {
                adapterData: {
                    type: 'object',
                    defaultValue: {}
                }
            },
            events : {
                onNavigate : {},
              }
        },

        init: function () {
            this._oHTML = new sap.ui.core.HTML();                        
        },

        renderer: function (ioRm, ioControl) {
            ioRm.write("<div ");
            ioRm.addStyle("width", "100%");
            ioRm.writeStyles();
            ioRm.writeControlData(ioControl);
            ioRm.write('>');
            ioRm.renderControl(ioControl._oHTML);

//            if (!ioControl.wrapper) {
                ioControl.wrapper = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
//            }
            if (ioControl.getAdapterData()) {
                var loDataSource = new Vizi.charts.RowDataSource(ioControl.getAdapterData().meta, ioControl.getAdapterData().data);
                var loChart = new Vizi.charts.Chart(ioControl.getAdapterData().config, loDataSource, ioControl.wrapper);
                ioControl._oHTML.setDOMContent(loChart.htmlElement);
                
                loChart.on('ACTION',function(chart1,eventName,context) {
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
                     var params = {};
                     params[vui5.cons.params.selectedRow] = rowId;
                     params[vui5.cons.params.fieldName] = selField;
                     var promise = ioControl.fireOnNavigate({params: params});
                  });
                
                loChart.on("INFO", function(chart2, eventName, context, data) {
                    //console.log("Hovered on chart");
                  	var htmlElement = chart2.htmlElement;
                      var nodeData = context[1][0],
                          tooltipText = '';
                      if (nodeData) {
                        var selMetricField = nodeData['serie']['usedMetricFields'], selMetricName;                      
                        if(underscoreJS.isArray(selMetricField) && !underscoreJS.isEmpty(selMetricField)) {
                      	  selMetricName = selMetricField[0]['id'];  
                        }                                           
                        
                        var fieldName = Object.keys(nodeData.parsed).filter(function(parsedKey) {
                          var parsedObject = nodeData.parsed[parsedKey];
                          if(parsedObject.metadata.type === "Characteristic") {
                          	return parsedObject;	
                          }
                          else if(parsedObject.metadata.type === "Metric" && selMetricName === parsedKey) {
                          	return parsedObject;
                          }                        
                        });                      
                        fieldName.forEach(function(eventName) {
                          tooltipText += nodeData.parsed[eventName].fieldLabel + ": " + nodeData.parsed[eventName].label + "\n";
                        });
                      }
                      htmlElement.parentNode['title'] = tooltipText;
                  });
                
            }
            ioRm.write("</div>");
        }
    });
});