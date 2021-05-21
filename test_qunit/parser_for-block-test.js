const Parser = require('../src/parser');

/**
 * @param {string} text
 * @return {AstNodeParseResult[]}
 */
const parse = (text) => {
  const parser = new Parser();

  return parser.parse(text);
};

QUnit.module('parser - for');

QUnit.test('only value part in dummy variable', (assert) => {
  const text =
    '{ for $item in $items }' +
    '<p>{ $item | h }</p>' +
    '{ endfor }';
  const result = parse(text);

  const block = result[0];

  assert.strictEqual(block.type, 'for_loop');
  assert.strictEqual(block.ctrl.tmp_k, null);
  assert.strictEqual(block.ctrl.tmp_v, 'item');
  assert.strictEqual(block.ctrl.keys.join('.'), 'items');
  assert.strictEqual(block.children.length, 3);
});

QUnit.test('use index in dummy variable', (assert) => {
  const text =
    '{ for $idx, $item in $items }' +
    '<p>{ $item | h }</p>' +
    '{ endfor }';
  const result = parse(text);

  const block = result[0];

  assert.strictEqual(block.type, 'for_loop');
  assert.strictEqual(block.ctrl.tmp_k, 'idx');
  assert.strictEqual(block.ctrl.tmp_v, 'item');
  assert.strictEqual(block.ctrl.keys.join('.'), 'items');
  assert.strictEqual(block.children.length, 3);
});

QUnit.test('use index in dummy variable - space before comma', (assert) => {
  const text =
    '{ for $idx , $item in $items }' +
    '<p>{ $item | h }</p>' +
    '{ endfor }';
  const result = parse(text);

  const block = result[0];

  assert.strictEqual(block.type, 'for_loop');
  assert.strictEqual(block.ctrl.tmp_k, 'idx');
  assert.strictEqual(block.ctrl.tmp_v, 'item');
  assert.strictEqual(block.ctrl.keys.join('.'), 'items');
  assert.strictEqual(block.children.length, 3);
});

QUnit.test('variable chain in haystack', (assert) => {
  const text =
    '{ for $item in $items.key1.key2 }' +
    '<p>{ $item | h }</p>' +
    '{ endfor }';
  const result = parse(text);

  const block = result[0];

  assert.strictEqual(block.type, 'for_loop');
  assert.strictEqual(block.ctrl.keys.join('.'), 'items.key1.key2');
});
