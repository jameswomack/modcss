var parse = require('css-parse'),
    stylus = require('stylus'),
    nib = require('nib'),
    toCamelCase = require('to-camel-case'),
    through = require('through'),
    Is      = require('./is')

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

  if (this.queue) {
    this.queue(exprt)
    this.queue(null)
  } else
    return exprt
}

function compileStyl (stylusString, pathToStylusFile, paths) {
  var styl = stylus(stylusString)
    .set('filename', pathToStylusFile)
    .set('compress', true)

  ; paths && paths.length && (styl = styl.set('paths', paths))

  return styl.use(nib())
}

function processCSS (filename, paths, failCB) {
  var chunksReceivedFromStream = ''

  return through(
    function receiveChunkFromStream (chunk) {
      chunksReceivedFromStream += chunk
    },

    function doneReceivingChunksFromStream () {
      if (isStyl.exec(filename)) {
        var styl = compileStyl(chunksReceivedFromStream, filename, paths)
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
