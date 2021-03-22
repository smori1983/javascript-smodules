const contextBuilder = require('../../test_lib/parse-context-builder');

QUnit.module('ast-node - temp-var');

QUnit.test('read - error - empty string', function (assert) {
  const context = contextBuilder.build('');

  assert.deepEqual(context.read('temp_var'), false);
});

QUnit.test('read - error - $', function (assert) {
  const context = contextBuilder.build('$');

  assert.deepEqual(context.read('temp_var'), false);
});

QUnit.test('read - error - $$', function (assert) {
  const context = contextBuilder.build('$$');

  assert.deepEqual(context.read('temp_var'), false);
});

QUnit.test('read - error - $.', function (assert) {
  const context = contextBuilder.build('$.');

  assert.deepEqual(context.read('temp_var'), false);
});

QUnit.test('read - error - $-', function (assert) {
  const context = contextBuilder.build('$-');

  assert.deepEqual(context.read('temp_var'), false);
});

QUnit.test('read - ok - $a', function (assert) {
  const context = contextBuilder.build('$a');

  assert.deepEqual(context.read('temp_var'), true);
});

QUnit.test('read - ok - $a=', function (assert) {
  const context = contextBuilder.build('$a=');

  assert.deepEqual(context.read('temp_var'), true);
});

QUnit.test('read - ok - $a!==$b', function (assert) {
  const context = contextBuilder.build('$a!==');

  assert.deepEqual(context.read('temp_var'), true);
});

QUnit.test('parse - ok - $a', function (assert) {
  const context = contextBuilder.build('$a');
  const ast = context.parse('temp_var');
  const expected = {
    type: 'temp_var',
    expr: 'a',
  };

  assert.deepEqual(ast, expected);
});

QUnit.test('parse - ok - $a=', function (assert) {
  const context = contextBuilder.build('$a=');
  const ast = context.parse('temp_var');
  const expected = {
    type: 'temp_var',
    expr: 'a',
  };

  assert.deepEqual(ast, expected);
});

QUnit.test('parse - ok - $a!==', function (assert) {
  const context = contextBuilder.build('$a!==');
  const ast = context.parse('temp_var');
  const expected = {
    type: 'temp_var',
    expr: 'a',
  };

  assert.deepEqual(ast, expected);
});
