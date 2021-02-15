const QueueHash = require('../src/data.queueHash');

QUnit.module('data.queueHash', {
  beforeEach: function () {
    this.qh = new QueueHash();
  },
});

QUnit.test('addTo and getFrom', function (assert) {
  this.qh.addTo('list', 'a');
  this.qh.addTo('list', 'b');

  assert.strictEqual(this.qh.has('list'), true);
  assert.strictEqual(this.qh.sizeOf('list'), 2);
  assert.strictEqual(this.qh.getFrom('list'), 'a');
  assert.strictEqual(this.qh.sizeOf('list'), 1);
  assert.strictEqual(this.qh.getFrom('list'), 'b');
  assert.strictEqual(this.qh.sizeOf('list'), 0);

  this.qh.remove('list');

  assert.strictEqual(this.qh.has('list'), false);
});

QUnit.test('check keys', function (assert) {
  this.qh.addTo('queue1', 'a');

  assert.strictEqual(this.qh.getKeys().length, 1);
  assert.strictEqual(this.qh.getKeys()[0], 'queue1');

  this.qh.addTo('queue2', 'A');

  assert.strictEqual(this.qh.getKeys().length, 2);
  assert.strictEqual(this.qh.getKeys()[0], 'queue1');
  assert.strictEqual(this.qh.getKeys()[1], 'queue2');

  this.qh.clear();

  assert.strictEqual(this.qh.getKeys().length, 0);
});

QUnit.test('using non-existent key', function (assert) {
  assert.strictEqual(this.qh.has('hoge'), false);
  assert.strictEqual(this.qh.sizeOf('hoge'), 0);
  assert.strictEqual(typeof this.qh.getFrom('hoge'), 'undefined');
});
