## ABOUT

Includes minimal template engine.


## Tokens


### Variable

- `{$foo}`
- `{$foo|h}`

### Condition

- `{if}` .. `{elseif}` .. `{else}` .. `{/if}`

#### Operators

- `lte`, `lt`, `gte`, `gt`, `===`, `==`, `!==`, `!=`
- `and`, `or`
- `(`, `)`

```
{if ($value1 gt 1000) or ($value2 !== 999)}
...
{else}
...
{/if}
```

### Iteration

- `{for}` .. `{/for}`

```
{for $index, $value in $items}
{$index} - {$value}
{/for}
```

### Delimiter

- `{left}`
- `{right}`

### Literal

- `{literal}` .. `{/literal}`


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
- `stack`

### `elseif`

- `type` - `string` (= `'elseif'`)
- `stack`

### `else`

- `type` - `string` (= `'else'`)
- `stack`

### `normal`

- `type` - `string` (= `'normal'`)
- `value` - `string`

### `literal`

- `type` - `string` (= `'literal'`)
- `value` - `string`

### `holder`

- `type` - `string` (= `'holder'`)
- `keys`
- `filters`

### `for`

- `type` - `string` (= `'for'`)
- `header`
- `blocks`

### `if` (?)

- `type` - `string` (= `'if'`)
- `sections`


## LICENSE

MIT
