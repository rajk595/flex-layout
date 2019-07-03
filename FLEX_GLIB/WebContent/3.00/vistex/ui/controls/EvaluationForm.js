sap.ui.define([
    "sap/ui/core/Control",
    vistexConfig.rootFolder + "/ui/core/global",
    vistexConfig.rootFolder + "/ui/core/underscore-min",
    vistexConfig.rootFolder + "/ui/core/Formatter"
    //vistexConfig.rootFolder + "/ui/controls/ResponsiveTable"
    ], function(control,global,underscoreJS,Formatter) {
    var A = control.extend(vistexConfig.rootFolder + ".ui.controls.EvaluationForm", {
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
                sectionId: {
                    type: "string",
                    defaultValue: null
                },
                dataPath: {
                    type: "string",
                    defaultValue: null
                },
                tmphdr: {
                    type: "string",
                    defaultValue: null
                },
                tmpae: {
                    type: "string",
                    defaultValue: null
                },
                elements: {
                    type: "string",
                    defaultValue: null
                },
                subelements: {
                    type: "string",
                    defaultValue: null
                },
                fullScreen: {
                    type: "boolean",
                    defaultValue: false
                }
            },
            events: {
                onValueHelpRequest: {},
                gridElementKeyAdd: {},
                onReevaluate: {},
                onButtonProcess: {},
                onFullScreen: {},
                hyperLinkNav: {},
                fieldEvent: {
                    parameters: {
                        selectionSet: {
                            type: "sap.ui.core.Control[]"
                        }
                    }
                },
                messagesShow: {
                    parameters: {
                        selectionSet: {
                            type: "sap.ui.core.Control[]"
                        }
                    }
                }
            },
            aggregations: {
                _ogetEvaluationForm: {
                    type: "sap.ui.layout.Grid",
                    multiple: false,
                    visibility: "public"
                }
            }
        },
        init: function() {
            var oControl = this;
            evalForm = this;
            c_others = "OPT_OTHR";
            c_eothr = "A";
            c_display_type = {
                checkbox: "",
                radiobutton: "01",
                dropdown: "02",
                input: "03",
                valueHelp: "04"
            };
            c_element_type = {
                direct: "",
                referenceField: "RF",
                message: "MS",
                button: "BU"
            };
            c_data_type = {
                text: "TX",
                date: "DA",
                time: "TI",
                numeric: "NU",
                amount: "CU",
                quantity: "QU"
            };
            
            this._oBundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls");
        },

        evalFormPrepare: function() {
            var oControl = this;
            var oController = this.getController();
            var modelName = this.getModelName();
            var dataPath = this.getDataPath();
            var model = oController.getModel(modelName);
            var grids = [];

            var posnr = model.getProperty(dataPath + "/POSNR");
            var oToolbar = new sap.m.Bar({
                contentRight: [new sap.m.Button({
                    icon: "sap-icon://synchronize",
                    text: oControl._oBundle.getText("Reevaluate"),
                    press: [oControl.onReevaluate, oControl]
                }).bindProperty("visible", global.vui5.modelName + ">/DOCUMENT_MODE", evaluationFormatter.returnBoolean, sap.ui.model.BindingMode.OneWay),
                new sap.m.OverflowToolbarButton({
                    type: sap.m.ButtonType.Transparent,
                    icon: {
                      path: vui5.modelName + ">" + "/FULLSCREEN",
                      formatter: function (fullScreen) {
                        return fullScreen === true ? 'sap-icon://exit-full-screen' : 'sap-icon://full-screen';
                      },
                      mode: sap.ui.model.BindingMode.TwoWay
                    },
                    visible: this.getProperty("fullScreen"),
                    press: oControl.fullScreenDialog.bind(oControl)
                })
                ]
            });
            /*.bindProperty("visible", {
                parts: [{ path: global.vui5.modelName + ">/DOCUMENT_MODE" },
                        { path: modelName + ">" + dataPath + "/POSNR" }],
                formatter: evaluationFormatter.toolbarVisible,
                mode: sap.ui.model.BindingMode.OneWay
            });*/
            grids.push(oToolbar);
            var oContent = oControl.groupLayoutPrepare('$#TOP', 0);
            underscoreJS.each(oContent, function(obj) {
                grids.push(obj);
            });

            var mainGrid = new sap.ui.layout.Grid({
                width: "100%",
                hSpacing: 0,
                vSpacing: 0,
                defaultSpan: "L12 M12 S12",
                content: [grids]
            }).addStyleClass("sapUiSizeCompact");
            oControl.setAggregation("_ogetEvaluationForm", mainGrid);
        },

        groupLayoutPrepare: function(parentGroup, level) {
            var oControl = this;
            var oController = this.getController();
            var modelName = this.getModelName();
            var dataPath = this.getDataPath();
            var tmpaePath = this.getTmpae();
            var model = oController.getModel(modelName);
            var content = [];
            var items = underscoreJS.where(model.getProperty(tmpaePath), { "PGRUP": parentGroup });
            var uniqueRows = underscoreJS.uniq(items, function(item) {
                return item['ELROW'];
            });
            var previousLevel = level;
            var newLevel = previousLevel + 1;
            var count = 0;

            underscoreJS.each(uniqueRows, function(obj, i) {
                var leftItem, rightItem, span;
                var sameRowItem = [];
                var number = oControl.numberFormatPrepare(level, count);
                count = count + 1;
                if (obj['COLMN'] != "2") {
                    sameRowItem = underscoreJS.where(items, { ELROW: obj['ELROW'], COLMN: "2" });
                }
                if (obj['CGRUP'] != "") {
                    if (obj['GOREL'] == 'M') {
                        var grid = oControl.evalMatrixPrepare(obj, i);
                    }
                    else {
                        var grid = oControl.groupLayoutPrepare(obj['CGRUP'], newLevel);
                    }
                    leftItem = new sap.m.Panel({
                        expanded: true,
                        expandable: true,
                        headerText: number + obj['DESCR'],
                        content: grid,
                        backgroundDesign: sap.m.BackgroundDesign.Transparent
                    }).addStyleClass('VuiEvalPanel');
                    if (obj['GOREL'] == 'M') {
                      leftItem.setExpanded(false);
                      leftItem.setExpandable(false);

                    }

                }
                else {
                    leftItem = oControl.elementLayoutPrepare(obj, number);
                }
                if (sameRowItem.length != 0) {
                    var numberRight = oControl.numberFormatPrepare(level, count);
                    count = count + 1;
                    if (sameRowItem[0]['CGRUP'] != "") {
                        if (sameRowItem[0]['GOREL'] == 'M') {
                            var grid = oControl.evalMatrixPrepare(sameRowItem[0], 0);
                        }
                        else {
                            var grid = oControl.groupLayoutPrepare(sameRowItem[0]['CGRUP'], newLevel);
                        }
                        rightItem = new sap.m.Panel({
                            expanded: true,
                            expandable: true,
                            headerText: numberRight + obj['DESCR'],
                            content: grid,
                            backgroundDesign: sap.m.BackgroundDesign.Transparent
                        });
                    }
                    else {
                        rightItem = oControl.elementLayoutPrepare(sameRowItem[0], numberRight);
                    }
                }
                if (obj['COLMN'] == "3") {
                    span = "L12 M12 S12";
                }
                else {
                    span = "L6 M6 S12";
                }
                var row = oControl.rowLayoutPrepare(span, leftItem, rightItem);
                content.push(row);
            });
            return content;
        },

        elementLayoutPrepare: function(element, number) {
            var oControl = this;
            var oController = this.getController();
            var modelName = this.getModelName();
            var dataPath = this.getDataPath();
            var tmpaePath = this.getTmpae();
            var elementsPath = this.getElements();
            var model = oController.getModel(modelName);
            var eGrid = new sap.ui.layout.Grid({
                hSpacing: 0,
                vSpacing: 0,
                defaultSpan: "L12 M12 S12"
            });
            var showDescr = underscoreJS.findWhere(model.getProperty(tmpaePath), { "EVELM": element['EVELM'] })['SHDSC'];
            var elementDetails = underscoreJS.findWhere(model.getProperty(elementsPath), { "EVELM": element['EVELM'] });
            var elementHeader = elementDetails['HEADER'];
            if (elementHeader['QUSTN'] != "" && elementHeader['ELMCT'] != "01") {
                var oLabel = new sap.m.Label({
                    text: number + elementDetails.HEADER.QUSTN,
                    design: sap.m.LabelDesign.Bold
                }).addStyleClass('VuiMarginTop').setLayoutData(new sap.ui.layout.GridData({
                    span: "L4 M4 S12"
                }));
                eGrid.addContent(oLabel);
            }
            if (elementHeader['ELMCT'] == "01") {
                var elTempIndex = underscoreJS.findIndex(model.getProperty(tmpaePath), { "EVELM": element['EVELM'] });
                var elementModePath = modelName + ">" + tmpaePath + "/" + elTempIndex + "/DISMD";

                var oTable = oControl.evalGridPrepare(element['EVELM'], number);
                eGrid.addContent(oTable);
                if (elementHeader['ECMNT'] == "X") {
                    var commentCells = oControl.commentPrepare(element, elementHeader, elementModePath);
                    underscoreJS.each(commentCells, function(obj, i) {
                        eGrid.addContent(obj);
                    });
                }
            }
            else {
                var options = oControl.fetchEvalElements(elementDetails);
                for (i = 0; i < options.length; i++) {
                    eGrid.addContent(options[i]);
                }
            }
            return eGrid;
        },

        renderer: function(oRM, oControl) {
            oRM.write("<div");
            oRM.writeControlData(oControl);
            oRM.write(">");
            oRM.write("<style>");
            oRM.write(".VuiMarginTop{margin-top:0.4rem!important;}");
            oRM.write(".VuiEvalGrid{padding:0px !important;}");
            oRM.write(".VuiEvalText{line-height:2rem !important;padding-left:0.3rem !important}");
            //oRM.write(".VuiEvalPanel .sapMPanelHdr{padding:0 !important;font-size: 0.875rem !important;font-weight: bold !important;color : #666666 !important;border-bottom:0 !important;line-height:5rem!important;}")
            oRM.write(".VuiEvalPanel .sapMPanelHdr{font-size: 0.875rem !important;font-weight: bold !important;color : #666666 !important;}");
            oRM.write(".VuiUnitText{line-height:2rem !important;padding-left:0.3rem !important;font-style: italic !important;font-size:0.775rem !important;}");
            oRM.write(".VuiEvalGrid .sapMIBar .sapMBarChild{margin-left:0 !important;font-size: 0.875rem !important;font-weight: bold !important;color : #666666 !important;}");
            oRM.write("</style>");
            oRM.renderControl(oControl.getAggregation("_ogetEvaluationForm"));
            oRM.write("</div>");
        }
    });

    A.prototype.updateModel = function() {
        this.evaluationFormPrepare();
    };
    A.prototype.setFullScreen = function(value) {
      this.setProperty("fullScreen",value,true);
    };

    A.prototype.evaluationFormPrepare = function() {
        var oControl = this;
        var oController = this.getController();
        var modelName = this.getModelName();
        var dataPath = this.getDataPath();
        var elementsPath = this.getElements();
        var model = oController.getModel(modelName);

        var elements = model.getProperty(elementsPath);
        var gridFcat = [];
        underscoreJS.each(elements, function(elm, i) {
            var obj = {};
            if (elm['UIFLDS'].length != 0) {
                obj['NAME'] = elm['EVELM'];
                obj['VALUE'] = model.getProperty("/DATA/EVG__" + elm['EVELM']);
                gridFcat.push(obj);
            }
        });
        model.setProperty(dataPath + "/ITEMG_FCAT", gridFcat);

        oControl.handleGridElements();
        oControl.evalFormPrepare();
    };

    A.prototype.evalMatrixPrepare = function(element) {
        var oControl = this;
        var oController = this.getController();
        var modelName = this.getModelName();
        var dataPath = this.getDataPath();
        var tmpaePath = this.getTmpae();
        var elementsPath = this.getElements();
        var model = oController.getModel(modelName);
        var oColumns = [], dummyCol = { "VALTX": "" };
        var oTable = new sap.m.Table({}).addStyleClass('VuiEvalMatrixGrid');

        var matrixTempIndex = underscoreJS.findIndex(model.getProperty(tmpaePath), { "EVELM": element['EVELM'] });
        var matrixModePath = modelName + ">" + tmpaePath + "/" + matrixTempIndex + "/DISMD";
        var matrixElements = underscoreJS.where(model.getProperty(tmpaePath), { "PGRUP": element['CGRUP'] });
        var matrixElementHeader = underscoreJS.findWhere(model.getProperty(elementsPath), { "EVELM": matrixElements['0']['EVELM'] })['HEADER'];
        //*****Rel 60E_SP6 - QA #10581
        //var refElement = underscoreJS.findWhere(model.getProperty(elementsPath), { "EVELM": matrixElementHeader['RFELM'] });
        var refElement = jQuery.extend(true,[], underscoreJS.findWhere(model.getProperty(elementsPath), { "EVELM": matrixElementHeader['RFELM'] }) );
        var flag;
        //*****
        var refElementIndex = underscoreJS.findIndex(model.getProperty(elementsPath), { "EVELM": matrixElementHeader['RFELM'] });

        if (underscoreJS.findIndex(refElement['VALUES'], dummyCol) == -1) {
            refElement['VALUES'].splice(0, 0, dummyCol);
            //*****Rel 60E_SP6 - QA #10581
            flag = "X";
            //*****
        }
        underscoreJS.each(refElement['VALUES'], function(obj, i) {
            oColumns.push(obj);
            //*****Rel 60E_SP6 - QA #10581
            if(flag){
            	i = i - 1;
            }
            if(obj['VALTX'] == ""){
                var oLabel = new sap.m.Text({});
            }
            else {
                var oLabel = new sap.m.Text({
                }).bindProperty("text", modelName + ">" + elementsPath + "/" + refElementIndex + "/VALUES/" + i, evaluationFormatter.setDisplayFormat, sap.ui.model.BindingMode.OneWay);	
            }
            //var oLabel = new sap.m.Text({
            //}).bindProperty("text", modelName + ">" + elementsPath + "/" + refElementIndex + "/VALUES/" + i, evaluationFormatter.setDisplayFormat, sap.ui.model.BindingMode.OneWay);
            //*****

            oTable.addColumn(new sap.m.Column({
                header: oLabel,
                demandPopin: true
            }).data({
                "dtype": refElement['HEADER']['DTYPE'],
                "disfm": refElement['HEADER']['DISFM'],
                "erang": refElement['HEADER']['ERANG']
            })
            );
        });

        underscoreJS.each(matrixElements, function(obj, i) {
            var cells = [];
            var elementDetails = underscoreJS.findWhere(model.getProperty(elementsPath), { "EVELM": obj['EVELM'] });
            var dataIndex = underscoreJS.findIndex(model.getProperty(dataPath + "/ITEM_FCAT"), { "EVELM": elementDetails['EVELM'] });
            var elTempIndex = underscoreJS.findIndex(model.getProperty(tmpaePath), { "EVELM": obj['EVELM'] });
            var elementModePath = modelName + ">" + tmpaePath + "/" + elTempIndex + "/DISMD";
            underscoreJS.each(oColumns, function(obj) {
                if (obj['VALTX'] == '') {
                    cells.push(new sap.m.Text({ text: elementDetails['HEADER']['QUSTN'] }));
                }
                else {
                    cells.push(new sap.m.RadioButton({
                        groupName: element['CGRUP'] + "_" + i,
                        select: function(oEvent) {
                            var oSource = oEvent.getSource();
                            var valuePath = oSource.data("valuePath");
                            var selButton = oSource.data("COL");
                            if (selButton['VALL'] == c_others) {
                                model.setProperty(valuePath + "/EOTHR", c_eothr);
                                model.setProperty(valuePath + "/VALUEL", "");
                                model.setProperty(valuePath + "/VALUEH", "");
                            }
                            else {
                                model.setProperty(valuePath + "/EOTHR", "");
                                model.setProperty(valuePath + "/VALUEL", selButton['VALL']);
                                model.setProperty(valuePath + "/VALUEH", selButton['VALH']);
                            }
                        }
                    }).data({
                        "COL": obj,
                        "valuePath": dataPath + "/ITEM_FCAT/" + dataIndex
                    })
                      .bindProperty("selected", modelName + ">" + dataPath + "/ITEM_FCAT/" + dataIndex, evaluationFormatter.matrixRadioSelect, sap.ui.model.BindingMode.OneWay)
                      .bindProperty("editable", {
                          parts: [{ path: global.vui5.modelName + ">/DOCUMENT_MODE" },
                                  { path: elementModePath }],
                          formatter: evaluationFormatter.returnMode,
                          mode: sap.ui.model.BindingMode.OneWay
                      }));
                }
            });
            oTable.addItem(new sap.m.ColumnListItem({
                type: sap.m.ListType.Inactive,
                vAlign: "Middle",
                cells: cells
            }));
        });

        var oGrid = new sap.ui.layout.Grid({
            hSpacing: 0,
            vSpacing: 1,
            defaultSpan: "L12 M12 S12"
        });
        oGrid.addContent(oTable);
        if (refElement['HEADER']['ECMNT'] == "X") {
            var commentCells = oControl.commentPrepare(refElement, refElement['HEADER'], matrixModePath);
            underscoreJS.each(commentCells, function(obj, i) {
                oGrid.addContent(obj);
            });
        }

        return oGrid;
    };

    A.prototype.handleGridElements = function(oEvent) {
        var oControl = this;
        var oController = this.getController();
        var modelName = this.getModelName();
        var tmpaePath = this.getTmpae();
        var elementsPath = this.getElements();
        var subelementsPath = this.getSubelements();
        var dataPath = this.getDataPath();
        var model = oController.getModel(modelName);
        var gridFcat = underscoreJS.reject(model.getProperty(elementsPath), function(obj) {
            if (obj['UIFLDS'].length == 0)
                {
              return true;
                }
            else
                {
              return false;
                }
        });

        underscoreJS.each(gridFcat, function(element, i) {

            underscoreJS.each(element['UIFLDS'], function(obj, j) {
                if (obj['ELTYP'] == "A" || obj['ELTYP'] == "B" || obj['ELTYP'] == "C" || obj['ELTYP'] == "O") {
                    var evelm = obj['FLDNAME'].replace("EVELM", "");
                    evelm = evelm.replace("_H", "");
                    var elementHeader = underscoreJS.find(model.getProperty(subelementsPath), { EVELM: evelm })['HEADER'];
                    var elementIndex = underscoreJS.findIndex(model.getProperty(subelementsPath), { EVELM: evelm });
                    var templateIndex = underscoreJS.findIndex(model.getProperty(tmpaePath), { EVELM: element['EVELM'] });
                    var dataPath = subelementsPath + "/" + elementIndex;
                    var elementModePath = modelName + ">" + tmpaePath + "/" + templateIndex + "/DISMD";
                    var selection;
                }
                if (obj['ELTYP'] == "A") {
                    obj['SETCONTROL'] = function(oPath) {
                        selection = oControl.returnInput(elementHeader, modelName + ">" + oPath, dataPath, elementModePath, "");
                        selection.data({
                            "dataPath": dataPath,
                            "valuePath": oPath,
                            "erang": elementHeader['ERANG'],
                            "disfm": elementHeader['DISFM'],
                            "dtype": elementHeader['DTYPE'],
                            "eltyp": elementHeader['ELTYP'],
                            "grid": "X"
                        });
                        return selection;
                    };
                }
                else if (obj['ELTYP'] == "B") {
                    obj['SETCONTROL'] = function(oPath) {
                        if (elementHeader['ERANG'] == "X") {
                            var tokens = [];
                            var value = model.getProperty(oPath);
                            var tokenPath = oPath + "_TOKENS";
                            if (value != "") {
                                var tokens = [{
                                    "KEY": value,
                                    "TEXT": value
                                }];
                            }
                            model.setProperty(tokenPath, tokens);

                            selection = new sap.m.MultiInput({
                                maxTokens: 1,
                                showValueHelp: true,
                                valueHelpOnly: true,
                                valueHelpRequest: [oControl.onValueHelpRequest, oControl],
                                tokenChange: function(oEvt) {
                                    var type = oEvt.getParameter("type");
                                    if (type != undefined && type == "tokensChanged") {
                                        var token = oEvt.getSource().getTokens();
                                        var valuePath = oEvt.getSource().data("valuePath");
                                        if (token.length == 0) {
                                            model.setProperty(valuePath, "");
                                        }
                                        else {
                                            token = token[0];
                                            model.setProperty(valuePath, token.getProperty("key"));
                                        }
                                    }
                                }
                            });

                            selection.bindAggregation("tokens", modelName + ">" + tokenPath, function(sId, oContext) {
                                return new sap.m.Token({
                                    key: oContext.getObject("KEY"),
                                    text: oContext.getObject("TEXT")
                                });
                            });
                        }
                        else {
                            selection = new sap.m.Input({
                                showValueHelp: true,
                                valueHelpRequest: [oControl.onValueHelpRequest, oControl],
                                change: function(oEvt) {
                                    var oSource = oEvt.getSource();
                                    oSource.setValueState(sap.ui.core.ValueState.None);
                                    oSource.setValueStateText('');
                                    var valuePath = oSource.data("valuePath");
                                    var path = oSource.data("dataPath");
                                    var value = model.getProperty(valuePath);
                                    if (value == "") {
                                        return;
                                    }
                                    var fixedValues = model.getProperty(path + "/VALUES");
                                    var valtxt = underscoreJS.findWhere(fixedValues, { VALL: value });
                                    if (!valtxt) {
                                        oSource.setValueState(sap.ui.core.ValueState.Error);
                                        oSource.setValueStateText(oControl._oBundle.getText("InvalidValue"));
                                        oSource.focus();
                                    }
                                }
                            }).bindProperty("value", modelName + ">" + oPath);
                            oControl.bindTypeAheadField(selection, "X", evelm);
                        }

                        selection.data({
                            "dataPath": dataPath,
                            "valuePath": oPath
                        });
                        selection.bindProperty("editable", {
                            parts: [{ path: global.vui5.modelName + ">/DOCUMENT_MODE" },
                                    { path: elementModePath }],
                            formatter: evaluationFormatter.returnMode,
                            mode: sap.ui.model.BindingMode.OneWay
                        });

                        return selection;
                    };
                }
                else if (obj['ELTYP'] == "O") {
                    obj['SETCONTROL'] = function(oPath) {
                        var tokens = model.getProperty(oPath).split("@");
                        var tokenPath = oPath + "_TOKENS";
                        model.setProperty(tokenPath, tokens);

                        selection = new sap.m.MultiComboBox({
                            selectionFinish: function(oEvt) {
                                var selectedItems = oEvt.getParameter("selectedItems");
                                var valuePath = oEvt.getSource().data("valuePath");
                                var tokens = "";
                                underscoreJS.each(selectedItems, function(obj, i) {
                                    if (i == 0)
                                        {
                                      tokens = obj.getKey();
                                        }
                                    else
                                        {
                                      tokens = tokens + "@" + obj.getKey();
                                        }
                                });
                                model.setProperty(valuePath, tokens);
                            }
                        });

                        selection.bindAggregation("items", modelName + ">" + dataPath + "/VALUES", function(sId, oContext) {
                            var displayFormatPath = modelName + ">" + oContext.getPath();
                            var key = oContext.getObject('VALL');
                            if (oContext.getObject('VALH') != "") {
                                key = key + "..." + oContext.getObject('VALH');
                            }
                            return new sap.ui.core.Item({
                                key: key
                            }).bindProperty("text", displayFormatPath, evaluationFormatter.setDisplayFormat, sap.ui.model.BindingMode.OneWay);
                        });
                        selection.bindProperty("selectedKeys", modelName + ">" + tokenPath);

                        selection.data({
                            "dataPath": dataPath,
                            "valuePath": oPath,
                            "erang": elementHeader['ERANG'],
                            "disfm": elementHeader['DISFM'],
                            "dtype": elementHeader['DTYPE'],
                            "eltyp": elementHeader['ELTYP']
                        });
                        selection.bindProperty("editable", {
                            parts: [{ path: global.vui5.modelName + ">/DOCUMENT_MODE" },
                                    { path: elementModePath }],
                            formatter: evaluationFormatter.returnMode,
                            mode: sap.ui.model.BindingMode.OneWay
                        });

                        return selection;
                    };
                }
                else if (obj['ELTYP'] == "C") {
                    obj['SETCONTROL'] = function(oPath) {
                        selection = new sap.m.ComboBox({
                        }).bindProperty("selectedKey", modelName + ">" + oPath);

                        selection.bindAggregation("items", modelName + ">" + dataPath + "/VALUES", function(sId, oContext) {
                            var displayFormatPath = modelName + ">" + oContext.getPath();
                            var key = oContext.getObject('VALL');
                            if (oContext.getObject('VALH') != "") {
                                key = key + "..." + oContext.getObject('VALH');
                            }
                            return new sap.ui.core.Item({
                                key: key
                            }).bindProperty("text", displayFormatPath, evaluationFormatter.setDisplayFormat, sap.ui.model.BindingMode.OneWay)
                              .data("type", "D");
                        });

                        selection.data({
                            "dataPath": dataPath,
                            "valuePath": oPath,
                            "erang": elementHeader['ERANG'],
                            "disfm": elementHeader['DISFM'],
                            "dtype": elementHeader['DTYPE'],
                            "eltyp": elementHeader['ELTYP']
                        });
                        selection.bindProperty("editable", {
                            parts: [{ path: global.vui5.modelName + ">/DOCUMENT_MODE" },
                                    { path: elementModePath }],
                            formatter: evaluationFormatter.returnMode,
                            mode: sap.ui.model.BindingMode.OneWay
                        });

                        return selection;
                    };
                }
            });

        });
    };

    A.prototype.evalGridPrepare = function(evelm, number) {
        var oControl = this;
        var oController = this.getController();
        var modelName = this.getModelName();
        var dataPath = this.getDataPath();
        var tmpaePath = this.getTmpae();
        var elementsPath = this.getElements();
        var subelementsPath = this.getSubelements();
        var model = oController.getModel(modelName);
        var mainModel = oController.getModel(vui5.modelName);

        var elementIndex = underscoreJS.findIndex(model.getProperty(elementsPath), { EVELM: evelm });
        var templateIndex = underscoreJS.findIndex(model.getProperty(tmpaePath), { EVELM: evelm });
        var gridIndex = underscoreJS.findIndex(model.getProperty(dataPath + "/ITEMG_FCAT"), { NAME: evelm });
        var fieldPath = elementsPath + "/" + elementIndex + "/UIFLDS/";
        var tableDataPath = dataPath + "/ITEMG_FCAT/" + gridIndex + "/VALUE";
        var addKeyPath = elementsPath + "/" + elementIndex + "/HEADER/ADKEY";

        var gridTable = new global.vui5.ui.controls.ResponsiveTable({
            title: number + model.getProperty(elementsPath + "/" + elementIndex + "/HEADER/QUSTN"),
            controller: oControl,
            //controller: oController,
            modelName: modelName,
            fieldPath: fieldPath,
            dataPath: tableDataPath,
            dataAreaPath: "/DATAR",
            enableSearchAndReplace: false,
            fullScreen: false,
            enablePersonalization: false,
            //*****Rel 60E_SP6
            disableExcelExport: true,
            //*****
            editable: "{= ${" + global.vui5.modelName + ">/DOCUMENT_MODE} !== 'A' && ${" + modelName + ">" + tmpaePath + "/" + templateIndex + "/DISMD} !== 'D'}"
        })
        .data("evelm", evelm);

//*****Rel 60E_SP6
        gridTable.setModel(mainModel, vui5.modelName);
        gridTable.setModel(model, modelName);
//*****
        gridTable.addStyleClass("sapUiResponsiveContentPadding");
        gridTable.addStyleClass("vuiTableBottomPadding");
        gridTable.addStyleClass("VuiEvalGrid");
        gridTable.prepareTable();

        gridTable.attachOnFieldClick(function(evt) {
           oControl.onHyperlinkNav(evt);
        });

        gridTable.addToolBarButton(new sap.m.OverflowToolbarButton({
            text: oControl._oBundle.getText("AddRow"),
            tooltip: oControl._oBundle.getText("AddRow"),
            icon: "sap-icon://add",
            type: sap.m.ButtonType.Transparent,
            press: [oControl.onAddRow, oControl],
            layoutData: new sap.m.OverflowToolbarLayoutData({
                priority: sap.m.OverflowToolbarPriority.High
            })
        }).bindProperty("visible", {
            parts: [{ path: modelName + ">" + addKeyPath },
                    { path: global.vui5.modelName + ">/DOCUMENT_MODE" }],
            formatter: evaluationFormatter.showAddKey,
            mode: sap.ui.model.BindingMode.OneWay
        }).data("evelm", evelm));

        var oGrid = new sap.ui.layout.Grid({
            hSpacing: 0,
            vSpacing: 1,
            defaultSpan: "L12 M12 S12",
            content: gridTable
        });

        return oGrid;
    };

    A.prototype.onAddRow = function(oEvent) {
        var oControl = this, params = {};
        var evelm = oEvent.getSource().data("evelm");
        params['$EVELM'] = evelm;
        var promise = oControl.fireGridElementKeyAdd({params: params});
    };

    A.prototype.rowLayoutPrepare = function(span, leftItem, rightItem) {
        if (rightItem) {
            return new sap.ui.layout.Grid({
                vSpacing: 0,
                defaultSpan: span,
                content: [leftItem, rightItem]
            });
        }
        else {
            return new sap.ui.layout.Grid({
                vSpacing: 0,
                defaultSpan: span,
                content: [leftItem]
            });
        }
    };

    A.prototype.setLayout = function(displayType, displayLayout, dataType, valuePosition, showDescr) {
        var span = "";
        switch (dataType) {
            case c_data_type.text:
                span = "L12 M12 S12";
                break;
            default:
                switch (displayType) {
                    case c_display_type.radiobutton:
                    case c_display_type.checkbox:
                        switch (displayLayout) {
                            case "":
                            case "CI":
                                span = "L8 M8 S12";
                                break;
                            case "RN":
                            case "CN":
                                span = "L12 M12 S12";
                                break;
                        }
                        break;
                    case c_display_type.input:
                    case c_display_type.valueHelp:
                        switch (valuePosition) {
                            case "N":
                                if (showDescr == "G" || showDescr == "P" || dataType == c_data_type.amount || dataType == c_data_type.quantity)
                                {
                                  span = "L8 M8 S12";
                                }
                                else
                                {
                                  span = "L12 M12 S12";
                                }
                                break;
                            default:
                                if (showDescr == "G" || showDescr == "P" || dataType == c_data_type.amount || dataType == c_data_type.quantity)
                                    {
                                  span = "L6 M6 S12";
                                    }
                                else
                                    {
                                  span = "L8 M8 S12";
                                    }
                                break;
                        }
                        break;
                    default:
                        switch (valuePosition) {
                            case "N":
                                span = "L12 M12 S12";
                                break;
                            default:
                                span = "L8 M8 S12";
                                break;
                        }
                        break;
                } //displayType Close
                break;
        } //dataType Close
        return span;
    };

    A.prototype.fetchEvalElements = function(element) {
        var oControl = this;
        var oController = this.getController();
        var modelName = this.getModelName();
        var dataPath = this.getDataPath();
        var tmpaePath = this.getTmpae();
        var elementsPath = this.getElements();
        var model = oController.getModel(modelName);
        var oCells = [];
        var index = underscoreJS.findIndex(model.getProperty(dataPath + "/ITEM_FCAT"), { EVELM: element['EVELM'] });
        var valuePath = modelName + ">" + dataPath + "/ITEM_FCAT/" + index;
        var valueLowPath = modelName + ">" + dataPath + "/ITEM_FCAT/" + index + "/VALUEL";
        var valueHighPath = modelName + ">" + dataPath + "/ITEM_FCAT/" + index + "/VALUEH";
        var elementIndex = underscoreJS.findIndex(model.getProperty(elementsPath), { EVELM: element['EVELM'] });
        var elementValuePath = modelName + ">" + elementsPath + "/" + elementIndex + "/VALUES";

        var evalFormdataPath = elementsPath + "/" + elementIndex;
        var elTempIndex = underscoreJS.findIndex(model.getProperty(tmpaePath), { "EVELM": element['EVELM'] });
        var elementModePath = modelName + ">" + tmpaePath + "/" + elTempIndex + "/DISMD";
        var elementHeader = model.getProperty(elementsPath + "/" + elementIndex + "/HEADER");
        var elementValues = model.getProperty(elementsPath + "/" + elementIndex + "/VALUES");
        var span = oControl.setLayout(elementHeader['DISTYP'], elementHeader['DISLA'], elementHeader['DTYPE'], elementHeader['VALPO'], model.getProperty(tmpaePath + "/" + elTempIndex + "/SHDSC"));
        var selection;

        switch (elementHeader['ELTYP']) {
            case c_element_type.direct:
            case c_element_type.referenceField:
                switch (elementHeader['DTYPE']) {
                    case c_data_type.text:
                        var textIndex = underscoreJS.findIndex(model.getProperty(dataPath + "/ITEMC_FCAT"), { "EVELM": element['EVELM'] });
                        var textPath = modelName + ">" + dataPath + "/ITEMC_FCAT/" + textIndex + "/COMNT";
                        selection = new sap.m.TextArea({
                            cols: 80,
                            change: function(oEvent) {
                                var oPath = textPath.replace(modelName + ">", "");
                                model.setProperty(oPath, oEvent.getSource().getProperty("value"));
                            }
                        }).bindProperty("value", textPath, null, sap.ui.model.BindingMode.OneWay)
                            .bindProperty("editable", {
                                parts: [{ path: global.vui5.modelName + ">/DOCUMENT_MODE" },
                                        { path: elementModePath }],
                                formatter: evaluationFormatter.returnMode,
                                mode: sap.ui.model.BindingMode.OneWay
                            });
                        break;

                    default:
                        switch (elementHeader['DISTYP']) {
                            case c_display_type.radiobutton:
                                selection = new sap.m.RadioButtonGroup({
                                    select: function(oEvent) {
                                        var selButtonPath = oEvent.getSource().getSelectedButton().getBindingContext(modelName).getPath();
                                        var selButton = model.getProperty(selButtonPath);
                                        var valuePath = oEvent.getSource().data("valuePath");
                                        if (selButton['VALL'] == c_others) {
                                            model.setProperty(valuePath + "/EOTHR", c_eothr);
                                            model.setProperty(valuePath + "/VALUEL", "");
                                            model.setProperty(valuePath + "/VALUEH", "");
                                        }
                                        else {
                                            model.setProperty(valuePath + "/EOTHR", "");
                                            model.setProperty(valuePath + "/VALUEL", selButton['VALL']);
                                            model.setProperty(valuePath + "/VALUEH", selButton['VALH']);
                                        }
                                    }
                                }).addStyleClass("vuiRadioButtonGroup");

                                selection.bindAggregation("buttons", elementValuePath, function(sId, oContext) {
                                    var displayFormatPath = modelName + ">" + oContext.getPath();
                                    return new sap.m.RadioButton({
                                        groupName: oContext.getObject("EVELM")
                                    }).bindProperty("text", displayFormatPath, evaluationFormatter.setDisplayFormat, sap.ui.model.BindingMode.OneWay);
                                });

                                selection.bindProperty("selectedIndex", {
                                    parts: [{ path: valuePath },
                                            { path: elementValuePath }],
                                    formatter: evaluationFormatter.radioButtonSelect,
                                    mode: sap.ui.model.BindingMode.OneWay
                                });

                                switch (elementHeader['DISLA']) {
                                    case "CI":
                                    case "CN":
                                        selection.setProperty("columns", 1);
                                        break;
                                    default:
                                        selection.setProperty("columns", elementValues.length);
                                        break;
                                }
                                break;

                            case c_display_type.dropdown:
                                selection = new sap.m.ComboBox({
                                    selectionChange: function(oEvent) {
                                        var selPath = oEvent.getSource().getSelectedItem().getBindingContext(modelName).getPath();
                                        var selItem = model.getProperty(selPath);
                                        var valuePath = oEvent.getSource().data("valuePath");
                                        model.setProperty(valuePath + "/VALUEL", selItem['VALL']);
                                        model.setProperty(valuePath + "/VALUEH", selItem['VALH']);
                                    }
                                }).bindProperty("selectedKey", {
                                    parts: [{ path: valuePath },
                                            { path: elementValuePath }],
                                    formatter: evaluationFormatter.drdnSelect,
                                    mode: sap.ui.model.BindingMode.OneWay
                                });

                                selection.bindAggregation("items", elementValuePath, function(sId, oContext) {
                                    var displayFormatPath = modelName + ">" + oContext.getPath();
                                    return new sap.ui.core.Item({
                                        key: oContext.getObject('VALL')
                                    }).bindProperty("text", displayFormatPath, evaluationFormatter.setDisplayFormat, sap.ui.model.BindingMode.OneWay)
                                      .data("type", "D");
                                });
                                break;

                            case c_display_type.input:
                                selection = oControl.returnInputControl(elementHeader, valuePath, evalFormdataPath, span, elementModePath);
                                break;

                            case c_display_type.valueHelp:
                                if (elementHeader['ERANG'] == "X") {
                                    var tokens = [];
                                    var lowValue = model.getProperty(dataPath + "/ITEM_FCAT/" + index + "/VALUEL");
                                    var highValue = model.getProperty(dataPath + "/ITEM_FCAT/" + index + "/VALUEH");
                                    if (lowValue != "") {
                                        var tokens = [{
                                            "KEY": lowValue + "..." + highValue,
                                            "TEXT": lowValue + "..." + highValue
                                        }];
                                    }
                                    model.setProperty(dataPath + "/ITEM_FCAT/" + index + "/TOKENS", tokens);

                                    selection = new sap.m.MultiInput({
                                        maxTokens: 1,
                                        showValueHelp: true,
                                        valueHelpOnly: true,
                                        valueHelpRequest: [oControl.onValueHelpRequest, oControl],
                                        tokenChange: [oControl.onTokenChange, oControl]
                                    }).bindProperty("textAlign", modelName + ">" + evalFormdataPath + "/HEADER/DTYPE", evaluationFormatter.setTextAlign, sap.ui.model.BindingMode.OneWay);

                                    selection.bindAggregation("tokens", valuePath + "/TOKENS", function(sId, oContext) {
                                        return new sap.m.Token({
                                            key: oContext.getObject("KEY"),
                                            text: oContext.getObject("TEXT")
                                        });
                                    });
                                }
                                else {
                                    selection = new sap.m.Input({
                                        showValueHelp: true,
                                        valueHelpRequest: [oControl.onValueHelpRequest, oControl],
                                        change: [oControl.onInputHelpChange, oControl]
                                    }).bindProperty("value", valueLowPath)
                                      .bindProperty("textAlign", modelName + ">" + evalFormdataPath + "/HEADER/DTYPE", evaluationFormatter.setTextAlign, sap.ui.model.BindingMode.OneWay);
                                    oControl.bindTypeAheadField(selection, "", element['EVELM']);
                                }
                                break;

                            case c_display_type.checkbox:
                                switch (elementHeader['DISLA']) {
                                    case "CI":
                                    case "CN":
                                        selection = new sap.ui.layout.VerticalLayout({
                                            allowWrapping: true
                                        });
                                        break;
                                    default:
                                        selection = new sap.ui.layout.HorizontalLayout({
                                            allowWrapping: true
                                        });
                                        break;
                                }

                                selection.bindAggregation("content", elementValuePath, function(sId, oContext) {
                                    var checkBoxPath = modelName + ">" + oContext.getPath();
                                    return new sap.m.CheckBox({
                                        select: [oControl.onCheckBoxSelect, oControl]
                                    }).bindProperty("text", checkBoxPath, evaluationFormatter.setDisplayFormat, sap.ui.model.BindingMode.OneWay)
                                      .bindProperty("editable", {
                                          parts: [{ path: global.vui5.modelName + ">/DOCUMENT_MODE" },
                                                  { path: elementModePath }],
                                          formatter: evaluationFormatter.returnMode,
                                          mode: sap.ui.model.BindingMode.OneWay
                                      })
                                      .bindProperty("selected", {
                                          parts: [{ path: checkBoxPath },
                                                  { path: modelName + ">" + dataPath + "/ITEM_FCAT" }],
                                          formatter: evaluationFormatter.checkBoxSelect,
                                          mode: sap.ui.model.BindingMode.OneWay
                                      });
                                });
                                break;
                        } //distyp Close
                        break;
                } //dtype Close
                break;

            case c_element_type.message:
                selection = new sap.m.ObjectStatus({
                    icon: model.getProperty(dataPath + "/ITEM_FCAT/" + index + "/MSICN"),
                    text: model.getProperty(dataPath + "/ITEM_FCAT/" + index + "/MSTXT")
                });
                break;

            case c_element_type.button:
                selection = new sap.m.Button({
                    text: elementHeader['BUTXT'],
                    press: [oControl.onButtonProcess, oControl]
                });
                break;
        }// eltyp close

        if (elementHeader['DISTYP'] != c_display_type.checkbox && elementHeader['DISTYP'] != c_display_type.input) {
            selection.bindProperty("editable", {
                parts: [{ path: global.vui5.modelName + ">/DOCUMENT_MODE" },
                        { path: elementModePath }],
                formatter: evaluationFormatter.returnMode,
                mode: sap.ui.model.BindingMode.OneWay
            });
        }

        selection.data({
            "dataPath": evalFormdataPath,
            "valuePath": valuePath.replace(modelName + ">", ""),
            "erang": elementHeader['ERANG'],
            "disfm": elementHeader['DISFM'],
            "dtype": elementHeader['DTYPE'],
            "eltyp": elementHeader['ELTYP']
        });
        if (elementHeader['DISTYP'] != c_display_type.input) {
            selection.setModel(model, modelName);
            selection.setLayoutData(new sap.ui.layout.GridData({
                span: span
            }));
        }

        if (elementHeader['DISTYP'] == c_display_type.valueHelp ||
          (elementHeader['DISTYP'] == c_display_type.input && elementHeader['ERANG'] != "X")) {
            var showDescr = model.getProperty(tmpaePath + "/" + elTempIndex + "/SHDSC");
            var lowValue = model.getProperty(dataPath + "/ITEM_FCAT/" + index + "/VALUEL");
            oCells = oControl.returnUnitDescr(showDescr, lowValue, elementHeader, valuePath, span, selection, oCells);
        }
        else {
            oCells.push(selection);
        }

        if (elementHeader['ECMNT'] == "X") {
            var commentCells = oControl.commentPrepare(element, elementHeader, elementModePath);
            underscoreJS.each(commentCells, function(obj, i) {
                oCells.push(obj);
            });
        }

        return oCells;
    };

    A.prototype.commentPrepare = function(element, elementHeader, elementModePath) {
        var oControl = this;
        var oController = this.getController();
        var modelName = this.getModelName();
        var dataPath = this.getDataPath();
        var model = oController.getModel(modelName);
        var oCells = [];

        var commentIndex = underscoreJS.findIndex(model.getProperty(dataPath + "/ITEMC_FCAT"), { "EVELM": element['EVELM'] });
        var commentPath = modelName + ">" + dataPath + "/ITEMC_FCAT/" + commentIndex + "/COMNT";
        var commentLabel = new sap.m.Label({
            text: elementHeader['CMNT']
        });
        commentLabel.setLayoutData(new sap.ui.layout.GridData({
            span: "L12 M12 S12",
            linebreakL: true,
            linebreakM: true,
            linebreakS: true
        }));

        var commentText = new sap.m.TextArea({
            cols: 80,
            change: function(oEvent) {
                var oPath = commentPath.replace(modelName + ">", "");
                model.setProperty(oPath, oEvent.getSource().getProperty("value"));
            }
        }).bindProperty("value", commentPath, null, sap.ui.model.BindingMode.OneWay)
          .bindProperty("editable", {
              parts: [{ path: global.vui5.modelName + ">/DOCUMENT_MODE" },
                      { path: elementModePath }],
              formatter: evaluationFormatter.returnMode,
              mode: sap.ui.model.BindingMode.OneWay
          });
        commentText.setModel(model, modelName);
        commentText.setLayoutData(new sap.ui.layout.GridData({
            span: "L12 M12 S12"
        }));
        oCells.push(commentLabel);
        oCells.push(commentText);

        return oCells;

    };

    A.prototype.bindTypeAheadField = function(selection, grid, evelm) {
        var oControl = this;
        var oController = this.getController();
        var evelmNew = oController._specialCharacterReplace(evelm);
        selection.setShowSuggestion(true);
        selection.setFilterSuggests(false);
        selection.setMaxSuggestionWidth("50%");
        selection.attachSuggest(oControl.handleTypeAhead.bind(oControl));
        if (grid)
            {
          selection.attachSuggestionItemSelected(oControl.handleSuggestionGridItemSelected.bind(oControl));
            }
        else
            {
          selection.attachSuggestionItemSelected(oControl.handleSuggestionItemSelected.bind(oControl));
            }
        selection.bindAggregation("suggestionColumns", global.vui5.modelName + ">/TYPEAHEAD/" + evelmNew + "/FIELDS", function(sid, oContext) {
            var contextObject = oContext.getObject();
              return new sap.m.Column({
                header: new sap.m.Text({
                    text: contextObject['LABEL']
                })
            });
        });
        selection.bindAggregation("suggestionRows", global.vui5.modelName + ">/TYPEAHEAD/" + evelmNew + "/DATA", function(sid, oContext) {
            var contextObject = oContext.getObject();
            var model = oControl.getModel(global.vui5.modelName);
            var fields = model.getProperty("/TYPEAHEAD/" + evelmNew + "/FIELDS");
            var cells = [];
            underscoreJS.each(fields, function(obj) {
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

    A.prototype.handleTypeAhead = function(oEvent) {
        var oControl = this;
        var oController = this.getController();
        var modelName = this.getModelName();
        var model = oController.getModel(modelName);
        var oSource = oEvent.getSource();
        var dataPath = oEvent.getSource().data("dataPath");
        var fieldInfo = { "FLDNAME": oController._specialCharacterReplace(model.getProperty(dataPath + "/EVELM")) };

        oControl.fireFieldEvent({
            oEvent: oEvent,
            fieldInfo: fieldInfo,
            fieldValue: oEvent.getParameter('suggestValue'),
            eventType: global.vui5.cons.fieldSubEvent.typeAhead
        });
    };

    A.prototype.handleSuggestionItemSelected = function(oEvent) {
        var oControl = this;
        var oController = this.getController();
        var modelName = this.getModelName();
        var model = oController.getModel(modelName);
        var mainModel = oController.getModel(global.vui5.modelName);

        var item = oEvent.getParameter("selectedRow");
        var rowData = item.getBindingContext(global.vui5.modelName).getObject();
        var evelmNew = oController._specialCharacterReplace(rowData['EVELM']);
        var returnField = mainModel.getProperty("/TYPEAHEAD/" + evelmNew + "/RETURNFIELD");
        var descrField = mainModel.getProperty("/TYPEAHEAD/" + evelmNew + "/DESCRFIELD");
        var path = oEvent.getSource().data("valuePath");
        var dataPath = oEvent.getSource().data("dataPath");

        model.setProperty(path + "/VALUEL", rowData[returnField]);
        var descriptionBuffer = mainModel.getProperty("/DESCRIPTION_BUFFER");
        var bufferEntry = underscoreJS.find(descriptionBuffer, { 'FLDNAME': evelmNew, 'FLDVAL': rowData[returnField] });
        if (bufferEntry) {
            bufferEntry['DESCRIPTION'] = rowData[descrField];
        } else {
            descriptionBuffer.push({
                'FLDNAME': evelmNew,
                'TABNAME': "",
                'FLDVAL': rowData[returnField],
                'DESCRIPTION': rowData[descrField]
            });
        }
        oEvent.getSource().fireChange();

    };

    A.prototype.handleSuggestionGridItemSelected = function(oEvent) {
        var oController = this.getController();
        var modelName = this.getModelName();
        var model = oController.getModel(modelName);
        var mainModel = oController.getModel(global.vui5.modelName);
        var item = oEvent.getParameter("selectedRow");
        var rowData = item.getBindingContext(global.vui5.modelName).getObject();

        var dataPath = oEvent.getSource().data("dataPath");
        var path = oEvent.getSource().data("valuePath");
        var evelm = model.getProperty(dataPath+"/EVELM");
        var evelmNew = oController._specialCharacterReplace(evelm);
        var returnField = mainModel.getProperty("/TYPEAHEAD/" + evelmNew + "/RETURNFIELD");
        model.setProperty(path, rowData[returnField]);
    };

    A.prototype.onValueHelpRequest = function(oEvent) {
        var oControl = this;
        var oController = this.getController();
        var modelName = this.getModelName();
        var model = oController.getModel(modelName);
        var oSource = oEvent.getSource();
        var dataPath = oSource.data("dataPath");
        var multiSelect = "";
        if (oSource.getProperty("valueHelpOnly")) {
            multiSelect = "X";
        }
        var fieldInfo = {"FLDNAME": oController._specialCharacterReplace(model.getProperty(dataPath + "/EVELM")), "RETURNTOKENSONLY": oSource.getProperty("valueHelpOnly"), "LABEL": model.getProperty(dataPath+"/HEADER/QUSTN") };

        oControl.fireOnValueHelpRequest({
            oEvent: oEvent,
            fieldInfo: fieldInfo
        });
        return;
        oControl.fireValueHelpRequest({
            "FLDNAME": infocusModel.getProperty(dataPath + "/EVELM"),
            "TABNAME": "",
            "DATAAREA": "EF",
            "FIELDID": inputId,
            "RETURNTOKENSONLY": oSource.getProperty("valueHelpOnly"),
            "LABEL": infocusModel.getProperty(dataPath + "/HEADER/QUSTN"),
        });
    };

    A.prototype.onReevaluate = function(oEvent, event) {
        var oControl = this;
        var promise = oControl.fireOnReevaluate();
    };

    A.prototype.onButtonProcess = function(oEvent) {
        var oControl = this, params = {};
        var oController = this.getController();
        var modelName = this.getModelName();
        var model = oController.getModel(modelName);
        var dataPath = oEvent.getSource().data("dataPath");

        params['$EVELM'] = model.getProperty(dataPath + "/EVELM");
        var promise = oControl.fireOnButtonProcess({params: params});
    };

    A.prototype.onHyperlinkNav = function(oEvent) {
        var oControl = this, fieldParams = {};
        var oController = this.getController();
        var modelName = this.getModelName();
        var dataPath = this.getDataPath();
        var model = oController.getModel(modelName);
        var urlParams = oEvent.getParameter("urlParams");
        var evelm = oEvent.getSource().data("evelm");
        var subelm = urlParams[global.vui5.cons.params.fieldName];
        var rowId = urlParams[global.vui5.cons.params.selectedRow];
        subelm = subelm.replace("KEY_VALTX", "");

        var gridItems = model.getProperty(this.getDataPath()+"/ITEMG_FCAT");
        var selGridValues = underscoreJS.findWhere(gridItems,{NAME: evelm})['VALUE'];
        var value = underscoreJS.findWhere(selGridValues,{ROWID: rowId})["KEY_EVELM"+subelm];
        fieldParams['$EVELM'] = evelm;
        fieldParams['$SUBELM'] = subelm;
        fieldParams[global.vui5.cons.params.fieldValue] = value;
        var promise = oControl.fireHyperLinkNav({params: fieldParams});
    };

    A.prototype.onCheckBoxSelect = function(oEvent) {
        var oControl = this;
        var oController = this.getController();
        var modelName = this.getModelName();
        var dataPath = this.getDataPath();
        var model = oController.getModel(modelName);
        var selPath = oEvent.getSource().getBindingContext(modelName).getPath();
        var selected = oEvent.getSource().getSelected();
        var itemFcat = model.getProperty(dataPath + "/ITEM_FCAT");
        if (selected) {
            var selItem = model.getProperty(selPath);
            var newItem = underscoreJS.clone(model.getProperty(dataPath + "/ITEM_FCAT/0"));
            newItem['EVELM'] = selItem['EVELM'];
            newItem['VALLW'] = newItem['VALHG'] = newItem['CONTR'] = "";
            if (selItem['VALL'] == c_others) {
                newItem['VALUEL'] = newItem['VALUEH'] = "";
                newItem['EOTHR'] = c_eothr;
            }
            else {
                newItem['VALUEL'] = selItem['VALL'];
                newItem['VALUEH'] = selItem['VALH'];
                newItem['EOTHR'] = "";
            }
            itemFcat.push(newItem);
            model.setProperty(dataPath + "/ITEM_FCAT", itemFcat);
        }
        else {
            var deselItem = model.getProperty(selPath);
            if (deselItem['VALL'] == c_others) {
                var clearItem = underscoreJS.findWhere(itemFcat, { "EVELM": deselItem['EVELM'], "EOTHR": e_eothr });
            }
            else {
                var clearItem = underscoreJS.findWhere(itemFcat, { "EVELM": deselItem['EVELM'], "VALUEL": deselItem['VALL'], "VALUEH": deselItem['VALH'] });
            }
            clearItem['EVELM'] = clearItem['CONTR'] = clearItem['EOTHR'] = "";
            clearItem['VALUEL'] = clearItem['VALUEH'] = "";
        }
    };

    A.prototype.onTokenChange = function(oEvent) {
        var oControl = this;
        var oController = this.getController();
        var type = oEvent.getParameter("type");
        if (type != undefined && type == "tokensChanged") {
            var modelName = this.getModelName();
            var model = oController.getModel(modelName);
            var oSource = oEvent.getSource();
            var token = oSource.getTokens();
            var valuePath = oSource.data("valuePath");
            if (token.length == 0) {
                model.setProperty(valuePath + "/VALUEL", "");
                model.setProperty(valuePath + "/VALUEH", "");
                model.setProperty(valuePath + "/VALLTX", "");
            }
            else {
                var dataPath = oSource.data("dataPath");
                token = token[0];
                var key = token.getProperty("key").split("...");
                model.setProperty(valuePath + "/VALUEL", key[0]);
                model.setProperty(valuePath + "/VALUEH", key[1]);
                var fixedValues = model.getProperty(dataPath + "/VALUES");
                var valtxt = underscoreJS.findWhere(fixedValues, { "VALL": key[0], "VALH": key[1] })['VALTX'];
                model.setProperty(valuePath + "/VALLTX", valtxt);
                var elementHeader = model.getProperty(dataPath + "/HEADER");
            }
        }
    };

    A.prototype.onInputHelpChange = function(oEvent) {
        var oControl = this;
        var oController = this.getController();
        var modelName = this.getModelName();
        var model = oController.getModel(modelName);
        var mainModel = oController.getModel(global.vui5.modelName);
        var oSource = oEvent.getSource();
        oSource.setValueState(sap.ui.core.ValueState.None);
        oSource.setValueStateText('');
        var descriptionBuffer = mainModel.getProperty("/DESCRIPTION_BUFFER");
        var valuePath = oSource.data("valuePath");
        var dataPath = oSource.data("dataPath");
        var elementHeader = model.getProperty(dataPath + "/HEADER");
        var fld = model.getProperty(valuePath);
        var valtxt = underscoreJS.findWhere(descriptionBuffer, { FLDNAME: fld['EVELM'], FLDVAL: fld['VALUEL'] });
        if (fld['VALUEL'] == "") {
            model.setProperty(valuePath + "/VALLTX", "");
            return;
        }
        if (valtxt && valtxt['DESCRIPTION']) {
            model.setProperty(valuePath + "/VALLTX", valtxt['DESCRIPTION']);
        }
        else {
            var dataPath = oSource.data("dataPath");
            var fixedValues = model.getProperty(dataPath)['VALUES'];
            valtxt = underscoreJS.findWhere(fixedValues, { VALL: fld['VALUEL'] });
            if (valtxt) {
                model.setProperty(valuePath + "/VALLTX", valtxt['VALTX']);
            }
            else {
                oSource.setValueState(sap.ui.core.ValueState.Error);
                oSource.setValueStateText(oControl._oBundle.getText("InvalidValue"));
                oSource.focus();
            }
        }
    };

    A.prototype.returnInputControl = function(elementHeader, valuePath, dataPath, span, elementModePath) {
        var oControl = this;
        var oController = this.getController();
        var modelName = this.getModelName();

        var model = oController.getModel(modelName);
        var path = valuePath.replace(modelName + ">", "");
        var valueLowPath = valuePath + "/VALUEL";
        var valueHighPath = valuePath + "/VALUEH";
        var selection, showDescr, vLayoutSpan;
        var oCells = [];
        if (elementHeader['ERANG'] != "X") {
            selection = oControl.returnInput(elementHeader, valueLowPath, dataPath, elementModePath, span);
        }
        else {
            if (elementHeader['VALPO'] == "N") {
                vLayoutSpan = "L12 M12 S12";
            }
            else {
                vLayoutSpan = span;
            }
            var lowSel = oControl.returnInput(elementHeader, valueLowPath, dataPath, elementModePath, span);
            var highSel = oControl.returnInput(elementHeader, valueHighPath, dataPath, elementModePath, span);
            lowSel.data({
                "dataPath": dataPath,
                "valuePath": path
            });
            highSel.data({
                "dataPath": dataPath,
                "valuePath": path
            });
            var lowValue = model.getProperty(path + "/VALUEL");
            var highValue = model.getProperty(path + "/VALUEH");
            var oGrid1 = oControl.returnUnitDescr(showDescr, lowValue, elementHeader, valuePath, span, lowSel, oCells, false);
            oCells = [];
            var oGrid2 = oControl.returnUnitDescr(showDescr, highValue, elementHeader, valuePath, span, highSel, oCells, true);
            selection = new sap.ui.layout.VerticalLayout({
                allowWrapping: true,
                content: [oGrid1[0], oGrid2[0]]
            }).setLayoutData(new sap.ui.layout.GridData({
                span: vLayoutSpan
            }));
        }
        return selection;
    };

    A.prototype.returnInput = function(elementHeader, valuePath, dataPath, elementModePath, span) {
        var oControl = this;
        var oController = this.getController();
        var modelName = this.getModelName();
        var model = oController.getModel(modelName);
        var selection;
        switch (elementHeader['DTYPE']) {
            case c_data_type.date:
                selection = new sap.m.DatePicker({
                    //displayFormat: "long",
                    //*****Rel 60E_SP6
                    //valueFormat: "YYYYMMdd",
                    valueFormat: "yyyyMMdd",
                    //*****
                    placeholder: " ",
                    change: function(oEvent) {
                        var oSource = oEvent.getSource();
                        if (oEvent.getParameter("valid")) {
                            oSource.setValueState(sap.ui.core.ValueState.None);
                            oSource.setValueStateText("");
                        }
                        else {
                            oSource.setValueState(sap.ui.core.ValueState.Error);
                            oSource.setValueStateText(oControl._oBundle.getText("InvalidValue"));
                        }
                    }
                }).bindProperty("displayFormat", global.vui5.modelName + ">" + global.vui5.cons.modelPath.sessionInfo + "/DATFM", Formatter.displayFormat, sap.ui.model.Binding.OneWay)
                  .bindProperty("value", valuePath);
                break;
            case c_data_type.time:
                selection = new sap.m.TimePicker({
                    valueFormat: "hhmmss",
                    displayFormat: "hh:mm:ss a",
                    placeholder: " ",
                }).bindProperty("value", valuePath);
                break;
            default:
                selection = new sap.m.Input({
                    change: [oControl.onInputChange, oControl]
                }).bindProperty("maxLength", modelName + ">" + dataPath + "/HEADER/LENTH", evaluationFormatter.setInputLength, sap.ui.model.BindingMode.OneWay)
                  .bindProperty("textAlign", modelName + ">" + dataPath + "/HEADER/DTYPE", evaluationFormatter.setTextAlign, sap.ui.model.BindingMode.OneWay)
                  .bindProperty("value", valuePath);
                break;
        }
        selection.setModel(model, modelName);
        selection.setLayoutData(new sap.ui.layout.GridData({
            span: span
        }));
        selection.bindProperty("editable", {
            parts: [{ path: global.vui5.modelName + ">/DOCUMENT_MODE" },
                    { path: elementModePath }],
            formatter: evaluationFormatter.returnMode,
            mode: sap.ui.model.BindingMode.OneWay
        });
        return selection;
    };

    A.prototype.onInputChange = function(oEvent) {
        var oControl = this;
        var oController = this.getController();
        var modelName = this.getModelName();
        var sectionId = this.getSectionId();
        var data = [], params = [], event, action, fieldParams = {};
        var model = oController.getModel(modelName);
        var oSource = oEvent.getSource();
        oSource.setValueState(sap.ui.core.ValueState.None);
        oSource.setValueStateText('');
        var valuePath = oSource.data("valuePath");
        var dataPath = oSource.data("dataPath");
        var grid = oSource.data("grid");
        var elementHeader = model.getProperty(dataPath + "/HEADER");
        var bindingField = oSource.getBindingPath("value");
        var lastIndex = bindingField.lastIndexOf("/") + 1;
        bindingField = bindingField.substr(lastIndex);
        if (grid == "X") {
            fieldParams['$GRID'] = grid;
            fieldParams[global.vui5.cons.params.fieldName] = model.getProperty(dataPath + "/EVELM");
            if (bindingField.indexOf("_H") != -1) {
                var lowField = bindingField.replace("_H", "");
                var valueLowPath = valuePath.substr(0, valuePath.lastIndexOf("/") + 1);
                fieldParams[global.vui5.cons.params.valueLow] = model.getProperty(valueLowPath + lowField) || "";
                fieldParams[global.vui5.cons.params.valueHigh] = model.getProperty(valuePath) || "";
            }
            else {
                var highField = bindingField.concat("_H");
                var valueHighPath = valuePath.substr(0, valuePath.lastIndexOf("/") + 1);
                fieldParams[global.vui5.cons.params.valueLow] = model.getProperty(valuePath) || "";
                fieldParams[global.vui5.cons.params.valueHigh] = model.getProperty(valueHighPath + highField) || "";
            }
        }
        else {
            fieldParams[global.vui5.cons.params.fieldName] = model.getProperty(valuePath+"/EVELM");
            fieldParams[global.vui5.cons.params.valueLow] = model.getProperty(valuePath+"/VALUEL") || "";
            fieldParams[global.vui5.cons.params.valueHigh] = model.getProperty(valueHighPath+"/VALUEH") || "";
            //oController.getData(sectionId).then(function(response) {});
        }

        action = {"FNCNM": global.vui5.cons.eventName.fieldValueCheck,
                  "RQTYP": global.vui5.cons.reqTypeValue.post,
                  hideLoader: true};
        var promise = oController.processFieldEvent(sectionId, action, fieldParams);
        if (promise && promise.then) {
            promise.then(function(response) {
              if (!underscoreJS.isEmpty(response['VALUE_NOT_FOUND'])) {
                oSource.setValueState(sap.ui.core.ValueState.Error);
                oSource.setValueStateText(oControl._oBundle.getText("InvalidValue"));
                oSource.focus();
              }
              else if(!grid){
                model.setProperty(valuePath+"/VALLTX", response['DESCR']);
              }
            });
        }
    };

    A.prototype.returnUnitDescr = function(showDescr, value, elementHeader, valuePath, span, selection, oCells, erang) {
        var oControl = this;
        var oController = this.getController();
        var modelName = this.getModelName();
        var model = oController.getModel(modelName);
        var descrSpan, unitSpan, valueDescrPath, gridSpan;
        var unit = "";
        if (erang) {
            valueDescrPath = valuePath + "/VALHTX";
        }
        else {
            valueDescrPath = valuePath + "/VALLTX";
        }
        if (showDescr == "G" || showDescr == "P") {
//            var descrText = new sap.m.Input({
//                editable: false
//            }).bindProperty("value", valueDescrPath)
//              .setModel(model, modelName);
          var descrText = new sap.m.Text({
          }).bindProperty("text", valueDescrPath)
            .setModel(model, modelName)
            .addStyleClass('VuiEvalText');

        }
        if (elementHeader['DTYPE'] == c_data_type.amount || elementHeader['DTYPE'] == c_data_type.quantity) {
            if (elementHeader['DTYPE'] == c_data_type.amount)
                unit = elementHeader['WAERS'];
            else if (elementHeader['DTYPE'] == c_data_type.quantity)
                unit = elementHeader['MEINS'];
            model.setProperty(valuePath.replace(modelName + ">", "") + "/UNIT", unit);
            var unitText= new sap.m.Label({
            }).bindProperty("text",valuePath + "/UNIT")
              .setModel(model, modelName)
              .addStyleClass('VuiUnitText');
//            var unitText = new sap.m.Input({
//                editable: false
//            }).bindProperty("value", valuePath + "/UNIT")
//              .setModel(model, modelName);
        }

        if (descrText || unitText) {
            if (elementHeader['VALPO'] == "N") {
                gridSpan = "L12 M12 S12";
            }
            else {
                gridSpan = "L8 M8 S12";
            }
            var oGrid = new sap.ui.layout.Grid({
                hSpacing: 0,
                vSpacing: 0,
                defaultSpan: gridSpan
            }).setLayoutData(new sap.ui.layout.GridData({
                span: gridSpan
            }));
            oGrid.addContent(selection);
            descrSpan = "L4 M4 S12";
            unitSpan = "L2 M2 S12";
            if (unitText) {
                unitText.setLayoutData(new sap.ui.layout.GridData({
                    span: unitSpan
                }));
                oGrid.addContent(unitText);
            }
            if (descrText) {
                descrText.setLayoutData(new sap.ui.layout.GridData({
                    span: descrSpan
                }));
                oGrid.addContent(descrText);
            }
            oCells.push(oGrid);
        }
        else {
            oCells.push(selection);
        }
        return oCells;
    };

    A.prototype.evaluationDataCheck = function() {
        var oController = this.getProperty("controller");
        var infocusModel = oController.getModel("infocusModel");
        var callData = [];
        var items = underscoreJS.reject(infocusModel.getProperty(evaluationFormPath + "/ITEM_FCAT"), function(obj) {
            if (obj['VALUEL'] == "" && obj['VALUEH'] == "" & obj['EOTHR'] == "")
                {
              return true;
                }
            else
                {
              return false;
                }
        });
        var commentItems = underscoreJS.reject(infocusModel.getProperty(evaluationFormPath + "/ITEMC_FCAT"), function(obj) {
            if (obj['COMNT'] == "")
                {
              return true;
                }
            else
                {
              return false;
                }
        });
        var formData = [{
            "ITEMS_FCAT": items,
            "ITEMC_FCAT": commentItems
        }];
        callData.push({
            "DATA": formData,
            "PARAMS": [{
                "NAME": "FNCNM",
                "VALUE": "CHCK"
            },
                      {
                          "NAME": "DATAR",
                          "VALUE": oController.sectionData.DATAR
                      }],
            "DTAREA": "EF",
            "EVENT": "CHCK"
        });
        var gridItems = infocusModel.getProperty(evaluationFormPath + "/ITEMG_FCAT");
        underscoreJS.each(gridItems, function(obj, i) {
            callData.push({
                "DATA": obj['VALUE'],
                "PARAMS": [{
                    "NAME": "GRID",
                    "VALUE": obj['NAME']
                },
                          {
                              "NAME": "FNCNM",
                              "VALUE": "CHCK"
                          },
                          {
                              "NAME": "DATAR",
                              "VALUE": oController.sectionData.DATAR
                          }],
                "DTAREA": "EF",
                "EVENT": "CHCK"
            });
        });

        return callData;
    };

    A.prototype._getChangedData = function(dataArea) {
        var oControl = this;
        var oController = this.getController();
        var modelName = this.getModelName();
        var dataPath = this.getDataPath();
        var model = oController.getModel(modelName);

        var evalData = {};
        evalData[dataArea] = model.getProperty(dataPath);
        var gridData = model.getProperty(dataPath + "/ITEMG_FCAT");
        underscoreJS.each(gridData, function(obj,i){
          evalData["EVG__"+obj['NAME']] = model.getProperty("/DATA/EVG__"+obj['NAME']);
        });
        return evalData;
    };

    A.prototype.numberFormatPrepare = function(level, n) {
        var oControl = this;
        var oController = this.getController();
        var modelName = this.getModelName();
        var dataPath = this.getDataPath();
        var tmphdrPath = this.getTmphdr();
        var model = oController.getModel(modelName);
        var numberFormat, number;
        switch (level) {
            case 0:
                numberFormat = model.getProperty(tmphdrPath + "/NOFMT");
                break;
            case 1:
                numberFormat = model.getProperty(tmphdrPath + "/FLNOF");
                break;
            case 2:
                numberFormat = model.getProperty(tmphdrPath + "/SLNOF");
                break;
        }
        switch (numberFormat) {
            case "":
                number = "";
                break;
            case "CA":
                number = String.fromCharCode(65 + n) + "." + " ";
                break;
            case "SA":
                number = String.fromCharCode(97 + n) + "." + " ";
                break;
            case "RN":
                number = oControl.toRoman(n + 1) + "." + " ";
                break;
            case "NU":
                number = (n + 1) + "." + " ";
                break;
        }
        return number;
    };

    A.prototype.toRoman = function(n) {
        var r = '',
        decimals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
        roman = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
        for (var i = 0; i < decimals.length; i++) {
            while (n >= decimals[i]) {
                r += roman[i];
                n -= decimals[i];
            }
        }
        return r;
    };

    A.prototype.dateFormatter = function(value) {
        var oController = this.getController();
        var output;
        if (value) {
            if (value == "0000-00-00" || value == "00000000") {
                return '';
            }
            var mainModel = oController.getModel(global.vui5.modelName);
            if (mainModel.getProperty("/SESSION_INFO/DATFM") != undefined) {
                var year = value.substr(0, 4);
                var month = value.substr(4, 2);
                var day = value.substr(6, 2);
                switch (mainModel.getProperty("/SESSION_INFO/DATFM")) {
                    case global.vui5.cons.dateFormat.type0:
                        var months = mainModel.getProperty("/DROPDOWNS/" + global.vui5.cons.dropdownsDatar + "/MONTHS");
                        if (months) {
                            var monthData = underscoreJS.find(months, { NAME: month });
                            if (monthData) {
                                output = monthData['VALUE'] + " " + day + ", " + year;
                            } else {
                                output = value;
                            }
                        } else {
                            output = value;
                        }
                        break;
                    case global.vui5.cons.dateFormat.type1:
                        output = day + "." + month + "." + year;
                        break;
                    case global.vui5.cons.dateFormat.type2:
                        output = month + "/" + day + "/" + year;
                        break;
                    case global.vui5.cons.dateFormat.type3:
                        output = month + "-" + day + "-" + year;
                        break;
                    case global.vui5.cons.dateFormat.type4:
                        output = year + "." + month + "." + day;
                        break;
                    case global.vui5.cons.dateFormat.type5:
                    case global.vui5.cons.dateFormat.typeA:
                    case global.vui5.cons.dateFormat.typeB:
                    case global.vui5.cons.dateFormat.typeC:
                        output = year + "/" + month + "/" + day;
                        break;
                    case global.vui5.cons.dateFormat.type6:
                        output = year + "-" + month + "-" + day;
                        break;
                    default:
                        output = value;
                        break;
                }
            }
        } else {
            output = "";
        }
        return output;
    };

    A.prototype.timeFormatter = function(value) {
        if (value === "000000") {
            return "";
        } else {
            var hours = value.substr(0, 2);
            var minutes = value.substr(2, 2);
            var seconds = value.substr(4, 2);
            var output = hours + ":" + minutes + ":" + seconds;
            return output;
        }
    };

    A.prototype.fullScreenDialog = function(oEvent) {
      var source = oEvent.getSource();
      this.fireOnFullScreen({
        "fullScreen": oEvent.getSource().getIcon() === 'sap-icon://full-screen'
      });
    };

    evaluationFormatter = {
        returnMode: function(value, eMode) {
            if (value != undefined && eMode != undefined) {
                if (value == "" || value == "A" || eMode == "D")
                    {
                  return false;
                    }
                else
                    {
                  return true;
                    }
            }
        },
        returnBoolean: function(value) {
            if (value != undefined) {
                if (value == "A") {
                    return false;
                }
                else {
                    return true;
                }
            }
        },
        showAddKey: function(addKey, mode) {
            if (addKey != undefined && mode != undefined) {
                if (addKey == "X" && mode != "A")
                    {
                  return true;
                    }
                else
                    {
                  return false;
                    }
            }
        },
        messagesLength: function(table) {
            if (table != undefined) {
                return table.length;
            }
        },
        setDisplayFormat: function(value) {
            if (value != undefined) {
                if (value['VALTX'] == "")
                    {
                  return value['VALTX'];
                    }

                if (this.data("type") == "D") {
                    var data = this.getParent().getParent().getParent().data();
                }
                else {
                    var data = this.getParent().data();
                }
                var dataType = data["dtype"];
                var displayFormat = data["disfm"];
                var enableRange = data["erang"];
                var valueLow = value['VALL'];
                var valueHigh = value['VALH'];
                if (dataType == c_data_type.date && displayFormat != "") {
                    valueLow = evalForm.dateFormatter(valueLow);
                    valueHigh = evalForm.dateFormatter(valueHigh);
                }
                else if (dataType == c_data_type.time && displayFormat != "") {
                    valueLow = evalForm.timeFormatter(valueLow);
                    valueHigh = evalForm.timeFormatter(valueHigh);
                }
                if (value['VALL'] == c_others)
                    {
                  return value['VALTX'];
                    }

                if (displayFormat == "") {
                    return value['VALTX'];
                }
                else if (displayFormat == "1") {
                    if (enableRange == "X")
                        {
                      return valueLow + "..." + valueHigh;
                        }
                    else
                        {
                      return valueLow;
                        }
                }
                else if (displayFormat == "2") {
                    if (enableRange == "X")
                    {
                      return valueLow + "..." + valueHigh + " - " + value['VALTX'];
                    }
                    else
                        {
                      return valueLow + " - " + value['VALTX'];
                        }
                }
            }
        },
        radioButtonSelect: function(value, table) {
            if (value != undefined && table != undefined) {
                if (value['EOTHR'] == c_eothr) {
                    var index = underscoreJS.findIndex(table, { "EVELM": value['EVELM'], "VALL": c_others });
                }
                else {
                    var index = underscoreJS.findIndex(table, { "VALL": value['VALUEL'], "VALH": value['VALUEH'] });
                }
                this.setSelectedIndex(index);
                return index;
            }
        },
        drdnSelect: function(value, table) {
            if (value != undefined && table != undefined) {
                var selKey = underscoreJS.findWhere(table, { "EVELM": value['EVELM'], "VALL": value['VALUEL'], "VALH": value['VALUEH'] });
                if (selKey) {
                    return selKey['VALL'];
                }
            }
        },
        checkBoxSelect: function(value, itemFcat) {
            if (value != undefined) {
                if (value['VALL'] == c_others)
                    {
                  var index = underscoreJS.findIndex(itemFcat, { "EVELM": value['EVELM'], "EOTHR": c_eothr });
                    }
                else
                    {
                  var index = underscoreJS.findIndex(itemFcat, { "EVELM": value['EVELM'], "VALUEL": value['VALL'], "VALUEH": value['VALH'] });
                    }
                if (index == -1)
                    {
                  return false;
                    }
                else
                    {
                  return true;
                    }
            }
        },
        matrixRadioSelect: function(value) {
            if (value != undefined) {
                var col = this.data("COL");
                if (value['VALUEL'] == "" && value['VALL'] != c_others) {
                    return false;
                }
                if (value['VALLW'] == c_others) {
                    if (col['VALL'] == c_others)
                    {
                      return true;
                    }
                    else
                        {
                      return false;
                        }
                }
                else {
                    if (col['VALL'] == value['VALUEL'] && col['VALH'] == value['VALUEH'])
                        {
                      return true;
                        }
                    else
                        {
                      return false;
                        }
                }
            }
        },
        setInputLength: function(value) {
            if (value != undefined) {
                return parseInt(value);
            }
        },
        setTextAlign: function(value) {
            if (value != undefined) {
                if (value == c_data_type.amount || value == c_data_type.quantity)
                    {
                  return sap.ui.core.TextAlign.End;
                    }
                else
                    {
                  return sap.ui.core.TextAlign.Initial;
                    }
            }
        },
        itemVisible: function(table) {
            if (table != undefined) {
                if (table.length != 0)
                    {
                  return true;
                    }
                else
                    {
                  return false;
                    }
            }
        },
        toolbarVisible: function(mode, table) {
            if (mode != undefined && table != undefined) {
                if (mode != "A") {
                    return true;
                }
                else {
                    if (table.length != 0)
                    {
                      return true;
                    }
                    else
                        {
                      return false;
                        }
                }
            }
            else if (mode == "A"){
              return false;
            }
        }
    };
});