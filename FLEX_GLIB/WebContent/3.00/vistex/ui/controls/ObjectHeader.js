sap.ui.define([
    "sap/ui/core/Control",
    vistexConfig.rootFolder + "/ui/core/global",
    vistexConfig.rootFolder + "/ui/core/Formatter",
    vistexConfig.rootFolder + "/ui/core/underscore-min"
], function (control,global,Formatter,underscoreJS) {

    var A = control.extend(vistexConfig.rootFolder + ".ui.controls.ObjectHeader", {
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
                dataPath: {
                    type: "string",
                    defaultValue: null
                },
                dataAreaPath: {
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
            events: {
                messagesShow: {
                    parameters: {
                        selectionSet: {
                            type: "sap.ui.core.Control[]"
                        }
                    }
                },
                onLinkPress: {}
            },

            aggregations: {
                _getObjHeader: {
                    type: "sap.ui.core.Control",
                    multiple: false,
                    visibility: "hidden"
                }
            }

        },
        renderer: function (oRM, oControl) {
            oRM.write("<style>");
            oRM.write(".ObjectHeaderWithIntro{margin-top: 2% !important; padding:4px !important;}");
            oRM.write("</style>");
            oRM.write("<div");
            oRM.writeControlData(oControl);
            oRM.write(">");

            oRM.renderControl(oControl.getAggregation("_getObjHeader"));
            oRM.write("</div>");
        }
    });
    A.prototype.setModelName = function (value) {
        this.setProperty("modelName", value, true);
    };

    A.prototype.setDataPath = function (value) {
        this.setProperty("dataPath", value, true);
    };
    A.prototype.setTitlePath = function (value) {
        this.setProperty("titlePath", value, true);
    };
    A.prototype.setDataAreaPath = function (value) {
        this.setProperty("dataAreaPath", value, true);
    };
    A.prototype.setFieldsPath = function (value) {
        this.setProperty("fieldsPath", value, true);
    };
    //    A.prototype.setTitleSeparator = function (value) {
    //        this.setProperty("titleSeparator", value, true);
    //    };
    //    A.prototype.setSubTitleSeparator = function (value) {
    //        this.setProperty("subTitleSeparator", value, true);
    //    };
    A.prototype.getObjectHeader = function () {
        var oControl = this;
        var oController = this.getProperty("controller"),fullScreenOptimized;
        var modelName = this.getModelName();
        var dataPath = this.getDataPath();
        var dataareaID = dataPath.split("/")[2];
        var fieldsPath = this.getFieldsPath();
        var objModel = oController.getModel(modelName);
        var bundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls");
        var titlePath = this.getTitlePath();
        //        var tsPath = this.getProperty("titleSeparator");
        //        var stPath = this.getProperty("subTitleSeparator");
        
        fullScreenOptimized = underscoreJS.isEmpty(underscoreJS.findWhere(objModel.getProperty(fieldsPath), 
        		{'OBHCT':global.vui5.cons.objectHeaderCategory.numeric})) ||
        		underscoreJS.isEmpty(underscoreJS.findWhere(objModel.getProperty(fieldsPath), 
        				{'OBHCT':global.vui5.cons.objectHeaderCategory.status}));
        
        var oPath = modelName + ">" + dataPath;
        var oHeader = new sap.m.ObjectHeader({
            showMarkers: false,
            responsive: true,
            /***Rel 60E SP6 ECDM #4709 - Start **/
            //fullScreenOptimized: false,
            fullScreenOptimized: fullScreenOptimized,
            /***Rel 60E SP6 ECDM #4709 - End **/
            backgroundDesign: "Translucent"
        }).setModel(objModel, modelName);
        oHeader.setModel(oController.getModel(global.vui5.modelName), global.vui5.modelName);
        oHeader.bindProperty("title", modelName + ">" + titlePath + "TITLE", null, sap.ui.model.Binding.OneWay);
        oHeader.bindProperty("intro", modelName + ">" + titlePath + "SUBTITLE", null, sap.ui.model.Binding.OneWay);
        var valuePath, numberPath, numberUnitPath;

        underscoreJS.each(objModel.getProperty(fieldsPath), function (obj, index) {
            var currentFieldPath = modelName + ">" + fieldsPath + index + "/";
            switch (obj['OBHCT']) {
                /* case global.vui5.cons.objectHeaderCategory.title:
                     oHeader.bindProperty("title", {
                         parts: [{
                             path: modelName + ">" + fieldsPath
                         }, {
                             path: modelName + ">" + dataPath
                         },
                         {
                             path: tsPath
                         }
                         ],
                         formatter: objectHeaderFormatter.setTitle,
                         mode: sap.ui.model.BindingMode.OneWay
                     });
                     break;
 
                 case global.vui5.cons.objectHeaderCategory.subTitle:
                     oHeader.bindProperty("intro", {
                         parts: [{
                             path: modelName + ">" + fieldsPath
                         }, {
                             path: modelName + ">" + dataPath
                         },
                         {
                             path: stPath
                         }
                         ],
                         formatter: objectHeaderFormatter.setSubTitle,
                         mode: sap.ui.model.BindingMode.OneWay
                     });
                     break;
 */
                case global.vui5.cons.objectHeaderCategory.numeric:
   
                  var dPath = modelName + ">" + dataPath;
                    if (obj['CFIELDNAME'] != "") {
                        numberUnitPath = dPath + obj['CFIELDNAME'];
                    } else if (obj['QFIELDNAME'] != "") {
                        numberUnitPath = dPath + obj['QFIELDNAME'];
                    }
                    else if (obj['REF_FIELD'] != "") {
                        numberUnitPath = dPath + obj['REF_FIELD'];
                    }
                    if(numberUnitPath){
                      oHeader.bindProperty("numberUnit", numberUnitPath);
                    }
                        if (obj['FLDNAME'] != "") {
                            numberPath = currentFieldPath;
                        }
                        oHeader.bindProperty("number", {
                            parts: [
                               { path: dPath },
                               { path: numberPath },
                               { path: currentFieldPath + 'LABEL'}
                            ],
                            formatter: Formatter.objectNumericFormat,
                            mode: sap.ui.model.Binding.OneWay

                        });
                                     break;

                case global.vui5.cons.objectHeaderCategory.status:
                    valuePath = modelName + ">" + dataPath + obj['FLDNAME'];
                    var status = new sap.m.ObjectStatus();
                    status.setModel(objModel, oController.modelName);
                    status.setModel(oController.getModel(global.vui5.modelName), global.vui5.modelName);

                    //status.bindProperty("text" , valuePath);
                    status.bindProperty("text", {
                        parts: [
                          { path: valuePath },
                          { path: currentFieldPath }

                        ],
                        formatter: function (value, fieldInfo) {
                            return Formatter.valueText.call(this, value, fieldInfo, dataareaID);
                        },
                        mode: sap.ui.model.Binding.OneWay
                    });
                    status.bindProperty("state", {
                        parts: [
                           { path: valuePath },
                           { path: currentFieldPath }
                        ],
                        formatter: Formatter.stateText,
                        mode: sap.ui.model.Binding.OneWay

                    });
                    status.bindProperty('visible', currentFieldPath + "NO_OUT", function(val){
							return val === "X" ? false: true;
						}, sap.ui.model.BindingMode.OneWay);
                    
                    oHeader.addStatus(status);
                    break;

                case global.vui5.cons.objectHeaderCategory.attribute:
                    var refPath, attr, txtflPath;
                    var fieldPath = currentFieldPath;
                    valuePath = modelName + ">" + dataPath + obj['FLDNAME'];
                    if (obj['ELTYP'] == global.vui5.cons.element.dropDown) {
                        attr = new sap.m.ObjectAttribute();
                        attr.bindProperty("text", {
                            parts: [
                              { path: valuePath },
                              { path: fieldPath }

                            ],
                            formatter: function (value, fieldInfo) {
                                return Formatter.valueText.call(this, value, fieldInfo, dataareaID);
                            },
                            mode: sap.ui.model.Binding.OneWay
                        });
                    }
                    else if (obj['DATATYPE'] == global.vui5.cons.dataType.amount) {
                        refPath = modelName + ">" + dataPath + obj['CFIELDNAME'];

                        if (obj['TXTFL'] != '') {
                            txtflPath = modelName + ">" + dataPath + obj['TXTFL'];
                        } else {
                            txtflPath = valuePath;
                        }
                        attr = new sap.m.ObjectAttribute({
                            text: {
                                parts: [
                                        { path: txtflPath, mode: sap.ui.model.BindingMode.OneWay },
                                        { path: refPath, mode: sap.ui.model.BindingMode.OneWay }
                                ]
                            }
                        });
                    } else if (obj['DATATYPE'] == global.vui5.cons.dataType.quantity) {
                        refPath = modelName + ">" + dataPath + obj['QFIELDNAME'];

                        if (obj['TXTFL'] != '') {
                            txtflPath = modelName + ">" + dataPath + obj['TXTFL'];
                        } else {
                            txtflPath = valuePath;
                        }
                        attr = new sap.m.ObjectAttribute({
                            text: {
                                parts: [
                                        { path: txtflPath, mode: sap.ui.model.BindingMode.OneWay },
                                        { path: refPath, mode: sap.ui.model.BindingMode.OneWay }
                                ]
                            }
                        });
                    } else if (obj['DATATYPE'] == global.vui5.cons.dataType.decimal ||
                               obj['DATATYPE'].substr(0,3) == global.vui5.cons.dataType.integer) {
                        if (obj['TXTFL'] != '') {
                            txtflPath = modelName + ">" + dataPath + obj['TXTFL'];
                        } else {
                            txtflPath = valuePath;
                        }
                        attr = new sap.m.ObjectAttribute({
                            text: {
                                parts: [
                                    { path: txtflPath, mode: sap.ui.model.BindingMode.OneWay }
                                ]
                            }
                        });
                    } else if (obj['DATATYPE'] == global.vui5.cons.dataType.date) {
                        attr = new sap.m.ObjectAttribute({
                            text: {
                                path: valuePath,
                                mode: sap.ui.model.Binding.OneWay,
                                formatter: Formatter.dateFormat
                            }
                        });
                    }else if (obj['DATATYPE'] == global.vui5.cons.dataType.time) {
                        attr = new sap.m.ObjectAttribute({
                            text: {
                                path: valuePath,
                                mode: sap.ui.model.Binding.OneWay
                            }
                        });
                    } 
                    else {
                        attr = new sap.m.ObjectAttribute({
                            text: {
                                path: valuePath,
                                mode: sap.ui.model.Binding.OneWay
                            }
                        });
                        if (obj['SDSCR'] == global.vui5.cons.fieldValue.description || obj['SDSCR'] == global.vui5.cons.fieldValue.value_cont_descr) {
                            var descriptionPath = modelName + ">" + dataPath + "_" + obj['FLDNAME'] + "_TXT";
                            attr.bindProperty("text", descriptionPath, null, sap.ui.model.Binding.OneWay);
                        }
                        else if (obj['SDSCR'] == global.vui5.cons.fieldValue.value_descr) {

                            var descriptionPath = modelName + ">" + dataPath + "_" + obj['FLDNAME'] + "_TXT";

                            attr.bindProperty("text", {
                                parts: [
                                   { path: valuePath },
                                   { path: descriptionPath }
                                ],
                                formatter: Formatter.valueDesr,
                                mode: sap.ui.model.Binding.OneWay

                            });
                        }

                    }
                    if (obj['HDLBL'] == '') {
                        //attr.setTitle(obj['LABEL']);
                        attr.bindProperty("title", currentFieldPath + "LABEL", null, sap.ui.model.BindingMode.OneWay);
                    }
                    
                    attr.bindProperty('visible', currentFieldPath + "NO_OUT", function(val){
						return val === "X" ? false: true;
					}, sap.ui.model.BindingMode.OneWay);
                  
                    attr.setModel(oController.getModel(global.vui5.modelName), global.vui5.modelName);
                    attr.setModel(objModel, oController.modelName);
                    oHeader.addAttribute(attr);
                    break;

            }
        });
        //        oControl.setAggregation("_getObjHeader", oHeader);
        return oHeader;
    };

    /*  objectHeaderFormatter = {
          setTitle: function (fields, data, separator) {
              if (!data || !fields) { return; }
              var title, path;
              var titles = underscoreJS.where(fields, { "OBHCT": global.vui5.cons.objectHeaderCategory.title });
              underscoreJS.each(titles, function (obj, index) {
                  if (obj['SDSCR'] == global.vui5.cons.fieldValue.description || obj['SDSCR'] == global.vui5.cons.fieldValue.value_cont_descr) {
                      path = '_' + obj['FLDNAME'] + "_TXT";
                  }
                  else {
                      path = obj['FLDNAME'];
                  }
                  if (!title) {
                      title = data[path];
                  }
                  else {
                      if (separator) {
                          title = title + " " + separator + " " + data[path];
                      }
                      else {
                          title = title + " " + data[path];
                      }
                  }
              });
              return title;
          },
  
          setSubTitle: function (fields, data, separator) {
              if (!data || !fields) { return; }
              var subTitle, path;
              var subTitles = underscoreJS.where(fields, { "OBHCT": global.vui5.cons.objectHeaderCategory.subTitle });
              underscoreJS.each(subTitles, function (obj, index) {
                  if (obj['SDSCR'] == global.vui5.cons.fieldValue.description || obj['SDSCR'] == global.vui5.cons.fieldValue.value_cont_descr) {
                      path = '_' + obj['FLDNAME'] + "_TXT";
                  }
                  else {
                      path = obj['FLDNAME'];
                  }
                  if (!subTitle) {
                      subTitle = data[path];
                  }
                  else {
                      if (separator) {
                          subTitle = subTitle + separator + data[path];
                      }
                      else {
                          subTitle = subTitle + " " + data[path];
                      }
                  }
              });
              return subTitle;
          }
      }; */
    return A;
});