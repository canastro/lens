!(function(t, e) {
    'object' == typeof exports && 'undefined' != typeof module
        ? e(require('workerize'))
        : 'function' == typeof define && define.amd
            ? define(['workerize'], e)
            : e(t.workerize);
})(this, function(a) {
    'use strict';
    function o(t, e) {
        var n = document.createElement('canvas');
        return (n.width = t), (n.height = e), n;
    }
    (a = a && a.hasOwnProperty('default') ? a.default : a),
        (exports.getCanvas = o),
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
                d = t.nWorkers,
                h = a(
                    '\n        var transform = ' +
                        n +
                        ';\n\n        export function execute(canvas, index, length, options) {\n            canvas.data = transform({ \n                data: canvas.data, \n                length: length, \n                options: options\n            });\n\n            return { result: canvas, index: index };\n        }\n    '
                ),
                u = o(e.width, e.height),
                s = u.getContext('2d');
            s.putImageData(e, 0, 0), (d = d || 1);
            var c = Math.floor(u.height / d);
            return new Promise(function(e) {
                for (var n = 0, t = void 0, a = 0; a < d; a++) {
                    (t = c), a + 1 === d && (t = u.height - c * a);
                    var o = s.getImageData(0, c * a, u.width, t),
                        r = t * u.width * 4;
                    h.execute(o, a, r, i).then(function(t) {
                        s.putImageData(t.result, 0, c * t.index),
                            ++n === d &&
                                e(s.getImageData(0, 0, u.width, u.height));
                    });
                }
            });
        });
});
//# sourceMappingURL=lens-core.umd.js.map
