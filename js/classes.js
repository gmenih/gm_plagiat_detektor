// DATOTEKA
var MyFile = function(file) {
  // pot do datoteke
  this.path = file.path;
  // extract file name
  this.name = file.name.split('.')[0];
  // vsebina datoteke
  //dobi stavke
  this.stavki = this.getStavki();

};
// preberi vsebino datoteke
MyFile.prototype.getContent = function() {
  var fs = require('fs');
  var content = fs.readFileSync(this.path, "utf-8", function(err, data) {
    if (!err)
      return data;
  });
  return content;
};
// razdeli vsebino na stavke
MyFile.prototype.getStavki = function() {
  var content = this.getContent();
  var arr = [];
  var regex = /([A-z0-9 ,čšžČŠŽ\(\)\[\]\&\%\+\-\=\:]+[.!?])/g;
  var match;
  while (match = regex.exec(content)) {
    arr.push(match[0]);
  }
  return arr;
};
// error message
var Hint = function(msg, type) {
  this.message = msg;
  this.type = type;

  this.html = this.constructDOM();
};
Hint.prototype.constructDOM = function() {
  var html = '<div class="hintToast ' + this.type + '">';
  html += '<span class="hintMessage">';
  html += this.message;
  html += '</span>';
  html += '<span class="hintIcon ' + this.type + '"></span>';
  html += '</div>';
  return html;
};
Hint.prototype.show = function(element) {
  var p = angular.element(element).offset();
  var el = angular.element(this.html);
  var x = p.left;
  var y = p.top;
  el.appendTo('body');
  var h = el.height();
  el.css({
    top: (y - h - 10) + 'px',
    left: x + 'px'
  })

};
Hint.prototype.destroy = function() {
  angular.element('.hintToast').remove();
};
