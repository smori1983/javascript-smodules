const templateParser = require('../../src/smodules/templateParser');

QUnit.module('templateParser', {
  beforeEach: function () {
    this.parser = templateParser.init();
  },
});

QUnit.test('literal block', function (assert) {
  const src = '<div>{literal}{foo} {left}bar{right} {left}/literal{right} function() {};{/literal}</div>';
  const result = this.parser.parse(src);

  assert.strictEqual(result.length, 3);
  assert.strictEqual(result[0].type, 'normal');
  assert.strictEqual(result[0].value, '<div>');
  assert.strictEqual(result[1].type, 'literal');
  assert.strictEqual(result[1].value, '{foo} {bar} {/literal} function() {};');
  assert.strictEqual(result[2].type, 'normal');
  assert.strictEqual(result[2].value, '</div>');
});
