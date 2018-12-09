QUnit.module('smodules.templateParser');

QUnit.test('normal block', function(assert) {
    var parser = smodules.templateParser(),
        source = '<div>foo {left}bar{right}</div>',
        result = parser.parse(source);

    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].type, 'normal');
    assert.strictEqual(result[0].expr, '<div>foo {bar}</div>');
});

QUnit.test('normal block - error', function(assert) {
    var parser = smodules.templateParser(), source;

    source = '<div>{left} is ok, only { is forbidden.</div>';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = '<div> } is forbidden.</div>';
    assert.raises(function() {
        parser.parse(source);
    }, Error);
});

QUnit.test('literal block', function(assert) {
    var parser = smodules.templateParser(),
        source = '<div>{literal}{foo} {left}bar{right} {left}/literal{right} function() {};{/literal}</div>',
        result = parser.parse(source);

    assert.strictEqual(result.length, 3);
    assert.strictEqual(result[0].type, 'normal');
    assert.strictEqual(result[0].expr, '<div>');
    assert.strictEqual(result[1].type, 'literal');
    assert.strictEqual(result[1].expr, '{foo} {bar} {/literal} function() {};');
    assert.strictEqual(result[2].type, 'normal');
    assert.strictEqual(result[2].expr, '</div>');
});

QUnit.test('literal block - error', function(assert) {
    var parser = smodules.templateParser(), source;

    source = '<div>{literal}</div>';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = '<div>{/literal}</div>';
    assert.raises(function() {
        parser.parse(source);
    }, Error);
});

QUnit.test('holder block - no filters', function(assert) {
    var parser = smodules.templateParser(),
        source = '{ $foo.bar }',
        result = parser.parse(source);

    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].type, 'holder');
    assert.strictEqual(result[0].keys.length, 2);
    assert.strictEqual(result[0].keys[0], 'foo');
    assert.strictEqual(result[0].keys[1], 'bar');
    assert.strictEqual(result[0].filters.length, 0);
});

QUnit.test('holder block - no filters - error', function(assert) {
    var parser = smodules.templateParser(), source;

    source = '{ $ foo } has space between $ and property name.';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = '{ $.foo }';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = '{ $foo. }';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = '{ $foo..bar }';
    assert.raises(function() {
        parser.parse(source);
    }, Error);
});

QUnit.test('holder block - filters with no args', function(assert) {
    var parser  = smodules.templateParser(),
        source  = '{ $foo | filter1 | filter2 }',
        result  = parser.parse(source),
        filter1 = result[0].filters[0],
        filter2 = result[0].filters[1];

    assert.strictEqual(filter1.name, 'filter1');
    assert.strictEqual(filter1.args.length, 0);
    assert.strictEqual(filter2.name, 'filter2');
    assert.strictEqual(filter2.args.length, 0);
});

QUnit.test('holder block - filters with no args - error', function(assert) {
    var parser = smodules.template(), source;

    source = '{ $foo | invalid filter name }';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = '{ $foo | invalid-filter-name }';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = '{ $foo pipeNotFound }';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = '{ $foo | filter : }';
    assert.raises(function() {
        parser.parse(source);
    }, Error);
});

QUnit.test('holder block - filter with args - null, true and false', function(assert) {
    var parser = smodules.templateParser(),
        source = '{ $foo | filter : null, true, false }',
        result = parser.parse(source),
        filter = result[0].filters[0];

    assert.strictEqual(filter.args[0], null);
    assert.strictEqual(filter.args[1], true);
    assert.strictEqual(filter.args[2], false);
});

QUnit.test('holder block - filter with args - null, true and false - error', function(assert) {
    var parser = smodules.templateParser(), source;

    source = '{ $foo | filter : NULL }';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = '{ $foo | filter : TRUE }';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = '{ $foo | filter : FALSE }';
    assert.raises(function() {
        parser.parse(source);
    }, Error);
});

QUnit.test('holder block - filter with args - string', function(assert) {
    var parser = smodules.templateParser(),
        source = '{ $foo | filter : \'test\',\'{delimiter}\',\'it\\\'s string\' }',
        result = parser.parse(source),
        filter = result[0].filters[0];

    assert.strictEqual(filter.args[0], 'test');
    assert.strictEqual(filter.args[1], '{delimiter}');
    assert.strictEqual(filter.args[2], 'it\'s string');
});

QUnit.test('holder block - filter with args - string - error', function(assert) {
    var parser = smodules.templateParser(), source;

    source = '{ $foo | filter : \'test }';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = '{ $foo | filter : test\' }';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = '{ $foo | filter : "test\' }';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = '{ $foo | filter : \'test" }';
    assert.raises(function() {
        parser.parse(source);
    }, Error);
});

QUnit.test('holder block - filter with args - number', function(assert) {
    var parser = smodules.templateParser(),
        source = '{ $foo | filter : 0, 10, -99, 12.3, -0.123, 1e+1, 1e1, 10e-1 }',
        result = parser.parse(source),
        filter = result[0].filters[0];

    assert.strictEqual(filter.args[0], 0);
    assert.strictEqual(filter.args[1], 10);
    assert.strictEqual(filter.args[2], -99);
    assert.strictEqual(filter.args[3], 12.3);
    assert.strictEqual(filter.args[4], -0.123);
    assert.strictEqual(filter.args[5], 10);
    assert.strictEqual(filter.args[6], 10);
    assert.strictEqual(filter.args[7], 1);
});

QUnit.test('if block - if elseif else', function(assert) {
    var parser = smodules.templateParser(),
        source = '{ if $value1 }' +
                 '<div>value1</div>' +
                 '{ elseif $value2 }' +
                 '<div>value2</div>' +
                 '{ elseif $value3 }' +
                 '<div>value3</div>' +
                 '{ else }' +
                 '<div>value4</div>' +
                 '{ /if }',
        result = parser.parse(source)[0],
        section;

    assert.strictEqual(result.type, 'if');
    assert.strictEqual(result.sections.length, 4);

    section = result.sections[0];
    assert.strictEqual(section.header.type, 'if');
    assert.strictEqual(section.blocks.length, 1);
    assert.strictEqual(section.blocks[0].type, 'normal');
    assert.strictEqual(section.blocks[0].expr, '<div>value1</div>');

    section = result.sections[1];
    assert.strictEqual(section.header.type, 'elseif');
    assert.strictEqual(section.blocks.length, 1);
    assert.strictEqual(section.blocks[0].type, 'normal');
    assert.strictEqual(section.blocks[0].expr, '<div>value2</div>');

    section = result.sections[2];
    assert.strictEqual(section.header.type, 'elseif');
    assert.strictEqual(section.blocks.length, 1);
    assert.strictEqual(section.blocks[0].type, 'normal');
    assert.strictEqual(section.blocks[0].expr, '<div>value3</div>');

    section = result.sections[3];
    assert.strictEqual(section.header.type, 'else');
    assert.strictEqual(section.blocks.length, 1);
    assert.strictEqual(section.blocks[0].type, 'normal');
    assert.strictEqual(section.blocks[0].expr, '<div>value4</div>');
});

QUnit.test('if block - if elseif else - error', function(assert) {
    var parser = smodules.templateParser(), source;

    source = '{if $foo}<p>hoge</p>';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = '{elseif $foo}<p>hoge</p>{/if}';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = '{else}<p>hoge</p>{/if}';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = '{/if}';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = '{if $foo}<p>foo</p>{if $bar}<p>bar</p>{/if}';
    assert.raises(function() {
        parser.parse(source);
    }, Error);
});

QUnit.test('if block - conditions', function(assert) {
    var parser = smodules.templateParser(),
        source, stack;

    source = '{ if $foo === \'hoge\' }<p>hoge</p>{ /if }';
    stack  = parser.parse(source)[0].sections[0].header.stack;
    assert.strictEqual(stack.length, 3);
    assert.strictEqual(stack[0].type, 'var');
    assert.strictEqual(stack[0].keys.join('.'), 'foo');
    assert.strictEqual(stack[1].type, 'value');
    assert.strictEqual(stack[1].value, 'hoge');
    assert.strictEqual(stack[2].type, 'comp');
    assert.strictEqual(stack[2].expr, '===');

    // redundant round brackets
    source = '{ if ( ( $foo === \'hoge\' ) ) }<p>hoge</p>{ /if }';
    stack  = parser.parse(source)[0].sections[0].header.stack;
    assert.strictEqual(stack.length, 3);

    source = '{ if $val1 gt 10 and $val2 gte -1 or $val3 lt 1.0 and $val4 lte -1.0 }<p>ok</p>{ /if }';
    stack  = parser.parse(source)[0].sections[0].header.stack;
    assert.strictEqual(stack.length, 15);
    assert.strictEqual(stack[0].type, 'var');
    assert.strictEqual(stack[0].keys.join('.'), 'val1');
    assert.strictEqual(stack[1].type, 'value');
    assert.strictEqual(stack[1].value, 10);
    assert.strictEqual(stack[2].type, 'comp');
    assert.strictEqual(stack[2].expr, 'gt');
    assert.strictEqual(stack[3].type, 'var');
    assert.strictEqual(stack[3].keys.join('.'), 'val2');
    assert.strictEqual(stack[4].type, 'value');
    assert.strictEqual(stack[4].value, -1);
    assert.strictEqual(stack[5].type, 'comp');
    assert.strictEqual(stack[5].expr, 'gte');
    assert.strictEqual(stack[6].type, 'andor');
    assert.strictEqual(stack[6].expr, 'and');
    assert.strictEqual(stack[7].type, 'var');
    assert.strictEqual(stack[7].keys.join('.'), 'val3');
    assert.strictEqual(stack[8].type, 'value');
    assert.strictEqual(stack[8].value, 1.0);
    assert.strictEqual(stack[9].type, 'comp');
    assert.strictEqual(stack[9].expr, 'lt');
    assert.strictEqual(stack[10].type, 'var');
    assert.strictEqual(stack[10].keys.join('.'), 'val4');
    assert.strictEqual(stack[11].type, 'value');
    assert.strictEqual(stack[11].value, -1.0);
    assert.strictEqual(stack[12].type, 'comp');
    assert.strictEqual(stack[12].expr, 'lte');
    assert.strictEqual(stack[13].type, 'andor');
    assert.strictEqual(stack[13].expr, 'and');
    assert.strictEqual(stack[14].type, 'andor');
    assert.strictEqual(stack[14].expr, 'or');

    // inversion of lval and rval
    source = '{ if 10 !== $price }<p>ok</p>{ /if }';
    stack  = parser.parse(source)[0].sections[0].header.stack;
    assert.strictEqual(stack.length, 3);
    assert.strictEqual(stack[0].type, 'value');
    assert.strictEqual(stack[0].value, 10);
    assert.strictEqual(stack[1].type, 'var');
    assert.strictEqual(stack[1].keys.join('.'), 'price');
    assert.strictEqual(stack[2].type, 'comp');
    assert.strictEqual(stack[2].expr, '!==');

    // priority of and/or
    source = '{ if ( $var1 or $var2 ) and $var3 }<p>ok</p>{ /if }';
    stack  = parser.parse(source)[0].sections[0].header.stack;
    assert.strictEqual(stack.length, 5);
    assert.strictEqual(stack[0].type, 'var');
    assert.strictEqual(stack[0].keys.join('.'), 'var1');
    assert.strictEqual(stack[1].type, 'var');
    assert.strictEqual(stack[1].keys.join('.'), 'var2');
    assert.strictEqual(stack[2].type, 'andor');
    assert.strictEqual(stack[2].expr, 'or');
    assert.strictEqual(stack[3].type, 'var');
    assert.strictEqual(stack[3].keys.join('.'), 'var3');
    assert.strictEqual(stack[4].type, 'andor');
    assert.strictEqual(stack[4].expr, 'and');
});

QUnit.test('if block - conditions - error', function(assert) {
    var parser = smodules.templateParser(), source;

    // roundBracket -> endRoundBracket
    source = '{if () }<p>ok</p>{/if}';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // roundBracket -> comp
    source = '{if ( === $foo )}<p>ok</p>{/if}';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // roundBracket -> andor
    source = '{if ( and $foo )}<p>ok</p>{/if}';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // endRoundBracket -> roundBracket
    source = '{if ( $foo ) ( === $bar )}<p>ok</p>{/if}';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // endRoundBracket -> value
    source = '{if ( $foo ) 10 === $bar}<p>ok</p>{/if}';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // endRoundBracket -> var
    source = '{if ( $foo ) $bar gte 10}<p>ok</p>{/if}';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // endRoundBracket -> comp
    source = '{if ( $foo ) === $bar}<p>ok</p>{/if}';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // value -> roundBracket
    source = '{if 10 ( === $foo )}<p>ok</p>{/if}';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // value -> value
    source = '{if 10 20}<p>ok</p>{/if}';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // value -> var
    source = '{if 10 $foo}<p>ok</p>{/if}';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // var -> roundBracket
    source = '{if $foo ( === $bar )}<p>ok</p>{/if}';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // var -> value
    source = '{if $foo 10}<p>ok</p>{/if}';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // var -> var
    source = '{if $foo $bar}<p>ok</p>{/if}';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // comp -> roundBracket
    source = '{if $foo lte ( $bar ) }<p>ok</p>{/if}';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // comp -> endRoundBracket
    source = '{if ( $foo gte ) $bar}<p>ok</p>{/if}';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // comp -> comp
    source = '{if $foo === === $bar}<p>ok</p>{/if}';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // comp -> andor
    source = '{if $foo !== or $bar}<p>ok</p>{/if}';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // comp -> value -> comp
    source = '{if 10 === 10 === 10}<p>ok</p>{/if}';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // comp -> var -> comp
    source = '{if $foo gt $bar gt $baz}<p>ok</p>{/if}';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // andor -> endRoundBracket
    source = '{if ( $foo or ) $bar}<p>ok</p>{/if}';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // andor -> comp
    source = '{if $foo or === $bar}<p>ok</p>{/if}';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // andor -> andor
    source = '{if $foo or or $bar}<p>ok</p>{/if}';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // lack of endRoundBracket
    source = '{if ( $foo }<p>ok</p>{/if}';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    // lack of roundBracket
    source = '{if ( $foo ) ) }<p>ok</p>{/if}';
    assert.raises(function() {
        parser.parse(source);
    }, Error);
});

QUnit.test('for block', function(assert) {
    var parser = smodules.templateParser(),
        source, block;

    source = '{ for $item in $items }<p>{ $item | h }</p>{ /for }';
    block  = parser.parse(source)[0];
    assert.strictEqual(block.type, 'for');
    assert.strictEqual(block.header.array.join('.'), 'items');
    assert.strictEqual(typeof block.header.k, 'undefined');
    assert.strictEqual(block.header.v, 'item');
    assert.strictEqual(block.blocks.length, 3);

    source = '{ for $idx, $item in $items }<p>{ $item | h }</p>{ /for }';
    block  = parser.parse(source)[0];
    assert.strictEqual(block.header.k, 'idx');
    assert.strictEqual(block.header.v, 'item');
});

QUnit.test('for block - error', function(assert) {
    var parser = smodules.templateParser(), source;

    source = '{for $idx $item in $items}<p>{$item}</p>{/for}';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = '{for $idx , in $items}<p>{$idx}</p>{/for}';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = '{for , $item in $items}<p>{$item}</p>{/for}';
    assert.raises(function() {
        parser.parse(source);
    }, Error);

    source = '{for $idx , $item , $foo in $items}<p>{$item}</p>{/for}';
    assert.raises(function() {
        parser.parse(source);
    }, Error);
});
