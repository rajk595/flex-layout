sap.ui.define(["sap/ui/core/Control",
	           vistexConfig.rootFolder + "/ui/core/global",
	           vistexConfig.rootFolder + "/ui/core/underscore-min",
	           vistexConfig.rootFolder + "/ui/core/Formatter"
], function(control,global,underscoreJS,Formatter) {

  var A = control.extend(vistexConfig.rootFolder + ".ui.controls.Attributes", {
	  metadata: {
	    properties: {
          controller : {
            type : "object",
            defaultValue: null
          },
          modelName : {
            type: "string",
            defaultValue: null
          },
          dropdownModelName: {
        	type: "string",
            defaultValue: null  
          },
          sectionFieldPath: {
        	type: "string",
            defaultValue: null  
          },
          sectionDataPath: {
          	type: "string",
            defaultValue: null  
          },
          fieldsPath: {
            type: "string",
            defaultValue: null  
          },
          functionsPath: {
            type: "string",
            defaultValue: null  
          },
          effectiveDatePath: {
            type: "string",
            defaultValue: null  
          },
          attributeFieldname: {
            type: "string",
            defaultValue: null  
          },
          showCurrentAttrVal: {
            type: "string",
            defaultValue: null  
          },
          dataArea: {
            type: "string",
            defaultValue: null  
          },
	      sectionEditable:{
	        type : "boolean",
		    defaultValue : false
	      }
      },
      events: {},
      aggregations: {
        _Attributes: {
          type: "sap.ui.core.Control",
          multiple: false
        }

      }
    },

    init: function() {
    	
    },

    renderer: function(oRM, oControl) {
      oRM.write("<div");
      oRM.writeControlData(oControl);
      oRM.write(">");
      oRM.renderControl(oControl.getAggregation("_Attributes"));
      oRM.write("</div>");
    }
  });
  
  A.prototype.setController = function(value) {
	this.setProperty("controller",value,false);
  };

  A.prototype.setModelName = function(value) {
    this.setProperty("modelName",value,false);
  };

  A.prototype.setDropdownModelName = function(value) {
	this.setProperty("dropdownModelName",value,false);
  };
  
  A.prototype.setSectionFieldPath = function(value) {	
	 this.setProperty("sectionFieldPath",value,false);		  
  };
	
  A.prototype.setSectionDataPath = function(value) {
	 this.setProperty("sectionDataPath",value,false);
  };

  A.prototype.setFieldsPath = function(value) {
	 this.setProperty("fieldsPath",value,false);
  };

  A.prototype.setFunctionsPath = function(value) {
	 this.setProperty("functionsPath",value,false);
  };
  
  A.prototype.setEffectiveDatePath = function(value) {
     this.setProperty("effectiveDatePath",value,false);
  };
	  
  A.prototype.setAttributeFieldname = function(value) {
	 this.setProperty("attributeFieldname",value,false);
  };	 

  A.prototype.setDataArea = function(value) {
	 this.setProperty("dataArea",value,false);
  };	   
  
  A.prototype.setSectionEditable = function(value) {
	 this.setProperty("sectionEditable",value,false);
  };	   
  
  A.prototype.prepareAttributesControl = function() {        
	  
	  var oForm = this, oControl = this;
      var modelName = this.getModelName();
      var model = oControl.getModel(modelName);
      var mainModel = oControl.getModel(vui5.modelName);
      
      oForm.sectionFieldPath = this.getSectionFieldPath();     	 
      oForm.sectionDataPath = this.getSectionDataPath();
      oForm.fieldsPath = this.getFieldsPath();
      oForm.dataArea = this.getDataArea();
      oForm.sectionEditable = this.getSectionEditable();
      oForm.effectiveDatePath = this.getEffectiveDatePath();
      oForm.sectionFunPath = this.getFunctionsPath();
      oForm.attributeFieldName = this.getAttributeFieldname();
      oForm.showCurrentAttrVal = this.getShowCurrentAttrVal();
      oForm._oChangedRowsPath = [];           
      
      var overview_fields = model.getProperty(oForm.sectionFieldPath);
      var formFields = model.getProperty(oForm.fieldsPath);      
      var document_mode = mainModel.getProperty("/DOCUMENT_MODE");
      var dropDownModelName = this.getDropdownModelName();
      var contentData = [], bindingMode, lv_editable, lv_visible;
      var switchAction;
      if (document_mode === 'A') {
          var sectionFunctions = model.getProperty(oForm.sectionFunPath);
          var switchAction = underscoreJS.find(sectionFunctions, {FNCNM: 'SWITCH'});
      }      
      oForm.amountRef = [];      
      
      if (overview_fields) {
          underscoreJS.each(overview_fields, function (group, grpIndex) {
              var group_fields = underscoreJS.where(formFields, {
                  "FLGRP": group['FLGRP']
              });

              var visibleFields = underscoreJS.findWhere(group_fields, {
                  NO_OUT: ""
              });
              if (visibleFields) {
                  if (group['DESCR'] != "") {
                      contentData.push(new sap.ui.core.Title({
                          text: group['DESCR']
                      }));
                  } else if (group['FLGRP'] != '') {
                      contentData.push(new sap.ui.core.Title({
                          text: group['FLGRP']
                      }));
                  }

                  underscoreJS.each(group_fields, function (field, index) {

                  	if (field['ADTIDX'] && field['ADTIDX'] != ' ') {
                          var attributeIndex = field['ADTIDX'] - 1;
                          //****ESP5 20434 - Fiori Generic app approach - List - end
                          var attributePath = oForm.sectionDataPath + attributeIndex + "/";
                          var attributeRowPath = attributePath + "DATA/0/";
                          var drpdnPath = dropDownModelName + ">/DROPDOWNS/" + oForm.dataArea + "/" + field['FLDNAME'];
                          var fieldPath = oForm.fieldsPath + underscoreJS.findIndex(formFields, field) + "/";
                          var selection;
                      
                          if (field['ADFLD'] != 'X') {
                              if (oForm.sectionEditable) {
                                  bindingMode = sap.ui.model.BindingMode.TwoWay;
                              } else {
                                  bindingMode = sap.ui.model.BindingMode.OneWay;
                              }
                              lv_visible = "{= ${" + modelName + ">" + fieldPath + "NO_OUT} === '' }";
                              var selectionLabel = new sap.m.Label({
                                  //text: field['LABEL'],
                            	  text:"{" + modelName + ">" + fieldPath + "LABEL}",
                                  visible: lv_visible
                              });
                              if (field['REQUIRED'] == 'X')
                                  selectionLabel.setRequired(true);
                              contentData.push(selectionLabel);                                
                              
                              if (oForm.sectionEditable == false && !sap.ui.Device.system.phone) {

                                  if (field['DATATYPE'] == 'DATS') {
                                      selection = new sap.m.Text({
                                          text: {
                                              path: modelName + ">" + attributeRowPath + oForm.attributeFieldName,
                                              formatter: Formatter.dateFormat
                                          },
                                          visible: lv_visible
                                      });
                                  } else if (field['ELTYP'] == vui5.cons.element.dropDown) {
                                      /*** Rel 60E SP6 - Value is not visible in Display Mode - Start***/
                                      /*selection = new sap.m.Text({
                                          text: {
                                              parts: [{path: modelName + ">" + attributeRowPath + oForm.attributeFieldName},
                                                      {path: modelName + ">" + fieldPath + "FLDNAME"},
                                                      {path: dropDownModelName + ">/" + oForm.dataArea}],
                                              formatter: Formatter.valueText
                                          },
                                          visible: lv_visible
                                      });*/
                                      
                                      selection = new sap.m.Text({
                                          visible: visible,
                                          text: {
                                              formatter: function (value, dropdownData) {
                                                  return Formatter.dropdownDescriptionGet.call(this, value, dropdownData);
                                                  
                                              },
                                              parts: [{
                                                  path: modelName + ">" + attributeRowPath + oForm.attributeFieldName
                                              }, {
                                                  path: drpdnPath
                                              }]
                                          }
                                      });
                                      /*** Rel 60E SP6 - Value is not visible in Display Mode - End***/
                                  } else if (field['ELTYP'] == vui5.cons.element.checkBox) {
                                      selection = new sap.m.CheckBox({
                                          editable: false,
                                          visible: lv_visible,
                                          selected: "{= ${" + modelName + ">" + attributeRowPath + oForm.attributeFieldName + "} === 'X' }"
                                      });
                                  //*****Rel 60E_SP6 - Task #39097
                                  } else if(field['ELTYP'] == vui5.cons.element.toggle) {                                	  
                                	  selection = new sap.m.Switch({
                                          enabled: false,
                                          visible: lv_visible,
                                          state: "{= ${" + modelName + ">" + attributeRowPath + oForm.attributeFieldName + "} === 'X' }"
                                      });
                                  //*****
                                  } else {
                                      selection = new sap.m.Text({
                                          visible: lv_visible,
                                          maxLength: parseInt(field['OUTPUTLEN']),
                                      });
                                      oForm.handleDescriptionField(selection,
                                                                   field,
                                                                   fieldPath,
                                                                   attributeRowPath,
                                                                   oForm.attributeFieldName,
                                                                   bindingMode,
                                                                   "text",
                                                                   document_mode,
                                                                   oForm.sectionEditable);
                                  }
                                  selection.addStyleClass("dmrAttributes");
                                  contentData.push(selection);
                                  oForm.showDescription(attributeRowPath,
                                                        field,
                                                        contentData,
                                                        lv_visible,
                                                        fieldPath,
                                                        attributePath);
                              } else {                                    
                              	if (field['DATATYPE'] == vui5.cons.dataType.date ||
                                      field['DATATYPE'] == vui5.cons.dataType.time ||
                                      field['DATATYPE'] == vui5.cons.dataType.amount ||
                                      field['DATATYPE'] == vui5.cons.dataType.quantity ||
                                      field['DATATYPE'] == vui5.cons.dataType.decimal) {
                                      field['ELTYP'] = vui5.cons.element.input;
                                  }
                                  lv_editable = "{= ${" + vui5.modelName + ">/DOCUMENT_MODE} !== 'A' &&" +
                                                " ${" + modelName + ">" + attributePath + "DISBL} === '' &&" +
                                                " ${" + modelName + ">" + fieldPath + "DISABLED} === '' }";
                                  
                                  switch (field['ELTYP']) {
                                      case vui5.cons.element.input:
                                          if (field['DATATYPE'] == vui5.cons.dataType.date) {
                                              selection = new sap.m.DatePicker({                                    
                                                  placeholder: " ",
                                                  valueFormat : vui5.cons.date_format,
                                                  visible: lv_visible,
                                                  change: [oControl.dateFieldCheck, oControl],
                                                  editable: lv_editable
                                              }).bindValue(modelName + ">" + attributeRowPath + oForm.attributeFieldName, null, bindingMode);
                                              selection.bindProperty("displayFormat", vui5.modelName + ">" + vui5.cons.modelPath.sessionInfo + "/DATFM", Formatter.displayFormat, sap.ui.model.Binding.OneWay);
                                              oForm.onInputChange(field, selection, attributePath, attributeRowPath);
                                              contentData.push(selection);
                                          } else if (field['DATATYPE'] == vui5.cons.dataType.amount ||
                                                     field['DATATYPE'] == vui5.cons.dataType.quantity) {
                                              selection = new sap.m.Input({
                                                  showValueHelp: false,
                                                  textAlign: sap.ui.core.TextAlign.End,
                                                  editable: lv_editable,
                                                  maxLength: parseInt(field['OUTPUTLEN']),
                                                  visible: lv_visible
                                              });
                                              selection.bindValue(modelName + ">" + attributeRowPath + oForm.attributeFieldName, null, bindingMode);
                                              oForm.onInputChange(field, selection, attributePath, attributeRowPath);
                                              selection.setTextAlign(sap.ui.core.TextAlign.End);
                                              contentData.push(selection);
                                          } else {
                                              selection = new sap.m.Input({
                                                  showValueHelp: false,
                                                  editable: lv_editable,
                                                  visible: lv_visible
                                              });
                                              oForm.handleDescriptionField(
                                                  selection,
                                                  field,
                                                  fieldPath,
                                                  attributeRowPath,
                                                  oForm.attributeFieldName,
                                                  bindingMode,
                                                  "value",
                                                  document_mode,
                                                  oForm.sectionEditable);
                                              oForm.setFieldType(selection, field);
                                              oForm.onInputChange(field, selection, attributePath, attributeRowPath);
                                              contentData.push(selection);
                                          }
                                          break;
                                      case vui5.cons.element.valueHelp:
                                          oForm.prepareValueHelpInputField(
                                              field,
                                              attributePath,
                                              attributeRowPath,
                                              oForm.attributeFieldName,
                                              fieldPath,
                                              bindingMode,
                                              contentData,
                                              lv_editable,
                                              lv_visible,
                                              document_mode,
                                              oForm.sectionEditable);                    
                                          break;
                                      case vui5.cons.element.dropDown:
                                          oForm.prepareDropdownFieldInput(
                                              field,
                                              attributePath,
                                              attributeRowPath,
                                              oForm.attributeFieldName,
                                              drpdnPath,
                                              bindingMode,
                                              contentData,
                                              lv_editable,
                                              lv_visible);
                                          break;
                                      case vui5.cons.element.checkBox:
                                          oForm.prepareCheckBoxFieldInput(
                                              field,
                                              attributePath,
                                              attributeRowPath,
                                              oForm.attributeFieldName,
                                              contentData,
                                              lv_editable,
                                              lv_visible);
                                          break;
                                      //*****Rel 60E_SP6 - Task #39097
                                      case vui5.cons.element.toggle:
                                          oForm.prepareToggleFieldInput(
                                              field,
                                              attributePath,
                                              attributeRowPath,
                                              oForm.attributeFieldName,
                                              contentData,
                                              lv_editable,
                                              lv_visible);
                                          break;
                                      //*****
                                      default:
                                          selection = new sap.m.Input({
                                              showValueHelp: false,
                                              editable: lv_editable,
                                              visible: lv_visible
                                          });
                                          oForm.handleDescriptionField(
                                              selection,
                                              field,
                                              fieldPath,
                                              attributeRowPath,
                                              oForm.attributeFieldName,
                                              bindingMode,
                                              "value",
                                              document_mode,
                                              oForm.sectionEditable);
                                          oForm.setFieldType(selection, field);
                                          oForm.onInputChange(field, selection, attributePath, attributeRowPath);
                                          contentData.push(selection);
                                          break;
                                  }
                                  
                                  oForm.showDescription(
                                          attributeRowPath,
                                          field,
                                          contentData,
                                          lv_visible,
                                          fieldPath,
                                          attributePath);
                              }
                          }
                      }
                  });
              }
          });
      }
      if (switchAction !== undefined) {
          var switchButton = oControl.prepareAttributeSwitchButton(switchAction, switchAction['SECTN']);
      }
      var formToolbar = new sap.m.Toolbar({
          content: [new sap.m.ToolbarSpacer(), switchButton],
          visible: "{= ${" + vui5.modelName + ">/DOCUMENT_MODE} === 'A' }"
      });

      var simpleForm = new sap.ui.layout.form.SimpleForm({
          layout: sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout,
          columnsL: 1,
          editable: true,
          content: contentData,
          toolbar: formToolbar
      });
      simpleForm.data("editable", oForm.sectionEditable);        

      oForm.setAggregation("_Attributes",simpleForm);      	  
  };
  
  A.prototype.__getChangedRows = function(){
      var oForm = this, oControl = this;
      var modelName = this.getModelName();
	  var model = oControl.getModel(modelName);        
      var items = [];        
      underscoreJS.each(oForm._oChangedRowsPath, function (path) {            
      	items.push(model.getProperty(path['PATH']));        
      });
      
      oForm.resetControl();
      
      return items; 
  };
  
  A.prototype.resetControl = function(){
	  this._oChangedRowsPath = [];
  };

  A.prototype.prepareDropdownFieldInput = function(field, attributePath, attributeRowPath, attributeFieldName,
  		drpdnPath, bindingMode, contentData, editable, visible){
	
	  var modelName = this.getModelName();	  
	  var selection;
      var oForm = this;
      if (field['MULTISELECT'] == 'X') {
          selection = new sap.m.MultiComboBox({
              editable: editable,
              visible: visible
          });
          selection.bindAggregation("items", drpdnPath, function (sid, oContext) {
              var contextObject = oContext.getObject();
              return new sap.ui.core.Item({
                  key: contextObject['NAME'],
                  text: contextObject['VALUE']
              });
          });
          selection.bindProperty("selectedKeys", modelName + ">" + attributeRowPath + attributeFieldName, null, bindingMode);
      } else {
          selection = new vui5.ui.controls.ComboBox({
              editable: editable,
              visible: visible
          });
          selection.bindAggregation("items", drpdnPath, function (sid, oContext) {
              var contextObject = oContext.getObject();
              return new sap.ui.core.Item({
                  key: contextObject['NAME'],
                  text: contextObject['VALUE']
              });
          });
          selection.bindProperty("selectedKey", modelName + ">" + attributeRowPath + attributeFieldName, null, bindingMode);
      }
      if (editable != false) {
          oForm.onInputChange(field, selection, attributePath, attributeRowPath);
      }
      contentData.push(selection);
	  
  };
  //*****Rel 60E_SP6 - Task #39097
  A.prototype.prepareToggleFieldInput = function(field, attributePath,
	  	attributeRowPath, attributeFieldName, contentData, editable, visible){
		  
		var selection;
		var oControl = this;
		var modelName = this.getModelName();
	    var oForm = this;
	    selection = new sap.m.Switch({
	    	change: [oControl._onToggleButtonChange, oControl],	        
	    	enabled: editable,	           
	    	visible: visible,	           
	    	state: "{= ${" + modelName + ">" + attributeRowPath + attributeFieldName + "} === 'X' }"	        
	    });
	    
	    if (editable != false) {	    
	    	oForm.onInputChange(field, selection, attributePath, attributeRowPath);	        
	    }
	        
	    selection.data("model", modelName);	    
	    contentData.push(selection);	  
  };
  //*****
  A.prototype.prepareCheckBoxFieldInput = function(field, attributePath,
  		attributeRowPath, attributeFieldName, contentData, editable, visible){
	  
		var selection;
		var oControl = this;
		var modelName = this.getModelName();
        var oForm = this;
        selection = new sap.m.CheckBox({
            select: [oControl.onCheckBoxSelect, oControl],
            editable: editable,
            visible: visible,
            selected: "{= ${" + modelName + ">" + attributeRowPath + attributeFieldName + "} === 'X' }"
        });
        if (editable != false) {
            oForm.onInputChange(field, selection, attributePath, attributeRowPath);
        }
        selection.data("model", modelName);
        contentData.push(selection);	  
  };
    
  A.prototype.prepareValueHelpInputField = function(field, attributePath, attributeRowPath,    
  		attributeFieldName, fieldPath, bindingMode, contentData, editable, visible,  
		document_mode, sectionEditable){
	  
	   var selection;
       var oForm = this;
       selection = new sap.m.Input({
           showValueHelp: true,
           valueHelpRequest: function (oEvent) {
               oForm.onValueHelpRequest(oEvent);
           },
           editable: editable,
           visible: visible,
           maxLength: parseInt(field['OUTPUTLEN'])
       });
       
       oForm.handleDescriptionField(selection,
                                    field,
                                    fieldPath,
                                    attributeRowPath,
                                    attributeFieldName,
                                    bindingMode,
                                    "value",
                                    document_mode,
                                    sectionEditable);
       if (editable != false) {
           oForm.setFieldType(selection, field);
           oForm.bindTypeAheadField(selection, fieldPath, field);
           oForm.onInputChange(field, selection, attributePath, attributeRowPath);
       }
       contentData.push(selection);	  
  };
  
  A.prototype.updateIndicatorChange = function(selection, field, attributePath, attributeRowPath){
	  var oForm = this;
      if (field['ELTYP'] == vui5.cons.element.checkBox) {
          selection.attachSelect(function (oEvent) {
              var source = oEvent.getSource();
              var model;
              if (field['ELTYP'] == vui5.cons.element.dropDown) {
                  model = source.getBinding("selectedKey").getModel();
              } else if (field['ELTYP'] == vui5.cons.element.checkBox) {
                  model = source.getBinding("selected").getModel();
              } else {
                  model = source.getBinding("value").getModel();
              }
              var attribute = model.getProperty(attributePath);
              attribute.__UPDKZ = 'X';
              model.setProperty(attributePath, attribute);
              var attributeRowData = model.getProperty(attributeRowPath);
              attributeRowData.__UPDKZ = 'X';
              model.setProperty(attributeRowPath, attributeRowData);
          });
      } else {
          selection.attachChange(function (oEvent) {
              var source = oEvent.getSource();
              var model, object;

              object = underscoreJS.find(oForm._oChangedRowsPath, {            
              	'PATH': attributePath         
              });

              if (!object) {            
              	oForm._oChangedRowsPath.push({                
              		'PATH': attributePath            
              	});        
              }            
          });
      }
  };
  
  A.prototype.setFieldType = function(selection, fieldInfo){
	  if (fieldInfo['SDSCR'] == vui5.cons.fieldValue.value ||
	      fieldInfo['SDSCR'] == vui5.cons.fieldValue.value_descr) {    		
	            
	    		if (fieldInfo['INTTYPE'] == vui5.cons.intType.number ||
	                fieldInfo['INTTYPE'] == vui5.cons.intType.oneByteInteger ||
	                fieldInfo['INTTYPE'] == vui5.cons.intType.twoByteInteger ||
	                fieldInfo['INTTYPE'] == vui5.cons.intType.float ||
	                fieldInfo['INTTYPE'] == vui5.cons.intType.decimal16 ||
	                fieldInfo['INTTYPE'] == vui5.cons.intType.decimal32) {
	                  selection.setType(sap.m.InputType.Number);
	                }
	  }
	  if (fieldInfo['INTTYPE'] == vui5.cons.intType.number && fieldInfo['KEY'] != 'X' &&
	      (fieldInfo['SDSCR'] == vui5.cons.fieldValue.value ||
	       fieldInfo['SDSCR'] == vui5.cons.fieldValue.value_descr)) {            
	         selection.setTextAlign(sap.ui.core.TextAlign.End);        
	  }
	        
	  if ((fieldInfo['SDSCR'] == vui5.cons.fieldValue.value ||
	       fieldInfo['SDSCR'] == vui5.cons.fieldValue.value_descr) &&
	      (fieldInfo['INTTYPE'] == vui5.cons.intType.oneByteInteger ||
	       fieldInfo['INTTYPE'] == vui5.cons.intType.twoByteInteger ||
	       fieldInfo['INTTYPE'] == vui5.cons.intType.float ||
	       fieldInfo['INTTYPE'] == vui5.cons.intType.decimal16 ||
	       fieldInfo['INTTYPE'] == vui5.cons.intType.decimal32 ||
	       fieldInfo['INTTYPE'] == vui5.cons.intType.packed ||
	       fieldInfo['INTTYPE'] == vui5.cons.intType.integer)) {            
	         selection.setTextAlign(sap.ui.core.TextAlign.End);        
	  }
	  
  };
  
  A.prototype.onInputChange = function(fieldInfo, selection, attributePath, attributeRowPath, refPath, refFields){
	  var oForm = this;    
      if (fieldInfo['ELTYP'] == vui5.cons.element.checkBox) {
          selection.attachSelect(function (oEvent) {
              oForm._preProcessOnInputChange(oEvent, fieldInfo, refPath, oForm.sectionDataPath, refFields, oForm.amountRef, selection);
              oForm.processOnInputChange(oEvent);
          });
          oForm.updateIndicatorChange(selection, fieldInfo, attributePath, attributeRowPath);
      //*****Rel 60E_SP6 - Task #39097
      } else if(fieldInfo['ELTYP'] == vui5.cons.element.toggle) {
    	  selection.attachChange(function (oEvent) {
              oForm._preProcessOnInputChange(oEvent, fieldInfo, refPath, oForm.sectionDataPath, refFields, oForm.amountRef, selection);
              oForm.processOnInputChange(oEvent);
          });
          oForm.updateIndicatorChange(selection, fieldInfo, attributePath, attributeRowPath);
      //*****
      } else if (fieldInfo['ELTYP'] == vui5.cons.element.dropDown) {
          selection.attachSelectionChange(function (oEvent) {
              oForm._preProcessOnInputChange(oEvent, fieldInfo, refPath, oForm.sectionDataPath, refFields, oForm.amountRef, selection);
              oForm.processOnInputChange(oEvent);
          });
          oForm.updateIndicatorChange(selection, fieldInfo, attributePath, attributeRowPath);
      } else {
          selection.attachChange(function (oEvent) {
              oForm._preProcessOnInputChange(oEvent, fieldInfo, refPath, oForm.sectionDataPath, refFields, oForm.amountRef, selection);
              oForm.processOnInputChange(oEvent);
          });
          oForm.updateIndicatorChange(selection, fieldInfo, attributePath, attributeRowPath);
      }
  };
  
  A.prototype._preProcessOnInputChange = function(oEvent, fieldInfo, refPath, sectionDataPath, refFields, amountRef, selection){
      if (!oEvent.mParameters) {
          oEvent.mParameters = {};
      }
      oEvent.mParameters['fieldInfo'] = fieldInfo;
      oEvent.mParameters['refPath'] = refPath;
      oEvent.mParameters['dataPath'] = sectionDataPath;
      oEvent.mParameters['refFields'] = refFields;
      oEvent.mParameters['amountRef'] = amountRef;
      oEvent.mParameters['selection'] = selection;	  
  };
  
  A.prototype.handleDescriptionField = function(selection, field, fieldPath, attributeRowPath,
          attributeFieldName, bindingMode, propertyName, documentMode, sectionEditable){
	  
	var modelName = this.getModelName();  
	  
  	if (field['SDSCR'] == vui5.cons.fieldValue.value) {            
		selection.bindProperty(propertyName,modelName + ">" + attributeRowPath + attributeFieldName,null, bindingMode);
    } else if (field['SDSCR'] == vui5.cons.fieldValue.value_descr) {
        selection.bindProperty(propertyName,modelName + ">" + attributeRowPath + attributeFieldName,null, bindingMode);
    } else if (field['SDSCR'] == vui5.cons.fieldValue.description ||
               field['SDSCR'] == vui5.cons.fieldValue.value_cont_descr) {
        selection.bindProperty(propertyName,modelName + ">" + attributeRowPath + field['TXTFL'],null, bindingMode);
    }
    if (documentMode != vui5.cons.mode.display && sectionEditable != false) {
        selection.data("model", modelName);
        selection.data("path", fieldPath);
        selection.data("fieldname", attributeFieldName);
    }
	  	  
  };
  
  A.prototype.bindTypeAheadField = function(selection, fieldPath, fieldInfo){
      var oForm = this, oControl = this;
      var modelName = this.getModelName();
      selection.setShowSuggestion(true);
      selection.setFilterSuggests(false);
      if (fieldInfo['INTLEN'] == 1)
          selection.setStartSuggestion(1);
      else
          selection.setStartSuggestion(2);

      selection.setMaxSuggestionWidth("50%");
      selection.attachSuggest(function (oEvent) {
          var source = oEvent.getSource();
          var model = source.getModel(source.data("model"));
          var fieldInfo = model.getProperty(source.data("path"));
          oEvent.mParameters['eventType'] = vui5.cons.fieldSubEvent.typeAhead;
          oEvent.mParameters['fieldInfo'] = fieldInfo;
          oEvent.mParameters['fieldValue'] = oEvent.getParameter('suggestValue');
          oEvent.mParameters['oEvent'] = oEvent;
          oForm.preProcessFieldEvent(oEvent);
      });
      
      selection.attachSuggestionItemSelected(oControl.handleSuggestionItemSelected.bind(oControl));
      selection.bindAggregation("suggestionColumns", vui5.modelName + ">/TYPEAHEAD/" + fieldInfo['FLDNAME'] + "/FIELDS", function (sid, oContext) {
          var contextObject = oContext.getObject();
          return new sap.m.Column({
              header: new sap.m.Text({
                  text: contextObject['LABEL']
              })
          });
      });
      selection.bindAggregation("suggestionRows", vui5.modelName + ">/TYPEAHEAD/" + fieldInfo['FLDNAME'] + "/DATA", function (sid, oContext) {
          var contextObject = oContext.getObject();
          var model = oControl.getModel(vui5.modelName);
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
      selection.data("model", modelName);
      selection.data("path", fieldPath);
      selection.data("dataArea", oForm.dataArea);
  };
  
  /*More Link and Description*/
  A.prototype.showDescription = function(attributeRowPath, field, contentData, visible, fieldPath, attributePath){
      
  	  var oForm = this, oControl = this;
  	  var oController = this.getController();
  	  var modelName = this.getModelName();
  	  var model = oControl.getModel(modelName);
      var mainModel = oControl.getModel(vui5.modelName);
      var document_mode = mainModel.getProperty("/DOCUMENT_MODE");
    
      if(oForm.sectionEditable == false && !sap.ui.Device.system.phone){
    	  var link = new sap.m.Link({             
              text: {
                  path: modelName + ">" + attributePath + "DATA" ,
                  formatter: function (data) {
                	  if (data && data.length > 1) {
                	    var bundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls");
                        var moreText = bundle.getText("More");
                        var value = moreText;                      
                        var count = data.length - 1;
                        value = moreText + "(" + count + ")";
                        return value;
                      }                      
                  }
              },
              layoutData: new sap.ui.layout.GridData({
                  spanL: 1,
                  spanM: 1
              }),
              enabled: true,
              wrapping: true
          }); 
      }
      else {    	
    	  var link = new sap.m.Link({             
              text: {
                  path: modelName + ">" + attributePath + "DATA" ,
                  formatter: function (data) {
                      var bundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls");
                      var moreText = bundle.getText("More");
                      var value = moreText;
                      if (data && data.length > 1) {
                          var count = data.length - 1;
                          value = moreText + "(" + count + ")";
                      }
                      return value;
                  }
              },
              layoutData: new sap.ui.layout.GridData({
                  spanL: 1,
                  spanM: 1
              }),
              enabled: true,
              wrapping: true
          });     	  
      }       
      
          /**** Rel 60E SP6 QA #10594 - Start ***/      
      //if (document_mode != vui5.cons.mode.display) {
      if (document_mode != vui5.cons.mode.display && oForm.sectionEditable) {
          /**** Rel 60E SP6 QA #10594 - End ***/         
      	  //*****Rel 60E_SP6
    	  /*link.bindProperty("visible","{= ${" + modelName + ">" + attributePath + "DISBL} === '' " +
                                    "|| ( ${" + modelName + ">" + attributePath + "DATA}.length > 1 " +
                                    "&& ${" + modelName + ">" + attributePath + "DISBL} === 'X' ) }", null, sap.ui.model.BindingMode.OneWay);*/    	      	  
    	  link.bindProperty("visible",{ parts: [{path: modelName + ">" + attributePath + "DATA"},
    		                                    {path: modelName + ">" + attributePath + "DISBL"}], 
    		                            formatter: function(data, disbl) {
                                            if(data && disbl){                                            	
                                            	if(data.length == 0 && disbl == "X"){
                                            		return false;
                                            	}
                                            	else {return true;}                                                
                                            }         		                            	
                                        },
                                        mode: sap.ui.model.BindingMode.OneWay });
          //*****
      	
          link.attachPress(function (oEvent) {            
              var source = oEvent.getSource();
              var rowidPath = source.data('path') + 'ROWID';
              var rowid = model.getProperty(rowidPath);
              oForm.onDetailView({
                  'ROWID': rowid
              });
          });
      } else {
          link.bindProperty("visible",visible, null, sap.ui.model.BindingMode.OneWay);
          
          link.attachPress(oForm.showPopover.bind(oController));
      }

      link.data('path', attributePath);
      link.addStyleClass("dmrAttributes");
      contentData.push(link);
  
      if(oForm.showCurrentAttrVal === 'X')      
      	lv_spanL = 5;    
      else      
      	lv_spanL = 7;

      //*****Rel 60E_SP6
      //if (field['SDSCR'] === vui5.cons.fieldValue.value ||
      if (
      //*****
          (field['SDSCR'] === vui5.cons.fieldValue.value_descr && field['ELTYP'] !== vui5.cons.element.dropDown)) {

      	var selection = new sap.m.Text({
              text: {
                  parts: [{path: modelName + ">" + attributeRowPath + field['TXTFL']},            
                          {path: modelName + ">" + attributeRowPath + "DATUV"},
                          {path: modelName + ">" + fieldPath},
                          {path: modelName + ">" + oForm.effectiveDatePath},
                          {path: modelName + ">" + attributeRowPath + "ATZHL"},
                          {path: modelName + ">" + attributeRowPath + "ATWRT_CURR"},
                          {path: modelName + ">" + attributeRowPath + "ATWTB_CURR"}],
                  formatter: oForm.descriptionPrepare
              },
              visible: visible,
              layoutData: new sap.ui.layout.GridData({
                spanL : lv_spanL,
                spanM: 5
              })
          });
      	selection.addStyleClass("dmrAttributes");
          contentData.push(selection);
          
      } else {
          selection = new sap.m.Text({
              text: {
                  parts: [{path: modelName + ">" + attributeRowPath + "DATUV"},
                          {path: modelName + ">" + fieldPath},
                          {path: modelName + ">" + oForm.effectiveDatePath},
                          {path: modelName + ">" + attributeRowPath + "ATZHL"},
                          {path: modelName + ">" + attributeRowPath + "ATWRT_CURR"},
                          {path: modelName + ">" + attributeRowPath + "ATWTB_CURR"}],
                  formatter: oForm.effectiveDateDescriptionPrepare
              },
              layoutData: new sap.ui.layout.GridData({
                  spanL : lv_spanL,
                  spanM: 5
              }),
              visible: visible
          });
          selection.addStyleClass("dmrAttributes");
          contentData.push(selection);
      }

//****ESP5 27962 - Fiori Generic app approach  - Current attribute value(multi value)    
      if(oForm.showCurrentAttrVal === 'X'){        
      	link = new sap.m.Link({            
      		text: {                
      			path: modelName + ">" + attributePath + "MVDATA",                
      			formatter: function (data) {                    
      				if (data && data.length > 0) {                        
      					return sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls").getText("MultipleValues") + "(" + data.length + ")";                    
      				}else{                    
      					return '' ;                   
      				}                
      			}            
      		},            
      		layoutData: new sap.ui.layout.GridData({                
      			spanL: 2,                
      			spanM: 1,            
      		}),
              enabled: true,
              wrapping: true,
              press: [oForm.showMultiValuePopover.bind(oController)],
              visible: "{= ${" + modelName + ">" + attributePath + "MVDATA}.length > 0 }"        
      	});        
      	link.data('path', attributePath);        
      	contentData.push(link);

    
      	selection = new sap.m.Text({          
      		text : {            
      			parts : [{path : modelName + ">" + attributeRowPath + "ATWRT_CURR"},
                           {path : modelName + ">" + attributeRowPath + "ATWTB_CURR"}],                    
                  formatter : oForm.currentAttributeValuePrepare          
      		},          
      		layoutData : new sap.ui.layout.GridData({              
      			spanL : 2,              
      			spanM : 1,            
      		}),            
      		wrapping : true,            
      		visible:  "{= ${" + modelName + ">" + attributePath + "MULVL} === '' }"        
      	});      
      	selection.addStyleClass("vuisapTextSteelBlue");      
      	contentData.push(selection);      
      }
//****ESP5 27962 - Fiori Generic app approach  - Current attribute value(multi value) - end
	
  };
  
  A.prototype.currentAttributeValuePrepare = function(curr_attr_val, descr){
	    var description;
	      if(curr_attr_val != "" && curr_attr_val != undefined){
	          if(descr != "" && descr != undefined){
	              output = descr + " " + "(" + curr_attr_val + ")" ;
	              description = output;
	            }else{
	              output =  curr_attr_val ;
	              description = output;
	            }
	          }
	          if(description == undefined)
	            return '';
	          else
	            return description;	 	 
  };
  
  //****ESP5 27962 - Fiori Generic app approach  - Current attribute value(multi value)
  A.prototype.showMultiValuePopover = function(oEvent){
      var oController = this;
      var modelName = oController.modelName;
      var oSource = oEvent.getSource();
      var attributePath = oSource.data('path');
      var text;
      if (sap.ui.Device.system.phone) {
          text = oSource.getParent().getAggregation("label").getText();
      } else {
          text = oSource.getParent().getAggregation("label").getText();
      }
      if (!this._oMultiValAttributePopover) {
          this._oMultiValAttributePopover = new sap.m.ResponsivePopover({
              placement: sap.m.PlacementType.Bottom
          });
          jQuery.sap.syncStyleClass(this.getOwnerComponent().getContentDensityClass(),this.getView(), this._oMultiValAttributePopover);
          oController.getView().addDependent(this._oMultiValAttributePopover);
      }

      this._oMultiValAttributePopover.setTitle(text);
      var oList = new sap.m.List();
      this._oMultiValAttributePopover.removeAllContent();
      this._oMultiValAttributePopover.addContent(oList);
      oList.bindItems(modelName + ">" + attributePath + "MVDATA", function (sid, oContext) {
          var oContextObject = oContext.getObject();
          var path = oContext.getPath();

          var object = new sap.m.ObjectListItem({
              title: {
                  parts: [{path: modelName + ">" + path + "/ATWRT"},
                          {path: modelName + ">" + path + "/ATWTB"}],
                  formatter: function (value, descr) {
                      output = descr + " " + "(" + value + ")";
                      return output;
                  }
              },
          });
          return object;
      });
      this._oMultiValAttributePopover.openBy(oSource);
  };
  //****ESP5 27962 - Fiori Generic app approach  - Current attribute value(multi value) - end
  
  A.prototype.showPopover = function(oEvent){
      var oController = this;
      var modelName = oController.modelName;
      var attributeFieldName = oController.attributeFieldname;
      var oSource = oEvent.getSource();
      var attributePath = oSource.data('path');
      var text;
      if (sap.ui.Device.system.phone) {
          text = oSource.getParent().getAggregation("label").getText();
      } else {
          text = oSource.getParent().getAggregation("label").getText();
      }
      if (!this._oAttributePopover) {
          this._oAttributePopover = new sap.m.ResponsivePopover({});
          jQuery.sap.syncStyleClass(this.getOwnerComponent().getContentDensityClass(),this.getView(), this._oAttributePopover);
          oController.getView().addDependent(this._oAttributePopover);
      }
      this._oAttributePopover.setTitle(text);
      var oList = new sap.m.List();
      this._oAttributePopover.removeAllContent();
      this._oAttributePopover.addContent(oList);
      oList.bindItems(modelName + ">" + attributePath + "DATA", function (sid, oContext) {
          var oContextObject = oContext.getObject();
          var path = oContext.getPath();
          var icon;
          if (oContextObject['ACTON'] === 'A')
              icon = "sap-icon://add";
          else if (oContextObject['ACTON'] === 'C')
              icon = "sap-icon://edit";
          else if (oContextObject['ACTON'] === 'D')
              icon = "sap-icon://delete";
          else
              icon = "";
    
          if(oContextObject['ATWTB'] === '' || oContextObject['ATWTB'] === undefined ){
          	var object = new sap.m.ObjectListItem({              
          		title : oContextObject[attributeFieldName]            
          	});                  
          }else{          
          	var object = new sap.m.ObjectListItem({              
          		title : oContextObject['ATWTB']            
          	});      
          }

          object.addAttribute(new sap.m.ObjectAttribute({
              title:sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls").getText("EffectiveDate"),
              text: {
                  path: modelName + ">" + path + "/DATUV",
                  formatter: Formatter.dateFormat
              }
          }));
          object.addAttribute(new sap.m.ObjectAttribute({
              title: sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls").getText("Action"),
              text: {
                  path: modelName + ">" + path + "/ACTON",
                  formatter: function (value) {
                      var output;
                      var mainModel = this.getModel(vui5.modelName);
                      var actions = mainModel.getProperty("/DROPDOWNS/" + vui5.cons.dropdownsDatar + "/ACTON");
                      if (value) {
                          var data = underscoreJS.findWhere(actions, {
                              NAME: value
                          });
                          if (data) {
                              output = data['VALUE'];
                              return output;
                          }
                      }
                  }
              }
          }));
          object.addAttribute(new sap.m.ObjectAttribute({
              title:sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls").getText("CurrentAttrVal"),
              text: {
                  parts: [{path: modelName + ">" + path + "/ATWRT_CURR"},
                          {path: modelName + ">" + path + "/ATWTB_CURR"}],
                  formatter: function (value, descr) {
                      var output;
                      if (value != "" && value != undefined) {
                          if (descr != "" && descr != undefined) {
                              output = descr + " " + "(" + value + ")";
                          } else {
                              output = value;
                          }
                      }
                      if (output == undefined)
                          return '';
                      else
                          return output;
                  }
              }
          }));
          return object;
      });
      this._oAttributePopover.openBy(oSource);
  };
  
  A.prototype.descriptionPrepare = function(descr, date, field, effectiveDate, atzhl /*curr_attr_val,val_descr*/){
      var bundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls");
      if (atzhl === '0000') {
          if (description == undefined)
              return '';
      }
      var description = descr;
      if (description == undefined) {
          return '';
      }
      if (date != effectiveDate && effectiveDate != undefined && date != undefined) {
          var output;
          if (date) {
              var mainModel = this.getModel(vui5.modelName);
              var months = mainModel.getProperty("/DROPDOWNS/$DRPDN/MONTHS");
              if (months) {
                  var dateData = date.split('-');
                  var year = dateData[0];
                  var month = dateData[1];
                  var day = dateData[2];
                  var monthData = underscoreJS.find(months, {
                      NAME: month
                  });
                  if (monthData) {
                      output = monthData['VALUE'] + " " + day + ", " + year;
                  } else {
                      output = date;
                  }
              } else {
                  output = date;
              }
          } else {
              output = "";
          }
          if (output != "") {
              output = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls").getText("EffectiveFrom") + ' ' + output;
          }
          if (description == "") {
              description = output;
          } else {
              description = description + " " + "||" + " " + output;
          }
      }

      if (description == undefined)
          return '';
      else
          return description;
  };

  A.prototype.effectiveDateDescriptionPrepare = function(date, field, effectiveDate, atzhl /*curr_attr_val,val_descr*/){

      if (atzhl === '0000') {
          if (description == undefined)
              return '';
      }
      var description = '';
      if (date != effectiveDate && effectiveDate != undefined && date != undefined) {
          var output;
          if (date) {
              var mainModel = this.getModel(vui5.modelName);
              var months = mainModel.getProperty("/DROPDOWNS/$DRPDN/MONTHS");
              if (months) {
                  var dateData = date.split('-');
                  var year = dateData[0];
                  var month = dateData[1];
                  var day = dateData[2];
                  var monthData = underscoreJS.find(months, {
                      NAME: month
                  });
                  if (monthData) {
                      output = monthData['VALUE'] + " " + day + ", " + year;
                  } else {
                      output = date;
                  }
              } else {
                  output = date;
              }
          } else {
              output = "";
          }
          description = output;
      }
      if (description != '')
          description = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls").getText("EffectiveFrom") + ' ' + description;

      if (description == undefined)
          return '';
      else
          return description;

  };    
      
  return A;
});