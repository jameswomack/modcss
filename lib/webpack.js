var Assert = require('assert')
var Path = require('path')
var parseQuery = require('webpack-parse-query')
var Stylus = require('./stylus')
var Is = require('./is')

var isCSS  = Is.CSS

var compileStyl = Stylus.compileStyl
var parseCSS    = Stylus.parseCSS

// The Browserify transform
module.exports = function (source) {
  this.cacheable && this.cacheable()

  // Paths like whoa!
  var paths = (parseQuery(this.query).paths || []).map(function (path) {
    return Path.isAbsolute(path)? path : Path.join(Path.dirname(this.resourcePath), path)
  }.bind(this))

  Assert.ok(paths && paths.length, 'Paths is not valid')

  // We're a passthrough stream if the file's not a match for `isCSS`
  if (!isCSS.exec(this.resourcePath)) return source

  var styl = compileStyl(source, this.resourcePath, paths)

  this.value = parseCSS.call(this, styl.render(), function (err) {
    throw new Error('error parsing ' + this.resourcePath + ': ' + err)
  })

  return 'module.exports = ' + JSON.stringify(this.value, undefined, '\t') + ';';
}
