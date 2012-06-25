module("smodules.a.test");

test("indexOf", function() {
    var array = ["a", "b", "a", "c"];

    strictEqual(0,  smodules.a.indexOf(array, "a"));
    strictEqual(0,  smodules.a.indexOf(array, "a", 0));
    strictEqual(0,  smodules.a.indexOf(array, "a", -5));
    strictEqual(0,  smodules.a.indexOf(array, "a", -4));
    strictEqual(2,  smodules.a.indexOf(array, "a", 1));
    strictEqual(2,  smodules.a.indexOf(array, "a", -2));
    strictEqual(-1, smodules.a.indexOf(array, "a", 3));
    strictEqual(-1, smodules.a.indexOf(array, "a", -1));
    strictEqual(-1, smodules.a.indexOf(array, "z"));
    start();
});

test("lastIndexOf", function() {
    var array = ["a", "b", "a", "c"];

    strictEqual(2,  smodules.a.lastIndexOf(array, "a"));
    strictEqual(0,  smodules.a.lastIndexOf(array, "a", 0));
    strictEqual(-1, smodules.a.lastIndexOf(array, "a", -5));
    strictEqual(0,  smodules.a.lastIndexOf(array, "a", -4));
    strictEqual(0,  smodules.a.lastIndexOf(array, "a", 1));
    strictEqual(2,  smodules.a.lastIndexOf(array, "a", -2));
    strictEqual(2,  smodules.a.lastIndexOf(array, "a", 3));
    strictEqual(2,  smodules.a.lastIndexOf(array, "a", -1));
    strictEqual(-1, smodules.a.lastIndexOf(array, "z"));
    start();
});

test("forEach", function() {
    var array = ["a", "b", "a", "c"], result;

    result = "";
    smodules.a.forEach(array, function(element, idx) {
        result += "[" + idx + ":" + element + "]";
    });
    strictEqual("[0:a][1:b][2:a][3:c]", result);

    start();
});

test("filter", function() {
    var array = ["a", "b", "a", "c"], result;

    result = smodules.a.filter(array, function(element) {
        return element === "a";
    });
    strictEqual(2, result.length);
    strictEqual("a", result[0]);
    strictEqual("a", result[1]);

    result = smodules.a.filter(array, function(element, idx) {
        return idx % 2;
    });
    strictEqual(2, result.length);
    strictEqual("b", result[0]);
    strictEqual("c", result[1]);

    start();
});

test("every", function() {
    var array = ["a", "b", "a", "c"], result;

    result = smodules.a.every(array, function(element) {
        return (/^\w+$/).test(element);
    });
    strictEqual(true, result);

    result = smodules.a.every(array, function(element) {
        return element === "a";
    });
    strictEqual(false, result);

    start();
});

test("some", function() {
    var array = ["a", "b", "a", "c"], result;

    result = smodules.a.some(array, function(element) {
        return typeof element === "string";
    });
    strictEqual(true, result);

    result = smodules.a.some(array, function(element) {
        return typeof element === "number";
    });
    strictEqual(false, result);

    start();
});

test("map", function() {
    var array = ["a", "b", "a", "c"], result;

    result = smodules.a.map(array, function(element) {
        return element.toUpperCase();
    });
    strictEqual(4, result.length);
    strictEqual("A", result[0]);
    strictEqual("B", result[1]);
    strictEqual("A", result[2]);
    strictEqual("C", result[3]);
    start();
});

test("reduce - with initial value", function() {
    var array = ["a", "b", "a", "c"], result;

    result = smodules.a.reduce(array, function(memo, current, idx) {
        return memo + "[" + idx + ":" + current + "]";
    }, "");
    strictEqual("[0:a][1:b][2:a][3:c]", result);

    result = smodules.a.reduce([], function(memo, current) {
        return memno + "[" + memo + "]";
    }, "");
    strictEqual("", result);

    result = smodules.a.reduce(array, function(memo, current) {
        memo[current] = memo.hasOwnProperty(current) ? (memo[current] + 1) : 1;
        return memo;
    }, {});
    strictEqual(2, result.a);
    strictEqual(1, result.b);
    strictEqual(1, result.c);

    start();
});

test("reduce - without initial value", function() {
    var array = ["a", "b", "a", "c"], result;

    result = smodules.a.reduce(array, function(memo, current, idx) {
        return memo + "[" + idx + ":" + current + "]";
    });
    strictEqual("a[1:b][2:a][3:c]", result);

    raises(function() {
        result = smodules.a.reduce([], function(memo, current) {
            return memno + "[" + memo + "]";
        });
    }, TypeError);

    start();
});

test("reduceRight - with initial value", function() {
    var array = ["a", "b", "a", "c"], result;

    result = smodules.a.reduceRight(array, function(memo, current, idx) {
        return memo + "[" + idx + ":" + current + "]";
    }, "");
    strictEqual("[3:c][2:a][1:b][0:a]", result);

    result = smodules.a.reduceRight([], function(memo, current) {
        return memno + "[" + memo + "]";
    }, "");
    strictEqual("", result);

    result = smodules.a.reduceRight(array, function(memo, current) {
        memo[current] = memo.hasOwnProperty(current) ? (memo[current] + 1) : 1;
        return memo;
    }, {});
    strictEqual(2, result.a);
    strictEqual(1, result.b);
    strictEqual(1, result.c);

    start();
});

test("reduceRight - without initial value", function() {
    var array = ["a", "b", "a", "c"], result;

    result = smodules.a.reduceRight(array, function(memo, current, idx) {
        return memo + "[" + idx + ":" + current + "]";
    });
    strictEqual("c[2:a][1:b][0:a]", result);

    raises(function() {
        result = smodules.a.reduceRight([], function(memo, current) {
            return memno + "[" + memo + "]";
        });
    }, TypeError);

    start();
});
