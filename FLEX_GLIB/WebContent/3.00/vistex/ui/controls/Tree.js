sap.ui.define(['sap/ui/core/Control',
	vistexConfig.rootFolder + "/ui/core/global",
	vistexConfig.rootFolder + "/ui/core/underscore-min"],
	function (control, global, underscoreJS) {
	    'use strict';
	    var C = control.extend(vistexConfig.rootFolder + ".ui.controls.Tree", {
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
	                titlePath: {
	                    type: "string",
	                    defaultValue: null
	                },
	                parentKeyField: {
	                    type: "string",
	                    defaultValue: null
	                },
	                keyField: {
	                    type: "string",
	                    defaultValue: null
	                },
	                selectedField: {
	                    type: "string",
	                    defaultValue: null
	                },
	                descriptionField: {
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
	                },
	                paramField: {
	                    type: "string",
	                    defaultValue: null
	                },
	                showToolBar: {
	                    type: "boolean",
	                    defaultValue: null
	                }
	            },
	            aggregations: {
	                _treeControl: {
	                    type: "sap.ui.core.Control",
	                    multiple: false,
	                    visibility: "public"
	                }
	            },
	            events: {
	                onNodeSelect: {}
	            }
	        },

	        init: function () { },

	        renderer: function (oRM, oControl) {
	            oRM.write("<div");
	            oRM.writeControlData(oControl);
	            oRM.write(">");
	            oRM.renderControl(oControl.getAggregation("_treeControl"));
	            oRM.write("</div>");
	        }
	    });
	    C.prototype.setDataPath = function (value) {
	        this.setProperty("dataPath", value, true);
	    };
	    C.prototype.setTitlePath = function (value) {
	        this.setProperty("titlePath", value, true);
	    };
	    C.prototype.setController = function (value) {
	        this.setProperty("controller", value, true);
	    };
	    C.prototype.setModelName = function (value) {
	        this.setProperty("modelName", value, true);
	    };
	    C.prototype.setParentKeyField = function (value) {
	        this.setProperty("parentKeyField", value, true);
	    };
	    C.prototype.setkeyField = function (value) {
	        this.setProperty("keyField", value, true);
	    };
	    C.prototype.setDescriptionField = function (value) {
	        this.setProperty("descriptionField", value, true);
	    };
	    C.prototype.setSelectedField = function (value) {
	        this.setProperty("selectedField", value, true);
	    };

	    C.prototype.setEnableSearch = function (value) {
	        this.setProperty("enableSearch", value, true);
	    };
	    C.prototype.setNodeSelect = function (value) {
	        this.setProperty("nodeSelect", value, true);
	    };
	    C.prototype.setShowToolBar = function (value) {
	        this.setProperty("showToolBar", value, true);
	    };
	    C.prototype.setParamField = function (value) {
	        this.setProperty("paramField", value, true);
	    };

	    C.prototype._prepareTreeControl = function () {
	        var oControl = this;
	        var dataPath = this.getDataPath();
	        var modelName = this.getModelName();
	        var titlePath = this.getTitlePath();
	        var selectedField = this.getSelectedField();
	        var descriptionField = this.getDescriptionField();
	        var showToolBar = this.getShowToolBar();
	        var dmode = this.getController().getMainModel().getProperty("/DOCUMENT_MODE");
	        //var field = this.getController().getModel(modelName).getProperty(descriptionField);
	        var nodeSelect = this.getNodeSelect();
	        var enableSearch = this.getEnableSearch();
	        var treePath = dataPath;
	        var flexbox = new sap.m.FlexBox({
	            direction: "Column"
	        });
	        var tree = new sap.m.Tree({
	            //mode:"MultiSelect",
	            expandToLevel: 3,
	            selectionChange: function (event) {
	                oControl._selectionChange(event);
	            },
	            width: "500px"
	        }).bindProperty("mode", modelName + ">" + nodeSelect, function (val) {
	            return val ? "MultiSelect" : "None";
	        }, sap.ui.model.BindingMode.OneWay).addStyleClass('vuiTree');
	        tree.addEventDelegate({
	            onAfterRendering: function (e) {
	                var tree = e.srcControl;

	                //            	if(!tree.expandVar){
	                //            		tree.expandVar = true
	                //            		tree.expandToLevel(3);
	                //            	}
	                //            	else{
	                //            		delete tree.expandVar;
	                //            	}
	                //tree.expandToLevel(3);
	                var items = tree.getItems();
	                if (dmode == "A") {
	                    items.forEach(function (item) {
	                        var id = item.$().find('.sapMCb').attr('id');
	                        if (id) {
	                            var checkbox = sap.ui.getCore().byId(id).setEnabled(false);
	                        }
	                    });
	                } else {
	                    items.forEach(function (item) {
	                        var object = item.getBindingContext(tree.getParent().getParent().getModelName()).getObject();

	                        if (object['DISABLED']) {
	                            var id = item.$().find('.sapMCb').attr('id');
	                            if (id) {
	                                var checkbox = sap.ui.getCore().byId(id).setEnabled(false);
	                            }
	                        }
	                        //            			 if(!item.getItemNodeContext().nodeState.expanded){
	                        //            				 item.getItemNodeContext().nodeState.expanded = true 
	                        //            			 }
	                        //            			 
	                    });
	                }

	            }
	        });
	        oControl._tree = tree;
	        tree.bindAggregation("items", modelName + ">" + treePath, function (sId, context) {
	            var obj = context.getObject();
	            var path = context.getPath();
	            var item = new sap.m.StandardTreeItem({
	                title: obj[descriptionField]
	            })
					//		   .bindProperty("selected",modelName + ">"+ path +"/"+ selectedField, function(val){
					//		    	 return  val == "X" || val == true ? true : false;
					//		     }, sap.ui.model.BindingMode.OneWay)
					.bindProperty("selected", modelName + ">" + path + "/" + selectedField, null,
						sap.ui.model.BindingMode.TwoWay)
					.bindProperty("type", global.vui5.modelName + ">/DOCUMENT_MODE", function (val) {
					    return val == "" ? "Inactive" : "Active";
					}, sap.ui.model.BindingMode.OneWay);

	            //    		 .bindProperty("title", {
	            //		    	  parts: [
	            //		               { path: path},
	            //		               { path: descriptionField }
	            //		            ],
	            //                  mode: sap.ui.model.Binding.OneWay,
	            //                  formatter: treeFormatter._setTitle
	            //          })
	            if (obj['NODE'] == 'Except') {
	                item.addStyleClass('vuiExceptNode');
	            }

	            return item;
	        });

	        tree.expandToLevel(3);
	        var headerToolBar = new sap.m.Toolbar({
	            content: [
					new sap.m.Label({
					    layoutData: new sap.m.ToolbarLayoutData({
					        shrinkable: false
					    }),
					    design: sap.m.LabelDesign.Bold
					}).bindProperty("text", modelName + ">" + titlePath, null, sap.ui.model.BindingMode.OneWay),
					new sap.m.ToolbarSpacer(),
					new sap.m.SearchField({
						liveChange: function (event) {
					    	oControl._tree.expandToLevel(10);
					    	var filters = [];
					    	
					        var query = event.getParameter("newValue");
					        var items = oControl._tree.getItems();
					        
					        if (query && query.length > 0) {
					            filters.push(new sap.ui.model.Filter(descriptionField, sap.ui.model.FilterOperator.Contains, query));
					            oControl._tree.getBinding("items").filter(filters);
					        }
					        else{
					        	oControl._tree.collapseAll();
					        }
					        
					       /* underscoreJS.each(items, function (item, i) {
					            if (item.getTitle().indexOf(query) <= -1) {
					                $("#" + item.getId()).hide();
					            } else {
					                $("#" + item.getId()).show();
					            }
					        });*/
					    }
					}).bindProperty("visible", modelName + ">" + enableSearch, function (val) {
					    return val ? true : false
					}, sap.ui.model.BindingMode.OneWay)]
	        });
	        if (showToolBar) {
	            flexbox.addItem(headerToolBar);
	        }
	        flexbox.addItem(tree);


	        this.setAggregation("_treeControl", flexbox);
	        // return flexbox;
	    };
	    C.prototype._selectionChange = function (event) {
	        var oControl = this;
	        var keyField = this.getKeyField();
	        var selectedField = this.getSelectedField();
	        var modelName = this.getModelName();
	        var dataPath = this.getDataPath();
	        var model = oControl.getController().getModel(modelName);
	        var paramField = oControl.getParamField();
	        var aItems = event.getParameter("listItems") || [];
	        //         $.each(aItems, function(iIndex, oItem) {
	        //      		var oNode = oItem.getBindingContext(oControl.getModelName()).getObject(),
	        //      	       path = oItem.getBindingContextPath(),
	        //          		 bSelected = oItem.getSelected();
	        //          	// model.setProperty(path+"/"+selectedField,bSelected);
	        //      	      //as binding is not there
	        //      		 oNode[selectedField] = bSelected;
	        //      		//
	        //          if (oNode.NODES) {
	        //          		addSelectedFlag(oNode.NODES, bSelected);
	        //          }
	        //      });
	        //    	
	        //    	function addSelectedFlag(aNodes, bSelected) {
	        //    	 	$.each(aNodes, function(iIndex, oNode) {
	        //    	  	oNode[selectedField]= bSelected;
	        //    	  	//model.setProperty(path +iIndex+"/"+selectedField,bSelected);
	        //    	  	
	        //    	    if (oNode.NODES) {
	        //    	    	//var cPath = path + iIndex + "/NODES/";
	        //    	    	addSelectedFlag(oNode.NODES, bSelected);
	        //    	    }
	        //    	  });
	        //    	 }
	        //var path = this.getNodePath() ? this.getNodePath() : dataPath;
	        //var data = model.getProperty(path);
	        //model.setProperty(dataPath,[]);
	        //model.setProperty(path,data);
	        //model.refresh();
	        //	event.getSource().getBinding("items").refresh(true);
	        var obj = event.getParameter('listItem').getBindingContext(oControl.getModelName()).getObject();
	        var params = {

	        };

	        params[keyField] = obj[keyField];
	        if (paramField) {
	            params[paramField] = obj[paramField];
	        }
	        //if(event.getParameter("selected")){
	        oControl.fireOnNodeSelect({
	            oEvent: event,
	            params: params
	        });
	        //}

	    };
	    var treeFormatter = {
	        _setTitle: function (obj, field) {
	            return obj[field];
	        },
	        _setSelected: function (obj, field) {
	            return obj[field] ? true : false;
	        }
	    }
	    return C;
	});