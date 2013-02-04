/* Tests
 */

var _ = require('underscore');
var fs = require('fs');
var exec = require('child_process').exec;
var format = require('hot-cocoa').format;

var files = fs.readdirSync('./examples').filter(function(f) {
    return /\.js$/.exec(f);
});

var tests = [];

for (var i = 0; i < files.length; i++) {
    (function (j) {
        exec(format('node examples/~~', [files[j]]), function(error, stdout, stderr) {
            tests.push(
                [stdout,
                 fs.readFileSync(format('examples/~~', [files[j].replace(/\.js$/, '.out')])).toString()]
            );
            if (tests.length === files.length) {
                require('hot-cocoa').test(tests);
            }
        });
    })(i);
}
