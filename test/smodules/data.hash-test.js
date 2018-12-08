QUnit.module('smodules.data.hash');

QUnit.test('add', function(assert) {
    var hash = smodules.data.hash();

    hash.add('hoge', 'test');
    assert.strictEqual(true,   hash.has('hoge'));
    assert.strictEqual('test', hash.get('hoge'));

    hash.add('hoge', 'hogehoge');
    assert.strictEqual('hogehoge', hash.get('hoge'));
});

QUnit.test('remove', function(assert) {
    var hash = smodules.data.hash();

    hash.add('name', 'anonymous');
    assert.strictEqual(true, hash.has('name'));

    hash.remove('name');
    assert.strictEqual(false, hash.has('name'));
    assert.strictEqual('undefined', typeof hash.get('name'));
});

QUnit.test('clear', function(assert) {
    var hash = smodules.data.hash();

    hash.add('name', 'anonymous');
    hash.add('mail', 'anonymous@example.com');
    hash.clear();
    assert.strictEqual(false, hash.has('name'));
    assert.strictEqual(false, hash.has('mail'));
});
