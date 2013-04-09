module.exports = require('optimist')
  .boolean(['h', 'n', 'b', 'v', 'd'])
  .alias({
    d: 'debug',
    h: 'help',
    n: 'run-with-node',
    b: 'browser',
    v: 'version'
  })
  .argv;