const template = require('../../src/smodules/template');

QUnit.module('template', {
  beforeEach: function () {
    this.template = template.init();
  },
});

//QUnit.test('bind - get - embedded source - with callback', function(assert) {
//  var params = { value: 'hoge' };
//
//  this.src = '#template-test-source',
//  this.template.bind(this.src, params).get(function(output) {
//    assert.strictEqual(output, '<p>hoge</p>');
//  });
//});

//QUnit.test('bind - get - embedded source - without callback', function(assert) {
//  var params = { value: 'hoge' };
//
//  this.src = '#template-test-source',
//
//  assert.strictEqual(this.template.bind(this.src, params).get(), '<p>hoge</p>');
//});

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
