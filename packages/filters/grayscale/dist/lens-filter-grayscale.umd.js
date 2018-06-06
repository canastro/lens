!(function(e, r) {
    'object' == typeof exports && 'undefined' != typeof module
        ? r(exports, require('lens-core'))
        : 'function' == typeof define && define.amd
            ? define(['exports', 'lens-core'], r)
            : r((e.lensFilterGrayscale = {}), e.lensCore);
})(this, function(e, t) {
    'use strict';
    var o = function(e) {
        for (var r = e.data, n = e.length, t = 0; t < n; t += 4) {
            var o = 0.2126 * r[t] + 0.7152 * r[t + 1] + 0.0722 * r[t + 2];
            r[t] = r[t + 1] = r[t + 2] = o;
        }
        return r;
    };
    (e.transform = o),
        (e.default = function() {
            var e =
                    0 < arguments.length && void 0 !== arguments[0]
                        ? arguments[0]
                        : {},
                r = e.data,
                n = e.nWorkers;
            if (!r)
                throw new Error(
                    'lens-filter-grayscale:: invalid options provided'
                );
            return t.applyFilter({ data: r, transform: o, nWorkers: n });
        }),
        Object.defineProperty(e, '__esModule', { value: !0 });
});
//# sourceMappingURL=lens-filter-grayscale.umd.js.map
