const Parser = require('../src/parser');

/**
 * @param {string} text
 * @return {AstNodeParseResult[]}
 */
const parse = (text) => {
  const parser = new Parser();

  return parser.parse(text);
};

QUnit.module('parser - holder');

QUnit.test('no filters', (assert) => {
  const text = '{ $foo.bar }';
  const result = parse(text);

  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].type, 'holder');
  assert.strictEqual(result[0].keys.length, 2);
  assert.strictEqual(result[0].keys[0], 'foo');
  assert.strictEqual(result[0].keys[1], 'bar');
  assert.strictEqual(result[0].filters.length, 0);
});

QUnit.test('filters with no args', (assert) => {
  const text = '{ $foo | filter1 | filter2 }';
  const result = parse(text);

  const filter1 = result[0].filters[0];
  const filter2 = result[0].filters[1];

  assert.strictEqual(filter1.name, 'filter1');
  assert.strictEqual(filter1.args.length, 0);
  assert.strictEqual(filter2.name, 'filter2');
  assert.strictEqual(filter2.args.length, 0);
});

QUnit.test('filter with args - null, true and false', (assert) => {
  const text = '{ $foo | filter : null, true, false }';
  const result = parse(text);

  const filter = result[0].filters[0];

  assert.strictEqual(filter.args[0], null);
  assert.strictEqual(filter.args[1], true);
  assert.strictEqual(filter.args[2], false);
});

QUnit.test('filter with args - string', (assert) => {
  const text = '{ $foo | filter : "test", "{delimiter}", "it\'s string" }';
  const result = parse(text);

  const filter = result[0].filters[0];

  assert.strictEqual(filter.args[0], 'test');
  assert.strictEqual(filter.args[1], '{delimiter}');
  assert.strictEqual(filter.args[2], 'it\'s string');
});

QUnit.test('filter with args - number', (assert) => {
  const text = '{ $foo | filter : 0, 10, -99, 12.3, -0.123, 1e+1, 1e1, 10e-1 }';
  const result = parse(text);

  const filter = result[0].filters[0];

  assert.strictEqual(filter.args[0], 0);
  assert.strictEqual(filter.args[1], 10);
  assert.strictEqual(filter.args[2], -99);
  assert.strictEqual(filter.args[3], 12.3);
  assert.strictEqual(filter.args[4], -0.123);
  assert.strictEqual(filter.args[5], 10);
  assert.strictEqual(filter.args[6], 10);
  assert.strictEqual(filter.args[7], 1);
});
