const Parser = require('../src/parser');

/**
 * @param {Assert} assert
 * @param {string} text
 */
const parseError = (assert, text) => {
  const parser = new Parser();

  assert.throws(() => {
    parser.parse(text);
  }, Error);
};

QUnit.module('parser - for - error');

QUnit.test('lack of index argument', (assert) => {
  parseError(assert, '{for , $item in $items}<p>{$item}</p>{endfor}');
});

QUnit.test('invalid index argument', (assert) => {
  parseError(assert, '{for $, $item in $items}<p>{$item}</p>{endfor}');
});

QUnit.test('lack of comma', (assert) => {
  parseError(assert, '{for $idx $item in $items}<p>{$item}</p>{endfor}');
});

QUnit.test('lack of value argument', (assert) => {
  parseError(assert, '{for $idx , in $items}<p>{$idx}</p>{endfor}');
});

QUnit.test('invalid value argument', (assert) => {
  parseError(assert, '{for $idx , $ in $items}<p>{$idx}</p>{endfor}');
});

QUnit.test('lack of in 1', (assert) => {
  parseError(assert, '{for $item $items}<p>{$item}</p>{endfor}');
});

QUnit.test('lack of in 2', (assert) => {
  parseError(assert, '{for $idx , $item $items}<p>{$item}</p>{endfor}');
});

QUnit.test('lack of haystack', (assert) => {
  parseError(assert, '{for $idx , $item in}<p>{$item}</p>{endfor}');
});

QUnit.test('too many elements 1', (assert) => {
  parseError(assert, '{for $idx , $item , $foo in $items}<p>{$item}</p>{endfor}');
});

QUnit.test('too many elements 2', (assert) => {
  parseError(assert, '{for $idx , $item in $items1 , $items2}<p>{$item}</p>{endfor}');
});

QUnit.test('too many elements 3', (assert) => {
  parseError(assert, '{for $idx , $item in $items1 $items2}<p>{$item}</p>{endfor}');
});

QUnit.test('no space after for', (assert) => {
  parseError(assert, '{for$item in $items}<p>{$item}</p>{endfor}');
});

QUnit.test('no space around in 1', (assert) => {
  parseError(assert, '{for $itemin $items}<p>{$item}</p>{endfor}');
});

QUnit.test('no space around in 2', (assert) => {
  parseError(assert, '{for $item in$items}<p>{$item}</p>{endfor}');
});

QUnit.test('no space around in 3', (assert) => {
  parseError(assert, '{for $idx, $itemin $items}<p>{$item}</p>{endfor}');
});

QUnit.test('no space around in 4', (assert) => {
  parseError(assert, '{for $idx, $item in$items}<p>{$item}</p>{endfor}');
});
