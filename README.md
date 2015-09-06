# modcss

Mod CSS is based on the abandoned project [cssobjectify](https://github.com/andreypopp/cssobjectify). Issues went unanswered, the tests didn't pass, etc. I've also added Stylus support to this module.

## TODO
* Provide a running GH Pages example site

Source transform for [browserify][browserify] or [dcompose][dcompose] which
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

    % npm install modcss@1.0.0-beta0 -DE

And use it with browserify:

    % browserify -t modcss ./myapp.js

where `./myapp.js` or its dependencies can reference `*.css` files by
`require(...)` calls.

[browserify]: http://browserify.org
[dcompose]: https://github.com/andreypopp/dcompose
[React]: http://facebook.github.io/react/
