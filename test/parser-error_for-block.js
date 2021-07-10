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

describe('Parser - for - error', () => {
  it('lack of index argument', () => {
    parseError('{for , $item in $items}<p>{$item}</p>{endfor}');
  });

  it('invalid index argument', () => {
    parseError('{for $, $item in $items}<p>{$item}</p>{endfor}');
  });

  it('lack of comma', () => {
    parseError('{for $idx $item in $items}<p>{$item}</p>{endfor}');
  });

  it('lack of value argument', () => {
    parseError('{for $idx , in $items}<p>{$idx}</p>{endfor}');
  });

  it('invalid value argument', () => {
    parseError('{for $idx , $ in $items}<p>{$idx}</p>{endfor}');
  });

  it('lack of in 1', () => {
    parseError('{for $item $items}<p>{$item}</p>{endfor}');
  });

  it('lack of in 2', () => {
    parseError('{for $idx , $item $items}<p>{$item}</p>{endfor}');
  });

  it('lack of haystack', () => {
    parseError('{for $idx , $item in}<p>{$item}</p>{endfor}');
  });

  it('too many elements 1', () => {
    parseError('{for $idx , $item , $foo in $items}<p>{$item}</p>{endfor}');
  });

  it('too many elements 2', () => {
    parseError('{for $idx , $item in $items1 , $items2}<p>{$item}</p>{endfor}');
  });

  it('too many elements 3', () => {
    parseError('{for $idx , $item in $items1 $items2}<p>{$item}</p>{endfor}');
  });

  it('no space after for', () => {
    parseError('{for$item in $items}<p>{$item}</p>{endfor}');
  });

  it('no space around in 1', () => {
    parseError('{for $itemin $items}<p>{$item}</p>{endfor}');
  });

  it('no space around in 2', () => {
    parseError('{for $item in$items}<p>{$item}</p>{endfor}');
  });

  it('no space around in 3', () => {
    parseError('{for $idx, $itemin $items}<p>{$item}</p>{endfor}');
  });

  it('no space around in 4', () => {
    parseError('{for $idx, $item in$items}<p>{$item}</p>{endfor}');
  });
});


