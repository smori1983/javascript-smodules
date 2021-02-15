const templateParser = require('../src/templateParser');

QUnit.module('templateParser', {
  beforeEach: function () {
    this.parser = templateParser.init();
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

QUnit.test('normal block - literal tag', function (assert) {
  const src = '<div>{left}Hello, world!{right}</div>';
  const result = this.parser.parse(src);

  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].type, 'normal');
  assert.strictEqual(result[0].value, '<div>{Hello, world!}</div>');
});
