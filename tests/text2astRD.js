/* Tests
 */

var hcl = require('../lib/parser.js');

var string2ast = function(string) {
    var tokens = hcl.scan(string);
    var tree = hcl.parse(tokens, require('hot-cocoa').RD);
    return hcl.analyze(tree)[0][0];
};

var tests = require('../parseTests.js')(string2ast);

require('hot-cocoa').test(tests);
