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
  })
}]);

//services.js
app.factory('Files', function() {
  var List = []
  var showContent = false;

  var addFile = function(file) {
    List.push(file);
  }
  var setList = function(files) {
    List = files;
  }
  var getList = function() {
    return List;
  }
  var setContent = function(ct) {
    showContent = ct;
  }
  return {
    setList: setList,
    getList: getList
  };
})

//controller.js
app.controller('FileSelectController', function($scope, $location, Files) {
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
    Files.setList($scope.listOfFiles);
    $location.path('/results');
    ResizeAnimate(1600, 950, 500);

  }
});

app.controller('ResultsController', function($scope, Files) {
  $scope.listOfFiles = Files.getList();
  var orgFiles = $scope.listOfFiles.slice(0);
  var priFiles = $scope.listOfFiles.slice(0);
  var finalResult = [];
  orgFiles.forEach(function(orgFile) {
    priFiles.shift();
    priFiles.forEach(function(priFile) {
      finalResult.push(Detektor.StringMatch(orgFile, priFile));
    })
  })
  $scope.results = finalResult;
  Detektor.CleanResults(finalResult);
  console.log($scope.results);
  $scope.hoverItem = function(id) {
    if (angular.element('.' + id).length > 1)
      angular.element('.' + id).addClass('stavekHovered');
  }
  $scope.unhoverItem = function() {
    angular.element('.stavekHovered').removeClass('stavekHovered');
  }
  $scope.sumaVrednosti = function(index) {
    console.log("here");
    var vsota = 0;
    var i = 0;
    $scope.results[index].cleanResults.forEach(function(a) {
      vsota += a.vrednost;
      i++;
    })
    return Math.round((vsota / i) * 100);
  }
});

function ResizeAnimate(width, height, ms) {
  var scrHeight = window.screen.availHeight
  var scrWidth = window.screen.availWidth
  var win = require('nw.gui').Window.get();
  var rate = 1000 / 100;
  win.resizeTo(width, height);
  win.moveTo((scrWidth / 2) - (win.width / 2), (scrHeight / 2) - (win.height /
    2));
}
