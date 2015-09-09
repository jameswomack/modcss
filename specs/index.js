var browserify = require('browserify'),
    assert = require('assert'),
    vm = require('vm'),
    path = require('path'),
    modcss = require('../index')

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
  it('transforms CSS stylesheets into JSON objects', function (done) {
    bundle('styles.css', function (err, bundl) {
      if (err) return done(err)

      var styles = bundl.require('styles.css')
      assert.deepEqual(styles.Component, {
        fontSize: '12px',
        WebkitTransform: 'yeah'
      })
      assert.deepEqual(styles.AnotherComponent, {
        backgroundColor: 'red',
        display: 'none'
      })
      done()
    })
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
    assert.deepEqual(styles.AnotherComponent, {
      backgroundColor: '#f00',
      display: 'none'
    })
    modcss.deregister()
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
      assert.deepEqual(styles.AnotherComponent, {
        backgroundColor: '#f00',
        display: 'none'
      })
      done()
    })
  })

  it('transforms Stylus stylesheets into JSON objects (as a dependency)', function (done) {
    bundle('app.js', function (err, bundl) {
      console.info(err)
      if (err) return done(err)

      var styles = bundl.require('app.js')
      assert.deepEqual(styles.Component, {
        fontSize: '12px',
        MozTransform: 'yeah',
        OTransform: 'yeah',
        MsTransform: 'yeah',
        WebkitTransform: 'yeah',
        transform: 'yeah'
      })
      assert.deepEqual(styles.AnotherComponent, {
        backgroundColor: '#f00',
        display: 'none'
      })
      done()
    })
  })

  it('transforms CSS stylesheets into JSON objects (as a dependency)', function (done) {
    bundle('app-css.js', function (err, bundl) {
      console.info(err)
      if (err) return done(err)

      var styles = bundl.require('app-css.js')
      assert.deepEqual(styles.Component, {
        fontSize: '12px',
        WebkitTransform: 'yeah'
      })
      assert.deepEqual(styles.AnotherComponent, {
        backgroundColor: 'red',
        display: 'none'
      })
      done()
    })
  })
})

