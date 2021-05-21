const describe = require('mocha').describe;
const it = require('mocha').it;
const assert = require('assert');
const contextBuilder = require('../../test_lib/parse-context-builder');

describe('ast-node', () => {
  describe('value - bool', () => {
    describe('read - error', () => {
      it('empty string', () => {
        const context = contextBuilder.build('');
        assert.deepStrictEqual(context.read('value_bool'), false);
      });

      it('uppercase', () => {
        const context = contextBuilder.build('TRUE');
        assert.deepStrictEqual(context.read('value_bool'), false);
      });
    });

    describe('read - ok', () => {
      it('space', () => {
        const context = contextBuilder.build(' true ');
        assert.deepStrictEqual(context.read('value_bool'), true);
      });

      it('operator no space - 1', () => {
        const context = contextBuilder.build('true===true');
        assert.deepStrictEqual(context.read('value_bool'), true);
      });

      it('operator no space - 2', () => {
        const context = contextBuilder.build('true!==true');
        assert.deepStrictEqual(context.read('value_bool'), true);
      });
    });
  });

  describe('value - null', () => {
    describe('read - error', () => {
      it('empty string', () => {
        const context = contextBuilder.build('');
        assert.deepStrictEqual(context.read('value_null'), false);
      });

      it('uppercase', () => {
        const context = contextBuilder.build('NULL');
        assert.deepStrictEqual(context.read('value_null'), false);
      });
    });

    describe('read - ok', () => {
      it('space', () => {
        const context = contextBuilder.build(' null ');
        assert.deepStrictEqual(context.read('value_null'), true);
      });

      it('operator no space - 1', () => {
        const context = contextBuilder.build('null===true');
        assert.deepStrictEqual(context.read('value_null'), true);
      });

      it('operator no space - 2', () => {
        const context = contextBuilder.build('null!==true');
        assert.deepStrictEqual(context.read('value_null'), true);
      });
    });
  });
});
