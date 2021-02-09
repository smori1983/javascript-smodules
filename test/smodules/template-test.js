const template = require('../../src/smodules/template');

QUnit.module('template', {
  before: function() {
    this.execBind = function(param) {
      return this.template.bind(this.src, param);
    };
  },
  beforeEach: function() {
    this.template = template.init();
    this.src = '';
  },
});

QUnit.test('normal block', function(assert) {
  this.src = '<p>{left}ok{right}</p>';

  assert.strictEqual(this.execBind({}).get(), '<p>{ok}</p>');
});

QUnit.test('literal block', function(assert) {
  this.src = '{literal}<p>{literal} {left}/literal{right}</p>{/literal}';

  assert.strictEqual(this.execBind().get(), '<p>{literal} {/literal}</p>');
});

QUnit.test('holder block', function(assert) {
  const param = {foo: {bar: 'hoge'}};

  this.src = '<p>{ $foo.bar }</p>';

  assert.strictEqual(this.execBind(param).get(), '<p>hoge</p>');
});

QUnit.test('holder block - property not chainable', function(assert) {
  const param = {foo: {bar: 'hoge'}};

  this.src = '<p>{ $foo.bar.baz }</p>';

  assert.strictEqual(this.execBind(param).get(), '<p></p>');
});

QUnit.test('holder block - same holder in multiple places', function(assert) {
  const param = {user: {name: 'Tom'}};

  this.src = '<p>{ $user.name }</p><p>{ $user.name }</p>';

  assert.strictEqual(this.execBind(param).get(), '<p>Tom</p><p>Tom</p>');
});

QUnit.test('holder block - bind within tag', function(assert) {
  const param = {className: 'hoge'};

  this.src = '<p class="{ $className }">sample</p>';

  assert.strictEqual(this.execBind(param).get(), '<p class="hoge">sample</p>');
});

QUnit.test('holder block - array index access', function(assert) {
  // under current specification, array is accessible by like this.
  const param = {
    items: [
      {name: 'a'},
      {name: 'b'},
      {name: 'c'},
    ],
  };

  this.src =
    '<p>{ $items.0.name }</p>' +
    '<p>{ $items.1.name }</p>' +
    '<p>{ $items.2.name }</p>';

  assert.strictEqual(this.execBind(param).get(), '<p>a</p><p>b</p><p>c</p>');
});

QUnit.test('holder block - array index access - not chainable', function(assert) {
  // under current specification, array is accessible by like this.
  const param = {
    items: [
      {name: 'a'},
      {name: 'b'},
      {name: 'c'},
    ],
  };

  this.src = '<p>{ $items.3.name }</p>';

  assert.strictEqual(this.execBind(param).get(), '<p></p>');
});

QUnit.test('holder block - default filter - h', function(assert) {
  const param = { foo: '<p>"it\'s mine & that\'s yours"</p>' };

  this.src = '<p>{ $foo | h }</p>';

  assert.strictEqual(this.execBind(param).get(), '<p>&lt;p&gt;&quot;it&#039;s mine &amp; that&#039;s yours&quot;&lt;/p&gt;</p>');
});

QUnit.test('holder block - default filter - default - template value is undefined', function(assert) {
  const param = {foo: 'foo'};

  this.src = '<p>{ $foo.bar | default:"piyo" }</p>';

  assert.strictEqual(this.execBind(param).get(), '<p>piyo</p>');
});

QUnit.test('holder block - default filter - default - toString() will be called at end of binding', function(assert) {
  const param = {foo: false};

  this.src = '<p>{ $foo | default:"a" }</p>';

  assert.strictEqual(this.execBind(param).get(), '<p>false</p>');
});

QUnit.test('holder block - default filter - upper', function(assert) {
  const param = {foo: 'abc'};

  this.src = '<p>{ $foo | upper }</p>';

  assert.strictEqual(this.execBind(param).get(), '<p>ABC</p>');
});

QUnit.test('holder block - default filter - lower', function(assert) {
  const param = {foo: 'XYZ'};

  this.src = '<p>{ $foo | lower }</p>';

  assert.strictEqual(this.execBind(param).get(), '<p>xyz</p>');
});

QUnit.test('holder block - default filter - plus', function(assert) {
  const param = {foo: 1, bar: 1.23, baz: 10};

  this.src = '<p>{ $foo | plus:1 }</p><p>{ $bar | plus:2 }</p><p>{ $baz | plus:-1 }</p>';

  assert.strictEqual(this.execBind(param).get(), '<p>2</p><p>3.23</p><p>9</p>');
});

QUnit.test('holder block - original filter', function(assert) {
  // create original filter
  this.template.addFilter('originalFilter', function(value, size, tail) {
    return value.slice(0, size) + (tail ? tail : '');
  });

  const param = {foo: 'abcdefghi'};

  this.src = '<p>{ $foo | originalFilter:1 }</p><p>{ $foo | originalFilter:3,"..." }</p>';

  assert.strictEqual(this.execBind(param).get(), '<p>a</p><p>abc...</p>');
});

QUnit.test('if block - simple', function(assert) {
  const param = {foo: true};

  this.src =
    '{ if $foo }' +
    '<p>yes</p>' +
    '{ else }' +
    '<p>no</p>' +
    '{ /if }';

  assert.strictEqual(this.execBind(param).get(), '<p>yes</p>');
});

QUnit.test('if block - logical operator - and', function(assert) {
  const param = {foo: true, bar: false};

  this.src =
    '{ if $foo and $bar }' +
    '<p>yes</p>' +
    '{ else }' +
    '<p>no</p>' +
    '{ /if }';

  assert.strictEqual(this.execBind(param).get(), '<p>no</p>');
});

QUnit.test('if block - logical operator - and chain 1', function(assert) {
  const param = {foo: true, bar: true, baz: true};

  this.src =
    '{ if $foo and $bar and $baz }' +
    '<p>yes</p>' +
    '{ else }' +
    '<p>no</p>' +
    '{ /if }';

  assert.strictEqual(this.execBind(param).get(), '<p>yes</p>');
});

QUnit.test('if block - logical operator - and chain 2', function(assert) {
  const param = {foo: false, bar: true, baz: true};

  this.src =
    '{ if $foo and $bar and $baz }' +
    '<p>yes</p>' +
    '{ else }' +
    '<p>no</p>' +
    '{ /if }';

  assert.strictEqual(this.execBind(param).get(), '<p>no</p>');
});

QUnit.test('if block - logical operator - and chain 3', function(assert) {
  const param = {foo: true, bar: false, baz: true};

  this.src =
    '{ if $foo and $bar and $baz }' +
    '<p>yes</p>' +
    '{ else }' +
    '<p>no</p>' +
    '{ /if }';

  assert.strictEqual(this.execBind(param).get(), '<p>no</p>');
});

QUnit.test('if block - logical operator - and chain 4', function(assert) {
  const param = {foo: true, bar: true, baz: false};

  this.src =
    '{ if $foo and $bar and $baz }' +
    '<p>yes</p>' +
    '{ else }' +
    '<p>no</p>' +
    '{ /if }';

  assert.strictEqual(this.execBind(param).get(), '<p>no</p>');
});

QUnit.test('if block - logical operator - or', function(assert) {
  const param = {foo: true, bar: false};

  this.src =
    '{ if $foo or $bar }' +
    '<p>yes</p>' +
    '{ else }' +
    '<p>no</p>' +
    '{ /if }';

  assert.strictEqual(this.execBind(param).get(), '<p>yes</p>');
});

QUnit.test('if block - logical operator - or chain 1', function(assert) {
  const param = {foo: true, bar: true, baz: true};

  this.src =
    '{ if $foo or $bar or $baz }' +
    '<p>yes</p>' +
    '{ else }' +
    '<p>no</p>' +
    '{ /if }';

  assert.strictEqual(this.execBind(param).get(), '<p>yes</p>');
});

QUnit.test('if block - logical operator - or chain 2', function(assert) {
  const param = {foo: false, bar: true, baz: true};

  this.src =
    '{ if $foo or $bar or $baz }' +
    '<p>yes</p>' +
    '{ else }' +
    '<p>no</p>' +
    '{ /if }';

  assert.strictEqual(this.execBind(param).get(), '<p>yes</p>');
});

QUnit.test('if block - logical operator - or chain 3', function(assert) {
  const param = {foo: true, bar: false, baz: true};

  this.src =
    '{ if $foo or $bar or $baz }' +
    '<p>yes</p>' +
    '{ else }' +
    '<p>no</p>' +
    '{ /if }';

  assert.strictEqual(this.execBind(param).get(), '<p>yes</p>');
});

QUnit.test('if block - logical operator - or chain 4', function(assert) {
  const param = {foo: true, bar: true, baz: false};

  this.src =
    '{ if $foo or $bar or $baz }' +
    '<p>yes</p>' +
    '{ else }' +
    '<p>no</p>' +
    '{ /if }';

  assert.strictEqual(this.execBind(param).get(), '<p>yes</p>');
});

QUnit.test('if block - logical operator - combination', function(assert) {
  const param = {foo: true, bar: false, baz: true};

  this.src =
    '{ if $foo and ( $bar or $baz ) }' +
    '<p>yes</p>' +
    '{ else }' +
    '<p>no</p>' +
    '{ /if }';

  assert.strictEqual(this.execBind(param).get(), '<p>yes</p>');
});

QUnit.test('if block - comparative operator', function(assert) {
  const param = {price: 50};

  this.src =
    '{ if $price gte 100 }' +
    '<p>high</p>' +
    '{ elseif $price gte 50 }' +
    '<p>middle</p>' +
    '{ else }' +
    '<p>low</p>' +
    '{ /if }';

  assert.strictEqual(this.execBind(param).get(), '<p>middle</p>');
});

QUnit.test('if block - comparative operator - "===" and "=="', function(assert) {
  const param = {foo: true};

  this.src =
    '{ if $foo === 1 }' +
    '<p>one</p>' +
    '{ /if }' +
    '{ if $foo == 1}' +
    '<p>two</p>' +
    '{ /if }';

  assert.strictEqual(this.execBind(param).get(), '<p>two</p>');
});

QUnit.test('if block - property chainable', function(assert) {
  const param = {
    data1: {key: true},
    data2: {key: true},
  };

  this.src =
    '{ if $data1.key and $data2.key }' +
    '<p>OK</p>' +
    '{ /if }';

  assert.strictEqual(this.execBind(param).get(), '<p>OK</p>');
});

QUnit.test('if block - property not chainable - and 1', function(assert) {
  const param = {
    data1: {key1: true},
    data2: {key1: true},
  };

  this.src =
    '{ if $data1.key1 and $data2.key2 }' +
    '<p>OK</p>' +
    '{ /if }';

  assert.strictEqual(this.execBind(param).get(), '');
});

QUnit.test('if block - property not chainable - and 2', function(assert) {
  const param = {
    data1: {key2: true},
    data2: {key2: true},
  };

  this.src =
    '{ if $data1.key1 and $data2.key2 }' +
    '<p>OK</p>' +
    '{ /if }';

  assert.strictEqual(this.execBind(param).get(), '');
});

QUnit.test('if block - property not chainable - or 1', function(assert) {
  const param = {
    data1: {key1: true},
    data2: {key1: true},
  };

  this.src =
    '{ if $data1.key1 or $data2.key2 }' +
    '<p>OK</p>' +
    '{ /if }';

  assert.strictEqual(this.execBind(param).get(), '<p>OK</p>');
});

QUnit.test('if block - property not chainable - or 2', function(assert) {
  const param = {
    data1: {key2: true},
    data2: {key2: true},
  };

  this.src =
    '{ if $data1.key1 or $data2.key2 }' +
    '<p>OK</p>' +
    '{ /if }';

  assert.strictEqual(this.execBind(param).get(), '<p>OK</p>');
});

QUnit.test('for block', function(assert) {
  const param = {items: ['one', 'two', 'three']};

  this.src =
    '{ for $item in $items }' +
    '<p>{ $item }</p>' +
    '{ /for }';

  assert.strictEqual(this.execBind(param).get(), '<p>one</p><p>two</p><p>three</p>');
});

QUnit.test('for block - use index', function(assert) {
  const param = {items: ['one', 'two']};

  this.src =
    '{ for $idx,$item in $items }' +
    '<p>{ $idx }-{ $item }</p>' +
    '{ /for }';

  assert.strictEqual(this.execBind(param).get(), '<p>0-one</p><p>1-two</p>');
});

QUnit.test('for block - nested', function(assert) {
  const param = {
    items: [
      {ids: [1, 2]},
      {ids: [3, 4]},
      {ids: [5, 6]},
    ],
  };

  this.src =
    '{ for $item in $items }' +
    '<ul>' +
    '{ for $id in $item.ids }' +
    '<li>{ $id }</li>' +
    '{ /for }' +
    '</ul>' +
    '{ /for }';

  const expected =
    '<ul><li>1</li><li>2</li></ul>' +
    '<ul><li>3</li><li>4</li></ul>' +
    '<ul><li>5</li><li>6</li></ul>';

  assert.strictEqual(this.execBind(param).get(), expected);
});

QUnit.test('for block - nested - if', function(assert) {
  const param = {
    items: [
      {ids: [1, 2]},
      {ids: [3, 4]},
      {ids: [5, 6]},
    ],
  };

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

  const expected =
    '<ul><li>odd: 1</li><li>even: 2</li></ul>' +
    '<ul><li>odd: 3</li><li>even: 4</li></ul>' +
    '<ul><li>odd: 5</li><li>even: 6</li></ul>';

  assert.strictEqual(this.execBind(param).get(), expected);
});

QUnit.test('for block - nested - if with property access', function(assert) {
  const param = {
    items: [
      {
        products: [
          {id: 1, name: 'A'},
          {id: 2, name: 'B'},
        ],
      },
      {
        products: [
          {id: 1, name: 'C'},
          {id: 2, name: 'D'},
        ],
      },
    ],
  };

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

  const expected =
    '<ul><li>A</li></ul>' +
    '<ul><li>C</li></ul>';

  assert.strictEqual(this.execBind(param).get(), expected);
});

QUnit.test('for block - not iterable', function(assert) {
  const param = {items: 'hello, world!'};

  this.src =
    '{ for $item in $items }' +
    '<p>{ $item }</p>' +
    '{ /for }';

  assert.strictEqual(this.execBind(param).get(), '');
});

QUnit.test('for block - haystack property chainable', function(assert) {
  const param = {
    items: {
      data: [1, 2, 3],
    },
  };

  this.src =
    '{ for $value in $items.data }' +
    '<p>{ $value | h }</p>' +
    '{ /for }';

  assert.strictEqual(this.execBind(param).get(), '<p>1</p><p>2</p><p>3</p>');
});

QUnit.test('for block - haystack property not chainable 1', function(assert) {
  const param = {items: [1, 2, 3]};

  this.src =
    '{ for $item in $items.foo.bar }' +
    '<p>{ $item }</p>' +
    '{ /for }';

  assert.strictEqual(this.execBind(param).get(), '');
});

QUnit.test('for block - haystack property not chainable 2', function(assert) {
  const param = {
    items: [
      {name: 'name1', data: 'data1'},
      {name: 'name2', data: 'data2'},
    ],
  };

  this.src =
    '{ for $item in $items }' +
    '<div>{ $item.name | h }</div>' +
    '{ for $data in $item.data }' +
    '<p>{ $data | h }</p>' +
    '{ /for}' +
    '{ /for }';

  assert.strictEqual(this.execBind(param).get(), '<div>name1</div><div>name2</div>');
});

QUnit.test('for block - dummy variable chainable', function(assert) {
  const param = {
    items: [
      {data: {key1: 'value1'}},
      {data: {key1: 'value2'}},
    ],
  };

  this.src =
    '{ for $item in $items }' +
    '<div>{ $item.data.key1 | h }</div>' +
    '{ /for }';

  assert.strictEqual(this.execBind(param).get(), '<div>value1</div><div>value2</div>');
});

QUnit.test('error - filter not found', function(assert) {
  this.src = '<p>{ $value | hoge }</p>';

  assert.throws(function() {
    this.execBind({ value: 'test'}).get();
  }, Error);
});
