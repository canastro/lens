var lensCore = require('lens-core');
var imageNoise = require('../src/index');

function applyResults(selector, canvas, context, src) {
    var target = document.querySelectorAll(selector)[0];
    var image = document.createElement('img');
    image.setAttribute('src', lensCore.convertImageDataToCanvasURL(src));
    target.appendChild(image);
}

window.onload = function() {
    var img = new Image();
    img.onload = function() {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        var context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);

        var data = context.getImageData(0, 0, img.width, img.height);

        imageNoise({ data, options: { level: 50 }, nWorkers: 4 }).then(function(
            results
        ) {
            applyResults('#target-1', canvas, context, results);
        });

        imageNoise({ data, options: { level: 100 }, nWorkers: 4 }).then(
            function(results) {
                applyResults('#target-2', canvas, context, results);
            }
        );
    };

    img.src = 'dummy.jpg';
};
