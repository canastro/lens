var imageFilterCore = require('image-filter-core');
var transform = require('./transform');

/**
 * @name brightness
 * @param {ImageData} data - data of a image extracted from a canvas
 * @param {Object} options - options to pass to the transformation function
 * @param {Number} [options.adjustment] - adjustment to apply in the transformation
 * @param {Number} nWorkers - number of workers
 * @returns {Promise}
 */
module.exports =  function brightness(data, options, nWorkers) {
    if (!data || !options || !options.adjustment) {
        throw new Error('image-filter-brightness:: invalid options provided');
    }

    return imageFilterCore.apply(data, transform, options, nWorkers);
};
