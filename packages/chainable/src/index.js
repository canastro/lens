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

const getElement = options => {
    if (options.url) {
        const element = document.createElement('img');
        element.setAttribute('src', options.url);

        return element;
    }

    return getDomElement(options.from);
};

const getImageData = options => {
    if (options.data) return options.data;

    const element = getElement(options);
    const canvas = getCanvas(element.width, element.height);
    const context = canvas.getContext('2d');

    return getPixelsFromImage(canvas, context, element);
};

export default class Chainable {
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

    append(selector) {
        return this.applyFilters().then(data => {
            const target = getDomElement(selector);
            const image = document.createElement('img');
            image.setAttribute('src', convertImageDataToCanvasURL(data));
            target.appendChild(image);
        });
    }

    update(selector) {
        return this.applyFilters().then(data => {
            const target = getDomElement(selector);
            target.setAttribute('src', convertImageDataToCanvasURL(data));
        });
    }

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
