!(function(t, e) {
    'object' == typeof exports && 'undefined' != typeof module
        ? (module.exports = e(require('workerize')))
        : 'function' == typeof define && define.amd
            ? define(['workerize'], e)
            : (t.lensCore = e(t.workerize));
})(this, function(n) {
    'use strict';
    n = n && n.hasOwnProperty('default') ? n.default : n;
    'undefined' != typeof window
        ? window
        : 'undefined' != typeof global
            ? global
            : 'undefined' != typeof self && self;
    function t(t) {
        return t &&
            t.__esModule &&
            Object.prototype.hasOwnProperty.call(t, 'default')
            ? t.default
            : t;
    }
    function e(t, e) {
        return t((e = { exports: {} }), e.exports), e.exports;
    }
    var a = e(function(t, e) {
            !(function(a) {
                function r(t, e) {
                    var n = document.createElement('canvas');
                    return (n.width = t), (n.height = e), n;
                }
                (a = a && a.hasOwnProperty('default') ? a.default : a),
                    (e.getCanvas = r),
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
                            s = t.nWorkers,
                            u = a(
                                '\n        var transform = ' +
                                    n +
                                    ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                            ),
                            d = r(e.width, e.height),
                            h = d.getContext('2d');
                        h.putImageData(e, 0, 0), (s = s || 1);
                        var l = Math.floor(d.height / s);
                        return new Promise(function(e) {
                            for (var n = 0, t = void 0, a = 0; a < s; a++) {
                                (t = l), a + 1 === s && (t = d.height - l * a);
                                var r = h.getImageData(0, l * a, d.width, t),
                                    o = t * d.width * 4;
                                u.execute(r, a, o, i).then(function(t) {
                                    h.putImageData(t.result, 0, l * t.index),
                                        ++n === s &&
                                            e(
                                                h.getImageData(
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
        }),
        r = a.getCanvas,
        o = a.convertImageDataToCanvasURL,
        i = (a.applyFilter,
        t(
            e(function(t, e) {
                !(function(t, e) {
                    e = e && e.hasOwnProperty('default') ? e.default : e;
                    var n,
                        o,
                        a = ((o = (n = { exports: {} }).exports),
                        (function(a) {
                            function r(t, e) {
                                var n = document.createElement('canvas');
                                return (n.width = t), (n.height = e), n;
                            }
                            (a =
                                a && a.hasOwnProperty('default')
                                    ? a.default
                                    : a),
                                (o.getCanvas = r),
                                (o.convertImageDataToCanvasURL = function(t) {
                                    var e = window.document.createElement(
                                            'canvas'
                                        ),
                                        n = e.getContext('2d');
                                    return (
                                        (e.width = t.width),
                                        (e.height = t.height),
                                        n.putImageData(t, 0, 0),
                                        e.toDataURL()
                                    );
                                }),
                                (o.applyFilter = function(t) {
                                    var e = t.data,
                                        n = t.transform,
                                        i = t.options,
                                        s = t.nWorkers,
                                        u = a(
                                            '\n        var transform = ' +
                                                n +
                                                ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                                        ),
                                        d = r(e.width, e.height),
                                        h = d.getContext('2d');
                                    h.putImageData(e, 0, 0), (s = s || 1);
                                    var l = Math.floor(d.height / s);
                                    return new Promise(function(e) {
                                        for (
                                            var n = 0, t = void 0, a = 0;
                                            a < s;
                                            a++
                                        ) {
                                            (t = l),
                                                a + 1 === s &&
                                                    (t = d.height - l * a);
                                            var r = h.getImageData(
                                                    0,
                                                    l * a,
                                                    d.width,
                                                    t
                                                ),
                                                o = t * d.width * 4;
                                            u.execute(r, a, o, i).then(function(
                                                t
                                            ) {
                                                h.putImageData(
                                                    t.result,
                                                    0,
                                                    l * t.index
                                                ),
                                                    ++n === s &&
                                                        e(
                                                            h.getImageData(
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
                        })(e),
                        n.exports),
                        r = (a.getCanvas,
                        a.convertImageDataToCanvasURL,
                        a.applyFilter),
                        i = function(t) {
                            for (
                                var e = t.data,
                                    n = t.length,
                                    a = t.options,
                                    r = 0;
                                r < n;
                                r += 4
                            )
                                (e[r] += a.level),
                                    (e[r + 1] += a.level),
                                    (e[r + 2] += a.level);
                            return e;
                        };
                    (t.transform = i),
                        (t.default = function() {
                            var t =
                                    0 < arguments.length &&
                                    void 0 !== arguments[0]
                                        ? arguments[0]
                                        : {},
                                e = t.data,
                                n = t.options,
                                a = t.nWorkers;
                            if (!e || !n || !n.level)
                                throw new Error(
                                    'lens-filter-brightness:: invalid options provided'
                                );
                            return r({
                                data: e,
                                transform: i,
                                options: n,
                                nWorkers: a
                            });
                        }),
                        Object.defineProperty(t, '__esModule', { value: !0 });
                })(e, n);
            })
        )),
        s = t(
            e(function(t, e) {
                !(function(t, e) {
                    e = e && e.hasOwnProperty('default') ? e.default : e;
                    var n,
                        o,
                        a = ((o = (n = { exports: {} }).exports),
                        (function(a) {
                            function r(t, e) {
                                var n = document.createElement('canvas');
                                return (n.width = t), (n.height = e), n;
                            }
                            (a =
                                a && a.hasOwnProperty('default')
                                    ? a.default
                                    : a),
                                (o.getCanvas = r),
                                (o.convertImageDataToCanvasURL = function(t) {
                                    var e = window.document.createElement(
                                            'canvas'
                                        ),
                                        n = e.getContext('2d');
                                    return (
                                        (e.width = t.width),
                                        (e.height = t.height),
                                        n.putImageData(t, 0, 0),
                                        e.toDataURL()
                                    );
                                }),
                                (o.applyFilter = function(t) {
                                    var e = t.data,
                                        n = t.transform,
                                        i = t.options,
                                        s = t.nWorkers,
                                        u = a(
                                            '\n        var transform = ' +
                                                n +
                                                ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                                        ),
                                        d = r(e.width, e.height),
                                        h = d.getContext('2d');
                                    h.putImageData(e, 0, 0), (s = s || 1);
                                    var l = Math.floor(d.height / s);
                                    return new Promise(function(e) {
                                        for (
                                            var n = 0, t = void 0, a = 0;
                                            a < s;
                                            a++
                                        ) {
                                            (t = l),
                                                a + 1 === s &&
                                                    (t = d.height - l * a);
                                            var r = h.getImageData(
                                                    0,
                                                    l * a,
                                                    d.width,
                                                    t
                                                ),
                                                o = t * d.width * 4;
                                            u.execute(r, a, o, i).then(function(
                                                t
                                            ) {
                                                h.putImageData(
                                                    t.result,
                                                    0,
                                                    l * t.index
                                                ),
                                                    ++n === s &&
                                                        e(
                                                            h.getImageData(
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
                        })(e),
                        n.exports),
                        r = (a.getCanvas,
                        a.convertImageDataToCanvasURL,
                        a.applyFilter),
                        i = function(t) {
                            for (
                                var d = t.data,
                                    e = t.length,
                                    n = t.options,
                                    a = function(t) {
                                        return (
                                            !isNaN(parseFloat(t)) && isFinite(t)
                                        );
                                    },
                                    h = function(t, e, n) {
                                        (t[e] = a(n.r) ? n.r : t[e]),
                                            (t[e + 1] = a(n.g)
                                                ? n.g
                                                : t[e + 1]),
                                            (t[e + 2] = a(n.b)
                                                ? n.b
                                                : t[e + 2]),
                                            (t[e + 3] = a(n.a)
                                                ? n.a
                                                : t[e + 3]);
                                    },
                                    r = function(u) {
                                        n.colorsInterval.forEach(function(t) {
                                            var e,
                                                n,
                                                a,
                                                r,
                                                o,
                                                i,
                                                s = ((a = t),
                                                (r = (e = d)[(n = u)]),
                                                (o = e[n + 1]),
                                                (i = e[n + 2]),
                                                r >= a.from.r &&
                                                    r <= a.to.r &&
                                                    o >= a.from.g &&
                                                    o <= a.to.g &&
                                                    i >= a.from.b &&
                                                    i <= a.to.b);
                                            s && t.match
                                                ? h(d, u, t.match)
                                                : !s &&
                                                  t.noMatch &&
                                                  h(d, u, t.noMatch);
                                        });
                                    },
                                    o = 0;
                                o < e;
                                o += 4
                            )
                                r(o);
                            return d;
                        };
                    (t.transform = i),
                        (t.default = function() {
                            var t =
                                    0 < arguments.length &&
                                    void 0 !== arguments[0]
                                        ? arguments[0]
                                        : {},
                                e = t.data,
                                n = t.options,
                                a = t.nWorkers;
                            if (
                                !(
                                    e &&
                                    n &&
                                    n.colorsInterval &&
                                    Array.isArray(n.colorsInterval)
                                )
                            )
                                throw new Error(
                                    'lens-filter-color:: invalid options provided'
                                );
                            return r({
                                data: e,
                                transform: i,
                                options: n,
                                nWorkers: a
                            });
                        }),
                        Object.defineProperty(t, '__esModule', { value: !0 });
                })(e, n);
            })
        ),
        u = t(
            e(function(t, e) {
                !(function(t, e) {
                    e = e && e.hasOwnProperty('default') ? e.default : e;
                    var n,
                        o,
                        a = ((o = (n = { exports: {} }).exports),
                        (function(a) {
                            function r(t, e) {
                                var n = document.createElement('canvas');
                                return (n.width = t), (n.height = e), n;
                            }
                            (a =
                                a && a.hasOwnProperty('default')
                                    ? a.default
                                    : a),
                                (o.getCanvas = r),
                                (o.convertImageDataToCanvasURL = function(t) {
                                    var e = window.document.createElement(
                                            'canvas'
                                        ),
                                        n = e.getContext('2d');
                                    return (
                                        (e.width = t.width),
                                        (e.height = t.height),
                                        n.putImageData(t, 0, 0),
                                        e.toDataURL()
                                    );
                                }),
                                (o.applyFilter = function(t) {
                                    var e = t.data,
                                        n = t.transform,
                                        i = t.options,
                                        s = t.nWorkers,
                                        u = a(
                                            '\n        var transform = ' +
                                                n +
                                                ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                                        ),
                                        d = r(e.width, e.height),
                                        h = d.getContext('2d');
                                    h.putImageData(e, 0, 0), (s = s || 1);
                                    var l = Math.floor(d.height / s);
                                    return new Promise(function(e) {
                                        for (
                                            var n = 0, t = void 0, a = 0;
                                            a < s;
                                            a++
                                        ) {
                                            (t = l),
                                                a + 1 === s &&
                                                    (t = d.height - l * a);
                                            var r = h.getImageData(
                                                    0,
                                                    l * a,
                                                    d.width,
                                                    t
                                                ),
                                                o = t * d.width * 4;
                                            u.execute(r, a, o, i).then(function(
                                                t
                                            ) {
                                                h.putImageData(
                                                    t.result,
                                                    0,
                                                    l * t.index
                                                ),
                                                    ++n === s &&
                                                        e(
                                                            h.getImageData(
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
                        })(e),
                        n.exports),
                        r = (a.getCanvas,
                        a.convertImageDataToCanvasURL,
                        a.applyFilter),
                        i = function(t) {
                            for (
                                var e = t.data,
                                    n = t.length,
                                    a = t.options,
                                    r =
                                        '#' === a.color.charAt(0)
                                            ? a.color.substr(1)
                                            : a.color,
                                    o = parseInt(r.substr(0, 2), 16),
                                    i = parseInt(r.substr(2, 2), 16),
                                    s = parseInt(r.substr(4, 2), 16),
                                    u = 0;
                                u < n;
                                u += 4
                            )
                                (e[u] -= (e[u] - o) * (a.level / 100)),
                                    (e[u + 1] -=
                                        (e[u + 1] - i) * (a.level / 100)),
                                    (e[u + 2] -=
                                        (e[u + 2] - s) * (a.level / 100));
                            return e;
                        };
                    (t.transform = i),
                        (t.default = function() {
                            var t =
                                    0 < arguments.length &&
                                    void 0 !== arguments[0]
                                        ? arguments[0]
                                        : {},
                                e = t.data,
                                n = t.options,
                                a = t.nWorkers;
                            if (!(e && n && n.color && n.level))
                                throw new Error(
                                    'lens-filter-colorize:: invalid options provided'
                                );
                            return r({
                                data: e,
                                transform: i,
                                options: n,
                                nWorkers: a
                            });
                        }),
                        Object.defineProperty(t, '__esModule', { value: !0 });
                })(e, n);
            })
        ),
        d = t(
            e(function(t, e) {
                !(function(t, e) {
                    e = e && e.hasOwnProperty('default') ? e.default : e;
                    var n,
                        o,
                        a = ((o = (n = { exports: {} }).exports),
                        (function(a) {
                            function r(t, e) {
                                var n = document.createElement('canvas');
                                return (n.width = t), (n.height = e), n;
                            }
                            (a =
                                a && a.hasOwnProperty('default')
                                    ? a.default
                                    : a),
                                (o.getCanvas = r),
                                (o.convertImageDataToCanvasURL = function(t) {
                                    var e = window.document.createElement(
                                            'canvas'
                                        ),
                                        n = e.getContext('2d');
                                    return (
                                        (e.width = t.width),
                                        (e.height = t.height),
                                        n.putImageData(t, 0, 0),
                                        e.toDataURL()
                                    );
                                }),
                                (o.applyFilter = function(t) {
                                    var e = t.data,
                                        n = t.transform,
                                        i = t.options,
                                        s = t.nWorkers,
                                        u = a(
                                            '\n        var transform = ' +
                                                n +
                                                ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                                        ),
                                        d = r(e.width, e.height),
                                        h = d.getContext('2d');
                                    h.putImageData(e, 0, 0), (s = s || 1);
                                    var l = Math.floor(d.height / s);
                                    return new Promise(function(e) {
                                        for (
                                            var n = 0, t = void 0, a = 0;
                                            a < s;
                                            a++
                                        ) {
                                            (t = l),
                                                a + 1 === s &&
                                                    (t = d.height - l * a);
                                            var r = h.getImageData(
                                                    0,
                                                    l * a,
                                                    d.width,
                                                    t
                                                ),
                                                o = t * d.width * 4;
                                            u.execute(r, a, o, i).then(function(
                                                t
                                            ) {
                                                h.putImageData(
                                                    t.result,
                                                    0,
                                                    l * t.index
                                                ),
                                                    ++n === s &&
                                                        e(
                                                            h.getImageData(
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
                        })(e),
                        n.exports),
                        r = (a.getCanvas,
                        a.convertImageDataToCanvasURL,
                        a.applyFilter),
                        i = function(t) {
                            for (
                                var e = t.data,
                                    n = t.length,
                                    a = t.options,
                                    r =
                                        (259 * (a.level + 255)) /
                                        (255 * (259 - a.level)),
                                    o = 0;
                                o < n;
                                o += 4
                            )
                                (e[o] = r * (e[o] - 128) + 128),
                                    (e[o + 1] = r * (e[o + 1] - 128) + 128),
                                    (e[o + 2] = r * (e[o + 2] - 128) + 128);
                            return e;
                        };
                    (t.transform = i),
                        (t.default = function() {
                            var t =
                                    0 < arguments.length &&
                                    void 0 !== arguments[0]
                                        ? arguments[0]
                                        : {},
                                e = t.data,
                                n = t.options,
                                a = t.nWorkers;
                            if (!e || !n || !n.level)
                                throw new Error(
                                    'lens-filter-contrast:: invalid options provided'
                                );
                            return r({
                                data: e,
                                transform: i,
                                options: n,
                                nWorkers: a
                            });
                        }),
                        Object.defineProperty(t, '__esModule', { value: !0 });
                })(e, n);
            })
        ),
        h = t(
            e(function(t, e) {
                !(function(t, e) {
                    e = e && e.hasOwnProperty('default') ? e.default : e;
                    var n,
                        o,
                        a = ((o = (n = { exports: {} }).exports),
                        (function(a) {
                            function r(t, e) {
                                var n = document.createElement('canvas');
                                return (n.width = t), (n.height = e), n;
                            }
                            (a =
                                a && a.hasOwnProperty('default')
                                    ? a.default
                                    : a),
                                (o.getCanvas = r),
                                (o.convertImageDataToCanvasURL = function(t) {
                                    var e = window.document.createElement(
                                            'canvas'
                                        ),
                                        n = e.getContext('2d');
                                    return (
                                        (e.width = t.width),
                                        (e.height = t.height),
                                        n.putImageData(t, 0, 0),
                                        e.toDataURL()
                                    );
                                }),
                                (o.applyFilter = function(t) {
                                    var e = t.data,
                                        n = t.transform,
                                        i = t.options,
                                        s = t.nWorkers,
                                        u = a(
                                            '\n        var transform = ' +
                                                n +
                                                ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                                        ),
                                        d = r(e.width, e.height),
                                        h = d.getContext('2d');
                                    h.putImageData(e, 0, 0), (s = s || 1);
                                    var l = Math.floor(d.height / s);
                                    return new Promise(function(e) {
                                        for (
                                            var n = 0, t = void 0, a = 0;
                                            a < s;
                                            a++
                                        ) {
                                            (t = l),
                                                a + 1 === s &&
                                                    (t = d.height - l * a);
                                            var r = h.getImageData(
                                                    0,
                                                    l * a,
                                                    d.width,
                                                    t
                                                ),
                                                o = t * d.width * 4;
                                            u.execute(r, a, o, i).then(function(
                                                t
                                            ) {
                                                h.putImageData(
                                                    t.result,
                                                    0,
                                                    l * t.index
                                                ),
                                                    ++n === s &&
                                                        e(
                                                            h.getImageData(
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
                        })(e),
                        n.exports),
                        r = (a.getCanvas,
                        a.convertImageDataToCanvasURL,
                        a.applyFilter),
                        i = function(t) {
                            for (
                                var e = t.data,
                                    n = t.length,
                                    a = t.options,
                                    r = 0;
                                r < n;
                                r += 4
                            )
                                (e[r] = 255 * Math.pow(e[r] / 255, a.level)),
                                    (e[r + 1] =
                                        255 *
                                        Math.pow(e[r + 1] / 255, a.level)),
                                    (e[r + 2] =
                                        255 *
                                        Math.pow(e[r + 2] / 255, a.level));
                            return e;
                        };
                    (t.transform = i),
                        (t.default = function() {
                            var t =
                                    0 < arguments.length &&
                                    void 0 !== arguments[0]
                                        ? arguments[0]
                                        : {},
                                e = t.data,
                                n = t.options,
                                a = t.nWorkers;
                            if (!e || !n || !n.level)
                                throw new Error(
                                    'lens-filter-gamma:: invalid options provided'
                                );
                            return r({
                                data: e,
                                transform: i,
                                options: n,
                                nWorkers: a
                            });
                        }),
                        Object.defineProperty(t, '__esModule', { value: !0 });
                })(e, n);
            })
        ),
        l = t(
            e(function(t, e) {
                !(function(t, e) {
                    e = e && e.hasOwnProperty('default') ? e.default : e;
                    var n,
                        o,
                        a = ((o = (n = { exports: {} }).exports),
                        (function(a) {
                            function r(t, e) {
                                var n = document.createElement('canvas');
                                return (n.width = t), (n.height = e), n;
                            }
                            (a =
                                a && a.hasOwnProperty('default')
                                    ? a.default
                                    : a),
                                (o.getCanvas = r),
                                (o.convertImageDataToCanvasURL = function(t) {
                                    var e = window.document.createElement(
                                            'canvas'
                                        ),
                                        n = e.getContext('2d');
                                    return (
                                        (e.width = t.width),
                                        (e.height = t.height),
                                        n.putImageData(t, 0, 0),
                                        e.toDataURL()
                                    );
                                }),
                                (o.applyFilter = function(t) {
                                    var e = t.data,
                                        n = t.transform,
                                        i = t.options,
                                        s = t.nWorkers,
                                        u = a(
                                            '\n        var transform = ' +
                                                n +
                                                ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                                        ),
                                        d = r(e.width, e.height),
                                        h = d.getContext('2d');
                                    h.putImageData(e, 0, 0), (s = s || 1);
                                    var l = Math.floor(d.height / s);
                                    return new Promise(function(e) {
                                        for (
                                            var n = 0, t = void 0, a = 0;
                                            a < s;
                                            a++
                                        ) {
                                            (t = l),
                                                a + 1 === s &&
                                                    (t = d.height - l * a);
                                            var r = h.getImageData(
                                                    0,
                                                    l * a,
                                                    d.width,
                                                    t
                                                ),
                                                o = t * d.width * 4;
                                            u.execute(r, a, o, i).then(function(
                                                t
                                            ) {
                                                h.putImageData(
                                                    t.result,
                                                    0,
                                                    l * t.index
                                                ),
                                                    ++n === s &&
                                                        e(
                                                            h.getImageData(
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
                        })(e),
                        n.exports),
                        r = (a.getCanvas,
                        a.convertImageDataToCanvasURL,
                        a.applyFilter),
                        i = function(t) {
                            for (
                                var e = t.data, n = t.length, a = 0;
                                a < n;
                                a += 4
                            ) {
                                var r =
                                    0.2126 * e[a] +
                                    0.7152 * e[a + 1] +
                                    0.0722 * e[a + 2];
                                e[a] = e[a + 1] = e[a + 2] = r;
                            }
                            return e;
                        };
                    (t.transform = i),
                        (t.default = function() {
                            var t =
                                    0 < arguments.length &&
                                    void 0 !== arguments[0]
                                        ? arguments[0]
                                        : {},
                                e = t.data,
                                n = t.nWorkers;
                            if (!e)
                                throw new Error(
                                    'lens-filter-grayscale:: invalid options provided'
                                );
                            return r({ data: e, transform: i, nWorkers: n });
                        }),
                        Object.defineProperty(t, '__esModule', { value: !0 });
                })(e, n);
            })
        ),
        f = t(
            e(function(t, e) {
                !(function(t, e) {
                    e = e && e.hasOwnProperty('default') ? e.default : e;
                    var n,
                        o,
                        a = ((o = (n = { exports: {} }).exports),
                        (function(a) {
                            function r(t, e) {
                                var n = document.createElement('canvas');
                                return (n.width = t), (n.height = e), n;
                            }
                            (a =
                                a && a.hasOwnProperty('default')
                                    ? a.default
                                    : a),
                                (o.getCanvas = r),
                                (o.convertImageDataToCanvasURL = function(t) {
                                    var e = window.document.createElement(
                                            'canvas'
                                        ),
                                        n = e.getContext('2d');
                                    return (
                                        (e.width = t.width),
                                        (e.height = t.height),
                                        n.putImageData(t, 0, 0),
                                        e.toDataURL()
                                    );
                                }),
                                (o.applyFilter = function(t) {
                                    var e = t.data,
                                        n = t.transform,
                                        i = t.options,
                                        s = t.nWorkers,
                                        u = a(
                                            '\n        var transform = ' +
                                                n +
                                                ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                                        ),
                                        d = r(e.width, e.height),
                                        h = d.getContext('2d');
                                    h.putImageData(e, 0, 0), (s = s || 1);
                                    var l = Math.floor(d.height / s);
                                    return new Promise(function(e) {
                                        for (
                                            var n = 0, t = void 0, a = 0;
                                            a < s;
                                            a++
                                        ) {
                                            (t = l),
                                                a + 1 === s &&
                                                    (t = d.height - l * a);
                                            var r = h.getImageData(
                                                    0,
                                                    l * a,
                                                    d.width,
                                                    t
                                                ),
                                                o = t * d.width * 4;
                                            u.execute(r, a, o, i).then(function(
                                                t
                                            ) {
                                                h.putImageData(
                                                    t.result,
                                                    0,
                                                    l * t.index
                                                ),
                                                    ++n === s &&
                                                        e(
                                                            h.getImageData(
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
                        })(e),
                        n.exports),
                        r = (a.getCanvas,
                        a.convertImageDataToCanvasURL,
                        a.applyFilter),
                        i = function(t) {
                            for (
                                var e = t.data, n = t.length, a = 0;
                                a < n;
                                a += 4
                            )
                                (e[a] = 255 - e[a]),
                                    (e[a + 1] = 255 - e[a + 1]),
                                    (e[a + 2] = 255 - e[a + 2]);
                            return e;
                        };
                    (t.transform = i),
                        (t.default = function() {
                            var t =
                                    0 < arguments.length &&
                                    void 0 !== arguments[0]
                                        ? arguments[0]
                                        : {},
                                e = t.data,
                                n = t.nWorkers;
                            if (!e)
                                throw new Error(
                                    'lens-filter-invert:: invalid options provided'
                                );
                            return r({ data: e, transform: i, nWorkers: n });
                        }),
                        Object.defineProperty(t, '__esModule', { value: !0 });
                })(e, n);
            })
        ),
        c = t(
            e(function(t, e) {
                !(function(t, e) {
                    e = e && e.hasOwnProperty('default') ? e.default : e;
                    var n,
                        o,
                        a = ((o = (n = { exports: {} }).exports),
                        (function(a) {
                            function r(t, e) {
                                var n = document.createElement('canvas');
                                return (n.width = t), (n.height = e), n;
                            }
                            (a =
                                a && a.hasOwnProperty('default')
                                    ? a.default
                                    : a),
                                (o.getCanvas = r),
                                (o.convertImageDataToCanvasURL = function(t) {
                                    var e = window.document.createElement(
                                            'canvas'
                                        ),
                                        n = e.getContext('2d');
                                    return (
                                        (e.width = t.width),
                                        (e.height = t.height),
                                        n.putImageData(t, 0, 0),
                                        e.toDataURL()
                                    );
                                }),
                                (o.applyFilter = function(t) {
                                    var e = t.data,
                                        n = t.transform,
                                        i = t.options,
                                        s = t.nWorkers,
                                        u = a(
                                            '\n        var transform = ' +
                                                n +
                                                ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                                        ),
                                        d = r(e.width, e.height),
                                        h = d.getContext('2d');
                                    h.putImageData(e, 0, 0), (s = s || 1);
                                    var l = Math.floor(d.height / s);
                                    return new Promise(function(e) {
                                        for (
                                            var n = 0, t = void 0, a = 0;
                                            a < s;
                                            a++
                                        ) {
                                            (t = l),
                                                a + 1 === s &&
                                                    (t = d.height - l * a);
                                            var r = h.getImageData(
                                                    0,
                                                    l * a,
                                                    d.width,
                                                    t
                                                ),
                                                o = t * d.width * 4;
                                            u.execute(r, a, o, i).then(function(
                                                t
                                            ) {
                                                h.putImageData(
                                                    t.result,
                                                    0,
                                                    l * t.index
                                                ),
                                                    ++n === s &&
                                                        e(
                                                            h.getImageData(
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
                        })(e),
                        n.exports),
                        r = (a.getCanvas,
                        a.convertImageDataToCanvasURL,
                        a.applyFilter),
                        i = function(t) {
                            for (
                                var e = t.data,
                                    n = t.length,
                                    a = t.options,
                                    r = 2.55 * Math.abs(a.level),
                                    o = function(t, e) {
                                        var n = t + e;
                                        return 255 < n ? 255 : n < 0 ? 0 : n;
                                    },
                                    i = 0;
                                i < n;
                                i += 4
                            ) {
                                var s =
                                    (Math.random() < 0.5 ? -1 : 1) *
                                    (Math.random() + r);
                                (e[i] = o(e[i], s)),
                                    (e[i + 1] = o(e[i + 1], s)),
                                    (e[i + 2] = o(e[i + 2], s));
                            }
                            return e;
                        };
                    (t.transform = i),
                        (t.default = function() {
                            var t =
                                    0 < arguments.length &&
                                    void 0 !== arguments[0]
                                        ? arguments[0]
                                        : {},
                                e = t.data,
                                n = t.options,
                                a = t.nWorkers;
                            if (!e || !n || !n.level)
                                throw new Error(
                                    'lens-filter-noise:: invalid options provided'
                                );
                            return r({
                                data: e,
                                transform: i,
                                options: n,
                                nWorkers: a
                            });
                        }),
                        Object.defineProperty(t, '__esModule', { value: !0 });
                })(e, n);
            })
        ),
        v = t(
            e(function(t, e) {
                !(function(t, e) {
                    e = e && e.hasOwnProperty('default') ? e.default : e;
                    var n,
                        o,
                        a = ((o = (n = { exports: {} }).exports),
                        (function(a) {
                            function r(t, e) {
                                var n = document.createElement('canvas');
                                return (n.width = t), (n.height = e), n;
                            }
                            (a =
                                a && a.hasOwnProperty('default')
                                    ? a.default
                                    : a),
                                (o.getCanvas = r),
                                (o.convertImageDataToCanvasURL = function(t) {
                                    var e = window.document.createElement(
                                            'canvas'
                                        ),
                                        n = e.getContext('2d');
                                    return (
                                        (e.width = t.width),
                                        (e.height = t.height),
                                        n.putImageData(t, 0, 0),
                                        e.toDataURL()
                                    );
                                }),
                                (o.applyFilter = function(t) {
                                    var e = t.data,
                                        n = t.transform,
                                        i = t.options,
                                        s = t.nWorkers,
                                        u = a(
                                            '\n        var transform = ' +
                                                n +
                                                ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                                        ),
                                        d = r(e.width, e.height),
                                        h = d.getContext('2d');
                                    h.putImageData(e, 0, 0), (s = s || 1);
                                    var l = Math.floor(d.height / s);
                                    return new Promise(function(e) {
                                        for (
                                            var n = 0, t = void 0, a = 0;
                                            a < s;
                                            a++
                                        ) {
                                            (t = l),
                                                a + 1 === s &&
                                                    (t = d.height - l * a);
                                            var r = h.getImageData(
                                                    0,
                                                    l * a,
                                                    d.width,
                                                    t
                                                ),
                                                o = t * d.width * 4;
                                            u.execute(r, a, o, i).then(function(
                                                t
                                            ) {
                                                h.putImageData(
                                                    t.result,
                                                    0,
                                                    l * t.index
                                                ),
                                                    ++n === s &&
                                                        e(
                                                            h.getImageData(
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
                        })(e),
                        n.exports),
                        r = (a.getCanvas,
                        a.convertImageDataToCanvasURL,
                        a.applyFilter),
                        i = function(t) {
                            for (
                                var e = t.data, n = t.length, a = 0;
                                a < n;
                                a += 4
                            ) {
                                var r = e[a],
                                    o = e[a + 1],
                                    i = e[a + 2];
                                (e[a] = 0.393 * r + 0.769 * o + 0.189 * i),
                                    (e[a + 1] =
                                        0.349 * r + 0.686 * o + 0.168 * i),
                                    (e[a + 2] =
                                        0.272 * r + 0.534 * o + 0.131 * i);
                            }
                            return e;
                        };
                    (t.transform = i),
                        (t.default = function() {
                            var t =
                                    0 < arguments.length &&
                                    void 0 !== arguments[0]
                                        ? arguments[0]
                                        : {},
                                e = t.data,
                                n = t.nWorkers;
                            if (!e)
                                throw new Error(
                                    'lens-filter-sepia:: invalid options provided'
                                );
                            return r({ data: e, transform: i, nWorkers: n });
                        }),
                        Object.defineProperty(t, '__esModule', { value: !0 });
                })(e, n);
            })
        ),
        g = t(
            e(function(t, e) {
                !(function(t, e) {
                    e = e && e.hasOwnProperty('default') ? e.default : e;
                    var n,
                        o,
                        a = ((o = (n = { exports: {} }).exports),
                        (function(a) {
                            function r(t, e) {
                                var n = document.createElement('canvas');
                                return (n.width = t), (n.height = e), n;
                            }
                            (a =
                                a && a.hasOwnProperty('default')
                                    ? a.default
                                    : a),
                                (o.getCanvas = r),
                                (o.convertImageDataToCanvasURL = function(t) {
                                    var e = window.document.createElement(
                                            'canvas'
                                        ),
                                        n = e.getContext('2d');
                                    return (
                                        (e.width = t.width),
                                        (e.height = t.height),
                                        n.putImageData(t, 0, 0),
                                        e.toDataURL()
                                    );
                                }),
                                (o.applyFilter = function(t) {
                                    var e = t.data,
                                        n = t.transform,
                                        i = t.options,
                                        s = t.nWorkers,
                                        u = a(
                                            '\n        var transform = ' +
                                                n +
                                                ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                                        ),
                                        d = r(e.width, e.height),
                                        h = d.getContext('2d');
                                    h.putImageData(e, 0, 0), (s = s || 1);
                                    var l = Math.floor(d.height / s);
                                    return new Promise(function(e) {
                                        for (
                                            var n = 0, t = void 0, a = 0;
                                            a < s;
                                            a++
                                        ) {
                                            (t = l),
                                                a + 1 === s &&
                                                    (t = d.height - l * a);
                                            var r = h.getImageData(
                                                    0,
                                                    l * a,
                                                    d.width,
                                                    t
                                                ),
                                                o = t * d.width * 4;
                                            u.execute(r, a, o, i).then(function(
                                                t
                                            ) {
                                                h.putImageData(
                                                    t.result,
                                                    0,
                                                    l * t.index
                                                ),
                                                    ++n === s &&
                                                        e(
                                                            h.getImageData(
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
                        })(e),
                        n.exports),
                        r = (a.getCanvas,
                        a.convertImageDataToCanvasURL,
                        a.applyFilter),
                        i = function(t) {
                            for (
                                var e = t.data,
                                    n = t.length,
                                    a = t.options,
                                    r = 0;
                                r < n;
                                r += 4
                            ) {
                                var o =
                                    0.2126 * e[r] +
                                        0.7152 * e[r + 1] +
                                        0.0722 * e[r + 2] >=
                                    a.level
                                        ? 255
                                        : 0;
                                e[r] = e[r + 1] = e[r + 2] = o;
                            }
                            return e;
                        };
                    (t.transform = i),
                        (t.default = function() {
                            var t =
                                    0 < arguments.length &&
                                    void 0 !== arguments[0]
                                        ? arguments[0]
                                        : {},
                                e = t.data,
                                n = t.options,
                                a = t.nWorkers;
                            if (!e || !n || !n.level)
                                throw new Error(
                                    'lens-filter-threshold:: invalid options provided'
                                );
                            return r({
                                data: e,
                                transform: i,
                                options: n,
                                nWorkers: a
                            });
                        }),
                        Object.defineProperty(t, '__esModule', { value: !0 });
                })(e, n);
            })
        );
    function p(t) {
        if (!t) throw new Error('lens-chainable:: no selector provided');
        var e = document.querySelectorAll(t)[0];
        if (!e) throw new Error('lens-chainable:: no "to" element found');
        return e;
    }
    var m = (function() {
        function a(t, e) {
            for (var n = 0; n < e.length; n++) {
                var a = e[n];
                (a.enumerable = a.enumerable || !1),
                    (a.configurable = !0),
                    'value' in a && (a.writable = !0),
                    Object.defineProperty(t, a.key, a);
            }
        }
        return function(t, e, n) {
            return e && a(t.prototype, e), n && a(t, n), t;
        };
    })();
    var w = {
            brightness: i,
            color: s,
            colorize: u,
            contrast: d,
            gamma: h,
            grayscale: l,
            invert: f,
            noise: c,
            sepia: v,
            threshold: g
        },
        x = function(t) {
            if (t.data) return t.data;
            var e = (function(t) {
                    if (t.url) {
                        var e = document.createElement('img');
                        return e.setAttribute('src', t.url), e;
                    }
                    return p(t.from);
                })(t),
                n = r(e.width, e.height);
            return (function(t, e, n) {
                if ('IMG' !== n.tagName)
                    throw new Error('lens-chainable:: invalid origin');
                return (
                    e.drawImage(n, 0, 0),
                    e.getImageData(0, 0, t.width, t.height)
                );
            })(n, n.getContext('2d'), e);
        },
        D = (function() {
            function e() {
                var t =
                    0 < arguments.length && void 0 !== arguments[0]
                        ? arguments[0]
                        : {};
                if (
                    ((function(t, e) {
                        if (!(t instanceof e))
                            throw new TypeError(
                                'Cannot call a class as a function'
                            );
                    })(this, e),
                    !t.url && !t.data && !t.from)
                )
                    throw new Error('lens-chainable:: invalid options object');
                if (((this.data = x(t)), !this.data))
                    throw new Error('lens-chainable:: no data found');
                (this.filters = []),
                    (this.nWorkers = t.nWorkers),
                    (this.url = t.url),
                    (this.from = t.from);
            }
            return (
                m(e, [
                    {
                        key: 'applyFilters',
                        value: function() {
                            var n = this,
                                t = Promise.resolve(this.data);
                            return this.filters
                                .reduce(function(t, e) {
                                    return t.then(function(t) {
                                        return (0,
                                        w[
                                            e.filter
                                        ])({ data: t, options: e.options, nWorkers: n.nWorkers });
                                    });
                                }, t)
                                .then(function(t) {
                                    return (n.data = t);
                                });
                        }
                    },
                    {
                        key: 'append',
                        value: function(a) {
                            return this.applyFilters().then(function(t) {
                                var e = p(a),
                                    n = document.createElement('img');
                                n.setAttribute('src', o(t)), e.appendChild(n);
                            });
                        }
                    },
                    {
                        key: 'update',
                        value: function(e) {
                            return this.applyFilters().then(function(t) {
                                p(e).setAttribute('src', o(t));
                            });
                        }
                    },
                    {
                        key: 'getDataURL',
                        value: function() {
                            return o(this.data);
                        }
                    }
                ]),
                e
            );
        })();
    return (
        Object.keys(w).forEach(function(e) {
            D.prototype[e] = function(t) {
                return this.filters.push({ filter: e, options: t }), this;
            };
        }),
        D
    );
});
//# sourceMappingURL=lens-chainable.umd.js.map
