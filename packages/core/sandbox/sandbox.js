import { applyFilter, convertImageDataToCanvasURL } from '../src/index';

const transform = ({ data, length, options }) => {
    const hex =
        options.color.charAt(0) === '#'
            ? options.color.substr(1)
            : options.color;
    const colorRGB = {
        r: parseInt(hex.substr(0, 2), 16),
        g: parseInt(hex.substr(2, 2), 16),
        b: parseInt(hex.substr(4, 2), 16)
    };

    for (let i = 0; i < length; i += 4) {
        data[i] -= (data[i] - colorRGB.r) * (options.level / 100);
        data[i + 1] -= (data[i + 1] - colorRGB.g) * (options.level / 100);
        data[i + 2] -= (data[i + 2] - colorRGB.b) * (options.level / 100);
    }

    return data;
};

window.onload = function() {
    const img = new Image();
    img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);

        const data = context.getImageData(0, 0, img.width, img.height);
        const options = { color: '#008080', level: 50 };
        const nWorkers = 4;

        return applyFilter({ data, transform, options, nWorkers }).then(
            results => {
                const target = document.querySelectorAll('#target-1')[0];
                const image = document.createElement('img');
                image.setAttribute('src', convertImageDataToCanvasURL(results));
                target.appendChild(image);
            }
        );
    };

    img.src = 'dummy.jpg';
};
