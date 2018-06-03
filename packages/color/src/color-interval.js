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
 * Validates if color interval is valid
 * @method  validateInterval
 * @param   {Object} from
 * @param   {Object} to
 * @returns {Boolean}
 */
function validateInterval(from, to) {
    if (!isNumeric(from) || !isNumeric(to) || from > to) {
        return false;
    }

    return true;
}

/**
 * @method ColorInterval
 * @param {Object} options
 * @param {Object} [options.from]
 * @param {Object} [options.to]
 * @param {Object} [options.match]
 * @param {Object} [options.noMatch]
 * @returns {Promise}
 */
module.exports = function ColorInterval(options) {
    if (!options.from || !options.to) {
        throw new Error('image-filter-color:: Invalid ColorInterval');
    }

    if (!options.match && !options.noMatch) {
        throw new Error('image-filter-color:: Invalid ColorInterval => no match or noMatch provided');
    }

    this.from = options.from;
    this.to = options.to;

    if (!validateInterval(this.from.r, this.to.r)) {
        throw new Error('image-filter-color:: Invalid ColorInterval => red color');
    }

    if (!validateInterval(this.from.g, this.to.g)) {
        throw new Error('image-filter-color:: Invalid ColorInterval => green color');
    }

    if (!validateInterval(this.from.b, this.to.b)) {
        throw new Error('image-filter-color:: Invalid ColorInterval => blue color');
    }

    this.match = options.match;
    this.noMatch = options.noMatch;
};
