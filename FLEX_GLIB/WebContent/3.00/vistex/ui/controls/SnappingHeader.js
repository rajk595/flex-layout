sap.ui.define([
    "sap/ui/core/Control",
    vistexConfig.rootFolder + "/ui/core/global",
    vistexConfig.rootFolder + "/ui/core/underscore-min",
    vistexConfig.rootFolder + "/ui/core/Formatter"
], function (control, global, underscoreJS, Formatter) {

    var S = control.extend(vistexConfig.rootFolder + ".ui.controls.SnappingHeader", {
        metadata: {
            properties: {
                controller: {
                    type: "object",
                    defaultValue: null
                },
                sectionId: {
                    type: "string"
                },

                modelName: {
                    type: "string",
                    defaultValue: null
                },
                facetGroupsPath: {
                    type: "string",
                    defaultValue: null
                },
                dataPath: {
                    type: "string",
                    defaultValue: null
                },
                chartDetailsPath: {
                    type: "string",
                    defaultValue: null
                },
                chartDataPath: {
                    type: "string",
                    defaultValue: null
                },
                fieldsPath: {
                    type: "string",
                    defaultValue: null
                },
                titlePath: {
                    type: "string",
                    defaultValue: null
                }
            },
            events: {},

            aggregations: {}

        },
        renderer: function (oRM, oControl) {
            oRM.write("<div");
            oRM.writeControlData(oControl);
            oRM.write(">");
            oRM.write("</div>");
        }
    });

    S.prototype.setModelName = function (value) {
        this.setProperty("modelName", value, true);
    };

    S.prototype.setDataPath = function (value) {
        this.setProperty("dataPath", value, true);
    };
    S.prototype.setFacetGroupsPath = function (value) {
        this.setProperty("facetGroupsPath", value, true);
    };

    S.prototype.setFieldsPath = function (value) {
        this.setProperty("fieldsPath", value, true);
    };
    S.prototype.setTitlePath = function (value) {
        this.setProperty("titlePath", value, true);
    };
    S.prototype.setChartDetailsPath = function (value) {
        this.setProperty("chartDetailsPath", value, true);
    };
    S.prototype.setChartDataPath = function (value) {
        this.setProperty("chartDataPath", value, true);
    };
    S.prototype.setController = function (value) {
        this.setProperty("controller", value, true);
    };
    S.prototype.setSectionId = function (value) {
        this.setProperty("sectionId", value, true);
    };


    S.prototype.snappingHeaderProcess = function (cfg) {
        var oControl = this, model, facetGroups, hLayout;
        model = oControl.getModel(oControl.getModelName());
        facetGroups = model.getProperty(oControl.getFacetGroupsPath());

        hLayout = new sap.m.HBox({

        }).addStyleClass("vuiDynamicHeaderContent")
          .addStyleClass("sapUxAPObjectPageHeaderContent");
        
        underscoreJS.each(facetGroups, function (obj, index) {
            switch (obj['FCTTP']) {
                case global.vui5.cons.facetGroups.formFacet:
                    element = oControl.getFormFacet(obj);
                    break;
                case global.vui5.cons.facetGroups.keyValueFacet:
                    element = oControl.getKeyValueFacet(obj, hLayout);
                    break;
                case global.vui5.cons.facetGroups.chartFacet:
                    element = oControl.getChartFacet(obj);
                    break;
            }

            if (element) {
                element.addStyleClass("sapUxAPObjectPageHeaderContentItem");
                //hLayout.addContent(element);
                hLayout.addItem(element);
            }
        });

        cfg.objectPageLayout.addHeaderContent(hLayout);

        this.snappingHeaderRef = oControl;
    };

    S.prototype.getFormFacet = function (facetGrp) {
        var oControl = this;
        var dataPath = oControl.getDataPath();
        var model = oControl.getModel(oControl.getModelName());
        var modelName = oControl.getModelName();
        var fieldsPath = oControl.getFieldsPath();
        var fields = model.getProperty(fieldsPath);
        var formFields = fields.filter(function (obj, index) {
            if (obj['FCTID'] == facetGrp['FCTID']) {
                // obj['INDEX'] = index;
                return obj;
            }
        });
        var fDataPath = "/DATA/" + facetGrp['DARID'] + "/";
        //var formFields = underscoreJS.where(fields,{GRP_ID :facetGrp['GRP_ID']});
        var formLayout = new sap.m.VBox();
        underscoreJS.each(formFields, function (obj, index) {
            var index = underscoreJS.findIndex(fields, obj);
            //var currentFieldPath = modelName + ">" + fieldsPath + obj["INDEX"] + "/";
            var currentFieldPath = modelName + ">" + fieldsPath + index + "/";
            if(obj['ELTYP'] === global.vui5.cons.element.objectStatus){
            	var ele = oControl.prepareObjectStatus(obj,fDataPath);
            }
            else if (obj['ELTYP'] === global.vui5.cons.element.link || obj['ELTYP'] == global.vui5.cons.element.progressIndicator) {
                var ele = oControl.linkPrepare(currentFieldPath, obj, fDataPath);
            }
            else {
                var ele = oControl.attributePrepare(currentFieldPath, obj, fDataPath);
            }
            formLayout.addItem(ele);
        });
        return formLayout;
    };
    S.prototype.prepareObjectStatus = function(obj,dataPath){
    	var oControl = this,metadata,template,metadataObj,fldname,icon,active,label,state;
	    	metadata = obj['METADATA'];
	   	    metadataObj = JSON.parse(metadata);
		    fldname = metadataObj['TEXT_FIELD'];
		    icon = metadataObj['ICON_FIELD'];
		    active = metadataObj['ACTIVE'] == "X" ? true :false;
		    label = metadataObj['TITLE_FIELD'];
		    state = metadataObj['STATE_FIELD'];
		    path1 = obj['FLDNAME'];
		    if ((obj['SDSCR'] === global.vui5.cons.fieldValue.description ||
		          obj['SDSCR'] === global.vui5.cons.fieldValue.value_cont_descr) && obj['TXTFL']) {
	              path1 = obj['TXTFL'];
	          }
 	       template = new sap.m.ObjectStatus({
 	    	   active : active
		   	}).bindProperty("text",modelName + ">" + dataPath + fldname,null,bindingMode)
		   	.bindProperty("icon",modelName + ">" + dataPath + icon,null,bindingMode)
		   	.bindProperty("state", modelName + ">" + dataPath + state, function (val) {
		                   if (val === global.vui5.cons.stateConstants.Error) {
		                   	return sap.ui.core.ValueState.Error;
		                   }
		                   else if(val === global.vui5.cons.stateConstants.Warning){
		                   	return sap.ui.core.ValueState.Information;
		                   	
		                   }else if(val === global.vui5.cons.stateConstants.None){
		                   	return sap.ui.core.ValueState.None;
		                   	
		                   }else if(val === global.vui5.cons.stateConstants.Success){
		                   	return sap.ui.core.ValueState.Success;
		                   }
		                   else{
                           	return sap.ui.core.ValueState.None;
                           }
		               }, sap.ui.model.BindingMode.OneWay);
 	      template.data("fieldname", path1);
          template.data("fieldInfo",obj);
          if(label)
         	 template.bindProperty('title',modelName + ">" + label,null,bindingMode);
      	  if(active)
      		template.attachPress(oControl.onFieldClick, oControl);
 	       return template;
    	
    };

    S.prototype.linkPrepare = function (currentFieldPath, obj, fDataPath) {
        var oControl = this;
        // var  dataPath = oControl.getDataPath();
        var dataPath = fDataPath;
        var refPath, attr, txtflPath;
        var fieldPath = currentFieldPath;
        var modelName = oControl.getModelName();
        var model = oControl.getModel(modelName);
        var dataareaID = dataPath.split("/")[2];
        var valuePath = modelName + ">" + dataPath + obj['FLDNAME'];
        var layout = new sap.m.HBox();

        var title = new sap.m.Label();
        title.bindProperty("text", {
            path: currentFieldPath + "LABEL",
            formatter: function (val) {
                return val + ":  ";
            },
            mode: sap.ui.model.BindingMode.OneWay
        });
        layout.addItem(title);
        var element;
        if (obj['ELTYP'] == global.vui5.cons.element.progressIndicator) {
            var txtPath;
            if (field['TXTFL'])
                txtPath = modelName + ">" + dataPath + obj['TXTFL'];
            else
                txtPath = valuePath;
            element = new sap.m.ProgressIndicator({
                visible: visible,
                //*****Rel 60E_SP6
                state: sap.ui.core.ValueState.Success
                //*****
            }).bindProperty("displayValue", {
                parts: [{ path: txtPath }
                ],
                formatter: function (val) {
                    return parseFloat(val) + "%";
                },
                mode: sap.ui.model.BindingMode.OneWay
            }).bindProperty("percentValue", {
                parts: [{ path: txtPath }
                ],
                formatter: function (val) {
                    return parseFloat(val);
                },
                mode: sap.ui.model.BindingMode.OneWay
            })

        }
        else {
            //*****Rel 60E_SP6
            if (obj['TXTFL'])
                valuePath = modelName + ">" + dataPath + obj['TXTFL'];
            //*****
            element = new sap.m.Link({
                text: {
                    path: valuePath,
                    mode: sap.ui.model.Binding.OneWay
                },
                active: true,
                press: [this.onFieldClick, this]
            });
            element.data("fieldname", obj['FLDNAME']);
            element.data("fieldInfo", obj);

        }
        layout.addItem(element);
        layout.bindProperty("visible", currentFieldPath + "NO_OUT", function (val) {
            return val === "";
        }, sap.ui.model.BindingMode.OneWay);

        return layout;
    };

    S.prototype.attributePrepare = function (currentFieldPath, obj, fDataPath) {
        var oControl = this;
        // var  dataPath = oControl.getDataPath();
        var dataPath = fDataPath;
        var refPath, attr, txtflPath;
        var fieldPath = currentFieldPath;
        var modelName = oControl.getModelName();
        var model = oControl.getModel(modelName);
        var dataareaID = dataPath.split("/")[2];
        valuePath = modelName + ">" + dataPath + obj['FLDNAME'];
        if (obj['ELTYP'] === global.vui5.cons.element.dropDown) {
            attr = new sap.m.ObjectStatus({
                text: {
                    parts: [
                            { path: valuePath, mode: sap.ui.model.BindingMode.OneWay },
                            { path: fieldPath, mode: sap.ui.model.BindingMode.OneWay }
                    ],
                    formatter: function (value, fieldInfo) {
                        return Formatter.valueText.call(this, value, fieldInfo, dataareaID);
                    },
                    mode: sap.ui.model.Binding.OneWay

                }
            });
        }

        else if (obj['DATATYPE'] === global.vui5.cons.dataType.amount) {
            refPath = modelName + ">" + dataPath + obj['CFIELDNAME'];

            if (obj['TXTFL'] !== '') {
                txtflPath = modelName + ">" + dataPath + obj['TXTFL'];
            } else {
                txtflPath = valuePath;
            }
            attr = new sap.m.ObjectStatus({
                text: {
                    parts: [
                            { path: txtflPath, mode: sap.ui.model.BindingMode.OneWay },
                            { path: refPath, mode: sap.ui.model.BindingMode.OneWay }
                    ]
                }
            });
        } else if (obj['DATATYPE'] === global.vui5.cons.dataType.quantity) {
            refPath = modelName + ">" + dataPath + obj['QFIELDNAME'];

            if (obj['TXTFL'] !== '') {
                txtflPath = modelName + ">" + dataPath + obj['TXTFL'];
            } else {
                txtflPath = valuePath;
            }
            attr = new sap.m.ObjectStatus({
                text: {
                    parts: [
                            { path: txtflPath, mode: sap.ui.model.BindingMode.OneWay },
                            { path: refPath, mode: sap.ui.model.BindingMode.OneWay }
                    ]
                }
            });
        } else if (obj['DATATYPE'] === global.vui5.cons.dataType.decimal ||
                   obj['DATATYPE'].substr(0, 3) === global.vui5.cons.dataType.integer) {
            if (obj['TXTFL'] != '') {
                txtflPath = modelName + ">" + dataPath + obj['TXTFL'];
            } else {
                txtflPath = valuePath;
            }
            attr = new sap.m.ObjectStatus({
                text: {
                    parts: [
                        { path: txtflPath, mode: sap.ui.model.BindingMode.OneWay }
                    ]
                }
            });
        } else if (obj['DATATYPE'] === global.vui5.cons.dataType.date) {
            attr = new sap.m.ObjectStatus({
                text: {
                    path: valuePath,
                    mode: sap.ui.model.Binding.OneWay,
                    formatter: Formatter.dateFormat
                }
            });
        }
            //*****Rel 60E_SP6
        else if (obj['DATATYPE'] === global.vui5.cons.dataType.time) {
            attr = new sap.m.ObjectStatus({
                text: {
                    path: valuePath,
                    mode: sap.ui.model.Binding.OneWay,
                    formatter: Formatter.timeFormatter
                }
            });
        }
            //*****
        else {
            attr = new sap.m.ObjectStatus({
                text: {
                    path: valuePath,
                    mode: sap.ui.model.Binding.OneWay
                }
            });

            //*****Rel 60E_SP7
            if(!underscoreJS.isEmpty(obj['MULTISELECT']) && underscoreJS.isEmpty(obj["MVLFLD"])) {
            	var descriptionPath = valuePath + global.vui5.cons.multiValueField;
            	attr.bindProperty("text", descriptionPath, function(mulVal) {            		
            		if(mulVal) {
            			var text;
            			if(obj['SDSCR'] !== vui5.cons.fieldValue.value && !underscoreJS.isEmpty(obj["TXTFL"])) {            				
        					text = underscoreJS.pluck(mulVal, obj["TXTFL"]).join(",")	            					
        				}            					            				
        				else {            						
        					text = underscoreJS.pluck(mulVal, obj["FLDNAME"]).join(",")            					
        				}       
            			return text;
            		}
            	}, sap.ui.model.Binding.OneWay);
            } 
            else {
            //*****            
                if (obj['SDSCR'] == global.vui5.cons.fieldValue.description || obj['SDSCR'] == global.vui5.cons.fieldValue.value_cont_descr) {
                	var descriptionPath = modelName + ">" + dataPath + obj['TXTFL'];
                    attr.bindProperty("text", descriptionPath, null, sap.ui.model.Binding.OneWay);
                }
                else if (obj['SDSCR'] == global.vui5.cons.fieldValue.value_descr) {

                	var descriptionPath = modelName + ">" + dataPath  + obj['TXTFL'];
                    attr.bindProperty("text", {
                        parts: [
                           { path: valuePath },
                           { path: descriptionPath }
                        ],
                        formatter: Formatter.valueDescr,
                        mode: sap.ui.model.Binding.OneWay

                    });
                }
            //*****Rel 60E_SP7
            }	
            //*****

        }
        if (obj["ELTYP"] !== global.vui5.cons.element.link) {
            attr.bindProperty("state", {
                parts: [
                   { path: valuePath },
                   { path: currentFieldPath }
                ],
                formatter: Formatter.stateText,
                mode: sap.ui.model.Binding.OneWay

            });
        }
        if (obj['HDLBL'] == '') {
            attr.bindProperty("title", currentFieldPath + "LABEL", null, sap.ui.model.BindingMode.OneWay);
        }
        attr.bindProperty("visible", currentFieldPath + "NO_OUT", function (val) {
            return val === "X" ? false : true;

        }, sap.ui.model.BindingMode.OneWay);

        attr.setModel(oControl.getModel(global.vui5.modelName), global.vui5.modelName);
        attr.setModel(model, oControl.getModelName());
        return attr;
    };

    S.prototype.getKeyValueFacet = function (facetGrp, hLayout) {
        var oControl = this;
        var dataPath = oControl.getDataPath();
        var model = oControl.getModel(oControl.getModelName());
        var modelName = oControl.getModelName();
        var fieldsPath = oControl.getFieldsPath();
        var dataPath = oControl.getDataPath();
        var fields = model.getProperty(fieldsPath);
        var numberPath, numberUnitPath;
        if (facetGrp['SMVIW'] && facetGrp['SUMID']) {
            oControl.prepareSummaryKeyValue(facetGrp, hLayout);
            return;
        }
        var keyFields = fields.filter(function (obj, index) {
            if (obj['FCTID'] == facetGrp['FCTID']) {
                obj['INDEX'] = index;
                return obj;
            }
        });
        var kDataPath = "/DATA/" + facetGrp['DARID'] + "/";

        underscoreJS.each(keyFields, function (obj, index) {
            var keyLayout = new sap.m.VBox;
            var numeric;
            if(obj['ELTYP'] === global.vui5.cons.element.objectStatus){
            	numeric = oControl.prepareObjectStatus(obj,fDataPath);
            	keyLayout.addItem(numeric);
            	this.addItem(keyLayout);
            	return;
            }
            else if (obj['ELTYP'] == global.vui5.cons.element.progressIndicator) {
                var txtPath;
                if (field['TXTFL'])
                    txtPath = modelName + ">" + dataPath + obj['TXTFL'];
                else
                    txtPath = modelName + ">" + dataPath + obj['FLDNAME'];
                numeric = new sap.m.ProgressIndicator({
                    visible: visible,
                    //*****Rel 60E_SP6
                    state: sap.ui.core.ValueState.Success
                    //*****
                }).bindProperty("displayValue", {
                    parts: [{ path: txtPath }
                    ],
                    formatter: function (val) {
                        return parseFloat(val) + "%";
                    },
                    mode: sap.ui.model.BindingMode.OneWay
                }).bindProperty("percentValue", {
                    parts: [{ path: txtPath }
                    ],
                    formatter: function (val) {
                        return parseFloat(val);
                    },
                    mode: sap.ui.model.BindingMode.OneWay
                })
                //.bindProperty("percentvalue",modelName + ">" + dataPath + obj['FLDNAME'] , null, sap.ui.model.BindingMode.OneWay);
            } else {

                numeric = oControl.keyValuePrepare(obj, kDataPath);
            }
            if (obj['HDLBL'] == '' && obj['NO_OUT'] != "X") {
                var currentFieldPath = modelName + ">" + fieldsPath + obj["INDEX"] + "/";
                var label = new sap.m.ObjectStatus();
                label.bindProperty("title", currentFieldPath + "LABEL", null, sap.ui.model.BindingMode.OneWay);
                label.bindProperty("visible", currentFieldPath + "NO_OUT", function (val) {
                    return val === "X" ? false : true;
                }, sap.ui.model.BindingMode.OneWay);
            }
            numeric.bindProperty("visible", currentFieldPath + "NO_OUT", function (val) {
                return val === "X" ? false : true;
            }, sap.ui.model.BindingMode.OneWay);

            keyLayout.addItem(label);
            keyLayout.addItem(numeric);
            keyLayout.addStyleClass("sapUxAPObjectPageHeaderContentItem");
            //this.addContent(keyLayout);
            this.addItem(keyLayout);
        }, hLayout);

    };

    S.prototype.prepareSummaryKeyValue = function (facetGrp, hLayout) {
        var oControl = this;
        var dataPath = oControl.getDataPath();
        var model = oControl.getModel(oControl.getModelName());
        var modelName = oControl.getModelName();
        var sumDataPath = oControl.getChartDetailsPath();
        var sumID = "V" + facetGrp['SMVIW'] + "__" + facetGrp['SUMID'];
        var sumData = model.getProperty(sumDataPath);
        var sumDataExists = underscoreJS.find(sumData, { "SUMID": sumID });
        if (sumDataExists) {
            var fieldName = sumDataExists['FIELDS'][0]['FLDNM'];
            var currDataPath = modelName + ">/DATA/" + sumID + "/0/" + fieldName;
            var keyLayout = new sap.m.VBox();
            var label = new sap.m.ObjectStatus({ title: sumDataExists['FIELDS'][0]['DESCR'] })
            var numeric = new sap.m.ObjectNumber().bindProperty("number", currDataPath, null, sap.ui.model.BindingMode.OneWay);
            keyLayout.addItem(label);
            keyLayout.addItem(numeric);
            //hLayout.addContent(keyLayout);
            hLayout.addItem(keyLayout);
        }
    };

    S.prototype.keyValuePrepare = function (obj, kDataPath) {
        var oControl = this;
        //var  dataPath = oControl.getDataPath();
        var dataPath = kDataPath;
        var model = oControl.getModel(oControl.getModelName());
        var modelName = oControl.getModelName();
        var fieldsPath = oControl.getFieldsPath();
        var dataPath = oControl.getDataPath();
        var fields = model.getProperty(fieldsPath);
        var numberPath, numberUnitPath;
        var numberPath, formatter;

        var numeric = new sap.m.ObjectNumber();

        var currentFieldPath = modelName + ">" + fieldsPath + obj["INDEX"] + "/";
        var dPath = modelName + ">" + dataPath;


        if (obj['CFIELDNAME'] != "") {
            numberUnitPath = dPath + obj['CFIELDNAME'];
        } else if (obj['QFIELDNAME'] != "") {
            numberUnitPath = dPath + obj['QFIELDNAME'];
        }
        else if (obj['REF_FIELD'] != "") {
            numberUnitPath = dPath + obj['REF_FIELD'];
        }
        if (numberUnitPath) {
            numeric.bindProperty("unit", numberUnitPath);
        }
        //        if (obj['FLDNAME'] != "") {
        //            numberPath = currentFieldPath;
        //        }
        numeric.setModel(model, oControl.getModelName());
        numeric.setModel(oControl.getModel(global.vui5.modelName), global.vui5.modelName);

        var textField = obj['TXTFL'];
        var fieldName = obj['FLDNAME'];
        if (obj['DATATYPE'] == global.vui5.cons.dataType.amount || obj['DATATYPE'] == global.vui5.cons.dataType.quantity
            || obj['DATATYPE'] == global.vui5.cons.dataType.decimal || obj['DATATYPE'].substr(0, 3) == global.vui5.cons.dataType.integer) {
            if (textField != "") {
                numberPath = dPath + obj['TXTFL'];
            } else {
                numberPath = dPath + obj['FLDNAME'];
            }
            numeric.bindProperty("number", numberPath);
        } else if (obj['DATATYPE'] == global.vui5.cons.dataType.date) {
            numberPath = dPath + obj['FLDNAME'];
            formatter = Formatter.dateFormat;
            numeric.bindProperty("number", {
                path: numberPath,
                mode: sap.ui.model.Binding.OneWay,
                formatter: Formatter.dateFormat
            });
            // nValue = Formatter.dateFormat(data[fieldName], this);
        }
        //*****Rel 60E_SP6
        else if (obj['DATATYPE'] == global.vui5.cons.dataType.time) {
            numberPath = dPath + obj['FLDNAME'];
            formatter = Formatter.timeFormatter;
            numeric.bindProperty("number", {
                path: numberPath,
                mode: sap.ui.model.Binding.OneWay,
                formatter: Formatter.timeFormatter
            });
        }
        //*****        
        //*****Rel 60E_SP7
        else if(!underscoreJS.isEmpty(obj["MULTISELECT"]) && underscoreJS.isEmpty(obj["MVLFLD"])) {
        	var descriptionPath = dPath + obj['FLDNAME'] + global.vui5.cons.multiValueField;
        	numeric.bindProperty("number", descriptionPath, function(mulVal) {
        		if(mulVal) {
        			var text;
        			if(obj['SDSCR'] !== vui5.cons.fieldValue.value && !underscoreJS.isEmpty(obj["TXTFL"])) {            				
    					text = underscoreJS.pluck(mulVal, obj["TXTFL"]).join(",")	            					
    				}            					            				
    				else {            						
    					text = underscoreJS.pluck(mulVal, obj["FLDNAME"]).join(",")            					
    				}       
        			return text;
        		}
        	}, sap.ui.model.Binding.OneWay);
        }
        //*****        
        else if (obj['SDSCR'] == global.vui5.cons.fieldValue.description || obj['SDSCR'] == global.vui5.cons.fieldValue.value_cont_descr){
            //|| obj['SDSCR'] == global.vui5.cons.fieldValue.value_descr) {
        	var descriptionPath = dPath + obj['TXTFL'];
            numeric.bindProperty("number", descriptionPath, null, sap.ui.model.Binding.OneWay);
        }
                    else if (obj['SDSCR'] == global.vui5.cons.fieldValue.value_descr) {
            
                    	 var descriptionPath = dPath + obj['TXTFL'];
                        var valuePath = dPath + obj['FLDNAME'];
                        numeric.bindProperty("number", {
                            parts: [
                               { path: valuePath },
                               { path: descriptionPath }
                            ],
                            formatter: Formatter.valueDescr,
                            mode: sap.ui.model.Binding.OneWay
            
                        });
                    }
        else {
            numberPath = dPath + obj['FLDNAME'];
            numeric.bindProperty("number", numberPath);
        }
        //        numeric.bindProperty("number", {
        //            parts: [
        //               { path: dPath },
        //               { path: numberPath }
        //               //{path: false}
        //            ],
        //            mode: sap.ui.model.Binding.OneWay,
        //            formatter: snappingHeaderFormatter.objectNumericFormat
        //        });
        numeric.bindProperty("state", {
            parts: [
               { path: dPath + obj['FLDNAME'] },
               { path: currentFieldPath }
            ],
            formatter: Formatter.stateText,
            mode: sap.ui.model.Binding.OneWay

        });


        return numeric;

    };
    S.prototype.getChartFacet = function (obj) {
        var oControl = this, microChart;
        var oController = this.getController();
        var modelName = oControl.getModelName();
        var model = oControl.getModel(modelName);
        var sectionID = oControl.getSectionId();
        var sectionConfig = oController.sectionConfig[sectionID];
        var chartDetailsPath = oControl.getChartDetailsPath();
        var chartDataPath = oControl.getChartDataPath();

        var sumId = "F" + obj['SMVIW'] + "__" + obj['SUMID'];
        var chartDetails = underscoreJS.findWhere(model.getProperty(chartDetailsPath), { SUMID: sumId });
        var chartIndex = underscoreJS.findIndex(model.getProperty(chartDetailsPath), { SUMID: sumId });

        if (chartDetails && (chartDetails['CHTYP'] == global.vui5.cons.microcharts.radial || chartDetails['CHTYP'] == global.vui5.cons.microcharts.harvey ||
            chartDetails['CHTYP'] == global.vui5.cons.microcharts.column || chartDetails['CHTYP'] == global.vui5.cons.microcharts.comparison ||
            chartDetails['CHTYP'] == global.vui5.cons.microcharts.area || chartDetails['CHTYP'] == global.vui5.cons.microcharts.delta ||
            chartDetails['CHTYP'] == global.vui5.cons.microcharts.bullet || chartDetails['CHTYP'] == global.vui5.cons.microcharts.stacked_bar)) {

            var section = oController.getSectionBy("SECTN", sectionID);
            if (sectionConfig.attributes[global.vui5.cons.attributes.onClick]) {
                sectionConfig.onClick = underscoreJS.findWhere(section['FUNC'], {
                    FNCNM: sectionConfig.attributes[global.vui5.cons.attributes.onClick]
                });
            }

            microChart = new global.vui5.ui.controls.MicroChartControl({
                controller: oController,
                modelName: modelName,
                chartDetailsPath: chartDetailsPath + chartIndex,
                chartDataPath: chartDataPath + chartDetails['SUMID'] + "/",
                title: model.getProperty(chartDetailsPath + chartIndex + "/DESCR"),
                onNavigate: function (oEvent) {
                    var params = oEvent.getParameter("params");
                    oController.processAction(sectionID, sectionConfig.onClick, null, params);
                }
            });
            microChart.chartObjectGet();

            if (microChart) {
                return microChart.getAggregation("microChartControl");
            }
        }

    };

    S.prototype.onFieldClick = function (oEvent) {
        var oControl = this;
        if (!oEvent.mParameters) {
            oEvent.mParameters = {};
        }
        var params = {};
        var fieldInfo = oEvent.getSource().data("fieldInfo");
        params[global.vui5.cons.params.fieldName] = oEvent.getSource().data("fieldname") || "";
        oEvent.mParameters['urlParams'] = params;
        oEvent.mParameters['fieldInfo'] = fieldInfo;
        this.snappingHeaderRef.preProcessFieldClickEvent(oEvent);
    };
    return S;

});