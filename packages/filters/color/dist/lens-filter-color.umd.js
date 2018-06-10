!(function(t, e) {
    'object' == typeof exports && 'undefined' != typeof module
        ? e(exports, require('workerize'))
        : 'function' == typeof define && define.amd
            ? define(['exports', 'workerize'], e)
            : e((t.lensFilterColor = {}), t.workerize);
})(this, function(t, n) {
    'use strict';
    n = n && n.hasOwnProperty('default') ? n.default : n;
    'undefined' != typeof window
        ? window
        : 'undefined' != typeof global
            ? global
            : 'undefined' != typeof self && self;
    var e,
        o = ((function(t, e) {
            !(function(o) {
                function a(t, e) {
                    var n = document.createElement('canvas');
                    return (n.width = t), (n.height = e), n;
                }
                (o = o && o.hasOwnProperty('default') ? o.default : o),
                    (e.getCanvas = a),
                    (e.convertImageDataToCanvasURL = function(t) {
                        var e = window.document.createElement('canvas'),
                            n = e.getContext('2d');
                        return (
                            (e.width = t.width),
                            (e.height = t.height),
                            n.putImageData(t, 0, 0),
                            e.toDataURL()
                        );
                    }),
                    (e.applyFilter = function(t) {
                        var e = t.data,
                            n = t.transform,
                            i = t.options,
                            f = t.nWorkers,
                            s = o(
                                '\n        var transform = ' +
                                    n +
                                    ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                            ),
                            d = a(e.width, e.height),
                            u = d.getContext('2d');
                        u.putImageData(e, 0, 0), (f = f || 1);
                        var c = Math.floor(d.height / f);
                        return new Promise(function(e) {
                            for (var n = 0, t = void 0, o = 0; o < f; o++) {
                                (t = c), o + 1 === f && (t = d.height - c * o);
                                var a = u.getImageData(0, c * o, d.width, t),
                                    r = t * d.width * 4;
                                s.execute(a, o, r, i).then(function(t) {
                                    u.putImageData(t.result, 0, c * t.index),
                                        ++n === f &&
                                            e(
                                                u.getImageData(
                                                    0,
                                                    0,
                                                    d.width,
                                                    d.height
                                                )
                                            );
                                });
                            }
                        });
                    });
            })(n);
        })((e = { exports: {} }), e.exports),
        e.exports),
        a = (o.getCanvas, o.convertImageDataToCanvasURL, o.applyFilter),
        r = function(t) {
            for (
                var d = t.data,
                    e = t.length,
                    n = t.options,
                    o = function(t) {
                        return !isNaN(parseFloat(t)) && isFinite(t);
                    },
                    u = function(t, e, n) {
                        (t[e] = o(n.r) ? n.r : t[e]),
                            (t[e + 1] = o(n.g) ? n.g : t[e + 1]),
                            (t[e + 2] = o(n.b) ? n.b : t[e + 2]),
                            (t[e + 3] = o(n.a) ? n.a : t[e + 3]);
                    },
                    a = function(s) {
                        n.colorsInterval.forEach(function(t) {
                            var e,
                                n,
                                o,
                                a,
                                r,
                                i,
                                f = ((o = t),
                                (a = (e = d)[(n = s)]),
                                (r = e[n + 1]),
                                (i = e[n + 2]),
                                a >= o.from.r &&
                                    a <= o.to.r &&
                                    r >= o.from.g &&
                                    r <= o.to.g &&
                                    i >= o.from.b &&
                                    i <= o.to.b);
                            f && t.match
                                ? u(d, s, t.match)
                                : !f && t.noMatch && u(d, s, t.noMatch);
                        });
                    },
                    r = 0;
                r < e;
                r += 4
            )
                a(r);
            return d;
        };
    (t.transform = r),
        (t.default = function() {
            var t =
                    0 < arguments.length && void 0 !== arguments[0]
                        ? arguments[0]
                        : {},
                e = t.data,
                n = t.options,
                o = t.nWorkers;
            if (
                !(e && n && n.colorsInterval && Array.isArray(n.colorsInterval))
            )
                throw new Error('lens-filter-color:: invalid options provided');
            return a({ data: e, transform: r, options: n, nWorkers: o });
        }),
        Object.defineProperty(t, '__esModule', { value: !0 });
});
//# sourceMappingURL=lens-filter-color.umd.js.map
