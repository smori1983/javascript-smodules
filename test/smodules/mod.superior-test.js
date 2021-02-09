const superior = require('../../src/smodules/mod.superior');

QUnit.module('mod.superior');

QUnit.test('simple test', function(assert) {
  const base = function () {
    const that = {};

    that.say = function () {
      return 'base';
    };

    return that;
  };

  const sub = function () {
    const that = base();
    const parent = {
      say: superior.init(that, 'say'),
    };

    that.say = function () {
      return parent.say() + ' sub';
    };

    return that;
  };

  const s = sub();

  assert.strictEqual(s.say(), 'base sub');
});
