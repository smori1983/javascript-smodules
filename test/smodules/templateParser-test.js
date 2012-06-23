module("smodules.templateParser");

test("normal block", function() {
    var parser = smodules.templateParser(),
        source = "<div>foo {left}bar{right}</div>",
        result = parser.parse(source);

    strictEqual(1, result.length);
    strictEqual("normal", result[0].type);
    strictEqual("<div>foo {bar}</div>", result[0].expr);
    start();
});

test("normal block - error", function() {
    var parser = smodules.templateParser(), source;

    source = "<div>{left} is ok, only { is forbidden.</div>";
    raises(function() {
        parser.parse(source);
    }, Error);

    source = "<div> } is forbidden.</div>";
    raises(function() {
        parser.parse(source);
    }, Error);
});

test("literal block", function() {
    var parser = smodules.templateParser(),
        source = "<div>{literal}{foo} {left}bar{right} {left}/literal{right} function() {};{/literal}</div>",
        result = parser.parse(source);

    strictEqual(3, result.length);
    strictEqual("normal", result[0].type);
    strictEqual("<div>", result[0].expr);
    strictEqual("literal", result[1].type);
    strictEqual("{foo} {bar} {/literal} function() {};", result[1].expr);
    strictEqual("normal", result[2].type);
    strictEqual("</div>", result[2].expr);
    start();
});

test("literal block - error", function() {
    var parser = smodules.templateParser(), source;

    source = "<div>{literal}</div>";
    raises(function() {
        parser.parse(source);
    }, Error);

    source = "<div>{/literal}</div>";
    raises(function() {
        parser.parse(source);
    }, Error);
});

test("holder block - no filters", function() {
    var parser = smodules.templateParser(),
        source = "{ $foo.bar }",
        result = parser.parse(source);

    strictEqual(1, result.length);
    strictEqual("holder", result[0].type);
    strictEqual(2, result[0].keys.length);
    strictEqual("foo", result[0].keys[0]);
    strictEqual("bar", result[0].keys[1]);
    strictEqual(0, result[0].filters.length);
    start();
});

test("holder block - no filters - error", function() {
    var parser = smodules.templateParser(), source;

    source = "{ $ foo } has space between $ and property name.";
    raises(function() {
        parser.parse(source);
    }, Error);

    source = "{ $.foo }";
    raises(function() {
        parser.parse(source);
    }, Error);

    source = "{ $foo. }";
    raises(function() {
        parser.parse(source);
    }, Error);

    source = "{ $foo..bar }";
    raises(function() {
        parser.parse(source);
    }, Error);
});


test("holder block - filters with no args", function() {
    var parser  = smodules.templateParser(),
        source  = "{ $foo | filter1 | filter2 }",
        result  = parser.parse(source),
        filter1 = result[0].filters[0],
        filter2 = result[0].filters[1];

    strictEqual("filter1", filter1.name);
    strictEqual(0,         filter1.args.length);
    strictEqual("filter2", filter2.name);
    strictEqual(0,         filter2.args.length);
    start();
});

test("holder block - filters with no args - error", function() {
    var parser = smodules.template(), source;

    source = "{ $foo | invalid filter name }";
    raises(function() {
        parser.parse(source);
    }, Error);

    source = "{ $foo | invalid-filter-name }";
    raises(function() {
        parser.parse(source);
    }, Error);

    source = "{ $foo pipeNotFound }";
    raises(function() {
        parser.parse(source);
    }, Error);

    source = "{ $foo | filter : }";
    raises(function() {
        parser.parse(source);
    }, Error);
});

test("holder block - filter with args - null, true and false", function() {
    var parser = smodules.templateParser(),
        source = "{ $foo | filter : null, true, false }",
        result = parser.parse(source),
        filter = result[0].filters[0];

    strictEqual(null,  filter.args[0]);
    strictEqual(true,  filter.args[1]);
    strictEqual(false, filter.args[2]);
    start();
});

test("holder block - filter with args - null, true and false - error", function() {
    var parser = smodules.templateParser(), source;

    source = "{ $foo | filter : NULL }";
    raises(function() {
        parser.parse(source);
    }, Error);

    source = "{ $foo | filter : TRUE }";
    raises(function() {
        parser.parse(source);
    }, Error);

    source = "{ $foo | filter : FALSE }";
    raises(function() {
        parser.parse(source);
    }, Error);
});

test("holder block - filter with args - string", function() {
    var parser = smodules.templateParser(),
        source = "{ $foo | filter : 'test','{delimiter}','it\\'s string' }",
        result = parser.parse(source),
        filter = result[0].filters[0];

    strictEqual("test",        filter.args[0]);
    strictEqual("{delimiter}", filter.args[1]);
    strictEqual("it's string", filter.args[2]);
    start();
});

test("holder block - filter with args - string - error", function() {
    var parser = smodules.templateParser(), source;

    source = "{ $foo | filter : 'test }";
    raises(function() {
        parser.parse(source);
    }, Error);

    source = "{ $foo | filter : test' }";
    raises(function() {
        parser.parse(source);
    }, Error);

    source = "{ $foo | filter : \"test' }";
    raises(function() {
        parser.parse(source);
    }, Error);

    source = "{ $foo | filter : 'test\" }";
    raises(function() {
        parser.parse(source);
    }, Error);
});

test("holder block - filter with args - number", function() {
    var parser = smodules.templateParser(),
        source = "{ $foo | filter : 0, 10, -99, 12.3, -0.123, 1e+1, 1e1, 10e-1 }",
        result = parser.parse(source),
        filter = result[0].filters[0];

    strictEqual(0,      filter.args[0]);
    strictEqual(10,     filter.args[1]);
    strictEqual(-99,    filter.args[2]);
    strictEqual(12.3,   filter.args[3]);
    strictEqual(-0.123, filter.args[4]);
    strictEqual(10,     filter.args[5]);
    strictEqual(10,     filter.args[6]);
    strictEqual(1,      filter.args[7]);
    start();
});

test("if block - if elseif else", function() {
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

    strictEqual("if", result.type);
    strictEqual(4, result.sections.length);

    section = result.sections[0];
    strictEqual("if", section.header.type);
    strictEqual(1,    section.blocks.length);
    strictEqual("normal",            section.blocks[0].type);
    strictEqual("<div>value1</div>", section.blocks[0].expr);

    section = result.sections[1];
    strictEqual("elseif", section.header.type);
    strictEqual(1,        section.blocks.length);
    strictEqual("normal",            section.blocks[0].type);
    strictEqual("<div>value2</div>", section.blocks[0].expr);

    section = result.sections[2];
    strictEqual("elseif", section.header.type);
    strictEqual(1,        section.blocks.length);
    strictEqual("normal",            section.blocks[0].type);
    strictEqual("<div>value3</div>", section.blocks[0].expr);

    section = result.sections[3];
    strictEqual("else", section.header.type);
    strictEqual(1,        section.blocks.length);
    strictEqual("normal",            section.blocks[0].type);
    strictEqual("<div>value4</div>", section.blocks[0].expr);

    start();
});

test("if block - if elseif else - error", function() {
    var parser = smodules.templateParser(), source;

    source = "{if $foo}<p>hoge</p>";
    raises(function() {
        parser.parse(source);
    }, Error);

    source = "{elseif $foo}<p>hoge</p>{/if}";
    raises(function() {
        parser.parse(source);
    }, Error);

    source = "{else}<p>hoge</p>{/if}";
    raises(function() {
        parser.parse(source);
    }, Error);

    source = "{/if}";
    raises(function() {
        parser.parse(source);
    }, Error);

    source = "{if $foo}<p>foo</p>{if $bar}<p>bar</p>{/if}";
    raises(function() {
        parser.parse(source);
    }, Error);
});

test("if block - conditions", function() {
    var parser = smodules.templateParser(),
        source, section, stack, blocks;

    source = "{ if $foo === 'hoge' }<p>hoge</p>{ /if }";
    stack  = parser.parse(source)[0].sections[0].header.stack;
    strictEqual(3, stack.length);
    strictEqual("var", stack[0].type);
    strictEqual("foo", stack[0].keys.join("."));
    strictEqual("value", stack[1].type);
    strictEqual("hoge",  stack[1].value);
    strictEqual("comp", stack[2].type);
    strictEqual("===",  stack[2].expr);

    // redundant round brackets
    source = "{ if ( ( $foo === 'hoge' ) ) }<p>hoge</p>{ /if }";
    stack  = parser.parse(source)[0].sections[0].header.stack;
    strictEqual(3, stack.length);

    source = "{ if $val1 gt 10 and $val2 gte -1 or $val3 lt 1.0 and $val4 lte -1.0 }<p>ok</p>{ /if }";
    stack  = parser.parse(source)[0].sections[0].header.stack;
    strictEqual(15, stack.length);
    strictEqual("var",  stack[0].type);
    strictEqual("val1", stack[0].keys.join("."));
    strictEqual("value", stack[1].type);
    strictEqual(10,      stack[1].value);
    strictEqual("comp", stack[2].type);
    strictEqual("gt",   stack[2].expr);
    strictEqual("var",  stack[3].type);
    strictEqual("val2", stack[3].keys.join("."));
    strictEqual("value", stack[4].type);
    strictEqual(-1,      stack[4].value);
    strictEqual("comp", stack[5].type);
    strictEqual("gte",  stack[5].expr);
    strictEqual("andor", stack[6].type);
    strictEqual("and",   stack[6].expr);
    strictEqual("var",  stack[7].type);
    strictEqual("val3", stack[7].keys.join("."));
    strictEqual("value", stack[8].type);
    strictEqual(1.0,     stack[8].value);
    strictEqual("comp", stack[9].type);
    strictEqual("lt",   stack[9].expr);
    strictEqual("var",  stack[10].type);
    strictEqual("val4", stack[10].keys.join("."));
    strictEqual("value", stack[11].type);
    strictEqual(-1.0,    stack[11].value);
    strictEqual("comp", stack[12].type);
    strictEqual("lte",  stack[12].expr);
    strictEqual("andor", stack[13].type);
    strictEqual("and",   stack[13].expr);
    strictEqual("andor", stack[14].type);
    strictEqual("or",    stack[14].expr);

    // inversion of lval and rval
    source = "{ if 10 !== $price }<p>ok</p>{ /if }";
    stack  = parser.parse(source)[0].sections[0].header.stack;
    strictEqual(3, stack.length);
    strictEqual("value", stack[0].type);
    strictEqual(10,      stack[0].value);
    strictEqual("var",   stack[1].type);
    strictEqual("price", stack[1].keys.join("."));
    strictEqual("comp", stack[2].type);
    strictEqual("!==",  stack[2].expr);

    // priority of and/or
    source = "{ if ( $var1 or $var2 ) and $var3 }<p>ok</p>{ /if }";
    stack  = parser.parse(source)[0].sections[0].header.stack;
    strictEqual(5, stack.length);
    strictEqual("var",  stack[0].type);
    strictEqual("var1", stack[0].keys.join("."));
    strictEqual("var",  stack[1].type);
    strictEqual("var2", stack[1].keys.join("."));
    strictEqual("andor", stack[2].type);
    strictEqual("or",    stack[2].expr);
    strictEqual("var",  stack[3].type);
    strictEqual("var3", stack[3].keys.join("."));
    strictEqual("andor", stack[4].type);
    strictEqual("and",   stack[4].expr);

    start();
});

test("if block - conditions - error", function() {
    var parser = smodules.templateParser(), source;

    // roundBracket -> endRoundBracket
    source = "{if () }<p>ok</p>{/if}";
    raises(function() {
        parser.parse(source);
    }, Error);

    // roundBracket -> comp
    source = "{if ( === $foo )}<p>ok</p>{/if}";
    raises(function() {
        parser.parse(source);
    }, Error);

    // roundBracket -> andor
    source = "{if ( and $foo )}<p>ok</p>{/if}";
    raises(function() {
        parser.parse(source);
    }, Error);

    // endRoundBracket -> roundBracket
    source = "{if ( $foo ) ( === $bar )}<p>ok</p>{/if}";
    raises(function() {
        parser.parse(source);
    }, Error);

    // endRoundBracket -> value
    source = "{if ( $foo ) 10 === $bar}<p>ok</p>{/if}";
    raises(function() {
        parser.parse(source);
    }, Error);

    // endRoundBracket -> var
    source = "{if ( $foo ) $bar gte 10}<p>ok</p>{/if}";
    raises(function() {
        parser.parse(source);
    }, Error);

    // endRoundBracket -> comp
    source = "{if ( $foo ) === $bar}<p>ok</p>{/if}";
    raises(function() {
        parser.parse(source);
    }, Error);

    // value -> roundBracket
    source = "{if 10 ( === $foo )}<p>ok</p>{/if}";
    raises(function() {
        parser.parse(source);
    }, Error);

    // value -> value
    source = "{if 10 20}<p>ok</p>{/if}";
    raises(function() {
        parser.parse(source);
    }, Error);

    // value -> var
    source = "{if 10 $foo}<p>ok</p>{/if}";
    raises(function() {
        parser.parse(source);
    }, Error);

    // var -> roundBracket
    soruce = "{if $foo ( === $bar )}<p>ok</p>{/if}";
    raises(function() {
        parser.parse(source);
    }, Error);

    // var -> value
    source = "{if $foo 10}<p>ok</p>{/if}";
    raises(function() {
        parser.parse(source);
    }, Error);

    // var -> var
    source = "{if $foo $bar}<p>ok</p>{/if}";
    raises(function() {
        parser.parse(source);
    }, Error);

    // comp -> roundBracket
    source = "{if $foo lte ( $bar ) }<p>ok</p>{/if}";
    raises(function() {
        parser.parse(source);
    }, Error);

    // comp -> endRoundBracket
    source = "{if ( $foo gte ) $bar}<p>ok</p>{/if}";
    raises(function() {
        parser.parse(source);
    }, Error);

    // comp -> comp
    source = "{if $foo === === $bar}<p>ok</p>{/if}";
    raises(function() {
        parser.parse(source);
    }, Error);

    // comp -> andor
    source = "{if $foo !== or $bar}<p>ok</p>{/if}";
    raises(function() {
        parser.parse(source);
    }, Error);

    // comp -> value -> comp
    source = "{if 10 === 10 === 10}<p>ok</p>{/if}";
    raises(function() {
        parser.parse(source);
    }, Error);

    // comp -> var -> comp
    source = "{if $foo gt $bar gt $baz}<p>ok</p>{/if}";
    raises(function() {
        parser.parse(source);
    }, Error);

    // andor -> endRoundBracket
    source = "{if ( $foo or ) $bar}<p>ok</p>{/if}";
    raises(function() {
        parser.parse(source);
    }, Error);

    // andor -> comp
    source = "{if $foo or === $bar}<p>ok</p>{/if}";
    raises(function() {
        parser.parse(source);
    }, Error);

    // andor -> andor
    source = "{if $foo or or $bar}<p>ok</p>{/if}";
    raises(function() {
        parser.parse(source);
    }, Error);

    // lack of endRoundBracket
    source = "{if ( $foo }<p>ok</p>{/if}";
    raises(function() {
        parser.parse(source);
    }, Error);

    // lack of roundBracket
    source = "{if ( $foo ) ) }<p>ok</p>{/if}";
    raises(function() {
        parser.parse(source);
    }, Error);
});

test("for block", function() {
    var parser = smodules.templateParser(),
        source, block;

    source = "{ for $item in $items }<p>{ $item | h }</p>{ /for }";
    block  = parser.parse(source)[0];
    strictEqual("for", block.type);
    strictEqual("items", block.header.array.join("."));
    strictEqual("undefined", typeof block.header.k);
    strictEqual("item", block.header.v);
    strictEqual(3, block.blocks.length);

    source = "{ for $idx, $item in $items }<p>{ $item | h }</p>{ /for }";
    block  = parser.parse(source)[0];
    strictEqual("idx",  block.header.k);
    strictEqual("item", block.header.v);

    start();
});

test("for block - error", function() {
    var parser = smodules.templateParser(), source;

    source = "{for $idx $item in $items}<p>{$item}</p>{/for}";
    raises(function() {
        parser.parse(source);
    }, Error);

    source = "{for $idx , in $items}<p>{$idx}</p>{/for}";
    raises(function() {
        parser.parse(source);
    }, Error);

    source = "{for , $item in $items}<p>{$item}</p>{/for}";
    raises(function() {
        parser.parse(source);
    }, Error);

    source = "{for $idx , $item , $foo in $items}<p>{$item}</p>{/for}";
    raises(function() {
        parser.parse(source);
    }, Error);
});
