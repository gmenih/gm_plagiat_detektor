//controller.js
app.controller('FileSelectController', function($scope, $location, SettingsService) {
  $scope.dialogOpen = false;
  // checkboxes
  $scope.wordPurgeCB = true;
  $scope.sequenceCB = false;
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
        if (fileDialog.val() !== '') {
          var fileList = fileDialog[0].files;
          for (var i = 0; i < fileList.length; i++) {
            $scope.$apply(function() {
              $scope.listOfFiles.push(new MyFile(fileList[i]));
            });
          }
        }
        fileDialog.val('');
        $scope.$apply(function() {
          $scope.dialogOpen = false;
        });
      });
    }
  };

  $scope.CheckFiles = function() {
    // če je uporabnik dodal vsaj 2 datoteki
    if($scope.listOfFiles.length >= 2){
      // vse pomembne podatke shranim in jih pošljem naprej
      SettingsService.setFiles($scope.listOfFiles);
      SettingsService.setContent($scope.showContentCB);
      SettingsService.sequence($scope.sequenceCB);
      SettingsService.removeWords($scope.wordPurgeCB);
      $location.path('/results');
      ResizeAnimate(1600, 950, 500);
    } else {
      // drugače izpišem napako
      var error = new Hint('Select at least 2 files!', 'error');
      error.show('#fsPage');
    }
  };
});

app.controller('ResultsController', function($scope, SettingsService) {
  // preberem vse datoteke
  $scope.listOfFiles = SettingsService.getFiles();

  $scope.wordPurgeCB = SettingsService.getRemoveWords;
  $scope.sequenceCB = SettingsService.getSequence;
  $scope.showContentCB = SettingsService.getShowContent;
  // ustvarim dva klona datotek
  var orgFiles = $scope.listOfFiles.slice(0);
  var priFiles = $scope.listOfFiles.slice(0);
  var finalResult = [];
  // primerjam vsako datoteko z vsako
  orgFiles.forEach(function(orgFile) {
    priFiles.shift();
    priFiles.forEach(function(priFile) {
      var result = Detektor.StringMatch(orgFile, priFile, $scope.wordPurgeCB, $scope.sequenceCB);
      finalResult.push(result);
    });
  });
  $scope.results = finalResult;
  Detektor.CleanResults(finalResult);
  console.log($scope.results);
  $scope.hoverItem = function(id) {
    if (angular.element('.' + id).length > 1)
      angular.element('.' + id).addClass('stavekHovered');
  };
  $scope.unhoverItem = function() {
    angular.element('.stavekHovered').removeClass('stavekHovered');
  };
  $scope.i = 0;

  var Sum = function(index) {
    var vsota = 0;
    var i = 0;
    $scope.results[index].cleanResults.forEach(function(a) {
      vsota += a.vrednost;
      i++;
    });
    return Math.round((vsota / i) * 100);
  };
});
