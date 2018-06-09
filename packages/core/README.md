[![npm version](https://badge.fury.io/js/lens-core.svg)](https://badge.fury.io/js/lens-core)

# lens-core
Small library that relies on webworkers to apply image transformations.

There are several modules that use `lens-core`, check them on the [filters folder on the lens repo](https://github.com/canastro/lens/tree/master/packages/filters).

But you can easily create your own transformation function and rely on `lens-core` to handle the webworkers and to split the work.

## Install
```
npm install lens-core --save
```

## Methods
### getCanvas()
It returns a canvas with the given width and height
```js
import { getCanvas } from 'lens-core';

const canvas = getCanvas(100, 100);
```

### convertImageDataToCanvasURL()
Given a ImageData it returns the dataURL
```js
import { convertImageDataToCanvasURL } from 'lens-core';

const canvasURL = convertImageDataToCanvasURL(imageData);
```

### applyFilters()
Provide the ImageData, the transformation function, the options to be passed to the transformation function and the number of workers to split the work.

```js
import { applyFilters } from 'lens-core';

applyFilters({ 
    data: 'image-data', 
    transform: transformationFunction, 
    options: {},  // options that are passed to the transformation function
    nWorkers: 4 // number of webworkers to transform the image
}).then(imageData => {
    // Do whatever you want with imageData
});
```

# How to create a custom transformation function?
The transform function receives ImageData, the length of data to transform and the options that the developer provided to image-fiter-core, example transformation function for the threshold effect:

```js
const transform = ({ data, length, options }) => {
    for (let i = 0; i < length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= options.level) ? 255 : 0;
        data[i] = data[i + 1] = data[i + 2] = v;
    }

    return data;
};
```
