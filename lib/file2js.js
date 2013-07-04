var format = require('hot-cocoa').format;
var hcl = require('./parser.js');
var fs = require('fs');
var path = require('path');

// This tracks files compiled by this process so that no file is compiled twice
// and cyclic dependencies don't result in infinite compilation.
var compiled_files = [];

module.exports = function(hcl_file, callback) {
  // this line must be here instead of above for complex reasons involving
  // node.js's handling of cyclic dependencies which is documented here:
  // http://nodejs.org/api/modules.html#modules_cycles
  var compile = require('./compile.js');
  
  if (compiled_files.indexOf(path.normalize(hcl_file)) !== -1) {
    // file has already been compiled
    return;
  }
  
  compiled_files.push(path.normalize(hcl_file));
  
  // compile and write to .js file
  try {
    var text = fs.readFileSync(hcl_file)
  } catch (e) {
    console.log(format('Unable to load file: ~~', [hcl_file]));
    process.exit();
  }
  
  var source = text.toString()
  var asts = hcl.analyze(hcl.parse(hcl.scan(source),
                                   require('hot-cocoa').RD))[0];
  var dir = path.dirname(hcl_file) + '/';
  var out = compile(asts, source, dir);
  var js_file = hcl_file.replace(/(\.[^.\/]+$)|$/, '.js');
  
  fs.writeFile(js_file, out, function() {
    if (typeof(callback) === 'function') {
      callback();
    }
  });
}