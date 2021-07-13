const describe = require('mocha').describe;
const it = require('mocha').it;
const assert = require('assert');
const QueueHash = require('../src/data.queueHash');

describe('data.queueHash', () => {
  it('pushTo and popFrom', () => {
    const qh = new QueueHash();

    qh.pushTo('list', 'a');
    qh.pushTo('list', 'b');

    assert.strictEqual(qh.has('list'), true);
    assert.strictEqual(qh.sizeOf('list'), 2);
    assert.strictEqual(qh.popFrom('list'), 'a');
    assert.strictEqual(qh.sizeOf('list'), 1);
    assert.strictEqual(qh.popFrom('list'), 'b');
    assert.strictEqual(qh.sizeOf('list'), 0);

    qh.remove('list');

    assert.strictEqual(qh.has('list'), false);
  });

  it('check keys', () => {
    const qh = new QueueHash();

    qh.pushTo('queue1', 'a');

    assert.strictEqual(qh.getKeys().length, 1);
    assert.strictEqual(qh.getKeys()[0], 'queue1');

    qh.pushTo('queue2', 'A');

    assert.strictEqual(qh.getKeys().length, 2);
    assert.strictEqual(qh.getKeys()[0], 'queue1');
    assert.strictEqual(qh.getKeys()[1], 'queue2');

    qh.clear();

    assert.strictEqual(qh.getKeys().length, 0);
  });

  it('using non-existent key', () => {
    const qh = new QueueHash();

    assert.strictEqual(qh.has('unknown'), false);
    assert.strictEqual(qh.sizeOf('unknown'), 0);
    assert.strictEqual(typeof qh.popFrom('unknown'), 'undefined');
  });
});
