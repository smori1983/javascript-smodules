const superior = require('../../src/smodules/mod.superior');

QUnit.module('mod.superior');

QUnit.test('simple test', function(assert) {
  var base = function() {
    var that = {};

    that.say = function() {
      return 'base';
    };

    return that;
  };

  var sub = function() {
    var that = base();
    var parent = {
      say: superior.init(that, 'say'),
    };

    that.say = function() {
      return parent.say() + ' sub';
    };

    return that;
  };

  var s = sub();

  assert.strictEqual(s.say(), 'base sub');
});
