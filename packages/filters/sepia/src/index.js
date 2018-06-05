import { applyFilter } from 'lens-core';

/**
 * Iterate over the array applying the sepia transformation
 * @param {Object} data
 * @param {Number} length
 */
export const transform = ({ data, length }) => {
    for (let i = 0; i < length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        data[i] = r * 0.393 + g * 0.769 + b * 0.189;
        data[i + 1] = r * 0.349 + g * 0.686 + b * 0.168;
        data[i + 2] = r * 0.272 + g * 0.534 + b * 0.131;
    }

    return data;
};

/**
 * @param {ImageData} data - data of a image extracted from a canvas
 * @param {Number} nWorkers - number of workers
 * @returns {Promise}
 */
export default function sepia({ data, nWorkers } = {}) {
    if (!data) {
        throw new Error('lens-filter-sepia:: invalid options provided');
    }

    return applyFilter({ data, transform, nWorkers });
}
