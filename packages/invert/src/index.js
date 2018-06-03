import { applyFilter } from 'image-filter-core';

/**
 * Iterate over the array applying the invert transformation
 * @name transform
 * @param {Object} data
 * @param {Number} length
 */
export const transform = (data, length) => {
    for (var i = 0; i < length; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
    }
};

/**
 * @name invert
 * @param {ImageData} data - data of a image extracted from a canvas
 * @param {Number} nWorkers - number of workers
 * @returns {Promise}
 */
export default function invert(data, options, nWorkers) {
    if (!data) {
        throw new Error('image-filter-invert:: invalid options provided');
    }

    return applyFilter(data, transform, null, nWorkers);
}
