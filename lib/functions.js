var _ = require('underscore');
var format = require('hot-cocoa').format;
var helpers = require('./helpers.js');
var mangle = require('./mangle.js');

// TODO: add validation for arguments to templates
// for example 'if' with fewer than 3 arguments should be a compile error

module.exports = require('hot-cocoa').template_map({
    'nop': 'undefined',
    '.': helpers.joiner('.'),
    'get': '~~[~~]',
    'list': _.compose(helpers.brackets('[', ']'), helpers.joiner(', ')),
    'object': function(args) {
        pairs = [];
        for (var i = 1; i < args.length; i += 2) {
            pairs.push(format('~~: ~~', [mangle(args[i - 1]), args[i]]));
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
        return format('var ~~ = ~~', [mangle(args[0]), args[1]])
    },
    'let': function(args) {
        // TODO: implement this
    },
    '#': function(args, options) {
        // TODO: implement splats
        var func_args = _.map(args[0], function(name) {
            return mangle(name.json());
        }).join(', ');
        // TODO: lift vars?
        var expressions = _.map(args.slice(1, -1), function(exp) {
            return format('~~;', [options.compile(exp)]);
        }).join(' ');
        var final_expression = options.compile(args.slice(-1)[0]);
        return format('(function(~~) { ~~ return ~~; })',
                      [func_args, expressions, final_expression]);
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
module.exports.set_properties('nop', { args: 0 });
module.exports.set_properties(['++', '--', 'not', 'quote', 'quasiquote',
                               'error', 'empty?'], { args: 1 });
module.exports.set_properties(['^', 'def', 'get'], { args: 2 });
module.exports.set_properties('if', { args: 3 });
module.exports.set_properties('attempt', { args: [2, 3] }); // ??
module.exports.set_properties(['list', 'object'], { args: [0, Infinity] });
module.exports.set_properties(['cond', '-'], { args: [1, Infinity] });
module.exports.set_properties(['.', 'while', '+', '*', '/', '%', '=', '<',
                               '>', '<=', '>=', 'and', 'or', 'let', '#'],
                              { args: [2, Infinity] });
module.exports.set_properties('for', { args: [4, Infinity] });

// Specify some functions as not pre-evaluating all of their arguments
// (i.e. special forms)
module.exports.set_properties(['#', 'let', 'quote', 'cond', 'attempt'], { lazy: true });

// Specify synonyms
module.exports.set_synonyms('get', ['nth']);
module.exports.set_synonyms('error', ['throw']);
module.exports.set_synonyms('++', ['inc']);
module.exports.set_synonyms('--', ['dec']);
module.exports.set_synonyms('+', ['cat']);
module.exports.set_synonyms('%', ['mod']);
module.exports.set_synonyms('=', ['is', 'eq?']); // TODO: diferenciate these
module.exports.set_synonyms('def', ['set']);
module.exports.set_synonyms('#', ['lambda', 'function']);