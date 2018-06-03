/**
 * Iterate over the array applying the brightness transformation
 * @param {Object} data
 * @param {Number} length
 * @param {Object} options
 * @param {Number} [options.adjustment]
 */
module.exports = function transform(data, length, options) {
    for (let i = 0; i < length; i += 4) {
        data[i] += options.adjustment;
        data[i + 1] += options.adjustment;
        data[i + 2] += options.adjustment;
    }
};
