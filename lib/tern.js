var ts = require('typescript/lib/tsserver.js');
var Session = ts.server.Session;

Session.prototype.extend = function extend(name, f) {
  this[name] = f(this[name]);
};

Session.prototype.extend('onMessage', function(inner) {
  return function(message) {
    var m = JSON.parse(message); 
    if (m.files) {
      var _this = this;
      m.files.forEach(function (file) {
        // {"command": "open", "arguments": {"file": "lib.d.ts"}}
        var msg = '{"command": "open", "arguments": {"file": "' + file.name + '"}}';
        inner.call(_this, msg);
      });
      return;
    } else if (m.query) {
      switch(m.query.type) {
        case "completions":
          var msg = '{"command": "completions", "arguments": {"line": 0, : "offset":' + m.query.offset +  ', "file": "' + file.name + '"}}';
          inner.call(_this, msg);
          break;
      }
    }
    return inner.call(this, message);
  };
});