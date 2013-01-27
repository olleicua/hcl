/* Tests
 */

var hcl = require('../lib/parser.js');

var string2ast = function(string) {
    var tokens = hcl.scan(string);
    var tree = hcl.parse(tokens);
    return hcl.analyze(tree)[0][0];
};

var tests = [
    [function() {
        return string2ast('"this is a quote: \\" ..."').json(); },
     '"this is a quote: \\" ..."'],
    [function() {
        return string2ast('"this is a backslash: \\\\" ; this is a comment').json(); },
     '"this is a backslash: \\\\"'],
    [function() {
        return string2ast('\'()').json(); },
     '[quote, []]'],
    [function() {
        return string2ast('(a\nb)').json(); },
     '[a, b]'],
    [function() {
        return string2ast('\'(1 2 3)').json(); },
     '[quote, [1, 2, 3]]'],
    [function() {
        return string2ast('\`(1 2 ~(- 4 1))').json(); },
     '[quasiquote, [1, 2, [unquote, [-, 4, 1]]]]'],
    [function() {
        return string2ast('(+ 1 2)').json(); },
     '[+, 1, 2]'],
    [function() {
        return string2ast('(cat "hello" " world")').json(); },
     '[cat, "hello", " world"]'],
    [function() {
        return string2ast('[]').json(); },
     '[list]'],
    [function() {
        return string2ast(';; foo\n[]').json(); },
     '[list]'],
    [function() {
        return string2ast('[1];; bar\n').json(); },
     '[list, 1]'],
    [function() {
        return string2ast('[1 2 3]').json(); },
     '[list, 1, 2, 3]'],
    [function() {
        return string2ast('{}').json(); },
     '[object]'],
    [function() {
        return string2ast('{a 1 b 2}').json(); },
     '[object, a, 1, b, 2]'],
    [function() {
        return string2ast('{a [1 2 3] b [{x 4} {x 5} {x 6}]}').json(); },
     '[object, a, [list, 1, 2, 3], b, [list, [object, x, 4], [object, x, 5], ' +
     '[object, x, 6]]]'],
    [function() {
        return string2ast('foo.bar').json(); },
     '[., foo, bar]'],
    [function() {
        return string2ast('foo.bar.baz').json(); },
     '[., foo, bar, baz]'],
    [function() {
        return string2ast('(a b).c.d').json(); },
     '[., [a, b], c, d]'],
    [function() {
        return string2ast('(console.log "Hello World!")').json(); },
     '[[., console, log], "Hello World!"]'],
    [function() {
        return string2ast('(($ "div#foo").css "background-color" \
                                              "#ffaaaa")').json(); },
     '[[., [$, "div#foo"], css], "background-color", "#ffaaaa"]'],
    [function() {
        return string2ast('(($ "div#foo").css { background-color "#ffaaaa" \
                                                padding "5em"})').json(); },
     '[[., [$, "div#foo"], css], [object, background-color, "#ffaaaa", ' +
     'padding, "5em"]]'],
    [function() {
        return string2ast('(def empty? (# (l) (= 0 (length l))))').json(); },
     '[def, empty?, [#, [l], [=, 0, [length, l]]]]'],
    [function() {
        return string2ast(
            '(def empty? (# (l) (if (= 0 (length l)) true false)))'
        ).json(); },
     '[def, empty?, [#, [l], [if, [=, 0, [length, l]], true, false]]]']
];

require('hot-cocoa').test(tests);
