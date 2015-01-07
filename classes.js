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
