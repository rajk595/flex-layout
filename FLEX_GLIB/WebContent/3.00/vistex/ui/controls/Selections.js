sap.ui.define([
    "sap/ui/core/Control",
    vistexConfig.rootFolder + "/ui/core/global",
    vistexConfig.rootFolder + "/ui/core/underscore-min",
    vistexConfig.rootFolder + "/ui/core/Formatter"
], function (control, global, underscoreJS, Formatter) {
    var A = control.extend(vistexConfig.rootFolder + ".ui.controls.Selections", {
        metadata: {
            properties: {
                controller: {
                    type: "object",
                    defaultValue: null
                },
                handle: {
                    type: "string",
                    defaultValue: null
                },
                variant: {
                    type: "string",
                    defaultValue: null
                },
                sectionPath: {
                    type: "string",
                    defaultValue: null
                },
                dataPath: {
                    type: "string",
                    defaultValue: null
                },
                fieldsPath: {
                    type: "string",
                    defaultValue: null
                },
                modelName: {
                    type: "string",
                    defaultValue: null
                },
                dropdownModel: {
                    type: "string",
                    defaultValue: null
                },
                variantDataPath: {
                    type: "string",
                    defaultValue: null
                },
                dataAreaID: {
                    type: "string",
                    defaultValue: null
                },
                selectedVariant: {
                    type: "string",
                    defaultValue: null
                },
                showVariants: {
                    type: "boolean",
                    defaultValue: false
                },
                goVisibleProperty: {
                    type: "boolean",
                    defaultValue: false
                },
                showFilterConfiguration: {
                    type: "string",
                    defaultValue: null
                },
                hideVariantSave: {
                    type: "boolean",
                    defaultValue: false
                },
                /***Rel 60E SP6 ECDM #4728 - Start ***/
                hideShare: {
                    type: "boolean",
                },
                /***Rel 60E SP6 ECDM #4728 - End ***/
                //*****Rel 60E_SP6
                hideFilterBar: {
                    type: "string",
                    //defaultValue: false
                },
                //*****
                //*****Rel 60E_SP6 - Sanofi Req
                enableDescriptionSearch: {
                    type: "string",
                    defaultValue: false
                }
                //*****
            },
            events: {
                search: {
                    parameters: {
                        selectionSet: {
                            type: "sap.ui.core.Control[]"
                        }
                    }
                },
                functionExecute: {
                    parameters: {
                        selectionSet: {
                            type: "sap.ui.core.Control[]"
                        }
                    }
                },
                fieldEvent: {
                    parameters: {
                        selectionSet: {
                            type: "sap.ui.core.Control[]"
                        }
                    }
                },
                variantSave: {},
                variantSelect: {},
                onValueHelpRequest: {}
            },
            aggregations: {
                _getSelections: {
                    type: "sap.ui.comp.filterbar.FilterBar",
                    multiple: false
                }
            }
        },
        init: function () {
            var sLocale = sap.ui.getCore().getConfiguration().getLanguage();
            if (sLocale.length > 2) {
                sLocale = sLocale.substring(0, 2);
            }
            this._oBundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls");
        },
        renderer: function (oRM, oControl) {
            oRM.write("<div");
            oRM.writeControlData(oControl);
            oRM.write(">");
            oRM.renderControl(oControl.getAggregation("_getSelections"));
            oRM.write("</div>");
        }
    });
    A.prototype.setHandle = function (value) {
        this.setProperty("handle", value, true);
    };
    A.prototype.setVariant = function (value) {
        this.setProperty("variant", value, true);
    };
    A.prototype.setSectionPath = function (value) {
        this.setProperty("sectionPath", value, true);
    };
    A.prototype.setDataPath = function (value) {
        this.setProperty("dataPath", value, true);
    };
    A.prototype.setFieldsPath = function (value) {
        this.setProperty("fieldsPath", value, true);
    };
    A.prototype.setModelName = function (value) {
        this.setProperty("modelName", value, true);
    };
    A.prototype.setDropdownModel = function (value) {
        this.setProperty("dropdownModel", value, true);
    };
    A.prototype.setVariantDatapath = function (value) {
        this.setProperty("variantDataPath", value, true);
    };
    A.prototype.setVariantDataPath = function (value) {
        this.setProperty("variantDataPath", value, true);
    };
    A.prototype.setDataAreaID = function (value) {
        this.setProperty("dataAreaID", value, true);
    };
    A.prototype.setSelectedVariant = function (value) {
        this.setProperty("selectedVariant", value, true);
    };
    A.prototype.setShowVariants = function (value) {
        this.setProperty("showVariants", value, true);
    };
    A.prototype.setGoVisibleProperty = function (value) {
        this.setProperty("goVisibleProperty", value, true);
    };
    A.prototype.setShowFilterConfiguration = function (value) {
        this.setProperty("showFilterConfiguration", value, true);
    };
    //*****Rel 60E_SP6
    A.prototype.setHideFilterBar = function (value) {
        this.setProperty("hideFilterBar", value, true);
    };
    //*****
    //*****Rel 60E_SP6 - Sanofi Req    
    A.prototype.setEnableDescriptionSearch = function (value) {
        this.setProperty("enableDescriptionSearch", value, true);
    };
    //*****
    /***Rel 60E SP6 ECDM #4728 - Start ***/
    A.prototype.setHideShare = function (value) {
        this.setProperty("hideShare", value, true);
    };
    /***Rel 60E SP6 ECDM #4728 - End ***/

    A.prototype.setHideVariantSave = function (value) {
        this.setProperty("hideVariantSave", value, true);
    };
    
    A.prototype.toggleFilterExpand = function () {
        var oControl = this, model;
        model = oControl.getModel(oControl.getModelName());
        oControl.oFilter.setFilterBarExpanded(!model.getProperty(oControl.getHideFilterBar()));

    };
    A.prototype.selectionInfocusSet = function (objtp, appln) {
        var oControl = this;
        var data = [];
        var oSelection = this;
        var oController = this.getController();
        var handle = this.getHandle();
        var variant = this.getVariant();
        var sectionPath = this.getSectionPath();
        var DataPath = this.getDataPath();
        var fieldsPath = this.getFieldsPath();
        var modelName = this.getModelName();
        var mainModel = oController.getModel(global.vui5.modelName);
        var model = oControl.getModel(oControl.getModelName());
        var dropdownModel = this.getDropdownModel();
        this.oFilter = new global.vui5.ui.controls.FilterBar({
            search: function () {
                oControl.toggleFilterExpand();
                oControl.fireSearch({});
            },
            objectType: objtp,
            application: appln,
            searchDataPath: DataPath,
            searchFieldsPath: fieldsPath,
            modelName: modelName,
            showGoOnFB: this.getGoVisibleProperty(),
            showFilterConfiguration: this.getGoVisibleProperty(),
            useToolbar: this.getGoVisibleProperty(),
            searchEnabled: this.getGoVisibleProperty(),
            selectedVariant: oControl.getSelectedVariant(),
            variantDataPath: oControl.getVariantDataPath(),
            /***Rel 60E SP6 ECDM #4728 - Start ***/
            hideShare: oControl.getHideShare(),
            /***Rel 60E SP6 ECDM #4728 - End ***/
            variantSave: function (oEvent) {
                oControl.fireVariantSave({
                    callback: oEvent.getParameter("callback")
                });
            },
            variantSelect: function (oEvent) {
                oControl.fireVariantSelect({
                    record: oEvent.getParameter("record"),
                    callback: oEvent.getParameter("callback")
                });
            }
        });

        this.oFilter.bindProperty("filterBarExpanded", oControl.getModelName() + ">" + this.getHideFilterBar(), function (value) {
            return !value;
        });
        if (!this.getGoVisibleProperty()) {
            this.oFilter.addStyleClass("vuiFilterBar");
        }
        if (this.getShowVariants()) {
            this.oFilter.setPersistencyKey("XXX");
        }
        
        if (oControl.getHideVariantSave()) {
            this.oFilter._oVariantManagement.setVisible(false);
            this.oFilter.setShowFilterConfiguration(false);
        }
        this.oFilter.setModel(this.getModel(modelName), modelName);
        this.oFilter.bindAggregation("filterItems", modelName + ">" + fieldsPath, function (sId, oContext) {
            var obj = oContext.getObject();
            var selection, itemsPath;
            var fieldPath = oContext.getPath();
            /* Temp Changes */
            // var dataPath = modelName + ">" + DataPath + obj['FLDNAME'];
            var tabname = obj['TABNAME'];
            tabname = tabname.substr(tabname.lastIndexOf("/") + 1, tabname.length);
            var dataPath = modelName + ">" + DataPath + obj['FLDNAME'] + "-" + tabname;
            /* Temp Changes */
            var eltyp;
            if (obj['DATATYPE'] == global.vui5.cons.dataType.date || obj['DATATYPE'] == global.vui5.cons.dataType.time) {
                eltyp = global.vui5.cons.element.input;
            }
            else if (obj['DATATYPE'] == global.vui5.cons.dataType.amount || obj['DATATYPE'] == global.vui5.cons.dataType.quantity) {
                eltyp = global.vui5.cons.element.valueHelp;
            }
            else {
                eltyp = obj['ELTYP'];
            }
            switch (eltyp) {
                case global.vui5.cons.element.input:
                    if (obj['DATATYPE'] == global.vui5.cons.dataType.date) {
                        if (obj['MULTISELECT'] == 'X') {
                            selection = new global.vui5.ui.controls.DateRange({
                                // displayFormat: "long",
                                // width : "50%",
                                delimiter: global.vui5.dateRangeDelimiter,
                                placeholder: " ",
                                //*****Rel 60E_SP6
                                //valueFormat: "YYYYMMdd",
                                valueFormat: "yyyyMMdd",
                                //*****
                                change: function (oEvent) {
                                    oControl.onDateChange(oEvent);
                                    oControl._onChange(oEvent);
                                }
                            });
                            selection.bindProperty("placeholder", vui5.modelName + ">" + global.vui5.cons.modelPath.sessionInfo + "/DATFM", function (value) {
                                if (value != undefined) {
                                    if (underscoreJS.isEmpty(value)) {
                                        return '';
                                    }
                                    else {
                                        return value + ' ' + global.vui5.dateRangeDelimiter + ' ' + value;
                                    }
                                }
                            }, sap.ui.model.Binding.OneWay);
                            selection.bindProperty("displayFormat", global.vui5.modelName + ">" + global.vui5.cons.modelPath.sessionInfo + "/DATFM", Formatter.displayFormat, sap.ui.model.Binding.OneWay);
                            selection.bindProperty("dateValue", dataPath + "/0/LOW", Formatter.javascriptDateFormat, sap.ui.model.Binding.OneWay);
                            selection.bindProperty("secondDateValue", dataPath + "/0/HIGH", Formatter.javascriptDateFormat, sap.ui.model.Binding.OneWay);
                        } else {
                            selection = new sap.m.DatePicker({
                                // displayFormat: "long",
                                //*****Rel 60E_SP6
                                //valueFormat : "YYYYMMdd",
                                valueFormat: "yyyyMMdd",
                                //*****
                                placeholder: "",
                                change: function (oEvent) {
                                    var oSource = oEvent.getSource();
                                    if (oEvent.getParameter("valid")) {
                                        oSource.setValueState(sap.ui.core.ValueState.None);
                                        oSource.setValueStateText("");
                                        oController._handleCheckFieldsMessages(
                                            "",
                                            "",
                                            oSource.getId() + "/value");
                                    } else {
                                        oSource.setValueState(sap.ui.core.ValueState.Error);
                                        var text = oSource.getParent().getAggregation("content")[0].mProperties.text;
                                        var errorText = this._oBundle.getText("EnterValid", [text]);
                                        oSource.setValueStateText(errorText);
                                        oController._handleCheckFieldsMessages(
                                            errorText,
                                            sap.ui.core.MessageType.Error,
                                            oSource.getId() + "/value");
                                    }
                                    oControl._onChange(oEvent);
                                }
                            });
                            selection.bindProperty("displayFormat", global.vui5.modelName + ">" + global.vui5.cons.modelPath.sessionInfo + "/DATFM", Formatter.displayFormat, sap.ui.model.Binding.OneWay);
                            selection.bindValue(dataPath + "/0/LOW");
                        }
                    } else {
                        if (obj['MULTISELECT'] == "X") {
                            selection = new sap.m.MultiInput({
                                maxLength: parseInt(obj['OUTPUTLEN']),
                                enableMultiLineMode: true,
                                showValueHelp: false,
                                tokenChange: [oController.onF4Select, oController],
                                change: oControl._onChange.bind(oControl)
                            });
                            selection.addValidator(function (args) {
                                var text = args.text;
                                if (obj['LOWERCASE'] == '' && obj['INTTYPE'] == global.vui5.cons.intType.character) {
                                    text = text.toUpperCase();
                                }
                                return new sap.m.Token({
                                    key: text,
                                    text: text
                                });
                            });
                            selection.data("model", modelName);
                            selection.data("path", fieldPath);
                            selection.data("dataAreaID", oControl.getDataAreaID());
                            selection.bindAggregation("tokens", dataPath, function (sId, oContext) {
                                var object = oContext.getObject();
                                var token = oSelection.createToken(object);
                                token.bindProperty("editable", {
                                    parts: [{
                                        path: modelName + ">" + fieldPath + "/DISABLED"
                                    },
                                        {
                                            path: modelName + ">" + sectionPath + "/DISOL"
                                        },
                                        {
                                            path: global.vui5.modelName + ">" + global.vui5.cons.modelPath.infocusUIPrf + "/UITYP"
                                        },
                                        {
                                            path: global.vui5.modelName + ">/DOCUMENT_MODE"
                                        },
                                        {
                                            path: modelName + ">" + sectionPath + "/EDIT"
                                        }],
                                    formatter: function (disabled, disol, uityp, dmode, alwaysEdit) {
                                        if (disabled || disol) {
                                            return false;
                                        }
                                        if (alwaysEdit) {
                                            return true;
                                        }
                                        if (!oController._formDialog) {
                                            if (uityp === global.vui5.cons.UIType.infocus && dmode === global.vui5.cons.mode.display) {
                                                return false;
                                            }
                                        }
                                        return true;
                                    }
                                });
                                return token;
                            });
                            oSelection.setFieldType(selection, obj);
                        } else {
                            selection = new sap.m.Input({
                                maxLength: parseInt(obj['OUTPUTLEN']),
                                change: oControl._onChange.bind(oControl)
                            });
                            selection.bindValue(dataPath + "/0/LOW");
                            oSelection.setFieldType(selection, obj);
                        }
                    }
                    break;
                case global.vui5.cons.element.valueHelp:
                    if (obj['MULTISELECT'] == "X") {
                        selection = new sap.m.MultiInput({
                            showValueHelp: true,
                            maxLength: parseInt(obj['OUTPUTLEN']),
                            enableMultiLineMode: true,
                            valueHelpRequest: oControl.onValueHelpRequest.bind(oControl),
                            tokenChange: [oController.onF4Select, oController],
                            change: oControl._onChange.bind(oControl)
                        });
                        if (obj['DATATYPE'] == global.vui5.cons.dataType.amount || obj['DATATYPE'] == global.vui5.cons.dataType.quantity) {
                            selection.data("SUPPORTRANGESONLY", true)
                        }
                        selection.addValidator(function (args) {
                            if (args.suggestionObject) {
                                var mainModel = oController.getModel(global.vui5.modelName);
                                var data = mainModel.getProperty("/TYPEAHEAD");
                                var key, text;
                                if (data) {
                                    var returnField = data[obj['FLDNAME']]['RETURNFIELD'];
                                    var fieldInfo = underscoreJS.findWhere(data[obj['FLDNAME']]['FIELDS'], {
                                        FLDNAME: returnField
                                    });
                                    var postn = underscoreJS.indexOf(data[obj['FLDNAME']]['FIELDS'], fieldInfo);
                                    if (!postn) {
                                        postn = 0;
                                    }
                                    key = args.suggestionObject.getCells()[postn].getText();
                                    //*****Rel 60E_SP6 - Sanofi Req
                                    if (oControl.getEnableDescrSearch()) {
                                        var dataPath;
                                        if (args.suggestionObject.getBindingContextPath() != undefined) {
                                            dataPath = args.suggestionObject.getBindingContextPath();
                                        }
                                        else {
                                            dataPath = args.suggestionObject.getBindingContext(global.vui5.modelName).getPath();
                                        }
                                        var descrField = data[obj['FLDNAME']]['DESCRFIELD'];
                                        var sugObject = mainModel.getProperty(dataPath);
                                        if (obj['SDSCR'] === vui5.cons.fieldValue.value) {
                                            text = sugObject[returnField]
                                        }
                                        else if (obj['SDSCR'] === vui5.cons.fieldValue.description) {
                                            text = sugObject[descrField]
                                        }
                                        else if (obj['SDSCR'] === vui5.cons.fieldValue.value_descr) {
                                            text = sugObject[returnField] + " (" + sugObject[descrField] + ")"
                                        }
                                        else if (obj['SDSCR'] === vui5.cons.fieldValue.value_cont_descr) {
                                            text = sugObject[descrField] + " (" + sugObject[returnField] + ")"
                                        }
                                    }
                                    else {
                                        text = key;
                                    }
                                    //*****
                                    return new sap.m.Token({
                                        key: key,
                                        //*****Rel 60E_SP6 - Sanofi Req
                                        //text: key
                                        text: text
                                        //*****                                        
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
                                //*****Rel 60E_SP6 - Sanofi Req
                                var key = text;
                                //*****
                                if (obj['LOWERCASE'] == '' && obj['INTTYPE'] == global.vui5.cons.intType.character) {
                                    text = text.toUpperCase();
                                }
                                
                                //*****Rel 60E_SP6 - Sanofi Req
                            	if (oControl.getEnableDescrSearch() && obj['SDSCR'] !== vui5.cons.fieldValue.value) {
                            		key = key + "$$REMOVE$$";
                            	}
                            	//*****
                                
                                return new sap.m.Token({
                                	//*****Rel 60E_SP6 - Sanofi Req
                                	//key: text,
                                	key: key,
                                	//*****
                                    text: text
                                });
                            }
                        });
                        selection.data("model", modelName);
                        selection.data("path", fieldPath);
                        selection.data("dataAreaID", oControl.getDataAreaID());

                        selection.bindAggregation("tokens", dataPath, function (sId, oContext) {
                            var object = oContext.getObject();
                            var token = oSelection.createToken(object);
                            token.setTooltip(token.getText());
                            token.bindProperty("editable", {
                                parts: [{
                                    path: modelName + ">" + fieldPath + "/DISABLED"
                                },
                                    {
                                        path: modelName + ">" + sectionPath + "/DISOL"
                                    },
                                    {
                                        path: global.vui5.modelName + ">" + global.vui5.cons.modelPath.infocusUIPrf + "/UITYP"
                                    },
                                    {
                                        path: global.vui5.modelName + ">/DOCUMENT_MODE"
                                    },
                                    {
                                        path: modelName + ">" + sectionPath + "/EDIT"
                                    }],
                                formatter: function (disabled, disol, uityp, dmode, alwaysEdit) {
                                    if (disabled || disol) {
                                        return false;
                                    }
                                    if (alwaysEdit) {
                                        return true;
                                    }
                                    if (!oController._formDialog) {
                                        if (uityp === global.vui5.cons.UIType.infocus && dmode === global.vui5.cons.mode.display) {
                                            return false;
                                        }
                                    }
                                    return true;
                                },
                                mode: sap.ui.model.Binding.OneWay
                            });
                            return token;
                        });
                        oSelection.setFieldType(selection, obj);
                        if (obj['DATATYPE'] !== global.vui5.cons.dataType.amount && obj['DATATYPE'] != global.vui5.cons.dataType.quantity) {
                            oSelection.bindTypeAheadField(oController, selection, fieldPath, obj);
                        }
                        //*****Rel 60E_SP6 - Sanofi Req
                        if(oControl.getEnableDescrSearch()) {
                        	if (obj['SDSCR'] != vui5.cons.fieldValue.value) {
                        		selection.setMaxLength(60);
                        	}
                        }
                        //*****                                                   
                    } else {
                        selection = new sap.m.Input({
                            showValueHelp: true,
                            //enableMultiLineMode: false,
                            maxLength: parseInt(obj['OUTPUTLEN']),
                            valueHelpRequest: oControl.onValueHelpRequest.bind(oControl),
                            change: oControl._onChange.bind(oControl),
                            //*****Rel 60E_SP6 - Sanofi Req
                            liveChange: oControl._onLiveChange.bind(oControl)
                            //*****
                        });
                        selection.data("model", modelName);
                        selection.data("path", fieldPath);
                        selection.data("dataAreaID", oControl.getDataAreaID());
                        //*****Rel 60E_SP6 - Sanofi Req
                        if (oControl.getEnableDescrSearch()) {
                            selection.data("dataPath", dataPath.replace(modelName + ">", "") + "/0");
                            if (obj['SDSCR'] == vui5.cons.fieldValue.value) {
                                selection.bindValue(dataPath + "/0/LOW");
                            }
                            else {
                                selection.setMaxLength(60);
                                selection.bindValue(dataPath + "/0/TEXT");
                            }
                        }
                        else {
                            selection.bindValue(dataPath + "/0/LOW");
                        }
                        //*****
                        oSelection.setFieldType(selection, obj);
                        if (obj['DATATYPE'] !== global.vui5.cons.dataType.amount && obj['DATATYPE'] != global.vui5.cons.dataType.quantity) {
                            oSelection.bindTypeAheadField(oController, selection, fieldPath, obj);
                        }
                        //oSelection.bindTypeAheadField(oController, selection, fieldPath, obj);
                    }
                    //*****Rel 60E_SP6 - Sanofi Req
                    if (oControl.getEnableDescrSearch()) {
                        selection.data("dappt", vui5.cons.propertyType.selections);
                    }
                    //*****                    
                    break;
                case global.vui5.cons.element.dropDown:
                    itemsPath = dropdownModel + ">/DROPDOWNS/" + oControl.getDataAreaID() + "/" + obj['FLDNAME'];
                    if (obj['MULTISELECT'] == "X") {
                        selection = new sap.m.MultiComboBox({
                            width: "100%",
                            selectionChange: oControl._onChange.bind(oControl)
                        });
                        selection.bindAggregation("items", itemsPath, function (sid, oContext) {
                            var contextObject = oContext.getObject();
                            return new sap.ui.core.Item({
                                key: contextObject['NAME'],
                                text: contextObject['VALUE']
                            });
                        });
                        selection.bindProperty("selectedKeys", dataPath + "/0/LOW");
                    } else {
                        selection = new global.vui5.ui.controls.ComboBox({
                            width: "100%",
                            change: oControl._onChange.bind(oControl)
                        });
                        selection.bindAggregation("items", itemsPath, function (sid, oContext) {
                            var contextObject = oContext.getObject();
                            return new sap.ui.core.Item({
                                key: contextObject['NAME'],
                                text: contextObject['VALUE']
                            });
                        });
                        selection.bindProperty("selectedKey", dataPath + "/0/LOW");
                    }
                    selection.data("path", fieldPath);
                    break;
                case global.vui5.cons.element.checkBox:
                    selection = new sap.m.CheckBox({
                        select: oController._onCheckBoxSelect.bind(oController),
                        selected: "{= ${" + dataPath + "/0/LOW" + "} === 'X' }"
                    });
                    selection.data("model", modelName);
                    selection.data("path", fieldPath);
                    //*****Rel 60E_SP6 - QA #11095
                    selection.data("dataPath", dataPath.replace(modelName + ">", "") + "/0/LOW");
                    //*****
                    selection.attachSelect(oControl._onChange.bind(oControl));
                    break;
                    //*****Rel 60E_SP6 - Task #39097
                case global.vui5.cons.element.toggle:
                    var toggleDataPath = dataPath.replace(modelName + ">", "") + "/0/LOW";
                    selection = new sap.m.Switch({
                        state: "{= ${" + dataPath + "/0/LOW" + "} === 'X' }",
                        change: oController._onToggleButtonChange.bind(oController),
                    });
                    selection.data("model", modelName);
                    selection.data("path", fieldPath);
                    selection.data("dataPath", toggleDataPath);
                    selection.attachChange(oControl._onChange.bind(oControl));
                    break;
                    //*****
                    //*****Rel 60E_SP6 - QA #11172
                case global.vui5.cons.element.label:
                    selection = new sap.m.Label({
                        text: "{" + modelName + ">" + dataPath + "/0/LOW}"
                    });

                    selection.data("model", modelName);
                    selection.data("path", fieldPath);
                    selection.data("dataPath", toggleDataPath);
                    break;
                    //*****
            }

            //*****Rel 60E_SP6 - QA #11172
            if (eltyp != global.vui5.cons.element.label) {
                //*****

                oControl._onInputChange(selection, obj, dataPath);
                if (typeof obj['ONCHANGE'] == "function") {
                    selection.attachChange(obj['ONCHANGE']);
                }
                if (obj['INTTYPE'] == global.vui5.cons.intType.number ||
                  obj['INTTYPE'] == global.vui5.cons.intType.oneByteInteger ||
                  obj['INTTYPE'] == global.vui5.cons.intType.twoByteInteger ||
                  obj['INTTYPE'] == global.vui5.cons.intType.float ||
                  obj['INTTYPE'] == global.vui5.cons.intType.decimal16 ||
                  obj['INTTYPE'] == global.vui5.cons.intType.decimal32) {
                    /****Rel 60E SP6 QA #9779 - Start ***/
                    //selection.f(sap.m.InputType.Number);
                    if (obj['FLDNAME'] === 'MXHIT') {
                        oControl.getController().checkNumericValue(selection);
                    }
                    else if (selection.setType) {
                        //*****Rel 60E_SP6 - Sanofi Req
                    	if(!(oControl.getEnableDescrSearch() && obj['SDSCR'] !== vui5.cons.fieldValue.value)) {
                        //*****
                    		selection.setType(sap.m.InputType.Number);
                    	//*****Rel 60E_SP6 - Sanofi Req
                    	}                           
                    	//*****
                    }
                    /****Rel 60E SP6 QA #9779 - End ***/
                }
                /* Rel 60E_SP5 */
                //*****Rel 60E_SP6 - QA #11761
                //selection.bindProperty("enabled", {
                selection.bindProperty("editable", {
                //*****                
                    parts: [{ path: modelName + ">" + fieldPath + "/DISABLED" },
                            { path: modelName + ">" + sectionPath + "/DISOL" },
                            { path: global.vui5.modelName + ">" + global.vui5.cons.modelPath.infocusUIPrf + "/UITYP" },
                            { path: global.vui5.modelName + ">/DOCUMENT_MODE" },
                            { path: modelName + ">" + sectionPath + "/EDIT" }],
                    formatter: function (disabled, disol, uityp, dmode, alwaysEdit) {
                        if (disabled || disol) {
                            return false;
                        }
                        if (alwaysEdit) {
                            return true;
                        }
                        if (!oController._formDialog) {
                            if (uityp === global.vui5.cons.UIType.infocus && dmode === global.vui5.cons.mode.display) {
                                return false;
                            }
                        }
                        return true;
                    },
                    mode: sap.ui.model.Binding.OneWay
                });

                //*****Rel 60E_SP6 - QA #11172
            }
            //*****
            /* Rel 60E_SP5 */
            selection.data("SEL_DATA_PATH", DataPath);
            selection.data("fieldName", obj['FLDNAME'] + "-" + tabname);
            selection.data("path", fieldPath);
            if (obj['REQUIRED']) {
                selection.addStyleClass('vuiRequired');
            }
            var filterItem = new sap.ui.comp.filterbar.FilterItem({
                label: "{" + modelName + ">" + fieldPath + "/LABEL}",
                mandatory: "{= ${" + modelName + ">" + fieldPath + "/REQUIRED} === 'X'}",
                // visible: "{= ${" + modelName + ">" + fieldPath + "/NO_OUT}
                // === ''}",
                name: obj['FLDNAME'] + "-" + obj['TABNAME'],
                control: selection
            });
            if (!oControl.getShowVariants()) {
                filterItem.bindProperty("visible", {
                    path: modelName + ">" + fieldPath + "/NO_OUT",
                    formatter: function (value) {
                        if (value) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    },
                    mode: sap.ui.model.Binding.OneWay
                });
            }
            return filterItem;
        });
        this.oFilter.prepareVariants();
        oController._filter = this.oFilter;
        oControl.setAggregation("_getSelections", this.oFilter);
    };
    A.prototype.onDateChange = function (oEvent) {
        var oControl = this,
            oController,
            DataPath,
            modelName,
            model,
            dateValue = [], dateValuePath, datePath;
        dateValue = oEvent.getParameter('value').split(oEvent.getSource().getProperty('delimiter'));
        oController = this.getController();
        modelName = this.getModelName();
        model = oController.getModel(modelName);
        var oSource = oEvent.getSource();
        if (oEvent.getParameter("valid")) {
            oSource.data("dateValue", oSource.getDateValue());
            oSource.data("secondDateValue", oSource.getSecondDateValue());
            dateValuePath = oEvent.getSource().getBinding("dateValue").getPath();
            datePath = dateValuePath.substr(0, dateValuePath.lastIndexOf("/") + 1);
            model.setProperty(oEvent.getSource().getBinding("dateValue").getPath(), "");
            model.setProperty(oEvent.getSource().getBinding("secondDateValue").getPath(), "");
            model.setProperty(datePath + "OPTION", "");
            model.setProperty(datePath + "SIGN", "");
            if (dateValue[0] != undefined) {
                model.setProperty(oEvent.getSource().getBinding("dateValue").getPath(), dateValue[0].trim());
                model.setProperty(datePath + "SIGN", "I");
                if (dateValue[1] != undefined && dateValue[0].trim() != dateValue[1].trim()) {
                    model.setProperty(oEvent.getSource().getBinding("secondDateValue").getPath(), dateValue[1].trim());
                    model.setProperty(datePath + "OPTION", "BT");
                }
                else {
                    model.setProperty(datePath + "OPTION", "EQ");
                }
            }
            oSource.setValueState(sap.ui.core.ValueState.None);
            oSource.setValueStateText("");
            oController._handleCheckFieldsMessages(
                "",
                "",
                oSource.getId() + "/value");
        } else {
            oSource.setValueState(sap.ui.core.ValueState.Error);
            var text = oSource.getParent().getAggregation("content")[0].mProperties.text;
            var errorText = this._oBundle.getText("EnterValid", [text]);
            oSource.setValueStateText(errorText);
            oController._handleCheckFieldsMessages(
                errorText,
                sap.ui.core.MessageType.Error,
                oSource.getId() + "/value");
        }
    };
    A.prototype._onInputChange = function (selection, fieldInfo, dataPath) {
        var oControl = this;
        var oController = this.getController();
        var modelName = this.getModelName();
        var mainModel = oController.getModel(global.vui5.modelName);
        dataPath = dataPath.replace(modelName + ">", "");
        var uityp = mainModel.getProperty("/INPRFINFO/UITYP");
        if (fieldInfo['DATATYPE'] == global.vui5.cons.dataType.date) {
            return;
        } else {
            switch (fieldInfo['ELTYP']) {
                case global.vui5.cons.element.input:
                    if (fieldInfo['MULTISELECT'] == "") {
                        selection.attachChange(function (oEvent) {
                            oControl._preProcessOnInputChange(oEvent, fieldInfo, dataPath, selection);
                            if (uityp !== global.vui5.cons.UIType.worklist) {
                                oControl.processOnInputChange(oEvent);
                            } else {
                                if (fieldInfo['LOWERCASE'] == '' && fieldInfo['INTTYPE'] == global.vui5.cons.intType.character) {
                                    var source = oEvent.getSource();
                                    var value = source.getValue();
                                    value = value.toUpperCase();
                                    source.setValue(value);
                                }
                                if (fieldInfo['DATATYPE'] == global.vui5.cons.dataType.number) {
                                    oController._checkNumericField(oEvent);
                                }
                            }
                        });


                    } else {
                        //                        selection.attachChange(function (oEvent) {
                        //                            oControl._preProcessOnInputChange(oEvent, fieldInfo, dataPath, selection);
                        //                        });
                    }
                    break;
                case global.vui5.cons.element.valueHelp:
                    if (fieldInfo['MULTISELECT'] == "") {
                        selection.attachChange(function (oEvent) {
                            oControl._preProcessOnInputChange(oEvent, fieldInfo, dataPath, selection);
                            if (uityp !== global.vui5.cons.UIType.worklist) {
                                oControl.processOnInputChange(oEvent);
                            }
                            if (fieldInfo['LOWERCASE'] == '' && fieldInfo['INTTYPE'] == global.vui5.cons.intType.character) {
                                var source = oEvent.getSource();
                                var value = source.getValue();
                                value = value.toUpperCase();
                                source.setValue(value);
                            }
                        });
                    } else {
                        //                        selection.attachChange(function (oEvent) {
                        //                            oControl._preProcessOnInputChange(oEvent, fieldInfo, dataPath, selection);
                        //                        });
                    }
                    break;
                case global.vui5.cons.element.dropDown:
                    selection.attachSelectionChange(function (oEvent) {
                        oControl._preProcessOnInputChange(oEvent, fieldInfo, dataPath, selection);
                        if (uityp !== global.vui5.cons.UIType.worklist) {
                            oControl.processOnInputChange(oEvent);
                        }
                    });
                    break;
                case global.vui5.cons.element.checkBox:
                    selection.attachSelect(function (oEvent) {
                        oControl._preProcessOnInputChange(oEvent, fieldInfo, dataPath, selection);
                        if (uityp !== global.vui5.cons.UIType.worklist) {
                            oControl.processOnInputChange(oEvent);
                        }
                    });
                    break;
                    //*****Rel 60E_SP6 - Task #39097
                case global.vui5.cons.element.toggle:
                    selection.attachChange(function (oEvent) { });
                    break;
                    //*****
                default:
                    selection.attachChange(function (oEvent) {
                        oControl._preProcessOnInputChange(oEvent, fieldInfo, dataPath, selection);
                        if (uityp !== global.vui5.cons.UIType.worklist) {
                            oControl.processOnInputChange(oEvent);
                        }
                    });
                    break;
            }
        }
    };
    A.prototype._preProcessOnInputChange = function (oEvent, fieldInfo, dataPath, selection) {
        var oControl = this;
        var oController = this.getController();
        var oSource = oEvent.getSource();

        //*****Rel 60E_SP6 - QA #11095
        if (fieldInfo['ELTYP'] != global.vui5.cons.element.checkBox && fieldInfo['ELTYP'] != global.vui5.cons.element.toggle) {
            //*****
            oSource.setValueState(sap.ui.core.ValueState.None);
            oSource.setValueStateText("");
            //*****Rel 60E_SP6 - QA #11095
        }
        //*****

        oController._handleCheckFieldsMessages("", "", oSource.getId() + "/value");
        if (!oEvent.mParameters) {
            oEvent.mParameters = {};
        }
        oEvent.mParameters['fieldInfo'] = fieldInfo;
        oEvent.mParameters['dataPath'] = dataPath;
        oEvent.mParameters['selection'] = selection;
    };
    
    //*****Rel 60E_SP6 - Sanofi Req
    A.prototype._onLiveChange = function (oEvent) {
    	var oControl = this;
    	var oController = this.getController();
    	var source = oEvent.getSource();
    	var model = oController.getModel(oControl.getModelName());
    	var dataPath = source.data("dataPath");
    	var fieldPath = source.data("path");
    	var field = model.getProperty(fieldPath);
    	if(oControl.getEnableDescrSearch() && field && field['SDSCR'] != vui5.cons.fieldValue.value) {
    		model.setProperty(dataPath+"/LOW", "");	
    	}
    };
    //*****
    
    A.prototype._onChange = function (e) {
        var oControl = this;
        var oController = this.getController();
        var field = this.getModel(this.getModelName()).getProperty(e.getSource().data('path'));
        var tokens = e.oSource.getTokens ? e.oSource.getTokens() : [];
        var source = e.getSource(), errorflag = false;
        var filter = this.oFilter;

        //*****Rel 60E_SP6 - Task #39097        
        var eltyp;
        var model = oController.getModel(oControl.getModelName());
        var fieldPath = source.data("path");
        if (fieldPath) {
            eltyp = model.getProperty(fieldPath + "/ELTYP");
        }
        //*****

        //*****Rel 60E_SP6 - Sanofi Req
        if(oControl.getEnableDescrSearch() && field && field['MULTISELECT'] != "X" && field['SDSCR'] != vui5.cons.fieldValue.value) {
           var dataPath = source.data("dataPath");
           if(source.getValue && underscoreJS.isEmpty(source.getValue())) {
        	   model.setProperty(dataPath+"/LOW", "");
           }
        }
        //*****
        
        underscoreJS.each(tokens, function (obj) {
            if (field['DATATYPE'] === global.vui5.cons.dataType.quantity) {
                if (oController.checkQuantityValue(obj.getKey())) {
                    filter.fireFilterChange(e);
                } else {
                    errorflag = true
                    oController.setErrorStateToControl(source, true);
                }
            }
            else if (field['DATATYPE'] === global.vui5.cons.dataType.amount) {

                if (oController.checkAmountValue(obj.getKey())) {

                    filter.fireFilterChange(e);
                } else {
                    errorflag = true;
                    oController.setErrorStateToControl(e.getSource(), true);
                }
            }
            else {
                filter.fireFilterChange(e);
            }


        });

        if (underscoreJS.isEmpty(tokens)) {
            filter.fireFilterChange(e);
        }

        //*****Rel 60E_SP6 - Task #39097
        if (!errorflag && eltyp != global.vui5.cons.element.checkBox && eltyp != global.vui5.cons.element.toggle) {
            //*****
            source.setValueState(sap.ui.core.ValueState.None);
            source.setValueStateText('');
            oController._handleCheckFieldsMessages(
                "",
                "",
                source.getId() + "/value");
        }



    };
    A.prototype.onValueHelpRequest = function (oEvent) {
        var source = oEvent.getSource();
        var model = source.getModel(source.data("model"));
        var fieldInfo = model.getProperty(source.data("path"));
        this.fireOnValueHelpRequest({
            oEvent: oEvent,
            fieldInfo: fieldInfo
        });
    };
    A.prototype.bindTypeAheadField = function (oController, selection, fieldPath, fieldInfo) {
        var oControl = this;
        var modelName = oControl.getModelName();
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
        selection.data("model", modelName);
        selection.data("path", fieldPath);
        selection.data("dataAreaID", oControl.getDataAreaID());
    };
    A.prototype.setFieldType = function (selection, fieldInfo) {
    	if (fieldInfo['INTTYPE'] == global.vui5.cons.intType.number ||
            fieldInfo['INTTYPE'] == global.vui5.cons.intType.integer ||
            fieldInfo['INTTYPE'] == global.vui5.cons.intType.oneByteInteger ||
            fieldInfo['INTTYPE'] == global.vui5.cons.intType.twoByteInteger ||
            fieldInfo['INTTYPE'] == global.vui5.cons.intType.packed ||
            fieldInfo['INTTYPE'] == global.vui5.cons.intType.float ||
            fieldInfo['INTTYPE'] == global.vui5.cons.intType.decimal16 ||
            fieldInfo['INTTYPE'] == global.vui5.cons.intType.decimal32) {
            /****Rel 60E SP6 QA #9779 - Start ***/
            //selection.setType(sap.m.InputType.Number);
            if (fieldInfo['FLDNAME'] === 'MXHIT') {
                this.getController().checkNumericValue(selection);
            }
            else {
                if (fieldInfo['DATATYPE'] === global.vui5.cons.dataType.quantity || fieldInfo['DATATYPE'] === global.vui5.cons.dataType.amount) {
                    selection.setType(sap.m.InputType.Text);
                }
                else if (selection.setType) {
                	//*****Rel 60E_SP6 - Sanofi Req
                	if(!(this.getEnableDescrSearch() && fieldInfo['SDSCR'] !== vui5.cons.fieldValue.value)) {
                	//*****
                      selection.setType(sap.m.InputType.Number);
                    //*****Rel 60E_SP6 - Sanofi Req
                	}
                	//*****
                }

            }
            //            else {
            //                selection.setType(sap.m.InputType.Number);
            //            }
            /****Rel 60E SP6 QA #9779 - End ***/
        }
    };
    A.prototype.handleWorklistTypeAhead = function (oEvent) {
        var source = oEvent.getSource();
        var model = source.getModel(source.data("model"));
        var fieldInfo = model.getProperty(source.data("path"));
        this.fireFieldEvent({
            oEvent: oEvent,
            fieldInfo: fieldInfo,
            fieldValue: oEvent.getParameter('suggestValue'),
            eventType: global.vui5.cons.fieldSubEvent.typeAhead
        });
    };
    A.prototype.handleWorklistSuggestItemSelected = function (oEvent) {
        var source = oEvent.getSource();
        var model = source.getModel(source.data("model"));
        var fieldInfo = model.getProperty(source.data("path"));
        var item = oEvent.getParameter("selectedRow");
        var rowData = item.getBindingContext(global.vui5.modelName).getObject();
        var mainModel = source.getModel(global.vui5.modelName);
        var returnField = mainModel.getProperty("/TYPEAHEAD/" + fieldInfo['FLDNAME'] + "/RETURNFIELD");

        //*****Rel 60E_SP6 - Sanofi Req
        //var path = source.getBinding("value").getPath();
        //model.setProperty(path, rowData[returnField]);
        if (this.getEnableDescrSearch()) {
            var descrField = mainModel.getProperty("/TYPEAHEAD/" + fieldInfo['FLDNAME'] + "/DESCRFIELD");
            var dataPath = source.data("dataPath");
            model.setProperty(dataPath + "/LOW", rowData[returnField]);
            if (fieldInfo['SDSCR'] === vui5.cons.fieldValue.value) {
                model.setProperty(dataPath + "/TEXT", rowData[returnField]);
                source.setValue(rowData[returnField]);
            }
            else if (fieldInfo['SDSCR'] === vui5.cons.fieldValue.description) {
                model.setProperty(dataPath + "/TEXT", rowData[descrField]);
                source.setValue(rowData[descrField]);
            }
            else if (fieldInfo['SDSCR'] === vui5.cons.fieldValue.value_descr) {
                model.setProperty(dataPath + "/TEXT", rowData[returnField] + " (" + rowData[descrField] + ")");
                source.setValue(rowData[returnField] + " (" + rowData[descrField] + ")");
            }
            else if (fieldInfo['SDSCR'] === vui5.cons.fieldValue.value_cont_descr) {
                model.setProperty(dataPath + "/TEXT", rowData[descrField] + " (" + rowData[returnField] + ")");
                source.setValue(rowData[descrField] + " (" + rowData[returnField] + ")");
            }
        }
        else {
            var path = source.getBinding("value").getPath();
            model.setProperty(path, rowData[returnField]);
            source.setValue(rowData[returnField]);
        }
        //*****           

        oEvent.getSource().fireChange();
    };
    A.prototype.createToken = function (object) {
        var token;
        /*** Rel 60E SP6 - Values are adding twice while using F4 - Start **/
        //if (object['SIGN'] == global.vui5.cons.seloptSign.include) {
        if (object['SIGN'] == global.vui5.cons.seloptSign.include &&
            object['OPTION'] !== "EQ") {
            /*** Rel 60E SP6 - Values are adding twice while using F4 - End **/
            token = new sap.m.Token({
                key: object['LOW'],
                text: object['TEXT']
            }).data("range", {
                "exclude": false,
                "operation": object['OPTION'],
                "keyField": object['SELNAME'],
                "value1": object['LOW'],
                "value2": object['HIGH']
            });
        } else if (object['SIGN'] == global.vui5.cons.seloptSign.exclude) {
            token = new sap.m.Token({
                key: object['LOW'],
                text: object['TEXT']
            }).data("range", {
                "exclude": true,
                "operation": object['OPTION'],
                "keyField": object['SELNAME'],
                "value1": object['LOW'],
                "value2": object['HIGH']
            });
        } else {
            //*****Rel 60E_SP6 - Sanofi Req
            if (this.getEnableDescrSearch()) {
                token = new sap.m.Token({
                    key: object['LOW'],
                    text: object['TEXT']
                });
            }
            else {
                //*****
                token = new sap.m.Token({
                    key: object['LOW'],
                    text: object['LOW']
                });
                //*****Rel 60E_SP6 - Sanofi Req
            }
            //*****
        }
        return token;
    };

    //*****Rel 60E_SP6 - Sanofi Req
    A.prototype.getEnableDescrSearch = function () {
        var oControl = this;
        var model = oControl.getModel(oControl.getModelName());
        var enableDescr = model.getProperty(oControl.getEnableDescriptionSearch());
        return enableDescr;
    };
    //*****

    return A;
});