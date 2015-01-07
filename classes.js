// DATOTEKA
var MyFile = function(file) {
    // pot do datoteke
    this.path = file.path;
    // extract file name
    this.name = file.name
      // vsebina datoteke
    this.content = this.getContent();
    //dobi stavke
    this.stavki = this.getStavki();

  }
  // preberi vsebino datoteke
MyFile.prototype.getContent = function() {
    var fs = require('fs');
    var content = fs.readFileSync(this.path, "utf-8", function(err, data) {
      if (!err)
        return data;
    });
    return content;
  }
  // razdeli vsebino na stavke
MyFile.prototype.getStavki = function() {
  var arr = new Array();
  var regex = /([A-z0-9 ,čšžČŠŽ\(\)\[\]\&\%\+\-\=\:]+[.!?])/g;
  var match;
  while (match = regex.exec(this.content)) {
    arr.push(match[0]);
  }
  return arr;
}

// DETEKTOR
var Detektor = (function() {
  return {
    StringMatch: function(file1, file2) {
      // stavki prve datoteke
      var orgStavki = file1.stavki;
      // stavki druge datoteke
      var priStavki = file2.stavki;
      // končni rezultat
      var results = {
        orgFile: file1,
        priFile: file2,
        comparisons: []
      };
      var i = 0,
        j = 0;
      // zanka ki preveri vse stavke prve datoteke
      orgStavki.forEach(function(orgStavek) {
        var regex = /([!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])([ ])?/g;
        // spremenim v lowercase, odstranim nepomembne znake, ter razdelim
        var orgBesede = orgStavek.toLowerCase().replace(regex, '').split(
          ' ');
        // zanka ki preveri vse stavke druge datoteke
        priStavki.forEach(function(priStavek) {
          // števec datotek, ki se ponavljajo
          var wordCounter = [];
          var priBesede = priStavek.toLowerCase().replace(regex,
            '').split(' ');
          // vsako besedo dodam v števec
          orgBesede.forEach(function(b) {
            wordCounter[b] = 1;
          });
          var vsota = 0;
          // vsako besedo, ki se ponovi v drugem stavki povečam
          priBesede.forEach(function(b) {
            if (b in wordCounter) {
              wordCounter[b] += 1;
              vsota += (wordCounter[b]);
            }
          });
          vsota = vsota / (orgBesede.length + priBesede.length);
          var comparison = {
            orgStavek: i,
            priStavek: j,
            vrednost: vsota
          };
          results.comparisons.push(comparison);
          j++;
        })
        i++;
      })
      console.log(results);
    }
  }
})();
