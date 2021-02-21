module("smodules.template");

asyncTest("bind - get - remote source", function() {
    var template = smodules.template(),
        src = "/javascript-smodules/browser-test/tpl/template.html",
        paramSet = [{ tag: "p", message: "a" }, { tag: "p", message: "b" }],
        result = "";

    $.each(paramSet, function(idx, param) {
        template.bind(src, param).get(function(output) {
            result += $.trim(output);
        });
    });

    window.setTimeout(function() {
        strictEqual("<p>a</p><p>b</p>", result, "even if remote source is used multiple times, fetching is just once.");
        start();
    }, 500);
});

asyncTest("bind - appendTo - remote source", function() {
    var template = smodules.template(),
        src = "/javascript-smodules/browser-test/tpl/appendTo.html";

    template.bind(src, {
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

asyncTest("bind - insertBefore - remote source", function() {
    var template = smodules.template(),
        src = "/javascript-smodules/browser-test/tpl/insertBefore.html";

    template.bind(src, {
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

test("bind - appendTo - embedded source", function() {
    var template = smodules.template(),
        src = "#textarea", target = "#template-textarea", div = $(target);

    template.bind(src, {
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

    template.bind(src, param).get(function(o) {
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

    template.bind(src, param).get(function(o) {
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
    template.bind(src, param).get(function(o) {
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
    template.bind(src, param).get(function(o) {
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
    template.bind(src, param).get(function(o) {
        output = o.trim();
    });

    window.setTimeout(function() {
        strictEqual(src, output, "/\\.tpl$/ for " + src);
        start();
    }, 100);
});

asyncTest("preFetch", function() {
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

asyncTest("preFetch - bind - get - without callback", function() {
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
