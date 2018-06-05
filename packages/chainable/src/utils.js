/**
 * @method getPixelsFromImage
 * @param {Object} canvas
 * @param {Object} context
 * @param {Object} imageData
 */
export function getPixelsFromImage(canvas, context, element) {
    if (element.tagName !== 'IMG') {
        throw new Error('lens-chainable:: invalid origin');
    }

    context.drawImage(element, 0, 0);
    return context.getImageData(0, 0, canvas.width, canvas.height);
}

/**
 * Get a dom nome by selector
 * @method  getElement
 * @param   {String}   selector
 * @returns {Node}
 */
export function getDomElement(selector) {
    if (!selector) {
        throw new Error('lens-chainable:: no selector provided');
    }

    const target = document.querySelectorAll(selector)[0];

    if (!target) {
        throw new Error('lens-chainable:: no "to" element found');
    }

    return target;
}
