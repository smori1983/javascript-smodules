const describe = require('mocha').describe;
const it = require('mocha').it;
const assert = require('assert');
const Templr = require('../src/templr');

/**
 * @param {string} source
 * @param {Object} param
 * @return {string}
 */
const render = (source, param) => {
  return new Templr().render(source, param);
};

describe('templr - holder', () => {
  it('simple', () => {
    const src = '<p>{ $foo.bar }</p>';
    const param = {foo: {bar: 'xxx'}};
    const expected = '<p>xxx</p>';

    assert.strictEqual(render(src, param), expected);
  });

  it('property not chainable - undefined', () => {
    const src = '<p>{ $foo.bar.baz }</p>';
    const param = {foo: {bar: 'xxx'}};
    const expected = '<p>undefined</p>';

    assert.strictEqual(render(src, param), expected);
  });

  it('property not chainable - null', () => {
    const src = '<p>{ $foo.bar.baz }</p>';
    const param = {foo: {bar: null}};
    const expected = '<p>null</p>';

    assert.strictEqual(render(src, param), expected);
  });

  it('same holder used in multiple places', () => {
    const src = '<p>{ $user.name }</p><p>{ $user.name }</p>';
    const param = {user: {name: 'Tom'}};
    const expected = '<p>Tom</p><p>Tom</p>';

    assert.strictEqual(render(src, param), expected);
  });

  it('bind within HTML tag', () => {
    const src = '<p class="{ $className }">sample</p>';
    const param = {className: 'xxx'};
    const expected = '<p class="xxx">sample</p>';

    assert.strictEqual(render(src, param), expected);
  });

  it('array index access', () => {
    // under current specification, array is accessible by like this.
    const src =
      '<p>{ $items.0.name }</p>' +
      '<p>{ $items.1.name }</p>' +
      '<p>{ $items.2.name }</p>';
    const param = {
      items: [
        {name: 'a'},
        {name: 'b'},
        {name: 'c'},
      ],
    };
    const expected = '<p>a</p><p>b</p><p>c</p>';

    assert.strictEqual(render(src, param), expected);
  });

  it('array index access - not chainable', () => {
    // under current specification, array is accessible by like this.
    const src = '<p>{ $items.3.name }</p>';
    const param = {
      items: [
        {name: 'a'},
        {name: 'b'},
        {name: 'c'},
      ],
    };
    const expected = '<p>undefined</p>';

    assert.strictEqual(render(src, param), expected);
  });

  it('default filter - h - implicit call', () => {
    const src = '<p>{ $foo }</p>';
    const param = {foo: '<strong>"it\'s mine & that\'s yours"</strong>'};
    const expected = '<p>&lt;strong&gt;&quot;it&#039;s mine &amp; that&#039;s yours&quot;&lt;/strong&gt;</p>';

    assert.strictEqual(render(src, param), expected);
  });

  it('default filter - h - explicit call will be escaped twice', () => {
    const src = '<p>{ $foo | h }</p>';
    const param = {foo: '<strong>foo</strong>'};
    const expected = '<p>&amp;lt;strong&amp;gt;foo&amp;lt;/strong&amp;gt;</p>';

    assert.strictEqual(render(src, param), expected);
  });

  it('default filter - raw', () => {
    const src = '<p>{ $foo | raw }</p>';
    const param = {foo: '<strong>"it\'s mine & that\'s yours"</strong>'};
    const expected = '<p><strong>"it\'s mine & that\'s yours"</strong></p>';

    assert.strictEqual(render(src, param), expected);
  });

  it('default filter - h - null', () => {
    const src = '<p>{ $value }</p>';
    const param = {value: null};
    const expected = '<p>null</p>';

    assert.strictEqual(render(src, param), expected);
  });

  it('default filter - raw - null', () => {
    const src = '<p>{ $value | raw }</p>';
    const param = {value: null};
    const expected = '<p>null</p>';

    assert.strictEqual(render(src, param), expected);
  });

  it('original filter', () => {
    const templr = new Templr();

    // create original filter
    templr.addFilter('original', (value, size, tail) => {
      return value.slice(0, size) + (tail ? tail : '');
    });

    const src = '<p>{ $foo | original:1 }</p><p>{ $foo | original:3,"..." }</p>';
    const param = {foo: '123456789'};
    const expected = '<p>1</p><p>123...</p>';

    assert.strictEqual(templr.render(src, param), expected);
  });

  it('original filter - returns null - h', () => {
    const templr = new Templr();

    // create original filter
    templr.addFilter('original', (value) => {
      return null;
    });

    const src = '<p>{ $value | original }</p>';
    const param = {foo: 'foo'};
    const expected = '<p>null</p>';

    assert.strictEqual(templr.render(src, param), expected);
  });

  it('original filter - returns null - raw', () => {
    const templr = new Templr();

    // create original filter
    templr.addFilter('original', (value) => {
      return null;
    });

    const src = '<p>{ $value | original | raw }</p>';
    const param = {foo: 'foo'};
    const expected = '<p>null</p>';

    assert.strictEqual(templr.render(src, param), expected);
  });

  it('original filter - returns undefined - h', () => {
    const templr = new Templr();

    // create original filter
    templr.addFilter('original', (value, undef) => {
      return undef;
    });

    const src = '<p>{ $value | original }</p>';
    const param = {foo: 'foo'};
    const expected = '<p>undefined</p>';

    assert.strictEqual(templr.render(src, param), expected);
  });

  it('original filter - returns undefined - raw', () => {
    const templr = new Templr();

    // create original filter
    templr.addFilter('original', (value, undef) => {
      return undef;
    });

    const src = '<p>{ $value | original | raw }</p>';
    const param = {foo: 'foo'};
    const expected = '<p>undefined</p>';

    assert.strictEqual(templr.render(src, param), expected);
  });
});
