const Templr = require('../src/templr');

QUnit.module('templr - holder', {
  beforeEach: function () {
    this.templr = new Templr();
  },
});

QUnit.test('simple', function (assert) {
  const src = '<p>{ $foo.bar }</p>';
  const param = {foo: {bar: 'xxx'}};
  const expected = '<p>xxx</p>';

  assert.strictEqual(this.templr.render(src, param), expected);
});

QUnit.test('property not chainable - undefined', function (assert) {
  const src = '<p>{ $foo.bar.baz }</p>';
  const param = {foo: {bar: 'xxx'}};
  const expected = '<p>undefined</p>';

  assert.strictEqual(this.templr.render(src, param), expected);
});

QUnit.test('property not chainable - null', function (assert) {
  const src = '<p>{ $foo.bar.baz }</p>';
  const param = {foo: {bar: null}};
  const expected = '<p>null</p>';

  assert.strictEqual(this.templr.render(src, param), expected);
});

QUnit.test('same holder used in multiple places', function (assert) {
  const src = '<p>{ $user.name }</p><p>{ $user.name }</p>';
  const param = {user: {name: 'Tom'}};
  const expected = '<p>Tom</p><p>Tom</p>';

  assert.strictEqual(this.templr.render(src, param), expected);
});

QUnit.test('bind within HTML tag', function (assert) {
  const src = '<p class="{ $className }">sample</p>';
  const param = {className: 'xxx'};
  const expected = '<p class="xxx">sample</p>';

  assert.strictEqual(this.templr.render(src, param), expected);
});

QUnit.test('array index access', function (assert) {
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

  assert.strictEqual(this.templr.render(src, param), expected);
});

QUnit.test('array index access - not chainable', function (assert) {
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

  assert.strictEqual(this.templr.render(src, param), expected);
});

QUnit.test('default filter - h - implicit call', function (assert) {
  const src = '<p>{ $foo }</p>';
  const param = { foo: '<strong>"it\'s mine & that\'s yours"</strong>' };
  const expected = '<p>&lt;strong&gt;&quot;it&#039;s mine &amp; that&#039;s yours&quot;&lt;/strong&gt;</p>';

  assert.strictEqual(this.templr.render(src, param), expected);
});

QUnit.test('default filter - h - explicit call will be escaped twice', function (assert) {
  const src = '<p>{ $foo | h }</p>';
  const param = { foo: '<strong>foo</strong>' };
  const expected = '<p>&amp;lt;strong&amp;gt;foo&amp;lt;/strong&amp;gt;</p>';

  assert.strictEqual(this.templr.render(src, param), expected);
});

QUnit.test('default filter - raw', function (assert) {
  const src = '<p>{ $foo | raw }</p>';
  const param = { foo: '<strong>"it\'s mine & that\'s yours"</strong>' };
  const expected = '<p><strong>"it\'s mine & that\'s yours"</strong></p>';

  assert.strictEqual(this.templr.render(src, param), expected);
});

QUnit.test('default filter - h - null', function (assert) {
  const src = '<p>{ $value }</p>';
  const param = {value: null};
  const expected = '<p>null</p>';

  assert.strictEqual(this.templr.render(src, param), expected);
});

QUnit.test('default filter - raw - null', function (assert) {
  const src = '<p>{ $value | raw }</p>';
  const param = {value: null};
  const expected = '<p>null</p>';

  assert.strictEqual(this.templr.render(src, param), expected);
});

QUnit.test('original filter', function (assert) {
  // create original filter
  this.templr.addFilter('original', (value, size, tail) => {
    return value.slice(0, size) + (tail ? tail : '');
  });

  const src = '<p>{ $foo | original:1 }</p><p>{ $foo | original:3,"..." }</p>';
  const param = {foo: '123456789'};
  const expected = '<p>1</p><p>123...</p>';

  assert.strictEqual(this.templr.render(src, param), expected);
});

QUnit.test('original filter - returns null - h', function (assert) {
  // create original filter
  this.templr.addFilter('original', (value) => {
    return null;
  });

  const src = '<p>{ $value | original }</p>';
  const param = {foo: 'foo'};
  const expected = '<p>null</p>';

  assert.strictEqual(this.templr.render(src, param), expected);
});

QUnit.test('original filter - returns null - raw', function (assert) {
  // create original filter
  this.templr.addFilter('original', (value) => {
    return null;
  });

  const src = '<p>{ $value | original | raw }</p>';
  const param = {foo: 'foo'};
  const expected = '<p>null</p>';

  assert.strictEqual(this.templr.render(src, param), expected);
});

QUnit.test('original filter - returns undefined - h', function (assert) {
  // create original filter
  this.templr.addFilter('original', (value, undef) => {
    return undef;
  });

  const src = '<p>{ $value | original }</p>';
  const param = {foo: 'foo'};
  const expected = '<p>undefined</p>';

  assert.strictEqual(this.templr.render(src, param), expected);
});

QUnit.test('original filter - returns undefined - raw', function (assert) {
  // create original filter
  this.templr.addFilter('original', (value, undef) => {
    return undef;
  });

  const src = '<p>{ $value | original | raw }</p>';
  const param = {foo: 'foo'};
  const expected = '<p>undefined</p>';

  assert.strictEqual(this.templr.render(src, param), expected);
});










