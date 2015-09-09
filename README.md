# modcss

![ModCSS](https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/RAF_roundel.svg/240px-RAF_roundel.svg.png)

Mod CSS is based on the abandoned project [cssobjectify](https://github.com/andreypopp/cssobjectify). Issues went unanswered, the tests didn't pass, etc. I've also added Stylus support to this module, whether used from Node.js or Browserify.

The main use case (as of this writing) is to write your styles using expressive Stylus syntax and isolate them to a single component, usually by assigning JSON to a React component.

## TODO
* Provide a running GH Pages example site

Node.js Require extension and Source transform for [browserify][browserify] or [dcompose][dcompose] which
converts CSS into JSON objects which can be used further by libraries like
[React][React] to assign styles to UI components.

`styles.styl`:

    MyComponent
      font-size 12px
      background-color red
    

`myapp.js`:

    var React = require('react-tools/build/modules/React');
    var Styles = require('./styles.styl');

    var MyComponent = React.createClass({
      render: function() {
        return (
          <div style={Styles.MyComponent}>
            Hello, world!
          </div>
        )
      }
    });

## Usage

Use npm to install the package:

    % npm install modcss -SE

And use it with browserify:

    % browserify -t modcss ./myapp.js

where `./myapp.js` or its dependencies can reference `*.css` files by
`require(...)` calls.

    
Or in Node.js:

```
require('modcss').register()

var myComponentStylesAsJSON = require('../styl/foo.styl')
```

[browserify]: http://browserify.org
[dcompose]: https://github.com/andreypopp/dcompose
[React]: http://facebook.github.io/react/
