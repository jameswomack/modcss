var FS = require('fs'),
    parse = require('css-parse'),
    stylus = require('stylus'),
    nib = require('nib'),
    toCamelCase = require('to-camel-case'),
    through = require('through')

var isCSS  = /\.(csso|css|styl|sass|scss|less)$/
var isStyl = /\.styl$/

function parseCSS (chunksReceivedFromStream, failCB) {
  var tree,
      modExports = {}

  try {
    tree = parse(chunksReceivedFromStream)
  }

  catch (err) {
    failCB.call(this, err)
  }

  tree.stylesheet.rules.forEach(function eachRule (rule) {
    if (rule.type !== 'rule') return

    rule.selectors.forEach(function eachSelector (selector) {
      var styles = modExports[selector] = modExports[selector] || {}

      rule.declarations.forEach(function eachDeclaration (declaration) {
        if (declaration.type !== 'declaration') return

        // camelize the css property for use in React al
        styles[toCamelCase(declaration.property)] = declaration.value
      })
    })
  })

  // Turn JSON into a JavaScript CommonJS file
  var exprt = 'module.exports = ' + JSON.stringify(modExports)

  if (this.queue) {
    this.queue(exprt)
    this.queue(null)
  } else
    return exprt
}

function compileStyl (stylusString, pathToStylusFile) {
  return stylus(stylusString)
    .set('filename', pathToStylusFile)
    .set('compress', true)
    .use(nib())
}

function processCSS (filename, failCB) {
  var chunksReceivedFromStream = ''

  return through(
    function receiveChunkFromStream (chunk) {
      chunksReceivedFromStream += chunk
    },

    function doneReceivingChunksFromStream () {
      if (isStyl.exec(filename)) {
        var styl = compileStyl(chunksReceivedFromStream, filename)
        return parseCSS.call(this, styl.render(), failCB)
      } else
        return parseCSS.call(this, chunksReceivedFromStream, failCB)
    })
}

function register () {
  function req (needsCompile, module, filename) {
    var css = FS.readFileSync(filename, 'utf-8')

    needsCompile && (css = compileStyl(css, filename).render())

    var compiled = parseCSS.call(this, css, function () {
      throw new Error('error parsing ' + filename)
    })

    return module._compile(compiled, filename)
  }

  require.extensions['.styl'] = req.bind(null, true)
  require.extensions['.css']  = req.bind(null, false)
}

function deregister () {
  delete require.extensions['.styl']
}

function _browserify (filename) {
  // We're a passthrough stream if the file's not a match for `isCSS`
  if (!isCSS.exec(filename)) return through()

  return processCSS(filename, function (err) {
    return this.emit('error', new Error('error parsing ' + filename + ': ' + err))
  })
}

function detectWebpackEnvironment () {
  return this.cacheable && this.async
}

function _webpackify (source) {
  var css = source
  var filename = this.resourcePath

  var needsCompile = !isStyl.exec(filename)

  needsCompile && (css = compileStyl(css, filename).render())

  return parseCSS.call(this, css, function () {
    throw new Error('error parsing ' + filename)
  })
}

module.exports = function (filenameOrSource) {
  var isWebpack = detectWebpackEnvironment.call(this)

  if (isWebpack)
    return _webpackify.call(this, filenameOrSource)
  else
    return _browserify.call(this, filenameOrSource)
}

module.exports.register   = register
module.exports.deregister = deregister
