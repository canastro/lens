/**
 * Iterate over the array applying the gamma transformation
 * @name transform
 * @param {Object} data
 * @param {Number} length
 * @param {Object} options
 * @param {Number} [options.adjustment]
 */
module.exports = function transform(data, length, options) {
    for (var i = 0; i < length; i += 4) {
        data[i] = Math.pow(data[i] / 255, options.adjustment) * 255;
        data[i + 1] = Math.pow(data[i + 1] / 255, options.adjustment) * 255;
        data[i + 2] = Math.pow(data[i + 2] / 255, options.adjustment) * 255;
    }
};
