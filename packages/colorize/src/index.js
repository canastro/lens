import { applyFilter } from 'image-filter-core';

/**
 * @param {Object} data
 * @param {Number} length
 * @param {Object} options
 * @param {Number} [options.color]
 * @param {Number} [options.level]
 */
export const transform = (data, length, options) => {
    const hex =
        options.color.charAt(0) === '#'
            ? options.color.substr(1)
            : options.color;
    const colorRGB = {
        r: parseInt(hex.substr(0, 2), 16),
        g: parseInt(hex.substr(2, 2), 16),
        b: parseInt(hex.substr(4, 2), 16)
    };

    for (let i = 0; i < length; i += 4) {
        data[i] -= (data[i] - colorRGB.r) * (options.level / 100);
        data[i + 1] -= (data[i + 1] - colorRGB.g) * (options.level / 100);
        data[i + 2] -= (data[i + 2] - colorRGB.b) * (options.level / 100);
    }
};

/**
 * @param {ImageData} data - data of a image extracted from a canvas
 * @param {Object} options - options to pass to the transformation function
 * @param {Number} [options.color] - color value to apply in the transformation
 * @param {Number} [options.level] - level value to apply in the transformation
 * @param {Number} nWorkers - number of workers
 * @returns {Promise}
 */
export default function colorize(data, options, nWorkers) {
    if (!data || !options || !options.color || !options.level) {
        throw new Error('image-filter-colorize:: invalid options provided');
    }

    return applyFilter(data, transform, options, nWorkers);
}
