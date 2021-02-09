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

QUnit.test('normal block - error - 1', function(assert) {
  this.source = '<div>{left} is ok, only { is forbidden.</div>';

  assert.throws(function() {
    this.parse();
  }, Error);
});

QUnit.test('normal block - error - 2', function(assert) {
  this.source = '<div> } is forbidden.</div>';

  assert.throws(function() {
    this.parse();
  }, Error);
});
