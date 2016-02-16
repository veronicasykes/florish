angular
	.module('Florish')
	.factory('productsFactory', productsFactory)

productsFactory.$inject = ['$http']

function productsFactory($http){
	var productsUrl = 'http://localhost:3000/api/products'
	var products = {}

	products.list = function(){
		return $http.get(productsUrl)
	}

	products.show = function(productId){
		return $http.get(productsUrl + '/' + productId)
	}

	products.addProduct = function(data){
		return $http.post(productsUrl, data)
	}

	products.updateProduct = function(productId,data){
		return $http.patch(productsUrl + '/' + productId, data)
	}

	products.removeProduct = function(productId){
		return $http.delete(productsUrl + '/' + productId)
	}

	return products
}
