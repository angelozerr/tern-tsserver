var ts = require('typescript/lib/tsserver.js');
var Session = ts.server.Session;

Session.prototype.extend = function extend(name, f) {
  this[name] = f(this[name]);
};

Session.prototype.extend('onMessage', function(inner) {
  return function(message) {   
    if (message.files) {
      var _this = this;
      messages.files.forEach(function (file) {
        var msg = {"command": "Open", "file": file.name};
        inner.call(_this, msg);
      });
      return;
    }
    return inner.call(this, message);
    
  	//this.output(undefined, "BEFORE => " + message);
    //return inner.call(this, message);
  };
});