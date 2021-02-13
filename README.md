## ABOUT

Includes minimal template engine.


## Tokens


### Variable

- `{$foo}`
- `{$foo|h}`

### Condition

- `{if}` .. `{elseif}` .. `{else}` .. `{endif}`

#### Operators

- `lte`, `lt`, `gte`, `gt`, `===`, `==`, `!==`, `!=`
- `and`, `or`
- `(`, `)`

```
{if ($value1 gt 1000) or ($value2 !== 999)}
...
{elseif $item1.name === $item2.name}
...
{else}
...
{endif}
```

### Iteration

- `{for}` .. `{endfor}`

```
{for $value in $items}
{$value}
{endfor}
```

```
{for $index, $value in $items}
{$index} - {$value}
{endfor}
```

### Delimiter

- `{left}`
- `{right}`

### Literal

- `{literal}` .. `{endliteral}`


## AST

### `var`

- `type` - `string` (= `'var'`)
- `keys` - `string[]`

### `value`

- `type` - `string` (= `'value'`)
- `value` - `null`, `boolean`, `string`, `number`

### `andor`

- `type` - `string` (= `'andor'`)
- `expr` - `string` (= `'and'` | `'or'`)

### `comp`

- `type` - `string` (= `'comp'`)
- `expr` - `string` (= `'lte'` | `'lt'` | `'gte'` | `'gt'` | `'==='` | `'=='` | `'!=='` | `'!='`)

### `roundBracket`

- `type` - `string` (= `'roundBracket'`)

### `endRoundBracket`

- `type` - `string` (= `'endRoundBracket'`)

### `if`

- `type` - `string` (= `'if'`)
- `ctrl`
  - `stack` - `AST_NODE[]` (= `<var>` | `<value>` | `<andor>` | `<comp>`)

### `elseif`

- `type` - `string` (= `'elseif'`)
- `ctrl`
  - `stack` - `AST_NODE[]` (= `<var>` | `<value>` | `<andor>` | `<comp>`)

### `else`

- `type` - `string` (= `'else'`)

### `normal`

- `type` - `string` (= `'normal'`)
- `value` - `string`

### `literal`

- `type` - `string` (= `'literal'`)
- `value` - `string`

### `holder`

- `type` - `string` (= `'holder'`)
- `keys` - `string[]`
- `filters` - `AST_NODE[]` (= `<holder_filter>`)

### `holder_filter`

- `name` - `string`
- `args` - `*[]`

### `for`

- `type` - `string` (= `'for'`)
- `ctrl`
  - [`k`] - `string`
  - `v` - `string`
  - `keys` - `string[]`
- `children` - `AST_NODE[]` (= `<normal>` | `<literal>` | `<holder>` | `<for>` | `<if>`)

### `if` (?)

- `type` - `string` (= `'if'`)
- `sections`


## LICENSE

MIT
