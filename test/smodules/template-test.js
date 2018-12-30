QUnit.module('template', {
  before: function() {
    this.execBind = function(param) {
      this.template.bind(this.src, param).appendTo(this.target);
    };
    this.getHtml = function() {
      return $(this.target).html();
    };
  },
  beforeEach: function() {
    this.template = smodules.template();
    this.target = '#template-test';
    this.src = '';

    $(this.target).empty();
  },
});

QUnit.test('normal block', function(assert) {
  this.src = '<p>{left}ok{right}</p>';
  this.execBind({});

  assert.strictEqual(this.getHtml(), '<p>{ok}</p>');
});

QUnit.test('literal block', function(assert) {
  this.src = '{literal}<p>{literal} {left}/literal{right}</p>{/literal}';
  this.execBind();

  assert.strictEqual(this.getHtml(), '<p>{literal} {/literal}</p>');
});

QUnit.test('holder block', function(assert) {
  var param = { foo: { bar : 'hoge' } };

  this.src = '<p>{ $foo.bar }</p>';
  this.execBind(param);

  assert.strictEqual(this.getHtml(), '<p>hoge</p>');
});

QUnit.test('holder block - property not chainable', function(assert) {
  var param = { foo: { bar : 'hoge' } };

  this.src = '<p>{ $foo.bar.baz }</p>';
  this.execBind(param);

  assert.strictEqual(this.getHtml(), '<p></p>');
});

QUnit.test('holder block - same holder in multiple places', function(assert) {
  var param = { user: { name: 'Tom' } };

  this.src = '<p>{ $user.name }</p><p>{ $user.name }</p>';
  this.execBind(param);

  assert.strictEqual(this.getHtml(), '<p>Tom</p><p>Tom</p>');
});

QUnit.test('holder block - bind within tag', function(assert) {
  var param = { className: 'hoge' };

  this.src = '<p class="{ $className }">sample</p>';
  this.execBind(param);

  assert.strictEqual(this.getHtml(), '<p class="hoge">sample</p>');
});

QUnit.test('holder block - array index access', function(assert) {
  // under current specification, array is accessible by like this.
  var param = {
    items: [
      { name: 'a' },
      { name: 'b' },
      { name: 'c' },
    ],
  };

  this.src =
    '<p>{ $items.0.name }</p>' +
    '<p>{ $items.1.name }</p>' +
    '<p>{ $items.2.name }</p>';
  this.execBind(param);

  assert.strictEqual(this.getHtml(), '<p>a</p><p>b</p><p>c</p>');
});

QUnit.test('holder block - array index access - not chainable', function(assert) {
  // under current specification, array is accessible by like this.
  var param = {
    items: [
      { name: 'a' },
      { name: 'b' },
      { name: 'c' },
    ],
  };

  this.src = '<p>{ $items.3.name }</p>';
  this.execBind(param);

  assert.strictEqual(this.getHtml(), '<p></p>');
});

QUnit.test('holder block - default filter - h', function(assert) {
  var param = { foo: '<p>"it\'s mine & that\'s yours"</p>' };

  this.src = '<p>{ $foo | h }</p>';
  this.execBind(param);

  // NOTE: " and ' are as they are in innerHTML.
  assert.strictEqual(this.getHtml(), '<p>&lt;p&gt;"it\'s mine &amp; that\'s yours"&lt;/p&gt;</p>');
});

QUnit.test('holder block - default filter - default - template value is undefined', function(assert) {
  var param = { foo: 'foo' };

  this.src = '<p>{ $foo.bar | default:"piyo" }</p>';
  this.execBind(param);

  assert.strictEqual(this.getHtml(), '<p>piyo</p>');
});

QUnit.test('holder block - default filter - default - toString() will be called at end of binding', function(assert) {
  var param = { foo: false };

  this.src = '<p>{ $foo | default:"a" }</p>';
  this.execBind(param);

  assert.strictEqual(this.getHtml(), '<p>false</p>');
});

QUnit.test('holder block - default filter - upper', function(assert) {
  var param = { foo: 'abc' };

  this.src = '<p>{ $foo | upper }</p>';
  this.execBind(param);

  assert.strictEqual(this.getHtml(), '<p>ABC</p>');
});

QUnit.test('holder block - default filter - lower', function(assert) {
  var param = { foo: 'XYZ' };

  this.src = '<p>{ $foo | lower }</p>';
  this.execBind(param);

  assert.strictEqual(this.getHtml(), '<p>xyz</p>');
});

QUnit.test('holder block - default filter - plus', function(assert) {
  var param = { foo: 1, bar: 1.23, baz: 10 };

  this.src = '<p>{ $foo | plus:1 }</p><p>{ $bar | plus:2 }</p><p>{ $baz | plus:-1 }</p>';
  this.execBind(param);

  assert.strictEqual(this.getHtml(), '<p>2</p><p>3.23</p><p>9</p>');
});

QUnit.test('holder block - original filter', function(assert) {
  // create original filter
  this.template.addFilter('originalFilter', function(value, size, tail) {
    return value.slice(0, size) + (tail ? tail : '');
  });

  var param = { foo: 'abcdefghi' };

  this.src = '<p>{ $foo | originalFilter:1 }</p><p>{ $foo | originalFilter:3,"..." }</p>';
  this.execBind(param);

  assert.strictEqual(this.getHtml(), '<p>a</p><p>abc...</p>');
});

QUnit.test('if block - simple', function(assert) {
  var param = { foo: true };

  this.src = '{ if $foo }<p>yes</p>{ else }<p>no</p>{ /if }';
  this.execBind(param);

  assert.strictEqual(this.getHtml(), '<p>yes</p>');
});

QUnit.test('if block - logical operator - and', function(assert) {
  var param = { foo: true, bar: false };

  this.src = '{ if $foo and $bar }<p>yes</p>{ else }<p>no</p>{ /if }';
  this.execBind(param);

  assert.strictEqual(this.getHtml(), '<p>no</p>');
});

QUnit.test('if block - logical operator - combination', function(assert) {
  var param = { foo: true, bar: false, baz: true };

  this.src = '{ if $foo and ( $bar or $baz ) }<p>yes</p>{ else }<p>no</p>{ /if }';
  this.execBind(param);

  assert.strictEqual(this.getHtml(), '<p>yes</p>');
});

QUnit.test('if block - comparative operator', function(assert) {
  var param = { price: 50 };

  this.src =
    '{ if $price gte 100 }' +
    '<p>high</p>' +
    '{ elseif $price gte 50 }' +
    '<p>middle</p>' +
    '{ else }' +
    '<p>low</p>' +
    '{ /if }';
  this.execBind(param);

  assert.strictEqual(this.getHtml(), '<p>middle</p>');
});

QUnit.test('if block - comparative operator - "===" and "=="', function(assert) {
  var param = { foo: true };

  this.src = '{ if $foo === 1 }<p>one</p>{ /if }{ if $foo == 1}<p>two</p>{ /if }';
  this.execBind(param);

  assert.strictEqual(this.getHtml(), '<p>two</p>');
});

QUnit.test('if block - property chainable', function(assert) {
  var param = {
    data1: { key: true },
    data2: { key: true },
  };

  this.src =
    '{ if $data1.key and $data2.key }' +
    '<p>OK</p>' +
    '{ /if }';
  this.execBind(param);

  assert.strictEqual(this.getHtml(), '<p>OK</p>');
});

QUnit.test('if block - property not chainable - and 1', function(assert) {
  var param = {
    data1: { key1: true },
    data2: { key1: true },
  };

  this.src =
    '{ if $data1.key1 and $data2.key2 }' +
    '<p>OK</p>' +
    '{ /if }';
  this.execBind(param);

  assert.strictEqual(this.getHtml(), '');
});

QUnit.test('if block - property not chainable - and 2', function(assert) {
  var param = {
    data1: { key2: true },
    data2: { key2: true },
  };

  this.src =
    '{ if $data1.key1 and $data2.key2 }' +
    '<p>OK</p>' +
    '{ /if }';
  this.execBind(param);

  assert.strictEqual(this.getHtml(), '');
});

QUnit.test('if block - property not chainable - or 1', function(assert) {
  var param = {
    data1: { key1: true },
    data2: { key1: true },
  };

  this.src =
    '{ if $data1.key1 or $data2.key2 }' +
    '<p>OK</p>' +
    '{ /if }';
  this.execBind(param);

  assert.strictEqual(this.getHtml(), '<p>OK</p>');
});

QUnit.test('if block - property not chainable - or 2', function(assert) {
  var param = {
    data1: { key2: true },
    data2: { key2: true },
  };

  this.src =
    '{ if $data1.key1 or $data2.key2 }' +
    '<p>OK</p>' +
    '{ /if }';
  this.execBind(param);

  assert.strictEqual(this.getHtml(), '<p>OK</p>');
});

QUnit.test('for block', function(assert) {
  var param = { items: ['one', 'two', 'three'] };

  this.src = '{ for $item in $items }<p>{ $item }</p>{ /for }';
  this.execBind(param);

  assert.strictEqual(this.getHtml(), '<p>one</p><p>two</p><p>three</p>');
});

QUnit.test('for block - use index', function(assert) {
  var param = { items: ['one', 'two'] };

  this.src = '{ for $idx,$item in $items }<p>{ $idx }-{ $item }</p>{ /for }';
  this.execBind(param);

  assert.strictEqual(this.getHtml(), '<p>0-one</p><p>1-two</p>');
});

QUnit.test('for block - nested', function(assert) {
  var param = { items: [
    { ids: [1, 2]},
    { ids: [3, 4]},
    { ids: [5, 6]},
  ]};

  this.src =
    '{ for $item in $items }' +
    '<ul>' +
    '{ for $id in $item.ids }' +
    '<li>{ $id }</li>' +
    '{ /for }' +
    '</ul>' +
    '{ /for }';
  this.execBind(param);

  var expected =
    '<ul><li>1</li><li>2</li></ul>' +
    '<ul><li>3</li><li>4</li></ul>' +
    '<ul><li>5</li><li>6</li></ul>';

  assert.strictEqual(this.getHtml(), expected);
});

QUnit.test('for block - nested - if', function(assert) {
  var param = { items: [
    { ids: [1, 2]},
    { ids: [3, 4]},
    { ids: [5, 6]},
  ]};

  this.src =
    '{ for $item in $items }' +
    '<ul>' +
    '{ for $id in $item.ids }' +
    '{ if $id === 1 or $id === 3 or $id === 5 }' +
    '<li>odd: { $id }</li>' +
    '{ else }' +
    '<li>even: { $id }</li>' +
    '{ /if }' +
    '{ /for }' +
    '</ul>' +
    '{ /for }';
  this.execBind(param);

  var expected =
    '<ul><li>odd: 1</li><li>even: 2</li></ul>' +
    '<ul><li>odd: 3</li><li>even: 4</li></ul>' +
    '<ul><li>odd: 5</li><li>even: 6</li></ul>';

  assert.strictEqual(this.getHtml(), expected);
});

QUnit.test('for block - nested - if with property access', function(assert) {
  var param = { items: [
    { products: [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ]},
    { products: [
      { id: 1, name: 'C' },
      { id: 2, name: 'D' },
    ]},
  ]};

  this.src =
    '{ for $item in $items }' +
    '<ul>' +
    '{ for $product in $item.products }' +
    '{ if $product.id === 1 }' +
    '<li>{ $product.name|h }</li>' +
    '{ /if }' +
    '{ /for }' +
    '</ul>' +
    '{ /for }';
  this.execBind(param);

  var expected =
    '<ul><li>A</li></ul>' +
    '<ul><li>C</li></ul>';

  assert.strictEqual(this.getHtml(), expected);
});

QUnit.test('for block - not iterable', function(assert) {
  var param = { items: 'hello, world!' };

  this.src =
    '{ for $item in $items }' +
    '<p>{ $item }</p>' +
    '{ /for }';
  this.execBind(param);

  assert.strictEqual(this.getHtml(), '');
});

QUnit.test('for block - haystack property chainable', function(assert) {
  var param = { items: {
    data: [1, 2, 3],
  }};

  this.src =
    '{ for $value in $items.data }' +
    '<p>{ $value | h }</p>' +
    '{ /for }';
  this.execBind(param);

  assert.strictEqual(this.getHtml(), '<p>1</p><p>2</p><p>3</p>');
});

QUnit.test('for block - haystack property not chainable 1', function(assert) {
  var param = { items: [1, 2, 3] };

  this.src =
    '{ for $item in $items.foo.bar }' +
    '<p>{ $item }</p>' +
    '{ /for }';
  this.execBind(param);

  assert.strictEqual(this.getHtml(), '');
});

QUnit.test('for block - haystack property not chainable 2', function(assert) {
  var param = { items: [
    { name: 'name1', data: 'data1'},
    { name: 'name2', data: 'data2'},
  ]};

  this.src =
    '{ for $item in $items }' +
    '<div>{ $item.name | h }</div>' +
    '{ for $data in $item.data }' +
    '<p>{ $data | h }</p>' +
    '{ /for}' +
    '{ /for }';
  this.execBind(param);

  assert.strictEqual(this.getHtml(), '<div>name1</div><div>name2</div>');
});

QUnit.test('for block - dummy variable chainable', function(assert) {
  var param = { items: [
    { data: { key1: 'value1'} },
    { data: { key1: 'value2'} },
  ]};

  this.src =
    '{ for $item in $items }' +
    '<div>{ $item.data.key1 | h }</div>' +
    '{ /for }';
  this.execBind(param);

  assert.strictEqual(this.getHtml(), '<div>value1</div><div>value2</div>');
});

QUnit.test('error - filter not found', function(assert) {
  this.src = '<p>{ $value | hoge }</p>';

  assert.throws(function() {
    this.execBind({ value: 'test'});
  }, Error);
});
