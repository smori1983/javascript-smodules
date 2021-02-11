const templateParser = require('../../src/smodules/templateParser');

QUnit.module('templateParser', {
  before: function() {
    this.parse = function() {
      this.result = this.parser.parse(this.source);
    };
  },
  beforeEach: function() {
    this.parser = templateParser.init();
    this.source = '';
    this.result = null;
  },
});

QUnit.test('for block - only value part in dummy variable', function(assert) {
  this.source =
    '{ for $item in $items }' +
    '<p>{ $item | h }</p>' +
    '{ /for }';
  this.parse();

  const block = this.result[0];

  assert.strictEqual(block.type, 'for');
  assert.strictEqual(typeof block.ctrl.tmp_k, 'undefined');
  assert.strictEqual(block.ctrl.tmp_v, 'item');
  assert.strictEqual(block.ctrl.keys.join('.'), 'items');
  assert.strictEqual(block.children.length, 3);
});

QUnit.test('for block - use index in dummy variable', function(assert) {
  this.source =
    '{ for $idx, $item in $items }' +
    '<p>{ $item | h }</p>' +
    '{ /for }';
  this.parse();

  const block = this.result[0];

  assert.strictEqual(block.type, 'for');
  assert.strictEqual(block.ctrl.tmp_k, 'idx');
  assert.strictEqual(block.ctrl.tmp_v, 'item');
  assert.strictEqual(block.ctrl.keys.join('.'), 'items');
  assert.strictEqual(block.children.length, 3);
});

QUnit.test('for block - use index in dummy variable - space before comma', function(assert) {
  this.source =
    '{ for $idx , $item in $items }' +
    '<p>{ $item | h }</p>' +
    '{ /for }';
  this.parse();

  const block = this.result[0];

  assert.strictEqual(block.type, 'for');
  assert.strictEqual(block.ctrl.tmp_k, 'idx');
  assert.strictEqual(block.ctrl.tmp_v, 'item');
  assert.strictEqual(block.ctrl.keys.join('.'), 'items');
  assert.strictEqual(block.children.length, 3);
});

QUnit.test('for block - variable chain in haystack', function(assert) {
  this.source =
    '{ for $item in $items.key1.key2 }' +
    '<p>{ $item | h }</p>' +
    '{ /for }';
  this.parse();

  const block = this.result[0];

  assert.strictEqual(block.type, 'for');
  assert.strictEqual(block.ctrl.keys.join('.'), 'items.key1.key2');
});
