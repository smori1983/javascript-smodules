module("smodules.template");

asyncTest("remote source + appendTo", function() {
    var src = "/javascript-smodules/browser-test/tpl/appendTo.html";

    smodules.template(src, {
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
    var src = "/javascript-smodules/browser-test/tpl/insertBefore.html";

    smodules.template(src, {
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
    var src = "#textarea", target = "#template-textarea";

    smodules.template(src, {
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

/*
$(function() {
var src = "#textarea";
var content = $(src).val();
var p =smodules.templateParser.parse(content, src);

smodules.template("#textarea", {
    str1: "a",
    str2: "b",
    bookmark: {
        items: [{
            title: "title1",
            tags: [ "tag1", "tag2", "tag3" ]
        },{
            title: "title2",
            tags: [ "japan", "usa" ]
        }]
    }
}).get(function(text) {
    console.log(text);
});
});
*/
