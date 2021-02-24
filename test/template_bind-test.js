const template = require('../src/template');

QUnit.module('template', {
  beforeEach: function () {
    this.template = template.init();
  },
});

QUnit.test('bind - get - string source - with callback', function (assert) {
  const src = '<p>{$value}</p>';
  const params = {value: 'hoge'};

  this.template.bind(src, params).get(function (output) {
    assert.strictEqual(output, '<p>hoge</p>');
  });
});

QUnit.test('bind - get - string source - without callback', function (assert) {
  const src = '<p>{$value}</p>';
  const params = {value: 'hoge'};

  assert.strictEqual(this.template.bind(src, params).get(), '<p>hoge</p>');
});
