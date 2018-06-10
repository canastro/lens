!(function(e, t) {
    'object' == typeof exports && 'undefined' != typeof module
        ? t(exports, require('workerize'))
        : 'function' == typeof define && define.amd
            ? define(['exports', 'workerize'], t)
            : t((e.lensFilterColorize = {}), e.workerize);
})(this, function(e, n) {
    'use strict';
    n = n && n.hasOwnProperty('default') ? n.default : n;
    'undefined' != typeof window
        ? window
        : 'undefined' != typeof global
            ? global
            : 'undefined' != typeof self && self;
    var t,
        o = ((function(e, t) {
            !(function(o) {
                function a(e, t) {
                    var n = document.createElement('canvas');
                    return (n.width = e), (n.height = t), n;
                }
                (o = o && o.hasOwnProperty('default') ? o.default : o),
                    (t.getCanvas = a),
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
                            s = e.nWorkers,
                            d = o(
                                '\n        var transform = ' +
                                    n +
                                    ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                            ),
                            l = a(t.width, t.height),
                            u = l.getContext('2d');
                        u.putImageData(t, 0, 0), (s = s || 1);
                        var f = Math.floor(l.height / s);
                        return new Promise(function(t) {
                            for (var n = 0, e = void 0, o = 0; o < s; o++) {
                                (e = f), o + 1 === s && (e = l.height - f * o);
                                var a = u.getImageData(0, f * o, l.width, e),
                                    r = e * l.width * 4;
                                d.execute(a, o, r, i).then(function(e) {
                                    u.putImageData(e.result, 0, f * e.index),
                                        ++n === s &&
                                            t(
                                                u.getImageData(
                                                    0,
                                                    0,
                                                    l.width,
                                                    l.height
                                                )
                                            );
                                });
                            }
                        });
                    });
            })(n);
        })((t = { exports: {} }), t.exports),
        t.exports),
        a = (o.getCanvas, o.convertImageDataToCanvasURL, o.applyFilter),
        r = function(e) {
            for (
                var t = e.data,
                    n = e.length,
                    o = e.options,
                    a = '#' === o.color.charAt(0) ? o.color.substr(1) : o.color,
                    r = parseInt(a.substr(0, 2), 16),
                    i = parseInt(a.substr(2, 2), 16),
                    s = parseInt(a.substr(4, 2), 16),
                    d = 0;
                d < n;
                d += 4
            )
                (t[d] -= (t[d] - r) * (o.level / 100)),
                    (t[d + 1] -= (t[d + 1] - i) * (o.level / 100)),
                    (t[d + 2] -= (t[d + 2] - s) * (o.level / 100));
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
                o = e.nWorkers;
            if (!(t && n && n.color && n.level))
                throw new Error(
                    'lens-filter-colorize:: invalid options provided'
                );
            return a({ data: t, transform: r, options: n, nWorkers: o });
        }),
        Object.defineProperty(e, '__esModule', { value: !0 });
});
//# sourceMappingURL=lens-filter-color.umd.js.map
