const template = require('../../src/smodules/template');

QUnit.module('template', {
  beforeEach: function() {
    this.template = template.init();
  },
});

QUnit.test('preFetch and template cache', function(assert) {
  const src1 = '<h1>{$value}</h1>';
  const src2 = '<h2>{$value}</h2>';
  const src3 = '<h3>{$value}</h3>';
  let cacheList;

  // Initially no cache.
  cacheList = this.template.getTemplateCacheList();
  assert.strictEqual(cacheList.length, 0);

  // Fetch single source.
  this.template.preFetch(src1);
  cacheList = this.template.getTemplateCacheList();
  assert.strictEqual(cacheList.length, 1);
  assert.strictEqual(cacheList[0], src1);

  // Fetch multiple sources.
  this.template.preFetch([src2, src3]);
  cacheList = this.template.getTemplateCacheList();
  assert.strictEqual(cacheList.length, 3);
  assert.strictEqual(cacheList[0], src1);
  assert.strictEqual(cacheList[1], src2);
  assert.strictEqual(cacheList[2], src3);

  // Clear individual cache.
  this.template.clearTemplateCache(src1);
  cacheList = this.template.getTemplateCacheList();
  assert.strictEqual(cacheList.length, 2);

  // Clear all cache.
  this.template.clearTemplateCache();
  cacheList = this.template.getTemplateCacheList();
  assert.strictEqual(cacheList.length, 0);
});
