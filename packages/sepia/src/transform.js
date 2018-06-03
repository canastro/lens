/**
 * Iterate over the array applying the sepia transformation
 * @name transform
 * @param {Object} data
 * @param {Number} length
 */
module.exports = function transform(data, length) {
    for (var i = 0; i < length; i += 4) {
        var r = data[i];
        var g = data[i + 1];
        var b = data[i + 2];

        data[i] = (r * 0.393) + (g * 0.769) + (b * 0.189);
        data[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168);
        data[i + 2] = (r * 0.272) + (g * 0.534) + (b * 0.131);
    }
};
