/* 
 * 
 * Sam Auciello | September 2012
 * http://opensource.org/licenses/mit-license.php
 */

var scan = require('hot-cocoa').scan;
var parse = require('hot-cocoa').parse;
var analyzer = require('hot-cocoa').analyze;

var tokenTypes = require('./tokenTypes.js');
var startNode = '_program';
var parseGrammar = require('./parseGrammar.json');
var attributeGrammar = require('./attributeGrammar.js');

exports.scan = function(text) {
    var tokens = scan(tokenTypes, text);
    return tokens;
};
exports.parse = function(tokens, algorithm) {
    return parse(tokens, parseGrammar, startNode, algorithm);
};
exports.analyze = function(tree) {
    return attributeGrammar.apply(tree);
};
