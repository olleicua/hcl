module.exports = {
  'format': 'function(f,v){var i=0;return f.replace(/~([a-zA-Z0-9_]*)~/g,function(_,k){if(k===\'\'){k=i;i++;}if(v[k]===undefined){return\'\';}return v[k];})}',
  'cat': 'function(){return [].join.call(arguments, "");}',
  '_plus_': 'function(){var r=0;for(var i=0;i<arguments.length;i++){r+=arguments[i];}return r;}',
  '_plus_1': 'function(x){return x+1;}',
  '_hyphen_': 'function(x,y){return x-y;}',
  '_hyphen__hyphen_1': 'function(x){return x-1;}',
  '_asterisk_': 'function(){var r=1;for(var i=0;i<arguments.length;i++){r*=arguments[i];}return r;}',
  '_asterisk_2': 'function(x){return x*2;}',
  '_slash_': 'function(x,y){return x/y;}',
  '_slash_2': 'function(x){return x/2;}',
  '_caret_': 'Math.pow',
  '_caret_2': 'function(x){return x*x;}',
};