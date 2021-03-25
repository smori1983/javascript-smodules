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

QUnit.module('parser - error');

QUnit.test('if block - if elseif else - error 1', (assert) => {
  parseError(assert, '{if $foo}<p>foo</p>');
});

QUnit.test('if block - if elseif else - error 2', (assert) => {
  parseError(assert, '{elseif $foo}<p>foo</p>{endif}');
});

QUnit.test('if block - if elseif else - error 3', (assert) => {
  parseError(assert, '{else}<p>foo</p>{endif}');
});

QUnit.test('if block - if elseif else - error 4', (assert) => {
  parseError(assert, '{endif}');
});

QUnit.test('if block - if elseif else - error 5', (assert) => {
  parseError(assert, '{if $foo}<p>foo</p>{if $bar}<p>bar</p>{endif}');
});

QUnit.test('if block - conditions - error - no space 1', (assert) => {
  parseError(assert, '{if$foo }<p>ok</p>{endif}');
});

QUnit.test('if block - conditions - error - no space 2', (assert) => {
  parseError(assert, '{if $foo }<p>foo</p>{elseif$bar}<p>bar</p>{endif}');
});

QUnit.test('if block - conditions - error - round bracket balance', (assert) => {
  parseError(assert, '{if ($foo) and $bar) }<p>ok</p>{endif}');
});

QUnit.test('if block - conditions - error - lack of round_bracket_close', (assert) => {
  parseError(assert, '{if ( $foo }<p>ok</p>{endif}');
});

QUnit.test('if block - conditions - error - lack of round_bracket_open', (assert) => {
  parseError(assert, '{if ( $foo ) ) }<p>ok</p>{endif}');
});

QUnit.test('if block - conditions - error - round_bracket_open -> round_bracket_close', (assert) => {
  parseError(assert, '{if () }<p>ok</p>{endif}');
});

QUnit.test('if block - conditions - error - round_bracket_open -> comp', (assert) => {
  parseError(assert, '{if ( === $foo )}<p>ok</p>{endif}');
});

QUnit.test('if block - conditions - error - round_bracket_open -> andor', (assert) => {
  parseError(assert, '{if ( and $foo )}<p>ok</p>{endif}');
});

QUnit.test('if block - conditions - error - round_bracket_close -> round_bracket_open', (assert) => {
  parseError(assert, '{if ( $foo ) ( $bar )}<p>ok</p>{endif}');
});

QUnit.test('if block - conditions - error - round_bracket_close -> value', (assert) => {
  parseError(assert, '{if ( $foo ) 10 === $bar}<p>ok</p>{endif}');
});

QUnit.test('if block - conditions - error - round_bracket_close -> var', (assert) => {
  parseError(assert, '{if ( $foo ) $bar gte 10}<p>ok</p>{endif}');
});

QUnit.test('if block - conditions - error - round_bracket_close -> comp', (assert) => {
  parseError(assert, '{if ( $foo ) === $bar}<p>ok</p>{endif}');
});

QUnit.test('if block - conditions - error - value -> round_bracket_open', (assert) => {
  parseError(assert, '{if 10 ( $foo === 1 )}<p>ok</p>{endif}');
});

QUnit.test('if block - conditions - error - value -> value', (assert) => {
  parseError(assert, '{if 10 20}<p>ok</p>{endif}');
});

QUnit.test('if block - conditions - error - value -> var', (assert) => {
  parseError(assert, '{if 10 $foo}<p>ok</p>{endif}');
});

QUnit.test('if block - conditions - error - var -> round_bracket_open', (assert) => {
  parseError(assert, '{if $foo ( $bar === 1 )}<p>ok</p>{endif}');
});

QUnit.test('if block - conditions - error - var -> value', (assert) => {
  parseError(assert, '{if $foo 10}<p>ok</p>{endif}');
});

QUnit.test('if block - conditions - error - var -> var', (assert) => {
  parseError(assert, '{if $foo $bar}<p>ok</p>{endif}');
});

QUnit.test('if block - conditions - error - comp -> round_bracket_open', (assert) => {
  parseError(assert, '{if $foo lte ( $bar ) }<p>ok</p>{endif}');
});

QUnit.test('if block - conditions - error - comp -> round_bracket_close', (assert) => {
  parseError(assert, '{if ( $foo gte ) $bar}<p>ok</p>{endif}');
});

QUnit.test('if block - conditions - error - comp -> comp', (assert) => {
  parseError(assert, '{if $foo === === $bar}<p>ok</p>{endif}');
});

QUnit.test('if block - conditions - error - comp -> andor', (assert) => {
  parseError(assert, '{if $foo !== or $bar}<p>ok</p>{endif}');
});

QUnit.test('if block - conditions - error - comp -> value -> comp', (assert) => {
  parseError(assert, '{if 10 === 10 === 10}<p>ok</p>{endif}');
});

QUnit.test('if block - conditions - error - comp -> var -> comp', (assert) => {
  parseError(assert, '{if $foo gt $bar gt $baz}<p>ok</p>{endif}');
});

QUnit.test('if block - conditions - error - andor -> round_bracket_close', (assert) => {
  parseError(assert, '{if ( $foo or ) $bar}<p>ok</p>{endif}');
});

QUnit.test('if block - conditions - error - andor -> comp', (assert) => {
  parseError(assert, '{if $foo or === $bar}<p>ok</p>{endif}');
});

QUnit.test('if block - conditions - error - andor -> andor', (assert) => {
  parseError(assert, '{if $foo or or $bar}<p>ok</p>{endif}');
});
