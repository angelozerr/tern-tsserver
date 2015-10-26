var ts = require('typescript/lib/tsserver.js');
var Session = ts.server.Session;

Session.prototype.extend = function extend(name, f) {
  this[name] = f(this[name]);
};

Session.prototype.extend('onMessage', function(inner) {
  return function(message) {
    var _this = this, m = JSON.parse(message); 
    if (m.files) {      
      m.files.forEach(function (file) {
        // {"command": "open", "arguments": {"file": "lib.d.ts"}}
        var msg = '{"command": "open", "arguments": {"file": "' + file.name + '"}}';
        inner.call(_this, msg);
      });
    } 
    if (m.query) {
      switch(m.query.type) {
        case "completions":
        	m.query.file = "test.ts";
          var msg = '{"command": "completions", "arguments": {"line": 0, "offset":' + m.query.end +  ', "file": "' + m.query.file + '"}}';
          inner.call(_this, msg);
          break;
      }
      return;
    }
    //if (m.files) return;
    //return inner.call(this, message);
    this.sendLineToClient("{}");
  };
});

Session.prototype.extend('send', function(inner) {
  return function(msg) {
	switch(msg.command) {
	  case "completions":
		var completions = msg.body.map(function(rec) {
			return rec;
		});
		this.sendLineToClient(JSON.stringify(completions));
		return;
	}
	return inner.call(this, msg);
  };
});