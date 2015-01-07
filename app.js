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
  // spisek datoteks
  $scope.listOfFiles = [];

  var fileDialog = angular.element('#hiddenFileDialog');
  // odpri dialog za izbiro datotek
  $scope.OpenFileDialog = function() {
    console.log('ofd clicked');
    if (!dialogOpen) {
      fileDialog.trigger('click');
      fileDialog.on('change', function() {
        console.log('this');
        var fileList = fileDialog[0].files;
        for (var i = 0; i < fileList.length; i++) {
          $scope.$apply(function() {
            $scope.listOfFiles.push(new MyFile(fileList[i]));
          })
        }
      });
      dialogOpen = true;
    }
  }
});
