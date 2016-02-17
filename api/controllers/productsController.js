var Product = require('../models/Product.js');

function getAllProducts(req,res){
	Product.find({}, function(err, products){
		res.json(products)
	})
}

function createProduct(req,res){
	var newProduct = new Product
	newProduct.type = req.body.type
	newProduct.name = req.body.name
	newProduct.size = req.body.size

	newProduct.lightNeed = req.body.lightNeed

	newProduct.description = req.body.description
	newProduct.image = req.body.image
	newProduct.price = req.body.price
	newProduct.save(function(err, product){
		if(err) throw err
		res.json({message: "Product Saved!", product: product})
	})
}

function getOneProduct(req,res){
	Product.findById(req.params.id, function(err,product){
		if(err) throw err
		res.json(product)
	})
}

function updateProduct(req,res){
	Product.findOneAndUpdate({_id: req.params.id}, req.body, function(err,product){
		if(err) throw err
		Product.findById(req.params.id, function(err,updatedProduct){
			res.json(updatedProduct)
		})
	})
}

function deleteProduct(req,res){
	Product.findOneAndRemove({_id: req.params.id}, req.body, function(err,product){
		if(err) throw err
		res.json({message:"product deleted"})
	})
}


module.exports = {
	getAllProducts : getAllProducts,
	createProduct : createProduct,
	getOneProduct : getOneProduct,
	updateProduct : updateProduct,
	deleteProduct : deleteProduct

}
