/**
 * @name transform
 * @param {Object} data
 * @param {Number} length
 * @param {Object} options
 * @param {Number} [options.color]
 * @param {Number} [options.level]
 */
module.exports = function transform(data, length, options) {
    var hex = (options.color.charAt(0) === '#') ? options.color.substr(1) : options.color;
    var colorRGB = {
        r: parseInt(hex.substr(0, 2), 16),
        g: parseInt(hex.substr(2, 2), 16),
        b: parseInt(hex.substr(4, 2), 16)
    };

    for (var i = 0; i < length; i += 4) {
        data[i] -= (data[i] - colorRGB.r) * (options.level / 100);
        data[i + 1] -= (data[i + 1] - colorRGB.g) * (options.level / 100);
        data[i + 2] -= (data[i + 2] - colorRGB.b) * (options.level / 100);
    }
};
