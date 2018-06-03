var imageFilterCore = require('image-filter-core');
var imageFilterColor = require('../src/index');
var ColorInterval = require('../src/color-interval');

function applyResults(selector, canvas, context, src) {
    var target = document.querySelectorAll(selector)[0];
    var image = document.createElement('img');
    image.setAttribute('src', imageFilterCore.convertImageDataToCanvasURL(src));
    target.appendChild(image);
}

window.onload = function () {
    var img = new Image;
    img.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        var context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);

        var data = context.getImageData(0, 0, img.width, img.height);

        var colorIntervalBlue = new ColorInterval({
            from: { r: 0, g: 40, b: 100 },
            to: { r: 80, g: 100, b: 150 },
            match: { r: 0, g: 255, b: 255 },
            noMatch: { r: null, g: null, b: null, a: 200 }
        });

        var colorIntervalPink = new ColorInterval({
            from: { r: 120, g: 30, b: 70 },
            to: { r: 150, g: 60, b: 100 },
            match: { r: 255, g: 0, b: 255, a: 255 }
        });

        var options = {
            colorsInterval: [colorIntervalBlue, colorIntervalPink]
        };

        imageFilterColor(data, options, 4)
            .then(function (results) {
                applyResults('#target-1', canvas, context, results);
            });
    };

    img.src = 'dummy.jpg';
};
