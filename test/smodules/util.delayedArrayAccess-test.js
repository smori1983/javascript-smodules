QUnit.module("smodules.util.delayedArrayAccess");

QUnit.test("single unit:1", function(assert) {
    var done = assert.async();

    var output = [];

    smodules.util.delayedArrayAccess({
        array:    ["a", "b", "c"],
        unit:     1,
        interval: 0,
        callback: function(elements) {
            output.push(elements.join("."));
        },
    }).start();

    window.setTimeout(function() {
        assert.strictEqual(3, output.length);
        assert.strictEqual("a", output[0]);
        assert.strictEqual("b", output[1]);
        assert.strictEqual("c", output[2]);

        done();
    }, 150);
});

QUnit.test("single unit:2", function(assert) {
    var done = assert.async();

    var output = [];

    smodules.util.delayedArrayAccess({
        array:    ["a", "b", "c"],
        unit:     2,
        interval: 0,
        callback: function(elements) {
            output.push(elements.join("."));
        },
    }).start();

    window.setTimeout(function() {
        assert.strictEqual(2, output.length);
        assert.strictEqual("a.b", output[0]);
        assert.strictEqual("c",   output[1]);

        done();
    }, 150);
});

QUnit.test("multiple", function(assert) {
    var done = assert.async();

    var output1 = [], output2 = [];

    smodules.util.delayedArrayAccess({
        array:    ["a", "b", "c", "d", "e", "f", "g", "h"],
        unit:     2,
        interval: 10,
        callback: function(elements) {
            output1.push(elements.join("."));
        },
    }).start();

    smodules.util.delayedArrayAccess({
        array:    ["A", "B", "C", "D", "E", "F", "G", "H"],
        unit:     2,
        interval: 0,
        callback: function(elements) {
            output2.push(elements.join("."));
        },
    }).start();

    window.setTimeout(function() {
        assert.strictEqual(4, output1.length);
        assert.strictEqual("a.b", output1[0]);
        assert.strictEqual("c.d", output1[1]);
        assert.strictEqual("e.f", output1[2]);
        assert.strictEqual("g.h", output1[3]);

        assert.strictEqual(4, output2.length);
        assert.strictEqual("A.B", output2[0]);
        assert.strictEqual("C.D", output2[1]);
        assert.strictEqual("E.F", output2[2]);
        assert.strictEqual("G.H", output2[3]);

        done();
    }, 150);
});
