const Parser = require('../src/parser');

/**
 * @param {string} text
 * @return {AstNodeParseResult[]}
 */
const parse = (text) => {
  const parser = new Parser();

  return parser.parse(text);
};

QUnit.module('parser - literal',);

QUnit.test('1', (assert) => {
  const text = '<div>{literal}{foo} {open}bar{close} {open}endliteral{close} function() {};{endliteral}</div>';
  const result = parse(text);

  assert.strictEqual(result.length, 3);
  assert.strictEqual(result[0].type, 'normal');
  assert.strictEqual(result[0].value, '<div>');
  assert.strictEqual(result[1].type, 'literal');
  assert.strictEqual(result[1].value, '{foo} {bar} {endliteral} function() {};');
  assert.strictEqual(result[2].type, 'normal');
  assert.strictEqual(result[2].value, '</div>');
});
