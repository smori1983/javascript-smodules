const ReversePolishNodeHistory = require('./reverse-polish-node-history');
const SourceTextManager = require('./source-text-manager');

const parser = function() {
  const that = {};

  let src;

  /**
   * @type {SourceTextManager}
   */
  let sourceTextManager;

  /**
   * @return {string}
   */
  const getChar = function () {
    return sourceTextManager.getChar();
  };

  const charIs = function (value) {
    return sourceTextManager.charIs(value);
  }

  /**
   * @param {RegExp} regexp
   */
  const charMatch = function (regexp) {
    return sourceTextManager.charMatch(regexp);
  }

  /**
   * @return {number}
   */
  const getLine = function () {
    return sourceTextManager.getLine();
  };

  /**
   * @return {number}
   */
  const getAt = function () {
    return sourceTextManager.getAt();
  };

  const exception = function (message) {
    throw new Error('parser - ' + message + ' in source ' + src + ' [' + getLine() + ',' + getAt() + ']');
  };

  const eatable = function () {
    return sourceTextManager.eatable();
  };

  const next = function (expr) {
    return sourceTextManager.next(expr);
  };

  const skipWhitespace = function () {
    let skipped = '';

    while (charMatch(/\s/)) {
      skipped += next(getChar());
    }

    return skipped;
  };

  // eslint-disable-next-line no-unused-vars
  const read = function(expr) {
    return sourceTextManager.read(expr);
  };

  const readRegex = function (regex) {
    return sourceTextManager.readRegexp(regex);
  };

  const checkRegex = function (regex, errorMessage) {
    if (readRegex(regex) === false) {
      exception(errorMessage);
    }
  };

  const regexMatched = function (regex, errorMessage) {
    return sourceTextManager.regexpMatched(regex, errorMessage);
  };

  const readLeftTag = function () {
    return readRegex(/^{\s*left\s*}/);
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
    return readRegex(/^{\s*right\s*}/);
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
    return readRegex(/^{\s*literal\s*}/);
  };

  const eatLiteralTag = function () {
    next('{');
    skipWhitespace();
    next('literal');
    skipWhitespace();
    next('}');
  };

  const readEndLiteralTag = function () {
    return readRegex(/^{\s*endliteral\s*}/);
  };

  const eatEndLiteralTag = function () {
    next('{');
    skipWhitespace();
    next('endliteral');
    skipWhitespace();
    next('}');
  };

  const readIfTag = function () {
    return readRegex(/^{\s*if\s/);
  };

  const eatIfTag = function () {
    next('{');
    skipWhitespace();
    next('if');
    skipWhitespace();
  };

  const readElseifTag = function () {
    return readRegex(/^{\s*elseif\s/);
  };

  const eatElseifTag = function () {
    next('{');
    skipWhitespace();
    next('elseif');
    skipWhitespace();
  };

  const readElseTag = function () {
    return readRegex(/^{\s*else\s*}/);
  };

  const eatElseTag = function () {
    next('{');
    skipWhitespace();
    next('else');
    skipWhitespace();
    next('}');
  };

  const readEndIfTag = function () {
    return readRegex(/^{\s*endif\s*}/);
  };

  const eatEndIfTag = function () {
    next('{');
    skipWhitespace();
    next('endif');
    skipWhitespace();
    next('}');
  };

  const readForTag = function () {
    return readRegex(/^{\s*for\s/);
  };

  const eatForTag = function () {
    next('{');
    skipWhitespace();
    next('for');
    skipWhitespace();
  };

  const readEndForTag = function () {
    return readRegex(/^{\s*endfor\s*}/);
  };

  const eatEndForTag = function () {
    next('{');
    skipWhitespace();
    next('endfor');
    skipWhitespace();
    next('}');
  };

  const readHolderTag = function () {
    return readRegex(/^{\s*\$/);
  };

  // NOTE: currently not used.
  // eslint-disable-next-line no-unused-vars
  const readTmpVar = function () {
    return readRegex(/^\$\w+[^\w]/);
  };

  const eatTmpVar = function () {
    let s = next('$');

    while (charMatch(/\w/)) {
      s += next(getChar());
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

    while (charMatch(/[\w.]/)) {
      parsed += next(getChar());
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
    return charIs("'") || charIs('"');
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
    return charIs('+') || charIs('-') || charMatch(/[0-9]/);
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
      exception('value should be written');
    }
  };

  const andOrRegex = /^(and|or)[^\w]/;

  const readAndOr = function () {
    return readRegex(andOrRegex);
  };

  const parseAndOr = function () {
    // eslint-disable-next-line quotes
    const matched = regexMatched(andOrRegex, '"and" or "or" should be written');

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
    return charIs('(');
  };

  const parseRoundBracket = function () {
    next('(');

    return {
      type: 'roundBracket',
    };
  };

  const readEndRoundBracket = function () {
    return charIs(')');
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

      const main = function () {
        const history = new ReversePolishNodeHistory();
        let parsed, polish = [], stack = [], stackTop;

        while (eatable()) {
          if (charIs('}')) {
            break;
          }

          // By typeHistory.init(), history has at least 'start' type.
          parsed = parse(history.latest());

          history.add(parsed.type);

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

        history.finish();

        return polish;
      };

      return function () {
        try {
          return main();
        } catch (e) {
          exception(e.message);
        }
      };
    })(); // getReversePolish()

    return function() {
      return {
        stack: getReversePolish(),
      };
    };
  })(); // parseCondition()

  const parseNormalBlock = function () {
    let value = '';

    while (eatable()) {
      if (readLeftTag()) {
        value += eatLeftTag();
      } else if (readRightTag()) {
        value += eatRightTag();
      } else if (charIs('{')) {
        break;
      } else if (charIs('}')) {
        exception('syntax error');
      } else {
        value += next(getChar());
      }
    }

    return {
      type: 'normal',
      value: value,
    };
  };

  const parseLiteralBlock = function () {
    let value = '';
    let closed = false;
    const startLine = getLine();
    const startAt = getAt();

    eatLiteralTag();

    while (eatable()) {
      if (readLeftTag()) {
        value += eatLeftTag();
      } else if (readRightTag()) {
        value += eatRightTag();
      } else if (readEndLiteralTag()) {
        eatEndLiteralTag();
        closed = true;
        break;
      } else {
        value += next(getChar());
      }
    }

    if (closed === false) {
      exception('literal block starts at [' + startLine + ', ' + startAt + '] not closed by {endliteral}');
    }

    return {
      type: 'literal',
      value: value,
    };
  };

  const parseHolderBlock = (function () {
    const getFilterSection = (function () {
      const getFilterNameSection = function () {
        let name = '';

        skipWhitespace();

        while (charMatch(/[\w-]/)) {
          name += next(getChar());
        }

        if (name === '') {
          exception('filter name not found');
        }

        return name;
      };

      const getFilterArgsSection = function () {
        const args = [];

        skipWhitespace();

        if (charIs(':')) {
          next(':');

          while (eatable()) {
            skipWhitespace();

            if (readValue() === false) {
              exception('invalid filter args');
            }

            args.push(parseValue().value);

            skipWhitespace();

            if (charIs(',')) {
              next(',');
            } else if (charIs('|') || charIs('}')) {
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
          if (!charIs('|')) {
            break;
          }

          next('|');

          filters.push({
            name: getFilterNameSection(),
            args: getFilterArgsSection(),
          });

          if (charIs('}')) {
            break;
          } else if (!charIs('|')) {
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
    const parseControlData = function () {
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
        tmp_k: k,
        tmp_v: v,
        keys: array.keys,
      };
    }; // parseHeader()

    return function () {
      const ctrl = parseControlData();
      const blocks = loop([], true);

      eatEndForTag();

      return {
        type: 'for',
        ctrl: ctrl,
        children: blocks,
      };
    };
  })(); // parseForBlock()

  const parseConditionBlock = function () {
    const branches = [];

    while (readIfTag() || readElseifTag() || readElseTag()) {
      let type;
      let ctrl;

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
        ctrl = parseCondition();
        next('}');
      }

      branches.push({
        type: type,
        ctrl: ctrl,
        children: loop([], true),
      });
    }
    eatEndIfTag();

    return {
      type: 'condition',
      branches: branches,
    };
  }; // parseConditionBlock()

  const loop = function(result, inBlock) {
    while (eatable()) {
      if (charIs('{')) {
        if (inBlock && (readElseifTag() || readElseTag() || readEndIfTag() || readEndForTag())) {
          break;
        } else if (readLiteralTag()) {
          result.push(parseLiteralBlock());
        } else if (readIfTag()) {
          result.push(parseConditionBlock());
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
    sourceTextManager = new SourceTextManager(content);

    src  = source || '';

    return loop([]);
  };

  return that;
};

module.exports.init = function () {
  return parser();
};
