const templateParser = require('../../src/smodules/templateParser');

QUnit.module('templateParser - error', {
  beforeEach: function () {
    this.parser = templateParser.init();
  },
});

QUnit.test('literal block - error - only open tag', function (assert) {
  const src = '<div>{literal}</div>';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});

QUnit.test('literal block - error - only close tag', function (assert) {
  const src = '<div>{endliteral}</div>';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});
