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
	$scope.dialogOpen = false;
	// checkboxes
	$scope.stringMatchCB = true;
	$scope.clearResultsCB = true;
	$scope.showContentCB = true;
	// spisek datoteks
	$scope.listOfFiles = [];

	var fileDialog = angular.element('#hiddenFileDialog');
	// odpri dialog za izbiro datotek
	$scope.OpenFileDialog = function() {
		if (!$scope.dialogOpen) {
			// hack to check if user cancels the dialog
			fileDialog[0].files.append(new File("", ""));
			// trigger click on dialog
			fileDialog.trigger('click');
			$scope.dialogOpen = true;
			// track selection changes
			fileDialog.on('change', function() {
				if (fileDialog.val() != '') {
					var fileList = fileDialog[0].files;
					for (var i = 0; i < fileList.length; i++) {
						$scope.$apply(function() {
							$scope.listOfFiles.push(new MyFile(fileList[i]));
						})
					}
				}
				fileDialog.val('');
				$scope.$apply(function() {
					$scope.dialogOpen = false;
				})
			});
		}
	}

	$scope.CheckFiles = function() {
		Detektor.StringMatch($scope.listOfFiles[0], $scope.listOfFiles[1]);
	}
});
