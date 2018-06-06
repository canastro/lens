import { convertImageDataToCanvasURL, getCanvas } from 'lens-core';
import brightness from 'lens-filter-brightness';
import color from 'lens-filter-color';
import colorize from 'lens-filter-colorize';
import contrast from 'lens-filter-contrast';
import gamma from 'lens-filter-gamma';
import grayscale from 'lens-filter-grayscale';
import invert from 'lens-filter-invert';
import noise from 'lens-filter-noise';
import sepia from 'lens-filter-sepia';
import threshold from 'lens-filter-threshold';

import { getDomElement, getPixelsFromImage } from './utils';

const METHODS = {
    brightness,
    color,
    colorize,
    contrast,
    gamma,
    grayscale,
    invert,
    noise,
    sepia,
    threshold
};

/**
 * Returns the a DOM element to a image
 * @param {Object} options - options to locate image source
 */
const getElement = options => {
    if (options.url) {
        const element = document.createElement('img');
        element.setAttribute('src', options.url);

        return element;
    }

    return getDomElement(options.from);
};

/**
 * Gets the image data from the source
 * @param {Object} options - options to locate image source
 * @returns {Array} image data
 */
const getImageData = options => {
    if (options.data) return options.data;

    const element = getElement(options);
    const canvas = getCanvas(element.width, element.height);
    const context = canvas.getContext('2d');

    return getPixelsFromImage(canvas, context, element);
};

export default class Chainable {
    /**
     * Initialize the chainable instance.
     * @param {Object} options - options to locate image source
     */
    constructor(options = {}) {
        if (!options.url && !options.data && !options.from) {
            throw new Error('lens-chainable:: invalid options object');
        }

        this.data = getImageData(options);

        if (!this.data) {
            throw new Error('lens-chainable:: no data found');
        }

        this.filters = [];
        this.nWorkers = options.nWorkers;
        this.url = options.url;
        this.from = options.from;
    }

    /**
     * Applies the filters and returns a promise with the new image data.
     * @returns {Promise<Array>} Promise resolved with the new image data
     */
    applyFilters() {
        const initialValue = Promise.resolve(this.data);

        return this.filters
            .reduce(
                (promise, item) =>
                    promise.then(data => {
                        const fn = METHODS[item.filter];
                        const options = item.options;
                        const nWorkers = this.nWorkers;

                        return fn({ data, options, nWorkers });
                    }),
                initialValue
            )
            .then(data => {
                this.data = data;
                return data;
            });
    }

    /**
     * Creates a new image element and appends the result of
     * the chainable operations to a given selector.
     * @param {String} selector - DOM selector
     * @returns {Promise} Promised resolved when the new image is appended
     */
    append(selector) {
        return this.applyFilters().then(data => {
            const target = getDomElement(selector);
            const image = document.createElement('img');
            image.setAttribute('src', convertImageDataToCanvasURL(data));
            target.appendChild(image);
        });
    }

    /**
     * Updates a image element with the result of the chainable operations.
     * @param {String} selector - DOM selector
     * @returns {Promise} Promised resolved when the target image is updated
     */
    update(selector) {
        return this.applyFilters().then(data => {
            const target = getDomElement(selector);
            target.setAttribute('src', convertImageDataToCanvasURL(data));
        });
    }

    /**
     * Returns the data url of the applied filters.
     * @returns {Array} image data
     */
    getDataURL() {
        return convertImageDataToCanvasURL(this.data);
    }
}

Object.keys(METHODS).forEach(method => {
    Chainable.prototype[method] = function(options) {
        this.filters.push({ filter: method, options });
        return this;
    };
});
