var browserify = require('browserify'),
    assert = require('assert'),
    vm = require('vm'),
    path = require('path'),
    React = require('react/addons'),
    webpack = require('webpack'),
    modcss = require('../index'),
    globalConf = require('./conf'),
    assign = require('lodash.assign')

require('babel/register')

function fixture(name) {
  return path.join(__dirname, name)
}

function bundle(name, cb) {
  var filename = fixture(name)
  browserify()
    .require(filename, {expose: name})
    .transform(modcss)
    .bundle(function (err, bundl) {
      if (err) return cb(err)
      var sandbox = {}

      try {
        vm.runInNewContext(bundl, sandbox)
      }

      catch (error) {
        return cb(error)
      }

      cb(null, sandbox)
    })
}

describe('modcss', function () {
  it('works with React components\' styles system', function () {
    modcss.register()
    const renderer = React.addons.TestUtils.createRenderer()
    const MyComponent = require('./my-component.js')
    renderer.render(MyComponent)
    const renderedComponent = renderer.getRenderOutput()
    assert.deepEqual(renderedComponent.props.style, {
      backgroundColor: '#f00',
      display: 'none',
      fontFamily: 'Geo'
    })
    modcss.deregister()
  })

  it('transforms CSS into JSON objects', function (done) {
    bundle('styles.css', function (err, bundl) {
      if (err) return done(err)

      var styles = bundl.require('styles.css')
      assert.deepEqual(styles.Component, {
        fontSize: '12px',
        WebkitTransform: 'yeah'
      })
      assert.deepEqual(styles.MyComponent, {
        backgroundColor: 'red',
        display: 'none'
      })
      done()
    })
  })

  it('transforms Stylus stylesheets into JSON objects', function (done) {
    bundle('styles.styl', function (err, bundl) {
      if (err) return done(err)

      var styles = bundl.require('styles.styl')
      assert.deepEqual(styles.Component, {
        fontSize: '12px',
        MozTransform: 'yeah',
        OTransform: 'yeah',
        MsTransform: 'yeah',
        WebkitTransform: 'yeah',
        transform: 'yeah'
      })
      assert.deepEqual(styles.MyComponent, {
        backgroundColor: '#f00',
        display: 'none',
        fontFamily: 'Geo'
      })
      done()
    })
  })

  it('transforms CSS into JSON objects (Node.js)', function () {
    modcss.register()
    var styles = require('./styles.css')
    assert.deepEqual(styles.Component, {
      fontSize: '12px',
      WebkitTransform: 'yeah'
    })
    assert.deepEqual(styles.MyComponent, {
      backgroundColor: 'red',
      display: 'none'
    })
    modcss.deregister()
  })

  it('transforms Stylus stylesheets into JSON objects (Node.js)', function () {
    modcss.register()
    var styles = require('./styles.styl')
    assert.deepEqual(styles.Component, {
      fontSize: '12px',
      MozTransform: 'yeah',
      OTransform: 'yeah',
      MsTransform: 'yeah',
      WebkitTransform: 'yeah',
      transform: 'yeah'
    })
    assert.deepEqual(styles.MyComponent, {
      backgroundColor: '#f00',
      display: 'none',
      fontFamily: 'Geo'
    })
    modcss.deregister()
  })

  it('transforms Stylus stylesheets into JSON objects (as a dependency)', function (done) {
    bundle('styles-styl.js', function (err, bundl) {
      if (err) return done(err)

      var styles = bundl.require('styles-styl.js')
      assert.deepEqual(styles.Component, {
        fontSize: '12px',
        MozTransform: 'yeah',
        OTransform: 'yeah',
        MsTransform: 'yeah',
        WebkitTransform: 'yeah',
        transform: 'yeah'
      })
      assert.deepEqual(styles.MyComponent, {
        backgroundColor: '#f00',
        display: 'none',
        fontFamily: 'Geo'
      })
      done()
    })
  })

  it('transforms CSS stylesheets into JSON objects (as a dependency)', function (done) {
    bundle('styles-css.js', function (err, bundl) {
      if (err) return done(err)

      var styles = bundl.require('styles-css.js')
      assert.deepEqual(styles.Component, {
        fontSize: '12px',
        WebkitTransform: 'yeah'
      })
      assert.deepEqual(styles.MyComponent, {
        backgroundColor: 'red',
        display: 'none'
      })
      done()
    })
  })

  it('transforms Stylus stylesheets into JSON objects (as a dependency - WP)', function (done) {
    var localConfig = {
      entry: './specs/styles-styl.js'
    }

    webpack(assign({}, globalConf, localConfig), function (err, response) {
      err && console.error(err)
      console.dir(response)
      done()
    })
  })
})

