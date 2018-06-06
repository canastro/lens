!(function(e, t) {
    'object' == typeof exports && 'undefined' != typeof module
        ? t(exports, require('lens-core'))
        : 'function' == typeof define && define.amd
            ? define(['exports', 'lens-core'], t)
            : t((e.lensFilterBrightness = {}), e.lensCore);
})(this, function(e, o) {
    'use strict';
    var s = function(e) {
        for (var t = e.data, n = e.length, r = e.options, o = 0; o < n; o += 4)
            (t[o] += r.adjustment),
                (t[o + 1] += r.adjustment),
                (t[o + 2] += r.adjustment);
        return t;
    };
    (e.transform = s),
        (e.default = function() {
            var e =
                    0 < arguments.length && void 0 !== arguments[0]
                        ? arguments[0]
                        : {},
                t = e.data,
                n = e.options,
                r = e.nWorkers;
            if (!t || !n || !n.adjustment)
                throw new Error(
                    'lens-filter-brightness:: invalid options provided'
                );
            return o.applyFilter({
                data: t,
                transform: s,
                options: n,
                nWorkers: r
            });
        }),
        Object.defineProperty(e, '__esModule', { value: !0 });
});
//# sourceMappingURL=lens-filter-brightness.umd.js.map
