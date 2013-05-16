var _ = require('underscore');
var format = require('hot-cocoa').format;
var types = require('./types.js');
var builtins = require('./builtins.js');
var args = require('../lib/args.js');
var fs = require('fs');
var UglifyJS = require("uglify-js");

// load built-in functions
var functions = require('./functions.js');
if (args.b) {
  _.extend(functions.map, require('./browser.js').map);
}

// generate the annotations for the ast at the specified index
var annotation = function(source, asts, index) {
  return source.slice((index > 0) ? asts[index - 1].end : 0, asts[index].end)
    .replace(/^\s*\n/mg, '').replace(/\n\s*$/mg, '').replace(/^/mg, '// ');
};

// validate the arguments of a built in function call
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

// generate a javascript expression that evaluates to the function to be called
var get_function_reference = function(ast, context) {
  if (ast[0].type === 'identifier' && functions.contains(ast[0].value)) {
    return ast[0].json();
  }
  return compile(ast[0], context);
}

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
    
    // prepare the function call
    var function_reference = get_function_reference(ast, context);
    var unmangled_function_refernece = ast[0].value;
    var is_lazy = functions.contains(unmangled_function_refernece) &&
      functions.map[unmangled_function_refernece].lazy;
    var args = _.map(ast.slice(1), function(x) {
      return is_lazy ? x : compile(x, context);
    });
    var format_options = {
      compile: function(x, new_context) {
        // allow a new context to be specified or use the outer one through
        // the closure
        if (new_context === undefined) {
          return compile(x, context);
        }
        return compile(x, new_context);
      },
      context: context
    };
    
    // built-in function
    if (functions.contains(unmangled_function_refernece)) {
      validate_args(args.length, functions.map[unmangled_function_refernece].args,
                    unmangled_function_refernece, ast.position);
      return functions.format(unmangled_function_refernece, types('list', args),
                              format_options);
    }
    
    // user defined function call
    return format('~~(~~)', [function_reference, args.join(', ')]);
  }
  if (ast.type === 'identifier') {
    if (builtins[ast.value] !== undefined) {
      context.add_to_outer_scope(ast.json(), builtins[ast.value]);
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
  
  // context
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
      'annotation': (! context.omit_annotations) ?
        annotation(source, asts, i) :
        '',
      'code': compile(ast, context)
    });
  }
  
  // underscore
  var underscore = '';
  if (args.u && ! context.repl_mode) {
    if (! context.omit_annotations) {
      underscore += '// Underscore.js\n'
    }
    underscore += fs.readFileSync(
      require('path').dirname(process.mainModule.filename) +
        '/../etc/underscore.js'
    ).toString();
    underscore += 'var _a_ = Object.keys(_); for (var _b_ = 0; _b_ < _a_.leng' +
      'th; _b_++) { if (global[_a_[_b_]] === undefined) { global[_a_[_b_]] = ' +
      '_[_a_[_b_]]; } }';
  }

  // add trailing comments
  if ((! context.omit_annotations) &&
      source.slice(asts[asts.length - 1].end).trim() !== '') {
    result += '\n\n' + source.slice(asts[asts.length - 1].end)
      .replace(/^\n/mg, '').replace(/\n$/mg, '').replace(/^/mg, '// ');
  }
  
  // add header
  var header = (! context.omit_annotations) ?
    '// compiled from Hot Cocoa Lisp' : '';
  if (vars_in_scope.length > 0) {
    var format_string = args.b ?
      '(function() {\n\n~~\n\n~~var ~~;~~\n\n}).call(this);' :
      '~~\n\n~~var ~~;~~';
    result = format(format_string, [
      header,
      underscore,
      vars_declarations.join(', '),
      result
    ]);
  } else {
    result = format('~~~~~~', [header, underscore, result]);
  }
  
  // check for -m flag
  if (args.m) {
    result = format('~~\n~~', [
      header,
      UglifyJS.minify(result, {fromString: true}).code
    ]);
  }
  
  return result;
}
