module.exports = {
  'format': 'function(f,v){var i=0;return f.replace(/~([a-zA-Z0-9_]*)~/g,function(_,k){if(k===\'\'){k=i;i++;}if(v[k]===undefined){return\'\';}return v[k];})}',
  'nop': 'function(){}',
  'get': 'function(a,b){return a[b];}',
  'inherit': 'Object.create(x)',
  'if': 'function(a,b,c){return a?b:c;}',
  'random-float': 'function(x){return Math.random();}',
  'random-integer': 'function(x){return parseInt(Math.random()*x);}',
  '+': 'function(x,y){return x+y;}',
  '+1': 'function(x){return x+1;}',
  '-': 'function(x,y){return x-y;}',
  '--1': 'function(x){return x-1;}',
  '*': 'function(x,y){return x*y;}',
  '*2': 'function(x){return x*2;}',
  '/': 'function(x,y){return x/y;}',
  '/2': 'function(x){return x/2;}',
  '^': 'Math.pow',
  '^2': 'function(x){return x*x;}',
  'sqrt': 'Math.sqrt',
  '%': 'function(x,y){return x%y;}',
  '<': 'function(x,y){return x<y;}',
  '>': 'function(x,y){return x>y;}',
  '<=': 'function(x,y){return x<=y;}', 
  '>=': 'function(x,y){return x>=y;}', 
  '=': 'function(x,y){return x===y;}',
  '!=': 'function(x,y){return x!==y;}', 
  '=0': 'function(x){return x===0;}', 
  '>0': 'function(x){return x>0;}', 
  '<0': 'function(x){return x<0;}', 
  '>=0': 'function(x){return x>=0;}', 
  '<=0': 'function(x){return x<=0;}', 
  '&': 'function(x,y){return x&y;}',
  '|': 'function(x,y){return x|y;}',
  '<<': 'function(x,y){return x<<y;}', 
  '>>': 'function(x,y){return x>>y;}', 
  'not': 'function(x){return !x;}',
  'and': 'function(x,y){return x&&y;}',
  'or': 'function(x,y){return x||y;}',
  'xor': 'function(x,y){return (x||y)&&(!(x&&y));}',
  'nil?': 'function(x){return x===null||x===undefined;}',
  'boolean?': 'function(x){return typeof(x)==="boolean";}',
  'number?': 'function(x){return typeof(x)==="number"&&(!isNaN(x));}',
  'string?': 'function(x){return typeof(~~)==="string";}',
  'list?': 'function(x){return Object.prototype.toString.call(x)==="[object Array]";}',
  'object?': 'function(x){return Object.prototype.toString.call(x)==="[object Object]";}',
  're?': 'function(x){return Object.prototype.toString.call(x)==="[object RegExp]";}',
  'function?': 'function(x){return typeof(x)==="function";}',
  'empty?': 'function(x){return x===null||x.length===0;}',
  'integer?': 'function(x){return typeof(x)==="number"&&x%1===0;}',
  'even?': 'function(x){return x%2===0;}',
  'odd?': 'function(x){return x%2===1;}',
  'contains?': 'function(x,y){return x.indexOf(y)!==-1;}',
  'type': 'function(x){var s=Object.prototype.toString.call(x);return (s==="[object Array]")?"array":(s==="[object RegExp]")?"regex":(x===null)?"null":(x!==x)?"nan":typeof(x);}',
  'string': 'function(x){return x.toString();}',
  'number': 'function(x){return parseFloat(x);}',
  'integer': 'function(x){return Math.floor(parseFloat(~~));}',
  'size': 'function(x){return x.length;}',
  'replace': 'function(x,y,z){return x.replace(y,z);}'
};

module.exports['nth'] = module.exports['get'];
module.exports['and?'] = module.exports['&&'] = module.exports['and'];
module.exports['or?'] = module.exports['||'] = module.exports['or'];
module.exports['not?'] = module.exports['!'] = module.exports['not'];
module.exports['cat'] = module.exports['+'];
module.exports['double'] = module.exports['*2'];
module.exports['half'] = module.exports['/2'];
module.exports['square'] = module.exports['^2'];
module.exports['mod'] = module.exports['%'];
module.exports['is'] = module.exports['is?'] = module.exports['eq'] = module.exports['eq?'] = module.exports['equal'] = module.exports['equal?'] = module.exports['equals'] = module.exports['equals?'] = module.exports['='];
module.exports['isnt'] = module.exports['isnt?'] = module.exports['neq'] = module.exports['neq?'] = module.exports['!='];
module.exports['zero?'] = module.exports['=0'];
module.exports['negative?'] = module.exports['<0'];
module.exports['positive?'] = module.exports['>0'];
module.exports['non-positive?'] = module.exports['<=0'];
module.exports['non-negative?'] = module.exports['>=0'];
module.exports['lt?'] = module.exports['<'];
module.exports['gt?'] = module.exports['>'];
module.exports['lte?'] = module.exports['<='];
module.exports['gte?'] = module.exports['>='];
module.exports['bit-and'] = module.exports['&'];
module.exports['bit-or'] = module.exports['|'];
module.exports['bit-shift-left'] = module.exports['<<'];
module.exports['bit-shift-right'] = module.exports['>>'];
module.exports['lambda?'] = module.exports['#?'] = module.exports['function?'];
module.exports['array?'] = module.exports['list?'];
module.exports['regex?'] = module.exports['regexp?'] = module.exports['re?'];
module.exports['length'] = module.exports['count'] = module.exports['size'];
module.exports['typeof'] = module.exports['type'];
module.exports['new'] = module.exports['inherit'];
