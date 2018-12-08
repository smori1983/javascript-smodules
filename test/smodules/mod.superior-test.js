QUnit.module("smodules.mod.superior");

QUnit.test("simple test", function(assert) {
    var base = function() {
        var that = {};

        that.say = function() {
            return "base";
        };

        return that;
    };

    var sub = function() {
        var that = base(),
            parent = {
                say: smodules.mod.superior(that, "say"),
            };

        that.say = function() {
            return parent.say() + " sub";
        };

        return that;
    };

    var s = sub();

    assert.strictEqual("base sub", s.say());
});
