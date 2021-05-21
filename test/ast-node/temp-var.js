const describe = require('mocha').describe;
const it = require('mocha').it;
const assert = require('assert');
const contextBuilder = require('../../test_lib/parse-context-builder');

describe('ast-node', () => {
  describe('temp-var', () => {
    describe('read - error', () => {
      it('empty string', () => {
        const context = contextBuilder.build('');
        assert.deepStrictEqual(context.read('temp_var'), false);
      });

      it('$', () => {
        const context = contextBuilder.build('$');
        assert.deepStrictEqual(context.read('temp_var'), false);
      });

      it('$$', () => {
        const context = contextBuilder.build('$$');
        assert.deepStrictEqual(context.read('temp_var'), false);
      });

      it('$.', () => {
        const context = contextBuilder.build('$.');
        assert.deepStrictEqual(context.read('temp_var'), false);
      });

      it('$-', () => {
        const context = contextBuilder.build('$-');
        assert.deepStrictEqual(context.read('temp_var'), false);
      });
    });

    describe('read - ok', () => {
      it('$a', () => {
        const context = contextBuilder.build('$a');
        assert.deepStrictEqual(context.read('temp_var'), true);
      });

      it('$a=', () => {
        const context = contextBuilder.build('$a=');
        assert.deepStrictEqual(context.read('temp_var'), true);
      });

      it('$a!==$b', () => {
        const context = contextBuilder.build('$a!==$b');
        assert.deepStrictEqual(context.read('temp_var'), true);
      });
    });

    describe('parse - ok', () => {
      it('$a', () => {
        const context = contextBuilder.build('$a');
        const ast = context.parse('temp_var');
        const expected = {
          type: 'temp_var',
          expr: 'a',
        };
        assert.deepStrictEqual(ast, expected);
      });

      it('$a=', () => {
        const context = contextBuilder.build('$a=');
        const ast = context.parse('temp_var');
        const expected = {
          type: 'temp_var',
          expr: 'a',
        };
        assert.deepStrictEqual(ast, expected);
      });

      it('$a!==', () => {
        const context = contextBuilder.build('$a!==');
        const ast = context.parse('temp_var');
        const expected = {
          type: 'temp_var',
          expr: 'a',
        };
        assert.deepStrictEqual(ast, expected);
      });
    });
  });
});
