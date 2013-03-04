var hcl = require('./parser.js');
var fs = require('fs');
var path = require('path');

// This tracks files compiled by this process so that no file is compiled twice
// and cyclic dependencies don't result in infinite compilation.
var compiled_files = [];

var simplify_path = 

module.exports = function(hcl_file) {
  var compile = require('./compile.js');
  
  if (compiled_files.indexOf(path.normalize(hcl_file)) !== -1) {
    // file has already been compiled
    return;
  }
  
  compiled_files.push(path.normalize(hcl_file));
  
  // compile and write to .js file
  fs.readFile(hcl_file, function(err, text) {
    if (err) throw err;
    var source = text.toString()
    var asts = hcl.analyze(hcl.parse(hcl.scan(source),
                                     require('hot-cocoa').RD))[0];
    var path = hcl_file.replace(/\/[^\/]+$/, '/');
    var out = compile(asts, source, path);
    var js_file = hcl_file.replace(/\.hcl$/, '.js');
    fs.writeFile(js_file, out);
  });
}