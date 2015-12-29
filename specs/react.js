const Assert  = require('assert')
const Bundler = require('./lib/bundler')
const Node    = require('../lib/node')
const React   = require('react/addons')

const registerMixins = Node.register.bind(Node, Bundler.paths)

it('works with React components\' styles system', function () {
  registerMixins()
  const renderer = React.addons.TestUtils.createRenderer()
  const MyComponent = require('./my-component.js')
  renderer.render(<MyComponent />);
  const renderedComponent = renderer.getRenderOutput()
  Assert.deepEqual(renderedComponent.props.style, {
    backgroundColor: '#f00',
    display: 'none',
    fontFamily: 'Geo'
  })
  Node.deregister()
})
