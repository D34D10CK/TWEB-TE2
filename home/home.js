'use strict';

angular.module('myApp.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'HomeCtrl'
  });
}])

.controller('HomeCtrl', ['$scope', '$http', '$location', 'username', function($scope, $http, $location, username) {
	$scope.findUser = function (name) {
		var url = 'https://api.github.com/users/' + name.text + '/repos';
		$http({
			method: 'GET',
			url: url
		}).then(function success(res) {
			name.invalid = false;
			username.set(name.text);
			$location.path('stats');
		}, function error(res) {
			name.invalid = true;
		});
	}
}]);