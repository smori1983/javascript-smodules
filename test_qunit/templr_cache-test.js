const Templr = require('../src/templr');

QUnit.module('templr');

QUnit.test('hasCache', (assert) => {
  const templr = new Templr();

  assert.strictEqual(templr.hasCache('tpl_1'), false);

  templr.registerCache('tpl_1', '<p>hello, world</p>');

  assert.strictEqual(templr.hasCache('tpl_1'), true);
});

QUnit.test('clearCache', (assert) => {
  const templr = new Templr();

  templr.registerCache('tpl_1', '<p>hello, world</p>');

  assert.strictEqual(templr.renderCached('tpl_1', {}), '<p>hello, world</p>');

  templr.clearCache();

  assert.throws(() => {
    templr.renderCached('tpl_1', {});
  }, Error);
});
