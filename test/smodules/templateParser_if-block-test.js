const templateParser = require('../../src/smodules/templateParser');

QUnit.module('templateParser', {
  beforeEach: function () {
    this.parser = templateParser.init();
  },
});

QUnit.test('if block - if elseif else', function (assert) {
  let section;

  const src =
    '{ if $value1 }' +
    '<div>value1</div>' +
    '{ elseif $value2 }' +
    '<div>value2</div>' +
    '{ elseif $value3 }' +
    '<div>value3</div>' +
    '{ else }' +
    '<div>value4</div>' +
    '{ endif }';
  const result = this.parser.parse(src);

  assert.strictEqual(result[0].type, 'condition');
  assert.strictEqual(result[0].branches.length, 4);

  section = result[0].branches[0];
  assert.strictEqual(section.header.type, 'if');
  assert.strictEqual(section.children.length, 1);
  assert.strictEqual(section.children[0].type, 'normal');
  assert.strictEqual(section.children[0].value, '<div>value1</div>');

  section = result[0].branches[1];
  assert.strictEqual(section.header.type, 'elseif');
  assert.strictEqual(section.children.length, 1);
  assert.strictEqual(section.children[0].type, 'normal');
  assert.strictEqual(section.children[0].value, '<div>value2</div>');

  section = result[0].branches[2];
  assert.strictEqual(section.header.type, 'elseif');
  assert.strictEqual(section.children.length, 1);
  assert.strictEqual(section.children[0].type, 'normal');
  assert.strictEqual(section.children[0].value, '<div>value3</div>');

  section = result[0].branches[3];
  assert.strictEqual(section.header.type, 'else');
  assert.strictEqual(section.children.length, 1);
  assert.strictEqual(section.children[0].type, 'normal');
  assert.strictEqual(section.children[0].value, '<div>value4</div>');
});

QUnit.test('if block - condition - simple', function (assert) {
  const src =
    '{ if $foo === "hoge" }' +
    '<p>hoge</p>' +
    '{ endif }';
  const result = this.parser.parse(src);

  const stack = result[0].branches[0].header.ctrl.stack;

  assert.strictEqual(stack.length, 3);
  assert.strictEqual(stack[0].type, 'var');
  assert.strictEqual(stack[0].keys.join('.'), 'foo');
  assert.strictEqual(stack[1].type, 'value');
  assert.strictEqual(stack[1].value, 'hoge');
  assert.strictEqual(stack[2].type, 'comp');
  assert.strictEqual(stack[2].expr, '===');
});

QUnit.test('if block - condition - redundant round brackets', function (assert) {
  const src =
    '{ if ( ( ( $foo === "hoge" ) ) ) }' +
    '<p>hoge</p>' +
    '{ endif }';
  const result = this.parser.parse(src);

  const stack = result[0].branches[0].header.ctrl.stack;

  assert.strictEqual(stack.length, 3);
  assert.strictEqual(stack[0].type, 'var');
  assert.strictEqual(stack[0].keys.join('.'), 'foo');
  assert.strictEqual(stack[1].type, 'value');
  assert.strictEqual(stack[1].value, 'hoge');
  assert.strictEqual(stack[2].type, 'comp');
  assert.strictEqual(stack[2].expr, '===');
});

QUnit.test('if block - condition - complicated', function (assert) {
  const src =
    '{ if $val1 gt 10 and $val2 gte -1 or $val3 lt 1.0 and $val4 lte -1.0 }' +
    '<p>ok</p>' +
    '{ endif }';
  const result = this.parser.parse(src);

  const stack = result[0].branches[0].header.ctrl.stack;

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

QUnit.test('if block - condition - inversion of lval and rval', function (assert) {
  const src =
    '{ if 10 !== $price }' +
    '<p>ok</p>' +
    '{ endif }';
  const result = this.parser.parse(src);

  const stack = result[0].branches[0].header.ctrl.stack;

  assert.strictEqual(stack.length, 3);
  assert.strictEqual(stack[0].type, 'value');
  assert.strictEqual(stack[0].value, 10);
  assert.strictEqual(stack[1].type, 'var');
  assert.strictEqual(stack[1].keys.join('.'), 'price');
  assert.strictEqual(stack[2].type, 'comp');
  assert.strictEqual(stack[2].expr, '!==');
});

QUnit.test('if block - condition - priority of and/or', function (assert) {
  const src =
    '{ if ( $var1 or $var2 ) and $var3 }' +
    '<p>ok</p>' +
    '{ endif }';
  const result = this.parser.parse(src);

  const stack = result[0].branches[0].header.ctrl.stack;

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

QUnit.test('if block - and chain', function (assert) {
  const src =
    '{ if $var1 and $var2 and $var3 }' +
    '<p>ok</p>' +
    '{ endif }';
  const result = this.parser.parse(src);

  const stack = result[0].branches[0].header.ctrl.stack;

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

QUnit.test('if block - or chain', function (assert) {
  const src =
    '{ if $var1 or $var2 or $var3 }' +
    '<p>ok</p>' +
    '{ endif }';
  const result = this.parser.parse(src);

  const stack = result[0].branches[0].header.ctrl.stack;

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
