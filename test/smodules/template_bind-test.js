QUnit.module('template', {
  before: function() {
    this.execBind = function(param) {
      this.template.bind(this.src, param).appendTo(this.target);
    };
    this.getHtml = function() {
      return $(this.target).html();
    };
  },
  beforeEach: function() {
    this.template = smodules.template();
    this.target = '#template-test';
    this.src = '';

    $(this.target).empty();
  },
});

QUnit.test('bind - get - embedded source - with callback', function(assert) {
  var params = { value: 'hoge' };

  this.src = '#template-test-source',
  this.template.bind(this.src, params).get(function(output) {
    assert.strictEqual(output, '<p>hoge</p>');
  });
});

QUnit.test('bind - get - embedded source - without callback', function(assert) {
  var params = { value: 'hoge' };

  this.src = '#template-test-source',

  assert.strictEqual(this.template.bind(this.src, params).get(), '<p>hoge</p>');
});

QUnit.test('bind - get - string source - with callback', function(assert) {
  var params = { value: 'hoge' };

  this.src = '<p>{$value}</p>',
  this.template.bind(this.src, params).get(function(output) {
    assert.strictEqual(output, '<p>hoge</p>');
  });
});

QUnit.test('bind - get - string source - without callback', function(assert) {
  var params = { value: 'hoge' };

  this.src = '<p>{$value}</p>',

  assert.strictEqual(this.template.bind(this.src, params).get(), '<p>hoge</p>');
});
