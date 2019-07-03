sap.ui.define(["sap/ui/core/Control", vistexConfig.rootFolder + "/ui/core/global", vistexConfig.rootFolder + "/ui/core/underscore-min"],
    function (control, global, underscoreJS) {

        var M = control.extend(vistexConfig.rootFolder + ".ui.controls.MultiValue", {
            metadata: {
                library: vistexConfig.rootFolder + ".ui",
                properties: {
                    modelName: {
                        type: "string",
                        defaultValue: null
                    },
                    elementType: {
                        type: "string",
                        defaultValue: null
                    },
                    sectionPath: {
                        type: "string"
                    },
                    fieldPath: {
                        type: "string"
                    },
                    dataPath: {
                        type: "string"
                    },
                    commaSeparator: {
                        type: "boolean",
                        defaultValue: true
                    },
                    enabled: {
                        type: "boolean"
                    },
                    editable: {
                        type: "boolean"
                    },
                    dataAreaID: {
                        type: "string"
                    }
                },
                aggregations: {
                    _multiValue: {
                        type: "sap.ui.core.Control",
                        multiple: false,
                        visibility: "hidden"
                    }
                },
                events: {
                    onInputChange: {}
                }
            },

            init: function () {
                multiValueRender = function (oControl) {
                };


                multiValueRender.prototype = {
                    onAfterRendering: function (oEvent) {
                        var vuiControl = oEvent.srcControl.data("vuiControl");
                        var selection = vuiControl.selection;
                        var mode = vuiControl.getModel(global.vui5.modelName).getProperty("/DOCUMENT_MODE");
                        var fieldInfo = vuiControl.getModel(vuiControl.getModelName()).getProperty(vuiControl.getProperty("fieldPath"));
                        if (selection instanceof sap.m.MultiInput) {
                            vuiControl.selection.setEditable(true);
                            //fieldValue check is getting raised
                            /** to enable  'more' functionality**/
                            vuiControl.selection.setEnabled(true);
                            if (fieldInfo['DISABLED'] || mode === 'A') {
                                selection.setEnableMultiLineMode(true);
                                $('#' + oEvent.srcControl.getId()).find("input").attr("readonly", true);
                                //***Rel 60E SP7 QA #12093**//
                            	vuiControl.selection.setShowValueHelp(false);
                                /**Hiding ValueHelp icon**/
                                //$('#' + oEvent.srcControl.getId()).find(".sapMInputValHelpInner ").hide();
                                if($('#' + oEvent.srcControl.getId()).find(".sapMInputValHelpInner ").length){
                                	$('#' + oEvent.srcControl.getId()).find(".sapMInputValHelpInner ").hide();
                                }
                                else{
                                	$('#' + oEvent.srcControl.getId()).find(".sapMInputBaseIcon").hide()
                                }
                               /*** Removing Border of MultiInput**/
                                //$('#' + oEvent.srcControl.getId()).find(".sapMMultiInputBorder").addClass("vuiMultiInputReadOnly");
                               if(sap.ui.version > "1.60"){
                                  $('#' + oEvent.srcControl.getId()).find(".sapMInputBaseContentWrapper").addClass("vuiMultiInputReadOnly");
	                              }
	                              else{
	                            	  $('#' + oEvent.srcControl.getId()).find(".sapMMultiInputBorder").addClass("vuiMultiInputReadOnly")
	                              } 
                                //***//
                            }
                            else {
                                $('#' + oEvent.srcControl.getId()).find("input").attr("readonly", false);
                                
                                /***Rel 60E SP7 QA #12093**/
                                //$('#' + oEvent.srcControl.getId()).find(".sapMInputValHelpInner ").show();
                            	if($('#' + oEvent.srcControl.getId()).find(".sapMInputValHelpInner ").length){
                                	$('#' + oEvent.srcControl.getId()).find(".sapMInputValHelpInner ").show();
                                }
                                else{
                                	$('#' + oEvent.srcControl.getId()).find(".sapMInputBaseIcon").show()
                                }
                               // $('#' + oEvent.srcControl.getId()).find(".sapMMultiInputBorder").removeClass("vuiMultiInputReadOnly");
                            	if(sap.ui.version > "1.60"){
                                    $('#' + oEvent.srcControl.getId()).find(".sapMInputBaseContentWrapper").removeClass("vuiMultiInputReadOnly");
  	                              }
  	                            else{
  	                            	  $('#' + oEvent.srcControl.getId()).find(".sapMMultiInputBorder").removeClass("vuiMultiInputReadOnly")
  	                              }
                            	/***/
                            }
                        }
                        else if (selection instanceof sap.m.MultiComboBox) {
                            if (fieldInfo['DISABLED'] || mode === 'A') {
                                vuiControl.selection.setEditable(false);
                                $('#' + oEvent.srcControl.getId()).addClass("vuiMultiComboBoxReadOnly");
                            }
                            else {
                                $('#' + oEvent.srcControl.getId()).removeClass("vuiMultiComboBoxReadOnly");
                            }
                        }

                        //$('#' + oEvent.srcControl.getId()).find("input").attr("readonly", true)

                    }
                };

            },
            renderer: function (oRM, oControl) {
                oRM.write("<div");
                oRM.writeControlData(oControl);
                oRM.write(">");
                oRM.renderControl(oControl.getAggregation("_multiValue"));
                oRM.write("</div>");
            }

        });

        M.prototype.setModelName = function (value) {
            this.setProperty("modelName", value, true);
        };

        M.prototype.setMaxLength = function (value) {
            this.setProperty("maxLength", value, true);
        };

        M.prototype.setElementType = function (value) {
            this.setProperty("elementType", value, true);
        };

        M.prototype.setSectionPath = function (value) {
            this.setProperty("sectionPath", value, true);
        };

        M.prototype.setFieldPath = function (value) {
            this.setProperty("fieldPath", value, true);
        };
        M.prototype.setDataPath = function (value) {
            this.setProperty("dataPath", value, true);
        };
        M.prototype.setCommaSeparator = function (value) {
            this.setProperty("commaSeparator", value, true);
        };
        M.prototype.setEnabled = function (value) {
            this.setProperty("enabled", value, true);
        };
        M.prototype.setEditable = function (value) {
            this.setProperty("editable", value, true);
        };
        M.prototype.setDataAreaID = function (value) {
            this.setProperty("dataAreaID", value, true);
        };


        M.prototype.prepareField = function () {

            var oControl = this;
            if (oControl.getProperty("elementType") === global.vui5.cons.element.valueHelp
                || oControl.getProperty("elementType") === global.vui5.cons.element.input) {
                return oControl.prepareMultiValueHelpField();
            }
            else if (oControl.getProperty("elementType") === global.vui5.cons.element.dropDown) {
                return oControl.prepareMultiDropdownField();
            }

        };

        M.prototype.prepareMultiDropdownField = function () {
            var oControl = this, mainModel, selection, fieldInfo, keyField,
                dataPath, comboBoxControl, propertyName, dropdownPath, selectedKeys, finalKeys, currentModel, fullDataPath;
            currentModel = oControl.getModel(oControl.getProperty("modelName"));
            fieldInfo = oControl.getModel(oControl.getProperty("modelName")).getProperty(oControl.getProperty("fieldPath"));
            mainModel = oControl.getModel(global.vui5.modelName);
            dataPath = oControl.getProperty("commaSeparator") ? oControl.getModelName() + ">" + oControl.getDataPath() + global.vui5.cons.multiValueField :
                oControl.getModelName() + ">" + oControl.getDataPath();

            //comboBoxControl = oControl.getEnableMultiValue() ? sap.m.MultiComboBox : global.vui5.ui.controls.ComboBox;
            //propertyName = oControl.getEnableMultiValue() ? "selectedKeys" : "selectedKey";
            dropdownPath = global.vui5.modelName + ">/DROPDOWNS/" + oControl.getDataAreaID() + "/" + fieldInfo['FLDNAME']

            keyField = fieldInfo['MVLFLD'] ? fieldInfo['MVLFLD'] : fieldInfo['FLDNAME'];
            oControl.selection = selection = new sap.m.MultiComboBox({
                width: "100%",
                editable: oControl.getEditable(),
                enabled: oControl.getEnabled(),
                selectionChange: function (oEvent) {
                    finalKeys = [];
                    selectedKeys = oEvent.getSource().getSelectedKeys();
                    if (oEvent.getSource().data("fromNonResponsive")) {
                        if (oEvent.getSource().getBindingContext(oControl.getProperty("modelName"))) {
                            fullDataPath = oEvent.getSource().getBindingContext(oControl.getProperty("modelName")).getPath();
                            fullDataPath = fullDataPath + "/" + oControl.getDataPath();
                        }
                    }
                    else {
                        fullDataPath = oControl.getDataPath();
                    }
                    underscoreJS.each(selectedKeys, function (key, index) {

                        finalKeys[index] = {};
                        finalKeys[index][keyField] = key;
                    });
                    currentModel.setProperty(fullDataPath, finalKeys);

                },
            });
            selection.bindProperty("selectedKeys", {
                parts: [{ path: oControl.getModelName() + ">" + oControl.getDataPath() }],
                formatter: function (keyValues) {
                    if (keyValues && underscoreJS.isEmpty(keyValues)) {
                        return [];
                    }
                    else {
                        return underscoreJS.pluck(keyValues, keyField);
                    }
                }
            })
            //selection.bindProperty("selectedKeys", oControl.getDataPath());

            selection.bindAggregation("items", dropdownPath, function (sid, oContext) {
                var contextObject = oContext.getObject();
                return new sap.ui.core.Item({
                    key: contextObject['NAME'],
                    text: contextObject['VALUE']
                });
            });
            selection.addEventDelegate(new multiValueRender(selection));

            selection.vuiParentControl = oControl;
            selection.data("vuiControl", oControl);


            return selection;

        };

        M.prototype.prepareMultiValueHelpField = function () {


            var oControl = this, mainModel, selection, fieldInfo, dataPath;
            fieldInfo = oControl.getModel(oControl.getProperty("modelName")).getProperty(oControl.getProperty("fieldPath"));
            mainModel = oControl.getModel(global.vui5.modelName);
            dataPath = oControl.getProperty("commaSeparator") ? oControl.getModelName() + ">" + oControl.getDataPath() + global.vui5.cons.multiValueField :
                oControl.getModelName() + ">" + oControl.getDataPath();


            oControl.selection = selection = new sap.m.MultiInput({
                showValueHelp: oControl.getProperty("elementType") === global.vui5.cons.element.valueHelp,
                maxLength: parseInt(fieldInfo['OUTPUTLEN']),
                enableMultiLineMode: false,//SAP Guideline not to show MultiLineMode in Form/Table
                tokenChange: [oControl.onMultiF4Select, oControl],
                change: [oControl.onInputChange, oControl],
                editable: oControl.getEditable(),
                enabled: oControl.getEnabled()
            });

            if (fieldInfo['SDSCR'] === global.vui5.cons.fieldValue.description ||
                    fieldInfo['SDSCR'] === global.vui5.cons.fieldValue.value_cont_descr) {
                selection.setMaxLength(60);
            }
            selection.addEventDelegate(new multiValueRender(selection));

            selection.vuiParentControl = oControl;
            selection.data("vuiControl", oControl);
            selection.addValidator(function (args) {
                if (args.suggestionObject) {
                    var data = mainModel.getProperty("/TYPEAHEAD");
                    var key;
                    if (data) {
                        var returnField = data[fieldInfo['FLDNAME']]['RETURNFIELD'];
                        var fieldInfo1 = underscoreJS.findWhere(data[fieldInfo['FLDNAME']]['FIELDS'], {
                            FLDNAME: returnField
                        });
                        var postn = underscoreJS.indexOf(data[fieldInfo['FLDNAME']]['FIELDS'], fieldInfo1);
                        if (!postn) {
                            postn = 0;
                        }
                        key = args.suggestionObject.getCells()[postn].getText();
                        return new sap.m.Token({
                            key: key,
                            text: key
                        });
                    } else {
                        key = args.suggestionObject.getCells()[0].getText();
                        return new sap.m.Token({
                            key: key,
                            text: key
                        });
                    }
                } else {
                    var text = args.text;
                    if (fieldInfo['LOWERCASE'] == '' && fieldInfo['INTTYPE'] == global.vui5.cons.intType.character) {
                        text = text.toUpperCase();
                    }
                    return new sap.m.Token({
                        key: text,
                        text: text
                    });
                }
            });

            selection.bindAggregation("tokens", dataPath, function (sId, oContext) {
                var keyField = fieldInfo['MVLFLD'] ? fieldInfo['MVLFLD'] : fieldInfo['FLDNAME'];
                var textField = fieldInfo['MTXFLD'] ? fieldInfo['MTXFLD'] : fieldInfo['TXTFL'];

                if (!textField) {
                    textField = keyField;
                }
                var token = new sap.m.Token({
                    key: oContext.getObject()[keyField],
                    text: oContext.getObject()[textField]

                });

                token.bindProperty("editable", {
                    parts: [{ path: oControl.getModelName() + ">" + oControl.getProperty("fieldPath") + "DISABLED" },
                            { path: global.vui5.modelName + ">/DOCUMENT_MODE" }],
                    formatter: function (disabled, mode) {
                        if (disabled || mode === 'A') {
                            return false;
                        }
                        else {
                            return true;
                        }
                    }
                });
                     token.setModel(oControl.getModel(oControl.getModelName()))
                     return token;
            });

            return selection;

        };

        M.prototype.onMultiF4Select = function (oEvent) {
            var oControl = this, descrValue, tokenValues = [];
            if (oEvent.getParameter("type") === "tokensChanged") {
                /*underscoreJS.each(oEvent.getSource().getTokens(), function (token) {
                    if (token.data("row")) {
                        descrValue = token.data("row")[oEvent.getSource().data("descrField")];
                    }
                    else if (token.getKey() !== token.getText()) {
                        descrValue = token.getText();
                    }
                    else {
                        descrValue = token.getKey();
                    }
                    tokenValues.push({
                        "NAME": token.getKey(),
                        "VALUE": descrValue
                    });
                });
                oEvent.getSource().data("tokenValues", tokenValues);*/
                oEvent.getSource().fireChange();
            }

        };

        M.prototype.onInputChange = function (oEvent) {
            var oControl = this, dataPath;
            var fieldInfo = oControl.getModel(oControl.getProperty("modelName")).getProperty(oControl.getProperty("fieldPath"));
            if (!oEvent.mParameters) {
                oEvent.mParameters = {};
            }
            if (oEvent.getSource().data("fromNonResponsive")) {
                if (oEvent.getSource().getBindingContext("infocusModel")) {
                    dataPath = oEvent.getSource().getBindingContext(oControl.getProperty("modelName")).getPath();

                    if (oControl.getProperty("commaSeparator")) {
                        oEvent.getSource().data("dataPath", dataPath + "/" + oControl.getDataPath() + global.vui5.cons.multiValueField);
                    }
                    else {
                        oEvent.getSource().data("dataPath", dataPath + "/" + oControl.getDataPath());
                    }

                }
            }
            else {
                dataPath = oEvent.getSource().getBinding("tokens").getPath();
                oEvent.getSource().data("dataPath", dataPath);
            }
            /*if (oEvent.getSource().getBindingContext("infocusModel")) {
                dataPath = oEvent.getSource().getBindingContext(oControl.getProperty("modelName")).getPath();
                oEvent.getSource().data("dataPath", dataPath + "/" + oControl.getDataPath() + global.vui5.cons.multiValueField);
            }
            else {
                dataPath = oControl.getDataPath();
            }*/
            oEvent.mParameters['fieldInfo'] = fieldInfo;
            oEvent.mParameters['dataPath'] = dataPath;
            oEvent.mParameters['selection'] = oEvent.getSource();

            this.fireOnInputChange({
                oEvent: oEvent
            });
        };

        M.prototype.getMultiValueDataPath = function (source) {
            var path, arr, fieldName;

            path = source.data("dataPath");

            if (this.getCommaSeparator()) {
                arr = path.split("/");
                fieldName = arr[arr.length - 1];
                if (fieldName.indexOf("_TXT") !== -1) {
                    multiValuePath = path.replace(oControl.fieldInfo['TXTFL'] + vui5.cons.multiValueField, oControl.fieldInfo['FLDNAME'] + vui5.cons.multiValueField);
                }
            }
            return path;
        };

        M.prototype.fillMultiValueField = function (source) {
            var oControl = this, fieldInfo, path, currentModel, multiValues = [];
            fieldInfo = oControl.getModel(oControl.getProperty("modelName")).getProperty(oControl.getProperty("fieldPath"));
            path = oControl.getMultiValueDataPath(source);
            currentModel = oControl.getModel(oControl.getProperty("modelName"));
            underscoreJS.each(source.getTokens(), function (tokenData, index) {
                multiValues[index] = {};

                if (fieldInfo['MVLFLD']) {
                    multiValues[index][fieldInfo['MVLFLD']] = tokenData.getKey();
                }
                else {
                    multiValues[index][fieldInfo['FLDNAME']] = tokenData.getKey();
                }

                if (fieldInfo['MTXFLD']) {
                    multiValues[index][fieldInfo['MTXFLD']] = tokenData.getText();
                }
                else if (fieldInfo['TXTFL']) {
                    multiValues[index][fieldInfo['TXTFL']] = tokenData.getText();
                }
            });
            if (oControl.getCommaSeparator()) {
                currentModel.setProperty(path, multiValues);
                path = path.replace(fieldInfo['FLDNAME'] + global.vui5.cons.multiValueField, fieldInfo['FLDNAME']);
                currentModel.setProperty(path, underscoreJS.pluck(multiValues, fieldInfo['FLDNAME']).join(","));
            }
            else {
                oControl.fillDescription({
                    path: path,
                    values: multiValues
                });
            }


            /*if (source.data("tokenValues") && oControl.getCommaSeparator()) {
                currentModel.setProperty(path, source.data("tokenValues"));
                path = path.replace(fieldInfo['FLDNAME'] + global.vui5.cons.multiValueField, fieldInfo['FLDNAME']);
                currentModel.setProperty(path, underscoreJS.pluck(source.data("tokenValues"), "KEY").join(","));
            }*/
        };

        M.prototype.fillDescription = function (config) {
            var oControl = this, fieldInfo, currentModel, path, newValue;
            path = config.path;
            newValue = config.values;
            currentModel = oControl.getModel(oControl.getModelName());
            fieldInfo = oControl.getModel(oControl.getProperty("modelName")).getProperty(oControl.getProperty("fieldPath"));
            if (oControl.getCommaSeparator()) {
                currentModel.setProperty(path, newValue);
                path = path.replace(fieldInfo['FLDNAME'] + global.vui5.cons.multiValueField, fieldInfo['FLDNAME']);
                currentModel.setProperty(path, underscoreJS.pluck(newValue, fieldInfo['FLDNAME']).join(","));
            }
            else {
                currentModel.setProperty(path, newValue);
            }
        };

        M.prototype.getValueForFieldValueCheck = function (config) {
            if (this.getCommaSeparator()) {
                return underscoreJS.pluck(config.newValue, "VALUE").join(",");
            }
        };

        M.prototype.postProcessFieldEvent = function (config) {
            var values = [];
            if (this.getCommaSeparator()) {
                underscoreJS.each(config.response['DESCR'].split(","), function (descr, index) {
                    values.push({
                        "VALUE": newValue[index]['KEY'],
                        "NAME": descr
                    });
                });

                return values;
            }

        };
        return M;
    });
