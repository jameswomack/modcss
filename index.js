function isWebpackEnv (context) {
  const contextIsDefined = !!context
  return contextIsDefined && typeof context.exec !== 'undefined'
}

// Browserify transform or Webpack Loader
module.exports = function () {
  // I'd put the transform first, but testing for Webpack is easier
  return (isWebpackEnv(this) ? require('./lib/webpack') : require('./lib/browserify')).apply(this, arguments)
}

Object.defineProperty(module.exports, 'register', {
  get: function () {
    return require('./lib/node').register
  }
})

Object.defineProperty(module.exports, 'deregister', {
  get: function () {
    return require('./lib/node').deregister
  }
})
