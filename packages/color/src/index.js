import { applyFilter } from 'lens-core';

/**
 * Iterate over the array applying the color transformation
 * @param {Object} data
 * @param {Number} length
 * @param {Object} options
 * @param {Array<ColorInterval>} [options.colorsInterval]
 */
export const transform = ({ data, length, options }) => {
    /**
     * Validates if param is numeric
     * @param   {Number}  n
     * @returns {Boolean}
     */
    const isNumeric = n => !isNaN(parseFloat(n)) && isFinite(n);

    /**
     * @param {Array} pixles
     * @param {Number} index
     * @param {Color} color
     */
    const applyPixelTransformation = (pixels, index, color) => {
        pixels[index] = !isNumeric(color.r) ? pixels[index] : color.r;
        pixels[index + 1] = !isNumeric(color.g) ? pixels[index + 1] : color.g;
        pixels[index + 2] = !isNumeric(color.b) ? pixels[index + 2] : color.b;
        pixels[index + 3] = !isNumeric(color.a) ? pixels[index + 3] : color.a;
    };

    /**
     * @param {Array} data
     * @param {Number} index
     * @param {ColorInterval} colorInterval
     */
    const evaluatePixel = (data, index, colorInterval) => {
        const red = data[index];
        const green = data[index + 1];
        const blue = data[index + 2];

        return (
            red >= colorInterval.from.r &&
            red <= colorInterval.to.r &&
            green >= colorInterval.from.g &&
            green <= colorInterval.to.g &&
            blue >= colorInterval.from.b &&
            blue <= colorInterval.to.b
        );
    };

    for (let i = 0; i < length; i += 4) {
        options.colorsInterval.forEach(colorInterval => {
            const isMatch = evaluatePixel(data, i, colorInterval);

            if (isMatch && colorInterval.match) {
                applyPixelTransformation(data, i, colorInterval.match);
            } else if (!isMatch && colorInterval.noMatch) {
                applyPixelTransformation(data, i, colorInterval.noMatch);
            }
        });
    }

    return data;
};

/**
 * @param {ImageData} data - data of a image extracted from a canvas
 * @param {Object} options - options to pass to the transformation function
 * @param {ColorInterval} [options.colorsInterval] - adjustment to apply in the transformation
 * @param {Number} nWorkers - number of workers
 * @returns {Promise}
 */
export default function color({ data, options, nWorkers } = {}) {
    if (
        !data ||
        !options ||
        !options.colorsInterval ||
        !Array.isArray(options.colorsInterval)
    ) {
        throw new Error('lens-filter-color:: invalid options provided');
    }

    return applyFilter({ data, transform, options, nWorkers });
}
