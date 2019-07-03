sap.ui.define(['sap/ui/core/Control',
             vistexConfig.rootFolder + "/ui/core/global",
             vistexConfig.rootFolder + "/ui/core/underscore-min"],
function (control, global, underscoreJS) {
    'use strict';
    var C = control.extend(vistexConfig.rootFolder + ".ui.controls.Sets", {
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
                enableSearch: {
                    type: "string",
                    defaultValue: null
                },
                nodeSelect: {
                    type: "string",
                    defaultValue: null
                }

            },
            aggregations: {
                _setsControl: {
                    type: "sap.ui.core.Control",
                    multiple: false,
                    visibility: "public"
                }
            },
            events: {
                onNodeSelect: {}
            }
        },


        init: function () {

        },

        renderer: function (oRM, oControl) {
            oRM.write("<div");
            oRM.writeControlData(oControl);
            oRM.write(">");
            oRM.renderControl(oControl.getAggregation("_setsControl"));
            oRM.write("</div>");
        }
    });
    C.prototype.setDataPath = function (value) {
        this.setProperty("dataPath", value, true);
    };
    C.prototype.setController = function (value) {
        this.setProperty("controller", value, true);
    };
    C.prototype.setModelName = function (value) {
        this.setProperty("modelName", value, true);
    };
    C.prototype.setEnableSearch = function (value) {
        this.setProperty("enableSearch", value, true);
    };
    C.prototype.setNodeSelect = function (value) {
        this.setProperty("nodeSelect", value, true);
    };
    C.prototype._processSetsData = function (value) {
        var oControl = this;
        var dataPath = this.getProperty('dataPath');
        var modelName = this.getModelName();
        var oController = this.getController();
        var model = oController.getModel(modelName);
        var data = oController.getModel(modelName).getProperty(dataPath);
        //var treeData = oController._processSetsData(data);
        //        var treeData =  data ? data[0]['DETAILS'] ? data[0]['DETAILS'] : data : undefined;
        // if(data){
        //          for (var i=0;i<treeData.length;i++){
        //            var currSetsData = treeData[i]['REVIEW'];
        //            underscoreJS.map(currSetsData, function (obj) {
        //                obj['NODES'] = [];
        //                obj['SELECTED']  == "X"  ?  obj['SELECTED'] = true : obj['SELECTED'] = false;
        //                  return obj;
        //              });
        //            //oController._prepareTreeData(currSetsData,"NODE","PARENT");
        //          }
        //          for ( var i = 0;i<treeData.length;i++){
        //            var currSetsData = treeData[i]['REVIEW'];
        //            oController._prepareTreeData(currSetsData,"NODE","PARENT");
        //             }
        //           model.setProperty(dataPath,treeData);
        this._prepareSetsControl();
        // }

    };
    C.prototype._prepareSetsControl = function () {
        var oControl = this;
        var oController = this.getController();
        var dataPath = this.getProperty('dataPath');
        var modelName = this.getModelName();
        var model = oController.getModel(modelName);
        var enableSearch = this.getEnableSearch();
        var nodeSelect = this.getNodeSelect();
        var oGridTiles = new sap.ui.layout.Grid({
            hSpacing: 2,
            vSpacing: 1,
            defaultSpan: "L6 M6 S12"
        });
        oGridTiles.bindAggregation('content', modelName + ">" + dataPath, function (sId, context) {
            var object = context.getObject();
            var sPath = context.getPath();
            var titlePath = sPath + "/TITLE";
            var path = sPath + "/REVIEW";
            var tree = new global.vui5.ui.controls.Tree({
                modelName: modelName,
                controller: oController,
                dataPath: path,
                titlePath: titlePath,
                showToolBar: true,
                parentKeyField: "PARENT",
                keyField: "NODE",
                descriptionField: "TEXT",
                selectedField: "SELECTED",
                nodeSelect: nodeSelect,
                enableSearch: enableSearch,
                paramField: "DMCAT",
                onNodeSelect: function (event) {
                    oGridTiles.getBinding("content").bSuspended = true;
                    oControl.fireOnNodeSelect({
                        oEvent: event.getParameter('oEvent'),
                        params: event.getParameter('params')
                    });
                }
            });
            tree._prepareTreeControl(titlePath, path);
            tree.setModel(oController.getMainModel(), global.vui5.modelName);
            tree.setModel(model, oController.modelName);
            //var tree = oControl.prepareTree(titlePath,path);
            return tree;
        });

        this.setAggregation("_setsControl", oGridTiles);
    };
    //    C.prototype.prepareTree = function(titlePath,treePath){
    //      var oControl = this;
    //      var dataPath = this.getDataPath();
    //      var modelName = this.getModelName();
    //      var flexbox  = new sap.m.FlexBox({direction: "Column"})
    //      var headerToolBar = new sap.m.Toolbar({
    //            content : [
    //          new sap.m.Label({
    //            layoutData : new sap.m.ToolbarLayoutData({
    //          shrinkable : false
    //        }),
    //        design : sap.m.LabelDesign.Bold
    //          }).bindProperty("text",modelName + ">"+ titlePath,null,sap.ui.model.BindingMode.OneWay),
    //          new sap.m.ToolbarSpacer(),
    //          new sap.m.SearchField()]
    //      })
    //      flexbox.addItem(headerToolBar);
    //      var tree = new sap.m.Tree({mode:"MultiSelect",
    //      width : "500px"}).addStyleClass('vuiTree');
    //        tree.bindAggregation("items",modelName + ">"+ treePath,function(sId,context){
    //           var obj = context.getObject();
    //         return new sap.m.StandardTreeItem({
    //           title: obj['TEXT'],
    //           selected: obj['SELECTED'] == "X" ? true : false
    //         })
    //
    //          });
    //        flexbox.addItem(tree);
    //        return flexbox;
    //    };
});