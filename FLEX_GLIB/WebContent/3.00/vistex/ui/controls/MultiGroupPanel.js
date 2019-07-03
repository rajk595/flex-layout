sap.ui.define(["sap/m/P13nPanel",
    vistexConfig.rootFolder + "/ui/core/global",
    vistexConfig.rootFolder + "/ui/core/Formatter",
    vistexConfig.rootFolder + "/ui/core/commonUtils",
    vistexConfig.rootFolder + "/ui/core/underscore-min",
    "sap/ui/model/json/JSONModel", ], function (Panel, global, Formatter, commonUtils, underscoreJS, JSONModel) {

        var P = Panel.extend(vistexConfig.rootFolder + ".ui.controls.MultiGroupPanel", {
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
                    layoutDataPath: {
                        type: "string"
                    },
                    controller: {
                        type: "object"
                    }
                },
                aggregations: {
                    content: {
                        type: "sap.m.MultiComboBox",
                        multiple: false
                    }
                },
                events: {
                	updateMultiGroupItems: {}
                }
            },
            renderer: function (oRM, oControl) {            
                oRM.write("<div style='padding-left: 2% !important; padding-top: 2% !important;' ");
                oRM.writeControlData(oControl);
                oRM.write(">");
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

        P.prototype.getPanelContent = function () {
            var oControl = this;
            var modelName = oControl.getModelName();
            var fieldPath = this.getFieldPath();
            var model = oControl.getModel(modelName);
            
            oControl.groupItems = [];                        
            oControl.selection = new sap.m.MultiComboBox({
                editable: true,
                width: "30%"
            });            
            
            oControl.selection.bindAggregation("items", modelName + '>' + fieldPath, function (sid, oContext) {
                var contextObject = oContext.getObject();
                return new sap.ui.core.Item({
                    key: contextObject['FLDNAME'],
                    text: contextObject['LABEL']
                })
            });            
            
            oControl.selection.attachSelectionChange(function (oEvent) {
                var keys = oEvent.getSource().getSelectedKeys(), groupItems = [];
                underscoreJS.each(keys, function(key) {
                	var object = {};
                	object['COLUMNKEY'] = key;
                	object['OPERATION'] = 'GroupAscending';
                	groupItems.push(object);
                });
                oControl.groupItems = groupItems;
                oControl.fireUpdateMultiGroupItems();
            });
            
            oControl.selection.setModel(model, modelName);
            oControl.selection.setModel(oControl.getModel(vui5.modelName), vui5.modelName);                 
            oControl.setContent(oControl.selection);

        };
        
        P.prototype.addGroupItems = function (groupItems) {
        	var oControl = this;
            oControl.groupItems = groupItems || [];
            oControl.updateSelections();
        };
        
        P.prototype.removeAllGroupItems = function () {
        	var oControl = this;
        	oControl.groupItems = [];
        	oControl.updateSelections();
        };
        
        P.prototype.getGroupItems = function () {
        	var oControl = this;
        	return oControl.groupItems;
        };                
        
        P.prototype.updateSelections = function () {
        	var oControl = this, keys = [];
        	underscoreJS.each(oControl.groupItems, function(obj) {
        		keys.push(obj['COLUMNKEY']);
        	});
        	oControl.selection.setSelectedKeys(keys);
        };
        
        return P;
    });