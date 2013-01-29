// compiled from Hot Cocoa Lisp

// annotations coming..

var _ = require("underscore");

// annotations coming..

var divisible = (function(n, m) {  return ((0 === (n % m))); });

// annotations coming..

var evaluated_if = (function(condition, yes, no) {  return (condition(yes,no) ? yes : no); });

// annotations coming..

var fizzbuzz = (function(n) { console.log(evaluated_if((function(number, words) {  return (words === null || words.length === 0); }),n,_.reduce(_.map([[3, "Fizz"], [5, "Buzz"]],(function(pair) {  return (divisible(n,pair[0]) ? pair[1] : ""); })),(function(a, b) {  return (a + b); }),""))); return (((n < 100)) && fizzbuzz((1 + n))); });

// annotations coming..

fizzbuzz(1);