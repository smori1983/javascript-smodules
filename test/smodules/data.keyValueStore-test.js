module("smodules.data.keyValueStore");

test("add", function() {
    var kvs = smodules.data.keyValueStore();

    kvs.add("hoge", "test");
    strictEqual(true,   kvs.has("hoge"));
    strictEqual("test", kvs.get("hoge"));

    kvs.add("hoge", "hogehoge");
    strictEqual("hogehoge", kvs.get("hoge"));

    start();
});

test("remove", function() {
    var kvs = smodules.data.keyValueStore();

    kvs.add("name", "anonymous");
    strictEqual(true, kvs.has("name"));

    kvs.remove("name");
    strictEqual(false, kvs.has("name"));
    strictEqual("undefined", typeof kvs.get("name"));

    start();
});

test("clear", function() {
    var kvs = smodules.data.keyValueStore();

    kvs.add("name", "anonymous");
    kvs.add("mail", "anonymous@example.com");
    kvs.clear();
    strictEqual(false, kvs.has("name"));
    strictEqual(false, kvs.has("mail"));

    start();
});
