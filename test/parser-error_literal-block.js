const describe = require('mocha').describe;
const it = require('mocha').it;
const assert = require('assert');
const Parser = require('../src/parser');

/**
 * @param {string} text
 */
const parseError = (text) => {
  const parser = new Parser();

  assert.throws(() => {
    parser.parse(text);
  }, Error);
};

describe('Parser - literal - error', () => {
  it('only open tag', () => {
    parseError('<div>{literal}</div>');
  });

  it('only close tag', () => {
    parseError('<div>{endliteral}</div>');
  });
});
