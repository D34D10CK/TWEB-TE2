'use strict';

angular.module('myApp.stats', ['ngRoute', 'chart.js'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/stats', {
    templateUrl: 'stats/stats.html',
    controller: 'StatsCtrl'
  });
}])

.controller('StatsCtrl', ['$scope', 'username', '$location', '$http', function($scope, username, $location, $http) {
	var isEmpty = true;
	for (var key in username.get()) {
  		if (hasOwnProperty.call(username.get(), key)) isEmpty = false;
	}
	if (isEmpty) { 
		$location.path('home');
	} else {
		$scope.range = function(range) {
			var ret = [];
			for(var i = 0; i < range; i++) {
				ret.push(i);
			}

			return ret;
		}

		$scope.languagesCount = [];
		$scope.languagesLabels = [];

		$scope.reposCommits = [];
		$scope.reposNames = [];

		$scope.name = username.get();
		$http.get('https://api.github.com/users/' + username.get().toLowerCase()).then(function success(res) {
			$scope.avatar = res.data.avatar_url;
		});

		var repos = [];
		var languages = [];
		var stars = 0;
		$http.get('https://api.github.com/users/' + username.get() + '/repos').then(function success(res) {
			var acc = [];
			for(var i = 0; i < res.data.length; i++) {
				stars += res.data[i].stargazers_count;
				repos.push({url: res.data[i].url, name: res.data[i].name});
				if (res.data[i].language != null) {
					if (acc.indexOf(res.data[i].language) === -1) {
						languages.push({language: res.data[i].language, count: 1});
						acc.push(res.data[i].language);
					} else {
						for(var j = 0; j < languages.length; j++) {
							if (languages[j].language === res.data[i].language) {
								languages[j] = {language: languages[j].language, count: languages[j].count + 1};
							}
						}
					}
				}
			}
			languages.sort(function(a, b) {
				return (a.count < b.count) ? 1 : -1;
			});
			for(var i = 0; i < languages.length; i++) {
				if (i < 3) {
					$scope.languagesCount.push(languages[i].count);
					$scope.languagesLabels.push(languages[i].language);
				}
			}
			
			repos.forEach(function(repo) {
				$http.get(repo.url + '/contributors').then(function success(res) {
					var commits = 0;
					res.data.forEach(function(el) {
						commits += el.contributions;
					});
					console.log( repo.name + " " + commits);
					$scope.reposCommits.push(commits);
					$scope.reposNames.push(repo.name);
				});
				console.log($scope.reposNames);
				console.log($scope.reposCommits);
			});
		});
		
		$scope.friends = [];
		var followers = [];
		var following = [];
		$http.get('https://api.github.com/users/' + username.get() + '/followers').then(function success(res) {
			for(var i = 0; i < res.data.length; i++) {
				followers.push(res.data[i].login);
			}

			$http.get('https://api.github.com/users/' + username.get() + '/following').then(function success(res) {
				for(var j = 0; j < res.data.length; j++) {
					following.push(res.data[j].login);
				}

				if (following.length > followers.length) {
					for (var i = 0; i < followers.length; i++) {
						if (following.indexOf(followers[i]) != -1) {
							$scope.friends.push(followers[i]);
						}
					}
				} else {
					for (var i = 0; i < following.length; i++) {
						if (followers.indexOf(following[i]) != -1) {
							$scope.friends.push(following[i]);
						}
					}
				}
				console.log(following);
				console.log(followers)
				console.log("friends " +$scope.friends);
			});
		});

		//$scope.reposCommits = [4, 5];
		//$scope.reposNames = ['sdjkasd', 'sdjasd'];
	}
}]);