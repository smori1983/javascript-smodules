const templateParser = require('../src/templateParser');

QUnit.module('templateParser - error', {
  beforeEach: function () {
    this.parser = templateParser.init();
  },
});

QUnit.test('normal block - error - 1', function (assert) {
  const src = '<div>{left} is ok, only { is forbidden.</div>';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});

QUnit.test('normal block - error - 2', function (assert) {
  const src = '<div> } is forbidden.</div>';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});
