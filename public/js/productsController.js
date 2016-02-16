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
	vm.addProduct = function(name, size, description, price, type, image, lightNeed){
		var data = {name:name, size:size, description:description, image:image, type:type, price:price, lightNeed:lightNeed}
		vm.api.addProduct(data)
			.then(function success(res){
				vm.products.push(res.data.product)
				vm.newProduct = {}
			})
	}

	vm.customerPreference = {
		lowLight: false,
		brightLight: false,
		small: false,
		large: false
	}

	vm.selectSmall = selectSmall
	vm.selectLarge = selectLarge
	vm.selectLowLight = selectLowLight
	vm.selectBrightLight = selectBrightLight
	vm.swapBtns = swapBtns
	vm.hideAllBtns = hideAllBtns

	function selectSmall() {
		vm.swapBtns()
		vm.customerPreference.small = true
	}
	function selectLarge() {
		vm.customerPreference.large = true
		vm.swapBtns()
	}
	function selectLowLight() {
		vm.customerPreference.lowLight = true
		vm.hideAllBtns()
	}
	function selectBrightLight() {
		vm.customerPreference.brightLight = true
		vm.hideAllBtns()
	}

	vm.options = {
		size: true,
		light: false
	}

	function swapBtns(){
		vm.options.size = false
		vm.options.light = true
	}

	function hideAllBtns(){
		vm.options.light = false
	}

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
