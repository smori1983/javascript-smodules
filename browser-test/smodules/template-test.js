module("smodules.template");

asyncTest("appendTo without bindParams", function() {
    var src = "/javascript-smodules/browser-test/tpl/template-test1.html";

    smodules.template(src, {}).appendTo("#template-test1");

    window.setTimeout(function() {
        var parentId = $("#template-test1-target").parent().attr("id");

        strictEqual(parentId, "template-test1");
        start();
    }, 1500);
});

asyncTest("insertBefore without bindParams", function() {
    var src = "/javascript-smodules/browser-test/tpl/template-test2.html";

    smodules.template(src, {}).insertBefore("#template-test2-child");

    window.setTimeout(function() {
        var nextElementId = $("#template-test2-target").next().attr("id");

        strictEqual(nextElementId, "template-test2-child");
        start();
    }, 500);
});

asyncTest("appendTo with bindParams as non-object", function() {
    var src  = "/javascript-smodules/browser-test/tpl/template-test3.html";
    var now  = new Date();
    var date = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate();

    smodules.template(src, {
        "date": date
    }).appendTo("#template-test3");

    window.setTimeout(function() {
        strictEqual($("#template-test3-target").text(), date);
        start();
    }, 500);
});

asyncTest("appendTo with bindParams as object", function() {
    var src  = "/javascript-smodules/browser-test/tpl/template-test4.html";
    var bind = {
        profile: {
            name: "hoge",
            age: 20
        }
    };

    smodules.template(src, {
        user: bind
    }).appendTo("#template-test4");

    window.setTimeout(function() {
        strictEqual($("#template-test4-target").text(), "name is hoge and age is 20");
        start();
    }, 500);
});

asyncTest("appendTo with bindParams as object array", function() {
    var src  = "/javascript-smodules/browser-test/tpl/template-test5.html";
    var bind = [ { idx: 0 }, { idx: 1 } ];

    smodules.template(src, bind).appendTo("#template-test5");

    window.setTimeout(function() {
        strictEqual($("#template-test5-target-0").text(), "0");
        strictEqual($("#template-test5-target-1").text(), "1");
        start();
    }, 500);
});





