module("smodules.template");

test("normal block", function() {
    var target = "#template-test",
        src = "<p>{left}ok{right}</p>";

    $(target).empty();
    smodules.template(src, {}).appendTo(target);
    strictEqual("<p>{ok}</p>", $(target).html());

    start();
});

test("literal block", function() {
    var target = "#template-test",
        src = "{literal}<p>{literal} {left}/literal{right}</p>{/literal}";

    $(target).empty();
    smodules.template(src, {}).appendTo(target);
    strictEqual("<p>{literal} {/literal}</p>", $(target).html());

    start();
});

test("holder block", function() {
    var target = "#template-test", src, param;

    $(target).empty();
    src = "<p>{ $foo.bar }</p>";
    param = { foo: { bar : "hoge" } };
    smodules.template(src, param).appendTo(target);
    strictEqual("<p>hoge</p>", $(target).html());

    // same holder in multiple places
    $(target).empty();
    src = "<p>{ $user.name }</p><p>{ $user.name }</p>";
    param = { user: { name: "Tom" } };
    smodules.template(src, param).appendTo(target);
    strictEqual("<p>Tom</p><p>Tom</p>", $(target).html());

    // bind within tag
    $(target).empty();
    src = '<p class="{ $className }">sample</p>';
    param = { className: "hoge" };
    smodules.template(src, param).appendTo(target);
    strictEqual('<p class="hoge">sample</p>', $(target).html());

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
    smodules.template(src, param).appendTo(target);
    strictEqual("<p>c</p>", $(target).html());

    start();
});

test("holder block - default filter", function() {
    var target = "#template-test", src, param;

    // h
    $(target).empty();
    src = "<p>{ $foo | h }</p>";
    param = { foo: "<p>\"it's mine & that's yours\"</p>" };
    smodules.template(src, param).appendTo(target);
    // NOTE: " and ' are as they are in innerHTML.
    strictEqual("<p>&lt;p&gt;\"it's mine &amp; that's yours\"&lt;/p&gt;</p>", $(target).html());

    // default : template value is undefined
    $(target).empty();
    src = "<p>{ $foo.bar | default:'piyo' }</p>";
    param = { foo: "foo" };
    smodules.template(src, param).appendTo(target);
    strictEqual("<p>piyo</p>", $(target).html());

    // default : toString() will be called at end of binding.
    $(target).empty();
    src = "<p>{ $foo | default:'a' }</p>";
    param = { foo: false };
    smodules.template(src, param).appendTo(target);
    strictEqual("<p>false</p>", $(target).html());

    // upper
    $(target).empty();
    src = "<p>{ $foo | upper }</p>";
    param = { foo: "abc" };
    smodules.template(src, param).appendTo(target);
    strictEqual("<p>ABC</p>", $(target).html());

    // lower
    $(target).empty();
    src = "<p>{ $foo | lower }</p>";
    param = { foo: "XYZ" };
    smodules.template(src, param).appendTo(target);
    strictEqual("<p>xyz</p>", $(target).html());

    // plus
    $(target).empty();
    src = "<p>{ $foo | plus:1 }</p><p>{ $bar | plus:2 }</p><p>{ $baz | plus:-1 }</p>";
    param = { foo: 1, bar: 1.23, baz: 10 };
    smodules.template(src, param).appendTo(target);
    strictEqual("<p>2</p><p>3.23</p><p>9</p>", $(target).html());

    start();
});

test("holder block - original filter", function() {
    var target = "#template-test", src, param;

    // create original filter
    $(target).empty();
    smodules.template.addFilter("originalFilter", function(value, size, tail) {
        return value.slice(0, size) + (tail ? tail : "");
    });
    src = "<p>{ $foo | originalFilter:1 }</p><p>{ $foo | originalFilter:3,'...' }</p>";
    param = { foo: "abcdefghi" };
    smodules.template(src, param).appendTo(target);
    strictEqual("<p>a</p><p>abc...</p>", $(target).html());

    start();
});

test("if block", function() {
    var target = "#template-test", src, param;

    $(target).empty();
    src = "{ if $foo }<p>yes</p>{ else }<p>no</p>{ /if }";
    param = { foo: true };
    smodules.template(src, param).appendTo(target);
    strictEqual("<p>yes</p>", $(target).html());

    // logical operator - and
    $(target).empty();
    src = "{ if $foo and $bar }<p>yes</p>{ else }<p>no</p>{ /if }";
    param = { foo: true, bar: false };
    smodules.template(src, param).appendTo(target);
    strictEqual("<p>no</p>", $(target).html());

    // logical operator - combination
    $(target).empty();
    src = "{ if $foo and ( $bar or $baz ) }<p>yes</p>{ else }<p>no</p>{ /if }";
    param = { foo: true, bar: false, baz: true };
    smodules.template(src, param).appendTo(target);
    strictEqual("<p>yes</p>", $(target).html());

    // comparative operator
    $(target).empty();
    src = "{ if $price gte 100 }<p>high</p>{ elseif $price gte 50 }<p>middle</p>{ else }<p>low</p>{ /if }";
    param = { price: 50 };
    smodules.template(src, param).appendTo(target);
    strictEqual("<p>middle</p>", $(target).html());

    // comparative operator - "===" and "=="
    $(target).empty();
    src = "{ if $foo === 1}<p>one</p>{ /if }{if $foo == 1}<p>two</p>{ /if }";
    param = { foo: true };
    smodules.template(src, param).appendTo(target);
    strictEqual("<p>two</p>", $(target).html());

    start();
});

test("for block", function() {
    var target = "#template-test", src, param;

    $(target).empty();
    src = "{ for $item in $items }<p>{ $item }</p>{ /for }";
    param = { items: [ "one", "two", "three" ] };
    smodules.template(src, param).appendTo(target);
    strictEqual("<p>one</p><p>two</p><p>three</p>", $(target).html());

    // use index
    $(target).empty();
    src = "{ for $idx,$item in $items }<p>{ $idx }-{ $item }</p>{ /for }";
    param = { items: [ "one", "two" ] };
    smodules.template(src, param).appendTo(target);
    strictEqual("<p>0-one</p><p>1-two</p>", $(target).html());

    start();
});
