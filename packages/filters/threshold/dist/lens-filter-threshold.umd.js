!(function(e, r) {
    'object' == typeof exports && 'undefined' != typeof module
        ? r(exports, require('lens-core'))
        : 'function' == typeof define && define.amd
            ? define(['exports', 'lens-core'], r)
            : r((e.lensFilterThreshold = {}), e.lensCore);
})(this, function(e, n) {
    'use strict';
    var i = function(e) {
        for (
            var r = e.data, o = e.length, t = e.options, n = 0;
            n < o;
            n += 4
        ) {
            var i =
                0.2126 * r[n] + 0.7152 * r[n + 1] + 0.0722 * r[n + 2] >=
                t.threshold
                    ? 255
                    : 0;
            r[n] = r[n + 1] = r[n + 2] = i;
        }
        return r;
    };
    (e.transform = i),
        (e.default = function() {
            var e =
                    0 < arguments.length && void 0 !== arguments[0]
                        ? arguments[0]
                        : {},
                r = e.data,
                o = e.options,
                t = e.nWorkers;
            if (!r || !o || !o.threshold)
                throw new Error(
                    'lens-filter-threshold:: invalid options provided'
                );
            return n.applyFilter({
                data: r,
                transform: i,
                options: o,
                nWorkers: t
            });
        }),
        Object.defineProperty(e, '__esModule', { value: !0 });
});
//# sourceMappingURL=lens-filter-threshold.umd.js.map
