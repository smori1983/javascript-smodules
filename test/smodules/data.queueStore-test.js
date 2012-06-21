module("smodules.data.queueStore");

test("addTo and getFrom", function() {
    var qs = smodules.data.queueStore();

    qs.addTo("list", "a");
    qs.addTo("list", "b");

    strictEqual(true, qs.has("list"));
    strictEqual(2,    qs.sizeOf("list"));
    strictEqual("a",  qs.getFrom("list"));
    strictEqual(1,    qs.sizeOf("list"));
    strictEqual("b",  qs.getFrom("list"));
    strictEqual(0,    qs.sizeOf("list"));

    qs.remove("list");

    strictEqual(false, qs.has("list"));

    start();
});

test("check keys", function() {
    var qs = smodules.data.queueStore();

    qs.addTo("queue1", "a");

    strictEqual(1,        qs.getKeys().length);
    strictEqual("queue1", qs.getKeys()[0]);

    qs.addTo("queue2", "A");

    strictEqual(2,        qs.getKeys().length);
    strictEqual("queue1", qs.getKeys()[0]);
    strictEqual("queue2", qs.getKeys()[1]);

    qs.clear();

    strictEqual(0, qs.getKeys().length);

    start();
});

test("using not existing key", function() {
    var qs = smodules.data.queueStore();

    strictEqual(false, qs.has("hoge"));
    strictEqual(0,     qs.sizeOf("hoge"));
    strictEqual("undefined", typeof qs.getFrom("hoge"));

    start();
});
