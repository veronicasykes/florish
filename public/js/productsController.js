angular
	.module('Florish')
	.controller('ProductsController', ProductsController)


ProductsController.$inject = ['productsFactory', '$modal']

function ProductsController (productsFactory, $modal){
	var vm = this;
	vm.api = productsFactory
	vm.products = []
	vm.newProduct = {}
	vm.api.list()
		.success(function(res){
			vm.products = res
		})
	vm.addProduct = function(name, size, description, price, image, lightNeed){
		var data = {name:name, size:size, description:description, image:image, price:price, lightNeed:lightNeed}
		console.log(data)

		vm.api.addProduct(data)
			.then(function success(res){
				vm.products.push(res.data.product)
				vm.newProduct = {}
				alert("product created")
			})
	}

	vm.filtered = vm.products;

	vm.filterProducts = function(prop, value) {
					if(!prop || !value) {
							vm.filtered = vm.products;
							return;
					}

			vm.filtered = vm.products.filter(function(item) {
					return item[prop] === value;
			});
	};

	vm.cart = [];

	vm.addToCart = function (product) {
		console.log(product)
			var found = false;
			vm.cart.forEach(function (item) {
				if (item._id === product._id) {
					item.quantity++;
					found = true;
				}
			});
			if (!found) {
				vm.cart.push(angular.extend({quantity: 1}, product));
			}
		};

	vm.getCartPrice = function () {
		var total = 0;
		vm.cart.forEach(function (product) {
			total += product.price * product.quantity;
		});
		return total;
	};

	vm.checkout = function () {
		console.log("about to open modal")
		$modal.open({
			templateUrl: './partials/checkout.html',
			controller: 'CheckoutCtrl',
			resolve: {
				totalAmount: vm.getCartPrice
			}
		});
	};

}
