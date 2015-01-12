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
    console.log('setting content to', ct);
    showContent = ct;
  };
  var setRWords = function(bool) {
    console.log('setting remove to', bool);
    removeWords = bool;
  };
  var setSequence = function(bool) {
    console.log('setting sequence to', bool);
    checkSequence = bool;
  };
  var getShowContent = function() {
    return showContent;
  };
  var getRemoveWords = function() {
    return removeWords;
  };
  var getCheckSequence = function() {
    return checkSequence;
  };
  return {
    setFiles: setFiles,
    getFiles: getFiles,
    setContent: setContent,
    setRemoveWords: setRWords,
    setSequence: setSequence,
    getShowContent: getShowContent,
    getRemoveWords: getRemoveWords,
    getSequence: getCheckSequence
  };
});
