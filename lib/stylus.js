const
  parse       = require('css-parse'),
  stylus      = require('stylus'),
  toCamelCase = require('to-camel-case'),
  through     = require('through'),
  Is          = require('./is')

var isStyl = Is.Styl

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
  var exprt = 'module.exports = ' + JSON.stringify(modExports) + ';'

  if (this && this.queue) {
    this.queue(exprt)
    this.queue(null)
  } else
    return exprt
}

function compileStyl (stylusString, pathToStylusFile, options) {
  const paths  = options.paths
  const useNib = options.nib

  var styl = stylus(stylusString)
    .set('filename', pathToStylusFile)

  ; paths && paths.length && (styl = styl.set('paths', paths))

  return useNib ? styl.use(require('nib')()) : styl
}

function processCSS (filename, options, failCB) {
  var chunksReceivedFromStream = ''

  return through(
    function receiveChunkFromStream (chunk) {
      chunksReceivedFromStream += chunk
    },

    function doneReceivingChunksFromStream () {
      if (isStyl.exec(filename)) {
        var styl = compileStyl(chunksReceivedFromStream, filename, options)
        return parseCSS.call(this, styl.render(), failCB)
      } else
        return parseCSS.call(this, chunksReceivedFromStream, failCB)
    })
}

module.exports = {
  compileStyl : compileStyl,
  parseCSS    : parseCSS,
  processCSS  : processCSS
}
