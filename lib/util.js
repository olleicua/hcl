var format = require('hot-cocoa').format;

module.exports = {
  splat_invocation: function(ast, args) {
    console.log("\n", ast, args);
    return format('~~.apply(null, ~~)', [ast, args[0]]);
  }
};
