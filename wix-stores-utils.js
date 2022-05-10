import { v4 as uuid } from 'uuid'
import wixStores from 'wix-stores'

const wixStoresUtilities = (currentProduct) => {
	if (!currentProduct) throw new Error('Product is required!')
	/**
	 * @typedef everyProductOption
	 * @type {Object}
	 * @property {String} optionKey - First option of the product
	 * @property {String} optionKey - Second option of the product
	 */

	/**
	 * @author Bruno Prado
	 * @function createOptionsArray
	 * @description - This function creates an array of products options that will be used to check availability
	 * @returns {Array.<everyProductOption>} - Array of product options
	 */
	const createOptionsArray = () => {
		const { productOptions } = currentProduct
		const keys = Object.keys(productOptions)
		const choices = keys.map((key) =>
			productOptions[key].choices.map((choice) => {
				return {
					[key]: choice.description,
				}
			})
		)
		if (choices.length < 2) return choices.flat()
		const [a, b] = choices
		return b
			.map((s) =>
				a.map((c) => {
					return {
						[keys[0]]: c[keys[0]],
						[keys[1]]: s[keys[1]],
					}
				})
			)
			.flat()
	}
	const utils = {
		currentProduct,
		availableProductOptions: {},
		availableColors: null,
		availableSizes: null,
		productOptionsInStock: null,
		colorKey: null,
		sizeKey: null,
		selectedProduct: {
			productId: currentProduct._id,
			quantity: 0,
			options: {
				choices: {},
			},
		},

		/**
		 * @typedef availableProductOptions
		 * @type {Object}
		 * @property {String} optionKey - First option of the product
		 * @property {String} optionKey - Second option of the product
		 */

		/**
		 * @author Bruno Prado
		 * @function getProductOptionsInStock
		 * @description - This function checks wich product options are available for purchase
		 * @returns {Promise.<availableProductOptions[]>} - Array of product options available for purchase
		 */
		async getProductOptionsInStock() {
			const allProductOptions = createOptionsArray()
			const arrayOfPromises = allProductOptions.map((option) =>
				wixStores.getProductOptionsAvailability(currentProduct._id, option)
			)
			const result = await Promise.all(arrayOfPromises)
			let choicesInStock = allProductOptions.map((item, index) => ({
				...item,
				inStock: result[index].availableForPurchase,
			}))

			this.productOptionsInStock = choicesInStock
				.filter(({ inStock }) => inStock === true)
				.map(({ inStock, ...choices }) => {
					return {
						_id: uuid(),
						...choices,
					}
				})
			return this.productOptionsInStock
		},
		/**
		 * @author Bruno Prado
		 * @function getOptionsObject
		 * @description - This function returns an array of product options available for purchase
		 * @param {Object} currentProduct - WIX Store product object
		 * @returns {Object|null} - Return an object with the product options available for purchase
		 */
		getProductOptions() {
			const { productOptions } = currentProduct
			const objKeys = Object.keys(productOptions)
			objKeys.forEach((key) => {
				this.availableProductOptions[key] = productOptions[key].choices.map(
					(option) => {
						return {
							_id: uuid(),
							value: option.value,
							name: option.description,
							inStock: option.inStock,
						}
					}
				)
			})
			return this.availableProductOptions
		},
		/**
		 * @author Bruno Prado
		 * @param {Array.<String>} keys An array of strings with the color options keys.
		 * @description - This function sets the colors keys for the product.
		 */
		setColorKey(...keys) {
			this.colorKey = Object.keys(this.availableProductOptions)
				.filter((key) => keys.includes(key))
				.toString()
			this.availableColors = this.availableProductOptions[this.colorKey]
		},
		/**
		 * @author Bruno Prado
		 * @param {Array.<String>} keys An array of strings with the size options keys.
		 * @description - This function sets the colors keys for the product.
		 */
		setSizeKey(...keys) {
			this.sizeKey = Object.keys(this.availableProductOptions)
				.filter((key) => keys.includes(key))
				.toString()
			this.availableSizes = this.availableProductOptions[this.sizeKey]
		},
		setSelectedProductColor(value) {
			this.selectedProduct.options.choices[this.colorKey] = value
			this.updateSizeOptions(value)
		},
		setSelectedProductSize(value) {
			this.selectedProduct.options.choices[this.sizeKey] = value
		},
		async setProductOptionsInStock(productOptions) {
			this.productOptionsInStock = productOptions
		},
		getSelectedProductOptions() {
			return this.selectedProduct.options.choices
		},
		getNumberOfOptions() {
			const { productOptions } = currentProduct
			return Object.keys(productOptions).length
		},
		async getCartQtd() {
			const { lineItems } = await wixStores.getCurrentCart()
			this.cartQtd = lineItems.reduce((acc, item) => {
				return (acc += item.quantity)
			}, 0)
			return this.cartQtd
		},
		async addProductToCart(qtd) {
			if (+qtd === 0) throw new Error('Quantity has to be bigger than 0')
			this.selectedProduct.quantity = qtd
			const selectedOptions = Object.keys(
				this.getSelectedProductOptions()
			).length
			if (selectedOptions === 0) throw new Error('No option selected!')
			if ((this.colorKey && this.sizeKey && true) || false) {
				if (selectedOptions === 1) throw new Error('More options required!')
				await wixStores.cart.addProducts([this.selectedProduct])
			} else {
				await wixStores.cart.addProducts([this.selectedProduct])
			}
		},
		updateSizeOptions(colorOption) {
			return this.productOptionsInStock
				.filter((option) => option[this.colorKey] === colorOption)
				.map((option) => {
					return {
						_id: uuid(),
						name: option[this.sizeKey],
						value: option[this.sizeKey],
					}
				})
		},
		async getCartInfo() {
			const cartInfo = await wixStores.cart.getCurrentCart()
			let { lineItems, ...rest } = cartInfo
			if (lineItems.length > 0) {
				return {
					rest,
					lineItems: lineItems.map(({ id, ...item }) => {
						return {
							_id: uuid(),
							...item,
						}
					}),
				}
			} else {
				return null
			}
		},
	}
	utils.getProductOptions()
	return utils
}

export default wixStoresUtilities
