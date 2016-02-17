var
	mongoose = require('mongoose'),
	Schema = mongoose.Schema

var productSchema = new Schema({
		name: String,
		size: {
		small: Boolean,
		large: Boolean,
	},
	lightNeed: {
		brightLight: Boolean,
		lowLight: Boolean,
	},
	description: String,
	image: String,
	price: String
})

var Product = mongoose.model('Product', productSchema)

module.exports = Product
