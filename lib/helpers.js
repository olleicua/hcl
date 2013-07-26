var _ = require('underscore');
var format = require('hot-cocoa').format;

module.exports = {
  joiner: function(delimeter) {
    return function(args) {
      return args.join(delimeter);
    };
  },
  and_chainer: function(delimeter) {
    return function(args) {
      
      return _.map(
        _.zip(args.slice(0, -1), args.slice(1)),
        function(pair) {
          return format('(~~ ~~ ~~)', [pair[0], delimeter, pair[1]]);
        }
      ).join(' && ');
    }
  },
  or_chainer: function(delimeter) {
    return function(args) {
      
      return _.map(
        _.zip(args.slice(0, -1), args.slice(1)),
        function(pair) {
          return format('(~~ ~~ ~~)', [pair[0], delimeter, pair[1]]);
        }
      ).join(' || ');
    }
  },
  brackets: function(open, close) {
    return function(string) {
      return format('~~~~~~', [open, string, close]);
    };
  },
  parens: function(string) {
    return format('(~~)', [string]);
  },
  set: function(operator, require_mutable) {
    return function(args) {
      if (args.length === 2) {
        require_mutable(args[0]);
        return format('(~~ ~~= ~~)', [args[0], operator, args[1]]);
      }
      return format('(~~[~~] ~~= ~~)', [args[0], args[1], operator, args[2]]);
    }
  },
  block: function(statements) {
    return format('(function() { ~~ return ~~; }).call(this)', [
      _.map(statements.slice(0, -1), function(x) { return x + ';'; }).join(' '),
      statements.slice(-1)[0]
    ]);
  }
};
