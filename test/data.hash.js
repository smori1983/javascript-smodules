const describe = require('mocha').describe;
const it = require('mocha').it;
const assert = require('assert');
const Hash = require('../src/data.hash');

describe('data.hash', () => {
  it('add', () => {
    const hash = new Hash();

    hash.add('key1', 'value1');

    assert.strictEqual(hash.has('key1'), true);
    assert.strictEqual(hash.get('key1'), 'value1');

    hash.add('key1', 'value2');

    assert.strictEqual(hash.get('key1'), 'value2');
  });

  it('remove', () => {
    const hash = new Hash();

    hash.add('name', 'anonymous');

    assert.strictEqual(hash.has('name'), true);

    hash.remove('name');

    assert.strictEqual(hash.has('name'), false);
    assert.strictEqual(typeof hash.get('name'), 'undefined');
  });

  it('clear', () => {
    const hash = new Hash();

    hash.add('name', 'anonymous');
    hash.add('mail', 'anonymous@example.com');
    hash.clear();

    assert.strictEqual(hash.has('name'), false);
    assert.strictEqual(hash.has('mail'), false);
  });

  it('getKeys', () => {
    const hash = new Hash();

    hash.add('key1', 'value1');
    hash.add('key3', 'value1');
    hash.add('key2', 'value1');

    assert.deepStrictEqual(hash.getKeys(), ['key1', 'key2', 'key3']);
  });
});
