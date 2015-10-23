var through = require('through'),
    Stylus = require('./stylus'),
    Is = require('./is')

var isCSS  = Is.CSS

var processCSS  = Stylus.processCSS

// The Browserify transform
module.exports = function (filename, options) {
  const paths = options.paths || options._flags && options._flags.paths || [ ]

  // We're a passthrough stream if the file's not a match for `isCSS`
  if (!isCSS.exec(filename)) return through()

  return processCSS(filename, paths, function (err) {
    return this.emit('error', new Error('error parsing ' + filename + ': ' + err))
  })
}
