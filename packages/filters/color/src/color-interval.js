/**
 * Validates if param is numeric
 * @param   {Number}  n
 * @returns {Boolean}
 */
const isNumeric = n => !isNaN(parseFloat(n)) && isFinite(n);

/**
 * Validates if color interval is valid
 * @param   {Object} from
 * @param   {Object} to
 * @returns {Boolean}
 */
const isIntervalValid = (from, to) =>
    isNumeric(from) && isNumeric(to) && from <= to;

/**
 * @param {Object} options
 * @param {Object} [options.from]
 * @param {Object} [options.to]
 * @param {Object} [options.match]
 * @param {Object} [options.noMatch]
 * @returns {Promise}
 */
module.exports = function ColorInterval(options) {
    if (!options.from || !options.to) {
        throw new Error('lens-filter-color:: Invalid ColorInterval');
    }

    if (!options.match && !options.noMatch) {
        throw new Error(
            'lens-filter-color:: Invalid ColorInterval => no match or noMatch provided'
        );
    }

    this.from = options.from;
    this.to = options.to;

    if (!isIntervalValid(this.from.r, this.to.r)) {
        throw new Error(
            'lens-filter-color:: Invalid ColorInterval => red color'
        );
    }

    if (!isIntervalValid(this.from.g, this.to.g)) {
        throw new Error(
            'lens-filter-color:: Invalid ColorInterval => green color'
        );
    }

    if (!isIntervalValid(this.from.b, this.to.b)) {
        throw new Error(
            'lens-filter-color:: Invalid ColorInterval => blue color'
        );
    }

    this.match = options.match;
    this.noMatch = options.noMatch;
};
