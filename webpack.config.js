const path = require('path');
const webpack = require('webpack');

module.exports = {
  // mode: 'production',
  // mode: 'development',
  mode: 'none',
  entry: './src/index.js',
  plugins: [
    new webpack.ProgressPlugin(),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'template.js',
    library: {
      type: 'umd',
      name: 'template',
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
