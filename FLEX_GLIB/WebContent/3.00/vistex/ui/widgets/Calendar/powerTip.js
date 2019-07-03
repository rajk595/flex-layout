/*!
 PowerTip v1.3.0 (2017-01-15)
 https://stevenbenner.github.io/jquery-powertip/
 Copyright (c) 2017 Steven Benner (http://stevenbenner.com/).
 Released under MIT license.
 https://raw.github.com/stevenbenner/jquery-powertip/master/LICENSE.txt
*/
! function(e, t) {
    "function" == typeof define && define.amd ? define(["jquery"], t) : "object" == typeof module && module.exports ? module.exports = t(require("jquery")) : t(e.jQuery)
}(this, function(e) {
    var t = e(document),
        o = e(window),
        n = e("body"),
        i = "displayController",
        s = "hasActiveHover",
        r = "forcedOpen",
        a = "hasMouseMove",
        l = "mouseOnToPopup",
        c = "originalTitle",
        u = "powertip",
        p = "powertipjq",
        f = "powertiptarget",
        w = ".powertip",
        d = 180 / Math.PI,
        h = {
            elements: null,
            tooltips: null,
            isTipOpen: !1,
            isFixedTipOpen: !1,
            isClosing: !1,
            tipOpenImminent: !1,
            activeHover: null,
            currentX: 0,
            currentY: 0,
            previousX: 0,
            previousY: 0,
            desyncTimeout: null,
            closeDelayTimeout: null,
            mouseTrackingActive: !1,
            delayInProgress: !1,
            windowWidth: 0,
            windowHeight: 0,
            scrollTop: 0,
            scrollLeft: 0
        },
        v = {
            none: 0,
            top: 1,
            bottom: 2,
            left: 4,
            right: 8
        };

    function m() {
        var t = this;
        t.top = "auto", t.left = "auto", t.right = "auto", t.bottom = "auto", t.set = function(o, n) {
            e.isNumeric(n) && (t[o] = Math.round(n))
        }
    }

    function T(e) {
        return Boolean(e && "number" == typeof e.pageX)
    }

    function g() {
        h.scrollLeft = o.scrollLeft(), h.scrollTop = o.scrollTop(), h.windowWidth = o.width(), h.windowHeight = o.height()
    }

    function y() {
        h.windowWidth = o.width(), h.windowHeight = o.height()
    }

    function b() {
        var e = o.scrollLeft(),
            t = o.scrollTop();
        e !== h.scrollLeft && (h.currentX += e - h.scrollLeft, h.scrollLeft = e), t !== h.scrollTop && (h.currentY += t - h.scrollTop, h.scrollTop = t)
    }

    function H(e) {
        h.currentX = e.pageX, h.currentY = e.pageY
    }

    function k(e) {
        var t = e.offset(),
            o = e[0].getBoundingClientRect(),
            n = o.right - o.left,
            i = o.bottom - o.top;
        return h.currentX >= t.left && h.currentX <= t.left + n && h.currentY >= t.top && h.currentY <= t.top + i
    }

    function P(e, t, o) {
        var n = h.scrollTop,
            i = h.scrollLeft,
            s = n + h.windowHeight,
            r = i + h.windowWidth,
            a = v.none;
        return (e.top < n || Math.abs(e.bottom - h.windowHeight) - o < n) && (a |= v.top), (e.top + o > s || Math.abs(e.bottom - h.windowHeight) > s) && (a |= v.bottom), (e.left < i || e.right + t > r) && (a |= v.left), (e.left + t > r || e.right < i) &&
            (a |= v.right), a
    }
    return e.fn.powerTip = function(O, I) {
        var x, X, C = this;
        return C.length ? "string" === e.type(O) && e.powerTip[O] ? e.powerTip[O].call(C, C, I) : (x = e.extend({}, e.fn.powerTip.defaults, O), X = new function(c) {
            var T = new function() {
                    this.compute = function(e, t, o, n, i) {
                        var s, r = t.split("-")[0],
                            a = new m;
                        s = function(e) {
                            return Boolean(window.SVGElement && e[0] instanceof SVGElement)
                        }(e) ? function(e, t) {
                            var o, n, i, s, r = e.closest("svg")[0],
                                a = e[0],
                                l = r.createSVGPoint(),
                                c = a.getBBox(),
                                u = a.getScreenCTM(),
                                p = c.width / 2,
                                f = c.height / 2,
                                w = [],
                                v = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

                            function m() {
                                w.push(l.matrixTransform(u))
                            }
                            if (l.x = c.x, l.y = c.y, m(), l.x += p, m(), l.x += p, m(), l.y += f, m(), l.y += f, m(), l.x -= p, m(), l.x -= p, m(), l.y -= f, m(), w[0].y !== w[1].y || w[0].x !== w[7].x)
                                for (n = Math.atan2(u.b, u.a) * d, (i = Math.ceil((n % 360 - 22.5) / 45)) < 1 && (i += 8); i--;) v.push(v.shift());
                            for (s = 0; s < w.length; s++)
                                if (v[s] === t) {
                                    o = w[s];
                                    break
                                }
                            return {
                                top: o.y + h.scrollTop,
                                left: o.x + h.scrollLeft
                            }
                        }(e, r) : function(e, t) {
                            var o, n, i = e.offset(),
                                s = e.outerWidth(),
                                r = e.outerHeight();
                            switch (t) {
                                case "n":
                                    o = i.left + s / 2, n = i.top;
                                    break;
                                case "e":
                                    o = i.left + s, n = i.top + r / 2;
                                    break;
                                case "s":
                                    o = i.left + s / 2, n = i.top + r;
                                    break;
                                case "w":
                                    o = i.left, n = i.top + r / 2;
                                    break;
                                case "nw":
                                    o = i.left, n = i.top;
                                    break;
                                case "ne":
                                    o = i.left + s, n = i.top;
                                    break;
                                case "sw":
                                    o = i.left, n = i.top + r;
                                    break;
                                case "se":
                                    o = i.left + s, n = i.top + r
                            }
                            return {
                                top: n,
                                left: o
                            }
                        }(e, r);
                        switch (t) {
                            case "n":
                                a.set("left", s.left - o / 2), a.set("bottom", h.windowHeight - s.top + i);
                                break;
                            case "e":
                                a.set("left", s.left + i), a.set("top", s.top - n / 2);
                                break;
                            case "s":
                                a.set("left", s.left - o / 2), a.set("top", s.top + i);
                                break;
                            case "w":
                                a.set("top", s.top - n / 2), a.set("right", h.windowWidth - s.left + i);
                                break;
                            case "nw":
                                a.set("bottom", h.windowHeight - s.top + i), a.set("right", h.windowWidth - s.left - 20);
                                break;
                            case "nw-alt":
                                a.set("left", s.left), a.set("bottom", h.windowHeight - s.top + i);
                                break;
                            case "ne":
                                a.set("left", s.left - 20), a.set("bottom", h.windowHeight - s.top + i);
                                break;
                            case "ne-alt":
                                a.set("bottom", h.windowHeight - s.top + i), a.set("right", h.windowWidth - s.left);
                                break;
                            case "sw":
                                a.set("top", s.top + i), a.set("right", h.windowWidth - s.left - 20);
                                break;
                            case "sw-alt":
                                a.set("left", s.left), a.set("top", s.top + i);
                                break;
                            case "se":
                                a.set("left", s.left - 20), a.set("top", s.top + i);
                                break;
                            case "se-alt":
                                a.set("top", s.top + i), a.set("right", h.windowWidth - s.left)
                        }
                        return a
                    }
                },
                g = e("#" + c.popupId);
            0 === g.length && (g = e("<div/>", {
                id: c.popupId
            }), 0 === n.length && (n = e("body")), n.append(g), h.tooltips = h.tooltips ? h.tooltips.add(g) : g);
            c.followMouse && (g.data(a) || (t.on("mousemove" + w, H), o.on("scroll" + w, H), g.data(a, !0)));

            function y(o) {
                var n;
                if (o.data(s)) {
                    if (h.isTipOpen) return h.isClosing || b(h.activeHover), void g.delay(100).queue(function(e) {
                        y(o), e()
                    });
                    o.trigger("powerTipPreRender"), (n = function(t) {
                        var o, n, i = t.data(u),
                            s = t.data(p),
                            r = t.data(f);
                        i ? (e.isFunction(i) && (i = i.call(t[0])), n = i) : s ? (e.isFunction(s) && (s = s.call(t[0])), s.length > 0 && (n = s.clone(!0, !0))) : r && (o = e("#" + r)).length > 0 && (n = o.html());
                        return n
                    }(o)) && (g.empty().append(n), o.trigger("powerTipRender"), h.activeHover = o, h.isTipOpen = !0, g.data(l, c.mouseOnToPopup), c.followMouse ? H() : (O(o), h.isFixedTipOpen = !0), g.addClass(c.popupClass), o.data(r) || t.on("click" +
                        w,
                        function(t) {
                            var n = t.target;
                            n !== o[0] && (c.mouseOnToPopup && (n === g[0] || e.contains(g[0], n)) || e.powerTip.hide())
                        }), c.mouseOnToPopup && !c.manual && (g.on("mouseenter" + w, function() {
                        h.activeHover && h.activeHover.data(i).cancel()
                    }), g.on("mouseleave" + w, function() {
                        h.activeHover && h.activeHover.data(i).hide()
                    })), g.fadeIn(c.fadeInTime, function() {
                        h.desyncTimeout || (h.desyncTimeout = setInterval(x, 500)), o.trigger("powerTipOpen")
                    }))
                }
            }

            function b(e) {
                h.isClosing = !0, h.isTipOpen = !1, h.desyncTimeout = clearInterval(h.desyncTimeout), e.data(s, !1), e.data(r, !1), t.off("click" + w), g.off(w), g.fadeOut(c.fadeOutTime, function() {
                    var t = new m;
                    h.activeHover = null, h.isClosing = !1, h.isFixedTipOpen = !1, g.removeClass(), t.set("top", h.currentY + c.offset), t.set("left", h.currentX + c.offset), g.css(t), e.trigger("powerTipClose")
                })
            }

            function H() {
                if (!h.isFixedTipOpen && (h.isTipOpen || h.tipOpenImminent && g.data(a))) {
                    var e, t = g.outerWidth(),
                        o = g.outerHeight(),
                        n = new m;
                    n.set("top", h.currentY + c.offset), n.set("left", h.currentX + c.offset), (e = P(n, t, o)) !== v.none && (1 === function(e) {
                        var t = 0;
                        for (; e;) e &= e - 1, t++;
                        return t
                    }(e) ? e === v.right ? n.set("left", h.windowWidth - t) : e === v.bottom && n.set("top", h.scrollTop + h.windowHeight - o) : (n.set("left", h.currentX - t - c.offset), n.set("top", h.currentY - o - c.offset))), g.css(n)
                }
            }

            function O(t) {
                var o, n;
                c.smartPlacement ? (o = e.fn.powerTip.smartPlacementLists[c.placement], e.each(o, function(e, o) {
                    var i = P(I(t, o), g.outerWidth(), g.outerHeight());
                    if (n = o, i === v.none) return !1
                })) : (I(t, c.placement), n = c.placement), g.removeClass("w nw sw e ne se n s w se-alt sw-alt ne-alt nw-alt"), g.addClass(n)
            }

            function I(e, t) {
                var o, n, i = 0,
                    s = new m;
                s.set("top", 0), s.set("left", 0), g.css(s);
                do {
                    o = g.outerWidth(), n = g.outerHeight(), s = T.compute(e, t, o, n, c.offset), g.css(s)
                } while (++i <= 5 && (o !== g.outerWidth() || n !== g.outerHeight()));
                return s
            }

            function x() {
                var t = !1;
                h.isTipOpen && !h.isClosing && !h.delayInProgress && (e.inArray("mouseleave", c.closeEvents) > -1 || e.inArray("mouseout", c.closeEvents) > -1 || e.inArray("blur", c.closeEvents) > -1 || e.inArray("focusout", c.closeEvents) > -1) && (!1 ===
                    h.activeHover.data(s) || h.activeHover.is(":disabled") ? t = !0 : k(h.activeHover) || h.activeHover.is(":focus") || h.activeHover.data(r) || g.data(l) && k(g) || (t = !0), t && b(h.activeHover))
            }
            this.showTip = function(e) {
                e.data(s, !0), g.queue(function(t) {
                    y(e), t()
                })
            }, this.hideTip = b, this.resetPosition = O
        }(x), h.mouseTrackingActive || (h.mouseTrackingActive = !0, g(), e(g), t.on("mousemove" + w, H), o.on("resize" + w, y), o.on("scroll" + w, b)), C.each(function() {
            var t, o = e(this),
                n = o.data(u),
                a = o.data(p),
                l = o.data(f);
            o.data(i) && e.powerTip.destroy(o), t = o.data("title"), n || l || a || !t || (o.data(u, t), o.data(c, t), o.removeData("title")), o.data(i, new function(e, t, o) {
                var n = null,
                    a = null;

                function l(i, a) {
                    c(), e.data(s) ? u() : i ? (a && e.data(r, !0), p(), o.showTip(e)) : (h.tipOpenImminent = !0, n = setTimeout(function() {
                        var i, s;
                        n = null, i = Math.abs(h.previousX - h.currentX), s = Math.abs(h.previousY - h.currentY), i + s < t.intentSensitivity ? (u(), p(), o.showTip(e)) : (h.previousX = h.currentX, h.previousY = h.currentY, l())
                    }, t.intentPollInterval))
                }

                function c(e) {
                    n = clearTimeout(n), (h.closeDelayTimeout && a === h.closeDelayTimeout || e) && u()
                }

                function u() {
                    h.closeDelayTimeout = clearTimeout(h.closeDelayTimeout), h.delayInProgress = !1
                }

                function p() {
                    h.delayInProgress && h.activeHover && !h.activeHover.is(e) && h.activeHover.data(i).hide(!0)
                }
                this.show = l, this.hide = function(n) {
                    a && (a = h.closeDelayTimeout = clearTimeout(a), h.delayInProgress = !1);
                    c(), h.tipOpenImminent = !1, e.data(s) && (e.data(r, !1), n ? o.hideTip(e) : (h.delayInProgress = !0, h.closeDelayTimeout = setTimeout(function() {
                        h.closeDelayTimeout = null, o.hideTip(e), h.delayInProgress = !1, a = null
                    }, t.closeDelay), a = h.closeDelayTimeout))
                }, this.cancel = c, this.resetPosition = function() {
                    o.resetPosition(e)
                }
            }(o, x, X))
        }), x.manual || (e.each(x.openEvents, function(t, o) {
            e.inArray(o, x.closeEvents) > -1 ? C.on(o + w, function(t) {
                e.powerTip.toggle(this, t)
            }) : C.on(o + w, function(t) {
                e.powerTip.show(this, t)
            })
        }), e.each(x.closeEvents, function(t, o) {
            e.inArray(o, x.openEvents) < 0 && C.on(o + w, function(t) {
                e.powerTip.hide(this, !T(t))
            })
        }), C.on("keydown" + w, function(t) {
            27 === t.keyCode && e.powerTip.hide(this, !0)
        })), h.elements = h.elements ? h.elements.add(C) : C, C) : C
    }, e.fn.powerTip.defaults = {
        fadeInTime: 200,
        fadeOutTime: 100,
        followMouse: !1,
        popupId: "powerTip",
        popupClass: null,
        intentSensitivity: 7,
        intentPollInterval: 100,
        closeDelay: 100,
        placement: "n",
        smartPlacement: !1,
        offset: 10,
        mouseOnToPopup: !1,
        manual: !1,
        openEvents: ["mouseenter", "focus"],
        closeEvents: ["mouseleave", "blur"]
    }, e.fn.powerTip.smartPlacementLists = {
        n: ["n", "ne", "nw", "s"],
        e: ["e", "ne", "se", "w", "nw", "sw", "n", "s", "e"],
        s: ["s", "se", "sw", "n"],
        w: ["w", "nw", "sw", "e", "ne", "se", "n", "s", "w"],
        nw: ["nw", "w", "sw", "n", "s", "se", "nw"],
        ne: ["ne", "e", "se", "n", "s", "sw", "ne"],
        sw: ["sw", "w", "nw", "s", "n", "ne", "sw"],
        se: ["se", "e", "ne", "s", "n", "nw", "se"],
        "nw-alt": ["nw-alt", "n", "ne-alt", "sw-alt", "s", "se-alt", "w", "e"],
        "ne-alt": ["ne-alt", "n", "nw-alt", "se-alt", "s", "sw-alt", "e", "w"],
        "sw-alt": ["sw-alt", "s", "se-alt", "nw-alt", "n", "ne-alt", "w", "e"],
        "se-alt": ["se-alt", "s", "sw-alt", "ne-alt", "n", "nw-alt", "e", "w"]
    }, e.powerTip = {
        show: function(t, o) {
            return T(o) ? (H(o), h.previousX = o.pageX, h.previousY = o.pageY, e(t).data(i).show()) : e(t).first().data(i).show(!0, !0), t
        },
        reposition: function(t) {
            return e(t).first().data(i).resetPosition(), t
        },
        hide: function(t, o) {
            var n;
            return o = !t || o, t ? n = e(t).first().data(i) : h.activeHover && (n = h.activeHover.data(i)), n && n.hide(o), t
        },
        toggle: function(t, o) {
            return h.activeHover && h.activeHover.is(t) ? e.powerTip.hide(t, !T(o)) : e.powerTip.show(t, o), t
        },
        destroy: function(n) {
            var a = n ? e(n) : h.elements;
            return h.elements && 0 !== h.elements.length ? (a.off(w).each(function() {
                var t = e(this),
                    o = [c, i, s, r];
                t.data(c) && (t.data("title", t.data(c)), o.push(u)), t.removeData(o)
            }), h.elements = h.elements.not(a), 0 === h.elements.length && (o.off(w), t.off(w), h.mouseTrackingActive = !1, h.tooltips.remove(), h.tooltips = null), n) : n
        }
    }, e.powerTip.showTip = e.powerTip.show, e.powerTip.closeTip = e.powerTip.hide, e.powerTip
});
