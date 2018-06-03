(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? factory(exports)
        : typeof define === 'function' && define.amd
            ? define(['exports'], factory)
            : factory((global.ImageFilterCore = {}));
})(this, function(exports) {
    'use strict';

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
            (t = '(' + Function.prototype.toString.call(t) + ')(' + a + ')'),
            (t =
                (function(e, t, n) {
                    return (
                        (e = (e = e.replace(
                            /^(\s*)export\s+default\s+/m,
                            function(e, r) {
                                return (
                                    (n.default = !0), '' + r + t + '.default='
                                );
                            }
                        )).replace(
                            /^(\s*)export\s+((?:async\s*)?function(?:\s*\*)?|const|let|var)(\s+)([a-zA-Z$_][a-zA-Z0-9$_]*)/gm,
                            function(e, r, o, a, s) {
                                return (
                                    (n[s] = !0),
                                    '' + r + t + '.' + s + '=' + o + a + s
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
            l.postMessage({ type: 'KILL', signal: e }), setTimeout(l.terminate);
        }),
        (l.terminate = function() {
            URL.revokeObjectURL(i), c.call(r);
        }),
        (l.call = function(e, t) {
            return new Promise(function(n, r) {
                var o = 'rpc' + ++p;
                (u[o] = [n, r]),
                    l.postMessage({ type: 'RPC', id: o, method: e, params: t });
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
        const canvas = document.createElement('canvas');
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
        const canvas = window.document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = imageData.width;
        canvas.height = imageData.height;
        ctx.putImageData(imageData, 0, 0);

        return canvas.toDataURL();
    }

    /**
     * Given a worker file with the transformation the work is split
     * between the configured number of workers and the transformation is applied
     * returning a Promise
     * @param {Function} worker
     * @param {Number} options
     * @returns {Promise}
     */
    async function apply(data, transform, options, nWorkers) {
        const worker = workerize(`
        var transform = ${transform};

        export function execute(canvas, index, length, options) {
            transform(canvas.data, length, options);
            return { result: canvas, index };
        }
    `);

        const canvas = getCanvas(data.width, data.height);
        const context = canvas.getContext('2d');
        let finished = 0;
        let blockSize;

        // Drawing the source image into the target canvas
        context.putImageData(data, 0, 0);

        // Minimum number of workers = 1
        if (!nWorkers) {
            nWorkers = 1;
        }

        // Height of the picture chunck for every worker
        blockSize = Math.floor(canvas.height / nWorkers);

        return new Promise(async resolve => {
            let height;

            for (let index = 0; index < nWorkers; index++) {
                // In the last worker we have to make sure we process whatever is missing
                height = blockSize;

                if (index + 1 === nWorkers) {
                    height = canvas.height - blockSize * index;
                }

                // Getting the picture
                const canvasData = context.getImageData(
                    0,
                    blockSize * index,
                    canvas.width,
                    height
                );
                const length = height * canvas.width * 4;
                const response = await worker.execute(
                    canvasData,
                    index,
                    length,
                    options
                );

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
                        context.getImageData(0, 0, canvas.width, canvas.height)
                    );
                }
            }
        });
    }

    exports.getCanvas = getCanvas;
    exports.convertImageDataToCanvasURL = convertImageDataToCanvasURL;
    exports.apply = apply;

    Object.defineProperty(exports, '__esModule', { value: true });
});
//# sourceMappingURL=image-filter-core.umd.js.map
