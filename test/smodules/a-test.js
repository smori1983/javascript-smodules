QUnit.module('smodules.a.test');

QUnit.test('indexOf', function(assert) {
    var array = ['a', 'b', 'a', 'c'];

    assert.strictEqual(smodules.a.indexOf(array, 'a'), 0);
    assert.strictEqual(smodules.a.indexOf(array, 'a', 0), 0);
    assert.strictEqual(smodules.a.indexOf(array, 'a', -5), 0);
    assert.strictEqual(smodules.a.indexOf(array, 'a', -4), 0);
    assert.strictEqual(smodules.a.indexOf(array, 'a', 1), 2);
    assert.strictEqual(smodules.a.indexOf(array, 'a', -2), 2);
    assert.strictEqual(smodules.a.indexOf(array, 'a', 3), -1);
    assert.strictEqual(smodules.a.indexOf(array, 'a', -1), -1);
    assert.strictEqual(smodules.a.indexOf(array, 'z'), -1);
});

QUnit.test('lastIndexOf', function(assert) {
    var array = ['a', 'b', 'a', 'c'];

    assert.strictEqual(smodules.a.lastIndexOf(array, 'a'), 2);
    assert.strictEqual(smodules.a.lastIndexOf(array, 'a', 0), 0);
    assert.strictEqual(smodules.a.lastIndexOf(array, 'a', -5), -1);
    assert.strictEqual(smodules.a.lastIndexOf(array, 'a', -4), 0);
    assert.strictEqual(smodules.a.lastIndexOf(array, 'a', 1), 0);
    assert.strictEqual(smodules.a.lastIndexOf(array, 'a', -2), 2);
    assert.strictEqual(smodules.a.lastIndexOf(array, 'a', 3), 2);
    assert.strictEqual(smodules.a.lastIndexOf(array, 'a', -1), 2);
    assert.strictEqual(smodules.a.lastIndexOf(array, 'z'), -1);
});

QUnit.test('forEach', function(assert) {
    var array = ['a', 'b', 'a', 'c'], result;

    result = '';
    smodules.a.forEach(array, function(element, idx) {
        result += '[' + idx + ':' + element + ']';
    });
    assert.strictEqual(result, '[0:a][1:b][2:a][3:c]');
});

QUnit.test('filter', function(assert) {
    var array = ['a', 'b', 'a', 'c'], result;

    result = smodules.a.filter(array, function(element) {
        return element === 'a';
    });
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0], 'a');
    assert.strictEqual(result[1], 'a');

    result = smodules.a.filter(array, function(element, idx) {
        return idx % 2;
    });
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0], 'b');
    assert.strictEqual(result[1], 'c');
});

QUnit.test('every', function(assert) {
    var array = ['a', 'b', 'a', 'c'], result;

    result = smodules.a.every(array, function(element) {
        return (/^\w+$/).test(element);
    });
    assert.strictEqual(result, true);

    result = smodules.a.every(array, function(element) {
        return element === 'a';
    });
    assert.strictEqual(result, false);
});

QUnit.test('some', function(assert) {
    var array = ['a', 'b', 'a', 'c'], result;

    result = smodules.a.some(array, function(element) {
        return typeof element === 'string';
    });
    assert.strictEqual(result, true);

    result = smodules.a.some(array, function(element) {
        return typeof element === 'number';
    });
    assert.strictEqual(result, false);
});

QUnit.test('map', function(assert) {
    var array = ['a', 'b', 'a', 'c'], result;

    result = smodules.a.map(array, function(element) {
        return element.toUpperCase();
    });
    assert.strictEqual(result.length, 4);
    assert.strictEqual(result[0], 'A');
    assert.strictEqual(result[1], 'B');
    assert.strictEqual(result[2], 'A');
    assert.strictEqual(result[3], 'C');
});

QUnit.test('reduce - with initial value', function(assert) {
    var array = ['a', 'b', 'a', 'c'], result;

    result = smodules.a.reduce(array, function(memo, current, idx) {
        return memo + '[' + idx + ':' + current + ']';
    }, '');
    assert.strictEqual(result, '[0:a][1:b][2:a][3:c]');

    result = smodules.a.reduce([], function(memo, current) {
        return memo + '[' + memo + ']';
    }, '');
    assert.strictEqual(result, '');

    result = smodules.a.reduce(array, function(memo, current) {
        memo[current] = memo.hasOwnProperty(current) ? (memo[current] + 1) : 1;
        return memo;
    }, {});
    assert.strictEqual(result.a, 2);
    assert.strictEqual(result.b, 1);
    assert.strictEqual(result.c, 1);
});

QUnit.test('reduce - without initial value', function(assert) {
    var array = ['a', 'b', 'a', 'c'], result;

    result = smodules.a.reduce(array, function(memo, current, idx) {
        return memo + '[' + idx + ':' + current + ']';
    });
    assert.strictEqual(result, 'a[1:b][2:a][3:c]');

    assert.raises(function() {
        result = smodules.a.reduce([], function(memo, current) {
            return memo + '[' + memo + ']';
        });
    }, TypeError);
});

QUnit.test('reduceRight - with initial value', function(assert) {
    var array = ['a', 'b', 'a', 'c'], result;

    result = smodules.a.reduceRight(array, function(memo, current, idx) {
        return memo + '[' + idx + ':' + current + ']';
    }, '');
    assert.strictEqual(result, '[3:c][2:a][1:b][0:a]');

    result = smodules.a.reduceRight([], function(memo, current) {
        return memo + '[' + memo + ']';
    }, '');
    assert.strictEqual(result, '');

    result = smodules.a.reduceRight(array, function(memo, current) {
        memo[current] = memo.hasOwnProperty(current) ? (memo[current] + 1) : 1;
        return memo;
    }, {});
    assert.strictEqual(result.a, 2);
    assert.strictEqual(result.b, 1);
    assert.strictEqual(result.c, 1);
});

QUnit.test('reduceRight - without initial value', function(assert) {
    var array = ['a', 'b', 'a', 'c'], result;

    result = smodules.a.reduceRight(array, function(memo, current, idx) {
        return memo + '[' + idx + ':' + current + ']';
    });
    assert.strictEqual('c[2:a][1:b][0:a]', result);

    assert.raises(function() {
        result = smodules.a.reduceRight([], function(memo, current) {
            return memo + '[' + memo + ']';
        });
    }, TypeError);
});
