// DATOTEKA
var MyFile = function(file) {
  // pot do datoteke
  this.path = file.path;
  // extract file name
  this.name = file.name.split('.')[0];
  // vsebina datoteke
  this.content = this.getContent();
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
  var arr = [];
  var regex = /([A-z0-9 ,čšžČŠŽ\(\)\[\]\&\%\+\-\=\:]+[.!?])/g;
  var match;
  while (match = regex.exec(this.content)) {
    arr.push(match[0]);
  }
  return arr;
};

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
// DETEKTOR
var Detektor = (function() {
  var badWords = ["oz. "];
  return {
    StringMatch: function(file1, file2, wordPurge, checkSequence) {
      wordPurge = typeof wordPurge !== "undefined" ? wordPurge : false;
      checkSequence = typeof checkSequence !== "undefined" ? checkSequence : false;
      // stavki prve datoteke
      var orgStavki = file1.stavki;
      // stavki druge datoteke
      var priStavki = file2.stavki;
      // končni rezultat
      var rezultat = {
        orgFile: file1,
        priFile: file2,
        primerjave: []
      };
      // zanka ki preveri vse stavke prve datoteke
      orgStavki.forEach(function(orgStavek) {
        var regex = /([!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])([ ])?/g;
        // spremenim v lowercase, odstranim nepomembne znake, ter razdelim
        var orgBesede = orgStavek.toLowerCase().replace(regex, '').split(
          ' ');
        if (wordPurge) {
          this.badWords.forEach(function(badWord) {
            var index = orgBesede.indexOf(badWord);
            if (index > -1) {
              orgBesede.splice(index, 1);
            }
          });
        }
        // zanka ki preveri vse stavke druge datoteke
        priStavki.forEach(function(priStavek) {
          // števec datotek, ki se ponavljajo
          var stBesed = [];
          var priBesede = priStavek.toLowerCase().replace(regex,
            '').split(' ');
          if (wordPurge) {
            this.badWords.forEach(function(badWord) {
              var index = orgBesede.indexOf(badWord);
              if (index > -1) {
                orgBesede.splice(index, 1);
              }
            });
          }
          // vsako besedo dodam v števec
          orgBesede.forEach(function(b) {
            stBesed[b] = 1;
          });
          var vsota = 0;
          // vsako besedo, ki se ponovi v drugem stavki povečam
          priBesede.forEach(function(b) {
            if (b in stBesed) {
              stBesed[b] = 2;
              vsota += (stBesed[b]);
            }
          });
          // izračunam % podobnosti stavkov
          vsota = vsota / (orgBesede.length + priBesede.length);
          // index stavkov in %
          // id primerjave, za lažje referenciranje v HTML
          var id = file1.name[Math.floor(Math.random() *
            file1.name.length)] + '-' + file2.name[Math.floor(
            Math.random() * file2.name.length)] + Math.floor(
            Math.random() * 10000000000);
          var primerjava = {
            _id: id,
            orgStavek: orgStavek,
            priStavek: priStavek,
            vrednost: vsota,
            wordCounter: stBesed
          };
          // dodam primerjavo v končni rezultat
          rezultat.primerjave.push(primerjava);
        });
      });
      return rezultat;
    },
    /**
		  Funkcija poišče najvišje ujemanje za vsak stavek.
		*/
    CleanResults: function(results) {
      /*
			  primerjave: [{orgStavek, priStavek, vrednost},{...}]
			*/
      // loop čez vse primerjave datotek
      results.forEach(function(result) {
        var cleanResults = []; // rezultat za vsak stavek za trenutno datoteko
        for (var i = 0; i < result.orgFile.stavki.length; i++) { // loop čez vsak stavek
          var maxPrimerjava = { // max
            vrednost: -1
          };
          // loop čez vse primerjave za datoteko
          result.primerjave.forEach(function(primerjava) {
            if (primerjava.orgStavek == result.orgFile.stavki[i] &&
              (primerjava.vrednost >
                maxPrimerjava
                .vrednost))
              maxPrimerjava = primerjava;
          });
          // rezultat dodam v array
          cleanResults[i] = maxPrimerjava;
        }
        //rezultat pripnem končnemu rezultatu
        result.cleanResults = cleanResults;
      });
      return results;
    }
  };
})();
