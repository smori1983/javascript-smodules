module("smodules.data.queueHash");

test("addTo and getFrom", function() {
    var qh = smodules.data.queueHash();

    qh.addTo("list", "a");
    qh.addTo("list", "b");

    strictEqual(true, qh.has("list"));
    strictEqual(2,    qh.sizeOf("list"));
    strictEqual("a",  qh.getFrom("list"));
    strictEqual(1,    qh.sizeOf("list"));
    strictEqual("b",  qh.getFrom("list"));
    strictEqual(0,    qh.sizeOf("list"));

    qh.remove("list");

    strictEqual(false, qh.has("list"));
});

test("check keys", function() {
    var qh = smodules.data.queueHash();

    qh.addTo("queue1", "a");

    strictEqual(1,        qh.getKeys().length);
    strictEqual("queue1", qh.getKeys()[0]);

    qh.addTo("queue2", "A");

    strictEqual(2,        qh.getKeys().length);
    strictEqual("queue1", qh.getKeys()[0]);
    strictEqual("queue2", qh.getKeys()[1]);

    qh.clear();

    strictEqual(0, qh.getKeys().length);
});

test("using not existing key", function() {
    var qh = smodules.data.queueHash();

    strictEqual(false, qh.has("hoge"));
    strictEqual(0,     qh.sizeOf("hoge"));
    strictEqual("undefined", typeof qh.getFrom("hoge"));
});
