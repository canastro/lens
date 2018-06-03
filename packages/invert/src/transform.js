/**
 * Iterate over the array applying the invert transformation
 * @name transform
 * @param {Object} data
 * @param {Number} length
 */
module.exports = function transform(data, length) {
    for (var i = 0; i < length; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
    }
};
