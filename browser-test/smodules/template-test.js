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

        strictEqual(li.length, 2);
        strictEqual($(li[0]).text(), "ITEM1");
        strictEqual($(li[1]).text(), "ITEM3");
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
        strictEqual($(li[0]).text(), "hoge");
        strictEqual($(li[1]).text(), "default");
        start();
    }, 500);
});

test("text area", function() {
    var template = smodules.template(),
        src = "#textarea", target = "#template-textarea";

    template(src, {
        items: [{
            title: "title1",
            tags:  ["tag1", "tag2", "tag3"]
        }, {
            title: "title2",
            tags:  []
        }]
    }).appendTo("#template-textarea");

    strictEqual($(target).find(".item").length, 2);
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
