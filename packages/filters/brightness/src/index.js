import { applyFilter } from 'lens-core';

/**
 * Iterate over the array applying the brightness transformation
 * @param {Object} data
 * @param {Number} length
 * @param {Object} options
 * @param {Number} [options.level]
 */
export const transform = ({ data, length, options }) => {
    for (let i = 0; i < length; i += 4) {
        data[i] += options.level;
        data[i + 1] += options.level;
        data[i + 2] += options.level;
    }

    return data;
};

/**
 * @param {ImageData} data - data of a image extracted from a canvas
 * @param {Object} options - options to pass to the transformation function
 * @param {Number} [options.level] - level to apply in the transformation
 * @param {Number} nWorkers - number of workers
 * @returns {Promise}
 */
export default function brightness({ data, options, nWorkers } = {}) {
    if (!data || !options || !options.level) {
        throw new Error('lens-filter-brightness:: invalid options provided');
    }

    return applyFilter({ data, transform, options, nWorkers });
}
