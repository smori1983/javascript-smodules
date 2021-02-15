const parser = require('../src/parser');

QUnit.module('parser', {
  beforeEach: function () {
    this.parser = parser.init();
  },
});

QUnit.test('for block - only value part in dummy variable', function (assert) {
  const src =
    '{ for $item in $items }' +
    '<p>{ $item | h }</p>' +
    '{ endfor }';
  const result = this.parser.parse(src);

  const block = result[0];

  assert.strictEqual(block.type, 'for');
  assert.strictEqual(typeof block.ctrl.tmp_k, 'undefined');
  assert.strictEqual(block.ctrl.tmp_v, 'item');
  assert.strictEqual(block.ctrl.keys.join('.'), 'items');
  assert.strictEqual(block.children.length, 3);
});

QUnit.test('for block - use index in dummy variable', function (assert) {
  const src =
    '{ for $idx, $item in $items }' +
    '<p>{ $item | h }</p>' +
    '{ endfor }';
  const result = this.parser.parse(src);

  const block = result[0];

  assert.strictEqual(block.type, 'for');
  assert.strictEqual(block.ctrl.tmp_k, 'idx');
  assert.strictEqual(block.ctrl.tmp_v, 'item');
  assert.strictEqual(block.ctrl.keys.join('.'), 'items');
  assert.strictEqual(block.children.length, 3);
});

QUnit.test('for block - use index in dummy variable - space before comma', function (assert) {
  const src =
    '{ for $idx , $item in $items }' +
    '<p>{ $item | h }</p>' +
    '{ endfor }';
  const result = this.parser.parse(src);

  const block = result[0];

  assert.strictEqual(block.type, 'for');
  assert.strictEqual(block.ctrl.tmp_k, 'idx');
  assert.strictEqual(block.ctrl.tmp_v, 'item');
  assert.strictEqual(block.ctrl.keys.join('.'), 'items');
  assert.strictEqual(block.children.length, 3);
});

QUnit.test('for block - variable chain in haystack', function (assert) {
  const src =
    '{ for $item in $items.key1.key2 }' +
    '<p>{ $item | h }</p>' +
    '{ endfor }';
  const result = this.parser.parse(src);

  const block = result[0];

  assert.strictEqual(block.type, 'for');
  assert.strictEqual(block.ctrl.keys.join('.'), 'items.key1.key2');
});
