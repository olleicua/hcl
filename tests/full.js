/* Tests
 */

var _ = require('underscore');
var fs = require('fs');
var exec = require('child_process').exec;
var format = require('hot-cocoa').format;

var files = fs.readdirSync('./examples').filter(function(f) {
  return /\.out$/.exec(f);
});

var tests = [];

for (var i = 0; i < files.length; i++) {
  (function (j) {
    var name = /^(.*)\.out/.exec(files[j])[1];
    exec(format('./bin/hcl examples/~0~.hcl && node examples/~0~.js', [name]),
         function(error, stdout, stderr) {
           tests.push([
             stdout,
             fs.readFileSync(format('examples/~~', [files[j]])).toString()
           ]);
           if (tests.length === files.length) {
             require('hot-cocoa').test(tests);
           }
         });
  })(i);
}
