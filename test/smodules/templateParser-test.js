QUnit.module('smodules.templateParser', {
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

QUnit.test('normal block', function(assert) {
  this.source = '<div>foo {left}bar{right}</div>';
  this.parse();

  assert.strictEqual(this.result.length, 1);
  assert.strictEqual(this.result[0].type, 'normal');
  assert.strictEqual(this.result[0].expr, '<div>foo {bar}</div>');
});

QUnit.test('literal block', function(assert) {
  this.source ='<div>{literal}{foo} {left}bar{right} {left}/literal{right} function() {};{/literal}</div>',
  this.parse();

  assert.strictEqual(this.result.length, 3);
  assert.strictEqual(this.result[0].type, 'normal');
  assert.strictEqual(this.result[0].expr, '<div>');
  assert.strictEqual(this.result[1].type, 'literal');
  assert.strictEqual(this.result[1].expr, '{foo} {bar} {/literal} function() {};');
  assert.strictEqual(this.result[2].type, 'normal');
  assert.strictEqual(this.result[2].expr, '</div>');
});

QUnit.test('holder block - no filters', function(assert) {
  this.source = '{ $foo.bar }',
  this.parse();

  assert.strictEqual(this.result.length, 1);
  assert.strictEqual(this.result[0].type, 'holder');
  assert.strictEqual(this.result[0].keys.length, 2);
  assert.strictEqual(this.result[0].keys[0], 'foo');
  assert.strictEqual(this.result[0].keys[1], 'bar');
  assert.strictEqual(this.result[0].filters.length, 0);
});


QUnit.test('holder block - filters with no args', function(assert) {
  this.source  = '{ $foo | filter1 | filter2 }';
  this.parse();

  var filter1 = this.result[0].filters[0];
  var filter2 = this.result[0].filters[1];

  assert.strictEqual(filter1.name, 'filter1');
  assert.strictEqual(filter1.args.length, 0);
  assert.strictEqual(filter2.name, 'filter2');
  assert.strictEqual(filter2.args.length, 0);
});

QUnit.test('holder block - filter with args - null, true and false', function(assert) {
  this.source = '{ $foo | filter : null, true, false }';
  this.parse();

  var filter = this.result[0].filters[0];

  assert.strictEqual(filter.args[0], null);
  assert.strictEqual(filter.args[1], true);
  assert.strictEqual(filter.args[2], false);
});

QUnit.test('holder block - filter with args - string', function(assert) {
  this.source = '{ $foo | filter : "test", "{delimiter}", "it\'s string" }';
  this.parse();

  var filter = this.result[0].filters[0];

  assert.strictEqual(filter.args[0], 'test');
  assert.strictEqual(filter.args[1], '{delimiter}');
  assert.strictEqual(filter.args[2], 'it\'s string');
});

QUnit.test('holder block - filter with args - number', function(assert) {
  this.source = '{ $foo | filter : 0, 10, -99, 12.3, -0.123, 1e+1, 1e1, 10e-1 }',
  this.parse();

  var filter = this.result[0].filters[0];

  assert.strictEqual(filter.args[0], 0);
  assert.strictEqual(filter.args[1], 10);
  assert.strictEqual(filter.args[2], -99);
  assert.strictEqual(filter.args[3], 12.3);
  assert.strictEqual(filter.args[4], -0.123);
  assert.strictEqual(filter.args[5], 10);
  assert.strictEqual(filter.args[6], 10);
  assert.strictEqual(filter.args[7], 1);
});

QUnit.test('if block - if elseif else', function(assert) {
  var section;

  this.source =
    '{ if $value1 }' +
    '<div>value1</div>' +
    '{ elseif $value2 }' +
    '<div>value2</div>' +
    '{ elseif $value3 }' +
    '<div>value3</div>' +
    '{ else }' +
    '<div>value4</div>' +
    '{ /if }',
  this.parse();

  assert.strictEqual(this.result[0].type, 'if');
  assert.strictEqual(this.result[0].sections.length, 4);

  section = this.result[0].sections[0];
  assert.strictEqual(section.header.type, 'if');
  assert.strictEqual(section.blocks.length, 1);
  assert.strictEqual(section.blocks[0].type, 'normal');
  assert.strictEqual(section.blocks[0].expr, '<div>value1</div>');

  section = this.result[0].sections[1];
  assert.strictEqual(section.header.type, 'elseif');
  assert.strictEqual(section.blocks.length, 1);
  assert.strictEqual(section.blocks[0].type, 'normal');
  assert.strictEqual(section.blocks[0].expr, '<div>value2</div>');

  section = this.result[0].sections[2];
  assert.strictEqual(section.header.type, 'elseif');
  assert.strictEqual(section.blocks.length, 1);
  assert.strictEqual(section.blocks[0].type, 'normal');
  assert.strictEqual(section.blocks[0].expr, '<div>value3</div>');

  section = this.result[0].sections[3];
  assert.strictEqual(section.header.type, 'else');
  assert.strictEqual(section.blocks.length, 1);
  assert.strictEqual(section.blocks[0].type, 'normal');
  assert.strictEqual(section.blocks[0].expr, '<div>value4</div>');
});

QUnit.test('if block - condition - simple', function(assert) {
  this.source =
    '{ if $foo === "hoge" }' +
    '<p>hoge</p>' + 
    '{ /if }';
  this.parse();

  var stack = this.result[0].sections[0].header.stack;

  assert.strictEqual(stack.length, 3);
  assert.strictEqual(stack[0].type, 'var');
  assert.strictEqual(stack[0].keys.join('.'), 'foo');
  assert.strictEqual(stack[1].type, 'value');
  assert.strictEqual(stack[1].value, 'hoge');
  assert.strictEqual(stack[2].type, 'comp');
  assert.strictEqual(stack[2].expr, '===');
});

QUnit.test('if block - condition - redundant round brackets', function(assert) {
  this.source =
    '{ if ( ( ( $foo === "hoge" ) ) ) }' +
    '<p>hoge</p>' +
    '{ /if }';
  this.parse();

  var stack = this.result[0].sections[0].header.stack;

  assert.strictEqual(stack.length, 3);
  assert.strictEqual(stack[0].type, 'var');
  assert.strictEqual(stack[0].keys.join('.'), 'foo');
  assert.strictEqual(stack[1].type, 'value');
  assert.strictEqual(stack[1].value, 'hoge');
  assert.strictEqual(stack[2].type, 'comp');
  assert.strictEqual(stack[2].expr, '===');
});

QUnit.test('if block - condition - complicated', function(assert) {
  this.source =
    '{ if $val1 gt 10 and $val2 gte -1 or $val3 lt 1.0 and $val4 lte -1.0 }' +
    '<p>ok</p>' +
    '{ /if }';
  this.parse();

  var stack  = this.result[0].sections[0].header.stack;

  assert.strictEqual(stack.length, 15);
  assert.strictEqual(stack[0].type, 'var');
  assert.strictEqual(stack[0].keys.join('.'), 'val1');
  assert.strictEqual(stack[1].type, 'value');
  assert.strictEqual(stack[1].value, 10);
  assert.strictEqual(stack[2].type, 'comp');
  assert.strictEqual(stack[2].expr, 'gt');
  assert.strictEqual(stack[3].type, 'var');
  assert.strictEqual(stack[3].keys.join('.'), 'val2');
  assert.strictEqual(stack[4].type, 'value');
  assert.strictEqual(stack[4].value, -1);
  assert.strictEqual(stack[5].type, 'comp');
  assert.strictEqual(stack[5].expr, 'gte');
  assert.strictEqual(stack[6].type, 'andor');
  assert.strictEqual(stack[6].expr, 'and');
  assert.strictEqual(stack[7].type, 'var');
  assert.strictEqual(stack[7].keys.join('.'), 'val3');
  assert.strictEqual(stack[8].type, 'value');
  assert.strictEqual(stack[8].value, 1.0);
  assert.strictEqual(stack[9].type, 'comp');
  assert.strictEqual(stack[9].expr, 'lt');
  assert.strictEqual(stack[10].type, 'var');
  assert.strictEqual(stack[10].keys.join('.'), 'val4');
  assert.strictEqual(stack[11].type, 'value');
  assert.strictEqual(stack[11].value, -1.0);
  assert.strictEqual(stack[12].type, 'comp');
  assert.strictEqual(stack[12].expr, 'lte');
  assert.strictEqual(stack[13].type, 'andor');
  assert.strictEqual(stack[13].expr, 'and');
  assert.strictEqual(stack[14].type, 'andor');
  assert.strictEqual(stack[14].expr, 'or');
});

QUnit.test('if block - condition - inversion of lval and rval', function(assert) {
  this.source =
    '{ if 10 !== $price }' +
    '<p>ok</p>' +
    '{ /if }';
  this.parse();

  var stack  = this.result[0].sections[0].header.stack;

  assert.strictEqual(stack.length, 3);
  assert.strictEqual(stack[0].type, 'value');
  assert.strictEqual(stack[0].value, 10);
  assert.strictEqual(stack[1].type, 'var');
  assert.strictEqual(stack[1].keys.join('.'), 'price');
  assert.strictEqual(stack[2].type, 'comp');
  assert.strictEqual(stack[2].expr, '!==');
});

QUnit.test('if block - condition - priority of and/or', function(assert) {
  this.source =
    '{ if ( $var1 or $var2 ) and $var3 }' +
    '<p>ok</p>' +
    '{ /if }';
  this.parse();

  var stack  = this.result[0].sections[0].header.stack;

  assert.strictEqual(stack.length, 5);
  assert.strictEqual(stack[0].type, 'var');
  assert.strictEqual(stack[0].keys.join('.'), 'var1');
  assert.strictEqual(stack[1].type, 'var');
  assert.strictEqual(stack[1].keys.join('.'), 'var2');
  assert.strictEqual(stack[2].type, 'andor');
  assert.strictEqual(stack[2].expr, 'or');
  assert.strictEqual(stack[3].type, 'var');
  assert.strictEqual(stack[3].keys.join('.'), 'var3');
  assert.strictEqual(stack[4].type, 'andor');
  assert.strictEqual(stack[4].expr, 'and');
});

QUnit.test('for block - only value part in dummy variable', function(assert) {
  this.source =
    '{ for $item in $items }' +
    '<p>{ $item | h }</p>' +
    '{ /for }';
  this.parse();

  var block  = this.result[0];

  assert.strictEqual(block.type, 'for');
  assert.strictEqual(block.header.array.join('.'), 'items');
  assert.strictEqual(typeof block.header.k, 'undefined');
  assert.strictEqual(block.header.v, 'item');
  assert.strictEqual(block.blocks.length, 3);
});

QUnit.test('for block - use index in dummy variable', function(assert) {
  this.source =
    '{ for $idx, $item in $items }' +
    '<p>{ $item | h }</p>' +
    '{ /for }';
  this.parse();

  var block  = this.result[0];

  assert.strictEqual(block.header.k, 'idx');
  assert.strictEqual(block.header.v, 'item');
});
