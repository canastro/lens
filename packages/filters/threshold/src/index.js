import { applyFilter } from 'lens-core';

/**
 * Iterate over the array applying the threshold transformation
 * @param {Array} data
 * @param {Number} length
 * @param {Object} options
 */
export const transform = ({ data, length, options }) => {
    for (let i = 0; i < length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const v =
            0.2126 * r + 0.7152 * g + 0.0722 * b >= options.level ? 255 : 0;
        data[i] = data[i + 1] = data[i + 2] = v;
    }

    return data;
};

/**
 * @param {ImageData} data - data of a image extracted from a canvas
 * @param {Object} options - options to pass to the transformation function
 * @param {Number} [options.level] - threshold to apply in the transformation
 * @param {Number} nWorkers - number of workers
 * @returns {Promise}
 */
export default function threshold({ data, options, nWorkers } = {}) {
    if (!data || !options || !options.level) {
        throw new Error('lens-filter-threshold:: invalid options provided');
    }

    return applyFilter({ data, transform, options, nWorkers });
}
