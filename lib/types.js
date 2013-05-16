var _ = require('underscore');
var format = require('hot-cocoa').format;
var mangle = require('./mangle.js');

// wrap the value in an object wrapper that denotes the specified type
module.exports = function(type, value, position) {
  
  if (type === 'list') {
  
    // ast is a list
    var result = [].slice.call(value, 0);
    result.json = function(not_for_compiler) {
      return format('[~~]', [
        _.map(this, function(x) {
          return x.json(not_for_compiler);
        }).join(', ')
      ]);
    };
        
  } else {
    
    // ast is not a list
    var result = { value: value }
    result.json = function(not_for_compiler) {
      
      // mangle identifiers
      if (this.type === 'identifier' && ! not_for_compiler) {
        return mangle(this.value);
      }
      
      // wrap fractions
      if (this.type === 'number' && /\//.exec(this.value)) {
        return '(' + this.value + ')';
      }
      return this.value;
    };
    
  }
  
  // set ast type and position
  result.type = type;
  if (position) {
    result.position = position;
  }
  return result;
}