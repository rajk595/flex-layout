sap.ui.define([ "sap/ui/core/Control",
                vistexConfig.rootFolder + "/ui/core/commonUtils",
                vistexConfig.rootFolder + "/ui/core/global"],
        function(control, commonUtils, global) {
          var A = control.extend(vistexConfig.rootFolder + ".ui.availsWidgets.HeatMap.HeatMapControl", {
                metadata : {
                  properties : {
                    controller : {
                      type : "object",
                      defaultValue : null
                    },
                    modelName: {
                      type: "string",
                      defaultValue: null
                    },
                    columnPath: {
                      type: "string",
                      defaultValue: null
                    },
                    rowPath: {
                      type: "string",
                      defaultValue: null                      
                    },
                    legendPath: {
                      type: "string",
                      defaultValue: null
                    },
                    filtersPath: {
                      type: "string",
                      defaultValue: null
                    },
                    linksPath: {
                      type: "string",
                      defaultValue: null
                    },
                    switchPath: {
                      type: "string",
                      defaultValue: null
                    },
                    currentLocationText: {
                      type: "string",
                      defaultValue: null
                    }
                  },
                  events : {
                    dimensionChange: {},
                    cellClick: {},
                    doubleClick: {},
                    linkClick: {},
                    switchState: {},
                    onFullScreen: {}
                  },
                  aggregations : {
                    _getHeatMap : {
                      type : "sap.ui.core.Control",
                      multiple : false,
                      visibility : "hidden"
                    },
                    _getToolbar: {
                      type: "sap.ui.core.Control",
                      multiple: false,
                      visibility: "hidden"
                    }
                  }
                },
                renderer : function(oRM, oControl) {
                  oRM.write("<style>");
                  oRM.write(".VuiHeatMapLegend{background-color: #FAF9F9; padding-left:0.5%;}")
                  //oRM.write(".VuiHeatMap{padding-left:0.5%;}")
                  oRM.write("</style>");
                  oRM.write("<div");
                  oRM.writeControlData(oControl);
                  oRM.write(">");
                  oRM.renderControl(oControl.getAggregation("_getToolbar"));
                  oRM.renderControl(oControl.getAggregation("_getHeatMap"));
                  oRM.write("</div>");
                }
          });

          A.prototype.setModelName = function(value) {
            this.setProperty("modelName", value, true);
          };
          A.prototype.setColumnPath = function(value) {
            this.setProperty("columnPath", value, true);
          };
          A.prototype.setRowPath = function(value) {
            this.setProperty("rowPath", value, true);
          };
          A.prototype.setLegendPath = function(value) {
            this.setProperty("legendPath", value, true);
          };
          A.prototype.setFiltersPath = function(value) {
            this.setProperty("filtersPath", value, true);
          };
          A.prototype.setLinksPath = function(value) {
            this.setProperty("linksPath", value, true);
          };
          A.prototype.setSwitchPath = function(value) {
            this.setProperty("switchPath", value, true);
          };
          A.prototype.setCurrentLocationText = function(value) {
            this.setProperty("currentLocationText", value, true);
          };

          A.prototype.onHeatMapInfocusSet = function() {
            var oControl = this;
            var oController = this.getController();
            var modelName = this.getModelName();
            var model = oController.getModel(modelName);
            var columnPath = this.getColumnPath();
            var rowPath = this.getRowPath();
            var legendPath = this.getLegendPath();
            var filtersPath = this.getFiltersPath();
            var linksPath = this.getLinksPath();
            var switchPath = this.getSwitchPath();
            var filters = model.getProperty(filtersPath);
            var legend = model.getProperty(legendPath) || [];
                                    
            oControl.oHeatMap = new global.vui5.ui.controls.HeatMap({            
              columns: {
                path: modelName + ">" + columnPath,
                parameters: {arrayNames:['childs']},
                template: new global.vui5.ui.controls.HeatMapColumn({
                  text: "{" + modelName + ">text}",
                  columnid: "{" + modelName + ">id}"
                })
              },
              rows: {
                path: modelName + ">" + rowPath,
                parameters: {arrayNames:['childs']},
                template: new global.vui5.ui.controls.HeatMapRow({
                  text: "{" + modelName + ">text}",
                  rowid: "{" + modelName + ">id}",
                  cells: {
                    path: modelName + ">data",
                    templateShareable: true,
                    template: new global.vui5.ui.controls.HeatMapCell({
                      color: "{" + modelName + ">color}",
                      value: "{=parseInt(${" + modelName + ">percentage})}"
                    })
                  }
                })
              },
              backLink: [
                new sap.m.Breadcrumbs({
                  links: {
                    path: modelName + ">" + linksPath,                
                    template: new sap.m.Link({
                      text: "{" + modelName + ">DESCR}",
                      press: [oControl.onLinkClick, oControl]
                    }).data({"ROWID": "{" + modelName + ">ROWID}"})
                  }
                }).addStyleClass("sapUiTinyMarginBegin sapUiTinyMarginTop sapUiTinyMarginBottom")
                  .bindProperty("currentLocationText",modelName + ">" + oControl.getCurrentLocationText(), function(value){
            	  if(value && !underscoreJS.isEmpty(value)){
            		return value;
            	  }
            	  else {
            		return " ";	
            	  }            	
                }, sap.ui.model.BindingMode.OneWay)
              ],   
              legend: [
        	    new global.vui5.ui.controls.HeatMapLegend({
        		  data: legend
                }).addStyleClass("sapUiTinyMarginTop sapUiTinyMarginBottom sapUiTinyMarginEnd")
              ],          
              cellClick: [oControl.onCellClick, oControl],
              doubleClick: [oControl.onDoubleClick, oControl]
            }).bindProperty("compactMode", modelName + ">" + switchPath, function(val){
         	    if(val != undefined) {
        		  if(val){
        			return true;            			
        		  }
        		  else {
        			return false;
        		  }
        	    }
            }).addStyleClass("VuiHeatMap");

            this._fullScreenButton = new sap.m.OverflowToolbarButton({
                type: sap.m.ButtonType.Transparent,
                icon: {
                    path: global.vui5.modelName + ">" + "/FULLSCREEN",
                    formatter: function (fullScreen) {
                        if (fullScreen === true) {
                            this.setText(sap.ui.core.IconPool.getIconInfo("exit-full-screen")['text']);
                            this.setTooltip(sap.ui.core.IconPool.getIconInfo("exit-full-screen")['text']);
                            return "sap-icon://exit-full-screen";
                        }
                        else {
                            this.setText(sap.ui.core.IconPool.getIconInfo("full-screen")['text']);
                            this.setTooltip(sap.ui.core.IconPool.getIconInfo("full-screen")['text']);
                            return "sap-icon://full-screen";
                        }
                    },
                    mode: sap.ui.model.BindingMode.TwoWay
                },
                visible: true,
                press: oControl.fullScreenDialog.bind(oControl),
                layoutData: new sap.m.OverflowToolbarLayoutData({
                    priority: sap.m.OverflowToolbarPriority.High
                })
            });

            var switchButton = new sap.m.Switch({
            	class: "sapUiSmallMarginEnd",            	
            	type: sap.m.SwitchType.AcceptReject,
            	change: [oControl.onCompactChange, oControl]
            }).bindProperty("state", modelName + ">" + switchPath, function(val){
            	if(val != undefined) {
            		if(val){
            			return true;            			
            		}
            		else {
            			return false;
            		}
            	}
            });                                   
            
            var oFlex = new sap.m.VBox({
            	items: [oControl.oHeatMap]
            });

            var content = [];
            underscoreJS.each(filters, function(filter, i){
              var items = [], selKey, selValue;
              underscoreJS.each(filter['VALUES'], function(value){
                if(!underscoreJS.isEmpty(value['SELECTED'])){
                  selKey = value['KEY'];
                  selValue = value['VALUE'];
                }
                items.push(new sap.ui.core.Item({
                      key: value['KEY'],
                      text: value['VALUE']
                  }));
              });

              if(filter['NAME'] == "HR"){
                oControl.oHeatMap.setHorizontalDimName(selValue);
              }
              else if(filter['NAME'] == "VR"){
                oControl.oHeatMap.setVerticalDimName(selValue);
              }

              var comboBox = new sap.m.ComboBox({
                selectedKey: selKey,
                items: items,
                selectionChange: [oControl.onDimensionChange, oControl]
              }).data({"FILTER": filter['NAME']});

              content.push(new sap.m.Label({
                text: filter['DESCR'],
                design: sap.m.LabelDesign.Bold
              }));
              content.push(comboBox);
            });

            content.push(new sap.m.ToolbarSpacer({}));
            content.push(switchButton);
            content.push(this._fullScreenButton);            

            oControl._toolbar = new sap.m.Toolbar({
                design: sap.m.ToolbarDesign.Solid,
                content: content
            });

            oControl.setAggregation("_getToolbar", oControl._toolbar);
            oControl.setAggregation("_getHeatMap", oFlex);

          };

          A.prototype.addToolBarButton = function(button) {
              var oControl = this;
              var index = oControl._toolbar.indexOfContent(this._fullScreenButton);
              oControl._toolbar.insertContent(button, index);
          };

          A.prototype.removeToolBarButton = function (button) {
            var oControl = this;
            oControl._toolbar.removeContent(button);
          };

          A.prototype.onDimensionChange = function(oEvent) {
            var oControl = this, params = {};
            var source = oEvent.getSource();
            params['$SELKEY'] = source.getProperty("selectedKey");
            params['$FILTER'] = source.data("FILTER");
            var promise = oControl.fireDimensionChange({ params: params });
          };

          A.prototype.onCellClick = function(oEvent) {
            var oControl = this, params = {};
            params['$ROWID'] = oEvent.getParameter("rowId");
            params['$COLID'] = oEvent.getParameter("columnId");
            var promise = oControl.fireCellClick({ params: params });
          };
          
          A.prototype.onDoubleClick = function(oEvent) {
            var oControl = this, params = {};
            params['$ROWID'] = oEvent.getParameter("rowId");
            params['$COLID'] = oEvent.getParameter("columnId");
            var promise = oControl.fireDoubleClick({ params: params });
          };
          
          A.prototype.onCompactChange = function(oEvent) {
            var oControl = this;
            var state = oEvent.getSource().getState();
            oControl.oHeatMap.compactChange(state);          
          };

          A.prototype.onLinkClick = function(oEvent) {
            var oControl = this;
            var oController = this.getController();
            var modelName = this.getModelName();
            var model = oController.getModel(modelName);
            var linksPath = this.getLinksPath();
            var links = model.getProperty(linksPath);
            var rowid = oEvent.getSource().data("ROWID");
            var linkRow = underscoreJS.findWhere(links, {ROWID: rowid})

            var promise = oControl.fireLinkClick({ rowData: linkRow });
          };

          A.prototype.fullScreenDialog = function (oEvent) {
            var source = oEvent.getSource();
            this.fireOnFullScreen({
                "fullScreen": oEvent.getSource().getIcon() === 'sap-icon://full-screen'
            });
          };

          return A;
        });