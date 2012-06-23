module("smodules.template");

asyncTest("remote source + appendTo", function() {
    var template = smodules.template(),
        src = "/javascript-smodules/browser-test/tpl/appendTo.html";

    template(src, {
        items: [
            { name: "item1", show: true },
            { name: "item2", show: false },
            { name: "item3", show: true }
        ]
    }).appendTo("#template-appendTo");

    window.setTimeout(function() {
        var li = $("#template-appendTo > ul:first > li");

        strictEqual(li.length, 2, "li.length is 2");
        strictEqual(li.eq(0).text(), "ITEM1", "li.eq(0).text() is 'ITEM1'");
        strictEqual(li.eq(1).text(), "ITEM3", "li.eq(1).text() is 'ITEM3'");
        start();
    }, 500);
});

asyncTest("remote source + insertBefore", function() {
    var template = smodules.template(),
        src = "/javascript-smodules/browser-test/tpl/insertBefore.html";

    template(src, {
        foo: {
            bar: {
                hoge: "hoge"
            }
        }
    }).insertBefore("#template-insertBefore-child");

    window.setTimeout(function() {
        var div = $("#template-insertBefore > div:first"),
            li  = div.find("ul:first").find("li");

        strictEqual(div.attr("id"), "template-insertBefore-target");
        strictEqual(li.eq(0).text(), "hoge", "li.eq(0).text() is 'hoge'");
        strictEqual(li.eq(1).text(), "default", "li.eq(1).text() is 'default'");
        start();
    }, 500);
});

test("embedded source - textarea", function() {
    var template = smodules.template(),
        src = "#textarea", target = "#template-textarea", div = $(target);

    template(src, {
        items: [{
            title: "title1",
            tags:  ["tag1", "tag2", "tag3"]
        }, {
            title: "title2",
            tags:  []
        }]
    }).appendTo(target);

    strictEqual(div.find(".item").length, 2, "div.find('.item').length is 2");
    strictEqual("title1", $("p:first", div.eq(0)).text(), "$('p:first', div.eq(0)).text() is 'title1'");
    strictEqual(3, $("li", div.eq(0)).length, "$('li', div.eq(0)).length is 3");
    strictEqual(0, $("ul", div.eq(1)).length, "$('ul', div.eq(1)).length is 0");
});

asyncTest("setRemoteFilePattern - default", function() {
    var template = smodules.template(),
        src = "/javascript-smodules/browser-test/tpl/template.html",
        param = { tag: "div", message: "test" },
        output;

    template(src, param).get(function(o) {
        output = o.trim();
    });

    window.setTimeout(function() {
        strictEqual("<div>test</div>", output, "Default pattern is regular expression: /\\.html$/");
        start();
    }, 100);
});

asyncTest("setRemoteFilePattern - string", function() {
    var template = smodules.template(),
        src = "/javascript-smodules/browser-test/tpl/template.html",
        param = { tag: "div", message: "test" },
        output;

    template(src, param).get(function(o) {
        output = o.trim();
    });

    window.setTimeout(function() {
        strictEqual("<div>test</div>", output, "If pattern is string, file is checked as indexOf(pattern) is 0.");
        start();
    }, 100);
});

asyncTest("setRemoteFilePattern - string - not match", function() {
    var template = smodules.template(),
        src = "/javascript-smodules/browser-test/tpl/template.html",
        param = { tag: "div", message: "test" },
        output;

    template.setRemoteFilePattern("/hoge/");
    template(src, param).get(function(o) {
        output = o.trim();
    });

    window.setTimeout(function() {
        strictEqual(src, output, "If file does not match, file name is treated as source of string.");
        start();
    }, 100);
});

asyncTest("setRemoteFilePattern - regular expression", function() {
    var template = smodules.template(),
        src = "/javascript-smodules/browser-test/tpl/template.html",
        param = { tag: "div", message: "test" },
        output;

    template.setRemoteFilePattern(/^\/javascript-smodules\/browser-test\/tpl\//);
    template(src, param).get(function(o) {
        output = o.trim();
    });

    window.setTimeout(function() {
        strictEqual("<div>test</div>", output, "/^\\/javascript-smodules\\/browser-test\\/tpl\\// for " + src);
        start();
    }, 100);
});

asyncTest("setRemoteFilePattern - regular expression - not match", function() {
    var template = smodules.template(),
        src = "/javascript-smodules/browser-test/tpl/template.html",
        param = { tag: "div", message: "test" },
        output;

    template.setRemoteFilePattern(/\.tpl$/);
    template(src, param).get(function(o) {
        output = o.trim();
    });

    window.setTimeout(function() {
        strictEqual(src, output, "/\\.tpl$/ for " + src);
        start();
    }, 100);
});
