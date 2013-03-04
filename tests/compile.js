var hcl = require('../lib/parser.js');

var compile = function(source) {
  return require('../lib/compile.js')(hcl.analyze(hcl.parse(hcl.scan(source)))[0]);
};

var compile_test = function(source) {
  return compile(source).replace(/^\n/gm, '').replace(/\/\/.*\n/gm, '');
}

var eval_test = function(source) {
  return function() {
    return eval('(' + compile(source).replace(/;$/, '') + ')');
  };
}

//console.log(hcl.analyze(hcl.parse(hcl.scan('(replace "1 2 3 (4) 5 (6)" /\((\d)\)/ "[$1]")')))[0])

var tests = [
  [function() { return compile_test('(if 1)'); },
   'Error: Wrong number of arguments for `if`: 1 for 3'],
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
  [eval_test('"\\""'),
   '"'],
  [eval_test('(cat "Hello" " " "World" (if true "!" ""))'),
   'Hello World!'],
  [eval_test('[1 2 3]'),
   [1, 2, 3]],
  [eval_test('{a 1 b 2}'),
   { a: 1, b: 2 }],
  [eval_test('{+ 1}'),
   { __plus__: 1 }],
  [eval_test('(odd? 21)'),
   true],
  [eval_test('(empty? [])'),
   true],
  [eval_test('(empty? "")'),
   true],
  [eval_test('(empty? "foo")'),
   false],
  [eval_test('(empty? 17)'),
   false],
  [eval_test('(get [1 2 3] 0)'),
   1],
  [eval_test('(get {a 1 b 2} "b")'),
   2],
  [eval_test('((# (x...) x.length) 1 2 3 4)'),
   4],
  [eval_test('(replace "foo" (re "o") "0")'),
   "f0o"],
  [eval_test('(replace "foo" (re "O" "i") "0")'),
   "f0o"],
  [eval_test('(replace "foo" (re "o" "g") "0")'),
   "f00"],
  [eval_test('(replace "1 2 3 {4} 5 {6}" (re "{(\\d)}" "g") "[$1]")'),
   '1 2 3 [4] 5 [6]'],
  [eval_test('(and (= (+1 7) (*2 4)) (< (/2 10) (-1 8)))'),
   true],
  [eval_test('(and (nil? null) (boolean? true) (number? 7.5) (string? "foo"))'),
   true],
  [eval_test('(and (list? []) (object? {}) (function? (# () (nop))) (empty? ""))'),
   true],
  [eval_test('(and (integer? 7) (even? 8) (odd? 9) (contains? [1] 1))'),
   true],
  [eval_test('(or (nil? 0) (boolean? undefined) (number? "bar") (string? []))'),
   false],
  [eval_test('(or (list? {}) (object? 5) (function? {}) (empty? "x"))'),
   false],
  [eval_test('(or (integer? 7.5) (even? 9) (odd? 8) (contains? [1] 2))'),
   false]
];

require('hot-cocoa').test(tests);