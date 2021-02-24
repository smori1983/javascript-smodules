const Templr = require('../src/templr');

QUnit.module('templr', {
  beforeEach: function () {
    this.templr = new Templr();
  },
});

QUnit.test('hasCache', function (assert) {
  assert.strictEqual(this.templr.hasCache('tpl_1'), false);

  this.templr.registerCache('tpl_1', '<p>hello, world</p>');

  assert.strictEqual(this.templr.hasCache('tpl_1'), true);
});

QUnit.test('clearCache', function (assert) {
  this.templr.registerCache('tpl_1', '<p>hello, world</p>');

  assert.strictEqual(this.templr.renderCached('tpl_1', {}), '<p>hello, world</p>');

  this.templr.clearCache();

  assert.throws(() => {
    this.templr.renderCached('tpl_1', {});
  }, Error);
});
