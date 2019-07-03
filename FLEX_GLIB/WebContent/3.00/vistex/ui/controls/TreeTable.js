sap.ui.define([
  "sap/ui/table/TreeTable",
  "sap/ui/model/json/JSONModel",
  "sap/ui/table/Column",
  "sap/m/Label",
  "sap/m/Text",
  //             ESP5 - Generic App Changes - Start
  //             "sap/ui/model/Sorter",
  //             "sap/ui/model/Filter",
  //             ESP5 - Generic App Changes - End
  "sap/ui/comp/variants/VariantItem",
  vistexConfig.rootFolder + "/ui/core/global",
  vistexConfig.rootFolder + "/ui/core/Formatter",
  vistexConfig.rootFolder + "/ui/core/underscore-min"
//             ESP5 - Generic App Changes - Start
//             ],function(Table,JSONModel,Column,Label,Text,Sorter,Filter,VariantItem) {
], function (Table, JSONModel, Column, Label, Text, VariantItem, global, Formatter, underscoreJS) {
    //  ESP5 - Generic App Changes - End
    var T = Table.extend(vistexConfig.rootFolder + ".ui.controls.TreeTable", {
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
                /*** Rel 60E_SP7 - TreeTable Field Grouping - Start***/
                fieldGroupPath: {
                    type: "string",
                    defaultValue: null
                },
                /*** Rel 60E_SP7 - TreeTable Field Grouping - End***/
                fieldPath: {
                    type: "string",
                    defaultValue: null
                },
                dataPath: {
                    type: "string",
                    defaultValue: null
                },
                dataAreaPath: {
                    type: "string",
                    defaultValue: null
                },
                title: {
                    type: "string",
                    defaultValue: null
                },
                showTitle: {
                    type: "boolean",
                    defaultValue: false
                },
                handle: {
                    type: "string",
                    defaultValue: null
                },
                onF4HelpRequest: {
                    type: "function",
                    defaultValue: null
                },
                enableLocalSearch: {
                    type: "boolean",
                    defaultValue: false
                },
                editable: {
                    type: "boolean",
                    defaultValue: false
                },
                hideDetailButton: {
                    type: "boolean",
                    defaultValue: false
                },
                hideExpanderControl: {
                    type: "boolean",
                    defaultValue: false
                },
                //              ESP5 - Generic App Changes - Start
                sectionID: {
                    type: "string",
                    defaultValue: ""
                },
                //*****Rel 60E_SP6
                enableQuickEntry: {
                    type: "boolean",
                    defaultValue: false
                },
                //*****
                /*Expanded Indices Path - Start*/
                expandedIndicesPath: {
                	type: "string",
                	defaultValue: null
                }
                /*Expanded Indices Path - End*/
            },
            //          ESP5 - Generic App Changes -  End
            events: {
                onFieldChange: {},
                onDetailButton: {},
                onFieldClick: {},
                onValueHelpRequest: {},
                //*****Rel 60E_SP6
                onQuickEntry: {}
                //*****
            }
        },


        renderer: function (oRM, oControl) {
            jQuery.sap.require("sap.ui.table.TreeTableRenderer");
            sap.ui.table.TreeTableRenderer.render(oRM, oControl);
        }
    });

    /*required in case of later version as sorting and filter icon are not shown*/
    //  T.prototype.onAfterRendering = function() {
    //  var oControl = this;
    //  this.setSortFilterOnColumns();
    //  };
    T.prototype.onBeforeRendering = function () {
        var oControl = this;
        if (oControl._performPersonalization) {
            oControl._performPersonalization = false;
            oControl._applyPersonalization(oControl._columnItems);
        }
    };


    // Column Width Optimzation
    //  T.prototype.onAfterRendering = function() {
    //  if (sap.ui.table.Table.prototype.onAfterRendering) {
    //  sap.ui.table.Table.prototype.onAfterRendering.apply(this, arguments);
    //  }
    //  var $ = this.$();
    //  var temp = $.find('td[headers=\"' + this.getId() + '_col' + 0 + '\"]').parent().hasClass("sapUiTableRowHidden");
    //  if(!temp && this.getDataPath() && !this._renderingDone ) {
    //  var model = this.getModel(this.getModelName());
    //  for(var i=0; i < this.getColumns().length;i++){
    //  var h = 0;
    //  var temp = $.find('td[headers=\"' + this.getId() + '_col' + i + '\"]').parent().hasClass("sapUiTableRowHidden")
    //  if(!temp){
    ////var f = $.find('td[headers=\"' + this.getId() + '_col' + i + '\"]').children("div");
    ////if(f.children().length > 0){
    //  this._renderingDone = true;
    //  var column = this.getColumns()[i];
    //  var bindingPath = column.getBindingContext(this.getModelName()).sPath;
    //  var fieldInfo = model.getProperty(bindingPath);
    //  if(fieldInfo['DATATYPE'] != 'DATS'){
    //  this.autoResizeColumn(i);
    //  }
    ////}
    //  }
    //  }
    //  this.autoResizeColumn(0);
    //  }
    //  };
    //  Column Width Optimzation
    T.prototype.onAfterRendering = function () {
        if (sap.ui.table.Table.prototype.onAfterRendering) {
            sap.ui.table.Table.prototype.onAfterRendering.apply(this, arguments);
        }
        this.addRowColor();
//        var $ = this.$();
//        var variant = this._oVariants.getSelectionKey();
//
//        var columns = this._getVisibleColumns();
//
//        if (this.getDataPath() && variant == "*standard*" && !this.getRenderingDone() && columns.length > 0) {
//
//            var model = this.getModel(this.getModelName());
//            this._changingColumnWidth = true;
//
//            for (var i = columns.length - 1; i >= 0; i--) {
//                this.setRenderingDone(true);
//                //                this.autoResizeColumn(i);
//            }
//
//            this._changingColumnWidth = false;
//        }
    };

    T.prototype.setRenderingDone = function (value) {
        this._renderingDone = value;
    };

    T.prototype.getRenderingDone = function () {
        return this._renderingDone;
    };

    //*****Rel 60E_SP6
    T.prototype.setEnableQuickEntry = function (value) {
        this.setProperty("enableQuickEntry", value, true);
        this._quickEntryButton.setVisible(value);
    };
    //*****
    
    /*Expanded Indices Path - Start*/
    T.prototype.setExpandedIndicesPath = function (value) {
        this.setProperty("expandedIndicesPath", value, true);
    };
    /*Expanded Indices Path - End*/

    T.prototype._calculateAutomaticColumnWidth = function (o, f) {
        var t = ["sap.m.Text", "sap.m.Label", "sap.m.Link", "sap.ui.commons.TextView", "sap.ui.commons.Label", "sap.ui.commons.Link"];
        var $ = this.$();
        var h = 0;
        var g = $.find('td[headers=\"' + this.getId() + '_col' + f + '\"]').children("div");
        var o = this.getColumns();
        var j = o[f];
        if (!j) {
            return null;
        }
        var H = j.getHeaderSpan();
        var k = j.getLabel();
        var l = this;
        var m = j.getTemplate();
        var n = q.inArray(m.getMetadata().getName(), t) != -1 || sap.ui.commons && sap.ui.commons.TextField && m instanceof sap.ui.commons.TextField || sap.m && sap.m.Input && m instanceof sap.m.Input;
        var p = document.createElement("div");
        document.body.appendChild(p);
        q(p).addClass("sapUiTableHiddenSizeDetector");
        var r = j.getMultiLabels();
        if (r.length == 0 && !!k) {
            r = [k];
        }
        if (r.length > 0) {
            q.each(r, function (v, L) {
                var w;
                if (!!L.getText()) {
                    q(p).text(L.getText());
                    h = p.scrollWidth;
                } else {
                    h = L.$().scrollWidth;
                }
                h = h + $.find("#" + j.getId() + "-icons").first().width();
                $.find(".sapUiTableColIcons#" + j.getId() + "_" + v + "-icons").first().width();
                if (H instanceof Array && H[v] > 1) {
                    w = H[v];
                } else if (H > 1) {
                    w = H;
                }
                if (!!w) {
                    var i = w - 1;
                    while (i > f) {
                        h = h - (l._oCalcColumnWidths[f + i] || 0);
                        i -= 1;
                    }
                }
            });
        }
        var s = Math.max.apply(null, g.map(function () {
            var _ = q(this);
            return parseInt(_.css('padding-left'), 10) + parseInt(_.css('padding-right'), 10) + parseInt(_.css('margin-left'), 10) + parseInt(_.css('margin-right'), 10);
        }).get());
        var u = Math.max.apply(null, g.children().map(function () {
            var w = 0,
              W = 0;
            var _ = q(this);

            /*Check Whether children exist
             * in case of responsive control.... input tag is surounded by div
             * get width of input help*/
            var i = "";
            if (q(this).children().length > 0) {

                if (n) {
                    W = Math.max.apply(null, q(this).children().map(function () {
                        var i = q(this).text() || q(this).val();
                        q(p).text(i);
                        var width = p.scrollWidth;

                        // Get Child element margin,border and padding

                        var width1 = width + parseInt(q(this).css('margin-left'), 10)
                        + parseInt(q(this).css('margin-right'), 10)
                        + parseInt(q(this).css('border-left'), 10)
                        + parseInt(q(this).css('border-right'), 10)
                        + parseInt(q(this).css('padding-left'), 10)
                        + parseInt(q(this).css('padding-right'), 10);
                        return width1;
                    }));
                } else {
                    W = this.scrollWidth;
                }
            } else {
                var i = _.text() || _.val();

                if (n) {
                    q(p).text(i);
                    W = p.scrollWidth;
                } else {
                    W = this.scrollWidth;
                }

            }
            /*****/


            if (h > W) {
                W = h;
            }
            w = W + parseInt(_.css('margin-left'), 10) + parseInt(_.css('margin-right'), 10) + s + 1;
            return w;
        }).get());
        q(p).remove();
        return Math.max(u, this._iColMinWidth);
    };

    T.prototype.init = function () {
        Table.prototype.init.apply(this);

        var oControl = this;

        this._oVuiTitle = new sap.m.Title();

        this._oVuiSeparator = new sap.m.ToolbarSeparator({
            visible: oControl.getShowTitle()
        });

        this._oSearchField = new sap.m.SearchField({
            width: "25%",
            search: oControl._onFilterTable.bind(oControl),
            visible: oControl.getEnableLocalSearch()
        });
        var sLocale = sap.ui.getCore().getConfiguration().getLanguage();
        if (sLocale.length > 2) {
            sLocale = sLocale.substring(0, 2);
        }
        this._oBundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls");

        this._initializeVariants();
        this._oDetailButton = new sap.m.Button({
            //          text : "{utilitiesi18n>Detail}",
            icon: "sap-icon://detail-view",
            tooltip: this._oBundle.getText("Detail"),
            visible: !oControl.getHideDetailButton(),
            //          type : sap.m.ButtonType.Transparent,
            //          type : sap.m.ButtonType.Emphasized,
            press: [oControl._onDetail, oControl]
        });
        this._ExpandButton = new sap.m.Button({
            //text: this._oBundle.getText("ExpandAll"),
            icon:"sap-icon://expand-group",
            tooltip:this._oBundle.getText("ExpandAll"),
            visible: !oControl.getHideExpanderControl(),
            press: [oControl._onExpand, oControl]

        });
        this._CollapseButton = new sap.m.Button({
            icon:"sap-icon://collapse-group",
            tooltip:this._oBundle.getText("CollapseAll"),
            //text: this._oBundle.getText("CollapseAll"),
            visible: !oControl.getHideExpanderControl(),
            press: [oControl._onCollapse, oControl]

        });

        //*****Rel 60E_SP6
        this._quickEntryButton = new sap.m.OverflowToolbarButton({
            type: sap.m.ButtonType.Transparent,
            icon: "sap-icon://customer-order-entry",
            visible: this.getEnableQuickEntry(),
            text: this._oBundle.getText("QuickEntry"),
            tooltip: this._oBundle.getText("QuickEntry"),
            enabled: true,
            iconFirst: true,
            activeIcon: "",
            iconDensityAware: true,
            textDirection: "Inherit",
            press: function (oEvent) {
                oControl.fireOnQuickEntry();
            }
        });
        //*****

        var headerToolBar = new sap.m.OverflowToolbar({
            content: [
              this._oVuiTitle,
              //this._oVuiSeparator,
              this._oVariants,
             new sap.m.ToolbarSpacer(),
              this._oSearchField,
              //*****Rel 60E_SP6
              this._quickEntryButton,
              this._oDetailButton,
              this._ExpandButton,
              this._CollapseButton
              
              //*****

             // this._toggleButton
            //                     new sap.m.Button({
            //                     text: "",
            //                     type: "Default",
            //                     enabled: true,
            //                     icon: "sap-icon://action-settings",
            //                     iconFirst: true,
            //                     activeIcon: "",
            //                     iconDensityAware: true,
            //                     textDirection: "Inherit",
            //                     tooltip : "{utilitiesi18n>Personalization}",
            //                     press: oControl._onSettingPressed.bind(oControl)
            //                     })
            ]
        });

        this.setToolbar(headerToolBar);
        this._vuiUpdateBindingContexts = this._updateBindingContexts;
        this._updateBindingContexts = this.vuiUpdateBindingContexts.bind(this);
        this.attachColumnFreeze(this._onColumnFreeze.bind(this));
        this._oManualColumnFreeze = false;
        this.attachColumnResize(function () {
            if (!oControl._changingColumnWidth)
                oControl._oVariants.currentVariantSetModified(true);
        });

        //      ESP5 - Generic App Changes - Start
        //      this.attachCustomFilter(this.onCustomFilter.bind(this));
        //      this.attachSort(this._onSort.bind(this));
        //      ESP5 - Generic App Changes - End


        this.attachToggleOpenState(function (oEvent) {
        	if(!oControl._expandedIndices){
        		oControl._expandedIndices = [];
        	}
        	if(oEvent.getParameter("expanded")){
        		oControl._expandedIndices.push(oEvent.getParameter("rowIndex"));
        	}else{
        		oControl._expandedIndices = underscoreJS.without(oControl._expandedIndices, oEvent.getParameter("rowIndex"));
        	}
        });
        
        oControl.addEventDelegate({
            onAfterRendering: function (oEvent) {
            	var mainModel = oControl.getProperty("controller").getMainModel();
            	oControl._expandedIndices = mainModel.getProperty(oControl.getExpandedIndicesPath()+oControl.getProperty("sectionID")+"/");
            	if(oControl._expandedIndices && oControl._expandedIndices.length > 0){
            		oControl._onExpand(null, true);
            	}
            }
        });
    };

    T.prototype.setHideDetailButton = function (value) {
    	var oControl = this;
        this.setProperty("hideDetailButton", value, true);
        this._oDetailButton.setVisible(!value);
        
        if (sap.ui.getVersionInfo().version > "1.45" && !value) {

            this._oDetailButton.setVisible(false);
            var oTemplate = new sap.ui.table.RowAction({
                items: [new sap.ui.table.RowActionItem({
                    type: sap.ui.table.RowActionType.Navigation,
                    press: function (oEvent) {
                        oControl.fireOnDetailButton({
                            record: oEvent.getParameter("row").getBindingContext(oControl.getModelName()).getObject()
                        });
                    }
                })]
            });


            oControl.setRowActionTemplate(oTemplate);
            oControl.setRowActionCount(1);
        }
    };
    T.prototype.setHideExpanderControl = function (value) {
        this.setProperty("hideExpanderControl", value, true);
        this._ExpandButton.setVisible(!value);
        this._CollapseButton.setVisible(!value);
    };

    T.prototype._onDetail = function () {

        var oControl = this;
        var selectedRows = this.getSelectedIndices();

        /*var rows = this.getRows();
        if (selectedRows) {
            this.fireOnDetailButton({
                record: rows[selectedRows[0]].getBindingContext(oControl.getModelName()).getModel().getProperty(rows[selectedRows[0]].getBindingContext(oControl.getModelName()).getPath())
            });
        }*/

        if (this.getSelectedItems()) {
            this.fireOnDetailButton({
                record: this.getSelectedItems()[0]
            });
        }
    };

    T.prototype.getHeaderToolbar = function () {
        return this.getToolbar();
    };

    T.prototype.setEnableLocalSearch = function (value) {
        this.setProperty("enableLocalSearch", value, true);
        this._oSearchField.setVisible(value);
    };

    /*** Rel 60E_SP7 - TreeTable Field Grouping - Start***/
    T.prototype.setFieldGroupPath = function (value) {
        this.setProperty("fieldGroupPath", value, true);
    };
    /*** Rel 60E_SP7 - TreeTable Field Grouping - End***/
    
    T.prototype.setTitle = function (value) {
        this.setProperty("title", value, true);
        this._oVuiTitle.setText(value);
        this.showSeparator();
    };

    T.prototype.setShowTitle = function (value) {
        this.setProperty("showTitle", value, true);
        this._oVuiTitle.setVisible(value);
        this._oVuiSeparator.setVisible(value);
    };

    T.prototype.setFieldPath = function (value) {
        this.setProperty("fieldPath", value, true);
        //      this.prepareTableFields();
        //      this.prepareTableData();
    };

    T.prototype.setDataPath = function (value) {
        this.setProperty("dataPath", value, true);
        //      this.prepareTableData();
    };

    T.prototype.setModelName = function (value) {
        this.setProperty("modelName", value, true);
        //      this.prepareTableFields();
        //      this.prepareTableData();
    };

    T.prototype.setEditable = function (value) {
        if (value != this.getEditable()) {
            this.setProperty("editable", value, true);
            //          this.prepareTableFields();
        }
    };

    T.prototype.setDataAreaPath = function (value) {
        this.setProperty("dataAreaPath", value, true);
        //      this.prepareTableFields();
    };

    T.prototype.setSectionID = function (value) {
        this.setProperty("sectionID", value, true);
    };
    T.prototype._onExpand = function (oEvent, restoreState) {
        var oControl = this;
        var dataPath = oControl.getDataPath();
        var model = oControl.getModel(oControl.getModelName());
        var rows = this.getRows();
        if(restoreState){
        	for (var i = 0; i < oControl._expandedIndices.length; i++) {
                oControl.expand(oControl._expandedIndices[i]);
            }
        }else{
        	oControl.storeIndices();
        	for (var i = 0; i < oControl._indices.length; i++) {
                oControl.expand(oControl._indices[i]);
            }
        }
    };
    T.prototype._onCollapse = function (oEvent) {
        var oControl = this;
        var dataPath = oControl.getDataPath();
        var model = oControl.getModel(oControl.getModelName());
        var rows = this.getRows();
        for (var i = 0; i < oControl._indices.length; i++) {
            oControl.expand(oControl._indices[i]);
        }
        for (var i = oControl._indices.length - 1; i >= 0; i--) {
            oControl.collapse(oControl._indices[i]);
        }
    };

    //  T.prototype._onToggle = function(oEvent){
    //	  var oControl = this;
    //	  var dataPath = oControl.getDataPath();
    //	  var model = oControl.getModel(oControl.getModelName());
    //	 // var rows = oControl.getModel(oControl.getModelName()).getProperty(dataPath);
    //	  var rows = this.getRows();
    //	  var toggleText =  this._toggleButton.getText();
    //	  oControl.storeIndices();
    //	  if(toggleText === "Expand All"){
    //		  this._toggleButton.setText(this._oBundle.getText("CollapseAll"));
    //		  for(var i=0;i<oControl._indices.length;i++){
    //			  oControl.expand(oControl._indices[i]);
    //		  }
    //	  }else{
    //		  this._toggleButton.setText(this._oBundle.getText("ExpandAll"));
    //		  for(var i=0;i<oControl._indices.length;i++){
    //			  oControl.expand(oControl._indices[i]);
    //		  }
    //		  for(var i=oControl._indices.length-1;i>=0;i--){
    //			  oControl.collapse(oControl._indices[i]);
    //		  }
    //	  }
    //	  
    //	 
    //  };
    T.prototype.storeIndices = function () {
        var oControl = this;
        var dataPath = oControl.getDataPath();
        oControl._indices = [];
        var model = oControl.getModel(oControl.getModelName());
        _.each(model.getProperty(dataPath), function (obj, i) {
            var childNodes = obj['CHILDNODE'];
            var lastIndex = oControl._indices[oControl._indices.length - 1];
            obj['_INDEX'] = lastIndex ? lastIndex + 1 : 0;
            oControl._indices.push(obj['_INDEX']);
            if (obj['CHILDNODE'] && obj['CHILDNODE'].length != 0) {
                oControl._IterateChildNodes(childNodes, obj);
            }
        })

    };
    T.prototype._IterateChildNodes = function (childNodes, parent) {
        var oControl = this;
        //  childNodes = node['CHILDNODE'];
        for (var j = 0; j < childNodes.length; j++) {
            var lastIndex = oControl._indices[oControl._indices.length - 1];
            childNodes[j]['_INDEX'] = lastIndex + 1;
            //childNodes[j]['_INDEX'] = parent['_INDEX']+(j+1);
            oControl._indices.push(childNodes[j]['_INDEX']);
            if (childNodes[j]['CHILDNODE'] && childNodes[j]['CHILDNODE'].length != 0) {
                oControl._IterateChildNodes(childNodes[j]['CHILDNODE'], childNodes[j])
            }
        }
    },
    T.prototype.prepareTable = function () {
        var oControl = this;
        //    if (this.getHandle()) {
        //      var promise = this._fetchVariants();
        //      promise.then(function(result) {
        //        oControl.prepareTableFields();
        //        oControl.prepareTableData();
        //      //              if(result)
        //      //              oControl._applyPersonalization(oControl._columnItems);
        //      });
        //      promise.fail(function(result) {
        //        oControl.prepareTableFields();
        //        oControl.prepareTableData();
        //
        //      });
        //    } else {
        this._oVariants.setVisible(false);
        oControl.prepareTableFields();
        oControl.prepareTableData();
        //}
    };

    T.prototype.setHandle = function (value) {
        if (value) {
            this.setProperty("handle", value, true);
            //          this._fetchVariants();
            this._oVariants.setVisible(true);
        } else {
            this._oVariants.setVisible(false);
        }
        this.showSeparator();
    };

    T.prototype.showSeparator = function () {
        var showTitle = this.getShowTitle();
        var handle = this.getHandle();
        if (showTitle && handle) {
            this._oVuiSeparator.setVisible(true);
        } else {
            this._oVuiSeparator.setVisible(false);
        }
    };

    T.prototype._preProcessOnInputChange = function (oEvent, selection, fieldInfo, fieldPath, refFields) {
        var oControl = this,
          source,
          refPath,
          model,
          refValue,
          propertyName,
          cells,
          fieldRefControl = [],
          field;
        source = oEvent.getSource();

        path = refPath = source.getBindingContext(oControl.getModelName()).getPath();
        model = source.getModel(oControl.getModelName());
        if (fieldInfo['DATATYPE'] === global.vui5.cons.dataType.amount || fieldInfo['DATATYPE'] === global.vui5.cons.dataType.quantity) {
            propertyName = fieldInfo['DATATYPE'] === global.vui5.cons.dataType.amount ? 'CFIELDNAME' : 'QFIELDNAME';
            refPath += "/" + fieldInfo[propertyName];
            refValue = model.getProperty(refPath);
            if (!refValue) {
                propertyName = fieldInfo['DATATYPE'] === global.vui5.cons.dataType.amount ? 'CURRENCY' : 'QUANTITY';
                if (!fieldInfo[propertyName]) {
                    refPath = fieldPath + "/" + propertyName;
                }
            }
        } else if (fieldInfo['DATATYPE'] === global.vui5.cons.dataType.currencyKey ||
          fieldInfo['DATATYPE'] === global.vui5.cons.dataType.unit) {
            refFields = underscoreJS.isArray(refFields) ? refFields : [refFields];
            cells = source.getParent().getCells();
            underscoreJS.each(cells, function (cell) {
                field = underscoreJS.find(refFields, {
                    'FLDNAME': cell.data("FLDNAME")
                });
                if (field) {
                    fieldRefControl.push({
                        'FLDNAME': field['FLDNAME'],
                        'TABNAME': field['TABNAME'],
                        'TXTFL': field['TXTFL'],
                        'CONTROL': cell
                    });
                }
            });

            refPath += '/' + fieldInfo['FLDNAME'];
        }

        if (!oEvent.mParameters) {
            oEvent.mParameters = {};
        }
        oEvent.mParameters['fieldInfo'] = fieldInfo;
        oEvent.mParameters['refPath'] = refPath;
        oEvent.mParameters['dataPath'] = path + "/";
        oEvent.mParameters['refFields'] = refFields;
        oEvent.mParameters['fieldRefControl'] = fieldRefControl;
        oEvent.mParameters['selection'] = selection;
    };
    T.prototype.onChangeUpdateIndicator = function (oEvent) {
        var oControl = this;
        var source = oEvent.getSource();

        var model = source.getModel(oControl.getModelName());
        var path = source.getBindingContext(oControl.getModelName()).getPath();

        var rowLine = model.getProperty(path);
        rowLine.__UPDKZ = 'X';

        model.setProperty(path, rowLine);
    };
    T.prototype._onColumnFreeze = function () {
        var oControl = this;
        oControl._oManualColumnFreeze = true;
    };
    T.prototype.removeSelections = function () {
        this.clearSelection();
    };

    T.prototype.getSelectedItems = function () {
        //      var oControl = this;

        var selectedRows = this.getSelectedIndices();
        //  ESP5 - Generic App Changes - Start
        //        var rows = this.getRows();
        //
        //        var selectedItems = [];
        //
        //        underscoreJS.each(selectedRows, function(selectedRow) {
        //            selectedItems.push(rows[selectedRow]);
        //        });

        var selectedItems = [];
        for (i = 0; i < selectedRows.length; i++) {
            var rowData = this.getContextByIndex(selectedRows[i]).getObject();
            selectedItems.push(rowData);
        }
        //  ESP5 - Generic App Changes - End
        return selectedItems;
    };

    //  T.prototype.triggerChangeEvent = function(selection,field) {
    //  var oControl = this;
    //  if(field['ELTYP'] ==  vui5.cons.element.checkBox ){
    //  if(field['CHEVT'] == 'Y') {
    //  selection.attachSelect(function(oEvent) {
    //  oControl.fireOnFieldChange(oEvent);
    //  });
    //  }else if(field['CHEVT'] == 'X') {
    //  selection.attachSelect(function(oEvent){
    //  oControl.onServerSideChangeEvent(oEvent,field);
    //  });
    //  }
    //  }else{
    //  if(field['CHEVT'] == 'Y') {
    //  selection.attachChange(function(oEvent) {
    //  oControl.fireOnFieldChange(oEvent);
    //  });
    //  }else if(field['CHEVT'] == 'X') {
    //  selection.attachChange(function(oEvent){
    //  oControl.onServerSideChangeEvent(oEvent,field);
    //  });
    //  }
    //  }
    //  };

    //  ESP5 - Generic App Changes - Start
    //  T.prototype.onServerSideChangeEvent = function(source,field){
    //  var oControl = this;
    //  var oController = this.getController();
    ////var source = oEvent.getSource();
    //  var model = source.getModel(oControl.getModelName());
    //  var dataPath = source.getBindingContext(oControl.getModelName()).getPath();

    //  var rowData = model.getProperty(dataPath);

    //  if(field['ELTYP'] == vui5.cons.element.dropDown) {
    //  dataPath = dataPath + "/" + source.getBinding("selectedKey").getPath();
    //  }else if(field['ELTYP'] == vui5.cons.element.checkBox){
    //  dataPath = dataPath + "/" + source.getBinding("selected").getPath();
    //  }else{
    //  dataPath = dataPath + "/" + source.getBinding("value").getPath();
    //  }

    //  if(field['DATATYPE'] != vui5.cons.dataType.amount && field['DATATYPE'] != vui5.cons.dataType.quantity && field['DATATYPE'] != vui5.cons.dataType.decimal ) {
    //  var arr = dataPath.split("/");
    //  dataPath = dataPath.replace(arr[arr.length-1],field['FLDNAME']);
    //  }
    //  var value = model.getProperty(dataPath);
    //  var params = [];

    //  params.push({'NAME' : field['FLDNAME'],VALUE : value});
    //  params.push({'NAME' : 'SECTN', 'VALUE' : oController.clickedTab});
    //  var data = [];
    //  data.push({
    //  "DATA": rowData,
    //  "PARAMS": params,
    //  "DTAREA": "ONCHANGE",
    //  "EVENT": ""
    //  });

    //  $.when(commonUtils.callServer({
    //  data: data,
    //  reqType: vui5.cons.reqType.post
    //  })).then(function (result) {
    //  if(result){
    //  var s = sap.ui.getCore().byId(source.sId);
    //  oController.callBackRead(result,s);
    //  }
    //  });
    //  };
    //  ESP5 - Generic App Changes - End

    T.prototype._onInputChange = function (selection, fieldInfo, fieldPath, refFields) {
        var oControl = this;
        if (fieldInfo['ELTYP'] == vui5.cons.element.checkBox) {
            selection.attachSelect(function (oEvent) {
                //              ESP5 - Generic App Changes - Start
                //              oControl._onInputFieldChange(oEvent, selection, fieldInfo, fieldPath, refFields);
                oControl._preProcessOnInputChange(oEvent, selection, fieldInfo, fieldPath, refFields);
                oControl.processOnInputChange(oEvent);
                //              ESP5 - Generic App Changes - End
            });
        } else if (fieldInfo['ELTYP'] == vui5.cons.element.dropDown) {
            selection.attachSelectionChange(function (oEvent) {
                //              ESP5 - Generic App Changes - Start
                //              oControl._onInputFieldChange(oEvent, selection, fieldInfo, fieldPath, refFields);
                oControl._preProcessOnInputChange(oEvent, selection, fieldInfo, fieldPath, refFields);
                oControl.processOnInputChange(oEvent);
                //              ESP5 - Generic App Changes - End
            });
        } else if (fieldInfo['ELTYP'] !== global.vui5.cons.element.link && fieldInfo['ELTYP'] !== vui5.cons.element.label) {
            selection.attachChange(function (oEvent) {
                //              ESP5 - Generic App Changes - Start
                //              oControl._onInputFieldChange(oEvent, selection, fieldInfo, fieldPath, refFields);
                oControl._preProcessOnInputChange(oEvent, selection, fieldInfo, fieldPath, refFields);
                oControl.processOnInputChange(oEvent);
                //              ESP5 - Generic App Changes - End
            });
        }
    };
    //  ESP5 - Generic App Changes - Start
    //  T.prototype._onInputFieldChange = function(oEvent, selection, fieldInfo, fieldPath, refFields) {
    //  var oController = this.getController();
    //  var oControl = this;

    ////checks
    //  if(fieldInfo['SDSCR'] == vui5.cons.fieldValue.value
    //  || fieldInfo['SDSCR'] == vui5.cons.fieldValue.value_descr) {
    //  if(fieldInfo['INTTYPE'] == vui5.cons.intType.number) {
    //  oController.checkNumericField(oEvent);
    //  }else if(fieldInfo['INTTYPE'] == vui5.cons.intType.packed){
    //  oController.checkPackedField(oEvent);
    //  }else if(fieldInfo['INTTYPE'] == vui5.cons.intType.integer){
    //  oController.checkIntegerField(oEvent);
    //  }
    //  }

    //  var descriptionPromise;
    //  var oSource = oEvent.getSource();
    //  if((fieldInfo['SDSCR'] != vui5.cons.fieldValue.value
    //  && fieldInfo['DATATYPE'] != vui5.cons.dataType.amount
    //  && fieldInfo['DATATYPE'] != vui5.cons.dataType.decimal
    //  && fieldInfo['DATATYPE'] != vui5.cons.dataType.quantity)
    //  || fieldInfo['SCRCHK'] == 'X' ){

    //  var getDescription = '';
    //  if(fieldInfo['SDSCR'] != vui5.cons.fieldValue.value
    //  && fieldInfo['DATATYPE'] != vui5.cons.dataType.amount
    //  && fieldInfo['DATATYPE'] != vui5.cons.dataType.decimal
    //  && fieldInfo['DATATYPE'] != vui5.cons.dataType.quantity){
    //  getDescription = 'X';
    //  }
    //  var checkValue = '';
    //  if(fieldInfo['SCRCHK'] == 'X'){
    //  checkValue = 'X';
    //  }
    //  descriptionPromise = oController.descriptionGet(oSource,oSource.getValue(),getDescription,checkValue);
    //  }


    //  if(descriptionPromise){
    //  descriptionPromise.then(function(){
    //  oControl.handleConversion(oSource, selection, fieldInfo, fieldPath, refFields);
    //  });
    //  }else{
    //  oControl.handleConversion(oSource, selection, fieldInfo, fieldPath, refFields);
    //  }
    //  };

    //  T.prototype.handleConversion = function(oSource, selection, fieldInfo, fieldPath, refFields) {
    //  var oControl = this;

    //  var oController = this.getController();
    //  var conversionPromise;
    //  var path,model, cfield,cells,fields;
    //  if(fieldInfo['DATATYPE'] == vui5.cons.dataType.amount){
    //  selection.data("FLDNAME",fieldInfo['FLDNAME']);
    //  selection.data("TABNAME",fieldInfo['TABNAME']);

    //  path = oSource.getBindingContext(oControl.getModelName()).getPath();
    //  model = oSource.getModel(oControl.getModelName());

    //  path = path + "/" + fieldInfo['CFIELDNAME'];
    //  cfield = model.getProperty(path);
    //  if(cfield == '') {
    //  if(fieldInfo['CURRENCY'] != ''){
    //  path = fieldPath + '/' + 'CURRENCY';
    //  }
    //  }
    //  oSource.data("currencyPath",path);
    //  conversionPromise = oController.performAmountConversion(oSource);
    //  }else if(fieldInfo['DATATYPE'] == vui5.cons.dataType.quantity){
    //  selection.data("FLDNAME",fieldInfo['FLDNAME']);
    //  selection.data("TABNAME",fieldInfo['TABNAME']);

    //  path = oSource.getBindingContext(oControl.getModelName()).getPath();
    //  model = oSource.getModel(oControl.getModelName());

    //  path = path + "/" + fieldInfo['QFIELDNAME'];
    //  cfield = model.getProperty(path);
    //  if(cfield == '') {
    //  if(fieldInfo['QUANTITY'] != ''){
    //  path = fieldPath + '/' + 'QUANTITY';
    //  }
    //  }
    //  oSource.data("unitPath",path);
    //  conversionPromise = oController.performQuantityConversion(oSource);
    //  }else if(fieldInfo['DATATYPE'] == vui5.cons.dataType.currencyKey){

    //  if(!underscoreJS.isArray(refFields))
    //  refFields = [refFields];

    //  path = oSource.getBindingContext(oControl.getModelName()).getPath() + "/";
    //  cells = oSource.getParent().getCells();

    //  fields = [];
    //  underscoreJS.each(cells,function(cell){
    //  var fieldname = cell.data('FLDNAME');
    //  if(fieldname) {
    //  var field = underscoreJS.find(refFields,{ 'FLDNAME' : fieldname });
    //  if(field){
    //  fields.push({
    //  'FLDNAME':field['FLDNAME'],
    //  'TABNAME' : field['TABNAME'],
    //  'TXTFL' : field['TXTFL'],
    //  'CONTROL' : cell});
    //  }
    //  }
    //  });
    //  var currencyPath = path + fieldInfo['FLDNAME'];
    //  conversionPromise = oController.performCurrencyConversion(oSource,fields,path,currencyPath);
    //  }else if(fieldInfo['DATATYPE'] == vui5.cons.dataType.unit){
    //  if(!underscoreJS.isArray(refFields))
    //  refFields = [refFields];

    //  path = oSource.getBindingContext(oControl.getModelName()).getPath() + "/";
    //  cells = oSource.getParent().getCells();

    //  fields = [];
    //  underscoreJS.each(cells,function(cell){
    //  var fieldname = cell.data('FLDNAME');
    //  if(fieldname) {
    //  var field = underscoreJS.find(refFields,{ 'FLDNAME' : fieldname });
    //  if(field){
    //  fields.push({
    //  'FLDNAME':field['FLDNAME'],
    //  'TABNAME' : field['TABNAME'],
    //  'TXTFL' : field['TXTFL'],
    //  'CONTROL' : cell});
    //  }
    //  }
    //  });
    //  var unitPath = path + fieldInfo['FLDNAME'];
    //  conversionPromise = oController.performUnitConversion(oSource,fields,path,unitPath);
    //  }else if(fieldInfo['DATATYPE'] == vui5.cons.dataType.decimal){
    //  selection.data("FLDNAME",fieldInfo['FLDNAME']);
    //  selection.data("TABNAME",fieldInfo['TABNAME']);
    //  conversionPromise = oController.performDecimalConversion(oSource);
    //  }

    //  if(conversionPromise){
    //  conversionPromise.then(function(){
    //  oControl._changeEventTrigger(fieldInfo,oSource);
    //  });
    //  }else{
    //  oControl._changeEventTrigger(fieldInfo,oSource);
    //  }
    //  };

    //  T.prototype._changeEventTrigger = function(fieldInfo,oSource) {
    //  var oControl = this;
    //  if(fieldInfo['CHEVT'] == vui5.cons.changeEventType.clientEvent) {
    //  oControl.fireOnFieldChange(oSource);
    //  }else if(fieldInfo['CHEVT'] == vui5.cons.changeEventType.serverEvent) {
    //  oControl.onServerSideChangeEvent(oSource,fieldInfo);
    //  }
    //  };
    //  ESP5 - Generic App Changes - End
    T.prototype.addRowColor = function () {
        var oControl = this;
        if (sap.ui.getVersionInfo().version >= "1.48") {
            oControl.addRowHighlights();
            return;
        }
    };
    T.prototype.addRowHighlights = function () {
        var oControl = this;
        var model = oControl.getModel(oControl.getModelName());
        var dataPath = oControl.getDataPath();
        var columns = oControl._getVisibleColumns();
        var rows = oControl.getAggregation("rows");

        if (oControl.getDataPath() && columns.length > 0 && rows.length > 0) {
            for (var i = 0; i < rows.length; i++) {

            	var path = rows[i].getBindingContext(oControl.getModelName());
            	var sPath = path ?  path['sPath'] : null;
            	 var rowColor = sPath ? model.getProperty(sPath + "/ROWCOLOR") : null;
            	 var classes = $($(".sapUiTableRowHighlight")[i]).attr("class");
                 if (classes && classes.indexOf("vui_tblrowcolor") !== -1) {
                     var vuiClass = classes.substring(classes.indexOf("vui_tblrowcolor"), classes.length).split(" ")[0];
                     $($(".sapUiTableRowHighlight")[i]).removeClass(vuiClass);
                 }
                 if (classes && classes.indexOf("sapUiTableRowHighlightSuccess") !== -1) {
                     $($(".sapUiTableRowHighlight")[i]).removeClass("sapUiTableRowHighlightSuccess");
                 }
            	if(path && rowColor){
            		 
                     if (rowColor) {
                         var rowClass = "vui_tblrowcolor_" + rowColor;
                         $($(".sapUiTableRowHighlight")[i]).addClass(rowClass);
                     }
            	}
            }
        }
    };
    T.prototype.vuiUpdateBindingContexts = function () {
        var model = this.getModel(this.getModelName());
        var dataPath = this.getDataPath();
        this._vuiUpdateBindingContexts.apply(this, arguments);
        /*** Rel 60E_SP7 - on after rendering not being called to clear selections - Start***/
        this.removeSelections();
        /*** Rel 60E_SP7 - on after rendering not being called to clear selections - End***/
        if (model.getProperty(dataPath) && model.getProperty(dataPath).length > 0) {
        		//&&!this._columnResizeDone
            this.setRenderingDone(false);
            //this._columnResizeDone = true;
//            this.optimizeColumnWidth();
            this.addRowColor();
        }
    };
    T.prototype.optimizeColumnWidth = function () {
        var oControl = this,
            bindingPath,
            fieldInfo,
            optimizeColumn;
        var variant = oControl._oVariants.getSelectionKey();

        var columns = oControl._getVisibleColumns();


        /*Rel 60E SP6 QA #10138 - Start
         * Now we are considering Column Width Optimization in all cases so we are removing the limitations*/
        /*if (oControl.getDataPath() && variant == "*standard*" && !oControl.getEditable() &&*/
        if (oControl.getDataPath() && !oControl.getEditable() &&
            /*Rel 60E SP6 QA #10138 - End*/
            !oControl.getRenderingDone() && columns.length > 0 && oControl.getAggregation("rows").length > 0) {

            oControl.setEnableBusyIndicator(false);
            var model = oControl.getModel(oControl.getModelName());
            this._changingColumnWidth = true;

            //for (var i = 0 ; i < columns.length; i++) {
            for (var i = columns.length - 1; i >= 0; i--) {
                bindingPath = columns[i].getBindingContext(this.getModelName()).sPath;
                fieldInfo = model.getProperty(bindingPath);

                //                optimizeColumn = fieldInfo['DATATYPE'] !== global.vui5.cons.dataType.date &&
                //                  columns[i].getVisible() &&
                //                  fieldInfo['ELTYP'] !== global.vui5.cons.element.dropDown &&
                //                  fieldInfo['ELTYP'] !== global.vui5.cons.element.valueHelp;

                optimizeColumn = true;
                if (optimizeColumn) {
                    oControl.setRenderingDone(true);
                    oControl.autoResizeColumn(i);
                }

            }

            oControl._changingColumnWidth = false;
        }


    };
    T.prototype.prepareTableFields = function () {
        var oControl = this;
        var fieldPath = this.getFieldPath();
        var modelName = this.getModelName();
        var editable = this.getEditable();

        var oController = this.getController();

        var dataAreaPath = this.getDataAreaPath();
        /*** Rel 60E_SP7 - TreeTable Field Grouping - Start***/
        var fieldGroupPath = this.getFieldGroupPath();
        var fields = oControl.getModel(modelName).getProperty(fieldPath);
        /*** Rel 60E_SP7 - TreeTable Field Grouping - End***/
        if (sap.ui.getVersionInfo().version >= "1.48") {
            this.setRowSettingsTemplate(new sap.ui.table.RowSettings({
                highlight: sap.ui.core.MessageType.Success
            }));
        }

        var sectionPath = oControl.getFieldPath().substring(0, oControl.getFieldPath().lastIndexOf("/") - 6);

        /*** Rel 60E_SP7 - TreeTable Field Grouping - Start***/
        if(oControl.isGroupingPresent()){
            this.bindColumns(modelName + ">" + fieldGroupPath, function (sid, oContext) {
                var groupObject = oContext.getObject();
                var path = oContext.getPath();
                var groupTemplate;

                var sortPropertyFieldName;
                var group_fields = groupObject['FLDNAME'] ? underscoreJS.where(fields, { FLDNAME: groupObject['FLDNAME'] }) :
                                                  underscoreJS.where(fields, { FLGRP: groupObject['FLGRP'] });

                var vBox, hBox;
                var template;
                if (group_fields.length != 0) {

                    if (group_fields.length === 1) {
                        var fContext = new sap.ui.model.Context(oControl.getModel(modelName), fieldPath + underscoreJS.findIndex(fields, { FLDNAME: group_fields[0]['FLDNAME'] }));
                        template = oControl.prepareCellTemplate(fContext);
                        sortPropertyFieldName = group_fields[0]['FLDNAME'];
                    }
                    else {

                        var vBox, hBox;
                        vBox = new sap.m.VBox({
                            width: "100%",
                            height: "100%",
                            justifyContent: sap.m.FlexJustifyContent.Inherit,
                            alignItems: sap.m.FlexAlignItems.Center
                        });
                        underscoreJS.each(group_fields, function (field, fieldIndex) {

                            if (!sortPropertyFieldName) {
                                if (field['TXTFL'] != '') {
                                    if (field['SDSCR'] == vui5.cons.fieldValue.value_descr) {
                                        sortPropertyFieldName = field['FLDNAME'];
                                    } else {
                                        sortPropertyFieldName = field['TXTFL'];
                                    }
                                } else {
                                    sortPropertyFieldName = field['FLDNAME'];
                                }
                            }
                            var actualFieldIndex = underscoreJS.findIndex(fields, field);
                            var fieldContext = new sap.ui.model.Context(oControl.getModel(modelName), fieldPath + actualFieldIndex);
                            if (field['ADFLD'] === 'X' && field['FLGRP'] !== '') {
                                return;
                            }
                            hBox = new sap.m.HBox({
                                width: "100%",
                                height: "100%",
                                justifyContent: sap.m.FlexJustifyContent.Inherit,
                                alignItems: sap.m.FlexAlignItems.Start
                            }).addStyleClass("vuiHBoxPaddingBottom");
                            if (!groupObject['FLDNAME'] && !groupObject['HDLBL']) {
                                var fieldLabel = new sap.m.Text({
                                    text: "{" + modelName + ">" + fieldPath + actualFieldIndex + "/LABEL}",
                                    textAlign: sap.ui.core.TextAlign.End,
                                    design: sap.m.LabelDesign.Bold,
                                    visible: "{= ${" + modelName + ">" + fieldPath + actualFieldIndex + "/NO_OUT} === '' &&" +
                                            " ${" + modelName + ">" + fieldPath + actualFieldIndex + "/ADFLD} === ''}"
                                }).addStyleClass("vuibold");
                                fieldLabel.setTextAlign(sap.ui.core.TextAlign.Right);
                                hBox.addItem(fieldLabel);
                                hBox.addItem(new sap.m.Text({
                                    text: ":",
                                    visible: "{= ${" + modelName + ">" + fieldPath + actualFieldIndex + "/NO_OUT} === '' &&" +
                                             " ${" + modelName + ">" + fieldPath + actualFieldIndex + "/ADFLD} === '' }"
                                }).addStyleClass("vuiSmallMarginEnd"));
                            }
                            var controlFields = [field];

                            if (field['CFIELDNAME']) {
                                controlFields.push(underscoreJS.where(fields, { FLDNAME: field['CFIELDNAME'] })[0]);
                            } else if (field['QFIELDNAME']) {
                                controlFields.push(underscoreJS.where(fields, { FLDNAME: field['QFIELDNAME'] })[0]);
                            }

                            for (var i = 0; i < controlFields.length; i++) {
                                controlField = controlFields[i];
                                var fContext = new sap.ui.model.Context(oControl.getModel(modelName), fieldPath + underscoreJS.findIndex(fields, { FLDNAME: controlField['FLDNAME'] }));
                                var fieldInput = oControl.prepareCellTemplate(fContext);
                                fieldInput.bindProperty("visible", {
                                    parts: [{ path: modelName + ">" + fieldPath + actualFieldIndex + "/NO_OUT" }],
                                    formatter: function (no_out) {
                                        return no_out !== 'X';
                                    },
                                    mode: sap.ui.model.BindingMode.TwoWay
                                });
                                hBox.addItem(fieldInput);
                                if (!oControl.getEditable()) break;
                            }
                            vBox.addItem(hBox);
                        });

                        //template = new sap.ui.layout.form.SimpleForm({ content: vBox });
                        template = vBox;
                    }
                }

                var column = new Column({
                    hAlign: sap.ui.core.TextAlign.Left,
                    //minWidth: 200,
                    width: "200px",

                    visible: "{= ${" + modelName + ">" + oContext.getPath() + "/HDGRP} === '' }",
                    label: new Label({
                        //text: contextObject['LABEL']
                        text: "{" + modelName + ">" + path + "/DESCR}",
                        visible: "{= ${" + modelName + ">" + path + "/HDLBL} === '' }",
                    }),
                    template: template,
                    flexible: true,
                    resizable: true,
                    autoResizable: true
                });
                column.data("contextObject", groupObject);
                return column;
            });
        }
        /*** Rel 60E_SP7 - TreeTable Field Grouping - End***/
        else if (modelName && fieldPath && dataAreaPath) {
            //          this.unbindColumns();
            this.bindColumns(modelName + ">" + fieldPath, function (sid, oContext) {

                var contextObject = oContext.getObject();
                var path = oContext.getPath();

                var arr = path.split('/');
                var index = arr[arr.length - 1];

                var fields = oControl.getModel(modelName).getProperty(fieldPath);

                var dataArea = oControl.getModel(modelName).getProperty(oControl.getDataAreaPath());

                var hAlign;
                if (contextObject['FLSTL'] == global.vui5.cons.styleType.icon) {
                    hAlign = sap.ui.core.TextAlign.Center;
                }
                else if (contextObject['INTTYPE'] == vui5.cons.intType.number ||
                  contextObject['INTTYPE'] == vui5.cons.intType.date ||
                  contextObject['INTTYPE'] == vui5.cons.intType.time ||
                  contextObject['INTTYPE'] == vui5.cons.intType.integer ||
                  contextObject['INTTYPE'] == vui5.cons.intType.oneByteInteger ||
                  contextObject['INTTYPE'] == vui5.cons.intType.twoByteInteger ||
                  contextObject['INTTYPE'] == vui5.cons.intType.packed ||
                  contextObject['INTTYPE'] == vui5.cons.intType.float ||
                  contextObject['INTTYPE'] == vui5.cons.intType.decimal16 ||
                  contextObject['INTTYPE'] == vui5.cons.intType.decimal32) {
                    hAlign = sap.ui.core.TextAlign.Right;
                }
                else {
                    hAlign = sap.ui.core.TextAlign.Left;
                }
                var bindingMode;
                var template;
                var func;
                /*** Rel 60E_SP7 - TreeTable Field Grouping - Start***/
                template = oControl.prepareCellTemplate(oContext);
                /*** Rel 60E_SP7 - TreeTable Field Grouping - End***/
//                if (editable) {
//
//
//
//                    fieldEditable =
//                        "{= (${" + global.vui5.modelName + ">/DOCUMENT_MODE} !== 'A' || ${" + oControl.getModelName() + ">" + sectionPath + "EDIT} === 'X' ) &&"
//                        + "((  ${" + modelName + ">EDITABLECELLS} === '' || ${" + modelName + ">" + "EDITABLECELLS}.indexOf('<" + contextObject['FLDNAME'] + ">') === -1 || ${" + modelName + ">" + "EDITABLECELLS}.indexOf('<"
//                        + contextObject['FLDNAME'] + ">') !== -1 ) && "
//                        + "${" + modelName + ">" + path + "/DISABLED} === '') &&"
//                        + "${" + modelName + ">" + "READONLYCOLUMNS}.indexOf('<" + contextObject['FLDNAME'] + ">') === -1}";
//
//                    bindingMode = sap.ui.model.BindingMode.TwoWay;
//
//                    if (contextObject['SETCONTROL'] != undefined && contextObject['SETCONTROL'] != "") {
//                        func = contextObject['SETCONTROL'];
//                        template = func(path);
//                    }
//                    else if (contextObject['FLSTL'] == global.vui5.cons.styleType.icon) {
//                        template = oControl.__createIconControl(contextObject, modelName);
//                    }else {
//
//                        if (contextObject['DATATYPE'] == vui5.cons.dataType.date || contextObject['DATATYPE'] == vui5.cons.dataType.time) {
//                            contextObject['ELTYP'] = vui5.cons.element.input;
//                        }
//
//                        switch (contextObject['ELTYP']) {
//                            case vui5.cons.element.input:
//                                // Dates
//                                if (contextObject['DATATYPE'] == vui5.cons.dataType.date) {
//                                    template = new sap.m.DatePicker({
//                                        displayFormat: "long",
//                                        //*****Rel 60E_SP6
//                                        //valueFormat : "YYYY-MM-dd",
//                                        valueFormat: vui5.cons.date_format,
//                                        //*****
//                                        placeholder: " ",
//                                        change: [oController.dateFieldCheck, oController],
//                                        editable: fieldEditable
//                                    });
//                                    template.bindValue(modelName + ">" + contextObject['FLDNAME'], null, bindingMode);
//                                    template.attachChange(oControl.onChangeUpdateIndicator.bind(oControl));
//                                    //                              oControl.triggerChangeEvent(template,contextObject);
//                                } else if (contextObject['DATATYPE'] == vui5.cons.dataType.time) {
//                                    template = new sap.m.TimePicker({
//                                        valueFormat: "HH:mm:ss",
//                                        displayFormat: "hh:mm:ss a",
//                                        editable: fieldEditable
//                                    });
//                                    template.bindValue(modelName + ">" + contextObject['FLDNAME'], null, bindingMode);
//                                    template.attachChange(oControl.onChangeUpdateIndicator.bind(oControl));
//                                    //                              oControl.triggerChangeEvent(template,contextObject);
//                                    // Amount
//                                } else if (contextObject['DATATYPE'] == vui5.cons.dataType.amount) {
//
//                                    template = new sap.m.Input({
//                                        showValueHelp: false,
//                                        maxLength: parseInt(contextObject['OUTPUTLEN']),
//                                        editable: fieldEditable,
//                                    });
//                                    if (contextObject['TXTFL'] != '') {
//                                        template.bindValue(modelName + ">" + contextObject['TXTFL'], null, bindingMode);
//                                    }
//                                    template.setTextAlign(sap.ui.core.TextAlign.End);
//                                    template.data("FLDNAME", contextObject['FLDNAME']);
//                                    template.attachChange(oControl.onChangeUpdateIndicator.bind(oControl));
//
//
//                                } else if (contextObject['DATATYPE'] == vui5.cons.dataType.quantity) {
//
//                                    template = new sap.m.Input({
//                                        showValueHelp: false,
//                                        maxLength: parseInt(contextObject['OUTPUTLEN']),
//                                        editable: fieldEditable,
//                                    });
//                                    if (contextObject['TXTFL'] != '') {
//                                        template.bindValue(modelName + ">" + contextObject['TXTFL'], null, bindingMode);
//                                    }
//                                    template.setTextAlign(sap.ui.core.TextAlign.End);
//                                    template.data("FLDNAME", contextObject['FLDNAME']);
//                                    template.attachChange(oControl.onChangeUpdateIndicator.bind(oControl));
//
//                                } else if (contextObject['DATATYPE'] == vui5.cons.dataType.decimal) {
//
//                                    template = new sap.m.Input({
//                                        showValueHelp: false,
//                                        maxLength: parseInt(contextObject['OUTPUTLEN']),
//                                        editable: fieldEditable,
//                                    });
//                                    if (contextObject['TXTFL'] != '') {
//                                        template.bindValue(modelName + ">" + contextObject['TXTFL'], null, bindingMode);
//                                    }
//                                    template.setTextAlign(sap.ui.core.TextAlign.End);
//                                    template.data("FLDNAME", contextObject['FLDNAME']);
//                                    template.attachChange(oControl.onChangeUpdateIndicator.bind(oControl));
//                                } else {
//                                    template = new sap.m.Input({
//                                        showValueHelp: false,
//                                        maxLength: parseInt(contextObject['OUTPUTLEN']),
//                                        editable: fieldEditable,
//                                    });
//                                    oControl.setFieldType(
//                                      template,
//                                      contextObject);
//
//                                    oControl.handleDescriptionField(
//                                      template,
//                                      contextObject,
//                                      modelName,
//                                      path,
//                                      dataArea,
//                                      bindingMode,
//                                      editable);
//                                    template.attachChange(oControl.onChangeUpdateIndicator.bind(oControl));
//                                    //                              oControl.triggerChangeEvent(template,contextObject);
//                                }
//                                break;
//                            case vui5.cons.element.valueHelp:
//                                template = new sap.m.Input({
//                                    showValueHelp: true,
//                                    fieldWidth: "100%",
//                                    maxLength: parseInt(contextObject['OUTPUTLEN']),
//                                    editable: fieldEditable,
//                                });
//
//                                oControl.setFieldType(
//                                  template,
//                                  contextObject);
//
//                                oControl.handleDescriptionField(
//                                  template,
//                                  contextObject,
//                                  modelName,
//                                  path,
//                                  dataArea,
//                                  bindingMode,
//                                  editable);
//                                template.data("model", modelName);
//                                template.data("path", path);
//                                template.data("dataArea", dataArea);
//
//                                template.attachValueHelpRequest(oControl.onValueHelpRequest.bind(oControl));
//
//
//                                oControl.bindTypeAheadField(
//                                  template,
//                                  path,
//                                  contextObject);
//                                template.attachChange(oControl.onChangeUpdateIndicator.bind(oControl));
//                                //                          oControl.triggerChangeEvent(template,contextObject);
//                                break;
//                            case vui5.cons.element.dropDown:
//                                //template = new sap.m.ComboBox({
//                                template = new global.vui5.ui.controls.ComboBox({
//                                    editable: fieldEditable,
//                                });
//                                template.bindAggregation("items", vui5.modelName + '>' + "/DROPDOWNS/" + dataArea + "/" + contextObject['FLDNAME'], function (sid, oContext) {
//                                    var contextObject = oContext.getObject();
//                                    return new sap.ui.core.Item({
//                                        key: contextObject['NAME'],
//                                        text: contextObject['VALUE']
//                                    });
//                                });
//                                template.bindProperty("selectedKey", modelName + ">" + contextObject['FLDNAME'], null, bindingMode);
//                                template.attachChange(oControl.onChangeUpdateIndicator.bind(oControl));
//                                //                          oControl.triggerChangeEvent(template,contextObject);
//                                break;
//                            case vui5.cons.element.checkBox:
//                                template = new sap.m.CheckBox({
//                                    select: [oController._onCheckBoxSelect, oController],
//                                    editable: fieldEditable,
//                                    selected: "{= ${" + modelName + ">" + contextObject['FLDNAME'] + "} === 'X' }"
//                                });
//                                template.data("model", modelName);
//                                template.attachSelect(oControl.onChangeUpdateIndicator.bind(oControl));
//                                //                          oControl.triggerChangeEvent(template,contextObject);
//                                break;
//                                //  ESP5 - Generic App Changes - Start
//                            case global.vui5.cons.element.link:
//                            case global.vui5.cons.element.button:
//
//                                //*****Rel 60E_SP6
//                                var enabled = true;
//                                if (contextObject['ELTYP'] === global.vui5.cons.element.button) {
//                                    enabled = "{= ${" + modelName + ">" + "READONLYCOLUMNS}.indexOf('<" + contextObject['FLDNAME'] + ">') === -1 }";
//                                }
//                                //*****
//
//                                var path1 = contextObject['FLDNAME'];
//                                if (contextObject['CFIELDNAME'] == "") {
//
//                                    if ((contextObject['SDSCR'] === global.vui5.cons.fieldValue.description ||
//                                            contextObject['SDSCR'] === global.vui5.cons.fieldValue.value_cont_descr) && contextObject['TXTFL']) {
//                                        path1 = contextObject['TXTFL'];
//                                    }
//                                    var params = {
//                                        press: [oControl.onFieldClick, oControl],
//                                        //*****Rel 60E_SP6
//                                        enabled: enabled
//                                        //*****
//                                    };
//                                    template = contextObject['ELTYP'] == global.vui5.cons.element.link ? new sap.m.Link(params) : new sap.m.Button(params);
//                                    template.bindProperty("text", modelName + ">" + path1, null, sap.ui.model.BindingMode.OneWay);
//                                    //                            
//                                    template.data("fieldname", path1);
//                                    template.data("fieldInfo", contextObject);
//                                } else if (contextObject['CFIELDNAME'] != "") {
//
//                                    var cfieldname;
//                                    var cfield = underscoreJS.find(fields, {
//                                        'FLDNAME': contextObject['CFIELDNAME']
//                                    });
//                                    if (cfield) {
//                                        if (cfield['TXTFL'] != '') {
//                                            cfieldname = cfield['TXTFL'];
//                                        }
//                                        else {
//                                            cfieldname = contextObject['CFIELDNAME'];
//                                        }
//                                    }
//                                    var params = {
//                                        press: [oControl.onFieldClick, oControl],
//                                        text: {
//                                            parts: [{
//                                                path: modelName + ">" + contextObject['TXTFL']
//                                            },
//                                                {
//                                                    path: modelName + ">" + cfieldname
//                                                }],
//                                            mode: bindingMode
//                                        },
//                                        //*****Rel 60E_SP6
//                                        enabled: enabled
//                                        //*****
//                                    }
//                                    template = contextObject['ELTYP'] == global.vui5.cons.element.link ? new sap.m.Link(params) : new sap.m.Button(params);
//
//                                    //                                        template = new sap.m.Link({
//                                    //                                            press: [oControl.onFieldClick, oControl],
//                                    //                                            text: {
//                                    //                                                parts: [{
//                                    //                                                    path: modelName + ">" + contextObject['TXTFL']
//                                    //                                                },
//                                    //                                                    {
//                                    //                                                        path: modelName + ">" + cfieldname
//                                    //                                                    }],
//                                    //                                                mode: bindingMode
//                                    //                                            }
//                                    //                                        });
//
//
//                                    template.data("fieldname", path1);
//                                    template.data("fieldInfo", contextObject);
//                                }
//
//                                //*****Rel 60E_SP6
//                                if (contextObject['ELTYP'] === global.vui5.cons.element.button) {
//                                    template.bindProperty("type", {
//                                        parts: [{ path: modelName + ">" + contextObject['FLDNAME'] },
//                                                { path: modelName + ">" + oContext.getPath() + "/STYLES" }],
//                                        formatter: function (val, styles) {
//                                            var oType = sap.m.ButtonType.Default;
//                                            if (!underscoreJS.isEmpty(styles)) {
//                                                style = underscoreJS.findWhere(styles, { "VALUE": val });
//                                                if (style && style['BTNTP'] == global.vui5.cons.buttonType.accept) {
//                                                    oType = sap.m.ButtonType.Accept;
//                                                }
//                                                else if (style && style['BTNTP'] == global.vui5.cons.buttonType.reject) {
//                                                    oType = sap.m.ButtonType.Reject;
//                                                }
//                                                else if (style && style['BTNTP'] == global.vui5.cons.buttonType.transparent) {
//                                                    oType = oType = sap.m.ButtonType.Transparent;
//                                                }
//                                            }
//
//                                            return oType;
//                                        },
//                                        mode: sap.ui.model.BindingMode.OneWay
//                                    });
//                                }
//
//                                break;
//                                //  ESP5 - Generic App Changes - End
//
//                                //                          default:
//                                //                          template = new Text({
//                                //                          text : "{" + modelName + ">" + contextObject['FLDNAME'] + "}"
//                                //                          });
//                                //                          template.attachChange(oControl.onChangeUpdateIndicator.bind(oControl));
//                                //                          oControl.triggerChangeEvent(template,contextObject);
//
//                        }
//                        var refFields;
//                        if (template) {
//                            if (contextObject['DATATYPE'] == vui5.cons.dataType.currencyKey) {
//                                refFields = underscoreJS.where(fields, {
//                                    'CFIELDNAME': contextObject['FLDNAME']
//                                });
//                                //                              var amountFields = underscoreJS.where(fields,{ 'CFIELDNAME' : contextObject['FLDNAME']});
//                                //                              if(amountFields) {
//                                //                              oControl.handleCurrencyConversion(
//                                //                              template,
//                                //                              amountFields,
//                                //                              contextObject
//                                //                              );
//                                //                              }
//                            } else if (contextObject['DATATYPE'] == vui5.cons.dataType.unit) {
//                                refFields = underscoreJS.where(fields, {
//                                    'QFIELDNAME': contextObject['FLDNAME']
//                                });
//                                //                              var quantityFields = underscoreJS.where(fields,{ 'QFIELDNAME' : contextObject['FLDNAME']});
//                                //                              if(quantityFields) {
//                                ////                            var quantityPath = oContext.getPath() + "/";
//                                //                              oControl.handleUnitConversion(
//                                //                              template,
//                                //                              quantityFields,
//                                //                              contextObject
//                                //                              );
//                                //                              }
//                            }
//                            oControl._onInputChange(template, contextObject, path, refFields);
//                        }
//                    }
//                } else {
//                    // Non Editable Grid
//                    bindingMode = sap.ui.model.BindingMode.OneWay;
//
//                    if (contextObject['SETCONTROL'] != undefined && contextObject['SETCONTROL'] != "") {
//                        func = contextObject['SETCONTROL'];
//                        template = func(path);
//                    } else {
//                        template = oControl.setDisplayFieldColor(contextObject, modelName, dataArea, fields);
//                        if (template && template.setTextAlign) {
//                            template.setTextAlign(hAlign);
//                            //                        	
//                        }
//
//                    }
//
//                    //                    if (contextObject['KEY'] == 'X') {
//                    //                        if (contextObject['DATATYPE'] == vui5.cons.dataType.date) {
//                    //                            template = new sap.m.Label({
//                    //                                text: {
//                    //                                    path: modelName + ">" + contextObject['FLDNAME'],
//                    //                                    mode: bindingMode,
//                    //                                    formatter: Formatter.dateFormat
//                    //                                },
//                    //                                design: sap.m.LabelDesign.Bold
//                    //                            });
//                    //                        } else {
//                    //                            //                          var _fieldNameTemp;
//                    //                            if (contextObject['SDSCR'] == vui5.cons.fieldValue.description
//                    //                                    || contextObject['SDSCR'] == vui5.cons.fieldValue.value_cont_descr) {
//                    //
//                    //                                template = new sap.m.Label({
//                    //                                    text: "{" + modelName + ">" + contextObject['TXTFL'] + "}",
//                    //                                    design: sap.m.LabelDesign.Bold
//                    //                                });
//                    //                            } else if (contextObject['SDSCR'] == vui5.cons.fieldValue.value) {
//                    //                                template = new sap.m.Label({
//                    //                                    text: "{" + modelName + ">" + contextObject['FLDNAME'] + "}",
//                    //                                    design: sap.m.LabelDesign.Bold
//                    //                                });
//                    //                            } else if (contextObject['SDSCR'] == vui5.cons.fieldValue.value_descr) {
//                    //                                template = new sap.m.Label({
//                    //                                    text: {
//                    //                                        parts: [
//                    //                                                 { path: modelName + ">" + contextObject['FLDNAME'] },
//                    //                                                 { path: modelName + ">" + contextObject['TXTFL'] }
//                    //                                        ]
//                    //                                    },
//                    //                                    design: sap.m.LabelDesign.Bold
//                    //                                });
//                    //                            }
//                    //                        }
//                    //                    } else {
//                    //                        switch (contextObject['ELTYP']) {
//                    //                            case vui5.cons.element.dropDown:
//                    //                                //template = new sap.m.ComboBox({
//                    //                                template = new vistex.ui.controls.ComboBox({
//                    //                                    editable: false
//                    //                                });
//                    //                                template.bindAggregation("items", vui5.modelName + '>' + "/DROPDOWNS/" + dataArea + "/" + contextObject['FLDNAME'], function(sid, oContext) {
//                    //                                    var contextObject = oContext.getObject();
//                    //                                    return new sap.ui.core.Item({
//                    //                                        key: contextObject['NAME'],
//                    //                                        text: contextObject['VALUE']
//                    //                                    });
//                    //                                });
//                    //                                template.bindProperty("selectedKey", modelName + ">" + contextObject['FLDNAME'], null, bindingMode);
//                    //                                break;
//                    //                            case vui5.cons.element.checkBox:
//                    //                                template = new sap.m.CheckBox({
//                    //                                    editable: false,
//                    //                                    selected: "{= ${" + modelName + ">" + contextObject['FLDNAME'] + "} === 'X' }"
//                    //                                });
//                    //                                break;
//                    //
//                    //                            default:
//                    //                                if (contextObject['DATATYPE'] == vui5.cons.dataType.amount && contextObject['CFIELDNAME'] != "") {
//                    //                                    var cfieldname;
//                    //                                    var cfield = underscoreJS.find(fields, { 'FLDNAME': contextObject['CFIELDNAME'] });
//                    //                                    if (cfield) {
//                    //                                        if (cfield['TXTFL'] != '')
//                    //                                            cfieldname = cfield['TXTFL'];
//                    //                                        else
//                    //                                            cfieldname = contextObject['CFIELDNAME'];
//                    //                                    }
//                    //
//                    //                                    template = new sap.m.Text({
//                    //                                        text: {
//                    //                                            parts: [
//                    //                                                    { path: modelName + ">" + contextObject['TXTFL'] },
//                    //                                                    { path: modelName + ">" + cfieldname }
//                    //                                            ],
//                    //                                            mode: bindingMode
//                    //                                        }
//                    //                                    });
//                    //                                } else if (contextObject['DATATYPE'] == vui5.cons.dataType.quantity && contextObject['QFIELDNAME'] != "") {
//                    //
//                    //                                    var qfieldname;
//                    //                                    var qfield = underscoreJS.find(fields, { 'FLDNAME': contextObject['QFIELDNAME'] });
//                    //                                    if (qfield) {
//                    //                                        if (qfield['TXTFL'] != '')
//                    //                                            qfieldname = qfield['TXTFL'];
//                    //                                        else
//                    //                                            qfieldname = contextObject['QFIELDNAME'];
//                    //                                    }
//                    //                                    template = new sap.m.Text({
//                    //                                        text: {
//                    //                                            parts: [
//                    //                                                    { path: modelName + ">" + contextObject['TXTFL'] },
//                    //                                                    { path: modelName + ">" + qfieldname }
//                    //                                            ],
//                    //                                            mode: bindingMode
//                    //                                        }
//                    //                                    });
//                    //
//                    //                                } else if (contextObject['DATATYPE'] == vui5.cons.dataType.decimal) {
//                    //                                    template = new sap.m.Text({
//                    //                                        text: {
//                    //                                            parts: [{ path: modelName + ">" + contextObject['TXTFL'] }],
//                    //                                            mode: bindingMode
//                    //                                        }
//                    //                                    });
//                    //
//                    //                                } else if (contextObject['DATATYPE'] == vui5.cons.dataType.date) {
//                    //                                    template = new sap.m.DatePicker({
//                    //                                        displayFormat: "long",
//                    //                                        valueFormat: "YYYY-MM-dd",
//                    //                                        placeholder: " ",
//                    //                                        strictParsing: true,
//                    //                                        editable: false
//                    //                                    });
//                    //                                    template.bindValue(modelName + ">" + contextObject['FLDNAME'], Formatter.dateFormat, bindingMode);
//                    //                                } else if (contextObject['DATATYPE'] == vui5.cons.dataType.time) {
//                    //                                    template = new sap.m.TimePicker({
//                    //                                        valueFormat: "HH:mm:ss",
//                    //                                        displayFormat: "hh:mm:ss a",
//                    //                                        editable: false,
//                    //                                        placeholder: " "
//                    //                                    });
//                    //                                    template.bindValue(modelName + ">" + contextObject['FLDNAME'], Formatter.timeFormatter, bindingMode);
//                    //                                } else {
//                    //                                    if (contextObject['SDSCR'] == vui5.cons.fieldValue.description
//                    //                                            || contextObject['SDSCR'] == vui5.cons.fieldValue.value_cont_descr) {
//                    //                                        template = new sap.m.Text({
//                    //                                            text: "{" + modelName + ">" + contextObject['TXTFL'] + "}"
//                    //                                        });
//                    //                                    } else if (contextObject['SDSCR'] == vui5.cons.fieldValue.value_descr) {
//                    //                                        template = new sap.m.Text({
//                    //                                            text: {
//                    //                                                parts: [
//                    //                                                        { path: modelName + ">" + contextObject['FLDNAME'] },
//                    //                                                        { path: modelName + ">" + contextObject['TXTFL'] }
//                    //                                                ]
//                    //                                            }
//                    //                                        });
//                    //                                    } else {
//                    //                                        template = new sap.m.Text({
//                    //                                            text: "{" + modelName + ">" + contextObject['FLDNAME'] + "}"
//                    //                                        });
//                    //                                    }
//                    //                                }
//                    //                                break;
//                    //                        }
//                    //                    }
//                }

                var fieldname;
                if (contextObject['TXTFL'] != '') {
                    if (contextObject['SDSCR'] == vui5.cons.fieldValue.value_descr) {
                        fieldname = contextObject['FLDNAME'];
                    } else {
                        fieldname = contextObject['TXTFL'];
                    }
                } else {
                    fieldname = contextObject['FLDNAME'];
                }

                var filterOperator;
                if (contextObject['INTTYPE'] == vui5.cons.intType.number ||
                  contextObject['INTTYPE'] == vui5.cons.intType.date ||
                  contextObject['INTTYPE'] == vui5.cons.intType.time ||
                  contextObject['INTTYPE'] == vui5.cons.intType.integer ||
                  contextObject['INTTYPE'] == vui5.cons.intType.oneByteInteger ||
                  contextObject['INTTYPE'] == vui5.cons.intType.twoByteInteger ||
                  contextObject['INTTYPE'] == vui5.cons.intType.packed ||
                  contextObject['INTTYPE'] == vui5.cons.intType.float ||
                  contextObject['INTTYPE'] == vui5.cons.intType.decimal16 ||
                  contextObject['INTTYPE'] == vui5.cons.intType.decimal32) {
                    filterOperator = sap.ui.model.FilterOperator.EQ;
                } else {
                    filterOperator = sap.ui.model.FilterOperator.Contains;
                }


                var visible;
                if (editable) {
                    visible = "{= ${" + modelName + ">" + path + "/NO_OUT} === ''}";
                } else {
                    visible = "{= ${" + modelName + ">" + path + "/NO_OUT} === '' &&"
                      + " ${" + modelName + ">" + path + "/ADFLD} === ''}";
                }
                if (editable) {
                    if (contextObject['NO_OUT'] == ''
                      && contextObject['FRZCL'] == 'X'
                      && !this._oManualColumnFreeze) {
                        oControl.setFixedColumnCount(parseInt(index) + 1);
                    }
                } else {
                    if (contextObject['NO_OUT'] == ''
                      && contextObject['ADFLD'] == ''
                      && contextObject['FRZCL'] == 'X'
                      && !this._oManualColumnFreeze) {
                        oControl.setFixedColumnCount(parseInt(index) + 1);
                    }
                }


                var column = new Column({
                    hAlign: hAlign,
                    //                  width: width + "px",
                    width: "200px",
                    visible: visible, //"{= ${" + modelName + ">" + path + "/TECH} !== 'X' && ${"+ modelName + ">" + path + "/NO_OUT} === ''}",
                    label: new Label({
                        //text : contextObject['LABEL']
                        text: "{" + modelName + ">" + path + "/LABEL}"
                    }),
                    template: template,
                    //                  ESP5 - Generic App Changes - Start
                    //                  sortProperty : fieldname,
                    //                  filterProperty : fieldname,
                    //                  defaultFilterOperator : filterOperator,
                    //                  ESP5 - Generic App Changes - End
                    flexible: true,
                    resizable: true,
                    autoResizable: true
                });

                //              ESP5 - Generic App Changes - Start
                //              var filterItem = underscoreJS.find(oControl._filterItems, {'COLUMNKEY' : contextObject['FLDNAME']});
                //              if(filterItem ){
                //              column.setFiltered(true);
                //              }else{
                //              column.setFiltered(false);
                //              }


                //              var sortItem = underscoreJS.find(oControl._sortItems, {'COLUMNKEY' : contextObject['FLDNAME']});
                //              if(sortItem){
                //              column.setSorted(true);
                //              if(sortItem['OPERATION'] == "Descending") {
                //              column.setSortOrder(sap.ui.table.SortOrder.Descending);
                //              }else
                //              column.setSortOrder(sap.ui.table.SortOrder.Ascending);
                //              }else{
                //              column.setSorted(false);
                //              }
                //              ESP5 - Generic App Changes - End

                var columnItem = underscoreJS.find(oControl._columnItems, {
                    'COLUMNKEY': contextObject['FLDNAME']
                });
                if (columnItem) {
                    oControl._performPersonalization = true;
                }
                //              var columnItem = underscoreJS.find(tableItems,{columnKey : object['FLDNAME']});

                //              if(columnItem) {
                //              if(columnItem.visible != column.getVisible())
                //              column.setVisible(columnItem.visible);

                //              columnsArray[columnItem.index] = column;

                //              if(columnItem.index != column.getIndex()) {
                //              positionChanged = true;
                //              }
                //              }else{
                //              columnsArray[length] = column;
                //              length = length + 1;
                //              }
                return column;
            });
        }
    };

    T.prototype.setDisplayFieldColor = function (contextObject, modelName, dataArea, fields, oContext) {
        var bindingMode = sap.ui.model.BindingMode.OneWay;
        var oControl = this;
        var template;

        if (contextObject['FLSTL'] == vui5.cons.styleType.icon) {
            template = oControl.__createIconControl(contextObject, modelName);
        } else if (contextObject['KEY'] == 'X') {
            template = new sap.m.Label({
                design: sap.m.LabelDesign.Bold
            });


            if (contextObject['ELTYP'] == vui5.cons.element.dropDown) {
                if (contextObject['FLSTL'] == vui5.cons.styleType.color) {
                    template.bindProperty("text", {
                        mode: bindingMode,
                        formatter: function (cellValue, dropDownData) {
                            //Description Formatter
                            cellValue = oControl.__setColor.call(this, dataArea, contextObject, cellValue);
                            cellValue = Formatter.dropdownDescriptionGet.call(this, cellValue, dropDownData);
                            return cellValue;
                        },
                        parts: [{
                            path: modelName + ">" + contextObject['FLDNAME']
                        },
                          {
                              path: vui5.modelName + '>' + "/DROPDOWNS/" + dataArea + "/" + contextObject['FLDNAME']
                          }]
                    });
                } else {
                    template.bindProperty("text", {
                        formatter: Formatter.dropdownDescriptionGet,
                        parts: [{
                            path: modelName + ">" + contextObject['FLDNAME']
                        },
                          {
                              path: vui5.modelName + '>' + "/DROPDOWNS/" + dataArea + "/" + contextObject['FLDNAME']
                          }]
                    });
                }
            }
           else if(contextObject['ELTYP'] == vui5.cons.element.objectStatus){
        	   var metadata,metadataObj,fldname,icon,active,label,state,path1;
		       	    metadata = contextObject['METADATA'];
		       	    metadataObj = JSON.parse(metadata);
		       	   
		       	    fldname = metadataObj['TEXT_FIELD'];
		       	    icon = metadataObj['ICON_FIELD'];
		       	    active = metadataObj['ACTIVE'] == "X" ? true :false;
		       	    label = metadataObj['TITLE_FIELD'];
		       	    state = metadataObj['STATE_FIELD'];
		       	    path1 = contextObject['FLDNAME'];
		       	    if ((contextObject['SDSCR'] === global.vui5.cons.fieldValue.description ||
		       	    		contextObject['SDSCR'] === global.vui5.cons.fieldValue.value_cont_descr) && contextObject['TXTFL']) {
		                       path1 = contextObject['TXTFL'];
		              }
		       	template = new sap.m.ObjectStatus({
		       		active : active
		       	}).bindProperty("text",modelName + ">" + fldname,null,bindingMode)
		       	.bindProperty("icon",modelName + ">"  + icon,null,bindingMode)
		       	.bindProperty("state", modelName + ">" + state, function (val) {
		                       if (val === global.vui5.cons.stateConstants.Error) {
		                       	return sap.ui.core.ValueState.Error;
		                       }
		                       else if(val === global.vui5.cons.stateConstants.Warning){
		                       	return sap.ui.core.ValueState.Information;
		                       	
		                       }else if(val === global.vui5.cons.stateConstants.None){
		                       	return sap.ui.core.ValueState.None;
		                       	
		                       }else if(val === global.vui5.cons.stateConstants.Success){
		                       	return sap.ui.core.ValueState.Success;
		                       }
		                       else{
		                       	return sap.ui.core.ValueState.None;
		                       }
		                       
		                   }, sap.ui.model.BindingMode.OneWay);
		       	
		       	template.data("fieldname", path1);
		           template.data("fieldInfo", contextObject);
		           
		           if(label)
		          	 template.bindProperty('title',modelName + ">" + label,null,bindingMode);
		       	if(active)
		       		template.attachPress(oControl.onFieldClick, oControl);
		         }
                //Hotspot Click Changes - Start

            else if (contextObject['ELTYP'] == global.vui5.cons.element.link || contextObject['ELTYP'] == global.vui5.cons.element.button) {

                //*****Rel 60E_SP6            	
                var enabled = true;
                if (contextObject['ELTYP'] === global.vui5.cons.element.button) {
                    enabled = "{= ${" + modelName + ">" + "READONLYCOLUMNS}.indexOf('<" + contextObject['FLDNAME'] + ">') === -1 }";
                }
                //*****
                if (contextObject['CFIELDNAME'] == "") {
                    path = contextObject['FLDNAME'];
                    if ((contextObject['SDSCR'] === global.vui5.cons.fieldValue.description ||
                            contextObject['SDSCR'] === global.vui5.cons.fieldValue.value_cont_descr) && contextObject['TXTFL']) {
                        path = contextObject['TXTFL'];
                    }
                    var params = {
                        press: [oControl.onFieldClick, oControl],
                        //*****Rel 60E_SP6
                        enabled: enabled
                        //*****
                    };
                    template = contextObject['ELTYP'] == global.vui5.cons.element.link ? new sap.m.Link(params) : new sap.m.Button(params);

                    template.bindProperty("text", modelName + ">" + path, null, sap.ui.model.BindingMode.OneWay);

                    template.data("fieldname", path);
                    template.data("fieldInfo", contextObject);
                } else if (contextObject['CFIELDNAME'] != "") {

                    var cfieldname;
                    var cfield = underscoreJS.find(fields, {
                        'FLDNAME': contextObject['CFIELDNAME']
                    });
                    if (cfield) {
                        if (cfield['TXTFL'] != '') {
                            cfieldname = cfield['TXTFL'];
                        }
                        else {
                            cfieldname = contextObject['CFIELDNAME'];
                        }
                    }

                    var params = {
                        press: [oControl.onFieldClick, oControl],
                        text: {
                            parts: [{
                                path: modelName + ">" + contextObject['TXTFL']
                            },
                                {
                                    path: modelName + ">" + cfieldname
                                }],
                            mode: bindingMode
                        },
                        //*****Rel 60E_SP6
                        enabled: enabled
                        //*****
                    }

                    template = contextObject['ELTYP'] == global.vui5.cons.element.link ? new sap.m.Link(params) : new sap.m.Button(params);

                    template.data("fieldname", path);
                    template.data("fieldInfo", contextObject);
                }

                //*****Rel 60E_SP6
                if (contextObject['ELTYP'] === global.vui5.cons.element.button) {
                    template.bindProperty("type", {
                        parts: [{ path: modelName + ">" + contextObject['FLDNAME'] },
                			    { path: modelName + ">" + oContext.getPath() + "/STYLES" }],
                        formatter: function (val, styles) {
                            var oType = sap.m.ButtonType.Default;
                            if (!underscoreJS.isEmpty(styles)) {
                                style = underscoreJS.findWhere(styles, { "VALUE": val });
                                if (style && style['BTNTP'] == global.vui5.cons.buttonType.accept) {
                                    oType = sap.m.ButtonType.Accept;
                                }
                                else if (style && style['BTNTP'] == global.vui5.cons.buttonType.reject) {
                                    oType = sap.m.ButtonType.Reject;
                                }
                                else if (style && style['BTNTP'] == global.vui5.cons.buttonType.transparent) {
                                    oType = oType = sap.m.ButtonType.Transparent;
                                }
                            }

                            return oType;
                        },
                        mode: sap.ui.model.BindingMode.OneWay
                    });
                }
                //*****

                //Hotspot Click Changes - End


            }
                //Hotspot Click Changes - End
            else if (contextObject['DATATYPE'] == vui5.cons.dataType.date) {
                if (contextObject['FLSTL'] == vui5.cons.styleType.color) {
                    template.bindProperty("text", modelName + ">" + contextObject['FLDNAME'], function (cellValue) {
                        //Date Formatter + current Formatter
                        cellValue = oControl.__setColor.call(this, dataArea, contextObject, cellValue);
                        cellValue = Formatter.dateFormat.call(this, cellValue);
                        return cellValue;
                    }, bindingMode);
                } else {
                    template.bindProperty("text", modelName + ">" + contextObject['FLDNAME'], Formatter.dateFormat, bindingMode);
                }
            } else {
                if (contextObject['SDSCR'] == vui5.cons.fieldValue.description
                  || contextObject['SDSCR'] == vui5.cons.fieldValue.value_cont_descr) {
                    if (contextObject['FLSTL'] == vui5.cons.styleType.color) {
                        template.bindProperty("text", {
                            mode: bindingMode,
                            formatter: function (cellValue, description) {
                                //Description Formatter
                                cellValue = oControl.__setColor.call(this, dataArea, contextObject, cellValue, description, true);
                                return cellValue;
                            },
                            parts: [{
                                path: modelName + ">" + contextObject['FLDNAME']
                            },
                              {
                                  path: modelName + ">" + contextObject['TXTFL']
                              }]
                        });
                    } else {
                        template.bindProperty("text", modelName + ">" + contextObject['TXTFL'], null, bindingMode);
                    }

                } else if (contextObject['SDSCR'] == vui5.cons.fieldValue.value) {

                    oControl.setFieldColor(
                      contextObject,
                      template,
                      "text",
                      modelName + ">" + contextObject['FLDNAME'],
                      bindingMode,
                      fields);

                } else if (contextObject['SDSCR'] == vui5.cons.fieldValue.value_descr) {

                    oControl.setFieldColor(
                      contextObject,
                      template,
                      "text",
                      modelName + ">" + contextObject['FLDNAME'],
                      bindingMode,
                      fields);
                }
            }
        } else {
            switch (contextObject['ELTYP']) {
                case vui5.cons.element.dropDown:

                    template = new sap.m.Text();

                    if (contextObject['FLSTL'] == vui5.cons.styleType.color) {
                        template.bindText({
                            mode: bindingMode,
                            formatter: function (cellValue, dropDownData) {
                                //Description Formatter
                                cellValue = oControl.__setColor.call(this, dataArea, contextObject, cellValue);
                                cellValue = Formatter.dropdownDescriptionGet.call(this, cellValue, dropDownData);
                                return cellValue;
                            },
                            parts: [{
                                path: modelName + ">" + contextObject['FLDNAME']
                            },
                              {
                                  path: vui5.modelName + '>' + "/DROPDOWNS/" + dataArea + "/" + contextObject['FLDNAME']
                              }]
                        });
                    } else {
                        template.bindText({
                            formatter: Formatter.dropdownDescriptionGet,
                            parts: [{
                                path: modelName + ">" + contextObject['FLDNAME']
                            },
                              {
                                  path: vui5.modelName + '>' + "/DROPDOWNS/" + dataArea + "/" + contextObject['FLDNAME']
                              }]
                        });
                    }

                    //                  template = new sap.m.ComboBox({
                    //                  editable: false
                    //                  });
                    //                  template.bindAggregation("items",vui5.modelName + '>' + "/DROPDOWNS/" + dataArea + "/" + contextObject['FLDNAME'],function(sid,oContext){
                    //                  var contextObject = oContext.getObject();
                    //                  return new sap.ui.core.Item({
                    //                  key: contextObject['NAME'],
                    //                  text: contextObject['VALUE']
                    //                  });
                    //                  });

                    //                  if(contextObject['FLSTL'] == vui5.cons.styleType.color){
                    //                  template.bindProperty("selectedKey",modelName + ">" + contextObject['FLDNAME'],function(cellValue){
                    //                  var cellValue = oControl.__setColor.call(this,dataArea,contextObject,cellValue);
                    //                  return cellValue;
                    //                  },bindingMode);
                    //                  }else{
                    //                  template.bindProperty("selectedKey",modelName + ">" + contextObject['FLDNAME'],null,bindingMode);
                    //                  }
                    break;
                case global.vui5.cons.element.objectStatus: 
                    var metadata,metadataObj,fldname,icon,active,label,state,path1;
            	    metadata = contextObject['METADATA'];
            	    metadataObj = JSON.parse(metadata);
            	   
            	    fldname = metadataObj['TEXT_FIELD'];
            	    icon = metadataObj['ICON_FIELD'];
            	    active = metadataObj['ACTIVE'] == "X" ? true :false;
            	    label = metadataObj['TITLE_FIELD'];
            	    state = metadataObj['STATE_FIELD'];
            	    path1 = contextObject['FLDNAME'];
            	    if ((contextObject['SDSCR'] === global.vui5.cons.fieldValue.description ||
            	    		contextObject['SDSCR'] === global.vui5.cons.fieldValue.value_cont_descr) && contextObject['TXTFL']) {
                            path1 = contextObject['TXTFL'];
                   }
            	template = new sap.m.ObjectStatus({
            		active : active
            	}).bindProperty("text",modelName + ">" + fldname,null,bindingMode)
            	.bindProperty("icon",modelName + ">"  + icon,null,bindingMode)
            	.bindProperty("state", modelName + ">" + state, function (val) {
                            if (val === global.vui5.cons.stateConstants.Error) {
                            	return sap.ui.core.ValueState.Error;
                            }
                            else if(val === global.vui5.cons.stateConstants.Warning){
                            	return sap.ui.core.ValueState.Information;
                            	
                            }else if(val === global.vui5.cons.stateConstants.None){
                            	return sap.ui.core.ValueState.None;
                            	
                            }else if(val === global.vui5.cons.stateConstants.Success){
                            	return sap.ui.core.ValueState.Success;
                            }
                            else{
                            	return sap.ui.core.ValueState.None;
                            }
                            
                        }, sap.ui.model.BindingMode.OneWay);
            	
            	template.data("fieldname", path1);
                template.data("fieldInfo", contextObject);
                
                if(label)
               	 template.bindProperty('title',modelName + ">" + label,null,bindingMode);
            	if(active)
            		template.attachPress(oControl.onFieldClick, oControl);
            	
            	   break;
                case vui5.cons.element.checkBox:
                    template = new sap.m.CheckBox({
                        editable: false,
                        selected: "{= ${" + modelName + ">" + contextObject['FLDNAME'] + "} === 'X' }"
                    });
                    break;

                    //Hotspot Click Changes - Start

                case global.vui5.cons.element.link:
                case global.vui5.cons.element.button:

                    //*****Rel 60E_SP6
                    var enabled = true;
                    if (contextObject['ELTYP'] === global.vui5.cons.element.button) {
                        enabled = "{= ${" + modelName + ">" + "READONLYCOLUMNS}.indexOf('<" + contextObject['FLDNAME'] + ">') === -1 }";
                    }
                    //*****
                    path = contextObject['FLDNAME'];

                    if (contextObject['CFIELDNAME'] == "") {
                        if ((contextObject['SDSCR'] === global.vui5.cons.fieldValue.description ||
                                contextObject['SDSCR'] === global.vui5.cons.fieldValue.value_cont_descr) && contextObject['TXTFL']) {
                            path = contextObject['TXTFL'];
                        }
                        var params = {
                            press: [oControl.onFieldClick, oControl],
                            //*****Rel 60E_SP6
                            enabled: enabled
                            //*****
                        };
                        template = contextObject['ELTYP'] == global.vui5.cons.element.link ? new sap.m.Link(params) : new sap.m.Button(params);
                        template.bindProperty("text", modelName + ">" + path, null, sap.ui.model.BindingMode.OneWay);
                        //                   
                        template.data("fieldname", path);
                        template.data("fieldInfo", contextObject);
                    } else if (contextObject['CFIELDNAME'] != "") {

                        var cfieldname;
                        var cfield = underscoreJS.find(fields, {
                            'FLDNAME': contextObject['CFIELDNAME']
                        });
                        if (cfield) {
                            if (cfield['TXTFL'] != '') {
                                cfieldname = cfield['TXTFL'];
                            }
                            else {
                                cfieldname = contextObject['CFIELDNAME'];
                            }
                        }

                        var params = {
                            press: [oControl.onFieldClick, oControl],
                            text: {
                                parts: [{
                                    path: modelName + ">" + contextObject['TXTFL']
                                },
                                    {
                                        path: modelName + ">" + cfieldname
                                    }],
                                mode: bindingMode
                            },
                            //*****Rel 60E_SP6
                            enabled: enabled
                            //*****
                        }
                        template = contextObject['ELTYP'] == global.vui5.cons.element.link ? new sap.m.Link(params) : new sap.m.Button(params);

                        //                        template = new sap.m.Link({
                        //                            press: [oControl.onFieldClick, oControl],
                        //                            text: {
                        //                                parts: [{
                        //                                    path: modelName + ">" + contextObject['TXTFL']
                        //                                },
                        //                                    {
                        //                                        path: modelName + ">" + cfieldname
                        //                                    }],
                        //                                mode: bindingMode
                        //                            }
                        //                        });


                        template.data("fieldname", path);
                        template.data("fieldInfo", contextObject);
                    }

                    //*****Rel 60E_SP6
                    if (contextObject['ELTYP'] === global.vui5.cons.element.button) {
                        template.bindProperty("type", {
                            parts: [{ path: modelName + ">" + contextObject['FLDNAME'] },
                    			    { path: modelName + ">" + oContext.getPath() + "/STYLES" }],
                            formatter: function (val, styles) {
                                var oType = sap.m.ButtonType.Default;
                                if (!underscoreJS.isEmpty(styles)) {
                                    style = underscoreJS.findWhere(styles, { "VALUE": val });
                                    if (style && style['BTNTP'] == global.vui5.cons.buttonType.accept) {
                                        oType = sap.m.ButtonType.Accept;
                                    }
                                    else if (style && style['BTNTP'] == global.vui5.cons.buttonType.reject) {
                                        oType = sap.m.ButtonType.Reject;
                                    }
                                    else if (style && style['BTNTP'] == global.vui5.cons.buttonType.transparent) {
                                        oType = oType = sap.m.ButtonType.Transparent;
                                    }
                                }

                                return oType;
                            },
                            mode: sap.ui.model.BindingMode.OneWay
                        });
                    }
                    //*****
                    //Hotspot Click Changes - End
                    break;

                default:
                    if (contextObject['DATATYPE'] == vui5.cons.dataType.amount && contextObject['CFIELDNAME'] != "") {
                        var cfieldname;
                        var cfield = underscoreJS.find(fields, {
                            'FLDNAME': contextObject['CFIELDNAME']
                        });
                        if (cfield) {
                            if (cfield['TXTFL'] != '')
                                cfieldname = cfield['TXTFL'];
                            else
                                cfieldname = contextObject['CFIELDNAME'];
                        }

                        template = new sap.m.Text();

                        if (contextObject['FLSTL'] == vui5.cons.styleType.color) {
                            template.bindText({
                                mode: bindingMode,
                                formatter: function (cellValue, description) {
                                    cellValue = oControl.__setColor.call(this, dataArea, contextObject, cellValue, description, false, true);
                                    return cellValue;
                                },
                                parts: [{
                                    path: modelName + ">" + contextObject['TXTFL']
                                },
                                  {
                                      path: modelName + ">" + cfieldname
                                  }]
                            });
                        } else {
                            template.bindText({
                                parts: [{
                                    path: modelName + ">" + contextObject['TXTFL']
                                },
                                  {
                                      path: modelName + ">" + cfieldname
                                  }]
                            });
                        }
                    } else if (contextObject['DATATYPE'] == vui5.cons.dataType.quantity && contextObject['QFIELDNAME'] != "") {

                        var qfieldname;
                        var qfield = underscoreJS.find(fields, {
                            'FLDNAME': contextObject['QFIELDNAME']
                        });
                        if (qfield) {
                            if (qfield['TXTFL'] != '')
                                qfieldname = qfield['TXTFL'];
                            else
                                qfieldname = contextObject['QFIELDNAME'];
                        }
                        template = new sap.m.Text();

                        if (contextObject['FLSTL'] == vui5.cons.styleType.color) {
                            template.bindText({
                                mode: bindingMode,
                                formatter: function (cellValue, description) {
                                    cellValue = oControl.__setColor.call(this, dataArea, contextObject, cellValue, description, false, true);
                                    return cellValue;
                                },
                                parts: [{
                                    path: modelName + ">" + contextObject['TXTFL']
                                },
                                  {
                                      path: modelName + ">" + qfieldname
                                  }]
                            });
                        } else {
                            template.bindText({
                                parts: [{
                                    path: modelName + ">" + contextObject['TXTFL']
                                },
                                  {
                                      path: modelName + ">" + qfieldname
                                  }]
                            });
                        }

                    } else if (contextObject['DATATYPE'] == vui5.cons.dataType.decimal ||
                      contextObject['DATATYPE'].substr(0, 3) == vui5.cons.dataType.integer) {

                        template = new sap.m.Text();

                        if (contextObject['FLSTL'] == vui5.cons.styleType.color) {
                            template.bindText({
                                mode: bindingMode,
                                formatter: function (cellValue) {
                                    cellValue = oControl.__setColor.call(this, dataArea, contextObject, cellValue);
                                    return cellValue;
                                },
                                parts: [{
                                    path: modelName + ">" + contextObject['TXTFL']
                                }]
                            });
                        } else {
                            template.bindText({
                                parts: [{
                                    path: modelName + ">" + contextObject['TXTFL']
                                }]
                            });
                        }

                    } else if (contextObject['DATATYPE'] == vui5.cons.dataType.date) {
                        /*template = new sap.m.DatePicker({
                            //displayFormat: "long",
                            //*****Rel 60E_SP6
                            //valueFormat : "YYYY-MM-dd",
                            valueFormat : vui5.cons.date_format,
                            //*****
                            placeholder: " ",
                            strictParsing: true,
                            editable: false
                        });
                        template.bindProperty("displayFormat", vui5.modelName + ">"+ vui5.cons.modelPath.sessionInfo+"/DATFM", Formatter.displayFormat, sap.ui.model.Binding.OneWay);
              
                        if (contextObject['FLSTL'] == vui5.cons.styleType.color) {
                            template.bindValue(modelName + ">" + contextObject['FLDNAME'], function(cellValue) {
                                cellValue = oControl.__setColor.call(this, dataArea, contextObject, cellValue);
                                return cellValue;
                            }, bindingMode);
                        } else {
                            template.bindValue(modelName + ">" + contextObject['FLDNAME'], null, bindingMode);
                        }
                         */
                        template = new sap.m.Text({

                        });
                        if (contextObject['FLSTL'] == vui5.cons.styleType.color) {
                            template.bindText(modelName + ">" + contextObject['FLDNAME'], function (cellValue) {
                                cellValue = oControl.__setColor.call(this, dataArea, contextObject, cellValue);
                                return cellValue;
                            }, bindingMode);
                        } else {
                            template.bindText(modelName + ">" + contextObject['FLDNAME'], Formatter.dateFormat, bindingMode);
                        }

                    } else if (contextObject['DATATYPE'] == vui5.cons.dataType.time) {
                        /* template = new sap.m.TimePicker({
                             valueFormat: "HH:mm:ss",
                             displayFormat: "hh:mm:ss a",
                             editable: false
                         });
                         if (contextObject['FLSTL'] == vui5.cons.styleType.color) {
                             template.bindValue(modelName + ">" + contextObject['FLDNAME'], function(cellValue) {
                                 cellValue = oControl.__setColor.call(this, dataArea, contextObject, cellValue);
                                 return cellValue;
                             }, bindingMode);
                         } else {
                             template.bindValue(modelName + ">" + contextObject['FLDNAME'], null, bindingMode);
                         } */

                        template = new sap.m.Text({
                            type: sap.ui.model.type.Time
                        });
                        if (contextObject['FLSTL'] == vui5.cons.styleType.color) {
                            template.bindText(modelName + ">" + contextObject['FLDNAME'], function (cellValue) {
                                cellValue = oControl.__setColor.call(this, dataArea, contextObject, cellValue);
                                return cellValue;
                            }, bindingMode);
                        } else {
                            template.bindText(modelName + ">" + contextObject['FLDNAME'], null, bindingMode);
                        }

                    } else {

                        template = new sap.m.Text();
                        if (contextObject['SDSCR'] == vui5.cons.fieldValue.description
                          || contextObject['SDSCR'] == vui5.cons.fieldValue.value_cont_descr) {
                            if (contextObject['FLSTL'] == vui5.cons.styleType.color) {
                                template.bindText({
                                    mode: bindingMode,
                                    formatter: function (cellValue, description) {
                                        //Description Formatter
                                        cellValue = oControl.__setColor.call(this, dataArea, contextObject, cellValue, description, true);
                                        return cellValue;
                                    },
                                    parts: [{
                                        path: modelName + ">" + contextObject['FLDNAME']
                                    },
                                      {
                                          path: modelName + ">" + contextObject['TXTFL']
                                      }]
                                });
                            } else {
                                template.bindText(modelName + ">" + contextObject['TXTFL']);
                            }

                        } else if (contextObject['SDSCR'] == vui5.cons.fieldValue.value_descr) {
                            oControl.setFieldColor(
                              contextObject,
                              template,
                              "text",
                              modelName + ">" + contextObject['FLDNAME'],
                              bindingMode,
                              fields);
                        } else {
                            oControl.setFieldColor(
                              contextObject,
                              template,
                              "text",
                              modelName + ">" + contextObject['FLDNAME'],
                              bindingMode,
                              fields);
                        }
                    }
                    break;
            }
        }
        return template;
    };

    T.prototype.__createIconControl = function (fieldInfo, modelName) {
        var oControl = this;

        var dataPath;

        if (fieldInfo['SDSCR'] == vui5.cons.fieldValue.description
          || fieldInfo['SDSCR'] == vui5.cons.fieldValue.value_cont_descr) {
            dataPath = fieldInfo['TXTFL'];
        } else {
            dataPath = fieldInfo['FLDNAME'];
        }

        var template = new sap.ui.core.Icon({
            useIconTooltip: false,
            press: [oControl.onFieldClick, oControl]
        });

        template.bindProperty("tooltip", modelName + ">" + dataPath);

        template.bindProperty("src", modelName + ">" + dataPath, function (value) {
            var bindingContext = this.getBindingContext(oControl.getModelName());
            if (bindingContext) {
                var rowData = bindingContext.getObject();
                if (rowData) {
                    var objectValue = rowData[fieldInfo['FLDNAME']];

                    if (rowData && rowData['READONLYCOLUMNS'].indexOf("<" + dataPath + ">")) {
                        template.detachPress(function (evt) {
                            oController.onFieldClick(evt);
                        });
                    }
                    var iconProperty = underscoreJS.find(fieldInfo['STYLES'], {
                        'VALUE': objectValue
                    });
                    if (iconProperty) {
                        this.addStyleClass('vuisapText' + iconProperty['COLOR']);
                        return iconProperty.ICON;
                    }
                }
            }
            //return "sap-icon://status-positive";
        });
        template.data("fieldname", dataPath);
        template.data("fieldInfo", fieldInfo);
        return template;
    };

    T.prototype.__setColor = function (dataArea, fieldInfo, cellValue, description, descriptionOnly, concatenate) {

        var domRef = this.getDomRef();
        if (domRef) {
            var styleClass = underscoreJS.find(domRef.classList, function (value) {
                return value.indexOf('vuisapText') != -1;
            });
            this.removeStyleClass(styleClass);
        }

        var colorValue = underscoreJS.find(fieldInfo['STYLES'], {
            'VALUE': cellValue
        });
        if (colorValue) {
            this.addStyleClass('vuisapText' + colorValue['COLOR']);
        }

        if (descriptionOnly) {
            return description;
        } else if (concatenate) {
            return cellValue + ' ' + description;
        }
        return cellValue;
    };

    T.prototype.setFieldColor = function (fieldInfo, selection, propertyName, dataPath, bindingMode, fields) {
        var oControl = this;
        if (fieldInfo['FLSTL'] == vui5.cons.styleType.color) {

            if (fieldInfo['STYLES'].length > 0) {

                //              var dataArea = this.getModel(this.getModelName()).getProperty(this.getDataAreaPath());

                selection.bindProperty(propertyName, dataPath, function (cellValue) {
                    var domRef = this.getDomRef();
                    if (domRef) {
                        var styleClass = underscoreJS.find(domRef.classList, function (value) {
                            return value.indexOf('vuisapText') != -1;
                        });
                        this.removeStyleClass(styleClass);
                    }
                    var bindingContext = this.getBindingContext(oControl.getModelName());
                    if (bindingContext) {
                        var rowData = bindingContext.getObject();
                        if (rowData) {
                            var objectValue = rowData[fieldInfo['FLDNAME']];

                            var colorValue = underscoreJS.find(fieldInfo['STYLES'], {
                                'VALUE': objectValue
                            });
                            if (colorValue) {
                                this.addStyleClass('vuisapText' + colorValue['COLOR']);
                            }
                        }
                    }
                    return cellValue;
                }, bindingMode);
            } else {
                var mainFieldInfo = underscoreJS.find(fields, {
                    'TXTFL': fieldInfo['FLDNAME']
                });
                if (mainFieldInfo && mainFieldInfo['STYLES'].length > 0) {

                    //                  var dataArea = this.getModel(this.getModelName()).getProperty(this.getDataAreaPath());

                    selection.bindProperty(propertyName, dataPath, function (cellValue) {
                        var domRef = this.getDomRef();
                        if (domRef) {
                            var styleClass = underscoreJS.find(domRef.classList, function (value) {
                                return value.indexOf('vuisapText') != -1;
                            });
                            this.removeStyleClass(styleClass);
                        }
                        var bindingContext = this.getBindingContext(oControl.getModelName());
                        if (bindingContext) {
                            var rowData = bindingContext.getObject();
                            if (rowData) {
                                var objectValue = rowData[mainFieldInfo['FLDNAME']];
                                var colorValue = underscoreJS.find(mainFieldInfo['STYLES'], {
                                    'VALUE': objectValue
                                });
                                if (colorValue) {
                                    this.addStyleClass('vuisapText' + colorValue['COLOR']);
                                }
                            }
                        }
                        return cellValue;
                    }, bindingMode);
                } else {
                    selection.bindProperty(propertyName, dataPath, null, bindingMode);
                }
            }
        } else {
            selection.bindProperty(propertyName, dataPath, null, bindingMode);
        }
    };

    T.prototype.onFieldClick = function (oEvent) {
        var oControl = this;
        var rowPath = oEvent.getSource().getParent().getBindingContext(oControl.getModelName());
        var rowdata = oControl.getModel(oControl.getModelName()).getProperty(rowPath.sPath);

        var params = {};

        params[vui5.cons.params.selectedRow] = rowdata['ROWID'] || "";
        params[vui5.cons.params.fieldName] = oEvent.getSource().data("fieldname") || "";
        var mainModel = oControl.getProperty("controller").getMainModel();
        mainModel.setProperty(oControl.getExpandedIndicesPath()+oControl.getProperty("sectionID")+"/", oControl._expandedIndices);
        oControl.fireOnFieldClick({
            'urlParams': params,
            'fieldInfo': oEvent.getSource().data("fieldInfo")
        });
    };

    T.prototype.getVuiPaginator = function () {
        return this._VuiPaginator;
    };

    T.prototype.setFieldType = function (selection, fieldInfo) {
        //      var oController = this.getController();
        if (fieldInfo['SDSCR'] == vui5.cons.fieldValue.value
          || fieldInfo['SDSCR'] == vui5.cons.fieldValue.value_descr) {
            if (fieldInfo['INTTYPE'] == vui5.cons.intType.number ||
                //                  fieldInfo['INTTYPE'] == vui5.cons.intType.integer ||
              fieldInfo['INTTYPE'] == vui5.cons.intType.oneByteInteger ||
              fieldInfo['INTTYPE'] == vui5.cons.intType.twoByteInteger ||
                //                  fieldInfo['INTTYPE'] == vui5.cons.intType.packed ||
              fieldInfo['INTTYPE'] == vui5.cons.intType.float ||
              fieldInfo['INTTYPE'] == vui5.cons.intType.decimal16 ||
              fieldInfo['INTTYPE'] == vui5.cons.intType.decimal32) {
                selection.setType(sap.m.InputType.Number);
            }
            //          if(fieldInfo['INTTYPE'] == vui5.cons.intType.number) {
            //          selection.attachChange(oController.checkNumericField.bind(oController));
            //          }else if(fieldInfo['INTTYPE'] == vui5.cons.intType.packed){
            //          selection.attachChange(oController.checkPackedField.bind(oController));
            //          }else if(fieldInfo['INTTYPE'] == vui5.cons.intType.integer){
            //          selection.attachChange(oController.checkIntegerField.bind(oController));
            //          }
        }
    };

    T.prototype.bindTypeAheadField = function (selection, fieldPath, fieldInfo) {
        var oControl = this;
        var oController = this.getController();
        selection.setShowSuggestion(true);
        selection.setFilterSuggests(false);

        if (fieldInfo['INTLEN'] == 1)
            selection.setStartSuggestion(1);
        else
            selection.setStartSuggestion(2);

        selection.setMaxSuggestionWidth("50%");
        selection.attachSuggest(function (oEvent) {
            var source = oEvent.getSource();
            var model = source.getModel(source.data("model"));
            var fieldInfo = model.getProperty(source.data("path"));


            oEvent.mParameters['eventType'] = global.vui5.cons.fieldSubEvent.typeAhead;
            oEvent.mParameters['fieldInfo'] = fieldInfo;
            oEvent.mParameters['fieldValue'] = oEvent.getParameter('suggestValue');
            oEvent.mParameters['oEvent'] = oEvent;
            oEvent.mParameters['rowId'] = oControl._getCurrentRow(oEvent);
            oControl.preProcessFieldEvent(oEvent);

            source.bindAggregation("suggestionColumns", global.vui5.modelName + ">/TYPEAHEAD/" + fieldInfo['FLDNAME'] + "/FIELDS", function (sid, oContext) {
                var contextObject = oContext.getObject();
                return new sap.m.Column({
                    header: new sap.m.Text({
                        text: contextObject['LABEL']
                    })
                });
            });
            source.bindAggregation("suggestionRows", global.vui5.modelName + ">/TYPEAHEAD/" + fieldInfo['FLDNAME'] + "/DATA", function (sid, oContext) {
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



            source.bindAggregation("suggestionColumns", vui5.modelName + ">/TYPEAHEAD/" + fieldInfo['FLDNAME'] + "/FIELDS", function (sid, oContext) {
                var contextObject = oContext.getObject();
                return new sap.m.Column({
                    header: new sap.m.Text({
                        text: contextObject['LABEL']
                    })
                });
            });
            source.bindAggregation("suggestionRows", vui5.modelName + ">/TYPEAHEAD/" + fieldInfo['FLDNAME'] + "/DATA", function (sid, oContext) {
                var contextObject = oContext.getObject();
                var model = oControl.getModel(vui5.modelName);
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



        });
        //selection.attachSuggestionItemSelected(oControl.handleSuggestionItemSelected.bind(oController));

        selection.data("model", oControl.getModelName());
        selection.data("path", fieldPath);


    };

    //  T.prototype.handleAmountConversion =  function(selection,amountField,fieldPath) {
    //  var oController = this.getController();
    //  selection.data("FLDNAME",amountField['FLDNAME']);
    //  selection.data("TABNAME",amountField['TABNAME']);
    //  var oControl = this;
    //  selection.attachChange(function(oEvent){
    //  var path = oEvent.getSource().getBindingContext(oControl.getModelName()).getPath();
    //  var model = oEvent.getSource().getModel(oControl.getModelName());
    //  path = path + "/" + amountField['CFIELDNAME'];
    //  var cfield = model.getProperty(path);
    //  if(cfield == '') {
    //  if(amountField['CURRENCY'] != ''){
    //  path = fieldPath + '/' + amountField['CURRENCY'];
    //  }
    //  }
    //  oEvent.getSource().data("currencyPath",path);
    //  oController.handleAmountConversion(oEvent);
    //  });
    //  };
    //  T.prototype.handleQuantityConversion =  function(selection,quantityField,fieldPath) {
    //  var oController = this.getController();
    //  selection.data("FLDNAME",quantityField['FLDNAME']);
    //  selection.data("TABNAME",quantityField['TABNAME']);
    //  var oControl = this;
    //  selection.attachChange(function(oEvent){
    //  var path = oEvent.getSource().getBindingContext(oControl.getModelName()).getPath();
    //  var model = oEvent.getSource().getModel(oControl.getModelName());
    //  path = path + "/" + quantityField['QFIELDNAME'];
    //  var cfield = model.getProperty(path);
    //  if(cfield == '') {
    //  if(quantityField['QUANTITY'] != ''){
    //  path = fieldPath + '/' + quantityField['QUANTITY'];
    //  }
    //  }
    //  oEvent.getSource().data("unitPath",path);
    //  oController.handleQuantityConversion(oEvent);
    //  });
    //  };
    //  T.prototype.handleCurrencyConversion = function(selection,amountFields,currencyField) {
    //  if(!underscoreJS.isArray(amountFields))
    //  amountFields = [amountFields];
    //  var oControl = this;
    //  var oController = this.getController();
    //  selection.attachChange(function(oEvent) {
    //  var path = oEvent.getSource().getBindingContext(oControl.getModelName()).getPath() + "/";
    //  var cells = oEvent.getSource().getParent().getCells();
    //  var fields = [];
    //  underscoreJS.each(cells,function(cell){
    //  var fieldname = cell.data('FLDNAME');
    //  if(fieldname) {
    //  var field = underscoreJS.find(amountFields,{ 'FLDNAME' : fieldname });
    //  if(field){
    //  fields.push({
    //  'FLDNAME':field['FLDNAME'],
    //  'TABNAME' : field['TABNAME'],
    //  'TXTFL' : field['TXTFL'],
    //  'CONTROL' : cell});
    //  }
    //  }
    //  });
    //  var currencyPath = path + currencyField['FLDNAME'];
    //  oController.handleCurrencyConversion(oEvent,fields,path,currencyPath);
    //  });
    //  };
    //  T.prototype.handleUnitConversion = function(selection,quantityFields,unitField) {
    //  if(!underscoreJS.isArray(quantityFields))
    //  quantityFields = [quantityFields];
    //  var oControl = this;
    //  var oController = this.getController();
    //  selection.attachChange(function(oEvent) {
    //  var path = oEvent.getSource().getBindingContext(oControl.getModelName()).getPath() + "/";
    //  var cells = oEvent.getSource().getParent().getCells();
    //  var fields = [];
    //  underscoreJS.each(cells,function(cell){
    //  var fieldname = cell.data('FLDNAME');
    //  if(fieldname) {
    //  var field = underscoreJS.find(quantityFields,{ 'FLDNAME' : fieldname });
    //  if(field){
    //  fields.push({
    //  'FLDNAME':field['FLDNAME'],
    //  'TABNAME' : field['TABNAME'],
    //  'TXTFL' : field['TXTFL'],
    //  'CONTROL' : cell});
    //  }
    //  }
    //  });
    //  var unitPath = path + unitField['FLDNAME'];
    //  oController.handleUnitConversion(oEvent,fields,path,unitPath);
    //  });
    //  },
    T.prototype.handleSuggestionItemSelected = function (oEvent) {
        var oControl = this;
        var mainModel = oControl.getProperty("controller").getMainModel();
        var source = oEvent.getSource();
        var model = source.getModel(source.data("model"));
        var fieldInfo = model.getProperty(source.data("path"));
        var item = oEvent.getParameter("selectedRow");
        var rowData = item.getBindingContext(vui5.modelName).getObject();
        var returnField = mainModel.getProperty("/TYPEAHEAD/" + fieldInfo['FLDNAME'] + "/RETURNFIELD");
        var descrField = mainModel.getProperty("/TYPEAHEAD/" + fieldInfo['FLDNAME'] + "/DESCRFIELD");
        source.setValue(rowData[returnField]);
        /*Description Buffer Changes*/
        if (descrField && descrField != '') {
            var descriptionBuffer = mainModel.getProperty("/DESCRIPTION_BUFFER");
            var bufferEntry = underscoreJS.find(descriptionBuffer, {
                'FLDNAME': fieldInfo['FLDNAME'],
                'TABNAME': fieldInfo['TABNAME'],
                'FLDVAL': rowData[returnField]
            });
            if (bufferEntry) {
                bufferEntry['DESCRIPTION'] = rowData[descrField];
            } else {
                descriptionBuffer.push({
                    'FLDNAME': fieldInfo['FLDNAME'],
                    'TABNAME': fieldInfo['TABNAME'],
                    'FLDVAL': rowData[returnField],
                    'DESCRIPTION': rowData[descrField]
                });
            }
        }
        source.fireChange();
    };

    T.prototype.handleDescriptionField = function (selection, fieldInfo, modelName, fieldPath, dataArea, bindingMode, editable) {
        //      var oController = this.getController();
        var descriptionPath;
        if (fieldInfo['SDSCR'] == vui5.cons.fieldValue.description
          || fieldInfo['SDSCR'] == vui5.cons.fieldValue.value_cont_descr) {

            descriptionPath = fieldInfo['TXTFL'];
            selection.bindValue(modelName + ">" + descriptionPath, null, bindingMode);

            if (editable) {
                selection.data("model", modelName);
                selection.data("path", fieldPath);
                selection.data("dataArea", dataArea);
                //              selection.attachChange(oController.getDescription.bind(oController));
            }

            selection.setMaxLength(60);
        } else if (fieldInfo['SDSCR'] == vui5.cons.fieldValue.value_descr) {
            selection.bindValue(modelName + ">" + fieldInfo['FLDNAME'], null, bindingMode);
            if (editable) {
                selection.data("model", modelName);
                selection.data("path", fieldPath);
                selection.data("dataArea", dataArea);
                //              selection.attachChange(oController.getDescription.bind(oController));
            }
        } else {
            selection.bindValue(modelName + ">" + fieldInfo['FLDNAME'], null, bindingMode);
        }
    },

    T.prototype.prepareTableData = function () {
        var oControl = this;
        var dataPath = this.getDataPath();
        var modelName = this.getModelName();
        var VuifieldPath = this.getFieldPath();

        if (modelName && dataPath && VuifieldPath) {

            jQuery.sap.delayedCall(500, oControl, oControl.bindRows, [modelName + ">" + dataPath]);

            //            this.bindRows(modelName + ">" + dataPath);
        }
    };

    T.prototype.createPersonalizationDialog = function () {
        var oDialog = new global.vui5.ui.controls.PersonalizationDialog();
        oDialog.onHandlePersonalizationOk = function (oEvent) {
            oControl.handlePersonalizationOk(oEvent);
        };
        oDialog.onHandlePersonalizationClose = function (oEvent) {
            oControl.handleClose(oEvent);
        };
        oDialog.onHandlePersonalizationReset = function (oEvent) {
            oControl.handleReset(oEvent);
        };
        this._PersonalizationDialog = oDialog.getAggregation("_p13nDialog");
        this._addPanel(this._PersonalizationDialog);
        this.addDependent(this._PersonalizationDialog);

        var _sContentDensityClass;
        if (!sap.ui.Device.support.touch) {
            _sContentDensityClass = "sapUiSizeCompact";
        } else {
            _sContentDensityClass = "sapUiSizeCozy";
        }

        jQuery.sap.syncStyleClass(_sContentDensityClass, this, this._PersonalizationDialog);
    };

    T.prototype._onSettingPressed = function () {
        //      var oControl = this;

        if (!this._PersonalizationDialog) {
            this.createPersonalizationDialog();
        } else {
            /* User might change column position, to accomodate those changes */
            this.addColumnPanelItems();
        }

        //      ESP5 - Generic App Changes - Start
        //      /* user can chnage the sort criteria, to accomodate those changes */
        //      this.fillSortItems();

        //      /* Prepare Filter Panel FilterItems*/
        //      this.fillFilterPanelItem(false);
        //      ESP5 - Generic App Changes - End

        this.currentVaraintModified = this._oVariants.currentVariantGetModified();

        this.fillPersonalizationItems();
        this._PersonalizationDialog.open();
    };

    /* Add Columns, Sort , Filter and Group Panel and their respective items to Dialog*/
    T.prototype._addPanel = function (dialog) {

        var oControl = this;
        var columns = this.getModel(this.getModelName()).getProperty(this.getFieldPath());

        /* Column Panel*/
        this._columnPanel = new sap.m.P13nColumnsPanel({
            title: this._oBundle.getText("Columns"),
            visible: true,
            type: "columns",
            changeColumnsItems: this.updateColumnsItems.bind(this)
        });
        this.addColumnPanelItems();

        dialog.addPanel(this._columnPanel);

        //      ESP5 - Generic App Changes - Start
        //      /* Sort Panel*/
        //      this._sortPanel = new sap.m.P13nSortPanel({
        //      title:bundle.getText("Sort"),
        //      visible:false,
        //      type:"sort",
        //      containerQuer:true,
        //      layoutMode:"Desktop",
        //      addSortItem : this.addSortItem.bind(this),
        //      removeSortItem : this.removeSortItem.bind(this),
        //      updateSortItem : this.updateSortItem.bind(this)
        //      });

        //      underscoreJS.each(columns,function(object) {
        //      oControl._sortPanel.addItem(new sap.m.P13nItem({
        //      columnKey: object['FLDNAME'],
        //      text: object['LABEL']
        //      }));
        //      });

        //      dialog.addPanel(this._sortPanel);

        //      /* Filter Panel*/
        //      this._filterPanel = new sap.m.P13nFilterPanel({
        //      title:bundle.getText("Filter"),
        //      visible: true,
        //      type:"filter",
        //      containerQuer:true,
        //      layoutMode:"Desktop",
        //      addFilterItem : this.addFilterItem.bind(this),
        //      removeFilterItem: this.removeFilterItem.bind(this),
        //      updateFilterItem:this.updateFilterItem.bind(this)
        //      });
        //      underscoreJS.each(columns,function(object) {
        //      var type;
        //      if(object['INTTYPE'] == vui5.cons.intType.number ||
        //      object['INTTYPE'] == vui5.cons.intType.time ||
        //      object['INTTYPE'] == vui5.cons.intType.integer ||
        //      object['INTTYPE'] == vui5.cons.intType.oneByteInteger ||
        //      object['INTTYPE'] == vui5.cons.intType.twoByteInteger ||
        //      object['INTTYPE'] == vui5.cons.intType.packed ||
        //      object['INTTYPE'] == vui5.cons.intType.float ||
        //      object['INTTYPE'] == vui5.cons.intType.decimal16 ||
        //      object['INTTYPE'] == vui5.cons.intType.decimal32){
        //      type = 'numeric';
        //      }else if(object['INTTYPE'] == vui5.cons.intType.date){
        //      type = 'date';
        //      }else {
        //      type = 'string';
        //      }
        //      oControl._filterPanel.addItem(new sap.m.P13nItem({
        //      columnKey: object['FLDNAME'],
        //      text: object['LABEL'],
        //      type : type
        //      }));
        //      });
        //      dialog.addPanel(this._filterPanel);
        //      ESP5 - Generic App Changes - End
        /*Grouping Changes*/
        //      this._groupPanel = new sap.m.P13nGroupPanel({
        //      maxGroups : '1',
        //      title:bundle.getText("Group"),
        //      visible: true,
        //      type:"group",
        //      containerQuer:true,
        //      layoutMode:"Desktop",
        //      addGroupItem:this.addGroupItem.bind(this),
        //      removeGroupItem:this.removeGroupItem.bind(this)
        //      });
        //      this._groupPanel.setMaxGroups(1);
        //      this._groupPanel.addItem(new sap.m.P13nItem({
        //      columnKey: "",
        //      text: bundle.getText("none")
        //      }));
        //      underscoreJS.each(columns,function(object) {
        //      oControl._groupPanel.addItem(new sap.m.P13nItem({
        //      columnKey: object['FLDNAME'],
        //      text: object['LABEL']
        //      }));
        //      });
        //      dialog.addPanel(this._groupPanel);
    },

    T.prototype.addColumnPanelItems = function () {

        var oControl = this;
        var tableColumns = this.getColumns();

        oControl._columnPanel.removeAllColumnsItems();
        oControl._columnPanel.removeAllItems();

        underscoreJS.each(tableColumns, function (column) {

            var object = column.getBindingContext(oControl.getModelName()).getObject();
            var visible;
            visible = column.getVisible();
            var position = oControl.indexOfColumn(column);

            oControl._columnPanel.addColumnsItem(new sap.m.P13nColumnsItem({
                columnKey: object['FLDNAME'],
                index: position,
                visible: visible
            }));

            oControl._columnPanel.addItem(new sap.m.P13nItem({
                columnKey: object['FLDNAME'],
                text: object['LABEL'],
                visible: visible
            }));
        });
    };
    //  ESP5 - Generic App Changes - Start
    //  T.prototype.fillSortItems = function(){
    //  var oControl = this;
    //  var tableColumns = this.getColumns();

    //  oControl._sortPanel.removeAllSortItems();
    //  underscoreJS.each(tableColumns,function(column) {
    //  if(column.getSorted()){
    //  var object = column.getBindingContext(oControl.getModelName()).getObject();

    //  oControl._sortPanel.addSortItem(new sap.m.P13nSortItem({
    //  operation : column.getSortOrder(),
    //  columnKey : object['FLDNAME']
    //  }));
    //  }
    //  });
    //  };
    //  ESP5 - Generic App Changes - End
    //  T.prototype.fillGroupItems = function(){
    //  var oControl = this;
    //  var tableColumns = this.getColumns();

    //  oControl._groupPanel.removeAllGroupItems();
    //  underscoreJS.each(tableColumns,function(column) {
    //  if(column.getGrouped()){
    //  var object = column.getBindingContext(oControl.getModelName()).getObject();

    //  oControl._groupPanel.addGroupItem(new sap.m.P13nGroupItem({
    //  columnKey : object['FLDNAME']
    //  }));
    //  }
    //  });
    //  };

    T.prototype.fillPersonalizationItems = function (tableItems, onlyFilter) {
        var oControl = this;
        var filterItems;
        if (!onlyFilter) {
            if (tableItems) {
                this._columnItems = [];
                underscoreJS.each(tableItems, function (column) {
                    oControl._columnItems.push({
                        'COLUMNKEY': column.columnKey,
                        'INDEX': column.index,
                        'VISIBLE': column.visible
                    });
                });
            } else {
                var columns = this._columnPanel.getColumnsItems();
                this._columnItems = [];
                underscoreJS.each(columns, function (column) {
                    oControl._columnItems.push({
                        'COLUMNKEY': column.mProperties.columnKey,
                        'INDEX': column.mProperties.index,
                        'VISIBLE': column.mProperties.visible
                    });
                });
            }
            //          ESP5 - Generic App Changes - Start
            //          var sortItems = this._sortPanel.getSortItems();
            //          this._sortItems = [];
            //          underscoreJS.each(sortItems,function(obj) {
            //          oControl._sortItems.push({
            //          'COLUMNKEY' : obj.mProperties.columnKey,
            //          'OPERATION' : obj.mProperties.operation
            //          });
            //          });

            //          filterItems = this._filterPanel.getFilterItems();
            //          this._filterItems = [];
            //          underscoreJS.each(filterItems,function(obj) {
            //          var exclude = false;
            //          if(obj.mProperties.exclude)
            //          exclude = true;

            //          oControl._filterItems.push({
            //          'COLUMNKEY' : obj.mProperties.columnKey,
            //          'OPERATION' : obj.mProperties.operation,
            //          'VALUE1' :  obj.mProperties.value1,
            //          'VALUE2' :  obj.mProperties.value2,
            //          'EXCLUDE' :  exclude
            //          });
            //          });
            //          ESP5 - Generic App Changes - End

        }
        //      ESP5 - Generic App Changes - Start
        //      else{
        //      filterItems = this._filterPanel1.getFilterItems();
        //      this._filterItems = [];
        //      underscoreJS.each(filterItems,function(obj) {
        //      var exclude = false;
        //      if(obj.mProperties.exclude)
        //      exclude = true;

        //      oControl._filterItems.push({
        //      'COLUMNKEY' : obj.mProperties.columnKey,
        //      'OPERATION' : obj.mProperties.operation,
        //      'VALUE1' :  obj.mProperties.value1,
        //      'VALUE2' :  obj.mProperties.value2,
        //      'EXCLUDE' :  exclude
        //      });
        //      });
        //      }
        //      ESP5 - Generic App Changes - End

        /* Grouping Changes*/
        //      var groupItems = this._groupPanel.getGroupItems();
        //      this._groupItems = [];
        //      underscoreJS.each(groupItems,function(obj) {
        //      oControl._groupItems.push(obj.mProperties);
        //      });
    };

    T.prototype.handleClose = function (oEvent) {

        var oDialog = oEvent.getSource();

        var oControl = this;
        oControl._columnPanel.removeAllColumnsItems();
        underscoreJS.each(this._columnItems, function (item) {
            oControl._columnPanel.addColumnsItem(new sap.m.P13nColumnsItem({
                columnKey: item['COLUMNKEY'],
                index: item['INDEX'],
                visible: item['VISIBLE']
            }));
        });
        //      ESP5 - Generic App Changes - Start
        //      oControl._sortPanel.removeAllSortItems();
        //      underscoreJS.each(this._sortItems,function(item) {
        //      oControl._sortPanel.addSortItem(new sap.m.P13nSortItem({
        //      columnKey: item['COLUMNKEY'],
        //      operation: item['OPERATION']
        //      }));
        //      });
        //      oControl._filterPanel.removeAllFilterItems();
        //      underscoreJS.each(this._filterItems,function(item) {
        //      oControl._filterPanel.addFilterItem(new sap.m.P13nFilterItem({
        //      columnKey: item['COLUMNKEY'],
        //      operation: item['OPERATION'],
        //      value1 : item['VALUE1'],
        //      value2 : item['VALUE2'],
        //      exclude : item['EXCLUDE']
        //      }));
        //      });
        //      ESP5 - Generic App Changes - End

        /* Grouping Changes*/
        //      oControl._groupPanel.removeAllGroupItems();
        //      underscoreJS.each(this._groupItems,function(item) {
        //      oControl._groupPanel.addGroupItem(new sap.m.P13nGroupItem({
        //      columnKey : item.columnKey,
        //      operation : item.operation,
        //      showIfGrouped : item.showIfGrouped
        //      }));
        //      });
        this._oVariants.currentVariantSetModified(this.currentVaraintModified);
        oDialog.close();
    };

    T.prototype.handleReset = function () {
        var oControl = this;
        var variant = this._oVariants.getSelectionKey();
        if (variant != "*standard*") {
            this.fetchVariantData(variant, false, false);
        } else {
            this._columnPanel.removeAllColumnsItems();
            var columns = this.getModel(this.getModelName()).getProperty(this.getFieldPath());

            var editable = oControl.getEditable();

            underscoreJS.each(columns, function (object, index) {
                var visible;

                if (editable) {
                    if (object['NO_OUT'] == '') {
                        visible = true;
                    } else {
                        visible = false;
                    }
                } else {
                    if (object['NO_OUT'] != '' || object['ADFLD'] != '') {
                        visible = false;
                    } else {
                        visible = true;
                    }
                }

                oControl._columnPanel.addColumnsItem(new sap.m.P13nColumnsItem({
                    columnKey: object['FLDNAME'],
                    index: index, //object['POSTN'],
                    visible: visible
                }));
            });

            //          ESP5 - Generic App Changes - Start
            //          this._sortPanel.removeAllSortItems();
            //          this._filterPanel.removeAllFilterItems();
            //          ESP5 - Generic App Changes - End

            /* Grouping Changes*/
            //          this._groupPanel.removeAllGroupItems();
        }
        this._oVariants.currentVariantSetModified(false);
    },


    T.prototype.handlePersonalizationOk = function (event) {
        //      var oControl = this;
        //      var oBinding = oControl.getBinding("rows");
        var tableItems = event.getParameter("payload").columns.tableItems;
        this.fillPersonalizationItems(tableItems, false);

        this._applyPersonalization(this._columnItems, false);
        this._PersonalizationDialog.close();
    },
    //  ESP5 - Generic App Changes - Start
    //  T.prototype.addSortItem = function(oEvent) {
    //  this._sortPanel.addSortItem(oEvent.getParameter("sortItemData"));
    //  this._oVariants.currentVariantSetModified(true);
    //  };
    //  T.prototype.removeSortItem = function(oEvent) {
    //  var index = oEvent.getParameter("index");
    //  var item = this._sortPanel.getSortItems()[index];
    //  this._sortPanel.removeSortItem(item);
    //  this._oVariants.currentVariantSetModified(true);
    //  };
    //  T.prototype.updateSortItem = function() {
    //  this._oVariants.currentVariantSetModified(true);
    //  };
    //  T.prototype.addFilterItem = function(oEvent) {
    //  var filterPanel = oEvent.getSource();
    //  filterPanel.addFilterItem(oEvent.getParameter("filterItemData"));
    //  this._oVariants.currentVariantSetModified(true);
    //  };
    //  T.prototype.removeFilterItem = function(oEvent) {
    //  var filterPanel = oEvent.getSource();
    //  var index = oEvent.getParameter("index");
    //  var item = filterPanel.getFilterItems()[index];
    //  filterPanel.removeFilterItem(item);
    //  this._oVariants.currentVariantSetModified(true);
    //  };
    //  T.prototype.updateFilterItem = function() {
    //  this._oVariants.currentVariantSetModified(true);
    //  };
    //  T.prototype.updateColumnsItems = function(){
    //  this._oVariants.currentVariantSetModified(true);
    //  };
    //  ESP5 - Generic App Changes - End

    //  T.prototype.addGroupItem = function(oEvent) {
    //  this._groupPanel.addGroupItem(oEvent.getParameter("groupItemData"));
    //  this._oVariants.currentVariantSetModified(true);
    //  };
    //  T.prototype.removeGroupItem = function(oEvent) {
    //  var index = oEvent.getParameter("index");
    //  var item = this._groupPanel.getGroupItems()[index];
    //  this._groupPanel.removeGroupItem(item);
    //  this._oVariants.currentVariantSetModified(true);
    //  };
    //  T.prototype.updateGroupItem = function(oEvent) {
    //  this._oVariants.currentVariantSetModified(true);
    //  };


    T.prototype._onFilterTable = function (event) {
        var value = event.getParameter("query");
        this.filterTable(value);
    },

    T.prototype.filterTable = function (value) {

        var binding = this.getBinding("rows");

        if (value != "" && value != undefined) {
            var mainModel = this.getModel(this.getModelName());
            var fields = mainModel.getProperty(this.getFieldPath());

            var filter = [];
            underscoreJS.each(fields, function (field) {
                var sPath;
                if (field) {
                    if (field['SDSCR'] != vui5.cons.fieldValue.value && field['SDSCR'] != vui5.cons.fieldValue.value_descr) {
                        sPath = field['TXTFL'];
                    } else {
                        sPath = field['FLDNAME'];
                    }
                }
                if (field['INTTYPE'] != vui5.cons.intType.packed)
                    filter.push(new Filter(sPath, sap.ui.model.FilterOperator.Contains, value));
            });
            binding.filter(new Filter(filter, false), sap.ui.model.FilterType.Application);
        } else {
            binding.filter();
        }
    };

    T.prototype._initializeVariants = function () {
        var oControl = this;

        this._oVariants = new sap.ui.comp.variants.VariantManagement({
            enabled: true,
            showShare: true,
            save: oControl._onVariantSave.bind(oControl),
            manage: oControl._onVariantManage.bind(oControl),
            select: oControl._onVariantSelect.bind(oControl),
            visible: false
        });

        this._oVariants.bVariantItemMode = true;
        this._oVariants._setStandardText();

        /*Over Riding Tooltip*/
        this._oVariants.oVariantPopoverTrigger.setTooltip(oControl._oBundle.getText('SelectVariant'));
        /**/
        var model = new JSONModel();

        var data = {
            "DATA": [],
            "HANDLE": "",
            "SELECTEDVARIANT": []
        };
        model.setData(data);
        this._oVariants.setModel(model, "VUI_VARIANTS");

        this._oVariants.bindAggregation("variantItems", "VUI_VARIANTS>/DATA", function (sId, oContext) {
            var object = oContext.getObject();
            var global;

            if (object['UNAME'] != "") {
                global = false;
            } else {
                global = true;
            }

            return new VariantItem({
                text: {
                    path: "VUI_VARIANTS>DESCR",
                    mode: sap.ui.model.BindingMode.OneWay
                },
                key: {
                    path: "VUI_VARIANTS>VARID",
                    mode: sap.ui.model.BindingMode.OneWay
                },
                global: global
            });
        });
    };


    T.prototype._fetchVariants = function () {
        //      ESP5 - Generic App Changes - Start
        //      var deffered = $.Deferred();

        //      var oControl = this;
        //      var variantModel = oControl._oVariants.getModel("VUI_VARIANTS");
        //      var params = [];
        //      params.push({"NAME": "OBJTP", "VALUE": vui5.cons.applnObject});
        //      params.push({"NAME": "APPLN", "VALUE": vui5.cons.application});
        //      params.push({"NAME": "HANDLE", "VALUE": oControl.getHandle()});

        //      var data = [];
        //      data.push({
        //      "DATA": [],
        //      "PARAMS": params,
        //      "DTAREA": "CVARIANT",
        //      "EVENT": "READ"
        //      });

        //      $.when(commonUtils.callServer({
        //      data: data,
        //      reqType: vui5.cons.reqType.post
        //      })).then(function(result){
        //      if(result){
        //      var response = underscoreJS.findWhere(result, { DTAREA : "CVARIANT" , EVENT: "READ"});
        //      if(response && response['RESULT']){
        //      variantModel.setProperty("/DATA", response['RESULT']['DATA']);

        //      var defaultVariant =underscoreJS.find(response['RESULT']['DATA'],{'DEFLT' : 'X'});
        //      if(defaultVariant) {
        //      oControl._oVariants.setDefaultVariantKey(defaultVariant['VARID']);
        //      oControl._oVariants._setSelectionByKey(defaultVariant['VARID']);

        ////    oControl._oVariants.fireSelect({ 'VARIANT' : defaultVariant });
        //      var promise = oControl._onVariantSelect1(false);
        //      promise.then(function(){
        //      deffered.resolve(true);
        //      });
        //      }else{
        //      deffered.resolve(false);
        //      }
        //      }
        //      }
        //      });

        //      return deffered.promise();
        var oControl = this,
          oController,
          variantModel,
          params = {},
          action,
          objDefer,
          setStandardAsDefault,
          defaultVariant,
          objConfig;
        objDefer = $.Deferred();
        oController = oControl.getProperty("controller");
        variantModel = oControl._oVariants.getModel("VUI_VARIANTS");
        params[vui5.cons.params.handle] = oControl.getHandle();

        action = {
            "FNCNM": vui5.cons.eventName.controlVariantsRead,
            "RQTYP": vui5.cons.reqTypeValue.get
        };
        objConfig = {
            method: action['RQTYP'] === vui5.cons.reqTypeValue.post ? vui5.cons.reqType.post : vui5.cons.reqType.get,
            action: action['FNCNM'],
            actionRef: action,
            urlParams: params,
            sectionId: oControl.getProperty("sectionID"),
            context: oController.currentRoute,
            hideLoader: false
        };

        oController.processServerEvent(objConfig).then(function (response) {
            variantModel.setProperty("/DATA", response['DATA']);
            setStandardAsDefault = response['SET_STANDARD_AS_DEFAULT'];
            if (setStandardAsDefault) {
                objDefer.reject();
            } else {
                defaultVariant = underscoreJS.find(response['DATA'], {
                    'DEFLT': 'X'
                });
                if (defaultVariant) {
                    oControl._oVariants.setDefaultVariantKey(defaultVariant['VARID']);
                    oControl._oVariants._setSelectionByKey(defaultVariant['VARID']);

                    oControl._onVariantSelect1(false).then(function () {
                        objDefer.resolve();
                    }).fail(function () {
                        objDefer.reject();
                    });
                    ;

                } else {
                    objDefer.reject();
                }
            }

        });

        return objDefer.promise();
        //      ESP5 - Generic App Changes - End
    };

    T.prototype._onVariantSave = function (oEvent) {

        var variantModel = this._oVariants.getModel("VUI_VARIANTS");

        var overwrite = '';
        if (oEvent.getParameter("overwrite"))
            overwrite = 'X';

        var global = oEvent.getParameter("global");
        if (!global)
            global = false;

        var header;
        if (overwrite == 'X') {
            var variantList = variantModel.getProperty("/DATA");
            header = underscoreJS.find(variantList, {
                'VARID': oEvent.getParameter("key")
            });
            header['UPDKZ'] = vui5.cons.updkz.upd;
        } else {
            header = {};
            header['VARID'] = oEvent.getParameter("key");
            header['DESCR'] = oEvent.getParameter("name");
            header['OBJTP'] = vui5.cons.applnObject;
            header['APPLN'] = vui5.cons.application;
            header['UPDKZ'] = vui5.cons.updkz.ins;

            var defaultVar = oEvent.getParameter("def");

            if (defaultVar == true)
                header['DEFLT'] = 'X';
            else if (defaultVar == false)
                header['DEFLT'] = '';
        }

        this.saveVariant(header, overwrite, global);
    };

    T.prototype.saveVariant = function (headerData, overwrite, global) {

        var oControl = this;
        //      ESP5 - Generic App Changes - START
        var params = {},
          oController,
          action,
          objConfig,
          variantData;
        oController = oControl.getProperty("controller");
        variantData = {
            'NEWVARIANTS': []
        };
        //      ESP5 -Generic App Changes - End
        var variantModel = oControl._oVariants.getModel("VUI_VARIANTS");
        var overwrite_properties = '';
        if (overwrite == 'X')
            overwrite_properties = 'X';

        var saveData = {};
        headerData['HANDLE'] = oControl.getHandle();
        saveData.HEADER = headerData;

        oControl.prepareVariantsData(saveData);

        //      saveData.COLUMNITEMS = this.allKeysToUpperCase(this._columnItems);
        //      saveData.SORTITEMS = this.allKeysToUpperCase(this._sortItems);
        //      saveData.FILTERITEMS = this.allKeysToUpperCase(this._filterItems);
        //      saveData.GROUPITEMS = this.allKeysToUpperCase(this._groupItems);

        saveData.GROUPITEMS = [];
        //      ESP5 - Generic App Changes - START
        //      var params = [];
        //      params.push({"NAME": "OVERWRITE","VALUE": overwrite});
        //      params.push({"NAME": "OVERWRITE_PROP", "VALUE": overwrite_properties});
        //      params.push({"NAME": "GLOBAL", "VALUE": global});

        //      var data = [];
        //      data.push({
        //      "DATA": saveData,
        //      "PARAMS": params,
        //      "DTAREA": "CVARIANT",
        //      "EVENT": "SAVE"
        //      });
        //      params = [];
        //      params.push({ "NAME": "OBJTP", "VALUE": vui5.cons.applnObject });
        //      params.push({ "NAME": "APPLN", "VALUE": vui5.cons.application });
        //      params.push({ "NAME": "HANDLE", "VALUE": oControl.getHandle() });

        //      data.push({
        //      "DATA": [],
        //      "PARAMS": params,
        //      "DTAREA": "CVARIANT",
        //      "EVENT": "READ"
        //      });

        //      $.when(commonUtils.callServer({
        //      data: data,
        //      reqType: vui5.cons.reqType.post
        //      })).then(function(result){
        //      if(result){
        ////    oControl.test = false;
        ////    oControl._oVariantManagement.removeAllVariantItems();
        //      var response = underscoreJS.findWhere(result, { DTAREA : "CVARIANT" , EVENT: "READ"});
        //      if(response && response['RESULT']){
        //      variantModel.setProperty("/DATA", response['RESULT']['DATA']);
        //      }
        //      }
        //      });
        saveData.GROUPITEMS = [];
        variantData['NEWVARIANTS'] = saveData;
        params[vui5.cons.params.overwrite] = overwrite;
        params[vui5.cons.params.overwrite_properties] = overwrite_properties;
        params[vui5.cons.params.global] = global;
        params[vui5.cons.params.handle] = oControl.getHandle();

        action = {
            "FNCNM": vui5.cons.eventName.controlVariantsSave,
            "RQTYP": vui5.cons.reqTypeValue.post
        };

        objConfig = {
            method: action['RQTYP'] === vui5.cons.reqTypeValue.post ? vui5.cons.reqType.post : vui5.cons.reqType.get,
            action: action['FNCNM'],
            actionRef: action,
            urlParams: params,
            sectionId: oControl.getProperty("sectionID"),
            context: oController.currentRoute,
            hideLoader: false,
            data: variantData
        };

        oController.processServerEvent(objConfig).then(function (response) {
            variantModel.setProperty("/DATA", response['DATA']);
        });
        //      ESP5 -Generic App Changes - End
    };
    T.prototype.onChangeUpdateIndicator = function (oEvent) {
        var oControl = this;
        var source = oEvent.getSource();

        var model = source.getModel(oControl.getModelName());
        var path = source.getBindingContext(oControl.getModelName()).getPath();

        var rowLine = model.getProperty(path);
        rowLine.__UPDKZ = 'X';

        model.setProperty(path, rowLine);
    };
    T.prototype._onVariantManage = function (oEvent) {

        var oControl = this;
        //      ESP5 - Generic App Changes - Start
        var oController,
          variantData,
          params = {};
        oController = oControl.getProperty("controller");
        variantData = {
            UPDATEVARIANTS: [],
            DELETEVARIANTS: []
        };
        //      ESP5 - Generic App Changes - End
        var variantModel = oControl._oVariants.getModel("VUI_VARIANTS");

        var deleted = oEvent.getParameter("deleted");
        var renamed = oEvent.getParameter("renamed");

        var defaultVariant = oEvent.getParameter("def");

        var variantList = variantModel.getProperty("/DATA");
        var item;
        var overwriteItems = [];
        if (renamed.length > 0) {
            underscoreJS.each(renamed, function (renamedItem) {
                item = underscoreJS.find(variantList, {
                    'VARID': renamedItem.key
                });
                if (item) {
                    item.DESCR = renamedItem.name;
                    item.UPDKZ = vui5.cons.updkz.upd;
                    overwriteItems.push(item);
                }
            });
        }

        if (defaultVariant != '') {
            var variant = underscoreJS.find(variantList, {
                'VARID': defaultVariant
            });
            if (variant) {
                if (variant['UNAME'] == "") {
                    underscoreJS.each(variantList, function (obj) {
                        if (obj['VARID'] != variant['VARID']) {
                            item = underscoreJS.find(overwriteItems, {
                                'VARID': obj.VARID
                            });
                            if (item) {
                                item.DEFLT = '';
                            } else {
                                obj.DEFLT = '';
                                obj.UPDKZ = vui5.cons.updkz.upd;
                                overwriteItems.push(obj);
                            }
                        }
                    });
                } else {
                    underscoreJS.each(variantList, function (obj) {
                        if (obj['VARID'] != variant['VARID'] && obj['UNAME'] != "") {
                            item = underscoreJS.find(overwriteItems, {
                                'VARID': obj.VARID
                            });
                            if (item) {
                                item.DEFLT = '';
                            } else {
                                obj.DEFLT = '';
                                obj.UPDKZ = vui5.cons.updkz.upd;
                                overwriteItems.push(obj);
                            }
                        }
                    });
                }

                item = underscoreJS.find(overwriteItems, {
                    'VARID': defaultVariant
                });
                if (item) {
                    item.DEFLT = 'X';
                    item.UPDKZ = vui5.cons.updkz.upd;
                } else {
                    variant.DEFLT = 'X';
                    variant.UPDKZ = vui5.cons.updkz.upd;
                    overwriteItems.push(variant);
                }
            } else {
                underscoreJS.each(variantList, function (obj) {
                    if (obj['VARID'] != defaultVariant && obj['UNAME'] != "") {
                        item = underscoreJS.find(overwriteItems, {
                            'VARID': obj.VARID
                        });
                        if (item) {
                            item.DEFLT = '';
                        } else {
                            obj.DEFLT = '';
                            obj.UPDKZ = vui5.cons.updkz.upd;
                            overwriteItems.push(obj);
                        }
                    }
                });
            }
        }
        /*Global Variant Changes-START*/
        var markStandardAsDefault;
        if (defaultVariant == "*standard*") {
            markStandardAsDefault = 'X';
        }
        /*Global Variant Changes-END*/
        var data = [];
        if (deleted.length > 0) {
            var deletedItems = [];
            underscoreJS.each(deleted, function (value) {
                var item = underscoreJS.findWhere(variantList, {
                    "VARID": value
                });
                if (item) {
                    deletedItems.push(item);
                }
                var overwriteItem = underscoreJS.find(overwriteItems, {
                    'VARID': value
                });
                if (overwriteItem) {
                    overwriteItems.pop(overwriteItem);
                }
            });
            //          ESP5 - Generic App Changes - Start
            //          data.push({
            //          "DATA": deletedItems,
            //          "PARAMS": [],
            //          "DTAREA": "CVARIANT",
            //          "EVENT": "DELETE"
            //          });
            variantData['DELETEVARIANTS'] = deletedItems;
            //          ESP5 - Generic App Changes - End
        }

        var params = [];
        if (overwriteItems.length > 0) {
            //          ESP5 - Generic App Changes - Start
            //          params = [];
            //          params.push({"NAME" : "OVERWRITE" , "VALUE" : "X"});
            //          data.push({
            //          "DATA": overwriteItems,
            //          "PARAMS": params,
            //          "DTAREA": "CVARIANT",
            //          "EVENT": "SAVE"
            //          });
            params[vui5.cons.params.overwrite] = 'X';
            params[vui5.cons.params.handle] = oControl.getHandle();
            params[vui5.cons.params.markStandardAsDefault] = markStandardAsDefault

            variantData['UPDATEVARIANTS'] = overwriteItems;
            //          ESP5 - Generic App Changes - End
        }

        //      ESP5 - Generic App Changes - Start
        //      if(data.length > 0) {
        //      params = [];
        //      params.push({ "NAME": "OBJTP", "VALUE": vui5.cons.applnObject});
        //      params.push({ "NAME": "APPLN", "VALUE": vui5.cons.application });
        //      params.push({ "NAME": "HANDLE", "VALUE": oControl.getHandle() });

        //      data.push({
        //      "DATA": [],
        //      "PARAMS": params,
        //      "DTAREA": "CVARIANT",
        //      "EVENT": "READ"
        //      });
        //      data.push({
        //      "DATA": [],
        //      "PARAMS": [],
        //      "DTAREA": vui5.cons.dataarea.messages,
        //      "EVENT": vui5.cons.event.read
        //      });

        //      $.when(commonUtils.callServer({
        //      data: data,
        //      reqType: vui5.cons.reqType.post
        //      })).then(function(result){
        //      if(result){
        //      var response = underscoreJS.findWhere(result, { DTAREA : "CVARIANT" , EVENT: "READ"});
        //      if(response && response['RESULT']['DATA']){
        //      variantModel.setProperty("/DATA", response['RESULT']['DATA']);
        //      }
        //      response = underscoreJS.findWhere(result, { DTAREA : vui5.cons.dataarea.messages , EVENT: vui5.cons.event.read});
        //      if(response && response['RESULT']['MESSAGES_DATA'].length > 0){
        //      sap.m.MessageToast.show(response['RESULT']['MESSAGES_DATA']['0']['MSGLI']);
        //      }
        //      }
        //      });
        //      }
        if (underscoreJS.isEmpty(variantData['DELETEVARIANTS']) && underscoreJS.isEmpty(variantData['UPDATEVARIANTS'])) {
            return;
        }

        action = {
            "FNCNM": vui5.cons.eventName.controlVariantMaintain,
            "RQTYP": vui5.cons.reqTypeValue.post
        };

        objConfig = {
            method: action['RQTYP'] === vui5.cons.reqTypeValue.post ? vui5.cons.reqType.post : vui5.cons.reqType.get,
            action: action['FNCNM'],
            actionRef: action,
            urlParams: params,
            sectionId: oControl.getProperty("sectionID"),
            context: oController.currentRoute,
            hideLoader: false,
            data: variantData
        };

        oController.processServerEvent(objConfig).then(function (response) {
            if (response) {
                variantModel.setProperty("/DATA", response['DATA']);
            }

        });
        //      ESP5 - Generic App Changes - End
    };

    T.prototype._onVariantSelect = function () {
        //      var variant = oEvent.getParameter("key");
        this._onVariantSelect1(true);
    };

    T.prototype._onVariantSelect1 = function (applyPersonalization) {
        if (!this._PersonalizationDialog) {
            this.createPersonalizationDialog();
        }

        var variant = this._oVariants.getSelectionKey();
        return this.fetchVariantData(variant, applyPersonalization, false);
    };

    T.prototype.fetchVariantData = function (variant, applyPersonalization, onlyFilter) {
        //      ESP5 - Generic App Changes - Start
        //      var deffered = $.Deferred();
        //      var oControl = this;
        //      var variantModel = oControl._oVariants.getModel("VUI_VARIANTS");
        //      variantModel.setProperty("/SELECTEDVARIANT",variant);

        //      var variantList = variantModel.getProperty("/DATA");
        //      var varHeader = underscoreJS.findWhere(variantList,{"VARID": variant});
        //      if(varHeader){
        //      var data = [];
        //      data.push({
        //      "DATA": varHeader,
        //      "PARAMS": [],
        //      "DTAREA": "CVARIANT",
        //      "EVENT": "SELECTION_GET"
        //      });

        //      $.when(commonUtils.callServer({
        //      data: data,
        //      reqType: vui5.cons.reqType.post
        //      })).then(function(result){
        //      if(result){
        //      var response = underscoreJS.findWhere(result, { DTAREA : "CVARIANT" , EVENT: "SELECTION_GET"});
        //      if(response && response['RESULT']){

        //      if(!onlyFilter){
        //      oControl._columnItems = response['RESULT']['COLUMNITEMS'];
        //      oControl._sortItems = response['RESULT']['SORTITEMS'];
        //      }
        //      oControl._filterItems = response['RESULT']['FILTERITEMS'];
        ////    oControl._groupItems = response['RESULT']['GROUPITEMS'];
        //      oControl.updatePersonalizationItems(applyPersonalization,onlyFilter);


        //      deffered.resolve();
        //      }
        //      }
        //      });
        //      }else if(variant == "*standard*"){
        //      if(!onlyFilter){
        //      this.handleReset();
        //      }else {
        //      this.handleFilterReset();
        //      }
        //      oControl.fillPersonalizationItems(undefined,onlyFilter);
        //      oControl._applyPersonalization(oControl._columnItems,onlyFilter);

        //      deffered.resolve();
        //      }

        //      return deffered.promise();
        var objDefer = $.Deferred();
        var oControl = this,
          params = {},
          action,
          oController,
          objConfig;
        oController = oControl.getProperty("controller");
        var variantModel = oControl._oVariants.getModel("VUI_VARIANTS");
        variantModel.setProperty("/SELECTEDVARIANT", variant);

        var variantList = variantModel.getProperty("/DATA");
        var varHeader = underscoreJS.findWhere(variantList, {
            "VARID": variant
        });

        if (varHeader) {

            action = {
                "FNCNM": vui5.cons.eventName.controlVariantDataRead,
                "RQTYP": vui5.cons.reqTypeValue.get
            };
            objConfig = {
                method: action['RQTYP'] === vui5.cons.reqTypeValue.post ? vui5.cons.reqType.post : vui5.cons.reqType.get,
                action: action['FNCNM'],
                actionRef: action,
                urlParams: params,
                sectionId: oControl.getProperty("sectionID"),
                context: oController.currentRoute,
                hideLoader: false,
                data: varHeader
            };

            oController.processServerEvent(objConfig).then(function (response) {
                if (response) {
                    //                  ESP5 - Generic App Changes - Start
                    //                  if (!onlyFilter) {
                    //                  oControl._columnItems = response['COLUMNITEMS'];
                    //                  oControl._sortItems = response['SORTITEMS'];
                    //                  }
                    //                  oControl._filterItems = response['FILTERITEMS'];
                    oControl._columnItems = response['COLUMNITEMS'];
                    //ESP5 - Generic App Changes - End
                    oControl.updatePersonalizationItems(applyPersonalization, onlyFilter);
                    objDefer.resolve();
                }

            });
        } else if (variant === vui5.cons.variant.standard) {
            if (!onlyFilter) {
                oControl.handleReset();
            } else {
                oControl.handleFilterReset();
            }

            oControl.setRenderingDone(false);

            oControl.fillPersonalizationItems(undefined, onlyFilter);
            oControl._applyPersonalization(oControl._columnItems, onlyFilter);
            objDefer.resolve();

        }

        return objDefer.promise();
        //      ESP5 - Generic App Changes - End
    };


    T.prototype.updatePersonalizationItems = function (applyPersonalization, onlyFilter) {

        var oControl = this;
        //      this._groupPanel.removeAllGroupItems();

        //      Column List Items
        var exclude;
        if (!onlyFilter) {

            this._columnPanel.removeAllColumnsItems();
            //ESP5 - Generic App Changes - Start
            //            this._sortPanel.removeAllSortItems();
            //            this._filterPanel.removeAllFilterItems();
            //ESP5 - Generic App Changes - End

            underscoreJS.each(oControl._columnItems, function (object) {
                var visible;
                if (object['VISIBLE'] == "true") {
                    visible = true;
                } else {
                    visible = false;
                }
                oControl._columnPanel.addColumnsItem(new sap.m.P13nColumnsItem({
                    columnKey: object['COLUMNKEY'],
                    index: object['INDEX'],
                    visible: visible
                }));
            });
            //          ESP5 - Generic App Changes - Start
            ////          Sort Items
            //            underscoreJS.each(oControl._sortItems,function(object){
            //                oControl._sortPanel.addSortItem(new sap.m.P13nSortItem({
            //                    columnKey: object['COLUMNKEY'],
            //                    operation: object['OPERATION']
            //                }));
            //            });
            //
            ////          Filter Items
            //            underscoreJS.each(oControl._filterItems,function(object){
            //                if(object['EXCLUDE'] == "true"){
            //                    exclude = true;
            //                }else{
            //                    exclude = false;
            //                }
            //                oControl._filterPanel.addFilterItem(new sap.m.P13nFilterItem({
            //                    columnKey: object['COLUMNKEY'],
            //                    operation: object['OPERATION'],
            //                    value1: object['VALUE1'],
            //                    value2: object['VALUE2'],
            //                    exclude: exclude
            //                }));
            //            });
            //          ESP5 - Generic App Changes - End
        }
        //      ESP5 - Generic App Changes - Start
        //        else{
        //            this._filterPanel1.removeAllFilterItems();
        //
        //            underscoreJS.each(oControl._filterItems,function(object){
        //                if(object['EXCLUDE'] == "true"){
        //                    exclude = true;
        //                }else{
        //                    exclude = false;
        //                }
        //                oControl._filterPanel1.addFilterItem(new sap.m.P13nFilterItem({
        //                    columnKey: object['COLUMNKEY'],
        //                    operation: object['OPERATION'],
        //                    value1: object['VALUE1'],
        //                    value2: object['VALUE2'],
        //                    exclude: exclude
        //                }));
        //            });
        //
        //        }
        //      ESP5 - Generic App Changes - End


        //      Group Items
        //      underscoreJS.each(oControl._groupItems,function(object){
        //      oControl._groupPanel.addGroupItem(new sap.m.P13nGroupItem({
        //      columnKey: object['COLUMNKEY'],
        //      operation: object['OPERATION'],
        //      }));
        //      });

        if (applyPersonalization) {
            oControl.fillPersonalizationItems(undefined, onlyFilter);
            oControl._applyPersonalization(oControl._columnItems, onlyFilter);
        }
    };


    T.prototype._applyPersonalization = function (tableItems, onlyFilter) {
        var oControl = this;
        var oBinding = oControl.getBinding("rows");

        /* Grouping Changes*/
        /* Group Column*/
        ////    var aSorters = [];
        //      var columns = oControl.getColumns();
        //      underscoreJS.each(columns,function(column) {
        //      var object = column.getBindingContext(oControl.getModelName()).getObject();
        //      var item = underscoreJS.find(oControl._groupItems, {columnKey : object['FLDNAME']});

        //      if(item){
        //      column.setGrouped(true);
        //      oControl.setGroupBy(column.getId());
        ////    var sPath = item.columnKey;
        ////    var bDescending = true;
        ////    if(item.operation == "GroupAscending")
        ////    bDescending = false;
        ////    var fields = oControl.getModel(oControl.getModelName()).getProperty(oControl.getFieldPath());
        ////    var field = underscoreJS.find(fields,{FLDNAME : item.columnKey});
        ////    if(field.ELTYP == vui5.cons.element.dropDown ){
        ////    var dropdowns = oControl.getModel(vui5.modelName).getProperty("/DROPDOWNS/"+field.FLDNAME);
        ////    aSorters.push(new Sorter(sPath, bDescending, function(oContext) {
        ////    var fieldName = groupItems[0].columnKey;
        ////    var contextObject = oContext.getObject();
        ////    var text = '';
        ////    if(dropdowns){
        ////    var dropdownObject = underscoreJS.find(dropdowns,{VALUE : contextObject[fieldName]});
        ////    if(dropdownObject)
        ////    text = dropdownObject.TEXT;
        ////    }
        ////    if(text == '')
        ////    text = contextObject[fieldName];
        ////    var returnobject = {
        ////    key : contextObject[fieldName],
        ////    text : text
        ////    };
        ////    return returnobject;
        ////    }));

        ////    }else{
        ////    aSorters.push(new Sorter(sPath, bDescending, true));
        ////    }
        //      }else{
        //      column.setGrouped(false);
        //      }
        //      });
        ////    oBinding.sort(aSorters);
        //      if(this._groupItems.length < 1) {
        //      this.setEnableGrouping(false);
        //      var oListBinding = this.getBinding();
        //      oListBinding.aSorters = null;
        //      //after reset, set the enableGrouping back to true
        //      this.setEnableGrouping(true);
        //      }


        var aSorters = [];
        var length = tableItems.length;
        var columns = oControl.getColumns();
        var columnsArray = [];
        var positionChanged = false;
        var filter = [];

        underscoreJS.each(columns, function (column) {
            var object = column.getBindingContext(oControl.getModelName()).getObject();
            //          ESP5 - Generic App Changes - Start
            //            /* Filter Columns */
            //            var item = underscoreJS.find(oControl._filterItems, {'COLUMNKEY' : object['FLDNAME']});
            //            if(item){
            //                column.setFiltered(true);
            //                if(item['EXCLUDE'] == true || item['EXCLUDE'] == "true" || item['EXCLUDE'] == "X")
            //                    item['OPERATION'] = 'NE';
            //
            //                filter.push(new Filter(column.getFilterProperty(),item['OPERATION'],item['VALUE1'],item['VALUE2']));
            //            }else{
            //                column.setFiltered(false);
            //            }
            //          ESP5 - Generic App Changes - End

            /* Sort Columns */
            if (!onlyFilter) {
                //              ESP5 - Generic App Changes - Start
                //                item = undefined;
                //
                //                item = underscoreJS.find(oControl._sortItems, {'COLUMNKEY' : object['FLDNAME']});
                //                if(item){
                //                    var bDescending = false;
                //                    column.setSorted(true);
                //                    if(item['OPERATION'] == "Descending") {
                //                        column.setSortOrder(sap.ui.table.SortOrder.Descending);
                //                        bDescending = true;
                //                    }else
                //                        column.setSortOrder(sap.ui.table.SortOrder.Ascending);
                //
                //                    aSorters.push(new Sorter(column.getSortProperty(), bDescending));
                //                }else{
                //                    column.setSorted(false);
                //                }
                //              ESP5 - Generic App Changes - End

                /* Column Reordering*/
                item = undefined;
                item = underscoreJS.find(tableItems, {
                    'COLUMNKEY': object['FLDNAME']
                });

                if (item) {

                    var visible = false;
                    if (item['VISIBLE'] == true || item['VISIBLE'] == "true" || item['VISIBLE'] == "X")
                        visible = true;


                    if (visible != column.getVisible())
                        column.setVisible(visible);

                    columnsArray[item['INDEX']] = column;

                    if (item['INDEX'] != column.getIndex()) {
                        positionChanged = true;
                        if (object['FRZCL'] == 'X'
                            && !oControl._oManualColumnFreeze) {
                            oControl._oManualColumnFreeze = true;
                            oControl.setFixedColumnCount(0);
                        }
                    }
                } else {
                    columnsArray[length] = column;
                    length = length + 1;
                }
            }
        });

        if (positionChanged && !onlyFilter) {
            oControl.removeAllColumns();
            underscoreJS.each(columnsArray, function (column, index) {
                oControl.insertColumn(column, index);
            });
        }
        //      ESP5 - Generic App Changes - Start
        //        if(!onlyFilter) {
        //            oBinding.sort(aSorters);
        //        }
        //        if(this._filterItems.length > 0) {
        //            oBinding.filter();
        //            oBinding.filter(new Filter(filter,true),sap.ui.model.FilterType.Application);
        //        }
        //        else {
        //            oBinding.filter();
        //        }
        //      ESP5 - Generic App Changes - End
    };
    //  ESP5 - Generic App Changes - Start
    //    T.prototype.setSortFilterOnColumns = function() {
    //        var oControl = this;
    //        var columns = oControl.getColumns();
    //        underscoreJS.each(columns,function(column) {
    //            var object = column.getBindingContext(oControl.getModelName()).getObject();
    //
    //            /* Filter Columns */
    //            var item = underscoreJS.find(oControl._filterItems, {'COLUMNKEY' : object['FLDNAME']});
    //            if(item){
    //                column.setFiltered(true);
    //            }else{
    //                column.setFiltered(false);
    //            }
    //
    //            item = undefined;
    //            item = underscoreJS.find(oControl._sortItems, {'COLUMNKEY' : object['FLDNAME']});
    //            if(item){
    //                column.setSorted(true);
    //                if(item['OPERATION'] == "Descending") {
    //                    column.setSortOrder(sap.ui.table.SortOrder.Descending);
    //                }else
    //                    column.setSortOrder(sap.ui.table.SortOrder.Ascending);
    //            }else{
    //                column.setSorted(false);
    //            }
    //        });
    //    };
    //  ESP5 - Generic App Changes - End

    T.prototype.allKeysToUpperCase = function (obj) {
        var output = {};
        for (var i in obj) {
            if (Object.prototype.toString.apply(obj[i]) === '[object Object]') {
                output[i.toUpperCase()] = this.allKeysToUpperCase(obj[i]);
            } else {
                output[i.toUpperCase()] = obj[i];
            }
        }
        return output;
    };

    //  ESP5 - Generic App Changes - Start
    //    T.prototype.getSortFilterObjects = function() {
    //
    //        var oControl = this;
    //        var oBinding = oControl.getBinding("rows");
    //        var filters;
    //        if(oBinding.aApplicationFilters[0]){
    //            filters = oBinding.aApplicationFilters[0].aFilters;
    //        }
    //        var sorters = oBinding.aSorters;
    //
    //
    //        var filterObjects = [];
    //        var sortObjects = [];
    //
    //        underscoreJS.each(filters,function(item,index){
    //            var operation,value1;
    //            if(item.sOperator == sap.ui.model.FilterOperator.Contains){
    //                value1 = '*' + item.oValue1 + '*';
    //                operation = 'CP';
    //            }else if(item.sOperator == sap.ui.model.FilterOperator.EndsWith) {
    //                value1 = '*' + item.oValue1;
    //                operation = 'CP';
    //            }else if(item.sOperator == sap.ui.model.FilterOperator.StartsWith) {
    //                value1 = item.oValue1 + '*';
    //                operation = 'CP';
    //            }else{
    //                value1 = item.oValue1;
    //                operation = item.sOperator;
    //            }
    //
    //            filterObjects.push({
    //                'FIELDNAME' : item.sPath,
    //                'ORDER' : index,
    //                'SIGN' : vui5.cons.seloptSign.include,
    //                'LOW' : value1,
    //                'HIGH' : item.oValue2,
    //                'OPTION' : operation
    //            });
    //        });
    //
    //        underscoreJS.each(sorters,function(item,index){
    //            var up,down;
    //            if(item.bDescending){
    //                down = 'X';
    //                up = '';
    //            }else{
    //                down = '';
    //                up = 'X';
    //            }
    //
    //            sortObjects.push({
    //                'SPOS' : index + 1,
    //                'FIELDNAME' : item.sPath,
    //                'UP' : up,
    //                'DOWN' : down
    //            });
    //            index = index + 1;
    //        });
    //
    //        return {
    //            sort : sortObjects,
    //            filter : filterObjects
    //        };
    //    };
    //  ESP5 - Generic App Changes - End

    T.prototype.prepareVariantsData = function (variantData) {

        var oControl = this;
        var tableColumns = this.getColumns();

        variantData.COLUMNITEMS = [];
        variantData.SORTITEMS = [];
        variantData.FILTERITEMS = [];
        underscoreJS.each(tableColumns, function (column) {

            var object = column.getBindingContext(oControl.getModelName()).getObject();

            var visible;
            visible = column.getVisible();
            var position = oControl.indexOfColumn(column);

            variantData.COLUMNITEMS.push({
                columnKey: object['FLDNAME'],
                index: position,
                visible: visible
            });

            if (column.getSorted()) {
                variantData.SORTITEMS.push({
                    operation: column.getSortOrder(),
                    columnKey: object['FLDNAME']
                });
            }
        });
        variantData.SORTITEMS = this.allKeysToUpperCase(variantData.SORTITEMS);
        variantData.COLUMNITEMS = this.allKeysToUpperCase(variantData.COLUMNITEMS);
        variantData.FILTERITEMS = this.allKeysToUpperCase(this._filterItems);
    };
    //  ESP5 - Generic App Changes - Start
    T.prototype.addToolBarButton = function (control, beforeDetail) {
        var toolbar = this.getToolbar();
        var index;
        if (beforeDetail) {
            index = toolbar.indexOfContent(this._oDetailButton);
            toolbar.insertContent(control, index);
            
        } else {
             index = toolbar.indexOfContent(this._ExpandButton);
            //index = toolbar.getContent().length;
            toolbar.insertContent(control, index);
        }
            
    };

    T.prototype.removeToolBarButton = function (control) {
        var toolbar = this.getToolbar();
        toolbar.removeContent(control);
    };


    T.prototype.onValueHelpRequest = function (oEvent) {
        var oControl = this;
        var source = oEvent.getSource();
        var model = source.getModel(source.data("model"));
        var fieldInfo = model.getProperty(source.data("path"));
        var rowid = model.getProperty(oEvent.getSource().getParent().getBindingContext(oControl.getModelName()).getPath())['ROWID'] || '';

        this.fireOnValueHelpRequest({
            oEvent: oEvent,
            fieldInfo: fieldInfo,
            rowId: rowid
        });
    };

    T.prototype._getCurrentRow = function (oEvent) {
        var source = oEvent.getSource();
        var model = source.getModel(source.data("model"));
        return model.getProperty(oEvent.getSource().getParent().getBindingContext(oEvent.getSource().data("model")).getPath())['ROWID'] || '';
    };
    
    /*** Rel 60E_SP7 - TreeTable Field Grouping - Start***/
    T.prototype.isGroupingPresent = function () {
        var model = this.getModel(this.getModelName());
        var fields = model.getProperty(this.getFieldPath());

        if (underscoreJS.isEmpty(model.getProperty(this.getFieldGroupPath()))) {
            return false;
        }
        return underscoreJS.where(fields, { FLGRP: '' }).length !== fields.length;
    };
    
    T.prototype.prepareCellTemplate = function (oContext) {
        if (this.getEditable()) {
            return this.prepareEditableTemplate(oContext);
        }
        else {
            return this.prepareNonEditableTemplate(oContext);
        }
    };
    
    T.prototype.prepareEditableTemplate = function(oContext){
    	var template, oControl=this, sectionPath, modelName, path, dataArea, editable, oController, fields;
    	oController = this.getController();
    	modelName = oControl.getModelName();
    	dataArea = oControl.getModel(modelName).getProperty(oControl.getDataAreaPath());
    	editable = oControl.getEditable();
    	path = oContext.getPath();
    	sectionPath = oControl.getFieldPath().substring(0, oControl.getFieldPath().lastIndexOf("/") - 6);
    	fields = oControl.getModel(modelName).getProperty(oControl.getFieldPath());
    	var contextObject = oContext.getObject();
        fieldEditable =
            "{= (${" + global.vui5.modelName + ">/DOCUMENT_MODE} !== 'A' || ${" + oControl.getModelName() + ">" + sectionPath + "EDIT} === 'X' ) &&"
            + "((  ${" + modelName + ">EDITABLECELLS} === '' || ${" + modelName + ">" + "EDITABLECELLS}.indexOf('<" + contextObject['FLDNAME'] + ">') === -1 || ${" + modelName + ">" + "EDITABLECELLS}.indexOf('<"
            + contextObject['FLDNAME'] + ">') !== -1 ) && "
            + "${" + modelName + ">" + path + "/DISABLED} === '') &&"
            + "${" + modelName + ">" + "READONLYCOLUMNS}.indexOf('<" + contextObject['FLDNAME'] + ">') === -1}";

        bindingMode = sap.ui.model.BindingMode.TwoWay;

        if (contextObject['SETCONTROL'] != undefined && contextObject['SETCONTROL'] != "") {
            func = contextObject['SETCONTROL'];
            template = func(path);
        }
        else if (contextObject['FLSTL'] == global.vui5.cons.styleType.icon) {
            template = oControl.__createIconControl(contextObject, modelName);
        }else {

            if (contextObject['DATATYPE'] == vui5.cons.dataType.date || contextObject['DATATYPE'] == vui5.cons.dataType.time) {
                contextObject['ELTYP'] = vui5.cons.element.input;
            }

            switch (contextObject['ELTYP']) {
                case vui5.cons.element.input:
                    // Dates
                    if (contextObject['DATATYPE'] == vui5.cons.dataType.date) {
                        template = new sap.m.DatePicker({
                            displayFormat: "long",
                            //*****Rel 60E_SP6
                            //valueFormat : "YYYY-MM-dd",
                            valueFormat: vui5.cons.date_format,
                            //*****
                            placeholder: " ",
                            strictParsing: true,
                            change: [oController.dateFieldCheck, oController],
                            editable: fieldEditable
                        });
                        template.bindValue(modelName + ">" + contextObject['FLDNAME'], null, bindingMode);
                        template.attachChange(oControl.onChangeUpdateIndicator.bind(oControl));
                        //                              oControl.triggerChangeEvent(template,contextObject);
                    } else if (contextObject['DATATYPE'] == vui5.cons.dataType.time) {
                        template = new sap.m.TimePicker({
                            valueFormat: "HH:mm:ss",
                            displayFormat: "hh:mm:ss a",
                            editable: fieldEditable
                        });
                        template.bindValue(modelName + ">" + contextObject['FLDNAME'], null, bindingMode);
                        template.attachChange(oControl.onChangeUpdateIndicator.bind(oControl));
                        //                              oControl.triggerChangeEvent(template,contextObject);
                        // Amount
                    } else if (contextObject['DATATYPE'] == vui5.cons.dataType.amount) {

                        template = new sap.m.Input({
                            showValueHelp: false,
                            maxLength: parseInt(contextObject['OUTPUTLEN']),
                            editable: fieldEditable,
                        });
                        if (contextObject['TXTFL'] != '') {
                            template.bindValue(modelName + ">" + contextObject['TXTFL'], null, bindingMode);
                        }
                        template.setTextAlign(sap.ui.core.TextAlign.End);
                        template.data("FLDNAME", contextObject['FLDNAME']);
                        template.attachChange(oControl.onChangeUpdateIndicator.bind(oControl));


                    } else if (contextObject['DATATYPE'] == vui5.cons.dataType.quantity) {

                        template = new sap.m.Input({
                            showValueHelp: false,
                            maxLength: parseInt(contextObject['OUTPUTLEN']),
                            editable: fieldEditable,
                        });
                        if (contextObject['TXTFL'] != '') {
                            template.bindValue(modelName + ">" + contextObject['TXTFL'], null, bindingMode);
                        }
                        template.setTextAlign(sap.ui.core.TextAlign.End);
                        template.data("FLDNAME", contextObject['FLDNAME']);
                        template.attachChange(oControl.onChangeUpdateIndicator.bind(oControl));

                    } else if (contextObject['DATATYPE'] == vui5.cons.dataType.decimal) {

                        template = new sap.m.Input({
                            showValueHelp: false,
                            maxLength: parseInt(contextObject['OUTPUTLEN']),
                            editable: fieldEditable,
                        });
                        if (contextObject['TXTFL'] != '') {
                            template.bindValue(modelName + ">" + contextObject['TXTFL'], null, bindingMode);
                        }
                        template.setTextAlign(sap.ui.core.TextAlign.End);
                        template.data("FLDNAME", contextObject['FLDNAME']);
                        template.attachChange(oControl.onChangeUpdateIndicator.bind(oControl));
                    } else {
                        template = new sap.m.Input({
                            showValueHelp: false,
                            maxLength: parseInt(contextObject['OUTPUTLEN']),
                            editable: fieldEditable,
                        });
                        oControl.setFieldType(
                          template,
                          contextObject);

                        oControl.handleDescriptionField(
                          template,
                          contextObject,
                          modelName,
                          path,
                          dataArea,
                          bindingMode,
                          editable);
                        template.attachChange(oControl.onChangeUpdateIndicator.bind(oControl));
                        //                              oControl.triggerChangeEvent(template,contextObject);
                    }
                    break;
                case vui5.cons.element.valueHelp:
                    template = new sap.m.Input({
                        showValueHelp: true,
                        fieldWidth: "100%",
                        maxLength: parseInt(contextObject['OUTPUTLEN']),
                        editable: fieldEditable,
                    });

                    oControl.setFieldType(
                      template,
                      contextObject);

                    oControl.handleDescriptionField(
                      template,
                      contextObject,
                      modelName,
                      path,
                      dataArea,
                      bindingMode,
                      editable);
                    template.data("model", modelName);
                    template.data("path", path);
                    template.data("dataArea", dataArea);

                    template.attachValueHelpRequest(oControl.onValueHelpRequest.bind(oControl));


                    oControl.bindTypeAheadField(
                      template,
                      path,
                      contextObject);
                    template.attachChange(oControl.onChangeUpdateIndicator.bind(oControl));
                    //                          oControl.triggerChangeEvent(template,contextObject);
                    break;
                case vui5.cons.element.dropDown:
                    //template = new sap.m.ComboBox({
                    template = new global.vui5.ui.controls.ComboBox({
                        editable: fieldEditable,
                    });
                    template.bindAggregation("items", vui5.modelName + '>' + "/DROPDOWNS/" + dataArea + "/" + contextObject['FLDNAME'], function (sid, oContext) {
                        var contextObject = oContext.getObject();
                        return new sap.ui.core.Item({
                            key: contextObject['NAME'],
                            text: contextObject['VALUE']
                        });
                    });
                    template.bindProperty("selectedKey", modelName + ">" + contextObject['FLDNAME'], null, bindingMode);
                    template.attachChange(oControl.onChangeUpdateIndicator.bind(oControl));
                    //                          oControl.triggerChangeEvent(template,contextObject);
                    break;
                case global.vui5.cons.element.objectStatus: 
                    var metadata,metadataObj,fldname,icon,active,label,state,path1;
            	    metadata = contextObject['METADATA'];
            	    metadataObj = JSON.parse(metadata);
            	   
            	    fldname = metadataObj['TEXT_FIELD'];
            	    icon = metadataObj['ICON_FIELD'];
            	    active = metadataObj['ACTIVE'] == "X" ? true :false;
            	    label = metadataObj['TITLE_FIELD'];
            	    state = metadataObj['STATE_FIELD'];
            	    path1 = contextObject['FLDNAME'];
            	    if ((contextObject['SDSCR'] === global.vui5.cons.fieldValue.description ||
            	    		contextObject['SDSCR'] === global.vui5.cons.fieldValue.value_cont_descr) && contextObject['TXTFL']) {
                            path1 = contextObject['TXTFL'];
                   }
            	template = new sap.m.ObjectStatus({
            		active : active
            	}).bindProperty("text",modelName + ">" + fldname,null,bindingMode)
            	.bindProperty("icon",modelName + ">"  + icon,null,bindingMode)
            	.bindProperty("state", modelName + ">" + state, function (val) {
                            if (val === global.vui5.cons.stateConstants.Error) {
                            	return sap.ui.core.ValueState.Error;
                            }
                            else if(val === global.vui5.cons.stateConstants.Warning){
                            	return sap.ui.core.ValueState.Information;
                            	
                            }else if(val === global.vui5.cons.stateConstants.None){
                            	return sap.ui.core.ValueState.None;
                            	
                            }else if(val === global.vui5.cons.stateConstants.Success){
                            	return sap.ui.core.ValueState.Success;
                            }
                            else{
                            	return sap.ui.core.ValueState.None;
                            }
                            
                        }, sap.ui.model.BindingMode.OneWay);
            	
            	template.data("fieldname", path1);
                template.data("fieldInfo", contextObject);
                if(label)
               	 template.bindProperty('title',modelName + ">" + label,null,bindingMode);
            	if(active)
            		template.attachPress(oControl.onFieldClick, oControl);
            	   break;
                case vui5.cons.element.checkBox:
                    template = new sap.m.CheckBox({
                        select: [oController._onCheckBoxSelect, oController],
                        editable: fieldEditable,
                        selected: "{= ${" + modelName + ">" + contextObject['FLDNAME'] + "} === 'X' }"
                    });
                    template.data("model", modelName);
                    template.attachSelect(oControl.onChangeUpdateIndicator.bind(oControl));
                    //                          oControl.triggerChangeEvent(template,contextObject);
                    break;
                    //  ESP5 - Generic App Changes - Start
                case global.vui5.cons.element.link:
                case global.vui5.cons.element.button:

                    //*****Rel 60E_SP6
                    var enabled = true;
                    if (contextObject['ELTYP'] === global.vui5.cons.element.button) {
                        enabled = "{= ${" + modelName + ">" + "READONLYCOLUMNS}.indexOf('<" + contextObject['FLDNAME'] + ">') === -1 }";
                    }
                    //*****

                    var path1 = contextObject['FLDNAME'];
                    if (contextObject['CFIELDNAME'] == "") {

                        if ((contextObject['SDSCR'] === global.vui5.cons.fieldValue.description ||
                                contextObject['SDSCR'] === global.vui5.cons.fieldValue.value_cont_descr) && contextObject['TXTFL']) {
                            path1 = contextObject['TXTFL'];
                        }
                        var params = {
                            press: [oControl.onFieldClick, oControl],
                            //*****Rel 60E_SP6
                            enabled: enabled
                            //*****
                        };
                        template = contextObject['ELTYP'] == global.vui5.cons.element.link ? new sap.m.Link(params) : new sap.m.Button(params);
                        template.bindProperty("text", modelName + ">" + path1, null, sap.ui.model.BindingMode.OneWay);
                        //                            
                        template.data("fieldname", path1);
                        template.data("fieldInfo", contextObject);
                    } else if (contextObject['CFIELDNAME'] != "") {

                        var cfieldname;
                        var cfield = underscoreJS.find(fields, {
                            'FLDNAME': contextObject['CFIELDNAME']
                        });
                        if (cfield) {
                            if (cfield['TXTFL'] != '') {
                                cfieldname = cfield['TXTFL'];
                            }
                            else {
                                cfieldname = contextObject['CFIELDNAME'];
                            }
                        }
                        var params = {
                            press: [oControl.onFieldClick, oControl],
                            text: {
                                parts: [{
                                    path: modelName + ">" + contextObject['TXTFL']
                                },
                                    {
                                        path: modelName + ">" + cfieldname
                                    }],
                                mode: bindingMode
                            },
                            //*****Rel 60E_SP6
                            enabled: enabled
                            //*****
                        }
                        template = contextObject['ELTYP'] == global.vui5.cons.element.link ? new sap.m.Link(params) : new sap.m.Button(params);

                        //                                        template = new sap.m.Link({
                        //                                            press: [oControl.onFieldClick, oControl],
                        //                                            text: {
                        //                                                parts: [{
                        //                                                    path: modelName + ">" + contextObject['TXTFL']
                        //                                                },
                        //                                                    {
                        //                                                        path: modelName + ">" + cfieldname
                        //                                                    }],
                        //                                                mode: bindingMode
                        //                                            }
                        //                                        });


                        template.data("fieldname", path1);
                        template.data("fieldInfo", contextObject);
                    }

                    //*****Rel 60E_SP6
                    if (contextObject['ELTYP'] === global.vui5.cons.element.button) {
                        template.bindProperty("type", {
                            parts: [{ path: modelName + ">" + contextObject['FLDNAME'] },
                                    { path: modelName + ">" + oContext.getPath() + "/STYLES" }],
                            formatter: function (val, styles) {
                                var oType = sap.m.ButtonType.Default;
                                if (!underscoreJS.isEmpty(styles)) {
                                    style = underscoreJS.findWhere(styles, { "VALUE": val });
                                    if (style && style['BTNTP'] == global.vui5.cons.buttonType.accept) {
                                        oType = sap.m.ButtonType.Accept;
                                    }
                                    else if (style && style['BTNTP'] == global.vui5.cons.buttonType.reject) {
                                        oType = sap.m.ButtonType.Reject;
                                    }
                                    else if (style && style['BTNTP'] == global.vui5.cons.buttonType.transparent) {
                                        oType = oType = sap.m.ButtonType.Transparent;
                                    }
                                }

                                return oType;
                            },
                            mode: sap.ui.model.BindingMode.OneWay
                        });
                    }

                    break;
                    //  ESP5 - Generic App Changes - End

                    //                          default:
                    //                          template = new Text({
                    //                          text : "{" + modelName + ">" + contextObject['FLDNAME'] + "}"
                    //                          });
                    //                          template.attachChange(oControl.onChangeUpdateIndicator.bind(oControl));
                    //                          oControl.triggerChangeEvent(template,contextObject);

            }
            var refFields;
            if (template) {
                if (contextObject['DATATYPE'] == vui5.cons.dataType.currencyKey) {
                    refFields = underscoreJS.where(fields, {
                        'CFIELDNAME': contextObject['FLDNAME']
                    });
                    //                              var amountFields = underscoreJS.where(fields,{ 'CFIELDNAME' : contextObject['FLDNAME']});
                    //                              if(amountFields) {
                    //                              oControl.handleCurrencyConversion(
                    //                              template,
                    //                              amountFields,
                    //                              contextObject
                    //                              );
                    //                              }
                } else if (contextObject['DATATYPE'] == vui5.cons.dataType.unit) {
                    refFields = underscoreJS.where(fields, {
                        'QFIELDNAME': contextObject['FLDNAME']
                    });
                    //                              var quantityFields = underscoreJS.where(fields,{ 'QFIELDNAME' : contextObject['FLDNAME']});
                    //                              if(quantityFields) {
                    ////                            var quantityPath = oContext.getPath() + "/";
                    //                              oControl.handleUnitConversion(
                    //                              template,
                    //                              quantityFields,
                    //                              contextObject
                    //                              );
                    //                              }
                }
                oControl._onInputChange(template, contextObject, path, refFields);
            }
        }
        return template;
    };
    
    T.prototype.prepareNonEditableTemplate = function(oContext){
    	var oControl = this, bindingMode, contextObject, modelName, dataArea, fields, hAlign, template;
    	bindingMode = sap.ui.model.BindingMode.OneWay;
    	contextObject = oContext.getObject();
    	modelName = oControl.getModelName();
    	dataArea = oControl.getModel(modelName).getProperty(oControl.getDataAreaPath());
    	fields = oControl.getModel(modelName).getProperty(oControl.getFieldPath());
        if (contextObject['FLSTL'] == global.vui5.cons.styleType.icon) {
            hAlign = sap.ui.core.TextAlign.Center;
        }
        else if (contextObject['INTTYPE'] == vui5.cons.intType.number ||
          contextObject['INTTYPE'] == vui5.cons.intType.date ||
          contextObject['INTTYPE'] == vui5.cons.intType.time ||
          contextObject['INTTYPE'] == vui5.cons.intType.integer ||
          contextObject['INTTYPE'] == vui5.cons.intType.oneByteInteger ||
          contextObject['INTTYPE'] == vui5.cons.intType.twoByteInteger ||
          contextObject['INTTYPE'] == vui5.cons.intType.packed ||
          contextObject['INTTYPE'] == vui5.cons.intType.float ||
          contextObject['INTTYPE'] == vui5.cons.intType.decimal16 ||
          contextObject['INTTYPE'] == vui5.cons.intType.decimal32) {
            hAlign = sap.ui.core.TextAlign.Right;
        }
        else {
            hAlign = sap.ui.core.TextAlign.Left;
        }

        if (contextObject['SETCONTROL'] != undefined && contextObject['SETCONTROL'] != "") {
            func = contextObject['SETCONTROL'];
            template = func(path);
        } else {
            template = oControl.setDisplayFieldColor(contextObject, modelName, dataArea, fields, oContext);
            if (template && template.setTextAlign) {
                template.setTextAlign(hAlign);
                //                        	
            }

        }
        return template;
    }
    
    /*** Rel 60E_SP7 - TreeTable Field Grouping - End***/


    //  ESP5 - Generic App Changes - End


    //  ESP5 - Generic App Changes - Start
    //    T.prototype.onCustomFilter = function(){
    //        var oControl = this;
    //
    //        if(!this._FilterPersonalization){
    //            this._FilterPersonalization = new sap.m.P13nDialog({
    //                initialVisiblePanelType:"filter",
    //                showReset : true,
    //                ok: [oControl.handleFilterOk,oControl],
    //                cancel: [oControl.handleFilterClose,oControl] ,
    //                reset : [oControl.handleFilterReset,oControl]
    //            });
    //
    //            var columns = this.getModel(this.getModelName()).getProperty(this.getFieldPath());
    //            var bundle = this.getModel("i18n").getResourceBundle();
    //
    //            this._filterPanel1 = new sap.m.P13nFilterPanel({
    //                title:bundle.getText("Filter"),
    //                visible: true,
    //                type:"filter",
    //                containerQuer:true,
    //                layoutMode:"Desktop",
    //                addFilterItem : this.addFilterItem.bind(this),
    //                removeFilterItem: this.removeFilterItem.bind(this),
    //                updateFilterItem:this.updateFilterItem.bind(this)
    //            });
    //            underscoreJS.each(columns,function(object) {
    //                var type;
    //                if(object['INTTYPE'] == vui5.cons.intType.number ||
    //                        object['INTTYPE'] == vui5.cons.intType.time ||
    //                        object['INTTYPE'] == vui5.cons.intType.integer ||
    //                        object['INTTYPE'] == vui5.cons.intType.oneByteInteger ||
    //                        object['INTTYPE'] == vui5.cons.intType.twoByteInteger ||
    //                        object['INTTYPE'] == vui5.cons.intType.packed ||
    //                        object['INTTYPE'] == vui5.cons.intType.float ||
    //                        object['INTTYPE'] == vui5.cons.intType.decimal16 ||
    //                        object['INTTYPE'] == vui5.cons.intType.decimal32){
    //                    type = 'numeric';
    //                }else if(object['INTTYPE'] == vui5.cons.intType.date){
    //                    type = 'date';
    //                }else {
    //                    type = 'string';
    //                }
    //                oControl._filterPanel1.addItem(new sap.m.P13nItem({
    //                    columnKey: object['FLDNAME'],
    //                    text: object['LABEL'],
    //                    type : type
    //                }));
    //            });
    //            this._FilterPersonalization.addPanel(this._filterPanel1);
    //
    //            this.addDependent(this._FilterPersonalization);
    //        }
    //        this.fillFilterPanelItem(true);
    //        this.fillPersonalizationItems(undefined, true);
    //        this._FilterPersonalization.open();
    //    };
    //
    //    T.prototype.handleFilterOk = function(){
    ////      var oControl = this;
    ////      var oBinding = oControl.getBinding("rows");
    //        this.fillPersonalizationItems(undefined,true);
    //
    //        this._applyPersonalization([],true);
    //        this._FilterPersonalization.close();
    //    };
    //
    //    T.prototype.handleFilterClose = function(){
    //        var oControl = this;
    //        oControl._filterPanel1.removeAllFilterItems();
    //        underscoreJS.each(this._filterItems,function(item) {
    //            oControl._filterPanel1.addFilterItem(new sap.m.P13nFilterItem({
    //                columnKey: item['COLUMNKEY'],
    //                operation: item['OPERATION'],
    //                value1 : item['VALUE1'],
    //                value2 : item['VALUE2'],
    //                exclude : item['EXCLUDE']
    //            }));
    //        });
    //        this._FilterPersonalization.close();
    //    };
    //
    //    T.prototype.handleFilterReset= function(){
    //        var variant = this._oVariants.getSelectionKey();
    //        if(variant != "*standard*"){
    //            this.fetchVariantData(variant,false,true);
    //        }else{
    //            this._filterPanel1.removeAllFilterItems();
    //            /* Grouping Changes*/
    ////          this._groupPanel.removeAllGroupItems();
    //        }
    //        this._oVariants.currentVariantSetModified(false);
    //    };
    //
    //    T.prototype.fillFilterPanelItem =  function(onlyFilter){
    //        var oControl = this;
    //        if(!onlyFilter){
    //            oControl._filterPanel.removeAllFilterItems();
    //            underscoreJS.each(oControl._filterItems,function(object){
    //                var exclude;
    //                if(object['EXCLUDE'] == true || object['EXCLUDE'] == "true" || object['EXCLUDE'] == "X"){
    //                    exclude = true;
    //                }else{
    //                    exclude = false;
    //                }
    //                oControl._filterPanel.addFilterItem(new sap.m.P13nFilterItem({
    //                    columnKey: object['COLUMNKEY'],
    //                    operation: object['OPERATION'],
    //                    value1: object['VALUE1'],
    //                    value2: object['VALUE2'],
    //                    exclude: exclude
    //                }));
    //            });
    //        }else{
    //            oControl._filterPanel1.removeAllFilterItems();
    //            underscoreJS.each(oControl._filterItems,function(object){
    //                var exclude;
    //                if(object['EXCLUDE'] == true || object['EXCLUDE'] == "true" || object['EXCLUDE'] == "X"){
    //                    exclude = true;
    //                }else{
    //                    exclude = false;
    //                }
    //                oControl._filterPanel1.addFilterItem(new sap.m.P13nFilterItem({
    //                    columnKey: object['COLUMNKEY'],
    //                    operation: object['OPERATION'],
    //                    value1: object['VALUE1'],
    //                    value2: object['VALUE2'],
    //                    exclude: exclude
    //                }));
    //            });
    //        }
    //    };
    //  ESP5 - Generic App Changes - End
    return T;
});