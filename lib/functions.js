var _ = require('underscore');
var format = require('hot-cocoa').format;
var helpers = require('./helpers.js');

// TODO: add validation for arguments to templates
// for example 'if' with fewer than 3 arguments should be a compile error

var function_map = require('hot-cocoa').template_map({
    'nop': 'undefined',
    '.': helpers.joiner('.'),
    'get': '~~[~~]',
    'list': _.compose(helpers.brackets('[', ']'), helpers.joiner(', ')),
    'object': function(args) {
        pairs = [];
        for (var i = 1; i < args.length; i += 2) {
            pairs.push(format('~~: ~~', [args[i - 1], args[i]]));
        }
        return format('{ ~~ }', [pairs.join(', ')]);
    },
    // TODO: make this more flexible ..
    'if': '(~~ ? ~~ : ~~)',
    'cond': function(args, options) {
        return format('(~~ : undefined)', [
            _.map(args, function(pair) {
                return format('~~ ? ~~', _.map(pair, options.compile));
            }).join(' : ')
        ]);
    },
    'while': function(args) {
        return format('while (~~) { ~~; }',
                      [args[0], args.slice(1).join('; ')]);
    },
    'for': function(args) {
        return format('for (~~) { ~~; }',
                      [args.slice(0, 3).join('; '),
                       args.slice(3).join('; ')]);
    },
    'error': 'throw new Error(~~)',
    'attempt': function(args) {
        // TODO: implement this
    },
    '++': '~~++',
    '--': '~~--',
    '+': _.compose(helpers.parens, helpers.joiner(' + ')),
    '-': function(args) {
        if (args.length === 1) {
            return format('(- ~~)', args);
        }
        return format('(~~)', [args.join(' - ')]);
    },
    '*': _.compose(helpers.parens, helpers.joiner(' * ')),
    '/': _.compose(helpers.parens, helpers.joiner(' / ')),
    '^': 'Math.pow(~~, ~~)',
    '%': _.compose(helpers.parens, helpers.joiner(' % ')),
    '<': _.compose(helpers.parens, helpers.and_chainer('<')),
    '>': _.compose(helpers.parens, helpers.and_chainer('>')),
    '<=': _.compose(helpers.parens, helpers.and_chainer('<=')),
    '>=': _.compose(helpers.parens, helpers.and_chainer('>=')),
    '=': _.compose(helpers.parens, helpers.and_chainer('===')),
    // TODO: conform to spec in built-ins.org ??
    'is': function(args) {
        // TODO: implement this
    },
    'not': '(! ~~)',
    'and': _.compose(helpers.parens, helpers.joiner(' && ')),
    'or': _.compose(helpers.parens, helpers.joiner(' || ')),
    // TODO: lift instantiation?
    'def': function(args) {
        return format('var ~~ = ~~', [args[0], args[1]])
    },
    'let': function(args) {
        // TODO: implement this
    },
    '#': function(args, options) {
        var func_args_list = _.map(args[0], function(name) {
            return name.json();
        });
        var splat_assignment = '';
        var m;
        if (m = /^(.*)\.{3}$/.exec(func_args_list.slice(-1)[0])) {
            // splat present
            func_args_list.pop();
            var splat_assignment = format(' var ~~ = [].slice.call(arguments, ~~);',
                                          [m[1], func_args_list.length]);
        }
        var func_args = func_args_list.join(', ');
        // TODO: lift vars?
        var expressions = _.map(args.slice(1, -1), function(exp) {
            return format('~~;', [options.compile(exp)]);
        }).join(' ');
        var final_expression = options.compile(args.slice(-1)[0]);
        return format('(function(~~) {~~ ~~ return ~~; })',
                      [func_args, splat_assignment, expressions, final_expression]);
    },
    'quote': function(args) {
        return args.json();
    },
    'quasiquote': function(args) {
        // TODO: implement this
    },
    'empty?': '(~0~ === null || ~0~.length === 0)'
});

// Specify minimum and maximum arguments for functions
function_map.set_properties('nop', { args: 0 });
function_map.set_properties(['++', '--', 'not', 'quote', 'quasiquote',
                               'error', 'empty?'], { args: 1 });
function_map.set_properties(['^', 'def', 'get'], { args: 2 });
function_map.set_properties('if', { args: 3 });
function_map.set_properties('attempt', { args: [2, 3] }); // ??
function_map.set_properties(['list', 'object'], { args: [0, Infinity] });
function_map.set_properties(['cond', '-'], { args: [1, Infinity] });
function_map.set_properties(['.', 'while', '+', '*', '/', '%', '=', '<',
                               '>', '<=', '>=', 'and', 'or', 'let', '#'],
                              { args: [2, Infinity] });
function_map.set_properties('for', { args: [4, Infinity] });

// Specify some functions as not pre-evaluating all of their arguments
// (i.e. special forms)
function_map.set_properties(['#', 'let', 'quote', 'cond', 'attempt'], { lazy: true });

// Specify synonyms
function_map.set_synonyms('get', ['nth']);
function_map.set_synonyms('error', ['throw']);
function_map.set_synonyms('++', ['inc']);
function_map.set_synonyms('--', ['dec']);
function_map.set_synonyms('+', ['cat']);
function_map.set_synonyms('%', ['mod']);
function_map.set_synonyms('=', ['is', 'eq?']); // TODO: diferenciate these
function_map.set_synonyms('def', ['set']);
function_map.set_synonyms('#', ['lambda', 'function']);

module.exports = function_map;