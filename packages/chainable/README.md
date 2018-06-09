[![npm version](https://badge.fury.io/js/lens-core.svg)](https://badge.fury.io/js/lens-core)

# lens-chainable
Small that allows me to chain multiple [lens filters](https://github.com/canastro/lens/tree/master/packages/filters) and apply them to a existing image or append a new image to the dom.

# Install
```
npm install lens-chainable --save
```

# API Reference
* [Chainable(options)](#chainableoptions)
    * [< filter >(options)](#-filter-options-chainable-instance)
    * [append(selector)](#appendselector-promise)
    * [applyFilters(selector)](#applyfilters-promise-imagedata-)
    * [getDataURL()](#getdataurl-imagedata)
    * [update(selector)](#updateselector-promise)

## Chainable(options)
Initialize the chainable instance.

* `options` - **Object**
    * `from` - **String** - dom selector to the image
    * `url` - **String** - url to the image
    * `data`- **Array** - image data

```js
import Chainable from 'lens-chainable';
const chainable = new Chainable({ url: 'dummy.jpg ' });
```

## < filter >(options): Chainable Instance
Apply a filter to the current chainable instance. Check here the available filters: [lens filters](https://github.com/canastro/lens/tree/master/packages/filters)

* `options` - **Object** - the options object to be sent to the selected filter

```js
import Chainable from 'lens-chainable';
const chainable = new Chainable({ url: 'dummy.jpg ' })
    .brigthness({ level: 30 })
    .sepia();
```

## append(selector): Promise
Creates a new image element and appends the result of the chainable operations to a given selector.

* `selector` - **String** - DOM selector

```js
import Chainable from 'lens-chainable';
new Chainable({ url: 'dummy.jpg ' })
    .brigthness({ level: 30 })
    .sepia()
    .append('#target-div');
```

## applyFilters(): Promise< ImageData >
Applies the filters and returns a promise with the new image data.

```js
import Chainable from 'lens-chainable';
new Chainable({ url: 'dummy.jpg ' })
    .brigthness({ level: 30 })
    .sepia()
    .applyFilters()
    .then(imageData => {
        ...
    });
```

## getDataURL(): ImageData
Returns the data url of the applied filters.

```js
import Chainable from 'lens-chainable';
const dataURL = new Chainable({ url: 'dummy.jpg ' })
    .brigthness({ level: 30 })
    .sepia()
    .getDataURL();
```

## update(selector): Promise
Updates a image element with the result of the chainable operations.

* `selector` - **String** - DOM selector

```js
import Chainable from 'lens-chainable';
new Chainable({ url: 'dummy.jpg ' })
    .brigthness({ level: 30 })
    .sepia()
    .update('#target-img');
```