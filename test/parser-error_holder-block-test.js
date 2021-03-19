const Parser = require('../src/parser');

QUnit.module('parser - error', {
  beforeEach: function () {
    this.parser = new Parser();
  },
});

QUnit.test('holder block - no $ mark', function (assert) {
  const src = '{ foo }';

  assert.throws(function () {
    this.parser.parse(src);
  }, /unknown tag/);
});

QUnit.test('holder block - no filters - error - tag not closed', function (assert) {
  const src = '{ $foo';

  assert.throws(function () {
    this.parser.parse(src);
  }, /syntax error/);
});

QUnit.test('holder block - no filters - error - space between $ and property name', function (assert) {
  const src = '{ $ foo } has space between $ and property name.';

  assert.throws(function () {
    this.parser.parse(src);
  }, /invalid variable expression/);
});

QUnit.test('holder block - no filters - error - dot between $ and property name', function (assert) {
  const src = '{ $.foo }';

  assert.throws(function () {
    this.parser.parse(src);
  }, /invalid variable expression/);
});

QUnit.test('holder block - no filters - error - dot after property name', function (assert) {
  const src = '{ $foo. }';

  assert.throws(function () {
    this.parser.parse(src);
  }, /invalid variable expression/);
});

QUnit.test('holder block - no filters - error - continuous dots', function (assert) {
  const src = '{ $foo..bar }';

  assert.throws(function () {
    this.parser.parse(src);
  }, /invalid variable expression/);
});

QUnit.test('holder block - filter - error - tag not closed 1', function (assert) {
  const src = '{ $foo | filter';

  assert.throws(function () {
    this.parser.parse(src);
  }, /syntax error/);
});

QUnit.test('holder block - filter - error - tag not closed 2', function (assert) {
  const src = '{ $foo | filter1 | filter2 | filter3';

  assert.throws(function () {
    this.parser.parse(src);
  }, /syntax error/);
});

QUnit.test('holder block - filter - error - tag not closed 3', function (assert) {
  const src = '{if true }{ $foo | filter1 {endif}';

  assert.throws(function () {
    this.parser.parse(src);
  }, /syntax error/);
});

QUnit.test('holder block - filter - error - filter name has space', function (assert) {
  const src = '{ $foo | invalid filter name }';

  assert.throws(function () {
    this.parser.parse(src);
  }, /syntax error/);
});

QUnit.test('holder block - filter - error - filter name has symbol', function (assert) {
  const src = '{ $foo | filter! }';

  assert.throws(function () {
    this.parser.parse(src);
  }, /syntax error/);
});

QUnit.test('holder block - filter - error - no pipe', function (assert) {
  const src = '{ $foo pipeNotFound }';

  assert.throws(function () {
    this.parser.parse(src);
  }, /syntax error/);
});

QUnit.test('holder block - filter - error - no filter name before colon', function (assert) {
  const src = '{ $foo | : 1 }';

  assert.throws(function () {
    this.parser.parse(src);
  }, /filter name not found/);
});

QUnit.test('holder block - filter - error - no filter args after colon', function (assert) {
  const src = '{ $foo | filter : }';

  assert.throws(function () {
    this.parser.parse(src);
  }, /invalid filter args/);
});

QUnit.test('holder block - filter - error - colon only', function (assert) {
  const src = '{ $foo | : }';

  assert.throws(function () {
    this.parser.parse(src);
  }, /filter name not found/);
});

QUnit.test('holder block - filter with args - error - tag not closed', function (assert) {
  const src = '{ $foo | filter : 1';

  assert.throws(function () {
    this.parser.parse(src);
  }, /invalid filter args expression/);
});

QUnit.test('holder block - filter with args - error - args not separated', function (assert) {
  const src = '{ $foo | filter : 1 2 }';

  assert.throws(function () {
    this.parser.parse(src);
  }, /invalid filter args expression/);
});

QUnit.test('holder block - filter with args - error - NULL', function (assert) {
  const src = '{ $foo | filter : NULL }';

  assert.throws(function () {
    this.parser.parse(src);
  }, /invalid filter args/);
});

QUnit.test('holder block - filter with args - error - TRUE', function (assert) {
  const src = '{ $foo | filter : TRUE }';

  assert.throws(function () {
    this.parser.parse(src);
  }, /invalid filter args/);
});

QUnit.test('holder block - filter with args - error - FALSE', function (assert) {
  const src = '{ $foo | filter : FALSE }';

  assert.throws(function () {
    this.parser.parse(src);
  }, /invalid filter args/);
});

QUnit.test('holder block - filter with args - string - error - quote 1', function (assert) {
  const src = '{ $foo | filter : \'test }';

  assert.throws(function () {
    this.parser.parse(src);
  }, /invalid filter args/);
});

QUnit.test('holder block - filter with args - string - error - quote 2', function (assert) {
  const src = '{ $foo | filter : test\' }';

  assert.throws(function () {
    this.parser.parse(src);
  }, /invalid filter args/);
});

QUnit.test('holder block - filter with args - string - error - quote char 1', function (assert) {
  const src = '{ $foo | filter : "test\' }';

  assert.throws(function () {
    this.parser.parse(src);
  }, /invalid filter args/);
});

QUnit.test('holder block - filter with args - string - error - quote char 2', function (assert) {
  const src = '{ $foo | filter : \'test" }';

  assert.throws(function () {
    this.parser.parse(src);
  }, /invalid filter args/);
});
