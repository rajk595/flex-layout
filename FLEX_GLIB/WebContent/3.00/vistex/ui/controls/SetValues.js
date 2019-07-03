sap.ui.define([
  "sap/m/Dialog",
  "sap/ui/model/json/JSONModel",
  vistexConfig.rootFolder + "/ui/core/global",
  vistexConfig.rootFolder + "/ui/core/underscore-min"
], function(control, JSONModel, global, underscoreJS) {
  'use strict';

  var S = control.extend(vistexConfig.rootFolder + ".ui.controls.SetValues", {
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
        fieldPath : {
          type : "string",
          defaultValue : null
        },
        dataPath : {
          type : "string",
          defaultValue : null
        },
        dataAreaPath : {
          type : "string",
          defaultValue : null
        },
        onF4HelpRequest : {
          type : "function",
          defaultValue : null
        }
      },

      events : {
        onApply : {},
        onClose : {},
        onValueHelpRequest : {}
      }
    },
    renderer : function(oRM, oControl) {
      jQuery.sap.require("sap.m.DialogRenderer");
      sap.m.DialogRenderer.render(oRM, oControl);
    }
  });

  S.prototype.init = function() {
    control.prototype.init.apply(this);

    var oControl = this;
    var sLocale = sap.ui.getCore().getConfiguration().getLanguage();
    if (sLocale.length > 2) {
      sLocale = sLocale.substring(0, 2);
    }

    oControl._setValModel = "SETVALUES";

    var model = new JSONModel();
    var data = {
      "DATA" : {
        "CFNAM" : "",
        "CMETH" : "S",
        "VALUE" : "",
        "CUNIT" : "A",
        "WAERS" : "",
        "MEINS" : "",
        "EDIT" : ""
      },
      "SHOWUNIT" : true,
      'CONDITIONS' : [ {
        "FLDNM" : "",
        "TABNM" : "",
        "RELOP" : "=",
        "FLDVL" : "",
        "LOGOP" : "",
        "ADD" : "",
        "DEL" : "",
        "SHADD" : true,
        "SHDEL" : true,
        "SHLOP" : false
      } ],
      "DROPDOWNS" : [],
      "VISIBLE" : false
    };
    model.setData(data);
    model.setSizeLimit(4000);
    oControl.setModel(model, oControl._setValModel);
    this._oBundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls");
    data = [];

    oControl._conditionObject = {
      "FLDNM" : "",
      "RELOP" : "=",
      "FLDVL" : "",
      "LOGOP" : "",
      "ADD" : "",
      "DEL" : "",
      "SHADD" : true,
      "SHDEL" : true,
      "SHLOP" : false
    };

    oControl._unitAdded = false;
  };

  S.prototype.setController = function(value) {
    this.setProperty("controller", value, true);
  };

  S.prototype.setDataPath = function(value) {
    this.setProperty("dataPath", value, true);
  };

  S.prototype.setModelName = function(value) {
    this.setProperty("modelName", value, true);
  };

  S.prototype.setFieldPath = function(value) {
    this.setProperty("fieldPath", value, true);
  };

  S.prototype.setDataAreaPath = function(value) {
    this.setProperty("dataAreaPath", value, true);
  };

  S.prototype.setOnF4HelpRequest = function(value) {
    this.setProperty("onF4HelpRequest", value, true);
  };

  S.prototype.prepareDialog = function() {

    var oControl = this;
    var mainModel = this.getController().getModel(global.vui5.modelName);
    oControl.setModel(mainModel, global.vui5.modelName);

    oControl.setTitle(oControl._oBundle.getText("SetValues"));
    oControl.addButton(new sap.m.Button({
      text : oControl._oBundle.getText("Apply"),
      visible : "{" + oControl._setValModel + ">/VISIBLE}",
      press : [ oControl._onApply, oControl ]
    }));

    oControl.addButton(new sap.m.Button({
      text :oControl._oBundle.getText("Cancel"),
      press : function() {
        oControl.close();
        oControl.fireOnClose();
      }
    }));

    oControl._setField = new global.vui5.ui.controls.ComboBox({
      selectionChange : [ oControl._onSetFieldChange, oControl ]
    }).bindProperty("selectedKey", oControl._setValModel + ">/DATA/CFNAM");
    var model = this.getModel(this.getModelName());
    var fields = model.getProperty(this.getFieldPath());
    underscoreJS.each(fields, function(field) {
      if (field['NO_OUT'] == '' && field['DISABLED'] === "") {
        oControl._setField.addItem(new sap.ui.core.Item({
          key : field['FLDNAME'],
          text : field['LABEL']
        }));
      }
    });

    oControl._compMethod = new global.vui5.ui.controls.ComboBox({
      selectionChange : [oControl._onOpChange,oControl],
      visible : "{" + oControl._setValModel + ">/VISIBLE}"
    }).bindProperty("selectedKey", oControl._setValModel + ">/DATA/CMETH");
    oControl._compMethod.bindAggregation("items", global.vui5.modelName + ">" + "/DROPDOWNS/" + global.vui5.cons.dropdownsDatar + "/CMETH", function(sid, oContext) {
      var contextObject = oContext.getObject();

      return new sap.ui.core.Item({
        key : contextObject['NAME'],
        text : contextObject['VALUE']
      });
    });

    oControl._unitField = new global.vui5.ui.controls.ComboBox({
      visible : "{= ${" + oControl._setValModel + ">/VISIBLE} && ${" + oControl._setValModel + ">/SHOWUNIT} }"
    }).bindProperty("selectedKey", oControl._setValModel + ">/DATA/CUNIT");
    oControl._unitField.bindAggregation("items", global.vui5.modelName + ">" + "/DROPDOWNS/" + global.vui5.cons.dropdownsDatar + "/CUNIT", function(sid, oContext) {
      var contextObject = oContext.getObject();
      return new sap.ui.core.Item({
        key : contextObject['NAME'],
        text : contextObject['VALUE']
      });
    });

    oControl._setField.setSelectedKey("");
    model = oControl.getModel(oControl._setValModel);

    oControl.removeAllContent();

    var contentData = [];
    //      contentData.push(new sap.ui.core.Title({
    //      text : ""
    //      }));
    //      contentData.push(new sap.m.Label({
    //      text: ""
    //      }));

    contentData.push(oControl._setField);
    contentData.push(oControl._compMethod);
    var valField = new sap.m.Input({
      visible : "{" + oControl._setValModel + ">/VISIBLE}"
    }).bindValue(oControl._setValModel + ">/DATA/VALUE");
    valField.data("element",valField)
    contentData.push(valField);
    contentData.push(oControl._unitField);

    var form = new sap.ui.layout.Grid({
      width : '100%',
      defaultSpan : 'L6 M6 S12',
      vSpacing : 0.5,
      hSpacing : 0.5,
      content : contentData
    });

    var panel = new sap.m.Panel({
      backgroundDesign : sap.m.BackgroundDesign.Transparent,
      content : [ form ]
    });

    oControl.addContent(panel);

    oControl._oConditionPanel = new sap.m.Panel({
      headerText : oControl._oBundle.getText("Conditions"),
      expandable : true,
      expanded : true,
      visible : "{" + oControl._setValModel + ">/VISIBLE}"
    });

    oControl._oConditionPanel.bindAggregation("content", oControl._setValModel + ">/CONDITIONS", function(sId, oContext) {
      var contextObject = oContext.getObject();
      var path = oContext.getPath();
      var arr = path.split('/');
      var showAdd = oControl._setValModel + ">" + path + "/SHADD";
      var showDel = oControl._setValModel + ">" + path + "/SHDEL";
      var showLogop = oControl._setValModel + ">" + path + "/SHLOP";

      var contextIndex = arr[arr.length - 1];

      var dataPath = path + "/FLDVL";

      var content = [];
      var oField = new global.vui5.ui.controls.ComboBox({
        selectionChange : [ oControl._onConFieldChange, oControl ]
      }).bindProperty("selectedKey", oControl._setValModel + ">/CONDITIONS/" + contextIndex + "/FLDNM");
      var model = oControl.getModel(oControl.getModelName());
      var fields = model.getProperty(oControl.getFieldPath());
      underscoreJS.each(fields, function(field) {
        if (field['NO_OUT'] == '') {
          oField.addItem(new sap.ui.core.Item({
            key : field['FLDNAME'],
            text : field['LABEL']
          }));
        }
      });

      content.push(oField);

      content.push(new global.vui5.ui.controls.ComboBox({

      }).bindProperty("selectedKey", oControl._setValModel + ">/CONDITIONS/" + contextIndex + "/RELOP")
        .bindAggregation("items", global.vui5.modelName + ">" + "/DROPDOWNS/" + global.vui5.cons.dropdownsDatar + "/RELOP", function(sid, oContext) {
          var contextObject = oContext.getObject();
          return new sap.ui.core.Item({
            key : contextObject['NAME'],
            text : contextObject['VALUE']
          });
        }));

      if (contextObject['FLDNM'] != "") {
        var field = underscoreJS.find(fields, {
          'FLDNAME' : contextObject['FLDNM']
        });
        var fieldIndex = underscoreJS.indexOf(fields, field);
        var fieldPath = oControl.getFieldPath() + fieldIndex;
        content.push(oControl._createFieldControl(fieldPath, dataPath));
      } else {
    	  /*** Rel 60E SP7 - Empty operation support for setvalues - Start***/
          content.push(new sap.m.Input({
          	visible : "{= ${" + oControl._setValModel + ">/CONDITIONS/" + contextIndex +"/RELOP} !== 'NV' && ${" + oControl._setValModel + ">/CONDITIONS/" + contextIndex +"/RELOP} !== 'HV' }"
          }).bindValue(oControl._setValModel + ">/CONDITIONS/" + contextIndex + "/FLDVL"));
    	  /*** Rel 60E SP7 - Empty operation support for setvalues - End***/
      }

      content.push(new global.vui5.ui.controls.ComboBox({
        visible : "{" + showLogop + "}"
      }).bindProperty("selectedKey", oControl._setValModel + ">/CONDITIONS/" + contextIndex + "/LOGOP")
        .bindAggregation("items", global.vui5.modelName + ">" + "/DROPDOWNS/" + global.vui5.cons.dropdownsDatar + "/LOGOP", function(sid, oContext) {
          var contextObject = oContext.getObject();
          return new sap.ui.core.Item({
            key : contextObject['NAME'],
            text : contextObject['VALUE']
          });
        }));

      var buttons = [];
      buttons.push(new sap.m.Button({
        tooltip :oControl._oBundle.getText("AddCondition"),
        icon : "sap-icon://sys-add",
        visible : "{" + showAdd + "}",
        press : oControl._onAddCondition.bind(oControl)
      }));

      buttons.push(new sap.m.Button({
        tooltip : oControl._oBundle.getText("DelCondition"),
        icon : "sap-icon://sys-cancel",
        visible : "{" + showDel + "}",
        press : oControl._onDeleteCondition.bind(oControl)
      }));

      content.push(new sap.m.FlexBox({
        alignItems : sap.m.FlexAlignItems.Start,
        items : buttons
      }));

      return new sap.ui.layout.Grid({
        width : '100%',
        defaultSpan : 'L2 M4 S12',
        vSpacing : 0.5,
        hSpacing : 0.5,
        content : content
      });

    });

    oControl.addContent(oControl._oConditionPanel);
  };

  S.prototype._createFieldControl = function(fieldPath, dataPath) {
    var oControl = this;
    var oController = this.getController();

    var modelName = this.getModelName();
    var model = this.getModel(modelName);
    //        var dataModel = this.getModel(this._setValModel);
    var field = model.getProperty(fieldPath);

    if (field['DATATYPE'] == global.vui5.cons.dataType.date || field['DATATYPE'] == global.vui5.cons.dataType.time) {
      field['ELTYP'] = global.vui5.cons.element.input;
    }

    var dataArea = model.getProperty(oControl.getDataAreaPath());
    var bindingMode = sap.ui.model.BindingMode.TwoWay;
    var selection;
    switch (field['ELTYP']) {
    case global.vui5.cons.element.input:
      if (field['DATATYPE'] == global.vui5.cons.dataType.date) {
        selection = new sap.m.DatePicker({
          displayFormat : "long",
          //*****Rel 60E_SP6
          //valueFormat : "YYYYMMdd",
          valueFormat : "yyyyMMdd",
          //*****
          placeholder : " ",
          change : [ oController.dateFieldCheck, oController ]
        }).bindValue(this._setValModel + ">" + dataPath, null, bindingMode);
      } else if (field['DATATYPE'] == global.vui5.cons.dataType.time) {
        selection = new sap.m.TimePicker({
          valueFormat : "HHmmss",
          displayFormat : "hh:mm:ss a"
        }).bindValue(this._setValModel + ">" + dataPath, null, bindingMode);
      } else if (field['DATATYPE'] == global.vui5.cons.dataType.amount) {
        selection = new sap.m.Input({
          showValueHelp : false,
          maxLength : parseInt(field['OUTPUTLEN'])
        });
        selection.setTextAlign(sap.ui.core.TextAlign.End);
        selection.bindValue(this._setValModel + ">" + dataPath, null, bindingMode);
      //                  oControl._setValuesFieldCheck(selection,field);
      } else if (field['DATATYPE'] == global.vui5.cons.dataType.decimal) {
        selection = new sap.m.Input({
          showValueHelp : false,
          maxLength : parseInt(field['OUTPUTLEN'])
        });
        selection.setTextAlign(sap.ui.core.TextAlign.End);
        selection.bindValue(this._setValModel + ">" + dataPath, null, bindingMode);

      } else if (field['DATATYPE'] == global.vui5.cons.dataType.quantity) {
        selection = new sap.m.Input({
          showValueHelp : false,
          maxLength : parseInt(field['OUTPUTLEN'])
        });
        selection.setTextAlign(sap.ui.core.TextAlign.End);
        selection.bindValue(this._setValModel + ">" + dataPath, null, bindingMode);
      } else {
        selection = new sap.m.Input({
          showValueHelp : false
        });
        oControl.setFieldType(selection, field);
        oControl._setValuesFieldCheck(selection, field);

        //                  if(field['SDSCR'] == global.vui5.cons.fieldValue.description
        //                  || field['SDSCR'] == global.vui5.cons.fieldValue.value_cont_descr) {
        //                  selection.bindValue(modelName + ">" + dataPath + field['TXTFL'] ,null,bindingMode);
        //                  selection.data("model", modelName);
        //                  selection.data("path",fieldPath);
        //                  selection.attachChange(oController.getDescription.bind(oController));
        //                  selection.setMaxLength(60);
        //                  }else {
        selection.bindValue(this._setValModel + ">" + dataPath, null, bindingMode);
      //                  }
      }
      selection.attachChange(oControl._onSetValueChange.bind(oControl));
      break;
    case global.vui5.cons.element.valueHelp:
      selection = new sap.m.Input({
        showValueHelp : true,
        fieldWidth : "100%"
      });
      oControl.setFieldType(selection, field);
      oControl._setValuesFieldCheck(selection, field);
      //              if(field['SDSCR'] == global.vui5.cons.fieldValue.description
      //              || field['SDSCR'] == global.vui5.cons.fieldValue.value_cont_descr) {
      //              selection.bindValue(modelName + ">" + dataPath + field['TXTFL'] ,null,bindingMode);
      //              selection.data("model", modelName);
      //              selection.data("path",fieldPath);
      //              selection.attachChange(oController.getDescription.bind(oController));
      //              selection.setMaxLength(60);
      //              }else {
      selection.bindValue(this._setValModel + ">" + dataPath, null, bindingMode);
      //              }

      selection.attachValueHelpRequest(oControl.onValueHelpRequest.bind(oControl));
      selection.data("model", oControl.getModelName());
      selection.data("path", fieldPath);
      selection.data("dataArea", dataArea);
      oControl.bindTypeAheadField(selection, fieldPath, field);
      selection.attachChange(oControl._onSetValueChange.bind(oControl));
      break;

    case global.vui5.cons.element.dropDown:
      selection = new global.vui5.ui.controls.ComboBox({
      });
      selection.bindAggregation("items", global.vui5.modelName + '>' + "/DROPDOWNS/" + dataArea + "/" + field['FLDNAME'], function(sid, oContext) {
        var contextObject = oContext.getObject();
        return new sap.ui.core.Item({
          key : contextObject['NAME'],
          text : contextObject['VALUE']
        });
      });
      selection.bindProperty("selectedKey", this._setValModel + ">" + dataPath, null, bindingMode);
      selection.attachSelectionChange(oControl._onSetValueChange.bind(oControl));
      break;

    case global.vui5.cons.element.checkBox:
      selection = new sap.m.CheckBox({
        select : [ oController._onCheckBoxSelect, oController ],
        selected : "{= ${" + this._setValModel + ">" + dataPath + "} === 'X' }"
      });
      selection.attachSelect(oControl._onSetValueChange.bind(oControl));
      selection.data("model", this._setValModel);
      break;

    default:
      selection = new sap.m.Input({
        showValueHelp : false,
        maxLength : parseInt(field['OUTPUTLEN'])
      });

      oControl.setFieldType(selection, field);
      oControl._setValuesFieldCheck(selection, field);

      //          if(field['SDSCR'] == global.vui5.cons.fieldValue.description
      //          || field['SDSCR'] == global.vui5.cons.fieldValue.value_cont_descr) {
      //          selection.bindValue(modelName + ">" + dataPath + field['TXTFL'] ,null,bindingMode);
      //          selection.data("model", modelName);
      //          selection.data("path",fieldPath);
      //          selection.attachChange(oController.getDescription.bind(oController));
      //          selection.setMaxLength(60);
      //          }else {
      selection.bindValue(this._setValModel + ">" + dataPath, null, bindingMode);
      //          }
      break;
    }
    selection.data("element",selection);
    /*** Rel 60E SP7 - Empty operation support for setvalues - Start***/
    var arr = dataPath.split('/');
    var conditionIndex = arr[2];
    selection.bindProperty("visible", {
    	parts: [{path: oControl._setValModel + ">/CONDITIONS/" + conditionIndex +"/RELOP"}],
    	formatter: function(relop){
    		return relop !== 'NV' && relop !== 'HV';
    	}
    });
    /*** Rel 60E SP7 - Empty operation support for setvalues - End ***/
    return selection;
  };

  /* On Field Change, re-create Set Field Data Controls*/
  S.prototype._onSetFieldChange = function(oEvent) {
    var oControl = this;
    //        var oController = oControl.getController();

    var selectedField = oControl._setField.getSelectedKey();

    var grid = oControl.getContent()[0].getContent()[0];
    grid.setDefaultSpan("L2 M4 S12");
    var content = grid.getContent();
    var valueField = content[2];
   // var index = grid.indexOfContent(valueField);
    var index  = 2;
    var unitIndex = 3;
    if(valueField.data("element")){
    	//var index = grid.indexOfContent(valueField);
	    grid.removeContent(valueField);
	    valueField.destroy();
    }
    
    if (oControl._unitAdded) {
      var valueField = content[3];
      grid.removeContent(valueField);
      valueField.destroy();
      oControl._unitAdded = false;
    }
//    else {
//      var unitIndex = 3;
//    }

    var setValuesModel = oControl.getModel(oControl._setValModel);

    if (selectedField == "") {
      setValuesModel.setProperty("/VISIBLE", false);
    } else {
      setValuesModel.setProperty("/VISIBLE", true);

      var model = oControl.getModel(oControl.getModelName());
      var fields = model.getProperty(oControl.getFieldPath());

      var field = underscoreJS.find(fields, {
        'FLDNAME' : selectedField
      });
      var fieldIndex = underscoreJS.indexOf(fields, field);
      if (field) {
        oControl._dropdownsPrepare(field['DATATYPE']);
        oControl._clearData();
        var fieldPath = oControl.getFieldPath() + fieldIndex;
        var dataPath = "/DATA/VALUE";
        var valueField = this._createFieldControl(fieldPath, dataPath);
        if (field['DATATYPE'] == global.vui5.cons.dataType.amount || field['DATATYPE'] == global.vui5.cons.dataType.quantity) {
          if (field['DATATYPE'] == global.vui5.cons.dataType.amount) {
            var dPath = "/DATA/WAERS";
            var fldName = "WAERS";
          } else {
            var dPath = "/DATA/MEINS";
            var fldName = "MEINS";
          }
          var selection = this._createCurrencyField(fldName, dPath);
        }
        //              setValuesModel.setProperty("/DATA/DATATYPE",field['DATATYPE']);
        if (valueField) {
          grid.insertContent(valueField, index);
        } else {
          var valueField = new sap.m.Input({
          }).bindValue(oControl._setValModel + ">/DATA/VALUE");
          grid.insertContent(valueField, index);
        }
        if (selection) {
          grid.insertContent(selection, unitIndex);
          oControl._unitAdded = true;
        }

        if (field['DISABLED'] == "")
          {
          setValuesModel.setProperty("/DATA/EDIT", "X");
          }
        else
          {
          setValuesModel.setProperty("/DATA/EDIT", "");
          }
      }
    }

  };
  S.prototype._onOpChange = function(oEvent){
      
      var oControl = this,selectedField,grid,content,index,unitIndex,valueField,dataPath,model,
          setValuesModel,fields,field,fieldIndex,fieldPath;
          selectedField = oControl._setField.getSelectedKey();
           grid = oControl.getContent()[0].getContent()[0];
           content = grid.getContent();
           index  = 2;
           unitIndex = 3;
           valueField = content[2];
           dataPath = "/DATA/VALUE";
           model = oControl.getModel(oControl.getModelName());
           setValuesModel = this.getModel(this._setValModel);
           fields = model.getProperty(oControl.getFieldPath());
           field = underscoreJS.find(fields, {
             'FLDNAME' : selectedField
           });
           fieldIndex = underscoreJS.indexOf(fields, field);
           fieldPath = oControl.getFieldPath() + fieldIndex;
           var bindingMode = sap.ui.model.BindingMode.TwoWay;
           var unitMethod = oControl.getProperty("controller").getMainModel().getProperty("/DROPDOWNS/" + global.vui5.cons.dropdownsDatar + "/CUNIT")
           
        if(field['DATATYPE'] == global.vui5.cons.dataType.date){
                  grid.removeContent(valueField);
                   valueField.destroy();
                   setValuesModel.setProperty(dataPath,"");
          if(oEvent.getSource().getSelectedKey() == "I" || oEvent.getSource().getSelectedKey() == "D"){
                   var selection = new sap.m.Input({
                         showValueHelp : false
                   });
                   selection.data("element",selection)
                   selection.setType(sap.m.InputType.Number);
                   oControl.getController().checkNumericValue(selection);
                   selection.bindValue(this._setValModel + ">" + dataPath, null, bindingMode);
                   grid.insertContent(selection, index);
                   setValuesModel.setProperty("/SHOWUNIT", true);
                   oControl._unitField.setEditable(false);
                       var item = oControl._unitField.getItemByKey("D"); 
                        if(item){
                            oControl._unitField.setSelectedKey("D");
                        }
              
              }
              else{
                  var valueField = this._createFieldControl(fieldPath, dataPath);
                  grid.insertContent(valueField, index);
                  setValuesModel.setProperty("/SHOWUNIT", false);
              } 
          }
 };
  S.prototype._clearData = function() {
    var model = this.getModel(this._setValModel);
    model.setProperty("/DATA/CMETH", "S");
    model.setProperty("/DATA/VALUE", "");
    model.setProperty("/DATA/CUNIT", "A");
    model.setProperty("/DATA/WAERS", "");
    model.setProperty("/DATA/MEINS", "");
  };

  S.prototype._dropdownsPrepare = function(datatype) {
    var model = this.getModel(this._setValModel);
    var oControl = this;
    /****Rel 60E SP6 QA #10463 - Start **/
    //var computeMethod = model.getProperty("/DROPDOWNS/" + global.vui5.cons.dropdownsDatar + "/CMETH");
    var computeMethod = oControl.getProperty("controller").getMainModel().getProperty("/DROPDOWNS/" + global.vui5.cons.dropdownsDatar + "/CMETH");
    var unitMethod = oControl.getProperty("controller").getMainModel().getProperty("/DROPDOWNS/" + global.vui5.cons.dropdownsDatar + "/CUNIT");
    /****Rel 60E SP6 QA #10463 - End **/
    //oControl.getProperty("controller").getMainModel()
    if (computeMethod) {
      oControl._compMethod.removeAllItems();
      underscoreJS.each(computeMethod, function(obj) {
        if (obj['NAME'] == "I" || obj["NAME"] == "D") {
          if (datatype == global.vui5.cons.dataType.character || datatype == global.vui5.cons.dataType.currencyKey || datatype == global.vui5.cons.dataType.language || datatype == global.vui5.cons.dataType.raw
            || datatype == global.vui5.cons.dataType.sstring || datatype == global.vui5.cons.dataType.string || datatype == global.vui5.cons.dataType.time || datatype == global.vui5.cons.dataType.unit) {
            var skipAdd = true;
          } else {
            var skipAdd = false;
          }
        } else {
          var skipAdd = false;
        }

        if (!skipAdd) {
          oControl._compMethod.addItem(new sap.ui.core.Item({
            key : obj['NAME'],
            text : obj['VALUE']
          }));
        }
      });
    }
    if (unitMethod) {
        oControl._unitField.removeAllItems();
        if(datatype !== global.vui5.cons.dataType.date){
        underscoreJS.each(unitMethod, function(obj) {
          if (obj['NAME'] == "D"){
              var skipAdd = true;
            
          } else {
            var skipAdd = false;
          }
 
          if (!skipAdd) {
            oControl._unitField.addItem(new sap.ui.core.Item({
              key : obj['NAME'],
              text : obj['VALUE']
            }));
          }
        });
      }
        else{
             underscoreJS.each(unitMethod, function(obj) {
                   oControl._unitField.addItem(new sap.ui.core.Item({
                     key : obj['NAME'],
                     text : obj['VALUE']
                   }));
                 
               });
        } 
        oControl._unitField.setEditable(true);
        oControl._unitField.setSelectedKey("")
    }

    if (datatype == global.vui5.cons.dataType.date || datatype == global.vui5.cons.dataType.character || datatype == global.vui5.cons.dataType.currencyKey ||
    	 datatype == global.vui5.cons.dataType.language || datatype == global.vui5.cons.dataType.raw
      || datatype == global.vui5.cons.dataType.sstring || datatype == global.vui5.cons.dataType.string || datatype == global.vui5.cons.dataType.time || datatype == global.vui5.cons.dataType.unit) {
      model.setProperty("/SHOWUNIT", false);
    } else {
      model.setProperty("/SHOWUNIT", true);
    }
  };

  S.prototype._onConFieldChange = function(oEvent) {
    var oControl = this;
    //        var oController = oControl.getController();

    var source = oEvent.getSource();
    var dataPath = source.getBindingContext(oControl._setValModel).getPath();
    var model = oControl.getModel(oControl._setValModel);
    var parts = dataPath.split("/");
    var index = parts[parts.length - 1];
    var object = model.getProperty(dataPath);
    var selectedField = object['FLDNM'];

    var grid = oControl.getContent()[1].getContent()[index];
    var content = grid.getContent();
    var valueField = content[2];
    var index = grid.indexOfContent(valueField);
    grid.removeContent(valueField);
    valueField.destroy();

    //        var setValuesModel = oControl.getModel(oControl._setValModel);

    if (selectedField != "") {

      var model = oControl.getModel(oControl.getModelName());
      var fields = model.getProperty(oControl.getFieldPath());

      var field = underscoreJS.find(fields, {
        'FLDNAME' : selectedField
      });
      var fieldIndex = underscoreJS.indexOf(fields, field);
      if (field) {
        var fieldPath = oControl.getFieldPath() + fieldIndex;
        var path = dataPath + "/FLDVL";
        var valueField = this._createFieldControl(fieldPath, path);

        if (valueField) {
          grid.insertContent(valueField, index);
        } else {
          var valueField = new sap.m.Input({
          }).bindValue(oControl._setValModel + ">" + dataPath + "/FLDVL");
          grid.insertContent(valueField, index);
        }
        object['SHDEL'] = true;
        object['TABNM'] = field['TABNAME'];
        model.setProperty(dataPath, object);
      }
    }
  };

  S.prototype._onApply = function() {

    var oControl = this;
    var model = this.getModel(this._setValModel);
    var dataModel = this.getModel(this.getModelName());

    var setData = model.getProperty("/DATA");
    var conditionData = model.getProperty("/CONDITIONS");
    var dataArea = dataModel.getProperty(this.getDataAreaPath());

    var postData = {
      "SET_DATA" : setData,
      "CONDITIONS" : conditionData
    //              "FIELDS": dataModel.getProperty(this.getFieldPath()),
    };

    oControl.fireOnApply({
      "DATA" : postData
    });

  };

  S.prototype._onSetValueChange = function() {};

  /*Check Field Properties*/
  S.prototype._setValuesFieldCheck = function(selection, field) {
    var oController = this.getController();

    if (field['INTTYPE'] == global.vui5.cons.intType.number) {
    	 selection.attachChange(function(oEvent){
             oController._checkNumericField(oEvent);
         })
    } else if (field['INTTYPE'] == global.vui5.cons.intType.packed) {
    	 selection.attachChange(function(oEvent){
    		 oController.checkPackedField(oEvent);
         })
    } else if (field['INTTYPE'] == global.vui5.cons.intType.integer) {
    	selection.attachChange(function(oEvent){
    		oController.checkIntegerField(oEvent);
        })
     }

  };


  S.prototype.setFieldType = function(selection, fieldInfo) {
    //      var oController = this.getController();
    //      if(fieldInfo['SDSCR'] == global.vui5.cons.fieldValue.value
    //      || fieldInfo['SDSCR'] == global.vui5.cons.fieldValue.value_descr) {
    if (fieldInfo['INTTYPE'] == global.vui5.cons.intType.number ||
      //              fieldInfo['INTTYPE'] == global.vui5.cons.intType.integer ||
      fieldInfo['INTTYPE'] == global.vui5.cons.intType.oneByteInteger ||
      fieldInfo['INTTYPE'] == global.vui5.cons.intType.twoByteInteger ||
      //              fieldInfo['INTTYPE'] == global.vui5.cons.intType.packed ||
      fieldInfo['INTTYPE'] == global.vui5.cons.intType.float ||
      fieldInfo['INTTYPE'] == global.vui5.cons.intType.decimal16 ||
      fieldInfo['INTTYPE'] == global.vui5.cons.intType.decimal32) {
      selection.setType(sap.m.InputType.Number);
    }
  //      }
  };

  S.prototype.bindTypeAheadField = function(selection, fieldPath, fieldInfo) {
    var oControl = this;
    var oController = this.getController();
    selection.setShowSuggestion(true);
    selection.setFilterSuggests(false);

    if (fieldInfo['INTLEN'] == 1)
      {
      selection.setStartSuggestion(1);
      }
    else
      {
      selection.setStartSuggestion(2);
      }

    selection.setMaxSuggestionWidth("50%");

    selection.attachSuggest(function(oEvent) {
      var source = oEvent.getSource();

      var model = source.getModel(source.data("model"));
      var fieldInfo = model.getProperty(source.data("path"));

      oEvent.mParameters['eventType'] = global.vui5.cons.fieldSubEvent.typeAhead;
      oEvent.mParameters['fieldInfo'] = fieldInfo;
      oEvent.mParameters['fieldValue'] = oEvent.getParameter('suggestValue');
      oEvent.mParameters['oEvent'] = oEvent;
      oControl.preProcessFieldEvent(oEvent);

      source.bindAggregation("suggestionColumns", global.vui5.modelName + ">/TYPEAHEAD/" + fieldInfo['FLDNAME'] + "/FIELDS", function(sid, oContext) {
        var contextObject = oContext.getObject();
        return new sap.m.Column({
          header : new sap.m.Text({
            text : contextObject['LABEL']
          })
        });
      });
      source.bindAggregation("suggestionRows", global.vui5.modelName + ">/TYPEAHEAD/" + fieldInfo['FLDNAME'] + "/DATA", function(sid, oContext) {
        var contextObject = oContext.getObject();
        var model = oControl.getModel(global.vui5.modelName);
        var fields = model.getProperty("/TYPEAHEAD/" + fieldInfo['FLDNAME'] + "/FIELDS");
        var cells = [];
        underscoreJS.each(fields, function(obj) {
          var label = new sap.m.Label({
            text : contextObject[obj['FLDNAME']]
          });
          cells.push(label);
        });
        var listItem = new sap.m.ColumnListItem({
          vAlign : sap.ui.core.VerticalAlign.Middle,
          cells : cells
        });
        return listItem;
      });
    });

    selection.attachSuggestionItemSelected(function(oEvent) {
      oControl.handleSuggestionItemSelected(oEvent);
    });

    selection.data("model", oControl.getModelName());
    selection.data("path", fieldPath);
  };

  S.prototype.handleSuggestionItemSelected = function(oEvent) {
    var oControl = this;
    var mainModel = oControl.getProperty("controller").getMainModel();
    var source = oEvent.getSource();
    var model = source.getModel(source.data("model"));
    var fieldInfo = model.getProperty(source.data("path"));
    var item = oEvent.getParameter("selectedRow");
    var rowData = item.getBindingContext(global.vui5.modelName).getObject();
    var returnField = mainModel.getProperty("/TYPEAHEAD/" + fieldInfo['FLDNAME'] + "/RETURNFIELD");
    var descrField = mainModel.getProperty("/TYPEAHEAD/" + fieldInfo['FLDNAME'] + "/DESCRFIELD");
    source.setValue(rowData[returnField]);
    /*Description Buffer Changes*/
    if (descrField && descrField != '') {
      var descriptionBuffer = mainModel.getProperty("/DESCRIPTION_BUFFER");
      var bufferEntry = underscoreJS.find(descriptionBuffer, {
        'FLDNAME' : fieldInfo['FLDNAME'],
        'TABNAME' : fieldInfo['TABNAME'],
        'FLDVAL' : rowData[returnField]
      });
      if (bufferEntry) {
        bufferEntry['DESCRIPTION'] = rowData[descrField];
      } else {
        descriptionBuffer.push({
          'FLDNAME' : fieldInfo['FLDNAME'],
          'TABNAME' : fieldInfo['TABNAME'],
          'FLDVAL' : rowData[returnField],
          'DESCRIPTION' : rowData[descrField]
        });
      }
    }
    source.fireChange();
  };



  S.prototype._onAddCondition = function() {

    var model = this.getModel(this._setValModel);
    var conditions = model.getProperty("/CONDITIONS");
    underscoreJS.each(conditions, function(obj, index) {
      obj['SHADD'] = false;
      obj['SHDEL'] = true;
      obj['SHLOP'] = true;
    });
    if (conditions[conditions.length - 1]['LOGOP'] == "") {
      conditions[conditions.length - 1]['LOGOP'] = "AND";
    }
    conditions.push(underscoreJS.clone(this._conditionObject));
    model.setProperty("/CONDITIONS", conditions);
  };

  S.prototype._onDeleteCondition = function(oEvent) {
    var oControl = this;
    //        var oController = oControl.getController();

    var source = oEvent.getSource();
    var dataPath = source.getBindingContext(oControl._setValModel).getPath();
    var model = oControl.getModel(oControl._setValModel);
    var parts = dataPath.split("/");
    var index = parts[parts.length - 1];
    var conditions = model.getProperty("/CONDITIONS");

    if (index > 1) {
      conditions[index - 1]['SHDEL'] = true;
    }

    var data = underscoreJS.reject(conditions, function(obj, i) {
      return i == index;
    });
    if (data.length == 0) {
      data = [];
      data.push(underscoreJS.clone(oControl._conditionObject));
    } else {
      data[data.length - 1]['LOGOP'] = "";
      data[data.length - 1]['SHLOP'] = false;
    }
    model.setProperty("/CONDITIONS", data);
  };

  S.prototype._createCurrencyField = function(fieldName, dataPath) {
    //        var model = this.getModel(this._setValModel);
    var oControl = this;
    var selection;
    if (fieldName) {
      selection = new global.vui5.ui.controls.ComboBox().bindProperty("selectedKey", oControl._setValModel + ">" + dataPath);
      selection.bindAggregation("items",global.vui5.modelName + ">" + "/DROPDOWNS/" + global.vui5.cons.dropdownsDatar +"/"+ fieldName, function(sid, oContext) {
        var contextObject = oContext.getObject();

        return new sap.ui.core.Item({
          key : contextObject['NAME'],
          text : contextObject['VALUE']
        });
      });
    }
    return selection;
  };


  S.prototype.onValueHelpRequest = function(oEvent) {

    var source = oEvent.getSource();
    var model = source.getModel(source.data("model"));
    var fieldInfo = model.getProperty(source.data("path"));

    this.fireOnValueHelpRequest({
      oEvent : oEvent,
      fieldInfo : fieldInfo
    });
  };
  return S;
}, true);