module("smodules.data.hash");

test("add", function() {
    var hash = smodules.data.hash();

    hash.add("hoge", "test");
    strictEqual(true,   hash.has("hoge"));
    strictEqual("test", hash.get("hoge"));

    hash.add("hoge", "hogehoge");
    strictEqual("hogehoge", hash.get("hoge"));

    start();
});

test("remove", function() {
    var hash = smodules.data.hash();

    hash.add("name", "anonymous");
    strictEqual(true, hash.has("name"));

    hash.remove("name");
    strictEqual(false, hash.has("name"));
    strictEqual("undefined", typeof hash.get("name"));

    start();
});

test("clear", function() {
    var hash = smodules.data.hash();

    hash.add("name", "anonymous");
    hash.add("mail", "anonymous@example.com");
    hash.clear();
    strictEqual(false, hash.has("name"));
    strictEqual(false, hash.has("mail"));

    start();
});
