sap.ui.define(["sap/ui/core/Control", vistexConfig.rootFolder + "/ui/core/global", vistexConfig.rootFolder + "/ui/core/underscore-min", vistexConfig.rootFolder + "/ui/core/Formatter", ],
    function (control, global, underscoreJS, Formatter) {

        var Q = control.extend(vistexConfig.rootFolder + ".ui.controls.QuickEntryForm", {
            metadata: {
                library: vistexConfig.rootFolder + ".ui",
                properties: {
                    modelName: {
                        type: "string",
                        defaultValue: null
                    },
                    fieldPath: {
                        type: "string"
                    },
                    dataPath: {
                        type: "string"
                    },
                    dataAreaID: {
                        type: "string"
                    }
                },
                aggregations: {
                    _filterBar: {
                        type: "sap.ui.comp.filterbar.FilterBar",
                        multiple: false,
                        visibility: "hidden"
                    }
                },
                events: {
                    onValueHelpRequest: {}
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
                oRM.renderControl(oControl.getAggregation("_filterBar"));
                oRM.write("</div>");
            }

        });

        Q.prototype.setModelName = function (value) {
            this.setProperty("modelName", value, true);
        };

        Q.prototype.setFieldPath = function (value) {
            this.setProperty("fieldPath", value, true);
        };

        Q.prototype.setDataPath = function (value) {
            this.setProperty("dataPath", value, true);
        };

        Q.prototype.setDataAreaID = function (value) {
            this.setProperty("dataAreaID", value, true);
        };


        Q.prototype.prepareFields = function () {
            var oControl = this, oFilterBar, elementType, contextObject, comboBoxControl, propertyName, dropdownPath, maxLength;
            oFilterBar = new global.vui5.ui.controls.FilterBar({
                showGoOnFB: false,
                showFilterConfiguration: false,
                useToolbar: false,
                filterBarExpanded: false,
                searchEnabled: false
            });

            oFilterBar.addStyleClass("vuiFilterBar");

            oFilterBar.setModel(this.getModel(this.getModelName()), this.getModelName());

            oFilterBar.bindAggregation("filterItems", this.getModelName() + ">" + this.getFieldPath(), function (sid, oContext) {
                var selection, multiValue, dataPath, filterItem;
                contextObject = oContext.getObject();
                elementType = contextObject['ELTYP'];
                if (contextObject['DATATYPE'] === global.vui5.cons.dataType.date ||
                    contextObject['DATATYPE'] === global.vui5.cons.dataType.time) {
                    elementType = global.vui5.cons.element.input;
                }
                dataPath = oControl.getDataPath();

                maxLength = contextObject['OUTPUTLEN'];
                if (contextObject['QENTP'] === global.vui5.cons.quickEntryType.multiValue) {
                    dataPath = dataPath + contextObject['FLDNAME'] + '__DATA';
                }
                else if (contextObject['SDSCR'] !== global.vui5.cons.fieldValue.value &&
                        contextObject['SDSCR'] !== global.vui5.cons.fieldValue.value_descr &&
                        contextObject['TXTFL'] !== "") {
                    dataPath = dataPath + "__SE__DATA/" + contextObject['TXTFL'];
                    maxLength = 60;
                }
                else {
                    dataPath = dataPath + "__SE__DATA/" + contextObject['FLDNAME'];
                }
                switch (elementType) {
                    case global.vui5.cons.element.input:
                        if (contextObject['DATATYPE'] === global.vui5.cons.dataType.date) {
                            selection = new sap.m.DatePicker({
                                valueFormat: vui5.cons.date_format,
                                placeholder: "",
                                change: function (oEvent) {
                                    var oSource = oEvent.getSource();
                                    if (oEvent.getParameter("valid")) {
                                        oSource.setValueState(sap.ui.core.ValueState.None);
                                        oSource.setValueStateText("");
                                        oControl.handleCheckFieldsMessages(
                                            "",
                                            "",
                                            oSource.getId() + "/value");
                                    } else {
                                        oSource.setValueState(sap.ui.core.ValueState.Error);
                                        var text = oSource.getParent().getAggregation("content")[0].mProperties.text;
                                        var errorText = this._oBundle.getText("EnterValid", [text]);
                                        oSource.setValueStateText(errorText);
                                        oControl.handleCheckFieldsMessages(
                                            errorText,
                                            sap.ui.core.MessageType.Error,
                                            oSource.getId() + "/value");
                                    }
                                }
                            });                            
                            
                            selection.bindProperty("displayFormat", global.vui5.modelName + ">" + global.vui5.cons.modelPath.sessionInfo + "/DATFM", Formatter.displayFormat, sap.ui.model.Binding.OneWay);
                            //*****Rel 60E_SP6
                            selection.bindProperty("value", oControl.getModelName() + ">" + dataPath, null, sap.ui.model.BindingMode.TwoWay);
                            //*****
                        }                        
                        else if (contextObject['QENTP'] === global.vui5.cons.quickEntryType.multiValue) {
                            multiValue = new global.vui5.ui.controls.MultiValue({
                                modelName: oControl.getModelName(),
                                elementType: contextObject['ELTYP'],
                                fieldPath: oContext.getPath(),
                                dataPath: dataPath,
                                commaSeparator: false
                            });
                            multiValue.setModel(oControl.getModel(oControl.getModelName()), oControl.getModelName());
                            /****Rel 60E SP6 QA #10794 - Start ***/
                            multiValue.setModel(oControl.getModel(global.vui5.modelName), global.vui5.modelName);
                            /****Rel 60E SP6 QA #10794 - End ***/
                            selection = multiValue.prepareField();
                        }
                        else {
                            selection = new sap.m.Input({
                                maxLength: parseInt(maxLength)
                            });
                            
                            if(contextObject['SDSCR'] === global.vui5.cons.fieldValue.description ||
                                    contextObject['SDSCR'] === global.vui5.cons.fieldValue.value_cont_descr){
                                selection.setMaxLength(60);
                            }
                            selection.bindProperty("value", oControl.getModelName() + ">" + dataPath, null, sap.ui.model.BindingMode.TwoWay);
                        }

                        break;
                    case global.vui5.cons.element.valueHelp:
                        if (contextObject['QENTP'] === global.vui5.cons.quickEntryType.multiValue) {
                            multiValue = new global.vui5.ui.controls.MultiValue({
                                modelName: oControl.getModelName(),
                                elementType: contextObject['ELTYP'],
                                fieldPath: oContext.getPath(),
                                dataPath: dataPath,
                                commaSeparator: false,

                            });
                            multiValue.setModel(oControl.getModel(oControl.getModelName()), oControl.getModelName());
                            multiValue.setModel(oControl.getModel(global.vui5.modelName), global.vui5.modelName);
                            selection = multiValue.prepareField();
                        }
                        else {
                            selection = new sap.m.Input({
                                showValueHelp: true,
                                //enableMultiLineMode: false,
                                maxLength: parseInt(maxLength)
                            });
                            if(contextObject['SDSCR'] === global.vui5.cons.fieldValue.description ||
                                    contextObject['SDSCR'] === global.vui5.cons.fieldValue.value_cont_descr){
                                selection.setMaxLength(60);
                            }
                            
                            selection.bindValue(oControl.getModelName() + ">" + dataPath);

                        }

                        selection.attachValueHelpRequest(oControl.onValueHelpRequest.bind(oControl));
                        oControl.bindTypeAheadField(selection, contextObject);

                        break;
                    case global.vui5.cons.element.dropDown:
                        if (contextObject['QENTP'] === global.vui5.cons.quickEntryType.multiValue) {
                            multiValue = new global.vui5.ui.controls.MultiValue({
                                modelName: oControl.getModelName(),
                                elementType: contextObject['ELTYP'],
                                fieldPath: oContext.getPath(),
                                dataPath: dataPath,
                                commaSeparator: false,
                                dataAreaID: oControl.getDataAreaID(),
                                enableMultiValue: contextObject['QENTP'] === global.vui5.cons.quickEntryType.multiValue
                            });
                            multiValue.setModel(oControl.getModel(oControl.getModelName()), oControl.getModelName());
                            multiValue.setModel(oControl.getModel(global.vui5.modelName), global.vui5.modelName);
                            selection = multiValue.prepareField();
                        }
                        else {
                            selection = new global.vui5.ui.controls.ComboBox({

                            });
                            dropdownPath = global.vui5.modelName + ">/DROPDOWNS/" + oControl.getDataAreaID() + "/" + contextObject['FLDNAME']
                            selection.bindAggregation("items", dropdownPath, function (sid, oContext) {
                                var contextObject = oContext.getObject();
                                return new sap.ui.core.Item({
                                    key: contextObject['NAME'],
                                    text: contextObject['VALUE']
                                });
                            });

                            selection.bindProperty("selectedKey", oControl.getModelName() + ">" + dataPath, null, sap.ui.model.Binding.TwoWay);
                        }
                        /*multiValue = new global.vui5.ui.controls.MultiValue({
                            modelName: oControl.getModelName(),
                            elementType: contextObject['ELTYP'],
                            fieldPath: oContext.getPath(),
                            dataPath: dataPath,
                            commaSeparator: false,
                            dataAreaID: oControl.getDataAreaID(),
                            enableMultiValue: contextObject['QENTP'] === global.vui5.cons.quickEntryType.multiValue
                        });
                        multiValue.setModel(oControl.getModel(oControl.getModelName()), oControl.getModelName());
                        multiValue.setModel(oControl.getModel(global.vui5.modelName), global.vui5.modelName);
                        selection = multiValue.prepareField();*/
                        break;
                }
                selection.data("fieldInfo", contextObject);
                selection.data("dataPath", dataPath);
                selection.data("model", oControl.getModelName());
                oControl.setFieldType(selection, contextObject);

                selection.setEditable(contextObject['DISABLED'] === "");

                oControl.onInputChange({
                    selection: selection,
                    dataPath: dataPath,
                    fieldInfo: contextObject
                });
                filterItem = new sap.ui.comp.filterbar.FilterItem({
                    label: contextObject['LABEL'],
                    name: contextObject['FLDNAME'],
                    control: selection
                });

                return filterItem;
            });

            return oFilterBar;


        };

        Q.prototype.onInputChange = function (config) {
            var oControl = this;
            if (config.fieldInfo['ELTYP'] !== global.vui5.cons.element.dropDown) {
                config.selection.attachChange(function (oEvent) {
                    if (!oEvent.mParameters) {
                        oEvent.mParameters = {};
                    }
                    oEvent.mParameters['fieldInfo'] = config.fieldInfo;
                    //oEvent.mParameters['dataPath'] = config.dataPath;
                    oEvent.mParameters['selection'] = config.selection;
                    /*** Rel 60E SP6 QA #10738 - Start **/
                    oEvent.getSource().data('fromQuickEntry', true);
                    /*** Rel 60E SP6 QA #10738 - End **/
                    oControl.processOnInputChange(oEvent);
                });
            }



        };

        Q.prototype.setFieldType = function (selection, fieldInfo) {

            if (fieldInfo['DATATYPE'] === global.vui5.cons.dataType.amount ||
                 (fieldInfo['INTTYPE'] == global.vui5.cons.intType.number && fieldInfo['TXTFL'] !== "")) {
                return;
            }
            if (fieldInfo['INTTYPE'] == global.vui5.cons.intType.number ||
                fieldInfo['INTTYPE'] == global.vui5.cons.intType.integer ||
                fieldInfo['INTTYPE'] == global.vui5.cons.intType.oneByteInteger ||
                fieldInfo['INTTYPE'] == global.vui5.cons.intType.twoByteInteger ||
                fieldInfo['INTTYPE'] == global.vui5.cons.intType.packed ||
                fieldInfo['INTTYPE'] == global.vui5.cons.intType.float ||
                fieldInfo['INTTYPE'] == global.vui5.cons.intType.decimal16 ||
                fieldInfo['INTTYPE'] == global.vui5.cons.intType.decimal32) {
                
                if(selection.setType){
                    selection.setType(sap.m.InputType.Number);    
                }
                
            }
        };

        Q.prototype.onValueHelpRequest = function (oEvent) {
            var source = oEvent.getSource();
            this.fireOnValueHelpRequest({
                oEvent: oEvent,
                fieldInfo: source.data("fieldInfo")
            });
        };

        Q.prototype.handleTypeAhead = function (oEvent) {
            var source = oEvent.getSource();
            var fieldInfo = source.data("fieldInfo");

            oEvent.mParameters['eventType'] = global.vui5.cons.fieldSubEvent.typeAhead;
            oEvent.mParameters['fieldInfo'] = fieldInfo;
            oEvent.mParameters['oEvent'] = oEvent;
            oEvent.mParameters['fieldValue'] = oEvent.getParameter('suggestValue');


            this.preProcessFieldEvent(oEvent);

        };

        Q.prototype.handleSuggestItemSelected = function (oEvent) {
            var oControl = this;
            var source = oEvent.getSource();
            var model = oControl.getModel(oControl.getModelName());
            var fieldInfo = source.data("fieldInfo");
            var item = oEvent.getParameter("selectedRow");
            var rowData = item.getBindingContext(global.vui5.modelName).getObject();
            var mainModel = source.getModel(global.vui5.modelName);
            var returnField = mainModel.getProperty("/TYPEAHEAD/" + fieldInfo['FLDNAME'] + "/RETURNFIELD");
            var path = source.getBinding("value").getPath();
            model.setProperty(path, rowData[returnField]);
            oEvent.getSource().fireChange();
        };

        Q.prototype.bindTypeAheadField = function (selection, fieldInfo) {
            var oControl = this;
            selection.setShowSuggestion(true);
            selection.setFilterSuggests(false);
            if (fieldInfo['INTLEN'] == 1) {
                selection.setStartSuggestion(1);
            }
            else {
                selection.setStartSuggestion(2);
            }
            selection.setMaxSuggestionWidth("50%");
            selection.attachSuggest(oControl.handleTypeAhead.bind(oControl));
            if (fieldInfo['QENTP'] !== global.vui5.cons.quickEntryType.multiValue) {
                selection.attachSuggestionItemSelected(oControl.handleSuggestItemSelected.bind(oControl));
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
                var model = oControl.getModel(global.vui5.modelName);
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


        return Q;
    });
