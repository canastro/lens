import { convertImageDataToCanvasURL } from 'lens-core';
import brightness from '../src/index';

function applyResults(selector, src) {
    const target = document.querySelectorAll(selector)[0];
    const image = document.createElement('img');
    image.setAttribute('src', convertImageDataToCanvasURL(src));
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

        brightness(data, { adjustment: 30 }, 4).then(results =>
            applyResults('#target-1', results)
        );

        brightness(data, { adjustment: 70 }, 4).then(results =>
            applyResults('#target-2', results)
        );
    };

    img.src = 'dummy.jpg';
};
