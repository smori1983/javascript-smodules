const path = require('path');

const config = require('./webpack.config');

config.output.path = path.resolve(__dirname, 'browser-test');

module.exports = config;
