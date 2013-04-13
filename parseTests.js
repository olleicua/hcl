module.exports = function(string2ast) {
    return [
        [function() {
            return string2ast('"this is a quote: \\" ..."').json(true); },
         '"this is a quote: \\" ..."'],
        [function() {
            return string2ast('"this is a backslash: \\\\" ; this is a comment').json(true); },
         '"this is a backslash: \\\\"'],
        [function() {
            return string2ast('(a\nb)').json(true); },
         '[a, b]'],
        [function() {
            return string2ast('(+ 1 2)').json(true); },
         '[+, 1, 2]'],
        [function() {
            return string2ast('(cat "hello" " world")').json(true); },
         '[cat, "hello", " world"]'],
        [function() {
            return string2ast('[]').json(true); },
         '[list]'],
        [function() {
            return string2ast(';; foo\n[]').json(true); },
         '[list]'],
        [function() {
            return string2ast('[1];; bar\n').json(true); },
         '[list, 1]'],
        [function() {
            return string2ast('[1 2 3]').json(true); },
         '[list, 1, 2, 3]'],
        [function() {
            return string2ast('{}').json(true); },
         '[object]'],
        [function() {
            return string2ast('{a 1 b 2}').json(true); },
         '[object, a, 1, b, 2]'],
        [function() {
            return string2ast('{a [1 2 3] b [{x 4} {x 5} {x 6}]}').json(true); },
         '[object, a, [list, 1, 2, 3], b, [list, [object, x, 4], [object, x, 5], ' +
         '[object, x, 6]]]'],
        [function() {
            return string2ast('foo.bar').json(true); },
         '[., foo, bar]'],
        [function() {
            return string2ast('foo.bar.baz').json(true); },
         '[., foo, bar, baz]'],
        [function() {
            return string2ast('(a b).c.d').json(true); },
         '[., [a, b], c, d]'],
        [function() {
            return string2ast('(console.log "Hello World!")').json(true); },
         '[[., console, log], "Hello World!"]'],
        [function() {
            return string2ast('(($ "div#foo").css "background-color" "#ffaaaa")').json(true); },
         '[[., [$, "div#foo"], css], "background-color", "#ffaaaa"]'],
        [function() {
            return string2ast('(($ "div#foo").css { background-color "#ffaaaa" padding "5em"})').json(true); },
         '[[., [$, "div#foo"], css], [object, background-color, "#ffaaaa", ' +
         'padding, "5em"]]'],
        [function() {
            return string2ast('(def empty? (# (l) (= 0 (length l))))').json(true); },
         '[def, empty?, [#, [l], [=, 0, [length, l]]]]'],
        [function() {
            return string2ast(
                '(def empty? (# (l) (if (= 0 (length l)) true false)))'
            ).json(true); },
         '[def, empty?, [#, [l], [if, [=, 0, [length, l]], true, false]]]'],
        [function() {
            return string2ast('([1 2 3].slice 2 3)').json(true); },
         '[[., [list, 1, 2, 3], slice], 2, 3]']
    ];
};