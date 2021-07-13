const describe = require('mocha').describe;
const it = require('mocha').it;
const assert = require('assert');
const SourceTextManager = require('../src/source-text-manager');

describe('LookaheadTextManager', () => {
  it('getSourceText()', () => {
    const source = '123456789';
    const sourceTextManager = new SourceTextManager(source);

    sourceTextManager.next('123');

    const lookaheadTextManager = sourceTextManager.lookaheadTextManager();

    assert.strictEqual(sourceTextManager.getSourceText(), source);
    assert.strictEqual(lookaheadTextManager.getSourceText(), source);
  });

  it('getPtr() - 1', () => {
    const source = '123456789';
    const sourceTextManager = new SourceTextManager(source);

    const lookaheadTextManager = sourceTextManager.lookaheadTextManager();

    sourceTextManager.next('123');

    assert.strictEqual(sourceTextManager.getPtr(), 3);
    assert.strictEqual(lookaheadTextManager.getPtr(), 0);
  });

  it('getPtr() - 2', () => {
    const source = '123456789';
    const sourceTextManager = new SourceTextManager(source);

    sourceTextManager.next('123');

    const lookaheadTextManager = sourceTextManager.lookaheadTextManager();

    assert.strictEqual(sourceTextManager.getPtr(), 3);
    assert.strictEqual(lookaheadTextManager.getPtr(), 3);
  });

  it('getPtr() - 3', () => {
    const source = '123456789';
    const sourceTextManager = new SourceTextManager(source);

    sourceTextManager.next('123');

    const lookaheadTextManager = sourceTextManager.lookaheadTextManager();

    lookaheadTextManager.next('456');

    assert.strictEqual(sourceTextManager.getPtr(), 3);
    assert.strictEqual(lookaheadTextManager.getPtr(), 6);
  });

  it('getChar()', () => {
    const source = '123456789';
    const sourceTextManager = new SourceTextManager(source);

    sourceTextManager.next('123');

    const lookaheadTextManager = sourceTextManager.lookaheadTextManager();

    lookaheadTextManager.next('456');

    assert.strictEqual(sourceTextManager.getChar(), '4');
    assert.strictEqual(lookaheadTextManager.getChar(), '7');
  });
});
