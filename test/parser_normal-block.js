const describe = require('mocha').describe;
const it = require('mocha').it;
const assert = require('assert');
const Parser = require('../src/parser');

/**
 * @param {string} text
 * @return {AstNodeParseResult[]}
 */
const parse = (text) => {
  const parser = new Parser();

  return parser.parse(text);
};

describe('Parser - normal', () => {
  it('plain text', () => {
    const text = 'Hello, world!';
    const result = parse(text);

    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].type, 'normal');
    assert.strictEqual(result[0].value, 'Hello, world!');
  });

  it('plain html', () => {
    const text =
      '<ul>' +
      '<li>one</li>' +
      '<li>two</li>' +
      '</ul>';
    const result = parse(text);

    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].type, 'normal');
    assert.strictEqual(result[0].value, '<ul><li>one</li><li>two</li></ul>');
  });

  it('plain html broken', () => {
    const text =
      '<ul>' +
      '<li>one' +
      '<li>two' +
      '</div>';
    const result = parse(text);

    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].type, 'normal');
    assert.strictEqual(result[0].value, '<ul><li>one<li>two</div>');
  });

  it('delimiter tag', () => {
    const text = '<div>{open}Hello, world!{close}</div>';
    const result = parse(text);

    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].type, 'normal');
    assert.strictEqual(result[0].value, '<div>{Hello, world!}</div>');
  });
});
