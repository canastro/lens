!(function(t, e) {
    'object' == typeof exports && 'undefined' != typeof module
        ? (module.exports = e())
        : 'function' == typeof define && define.amd
            ? define(e)
            : (t.lensCore = e());
})(this, function() {
    'use strict';
    var i =
        'undefined' != typeof window
            ? window
            : 'undefined' != typeof global
                ? global
                : 'undefined' != typeof self
                    ? self
                    : {};
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
    var n = e(function(t, e) {
            !(function() {
                function h(o, i, s) {
                    o.addEventListener('message', function(t) {
                        var e = t.data,
                            n = e.id;
                        if ('RPC' === e.type && null != n)
                            if (e.method) {
                                var r = i[e.method];
                                null == r
                                    ? o.postMessage({
                                          type: 'RPC',
                                          id: n,
                                          error: 'NO_SUCH_METHOD'
                                      })
                                    : Promise.resolve()
                                          .then(function() {
                                              return r.apply(null, e.params);
                                          })
                                          .then(function(t) {
                                              o.postMessage({
                                                  type: 'RPC',
                                                  id: n,
                                                  result: t
                                              });
                                          })
                                          .catch(function(t) {
                                              o.postMessage({
                                                  type: 'RPC',
                                                  id: n,
                                                  error: '' + t
                                              });
                                          });
                            } else {
                                var a = s[n];
                                if (null == a)
                                    throw Error('Unknown callback ' + n);
                                delete s[n],
                                    e.error
                                        ? a[1](Error(e.error))
                                        : a[0](e.result);
                            }
                    });
                }
                function r(t, e) {
                    var n = document.createElement('canvas');
                    return (n.width = t), (n.height = e), n;
                }
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
                            u = (function(t, e) {
                                var n,
                                    o,
                                    i,
                                    r = this,
                                    a = {},
                                    s =
                                        '__xpo' +
                                        Math.random()
                                            .toString()
                                            .substring(2) +
                                        '__';
                                'function' == typeof t &&
                                    (t =
                                        '(' +
                                        Function.prototype.toString.call(t) +
                                        ')(' +
                                        s +
                                        ')'),
                                    (o = s),
                                    (i = a),
                                    (n = (n = (n = t).replace(
                                        /^(\s*)export\s+default\s+/m,
                                        function(t, e) {
                                            return (
                                                (i.default = !0),
                                                '' + e + o + '.default='
                                            );
                                        }
                                    )).replace(
                                        /^(\s*)export\s+((?:async\s*)?function(?:\s*\*)?|const|let|var)(\s+)([a-zA-Z$_][a-zA-Z0-9$_]*)/gm,
                                        function(t, e, n, r, a) {
                                            return (
                                                (i[a] = !0),
                                                '' +
                                                    e +
                                                    o +
                                                    '.' +
                                                    a +
                                                    '=' +
                                                    n +
                                                    r +
                                                    a
                                            );
                                        }
                                    )),
                                    (t =
                                        'var ' +
                                        o +
                                        '={};\n' +
                                        n +
                                        '\n' +
                                        o +
                                        ';\n(' +
                                        Function.prototype.toString.call(h) +
                                        ')(self,' +
                                        s +
                                        ',{})');
                                var u,
                                    c = URL.createObjectURL(new Blob([t])),
                                    l = new Worker(c, e),
                                    f = l.terminate,
                                    d = {},
                                    p = 0;
                                for (u in ((l.kill = function(t) {
                                    l.postMessage({ type: 'KILL', signal: t }),
                                        setTimeout(l.terminate);
                                }),
                                (l.terminate = function() {
                                    URL.revokeObjectURL(c), f.call(r);
                                }),
                                (l.call = function(r, a) {
                                    return new Promise(function(t, e) {
                                        var n = 'rpc' + ++p;
                                        (d[n] = [t, e]),
                                            l.postMessage({
                                                type: 'RPC',
                                                id: n,
                                                method: r,
                                                params: a
                                            });
                                    });
                                }),
                                (l.rpcMethods = {}),
                                h(l, l.rpcMethods, d),
                                (l.expose = function(t) {
                                    l[u] = function() {
                                        return l.call(
                                            t,
                                            [].slice.call(arguments)
                                        );
                                    };
                                }),
                                a))
                                    u in l || l.expose(u);
                                return l;
                            })(
                                '\n        var transform = ' +
                                    n +
                                    ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                            ),
                            c = r(e.width, e.height),
                            l = c.getContext('2d');
                        l.putImageData(e, 0, 0), (s = s || 1);
                        var f = Math.floor(c.height / s);
                        return new Promise(function(e) {
                            for (var n = 0, t = void 0, r = 0; r < s; r++) {
                                (t = f), r + 1 === s && (t = c.height - f * r);
                                var a = l.getImageData(0, f * r, c.width, t),
                                    o = t * c.width * 4;
                                u.execute(a, r, o, i).then(function(t) {
                                    l.putImageData(t.result, 0, f * t.index),
                                        ++n === s &&
                                            e(
                                                l.getImageData(
                                                    0,
                                                    0,
                                                    c.width,
                                                    c.height
                                                )
                                            );
                                });
                            }
                        });
                    });
            })();
        }),
        r = n.getCanvas,
        a = n.convertImageDataToCanvasURL,
        o = (n.applyFilter,
        t(
            e(function(t, e) {
                !(function(t) {
                    'undefined' != typeof window
                        ? window
                        : void 0 !== i || ('undefined' != typeof self && self);
                    var e,
                        n = ((function(t, e) {
                            !(function() {
                                function h(o, i, s) {
                                    o.addEventListener('message', function(t) {
                                        var e = t.data,
                                            n = e.id;
                                        if ('RPC' === e.type && null != n)
                                            if (e.method) {
                                                var r = i[e.method];
                                                null == r
                                                    ? o.postMessage({
                                                          type: 'RPC',
                                                          id: n,
                                                          error:
                                                              'NO_SUCH_METHOD'
                                                      })
                                                    : Promise.resolve()
                                                          .then(function() {
                                                              return r.apply(
                                                                  null,
                                                                  e.params
                                                              );
                                                          })
                                                          .then(function(t) {
                                                              o.postMessage({
                                                                  type: 'RPC',
                                                                  id: n,
                                                                  result: t
                                                              });
                                                          })
                                                          .catch(function(t) {
                                                              o.postMessage({
                                                                  type: 'RPC',
                                                                  id: n,
                                                                  error: '' + t
                                                              });
                                                          });
                                            } else {
                                                var a = s[n];
                                                if (null == a)
                                                    throw Error(
                                                        'Unknown callback ' + n
                                                    );
                                                delete s[n],
                                                    e.error
                                                        ? a[1](Error(e.error))
                                                        : a[0](e.result);
                                            }
                                    });
                                }
                                function r(t, e) {
                                    var n = document.createElement('canvas');
                                    return (n.width = t), (n.height = e), n;
                                }
                                (e.getCanvas = r),
                                    (e.convertImageDataToCanvasURL = function(
                                        t
                                    ) {
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
                                    (e.applyFilter = function(t) {
                                        var e = t.data,
                                            n = t.transform,
                                            i = t.options,
                                            s = t.nWorkers,
                                            u = (function(t, e) {
                                                var n,
                                                    o,
                                                    i,
                                                    r = this,
                                                    a = {},
                                                    s =
                                                        '__xpo' +
                                                        Math.random()
                                                            .toString()
                                                            .substring(2) +
                                                        '__';
                                                'function' == typeof t &&
                                                    (t =
                                                        '(' +
                                                        Function.prototype.toString.call(
                                                            t
                                                        ) +
                                                        ')(' +
                                                        s +
                                                        ')'),
                                                    (o = s),
                                                    (i = a),
                                                    (n = (n = (n = t).replace(
                                                        /^(\s*)export\s+default\s+/m,
                                                        function(t, e) {
                                                            return (
                                                                (i.default = !0),
                                                                '' +
                                                                    e +
                                                                    o +
                                                                    '.default='
                                                            );
                                                        }
                                                    )).replace(
                                                        /^(\s*)export\s+((?:async\s*)?function(?:\s*\*)?|const|let|var)(\s+)([a-zA-Z$_][a-zA-Z0-9$_]*)/gm,
                                                        function(
                                                            t,
                                                            e,
                                                            n,
                                                            r,
                                                            a
                                                        ) {
                                                            return (
                                                                (i[a] = !0),
                                                                '' +
                                                                    e +
                                                                    o +
                                                                    '.' +
                                                                    a +
                                                                    '=' +
                                                                    n +
                                                                    r +
                                                                    a
                                                            );
                                                        }
                                                    )),
                                                    (t =
                                                        'var ' +
                                                        o +
                                                        '={};\n' +
                                                        n +
                                                        '\n' +
                                                        o +
                                                        ';\n(' +
                                                        Function.prototype.toString.call(
                                                            h
                                                        ) +
                                                        ')(self,' +
                                                        s +
                                                        ',{})');
                                                var u,
                                                    c = URL.createObjectURL(
                                                        new Blob([t])
                                                    ),
                                                    l = new Worker(c, e),
                                                    f = l.terminate,
                                                    d = {},
                                                    p = 0;
                                                for (u in ((l.kill = function(
                                                    t
                                                ) {
                                                    l.postMessage({
                                                        type: 'KILL',
                                                        signal: t
                                                    }),
                                                        setTimeout(l.terminate);
                                                }),
                                                (l.terminate = function() {
                                                    URL.revokeObjectURL(c),
                                                        f.call(r);
                                                }),
                                                (l.call = function(r, a) {
                                                    return new Promise(function(
                                                        t,
                                                        e
                                                    ) {
                                                        var n = 'rpc' + ++p;
                                                        (d[n] = [t, e]),
                                                            l.postMessage({
                                                                type: 'RPC',
                                                                id: n,
                                                                method: r,
                                                                params: a
                                                            });
                                                    });
                                                }),
                                                (l.rpcMethods = {}),
                                                h(l, l.rpcMethods, d),
                                                (l.expose = function(t) {
                                                    l[u] = function() {
                                                        return l.call(
                                                            t,
                                                            [].slice.call(
                                                                arguments
                                                            )
                                                        );
                                                    };
                                                }),
                                                a))
                                                    u in l || l.expose(u);
                                                return l;
                                            })(
                                                '\n        var transform = ' +
                                                    n +
                                                    ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                                            ),
                                            c = r(e.width, e.height),
                                            l = c.getContext('2d');
                                        l.putImageData(e, 0, 0), (s = s || 1);
                                        var f = Math.floor(c.height / s);
                                        return new Promise(function(e) {
                                            for (
                                                var n = 0, t = void 0, r = 0;
                                                r < s;
                                                r++
                                            ) {
                                                (t = f),
                                                    r + 1 === s &&
                                                        (t = c.height - f * r);
                                                var a = l.getImageData(
                                                        0,
                                                        f * r,
                                                        c.width,
                                                        t
                                                    ),
                                                    o = t * c.width * 4;
                                                u.execute(a, r, o, i).then(
                                                    function(t) {
                                                        l.putImageData(
                                                            t.result,
                                                            0,
                                                            f * t.index
                                                        ),
                                                            ++n === s &&
                                                                e(
                                                                    l.getImageData(
                                                                        0,
                                                                        0,
                                                                        c.width,
                                                                        c.height
                                                                    )
                                                                );
                                                    }
                                                );
                                            }
                                        });
                                    });
                            })();
                        })((e = { exports: {} }), e.exports),
                        e.exports),
                        a = (n.getCanvas,
                        n.convertImageDataToCanvasURL,
                        n.applyFilter),
                        o = function(t) {
                            for (
                                var e = t.data,
                                    n = t.length,
                                    r = t.options,
                                    a = 0;
                                a < n;
                                a += 4
                            )
                                (e[a] += r.adjustment),
                                    (e[a + 1] += r.adjustment),
                                    (e[a + 2] += r.adjustment);
                            return e;
                        };
                    (t.transform = o),
                        (t.default = function() {
                            var t =
                                    0 < arguments.length &&
                                    void 0 !== arguments[0]
                                        ? arguments[0]
                                        : {},
                                e = t.data,
                                n = t.options,
                                r = t.nWorkers;
                            if (!e || !n || !n.adjustment)
                                throw new Error(
                                    'lens-filter-brightness:: invalid options provided'
                                );
                            return a({
                                data: e,
                                transform: o,
                                options: n,
                                nWorkers: r
                            });
                        }),
                        Object.defineProperty(t, '__esModule', { value: !0 });
                })(e);
            })
        )),
        s = t(
            e(function(t, e) {
                !(function(t) {
                    'undefined' != typeof window
                        ? window
                        : void 0 !== i || ('undefined' != typeof self && self);
                    var e,
                        n = ((function(t, e) {
                            !(function() {
                                function h(o, i, s) {
                                    o.addEventListener('message', function(t) {
                                        var e = t.data,
                                            n = e.id;
                                        if ('RPC' === e.type && null != n)
                                            if (e.method) {
                                                var r = i[e.method];
                                                null == r
                                                    ? o.postMessage({
                                                          type: 'RPC',
                                                          id: n,
                                                          error:
                                                              'NO_SUCH_METHOD'
                                                      })
                                                    : Promise.resolve()
                                                          .then(function() {
                                                              return r.apply(
                                                                  null,
                                                                  e.params
                                                              );
                                                          })
                                                          .then(function(t) {
                                                              o.postMessage({
                                                                  type: 'RPC',
                                                                  id: n,
                                                                  result: t
                                                              });
                                                          })
                                                          .catch(function(t) {
                                                              o.postMessage({
                                                                  type: 'RPC',
                                                                  id: n,
                                                                  error: '' + t
                                                              });
                                                          });
                                            } else {
                                                var a = s[n];
                                                if (null == a)
                                                    throw Error(
                                                        'Unknown callback ' + n
                                                    );
                                                delete s[n],
                                                    e.error
                                                        ? a[1](Error(e.error))
                                                        : a[0](e.result);
                                            }
                                    });
                                }
                                function r(t, e) {
                                    var n = document.createElement('canvas');
                                    return (n.width = t), (n.height = e), n;
                                }
                                (e.getCanvas = r),
                                    (e.convertImageDataToCanvasURL = function(
                                        t
                                    ) {
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
                                    (e.applyFilter = function(t) {
                                        var e = t.data,
                                            n = t.transform,
                                            i = t.options,
                                            s = t.nWorkers,
                                            u = (function(t, e) {
                                                var n,
                                                    o,
                                                    i,
                                                    r = this,
                                                    a = {},
                                                    s =
                                                        '__xpo' +
                                                        Math.random()
                                                            .toString()
                                                            .substring(2) +
                                                        '__';
                                                'function' == typeof t &&
                                                    (t =
                                                        '(' +
                                                        Function.prototype.toString.call(
                                                            t
                                                        ) +
                                                        ')(' +
                                                        s +
                                                        ')'),
                                                    (o = s),
                                                    (i = a),
                                                    (n = (n = (n = t).replace(
                                                        /^(\s*)export\s+default\s+/m,
                                                        function(t, e) {
                                                            return (
                                                                (i.default = !0),
                                                                '' +
                                                                    e +
                                                                    o +
                                                                    '.default='
                                                            );
                                                        }
                                                    )).replace(
                                                        /^(\s*)export\s+((?:async\s*)?function(?:\s*\*)?|const|let|var)(\s+)([a-zA-Z$_][a-zA-Z0-9$_]*)/gm,
                                                        function(
                                                            t,
                                                            e,
                                                            n,
                                                            r,
                                                            a
                                                        ) {
                                                            return (
                                                                (i[a] = !0),
                                                                '' +
                                                                    e +
                                                                    o +
                                                                    '.' +
                                                                    a +
                                                                    '=' +
                                                                    n +
                                                                    r +
                                                                    a
                                                            );
                                                        }
                                                    )),
                                                    (t =
                                                        'var ' +
                                                        o +
                                                        '={};\n' +
                                                        n +
                                                        '\n' +
                                                        o +
                                                        ';\n(' +
                                                        Function.prototype.toString.call(
                                                            h
                                                        ) +
                                                        ')(self,' +
                                                        s +
                                                        ',{})');
                                                var u,
                                                    c = URL.createObjectURL(
                                                        new Blob([t])
                                                    ),
                                                    l = new Worker(c, e),
                                                    f = l.terminate,
                                                    d = {},
                                                    p = 0;
                                                for (u in ((l.kill = function(
                                                    t
                                                ) {
                                                    l.postMessage({
                                                        type: 'KILL',
                                                        signal: t
                                                    }),
                                                        setTimeout(l.terminate);
                                                }),
                                                (l.terminate = function() {
                                                    URL.revokeObjectURL(c),
                                                        f.call(r);
                                                }),
                                                (l.call = function(r, a) {
                                                    return new Promise(function(
                                                        t,
                                                        e
                                                    ) {
                                                        var n = 'rpc' + ++p;
                                                        (d[n] = [t, e]),
                                                            l.postMessage({
                                                                type: 'RPC',
                                                                id: n,
                                                                method: r,
                                                                params: a
                                                            });
                                                    });
                                                }),
                                                (l.rpcMethods = {}),
                                                h(l, l.rpcMethods, d),
                                                (l.expose = function(t) {
                                                    l[u] = function() {
                                                        return l.call(
                                                            t,
                                                            [].slice.call(
                                                                arguments
                                                            )
                                                        );
                                                    };
                                                }),
                                                a))
                                                    u in l || l.expose(u);
                                                return l;
                                            })(
                                                '\n        var transform = ' +
                                                    n +
                                                    ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                                            ),
                                            c = r(e.width, e.height),
                                            l = c.getContext('2d');
                                        l.putImageData(e, 0, 0), (s = s || 1);
                                        var f = Math.floor(c.height / s);
                                        return new Promise(function(e) {
                                            for (
                                                var n = 0, t = void 0, r = 0;
                                                r < s;
                                                r++
                                            ) {
                                                (t = f),
                                                    r + 1 === s &&
                                                        (t = c.height - f * r);
                                                var a = l.getImageData(
                                                        0,
                                                        f * r,
                                                        c.width,
                                                        t
                                                    ),
                                                    o = t * c.width * 4;
                                                u.execute(a, r, o, i).then(
                                                    function(t) {
                                                        l.putImageData(
                                                            t.result,
                                                            0,
                                                            f * t.index
                                                        ),
                                                            ++n === s &&
                                                                e(
                                                                    l.getImageData(
                                                                        0,
                                                                        0,
                                                                        c.width,
                                                                        c.height
                                                                    )
                                                                );
                                                    }
                                                );
                                            }
                                        });
                                    });
                            })();
                        })((e = { exports: {} }), e.exports),
                        e.exports),
                        a = (n.getCanvas,
                        n.convertImageDataToCanvasURL,
                        n.applyFilter),
                        o = function(t) {
                            for (
                                var c = t.data,
                                    e = t.length,
                                    n = t.options,
                                    r = function(t) {
                                        return (
                                            !isNaN(parseFloat(t)) && isFinite(t)
                                        );
                                    },
                                    l = function(t, e, n) {
                                        (t[e] = r(n.r) ? n.r : t[e]),
                                            (t[e + 1] = r(n.g)
                                                ? n.g
                                                : t[e + 1]),
                                            (t[e + 2] = r(n.b)
                                                ? n.b
                                                : t[e + 2]),
                                            (t[e + 3] = r(n.a)
                                                ? n.a
                                                : t[e + 3]);
                                    },
                                    a = function(u) {
                                        n.colorsInterval.forEach(function(t) {
                                            var e,
                                                n,
                                                r,
                                                a,
                                                o,
                                                i,
                                                s = ((r = t),
                                                (a = (e = c)[(n = u)]),
                                                (o = e[n + 1]),
                                                (i = e[n + 2]),
                                                a >= r.from.r &&
                                                    a <= r.to.r &&
                                                    o >= r.from.g &&
                                                    o <= r.to.g &&
                                                    i >= r.from.b &&
                                                    i <= r.to.b);
                                            s && t.match
                                                ? l(c, u, t.match)
                                                : !s &&
                                                  t.noMatch &&
                                                  l(c, u, t.noMatch);
                                        });
                                    },
                                    o = 0;
                                o < e;
                                o += 4
                            )
                                a(o);
                            return c;
                        };
                    (t.transform = o),
                        (t.default = function() {
                            var t =
                                    0 < arguments.length &&
                                    void 0 !== arguments[0]
                                        ? arguments[0]
                                        : {},
                                e = t.data,
                                n = t.options,
                                r = t.nWorkers;
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
                            return a({
                                data: e,
                                transform: o,
                                options: n,
                                nWorkers: r
                            });
                        }),
                        Object.defineProperty(t, '__esModule', { value: !0 });
                })(e);
            })
        ),
        u = t(
            e(function(t, e) {
                !(function(t) {
                    'undefined' != typeof window
                        ? window
                        : void 0 !== i || ('undefined' != typeof self && self);
                    var e,
                        n = ((function(t, e) {
                            !(function() {
                                function h(o, i, s) {
                                    o.addEventListener('message', function(t) {
                                        var e = t.data,
                                            n = e.id;
                                        if ('RPC' === e.type && null != n)
                                            if (e.method) {
                                                var r = i[e.method];
                                                null == r
                                                    ? o.postMessage({
                                                          type: 'RPC',
                                                          id: n,
                                                          error:
                                                              'NO_SUCH_METHOD'
                                                      })
                                                    : Promise.resolve()
                                                          .then(function() {
                                                              return r.apply(
                                                                  null,
                                                                  e.params
                                                              );
                                                          })
                                                          .then(function(t) {
                                                              o.postMessage({
                                                                  type: 'RPC',
                                                                  id: n,
                                                                  result: t
                                                              });
                                                          })
                                                          .catch(function(t) {
                                                              o.postMessage({
                                                                  type: 'RPC',
                                                                  id: n,
                                                                  error: '' + t
                                                              });
                                                          });
                                            } else {
                                                var a = s[n];
                                                if (null == a)
                                                    throw Error(
                                                        'Unknown callback ' + n
                                                    );
                                                delete s[n],
                                                    e.error
                                                        ? a[1](Error(e.error))
                                                        : a[0](e.result);
                                            }
                                    });
                                }
                                function r(t, e) {
                                    var n = document.createElement('canvas');
                                    return (n.width = t), (n.height = e), n;
                                }
                                (e.getCanvas = r),
                                    (e.convertImageDataToCanvasURL = function(
                                        t
                                    ) {
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
                                    (e.applyFilter = function(t) {
                                        var e = t.data,
                                            n = t.transform,
                                            i = t.options,
                                            s = t.nWorkers,
                                            u = (function(t, e) {
                                                var n,
                                                    o,
                                                    i,
                                                    r = this,
                                                    a = {},
                                                    s =
                                                        '__xpo' +
                                                        Math.random()
                                                            .toString()
                                                            .substring(2) +
                                                        '__';
                                                'function' == typeof t &&
                                                    (t =
                                                        '(' +
                                                        Function.prototype.toString.call(
                                                            t
                                                        ) +
                                                        ')(' +
                                                        s +
                                                        ')'),
                                                    (o = s),
                                                    (i = a),
                                                    (n = (n = (n = t).replace(
                                                        /^(\s*)export\s+default\s+/m,
                                                        function(t, e) {
                                                            return (
                                                                (i.default = !0),
                                                                '' +
                                                                    e +
                                                                    o +
                                                                    '.default='
                                                            );
                                                        }
                                                    )).replace(
                                                        /^(\s*)export\s+((?:async\s*)?function(?:\s*\*)?|const|let|var)(\s+)([a-zA-Z$_][a-zA-Z0-9$_]*)/gm,
                                                        function(
                                                            t,
                                                            e,
                                                            n,
                                                            r,
                                                            a
                                                        ) {
                                                            return (
                                                                (i[a] = !0),
                                                                '' +
                                                                    e +
                                                                    o +
                                                                    '.' +
                                                                    a +
                                                                    '=' +
                                                                    n +
                                                                    r +
                                                                    a
                                                            );
                                                        }
                                                    )),
                                                    (t =
                                                        'var ' +
                                                        o +
                                                        '={};\n' +
                                                        n +
                                                        '\n' +
                                                        o +
                                                        ';\n(' +
                                                        Function.prototype.toString.call(
                                                            h
                                                        ) +
                                                        ')(self,' +
                                                        s +
                                                        ',{})');
                                                var u,
                                                    c = URL.createObjectURL(
                                                        new Blob([t])
                                                    ),
                                                    l = new Worker(c, e),
                                                    f = l.terminate,
                                                    d = {},
                                                    p = 0;
                                                for (u in ((l.kill = function(
                                                    t
                                                ) {
                                                    l.postMessage({
                                                        type: 'KILL',
                                                        signal: t
                                                    }),
                                                        setTimeout(l.terminate);
                                                }),
                                                (l.terminate = function() {
                                                    URL.revokeObjectURL(c),
                                                        f.call(r);
                                                }),
                                                (l.call = function(r, a) {
                                                    return new Promise(function(
                                                        t,
                                                        e
                                                    ) {
                                                        var n = 'rpc' + ++p;
                                                        (d[n] = [t, e]),
                                                            l.postMessage({
                                                                type: 'RPC',
                                                                id: n,
                                                                method: r,
                                                                params: a
                                                            });
                                                    });
                                                }),
                                                (l.rpcMethods = {}),
                                                h(l, l.rpcMethods, d),
                                                (l.expose = function(t) {
                                                    l[u] = function() {
                                                        return l.call(
                                                            t,
                                                            [].slice.call(
                                                                arguments
                                                            )
                                                        );
                                                    };
                                                }),
                                                a))
                                                    u in l || l.expose(u);
                                                return l;
                                            })(
                                                '\n        var transform = ' +
                                                    n +
                                                    ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                                            ),
                                            c = r(e.width, e.height),
                                            l = c.getContext('2d');
                                        l.putImageData(e, 0, 0), (s = s || 1);
                                        var f = Math.floor(c.height / s);
                                        return new Promise(function(e) {
                                            for (
                                                var n = 0, t = void 0, r = 0;
                                                r < s;
                                                r++
                                            ) {
                                                (t = f),
                                                    r + 1 === s &&
                                                        (t = c.height - f * r);
                                                var a = l.getImageData(
                                                        0,
                                                        f * r,
                                                        c.width,
                                                        t
                                                    ),
                                                    o = t * c.width * 4;
                                                u.execute(a, r, o, i).then(
                                                    function(t) {
                                                        l.putImageData(
                                                            t.result,
                                                            0,
                                                            f * t.index
                                                        ),
                                                            ++n === s &&
                                                                e(
                                                                    l.getImageData(
                                                                        0,
                                                                        0,
                                                                        c.width,
                                                                        c.height
                                                                    )
                                                                );
                                                    }
                                                );
                                            }
                                        });
                                    });
                            })();
                        })((e = { exports: {} }), e.exports),
                        e.exports),
                        a = (n.getCanvas,
                        n.convertImageDataToCanvasURL,
                        n.applyFilter),
                        o = function(t) {
                            for (
                                var e = t.data,
                                    n = t.length,
                                    r = t.options,
                                    a =
                                        '#' === r.color.charAt(0)
                                            ? r.color.substr(1)
                                            : r.color,
                                    o = {
                                        r: parseInt(a.substr(0, 2), 16),
                                        g: parseInt(a.substr(2, 2), 16),
                                        b: parseInt(a.substr(4, 2), 16)
                                    },
                                    i = 0;
                                i < n;
                                i += 4
                            )
                                (e[i] -= (e[i] - o.r) * (r.level / 100)),
                                    (e[i + 1] -=
                                        (e[i + 1] - o.g) * (r.level / 100)),
                                    (e[i + 2] -=
                                        (e[i + 2] - o.b) * (r.level / 100));
                            return e;
                        };
                    (t.transform = o),
                        (t.default = function() {
                            var t =
                                    0 < arguments.length &&
                                    void 0 !== arguments[0]
                                        ? arguments[0]
                                        : {},
                                e = t.data,
                                n = t.options,
                                r = t.nWorkers;
                            if (!(e && n && n.color && n.level))
                                throw new Error(
                                    'lens-filter-colorize:: invalid options provided'
                                );
                            return a({
                                data: e,
                                transform: o,
                                options: n,
                                nWorkers: r
                            });
                        }),
                        Object.defineProperty(t, '__esModule', { value: !0 });
                })(e);
            })
        ),
        c = t(
            e(function(t, e) {
                !(function(t) {
                    'undefined' != typeof window
                        ? window
                        : void 0 !== i || ('undefined' != typeof self && self);
                    var e,
                        n = ((function(t, e) {
                            !(function() {
                                function h(o, i, s) {
                                    o.addEventListener('message', function(t) {
                                        var e = t.data,
                                            n = e.id;
                                        if ('RPC' === e.type && null != n)
                                            if (e.method) {
                                                var r = i[e.method];
                                                null == r
                                                    ? o.postMessage({
                                                          type: 'RPC',
                                                          id: n,
                                                          error:
                                                              'NO_SUCH_METHOD'
                                                      })
                                                    : Promise.resolve()
                                                          .then(function() {
                                                              return r.apply(
                                                                  null,
                                                                  e.params
                                                              );
                                                          })
                                                          .then(function(t) {
                                                              o.postMessage({
                                                                  type: 'RPC',
                                                                  id: n,
                                                                  result: t
                                                              });
                                                          })
                                                          .catch(function(t) {
                                                              o.postMessage({
                                                                  type: 'RPC',
                                                                  id: n,
                                                                  error: '' + t
                                                              });
                                                          });
                                            } else {
                                                var a = s[n];
                                                if (null == a)
                                                    throw Error(
                                                        'Unknown callback ' + n
                                                    );
                                                delete s[n],
                                                    e.error
                                                        ? a[1](Error(e.error))
                                                        : a[0](e.result);
                                            }
                                    });
                                }
                                function r(t, e) {
                                    var n = document.createElement('canvas');
                                    return (n.width = t), (n.height = e), n;
                                }
                                (e.getCanvas = r),
                                    (e.convertImageDataToCanvasURL = function(
                                        t
                                    ) {
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
                                    (e.applyFilter = function(t) {
                                        var e = t.data,
                                            n = t.transform,
                                            i = t.options,
                                            s = t.nWorkers,
                                            u = (function(t, e) {
                                                var n,
                                                    o,
                                                    i,
                                                    r = this,
                                                    a = {},
                                                    s =
                                                        '__xpo' +
                                                        Math.random()
                                                            .toString()
                                                            .substring(2) +
                                                        '__';
                                                'function' == typeof t &&
                                                    (t =
                                                        '(' +
                                                        Function.prototype.toString.call(
                                                            t
                                                        ) +
                                                        ')(' +
                                                        s +
                                                        ')'),
                                                    (o = s),
                                                    (i = a),
                                                    (n = (n = (n = t).replace(
                                                        /^(\s*)export\s+default\s+/m,
                                                        function(t, e) {
                                                            return (
                                                                (i.default = !0),
                                                                '' +
                                                                    e +
                                                                    o +
                                                                    '.default='
                                                            );
                                                        }
                                                    )).replace(
                                                        /^(\s*)export\s+((?:async\s*)?function(?:\s*\*)?|const|let|var)(\s+)([a-zA-Z$_][a-zA-Z0-9$_]*)/gm,
                                                        function(
                                                            t,
                                                            e,
                                                            n,
                                                            r,
                                                            a
                                                        ) {
                                                            return (
                                                                (i[a] = !0),
                                                                '' +
                                                                    e +
                                                                    o +
                                                                    '.' +
                                                                    a +
                                                                    '=' +
                                                                    n +
                                                                    r +
                                                                    a
                                                            );
                                                        }
                                                    )),
                                                    (t =
                                                        'var ' +
                                                        o +
                                                        '={};\n' +
                                                        n +
                                                        '\n' +
                                                        o +
                                                        ';\n(' +
                                                        Function.prototype.toString.call(
                                                            h
                                                        ) +
                                                        ')(self,' +
                                                        s +
                                                        ',{})');
                                                var u,
                                                    c = URL.createObjectURL(
                                                        new Blob([t])
                                                    ),
                                                    l = new Worker(c, e),
                                                    f = l.terminate,
                                                    d = {},
                                                    p = 0;
                                                for (u in ((l.kill = function(
                                                    t
                                                ) {
                                                    l.postMessage({
                                                        type: 'KILL',
                                                        signal: t
                                                    }),
                                                        setTimeout(l.terminate);
                                                }),
                                                (l.terminate = function() {
                                                    URL.revokeObjectURL(c),
                                                        f.call(r);
                                                }),
                                                (l.call = function(r, a) {
                                                    return new Promise(function(
                                                        t,
                                                        e
                                                    ) {
                                                        var n = 'rpc' + ++p;
                                                        (d[n] = [t, e]),
                                                            l.postMessage({
                                                                type: 'RPC',
                                                                id: n,
                                                                method: r,
                                                                params: a
                                                            });
                                                    });
                                                }),
                                                (l.rpcMethods = {}),
                                                h(l, l.rpcMethods, d),
                                                (l.expose = function(t) {
                                                    l[u] = function() {
                                                        return l.call(
                                                            t,
                                                            [].slice.call(
                                                                arguments
                                                            )
                                                        );
                                                    };
                                                }),
                                                a))
                                                    u in l || l.expose(u);
                                                return l;
                                            })(
                                                '\n        var transform = ' +
                                                    n +
                                                    ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                                            ),
                                            c = r(e.width, e.height),
                                            l = c.getContext('2d');
                                        l.putImageData(e, 0, 0), (s = s || 1);
                                        var f = Math.floor(c.height / s);
                                        return new Promise(function(e) {
                                            for (
                                                var n = 0, t = void 0, r = 0;
                                                r < s;
                                                r++
                                            ) {
                                                (t = f),
                                                    r + 1 === s &&
                                                        (t = c.height - f * r);
                                                var a = l.getImageData(
                                                        0,
                                                        f * r,
                                                        c.width,
                                                        t
                                                    ),
                                                    o = t * c.width * 4;
                                                u.execute(a, r, o, i).then(
                                                    function(t) {
                                                        l.putImageData(
                                                            t.result,
                                                            0,
                                                            f * t.index
                                                        ),
                                                            ++n === s &&
                                                                e(
                                                                    l.getImageData(
                                                                        0,
                                                                        0,
                                                                        c.width,
                                                                        c.height
                                                                    )
                                                                );
                                                    }
                                                );
                                            }
                                        });
                                    });
                            })();
                        })((e = { exports: {} }), e.exports),
                        e.exports),
                        a = (n.getCanvas,
                        n.convertImageDataToCanvasURL,
                        n.applyFilter),
                        o = function(t) {
                            for (
                                var e = t.data,
                                    n = t.length,
                                    r = t.options,
                                    a =
                                        (259 * (r.contrast + 255)) /
                                        (255 * (259 - r.contrast)),
                                    o = 0;
                                o < n;
                                o += 4
                            )
                                (e[o] = a * (e[o] - 128) + 128),
                                    (e[o + 1] = a * (e[o + 1] - 128) + 128),
                                    (e[o + 2] = a * (e[o + 2] - 128) + 128);
                            return e;
                        };
                    (t.transform = o),
                        (t.default = function() {
                            var t =
                                    0 < arguments.length &&
                                    void 0 !== arguments[0]
                                        ? arguments[0]
                                        : {},
                                e = t.data,
                                n = t.options,
                                r = t.nWorkers;
                            if (!e || !n || !n.contrast)
                                throw new Error(
                                    'lens-filter-contrast:: invalid options provided'
                                );
                            return a({
                                data: e,
                                transform: o,
                                options: n,
                                nWorkers: r
                            });
                        }),
                        Object.defineProperty(t, '__esModule', { value: !0 });
                })(e);
            })
        ),
        l = t(
            e(function(t, e) {
                !(function(t) {
                    'undefined' != typeof window
                        ? window
                        : void 0 !== i || ('undefined' != typeof self && self);
                    var e,
                        n = ((function(t, e) {
                            !(function() {
                                function h(o, i, s) {
                                    o.addEventListener('message', function(t) {
                                        var e = t.data,
                                            n = e.id;
                                        if ('RPC' === e.type && null != n)
                                            if (e.method) {
                                                var r = i[e.method];
                                                null == r
                                                    ? o.postMessage({
                                                          type: 'RPC',
                                                          id: n,
                                                          error:
                                                              'NO_SUCH_METHOD'
                                                      })
                                                    : Promise.resolve()
                                                          .then(function() {
                                                              return r.apply(
                                                                  null,
                                                                  e.params
                                                              );
                                                          })
                                                          .then(function(t) {
                                                              o.postMessage({
                                                                  type: 'RPC',
                                                                  id: n,
                                                                  result: t
                                                              });
                                                          })
                                                          .catch(function(t) {
                                                              o.postMessage({
                                                                  type: 'RPC',
                                                                  id: n,
                                                                  error: '' + t
                                                              });
                                                          });
                                            } else {
                                                var a = s[n];
                                                if (null == a)
                                                    throw Error(
                                                        'Unknown callback ' + n
                                                    );
                                                delete s[n],
                                                    e.error
                                                        ? a[1](Error(e.error))
                                                        : a[0](e.result);
                                            }
                                    });
                                }
                                function r(t, e) {
                                    var n = document.createElement('canvas');
                                    return (n.width = t), (n.height = e), n;
                                }
                                (e.getCanvas = r),
                                    (e.convertImageDataToCanvasURL = function(
                                        t
                                    ) {
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
                                    (e.applyFilter = function(t) {
                                        var e = t.data,
                                            n = t.transform,
                                            i = t.options,
                                            s = t.nWorkers,
                                            u = (function(t, e) {
                                                var n,
                                                    o,
                                                    i,
                                                    r = this,
                                                    a = {},
                                                    s =
                                                        '__xpo' +
                                                        Math.random()
                                                            .toString()
                                                            .substring(2) +
                                                        '__';
                                                'function' == typeof t &&
                                                    (t =
                                                        '(' +
                                                        Function.prototype.toString.call(
                                                            t
                                                        ) +
                                                        ')(' +
                                                        s +
                                                        ')'),
                                                    (o = s),
                                                    (i = a),
                                                    (n = (n = (n = t).replace(
                                                        /^(\s*)export\s+default\s+/m,
                                                        function(t, e) {
                                                            return (
                                                                (i.default = !0),
                                                                '' +
                                                                    e +
                                                                    o +
                                                                    '.default='
                                                            );
                                                        }
                                                    )).replace(
                                                        /^(\s*)export\s+((?:async\s*)?function(?:\s*\*)?|const|let|var)(\s+)([a-zA-Z$_][a-zA-Z0-9$_]*)/gm,
                                                        function(
                                                            t,
                                                            e,
                                                            n,
                                                            r,
                                                            a
                                                        ) {
                                                            return (
                                                                (i[a] = !0),
                                                                '' +
                                                                    e +
                                                                    o +
                                                                    '.' +
                                                                    a +
                                                                    '=' +
                                                                    n +
                                                                    r +
                                                                    a
                                                            );
                                                        }
                                                    )),
                                                    (t =
                                                        'var ' +
                                                        o +
                                                        '={};\n' +
                                                        n +
                                                        '\n' +
                                                        o +
                                                        ';\n(' +
                                                        Function.prototype.toString.call(
                                                            h
                                                        ) +
                                                        ')(self,' +
                                                        s +
                                                        ',{})');
                                                var u,
                                                    c = URL.createObjectURL(
                                                        new Blob([t])
                                                    ),
                                                    l = new Worker(c, e),
                                                    f = l.terminate,
                                                    d = {},
                                                    p = 0;
                                                for (u in ((l.kill = function(
                                                    t
                                                ) {
                                                    l.postMessage({
                                                        type: 'KILL',
                                                        signal: t
                                                    }),
                                                        setTimeout(l.terminate);
                                                }),
                                                (l.terminate = function() {
                                                    URL.revokeObjectURL(c),
                                                        f.call(r);
                                                }),
                                                (l.call = function(r, a) {
                                                    return new Promise(function(
                                                        t,
                                                        e
                                                    ) {
                                                        var n = 'rpc' + ++p;
                                                        (d[n] = [t, e]),
                                                            l.postMessage({
                                                                type: 'RPC',
                                                                id: n,
                                                                method: r,
                                                                params: a
                                                            });
                                                    });
                                                }),
                                                (l.rpcMethods = {}),
                                                h(l, l.rpcMethods, d),
                                                (l.expose = function(t) {
                                                    l[u] = function() {
                                                        return l.call(
                                                            t,
                                                            [].slice.call(
                                                                arguments
                                                            )
                                                        );
                                                    };
                                                }),
                                                a))
                                                    u in l || l.expose(u);
                                                return l;
                                            })(
                                                '\n        var transform = ' +
                                                    n +
                                                    ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                                            ),
                                            c = r(e.width, e.height),
                                            l = c.getContext('2d');
                                        l.putImageData(e, 0, 0), (s = s || 1);
                                        var f = Math.floor(c.height / s);
                                        return new Promise(function(e) {
                                            for (
                                                var n = 0, t = void 0, r = 0;
                                                r < s;
                                                r++
                                            ) {
                                                (t = f),
                                                    r + 1 === s &&
                                                        (t = c.height - f * r);
                                                var a = l.getImageData(
                                                        0,
                                                        f * r,
                                                        c.width,
                                                        t
                                                    ),
                                                    o = t * c.width * 4;
                                                u.execute(a, r, o, i).then(
                                                    function(t) {
                                                        l.putImageData(
                                                            t.result,
                                                            0,
                                                            f * t.index
                                                        ),
                                                            ++n === s &&
                                                                e(
                                                                    l.getImageData(
                                                                        0,
                                                                        0,
                                                                        c.width,
                                                                        c.height
                                                                    )
                                                                );
                                                    }
                                                );
                                            }
                                        });
                                    });
                            })();
                        })((e = { exports: {} }), e.exports),
                        e.exports),
                        a = (n.getCanvas,
                        n.convertImageDataToCanvasURL,
                        n.applyFilter),
                        o = function(t) {
                            for (
                                var e = t.data,
                                    n = t.length,
                                    r = t.options,
                                    a = 0;
                                a < n;
                                a += 4
                            )
                                (e[a] =
                                    255 * Math.pow(e[a] / 255, r.adjustment)),
                                    (e[a + 1] =
                                        255 *
                                        Math.pow(e[a + 1] / 255, r.adjustment)),
                                    (e[a + 2] =
                                        255 *
                                        Math.pow(e[a + 2] / 255, r.adjustment));
                            return e;
                        };
                    (t.transform = o),
                        (t.default = function() {
                            var t =
                                    0 < arguments.length &&
                                    void 0 !== arguments[0]
                                        ? arguments[0]
                                        : {},
                                e = t.data,
                                n = t.options,
                                r = t.nWorkers;
                            if (!e || !n || !n.adjustment)
                                throw new Error(
                                    'lens-filter-gamma:: invalid options provided'
                                );
                            return a({
                                data: e,
                                transform: o,
                                options: n,
                                nWorkers: r
                            });
                        }),
                        Object.defineProperty(t, '__esModule', { value: !0 });
                })(e);
            })
        ),
        f = t(
            e(function(t, e) {
                !(function(t) {
                    'undefined' != typeof window
                        ? window
                        : void 0 !== i || ('undefined' != typeof self && self);
                    var e,
                        n = ((function(t, e) {
                            !(function() {
                                function h(o, i, s) {
                                    o.addEventListener('message', function(t) {
                                        var e = t.data,
                                            n = e.id;
                                        if ('RPC' === e.type && null != n)
                                            if (e.method) {
                                                var r = i[e.method];
                                                null == r
                                                    ? o.postMessage({
                                                          type: 'RPC',
                                                          id: n,
                                                          error:
                                                              'NO_SUCH_METHOD'
                                                      })
                                                    : Promise.resolve()
                                                          .then(function() {
                                                              return r.apply(
                                                                  null,
                                                                  e.params
                                                              );
                                                          })
                                                          .then(function(t) {
                                                              o.postMessage({
                                                                  type: 'RPC',
                                                                  id: n,
                                                                  result: t
                                                              });
                                                          })
                                                          .catch(function(t) {
                                                              o.postMessage({
                                                                  type: 'RPC',
                                                                  id: n,
                                                                  error: '' + t
                                                              });
                                                          });
                                            } else {
                                                var a = s[n];
                                                if (null == a)
                                                    throw Error(
                                                        'Unknown callback ' + n
                                                    );
                                                delete s[n],
                                                    e.error
                                                        ? a[1](Error(e.error))
                                                        : a[0](e.result);
                                            }
                                    });
                                }
                                function r(t, e) {
                                    var n = document.createElement('canvas');
                                    return (n.width = t), (n.height = e), n;
                                }
                                (e.getCanvas = r),
                                    (e.convertImageDataToCanvasURL = function(
                                        t
                                    ) {
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
                                    (e.applyFilter = function(t) {
                                        var e = t.data,
                                            n = t.transform,
                                            i = t.options,
                                            s = t.nWorkers,
                                            u = (function(t, e) {
                                                var n,
                                                    o,
                                                    i,
                                                    r = this,
                                                    a = {},
                                                    s =
                                                        '__xpo' +
                                                        Math.random()
                                                            .toString()
                                                            .substring(2) +
                                                        '__';
                                                'function' == typeof t &&
                                                    (t =
                                                        '(' +
                                                        Function.prototype.toString.call(
                                                            t
                                                        ) +
                                                        ')(' +
                                                        s +
                                                        ')'),
                                                    (o = s),
                                                    (i = a),
                                                    (n = (n = (n = t).replace(
                                                        /^(\s*)export\s+default\s+/m,
                                                        function(t, e) {
                                                            return (
                                                                (i.default = !0),
                                                                '' +
                                                                    e +
                                                                    o +
                                                                    '.default='
                                                            );
                                                        }
                                                    )).replace(
                                                        /^(\s*)export\s+((?:async\s*)?function(?:\s*\*)?|const|let|var)(\s+)([a-zA-Z$_][a-zA-Z0-9$_]*)/gm,
                                                        function(
                                                            t,
                                                            e,
                                                            n,
                                                            r,
                                                            a
                                                        ) {
                                                            return (
                                                                (i[a] = !0),
                                                                '' +
                                                                    e +
                                                                    o +
                                                                    '.' +
                                                                    a +
                                                                    '=' +
                                                                    n +
                                                                    r +
                                                                    a
                                                            );
                                                        }
                                                    )),
                                                    (t =
                                                        'var ' +
                                                        o +
                                                        '={};\n' +
                                                        n +
                                                        '\n' +
                                                        o +
                                                        ';\n(' +
                                                        Function.prototype.toString.call(
                                                            h
                                                        ) +
                                                        ')(self,' +
                                                        s +
                                                        ',{})');
                                                var u,
                                                    c = URL.createObjectURL(
                                                        new Blob([t])
                                                    ),
                                                    l = new Worker(c, e),
                                                    f = l.terminate,
                                                    d = {},
                                                    p = 0;
                                                for (u in ((l.kill = function(
                                                    t
                                                ) {
                                                    l.postMessage({
                                                        type: 'KILL',
                                                        signal: t
                                                    }),
                                                        setTimeout(l.terminate);
                                                }),
                                                (l.terminate = function() {
                                                    URL.revokeObjectURL(c),
                                                        f.call(r);
                                                }),
                                                (l.call = function(r, a) {
                                                    return new Promise(function(
                                                        t,
                                                        e
                                                    ) {
                                                        var n = 'rpc' + ++p;
                                                        (d[n] = [t, e]),
                                                            l.postMessage({
                                                                type: 'RPC',
                                                                id: n,
                                                                method: r,
                                                                params: a
                                                            });
                                                    });
                                                }),
                                                (l.rpcMethods = {}),
                                                h(l, l.rpcMethods, d),
                                                (l.expose = function(t) {
                                                    l[u] = function() {
                                                        return l.call(
                                                            t,
                                                            [].slice.call(
                                                                arguments
                                                            )
                                                        );
                                                    };
                                                }),
                                                a))
                                                    u in l || l.expose(u);
                                                return l;
                                            })(
                                                '\n        var transform = ' +
                                                    n +
                                                    ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                                            ),
                                            c = r(e.width, e.height),
                                            l = c.getContext('2d');
                                        l.putImageData(e, 0, 0), (s = s || 1);
                                        var f = Math.floor(c.height / s);
                                        return new Promise(function(e) {
                                            for (
                                                var n = 0, t = void 0, r = 0;
                                                r < s;
                                                r++
                                            ) {
                                                (t = f),
                                                    r + 1 === s &&
                                                        (t = c.height - f * r);
                                                var a = l.getImageData(
                                                        0,
                                                        f * r,
                                                        c.width,
                                                        t
                                                    ),
                                                    o = t * c.width * 4;
                                                u.execute(a, r, o, i).then(
                                                    function(t) {
                                                        l.putImageData(
                                                            t.result,
                                                            0,
                                                            f * t.index
                                                        ),
                                                            ++n === s &&
                                                                e(
                                                                    l.getImageData(
                                                                        0,
                                                                        0,
                                                                        c.width,
                                                                        c.height
                                                                    )
                                                                );
                                                    }
                                                );
                                            }
                                        });
                                    });
                            })();
                        })((e = { exports: {} }), e.exports),
                        e.exports),
                        r = (n.getCanvas,
                        n.convertImageDataToCanvasURL,
                        n.applyFilter),
                        a = function(t) {
                            for (
                                var e = t.data, n = t.length, r = 0;
                                r < n;
                                r += 4
                            ) {
                                var a = e[r],
                                    o = e[r + 1],
                                    i = e[r + 2],
                                    s = 0.2126 * a + 0.7152 * o + 0.0722 * i;
                                e[r] = e[r + 1] = e[r + 2] = s;
                            }
                            return e;
                        };
                    (t.transform = a),
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
                            return r({ data: e, transform: a, nWorkers: n });
                        }),
                        Object.defineProperty(t, '__esModule', { value: !0 });
                })(e);
            })
        ),
        d = t(
            e(function(t, e) {
                !(function(t) {
                    'undefined' != typeof window
                        ? window
                        : void 0 !== i || ('undefined' != typeof self && self);
                    var e,
                        n = ((function(t, e) {
                            !(function() {
                                function h(o, i, s) {
                                    o.addEventListener('message', function(t) {
                                        var e = t.data,
                                            n = e.id;
                                        if ('RPC' === e.type && null != n)
                                            if (e.method) {
                                                var r = i[e.method];
                                                null == r
                                                    ? o.postMessage({
                                                          type: 'RPC',
                                                          id: n,
                                                          error:
                                                              'NO_SUCH_METHOD'
                                                      })
                                                    : Promise.resolve()
                                                          .then(function() {
                                                              return r.apply(
                                                                  null,
                                                                  e.params
                                                              );
                                                          })
                                                          .then(function(t) {
                                                              o.postMessage({
                                                                  type: 'RPC',
                                                                  id: n,
                                                                  result: t
                                                              });
                                                          })
                                                          .catch(function(t) {
                                                              o.postMessage({
                                                                  type: 'RPC',
                                                                  id: n,
                                                                  error: '' + t
                                                              });
                                                          });
                                            } else {
                                                var a = s[n];
                                                if (null == a)
                                                    throw Error(
                                                        'Unknown callback ' + n
                                                    );
                                                delete s[n],
                                                    e.error
                                                        ? a[1](Error(e.error))
                                                        : a[0](e.result);
                                            }
                                    });
                                }
                                function r(t, e) {
                                    var n = document.createElement('canvas');
                                    return (n.width = t), (n.height = e), n;
                                }
                                (e.getCanvas = r),
                                    (e.convertImageDataToCanvasURL = function(
                                        t
                                    ) {
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
                                    (e.applyFilter = function(t) {
                                        var e = t.data,
                                            n = t.transform,
                                            i = t.options,
                                            s = t.nWorkers,
                                            u = (function(t, e) {
                                                var n,
                                                    o,
                                                    i,
                                                    r = this,
                                                    a = {},
                                                    s =
                                                        '__xpo' +
                                                        Math.random()
                                                            .toString()
                                                            .substring(2) +
                                                        '__';
                                                'function' == typeof t &&
                                                    (t =
                                                        '(' +
                                                        Function.prototype.toString.call(
                                                            t
                                                        ) +
                                                        ')(' +
                                                        s +
                                                        ')'),
                                                    (o = s),
                                                    (i = a),
                                                    (n = (n = (n = t).replace(
                                                        /^(\s*)export\s+default\s+/m,
                                                        function(t, e) {
                                                            return (
                                                                (i.default = !0),
                                                                '' +
                                                                    e +
                                                                    o +
                                                                    '.default='
                                                            );
                                                        }
                                                    )).replace(
                                                        /^(\s*)export\s+((?:async\s*)?function(?:\s*\*)?|const|let|var)(\s+)([a-zA-Z$_][a-zA-Z0-9$_]*)/gm,
                                                        function(
                                                            t,
                                                            e,
                                                            n,
                                                            r,
                                                            a
                                                        ) {
                                                            return (
                                                                (i[a] = !0),
                                                                '' +
                                                                    e +
                                                                    o +
                                                                    '.' +
                                                                    a +
                                                                    '=' +
                                                                    n +
                                                                    r +
                                                                    a
                                                            );
                                                        }
                                                    )),
                                                    (t =
                                                        'var ' +
                                                        o +
                                                        '={};\n' +
                                                        n +
                                                        '\n' +
                                                        o +
                                                        ';\n(' +
                                                        Function.prototype.toString.call(
                                                            h
                                                        ) +
                                                        ')(self,' +
                                                        s +
                                                        ',{})');
                                                var u,
                                                    c = URL.createObjectURL(
                                                        new Blob([t])
                                                    ),
                                                    l = new Worker(c, e),
                                                    f = l.terminate,
                                                    d = {},
                                                    p = 0;
                                                for (u in ((l.kill = function(
                                                    t
                                                ) {
                                                    l.postMessage({
                                                        type: 'KILL',
                                                        signal: t
                                                    }),
                                                        setTimeout(l.terminate);
                                                }),
                                                (l.terminate = function() {
                                                    URL.revokeObjectURL(c),
                                                        f.call(r);
                                                }),
                                                (l.call = function(r, a) {
                                                    return new Promise(function(
                                                        t,
                                                        e
                                                    ) {
                                                        var n = 'rpc' + ++p;
                                                        (d[n] = [t, e]),
                                                            l.postMessage({
                                                                type: 'RPC',
                                                                id: n,
                                                                method: r,
                                                                params: a
                                                            });
                                                    });
                                                }),
                                                (l.rpcMethods = {}),
                                                h(l, l.rpcMethods, d),
                                                (l.expose = function(t) {
                                                    l[u] = function() {
                                                        return l.call(
                                                            t,
                                                            [].slice.call(
                                                                arguments
                                                            )
                                                        );
                                                    };
                                                }),
                                                a))
                                                    u in l || l.expose(u);
                                                return l;
                                            })(
                                                '\n        var transform = ' +
                                                    n +
                                                    ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                                            ),
                                            c = r(e.width, e.height),
                                            l = c.getContext('2d');
                                        l.putImageData(e, 0, 0), (s = s || 1);
                                        var f = Math.floor(c.height / s);
                                        return new Promise(function(e) {
                                            for (
                                                var n = 0, t = void 0, r = 0;
                                                r < s;
                                                r++
                                            ) {
                                                (t = f),
                                                    r + 1 === s &&
                                                        (t = c.height - f * r);
                                                var a = l.getImageData(
                                                        0,
                                                        f * r,
                                                        c.width,
                                                        t
                                                    ),
                                                    o = t * c.width * 4;
                                                u.execute(a, r, o, i).then(
                                                    function(t) {
                                                        l.putImageData(
                                                            t.result,
                                                            0,
                                                            f * t.index
                                                        ),
                                                            ++n === s &&
                                                                e(
                                                                    l.getImageData(
                                                                        0,
                                                                        0,
                                                                        c.width,
                                                                        c.height
                                                                    )
                                                                );
                                                    }
                                                );
                                            }
                                        });
                                    });
                            })();
                        })((e = { exports: {} }), e.exports),
                        e.exports),
                        r = (n.getCanvas,
                        n.convertImageDataToCanvasURL,
                        n.applyFilter),
                        a = function(t) {
                            for (
                                var e = t.data, n = t.length, r = 0;
                                r < n;
                                r += 4
                            )
                                (e[r] = 255 - e[r]),
                                    (e[r + 1] = 255 - e[r + 1]),
                                    (e[r + 2] = 255 - e[r + 2]);
                            return e;
                        };
                    (t.transform = a),
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
                            return r({ data: e, transform: a, nWorkers: n });
                        }),
                        Object.defineProperty(t, '__esModule', { value: !0 });
                })(e);
            })
        ),
        p = t(
            e(function(t, e) {
                !(function(t) {
                    'undefined' != typeof window
                        ? window
                        : void 0 !== i || ('undefined' != typeof self && self);
                    var e,
                        n = ((function(t, e) {
                            !(function() {
                                function h(o, i, s) {
                                    o.addEventListener('message', function(t) {
                                        var e = t.data,
                                            n = e.id;
                                        if ('RPC' === e.type && null != n)
                                            if (e.method) {
                                                var r = i[e.method];
                                                null == r
                                                    ? o.postMessage({
                                                          type: 'RPC',
                                                          id: n,
                                                          error:
                                                              'NO_SUCH_METHOD'
                                                      })
                                                    : Promise.resolve()
                                                          .then(function() {
                                                              return r.apply(
                                                                  null,
                                                                  e.params
                                                              );
                                                          })
                                                          .then(function(t) {
                                                              o.postMessage({
                                                                  type: 'RPC',
                                                                  id: n,
                                                                  result: t
                                                              });
                                                          })
                                                          .catch(function(t) {
                                                              o.postMessage({
                                                                  type: 'RPC',
                                                                  id: n,
                                                                  error: '' + t
                                                              });
                                                          });
                                            } else {
                                                var a = s[n];
                                                if (null == a)
                                                    throw Error(
                                                        'Unknown callback ' + n
                                                    );
                                                delete s[n],
                                                    e.error
                                                        ? a[1](Error(e.error))
                                                        : a[0](e.result);
                                            }
                                    });
                                }
                                function r(t, e) {
                                    var n = document.createElement('canvas');
                                    return (n.width = t), (n.height = e), n;
                                }
                                (e.getCanvas = r),
                                    (e.convertImageDataToCanvasURL = function(
                                        t
                                    ) {
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
                                    (e.applyFilter = function(t) {
                                        var e = t.data,
                                            n = t.transform,
                                            i = t.options,
                                            s = t.nWorkers,
                                            u = (function(t, e) {
                                                var n,
                                                    o,
                                                    i,
                                                    r = this,
                                                    a = {},
                                                    s =
                                                        '__xpo' +
                                                        Math.random()
                                                            .toString()
                                                            .substring(2) +
                                                        '__';
                                                'function' == typeof t &&
                                                    (t =
                                                        '(' +
                                                        Function.prototype.toString.call(
                                                            t
                                                        ) +
                                                        ')(' +
                                                        s +
                                                        ')'),
                                                    (o = s),
                                                    (i = a),
                                                    (n = (n = (n = t).replace(
                                                        /^(\s*)export\s+default\s+/m,
                                                        function(t, e) {
                                                            return (
                                                                (i.default = !0),
                                                                '' +
                                                                    e +
                                                                    o +
                                                                    '.default='
                                                            );
                                                        }
                                                    )).replace(
                                                        /^(\s*)export\s+((?:async\s*)?function(?:\s*\*)?|const|let|var)(\s+)([a-zA-Z$_][a-zA-Z0-9$_]*)/gm,
                                                        function(
                                                            t,
                                                            e,
                                                            n,
                                                            r,
                                                            a
                                                        ) {
                                                            return (
                                                                (i[a] = !0),
                                                                '' +
                                                                    e +
                                                                    o +
                                                                    '.' +
                                                                    a +
                                                                    '=' +
                                                                    n +
                                                                    r +
                                                                    a
                                                            );
                                                        }
                                                    )),
                                                    (t =
                                                        'var ' +
                                                        o +
                                                        '={};\n' +
                                                        n +
                                                        '\n' +
                                                        o +
                                                        ';\n(' +
                                                        Function.prototype.toString.call(
                                                            h
                                                        ) +
                                                        ')(self,' +
                                                        s +
                                                        ',{})');
                                                var u,
                                                    c = URL.createObjectURL(
                                                        new Blob([t])
                                                    ),
                                                    l = new Worker(c, e),
                                                    f = l.terminate,
                                                    d = {},
                                                    p = 0;
                                                for (u in ((l.kill = function(
                                                    t
                                                ) {
                                                    l.postMessage({
                                                        type: 'KILL',
                                                        signal: t
                                                    }),
                                                        setTimeout(l.terminate);
                                                }),
                                                (l.terminate = function() {
                                                    URL.revokeObjectURL(c),
                                                        f.call(r);
                                                }),
                                                (l.call = function(r, a) {
                                                    return new Promise(function(
                                                        t,
                                                        e
                                                    ) {
                                                        var n = 'rpc' + ++p;
                                                        (d[n] = [t, e]),
                                                            l.postMessage({
                                                                type: 'RPC',
                                                                id: n,
                                                                method: r,
                                                                params: a
                                                            });
                                                    });
                                                }),
                                                (l.rpcMethods = {}),
                                                h(l, l.rpcMethods, d),
                                                (l.expose = function(t) {
                                                    l[u] = function() {
                                                        return l.call(
                                                            t,
                                                            [].slice.call(
                                                                arguments
                                                            )
                                                        );
                                                    };
                                                }),
                                                a))
                                                    u in l || l.expose(u);
                                                return l;
                                            })(
                                                '\n        var transform = ' +
                                                    n +
                                                    ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                                            ),
                                            c = r(e.width, e.height),
                                            l = c.getContext('2d');
                                        l.putImageData(e, 0, 0), (s = s || 1);
                                        var f = Math.floor(c.height / s);
                                        return new Promise(function(e) {
                                            for (
                                                var n = 0, t = void 0, r = 0;
                                                r < s;
                                                r++
                                            ) {
                                                (t = f),
                                                    r + 1 === s &&
                                                        (t = c.height - f * r);
                                                var a = l.getImageData(
                                                        0,
                                                        f * r,
                                                        c.width,
                                                        t
                                                    ),
                                                    o = t * c.width * 4;
                                                u.execute(a, r, o, i).then(
                                                    function(t) {
                                                        l.putImageData(
                                                            t.result,
                                                            0,
                                                            f * t.index
                                                        ),
                                                            ++n === s &&
                                                                e(
                                                                    l.getImageData(
                                                                        0,
                                                                        0,
                                                                        c.width,
                                                                        c.height
                                                                    )
                                                                );
                                                    }
                                                );
                                            }
                                        });
                                    });
                            })();
                        })((e = { exports: {} }), e.exports),
                        e.exports),
                        a = (n.getCanvas,
                        n.convertImageDataToCanvasURL,
                        n.applyFilter),
                        o = function(t) {
                            for (
                                var e = t.data,
                                    n = t.length,
                                    r = t.options,
                                    a = 2.55 * Math.abs(r.adjustment),
                                    o = function(t, e) {
                                        var n = t + e;
                                        return 255 < n ? 255 : n < 0 ? 0 : n;
                                    },
                                    i = 0;
                                i < n;
                                i += 4
                            ) {
                                var s = Math.random() < 0.5 ? -1 : 1,
                                    u = s * (Math.random() + a);
                                (e[i] = o(e[i], u)),
                                    (e[i + 1] = o(e[i + 1], u)),
                                    (e[i + 2] = o(e[i + 2], u));
                            }
                            return e;
                        };
                    (t.transform = o),
                        (t.default = function() {
                            var t =
                                    0 < arguments.length &&
                                    void 0 !== arguments[0]
                                        ? arguments[0]
                                        : {},
                                e = t.data,
                                n = t.options,
                                r = t.nWorkers;
                            if (!e || !n || !n.adjustment)
                                throw new Error(
                                    'lens-filter-noise:: invalid options provided'
                                );
                            return a({
                                data: e,
                                transform: o,
                                options: n,
                                nWorkers: r
                            });
                        }),
                        Object.defineProperty(t, '__esModule', { value: !0 });
                })(e);
            })
        ),
        h = t(
            e(function(t, e) {
                !(function(t) {
                    'undefined' != typeof window
                        ? window
                        : void 0 !== i || ('undefined' != typeof self && self);
                    var e,
                        n = ((function(t, e) {
                            !(function() {
                                function h(o, i, s) {
                                    o.addEventListener('message', function(t) {
                                        var e = t.data,
                                            n = e.id;
                                        if ('RPC' === e.type && null != n)
                                            if (e.method) {
                                                var r = i[e.method];
                                                null == r
                                                    ? o.postMessage({
                                                          type: 'RPC',
                                                          id: n,
                                                          error:
                                                              'NO_SUCH_METHOD'
                                                      })
                                                    : Promise.resolve()
                                                          .then(function() {
                                                              return r.apply(
                                                                  null,
                                                                  e.params
                                                              );
                                                          })
                                                          .then(function(t) {
                                                              o.postMessage({
                                                                  type: 'RPC',
                                                                  id: n,
                                                                  result: t
                                                              });
                                                          })
                                                          .catch(function(t) {
                                                              o.postMessage({
                                                                  type: 'RPC',
                                                                  id: n,
                                                                  error: '' + t
                                                              });
                                                          });
                                            } else {
                                                var a = s[n];
                                                if (null == a)
                                                    throw Error(
                                                        'Unknown callback ' + n
                                                    );
                                                delete s[n],
                                                    e.error
                                                        ? a[1](Error(e.error))
                                                        : a[0](e.result);
                                            }
                                    });
                                }
                                function r(t, e) {
                                    var n = document.createElement('canvas');
                                    return (n.width = t), (n.height = e), n;
                                }
                                (e.getCanvas = r),
                                    (e.convertImageDataToCanvasURL = function(
                                        t
                                    ) {
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
                                    (e.applyFilter = function(t) {
                                        var e = t.data,
                                            n = t.transform,
                                            i = t.options,
                                            s = t.nWorkers,
                                            u = (function(t, e) {
                                                var n,
                                                    o,
                                                    i,
                                                    r = this,
                                                    a = {},
                                                    s =
                                                        '__xpo' +
                                                        Math.random()
                                                            .toString()
                                                            .substring(2) +
                                                        '__';
                                                'function' == typeof t &&
                                                    (t =
                                                        '(' +
                                                        Function.prototype.toString.call(
                                                            t
                                                        ) +
                                                        ')(' +
                                                        s +
                                                        ')'),
                                                    (o = s),
                                                    (i = a),
                                                    (n = (n = (n = t).replace(
                                                        /^(\s*)export\s+default\s+/m,
                                                        function(t, e) {
                                                            return (
                                                                (i.default = !0),
                                                                '' +
                                                                    e +
                                                                    o +
                                                                    '.default='
                                                            );
                                                        }
                                                    )).replace(
                                                        /^(\s*)export\s+((?:async\s*)?function(?:\s*\*)?|const|let|var)(\s+)([a-zA-Z$_][a-zA-Z0-9$_]*)/gm,
                                                        function(
                                                            t,
                                                            e,
                                                            n,
                                                            r,
                                                            a
                                                        ) {
                                                            return (
                                                                (i[a] = !0),
                                                                '' +
                                                                    e +
                                                                    o +
                                                                    '.' +
                                                                    a +
                                                                    '=' +
                                                                    n +
                                                                    r +
                                                                    a
                                                            );
                                                        }
                                                    )),
                                                    (t =
                                                        'var ' +
                                                        o +
                                                        '={};\n' +
                                                        n +
                                                        '\n' +
                                                        o +
                                                        ';\n(' +
                                                        Function.prototype.toString.call(
                                                            h
                                                        ) +
                                                        ')(self,' +
                                                        s +
                                                        ',{})');
                                                var u,
                                                    c = URL.createObjectURL(
                                                        new Blob([t])
                                                    ),
                                                    l = new Worker(c, e),
                                                    f = l.terminate,
                                                    d = {},
                                                    p = 0;
                                                for (u in ((l.kill = function(
                                                    t
                                                ) {
                                                    l.postMessage({
                                                        type: 'KILL',
                                                        signal: t
                                                    }),
                                                        setTimeout(l.terminate);
                                                }),
                                                (l.terminate = function() {
                                                    URL.revokeObjectURL(c),
                                                        f.call(r);
                                                }),
                                                (l.call = function(r, a) {
                                                    return new Promise(function(
                                                        t,
                                                        e
                                                    ) {
                                                        var n = 'rpc' + ++p;
                                                        (d[n] = [t, e]),
                                                            l.postMessage({
                                                                type: 'RPC',
                                                                id: n,
                                                                method: r,
                                                                params: a
                                                            });
                                                    });
                                                }),
                                                (l.rpcMethods = {}),
                                                h(l, l.rpcMethods, d),
                                                (l.expose = function(t) {
                                                    l[u] = function() {
                                                        return l.call(
                                                            t,
                                                            [].slice.call(
                                                                arguments
                                                            )
                                                        );
                                                    };
                                                }),
                                                a))
                                                    u in l || l.expose(u);
                                                return l;
                                            })(
                                                '\n        var transform = ' +
                                                    n +
                                                    ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                                            ),
                                            c = r(e.width, e.height),
                                            l = c.getContext('2d');
                                        l.putImageData(e, 0, 0), (s = s || 1);
                                        var f = Math.floor(c.height / s);
                                        return new Promise(function(e) {
                                            for (
                                                var n = 0, t = void 0, r = 0;
                                                r < s;
                                                r++
                                            ) {
                                                (t = f),
                                                    r + 1 === s &&
                                                        (t = c.height - f * r);
                                                var a = l.getImageData(
                                                        0,
                                                        f * r,
                                                        c.width,
                                                        t
                                                    ),
                                                    o = t * c.width * 4;
                                                u.execute(a, r, o, i).then(
                                                    function(t) {
                                                        l.putImageData(
                                                            t.result,
                                                            0,
                                                            f * t.index
                                                        ),
                                                            ++n === s &&
                                                                e(
                                                                    l.getImageData(
                                                                        0,
                                                                        0,
                                                                        c.width,
                                                                        c.height
                                                                    )
                                                                );
                                                    }
                                                );
                                            }
                                        });
                                    });
                            })();
                        })((e = { exports: {} }), e.exports),
                        e.exports),
                        r = (n.getCanvas,
                        n.convertImageDataToCanvasURL,
                        n.applyFilter),
                        a = function(t) {
                            for (
                                var e = t.data, n = t.length, r = 0;
                                r < n;
                                r += 4
                            ) {
                                var a = e[r],
                                    o = e[r + 1],
                                    i = e[r + 2];
                                (e[r] = 0.393 * a + 0.769 * o + 0.189 * i),
                                    (e[r + 1] =
                                        0.349 * a + 0.686 * o + 0.168 * i),
                                    (e[r + 2] =
                                        0.272 * a + 0.534 * o + 0.131 * i);
                            }
                            return e;
                        };
                    (t.transform = a),
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
                            return r({ data: e, transform: a, nWorkers: n });
                        }),
                        Object.defineProperty(t, '__esModule', { value: !0 });
                })(e);
            })
        ),
        v = t(
            e(function(t, e) {
                !(function(t) {
                    'undefined' != typeof window
                        ? window
                        : void 0 !== i || ('undefined' != typeof self && self);
                    var e,
                        n = ((function(t, e) {
                            !(function() {
                                function h(o, i, s) {
                                    o.addEventListener('message', function(t) {
                                        var e = t.data,
                                            n = e.id;
                                        if ('RPC' === e.type && null != n)
                                            if (e.method) {
                                                var r = i[e.method];
                                                null == r
                                                    ? o.postMessage({
                                                          type: 'RPC',
                                                          id: n,
                                                          error:
                                                              'NO_SUCH_METHOD'
                                                      })
                                                    : Promise.resolve()
                                                          .then(function() {
                                                              return r.apply(
                                                                  null,
                                                                  e.params
                                                              );
                                                          })
                                                          .then(function(t) {
                                                              o.postMessage({
                                                                  type: 'RPC',
                                                                  id: n,
                                                                  result: t
                                                              });
                                                          })
                                                          .catch(function(t) {
                                                              o.postMessage({
                                                                  type: 'RPC',
                                                                  id: n,
                                                                  error: '' + t
                                                              });
                                                          });
                                            } else {
                                                var a = s[n];
                                                if (null == a)
                                                    throw Error(
                                                        'Unknown callback ' + n
                                                    );
                                                delete s[n],
                                                    e.error
                                                        ? a[1](Error(e.error))
                                                        : a[0](e.result);
                                            }
                                    });
                                }
                                function r(t, e) {
                                    var n = document.createElement('canvas');
                                    return (n.width = t), (n.height = e), n;
                                }
                                (e.getCanvas = r),
                                    (e.convertImageDataToCanvasURL = function(
                                        t
                                    ) {
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
                                    (e.applyFilter = function(t) {
                                        var e = t.data,
                                            n = t.transform,
                                            i = t.options,
                                            s = t.nWorkers,
                                            u = (function(t, e) {
                                                var n,
                                                    o,
                                                    i,
                                                    r = this,
                                                    a = {},
                                                    s =
                                                        '__xpo' +
                                                        Math.random()
                                                            .toString()
                                                            .substring(2) +
                                                        '__';
                                                'function' == typeof t &&
                                                    (t =
                                                        '(' +
                                                        Function.prototype.toString.call(
                                                            t
                                                        ) +
                                                        ')(' +
                                                        s +
                                                        ')'),
                                                    (o = s),
                                                    (i = a),
                                                    (n = (n = (n = t).replace(
                                                        /^(\s*)export\s+default\s+/m,
                                                        function(t, e) {
                                                            return (
                                                                (i.default = !0),
                                                                '' +
                                                                    e +
                                                                    o +
                                                                    '.default='
                                                            );
                                                        }
                                                    )).replace(
                                                        /^(\s*)export\s+((?:async\s*)?function(?:\s*\*)?|const|let|var)(\s+)([a-zA-Z$_][a-zA-Z0-9$_]*)/gm,
                                                        function(
                                                            t,
                                                            e,
                                                            n,
                                                            r,
                                                            a
                                                        ) {
                                                            return (
                                                                (i[a] = !0),
                                                                '' +
                                                                    e +
                                                                    o +
                                                                    '.' +
                                                                    a +
                                                                    '=' +
                                                                    n +
                                                                    r +
                                                                    a
                                                            );
                                                        }
                                                    )),
                                                    (t =
                                                        'var ' +
                                                        o +
                                                        '={};\n' +
                                                        n +
                                                        '\n' +
                                                        o +
                                                        ';\n(' +
                                                        Function.prototype.toString.call(
                                                            h
                                                        ) +
                                                        ')(self,' +
                                                        s +
                                                        ',{})');
                                                var u,
                                                    c = URL.createObjectURL(
                                                        new Blob([t])
                                                    ),
                                                    l = new Worker(c, e),
                                                    f = l.terminate,
                                                    d = {},
                                                    p = 0;
                                                for (u in ((l.kill = function(
                                                    t
                                                ) {
                                                    l.postMessage({
                                                        type: 'KILL',
                                                        signal: t
                                                    }),
                                                        setTimeout(l.terminate);
                                                }),
                                                (l.terminate = function() {
                                                    URL.revokeObjectURL(c),
                                                        f.call(r);
                                                }),
                                                (l.call = function(r, a) {
                                                    return new Promise(function(
                                                        t,
                                                        e
                                                    ) {
                                                        var n = 'rpc' + ++p;
                                                        (d[n] = [t, e]),
                                                            l.postMessage({
                                                                type: 'RPC',
                                                                id: n,
                                                                method: r,
                                                                params: a
                                                            });
                                                    });
                                                }),
                                                (l.rpcMethods = {}),
                                                h(l, l.rpcMethods, d),
                                                (l.expose = function(t) {
                                                    l[u] = function() {
                                                        return l.call(
                                                            t,
                                                            [].slice.call(
                                                                arguments
                                                            )
                                                        );
                                                    };
                                                }),
                                                a))
                                                    u in l || l.expose(u);
                                                return l;
                                            })(
                                                '\n        var transform = ' +
                                                    n +
                                                    ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                                            ),
                                            c = r(e.width, e.height),
                                            l = c.getContext('2d');
                                        l.putImageData(e, 0, 0), (s = s || 1);
                                        var f = Math.floor(c.height / s);
                                        return new Promise(function(e) {
                                            for (
                                                var n = 0, t = void 0, r = 0;
                                                r < s;
                                                r++
                                            ) {
                                                (t = f),
                                                    r + 1 === s &&
                                                        (t = c.height - f * r);
                                                var a = l.getImageData(
                                                        0,
                                                        f * r,
                                                        c.width,
                                                        t
                                                    ),
                                                    o = t * c.width * 4;
                                                u.execute(a, r, o, i).then(
                                                    function(t) {
                                                        l.putImageData(
                                                            t.result,
                                                            0,
                                                            f * t.index
                                                        ),
                                                            ++n === s &&
                                                                e(
                                                                    l.getImageData(
                                                                        0,
                                                                        0,
                                                                        c.width,
                                                                        c.height
                                                                    )
                                                                );
                                                    }
                                                );
                                            }
                                        });
                                    });
                            })();
                        })((e = { exports: {} }), e.exports),
                        e.exports),
                        a = (n.getCanvas,
                        n.convertImageDataToCanvasURL,
                        n.applyFilter),
                        o = function(t) {
                            for (
                                var e = t.data,
                                    n = t.length,
                                    r = t.options,
                                    a = 0;
                                a < n;
                                a += 4
                            ) {
                                var o = e[a],
                                    i = e[a + 1],
                                    s = e[a + 2],
                                    u =
                                        0.2126 * o + 0.7152 * i + 0.0722 * s >=
                                        r.threshold
                                            ? 255
                                            : 0;
                                e[a] = e[a + 1] = e[a + 2] = u;
                            }
                            return e;
                        };
                    (t.transform = o),
                        (t.default = function() {
                            var t =
                                    0 < arguments.length &&
                                    void 0 !== arguments[0]
                                        ? arguments[0]
                                        : {},
                                e = t.data,
                                n = t.options,
                                r = t.nWorkers;
                            if (!e || !n || !n.threshold)
                                throw new Error(
                                    'lens-filter-threshold:: invalid options provided'
                                );
                            return a({
                                data: e,
                                transform: o,
                                options: n,
                                nWorkers: r
                            });
                        }),
                        Object.defineProperty(t, '__esModule', { value: !0 });
                })(e);
            })
        );
    function g(t) {
        if (!t) throw new Error('lens-chainable:: no selector provided');
        var e = document.querySelectorAll(t)[0];
        if (!e) throw new Error('lens-chainable:: no "to" element found');
        return e;
    }
    var m = (function() {
        function r(t, e) {
            for (var n = 0; n < e.length; n++) {
                var r = e[n];
                (r.enumerable = r.enumerable || !1),
                    (r.configurable = !0),
                    'value' in r && (r.writable = !0),
                    Object.defineProperty(t, r.key, r);
            }
        }
        return function(t, e, n) {
            return e && r(t.prototype, e), n && r(t, n), t;
        };
    })();
    var w = {
            brightness: o,
            color: s,
            colorize: u,
            contrast: c,
            gamma: l,
            grayscale: f,
            invert: d,
            noise: p,
            sepia: h,
            threshold: v
        },
        y = function(t) {
            if (t.data) return t.data;
            var e = (function(t) {
                    if (t.url) {
                        var e = document.createElement('img');
                        return e.setAttribute('src', t.url), e;
                    }
                    return g(t.from);
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
        x = (function() {
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
                if (((this.data = y(t)), !this.data))
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
                        value: function(r) {
                            return this.applyFilters().then(function(t) {
                                var e = g(r),
                                    n = document.createElement('img');
                                n.setAttribute('src', a(t)), e.appendChild(n);
                            });
                        }
                    },
                    {
                        key: 'update',
                        value: function(e) {
                            return this.applyFilters().then(function(t) {
                                g(e).setAttribute('src', a(t));
                            });
                        }
                    },
                    {
                        key: 'getDataURL',
                        value: function() {
                            return a(this.data);
                        }
                    }
                ]),
                e
            );
        })();
    return (
        Object.keys(w).forEach(function(e) {
            x.prototype[e] = function(t) {
                return this.filters.push({ filter: e, options: t }), this;
            };
        }),
        x
    );
});
//# sourceMappingURL=lens-chainable.umd.js.map
