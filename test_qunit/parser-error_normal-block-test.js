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

QUnit.module('parser - normal - error');

QUnit.test('1', (assert) => {
  parseError(assert, '<div>{left} is ok, only { is forbidden.</div>');
});

QUnit.test('2', (assert) => {
  parseError(assert, '<div> } is forbidden.</div>');
});
