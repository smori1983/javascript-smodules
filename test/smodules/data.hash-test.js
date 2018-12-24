QUnit.module('data.hash');

QUnit.test('add', function(assert) {
  var hash = smodules.data.hash();

  hash.add('hoge', 'test');
  assert.strictEqual(hash.has('hoge'), true);
  assert.strictEqual(hash.get('hoge'), 'test');

  hash.add('hoge', 'hogehoge');
  assert.strictEqual(hash.get('hoge'), 'hogehoge');
});

QUnit.test('remove', function(assert) {
  var hash = smodules.data.hash();

  hash.add('name', 'anonymous');
  assert.strictEqual(hash.has('name'), true);

  hash.remove('name');
  assert.strictEqual(hash.has('name'), false);
  assert.strictEqual(typeof hash.get('name'), 'undefined');
});

QUnit.test('clear', function(assert) {
  var hash = smodules.data.hash();

  hash.add('name', 'anonymous');
  hash.add('mail', 'anonymous@example.com');
  hash.clear();
  assert.strictEqual(hash.has('name'), false);
  assert.strictEqual(hash.has('mail'), false);
});
