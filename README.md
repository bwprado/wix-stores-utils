# WIX Stores Utils

This package was developed to expand the WIX Stores API, and include missing features.

### Setup

This package contains everything you need to work with.

### How to Use the Package in your Site

1 - Install the package

2 - Import the package in your code:

To import the package to your project, do the following:

```js
import wixStoresUtilities from '@bwprado/wix-stores-utils'
```

First you need to get the current product being displayed in the default product page of you WIX Store, like so:

```js
const currentProduct = await $w('#productPage1').getProduct()
```

After that, you have to initialize the package with the current product, that way, the WIX Store Utilities will know everything about the current product.

```js
const wixStoresUtils = wixStoresUtilities(currentProduct)
```

You will have access to many methods and properties that will help you create a custom product page for your WIX Store.

### Package Content

This package contains important public methods and properties to help enhance WIX Stores usability.

- **get-product-options-in-stock**

This method gets all the available product options in stock with all the possible combinations.

```js
const allProductOptionsInStock = await wixStoresUtils.getProductOptionsInStock()
```


**set-color-key**

This method is used to set the name of the key related to the product options, because it is not default and it is user customizable, making it hard to predict. You give the method the probable name in the language you defined and it returns and sets the correct one. For example, let's say someone in Brazil creates a product with different colors. When setting up the product, it calls the options _"Cores"_ ("Colors" in english). As it is not default, the package has to figure it out so it can define the color key that will help with the text and the option selection.

```js
wixStoresUtils.setColorKey('Cores', 'Cor', 'Estampa', 'Estampas')
```

### Examples

You need to import the `wixStoresUtilities` to your project and initialize it with the current product from the product page.

```js
import wixStoresUtilities from '@bwprado/wix-stores-utils'

$w.onReady(async () => {
	// Get the current product from the product page.
	const currentProduct = await $w('#productPage1').getProduct()

	// Destructuring all the properties you are going to need.
	const { name, description, mainMedia, mediaItems, formattedPrice, ribbons } =
		currentProduct

	// Initializing the object.
	wixStoresUtils = wixStoresUtilities(currentProduct)

	// Checking for product options in stock.
	wixStoresUtils.setProductOptionsInStock(
		await wixStoresUtils.getProductOptionsInStock()
	)

	// Initializing the colors atributes.
	wixStoresUtils.setColorKey('Cor', 'Cores', 'Estampa', 'Estampas')

	// Initializing the sizes atributes.
	wixStoresUtils.setSizeKey('Tamanho', 'Tamanhos', 'Pontuação', 'Pontuações')
})
```
