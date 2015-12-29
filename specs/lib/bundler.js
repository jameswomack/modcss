const
  Path       = require('path'),
  VM         = require('vm'),
  browserify = require('browserify'),
  ModCSS     = require('../../')

const fixture = Path.join.bind(Path, __dirname, '..')

const bundle = (name, cb, useNib) => {
  browserify()
    .require(fixture(name), { expose: name })
    .transform(ModCSS, {
      paths : [ fixture('mixins') ],
      nib   : useNib
    })
    .bundle((err, bundl) => {
      if (err) return cb(err)
      const sandbox = {}

      try {
        VM.runInNewContext(bundl, sandbox)
      }

      catch (error) {
        return cb(error)
      }

      cb(null, sandbox)
    })
}

module.exports = { bundle, paths: [ fixture('mixins') ] }
