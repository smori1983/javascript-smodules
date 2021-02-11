const templateParser = require('../../src/smodules/templateParser');

QUnit.module('templateParser - error', {
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

QUnit.test('holder block - no filters - error - tag not closed', function (assert) {
  this.source = '{ $foo';

  assert.throws(function () {
    this.parse();
  }, /syntax error/);
});

QUnit.test('holder block - no filters - error - space between $ and property name', function (assert) {
  this.source = '{ $ foo } has space between $ and property name.';

  assert.throws(function () {
    this.parse();
  }, /invalid variable expression/);
});

QUnit.test('holder block - no filters - error - dot between $ and property name', function (assert) {
  this.source = '{ $.foo }';

  assert.throws(function () {
    this.parse();
  }, /invalid variable expression/);
});

QUnit.test('holder block - no filters - error - dot after property name', function (assert) {
  this.source = '{ $foo. }';

  assert.throws(function () {
    this.parse();
  }, /invalid variable expression/);
});

QUnit.test('holder block - no filters - error - continuous dots', function (assert) {
  this.source = '{ $foo..bar }';

  assert.throws(function () {
    this.parse();
  }, /invalid variable expression/);
});

QUnit.test('holder block - filter - error - tag not closed', function (assert) {
  this.source = '{ $foo | filter';

  assert.throws(function () {
    this.parse();
  }, /syntax error/);
});

QUnit.test('holder block - filter - error - filter name has space', function (assert) {
  this.source = '{ $foo | invalid filter name }';

  assert.throws(function () {
    this.parse();
  }, /syntax error/);
});

QUnit.test('holder block - filter - error - filter name has symbol', function (assert) {
  this.source = '{ $foo | filter! }';

  assert.throws(function () {
    this.parse();
  }, /syntax error/);
});

QUnit.test('holder block - filter - error - no pipe', function (assert) {
  this.source = '{ $foo pipeNotFound }';

  assert.throws(function () {
    this.parse();
  }, /syntax error/);
});

QUnit.test('holder block - filter - error - no filter name before colon', function (assert) {
  this.source = '{ $foo | : 1 }';

  assert.throws(function () {
    this.parse();
  }, /filter name not found/);
});

QUnit.test('holder block - filter - error - no filter args after colon', function (assert) {
  this.source = '{ $foo | filter : }';

  assert.throws(function () {
    this.parse();
  }, /invalid filter args/);
});

QUnit.test('holder block - filter - error - colon only', function (assert) {
  this.source = '{ $foo | : }';

  assert.throws(function () {
    this.parse();
  }, /filter name not found/);
});

QUnit.test('holder block - filter with args - error - tag not closed', function (assert) {
  this.source = '{ $foo | filter : 1';

  assert.throws(function () {
    this.parse();
  }, /invalid filter args expression/);
});

QUnit.test('holder block - filter with args - error - args not separated', function (assert) {
  this.source = '{ $foo | filter : 1 2 }';

  assert.throws(function () {
    this.parse();
  }, /invalid filter args expression/);
});

QUnit.test('holder block - filter with args - error - NULL', function (assert) {
  this.source = '{ $foo | filter : NULL }';

  assert.throws(function () {
    this.parse();
  }, /invalid filter args/);
});

QUnit.test('holder block - filter with args - error - TRUE', function (assert) {
  this.source = '{ $foo | filter : TRUE }';

  assert.throws(function () {
    this.parse();
  }, /invalid filter args/);
});

QUnit.test('holder block - filter with args - error - FALSE', function (assert) {
  this.source = '{ $foo | filter : FALSE }';

  assert.throws(function () {
    this.parse();
  }, /invalid filter args/);
});

QUnit.test('holder block - filter with args - string - error - quote 1', function (assert) {
  this.source = '{ $foo | filter : \'test }';

  assert.throws(function () {
    this.parse();
  }, /string expression not closed/);
});

QUnit.test('holder block - filter with args - string - error - quote 2', function (assert) {
  this.source = '{ $foo | filter : test\' }';

  assert.throws(function () {
    this.parse();
  }, /invalid filter args/);
});

QUnit.test('holder block - filter with args - string - error - quote char 1', function (assert) {
  this.source = '{ $foo | filter : "test\' }';

  assert.throws(function () {
    this.parse();
  }, /string expression not closed/);
});

QUnit.test('holder block - filter with args - string - error - quote char 2', function (assert) {
  this.source = '{ $foo | filter : \'test" }';

  assert.throws(function () {
    this.parse();
  }, /string expression not closed/);
});
