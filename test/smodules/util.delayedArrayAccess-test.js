module("smodules.util.delayedArrayAccess");

asyncTest("single unit:1", function() {
    var output = [];

    smodules.util.delayedArrayAccess({
        array:    ["a", "b", "c"],
        unit:     1,
        interval: 0,
        callback: function(elements) {
            output.push(elements.join("."));
        }
    }).start();

    window.setTimeout(function() {
        strictEqual(3, output.length);
        strictEqual("a", output[0]);
        strictEqual("b", output[1]);
        strictEqual("c", output[2]);
        start();
    }, 100);
});

asyncTest("single unit:2", function() {
    var output = [];

    smodules.util.delayedArrayAccess({
        array:    ["a", "b", "c"],
        unit:     2,
        interval: 0,
        callback: function(elements) {
            output.push(elements.join("."));
        }
    }).start();

    window.setTimeout(function() {
        strictEqual(2, output.length);
        strictEqual("a.b", output[0]);
        strictEqual("c",   output[1]);
        start();
    }, 100);
});

asyncTest("multiple", function() {
    var output1 = [], output2 = [];

    smodules.util.delayedArrayAccess({
        array:    ["a", "b", "c", "d", "e", "f", "g", "h"],
        unit:     2,
        interval: 10,
        callback: function(elements) {
            output1.push(elements.join("."));
        }
    }).start();

    smodules.util.delayedArrayAccess({
        array:    ["A", "B", "C", "D", "E", "F", "G", "H"],
        unit:     2,
        interval: 0,
        callback: function(elements) {
            output2.push(elements.join("."));
        }
    }).start();

    window.setTimeout(function() {
        strictEqual(4, output1.length);
        strictEqual("a.b", output1[0]);
        strictEqual("c.d", output1[1]);
        strictEqual("e.f", output1[2]);
        strictEqual("g.h", output1[3]);

        strictEqual(4, output2.length);
        strictEqual("A.B", output2[0]);
        strictEqual("C.D", output2[1]);
        strictEqual("E.F", output2[2]);
        strictEqual("G.H", output2[3]);

        start();
    }, 100);
});

