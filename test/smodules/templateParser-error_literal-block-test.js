const templateParser = require('../../src/smodules/templateParser');

QUnit.module('templateParser - error', {
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

QUnit.test('literal block - error - only open tag', function(assert) {
  this.source = '<div>{literal}</div>';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('literal block - error - only close tag', function(assert) {
  this.source = '<div>{/literal}</div>';

  assert.throws(function() {
    this.parse();
  }, Error);
});
