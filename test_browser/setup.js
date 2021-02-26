require('qunit/qunit/qunit.css');
require('./asset/test.css');

require('./test/templr-test');
require('./test/template-test');

// qunit (2.13.0) is used because of page layout problem of qunit (2.14.0).
//
// Release note of 2.14.0:
// - HTML Reporter: Use a fixed header with scrollable test results.

const QUnit = require('qunit').QUnit;

QUnit.config.testTimeout = 3000;

QUnit.start();
