//services.js
app.factory('SettingsService', function() {
  var FileList = [];
  var showContent = false;
  var removeWords = false;
  var checkSequence = false;

  var setFiles = function(files) {
    FileList = files;
  };
  var getFiles = function() {
    return FileList;
  };
  var setContent = function(ct) {
    showContent = ct;
  };
  var setRWords = function(bool){
    removeWords = bool;
  };
  var setSequence = function(bool){
      checkSequence = bool;
  };
  return {
    setFiles: setFiles,
    getFiles: getFiles,
    setContent: setContent,
    removeWords: setRWords,
    sequence: setSequence,
    getShowContent: showContent,
    getRemoveWords: removeWords,
    getSequence: checkSequence
  };
});
