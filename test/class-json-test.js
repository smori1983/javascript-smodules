QUnit.module('class-json');

class Sample1 {
  constructor(name) {
    this._name = name;
    this._children = [];
  }

  addChild(child) {
    this._children.push(child);
  }
}

QUnit.test('single Sample1', function (assert) {
  const sample1 = new Sample1('foo');

  const jsonString = JSON.stringify(sample1);

  const expected = {
    _name: 'foo',
    _children: [],
  };

  assert.deepEqual(JSON.parse(jsonString), expected);
});

QUnit.test('array of Sample1', function (assert) {
  const sample1List = [
    new Sample1('foo'),
    new Sample1('bar'),
  ];

  const jsonString = JSON.stringify(sample1List);

  const expected = [
    {
      _name: 'foo',
      _children: [],
    },
    {
      _name: 'bar',
      _children: [],
    },
  ];

  assert.deepEqual(JSON.parse(jsonString), expected);
});

QUnit.test('nest of Sample1', function (assert) {
  const parent = new Sample1('a');
  parent.addChild(new Sample1('b'));
  parent.addChild(new Sample1('c'));

  const jsonString = JSON.stringify(parent);

  const expected = {
    _name: 'a',
    _children: [
      {
        _name: 'b',
        _children: [],
      },
      {
        _name: 'c',
        _children: [],
      },
    ],
  };

  assert.deepEqual(JSON.parse(jsonString), expected);
});
