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
