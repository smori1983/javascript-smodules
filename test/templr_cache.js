const describe = require('mocha').describe;
const it = require('mocha').it;
const assert = require('assert');
const Templr = require('../src/templr');

describe('templr', () => {
  it('hasCache', () => {
    const templr = new Templr();

    assert.strictEqual(templr.hasCache('tpl_1'), false);

    templr.registerCache('tpl_1', '<p>hello, world</p>');

    assert.strictEqual(templr.hasCache('tpl_1'), true);
  });

  it('clearCache', () => {
    const templr = new Templr();

    templr.registerCache('tpl_1', '<p>hello, world</p>');

    assert.strictEqual(templr.renderCached('tpl_1', {}), '<p>hello, world</p>');

    templr.clearCache();

    assert.throws(() => {
      templr.renderCached('tpl_1', {});
    }, Error);
  });
});
