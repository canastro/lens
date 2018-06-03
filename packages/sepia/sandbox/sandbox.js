var imageFilterCore = require('image-filter-core');
var imageSepia = require('../src/index');

function applyResults(selector, canvas, context, src) {
    const target = document.querySelectorAll(selector)[0];
    const image = document.createElement('img');
    image.setAttribute('src', imageFilterCore.convertImageDataToCanvasURL(src));
    target.appendChild(image);
}

window.onload = function() {
    const img = new Image();
    img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);

        const data = context.getImageData(0, 0, img.width, img.height);

        imageSepia(data, null, 4).then(function(results) {
            applyResults('#target-1', canvas, context, results);
        });
    };

    img.src = 'dummy.jpg';
};
