angular.module('Florish', ['ui.router', 'angularPayments', 'mm.foundation', 'ngAnimate', 'angularSpinner'])
	.directive('navBar', navBar)
	.directive('productForm', productForm)


function productForm(){
	var directive = {
		restrict: 'E',
		templateUrl: '/partials/product-form.html'
	}
	return directive
}

function navBar(){
	var directive = {
		restrict: 'E',
		templateUrl: '/partials/nav.html',
		transclude: true
	}
	return directive
}
