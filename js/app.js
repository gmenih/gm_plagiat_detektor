var app = angular.module('gm', ['ngRoute', 'ngAnimate']);
// routes.js
app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/', {
    templateUrl: 'partials/fileSelect.html',
    controller: 'FileSelectController'
  }).
  when('/results', {
    templateUrl: 'partials/results.html',
    controller: 'ResultsController'
  });
}]);
