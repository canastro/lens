var imageFilterCore = require('image-filter-core');
var transform = require('./transform');

/**
 * @name colorize
 * @param {ImageData} data - data of a image extracted from a canvas
 * @param {Object} options - options to pass to the transformation function
 * @param {Number} [options.color] - color value to apply in the transformation
 * @param {Number} [options.level] - level value to apply in the transformation
 * @param {Number} nWorkers - number of workers
 * @returns {Promise}
 */
module.exports =  function colorize(data, options, nWorkers) {
    if (!data || !options || !options.color || !options.level) {
        throw new Error('image-filter-colorize:: invalid options provided');
    }

    return imageFilterCore.apply(data, transform, options, nWorkers);
};
