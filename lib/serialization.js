const
  parse       = require('css-parse'),
  toCamelCase = require('to-camel-case')

function parseCSSToJSON (cssString) {
  var tree,
      modExports = {}

  tree = parse(cssString)

  tree.stylesheet.rules.forEach(function eachRule (rule) {
    if (rule.type !== 'rule') return

    rule.selectors.forEach(function eachSelector (selector) {
      var styles = modExports[selector] = modExports[selector] || {}

      rule.declarations.forEach(function eachDeclaration (declaration) {
        if (declaration.type !== 'declaration') return

        // camelize the css property for use in React al
        styles[toCamelCase(declaration.property)] = declaration.value
      })
    })
  })

  // return JSON
  return modExports
}

function parseJSONToCSS (json, noSelectors) {
  var CSSPropertyOperations = require('react/lib/CSSPropertyOperations')

  if (noSelectors)
    return CSSPropertyOperations.createMarkupForStyles(json)
  else
    return Object.keys(json).reduce(function (css, selector) {
      return css + selector + ' { ' + CSSPropertyOperations.createMarkupForStyles(json[selector]) + ' }\n'
    }, '').trim()
}


module.exports = {
  parseCSSToJSON : parseCSSToJSON,
  parseJSONToCSS : parseJSONToCSS
}
