const QUnit = require('qunit').QUnit;
const Template = require('../../src/template');

QUnit.module('template', {
  beforeEach: function () {
    this.template = new Template();
  },
});

QUnit.test('render - template string', function (assert) {
  const source = '<p>{$message | h}</p>';

  const rendered = this.template.render(source, {message: 'foo'});

  assert.strictEqual(rendered, '<p>foo</p>');
});

QUnit.test('renderAsync', function (assert) {
  const done = assert.async();

  const source = '/tpl/template.html';

  this.template.renderAsync(source, {message: 'foo'}, (output) => {
    assert.true(output.indexOf('<p>foo</p>') >= 0);
    done();
  });
});

QUnit.test('renderAsync - simultaneous multiple calls require the same source', function (assert) {
  const done1 = assert.async();
  const done2 = assert.async();

  const source = '/tpl/template.html';

  this.template.renderAsync(source, {message: 'foo'}, (output) => {
    assert.true(output.indexOf('<p>foo</p>') >= 0);
    done1();
  });

  this.template.renderAsync(source, {message: 'bar'}, (output) => {
    assert.true(output.indexOf('<p>bar</p>') >= 0);
    done2();
  });
});

QUnit.test('renderAsync - subsequent multiple calls require the same source', function (assert) {
  const done1 = assert.async();
  const done2 = assert.async();

  const source = '/tpl/template.html';

  this.template.renderAsync(source, {message: 'foo'}, (output) => {
    assert.true(output.indexOf('<p>foo</p>') >= 0);
    done1();

    this.template.renderAsync(source, {message: 'bar'}, (output) => {
      assert.true(output.indexOf('<p>bar</p>') >= 0);
      done2();
    });
  });
});

QUnit.test('prefetch - call render()', function (assert) {
  const done = assert.async();

  const source = '/tpl/template.html';

  this.template.prefetch(source, () => {
    const rendered = this.template.render(source, {message: 'foo'});

    assert.true(rendered.indexOf('<p>foo</p>') >= 0);
    done();
  });
});

QUnit.test('prefetch - callback invoked once after all templates fetched', function (assert) {
  const done = assert.async();

  const sources = [
    '/tpl/prefetch_01_a.html',
    '/tpl/prefetch_01_b.html',
    '/tpl/prefetch_01_c.html',
  ];

  let callCount = 0;

  this.template.prefetch(
    sources,
    () => {
      assert.strictEqual(callCount, 3);
      done();
    },
    () => {
      callCount += 1;
    }
  );
});

QUnit.test('prefetch - multiple sets', function (assert) {
  const done1 = assert.async();
  const done2 = assert.async();

  const sources1 = [
    '/tpl/prefetch_01_a.html',
    '/tpl/prefetch_01_b.html',
    '/tpl/prefetch_01_c.html',
  ];
  const sources2 = [
    '/tpl/prefetch_02_a.html',
    '/tpl/prefetch_02_b.html',
    '/tpl/prefetch_02_c.html',
  ];

  let callCount1 = 0;
  let callCount2 = 0;

  this.template.prefetch(
    sources1,
    () => {
      assert.strictEqual(callCount1, 3);
      done1();
    },
    () => {
      callCount1 += 1;
    }
  );

  this.template.prefetch(
    sources2,
    () => {
      assert.strictEqual(callCount2, 3);
      done2();
    },
    () => {
      callCount2 += 1;
    }
  );
});

QUnit.test('prefetch - multiple sets that fetch the same templates', function (assert) {
  const done1 = assert.async();
  const done2 = assert.async();

  const sources = [
    '/tpl/prefetch_01_a.html',
    '/tpl/prefetch_01_b.html',
    '/tpl/prefetch_01_c.html',
  ];

  let totalCallCount = 0;

  this.template.prefetch(
    sources,
    () => {
      assert.strictEqual(totalCallCount, 3);
      done1();
    },
    () => {
      totalCallCount += 1;
    }
  );

  this.template.prefetch(
    sources,
    () => {
      assert.strictEqual(totalCallCount, 3);
      done2();
    },
    () => {
      totalCallCount += 1;
    }
  );
});
