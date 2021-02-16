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

### `condition`

- `type` - `string` (= `'condition'`)
- `branches` - `AST_NODE[]` (= `<condition_branch>`)

### `condition_branch`

- `type` - `string` (= `'if'` | `'elseif'` | `'else'`)
- `ctrl` (`type` = `'if'` | `'elseif'`)
  - `stack` - `AST_NODE[]` (= `<var>` | `<value>` | `<andor>` | `<comp>`)
- `children` - `AST_NODE[]` (= `<normal>` | `<literal>` | `<holder>` | `<for>` | `<condition>`)

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

### `for`

- `type` - `string` (= `'for'`)
- `ctrl`
  - [`k`] - `string`
  - `v` - `string`
  - `keys` - `string[]`
- `children` - `AST_NODE[]` (= `<normal>` | `<literal>` | `<holder>` | `<for>` | `<condition>`)

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


## Examples of parsed AST

### Nested conditions

```js
const template = `
{if $item.code === 'xxx'}
  <span>{$item.name|h}</span>
  {if $item.value gt 1000}
  <span>high</span>
  {endif}
{endif}
`;

console.log(JSON.stringify(parser.init().parse(template.trim()), null, 2));
```

```json
[
  {
    "type": "condition",
    "branches": [
      {
        "type": "if",
        "ctrl": {
          "stack": [
            {
              "type": "var",
              "keys": [
                "item",
                "code"
              ],
              "order": 5
            },
            {
              "type": "value",
              "value": "xxx",
              "order": 5
            },
            {
              "type": "comp",
              "expr": "===",
              "order": 4
            }
          ]
        },
        "children": [
          {
            "type": "normal",
            "value": "\n  <span>"
          },
          {
            "type": "holder",
            "keys": [
              "item",
              "name"
            ],
            "filters": [
              {
                "name": "h",
                "args": []
              }
            ]
          },
          {
            "type": "normal",
            "value": "</span>\n  "
          },
          {
            "type": "condition",
            "branches": [
              {
                "type": "if",
                "ctrl": {
                  "stack": [
                    {
                      "type": "var",
                      "keys": [
                        "item",
                        "value"
                      ],
                      "order": 5
                    },
                    {
                      "type": "value",
                      "value": 1000,
                      "order": 5
                    },
                    {
                      "type": "comp",
                      "expr": "gt",
                      "order": 4
                    }
                  ]
                },
                "children": [
                  {
                    "type": "normal",
                    "value": "\n  <span>high</span>\n  "
                  }
                ]
              }
            ]
          },
          {
            "type": "normal",
            "value": "\n"
          }
        ]
      }
    ]
  }
]
```

### Nested conditions

```js
const template = `
{for $item in $items}
<div>{$item.name|h}</div>
<ul>
  {for $index, $name in $item.categories}
  <li>{$index|h}:{$name|h}</li>  
  {endfor}
</ul>
{endfor}
`;

console.log(JSON.stringify(parser.init().parse(template.trim()), null, 2));
```

```json
[
  {
    "type": "for",
    "ctrl": {
      "tmp_v": "item",
      "keys": [
        "items"
      ]
    },
    "children": [
      {
        "type": "normal",
        "value": "\n<div>"
      },
      {
        "type": "holder",
        "keys": [
          "item",
          "name"
        ],
        "filters": [
          {
            "name": "h",
            "args": []
          }
        ]
      },
      {
        "type": "normal",
        "value": "</div>\n<ul>\n  "
      },
      {
        "type": "for",
        "ctrl": {
          "tmp_k": "index",
          "tmp_v": "name",
          "keys": [
            "item",
            "categories"
          ]
        },
        "children": [
          {
            "type": "normal",
            "value": "\n  <li>"
          },
          {
            "type": "holder",
            "keys": [
              "index"
            ],
            "filters": [
              {
                "name": "h",
                "args": []
              }
            ]
          },
          {
            "type": "normal",
            "value": ":"
          },
          {
            "type": "holder",
            "keys": [
              "name"
            ],
            "filters": [
              {
                "name": "h",
                "args": []
              }
            ]
          },
          {
            "type": "normal",
            "value": "</li>  \n  "
          }
        ]
      },
      {
        "type": "normal",
        "value": "\n</ul>\n"
      }
    ]
  }
]
```


## LICENSE

MIT
