sap.ui.define(["sap/ui/core/Control",
                "sap/ui/core/Element"
], function(Control, Element) {
    "use strict";

    var oControl = Control.extend(vistexConfig.rootFolder + ".ui.availsWidgets.HeatMap.HeatMap", {
        metadata: {
            properties: {
                "horizontalDimName":{"type":"string", "defaultValue":""},
                "verticalDimName":{"type":"string", "defaultValue":""},
                "data":{"type":"object", "defaultValue":"{}"},
                "compactMode": {"type":"boolean", "defaultValue":"true"}
            },
            events: {
                cellClick:{
                    parameters:{
                        rowId:{type:"string"},
                        columnId:{type:"string"}
                    }
                },
                detailClick:{
                    parameters:{
                        rowId:{type:"string"},
                        columnId:{type:"string"}
                    }
                },
                doubleClick:{
                    parameters:{
                        rowId:{type:"string"},
                        columnId:{type:"string"}
                    }
                }
            },
            aggregations: {
                rows:{"type":vistexConfig.rootFolder + ".ui.availsWidgets.HeatMap.HeatMapRow", "multiple":true, defaultValue:[]},
                columns:{"type":vistexConfig.rootFolder + ".ui.availsWidgets.HeatMap.HeatMapColumn", "multiple":true, defaultValue:[]},
                backLink: {"type":"sap.ui.core.Control", "multiple": false},
                legend: {"type":vistexConfig.rootFolder + ".ui.availsWidgets.HeatMap.HeatMapLegend", "multiple": false}
                // switch: {"type":"sap.ui.core.Control", "multiple": false}
            }
        },

        onAfterRendering: function(){
            //subscribe for different events
            $(".vuiHtMpRowParent .vuiHtMpRowHdrCntRowLeft").click(this.onRowExpandClick.bind(this));
            $(".vuiHtMpColumnParent .vuiHtMpHdrCntCellLeftCell").click(this.onColumnExpandClick.bind(this));

            $(".sapMPage>section.sapMPageEnableScrolling").scroll({
                                                                    Scroller: this
                                                                }, this.onScrollHandler);

            $(".vuiHtMpScrollBar").mousedown({
                    Scroller: this
                }, this.onHtMpScrollBarMouseDown);

            $(document).mouseup({
                    Scroller: this
                }, this.onDocumentMouseUp);

            $(".vuiHtMpScrollDetector").mousemove({
                    Scroller: this
                }, this.onScrollDetectorMouseMove.bind(this));

            $(window).resize(function () {
                    this.refreshHrzScroll.apply(this,[true]);
                }.bind(this)
            );

            //Set up horizontal scroll
            setTimeout(function () {
                this.refreshHrzScroll(true);
            }.bind(this),200);

            $(".vuiHtMpRowHdrBorder").mousedown(this.initColumnResizing.bind(this));
            $(".vuiHtMpHdrBorder").mousedown(this.initRowResizing.bind(this));

            $.fn.single_double_click = function(single_click_callback, double_click_callback, timeout) {
                return this.each(function(){
                    var clicks = 0, self = this;
                    $(this).click(function(event){
                        clicks++;
                        if (clicks === 1) {
                            setTimeout(function(){
                                if(clicks === 1) {
                                    // console.log(clicks + 'single');
                                    single_click_callback.call(self, event);
                                } else {
                                    // console.log(clicks + 'double');
                                    double_click_callback.call(self, event);
                                }
                                // console.log(clicks+ 'before reset');
                                clicks = 0;
                                // console.log(clicks+ 'after reset');
                            }, timeout || 300);
                        }
                    });
                });
            };

            $(".vuiHtMpRowCellCnt").single_double_click(function (oEvent) {
                var oTargetIds = this.getColumnAndRowId(oEvent);
                this.fireCellClick({
                    rowId: oTargetIds.sRowId,
                    columnId: oTargetIds.sColumnID
                });
                // console.log('single')
            }.bind(this), function (oEvent) {
                var oTargetIds = this.getColumnAndRowId(oEvent);
                this.fireDoubleClick({
                    rowId: oTargetIds.sRowId,
                    columnId: oTargetIds.sColumnID
                });
                // console.log('double')
            }.bind(this));
            this._applyCompactStyles();
        },

        onBeforeRendering:function(){
            //Onsubscribe from all events
            $(".sapMPage>section.sapMPageEnableScrolling").off("scroll");
            $(".vuiHtMpScrollBar").off("mousedown");
            $(document).off("mouseup");
            $(".vuiHtMpScrollDetector").off("mousemove");
            $(window).off("resize");
            $(".vuiHtMpRowHdrBorder").off("mousedown");
            $(".vuiHtMpHdrBorder").off("mousedown");
        },

        exit:function(){
            $(".sapMPage>section.sapMPageEnableScrolling").off("scroll");
            $(".vuiHtMpScrollBar").off("mousedown");
            $(document).off("mouseup");
            $(".vuiHtMpScrollDetector").off("mousemove");
            $(window).off("resize");
            $(".vuiHtMpRowHdrBorder").off("mousedown");
            $(".vuiHtMpHdrBorder").off("mousedown");
            delete $.fn.single_double_click;
        },

        getColumnAndRowId: function(oEvent){
            var oTarget = oEvent.target;

            var oCell = oTarget.closest(".vuiHtMpRowCell"),
                oRow = oTarget.closest(".vuiHtMpRow");

            return {
                    oCell: oCell,
                    sColumnID: oCell.getAttribute("data-vuihtmpcellcolumnid"),
                    oRow: oRow,
                    sRowId: oRow.getAttribute("data-vuihtmprowid")
                };
        },

        onclick:function(oEvent){
            var oTarget = oEvent.target;

            if((!oTarget.classList.contains("vuiHtMpRowCellCnt")) && (!oTarget.classList.contains("triangle")))
                return;

            if(oTarget.classList.contains("vuiHtMpRowCellCnt")){
                // var oTargetIds = this.getColumnAndRowId(oEvent);
                // this.fireCellClick({
                //     rowId: oTargetIds.sRowId,
                //     columnId: oTargetIds.sColumnID
                // });
                //
                // this.fireDoubleClick({
                //     rowId: oTargetIds.sRowId,
                //     columnId: oTargetIds.sColumnID
                // });
            }

            if(oTarget.classList.contains("triangle")){
                this.fireDetailClick({
                    rowId: oTargetIds.sRowId,
                    columnId: oTargetIds.sColumnID
                });
            }
        },

        onRowExpandClick:function(oEvent){
            var oRow = oEvent.currentTarget.closest(".vuiHtMpRow");
            if(!oRow)
                return;

            var iRowId = oRow.getAttribute("data-vuiHtMpRowId"),
                sExpanded = oRow.getAttribute("data-rowexpanded");
            if(!iRowId)
                return;

            if(sExpanded === "1") {
                $("div[data-vuihtmpparentrowid='" + iRowId + "']").hide();
                oRow.setAttribute("data-rowexpanded", "0");
            }else{
                $("div[data-vuihtmpparentrowid='" + iRowId + "']").show();
                oRow.setAttribute("data-rowexpanded", "1");
            }
        },

        onColumnExpandClick:function(oEvent){
            var oColumn = oEvent.currentTarget.closest(".vuiHtMpHdrCntCell");
            if(!oColumn)
                return;

            var iColumnId = oColumn.getAttribute("data-vuihtmpcolumnid"),
                sExpanded = oColumn.getAttribute("data-columnexpanded");
            if(!iColumnId)
                return;

            if(sExpanded === "1") {
                $("div[data-vuihtmpcellparentcolumnid='" + iColumnId + "']").hide();
                $("div[data-vuihtmpparentcolumnid='" + iColumnId + "']").hide();
                oColumn.setAttribute("data-columnexpanded", "0");
                this.refreshHrzScroll();
            }else{
                $("div[data-vuihtmpcellparentcolumnid='" + iColumnId + "']").show();
                $("div[data-vuihtmpparentcolumnid='" + iColumnId + "']").show();
                oColumn.setAttribute("data-columnexpanded", "1");
                this.refreshHrzScroll();
            }
        },

        onScrollDetectorMouseMove: function (n) {
            var oScroller = n.data.Scroller,
                f,
                oScrollBar = $(".vuiHtMpScrollBar"),
                u = oScrollBar.parent().width() - oScrollBar.width(),
                r = Math.min(Math.max(0, n.pageX - oScroller.HrzntlCrsrDiff - oScrollBar.parent().offset().left), u);

            oScrollBar.css({
                left: r,
                position: "relative"
            }),
                f = 0 + ($(".vuiHtMpHdrCnt").offset().left + $(".vuiHtMpHdrCnt").outerWidth(!1)) - ($(".vuiHtMp").offset().left + $(".vuiHtMp").width()),
                r = -1 * Math.round(r * f / u);
            this.HorizontalScrollSet(r);
            $(".vuiHtMpHdrCntCell").each(function(i, value) {
                var col = $(value);
                col.offset({
                    left: $(".vuiHtMpRowCell-" + i).offset().left,
                    // top: iDiff + $("#vuiHtMpHdr").offset().top
                });
            });
        },

        onHtMpScrollBarMouseDown: function (n) {
            var t = n.data.Scroller;
            t.Busy || (t.Busy = !0,
                t.HrzntlCrsrDiff = n.pageX - $(".vuiHtMpScrollBar").offset().left,
                t.HrzntlCanScroll = !0,
                $(".vuiHtMpScrollDetector").show(),
                $(".vuiHtMpScrollDetector").offset({
                    top: -10,
                    left: -10
                }),
                $(".vuiHtMpScrollDetector").width($(document).width() + 20),
                $(".vuiHtMpScrollDetector").height($(document).height() + 20),
                t.Busy = !1)
        },

        onDocumentMouseUp:function (n) {
            n.data.Scroller.HrzntlCanScroll = !1,
                $(".vuiHtMpScrollDetector").hide()
        },

        VariablesSet : function() {
            var n = this;
            n.NavBot = $(document).scrollTop() + $(".sapMPageHeader").outerHeight(!1),
            $(".sapMPageHeader").position() && (n.NavBot = n.NavBot + $(".sapMPageHeader").position().top),
                n.TopRowBot = n.NavBot + $("#vuiHtMpHdr").outerHeight(!0),
                n.Row1Bot = n.TopRowBot + $("#vuiHtMpHdr").first().outerHeight(!0)
        },

        HorizontalScrollerHide: function() {
            $(".vuiHtMpScrollContainer").hide();
            $(".vuiHtMpScrollDetector").hide();
        },

        refreshHrzScroll:function(n){
                if (true)
                    if ($(document).scrollTop(0), $(".vuiHtMpHdrCnt").outerWidth(!0) > $(".vuiHtMp").width()) {
                        $(".vuiHtMpScrollContainer").width($(".vuiHtMp").outerWidth(!0));
                        var t = $(".vuiHtMpScrollContainer").width() * $(".vuiHtMp").width() / $(".vuiHtMpHdrCnt").outerWidth(!0);
                        $(".vuiHtMpScrollContainer").show(),
                            $(".vuiHtMpScrollContainer").offset({
                                top: $(".vuiHtMpGridNavHorPos").offset().top
                            });
                            $(".vuiHtMpScrollBar").width(t);
                            $(".vuiHtMpScrollBar").css({
                                left: 0
                            });
                            this.HorizontalScrollSet(0);
                    } else
                        this.HorizontalScrollerHide();
               else
                    this.HorizontalScrollerHide();
            $(".vuiHtMpHdrCntCell").each(function(i, value) {
                var col = $(value);
                col.offset({
                    left: $(".vuiHtMpRowCell-" + i).offset().left,
                    // top: iDiff + $("#vuiHtMpHdr").offset().top
                });
            });
        },

        HorizontalScrollSet: function (n) {
            var i = $($(".vuiHtMpHdrCntCellEmpt"))
                , t = 1 + i.offset().left + i.outerWidth(!1);

            $(".vuiHtMpHdrCntCell").css({
                left: n
            });

            $(".vuiHtMpCellsInRow").css({
                left: n
            });

                $(".vuiHtMpHdrCntCell").each(function (i, r) {
                    var e = $(r), s;
                    if (e.hasClass("vuiHtMpColumnParent")) {
                        var o = e.offset().left
                            , u = e.find(".vuiHtMpHdrCntCellCnt")
                            , f = $(".vuiHtMpRowCell-" + i);
                           if( i > 0 && (1 < t - 28 - o)) {
                               if( !u.hasClass("mm-av-grid-scrolled-edge-top")) {
                                   u.addClass("mm-av-grid-scrolled-edge-top");
                                   f.addClass("mm-av-grid-scrolled-edge-left");
                               }
                           }
                           else if (u.hasClass("mm-av-grid-scrolled-edge-top")){
                                   u.removeClass("mm-av-grid-scrolled-edge-top");
                                   f.removeClass("mm-av-grid-scrolled-edge-left");
                           }
                            if(1 < t - 28 - o) {
                               e.css({
                                    left:  Math.floor( n + t - o - 28)
                                });
                                    s = f.first();
                                    s.css({
                                        left: 0
                                    });
                                    f.css({
                                        left: t - s.offset().left - 1
                                    });
                                    if (! u.hasClass("vuiHtMpScrolledBottom")){
                                        u.addClass("vuiHtMpScrolledBottom");
                                        f.addClass("vuiHtMpScrolledRight");
                                    }
                            }
                            else {
                                if( u.hasClass("vuiHtMpScrolledBottom"))
                                    f.css({
                                    left: 0
                                    });
                                    u.removeClass("vuiHtMpScrolledBottom");
                                    f.removeClass("vuiHtMpScrolledRight");
                            }
                    }
                })
        },

        onScrollHandler: function(n){
            var VariablesSet = function() {
                var n = this;
                n.NavBot = $(document).scrollTop() + $(".sapMPageHeader").outerHeight(!1);
                $(".sapMPageHeader").position() && (n.NavBot = n.NavBot + $(".sapMPageHeader").position().top),
                    n.TopRowBot = n.NavBot + $("#vuiHtMpHdrWrapper").outerHeight(!0),
                    n.Row1Bot = n.TopRowBot + $("#vuiHtMpHdrWrapper").first().outerHeight(!0)
            };

            var t = n.data.Scroller;
            VariablesSet.apply(t);
            $("#vuiHtMpHdrWrapper").css({
                top: 0
            });

            $("#vuiHtMpHdrWrapper").offset().top < t.NavBot && $("#vuiHtMpHdrWrapper").offset({
                top: t.NavBot
            });

            $(".vuiHtMpScrollContainer").offset({
                top: $(".vuiHtMpGridNavHorPos").offset().top
            });

            $(".vuiHtMpRowParent").each(function(n, i) {
                var r = $(i);
                r.css({
                    top: 0
                });
                if (r.offset().top < t.TopRowBot) {
                    r.offset({
                        top: t.TopRowBot
                    });
                    r.find(".vuiHtMpRowHdr").addClass("vuiDashedBottomBorder");
                    r.find(".vuiHtMpRowCell").addClass("vuiDashedBottomBorder");
                }
                else {
                    r.find(".vuiHtMpRowHdr").removeClass("vuiDashedBottomBorder");
                    r.find(".vuiHtMpRowCell").removeClass("vuiDashedBottomBorder");
                }
                if ( n > 0 && r.offset().top < t.Row1Bot) {
                    r.find(".vuiHtMpRowHdr").addClass("vuiDashedTopBorder");
                    r.find(".vuiHtMpRowCell").addClass("vuiDashedTopBorder");

                }else{
                    r.find(".vuiHtMpRowHdr").removeClass("vuiDashedTopBorder");
                    r.find(".vuiHtMpRowCell").removeClass("vuiDashedTopBorder");
                }
            });

            $(".vuiHtMpHdrBorder").css({
                top: 0
            });

            $(".vuiHtMpHdrBorder").offset().top < $("#vuiHtMpHdrWrapper").offset().top && $(".vuiHtMpHdrBorder").offset({
                // top: $("#vuiHtMpHdr").offset().top + $("#vuiHtMpHdr").height()
                top: t.NavBot + $("#vuiHtMpHdrWrapper").height()
            });

            $(".vuiHtMpHdrBorder").offset().top > $("#vuiHtMpHdrWrapper").offset().top && $(".vuiHtMpHdrBorder").offset({
                // top: $("#vuiHtMpHdr").offset().top + $("#vuiHtMpHdr").height()
                top: $("#vuiHtMpHdrWrapper").offset().top + $("#vuiHtMpHdrWrapper").height()
            });
        },

        init: function() {

        },

        isTreeBinding: function(sName) {
            if ( sName === "rows" || sName === "columns") {
                return true;
            }
            return false;
        },

        initColumnResizing: function(oEvent){
            oEvent.preventDefault();
            oEvent.stopPropagation();

            if (this._bIsColumnResizerMoving) {
                return;
            }

            this._bIsColumnResizerMoving = true;

            var $Document = jQuery(document),
                bTouch = this._isTouchEvent(oEvent);

            this._$colResize = $(".vuiHtMpRowHdrBorder");
            this._iColumnResizeStart = this._getEventPosition(oEvent, this).x;

            $Document.bind((bTouch ? "touchend" : "mouseup"),
                this.exitColumnResizing.bind(this));
            $Document.bind((bTouch ? "touchmove" : "mousemove"),
                this.onMouseMoveWhileColumnResizing.bind(this));
        },

        _isTouchEvent: function(oEvent) {
            return !!(oEvent && oEvent.originalEvent && oEvent.originalEvent.touches);
        },

        exitColumnResizing: function(oEvent){
            this._cleanupColumResizing(this);
        },

        _getEventPosition: function(oEvent, oTable) {
            var oPosition;

            function getTouchObject(oTouchEvent) {
                if (!oTable._isTouchEvent(oEvent)) {
                    return null;
                }

                var aTouchEventObjectNames = ["touches", "targetTouches", "changedTouches"];

                for (var i = 0; i < aTouchEventObjectNames.length; i++) {
                    var sTouchEventObjectName = aTouchEventObjectNames[i];

                    if (oEvent[sTouchEventObjectName] && oEvent[sTouchEventObjectName][0]) {
                        return oEvent[sTouchEventObjectName][0];
                    }
                    if (oEvent.originalEvent[sTouchEventObjectName] && oEvent.originalEvent[sTouchEventObjectName][0]) {
                        return oEvent.originalEvent[sTouchEventObjectName][0];
                    }
                }

                return null;
            }

            oPosition = getTouchObject(oEvent) || oEvent;

            return {x: oPosition.pageX, y: oPosition.pageY};
        },

        _cleanupColumResizing: function(oTable) {
            if (oTable._$colResize) {
                oTable._$colResize = null;
            }
            oTable._iColumnResizeStart = null;
            oTable._bIsColumnResizerMoving = false;

            var $Document = jQuery(document);
            $Document.unbind("touchmove");
            $Document.unbind("touchend");
            $Document.unbind("mousemove");
            // $Document.unbind("mouseup");
        },

        getMinColumnWidth: function() {
            if (this._iColMinWidth) {
                return this._iColMinWidth;
            }
            this._iColMinWidth = $(".vuiHtMpRowHdrCnt").width();

            return this._iColMinWidth;
        },

        onMouseMoveWhileColumnResizing: function(oEvent) {
            var iLocationX = this._getEventPosition(oEvent, this).x;

            if (this._iColumnResizeStart && iLocationX < this._iColumnResizeStart + 3 && iLocationX > this._iColumnResizeStart - 3) {
                return;
            }

            if (this._isTouchEvent(oEvent)) {
                oEvent.stopPropagation();
                oEvent.preventDefault();
            }

            // calculate and set the position of the resize handle
            var iRszOffsetLeft = this.$().find(".vuiHtMpRowCnt").offset().left;
            var iRszLeft = Math.floor((iLocationX - iRszOffsetLeft) - (this._$colResize.width() / 2));
            if (this.getMinColumnWidth() > iRszLeft){
                iRszLeft = this.getMinColumnWidth();
            }

            // var iHdrWidth = $(".vuiHtMpHdr").width() - ;

            this._$colResize.css("left", iRszLeft + "px");

            if (iRszLeft > 750) {
                iRszLeft = 750
            }

            $(".vuiHtMpRowHdr").css("width", iRszLeft + "px");

            $(".vuiHtMpHdrCntCellEmpt").css("width", iRszLeft + "px");
            // var iHdrWidth = $(".vuiHtMpHdr").width() - 138 + iRszLeft;

            // $(".vuiHtMpHdr").css("width", Math.floor(1125 + iRszLeft) + "px");

            this.refreshHrzScroll();
            $(".vuiHtMpHdrCntCell").each(function(i, value) {
                var col = $(value);
                col.offset({
                    left: $(".vuiHtMpRowCell-" + i).offset().left,
                    // top: iDiff + $("#vuiHtMpHdr").offset().top
                });
            });
        },

        initRowResizing: function(oEvent){
            oEvent.preventDefault();
            oEvent.stopPropagation();

            if (this._bIsRowResizerMoving) {
                return;
            }

            this._bIsRowResizerMoving = true;

            var $Document = jQuery(document),
                bTouch = this._isTouchEvent(oEvent);

            this._$rowResize = $(".vuiHtMpHdrBorder");
            this._iRowResizeStart = this._getEventPosition(oEvent, this).y;
            $Document.bind((bTouch ? "touchend" : "mouseup"),
                this.exitRowResizing.bind(this));
            $Document.bind((bTouch ? "touchmove" : "mousemove"),
                this.onMouseMoveWhileRowResizing.bind(this));
        },

        exitRowResizing: function(){
            this._cleanupRowResizing(this);
        },

        _cleanupRowResizing: function(oTable) {
            if (oTable._$rowResize) {
                oTable._$rowResize = null;
            }
            oTable._iRowResizeStart = null;
            oTable._bIsRowResizerMoving = false;

            var $Document = jQuery(document);
            $Document.unbind("touchmove");
            $Document.unbind("touchend");
            $Document.unbind("mousemove");
            // $Document.unbind("mouseup");
        },

        getMinRowHeight: function() {
            if (this._iRowMinHeight) {
                return this._iRowMinHeight;
            }
            // this._iRowMinHeight = $(".vuiHtMpHdrCntCellEmpt").height();
            this._iRowMinHeight = $(".vuiHtMpHdrCnt").height();

            return this._iRowMinHeight;
        },

        onMouseMoveWhileRowResizing: function(oEvent){
            var iLocationY = this._getEventPosition(oEvent, this).y;

            if (this._iRowResizeStart && iLocationY < this._iRowResizeStart + 3 && iLocationY > this._iRowResizeStart - 3) {
                return;
            }

            if (this._isTouchEvent(oEvent)) {
                oEvent.stopPropagation();
                oEvent.preventDefault();
            }

            // calculate and set the position of the resize handle
            var iRszOffsetTop = this.$().find(".vuiHtMpHdrCnt").offset().top;

            var iRszTop = Math.floor((iLocationY - iRszOffsetTop) - (this._$rowResize.height() / 2));
            if (this.getMinRowHeight() > iRszTop){
                iRszTop = this.getMinRowHeight();
            }

            this._$rowResize.css("top", iRszTop + "px");

            this._$rowResize.offset().top < $("#vuiHtMpHdr").offset().top && this._$rowResize.offset({
                top: $("#vuiHtMpHdr").height()
            });

            this._$rowResize.offset().top > $("#vuiHtMpHdr").offset().top && this._$rowResize.offset({
                top: $("#vuiHtMpHdr").offset().top + $("#vuiHtMpHdr").height()
            });

            // this._$rowResize.css("top", $(".vuiHtMpHdrCnt").height() + "px");
            // $(".vuiHtMpHdrCnt").css("position", "");

            // var rad = 315 * Math.PI / 180,
            //     sin = Math.sin(rad),
            //     cos = Math.cos(rad);
            //
            // // var h = Math.floor($(".vuiHtMpHdrCntCellCnt").height() * Math.abs(cos) + $(".vuiHtMpHdrCntCellCnt").width() * Math.abs(sin));
            // // var w = Math.floor($(".vuiHtMpHdrCntCellCnt").width() * Math.abs(cos) + $(".vuiHtMpHdrCntCellCnt").height() * Math.abs(sin));

            if (iRszTop > 550){
                iRszTop = 550;
            }

            var iTopCell = -939 + iRszTop - 120;
            var iTopOflCell = -1186 + iRszTop - 120;
            //
            $(".vuiHtMpHdrCnt").css("height", iRszTop + "px");
            $(".vuiHtMpHdrCntCellOverfl").css("top", iTopOflCell + "px");
            //
            $(".vuiHtMpHdrCntCell").css("height", iRszTop + "px");
            $(".vuiHtMpHdrCntCellCnt").css("top", iTopCell + "px");
        },

        compactChange: function(bValue){
            this.setCompactMode(bValue);
        },

        _applyCompactStyles:function () {
            var bState = this.getProperty("compactMode");

            if (bState) {
                $(".vuiHtMpRowCell").css("width", 38 + "px");
                $(".vuiHtMpRowCellCnt").css("height", 30 + "px");
                $(".vuiHtMpRow").css("height", 34 + "px");
                $(".vuiHtMpHdrCntCellCnt").css("height", 25 + "px");
                $(".vuiHtMpHdrCntCellCntInner").css("height", 21 + "px");
                // $(".vuiHtMpHdrCntCell").css("margin-left", -172 + "px");
                $(".vuiHtMpHdrCntCellRightCellText").css("font-size", 10 + "px");
                $(".vuiHtMpRowHdrCntTxt").css("font-size", 10 + "px");
                $(".vuiHtMpRow").css("margin-bottom", -1 + "px");
                $(".vuiHtMpCellsInContent").css("margin-right", -2 + "px");
            } else {
                $(".vuiHtMpRowCell").css("width", 45 + "px");
                $(".vuiHtMpRowCellCnt").css("height", 37 + "px");
                $(".vuiHtMpHdrCntCellCnt").css("height", 31 + "px");
                $(".vuiHtMpHdrCntCellCntInner").css("height", 27 + "px");
                $(".vuiHtMpRow").css("height", 39 + "px");
                // $(".vuiHtMpHdrCntCell").css("margin-left", -168 + "px");
                $(".vuiHtMpHdrCntCellRightCellText").css("font-size", 12 + "px");
                $(".vuiHtMpRowHdrCntTxt").css("font-size", 12 + "px");
                $(".vuiHtMpRow").css("margin-bottom", 0 + "px");
                $(".vuiHtMpCellsInContent").css("margin-right", 0 + "px");
            }

            $(".vuiHtMpHdrCntCell").each(function(i, value) {
                var col = $(value);
                col.offset({
                    left: $(".vuiHtMpRowCell-" + i).offset().left,
                    // top: iDiff + $("#vuiHtMpHdr").offset().top
                });
            });
        },

        renderer:{
            render:function(oRm, oControl) {

                oRm.write("<div");
                oRm.writeControlData(oControl);
                oRm.addClass("vuiHtMp");
                oRm.writeClasses();
                oRm.write(">");

                    oRm.write("<div class='vuiHtMpScrollDetector'>");
                    oRm.write("</div>");

                    oRm.write("<div class='vuiHtMpScrollContainer'>");
                        oRm.write("<div class='vuiHtMpScrollBar'>");
                        oRm.write("</div>");
                    oRm.write("</div>");


                   /* oRm.write("<div class='vuiHtMpGridNavCont'>");
                        oRm.write("<div class='vuiHtMpGridNavContContent'>");*/
                            oRm.write("<div class='vuiHtMpGridNavContContentItems'>");

                                oRm.write("<div class='vuiHtMpGridNavContContentItemLink'>");
                                    var oBackLink = oControl.getBackLink();
                                    if(oBackLink){
                                        oRm.renderControl(oBackLink);
                                    }
                                oRm.write("</div>");

                                // oRm.write("<div class='vuiHtMpGridNavLegendCont'>");
                                oRm.write("<div class='vuiHtMpGridNavContContentItemLegend'>");
                                    var oLegend = oControl.getLegend();
                                    if (oLegend){
                                        oRm.renderControl(oLegend);
                                    }
                                oRm.write("</div>");
                            oRm.write("</div>");

                /* oRm.write("<div class='vuiHtMpGridNavContContentItemSwitch'>");
                var oSwitch = oControl.getSwitch();
                if (oSwitch){
                    oRm.renderControl(oSwitch);
                    oSwitch.detachChange(oControl.onCompactChange);
                    oSwitch.attachChange(oControl.onCompactChange);
                    // oSwitch.detachChange(oControl.onCompactChange.bind(oControl));
                }
                oRm.write("</div>"); */
                    /*    oRm.write("</div>");
                    oRm.write("</div>");*/

                    oRm.write("<div  class='vuiHtMpCnt'>");
                        this.renderHeader(oRm, oControl);
                        this.renderRows(oRm, oControl);
                    oRm.write("</div>");
                oRm.write("</div>");
            },


            renderHeader:function (oRm, oControl) {
                oRm.write("<div id='vuiHtMpHdrWrapper' class='vuiHtMpHdrWrapper'>");
                    oRm.write("<div class='vuiHtMpGridNav'>");
                        oRm.write("<div class='vuiHtMpGridNavHorPosCont'>");
                            oRm.write("<div class='vuiHtMpGridNavHorPos'></div>");
                        oRm.write("</div>");
                    oRm.write("</div>");

                    oRm.write("<div id='vuiHtMpHdr' class='vuiHtMpHdr'>");

                        oRm.write("<div class='vuiHtMpHdrCnt'>");

                            oRm.write("<div class='vuiHtMpHdrCntCellEmpt'>");
                                oRm.write("<div class='vuiHtMpHdrCntCellEmptHrDimName'>");
                                    oRm.write(oControl.getHorizontalDimName());
                                oRm.write("</div>");

                                oRm.write("<div class='vuiHtMpHdrCntCellEmptVrDimName'>");
                                    oRm.write(oControl.getVerticalDimName());
                                oRm.write("</div>");

                            oRm.write("</div>");

                            oRm.write("<div class='vuiHtMpHdrCntCellHdn'>");
                                oRm.write("<div class='vuiHtMpHdrCntCellContent'>");
                                    oRm.write("<div class='vuiHtMpHdrCntCellOverfl'>");
                                    oRm.write("</div>");
                                oRm.write("</div>");
                            oRm.write("</div>");


                            var aColumns = oControl.getColumns();
                            oControl._columnsArray = [];
                            aColumns.forEach(function (oColumn) {
                                this.renderColumnHeader(oRm, oColumn, oControl);
                            }.bind(this));
                        oRm.write("</div>");
                    oRm.write("</div>");
                oRm.write("</div>");
                oRm.write("<div class='vuiHtMpHdrBorder'>");
                    oRm.write("<div class='vuiHtMpHdrBorderContent'>");
                    oRm.write("</div>");
                oRm.write("</div>");
            },

            renderColumnHeader:function (oRm, oColumn, oControl, oParentColun) {
                oControl._columnsArray.push(oColumn);

                oRm.write("<div");
                    if(oColumn.getColumns().length > 0){
                        oRm.addClass("vuiHtMpColumnParent");
                        oRm.writeAttribute("data-columnExpanded", "1");
                    }
                    oRm.addClass("vuiHtMpHdrCntCell");
                    oRm.writeClasses();

                    oRm.writeAttribute("data-vuiHtMpColumnId", oColumn.getColumnid());
                    if(oParentColun){
                        oRm.writeAttribute("data-vuiHtMpParentColumnId", oParentColun.getColumnid());
                    }

                    oRm.write(">");

                    oRm.write("<div class='vuiHtMpHdrCntCellCnt'>");
                        oRm.write("<div class='vuiHtMpHdrCntCellCntInner'>");
                            oRm.write("<div class='vuiHtMpHdrCntCellCntTable'>");
                                oRm.write("<div class='vuiHtMpHdrCntCellRow'>");
                                    oRm.write("<div class='vuiHtMpHdrCntCellLeftCell'>");
                                    if(oColumn.getColumns().length  > 0) {
                                        oRm.writeIcon("sap-icon://navigation-down-arrow", "vuiHtMpColumnExpIcon");
                                    }
                                    oRm.write("</div>");
                                    oRm.write("<div class='vuiHtMpHdrCntCellRightCell'>");
                                        oRm.write("<div class='vuiHtMpHdrCntCellRightCellText'>");
                                            oRm.writeEscaped(oColumn.getText());
                                        oRm.write("</div>");
                                    oRm.write("</div>");
                                oRm.write("</div>");
                            oRm.write("</div>");
                        oRm.write("</div>");
                    oRm.write("</div>");
                oRm.write("</div>");

                var aColumns = oColumn.getColumns();
                aColumns.forEach(function (oChildColumn) {
                    this.renderColumnHeader(oRm, oChildColumn, oControl, oColumn);
                }.bind(this));
            },


            renderRows:function (oRm, oControl) {
               var aRows = oControl.getRows();
               aRows.forEach(function (oRow) {
                   this.renderRow(oRm, oRow, oControl);
               }.bind(this));
            },

            renderRow:function (oRm, oRow, oControl, oParentRow) {
                var aChildRows = oRow.getRows();

                oRm.write("<div");
                    oRm.addClass("vuiHtMpRow");
                    if(aChildRows.length > 0) {
                        oRm.addClass("vuiHtMpRowParent");
                        oRm.writeAttribute("data-rowExpanded", "1");
                    }
                    oRm.writeClasses();

                    oRm.writeAttribute("data-vuiHtMpRowId", oRow.getRowid());
                    if(oParentRow){
                        oRm.writeAttribute("data-vuiHtMpParentRowId", oParentRow.getRowid());
                    }
                oRm.write(">");
                    oRm.write("<div class='vuiHtMpRowCnt'>");
                        oRm.write("<div class='vuiHtMpRowHdr'>"); //display table cell

                            oRm.write("<div class='vuiHtMpRowHdrCnt'>"); //display table

                                oRm.write("<div class='vuiHtMpRowHdrCntRow'>"); //Display table-row
                                    oRm.write("<div class='vuiHtMpRowHdrCntRowLeft'>");
                                        if(aChildRows.length > 0) {
                                            oRm.writeIcon("sap-icon://navigation-down-arrow", "vuiHtMpRowExpIcon");
                                        }
                                    oRm.write("</div>");
                                    oRm.write("<div class='vuiHtMpRowHdrCntRowRight'>");
                                        oRm.write("<div class='vuiHtMpRowHdrCntTxt'>");
                                            oRm.writeEscaped(oRow.getText());
                                        oRm.write("</div>");
                                    oRm.write("</div>");
                                oRm.write("</div>");

                            oRm.write("</div>");

                        oRm.write("</div>");

                        oRm.write("<div class='vuiHtMpRowHdrBorder'>");
                            oRm.write("<div class='vuiHtMpRowHdrBorderContent'>");
                            oRm.write("</div>");
                        oRm.write("</div>");

                        this.renderCells(oRm, oRow, oControl);
                    oRm.write("</div>");
                oRm.write("</div>");


                aChildRows.forEach(function (oChildRow) {
                   this.renderRow(oRm, oChildRow, oControl, oRow);
                }.bind(this));
            },

            renderCells:function (oRm, oRow, oControl) {
                var aColumns = oControl.getColumns(),
                    aCells = oRow.getCells(),
                    oIndex = {iIndex : 0};

                aColumns.forEach(function (oColumn, iIndex) {
                    this.renderCell(oRm, oColumn, aCells, oIndex);
                }.bind(this));
            },

            renderCell:function (oRm, oColumn, aCells, oIndex, oParentColumn) {

                oRm.write("<div");
                    if(oColumn.getColumns().length > 0)
                        oRm.addClass("vuiHtMpRowCellParent");
                        oRm.addClass("vuiHtMpCellsInRow");
                        oRm.writeClasses();
                    oRm.writeAttribute("title", aCells[oIndex.iIndex].getValue());
                oRm.write(">");
                    oRm.write("<div class='vuiHtMpCellsInContent'>");
                        oRm.write("<div class='vuiHtMpCellsInContentCells'>");

                               oRm.write("<div");

                                    oRm.addClass("vuiHtMpRowCell-" + oIndex.iIndex);
                                    oRm.addClass("vuiHtMpRowCell");
                                    oRm.writeClasses();

                                    oRm.writeAttribute("data-vuiHtMpCellColumnId", oColumn.getColumnid());
                                    if(oParentColumn)
                                        oRm.writeAttribute("data-vuiHtMpCellParentColumnId", oParentColumn.getColumnid());
                               oRm.write(">");

                                    oRm.write("<div class='vuiHtMpRowCellCnt'");
                                        oRm.addStyle("background", aCells[oIndex.iIndex].getColor());
                                        oRm.writeStyles();
                                    oRm.write(">");
                                    // oRm.write("<div class='triangle'/>");
                                    oRm.write("</div>");

                               oRm.write("</div>");

                        oRm.write("</div>");
                    oRm.write("</div>");
                oRm.write("</div>");

                oIndex.iIndex++;

                oColumn.getColumns().forEach(function (oChildColumn) {
                    this.renderCell(oRm, oChildColumn, aCells, oIndex, oColumn);
					//iIndex++;
                }.bind(this));
            }
        }
    });
    return oControl;
});