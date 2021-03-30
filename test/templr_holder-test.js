const Templr = require('../src/templr');

/**
 * @param {string} source
 * @param {Object} param
 * @return {string}
 */
const render = (source, param) => {
  return new Templr().render(source, param);
};

QUnit.module('templr - holder');

QUnit.test('simple', (assert) => {
  const src = '<p>{ $foo.bar }</p>';
  const param = {foo: {bar: 'xxx'}};
  const expected = '<p>xxx</p>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('property not chainable - undefined', (assert) => {
  const src = '<p>{ $foo.bar.baz }</p>';
  const param = {foo: {bar: 'xxx'}};
  const expected = '<p>undefined</p>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('property not chainable - null', (assert) => {
  const src = '<p>{ $foo.bar.baz }</p>';
  const param = {foo: {bar: null}};
  const expected = '<p>null</p>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('same holder used in multiple places', (assert) => {
  const src = '<p>{ $user.name }</p><p>{ $user.name }</p>';
  const param = {user: {name: 'Tom'}};
  const expected = '<p>Tom</p><p>Tom</p>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('bind within HTML tag', (assert) => {
  const src = '<p class="{ $className }">sample</p>';
  const param = {className: 'xxx'};
  const expected = '<p class="xxx">sample</p>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('array index access', (assert) => {
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

QUnit.test('array index access - not chainable', (assert) => {
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

QUnit.test('default filter - h - implicit call', (assert) => {
  const src = '<p>{ $foo }</p>';
  const param = { foo: '<strong>"it\'s mine & that\'s yours"</strong>' };
  const expected = '<p>&lt;strong&gt;&quot;it&#039;s mine &amp; that&#039;s yours&quot;&lt;/strong&gt;</p>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('default filter - h - explicit call will be escaped twice', (assert) => {
  const src = '<p>{ $foo | h }</p>';
  const param = { foo: '<strong>foo</strong>' };
  const expected = '<p>&amp;lt;strong&amp;gt;foo&amp;lt;/strong&amp;gt;</p>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('default filter - raw', (assert) => {
  const src = '<p>{ $foo | raw }</p>';
  const param = { foo: '<strong>"it\'s mine & that\'s yours"</strong>' };
  const expected = '<p><strong>"it\'s mine & that\'s yours"</strong></p>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('default filter - h - null', (assert) => {
  const src = '<p>{ $value }</p>';
  const param = {value: null};
  const expected = '<p>null</p>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('default filter - raw - null', (assert) => {
  const src = '<p>{ $value | raw }</p>';
  const param = {value: null};
  const expected = '<p>null</p>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('original filter', (assert) => {
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

QUnit.test('original filter - returns null - h', (assert) => {
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

QUnit.test('original filter - returns null - raw', (assert) => {
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

QUnit.test('original filter - returns undefined - h', (assert) => {
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

QUnit.test('original filter - returns undefined - raw', (assert) => {
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
