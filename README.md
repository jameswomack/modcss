# ModCSS

![ModCSS](https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/RAF_roundel.svg/240px-RAF_roundel.svg.png)


ModCSS is a Node.js `require` extension **and** a source transform for [browserify][browserify] or [dcompose][dcompose] which
converts CSS or Stylus into JSON objects which can be used further by libraries like
[React][React] to assign styles to UI components.

The main use case (as of this writing) is to write your styles using expressive Stylus syntax and isolate them to a single component, usually by assigning JSON to a React component.

## TODO
* Provide a running GH Pages example site
* Provide a Webpack route to use this, whether here on in some webpack-modcss dealie

## Example
`styles.styl`:

    MyComponent
      font-size 12px
      background-color red
    

`my-component.js`:

    const React = require('react')
    const Styles = require('./styles.styl') // or ./styles.css

    const MyComponent = React.createClass({
      render: function () {
        return <div style={Styles.MyComponent}>
          Hello, world!
        </div>
      }
    })

## Usage

### Browserify

Use **npm** to install the package:

    % npm install modcss -SE

And use it with **browserify**:

    % browserify -t modcss ./my-component.js

where `./my-component.js` or its dependencies can reference `*.css` or `*.styl` files by
`require(...)` calls.

    
### Node.js

```
require('modcss').register()

const myComponentStylesAsJSON = require('../styl/components.styl')

// Use require('modcss').deregister() to remove the association with CSS & Stylus files
```

## History
ModCSS is based on the abandoned project [cssobjectify](https://github.com/andreypopp/cssobjectify). Issues went unanswered, the tests didn't pass, etc. I've also added Stylus support to this module, whether used from Node.js or Browserify.

[browserify]: http://browserify.org
[dcompose]: https://github.com/andreypopp/dcompose
[React]: http://facebook.github.io/react/
