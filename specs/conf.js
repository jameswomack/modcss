module.exports = {
  output: {
    path: './specs/output/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.styl$/,
        loader: './index.js',
        exclude: /node_modules/
      }
    ]
  }
};
