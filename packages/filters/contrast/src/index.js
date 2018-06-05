import { applyFilter } from 'lens-core';

/**
 * Iterate over the array applying the contrast transformation
 * @name transform
 * @param {Object} data
 * @param {Number} length
 * @param {Object} options
 * @param {Number} [options.contrast]
 */
export const transform = ({ data, length, options }) => {
    const factor =
        (259 * (options.contrast + 255)) / (255 * (259 - options.contrast));

    for (let i = 0; i < length; i += 4) {
        data[i] = factor * (data[i] - 128) + 128;
        data[i + 1] = factor * (data[i + 1] - 128) + 128;
        data[i + 2] = factor * (data[i + 2] - 128) + 128;
    }

    return data;
};

/**
 * @param {ImageData} data - data of a image extracted from a canvas
 * @param {Object} options - options to pass to the transformation function
 * @param {Number} [options.contrast] - contrast value to apply in the transformation
 * @param {Number} nWorkers - number of workers
 * @returns {Promise}
 */
export default function contrast({ data, options, nWorkers } = {}) {
    if (!data || !options || !options.contrast) {
        throw new Error('lens-filter-contrast:: invalid options provided');
    }

    return applyFilter({ data, transform, options, nWorkers });
}
