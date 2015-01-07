var app = angular.module('gm', ['ngRoute', 'ngAnimate']);
app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	when('/', {
		templateUrl: 'partials/fileSelect.html',
		controller: 'FileSelectController'
	}).
	when('/results', {
		templateUrl: 'partials/results.html'
	})
}])

app.controller('FileSelectController', function($scope) {
	var dialogOpen = false;
	// checkboxes
	$scope.stringMatchCB = true;
	$scope.backOfWordsCB = false;
	$scope.showContentCB = true;

	$scope.OpenFileDialog = function() {
		var fileDialog = angular.element('#hiddenFileDialog');
		if (!dialogOpen) {
			fileDialog.trigger('click');
			dialogOpen = true;
		}
		fileDialog.on('change', function(e) {
			console.log('files added');

		})
	}
})
