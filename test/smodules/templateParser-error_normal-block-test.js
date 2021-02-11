const templateParser = require('../../src/smodules/templateParser');

QUnit.module('templateParser - error', {
  before: function () {
    this.parse = function (src) {
      this.parser.parse(src);
    };
  },
  beforeEach: function () {
    this.parser = templateParser.init();
  },
});

QUnit.test('normal block - error - 1', function (assert) {
  const src = '<div>{left} is ok, only { is forbidden.</div>';

  assert.throws(function () {
    this.parse(src);
  }, Error);
});

QUnit.test('normal block - error - 2', function (assert) {
  const src = '<div> } is forbidden.</div>';

  assert.throws(function () {
    this.parse(src);
  }, Error);
});
