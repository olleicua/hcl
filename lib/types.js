var _ = require('underscore');
var format = require('hot-cocoa').format;
var mangle = require('./mangle.js');

// wrap the value in an object wrapper that denotes the specified type
module.exports = function(type, value, position) {
    if (type === 'list') {
        var result = [].splice.call(value, 0);
        result.json = function(not_for_compiler) {
            return format('[~~]', [
                _.map(this, function(x) {
                    return x.json(not_for_compiler);
                }).join(', ')
            ]);
        };
    } else {
        var result = { value: value }
        result.json = function(not_for_compiler) {
            if (this.type === 'word' && ! not_for_compiler) {
                return mangle(this.value);
            }
            return this.value;
        };
    }
    result.type = type;
    if (position) {
        result.position = position;
    }
    return result;
}