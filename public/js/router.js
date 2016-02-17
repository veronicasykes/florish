angular.module('Florish')
	.config(MainRouter)
	.config(interceptor)

function interceptor($httpProvider) {
	$httpProvider.interceptors.push('authInterceptorFactory')
}

function MainRouter($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/login')
	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: 'partials/home.html',
			controller: 'UsersController as usersCtrl'
		})
		.state('login', {
			url: '/login',
			templateUrl: 'partials/login.html',
			controller: 'UsersController as usersCtrl'
		})
		.state('signup', {
			url: '/signup',
			templateUrl: 'partials/signup.html',
			controller: 'UsersController as usersCtrl'
		})
		.state('loggedOut', {
			url: '/loggedOut',
			templateUrl: 'partials/home.html',
			controller: 'UsersController as usersCtrl'
		})
		.state('detail', {
			url: '/products/:productId',
			templateUrl: 'partials/product-detail.html',
			controller: 'ProductDetailsController as productDetailsCtrl'
		})
		.state('shop', {
			url: '/shop',
			templateUrl: 'partials/shop.html',
			controller: 'ProductsController as productsCtrl'
		})
		.state('search', {
			url: '/search',
			templateUrl: 'partials/search.html',
			controller: 'ProductsController as productsCtrl'
		})
		.state('admin', {
			url: '/admin/:productId',
			templateUrl: 'partials/admin.html',
			controller: 'ProductsController as productsCtrl'
		})
		.state('new', {
			url: '/new',
			templateUrl: 'partials/product-form.html',
			controller: 'ProductsController as productsCtrl'
		})

}
