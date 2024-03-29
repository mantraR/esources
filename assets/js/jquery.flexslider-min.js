/*
 * jQuery FlexSlider v2.2.2
 * Copyright 2012 WooThemes
 * Contributing Author: Tyler Smith
 */
(function (d) {
  d.flexslider = function (g, l) {
    var a = d(g);
    a.vars = d.extend({}, d.flexslider.defaults, l);
    var e = a.vars.namespace,
      v =
        window.navigator &&
        window.navigator.msPointerEnabled &&
        window.MSGesture,
      t =
        ("ontouchstart" in window ||
          v ||
          (window.DocumentTouch && document instanceof DocumentTouch)) &&
        a.vars.touch,
      m = "",
      u,
      p = "vertical" === a.vars.direction,
      n = a.vars.reverse,
      h = 0 < a.vars.itemWidth,
      r = "fade" === a.vars.animation,
      q = "" !== a.vars.asNavFor,
      c = {};
    d.data(g, "flexslider", a);
    c = {
      init: function () {
        a.animating = !1;
        a.currentSlide = parseInt(a.vars.startAt ? a.vars.startAt : 0, 10);
        isNaN(a.currentSlide) && (a.currentSlide = 0);
        a.animatingTo = a.currentSlide;
        a.atEnd = 0 === a.currentSlide || a.currentSlide === a.last;
        a.containerSelector = a.vars.selector.substr(
          0,
          a.vars.selector.search(" ")
        );
        a.slides = d(a.vars.selector, a);
        a.container = d(a.containerSelector, a);
        a.count = a.slides.length;
        a.syncExists = 0 < d(a.vars.sync).length;
        "slide" === a.vars.animation && (a.vars.animation = "swing");
        a.prop = p ? "top" : "marginLeft";
        a.args = {};
        a.manualPause = !1;
        a.stopped = !1;
        a.started = !1;
        a.startTimeout = null;
        a.transitions =
          !a.vars.video &&
          !r &&
          a.vars.useCSS &&
          (function () {
            var b = document.createElement("div"),
              f = [
                "perspectiveProperty",
                "WebkitPerspective",
                "MozPerspective",
                "OPerspective",
                "msPerspective",
              ],
              k;
            for (k in f)
              if (void 0 !== b.style[f[k]])
                return (
                  (a.pfx = f[k].replace("Perspective", "").toLowerCase()),
                  (a.prop = "-" + a.pfx + "-transform"),
                  !0
                );
            return !1;
          })();
        "" !== a.vars.controlsContainer &&
          (a.controlsContainer =
            0 < d(a.vars.controlsContainer).length &&
            d(a.vars.controlsContainer));
        "" !== a.vars.manualControls &&
          (a.manualControls =
            0 < d(a.vars.manualControls).length && d(a.vars.manualControls));
        a.vars.randomize &&
          (a.slides.sort(function () {
            return Math.round(Math.random()) - 0.5;
          }),
          a.container.empty().append(a.slides));
        a.doMath();
        a.setup("init");
        a.vars.controlNav && c.controlNav.setup();
        a.vars.directionNav && c.directionNav.setup();
        a.vars.keyboard &&
          (1 === d(a.containerSelector).length || a.vars.multipleKeyboard) &&
          d(document).bind("keyup", function (b) {
            b = b.keyCode;
            a.animating ||
              (39 !== b && 37 !== b) ||
              ((b =
                39 === b
                  ? a.getTarget("next")
                  : 37 === b
                  ? a.getTarget("prev")
                  : !1),
              a.flexAnimate(b, a.vars.pauseOnAction));
          });
        a.vars.mousewheel &&
          a.bind("mousewheel", function (b, f, k, d) {
            b.preventDefault();
            b = 0 > f ? a.getTarget("next") : a.getTarget("prev");
            a.flexAnimate(b, a.vars.pauseOnAction);
          });
        a.vars.pausePlay && c.pausePlay.setup();
        a.vars.slideshow && a.vars.pauseInvisible && c.pauseInvisible.init();
        a.vars.slideshow &&
          (a.vars.pauseOnHover &&
            a.hover(
              function () {
                a.manualPlay || a.manualPause || a.pause();
              },
              function () {
                a.manualPause || a.manualPlay || a.stopped || a.play();
              }
            ),
          (a.vars.pauseInvisible && c.pauseInvisible.isHidden()) ||
            (0 < a.vars.initDelay
              ? (a.startTimeout = setTimeout(a.play, a.vars.initDelay))
              : a.play()));
        q && c.asNav.setup();
        t && a.vars.touch && c.touch();
        (!r || (r && a.vars.smoothHeight)) &&
          d(window).bind("resize orientationchange focus", c.resize);
        a.find("img").attr("draggable", "false");
        setTimeout(function () {
          a.vars.start(a);
        }, 200);
      },
      asNav: {
        setup: function () {
          a.asNav = !0;
          a.animatingTo = Math.floor(a.currentSlide / a.move);
          a.currentItem = a.currentSlide;
          a.slides
            .removeClass(e + "active-slide")
            .eq(a.currentItem)
            .addClass(e + "active-slide");
          if (v)
            (g._slider = a),
              a.slides.each(function () {
                this._gesture = new MSGesture();
                this._gesture.target = this;
                this.addEventListener(
                  "MSPointerDown",
                  function (a) {
                    a.preventDefault();
                    a.currentTarget._gesture &&
                      a.currentTarget._gesture.addPointer(a.pointerId);
                  },
                  !1
                );
                this.addEventListener("MSGestureTap", function (b) {
                  b.preventDefault();
                  b = d(this);
                  var f = b.index();
                  d(a.vars.asNavFor).data("flexslider").animating ||
                    b.hasClass("active") ||
                    ((a.direction = a.currentItem < f ? "next" : "prev"),
                    a.flexAnimate(f, a.vars.pauseOnAction, !1, !0, !0));
                });
              });
          else
            a.slides.on("click touchend MSPointerUp", function (b) {
              b.preventDefault();
              b = d(this);
              var f = b.index();
              0 >= b.offset().left - d(a).scrollLeft() &&
              b.hasClass(e + "active-slide")
                ? a.flexAnimate(a.getTarget("prev"), !0)
                : d(a.vars.asNavFor).data("flexslider").animating ||
                  b.hasClass(e + "active-slide") ||
                  ((a.direction = a.currentItem < f ? "next" : "prev"),
                  a.flexAnimate(f, a.vars.pauseOnAction, !1, !0, !0));
            });
        },
      },
      controlNav: {
        setup: function () {
          a.manualControls
            ? c.controlNav.setupManual()
            : c.controlNav.setupPaging();
        },
        setupPaging: function () {
          var b = 1,
            f,
            k;
          a.controlNavScaffold = d(
            '<ol class="' +
              e +
              "control-nav " +
              e +
              ("thumbnails" === a.vars.controlNav
                ? "control-thumbs"
                : "control-paging") +
              '"></ol>'
          );
          if (1 < a.pagingCount)
            for (var g = 0; g < a.pagingCount; g++)
              (k = a.slides.eq(g)),
                (f =
                  "thumbnails" === a.vars.controlNav
                    ? '<img src="' + k.attr("data-thumb") + '"/>'
                    : "<a>" + b + "</a>"),
                "thumbnails" === a.vars.controlNav &&
                  !0 === a.vars.thumbCaptions &&
                  ((k = k.attr("data-thumbcaption")),
                  "" != k &&
                    void 0 != k &&
                    (f += '<span class="' + e + 'caption">' + k + "</span>")),
                a.controlNavScaffold.append("<li>" + f + "</li>"),
                b++;
          a.controlsContainer
            ? d(a.controlsContainer).append(a.controlNavScaffold)
            : a.append(a.controlNavScaffold);
          c.controlNav.set();
          c.controlNav.active();
          a.controlNavScaffold.delegate(
            "a, img",
            "click touchend MSPointerUp",
            function (b) {
              b.preventDefault();
              if ("" === m || m === b.type) {
                var f = d(this),
                  k = a.controlNav.index(f);
                f.hasClass(e + "active") ||
                  ((a.direction = k > a.currentSlide ? "next" : "prev"),
                  a.flexAnimate(k, a.vars.pauseOnAction));
              }
              "" === m && (m = b.type);
              c.setToClearWatchedEvent();
            }
          );
        },
        setupManual: function () {
          a.controlNav = a.manualControls;
          c.controlNav.active();
          a.controlNav.bind("click touchend MSPointerUp", function (b) {
            b.preventDefault();
            if ("" === m || m === b.type) {
              var f = d(this),
                k = a.controlNav.index(f);
              f.hasClass(e + "active") ||
                (k > a.currentSlide
                  ? (a.direction = "next")
                  : (a.direction = "prev"),
                a.flexAnimate(k, a.vars.pauseOnAction));
            }
            "" === m && (m = b.type);
            c.setToClearWatchedEvent();
          });
        },
        set: function () {
          a.controlNav = d(
            "." +
              e +
              "control-nav li " +
              ("thumbnails" === a.vars.controlNav ? "img" : "a"),
            a.controlsContainer ? a.controlsContainer : a
          );
        },
        active: function () {
          a.controlNav
            .removeClass(e + "active")
            .eq(a.animatingTo)
            .addClass(e + "active");
        },
        update: function (b, f) {
          1 < a.pagingCount && "add" === b
            ? a.controlNavScaffold.append(d("<li><a>" + a.count + "</a></li>"))
            : 1 === a.pagingCount
            ? a.controlNavScaffold.find("li").remove()
            : a.controlNav.eq(f).closest("li").remove();
          c.controlNav.set();
          1 < a.pagingCount && a.pagingCount !== a.controlNav.length
            ? a.update(f, b)
            : c.controlNav.active();
        },
      },
      directionNav: {
        setup: function () {
          var b = d(
            '<ul class="' +
              e +
              'direction-nav"><li><a class="' +
              e +
              'prev" href="#">' +
              a.vars.prevText +
              '</a></li><li><a class="' +
              e +
              'next" href="#">' +
              a.vars.nextText +
              "</a></li></ul>"
          );
          a.controlsContainer
            ? (d(a.controlsContainer).append(b),
              (a.directionNav = d(
                "." + e + "direction-nav li a",
                a.controlsContainer
              )))
            : (a.append(b),
              (a.directionNav = d("." + e + "direction-nav li a", a)));
          c.directionNav.update();
          a.directionNav.bind("click touchend MSPointerUp", function (b) {
            b.preventDefault();
            var k;
            if ("" === m || m === b.type)
              (k = d(this).hasClass(e + "next")
                ? a.getTarget("next")
                : a.getTarget("prev")),
                a.flexAnimate(k, a.vars.pauseOnAction);
            "" === m && (m = b.type);
            c.setToClearWatchedEvent();
          });
        },
        update: function () {
          var b = e + "disabled";
          1 === a.pagingCount
            ? a.directionNav.addClass(b).attr("tabindex", "-1")
            : a.vars.animationLoop
            ? a.directionNav.removeClass(b).removeAttr("tabindex")
            : 0 === a.animatingTo
            ? a.directionNav
                .removeClass(b)
                .filter("." + e + "prev")
                .addClass(b)
                .attr("tabindex", "-1")
            : a.animatingTo === a.last
            ? a.directionNav
                .removeClass(b)
                .filter("." + e + "next")
                .addClass(b)
                .attr("tabindex", "-1")
            : a.directionNav.removeClass(b).removeAttr("tabindex");
        },
      },
      pausePlay: {
        setup: function () {
          var b = d('<div class="' + e + 'pauseplay"><a></a></div>');
          a.controlsContainer
            ? (a.controlsContainer.append(b),
              (a.pausePlay = d("." + e + "pauseplay a", a.controlsContainer)))
            : (a.append(b), (a.pausePlay = d("." + e + "pauseplay a", a)));
          c.pausePlay.update(a.vars.slideshow ? e + "pause" : e + "play");
          a.pausePlay.bind("click touchend MSPointerUp", function (b) {
            b.preventDefault();
            if ("" === m || m === b.type)
              d(this).hasClass(e + "pause")
                ? ((a.manualPause = !0), (a.manualPlay = !1), a.pause())
                : ((a.manualPause = !1), (a.manualPlay = !0), a.play());
            "" === m && (m = b.type);
            c.setToClearWatchedEvent();
          });
        },
        update: function (b) {
          "play" === b
            ? a.pausePlay
                .removeClass(e + "pause")
                .addClass(e + "play")
                .html(a.vars.playText)
            : a.pausePlay
                .removeClass(e + "play")
                .addClass(e + "pause")
                .html(a.vars.pauseText);
        },
      },
      touch: function () {
        var b,
          f,
          k,
          d,
          c,
          e,
          m = !1,
          l = 0,
          q = 0,
          s = 0;
        if (v) {
          g.style.msTouchAction = "none";
          g._gesture = new MSGesture();
          g._gesture.target = g;
          g.addEventListener("MSPointerDown", t, !1);
          g._slider = a;
          g.addEventListener("MSGestureChange", u, !1);
          g.addEventListener("MSGestureEnd", y, !1);
          var t = function (b) {
              b.stopPropagation();
              a.animating
                ? b.preventDefault()
                : (a.pause(),
                  g._gesture.addPointer(b.pointerId),
                  (s = 0),
                  (d = p ? a.h : a.w),
                  (e = Number(new Date())),
                  (k =
                    h && n && a.animatingTo === a.last
                      ? 0
                      : h && n
                      ? a.limit -
                        (a.itemW + a.vars.itemMargin) * a.move * a.animatingTo
                      : h && a.currentSlide === a.last
                      ? a.limit
                      : h
                      ? (a.itemW + a.vars.itemMargin) * a.move * a.currentSlide
                      : n
                      ? (a.last - a.currentSlide + a.cloneOffset) * d
                      : (a.currentSlide + a.cloneOffset) * d));
            },
            u = function (a) {
              a.stopPropagation();
              var b = a.target._slider;
              if (b) {
                var f = -a.translationX,
                  h = -a.translationY;
                c = s += p ? h : f;
                m = p ? Math.abs(s) < Math.abs(-f) : Math.abs(s) < Math.abs(-h);
                if (a.detail === a.MSGESTURE_FLAG_INERTIA)
                  setImmediate(function () {
                    g._gesture.stop();
                  });
                else if (!m || 500 < Number(new Date()) - e)
                  a.preventDefault(),
                    !r &&
                      b.transitions &&
                      (b.vars.animationLoop ||
                        (c =
                          s /
                          ((0 === b.currentSlide && 0 > s) ||
                          (b.currentSlide === b.last && 0 < s)
                            ? Math.abs(s) / d + 2
                            : 1)),
                      b.setProps(k + c, "setTouch"));
              }
            },
            y = function (a) {
              a.stopPropagation();
              if ((a = a.target._slider)) {
                if (a.animatingTo === a.currentSlide && !m && null !== c) {
                  var g = n ? -c : c,
                    h = 0 < g ? a.getTarget("next") : a.getTarget("prev");
                  a.canAdvance(h) &&
                  ((550 > Number(new Date()) - e && 50 < Math.abs(g)) ||
                    Math.abs(g) > d / 2)
                    ? a.flexAnimate(h, a.vars.pauseOnAction)
                    : r ||
                      a.flexAnimate(a.currentSlide, a.vars.pauseOnAction, !0);
                }
                k = c = f = b = null;
                s = 0;
              }
            };
        } else {
          g.addEventListener("touchstart", z, !1);
          var z = function (c) {
              if (a.animating) c.preventDefault();
              else if (
                window.navigator.msPointerEnabled ||
                1 === c.touches.length
              )
                a.pause(),
                  (d = p ? a.h : a.w),
                  (e = Number(new Date())),
                  (l = c.touches[0].pageX),
                  (q = c.touches[0].pageY),
                  (k =
                    h && n && a.animatingTo === a.last
                      ? 0
                      : h && n
                      ? a.limit -
                        (a.itemW + a.vars.itemMargin) * a.move * a.animatingTo
                      : h && a.currentSlide === a.last
                      ? a.limit
                      : h
                      ? (a.itemW + a.vars.itemMargin) * a.move * a.currentSlide
                      : n
                      ? (a.last - a.currentSlide + a.cloneOffset) * d
                      : (a.currentSlide + a.cloneOffset) * d),
                  (b = p ? q : l),
                  (f = p ? l : q),
                  g.addEventListener("touchmove", w, !1),
                  g.addEventListener("touchend", x, !1);
            },
            w = function (g) {
              l = g.touches[0].pageX;
              q = g.touches[0].pageY;
              c = p ? b - q : b - l;
              m = p
                ? Math.abs(c) < Math.abs(l - f)
                : Math.abs(c) < Math.abs(q - f);
              if (!m || 500 < Number(new Date()) - e)
                g.preventDefault(),
                  !r &&
                    a.transitions &&
                    (a.vars.animationLoop ||
                      (c /=
                        (0 === a.currentSlide && 0 > c) ||
                        (a.currentSlide === a.last && 0 < c)
                          ? Math.abs(c) / d + 2
                          : 1),
                    a.setProps(k + c, "setTouch"));
            },
            x = function (h) {
              g.removeEventListener("touchmove", w, !1);
              if (a.animatingTo === a.currentSlide && !m && null !== c) {
                h = n ? -c : c;
                var l = 0 < h ? a.getTarget("next") : a.getTarget("prev");
                a.canAdvance(l) &&
                ((550 > Number(new Date()) - e && 50 < Math.abs(h)) ||
                  Math.abs(h) > d / 2)
                  ? a.flexAnimate(l, a.vars.pauseOnAction)
                  : r ||
                    a.flexAnimate(a.currentSlide, a.vars.pauseOnAction, !0);
              }
              g.removeEventListener("touchend", x, !1);
              k = c = f = b = null;
            };
        }
      },
      resize: function () {
        !a.animating &&
          a.is(":visible") &&
          (h || a.doMath(),
          r
            ? c.smoothHeight()
            : h
            ? (a.slides.width(a.computedW),
              a.update(a.pagingCount),
              a.setProps())
            : p
            ? (a.viewport.height(a.h), a.setProps(a.h, "setTotal"))
            : (a.vars.smoothHeight && c.smoothHeight(),
              a.newSlides.width(a.computedW),
              a.setProps(a.computedW, "setTotal")));
      },
      smoothHeight: function (b) {
        if (!p || r) {
          var f = r ? a : a.viewport;
          b
            ? f.animate({ height: a.slides.eq(a.animatingTo).height() }, b)
            : f.height(a.slides.eq(a.animatingTo).height());
        }
      },
      sync: function (b) {
        var f = d(a.vars.sync).data("flexslider"),
          c = a.animatingTo;
        switch (b) {
          case "animate":
            f.flexAnimate(c, a.vars.pauseOnAction, !1, !0);
            break;
          case "play":
            f.playing || f.asNav || f.play();
            break;
          case "pause":
            f.pause();
        }
      },
      uniqueID: function (a) {
        a.find("[id]").each(function () {
          var a = d(this);
          a.attr("id", a.attr("id") + "_clone");
        });
        return a;
      },
      pauseInvisible: {
        visProp: null,
        init: function () {
          var b = ["webkit", "moz", "ms", "o"];
          if ("hidden" in document) return "hidden";
          for (var f = 0; f < b.length; f++)
            b[f] + "Hidden" in document &&
              (c.pauseInvisible.visProp = b[f] + "Hidden");
          c.pauseInvisible.visProp &&
            ((b =
              c.pauseInvisible.visProp.replace(/[H|h]idden/, "") +
              "visibilitychange"),
            document.addEventListener(b, function () {
              c.pauseInvisible.isHidden()
                ? a.startTimeout
                  ? clearTimeout(a.startTimeout)
                  : a.pause()
                : a.started
                ? a.play()
                : 0 < a.vars.initDelay
                ? setTimeout(a.play, a.vars.initDelay)
                : a.play();
            }));
        },
        isHidden: function () {
          return document[c.pauseInvisible.visProp] || !1;
        },
      },
      setToClearWatchedEvent: function () {
        clearTimeout(u);
        u = setTimeout(function () {
          m = "";
        }, 3e3);
      },
    };
    a.flexAnimate = function (b, f, k, g, m) {
      a.vars.animationLoop ||
        b === a.currentSlide ||
        (a.direction = b > a.currentSlide ? "next" : "prev");
      q &&
        1 === a.pagingCount &&
        (a.direction = a.currentItem < b ? "next" : "prev");
      if (!a.animating && (a.canAdvance(b, m) || k) && a.is(":visible")) {
        if (q && g)
          if (
            ((k = d(a.vars.asNavFor).data("flexslider")),
            (a.atEnd = 0 === b || b === a.count - 1),
            k.flexAnimate(b, !0, !1, !0, m),
            (a.direction = a.currentItem < b ? "next" : "prev"),
            (k.direction = a.direction),
            Math.ceil((b + 1) / a.visible) - 1 !== a.currentSlide && 0 !== b)
          )
            (a.currentItem = b),
              a.slides
                .removeClass(e + "active-slide")
                .eq(b)
                .addClass(e + "active-slide"),
              (b = Math.floor(b / a.visible));
          else
            return (
              (a.currentItem = b),
              a.slides
                .removeClass(e + "active-slide")
                .eq(b)
                .addClass(e + "active-slide"),
              !1
            );
        a.animating = !0;
        a.animatingTo = b;
        f && a.pause();
        a.vars.before(a);
        a.syncExists && !m && c.sync("animate");
        a.vars.controlNav && c.controlNav.active();
        h ||
          a.slides
            .removeClass(e + "active-slide")
            .eq(b)
            .addClass(e + "active-slide");
        a.atEnd = 0 === b || b === a.last;
        a.vars.directionNav && c.directionNav.update();
        b === a.last && (a.vars.end(a), a.vars.animationLoop || a.pause());
        if (r)
          t
            ? (a.slides.eq(a.currentSlide).css({ opacity: 0, zIndex: 1 }),
              a.slides.eq(b).css({ opacity: 1, zIndex: 2 }),
              a.wrapup(l))
            : (a.slides
                .eq(a.currentSlide)
                .css({ zIndex: 1 })
                .animate({ opacity: 0 }, a.vars.animationSpeed, a.vars.easing),
              a.slides
                .eq(b)
                .css({ zIndex: 2 })
                .animate(
                  { opacity: 1 },
                  a.vars.animationSpeed,
                  a.vars.easing,
                  a.wrapup
                ));
        else {
          var l = p ? a.slides.filter(":first").height() : a.computedW;
          h
            ? ((b = a.vars.itemMargin),
              (b = (a.itemW + b) * a.move * a.animatingTo),
              (b = b > a.limit && 1 !== a.visible ? a.limit : b))
            : (b =
                0 === a.currentSlide &&
                b === a.count - 1 &&
                a.vars.animationLoop &&
                "next" !== a.direction
                  ? n
                    ? (a.count + a.cloneOffset) * l
                    : 0
                  : a.currentSlide === a.last &&
                    0 === b &&
                    a.vars.animationLoop &&
                    "prev" !== a.direction
                  ? n
                    ? 0
                    : (a.count + 1) * l
                  : n
                  ? (a.count - 1 - b + a.cloneOffset) * l
                  : (b + a.cloneOffset) * l);
          a.setProps(b, "", a.vars.animationSpeed);
          a.transitions
            ? ((a.vars.animationLoop && a.atEnd) ||
                ((a.animating = !1), (a.currentSlide = a.animatingTo)),
              a.container.unbind("webkitTransitionEnd transitionend"),
              a.container.bind(
                "webkitTransitionEnd transitionend",
                function () {
                  a.wrapup(l);
                }
              ))
            : a.container.animate(
                a.args,
                a.vars.animationSpeed,
                a.vars.easing,
                function () {
                  a.wrapup(l);
                }
              );
        }
        a.vars.smoothHeight && c.smoothHeight(a.vars.animationSpeed);
      }
    };
    a.wrapup = function (b) {
      r ||
        h ||
        (0 === a.currentSlide &&
        a.animatingTo === a.last &&
        a.vars.animationLoop
          ? a.setProps(b, "jumpEnd")
          : a.currentSlide === a.last &&
            0 === a.animatingTo &&
            a.vars.animationLoop &&
            a.setProps(b, "jumpStart"));
      a.animating = !1;
      a.currentSlide = a.animatingTo;
      a.vars.after(a);
    };
    a.animateSlides = function () {
      a.animating || a.flexAnimate(a.getTarget("next"));
    };
    a.pause = function () {
      clearInterval(a.animatedSlides);
      a.animatedSlides = null;
      a.playing = !1;
      a.vars.pausePlay && c.pausePlay.update("play");
      a.syncExists && c.sync("pause");
    };
    a.play = function () {
      a.playing && clearInterval(a.animatedSlides);
      a.animatedSlides =
        a.animatedSlides || setInterval(a.animateSlides, a.vars.slideshowSpeed);
      a.started = a.playing = !0;
      a.vars.pausePlay && c.pausePlay.update("pause");
      a.syncExists && c.sync("play");
    };
    a.stop = function () {
      a.pause();
      a.stopped = !0;
    };
    a.canAdvance = function (b, f) {
      var c = q ? a.pagingCount - 1 : a.last;
      return f
        ? !0
        : q &&
          a.currentItem === a.count - 1 &&
          0 === b &&
          "prev" === a.direction
        ? !0
        : q &&
          0 === a.currentItem &&
          b === a.pagingCount - 1 &&
          "next" !== a.direction
        ? !1
        : b !== a.currentSlide || q
        ? a.vars.animationLoop
          ? !0
          : a.atEnd && 0 === a.currentSlide && b === c && "next" !== a.direction
          ? !1
          : a.atEnd && a.currentSlide === c && 0 === b && "next" === a.direction
          ? !1
          : !0
        : !1;
    };
    a.getTarget = function (b) {
      a.direction = b;
      return "next" === b
        ? a.currentSlide === a.last
          ? 0
          : a.currentSlide + 1
        : 0 === a.currentSlide
        ? a.last
        : a.currentSlide - 1;
    };
    a.setProps = function (b, f, c) {
      var d = (function () {
        var c = b ? b : (a.itemW + a.vars.itemMargin) * a.move * a.animatingTo;
        return (
          -1 *
            (function () {
              if (h)
                return "setTouch" === f
                  ? b
                  : n && a.animatingTo === a.last
                  ? 0
                  : n
                  ? a.limit -
                    (a.itemW + a.vars.itemMargin) * a.move * a.animatingTo
                  : a.animatingTo === a.last
                  ? a.limit
                  : c;
              switch (f) {
                case "setTotal":
                  return n
                    ? (a.count - 1 - a.currentSlide + a.cloneOffset) * b
                    : (a.currentSlide + a.cloneOffset) * b;
                case "setTouch":
                  return b;
                case "jumpEnd":
                  return n ? b : a.count * b;
                case "jumpStart":
                  return n ? a.count * b : b;
                default:
                  return b;
              }
            })() +
          "px"
        );
      })();
      a.transitions &&
        ((d = p ? "translate3d(0," + d + ",0)" : "translate3d(" + d + ",0,0)"),
        (c = void 0 !== c ? c / 1e3 + "s" : "0s"),
        a.container.css("-" + a.pfx + "-transition-duration", c),
        a.container.css("transition-duration", c));
      a.args[a.prop] = d;
      (a.transitions || void 0 === c) && a.container.css(a.args);
      a.container.css("transform", d);
    };
    a.setup = function (b) {
      if (r)
        a.slides.css({
          width: "100%",
          float: "left",
          marginRight: "-100%",
          position: "relative",
        }),
          "init" === b &&
            (t
              ? a.slides
                  .css({
                    opacity: 0,
                    display: "block",
                    webkitTransition:
                      "opacity " + a.vars.animationSpeed / 1e3 + "s ease",
                    zIndex: 1,
                  })
                  .eq(a.currentSlide)
                  .css({ opacity: 1, zIndex: 2 })
              : a.slides
                  .css({ opacity: 0, display: "block", zIndex: 1 })
                  .eq(a.currentSlide)
                  .css({ zIndex: 2 })
                  .animate(
                    { opacity: 1 },
                    a.vars.animationSpeed,
                    a.vars.easing
                  )),
          a.vars.smoothHeight && c.smoothHeight();
      else {
        var f, g;
        "init" === b &&
          ((a.viewport = d('<div class="' + e + 'viewport"></div>')
            .css({ overflow: "hidden", position: "relative" })
            .appendTo(a)
            .append(a.container)),
          (a.cloneCount = 0),
          (a.cloneOffset = 0),
          n &&
            ((g = d.makeArray(a.slides).reverse()),
            (a.slides = d(g)),
            a.container.empty().append(a.slides)));
        a.vars.animationLoop &&
          !h &&
          ((a.cloneCount = 2),
          (a.cloneOffset = 1),
          "init" !== b && a.container.find(".clone").remove(),
          c
            .uniqueID(
              a.slides
                .first()
                .clone()
                .addClass("clone")
                .attr("aria-hidden", "true")
            )
            .appendTo(a.container),
          c
            .uniqueID(
              a.slides
                .last()
                .clone()
                .addClass("clone")
                .attr("aria-hidden", "true")
            )
            .prependTo(a.container));
        a.newSlides = d(a.vars.selector, a);
        f = n
          ? a.count - 1 - a.currentSlide + a.cloneOffset
          : a.currentSlide + a.cloneOffset;
        p && !h
          ? (a.container
              .height(200 * (a.count + a.cloneCount) + "%")
              .css("position", "absolute")
              .width("100%"),
            setTimeout(
              function () {
                a.newSlides.css({ display: "block" });
                a.doMath();
                a.viewport.height(a.h);
                a.setProps(f * a.h, "init");
              },
              "init" === b ? 100 : 0
            ))
          : (a.container.width(200 * (a.count + a.cloneCount) + "%"),
            a.setProps(f * a.computedW, "init"),
            setTimeout(
              function () {
                a.doMath();
                a.newSlides.css({
                  width: a.computedW,
                  float: "left",
                  display: "block",
                });
                a.vars.smoothHeight && c.smoothHeight();
              },
              "init" === b ? 100 : 0
            ));
      }
      h ||
        a.slides
          .removeClass(e + "active-slide")
          .eq(a.currentSlide)
          .addClass(e + "active-slide");
      a.vars.init(a);
    };
    a.doMath = function () {
      var b = a.slides.first(),
        c = a.vars.itemMargin,
        d = a.vars.minItems,
        e = a.vars.maxItems;
      a.w = void 0 === a.viewport ? a.width() : a.viewport.width();
      a.h = b.height();
      a.boxPadding = b.outerWidth() - b.width();
      h
        ? ((a.itemT = a.vars.itemWidth + c),
          (a.minW = d ? d * a.itemT : a.w),
          (a.maxW = e ? e * a.itemT - c : a.w),
          (a.itemW =
            a.minW > a.w
              ? (a.w - c * (d - 1)) / d
              : a.maxW < a.w
              ? (a.w - c * (e - 1)) / e
              : a.vars.itemWidth > a.w
              ? a.w
              : a.vars.itemWidth),
          (a.visible = Math.floor(a.w / a.itemW)),
          (a.move =
            0 < a.vars.move && a.vars.move < a.visible
              ? a.vars.move
              : a.visible),
          (a.pagingCount = Math.ceil((a.count - a.visible) / a.move + 1)),
          (a.last = a.pagingCount - 1),
          (a.limit =
            1 === a.pagingCount
              ? 0
              : a.vars.itemWidth > a.w
              ? a.itemW * (a.count - 1) + c * (a.count - 1)
              : (a.itemW + c) * a.count - a.w - c))
        : ((a.itemW = a.w), (a.pagingCount = a.count), (a.last = a.count - 1));
      a.computedW = a.itemW - a.boxPadding;
    };
    a.update = function (b, d) {
      a.doMath();
      h ||
        (b < a.currentSlide
          ? (a.currentSlide += 1)
          : b <= a.currentSlide && 0 !== b && (a.currentSlide -= 1),
        (a.animatingTo = a.currentSlide));
      if (a.vars.controlNav && !a.manualControls)
        if (("add" === d && !h) || a.pagingCount > a.controlNav.length)
          c.controlNav.update("add");
        else if (("remove" === d && !h) || a.pagingCount < a.controlNav.length)
          h &&
            a.currentSlide > a.last &&
            ((a.currentSlide -= 1), (a.animatingTo -= 1)),
            c.controlNav.update("remove", a.last);
      a.vars.directionNav && c.directionNav.update();
    };
    a.addSlide = function (b, c) {
      var e = d(b);
      a.count += 1;
      a.last = a.count - 1;
      p && n
        ? void 0 !== c
          ? a.slides.eq(a.count - c).after(e)
          : a.container.prepend(e)
        : void 0 !== c
        ? a.slides.eq(c).before(e)
        : a.container.append(e);
      a.update(c, "add");
      a.slides = d(a.vars.selector + ":not(.clone)", a);
      a.setup();
      a.vars.added(a);
    };
    a.removeSlide = function (b) {
      var c = isNaN(b) ? a.slides.index(d(b)) : b;
      a.count -= 1;
      a.last = a.count - 1;
      isNaN(b)
        ? d(b, a.slides).remove()
        : p && n
        ? a.slides.eq(a.last).remove()
        : a.slides.eq(b).remove();
      a.doMath();
      a.update(c, "remove");
      a.slides = d(a.vars.selector + ":not(.clone)", a);
      a.setup();
      a.vars.removed(a);
    };
    c.init();
  };
  d(window)
    .blur(function (d) {
      focused = !1;
    })
    .focus(function (d) {
      focused = !0;
    });
  d.flexslider.defaults = {
    namespace: "flex-",
    selector: ".slides > li",
    animation: "fade",
    easing: "swing",
    direction: "horizontal",
    reverse: !1,
    animationLoop: !0,
    smoothHeight: !1,
    startAt: 0,
    slideshow: !0,
    slideshowSpeed: 7e3,
    animationSpeed: 600,
    initDelay: 0,
    randomize: !1,
    thumbCaptions: !1,
    pauseOnAction: !0,
    pauseOnHover: !1,
    pauseInvisible: !0,
    useCSS: !0,
    touch: !0,
    video: !1,
    controlNav: !0,
    directionNav: !0,
    prevText: "Previous",
    nextText: "Next",
    keyboard: !0,
    multipleKeyboard: !1,
    mousewheel: !1,
    pausePlay: !1,
    pauseText: "Pause",
    playText: "Play",
    controlsContainer: "",
    manualControls: "",
    sync: "",
    asNavFor: "",
    itemWidth: 0,
    itemMargin: 0,
    minItems: 1,
    maxItems: 0,
    move: 0,
    allowOneSlide: !0,
    start: function () {},
    before: function () {},
    after: function () {},
    end: function () {},
    added: function () {},
    removed: function () {},
    init: function () {},
  };
  d.fn.flexslider = function (g) {
    void 0 === g && (g = {});
    if ("object" === typeof g)
      return this.each(function () {
        var a = d(this),
          e = a.find(g.selector ? g.selector : ".slides > li");
        (1 === e.length && !0 === g.allowOneSlide) || 0 === e.length
          ? (e.fadeIn(400), g.start && g.start(a))
          : void 0 === a.data("flexslider") && new d.flexslider(this, g);
      });
    var l = d(this).data("flexslider");
    switch (g) {
      case "play":
        l.play();
        break;
      case "pause":
        l.pause();
        break;
      case "stop":
        l.stop();
        break;
      case "next":
        l.flexAnimate(l.getTarget("next"), !0);
        break;
      case "prev":
      case "previous":
        l.flexAnimate(l.getTarget("prev"), !0);
        break;
      default:
        "number" === typeof g && l.flexAnimate(g, !0);
    }
  };
})(jQuery);
