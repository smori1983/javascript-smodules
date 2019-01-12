smodules.templateParser = function() {
  var that = {};
  var src;
  var text;
  var ptr;
  var ch;
  var len;
  var line;
  var at;

  var exception = function(message) {
    throw new Error('smodules.templateParser - ' + message + ' in source ' + src + ' [' + line + ',' + at + ']');
  };

  var eatable = function() {
    return ptr < len;
  };

  var next = (function() {
    var position = function(expr) {
      while (expr.length > 0) {
        if (expr.slice(0, 1) === '\n') {
          line++;
          at = 1;
        } else {
          at++;
        }
        expr = expr.slice(1);
      }
    };

    return function(expr, replace) {
      expr = expr || ch;

      if (text.indexOf(expr, ptr) !== ptr) {
        exception('syntax error');
      }

      position(expr);

      ptr += expr.length;
      ch = text.charAt(ptr);

      return replace || expr;
    };
  })();

  var skipWhitespace = function() {
    var s = '';

    while (/\s/.test(ch)) {
      s += next(ch);
    }

    return s;
  };

  var read = function(expr) {
    return text.indexOf(expr, ptr) === ptr;
  };

  var readRegex = function(regex) {
    return regex.test(text.slice(ptr));
  };

  var regexMatched = function(regex) {
    return text.slice(ptr).match(regex);
  };

  var readLeftTag = function() {
    return readRegex(/^\{\s*left\s*\}/);
  };

  var eatLeftTag = function() {
    next('{');
    skipWhitespace();
    next('left');
    skipWhitespace();
    next('}');

    return '{';
  };

  var readRightTag = function() {
    return readRegex(/^\{\s*right\s*\}/);
  };

  var eatRightTag = function() {
    next('{');
    skipWhitespace();
    next('right');
    skipWhitespace();
    next('}');

    return '}';
  };

  var readLiteralTag = function() {
    return readRegex(/^\{\s*literal\s*\}/);
  };

  var eatLiteralTag = function() {
    next('{');
    skipWhitespace();
    next('literal');
    skipWhitespace();
    next('}');

    return '{literal}';
  };

  var readEndLiteralTag = function() {
    return readRegex(/^\{\s*\/\s*literal\s*\}/);
  };

  var eatEndLiteralTag = function() {
    next('{');
    skipWhitespace();
    next('/');
    skipWhitespace();
    next('literal');
    skipWhitespace();
    next('}');

    return '{/literal}';
  };

  var readIfTag = function() {
    return readRegex(/^\{\s*if\s/);
  };

  var eatIfTag = function() {
    next('{');
    skipWhitespace();
    next('if');
    skipWhitespace();

    return '{if ';
  };

  var readElseifTag = function() {
    return readRegex(/^\{\s*elseif\s/);
  };

  var eatElseifTag = function() {
    next('{');
    skipWhitespace();
    next('elseif');
    skipWhitespace();

    return '{elseif ';
  };

  var readElseTag = function() {
    return readRegex(/^\{\s*else\s*\}/);
  };

  var eatElseTag = function() {
    next('{');
    skipWhitespace();
    next('else');
    skipWhitespace();
    next('}');

    return '{else}';
  };

  var readEndIfTag = function() {
    return readRegex(/^\{\s*\/\s*if\s*\}/);
  };

  var eatEndIfTag = function() {
    next('{');
    skipWhitespace();
    next('/');
    skipWhitespace();
    next('if');
    skipWhitespace();
    next('}');

    return '{/if}';
  };

  var readForTag = function() {
    return readRegex(/^\{\s*for\s/);
  };

  var eatForTag = function() {
    next('{');
    skipWhitespace();
    next('for');
    skipWhitespace();

    return '{for ';
  };

  var readEndForTag = function() {
    return readRegex(/^\{\s*\/\s*for\s*\}/);
  };

  var eatEndForTag = function() {
    next('{');
    skipWhitespace();
    next('/');
    skipWhitespace();
    next('for');
    skipWhitespace();
    next('}');

    return '{/for}';
  };

  var readHolderTag = function() {
    return readRegex(/^\{\s*\$/);
  };

  // NOTE: currently not used.
  // eslint-disable-next-line no-unused-vars
  var readTmpVar = function() {
    return readRegex(/^\$\w+[^\w]/);
  };

  var eatTmpVar = function() {
    var s = next('$');

    while (/\w/.test(ch)) {
      s += next(ch);
    }

    if (s === '$') {
      exception('tmp variable not found');
    }

    return s.slice(1);
  };

  var readVar = function() {
    return readRegex(/^\$\w+(?:\.\w+)*(?:[^\w]|$)/);
  };

  var parseVar = function() {
    var s = next('$');

    while (/[\w.]/.test(ch)) {
      s += next(ch);
    }

    if (s === '$') {
      exception('variable not found');
    } else if (/^\$\.|\.$|\.\./.test(s)) {
      exception('invalid variable expression');
    }

    return {
      type: 'var',
      expr: s,
      keys: s.slice(1).split('.'),
    };
  };

  var readNull = function() {
    return readRegex(/^null[^\w]/);
  };

  var parseNull = function() {
    return {
      type:  'value',
      expr:  next('null'),
      value: null,
    };
  };

  var readTrue = function() {
    return readRegex(/^true[^\w]/);
  };

  var parseTrue = function() {
    return {
      type:  'value',
      expr:  next('true'),
      value: true,
    };
  };

  var readFalse = function() {
    return readRegex(/^false[^\w]/);
  };

  var parseFalse = function() {
    return {
      type:  'value',
      expr:  next('false'),
      value: false,
    };
  };

  var readString = function() {
    // eslint-disable-next-line quotes
    return ch === "'" || ch === '"';
  };

  var parseString = function() {
    var matched = regexMatched(/^(["'])(?:\\\1|\s|\S)*?\1/);

    if (matched) {
      next(matched[0]);

      return {
        type:  'value',
        expr:  matched[0],
        value: matched[0].slice(1, -1).replace('\\' + matched[1], matched[1]),
      };
    } else {
      exception('string expression not closed');
    }
  };

  var readNumber = function() {
    return ch === '+' || ch === '-' || (ch >= '0' && ch <= '9');
  };

  var parseNumber = function() {
    var matched = regexMatched(/^[+-]?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/);
    var value;

    if (matched && !isNaN(value = +(matched[0]))) {
      next(matched[0]);

      return {
        type:  'value',
        expr:  matched[0],
        value: value,
      };
    } else {
      exception('invalid number expression');
    }
  };

  var readValue = function() {
    return readNull() || readTrue() || readFalse() || readString() || readNumber();
  };

  var parseValue = function() {
    if (readNull()) {
      return parseNull();
    } else if (readTrue()) {
      return parseTrue();
    } else if (readFalse()) {
      return parseFalse();
    } else if (readString()) {
      return parseString();
    } else if (readNumber()) {
      return parseNumber();
    } else {
      exception('value shoud be written');
    }
  };

  var readAndOr = function() {
    return readRegex(/^(and|or)[^\w]/);
  };

  var parseAndOr = function() {
    var expr;

    if (read('and')) {
      expr = next('and');
    } else if (read('or')) {
      expr = next('or');
    } else {
      // eslint-disable-next-line quotes
      exception("'and' or 'or' should be written");
    }

    return {
      type: 'andor',
      expr: expr,
    };
  };

  var compRegex = /^(?:lte|lt|gte|gt|===|==|!==|!=)/;

  var readComp = function() {
    return readRegex(compRegex);
  };

  var parseComp = function() {
    var matched = regexMatched(compRegex);

    if (matched === null) {
      exception('comparer should be written');
    }

    return {
      type: 'comp',
      expr: next(matched[0]),
    };
  };

  var readRoundBracket = function() {
    return ch === '(';
  };

  var parseRoundBracket = function() {
    return {
      type: 'roundBracket',
      expr: next('('),
    };
  };

  var readEndRoundBracket = function() {
    return ch === ')';
  };

  var parseEndRoundBracket = function() {
    return {
      type: 'endRoundBracket',
      expr: next(')'),
    };
  };

  var parseCondition = (function() {
    var getReversePolish = (function() {
      // 'error' for sentinel.
      /* eslint-disable array-bracket-spacing */
      var state = {
        'start':           ['roundBracket',                    'value', 'var',                  'error'],
        'roundBracket':    ['roundBracket',                    'value', 'var',                  'error'],
        'endRoundBracket': [                'endRoundBracket',                         'andor', 'error'],
        'value':           [                'endRoundBracket',                 'comp', 'andor', 'error'],
        'var':             [                'endRoundBracket',                 'comp', 'andor', 'error'],
        'comp':            [                                   'value', 'var',                  'error'],
        'andor':           ['roundBracket',                    'value', 'var',                  'error'],
      };
      /* eslint-enable */

      var method = {
        'roundBracket':    { read: readRoundBracket,    parse: parseRoundBracket },
        'endRoundBracket': { read: readEndRoundBracket, parse: parseEndRoundBracket },
        'value':           { read: readValue,           parse: parseValue },
        'var':             { read: readVar,             parse: parseVar },
        'comp':            { read: readComp,            parse: parseComp },
        'andor':           { read: readAndOr,           parse: parseAndOr },
      };

      var order = {
        'endRoundBracket': 1,
        'or':              2,
        'and':             3,
        'comp':            4,
        'value':           5,
        'var':             5,
        'roundBracket':    6,
      };

      var getOrder = function(section) {
        // parseAndor() returns section.type with 'andor'.
        // Use section.expr instead.
        return order[section.type] || order[section.expr];
      };

      var parse = function(sourceType) {
        var transitableTypes = state[sourceType];
        var i, size, type, result;

        for (i = 0, size = transitableTypes.length; i < size; i++) {
          type = transitableTypes[i];

          if (type === 'error') {
            exception('invalid condition expression');
          }

          if (method[type].read()) {
            result = method[type].parse();
            result.order = getOrder(result);

            return result;
          }
        }
      };

      var typeHistory = (function() {
        var history;

        var get = function(index) {
          return history[history.length - index] || null;
        };

        var calcRoundBracketBalance = function() {
          var balance = 0;

          history.forEach(function(type) {
            if (type === 'roundBracket') {
              balance++;
            } else if (type === 'endRoundBracket') {
              balance--;
            }
          });

          return balance;
        };

        var calcOperandOperatorBalance = function() {
          var balance = 0;

          history.forEach(function(type) {
            if (type === 'var' || type === 'value') {
              balance++;
            } else if (type === 'comp' || type === 'andor') {
              balance--;
            }
          });

          return balance;
        };

        return {
          init: function() {
            history = ['start'];
          },
          add: function(type) {
            if (type === 'comp' && get(2) === 'comp') {
              exception('can not write comparer here');
            }

            history.push(type);

            if (calcRoundBracketBalance() < 0) {
              // eslint-disable-next-line quotes
              exception("can not use ')' here");
            }
          },
          latest: function() {
            return get(1);
          },
          finish: function() {
            if (calcRoundBracketBalance() !== 0) {
              exception('invalid usage of round bracket');
            }
            if (calcOperandOperatorBalance() !== 1) {
              exception('invalid usage of operand or operator');
            }
          },
        };
      })();

      return function() {
        var parsed, polish = [], stack = [], stackTop;

        typeHistory.init();

        while (eatable()) {
          if (ch === '}') {
            break;
          }

          // By typeHistory.init(), history has at least 'start' type.
          parsed = parse(typeHistory.latest());

          typeHistory.add(parsed.type);

          while (stack.length > 0) {
            stackTop = stack.pop();

            if (parsed.order <= stackTop.order && stackTop.type !== 'roundBracket') {
              polish.push(stackTop);
            } else {
              stack.push(stackTop);
              break;
            }
          }

          if (parsed.type === 'endRoundBracket') {
            stack.pop();
          } else {
            stack.push(parsed);
          }

          skipWhitespace();
        }

        while (stack.length > 0) {
          polish.push(stack.pop());
        }

        typeHistory.finish();

        return polish;
      };
    })(); // getReversePolish()

    return function() {
      var type, stack = null;

      if (readIfTag()) {
        eatIfTag();
        type = 'if';
      } else if (readElseifTag()) {
        eatElseifTag();
        type = 'elseif';
      } else if (readElseTag()) {
        eatElseTag();
        type = 'else';
      } else {
        exception('unknown condition expression');
      }

      if (type === 'if' || type === 'elseif') {
        stack = getReversePolish();
        next('}');
      }

      return {
        type:  type,
        stack: stack,
      };
    };
  })(); // parseCondition()

  var parseNormalBlock = function() {
    var s = '';

    while (eatable()) {
      if (readLeftTag()) {
        s += eatLeftTag();
      } else if (readRightTag()) {
        s += eatRightTag();
      } else if (ch === '{') {
        break;
      } else if (ch === '}') {
        exception('syntax error');
      } else {
        s += next(ch);
      }
    }

    return {
      type: 'normal',
      expr: s,
    };
  };

  var parseLiteralBlock = function() {
    var s = '';
    var closed = false;
    var startLine = line;
    var startAt = at;

    eatLiteralTag();

    while (eatable()) {
      if (readLeftTag()) {
        s += eatLeftTag();
      } else if (readRightTag()) {
        s += eatRightTag();
      } else if (readEndLiteralTag()) {
        eatEndLiteralTag();
        closed = true;
        break;
      } else {
        s += next(ch);
      }
    }

    if (closed === false) {
      exception('literal block starts at [' + startLine + ', ' + startAt + '] not closed by {/literal}');
    }

    return {
      type: 'literal',
      expr: s,
    };
  };

  var parseHolderBlock = (function() {
    var getFilterSection = (function() {
      var getFilterNameSection = function() {
        var s = '';

        skipWhitespace();

        while (/[\w-]/.test(ch)) {
          s += next(ch);
        }

        if (s === '') {
          exception('filter name not found');
        }

        return {
          expr: s,
          name: s,
        };
      };

      var getFilterArgsSection = function() {
        var s = '';
        var args = [];
        var arg;

        skipWhitespace();

        if (ch === ':') {
          s += next(':');

          while (eatable()) {
            skipWhitespace();

            if (readValue()) {
              arg = parseValue();
            } else {
              exception('invalid filter args');
            }

            s += arg.expr;
            args.push(arg.value);

            skipWhitespace();

            if (ch === ',') {
              s += next(',');
            } else if (ch === '|' || ch === '}') {
              break;
            } else {
              exception('invalid filter args expression');
            }
          }
        }

        return {
          expr: s,
          args: args,
        };
      }; // getFilterArgsSection()

      return function() {
        var expr = '';
        var filters = [];
        var nameSection, argsSection;

        skipWhitespace();

        while (eatable()) {
          if (ch !== '|') {
            break;
          }

          expr += next('|');

          nameSection = getFilterNameSection();
          argsSection = getFilterArgsSection();

          expr += nameSection.expr;
          expr += argsSection.expr;

          filters.push({
            name: nameSection.name,
            args: argsSection.args,
          });

          if (ch === '}') {
            break;
          } else if (ch !== '|') {
            exception('syntax error');
          }
        }

        return {
          expr:    expr,
          filters: filters,
        };
      };
    })(); // getFilterSection()

    return function() {
      var expr = '';
      var keySection, filterSection;

      expr += next('{');

      skipWhitespace();

      keySection = parseVar();
      filterSection = getFilterSection();

      expr += keySection.expr;
      expr += filterSection.expr;
      expr += next('}');

      return {
        type:    'holder',
        expr:    expr,
        keys:    keySection.keys,
        filters: filterSection.filters,
      };
    };
  })(); // parseHolderBlock()

  var parseForBlock = (function() {
    var parseHeader = function() {
      var s = eatForTag()
      var k, v, array;

      v = eatTmpVar();
      s += v;
      skipWhitespace();

      if (ch === ',') {
        k = v;
        s += next(',');

        skipWhitespace();
        v = eatTmpVar();
        s += v;
        skipWhitespace();
      }

      s += ' ';
      if (!readRegex(/^in\s/)) {
        exception('invalid for expression');
      }
      s += next('in');
      skipWhitespace();
      s += ' ';

      array = parseVar();
      s += array.expr;
      skipWhitespace();

      s += next('}');

      return {
        expr:  s,
        k:     k,
        v:     v,
        array: array.keys,
      };
    }; // parseHeader()

    return function() {
      var header = parseHeader();
      var blocks = loop([], true);

      eatEndForTag();

      return {
        type:   'for',
        header: header,
        blocks: blocks,
      };
    };
  })(); // parseForBlock()

  var parseIfBlock = function() {
    var sections = [];

    while (readIfTag() || readElseifTag() || readElseTag()) {
      sections.push({
        header: parseCondition(),
        blocks: loop([], true),
      });
    }
    eatEndIfTag();

    return {
      type:     'if',
      sections: sections,
    };
  }; // parseIfBlock()

  var loop = function(result, inBlock) {
    while (eatable()) {
      if (ch === '{') {
        if (inBlock && (readElseifTag() || readElseTag() || readEndIfTag() || readEndForTag())) {
          break;
        } else if (readLiteralTag()) {
          result.push(parseLiteralBlock());
        } else if (readIfTag()) {
          result.push(parseIfBlock());
        } else if (readForTag()) {
          result.push(parseForBlock());
        } else if (readHolderTag()) {
          result.push(parseHolderBlock());
        } else {
          exception('unknown tag');
        }
      } else {
        result.push(parseNormalBlock());
      }
    }

    return result;
  };


  that.parse = function(content, source) {
    src  = source || '';
    text = content;
    ptr  = 0;
    ch   = content.charAt(0);
    len  = content.length;
    line = 1;
    at   = 1;

    return loop([]);
  };

  return that;
};
