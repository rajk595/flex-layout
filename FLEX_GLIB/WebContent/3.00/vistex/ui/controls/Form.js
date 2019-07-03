sap.ui.define([
    "sap/ui/core/Control",
    vistexConfig.rootFolder + "/ui/core/global",
    vistexConfig.rootFolder + "/ui/core/underscore-min",
    vistexConfig.rootFolder + "/ui/core/Formatter"
], function (control, global, underscoreJs, Formatter) {

    var F = control.extend(vistexConfig.rootFolder + ".ui.controls.Form", {
        metadata: {
            properties: {
                modelName: {
                    type: "string",
                    defaultValue: null
                },
                dropDownModelName: {
                    type: "string",
                    defaultValue: null
                },
                sectionPath: {
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
                sectionFunctionsPath: {
                    type: "string",
                    defaultValue: null
                },
                titlePath: {
                    type: "string",
                    defaultValue: null
                },
                dataArea: {
                    type: "string",
                    defaultValue: null
                },
                sectionEditable: {
                    type: "boolean",
                    defaultValue: false
                },
                formDialog: {
                    type: "boolean",
                    defaultValue: false
                }

            },
            events: {},
            aggregations: {
                _Form: {
                    type: "sap.ui.core.Control",
                    multiple: false
                }
            }
        },
        init: function () {
            var oControl = this;
            oControl.contentData = [];
            oControl.amountRef = [];

        },
        renderer: function (oRM, oControl) {
            oRM.write("<div");
            oRM.writeControlData(oControl);
            oRM.write(">");
            oRM.renderControl(oControl.getAggregation("_Form"));
            oRM.write("</div>");
        }


    });

    F.prototype.setSectionPath = function (value) {
        this.setProperty("sectionPath", value, true);
    };
    F.prototype.setModelName = function (value) {
        this.setProperty("modelName", value, true);
    };
    F.prototype.setSectionFieldPath = function (value) {
        this.setProperty("sectionFieldPath", value, true);
    };

    F.prototype.setSectionDataPath = function (value) {
        this.setProperty("sectionDataPath", value, true);
        this._sectionDataPath = this.getModelName() + ">" + value;
    };

    F.prototype.setFieldsPath = function (value) {
        this.setProperty("fieldsPath", value, true);
    };

    F.prototype.setSectionFunctionsPath = function (value) {
        this.setProperty("sectionFunctionsPath", value, true);
    };

    F.prototype.setTitlePath = function (value) {
        this.setProperty("titlePath", value, true);
    };

    F.prototype.setDataArea = function (value) {
        this.setProperty("dataArea", value, true);
    };

    F.prototype.setSectionEditable = function (value) {
        this.setProperty("sectionEditable", value, true);
    };
    F.prototype.setFormDialog = function (value) {
        this.setProperty("formDialog", value, true);
    };
    F.prototype.setDropDownModelName = function (value) {
        this.setProperty("dropDownModelName", value, true);
    };

    F.prototype.prepareFormControl = function () {

        var oControl = this, modelName, titlePath, sectionFunPath, model, overview_fields, sectionDataPath, contentData,
            formFields, formToolbar, sectionFunctions, simpleForm, sectionEditable;

        modelName = oControl.getModelName();
        titlePath = oControl.getTitlePath();
        sectionFunPath = oControl.getSectionFunctionsPath();
        sectionDataPath = oControl.getSectionDataPath();
        sectionEditable = oControl.getSectionEditable();
        fieldsPath = oControl.getFieldsPath();
        model = oControl.getModel(modelName);
        overview_fields = model.getProperty(oControl.getSectionFieldPath());
        formFields = model.getProperty(oControl.getFieldsPath());
        sectionFunctions = model.getProperty(sectionFunPath);
        contentData = oControl.contentData;

        formToolbar = new sap.m.Toolbar({
            content: [
                new sap.m.Title({
                }).bindProperty("text", modelName + ">" + titlePath, sap.ui.model.BindingMode.OneWay),
                new sap.m.ToolbarSpacer({})
            ]
        }).bindProperty("visible", {
            path: modelName + ">" + sectionFunPath,
            formatter: function (functions) {
                return underscoreJS.find(functions, { "HIDFN": "" }) ? true : false;
            }
        }).addStyleClass('VuiFormToolBar');

        underscoreJS.each(sectionFunctions, function (obj, i) {
            var button = oControl._prepareButtonControl(obj, obj['SECTN'], true);
            formToolbar.addContent(button);
        });

        if (overview_fields) {

            var columnL, columnM, emptyL, emptyM, singleGroup, labelSpanL, labelSpanM, labelSpanS, columnXL, columnS;

            if (oControl.getFormDialog()) {
                columnL = 2;
                columnM = 1;
                emptyL = 0;
                emptyM = 1;
            } else {
                singleGroup = false;
                labelSpanL = 4;
                labelSpanM = 4;
                columnXL = 2;
                columnL = 2;
                columnM = 2;
                columnS = 1;
                emptyL = 0;
                emptyM = 0;
                if (overview_fields.length == 1) {
                    singleGroup = true;
                    columnM = 1;
                }
            }

            underscoreJS.each(overview_fields, function (group, grpIndex) {

                var group_Fields, visibleFields;

                group_fields = underscoreJS.where(formFields, { "FLGRP": group['FLGRP'] });
                visibleFields = underscoreJS.findWhere(group_fields, { NO_OUT: "" });

                if (group['HDGRP']) {
                    return;
                }

                if (visibleFields) {
                    if (group['DESCR'] != "" || group['FLGRP'] != '') {
                        var text = group['DESCR'] != "" ? group['DESCR'] : group['FLGRP'];
                        contentData.push(new sap.ui.core.Title({
                            text: text,
                            level: sap.ui.core.TitleLevel.H5
                        }));
                    }
                    underscoreJS.each(group_fields, function (field, index) {

                        var selection, lv_visible, selectionLabel, dataPath, fieldPath;
                        dataPath = oControl._sectionDataPath + field['FLDNAME'];
                        fieldPath = fieldsPath + underscoreJS.findIndex(formFields, field) + "/";


                        if ((field['ADFLD'] != 'X') || field['HDLBL'] != "") { //field['NO_OUT'] != 'X' ){

                            selectionLabel = new sap.m.Label({
                                text: "{" + modelName + ">" + fieldPath + "LABEL}",
                                visible: "{= ${" + modelName + ">" + fieldPath + "NO_OUT} === ''  &&"
                                + " ${" + modelName + ">" + fieldPath + "HDLBL} === ''}"
                            });
                            if (!singleGroup) {
                                selectionLabel.setLayoutData(new sap.ui.layout.GridData({
                                    span: "XL4 L4 M12 S12",
                                    linebreak: true
                                }))
                            }
                            if (field['REQUIRED'] == 'X') {
                                selectionLabel.setRequired(true);
                            }
                            contentData.push(selectionLabel);
                            selectionLabel = contentData[contentData.length - 1];

                            if (sectionEditable) {
                                var func;
                                lv_visible = "{= ${" + modelName + ">" + fieldPath + "NO_OUT} === '' }";

                                oControl.prepareChangeModeFieldControl({
                                    field: field,
                                    fieldPath: fieldPath,
                                    visible: lv_visible,
                                    group_fields: group_fields,
                                    grpIndex: grpIndex
                                });
                            } else {
                                /*Display*/

                                lv_visible = "{= ${" + modelName + ">" + fieldPath + "NO_OUT} === '' }";
                                oControl.prepareDisplayModeFieldControl({
                                    field: field,
                                    fieldPath: fieldPath,
                                    visible: lv_visible,
                                    group_fields: group_fields,
                                    grpIndex: grpIndex
                                });
                            }
                        }
                    });
                }
            });
        }
        var properties = {
            layout: sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout,
            editable: true,//true,
            labelSpanL: labelSpanL,
            labelSpanM: labelSpanM,
            emptySpanL: emptyL,
            emptySpanM: emptyM,
            columnsL: columnL,
            columnsM: columnM,
            toolbar: formToolbar,
            singleContainerFullSize: false,
            content: contentData
        }
        if (singleGroup) {
            properties['columnsXL'] = columnXL;
            //properties['columnsS'] = columnS;
        }
        simpleForm = new sap.ui.layout.form.SimpleForm(properties);
        simpleForm.data("editable", sectionEditable);
        oControl.setAggregation("_Form", simpleForm);
    };

    F.prototype.prepareDisplayModeFieldControl = function (params) {

        var oControl, selection, dataArea, bindindMode, dropDownModelName, sectionFieldPath, dataPath, sectionDataPath,
             drpdnPath, txtflPath, editable, refFieldInfo, refPath, txtflPath, index, lv_editable, dataPath, modelName, contentData,
             multiValue;
        field = params['field'];
        fieldPath = params['fieldPath'];
        visible = params['visible'];
        groupfields = params['group_fields']
        grpIndex = params['grpIndex']

        oControl = this;
        contentData = oControl.contentData;
        bindingMode = sap.ui.model.BindingMode.OneWay;
        dataArea = oControl.getDataArea() ? oControl.getDataArea() : vui5.cons.dropdownsDatar;
        dropDownModelName = oControl.getDropDownModelName() ? oControl.getDropDownModelName() : vui5.modelName;
        sectionFieldPath = oControl.getSectionFieldPath();
        sectionDataPath = oControl.getSectionDataPath();
        modelName = oControl.getModelName();
        dataPath = oControl._sectionDataPath + field['FLDNAME'];
        drpdnPath = dropDownModelName + ">/DROPDOWNS/" + dataArea + "/" + field['FLDNAME'];
        if (field['FLSTL'] == vui5.cons.styleType.icon) {
            selection = oControl.__setIcon({
                fieldInfo: field,
                modelName: modelName,
                visible: visible
            });
            contentData.push(selection);
        }
        else {
            switch (field['ELTYP']) {
                case vui5.cons.element.upload:
                    oControl.prepareFileUploaderField({
                        field: field,
                        dataPath: dataPath,
                        drpdnPath: drpdnPath,
                        fieldPath: fieldPath
                    });
                    break;
                case vui5.cons.element.dropDown:
                    if (field['MULTISELECT']) {
                        var multiValue = new global.vui5.ui.controls.MultiValue({
                            modelName: oControl.getModelName(),
                            elementType: field['ELTYP'],
                            fieldPath: fieldPath,
                            dataAreaID: dataArea,
                            enabled: true,
                            editable: true,
                            commaSeparator: field['MVLFLD'] === "",
                            dataPath: oControl.getSectionDataPath() + field['FLDNAME'],
                        });

                        multiValue.setModel(oControl.getModel(oControl.getModelName()), oControl.getModelName());
                        multiValue.setModel(oControl.getModel(global.vui5.modelName), global.vui5.modelName);
                        selection = multiValue.prepareField();
                    }
                    else {
                        selection = new sap.m.Text({
                            visible: visible,
                            text: {
                                mode: bindingMode,
                                formatter: function (value, dropdownData) {
                                    var cellValue = '';
                                    //*****Rel 60E_SP6
                                    var fieldInfo = selection.data("field");
                                    //*****
                                    cellValue = oControl.__setColor.call(this, {
                                        //*****Rel 60E_SP6
                                        //fieldInfo: field,
                                        fieldInfo: fieldInfo,
                                        //*****
                                        cellValue: value
                                    });
                                    cellValue = Formatter.dropdownDescriptionGet.call(this, value, dropdownData);
                                    return cellValue;
                                },
                                parts: [{
                                    path: dataPath
                                }, {
                                    path: drpdnPath
                                }]
                            }
                        });
                        //*****Rel 60E_SP6
                        selection.data("field", field);
                        //*****
                    }

                    contentData.push(selection);
                    break;
                case vui5.cons.element.checkBox:
                    lv_editable = false;
                    oControl.prepareCheckBoxFieldInput({
                        field: field,
                        fieldPath: fieldPath,
                        dataPath: dataPath,
                        editable: lv_editable,
                        visible: visible
                    });
                    break;
                    //*****Rel 60E_SP6 - Task #39097
                case vui5.cons.element.toggle:
                    lv_editable = false;
                    oControl.prepareToggleFieldInput({
                        field: field,
                        fieldPath: fieldPath,
                        dataPath: dataPath,
                        editable: lv_editable,
                        visible: visible
                    });
                    break;
                    //*****                    
                case vui5.cons.element.textBox:
                    selection = new sap.m.TextArea({
                        editable: false,
                        rows: 10,
                        visible: "{= ${" + modelName + ">" + fieldPath + "NO_OUT} === '' }"
                    }).bindProperty("value", dataPath, null, sap.ui.model.BindingMode.OneWay);

                    selection.data("fieldname", field['FLDNAME']);
                    contentData.push(selection);
                    break;
                case global.vui5.cons.element.progressIndicator:

                    var txtPath;
                    /*if (field['TXTFL'])
                        txtPath = oControl._sectionDataPath + field['TXTFL'];
                    else*/
                    txtPath = dataPath;

                    selection = new sap.m.ProgressIndicator({
                        //*****Rel 60E_SP6
                        state: sap.ui.core.ValueState.Success,
                        visible: "{= ${" + modelName + ">" + fieldPath + "NO_OUT} === '' }"
                        //*****
                    }).bindProperty("displayValue", {
                        parts: [{ path: txtPath }
                        ],
                        formatter: function (val) {
                            if (val && val != undefined) {
                                return parseFloat(val) + "%";
                            }
                        },
                        mode: sap.ui.model.BindingMode.OneWay
                    }).bindProperty("percentValue", {
                        parts: [{ path: txtPath }
                        ],
                        formatter: function (val) {
                            if (val && val != undefined) {
                                return parseFloat(val);
                            }
                        },
                        mode: sap.ui.model.BindingMode.OneWay
                    })

                    contentData.push(selection);
                    break;
                case vui5.cons.element.label:
                case vui5.cons.element.input:
                    selection = new sap.m.Text({
                        visible: visible
                    });

                    if (field['DATATYPE'] == vui5.cons.dataType.date) {
                        selection.bindProperty("text", {
                            path: dataPath,
                            mode: sap.ui.model.Binding.OneWay,
                            formatter: Formatter.dateFormat
                        });
                        contentData.push(selection);

                    } else if (field['DATATYPE'] == vui5.cons.dataType.time) {
                        selection = new sap.m.Text({
                            visible: visible
                        });

                        oControl.bindField({
                            propertyName: "text",
                            selection: selection,
                            fieldInfo: field,
                            bindingMode: bindingMode,
                            path1: dataPath,
                            path2: null
                        });

                        contentData.push(selection);

                    } else if (field['DATATYPE'] == vui5.cons.dataType.amount && field['CFIELDNAME'] != '' || field['DATATYPE'] == vui5.cons.dataType.quantity && field['QFIELDNAME'] != '') {

                        refFieldInfo = field['DATATYPE'] == vui5.cons.dataType.amount ? underscoreJS.find(groupfields, { 'FLDNAME': field['CFIELDNAME'] }) : underscoreJS.find(groupfields, { 'FLDNAME': field['QFIELDNAME'] });
                        if (refFieldInfo) {
                            if (refFieldInfo['SDSCR'] == vui5.cons.fieldValue.value) {
                                refPath = oControl._sectionDataPath + refFieldInfo['FLDNAME'];
                            }
                            else {
                                refPath = oControl._sectionDataPath + refFieldInfo['TXTFL'];
                            }
                        }
                        else {
                            refPath = field['CFIELDNAME'] != '' ? oControl._sectionDataPath + field['CFIELDNAME'] : oControl._sectionDataPath + field['QFIELDNAME'];
                        }
                        txtflPath = field['TXTFL'] != '' ? oControl._sectionDataPath + field['TXTFL'] : dataPath;

                        /* Color Changes-START */
                        oControl.bindField({
                            propertyName: "text",
                            selection: selection,
                            fieldInfo: field,
                            bindingMode: bindingMode,
                            path1: txtflPath,
                            path2: refPath,
                            descriptionOnly: false,
                            concatenate: true
                        });
                        /*Color Changes-END*/

                        contentData.push(selection);

                    }
                    else if (field['DATATYPE'] == vui5.cons.dataType.decimal ||
                             field['DATATYPE'].substr(0, 3) == vui5.cons.dataType.integer) {

                        txtflPath = field['TXTFL'] != '' ? oControl._sectionDataPath + field['TXTFL'] : dataPath;

                        /*Color Changes-START*/
                        oControl.bindField({
                            propertyName: "text",
                            selection: selection,
                            fieldInfo: field,
                            bindingMode: bindingMode,
                            path1: txtflPath
                        });

                        /*Color Changes-END*/
                        contentData.push(selection);

                    } else {

                        oControl.handleShowDescription({
                            field: field,
                            eltyp: field['ELTYP'],
                            style: true,
                            selection: selection,
                            bindingMode: bindingMode,
                            visible: visible
                        });

                    }

                    break;
                case global.vui5.cons.element.objectStatus:
                	var metadata,metadataObj,fldname,icon,active,label,state;
                	    metadata = field['METADATA'];
                	    metadataObj = JSON.parse(metadata);
//                	    metadataObj = {
//                	    		'TXT_FLD':"BOTEXT",
//                	    		'ICON_FLD':"ICON",
//                	    		'ACTIVE_FLD':"ACTIVE",
//                	    		'STATE_FLD':"STATE"
//                	    }
                	    fldname = metadataObj['TXT_FLD'];
                	    icon = metadataObj['ICON_FLD'];
                	    active = metadataObj['ACTIVE'] === "X" ? true :false;
                	    //active = metadataObj['ACTIVE'];
                	    label = metadataObj['LABEL_FLD'];
                	    state = metadataObj['STATE_FLD'];
                	template = new sap.m.ObjectStatus({
                		active : active
                		//active : "{= ${" + oControl._sectionDataPath + active + "} === 'X' }"
                	}).bindProperty("text",oControl._sectionDataPath + fldname,null,bindingMode)
                	.bindProperty("icon", oControl._sectionDataPath + icon,null,bindingMode)
                	.bindProperty('title', oControl._sectionDataPath + label,null,bindingMode)
                	.bindProperty("state", oControl._sectionDataPath + state, function (val) {
                                if (val === global.vui5.cons.stateConstants.Error) {
                                	return sap.ui.core.ValueState.Error;
                                }
                                else if(val === global.vui5.cons.stateConstants.Information){
                                	return sap.ui.core.ValueState.Information;
                                	
                                }else if(val === global.vui5.cons.stateConstants.None){
                                	return sap.ui.core.ValueState.None;
                                	
                                }else if(val === global.vui5.cons.stateConstants.Success){
                                	return sap.ui.core.ValueState.Success;
                                }
                            }, sap.ui.model.BindingMode.OneWay);
                	if(active){
                		template.attachPress(function (oEvent) {
                    		
                    	}) 
                	}
                	   
                	break;
                /* Rel 60E_SP7 - start*/
                case global.vui5.cons.element.slider:
                	
                    selection = new sap.m.Slider({
                        visible: "{= ${" + modelName + ">" + fieldPath + "NO_OUT} === '' }",
                        enabled: false,
                    }).bindProperty("value", {
                        parts: [{ path: dataPath }
                        ],
                        formatter: function (val) {
                            if (val && val != undefined) {
                                return parseFloat(val);
                            }
                        },
                        mode: sap.ui.model.BindingMode.OneWay
                    });
                    
                    contentData.push(selection);
                    break;
                /*Rel 60E_SP7 - end*/
                case vui5.cons.element.valueHelp:
                    if (field['MULTISELECT']) {

                        multiValue = new global.vui5.ui.controls.MultiValue({
                            modelName: oControl.getModelName(),
                            elementType: field['ELTYP'],
                            fieldPath: fieldPath,
                            dataPath: oControl.getSectionDataPath() + field['FLDNAME'],
                            enabled: true,
                            editable: true,
                            commaSeparator: field['MVLFLD'] === ""
                        });
                        multiValue.setModel(oControl.getModel(oControl.getModelName()), oControl.getModelName());
                        multiValue.setModel(oControl.getModel(global.vui5.modelName), global.vui5.modelName);
                        selection = multiValue.prepareField();
                        selection.addStyleClass("vuiMultiInput");
                    }
                    else {
                        selection = new sap.m.Text({
                            visible: visible
                        });
                    }

                    oControl.handleShowDescription({
                        field: field,
                        eltyp: field['ELTYP'],
                        style: false,
                        selection: selection,
                        bindingMode: bindingMode,
                        visible: visible,
                        dataPath: dataPath
                    });
                    break;

                case vui5.cons.element.link:
                    //*****Rel 60E_SP6
                case global.vui5.cons.element.button:

                    if (field['ELTYP'] === global.vui5.cons.element.button) {
                        var enabled = "{= ${" + modelName + ">" + oControl.getSectionDataPath() + "/READONLYCOLUMNS}.indexOf('<" + field['FLDNAME'] + ">') === -1 }";
                        var params = {
                            visible: visible,
                            enabled: enabled,
                            width: "25%",
                            press: [oControl.onFieldClick, oControl]
                        };
                    }
                    else {
                        var params = {
                            visible: visible,
                            press: [oControl.onFieldClick, oControl]
                        };
                    }

                    selection = field['ELTYP'] === global.vui5.cons.element.link ? new sap.m.Link(params) : new sap.m.Button(params);

                    if (field['ELTYP'] === global.vui5.cons.element.button) {
                        selection.bindProperty("type", {
                            parts: [{ path: dataPath },
                    			    { path: modelName + ">" + fieldPath + "/STYLES" }],
                            formatter: function (val, styles) {
                                var oType = sap.m.ButtonType.Default;
                                if (!underscoreJS.isEmpty(styles)) {
                                    style = underscoreJS.findWhere(styles, { "VALUE": val });
                                    if (style && style['BTNTP'] == global.vui5.cons.buttonType.accept) {
                                        oType = sap.m.ButtonType.Accept;
                                    }
                                    else if (style && style['BTNTP'] == global.vui5.cons.buttonType.reject) {
                                        oType = sap.m.ButtonType.Reject;
                                    }
                                    else if (style && style['BTNTP'] == global.vui5.cons.buttonType.transparent) {
                                        oType = oType = sap.m.ButtonType.Transparent;
                                    }
                                }

                                return oType;
                            },
                            mode: sap.ui.model.BindingMode.OneWay
                        });
                    }

                    /*selection = new sap.m.Link({
                        visible: visible,
                        press: [oControl.onFieldClick, oControl]
                    });*/
                    //*****
                    oControl.handleShowDescription({
                        field: field,
                        eltyp: field['ELTYP'],
                        style: true,
                        selection: selection,
                        bindingMode: bindingMode,
                        visible: visible
                    });
                    selection.data("fieldname", field['FLDNAME']);
                    selection.data("fieldInfo", field);
                    selection.data("datapath", oControl.getSectionDataPath());
                    break;
            }

        }

        /*Adjacent Field Changes*/
        if (field['ADJFL'] != '') {
            var infocusModel = oControl.getModel(oControl.getModelName());
            var formFields = infocusModel.getProperty(oControl.getFieldsPath());
            //var adjacentField = underscoreJS.find(group_fields, { 'FLDNAME': field['ADJFL'] });
            var adjacentField = underscoreJS.find(formFields, { 'FLDNAME': field['ADJFL'] });
            if (adjacentField) {
                var adjFieldPath = oControl.getFieldsPath() + underscoreJS.findIndex(oControl.getModel(oControl.getModelName()).getProperty(oControl.getFieldsPath()), adjacentField) + "/";

                oControl.prepareDisplayModeFieldControl({
                    field: adjacentField,
                    fieldPath: adjFieldPath,
                    visible: visible,
                    group_fields: groupfields,
                    grpIndex: grpIndex
                });
            }
        }
        /*Adjacent Field Changes*/
    };
    F.prototype.prepareChangeModeFieldControl = function (params) {

        var oControl, selection, dataArea, dropDownModelName, mainModel, document_mode, sectionFieldPath, sectionDataPath,
            bindingMode, dataPath, txtflPath, refFieldInfo, index, refFieldPath, lv_editable, lv_visible, refDataPath, refDrpdnPath, selection1, editable, modelName, contentData,
            field = params['field'];
        fieldPath = params['fieldPath'];
        visible = params['visible'];
        groupflds = params['group_fields'];
        grpIndex = params['grpIndex'];
        setPlaceholder = params['setPlaceholder'];

        oControl = this;
        contentData = oControl.contentData;

        if (oControl.getDataArea()) {
            dataArea = oControl.getDataArea();
        } else {
            dataArea = vui5.cons.dropdownsDatar;
        }

        if (oControl.getDropDownModelName()) {
            //dropDownModelName = oControl.dropDownModelName;
        	dropDownModelName = oControl.getDropDownModelName();
        } else {
            dropDownModelName = vui5.modelName;
        }

        mainModel = oControl.getModel(vui5.modelName);
        document_mode = mainModel.getProperty("/DOCUMENT_MODE");

        modelName = oControl.getModelName();
        sectionFieldPath = oControl.getSectionFieldPath();
        sectionDataPath = oControl.getSectionDataPath();
        bindingMode = sap.ui.model.BindingMode.TwoWay;
        dataPath = oControl._sectionDataPath + field['FLDNAME'];
        drpdnPath = dropDownModelName + ">/DROPDOWNS/" + dataArea + "/" + field['FLDNAME'];
        if (field['FLSTL'] == vui5.cons.styleType.icon) {
            selection = oControl.__setIcon({
                fieldInfo: field,
                modelName: modelName,
                visible: visible
            });
            contentData.push(selection);
        }
        else {
            switch (field['ELTYP']) {
                case vui5.cons.element.upload:
                    oControl.prepareFileUploaderField({
                        field: field,
                        dataPath: dataPath,
                        drpdnPath: drpdnPath,
                        fieldPath: fieldPath
                    });
                    break;
                case vui5.cons.element.dropDown:
                    oControl.prepareDropdownFieldInput({
                        field: field,
                        dataPath: dataPath,
                        drpdnPath: drpdnPath,
                        bindingMode: bindingMode,
                        fieldPath: fieldPath,
                        //editable: editable,
                        visible: visible,
                        group_fields: groupflds,
                        setPlaceholder: setPlaceholder
                    });

                    break;
                case vui5.cons.element.checkBox:
                    lv_editable = true
                    oControl.prepareCheckBoxFieldInput({
                        field: field,
                        fieldPath: fieldPath,
                        dataPath: dataPath,
                        editable: lv_editable,
                        visible: visible,
                        setPlaceholder: setPlaceholder
                    });
                    break;
                    //*****Rel 60E_SP6 - Task #39097
                case vui5.cons.element.toggle:
                    lv_editable = true
                    oControl.prepareToggleFieldInput({
                        field: field,
                        fieldPath: fieldPath,
                        dataPath: dataPath,
                        editable: lv_editable,
                        visible: visible
                    });
                    break;
                    //*****                    
                case vui5.cons.element.textBox:
                    var rows;
                    oControl.getFormDialog() ? rows = 2 : rows = 10;
                    selection = new sap.m.TextArea({
                        //editable: editable,
                        rows: rows,
                        visible: "{= ${" + modelName + ">" + fieldPath + "NO_OUT} === '' }"
                    })
                    //.bindProperty("value", dataPath, null, sap.ui.model.BindingMode.TwoWay);
                    oControl.bindField({
                        propertyName: "value",
                        selection: selection,
                        fieldInfo: field,
                        fieldPath: fieldPath,
                        bindingMode: bindingMode,
                        path1: dataPath,
                        path2: null
                    });
                    selection.data("fieldname", field['FLDNAME']);
                    contentData.push(selection);
                    break;
                case global.vui5.cons.element.progressIndicator:
                    var txtPath;
                    /*if (field['TXTFL'])
                        txtPath = oControl._sectionDataPath + field['TXTFL'];
                    else*/
                    txtPath = dataPath;

                    selection = new sap.m.ProgressIndicator({
                        //*****Rel 60E_SP6
                        state: sap.ui.core.ValueState.Success,
                        visible: "{= ${" + modelName + ">" + fieldPath + "NO_OUT} === '' }"
                        //*****
                    }).bindProperty("displayValue", {
                        parts: [{ path: txtPath }
                        ],
                        formatter: function (val) {
                            if (val && val != undefined) {
                                return parseFloat(val) + "%";
                            }
                        },
                        mode: sap.ui.model.BindingMode.OneWay
                    }).bindProperty("percentValue", {
                        parts: [{ path: txtPath }
                        ],
                        formatter: function (val) {
                            if (val && val != undefined) {
                                return parseFloat(val);
                            }
                        },
                        mode: sap.ui.model.BindingMode.OneWay
                    })
                    //               	
                    contentData.push(selection);
                    break;
                /***Rel 60E_SP7 - start ***/
                case global.vui5.cons.element.slider:
                	var enabled = "{= ${" + modelName + ">" + oControl.getSectionDataPath() + "/READONLYCOLUMNS}.indexOf('<" + field['FLDNAME'] + ">') === -1 }";
                    selection = new sap.m.Slider({
                        visible: "{= ${" + modelName + ">" + fieldPath + "NO_OUT} === '' }",
                        enabled: enabled,
                        showAdvancedTooltip: true,
                        change: [oControl.onSliderChange, oControl]
                    }).bindProperty("value", {
                        parts: [{ path: dataPath }
                        ],
                        formatter: function (val) {
                            if (val && val != undefined) {
                                return parseFloat(val);
                            }
                        },
                        mode: sap.ui.model.BindingMode.TwoWay
                    });
                    
                    selection.data("dataPath", oControl.getSectionDataPath() + field['FLDNAME']);
                    selection.data("fieldInfo", field);
                    
                    oControl.onInputChange({
                        fieldInfo: field,
                        selection: selection
                    });
                    
                    contentData.push(selection);
                    break;
                    /***Rel 60E_SP7 - end ***/
                case vui5.cons.element.label:
                    oControl.prepareDisplayModeFieldControl({
                        field: field,
                        fieldPath: fieldPath,
                        visible: visible,
                        group_fields: groupflds,
                        grpIndex: grpIndex
                    });
                    break;
                case vui5.cons.element.input:

                    if (field['DATATYPE'] == vui5.cons.dataType.date) {

                        selection = new sap.m.DatePicker({
                            placeholder: " ",
                            valueFormat: vui5.cons.date_format,
                            visible: visible,
                            change: [oControl.dateFieldCheck, oControl],
                            //editable: editable
                        });
                        selection.bindProperty("displayFormat", vui5.modelName + ">" + vui5.cons.modelPath.sessionInfo + "/DATFM", Formatter.displayFormat, sap.ui.model.Binding.OneWay);
                        selection.setVuiDateValue = selection.setValue;
                        selection.setValue = oControl.setDateValue.bind(selection);
                        /*Color Changes-START*/

                        oControl.bindField({
                            propertyName: "value",
                            selection: selection,
                            fieldInfo: field,
                            bindingMode: bindingMode,
                            path1: dataPath,
                            path2: null,
                            fieldPath: fieldPath,
                        });
                        /*Color Changes-END*/

                        oControl.onInputChange({
                            fieldInfo: field,
                            selection: selection
                        });

                        contentData.push(selection);

                    } else if (field['DATATYPE'] == vui5.cons.dataType.time) {

                        selection = new sap.m.TimePicker({
                            valueFormat: "HH:mm:ss",
                            displayFormat: "HH:mm:ss",
                            visible: visible,
                            //  editable: editable
                        });

                        if (setPlaceholder) {
                            selection.bindProperty("tooltip", modelName + ">" + fieldPath + "LABEL", null, sap.ui.model.BindingMode.OneWay);
                        }
                        /*Color Changes-START*/
                        oControl.bindField({
                            propertyName: "value",
                            selection: selection,
                            fieldInfo: field,
                            bindingMode: bindingMode,
                            path1: dataPath,
                            path2: null,
                            fieldPath: fieldPath
                        });

                        /*Color Changes-END*/
                        oControl.onInputChange({
                            fieldInfo: field,
                            selection: selection
                        });
                        contentData.push(selection);
                    } else if (field['DATATYPE'] == vui5.cons.dataType.amount) {
                        selection = new sap.m.Input({
                            showValueHelp: false,
                            textAlign: sap.ui.core.TextAlign.End,
                            // editable: editable,
                            visible: visible,
                            maxLength: parseInt(field['OUTPUTLEN'])
                        });

                        if (setPlaceholder) {
                            selection.bindProperty("placeholder", modelName + ">" + fieldPath + "LABEL", null, sap.ui.model.BindingMode.OneWay);
                            selection.bindProperty("tooltip", modelName + ">" + fieldPath + "LABEL", null, sap.ui.model.BindingMode.OneWay);
                        }

                        if (field['TXTFL'] != '') {
                            txtflPath = oControl._sectionDataPath + field['TXTFL'];
                            /*Color Changes-START*/

                            oControl.bindField({
                                propertyName: "value",
                                selection: selection,
                                fieldInfo: field,
                                bindingMode: bindingMode,
                                path1: txtflPath,
                                path2: null,
                                fieldPath: fieldPath
                            });
                            /*Color Changes-END*/
                        }

                        selection.setTextAlign(sap.ui.core.TextAlign.End);

                        oControl.handleReferenceFields({
                            field: field,
                            fieldPath: fieldPath,
                            groupflds: groupflds,
                            selection: selection,
                            bindingMode: bindingMode,
                            dataArea: dataArea
                        })
                    } else if (field['DATATYPE'] == vui5.cons.dataType.quantity) {
                        selection = new sap.m.Input({
                            showValueHelp: false,
                            // editable: editable,
                            visible: visible,
                            textAlign: sap.ui.core.TextAlign.End,
                            maxLength: parseInt(field['OUTPUTLEN'])
                        });

                        if (setPlaceholder) {
                            selection.bindProperty("placeholder", modelName + ">" + fieldPath + "LABEL", null, sap.ui.model.BindingMode.OneWay);
                            selection.bindProperty("tooltip", modelName + ">" + fieldPath + "LABEL", null, sap.ui.model.BindingMode.OneWay);

                        }

                        if (field['TXTFL'] != '') {
                            txtflPath = oControl._sectionDataPath + field['TXTFL'];
                            /*Color Changes-START*/
                            oControl.bindField({
                                propertyName: "value",
                                selection: selection,
                                fieldInfo: field,
                                bindingMode: bindingMode,
                                path1: txtflPath,
                                path2: null,
                                fieldPath: fieldPath,
                            });
                            /*Color Changes-END*/
                        }
                        selection.setTextAlign(sap.ui.core.TextAlign.End);

                        oControl.handleReferenceFields({
                            field: field,
                            fieldPath: fieldPath,
                            groupflds: groupflds,
                            selection: selection,
                            bindingMode: bindingMode,
                            dataArea: dataArea
                        })

                    } else if (field['DATATYPE'] == vui5.cons.dataType.decimal ||
	                           field['DATATYPE'].substr(0, 3) == vui5.cons.dataType.integer) {
                        selection = new sap.m.Input({
                            showValueHelp: false,
                            textAlign: sap.ui.core.TextAlign.End,
                            // editable: editable,
                            visible: visible,
                            maxLength: parseInt(field['OUTPUTLEN'])
                        });

                        if (setPlaceholder) {
                            selection.bindProperty("placeholder", modelName + ">" + fieldPath + "LABEL", null, sap.ui.model.BindingMode.OneWay);
                            selection.bindProperty("tooltip", modelName + ">" + fieldPath + "LABEL", null, sap.ui.model.BindingMode.OneWay);

                        }

                        if (field['TXTFL'] != '') {
                            txtflPath = oControl._sectionDataPath + field['TXTFL'];
                            /*Color Changes-START*/
                            oControl.bindField({
                                propertyName: "value",
                                selection: selection,
                                fieldInfo: field,
                                bindingMode: bindingMode,
                                path1: txtflPath,
                                path2: null,
                                fieldPath: fieldPath,
                            });
                            /*Color Changes-END*/
                        }

                        selection.setTextAlign(sap.ui.core.TextAlign.End);

                        oControl.onInputChange({
                            fieldInfo: field,
                            selection: selection
                        });
                        contentData.push(selection);
                    } else {
                        selection = new sap.m.Input({
                            showValueHelp: false,
                            //editable: editable,
                            visible: visible,
                            maxLength: parseInt(field['OUTPUTLEN'])
                        });

                        if (setPlaceholder) {
                            selection.bindProperty("placeholder", modelName + ">" + fieldPath + "LABEL", null, sap.ui.model.BindingMode.OneWay);
                            selection.bindProperty("tooltip", modelName + ">" + fieldPath + "LABEL", null, sap.ui.model.BindingMode.OneWay);
                        }

                        oControl.setFieldType(selection, field);

                        if (field['DATATYPE'] == vui5.cons.dataType.amount || field['DATATYPE'] == vui5.cons.dataType.quantity
	                        || field['DATATYPE'] == vui5.cons.dataType.decimal || field['DATATYPE'].substr(0, 3) == vui5.cons.dataType.integer) {
                            if (document_mode != vui5.cons.mode.display)
                                selection.setTextAlign(sap.ui.core.TextAlign.End);
                        }

                        oControl.onInputChange({
                            fieldInfo: field,
                            selection: selection
                        });

                        oControl.handleDescriptionField({
                            selection: selection,
                            fieldPath: fieldPath,
                            field: field,
                            bindingMode: bindingMode,
                            lv_visible: visible,
                            fieldWidth: "50%"
                        });

                        /*Set Numeric Field Width to 50%-START*/
                        if (field['SDSCR'] == vui5.cons.fieldValue.value &&
	                        ((field['INTTYPE'] == vui5.cons.intType.number && field['KEY'] != 'X') ||
	                        field['INTTYPE'] == vui5.cons.intType.oneByteInteger ||
	                        field['INTTYPE'] == vui5.cons.intType.twoByteInteger ||
	                        field['INTTYPE'] == vui5.cons.intType.float ||
	                        field['INTTYPE'] == vui5.cons.intType.decimal16 ||
	                        field['INTTYPE'] == vui5.cons.intType.decimal32 ||
	                        field['INTTYPE'] == vui5.cons.intType.packed)) {
                            selection1 = new sap.m.Input({
                                //visible: visible,
                                visible: false,
                                editable: false
                            });
                            contentData.push(selection1);
                        }
                        /*Set Numeric Field Width to 50%-END*/
                    }
                    break;
                case vui5.cons.element.valueHelp:
                    oControl.prepareValueHelpInputField({
                        field: field,
                        fieldPath: fieldPath,
                        group_fields: groupflds,
                        bindingMode: bindingMode,
                        // editable: lv_editable,
                        visible: visible,
                        dataArea: dataArea,
                        setPlaceholder: setPlaceholder
                    });
                    /*Set Numeric Field Width to 50%-START*/
                    if (field['SDSCR'] == vui5.cons.fieldValue.value &&
	                    ((field['INTTYPE'] == vui5.cons.intType.number && field['KEY'] != 'X') ||
	                    field['INTTYPE'] == vui5.cons.intType.oneByteInteger ||
	                    field['INTTYPE'] == vui5.cons.intType.twoByteInteger ||
	                    field['INTTYPE'] == vui5.cons.intType.float ||
	                    field['INTTYPE'] == vui5.cons.intType.decimal16 ||
	                    field['INTTYPE'] == vui5.cons.intType.decimal32 ||
	                    field['INTTYPE'] == vui5.cons.intType.packed ||
	                    field['INTTYPE'] == vui5.cons.intType.integer)) {
                        selection1 = new sap.m.Input({
                            visible: false,
                            editable: false
                        });
                        contentData.push(selection1);
                    }
                    /*Set Numeric Field Width to 50%-END*/

                    break;

                case vui5.cons.element.link:
                    //*****Rel 60E_SP6
                case global.vui5.cons.element.button:

                    if (field['ELTYP'] === global.vui5.cons.element.button) {
                        var enabled = "{= ${" + modelName + ">" + oControl.getSectionDataPath() + "/READONLYCOLUMNS}.indexOf('<" + field['FLDNAME'] + ">') === -1 }";
                        var params = {
                            visible: visible,
                            enabled: enabled,
                            width: "25%",
                            press: [oControl.onFieldClick, oControl]
                        };
                    }
                    else {
                        var params = {
                            visible: visible,
                            press: [oControl.onFieldClick, oControl]
                        };
                    }

                    selection = field['ELTYP'] === global.vui5.cons.element.link ? new sap.m.Link(params) : new sap.m.Button(params);

                    if (field['ELTYP'] === global.vui5.cons.element.button) {
                        selection.bindProperty("type", {
                            parts: [{ path: dataPath },
                    			    { path: modelName + ">" + fieldPath + "/STYLES" }],
                            formatter: function (val, styles) {
                                var oType = sap.m.ButtonType.Default;
                                if (!underscoreJS.isEmpty(styles)) {
                                    style = underscoreJS.findWhere(styles, { "VALUE": val });
                                    if (style && style['BTNTP'] == global.vui5.cons.buttonType.accept) {
                                        oType = sap.m.ButtonType.Accept;
                                    }
                                    else if (style && style['BTNTP'] == global.vui5.cons.buttonType.reject) {
                                        oType = sap.m.ButtonType.Reject;
                                    }
                                    else if (style && style['BTNTP'] == global.vui5.cons.buttonType.transparent) {
                                        oType = oType = sap.m.ButtonType.Transparent;
                                    }
                                }

                                return oType;
                            },
                            mode: sap.ui.model.BindingMode.OneWay
                        });
                    }

                    /*selection = new sap.m.Link({
                        visible: visible,
                        press: [oControl.onFieldClick, oControl]
                    });*/
                    //*****

                    oControl.handleShowDescription({
                        field: field,
                        eltyp: field['ELTYP'],
                        style: true,
                        selection: selection,
                        bindingMode: bindingMode,
                        visible: visible
                    });
                    selection.data("fieldname", field['FLDNAME']);
                    selection.data("fieldInfo", field);
                    selection.data('datapath', oControl.getSectionDataPath());
                    break;
            }
            if (selection && field['REQUIRED'] && field['ELTYP'] != vui5.cons.element.label) {
                selection.addStyleClass('vuiRequired')
            }
        }

        /*Adjacent Field Changes*/
        if (field['ADJFL'] != '') {
            var infocusModel = oControl.getModel(modelName);
            var formFields = infocusModel.getProperty(oControl.getFieldsPath());
            var adjacentField = underscoreJS.find(formFields, { 'FLDNAME': field['ADJFL'] });
            if (adjacentField) {
                var adjFieldPath = oControl.getFieldsPath() + underscoreJS.findIndex(oControl.getModel(oControl.getModelName()).getProperty(oControl.getFieldsPath()), adjacentField) + "/";

                oControl.prepareChangeModeFieldControl({
                    field: adjacentField,
                    fieldPath: adjFieldPath,
                    visible: visible,
                    group_fields: groupflds,
                    grpIndex: grpIndex,
                    setPlaceholder: true
                });
            }
        }
        /*Adjacent Field Changes*/

    };

    F.prototype.handleReferenceFields = function (params) {

        var oControl = this, field, grpflds, selection, refFieldPath, contentData, sectionDataPath, lv_editable, lv_visible,
            refDataPath, refDrpdnPath, index, fieldPath, modelName, dataArea, bindingMode, refFieldInfo;
        field = params['field'];
        selection = params['selection'];
        fieldPath = params['fieldPath'];
        grpflds = params['groupflds'];
        dataArea = params['dataArea'];
        bindingMode = params['bindingMode'];
        contentData = oControl.contentData;
        sectionDataPath = oControl.getSectionDataPath();
        modelName = oControl.getModelName();
        dropDownModelName = oControl.getDropDownModelName() ? oControl.getDropDownModelName() : vui5.modelName;
        if (field['CFIELDNAME'] || field['QFIELDNAME']) {
            refFieldInfo = field['CFIELDNAME'] ? underscoreJS.find(grpflds, { 'FLDNAME': field['CFIELDNAME'] }) : underscoreJS.find(groupflds, { 'FLDNAME': field['QFIELDNAME'] });

            if (refFieldInfo) {
                //index = underscoreJS.indexOf(groupflds, refFieldInfo);
                if (refFieldInfo['SDSCR'] == vui5.cons.fieldValue.value_descr
                    && refFieldInfo['ELTYP'] != vui5.cons.element.dropDown)
                    selection.setFieldWidth("33%");
                else
                    selection.setFieldWidth("50%");

                refFieldPath = oControl.getFieldsPath() + underscoreJS.findIndex(oControl.getModel(modelName).getProperty(oControl.getFieldsPath()), refFieldInfo) + "/";

                oControl.onInputChange({
                    fieldInfo: field,
                    selection: selection,
                    refPath: field['CFIELDNAME'] ? sectionDataPath + field['CFIELDNAME'] : sectionDataPath + field['QFIELDNAME']
                });

                oControl.amountRef.push({
                    'FLDNAME': field['FLDNAME'],
                    'TABNAME': field['TABNAME'],
                    'CONTROL': selection,
                    'INDEX': ''
                });
                contentData.push(selection);
                lv_visible = visible;
                switch (refFieldInfo['ELTYP']) {
                    case vui5.cons.element.dropDown:
                        refDataPath = oControl._sectionDataPath + refFieldInfo['FLDNAME'];
                        refDrpdnPath = dropDownModelName + ">/DROPDOWNS/" + dataArea + "/" + refFieldInfo['FLDNAME'];

                        oControl.prepareDropdownFieldInput({
                            field: refFieldInfo,
                            //*****Rel 60E_SP6 - QA #10557
                            fieldPath: refFieldPath,
                            //*****
                            dataPath: refDataPath,
                            drpdnPath: refDrpdnPath,
                            bindingMode: bindingMode,
                            visible: lv_visible,
                            group_fields: grpflds,
                            setPlaceholder: true
                        });
                        break;
                    default:
                        oControl.prepareValueHelpInputField({
                            field: refFieldInfo,
                            fieldPath: refFieldPath,
                            group_fields: grpflds,
                            bindingMode: bindingMode,
                            visible: lv_visible,
                            dataArea: dataArea,
                            setPlaceholder: true
                        });
                        break;
                }
            } else {
                var path = field['CFIELDNAME'] ? fieldPath + "CURRENCY" : fieldPath + "QUANTITY";
                selection.setFieldWidth("50%");
                oControl.onInputChange({
                    fieldInfo: field,
                    selection: selection,
                    refPath: path
                });

                oControl.amountRef.push({
                    'FLDNAME': field['FLDNAME'],
                    'TABNAME': field['TABNAME'],
                    'CONTROL': selection,
                    'INDEX': ''
                });
                contentData.push(selection);

                refSelection = new sap.m.Input({
                    editable: false,
                    visible: visible
                });
                refSelection.bindValue(path, null, sap.ui.model.BindingMode.OneWay);
                contentData.push(refSelection);
            }


        } else {
            oControl.onInputChange({
                fieldInfo: field,
                selection: selection
            });
            contentData.push(selection);

            selection1 = new sap.m.Input({
                visible: visible,
                editable: false
            });
            contentData.push(selection1);
        }


    };
    F.prototype.handleShowDescription = function (params) {
        var oControl = this, field, eltyp, style, selection, dataPath, bindingMode, visible, contentData, flag, fieldWidth, modelName, prop, fieldPath;
        field = params['field'];
        eltyp = params['eltyp'];
        style = params['style'];
        selection = params['selection'];
        bindingMode = params['bindingMode'];
        visible = params['visible'];
        flag = params['flag'];
        fieldWidth = params['fieldWidth'];
        fieldPath = params['fieldPath'];
        modelName = oControl.getModelName();
        contentData = oControl.contentData;
        prop = flag ? "value" : "text";


        if (field['SDSCR'] == vui5.cons.fieldValue.description || field['SDSCR'] == vui5.cons.fieldValue.value_cont_descr) {
            descriptionPath = oControl._sectionDataPath + field['TXTFL'];

            /*Color Changes-START*/
            if (style && field['FLSTL'] == vui5.cons.styleType.color) {
                selection.bindProperty(prop, descriptionPath, function (cellValue) {
                    var path = this.getBinding(prop).getPath();
                    var model = this.getBinding(prop).getModel();

                    path = path.replace(field['TXTFL'], field['FLDNAME']);
                    var value = model.getProperty(path);

                    var colorValue = underscoreJS.find(field['STYLES'], { 'VALUE': value });
                    if (colorValue) {
                        this.addStyleClass('vuisapText' + colorValue['COLOR']);
                    }
                    return cellValue;
                }, bindingMode);

                oControl.setEditableProperty({
                    selection: selection,
                    fieldInfo: field,
                    bindingMode: sap.ui.model.BindingMode.Twoway,
                    fieldPath: fieldPath
                });

                /*------------*/
            } else {
                //selection.bindProperty(prop, descriptionPath, null, bindingMode);
                oControl.bindField({
                    propertyName: prop,
                    selection: selection,
                    fieldInfo: field,
                    bindingMode: bindingMode,
                    path1: descriptionPath,
                    path2: null,
                    fieldPath: fieldPath
                });
            }
            /*Color Changes-END*/
            if (eltyp == vui5.cons.element.valueHelp) {
                oControl.bindField({
                    propertyName: prop,
                    selection: selection,
                    fieldInfo: field,
                    bindingMode: bindingMode,
                    path1: descriptionPath,
                    path2: null,
                    fieldPath: fieldPath
                });
            }
            else if (eltyp == vui5.cons.element.link ||
                //*****Rel 60E_SP6
            		 eltyp == vui5.cons.element.button) {
                //*****
                selection.data("model", modelName);
                selection.data("path", fieldPath);
                selection.data('datapath', oControl.getSectionDataPath())
            }
            else if (eltyp != vui5.cons.element.valueHelp) {
                selection.data("model", modelName);
                selection.data("path", fieldPath);
            }
            if (flag) {
                selection.setMaxLength(60);
            }
            contentData.push(selection);
            // Value and Description Field
        }
        else {
            dataPath = oControl._sectionDataPath + field['FLDNAME'];
            if (!flag && eltyp == vui5.cons.element.valueHelp) {
                dataPath = params['dataPath'];
            }
            oControl.bindField({
                propertyName: prop,
                selection: selection,
                fieldInfo: field,
                bindingMode: bindingMode,
                path1: dataPath,
                fieldPath: fieldPath
            });
            contentData.push(selection);

        }
        if (field['SDSCR'] == vui5.cons.fieldValue.value_descr && field['MULTISELECT'] === "") {

            if (eltyp !== vui5.cons.element.valueHelp) {
                /*Color Changes-END*/
                selection.data("model", modelName);
                selection.data("path", fieldPath);
            }

            contentData.push(selection);
            if (flag) {
                selection.setFieldWidth(fieldWidth);
            }
            descriptionPath = oControl._sectionDataPath + field['TXTFL'];

            var selection1 = new sap.m.Text({
                visible: visible
            });
            oControl.bindField({
                propertyName: "text",
                selection: selection1,
                fieldInfo: field,
                bindingMode: bindingMode,
                path1: descriptionPath,
                path2: null
            });

            contentData.push(selection1);
        }

    };
    F.prototype.prepareFileUploaderField = function (params) {
        var oControl, selection, field, dataPath, drpdnPath, fieldPath;
        oControl = this;
        field = params['field'];
        dataPath = params['dataPath'];
        drpdnPath = params['drpdnPath'];
        fieldPath = params['fieldPath'];

        selection = new sap.ui.unified.FileUploader({
            placeholder: sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls").getText("FileUpload"),
            typeMissmatch: [oControl.onTypeMissMatch, oControl],
            change: [oControl.onFileChange, oControl]
        }).bindProperty("fileType", drpdnPath, Formatter.setFileType, sap.ui.model.BindingMode.OneWay)
           .bindProperty("value", dataPath, null, sap.ui.model.BindingMode.TwoWay);

        selection.addStyleClass('vuiFileUploader');
        if (field['REQUIRED']) {
            selection.addStyleClass('vuiRequired')
        }
        selection.data("fieldname", field['FLDNAME']);;
        selection.data("fieldInfo", field);
        selection.data("dataPath", oControl.getSectionDataPath());
        selection.data("model", oControl.getModelName());
        oControl.contentData.push(selection);
        oControl.uploader = selection;
    };
    F.prototype.onFileChange = function (oEvent) {
        var oControl = this, dataPath, field;
        dataPath = oEvent.getSource().data('dataPath');
        field = oEvent.getSource().data('fieldInfo');
        oControl.getModel(oControl.getModelName())
		.setProperty(dataPath + "FILENAME", oEvent.getSource().getValue());
        oControl.uploader.setValueState(sap.ui.core.ValueState.None);
        oControl.processFileUpload(oEvent, dataPath, field);

    },
    F.prototype.onTypeMissMatch = function (oEvent) {
        oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
    };
    F.prototype.setDateValue = function (value) {
        return this.setVuiDateValue(value == "0000-00-00" ? "" : value);
    },
    /*** Rel 60E_SP7 - start ***/
    F.prototype.onSliderChange = function (oEvent) {
        var oControl = this, dataPath;
        dataPath = oEvent.getSource().data('dataPath');
        oControl.getModel(oControl.getModelName())
		.setProperty(dataPath, oEvent.getSource().getValue());
    },
    /*** Rel 60E_SP7 - end ***/
    //*****Rel 60E_SP6 - Task #39097
    F.prototype.prepareToggleFieldInput = function (params) {
        var oControl, selection, modelName, field, fieldPath, dataPath, editable, visible;
        oControl = this;
        modelName = oControl.getModelName();
        field = params['field'];
        fieldPath = params['fieldPath'];
        dataPath = params['dataPath'];
        editable = params['editable'];
        visible = params['visible'];

        selection = new sap.m.Switch({
            visible: visible,
            state: "{= ${" + dataPath + "} === 'X' }",
            change: [oControl._onToggleButtonChange, oControl],
            enabled: false
        });
        //        selection.bindProperty("enabled", {
        //            parts: [{path: modelName + ">" + fieldPath + "DISABLED"},
        //            	    {path: global.vui5.modelName + ">/DOCUMENT_MODE"},
        //            	    {path: oControl._sectionDataPath + "READONLYCOLUMNS"}],
        //            formatter: function (disable, dmode, readOnlyColumns) {
        //                if (disable || dmode == global.vui5.cons.mode.display) {
        //                    return false;
        //                }
        //                else if (readOnlyColumns && readOnlyColumns.indexOf('<' + field['FLDNAME'] + '>') != -1) {
        //                    return false;
        //                }
        //                else {
        //                    return true;
        //                }
        //            },
        //            mode: sap.ui.model.BindingMode.TwoWay
        //        })
        if (editable) {
            oControl.setEditableProperty({
                selection: selection,
                fieldInfo: field,
                bindingMode: sap.ui.model.BindingMode.Twoway,
                fieldPath: fieldPath
            });
            oControl.onInputChange({
                fieldInfo: field,
                selection: selection
            });
        }

        if (field['REQUIRED']) {
            selection.addStyleClass('vuiRequired')
        }
        selection.data("model", modelName);
        selection.data("dataPath", dataPath.replace(modelName + ">", ""));
        oControl.contentData.push(selection);
    };
    //*****    
    F.prototype.prepareCheckBoxFieldInput = function (params) {

        var oControl, selection, modelName, field, fieldPath, dataPath, editable, visible, setPlaceholder;
        oControl = this;
        modelName = oControl.getModelName();
        field = params['field'];
        fieldPath = params['fieldPath'];
        dataPath = params['dataPath'];
        editable = params['editable'];
        visible = params['visible'];
        setPlaceholder = params['setPlaceholder'];

        selection = new sap.m.CheckBox({
            select: [oControl._onCheckBoxSelect, oControl],
            editable: editable,
            visible: visible,
            selected: "{= ${" + dataPath + "} === 'X' }"
        });
        if (editable) {
            oControl.setEditableProperty({
                selection: selection,
                fieldInfo: field,
                bindingMode: sap.ui.model.BindingMode.Twoway,
                fieldPath: fieldPath
            });

            oControl.onInputChange({
                fieldInfo: field,
                selection: selection
            });
        }

        if (setPlaceholder) {
            selection.bindProperty("placeholder", modelName + ">" + fieldPath + "LABEL", null, sap.ui.model.BindingMode.OneWay);
            selection.bindProperty("tooltip", modelName + ">" + fieldPath + "LABEL", null, sap.ui.model.BindingMode.OneWay);
        }
        if (field['REQUIRED']) {
            selection.addStyleClass('vuiRequired')
        }
        selection.data("model", modelName);
        //*****Rel 60E_SP6 - QA #11095
        selection.data("dataPath", dataPath.replace(modelName + ">", ""));
        //*****
        oControl.contentData.push(selection);
    };
    F.prototype.onInputChange = function (params) {
        var oControl = this, sectionDataPath, fieldInfo, selection, refPath, refFields;
        fieldInfo = params['fieldInfo'];
        selection = params['selection'];
        refPath = params['refPath'];
        refFields = params['refFields'];
        sectionDataPath = oControl.getSectionDataPath();
        if (fieldInfo['ELTYP'] == vui5.cons.element.checkBox) {
            selection.attachSelect(function (oEvent) {
                oControl._preProcessOnInputChange({
                    oEvent: oEvent,
                    fieldInfo: fieldInfo,
                    refPath: refPath,
                    sectionDataPath: sectionDataPath,
                    refFields: refFields,
                    amountRef: oControl.amountRef,
                    selection: selection
                });
                oControl.processOnInputChange(oEvent);

            });
        } else {
            selection.attachChange(function (oEvent) {
                oControl._preProcessOnInputChange({
                    oEvent: oEvent,
                    fieldInfo: fieldInfo,
                    refPath: refPath,
                    sectionDataPath: sectionDataPath,
                    refFields: refFields,
                    amountRef: oControl.amountRef,
                    selection: selection
                });
                oControl.processOnInputChange(oEvent);

            });
        }
    };
    F.prototype._preProcessOnInputChange = function (params) {
        var oEvent, fieldInfo, refPath, sectionDataPath, refFields, amountRef, selection;
        oEvent = params['oEvent'];
        fieldInfo = params['fieldInfo'];
        sectionDataPath = params['sectionDataPath'];
        refFields = params['refFields'];
        amountRef = params['amountRef'];
        selection = params['selection'];
        refPath = params['refPath'];
        if (!oEvent.mParameters) {
            oEvent.mParameters = {};
        }
        oEvent.mParameters['fieldInfo'] = fieldInfo;
        oEvent.mParameters['refPath'] = refPath;
        oEvent.mParameters['dataPath'] = sectionDataPath;
        oEvent.mParameters['refFields'] = refFields;
        oEvent.mParameters['fieldRefControl'] = amountRef;
        oEvent.mParameters['selection'] = selection;
    };
    F.prototype.onFieldClick = function (oEvent) {
        var oControl = this, rowData, params, fieldInfo;
        if (!oEvent.mParameters) {
            oEvent.mParameters = {};
        }
        params = {};
        fieldInfo = oEvent.getSource().data("fieldInfo");
        rowData = oControl.getModel(oControl.getModelName()).getProperty(oEvent.getSource().data('datapath'));
        params[vui5.cons.params.fieldName] = oEvent.getSource().data("fieldname") || "";
        params[vui5.cons.params.selectedRow] = rowData['ROWID'] || "";
        oEvent.mParameters['urlParams'] = params;
        oEvent.mParameters['fieldInfo'] = fieldInfo;

        oControl.preProcessFieldClickEvent(oEvent);
    };
    F.prototype.bindField = function (params) {
        var oControl = this, propertyName, selection, fieldInfo, bindingMode, path1, path2, descriptionOnly, concatenate, sectionEditable, fieldPath;
        propertyName = params['propertyName'];
        selection = params["selection"];
        fieldInfo = params['fieldInfo'];
        bindingMode = params['bindingMode'];
        path1 = params['path1'];
        path2 = params['path2'];
        descriptionOnly = params['descriptionOnly'];
        concatenate = params['concatenate'];
        fieldPath = params['fieldPath'];
        sectionEditable = oControl.getSectionEditable();

        if (!!fieldInfo['MULTISELECT']) {
            return;
        }

        if (fieldInfo['FLSTL'] == vui5.cons.styleType.color && fieldInfo['ELTYP'] != vui5.cons.element.dropDown) {
            if (path2 && path2 != "") {
                selection.bindProperty(propertyName, {
                    mode: bindingMode,
                    formatter: function (cellValue, description) {
                        var value = oControl.__setColor.call(this, {
                            fieldInfo: fieldInfo,
                            cellValue: cellValue,
                            description: description,
                            descriptionOnly: descriptionOnly,
                            concatenate: concatenate
                        });
                        return value;
                    },
                    parts: [{ path: path1 },
                        { path: path2 }]
                });
            } else {
                selection.bindProperty(propertyName, {
                    path: path1,
                    formatter: function (cellValue) {
                        var value = oControl.__setColor.call(this, {
                            fieldInfo: fieldInfo,
                            cellValue: cellValue
                        });
                        return value;
                    },
                    mode: bindingMode
                });

            }
        } else {
            if (descriptionOnly) {
                selection.bindProperty(propertyName, path2, null, bindingMode);
            } else if (concatenate) {
                selection.bindProperty(propertyName, {
                    parts: [{ path: path1 },
                        { path: path2 }]
                });
            } else {
                selection.bindProperty(propertyName, path1, null, bindingMode);
            }
        }
        /*Rel 60E_SP6 - ECIP #16716*/
        if (selection && fieldInfo['DATATYPE']) {
            selection.data("dataType", fieldInfo['DATATYPE']);
        }
        /**/
        if (sectionEditable && !(selection instanceof sap.m.Text || selection instanceof sap.m.Link ||
            //*****Rel 60E_SP6
        		selection instanceof sap.m.Button)) {
            //*****
            oControl.setEditableProperty({
                selection: selection,
                fieldInfo: fieldInfo,
                bindingMode: bindingMode,
                fieldPath: fieldPath
            });
        }
    };
    F.prototype.setEditableProperty = function (params) {
        var oControl = this, sectionDataPath, fieldPath, field, selection, bindingMode, modelName, propertyType, sectionEditable;
        selection = params['selection'];
        field = params['fieldInfo'];
        propertyType = selection instanceof sap.m.Switch ? 'enabled' : 'editable';
        bindingMode = params['bindingMode'];
        modelName = oControl.getModelName();
        fieldPath = params['fieldPath'];

        //*****Rel 60E_SP6
        sectionEditable = oControl.getSectionEditable();

        if (sectionEditable && !(selection instanceof sap.m.Text ||
        		                 selection instanceof sap.m.Link ||
            		             selection instanceof sap.m.Button)) {
            //*****

            if (oControl.getFormDialog()) {
                selection.bindProperty(propertyType, {
                    parts: [{
                        path: modelName + ">" + fieldPath + "DISABLED"
                    }, {
                        path: oControl._sectionDataPath + "READONLYCOLUMNS"
                    }],
                    formatter: function (disable, readOnlyColumns) {
                        if (disable) {
                            return false;
                        }
                        else if (readOnlyColumns && readOnlyColumns.indexOf('<' + field['FLDNAME'] + '>') != -1) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    },
                    mode: bindingMode
                })

            } else {
                selection.bindProperty(propertyType, {
                    parts: [{
                        path: modelName + ">" + oControl.getSectionPath() + "EDIT"
                    }, {
                        path: modelName + ">" + fieldPath + "DISABLED"
                    }, {
                        path: oControl._sectionDataPath + "READONLYCOLUMNS"
                    }, {
                        path: modelName + ">" + fieldPath
                    }],
                    formatter: function (edit, disable, readOnlyColumns, field) {
                        if (disable) {
                            return false;
                        }

                        //if(edit){
                        if (readOnlyColumns && readOnlyColumns.indexOf('<' + field['FLDNAME'] + '>') != -1) {
                            return false;
                        }
                        else {
                            return true;
                        }
                        //}
                        //	    	      else{
                        //	    				return true;
                        //	    			}
                    },
                    mode: bindingMode
                })

            }
            //*****Rel 60E_SP6
        }
        //*****
    };
    F.prototype.__setColor = function (params) {
        var fieldInfo, cellValue, description, descriptionOnly, concatenate, colorValue;
        cellValue = params['cellValue'];
        description = params['description'];
        descriptionOnly = params['descriptionOnly'];
        concatenate = params['concatenate'];
        fieldInfo = params['fieldInfo'];
        colorValue = underscoreJS.find(fieldInfo['STYLES'], { 'VALUE': cellValue });
        if (colorValue) {
            this.addStyleClass('vuisapText' + colorValue['COLOR']);
        }
        if (descriptionOnly) {
            return description;
        } else if (concatenate) {
            return cellValue + ' ' + description;
        }
        return cellValue;
    };
    F.prototype.__setIcon = function (params) {
        var oControl = this, template, dataPath, fieldInfo, modelName, visible;
        fieldInfo = params['fieldInfo'];
        modelName = params['modelName'];
        visible = params['visible'];
        template = new sap.ui.core.Icon({
            useIconTooltip: false,
            tooltip: fieldInfo['TOOLTIP'],
            visible: visible
        });
        if (fieldInfo['SDSCR'] == vui5.cons.fieldValue.description || fieldInfo['SDSCR'] == vui5.cons.fieldValue.value_cont_descr) {
            dataPath = fieldInfo['TXTFL'];
        } else {
            dataPath = fieldInfo['FLDNAME'];
        }
        template.data('datapath', oControl.getSectionDataPath() + dataPath);
        template.bindProperty("src", modelName + ">" + oControl.getSectionDataPath() + dataPath, function (value) {
            var bindingContext = this.getBindingContext(oControl.getModelName());
            if (bindingContext) {
                var rowData = bindingContext.getObject();
                if (rowData && rowData.hasOwnProperty('READONLYCOLUMNS')) {
                    if (!rowData['READONLYCOLUMNS'].includes(fieldInfo['FLDNAME'])) {
                        template.attachPress(oControl.onFieldClick, oControl);
                    }
                }
            }
            if (value != undefined) {
                var iconProperty = underscoreJS.find(fieldInfo['STYLES'], {
                    'VALUE': value
                });
                if (iconProperty) {
                    this.addStyleClass('vuisapText' + iconProperty['COLOR']);
                    return iconProperty.ICON;
                }
            }
        });
        template.data("fieldname", dataPath);
        template.data("fieldInfo", fieldInfo);
        return template;
    };
    F.prototype.setFieldType = function (selection, fieldInfo) {
        if (fieldInfo['SDSCR'] == vui5.cons.fieldValue.value
            || fieldInfo['SDSCR'] == vui5.cons.fieldValue.value_descr) {
            if (fieldInfo['INTTYPE'] == vui5.cons.intType.number ||
                fieldInfo['INTTYPE'] == vui5.cons.intType.oneByteInteger ||
                fieldInfo['INTTYPE'] == vui5.cons.intType.twoByteInteger ||
                fieldInfo['INTTYPE'] == vui5.cons.intType.float ||
                fieldInfo['INTTYPE'] == vui5.cons.intType.decimal16 ||
                fieldInfo['INTTYPE'] == vui5.cons.intType.decimal32) {
                selection.setType(sap.m.InputType.Number);
            }
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
        /*Set Numeric Field Width to 50%-START*/
    };
    F.prototype.bindTypeAheadField = function (params) {

        var oControl = this, selection, fieldPath, fieldInfo, dataArea;
        selection = params['selection'];
        fieldPath = params['fieldPath'];
        fieldInfo = params['fieldInfo'];
        dataArea = params['dataArea'];
        selection.setShowSuggestion(true);
        selection.setFilterSuggests(false);
        if (fieldInfo['INTLEN'] == 1) {
            selection.setStartSuggestion(1);
        }
        else {
            selection.setStartSuggestion(2);
        }
        selection.setMaxSuggestionWidth("50%");
        selection.attachSuggest(function (oEvent) {
            var source = oEvent.getSource();
            var model = source.getModel(source.data("model"));
            var fieldInfo = model.getProperty(source.data("path"));
            oEvent.mParameters['eventType'] = vui5.cons.fieldSubEvent.typeAhead;
            oEvent.mParameters['fieldInfo'] = fieldInfo;
            oEvent.mParameters['fieldValue'] = oEvent.getParameter('suggestValue');
            oEvent.mParameters['oEvent'] = oEvent;
            oControl.preProcessFieldEvent(oEvent);

        });
        if (!fieldInfo['MULTISELECT']) {
            selection.attachSuggestionItemSelected(function (oEvent) {
                oControl.handleSuggestionItemSelected(oEvent, control);
            });
        }
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
        selection.data("model", oControl.getModelName());
        selection.data("path", fieldPath);
        selection.data("dataArea", dataArea);
    },

    F.prototype.handleSuggestionItemSelected = function (oEvent) {

        var source, model, fieldInfo, item, rowData, mainModel, returnField, descrField, oControl;
        oControl = this;
        source = oEvent.getSource();
        model = source.getModel(source.data("model"));
        fieldInfo = model.getProperty(source.data("path"));
        item = oEvent.getParameter("selectedRow");
        rowData = item.getBindingContext(vui5.modelName).getObject();
        mainModel = oControl.getModel(vui5.modelName);
        returnField = mainModel.getProperty("/TYPEAHEAD/" + fieldInfo['FLDNAME'] + "/RETURNFIELD");
        descrField = mainModel.getProperty("/TYPEAHEAD/" + fieldInfo['FLDNAME'] + "/DESCRFIELD");
        source.setValue(rowData[returnField]);
        /*Description Buffer Changes*/
        if (descrField && descrField != '') {
            var descriptionBuffer = mainModel.getProperty("/DESCRIPTION_BUFFER");
            var bufferEntry = underscoreJS.find(descriptionBuffer, {
                'FLDNAME': fieldInfo['FLDNAME'],
                'TABNAME': fieldInfo['TABNAME'],
                'FLDVAL': rowData[returnField]
            });
            if (bufferEntry) {
                bufferEntry['DESCRIPTION'] = rowData[descrField];
            } else {
                descriptionBuffer.push({
                    'FLDNAME': fieldInfo['FLDNAME'],
                    'TABNAME': fieldInfo['TABNAME'],
                    'FLDVAL': rowData[returnField],
                    'DESCRIPTION': rowData[descrField]
                });
            }
        }

        source.fireChange();
    };
    F.prototype.prepareDropdownFieldInput = function (params) {
        var oControl = this, selection, modelName, sectionDataPath, fieldsPath, field, dataPath, drpdnPath, bindingMode, editable, visible, group_fields, setPlaceholder, fldpath;
        modelName = oControl.getModelName();
        sectionDataPath = oControl.getSectionDataPath();
        fieldsPath = oControl.getFieldsPath();
        field = params['field'];
        dataPath = params['dataPath'];
        drpdnPath = params['drpdnPath'];
        bindingMode = params['bindingMode'];
        //editable = params['editable'];
        visible = params['visible'];
        group_fields = params['group_fields'];
        setPlaceholder = params['setPlaceholder'];
        fldPath = params['fieldPath'];

        if (field['MULTISELECT'] == 'X') {

            var multiValue = new global.vui5.ui.controls.MultiValue({
                modelName: oControl.getModelName(),
                elementType: field['ELTYP'],
                fieldPath: fieldsPath,
                dataPath: oControl.getSectionDataPath() + field['FLDNAME'],
                dataAreaID: oControl.getDataArea(),
                commaSeparator: field['MVLFLD'] === ""
            });
            multiValue.setModel(oControl.getModel(oControl.getModelName()), oControl.getModelName());
            multiValue.setModel(oControl.getModel(global.vui5.modelName), global.vui5.modelName);
            selection = multiValue.prepareField();
            //selection = new sap.m.MultiComboBox({
            //    //editable: editable,
            //    visible: visible
            //});
            //selection.bindAggregation("items", drpdnPath, function (sid, oContext) {
            //    var contextObject = oContext.getObject();
            //    return new sap.ui.core.Item({
            //        key: contextObject['NAME'],
            //        text: contextObject['VALUE']
            //    });
            //});
            ///*Color Changes-START*/
            //oControl.bindField({
            //    propertyName: "selectedKeys",
            //    selection: selection,
            //    fieldInfo: field,
            //    bindingMode: bindingMode,
            //    path1: dataPath,
            //    path2: null,
            //    fieldPath: fldPath
            //});
            /*Color Changes-END*/
        } else {
            //selection = new sap.m.ComboBox({
            selection = new vui5.ui.controls.ComboBox({
                // editable: editable,
                visible: visible
            });
            selection.bindAggregation("items", drpdnPath, function (sid, oContext) {
                var contextObject = oContext.getObject();
                return new sap.ui.core.Item({
                    key: contextObject['NAME'],
                    text: contextObject['VALUE']
                });
            });

            selection.data("dataPath", oControl.getSectionDataPath() + field['FLDNAME']);
            /*Color Changes-START*/
            oControl.bindField({
                propertyName: "selectedKey",
                selection: selection,
                fieldInfo: field,
                bindingMode: bindingMode,
                path1: dataPath,
                path2: null,
                fieldPath: fldPath
            });
            /*Color Changes-END*/

            if (/*field['REQUIRED'] && */
            	!underscoreJS.isEmpty(field['DEPFL'])) {
                selection.attachLoadItems(function (oEvent) {
                    oControl.getDropdownValues(oEvent, field);
                });
            }

        }

        if (setPlaceholder) {
            selection.bindProperty("placeholder", modelName + ">" + fieldsPath + "LABEL", null, sap.ui.model.BindingMode.OneWay);
            selection.bindProperty("tooltip", modelName + ">" + fieldsPath + "LABEL", null, sap.ui.model.BindingMode.OneWay);
        }

        //if (editable != false) {
        var sectionDataPath = sectionDataPath;
        if (field['DATATYPE'] == vui5.cons.dataType.currencyKey) {
            var amountFields = underscoreJS.where(group_fields, { 'CFIELDNAME': field['FLDNAME'] });
            oControl.onInputChange({
                fieldInfo: field,
                selection: selection,
                refPath: sectionDataPath + field['FLDNAME'],
                refFields: amountFields
            });
        } else if (field['DATATYPE'] == vui5.cons.dataType.unit) {
            var quantityFields = underscoreJS.where(group_fields, { 'QFIELDNAME': field['FLDNAME'] });
            oControl.onInputChange({
                fieldInfo: field,
                selection: selection,
                refPath: sectionDataPath + field['FLDNAME'],
                refFields: quantityFields
            });
        } else {
            oControl.onInputChange({
                fieldInfo: field,
                selection: selection
            });
        }
        // }
        if (field['REQUIRED']) {
            selection.addStyleClass('vuiRequired')
        }
        oControl.contentData.push(selection);
    },

    F.prototype.prepareValueHelpInputField = function (params) {

        var oControl = this, selection, field, fieldPath, group_fields, bindingMode, editable, visible, dataArea, setPlaceholder,
            multiValue;
        field = params['field'];
        fieldPath = params['fieldPath'];
        group_fields = params['group_fields'];
        bindingMode = params['bindingMode'];
        // editable = params['editable'];
        visible = params['visible'];
        dataArea = params['dataArea'];
        setPlaceholder = params['setPlaceholder'];

        if (field['MULTISELECT']) {
            multiValue = new global.vui5.ui.controls.MultiValue({
                modelName: oControl.getModelName(),
                elementType: field['ELTYP'],
                fieldPath: fieldPath,
                commaSeparator: field['MVLFLD'] === "",
                dataPath: oControl.getSectionDataPath() + field['FLDNAME'],
            });
            multiValue.setModel(oControl.getModel(oControl.getModelName()), oControl.getModelName());
            multiValue.setModel(oControl.getModel(global.vui5.modelName), global.vui5.modelName);
            selection = multiValue.prepareField();
            selection.attachValueHelpRequest(oControl.onValueHelpRequest.bind(oControl));
        }
        else {
            selection = new sap.m.Input({
                showValueHelp: true,
                valueHelpRequest: function (oEvent) {
                    oControl.onValueHelpRequest(oEvent);
                },
                // editable: editable,
                visible: visible,
                maxLength: parseInt(field['OUTPUTLEN'])
            });
        }


        if (field['REQUIRED']) {
            selection.addStyleClass('vuiRequired')
        }
        if (setPlaceholder) {
            selection.bindProperty("placeholder", oControl.getModelName() + ">" + fieldPath + "LABEL", null, sap.ui.model.BindingMode.OneWay);
            selection.bindProperty("tooltip", oControl.getModelName() + ">" + fieldPath + "LABEL", null, sap.ui.model.BindingMode.OneWay);
        }

        var lv_percent = "50%";

        //if (editable != false) {
        var sectionDataPath = oControl.getSectionDataPath();
        if (field['DATATYPE'] == vui5.cons.dataType.currencyKey) {
            lv_percent = "33%";
            var amountFields = underscoreJS.where(group_fields, { 'CFIELDNAME': field['FLDNAME'] });
            oControl.onInputChange({
                fieldInfo: field,
                selection: selection,
                refPath: sectionDataPath + field['FLDNAME'],
                refFields: amountFields
            });
        } else if (field['DATATYPE'] == vui5.cons.dataType.unit) {
            lv_percent = "33%";
            var quantityFields = underscoreJS.where(group_fields, { 'QFIELDNAME': field['FLDNAME'] });
            oControl.onInputChange({
                fieldInfo: field,
                selection: selection,
                refPath: sectionDataPath + field['FLDNAME'],
                refFields: quantityFields
            });
        } else {
            oControl.onInputChange({
                fieldInfo: field,
                selection: selection
            });
        }
        oControl.setFieldType(selection, field);
        oControl.bindTypeAheadField({
            selection: selection,
            fieldPath: fieldPath,
            fieldInfo: field,
            dataArea: dataArea
        });
        oControl.handleDescriptionField({
            selection: selection,
            fieldPath: fieldPath,
            field: field,
            bindingMode: bindingMode,
            lv_visible: visible,
            fieldWidth: lv_percent
        });

        //	    } else {
        //	    	oControl.handleDescriptionField({	                        
        //	        	selection: selection,
        //	        	fieldPath: fieldPath,
        //	        	field: field,
        //	        	bindingMode: bindingMode,
        //	        	lv_visible: visible,
        //	        	fieldWidth: lv_percent
        //	        	});
        //	    }
    };
    F.prototype.handleDescriptionField = function (params) {

        var oControl = this, descriptionPath, dataPath, contentData, sectionDataPath, selection, fieldPath, fieldInfo, bindingMode, lv_visible, fieldWidth;
        contentData = oControl.contentData;
        sectionDataPath = oControl.getSectionDataPath();
        selection = params['selection'];
        fieldPath = params['fieldPath'];
        fieldInfo = params['field'];
        bindingMode = params['bindingMode'];
        lv_visible = params['lv_visible'];
        fieldWidth = params['fieldWidth'];

        oControl.handleShowDescription({
            field: fieldInfo,
            eltyp: fieldInfo['ELTYP'],
            style: true,
            selection: selection,
            bindingMode: bindingMode,
            visible: lv_visible,
            flag: true,
            fieldWidth: fieldWidth,
            fieldPath: fieldPath
        });
    };
    return F;
});