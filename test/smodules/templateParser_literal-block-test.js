const templateParser = require('../../src/smodules/templateParser');

QUnit.module('templateParser', {
  before: function () {
    this.parse = function () {
      this.result = this.parser.parse(this.source);
    };
  },
  beforeEach: function () {
    this.parser = templateParser.init();
    this.source = '';
    this.result = null;
  },
});

QUnit.test('literal block', function (assert) {
  this.source = '<div>{literal}{foo} {left}bar{right} {left}/literal{right} function() {};{/literal}</div>';
  this.parse();

  assert.strictEqual(this.result.length, 3);
  assert.strictEqual(this.result[0].type, 'normal');
  assert.strictEqual(this.result[0].value, '<div>');
  assert.strictEqual(this.result[1].type, 'literal');
  assert.strictEqual(this.result[1].value, '{foo} {bar} {/literal} function() {};');
  assert.strictEqual(this.result[2].type, 'normal');
  assert.strictEqual(this.result[2].value, '</div>');
});
