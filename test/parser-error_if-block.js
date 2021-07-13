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

describe('Parser - if - error', () => {
  it('if elseif else - 1', () => {
    parseError('{if $foo}<p>foo</p>');
  });

  it('if elseif else - 2', () => {
    parseError('{elseif $foo}<p>foo</p>{endif}');
  });

  it('if elseif else - 3', () => {
    parseError('{else}<p>foo</p>{endif}');
  });

  it('if elseif else - 4', () => {
    parseError('{endif}');
  });

  it('if elseif else - 5', () => {
    parseError('{if $foo}<p>foo</p>{if $bar}<p>bar</p>{endif}');
  });

  it('order of statement', () => {
    parseError('{if $value1}<p>1</p>{else}<p>2</p>{elseif $value2}<p>3</p>{endif}');
  });

  it('condition - no space 1', () => {
    parseError('{if$foo }<p>ok</p>{endif}');
  });

  it('condition - no space 2', () => {
    parseError('{if $foo }<p>foo</p>{elseif$bar}<p>bar</p>{endif}');
  });

  it('condition - round bracket balance', () => {
    parseError('{if ($foo) and $bar) }<p>ok</p>{endif}');
  });

  it('condition - lack of round_bracket_close', () => {
    parseError('{if ( $foo }<p>ok</p>{endif}');
  });

  it('condition - lack of round_bracket_open', () => {
    parseError('{if ( $foo ) ) }<p>ok</p>{endif}');
  });

  it('condition - round_bracket_open -> round_bracket_close', () => {
    parseError('{if () }<p>ok</p>{endif}');
  });

  it('condition - round_bracket_open -> comp', () => {
    parseError('{if ( === $foo )}<p>ok</p>{endif}');
  });

  it('condition - round_bracket_open -> andor', () => {
    parseError('{if ( and $foo )}<p>ok</p>{endif}');
  });

  it('condition - round_bracket_close -> round_bracket_open', () => {
    parseError('{if ( $foo ) ( $bar )}<p>ok</p>{endif}');
  });

  it('condition - round_bracket_close -> value', () => {
    parseError('{if ( $foo ) 10 === $bar}<p>ok</p>{endif}');
  });

  it('condition - round_bracket_close -> var', () => {
    parseError('{if ( $foo ) $bar gte 10}<p>ok</p>{endif}');
  });

  it('condition - round_bracket_close -> comp', () => {
    parseError('{if ( $foo ) === $bar}<p>ok</p>{endif}');
  });

  it('condition - value -> round_bracket_open', () => {
    parseError('{if 10 ( $foo === 1 )}<p>ok</p>{endif}');
  });

  it('condition - value -> value', () => {
    parseError('{if 10 20}<p>ok</p>{endif}');
  });

  it('condition - value -> var', () => {
    parseError('{if 10 $foo}<p>ok</p>{endif}');
  });

  it('condition - var -> round_bracket_open', () => {
    parseError('{if $foo ( $bar === 1 )}<p>ok</p>{endif}');
  });

  it('condition - var -> value', () => {
    parseError('{if $foo 10}<p>ok</p>{endif}');
  });

  it('condition - var -> var', () => {
    parseError('{if $foo $bar}<p>ok</p>{endif}');
  });

  it('condition - comp -> round_bracket_open', () => {
    parseError('{if $foo lte ( $bar ) }<p>ok</p>{endif}');
  });

  it('condition - comp -> round_bracket_close', () => {
    parseError('{if ( $foo gte ) $bar}<p>ok</p>{endif}');
  });

  it('condition - comp -> comp', () => {
    parseError('{if $foo === === $bar}<p>ok</p>{endif}');
  });

  it('condition - comp -> andor', () => {
    parseError('{if $foo !== or $bar}<p>ok</p>{endif}');
  });

  it('condition - comp -> value -> comp', () => {
    parseError('{if 10 === 10 === 10}<p>ok</p>{endif}');
  });

  it('condition - comp -> var -> comp', () => {
    parseError('{if $foo gt $bar gt $baz}<p>ok</p>{endif}');
  });

  it('condition - andor -> round_bracket_close', () => {
    parseError('{if ( $foo or ) $bar}<p>ok</p>{endif}');
  });

  it('condition - andor -> comp', () => {
    parseError('{if $foo or === $bar}<p>ok</p>{endif}');
  });

  it('condition - andor -> andor', () => {
    parseError('{if $foo or or $bar}<p>ok</p>{endif}');
  });
});
