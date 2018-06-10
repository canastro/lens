!(function(t, e) {
    'object' == typeof exports && 'undefined' != typeof module
        ? e()
        : 'function' == typeof define && define.amd
            ? define(e)
            : e();
})(0, function() {
    'use strict';
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
                    if (null == a) throw Error('Unknown callback ' + n);
                    delete s[n],
                        e.error ? a[1](Error(e.error)) : a[0](e.result);
                }
        });
    }
    function r(t, e) {
        var n = document.createElement('canvas');
        return (n.width = t), (n.height = e), n;
    }
    (exports.getCanvas = r),
        (exports.convertImageDataToCanvasURL = function(t) {
            var e = window.document.createElement('canvas'),
                n = e.getContext('2d');
            return (
                (e.width = t.width),
                (e.height = t.height),
                n.putImageData(t, 0, 0),
                e.toDataURL()
            );
        }),
        (exports.applyFilter = function(t) {
            var e = t.data,
                n = t.transform,
                i = t.options,
                s = t.nWorkers,
                c = (function(t, e) {
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
                                    (i.default = !0), '' + e + o + '.default='
                                );
                            }
                        )).replace(
                            /^(\s*)export\s+((?:async\s*)?function(?:\s*\*)?|const|let|var)(\s+)([a-zA-Z$_][a-zA-Z0-9$_]*)/gm,
                            function(t, e, n, r, a) {
                                return (
                                    (i[a] = !0),
                                    '' + e + o + '.' + a + '=' + n + r + a
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
                    var c,
                        u = URL.createObjectURL(new Blob([t])),
                        l = new Worker(u, e),
                        p = l.terminate,
                        d = {},
                        f = 0;
                    for (c in ((l.kill = function(t) {
                        l.postMessage({ type: 'KILL', signal: t }),
                            setTimeout(l.terminate);
                    }),
                    (l.terminate = function() {
                        URL.revokeObjectURL(u), p.call(r);
                    }),
                    (l.call = function(r, a) {
                        return new Promise(function(t, e) {
                            var n = 'rpc' + ++f;
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
                        l[c] = function() {
                            return l.call(t, [].slice.call(arguments));
                        };
                    }),
                    a))
                        c in l || l.expose(c);
                    return l;
                })(
                    '\n        var transform = ' +
                        n +
                        ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                ),
                u = r(e.width, e.height),
                l = u.getContext('2d');
            l.putImageData(e, 0, 0), (s = s || 1);
            var p = Math.floor(u.height / s);
            return new Promise(function(e) {
                for (var n = 0, t = void 0, r = 0; r < s; r++) {
                    (t = p), r + 1 === s && (t = u.height - p * r);
                    var a = l.getImageData(0, p * r, u.width, t),
                        o = t * u.width * 4;
                    c.execute(a, r, o, i).then(function(t) {
                        l.putImageData(t.result, 0, p * t.index),
                            ++n === s &&
                                e(l.getImageData(0, 0, u.width, u.height));
                    });
                }
            });
        });
});
//# sourceMappingURL=lens-core.umd.js.map
