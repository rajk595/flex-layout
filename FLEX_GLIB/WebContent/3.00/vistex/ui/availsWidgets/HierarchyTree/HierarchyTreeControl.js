sap.ui.define([ "sap/ui/core/Control",
                vistexConfig.rootFolder + "/ui/core/commonUtils",
                vistexConfig.rootFolder + "/ui/core/global"],
        function(control, commonUtils, global) {
          var A = control.extend(vistexConfig.rootFolder + ".ui.availsWidgets.HierarchyTree.HierarchyTreeControl", {
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
                    }                    
                  },
                  events : {
                    onCellExpand: {},
                    onDetails: {},
                    //*****Rel 60E_SP7
                    onAvailabilityClick: {},
                    //*****
                    onFullScreen: {}
                  },
                  aggregations : {
                    _getHierarchyTree : {
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
                  oRM.write("<div");
                  oRM.writeControlData(oControl);
                  oRM.write(">");
                  oRM.renderControl(oControl.getAggregation("_getToolbar"));
                  oRM.renderControl(oControl.getAggregation("_getHierarchyTree"));
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

          A.prototype.onHierarchyTreeInfocusSet = function() {
            var oControl = this;
            var oController = this.getController();
            var modelName = this.getModelName();
            var model = oController.getModel(modelName);
            var columnPath = this.getColumnPath();
            var rowPath = this.getRowPath();

            var oHierarchyTree = new global.vui5.ui.controls.TreeTable({
            	columns: {
            		 path: modelName + ">" + columnPath,
            		 template: new global.vui5.ui.controls.TreeTableColumn({
                       text: "{" + modelName + ">text}"
                     })
            	},
            	rows: {
                    path: modelName + ">" + rowPath,
                    templateShareable: false,
                    parameters: {arrayNames:['Childs']},                    
                    template: new global.vui5.ui.controls.TreeTableRow({
                      color: "{" + modelName + ">color}",
                      availibilityText: "{" + modelName + ">availibilityText}",
                      availibility: "{=parseInt(${" + modelName + ">availibilityPersantage})}",
                      rowId: "{" + modelName + ">rowId}",
                      cells: {
                        path: modelName + ">Items",
                        templateShareable: false,
                        template: new global.vui5.ui.controls.TreeTableCell({
                          text: "{" + modelName + ">text}",
                          childsNumber: "{=parseInt(${" + modelName + ">children})}",
                          columnId: "{" + modelName + ">columnId}",
                          expanded: "{= ${" + modelName + ">expanded} === 'X'}",
                          valId: "{" + modelName + ">id}"
                        })
                      }
                    })
                },
                expand: [oControl.onCellExpand, oControl],
                details: [oControl.onDetails, oControl],
                //*****Rel 60E_SP7
                harveyBallClicked: [oControl.onAvailabilityClick, oControl]
                //*****
            });                       

            var oFlex = new sap.m.VBox({
              items: [oHierarchyTree]
            });

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
            
            oControl._toolbar = new sap.m.Toolbar({
                design: sap.m.ToolbarDesign.Solid,
                content: [new sap.m.ToolbarSpacer({}),                	            
                	      oControl._fullScreenButton    	
                ]
            });
            
            oControl.setAggregation("_getToolbar", oControl._toolbar);
            oControl.setAggregation("_getHierarchyTree", oFlex);
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
        	   
          A.prototype.fullScreenDialog = function (oEvent) {
        	var source = oEvent.getSource();
        	this.fireOnFullScreen({
        	  "fullScreen": oEvent.getSource().getIcon() === 'sap-icon://full-screen'
        	});
          };
          
          A.prototype.onCellExpand = function (oEvent) {
          	var oControl = this, params = {}; 	          
          	var values = oEvent.getParameter("values");

          	params['$ROWID'] = oEvent.getParameter("rowId");
          	
          	var newValues = [];
          	underscoreJS.each(values, function(value,i){
          		var keys = underscoreJS.keys(value), row = {};
          		underscoreJS.each(keys, function(key){
          			row[key.toUpperCase()] = value[key];
          		});
          		newValues.push(row);          		
          	});
          	
          	this.fireOnCellExpand({
          		params: params,
          		rowData: newValues          	  
          	});
          };
          
          A.prototype.onDetails = function (oEvent) {           
        	var oControl = this, params = {};            	            	
            var values = oEvent.getParameter("values");
            	
            params['$ROWID'] = oEvent.getParameter("rowId");
            	
            this.fireOnDetails({
            	params: params,
            	rowData: values          	  
            });
          };
          
          //*****Rel 60E_SP7
          A.prototype.onAvailabilityClick = function (oEvent) {           
          	var oControl = this, params = {};            	          	
            params['$ROWID'] = oEvent.getParameter("rowId");
              	
            this.fireOnAvailabilityClick({
             	params: params
            });
          };
          //*****
          return A;
        });   