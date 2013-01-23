var hcl = require('../lib/parser.js');
var compile = require('../lib/compile.js');

// TODO: these should be output based
var compile_test = function(source) {
	var prefix = '// compiled from Hot Cocoa Lisp\n\nannotations coming..\n\n';
	return compile(hcl.analyze(hcl.parse(hcl.scan(source)))[0])
		.slice(prefix.length);
}

var eval_test = function(source) {
	return eval(compile_test(source));
}

var tests = [
	[function() { return compile_test('(if 1)'); },
	 'Error: Wrong number of arguments: 1 for 3'],
	[compile_test('(console.log "hello")'),
	 'console.log("hello");'],
	[compile_test('(console.log (if true "yes" "no"))'),
	 'console.log((true ? "yes" : "no"));'],
	[eval_test('(= 1 2 2)'),
	 false],
	[eval_test('(= false false false)'),
	 true],
	[eval_test('(cond ((< 6 8) "less") (true "not less"))'),
	 'less'],
	[eval_test('(cond ((< 16 8) "less") (true "not less"))'),
	 'not less'],
	[eval_test('((# (x) (+ x 1)) 2)'),
	 3],
	[eval_test('(>= (* 2 3 5) (/ 45 1.5) 0 (- 10 11))'),
	 true],
	[eval_test('(>= (* 2 3 5) (/ 45 1.5) 0 (- 10 11) 7)'),
	 false],
	[eval_test('(cat "Hello" " " "World" (if true "!" ""))'),
	 'Hello World!']
];

require('hot-cocoa').test(tests);
