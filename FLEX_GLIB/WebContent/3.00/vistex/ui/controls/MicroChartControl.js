sap.ui.getCore().loadLibrary("sap.suite.ui.microchart");

sap.ui.define(['sap/ui/core/Control',
  vistexConfig.rootFolder + "/ui/core/global",
  vistexConfig.rootFolder + "/ui/core/underscore-min",
  vistexConfig.rootFolder + "/ui/core/commonUtils"
], function (control, global, underscoreJS, commonUtils) {

    var C = control.extend(vistexConfig.rootFolder + ".ui.controls.MicroChartControl", {
        metadata: {
            properties: {
                controller: {
                    type: "object",
                    defaultValue: null
                },
                modelName: {
                    type: "string",
                    defaultValue: null
                },
                //*****Rel 60E_SP6        
                title: {
                    type: "string",
                    defaultValue: null
                },
                //*****
                chartDetailsPath: {
                    type: "string",
                    defaultValue: null
                },
                chartDataPath: {
                    type: "string",
                    defaultValue: null
                }
            },
            events: {
                onNavigate: {}
            },
            aggregations: {
                microChartControl: {
                    type: "sap.ui.core.Control",
                    multiple: false,
                    visibility: "public"
                }
            }
        },
        init: function () { },
        renderer: function (oRM, oControl) {
            oRM.write("<div");
            oRM.writeControlData(oControl);
            oRM.write(">");
            oRM.renderControl(oControl.getAggregation("microChartControl"));
            oRM.write("</div>");
        }
    });

    C.prototype.setController = function (sVal) {
        this.setProperty('controller', sVal);
    },
    C.prototype.setModelName = function (sVal) {
        this.setProperty('modelName', sVal);
    },
    C.prototype.setChartDetailsPath = function (sVal) {
        this.setProperty('chartDetailsPath', sVal);
    },
    C.prototype.setChartDataPath = function (sVal) {
        this.setProperty('chartDataPath', sVal);
    },
    //*****Rel 60E_SP6
    C.prototype.setTitle = function (sVal) {
        this.setProperty('title', sVal);
    },
    //*****	  

    C.prototype.chartObjectGet = function () {
        var oControl, oController, modelName, chartDetailsPath, chartDataPath, model, chartDetails, chartData, axes, oChart, title, i = 0;
        oControl = this;
        oController = this.getController();
        modelName = this.getModelName();
        chartDetailsPath = this.getChartDetailsPath();
        chartDataPath = this.getChartDataPath();
        model = oController.getModel(modelName);
        chartDetails = model.getProperty(chartDetailsPath);
        chartData = model.getProperty(chartDataPath);
        //*****Rel 60E_SP6
        title = this.getTitle();
        //*****     
        axes = {
            "actual": "1",
            "target": "2",
            "forecast": "3",
            "title": "4",
            "value": "5"
        };

        if (chartDetails['CHTYP'] == global.vui5.cons.microcharts.column || chartDetails['CHTYP'] == global.vui5.cons.microcharts.comparison) {
        	
            var valueField,valueFieldObjIndex,valueFieldObj,refField,scaleField,aggregationName,
               chartData,titleProperty,titleField, titleTextField;;
            valueFieldObj = underscoreJS.find(chartDetails.FIELDS, { AXSCT: axes.value });
            valueFieldObjIndex = underscoreJS.findIndex(chartDetails.FIELDS, { AXSCT: axes.value });
           // scaleField = valueFieldObj['SCALE'];
            valueField = valueFieldObj['FLDNM'];
        	titleField = underscoreJS.find(chartDetails.FIELDS, { AXSCT: axes.title })['FLDNM'];
            //*****Rel 60E_SP6
            titleTextField = underscoreJS.find(chartDetails.FIELDS, { AXSCT: axes.title })['TXFLD'];
            //*****
            if(chartDetails['CHTYP'] == global.vui5.cons.microcharts.comparison){
            	
            	oChart = new sap.suite.ui.microchart.ComparisonMicroChart();
            	aggregationName = 'data';
            	titleProperty = 'title';
            }
            else{
            	oChart = new sap.suite.ui.microchart.ColumnMicroChart({
            		/**to show label **/
            		allowColumnLabels: true
            		/***/
            	});
            	aggregationName = 'columns';
            	/**displays below the bar*/
            	titleProperty = 'label';
            	/***/
            	            }
            oChart.bindAggregation(aggregationName, modelName + ">" + chartDataPath, function (sId, context) {
                var object = context.getObject();
                var index = sId.split('-').pop();
                if(chartDetails['CHTYP'] == global.vui5.cons.microcharts.comparison){
                	var chartData = new sap.suite.ui.microchart.ComparisonMicroChartData();
                }
                else{
                	var chartData = new sap.suite.ui.microchart.ColumnMicroChartData();
                }
                chartData.setValue(parseFloat(object[valueField]));
                chartData.bindProperty("color", {
                    parts: [
                      {
                          path: modelName + ">" + chartDetailsPath + "/THRESHOLD",
                          mode: sap.ui.model.BindingMode.OneWay
                      },
                      {
                          path: modelName + ">" + chartDataPath + index + "/" + valueField,
                          mode: sap.ui.model.BindingMode.OneWay
                      }
                    ],
                    formatter: function (arr, value) {
                        var str;
                        underscoreJS.each(arr, function (obj, i) {
                            var lVal = parseInt(obj['LOWVL']);
                            var hVal = parseInt(obj['HIGVL']);
                            if (value >= lVal && value <= hVal) {
                                str = commonUtils._findKey(global.vui5.cons.thresholds, obj['COLOR']);
                            }
                        });
                        return str;
                    }
                }, sap.ui.model.BindingMode.OneWay);
                
                //if(valueFieldObj['DATATYPE'] ===global.vui5.cons.dataType.amount || valueFieldObj['DATATYPE'] ===global.vui5.cons.dataType.quantity){
//                if(valueFieldObj['RFFLD']){	
                   refField = valueFieldObj['RFFLD'];
               	   var refFieldPath;
                 	if(refField)
                     refFieldPath = modelName + ">" + refField;
                	var params={
                			refFieldPath : refFieldPath,
                			valueFieldPath : modelName + ">" + chartDataPath + index + "/" + valueField,
                			scaleFieldPath : modelName + ">" + chartDetailsPath + "/SCALE",
                			property : 'displayValue',
                			chartData :chartData,
                			decimals: valueFieldObj['DECIMALS']
                	}
                	if(chartDetails['CHTYP'] == global.vui5.cons.microcharts.column && sap.ui.version > 1.60)
                	 oControl.currencyNScaleFormatter(params);
                	else if(chartDetails['CHTYP'] == global.vui5.cons.microcharts.comparison)
                	 oControl.currencyNScaleFormatter(params);
               // }
                
             // *****Rel 60E_SP6
                //	if(!chartDetails['CHTYP'] == global.vui5.cons.microcharts.column){
              if (underscoreJS.isEmpty(titleTextField)) {
                  chartData.bindProperty(titleProperty, modelName + ">" + chartDataPath + index + "/" + titleField, null, sap.ui.model.BindingMode.OneWay);
              }
              else {
                  chartData.bindProperty(titleProperty, modelName + ">" + chartDataPath + index + "/" + titleTextField, null, sap.ui.model.BindingMode.OneWay);
              }
                	//}
              /**/
                return chartData;
            });
        } 
      
        else if (chartDetails['CHTYP'] == global.vui5.cons.microcharts.bullet) {
            var i = 0,actualField,actualFieldObj,actualIndex,actualPath,targetField,targetIndex,targetPath,forecastField,forecastPath;
            actualFieldObj = underscoreJS.find(chartDetails.FIELDS, { AXSCT: axes.actual });
            actualField = actualFieldObj['FLDNM'];
            if (!actualField) {
                actualIndex = underscoreJS.findIndex(chartDetails.FIELDS, { AXSCT: axes.actual })
                actualPath = modelName + ">" + chartDetailsPath + "/FIELDS/" + actualIndex + "/" + "VALUE";
            }
            else {
                actualPath = modelName + ">" + chartDataPath + i + "/" + actualField;
            }
            targetField = underscoreJS.find(chartDetails.FIELDS, { AXSCT: axes.target })['FLDNM'];
            if (!targetField) {
                targetIndex = underscoreJS.findIndex(chartDetails.FIELDS, { AXSCT: axes.target });
                targetPath = modelName + ">" + chartDetailsPath + "/FIELDS/" + targetIndex + "/" + "VALUE";
            }
            else {
                targetPath = modelName + ">" + chartDataPath + i + "/" + targetField
            }
            forecastField = underscoreJS.find(chartDetails.FIELDS, { AXSCT: axes.forecast })['FLDNM'];
            if (!forecastField) {
                forecastIndex = underscoreJS.findIndex(chartDetails.FIELDS, { AXSCT: axes.forecast })
                forecastPath = modelName + ">" + chartDetailsPath + "/FIELDS/" + forecastIndex + "/" + "VALUE";
            }
            else {
                forecastPath = modelName + ">" + chartDataPath + i + "/" + forecastField
            }

            oChart = new sap.suite.ui.microchart.BulletMicroChart({
               // scale : actualFieldObj['SCALE'],
                actual: new sap.suite.ui.microchart.BulletMicroChartData({
                }).bindProperty("value", {
                    parts: [{ path: actualPath }],
                    formatter: function (val) {
                        return parseFloat(val);
                    },
                    mode: sap.ui.model.BindingMode.OneWay
                })
                  .bindProperty("color", {
                      parts: [{ path: modelName + ">" + chartDetailsPath + "/THRESHOLD" },
                               { path: actualPath }],
                      formatter: function (arr, value) {
                          var str;
                          underscoreJS.each(arr, function (obj, i) {
                              var lVal = parseInt(obj['LOWVL']);
                              var hVal = parseInt(obj['HIGVL']);
                              if (value >= lVal && value <= hVal) {
                                  str = commonUtils._findKey(global.vui5.cons.thresholds, obj['COLOR']);
                              }
                          });
                          return str;
                      },
                      mode: sap.ui.model.BindingMode.OneWay
                  })
            })
            //.bindProperty("targetValue", targetPath, null, sap.ui.model.BindingMode.OneWay)
             // .bindProperty("forecastValue", forecastPath, null, sap.ui.model.BindingMode.OneWay)
            .bindProperty("targetValue", {
                parts: [{ path: targetPath }],
                formatter: function (val) {
                    return parseFloat(val);
                },
                mode: sap.ui.model.BindingMode.OneWay
            })
            .bindProperty("forecastValue", {
                parts: [{ path: forecastPath }],
                formatter: function (val) {
                    return parseFloat(val);
                },
                mode: sap.ui.model.BindingMode.OneWay
            })
            .bindAggregation("thresholds", modelName + ">" + chartDetailsPath + "/" + "THRESHOLD", function (sId, context) {
                var object = context.getObject();
                var val1 = parseInt(object['LOWVL']);
                var colour = commonUtils._findKey(global.vui5.cons.thresholds, object['COLOR']);
                return new sap.suite.ui.microchart.BulletMicroChartData({
                    value: val1,
                    color: colour
                });
            });
            
     /**/      //if(actualFieldObj['DATATYPE'] ===global.vui5.cons.dataType.amount || actualFieldObj['DATATYPE'] ===global.vui5.cons.dataType.quantity){
            //if(actualFieldObj['RFFLD']){
            	
            	refField = actualFieldObj['RFFLD'];
            	var refFieldPath;
            	if(refField)
                  refFieldPath = modelName + ">" + refField;
            	var scaleFieldPath = modelName + ">" + chartDetailsPath +"/SCALE";
            	
            	var params={
            			refFieldPath : refFieldPath,
            			valueFieldPath : actualPath,
            			scaleFieldPath : scaleFieldPath,
            			property : 'actualValueLabel',
            			chartData : oChart,
            			decimals: actualFieldObj['DECIMALS']
                }
            	
            	oControl.currencyNScaleFormatter(params);
            	
            	params['valueFieldPath'] = targetPath;
            	params['propety'] = 'targetValueLabel';
            	oControl.currencyNScaleFormatter(params);
            	
           // }
//            else{
//            	oChart.bindAggregation("scale", modelName + ">" + chartDetailsPath  + "/SCALE",null, sap.ui.model.BindingMode.TwoWay);
//            }

        } else if (chartDetails['CHTYP'] == global.vui5.cons.microcharts.radial) {

            var fractionField, totalField, fractionPath, fractionIndex, totalPath, totalIndex, totalFieldName;
            oChart = new sap.suite.ui.microchart.RadialMicroChart({
                height: "100px",
                width: "100px",
                size: "M"
            });

            fractionField = underscoreJS.find(chartDetails.FIELDS, { AXSCT: axes.actual })['FLDNM'];
            if (!fractionField) {
                fractionIndex = underscoreJS.findIndex(chartDetails.FIELDS, { AXSCT: axes.actual })
                fractionPath = modelName + ">" + chartDetailsPath + "/FIELDS/" + fractionIndex + "/" + "VALUE";
            }
            else {
                fractionPath = modelName + ">" + chartDataPath + i + "/" + fractionField;
            }
            totalField = underscoreJS.find(chartDetails.FIELDS, { AXSCT: axes.target });

            if (totalField) {
                totalFieldName = underscoreJS.find(chartDetails.FIELDS, { AXSCT: axes.target })['FLDNM'];
                if (!totalFieldName) {
                    totalIndex = underscoreJS.findIndex(chartDetails.FIELDS, { AXSCT: axes.target });
                    totalPath = modelName + ">" + chartDetailsPath + "/FIELDS/" + totalIndex + "/" + "VALUE";
                } else {
                    totalPath = modelName + ">" + chartDataPath + i + "/" + totalFieldName;
                }
                oChart.bindProperty("fraction", {
                    parts: [{ path: fractionPath }],
                    formatter: function (value) {
                        return parseFloat(value);
                    },
                    mode: sap.ui.model.Binding.OneWay
                });
                oChart.bindProperty("total", {
                    parts: [{ path: totalPath }],
                    formatter: function (value) {
                        return parseFloat(value);
                    },
                    mode: sap.ui.model.Binding.OneWay
                });
                //oChart.bindProperty("total", totalPath, null, sap.ui.model.Binding.OneWay);

            } else {
                //oChart.bindProperty("percentage", fractionPath, null, sap.ui.model.Binding.OneWay);
                oChart.bindProperty("percentage", {
                    parts: [
                      { path: fractionPath }
                    ], formatter: function (value) {
                        return parseFloat(value);
                    },
                    mode: sap.ui.model.Binding.OneWay
                });
            }


            oChart.bindProperty("valueColor", {
                parts: [{ path: modelName + ">" + chartDetailsPath + "/THRESHOLD" },
                        { path: fractionPath }],
                formatter: function (arr, value) {
                    var str;
                    underscoreJS.each(arr, function (obj, i) {
                        var lVal = parseInt(obj['LOWVL']);
                        var hVal = parseInt(obj['HIGVL']);
                        if (value >= lVal && value <= hVal) {
                            str = commonUtils._findKey(global.vui5.cons.thresholds, obj['COLOR']);
                        }
                    });
                    return str;
                },
                mode: sap.ui.model.BindingMode.OneWay
            });

        } else if (chartDetails['CHTYP'] == global.vui5.cons.microcharts.harvey) {

            var fractionFieldObj, totalFieldObj, fractionIndex, fractionPath, totalFieldIndex, totalPath;

            fractionFieldObj = underscoreJS.find(chartDetails.FIELDS, { AXSCT: axes.actual });
            totalFieldObj = underscoreJS.find(chartDetails.FIELDS, { AXSCT: axes.target })

            if (!fractionFieldObj['FLDNM']) {
                fractionIndex = underscoreJS.findIndex(chartDetails.FIELDS, { AXSCT: axes.actual })
                fractionPath = modelName + ">" + chartDetailsPath + "/FIELDS/" + fractionIndex + "/" + "VALUE";
            }
            else {
                fractionPath = modelName + ">" + chartDataPath + i + "/" + fractionFieldObj['FLDNM'];
            }
            if (!totalFieldObj['FLDNM']) {
                totalIndex = underscoreJS.findIndex(chartDetails.FIELDS, { AXSCT: axes.target })
                totalPath = modelName + ">" + chartDetailsPath + "/FIELDS/" + totalIndex + "/" + "VALUE";
            }
            else {
                totalPath = modelName + ">" + chartDataPath + i + "/" + totalFieldObj['FLDNM'];
            }

        	var scaleFieldPath = modelName + ">" + chartDetailsPath +"/SCALE";
        	
            var i = 0;
            oChart = new sap.suite.ui.microchart.HarveyBallMicroChart({
                height: "100px",
                width: "100px",
                size: "M",
                /** to display totalLabel instead of totalScale**/
                formattedLabel: true
                /***/
            })
            //.bindProperty("total", totalPath, null,sap.ui.model.Binding.OneWay);
            oChart.bindProperty("total", {
                parts: [{ path: totalPath }],
                formatter: function (value) {
                    return parseFloat(value);
                },
                mode: sap.ui.model.Binding.OneWay
            });

            //if (!underscoreJS.isEmpty(totalFieldObj['RFFLD'])) {
               
            	refField = totalFieldObj['RFFLD'];
            	var refFieldPath;
            	if(refField)
                  refFieldPath = modelName + ">" + refField;
            	var params={
            			refFieldPath : refFieldPath,
            			valueFieldPath : totalPath,
            			scaleFieldPath : scaleFieldPath,
            			property : 'totalLabel',
            			chartData : oChart,
            			decimals: totalFieldObj['DECIMALS']
                }
            	
            	oControl.currencyNScaleFormatter(params);
            	// oChart.bindProperty("totalScale", modelName + ">" + chartDataPath + i + "/" + totalFieldObj['RFFLD'], null, sap.ui.model.Binding.OneWay);
//            }
//            else {
//                oChart.setProperty("totalScale", totalFieldobj['SCALE']);
//            }
            

            oChart.bindAggregation('items', modelName + ">" + chartDataPath, function (sId, context) {
                var object = context.getObject();
                var index = sId.split('-').pop();
                var harveyItem = new sap.suite.ui.microchart.HarveyBallMicroChartItem({
                    // fraction: parseFloat(object[fractionFieldObj['FLDNM']])
                	/** to display fractionLabel instead of fractionScale**/
                	formattedLabel : true
                	/***/
                }).bindProperty("fraction", {
                    parts: [{ path: fractionPath }],
                    formatter: function (val) {
                        return parseFloat(val);
                    },
                    mode: sap.ui.model.BindingMode.OneWay
                }).bindProperty("color", {
                    parts: [{ path: modelName + ">" + chartDetailsPath + "/THRESHOLD" },
                           { path: modelName + ">" + chartDataPath + index + "/" + fractionFieldObj['FLDNM'] }],
                    formatter: function (arr, value) {
                        var str;
                        underscoreJS.each(arr, function (obj, i) {
                            var lVal = parseInt(obj['LOWVL']);
                            var hVal = parseInt(obj['HIGVL']);
                            if (value >= lVal && value <= hVal) {
                                str = commonUtils._findKey(global.vui5.cons.thresholds, obj['COLOR']);
                            }
                        });
                        return str;
                    },
                    mode: sap.ui.model.BindingMode.OneWay
                });

                refField = fractionFieldObj['RFFLD'];
                var refFieldPath;
            	if(refField)
                  refFieldPath = modelName + ">" + refField;
            	
            	
            	var params={
            			refFieldPath : refFieldPath,
            			valueFieldPath : fractionPath,
            			scaleFieldPath : scaleFieldPath,
            			property : 'fractionLabel',
            			chartData : harveyItem,
            			decimals: fractionFieldObj['DECIMALS']
                }
//            	 if (!underscoreJS.isEmpty(fractionFieldObj['RFFLD'])) {
//                     harveyItem.bindProperty("fractionScale", modelName + ">" + chartDataPath + index + "/" + fractionFieldObj['RFFLD'], null, sap.ui.model.Binding.OneWay)
//                      
//                  }
//                  else {
//                      harveyItem.setProperty("fractionScale", fractionFieldObj['SCALE']);
//                  }
            	oControl.currencyNScaleFormatter(params);
               
                return harveyItem;

            });

        }

        /*var oGrid = new sap.ui.layout.Grid({
          defaultSpan: "L12 M12 S12",
          content: [ new sap.m.Label({
              text: "Title"
          }),
          oChart
          ]
        });*/

        var oTile = new sap.m.GenericTile({
            header: "Tile Title",
            tileContent: [new sap.m.TileContent({
                content: [oChart]
            })]
        });

        //*****Rel 60E_SP6
        oChart.data("SUMID", chartDetails['SUMID']);
        oChart.attachEvent("press", function (oEvent) {
            var sumID = oEvent.getSource().data("SUMID"), params = {};
            params[vui5.cons.params.sumId] = sumID;
            var promise = oControl.fireOnNavigate({ params: params });
        });

        if (title && !underscoreJS.isEmpty(title)) {
            var box = new sap.m.FlexBox({
                direction: sap.m.FlexDirection.Column,
                items: [new sap.m.Label({
                    text: title
                }),
                        oChart]
            });
            this.setAggregation('microChartControl', box);
        }
        else {
            this.setAggregation('microChartControl', oChart);
        }
        //*****    

    };
    
    C.prototype.currencyNScaleFormatter = function(params){
    	var oControl = this,refFieldPath,valueFieldPath,scaleFieldPath,property,chartData,decimals;
    	    refFieldPath = params['refFieldPath'];
    	    valueFieldPath = params['valueFieldPath'];
    	    scaleFieldPath = params['scaleFieldPath'];
    	    property = params['property'];
    	    chartData = params['chartData'];
    	    decimals = params['decimals'];
    	    var parts = [
    	    	 {
                     path: valueFieldPath,
                     type: new sap.ui.model.type.Float({
                         decimals: decimals
                     }),
                     mode: sap.ui.model.BindingMode.OneWay
                 },
                 {
                 	  path: scaleFieldPath,
                       mode: sap.ui.model.BindingMode.OneWay
                 }
    	    ];
    	    if(refFieldPath){
    	    	parts.push({
    	    		
    	    		 path: refFieldPath,
                        mode: sap.ui.model.BindingMode.OneWay
    	    	})
    	    }
    	    chartData.bindProperty(property,{
        		parts:parts,
                formatter: function (value,scale,unit) {
                	/*** as  anything will be undefined sometimes**/  
                	 // return value + scale + "  "+unit;
                	
                	if(scale){
	          		  if(unit){
	          			return  value + scale+ unit;
	          		  }else{
	          			return  value + scale;
	          		  }
		           }
		            else{
		          		 if(unit){
		          			return value + unit;
		          		 }
		          		 else
		          			return value;
		          	  }
                  }
    	        /***/
    	    },sap.ui.model.BindingMode.OneWay);
    	    
//    	    chartData.bindProperty(property,{
//        		parts: [
//                    {
//                        path: refFieldPath,
//                        mode: sap.ui.model.BindingMode.OneWay
//                    },
//                    {
//                        path: valueFieldPath,
//                        type: new sap.ui.model.type.Float({
//                            decimals: decimals
//                        }),
//                        mode: sap.ui.model.BindingMode.OneWay
//                    },
//                    {
//                    	  path: scaleFieldPath,
//                          mode: sap.ui.model.BindingMode.OneWay
//                    }
//                  ],
//                  formatter: function (value,scale,unit) {
//                	  
//                	  return value + scale + "  "+unit;
//                	  
////                	  if(scale){
////                		  if(unit){
////                			return  value + scale+ unit;
////                		  }else{
////                			return  value + unit;
////                		  }
////                	  }
////                	  else{
////                		 if(unit){
////                			return value + unit;
////                		 }
////                		 else
////                			return value;
////                	  }
//                	  
//                  }
//        		
//        	},sap.ui.model.BindingMode.OneWay)
    	    
    }
    return C;
}, true);