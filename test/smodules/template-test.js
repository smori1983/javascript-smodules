module("smodules.template");

test("normal block", function() {
    var target = "#template-normal-block",
        src = "<p>{left}ok{right}</p>";

    smodules.template(src, {}).appendTo(target);
    strictEqual("<p>{ok}</p>", $(target).html());

    start();
});

test("literal block", function() {
    var target = "#template-literal-block",
        src = "{literal}<p>{literal} {left}/literal{right}</p>{/literal}";

    smodules.template(src, {}).appendTo(target);
    strictEqual("<p>{literal} {/literal}</p>", $(target).html());

    start();
});

test("holder block", function() {
    var target = "#template-holder-block", src, param;

    // escape html
    src = "<p>{ $foo.bar | h }</p>";
    param = { foo: { bar : "<hoge>" } };
    smodules.template(src, param).appendTo(target);
    strictEqual("<p>&lt;hoge&gt;</p>", $(target).html());

    $(target).empty();

    // user filter 'default'
    src = "<p>{ $foo.bar | default:'piyo' | h }</p>";
    param = { foo: "foo" };
    smodules.template(src, param).appendTo(target);
    strictEqual("<p>piyo</p>", $(target).html());

    $(target).empty();

    // same holder in multiple places
    src = "<p>{ $user.name | h }</p><p>{ $user.name | h }</p>";
    param = { user: { name: "Tom" } };
    smodules.template(src, param).appendTo(target);
    strictEqual("<p>Tom</p><p>Tom</p>", $(target).html());

    $(target).empty();

    // bind within tag
    src = '<p class="{ $className | h }">sample</p>';
    param = { className: "hoge" };
    smodules.template(src, param).appendTo(target);
    strictEqual('<p class="hoge">sample</p>', $(target).html());

    $(target).empty();

    // create original filter
    smodules.template.addFilter("originalFilter", function(value, size, tail) {
        return value.slice(0, size) + (tail ? tail : "");
    });
    src = "<p>{ $foo | originalFilter:1 | h }</p><p>{ $foo | originalFilter:3,'...' | h }</p>";
    param = { foo: "abcdefghi" };
    smodules.template(src, param).appendTo(target);
    strictEqual("<p>a</p><p>abc...</p>", $(target).html());

    start();
});

test("if block", function() {
    var target = "#template-if-block", src, param;

    src = "{ if $foo }<p>yes</p>{ else }<p>no</p>{ /if }";
    param = { foo: true };
    smodules.template(src, param).appendTo(target);
    strictEqual("<p>yes</p>", $(target).html());

    $(target).empty();

    // logical operator - and
    src = "{ if $foo and $bar }<p>yes</p>{ else }<p>no</p>{ /if }";
    param = { foo: true, bar: false };
    smodules.template(src, param).appendTo(target);
    strictEqual("<p>no</p>", $(target).html());

    $(target).empty();

    // logical operator - combination
    src = "{ if $foo and ( $bar or $baz ) }<p>yes</p>{ else }<p>no</p>{ /if }";
    param = { foo: true, bar: false, baz: true };
    smodules.template(src, param).appendTo(target);
    strictEqual("<p>yes</p>", $(target).html());

    $(target).empty();

    // comparative operator
    src = "{ if $price gte 100 }<p>high</p>{ elseif $price gte 50 }<p>middle</p>{ else }<p>low</p>{ /if }";
    param = { price: 50 };
    smodules.template(src, param).appendTo(target);
    strictEqual("<p>middle</p>", $(target).html());

    $(target).empty();

    // comparative operator - "===" and "=="
    src = "{ if $foo === 1}<p>one</p>{ /if }{if $foo == 1}<p>two</p>{ /if }";
    param = { foo: true };
    smodules.template(src, param).appendTo(target);
    strictEqual("<p>two</p>", $(target).html());

    start();
});

test("for block", function() {
    var target = "#template-for-block", src, param;

    src = "{ for $item in $items }<p>{ $item | h }</p>{ /for }";
    param = { items: [ "one", "two", "three" ] };
    smodules.template(src, param).appendTo(target);
    strictEqual("<p>one</p><p>two</p><p>three</p>", $(target).html());

    $(target).empty();

    // use index
    src = "{ for $idx,$item in $items }<p>{ $idx | h }-{ $item | h }</p>{ /for }";
    param = { items: [ "one", "two" ] };
    smodules.template(src, param).appendTo(target);
    strictEqual("<p>0-one</p><p>1-two</p>", $(target).html());

    $(target).empty();

    start();
});
