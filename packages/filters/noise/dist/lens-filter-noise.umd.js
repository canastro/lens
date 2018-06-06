!(function(e, t) {
    'object' == typeof exports && 'undefined' != typeof module
        ? t(exports, require('lens-core'))
        : 'function' == typeof define && define.amd
            ? define(['exports', 'lens-core'], t)
            : t((e.lensFilterNoise = {}), e.lensCore);
})(this, function(e, o) {
    'use strict';
    var i = function(e) {
        for (
            var t = e.data,
                n = e.length,
                r = e.options,
                o = 2.55 * Math.abs(r.adjustment),
                i = function(e, t) {
                    var n = e + t;
                    return 255 < n ? 255 : n < 0 ? 0 : n;
                },
                a = 0;
            a < n;
            a += 4
        ) {
            var s = (Math.random() < 0.5 ? -1 : 1) * (Math.random() + o);
            (t[a] = i(t[a], s)),
                (t[a + 1] = i(t[a + 1], s)),
                (t[a + 2] = i(t[a + 2], s));
        }
        return t;
    };
    (e.transform = i),
        (e.default = function() {
            var e =
                    0 < arguments.length && void 0 !== arguments[0]
                        ? arguments[0]
                        : {},
                t = e.data,
                n = e.options,
                r = e.nWorkers;
            if (!t || !n || !n.adjustment)
                throw new Error('lens-filter-noise:: invalid options provided');
            return o.applyFilter({
                data: t,
                transform: i,
                options: n,
                nWorkers: r
            });
        }),
        Object.defineProperty(e, '__esModule', { value: !0 });
});
//# sourceMappingURL=lens-filter-noise.umd.js.map
