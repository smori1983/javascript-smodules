const describe = require('mocha').describe;
const it = require('mocha').it;
const assert = require('assert');

class Sample1 {
  constructor(name) {
    this._name = name;
    this._children = [];
  }

  /**
   * @param {Sample1} child
   */
  addChild(child) {
    this._children.push(child);
  }
}

describe('class json handling', () => {
  it('single class', () => {
    const sample1 = new Sample1('foo');

    const jsonString = JSON.stringify(sample1);

    const expected = {
      _name: 'foo',
      _children: [],
    };

    assert.deepStrictEqual(JSON.parse(jsonString), expected);
  });

  it('array of classes', () => {
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

    assert.deepStrictEqual(JSON.parse(jsonString), expected);
  });

  it('nest of classes', () => {
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

    assert.deepStrictEqual(JSON.parse(jsonString), expected);
  });
});
