const describe = require('mocha').describe;
const it = require('mocha').it;
const beforeEach = require('mocha').beforeEach;
const assert = require('assert');

const templr = require('../src/templr-browser');
const templr1 = require('../src/templr-browser');
const templr2 = require('../src/templr-browser');

describe('templr-browser', () => {
  beforeEach(() => {
    templr.clearCache();
    templr1.clearCache();
    templr2.clearCache();
  });

  it('confirm require is cached', function () {
    templr1.registerCache('tpl_1', 'foo');

    assert.deepStrictEqual(templr1.renderCached('tpl_1', {}), 'foo');
    assert.deepStrictEqual(templr2.renderCached('tpl_1', {}), 'foo');

    templr2.registerCache('tpl_2', 'bar');

    assert.deepStrictEqual(templr1.renderCached('tpl_2', {}), 'bar');
    assert.deepStrictEqual(templr2.renderCached('tpl_2', {}), 'bar');
  });

  it('error thrown when template not registered', function () {
    assert.throws(function () {
      templr.renderCached('xxx', {});
    }, /template identified by "xxx" not registered/);
  });

});
