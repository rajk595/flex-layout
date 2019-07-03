sap.ui.define([
    "sap/ui/core/Control",
    vistexConfig.rootFolder + "/ui/core/global",
    vistexConfig.rootFolder + "/ui/core/Formatter",
    vistexConfig.rootFolder + "/ui/core/underscore-min"
], function(control,global,Formatter,underscoreJS) {
    var A = control.extend(vistexConfig.rootFolder + ".ui.controls.ProcessFlow", {
        metadata: {
            properties: {
              controller : {
                 type : "object",
                 defaultValue: null
              },
              modelName : {
                 type: "string",
                 defaultValue: null
              },
              fieldPath: {
                 type: "string",
                 defaultValue: null
              },
              dataPath : {
                 type: "string",
                 defaultValue: null
              },
              enableOutcomeUndo: {
                 type: "string",
                 defaultValue: null
              },
              editable : {
                 type: "boolean",
                 defaultValue: false
              },
              fullScreen: {
                 type: "boolean",
                 defaultValue: false
              }
            },
            events: {
                onUpdate: {
                    parameters: {
                        selectionSet: {
                            type: "sap.ui.core.Control[]"
                        }
                    }
                },
                outcomeSelect: {},
                outcomeUndo: {},
                onFullScreen: {}
            },
            aggregations: {
                _getProcessFlow: {
                    type: "sap.suite.ui.commons.ProcessFlow",
                    multiple: false,
                    visibility: "hidden"
                },
                _getProcessFlowBar: {
                    type: "sap.ui.core.Control",
                    multiple: false,
                    visibility: "hidden"
                }
            }
        },
        init: function() {
        },

        renderer: function(oRM, oControl) {
          oRM.write("<style>");
          oRM.write(".outcomesList, .reviewList{padding: 0px !important;}");
          oRM.write(".reviewCell{padding-top: 10px !important;}");
          oRM.write(".reviewLabel{font-size: small !important; padding-right: 5px !important; color: gray !important;}");
          oRM.write(".reviewValue{font-size: small; !important");
          oRM.write("</style>");
          oRM.write("<div");
          oRM.writeControlData(oControl);
          oRM.write(">");
          oRM.renderControl(oControl.getAggregation("_getProcessFlowBar"));
          oRM.renderControl(oControl.getAggregation("_getProcessFlow"));
          oRM.write("</div>");
        }
    });

    A.prototype.setModelName = function(value) {
      this.setProperty("modelName",value,true);
    };

    A.prototype.setFieldPath = function(value) {
      this.setProperty("fieldPath",value,true);
    };

    A.prototype.setDataPath = function(value) {
      this.setProperty("dataPath",value,true);
    };

    A.prototype.setEditable = function(value) {
      this.setProperty("editable",value,true);
    };

    A.prototype.setEnableOutcomeUndo = function(value) {
      this.setProperty("enableOutcomeUndo",value,true);
    };

    A.prototype.setFullScreen = function(value) {
      this.setProperty("fullScreen",value,true);
    };

    A.prototype.onProcessFlow = function() {
      var oControl = this;
      var oController = this.getProperty("controller");
      var modelName = this.getModelName();
      var model = oController.getModel(modelName);
      var editable = this.getEditable();
      var dataPath = this.getDataPath();
      var fieldsPath = this.getFieldPath();
      var outcomeUndo = this.getEnableOutcomeUndo();
      var bundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls");

      var fields = model.getProperty(fieldsPath);
      var titleFields = underscoreJS.where(fields, {OBHCT: global.vui5.cons.objectHeaderCategory.title});
      var statusField = underscoreJS.findWhere(fields, {OBHCT: global.vui5.cons.objectHeaderCategory.status});
      var attributeFields = underscoreJS.where(fields, {OBHCT: global.vui5.cons.objectHeaderCategory.attribute});
      oControl.sectionData = oController.sectionData;

      oControl._oProcessFlow = new sap.suite.ui.commons.ProcessFlow({
        foldedCorners: true
      }).data({"UIFLDS": fields});

      oControl._oProcessFlow.setModel(model,modelName);
      oControl._oProcessFlow.bindAggregation("lanes", modelName+">"+dataPath+"LANES", function(sId, oContext) {
        var nodePath = modelName+">"+dataPath+"NODES";
        var fieldsPath = modelName+">"+fields;
         return new sap.suite.ui.commons.ProcessFlowLaneHeader({
            laneId: oContext.getObject("LANEID"),
            text: oContext.getObject("DESCR"),
            position: parseInt(oContext.getObject("POSTN")),
            iconSrc: "sap-icon://person-placeholder"
         });
      });

      oControl._oProcessFlow.bindAggregation("nodes", modelName+">"+dataPath+"NODES", function(sId, oContext) {
        var texts = [];
        var dataPath = modelName+">"+oContext.sPath + "/" + statusField['FLDNAME'];
        var tablePath = global.vui5.modelName+">/DROPDOWNS/"+oControl.sectionData['DARID']+"/"+statusField['FLDNAME']+"/";
        var oNode = new sap.suite.ui.commons.ProcessFlowNode({
          title: oContext.getObject("DESCR"),
          laneId: oContext.getObject("LANEID"),
          nodeId: oContext.getObject("NODEID")
        }).bindProperty("stateText", {
            parts: [{path: dataPath},
                    {path: tablePath}],
            formatter: processFlowFormatter.stepStatus,
            mode: sap.ui.model.BindingMode.OneWay
        }).bindProperty("state", dataPath, processFlowFormatter.stepState, sap.ui.model.BindingMode.OneWay);

        if (oContext.getObject("CHNDE") != "") {
           oNode.setChildren(oContext.getObject("CHNDE"));
        }

        underscoreJS.each(titleFields, function(obj,i){
          if(!underscoreJS.isEmpty(oContext.getObject(obj['FLDNAME']))){
            if(underscoreJS.isEmpty(obj['HDLBL'])){
              texts.push(obj['LABEL']+"\n"+oContext.getObject(obj['FLDNAME']));
            }
            else{
              texts.push(oContext.getObject(obj['FLDNAME']));
            }
          }
        });
        oNode.setTexts(texts);
        oNode.attachBrowserEvent("click touchstart", function() {
          oControl.processNodeClick(this);
        });
        return oNode;
      });

      oControl._fullScreenButton = new sap.m.OverflowToolbarButton({
            type: sap.m.ButtonType.Transparent,
            icon: {
               path: vui5.modelName + ">" + "/FULLSCREEN",
               formatter: function (fullScreen) {
                 return fullScreen === true ? 'sap-icon://exit-full-screen' : 'sap-icon://full-screen';
               },
               mode: sap.ui.model.BindingMode.TwoWay
            },
            press: oControl.fullScreenDialog.bind(oControl)
      });

      var oBar = new sap.m.Toolbar({
        design: sap.m.ToolbarDesign.Solid,
        content: [
              new sap.m.Button({
                icon: "sap-icon://undo",
                type: sap.m.ButtonType.Transparent,
                press: [oControl.processOutcomeUndo, oControl]
              }).bindProperty("visible", modelName+">"+outcomeUndo, processFlowFormatter.returnBoolean, sap.ui.model.BindingMode.OneWay),
              new sap.m.ToolbarSpacer({}),
              oControl._fullScreenButton
            ]
      })//.bindProperty("visible", modelName+">"+outcomeUndo, processFlowFormatter.returnBoolean, sap.ui.model.BindingMode.OneWay);

      oControl.setAggregation("_getProcessFlowBar", oBar);
      oControl.setAggregation("_getProcessFlow", oControl._oProcessFlow);
    };


    A.prototype.processNodeClick = function(oEvt) {
      var oControl = this, contentData = [], contentControl, text;
      var oController = this.getController();
      var modelName = this.getModelName();
      var model = oController.getModel(modelName);
      var mainModel = oController.getModel(global.vui5.modelName);
      var fieldPath = this.getFieldPath();
      var dataPath = this.getDataPath();
      var editable = this.getEditable();
      var fields = model.getProperty(fieldPath);
      var attributeFields = underscoreJS.where(fields, {OBHCT: global.vui5.cons.objectHeaderCategory.attribute});
      var nodeId = oEvt.getProperty("nodeId");
      var bundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls");

      var selNode = underscoreJS.findWhere(model.getProperty(dataPath+"NODES"), {NODEID: nodeId});
      var selNodeIndex = underscoreJS.findIndex(model.getProperty(dataPath+"NODES"), {NODEID: nodeId});
      if (selNode['RVTYP'] != "R") {
        if (!editable) {
          return;
        }
        text =  bundle.getText("SetOutcome");
        var outcomes = underscoreJS.where(model.getProperty(dataPath+"OUTCOMES"),{NODEID: nodeId});
        var list = new sap.m.List({
        }).addStyleClass("outcomesList").addStyleClass("sapUiSizeCompact");

        underscoreJS.each(outcomes, function(obj,i){
          list.addItem(new sap.m.ActionListItem({
             text: obj['DESCR'],
             type: sap.m.ListType.Active,
             press: [oControl.processOutcome, oControl]
          }).data({"OTCOM": obj['OTCOM']}));
        });

        contentControl = list;
      } else {
          text =  bundle.getText("Review");
          /*underscoreJS.each(attributeFields, function(field,i){
            var path = dataPath+"NODES/"+selNodeIndex+"/"+field['FLDNAME'];
            if(!underscoreJS.isEmpty(model.getProperty(path)) && model.getProperty(path) != "0000-00-00" && model.getProperty(path) != "00:00:00"){
              contentData.push(new sap.m.Label({
                text: field['LABEL']
              }).bindProperty("visible",modelName+">"+path,processFlowFormatter.returnVisible,sap.ui.model.Binding.OneWay));
              if(field['DATATYPE'] == global.vui5.cons.dataType.date){
                var textField = new sap.m.Text({
                }).bindProperty("text",{
                  path: modelName+">"+path,
                  formatter:Formatter.dateFormat,
                  mode: sap.ui.model.Binding.OneWay
                }).setModel(mainModel,global.vui5.modelName);
              }
              else if(field['DATATYPE'] == global.vui5.cons.dataType.time){
                var textField = new sap.m.Text({
                  type: sap.ui.model.type.Time
                }).bindProperty("text",modelName+">"+path,Formatter.timeFormatter, sap.ui.model.Binding.OneWay);
              }
              else{
                var textField = new sap.m.Text({
                }).bindProperty("text",modelName+">"+path);
              }
              contentData.push(textField);
            }
          });

          contentControl = new sap.ui.layout.form.SimpleForm({
             layout: sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout,
             editable: true,
             content: contentData
          }).setModel(model, modelName);*/

          var oLayout = new sap.ui.commons.layout.MatrixLayout({
            layoutFixed: true,
            columns: 1,
            width: "100%"
          });

          for(var i = 0; i<5; i++){
            var label, className = "", formatter = null, path = dataPath+"NODES/"+selNodeIndex;
            if(i == 0){
              label =  bundle.getText("SetOn");
              path = path+"/SEDAT";
              className = "reviewCell";
              formatter =Formatter.dateFormat;
            }
            else if( i == 1 ){
              label =  bundle.getText("by");
              path = path+"/SENAM";
            }
            else if( i == 2 ){
              label =  bundle.getText("ReviewOn");
              path = path+"/REDAT";
              className = "reviewCell";
              formatter = Formatter.dateFormat;
            }
            else if( i == 3 ){
              label =  bundle.getText("by");
              path = path+"/RENAM";
            }
            else{
              label =  bundle.getText("Outcome");
              path = path+"/SOUTC_D";
              className = "reviewCell";
            }

            var oRow = new sap.ui.commons.layout.MatrixLayoutRow({
               cells: [
                 new sap.ui.commons.layout.MatrixLayoutCell({
                   padding: sap.ui.commons.layout.Padding.None,
                   content: [
                     new sap.m.Text({
                       text: label
                     }).bindProperty("visible",modelName+">"+path,processFlowFormatter.returnVisible,sap.ui.model.Binding.OneWay)
                       .addStyleClass("reviewLabel"),
                     new sap.m.Text({
                     }).bindProperty("text",modelName+">"+path, formatter, sap.ui.model.Binding.OneWay)
                       .setModel(mainModel,global.vui5.modelName)
                       .addStyleClass("reviewValue")
                   ]
                 }).addStyleClass(className)
               ]
            });
            oLayout.addRow(oRow);
          }

          contentControl = new sap.m.Table({
            width: "100%",
            inset: true,
            fixedLayout: false,
            columns: [
              new sap.m.Column({
                hAlign: "Left",
                demandPopin: true,
                popinDisplay: "Block",
                minScreenWidth: sap.m.ScreenSize.Small
              })
            ]
          }).setModel(model, modelName)
            .addStyleClass("reviewList");

          contentControl.addItem(new sap.m.ColumnListItem({
            type: sap.m.ListType.Active,
            cells: [oLayout]
          }));
      }

      var oPopover = new sap.m.ResponsivePopover({
        text: text,
        contentWidth: "300px",
        content: [contentControl],
        customHeader: [
           new sap.m.Bar({
             contentMiddle: [new sap.m.Text({text: text})],
             contentRight: [
               new sap.m.Button({
                  icon: "sap-icon://decline",
                  tooltip:  bundle.getText("Close"),
                  press: function(oEvt) {oEvt.getSource().getParent().getParent().close();}
               })
             ]
           })
        ]
      });

      oPopover.openBy(oEvt);
    };

    A.prototype.processOutcome = function(oEvent) {
      var oControl = this;
      var oController = this.getController();
      var modelName = oControl.getModelName();
      var dataPath = oControl.getDataPath();
      var model = oController.getModel(modelName);
      oEvent.getSource().getParent().getParent().close();
      var otcom = oEvent.getSource().data("OTCOM");
      var outcomes = model.getProperty(dataPath+"OUTCOMES");
      var selRecord = underscoreJS.findWhere(outcomes,{"OTCOM": otcom});
      var bundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls");

      var promise = oControl.fireOutcomeSelect([{callBack:function(resp){
                                                  var id = oControl._oProcessFlow.sId;
                                                  sap.ui.getCore().byId(id).updateModel();}},
                                                {record: selRecord}]);

    };

    A.prototype.processOutcomeUndo = function(oEvent) {
      var oControl = this;
      var promise = oControl.fireOutcomeUndo({callBack:function(resp){
                                               var id = oControl._oProcessFlow.sId;
                                               sap.ui.getCore().byId(id).updateModel();
                                             }});
    };

    A.prototype.fullScreenDialog = function(oEvent) {
      var source = oEvent.getSource();
      this.fireOnFullScreen({
        "fullScreen": oEvent.getSource().getIcon() === 'sap-icon://full-screen'
      });
    };

    //*****Rel 60E_SP6
    A.prototype.setsetStatusZoomLevel = function(oEvent) {
    	var oControl = this;
    	if(oControl._oProcessFlow){
    	   oControl._oProcessFlow.setZoomLevel(sap.suite.ui.commons.ProcessFlowZoomLevel.Two);
    	}    	
    };
    //*****    
    
    processFlowFormatter = {
        returnBoolean: function(value) {
            if (value != undefined) {
                if (underscoreJS.isEmpty(value))
                    {
                  return false;
                    }
                else
                    {
                  return true;
                    }
            }
            else {
              return false;
            }
        },
        returnVisible: function(value) {
          if(value != undefined){
            if(underscoreJS.isEmpty(value) || value == "0000-00-00" || value == "00:00:00"){
              return false;
            }
            else{
              return true;
            }
          }
        },
        stepStatus: function(value, table) {
            if (value != undefined && table != undefined) {
                var status = underscoreJS.findWhere(table, {NAME: value});
                return status['VALUE'];
            }
        },
        stepState: function(value) {
            if(value){
            var oState;
            var uiflds = this.getParent().data("UIFLDS");
            var styles = underscoreJS.findWhere(uiflds, {OBHCT: global.vui5.cons.objectHeaderCategory.status})['STYLES'];
            var state = underscoreJS.findWhere(styles, {VALUE: value})['STATE'];
            if (state != undefined) {
                if (underscoreJS.isEmpty(state)) {
                    oState = sap.suite.ui.commons.ProcessFlowNodeState.Neutral;
                } else if (state == "1") {
                    oState = sap.suite.ui.commons.ProcessFlowNodeState.Negative;
                } else if (state == "2") {
                    oState = sap.suite.ui.commons.ProcessFlowNodeState.Positive;
                } else if (state == "3"){
                    oState = sap.suite.ui.commons.ProcessFlowNodeState.PlannedNegative;
                } else if (state == "4"){
                    oState = sap.suite.ui.commons.ProcessFlowNodeState.Critical;
                }
                return oState;
            }
            }
        }
    };
});