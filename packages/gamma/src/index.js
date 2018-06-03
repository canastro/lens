import { applyFilter } from 'image-filter-core';

/**
 * Iterate over the array applying the gamma transformation
 * @param {Object} data
 * @param {Number} length
 * @param {Object} options
 * @param {Number} [options.adjustment]
 */
export const transform = (data, length, options) => {
    for (let i = 0; i < length; i += 4) {
        data[i] = Math.pow(data[i] / 255, options.adjustment) * 255;
        data[i + 1] = Math.pow(data[i + 1] / 255, options.adjustment) * 255;
        data[i + 2] = Math.pow(data[i + 2] / 255, options.adjustment) * 255;
    }
};

/**
 * @param {ImageData} data - data of a image extracted from a canvas
 * @param {Object} options - options to pass to the transformation function
 * @param {Number} [options.adjustment] - adjustment to apply in the transformation
 * @param {Number} nWorkers - number of workers
 * @returns {Promise}
 */
export default function gamma(data, options, nWorkers) {
    if (!data || !options || !options.adjustment) {
        throw new Error('image-filter-gamma:: invalid options provided');
    }

    return applyFilter(data, transform, options, nWorkers);
}
