// file select controller
app.controller('FileSelectController', function($scope, $location, SettingsService) {
  $scope.dialogOpen = false; // blokira okno če je true
  // checkboxes
  $scope.wordPurgeCB = true;
  $scope.sequenceCB = true;
  $scope.showContentCB = true;
  // spisek datoteks
  $scope.listOfFiles = [];

  var fileDialog = angular.element('#hiddenFileDialog');
  // odpri dialog za izbiro datotek
  $scope.OpenFileDialog = function() {
    if (!$scope.dialogOpen) {
      // hack
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
        // če user klikne cancel
        fileDialog.val('');
        $scope.$apply(function() {
          $scope.dialogOpen = false;
        });
      });
    }
  };
  // prikaz napake
  var error = null;
  var timeout = null;
  $scope.CheckFiles = function() {
    // če je uporabnik dodal vsaj 2 datoteki
    if ($scope.listOfFiles.length >= 2) {
      // vse pomembne podatke shranim in jih pošljem naprej
      SettingsService.setFiles($scope.listOfFiles);
      SettingsService.setContent($scope.showContentCB);
      SettingsService.setSequence($scope.sequenceCB);
      SettingsService.setRemoveWords($scope.wordPurgeCB);
      // prikažem drugo okno in povečam okno
      $location.path('/results');
      ResizeAnimate(1600, 950, 500);
    } else {
      // če je manj kot 2datoteki
      if (!error) {
        // prikažem error ki zgine po 4 sekundah
        error = new Hint('Izberi vsaj dve datoteki!', 'error');
        error.show('.defaultButton');
        timeout = setTimeout(function() {
          error.destroy();
          error = null;
        }, 4000);
      } else {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
          error.destroy();
          error = null;
        }, 4000);
      }
    }
  };
  // odpri shranjen rezultat
  $scope.openSavedResult = function() {
    // open file dialog
    var openFileDialog = angular.element('<input>', {
      type: 'file',
      accept: '.b64',
      multiple: false
    });
    // trigger odpre dialog
    openFileDialog.trigger('click');
    // blokiram okno
    $scope.dialogOpen = true;
    // track chabnges
    openFileDialog.on('change', function() {
      $scope.dialogOpen = false;
      var file = openFileDialog[0].files[0];
      var fs = require('fs');
      // preberem izbrano datoteko
      var data = fs.readFileSync(file.path, 'utf-8', function(err, data) {
        return data;
      });
      // jo dekodiram
      var json = new Buffer(data, 'base64').toString('utf8');
      $scope.$apply(function() {
        $scope.dialogOpen = false;
      })
      try {
        // spremenim v JSON in preusmerim na drugo okno
        var array = JSON.parse(json);
        SettingsService.setContent($scope.showContentCB);
        SettingsService.setSequence($scope.sequenceCB);
        SettingsService.setRemoveWords($scope.wordPurgeCB);
        SettingsService.setResults(array);
        $location.path('/results');
        $scope.$apply();
        ResizeAnimate(1600, 950, 500);
      } catch (e) {
        // če ni JSON iziišem napako
        var error = new Hint('Izbrana datoteka ni veljavna!');
        error.show('.openLink');
        setTimeout(function() {
          error.destroy();
        }, 4000);
      }
    });
  };
});
// kontroler rezultatov
app.controller('ResultsController', function($scope, SettingsService) {
  // preberem checkboxe
  $scope.wordPurgeCB = SettingsService.getRemoveWords();
  $scope.sequenceCB = SettingsService.getSequence();
  $scope.showContentCB = SettingsService.getShowContent();
  // če je uporabnik kliknil Preveri datoteke
  if (!SettingsService.getResults()) {
    // preberem vse datoteke
    $scope.listOfFiles = SettingsService.getFiles();
    // ustvarim dva klona datotek
    var orgFiles = $scope.listOfFiles.slice(0);
    var priFiles = $scope.listOfFiles.slice(0);
    var finalResult = [];
    // primerjam vsako datoteko z vsako
    orgFiles.forEach(function(orgFile) {
      // odstranim prvi element
      priFiles.shift();
      priFiles.forEach(function(priFile) {
        var result = Detektor.StringMatch(orgFile, priFile, $scope.wordPurgeCB, $scope.sequenceCB);
        finalResult.push(result);
      });
    });
    // v scope dam rezultate
    $scope.results = finalResult;
    // če je uporabnik odprl shranjeno datoteko >
  } else
    $scope.results = SettingsService.getResults();
  // vrednost trenutno hoveranga stavka za vsak par datotek
  $scope.hoveredValue = [];
  // ko hoveram stavek
  $scope.hoverItem = function(id, val, index) {
    // shranim vrednost in obarvam parni stavek v drugi datoteki
    $scope.hoveredValue[index] = val;
    if (angular.element('.' + id).length > 1)
      angular.element('.' + id).addClass('stavekHovered');
  };
  // unhover, obratno
  $scope.unhoverItem = function() {
    $scope.hoveredValue = [];
    angular.element('.stavekHovered').removeClass('stavekHovered');
  };

  $scope.toPercent = function(val) {
      return Math.round(val * 100);
    }
    // blokiram okno?
  $scope.dialogOpen = false;
  $scope.saveData = function() {
      if (!$scope.dialogOpen) {
        var d = new Date();
        var fileName = "plagiat-data-" + d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + '.b64';
        var fileDialog = angular.element('<input>', {
          type: 'file',
          nwsaveas: fileName,
          accept: '.b64'
        });
        fileDialog[0].files.append(new File("", ""));
        // odprem dialog
        fileDialog.trigger('click');
        $scope.dialogOpen = true;
        // track
        fileDialog.on('change', function() {
          if (fileDialog.val() != '') {
            var file = fileDialog[0].files[0];
            var fs = require('fs');
            // zapišem JSON v base64
            var str = new Buffer(JSON.stringify($scope.results));
            fs.writeFileSync(file.path, str.toString('base64'));
          }
          fileDialog.val('');
          $scope.$apply(function() {
            $scope.dialogOpen = false;
          });
        });
      }
    }
    // odpri external file
  $scope.openFile = function(path) {
    var shell = require('nw.gui').Shell;
    shell.openItem(path);
  }
});
