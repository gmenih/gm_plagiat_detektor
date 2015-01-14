// DETEKTOR
var Detektor = (function() {
  var badWords = null;

  // stavek pretvori v male črke in odstrani vse znake ki niso črke
  var minimizeStavek = function(stavek) {
    var regex = /([!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])([ ])?/g;
    var stavek = stavek.toLowerCase().replace(regex, '').split(
      ' ');
      // številk ne štejem k stavkom
    stavek.forEach(function(word, index) {
      if (!isNaN(word))
        stavek.splice(index, 1);
    })
    return stavek;
  }
  // izračun povprečnega procenta na vse primerjave dveh datotek
  var getAvgPercent = function(results) {
    var v = 0,
      i = 0;
      // vsoto prištevam nato delim s številom vseh
    results.forEach(function(result) {
      v += result.vrednost;
      i++;
    });
    // deljenje z 0 ni kul
    if (isNaN(v / i))
      return 0;
    return v / i;
  }
  // izračun povprečnega procenta za zaporedja
  var getSequenceAvg = function(results) {
    var v = 0;
    var i = 0;
    // prištevam vsoto in delim
    results.forEach(function(result) {
      for (var s in result.sekvenca) {
        v += result.sekvenca[s]['overall'];
      }
      i++;
    });
    // deljenje z 0 ni kul
    if (isNaN(v / i))
      return 0;
    return v / i;
  }
  // odstrani vse besede v datoteki badWords.json (vezniki ipd)
  var removeBadWords = function(stavek) {
    // če še array ne obstaja (init zgoraj), ga preberem
    if (!badWords) {
      var fs = require('fs');
      badWords = fs.readFileSync('./data/badWords.json', 'utf-8', function(err, data) {
        return JSON.parse(data);
      });
    }
    // vsaka beseda v stavku ki je hkrati v badWords je odstranjena
    stavek.forEach(function(word, index) {
      if (badWords.indexOf(word) > -1) {
        stavek.splice(index, 1);
      }
    })
    return stavek;
  }
  // počistim rezultate
  var cleanResults = function(result) {
    var cleanResults = []; // čist rezultat
    for (var i = 0; i < result.orgFile.stavki.length; i++) { // loop čez vsak stavek
      var maxPrimerjava = { // max
        vrednost: -1
      };
      // loop čez vse primerjave za datoteko
      result.primerjave.forEach(function(primerjava) {
        // če je trenutna primerjava večja od max, jo nastavim kot max
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
    //odstranim neuporabne rezutlate
    delete result.primerjave;
    result.primerjave = cleanResults;
    return result;
  }
  // pregled zaporedja
  var sequenceCheck = function(orgBesede, priBesede, wordCounter) {
    var sekvence = {};
    // iz stavkov odstranim vse besede, ki se ne ponavljajo
    orgBesede.forEach(function(b, index) {
      if (!(b in wordCounter))
        orgBesede.splice(index, 1);
    });
    priBesede.forEach(function(b, index) {
      if (!(b in wordCounter))
        priBesede.splice(index, 1);
    });
    // št uporabljenih besed in št. sekvenc (ponavljanj besed)
    var usedWords = 0;
    var sekvLength = 0;
    // za vsako besedo ki se ponavlja
    for (var word in wordCounter) {
      if (wordCounter[word] == 2) { // == 2 => se ponavlja
        usedWords++;
        // izračunam razliko indeksov v obeh stavkih
        var razlika = Math.abs(orgBesede.indexOf(word) - priBesede.indexOf(word));
        // če sekvenca za to razliko še ne obstaja jo ustvarim
        if (!sekvence[razlika]) {
          sekvence[razlika] = [];
          sekvLength++;
        }
        // besedo dodam v sekvenco
        sekvence[razlika].push(word);
      }
    }
    // izračunam vrednost  (%) za vsako sekvenco
    for (var sek in sekvence) {
      sekvence[sek].overall = (sekvence[sek].length / usedWords);
    }
    return sekvence;
  }

  return {
    // glavna metoda
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

        // spremenim v lowercase, odstranim nepomembne znake, ter razdelim
        var orgBesede = minimizeStavek(orgStavek);
        if (wordPurge) {
          orgBesede = removeBadWords(orgBesede);
        }
        // zanka ki preveri vse stavke druge datoteke
        priStavki.forEach(function(priStavek) {
          // števec datotek, ki se ponavljajo
          var stBesed = {};
          var priBesede = minimizeStavek(priStavek);
          if (wordPurge) {
            priBesede = removeBadWords(priBesede);
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
          // pregled zaporedja
          if (checkSequence)
            primerjava.sekvenca = sequenceCheck(orgBesede, priBesede, stBesed);
          rezultat.primerjave.push(primerjava);
        });
      });
      // počistim rezultate
      cleanResults(rezultat);
      // izračunam %
      rezultat.skupnaVrednost = getAvgPercent(rezultat.primerjave);
      if (checkSequence)
        rezultat.sekvencnaVrednost = getSequenceAvg(rezultat.primerjave);
      return rezultat;
    }
  };
})();
