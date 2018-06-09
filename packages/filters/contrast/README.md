[![npm version](https://badge.fury.io/js/lens-filter-contrast.svg)](https://badge.fury.io/js/lens-filter-contrast)

# lens-filter-contrast

Small browser library to apply a contrast transformation to a image relying on `lens-core` handle the transformation and distribute work with webworkers.

Check out [lens monorepo](https://github.com/canastro/lens) for other related modules

# Install

```
npm install lens-filter-contrast --save
```

# Usage
It applies a contrast transformation to a base64 image. If you want a more complete library, please check [lens-chainable](https://www.npmjs.com/package/lens-chainable) that wraps this and other libraries to provide a more complete suite of image filters.

This library consumes ImageData and outputs ImageData in a Promise. You can use `lens-core` to convert from ImageData to dataURL.

JS file:
```js
import contrast from 'lens-filter-contrast';

contrast({
    data: IMAGE_DATA, 
    options: { level: 30 }, 
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
import contrast from 'lens-filter-contrast';
import { convertImageDataToCanvasURL } from 'lens-core';

contrast({
    data: IMAGE_DATA, 
    options: { level: 30 }, 
    nWorkers: 4
}).then(function (result) {
    // result === ImageData object
    const image = document.createElement('img');
    image.setAttribute('src', convertImageDataToCanvasURL(imageData));
    target.appendChild(image);
});
```
