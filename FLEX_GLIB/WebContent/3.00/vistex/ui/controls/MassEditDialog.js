/**
 * 
 */

sap.ui.define(["sap/m/Dialog",
	"sap/ui/model/json/JSONModel",
	vistexConfig.rootFolder + "/ui/core/global",
	vistexConfig.rootFolder + "/ui/core/underscore-min",
	vistexConfig.rootFolder + "/ui/core/Formatter"],

	function (control, JSONModel, global, underscoreJS, Formatter) {

	    var M = control.extend(vistexConfig.rootFolder + ".ui.controls.MassEditDialog", {
	        metadata: {
	            library: vistexConfig.rootFolder + ".ui",
	            properties: {
	                modelName: {
	                    type: "string",
	                    defaultValue: null
	                },
	                dataAreaPath: {
	                    type: "string",
	                    defaultValue: null
	                },
	                fieldsPath: {
	                    type: "string"
	                },
	                layoutDataPath: {
	                    type: "string"
	                },
	                dataPath: {
	                    type: "string"
	                },
	                dropdownPath: {
	                    type: "string"
	                },
	                selectedSPaths: {
	                    type: "object"
	                },
	                enableApplyInBackground: {
	                    type: "boolean",
	                    defaultValue: false
	                }
	            },
	            events: {
	                onValueHelpRequest: {},
	                onInputChange: {},
	                onRequiredFieldsCheck: {},
	                onApplyBackground: {}
	            }

	        },

	        init: function () {
	            var oControl = this;
	            control.prototype.init.apply(this);
	            var sLocale = sap.ui.getCore().getConfiguration().getLanguage();
	            if (sLocale.length > 2) {
	                sLocale = sLocale.substring(0, 2);
	            }
	            this._oBundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls");
	            this.addStyleClass(sap.ui.Device.support.touch ? "sapUiSizeCozy" : "sapUiSizeCompact");




	            this.massEditModel = new JSONModel({
	                "DROPDOWNS": [],
	                "DATA": {},
	            });
	            this.amountRef = [];
	        },

	        renderer: function (oRM, control) {
	            jQuery.sap.require("sap.m.DialogRenderer");
	            sap.m.DialogRenderer.render(oRM, control);
	        }
	    });

	    M.prototype.setModelName = function (value) {
	        this.setProperty("modelName", value, true);
	    };

	    M.prototype.setFieldsPath = function (value) {
	        this.setProperty("fieldsPath", value, true);
	    };

	    M.prototype.setLayoutDataPath = function (value) {
	        this.setProperty("layoutDataPath", value, true);
	    };

	    M.prototype.setDataPath = function (value) {
	        this.setProperty("dataPath", value, true);
	    };

	    M.prototype.setDropdownPath = function (value) {
	        this.setProperty("dropdownPath", value, true);
	    };

	    M.prototype.setDataAreaPath = function (value) {
	        this.setProperty("dataAreaPath", value, true);
	    };

	    M.prototype.setEnableApplyInBackground = function (value) {
	        this.setProperty("enableApplyInBackground", value, true);
	    };

	    M.prototype.prepareMassEditForm = function () {
	        var oControl = this;
	        this.massEditData = [];
	        var applyButton = new sap.m.Button({
	            text: this._oBundle.getText("Apply"),
	            press: function () {
	                oControl.fireOnRequiredFieldsCheck();
	            }
	        });

	        if (!oControl.getEnableApplyInBackground()) {
	            applyButton.setType(sap.m.ButtonType.Emphasized);
	        }

	        var applyBackgroundButton = this.applyBackGroundButton = new sap.m.Button({
	            text: this._oBundle.getText("ApplyBackground"),
	            type: sap.m.ButtonType.Emphasized,
	            visible: oControl.getEnableApplyInBackground(),
	            press: function () {
	                oControl.fireOnRequiredFieldsCheck({
	                    background: true
	                });
	            }
	        });

	        var closeButton = new sap.m.Button({
	            text: this._oBundle.getText("Close"),
	            press: [this.close, this]
	        });

	        this.addButton(applyBackgroundButton);
	        this.addButton(applyButton);
	        this.addButton(closeButton);

	        this.prepareMassEditDataModel();
	        //    	oControl.setModel(oControl.getModel(oControl.getModelName()));
	        var infocusModel = oControl.getModel(oControl.getModelName());
	        // oControl.setTitle(this._oBundle.getText("MassEdit"));
	        columnL = 2;
	        columnM = 1;
	        emptyL = 0;
	        emptyM = 1;
	        var properties = {
	            layout: sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout,
	            editable: true,//true,
	            labelSpanL: 4,
	            labelSpanM: 4,
	            emptySpanL: 0,
	            emptySpanM: 1,
	            columnsL: 2,
	            columnsM: 1,
	            singleContainerFullSize: false,
	            adjustLabelSpan: true
	        }
	        //        var properties = {
	        //        		layout: sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout,
	        //        		labelSpanXL:3,
	        //				labelSpanL:3,
	        //				labelSpanM:3,
	        //				labelSpanS:12,
	        //				adjustLabelSpan:false,
	        //				emptySpanXL:4,
	        //				emptySpanL:4,
	        //				emptySpanM:4,
	        //				emptySpanS:0,
	        //				columnsXL:1,
	        //				columnsL:1,
	        //				columnsM:1,
	        //				singleContainerFullSize: false,
	        //        }
	        var massEditForm = new sap.ui.layout.form.SimpleForm(properties).setModel(oControl.getModel(oControl.getModelName()));

	        var fields = oControl.getModel(oControl.getModelName()).getProperty("/VUI_MASS_EDIT/FIELDS");
	        var showField = true;
	        underscoreJS.each(fields, function (field, index) {
	            colItem = underscoreJS.find(oControl.getModel(oControl.getModelName()).getProperty(oControl.getLayoutDataPath()).COLITEMS, { COLUMNKEY: field["FLDNAME"] });
	            if (colItem) {
	                showField = colItem["VISIBLE"] === "true" ? true : false
	            } else {
	                showField = field['NO_OUT'] === '' ? true : false;
	            }
	            if ((underscoreJS.findIndex(fields, function (fld) {
                        return field["FLDNAME"] === fld["CFIELDNAME"] || field["FLDNAME"] === fld["QFIELDNAME"]
	            }) === -1) && showField
                ) {
	                var massEditControl = oControl.prepareMassEditField(field);
	                underscoreJS.each(massEditControl, function (control) {
	                    massEditForm.addContent(control);
	                })
	            }
	        });
	        oControl.addContent(massEditForm);
	    };

	    M.prototype.prepareMassEditField = function (field) {
	        var oControl = this;
	        var fields = oControl.getModel(oControl.getModelName()).getProperty(oControl.getFieldsPath());//.getProperty("/VUI_MASS_EDIT/FIELDS");
	        var massEditField = [];
	        var bindingField, refField, currentField = field;
	        var fieldValueControl;

	        bindingField = field['TXTFL'] ? field['TXTFL'] : field['FLDNAME'];
	        if (field["CFIELDNAME"]) {
	            refField = underscoreJS.where(fields, { FLDNAME: field['CFIELDNAME'] })[0];
	        } else if (field["QFIELDNAME"]) {
	            refField = underscoreJS.where(fields, { FLDNAME: field['QFIELDNAME'] })[0];
	        }
	        massEditField.push(
                    new sap.m.Label({
                        text: field["LABEL"],
                        required: field["REQUIRED"] === 'X'
                    }).setLayoutData(new sap.ui.layout.GridData({
                        span: "XL4 L12 M12 S12",
                        linebreak: true
                    }))
            );
	        var oItemTemplate = new sap.ui.core.ListItem({
	            key: "{KEY}",
	            text: "{TEXT}"
	        });
	        var selectBox = new sap.m.Select({
	            change: [oControl.onMassEditKeyChange, oControl],
	            selectedKey: "{/VUI_MASS_EDIT/DATA/" + field["FLDNAME"] + "/EDIT_KEY}",
	            items: {
	                path: "/VUI_MASS_EDIT/DROPDOWNS/" + field["FLDNAME"],
	                template: oItemTemplate
	            }
	        }).setModel(oControl.getModel(oControl.getModelName())).data("field", field).data("fieldsPath", oControl.getFieldsPath());//.data("firstRow", );
	        selectBox.setLayoutData(new sap.ui.layout.GridData({
	            span: "XL4 L12 M12 S12",
	            linebreak: true
	        }));
	        massEditField.push(selectBox);
	        var visible = "{= ${/VUI_MASS_EDIT/DATA/" + field["FLDNAME"] + "/EDIT_KEY} !== '" + global.vui5.cons.massEditType.keepExisting + "' && ${/VUI_MASS_EDIT/DATA/" + field["FLDNAME"] + "/EDIT_KEY} !== '" + global.vui5.cons.massEditType.leaveBlank + "'}";
	        var valueField = oControl.prepareMassEditFieldControl(field, visible);
	        valueField.setLayoutData(new sap.ui.layout.GridData({
	            span: "XL4 L12 M12 S12",
	            linebreak: true
	        }))
	        var refField;
	        if (field["CFIELDNAME"]) {
	            refField = underscoreJS.where(fields, { FLDNAME: field['CFIELDNAME'] })[0];
	        } else if (field["QFIELDNAME"]) {
	            refField = underscoreJS.where(fields, { FLDNAME: field['QFIELDNAME'] })[0];
	        }
	        if (!refField && field['SDSCR'] !== global.vui5.cons.fieldValue.value_descr) {
	            massEditField.push(valueField);
	        } else if (refField) {
	            var referenceField = oControl.prepareMassEditFieldControl(refField, visible);
	            oControl.amountRef.push({
	                'FLDNAME': field['FLDNAME'],
	                'TABNAME': field['TABNAME'],
	                'CONTROL': valueField,
	                'INDEX': ''
	            });
	            var hBox = new sap.m.HBox({
	                items: [
                        valueField, referenceField
	                ]
	            });
	            valueField.setLayoutData(new sap.ui.layout.GridData({
	                span: "XL4 L6 M6 S6",
	                linebreak: true
	            }));
	            referenceField.setLayoutData(new sap.ui.layout.GridData({
	                span: "XL4 L6 M6 S6",
	                linebreak: false
	            }));
	            var descriptionField;
	            if (refField['SDSCR'] === global.vui5.cons.fieldValue.value_descr) {
	                descriptionField = new sap.m.Input({
	                    value: "{/VUI_MASS_EDIT/DATA/" + refField['TXTFL'] + "/VALUE}",
	                    visible: visible,
	                    editable: false,
	                    enabled: true
	                }).setModel(oControl.getModel(oControl.getModelName()));
	                hBox.addItem(descriptionField);
	                massEditField.push(descriptionField);
	                valueField.setLayoutData(new sap.ui.layout.GridData({
	                    span: "XL4 L4 M4 S6",
	                    linebreak: true
	                }));
	                referenceField.setLayoutData(new sap.ui.layout.GridData({
	                    span: "XL4 L4 M4 S3",
	                    linebreak: false
	                }));
	                descriptionField.setLayoutData(new sap.ui.layout.GridData({
	                    span: "XL4 L4 M4 S3",
	                    linebreak: false
	                }));
	            }
	            massEditField.push(valueField);
	            massEditField.push(referenceField);
	            if (descriptionField) {
	                massEditField.push(descriptionField);
	            }
	            //			massEditField.push(hBox);
	        } else if (field['SDSCR'] === global.vui5.cons.fieldValue.value_descr) {
	            var descriptionField = new sap.m.Input({
	                value: "{/VUI_MASS_EDIT/DATA/" + field['TXTFL'] + "/VALUE}",
	                visible: visible,
	                editable: false,
	                enabled: true
	            }).setModel(oControl.getModel(oControl.getModelName()));
	            var hBox = new sap.m.HBox({
	                items: [
                        valueField, descriptionField
	                ]
	            });
	            valueField.setLayoutData(new sap.ui.layout.GridData({
	                span: "XL6 L6 M6 S6",
	                linebreak: true
	            }));
	            descriptionField.setLayoutData(new sap.ui.layout.GridData({
	                span: "XL6 L6 M6 S6",
	                linebreak: false
	            }));
	            massEditField.push(valueField);
	            massEditField.push(descriptionField);
	            //			massEditField.push(hBox);
	        }
	        if (field["REQUIRED"] !== "X") {
	            var applyToInitial = new sap.m.CheckBox({
	                text: this._oBundle.getText("ApplyToEmptyOnly"),
	                visible: visible,
	                selected: "{/VUI_MASS_EDIT/DATA/" + field["FLDNAME"] + "/APPLY_INIT}",
	                select: function (oEvent) {
	                    if (field['CFIELDNAME']) {
	                        oControl.getModel(oControl.getModelName()).setProperty("/VUI_MASS_EDIT/DATA/" + field['CFIELDNAME'] + "/APPLY_INIT", oEvent.getParameter("selected"));
	                    }
	                    else if (field['QFIELDNAME']) {
	                        oControl.getModel(oControl.getModelName()).setProperty("/VUI_MASS_EDIT/DATA/" + field['QFIELDNAME'] + "/APPLY_INIT", oEvent.getParameter("selected"));
	                    }

	                }
	            });
	            applyToInitial.setLayoutData(new sap.ui.layout.GridData({
	                span: "XL12 L12 M12 S12",
	                linebreak: false
	            }));
	            massEditField.push(applyToInitial);
	        }
	        return massEditField;
	    };

	    M.prototype.prepareMassEditFieldControl = function (field, visible) {
	        var oControl = this;
	        var fieldValueControl;

	        var bindingFieldName = field['FLDNAME'];
	        if (field['SDSCR'] !== global.vui5.cons.fieldValue.value_descr) {
	            bindingFieldName = field['TXTFL'] ? field['TXTFL'] : field['FLDNAME'];
	        }

	        var valueBinding = "{/VUI_MASS_EDIT/DATA/" + bindingFieldName + "/VALUE}";

	        var oItemTemplate = new sap.ui.core.ListItem({
	            key: "{NAME}",
	            text: "{VALUE}"
	        });
	        if (field["DATATYPE"] === global.vui5.cons.dataType.date) {
	            fieldValueControl = new sap.m.DatePicker({
	                placeholder: " ",
	                valueFormat: vui5.cons.date_format,
	                value: valueBinding,
	                visible: visible,
	            });
	            fieldValueControl.bindProperty("displayFormat", vui5.modelName + ">" + vui5.cons.modelPath.sessionInfo + "/DATFM", Formatter.displayFormat, sap.ui.model.Binding.OneWay);
	        } else if (field["ELTYP"] === global.vui5.cons.element.checkBox) {
	            fieldValueControl = new sap.m.Select({
	                visible: visible,
	                items: {
	                    path: "/VUI_MASS_EDIT/DROPDOWNS/" + field['FLDNAME'],
	                    template: oItemTemplate
	                }
	            }).setModel(oControl.getModel(oControl.getModelName()));
	        } else if (field["ELTYP"] === global.vui5.cons.element.dropDown) {

	            fieldValueControl = new sap.m.ComboBox({
	                visible: visible,
	                selectedKey: "{/VUI_MASS_EDIT/DATA/" + field["FLDNAME"] + "/VALUE}",
	            }).setModel(oControl.getModel(global.vui5.modelName), global.vui5.modelName).setModel(oControl.getModel(oControl.getModelName()));
	            fieldValueControl.bindAggregation("items", global.vui5.modelName + '>' + "/DROPDOWNS/" + oControl.getModel(oControl.getModelName()).getProperty(oControl.getDataAreaPath()) + "/" + field['FLDNAME'], function (sid, oContext) {
	                var contextObject = oContext.getObject();
	                return new sap.ui.core.Item({
	                    key: contextObject['NAME'],
	                    text: contextObject['VALUE']
	                });
	            });
	        } else {
	            fieldValueControl = new sap.m.Input({
	                showValueHelp: field["ELTYP"] === global.vui5.cons.element.valueHelp,
	                value: valueBinding,
	                visible: visible,
	            }).setModel(oControl.getModel(global.vui5.modelName), global.vui5.modelName).setModel(oControl.getModel(oControl.getModelName()));

	            if (field["ELTYP"] === global.vui5.cons.element.valueHelp) {
	                fieldValueControl.attachValueHelpRequest(oControl.onValueHelpRequest.bind(oControl));
	            }
	        }

	        if (field['DATATYPE'] === global.vui5.cons.dataType.currencyKey || field['DATATYPE'] === global.vui5.cons.dataType.unit) {
	            var editable = false;
	            underscoreJS.each(oControl.getSelectedSPaths(), function (sPath) {
	                if (!editable) {
	                    rowObject = oControl.getModel(oControl.getModelName()).getProperty(sPath);
	                    if (rowObject['READONLYCOLUMNS'].indexOf("<" + field['FLDNAME'] + ">") === -1) {
	                        editable = true;
	                    };
	                }
	            });
	            fieldValueControl.setEditable(editable);
	        }
	        if (field["REQUIRED"]) {
	            fieldValueControl.addStyleClass("vuiRequired");
	        }

	        fieldValueControl.attachChange(oControl.onInputChange.bind(oControl));
	        fieldValueControl.data("model", oControl.getModelName());
	        fieldValueControl.data("fieldInfo", field);
	        fieldValueControl.data("dataArea", oControl.getModel(global.vui5.modelName).getProperty(oControl.getDataAreaPath()));
	        return fieldValueControl;
	    };
	    M.prototype.prepareMassEditDataModel = function () {
	        var oControl = this;
	        var massEditModel = new JSONModel();
	        var massEditData = {
	            "DROPDOWNS": {},
	            "FIELDS": [],
	            "DATA": {}
	        };
	        var infocusModel = oControl.getModel(oControl.getModelName());
	        var fields = infocusModel.getProperty(oControl.getFieldsPath());
	        var inputFields = underscoreJS.filter(fields, function (field) {
	            return field['DISABLED'] === '' && field['MULTISELECT'] === "" && (field["ELTYP"] === global.vui5.cons.element.input || field["ELTYP"] === global.vui5.cons.element.valueHelp ||
                        field["ELTYP"] === global.vui5.cons.element.dropDown || field["ELTYP"] === global.vui5.cons.element.checkBox);
	        });

	        var displayFields = [], isInitial;
	        var prepareDisplayField;
	        underscoreJS.each(inputFields, function (field) {
	            prepareDisplayField = false;
	            var fieldValues = oControl.getDefaultDropdownValues(field);
	            if (field['ELTYP'] !== global.vui5.cons.element.checkBox) {
	                underscoreJS.each(oControl.getSelectedSPaths(), function (sPath) {

	                    isInitial = undefined;
	                    var fieldValue = {};
	                    var mainFieldName = field["FLDNAME"];
	                    var textFieldName = field['TXTFL'] ? field['TXTFL'] : field['FLDNAME'];

	                    if (field['DATATYPE'] === global.vui5.cons.dataType.amount || field['DATATYPE'] === global.vui5.cons.dataType.quantity) {
	                        isInitial = !isNaN(infocusModel.getProperty(sPath + "/" + field['TXTFL']).replace(/([-\,\.])/g, "")) &&
        								!eval(infocusModel.getProperty(sPath + "/" + field['TXTFL']).replace(/([-\,\.])/g, ""));
	                    }
	                    else {
	                        isInitial = infocusModel.getProperty(sPath + "/" + mainFieldName) === "";
	                    }

	                    var object = infocusModel.getProperty(sPath);
	                    fieldValue["KEY"] = infocusModel.getProperty(sPath + "/" + mainFieldName);
	                    fieldValue["TEXT"] = infocusModel.getProperty(sPath + "/" + textFieldName);

	                    if (field['DATATYPE'] === global.vui5.cons.dataType.date) {
	                        fieldValue["TEXT"] = Formatter.dateFormat(fieldValue["TEXT"], oControl);
	                    }
	                    //	                    if(!isInitial) {
	                    fieldValues.push(fieldValue);
	                    //	                    }

	                    if (!prepareDisplayField) {
	                        prepareDisplayField = object['READONLYCOLUMNS'].indexOf("<" + field['FLDNAME'] + ">") === -1;
	                    }
	                });

	                if (prepareDisplayField) {
	                    displayFields.push(field);
	                }
	            }
	            uniqueFieldValues = underscoreJS.uniq(fieldValues, function (field) {
	                return field["KEY"];
	            });
	            fieldInfo = {
	                "EDIT_KEY": global.vui5.cons.massEditType.keepExisting,
	                "VALUE": "",
	                /****Rel 60E SP6 QA #12601 - Start ***/
	                //"APPLY_INIT": ""
	                "APPLY_INIT": false
	                /****Rel 60E SP6 QA #12601 - End ***/	
	            }
	            massEditData["DROPDOWNS"][field["FLDNAME"]] = uniqueFieldValues;
	            massEditData["DATA"][field["FLDNAME"]] = fieldInfo;
	            if (field['TXTFL']) {
	                massEditData["DATA"][field["TXTFL"]] = $.extend(true, {}, fieldInfo);
	            }
	        });
	        massEditData["FIELDS"] = displayFields;
	        oControl.getModel(oControl.getModelName()).setProperty("/VUI_MASS_EDIT", massEditData);
	    };

	    M.prototype.onMassEditApply = function () {
	        var oControl = this;
	        var currentModel = oControl.getModel(oControl.getModelName());
	        var fields = currentModel.getProperty(oControl.getFieldsPath());
	        var keys = Object.keys(oControl.getModel(oControl.getModelName()).getProperty("/VUI_MASS_EDIT/DATA"));
	        var fieldNames = [], actualField, textField;

	        var changedFieldsContext = [], changedFieldsContextIndex;
	        fieldNames = underscoreJS.filter(keys, function (key) {
	            return key.indexOf("_TXT") === -1;
	        });

	        var toBeChanged, bindingField;
	        var changeActualFieldValue, changeTextFieldValue, isInitial;

	        underscoreJS.each(fieldNames, function (fieldName) {
	            actualField = oControl.getModel(oControl.getModelName()).getProperty("/VUI_MASS_EDIT/DATA" + "/" + fieldName);
	            if (actualField["EDIT_KEY"] !== global.vui5.cons.massEditType.keepExisting) {
	                var modelField = underscoreJS.find(fields, { "FLDNAME": fieldName });

	                underscoreJS.each(oControl.getSelectedSPaths(), function (sPath) {
	                    rowContext = currentModel.getProperty(sPath);
	                    changeActualFieldValue = true;

	                    isInitial = undefined;

	                    if (modelField['DATATYPE'] === global.vui5.cons.dataType.amount || modelField['DATATYPE'] === global.vui5.cons.dataType.quantity) {
	                        isInitial = !isNaN(currentModel.getProperty(sPath + "/" + modelField['TXTFL']).replace(/([-\,\.])/g, "")) &&
        								!eval(currentModel.getProperty(sPath + "/" + modelField['TXTFL']).replace(/([-\,\.])/g, ""));
	                    }
	                    else {
	                        isInitial = currentModel.getProperty(sPath + "/" + fieldName) === "";
	                    }


	                    if ((actualField["APPLY_INIT"] === true && !isInitial) ||
    	    					(rowContext['READONLYCOLUMNS'].indexOf("<" + fieldName + ">") !== -1)
    	    			) {
	                        changeActualFieldValue = false;
	                    }

	                    if (changeActualFieldValue) {
	                        currentModel.setProperty(sPath + "/" + fieldName, actualField["VALUE"]);

	                        if (underscoreJS.isEmpty(changedFieldsContext)) {
	                            changedFieldsContext.push({
	                                "PATH": sPath,
	                                "FIELDS": fieldName
	                            });
	                        }
	                        else if (!underscoreJS.isObject(underscoreJS.findWhere(changedFieldsContext, { 'PATH': sPath }))) {
	                            changedFieldsContext.push({
	                                "PATH": sPath,
	                                "FIELDS": fieldName
	                            });
	                        }
	                        else {
	                            changedFieldsContextIndex = underscoreJS.findIndex(changedFieldsContext, { 'PATH': sPath });
	                            changedFieldsContext[changedFieldsContextIndex]['FIELDS'] = changedFieldsContext[changedFieldsContextIndex]['FIELDS'] + ',' + fieldName;
	                        }


	                    }
	                    changeTextFieldValue = true;

	                    if (rowContext['READONLYCOLUMNS'].indexOf("<" + modelField['TXTFL'] + ">") !== -1) {
	                        changeTextFieldValue = false;
	                    }


	                    if (changeTextFieldValue && modelField['TXTFL'] && changeActualFieldValue) {
	                        textField = oControl.getModel(oControl.getModelName()).getProperty("/VUI_MASS_EDIT/DATA" + "/" + modelField['TXTFL']);
	                        currentModel.setProperty(sPath + "/" + modelField['TXTFL'], textField["VALUE"]);


	                    }

	                });

	            }
	        });
	        oControl.close();
	        return changedFieldsContext;
	    };

	    M.prototype.onMassEditFieldValueChange = function (oEvent) {
	        oControl = this;
	        var selectedEditType = oEvent.getSource().getSelectedItem().getBindingContext().getPath();
	    };

	    M.prototype.onMassEditKeyChange = function (oEvent) {
	        var oControl = this;
	        var field = oEvent.getSource().data("field");
	        var selectedItemPath = oEvent.getSource().getSelectedItem().getBindingContext().getPath();
	        var selectedItem = oControl.getModel(oControl.getModelName()).getProperty(selectedItemPath);
	        var fields = oControl.getModel(oControl.getModelName()).getProperty(oControl.getFieldsPath());
	        var modelName = oControl.getModelName();
	        var refFieldName;
	        if (field["CFIELDNAME"]) {
	            refFieldName = field['CFIELDNAME'];
	        } else if (field["QFIELDNAME"]) {
	            refFieldName = field['QFIELDNAME'];
	        }
	        if (selectedItem.KEY === global.vui5.cons.massEditType.keepExisting ||
                    selectedItem.KEY === global.vui5.cons.massEditType.leaveBlank ||
                    selectedItem.KEY === global.vui5.cons.massEditType.newValue ||
                    selectedItem.KEY === global.vui5.cons.massEditType.valueHelp
                ) {
	            oControl.getModel(modelName).setProperty("/VUI_MASS_EDIT/DATA/" + field["FLDNAME"] + "/EDIT_KEY", selectedItem.KEY);
	            if (refFieldName) {
	                oControl.getModel(modelName).setProperty("/VUI_MASS_EDIT/DATA/" + refFieldName + "/EDIT_KEY", selectedItem.KEY);
	                if (selectedItem.KEY === global.vui5.cons.massEditType.newValue) {
	                    oControl.getModel(modelName).setProperty("/VUI_MASS_EDIT/DATA/" + refFieldName + "/VALUE", oControl.getModel(modelName).getProperty(oControl.getSelectedSPaths()[0])[refFieldName]);
	                }
	            }
	        } else {
	            oControl.getModel(modelName).setProperty("/VUI_MASS_EDIT/DATA/" + field["FLDNAME"] + "/EDIT_KEY", global.vui5.cons.massEditType.newValue);
	            if (refFieldName) {
	                oControl.getModel(modelName).setProperty("/VUI_MASS_EDIT/DATA/" + refFieldName + "/EDIT_KEY", global.vui5.cons.massEditType.newValue);
	            }
	            if (field["DATATYPE"] === global.vui5.cons.dataType.decimal ||
                    field["DATATYPE"] === global.vui5.cons.dataType.amount ||
                    field["DATATYPE"] === global.vui5.cons.dataType.quantity
                ) {
	                oControl.getModel(modelName).setProperty("/VUI_MASS_EDIT/DATA/" + field["TXTFL"] + "/VALUE", selectedItem.TEXT);
	            } else {
	                oControl.getModel(modelName).setProperty("/VUI_MASS_EDIT/DATA/" + field["FLDNAME"] + "/VALUE", selectedItem.KEY);
	                if (field["TXTFL"]) {
	                    oControl.getModel(modelName).setProperty("/VUI_MASS_EDIT/DATA/" + field["TXTFL"] + "/VALUE", selectedItem.TEXT);
	                }
	            }
	            if (refFieldName) {
	                oControl.getModel(modelName).setProperty("/VUI_MASS_EDIT/DATA/" + refFieldName + "/VALUE", oControl.getModel(modelName).getProperty(oControl.getSelectedSPaths()[0])[refFieldName]);
	                var refField = underscoreJS.find(fields, function (field) {
	                    return field["FLDNAME"] === refFieldName;
	                });
	                if (refField['SDSCR'] === global.vui5.cons.fieldValue.value_descr) {
	                    oControl.getModel(modelName).setProperty("/VUI_MASS_EDIT/DATA/" + refField["TXTFL"] + "/VALUE", oControl.getModel(modelName).getProperty(oControl.getSelectedSPaths()[0])[refField["TXTFL"]]);
	                }
	            }
	        }
	    };

	    M.prototype.getDefaultDropdownValues = function (field) {
	        defaultValues = [];
	        if (field["ELTYP"] === global.vui5.cons.element.checkBox) {
	            defaultValues.push({
	                "KEY": global.vui5.cons.massEditType.keepExisting,
	                "TEXT": this._oBundle.getText("KeepChoices")
	            });
	            defaultValues.push({
	                "KEY": 'X',
	                "TEXT": this._oBundle.getText("Yes")
	            });
	            defaultValues.push({
	                "KEY": ' ',
	                "TEXT": this._oBundle.getText("No")
	            });
	        } else if (field["DATATYPE"] === global.vui5.cons.dataType.date) {
	            defaultValues.push({
	                "KEY": global.vui5.cons.massEditType.keepExisting,
	                "TEXT": this._oBundle.getText("KeepDates")
	            })
	        } else {
	            defaultValues.push({
	                "KEY": global.vui5.cons.massEditType.keepExisting,
	                "TEXT": this._oBundle.getText("KeepValues")
	            })
	        }
	        if (field["REQUIRED"] !== 'X') {
	            defaultValues.push({
	                "KEY": global.vui5.cons.massEditType.leaveBlank,
	                "TEXT": this._oBundle.getText("LeaveBlank")
	            })
	        }
	        if (field["ELTYP"] === global.vui5.cons.element.checkBox) {
	            defaultValues.push({
	                "KEY": global.vui5.cons.massEditType.newValue,
	                "TEXT": this._oBundle.getText("NewChoice")
	            })
	        } else if (field['ELTYP'] === global.vui5.cons.element.valueHelp) {
	            defaultValues.push({
	                "KEY": global.vui5.cons.massEditType.newValue,
	                "TEXT": this._oBundle.getText("ValueHelp")
	            })
	        } else if (field["DATATYPE"] === global.vui5.cons.dataType.date) {
	            defaultValues.push({
	                "KEY": global.vui5.cons.massEditType.newValue,
	                "TEXT": this._oBundle.getText("NewDate")
	            })
	        } else if (field["ELTYP"] !== global.vui5.cons.element.checkBox) {
	            defaultValues.push({
	                "KEY": global.vui5.cons.massEditType.newValue,
	                "TEXT": this._oBundle.getText("NewValue")
	            })
	        }
	        return defaultValues;
	    };

	    M.prototype.onValueHelpRequest = function (oEvent) {
	        var oControl = this;
	        var source = oEvent.getSource();
	        var model = oControl.getModel(oControl.getModelName());
	        var fieldInfo = source.data("fieldInfo");

	        oControl.fireOnValueHelpRequest({
	            oEvent: oEvent,
	            fieldInfo: fieldInfo,
	        });
	    };

	    M.prototype.onInputChange = function (oEvent) {
	        var oControl = this;
	        var source = oEvent.getSource();
	        var fieldInfo = source.data("fieldInfo");
	        var ui_fields = oControl.getModel(oControl.getModelName()).getProperty(oControl.getFieldsPath());
	        var bindingField;
	        var refFields = [], refPath;
	        var dataPath = "/VUI_MASS_EDIT/DATA/";
	        var fieldRefControl = [];

	        bindingField = fieldInfo["TXTFL"] ? fieldInfo["TXTFL"] : fieldInfo["FLDNAME"];
	        if (fieldInfo['DATATYPE'] == vui5.cons.dataType.currencyKey) {
	            refFields = underscoreJS.where(ui_fields, { 'CFIELDNAME': fieldInfo['FLDNAME'] });
	            refPath = dataPath + fieldInfo['FLDNAME'] + "/VALUE";
	        } else if (fieldInfo['DATATYPE'] == vui5.cons.dataType.unit) {
	            refFields = underscoreJS.where(ui_fields, { 'QFIELDNAME': fieldInfo['FLDNAME'] });
	            refPath = dataPath + fieldInfo['FLDNAME'] + "/VALUE";
	        };

	        if (fieldInfo['CFIELDNAME']) {
	            refPath = dataPath + fieldInfo['CFIELDNAME'] + "/VALUE";
	        } else if (fieldInfo['QFIELDNAME']) {
	            refPath = dataPath + fieldInfo['QFIELDNAME'] + "/VALUE";
	        }

	        if (!oEvent.mParameters) {
	            oEvent.mParameters = {};
	        }

	        source.data("dataPath", dataPath);
	        source.data("fieldInfo", fieldInfo);
	        oEvent.mParameters['fieldInfo'] = fieldInfo;
	        oEvent.mParameters['dataPath'] = dataPath;
	        oEvent.mParameters['refFields'] = refFields;
	        oEvent.mParameters['refPath'] = refPath;
	        oEvent.mParameters['selection'] = source;
	        oEvent.mParameters['fieldRefControl'] = oControl.amountRef;
	        oEvent.mParameters['fromMassEdit'] = true;

	        oControl.fireOnInputChange({
	            oEvent: oEvent
	        });


	    };

	    M.prototype.processApplyBackground = function () {
	        var oControl = this, massEditData = {}, massEditFields = [], lineData = {}, field;
	        var currentModel = oControl.getModel(oControl.getModelName());
	        var data = jQuery.extend({}, currentModel.getProperty("/VUI_MASS_EDIT/DATA"));
	        var fields = currentModel.getProperty(oControl.getFieldsPath());
	        underscoreJS.each(Object.keys(data), function (key) {
	            if (key.indexOf("_TXT") === -1 && data[key]['EDIT_KEY'] !== global.vui5.cons.massEditType.keepExisting) {
	                field = underscoreJS.findWhere(fields, { 'FLDNAME': key });
	                lineData[key] = data[key]['VALUE'];
	                if (field['TXTFL'] && data[field['TXTFL']]) {
	                    lineData[field['TXTFL']] = data[field['TXTFL']]['VALUE'];
	                }
	                massEditFields.push({
	                    'FLDNAME': key,
	                    'AINVL': data[key]['APPLY_INIT'] === true ? 'X' : ''
	                });

	            }
	        });
	        
	        
	        massEditData['DATA'] = lineData;
	        massEditData['FIELDS'] = massEditFields;
	        oControl.fireOnApplyBackground({
	            DATA: massEditData,
	            CALLBACK: function () {
	                oControl.close();
	            }
	        });


	    };

	    return M;
	});