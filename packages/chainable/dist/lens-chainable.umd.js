(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? (module.exports = factory())
        : typeof define === 'function' && define.amd
            ? define(factory)
            : (global.lensCore = factory());
})(this, function() {
    'use strict';

    var commonjsGlobal =
        typeof window !== 'undefined'
            ? window
            : typeof global !== 'undefined'
                ? global
                : typeof self !== 'undefined'
                    ? self
                    : {};

    function unwrapExports(x) {
        return x &&
            x.__esModule &&
            Object.prototype.hasOwnProperty.call(x, 'default')
            ? x['default']
            : x;
    }

    function createCommonjsModule(fn, module) {
        return (
            (module = { exports: {} }),
            fn(module, module.exports),
            module.exports
        );
    }

    var lensCore_umd = createCommonjsModule(function(module, exports) {
        (function(global, factory) {
            factory();
        })(commonjsGlobal, function() {
            function e(e, t, n) {
                e.addEventListener('message', function(r) {
                    var o = r.data,
                        a = o.id;
                    if ('RPC' === o.type && null != a)
                        if (o.method) {
                            var s = t[o.method];
                            null == s
                                ? e.postMessage({
                                      type: 'RPC',
                                      id: a,
                                      error: 'NO_SUCH_METHOD'
                                  })
                                : Promise.resolve()
                                      .then(function() {
                                          return s.apply(null, o.params);
                                      })
                                      .then(function(t) {
                                          e.postMessage({
                                              type: 'RPC',
                                              id: a,
                                              result: t
                                          });
                                      })
                                      .catch(function(t) {
                                          e.postMessage({
                                              type: 'RPC',
                                              id: a,
                                              error: '' + t
                                          });
                                      });
                        } else {
                            var i = n[a];
                            if (null == i) throw Error('Unknown callback ' + a);
                            delete n[a],
                                o.error ? i[1](Error(o.error)) : i[0](o.result);
                        }
                });
            }
            function workerize(t, n) {
                var r = this,
                    o = {},
                    a =
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
                        a +
                        ')'),
                    (t =
                        (function(e, t, n) {
                            return (
                                (e = (e = e.replace(
                                    /^(\s*)export\s+default\s+/m,
                                    function(e, r) {
                                        return (
                                            (n.default = !0),
                                            '' + r + t + '.default='
                                        );
                                    }
                                )).replace(
                                    /^(\s*)export\s+((?:async\s*)?function(?:\s*\*)?|const|let|var)(\s+)([a-zA-Z$_][a-zA-Z0-9$_]*)/gm,
                                    function(e, r, o, a, s) {
                                        return (
                                            (n[s] = !0),
                                            '' +
                                                r +
                                                t +
                                                '.' +
                                                s +
                                                '=' +
                                                o +
                                                a +
                                                s
                                        );
                                    }
                                )),
                                'var ' + t + '={};\n' + e + '\n' + t + ';'
                            );
                        })(t, a, o) +
                        '\n(' +
                        Function.prototype.toString.call(e) +
                        ')(self,' +
                        a +
                        ',{})');
                var s,
                    i = URL.createObjectURL(new Blob([t])),
                    l = new Worker(i, n),
                    c = l.terminate,
                    u = {},
                    p = 0;
                for (s in ((l.kill = function(e) {
                    l.postMessage({ type: 'KILL', signal: e }),
                        setTimeout(l.terminate);
                }),
                (l.terminate = function() {
                    URL.revokeObjectURL(i), c.call(r);
                }),
                (l.call = function(e, t) {
                    return new Promise(function(n, r) {
                        var o = 'rpc' + ++p;
                        (u[o] = [n, r]),
                            l.postMessage({
                                type: 'RPC',
                                id: o,
                                method: e,
                                params: t
                            });
                    });
                }),
                (l.rpcMethods = {}),
                e(l, l.rpcMethods, u),
                (l.expose = function(e) {
                    l[s] = function() {
                        return l.call(e, [].slice.call(arguments));
                    };
                }),
                o))
                    s in l || l.expose(s);
                return l;
            }

            /**
             * It returns a canvas with the given width and height
             * @param {Number} w - width
             * @param {Number} h - height
             * @returns {Object}
             */
            function getCanvas(w, h) {
                var canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;

                return canvas;
            }

            /**
             * Given a ImageData it returns the dataURL
             * @param {ImageData} imageData
             * @returns {String}
             */
            function convertImageDataToCanvasURL(imageData) {
                var canvas = window.document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                canvas.width = imageData.width;
                canvas.height = imageData.height;
                ctx.putImageData(imageData, 0, 0);

                return canvas.toDataURL();
            }

            /**
             * Given a worker file with the transformation the work is split
             * between the configured number of workers and the transformation is applied
             * returning a Promise
             * @param {Object} data - image data
             * @param {Function} transform - transformation function
             * @param {Object} options - object to be passed to the transform function
             * @param {Number} nWorkers - number of workers to transform the image
             * @returns {Promise}
             */
            function applyFilter(_ref) {
                var data = _ref.data,
                    transform = _ref.transform,
                    options = _ref.options,
                    nWorkers = _ref.nWorkers;

                var worker = workerize(
                    '\n        var transform = ' +
                        transform +
                        ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                );

                // Drawing the source image into the target canvas
                var canvas = getCanvas(data.width, data.height);
                var context = canvas.getContext('2d');
                context.putImageData(data, 0, 0);

                // Minimium 1 worker
                nWorkers = nWorkers || 1;

                // Height of the picture chunck for every worker
                var blockSize = Math.floor(canvas.height / nWorkers);

                return new Promise(function(resolve) {
                    var finished = 0;
                    var height = void 0;

                    for (var index = 0; index < nWorkers; index++) {
                        // In the last worker we have to make sure we process whatever is missing
                        height = blockSize;

                        if (index + 1 === nWorkers) {
                            height = canvas.height - blockSize * index;
                        }

                        // Getting the picture
                        var canvasData = context.getImageData(
                            0,
                            blockSize * index,
                            canvas.width,
                            height
                        );
                        var length = height * canvas.width * 4;

                        worker
                            .execute(canvasData, index, length, options)
                            .then(function(response) {
                                // Copying back canvas data to canvas
                                // If the first webworker  (index 0) returns data, apply it at pixel (0, 0) onwards
                                // If the second webworker  (index 1) returns data, apply it at pixel (0, canvas.height/4) onwards, and so on
                                context.putImageData(
                                    response.result,
                                    0,
                                    blockSize * response.index
                                );

                                finished++;

                                if (finished === nWorkers) {
                                    resolve(
                                        context.getImageData(
                                            0,
                                            0,
                                            canvas.width,
                                            canvas.height
                                        )
                                    );
                                }
                            });
                    }
                });
            }

            exports.getCanvas = getCanvas;
            exports.convertImageDataToCanvasURL = convertImageDataToCanvasURL;
            exports.applyFilter = applyFilter;
        });
    });
    var lensCore_umd_1 = lensCore_umd.getCanvas;
    var lensCore_umd_2 = lensCore_umd.convertImageDataToCanvasURL;
    var lensCore_umd_3 = lensCore_umd.applyFilter;

    var lensFilterBrightness_umd = createCommonjsModule(function(
        module,
        exports
    ) {
        (function(global, factory) {
            factory(exports);
        })(commonjsGlobal, function(exports) {
            var commonjsGlobal$$1 =
                typeof window !== 'undefined'
                    ? window
                    : typeof commonjsGlobal !== 'undefined'
                        ? commonjsGlobal
                        : typeof self !== 'undefined'
                            ? self
                            : {};

            function createCommonjsModule$$1(fn, module) {
                return (
                    (module = { exports: {} }),
                    fn(module, module.exports),
                    module.exports
                );
            }

            var lensCore_umd = createCommonjsModule$$1(function(
                module,
                exports
            ) {
                (function(global, factory) {
                    factory();
                })(commonjsGlobal$$1, function() {
                    function e(e, t, n) {
                        e.addEventListener('message', function(r) {
                            var o = r.data,
                                a = o.id;
                            if ('RPC' === o.type && null != a)
                                if (o.method) {
                                    var s = t[o.method];
                                    null == s
                                        ? e.postMessage({
                                              type: 'RPC',
                                              id: a,
                                              error: 'NO_SUCH_METHOD'
                                          })
                                        : Promise.resolve()
                                              .then(function() {
                                                  return s.apply(
                                                      null,
                                                      o.params
                                                  );
                                              })
                                              .then(function(t) {
                                                  e.postMessage({
                                                      type: 'RPC',
                                                      id: a,
                                                      result: t
                                                  });
                                              })
                                              .catch(function(t) {
                                                  e.postMessage({
                                                      type: 'RPC',
                                                      id: a,
                                                      error: '' + t
                                                  });
                                              });
                                } else {
                                    var i = n[a];
                                    if (null == i)
                                        throw Error('Unknown callback ' + a);
                                    delete n[a],
                                        o.error
                                            ? i[1](Error(o.error))
                                            : i[0](o.result);
                                }
                        });
                    }
                    function workerize(t, n) {
                        var r = this,
                            o = {},
                            a =
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
                                a +
                                ')'),
                            (t =
                                (function(e, t, n) {
                                    return (
                                        (e = (e = e.replace(
                                            /^(\s*)export\s+default\s+/m,
                                            function(e, r) {
                                                return (
                                                    (n.default = !0),
                                                    '' + r + t + '.default='
                                                );
                                            }
                                        )).replace(
                                            /^(\s*)export\s+((?:async\s*)?function(?:\s*\*)?|const|let|var)(\s+)([a-zA-Z$_][a-zA-Z0-9$_]*)/gm,
                                            function(e, r, o, a, s) {
                                                return (
                                                    (n[s] = !0),
                                                    '' +
                                                        r +
                                                        t +
                                                        '.' +
                                                        s +
                                                        '=' +
                                                        o +
                                                        a +
                                                        s
                                                );
                                            }
                                        )),
                                        'var ' +
                                            t +
                                            '={};\n' +
                                            e +
                                            '\n' +
                                            t +
                                            ';'
                                    );
                                })(t, a, o) +
                                '\n(' +
                                Function.prototype.toString.call(e) +
                                ')(self,' +
                                a +
                                ',{})');
                        var s,
                            i = URL.createObjectURL(new Blob([t])),
                            l = new Worker(i, n),
                            c = l.terminate,
                            u = {},
                            p = 0;
                        for (s in ((l.kill = function(e) {
                            l.postMessage({ type: 'KILL', signal: e }),
                                setTimeout(l.terminate);
                        }),
                        (l.terminate = function() {
                            URL.revokeObjectURL(i), c.call(r);
                        }),
                        (l.call = function(e, t) {
                            return new Promise(function(n, r) {
                                var o = 'rpc' + ++p;
                                (u[o] = [n, r]),
                                    l.postMessage({
                                        type: 'RPC',
                                        id: o,
                                        method: e,
                                        params: t
                                    });
                            });
                        }),
                        (l.rpcMethods = {}),
                        e(l, l.rpcMethods, u),
                        (l.expose = function(e) {
                            l[s] = function() {
                                return l.call(e, [].slice.call(arguments));
                            };
                        }),
                        o)) {
                            s in l || l.expose(s);
                        }
                        return l;
                    }

                    /**
                     * It returns a canvas with the given width and height
                     * @param {Number} w - width
                     * @param {Number} h - height
                     * @returns {Object}
                     */
                    function getCanvas(w, h) {
                        var canvas = document.createElement('canvas');
                        canvas.width = w;
                        canvas.height = h;

                        return canvas;
                    }

                    /**
                     * Given a ImageData it returns the dataURL
                     * @param {ImageData} imageData
                     * @returns {String}
                     */
                    function convertImageDataToCanvasURL(imageData) {
                        var canvas = window.document.createElement('canvas');
                        var ctx = canvas.getContext('2d');
                        canvas.width = imageData.width;
                        canvas.height = imageData.height;
                        ctx.putImageData(imageData, 0, 0);

                        return canvas.toDataURL();
                    }

                    /**
                     * Given a worker file with the transformation the work is split
                     * between the configured number of workers and the transformation is applied
                     * returning a Promise
                     * @param {Object} data - image data
                     * @param {Function} transform - transformation function
                     * @param {Object} options - object to be passed to the transform function
                     * @param {Number} nWorkers - number of workers to transform the image
                     * @returns {Promise}
                     */
                    function applyFilter(_ref) {
                        var data = _ref.data,
                            transform = _ref.transform,
                            options = _ref.options,
                            nWorkers = _ref.nWorkers;

                        var worker = workerize(
                            '\n        var transform = ' +
                                transform +
                                ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                        );

                        // Drawing the source image into the target canvas
                        var canvas = getCanvas(data.width, data.height);
                        var context = canvas.getContext('2d');
                        context.putImageData(data, 0, 0);

                        // Minimium 1 worker
                        nWorkers = nWorkers || 1;

                        // Height of the picture chunck for every worker
                        var blockSize = Math.floor(canvas.height / nWorkers);

                        return new Promise(function(resolve) {
                            var finished = 0;
                            var height = void 0;

                            for (var index = 0; index < nWorkers; index++) {
                                // In the last worker we have to make sure we process whatever is missing
                                height = blockSize;

                                if (index + 1 === nWorkers) {
                                    height = canvas.height - blockSize * index;
                                }

                                // Getting the picture
                                var canvasData = context.getImageData(
                                    0,
                                    blockSize * index,
                                    canvas.width,
                                    height
                                );
                                var length = height * canvas.width * 4;

                                worker
                                    .execute(canvasData, index, length, options)
                                    .then(function(response) {
                                        // Copying back canvas data to canvas
                                        // If the first webworker  (index 0) returns data, apply it at pixel (0, 0) onwards
                                        // If the second webworker  (index 1) returns data, apply it at pixel (0, canvas.height/4) onwards, and so on
                                        context.putImageData(
                                            response.result,
                                            0,
                                            blockSize * response.index
                                        );

                                        finished++;

                                        if (finished === nWorkers) {
                                            resolve(
                                                context.getImageData(
                                                    0,
                                                    0,
                                                    canvas.width,
                                                    canvas.height
                                                )
                                            );
                                        }
                                    });
                            }
                        });
                    }

                    exports.getCanvas = getCanvas;
                    exports.convertImageDataToCanvasURL = convertImageDataToCanvasURL;
                    exports.applyFilter = applyFilter;
                });
            });
            var lensCore_umd_1 = lensCore_umd.getCanvas;
            var lensCore_umd_2 = lensCore_umd.convertImageDataToCanvasURL;
            var lensCore_umd_3 = lensCore_umd.applyFilter;

            /**
             * Iterate over the array applying the brightness transformation
             * @param {Object} data
             * @param {Number} length
             * @param {Object} options
             * @param {Number} [options.adjustment]
             */
            var transform = function transform(_ref) {
                var data = _ref.data,
                    length = _ref.length,
                    options = _ref.options;

                for (var i = 0; i < length; i += 4) {
                    data[i] += options.adjustment;
                    data[i + 1] += options.adjustment;
                    data[i + 2] += options.adjustment;
                }

                return data;
            };

            /**
             * @param {ImageData} data - data of a image extracted from a canvas
             * @param {Object} options - options to pass to the transformation function
             * @param {Number} [options.adjustment] - adjustment to apply in the transformation
             * @param {Number} nWorkers - number of workers
             * @returns {Promise}
             */
            function brightness() {
                var _ref2 =
                        arguments.length > 0 && arguments[0] !== undefined
                            ? arguments[0]
                            : {},
                    data = _ref2.data,
                    options = _ref2.options,
                    nWorkers = _ref2.nWorkers;

                if (!data || !options || !options.adjustment) {
                    throw new Error(
                        'lens-filter-brightness:: invalid options provided'
                    );
                }

                return lensCore_umd_3({
                    data: data,
                    transform: transform,
                    options: options,
                    nWorkers: nWorkers
                });
            }

            exports.transform = transform;
            exports.default = brightness;

            Object.defineProperty(exports, '__esModule', { value: true });
        });
    });

    var brightness = unwrapExports(lensFilterBrightness_umd);

    var lensFilterColor_umd = createCommonjsModule(function(module, exports) {
        (function(global, factory) {
            factory(exports);
        })(commonjsGlobal, function(exports) {
            var commonjsGlobal$$1 =
                typeof window !== 'undefined'
                    ? window
                    : typeof commonjsGlobal !== 'undefined'
                        ? commonjsGlobal
                        : typeof self !== 'undefined'
                            ? self
                            : {};

            function createCommonjsModule$$1(fn, module) {
                return (
                    (module = { exports: {} }),
                    fn(module, module.exports),
                    module.exports
                );
            }

            var lensCore_umd = createCommonjsModule$$1(function(
                module,
                exports
            ) {
                (function(global, factory) {
                    factory();
                })(commonjsGlobal$$1, function() {
                    function e(e, t, n) {
                        e.addEventListener('message', function(r) {
                            var o = r.data,
                                a = o.id;
                            if ('RPC' === o.type && null != a)
                                if (o.method) {
                                    var s = t[o.method];
                                    null == s
                                        ? e.postMessage({
                                              type: 'RPC',
                                              id: a,
                                              error: 'NO_SUCH_METHOD'
                                          })
                                        : Promise.resolve()
                                              .then(function() {
                                                  return s.apply(
                                                      null,
                                                      o.params
                                                  );
                                              })
                                              .then(function(t) {
                                                  e.postMessage({
                                                      type: 'RPC',
                                                      id: a,
                                                      result: t
                                                  });
                                              })
                                              .catch(function(t) {
                                                  e.postMessage({
                                                      type: 'RPC',
                                                      id: a,
                                                      error: '' + t
                                                  });
                                              });
                                } else {
                                    var i = n[a];
                                    if (null == i)
                                        throw Error('Unknown callback ' + a);
                                    delete n[a],
                                        o.error
                                            ? i[1](Error(o.error))
                                            : i[0](o.result);
                                }
                        });
                    }
                    function workerize(t, n) {
                        var r = this,
                            o = {},
                            a =
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
                                a +
                                ')'),
                            (t =
                                (function(e, t, n) {
                                    return (
                                        (e = (e = e.replace(
                                            /^(\s*)export\s+default\s+/m,
                                            function(e, r) {
                                                return (
                                                    (n.default = !0),
                                                    '' + r + t + '.default='
                                                );
                                            }
                                        )).replace(
                                            /^(\s*)export\s+((?:async\s*)?function(?:\s*\*)?|const|let|var)(\s+)([a-zA-Z$_][a-zA-Z0-9$_]*)/gm,
                                            function(e, r, o, a, s) {
                                                return (
                                                    (n[s] = !0),
                                                    '' +
                                                        r +
                                                        t +
                                                        '.' +
                                                        s +
                                                        '=' +
                                                        o +
                                                        a +
                                                        s
                                                );
                                            }
                                        )),
                                        'var ' +
                                            t +
                                            '={};\n' +
                                            e +
                                            '\n' +
                                            t +
                                            ';'
                                    );
                                })(t, a, o) +
                                '\n(' +
                                Function.prototype.toString.call(e) +
                                ')(self,' +
                                a +
                                ',{})');
                        var s,
                            i = URL.createObjectURL(new Blob([t])),
                            l = new Worker(i, n),
                            c = l.terminate,
                            u = {},
                            p = 0;
                        for (s in ((l.kill = function(e) {
                            l.postMessage({ type: 'KILL', signal: e }),
                                setTimeout(l.terminate);
                        }),
                        (l.terminate = function() {
                            URL.revokeObjectURL(i), c.call(r);
                        }),
                        (l.call = function(e, t) {
                            return new Promise(function(n, r) {
                                var o = 'rpc' + ++p;
                                (u[o] = [n, r]),
                                    l.postMessage({
                                        type: 'RPC',
                                        id: o,
                                        method: e,
                                        params: t
                                    });
                            });
                        }),
                        (l.rpcMethods = {}),
                        e(l, l.rpcMethods, u),
                        (l.expose = function(e) {
                            l[s] = function() {
                                return l.call(e, [].slice.call(arguments));
                            };
                        }),
                        o)) {
                            s in l || l.expose(s);
                        }
                        return l;
                    }

                    /**
                     * It returns a canvas with the given width and height
                     * @param {Number} w - width
                     * @param {Number} h - height
                     * @returns {Object}
                     */
                    function getCanvas(w, h) {
                        var canvas = document.createElement('canvas');
                        canvas.width = w;
                        canvas.height = h;

                        return canvas;
                    }

                    /**
                     * Given a ImageData it returns the dataURL
                     * @param {ImageData} imageData
                     * @returns {String}
                     */
                    function convertImageDataToCanvasURL(imageData) {
                        var canvas = window.document.createElement('canvas');
                        var ctx = canvas.getContext('2d');
                        canvas.width = imageData.width;
                        canvas.height = imageData.height;
                        ctx.putImageData(imageData, 0, 0);

                        return canvas.toDataURL();
                    }

                    /**
                     * Given a worker file with the transformation the work is split
                     * between the configured number of workers and the transformation is applied
                     * returning a Promise
                     * @param {Object} data - image data
                     * @param {Function} transform - transformation function
                     * @param {Object} options - object to be passed to the transform function
                     * @param {Number} nWorkers - number of workers to transform the image
                     * @returns {Promise}
                     */
                    function applyFilter(_ref) {
                        var data = _ref.data,
                            transform = _ref.transform,
                            options = _ref.options,
                            nWorkers = _ref.nWorkers;

                        var worker = workerize(
                            '\n        var transform = ' +
                                transform +
                                ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                        );

                        // Drawing the source image into the target canvas
                        var canvas = getCanvas(data.width, data.height);
                        var context = canvas.getContext('2d');
                        context.putImageData(data, 0, 0);

                        // Minimium 1 worker
                        nWorkers = nWorkers || 1;

                        // Height of the picture chunck for every worker
                        var blockSize = Math.floor(canvas.height / nWorkers);

                        return new Promise(function(resolve) {
                            var finished = 0;
                            var height = void 0;

                            for (var index = 0; index < nWorkers; index++) {
                                // In the last worker we have to make sure we process whatever is missing
                                height = blockSize;

                                if (index + 1 === nWorkers) {
                                    height = canvas.height - blockSize * index;
                                }

                                // Getting the picture
                                var canvasData = context.getImageData(
                                    0,
                                    blockSize * index,
                                    canvas.width,
                                    height
                                );
                                var length = height * canvas.width * 4;

                                worker
                                    .execute(canvasData, index, length, options)
                                    .then(function(response) {
                                        // Copying back canvas data to canvas
                                        // If the first webworker  (index 0) returns data, apply it at pixel (0, 0) onwards
                                        // If the second webworker  (index 1) returns data, apply it at pixel (0, canvas.height/4) onwards, and so on
                                        context.putImageData(
                                            response.result,
                                            0,
                                            blockSize * response.index
                                        );

                                        finished++;

                                        if (finished === nWorkers) {
                                            resolve(
                                                context.getImageData(
                                                    0,
                                                    0,
                                                    canvas.width,
                                                    canvas.height
                                                )
                                            );
                                        }
                                    });
                            }
                        });
                    }

                    exports.getCanvas = getCanvas;
                    exports.convertImageDataToCanvasURL = convertImageDataToCanvasURL;
                    exports.applyFilter = applyFilter;
                });
            });
            var lensCore_umd_1 = lensCore_umd.getCanvas;
            var lensCore_umd_2 = lensCore_umd.convertImageDataToCanvasURL;
            var lensCore_umd_3 = lensCore_umd.applyFilter;

            /**
             * Iterate over the array applying the color transformation
             * @param {Object} data
             * @param {Number} length
             * @param {Object} options
             * @param {Array<ColorInterval>} [options.colorsInterval]
             */
            var transform = function transform(_ref) {
                var data = _ref.data,
                    length = _ref.length,
                    options = _ref.options;

                /**
                 * Validates if param is numeric
                 * @param   {Number}  n
                 * @returns {Boolean}
                 */
                var isNumeric = function isNumeric(n) {
                    return !isNaN(parseFloat(n)) && isFinite(n);
                };

                /**
                 * @param {Array} pixles
                 * @param {Number} index
                 * @param {Color} color
                 */
                var applyPixelTransformation = function applyPixelTransformation(
                    pixels,
                    index,
                    color
                ) {
                    pixels[index] = !isNumeric(color.r)
                        ? pixels[index]
                        : color.r;
                    pixels[index + 1] = !isNumeric(color.g)
                        ? pixels[index + 1]
                        : color.g;
                    pixels[index + 2] = !isNumeric(color.b)
                        ? pixels[index + 2]
                        : color.b;
                    pixels[index + 3] = !isNumeric(color.a)
                        ? pixels[index + 3]
                        : color.a;
                };

                /**
                 * @param {Array} data
                 * @param {Number} index
                 * @param {ColorInterval} colorInterval
                 */
                var evaluatePixel = function evaluatePixel(
                    data,
                    index,
                    colorInterval
                ) {
                    var red = data[index];
                    var green = data[index + 1];
                    var blue = data[index + 2];

                    return (
                        red >= colorInterval.from.r &&
                        red <= colorInterval.to.r &&
                        green >= colorInterval.from.g &&
                        green <= colorInterval.to.g &&
                        blue >= colorInterval.from.b &&
                        blue <= colorInterval.to.b
                    );
                };

                var _loop = function _loop(i) {
                    options.colorsInterval.forEach(function(colorInterval) {
                        var isMatch = evaluatePixel(data, i, colorInterval);

                        if (isMatch && colorInterval.match) {
                            applyPixelTransformation(
                                data,
                                i,
                                colorInterval.match
                            );
                        } else if (!isMatch && colorInterval.noMatch) {
                            applyPixelTransformation(
                                data,
                                i,
                                colorInterval.noMatch
                            );
                        }
                    });
                };

                for (var i = 0; i < length; i += 4) {
                    _loop(i);
                }

                return data;
            };

            /**
             * @param {ImageData} data - data of a image extracted from a canvas
             * @param {Object} options - options to pass to the transformation function
             * @param {ColorInterval} [options.colorsInterval] - adjustment to apply in the transformation
             * @param {Number} nWorkers - number of workers
             * @returns {Promise}
             */
            function color() {
                var _ref2 =
                        arguments.length > 0 && arguments[0] !== undefined
                            ? arguments[0]
                            : {},
                    data = _ref2.data,
                    options = _ref2.options,
                    nWorkers = _ref2.nWorkers;

                if (
                    !data ||
                    !options ||
                    !options.colorsInterval ||
                    !Array.isArray(options.colorsInterval)
                ) {
                    throw new Error(
                        'lens-filter-color:: invalid options provided'
                    );
                }

                return lensCore_umd_3({
                    data: data,
                    transform: transform,
                    options: options,
                    nWorkers: nWorkers
                });
            }

            exports.transform = transform;
            exports.default = color;

            Object.defineProperty(exports, '__esModule', { value: true });
        });
    });

    var color = unwrapExports(lensFilterColor_umd);

    var lensFilterColor_umd$1 = createCommonjsModule(function(module, exports) {
        (function(global, factory) {
            factory(exports);
        })(commonjsGlobal, function(exports) {
            var commonjsGlobal$$1 =
                typeof window !== 'undefined'
                    ? window
                    : typeof commonjsGlobal !== 'undefined'
                        ? commonjsGlobal
                        : typeof self !== 'undefined'
                            ? self
                            : {};

            function createCommonjsModule$$1(fn, module) {
                return (
                    (module = { exports: {} }),
                    fn(module, module.exports),
                    module.exports
                );
            }

            var lensCore_umd = createCommonjsModule$$1(function(
                module,
                exports
            ) {
                (function(global, factory) {
                    factory();
                })(commonjsGlobal$$1, function() {
                    function e(e, t, n) {
                        e.addEventListener('message', function(r) {
                            var o = r.data,
                                a = o.id;
                            if ('RPC' === o.type && null != a)
                                if (o.method) {
                                    var s = t[o.method];
                                    null == s
                                        ? e.postMessage({
                                              type: 'RPC',
                                              id: a,
                                              error: 'NO_SUCH_METHOD'
                                          })
                                        : Promise.resolve()
                                              .then(function() {
                                                  return s.apply(
                                                      null,
                                                      o.params
                                                  );
                                              })
                                              .then(function(t) {
                                                  e.postMessage({
                                                      type: 'RPC',
                                                      id: a,
                                                      result: t
                                                  });
                                              })
                                              .catch(function(t) {
                                                  e.postMessage({
                                                      type: 'RPC',
                                                      id: a,
                                                      error: '' + t
                                                  });
                                              });
                                } else {
                                    var i = n[a];
                                    if (null == i)
                                        throw Error('Unknown callback ' + a);
                                    delete n[a],
                                        o.error
                                            ? i[1](Error(o.error))
                                            : i[0](o.result);
                                }
                        });
                    }
                    function workerize(t, n) {
                        var r = this,
                            o = {},
                            a =
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
                                a +
                                ')'),
                            (t =
                                (function(e, t, n) {
                                    return (
                                        (e = (e = e.replace(
                                            /^(\s*)export\s+default\s+/m,
                                            function(e, r) {
                                                return (
                                                    (n.default = !0),
                                                    '' + r + t + '.default='
                                                );
                                            }
                                        )).replace(
                                            /^(\s*)export\s+((?:async\s*)?function(?:\s*\*)?|const|let|var)(\s+)([a-zA-Z$_][a-zA-Z0-9$_]*)/gm,
                                            function(e, r, o, a, s) {
                                                return (
                                                    (n[s] = !0),
                                                    '' +
                                                        r +
                                                        t +
                                                        '.' +
                                                        s +
                                                        '=' +
                                                        o +
                                                        a +
                                                        s
                                                );
                                            }
                                        )),
                                        'var ' +
                                            t +
                                            '={};\n' +
                                            e +
                                            '\n' +
                                            t +
                                            ';'
                                    );
                                })(t, a, o) +
                                '\n(' +
                                Function.prototype.toString.call(e) +
                                ')(self,' +
                                a +
                                ',{})');
                        var s,
                            i = URL.createObjectURL(new Blob([t])),
                            l = new Worker(i, n),
                            c = l.terminate,
                            u = {},
                            p = 0;
                        for (s in ((l.kill = function(e) {
                            l.postMessage({ type: 'KILL', signal: e }),
                                setTimeout(l.terminate);
                        }),
                        (l.terminate = function() {
                            URL.revokeObjectURL(i), c.call(r);
                        }),
                        (l.call = function(e, t) {
                            return new Promise(function(n, r) {
                                var o = 'rpc' + ++p;
                                (u[o] = [n, r]),
                                    l.postMessage({
                                        type: 'RPC',
                                        id: o,
                                        method: e,
                                        params: t
                                    });
                            });
                        }),
                        (l.rpcMethods = {}),
                        e(l, l.rpcMethods, u),
                        (l.expose = function(e) {
                            l[s] = function() {
                                return l.call(e, [].slice.call(arguments));
                            };
                        }),
                        o)) {
                            s in l || l.expose(s);
                        }
                        return l;
                    }

                    /**
                     * It returns a canvas with the given width and height
                     * @param {Number} w - width
                     * @param {Number} h - height
                     * @returns {Object}
                     */
                    function getCanvas(w, h) {
                        var canvas = document.createElement('canvas');
                        canvas.width = w;
                        canvas.height = h;

                        return canvas;
                    }

                    /**
                     * Given a ImageData it returns the dataURL
                     * @param {ImageData} imageData
                     * @returns {String}
                     */
                    function convertImageDataToCanvasURL(imageData) {
                        var canvas = window.document.createElement('canvas');
                        var ctx = canvas.getContext('2d');
                        canvas.width = imageData.width;
                        canvas.height = imageData.height;
                        ctx.putImageData(imageData, 0, 0);

                        return canvas.toDataURL();
                    }

                    /**
                     * Given a worker file with the transformation the work is split
                     * between the configured number of workers and the transformation is applied
                     * returning a Promise
                     * @param {Object} data - image data
                     * @param {Function} transform - transformation function
                     * @param {Object} options - object to be passed to the transform function
                     * @param {Number} nWorkers - number of workers to transform the image
                     * @returns {Promise}
                     */
                    function applyFilter(_ref) {
                        var data = _ref.data,
                            transform = _ref.transform,
                            options = _ref.options,
                            nWorkers = _ref.nWorkers;

                        var worker = workerize(
                            '\n        var transform = ' +
                                transform +
                                ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                        );

                        // Drawing the source image into the target canvas
                        var canvas = getCanvas(data.width, data.height);
                        var context = canvas.getContext('2d');
                        context.putImageData(data, 0, 0);

                        // Minimium 1 worker
                        nWorkers = nWorkers || 1;

                        // Height of the picture chunck for every worker
                        var blockSize = Math.floor(canvas.height / nWorkers);

                        return new Promise(function(resolve) {
                            var finished = 0;
                            var height = void 0;

                            for (var index = 0; index < nWorkers; index++) {
                                // In the last worker we have to make sure we process whatever is missing
                                height = blockSize;

                                if (index + 1 === nWorkers) {
                                    height = canvas.height - blockSize * index;
                                }

                                // Getting the picture
                                var canvasData = context.getImageData(
                                    0,
                                    blockSize * index,
                                    canvas.width,
                                    height
                                );
                                var length = height * canvas.width * 4;

                                worker
                                    .execute(canvasData, index, length, options)
                                    .then(function(response) {
                                        // Copying back canvas data to canvas
                                        // If the first webworker  (index 0) returns data, apply it at pixel (0, 0) onwards
                                        // If the second webworker  (index 1) returns data, apply it at pixel (0, canvas.height/4) onwards, and so on
                                        context.putImageData(
                                            response.result,
                                            0,
                                            blockSize * response.index
                                        );

                                        finished++;

                                        if (finished === nWorkers) {
                                            resolve(
                                                context.getImageData(
                                                    0,
                                                    0,
                                                    canvas.width,
                                                    canvas.height
                                                )
                                            );
                                        }
                                    });
                            }
                        });
                    }

                    exports.getCanvas = getCanvas;
                    exports.convertImageDataToCanvasURL = convertImageDataToCanvasURL;
                    exports.applyFilter = applyFilter;
                });
            });
            var lensCore_umd_1 = lensCore_umd.getCanvas;
            var lensCore_umd_2 = lensCore_umd.convertImageDataToCanvasURL;
            var lensCore_umd_3 = lensCore_umd.applyFilter;

            /**
             * @param {Object} data
             * @param {Number} length
             * @param {Object} options
             * @param {Number} [options.color]
             * @param {Number} [options.level]
             */
            var transform = function transform(_ref) {
                var data = _ref.data,
                    length = _ref.length,
                    options = _ref.options;

                var hex =
                    options.color.charAt(0) === '#'
                        ? options.color.substr(1)
                        : options.color;
                var colorRGB = {
                    r: parseInt(hex.substr(0, 2), 16),
                    g: parseInt(hex.substr(2, 2), 16),
                    b: parseInt(hex.substr(4, 2), 16)
                };

                for (var i = 0; i < length; i += 4) {
                    data[i] -= (data[i] - colorRGB.r) * (options.level / 100);
                    data[i + 1] -=
                        (data[i + 1] - colorRGB.g) * (options.level / 100);
                    data[i + 2] -=
                        (data[i + 2] - colorRGB.b) * (options.level / 100);
                }

                return data;
            };

            /**
             * @param {ImageData} data - data of a image extracted from a canvas
             * @param {Object} options - options to pass to the transformation function
             * @param {Number} [options.color] - color value to apply in the transformation
             * @param {Number} [options.level] - level value to apply in the transformation
             * @param {Number} nWorkers - number of workers
             * @returns {Promise}
             */
            function colorize() {
                var _ref2 =
                        arguments.length > 0 && arguments[0] !== undefined
                            ? arguments[0]
                            : {},
                    data = _ref2.data,
                    options = _ref2.options,
                    nWorkers = _ref2.nWorkers;

                if (!data || !options || !options.color || !options.level) {
                    throw new Error(
                        'lens-filter-colorize:: invalid options provided'
                    );
                }

                return lensCore_umd_3({
                    data: data,
                    transform: transform,
                    options: options,
                    nWorkers: nWorkers
                });
            }

            exports.transform = transform;
            exports.default = colorize;

            Object.defineProperty(exports, '__esModule', { value: true });
        });
    });

    var colorize = unwrapExports(lensFilterColor_umd$1);

    var lensFilterContrast_umd = createCommonjsModule(function(
        module,
        exports
    ) {
        (function(global, factory) {
            factory(exports);
        })(commonjsGlobal, function(exports) {
            var commonjsGlobal$$1 =
                typeof window !== 'undefined'
                    ? window
                    : typeof commonjsGlobal !== 'undefined'
                        ? commonjsGlobal
                        : typeof self !== 'undefined'
                            ? self
                            : {};

            function createCommonjsModule$$1(fn, module) {
                return (
                    (module = { exports: {} }),
                    fn(module, module.exports),
                    module.exports
                );
            }

            var lensCore_umd = createCommonjsModule$$1(function(
                module,
                exports
            ) {
                (function(global, factory) {
                    factory();
                })(commonjsGlobal$$1, function() {
                    function e(e, t, n) {
                        e.addEventListener('message', function(r) {
                            var o = r.data,
                                a = o.id;
                            if ('RPC' === o.type && null != a)
                                if (o.method) {
                                    var s = t[o.method];
                                    null == s
                                        ? e.postMessage({
                                              type: 'RPC',
                                              id: a,
                                              error: 'NO_SUCH_METHOD'
                                          })
                                        : Promise.resolve()
                                              .then(function() {
                                                  return s.apply(
                                                      null,
                                                      o.params
                                                  );
                                              })
                                              .then(function(t) {
                                                  e.postMessage({
                                                      type: 'RPC',
                                                      id: a,
                                                      result: t
                                                  });
                                              })
                                              .catch(function(t) {
                                                  e.postMessage({
                                                      type: 'RPC',
                                                      id: a,
                                                      error: '' + t
                                                  });
                                              });
                                } else {
                                    var i = n[a];
                                    if (null == i)
                                        throw Error('Unknown callback ' + a);
                                    delete n[a],
                                        o.error
                                            ? i[1](Error(o.error))
                                            : i[0](o.result);
                                }
                        });
                    }
                    function workerize(t, n) {
                        var r = this,
                            o = {},
                            a =
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
                                a +
                                ')'),
                            (t =
                                (function(e, t, n) {
                                    return (
                                        (e = (e = e.replace(
                                            /^(\s*)export\s+default\s+/m,
                                            function(e, r) {
                                                return (
                                                    (n.default = !0),
                                                    '' + r + t + '.default='
                                                );
                                            }
                                        )).replace(
                                            /^(\s*)export\s+((?:async\s*)?function(?:\s*\*)?|const|let|var)(\s+)([a-zA-Z$_][a-zA-Z0-9$_]*)/gm,
                                            function(e, r, o, a, s) {
                                                return (
                                                    (n[s] = !0),
                                                    '' +
                                                        r +
                                                        t +
                                                        '.' +
                                                        s +
                                                        '=' +
                                                        o +
                                                        a +
                                                        s
                                                );
                                            }
                                        )),
                                        'var ' +
                                            t +
                                            '={};\n' +
                                            e +
                                            '\n' +
                                            t +
                                            ';'
                                    );
                                })(t, a, o) +
                                '\n(' +
                                Function.prototype.toString.call(e) +
                                ')(self,' +
                                a +
                                ',{})');
                        var s,
                            i = URL.createObjectURL(new Blob([t])),
                            l = new Worker(i, n),
                            c = l.terminate,
                            u = {},
                            p = 0;
                        for (s in ((l.kill = function(e) {
                            l.postMessage({ type: 'KILL', signal: e }),
                                setTimeout(l.terminate);
                        }),
                        (l.terminate = function() {
                            URL.revokeObjectURL(i), c.call(r);
                        }),
                        (l.call = function(e, t) {
                            return new Promise(function(n, r) {
                                var o = 'rpc' + ++p;
                                (u[o] = [n, r]),
                                    l.postMessage({
                                        type: 'RPC',
                                        id: o,
                                        method: e,
                                        params: t
                                    });
                            });
                        }),
                        (l.rpcMethods = {}),
                        e(l, l.rpcMethods, u),
                        (l.expose = function(e) {
                            l[s] = function() {
                                return l.call(e, [].slice.call(arguments));
                            };
                        }),
                        o)) {
                            s in l || l.expose(s);
                        }
                        return l;
                    }

                    /**
                     * It returns a canvas with the given width and height
                     * @param {Number} w - width
                     * @param {Number} h - height
                     * @returns {Object}
                     */
                    function getCanvas(w, h) {
                        var canvas = document.createElement('canvas');
                        canvas.width = w;
                        canvas.height = h;

                        return canvas;
                    }

                    /**
                     * Given a ImageData it returns the dataURL
                     * @param {ImageData} imageData
                     * @returns {String}
                     */
                    function convertImageDataToCanvasURL(imageData) {
                        var canvas = window.document.createElement('canvas');
                        var ctx = canvas.getContext('2d');
                        canvas.width = imageData.width;
                        canvas.height = imageData.height;
                        ctx.putImageData(imageData, 0, 0);

                        return canvas.toDataURL();
                    }

                    /**
                     * Given a worker file with the transformation the work is split
                     * between the configured number of workers and the transformation is applied
                     * returning a Promise
                     * @param {Object} data - image data
                     * @param {Function} transform - transformation function
                     * @param {Object} options - object to be passed to the transform function
                     * @param {Number} nWorkers - number of workers to transform the image
                     * @returns {Promise}
                     */
                    function applyFilter(_ref) {
                        var data = _ref.data,
                            transform = _ref.transform,
                            options = _ref.options,
                            nWorkers = _ref.nWorkers;

                        var worker = workerize(
                            '\n        var transform = ' +
                                transform +
                                ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                        );

                        // Drawing the source image into the target canvas
                        var canvas = getCanvas(data.width, data.height);
                        var context = canvas.getContext('2d');
                        context.putImageData(data, 0, 0);

                        // Minimium 1 worker
                        nWorkers = nWorkers || 1;

                        // Height of the picture chunck for every worker
                        var blockSize = Math.floor(canvas.height / nWorkers);

                        return new Promise(function(resolve) {
                            var finished = 0;
                            var height = void 0;

                            for (var index = 0; index < nWorkers; index++) {
                                // In the last worker we have to make sure we process whatever is missing
                                height = blockSize;

                                if (index + 1 === nWorkers) {
                                    height = canvas.height - blockSize * index;
                                }

                                // Getting the picture
                                var canvasData = context.getImageData(
                                    0,
                                    blockSize * index,
                                    canvas.width,
                                    height
                                );
                                var length = height * canvas.width * 4;

                                worker
                                    .execute(canvasData, index, length, options)
                                    .then(function(response) {
                                        // Copying back canvas data to canvas
                                        // If the first webworker  (index 0) returns data, apply it at pixel (0, 0) onwards
                                        // If the second webworker  (index 1) returns data, apply it at pixel (0, canvas.height/4) onwards, and so on
                                        context.putImageData(
                                            response.result,
                                            0,
                                            blockSize * response.index
                                        );

                                        finished++;

                                        if (finished === nWorkers) {
                                            resolve(
                                                context.getImageData(
                                                    0,
                                                    0,
                                                    canvas.width,
                                                    canvas.height
                                                )
                                            );
                                        }
                                    });
                            }
                        });
                    }

                    exports.getCanvas = getCanvas;
                    exports.convertImageDataToCanvasURL = convertImageDataToCanvasURL;
                    exports.applyFilter = applyFilter;
                });
            });
            var lensCore_umd_1 = lensCore_umd.getCanvas;
            var lensCore_umd_2 = lensCore_umd.convertImageDataToCanvasURL;
            var lensCore_umd_3 = lensCore_umd.applyFilter;

            /**
             * Iterate over the array applying the contrast transformation
             * @name transform
             * @param {Object} data
             * @param {Number} length
             * @param {Object} options
             * @param {Number} [options.contrast]
             */
            var transform = function transform(_ref) {
                var data = _ref.data,
                    length = _ref.length,
                    options = _ref.options;

                var factor =
                    (259 * (options.contrast + 255)) /
                    (255 * (259 - options.contrast));

                for (var i = 0; i < length; i += 4) {
                    data[i] = factor * (data[i] - 128) + 128;
                    data[i + 1] = factor * (data[i + 1] - 128) + 128;
                    data[i + 2] = factor * (data[i + 2] - 128) + 128;
                }

                return data;
            };

            /**
             * @param {ImageData} data - data of a image extracted from a canvas
             * @param {Object} options - options to pass to the transformation function
             * @param {Number} [options.contrast] - contrast value to apply in the transformation
             * @param {Number} nWorkers - number of workers
             * @returns {Promise}
             */
            function contrast() {
                var _ref2 =
                        arguments.length > 0 && arguments[0] !== undefined
                            ? arguments[0]
                            : {},
                    data = _ref2.data,
                    options = _ref2.options,
                    nWorkers = _ref2.nWorkers;

                if (!data || !options || !options.contrast) {
                    throw new Error(
                        'lens-filter-contrast:: invalid options provided'
                    );
                }

                return lensCore_umd_3({
                    data: data,
                    transform: transform,
                    options: options,
                    nWorkers: nWorkers
                });
            }

            exports.transform = transform;
            exports.default = contrast;

            Object.defineProperty(exports, '__esModule', { value: true });
        });
    });

    var contrast = unwrapExports(lensFilterContrast_umd);

    var lensFilterGamma_umd = createCommonjsModule(function(module, exports) {
        (function(global, factory) {
            factory(exports);
        })(commonjsGlobal, function(exports) {
            var commonjsGlobal$$1 =
                typeof window !== 'undefined'
                    ? window
                    : typeof commonjsGlobal !== 'undefined'
                        ? commonjsGlobal
                        : typeof self !== 'undefined'
                            ? self
                            : {};

            function createCommonjsModule$$1(fn, module) {
                return (
                    (module = { exports: {} }),
                    fn(module, module.exports),
                    module.exports
                );
            }

            var lensCore_umd = createCommonjsModule$$1(function(
                module,
                exports
            ) {
                (function(global, factory) {
                    factory();
                })(commonjsGlobal$$1, function() {
                    function e(e, t, n) {
                        e.addEventListener('message', function(r) {
                            var o = r.data,
                                a = o.id;
                            if ('RPC' === o.type && null != a)
                                if (o.method) {
                                    var s = t[o.method];
                                    null == s
                                        ? e.postMessage({
                                              type: 'RPC',
                                              id: a,
                                              error: 'NO_SUCH_METHOD'
                                          })
                                        : Promise.resolve()
                                              .then(function() {
                                                  return s.apply(
                                                      null,
                                                      o.params
                                                  );
                                              })
                                              .then(function(t) {
                                                  e.postMessage({
                                                      type: 'RPC',
                                                      id: a,
                                                      result: t
                                                  });
                                              })
                                              .catch(function(t) {
                                                  e.postMessage({
                                                      type: 'RPC',
                                                      id: a,
                                                      error: '' + t
                                                  });
                                              });
                                } else {
                                    var i = n[a];
                                    if (null == i)
                                        throw Error('Unknown callback ' + a);
                                    delete n[a],
                                        o.error
                                            ? i[1](Error(o.error))
                                            : i[0](o.result);
                                }
                        });
                    }
                    function workerize(t, n) {
                        var r = this,
                            o = {},
                            a =
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
                                a +
                                ')'),
                            (t =
                                (function(e, t, n) {
                                    return (
                                        (e = (e = e.replace(
                                            /^(\s*)export\s+default\s+/m,
                                            function(e, r) {
                                                return (
                                                    (n.default = !0),
                                                    '' + r + t + '.default='
                                                );
                                            }
                                        )).replace(
                                            /^(\s*)export\s+((?:async\s*)?function(?:\s*\*)?|const|let|var)(\s+)([a-zA-Z$_][a-zA-Z0-9$_]*)/gm,
                                            function(e, r, o, a, s) {
                                                return (
                                                    (n[s] = !0),
                                                    '' +
                                                        r +
                                                        t +
                                                        '.' +
                                                        s +
                                                        '=' +
                                                        o +
                                                        a +
                                                        s
                                                );
                                            }
                                        )),
                                        'var ' +
                                            t +
                                            '={};\n' +
                                            e +
                                            '\n' +
                                            t +
                                            ';'
                                    );
                                })(t, a, o) +
                                '\n(' +
                                Function.prototype.toString.call(e) +
                                ')(self,' +
                                a +
                                ',{})');
                        var s,
                            i = URL.createObjectURL(new Blob([t])),
                            l = new Worker(i, n),
                            c = l.terminate,
                            u = {},
                            p = 0;
                        for (s in ((l.kill = function(e) {
                            l.postMessage({ type: 'KILL', signal: e }),
                                setTimeout(l.terminate);
                        }),
                        (l.terminate = function() {
                            URL.revokeObjectURL(i), c.call(r);
                        }),
                        (l.call = function(e, t) {
                            return new Promise(function(n, r) {
                                var o = 'rpc' + ++p;
                                (u[o] = [n, r]),
                                    l.postMessage({
                                        type: 'RPC',
                                        id: o,
                                        method: e,
                                        params: t
                                    });
                            });
                        }),
                        (l.rpcMethods = {}),
                        e(l, l.rpcMethods, u),
                        (l.expose = function(e) {
                            l[s] = function() {
                                return l.call(e, [].slice.call(arguments));
                            };
                        }),
                        o)) {
                            s in l || l.expose(s);
                        }
                        return l;
                    }

                    /**
                     * It returns a canvas with the given width and height
                     * @param {Number} w - width
                     * @param {Number} h - height
                     * @returns {Object}
                     */
                    function getCanvas(w, h) {
                        var canvas = document.createElement('canvas');
                        canvas.width = w;
                        canvas.height = h;

                        return canvas;
                    }

                    /**
                     * Given a ImageData it returns the dataURL
                     * @param {ImageData} imageData
                     * @returns {String}
                     */
                    function convertImageDataToCanvasURL(imageData) {
                        var canvas = window.document.createElement('canvas');
                        var ctx = canvas.getContext('2d');
                        canvas.width = imageData.width;
                        canvas.height = imageData.height;
                        ctx.putImageData(imageData, 0, 0);

                        return canvas.toDataURL();
                    }

                    /**
                     * Given a worker file with the transformation the work is split
                     * between the configured number of workers and the transformation is applied
                     * returning a Promise
                     * @param {Object} data - image data
                     * @param {Function} transform - transformation function
                     * @param {Object} options - object to be passed to the transform function
                     * @param {Number} nWorkers - number of workers to transform the image
                     * @returns {Promise}
                     */
                    function applyFilter(_ref) {
                        var data = _ref.data,
                            transform = _ref.transform,
                            options = _ref.options,
                            nWorkers = _ref.nWorkers;

                        var worker = workerize(
                            '\n        var transform = ' +
                                transform +
                                ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                        );

                        // Drawing the source image into the target canvas
                        var canvas = getCanvas(data.width, data.height);
                        var context = canvas.getContext('2d');
                        context.putImageData(data, 0, 0);

                        // Minimium 1 worker
                        nWorkers = nWorkers || 1;

                        // Height of the picture chunck for every worker
                        var blockSize = Math.floor(canvas.height / nWorkers);

                        return new Promise(function(resolve) {
                            var finished = 0;
                            var height = void 0;

                            for (var index = 0; index < nWorkers; index++) {
                                // In the last worker we have to make sure we process whatever is missing
                                height = blockSize;

                                if (index + 1 === nWorkers) {
                                    height = canvas.height - blockSize * index;
                                }

                                // Getting the picture
                                var canvasData = context.getImageData(
                                    0,
                                    blockSize * index,
                                    canvas.width,
                                    height
                                );
                                var length = height * canvas.width * 4;

                                worker
                                    .execute(canvasData, index, length, options)
                                    .then(function(response) {
                                        // Copying back canvas data to canvas
                                        // If the first webworker  (index 0) returns data, apply it at pixel (0, 0) onwards
                                        // If the second webworker  (index 1) returns data, apply it at pixel (0, canvas.height/4) onwards, and so on
                                        context.putImageData(
                                            response.result,
                                            0,
                                            blockSize * response.index
                                        );

                                        finished++;

                                        if (finished === nWorkers) {
                                            resolve(
                                                context.getImageData(
                                                    0,
                                                    0,
                                                    canvas.width,
                                                    canvas.height
                                                )
                                            );
                                        }
                                    });
                            }
                        });
                    }

                    exports.getCanvas = getCanvas;
                    exports.convertImageDataToCanvasURL = convertImageDataToCanvasURL;
                    exports.applyFilter = applyFilter;
                });
            });
            var lensCore_umd_1 = lensCore_umd.getCanvas;
            var lensCore_umd_2 = lensCore_umd.convertImageDataToCanvasURL;
            var lensCore_umd_3 = lensCore_umd.applyFilter;

            /**
             * Iterate over the array applying the gamma transformation
             * @param {Object} data
             * @param {Number} length
             * @param {Object} options
             * @param {Number} [options.adjustment]
             */
            var transform = function transform(_ref) {
                var data = _ref.data,
                    length = _ref.length,
                    options = _ref.options;

                for (var i = 0; i < length; i += 4) {
                    data[i] = Math.pow(data[i] / 255, options.adjustment) * 255;
                    data[i + 1] =
                        Math.pow(data[i + 1] / 255, options.adjustment) * 255;
                    data[i + 2] =
                        Math.pow(data[i + 2] / 255, options.adjustment) * 255;
                }

                return data;
            };

            /**
             * @param {ImageData} data - data of a image extracted from a canvas
             * @param {Object} options - options to pass to the transformation function
             * @param {Number} [options.adjustment] - adjustment to apply in the transformation
             * @param {Number} nWorkers - number of workers
             * @returns {Promise}
             */
            function gamma() {
                var _ref2 =
                        arguments.length > 0 && arguments[0] !== undefined
                            ? arguments[0]
                            : {},
                    data = _ref2.data,
                    options = _ref2.options,
                    nWorkers = _ref2.nWorkers;

                if (!data || !options || !options.adjustment) {
                    throw new Error(
                        'lens-filter-gamma:: invalid options provided'
                    );
                }

                return lensCore_umd_3({
                    data: data,
                    transform: transform,
                    options: options,
                    nWorkers: nWorkers
                });
            }

            exports.transform = transform;
            exports.default = gamma;

            Object.defineProperty(exports, '__esModule', { value: true });
        });
    });

    var gamma = unwrapExports(lensFilterGamma_umd);

    var lensFilterGrayscale_umd = createCommonjsModule(function(
        module,
        exports
    ) {
        (function(global, factory) {
            factory(exports);
        })(commonjsGlobal, function(exports) {
            var commonjsGlobal$$1 =
                typeof window !== 'undefined'
                    ? window
                    : typeof commonjsGlobal !== 'undefined'
                        ? commonjsGlobal
                        : typeof self !== 'undefined'
                            ? self
                            : {};

            function createCommonjsModule$$1(fn, module) {
                return (
                    (module = { exports: {} }),
                    fn(module, module.exports),
                    module.exports
                );
            }

            var lensCore_umd = createCommonjsModule$$1(function(
                module,
                exports
            ) {
                (function(global, factory) {
                    factory();
                })(commonjsGlobal$$1, function() {
                    function e(e, t, n) {
                        e.addEventListener('message', function(r) {
                            var o = r.data,
                                a = o.id;
                            if ('RPC' === o.type && null != a)
                                if (o.method) {
                                    var s = t[o.method];
                                    null == s
                                        ? e.postMessage({
                                              type: 'RPC',
                                              id: a,
                                              error: 'NO_SUCH_METHOD'
                                          })
                                        : Promise.resolve()
                                              .then(function() {
                                                  return s.apply(
                                                      null,
                                                      o.params
                                                  );
                                              })
                                              .then(function(t) {
                                                  e.postMessage({
                                                      type: 'RPC',
                                                      id: a,
                                                      result: t
                                                  });
                                              })
                                              .catch(function(t) {
                                                  e.postMessage({
                                                      type: 'RPC',
                                                      id: a,
                                                      error: '' + t
                                                  });
                                              });
                                } else {
                                    var i = n[a];
                                    if (null == i)
                                        throw Error('Unknown callback ' + a);
                                    delete n[a],
                                        o.error
                                            ? i[1](Error(o.error))
                                            : i[0](o.result);
                                }
                        });
                    }
                    function workerize(t, n) {
                        var r = this,
                            o = {},
                            a =
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
                                a +
                                ')'),
                            (t =
                                (function(e, t, n) {
                                    return (
                                        (e = (e = e.replace(
                                            /^(\s*)export\s+default\s+/m,
                                            function(e, r) {
                                                return (
                                                    (n.default = !0),
                                                    '' + r + t + '.default='
                                                );
                                            }
                                        )).replace(
                                            /^(\s*)export\s+((?:async\s*)?function(?:\s*\*)?|const|let|var)(\s+)([a-zA-Z$_][a-zA-Z0-9$_]*)/gm,
                                            function(e, r, o, a, s) {
                                                return (
                                                    (n[s] = !0),
                                                    '' +
                                                        r +
                                                        t +
                                                        '.' +
                                                        s +
                                                        '=' +
                                                        o +
                                                        a +
                                                        s
                                                );
                                            }
                                        )),
                                        'var ' +
                                            t +
                                            '={};\n' +
                                            e +
                                            '\n' +
                                            t +
                                            ';'
                                    );
                                })(t, a, o) +
                                '\n(' +
                                Function.prototype.toString.call(e) +
                                ')(self,' +
                                a +
                                ',{})');
                        var s,
                            i = URL.createObjectURL(new Blob([t])),
                            l = new Worker(i, n),
                            c = l.terminate,
                            u = {},
                            p = 0;
                        for (s in ((l.kill = function(e) {
                            l.postMessage({ type: 'KILL', signal: e }),
                                setTimeout(l.terminate);
                        }),
                        (l.terminate = function() {
                            URL.revokeObjectURL(i), c.call(r);
                        }),
                        (l.call = function(e, t) {
                            return new Promise(function(n, r) {
                                var o = 'rpc' + ++p;
                                (u[o] = [n, r]),
                                    l.postMessage({
                                        type: 'RPC',
                                        id: o,
                                        method: e,
                                        params: t
                                    });
                            });
                        }),
                        (l.rpcMethods = {}),
                        e(l, l.rpcMethods, u),
                        (l.expose = function(e) {
                            l[s] = function() {
                                return l.call(e, [].slice.call(arguments));
                            };
                        }),
                        o)) {
                            s in l || l.expose(s);
                        }
                        return l;
                    }

                    /**
                     * It returns a canvas with the given width and height
                     * @param {Number} w - width
                     * @param {Number} h - height
                     * @returns {Object}
                     */
                    function getCanvas(w, h) {
                        var canvas = document.createElement('canvas');
                        canvas.width = w;
                        canvas.height = h;

                        return canvas;
                    }

                    /**
                     * Given a ImageData it returns the dataURL
                     * @param {ImageData} imageData
                     * @returns {String}
                     */
                    function convertImageDataToCanvasURL(imageData) {
                        var canvas = window.document.createElement('canvas');
                        var ctx = canvas.getContext('2d');
                        canvas.width = imageData.width;
                        canvas.height = imageData.height;
                        ctx.putImageData(imageData, 0, 0);

                        return canvas.toDataURL();
                    }

                    /**
                     * Given a worker file with the transformation the work is split
                     * between the configured number of workers and the transformation is applied
                     * returning a Promise
                     * @param {Object} data - image data
                     * @param {Function} transform - transformation function
                     * @param {Object} options - object to be passed to the transform function
                     * @param {Number} nWorkers - number of workers to transform the image
                     * @returns {Promise}
                     */
                    function applyFilter(_ref) {
                        var data = _ref.data,
                            transform = _ref.transform,
                            options = _ref.options,
                            nWorkers = _ref.nWorkers;

                        var worker = workerize(
                            '\n        var transform = ' +
                                transform +
                                ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                        );

                        // Drawing the source image into the target canvas
                        var canvas = getCanvas(data.width, data.height);
                        var context = canvas.getContext('2d');
                        context.putImageData(data, 0, 0);

                        // Minimium 1 worker
                        nWorkers = nWorkers || 1;

                        // Height of the picture chunck for every worker
                        var blockSize = Math.floor(canvas.height / nWorkers);

                        return new Promise(function(resolve) {
                            var finished = 0;
                            var height = void 0;

                            for (var index = 0; index < nWorkers; index++) {
                                // In the last worker we have to make sure we process whatever is missing
                                height = blockSize;

                                if (index + 1 === nWorkers) {
                                    height = canvas.height - blockSize * index;
                                }

                                // Getting the picture
                                var canvasData = context.getImageData(
                                    0,
                                    blockSize * index,
                                    canvas.width,
                                    height
                                );
                                var length = height * canvas.width * 4;

                                worker
                                    .execute(canvasData, index, length, options)
                                    .then(function(response) {
                                        // Copying back canvas data to canvas
                                        // If the first webworker  (index 0) returns data, apply it at pixel (0, 0) onwards
                                        // If the second webworker  (index 1) returns data, apply it at pixel (0, canvas.height/4) onwards, and so on
                                        context.putImageData(
                                            response.result,
                                            0,
                                            blockSize * response.index
                                        );

                                        finished++;

                                        if (finished === nWorkers) {
                                            resolve(
                                                context.getImageData(
                                                    0,
                                                    0,
                                                    canvas.width,
                                                    canvas.height
                                                )
                                            );
                                        }
                                    });
                            }
                        });
                    }

                    exports.getCanvas = getCanvas;
                    exports.convertImageDataToCanvasURL = convertImageDataToCanvasURL;
                    exports.applyFilter = applyFilter;
                });
            });
            var lensCore_umd_1 = lensCore_umd.getCanvas;
            var lensCore_umd_2 = lensCore_umd.convertImageDataToCanvasURL;
            var lensCore_umd_3 = lensCore_umd.applyFilter;

            /**
             * Iterate over the array applying the grayscale transformation
             * @param {Object} data
             * @param {Number} length
             */
            var transform = function transform(_ref) {
                var data = _ref.data,
                    length = _ref.length;

                for (var i = 0; i < length; i += 4) {
                    var r = data[i];
                    var g = data[i + 1];
                    var b = data[i + 2];

                    // CIE luminance for the RGB
                    // The human eye is bad at seeing red and blue, so we de-emphasize them.
                    var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                    data[i] = data[i + 1] = data[i + 2] = v;
                }

                return data;
            };

            /**
             * @param {ImageData} data - data of a image extracted from a canvas
             * @param {Number} nWorkers - number of workers
             * @returns {Promise}
             */
            function grayscale() {
                var _ref2 =
                        arguments.length > 0 && arguments[0] !== undefined
                            ? arguments[0]
                            : {},
                    data = _ref2.data,
                    nWorkers = _ref2.nWorkers;

                if (!data) {
                    throw new Error(
                        'lens-filter-grayscale:: invalid options provided'
                    );
                }

                return lensCore_umd_3({
                    data: data,
                    transform: transform,
                    nWorkers: nWorkers
                });
            }

            exports.transform = transform;
            exports.default = grayscale;

            Object.defineProperty(exports, '__esModule', { value: true });
        });
    });

    var grayscale = unwrapExports(lensFilterGrayscale_umd);

    var lensFilterGrayscale_umd$1 = createCommonjsModule(function(
        module,
        exports
    ) {
        (function(global, factory) {
            factory(exports);
        })(commonjsGlobal, function(exports) {
            var commonjsGlobal$$1 =
                typeof window !== 'undefined'
                    ? window
                    : typeof commonjsGlobal !== 'undefined'
                        ? commonjsGlobal
                        : typeof self !== 'undefined'
                            ? self
                            : {};

            function createCommonjsModule$$1(fn, module) {
                return (
                    (module = { exports: {} }),
                    fn(module, module.exports),
                    module.exports
                );
            }

            var lensCore_umd = createCommonjsModule$$1(function(
                module,
                exports
            ) {
                (function(global, factory) {
                    factory();
                })(commonjsGlobal$$1, function() {
                    function e(e, t, n) {
                        e.addEventListener('message', function(r) {
                            var o = r.data,
                                a = o.id;
                            if ('RPC' === o.type && null != a)
                                if (o.method) {
                                    var s = t[o.method];
                                    null == s
                                        ? e.postMessage({
                                              type: 'RPC',
                                              id: a,
                                              error: 'NO_SUCH_METHOD'
                                          })
                                        : Promise.resolve()
                                              .then(function() {
                                                  return s.apply(
                                                      null,
                                                      o.params
                                                  );
                                              })
                                              .then(function(t) {
                                                  e.postMessage({
                                                      type: 'RPC',
                                                      id: a,
                                                      result: t
                                                  });
                                              })
                                              .catch(function(t) {
                                                  e.postMessage({
                                                      type: 'RPC',
                                                      id: a,
                                                      error: '' + t
                                                  });
                                              });
                                } else {
                                    var i = n[a];
                                    if (null == i)
                                        throw Error('Unknown callback ' + a);
                                    delete n[a],
                                        o.error
                                            ? i[1](Error(o.error))
                                            : i[0](o.result);
                                }
                        });
                    }
                    function workerize(t, n) {
                        var r = this,
                            o = {},
                            a =
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
                                a +
                                ')'),
                            (t =
                                (function(e, t, n) {
                                    return (
                                        (e = (e = e.replace(
                                            /^(\s*)export\s+default\s+/m,
                                            function(e, r) {
                                                return (
                                                    (n.default = !0),
                                                    '' + r + t + '.default='
                                                );
                                            }
                                        )).replace(
                                            /^(\s*)export\s+((?:async\s*)?function(?:\s*\*)?|const|let|var)(\s+)([a-zA-Z$_][a-zA-Z0-9$_]*)/gm,
                                            function(e, r, o, a, s) {
                                                return (
                                                    (n[s] = !0),
                                                    '' +
                                                        r +
                                                        t +
                                                        '.' +
                                                        s +
                                                        '=' +
                                                        o +
                                                        a +
                                                        s
                                                );
                                            }
                                        )),
                                        'var ' +
                                            t +
                                            '={};\n' +
                                            e +
                                            '\n' +
                                            t +
                                            ';'
                                    );
                                })(t, a, o) +
                                '\n(' +
                                Function.prototype.toString.call(e) +
                                ')(self,' +
                                a +
                                ',{})');
                        var s,
                            i = URL.createObjectURL(new Blob([t])),
                            l = new Worker(i, n),
                            c = l.terminate,
                            u = {},
                            p = 0;
                        for (s in ((l.kill = function(e) {
                            l.postMessage({ type: 'KILL', signal: e }),
                                setTimeout(l.terminate);
                        }),
                        (l.terminate = function() {
                            URL.revokeObjectURL(i), c.call(r);
                        }),
                        (l.call = function(e, t) {
                            return new Promise(function(n, r) {
                                var o = 'rpc' + ++p;
                                (u[o] = [n, r]),
                                    l.postMessage({
                                        type: 'RPC',
                                        id: o,
                                        method: e,
                                        params: t
                                    });
                            });
                        }),
                        (l.rpcMethods = {}),
                        e(l, l.rpcMethods, u),
                        (l.expose = function(e) {
                            l[s] = function() {
                                return l.call(e, [].slice.call(arguments));
                            };
                        }),
                        o)) {
                            s in l || l.expose(s);
                        }
                        return l;
                    }

                    /**
                     * It returns a canvas with the given width and height
                     * @param {Number} w - width
                     * @param {Number} h - height
                     * @returns {Object}
                     */
                    function getCanvas(w, h) {
                        var canvas = document.createElement('canvas');
                        canvas.width = w;
                        canvas.height = h;

                        return canvas;
                    }

                    /**
                     * Given a ImageData it returns the dataURL
                     * @param {ImageData} imageData
                     * @returns {String}
                     */
                    function convertImageDataToCanvasURL(imageData) {
                        var canvas = window.document.createElement('canvas');
                        var ctx = canvas.getContext('2d');
                        canvas.width = imageData.width;
                        canvas.height = imageData.height;
                        ctx.putImageData(imageData, 0, 0);

                        return canvas.toDataURL();
                    }

                    /**
                     * Given a worker file with the transformation the work is split
                     * between the configured number of workers and the transformation is applied
                     * returning a Promise
                     * @param {Object} data - image data
                     * @param {Function} transform - transformation function
                     * @param {Object} options - object to be passed to the transform function
                     * @param {Number} nWorkers - number of workers to transform the image
                     * @returns {Promise}
                     */
                    function applyFilter(_ref) {
                        var data = _ref.data,
                            transform = _ref.transform,
                            options = _ref.options,
                            nWorkers = _ref.nWorkers;

                        var worker = workerize(
                            '\n        var transform = ' +
                                transform +
                                ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                        );

                        // Drawing the source image into the target canvas
                        var canvas = getCanvas(data.width, data.height);
                        var context = canvas.getContext('2d');
                        context.putImageData(data, 0, 0);

                        // Minimium 1 worker
                        nWorkers = nWorkers || 1;

                        // Height of the picture chunck for every worker
                        var blockSize = Math.floor(canvas.height / nWorkers);

                        return new Promise(function(resolve) {
                            var finished = 0;
                            var height = void 0;

                            for (var index = 0; index < nWorkers; index++) {
                                // In the last worker we have to make sure we process whatever is missing
                                height = blockSize;

                                if (index + 1 === nWorkers) {
                                    height = canvas.height - blockSize * index;
                                }

                                // Getting the picture
                                var canvasData = context.getImageData(
                                    0,
                                    blockSize * index,
                                    canvas.width,
                                    height
                                );
                                var length = height * canvas.width * 4;

                                worker
                                    .execute(canvasData, index, length, options)
                                    .then(function(response) {
                                        // Copying back canvas data to canvas
                                        // If the first webworker  (index 0) returns data, apply it at pixel (0, 0) onwards
                                        // If the second webworker  (index 1) returns data, apply it at pixel (0, canvas.height/4) onwards, and so on
                                        context.putImageData(
                                            response.result,
                                            0,
                                            blockSize * response.index
                                        );

                                        finished++;

                                        if (finished === nWorkers) {
                                            resolve(
                                                context.getImageData(
                                                    0,
                                                    0,
                                                    canvas.width,
                                                    canvas.height
                                                )
                                            );
                                        }
                                    });
                            }
                        });
                    }

                    exports.getCanvas = getCanvas;
                    exports.convertImageDataToCanvasURL = convertImageDataToCanvasURL;
                    exports.applyFilter = applyFilter;
                });
            });
            var lensCore_umd_1 = lensCore_umd.getCanvas;
            var lensCore_umd_2 = lensCore_umd.convertImageDataToCanvasURL;
            var lensCore_umd_3 = lensCore_umd.applyFilter;

            /**
             * Iterate over the array applying the invert transformation
             * @name transform
             * @param {Object} data
             * @param {Number} length
             */
            var transform = function transform(_ref) {
                var data = _ref.data,
                    length = _ref.length;

                for (var i = 0; i < length; i += 4) {
                    data[i] = 255 - data[i];
                    data[i + 1] = 255 - data[i + 1];
                    data[i + 2] = 255 - data[i + 2];
                }

                return data;
            };

            /**
             * @name invert
             * @param {ImageData} data - data of a image extracted from a canvas
             * @param {Number} nWorkers - number of workers
             * @returns {Promise}
             */
            function invert() {
                var _ref2 =
                        arguments.length > 0 && arguments[0] !== undefined
                            ? arguments[0]
                            : {},
                    data = _ref2.data,
                    nWorkers = _ref2.nWorkers;

                if (!data) {
                    throw new Error(
                        'lens-filter-invert:: invalid options provided'
                    );
                }

                return lensCore_umd_3({
                    data: data,
                    transform: transform,
                    nWorkers: nWorkers
                });
            }

            exports.transform = transform;
            exports.default = invert;

            Object.defineProperty(exports, '__esModule', { value: true });
        });
    });

    var invert = unwrapExports(lensFilterGrayscale_umd$1);

    var lensFilterNoise_umd = createCommonjsModule(function(module, exports) {
        (function(global, factory) {
            factory(exports);
        })(commonjsGlobal, function(exports) {
            var commonjsGlobal$$1 =
                typeof window !== 'undefined'
                    ? window
                    : typeof commonjsGlobal !== 'undefined'
                        ? commonjsGlobal
                        : typeof self !== 'undefined'
                            ? self
                            : {};

            function createCommonjsModule$$1(fn, module) {
                return (
                    (module = { exports: {} }),
                    fn(module, module.exports),
                    module.exports
                );
            }

            var lensCore_umd = createCommonjsModule$$1(function(
                module,
                exports
            ) {
                (function(global, factory) {
                    factory();
                })(commonjsGlobal$$1, function() {
                    function e(e, t, n) {
                        e.addEventListener('message', function(r) {
                            var o = r.data,
                                a = o.id;
                            if ('RPC' === o.type && null != a)
                                if (o.method) {
                                    var s = t[o.method];
                                    null == s
                                        ? e.postMessage({
                                              type: 'RPC',
                                              id: a,
                                              error: 'NO_SUCH_METHOD'
                                          })
                                        : Promise.resolve()
                                              .then(function() {
                                                  return s.apply(
                                                      null,
                                                      o.params
                                                  );
                                              })
                                              .then(function(t) {
                                                  e.postMessage({
                                                      type: 'RPC',
                                                      id: a,
                                                      result: t
                                                  });
                                              })
                                              .catch(function(t) {
                                                  e.postMessage({
                                                      type: 'RPC',
                                                      id: a,
                                                      error: '' + t
                                                  });
                                              });
                                } else {
                                    var i = n[a];
                                    if (null == i)
                                        throw Error('Unknown callback ' + a);
                                    delete n[a],
                                        o.error
                                            ? i[1](Error(o.error))
                                            : i[0](o.result);
                                }
                        });
                    }
                    function workerize(t, n) {
                        var r = this,
                            o = {},
                            a =
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
                                a +
                                ')'),
                            (t =
                                (function(e, t, n) {
                                    return (
                                        (e = (e = e.replace(
                                            /^(\s*)export\s+default\s+/m,
                                            function(e, r) {
                                                return (
                                                    (n.default = !0),
                                                    '' + r + t + '.default='
                                                );
                                            }
                                        )).replace(
                                            /^(\s*)export\s+((?:async\s*)?function(?:\s*\*)?|const|let|var)(\s+)([a-zA-Z$_][a-zA-Z0-9$_]*)/gm,
                                            function(e, r, o, a, s) {
                                                return (
                                                    (n[s] = !0),
                                                    '' +
                                                        r +
                                                        t +
                                                        '.' +
                                                        s +
                                                        '=' +
                                                        o +
                                                        a +
                                                        s
                                                );
                                            }
                                        )),
                                        'var ' +
                                            t +
                                            '={};\n' +
                                            e +
                                            '\n' +
                                            t +
                                            ';'
                                    );
                                })(t, a, o) +
                                '\n(' +
                                Function.prototype.toString.call(e) +
                                ')(self,' +
                                a +
                                ',{})');
                        var s,
                            i = URL.createObjectURL(new Blob([t])),
                            l = new Worker(i, n),
                            c = l.terminate,
                            u = {},
                            p = 0;
                        for (s in ((l.kill = function(e) {
                            l.postMessage({ type: 'KILL', signal: e }),
                                setTimeout(l.terminate);
                        }),
                        (l.terminate = function() {
                            URL.revokeObjectURL(i), c.call(r);
                        }),
                        (l.call = function(e, t) {
                            return new Promise(function(n, r) {
                                var o = 'rpc' + ++p;
                                (u[o] = [n, r]),
                                    l.postMessage({
                                        type: 'RPC',
                                        id: o,
                                        method: e,
                                        params: t
                                    });
                            });
                        }),
                        (l.rpcMethods = {}),
                        e(l, l.rpcMethods, u),
                        (l.expose = function(e) {
                            l[s] = function() {
                                return l.call(e, [].slice.call(arguments));
                            };
                        }),
                        o)) {
                            s in l || l.expose(s);
                        }
                        return l;
                    }

                    /**
                     * It returns a canvas with the given width and height
                     * @param {Number} w - width
                     * @param {Number} h - height
                     * @returns {Object}
                     */
                    function getCanvas(w, h) {
                        var canvas = document.createElement('canvas');
                        canvas.width = w;
                        canvas.height = h;

                        return canvas;
                    }

                    /**
                     * Given a ImageData it returns the dataURL
                     * @param {ImageData} imageData
                     * @returns {String}
                     */
                    function convertImageDataToCanvasURL(imageData) {
                        var canvas = window.document.createElement('canvas');
                        var ctx = canvas.getContext('2d');
                        canvas.width = imageData.width;
                        canvas.height = imageData.height;
                        ctx.putImageData(imageData, 0, 0);

                        return canvas.toDataURL();
                    }

                    /**
                     * Given a worker file with the transformation the work is split
                     * between the configured number of workers and the transformation is applied
                     * returning a Promise
                     * @param {Object} data - image data
                     * @param {Function} transform - transformation function
                     * @param {Object} options - object to be passed to the transform function
                     * @param {Number} nWorkers - number of workers to transform the image
                     * @returns {Promise}
                     */
                    function applyFilter(_ref) {
                        var data = _ref.data,
                            transform = _ref.transform,
                            options = _ref.options,
                            nWorkers = _ref.nWorkers;

                        var worker = workerize(
                            '\n        var transform = ' +
                                transform +
                                ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                        );

                        // Drawing the source image into the target canvas
                        var canvas = getCanvas(data.width, data.height);
                        var context = canvas.getContext('2d');
                        context.putImageData(data, 0, 0);

                        // Minimium 1 worker
                        nWorkers = nWorkers || 1;

                        // Height of the picture chunck for every worker
                        var blockSize = Math.floor(canvas.height / nWorkers);

                        return new Promise(function(resolve) {
                            var finished = 0;
                            var height = void 0;

                            for (var index = 0; index < nWorkers; index++) {
                                // In the last worker we have to make sure we process whatever is missing
                                height = blockSize;

                                if (index + 1 === nWorkers) {
                                    height = canvas.height - blockSize * index;
                                }

                                // Getting the picture
                                var canvasData = context.getImageData(
                                    0,
                                    blockSize * index,
                                    canvas.width,
                                    height
                                );
                                var length = height * canvas.width * 4;

                                worker
                                    .execute(canvasData, index, length, options)
                                    .then(function(response) {
                                        // Copying back canvas data to canvas
                                        // If the first webworker  (index 0) returns data, apply it at pixel (0, 0) onwards
                                        // If the second webworker  (index 1) returns data, apply it at pixel (0, canvas.height/4) onwards, and so on
                                        context.putImageData(
                                            response.result,
                                            0,
                                            blockSize * response.index
                                        );

                                        finished++;

                                        if (finished === nWorkers) {
                                            resolve(
                                                context.getImageData(
                                                    0,
                                                    0,
                                                    canvas.width,
                                                    canvas.height
                                                )
                                            );
                                        }
                                    });
                            }
                        });
                    }

                    exports.getCanvas = getCanvas;
                    exports.convertImageDataToCanvasURL = convertImageDataToCanvasURL;
                    exports.applyFilter = applyFilter;
                });
            });
            var lensCore_umd_1 = lensCore_umd.getCanvas;
            var lensCore_umd_2 = lensCore_umd.convertImageDataToCanvasURL;
            var lensCore_umd_3 = lensCore_umd.applyFilter;

            /**
             * Iterate over the array applying the noise transformation
             * @param {Array} data
             * @param {Number} length
             * @param {Object} options
             * @param {Number} [options.adjust]
             */
            var transform = function transform(_ref) {
                var data = _ref.data,
                    length = _ref.length,
                    options = _ref.options;

                var adjust = Math.abs(options.adjust) * 2.55;

                var add = function add(original, increment) {
                    var result = original + increment;

                    if (result > 255) {
                        return 255;
                    } else if (result < 0) {
                        return 0;
                    }

                    return result;
                };

                for (var i = 0; i < length; i += 4) {
                    // Calculate if should be negative or positive
                    var multiplier = Math.random() < 0.5 ? -1 : 1;

                    // Calculate random noise
                    var rand = multiplier * (Math.random() + adjust);

                    data[i] = add(data[i], rand);
                    data[i + 1] = add(data[i + 1], rand);
                    data[i + 2] = add(data[i + 2], rand);
                }

                return data;
            };

            /**
             * @param {ImageData} data - data of a image extracted from a canvas
             * @param {Object} options - options to pass to the transformation function
             * @param {Number} [options.noise] - noise to apply in the transformation
             * @param {Number} nWorkers - number of workers
             * @returns {Promise}
             */
            function noise() {
                var _ref2 =
                        arguments.length > 0 && arguments[0] !== undefined
                            ? arguments[0]
                            : {},
                    data = _ref2.data,
                    options = _ref2.options,
                    nWorkers = _ref2.nWorkers;

                if (!data || !options || !options.adjust) {
                    throw new Error(
                        'lens-filter-noise:: invalid options provided'
                    );
                }

                return lensCore_umd_3({
                    data: data,
                    transform: transform,
                    options: options,
                    nWorkers: nWorkers
                });
            }

            exports.transform = transform;
            exports.default = noise;

            Object.defineProperty(exports, '__esModule', { value: true });
        });
    });

    var noise = unwrapExports(lensFilterNoise_umd);

    var lensFilterSepia_umd = createCommonjsModule(function(module, exports) {
        (function(global, factory) {
            factory(exports);
        })(commonjsGlobal, function(exports) {
            var commonjsGlobal$$1 =
                typeof window !== 'undefined'
                    ? window
                    : typeof commonjsGlobal !== 'undefined'
                        ? commonjsGlobal
                        : typeof self !== 'undefined'
                            ? self
                            : {};

            function createCommonjsModule$$1(fn, module) {
                return (
                    (module = { exports: {} }),
                    fn(module, module.exports),
                    module.exports
                );
            }

            var lensCore_umd = createCommonjsModule$$1(function(
                module,
                exports
            ) {
                (function(global, factory) {
                    factory();
                })(commonjsGlobal$$1, function() {
                    function e(e, t, n) {
                        e.addEventListener('message', function(r) {
                            var o = r.data,
                                a = o.id;
                            if ('RPC' === o.type && null != a)
                                if (o.method) {
                                    var s = t[o.method];
                                    null == s
                                        ? e.postMessage({
                                              type: 'RPC',
                                              id: a,
                                              error: 'NO_SUCH_METHOD'
                                          })
                                        : Promise.resolve()
                                              .then(function() {
                                                  return s.apply(
                                                      null,
                                                      o.params
                                                  );
                                              })
                                              .then(function(t) {
                                                  e.postMessage({
                                                      type: 'RPC',
                                                      id: a,
                                                      result: t
                                                  });
                                              })
                                              .catch(function(t) {
                                                  e.postMessage({
                                                      type: 'RPC',
                                                      id: a,
                                                      error: '' + t
                                                  });
                                              });
                                } else {
                                    var i = n[a];
                                    if (null == i)
                                        throw Error('Unknown callback ' + a);
                                    delete n[a],
                                        o.error
                                            ? i[1](Error(o.error))
                                            : i[0](o.result);
                                }
                        });
                    }
                    function workerize(t, n) {
                        var r = this,
                            o = {},
                            a =
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
                                a +
                                ')'),
                            (t =
                                (function(e, t, n) {
                                    return (
                                        (e = (e = e.replace(
                                            /^(\s*)export\s+default\s+/m,
                                            function(e, r) {
                                                return (
                                                    (n.default = !0),
                                                    '' + r + t + '.default='
                                                );
                                            }
                                        )).replace(
                                            /^(\s*)export\s+((?:async\s*)?function(?:\s*\*)?|const|let|var)(\s+)([a-zA-Z$_][a-zA-Z0-9$_]*)/gm,
                                            function(e, r, o, a, s) {
                                                return (
                                                    (n[s] = !0),
                                                    '' +
                                                        r +
                                                        t +
                                                        '.' +
                                                        s +
                                                        '=' +
                                                        o +
                                                        a +
                                                        s
                                                );
                                            }
                                        )),
                                        'var ' +
                                            t +
                                            '={};\n' +
                                            e +
                                            '\n' +
                                            t +
                                            ';'
                                    );
                                })(t, a, o) +
                                '\n(' +
                                Function.prototype.toString.call(e) +
                                ')(self,' +
                                a +
                                ',{})');
                        var s,
                            i = URL.createObjectURL(new Blob([t])),
                            l = new Worker(i, n),
                            c = l.terminate,
                            u = {},
                            p = 0;
                        for (s in ((l.kill = function(e) {
                            l.postMessage({ type: 'KILL', signal: e }),
                                setTimeout(l.terminate);
                        }),
                        (l.terminate = function() {
                            URL.revokeObjectURL(i), c.call(r);
                        }),
                        (l.call = function(e, t) {
                            return new Promise(function(n, r) {
                                var o = 'rpc' + ++p;
                                (u[o] = [n, r]),
                                    l.postMessage({
                                        type: 'RPC',
                                        id: o,
                                        method: e,
                                        params: t
                                    });
                            });
                        }),
                        (l.rpcMethods = {}),
                        e(l, l.rpcMethods, u),
                        (l.expose = function(e) {
                            l[s] = function() {
                                return l.call(e, [].slice.call(arguments));
                            };
                        }),
                        o)) {
                            s in l || l.expose(s);
                        }
                        return l;
                    }

                    /**
                     * It returns a canvas with the given width and height
                     * @param {Number} w - width
                     * @param {Number} h - height
                     * @returns {Object}
                     */
                    function getCanvas(w, h) {
                        var canvas = document.createElement('canvas');
                        canvas.width = w;
                        canvas.height = h;

                        return canvas;
                    }

                    /**
                     * Given a ImageData it returns the dataURL
                     * @param {ImageData} imageData
                     * @returns {String}
                     */
                    function convertImageDataToCanvasURL(imageData) {
                        var canvas = window.document.createElement('canvas');
                        var ctx = canvas.getContext('2d');
                        canvas.width = imageData.width;
                        canvas.height = imageData.height;
                        ctx.putImageData(imageData, 0, 0);

                        return canvas.toDataURL();
                    }

                    /**
                     * Given a worker file with the transformation the work is split
                     * between the configured number of workers and the transformation is applied
                     * returning a Promise
                     * @param {Object} data - image data
                     * @param {Function} transform - transformation function
                     * @param {Object} options - object to be passed to the transform function
                     * @param {Number} nWorkers - number of workers to transform the image
                     * @returns {Promise}
                     */
                    function applyFilter(_ref) {
                        var data = _ref.data,
                            transform = _ref.transform,
                            options = _ref.options,
                            nWorkers = _ref.nWorkers;

                        var worker = workerize(
                            '\n        var transform = ' +
                                transform +
                                ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                        );

                        // Drawing the source image into the target canvas
                        var canvas = getCanvas(data.width, data.height);
                        var context = canvas.getContext('2d');
                        context.putImageData(data, 0, 0);

                        // Minimium 1 worker
                        nWorkers = nWorkers || 1;

                        // Height of the picture chunck for every worker
                        var blockSize = Math.floor(canvas.height / nWorkers);

                        return new Promise(function(resolve) {
                            var finished = 0;
                            var height = void 0;

                            for (var index = 0; index < nWorkers; index++) {
                                // In the last worker we have to make sure we process whatever is missing
                                height = blockSize;

                                if (index + 1 === nWorkers) {
                                    height = canvas.height - blockSize * index;
                                }

                                // Getting the picture
                                var canvasData = context.getImageData(
                                    0,
                                    blockSize * index,
                                    canvas.width,
                                    height
                                );
                                var length = height * canvas.width * 4;

                                worker
                                    .execute(canvasData, index, length, options)
                                    .then(function(response) {
                                        // Copying back canvas data to canvas
                                        // If the first webworker  (index 0) returns data, apply it at pixel (0, 0) onwards
                                        // If the second webworker  (index 1) returns data, apply it at pixel (0, canvas.height/4) onwards, and so on
                                        context.putImageData(
                                            response.result,
                                            0,
                                            blockSize * response.index
                                        );

                                        finished++;

                                        if (finished === nWorkers) {
                                            resolve(
                                                context.getImageData(
                                                    0,
                                                    0,
                                                    canvas.width,
                                                    canvas.height
                                                )
                                            );
                                        }
                                    });
                            }
                        });
                    }

                    exports.getCanvas = getCanvas;
                    exports.convertImageDataToCanvasURL = convertImageDataToCanvasURL;
                    exports.applyFilter = applyFilter;
                });
            });
            var lensCore_umd_1 = lensCore_umd.getCanvas;
            var lensCore_umd_2 = lensCore_umd.convertImageDataToCanvasURL;
            var lensCore_umd_3 = lensCore_umd.applyFilter;

            /**
             * Iterate over the array applying the sepia transformation
             * @param {Object} data
             * @param {Number} length
             */
            var transform = function transform(_ref) {
                var data = _ref.data,
                    length = _ref.length;

                for (var i = 0; i < length; i += 4) {
                    var r = data[i];
                    var g = data[i + 1];
                    var b = data[i + 2];

                    data[i] = r * 0.393 + g * 0.769 + b * 0.189;
                    data[i + 1] = r * 0.349 + g * 0.686 + b * 0.168;
                    data[i + 2] = r * 0.272 + g * 0.534 + b * 0.131;
                }

                return data;
            };

            /**
             * @param {ImageData} data - data of a image extracted from a canvas
             * @param {Number} nWorkers - number of workers
             * @returns {Promise}
             */
            function sepia() {
                var _ref2 =
                        arguments.length > 0 && arguments[0] !== undefined
                            ? arguments[0]
                            : {},
                    data = _ref2.data,
                    nWorkers = _ref2.nWorkers;

                if (!data) {
                    throw new Error(
                        'lens-filter-sepia:: invalid options provided'
                    );
                }

                return lensCore_umd_3({
                    data: data,
                    transform: transform,
                    nWorkers: nWorkers
                });
            }

            exports.transform = transform;
            exports.default = sepia;

            Object.defineProperty(exports, '__esModule', { value: true });
        });
    });

    var sepia = unwrapExports(lensFilterSepia_umd);

    var lensFilterThreshold_umd = createCommonjsModule(function(
        module,
        exports
    ) {
        (function(global, factory) {
            factory(exports);
        })(commonjsGlobal, function(exports) {
            var commonjsGlobal$$1 =
                typeof window !== 'undefined'
                    ? window
                    : typeof commonjsGlobal !== 'undefined'
                        ? commonjsGlobal
                        : typeof self !== 'undefined'
                            ? self
                            : {};

            function createCommonjsModule$$1(fn, module) {
                return (
                    (module = { exports: {} }),
                    fn(module, module.exports),
                    module.exports
                );
            }

            var lensCore_umd = createCommonjsModule$$1(function(
                module,
                exports
            ) {
                (function(global, factory) {
                    factory();
                })(commonjsGlobal$$1, function() {
                    function e(e, t, n) {
                        e.addEventListener('message', function(r) {
                            var o = r.data,
                                a = o.id;
                            if ('RPC' === o.type && null != a)
                                if (o.method) {
                                    var s = t[o.method];
                                    null == s
                                        ? e.postMessage({
                                              type: 'RPC',
                                              id: a,
                                              error: 'NO_SUCH_METHOD'
                                          })
                                        : Promise.resolve()
                                              .then(function() {
                                                  return s.apply(
                                                      null,
                                                      o.params
                                                  );
                                              })
                                              .then(function(t) {
                                                  e.postMessage({
                                                      type: 'RPC',
                                                      id: a,
                                                      result: t
                                                  });
                                              })
                                              .catch(function(t) {
                                                  e.postMessage({
                                                      type: 'RPC',
                                                      id: a,
                                                      error: '' + t
                                                  });
                                              });
                                } else {
                                    var i = n[a];
                                    if (null == i)
                                        throw Error('Unknown callback ' + a);
                                    delete n[a],
                                        o.error
                                            ? i[1](Error(o.error))
                                            : i[0](o.result);
                                }
                        });
                    }
                    function workerize(t, n) {
                        var r = this,
                            o = {},
                            a =
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
                                a +
                                ')'),
                            (t =
                                (function(e, t, n) {
                                    return (
                                        (e = (e = e.replace(
                                            /^(\s*)export\s+default\s+/m,
                                            function(e, r) {
                                                return (
                                                    (n.default = !0),
                                                    '' + r + t + '.default='
                                                );
                                            }
                                        )).replace(
                                            /^(\s*)export\s+((?:async\s*)?function(?:\s*\*)?|const|let|var)(\s+)([a-zA-Z$_][a-zA-Z0-9$_]*)/gm,
                                            function(e, r, o, a, s) {
                                                return (
                                                    (n[s] = !0),
                                                    '' +
                                                        r +
                                                        t +
                                                        '.' +
                                                        s +
                                                        '=' +
                                                        o +
                                                        a +
                                                        s
                                                );
                                            }
                                        )),
                                        'var ' +
                                            t +
                                            '={};\n' +
                                            e +
                                            '\n' +
                                            t +
                                            ';'
                                    );
                                })(t, a, o) +
                                '\n(' +
                                Function.prototype.toString.call(e) +
                                ')(self,' +
                                a +
                                ',{})');
                        var s,
                            i = URL.createObjectURL(new Blob([t])),
                            l = new Worker(i, n),
                            c = l.terminate,
                            u = {},
                            p = 0;
                        for (s in ((l.kill = function(e) {
                            l.postMessage({ type: 'KILL', signal: e }),
                                setTimeout(l.terminate);
                        }),
                        (l.terminate = function() {
                            URL.revokeObjectURL(i), c.call(r);
                        }),
                        (l.call = function(e, t) {
                            return new Promise(function(n, r) {
                                var o = 'rpc' + ++p;
                                (u[o] = [n, r]),
                                    l.postMessage({
                                        type: 'RPC',
                                        id: o,
                                        method: e,
                                        params: t
                                    });
                            });
                        }),
                        (l.rpcMethods = {}),
                        e(l, l.rpcMethods, u),
                        (l.expose = function(e) {
                            l[s] = function() {
                                return l.call(e, [].slice.call(arguments));
                            };
                        }),
                        o)) {
                            s in l || l.expose(s);
                        }
                        return l;
                    }

                    /**
                     * It returns a canvas with the given width and height
                     * @param {Number} w - width
                     * @param {Number} h - height
                     * @returns {Object}
                     */
                    function getCanvas(w, h) {
                        var canvas = document.createElement('canvas');
                        canvas.width = w;
                        canvas.height = h;

                        return canvas;
                    }

                    /**
                     * Given a ImageData it returns the dataURL
                     * @param {ImageData} imageData
                     * @returns {String}
                     */
                    function convertImageDataToCanvasURL(imageData) {
                        var canvas = window.document.createElement('canvas');
                        var ctx = canvas.getContext('2d');
                        canvas.width = imageData.width;
                        canvas.height = imageData.height;
                        ctx.putImageData(imageData, 0, 0);

                        return canvas.toDataURL();
                    }

                    /**
                     * Given a worker file with the transformation the work is split
                     * between the configured number of workers and the transformation is applied
                     * returning a Promise
                     * @param {Object} data - image data
                     * @param {Function} transform - transformation function
                     * @param {Object} options - object to be passed to the transform function
                     * @param {Number} nWorkers - number of workers to transform the image
                     * @returns {Promise}
                     */
                    function applyFilter(_ref) {
                        var data = _ref.data,
                            transform = _ref.transform,
                            options = _ref.options,
                            nWorkers = _ref.nWorkers;

                        var worker = workerize(
                            '\n        var transform = ' +
                                transform +
                                ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                        );

                        // Drawing the source image into the target canvas
                        var canvas = getCanvas(data.width, data.height);
                        var context = canvas.getContext('2d');
                        context.putImageData(data, 0, 0);

                        // Minimium 1 worker
                        nWorkers = nWorkers || 1;

                        // Height of the picture chunck for every worker
                        var blockSize = Math.floor(canvas.height / nWorkers);

                        return new Promise(function(resolve) {
                            var finished = 0;
                            var height = void 0;

                            for (var index = 0; index < nWorkers; index++) {
                                // In the last worker we have to make sure we process whatever is missing
                                height = blockSize;

                                if (index + 1 === nWorkers) {
                                    height = canvas.height - blockSize * index;
                                }

                                // Getting the picture
                                var canvasData = context.getImageData(
                                    0,
                                    blockSize * index,
                                    canvas.width,
                                    height
                                );
                                var length = height * canvas.width * 4;

                                worker
                                    .execute(canvasData, index, length, options)
                                    .then(function(response) {
                                        // Copying back canvas data to canvas
                                        // If the first webworker  (index 0) returns data, apply it at pixel (0, 0) onwards
                                        // If the second webworker  (index 1) returns data, apply it at pixel (0, canvas.height/4) onwards, and so on
                                        context.putImageData(
                                            response.result,
                                            0,
                                            blockSize * response.index
                                        );

                                        finished++;

                                        if (finished === nWorkers) {
                                            resolve(
                                                context.getImageData(
                                                    0,
                                                    0,
                                                    canvas.width,
                                                    canvas.height
                                                )
                                            );
                                        }
                                    });
                            }
                        });
                    }

                    exports.getCanvas = getCanvas;
                    exports.convertImageDataToCanvasURL = convertImageDataToCanvasURL;
                    exports.applyFilter = applyFilter;
                });
            });
            var lensCore_umd_1 = lensCore_umd.getCanvas;
            var lensCore_umd_2 = lensCore_umd.convertImageDataToCanvasURL;
            var lensCore_umd_3 = lensCore_umd.applyFilter;

            /**
             * Iterate over the array applying the threshold transformation
             * @param {Array} data
             * @param {Number} length
             * @param {Object} options
             */
            var transform = function transform(_ref) {
                var data = _ref.data,
                    length = _ref.length,
                    options = _ref.options;

                for (var i = 0; i < length; i += 4) {
                    var r = data[i];
                    var g = data[i + 1];
                    var b = data[i + 2];
                    var v =
                        0.2126 * r + 0.7152 * g + 0.0722 * b >=
                        options.threshold
                            ? 255
                            : 0;
                    data[i] = data[i + 1] = data[i + 2] = v;
                }

                return data;
            };

            /**
             * @param {ImageData} data - data of a image extracted from a canvas
             * @param {Object} options - options to pass to the transformation function
             * @param {Number} [options.threshold] - threshold to apply in the transformation
             * @param {Number} nWorkers - number of workers
             * @returns {Promise}
             */
            function threshold() {
                var _ref2 =
                        arguments.length > 0 && arguments[0] !== undefined
                            ? arguments[0]
                            : {},
                    data = _ref2.data,
                    options = _ref2.options,
                    nWorkers = _ref2.nWorkers;

                if (!data || !options || !options.threshold) {
                    throw new Error(
                        'lens-filter-threshold:: invalid options provided'
                    );
                }

                return lensCore_umd_3({
                    data: data,
                    transform: transform,
                    options: options,
                    nWorkers: nWorkers
                });
            }

            exports.transform = transform;
            exports.default = threshold;

            Object.defineProperty(exports, '__esModule', { value: true });
        });
    });

    var threshold = unwrapExports(lensFilterThreshold_umd);

    /**
     * @method getPixelsFromImage
     * @param {Object} canvas
     * @param {Object} context
     * @param {Object} imageData
     */
    function getPixelsFromImage(canvas, context, element) {
        if (element.tagName !== 'IMG') {
            throw new Error('lens-chainable:: invalid origin');
        }

        context.drawImage(element, 0, 0);
        return context.getImageData(0, 0, canvas.width, canvas.height);
    }

    /**
     * Get a dom nome by selector
     * @method  getElement
     * @param   {String}   selector
     * @returns {Node}
     */
    function getDomElement(selector) {
        if (!selector) {
            throw new Error('lens-chainable:: no selector provided');
        }

        var target = document.querySelectorAll(selector)[0];

        if (!target) {
            throw new Error('lens-chainable:: no "to" element found');
        }

        return target;
    }

    var _createClass = (function() {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ('value' in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        return function(Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    })();

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError('Cannot call a class as a function');
        }
    }

    var METHODS = {
        brightness: brightness,
        color: color,
        colorize: colorize,
        contrast: contrast,
        gamma: gamma,
        grayscale: grayscale,
        invert: invert,
        noise: noise,
        sepia: sepia,
        threshold: threshold
    };

    var getElement = function getElement(options) {
        if (options.url) {
            var element = document.createElement('img');
            element.setAttribute('src', options.url);

            return element;
        }

        return getDomElement(options.from);
    };

    var getImageData = function getImageData(options) {
        if (options.data) return options.data;

        var element = getElement(options);
        var canvas = lensCore_umd_1(element.width, element.height);
        var context = canvas.getContext('2d');

        return getPixelsFromImage(canvas, context, element);
    };

    var Chainable = (function() {
        function Chainable() {
            var options =
                arguments.length > 0 && arguments[0] !== undefined
                    ? arguments[0]
                    : {};

            _classCallCheck(this, Chainable);

            if (!options.url && !options.data && !options.from) {
                throw new Error('lens-chainable:: invalid options object');
            }

            this.data = getImageData(options);

            if (!this.data) {
                throw new Error('lens-chainable:: no data found');
            }

            this.filters = [];
            this.nWorkers = options.nWorkers;
            this.url = options.url;
            this.from = options.from;
        }

        _createClass(Chainable, [
            {
                key: 'applyFilters',
                value: function applyFilters() {
                    var _this = this;

                    var initialValue = Promise.resolve(this.data);

                    return this.filters
                        .reduce(function(promise, item) {
                            return promise.then(function(data) {
                                var fn = METHODS[item.filter];
                                var options = item.options;
                                var nWorkers = _this.nWorkers;

                                return fn({
                                    data: data,
                                    options: options,
                                    nWorkers: nWorkers
                                });
                            });
                        }, initialValue)
                        .then(function(data) {
                            _this.data = data;
                            return data;
                        });
                }
            },
            {
                key: 'append',
                value: function append(selector) {
                    return this.applyFilters().then(function(data) {
                        var target = getDomElement(selector);
                        var image = document.createElement('img');
                        image.setAttribute('src', lensCore_umd_2(data));
                        target.appendChild(image);
                    });
                }
            },
            {
                key: 'update',
                value: function update(selector) {
                    return this.applyFilters().then(function(data) {
                        var target = getDomElement(selector);
                        target.setAttribute('src', lensCore_umd_2(data));
                    });
                }
            },
            {
                key: 'getDataURL',
                value: function getDataURL() {
                    return lensCore_umd_2(this.data);
                }
            }
        ]);

        return Chainable;
    })();

    Object.keys(METHODS).forEach(function(method) {
        Chainable.prototype[method] = function(options) {
            this.filters.push({ filter: method, options: options });
            return this;
        };
    });

    return Chainable;
});
//# sourceMappingURL=lens-chainable.umd.js.map
