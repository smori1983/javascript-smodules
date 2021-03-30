const Templr = require('../src/templr');

/**
 * @param {string} source
 * @param {Object} param
 * @return {string}
 */
const render = (source, param) => {
  return new Templr().render(source, param);
};

QUnit.module('templr');

QUnit.test('normal block', (assert) => {
  const src = '<p>{open}ok{close}</p>';
  const param = {};
  const expected = '<p>{ok}</p>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('literal block', (assert) => {
  const src = '{literal}<p>{literal} {open}endliteral{close}</p>{endliteral}';
  const param = {};
  const expected = '<p>{literal} {endliteral}</p>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('if block - simple', (assert) => {
  const src =
    '{ if $foo }' +
    '<p>yes</p>' +
    '{ else }' +
    '<p>no</p>' +
    '{ endif }';
  const param = {foo: true};
  const expected = '<p>yes</p>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('if block - logical operator - and', (assert) => {
  const src =
    '{ if $foo and $bar }' +
    '<p>yes</p>' +
    '{ else }' +
    '<p>no</p>' +
    '{ endif }';
  const param = {foo: true, bar: false};
  const expected = '<p>no</p>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('if block - logical operator - and chain 1', (assert) => {
  const src =
    '{ if $foo and $bar and $baz }' +
    '<p>yes</p>' +
    '{ else }' +
    '<p>no</p>' +
    '{ endif }';
  const param = {foo: true, bar: true, baz: true};
  const expected = '<p>yes</p>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('if block - logical operator - and chain 2', (assert) => {
  const src =
    '{ if $foo and $bar and $baz }' +
    '<p>yes</p>' +
    '{ else }' +
    '<p>no</p>' +
    '{ endif }';
  const param = {foo: false, bar: true, baz: true};
  const expected = '<p>no</p>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('if block - logical operator - and chain 3', (assert) => {
  const src =
    '{ if $foo and $bar and $baz }' +
    '<p>yes</p>' +
    '{ else }' +
    '<p>no</p>' +
    '{ endif }';
  const param = {foo: true, bar: false, baz: true};
  const expected = '<p>no</p>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('if block - logical operator - and chain 4', (assert) => {
  const src =
    '{ if $foo and $bar and $baz }' +
    '<p>yes</p>' +
    '{ else }' +
    '<p>no</p>' +
    '{ endif }';
  const param = {foo: true, bar: true, baz: false};
  const expected = '<p>no</p>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('if block - logical operator - or', (assert) => {
  const src =
    '{ if $foo or $bar }' +
    '<p>yes</p>' +
    '{ else }' +
    '<p>no</p>' +
    '{ endif }';
  const param = {foo: true, bar: false};
  const expected = '<p>yes</p>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('if block - logical operator - or chain 1', (assert) => {
  const src =
    '{ if $foo or $bar or $baz }' +
    '<p>yes</p>' +
    '{ else }' +
    '<p>no</p>' +
    '{ endif }';
  const param = {foo: true, bar: true, baz: true};
  const expected = '<p>yes</p>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('if block - logical operator - or chain 2', (assert) => {
  const src =
    '{ if $foo or $bar or $baz }' +
    '<p>yes</p>' +
    '{ else }' +
    '<p>no</p>' +
    '{ endif }';
  const param = {foo: false, bar: true, baz: true};
  const expected = '<p>yes</p>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('if block - logical operator - or chain 3', (assert) => {
  const src =
    '{ if $foo or $bar or $baz }' +
    '<p>yes</p>' +
    '{ else }' +
    '<p>no</p>' +
    '{ endif }';
  const param = {foo: true, bar: false, baz: true};
  const expected = '<p>yes</p>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('if block - logical operator - or chain 4', (assert) => {
  const src =
    '{ if $foo or $bar or $baz }' +
    '<p>yes</p>' +
    '{ else }' +
    '<p>no</p>' +
    '{ endif }';
  const param = {foo: true, bar: true, baz: false};
  const expected = '<p>yes</p>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('if block - logical operator - combination', (assert) => {
  const src =
    '{ if $foo and ( $bar or $baz ) }' +
    '<p>yes</p>' +
    '{ else }' +
    '<p>no</p>' +
    '{ endif }';
  const param = {foo: true, bar: false, baz: true};
  const expected = '<p>yes</p>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('if block - comparative operator', (assert) => {
  const src =
    '{ if $price gte 100 }' +
    '<p>high</p>' +
    '{ elseif $price gte 50 }' +
    '<p>middle</p>' +
    '{ else }' +
    '<p>low</p>' +
    '{ endif }';
  const param = {price: 50};
  const expected = '<p>middle</p>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('if block - comparative operator - "===" and "=="', (assert) => {
  const src =
    '{ if $foo === 1 }' +
    '<p>one</p>' +
    '{ endif }' +
    '{ if $foo == 1}' +
    '<p>two</p>' +
    '{ endif }';
  const param = {foo: true};
  const expected = '<p>two</p>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('if block - property chainable', (assert) => {
  const src =
    '{ if $data1.key and $data2.key }' +
    '<p>OK</p>' +
    '{ endif }';
  const param = {
    data1: {key: true},
    data2: {key: true},
  };
  const expected = '<p>OK</p>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('if block - property not chainable - and 1', (assert) => {
  const src =
    '{ if $data1.key1 and $data2.key2 }' +
    '<p>OK</p>' +
    '{ endif }';
  const param = {
    data1: {key1: true},
    data2: {key1: true},
  };
  const expected = '';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('if block - property not chainable - and 2', (assert) => {
  const src =
    '{ if $data1.key1 and $data2.key2 }' +
    '<p>OK</p>' +
    '{ endif }';
  const param = {
    data1: {key2: true},
    data2: {key2: true},
  };
  const expected = '';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('if block - property not chainable - or 1', (assert) => {
  const src =
    '{ if $data1.key1 or $data2.key2 }' +
    '<p>OK</p>' +
    '{ endif }';
  const param = {
    data1: {key1: true},
    data2: {key1: true},
  };
  const expected = '<p>OK</p>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('if block - property not chainable - or 2', (assert) => {
  const src =
    '{ if $data1.key1 or $data2.key2 }' +
    '<p>OK</p>' +
    '{ endif }';
  const param = {
    data1: {key2: true},
    data2: {key2: true},
  };
  const expected = '<p>OK</p>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('if block - nested - for', (assert) => {
  const src =
    '{ if $data1.status }' +
    '{ for $item in $data1.items }' +
    '<p>{ $item }</p>' +
    '{ endfor }' +
    '{ endif }';
  const param = {
    data1: {
      status: true,
      items: ['a', 'b', 'c'],
    },
  };
  const expected = '<p>a</p><p>b</p><p>c</p>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('for block', (assert) => {
  const src =
    '{ for $item in $items }' +
    '<p>{ $item }</p>' +
    '{ endfor }';
  const param = {items: ['one', 'two', 'three']};
  const expected = '<p>one</p><p>two</p><p>three</p>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('for block - use index', (assert) => {
  const src =
    '{ for $idx,$item in $items }' +
    '<p>{ $idx }-{ $item }</p>' +
    '{ endfor }';
  const param = {items: ['one', 'two']};
  const expected = '<p>0-one</p><p>1-two</p>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('for block - nested', (assert) => {
  const src =
    '{ for $item in $items }' +
    '<ul>' +
    '{ for $id in $item.ids }' +
    '<li>{ $id }</li>' +
    '{ endfor }' +
    '</ul>' +
    '{ endfor }';
  const param = {
    items: [
      {ids: [1, 2]},
      {ids: [3, 4]},
      {ids: [5, 6]},
    ],
  };
  const expected =
    '<ul><li>1</li><li>2</li></ul>' +
    '<ul><li>3</li><li>4</li></ul>' +
    '<ul><li>5</li><li>6</li></ul>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('for block - nested - if', (assert) => {
  const src =
    '{ for $item in $items }' +
    '<ul>' +
    '{ for $id in $item.ids }' +
    '{ if $id === 1 or $id === 3 or $id === 5 }' +
    '<li>odd: { $id }</li>' +
    '{ else }' +
    '<li>even: { $id }</li>' +
    '{ endif }' +
    '{ endfor }' +
    '</ul>' +
    '{ endfor }';
  const param = {
    items: [
      {ids: [1, 2]},
      {ids: [3, 4]},
      {ids: [5, 6]},
    ],
  };
  const expected =
    '<ul><li>odd: 1</li><li>even: 2</li></ul>' +
    '<ul><li>odd: 3</li><li>even: 4</li></ul>' +
    '<ul><li>odd: 5</li><li>even: 6</li></ul>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('for block - nested - if with property access', (assert) => {
  const src =
    '{ for $item in $items }' +
    '<ul>' +
    '{ for $product in $item.products }' +
    '{ if $product.id === 1 }' +
    '<li>{ $product.name }</li>' +
    '{ endif }' +
    '{ endfor }' +
    '</ul>' +
    '{ endfor }';
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
  const expected =
    '<ul><li>A</li></ul>' +
    '<ul><li>C</li></ul>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('for block - not iterable', (assert) => {
  const src =
    '{ for $item in $items }' +
    '<p>{ $item }</p>' +
    '{ endfor }';
  const param = {items: 'hello, world!'};
  const expected = '';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('for block - haystack property chainable', (assert) => {
  const src =
    '{ for $value in $items.data }' +
    '<p>{ $value }</p>' +
    '{ endfor }';
  const param = {
    items: {
      data: [1, 2, 3],
    },
  };
  const expected = '<p>1</p><p>2</p><p>3</p>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('for block - haystack property not chainable 1', (assert) => {
  const src =
    '{ for $item in $items.foo.bar }' +
    '<p>{ $item }</p>' +
    '{ endfor }';
  const param = {items: [1, 2, 3]};
  const expected = '';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('for block - haystack property not chainable 2', (assert) => {
  const src =
    '{ for $item in $items }' +
    '<div>{ $item.name }</div>' +
    '{ for $data in $item.data }' +
    '<p>{ $data }</p>' +
    '{ endfor}' +
    '{ endfor }';
  const param = {
    items: [
      {name: 'name1', data: 'data1'},
      {name: 'name2', data: 'data2'},
    ],
  };
  const expected = '<div>name1</div><div>name2</div>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('for block - dummy variable chainable', (assert) => {
  const src =
    '{ for $item in $items }' +
    '<div>{ $item.data.key1 }</div>' +
    '{ endfor }';
  const param = {
    items: [
      {data: {key1: 'value1'}},
      {data: {key1: 'value2'}},
    ],
  };
  const expected = '<div>value1</div><div>value2</div>';

  assert.strictEqual(render(src, param), expected);
});

QUnit.test('error - filter not found', (assert) => {
  const src = '<p>{ $value | foo }</p>';
  const param = {};

  assert.throws(() => {
    render(src, param);
  }, Error);
});
