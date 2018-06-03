var imageFilterCore = require('image-filter-core');
var transform = require('./transform');

/**
 * @method color
 * @param {ImageData} data - data of a image extracted from a canvas
 * @param {Object} options - options to pass to the transformation function
 * @param {ColorInterval} [options.colorsInterval] - adjustment to apply in the transformation
 * @param {Number} nWorkers - number of workers
 * @returns {Promise}
 */
module.exports = function color(data, options, nWorkers) {
    if (!data || !options || !options.colorsInterval || !Array.isArray(options.colorsInterval)) {
        throw new Error('image-filter-color:: invalid options provided');
    }

    return imageFilterCore.apply(data, transform, options, nWorkers);
};
