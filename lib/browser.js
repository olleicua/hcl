var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var format = require('hot-cocoa').format;
var helpers = require('./helpers.js');
var file2js = require('../lib/file2js.js');
var mangle = require('./mangle.js');

var function_map = require('hot-cocoa').template_map({
  'inherit': '(typeof(Object.create) === "function" ? Object.create(~0~) : (function(_obj_) { var F = function() {}; F.prototype = _obj_; return new F(); })(~0~))',
  'require': function(args, options) {
    return format('(function() { var module = { exports: { } }; ~~ return module.exports; }).call(this)', [
      fs.readFileSync(path.normalize(options.context.path +
                                     JSON.parse(args[0]))).toString()
    ]);
  }
});

// Specify minimum and maximum arguments for functions
function_map.set_properties(['require', 'inherit'], { args: 1 });

// Specify some functions as not pre-evaluating all of their arguments
// (i.e. special forms)
function_map.set_synonyms('inherit', ['new']);

// Specify synonyms

module.exports = function_map;