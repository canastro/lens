![build status](https://travis-ci.org/canastro/lens-filter-color.svg?branch=master)
[![npm version](https://badge.fury.io/js/lens-filter-color.svg)](https://badge.fury.io/js/lens-filter-color)
[![codecov](https://codecov.io/gh/canastro/lens-filter-color/branch/master/graph/badge.svg)](https://codecov.io/gh/canastro/lens-filter-color)

# lens-filter-color

Small library to apply a color transformation to a image relying on `lens-core` handle the transformation and distribute work with webworkers.
This transformation picks on a color interval and replaces it with a provided color.

If you run `npm run build && npm run serve` and open `http://localhost:8080`, you'll find out the code for the following example:

### Original:
<img src="https://github.com/canastro/lens-filter-color/blob/master/sandbox/dummy.jpg?raw=true" width="300">

### Expected Result:
<img src="https://github.com/canastro/lens-filter-color/blob/master/sandbox/expected.png?raw=true" width="300">

Other related modules:
* [lens-core](https://www.npmjs.com/package/lens-core)
* [lens-filter-contrast](https://www.npmjs.com/package/lens-filter-contrast)
* [lens-filter-grayscale](https://www.npmjs.com/package/lens-filter-grayscale)
* [lens-filter-threshold](https://www.npmjs.com/package/lens-filter-threshold)
* [lens-filter-sepia](https://www.npmjs.com/package/lens-filter-sepia)
* [lens-filter-invert](https://www.npmjs.com/package/lens-filter-invert)
* [lens-filter-gamma](https://www.npmjs.com/package/lens-filter-gamma)
* [lens-filter-colorize](https://www.npmjs.com/package/lens-filter-colorize)
* [lens](https://www.npmjs.com/package/lens)

## Install

```
npm install lens-filter-color --save
```

## Usage
It applies a color transformation to a base64 image. If you want a more complete library, please check lens that wraps this and other libraries to provide a more complete suite of image filters.

This library consumes ImageData and outputs ImageData in a Promise. You can use `lens-core` to convert from ImageData to dataURL.

JS file:
```js
var imageColor = require('image-color');
var colorIntervalBlue = new ColorInterval({
    from: { r: 0, b: 40, g: 100 },
    to: { r: 80, b: 100, g: 150 },
    match: { r: 0, b: 255, g: 255 },
    noMatch: { r: null, b: null, g: null, a: 150 }
});

var colorIntervalPink = new ColorInterval({
    from: { r: 120, b: 30, g: 70 },
    to: { r: 150, b: 60, g: 100 },
    match: { r: 255, b: 0, g: 255, a: 255 }
});

var options = {
    colorsInterval: [colorIntervalBlue, colorIntervalPink]
};

var nWorkers = 4;

imageColor(IMAGE_DATA, options, nWorkers);
```

## Frequent questions:
### How can I get image data from a image tag?

```js
var element = document.getElementById('#dummy-image');
var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');
context.drawImage(element, 0, 0 );
var imageData = context.getImageData(0, 0, element.width, element.height);
```

### How can I get image data from url?

```js
var element = document.createElement('img');
element.setAttribute('src', options.url);
//...repeat process from the previous answer
```

### How can I use the output of this?

```js
var lensCore = require('lens-core');
var colorIntervalBlue = new ColorInterval({
    from: { r: 0, b: 40, g: 100 },
    to: { r: 80, b: 100, g: 150 },
    match: { r: 0, b: 255, g: 255 },
    noMatch: { r: null, b: null, g: null, a: 150 }
});

var colorIntervalPink = new ColorInterval({
    from: { r: 120, b: 30, g: 70 },
    to: { r: 150, b: 60, g: 100 },
    match: { r: 255, b: 0, g: 255, a: 255 }
});

var options = {
    colorsInterval: [colorIntervalBlue, colorIntervalPink]
};

var nWorkers = 4;

imageColor(IMAGE_DATA, options, nWorkers)
    .then(function (result) {
        // result === ImageData object
        var image = document.createElement('img');
        image.setAttribute('src', lensCore.convertImageDataToCanvasURL(imageData));
        target.appendChild(image);
    });
```
