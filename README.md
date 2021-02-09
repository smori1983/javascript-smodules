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


## LICENSE

MIT
