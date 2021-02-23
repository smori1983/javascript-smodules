const path = require('path');

const config = require('./webpack.config');

config.output.path = path.resolve(__dirname, 'test_browser');

module.exports = config;
