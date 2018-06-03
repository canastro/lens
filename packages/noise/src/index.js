var imageFilterCore = require('image-filter-core');
var transform = require('./transform');

/**
 * @name noise
 * @param {ImageData} data - data of a image extracted from a canvas
 * @param {Object} options - options to pass to the transformation function
 * @param {Number} [options.noise] - noise to apply in the transformation
 * @param {Number} nWorkers - number of workers
 * @returns {Promise}
 */
module.exports =  function noise(data, options, nWorkers) {
    if (!data || !options || !options.adjust) {
        throw new Error('image-filter-noise:: invalid options provided');
    }

    return imageFilterCore.apply(data, transform, options, nWorkers);
};
