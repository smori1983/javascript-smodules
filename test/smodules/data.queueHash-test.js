QUnit.module('smodules.data.queueHash');

QUnit.test('addTo and getFrom', function(assert) {
    var qh = smodules.data.queueHash();

    qh.addTo('list', 'a');
    qh.addTo('list', 'b');

    assert.strictEqual(true, qh.has('list'));
    assert.strictEqual(2,    qh.sizeOf('list'));
    assert.strictEqual('a',  qh.getFrom('list'));
    assert.strictEqual(1,    qh.sizeOf('list'));
    assert.strictEqual('b',  qh.getFrom('list'));
    assert.strictEqual(0,    qh.sizeOf('list'));

    qh.remove('list');

    assert.strictEqual(false, qh.has('list'));
});

QUnit.test('check keys', function(assert) {
    var qh = smodules.data.queueHash();

    qh.addTo('queue1', 'a');

    assert.strictEqual(1,        qh.getKeys().length);
    assert.strictEqual('queue1', qh.getKeys()[0]);

    qh.addTo('queue2', 'A');

    assert.strictEqual(2,        qh.getKeys().length);
    assert.strictEqual('queue1', qh.getKeys()[0]);
    assert.strictEqual('queue2', qh.getKeys()[1]);

    qh.clear();

    assert.strictEqual(0, qh.getKeys().length);
});

QUnit.test('using not existing key', function(assert) {
    var qh = smodules.data.queueHash();

    assert.strictEqual(false, qh.has('hoge'));
    assert.strictEqual(0,     qh.sizeOf('hoge'));
    assert.strictEqual('undefined', typeof qh.getFrom('hoge'));
});
