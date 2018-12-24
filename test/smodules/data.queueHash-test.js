QUnit.module('data.queueHash');

QUnit.test('addTo and getFrom', function(assert) {
  var qh = smodules.data.queueHash();

  qh.addTo('list', 'a');
  qh.addTo('list', 'b');

  assert.strictEqual(qh.has('list'), true);
  assert.strictEqual(qh.sizeOf('list'), 2);
  assert.strictEqual(qh.getFrom('list'), 'a');
  assert.strictEqual(qh.sizeOf('list'), 1);
  assert.strictEqual(qh.getFrom('list'), 'b');
  assert.strictEqual(qh.sizeOf('list'), 0);

  qh.remove('list');

  assert.strictEqual(qh.has('list'), false);
});

QUnit.test('check keys', function(assert) {
  var qh = smodules.data.queueHash();

  qh.addTo('queue1', 'a');

  assert.strictEqual(qh.getKeys().length, 1);
  assert.strictEqual(qh.getKeys()[0], 'queue1');

  qh.addTo('queue2', 'A');

  assert.strictEqual(qh.getKeys().length, 2);
  assert.strictEqual(qh.getKeys()[0], 'queue1');
  assert.strictEqual(qh.getKeys()[1], 'queue2');

  qh.clear();

  assert.strictEqual(0, qh.getKeys().length);
});

QUnit.test('using not existing key', function(assert) {
  var qh = smodules.data.queueHash();

  assert.strictEqual(qh.has('hoge'), false);
  assert.strictEqual(qh.sizeOf('hoge'), 0);
  assert.strictEqual(typeof qh.getFrom('hoge'), 'undefined');
});
