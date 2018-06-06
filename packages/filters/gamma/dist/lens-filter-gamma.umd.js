!(function(e, t) {
    'object' == typeof exports && 'undefined' != typeof module
        ? t(exports, require('lens-core'))
        : 'function' == typeof define && define.amd
            ? define(['exports', 'lens-core'], t)
            : t((e.lensFilterGamma = {}), e.lensCore);
})(this, function(e, r) {
    'use strict';
    var a = function(e) {
        for (var t = e.data, n = e.length, o = e.options, r = 0; r < n; r += 4)
            (t[r] = 255 * Math.pow(t[r] / 255, o.adjustment)),
                (t[r + 1] = 255 * Math.pow(t[r + 1] / 255, o.adjustment)),
                (t[r + 2] = 255 * Math.pow(t[r + 2] / 255, o.adjustment));
        return t;
    };
    (e.transform = a),
        (e.default = function() {
            var e =
                    0 < arguments.length && void 0 !== arguments[0]
                        ? arguments[0]
                        : {},
                t = e.data,
                n = e.options,
                o = e.nWorkers;
            if (!t || !n || !n.adjustment)
                throw new Error('lens-filter-gamma:: invalid options provided');
            return r.applyFilter({
                data: t,
                transform: a,
                options: n,
                nWorkers: o
            });
        }),
        Object.defineProperty(e, '__esModule', { value: !0 });
});
//# sourceMappingURL=lens-filter-gamma.umd.js.map
