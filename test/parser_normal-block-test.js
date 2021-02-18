const parser = require('../src/parser');

QUnit.module('parser', {
  beforeEach: function () {
    this.parser = parser.init();
  },
});

QUnit.test('normal block - plain text', function (assert) {
  const src = 'Hello, world!';
  const result = this.parser.parse(src);

  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].type, 'normal');
  assert.strictEqual(result[0].value, 'Hello, world!');
});

QUnit.test('normal block - plain html', function (assert) {
  const src =
    '<ul>' +
    '<li>one</li>' +
    '<li>two</li>' +
    '</ul>';
  const result = this.parser.parse(src);

  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].type, 'normal');
  assert.strictEqual(result[0].value, '<ul><li>one</li><li>two</li></ul>');
});

QUnit.test('normal block - plain html broken', function (assert) {
  const src =
    '<ul>' +
    '<li>one' +
    '<li>two' +
    '</div>';
  const result = this.parser.parse(src);

  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].type, 'normal');
  assert.strictEqual(result[0].value, '<ul><li>one<li>two</div>');
});

QUnit.test('normal block - delimiter tag', function (assert) {
  const src = '<div>{open}Hello, world!{close}</div>';
  const result = this.parser.parse(src);

  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].type, 'normal');
  assert.strictEqual(result[0].value, '<div>{Hello, world!}</div>');
});
