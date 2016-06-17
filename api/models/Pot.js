//Pot.js

var
	mongoose = require('mongoose'),
	Schema = mongoose.Schema

var potSchema = new Schema({
	type: String,
	name: String,
	size: String,
	description: String,
	price: Number,
	avatar_url: String
})

var Pot = mongoose.model('Pot', potSchema)

module.exports = Pot