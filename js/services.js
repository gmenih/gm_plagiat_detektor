//service za prenos podatkov med okni
app.factory('SettingsService', function() {
  var FileList = [];
  var showContent = false;
  var removeWords = false;
  var checkSequence = false;
  var results = null;

  var setFiles = function(files) {
    FileList = files;
  };
  var getFiles = function() {
    return FileList;
  };
  var setContent = function(ct) {
    showContent = ct;
  };
  var setRWords = function(bool) {
    removeWords = bool;
  };
  var setSequence = function(bool) {
    checkSequence = bool;
  };
  var setResults = function(json){
    results = json;
  }
  var getShowContent = function() {
    return showContent;
  };
  var getRemoveWords = function() {
    return removeWords;
  };
  var getCheckSequence = function() {
    return checkSequence;
  };
  var getResults = function(){
    return results;
  }
  return {
    setFiles: setFiles,
    getFiles: getFiles,
    setContent: setContent,
    setRemoveWords: setRWords,
    setSequence: setSequence,
    getShowContent: getShowContent,
    getRemoveWords: getRemoveWords,
    getSequence: getCheckSequence,
    setResults: setResults,
    getResults: getResults
  };
});
