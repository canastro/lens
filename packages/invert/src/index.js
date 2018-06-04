import { applyFilter } from 'lens-core';

/**
 * Iterate over the array applying the invert transformation
 * @name transform
 * @param {Object} data
 * @param {Number} length
 */
export const transform = ({ data, length }) => {
    for (var i = 0; i < length; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
    }

    return data;
};

/**
 * @name invert
 * @param {ImageData} data - data of a image extracted from a canvas
 * @param {Number} nWorkers - number of workers
 * @returns {Promise}
 */
export default function invert({ data, nWorkers } = {}) {
    if (!data) {
        throw new Error('lens-filter-invert:: invalid options provided');
    }

    return applyFilter({ data, transform, nWorkers });
}
