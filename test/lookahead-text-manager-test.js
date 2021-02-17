const SourceTextManager = require('../src/source-text-manager');

QUnit.module('LookaheadTextManager');

QUnit.test('getSourceText()', function (assert) {
  const source = '123456789';
  const sourceTextManager = new SourceTextManager(source);

  sourceTextManager.next('123');

  const lookaheadTextManager = sourceTextManager.lookaheadTextManager();

  assert.strictEqual(sourceTextManager.getSourceText(), source);
  assert.strictEqual(lookaheadTextManager.getSourceText(), source);
});

QUnit.test('getPtr() - 1', function (assert) {
  const source = '123456789';
  const sourceTextManager = new SourceTextManager(source);

  const lookaheadTextManager = sourceTextManager.lookaheadTextManager();

  sourceTextManager.next('123');

  assert.strictEqual(sourceTextManager.getPtr(), 3);
  assert.strictEqual(lookaheadTextManager.getPtr(), 0);
});

QUnit.test('getPtr() - 2', function (assert) {
  const source = '123456789';
  const sourceTextManager = new SourceTextManager(source);

  sourceTextManager.next('123');

  const lookaheadTextManager = sourceTextManager.lookaheadTextManager();

  assert.strictEqual(sourceTextManager.getPtr(), 3);
  assert.strictEqual(lookaheadTextManager.getPtr(), 3);
});

QUnit.test('getPtr() - 3', function (assert) {
  const source = '123456789';
  const sourceTextManager = new SourceTextManager(source);

  sourceTextManager.next('123');

  const lookaheadTextManager = sourceTextManager.lookaheadTextManager();

  lookaheadTextManager.next('456');

  assert.strictEqual(sourceTextManager.getPtr(), 3);
  assert.strictEqual(lookaheadTextManager.getPtr(), 6);
});

QUnit.test('getChar()', function (assert) {
  const source = '123456789';
  const sourceTextManager = new SourceTextManager(source);

  sourceTextManager.next('123');

  const lookaheadTextManager = sourceTextManager.lookaheadTextManager();

  lookaheadTextManager.next('456');

  assert.strictEqual(sourceTextManager.getChar(), '4');
  assert.strictEqual(lookaheadTextManager.getChar(), '7');
});
