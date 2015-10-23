var browserifyTransform = require('./lib/browserify')
var webpackLoader       = require('./lib/webpack')
var Node                = require('./lib/node')

var deregister = Node.deregister.bind(Node)
var register   = Node.register.bind(Node)

function isWebpackEnv (context) {
  return typeof context.exec !== 'undefined'
}

// Browserify transform or Webpack Loader
module.exports = function () {
  // I'd put the transform first, but testing for Webpack is easier
  return (isWebpackEnv(this) ? webpackLoader : browserifyTransform).apply(this, arguments)
}

module.exports.register   = register
module.exports.deregister = deregister
