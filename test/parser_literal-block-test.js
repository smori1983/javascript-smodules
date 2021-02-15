const parser = require('../src/parser');

QUnit.module('parser', {
  beforeEach: function () {
    this.parser = parser.init();
  },
});

QUnit.test('literal block', function (assert) {
  const src = '<div>{literal}{foo} {left}bar{right} {left}endliteral{right} function() {};{endliteral}</div>';
  const result = this.parser.parse(src);

  assert.strictEqual(result.length, 3);
  assert.strictEqual(result[0].type, 'normal');
  assert.strictEqual(result[0].value, '<div>');
  assert.strictEqual(result[1].type, 'literal');
  assert.strictEqual(result[1].value, '{foo} {bar} {endliteral} function() {};');
  assert.strictEqual(result[2].type, 'normal');
  assert.strictEqual(result[2].value, '</div>');
});
