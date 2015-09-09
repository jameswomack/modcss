const React  = require('react')
const Styles = require('./styles.styl')

const MyComponent = React.createClass({
  render : function () {
    return <div style={Styles.MyComponent}>
      Hello, world!
    </div>
  }
})

module.exports = MyComponent
