import { applyFilter } from 'lens-core';

/**
 * Iterate over the array applying the noise transformation
 * @param {Array} data
 * @param {Number} length
 * @param {Object} options
 * @param {Number} [options.level]
 */
export const transform = ({ data, length, options }) => {
    const level = Math.abs(options.level) * 2.55;

    const add = (original, increment) => {
        const result = original + increment;

        if (result > 255) {
            return 255;
        } else if (result < 0) {
            return 0;
        }

        return result;
    };

    for (let i = 0; i < length; i += 4) {
        // Calculate if should be negative or positive
        const multiplier = Math.random() < 0.5 ? -1 : 1;

        // Calculate random noise
        const rand = multiplier * (Math.random() + level);

        data[i] = add(data[i], rand);
        data[i + 1] = add(data[i + 1], rand);
        data[i + 2] = add(data[i + 2], rand);
    }

    return data;
};

/**
 * @param {ImageData} data - data of a image extracted from a canvas
 * @param {Object} options - options to pass to the transformation function
 * @param {Number} [options.noise] - noise to apply in the transformation
 * @param {Number} nWorkers - number of workers
 * @returns {Promise}
 */
export default function noise({ data, options, nWorkers } = {}) {
    if (!data || !options || !options.level) {
        throw new Error('lens-filter-noise:: invalid options provided');
    }

    return applyFilter({ data, transform, options, nWorkers });
}
