import { applyFilter } from 'lens-core';

/**
 * Iterate over the array applying the brightness transformation
 * @param {Object} data
 * @param {Number} length
 * @param {Object} options
 * @param {Number} [options.adjustment]
 */
export const transform = (data, length, options) => {
    for (let i = 0; i < length; i += 4) {
        data[i] += options.adjustment;
        data[i + 1] += options.adjustment;
        data[i + 2] += options.adjustment;
    }
};

/**
 * @param {ImageData} data - data of a image extracted from a canvas
 * @param {Object} options - options to pass to the transformation function
 * @param {Number} [options.adjustment] - adjustment to apply in the transformation
 * @param {Number} nWorkers - number of workers
 * @returns {Promise}
 */
export default function brightness(data, options, nWorkers) {
    if (!data || !options || !options.adjustment) {
        throw new Error('lens-filter-brightness:: invalid options provided');
    }

    return applyFilter(data, transform, options, nWorkers);
}
