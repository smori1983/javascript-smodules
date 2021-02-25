const QUnit = require('qunit').QUnit;
const template = require('../../src/template');

QUnit.module('template');

QUnit.test('sample', function (assert) {
  const done = assert.async();

  const source = '/tpl/template.html';
  const param = {
    message: 'foo',
  };

  template.init().bind(source, param).get((output) => {
    assert.true(output.indexOf('<p>foo</p>') >= 0);
    done();
  });
});
