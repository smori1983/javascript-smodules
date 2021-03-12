const Parser = require('../src/parser');

QUnit.module('parser - error', {
  beforeEach: function () {
    this.parser = new Parser();
  },
});

QUnit.test('literal block - error - only open tag', function (assert) {
  const src = '<div>{literal}</div>';

  assert.throws(function () {
    this.parser.parse(src);
  }, /not closed by {endliteral}/);
});

QUnit.test('literal block - error - only close tag', function (assert) {
  const src = '<div>{endliteral}</div>';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});
