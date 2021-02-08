const hash = require('../../src/smodules/data.hash');

QUnit.module('data.hash', {
  beforeEach: function() {
    this.hash = hash.init();
  },
});

QUnit.test('add', function(assert) {
  this.hash.add('hoge', 'test');
  assert.strictEqual(this.hash.has('hoge'), true);
  assert.strictEqual(this.hash.get('hoge'), 'test');

  this.hash.add('hoge', 'hogehoge');
  assert.strictEqual(this.hash.get('hoge'), 'hogehoge');
});

QUnit.test('remove', function(assert) {
  this.hash.add('name', 'anonymous');
  assert.strictEqual(this.hash.has('name'), true);

  this.hash.remove('name');
  assert.strictEqual(this.hash.has('name'), false);
  assert.strictEqual(typeof this.hash.get('name'), 'undefined');
});

QUnit.test('clear', function(assert) {
  this.hash.add('name', 'anonymous');
  this.hash.add('mail', 'anonymous@example.com');
  this.hash.clear();
  assert.strictEqual(this.hash.has('name'), false);
  assert.strictEqual(this.hash.has('mail'), false);
});
