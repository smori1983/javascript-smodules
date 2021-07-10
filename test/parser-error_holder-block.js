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

describe('Parser - holder - error', () => {
  it('no $ mark', () => {
    parseError('{ foo }');
  });

  it('no filters - tag not closed', () => {
    parseError('{ $foo');
  });

  it('no filters - space between $ and property name', () => {
    parseError('{ $ foo } has space between $ and property name.');
  });

  it('no filters - dot between $ and property name', () => {
    parseError('{ $.foo }');
  });

  it('no filters - dot after property name', () => {
    parseError('{ $foo. }');
  });

  it('no filters - continuous dots', () => {
    parseError('{ $foo..bar }');
  });

  it('filter - tag not closed 1', () => {
    parseError('{ $foo | filter');
  });

  it('filter - tag not closed 2', () => {
    parseError('{ $foo | filter1 | filter2 | filter3');
  });

  it('filter - tag not closed 3', () => {
    parseError('{if true }{ $foo | filter1 {endif}');
  });

  it('filter - filter name has space', () => {
    parseError('{ $foo | invalid filter name }');
  });

  it('filter - filter name has symbol', () => {
    parseError('{ $foo | filter! }');
  });

  it('filter - no pipe', () => {
    parseError('{ $foo pipeNotFound }');
  });

  it('filter - no filter name before colon', () => {
    parseError('{ $foo | : 1 }');
  });

  it('filter - no filter args after colon', () => {
    parseError('{ $foo | filter : }');
  });

  it('filter - colon only', () => {
    parseError('{ $foo | : }');
  });

  it('filter with args - tag not closed', () => {
    parseError('{ $foo | filter : 1');
  });

  it('filter with args - args not separated', () => {
    parseError('{ $foo | filter : 1 2 }');
  });

  it('filter with args - NULL', () => {
    parseError('{ $foo | filter : NULL }');
  });

  it('filter with args - TRUE', () => {
    parseError('{ $foo | filter : TRUE }');
  });

  it('filter with args - FALSE', () => {
    parseError('{ $foo | filter : FALSE }');
  });

  it('filter with args - string - quote 1', () => {
    parseError('{ $foo | filter : \'test }');
  });

  it('filter with args - string - quote 2', () => {
    parseError('{ $foo | filter : test\' }');
  });

  it('filter with args - string - quote char 1', () => {
    parseError('{ $foo | filter : "test\' }');
  });

  it('filter with args - string - quote char 2', () => {
    parseError('{ $foo | filter : \'test" }');
  });
});
