const templateParser = require('../../src/smodules/templateParser');

QUnit.module('templateParser - error', {
  before: function() {
    this.parse = function (src) {
      this.parser.parse(src);
    };
  },
  beforeEach: function () {
    this.parser = templateParser.init();
  },
});

QUnit.test('for block - error - lack of index argument', function (assert) {
  const src = '{for , $item in $items}<p>{$item}</p>{/for}';

  assert.throws(function () {
    this.parse(src);
  }, /syntax error/);
});

QUnit.test('for block - error - invalid index argument', function (assert) {
  const src = '{for $, $item in $items}<p>{$item}</p>{/for}';

  assert.throws(function () {
    this.parse(src);
  }, /tmp variable not found/);
});

QUnit.test('for block - error - lack of comma', function (assert) {
  const src = '{for $idx $item in $items}<p>{$item}</p>{/for}';

  assert.throws(function () {
    this.parse(src);
  }, /invalid for expression/);
});

QUnit.test('for block - error - lack of value argument', function (assert) {
  const src = '{for $idx , in $items}<p>{$idx}</p>{/for}';

  assert.throws(function () {
    this.parse(src);
  }, /syntax error/);
});

QUnit.test('for block - error - invalid value argument', function (assert) {
  const src = '{for $idx , $ in $items}<p>{$idx}</p>{/for}';

  assert.throws(function () {
    this.parse(src);
  }, /tmp variable not found/);
});

QUnit.test('for block - error - lack of in 1', function (assert) {
  const src = '{for $item $items}<p>{$item}</p>{/for}';

  assert.throws(function () {
    this.parse(src);
  }, /invalid for expression/);
});

QUnit.test('for block - error - lack of in 2', function (assert) {
  const src = '{for $idx , $item $items}<p>{$item}</p>{/for}';

  assert.throws(function () {
    this.parse(src);
  }, /invalid for expression/);
});

QUnit.test('for block - error - lack of haystack', function (assert) {
  const src = '{for $idx , $item in}<p>{$item}</p>{/for}';

  assert.throws(function () {
    this.parse(src);
  }, /invalid for expression/);
});

QUnit.test('for block - error - too many elements 1', function (assert) {
  const src = '{for $idx , $item , $foo in $items}<p>{$item}</p>{/for}';

  assert.throws(function () {
    this.parse(src);
  }, /invalid for expression/);
});

QUnit.test('for block - error - too many elements 2', function (assert) {
  const src = '{for $idx , $item in $items1 , $items2}<p>{$item}</p>{/for}';

  assert.throws(function () {
    this.parse(src);
  }, /syntax error/);
});

QUnit.test('for block - error - too many elements 3', function (assert) {
  const src = '{for $idx , $item in $items1 $items2}<p>{$item}</p>{/for}';

  assert.throws(function () {
    this.parse(src);
  }, /syntax error/);
});

QUnit.test('for block - error - no space around in 1', function (assert) {
  const src = '{for $itemin $items}<p>{$item}</p>{/for}';

  assert.throws(function () {
    this.parse(src);
  }, /invalid for expression/);
});

QUnit.test('for block - error - no space around in 2', function (assert) {
  const src = '{for $item in$items}<p>{$item}</p>{/for}';

  assert.throws(function () {
    this.parse(src);
  }, /invalid for expression/);
});

QUnit.test('for block - error - no space around in 3', function (assert) {
  const src = '{for $idx, $itemin $items}<p>{$item}</p>{/for}';

  assert.throws(function () {
    this.parse(src);
  }, /invalid for expression/);
});

QUnit.test('for block - error - no space around in 4', function (assert) {
  const src = '{for $idx, $item in$items}<p>{$item}</p>{/for}';

  assert.throws(function () {
    this.parse(src);
  }, /invalid for expression/);
});
