var express = require('express')
var apiRouter = express.Router() //get an instance of express router
var usersController = require('../controllers/usersController')
var productsController = require('../controllers/productsController')
var stripe = require('stripe')(process.env.stripeKey)
var User = require('../models/User')



// Non-Authenticated routes ===========

//make a user
apiRouter.route('/users')
	.post(usersController.create)

//login
apiRouter.route('/authenticate')
	.post(usersController.authenticate)

//products CRUD
apiRouter.route('/products')
	.get(productsController.getAllProducts)


apiRouter.route('/payments')

	.post(function(request, response) {
		console.log("request token is", request.body.stripeToken)


		var stripeToken = request.body.stripeToken;

		var charge = stripe.charges.create({
					amount: 1000,
					currency: "usd",
					source: stripeToken,
					description: "payinguser@example.com"
			}, function (err, charge) {
					if (err && err.type === 'StripeCardError') {
						console.log(err)
					}
			});
	});

// Authenticated routes  ==============
//config middleware for auth
apiRouter.use(usersController.checkUser)

//users index
apiRouter.route('/users')
	.get(usersController.index)

//logged in user detail
apiRouter.route('/me')
	.get(function(req, res){
		res.send(req.decoded)
	})

//user CRUD
apiRouter.route('/users/:user_id')
	.get(usersController.show)
	.put(usersController.update)
	.delete(usersController.destroy)

//products CRUD
apiRouter.route('/products')
	.get(productsController.getAllProducts)
	.post(productsController.createProduct)

apiRouter.route('/products/:id')
	.get(productsController.getOneProduct)
	.patch(productsController.updateProduct)
	.delete(productsController.deleteProduct)



module.exports = apiRouter
