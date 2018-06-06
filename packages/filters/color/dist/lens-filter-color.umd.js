!(function(o, r) {
    'object' == typeof exports && 'undefined' != typeof module
        ? r(exports, require('lens-core'))
        : 'function' == typeof define && define.amd
            ? define(['exports', 'lens-core'], r)
            : r((o.lensFilterColor = {}), o.lensCore);
})(this, function(o, n) {
    'use strict';
    var i = function(o) {
        for (
            var l = o.data,
                r = o.length,
                e = o.options,
                t = function(o) {
                    return !isNaN(parseFloat(o)) && isFinite(o);
                },
                c = function(o, r, e) {
                    (o[r] = t(e.r) ? e.r : o[r]),
                        (o[r + 1] = t(e.g) ? e.g : o[r + 1]),
                        (o[r + 2] = t(e.b) ? e.b : o[r + 2]),
                        (o[r + 3] = t(e.a) ? e.a : o[r + 3]);
                },
                n = function(s) {
                    e.colorsInterval.forEach(function(o) {
                        var r,
                            e,
                            t,
                            n,
                            i,
                            a,
                            f = ((t = o),
                            (n = (r = l)[(e = s)]),
                            (i = r[e + 1]),
                            (a = r[e + 2]),
                            n >= t.from.r &&
                                n <= t.to.r &&
                                i >= t.from.g &&
                                i <= t.to.g &&
                                a >= t.from.b &&
                                a <= t.to.b);
                        f && o.match
                            ? c(l, s, o.match)
                            : !f && o.noMatch && c(l, s, o.noMatch);
                    });
                },
                i = 0;
            i < r;
            i += 4
        )
            n(i);
        return l;
    };
    (o.transform = i),
        (o.default = function() {
            var o =
                    0 < arguments.length && void 0 !== arguments[0]
                        ? arguments[0]
                        : {},
                r = o.data,
                e = o.options,
                t = o.nWorkers;
            if (
                !(r && e && e.colorsInterval && Array.isArray(e.colorsInterval))
            )
                throw new Error('lens-filter-color:: invalid options provided');
            return n.applyFilter({
                data: r,
                transform: i,
                options: e,
                nWorkers: t
            });
        }),
        Object.defineProperty(o, '__esModule', { value: !0 });
});
//# sourceMappingURL=lens-filter-color.umd.js.map
