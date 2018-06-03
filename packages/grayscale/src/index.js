import { applyFilter } from 'image-filter-core';

/**
 * Iterate over the array applying the grayscale transformation
 * @param {Object} data
 * @param {Number} length
 */
export const transform = (data, length) => {
    for (let i = 0; i < length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // CIE luminance for the RGB
        // The human eye is bad at seeing red and blue, so we de-emphasize them.
        const v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        data[i] = data[i + 1] = data[i + 2] = v;
    }
};

/**
 * @param {ImageData} data - data of a image extracted from a canvas
 * @param {Number} nWorkers - number of workers
 * @returns {Promise}
 */
export default function grayscale(data, options, nWorkers) {
    if (!data) {
        throw new Error('image-filter-grayscale:: invalid options provided');
    }

    return applyFilter(data, transform, null, nWorkers);
}
