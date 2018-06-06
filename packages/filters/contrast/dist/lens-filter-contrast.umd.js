!(function(e, t) {
    'object' == typeof exports && 'undefined' != typeof module
        ? t(exports, require('lens-core'))
        : 'function' == typeof define && define.amd
            ? define(['exports', 'lens-core'], t)
            : t((e.lensFilterContrast = {}), e.lensCore);
})(this, function(e, r) {
    'use strict';
    var i = function(e) {
        for (
            var t = e.data,
                n = e.length,
                o = e.options,
                r = (259 * (o.contrast + 255)) / (255 * (259 - o.contrast)),
                i = 0;
            i < n;
            i += 4
        )
            (t[i] = r * (t[i] - 128) + 128),
                (t[i + 1] = r * (t[i + 1] - 128) + 128),
                (t[i + 2] = r * (t[i + 2] - 128) + 128);
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
                o = e.nWorkers;
            if (!t || !n || !n.contrast)
                throw new Error(
                    'lens-filter-contrast:: invalid options provided'
                );
            return r.applyFilter({
                data: t,
                transform: i,
                options: n,
                nWorkers: o
            });
        }),
        Object.defineProperty(e, '__esModule', { value: !0 });
});
//# sourceMappingURL=lens-filter-contrast.umd.js.map
