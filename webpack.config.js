const path = require('path');
const webpack = require('webpack');

module.exports = {
  // mode: 'production',
  // mode: 'development',
  mode: 'none',
  entry: './src/templr-browser.js',
  plugins: [
    new webpack.ProgressPlugin(),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'templr.js',
    library: {
      type: 'umd',
      name: 'templr',
    },
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      include: path.resolve(__dirname, 'src'),
      loader: 'babel-loader',
    }],
  },
}
