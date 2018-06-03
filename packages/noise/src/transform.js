/**
 * Iterate over the array applying the noise transformation
 * @name transform
 * @param {Array} data
 * @param {Number} length
 * @param {Object} options
 * @param {Number} [options.adjust]
 */
module.exports = function transform (data, length, options) {
    var adjust = Math.abs(options.adjust) * 2.55;
    var min = adjust * -1;
    var rand;

    function add(original, increment) {
        var result = original + increment;

        if (result > 255) {
            return 255;
        } else if (result < 0) {
            return 0;
        }

        return result;
    }

    for (var i = 0; i < length; i += 4) {
        // Calculate if should be negative or positive
        var multiplier = Math.random() < 0.5 ? -1 : 1;

        // Calculate random noise
        rand = multiplier * (Math.random() + adjust);

        data[i] = add(data[i], rand);
        data[i + 1] = add(data[i + 1], rand);
        data[i + 2] = add(data[i + 2], rand);
    }
};
