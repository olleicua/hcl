var _ = require('underscore');
var format = require('hot-cocoa').format;
var helpers = require('./helpers.js');
var file2js = require('../lib/file2js.js');
var mangle = require('./mangle.js');

// check whether the specified identifier is a built-in function and throw an
// error if it is
var require_mutable = function(identifier) {
  if (function_map.contains(identifier) ||
      _.map(_.keys(function_map.map), mangle).indexOf(identifier) !== -1) {
    throw new Error(format('The builtin function `~~` can\'t be redefined',
                           [identifier]));
  }
};

// implementations of builtin functions go here:
var function_map = require('hot-cocoa').template_map({
  'nop': 'undefined',
  '.': function(args, options) {
    return format('~~~~', [
      options.compile(args[0]),
      _.map(args.slice(1), function(key) {
        return '["' + key.value + '"]';
      }).join('')
    ]);
  },
  'get': '~~[~~]',
  'first': '~~[0]',
  'second': '~~[1]',
  'last': '~0~[~0~.length - 1]',
  'initial': '[].slice.call(~0~, 0, ~0~.length - 1)',
  'rest': '[].slice.call(~~, 1)',
  'cons': '[~~].concat(~~)',
  'list': _.compose(helpers.brackets('[', ']'), helpers.joiner(', ')),
  'object': function(args, options) {
    var pairs = [];
    for (var i = 1; i < args.length; i += 2) {
      pairs.push(format('~~: ~~', [
        args[i - 1].type === 'identifier' ?
          '"' + args[i - 1].value + '"' :
          args[i - 1].value,
        options.compile(args[i])
      ]));
    }
    return format('{ ~~ }', [pairs.join(', ')]);
  },
  'inherit': 'Object.create(~~)',
  'begin': function(args) {
    return format('(function() { ~~ return ~~; }).call(this)', [
      _.map(args.slice(0, -1), function(x) { return x + ';'; }).join(' '),
      args.slice(-1)[0]
    ]);
  },
  'if': '(~~ ? ~~ : ~~)',
  'when': function(args) {
    return format('(~~ && (function() { ~~ return ~~; }).call(this))', [
      args[0],
      _.map(args.slice(1, -1), function(x) { return x + ';'; }).join(' '),
      args.slice(-1)[0]
    ]);
  },
  'cond': function(args, options) {
    return format('(~~ : undefined)', [
      _.map(args, function(pair) {
        return format('~~ ? ~~', _.map(pair, function(ast) {
          return options.compile(ast);
        }));
      }).join(' : ')
    ]);
  },
  'while': function(args) {
    return format('(function() {while (~~) { ~~; }}).call(this)', [
      args[0], args.slice(1).join('; ')
    ]);
  },
  'for': function(args, options) {
    var iterator_init = '';
    var loop_init_args = _.map(args[0], function(ast) {
      return options.compile(ast);
    });
    if (args[0].length === 3) {
      var loop_init = loop_init_args.join('; ');
    } else if (args[0].length === 2) {
      require_mutable(loop_init_args[0]);
      var dummy_iterator = format('_i~~_', [options.context.dummy_iterator]);
      options.context.dummy_iterator++;
      options.context.add_to_scope(dummy_iterator);
      options.context.add_to_scope(loop_init_args[0]);
      var loop_init = format('~0~ = 0; ~0~ < ~1~.length; ~0~++',
                             [dummy_iterator, loop_init_args[1]]);
      iterator_init = format('var ~0~ = ~1~[~2~];',
                             [loop_init_args[0], loop_init_args[1], dummy_iterator]);
    } else {
      throw new Error('Invalid loop initialization for `for`');
    }
    return format('(function() {for (~~) { ~~ ~~; }}).call(this)', [
      loop_init,
      iterator_init,
      _.map(args.slice(1), function(x) {
        return options.compile(x);
      }).join('; ')
    ]);
  },
  'times': function(args, options) {
    require_mutable(options.compile(args[0]));
    options.context.add_to_scope(options.compile(args[0][0]));
    return format('(function() {for (~~) { ~~; }}).call(this)', [
      format('~0~ = 0; ~0~ < ~1~; ~0~++', _.map(args[0], function(ast) {
        return options.compile(ast);
      })),
      _.map(args.slice(1), function(ast) {
        return options.compile(ast);
      }).join('; ')
    ]);
  },
  'error': '(function() {throw new Error(~~);}).call(this)',
  'attempt': function(args, options) {
    
    var try_block, catch_block, finally_block;
    if (args[0][0].value !== 'try') {
      throw new Error('`attempt` must begin with a `try` block');
    }
    if (['catch', 'finally'].indexOf(args[1][0].value) === -1) {
      throw new Error('`attempt` must have a `catch` or `finally` block');
    }
    
    if (args[1][0].value === 'catch') {
      // there is a catch block
      require_mutable(options.compile(args[1][1]));
      catch_block = format('catch (~~) { ~~ }', [
        options.compile(args[1][1]),
        _.map(args[1].slice(2), function(exp) {
          return format('~~;', [options.compile(exp)]);
        }).join(' ')
      ]);
      if (args.length === 3) {
        if (args[2][0].value === 'finally') {
          // there is a finally block after the catch block
          finally_block = format('finally { ~~ }', [
            _.map(args[2].slice(1), function(exp) {
              return format('~~;', [options.compile(exp)]);
            }).join(' ')
          ]);
        } else {
          throw new Error('third block of `attempt` must be `finally` block');
        }
      } 
      
    } else {
      // there is a finally block and no catch block
      finally_block = format('finally { ~~ }', [
        _.map(args[1].slice(1), function(exp) {
          return format('~~;', [options.compile(exp)]);
        }).join(' ')
      ]);
      if (args.length === 3) {
        throw new Error('third block of `attempt` must be `finally` block');
      }
    }
    try_block = format('try { ~~ }', [
      _.map(args[0].slice(1), function(exp) {
        return format('~~;', [options.compile(exp)]);
      }).join(' ')
    ]);
    return format('(function() {~~ ~~ ~~}).call(this)', [try_block, catch_block, finally_block]);
  },
  'random-float': 'Math.random()',
  'random-integer': 'parseInt(Math.random() * ~~)',
  '+': _.compose(helpers.parens, helpers.joiner(' + ')),
  '+1': '(~~ + 1)',
  '-': function(args) {
    if (args.length === 1) {
      return format('(- ~~)', args);
    }
    return format('(~~)', [args.join(' - ')]);
  },
  '--1': '(~~ - 1)',
  '*': _.compose(helpers.parens, helpers.joiner(' * ')),
  '*2': '(~~ * 2)',
  '/': _.compose(helpers.parens, helpers.joiner(' / ')),
  '/2': '(~~ / 2)',
  '^': 'Math.pow(~~, ~~)',
  '^2': '(~0~ * ~0~)',
  'sqrt': 'Math.sqrt(~~)',
  '%': _.compose(helpers.parens, helpers.joiner(' % ')),
  '<': _.compose(helpers.parens, helpers.and_chainer('<')),
  '>': _.compose(helpers.parens, helpers.and_chainer('>')),
  '<=': _.compose(helpers.parens, helpers.and_chainer('<=')),
  '>=': _.compose(helpers.parens, helpers.and_chainer('>=')),
  '=': _.compose(helpers.parens, helpers.and_chainer('===')),
  '!=': _.compose(helpers.parens, helpers.or_chainer('!==')),
  '=0': '(~~ === 0)',
  '>0': '(~~ > 0)',
  '<0': '(~~ < 0)',
  '>=0': '(~~ >= 0)',
  '<=0': '(~~ <= 0)',
  '&': '(~~ & ~~)',
  '|': '(~~ | ~~)',
  'bit-xor': '(~~ ^ ~~)',
  '<<': '(~~ << ~~)',
  '>>': '(~~ >> ~~)',
  'not': '(! ~~)',
  'and': _.compose(helpers.parens, helpers.joiner(' && ')),
  'or': _.compose(helpers.parens, helpers.joiner(' || ')),
  'xor': '((~0~ || ~1~) && (! (~0~ && ~1~)))',
  'def': function(args, options) {
    require_mutable(args[0]);
    options.context.add_to_scope(args[0]);
    if (args.length === 2) {
      return format('~~ = ~~', args);
    }
    return 'undefined';
  },
  'set': helpers.set('', require_mutable),
  'set+': helpers.set('+', require_mutable),
  'set-': helpers.set('-', require_mutable),
  'set*': helpers.set('*', require_mutable),
  'set/': helpers.set('/', require_mutable),
  'set%': helpers.set('%', require_mutable),
  'set<<': helpers.set('<<', require_mutable),
  'set>>': helpers.set('>>', require_mutable),
  'set&': helpers.set('&', require_mutable),
  'set|': helpers.set('|', require_mutable),
  '++': '~~++',
  '--': '~~--',
  'let': function(args, options) {
    var keys = [];
    var values = [];
    for (var i = 1; i < args[0].length; i += 2) {
      keys.push(options.compile(args[0][i - 1]));
      require_mutable(options.compile(args[0][i - 1]));
      values.push(format(', ~~', [options.compile(args[0][i])]));
    }
    var expressions = _.map(args.slice(1, -1), function(exp) {
      return format('~~;', [options.compile(exp)]);
    }).join(' ');
    var final_expression = options.compile(args.slice(-1)[0]);
    return format('(function(~~) {~~ return ~~; }).call(this~~)',
                  [keys.join(', '), expressions, final_expression,
           values.join('')]);
  },
  '#': function(args, options) {
    // anonomous name
    var name = '';
    if (args[0].type == 'identifier') {
      name = options.compile(args.shift())
    }
    
    // sub scope
    var vars_in_scope = [];
    var vars_declarations = [];
    var context = _.extend({}, options.context, {
      add_to_scope: function(name, value) {
        if (vars_in_scope.indexOf(name) == -1) {
          vars_in_scope.push(name);
          if (typeof(value) === 'string') {
            vars_declarations.push(format('~~ = ~~', [name, value]));
          } else {
            vars_declarations.push(name);
          }
        }
      }
    });
    
    // argument list
    var func_args_list = _.map(args[0], function(name) {
      require_mutable(name.json());
      return name.json();
    });
    
    // splats
    var splat_assignment = '';
    var m;
    if (m = /^(.*)\.{3}$/.exec(func_args_list.slice(-1)[0])) {
      // the argument list ends in a splat
      func_args_list.pop();
      context.add_to_scope(m[1], format('[].slice.call(arguments, ~~)',
                                        [func_args_list.length]));
    }
    
    var func_args = func_args_list.join(', ');
    
    var expressions = _.map(args.slice(1, -1), function(exp) {
      return format('~~;', [options.compile(exp, context)]);
    }).join(' ');
    var final_expression = options.compile(args.slice(-1)[0], context);
    
    // initialize vars
    var vars_init = (vars_in_scope.length > 0
                     ? format('var ~~;', [vars_declarations.join(', ')])
                     : '');
    
    return format('(function ~~(~~) {~~ ~~ return ~~; })',
                  [name, func_args, vars_init, expressions, final_expression]);
  },
  'nil?': '(~0~ === null || ~0~ === undefined)',
  'boolean?': '(typeof(~~) === "boolean")',
  'number?': '(typeof(~0~) === "number" && (! isNaN(~0~)))',
  'string?': '(typeof(~~) === "string")',
  'list?': '(Object.prototype.toString.call(~~) === "[object Array]")',
  'object?': '(Object.prototype.toString.call(~~) === "[object Object]")',
  're?': '(Object.prototype.toString.call(~~) === "[object RegExp]")',
  'function?': '(typeof(~~) === "function")',
  'empty?': '(~0~ === null || (~0~).length === 0)',
  'integer?': '(typeof(~0~) === "number" && ~0~ % 1 === 0)',
  'even?': '(~~ % 2 === 0)',
  'odd?': '(~~ % 2 === 1)',
  'contains?': '(~~.indexOf(~~) !== -1)',
  // should this be a builtin??
  'type': '(function(_value_, _signature_) { return ((_signature_ === "[object Array]") ? "array" : (_signature_ === "[object RegExp]") ? "regex" : (_value_ === null) ? "null" : (_value_ !== _value_) ? "nan" : typeof(_value_)); }).call(this, ~0~, Object.prototype.toString.call(~0~))',
  'string': '(~~).toString()',
  'number': 'parseFloat(~~)',
  'integer': 'Math.floor(parseFloat(~~))',
  're': function(args) {
    return format('(new RegExp(~~, ~~))', [
      args[0].replace(/\\/g, "\\\\"),
      args[1] || '""'
    ]);
  },
  'replace': '~~.replace(~~, ~~)',
  'size': '~~.length',
  'compile': function(args, options) {
    if (! args[0].match(/^".*"$/)) {
      throw new Error(format('Invalid argument for compile: `~~`',
                             args));
    }
    file2js(options.context.path + JSON.parse(args[0]));
    return args[0].replace(/\.hcl(['"])$/, '.js$1');
  },
  'from-js': function(args) {
    if (/^[_$a-zA-Z][_$a-zA-Z0-9]*$/.exec(args[0].value) === null) {
      throw new Error(format('`~~` is not a valid JavaScript identifier',
                             [args[0].value]));
    }
    return args[0].value;
  },
  'require': function(args, options) {
    if (options.context.repl_mode) {
      return format('require(~0~.match(/^\\.\\//) ? require(\'path\').resolve(~0~) : ~0~)', args);
    }
    return format('require(~~)', args);
  }
});

// Specify minimum and maximum arguments for functions
function_map.set_properties(['nop', 'random-float'], { args: 0 });
function_map.set_properties(['++', '--', 'not', 'error', 'inherit', 'empty?',
                             'even?', 'odd?', 'nil?', 'boolean?', 'number?',
                             'string?', 'list?', 'object?', 'function?', 'random-integer',
                             'integer?', '+1', '--1', '*2', '/2', '^2', 'sqrt',
                             'string', 'number', 'integer', 'size', '=0', '>0',
                             '<0', '>=0', '<=0', 'compile', 'type', 'from-js',
                             'require', 'first', 'second', 'last', 'initial', 'rest'], { args: 1 });
function_map.set_properties(['^', 'get', 'contains?', '&', '|', '>>', '<<',
                             'xor', 'bit-xor', 'cons'], { args: 2 });
function_map.set_properties(['if', 'replace'], { args: 3 });
function_map.set_properties(['re', 'def'], { args: [1, 2] });
function_map.set_properties(['attempt', 'set', 'set+', 'set-', 'set*', 'set/',
                             'set%', 'set<<', 'set>>', 'set|', 'set&'], { args: [2, 3] });
function_map.set_properties(['list', 'object'], { args: [0, Infinity] });
function_map.set_properties(['cond', '-', 'begin'], { args: [1, Infinity] });
function_map.set_properties(['.', 'while', '+', '*', '/', '%', '=', '!=', '<',
                             '>', '<=', '>=', 'and', 'or', 'let', '#', 'for',
                             'times', 'when'], { args: [2, Infinity] });

// Specify some functions as not pre-evaluating all of their arguments
// (i.e. special forms)
function_map.set_properties(['.', 'object', '#', 'let', 'cond', 'for', 'times',
                             'attempt', 'from-js'], { lazy: true });

// Specify synonyms
function_map.set_synonyms('require', ['load']);
function_map.set_synonyms('get', ['nth']);
function_map.set_synonyms('error', ['throw']);
function_map.set_synonyms('and', ['and?', '&&']);
function_map.set_synonyms('or', ['or?', '||']);
function_map.set_synonyms('not', ['not?', '!']);
function_map.set_synonyms('++', ['inc']);
function_map.set_synonyms('--', ['dec']);
function_map.set_synonyms('+', ['cat']);
function_map.set_synonyms('*2', ['double']);
function_map.set_synonyms('/2', ['half']);
function_map.set_synonyms('^2', ['square']);
function_map.set_synonyms('%', ['mod']);
function_map.set_synonyms('=', ['is', 'is?', 'eq', 'eq?', 'equal', 'equal?',
                                'equals', 'equals?']);
function_map.set_synonyms('!=', ['isnt', 'isnt?', 'neq', 'neq?']);
function_map.set_synonyms('=0', ['zero?']);
function_map.set_synonyms('>0', ['positive?']);
function_map.set_synonyms('<0', ['negative?']);
function_map.set_synonyms('>=0', ['non-negative?']);
function_map.set_synonyms('<=0', ['non-positive?']);
function_map.set_synonyms('<', ['lt?']);
function_map.set_synonyms('>', ['gt?']);
function_map.set_synonyms('<=', ['lte?']);
function_map.set_synonyms('>=', ['gte?']);
function_map.set_synonyms('&', ['bit-and']);
function_map.set_synonyms('|', ['bit-or']);
function_map.set_synonyms('<<', ['bit-shift-left']);
function_map.set_synonyms('>>', ['bit-shift-right']);
function_map.set_synonyms('def', ['var']);
function_map.set_synonyms('#', ['lambda', 'function']);
function_map.set_synonyms('function?', ['lambda?', '#?']);
function_map.set_synonyms('list', ['array']);
function_map.set_synonyms('list?', ['array?']);
function_map.set_synonyms('re', ['regex', 'regexp']);
function_map.set_synonyms('re?', ['regex?', 'regexp?']);
function_map.set_synonyms('size', ['length', 'count']);
function_map.set_synonyms('type', ['typeof']);
function_map.set_synonyms('inherit', ['new']);
function_map.set_synonyms('first', ['car']);
function_map.set_synonyms('rest', ['cdr']);
function_map.set_synonyms('second', ['cadr']);

module.exports = function_map;