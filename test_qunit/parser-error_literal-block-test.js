const Parser = require('../src/parser');

/**
 * @param {Assert} assert
 * @param {string} text
 */
const parseError = (assert, text) => {
  const parser = new Parser();

  assert.throws(() => {
    parser.parse(text);
  }, Error);
};

QUnit.module('parser - literal - error');

QUnit.test('only open tag', (assert) => {
  parseError(assert, '<div>{literal}</div>');
});

QUnit.test('only close tag', (assert) => {
  parseError(assert, '<div>{endliteral}</div>');
});
