google.maps.__gjsload__("overlay", function (_) {
  var JD = function (a) {
      this.Fg = a;
    },
    Dma = function () {},
    KD = function (a) {
      a.Qx = a.Qx || new Dma();
      return a.Qx;
    },
    Ema = function (a) {
      this.Eh = new _.Om(() => {
        const b = a.Qx;
        if (a.getPanes()) {
          if (a.getProjection()) {
            if (!b.lw && a.onAdd) a.onAdd();
            b.lw = !0;
            a.draw();
          }
        } else {
          if (b.lw)
            if (a.onRemove) a.onRemove();
            else a.remove();
          b.lw = !1;
        }
      }, 0);
    },
    Fma = function (a, b) {
      const c = KD(a);
      let d = c.tv;
      d || (d = c.tv = new Ema(a));
      _.Qb(c.Rh || [], _.jk);
      var e = (c.ji = c.ji || new _.jia());
      const f = b.__gm;
      e.bindTo("zoom", f);
      e.bindTo("offset", f);
      e.bindTo("center", f, "projectionCenterQ");
      e.bindTo("projection", b);
      e.bindTo("projectionTopLeft", f);
      e = c.EB = c.EB || new JD(e);
      e.bindTo("zoom", f);
      e.bindTo("offset", f);
      e.bindTo("projection", b);
      e.bindTo("projectionTopLeft", f);
      a.bindTo("projection", e, "outProjection");
      a.bindTo("panes", f);
      e = () => _.Pm(d.Eh);
      c.Rh = [
        _.hk(a, "panes_changed", e),
        _.hk(f, "zoom_changed", e),
        _.hk(f, "offset_changed", e),
        _.hk(b, "projection_changed", e),
        _.hk(f, "projectioncenterq_changed", e),
      ];
      _.Pm(d.Eh);
      b instanceof _.Ek
        ? (_.ol(b, "Ox"), _.ml(b, 148440))
        : b instanceof _.Kl && (_.ol(b, "Oxs"), _.ml(b, 181451));
    },
    Kma = function (a) {
      if (a) {
        var b = a.getMap();
        if (Gma(a) !== b && b && b instanceof _.Ek) {
          const c = b.__gm;
          c.overlayLayer
            ? (a.__gmop = new Hma(b, a, c.overlayLayer))
            : c.Gg.then(({ lh: d }) => {
                const e = new Ima(b, d);
                d.Ai(e);
                c.overlayLayer = e;
                Jma(a);
                Kma(a);
              });
        }
      }
    },
    Jma = function (a) {
      if (a) {
        var b = a.__gmop;
        b &&
          ((a.__gmop = null),
          b.Fg.unbindAll(),
          b.Fg.set("panes", null),
          b.Fg.set("projection", null),
          b.Hg.rl(b),
          b.Gg &&
            ((b.Gg = !1), b.Fg.onRemove ? b.Fg.onRemove() : b.Fg.remove()));
      }
    },
    Gma = function (a) {
      return (a = a.__gmop) ? a.map : null;
    },
    Lma = function (a, b) {
      a.Fg.get("projection") != b &&
        (a.Fg.bindTo("panes", a.map.__gm), a.Fg.set("projection", b));
    };
  _.Ga(JD, _.yk);
  JD.prototype.changed = function (a) {
    "outProjection" != a &&
      ((a = !!(
        this.get("offset") &&
        this.get("projectionTopLeft") &&
        this.get("projection") &&
        _.Vi(this.get("zoom"))
      )),
      a == !this.get("outProjection") &&
        this.set("outProjection", a ? this.Fg : null));
  };
  var LD = {};
  _.Ga(Ema, _.yk);
  LD.Tk = function (a) {
    if (a) {
      var b = a.getMap();
      (KD(a).nB || null) !== b && (b && Fma(a, b), (KD(a).nB = b));
    }
  };
  LD.rl = function (a) {
    const b = KD(a);
    var c = b.ji;
    c && c.unbindAll();
    (c = b.EB) && c.unbindAll();
    a.unbindAll();
    a.set("panes", null);
    a.set("projection", null);
    b.Rh && _.Qb(b.Rh, _.jk);
    b.Rh = null;
    b.tv && (b.tv.Eh.Ej(), (b.tv = null));
    delete KD(a).nB;
  };
  var MD = {},
    Hma = class {
      constructor(a, b, c) {
        this.map = a;
        this.Fg = b;
        this.Hg = c;
        this.Gg = !1;
        _.ol(this.map, "Ox");
        _.ml(this.map, 148440);
        c.Tk(this);
      }
      draw() {
        this.Gg || ((this.Gg = !0), this.Fg.onAdd && this.Fg.onAdd());
        this.Fg.draw && this.Fg.draw();
      }
    },
    Ima = class {
      constructor(a, b) {
        this.Jg = a;
        this.Hg = b;
        this.Fg = null;
        this.Gg = [];
      }
      dispose() {}
      Ri(a, b, c, d, e, f, g, h) {
        const l = (this.Fg = this.Fg || new _.yB(this.Jg, this.Hg, () => {}));
        l.Ri(a, b, c, d, e, f, g, h);
        for (const n of this.Gg) Lma(n, l), n.draw();
      }
      Tk(a) {
        this.Gg.push(a);
        this.Fg && Lma(a, this.Fg);
        this.Hg.refresh();
      }
      rl(a) {
        _.Wb(this.Gg, a);
      }
    };
  MD.Tk = Kma;
  MD.rl = Jma;
  _.Zj("overlay", {
    Fz: function (a) {
      if (a) {
        (0, LD.rl)(a);
        (0, MD.rl)(a);
        var b = a.getMap();
        b && (b instanceof _.Ek ? (0, MD.Tk)(a) : (0, LD.Tk)(a));
      }
    },
    preventMapHitsFrom: (a) => {
      _.Vv(a, {
        jl: ({ event: b }) => {
          _.Ct(b.Kh);
        },
        Zj: (b) => _.Ev(b),
        Cp: (b) => _.Fv(b),
        Nk: (b) => _.Fv(b),
        nk: (b) => _.Gv(b),
      }).Yq(!0);
    },
    preventMapHitsAndGesturesFrom: (a) => {
      a.addEventListener("click", _.fk);
      a.addEventListener("contextmenu", _.fk);
      a.addEventListener("dblclick", _.fk);
      a.addEventListener("mousedown", _.fk);
      a.addEventListener("mousemove", _.fk);
      a.addEventListener("MSPointerDown", _.fk);
      a.addEventListener("pointerdown", _.fk);
      a.addEventListener("touchstart", _.fk);
      a.addEventListener("wheel", _.fk);
    },
  });
});
