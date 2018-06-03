var imageFilterCore = require('image-filter-core');
var transform = require('./transform');

/**
 * @name gamma
 * @param {ImageData} data - data of a image extracted from a canvas
 * @param {Object} options - options to pass to the transformation function
 * @param {Number} [options.adjustment] - adjustment to apply in the transformation
 * @param {Number} nWorkers - number of workers
 * @returns {Promise}
 */
module.exports =  function gamma(data, options, nWorkers) {
    if (!data || !options || !options.adjustment) {
        throw new Error('image-filter-gamma:: invalid options provided');
    }

    return imageFilterCore.apply(data, transform, options, nWorkers);
};
