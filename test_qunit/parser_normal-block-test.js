const Parser = require('../src/parser');

/**
 * @param {string} text
 * @return {AstNodeParseResult[]}
 */
const parse = (text) => {
  const parser = new Parser();

  return parser.parse(text);
};

QUnit.module('parser - normal');

QUnit.test('plain text', (assert) => {
  const text = 'Hello, world!';
  const result = parse(text);

  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].type, 'normal');
  assert.strictEqual(result[0].value, 'Hello, world!');
});

QUnit.test('plain html', (assert) => {
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

QUnit.test('plain html broken', (assert) => {
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

QUnit.test('delimiter tag', (assert) => {
  const text = '<div>{open}Hello, world!{close}</div>';
  const result = parse(text);

  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].type, 'normal');
  assert.strictEqual(result[0].value, '<div>{Hello, world!}</div>');
});
