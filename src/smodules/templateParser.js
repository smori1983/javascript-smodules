const templateParser = function() {
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

    return function(expr) {
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

  var skipWhitespace = function() {
    var skipped = '';

    while (/\s/.test(ch)) {
      skipped += next(ch);
    }

    return skipped;
  };

  var read = function(expr) {
    return text.indexOf(expr, ptr) === ptr;
  };

  var readRegex = function(regex) {
    return regex.test(text.slice(ptr));
  };

  var checkRegex = function(regex, errorMessage) {
    if (readRegex(regex) === false) {
      exception(errorMessage);
    }
  };

  var regexMatched = function(regex, errorMessage) {
    var result = text.slice(ptr).match(regex);

    if (result === null && typeof errorMessage === 'string') {
      exception(errorMessage);
    }

    return result;
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
  };

  var readIfTag = function() {
    return readRegex(/^\{\s*if\s/);
  };

  var eatIfTag = function() {
    next('{');
    skipWhitespace();
    next('if');
    skipWhitespace();
  };

  var readElseifTag = function() {
    return readRegex(/^\{\s*elseif\s/);
  };

  var eatElseifTag = function() {
    next('{');
    skipWhitespace();
    next('elseif');
    skipWhitespace();
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
  };

  var readForTag = function() {
    return readRegex(/^\{\s*for\s/);
  };

  var eatForTag = function() {
    next('{');
    skipWhitespace();
    next('for');
    skipWhitespace();
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
    var parsed = next('$');

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

  var readNull = function() {
    return readRegex(/^null[^\w]/);
  };

  var parseNull = function() {
    next('null');

    return {
      type:  'value',
      value: null,
    };
  };

  var boolRegex = /^(true|false)[^\w]/;

  var readBool = function() {
    return readRegex(boolRegex);
  };

  var parseBool = function() {
    var matched = regexMatched(boolRegex, 'bool should be written');

    next(matched[1]);

    return {
      type:  'value',
      value: matched[1] === 'true',
    };
  };

  var readString = function() {
    // eslint-disable-next-line quotes
    return ch === "'" || ch === '"';
  };

  var parseString = function() {
    var regex = /^(["'])(?:\\\1|\s|\S)*?\1/;
    var matched = regexMatched(regex, 'string expression not closed');

    next(matched[0]);

    return {
      type:  'value',
      value: matched[0].slice(1, -1).replace('\\' + matched[1], matched[1]),
    };
  };

  var readNumber = function() {
    return ch === '+' || ch === '-' || (ch >= '0' && ch <= '9');
  };

  var parseNumber = function() {
    var regex = /^[+-]?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/;
    var matched = regexMatched(regex);
    var value;

    if (matched && !isNaN(value = +(matched[0]))) {
      next(matched[0]);

      return {
        type:  'value',
        value: value,
      };
    } else {
      exception('invalid number expression');
    }
  };

  var readValue = function() {
    return readNull() || readBool() || readString() || readNumber();
  };

  var parseValue = function() {
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

  var andOrRegex = /^(and|or)[^\w]/;

  var readAndOr = function() {
    return readRegex(andOrRegex);
  };

  var parseAndOr = function() {
    // eslint-disable-next-line quotes
    var matched = regexMatched(andOrRegex, "'and' or 'or' should be written");

    next(matched[1]);

    return {
      type: 'andor',
      expr: matched[1],
    };
  };

  var compRegex = /^(?:lte|lt|gte|gt|===|==|!==|!=)/;

  var readComp = function() {
    return readRegex(compRegex);
  };

  var parseComp = function() {
    var matched = regexMatched(compRegex, 'comparer should be written');

    return {
      type: 'comp',
      expr: next(matched[0]),
    };
  };

  var readRoundBracket = function() {
    return ch === '(';
  };

  var parseRoundBracket = function() {
    next('(');

    return {
      type: 'roundBracket',
    };
  };

  var readEndRoundBracket = function() {
    return ch === ')';
  };

  var parseEndRoundBracket = function() {
    next(')');

    return {
      type: 'endRoundBracket',
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
    var expr = '';

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

  var parseLiteralBlock = function() {
    var expr = '';
    var closed = false;
    var startLine = line;
    var startAt = at;

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

  var parseHolderBlock = (function() {
    var getFilterSection = (function() {
      var getFilterNameSection = function() {
        var name = '';

        skipWhitespace();

        while (/[\w-]/.test(ch)) {
          name += next(ch);
        }

        if (name === '') {
          exception('filter name not found');
        }

        return name;
      };

      var getFilterArgsSection = function() {
        var args = [];

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

      return function() {
        var filters = [];

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

    return function() {
      var keySection, filterSection;

      next('{');

      skipWhitespace();

      keySection = parseVar();
      filterSection = getFilterSection();

      next('}');

      return {
        type:    'holder',
        keys:    keySection.keys,
        filters: filterSection.filters,
      };
    };
  })(); // parseHolderBlock()

  var parseForBlock = (function() {
    var parseHeader = function() {
      var k, v, array;

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

module.exports.init = function () {
  return templateParser();
};
