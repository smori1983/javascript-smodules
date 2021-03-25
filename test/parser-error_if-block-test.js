const Parser = require('../src/parser');

QUnit.module('parser - error', {
  beforeEach: function () {
    this.parser = new Parser();
  },
});

QUnit.test('if block - if elseif else - error 1', function (assert) {
  const src = '{if $foo}<p>foo</p>';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});

QUnit.test('if block - if elseif else - error 2', function (assert) {
  const src = '{elseif $foo}<p>foo</p>{endif}';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});

QUnit.test('if block - if elseif else - error 3', function (assert) {
  const src = '{else}<p>foo</p>{endif}';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});

QUnit.test('if block - if elseif else - error 4', function (assert) {
  const src = '{endif}';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});

QUnit.test('if block - if elseif else - error 5', function (assert) {
  const src = '{if $foo}<p>foo</p>{if $bar}<p>bar</p>{endif}';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});

QUnit.test('if block - conditions - error - no space 1', function (assert) {
  const src = '{if$foo }<p>ok</p>{endif}';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});

QUnit.test('if block - conditions - error - no space 2', function (assert) {
  const src = '{if $foo }<p>foo</p>{elseif$bar}<p>bar</p>{endif}';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});

QUnit.test('if block - conditions - error - round bracket balance', function (assert) {
  const src = '{if ($foo) and $bar) }<p>ok</p>{endif}';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});

QUnit.test('if block - conditions - error - lack of round_bracket_close', function (assert) {
  const src = '{if ( $foo }<p>ok</p>{endif}';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});

QUnit.test('if block - conditions - error - lack of round_bracket_open', function (assert) {
  const src = '{if ( $foo ) ) }<p>ok</p>{endif}';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});

QUnit.test('if block - conditions - error - round_bracket_open -> round_bracket_close', function (assert) {
  const src = '{if () }<p>ok</p>{endif}';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});

QUnit.test('if block - conditions - error - round_bracket_open -> comp', function (assert) {
  const src = '{if ( === $foo )}<p>ok</p>{endif}';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});

QUnit.test('if block - conditions - error - round_bracket_open -> andor', function (assert) {
  const src = '{if ( and $foo )}<p>ok</p>{endif}';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});

QUnit.test('if block - conditions - error - round_bracket_close -> round_bracket_open', function (assert) {
  const src = '{if ( $foo ) ( $bar )}<p>ok</p>{endif}';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});

QUnit.test('if block - conditions - error - round_bracket_close -> value', function (assert) {
  const src = '{if ( $foo ) 10 === $bar}<p>ok</p>{endif}';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});

QUnit.test('if block - conditions - error - round_bracket_close -> var', function (assert) {
  const src = '{if ( $foo ) $bar gte 10}<p>ok</p>{endif}';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});

QUnit.test('if block - conditions - error - round_bracket_close -> comp', function (assert) {
  const src = '{if ( $foo ) === $bar}<p>ok</p>{endif}';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});

QUnit.test('if block - conditions - error - value -> round_bracket_open', function (assert) {
  const src = '{if 10 ( $foo === 1 )}<p>ok</p>{endif}';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});

QUnit.test('if block - conditions - error - value -> value', function (assert) {
  const src = '{if 10 20}<p>ok</p>{endif}';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});

QUnit.test('if block - conditions - error - value -> var', function (assert) {
  const src = '{if 10 $foo}<p>ok</p>{endif}';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});

QUnit.test('if block - conditions - error - var -> round_bracket_open', function (assert) {
  const src = '{if $foo ( $bar === 1 )}<p>ok</p>{endif}';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});

QUnit.test('if block - conditions - error - var -> value', function (assert) {
  const src = '{if $foo 10}<p>ok</p>{endif}';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});

QUnit.test('if block - conditions - error - var -> var', function (assert) {
  const src = '{if $foo $bar}<p>ok</p>{endif}';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});

QUnit.test('if block - conditions - error - comp -> round_bracket_open', function (assert) {
  const src = '{if $foo lte ( $bar ) }<p>ok</p>{endif}';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});

QUnit.test('if block - conditions - error - comp -> round_bracket_close', function (assert) {
  const src = '{if ( $foo gte ) $bar}<p>ok</p>{endif}';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});

QUnit.test('if block - conditions - error - comp -> comp', function (assert) {
  const src = '{if $foo === === $bar}<p>ok</p>{endif}';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});

QUnit.test('if block - conditions - error - comp -> andor', function (assert) {
  const src = '{if $foo !== or $bar}<p>ok</p>{endif}';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});

QUnit.test('if block - conditions - error - comp -> value -> comp', function (assert) {
  const src = '{if 10 === 10 === 10}<p>ok</p>{endif}';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});

QUnit.test('if block - conditions - error - comp -> var -> comp', function (assert) {
  const src = '{if $foo gt $bar gt $baz}<p>ok</p>{endif}';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});

QUnit.test('if block - conditions - error - andor -> round_bracket_close', function (assert) {
  const src = '{if ( $foo or ) $bar}<p>ok</p>{endif}';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});

QUnit.test('if block - conditions - error - andor -> comp', function (assert) {
  const src = '{if $foo or === $bar}<p>ok</p>{endif}';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});

QUnit.test('if block - conditions - error - andor -> andor', function (assert) {
  const src = '{if $foo or or $bar}<p>ok</p>{endif}';

  assert.throws(function () {
    this.parser.parse(src);
  }, Error);
});
