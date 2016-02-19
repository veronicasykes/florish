angular
	.module('Florish')
	.controller('ProductsController', ProductsController)


ProductsController.$inject = ['productsFactory', '$modal', '$window']

function ProductsController (productsFactory, $modal, $window){
	var vm = this;
	vm.api = productsFactory
	vm.products = []
	vm.newProduct = {}
	vm.api.list()
		.success(function(res){
			vm.products = res
		})
	vm.addProduct = function(avatar_url, name, size, lightNeed, type, price, description){
		var data = {avatar_url:avatar_url, name:name, size:size, lightNeed: lightNeed, type:type, price:price, description:description}
		console.log(data)

		vm.api.addProduct(data)
			.then(function success(res){
				console.log(data)
				vm.products.push(res.data.product)
				vm.newProduct = {}

				console.log(res.data.product.avatar_url)
				alert("product created")
			})
	}

	vm.filtered = vm.products;

	vm.filterProducts = function(prop, value) {
				console.log("prop is", prop)
				console.log("value is", value)
					if(!prop || !value) {
							vm.filtered = vm.products;
							return;
					}

			vm.filtered = vm.products.filter(function(item) {
					return item[prop] === value;
			});

	};


		vm.showSize = true
		vm.showType = false
		vm.showLight = false
		vm.showWords = true
		vm.showResults = false



		// vm.hideAllBtns = hideAllBtns
		//
		vm.selectSmall = function() {
			console.log('selected small')
			vm.filterProducts('size', 'S')
			vm.showSize = false
			vm.showType = true
			vm.showWords = false
			console.log('after selected small')
		}
		vm.selectMedium = function() {
			vm.filterProducts('size', 'M')
			vm.showSize = false
			vm.showType = true
			vm.showWords = false
		}
		vm.selectLarge = function() {
			vm.filterProducts('size', 'L')
			vm.showSize = false
			vm.showType = true
			vm.showWords = false
		}

		vm.selectPotted = function() {
			vm.filterProducts('type', 'potted')
			vm.showType = false
			vm.showLight = true
		}

		vm.selectHanging = function() {
			vm.filterProducts('type', 'hanging')
			vm.showType = false
			vm.showLight = true
		}

		vm.selectLowLight = function() {
			vm.filterProducts('lightNeed', 'low')
			vm.showLight = false
			vm.showResults = true

		}

		vm.selectBrightLight = function() {
			vm.filterProducts('lightNeed', 'bright')
			vm.showLight = false
			vm.showResults = true

		}


		// function selectLarge() {
		// 	vm.customerPreference.large = true
		// 	vm.swapBtns()
		// }
		// function selectLowLight() {
		// 	vm.customerPreference.lowLight = true
		// 	vm.hideAllBtns()
		// }
		// function selectBrightLight() {
		// 	vm.customerPreference.brightLight = true
		// 	vm.hideAllBtns()
		// }
		//

		//

		//
		// function hideAllBtns(){
		// 	vm.options.light = false
		// }





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

	vm.uploadFile = function($window){
		function init_upload(){
			console.log("here")
		}
	}

	vm.sthree = function(){
	 /*
				Function to carry out the actual PUT request to S3 using the signed request from the app.
		*/
	function upload_file(file, signed_request, url){
		console.log(file)
		console.log(signed_request)
		console.log(url)
		$window.localStorage.setItem('url', url)
		var xhr = new XMLHttpRequest();
		xhr.open("PUT", signed_request);
		xhr.setRequestHeader('x-amz-acl', 'public-read');
		xhr.onload = function() {
			if (xhr.status === 200) {
					document.getElementById("preview").src = url;
					document.getElementById("avatar_url").value = url;
					vm.newProduct.avatar_url = url
			}
		};
		xhr.onerror = function() {
				console.log("vanilla AJax call : " + JSON.stringify(xhr))
				alert("Could not upload file.");
		};
		xhr.send(file);
	}
	/*
		Function to get the temporary signed request from the app.
		If request successful, continue to upload the file using this signed
		request.
	*/
	function get_signed_request(file){
		console.log("getting signed request")
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://florish-app.herokuapp.com/sign_s3?file_name="+file.name+"&file_type="+file.type);
	xhr.onreadystatechange = function(){
		if(xhr.readyState === 4){
			if(xhr.status === 200){
				var response = JSON.parse(xhr.responseText);
				upload_file(file, response.signed_request, response.url);
			}
			else{
				alert("Could not get signed URL.");
			}
		}
	};
	xhr.send();
	}
	/*
	 Function called when file input updated. If there is a file selected, then
	 start upload procedure by asking for a signed request from the app.
	*/
		function init_upload(){
			console.log("here");
			var files = document.getElementById("file_input").files;
			var file = files[0];
			if(file == null){
				alert("No file selected.");
				return;
			}
			get_signed_request(file);
			}
			/*
			 Bind listeners when the page loads.
			*/
			(function() {
						window.document.querySelector("#file_input").addEventListener('change', init_upload)
			})();
		}

}
