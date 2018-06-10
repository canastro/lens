!(function(e, t) {
    'object' == typeof exports && 'undefined' != typeof module
        ? t(exports, require('workerize'))
        : 'function' == typeof define && define.amd
            ? define(['exports', 'workerize'], t)
            : t((e.lensFilterSepia = {}), e.workerize);
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
                function r(e, t) {
                    var n = document.createElement('canvas');
                    return (n.width = e), (n.height = t), n;
                }
                (a = a && a.hasOwnProperty('default') ? a.default : a),
                    (t.getCanvas = r),
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
                            f = a(
                                '\n        var transform = ' +
                                    n +
                                    ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                            ),
                            s = r(t.width, t.height),
                            u = s.getContext('2d');
                        u.putImageData(t, 0, 0), (d = d || 1);
                        var l = Math.floor(s.height / d);
                        return new Promise(function(t) {
                            for (var n = 0, e = void 0, a = 0; a < d; a++) {
                                (e = l), a + 1 === d && (e = s.height - l * a);
                                var r = u.getImageData(0, l * a, s.width, e),
                                    o = e * s.width * 4;
                                f.execute(r, a, o, i).then(function(e) {
                                    u.putImageData(e.result, 0, l * e.index),
                                        ++n === d &&
                                            t(
                                                u.getImageData(
                                                    0,
                                                    0,
                                                    s.width,
                                                    s.height
                                                )
                                            );
                                });
                            }
                        });
                    });
            })(n);
        })((t = { exports: {} }), t.exports),
        t.exports),
        r = (a.getCanvas, a.convertImageDataToCanvasURL, a.applyFilter),
        o = function(e) {
            for (var t = e.data, n = e.length, a = 0; a < n; a += 4) {
                var r = t[a],
                    o = t[a + 1],
                    i = t[a + 2];
                (t[a] = 0.393 * r + 0.769 * o + 0.189 * i),
                    (t[a + 1] = 0.349 * r + 0.686 * o + 0.168 * i),
                    (t[a + 2] = 0.272 * r + 0.534 * o + 0.131 * i);
            }
            return t;
        };
    (e.transform = o),
        (e.default = function() {
            var e =
                    0 < arguments.length && void 0 !== arguments[0]
                        ? arguments[0]
                        : {},
                t = e.data,
                n = e.nWorkers;
            if (!t)
                throw new Error('lens-filter-sepia:: invalid options provided');
            return r({ data: t, transform: o, nWorkers: n });
        }),
        Object.defineProperty(e, '__esModule', { value: !0 });
});
//# sourceMappingURL=lens-filter-sepia.umd.js.map
