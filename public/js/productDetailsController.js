angular.module('Florish')
	.controller('ProductDetailsController', ProductDetailsController)

ProductDetailsController.$inject = ['productsFactory','$stateParams','$location']

function ProductDetailsController(productsFactory,$stateParams,$location){
	var vm = this
	vm.name = 'Product Detail'
	vm.api = productsFactory
	vm.product = null
	vm.editing = false
	vm.showProduct = function(productId){
		vm.api.show(productId).success(function(response){
			vm.product = response
			console.log(response)
		})
	}
	vm.showProduct($stateParams.productId)

	vm.updateProduct = function(productId, name, size, description){
		var data = {name: name, size: size, description: description}
		vm.api.updateProduct(productId,data).success(function(response){
			console.log(response)
			vm.product = response
			vm.editing = false
		})
	}

	vm.removeProduct = function(productId){
		vm.api.removeProduct(productId).success(function(response){
			console.log(response)
			$location.path('/products')
		})
	}
}
