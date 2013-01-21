var _ = require('underscore');
var format = require('hot-cocoa').format;
var types = require('./types.js');
var functions = require('./functions.js');

var annotation = function(ast) {
	// TODO: implement this
	return 'annotations coming..'
};

var validate_args = function(number, range) {
	if (typeof(range) === 'number') {
		if (number !== range) {
			throw new Error(format('Wrong number of arguments: ~~ for ~~',
								   [number, range]));
		}
	} else {
		if (range[0] > number || range[1] < number) {
			throw new Error(format('Wrong number of arguments: ~~ for ~~-~~',
								   [number, range[0], range[1]]));
		}
	}
};

var compile = function(ast) {
	if (ast.type === 'list') {
		var function_reference = compile(ast[0]);
		var is_lazy = functions.contains(function_reference) &&
			functions.map[function_reference].lazy;
		var args = _.map(ast.slice(1), function(x) {
			return is_lazy ? x : compile(x);
		});
		var format_options = {
			compile: (is_lazy ? compile : _.identity)
		};
		if (functions.contains(function_reference)) { // built-in function
			validate_args(args.length, functions.map[function_reference].args);
			return functions.format(function_reference, types('list', args),
									format_options);
		}
		// defined function call
		return format('~~(~~)', [function_reference, args]);
	}
	return ast.value;
};

// takes a list of asts and conversts them to Javacscript code
module.exports = function(asts) {
	var result = '// compiled from Hot Cocoa Lisp';
	for (var i = 0; i < asts.length; i++) {
		var ast = asts[i];
		result += format('\n\n~annotation~\n\n~code~;', {
			'annotation': annotation(ast),
			'code': compile(ast)
		});
	}
	return result;
}