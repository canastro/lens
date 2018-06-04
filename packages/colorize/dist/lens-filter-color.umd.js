(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? factory(exports)
        : typeof define === 'function' && define.amd
            ? define(['exports'], factory)
            : factory((global.lensFilterColorize = {}));
})(this, function(exports) {
    'use strict';

    var commonjsGlobal =
        typeof window !== 'undefined'
            ? window
            : typeof global !== 'undefined'
                ? global
                : typeof self !== 'undefined'
                    ? self
                    : {};

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
            data[i + 1] -= (data[i + 1] - colorRGB.g) * (options.level / 100);
            data[i + 2] -= (data[i + 2] - colorRGB.b) * (options.level / 100);
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
            throw new Error('lens-filter-colorize:: invalid options provided');
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
//# sourceMappingURL=lens-filter-color.umd.js.map
