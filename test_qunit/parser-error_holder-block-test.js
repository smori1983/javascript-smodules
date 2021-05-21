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

QUnit.module('parser - holder - error');

QUnit.test('no $ mark', (assert) => {
  parseError(assert, '{ foo }');
});

QUnit.test('no filters - tag not closed', (assert) => {
  parseError(assert, '{ $foo');
});

QUnit.test('no filters - space between $ and property name', (assert) => {
  parseError(assert, '{ $ foo } has space between $ and property name.');
});

QUnit.test('no filters - dot between $ and property name', (assert) => {
  parseError(assert, '{ $.foo }');
});

QUnit.test('no filters - dot after property name', (assert) => {
  parseError(assert, '{ $foo. }');
});

QUnit.test('no filters - continuous dots', (assert) => {
  parseError(assert, '{ $foo..bar }');
});

QUnit.test('filter - tag not closed 1', (assert) => {
  parseError(assert, '{ $foo | filter');
});

QUnit.test('filter - tag not closed 2', (assert) => {
  parseError(assert, '{ $foo | filter1 | filter2 | filter3');
});

QUnit.test('filter - tag not closed 3', (assert) => {
  parseError(assert, '{if true }{ $foo | filter1 {endif}');
});

QUnit.test('filter - filter name has space', (assert) => {
  parseError(assert, '{ $foo | invalid filter name }');
});

QUnit.test('filter - filter name has symbol', (assert) => {
  parseError(assert, '{ $foo | filter! }');
});

QUnit.test('filter - no pipe', (assert) => {
  parseError(assert, '{ $foo pipeNotFound }');
});

QUnit.test('filter - no filter name before colon', (assert) => {
  parseError(assert, '{ $foo | : 1 }');
});

QUnit.test('filter - no filter args after colon', (assert) => {
  parseError(assert, '{ $foo | filter : }');
});

QUnit.test('filter - colon only', (assert) => {
  parseError(assert, '{ $foo | : }');
});

QUnit.test('filter with args - tag not closed', (assert) => {
  parseError(assert, '{ $foo | filter : 1');
});

QUnit.test('filter with args - args not separated', (assert) => {
  parseError(assert, '{ $foo | filter : 1 2 }');
});

QUnit.test('filter with args - NULL', (assert) => {
  parseError(assert, '{ $foo | filter : NULL }');
});

QUnit.test('filter with args - TRUE', (assert) => {
  parseError(assert, '{ $foo | filter : TRUE }');
});

QUnit.test('filter with args - FALSE', (assert) => {
  parseError(assert, '{ $foo | filter : FALSE }');
});

QUnit.test('filter with args - string - quote 1', (assert) => {
  parseError(assert, '{ $foo | filter : \'test }');
});

QUnit.test('filter with args - string - quote 2', (assert) => {
  parseError(assert, '{ $foo | filter : test\' }');
});

QUnit.test('filter with args - string - quote char 1', (assert) => {
  parseError(assert, '{ $foo | filter : "test\' }');
});

QUnit.test('filter with args - string - quote char 2', (assert) => {
  parseError(assert, '{ $foo | filter : \'test" }');
});
