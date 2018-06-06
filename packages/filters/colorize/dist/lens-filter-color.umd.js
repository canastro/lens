!(function(e, r) {
    'object' == typeof exports && 'undefined' != typeof module
        ? r(exports, require('lens-core'))
        : 'function' == typeof define && define.amd
            ? define(['exports', 'lens-core'], r)
            : r((e.lensFilterColorize = {}), e.lensCore);
})(this, function(e, n) {
    'use strict';
    var s = function(e) {
        for (
            var r = e.data,
                o = e.length,
                t = e.options,
                n = '#' === t.color.charAt(0) ? t.color.substr(1) : t.color,
                s = parseInt(n.substr(0, 2), 16),
                l = parseInt(n.substr(2, 2), 16),
                i = parseInt(n.substr(4, 2), 16),
                a = 0;
            a < o;
            a += 4
        )
            (r[a] -= (r[a] - s) * (t.level / 100)),
                (r[a + 1] -= (r[a + 1] - l) * (t.level / 100)),
                (r[a + 2] -= (r[a + 2] - i) * (t.level / 100));
        return r;
    };
    (e.transform = s),
        (e.default = function() {
            var e =
                    0 < arguments.length && void 0 !== arguments[0]
                        ? arguments[0]
                        : {},
                r = e.data,
                o = e.options,
                t = e.nWorkers;
            if (!(r && o && o.color && o.level))
                throw new Error(
                    'lens-filter-colorize:: invalid options provided'
                );
            return n.applyFilter({
                data: r,
                transform: s,
                options: o,
                nWorkers: t
            });
        }),
        Object.defineProperty(e, '__esModule', { value: !0 });
});
//# sourceMappingURL=lens-filter-color.umd.js.map
