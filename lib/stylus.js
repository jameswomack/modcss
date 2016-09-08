const
  stylus        = require('stylus'),
  through       = require('through'),
  Is            = require('./is'),
  Serialization = require('./serialization')

var isStyl = Is.Styl

function parseCSS (chunksReceivedFromStream, failCB) {
  var json

  try {
    json = Serialization.parseCSSToJSON(chunksReceivedFromStream)
  }

  catch (err) {
    failCB.call(this, err)
  }

  // Turn JSON into a JavaScript CommonJS file
  var exprt = 'module.exports = ' + JSON.stringify(json) + ';'

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
  compileStyl    : compileStyl,
  parseCSS       : parseCSS,
  processCSS     : processCSS
}
