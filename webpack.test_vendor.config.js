const path = require('path');
const webpack = require('webpack');

module.exports = {
  // mode: 'production',
  // mode: 'development',
  mode: 'none',
  entry: {
    $: {
      import: ['jquery'],
      filename: 'vendor.jquery.js',
    },
    QUnit: {
      import: ['./test_browser/asset/qunit.js', 'qunit'],
      filename: 'vendor.qunit.js',
    },
  },
  plugins: [
    new webpack.ProgressPlugin(),
  ],
  output: {
    path: path.resolve(__dirname, 'test_browser'),
    library: {
      type: 'umd',
      name: '[name]',
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
