const templateParser = require('../../src/smodules/templateParser');

QUnit.module('templateParser', {
  beforeEach: function () {
    this.parser = templateParser.init();
  },
});

QUnit.test('holder block - no filters', function (assert) {
  const src = '{ $foo.bar }';
  const result = this.parser.parse(src);

  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].type, 'holder');
  assert.strictEqual(result[0].keys.length, 2);
  assert.strictEqual(result[0].keys[0], 'foo');
  assert.strictEqual(result[0].keys[1], 'bar');
  assert.strictEqual(result[0].filters.length, 0);
});

QUnit.test('holder block - filters with no args', function (assert) {
  const src = '{ $foo | filter1 | filter2 }';
  const result = this.parser.parse(src);

  const filter1 = result[0].filters[0];
  const filter2 = result[0].filters[1];

  assert.strictEqual(filter1.name, 'filter1');
  assert.strictEqual(filter1.args.length, 0);
  assert.strictEqual(filter2.name, 'filter2');
  assert.strictEqual(filter2.args.length, 0);
});

QUnit.test('holder block - filter with args - null, true and false', function (assert) {
  const src = '{ $foo | filter : null, true, false }';
  const result = this.parser.parse(src);

  const filter = result[0].filters[0];

  assert.strictEqual(filter.args[0], null);
  assert.strictEqual(filter.args[1], true);
  assert.strictEqual(filter.args[2], false);
});

QUnit.test('holder block - filter with args - string', function (assert) {
  const src = '{ $foo | filter : "test", "{delimiter}", "it\'s string" }';
  const result = this.parser.parse(src);

  const filter = result[0].filters[0];

  assert.strictEqual(filter.args[0], 'test');
  assert.strictEqual(filter.args[1], '{delimiter}');
  assert.strictEqual(filter.args[2], 'it\'s string');
});

QUnit.test('holder block - filter with args - number', function (assert) {
  const src = '{ $foo | filter : 0, 10, -99, 12.3, -0.123, 1e+1, 1e1, 10e-1 }';
  const result = this.parser.parse(src);

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
