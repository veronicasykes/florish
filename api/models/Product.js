var
	mongoose = require('mongoose'),
	Schema = mongoose.Schema

var productSchema = new Schema({
		type: String,
		name: String,
		size: String,
	lightNeed: String,
	description: String,
	image: String,
	price: Number,
	avatar_url: String
})

var Product = mongoose.model('Product', productSchema)

module.exports = Product
