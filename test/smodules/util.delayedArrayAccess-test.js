QUnit.module('smodules.util.delayedArrayAccess');

QUnit.test('single unit:1', function(assert) {
  var done = assert.async();

  var output = [];

  smodules.util.delayedArrayAccess({
    array:    ['a', 'b', 'c'],
    unit:     1,
    interval: 0,
    callback: function(elements) {
      output.push(elements.join('.'));
    },
  }).start();

  window.setTimeout(function() {
    assert.strictEqual(output.length, 3);
    assert.strictEqual(output[0], 'a');
    assert.strictEqual(output[1], 'b');
    assert.strictEqual(output[2], 'c');

    done();
  }, 500);
});

QUnit.test('single unit:2', function(assert) {
  var done = assert.async();

  var output = [];

  smodules.util.delayedArrayAccess({
    array:    ['a', 'b', 'c'],
    unit:     2,
    interval: 0,
    callback: function(elements) {
      output.push(elements.join('.'));
    },
  }).start();

  window.setTimeout(function() {
    assert.strictEqual(output.length, 2);
    assert.strictEqual(output[0], 'a.b');
    assert.strictEqual(output[1], 'c');

    done();
  }, 200);
});

QUnit.test('multiple', function(assert) {
  var done = assert.async();

  var output1 = [], output2 = [];

  smodules.util.delayedArrayAccess({
    array:    ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
    unit:     2,
    interval: 10,
    callback: function(elements) {
      output1.push(elements.join('.'));
    },
  }).start();

  smodules.util.delayedArrayAccess({
    array:    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    unit:     2,
    interval: 0,
    callback: function(elements) {
      output2.push(elements.join('.'));
    },
  }).start();

  window.setTimeout(function() {
    assert.strictEqual(output1.length, 4);
    assert.strictEqual(output1[0], 'a.b');
    assert.strictEqual(output1[1], 'c.d');
    assert.strictEqual(output1[2], 'e.f');
    assert.strictEqual(output1[3], 'g.h');

    assert.strictEqual(output2.length, 4);
    assert.strictEqual(output2[0], 'A.B');
    assert.strictEqual(output2[1], 'C.D');
    assert.strictEqual(output2[2], 'E.F');
    assert.strictEqual(output2[3], 'G.H');

    done();
  }, 200);
});
