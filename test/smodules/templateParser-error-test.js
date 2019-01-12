QUnit.module('templateParser - error', {
  before: function() {
    this.parse = function() {
      this.result = this.parser.parse(this.source);
    };
  },
  beforeEach: function() {
    this.parser = smodules.templateParser();
    this.source = '';
    this.result = null;
  },
});

QUnit.test('normal block - error - 1', function(assert) {
  this.source = '<div>{left} is ok, only { is forbidden.</div>';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('normal block - error - 2', function(assert) {
  this.source = '<div> } is forbidden.</div>';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('literal block - error - only open tag', function(assert) {
  this.source = '<div>{literal}</div>';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('literal block - error - only close tag', function(assert) {
  this.source = '<div>{/literal}</div>';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('holder block - no filters - error - space between $ and property name', function(assert) {
  this.source = '{ $ foo } has space between $ and property name.';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('holder block - no filters - error - dot between $ and property name', function(assert) {
  this.source = '{ $.foo }';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('holder block - no filters - error - dot after property name', function(assert) {
  this.source = '{ $foo. }';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('holder block - no filters - error - continuous dots', function(assert) {
  this.source = '{ $foo..bar }';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('holder block - filter - error - filter name has space', function(assert) {
  this.source = '{ $foo | invalid filter name }';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('holder block - filter - error - filter name has symbol', function(assert) {
  this.source = '{ $foo | filter! }';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('holder block - filter - error - no pipe', function(assert) {
  this.source = '{ $foo pipeNotFound }';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('holder block - filter - error - no filter name before colon', function(assert) {
  this.source = '{ $foo | : 1 }';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('holder block - filter - error - no filter args after colon', function(assert) {
  this.source = '{ $foo | filter : }';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('holder block - filter - error - colon only', function(assert) {
  this.source = '{ $foo | : }';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('holder block - filter with args - error - NULL', function(assert) {
  this.source = '{ $foo | filter : NULL }';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('holder block - filter with args - error - TRUE', function(assert) {
  this.source = '{ $foo | filter : TRUE }';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('holder block - filter with args - error - FALSE', function(assert) {
  this.source = '{ $foo | filter : FALSE }';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('holder block - filter with args - string - error - quote 1', function(assert) {
  this.source = '{ $foo | filter : \'test }';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('holder block - filter with args - string - error - quote 2', function(assert) {
  this.source = '{ $foo | filter : test\' }';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('holder block - filter with args - string - error - quote char 1', function(assert) {
  this.source = '{ $foo | filter : "test\' }';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('holder block - filter with args - string - error - quote char 2', function(assert) {
  this.source = '{ $foo | filter : \'test" }';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('if block - if elseif else - error 1', function(assert) {
  this.source = '{if $foo}<p>hoge</p>';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('if block - if elseif else - error 2', function(assert) {
  this.source = '{elseif $foo}<p>hoge</p>{/if}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('if block - if elseif else - error 3', function(assert) {
  this.source = '{else}<p>hoge</p>{/if}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('if block - if elseif else - error 4', function(assert) {
  this.source = '{/if}';

  assert.throws(function() {
    this.parse();
  }, Error);
});
QUnit.test('if block - if elseif else - error 5', function(assert) {
  this.source = '{if $foo}<p>foo</p>{if $bar}<p>bar</p>{/if}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('if block - conditions - error - no space 1', function(assert) {
  this.source = '{if$foo }<p>ok</p>{/if}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('if block - conditions - error - no space 2', function(assert) {
  this.source = '{if $foo }<p>foo</p>{elseif$bar}<p>bar</p>{/if}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('if block - conditions - error - round bracket balance', function(assert) {
  this.source = '{if ($foo) and $bar) }<p>ok</p>{/if}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('if block - conditions - error - lack of endRoundBracket', function(assert) {
  this.source = '{if ( $foo }<p>ok</p>{/if}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('if block - conditions - error - lack of roundBracket', function(assert) {
  this.source = '{if ( $foo ) ) }<p>ok</p>{/if}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('if block - conditions - error - roundBracket -> endRoundBracket', function(assert) {
  this.source = '{if () }<p>ok</p>{/if}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('if block - conditions - error - roundBracket -> comp', function(assert) {
  this.source = '{if ( === $foo )}<p>ok</p>{/if}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('if block - conditions - error - roundBracket -> andor', function(assert) {
  this.source = '{if ( and $foo )}<p>ok</p>{/if}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('if block - conditions - error - endRoundBracket -> roundBracket', function(assert) {
  this.source = '{if ( $foo ) ( $bar )}<p>ok</p>{/if}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('if block - conditions - error - endRoundBracket -> value', function(assert) {
  this.source = '{if ( $foo ) 10 === $bar}<p>ok</p>{/if}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('if block - conditions - error - endRoundBracket -> var', function(assert) {
  this.source = '{if ( $foo ) $bar gte 10}<p>ok</p>{/if}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('if block - conditions - error - endRoundBracket -> comp', function(assert) {
  this.source = '{if ( $foo ) === $bar}<p>ok</p>{/if}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('if block - conditions - error - value -> roundBracket', function(assert) {
  this.source = '{if 10 ( $foo === 1 )}<p>ok</p>{/if}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('if block - conditions - error - value -> value', function(assert) {
  this.source = '{if 10 20}<p>ok</p>{/if}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('if block - conditions - error - value -> var', function(assert) {
  this.source = '{if 10 $foo}<p>ok</p>{/if}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('if block - conditions - error - var -> roundBracket', function(assert) {
  this.source = '{if $foo ( $bar === 1 )}<p>ok</p>{/if}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('if block - conditions - error - var -> value', function(assert) {
  this.source = '{if $foo 10}<p>ok</p>{/if}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('if block - conditions - error - var -> var', function(assert) {
  this.source = '{if $foo $bar}<p>ok</p>{/if}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('if block - conditions - error - comp -> roundBracket', function(assert) {
  this.source = '{if $foo lte ( $bar ) }<p>ok</p>{/if}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('if block - conditions - error - comp -> endRoundBracket', function(assert) {
  this.source = '{if ( $foo gte ) $bar}<p>ok</p>{/if}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('if block - conditions - error - comp -> comp', function(assert) {
  this.source = '{if $foo === === $bar}<p>ok</p>{/if}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('if block - conditions - error - comp -> andor', function(assert) {
  this.source = '{if $foo !== or $bar}<p>ok</p>{/if}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('if block - conditions - error - comp -> value -> comp', function(assert) {
  this.source = '{if 10 === 10 === 10}<p>ok</p>{/if}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('if block - conditions - error - comp -> var -> comp', function(assert) {
  this.source = '{if $foo gt $bar gt $baz}<p>ok</p>{/if}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('if block - conditions - error - andor -> endRoundBracket', function(assert) {
  this.source = '{if ( $foo or ) $bar}<p>ok</p>{/if}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('if block - conditions - error - andor -> comp', function(assert) {
  this.source = '{if $foo or === $bar}<p>ok</p>{/if}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('if block - conditions - error - andor -> andor', function(assert) {
  this.source = '{if $foo or or $bar}<p>ok</p>{/if}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('for block - error - lack of index argument', function(assert) {
  this.source = '{for , $item in $items}<p>{$item}</p>{/for}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('for block - error - lack of comma', function(assert) {
  this.source = '{for $idx $item in $items}<p>{$item}</p>{/for}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('for block - error - lack of value argument', function(assert) {
  this.source = '{for $idx , in $items}<p>{$idx}</p>{/for}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('for block - error - lack of in', function(assert) {
  this.source = '{for $idx , $item $items}<p>{$item}</p>{/for}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('for block - error - lack of haystack', function(assert) {
  this.source = '{for $idx , $item in}<p>{$item}</p>{/for}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('for block - error - too many elements 1', function(assert) {
  this.source = '{for $idx , $item , $foo in $items}<p>{$item}</p>{/for}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('for block - error - too many elements 2', function(assert) {

  this.source = '{for $idx , $item in $items1 , $items2}<p>{$item}</p>{/for}';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('for block - error - too many elements 3', function(assert) {

  this.source = '{for $idx , $item in $items1 $items2}<p>{$item}</p>{/for}';

  assert.throws(function() {
    this.parse();
  }, Error);
});
