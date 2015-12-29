# ModCSS

![ModCSS](https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/RAF_roundel.svg/240px-RAF_roundel.svg.png)

[![Build Status](https://travis-ci.org/jameswomack/modcss.svg?branch=master)](https://travis-ci.org/jameswomack/modcss)


ModCSS is a Node.js `require` extension, Browserify|DCompose transform & Webpack loader that
converts CSS or Stylus into JSON. This can be used further by libraries like
[React][React] to assign styles to UI components.

The main use case (as of this writing) is to write your styles using expressive Stylus syntax and isolate them to a single component, usually by assigning JSON to a React component.

## TODO
* Provide a running GH Pages example site

## Example
`styles.styl`:

    MyComponent
      font-size 12px
      background-color red
    

`my-component.js`:

    const React = require('react')
    const Styles = require('./styles.styl') // or ./styles.css

    class MyComponent extends React.Component {
      render () {
        return <div style={Styles.MyComponent}>
          Hello, world!
        </div>
      }
    }

## Usage

### Browserify

Use **npm** to install the package:

    % npm install modcss -SE

And use it with **browserify**:

    % browserify -t [ modcss --paths somePathHere --nib true ] ./my-component.js

where `./my-component.js` or its dependencies can reference `*.css` or `*.styl` files by
`require(...)` calls.

Or programmatically with **browserify** (for instance, via **gulp**):

    var browserify = require('browserify');
    var modcss = require('modcss');

    // in your task
    var b = browserify(config);
    b.transform(modcss, { paths: [ somePathHere ] });


    
### Node.js

```
require('modcss').register(/* stylusPaths, useNib */)

const myComponentStylesAsJSON = require('../styl/components.styl')

// Use require('modcss').deregister() to remove the association with CSS & Stylus files
```

### Webpack
Example config:
```
module.exports = {
  output: {
    path: './output/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.styl$/,
        loader: '../index.js?paths[]=./mixins&nib=true',
        exclude: /node_modules/
      }
    ]
  }
};
```

## History
ModCSS is based on the abandoned project [cssobjectify](https://github.com/andreypopp/cssobjectify). Issues went unanswered, the tests didn't pass, etc. I've also added Stylus support to this module, whether used from Node.js or Browserify.

[browserify]: http://browserify.org
[dcompose]: https://github.com/andreypopp/dcompose
[React]: http://facebook.github.io/react/
