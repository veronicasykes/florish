Stripe.setPublishableKey('pk_test_wL7regAejDeicWU7yngBDvjF')

angular
	.module('Florish')

	.controller('CheckoutCtrl', function ($scope, totalAmount) {
		$scope.totalAmount = totalAmount;

		$scope.onSubmit = function () {
			console.log("on submit")
			$scope.processing = true;
		};

		$scope.stripeCallback = function (code, result) {
			console.log("result is", result)
			console.log("code is", code)
			$scope.processing = false;
			$scope.hideAlerts();
			if (result.error) {
				$scope.stripeError = result.error.message;
			} else {
				$scope.stripeToken = result.id;
			}
		};

		$scope.hideAlerts = function () {
			$scope.stripeError = null;
			$scope.stripeToken = null;
		};
	});
