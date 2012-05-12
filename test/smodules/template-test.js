module("smodules.template");

asyncTest("appendTo without bindParams", function() {
    var src = '<div id="template-test1-target"></div>';

    smodules.template(src, {}).appendTo("#template-test1");

    window.setTimeout(function() {
        var parentId = $("#template-test1-target").parent().attr("id");

        strictEqual(parentId, "template-test1");
        start();
    }, 10);
});

asyncTest("insertBefore without bindParams", function() {
    var src = '<div id="template-test2-target"></div>';

    smodules.template(src, {}).insertBefore("#template-test2-child");

    window.setTimeout(function() {
        var nextElementId = $("#template-test2-target").next().attr("id");

        strictEqual(nextElementId, "template-test2-child");
        start();
    }, 10);
});

asyncTest("appendTo with bindParams as non-object", function() {
    var src  = '<div id="template-test4-target">{{date}}</div>';
    var now  = new Date();
    var date = now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate();

    smodules.template(src, {
        "date": date
    }).appendTo("#template-test4");

    window.setTimeout(function() {
        strictEqual($("#template-test4-target").text(), date);
        start();
    }, 10);
});

asyncTest("appendTo with bindParams as object", function() {
    var src = '<div id="template-test5-target">' +
              'name is {{user.profile.name}} and age is {{user.profile.age}}</span>' +
              '</div>';
    var userData = {
        profile: {
            name: "hoge",
            age: 20
        }
    };

    smodules.template(src, {
        user: userData 
    }).appendTo("#template-test5");

    window.setTimeout(function() {
        strictEqual($("#template-test5-target").text(), "name is hoge and age is 20");
        start();
    }, 10);
});

asyncTest("appendTo with bindParams as object array", function() {
    var src = '<div id="template-test6-target-{{idx}}">{{idx}}</div>';
    var bind = [ { idx: 0 }, { idx: 1 } ];

    smodules.template(src, bind).appendTo("#template-test6");

    window.setTimeout(function() {
        strictEqual($("#template-test6-target-0").text(), "0");
        strictEqual($("#template-test6-target-1").text(), "1");
        start();
    }, 10);
});
