const templateParser = function() {
  const that = {};
  let src;
  let text;
  let ptr;
  let ch;
  let len;
  let line;
  let at;

  const exception = function (message) {
    throw new Error('smodules.templateParser - ' + message + ' in source ' + src + ' [' + line + ',' + at + ']');
  };

  const eatable = function () {
    return ptr < len;
  };

  const next = (function () {
    const position = function (expr) {
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

    return function (expr) {
      expr = expr || ch;

      if (read(expr) === false) {
        exception('syntax error');
      }

      position(expr);

      ptr += expr.length;
      ch = text.charAt(ptr);

      return expr;
    };
  })();

  const skipWhitespace = function () {
    let skipped = '';

    while (/\s/.test(ch)) {
      skipped += next(ch);
    }

    return skipped;
  };

  const read = function(expr) {
    return text.indexOf(expr, ptr) === ptr;
  };

  const readRegex = function (regex) {
    return regex.test(text.slice(ptr));
  };

  const checkRegex = function (regex, errorMessage) {
    if (readRegex(regex) === false) {
      exception(errorMessage);
    }
  };

  const regexMatched = function (regex, errorMessage) {
    const result = text.slice(ptr).match(regex);

    if (result === null && typeof errorMessage === 'string') {
      exception(errorMessage);
    }

    return result;
  };

  const readLeftTag = function () {
    return readRegex(/^\{\s*left\s*\}/);
  };

  const eatLeftTag = function () {
    next('{');
    skipWhitespace();
    next('left');
    skipWhitespace();
    next('}');

    return '{';
  };

  const readRightTag = function () {
    return readRegex(/^\{\s*right\s*\}/);
  };

  const eatRightTag = function () {
    next('{');
    skipWhitespace();
    next('right');
    skipWhitespace();
    next('}');

    return '}';
  };

  const readLiteralTag = function () {
    return readRegex(/^\{\s*literal\s*\}/);
  };

  const eatLiteralTag = function () {
    next('{');
    skipWhitespace();
    next('literal');
    skipWhitespace();
    next('}');
  };

  const readEndLiteralTag = function () {
    return readRegex(/^\{\s*\/\s*literal\s*\}/);
  };

  const eatEndLiteralTag = function () {
    next('{');
    skipWhitespace();
    next('/');
    skipWhitespace();
    next('literal');
    skipWhitespace();
    next('}');
  };

  const readIfTag = function () {
    return readRegex(/^\{\s*if\s/);
  };

  const eatIfTag = function () {
    next('{');
    skipWhitespace();
    next('if');
    skipWhitespace();
  };

  const readElseifTag = function () {
    return readRegex(/^\{\s*elseif\s/);
  };

  const eatElseifTag = function () {
    next('{');
    skipWhitespace();
    next('elseif');
    skipWhitespace();
  };

  const readElseTag = function () {
    return readRegex(/^\{\s*else\s*\}/);
  };

  const eatElseTag = function () {
    next('{');
    skipWhitespace();
    next('else');
    skipWhitespace();
    next('}');
  };

  const readEndIfTag = function () {
    return readRegex(/^\{\s*\/\s*if\s*\}/);
  };

  const eatEndIfTag = function () {
    next('{');
    skipWhitespace();
    next('/');
    skipWhitespace();
    next('if');
    skipWhitespace();
    next('}');
  };

  const readForTag = function () {
    return readRegex(/^\{\s*for\s/);
  };

  const eatForTag = function () {
    next('{');
    skipWhitespace();
    next('for');
    skipWhitespace();
  };

  const readEndForTag = function () {
    return readRegex(/^\{\s*\/\s*for\s*\}/);
  };

  const eatEndForTag = function () {
    next('{');
    skipWhitespace();
    next('/');
    skipWhitespace();
    next('for');
    skipWhitespace();
    next('}');
  };

  const readHolderTag = function () {
    return readRegex(/^\{\s*\$/);
  };

  // NOTE: currently not used.
  // eslint-disable-next-line no-unused-vars
  const readTmpVar = function () {
    return readRegex(/^\$\w+[^\w]/);
  };

  const eatTmpVar = function () {
    let s = next('$');

    while (/\w/.test(ch)) {
      s += next(ch);
    }

    if (s === '$') {
      exception('tmp variable not found');
    }

    return s.slice(1);
  };

  const readVar = function () {
    return readRegex(/^\$\w+(?:\.\w+)*(?:[^\w]|$)/);
  };

  const parseVar = function () {
    let parsed = next('$');

    while (/[\w.]/.test(ch)) {
      parsed += next(ch);
    }

    if (/^\$$|^\$\.|\.$|\.\./.test(parsed)) {
      exception('invalid variable expression');
    }

    return {
      type: 'var',
      keys: parsed.slice(1).split('.'),
    };
  };

  const readNull = function () {
    return readRegex(/^null[^\w]/);
  };

  const parseNull = function () {
    next('null');

    return {
      type: 'value',
      value: null,
    };
  };

  const boolRegex = /^(true|false)[^\w]/;

  const readBool = function () {
    return readRegex(boolRegex);
  };

  const parseBool = function () {
    const matched = regexMatched(boolRegex, 'bool should be written');

    next(matched[1]);

    return {
      type: 'value',
      value: matched[1] === 'true',
    };
  };

  const readString = function () {
    // eslint-disable-next-line quotes
    return ch === "'" || ch === '"';
  };

  const parseString = function () {
    const regex = /^(["'])(?:\\\1|\s|\S)*?\1/;
    const matched = regexMatched(regex, 'string expression not closed');

    next(matched[0]);

    return {
      type: 'value',
      value: matched[0].slice(1, -1).replace('\\' + matched[1], matched[1]),
    };
  };

  const readNumber = function () {
    return ch === '+' || ch === '-' || (ch >= '0' && ch <= '9');
  };

  const parseNumber = function () {
    const regex = /^[+-]?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/;
    const matched = regexMatched(regex);
    let value;

    if (matched && !isNaN(value = +(matched[0]))) {
      next(matched[0]);

      return {
        type: 'value',
        value: value,
      };
    } else {
      exception('invalid number expression');
    }
  };

  const readValue = function () {
    return readNull() || readBool() || readString() || readNumber();
  };

  const parseValue = function () {
    if (readNull()) {
      return parseNull();
    } else if (readBool()) {
      return parseBool();
    } else if (readString()) {
      return parseString();
    } else if (readNumber()) {
      return parseNumber();
    } else {
      exception('value shoud be written');
    }
  };

  const andOrRegex = /^(and|or)[^\w]/;

  const readAndOr = function () {
    return readRegex(andOrRegex);
  };

  const parseAndOr = function () {
    // eslint-disable-next-line quotes
    const matched = regexMatched(andOrRegex, "'and' or 'or' should be written");

    next(matched[1]);

    return {
      type: 'andor',
      expr: matched[1],
    };
  };

  const compRegex = /^(?:lte|lt|gte|gt|===|==|!==|!=)/;

  const readComp = function () {
    return readRegex(compRegex);
  };

  const parseComp = function () {
    const matched = regexMatched(compRegex, 'comparer should be written');

    return {
      type: 'comp',
      expr: next(matched[0]),
    };
  };

  const readRoundBracket = function () {
    return ch === '(';
  };

  const parseRoundBracket = function () {
    next('(');

    return {
      type: 'roundBracket',
    };
  };

  const readEndRoundBracket = function () {
    return ch === ')';
  };

  const parseEndRoundBracket = function () {
    next(')');

    return {
      type: 'endRoundBracket',
    };
  };

  const parseCondition = (function() {
    const getReversePolish = (function() {
      // 'error' for sentinel.
      /* eslint-disable array-bracket-spacing */
      const state = {
        'start':           ['roundBracket',                    'value', 'var',                  'error'],
        'roundBracket':    ['roundBracket',                    'value', 'var',                  'error'],
        'endRoundBracket': [                'endRoundBracket',                         'andor', 'error'],
        'value':           [                'endRoundBracket',                 'comp', 'andor', 'error'],
        'var':             [                'endRoundBracket',                 'comp', 'andor', 'error'],
        'comp':            [                                   'value', 'var',                  'error'],
        'andor':           ['roundBracket',                    'value', 'var',                  'error'],
      };
      /* eslint-enable */

      const method = {
        'roundBracket':    { read: readRoundBracket,    parse: parseRoundBracket },
        'endRoundBracket': { read: readEndRoundBracket, parse: parseEndRoundBracket },
        'value':           { read: readValue,           parse: parseValue },
        'var':             { read: readVar,             parse: parseVar },
        'comp':            { read: readComp,            parse: parseComp },
        'andor':           { read: readAndOr,           parse: parseAndOr },
      };

      const order = {
        'endRoundBracket': 1,
        'or':              2,
        'and':             3,
        'comp':            4,
        'value':           5,
        'var':             5,
        'roundBracket':    6,
      };

      const getOrder = function (section) {
        // parseAndor() returns section.type with 'andor'.
        // Use section.expr instead.
        return order[section.type] || order[section.expr];
      };

      const parse = function (sourceType) {
        const transitableTypes = state[sourceType];
        let i, size, type, result;

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

      const typeHistory = (function () {
        let history;

        const get = function (index) {
          return history[history.length - index] || null;
        };

        const calcRoundBracketBalance = function () {
          let balance = 0;

          history.forEach(function (type) {
            if (type === 'roundBracket') {
              balance++;
            } else if (type === 'endRoundBracket') {
              balance--;
            }
          });

          return balance;
        };

        const calcOperandOperatorBalance = function () {
          let balance = 0;

          history.forEach(function (type) {
            if (type === 'var' || type === 'value') {
              balance++;
            } else if (type === 'comp' || type === 'andor') {
              balance--;
            }
          });

          return balance;
        };

        return {
          init: function () {
            history = ['start'];
          },
          add: function (type) {
            if (type === 'comp' && get(2) === 'comp') {
              exception('can not write comparer here');
            }

            history.push(type);

            if (calcRoundBracketBalance() < 0) {
              // eslint-disable-next-line quotes
              exception("can not use ')' here");
            }
          },
          latest: function () {
            return get(1);
          },
          finish: function () {
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
        let parsed, polish = [], stack = [], stackTop;

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
      let type, stack = null;

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

  const parseNormalBlock = function () {
    let expr = '';

    while (eatable()) {
      if (readLeftTag()) {
        expr += eatLeftTag();
      } else if (readRightTag()) {
        expr += eatRightTag();
      } else if (ch === '{') {
        break;
      } else if (ch === '}') {
        exception('syntax error');
      } else {
        expr += next(ch);
      }
    }

    return {
      type: 'normal',
      expr: expr,
    };
  };

  const parseLiteralBlock = function () {
    let expr = '';
    let closed = false;
    const startLine = line;
    const startAt = at;

    eatLiteralTag();

    while (eatable()) {
      if (readLeftTag()) {
        expr += eatLeftTag();
      } else if (readRightTag()) {
        expr += eatRightTag();
      } else if (readEndLiteralTag()) {
        eatEndLiteralTag();
        closed = true;
        break;
      } else {
        expr += next(ch);
      }
    }

    if (closed === false) {
      exception('literal block starts at [' + startLine + ', ' + startAt + '] not closed by {/literal}');
    }

    return {
      type: 'literal',
      expr: expr,
    };
  };

  const parseHolderBlock = (function () {
    const getFilterSection = (function () {
      const getFilterNameSection = function () {
        let name = '';

        skipWhitespace();

        while (/[\w-]/.test(ch)) {
          name += next(ch);
        }

        if (name === '') {
          exception('filter name not found');
        }

        return name;
      };

      const getFilterArgsSection = function () {
        const args = [];

        skipWhitespace();

        if (ch === ':') {
          next(':');

          while (eatable()) {
            skipWhitespace();

            if (readValue() === false) {
              exception('invalid filter args');
            }

            args.push(parseValue().value);

            skipWhitespace();

            if (ch === ',') {
              next(',');
            } else if (ch === '|' || ch === '}') {
              break;
            } else {
              exception('invalid filter args expression');
            }
          }
        }

        return args;
      };

      return function () {
        const filters = [];

        skipWhitespace();

        while (eatable()) {
          if (ch !== '|') {
            break;
          }

          next('|');

          filters.push({
            name: getFilterNameSection(),
            args: getFilterArgsSection(),
          });

          if (ch === '}') {
            break;
          } else if (ch !== '|') {
            exception('syntax error');
          }
        }

        return {
          filters: filters,
        };
      };
    })(); // getFilterSection()

    return function () {
      let keySection, filterSection;

      next('{');

      skipWhitespace();

      keySection = parseVar();
      filterSection = getFilterSection();

      next('}');

      return {
        type: 'holder',
        keys: keySection.keys,
        filters: filterSection.filters,
      };
    };
  })(); // parseHolderBlock()

  const parseForBlock = (function () {
    const parseHeader = function () {
      let k, v, array;

      eatForTag();

      v = eatTmpVar();

      if (readRegex(/^\s*,\s*/)) {
        skipWhitespace();
        next(',');
        skipWhitespace();
        k = v;
        v = eatTmpVar();
      }

      checkRegex(/^\s+in\s+/, 'invalid for expression');
      skipWhitespace();
      next('in');
      skipWhitespace();

      array = parseVar();

      skipWhitespace();
      next('}');

      return {
        k: k,
        v: v,
        array: array.keys,
      };
    }; // parseHeader()

    return function () {
      const header = parseHeader();
      const blocks = loop([], true);

      eatEndForTag();

      return {
        type: 'for',
        header: header,
        blocks: blocks,
      };
    };
  })(); // parseForBlock()

  const parseIfBlock = function () {
    const sections = [];

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

  const loop = function(result, inBlock) {
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

module.exports.init = function () {
  return templateParser();
};
