QUnit.module("smodules.templateParser");

QUnit.test("normal block", function(assert) {
    var parser = smodules.templateParser(),
        source = "<div>foo {left}bar{right}</div>",
        result = parser.parse(source);

    assert.strictEqual(1, result.length);
    assert.strictEqual("normal", result[0].type);
    assert.strictEqual("<div>foo {bar}</div>", result[0].expr);
});

QUnit.test("normal block - error", function(assert) {
    var parser = smodules.templateParser(), source;

    source = "<div>{left} is ok, only { is forbidden.</div>";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = "<div> } is forbidden.</div>";
    assert.raises(function() {
        parser.parse(source);
    }, Error);
});

QUnit.test("literal block", function(assert) {
    var parser = smodules.templateParser(),
        source = "<div>{literal}{foo} {left}bar{right} {left}/literal{right} function() {};{/literal}</div>",
        result = parser.parse(source);

    assert.strictEqual(3, result.length);
    assert.strictEqual("normal", result[0].type);
    assert.strictEqual("<div>", result[0].expr);
    assert.strictEqual("literal", result[1].type);
    assert.strictEqual("{foo} {bar} {/literal} function() {};", result[1].expr);
    assert.strictEqual("normal", result[2].type);
    assert.strictEqual("</div>", result[2].expr);
});

QUnit.test("literal block - error", function(assert) {
    var parser = smodules.templateParser(), source;

    source = "<div>{literal}</div>";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = "<div>{/literal}</div>";
    assert.raises(function() {
        parser.parse(source);
    }, Error);
});

QUnit.test("holder block - no filters", function(assert) {
    var parser = smodules.templateParser(),
        source = "{ $foo.bar }",
        result = parser.parse(source);

    assert.strictEqual(1, result.length);
    assert.strictEqual("holder", result[0].type);
    assert.strictEqual(2, result[0].keys.length);
    assert.strictEqual("foo", result[0].keys[0]);
    assert.strictEqual("bar", result[0].keys[1]);
    assert.strictEqual(0, result[0].filters.length);
});

QUnit.test("holder block - no filters - error", function(assert) {
    var parser = smodules.templateParser(), source;

    source = "{ $ foo } has space between $ and property name.";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = "{ $.foo }";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = "{ $foo. }";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = "{ $foo..bar }";
    assert.raises(function() {
        parser.parse(source);
    }, Error);
});

QUnit.test("holder block - filters with no args", function(assert) {
    var parser  = smodules.templateParser(),
        source  = "{ $foo | filter1 | filter2 }",
        result  = parser.parse(source),
        filter1 = result[0].filters[0],
        filter2 = result[0].filters[1];

    assert.strictEqual("filter1", filter1.name);
    assert.strictEqual(0,         filter1.args.length);
    assert.strictEqual("filter2", filter2.name);
    assert.strictEqual(0,         filter2.args.length);
});

QUnit.test("holder block - filters with no args - error", function(assert) {
    var parser = smodules.template(), source;

    source = "{ $foo | invalid filter name }";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = "{ $foo | invalid-filter-name }";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = "{ $foo pipeNotFound }";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = "{ $foo | filter : }";
    assert.raises(function() {
        parser.parse(source);
    }, Error);
});

QUnit.test("holder block - filter with args - null, true and false", function(assert) {
    var parser = smodules.templateParser(),
        source = "{ $foo | filter : null, true, false }",
        result = parser.parse(source),
        filter = result[0].filters[0];

    assert.strictEqual(null,  filter.args[0]);
    assert.strictEqual(true,  filter.args[1]);
    assert.strictEqual(false, filter.args[2]);
});

QUnit.test("holder block - filter with args - null, true and false - error", function(assert) {
    var parser = smodules.templateParser(), source;

    source = "{ $foo | filter : NULL }";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = "{ $foo | filter : TRUE }";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = "{ $foo | filter : FALSE }";
    assert.raises(function() {
        parser.parse(source);
    }, Error);
});

QUnit.test("holder block - filter with args - string", function(assert) {
    var parser = smodules.templateParser(),
        source = "{ $foo | filter : 'test','{delimiter}','it\\'s string' }",
        result = parser.parse(source),
        filter = result[0].filters[0];

    assert.strictEqual("test",        filter.args[0]);
    assert.strictEqual("{delimiter}", filter.args[1]);
    assert.strictEqual("it's string", filter.args[2]);
});

QUnit.test("holder block - filter with args - string - error", function(assert) {
    var parser = smodules.templateParser(), source;

    source = "{ $foo | filter : 'test }";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = "{ $foo | filter : test' }";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = "{ $foo | filter : \"test' }";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = "{ $foo | filter : 'test\" }";
    assert.raises(function() {
        parser.parse(source);
    }, Error);
});

QUnit.test("holder block - filter with args - number", function(assert) {
    var parser = smodules.templateParser(),
        source = "{ $foo | filter : 0, 10, -99, 12.3, -0.123, 1e+1, 1e1, 10e-1 }",
        result = parser.parse(source),
        filter = result[0].filters[0];

    assert.strictEqual(0,      filter.args[0]);
    assert.strictEqual(10,     filter.args[1]);
    assert.strictEqual(-99,    filter.args[2]);
    assert.strictEqual(12.3,   filter.args[3]);
    assert.strictEqual(-0.123, filter.args[4]);
    assert.strictEqual(10,     filter.args[5]);
    assert.strictEqual(10,     filter.args[6]);
    assert.strictEqual(1,      filter.args[7]);
});

QUnit.test("if block - if elseif else", function(assert) {
    var parser = smodules.templateParser(),
        source = "{ if $value1 }" +
                 "<div>value1</div>" +
                 "{ elseif $value2 }" +
                 "<div>value2</div>" +
                 "{ elseif $value3 }" +
                 "<div>value3</div>" +
                 "{ else }" +
                 "<div>value4</div>" +
                 "{ /if }",
        result = parser.parse(source)[0],
        section;

    assert.strictEqual("if", result.type);
    assert.strictEqual(4, result.sections.length);

    section = result.sections[0];
    assert.strictEqual("if", section.header.type);
    assert.strictEqual(1,    section.blocks.length);
    assert.strictEqual("normal",            section.blocks[0].type);
    assert.strictEqual("<div>value1</div>", section.blocks[0].expr);

    section = result.sections[1];
    assert.strictEqual("elseif", section.header.type);
    assert.strictEqual(1,        section.blocks.length);
    assert.strictEqual("normal",            section.blocks[0].type);
    assert.strictEqual("<div>value2</div>", section.blocks[0].expr);

    section = result.sections[2];
    assert.strictEqual("elseif", section.header.type);
    assert.strictEqual(1,        section.blocks.length);
    assert.strictEqual("normal",            section.blocks[0].type);
    assert.strictEqual("<div>value3</div>", section.blocks[0].expr);

    section = result.sections[3];
    assert.strictEqual("else", section.header.type);
    assert.strictEqual(1,        section.blocks.length);
    assert.strictEqual("normal",            section.blocks[0].type);
    assert.strictEqual("<div>value4</div>", section.blocks[0].expr);
});

QUnit.test("if block - if elseif else - error", function(assert) {
    var parser = smodules.templateParser(), source;

    source = "{if $foo}<p>hoge</p>";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = "{elseif $foo}<p>hoge</p>{/if}";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = "{else}<p>hoge</p>{/if}";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = "{/if}";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = "{if $foo}<p>foo</p>{if $bar}<p>bar</p>{/if}";
    assert.raises(function() {
        parser.parse(source);
    }, Error);
});

QUnit.test("if block - conditions", function(assert) {
    var parser = smodules.templateParser(),
        source, section, stack, blocks;

    source = "{ if $foo === 'hoge' }<p>hoge</p>{ /if }";
    stack  = parser.parse(source)[0].sections[0].header.stack;
    assert.strictEqual(3, stack.length);
    assert.strictEqual("var", stack[0].type);
    assert.strictEqual("foo", stack[0].keys.join("."));
    assert.strictEqual("value", stack[1].type);
    assert.strictEqual("hoge",  stack[1].value);
    assert.strictEqual("comp", stack[2].type);
    assert.strictEqual("===",  stack[2].expr);

    // redundant round brackets
    source = "{ if ( ( $foo === 'hoge' ) ) }<p>hoge</p>{ /if }";
    stack  = parser.parse(source)[0].sections[0].header.stack;
    assert.strictEqual(3, stack.length);

    source = "{ if $val1 gt 10 and $val2 gte -1 or $val3 lt 1.0 and $val4 lte -1.0 }<p>ok</p>{ /if }";
    stack  = parser.parse(source)[0].sections[0].header.stack;
    assert.strictEqual(15, stack.length);
    assert.strictEqual("var",  stack[0].type);
    assert.strictEqual("val1", stack[0].keys.join("."));
    assert.strictEqual("value", stack[1].type);
    assert.strictEqual(10,      stack[1].value);
    assert.strictEqual("comp", stack[2].type);
    assert.strictEqual("gt",   stack[2].expr);
    assert.strictEqual("var",  stack[3].type);
    assert.strictEqual("val2", stack[3].keys.join("."));
    assert.strictEqual("value", stack[4].type);
    assert.strictEqual(-1,      stack[4].value);
    assert.strictEqual("comp", stack[5].type);
    assert.strictEqual("gte",  stack[5].expr);
    assert.strictEqual("andor", stack[6].type);
    assert.strictEqual("and",   stack[6].expr);
    assert.strictEqual("var",  stack[7].type);
    assert.strictEqual("val3", stack[7].keys.join("."));
    assert.strictEqual("value", stack[8].type);
    assert.strictEqual(1.0,     stack[8].value);
    assert.strictEqual("comp", stack[9].type);
    assert.strictEqual("lt",   stack[9].expr);
    assert.strictEqual("var",  stack[10].type);
    assert.strictEqual("val4", stack[10].keys.join("."));
    assert.strictEqual("value", stack[11].type);
    assert.strictEqual(-1.0,    stack[11].value);
    assert.strictEqual("comp", stack[12].type);
    assert.strictEqual("lte",  stack[12].expr);
    assert.strictEqual("andor", stack[13].type);
    assert.strictEqual("and",   stack[13].expr);
    assert.strictEqual("andor", stack[14].type);
    assert.strictEqual("or",    stack[14].expr);

    // inversion of lval and rval
    source = "{ if 10 !== $price }<p>ok</p>{ /if }";
    stack  = parser.parse(source)[0].sections[0].header.stack;
    assert.strictEqual(3, stack.length);
    assert.strictEqual("value", stack[0].type);
    assert.strictEqual(10,      stack[0].value);
    assert.strictEqual("var",   stack[1].type);
    assert.strictEqual("price", stack[1].keys.join("."));
    assert.strictEqual("comp", stack[2].type);
    assert.strictEqual("!==",  stack[2].expr);

    // priority of and/or
    source = "{ if ( $var1 or $var2 ) and $var3 }<p>ok</p>{ /if }";
    stack  = parser.parse(source)[0].sections[0].header.stack;
    assert.strictEqual(5, stack.length);
    assert.strictEqual("var",  stack[0].type);
    assert.strictEqual("var1", stack[0].keys.join("."));
    assert.strictEqual("var",  stack[1].type);
    assert.strictEqual("var2", stack[1].keys.join("."));
    assert.strictEqual("andor", stack[2].type);
    assert.strictEqual("or",    stack[2].expr);
    assert.strictEqual("var",  stack[3].type);
    assert.strictEqual("var3", stack[3].keys.join("."));
    assert.strictEqual("andor", stack[4].type);
    assert.strictEqual("and",   stack[4].expr);
});

QUnit.test("if block - conditions - error", function(assert) {
    var parser = smodules.templateParser(), source;

    // roundBracket -> endRoundBracket
    source = "{if () }<p>ok</p>{/if}";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // roundBracket -> comp
    source = "{if ( === $foo )}<p>ok</p>{/if}";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // roundBracket -> andor
    source = "{if ( and $foo )}<p>ok</p>{/if}";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // endRoundBracket -> roundBracket
    source = "{if ( $foo ) ( === $bar )}<p>ok</p>{/if}";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // endRoundBracket -> value
    source = "{if ( $foo ) 10 === $bar}<p>ok</p>{/if}";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // endRoundBracket -> var
    source = "{if ( $foo ) $bar gte 10}<p>ok</p>{/if}";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // endRoundBracket -> comp
    source = "{if ( $foo ) === $bar}<p>ok</p>{/if}";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // value -> roundBracket
    source = "{if 10 ( === $foo )}<p>ok</p>{/if}";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // value -> value
    source = "{if 10 20}<p>ok</p>{/if}";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // value -> var
    source = "{if 10 $foo}<p>ok</p>{/if}";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // var -> roundBracket
    soruce = "{if $foo ( === $bar )}<p>ok</p>{/if}";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // var -> value
    source = "{if $foo 10}<p>ok</p>{/if}";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // var -> var
    source = "{if $foo $bar}<p>ok</p>{/if}";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // comp -> roundBracket
    source = "{if $foo lte ( $bar ) }<p>ok</p>{/if}";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // comp -> endRoundBracket
    source = "{if ( $foo gte ) $bar}<p>ok</p>{/if}";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // comp -> comp
    source = "{if $foo === === $bar}<p>ok</p>{/if}";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // comp -> andor
    source = "{if $foo !== or $bar}<p>ok</p>{/if}";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // comp -> value -> comp
    source = "{if 10 === 10 === 10}<p>ok</p>{/if}";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // comp -> var -> comp
    source = "{if $foo gt $bar gt $baz}<p>ok</p>{/if}";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // andor -> endRoundBracket
    source = "{if ( $foo or ) $bar}<p>ok</p>{/if}";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // andor -> comp
    source = "{if $foo or === $bar}<p>ok</p>{/if}";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // andor -> andor
    source = "{if $foo or or $bar}<p>ok</p>{/if}";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // lack of endRoundBracket
    source = "{if ( $foo }<p>ok</p>{/if}";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // lack of roundBracket
    source = "{if ( $foo ) ) }<p>ok</p>{/if}";
    assert.raises(function() {
        parser.parse(source);
    }, Error);
});

QUnit.test("for block", function(assert) {
    var parser = smodules.templateParser(),
        source, block;

    source = "{ for $item in $items }<p>{ $item | h }</p>{ /for }";
    block  = parser.parse(source)[0];
    assert.strictEqual("for", block.type);
    assert.strictEqual("items", block.header.array.join("."));
    assert.strictEqual("undefined", typeof block.header.k);
    assert.strictEqual("item", block.header.v);
    assert.strictEqual(3, block.blocks.length);

    source = "{ for $idx, $item in $items }<p>{ $item | h }</p>{ /for }";
    block  = parser.parse(source)[0];
    assert.strictEqual("idx",  block.header.k);
    assert.strictEqual("item", block.header.v);
});

QUnit.test("for block - error", function(assert) {
    var parser = smodules.templateParser(), source;

    source = "{for $idx $item in $items}<p>{$item}</p>{/for}";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = "{for $idx , in $items}<p>{$idx}</p>{/for}";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = "{for , $item in $items}<p>{$item}</p>{/for}";
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = "{for $idx , $item , $foo in $items}<p>{$item}</p>{/for}";
    assert.raises(function() {
        parser.parse(source);
    }, Error);
});
