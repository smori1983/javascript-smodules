const contextBuilder = require('../../test_lib/parse-context-builder');
const TempVar = require('../../src/ast-node/temp-var');

QUnit.module('ast-node - temp-var', {
  beforeEach: function () {
    this.astNode = new TempVar();
  },
});

QUnit.test('read - error - empty string', function (assert) {
  const context = contextBuilder.build('');

  assert.deepEqual(this.astNode.read(context), false);
});

QUnit.test('read - error - $', function (assert) {
  const context = contextBuilder.build('$');

  assert.deepEqual(this.astNode.read(context), false);
});

QUnit.test('read - error - $$', function (assert) {
  const context = contextBuilder.build('$$');

  assert.deepEqual(this.astNode.read(context), false);
});

QUnit.test('read - error - $.', function (assert) {
  const context = contextBuilder.build('$.');

  assert.deepEqual(this.astNode.read(context), false);
});

QUnit.test('read - error - $-', function (assert) {
  const context = contextBuilder.build('$-');

  assert.deepEqual(this.astNode.read(context), false);
});

QUnit.test('read - ok - $a', function (assert) {
  const context = contextBuilder.build('$a');

  assert.deepEqual(this.astNode.read(context), true);
});

QUnit.test('read - ok - $a=', function (assert) {
  const context = contextBuilder.build('$a=');

  assert.deepEqual(this.astNode.read(context), true);
});

QUnit.test('read - ok - $a!==$b', function (assert) {
  const context = contextBuilder.build('$a!==');

  assert.deepEqual(this.astNode.read(context), true);
});

QUnit.test('parse - ok - $a', function (assert) {
  const context = contextBuilder.build('$a');
  const ast = this.astNode.parse(context);
  const expected = {
    type: 'temp_var',
    expr: 'a',
  };

  assert.deepEqual(ast, expected);
});

QUnit.test('parse - ok - $a=', function (assert) {
  const context = contextBuilder.build('$a=');
  const ast = this.astNode.parse(context);
  const expected = {
    type: 'temp_var',
    expr: 'a',
  };

  assert.deepEqual(ast, expected);
});

QUnit.test('parse - ok - $a!==', function (assert) {
  const context = contextBuilder.build('$a!==');
  const ast = this.astNode.parse(context);
  const expected = {
    type: 'temp_var',
    expr: 'a',
  };

  assert.deepEqual(ast, expected);
});
