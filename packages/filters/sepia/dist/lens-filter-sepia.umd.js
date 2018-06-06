!(function(e, r) {
    'object' == typeof exports && 'undefined' != typeof module
        ? r(exports, require('lens-core'))
        : 'function' == typeof define && define.amd
            ? define(['exports', 'lens-core'], r)
            : r((e.lensFilterSepia = {}), e.lensCore);
})(this, function(e, t) {
    'use strict';
    var o = function(e) {
        for (var r = e.data, n = e.length, t = 0; t < n; t += 4) {
            var o = r[t],
                i = r[t + 1],
                a = r[t + 2];
            (r[t] = 0.393 * o + 0.769 * i + 0.189 * a),
                (r[t + 1] = 0.349 * o + 0.686 * i + 0.168 * a),
                (r[t + 2] = 0.272 * o + 0.534 * i + 0.131 * a);
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
                throw new Error('lens-filter-sepia:: invalid options provided');
            return t.applyFilter({ data: r, transform: o, nWorkers: n });
        }),
        Object.defineProperty(e, '__esModule', { value: !0 });
});
//# sourceMappingURL=lens-filter-sepia.umd.js.map
