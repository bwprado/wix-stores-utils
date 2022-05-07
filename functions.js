import { v4 as uuid } from 'uuid'

/**
 * @author Bruno Prado
 * @function getValues
 * @description - This function returns an array of product options available for purchase
 * @param {Object} currentProduct - WIX Store product object
 * @returns {Function} - Returns a function that returns an array of product options available for purchase
 */
export const getValues = (currentProduct) => {
	const { productOptions } = currentProduct
	return (...keys) => {
		const objKeys = Object.keys(productOptions)
		const options = keys.filter((key) => objKeys.includes(key))[0]
		if (options) {
			return (
				productOptions[options].choices
					.filter((option) => option.inStock)
					.map((option) => {
						return {
							_id: uuid(),
							value: option.value,
							name: option.description,
						}
					}) || null
			)
		}
		return []
	}
}
