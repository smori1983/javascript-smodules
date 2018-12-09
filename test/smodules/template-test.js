QUnit.module('smodules.template');

QUnit.test('normal block', function(assert) {
    var template = smodules.template(),
        target = '#template-test',
        src = '<p>{left}ok{right}</p>';

    $(target).empty();
    template.bind(src, {}).appendTo(target);
    assert.strictEqual($(target).html(), '<p>{ok}</p>');
});

QUnit.test('literal block', function(assert) {
    var template = smodules.template(),
        target = '#template-test',
        src = '{literal}<p>{literal} {left}/literal{right}</p>{/literal}';

    $(target).empty();
    template.bind(src, {}).appendTo(target);
    assert.strictEqual($(target).html(), '<p>{literal} {/literal}</p>');
});

QUnit.test('holder block', function(assert) {
    var template = smodules.template(),
        target = '#template-test', src, param;

    $(target).empty();
    src = '<p>{ $foo.bar }</p>';
    param = { foo: { bar : 'hoge' } };
    template.bind(src, param).appendTo(target);
    assert.strictEqual($(target).html(), '<p>hoge</p>');

    // same holder in multiple places
    $(target).empty();
    src = '<p>{ $user.name }</p><p>{ $user.name }</p>';
    param = { user: { name: 'Tom' } };
    template.bind(src, param).appendTo(target);
    assert.strictEqual($(target).html(), '<p>Tom</p><p>Tom</p>');

    // bind within tag
    $(target).empty();
    src = '<p class="{ $className }">sample</p>';
    param = { className: 'hoge' };
    template.bind(src, param).appendTo(target);
    assert.strictEqual($(target).html(), '<p class="hoge">sample</p>');

    // under current specification, array is accessible by like this.
    $(target).empty();
    src = '<p>{ $items.2.name }</p>';
    param = {
        items: [
            { name: 'a' },
            { name: 'b' },
            { name: 'c' },
        ],
    };
    template.bind(src, param).appendTo(target);
    assert.strictEqual($(target).html(), '<p>c</p>');
});

QUnit.test('holder block - default filter', function(assert) {
    var template = smodules.template(),
        target = '#template-test', src, param;

    // h
    $(target).empty();
    src = '<p>{ $foo | h }</p>';
    param = { foo: '<p>"it\'s mine & that\'s yours"</p>' };
    template.bind(src, param).appendTo(target);
    // NOTE: " and ' are as they are in innerHTML.
    assert.strictEqual($(target).html(), '<p>&lt;p&gt;"it\'s mine &amp; that\'s yours"&lt;/p&gt;</p>');

    // default : template value is undefined
    $(target).empty();
    src = '<p>{ $foo.bar | default:\'piyo\' }</p>';
    param = { foo: 'foo' };
    template.bind(src, param).appendTo(target);
    assert.strictEqual($(target).html(), '<p>piyo</p>');

    // default : toString() will be called at end of binding.
    $(target).empty();
    src = '<p>{ $foo | default:\'a\' }</p>';
    param = { foo: false };
    template.bind(src, param).appendTo(target);
    assert.strictEqual($(target).html(), '<p>false</p>');

    // upper
    $(target).empty();
    src = '<p>{ $foo | upper }</p>';
    param = { foo: 'abc' };
    template.bind(src, param).appendTo(target);
    assert.strictEqual($(target).html(), '<p>ABC</p>');

    // lower
    $(target).empty();
    src = '<p>{ $foo | lower }</p>';
    param = { foo: 'XYZ' };
    template.bind(src, param).appendTo(target);
    assert.strictEqual($(target).html(), '<p>xyz</p>');

    // plus
    $(target).empty();
    src = '<p>{ $foo | plus:1 }</p><p>{ $bar | plus:2 }</p><p>{ $baz | plus:-1 }</p>';
    param = { foo: 1, bar: 1.23, baz: 10 };
    template.bind(src, param).appendTo(target);
    assert.strictEqual($(target).html(), '<p>2</p><p>3.23</p><p>9</p>');
});

QUnit.test('holder block - original filter', function(assert) {
    var template = smodules.template(),
        target = '#template-test', src, param;

    // create original filter
    $(target).empty();
    template.addFilter('originalFilter', function(value, size, tail) {
        return value.slice(0, size) + (tail ? tail : '');
    });
    src = '<p>{ $foo | originalFilter:1 }</p><p>{ $foo | originalFilter:3,\'...\' }</p>';
    param = { foo: 'abcdefghi' };
    template.bind(src, param).appendTo(target);
    assert.strictEqual($(target).html(), '<p>a</p><p>abc...</p>');
});

QUnit.test('if block', function(assert) {
    var template = smodules.template(),
        target = '#template-test', src, param;

    $(target).empty();
    src = '{ if $foo }<p>yes</p>{ else }<p>no</p>{ /if }';
    param = { foo: true };
    template.bind(src, param).appendTo(target);
    assert.strictEqual($(target).html(), '<p>yes</p>');

    // logical operator - and
    $(target).empty();
    src = '{ if $foo and $bar }<p>yes</p>{ else }<p>no</p>{ /if }';
    param = { foo: true, bar: false };
    template.bind(src, param).appendTo(target);
    assert.strictEqual($(target).html(), '<p>no</p>');

    // logical operator - combination
    $(target).empty();
    src = '{ if $foo and ( $bar or $baz ) }<p>yes</p>{ else }<p>no</p>{ /if }';
    param = { foo: true, bar: false, baz: true };
    template.bind(src, param).appendTo(target);
    assert.strictEqual($(target).html(), '<p>yes</p>');

    // comparative operator
    $(target).empty();
    src = '{ if $price gte 100 }<p>high</p>{ elseif $price gte 50 }<p>middle</p>{ else }<p>low</p>{ /if }';
    param = { price: 50 };
    template.bind(src, param).appendTo(target);
    assert.strictEqual($(target).html(), '<p>middle</p>');

    // comparative operator - "===" and "=="
    $(target).empty();
    src = '{ if $foo === 1 }<p>one</p>{ /if }{if $foo == 1}<p>two</p>{ /if }';
    param = { foo: true };
    template.bind(src, param).appendTo(target);
    assert.strictEqual($(target).html(), '<p>two</p>');
});

QUnit.test('for block', function(assert) {
    var template = smodules.template(),
        target = '#template-test', src, param;

    $(target).empty();
    src = '{ for $item in $items }<p>{ $item }</p>{ /for }';
    param = { items: ['one', 'two', 'three'] };
    template.bind(src, param).appendTo(target);
    assert.strictEqual($(target).html(), '<p>one</p><p>two</p><p>three</p>');
});

QUnit.test('for block - use index', function(assert) {
    var template = smodules.template(),
        target = '#template-test', src, param;

    $(target).empty();
    src = '{ for $idx,$item in $items }<p>{ $idx }-{ $item }</p>{ /for }';
    param = { items: ['one', 'two'] };
    template.bind(src, param).appendTo(target);
    assert.strictEqual($(target).html(), '<p>0-one</p><p>1-two</p>');
});

QUnit.test('for block - nested', function(assert) {
    var template = smodules.template(),
        target = '#template-test', src, param, expected;

    $(target).empty();
    src = '{ for $item in $items }' +
          '<ul>' +
          '{ for $id in $item.ids }' +
          '<li>{ $id }</li>' +
          '{ /for }' +
          '</ul>' +
          '{ /for }';
    param = { items: [
        { ids: [1, 2]},
        { ids: [3, 4]},
        { ids: [5, 6]},
    ]};

    expected = '<ul><li>1</li><li>2</li></ul>' +
               '<ul><li>3</li><li>4</li></ul>' +
               '<ul><li>5</li><li>6</li></ul>';

    template.bind(src, param).appendTo(target);
    assert.strictEqual($(target).html(), expected);
});

QUnit.test('for block - nested - if', function(assert) {
    var template = smodules.template(),
        target = '#template-test', src, param, expected;

    $(target).empty();
    src = '{ for $item in $items }' +
          '<ul>' +
          '{ for $id in $item.ids }' +
          '{ if $id === 1 or $id === 3 or $id === 5 }' +
          '<li>odd: { $id }</li>' +
          '{ else }' +
          '<li>even: { $id }</li>' +
          '{ /if }' +
          '{ /for }' +
          '</ul>' +
          '{ /for }';
    param = { items: [
        { ids: [1, 2]},
        { ids: [3, 4]},
        { ids: [5, 6]},
    ]};

    expected = '<ul><li>odd: 1</li><li>even: 2</li></ul>' +
               '<ul><li>odd: 3</li><li>even: 4</li></ul>' +
               '<ul><li>odd: 5</li><li>even: 6</li></ul>';

    template.bind(src, param).appendTo(target);
    assert.strictEqual($(target).html(), expected);
});

QUnit.test('for block - nested - if with property access', function(assert) {
    var template = smodules.template(),
        target = '#template-test', src, param, expected;

    $(target).empty();
    src = '{ for $item in $items }' +
          '<ul>' +
          '{ for $product in $item.products }' +
          '{ if $product.id === 1 }' +
          '<li>{ $product.name|h }</li>' +
          '{ /if }' +
          '{ /for }' +
          '</ul>' +
          '{ /for }';
    param = { items: [
        { products: [
            { id: 1, name: 'A' },
            { id: 2, name: 'B' },
        ]},
        { products: [
            { id: 1, name: 'C' },
            { id: 2, name: 'D' },
        ]},
    ]};

    expected = '<ul><li>A</li></ul>' +
               '<ul><li>C</li></ul>';

    template.bind(src, param).appendTo(target);
    assert.strictEqual($(target).html(), expected);
});

QUnit.test('preFetch and template cache', function(assert) {
    var template = smodules.template(),
        src1 = '<h1>{$value}</h1>',
        src2 = '<h2>{$value}</h2>',
        src3 = '<h3>{$value}</h3>',
        cacheList;

    // Initially no cache.
    cacheList = template.getTemplateCacheList();
    assert.strictEqual(cacheList.length, 0);

    // Fetch single source.
    template.preFetch(src1);
    cacheList = template.getTemplateCacheList();
    assert.strictEqual(cacheList.length, 1);
    assert.strictEqual(cacheList[0], src1);

    // Fetch multiple sources.
    template.preFetch([src2, src3]);
    cacheList = template.getTemplateCacheList();
    assert.strictEqual(cacheList.length, 3);
    assert.strictEqual(cacheList[0], src1);
    assert.strictEqual(cacheList[1], src2);
    assert.strictEqual(cacheList[2], src3);

    // Clear individual cache.
    template.clearTemplateCache(src1);
    cacheList = template.getTemplateCacheList();
    assert.strictEqual(cacheList.length, 2);

    // Clear all cache.
    template.clearTemplateCache();
    cacheList = template.getTemplateCacheList();
    assert.strictEqual(cacheList.length, 0);
});

QUnit.test('bind - get - embedded source - with callback', function(assert) {
    var template = smodules.template(),
        src = '#template-test-source',
        params = { value: 'hoge' };

    template.bind(src, params).get(function(output) {
        assert.strictEqual(output, '<p>hoge</p>');
    });
});

QUnit.test('bind - get - embedded source - without callback', function(assert) {
    var template = smodules.template(),
        src = '#template-test-source',
        params = { value: 'hoge' };

    assert.strictEqual(template.bind(src, params).get(), '<p>hoge</p>');
});

QUnit.test('bind - get - string source - with callback', function(assert) {
    var template = smodules.template(),
        src = '<p>{$value}</p>',
        params = { value: 'hoge' };

    template.bind(src, params).get(function(output) {
        assert.strictEqual(output, '<p>hoge</p>');
    });
});

QUnit.test('bind - get - string source - without callback', function(assert) {
    var template = smodules.template(),
        src = '<p>{$value}</p>',
        params = { value: 'hoge' };

    assert.strictEqual(template.bind(src, params).get(), '<p>hoge</p>');
});

QUnit.test('error - filter not found', function(assert) {
    var template = smodules.template(),
        src = '<p>{ $value | hoge }</p>';

    assert.raises(function() {
        template.bind(src, { value: 'test' }).get(function(output) {});
    }, Error);
});
