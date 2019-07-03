sap.ui.define([
    "sap/ui/core/Control"
], function(Control) {
    "use strict";
    var oControl = Control.extend(vistexConfig.rootFolder + ".ui.availsWidgets.HierarchyTree.TreeTable", {
        metadata: {
            properties: {},
            aggregations: {
                columns:{type:vistexConfig.rootFolder + ".ui.availsWidgets.HierarchyTree.TreeTableColumn", multiple:true},
                rows:{type:vistexConfig.rootFolder + ".ui.availsWidgets.HierarchyTree.TreeTableRow", multiple: true}
            },
            events: {
                expand:{
                    parameters:{
                        values:{type:"object"}
                    }
                },
                details:{
                    parameters:{
                        values:{type:"object"}
                    }
                },
                harveyBallClicked:{
                    parameters:{
                        values:{type:"object"}
                    }
                }
            }
        },

        init: function () {},

        isTreeBinding: function(sName) {
            if ( sName === "rows") {
                return true;
            }
            return false;
        },

        onAfterRendering: function () {
            $(".vuiTrTbCntRowCell .vuiTrTbCntRowCellCollapsed").click(this.onRowExpandClick.bind(this));
            $(".vuiTrTbCntRowCell .vuiTrTbCntRowCellExpanded").click(this.onRowExpandClick.bind(this));

            $(".vuiTrTbCntRowBall").click(this.onHarveyBallClicked.bind(this));
        },

        onHarveyBallClicked:function(oEvent){

            var oRowDom = oEvent.currentTarget.closest(".vuiTrTbCntRow"),
                oRowControl =  sap.ui.getCore().byId(oRowDom.id);

            this.fireHarveyBallClicked({
                rowId: oRowControl.getRowId()
            });
        },

        onRowExpandClick:function(oEvent){
            var oRowDom = oEvent.currentTarget.closest(".vuiTrTbCntRow"),
                oCellDom = oEvent.currentTarget.closest(".vuiTrTbCntRowCell"),
                oRowControl =  sap.ui.getCore().byId(oRowDom.id),
                oCellControl = sap.ui.getCore().byId(oCellDom.id),
                aCells = oRowControl.getCells(),
                aParameters = [];

            aCells.forEach(function (oCell) {
               aParameters.push({
                   "id": oCell.getValId(),
                   "columnId": oCell.getColumnId(),
                   "expanded": oCell.getColumnId() == oCellControl.getColumnId() ? !oCellControl.getExpanded() : oCell.getExpanded()
               });
            });


            this.fireExpand({
                rowId: oRowControl.getRowId(),
                values: aParameters
            });

            oCellControl.setExpanded(!oCellControl.getExpanded());
        },

        onclick: function(oEvent){
            if(!oEvent.target.classList.contains("vuiTrTbCntRowCellAction")) return;

            var oRowDom = oEvent.target.closest(".vuiTrTbCntRow"),
                oRowControl =  sap.ui.getCore().byId(oRowDom.id),
                aCells = oRowControl.getCells(),
                aParameters = [];

            aCells.forEach(function (oCell) {
                aParameters.push({
                    "id": oCell.getValId(),
                    "columnId": oCell.getColumnId(),
                    "expanded": oCell.getExpanded()
                });
            });

            this.fireDetails({
                rowId: oRowControl.getRowId(),
                values: aParameters
            });
        },

        renderer:{
            render:function (oRm, oControl) {

                oRm.write("<div");
                    oRm.writeControlData(oControl);
                    oRm.addClass("vuiTrTb");
                    oRm.writeClasses();
                oRm.write(">");

                    oRm.write("<div  class='vuiTrTbCnt'>");
                        this.renderHeader(oRm, oControl);
                        this.renderRows(oRm, oControl);
                    oRm.write("</div>");
                oRm.write("</div>");
            },

            renderHeader:function (oRm, oControl) {

                oRm.write("<div class='vuiTrTbHdr'>");
                    oRm.write("<div class='vuiTrTbHdrCnt'>");

                        var aColumns = oControl.getColumns();
                        aColumns.forEach(function (oColumn) {
                            oRm.write("<div class='vuiTrTbHdrCntCell'>");
                                oRm.writeEscaped(oColumn.getText());
                            oRm.write("</div>");
                        });

                    oRm.write("</div>");
                oRm.write("</div>");

            },

            _prepareRows: function(aRows, aLevels, aRowExpantion){

                for(var i = 0; i < aRows.length; i++){
                    var aCurrentRowExpantion = [];
                    var aCells = aRows[i].getCells();
                    for (var j = 0; j < aCells.length; j ++){

                        if(aLevels[j] && aLevels[j].length > 0){
                            if(!aCurrentRowExpantion[j])  aCurrentRowExpantion[j] = [];
                            aLevels[j].forEach(function () {
                                aCurrentRowExpantion[j].push("child");
                            });
                        }

                        if(aCells[j].getExpanded()){
                            if(!aCurrentRowExpantion[j])  aCurrentRowExpantion[j] = [];
                            aCurrentRowExpantion[j].push("expand");
                            if(!aLevels[j]){
                                aLevels[j] = [];
                            }
                            aLevels[j].push("1");
                        }
                    }

                    aRowExpantion.push(aCurrentRowExpantion);

                    var aRowChilds = aRows[i].getRows();

                    if(aRowChilds.length > 0)
                        this._prepareRows(aRowChilds, aLevels, aRowExpantion);

                    for (var j = 0; j < aCells.length; j ++){
                        if(aCells[j].getExpanded()){

                            var oLastRow = aRowExpantion[aRowExpantion.length - 1];
                            oLastRow[j][aLevels[j].length - 1] = "close";

                            aLevels[j].pop();
                        }
                    }
                }
            },

            renderRows:function (oRm, oControl) {
                oRm.write("<div  class='vuiTrTbCntRows'>");
                    var aRows = oControl.getRows();

                    var aRowExpantion = [];
                    this._prepareRows(aRows, [], aRowExpantion);

                    var oGlobalIndex = {index: -1};
                    aRows.forEach(function (oRow, iRowIndex) {
                        oGlobalIndex.index++;
                        this.renderRow(oRm, oRow, iRowIndex, aRows, aRowExpantion, oGlobalIndex);
                    }.bind(this));

                oRm.write("</div>");
            },

            renderRow:function (oRm, oRow, iRowIndex, aRows, aRowExpantion, oGlobalIndex) {
                var aChilds = oRow.getRows();

                oRm.write("<div  class='vuiTrTbCntRow'");
                oRm.writeControlData(oRow);
                oRm.write(">");

                    var aCells = oRow.getCells();
                    aCells.forEach(function (oCell, iCellIndex) {
                        oRm.write("<div ");
                        oRm.writeControlData(oCell);
                        var sCellText = oCell.getText(),
                            iCellNumber = oCell.getChildsNumber(),
                            bExpanded = oCell.getExpanded();

                        oRm.addClass("vuiTrTbCntRowCell");
                        if(iCellNumber > 0){
                            oRm.addClass("vuiTrTbCntRowCellHasChilds");
                        }
                        oRm.writeClasses();
                        oRm.write(">");

                             var aCellExpansion =  aRowExpantion[oGlobalIndex.index][iCellIndex] || [];

                             aCellExpansion.forEach(function (sExpantion, iIndex) {
                                    switch (sExpantion){
                                        case "expand":
                                            oRm.write("<div class='vuiTrTbCntRow-span-left-top'");
                                                oRm.addStyle("left", 4*iIndex+ 3 + "px");
                                                oRm.writeStyles();
                                            oRm.write("></div>");
                                            break;
                                        case "child":
                                            oRm.write("<div class='vuiTrTbCntRow-span-left'");
                                                oRm.addStyle("left", 4*iIndex  + 3 + "px");
                                                oRm.writeStyles();
                                            oRm.write("></div>");
                                            break;
                                        case "close":
                                            oRm.write("<div class='vuiTrTbCntRow-span-left-bottom'");
                                                oRm.addStyle("left", 4*iIndex  + 3 + "px");
                                                oRm.writeStyles();
                                            oRm.write("></div>");
                                            break;
                                    }
                             });

                            oRm.write("<div ");
                            oRm.addClass("vuiTrTbCntRowCellContent");
                            if(iCellNumber > 0){
                                oRm.addClass("vuiTrTbCntRowCellHasChilds");
                            }
                            oRm.writeClasses();

                            oRm.addStyle("margin-left", 4*aCellExpansion.length + 3 + "px");
                            oRm.writeStyles();


                            oRm.write(">");

                                if(iCellNumber > 0) {
                                    if(bExpanded == true){
                                        oRm.writeIcon("sap-icon://navigation-down-arrow", "vuiTrTbCntRowCellExpanded sapUiTinyMarginEnd");
                                    }else if(bExpanded == false){
                                        oRm.writeIcon("sap-icon://navigation-down-arrow", "vuiTrTbCntRowCellCollapsed sapUiTinyMarginEnd");
                                    }
                                }

                                if(iCellNumber > 0){
                                    oRm.writeEscaped(sCellText  + " (" + iCellNumber + ")");
                                }else{

                                    if(iRowIndex > 0) {
                                        var sPreviosCellValId = aRows[iRowIndex - 1].getCells()[iCellIndex].getValId();
                                        if(sPreviosCellValId == oCell.getValId()){
                                            sCellText = "";
                                        }
                                    };
                                    oRm.writeEscaped(sCellText);
                                }
                                oRm.write("</div>");
                        oRm.write("</div>");
                    });

                    this.renderAvailiablity(oRm, oRow);

                    oRm.write("<div class='vuiTrTbCntRowCell'>");
                        oRm.write("<div class='vuiTrTbCntRowCellContent'>");
                            oRm.write("<button class='vuiTrTbCntRowCellAction'>...</button>")
                        oRm.write("</div>");
                    oRm.write("</div>");

                oRm.write("</div>");

                if(aChilds.length > 0){
                    aChilds.forEach(function (oChildRow, iRowIndex) {
                        oGlobalIndex.index++;
                        this.renderRow(oRm, oChildRow, iRowIndex, aChilds, aRowExpantion, oGlobalIndex);
                    }.bind(this))
                }
            },

            renderAvailiablity:function (oRm, oRow) {
                oRm.write("<div class='vuiTrTbCntRowCell vuiTrTbCntRowCellPadding'>");
                        var iAvailiabitity = oRow.getAvailibility();

                        var sStatusText = oRow.getAvailibilityText();

                        oRm.write("<span");
                            oRm.addClass("vuiTrTbCntRowBall");
                            if(iAvailiabitity == 0)  oRm.addClass("vuiTrTbCntRowBallZero");
                            if(iAvailiabitity == 100)  oRm.addClass("vuiTrTbCntRowBall100");
                            if(iAvailiabitity > 0 && iAvailiabitity < 33.333) oRm.addClass("vuiTrTbCntRowBall25");
                            if(iAvailiabitity >= 33.333 && iAvailiabitity < 66.666) oRm.addClass("vuiTrTbCntRowBall50");
                            if(iAvailiabitity >= 66.666 && iAvailiabitity < 100) oRm.addClass("vuiTrTbCntRowBall75");
                            oRm.writeClasses();
                            oRm.write(">");
                            if((iAvailiabitity > 0 && iAvailiabitity < 33.333) ||(iAvailiabitity >= 66.666 && iAvailiabitity < 100) ){
                                oRm.write("<span class='vuiTrTbCntRowPie'/>");
                            }
                        oRm.write("</span>");

                        if(sStatusText) {
                            oRm.write("<span");
                            oRm.addClass("vuiTrTbCntRowStatusLabel");
                           /* if (sStatus == "available") {
                                oRm.addClass("vuiTrTbCntRowStatusAvailable");
                            } else {
                                oRm.addClass("vuiTrTbCntRowStatusNotAvailable");
                            }*/
                            oRm.writeClasses();
                            oRm.addStyle("background",  oRow.getColor());
                            oRm.writeStyles();
                            oRm.write(">");

                                oRm.write("<span>");
                                oRm.writeEscaped(oRow.getAvailibilityText());
                                oRm.write("</span>");
                            oRm.write("</span>");
                        }
                oRm.write("</div>");
            }

        }
        
    });

    return oControl;
});