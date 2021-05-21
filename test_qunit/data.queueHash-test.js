const QueueHash = require('../src/data.queueHash');

QUnit.module('data.queueHash', {
  beforeEach: function () {
    this.qh = new QueueHash();
  },
});

QUnit.test('pushTo and popFrom', function (assert) {
  this.qh.pushTo('list', 'a');
  this.qh.pushTo('list', 'b');

  assert.strictEqual(this.qh.has('list'), true);
  assert.strictEqual(this.qh.sizeOf('list'), 2);
  assert.strictEqual(this.qh.popFrom('list'), 'a');
  assert.strictEqual(this.qh.sizeOf('list'), 1);
  assert.strictEqual(this.qh.popFrom('list'), 'b');
  assert.strictEqual(this.qh.sizeOf('list'), 0);

  this.qh.remove('list');

  assert.strictEqual(this.qh.has('list'), false);
});

QUnit.test('check keys', function (assert) {
  this.qh.pushTo('queue1', 'a');

  assert.strictEqual(this.qh.getKeys().length, 1);
  assert.strictEqual(this.qh.getKeys()[0], 'queue1');

  this.qh.pushTo('queue2', 'A');

  assert.strictEqual(this.qh.getKeys().length, 2);
  assert.strictEqual(this.qh.getKeys()[0], 'queue1');
  assert.strictEqual(this.qh.getKeys()[1], 'queue2');

  this.qh.clear();

  assert.strictEqual(this.qh.getKeys().length, 0);
});

QUnit.test('using non-existent key', function (assert) {
  assert.strictEqual(this.qh.has('unknown'), false);
  assert.strictEqual(this.qh.sizeOf('unknown'), 0);
  assert.strictEqual(typeof this.qh.popFrom('unknown'), 'undefined');
});
