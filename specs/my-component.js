const React  = require('react')
const Styles = require('./styles.styl')

class MyComponent extends React.Component {
  render () {
    return <div style={Styles.MyComponent}>
      Hello, world!
    </div>
  }
}

module.exports = MyComponent
