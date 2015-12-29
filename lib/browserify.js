const
    through = require('through'),
    Stylus  = require('./stylus'),
    Is      = require('./is')

const isCSS      = Is.CSS
const processCSS = Stylus.processCSS

// The Browserify transform
module.exports = function (filename, options) {
  const paths = options.paths || options._flags && options._flags.paths || [ ]
  var   nib   = options.nib   || options._flags && options._flags.nib   || false

  ; nib === 'true'  && (nib = true)
  ; nib === 'false' && (nib = false)

  const opts = {
    nib   : nib,
    paths : paths
  }

  // We're a passthrough stream if the file's not a match for `isCSS`
  if (!isCSS.exec(filename)) return through()

  return processCSS(filename, opts, function (err) {
    return this.emit('error', new Error('error parsing ' + filename + ': ' + err))
  })
}
