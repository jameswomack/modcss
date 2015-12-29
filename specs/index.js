// DOC: https://babeljs.io/docs/usage/require/
require('babel-register') // For /lib and JSX

const Assert     = require('assert')
const Bundler    = require('./lib/bundler')
const Node       = require('../lib/node')
const assign     = require('lodash.assign')
const webpack    = require('webpack')

const globalConf        = require('./conf')
const globalConfWithNib = require('./conf-nib')

const bundle  = Bundler.bundle

const registerMixins = Node.register.bind(Node, Bundler.paths)

describe('ModCSS', function () {
  it('transforms CSS into JSON', function (done) {
    bundle('styles.css', function (err, bundl) {
      if (err) return done(err)

      const styles = bundl.require('styles.css')
      Assert.deepEqual(styles.Component, {
        fontSize: '12px',
        WebkitTransform: 'yeah'
      })
      Assert.deepEqual(styles.MyComponent, {
        backgroundColor: 'red',
        display: 'none'
      })
      done()
    })
  })

  it('transforms Stylus stylesheets into JSON', function (done) {
    bundle('styles.styl', function (err, bundl) {
      if (err) return done(err)

      const styles = bundl.require('styles.styl')
      Assert.deepEqual(styles.Component, {
        fontSize: '12px',
        transform: 'yeah'
      })
      Assert.deepEqual(styles.MyComponent, {
        backgroundColor: '#f00',
        display: 'none',
        fontFamily: 'Geo'
      })
      done()
    })
  })

  it('transforms CSS into JSON (Node.js)', function () {
    Node.register()
    const styles = require('./styles.css')
    Assert.deepEqual(styles.Component, {
      fontSize: '12px',
      WebkitTransform: 'yeah'
    })
    Assert.deepEqual(styles.MyComponent, {
      backgroundColor: 'red',
      display: 'none'
    })
    Node.deregister()
  })

  it('transforms Stylus stylesheets that use nib', function (done) {
    bundle('styles-nib.styl', function (err, bundl) {
      if (err) return done(err)

      const styles = bundl.require('styles-nib.styl')
      Assert.deepEqual(styles.MyComponent, {
        backgroundColor: '#f00',
        display: 'none',
        transform: 'scale(2)',
        MozTransform: 'scale(2)',
        OTransform: 'scale(2)',
        MsTransform: 'scale(2)',
        WebkitTransform: 'scale(2)'
      })
      done()
    }, true)
  })

  it('transforms Stylus stylesheets that use nib (Node.js)', function () {
    registerMixins(true)
    const styles = require('./styles-nib.styl')
    Assert.deepEqual(styles.MyComponent, {
      backgroundColor: '#f00',
      display: 'none',
      transform: 'scale(2)',
      MozTransform: 'scale(2)',
      OTransform: 'scale(2)',
      MsTransform: 'scale(2)',
      WebkitTransform: 'scale(2)'
    })
    Node.deregister()
  })

  it('transforms Stylus stylesheets into JSON (Node.js)', function () {
    registerMixins()
    const styles = require('./styles.styl')
    Assert.deepEqual(styles.Component, {
      fontSize: '12px',
      transform: 'yeah'
    })
    Assert.deepEqual(styles.MyComponent, {
      backgroundColor: '#f00',
      display: 'none',
      fontFamily: 'Geo'
    })
    Node.deregister()
  })

  it('transforms Stylus stylesheets into JSON (as a dependency)', function (done) {
    bundle('styles-styl.js', function (err, bundl) {
      if (err) return done(err)

      const styles = bundl.require('styles-styl.js')
      Assert.deepEqual(styles.Component, {
        fontSize: '12px',
        transform: 'yeah'
      })
      Assert.deepEqual(styles.MyComponent, {
        backgroundColor: '#f00',
        display: 'none',
        fontFamily: 'Geo'
      })
      done()
    })
  })

  it('transforms CSS stylesheets into JSON (as a dependency)', function (done) {
    bundle('styles-css.js', function (err, bundl) {
      if (err) return done(err)

      const styles = bundl.require('styles-css.js')
      Assert.deepEqual(styles.Component, {
        fontSize: '12px',
        WebkitTransform: 'yeah'
      })
      Assert.deepEqual(styles.MyComponent, {
        backgroundColor: 'red',
        display: 'none'
      })
      done()
    })
  })

  it('transforms Stylus stylesheets into JSON (as a dependency - WP)', function (done) {
    const localConfig = {
      entry: './specs/styles-styl-webpack.js'
    }

    webpack(assign({}, globalConf, localConfig), function (err, response) {
      Assert.ok(!err)
      const bundleJS = response.compilation.assets['bundle.js']
      Assert.ok(bundleJS._source.children[0].children[5].children[7].children[1]._source._source._source._name.match(/styles.styl$/))
      done()
    })
  })

  it('transforms Stylus stylesheets with nib into JSON (as a dependency - WP)', function (done) {
    const localConfig = {
      entry: './specs/styles-styl-webpack-nib.js'
    }

    webpack(assign({}, globalConfWithNib, localConfig), function (err, response) {
      Assert.ok(!err)
      const bundleJS = response.compilation.assets['bundle.js']
      Assert.ok(bundleJS._source.children[0].children[5].children[7].children[1]._source._source._source._name.match(/styles-nib.styl$/))
      done()
    })
  })

  require('./react')

})

