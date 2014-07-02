var _ = require('underscore');

var gcd = function(a, b) {
  if (a === b) return a;
  if (b === 0) return a;
  if (a === 0) return b;
  if (a > b) return gcd(b, a % b);
  return gcd(a, b % a);
};

var repeatToLength = function(string, length) {
  var i, res = '';
  for (i = 0; i < length; i++) {
    res += string[i % string.length];
  }
  return res;
};

var detectRepeat = function(string) {
  // TODO: refactor
  var i, sub, trunc_end, trunc_beg;
  if (string.length < 10) return false;
  for (i = 1; i <= string.length / 2; i++) {
    sub = string.slice(0, i);
    if (repeatToLength(sub, string.length) === string) {
      return {
        num: sub,
        length: sub.length
      };
    }
  }
  if (trunc_end = detectRepeat(string.slice(0, -1))) return trunc_end;
  if (trunc_beg = detectRepeat(string.slice(1))) {
    return {
      num: trunc_beg.num,
      length: trunc_beg.length,
      offset: trunc_beg.offset ? string[0] + trunc_beg.offset : string[0],
      offsetLength: trunc_beg.offsetLength ? trunc_beg.offsetLength + 1 : 1
    };
  }
  return false;
};

module.exports = {
  num2frac: function(n) {
    // TODO: refactor
    var m, wholePart, decimalPartStr, decimalPart, denominator, repeat;
    if (m = /^(\d+)\.(\d+)$/.exec(n.toString())) {
      wholePart = parseFloat(m[1]);
      decimalPartStr = m[2];
      if (repeat = detectRepeat(decimalPartStr)) {
        decimalPart = parseFloat(repeat.num);
        denominator = Math.pow(10, repeat.length) - 1;
        console.log(repeat,wholePart,{
            numerator: (wholePart * Math.pow(10, repeat.offsetLength)) + parseFloat(repeat.offset),
            denominator: Math.pow(10, repeat.offsetLength)
          }, {
            numerator: decimalPart,
            denominator: denominator * Math.pow(10, repeat.offsetLength)
          });
        if (repeat.offset) {
          return this.add({
            numerator: (wholePart * Math.pow(10, repeat.offsetLength)) + parseFloat(repeat.offset),
            denominator: Math.pow(10, repeat.offsetLength)
          }, {
            numerator: decimalPart,
            denominator: denominator * Math.pow(10, repeat.offsetLength)
          });
        }
      } else {
        decimalPart = parseFloat(m[2]);
        denominator = Math.pow(10, decimalPartStr.length);
      }
      return {
        numerator: (wholePart * denominator) + decimalPart,
        denominator: denominator
      }
    }
    return {
      numerator: n,
      denominator: 1
    }
  },
  add: function(frac1, frac2) {
    return {
      numerator: (frac1.numerator * frac2.denominator) + (frac2.numerator * frac1.denominator),
      denominator: frac1.denominator * frac2.denominator
    }
  },
  reduce: function(frac) {
    var div, res = _.extend({}, frac);
    while ((div = gcd(res.denominator, res.numerator)) > 1) {
      res.numerator /= div;
      res.denominator /= div;
    }
    return res;
  },
  frac2string: function(frac) {
    return frac.numerator + '/' + frac.denominator;
  },
  toFrac: function(n) {
    return this.frac2string(this.reduce(this.num2frac(n)));
  }
};
