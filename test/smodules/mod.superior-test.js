module("smodules.mod.superior");

test("simple test", function() {
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
                say: smodules.mod.superior(that, "say")
            };

        that.say = function() {
            return parent.say() + " sub";
        };

        return that;
    };

    var s = sub();

    strictEqual("base sub", s.say());
    start();
});
