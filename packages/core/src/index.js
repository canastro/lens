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
 * @param {Object} data - image data
 * @param {Function} transform - transformation function
 * @param {Object} options - object to be passed to the transform function
 * @param {Number} nWorkers - number of workers to transform the image
 * @returns {Promise}
 */
function applyFilter(data, transform, options, nWorkers) {
    const worker = workerize(`
        var transform = ${transform};

        export function execute(canvas, index, length, options) {
            transform(canvas.data, length, options);
            return { result: canvas, index };
        }
    `);

    // Drawing the source image into the target canvas
    const canvas = getCanvas(data.width, data.height);
    const context = canvas.getContext('2d');
    context.putImageData(data, 0, 0);

    // Minimium 1 worker
    nWorkers = nWorkers || 1;

    // Height of the picture chunck for every worker
    const blockSize = Math.floor(canvas.height / nWorkers);

    return new Promise(resolve => {
        let finished = 0;
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

            worker
                .execute(canvasData, index, length, options)
                .then(response => {
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

module.exports = { applyFilter, convertImageDataToCanvasURL, getCanvas };
