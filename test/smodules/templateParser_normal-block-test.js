QUnit.module('templateParser', {
  before: function() {
    this.parse = function() {
      this.result = this.parser.parse(this.source);
    };
  },
  beforeEach: function() {
    this.parser = smodules.templateParser();
    this.source = '';
    this.result = null;
  },
});

QUnit.test('normal block - plain text', function(assert) {
  this.source = 'Hello, world!';
  this.parse();

  assert.strictEqual(this.result.length, 1);
  assert.strictEqual(this.result[0].type, 'normal');
  assert.strictEqual(this.result[0].expr, 'Hello, world!');
});

QUnit.test('normal block - plain html', function(assert) {
  this.source =
    '<ul>' +
    '<li>one</li>' +
    '<li>two</li>' +
    '</ul>';
  this.parse();

  assert.strictEqual(this.result.length, 1);
  assert.strictEqual(this.result[0].type, 'normal');
  assert.strictEqual(this.result[0].expr, '<ul><li>one</li><li>two</li></ul>');
});

QUnit.test('normal block - plain html broken', function(assert) {
  this.source =
    '<ul>' +
    '<li>one' +
    '<li>two' +
    '</div>';
  this.parse();

  assert.strictEqual(this.result.length, 1);
  assert.strictEqual(this.result[0].type, 'normal');
  assert.strictEqual(this.result[0].expr, '<ul><li>one<li>two</div>');
});

QUnit.test('normal block - literal tag', function(assert) {
  this.source = '<div>{left}Hello, world!{right}</div>';
  this.parse();

  assert.strictEqual(this.result.length, 1);
  assert.strictEqual(this.result[0].type, 'normal');
  assert.strictEqual(this.result[0].expr, '<div>{Hello, world!}</div>');
});
