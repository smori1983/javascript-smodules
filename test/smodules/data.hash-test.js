const Hash = require('../../src/smodules/data.hash');

QUnit.module('data.hash', {
  beforeEach: function () {
    this.hash = new Hash();
  },
});

QUnit.test('add', function (assert) {
  this.hash.add('hoge', 'test');

  assert.strictEqual(this.hash.has('hoge'), true);
  assert.strictEqual(this.hash.get('hoge'), 'test');

  this.hash.add('hoge', 'hogehoge');

  assert.strictEqual(this.hash.get('hoge'), 'hogehoge');
});

QUnit.test('remove', function (assert) {
  this.hash.add('name', 'anonymous');

  assert.strictEqual(this.hash.has('name'), true);

  this.hash.remove('name');

  assert.strictEqual(this.hash.has('name'), false);
  assert.strictEqual(typeof this.hash.get('name'), 'undefined');
});

QUnit.test('clear', function (assert) {
  this.hash.add('name', 'anonymous');
  this.hash.add('mail', 'anonymous@example.com');
  this.hash.clear();

  assert.strictEqual(this.hash.has('name'), false);
  assert.strictEqual(this.hash.has('mail'), false);
});

QUnit.test('getKeys', function (assert) {
  this.hash.add('key1', 'value1');
  this.hash.add('key3', 'value1');
  this.hash.add('key2', 'value1');

  assert.deepEqual(this.hash.getKeys(), ['key1', 'key2', 'key3']);
});
