const templateParser = require('../../src/smodules/templateParser');

QUnit.module('templateParser - error', {
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

QUnit.test('for block - error - lack of index argument', function(assert) {
  this.source = '{for , $item in $items}<p>{$item}</p>{/for}';

  assert.throws(function() {
    this.parse();
  }, /syntax error/);
});

QUnit.test('for block - error - invalid index argument', function(assert) {
  this.source = '{for $, $item in $items}<p>{$item}</p>{/for}';

  assert.throws(function() {
    this.parse();
  }, /tmp variable not found/);
});

QUnit.test('for block - error - lack of comma', function(assert) {
  this.source = '{for $idx $item in $items}<p>{$item}</p>{/for}';

  assert.throws(function() {
    this.parse();
  }, /invalid for expression/);
});

QUnit.test('for block - error - lack of value argument', function(assert) {
  this.source = '{for $idx , in $items}<p>{$idx}</p>{/for}';

  assert.throws(function() {
    this.parse();
  }, /syntax error/);
});

QUnit.test('for block - error - invalid value argument', function(assert) {
  this.source = '{for $idx , $ in $items}<p>{$idx}</p>{/for}';

  assert.throws(function() {
    this.parse();
  }, /tmp variable not found/);
});

QUnit.test('for block - error - lack of in 1', function(assert) {
  this.source = '{for $item $items}<p>{$item}</p>{/for}';

  assert.throws(function() {
    this.parse();
  }, /invalid for expression/);
});

QUnit.test('for block - error - lack of in 2', function(assert) {
  this.source = '{for $idx , $item $items}<p>{$item}</p>{/for}';

  assert.throws(function() {
    this.parse();
  }, /invalid for expression/);
});

QUnit.test('for block - error - lack of haystack', function(assert) {
  this.source = '{for $idx , $item in}<p>{$item}</p>{/for}';

  assert.throws(function() {
    this.parse();
  }, /invalid for expression/);
});

QUnit.test('for block - error - too many elements 1', function(assert) {
  this.source = '{for $idx , $item , $foo in $items}<p>{$item}</p>{/for}';

  assert.throws(function() {
    this.parse();
  }, /invalid for expression/);
});

QUnit.test('for block - error - too many elements 2', function(assert) {
  this.source = '{for $idx , $item in $items1 , $items2}<p>{$item}</p>{/for}';

  assert.throws(function() {
    this.parse();
  }, /syntax error/);
});

QUnit.test('for block - error - too many elements 3', function(assert) {
  this.source = '{for $idx , $item in $items1 $items2}<p>{$item}</p>{/for}';

  assert.throws(function() {
    this.parse();
  }, /syntax error/);
});

QUnit.test('for block - error - no space around in 1', function(assert) {
  this.source = '{for $itemin $items}<p>{$item}</p>{/for}';

  assert.throws(function() {
    this.parse();
  }, /invalid for expression/);
});

QUnit.test('for block - error - no space around in 2', function(assert) {
  this.source = '{for $item in$items}<p>{$item}</p>{/for}';

  assert.throws(function() {
    this.parse();
  }, /invalid for expression/);
});

QUnit.test('for block - error - no space around in 3', function(assert) {
  this.source = '{for $idx, $itemin $items}<p>{$item}</p>{/for}';

  assert.throws(function() {
    this.parse();
  }, /invalid for expression/);
});

QUnit.test('for block - error - no space around in 4', function(assert) {
  this.source = '{for $idx, $item in$items}<p>{$item}</p>{/for}';

  assert.throws(function() {
    this.parse();
  }, /invalid for expression/);
});
