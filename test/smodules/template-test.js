QUnit.module("smodules.template");

QUnit.test("normal block", function(assert) {
    var template = smodules.template(),
        target = "#template-test",
        src = "<p>{left}ok{right}</p>";

    $(target).empty();
    template.bind(src, {}).appendTo(target);
    assert.strictEqual("<p>{ok}</p>", $(target).html());
});

QUnit.test("literal block", function(assert) {
    var template = smodules.template(),
        target = "#template-test",
        src = "{literal}<p>{literal} {left}/literal{right}</p>{/literal}";

    $(target).empty();
    template.bind(src, {}).appendTo(target);
    assert.strictEqual("<p>{literal} {/literal}</p>", $(target).html());
});

QUnit.test("holder block", function(assert) {
    var template = smodules.template(),
        target = "#template-test", src, param;

    $(target).empty();
    src = "<p>{ $foo.bar }</p>";
    param = { foo: { bar : "hoge" } };
    template.bind(src, param).appendTo(target);
    assert.strictEqual("<p>hoge</p>", $(target).html());

    // same holder in multiple places
    $(target).empty();
    src = "<p>{ $user.name }</p><p>{ $user.name }</p>";
    param = { user: { name: "Tom" } };
    template.bind(src, param).appendTo(target);
    assert.strictEqual("<p>Tom</p><p>Tom</p>", $(target).html());

    // bind within tag
    $(target).empty();
    src = '<p class="{ $className }">sample</p>';
    param = { className: "hoge" };
    template.bind(src, param).appendTo(target);
    assert.strictEqual('<p class="hoge">sample</p>', $(target).html());

    // under current specification, array is accessible by like this.
    $(target).empty();
    src = "<p>{ $items.2.name }</p>";
    param = {
        items: [
            { name: "a" },
            { name: "b" },
            { name: "c" }
        ]
    };
    template.bind(src, param).appendTo(target);
    assert.strictEqual("<p>c</p>", $(target).html());
});

QUnit.test("holder block - default filter", function(assert) {
    var template = smodules.template(),
        target = "#template-test", src, param;

    // h
    $(target).empty();
    src = "<p>{ $foo | h }</p>";
    param = { foo: "<p>\"it's mine & that's yours\"</p>" };
    template.bind(src, param).appendTo(target);
    // NOTE: " and ' are as they are in innerHTML.
    assert.strictEqual("<p>&lt;p&gt;\"it's mine &amp; that's yours\"&lt;/p&gt;</p>", $(target).html());

    // default : template value is undefined
    $(target).empty();
    src = "<p>{ $foo.bar | default:'piyo' }</p>";
    param = { foo: "foo" };
    template.bind(src, param).appendTo(target);
    assert.strictEqual("<p>piyo</p>", $(target).html());

    // default : toString() will be called at end of binding.
    $(target).empty();
    src = "<p>{ $foo | default:'a' }</p>";
    param = { foo: false };
    template.bind(src, param).appendTo(target);
    assert.strictEqual("<p>false</p>", $(target).html());

    // upper
    $(target).empty();
    src = "<p>{ $foo | upper }</p>";
    param = { foo: "abc" };
    template.bind(src, param).appendTo(target);
    assert.strictEqual("<p>ABC</p>", $(target).html());

    // lower
    $(target).empty();
    src = "<p>{ $foo | lower }</p>";
    param = { foo: "XYZ" };
    template.bind(src, param).appendTo(target);
    assert.strictEqual("<p>xyz</p>", $(target).html());

    // plus
    $(target).empty();
    src = "<p>{ $foo | plus:1 }</p><p>{ $bar | plus:2 }</p><p>{ $baz | plus:-1 }</p>";
    param = { foo: 1, bar: 1.23, baz: 10 };
    template.bind(src, param).appendTo(target);
    assert.strictEqual("<p>2</p><p>3.23</p><p>9</p>", $(target).html());
});

QUnit.test("holder block - original filter", function(assert) {
    var template = smodules.template(),
        target = "#template-test", src, param;

    // create original filter
    $(target).empty();
    template.addFilter("originalFilter", function(value, size, tail) {
        return value.slice(0, size) + (tail ? tail : "");
    });
    src = "<p>{ $foo | originalFilter:1 }</p><p>{ $foo | originalFilter:3,'...' }</p>";
    param = { foo: "abcdefghi" };
    template.bind(src, param).appendTo(target);
    assert.strictEqual("<p>a</p><p>abc...</p>", $(target).html());
});

QUnit.test("if block", function(assert) {
    var template = smodules.template(),
        target = "#template-test", src, param;

    $(target).empty();
    src = "{ if $foo }<p>yes</p>{ else }<p>no</p>{ /if }";
    param = { foo: true };
    template.bind(src, param).appendTo(target);
    assert.strictEqual("<p>yes</p>", $(target).html());

    // logical operator - and
    $(target).empty();
    src = "{ if $foo and $bar }<p>yes</p>{ else }<p>no</p>{ /if }";
    param = { foo: true, bar: false };
    template.bind(src, param).appendTo(target);
    assert.strictEqual("<p>no</p>", $(target).html());

    // logical operator - combination
    $(target).empty();
    src = "{ if $foo and ( $bar or $baz ) }<p>yes</p>{ else }<p>no</p>{ /if }";
    param = { foo: true, bar: false, baz: true };
    template.bind(src, param).appendTo(target);
    assert.strictEqual("<p>yes</p>", $(target).html());

    // comparative operator
    $(target).empty();
    src = "{ if $price gte 100 }<p>high</p>{ elseif $price gte 50 }<p>middle</p>{ else }<p>low</p>{ /if }";
    param = { price: 50 };
    template.bind(src, param).appendTo(target);
    assert.strictEqual("<p>middle</p>", $(target).html());

    // comparative operator - "===" and "=="
    $(target).empty();
    src = "{ if $foo === 1 }<p>one</p>{ /if }{if $foo == 1}<p>two</p>{ /if }";
    param = { foo: true };
    template.bind(src, param).appendTo(target);
    assert.strictEqual("<p>two</p>", $(target).html());
});

QUnit.test("for block", function(assert) {
    var template = smodules.template(),
        target = "#template-test", src, param;

    $(target).empty();
    src = "{ for $item in $items }<p>{ $item }</p>{ /for }";
    param = { items: [ "one", "two", "three" ] };
    template.bind(src, param).appendTo(target);
    assert.strictEqual("<p>one</p><p>two</p><p>three</p>", $(target).html());

    // use index
    $(target).empty();
    src = "{ for $idx,$item in $items }<p>{ $idx }-{ $item }</p>{ /for }";
    param = { items: [ "one", "two" ] };
    template.bind(src, param).appendTo(target);
    assert.strictEqual("<p>0-one</p><p>1-two</p>", $(target).html());
});

QUnit.test("preFetch and template cache", function(assert) {
    var template = smodules.template(),
        src1 = "<h1>{$value}</h1>",
        src2 = "<h2>{$value}</h2>",
        src3 = "<h3>{$value}</h3>",
        cacheList;

    // Initially no cache.
    cacheList = template.getTemplateCacheList();
    assert.strictEqual(0, cacheList.length);

    // Fetch single source.
    template.preFetch(src1);
    cacheList = template.getTemplateCacheList();
    assert.strictEqual(1, cacheList.length);
    assert.strictEqual(src1, cacheList[0]);

    // Fetch multiple sources.
    template.preFetch([src2, src3]);
    cacheList = template.getTemplateCacheList();
    assert.strictEqual(3, cacheList.length);
    assert.strictEqual(src1, cacheList[0]);
    assert.strictEqual(src2, cacheList[1]);
    assert.strictEqual(src3, cacheList[2]);

    // Clear individual cache.
    template.clearTemplateCache(src1);
    cacheList = template.getTemplateCacheList();
    assert.strictEqual(2, cacheList.length);

    // Clear all cache.
    template.clearTemplateCache();
    cacheList = template.getTemplateCacheList();
    assert.strictEqual(0, cacheList.length);
});

QUnit.test("bind - get - embedded source - with callback", function(assert) {
    var template = smodules.template(),
        src = "#template-test-source",
        params = { value: "hoge" };

    template.bind(src, params).get(function(output) {
        assert.strictEqual("<p>hoge</p>", output);
    });
});

QUnit.test("bind - get - embedded source - without callback", function(assert) {
    var template = smodules.template(),
        src = "#template-test-source",
        params = { value: "hoge" };

    assert.strictEqual("<p>hoge</p>", template.bind(src, params).get());
});

QUnit.test("bind - get - string source - with callback", function(assert) {
    var template = smodules.template(),
        src = "<p>{$value}</p>",
        params = { value: "hoge" };

    template.bind(src, params).get(function(output) {
        assert.strictEqual("<p>hoge</p>", output);
    });
});

QUnit.test("bind - get - string source - without callback", function(assert) {
    var template = smodules.template(),
        src = "<p>{$value}</p>",
        params = { value: "hoge" };

    assert.strictEqual("<p>hoge</p>", template.bind(src, params).get());
});

QUnit.test("error - filter not found", function(assert) {
    var template = smodules.template(),
        src = "<p>{ $value | hoge }</p>";

    assert.raises(function() {
        template.bind(src, { value: "test" }).get(function(output) {});
    }, Error);
});
