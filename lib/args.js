module.exports = require('optimist')
  .boolean(['h', 'n', 'b', 'v', 'd', 'u', 'm'])
  .alias({
    d: 'debug',
    h: 'help',
    n: 'run-with-node',
    b: 'browser',
    v: 'version',
    u: 'underscore',
    m: 'minify'
  })
  .argv;