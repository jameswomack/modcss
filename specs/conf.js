module.exports = {
  output: {
    path: './output/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.styl$/,
        loader: '../index.js?paths[]=./mixins',
        exclude: /node_modules/
      }
    ]
  }
};
