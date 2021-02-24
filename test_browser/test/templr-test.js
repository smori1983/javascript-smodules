const $ = require('jquery');
const QUnit = require('qunit').QUnit;
const templr = require('./../../src/templr-browser');

QUnit.module('templr');

QUnit.test('appendTo - remote source', function (assert) {
  const done = assert.async();

  const src = '/tpl/appendTo.html';
  const param = {
    items: [
      {name: 'item1', show: true},
      {name: 'item2', show: false},
      {name: 'item3', show: true},
    ],
  };

  $.ajax({
    url: src,
    success: (response) => {
      const rendered = templr.render(response, param);
      $(rendered).appendTo($('#template-appendTo'));

      const li = $('#template-appendTo > ul:first > li');
      assert.strictEqual(li.eq(0).text(), 'item1', 'li.eq(0).text() is "item1"');
      assert.strictEqual(li.eq(1).text(), 'item3', 'li.eq(1).text() is "item3"');

      done();
    },
  });
});

QUnit.test('insertBefore - remote source', function (assert) {
  const done = assert.async();

  const src = '/tpl/insertBefore.html';
  const param = {
    foo: {
      bar: {
        hoge: 'hoge',
      },
    },
  };

  $.ajax({
    url: src,
    success: (response) => {
      const rendered = templr.render(response, param);
      $(rendered).insertBefore($('#template-insertBefore-child'));

      const div = $('#template-insertBefore > div:first');
      const li = div.find('ul:first').find('li');
      assert.strictEqual(div.attr('id'), 'template-insertBefore-target');
      assert.strictEqual(li.eq(0).text(), 'hoge', 'li.eq(0).text() is "hoge"');
      assert.strictEqual(li.eq(1).text(), '', 'li.eq(1).text() is ""');

      done();
    },
  });
});

QUnit.test('appendTo - embedded source', function (assert) {
  const src = '#textarea';
  const target = '#template-textarea';
  const div = $(target);

  const output = templr.render($(src).val(), {
    items: [{
      title: 'title1',
      tags: ['tag1', 'tag2', 'tag3'],
    }, {
      title: 'title2',
      tags: [],
    }],
  });
  $(output).appendTo(target);

  assert.strictEqual(div.find('.item').length, 2, 'div.find(\'.item\').length is 2');
  assert.strictEqual('title1', $('p:first', div.eq(0)).text(), '$(\'p:first\', div.eq(0)).text() is \'title1\'');
  assert.strictEqual(3, $('li', div.eq(0)).length, '$(\'li\', div.eq(0)).length is 3');
  assert.strictEqual(0, $('ul', div.eq(1)).length, '$(\'ul\', div.eq(1)).length is 0');
});

/**
QUnit.asyncTest("preFetch", function() {
    var template = smodules.template(),
        stringSrc = "<p>hoge</p>",
        remoteSrc = "/javascript-smodules/browser-test/tpl/template.html",
        cacheList;

    template.preFetch([stringSrc, remoteSrc], function() {
        cacheList = template.getTemplateCacheList();
        strictEqual(2, cacheList.length, "template cache size is 2.");
        strictEqual(true, cacheList.indexOf(stringSrc) >= 0, "template cache has string source.");
        strictEqual(true, cacheList.indexOf(remoteSrc) >= 0, "template cache has remote source.");
        start();
    });
    cacheList = template.getTemplateCacheList();
    strictEqual(1, cacheList.length, "template cache size is 1.");
    strictEqual(true, cacheList.indexOf(stringSrc) >= 0, "template cache has string source.");
});

QUnit.asyncTest("preFetch - bind - get - without callback", function() {
    var template = smodules.template(),
        src = "/javascript-smodules/browser-test/tpl/template.html",
        param = { tag: "div", message: "test" },
        output;

    template.preFetch(src, function() {
        var output = $.trim(template.bind(src, param).get());

        strictEqual("<div>test</div>", output, "by using preFetch(), bind() can be used synchronously.");
        start();
    });
});
**/
