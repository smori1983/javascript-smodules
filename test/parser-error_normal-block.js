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

describe('Parser - normal - error', () => {
  it('1', () => {
    parseError('<div>{left} is ok, only { is forbidden.</div>');
  });

  it('2', () => {
    parseError('<div> } is forbidden.</div>');
  });
});
