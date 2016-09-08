const Assert        = require('assert')
const Serialization = require('../lib/serialization')

describe('Serialization', function () {
  it('transforms CSS into JSON', function () {
    const css = 'div.modcss { margin-left : 10em; }'
    const json = Serialization.parseCSSToJSON(css)
    Assert.deepEqual(json, { 'div.modcss' : {
      marginLeft : '10em'
    }})
  })

  it('transforms JSON into CSS (selectors)', function () {
    const json = { 'div.modcss' : {
      marginLeft : '10em'
    }}
    const css = Serialization.parseJSONToCSS(json)
    Assert.deepEqual(css, 'div.modcss { margin-left:10em; }')
  })

  it('transforms JSON into CSS (no selectors)', function () {
    const json = {
      marginLeft : '10em'
    }
    const css = Serialization.parseJSONToCSS(json, true)
    Assert.deepEqual(css, 'margin-left:10em;')
  })
})

