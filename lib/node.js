var FS = require('fs'),
    Ext = require('./ext'),
    Stylus = require('./stylus')

var parseCSS     = Stylus.parseCSS
var compileStyl  = Stylus.compileStyl

function register (paths, useNib) {
  paths  = paths  || [ ]
  useNib = useNib || false

  const options = {
    paths : paths,
    nib   : useNib
  }

  function req (needsCompile, module, filename) {
    var css = FS.readFileSync(filename, 'utf-8')

    needsCompile && (css = compileStyl(css, filename, options).render())

    var compiled = parseCSS.call(this, css, function () {
      throw new Error('error parsing ' + filename)
    })

    return module._compile(compiled, filename)
  }

  require.extensions[Ext.Styl] = req.bind(null, true)
  require.extensions[Ext.CSS]  = req.bind(null, false)
}

function deregister () {
  delete require.extensions[Ext.CSS]
  delete require.extensions[Ext.Styl]
}

module.exports = {
  deregister : deregister,
  register   : register
}
