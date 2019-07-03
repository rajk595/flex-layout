var AvailsGridViewScroller = function() {
    function n() {
        this.Refresh = function (n) {
            if (n === void 0 && (n = !1), this.Busy = !0, n)
                if ($(document).scrollTop(0),
                    this.VariablesSet(),
                $("#avail-grid-toprow-inner").outerWidth(!0) > $("#avail-grid-view-container").width()) {
                    $("#avail-grid-view-scroll-horizontal-container").width($("#avail-grid-view-container").outerWidth(!0));
                    var t = $("#avail-grid-view-scroll-horizontal-container").width() * $("#avail-grid-view-container").width() / $("#avail-grid-toprow-inner").outerWidth(!0);
                    $("#avail-grid-view-scroll-horizontal-container").show(),
                        $("#avail-grid-view-scroll-horizontal-container").offset({
                            top: $("#avail-grid-scroll-horizontal-pos").offset().top
                        }),
                        $("#avail-grid-view-scroll-horizontal-bar").width(t),
                        $("#avail-grid-view-scroll-horizontal-bar").css({
                            left: 0
                        }),
                        this.HorizontalScrollSet(0)
                } else
                    this.HorizontalScrollerHide();
            else
                this.HorizontalScrollerHide();
            this.Busy = !1
        }
            ,
            this.HorizontalScrollSet = function (n) {
                var i = $($("#avail-grid-toprow-dims"))
                    , t = 1 + i.offset().left + i.outerWidth(!1);

                $(".vuiHtMpHdrCntCell").css({
                    left: n
                }),
                    $(".vuiHtMpCellsInRow").css({
                        left: n
                    }),
                    $(".avail-grid-axis-horizontal").each(function (i, r) {
                        var e = $(r), s;
                        if (e.hasClass("cpo-av-grid-axis-h-parent")) {
                            var o = e.offset().left
                                , u = e.find(".avail-grid-axis-horizontal-inner")
                                , f = $(".cpo-av-grid-cell-" + i);
                                i > 0 && (o < t + 47 ? u.hasClass("mm-av-grid-scrolled-edge-top") || (u.addClass("mm-av-grid-scrolled-edge-top"),
                                f.addClass("mm-av-grid-scrolled-edge-left")) : u.hasClass("mm-av-grid-scrolled-edge-top") && (u.removeClass("mm-av-grid-scrolled-edge-top"),
                                f.removeClass("mm-av-grid-scrolled-edge-left"))),
                                o < t ? (e.css({
                                    left: n + t - o
                                }),
                                    s = f.first(),
                                    s.css({
                                        left: 0
                                    }),
                                    f.css({
                                        left: t - s.offset().left - 1
                                    }),
                                u.hasClass("mm-av-grid-scrolled-edge-bottom") || (u.addClass("mm-av-grid-scrolled-edge-bottom"),
                                    f.addClass("mm-av-grid-scrolled-edge-right"))) : u.hasClass("mm-av-grid-scrolled-edge-bottom") && (f.css({
                                    left: 0
                                }),
                                    u.removeClass("mm-av-grid-scrolled-edge-bottom"),
                                    f.removeClass("mm-av-grid-scrolled-edge-right"))
                        }
                    })
            }
            ,
            this.HorizontalScrollerHide = function () {
                $("#avail-grid-view-scroll-horizontal-container").hide(),
                    $("#avail-grid-view-scroll-horizontal-detector").hide()
            }
            ,
            this.VariablesSet = function () {
                var n = this;
                n.NavBot = $(document).scrollTop() + $("#cpo-nav-bar").outerHeight(!1),
                $("#cpo-nav-bar").position() && (n.NavBot = n.NavBot + $("#cpo-nav-bar").position().top),
                    n.TopRowBot = n.NavBot + $("#avail-grid-toprow").outerHeight(!0),
                    n.Row1Bot = n.TopRowBot + $(".avail-grid-axis-vert").first().outerHeight(!0)
            }
            ,
            this.Busy = !0,
            this.HrzntlCanScroll = !1,

            $("#avail-grid-view-scroll-horizontal-bar").mousedown({
                Scroller: this
            }, function (n) {
                var t = n.data.Scroller;
                t.Busy || (t.Busy = !0,
                    t.HrzntlCrsrDiff = n.pageX - $("#avail-grid-view-scroll-horizontal-bar").offset().left,
                    t.HrzntlCanScroll = !0,
                    $("#avail-grid-view-scroll-horizontal-detector").show(),
                    $("#avail-grid-view-scroll-horizontal-detector").offset({
                        top: -10,
                        left: -10
                    }),
                    $("#avail-grid-view-scroll-horizontal-detector").width($(document).width() + 20),
                    $("#avail-grid-view-scroll-horizontal-detector").height($(document).height() + 20),
                    t.Busy = !1)
            }),
            $(document).mouseup({
                Scroller: this
            }, function (n) {
                n.data.Scroller.HrzntlCanScroll = !1,
                    $("#avail-grid-view-scroll-horizontal-detector").hide()
            }),
            $("#avail-grid-view-scroll-horizontal-bar, #avail-grid-view-scroll-horizontal-detector").mouseup({
                Scroller: this
            }, function (n) {
                n.data.Scroller.HrzntlCanScroll = !1,
                    $("#avail-grid-view-scroll-horizontal-detector").hide()
            }),
            $("#avail-grid-view-scroll-horizontal-detector").mousemove({
                Scroller: this
            }, function (n) {
                var t = n.data.Scroller, f;
                if (!t.Busy) {
                    if (t.Busy = !0,
                        t.HrzntlCanScroll) {
                        var i = $("#avail-grid-view-scroll-horizontal-bar")
                            , u = i.parent().width() - i.width()
                            , r = Math.min(Math.max(0, n.pageX - t.HrzntlCrsrDiff - i.parent().offset().left), u);
                        i.css({
                            left: r,
                            position: "relative"
                        }),
                            f = 0 + ($("#avail-grid-toprow-inner").offset().left + $("#avail-grid-toprow-inner").outerWidth(!1)) - ($("#avail-grid-view-container").offset().left + $("#avail-grid-view-container").width()),
                            r = -1 * Math.round(r * f / u),
                            t.HorizontalScrollSet(r)
                    }
                    t.Busy = !1
                }
            })
    }
}