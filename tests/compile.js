var hcl = require('../lib/parser.js');
var compile = require('../lib/compile.js');

// TODO: these should be output based
var compile_test = function(source) {
	var prefix = '// compiled from Hot Cocoa Lisp\n\nannotations coming..\n\n';
	return compile(hcl.analyze(hcl.parse(hcl.scan(source)))[0])
		.slice(prefix.length);
}

var tests = [
	[function() { return compile_test('(if 1)'); },
	 'Error: Wrong number of arguments: 1 for 3'],
	[compile_test('(console.log "hello")'),
	 'console.log("hello");'],
	[compile_test('(console.log (if true "yes" "no"))'),
	 'console.log((true ? "yes" : "no"));'],
	[compile_test('(= 1 2 3)'),
	 '1 === 2 && 1 === 3;'],
	[compile_test('(cond ((= x 1) "one") (true "not one"))'),
	 '(x === 1 ? \"one\" : true ? \"not one\" : undefined);']
];

require('hot-cocoa').test(tests);
