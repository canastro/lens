/**
 * Iterate over the array applying the color transformation
 * @method transform
 * @param {Object} data
 * @param {Number} length
 * @param {Object} options
 * @param {Array<ColorInterval>} [options.colorsInterval]
 */
module.exports = function transform(data, length, options) {

    /**
     * Validates if param is numeric
     * @method  isNumeric
     * @param   {Number}  n
     * @returns {Boolean}
     */
    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    /**
     * @method applyPixelTransformation
     * @param {Array} pixles
     * @param {Number} index
     * @param {Color} color
     */
    function applyPixelTransformation(pixels, index, color) {
        pixels[index] = !isNumeric(color.r) ? pixels[index] : color.r;
        pixels[index + 1] = !isNumeric(color.g) ? pixels[index + 1] : color.g;
        pixels[index + 2] = !isNumeric(color.b) ? pixels[index + 2] : color.b;
        pixels[index + 3] = !isNumeric(color.a) ? pixels[index + 3] : color.a;
    }

    /**
     * @method evaluatePixel
     * @param {Array} data
     * @param {Number} index
     * @param {ColorInterval} colorInterval
     */
    function evaluatePixel(data, index, colorInterval) {
        var red = data[index];
        var green = data[index + 1];
        var blue = data[index + 2];

        if (red >= colorInterval.from.r && red <= colorInterval.to.r &&
            green >= colorInterval.from.g && green <= colorInterval.to.g &&
            blue >= colorInterval.from.b && blue <= colorInterval.to.b) {
            return true;
        }

        return false;
    }

    for (var i = 0; i < length; i += 4) {
        options.colorsInterval.forEach(function (colorInterval) {
            var isMatch = evaluatePixel(data, i, colorInterval);

            if (isMatch && colorInterval.match) {
                applyPixelTransformation(data, i, colorInterval.match);
            } else if(!isMatch && colorInterval.noMatch) {
                applyPixelTransformation(data, i, colorInterval.noMatch);
            }
        });
    }
};
