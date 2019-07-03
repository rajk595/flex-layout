sap.ui.define(["sap/m/P13nPanel",
    vistexConfig.rootFolder + "/ui/core/global",
    vistexConfig.rootFolder + "/ui/core/Formatter",
    vistexConfig.rootFolder + "/ui/core/commonUtils",
    vistexConfig.rootFolder + "/ui/core/underscore-min",
    "sap/ui/model/json/JSONModel", ], function (Panel, global, Formatter, commonUtils, underscoreJS, JSONModel) {

        var P = Panel.extend(vistexConfig.rootFolder + ".ui.controls.AggregationPanel", {
            constructor: function (sId, mSettings) {
                sap.m.P13nPanel.apply(this, arguments);
            },
            metadata: {
                properties: {
                    modelName: {
                        type: "string",
                        defaultValue: null
                    },
                    fieldPath: {
                        type: "string",
                        defaultValue: null
                    },
                    dataAreaPath: {
                        type: "string",
                        defaultValue: null
                    },
                    fromGrid:{
                    	type:"boolean",
                    	defaultValue:false
                    },
                    layoutDataPath: {
                        type: "string"
                    },
                    controller: {
                        type: "object"
                    }

                },
                aggregations: {
                    content: {
                        type: "sap.m.Table",
                        multiple: false
                    }
                },
                events: {
                    onSelectionChange: {}
                }

            },

            renderer: function (oRM, oControl) {
                oRM.write("<div");
                oRM.writeControlData(oControl);
                oRM.write(">");

                //oControl.getPanelContent();
                oRM.renderControl(oControl.getContent());
                oRM.write("</div>");
            }

        });

        P.prototype.setController = function (value) {
            this.setProperty("controller", value, true);
        };

        P.prototype.setModelName = function (value) {
            this.setProperty("modelName", value, true);
        };

        P.prototype.setFieldPath = function (value) {
            this.setProperty("fieldPath", value, true);
        };

        P.prototype.setDataAreaPath = function (value) {
            this.setProperty("dataAreaPath", value, true);
        };

        P.prototype.setLayoutDataPath = function (value) {
            this.setProperty("layoutDataPath", value, true);

        };
        P.prototype.setFromGrid = function(value){
        	this.setProperty("fromGrid", value, true);
        };

        P.prototype.getItems = function () {
            return this.getModel("panelModel") ? this.getModel("panelModel").getProperty("/DATA") : [];
        };

        P.prototype.getPanelContent = function () {
            var oControl = this, data = {};
            var model = new JSONModel();

            data = oControl.prepareModelData();
            model.setData(data);
            oControl.setModel(model, "panelModel");

            var oTable = new sap.m.Table({

            });

            var currentModel = oControl.getModel(oControl.getModelName());

            var fields = currentModel.getProperty(oControl.getFieldPath());

            oTable.bindAggregation("columns", "panelModel>/FIELDS/", function (sid, oContext) {
                var contextObject = oContext.getObject(),visible;

                var oText = new sap.m.Text({
                    text: contextObject['LABEL']
                });
                contextObject['NO_OUT'] == 'X'? visible = false : visible = true
                

                return new sap.m.Column({
                    header: oText,
                    width: "auto",
                    visible : visible,
                    hAlign: sap.ui.core.TextAlign.Center
                });
            });

            oTable.bindAggregation("items", "panelModel>/DATA/", function (sid, oContext) {
                var contextObject = oContext.getObject();
                var bindingMode = sap.ui.model.BindingMode.TwoWay;
                var cells = [], selection;
                underscoreJS.each(data['FIELDS'], function (field) {

                    if (field['FLDNAME'] === 'COLUMNKEY') {
                        selection = new sap.m.Text({
                            text: underscoreJS.findWhere(fields, { 'FLDNAME': contextObject['COLUMNKEY'] })['LABEL'],
                            textAlign: sap.ui.core.TextAlign.Center
                        });

                        //selection.bindText("panelModel>" + field['FLDNAME'], null, bindingMode);
                    }
                    else {
                        selection = new global.vui5.ui.controls.ComboBox({
                            editable: true
                        });


                        selection.bindAggregation("items", global.vui5.modelName + '>' + "/DROPDOWNS/" + vui5.cons.dropdownsDatar + "/" + field['FLDNAME'], function (sid, oContext) {
                            var contextObject = oContext.getObject();
                            return new sap.ui.core.Item({
                                key: contextObject['NAME'],
                                text: contextObject['VALUE']
                            });
                        });
                        selection.bindProperty("selectedKey", "panelModel>" + field['FLDNAME'], null, bindingMode);

                        selection.attachChange(function (oEvent) {
                            oControl.fireOnSelectionChange();
                        });
                    }

                    cells.push(selection);
                });

                return new sap.m.ColumnListItem({
                    //type: oControl.getListItemType(),
                    vAlign: sap.ui.core.VerticalAlign.Middle,
                    cells: cells
                });
            });

            oTable.setModel(oControl.getModel(oControl.getModelName()), oControl.getModelName());
            oTable.setModel(oControl.getModel(vui5.modelName), vui5.modelName);
            oTable.setModel(model, "panelModel");
            oTable.addStyleClass("vuiTableBottomPadding");
            oControl.setContent(oTable);

        };

        P.prototype.prepareModelData = function () {
            var oControl = this, panelData = [], columns = [], columnObject = {};
            this._oBundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls");
            var currentModel = oControl.getModel(oControl.getModelName());
            var layoutData = currentModel.getProperty(oControl.getLayoutDataPath());
            var fields = underscoreJS.filter(currentModel.getProperty(oControl.getFieldPath()), function (object) {
                if (object['DATATYPE'] == global.vui5.cons.dataType.amount ||
                   object['DATATYPE'] == global.vui5.cons.dataType.quantity ||
                   object['DATATYPE'] == global.vui5.cons.dataType.decimal ||
                   object['DATATYPE'].substr(0, 3) == global.vui5.cons.dataType.integer) {

                    if (!layoutData || underscoreJS.isEmpty(layoutData['AGRGTITEMS'])) {
                        panelData.push({
                            'COLUMNKEY': object['FLDNAME'],
                            'AGGAT': '',
                            'SBAGT': ''
                        });
                    }
                    else if (!underscoreJS.isEmpty(underscoreJS.findWhere(layoutData['AGRGTITEMS'], { 'COLUMNKEY': object['FLDNAME'] }))) {
                        panelData.push($.extend(true, {}, underscoreJS.findWhere(layoutData['AGRGTITEMS'], { 'COLUMNKEY': object['FLDNAME'] })));
                    }
                    else {
                        panelData.push({
                            'COLUMNKEY': object['FLDNAME'],
                            'AGGAT': '',
                            'SBAGT': ''
                        });
                    }

                    return object;
                }
            });
            
            oControl._vuiVisible = !underscoreJS.isEmpty(fields);
            
            columnObject['FLDNAME'] = 'COLUMNKEY';
            columnObject['LABEL'] = oControl._oBundle.getText("Column")
            columnObject['ELTYP'] = global.vui5.cons.element.input;
            columnObject['DATATYPE'] = global.vui5.cons.dataType.character;
            columnObject['OUTPUTLEN'] = parseInt(100);
            columnObject['HDLBL'] = '';
            columnObject['NO_OUT'] = '';
            columnObject['DISABLED'] = 'X';
            columns.push(columnObject);
            
            columnObject = {};
            columnObject['FLDNAME'] = 'SBAGT';
            columnObject['LABEL'] = oControl._oBundle.getText("SubAggregation");
            columnObject['ELTYP'] = global.vui5.cons.element.dropDown;
            columnObject['DATATYPE'] = global.vui5.cons.dataType.character;
            columnObject['OUTPUTLEN'] = parseInt(1);
            columnObject['HDLBL'] = '';
            columnObject['DISABLED'] = '';
            
			if(oControl.getFromGrid()){
				columnObject['NO_OUT'] = 'X';    	
			  }
			else{
				columnObject['NO_OUT'] = '';
			}
            columns.push(columnObject);
            

            columnObject = {};
            columnObject['FLDNAME'] = 'AGGAT';
            columnObject['LABEL'] = oControl._oBundle.getText("Aggregation");
            columnObject['ELTYP'] = global.vui5.cons.element.dropDown;
            columnObject['DATATYPE'] = global.vui5.cons.dataType.character;
            columnObject['OUTPUTLEN'] = parseInt(1);
            columnObject['HDLBL'] = '';
            columnObject['NO_OUT'] = '';
            columnObject['DISABLED'] = '';
            columns.push(columnObject);



            return {
                "FIELDS": columns,
                "DATA": panelData
            };
        };


        P.prototype.clearValues = function () {
            var oControl = this;
            var panelModel = oControl.getModel("panelModel");
            var panelData = panelModel.getProperty("/DATA");
            underscoreJS.each(panelData, function (data) {
                data['AGGAT'] = "";
                data['SBAGT'] = "";
            });

            panelModel.setProperty("/DATA", panelData);
        };
        
        
        P.prototype.addPanelToDialog = function(){
          return this._vuiVisible;
        };

        return P;
    });