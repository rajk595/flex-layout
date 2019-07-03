sap.ui.define([
    "sap/ui/core/Control",
    vistexConfig.rootFolder + "/ui/core/global",
    vistexConfig.rootFolder + "/ui/core/underscore-min"
], function (control, global, underscoreJs) {
    var A = control.extend(vistexConfig.rootFolder + ".ui.controls.Switch", {
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
                fields: {
                	type: "object",
                    defaultValue: null
                },
                switchButtons: {
                	type: "object",
                    defaultValue: null
                },
                switchFieldName: {
                	type: "string",
                    defaultValue: null
                },
                dataPath: {
                    type: "string",
                    defaultValue: null
                },
                editable: {
                	type: "boolean",
                    defaultValue: false
                },
            },
            events: {
            	fieldEvent: {
                    parameters: {
                        selectionSet: {
                            type: "sap.ui.core.Control[]"
                        }
                    }
                },
            	valueHelpRequest: {},
            	switchChange: {}
            },
            aggregations: {
                _getSwitch: {
                    type: "sap.ui.core.Control",
                    multiple: false,
                    visibility: "hidden"
                }
            }
        },
        init: function () {
            this._oBundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls");
        },

        renderer: function (oRM, oControl) {
            oRM.write("<div");
            oRM.writeControlData(oControl);
            oRM.write(">");
            oRM.renderControl(oControl.getAggregation("_getSwitch"));
            oRM.write("</div>");
        }
    });

    A.prototype.setModelName = function (value) {
        this.setProperty("modelName", value, true);
    };

    A.prototype.setFields = function (value) {
        this.setProperty("fields", value, true);
    };
    
    A.prototype.setSwitchButtons = function (value) {
        this.setProperty("switchButtons", value, true);
    };
    
    A.prototype.setSwitchFieldName = function (value) {
        this.setProperty("switchFieldName", value, true);
    };
    
    A.prototype.setDataPath = function (value) {
        this.setProperty("dataPath", value, true);
    };

    A.prototype.switchControlPrepare = function () {
        var oControl = this, oController, modelName, model, fields, switchButtons, switchFieldName, dataPath;
        oController = oControl.getController();
        modelName = oControl.getModelName();
        model = oController.getModel(modelName);
        dataPath = oControl.getDataPath();
        fields = oControl.getFields();
        switchButtons= oControl.getSwitchButtons();                        
        switchFieldName = oControl.getSwitchFieldName();
        
        if(fields) {        	
        	var items = [];
        	underscoreJS.each(fields, function(field, i){
        		var selection
        		switch(field['ELTYP']) {
     	    	   case vui5.cons.element.input:
     		    	   if (field['DATATYPE'] == vui5.cons.dataType.date) {
     			    	   selection = new sap.m.DatePicker({
                             placeholder: " ",
                             valueFormat: vui5.cons.date_format,          
                             editable: "{= ${" + global.vui5.modelName + ">/DOCUMENT_MODE} !== 'A' }",
                             change: [oControl.dateFieldChange, oControl],                              
                           }).bindProperty("visible", {
                     	      parts: [{path: modelName + ">" + dataPath + switchFieldName}], 
                     	      formatter: function(swfld){
                       		     if(swfld) {
                       		    	var switchField = underscoreJS.find(switchButtons, {"SWFLD": swfld}); 		       
                   			        return switchField['FLDNAME'] === field['FLDNAME'] ? true : false; 
                       		     }                     	    	   
                     	      },
                     	      mode: sap.ui.model.BindingMode.OneWay                                   	   
                           });
     				   
     				       selection.bindProperty("displayFormat", global.vui5.modelName + ">" + global.vui5.cons.modelPath.sessionInfo + "/DATFM", Formatter.displayFormat, sap.ui.model.Binding.OneWay);
                           selection.bindValue(modelName + ">" + dataPath + field['FLDNAME']);
     			       }
     			     break;
     		      case vui5.cons.element.valueHelp:
     			       selection = new sap.m.Input({
                         showValueHelp: true,                         
                         maxLength: parseInt(field['OUTPUTLEN']),
                         editable: "{= ${" + global.vui5.modelName + ">/DOCUMENT_MODE} !== 'A' }",
                         valueHelpRequest: oControl.onValueHelpRequest.bind(oControl)
                       }).bindProperty("visible", {
                 	      parts: [{path: modelName + ">" + dataPath + switchFieldName}], 
             	          formatter: function(swfld) {             	        
             	        	  if(swfld) {
             	        		 var switchField = underscoreJS.find(switchButtons, {"SWFLD": swfld}); 		       
               			         return switchField['FLDNAME'] === field['FLDNAME'] ? true : false;  
             	        	  }             	        	  
             	          },
             	          mode: sap.ui.model.BindingMode.OneWay                                   	   
                       }).bindValue(modelName + ">" + dataPath + field['FLDNAME']);
     			       selection.data('fieldInfo', field);
     			       oControl.bindTypeAheadField(oController, selection);
     			     break;
     	      	}
        		items.push(selection);
        	});
        	
        	var oFieldsFlex = new sap.m.FlexBox({
        		items: items
        	}).setModel(model,modelName)        	        
        	
        	var oSwitchButton = new sap.m.Button({
        		type: sap.m.ButtonType.Transparent,
        		visible: "{= ${" + global.vui5.modelName + ">/DOCUMENT_MODE} !== 'A' }",
        		press: [oControl.onSwitch, oControl]
        	}).bindProperty("icon", {
        		parts: [{path: modelName + ">" + dataPath + switchFieldName}],
        	    formatter: function(swfld) {
        	    	if(swfld) {
        	    		var switchField = underscoreJS.find(switchButtons, {"SWFLD": swfld});
             		    if(switchField) {
             			   return switchField['ICON'];
             		    }	
        	    	}        	    	
        	    },
        	    mode: sap.ui.model.BindingMode.OneWay
        	}).bindProperty("tooltip", {
        		parts: [{path: modelName + ">" + dataPath + switchFieldName}],
        	    formatter: function(swfld) {
        	    	if(swfld) {
        	    		var switchField = underscoreJS.find(switchButtons, {"SWFLD": swfld});
             		    if(switchField) {
             			   return switchField['TOOLTIP'];
             		    }	
        	    	}        	    	
        	    },
        	    mode: sap.ui.model.BindingMode.OneWay
        	});
        	
        	
        	var oFlex = new sap.m.FlexBox({
        		items: [oFieldsFlex, oSwitchButton]
        	});        	        	        	        	
        	
        	oControl.setAggregation("_getSwitch", oFlex);
        }                                 
        
    };
         
    A.prototype.onSwitch = function () {
    	var oControl = this, oController, modelName, model, dataPath, switchButtons, switchFieldName, 
    	    prevSwitch, presSwitch, promise;
    	oController = oControl.getController();
    	modelName = oControl.getModelName();
    	model = oController.getModel(modelName);
    	dataPath = oControl.getDataPath();
    	switchButtons = oControl.getSwitchButtons();
    	switchFieldName = oControl.getSwitchFieldName();    	    	
    	    	    	    	    	
    	prevSwitch = underscoreJS.findWhere(switchButtons, {"SWFLD": model.getProperty(dataPath + switchFieldName)});
    	presSwitch = underscoreJS.first(underscoreJS.reject(switchButtons, {"SWFLD": prevSwitch['SWFLD']}));    	    	
    	
    	var promise = oControl.fireSwitchChange({switchField: presSwitch['SWFLD']});
    	return;
    	
    	if(presSwitch) {
    		model.setProperty(dataPath + prevSwitch['FLDNAME'], "")
    		model.setProperty(dataPath + switchFieldName, presSwitch['SWFLD']);
    	}
    	    	    	
    };    
    
    A.prototype.dateFieldChange = function (oEvent) {
    	var oSource = oEvent.getSource();
    	var oController = this.getController();
        if (oEvent.getParameter("valid")) {
            oSource.setValueState(sap.ui.core.ValueState.None);
            oSource.setValueStateText("");
            oController._handleCheckFieldsMessages(
                "",
                "",
                oSource.getId() + "/value");
        } else {
            oSource.setValueState(sap.ui.core.ValueState.Error);
            var text = 'Date';
            var errorText = this._oBundle.getText("EnterValid", [text]);
            oSource.setValueStateText(errorText);
            oController._handleCheckFieldsMessages(
                errorText,
                sap.ui.core.MessageType.Error,
                oSource.getId() + "/value");
        }
    };
    
    A.prototype.onValueHelpRequest = function (oEvent) {
        var oControl = this, fieldInfo;
        fieldInfo = oEvent.getSource().data("fieldInfo");
        this.fireValueHelpRequest({
            oEvent: oEvent,
            fieldInfo: fieldInfo
        });
    };
    
    A.prototype.bindTypeAheadField = function (oController, selection) {
        var oControl = this, oController, model, fieldInfo;
        oController = this.getController();
        model = oController.getModel(this.getModelName());        
        fieldInfo = selection.data("fieldInfo");
        
        selection.setShowSuggestion(true);
        selection.setFilterSuggests(false);
        if (fieldInfo['INTLEN'] == 1) {
            selection.setStartSuggestion(1);
        }
        else {
            selection.setStartSuggestion(2);
        }
        selection.setMaxSuggestionWidth("50%");
        selection.attachSuggest(this.handleWorklistTypeAhead.bind(this));
        if (fieldInfo['MULTISELECT'] != 'X') {
            selection.attachSuggestionItemSelected(this.handleWorklistSuggestItemSelected.bind(this));
        }
        selection.bindAggregation("suggestionColumns", global.vui5.modelName + ">/TYPEAHEAD/" + fieldInfo['FLDNAME'] + "/FIELDS", function (sid, oContext) {
            var contextObject = oContext.getObject();
            return new sap.m.Column({
                header: new sap.m.Text({
                    text: contextObject['LABEL']
                })
            });
        });
        selection.bindAggregation("suggestionRows", global.vui5.modelName + ">/TYPEAHEAD/" + fieldInfo['FLDNAME'] + "/DATA", function (sid, oContext) {
            var contextObject = oContext.getObject();
            var model = oController.getModel(global.vui5.modelName);
            var fields = model.getProperty("/TYPEAHEAD/" + fieldInfo['FLDNAME'] + "/FIELDS");
            var cells = [];
            underscoreJS.each(fields, function (obj) {
                var label = new sap.m.Label({
                    text: contextObject[obj['FLDNAME']]
                });
                cells.push(label);
            });
            var listItem = new sap.m.ColumnListItem({
                vAlign: sap.ui.core.VerticalAlign.Middle,
                cells: cells
            });
            return listItem;
        });      
    };
    
    A.prototype.handleWorklistTypeAhead = function (oEvent) {
        var oControl = this, fieldInfo;    	        
        fieldInfo = oEvent.getSource().data("fieldInfo");
        
        this.fireFieldEvent({
            oEvent: oEvent,
            fieldInfo: fieldInfo,
            fieldValue: oEvent.getParameter('suggestValue'),
            eventType: global.vui5.cons.fieldSubEvent.typeAhead
        });
    };
    
    A.prototype.handleWorklistSuggestItemSelected = function (oEvent) {
        var oControl = this, source, oController, fieldInfo, model;
        var item, rowData, returnField, descrField, mainModel;
    	oController = this.getController();
        source = oEvent.getSource();
        fieldInfo = oEvent.getSource().data("fieldInfo");
        
        item = oEvent.getParameter("selectedRow");
        rowData = item.getBindingContext(global.vui5.modelName).getObject();
        mainModel = oController.getModel(global.vui5.modelName);
        model = oController.getModel(this.getModelName());
        returnField = mainModel.getProperty("/TYPEAHEAD/" + fieldInfo['FLDNAME'] + "/RETURNFIELD");
        descrField = mainModel.getProperty("/TYPEAHEAD/" + fieldInfo['FLDNAME'] + "/DESCRFIELD");

        
        var path = source.getBinding("value").getPath();        
        if (fieldInfo['SDSCR'] === global.vui5.cons.fieldValue.value) {
            model.setProperty(path, rowData[returnField]);            
        }
        else if (fieldInfo['SDSCR'] === global.vui5.cons.fieldValue.description) {
            model.setProperty(path, rowData[descrField]);
        }
        else if (fieldInfo['SDSCR'] === global.vui5.cons.fieldValue.value_descr) {
            model.setProperty(path, rowData[returnField] + " (" + rowData[descrField] + ")");
        }
        else if (fieldInfo['SDSCR'] === global.vui5.cons.fieldValue.value_cont_descr) {
            model.setProperty(path, rowData[descrField] + " (" + rowData[returnField] + ")");
        }                          

        source.fireChange();
    };
    
});