const templr = require('../src/templr-browser');
const templr1 = require('../src/templr-browser');
const templr2 = require('../src/templr-browser');

QUnit.module('templr-browser', {
  beforeEach: function () {
    templr.clearCache();
    templr1.clearCache();
    templr2.clearCache();
  },
});

QUnit.test('confirm require is cached', function (assert) {
  templr1.registerCache('tpl_1', 'foo');

  assert.equal(templr1.renderCached('tpl_1', {}), 'foo');
  assert.equal(templr2.renderCached('tpl_1', {}), 'foo');

  templr2.registerCache('tpl_2', 'bar');

  assert.equal(templr1.renderCached('tpl_2', {}), 'bar');
  assert.equal(templr2.renderCached('tpl_2', {}), 'bar');
});

QUnit.test('error thrown when template not registered', function (assert) {
  assert.throws(function () {
    templr.renderCached('xxx', {});
  }, /template identified by "xxx" not registered/);
});
