![build status](https://travis-ci.org/canastro/lens.svg?branch=master)
[![Dependency Status](https://dependencyci.com/github/canastro/lens-core/badge)](https://dependencyci.com/github/canastro/lens-core)
[![npm version](https://badge.fury.io/js/lens-filter-threshold.svg)](https://badge.fury.io/js/lens-filter-threshold)
[![codecov](https://codecov.io/gh/canastro/lens-core/branch/master/graph/badge.svg)](https://codecov.io/gh/canastro/lens-core)

# lens-core
Small library that relies on webworkers to apply image transformations.

There are several modules that use `lens-core`, such as:
* [lens](https://www.npmjs.com/package/lens)
* [lens-filter-brightness](https://www.npmjs.com/package/lens-filter-brightness)
* [lens-filter-contrast](https://www.npmjs.com/package/lens-filter-contrast)
* [lens-filter-grayscale](https://www.npmjs.com/package/lens-filter-grayscale)
* [lens-filter-threshold](https://www.npmjs.com/package/lens-filter-threshold)
* [lens-filter-sepia](https://www.npmjs.com/package/lens-filter-sepia)
* [lens-filter-invert](https://www.npmjs.com/package/lens-filter-invert)
* [lens-filter-gamma](https://www.npmjs.com/package/lens-filter-gamma)
* [lens-filter-colorize](https://www.npmjs.com/package/lens-filter-colorize)

But you can easily create your own transformation function and rely on `lens-core` to handle the webworkers and to split the work.

## Install
```
npm install lens-core --save
```

## Methods
### # getCanvas()
It returns a canvas with the given width and height
```js
var lensCore = require('lens-core');
var canvas = lensCore.getCanvas(100, 100);
```

### # convertImageDataToCanvasURL()
Given a ImageData it returns the dataURL
```js
var lensCore = require('lens-core');
var canvasURL = lensCore.convertImageDataToCanvasURL(imageData);
```

### # apply()
Provide the ImageData, the transformation function, the options to be passed to the transformation function and the number of workers to split the work.

```js
var lensCore = require('lens-core');

lensCore.apply(data, transform, options, nWorkers)
    .then(function (imageData) {
        // Do whatever you want with imageData
    });
```

The transform function receives ImageData, the length of data to transform and the options that the developer provided to image-fiter-core, example transformation function for the threshold effect:

```js
function transform (data, length, options) {
    for (var i = 0; i < length; i += 4) {
        var r = data[i];
        var g = data[i + 1];
        var b = data[i + 2];
        var v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= options.threshold) ? 255 : 0;
        data[i] = data[i + 1] = data[i + 2] = v;
    }
}
```
