Stripe.setPublishableKey('pk_test_wL7regAejDeicWU7yngBDvjF')

angular
	.module('Florish')

	.controller('CheckoutCtrl', function ($scope, totalAmount, $http) {
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
				return $http.post('https://florish-app.herokuapp.com/api/payments', {stripeToken: result.id})
				$modal.close()


			}

		};

		$scope.hideAlerts = function () {
			$scope.stripeError = null;
			$scope.stripeToken = null;
		};
		//
		// $scope.charge = function () {
	  //   return stripe.card.createToken($scope.payment.card)
	  //     .then(function (response) {
	  //       console.log('token created for card ending in ', response.card.last4);
	  //       var payment = angular.copy($scope.payment);
	  //       payment.card = void 0;
	  //       payment.token = response.id;
	  //       return $http.post('https://localhost:3000/api/orders', payment);
	  //     })
	  //     .then(function (payment) {
	  //       console.log('successfully submitted payment for $', payment.amount);
	  //     })
	  //     .catch(function (err) {
	  //       if (err.type && /^Stripe/.test(err.type)) {
	  //         console.log('Stripe error: ', err.message);
	  //       }
	  //       else {
	  //         console.log('Other error occurred, possibly with your API', err.message);
	  //       }
	  //     });
	  // };

	});
