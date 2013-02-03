var _ = require('underscore');
var format = require('hot-cocoa').format;
var mangle = require('./mangle.js');

// wrap the value in an object wrapper that denotes the specified type
module.exports = function(type, value, position) {
    if (type === 'list') {
        var result = [].splice.call(value, 0);
        result.json = function() {
            return format('[~~]', [
                _.map(this, function(x) {
                    return x.json();
                }).join(', ')
            ]);
        };
    } else {
        var result = { value: value }
        result.json = function() {
            if (this.type === 'word') {
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