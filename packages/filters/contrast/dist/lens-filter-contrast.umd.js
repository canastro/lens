!(function(e, t) {
    'object' == typeof exports && 'undefined' != typeof module
        ? t(exports, require('workerize'))
        : 'function' == typeof define && define.amd
            ? define(['exports', 'workerize'], t)
            : t((e.lensFilterContrast = {}), e.workerize);
})(this, function(e, n) {
    'use strict';
    n = n && n.hasOwnProperty('default') ? n.default : n;
    'undefined' != typeof window
        ? window
        : 'undefined' != typeof global
            ? global
            : 'undefined' != typeof self && self;
    var t,
        a = ((function(e, t) {
            !(function(a) {
                function o(e, t) {
                    var n = document.createElement('canvas');
                    return (n.width = e), (n.height = t), n;
                }
                (a = a && a.hasOwnProperty('default') ? a.default : a),
                    (t.getCanvas = o),
                    (t.convertImageDataToCanvasURL = function(e) {
                        var t = window.document.createElement('canvas'),
                            n = t.getContext('2d');
                        return (
                            (t.width = e.width),
                            (t.height = e.height),
                            n.putImageData(e, 0, 0),
                            t.toDataURL()
                        );
                    }),
                    (t.applyFilter = function(e) {
                        var t = e.data,
                            n = e.transform,
                            i = e.options,
                            d = e.nWorkers,
                            s = a(
                                '\n        var transform = ' +
                                    n +
                                    ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                            ),
                            f = o(t.width, t.height),
                            u = f.getContext('2d');
                        u.putImageData(t, 0, 0), (d = d || 1);
                        var l = Math.floor(f.height / d);
                        return new Promise(function(t) {
                            for (var n = 0, e = void 0, a = 0; a < d; a++) {
                                (e = l), a + 1 === d && (e = f.height - l * a);
                                var o = u.getImageData(0, l * a, f.width, e),
                                    r = e * f.width * 4;
                                s.execute(o, a, r, i).then(function(e) {
                                    u.putImageData(e.result, 0, l * e.index),
                                        ++n === d &&
                                            t(
                                                u.getImageData(
                                                    0,
                                                    0,
                                                    f.width,
                                                    f.height
                                                )
                                            );
                                });
                            }
                        });
                    });
            })(n);
        })((t = { exports: {} }), t.exports),
        t.exports),
        o = (a.getCanvas, a.convertImageDataToCanvasURL, a.applyFilter),
        r = function(e) {
            for (
                var t = e.data,
                    n = e.length,
                    a = e.options,
                    o = (259 * (a.level + 255)) / (255 * (259 - a.level)),
                    r = 0;
                r < n;
                r += 4
            )
                (t[r] = o * (t[r] - 128) + 128),
                    (t[r + 1] = o * (t[r + 1] - 128) + 128),
                    (t[r + 2] = o * (t[r + 2] - 128) + 128);
            return t;
        };
    (e.transform = r),
        (e.default = function() {
            var e =
                    0 < arguments.length && void 0 !== arguments[0]
                        ? arguments[0]
                        : {},
                t = e.data,
                n = e.options,
                a = e.nWorkers;
            if (!t || !n || !n.level)
                throw new Error(
                    'lens-filter-contrast:: invalid options provided'
                );
            return o({ data: t, transform: r, options: n, nWorkers: a });
        }),
        Object.defineProperty(e, '__esModule', { value: !0 });
});
//# sourceMappingURL=lens-filter-contrast.umd.js.map
