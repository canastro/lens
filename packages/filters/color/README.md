[![npm version](https://badge.fury.io/js/lens-filter-color.svg)](https://badge.fury.io/js/lens-filter-color)

# lens-filter-color

Small browser library to apply a color transformation to a image relying on `lens-core` handle the transformation and distribute work with webworkers.

Check out [lens monorepo](https://github.com/canastro/lens) for other related modules

# Install

```
npm install lens-filter-color --save
```

# Usage
It applies a color transformation to a base64 image. If you want a more complete library, please check [lens-chainable](https://www.npmjs.com/package/lens-chainable) that wraps this and other libraries to provide a more complete suite of image filters.

This library consumes ImageData and outputs ImageData in a Promise. You can use `lens-core` to convert from ImageData to dataURL.

JS file:
```js
import color from 'lens-filter-color';
import ColorInterval from 'lens-filter-color/color-interval';

const colorIntervalBlue = new ColorInterval({
    from: { r: 0, b: 40, g: 100 },
    to: { r: 80, b: 100, g: 150 },
    match: { r: 0, b: 255, g: 255 },
    noMatch: { r: null, b: null, g: null, a: 150 }
});

const colorIntervalPink = new ColorInterval({
    from: { r: 120, b: 30, g: 70 },
    to: { r: 150, b: 60, g: 100 },
    match: { r: 255, b: 0, g: 255, a: 255 }
});

color({
    data: IMAGE_DATA, 
    options: { colorsInterval: [colorIntervalBlue, colorIntervalPink] }, 
    nWorkers: 4
});
```

# Frequent questions:
## How can I get image data from a image tag?

```js
const element = document.getElementById('#dummy-image');
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
context.drawImage(element, 0, 0 );
const imageData = context.getImageData(0, 0, element.width, element.height);
```

## How can I get image data from url?

```js
const element = document.createElement('img');
element.setAttribute('src', options.url);

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
context.drawImage(element, 0, 0 );
const imageData = context.getImageData(0, 0, element.width, element.height);
```

## How can I use the output of this?

```js
import color from 'lens-filter-color';
import ColorInterval from 'lens-filter-color/color-interval';
import { convertImageDataToCanvasURL } from 'lens-core';

const colorIntervalBlue = new ColorInterval({
    from: { r: 0, b: 40, g: 100 },
    to: { r: 80, b: 100, g: 150 },
    match: { r: 0, b: 255, g: 255 },
    noMatch: { r: null, b: null, g: null, a: 150 }
});

color({
    data: IMAGE_DATA, 
    options: { colorsInterval: [colorIntervalBlue] }, 
    nWorkers: 4
}).then(function (result) {
    // result === ImageData object
    const image = document.createElement('img');
    image.setAttribute('src', convertImageDataToCanvasURL(imageData));
    target.appendChild(image);
});
```
