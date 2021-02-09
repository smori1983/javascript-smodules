const templateParser = require('../../src/smodules/templateParser');

QUnit.module('templateParser', {
  before: function() {
    this.parse = function() {
      this.result = this.parser.parse(this.source);
    };
  },
  beforeEach: function() {
    this.parser = templateParser.init();
    this.source = '';
    this.result = null;
  },
});

QUnit.test('if block - if elseif else', function(assert) {
  let section;

  this.source =
    '{ if $value1 }' +
    '<div>value1</div>' +
    '{ elseif $value2 }' +
    '<div>value2</div>' +
    '{ elseif $value3 }' +
    '<div>value3</div>' +
    '{ else }' +
    '<div>value4</div>' +
    '{ /if }';
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

  const stack = this.result[0].sections[0].header.stack;

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

  const stack = this.result[0].sections[0].header.stack;

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

  const stack = this.result[0].sections[0].header.stack;

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

  const stack = this.result[0].sections[0].header.stack;

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

  const stack = this.result[0].sections[0].header.stack;

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

QUnit.test('if block - and chain', function(assert) {
  this.source =
    '{ if $var1 and $var2 and $var3 }' +
    '<p>ok</p>' +
    '{ /if }';
  this.parse();

  const stack = this.result[0].sections[0].header.stack;

  assert.strictEqual(stack.length, 5);
  assert.strictEqual(stack[0].type, 'var');
  assert.strictEqual(stack[0].keys.join('.'), 'var1');
  assert.strictEqual(stack[1].type, 'var');
  assert.strictEqual(stack[1].keys.join('.'), 'var2');
  assert.strictEqual(stack[2].type, 'andor');
  assert.strictEqual(stack[2].expr, 'and');
  assert.strictEqual(stack[3].type, 'var');
  assert.strictEqual(stack[3].keys.join('.'), 'var3');
  assert.strictEqual(stack[4].type, 'andor');
  assert.strictEqual(stack[4].expr, 'and');
});

QUnit.test('if block - or chain', function(assert) {
  this.source =
    '{ if $var1 or $var2 or $var3 }' +
    '<p>ok</p>' +
    '{ /if }';
  this.parse();

  const stack = this.result[0].sections[0].header.stack;

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
  assert.strictEqual(stack[4].expr, 'or');
});
