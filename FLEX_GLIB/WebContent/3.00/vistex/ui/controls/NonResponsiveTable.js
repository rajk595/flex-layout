sap.ui.define([
    "jquery.sap.global",
    "sap/ui/table/Table",
    "sap/ui/model/json/JSONModel",
    "sap/ui/table/Column",
    "sap/m/Label",
    "sap/m/Text",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/comp/variants/VariantItem",
    vistexConfig.rootFolder + "/ui/core/global",
    vistexConfig.rootFolder + "/ui/core/Formatter",
    vistexConfig.rootFolder + "/ui/core/underscore-min",
//*****Rel 60E_SP5
    vistexConfig.rootFolder + "/ui/core/commonUtils",
    "sap/m/P13nConditionPanel",
    'sap/ui/core/format/DateFormat',
    'sap/ui/core/format/NumberFormat',
//*****
    vistexConfig.rootFolder + "/ui/controls/PersonalizationDialog",
    vistexConfig.rootFolder + "/ui/controls/MassEditDialog"

], function (q, Table, JSONModel, Column, Label, Text, Sorter, Filter, VariantItem, global, Formatter, underscoreJS, commonUtils, P13nConditionPanel, DateFormat, NumberFormat) {
    var T = Table.extend(vistexConfig.rootFolder + ".ui.controls.NonResponsiveTable", {
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
                fieldGroupPath: {
                    type: "string",
                    defaultValue: null
                },
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
                pagingType: {
                    type: "string",
                    defaultValue: ""
                },
                numberOfPages: {
                    type: "int",
                    defaultValue: 0
                },
                currentPage: {
                    type: "int",
                    defaultValue: 1
                },
                pageSize: {
                    type: "string",
                    defaultValue: "10"
                },
                totalNumberOfRows: {
                    type: "string"
                },
                handle: {
                    type: "string",
                    defaultValue: null
                },
                /* onF4HelpRequest: {
                     type: "function",
                     defaultValue: null
                 },*/
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
                enableSearchAndReplace: {
                    type: "boolean",
                    defaultValue: true
                },
                enablePersonalization: {
                    type: "boolean",
                    defaultValue: true
                },
                enableSetValues: {
                    type: "boolean",
                    defaultValue: false
                },
                disableExcelExport: {
                    type: "boolean",
                    defaultValue: false
                },
                searchProfile: {
                    type: "string",
                    defaultValue: ""
                },
                uiProfile: {
                    type: "string",
                    defaultValue: ""
                },
                backendSortFilter: {
                    type: "boolean",
                    defaultValue: true
                },
                sectionID: {
                    type: "string",
                    defaultValue: ""
                },
                variantDataPath: {
                    type: "string"
                },
                layoutDataPath: {
                    type: "string"
                },
                selectedVariant: {
                    type: "string"
                },
                fullScreen: {
                    type: "boolean",
                    defaultValue: false
                },
                totalDataPath: {
                    type: "string"
                },
                enableQuickEntry: {
                    type: "boolean",
                    defaultValue: false
                },
                //MassEdit
                enableBulkEdit: {
                    type: "boolean",
                    defaultValue: false
                },
                enableRowColor: {
                    type: "boolean",
                    defaultValue: false
                },
                hideVariantSave: {
                    type: "boolean",
                    defaultValue: false
                },
                /***Rel 60E SP6 ECDM #4728 - Start ***/
                hideShare: {
                    type: "boolean",
                },
                /***Rel 60E SP6 ECDM #4728 - End ***/

            },
            events: {
                onPageChange: {},
                onFieldChange: {},
                onDetailButton: {},
                onSortFilter: {},
                onFieldClick: {},
                onValueHelpRequest: {},
                variantSave: {},
                variantSelect: {},
                layoutManage: {},
                pageChange: {},
                onFullScreen: {},
                onSetValues: {},
                onSetValuesApply: {},
                onSetValuesClose: {},
                onExport: {},
                onQuickEntry: {},
                onMassEdit: {},
                //*****Rel 60E_SP6 - QA #9410
                onUpdate: {}
                //*****
            }
        },


        renderer: function (oRM, oControl) {
            jQuery.sap.require("sap.ui.table.TableRenderer");
            sap.ui.table.TableRenderer.render(oRM, oControl);


            if (oControl.getPagingType() == global.vui5.cons.pagingType.serverPaging) {
                if (oControl._VuiPaginator) {
                    oControl._VuiPaginator.destroy();
                    delete oControl._VuiPaginator;
                }
                oControl.__createPaginator();
                oRM.renderControl(oControl._VuiPaginator);
            } else if (oControl.getPagingType() == global.vui5.cons.pagingType.virtualPaging &&
                sap.ui.getVersionInfo().version < "1.38") {
                oControl.__attachPageChange();
            }
        }
    });

    /*required in case of later version as sorting and filter icon are not shown*/
    //  T.prototype.onAfterRendering = function() {
    //  var oControl = this;
    //  this.setSortFilterOnColumns();
    //  };

    T.prototype.onBeforeRendering = function () {
        if (Table.prototype.onBeforeRendering) {
            Table.prototype.onBeforeRendering.apply(this);
        }

        var oControl = this;
        if (oControl._performPersonalization) {
            oControl._performPersonalization = false;
            oControl._applyPersonalization(oControl._columnItems);
        }
    };

    //*****Rel 60E_SP6
    T.prototype.addRowHighlights = function () {
        var oControl = this;
        var model = oControl.getModel(oControl.getModelName());
        var dataPath = oControl.getDataPath();
        var columns = oControl._getVisibleColumns();
        var rows = oControl.getAggregation("rows");
        var rowCount = oControl.getVisibleRowCount();
        var rowStart = oControl.getFirstVisibleRow();

        if (oControl.getDataPath() && columns.length > 0 && rows && rows.length > 0) {
            for (var i = 0; i < rowCount; i++) {

                var path = parseInt(rowStart + i);
                var rowColor = model.getProperty(dataPath + path + "/ROWCOLOR");
                var classes = $($(".sapUiTableRowHighlight")[i]).attr("class");
                if (classes && classes.indexOf("vui_tblrowcolor") !== -1) {
                    var vuiClass = classes.substring(classes.indexOf("vui_tblrowcolor"), classes.length).split(" ")[0];
                    $($(".sapUiTableRowHighlight")[i]).removeClass(vuiClass);
                }
                if (classes && classes.indexOf("sapUiTableRowHighlightSuccess") !== -1) {
                    $($(".sapUiTableRowHighlight")[i]).removeClass("sapUiTableRowHighlightSuccess");
                }
                if (rowColor) {
                    var rowClass = "vui_tblrowcolor_" + rowColor;
                    $($(".sapUiTableRowHighlight")[i]).addClass(rowClass);
                }
            }
        }
    };
    //*****

    T.prototype.addRowColor = function () {
        var oControl = this;

        oControl.setCellValueChangeColor();

        if (sap.ui.getVersionInfo().version >= "1.48") {
            oControl.addRowHighlights();
            return;
        }


        var model = oControl.getModel(oControl.getModelName());
        var dataPath = oControl.getDataPath();
        var columns = oControl._getVisibleColumns();
        var rows = oControl.getAggregation("rows");
        var rowCount = oControl.getVisibleRowCount();
        var rowStart = oControl.getFirstVisibleRow();

        if (oControl.getDataPath() && columns.length > 0 && rows.length > 0) {
            ///**Rel 60E SP6 QA #9420 - Start
            //oControl.setRenderingDone(true);
            /*for (i = 0; i < rows.length; i++) {
                var rowColor = model.getProperty(dataPath + i + "/ROWCOLOR");
                if (rowColor) {
                    var rowClass = "vui_tblrowcolor_" + rowColor;
                    $($(".sapUiTableTr")[i]).addClass(rowClass);
                    if ($($(".sapUiTableTr")[i]).closest("table").hasClass("sapUiTableCtrlFixed")) {
                        $($(".sapUiTableTr")[i + rows.length]).addClass(rowClass);
                    }
                }
            }*/

            for (var i = 0; i < rowCount; i++) {

                var path = parseInt(rowStart + i);
                var rowColor = model.getProperty(dataPath + path + "/ROWCOLOR");

                var classes = $($(".sapUiTableTr")[i]).attr("class");
                if (classes && classes.indexOf("vui_tblrowcolor") !== -1) {
                    var vuiClass = classes.substring(classes.indexOf("vui_tblrowcolor"), classes.length).split(" ")[0];
                    $($(".sapUiTableTr")[i]).removeClass(vuiClass);
                    if ($($(".sapUiTableTr")[i]).closest("table").hasClass("sapUiTableCtrlFixed")) {
                        $($(".sapUiTableTr")[i + rows.length]).removeClass(vuiClass);
                    }
                }
                if (rowColor) {
                    var rowClass = "vui_tblrowcolor_" + rowColor;
                    $($(".sapUiTableTr")[i]).addClass(rowClass);
                    if ($($(".sapUiTableTr")[i]).closest("table").hasClass("sapUiTableCtrlFixed")) {
                        $($(".sapUiTableTr")[i + rows.length]).addClass(rowClass);
                    }
                }
            }
            ///**Rel 60E SP6 QA #9420 - End
        }
        //*****
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

    //  Column Width Optimzation
    T.prototype.onAfterRendering = function () {
        var oControl = this;
        if (sap.ui.table.Table.prototype.onAfterRendering) {
            sap.ui.table.Table.prototype.onAfterRendering.apply(this, arguments);
        }

        //        jQuery.sap.delayedCall(5, this, function() {
        //            this._updateVSbTop();
        //            this._updateHSb(this._collectTableSizes());
        //            this.optimizeColumnWidth();
        //        });
        //        

        //this.optimizeColumnWidth();        
        this.addRowColor();
        this.clearSelection();
        ///**Rel 60E SP6 QA #9420 - Start        
        this.vuiScrolling();
        ///**Rel 60E SP6 QA #9420 - End

        var totalValue = oControl.getModel(oControl.getModelName()).getProperty(oControl.getTotalDataPath());


        if (totalValue === null || totalValue === undefined || (underscoreJS.isEmpty(totalValue['TOTAL']) && underscoreJS.isEmpty(totalValue['MAX']) && underscoreJS.isEmpty(totalValue['MIN']) && underscoreJS.isEmpty(totalValue['AVG']))) {
            $('.sapUiTableFtr').hide();
        }
        else {
            $('.sapUiTableFtr').show();
        }
        if (this.getBinding("rows")) {
            if (this.getBinding("rows").getTitle) {
                this.getBinding("rows").getTitle = function (index) {

                    var totalValue = oControl.getModel(oControl.getModelName()).getProperty(oControl.getTotalDataPath());
                    var dataLength = oControl.getModel(oControl.getModelName()).getProperty(oControl.getDataPath()).length;
                    var fields = oControl.getModel(oControl.getModelName()).getProperty(oControl.getFieldPath());
                    var rowContext = oControl.getBinding("rows").getContexts(0, oControl.getBinding("rows").getLength())[index];
                    var layoutData = oControl.getModel(oControl.getModelName()).getProperty(oControl.getLayoutDataPath());
                    var object = {}, title, subAggregateTitle;
                    var subAggregateColumns = [];
                    var columnName;
                    var groupHeaderName;
                    //var columnName = sap.ui.getCore().byId(oControl.getGroupBy()).data("contextObject")['FLDNAME'];
                    var columnName = sap.ui.getCore().byId(oControl.getGroupBy()).getSortProperty();
                    if (rowContext['__groupInfo']) {

                        groupHeaderName = rowContext['__groupInfo']['name'];

                        if (sap.ui.getCore().byId(oControl.getGroupBy()).data("contextObject")['FLDNAME'] &&
                            sap.ui.getCore().byId(oControl.getGroupBy()).getSortProperty() !== sap.ui.getCore().byId(oControl.getGroupBy()).data("contextObject")['FLDNAME']) {
                            grpRowData = oControl.getModel(oControl.getModelName()).getProperty(rowContext['__groupInfo'].oContext.sPath);
                            object[sap.ui.getCore().byId(oControl.getGroupBy()).data("contextObject")['FLDNAME']] = grpRowData[sap.ui.getCore().byId(oControl.getGroupBy()).data("contextObject")['FLDNAME']];
                        }
                        else {
                            object[columnName] = groupHeaderName;
                        }


                        underscoreJS.each(layoutData['AGRGTITEMS'], function (item) {
                            var columnItem = underscoreJS.findWhere(oControl.getModel(oControl.getModelName()).getProperty(oControl.getFieldPath()), {
                                'FLDNAME': item['COLUMNKEY']
                            });

                            if (columnItem) {
                                if (item['AGGAT'] || item['SBAGT']) {
                                    subAggregateColumns.push(columnItem);
                                }
                            }


                        });

                        if (totalValue) {


                            var subAggregateData = underscoreJS.findWhere(totalValue['GRP_TOTAL'], object);
                            if (subAggregateData) {
                                underscoreJS.each(subAggregateColumns, function (subAggField) {
                                    if (subAggregateTitle === undefined) {

                                        if (subAggregateData[subAggField['FLDNAME']]) {
                                            subAggregateTitle = subAggField['LABEL'] + ": " + subAggregateData[subAggField['FLDNAME']];
                                        }
                                        else if (subAggregateData['MAXIMUM'] && subAggregateData['MAXIMUM'][subAggField['FLDNAME']]) {
                                            subAggregateTitle = oControl._oBundle.getText("Max") + ". " + subAggField['LABEL'] + ": " + subAggregateData['MAXIMUM'][subAggField['FLDNAME']];
                                        }
                                        else if (subAggregateData['MINIMUM'] && subAggregateData['MINIMUM'][subAggField['FLDNAME']]) {
                                            subAggregateTitle = oControl._oBundle.getText("Min") + ". " + subAggField['LABEL'] + ": " + subAggregateData['MINIMUM'][subAggField['FLDNAME']];
                                        }
                                        else if (subAggregateData['AVERAGE'] && subAggregateData['AVERAGE'][subAggField['FLDNAME']]) {
                                            subAggregateTitle = oControl._oBundle.getText("Avg") + ". " + subAggField['LABEL'] + ": " + subAggregateData['AVERAGE'][subAggField['FLDNAME']];
                                        }
                                    }
                                    else {

                                        if (subAggregateData[subAggField['FLDNAME']]) {
                                            subAggregateTitle = subAggregateTitle + ", " + subAggField['LABEL'] + ": " + subAggregateData[subAggField['FLDNAME']];
                                        }
                                        else if (subAggregateData['MAXIMUM'] && subAggregateData['MAXIMUM'][subAggField['FLDNAME']]) {
                                            subAggregateTitle = subAggregateTitle + ", " + oControl._oBundle.getText("Max") + ". " + subAggField['LABEL'] + ": " + subAggregateData['MAXIMUM'][subAggField['FLDNAME']];
                                        }
                                        else if (subAggregateData['MINIMUM'] && subAggregateData['MINIMUM'][subAggField['FLDNAME']]) {
                                            subAggregateTitle = subAggregateTitle + ", " + oControl._oBundle.getText("Min") + ". " + subAggField['LABEL'] + ": " + subAggregateData['MINIMUM'][subAggField['FLDNAME']];
                                        }
                                        else if (subAggregateData['AVERAGE'] && subAggregateData['AVERAGE'][subAggField['FLDNAME']]) {
                                            subAggregateTitle = subAggregateTitle + ", " + oControl._oBundle.getText("Avg") + ". " + subAggField['LABEL'] + ": " + subAggregateData['AVERAGE'][subAggField['FLDNAME']];
                                        }
                                    }
                                });

                            }
                        }

                        if (sap.ui.getCore().byId(oControl.getGroupBy()).data("contextObject")['DATATYPE'] == global.vui5.cons.dataType.date) {
                            groupHeaderName = Formatter.dateFormat(groupHeaderName, oControl);
                        }
                        if (subAggregateTitle) {
                            return groupHeaderName + "(" + subAggregateTitle + ")";
                        }
                        else {
                            return rowContext && rowContext.__groupInfo && groupHeaderName; //+ " - " + rowContext.__groupInfo.count;
                        }

                    }

                }
            }
        }
    };
    ///**Rel 60E SP6 QA #9420 - Start 
    T.prototype.vuiScrolling = function () {
        var oControl = this;

        if (this._getScrollExtension().getVerticalScrollbar()) {
            this._getScrollExtension().getVerticalScrollbar().addEventListener("scroll", function () {
                oControl.resetCellValueChangeColor();
                oControl.addRowColor();
            });
        }

        if (oControl.getDomRef("sapUiTableColHdrScr")) {
            oControl.getDomRef("sapUiTableColHdrScr").addEventListener("scroll", function () {
                oControl.resetCellValueChangeColor();
                oControl.addRowColor();
            });
        }

        if (oControl.getDomRef("sapUiTableCtrlScr")) {
            oControl.getDomRef("sapUiTableCtrlScr").addEventListener("scroll", function () {
                oControl.resetCellValueChangeColor();
                oControl.addRowColor();
            });
        }
    };
    ///**Rel 60E SP6 QA #9420 - End   

    T.prototype.setRenderingDone = function (value) {
        this._renderingDone = value;
    };

    T.prototype.getRenderingDone = function () {
        return this._renderingDone;
    };

    T.prototype._calculateAutomaticColumnWidth = function (f) {
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

    T.prototype.createPagingControl = function () {
        this._pagingControlCreated = false;
        this.setRenderingDone(false);
    };


    T.prototype._prepareTableControls = function () {
        var oControl = this;
        this._initializeVariants();

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


        var headerToolBar = new sap.m.OverflowToolbar({
            content: [
                this._oVuiTitle,
                this._oVuiSeparator,
                this._oVariants,
                /*Filter Indicator-START*/
                this._oVuiFilterSeparator,
                this._oFilterTitle,
                /*Filter Indicator-END*/
                new sap.m.ToolbarSpacer(),
                this._oSearchField,
                this._oDetailButton,
                this._searchAndReplaceButton,
                this._exportButton,
                this._setValuesButton,
                this._quickEntryButton,
                this._massEditButton,
                this._oPersonalizationButton,
                this._fullScreenButton
            ]
        });

        //*****Rel 60E_SP6
        var variant = this._oVariants.getSelectionKey();
        if (this.isGroupingPresent() && !oControl._fields && (variant == "*standard*")) {
            oControl._fields = this.getModel(this.getModelName()).getProperty(this.getFieldPath()) || [];
            oControl._fieldGroups = this.getModel(this.getModelName()).getProperty(this.getFieldGroupPath()) || [];
        }
        //*****

        this.setToolbar(headerToolBar);
    };

    T.prototype.init = function () {
        Table.prototype.init.apply(this);

        var oControl = this;
        var sLocale = sap.ui.getCore().getConfiguration().getLanguage();
        if (sLocale.length > 2) {
            sLocale = sLocale.substring(0, 2);
        }
        this._oBundle = sap.ui.getCore().getLibraryResourceBundle(vistexConfig.rootFolder + ".ui.controls");
        //

        oControl._oChangedRowFields = [];
        this._oVuiTitle = new sap.m.Title();

        this._oVuiSeparator = new sap.m.ToolbarSeparator({
            visible: oControl.getShowTitle()
        });


        /*Filter Indicator-START*/
        this._oFilterTitle = new sap.m.Link({
            visible: false,
            press: oControl._onFilterLink.bind(oControl)
        });
        //.addStyleClass("vuiFilterTitle");

        this._oVuiFilterSeparator = new sap.m.ToolbarSeparator({
            visible: false
        });
        /*Filter Indicator-END*/


        this._oSearchField = new sap.m.SearchField({
            //*****Rel 60E_SP6 - QA #11652
            //width: "25%",
            width: "20%",
            //*****
            search: oControl._onFilterTable.bind(oControl),
            visible: oControl.getEnableLocalSearch(),
            layoutData: new sap.m.OverflowToolbarLayoutData({
                priority: sap.m.OverflowToolbarPriority.High
            })
        });


        this._oDetailButton = new sap.m.OverflowToolbarButton({
            text: this._oBundle.getText("Detail"),
            icon: "sap-icon://detail-view",
            tooltip: this._oBundle.getText("Detail"),
            type: sap.m.ButtonType.Transparent,
            press: [oControl._onDetail, oControl],
            visible: !oControl.getHideDetailButton(),
            layoutData: new sap.m.OverflowToolbarLayoutData({
                priority: sap.m.OverflowToolbarPriority.High
            })
        });

        this._oPersonalizationButton = new sap.m.OverflowToolbarButton({
            type: sap.m.ButtonType.Transparent,
            icon: "sap-icon://action-settings",
            text: this._oBundle.getText("Personalization"),
            tooltip: this._oBundle.getText("Personalization"),
            enabled: true,
            iconFirst: true,
            activeIcon: "",
            iconDensityAware: true,
            textDirection: "Inherit",
            press: oControl._onSettingPressed.bind(oControl),
            layoutData: new sap.m.OverflowToolbarLayoutData({
                priority: sap.m.OverflowToolbarPriority.High
            }),
            visible: this.getProperty("enablePersonalization")
        });

        this._exportButton = new sap.m.OverflowToolbarButton({
            type: sap.m.ButtonType.Transparent,
            icon: "sap-icon://excel-attachment",
            text: "Export",
            tooltip: "Export",
            press: oControl._ExportPress.bind(oControl),
            layoutData: new sap.m.OverflowToolbarLayoutData({
                //*****Rel 60E_SP6 - QA #11652
                //priority: sap.m.OverflowToolbarPriority.High
                priority: sap.m.OverflowToolbarPriority.Low
                //*****
            }),
            visible: true
        });
        this._searchAndReplaceButton = new sap.m.OverflowToolbarButton({
            type: sap.m.ButtonType.Transparent,
            icon: "sap-icon://inspection",
            text: this._oBundle.getText("SearchReplace"),
            tooltip: this._oBundle.getText("SearchReplace"),
            press: oControl.searchAndReplaceDialog.bind(oControl),
            visible: false,
            layoutData: new sap.m.OverflowToolbarLayoutData({
                //*****Rel 60E_SP6 - QA #11652
                //priority: sap.m.OverflowToolbarPriority.High
                priority: sap.m.OverflowToolbarPriority.Low
                //*****
            })
        });

        this._setValuesButton = new sap.m.OverflowToolbarButton({
            type: sap.m.ButtonType.Transparent,
            icon: "sap-icon://request",
            text: this._oBundle.getText("SetValues"),
            tooltip: this._oBundle.getText("SetValues"),
            press: oControl.processSetValues.bind(oControl),
            //press: oControl.setValuesDialog.bind(oControl),
            visible: false,
            layoutData: new sap.m.OverflowToolbarLayoutData({
                //*****Rel 60E_SP6 - QA #11652
                //priority: sap.m.OverflowToolbarPriority.High
                priority: sap.m.OverflowToolbarPriority.Low
                //*****
            })
        });

        this._fullScreenButton = new sap.m.OverflowToolbarButton({
            type: sap.m.ButtonType.Transparent,
            icon: {
                path: global.vui5.modelName + ">" + "/FULLSCREEN",
                formatter: function (fullScreen) {
                    return fullScreen === true ? 'sap-icon://exit-full-screen' : 'sap-icon://full-screen';
                },
                mode: sap.ui.model.BindingMode.TwoWay
            },
            visible: true,
            press: oControl.fullScreenDialog.bind(oControl)
        });

        //Mass Edit Button
        this._massEditButton = new sap.m.OverflowToolbarButton({
            type: sap.m.ButtonType.Transparent,
            icon: "sap-icon://write-new-document",
            text: this._oBundle.getText("MassEditTooltip"),
            press: oControl._onMassEdit.bind(oControl),
            tooltip: this._oBundle.getText("MassEditTooltip"),
            visible: false,
            //*****Rel 60E_SP6 - QA #11652        	
            priority: sap.m.OverflowToolbarPriority.Low
            //*****
        });

        this._vuiUpdateBindingContexts = this._updateBindingContexts;
        this._updateBindingContexts = this.vuiUpdateBindingContexts.bind(this);


        this.attachCustomFilter(this.onCustomFilter.bind(this));
        this.attachSort(this._onSort.bind(this));

        this.attachColumnFreeze(this._onColumnFreeze.bind(this));
        this._oManualColumnFreeze = false;


        this.attachColumnMove(function () {
            oControl._oVariants.currentVariantSetModified(true);
        });

        this.attachColumnResize(function () {
            /*Rel 60E SP6 QA #10138 - Start*/
            /*if (!oControl._changingColumnWidth) {
                oControl._oVariants.currentVariantSetModified(true);
            }*/
            /*Rel 60E SP6 QA #10138 - End*/
        });
        this._sortItems = [];
        this._filterItems = [];

    };
    T.prototype.vuiUpdateBindingContexts = function () {
        var oControl = this;
        var model = this.getModel(this.getModelName());
        var dataPath = this.getDataPath();
        this._vuiUpdateBindingContexts.apply(this, arguments);
        if (model.getProperty(dataPath) && model.getProperty(dataPath).length > 0 && !this._columnResizeDone) {

            this.setRenderingDone(false);
            this._columnResizeDone = true;
            this.optimizeColumnWidth();
            this.setEnableGrouping(true);
            //this.applyGroupBy();
        }

        if (model.getProperty(dataPath) && model.getProperty(dataPath).length > 0 && !oControl.applyGroup) {
            oControl.applyGroup = true;
            this.applyGroupBy();
        }



    }
    T.prototype.setHideDetailButton = function (value) {
        var oControl = this;
        this.setProperty("hideDetailButton", value, true);
        this._oDetailButton.setVisible(!value);

        if (sap.ui.getVersionInfo().version > "1.45" && !value) {

            this._oDetailButton.setVisible(false);

            if (!value) {
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

        }
    };

    T.prototype.setTotalDataPath = function (value) {
        this.setProperty("totalDataPath", value, true);
    };

    T.prototype.setTotalNumberOfRows = function (value) {
        this.setProperty("totalNumberOfRows", value, true);
    };
    T.prototype.setDisableExcelExport = function (value) {
        this.setProperty("disableExcelExport", value, true);
        var excelExport = this._exportButton;
        if (value && excelExport) {
            this._exportButton.setVisible(false);
        }
        else {
            this._exportButton.setVisible(true);
        }
    },

        T.prototype.addToolBarButton = function (control, beforeDetail) {
            var toolbar = this.getToolbar();
            var index;
            if (beforeDetail) {
                index = toolbar.indexOfContent(this._oDetailButton);
                toolbar.insertContent(control, index);
            } else {
                index = toolbar.indexOfContent(this._searchAndReplaceButton);
                toolbar.insertContent(control, index);
            }
        };

    T.prototype.removeToolBarButton = function (control) {
        var toolbar = this.getToolbar();
        toolbar.removeContent(control);
    };

    T.prototype._onDetail = function () {
        //      var oControl = this;
        var selectedItem = [];
        selectedItem = this.getSelectedRows();
        this.fireOnDetailButton({
            record: selectedItem[0]
        });
    };

    T.prototype.getHeaderToolbar = function () {
        return this.getToolbar();
    };

    T.prototype.setPageSize = function (value) {
        this.setProperty("pageSize", value, true);
        if (value && parseInt(value) != "Nan" && parseInt(value) != 0) {
            this.setProperty("visibleRowCount", parseInt(value), true);
        } else {
            //this.setProperty("visibleRowCount",10,true);
            //To Support Auto Adjust of Data based on Screen Size
            //this.setProperty("minAutoRowCount", 10, true);
            //this.setProperty("fixedRowCount", 5, true);
            //this.setProperty("visibleRowCountMode", sap.ui.table.VisibleRowCountMode.Auto, true);
        }
    };

    T.prototype.setEnablePersonalization = function (value) {
        this.setProperty("enablePersonalization", value, true);
        if (this._oPersonalizationButton) {
            this._oPersonalizationButton.setVisible(value);
        }
    };

    T.prototype.setPagingType = function (value) {
        var oControl = this;
        this.setProperty("pagingType", value, true);

        if (sap.ui.getVersionInfo().version < "1.38") {
            if (value == global.vui5.cons.pagingType.serverPaging) {
                oControl.setNavigationMode(sap.ui.table.NavigationMode.Scrollbar);
                //oControl.setEnableBusyIndicator(true);
                oControl.__createPaginator();
            } else if (value == global.vui5.cons.pagingType.virtualPaging) {
                oControl.setNavigationMode(sap.ui.table.NavigationMode.Paginator);
            } else {
                oControl.setNavigationMode(sap.ui.table.NavigationMode.Scrollbar);
                //oControl.setEnableBusyIndicator(true);
            }
        } else {
            if (value == global.vui5.cons.pagingType.serverPaging) {
                oControl.__createPaginator();
            }
        }

    };
    T.prototype.setFullScreen = function (value) {
        this.setProperty("fullScreen", value, true);
        if (this._fullScreenButton) {
            this._fullScreenButton.setVisible(value);
        }
    };

    T.prototype.__createPaginator = function () {
        var oControl = this,
            oController;

        //*****Rel 60E_SP6
        if (this._VuiPaginator) {
            return;
        }
        //*****

        oController = oControl.getProperty("controller");
        this._VuiPaginator = new sap.ui.commons.Paginator({
            currentPage: {
                path: oControl.getModelName() + ">" + oControl.getLayoutDataPath(),
                formatter: function (layoutData) {

                    var pageNumber;
                    pageNumber = layoutData === undefined ? parseInt(1) : parseInt(layoutData['PAGNO']);
                    return pageNumber;
                },
                mode: sap.ui.model.BindingMode.OneWay
            },
            numberOfPages: this.getNumberOfPages(),
            page: [this.onVuiPageChange, this],
            visible: "{= ${" + this.getNumberOfPages() + "} > 1 }"
        });

        this._VuiPaginator.setModel(oController.getCurrentModel(), oControl.getModelName());
        this._VuiPaginator.addStyleClass("vuiTablePaginator");
    };

    T.prototype.setEnableLocalSearch = function (value) {
        this.setProperty("enableLocalSearch", value, true);
        this._oSearchField.setVisible(value);
    };

    T.prototype.setCurrentPage = function (value) {
        if (this.getPagingType() == global.vui5.cons.pagingType.serverPaging) {
            if (this._VuiPaginator) {
                this._VuiPaginator.setCurrentPage(parseInt(value));
                if (this._VuiPaginator.getDomRef()) {
                    this._VuiPaginator.rerender();
                }
            }

            this.setProperty("currentPage", parseInt(value), true);
        }

    };

    T.prototype.setNumberOfPages = function (value) {
        if (this.getPagingType() == global.vui5.cons.pagingType.serverPaging) {
            if (this._VuiPaginator && value !== undefined) {
                this._VuiPaginator.setNumberOfPages(parseInt(value));
                if (this._VuiPaginator.getDomRef()) {
                    this._VuiPaginator.rerender();
                }
                this.setProperty("numberOfPages", parseInt(value), true);
            }
        }

    };

    T.prototype.setFieldGroupPath = function (value) {
        this.setProperty("fieldGroupPath", value, true);
    };

    T.prototype.setTitle = function (value) {
        this.setProperty("title", value, true);
        this._oVuiTitle.setText(value);
        this.showSeparator();
    };

    T.prototype.setShowTitle = function (value) {
        this.setProperty("showTitle", value, true);
        this._oVuiTitle.setVisible(value);
        //this._oVuiSeparator.setVisible(value);
        this.showSeparator();
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

    T.prototype.setSectionID = function (value) {
        this.setProperty("sectionID", value, true);
    };

    T.prototype.setEditable = function (value) {
        if (value != this.getEditable()) {
            this.setProperty("editable", value, true);
            //          this.prepareTableFields();
            if (value) {
                var enable = this.getEnableSearchAndReplace();
                if (enable) {
                    this._searchAndReplaceButton.setVisible(true);
                }
                else {
                    this._searchAndReplaceButton.setVisible(false);
                }

                var enableSetValues = this.getEnableSetValues();
                if (enableSetValues) {
                    this._setValuesButton.setVisible(true);
                }
                else {
                    this._setValuesButton.setVisible(false);
                }
                if (this.getEnableBulkEdit()) {
                    this._massEditButton.setVisible(true);
                } else {
                    this._massEditButton.setVisible(false);
                }
            }
        }
    };

    T.prototype.setHideVariantSave = function (value) {
        this.setProperty("hideVariantSave", value, true);
    };

    /***Rel 60E SP6 ECDM #4728 - Start ***/
    T.prototype.setHideShare = function (value) {
        this.setProperty("hideShare", value, true);
    };
    /***Rel 60E SP6 ECDM #4728 - End ***/

    T.prototype.setEnableSetValues = function (value) {
        this.setProperty("enableSetValues", value, true);
        var editable = this.getEditable();
        if (editable && !value) {
            this._setValuesButton.setVisible(true);
        } else {
            this._setValuesButton.setVisible(false);
        }
    };

    T.prototype.setEnableSearchAndReplace = function (value) {
        this.setProperty("enableSearchAndReplace", value, true);
        var editable = this.getEditable();
        if (editable && !value) {
            this._searchAndReplaceButton.setVisible(true);
        } else {
            this._searchAndReplaceButton.setVisible(false);
        }
    };

    T.prototype.setDataAreaPath = function (value) {
        this.setProperty("dataAreaPath", value, true);
        //      this.prepareTableFields();
    };

    T.prototype.setEnableRowColor = function (value) {
        this.setProperty("enableRowColor", value, true);
    };

    T.prototype.prepareTable = function () {
        var oControl = this;
        oControl._prepareTableControls();
        oControl.prepareTableFields();
        oControl.prepareTableData();
    };

    T.prototype.setHandle = function (value) {
        this.setProperty("handle", value, true);
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
        if (this.getHideVariantSave()) {
            this._oVuiSeparator.setVisible(false);

        }
    };

    T.prototype.onChangeUpdateIndicator = function (oEvent) {
        var oControl = this;
        var source = oEvent.getSource();

        var model = source.getModel(oControl.getModelName());
        /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - Start ***/
        //var path = source.getBindingContext(oControl.getModelName()).getPath();

        var path, oController, arr;
        oController = oControl.getProperty("controller");
        if (oController._isMultiInputField(source)) {
            arr = oController._getMultiInputDataPath(source).split("/");
            arr.pop();
            path = arr.join("/");
        }
        else {
            path = source.getBindingContext(oControl.getModelName()).getPath();
        }
        /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - End ***/

        var rowLine = model.getProperty(path);
        rowLine.__UPDKZ = 'X';

        model.setProperty(path, rowLine);
    };

    T.prototype.removeSelections = function () {
        this.clearSelection();
    };

    T.prototype.getSelectedItems = function () {
        var oControl = this;

        var selectedRows = this.getSelectedIndices();
        var selectedItems = [];
        var rows = this.getRows();
        if (oControl.getPagingType() == global.vui5.cons.pagingType.virtualPaging) {
            var paginator = this._oPaginator;
            var numberOfPages = paginator.getNumberOfPages();
            var currentPage = paginator.getCurrentPage();

            var difference = 0;
            if (currentPage > 1) {
                var numberOfItems = this.getBinding().aIndices.length;
                var pageSize = parseInt(oControl.getPageSize());
                //                var pageSize = Math.ceil(numberOfItems/numberOfPages);
                difference = pageSize * (currentPage - 1);
            }

            underscoreJS.each(selectedRows, function (selectedRow) {
                selectedRow = selectedRow - difference;

                if (rows[selectedRow] && rows[selectedRow].getBindingContext(oControl.getModelName())) {
                    selectedItems.push(rows[selectedRow]);
                }
            });
        } else {
            underscoreJS.each(selectedRows, function (selectedRow) {
                if (rows[selectedRow] && rows[selectedRow].getBindingContext(oControl.getModelName())) {
                    selectedItems.push(rows[selectedRow]);
                }
            });
        }

        return selectedItems;
    };

    T.prototype.getSelectedRows = function () {
        var oControl = this;
        var selectedItems = [];
        var selectedRows,
            i;
        if (oControl.getPagingType() == global.vui5.cons.pagingType.virtualPaging &&
            sap.ui.getVersionInfo().version < "1.38") {
            selectedRows = oControl.getSelectedItems();

            for (i = 0; i < selectedRows.length; i++) {
                var rowData = selectedRows[i].getBindingContext(oControl.getModelName()).getObject();
                selectedItems.push(rowData);
            }
        } else {
            selectedRows = this.getSelectedIndices();

            for (i = 0; i < selectedRows.length; i++) {
                var rowData = oControl.getContextByIndex(selectedRows[i]).getObject();
                selectedItems.push(rowData);
            }
        }
        return selectedItems;
    };


    T.prototype._onInputChange = function (selection, fieldInfo, fieldPath, refFields) {
        var oControl = this;
        if (fieldInfo['MULTISELECT']) {
            return;
        }
        if (fieldInfo['ELTYP'] == global.vui5.cons.element.checkBox) {
            selection.attachSelect(function (oEvent) {
                oControl._preProcessOnInputChange(oEvent, selection, fieldInfo, fieldPath, refFields);
                oControl.processOnInputChange(oEvent);
            });
            //*****Rel 60E_SP6 - Task #39097
        } else if (fieldInfo['ELTYP'] == global.vui5.cons.element.toggle) {
            selection.attachChange(function (oEvent) {
                oControl._preProcessOnInputChange(oEvent, selection, fieldInfo, fieldPath, refFields);
                oControl.processOnInputChange(oEvent);
            });
            //*****
        } else if (fieldInfo['ELTYP'] == global.vui5.cons.element.dropDown) {
            selection.attachChange(function (oEvent) {
                oControl._preProcessOnInputChange(oEvent, selection, fieldInfo, fieldPath, refFields);
                oControl.processOnInputChange(oEvent).then(function () {
                    oControl.setCellValueChangeColor();
                });

            });
        } else {
            if (fieldInfo['ELTYP'] !== global.vui5.cons.element.link && fieldInfo['ELTYP'] !== global.vui5.cons.element.button && fieldInfo['ELTYP'] !== vui5.cons.element.label) {
                selection.attachChange(function (oEvent) {
                    oControl._preProcessOnInputChange(oEvent, selection, fieldInfo, fieldPath, refFields);
                    oControl.processOnInputChange(oEvent).then(function () {
                        oControl.setCellValueChangeColor();
                    });
                });
            }
        }
    };
    T.prototype.setDateValue = function (value) {
        return this.setVuiDateValue(value == "0000-00-00" ? "" : value);
    };

    T.prototype.prepareTableFields = function () {
        var oControl = this;
        var fieldPath = this.getFieldPath();
        var modelName = this.getModelName();
        var editable = this.getEditable();
        var multiValue;
        var oController = this.getController();

        var dataAreaPath = this.getDataAreaPath();
        var fieldGroupPath = this.getFieldGroupPath();
        var fields = oControl.getModel(modelName).getProperty(fieldPath);

        if (sap.ui.getVersionInfo().version >= "1.48" && oControl.getEnableRowColor()) {
            this.setRowSettingsTemplate(new sap.ui.table.RowSettings({
                highlight: sap.ui.core.MessageType.Success
            }));
        }


        if (oControl.isGroupingPresent()) {
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
                                    //design: sap.m.LabelDesign.Bold,
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
                    //sortProperty: sortPropertyFieldName,
                    //filterProperty: sortPropertyFieldName,
                    //                        defaultFilterOperator: filterOperator,
                    flexible: true,
                    resizable: true,
                    autoResizable: true
                });

                if (oControl.getEnablePersonalization()) {
                    column.setSortProperty(sortPropertyFieldName);
                    column.setFilterProperty(sortPropertyFieldName);
                }
                column.data("contextObject", groupObject);
                return column;
            });
        }
        else if (modelName && fieldPath && dataAreaPath) {

            this.bindColumns(modelName + ">" + fieldPath, function (sid, oContext) {

                var contextObject = oContext.getObject();
                var path = oContext.getPath();

                oControl.setRenderingDone(false);
                var arr = path.split('/');
                var index = arr[arr.length - 1];

                var fields = oControl.getModel(modelName).getProperty(fieldPath);

                var dataArea = oControl.getModel(modelName).getProperty(oControl.getDataAreaPath());

                var hAlign;
                if (contextObject['FLSTL'] == global.vui5.cons.styleType.icon) {
                    hAlign = sap.ui.core.TextAlign.Center;
                }
                else if (contextObject['INTTYPE'] == global.vui5.cons.intType.number ||

                    contextObject['INTTYPE'] == global.vui5.cons.intType.date ||
                     contextObject['INTTYPE'] == global.vui5.cons.intType.time ||
                    contextObject['INTTYPE'] == global.vui5.cons.intType.integer ||
                    contextObject['INTTYPE'] == global.vui5.cons.intType.oneByteInteger ||
                    contextObject['INTTYPE'] == global.vui5.cons.intType.twoByteInteger ||
                    contextObject['INTTYPE'] == global.vui5.cons.intType.packed ||
                    contextObject['INTTYPE'] == global.vui5.cons.intType.float ||
                    contextObject['INTTYPE'] == global.vui5.cons.intType.decimal16 ||
                    contextObject['INTTYPE'] == global.vui5.cons.intType.decimal32) {
                    hAlign = sap.ui.core.TextAlign.Right;
                }
                else {
                    hAlign = sap.ui.core.TextAlign.Left;
                }

                var bindingMode;
                var template;
                var func,
                    lv_editable;

                template = oControl.prepareCellTemplate(oContext);

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
                if (contextObject['INTTYPE'] == global.vui5.cons.intType.number ||
                    contextObject['INTTYPE'] == global.vui5.cons.intType.date ||
                    contextObject['INTTYPE'] == global.vui5.cons.intType.time ||
                    contextObject['INTTYPE'] == global.vui5.cons.intType.integer ||
                    contextObject['INTTYPE'] == global.vui5.cons.intType.oneByteInteger ||
                    contextObject['INTTYPE'] == global.vui5.cons.intType.twoByteInteger ||
                    contextObject['INTTYPE'] == global.vui5.cons.intType.packed ||
                    contextObject['INTTYPE'] == global.vui5.cons.intType.float ||
                    contextObject['INTTYPE'] == global.vui5.cons.intType.decimal16 ||
                    contextObject['INTTYPE'] == global.vui5.cons.intType.decimal32) {
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
                    //minWidth: 200,
                    width: "200px",

                    visible: visible, //"{= ${" + modelName + ">" + path + "/TECH} !== 'X' && ${"+ modelName + ">" + path + "/NO_OUT} === ''}",
                    label: new Label({
                        //text: contextObject['LABEL']
                        //*****Rel 60E_SP6
                        visible: "{= ${" + modelName + ">" + oContext.getPath() + "/HDLBL} === '' }",
                        //*****
                        text: "{" + modelName + ">" + path + "/LABEL}"
                    }),
                    template: template,
                    //sortProperty: fieldname,
                    //filterProperty: fieldname,
                    defaultFilterOperator: filterOperator,
                    flexible: true,
                    resizable: true,
                    autoResizable: true
                });

                if (oControl.getEnablePersonalization()) {
                    column.setSortProperty(fieldname);
                    column.setFilterProperty(fieldname);
                }

                if (oControl.getBackendSortFilter()) {
                    column._afterSort = oControl._afterColumnSort.bind(oControl);
                }


                var filterItem = underscoreJS.find(oControl._filterItems, {
                    'COLUMNKEY': contextObject['FLDNAME']
                });
                if (filterItem) {
                    column.setFiltered(true);
                } else {
                    column.setFiltered(false);
                }


                var sortItem = underscoreJS.find(oControl._sortItems, {
                    'COLUMNKEY': contextObject['FLDNAME']
                });
                if (sortItem) {
                    column.setSorted(true);
                    if (sortItem['OPERATION'] == "Descending") {
                        column.setSortOrder(sap.ui.table.SortOrder.Descending);
                    } else {
                        column.setSortOrder(sap.ui.table.SortOrder.Ascending);
                    }
                } else {
                    column.setSorted(false);
                }

                var columnItem = underscoreJS.find(oControl._columnItems, {
                    'COLUMNKEY': contextObject['FLDNAME']
                });
                if (columnItem) {
                    oControl._performPersonalization = true;
                    /*Save Width in Variant-START*/
                    /*Rel 60E SP6 QA #10138 - Start*/
                    /*if (columnItem['WIDTH']) {
                        column.setWidth(columnItem['WIDTH']);
                    }*/
                    /*Rel 60E SP6 QA #10138 - End*/
                    /*Save Width in Variant-END*/
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
                column.data("contextObject", contextObject);
                return column;
            });

        }

        var oFooter = new sap.m.Text({});
        oFooter.bindProperty("visible", {
            parts: [{ path: oControl.getModelName() + ">" + oControl.getTotalDataPath() + "TOTAL" + "/" },
                       { path: oControl.getModelName() + ">" + oControl.getTotalDataPath() + "MAX" + "/" },
                       { path: oControl.getModelName() + ">" + oControl.getTotalDataPath() + "MIN" + "/" },
                        { path: oControl.getModelName() + ">" + oControl.getTotalDataPath() + "AVG" + "/" }],
            formatter: function (total, max, min, avg) {
                return !!total || !!max || !!min || !!avg;
            }
        });

        oFooter.bindProperty("text", {
            parts: [{ path: oControl.getModelName() + ">" + oControl.getTotalDataPath() + "TOTAL" + "/" },
                        { path: oControl.getModelName() + ">" + oControl.getTotalDataPath() + "MAX" + "/" },
                        { path: oControl.getModelName() + ">" + oControl.getTotalDataPath() + "MIN" + "/" },
                        { path: oControl.getModelName() + ">" + oControl.getTotalDataPath() + "AVG" + "/" }],


            formatter: function (total, max, min, avg) {
                if (!total && !max && !min && !avg) {
                    return "";
                }

                var fields = oControl.getModel(oControl.getModelName()).getProperty(oControl.getFieldPath());
                var text;

                if (!underscoreJS.isEmpty(total)) {
                    underscoreJS.each(Object.keys(total), function (keyValue) {
                        var field = underscoreJS.findWhere(fields, { 'FLDNAME': keyValue });
                        if (text === undefined) {
                            text = field['LABEL'] + ":" + total[keyValue];
                        }
                        else {
                            text = text + " , " + field['LABEL'] + ":" + total[keyValue];
                        }

                    });
                }

                if (!underscoreJS.isEmpty(max)) {
                    underscoreJS.each(Object.keys(max), function (keyValue) {
                        var field = underscoreJS.findWhere(fields, { 'FLDNAME': keyValue });
                        if (text === undefined) {
                            text = oControl._oBundle.getText("Max") + ". " + field['LABEL'] + ":" + max[keyValue];
                        }
                        else {
                            text = text + " , " + oControl._oBundle.getText("Max") + ". " + field['LABEL'] + ":" + max[keyValue];
                        }

                    });
                }

                if (!underscoreJS.isEmpty(min)) {
                    underscoreJS.each(Object.keys(min), function (keyValue) {
                        var field = underscoreJS.findWhere(fields, { 'FLDNAME': keyValue });
                        if (text === undefined) {
                            text = oControl._oBundle.getText("Min") + ". " + field['LABEL'] + ":" + min[keyValue];
                        }
                        else {
                            text = text + " , " + oControl._oBundle.getText("Min") + ". " + field['LABEL'] + ":" + min[keyValue];
                        }

                    });
                }

                if (!underscoreJS.isEmpty(avg)) {
                    underscoreJS.each(Object.keys(avg), function (keyValue) {
                        var field = underscoreJS.findWhere(fields, { 'FLDNAME': keyValue });
                        if (text === undefined) {
                            text = oControl._oBundle.getText("Avg") + ". " + field['LABEL'] + ":" + avg[keyValue];
                        }
                        else {
                            text = text + " , " + oControl._oBundle.getText("Avg") + ". " + field['LABEL'] + ":" + avg[keyValue];
                        }

                    });
                }

                return text;
            },

        });

        this.setFooter(oFooter);
    };

    T.prototype.setDisplayFieldColor = function (contextObject, modelName, dataArea, fields, oContext) {
        var bindingMode = sap.ui.model.BindingMode.OneWay;
        var oControl = this, path;
        var template;

        if (contextObject['FLSTL'] == global.vui5.cons.styleType.icon) {
            template = oControl.__createIconControl(contextObject, modelName);
        } else if (contextObject['KEY'] == 'X') {

            /*template = new sap.m.Label({
                design: sap.m.LabelDesign.Bold
            });*/

            template = new sap.m.Text({
                //design: sap.m.LabelDesign.Bold
            }).addStyleClass("vuibold");

            if (contextObject['ELTYP'] == global.vui5.cons.element.objectStatus) {
                var metadata, metadataObj, fldname, icon, active, label, state, path1;
                metadata = contextObject['METADATA'];
                metadataObj = JSON.parse(metadata);

                fldname = metadataObj['TEXT_FIELD'];
                icon = metadataObj['ICON_FIELD'];
                active = metadataObj['ACTIVE'] == "X" ? true : false;
                label = metadataObj['TITLE_FIELD'];
                state = metadataObj['STATE_FIELD'];
                path1 = contextObject['FLDNAME'];
                if ((contextObject['SDSCR'] === global.vui5.cons.fieldValue.description ||
                        contextObject['SDSCR'] === global.vui5.cons.fieldValue.value_cont_descr) && contextObject['TXTFL']) {
                    path1 = contextObject['TXTFL'];
                }
                template = new sap.m.ObjectStatus({
                    active: active
                }).bindProperty("text", modelName + ">" + fldname, null, bindingMode)
             	.bindProperty("icon", modelName + ">" + icon, null, bindingMode)
             	.bindProperty("state", modelName + ">" + state, function (val) {
             	    if (val === global.vui5.cons.stateConstants.Error) {
             	        return sap.ui.core.ValueState.Error;
             	    }
             	    else if (val === global.vui5.cons.stateConstants.Warning) {
             	        return sap.ui.core.ValueState.Information;

             	    } else if (val === global.vui5.cons.stateConstants.None) {
             	        return sap.ui.core.ValueState.None;

             	    } else if (val === global.vui5.cons.stateConstants.Success) {
             	        return sap.ui.core.ValueState.Success;
             	    }
             	    else {
             	        return sap.ui.core.ValueState.None;
             	    }
             	}, sap.ui.model.BindingMode.OneWay);
                template.data("fieldname", path1);
                template.data("fieldInfo", contextObject);

                if (label)
                    template.bindProperty('title', modelName + ">" + label, null, bindingMode);
                if (active)
                    template.attachPress(oControl.onFieldClick, oControl);
            }
            else if (contextObject['ELTYP'] == global.vui5.cons.element.dropDown) {
                if (contextObject['FLSTL'] == global.vui5.cons.styleType.color) {
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
                                path: global.vui5.modelName + '>' + "/DROPDOWNS/" + dataArea + "/" + contextObject['FLDNAME']
                            }]
                    });
                } else {
                    template.bindProperty("text", {
                        formatter: Formatter.dropdownDescriptionGet,
                        parts: [{
                            path: modelName + ">" + contextObject['FLDNAME']
                        },
                            {
                                path: global.vui5.modelName + '>' + "/DROPDOWNS/" + dataArea + "/" + contextObject['FLDNAME']
                            }]
                    });
                }
            }
            else if (contextObject['ELTYP'] == global.vui5.cons.element.progressIndicator) {
                var txtPath;
                if (contextObject['TXTFL'])
                    txtPath = modelName + ">" + contextObject['TXTFL'];
                else
                    txtPath = modelName + ">" + contextObject['FLDNAME'];

                template = new sap.m.ProgressIndicator({
                    //*****Rel 60E_SP6
                    state: sap.ui.core.ValueState.Success
                    //*****
                }).bindProperty("displayValue", {
                    parts: [{ path: txtPath }],
                    formatter: function (val) {
                        return parseFloat(val) + "%";
                    },
                    mode: sap.ui.model.BindingMode.OneWay
                }).bindProperty("percentValue", {
                    parts: [{ path: txtPath }
                    ],
                    formatter: function (val) {
                        return parseFloat(val);
                    },
                    mode: sap.ui.model.BindingMode.OneWay
                })
                //            	template = new sap.m.ProgressIndicator({
                //      		  displayValue:"{" + modelName + ">" + contextObject['FLDNAME'] + "}%",
                //      	        }).bindProperty("percentValue", modelName + ">" + contextObject['FLDNAME'], null, sap.ui.model.BindingMode.OneWay);
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

                    //*****Rel 60E_SP6 - Button Style Changes
                    if (contextObject['ELTYP'] === global.vui5.cons.element.button) {
                        if (!underscoreJS.isEmpty(contextObject['BTSTL']) && contextObject['BTSTL'] === global.vui5.cons.buttonStyle.message) {
                            params['icon'] = "sap-icon://message-popup";
                        }
                    }
                    //*****

                    template = contextObject['ELTYP'] == global.vui5.cons.element.link ? new sap.m.Link(params) : new sap.m.Button(params);

                    /***Rel 60E SP6 - Currency Related Changes - Start ***/
                    //template.bindProperty("text", modelName + ">" + path, null, sap.ui.model.BindingMode.OneWay);
                    if (contextObject['DATATYPE'] == global.vui5.cons.dataType.amount) {
                        template.bindProperty("text", {
                            path: modelName + ">" + path,
                            formatter: function (value) {
                                return oControl.getController().convertValueToUserFormat(value, contextObject['DECIMALS']);
                            },
                            mode: sap.ui.model.BindingMode.OneWay
                        });
                    }
                    else {
                        template.bindProperty("text", modelName + ">" + path, null, sap.ui.model.BindingMode.OneWay);
                    }
                    /***Rel 60E SP6 - Currency Related Changes - End ***/

                    template.data("fieldname", path);
                    template.data("fieldInfo", contextObject);
                } else if (contextObject['CFIELDNAME'] != "") {
                    /***Rel 60E SP6 - Currency Related Changes - Start ***/
                    path = contextObject['FLDNAME'];
                    if ((contextObject['SDSCR'] === global.vui5.cons.fieldValue.description ||
                            contextObject['SDSCR'] === global.vui5.cons.fieldValue.value_cont_descr) && contextObject['TXTFL']) {
                        path = contextObject['TXTFL'];
                    }
                    /***Rel 60E SP6 - Currency Related Changes - End ***/
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
                    /***Rel 60E SP6 - Currency Related Changes - Start ***/
                    if (cfieldname) {
                        var params = {
                            press: [oControl.onFieldClick, oControl],
                            text: {
                                parts: [{
                                    path: modelName + ">" + path
                                },
                                    {
                                        path: modelName + ">" + cfieldname
                                    }],
                                formatter: function (value, cfieldname) {
                                    if (value === undefined || value === null) {
                                        return '';
                                    }
                                    return oControl.getController().convertValueToUserFormat(value, contextObject['DECIMALS']) + " " + cfieldname;
                                },
                                mode: bindingMode
                            },
                            //*****Rel 60E_SP6
                            enabled: enabled
                            //*****
                        }
                    }
                    else {
                        var params = {
                            press: [oControl.onFieldClick, oControl],
                            text: {
                                parts: [{
                                    path: modelName + ">" + path
                                }],
                                formatter: function (value) {
                                    if (value === undefined || value === null) {
                                        return '';
                                    }
                                    return oControl.getController().convertValueToUserFormat(value, contextObject['DECIMALS']);
                                },
                                mode: bindingMode
                            },
                            //*****Rel 60E_SP6
                            enabled: enabled
                            //*****
                        }
                    }
                    /***Rel 60E SP6 - Currency Related Changes - End ***/
                    //*****Rel 60E_SP6 - Button Style Changes
                    if (contextObject['ELTYP'] === global.vui5.cons.element.button) {
                        if (!underscoreJS.isEmpty(contextObject['BTSTL']) && contextObject['BTSTL'] === global.vui5.cons.buttonStyle.message) {
                            params['icon'] = "sap-icon://message-popup";
                        }
                    }
                    //*****

                    template = contextObject['ELTYP'] == global.vui5.cons.element.link ? new sap.m.Link(params) : new sap.m.Button(params);

                    template.data("fieldname", path);
                    template.data("fieldInfo", contextObject);
                }

                //*****Rel 60E_SP6 - Button Style Changes
                if (contextObject['ELTYP'] === global.vui5.cons.element.button) {
                    if (!underscoreJS.isEmpty(contextObject['STYLES'])) {
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
                    else if (!underscoreJS.isEmpty(contextObject['BTSTL'])) {
                        if (contextObject['BTSTL'] === global.vui5.cons.buttonStyle.accept) {
                            oType = sap.m.ButtonType.Accept;
                        }
                        else if (contextObject['BTSTL'] === global.vui5.cons.buttonStyle.reject) {
                            oType = sap.m.ButtonType.Reject;
                        }
                        else if (contextObject['BTSTL'] === global.vui5.cons.buttonStyle.transparent) {
                            oType = sap.m.ButtonType.Transparent;
                        }
                        else if (contextObject['BTSTL'] === global.vui5.cons.buttonStyle.message) {
                            oType = sap.m.ButtonType.Emphasized;
                            template.bindProperty("visible", modelName + ">" + path, function (val) {
                                if (val != undefined) {
                                    if (parseInt(val) === 0) {
                                        return false;
                                    }
                                    else {
                                        return true;
                                    }
                                }
                            }, sap.ui.model.BindingMode.OneWay);
                        }
                        template.setProperty("type", oType);
                    }

                }
                //*****

                //Hotspot Click Changes - End

            }
                //Hotspot Click Changes - End

            else if (contextObject['DATATYPE'] == global.vui5.cons.dataType.date) {
                if (contextObject['FLSTL'] == global.vui5.cons.styleType.color) {
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
                if (contextObject['SDSCR'] == global.vui5.cons.fieldValue.description
                    || contextObject['SDSCR'] == global.vui5.cons.fieldValue.value_cont_descr) {
                    if (contextObject['FLSTL'] == global.vui5.cons.styleType.color) {
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

                } else if (contextObject['SDSCR'] == global.vui5.cons.fieldValue.value) {

                    oControl.setFieldColor(
                        contextObject,
                        template,
                        "text",
                        modelName + ">" + contextObject['FLDNAME'],
                        bindingMode,
                        fields);

                } else if (contextObject['SDSCR'] == global.vui5.cons.fieldValue.value_descr) {

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

                case global.vui5.cons.element.dropDown:
                    if (contextObject['MULTISELECT']) {
                        var multiValue = new global.vui5.ui.controls.MultiValue({
                            modelName: oControl.getModelName(),
                            elementType: contextObject['ELTYP'],
                            /***Rel 60E SP7 QA #12093**/
                            // fieldPath: oContext.getPath()
                            fieldPath: oContext.getPath() + "/",
                            /***/
                            dataPath: contextObject['FLDNAME'],
                            commaSeparator: contextObject['MVFLD'] === "",
                            dataAreaID: oControl.getModel(oControl.getModelName()).getProperty(oControl.getDataAreaPath()),
                            editable: false,
                            enabled: false
                        });

                        multiValue.setModel(oControl.getModel(oControl.getModelName()), oControl.getModelName());
                        multiValue.setModel(oControl.getModel(global.vui5.modelName), global.vui5.modelName);
                        template = multiValue.prepareField();
                        template.data("fromNonResponsive", true);
                    }
                    else {


                        template = new sap.m.Text();

                        if (contextObject['FLSTL'] == global.vui5.cons.styleType.color) {
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
                                        path: global.vui5.modelName + '>' + "/DROPDOWNS/" + dataArea + "/" + contextObject['FLDNAME']
                                    }]
                            });
                        } else {
                            template.bindText({
                                formatter: Formatter.dropdownDescriptionGet,
                                parts: [{
                                    path: modelName + ">" + contextObject['FLDNAME']
                                },
                                    {
                                        path: global.vui5.modelName + '>' + "/DROPDOWNS/" + dataArea + "/" + contextObject['FLDNAME']
                                    }]
                            });
                        }
                    }

                    //                  template = new sap.m.ComboBox({
                    //                  editable: false
                    //                  });
                    //                  template.bindAggregation("items",global.vui5.modelName + '>' + "/DROPDOWNS/" + dataArea + "/" + contextObject['FLDNAME'],function(sid,oContext){
                    //                  var contextObject = oContext.getObject();
                    //                  return new sap.ui.core.Item({
                    //                  key: contextObject['NAME'],
                    //                  text: contextObject['VALUE']
                    //                  });
                    //                  });

                    //                  if(contextObject['FLSTL'] == global.vui5.cons.styleType.color){
                    //                  template.bindProperty("selectedKey",modelName + ">" + contextObject['FLDNAME'],function(cellValue){
                    //                  var cellValue = oControl.__setColor.call(this,dataArea,contextObject,cellValue);
                    //                  return cellValue;
                    //                  },bindingMode);
                    //                  }else{
                    //                  template.bindProperty("selectedKey",modelName + ">" + contextObject['FLDNAME'],null,bindingMode);
                    //                  }
                    break;
                case global.vui5.cons.element.objectStatus:
                    var metadata, metadataObj, fldname, icon, active, label, state, path1;
                    metadata = contextObject['METADATA'];
                    metadataObj = JSON.parse(metadata);

                    fldname = metadataObj['TEXT_FIELD'];
                    icon = metadataObj['ICON_FIELD'];
                    active = metadataObj['ACTIVE'] == "X" ? true : false;
                    label = metadataObj['TITLE_FIELD'];
                    state = metadataObj['STATE_FIELD'];
                    path1 = contextObject['FLDNAME'];
                    if ((contextObject['SDSCR'] === global.vui5.cons.fieldValue.description ||
                            contextObject['SDSCR'] === global.vui5.cons.fieldValue.value_cont_descr) && contextObject['TXTFL']) {
                        path1 = contextObject['TXTFL'];
                    }
                    template = new sap.m.ObjectStatus({
                        active: active
                    }).bindProperty("text", modelName + ">" + fldname, null, bindingMode)
                	.bindProperty("icon", modelName + ">" + icon, null, bindingMode)
                	.bindProperty("state", modelName + ">" + state, function (val) {
                	    if (val === global.vui5.cons.stateConstants.Error) {
                	        return sap.ui.core.ValueState.Error;
                	    }
                	    else if (val === global.vui5.cons.stateConstants.Warning) {
                	        return sap.ui.core.ValueState.Information;

                	    } else if (val === global.vui5.cons.stateConstants.None) {
                	        return sap.ui.core.ValueState.None;

                	    } else if (val === global.vui5.cons.stateConstants.Success) {
                	        return sap.ui.core.ValueState.Success;
                	    }
                	    else {
                	        return sap.ui.core.ValueState.None;
                	    }
                	}, sap.ui.model.BindingMode.OneWay);
                    template.data("fieldname", path1);
                    template.data("fieldInfo", contextObject);

                    if (label)
                        template.bindProperty('title', modelName + ">" + label, null, bindingMode);
                    if (active)
                        template.attachPress(oControl.onFieldClick, oControl);

                    break;
                case global.vui5.cons.element.checkBox:
                    template = new sap.m.CheckBox({
                        editable: false,
                        selected: "{= ${" + modelName + ">" + contextObject['FLDNAME'] + "} === 'X' }"
                    });
                    break;
                    //*****Rel 60E_SP6 - Task #39097
                case global.vui5.cons.element.toggle:
                    template = new sap.m.Switch({
                        enabled: false,
                        state: "{= ${" + modelName + ">" + contextObject['FLDNAME'] + "} === 'X' }"
                    });
                    break;
                    //*****    
                case global.vui5.cons.element.progressIndicator:

                    var txtPath;
                    if (contextObject['TXTFL'])
                        txtPath = modelName + ">" + contextObject['TXTFL'];
                    else
                        txtPath = modelName + ">" + contextObject['FLDNAME'];

                    template = new sap.m.ProgressIndicator({
                        //*****Rel 60E_SP6
                        state: sap.ui.core.ValueState.Success
                        //*****
                    }).bindProperty("displayValue", {
                        parts: [{ path: txtPath }],
                        formatter: function (val) {
                            return parseFloat(val) + "%";
                        },
                        mode: sap.ui.model.BindingMode.OneWay
                    }).bindProperty("percentValue", {
                        parts: [{ path: txtPath }
                        ],
                        formatter: function (val) {
                            return parseFloat(val);
                        },
                        mode: sap.ui.model.BindingMode.OneWay
                    })
                    //                    	template = new sap.m.ProgressIndicator({
                    //              		  displayValue:"{" + modelName + ">" + contextObject['FLDNAME'] + "}%",
                    //              	        }).bindProperty("percentValue", modelName + ">" + contextObject['FLDNAME'], null, sap.ui.model.BindingMode.OneWay);

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

                        //*****Rel 60E_SP6 - Button Style Changes
                        if (contextObject['ELTYP'] === global.vui5.cons.element.button) {
                            if (!underscoreJS.isEmpty(contextObject['BTSTL']) && contextObject['BTSTL'] === global.vui5.cons.buttonStyle.message) {
                                params['icon'] = "sap-icon://message-popup";
                            }
                        }
                        //*****

                        template = contextObject['ELTYP'] == global.vui5.cons.element.link ? new sap.m.Link(params) : new sap.m.Button(params);
                        /***Rel 60E SP6 - Currency Related Changes - Start ***/
                        //template.bindProperty("text", modelName + ">" + path, null, sap.ui.model.BindingMode.OneWay);
                        if (contextObject['DATATYPE'] == global.vui5.cons.dataType.amount) {
                            template.bindProperty("text", {
                                path: modelName + ">" + path,
                                formatter: function (value) {
                                    return oControl.getController().convertValueToUserFormat(value, contextObject['DECIMALS']);
                                },
                                mode: sap.ui.model.BindingMode.OneWay
                            });
                        }
                        else {
                            template.bindProperty("text", modelName + ">" + path, null, sap.ui.model.BindingMode.OneWay);
                        }
                        /***Rel 60E SP6 - Currency Related Changes - End ***/
                        //                   
                        template.data("fieldname", path);
                        template.data("fieldInfo", contextObject);
                    } else if (contextObject['CFIELDNAME'] != "") {
                        if ((contextObject['SDSCR'] === global.vui5.cons.fieldValue.description ||
                                contextObject['SDSCR'] === global.vui5.cons.fieldValue.value_cont_descr) && contextObject['TXTFL']) {
                            path = contextObject['TXTFL'];
                        }
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
                        /***Rel 60E SP6 - Currency Related Changes - Start ***/
                        if (cfieldname) {
                            var params = {
                                press: [oControl.onFieldClick, oControl],
                                text: {
                                    parts: [{
                                        path: modelName + ">" + path
                                    },
                                        {
                                            path: modelName + ">" + cfieldname
                                        }],
                                    formatter: function (value, cfieldname) {
                                        if (value === undefined || value === null) {
                                            return '';
                                        }
                                        return oControl.getController().convertValueToUserFormat(value, contextObject['DECIMALS']) + " " + cfieldname;
                                    },
                                    mode: bindingMode
                                },
                                //*****Rel 60E_SP6
                                enabled: enabled
                                //*****
                            }
                        }
                        else {
                            var params = {
                                press: [oControl.onFieldClick, oControl],
                                text: {
                                    parts: [{
                                        path: modelName + ">" + path
                                    }],
                                    formatter: function (value) {
                                        if (value === undefined || value === null) {
                                            return '';
                                        }
                                        return oControl.getController().convertValueToUserFormat(value, contextObject['DECIMALS']);
                                    },
                                    mode: bindingMode
                                },
                                //*****Rel 60E_SP6
                                enabled: enabled
                                //*****
                            }
                        }
                        /***Rel 60E SP6 - Currency Related Changes - End ***/

                        //*****Rel 60E_SP6 - Button Style Changes
                        if (contextObject['ELTYP'] === global.vui5.cons.element.button) {
                            if (!underscoreJS.isEmpty(contextObject['BTSTL']) && contextObject['BTSTL'] === global.vui5.cons.buttonStyle.message) {
                                params['icon'] = "sap-icon://message-popup";
                            }
                        }
                        //*****                        

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

                    //*****Rel 60E_SP6 - Button Style Changes
                    if (contextObject['ELTYP'] === global.vui5.cons.element.button) {
                        if (!underscoreJS.isEmpty(contextObject['STYLES'])) {
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
                        else if (!underscoreJS.isEmpty(contextObject['BTSTL'])) {
                            if (contextObject['BTSTL'] === global.vui5.cons.buttonStyle.accept) {
                                oType = sap.m.ButtonType.Accept;
                            }
                            else if (contextObject['BTSTL'] === global.vui5.cons.buttonStyle.reject) {
                                oType = sap.m.ButtonType.Reject;
                            }
                            else if (contextObject['BTSTL'] === global.vui5.cons.buttonStyle.transparent) {
                                oType = sap.m.ButtonType.Transparent;
                            }
                            else if (contextObject['BTSTL'] === global.vui5.cons.buttonStyle.message) {
                                oType = sap.m.ButtonType.Emphasized;
                                template.bindProperty("visible", modelName + ">" + path, function (val) {
                                    if (val != undefined) {
                                        if (parseInt(val) === 0) {
                                            return false;
                                        }
                                        else {
                                            return true;
                                        }
                                    }
                                }, sap.ui.model.BindingMode.OneWay);
                            }
                            template.setProperty("type", oType);
                        }
                    }
                    //*****

                    //Hotspot Click Changes - End
                    break;

                default:
                    if (contextObject['MULTISELECT'] && contextObject['ELTYP'] === global.vui5.cons.element.valueHelp) {
                        var multiValue = new global.vui5.ui.controls.MultiValue({
                            modelName: oControl.getModelName(),
                            elementType: contextObject['ELTYP'],
                            /***Rel 60E SP7 QA #12093 **/
                            // fieldPath: oContext.getPath(),
                            fieldPath: oContext.getPath() + "/",
                            /****/
                            dataPath: contextObject['FLDNAME'],
                            commaSeparator: contextObject['MVFLD'] === "",
                            editable: false,
                            enabled: true
                        });

                        multiValue.setModel(oControl.getModel(oControl.getModelName()), oControl.getModelName());
                        multiValue.setModel(oControl.getModel(global.vui5.modelName), global.vui5.modelName);
                        template = multiValue.prepareField();
                        template.data("fromNonResponsive", true);

                    }
                        /***Rel 60E SP6 - Object Number Changes - Start ***/
                        //else if (contextObject['DATATYPE'] == global.vui5.cons.dataType.amount && contextObject['CFIELDNAME'] != "") {
                    else if (contextObject['DATATYPE'] == global.vui5.cons.dataType.amount) {
                        /***Rel 60E SP6 - Object Number Changes - End ***/
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

                        /***Rel 60E SP6 - Object Number Changes - Start ***/


                        if (contextObject['TXTFL']) {
                            template = new sap.m.ObjectNumber({
                                emphasized: false,
                                number: {
                                    path: modelName + ">" + contextObject['TXTFL'],
                                    formatter: function (value) {
                                        if (contextObject['FLSTL'] == global.vui5.cons.styleType.color) {
                                            return oControl.__setColor.call(this, dataArea, contextObject, value, null, false, false);
                                        }
                                        else {
                                            return value;
                                        }

                                    }
                                }
                            });
                        }
                        else {
                            template = new sap.m.ObjectNumber({
                                emphasized: false,
                                number: {
                                    path: modelName + ">" + contextObject['FLDNAME'],
                                    type: new sap.ui.model.type.Float({
                                        decimals: parseInt(contextObject['DECIMALS'])
                                    }),
                                    formatter: function (value) {
                                        if (contextObject['FLSTL'] == global.vui5.cons.styleType.color) {
                                            return oControl.__setColor.call(this, dataArea, contextObject, value, null, false, false);
                                        }
                                        else {
                                            return value;
                                        }
                                    }
                                }
                            });
                        }

                        if (cfieldname) {
                            template.bindProperty("unit", modelName + ">" + cfieldname, null, sap.ui.model.BindingMode.TwoWay);
                        }
                        /*template = new sap.m.Text();
    
                        if (contextObject['FLSTL'] == global.vui5.cons.styleType.color) {
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
                        }*/
                        /***Rel 60E SP6 - Object Number Changes - End ***/

                    }
                        /***Rel 60E SP6 - Object Number Changes - Start ***/
                        //                    else if (contextObject['DATATYPE'] == global.vui5.cons.dataType.quantity && contextObject['QFIELDNAME'] != "") {
                    else if (contextObject['DATATYPE'] == global.vui5.cons.dataType.quantity) {
                        /***Rel 60E SP6 - Object Number Changes - End ***/

                        var qfieldname;
                        var qfield = underscoreJS.find(fields, {
                            'FLDNAME': contextObject['QFIELDNAME']
                        });
                        if (qfield) {
                            if (qfield['TXTFL'] != '') {
                                qfieldname = qfield['TXTFL'];
                            }
                            else {
                                qfieldname = contextObject['QFIELDNAME'];
                            }
                        }

                        /***Rel 60E SP6 - Object Number Changes - Start ***/


                        if (contextObject['TXTFL']) {
                            template = new sap.m.ObjectNumber({
                                emphasized: false,
                                number: {
                                    path: modelName + ">" + contextObject['TXTFL'],
                                    formatter: function (value) {
                                        if (contextObject['FLSTL'] == global.vui5.cons.styleType.color) {
                                            return oControl.__setColor.call(this, dataArea, contextObject, value, null, false, false);
                                        }
                                        else {
                                            return value;
                                        }

                                    }
                                }
                            });
                        }
                        else {
                            template = new sap.m.ObjectNumber({
                                emphasized: false,
                                number: {
                                    path: modelName + ">" + contextObject['FLDNAME'],
                                    type: new sap.ui.model.type.Float({
                                        decimals: parseInt(contextObject['DECIMALS'])
                                    }),
                                    formatter: function (value) {
                                        if (contextObject['FLSTL'] == global.vui5.cons.styleType.color) {
                                            return oControl.__setColor.call(this, dataArea, contextObject, value, null, false, false);
                                        }
                                        else {
                                            return value;
                                        }
                                    }
                                }
                            });
                        }

                        if (qfieldname) {
                            template.bindProperty("unit", modelName + ">" + qfieldname, null, sap.ui.model.BindingMode.TwoWay);
                        }

                        /*template = new sap.m.Text();
    
                        if (contextObject['FLSTL'] == global.vui5.cons.styleType.color) {
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
                        }*/
                        /***Rel 60E SP6 - Object Number Changes - End ***/

                    } else if (contextObject['DATATYPE'] == global.vui5.cons.dataType.decimal ||
                        contextObject['DATATYPE'].substr(0, 3) == global.vui5.cons.dataType.integer) {

                        /***Rel 60E SP6 - Object Number Changes - Start ***/
                        if (contextObject['TXTFL']) {
                            template = new sap.m.ObjectNumber({
                                emphasized: false,
                                number: {
                                    path: modelName + ">" + contextObject['TXTFL'],
                                    formatter: function (value) {
                                        if (contextObject['FLSTL'] == global.vui5.cons.styleType.color) {
                                            return oControl.__setColor.call(this, dataArea, contextObject, value, null, false, false);
                                        }
                                        else {
                                            return value;
                                        }

                                    }
                                }
                            });
                        }
                        else {
                            template = new sap.m.ObjectNumber({
                                emphasized: false,
                                number: {
                                    path: modelName + ">" + contextObject['FLDNAME'],
                                    type: new sap.ui.model.type.Float({
                                        decimals: parseInt(contextObject['DECIMALS'])
                                    }),
                                    formatter: function (value) {
                                        if (contextObject['FLSTL'] == global.vui5.cons.styleType.color) {
                                            return oControl.__setColor.call(this, dataArea, contextObject, value, null, false, false);
                                        }
                                        else {
                                            return value;
                                        }
                                    }
                                }
                            });
                        }
                        /*template = new sap.m.Text();
    
                        
                        if (contextObject['FLSTL'] == global.vui5.cons.styleType.color) {
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
                        }*/
                        /***Rel 60E SP6 - Object Number Changes - End ***/

                    } else if (contextObject['DATATYPE'] == global.vui5.cons.dataType.date) {
                        /*template = new sap.m.DatePicker({
                            //displayFormat: "long",
                            //*****Rel 60E_SP6
                            //valueFormat: "YYYY-MM-dd",
                            valueFormat: vui5.cons.date_format,
                            //*****
                            placeholder: " ",
                            strictParsing: true,
                            editable: false
                        });
                        template.bindProperty("displayFormat", global.vui5.modelName + ">"+ global.vui5.cons.modelPath.sessionInfo+"/DATFM", Formatter.displayFormat, sap.ui.model.Binding.OneWay);
              
                        if (contextObject['FLSTL'] == global.vui5.cons.styleType.color) {
                            template.bindValue(modelName + ">" + contextObject['FLDNAME'], function(cellValue) {
                                cellValue = oControl.__setColor.call(this, dataArea, contextObject, cellValue);
                                return cellValue;
                            }, bindingMode);
                        } else {
                            template.bindValue(modelName + ">" + contextObject['FLDNAME'], null, bindingMode);
                        }
                         */
                        template = new sap.m.Text({});
                        if (contextObject['FLSTL'] == global.vui5.cons.styleType.color) {
                            template.bindText(modelName + ">" + contextObject['FLDNAME'], function (cellValue) {
                                cellValue = oControl.__setColor.call(this, dataArea, contextObject, cellValue);
                                return cellValue;
                            }, bindingMode);
                        } else {
                            template.bindText(modelName + ">" + contextObject['FLDNAME'], Formatter.dateFormat, bindingMode);
                        }

                    } else if (contextObject['DATATYPE'] == global.vui5.cons.dataType.time) {
                        /* template = new sap.m.TimePicker({
                             valueFormat: "HH:mm:ss",
                             displayFormat: "hh:mm:ss a",
                             editable: false
                         });
                         if (contextObject['FLSTL'] == global.vui5.cons.styleType.color) {
                             template.bindValue(modelName + ">" + contextObject['FLDNAME'], function(cellValue) {
                                 cellValue = oControl.__setColor.call(this, dataArea, contextObject, cellValue);
                                 return cellValue;
                             }, bindingMode);
                         } else {
                             template.bindValue(modelName + ">" + contextObject['FLDNAME'], null, bindingMode);
                         } */

                        template = new sap.m.Text({
                        });
                        if (contextObject['FLSTL'] == global.vui5.cons.styleType.color) {
                            template.bindText(modelName + ">" + contextObject['FLDNAME'], function (cellValue) {
                                cellValue = oControl.__setColor.call(this, dataArea, contextObject, cellValue);
                                return cellValue;
                            }, bindingMode);
                        } else {
                            template.bindText(modelName + ">" + contextObject['FLDNAME'], null, bindingMode);
                        }

                    } else {

                        template = new sap.m.Text();
                        if (contextObject['SDSCR'] == global.vui5.cons.fieldValue.description
                            || contextObject['SDSCR'] == global.vui5.cons.fieldValue.value_cont_descr) {
                            if (contextObject['FLSTL'] == global.vui5.cons.styleType.color) {
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

                        } else if (contextObject['SDSCR'] == global.vui5.cons.fieldValue.value_descr) {
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

        if (fieldInfo['SDSCR'] == global.vui5.cons.fieldValue.description
            || fieldInfo['SDSCR'] == global.vui5.cons.fieldValue.value_cont_descr) {
            dataPath = fieldInfo['TXTFL'];
        } else {
            dataPath = fieldInfo['FLDNAME'];
        }

        var template = new sap.ui.core.Icon({
            useIconTooltip: false,
            tooltip: fieldInfo['TOOLTIP'],
            press: [oControl.onFieldClick, oControl]
        })
            .addEventDelegate({
                onAfterRendering: function (e) {
                    var icon = e.srcControl;
                    var dataPath = icon.data("datapath");
                    var rowData = icon.data("rowdata");
                    var fieldname = icon.data("fieldname");
                    /***Rel 60E SP6 QA #10234 - Start*///                  
                    /*if (rowData && rowData['READONLYCOLUMNS'].includes(fieldname)) {
                        template.detachPress(function (evt) {
                            oController.onFieldClick(evt);
                        });
                    }*/

                    if (rowData && rowData['READONLYCOLUMNS'].indexOf("<" + fieldname + ">")) {
                        template.detachPress(function (evt) {
                            oController.onFieldClick(evt);
                        });
                    }
                    /***Rel 60E SP6 QA #10234 - End*///


                }
            });

        //        template.bindProperty("tooltip", modelName + ">" + oControl.getDataPath() + dataPath);

        template.bindProperty("src", modelName + ">" + dataPath, function (value) {
            if (value === null || value === undefined) {
                return '';
            }
            var bindingContext = this.getBindingContext(oControl.getModelName());
            if (bindingContext) {
                var rowData = bindingContext.getObject();
                if (rowData) {
                    var objectValue = rowData[fieldInfo['FLDNAME']];
                    template.data('rowdata', rowData);
                    var iconProperty = underscoreJS.find(fieldInfo['STYLES'], {
                        'VALUE': objectValue
                    });
                    if (iconProperty) {
                        if (iconProperty['COLOR'] != "") {
                            this.addStyleClass('vuisapText' + iconProperty['COLOR']);
                        }
                        return iconProperty.ICON;
                    }
                }
            }
            //return "sap-icon://status-positive";
        });
        template.data("fieldname", dataPath);
        template.data("fieldInfo", fieldInfo);
        template.data("datapath", oControl.getDataPath() + dataPath);
        //*****Rel 60E_SP6
        template.bindProperty("tooltip", modelName + ">" + dataPath, function (value) {
            if (value != undefined && !underscoreJS.isEmpty(value)) {
                return value;
            }
            else {
                return fieldInfo['TOOLTIP'];
            }
        }, sap.ui.model.BindingMode.OneWay);
        //*****

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
        if (fieldInfo['FLSTL'] == global.vui5.cons.styleType.color) {

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

    T.prototype.getVuiPaginator = function () {
        return this._VuiPaginator;
    };
    T.prototype._ExportPress = function () {
        var oControl = this;
        var oController = this.getController();
        var rowCount = oController.getModel(oController.modelName).getProperty(this.getTotalNumberOfRows());
        var pageSize = oControl.getPageSize();
        var paging = this.getPagingType();
        if ((oControl._filterItems && oControl._filterItems.length != 0) && oControl.getRows().length == 0) {
            oControl._ExportAllPress(oControl);
        }
        if ((paging == global.vui5.cons.pagingType.serverPaging && (pageSize !== rowCount)) || (oControl._filterItems && oControl._filterItems.length != 0)) {

            var oMenuSet = new sap.ui.unified.Menu();
            oControl._menu = oMenuSet;
            var oMenu1 = new sap.ui.unified.MenuItem({

                text: oControl._oBundle.getText("ExportExisting"),
                select: function (event) {
                    oControl._menu.close();
                    oController._processExport({
                        table: oControl
                    });
                }

            })
            var oMenu2 = new sap.ui.unified.MenuItem({

                text: oControl._oBundle.getText("ExportAll"),
                select: function (event) {
                    oControl._menu.close();
                    oControl._ExportAllPress(oControl);
                }

            })
            this._menu.addItem(oMenu1);
            this._menu.addItem(oMenu2);
            var eDock = sap.ui.core.Popup.Dock;
            this._menu.open(false, this._exportButton, eDock.BeginTop, eDock.BeginBottom, this._exportButton);

        }
        else {
            oController._processExport({
                table: oControl
            });
        }
    };

    //Mass Edit
    T.prototype._onMassEdit = function () {
        var oControl = this, tableData = {}, sectionConfig = oControl.getController().sectionConfig[oControl.getSectionID()];
        var selectedRowPaths = [];

        underscoreJS.each(oControl.getSelectedIndices(), function (rIndex) {
            selectedRowPaths.push(oControl.getContextByIndex(rIndex).getPath());
        });

        if (underscoreJS.isEmpty(selectedRowPaths)) {
            sap.m.MessageToast.show(oControl._oBundle.getText("SelectRowMsg"));
            return;
        }

        tableData['SPATHS'] = selectedRowPaths;
        tableData['DATAAREAPATH'] = oControl.getDataAreaPath();
        tableData['FIELDSPATH'] = oControl.getFieldPath();
        tableData['LAYOUTDATAPATH'] = oControl.getLayoutDataPath();
        tableData['DATAPATH'] = oControl.getDataPath();
        tableData['ENABLEAPPLYBACKGROUND'] = sectionConfig.attributes[global.vui5.cons.attributes.enableBulkEdit] === global.vui5.cons.bulkEditType.server &&
                                                 selectedRowPaths.length === oControl.getModel(oControl.getModelName()).getProperty(oControl.getDataPath()).length;
        oControl.fireOnMassEdit({
            tableData: tableData
        });


    };

    T.prototype._ExportAllPress = function (oEvent) {
        var oControl = this, oController, action;
        oController = this.getController()
        action = {
            "FNCNM": global.vui5.cons.eventName.excelExport
        }
        oControl.fireOnExport({
            action: action,
            callBack: function () {
                oController._processExport({
                    table: oControl,
                    fromServer: true
                });
            }
        })
    };

    T.prototype.setFieldType = function (selection, fieldInfo) {
        //      var oController = this.getController();
        if (fieldInfo['SDSCR'] == global.vui5.cons.fieldValue.value
            || fieldInfo['SDSCR'] == global.vui5.cons.fieldValue.value_descr) {
            if (fieldInfo['INTTYPE'] == global.vui5.cons.intType.number ||
                //                  fieldInfo['INTTYPE'] == global.vui5.cons.intType.integer ||
                fieldInfo['INTTYPE'] == global.vui5.cons.intType.oneByteInteger ||
                fieldInfo['INTTYPE'] == global.vui5.cons.intType.twoByteInteger ||
                //                  fieldInfo['INTTYPE'] == global.vui5.cons.intType.packed ||
                fieldInfo['INTTYPE'] == global.vui5.cons.intType.float ||
                fieldInfo['INTTYPE'] == global.vui5.cons.intType.decimal16 ||
                fieldInfo['INTTYPE'] == global.vui5.cons.intType.decimal32) {
                selection.setType(sap.m.InputType.Number);
            }
            //          if(fieldInfo['INTTYPE'] == global.vui5.cons.intType.number) {
            //          selection.attachChange(oController.checkNumericField.bind(oController));
            //          }else if(fieldInfo['INTTYPE'] == global.vui5.cons.intType.packed){
            //          selection.attachChange(oController.checkPackedField.bind(oController));
            //          }else if(fieldInfo['INTTYPE'] == global.vui5.cons.intType.integer){
            //          selection.attachChange(oController.checkIntegerField.bind(oController));
            //          }
        }
    };


    T.prototype._getCurrentRow = function (oEvent) {
        var source = oEvent.getSource();
        var model = source.getModel(source.data("model"));
        return model.getProperty(oEvent.getSource().getParent().getBindingContext(oEvent.getSource().data("model")).getPath())['ROWID'] || '';
    };

    T.prototype.bindTypeAheadField = function (selection, fieldPath, fieldInfo) {
        var oControl = this;
        var oController = this.getController();
        var mainModel = oController.getMainModel();
        selection.setShowSuggestion(true);
        selection.setFilterSuggests(false);

        if (fieldInfo['INTLEN'] == 1) {
            selection.setStartSuggestion(1);
        }
        else {
            selection.setStartSuggestion(2);
        }

        selection.setMaxSuggestionWidth("50%");
        selection.attachSuggest(function (oEvent) {
            var source = oEvent.getSource();

            if (fieldInfo['MUTLISELECT'] === "X") {
                source.addValidator(function (args) {
                    if (args.suggestionObject) {
                        var data = mainModel.getProperty("/TYPEAHEAD");
                        var key;
                        if (data) {
                            var returnField = data[fieldInfo['FLDNAME']]['RETURNFIELD'];
                            var fieldInfo1 = underscoreJS.findWhere(data[fieldInfo['FLDNAME']]['FIELDS'], {
                                FLDNAME: returnField
                            });
                            var postn = underscoreJS.indexOf(data[fieldInfo['FLDNAME']]['FIELDS'], fieldInfo1);
                            if (!postn) {
                                postn = 0;
                            }
                            key = args.suggestionObject.getCells()[postn].getText();
                            return new sap.m.Token({
                                key: key,
                                text: key
                            });
                        } else {
                            key = args.suggestionObject.getCells()[0].getText();
                            return new sap.m.Token({
                                key: key,
                                text: key
                            });
                        }
                    } else {
                        var text = args.text;
                        if (fieldInfo['LOWERCASE'] == '' && fieldInfo['INTTYPE'] == global.vui5.cons.intType.character) {
                            text = text.toUpperCase();
                        }
                        return new sap.m.Token({
                            key: text,
                            text: text
                        });
                    }
                });
            }
            var model = source.getModel(source.data("model"));
            var fieldInfo1 = model.getProperty(source.data("path"));


            oEvent.mParameters['eventType'] = global.vui5.cons.fieldSubEvent.typeAhead;
            oEvent.mParameters['fieldInfo'] = fieldInfo1;
            oEvent.mParameters['fieldValue'] = oEvent.getParameter('suggestValue');
            oEvent.mParameters['oEvent'] = oEvent;
            oEvent.mParameters['rowId'] = oControl._getCurrentRow(oEvent);
            oControl.preProcessFieldEvent(oEvent);

            source.bindAggregation("suggestionColumns", global.vui5.modelName + ">/TYPEAHEAD/" + fieldInfo1['FLDNAME'] + "/FIELDS", function (sid, oContext) {
                var contextObject = oContext.getObject();
                return new sap.m.Column({
                    header: new sap.m.Text({
                        text: contextObject['LABEL']
                    })
                });
            });
            source.bindAggregation("suggestionRows", global.vui5.modelName + ">/TYPEAHEAD/" + fieldInfo1['FLDNAME'] + "/DATA", function (sid, oContext) {
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
        });

        if (!fieldInfo['MULTISELECT']) {
            selection.attachSuggestionItemSelected(function (oEvent) {
                oControl.handleSuggestionItemSelected(oEvent);
            });
        }


        selection.data("model", oControl.getModelName());
        selection.data("path", fieldPath);
    };

    T.prototype.handleSuggestionItemSelected = function (oEvent) {
        var oControl = this;
        var mainModel = oControl.getProperty("controller").getMainModel();
        var source = oEvent.getSource();
        var model = source.getModel(source.data("model"));
        var fieldInfo = model.getProperty(source.data("path"));
        var item = oEvent.getParameter("selectedRow");
        var rowData = item.getBindingContext(global.vui5.modelName).getObject();
        var returnField = mainModel.getProperty("/TYPEAHEAD/" + fieldInfo['FLDNAME'] + "/RETURNFIELD");
        var descrField = mainModel.getProperty("/TYPEAHEAD/" + fieldInfo['FLDNAME'] + "/DESCRFIELD");
        /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - Start ***/
        //source.setValue(rowData[returnField]);
        if (!oControl.getController()._isMultiInputField(source)) {
            source.setValue(rowData[returnField]);
        }
        /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - End ***/
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
        /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - Start ***/
        if (!source.data(global.vui5.cons.fromTableForm)) {
            //No Need to raise fire change event here in case of Multi Input field from
            //form or table because from onMultiF4Select fire change event will be raised
            /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - End ***/
            source.fireChange();
            /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - Start ***/
        }
        /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - End ***/
    };

    T.prototype.handleDescriptionField = function (selection, fieldInfo, modelName, fieldPath, dataArea, bindingMode, editable, fields) {
        //      var oController = this.getController();
        var descriptionPath;

        var oControl = this;
        /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - Start ***/
        if (fieldInfo['MULTISELECT']) {
            return;
        }
        /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - End ***/


        if (fieldInfo['SDSCR'] == global.vui5.cons.fieldValue.description
            || fieldInfo['SDSCR'] == global.vui5.cons.fieldValue.value_cont_descr) {

            descriptionPath = fieldInfo['TXTFL'];
            //          selection.bindValue(modelName + ">" + descriptionPath,null,bindingMode);
            oControl.setFieldColor(
                fieldInfo,
                selection,
                "value",
                modelName + ">" + descriptionPath,
                bindingMode,
                fields);

            if (editable) {
                selection.data("model", modelName);
                selection.data("path", fieldPath);
                selection.data("dataArea", dataArea);
            }

            selection.setMaxLength(60);
        } else if (fieldInfo['SDSCR'] == global.vui5.cons.fieldValue.value_descr) {

            oControl.setFieldColor(
                fieldInfo,
                selection,
                "value",
                modelName + ">" + fieldInfo['FLDNAME'],
                bindingMode,
                fields);

            //          selection.bindValue(modelName + ">" + fieldInfo['FLDNAME'],null,bindingMode);
            if (editable) {
                selection.data("model", modelName);
                selection.data("path", fieldPath);
                selection.data("dataArea", dataArea);
            }
        } else {
            oControl.setFieldColor(
                fieldInfo,
                selection,
                "value",
                modelName + ">" + fieldInfo['FLDNAME'],
                bindingMode,
                fields);
            //          selection.bindValue(modelName + ">" + fieldInfo['FLDNAME'],null,bindingMode);
        }
    },

        T.prototype.prepareTableData = function () {
            var oControl = this;
            var dataPath = this.getDataPath();
            var modelName = this.getModelName();
            var VuifieldPath = this.getFieldPath();

            if (modelName && dataPath && VuifieldPath) {
                jQuery.sap.delayedCall(500, this, this.bindRows, [modelName + ">" + dataPath]);
                // this.bindAggregation("rows", modelName + ">" + dataPath);
                jQuery.sap.delayedCall(510, this, function () {
                    oControl.getBinding("rows").attachChange(function (oEvent) {
                        /*** EPS6 Task #34846 - If the Paging type is Server/Virtual Paging, if the total result
                         * which we get in Table is less than Page size then we have to setVisibleRowCount
                         * so as to remove Empty rows */
                        /*if (oControl.getPageSize()) {
                            if (oControl.getPagingType() === global.vui5.cons.pagingType.serverPaging &&
                                    oEvent.getSource().getLength() < parseInt(oControl.getPageSize())) {
                                oControl.setVisibleRowCount(oEvent.getSource().getLength());
                            }
                            else if (oControl.getPagingType() === global.vui5.cons.pagingType.virtualPaging) {
                                if (oEvent.getSource().getLength() < parseInt(oControl.getPageSize())) {
                                    oControl.setVisibleRowCount(oEvent.getSource().getLength());
                                }
                                else {
                                    oControl.setVisibleRowCount(parseInt(oControl.getPageSize()));
                                }
    
    
                            }
                        }
                        else {
                            oControl.setVisibleRowCount(oEvent.getSource().getLength());
                        }*/
                    });

                });
            }
        };

    T.prototype.createPersonalizationDialog = function () {
        var oControl = this;
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
        /*** Higher version changes  for setVisibilityOfPanel- private method as it is not available from 1.54**/
        if (sap.ui.version > "1.54.1") {
            this._PersonalizationDialog._setVisibilityOfPanel1 = function (oPanel) {
                var bVisible;
                if (sap.ui.Device.system.phone) {
                    bVisible = this.getPanels().length === 1;
                    if (bVisible) {
                        oPanel.beforeNavigationTo();
                        if (!this.getModel()) {
                            this.setModel(oPanel.getModel("$sapmP13nPanel"), "$sapmP13nDialog");
                        }
                    }
                    oPanel.setVisible(bVisible);
                    this._setVisibilityOfOtherPanels1(oPanel, false);

                } else {
                    bVisible = this.getInitialVisiblePanelType() === oPanel.getType() || this.getPanels().length === 1;
                    if (bVisible) {
                        oPanel.beforeNavigationTo();
                        if (!this.getModel()) {
                            this.setModel(oPanel.getModel("$sapmP13nPanel"), "$sapmP13nDialog");
                        }
                    }
                    oPanel.setVisible(bVisible);
                    if (bVisible) {
                        this._setVisibilityOfOtherPanels1(oPanel, false);
                        this.setVerticalScrolling(oPanel.getVerticalScrolling());
                        var oButton = this._getNavigationItemByPanel(oPanel);
                        var oNavigationControl = this._getNavigationControl();
                        if (oNavigationControl) {
                            oNavigationControl.setSelectedButton(oButton);
                        }
                    }
                }
            };
            this._PersonalizationDialog._setVisibilityOfOtherPanels1 = function (oPanel, bVisible) {
                for (var i = 0, aPanels = this.getPanels(), iPanelsLength = aPanels.length; i < iPanelsLength; i++) {
                    if (aPanels[i] === oPanel) {
                        continue;
                    }
                    aPanels[i].setVisible(bVisible);
                }
            };
        }
        /***/
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

    /*** Rel 60E SP6 - Raise Update event in case of Editable Table - Start ***/

    T.prototype.processSettingsPressed = function () {
        var oControl = this;
        if (!this._PersonalizationDialog) {
            this.createPersonalizationDialog();
        } else {
            /* User might change column position, to accomodate those changes */
            this.addColumnPanelItems();
        }

        /* user can chnage the sort criteria, to accomodate those changes */
        this.fillSortItems();

        /* Prepare Filter Panel FilterItems*/
        this.fillFilterPanelItem(false);

        this.currentVaraintModified = this._oVariants.currentVariantGetModified();

        this.addGroupPanelItem(this._PersonalizationDialog);

        this.fillPersonalizationItems();
        this._PersonalizationDialog.open();
    };
    T.prototype._onSettingPressed = function () {
        var oControl = this;
        if (oControl.getEditable()) {
            oControl.fireOnUpdate({
                callFrom: global.vui5.cons.updateCallFrom.personalization,
                callBack: function () {
                    oControl.processSettingsPressed();
                }
            });
        }
        else {
            oControl.processSettingsPressed();
        }
    };
    //T.prototype._onSettingPressed = function () {
    //    //      var oControl = this;
    //    if (!this._PersonalizationDialog) {
    //        this.createPersonalizationDialog();
    //    } else {
    //        /* User might change column position, to accomodate those changes */
    //        this.addColumnPanelItems();
    //    }

    //    /* user can chnage the sort criteria, to accomodate those changes */
    //    this.fillSortItems();

    //    /* Prepare Filter Panel FilterItems*/
    //    this.fillFilterPanelItem(false);

    //    this.currentVaraintModified = this._oVariants.currentVariantGetModified();

    //    this.addGroupPanelItem(this._PersonalizationDialog);

    //    this.fillPersonalizationItems();
    //    this._PersonalizationDialog.open();
    //};
    /*** Rel 60E SP6 - Raise Update event in case of Editable Table - End ***/

    T.prototype._onFilterLink = function () {

        if (!this._PersonalizationDialog) {
            this.createPersonalizationDialog();
        } else {
            /* User might change column position, to accomodate those changes */
            this.addColumnPanelItems();
        }

        this._PersonalizationDialog.setInitialVisiblePanelType('filter');
        var panels = this._PersonalizationDialog.getPanels();
        for (var i = 0; i < panels.length; i++) {
            /*** Higher version changes  for setVisibilityOfPanel- private method as it is not available from 1.54**/
            if (sap.ui.version > "1.54.1")
                this._PersonalizationDialog._setVisibilityOfPanel1(panels[i]);

            else
                this._PersonalizationDialog._setVisibilityOfPanel(panels[i]);
            // this._PersonalizationDialog._setVisibilityOfPanel(panels[i]);
            /***/
        }

        /* user can chnage the sort criteria, to accomodate those changes */
        this.fillSortItems();

        /* Prepare Filter Panel FilterItems*/
        if (this._filterPanel1)
            this._filterPanel1.removeAllFilterItems();
        this.fillFilterPanelItem(false);

        this.currentVaraintModified = this._oVariants.currentVariantGetModified();

        this.addGroupPanelItem(this._PersonalizationDialog);

        this.fillPersonalizationItems();
        this._PersonalizationDialog.open();
    };

    /* Add Columns, Sort , Filter and Group Panel and their respective items to Dialog*/
    T.prototype._addPanel = function (dialog) {

        var oControl = this;
        /*** Rel 60E SP6 - Filter values sorting based on Label - Start ***/
        //var columns = this.getModel(this.getModelName()).getProperty(this.getFieldPath());
        var columns = $.extend(true, [], this.getModel(this.getModelName()).getProperty(this.getFieldPath()));
        columns = underscoreJS.sortBy(columns, 'LABEL');
        /*** Rel 60E SP6 - Filter values sorting based on Label - End ***/

        /* Column Panel*/
        this._columnPanel = new sap.m.P13nColumnsPanel({
            title: oControl._oBundle.getText("Columns"),
            visible: true,
            type: "columns",
            changeColumnsItems: this.updateColumnsItems.bind(this)
        });

        if (oControl.getVariantModified()) {
            this.addColumnPanelItems();
        }
        else {
            this.addColumnPanelItems(false);
        }

        dialog.addPanel(this._columnPanel);

        /* Sort Panel*/
        this._sortPanel = new sap.m.P13nSortPanel({
            title: oControl._oBundle.getText("Sort"),
            visible: true,
            type: "sort",
            containerQuery: true,

            addSortItem: this.addSortItem.bind(this),
            removeSortItem: this.removeSortItem.bind(this),
            updateSortItem: this.updateSortItem.bind(this)
        });

        /*Add none in Sort Panel item*/
        this._sortPanel.removeAllItems();
        /*this._sortPanel.addItem(new sap.m.P13nItem({
            columnKey: "",
            text: oControl._oBundle.getText("none")
        }));*/
        underscoreJS.each(columns, function (object) {
            oControl._sortPanel.addItem(new sap.m.P13nItem({
                columnKey: object['FLDNAME'],
                text: object['LABEL']
            }));
        });
        /***/

        dialog.addPanel(this._sortPanel);

        /* Filter Panel*/
        this._filterPanel = new sap.m.P13nFilterPanel({
            title: oControl._oBundle.getText("Filter"),
            visible: true,
            type: "filter",
            containerQuery: true,

            addFilterItem: this.addFilterItem.bind(this),
            removeFilterItem: this.removeFilterItem.bind(this),
            updateFilterItem: this.updateFilterItem.bind(this)
        })
    //*****Rel 60E_SP5
        .data("fieldPath", this.getFieldPath())
        .data("dataAreaPath", this.getDataAreaPath())
        .data("modelName", this.getModelName())
        .data("oControl", oControl);
        //*****

        underscoreJS.each(columns, function (object) {
            var type;
            if (object['INTTYPE'] == global.vui5.cons.intType.number ||
                //                  object['INTTYPE'] == global.vui5.cons.intType.time ||
                object['INTTYPE'] == global.vui5.cons.intType.integer ||
                object['INTTYPE'] == global.vui5.cons.intType.oneByteInteger ||
                object['INTTYPE'] == global.vui5.cons.intType.twoByteInteger ||
                object['INTTYPE'] == global.vui5.cons.intType.packed ||
                object['INTTYPE'] == global.vui5.cons.intType.float ||
                object['INTTYPE'] == global.vui5.cons.intType.decimal16 ||
                object['INTTYPE'] == global.vui5.cons.intType.decimal32) {
                type = 'numeric';
            } else if (object['INTTYPE'] == global.vui5.cons.intType.date) {
                type = 'date';
            } else if (object['INTTYPE'] == global.vui5.cons.intType.time) {
                type = 'time';
            } else {
                type = 'string';
            }
            oControl._filterPanel.addItem(new sap.m.P13nItem({
                columnKey: object['FLDNAME'],
                text: object['LABEL'],
                type: type
            }));
        });
        dialog.addPanel(this._filterPanel);

        /*Grouping Changes*/
        //      this._groupPanel = new sap.m.P13nGroupPanel({
        //      maxGroups : '1',
        //      title:bundle.getText("Group"),
        //      visible: true,
        //      type:"group",
        //      containerQuery:true,
        //
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
    };

    T.prototype.addColumnPanelItems = function (considerColumnVisibility) {
        var oControl = this;
        var tableColumns = this.getColumns();
        var variant = this._oVariants.getSelectionKey();
        var editable = oControl.getEditable();
        var visible;
        oControl._columnPanel.removeAllColumnsItems();
        oControl._columnPanel.removeAllItems();
        var fields = oControl.getModel(oControl.getModelName()).getProperty(oControl.getFieldPath());
        var fieldGroups = oControl.getModel(oControl.getModelName()).getProperty(oControl.getFieldGroupPath());
        var model = oControl.getModel(oControl.getModelName());
        if (oControl.isGroupingPresent()) {

            //*****Rel 60E_SP6
            var flag;
            var variant = this._oVariants.getSelectionKey();
            if (this._fields && (variant == "*standard*" && considerColumnVisibility == false)) {
                flag = true;
            }
            //*****

            underscoreJS.each(tableColumns, function (column, index) {
                var object = column.getBindingContext(oControl.getModelName()).getObject();

                if (object['FLGRP']) {
                    var grpFields = underscoreJS.where(fields, { 'FLGRP': object['FLGRP'], 'ADFLD': '' });

                    //*****Rel 60E_SP6
                    if (flag) {
                        index = underscoreJS.findIndex(oControl._fieldGroups, { FLGRP: object['FLGRP'] });
                    }
                    //*****

                    var visible;
                    underscoreJS.each(grpFields, function (grpField) {

                        if (considerColumnVisibility === undefined) {
                            visible = grpField['NO_OUT'] === '';

                        }
                        else {
                            if (oControl._groupHideFields && oControl._groupHideFields.indexOf(grpField['FLDNAME']) !== -1) {
                                visible = true;
                                var actualFieldIndex = underscoreJS.findIndex(fields, grpField);
                                oControl._groupHideFields.splice(oControl._groupHideFields.indexOf(grpField['FLDNAME']), 1);
                                model.setProperty(oControl.getFieldPath() + actualFieldIndex + "/NO_OUT", '');
                            }
                            else {
                                visible = grpField['NO_OUT'] === '';
                            }
                        }

                        oControl._columnPanel.addColumnsItem(new sap.m.P13nColumnsItem({
                            columnKey: grpField['FLDNAME'],
                            index: index,//grpField['POSTN'],
                            visible: visible
                        }));

                        //*****Rel 60E_SP6
                        /*oControl._columnPanel.addItem(new sap.m.P13nItem({
                            columnKey: grpField['FLDNAME'],
                            text: grpField['LABEL'],
                            visible: visible,
                        }));*/
                        oControl._columnPanel.insertItem(new sap.m.P13nItem({
                            columnKey: grpField['FLDNAME'],
                            text: grpField['LABEL'],
                            visible: visible,
                        }), index);
                        //*****
                    });
                }
                else {

                    if (considerColumnVisibility === undefined) {
                        visible = column.getVisible();
                    }
                    else {
                        visible = underscoreJS.findWhere(fields, { 'FLDNAME': object['FLDNAME'] })['NO_OUT'] === '';
                    }

                    var position;
                    if (considerColumnVisibility === undefined) {
                        position = oControl.indexOfColumn(column);
                    }
                    else {
                        //*****Rel 60E_SP6
                        if (flag) {
                            position = underscoreJS.findIndex(oControl._fields, { FLDNAME: object['FLDNAME'] });
                        }
                        else {
                            //*****
                            position = underscoreJS.indexOf(fieldGroups, object);
                        }
                    }

                    oControl._columnPanel.addColumnsItem(new sap.m.P13nColumnsItem({
                        columnKey: object['FLDNAME'],
                        index: position,
                        visible: visible,
                        width: column.getWidth(),
                    }));

                    //*****Rel 60E_SP6
                    /*oControl._columnPanel.addItem(new sap.m.P13nItem({
                        columnKey: object['FLDNAME'],
                        text: object['DESCR'],
                        visible: visible,
                        width: column.getWidth(),
                    }));*/
                    oControl._columnPanel.insertItem(new sap.m.P13nItem({
                        columnKey: object['FLDNAME'],
                        text: object['DESCR'],
                        visible: visible,
                        width: column.getWidth(),
                    }), position);
                    //*****
                }
            });
        }
        else if (variant === "*standard*" && considerColumnVisibility === false) {

            underscoreJS.each(fields, function (object, index) {
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
                    index: index,//object['POSTN'],
                    visible: visible,
                    width: "200px"
                }));

                oControl._columnPanel.addItem(new sap.m.P13nItem({
                    columnKey: object['FLDNAME'],
                    text: object['LABEL'],
                    visible: visible,
                    width: "200px"
                }));
            });
        }
        else {
            underscoreJS.each(tableColumns, function (column) {

                var object = column.getBindingContext(oControl.getModelName()).getObject();
                var visible;
                visible = column.getVisible();
                var position = oControl.indexOfColumn(column);


                if (object['ADFLD'] === "") {


                    oControl._columnPanel.addColumnsItem(new sap.m.P13nColumnsItem({
                        columnKey: object['FLDNAME'],
                        index: position,
                        visible: visible,
                        width: column.getWidth()
                    }));

                    oControl._columnPanel.addItem(new sap.m.P13nItem({
                        columnKey: object['FLDNAME'],
                        text: object['LABEL'],
                        visible: visible,
                        width: column.getWidth()
                    }));
                }
            });
        }
    };

    T.prototype.fillSortItems = function () {
        var oControl = this;

        oControl._sortPanel.removeAllSortItems();
        this._sortItems = underscoreJS.sortBy(this._sortItems, 'INDEX');
        underscoreJS.each(this._sortItems, function (item) {
            oControl._sortPanel.addSortItem(new sap.m.P13nSortItem({
                columnKey: item['COLUMNKEY'],
                operation: item['OPERATION']
            }));
        });
    };
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
                        'VISIBLE': column.visible,
                        /*Save Width in Variant-START*/
                        'WIDTH': column.width
                    });
                    /*Save Width in Variant-END*/
                });
            } else {
                var columns = this._columnPanel.getColumnsItems();
                this._columnItems = [];
                underscoreJS.each(columns, function (column) {
                    oControl._columnItems.push({
                        'COLUMNKEY': column.mProperties.columnKey,
                        'INDEX': column.mProperties.index,
                        'VISIBLE': column.mProperties.visible,
                        /*Save Width in Variant-START*/
                        'WIDTH': column.mProperties.width
                    });
                    /*Save Width in Variant-END*/
                });
            }

            var sortItems = this._sortPanel.getSortItems();
            this._sortItems = [];
            underscoreJS.each(sortItems, function (obj, index) {
                oControl._sortItems.push({
                    'COLUMNKEY': obj.mProperties.columnKey,
                    'OPERATION': obj.mProperties.operation,
                    'INDEX': index + 1
                });
            });

            filterItems = this._filterPanel.getFilterItems();
            if (filterItems.length == 0 && this._filterPanel1 && this._filterPanel1.getFilterItems()) {
                /***Rel 60E_SP7 - QA 12759 ***/
                /**when we add any filter on CustomFilter and open settings button that item appears in the dialog.
                 *but when we delete that item from settings,not getting deleted.still that filter exists**/
                //filterItems = this._filterPanel1.getFilterItems();
                this._filterPanel1.removeAllFilterItems();
                /***/
            }
            this._filterItems = [];
            //*****Rel 60E_SP5
            var fields = oControl.getModel(this.getModelName()).getProperty(this.getFieldPath());
            //*****
            underscoreJS.each(filterItems, function (obj) {
                //*****Rel 60E_SP5
                var selField = underscoreJS.findWhere(fields, { FLDNAME: obj.mProperties.columnKey }), value1, value2;
                value1 = obj.mProperties.value1;
                value2 = obj.mProperties.value2;
                if (selField['DATATYPE'] === vui5.cons.dataType.date) {
                    if (!underscoreJS.isEmpty(value1) && (new Date(value1) != "Invalid Date")) {
                        value1 = new Date(value1);
                        value1 = value1.toDateString();
                        value1 = commonUtils.convertToSimpleDate(value1);
                    }

                    if (!underscoreJS.isEmpty(value2) && (new Date(value2) != "Invalid Date")) {
                        value2 = new Date(value2);
                        value2 = value2.toDateString();
                        value2 = commonUtils.convertToSimpleDate(value2);
                    }
                }
                else if (selField['DATATYPE'] === vui5.cons.dataType.time) {
                    if (!underscoreJS.isEmpty(value1) && (new Date(value1) != "Invalid Date")) {
                        value1 = new Date(value1);
                        value1 = commonUtils.convertToSimpleTime(value1);
                    }

                    if (!underscoreJS.isEmpty(value2) && (new Date(value2) != "Invalid Date")) {
                        value2 = new Date(value2);
                        value2 = commonUtils.convertToSimpleTime(value2);
                    }
                }
                //*****
                var exclude = false;
                if (obj.mProperties.exclude) {
                    exclude = true;
                }

                oControl._filterItems.push({
                    'COLUMNKEY': obj.mProperties.columnKey,
                    'OPERATION': obj.mProperties.operation,
                    //*****Rel 60E_SP5
                    'VALUE1': value1,
                    'VALUE2': value2,
                    //*****
                    'EXCLUDE': exclude
                });
            });

        } else {
            filterItems = this._filterPanel1.getFilterItems();
            this._filterItems = [];
            //            underscoreJS.each(filterItems, function (obj) {
            //                var exclude = false;
            //                if (obj.mProperties.exclude) {
            //                    exclude = true;
            //                }
            //
            //                oControl._filterItems.push({
            //                    'COLUMNKEY': obj.mProperties.columnKey,
            //                    'OPERATION': obj.mProperties.operation,
            //                    'VALUE1': obj.mProperties.value1,
            //                    'VALUE2': obj.mProperties.value2,
            //                    'EXCLUDE': exclude
            //                });
            //            });
            //        	filterItems = this._filterPanel1.getFilterItems();
            //            this._filterItems = [];
            //            underscoreJS.each(filterItems, function (obj) {
            //                var exclude = false;
            //                if (obj.mProperties.exclude) {
            //                    exclude = true;
            //                }
            //
            //                oControl._filterItems.push({
            //                    'COLUMNKEY': obj.mProperties.columnKey,
            //                    'OPERATION': obj.mProperties.operation,
            //                    'VALUE1': obj.mProperties.value1,
            //                    'VALUE2': obj.mProperties.value2,
            //                    'EXCLUDE': exclude
            //                });
            //            });
            var fields = oControl.getModel(this.getModelName()).getProperty(this.getFieldPath());
            //*****
            underscoreJS.each(filterItems, function (obj) {
                //*****Rel 60E_SP5
                var selField = underscoreJS.findWhere(fields, { FLDNAME: obj.mProperties.columnKey }), value1, value2;
                value1 = obj.mProperties.value1;
                value2 = obj.mProperties.value2;
                if (selField['DATATYPE'] === vui5.cons.dataType.date) {
                    if (!underscoreJS.isEmpty(value1) && (new Date(value1) != "Invalid Date")) {
                        value1 = new Date(value1);
                        value1 = value1.toDateString();
                        value1 = commonUtils.convertToSimpleDate(value1);
                    }

                    if (!underscoreJS.isEmpty(value2) && (new Date(value2) != "Invalid Date")) {
                        value2 = new Date(value2);
                        value2 = value2.toDateString();
                        value2 = commonUtils.convertToSimpleDate(value2);
                    }
                }
                else if (selField['DATATYPE'] === vui5.cons.dataType.time) {
                    if (!underscoreJS.isEmpty(value1) && (new Date(value1) != "Invalid Date")) {
                        value1 = new Date(value1);
                        value1 = commonUtils.convertToSimpleTime(value1);
                    }

                    if (!underscoreJS.isEmpty(value2) && (new Date(value2) != "Invalid Date")) {
                        value2 = new Date(value2);
                        value2 = commonUtils.convertToSimpleTime(value2);
                    }
                }
                //*****
                var exclude = false;
                if (obj.mProperties.exclude) {
                    exclude = true;
                }
                if (obj.mProperties.value1 || obj.mProperties.value2) {
                    oControl._filterItems.push({
                        'COLUMNKEY': obj.mProperties.columnKey,
                        'OPERATION': obj.mProperties.operation,
                        //*****Rel 60E_SP5
                        'VALUE1': value1,
                        'VALUE2': value2,
                        //*****
                        'EXCLUDE': exclude
                    });
                }
            });
        }
        if (this._groupPanel) {
            var groupItems = this._groupPanel.getGroupItems();
            this._groupItems = [];
            underscoreJS.each(groupItems, function (obj) {
                oControl._groupItems.push({
                    'COLUMNKEY': obj.mProperties.columnKey,
                    'OPERATION': obj.mProperties.operation
                });
            });
        }
    };
    //*****Rel 60E_SP5
    T.prototype.timeFormat = function (value) {
        var output;
        if (value) {
            var hours = value.substr(0, 2);
            var minutes = value.substr(2, 2);
            var seconds = value.substr(4, 2);
            output = hours + ":" + minutes + ":" + seconds;
        }
        return output;
    };

    T.prototype.dateFormat = function (value) {
        var output;
        if (value) {

            if (value == "0000-00-00") {
                return '';
            }
            var mainModel = this.getModel(vui5.modelName);
            if (mainModel.getProperty("/SESSION_INFO/DATFM") != undefined) {
                var year = value.substr(0, 4);
                var month = value.substr(4, 2);
                var day = value.substr(6, 2);
                switch (mainModel.getProperty("/SESSION_INFO/DATFM")) {
                    case vui5.cons.dateFormat.type0:
                        var months = mainModel.getProperty("/DROPDOWNS/" + vui5.cons.dropdownsDatar + "/MONTHS");
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
                    case vui5.cons.dateFormat.type1:
                        output = day + "." + month + "." + year;
                        break;
                    case vui5.cons.dateFormat.type2:
                        output = month + "/" + day + "/" + year;
                        break;
                    case vui5.cons.dateFormat.type3:
                        output = month + "-" + day + "-" + year;
                        break;
                    case vui5.cons.dateFormat.type4:
                        output = year + "." + month + "." + day;
                        break;
                    case vui5.cons.dateFormat.type5:
                    case vui5.cons.dateFormat.typeA:
                    case vui5.cons.dateFormat.typeB:
                    case vui5.cons.dateFormat.typeC:
                        output = year + "/" + month + "/" + day;
                        break;
                    case vui5.cons.dateFormat.type6:
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

    P13nConditionPanel.prototype._getValueTextFromField = function (oControl, oFormatter) {
        if (oControl.getDateValue && oControl.getDateValue()) {
            return oFormatter.format(oControl.getDateValue());
        }

        if (oControl instanceof sap.m.Select) {
            return oControl.getSelectedItem() ? oControl.getSelectedItem().getText() : "";
        }
        //*****Rel 60E_SP5
        if (oControl instanceof global.vui5.ui.controls.ComboBox || oControl.data("instance")) {
            return oControl.getSelectedItem() ? oControl.getSelectedKey() : "";
        }
        //*****

        return oControl.getValue();
    };

    P13nConditionPanel.prototype._changeOperationValueFields = function (oTargetGrid, oConditionGrid) {
        // var oKeyfield = oConditionGrid.keyField;
        var oOperation = oConditionGrid.operation;
        var sOperation = oOperation.getSelectedKey();
        var oValue1 = oConditionGrid.value1;
        var oValue2 = oConditionGrid.value2;
        var oShowIfGroupedvalue = oConditionGrid.showIfGrouped;

        if (!sOperation) {
            return;
        }

        if (sOperation === sap.m.P13nConditionOperation.BT) {
            // for the "between" operation we enable both fields
            if (oValue1.setPlaceholder && oValue1.getPlaceholder() !== this._sFromLabelText) {
                oValue1.setPlaceholder(this._sFromLabelText);
            }
            if (!oValue1.getVisible()) {
                oValue1.setVisible(true);
                // workaround: making fields invisible for all mode L/M/S does not work, so we remove the fields from the grid.
                oConditionGrid.insertContent(oValue1, oConditionGrid.getContent().length - 1);
            }

            if (oValue2.setPlaceholder && oValue2.getPlaceholder() !== this._sToLabelText) {
                oValue2.setPlaceholder(this._sToLabelText);
            }
            if (!oValue2.getVisible()) {
                oValue2.setVisible(true);
                // workaround: making fields invisible for all mode L/M/S does not work, so we remove the fields from the grid.
                oConditionGrid.insertContent(oValue2, oConditionGrid.getContent().length - 1);
            }
            //*****Rel 60E_SP5
            oValue1.setVisible(true);
            oValue2.setVisible(true);
            oConditionGrid.insertContent(oValue2, oConditionGrid.getContent().length - 1);
            //*****
        } else {
            if (sOperation === sap.m.P13nConditionOperation.GroupAscending || sOperation === sap.m.P13nConditionOperation.GroupDescending) {

                // update visible of fields
                if (oValue1.getVisible()) {
                    oValue1.setVisible(false);
                    // workaround: making fields invisible for all mode L/M/S does not work, so we remove the fields from the grid.
                    oConditionGrid.removeContent(oValue1);
                }
                if (oValue2.getVisible()) {
                    oValue2.setVisible(false);
                    oConditionGrid.removeContent(oValue2);
                }
                if (oOperation.getVisible()) {
                    oOperation.setVisible(false);
                    oConditionGrid.removeContent(oOperation);
                }
                oShowIfGroupedvalue.setVisible(this._getMaxConditionsAsNumber() != 1);
            } else {
                if (sOperation === sap.m.P13nConditionOperation.NotEmpty || sOperation === sap.m.P13nConditionOperation.Empty || sOperation === sap.m.P13nConditionOperation.Initial || sOperation === sap.m.P13nConditionOperation.Ascending || sOperation
                    === sap.m.P13nConditionOperation.Descending || sOperation === sap.m.P13nConditionOperation.Total || sOperation === sap.m.P13nConditionOperation.Average || sOperation === sap.m.P13nConditionOperation.Minimum || sOperation ===
                    sap.m.P13nConditionOperation.Maximum) {

                    // for this operations we disable both value fields
                    if (oValue1.getVisible()) {
                        oValue1.setVisible(false);
                        // workaround: making fields invisible for all mode L/M/S does not work, so we remove the fields from the grid.
                        oConditionGrid.removeContent(oValue1);
                    }
                    if (oValue2.getVisible()) {
                        oValue2.setVisible(false);
                        oConditionGrid.removeContent(oValue2);
                    }

                    // workaround: making fields invisible for all mode L/M/S does not work, so we remove the fields from the grid.
                    oConditionGrid.removeContent(oShowIfGroupedvalue);
                } else {
                    // for all other operations we enable only the Value1 fields
                    if (oValue1.setPlaceholder && oValue1.getPlaceholder() !== this._sValueLabelText) {
                        oValue1.setPlaceholder(this._sValueLabelText);
                    }
                    if (!oValue1.getVisible()) {
                        oValue1.setVisible(true);
                        // workaround: making fields invisible for all mode L/M/S does not work, so we remove the fields from the grid.
                        oConditionGrid.insertContent(oValue1, oConditionGrid.getContent().length - 1);
                    }
                    if (oValue2.getVisible()) {
                        oValue2.setVisible(false);
                        oConditionGrid.removeContent(oValue2);
                    }
                }
            }
        }

        this._adjustValue1Span(oConditionGrid);
    };


    P13nConditionPanel.prototype._handleChangeOnOperationField = function (oTargetGrid, oConditionGrid) {
        //*****Rel 60E_SP5
        this._createAndUpdateValueFields(oTargetGrid, oConditionGrid);
        //*****

        this._changeOperationValueFields(oTargetGrid, oConditionGrid);
        this._changeField(oConditionGrid);
    };

    //To clear value when column is changed
    P13nConditionPanel.prototype._handleSelectionChangeOnKeyField = function (oTargetGrid, oConditionGrid) {
        if (this._sConditionType === "Filter") {
            this._updateOperationItems(oTargetGrid, oConditionGrid);
            //*****Rel 60E_SP5
            //this._createAndUpdateValueFields(oTargetGrid, oConditionGrid);
            this._createAndUpdateValueFields(oTargetGrid, oConditionGrid, true);
            //*****
            this._changeOperationValueFields(oTargetGrid, oConditionGrid);
        }

        this._changeField(oConditionGrid);
    };

    P13nConditionPanel.prototype._createAndUpdateValueFields = function (oTargetGrid, oConditionGrid, clearSelection) {
        // update the value fields for the KeyField
        var oCurrentKeyField = this._getCurrentKeyFieldItem(oConditionGrid.keyField);

        var fnCreateAndUpdateField = function (oConditionGrid, oCtrl, index, clearSelection) {
            var sOldValue = oCtrl.getValue ? oCtrl.getValue() : "";

            var ctrlIndex = oConditionGrid.indexOfContent(oCtrl);
            //oConditionGrid.removeContent(oCtrl);
            oConditionGrid.removeAggregation("content", oCtrl, true);
            if (oCtrl._oSuggestProvider) {
                oCtrl._oSuggestProvider.destroy();
                oCtrl._oSuggestProvider = null;
            }
            oCtrl.destroy();
            var fieldInfo = this._aConditionsFields[index];
            oCtrl = this._createValueField(oCurrentKeyField, fieldInfo, oConditionGrid);
            oConditionGrid[fieldInfo["ID"]] = oCtrl;
            //oConditionGrid.insertContent(oCtrl, ctrlIndex);
            oConditionGrid.insertAggregation("content", oCtrl, ctrlIndex, true);

            var oValue, sValue;
            if (oConditionGrid.oFormatter && sOldValue) {
                oValue = oConditionGrid.oFormatter.parse(sOldValue);
                if (!isNaN(oValue) && oValue !== null) {
                    sValue = oConditionGrid.oFormatter.format(oValue);
                    oCtrl.setValue(sValue);
                }
            }
            if (!sValue) {
                oCtrl.setValue(sOldValue);
            }

            //*****Rel 60E_SP5
            if (clearSelection) {
                oCtrl.setValue("");
            }
            //*****
        };

        // update Value1 field control
        jQuery.proxy(fnCreateAndUpdateField, this)(oConditionGrid, oConditionGrid.value1, 5, clearSelection);

        // update Value2 field control
        jQuery.proxy(fnCreateAndUpdateField, this)(oConditionGrid, oConditionGrid.value2, 6, clearSelection);
    };
    //

    P13nConditionPanel.prototype._createValueField = function (oCurrentKeyField, oFieldInfo, oConditionGrid) {
        var oControl;
        var sCtrlType = oCurrentKeyField ? oCurrentKeyField.type : "";
        var that = this;

        //*****Rel 60E_SP5
        var selField, selFieldIndex;
        if (this.getParent() && this.getParent().getParent() && this.getParent().getParent().data("fieldPath")) {
            var conditionKey = oConditionGrid.operation.getProperty("selectedKey");
            var keyField = oCurrentKeyField['key'];
            var control = this.getParent().getParent().data("oControl");
            var fieldPath = this.getParent().getParent().data("fieldPath");
            var modelName = this.getParent().getParent().data("modelName");
            var dataAreaPath = this.getParent().getParent().data("dataAreaPath");
            var model = this.getModel(modelName);
            var fields = model.getProperty(fieldPath);
            var dataArea = model.getProperty(dataAreaPath);
            selField = underscoreJS.findWhere(fields, { FLDNAME: keyField });
            selFieldIndex = underscoreJS.findIndex(fields, { FLDNAME: keyField });
        }
        //*****

        var params = {
            value: oFieldInfo["Value"],
            width: "100%",
            placeholder: oFieldInfo["Label"],
            change: function (oEvent) {
                var source = oEvent.getSource();
                var value = source.getValue();
                source.setValueState(sap.ui.core.ValueState.None);
                source.setValueStateText("");
                if (vui5.cons['inputHelpFieldInfo'] && vui5.cons['controller']) {
                    var field = vui5.cons['inputHelpFieldInfo'];
                    var oController = vui5.cons['controller'];
                    if (field['DATATYPE'] === global.vui5.cons.dataType.quantity) {
                        if (oController.checkQuantityValue(value)) {
                            if (that._validateFormatFieldValue)
                                that._validateFormatFieldValue(oEvent);
                            that._changeField(oConditionGrid);
                        }
                        else {
                            source.setValueState(sap.ui.core.ValueState.Error);
                            source.setValueStateText("Enter valid" + field['LABEL']);
                        }
                    }
                    else if (field['DATATYPE'] === global.vui5.cons.dataType.amount) {
                        if (oController.checkAmountValue(value)) {
                            if (that._validateFormatFieldValue)
                                that._validateFormatFieldValue(oEvent);
                            that._changeField(oConditionGrid);
                        }
                        else {
                            source.setValueState(sap.ui.core.ValueState.Error);
                            source.setValueStateText("Enter valid" + field['LABEL']);
                        }
                    }
                } else {
                    if (that._validateFormatFieldValue)
                        that._validateFormatFieldValue(oEvent);
                    that._changeField(oConditionGrid);
                }

            },
            layoutData: new sap.ui.layout.GridData({
                span: oFieldInfo["Span" + this._sConditionType]
            })
        };
        //        var params = {
        //            value: oFieldInfo["Value"],
        //            width: "100%",
        //            placeholder: oFieldInfo["Label"],
        //            change: function (oEvent) {
        //                that._validateFormatFieldValue(oEvent);
        //                that._changeField(oConditionGrid);
        //            },
        //            layoutData: new sap.ui.layout.GridData({
        //                span: oFieldInfo["Span" + this._sConditionType]
        //            })
        //        };

        switch (sCtrlType) {
            case "boolean":
            case "enum":
                var aItems = [];

                //        if (sCtrlType === "boolean") {
                //          aItems.push(new sap.ui.core.Item({
                //            key: "",
                //            text: ""
                //          }));
                //        }
                var aValues = oCurrentKeyField.values || this._oTypeValues[sCtrlType] || ["", false, true];
                aValues.forEach(function (oValue, index) {
                    aItems.push(new sap.ui.core.Item({
                        key: sCtrlType === "boolean" ? (index === aValues.length - 1).toString() : oValue.toString(),
                        text: oValue.toString()
                    }));
                });

                params = {
                    width: "100%",
                    items: aItems,
                    change: function () {
                        that._changeField(oConditionGrid);
                    },
                    layoutData: new sap.ui.layout.GridData({
                        span: oFieldInfo["Span" + this._sConditionType]
                    })
                };
                oConditionGrid.oFormatter = null;
                oControl = new sap.m.Select(params);
                break;
            case "numeric":
                var oFloatFormatOptions;
                if (oCurrentKeyField.precision || oCurrentKeyField.scale) {
                    oFloatFormatOptions = {};
                    if (oCurrentKeyField.precision) {
                        oFloatFormatOptions["maxIntegerDigits"] = parseInt(oCurrentKeyField.precision, 10);
                    }
                    if (oCurrentKeyField.scale) {
                        oFloatFormatOptions["maxFractionDigits"] = parseInt(oCurrentKeyField.scale, 10);
                    }
                }
                oConditionGrid.oFormatter = NumberFormat.getFloatInstance(oFloatFormatOptions);

                oControl = new sap.m.Input(params);
                break;
            case "date":
                oConditionGrid.oFormatter = DateFormat.getDateInstance();
                oControl = new sap.m.DatePicker(params);
                oControl.bindProperty("displayFormat", global.vui5.modelName + ">" + global.vui5.cons.modelPath.sessionInfo + "/DATFM", Formatter.displayFormat, sap.ui.model.Binding.OneWay);

                break;
            case "time":
                oConditionGrid.oFormatter = DateFormat.getTimeInstance();
                oControl = new sap.m.TimePicker(params);

                //        var oLocale = sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale();
                //        var oLocaleData = sap.ui.core.LocaleData.getInstance(oLocale);
                //        oControl.setDisplayFormat( oLocaleData.getTimePattern("short"));

                break;
            default:
                oConditionGrid.oFormatter = null;

                //*****Rel 60E_SP5
                if (selField && (selField['ELTYP'] === global.vui5.cons.element.valueHelp ||
                        selField['ELTYP'] === global.vui5.cons.element.dropDown) &&
                    (conditionKey == "EQ" || conditionKey == "BT")) {
                    if (selField['ELTYP'] === global.vui5.cons.element.valueHelp) {
                        oControl = new sap.m.Input({
                            value: oFieldInfo["Value"],
                            width: "100%",
                            placeholder: oFieldInfo["Label"],
                            showValueHelp: true,
                            change: function (oEvent) {
                                if (that._validateFormatFieldValue)
                                    that._validateFormatFieldValue(oEvent);
                                that._changeField(oConditionGrid);
                            },
                            layoutData: new sap.ui.layout.GridData({
                                span: oFieldInfo["Span" + this._sConditionType]
                            }),
                            valueHelpRequest: function (oEvent) {
                                control.fireOnValueHelpRequest({
                                    oEvent: oEvent,
                                    fieldInfo: selField,
                                });
                            }
                        });
                        oControl.data("model", modelName);
                        control.bindTypeAheadField(oControl, fieldPath + selFieldIndex, selField);
                    }
                    else if (selField['ELTYP'] === global.vui5.cons.element.dropDown) {
                        oControl = new global.vui5.ui.controls.ComboBox({
                            width: "100%",
                            placeholder: oFieldInfo["Label"],
                            selectedKey: oFieldInfo["Value"],
                            change: function (oEvent) {
                                if (that._validateFormatFieldValue)
                                    that._validateFormatFieldValue(oEvent);
                                that._changeField(oConditionGrid);
                            },
                            layoutData: new sap.ui.layout.GridData({
                                span: oFieldInfo["Span" + this._sConditionType]
                            })
                        }).data("instance", "global.vui5.ui.controls.ComboBox");

                        oControl.bindAggregation("items", global.vui5.modelName + '>' + "/DROPDOWNS/" + dataArea + "/" + selField['FLDNAME'], function (sId, oContext) {
                            var contextObject = oContext.getObject(), key;
                            if (selField['SDSCR'] == vui5.cons.fieldValue.description || selField['SDSCR'] == vui5.cons.fieldValue.value_cont_descr) {
                                key = contextObject['VALUE'];
                            }
                            else {
                                key = contextObject['NAME'];
                            }
                            return new sap.ui.core.Item({
                                key: key,
                                text: contextObject['VALUE']
                            });
                        });
                    }
                }
                else {
                    //*****
                    oControl = new sap.m.Input(params);
                    //*****Rel 60E_SP5
                }
                //*****

                if (this._fSuggestCallback) {
                    var oCurrentKeyField = this._getCurrentKeyFieldItem(oConditionGrid.keyField);
                    if (oCurrentKeyField && oCurrentKeyField.key) {
                        var oSuggestProvider = this._fSuggestCallback(oControl, oCurrentKeyField.key);
                        if (oSuggestProvider) {
                            oControl._oSuggestProvider = oSuggestProvider;
                        }
                    }
                }

        }

        if (sCtrlType !== "boolean" && sCtrlType !== "enum") {
            oControl.onpaste = function (oEvent) {

                var sOriginalText;
                // for the purpose to copy from column in excel and paste in MultiInput/MultiComboBox
                if (window.clipboardData) {
                    //IE
                    sOriginalText = window.clipboardData.getData("Text");
                } else {
                    // Chrome, Firefox, Safari
                    sOriginalText = oEvent.originalEvent.clipboardData.getData('text/plain');
                }

                var oConditionGrid = oEvent.srcControl.getParent();
                var aSeparatedText = sOriginalText.split(/\r\n|\r|\n/g);

                if (aSeparatedText) {
                    setTimeout(function () {
                        var iLength = aSeparatedText ? aSeparatedText.length : 0;
                        if (iLength > 1) {

                            var oKeyField = that._getCurrentKeyFieldItem(oConditionGrid.keyField);
                            var oOperation = oConditionGrid.operation;

                            for (var i = 0; i < iLength; i++) {
                                if (that._aConditionKeys.length >= that._getMaxConditionsAsNumber()) {
                                    break;
                                }

                                if (aSeparatedText[i]) {
                                    var oCondition = {
                                        "key": that._createConditionKey(),
                                        "exclude": that.getExclude(),
                                        "operation": oOperation.getSelectedKey(),
                                        "keyField": oKeyField.key,
                                        "value1": aSeparatedText[i],
                                        "value2": null
                                    };
                                    that._addCondition2Map(oCondition);

                                    that.fireDataChange({
                                        key: oCondition.key,
                                        index: oCondition.index,
                                        operation: "add",
                                        newData: oCondition
                                    });
                                }
                            }

                            that._clearConditions();
                            that._fillConditions();
                        }
                    }, 0);
                }
            }
            ;
        }

        if (oCurrentKeyField && oCurrentKeyField.maxLength && oControl.setMaxLength) {
            var l = -1;
            if (typeof oCurrentKeyField.maxLength === "string") {
                l = parseInt(oCurrentKeyField.maxLength, 10);
            }
            if (typeof oCurrentKeyField.maxLength === "number") {
                l = oCurrentKeyField.maxLength;
            }
            if (l > 0 && (!oControl.getShowSuggestion || !oControl.getShowSuggestion())) {
                oControl.setMaxLength(l);
            }
        }

        return oControl;
    };

    //*****

    T.prototype.handleClose = function (oEvent) {

        var oDialog = oEvent.getSource();

        var oControl = this;
        oControl._columnPanel.removeAllColumnsItems();
        underscoreJS.each(this._columnItems, function (item) {
            var visible;
            if (item['VISIBLE'] == "true" || item['VISIBLE'] == true || item['VISIBLE'] == "X") {
                visible = true;
            } else {
                visible = false;
            }

            oControl._columnPanel.addColumnsItem(new sap.m.P13nColumnsItem({
                columnKey: item['COLUMNKEY'],
                index: item['INDEX'],
                visible: visible,
                /*Save Width in Variant-START*/
                width: item['WIDTH']
                /*Save Width in Variant-END*/
            }));
        });

        oControl._sortPanel.removeAllSortItems();
        this._sortItems = underscoreJS.sortBy(this._sortItems, 'INDEX');
        underscoreJS.each(this._sortItems, function (item) {
            oControl._sortPanel.addSortItem(new sap.m.P13nSortItem({
                columnKey: item['COLUMNKEY'],
                operation: item['OPERATION']
            }));
        });
        oControl._filterPanel.removeAllFilterItems();
        underscoreJS.each(this._filterItems, function (item) {
            var exclude;
            if (item['EXCLUDE'] == "true" || item['EXCLUDE'] == true || item['EXCLUDE'] == "X") {
                exclude = true;
            }
            else {
                exclude = false;
            }

            oControl._filterPanel.addFilterItem(new sap.m.P13nFilterItem({
                columnKey: item['COLUMNKEY'],
                operation: item['OPERATION'],
                value1: item['VALUE1'],
                value2: item['VALUE2'],
                exclude: exclude
            }));
        });

        oControl._groupPanel.removeAllGroupItems();
        underscoreJS.each(this._groupItems, function (item) {
            var showIfGrouped;
            if (item['SHOWIFGROUPED'] == "true" || item['SHOWIFGROUPED'] == true || item['SHOWIFGROUPED'] == "X") {
                showIfGrouped = true;
            }
            else {
                showIfGrouped = false;
            }

            oControl._groupPanel.addGroupItem(new sap.m.P13nGroupItem({
                columnKey: item['COLUMNKEY'],
                operation: item['OPERATION'],
                showIfGrouped: showIfGrouped
            }));
        });
        this._oVariants.currentVariantSetModified(this.currentVaraintModified);
        oDialog.close();
    };

    T.prototype.handleReset = function (oEvent) {
        var oControl = this;
        var variant = this._oVariants.getSelectionKey();
        if (variant != "*standard*") {
            if (!oEvent.mParameters) {
                oEvent.mParameters = {};
            }
            oEvent.mParameters['key'] = variant;
            oControl._onVariantSelect(oEvent);
        } else {
            this._aggrPanel.clearValues();
            oControl.addColumnPanelItems(false);
            this._sortPanel.removeAllSortItems();
            this._filterPanel.removeAllFilterItems();
            this._groupPanel.removeAllGroupItems();
        }
        this._oVariants.currentVariantSetModified(false);
    },

        T.prototype.handlePersonalizationOk = function (event) {
            var oControl = this, layoutData, index = -1, columnItem, variant, fields, field, sortItems = [], filterItems = [];
            if (event) {
                tableItems = event.getParameter("payload").columns.tableItems;
                /*** Rel 60E SP6 - Personalization Issue after 1.50 Upgrade - Start ***/
                underscoreJS.each(tableItems, function (tableItem, index) {
                    tableItem['index'] = index;
                });
                /*** Rel 60E SP6 - Personalization Issue after 1.50 Upgrade - End ***/
            }
            else {
                tableItems = [];
                underscoreJS.each(oControl._columnItems, function (object) {
                    tableItems.push({
                        columnKey: object['COLUMNKEY'],
                        index: object['INDEX'],
                        visible: object['VISIBLE'],
                        width: ""
                    })
                })
            }


            this.fillPersonalizationItems(tableItems, false);
            variant = this._oVariants.getSelectionKey();

            oControl._variantData = {
                "VARIANTS": [],
                "LAYOUT": {
                    "COLITEMS": oControl.allKeysToUpperCase(oControl._columnItems),
                    "SORTITEMS": oControl.allKeysToUpperCase(oControl._sortItems),
                    "FILTERITEMS": oControl.allKeysToUpperCase(oControl._filterItems),
                    "GRPITEMS": oControl.allKeysToUpperCase(oControl._groupItems),
                    "AGRGTITEMS": oControl.allKeysToUpperCase(oControl._aggrPanel.getItems())
                }
            };

            oControl.fireLayoutManage({
                callBack: function () {
                    /* var grpColumnRef;
    
                     if (underscoreJS.isEmpty(oControl._groupItems) && oControl.getGroupBy()) {
                         oControl.setEnableGrouping(false); // We are setting it to false, to remove the Group header line
                         sap.ui.getCore().byId(oControl.getGroupBy()).setGrouped(false);
                         oControl.setEnableGrouping(true);
                     }
                     else if (!underscoreJS.isEmpty(oControl._groupItems)) {
                         oControl.groupBySet = false;
                         grpColumnRef = underscoreJS.find(oControl.getColumns(), function (column) {
                             return column.data("contextObject")['FLDNAME'] === oControl._groupItems[0]['COLUMNKEY'];
                         });
    
                         if (grpColumnRef && oControl.getGroupBy() !== grpColumnRef.getId()) {
                             oControl.groupBySet = true;
                             oControl.setGroupBy(grpColumnRef.getId());
                         }
    
                     }
    
                     if (oControl.groupingColumn || (grpColumnRef && grpColumnRef.getId())) {
                         sap.ui.getCore().byId(oControl.groupingColumn || (grpColumnRef && grpColumnRef.getId())).setGrouped(true);
                         oControl.groupingColumn = undefined;
                     }*/
                    oControl.applyGroup = false;
                    oControl._applyPersonalization(oControl._columnItems, false);
                    oControl._PersonalizationDialog.close();
                }
            });
        },

    T.prototype.addSortItem = function (oEvent) {
        this._sortPanel.addSortItem(oEvent.getParameter("sortItemData"));
        this._oVariants.currentVariantSetModified(true);
        //*****Rel 60E_SP7
        this._updateShowResetEnabled(true);
        //*****
    };

    T.prototype.removeSortItem = function (oEvent) {
        var index = oEvent.getParameter("index");
        var item = this._sortPanel.getSortItems()[index];
        this._sortPanel.removeSortItem(item);
        this._oVariants.currentVariantSetModified(true);
        //*****Rel 60E_SP7
        this._updateShowResetEnabled(true);
        //*****
    };
    T.prototype.updateSortItem = function () {
        this._oVariants.currentVariantSetModified(true);
        //*****Rel 60E_SP7
        this._updateShowResetEnabled(true);
        //*****
    };
    T.prototype.addFilterItem = function (oEvent) {
        var filterPanel = oEvent.getSource();
        filterPanel.addFilterItem(oEvent.getParameter("filterItemData"));
        this._oVariants.currentVariantSetModified(true);
        //*****Rel 60E_SP7
        this._updateShowResetEnabled(true);
        //*****
    };
    T.prototype.removeFilterItem = function (oEvent) {
        var filterPanel = oEvent.getSource();
        var index = oEvent.getParameter("index");
        var item = filterPanel.getFilterItems()[index];
        filterPanel.removeFilterItem(item);
        this._oVariants.currentVariantSetModified(true);
        //*****Rel 60E_SP7
        this._updateShowResetEnabled(true);
        //*****
    };
    T.prototype.updateFilterItem = function () {
        this._oVariants.currentVariantSetModified(true);
        //*****Rel 60E_SP7
        this._updateShowResetEnabled(true);
        //*****
    };
    T.prototype.updateColumnsItems = function () {
        this._oVariants.currentVariantSetModified(true);
        //*****Rel 60E_SP7
        this._updateShowResetEnabled(true);
        //*****
    };

    //    T.prototype.addGroupItem = function (oEvent) {
    //        this._groupPanel.addGroupItem(oEvent.getParameter("groupItemData"));
    //        this._oVariants.currentVariantSetModified(true);
    //    };

    //    T.prototype.removeGroupItem = function (oEvent) {
    //        var index = oEvent.getParameter("index");
    ////        var item = this._groupPanel.getGroupItems()[index];
    ////        this._groupPanel.removeGroupItem(item);
    //        this._oVariants.currentVariantSetModified(true);
    //    };
    //
    //    T.prototype.updateGroupItem = function () {
    //        this._oVariants.currentVariantSetModified(true);
    //    };


    //*****Rel 60E_SP7
    T.prototype._updateShowResetEnabled = function (showReset) {
        if (this._PersonalizationDialog.getShowResetEnabled && this._PersonalizationDialog.getShowResetEnabled() != showReset) {
            this._PersonalizationDialog.setProperty("showResetEnabled", showReset);
        }
    }
    //*****

    T.prototype._onFilterTable = function (event) {
        var value = event.getParameter("query");
        this.filterTable(value);
    },

        T.prototype.filterTable = function (value) {
            this._applyFilter();
            //      var binding = this.getBinding("rows");
            //      if(value != "" && value != undefined) {
            //      var mainModel = this.getModel(this.getModelName());
            //      var fields = mainModel.getProperty(this.getFieldPath());
            //      var filter = [];
            //      underscoreJS.each(fields,function(field){
            //      var sPath;
            //      if(field){
            //      if(field['SDSCR'] != global.vui5.cons.fieldValue.value && field['SDSCR'] != global.vui5.cons.fieldValue.value_descr ) {
            //      sPath = field['TXTFL'];
            //      }else{
            //      sPath = field['FLDNAME'];
            //      }
            //      }
            //      if(field['INTTYPE'] != global.vui5.cons.intType.packed)
            //      filter.push(new Filter(sPath,sap.ui.model.FilterOperator.Contains,value));
            //      });
            //      binding.filter(new Filter(filter,false),sap.ui.model.FilterType.Application);
            //      }
            //      else {
            //      binding.filter();
            //      }
        };

    T.prototype._applyFilter = function () {
        var filters = [];
        var binding = this.getBinding("rows");

        /*Perform Sorting and Filtering in Backend*/
        var appFilter = this._prepareFilter(true);
        if (appFilter && this.getBackendSortFilter() == false) {
            filters.push(appFilter);
        }

        var searchFilter = this._prepareFilter(false);
        if (searchFilter) {
            filters.push(searchFilter);
        }

        if (filters.length > 0) {
            binding.filter(new Filter(filters, true), sap.ui.model.FilterType.Application);
        } else {
            binding.filter();
        }
    };

    T.prototype._prepareFilter = function (fromPersonalization) {
        var appFilter;
        var oControl = this;
        var filter = [];
        if (fromPersonalization && this._filterItems) {

            var columns = oControl.getColumns();

            underscoreJS.each(columns, function (column) {
                var object = column.getBindingContext(oControl.getModelName()).getObject();

                /* Filter Columns */
                /*ESP4 QA Issue : 6663*/
                var items = underscoreJS.where(oControl._filterItems, {
                    'COLUMNKEY': object['FLDNAME']
                });

                if (items.length > 0) {
                    var includeFilter = [];
                    column.setFiltered(true);
                    for (var i = 0; i < items.length; i++) {
                        if (items[i]) {
                            var operation;
                            if (items[i]['EXCLUDE'] == true || items[i]['EXCLUDE'] == "true" || items[i]['EXCLUDE'] == "X") {
                                operation = 'NE';
                                filter.push(new Filter(column.getFilterProperty(), operation, items[i]['VALUE1'], items[i]['VALUE2']));
                            } else {
                                operation = items[i]['OPERATION'];
                                includeFilter.push(new Filter(column.getFilterProperty(), operation, items[i]['VALUE1'], items[i]['VALUE2']));
                            }
                        }
                    }
                    if (includeFilter.length > 0)
                        filter.push(new Filter(includeFilter, false));
                } else {
                    column.setFiltered(false);
                }
                /*ESP4 QA Issue : 6663*/
            });

            if (filter.length > 0) {
                appFilter = new Filter(filter, true);
            }
        } else {

            var value = this._oSearchField.getValue();
            if (value != "" && value != undefined) {
                var mainModel = this.getModel(this.getModelName());
                var fields = mainModel.getProperty(this.getFieldPath());


                underscoreJS.each(fields, function (field) {
                    var sPath;
                    if (field) {
                        if (field['SDSCR'] != global.vui5.cons.fieldValue.value && field['SDSCR'] != global.vui5.cons.fieldValue.value_descr) {
                            sPath = field['TXTFL'];
                        } else if (field['DATATYPE'] == global.vui5.cons.dataType.amount
                            || field['DATATYPE'] == global.vui5.cons.dataType.quantity
                            || field['DATATYPE'] == global.vui5.cons.dataType.decimal
                            || field['DATATYPE'].substr(0, 3) == global.vui5.cons.dataType.integer) {
                            sPath = field['TXTFL'];
                        } else {
                            sPath = field['FLDNAME'];
                        }
                    }
                    if (sPath) {
                        if (field['INTTYPE'] != global.vui5.cons.intType.packed)
                            filter.push(new Filter(sPath, sap.ui.model.FilterOperator.Contains, value));
                        else
                            filter.push(new Filter(sPath, sap.ui.model.FilterOperator.EQ, value));
                    }

                });
                appFilter = new Filter(filter, false);
            }
        }
        return appFilter;
    };

    T.prototype._initializeVariants = function () {
        var oControl = this;
        var modelName = this.getModelName();
        oController = oControl.getProperty("controller");
        this._oVariants = new sap.ui.comp.variants.VariantManagement({
            enabled: true,
            /***Rel 60E SP6 ECDM #4728 - Start ***/
            //showShare: true,
            showShare: !oControl.getHideShare(),
            /***Rel 60E SP6 ECDM #4728 - End ***/
            save: oControl._onVariantSave.bind(oControl),
            manage: oControl._onVariantManage.bind(oControl),
            select: oControl._onVariantSelect.bind(oControl),
            visible: oControl.getProperty("handle") !== ""
        });

        this._oVariants.bVariantItemMode = true;
        this._oVariants._setStandardText();

        /*Over Riding Tooltip*/

        this._oVariants.oVariantPopoverTrigger.setTooltip(oControl._oBundle.getText('SelectVariant'));
        /**/

        this._oVariants.bindAggregation("variantItems", modelName + ">" + this.getVariantDataPath(), function (sId, oContext) {
            object = oContext.getObject();

            if (object['DEFLT'] == "X") {
                oControl._oVariants.setDefaultVariantKey(object['VARID']);
            }
            var item = new VariantItem({
                text: object['DESCR'],
                key: object['VARID'],
                global: object['UNAME'] === "",
                author: object['AENAM_TXT']
            });

            /***Rel 60E SP6 ECDM #4754 - Start ***/
            if (object['UNAME'] === "" && oControl.getHideShare()) {
                item.setReadOnly(true);
            }
            /***Rel 60E SP6 ECDM #4754 - End ***/

            oControl._oVariants.setInitialSelectionKey('');
            return item;
        });

        this._oVariants.addEventDelegate({
            onAfterRendering: function (e) {
                var oControl = this;
                var model = oControl.getModel(oControl.getModelName());
                var selectedVariant = model.getProperty(oControl.getSelectedVariant());
                if (selectedVariant && ((e.srcControl.getInitialSelectionKey() === "") || (e.srcControl.getInitialSelectionKey() !== selectedVariant))) {
                    e.srcControl.setInitialSelectionKey(selectedVariant);
                    oControl._onVariantSelect1(true);
                }
                    //*****Rel 60E_SP6
                else {
                    oControl.applyElementFeature();
                }
                //*****                
                /*In list with processing
                 * when we perform search , this onafterrendering is called so for now
                 * we are calling the below method   */
                oControl.addRowColor();


                if (oControl.getHideVariantSave()) {
                    oControl._oVariants.setVisible(false);
                }
            }
        }, this);
    };

    //    T.prototype.addGroupPanelItem = function (dialog) {
    //
    //        var oControl = this;
    //        /*
    //         * referring i18n from global utilities instead of application i18n -
    //         * START
    //         */
    //        // var bundle =
    //        // this.getModel("i18n").getResourceBundle();
    //        //var bundle = this.getModel("i18n").getResourceBundle();
    //        /*
    //         * referring i18n from global utilities instead of application i18n -
    //         * END
    //         */
    //
    //        var columns = this.getModel(this.getModelName()).getProperty(this.getFieldPath());
    //
    //        if (!this._groupPanel) {
    //            this._groupPanel = new sap.m.P13nGroupPanel({
    //                maxGroups: '1',
    //                title: oControl._oBundle.getText("Group"),
    //                visible: true,
    //                type: "group",
    //                containerQuery: true,
    //                layoutMode: "Desktop",
    //                addGroupItem: this.addGroupItem.bind(this),
    //                removeGroupItem: this.removeGroupItem.bind(this),
    //                updateGroupItem: this.updateGroupItem.bind(this)
    //            });
    //
    //            this._groupPanel.setMaxGroups(1);
    //            dialog.addPanel(this._groupPanel);
    //        }
    //
    //        this._groupPanel.removeAllItems();
    //        this._groupPanel.addItem(new sap.m.P13nItem({
    //            columnKey: "",
    //            text: oControl._oBundle.getText("none")
    //        }));
    //        underscoreJS.each(columns, function (object) {
    //            oControl._groupPanel.addItem(new sap.m.P13nItem({
    //                columnKey: object['FLDNAME'],
    //                text: object['LABEL']
    //            }));
    //        });
    //    };

    T.prototype._onVariantSave = function (oEvent) {
        var oControl = this, overwrite, header, overwrite_properties, saveData = [], params = {}, globalVariant;
        var variantsData = oControl.getProperty("controller").getCurrentModel().getProperty(oControl.getVariantDataPath());

        overwrite = overwrite_properties = oEvent.getParameter("overwrite") || '';
        header = underscoreJS.find(variantsData, {
            'VARID': oEvent.getParameter("key")
        });

        if (header) {
            globalVariant = header['UNAME'] === '' ? 'X' : false;
        }
        else {
            globalVariant = oEvent.getParameter("global") === true ? 'X' : false;
        }

        if (overwrite) {
            header['UPDKZ'] = global.vui5.cons.updkz.upd;
        } else {
            header = {};
            header['VARID'] = oEvent.getParameter("key");
            header['DESCR'] = oEvent.getParameter("name");
            header['OBJTP'] = global.vui5.cons.applnObject;
            header['APPLN'] = global.vui5.cons.application;
            header['UPDKZ'] = global.vui5.cons.updkz.ins;
            header['DEFLT'] = oEvent.getParameter("def") === true ? 'X' : '';

        }

        if (!oControl._PersonalizationDialog) {
            oControl.createPersonalizationDialog();
            oControl.addGroupPanelItem(this._PersonalizationDialog);
            oControl.fillPersonalizationItems();
        }

        saveData.push(header);
        header['HANDLE'] = oControl.getHandle();
        oControl._variantData = {
            "VARIANTS": saveData,
            "LAYOUT": {
                "COLITEMS": this.allKeysToUpperCase(this._columnItems),
                "SORTITEMS": this.allKeysToUpperCase(this._sortItems),
                "FILTERITEMS": this.allKeysToUpperCase(this._filterItems),
                "GRPITEMS": oControl.allKeysToUpperCase(oControl._groupItems),
                "AGRGTITEMS": oControl.allKeysToUpperCase(oControl._aggrPanel.getItems())
            }
        };

        params[global.vui5.cons.params.overwrite] = overwrite;
        params[global.vui5.cons.params.overwrite_properties] = overwrite_properties;
        params[global.vui5.cons.params.global] = globalVariant;
        params[global.vui5.cons.params.handle] = oControl.getHandle();
        params[global.vui5.cons.params.variantID] = header['VARID'];
        oControl.fireVariantSave({
            callBack: function () {
                oControl._onVariantSelect1(true);
            },
            urlParams: params
        });


    };

    T.prototype.getVariantData = function () {
        var data = {};
        if (!underscoreJS.isEmpty(this._variantData)) {
            data = this._variantData;
            this._variantData = {};
        }
        return data;
    };

    T.prototype.getSetValueData = function () {
        var data = {};
        if (!underscoreJS.isEmpty(this._setValuesData)) {
            data = this._setValuesData;
            this._setValuesData = {};
        }
        return data;
    };

    T.prototype._onVariantManage = function (oEvent) {

        var oControl = this,
            oController,
            variantData,
            params = {},
            variantData;
        oController = oControl.getProperty("controller");

        var deleted = oEvent.getParameter("deleted");
        var renamed = oEvent.getParameter("renamed");

        var defaultVariant = oEvent.getParameter("def");

        var variantList = oControl.getProperty("controller").getCurrentModel().getProperty(oControl.getVariantDataPath());
        variantData = {
            'NEWVARIANTS': [],
            'UPDATEVARIANTS': [],
            'DELETEVARIANTS': []
        };
        var item;
        var overwriteItems = [];
        if (renamed.length > 0) {
            underscoreJS.each(renamed, function (renamedItem) {
                item = underscoreJS.find(variantList, {
                    'VARID': renamedItem.key
                });
                if (item && item.UPDKZ !== global.vui5.cons.updkz.del) {
                    item.DESCR = renamedItem.name;
                    item.UPDKZ = global.vui5.cons.updkz.upd;
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
                                obj.UPDKZ = global.vui5.cons.updkz.upd;
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
                                obj.UPDKZ = global.vui5.cons.updkz.upd;
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
                    item.UPDKZ = global.vui5.cons.updkz.upd;
                } else {
                    variant.DEFLT = 'X';
                    variant.UPDKZ = global.vui5.cons.updkz.upd;
                    overwriteItems.push(variant);
                }
            } else if (defaultVariant == "*standard*") {
                underscoreJS.each(variantList, function (obj) {
                    obj.DEFLT = '';
                    obj.UPDKZ = global.vui5.cons.updkz.upd;
                    overwriteItems.push(obj);
                });
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
                            obj.UPDKZ = global.vui5.cons.updkz.upd;
                            overwriteItems.push(obj);
                        }
                    }
                });
            }
        }

        /* Global Variant Changes-START */
        var markStandardAsDefault = "";
        if (defaultVariant == "*standard*") {
            markStandardAsDefault = 'X';
        }
        /* Global Variant Changes-END */

        var data = [];
        if (deleted.length > 0) {
            var deletedItems = [];
            underscoreJS.each(deleted, function (value) {
                var item = underscoreJS.findWhere(variantList, {
                    "VARID": value
                });
                if (item && item.UPDKZ !== global.vui5.cons.updkz.del) {
                    item.UPDKZ = global.vui5.cons.updkz.del;
                    deletedItems.push(item);
                }
                var overwriteItem = underscoreJS.find(overwriteItems, {
                    'VARID': value
                });
                if (overwriteItem) {
                    overwriteItems.pop(overwriteItem);
                }
            });

            variantData['DELETEVARIANTS'] = deletedItems;
        }

        if (overwriteItems.length > 0) {
            params[global.vui5.cons.params.overwrite] = 'X';
            params[global.vui5.cons.params.handle] = oControl.getHandle();
            params[global.vui5.cons.params.markStandardAsDefault] = markStandardAsDefault

            variantData['UPDATEVARIANTS'] = overwriteItems;

        }

        if (underscoreJS.isEmpty(variantData['DELETEVARIANTS']) && underscoreJS.isEmpty(variantData['UPDATEVARIANTS'])) {
            return;
        }

        oControl._variantData = {
            "VARIANTS": underscoreJS.union(variantData['DELETEVARIANTS'], variantData['UPDATEVARIANTS'])
        };

        params[global.vui5.cons.params.variantID] = oControl._oVariants.getSelectionKey();

        oControl.fireVariantSave({
            urlParams: params
        });


    };


    T.prototype._onVariantSelect = function (oEvent) {
        var oControl = this, variantData, selectedVariant;
        var variant = oEvent.getParameter("key");
        variantData = oControl.getProperty("controller").getCurrentModel().getProperty(oControl.getVariantDataPath());
        selectedVariant = underscoreJS.findWhere(variantData, {
            'VARID': variant
        });

        if (!selectedVariant) {
            selectedVariant = {
                "ROWID": 0
            };

            oControl._applyElmtFeature = false;
        }

        oControl.fireVariantSelect({
            callBack: function () {
                if (selectedVariant['ROWID'] === 0) {
                    oControl.handleReset();
                    oControl.fillPersonalizationItems();
                    oControl._applyPersonalization(oControl._columnItems);
                }
                else {
                    oControl._onVariantSelect1(true);
                }
            },
            record: selectedVariant
        });


        /*if (variant === global.vui5.cons.variant.standard) {
            oControl.handleReset();
            oControl.fillPersonalizationItems();
            oControl._applyPersonalization(oControl._columnItems);
        } else {
            oControl.fireVariantSelect({
                callBack: function () {
                    oControl._onVariantSelect1(true);
                },
                record: selectedVariant
            });
        }*/

    };

    T.prototype._onVariantSelect1 = function (applyPersonalization) {
        if (!this._PersonalizationDialog) {
            this.createPersonalizationDialog();
        }
        this.addGroupPanelItem(this._PersonalizationDialog);
        var variant = this._oVariants.getSelectionKey();
        return this.fetchVariantData(variant, applyPersonalization, false);
    };

    T.prototype.fetchVariantData = function (variant, applyPersonalization, onlyFilter) {
        var oControl = this,
            oController;
        oController = oControl.getProperty("controller");
        var layoutData = oController.getCurrentModel().getProperty(oControl.getLayoutDataPath());

        this._aggrPanel.getPanelContent();
        if (variant === global.vui5.cons.variant.standard) {
            if (!onlyFilter) {
                oControl.handleReset();
            } else {
                oControl.handleFilterReset();
            }

            oControl.setRenderingDone(false);

            oControl.fillPersonalizationItems(undefined, onlyFilter);
            oControl._applyPersonalization(oControl._columnItems, onlyFilter);
            return;
        }

        if (!onlyFilter) {

            oControl._columnItems = layoutData['COLITEMS'];
            oControl._sortItems = layoutData['SORTITEMS'];
        }
        //this._aggrPanel.getPanelContent();
        oControl._filterItems = layoutData['FILTERITEMS'];
        oControl._groupItems = layoutData['GRPITEMS'];
        oControl.updatePersonalizationItems(applyPersonalization, onlyFilter);


    };

    T.prototype.updatePersonalizationItems = function (applyPersonalization, onlyFilter) {

        var oControl = this;
        //      this._groupPanel.removeAllGroupItems();

        //      Column List Items
        if (!onlyFilter) {

            this._columnPanel.removeAllColumnsItems();
            this._sortPanel.removeAllSortItems();
            this._filterPanel.removeAllFilterItems();
            this._groupPanel.removeAllGroupItems();

            underscoreJS.each(oControl._columnItems, function (object) {
                var visible;
                if (object['VISIBLE'] == "true" || object['VISIBLE'] == true || object['VISIBLE'] == "X") {
                    visible = true;
                } else {
                    visible = false;
                }
                oControl._columnPanel.addColumnsItem(new sap.m.P13nColumnsItem({
                    columnKey: object['COLUMNKEY'],
                    index: object['INDEX'],
                    visible: visible,
                    /*Save Width in Variant-START*/
                    width: object['WIDTH']
                    /*Save Width in Variant-START*/
                }));
            });

            //          Sort Items

            oControl._sortItems = underscoreJS.sortBy(oControl._sortItems, 'INDEX');
            underscoreJS.each(oControl._sortItems, function (object) {
                oControl._sortPanel.addSortItem(new sap.m.P13nSortItem({
                    columnKey: object['COLUMNKEY'],
                    operation: object['OPERATION']
                }));
            });

            //          Filter Items
            underscoreJS.each(oControl._filterItems, function (object) {
                var exclude;
                if (object['EXCLUDE'] == "true" || object['EXCLUDE'] == true || object['EXCLUDE'] == "X")
                    exclude = true;
                else
                    exclude = false;

                oControl._filterPanel.addFilterItem(new sap.m.P13nFilterItem({
                    columnKey: object['COLUMNKEY'],
                    operation: object['OPERATION'],
                    value1: object['VALUE1'],
                    value2: object['VALUE2'],
                    exclude: exclude
                }));
            });
        } else {
            this._filterPanel1.removeAllFilterItems();

            underscoreJS.each(oControl._filterItems, function (object) {
                var exclude;
                if (object['EXCLUDE'] == "true" || object['EXCLUDE'] == true || object['EXCLUDE'] == "X")
                    exclude = true;
                else
                    exclude = false;
                oControl._filterPanel1.addFilterItem(new sap.m.P13nFilterItem({
                    columnKey: object['COLUMNKEY'],
                    operation: object['OPERATION'],
                    value1: object['VALUE1'],
                    value2: object['VALUE2'],
                    exclude: exclude
                }));
            });

        }


        underscoreJS.each(oControl._groupItems, function (object) {
            oControl._groupPanel.addGroupItem(new sap.m.P13nGroupItem({
                columnKey: object['COLUMNKEY'],
                operation: object['OPERATION']
            }));
        });


        if (applyPersonalization) {
            oControl.fillPersonalizationItems(undefined, onlyFilter);
            oControl._applyPersonalization(oControl._columnItems, onlyFilter);
        }
    };

    //*****Rel 60E_SP6
    T.prototype.applyElementFeature = function () {
        var oControl = this;
        var oController = this.getController();
        var model = oController.getCurrentModel();
        var layoutData = model.getProperty(oControl.getLayoutDataPath());

        if (layoutData && !oControl._applyElmtFeature) {
            oControl._applyElmtFeature = true;
            if (!underscoreJS.isEmpty(layoutData['FILTERITEMS']) || !underscoreJS.isEmpty(layoutData['SORTITEMS'])) {
                if (!oControl._PersonalizationDialog) {
                    oControl.createPersonalizationDialog();
                }
                oControl.addGroupPanelItem(oControl._PersonalizationDialog);
                oControl._filterItems = layoutData['FILTERITEMS'];
                oControl._sortItems = layoutData['SORTITEMS'];
                oControl.updatePersonalizationItems(true);
            }
        }
    };
    //*****    

    T.prototype._applyPersonalization = function (tableItems, onlyFilter) {
        var oControl = this;
        var oBinding = oControl.getBinding("rows");


        var aSorters = [];
        var length = tableItems.length;
        var columns = oControl.getColumns();
        var columnsArray = [];
        var positionChanged = false;

        var modelName = oControl.getModelName();
        var model = oControl.getModel(modelName);
        var fieldPath = oControl.getFieldPath();
        var fieldGroupPath = oControl.getFieldGroupPath();
        var fields = model.getProperty(fieldPath);
        var fieldGroups = model.getProperty(fieldGroupPath);
        if (!oControl._groupHideFields) {
            oControl._groupHideFields = [];
        }


        underscoreJS.each(columns, function (column) {
            var object = column.getBindingContext(oControl.getModelName()).getObject();

            var item;
            /* Sort Columns */
            if (!onlyFilter) {
                /***Rel 60E_SP7 - QA 12759 ***/
                /** changes for group fields as columnkey is going empty to the backend which causes no sorting 
                     and sorting indicator is not getting displayed**/
                if (!object['FLDNAME'] && object['FLGRP']) {
                    var group_fields = underscoreJS.where(fields, { FLGRP: object['FLGRP'] });
                    item = underscoreJS.find(oControl._sortItems, {
                        'COLUMNKEY': group_fields[0]['FLDNAME']
                    });
                }
                else {
                    item = underscoreJS.find(oControl._sortItems, {
                        'COLUMNKEY': object['FLDNAME']
                    });

                }
                //            	item = underscoreJS.find(oControl._sortItems, {
                //                    'COLUMNKEY': object['FLDNAME']
                //                });
                /****/
                if (item) {
                    var bDescending = false;
                    column.setSorted(true);
                    if (item['OPERATION'] == "Descending") {
                        column.setSortOrder(sap.ui.table.SortOrder.Descending);
                        bDescending = true;
                    } else
                        column.setSortOrder(sap.ui.table.SortOrder.Ascending);
                    /*Perform Sorting and Filtering in Backend*/
                    if (oControl.getBackendSortFilter() == false)
                        aSorters.push(new Sorter(column.getSortProperty(), bDescending));
                } else {
                    column.setSorted(false);
                }

                /* Column Reordering*/
                item = undefined;

                if (oControl.isGroupingPresent()) {
                    if (object['FLGRP']) {
                        var groupFields, fieldIndex;
                        var determineColumnVisible;
                        groupFields = underscoreJS.where(fields, { FLGRP: object['FLGRP'], ADFLD: '' });
                        determineColumnVisible = 0;
                        underscoreJS.each(groupFields, function (field) {
                            var actualFieldIndex = underscoreJS.findIndex(fields, field);
                            var fieldItem = underscoreJS.find(tableItems, {
                                'COLUMNKEY': field['FLDNAME']
                            });
                            if (fieldItem) {

                                var no_out = 'X';
                                if (fieldItem['VISIBLE'] == true || fieldItem['VISIBLE'] == "true" || fieldItem['VISIBLE'] == 'X') {
                                    no_out = '';
                                    determineColumnVisible++;
                                }

                                if (no_out === 'X') {
                                    oControl._groupHideFields.push(field['FLDNAME']);
                                }
                                else {
                                    if (oControl._groupHideFields.indexOf(field['FLDNAME']) !== -1) {
                                        oControl._groupHideFields.splice(oControl._groupHideFields.indexOf(field['FLDNAME']), 1);
                                    }

                                }
                                model.setProperty(fieldPath + actualFieldIndex + "/NO_OUT", no_out);
                                var fieldPosition = model.getProperty(fieldPath + actualFieldIndex + "/POSTN");

                                if (fieldItem['INDEX'] !== fieldPosition) {
                                    //fieldIndex = fieldItem['INDEX'];
                                    // model.setProperty(fieldPath + actualFieldIndex + "/POSTN", fieldItem['INDEX']);
                                    //columnsArray[fieldItem['INDEX']] = column;
                                    positionChanged = true;
                                }

                                if (fieldIndex === undefined) {
                                    fieldIndex = fieldItem['INDEX'];
                                    columnsArray[fieldItem['INDEX']] = column;
                                }
                            }
                        });
                        var visibleFields;
                        visibleFields = underscoreJS.where(fields, { FLGRP: object['FLGRP'], NO_OUT: '', ADFLD: '' });

                        if (underscoreJS.isEmpty(visibleFields) && determineColumnVisible === 0) {
                            column.setVisible(false);
                        }
                        else {
                            column.setVisible(true);
                        }
                        //item['VISIBLE'] = visibleFields.length > 0;
                        //object['HDGRP'] = item['VISIBLE'] ? '' : 'X';
                        //item['INDEX'] = underscoreJS.findIndex(fieldGroups, { FLGRP: object['FLGRP'] });
                    }
                    else {
                        item = underscoreJS.find(tableItems, {
                            'COLUMNKEY': object['FLDNAME']
                        });

                        if (item === undefined && oControl._oVariants.getSelectionKey() !== "*standard*") {
                            column.setVisible(false);
                        }
                    }


                }
                else {
                    item = underscoreJS.find(tableItems, {
                        'COLUMNKEY': object['FLDNAME']
                    });

                    if (item === undefined && oControl._oVariants.getSelectionKey() !== "*standard*") {
                        column.setVisible(false);
                    }
                }


                if (item) {

                    var visible = false;
                    if (item['VISIBLE'] == true || item['VISIBLE'] == "true" || item['VISIBLE'] == "X")
                        visible = true;


                    if (visible != column.getVisible())
                        column.setVisible(visible);

                    /*Save Width in Variant-START*/
                    /*Rel 60E SP6 QA #10138 - Start
                     * column.setWidth(item['WIDTH']);
                    /*Rel 60E SP6 QA #10138 - End*/
                    /*Save Width in Variant-END*/

                    columnsArray[item['INDEX']] = column;

                    if (item['INDEX'] != column.getIndex()) {
                        positionChanged = true;

                        if (object['FRZCL'] == 'X'
                            && !oControl._oManualColumnFreeze) {
                            oControl._oManualColumnFreeze = true;
                            oControl.setFixedColumnCount(0);
                        }
                    }
                } else if (!object['FLGRP']) {
                    columnsArray[length] = column;
                    length = length + 1;
                }
            }
        });

        if (positionChanged && !onlyFilter) {
            var columnsArrayTemp = [];
            for (var i = 0; i < columnsArray.length; i++) {
                if (columnsArray[i])
                    columnsArrayTemp.push(columnsArray[i]);
            }

            oControl.removeAllColumns();
            underscoreJS.each(columnsArrayTemp, function (column, index) {
                if (column)
                    oControl.insertColumn(column, index);
            });
        }
        /*Perform Sorting and Filtering in Backend*/
        if (!onlyFilter && this.getBackendSortFilter() == false) {
            oBinding.sort(aSorters);
        }

        jQuery.sap.delayedCall(500, this, function () {
            this._applyFilter();
        });

        //this._applyFilter();

        /*Filter Indicator-START*/
        if (this._filterItems.length > 0) {
            this._oFilterTitle.setVisible(true);
            this._oVuiFilterSeparator.setVisible(true);


            var s = '';
            if (this._filterItems.length > 1) {
                s = 's';
            }
            this._oFilterTitle.setText(oControl._oBundle.getText("ActiveFilter", [this._filterItems.length, s]));
        } else {
            this._oFilterTitle.setVisible(false);
            this._oVuiFilterSeparator.setVisible(false);
        }
        /*Filter Indicator-START*/

        /* if (this.getPagingType() == global.vui5.cons.pagingType.serverPaging) {
             var object = this.getSortFilterObjects();
             object.targetPage = 1;//oControl.getCurrentPage();
             object.srcPage = 1;//oControl.getCurrentPage();
             oControl.clearSelection();
             oControl.fireOnPageChange(object);
         } else if (oControl.getBackendSortFilter()) {
             /*Perform Sorting and Filtering in Backend
             var object = this.getSortFilterObjects();
             oControl.clearSelection();
             oControl.fireOnSortFilter(object);
         }*/

        /*var grpColumnRef;
    
        if (underscoreJS.isEmpty(oControl._groupItems) && oControl.getGroupBy()) {
            sap.ui.getCore().byId(oControl.getGroupBy()).setGrouped(false);
            oControl.setEnableGrouping(false);
            oControl.setGroupBy("");
            oControl.setEnableGrouping(true);
        }
        else if (!underscoreJS.isEmpty(oControl._groupItems)) {
            oControl.groupBySet = false;
            grpColumnRef = underscoreJS.find(oControl.getColumns(), function (column) {
                return column.data("contextObject")['FLDNAME'] === oControl._groupItems[0]['COLUMNKEY'];
            });
    
            if (grpColumnRef && oControl.getGroupBy() !== grpColumnRef.getId()) {
                oControl.groupBySet = true;
                oControl.setGroupBy(grpColumnRef.getId());
            }
    
        }
    
        if (oControl.groupingColumn || (grpColumnRef && grpColumnRef.getId())) {
            sap.ui.getCore().byId(oControl.groupingColumn || (grpColumnRef && grpColumnRef.getId())).setGrouped(true);
            oControl.groupingColumn = undefined;
        }*/
    };


    T.prototype.applyGroupBy = function () {
        var oControl = this, groupItems, layoutData;
        var grpColumnRef;

        layoutData = oControl.getModel(oControl.getModelName()).getProperty(oControl.getLayoutDataPath());
        if (underscoreJS.isEmpty(oControl._groupItems) && oControl.getGroupBy()) {
            sap.ui.getCore().byId(oControl.getGroupBy()).setGrouped(false);
            oControl.setEnableGrouping(false);
            oControl.setGroupBy("");
            oControl.setEnableGrouping(true);
        }
        else if (layoutData && !underscoreJS.isEmpty(layoutData['GRPITEMS'])) {

            oControl.groupBySet = false;
            grpColumnRef = underscoreJS.find(oControl.getColumns(), function (column) {
                return column.data("contextObject")['FLDNAME'] === layoutData['GRPITEMS'][0]['COLUMNKEY'];
            });

            if (grpColumnRef && oControl.getGroupBy() !== grpColumnRef.getId()) {
                oControl.groupBySet = true;
                oControl.setGroupBy(grpColumnRef.getId());
            }

        }

        if (oControl.groupingColumn || (grpColumnRef && grpColumnRef.getId())) {
            sap.ui.getCore().byId(oControl.groupingColumn || (grpColumnRef && grpColumnRef.getId())).setGrouped(true);
            oControl.groupingColumn = undefined;
        }

    };

    T.prototype.setSortFilterOnColumns = function () {
        var oControl = this;
        var columns = oControl.getColumns();
        underscoreJS.each(columns, function (column) {
            var object = column.getBindingContext(oControl.getModelName()).getObject();

            /* Filter Columns */
            var item = underscoreJS.find(oControl._filterItems, {
                'COLUMNKEY': object['FLDNAME']
            });
            if (item) {
                column.setFiltered(true);
            } else {
                column.setFiltered(false);
            }

            item = undefined;
            item = underscoreJS.find(oControl._sortItems, {
                'COLUMNKEY': object['FLDNAME']
            });
            if (item) {
                column.setSorted(true);
                if (item['OPERATION'] == "Descending") {
                    column.setSortOrder(sap.ui.table.SortOrder.Descending);
                } else
                    column.setSortOrder(sap.ui.table.SortOrder.Ascending);
            } else {
                column.setSorted(false);
            }
        });
    };

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

    T.prototype.getSortFilterObjects = function (skipSort) {

        var oControl = this;
        var oBinding = oControl.getBinding("rows");
        //      var filters;
        //      if(oBinding.aApplicationFilters[0]){
        //      filters = oBinding.aApplicationFilters[0].aFilters;
        //      }
        var filterObjects = [];
        var index = 0;
        if (this._filterItems && this._filterItems.length > 0) {
            var columns = oControl.getColumns();
            underscoreJS.each(columns, function (column) {
                var object = column.getBindingContext(oControl.getModelName()).getObject();
                var items = underscoreJS.where(oControl._filterItems, {
                    'COLUMNKEY': object['FLDNAME']
                });
                if (items.length > 0) {
                    for (var i = 0; i < items.length; i++) {
                        if (items[i]) {
                            var operation,
                                value1;

                            var sign;
                            if (items[i]['EXCLUDE'] == true || items[i]['EXCLUDE'] == "true" || items[i]['EXCLUDE'] == "X")
                                sign = global.vui5.cons.seloptSign.exclude;
                            else
                                sign = global.vui5.cons.seloptSign.include;

                            if (items[i].OPERATION == sap.ui.model.FilterOperator.Contains) {
                                value1 = '*' + items[i].VALUE1 + '*';
                                operation = 'CP';
                            } else if (items[i].OPERATION == sap.ui.model.FilterOperator.EndsWith) {
                                value1 = '*' + items[i].VALUE1;
                                operation = 'CP';
                            } else if (items[i].OPERATION == sap.ui.model.FilterOperator.StartsWith) {
                                value1 = items[i].VALUE1 + '*';
                                operation = 'CP';
                            } else {
                                value1 = items[i].VALUE1;
                                operation = items[i].OPERATION;
                            }

                            filterObjects.push({
                                'FIELDNAME': column.getFilterProperty(),
                                'ORDER': index,
                                'SIGN': sign,
                                'LOW': value1,
                                'HIGH': items[i].VALUE2,
                                'OPTION': operation
                            });
                            index++;
                        }
                    }
                }
            });
        }

        //      underscoreJS.each(filters,function(item,index){
        //      var operation,value1;
        //      if(item.sOperator == sap.ui.model.FilterOperator.Contains){
        //      value1 = '*' + item.oValue1 + '*';
        //      operation = 'CP';
        //      }else if(item.sOperator == sap.ui.model.FilterOperator.EndsWith) {
        //      value1 = '*' + item.oValue1;
        //      operation = 'CP';
        //      }else if(item.sOperator == sap.ui.model.FilterOperator.StartsWith) {
        //      value1 = item.oValue1 + '*';
        //      operation = 'CP';
        //      }else{
        //      value1 = item.oValue1;
        //      operation = item.sOperator;
        //      }
        //      filterObjects.push({
        //      'FIELDNAME' : item.sPath,
        //      'ORDER' : index,
        //      'SIGN' : global.vui5.cons.seloptSign.include,
        //      'LOW' : value1,
        //      'HIGH' : item.oValue2,
        //      'OPTION' : operation
        //      });
        //      });
        //      var sorters = oBinding.aSorters;
        //      var sortObjects = [];
        //      underscoreJS.each(sorters,function(item,index){
        //      var up,down;
        //      if(item.bDescending){
        //      down = 'X';
        //      up = '';
        //      }else{
        //      down = '';
        //      up = 'X';
        //      }
        //      sortObjects.push({
        //      'SPOS' : index + 1,
        //      'FIELDNAME' : item.sPath,
        //      'UP' : up,
        //      'DOWN' : down
        //      });
        //      index = index + 1;
        //      });

        var sortObjects = [];
        if (!skipSort) {
            if (this._sortItems && this._sortItems.length > 0) {
                var columns = oControl.getColumns();
                underscoreJS.each(columns, function (column) {
                    var sorted = column.getSorted();
                    if (sorted) {
                        var object = column.getBindingContext(oControl.getModelName()).getObject();
                        var item = underscoreJS.find(oControl._sortItems, {
                            'COLUMNKEY': object['FLDNAME']
                        });
                        if (item) {
                            var operation = column.getSortOrder();
                            var up,
                                down;
                            if (operation == "Descending") {
                                down = 'X';
                                up = '';
                            } else {
                                down = '';
                                up = 'X';
                            }
                            sortObjects.push({
                                'SPOS': item['INDEX'],
                                'FIELDNAME': column.getSortProperty(),
                                'UP': up,
                                'DOWN': down
                            });
                        }
                    }
                });
            }
        }

        return {
            sort: sortObjects,
            filter: filterObjects
        };
    };

    T.prototype.onVuiPageChange = function (oEvent) {
        var params = {};
        this.clearSelection();
        var object = this.getSortFilterObjects();
        object.targetPage = oEvent.getParameter("targetPage");
        object.srcPage = oEvent.getParameter("srcPage");
        params[global.vui5.cons.params.pageNumber] = oEvent.getParameter("targetPage");
        this.firePageChange({
            urlParams: params
        });
    };


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
                visible: visible,
                /*Save Width in Variant-START*/
                width: column.getWidth()
                /*Save Width in Variant-END*/
            });


            if (column.getSorted()) {
                var item = underscoreJS.find(oControl._sortItems, {
                    'COLUMNKEY': object['FLDNAME']
                });
                if (item) {
                    variantData.SORTITEMS.push({
                        operation: column.getSortOrder(),
                        columnKey: object['FLDNAME'],
                        index: item['INDEX']
                    });
                }
            }
        });
        variantData.SORTITEMS = this.allKeysToUpperCase(variantData.SORTITEMS);
        variantData.COLUMNITEMS = this.allKeysToUpperCase(variantData.COLUMNITEMS);
        variantData.FILTERITEMS = this.allKeysToUpperCase(this._filterItems);
    };

    T.prototype.onCustomFilter = function (oEvent) {
        var oControl = this;

        /*** Rel 60E SP6 - Filter values sorting based on Label - Start ***/
        //var columns = this.getModel(this.getModelName()).getProperty(this.getFieldPath());
        var columns = $.extend(true, [], this.getModel(this.getModelName()).getProperty(this.getFieldPath()));
        columns = underscoreJS.sortBy(columns, 'LABEL');
        /*** Rel 60E SP6 - Filter values sorting based on Label - End ***/


        if (!this._PersonalizationDialog) {
            this.createPersonalizationDialog();
            oControl.addGroupPanelItem(this._PersonalizationDialog);
            oControl.fillPersonalizationItems();
        }
        if (!this._FilterPersonalization) {
            this._FilterPersonalization = new sap.m.P13nDialog({
                initialVisiblePanelType: "filter",
                showReset: true,
                ok: [oControl.handleFilterOk, oControl],
                cancel: [oControl.handleFilterClose, oControl],
                reset: [oControl.handleFilterReset, oControl]
            });


            this._filterPanel1 = new sap.m.P13nFilterPanel({
                title: oControl._oBundle.getText("Filter"),
                visible: true,
                type: "filter",
                containerQuery: true,

                addFilterItem: this.addFilterItem.bind(this),
                removeFilterItem: this.removeFilterItem.bind(this),
                updateFilterItem: this.updateFilterItem.bind(this)
            });

            this._FilterPersonalization.addPanel(this._filterPanel1);

            this.addDependent(this._FilterPersonalization);
            var _sContentDensityClass;
            if (!sap.ui.Device.support.touch) {
                _sContentDensityClass = "sapUiSizeCompact";
            } else {
                _sContentDensityClass = "sapUiSizeCozy";
            }
            jQuery.sap.syncStyleClass(_sContentDensityClass, this, this._FilterPersonalization);
        }

        oControl._filterPanel1.removeAllItems();

        underscoreJS.each(columns, function (object) {
            var type;
            if (object['INTTYPE'] == global.vui5.cons.intType.number ||
                object['INTTYPE'] == global.vui5.cons.intType.time ||
                object['INTTYPE'] == global.vui5.cons.intType.integer ||
                object['INTTYPE'] == global.vui5.cons.intType.oneByteInteger ||
                object['INTTYPE'] == global.vui5.cons.intType.twoByteInteger ||
                object['INTTYPE'] == global.vui5.cons.intType.packed ||
                object['INTTYPE'] == global.vui5.cons.intType.float ||
                object['INTTYPE'] == global.vui5.cons.intType.decimal16 ||
                object['INTTYPE'] == global.vui5.cons.intType.decimal32) {
                type = 'numeric';
            } else if (object['INTTYPE'] == global.vui5.cons.intType.date) {
                type = 'date';
            } else {
                type = 'string';
            }

            if (object === oEvent.getParameter("column").getBindingContext(oControl.getModelName()).getObject()) {
                oControl._filterPanel1.addItem(new sap.m.P13nItem({
                    columnKey: object['FLDNAME'],
                    text: object['LABEL'],
                    type: type,
                    isDefault: true
                }));
            } else {
                oControl._filterPanel1.addItem(new sap.m.P13nItem({
                    columnKey: object['FLDNAME'],
                    text: object['LABEL'],
                    type: type,
                    isDefault: false
                }));
            }
        });

        this.fillFilterPanelItem(true, oEvent.getParameter("column"));
        //this.fillFilterPanelItem(true);
        this.fillPersonalizationItems(undefined, true);
        this._FilterPersonalization.open();
    };

    T.prototype.handleFilterOk = function () {
        var oControl = this;
        oControl.fillPersonalizationItems(undefined, true);
        oControl._variantData = {
            "VARIANTS": [],
            "LAYOUT": {
                "COLITEMS": oControl.allKeysToUpperCase(oControl._columnItems),
                "SORTITEMS": oControl.allKeysToUpperCase(oControl._sortItems),
                "FILTERITEMS": oControl.allKeysToUpperCase(oControl._filterItems),
                "GRPITEMS": oControl.allKeysToUpperCase(oControl._groupItems),
                "AGRGTITEMS": oControl.allKeysToUpperCase(oControl._aggrPanel.getItems())
            }
        };

        oControl.fireLayoutManage({
            callBack: function () {
                oControl._applyPersonalization([], true);
                oControl._FilterPersonalization.close();
            }
        });

    };

    T.prototype.handleFilterClose = function () {
        var oControl = this;
        oControl._filterPanel1.removeAllFilterItems();
        underscoreJS.each(this._filterItems, function (item) {
            var exclude;
            if (item['EXCLUDE'] == "true" || item['EXCLUDE'] == true || item['EXCLUDE'] == "X")
                exclude = true;
            else
                exclude = false;

            oControl._filterPanel1.addFilterItem(new sap.m.P13nFilterItem({
                columnKey: item['COLUMNKEY'],
                operation: item['OPERATION'],
                value1: item['VALUE1'],
                value2: item['VALUE2'],
                exclude: exclude
            }));
        });
        this._FilterPersonalization.close();
    };

    T.prototype.handleFilterReset = function () {
        var variant = this._oVariants.getSelectionKey();
        if (variant != "*standard*") {
            this.fetchVariantData(variant, false, true);
        } else {
            this._filterPanel1.removeAllFilterItems();
            /* Grouping Changes*/
            //          this._groupPanel.removeAllGroupItems();
        }
        this._oVariants.currentVariantSetModified(false);
    };

    T.prototype.fillFilterPanelItem = function (onlyFilter, currentColumn) {
        var oControl = this;
        /***Rel 60E_SP7 - QA 12759 ***/
        var model = oControl.getModel(this.getModelName());
        var fields = model.getProperty(this.getFieldPath());
        /***/

        if (!onlyFilter) {
            oControl._filterPanel.removeAllFilterItems();
            underscoreJS.each(oControl._filterItems, function (object) {
                var exclude;
                if (object['EXCLUDE'] == true || object['EXCLUDE'] == "true" || object['EXCLUDE'] == "X") {
                    exclude = true;
                } else {
                    exclude = false;
                }
                oControl._filterPanel.addFilterItem(new sap.m.P13nFilterItem({
                    columnKey: object['COLUMNKEY'],
                    operation: object['OPERATION'],
                    value1: object['VALUE1'],
                    value2: object['VALUE2'],
                    exclude: exclude
                }));
            });
        } else {
            oControl._filterPanel1.removeAllFilterItems();
            underscoreJS.each(oControl._filterItems, function (object) {
                var exclude;
                if (object['EXCLUDE'] == true || object['EXCLUDE'] == "true" || object['EXCLUDE'] == "X") {
                    exclude = true;
                } else {
                    exclude = false;
                }
                oControl._filterPanel1.addFilterItem(new sap.m.P13nFilterItem({
                    columnKey: object['COLUMNKEY'],
                    operation: object['OPERATION'],
                    value1: object['VALUE1'],
                    value2: object['VALUE2'],
                    exclude: exclude
                }));
            });
            var items = oControl._filterPanel1.getFilterItems();

            //*****Rel 60E_SP6
            //if (currentColumn && oControl._filterItems.length != 0) {

            if (currentColumn) {
                //*****
                var obj = currentColumn.getBindingContext(oControl.getModelName()).getObject();
                var filterItemExists;
                /***Rel 60E_SP7 - QA 12759 ***/
                /**on Custom Filter dialog is not getting opened when there are group fields ***/
                if (!underscoreJS.isEmpty(model.getProperty(oControl.getFieldGroupPath()))) {

                    var group_fields = obj['FLDNAME'] ? underscoreJS.where(fields, { FLDNAME: obj['FLDNAME'] }) :
                        underscoreJS.where(fields, { FLGRP: obj['FLGRP'] });
                    underscoreJS.each(group_fields, function (obj) {
                        underscoreJS.each(items, function (item) {
                            if (item.getColumnKey() == obj['FLDNAME']) {
                                filterItemExists = true;
                            }
                        });
                        if (!filterItemExists) {

                            var value1 = "", value2 = "";

                            if (obj['DATATYPE'] == global.vui5.cons.dataType.amount ||
                                       obj['DATATYPE'] == global.vui5.cons.dataType.quantity ||
                                       obj['DATATYPE'] == global.vui5.cons.dataType.decimal ||
                                       obj['DATATYPE'].substr(0, 3) == global.vui5.cons.dataType.integer) {
                                value1 = 0;
                                value2 = 0;

                            }

                            oControl._filterPanel1.addFilterItem(new sap.m.P13nFilterItem({
                                columnKey: obj['FLDNAME'],
                                operation: "EQ",
                                value1: value1,
                                value2: value2,
                                exclude: false
                            }));
                        }

                    })

                }
                    /***/
                else {

                    underscoreJS.each(items, function (item) {
                        if (item.getColumnKey() == obj['FLDNAME']) {
                            filterItemExists = true;
                        }
                    });
                    if (!filterItemExists) {

                        var value1 = "", value2 = "";

                        if (obj['DATATYPE'] == global.vui5.cons.dataType.amount ||
	                               obj['DATATYPE'] == global.vui5.cons.dataType.quantity ||
	                               obj['DATATYPE'] == global.vui5.cons.dataType.decimal ||
	                               obj['DATATYPE'].substr(0, 3) == global.vui5.cons.dataType.integer) {
                            value1 = 0;
                            value2 = 0;

                        }

                        oControl._filterPanel1.addFilterItem(new sap.m.P13nFilterItem({
                            columnKey: obj['FLDNAME'],
                            operation: "EQ",
                            value1: value1,
                            value2: value2,
                            exclude: false
                        }));
                    }
                }

            }
        }
    };

    /*Search and Replace Changes*/
    /* Create Search andd Replace Dialog*/
    T.prototype.searchAndReplaceDialog = function () {
        var oControl = this;
        var model;
        if (!oControl._oSearchAndReplaceDialog) {
            oControl._searchAndReplaceModelName = "SEARCHREPLACE";

            oControl._oSearchAndReplaceDialog = new sap.m.Dialog({
                title: oControl._oBundle.getText("FindAndReplace"),
                showHeader: true,
                draggable: true,
                buttons: [
                    new sap.m.Button({
                        text: oControl._oBundle.getText("Find"),
                        visible: "{" + oControl._searchAndReplaceModelName + ">/VISIBLE}",
                        press: [oControl.findValue, oControl]
                    }),
                    new sap.m.Button({
                        text: oControl._oBundle.getText("Replace"),
                        visible: "{" + oControl._searchAndReplaceModelName + ">/VISIBLE}",
                        press: [oControl.replaceValue, oControl]
                    }),
                    new sap.m.Button({
                        text: oControl._oBundle.getText("ReplaceAll"),
                        visible: "{" + oControl._searchAndReplaceModelName + ">/VISIBLE}",
                        press: [oControl.replaceAll, oControl]
                    }),
                    new sap.m.Button({
                        text: oControl._oBundle.getText("Cancel"),
                        press: function () {
                            if (oControl.searchAndReplace.control)
                                $(oControl.searchAndReplace.control.getDomRef()).parent().css('background-color', '');
                            //*****Rel 60E_SP6 - QA #9410
                            if (oControl.itemFound) {
                                oControl.itemFound = false;
                                oControl.fireOnUpdate();
                            }
                            //*****
                            oControl._oSearchAndReplaceDialog.close();
                        }
                    })]
            });

            oControl.addDependent(oControl._oSearchAndReplaceDialog);
            var _sContentDensityClass;
            if (!sap.ui.Device.support.touch) {
                _sContentDensityClass = "sapUiSizeCompact";
            } else {
                _sContentDensityClass = "sapUiSizeCozy";
            }
            jQuery.sap.syncStyleClass(_sContentDensityClass, oControl, oControl._oSearchAndReplaceDialog);

            model = new JSONModel();
            var data = {
                'VISIBLE': false
            };
            model.setData(data);
            oControl._oSearchAndReplaceDialog.setModel(model, oControl._searchAndReplaceModelName);

            //oControl._selectField = new sap.m.ComboBox({
            oControl._selectField = new global.vui5.ui.controls.ComboBox({
                selectionChange: [oControl._onSearchFieldChange, oControl]
            });
            model = undefined;
            model = this.getModel(oControl.getModelName());
            var fields = model.getProperty(oControl.getFieldPath());
            underscoreJS.each(fields, function (field) {
                if (field['NO_OUT'] == '') {
                    oControl._selectField.addItem(new sap.ui.core.Item({
                        key: field['FLDNAME'],
                        text: field['LABEL']
                    }));
                }
            });
        }
        oControl._selectField.setSelectedKey("");
        model = undefined;
        model = oControl._oSearchAndReplaceDialog.getModel(oControl._searchAndReplaceModelName);
        model.setProperty("/VISIBLE", false);

        oControl._oSearchAndReplaceDialog.removeAllContent();

        var contentData = [];
        contentData.push(new sap.m.Label({
            text: oControl._oBundle.getText("Fields")
        }));

        contentData.push(oControl._selectField);

        var simpleForm = new sap.ui.layout.form.SimpleForm({
            layout: sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout,
            editable: true,
            content: contentData
        });

        oControl._oSearchAndReplaceDialog.addContent(simpleForm);

        oControl.searchAndReplace = {
            itemFindIndex: -1
        };
        oControl._oSearchAndReplaceDialog.open();
    };

    /*Replace All*/
    T.prototype.replaceAll = function () {
        var oControl = this;

        var selectedField = oControl._selectField.getSelectedKey();
        var modelName = oControl.getModelName();
        var model = oControl.getModel(modelName);
        var fields = model.getProperty(oControl.getFieldPath());

        var searchFor = model.getProperty("/__SEARCH/DATA/" + selectedField);
        var replaceWith = model.getProperty("/__REPLACE/DATA/" + selectedField);

        /*Search and Replace Issue - 6446*/
        if (!searchFor || !replaceWith)
            return;
        /*Search and Replace Issue - 6446*/

        var columns = oControl.getColumns();

        var controls = [], controlFound = false;

        var field,
            i,
            rowPath,
            binding,
            cells,
            cellIndex,
            colIndex,
            column;



        var columnFieldInfo;
        //var initialScrollPosition = oControl._oVSb.getScrollPosition();

        var initialScrollPosition = oControl.getFirstVisibleRow();

        var selectedIndices = underscoreJS.clone(this.getSelectedIndices());
        if (selectedIndices.length == 0) {
            var aIndices = this.getBinding("rows").aIndices;
            for (i = 0; i < aIndices.length; i++) {
                selectedIndices.push(i);
            }
        }

        field = underscoreJS.find(fields, {
            'FLDNAME': selectedField
        });

        var rows = this.getRows();
        var noOfRows = rows.length;

        var fieldname;
        if (field['DATATYPE'] == global.vui5.cons.dataType.amount ||
            field['DATATYPE'] == global.vui5.cons.dataType.quantity ||
            field['DATATYPE'] == global.vui5.cons.dataType.decimal ||
            field['DATATYPE'].substr(0, 3) == global.vui5.cons.dataType.integer) {
            fieldname = field['TXTFL'];
        } else {
            fieldname = selectedField;
        }
        var itemFound;
        for (i = 0; i < selectedIndices.length; i++) {

            var context = this.getContextByIndex(selectedIndices[i]);
            var rowData = context.getObject();
            rowPath = context.getPath();
            itemFound = false;
            var value;
            switch (field['ELTYP']) {
                case global.vui5.cons.element.input:
                    if (field['SDSCR'] == global.vui5.cons.fieldValue.value
                        || field['SDSCR'] == global.vui5.cons.fieldValue.value_descr || field['DATATYPE'] == global.vui5.cons.dataType.date) {
                        value = "" + rowData[fieldname];
                        if (value.indexOf(searchFor) != -1) {
                            itemFound = true;
                        }
                    } else {
                        value = rowData[field['TXTFL']];
                        if (value == searchFor) {
                            itemFound = true;
                        }
                    }
                    break;
                case global.vui5.cons.element.valueHelp:
                    if (field['SDSCR'] == global.vui5.cons.fieldValue.value
                        || field['SDSCR'] == global.vui5.cons.fieldValue.value_descr) {
                        value = "" + rowData[fieldname];
                        if (value.indexOf(searchFor) != -1) {
                            itemFound = true;
                        }
                    } else {
                        value = rowData[field['TXTFL']];
                        if (value == searchFor) {
                            itemFound = true;
                        }
                    }
                    break;
                case global.vui5.cons.element.dropDown:
                    value = rowData[selectedField];
                    if (value == searchFor) {
                        itemFound = true;
                    }
                    break;
                case global.vui5.cons.element.checkBox:
                    value = rowData[selectedField];
                    if (value == searchFor) {
                        itemFound = true;
                    }
                    break;
                    //*****Rel 60E_SP6 - Task #39097
                case global.vui5.cons.element.toggle:
                    value = rowData[selectedField];
                    if (value == searchFor) {
                        itemFound = true;
                    }
                    break;
                    //*****
            }

            if (itemFound) {

                //var scrollPosition = this._oVSb.getScrollPosition(); //First Row Position
                var scrollPosition = oControl.getFirstVisibleRow(); //First Row Position
                var lastRowPosition = scrollPosition + noOfRows; // last row position
                var diff = selectedIndices[i] - scrollPosition;
                var selectedRowPath;
                /* if selectedIndex length between the scrollPosition and lastRowPosition*/
                if (scrollPosition <= selectedIndices[i] &&
                    selectedIndices[i] < lastRowPosition) {

                    binding = undefined;
                    binding = rows[diff].getBindingContext(modelName);
                    if (binding) {
                        selectedRowPath = binding.getPath();
                        if (selectedRowPath == rowPath) {
                            cells = undefined;
                            cells = rows[diff].getCells();
                            for (cellIndex = 0; cellIndex < cells.length; cellIndex++) {

                                controls = oControl.getSearchReplaceControl(cells, cellIndex);
                                for (var controlIndex = 0 ; controlIndex < controls.length ; controlIndex++) {
                                    colIndex = controls[controlIndex].data("sap-ui-colindex");
                                    column = columns[colIndex];

                                    if (controls[controlIndex].data("fieldInfo")) {
                                        columnFieldInfo = controls[controlIndex].data("fieldInfo");
                                    }
                                    else {
                                        columnFieldInfo = column.getBindingContext(modelName).getObject();
                                    }

                                    if (columnFieldInfo['FLDNAME'] == selectedField) {
                                        oControl._replaceValue(controls[controlIndex], field, searchFor, replaceWith);
                                        controlFound = true;
                                        break;
                                    }
                                }
                                if (controlFound) {
                                    controlFound = false;
                                    break;
                                }
                            }
                        }
                    }
                    /*else set scroll position and then find column*/
                } else {

                    //this._oVSb.setScrollPosition(selectedIndices[i]);
                    //this.setFirstVisibleRow(this._getScrollTop(), true);
                    //this._determineVisibleCols();
                    //this._updateTableContent();
                    this.setFirstVisibleRow(selectedIndices[i]);
                    this._updateBindingContexts();
                    //this._updateVSb();


                    scrollPosition = oControl.getFirstVisibleRow();
                    lastRowPosition = scrollPosition + noOfRows;
                    diff = selectedIndices[i] - scrollPosition;

                    binding = undefined;
                    binding = rows[diff].getBindingContext(modelName);

                    if (binding) {
                        selectedRowPath = binding.getPath();
                        if (selectedRowPath == rowPath) {
                            cells = undefined;
                            cells = rows[diff].getCells();
                            for (cellIndex = 0; cellIndex < cells.length; cellIndex++) {
                                controls = oControl.getSearchReplaceControl(cells, cellIndex);
                                for (var controlIndex = 0 ; controlIndex < controls.length ; controlIndex++) {
                                    colIndex = controls[controlIndex].data("sap-ui-colindex");
                                    column = columns[colIndex];

                                    if (controls[controlIndex].data("fieldInfo")) {
                                        columnFieldInfo = controls[controlIndex].data("fieldInfo");
                                    }
                                    else {
                                        columnFieldInfo = column.getBindingContext(modelName).getObject();
                                    }

                                    if (columnFieldInfo['FLDNAME'] == selectedField) {
                                        oControl._replaceValue(controls[controlIndex], field, searchFor, replaceWith);
                                        controlFound = true;
                                        break;
                                    }
                                }
                                if (controlFound) {
                                    controlFound = false;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }

        /*Set Scroll Position to where it was*/
        //oControl._oVSb.setScrollPosition(initialScrollPosition);
        //this.setFirstVisibleRow(this._getScrollTop(), true);
        //this._determineVisibleCols();
        //this._updateTableContent();
        this.setFirstVisibleRow(initialScrollPosition);
        this._updateBindingContexts();
        //this._updateVSb();

        /**/

    };

    T.prototype.getSearchReplaceControl = function (cells, cellIndex) {
        var oControl = this, vBoxItems, hBoxItems, control = [];
        if (cells[cellIndex] instanceof sap.m.VBox) {
            vBoxItems = cells[cellIndex].getItems();
            underscoreJS.each(vBoxItems, function (vboxItem) {
                hBoxItems = vboxItem.getItems();
                underscoreJS.each(hBoxItems, function (hBoxItem) {
                    if (hBoxItem.data("fieldInfo")) {
                        control.push(hBoxItem);
                    }
                })
            });
        }
        else {
            control.push(cells[cellIndex]);
        }

        return control;
    };
    /*Find*/
    T.prototype.findValue = function () {

        var oControl = this;

        var modelName = oControl.getModelName();
        var model = oControl.getModel(modelName);

        var fields = model.getProperty(oControl.getFieldPath());
        var itemFound = false;

        var selectedField = oControl._selectField.getSelectedKey();
        var searchFor = model.getProperty("/__SEARCH/DATA/" + selectedField);
        /*Search and Replace Issue - 6446*/
        if (!searchFor)
            return;
        /*Search and Replace Issue - 6446*/
        var columns = oControl.getColumns();
        var field,
            fieldname,
            rowData,
            rowPath,
            binding;
        var cells,
            cellIndex,
            colIndex,
            column;

        var controls = [], controlFound = false;
        //*****Rel 60E_SP6 - QA #9410
        oControl.itemFound = true;
        //*****


        var i;
        var selectedIndices = underscoreJS.clone(this.getSelectedIndices());
        if (selectedIndices.length == 0) {
            var aIndices = this.getBinding("rows").aIndices;
            for (i = 0; i < aIndices.length; i++) {
                selectedIndices.push(i);
            }
        }

        var rows = this.getRows();
        var noOfRows = rows.length;

        field = underscoreJS.find(fields, {
            'FLDNAME': selectedField
        });

        if (field['DATATYPE'] == global.vui5.cons.dataType.amount ||
            field['DATATYPE'] == global.vui5.cons.dataType.quantity ||
            field['DATATYPE'] == global.vui5.cons.dataType.decimal ||
            field['DATATYPE'].substr(0, 3) == global.vui5.cons.dataType.integer) {
            fieldname = field['TXTFL'];
        } else {
            fieldname = selectedField;
        }

        for (i = 0; i < selectedIndices.length; i++) {

            if (selectedIndices[i] > oControl.searchAndReplace.itemFindIndex) {
                var context = this.getContextByIndex(selectedIndices[i]);
                rowData = context.getObject();
                rowPath = context.getPath();
                var value;
                switch (field['ELTYP']) {
                    case global.vui5.cons.element.input:
                        if (field['SDSCR'] == global.vui5.cons.fieldValue.value
                            || field['SDSCR'] == global.vui5.cons.fieldValue.value_descr || field['DATATYPE'] == global.vui5.cons.dataType.date) {
                            value = "" + rowData[fieldname];
                            if (value.indexOf(searchFor) != -1) {
                                itemFound = true;
                            }
                        } else {
                            value = rowData[field['TXTFL']];
                            if (value == searchFor) {
                                itemFound = true;
                            }
                        }
                        break;
                    case global.vui5.cons.element.valueHelp:
                        if (field['SDSCR'] == global.vui5.cons.fieldValue.value
                            || field['SDSCR'] == global.vui5.cons.fieldValue.value_descr) {
                            value = "" + rowData[fieldname];
                            if (value.indexOf(searchFor) != -1) {
                                itemFound = true;
                            }
                        } else {
                            value = rowData[field['TXTFL']];
                            if (value == searchFor) {
                                itemFound = true;
                            }
                        }
                        break;
                    case global.vui5.cons.element.dropDown:
                        value = rowData[selectedField];
                        if (value == searchFor) {
                            itemFound = true;
                        }
                        break;
                    case global.vui5.cons.element.checkBox:
                        value = rowData[selectedField];
                        if (value == searchFor) {
                            itemFound = true;
                        }
                        break;
                        //*****Rel 60E_SP6 - Task #39097
                    case global.vui5.cons.element.toggle:
                        value = rowData[selectedField];
                        if (value == searchFor) {
                            itemFound = true;
                        }
                        break;
                        //*****
                }
                if (itemFound) {

                    /*Clear color of previous cell*/
                    if (oControl.searchAndReplace.control) {
                        $(oControl.searchAndReplace.control.getDomRef()).parent().css('background-color', '');
                    }
                    oControl.searchAndReplace.itemFindIndex = selectedIndices[i];


                    //var scrollPosition = this._oVSb.getScrollPosition(); //First Row Position
                    var scrollPosition = oControl.getFirstVisibleRow(); //First Row Position
                    var lastRowPosition = scrollPosition + noOfRows; // last row position

                    /* if selectedIndex length between the scrollPosition and lastRowPosition*/
                    if (scrollPosition <= selectedIndices[i] &&
                        selectedIndices[i] < lastRowPosition) {

                        var diff = selectedIndices[i] - scrollPosition;

                        binding = rows[diff].getBindingContext(modelName);
                        if (binding) {
                            var selectedRowPath = binding.getPath();
                            if (selectedRowPath == rowPath) {
                                cells = rows[diff].getCells();
                                for (cellIndex = 0; cellIndex < cells.length; cellIndex++) {

                                    controls = oControl.getSearchReplaceControl(cells, cellIndex);

                                    for (var controlIndex = 0 ; controlIndex < controls.length ; controlIndex++) {
                                        colIndex = controls[controlIndex].data("sap-ui-colindex");

                                        column = columns[colIndex];
                                        var columnFieldInfo;

                                        if (controls[controlIndex].data("fieldInfo")) {
                                            columnFieldInfo = controls[controlIndex].data("fieldInfo");
                                        }
                                        else {
                                            columnFieldInfo = column.getBindingContext(modelName).getObject();
                                        }
                                        if (columnFieldInfo['FLDNAME'] == selectedField) {
                                            oControl.searchAndReplace.searchRowPath = rowPath;
                                            oControl.searchAndReplace.control = controls[controlIndex];
                                            $(oControl.searchAndReplace.control.getDomRef()).parent().css('background-color', 'yellow');
                                            oControl.searchAndReplace.control.focus();
                                            controlFound = true;
                                            break;
                                        }
                                    }
                                    if (controlFound) {
                                        break;
                                    }

                                }
                                break;
                            }
                        } else {
                            break;
                        }
                        /*else set scroll position and then find column*/
                    } else {

                        // this._oVSb.setScrollPosition(selectedIndices[i]);
                        this.setFirstVisibleRow(selectedIndices[i]);

                        setTimeout(function () {

                            var scrollPosition = oControl._oVSb.getScrollPosition();
                            var diff = selectedIndices[i] - scrollPosition;

                            var binding = rows[diff].getBindingContext(modelName);

                            if (binding) {
                                var selectedRowPath = binding.getPath();
                                if (selectedRowPath == rowPath) {
                                    var cells = rows[diff].getCells();
                                    for (var controlIndex = 0 ; controlIndex < controls.length ; controlIndex++) {
                                        colIndex = controls[controlIndex].data("sap-ui-colindex");

                                        column = columns[colIndex];
                                        var columnFieldInfo;

                                        if (controls[controlIndex].data("fieldInfo")) {
                                            columnFieldInfo = controls[controlIndex].data("fieldInfo");
                                        }
                                        else {
                                            columnFieldInfo = column.getBindingContext(modelName).getObject();
                                        }
                                        if (columnFieldInfo['FLDNAME'] == selectedField) {
                                            oControl.searchAndReplace.searchRowPath = rowPath;
                                            oControl.searchAndReplace.control = controls[controlIndex];
                                            $(oControl.searchAndReplace.control.getDomRef()).parent().css('background-color', 'yellow');
                                            oControl.searchAndReplace.control.focus();
                                            controlFound = true;
                                            break;
                                        }
                                    }
                                }
                            }
                        }, 100);
                        break;
                    }
                }
            }
        }


    };

    /*Replace Value*/
    T.prototype.replaceValue = function () {
        var oControl = this;

        if (oControl.searchAndReplace.control && oControl.searchAndReplace.control.getEditable()) {

            var selectedField = oControl._selectField.getSelectedKey();

            var model = oControl.getModel(oControl.getModelName());

            var fields = model.getProperty(oControl.getFieldPath());
            var field = underscoreJS.find(fields, {
                'FLDNAME': selectedField
            });

            var searchFor = model.getProperty("/__SEARCH/DATA/" + selectedField);
            var replaceWith = model.getProperty("/__REPLACE/DATA/" + selectedField);

            /*Search and Replace Issue - 6446*/
            if (!searchFor || !replaceWith)
                return;
            /*Search and Replace Issue - 6446*/
            //*****Rel 60E_SP6 - QA #9410
            oControl.itemFound = true;
            //*****
            var selection = oControl.searchAndReplace.control;
            var value;
            switch (field['ELTYP']) {
                case global.vui5.cons.element.input:
                    if (field['SDSCR'] == global.vui5.cons.fieldValue.value
                        || field['SDSCR'] == global.vui5.cons.fieldValue.value_descr) {
                        value = "" + selection.getValue();
                        value = value.replace(searchFor, replaceWith);
                        selection.setValue(value);
                        selection.fireChange();
                    } else {
                        value = replaceWith;
                        selection.setValue(value);
                        selection.fireChange();
                    }
                    break;

                case global.vui5.cons.element.valueHelp:
                    if (field['SDSCR'] == global.vui5.cons.fieldValue.value
                        || field['SDSCR'] == global.vui5.cons.fieldValue.value_descr) {
                        value = "" + selection.getValue();
                        value = value.replace(searchFor, replaceWith);
                        selection.setValue(value);
                        selection.fireChange();
                    } else {
                        value = replaceWith;
                        selection.setValue(value);
                        selection.fireChange();
                    }
                    break;

                case global.vui5.cons.element.dropDown:
                    value = replaceWith;
                    /*** Rel 60E SP6 - Search & Replace not working when we click on Replace Button in Popup - Start **/
                    selection.setSelectedKey(value);
                    /*** Rel 60E SP6 - Search & Replace not working when we click on Replace Button in Popup - End **/
                    selection.setValue(value);
                    selection.fireChange();
                    break;

                case global.vui5.cons.element.checkBox:
                    value = replaceWith;
                    selection.setSelected(value);
                    selection.fireSelect();
                    break;
                    //*****Rel 60E_SP6 - Task #39097
                case global.vui5.cons.element.toggle:
                    value = replaceWith;
                    selection.setState(value);
                    selection.fireChange();
                    break;
                    //*****
            }
        }
        oControl.findValue();
    };
    /*Search and Replace Changes*/

    T.prototype.getDetailButton = function () {
        return this._oDetailButton;
    };


    T.prototype.onValueHelpRequest = function (oEvent) {

        var source = oEvent.getSource();
        var model = source.getModel(source.data("model"));
        var fieldInfo = model.getProperty(source.data("path"));
        var rowid = model.getProperty(oEvent.getSource().getParent().getBindingContext("infocusModel").getPath())['ROWID'] || '';

        this.fireOnValueHelpRequest({
            oEvent: oEvent,
            fieldInfo: fieldInfo,
            rowId: rowid
        });
    };

    /*Set Values Changes*/


    T.prototype.setValuesDialog = function () {
        // jQuery.sap.require("globalUtilsPath/Controls/VuiSetValues");
        var oControl = this;
        oControl._setValuesdialog = new global.vui5.ui.controls.SetValues({
            controller: this.getController(),
            modelName: this.getModelName(),
            fieldPath: this.getFieldPath(),
            dataPath: this.getDataPath(),
            dataAreaPath: this.getDataAreaPath(),
            onValueHelpRequest: function (oEvent) {
                oControl.fireOnValueHelpRequest({
                    oEvent: oEvent.getParameter("oEvent"),
                    fieldInfo: oEvent.getParameter("fieldInfo")
                });

            },

            onApply: function (oEvent) {
                oControl._setValuesData = oEvent.getParameter("DATA");
                oControl.fireOnSetValuesApply();
                oControl._setValuesdialog.close();
            },
            onClose: function (oEvent) {
                oControl.fireOnSetValuesClose();
            }
        });

        oControl._setValuesdialog.preProcessFieldEvent = function (oEvent) {
            return oControl.preProcessFieldEvent(oEvent);
        };

        var _sContentDensityClass;
        if (!sap.ui.Device.support.touch) {
            _sContentDensityClass = "sapUiSizeCompact";
        } else {
            _sContentDensityClass = "sapUiSizeCozy";
        }

        jQuery.sap.syncStyleClass(_sContentDensityClass, this, oControl._setValuesdialog);

        var model = this.getModel(this.getModelName());
        oControl._setValuesdialog.setModel(model, this.getModelName());
        oControl._setValuesdialog.setModel(this.getProperty("controller").getMainModel(), global.vui5.modelName);
        oControl._setValuesdialog.prepareDialog();
        oControl._setValuesdialog.open();

    };
    /*Set Values Changes*/
    T.prototype.onFieldClick = function (oEvent) {
        var oControl = this;
        var rowPath = oEvent.getSource().getParent().getBindingContext(oControl.getModelName());
        var rowdata = oControl.getModel(oControl.getModelName()).getProperty(rowPath.sPath);

        var params = {};

        params[global.vui5.cons.params.selectedRow] = rowdata['ROWID'] || "";
        params[global.vui5.cons.params.fieldName] = oEvent.getSource().data("fieldname") || "";
        oControl.fireOnFieldClick({
            'urlParams': params,
            'fieldInfo': oEvent.getSource().data("fieldInfo")
        });
    };

    T.prototype.__attachPageChange = function () {
        if (!this.__pageChangeAttached) {
            this.__pageChangeAttached = true;
            var oControl = this;
            this._oPaginator.attachPage(function () {
                oControl.removeSelections();
            });
        }
    };


    T.prototype._replaceValue = function (cell, field, searchFor, replaceWith) {
        var oControl = this;
        var dataModified = false;
        var modelName = oControl.getModelName();
        var model = oControl.getModel(modelName);
        var value,
            path;
        //*****Rel 60E_SP6 - QA #9410
        oControl.itemFound = true;
        //*****
        if (cell.getEditable()) {
            switch (field['ELTYP']) {
                case global.vui5.cons.element.input:
                    if (field['SDSCR'] == global.vui5.cons.fieldValue.value
                        || field['SDSCR'] == global.vui5.cons.fieldValue.value_descr) {
                        value = "" + cell.getValue();
                        if (value.indexOf(searchFor) != -1) {
                            value = value.replace(searchFor, replaceWith);
                            cell.setValue(value);
                            cell.fireChange();
                            dataModified = true;
                        }
                    } else {
                        path = cell.getBindingContext(oControl.getModelName()).getPath();
                        path = path + "/" + cell.getBinding("value").getPath();

                        value = model.getProperty(path);
                        if (value == searchFor) {
                            value = replaceWith;
                            cell.setValue(value);
                            cell.fireChange();
                            dataModified = true;
                        }
                    }
                    break;
                case global.vui5.cons.element.valueHelp:
                    if (field['SDSCR'] == global.vui5.cons.fieldValue.value
                        || field['SDSCR'] == global.vui5.cons.fieldValue.value_descr) {
                        value = "" + cell.getValue();
                        if (value.indexOf(searchFor) != -1) {
                            value = value.replace(searchFor, replaceWith);
                            cell.setValue(value);
                            cell.fireChange();
                            dataModified = true;
                        }
                    } else {
                        path = cell.getBindingContext(oControl.getModelName()).getPath();
                        path = path + "/" + cell.getBinding("value").getPath();

                        value = model.getProperty(path);
                        if (value == searchFor) {
                            value = replaceWith;
                            cell.setValue(value);
                            cell.fireChange();
                            dataModified = true;
                        }
                    }
                    break;
                case global.vui5.cons.element.dropDown:
                    value = cell.getSelectedKey();
                    if (value == searchFor) {
                        value = replaceWith;
                        cell.setSelectedKey(value);
                        cell.fireChange();
                        dataModified = true;
                    }
                    break;
                case global.vui5.cons.element.checkBox:
                    value = cell.getSelected();
                    if (value == searchFor) {
                        value = replaceWith;
                        cell.setSelected(value);
                        cell.fireSelect();
                        dataModified = true;
                    }
                    break;
                    //*****Rel 60E_SP6 - Task #39097
                case global.vui5.cons.element.toggle:
                    value = cell.getState();
                    if (value == searchFor) {
                        value = replaceWith;
                        cell.setState(value);
                        cell.fireChange();
                        dataModified = true;
                    }
                    break;
                    //*****
            }
        }
        return dataModified;
    };

    T.prototype._onSearchValueChange = function () {
        var oControl = this;
        oControl.searchAndReplace.itemFindIndex = -1;
    };

    /*Check Field Properties*/
    T.prototype._searchReplaceFieldCheck = function (selection, field) {
        var oController = this.getController();

        if (field['INTTYPE'] == global.vui5.cons.intType.number) {
            selection.attachChange(oController.checkNumericField.bind(oController));
        } else if (field['INTTYPE'] == global.vui5.cons.intType.packed) {
            selection.attachChange(oController.checkPackedField.bind(oController));
        } else if (field['INTTYPE'] == global.vui5.cons.intType.integer) {
            selection.attachChange(oController.checkIntegerField.bind(oController));
        }
    };

    T.prototype._afterColumnSort = function () {
        if (this.getBackendSortFilter())
            this.getBinding("rows").sort([]);
    }

    T.prototype._onSort = function (oEvent) {
        var oControl = this, sortOrder, column, field, model, fields, sortItems, columnKey;
        this._sortItems = [];
        sortOrder = oEvent.getParameter("sortOrder");
        column = oEvent.getParameter("column");
        field = column.getBindingContext(this.getModelName()).getObject();
        /***Rel 60E_SP7 - QA 12759 ***/
        model = oControl.getModel(this.getModelName());
        fields = model.getProperty(this.getFieldPath());
        /***/
        if (!oControl._PersonalizationDialog) {
            oControl.createPersonalizationDialog();
            oControl.addGroupPanelItem(oControl._PersonalizationDialog);

        }
        sortItems = oControl._sortPanel.getSortItems();
        /***Rel 60E_SP7 - QA 12759 ***/
        /***Filling columnKey  for fieldGroups onSorting ***/
        if (field['FLGRP']) {

            var group_fields = underscoreJS.where(fields, { FLGRP: field['FLGRP'] });
            columnKey = group_fields[0]['FLDNAME'];
        }
        else {
            columnKey = column.data("contextObject")['FLDNAME'];
        }
        /***/
        underscoreJS.each(sortItems, function (sortItem) {
            /***Rel 60E_SP7 - QA 12759 ***/
            //if(sortItem.getColumnKey() === column.data("contextObject")['FLDNAME'])
            if (sortItem.getColumnKey() === columnKey) {
                /****/
                oControl._sortPanel.removeSortItem(sortItem)
            }

        });
        this._sortItems.push({
            /***Rel 60E_SP7 - QA 12759 ***/
            //'COLUMNKEY':field['FLDNAME']
            'COLUMNKEY': columnKey,
            /***/
            'OPERATION': sortOrder,
            'INDEX': 1
        });


        var object = this.getSortFilterObjects(true);
        object.sort = [];
        var up,
            down;
        if (sortOrder == "Descending") {
            down = 'X';
            up = '';
        } else {
            down = '';
            up = 'X';
        }

        object.sort.push({
            'SPOS': 1,
            'FIELDNAME': column.getSortProperty(),
            'UP': up,
            'DOWN': down
        });

        //         if (this.getPagingType() == global.vui5.cons.pagingType.serverPaging) {
        //             object.targetPage = 1;
        //             object.srcPage = 1;
        //             this.clearSelection();
        //             var params = {};
        //             params[global.vui5.cons.params.pageNumber] = "1";
        ////             this.firePageChange({
        ////                 urlParams: params
        ////             });
        ////          //   this.fireOnPageChange(object);
        //             
        //         } else 
        if (this.getBackendSortFilter()) {
            oControl._sortPanel.addSortItem(new sap.m.P13nSortItem({
                /***Rel 60E_SP7 - QA 12759 ***/
                //columnKey: column.data("contextObject")['FLDNAME'],
                columnKey: columnKey,
                /***/
                operation: sortOrder
            }));

            /***Rel 60E SP6 ECIP #17318 - Start **/
            oEvent.bPreventDefault = true;
            /***Rel 60E SP6 ECIP #17318 - End **/
            /*Perform Sorting and Filtering in Backend*/
            this.clearSelection();
            oControl.handlePersonalizationOk();
            // oEvent.getSource().getParent().close();
            //  this.fireOnSortFilter(object);
        }
        this._oVariants.currentVariantSetModified(true);
    };

    /* On Field Change, re-create Serach For and Replace With Control*/
    T.prototype._onSearchFieldChange = function () {
        var oControl = this;

        oControl.searchAndReplace.itemFindIndex = -1;

        var selectedField = oControl._selectField.getSelectedKey();

        var simpleForm = oControl._oSearchAndReplaceDialog.getContent()[0];
        var contentData = simpleForm.getContent();
        if (contentData.length > 3) {
            for (var i = 3; i < contentData.length; i++) {
                simpleForm.removeContent(contentData[i]);
                contentData[i].destroy();
            }
        }
        var searchReplaceModel;
        if (selectedField == "") {
            searchReplaceModel = oControl._oSearchAndReplaceDialog.getModel(oControl._searchAndReplaceModelName);
            searchReplaceModel.setProperty("/VISIBLE", false);
        } else {
            searchReplaceModel = oControl._oSearchAndReplaceDialog.getModel(oControl._searchAndReplaceModelName);
            searchReplaceModel.setProperty("/VISIBLE", true);

            var model = oControl.getModel(oControl.getModelName());
            var fields = model.getProperty(oControl.getFieldPath());

            var field = underscoreJS.find(fields, {
                'FLDNAME': selectedField
            });
            if (field) {

                var data = {};
                data.FIELDS = [field];

                data.DATA = {};
                data.DATA[field['FLDNAME']] = "";
                if (field['SDSCR'] != global.vui5.cons.fieldValue.value) {
                    data.DATA[field['TXTFL']] = "";
                }
                model.setProperty("/__SEARCH", data);
                var data = {};
                data.FIELDS = [field];
                data.DATA = {};
                data.DATA[field['FLDNAME']] = "";
                if (field['SDSCR'] != global.vui5.cons.fieldValue.value) {
                    data.DATA[field['TXTFL']] = "";
                }
                model.setProperty("/__REPLACE", data);

                simpleForm.addContent(new sap.m.Label({
                    text: oControl._oBundle.getText("SearchFor")
                }));

                oControl._oSearchFor = oControl._createSearchReplaceControl("/__SEARCH/FIELDS/0/", "/__SEARCH/DATA/", true);
                simpleForm.addContent(oControl._oSearchFor);

                simpleForm.addContent(new sap.m.Label({
                    text: oControl._oBundle.getText("ReplaceWith")
                }));
                oControl._oReplaceWith = oControl._createSearchReplaceControl("/__REPLACE/FIELDS/0/", "/__REPLACE/DATA/", false);
                simpleForm.addContent(oControl._oReplaceWith);
            }
        }
    };

    /* Used to create Search and Replace Control Based on Field Properties*/
    T.prototype._createSearchReplaceControl = function (fieldPath, dataPath, forSearch) {
        var oControl = this;
        var oController = this.getController();

        var modelName = this.getModelName();
        var model = this.getModel(modelName);
        var field = model.getProperty(fieldPath);

        if (field['DATATYPE'] == global.vui5.cons.dataType.date || field['DATATYPE'] == global.vui5.cons.dataType.time) {
            field['ELTYP'] = global.vui5.cons.element.input;
        }

        var dataArea = model.getProperty(oControl.getDataAreaPath());
        var bindingMode = sap.ui.model.BindingMode.TwoWay;
        var selection;
        switch (field['ELTYP']) {
            case global.vui5.cons.element.input:
                if (field['DATATYPE'] == global.vui5.cons.dataType.date) {
                    selection = new sap.m.DatePicker({
                        //displayFormat: "long",
                        //*****Rel 60E_SP6
                        //valueFormat: "YYYY-MM-dd",
                        valueFormat: vui5.cons.date_format,
                        //*****
                        placeholder: " ",
                        change: [oController.dateFieldCheck, oController]
                    }).bindValue(modelName + ">" + dataPath + field['FLDNAME'], null, bindingMode);
                    selection.addStyleClass('vuiDatePicker');
                    selection.bindProperty("displayFormat", global.vui5.modelName + ">" + global.vui5.cons.modelPath.sessionInfo + "/DATFM", Formatter.displayFormat, sap.ui.model.Binding.OneWay);
                    selection.setVuiDateValue = selection.setValue;
                    selection.setValue = oControl.setDateValue.bind(selection);
                } else if (field['DATATYPE'] == global.vui5.cons.dataType.time) {
                    selection = new sap.m.TimePicker({
                        valueFormat: "HH:mm:ss",
                        displayFormat: "HH:mm:ss"
                    }).bindValue(modelName + ">" + dataPath + field['FLDNAME'], null, bindingMode);
                    selection.addStyleClass('vuiTimePicker');
                } else if (field['DATATYPE'] == global.vui5.cons.dataType.amount) {
                    selection = new sap.m.Input({
                        showValueHelp: false,
                        maxLength: parseInt(field['OUTPUTLEN'])
                    });
                    selection.setTextAlign(sap.ui.core.TextAlign.End);
                    selection.bindValue(modelName + ">" + dataPath + field['FLDNAME'], null, bindingMode);

                } else if (field['DATATYPE'] == global.vui5.cons.dataType.decimal ||
                    field['DATATYPE'].substr(0, 3) == global.vui5.cons.dataType.integer) {
                    selection = new sap.m.Input({
                        showValueHelp: false,
                        maxLength: parseInt(field['OUTPUTLEN'])
                    });
                    selection.setTextAlign(sap.ui.core.TextAlign.End);
                    selection.bindValue(modelName + ">" + dataPath + field['FLDNAME'], null, bindingMode);

                } else if (field['DATATYPE'] == global.vui5.cons.dataType.quantity) {
                    selection = new sap.m.Input({
                        showValueHelp: false,
                        maxLength: parseInt(field['OUTPUTLEN'])
                    });
                    selection.setTextAlign(sap.ui.core.TextAlign.End);
                    selection.bindValue(modelName + ">" + dataPath + field['FLDNAME'], null, bindingMode);
                } else {
                    selection = new sap.m.Input({
                        showValueHelp: false
                    });
                    oControl.setFieldType(selection, field);
                    oControl._searchReplaceFieldCheck(selection, field);

                    if (field['SDSCR'] == global.vui5.cons.fieldValue.description
                        || field['SDSCR'] == global.vui5.cons.fieldValue.value_cont_descr) {
                        selection.bindValue(modelName + ">" + dataPath + field['TXTFL'], null, bindingMode);
                        selection.data("model", modelName);
                        selection.data("path", fieldPath);
                        selection.attachChange(oController.getDescription.bind(oController));
                        selection.setMaxLength(60);
                    } else {
                        selection.bindValue(modelName + ">" + dataPath + field['FLDNAME'], null, bindingMode);
                    }
                }
                if (forSearch)
                    selection.attachChange(oControl._onSearchValueChange.bind(oControl));
                break;
            case global.vui5.cons.element.valueHelp:
                selection = new sap.m.Input({
                    showValueHelp: true,
                    fieldWidth: "100%"
                });
                oControl.setFieldType(selection, field);
                oControl._searchReplaceFieldCheck(selection, field);
                if (field['SDSCR'] == global.vui5.cons.fieldValue.description
                    || field['SDSCR'] == global.vui5.cons.fieldValue.value_cont_descr) {
                    selection.bindValue(modelName + ">" + dataPath + field['TXTFL'], null, bindingMode);
                    selection.data("model", modelName);
                    selection.data("path", fieldPath);
                    selection.attachChange(oController.getDescription.bind(oController));
                    selection.setMaxLength(60);
                } else {
                    selection.bindValue(modelName + ">" + dataPath + field['FLDNAME'], null, bindingMode);
                }

                selection.attachValueHelpRequest(oControl.onValueHelpRequest.bind(oControl));

                /* var func = oControl.getOnF4HelpRequest();
                 if (func && typeof func == "function")
                     selection.attachValueHelpRequest(func.bind(oController));*/

                selection.data("model", oControl.getModelName());
                selection.data("path", fieldPath);
                selection.data("dataArea", dataArea);
                oControl.bindTypeAheadField(selection, fieldPath, field);
                if (forSearch)
                    selection.attachChange(oControl._onSearchValueChange.bind(oControl));
                break;

            case global.vui5.cons.element.dropDown:
                //selection = new sap.m.ComboBox({
                selection = new global.vui5.ui.controls.ComboBox({});
                selection.bindAggregation("items", global.vui5.modelName + '>' + "/DROPDOWNS/" + dataArea + "/" + field['FLDNAME'], function (sid, oContext) {
                    var contextObject = oContext.getObject();
                    return new sap.ui.core.Item({
                        key: contextObject['NAME'],
                        text: contextObject['VALUE']
                    });
                });
                selection.bindProperty("selectedKey", modelName + ">" + dataPath + field['FLDNAME'], null, bindingMode);
                if (forSearch)
                    selection.attachSelectionChange(oControl._onSearchValueChange.bind(oControl));
                break;

            case global.vui5.cons.element.checkBox:
                selection = new sap.m.CheckBox({
                    select: [oController._onCheckBoxSelect, oController],
                    selected: "{= ${" + modelName + ">" + dataPath + field['FLDNAME'] + "} === 'X' }"
                });
                if (forSearch)
                    selection.attachSelect(oControl._onSearchValueChange.bind(oControl));
                selection.data("model", modelName);
                break;
                //*****Rel 60E_SP6 - Task #39097
            case global.vui5.cons.element.toggle:
                selection = new sap.m.Switch({
                    state: "{= ${" + modelName + ">" + dataPath + field['FLDNAME'] + "} === 'X' }",
                    change: [oController._onToggleButtonChange, oController]
                });
                if (forSearch)
                    selection.attachChange(oControl._onSearchValueChange.bind(oControl));
                selection.data("model", modelName);
                selection.data("dataPath", dataPath);
                break;
                //*****
            default:
                selection = new sap.m.Input({
                    showValueHelp: false,
                    maxLength: parseInt(field['OUTPUTLEN'])
                });

                oControl.setFieldType(selection, field);
                oControl._searchReplaceFieldCheck(selection, field);

                if (field['SDSCR'] == global.vui5.cons.fieldValue.description
                    || field['SDSCR'] == global.vui5.cons.fieldValue.value_cont_descr) {
                    selection.bindValue(modelName + ">" + dataPath + field['TXTFL'], null, bindingMode);
                    selection.data("model", modelName);
                    selection.data("path", fieldPath);
                    selection.attachChange(oController.getDescription.bind(oController));
                    selection.setMaxLength(60);
                } else {
                    selection.bindValue(modelName + ">" + dataPath + field['FLDNAME'], null, bindingMode);
                }
                break;
        }
        return selection;
    };

    T.prototype._onColumnFreeze = function () {
        var oControl = this;
        oControl._oManualColumnFreeze = true;
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
            field, rowIndex, arr, changeRowIndex;
        source = oEvent.getSource();

        var pathFieldName;

        if (fieldInfo['ELTYP'] === global.vui5.cons.element.checkBox || fieldInfo['ELTYP'] === global.vui5.cons.element.toggle) {
            pathFieldName = fieldInfo['FLDNAME'];
        }
        else if (fieldInfo['ELTYP'] === global.vui5.cons.element.dropDown) {
            pathFieldName = source.getBinding("selectedKey").getPath();
        }
        else if (source.getBinding("value")) {
            pathFieldName = source.getBinding("value").getPath();
        }

        if (pathFieldName) {
            source.data("dataPath", source.getBindingContext(oControl.getModelName()).getPath() + "/" + pathFieldName);

            arr = source.getBindingContext(oControl.getModelName()).getPath().split("/");
            rowIndex = parseInt(arr[arr.length - 1]);
            if (underscoreJS.isEmpty(oControl._oChangedRowFields)) {
                oControl._oChangedRowFields.push({
                    "FLDNAME": pathFieldName,
                    "INDEX": rowIndex,
                    "CONTROL": source
                });
            }
            else if (!underscoreJS.isObject(underscoreJS.findWhere(oControl._oChangedRowFields, { 'FLDNAME': pathFieldName, "INDEX": rowIndex }))) {
                oControl._oChangedRowFields.push({
                    "FLDNAME": pathFieldName,
                    "INDEX": rowIndex,
                    "CONTROL": source
                });
            }
            else {
                changeRowIndex = underscoreJS.findIndex(oControl._oChangedRowFields, { 'FLDNAME': pathFieldName, "INDEX": rowIndex });
                oControl.resetCellValueChangeColor(changeRowIndex);
            }
        }

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

    T.prototype.fullScreenDialog = function (oEvent) {
        var source = oEvent.getSource();
        this.fireOnFullScreen({
            "fullScreen": oEvent.getSource().getIcon() === 'sap-icon://full-screen'
        });

    };


    T.prototype.processSetValues = function (oEvent) {
        var oControl = this;
        oControl.fireOnSetValues({
            callBack: function () {
                oControl.setValuesDialog();
            }
        });
    };

    T.prototype.addGroupPanelItem = function (dialog) {
        var oControl = this;
        /*** Rel 60E SP6 - Filter values sorting based on Label - Start ***/
        //var columns = this.getModel(this.getModelName()).getProperty(this.getFieldPath());
        var columns = $.extend(true, [], this.getModel(this.getModelName()).getProperty(this.getFieldPath()));
        columns = underscoreJS.sortBy(columns, 'LABEL');
        /*** Rel 60E SP6 - Filter values sorting based on Label - End ***/
        if (!this._groupPanel) {
            this._groupPanel = new sap.m.P13nGroupPanel({
                maxGroups: '1',
                title: oControl._oBundle.getText("Group"),
                visible: true,
                type: "group",
                containerQuery: true,
                layoutMode: "Desktop",
                addGroupItem: this.addGroupItem.bind(this),
                removeGroupItem: this.removeGroupItem.bind(this),
                updateGroupItem: this.updateGroupItem.bind(this)
            });

            this._groupPanel.setMaxGroups(1);
            dialog.addPanel(this._groupPanel);
        }

        this._groupPanel.removeAllItems();
        /*this._groupPanel.addItem(new sap.m.P13nItem({
            columnKey: "",
            text: oControl._oBundle.getText("none")
        }));*/
        underscoreJS.each(columns, function (object) {
            oControl._groupPanel.addItem(new sap.m.P13nItem({
                columnKey: object['FLDNAME'],
                text: object['LABEL']
            }));
        });


        this.addAggregatePanelItem(dialog);
    };

    T.prototype.addGroupItem = function (oEvent) {
        this._groupPanel.addGroupItem(oEvent.getParameter("groupItemData"));
        this._oVariants.currentVariantSetModified(true);
        //*****Rel 60E_SP7
        this._updateShowResetEnabled(true);
        //*****
    };

    T.prototype.removeGroupItem = function (oEvent) {
        var index = oEvent.getParameter("index");
        var item = this._groupPanel.getGroupItems()[index];
        this._groupPanel.removeGroupItem(item);
        this._oVariants.currentVariantSetModified(true);
        //*****Rel 60E_SP7
        this._updateShowResetEnabled(true);
        //*****
    };

    T.prototype.updateGroupItem = function () {
        this._oVariants.currentVariantSetModified(true);
        //*****Rel 60E_SP7
        this._updateShowResetEnabled(true);
        //*****
    };


    T.prototype.onColumnGroup = function (oEvent) {
        var oControl = this;

        if (!oControl._PersonalizationDialog) {
            oControl.createPersonalizationDialog();
            oControl.addGroupPanelItem(this._PersonalizationDialog);
            oControl.fillPersonalizationItems();
        }


        if (!oControl.groupBySet) {
            oControl._groupPanel.removeAllGroupItems();
            oControl._groupPanel.addGroupItem(new sap.m.P13nGroupItem({
                columnKey: oEvent.getParameter("column").data("contextObject")["FLDNAME"]
            }));

            oControl.groupingColumn = oEvent.getParameter("column").getId();
            oControl.handlePersonalizationOk();
        }
        else {
            oControl.groupBySet = false;
        }

    };

    T.prototype.prepareCellTemplate = function (oContext) {
        if (this.getEditable()) {
            return this.prepareEditableTemplate(oContext);
        }
        else {
            return this.prepareNonEditableTemplate(oContext);
        }
    };

    T.prototype.prepareNonEditableTemplate = function (oContext) {
        var oControl = this, contextObject, path, modelName, dataArea, fields, bindingMode, sectionPath, lv_editable, eltyp, template;
        contextObject = oContext.getObject();
        path = oContext.getPath();
        modelName = oControl.getModelName();
        dataArea = oControl.getModel(modelName).getProperty(oControl.getDataAreaPath());
        fields = oControl.getModel(modelName).getProperty(oControl.getFieldPath());
        bindingMode = sap.ui.model.BindingMode.OneWay;
        sectionPath = oControl.getFieldPath().substring(0, oControl.getFieldPath().lastIndexOf("/") - 6);

        if (contextObject['SETCONTROL'] != undefined && contextObject['SETCONTROL'] != "") {
            template = contextObject['SETCONTROL'](contextObject['FLDNAME']);
            return template;
        }

        template = oControl.setDisplayFieldColor(contextObject, modelName, dataArea, fields, oContext);

        if (template) {
            /*if (contextObject['FLSTL'] == global.vui5.cons.styleType.icon) {
                
                    template.setTextAlign(sap.ui.core.TextAlign.Center);
           }
           else*/ if (contextObject['INTTYPE'] == vui5.cons.intType.number ||
              contextObject['INTTYPE'] == vui5.cons.intType.date ||
              contextObject['INTTYPE'] == vui5.cons.intType.time ||
              contextObject['INTTYPE'] == vui5.cons.intType.integer ||
              contextObject['INTTYPE'] == vui5.cons.intType.oneByteInteger ||
              contextObject['INTTYPE'] == vui5.cons.intType.twoByteInteger ||
              contextObject['INTTYPE'] == vui5.cons.intType.packed ||
              contextObject['INTTYPE'] == vui5.cons.intType.float ||
              contextObject['INTTYPE'] == vui5.cons.intType.decimal16 ||
              contextObject['INTTYPE'] == vui5.cons.intType.decimal32) {
               if (template.setTextAlign)
                   template.setTextAlign(sap.ui.core.TextAlign.Right);
           }
           else {
               if (template.setTextAlign)
                   template.setTextAlign(sap.ui.core.TextAlign.Left);
           }
        }



        return template;

    };

    T.prototype.prepareEditableTemplate = function (oContext) {
        var oControl = this, contextObject, path, modelName, dataArea, fields, bindingMode, sectionPath, lv_editable, eltyp, template;
        contextObject = oContext.getObject();
        path = oContext.getPath();
        modelName = oControl.getModelName();
        dataArea = oControl.getModel(modelName).getProperty(oControl.getDataAreaPath());
        fields = oControl.getModel(modelName).getProperty(oControl.getFieldPath());
        bindingMode = sap.ui.model.BindingMode.TwoWay;
        sectionPath = oControl.getFieldPath().substring(0, oControl.getFieldPath().lastIndexOf("/") - 6);
        var editable = oControl.getEditable();

        lv_editable =
            "{= (${" + global.vui5.modelName + ">/DOCUMENT_MODE} !== 'A' || ${" + oControl.getModelName() + ">" + sectionPath + "EDIT} === 'X' ) &&"
            + "((  ${" + modelName + ">EDITABLECELLS} === '' || ${" + modelName + ">" + "EDITABLECELLS}.indexOf('<" + contextObject['FLDNAME'] + ">') === -1 || ${" + modelName + ">" + "EDITABLECELLS}.indexOf('<"
            + contextObject['FLDNAME'] + ">') !== -1 ) && "
            + "${" + modelName + ">" + path + "/DISABLED} === '') &&"
            + "${" + modelName + ">" + "READONLYCOLUMNS}.indexOf('<" + contextObject['FLDNAME'] + ">') === -1}";


        var eltyp;
        if (contextObject['SETCONTROL'] != undefined && contextObject['SETCONTROL'] != "") {
            func = contextObject['SETCONTROL'];
            template = func(contextObject['FLDNAME']);
        } else if (contextObject['FLSTL'] == global.vui5.cons.styleType.icon) {
            template = oControl.__createIconControl(contextObject, modelName);
        } else {

            if (contextObject['DATATYPE'] == global.vui5.cons.dataType.date || contextObject['DATATYPE'] == global.vui5.cons.dataType.time
                || contextObject['DATATYPE'] == global.vui5.cons.dataType.amount || contextObject['DATATYPE'] == global.vui5.cons.dataType.quantity
                || contextObject['DATATYPE'] == global.vui5.cons.dataType.decimal || contextObject['DATATYPE'].substr(0, 3) == global.vui5.cons.dataType.integer) {
                eltyp = global.vui5.cons.element.input;
            } else {
                eltyp = contextObject['ELTYP'];
            }

            switch (eltyp) {
                case global.vui5.cons.element.input:
                    // Dates
                    if (contextObject['DATATYPE'] == global.vui5.cons.dataType.date) {
                        template = new sap.m.DatePicker({
                            //displayFormat: "long",
                            placeholder: " ",
                            //*****Rel 60E_SP6
                            //valueFormat: "YYYY-MM-dd",
                            valueFormat: vui5.cons.date_format,
                            //*****
                            change: function (oEvent) {
                                oEvent.getSource().$().removeClass("vuiInputBase vuiChangedRowField");
                                oEvent.getSource().$("inner").removeClass("vuiInputBase vuiChangedRowField");
                                oController.dateFieldCheck(oEvent);
                            },//[oController.dateFieldCheck, oController],
                            editable: lv_editable
                        });
                        template.addStyleClass('vuiDatePicker');
                        template.bindProperty("displayFormat", global.vui5.modelName + ">" + global.vui5.cons.modelPath.sessionInfo + "/DATFM", Formatter.displayFormat, sap.ui.model.Binding.OneWay);
                        template.setVuiDateValue = template.setValue;
                        template.setValue = oControl.setDateValue.bind(template);
                        oControl.setFieldColor(
                            contextObject,
                            template,
                            "value",
                            modelName + ">" + contextObject['FLDNAME'],
                            bindingMode,
                            fields);

                        //                                  template.bindValue(modelName + ">" + contextObject['FLDNAME'] , null , bindingMode);
                        template.attachChange(oControl.onChangeUpdateIndicator.bind(oControl));

                        //                                  oControl.triggerChangeEvent(template,contextObject);
                    } else if (contextObject['DATATYPE'] == global.vui5.cons.dataType.time) {
                        template = new sap.m.TimePicker({
                            valueFormat: "HH:mm:ss",
                            displayFormat: "HH:mm:ss",
                            editable: lv_editable
                        });
                        template.addStyleClass('vuiTimePicker');
                        oControl.setFieldColor(
                            contextObject,
                            template,
                            "value",
                            modelName + ">" + contextObject['FLDNAME'],
                            bindingMode,
                            fields);

                        //                                  template.bindValue(modelName + ">" + contextObject['FLDNAME'] , null , bindingMode);
                        template.attachChange(oControl.onChangeUpdateIndicator.bind(oControl));
                        //                                  oControl.triggerChangeEvent(template,contextObject);
                        // Amount
                    } else if (contextObject['DATATYPE'] == global.vui5.cons.dataType.amount) {

                        template = new sap.m.Input({
                            showValueHelp: false,
                            maxLength: parseInt(contextObject['OUTPUTLEN']),
                            editable: lv_editable
                        });
                        if (contextObject['TXTFL'] != '') {

                            oControl.setFieldColor(
                                contextObject,
                                template,
                                "value",
                                modelName + ">" + contextObject['TXTFL'],
                                bindingMode,
                                fields);

                            //                                      template.bindValue(modelName + ">" + contextObject['TXTFL'] , null , bindingMode);
                        }
                        template.setTextAlign(sap.ui.core.TextAlign.End);
                        template.data("FLDNAME", contextObject['FLDNAME']);
                        template.attachChange(oControl.onChangeUpdateIndicator.bind(oControl));

                    } else if (contextObject['DATATYPE'] == global.vui5.cons.dataType.quantity) {

                        template = new sap.m.Input({
                            showValueHelp: false,
                            maxLength: parseInt(contextObject['OUTPUTLEN']),
                            editable: lv_editable
                        });
                        if (contextObject['TXTFL'] != '') {
                            oControl.setFieldColor(
                                contextObject,
                                template,
                                "value",
                                modelName + ">" + contextObject['TXTFL'],
                                bindingMode,
                                fields);
                            //                                      template.bindValue(modelName + ">" + contextObject['TXTFL'] , null , bindingMode);
                        }
                        template.setTextAlign(sap.ui.core.TextAlign.End);
                        template.data("FLDNAME", contextObject['FLDNAME']);
                        template.attachChange(oControl.onChangeUpdateIndicator.bind(oControl));
                        /*Decimal Conversion*/
                    } else if (contextObject['DATATYPE'] == global.vui5.cons.dataType.decimal ||
                        contextObject['DATATYPE'].substr(0, 3) == global.vui5.cons.dataType.integer) {

                        template = new sap.m.Input({
                            showValueHelp: false,
                            maxLength: parseInt(contextObject['OUTPUTLEN']),
                            editable: lv_editable
                        });
                        if (contextObject['TXTFL'] != '') {
                            oControl.setFieldColor(
                                contextObject,
                                template,
                                "value",
                                modelName + ">" + contextObject['TXTFL'],
                                bindingMode,
                                fields);

                            //                                      template.bindValue(modelName + ">" + contextObject['TXTFL'] , null , bindingMode);
                        }
                        template.setTextAlign(sap.ui.core.TextAlign.End);
                        template.data("FLDNAME", contextObject['FLDNAME']);
                        template.attachChange(oControl.onChangeUpdateIndicator.bind(oControl));
                        /*Decimal Conversion*/
                    } else {
                        template = new sap.m.Input({
                            showValueHelp: false,
                            maxLength: parseInt(contextObject['OUTPUTLEN']),
                            editable: lv_editable
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
                            editable,
                            fields);
                        template.attachChange(oControl.onChangeUpdateIndicator.bind(oControl));
                    }
                    break;
                case global.vui5.cons.element.valueHelp:
                    /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - Start ***/
                    if (contextObject['MULTISELECT']) {
                        multiValue = new global.vui5.ui.controls.MultiValue({
                            modelName: oControl.getModelName(),
                            elementType: contextObject['ELTYP'],
                            /***Rel 60E SP7 QA #12093 **/
                            //fieldPath: oContext.getPath(),
                            fieldPath: oContext.getPath() + "/",
                            /***/
                            dataPath: contextObject['FLDNAME'],
                            commaSeparator: contextObject['MVFLD'] === "",
                            editable: lv_editable,
                            enabled: lv_editable,
                            onInputChange: function (oEvent) {
                                oControl.processOnInputChange(oEvent.getParameter("oEvent"));
                            }
                        });

                        multiValue.setModel(oControl.getModel(oControl.getModelName()), oControl.getModelName());
                        multiValue.setModel(oControl.getModel(global.vui5.modelName), global.vui5.modelName);
                        template = multiValue.prepareField();
                        template.data("fromNonResponsive", true);

                    }
                    else {
                        /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - End ***/
                        template = new sap.m.Input({
                            showValueHelp: true,
                            fieldWidth: "100%",
                            maxLength: parseInt(contextObject['OUTPUTLEN']),
                            editable: lv_editable
                        });
                        /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - Start ***/
                    }
                    /*** Rel 60E SP6 - Support of Multi Input field in Table/Form - End***/
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
                        editable,
                        fields);
                    template.data("model", modelName);
                    template.data("path", path);
                    template.data("dataArea", dataArea);

                    template.attachValueHelpRequest(oControl.onValueHelpRequest.bind(oControl));
                    /* func = oControl.getOnF4HelpRequest();
                     if (func && typeof func == "function")
                         template.attachValueHelpRequest(func.bind(oControl.getController()));*/

                    oControl.bindTypeAheadField(
                        template,
                        path,
                        contextObject);
                    template.attachChange(oControl.onChangeUpdateIndicator.bind(oControl));
                    //                              oControl.triggerChangeEvent(template,contextObject);
                    break;
                case global.vui5.cons.element.dropDown:
                    if (contextObject['MULTISELECT']) {
                        multiValue = new global.vui5.ui.controls.MultiValue({
                            modelName: oControl.getModelName(),
                            elementType: contextObject['ELTYP'],
                            /***Rel 60E SP7 QA #12093**/
                            //fieldPath: oContext.getPath()
                            fieldPath: oContext.getPath() + "/",
                            /***/
                            dataPath: contextObject['FLDNAME'],
                            commaSeparator: contextObject['MVFLD'] === "",
                            dataAreaID: oControl.getModel(oControl.getModelName()).getProperty(oControl.getDataAreaPath()),
                            editable: lv_editable,
                            enabled: lv_editable
                        });

                        multiValue.setModel(oControl.getModel(oControl.getModelName()), oControl.getModelName());
                        multiValue.setModel(oControl.getModel(global.vui5.modelName), global.vui5.modelName);
                        template = multiValue.prepareField();
                        template.data("fromNonResponsive", true);
                    }
                    else {


                        template = new global.vui5.ui.controls.ComboBox({
                            editable: lv_editable
                        });
                        template.bindAggregation("items", global.vui5.modelName + '>' + "/DROPDOWNS/" + dataArea + "/" + contextObject['FLDNAME'], function (sid, oContext) {
                            var contextObject = oContext.getObject();
                            return new sap.ui.core.Item({
                                key: contextObject['NAME'],
                                text: contextObject['VALUE']
                            });
                        });
                        oControl.setFieldColor(
                            contextObject,
                            template,
                            "selectedKey",
                            modelName + ">" + contextObject['FLDNAME'],
                            bindingMode,
                            fields);
                        //                              template.bindProperty("selectedKey",modelName + ">" + contextObject['FLDNAME'],null,bindingMode);
                    }
                    template.attachChange(oControl.onChangeUpdateIndicator.bind(oControl));
                    //                              oControl.triggerChangeEvent(template,contextObject);
                    break;
                case global.vui5.cons.element.checkBox:
                    template = new sap.m.CheckBox({
                        select: [oController._onCheckBoxSelect, oController],
                        editable: lv_editable,
                        selected: "{= ${" + modelName + ">" + contextObject['FLDNAME'] + "} === 'X' }"
                    });
                    template.data("model", modelName);
                    template.attachSelect(oControl.onChangeUpdateIndicator.bind(oControl));
                    //                              oControl.triggerChangeEvent(template,contextObject);
                    break;
                    //*****Rel 60E_SP6 - Task #39097
                case vui5.cons.element.toggle:
                    template = new sap.m.Switch({
                        enabled: lv_editable,
                        state: "{= ${" + modelName + ">" + contextObject['FLDNAME'] + "} === 'X' }",
                        change: [oController._onToggleButtonChange, oController]
                    });
                    template.data("model", modelName);
                    template.data("fieldname", path + "/FLDNAME");
                    template.attachChange(oControl.onChangeUpdateIndicator.bind(oControl));
                    break;
                    //*****
                case vui5.cons.element.label:
                    template = new sap.m.Label({});
                    template.bindProperty("text", modelName + ">" + contextObject['FLDNAME'], null, bindingMode);
                    template.data("model", modelName);
                    break;
                case global.vui5.cons.element.progressIndicator:

                    var txtPath;
                    if (contextObject['TXTFL'])
                        txtPath = modelName + ">" + contextObject['TXTFL'];
                    else
                        txtPath = modelName + ">" + contextObject['FLDNAME'];

                    template = new sap.m.ProgressIndicator({
                        //*****Rel 60E_SP6
                        state: sap.ui.core.ValueState.Success
                        //*****
                    }).bindProperty("displayValue", {
                        parts: [{ path: txtPath }
                        ],
                        formatter: function (val) {
                            return parseFloat(val) + "%";
                        },
                        mode: sap.ui.model.BindingMode.OneWay
                    }).bindProperty("percentValue", {
                        parts: [{ path: txtPath }
                        ],
                        formatter: function (val) {
                            return parseFloat(val);
                        },
                        mode: sap.ui.model.BindingMode.OneWay
                    })
                    //              		        	   template = new sap.m.ProgressIndicator({
                    //              		        		  displayValue:"{" + modelName + ">" + contextObject['FLDNAME'] + "}%",
                    //              		        	   }).bindProperty("percentValue", modelName + ">" + contextObject['FLDNAME'], null, sap.ui.model.BindingMode.OneWay);
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

                        //*****Rel 60E_SP6 - Button Style Changes
                        if (contextObject['ELTYP'] === global.vui5.cons.element.button) {
                            if (!underscoreJS.isEmpty(contextObject['BTSTL']) && contextObject['BTSTL'] === global.vui5.cons.buttonStyle.message) {
                                params['icon'] = "sap-icon://message-popup";
                            }
                        }
                        //*****

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

                        //*****Rel 60E_SP6 - Button Style Changes
                        if (contextObject['ELTYP'] === global.vui5.cons.element.button) {
                            if (!underscoreJS.isEmpty(contextObject['BTSTL']) && contextObject['BTSTL'] === global.vui5.cons.buttonStyle.message) {
                                params['icon'] = "sap-icon://message-popup";
                            }
                        }
                        //*****

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

                    //*****Rel 60E_SP6 - Button Style Changes
                    if (contextObject['ELTYP'] === global.vui5.cons.element.button) {
                        if (!underscoreJS.isEmpty(contextObject['STYLES'])) {
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
                        else if (!underscoreJS.isEmpty(contextObject['BTSTL'])) {
                            if (contextObject['BTSTL'] === global.vui5.cons.buttonStyle.accept) {
                                oType = sap.m.ButtonType.Accept;
                            }
                            else if (contextObject['BTSTL'] === global.vui5.cons.buttonStyle.reject) {
                                oType = sap.m.ButtonType.Reject;
                            }
                            else if (contextObject['BTSTL'] === global.vui5.cons.buttonStyle.transparent) {
                                oType = sap.m.ButtonType.Transparent;
                            }
                            else if (contextObject['BTSTL'] === global.vui5.cons.buttonStyle.message) {
                                oType = sap.m.ButtonType.Emphasized;
                                template.bindProperty("visible", modelName + ">" + path, function (val) {
                                    if (val != undefined) {
                                        if (parseInt(val) === 0) {
                                            return false;
                                        }
                                        else {
                                            return true;
                                        }
                                    }
                                }, sap.ui.model.BindingMode.OneWay);
                            }
                            template.setProperty("type", oType);
                        }
                    }
                    //*****

                    //Hotspot Click Changes - End
                    //                                    }


                    //                              default:
                    //                              template = new Text({
                    //                              text : "{" + modelName + ">" + contextObject['FLDNAME'] + "}"
                    //                              });
                    //                              template.attachChange(oControl.onChangeUpdateIndicator.bind(oControl));
                    //                              oControl.triggerChangeEvent(template,contextObject);
                    //                              break;
            }
            var refFields;
            if (template) {
                template.data("fieldInfo", contextObject);
                if (contextObject['REQUIRED']) {
                    template.addStyleClass('vuiRequired');
                }
                if (contextObject['DATATYPE'] == global.vui5.cons.dataType.currencyKey) {
                    refFields = underscoreJS.where(fields, {
                        'CFIELDNAME': contextObject['FLDNAME']
                    });
                } else if (contextObject['DATATYPE'] == global.vui5.cons.dataType.unit) {
                    refFields = underscoreJS.where(fields, {
                        'QFIELDNAME': contextObject['FLDNAME']
                    });
                }
                oControl._onInputChange(template, contextObject, path, refFields);
            }
        }
        return template;
    };

    T.prototype.isGroupingPresent = function () {
        var model = this.getModel(this.getModelName());
        var fields = model.getProperty(this.getFieldPath());

        if (underscoreJS.isEmpty(model.getProperty(this.getFieldGroupPath()))) {
            return false;
        }
        return underscoreJS.where(fields, { FLGRP: '' }).length !== fields.length;
    };

    T.prototype.addAggregatePanelItem = function (dialog) {
        var oControl = this;

        if (!oControl._aggrPanel) {
            oControl._aggrPanel = new global.vui5.ui.controls.AggregationPanel({
                title: this._oBundle.getText("Aggregation"),
                visible: true,
                modelName: oControl.getModelName(),
                fieldPath: oControl.getFieldPath(),
                dataAreaPath: oControl.getDataAreaPath(),
                layoutDataPath: oControl.getLayoutDataPath(),
                controller: oControl.getController(),
                onSelectionChange: function (oEvent) {
                    dialog.setShowResetEnabled(true);
                    oControl._oVariants.currentVariantSetModified(true);
                }
            });

            oControl._aggrPanel.setModel(oControl.getModel(oControl.getModelName()), oControl.getModelName());
            oControl._aggrPanel.setModel(oControl.getModel(vui5.modelName), vui5.modelName);
            oControl._aggrPanel.getPanelContent();

            if (oControl._aggrPanel.addPanelToDialog()) {
                dialog.addPanel(oControl._aggrPanel);
            }

        };

        oControl._aggrPanel.getPanelContent();


    };


    T.prototype.setCellValueChangeColor = function () {
        var oControl = this;
        var model = oControl.getModel(oControl.getModelName());
        var dataPath = oControl.getDataPath();
        var columns = oControl._getVisibleColumns();
        var rows = oControl.getAggregation("rows");
        var rowCount = oControl.getVisibleRowCount();
        var rowStart = oControl.getFirstVisibleRow();

        if (oControl.getDataPath() && columns.length > 0 && rows && rows.length > 0) {
            for (var i = 0; i < rowCount; i++) {

                var path = parseInt(rowStart + i);


                var changedRowCells = underscoreJS.where(oControl._oChangedRowFields, { "INDEX": path });

                underscoreJS.each(changedRowCells, function (cell) {
                    if (cell['CONTROL'].getValueState() !== sap.ui.core.ValueState.Error) {

                        jQuery.sap.delayedCall(1, cell, function () {
                            cell['CONTROL'].$().addClass("vuiInputBase vuiChangedRowField");
                            cell['CONTROL'].$("inner").addClass("vuiInputBase vuiChangedRowField");
                        });
                        /*
                        if (cell['CONTROL'] instanceof sap.m.DatePicker ||
                            cell['CONTROL'] instanceof sap.m.TimePicker) {
    
                            jQuery.sap.delayedCall(1, cell, function () {
                                cell['CONTROL'].$().addClass("vuiInputBase vuiChangedRowField");
                                cell['CONTROL'].$("inner").addClass("vuiInputBase vuiChangedRowField");
                            });
                        }
                        else {
                            cell['CONTROL'].$().addClass("vuiInputBase vuiChangedRowField");
                            cell['CONTROL'].$("inner").addClass("vuiInputBase vuiChangedRowField");
                        }*/
                    }
                });

            }
        }
    };

    T.prototype.resetCellValueChangeColor = function (index) {
        var oControl = this;
        var rowCount = oControl.getVisibleRowCount();
        var rowStart = oControl.getFirstVisibleRow();

        if (index === 0 || index) {
            if (oControl._oChangedRowFields[index]['CONTROL'].$().hasClass("vuiInputBase vuiChangedRowField")) {
                oControl._oChangedRowFields[index]['CONTROL'].$().removeClass("vuiInputBase vuiChangedRowField");
                oControl._oChangedRowFields[index]['CONTROL'].$("inner").removeClass("vuiInputBase vuiChangedRowField");
            }

        }
        else {

            underscoreJS.each(oControl._oChangedRowFields, function (changedRowField) {
                changedRowField['CONTROL'].$().removeClass("vuiInputBase vuiChangedRowField");
                changedRowField['CONTROL'].$("inner").removeClass("vuiInputBase vuiChangedRowField");
            });
        }

        /*if (index === 0 || index) {
            oControl._oChangedRowFields[index]['CONTROL'].setShowValueStateMessage(true);
            if (oControl._oChangedRowFields[index]['CONTROL'].getValueState() !== sap.ui.core.ValueState.Error) {
                oControl._oChangedRowFields[index]['CONTROL'].setValueState(sap.ui.core.ValueState.None);
            }
        }
        else {
            underscoreJS.each(oControl._oChangedRowFields, function (changedRowField) {
                changedRowField['CONTROL'].setShowValueStateMessage(true);
                if (changedRowField['CONTROL'].getValueState() !== sap.ui.core.ValueState.Error) {
                    changedRowField['CONTROL'].setValueState(sap.ui.core.ValueState.None);
                }
    
            });
        }*/

    };

    T.prototype.resetControl = function () {
        this.resetCellValueChangeColor();
        this._oChangedRowFields = [];

    };

    T.prototype.postProcessMassEditFields = function (changedFieldsContext) {
        var oControl = this;
        var items = oControl.getRows(),
            itemBindingContextPath,
            changedFieldContext,
            cells;
        oControl.setBusy(true);
        var model = oControl.getModel(oControl.getModelName());
        underscoreJS.each(changedFieldsContext, function (context) {
            model.setProperty(context["PATH"] + "/__UPDKZ", 'X');
        });

        if (!this.isGroupingPresent()) {
            underscoreJS.each(items, function (item) {
                itemBindingContextPath = item.getBindingContext(oControl.getModelName()).getPath();
                changedFieldContext = underscoreJS.findWhere(changedFieldsContext, { 'PATH': itemBindingContextPath });

                if (!underscoreJS.isEmpty(changedFieldContext)) {
                    cells = item.getCells();

                    underscoreJS.each(cells, function (cell) {
                        if (changedFieldContext['FIELDS'].indexOf(cell.data("fieldInfo")["FLDNAME"]) !== -1) {
                            oControl._oChangedRowFields.push({
                                "FLDNAME": cell.getBinding("value") ? cell.getBinding("value").getPath() : "",
                                "INDEX": parseInt(changedFieldContext["PATH"].split('/')[changedFieldContext["PATH"].split('/').length - 1]),
                                "CONTROL": cell
                            });
                            oControl.setCellValueChangeColor(cell);
                        }
                    });
                }
            });
        }

        oControl.setBusy(false);
        oControl.clearSelection();

    };

    T.prototype.getVariantModified = function () {
        return this._oVariants.currentVariantGetModified();
    };

    T.prototype.setVariantModified = function (value) {
        this._oVariants.currentVariantSetModified(value);
    };

    T.prototype.applyOnDemandPersonalization = function () {
        var oControl = this;
        if (!oControl._PersonalizationDialog) {
            oControl.createPersonalizationDialog();
            oControl.addGroupPanelItem(oControl._PersonalizationDialog);
        }
        var layoutData = oControl.getModel(oControl.getModelName()).getProperty(oControl.getLayoutDataPath());

        if (underscoreJS.isEmpty(layoutData['COLITEMS'])) {
            oControl.handleReset();
            oControl.fillPersonalizationItems();
            oControl._applyPersonalization(oControl._columnItems);
            return;
        }
        oControl._columnItems = layoutData['COLITEMS'];
        oControl._sortItems = layoutData['SORTITEMS'];
        oControl._filterItems = layoutData['FILTERITEMS'];
        oControl._groupItems = layoutData['GRPITEMS'];
        oControl._aggrPanel.getPanelContent();
        oControl.updatePersonalizationItems(true);

        if (!underscoreJS.isEmpty(layoutData['AGRGTITEMS'])) {
            $('.sapUiTableFtr').show();
        }
        else {
            $('.sapUiTableFtr').hide();
        }

    };

    T.prototype.clearGrouping = function () {
        this.applyGroup = false;
    };

    return T;
});