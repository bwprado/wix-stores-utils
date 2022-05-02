# WIX Stores Utils

This package was developed to expand the WIX Stores API, and include missing features.

### Setup

This package contains everything you need to work with.

### How to Use the Package in your Site

1 - Install the package

2 - Import the package in your code:

To import backend functions, use the following syntax:

```js
import { getProductOptionsAvailability } from '@bwprado/wix-stores-utils-backend'
```

To import public functions, use the following syntax:

```js
import { getProductOptionsAvailability } from '@bwprado/wix-stores-utils'
```

### Content

This package contains important functions to help enhance WIX Stores usability.

### Examples

Just import the `getProductOptionsAvailability()` function to your project, and feed the current product object into it.

```js
import { getProductOptionsAvailability } from '@bwprado/wix-stores-utils-backend'

$w.onReady(() => {
    $w('#dynamicDataset').onReady(async () =>
        const currentProduct = $w('#dynamicDataset').getCurrentItem()
        const availableOptions = await getProductOptionsAvailability(currentProduct)
    })
})
```

The expected result should be an array of available product options objects.

```js
[
    {
        "Color": "Black",
        "Size": "11,
    },
    {
        "Color": "Black",
        "Size": "12,
    },
]
```
