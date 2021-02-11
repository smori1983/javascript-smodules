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

QUnit.test('holder block - no filters', function (assert) {
  this.source = '{ $foo.bar }';
  this.parse();

  assert.strictEqual(this.result.length, 1);
  assert.strictEqual(this.result[0].type, 'holder');
  assert.strictEqual(this.result[0].keys.length, 2);
  assert.strictEqual(this.result[0].keys[0], 'foo');
  assert.strictEqual(this.result[0].keys[1], 'bar');
  assert.strictEqual(this.result[0].filters.length, 0);
});


QUnit.test('holder block - filters with no args', function (assert) {
  this.source = '{ $foo | filter1 | filter2 }';
  this.parse();

  const filter1 = this.result[0].filters[0];
  const filter2 = this.result[0].filters[1];

  assert.strictEqual(filter1.name, 'filter1');
  assert.strictEqual(filter1.args.length, 0);
  assert.strictEqual(filter2.name, 'filter2');
  assert.strictEqual(filter2.args.length, 0);
});

QUnit.test('holder block - filter with args - null, true and false', function (assert) {
  this.source = '{ $foo | filter : null, true, false }';
  this.parse();

  const filter = this.result[0].filters[0];

  assert.strictEqual(filter.args[0], null);
  assert.strictEqual(filter.args[1], true);
  assert.strictEqual(filter.args[2], false);
});

QUnit.test('holder block - filter with args - string', function (assert) {
  this.source = '{ $foo | filter : "test", "{delimiter}", "it\'s string" }';
  this.parse();

  const filter = this.result[0].filters[0];

  assert.strictEqual(filter.args[0], 'test');
  assert.strictEqual(filter.args[1], '{delimiter}');
  assert.strictEqual(filter.args[2], 'it\'s string');
});

QUnit.test('holder block - filter with args - number', function (assert) {
  this.source = '{ $foo | filter : 0, 10, -99, 12.3, -0.123, 1e+1, 1e1, 10e-1 }';
  this.parse();

  const filter = this.result[0].filters[0];

  assert.strictEqual(filter.args[0], 0);
  assert.strictEqual(filter.args[1], 10);
  assert.strictEqual(filter.args[2], -99);
  assert.strictEqual(filter.args[3], 12.3);
  assert.strictEqual(filter.args[4], -0.123);
  assert.strictEqual(filter.args[5], 10);
  assert.strictEqual(filter.args[6], 10);
  assert.strictEqual(filter.args[7], 1);
});
