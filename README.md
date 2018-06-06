[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![build status](https://travis-ci.org/canastro/lens.svg?branch=master)


# Work in progress

# Lens
Lens are a series of modules to apply image filters on the browser while levaraging image-filters.

You can install and use a filter directly or you can use the [chainable module]((https://www.npmjs.com/package/lens-chainable)) to help you chain multiple filters and apply them to your DOM.

# List of available filters:
* [brightness](https://www.npmjs.com/package/lens-filter-brightness)
* [color](https://www.npmjs.com/package/lens-filter-color)
* [colorize](https://www.npmjs.com/package/lens-filter-colorize)
* [contrast](https://www.npmjs.com/package/lens-filter-contrast)
* [core](https://www.npmjs.com/package/lens-filter-core)
* [gamma](https://www.npmjs.com/package/lens-filter-gamma)
* [grayscale](https://www.npmjs.com/package/lens-filter-grayscale)
* [invert](https://www.npmjs.com/package/lens-filter-invert)
* [noise](https://www.npmjs.com/package/lens-filter-noise)
* [sepia](https://www.npmjs.com/package/lens-filter-sepia)
* [threshold](https://www.npmjs.com/package/lens-filter-threshold)

# How to create new filters?
A filter is a function that receives:

* `data` - `Array` - Array with the image data
* `options` - `Object` - Any options you need to apply your transformation 
* `nWorkers` - `Number` - The number of workers to be used

In this function you return the call to lens-core's `applyFilter` function while passing in the `data`, a `transform` function, the `options` and the `nWorkers`.

The transform function is where you really define your filter, it receives the `data`, `length` of the array to be transformed and the `options` and should return the array of the data transformed.

Here is a simple example of brightness transformer:
```js
import { applyFilter } from 'lens-core';

const transform = ({ data, length, options }) => {
    for (let i = 0; i < length; i += 4) {
        data[i] += options.adjustment;
        data[i + 1] += options.adjustment;
        data[i + 2] += options.adjustment;
    }

    return data;
};

export default brightness = ({ data, options, nWorkers } = {}) => 
    applyFilter({ data, transform, options, nWorkers });

```