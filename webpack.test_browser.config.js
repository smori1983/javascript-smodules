const path = require('path');
const webpack = require('webpack');

module.exports = {
  // mode: 'production',
  // mode: 'development',
  mode: 'none',
  entry: './test_browser/setup.js',
  plugins: [
    new webpack.ProgressPlugin(),
  ],
  output: {
    path: path.resolve(__dirname, 'test_browser'),
    filename: 'index.js',
    library: {
      type: 'umd',
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
      },
      {
        test: /\.css/,
        use: [
          'style-loader', {
            loader: 'css-loader',
          },
        ],
      },
    ],
  },
}
