const contextBuilder = require('../../test_lib/parse-context-builder');

QUnit.module('ast-node - value - bool');

QUnit.test('read - error - empty string', function (assert) {
  const context = contextBuilder.build('');

  assert.deepEqual(context.read('value_bool'), false);
});

QUnit.test('read - error - uppercase', function (assert) {
  const context = contextBuilder.build('TRUE');

  assert.deepEqual(context.read('value_bool'), false);
});

QUnit.test('read - ok - space', function (assert) {
  const context = contextBuilder.build(' true ');

  assert.deepEqual(context.read('value_bool'), true);
});

QUnit.test('read - ok - operator no space - 1', function (assert) {
  const context = contextBuilder.build('true===true');

  assert.deepEqual(context.read('value_bool'), true);
});

QUnit.test('read - ok - operator no space - 2', function (assert) {
  const context = contextBuilder.build('true!==true');

  assert.deepEqual(context.read('value_bool'), true);
});

QUnit.module('ast-node - value - null');

QUnit.test('read - error - empty string', function (assert) {
  const context = contextBuilder.build('');

  assert.deepEqual(context.read('value_null'), false);
});

QUnit.test('read - error - uppercase', function (assert) {
  const context = contextBuilder.build('NULL');

  assert.deepEqual(context.read('value_null'), false);
});

QUnit.test('read - ok - space', function (assert) {
  const context = contextBuilder.build(' null ');

  assert.deepEqual(context.read('value_null'), true);
});

QUnit.test('read - ok - operator no space - 1', function (assert) {
  const context = contextBuilder.build('null===true');

  assert.deepEqual(context.read('value_null'), true);
});

QUnit.test('read - ok - operator no space - 2', function (assert) {
  const context = contextBuilder.build('null!==true');

  assert.deepEqual(context.read('value_null'), true);
});
