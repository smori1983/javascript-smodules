const describe = require('mocha').describe;
const it = require('mocha').it;
const assert = require('assert');
const Parser = require('../src/parser');

/**
 * @param {string} text
 * @return {AstNodeParseResult[]}
 */
const parse = (text) => {
  const parser = new Parser();

  return parser.parse(text);
};

describe('Parser - if', () => {
  it('compare - null', () => {
    const text =
      '{ if $foo === null }' +
      '<p>foo</p>' +
      '{ endif }';
    const result = parse(text);

    const stack = result[0].children[0].ctrl.stack;

    assert.strictEqual(stack.length, 3);
    assert.strictEqual(stack[0].type, 'var');
    assert.strictEqual(stack[0].keys.join('.'), 'foo');
    assert.strictEqual(stack[1].type, 'value');
    assert.strictEqual(stack[1].value, null);
    assert.strictEqual(stack[2].type, 'comp');
    assert.strictEqual(stack[2].expr, '===');
  });

  it('compare - bool', () => {
    const text =
      '{ if $foo === true }' +
      '<p>foo</p>' +
      '{ endif }';
    const result = parse(text);

    const stack = result[0].children[0].ctrl.stack;

    assert.strictEqual(stack.length, 3);
    assert.strictEqual(stack[0].type, 'var');
    assert.strictEqual(stack[0].keys.join('.'), 'foo');
    assert.strictEqual(stack[1].type, 'value');
    assert.strictEqual(stack[1].value, true);
    assert.strictEqual(stack[2].type, 'comp');
    assert.strictEqual(stack[2].expr, '===');
  });

  it('compare - string', () => {
    const text =
      '{ if $foo === "foo" }' +
      '<p>foo</p>' +
      '{ endif }';
    const result = parse(text);

    const stack = result[0].children[0].ctrl.stack;

    assert.strictEqual(stack.length, 3);
    assert.strictEqual(stack[0].type, 'var');
    assert.strictEqual(stack[0].keys.join('.'), 'foo');
    assert.strictEqual(stack[1].type, 'value');
    assert.strictEqual(stack[1].value, 'foo');
    assert.strictEqual(stack[2].type, 'comp');
    assert.strictEqual(stack[2].expr, '===');
  });

  it('compare - number', () => {
    const text =
      '{ if $foo === 1.23 }' +
      '<p>foo</p>' +
      '{ endif }';
    const result = parse(text);

    const stack = result[0].children[0].ctrl.stack;

    assert.strictEqual(stack.length, 3);
    assert.strictEqual(stack[0].type, 'var');
    assert.strictEqual(stack[0].keys.join('.'), 'foo');
    assert.strictEqual(stack[1].type, 'value');
    assert.strictEqual(stack[1].value, 1.23);
    assert.strictEqual(stack[2].type, 'comp');
    assert.strictEqual(stack[2].expr, '===');
  });

  it('if elseif else', () => {
    let section;

    const text =
      '{ if $value1 }' +
      '<div>value1</div>' +
      '{ elseif $value2 }' +
      '<div>value2</div>' +
      '{ elseif $value3 }' +
      '<div>value3</div>' +
      '{ else }' +
      '<div>value4</div>' +
      '{ endif }';
    const result = parse(text);

    assert.strictEqual(result[0].type, 'condition');
    assert.strictEqual(result[0].children.length, 4);

    section = result[0].children[0];
    assert.strictEqual(section.type, 'if');
    assert.strictEqual(section.children.length, 1);
    assert.strictEqual(section.children[0].type, 'normal');
    assert.strictEqual(section.children[0].value, '<div>value1</div>');

    section = result[0].children[1];
    assert.strictEqual(section.type, 'elseif');
    assert.strictEqual(section.children.length, 1);
    assert.strictEqual(section.children[0].type, 'normal');
    assert.strictEqual(section.children[0].value, '<div>value2</div>');

    section = result[0].children[2];
    assert.strictEqual(section.type, 'elseif');
    assert.strictEqual(section.children.length, 1);
    assert.strictEqual(section.children[0].type, 'normal');
    assert.strictEqual(section.children[0].value, '<div>value3</div>');

    section = result[0].children[3];
    assert.strictEqual(section.type, 'else');
    assert.strictEqual(section.children.length, 1);
    assert.strictEqual(section.children[0].type, 'normal');
    assert.strictEqual(section.children[0].value, '<div>value4</div>');
  });

  it('condition - simple', () => {
    const text =
      '{ if $foo === "value1" }' +
      '<p>ok</p>' +
      '{ endif }';
    const result = parse(text);

    const stack = result[0].children[0].ctrl.stack;

    assert.strictEqual(stack.length, 3);
    assert.strictEqual(stack[0].type, 'var');
    assert.strictEqual(stack[0].keys.join('.'), 'foo');
    assert.strictEqual(stack[1].type, 'value');
    assert.strictEqual(stack[1].value, 'value1');
    assert.strictEqual(stack[2].type, 'comp');
    assert.strictEqual(stack[2].expr, '===');
  });

  it('condition - redundant round brackets', () => {
    const text =
      '{ if ( ( ( $foo === "1" ) ) ) }' +
      '<p>OK</p>' +
      '{ endif }';
    const result = parse(text);

    const stack = result[0].children[0].ctrl.stack;

    assert.strictEqual(stack.length, 3);
    assert.strictEqual(stack[0].type, 'var');
    assert.strictEqual(stack[0].keys.join('.'), 'foo');
    assert.strictEqual(stack[1].type, 'value');
    assert.strictEqual(stack[1].value, '1');
    assert.strictEqual(stack[2].type, 'comp');
    assert.strictEqual(stack[2].expr, '===');
  });

  it('condition - complicated', () => {
    const text =
      '{ if $val1 gt 10 and $val2 gte -1 or $val3 lt 1.0 and $val4 lte -1.0 }' +
      '<p>ok</p>' +
      '{ endif }';
    const result = parse(text);

    const stack = result[0].children[0].ctrl.stack;

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

  it('condition - inversion of lval and rval', () => {
    const text =
      '{ if 10 !== $price }' +
      '<p>ok</p>' +
      '{ endif }';
    const result = parse(text);

    const stack = result[0].children[0].ctrl.stack;

    assert.strictEqual(stack.length, 3);
    assert.strictEqual(stack[0].type, 'value');
    assert.strictEqual(stack[0].value, 10);
    assert.strictEqual(stack[1].type, 'var');
    assert.strictEqual(stack[1].keys.join('.'), 'price');
    assert.strictEqual(stack[2].type, 'comp');
    assert.strictEqual(stack[2].expr, '!==');
  });

  it('condition - priority of and/or', () => {
    const text =
      '{ if ( $var1 or $var2 ) and $var3 }' +
      '<p>ok</p>' +
      '{ endif }';
    const result = parse(text);

    const stack = result[0].children[0].ctrl.stack;

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

  it('and chain', () => {
    const text =
      '{ if $var1 and $var2 and $var3 }' +
      '<p>ok</p>' +
      '{ endif }';
    const result = parse(text);

    const stack = result[0].children[0].ctrl.stack;

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

  it('or chain', () => {
    const text =
      '{ if $var1 or $var2 or $var3 }' +
      '<p>ok</p>' +
      '{ endif }';
    const result = parse(text);

    const stack = result[0].children[0].ctrl.stack;

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
});
