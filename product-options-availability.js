import wixStoresBackend from 'wix-stores-backend'
import { v4 as uuid } from 'uuid'

const wixStoresUtils = {
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
	 * @param {Object} product - WIX Store product object
	 * @returns {Array.<everyProductOption>} - Array of product options
	 */
	createOptionsArray(product) {
		const { productOptions } = product
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
	},

	/**
	 * @typedef productOptionsAvailable
	 * @type {Object}
	 * @property {String} optionKey - First option of the product
	 * @property {String} optionKey - Second option of the product
	 */

	/**
	 * @author Bruno Prado
	 * @function getOptionsStockAvailability
	 * @description - This function checks wich product options are available for purchase
	 * @param {Object} currentProduct - WIX Store product object
	 * @returns {Promise.<productOptionsAvailable[]>} - Array of product options available for purchase
	 */
	async getOptionsStockAvailability(currentProduct) {
		if (!currentProduct) throw new Error('Product is required')

		const allProductOptions = this.createOptionsArray(currentProduct)
		const arrayOfPromises = allProductOptions.map((option) =>
			wixStoresBackend.getProductOptionsAvailability(currentProduct._id, option)
		)
		const result = await Promise.all(arrayOfPromises)
		let choicesInStock = allProductOptions.map((item, index) => ({
			...item,
			inStock: result[index].availableForPurchase,
		}))

		return choicesInStock
			.filter(({ inStock }) => inStock === true)
			.map(({ inStock, ...choices }) => {
				return {
					_id: uuid(),
					...choices,
				}
			})
	},
}

export default wixStoresUtils
