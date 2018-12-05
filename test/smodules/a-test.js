QUnit.module("smodules.a.test");

QUnit.test("indexOf", function(assert) {
    var array = ["a", "b", "a", "c"];

    assert.strictEqual(0,  smodules.a.indexOf(array, "a"));
    assert.strictEqual(0,  smodules.a.indexOf(array, "a", 0));
    assert.strictEqual(0,  smodules.a.indexOf(array, "a", -5));
    assert.strictEqual(0,  smodules.a.indexOf(array, "a", -4));
    assert.strictEqual(2,  smodules.a.indexOf(array, "a", 1));
    assert.strictEqual(2,  smodules.a.indexOf(array, "a", -2));
    assert.strictEqual(-1, smodules.a.indexOf(array, "a", 3));
    assert.strictEqual(-1, smodules.a.indexOf(array, "a", -1));
    assert.strictEqual(-1, smodules.a.indexOf(array, "z"));
});

QUnit.test("lastIndexOf", function(assert) {
    var array = ["a", "b", "a", "c"];

    assert.strictEqual(2,  smodules.a.lastIndexOf(array, "a"));
    assert.strictEqual(0,  smodules.a.lastIndexOf(array, "a", 0));
    assert.strictEqual(-1, smodules.a.lastIndexOf(array, "a", -5));
    assert.strictEqual(0,  smodules.a.lastIndexOf(array, "a", -4));
    assert.strictEqual(0,  smodules.a.lastIndexOf(array, "a", 1));
    assert.strictEqual(2,  smodules.a.lastIndexOf(array, "a", -2));
    assert.strictEqual(2,  smodules.a.lastIndexOf(array, "a", 3));
    assert.strictEqual(2,  smodules.a.lastIndexOf(array, "a", -1));
    assert.strictEqual(-1, smodules.a.lastIndexOf(array, "z"));
});

QUnit.test("forEach", function(assert) {
    var array = ["a", "b", "a", "c"], result;

    result = "";
    smodules.a.forEach(array, function(element, idx) {
        result += "[" + idx + ":" + element + "]";
    });
    assert.strictEqual("[0:a][1:b][2:a][3:c]", result);
});

QUnit.test("filter", function(assert) {
    var array = ["a", "b", "a", "c"], result;

    result = smodules.a.filter(array, function(element) {
        return element === "a";
    });
    assert.strictEqual(2, result.length);
    assert.strictEqual("a", result[0]);
    assert.strictEqual("a", result[1]);

    result = smodules.a.filter(array, function(element, idx) {
        return idx % 2;
    });
    assert.strictEqual(2, result.length);
    assert.strictEqual("b", result[0]);
    assert.strictEqual("c", result[1]);
});

QUnit.test("every", function(assert) {
    var array = ["a", "b", "a", "c"], result;

    result = smodules.a.every(array, function(element) {
        return (/^\w+$/).test(element);
    });
    assert.strictEqual(true, result);

    result = smodules.a.every(array, function(element) {
        return element === "a";
    });
    assert.strictEqual(false, result);
});

QUnit.test("some", function(assert) {
    var array = ["a", "b", "a", "c"], result;

    result = smodules.a.some(array, function(element) {
        return typeof element === "string";
    });
    assert.strictEqual(true, result);

    result = smodules.a.some(array, function(element) {
        return typeof element === "number";
    });
    assert.strictEqual(false, result);
});

QUnit.test("map", function(assert) {
    var array = ["a", "b", "a", "c"], result;

    result = smodules.a.map(array, function(element) {
        return element.toUpperCase();
    });
    assert.strictEqual(4, result.length);
    assert.strictEqual("A", result[0]);
    assert.strictEqual("B", result[1]);
    assert.strictEqual("A", result[2]);
    assert.strictEqual("C", result[3]);
});

QUnit.test("reduce - with initial value", function(assert) {
    var array = ["a", "b", "a", "c"], result;

    result = smodules.a.reduce(array, function(memo, current, idx) {
        return memo + "[" + idx + ":" + current + "]";
    }, "");
    assert.strictEqual("[0:a][1:b][2:a][3:c]", result);

    result = smodules.a.reduce([], function(memo, current) {
        return memno + "[" + memo + "]";
    }, "");
    assert.strictEqual("", result);

    result = smodules.a.reduce(array, function(memo, current) {
        memo[current] = memo.hasOwnProperty(current) ? (memo[current] + 1) : 1;
        return memo;
    }, {});
    assert.strictEqual(2, result.a);
    assert.strictEqual(1, result.b);
    assert.strictEqual(1, result.c);
});

QUnit.test("reduce - without initial value", function(assert) {
    var array = ["a", "b", "a", "c"], result;

    result = smodules.a.reduce(array, function(memo, current, idx) {
        return memo + "[" + idx + ":" + current + "]";
    });
    assert.strictEqual("a[1:b][2:a][3:c]", result);

    assert.raises(function() {
        result = smodules.a.reduce([], function(memo, current) {
            return memno + "[" + memo + "]";
        });
    }, TypeError);
});

QUnit.test("reduceRight - with initial value", function(assert) {
    var array = ["a", "b", "a", "c"], result;

    result = smodules.a.reduceRight(array, function(memo, current, idx) {
        return memo + "[" + idx + ":" + current + "]";
    }, "");
    assert.strictEqual("[3:c][2:a][1:b][0:a]", result);

    result = smodules.a.reduceRight([], function(memo, current) {
        return memno + "[" + memo + "]";
    }, "");
    assert.strictEqual("", result);

    result = smodules.a.reduceRight(array, function(memo, current) {
        memo[current] = memo.hasOwnProperty(current) ? (memo[current] + 1) : 1;
        return memo;
    }, {});
    assert.strictEqual(2, result.a);
    assert.strictEqual(1, result.b);
    assert.strictEqual(1, result.c);
});

QUnit.test("reduceRight - without initial value", function(assert) {
    var array = ["a", "b", "a", "c"], result;

    result = smodules.a.reduceRight(array, function(memo, current, idx) {
        return memo + "[" + idx + ":" + current + "]";
    });
    assert.strictEqual("c[2:a][1:b][0:a]", result);

    assert.raises(function() {
        result = smodules.a.reduceRight([], function(memo, current) {
            return memno + "[" + memo + "]";
        });
    }, TypeError);
});
