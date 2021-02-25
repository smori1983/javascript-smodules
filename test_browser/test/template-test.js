const QUnit = require('qunit').QUnit;
const template = require('../../src/template');

QUnit.module('template', {
  beforeEach: function () {
    this.template = template.init();
  },
});

QUnit.test('sample', function (assert) {
  const done = assert.async();

  const source = '/tpl/template.html';
  const param = {
    message: 'foo',
  };

  this.template.bind(source, param).get((output) => {
    assert.true(output.indexOf('<p>foo</p>') >= 0);
    done();
  });
});

QUnit.test('prefetch - callback invoked once after all templates fetched', function (assert) {
  const done = assert.async();

  const sources = [
    '/tpl/prefetch_01_a.html',
    '/tpl/prefetch_01_b.html',
    '/tpl/prefetch_01_c.html',
  ];

  let callCount = 0;

  this.template.prefetch(
    sources,
    () => {
      assert.strictEqual(callCount, 3);
      done();
    },
    () => {
      callCount += 1;
    }
  );
});
