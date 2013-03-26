var _ = require('underscore');
var format = require('hot-cocoa').format;
var types = require('./types.js');
var functions = require('./functions.js');
var builtins = require('./builtins.js');

var statement_index = function(source, index) {
  var start = 0;
  var nest_level = 0;
  var current_group = -1;
  for (var i = 0; i < source.length; i++) {
    if (source[i] === '(') {
      nest_level++;
    }
    if (source[i] === ')') {
      nest_level--;
      if (nest_level === 0) {
        current_group++;
        i += /.*$/m.exec(source.slice(i))[0].length;
        if (current_group === index) {
          return source.slice(start, i);
        }
        start = i + 1;
      }
    }
  }
  return '';
};

// FIXME: account for comments??

var annotation = function(source, index) {
  return statement_index(source, index).replace(/^\n/mg, "").replace(/^/mg, '// ');
};

var validate_args = function(number, range, function_name, position) {
  if (range === undefined) {
    throw new Error(format(
      'No argument range specified for `~~` at position ~~',
      [function_name, position]
    ));
  }
  if (typeof(range) === 'number') {
    if (number !== range) {
      throw new Error(format(
        'Wrong number of arguments for `~~`: ~~ for ~~ at position ~~',
        [function_name, number, range, position]
      ));
    }
  } else {
    if (range[0] > number || range[1] < number) {
      throw new Error(format(
        'Wrong number of arguments for `~~`: ~~ for ~~-~~ at position ~~',
        [function_name, number, range[0], range[1], position]
      ));
    }
  }
};

// Compile takes an abstract syntax tree and a context object.  It returns
// JavaScript code.
// The context object contains the following properties:
//   path: The directory that the current .hcl source file is in.
//   dummy_iterator: The number of dummy iterators created, initially 0.
//   add_to_scope: A function which takes one or two arguments.  The first is
//     the name of a variable to be initialized in the current scope, the second
//     is a string of javascript code to determine the initial value of the
//     variable.
var compile = function(ast, context) {
  
  // TODO: more cleaning up of this function
  
  if (ast.type === 'list') {
    
    // validation
    if (ast[0] === undefined) {
      return 'null';
    }
    if (ast[0].type !== 'identifier' && ast[0].type !== 'list') {
      throw new Error(
        format('Cannot call object of type `~~`: `~~` at position ~~',
               [ast[0].type, ast[0].json(), ast[0].position]));
    }

    if (ast[0].type === 'identifier' && functions.contains(ast[0].value)) {
      var function_reference = ast[0].json();
    } else {
      var function_reference = compile(ast[0], context);
    }
    var unmangled_function_refernece = ast[0].value;
    var is_lazy = functions.contains(unmangled_function_refernece) &&
      functions.map[unmangled_function_refernece].lazy;
    var args = _.map(ast.slice(1), function(x) {
      return is_lazy ? x : compile(x, context);
    });
    var format_options = {
      compile: function(x, new_context) {
        if (new_context === undefined) {
          return compile(x, context);
        }
        return compile(x, new_context);
      },
      context: context
    };
    if (functions.contains(unmangled_function_refernece)) { // built-in function
      validate_args(args.length, functions.map[unmangled_function_refernece].args,
                    unmangled_function_refernece, ast.position);
      return functions.format(unmangled_function_refernece, types('list', args),
                              format_options);
    }
    // defined function call
    return format('~~(~~)', [function_reference, args.join(', ')]);
  }
  if (ast.type === 'identifier') {
    if (builtins[ast.json()] !== undefined) {
      context.add_to_outer_scope(ast.json(), builtins[ast.json()]);
    }
  }
  return ast.json();
};

// takes a list of asts and conversts them to Javacscript code
module.exports = function(asts, source, path, overwrite_context) {
  source = source || '';
  var result = '';
  var vars_in_scope = [];
  var vars_declarations = [];
  var context = {
    path: path,
    dummy_iterator: 0,
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
  };
  context.add_to_outer_scope = context.add_to_scope;
  _.extend(context, overwrite_context);
  for (var i = 0; i < asts.length; i++) {
    var ast = asts[i];
    result += format('\n\n~annotation~\n\n~code~;', {
      'annotation': annotation(source, i),
      'code': compile(ast, context)
    });
  }
  
  // add header
  if (vars_in_scope.length > 0) {
    result = format('// compiled from Hot Cocoa Lisp\n\nvar ~~;~~', [
      vars_declarations.join(', '),
      result
    ]);
  } else {
    result = format('// compiled from Hot Cocoa Lisp~~', [result]);
  }
  
  return result;
}
