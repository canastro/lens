import workerize from 'workerize';

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

export { getCanvas, convertImageDataToCanvasURL, apply };
//# sourceMappingURL=image-filter-core.esm.js.map
