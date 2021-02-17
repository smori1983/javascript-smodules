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
    return sourceTextManager.skipWhitespace();
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

  /**
   * @return {string}
   */
  const openDelimiter = () => {
    return '{';
  };

  /**
   * @return {string}
   */
  const closeDelimiter = () => {
    return '}';
  };

  /**
   * @return {boolean}
   */
  const readLeftTag = () => {
    try {
      processLeftTag(sourceTextManager.lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   * @return {string}
   */
  const eatLeftTag = () => {
    processLeftTag(sourceTextManager);

    return openDelimiter();
  };

  /**
   * @param {TextManager} textManager
   */
  const processLeftTag = (textManager) => {
    textManager.next(openDelimiter());
    textManager.skipWhitespace();
    textManager.next('left');
    textManager.skipWhitespace();
    textManager.next(closeDelimiter());
  };

  /**
   * @return {boolean}
   */
  const readRightTag = () => {
    try {
      processRightTag(sourceTextManager.lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   * @return {string}
   */
  const eatRightTag = () => {
    processRightTag(sourceTextManager);

    return closeDelimiter();
  };

  /**
   * @param {TextManager} textManager
   */
  const processRightTag = (textManager) => {
    textManager.next(openDelimiter());
    textManager.skipWhitespace();
    textManager.next('right');
    textManager.skipWhitespace();
    textManager.next(closeDelimiter());
  };

  /**
   * @return {boolean}
   */
  const readLiteralTag = () => {
    try {
      processLiteralTag(sourceTextManager.lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  const eatLiteralTag = () => {
    processLiteralTag(sourceTextManager);
  };

  /**
   * @param {TextManager} textManager
   */
  const processLiteralTag = (textManager) => {
    textManager.next(openDelimiter());
    textManager.skipWhitespace();
    textManager.next('literal');
    textManager.skipWhitespace();
    textManager.next(closeDelimiter());
  };

  /**
   * @return {boolean}
   */
  const readEndLiteralTag = () => {
    try {
      processEndLiteralTag(sourceTextManager.lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  const eatEndLiteralTag = () => {
    processEndLiteralTag(sourceTextManager);
  };

  /**
   * @param {TextManager} textManager
   */
  const processEndLiteralTag = (textManager) => {
    textManager.next(openDelimiter());
    textManager.skipWhitespace();
    textManager.next('endliteral');
    textManager.skipWhitespace();
    textManager.next(closeDelimiter());
  };

  /**
   * @return {boolean}
   */
  const readIfTag = () => {
    try {
      processIfTag(sourceTextManager.lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  const eatIfTag = () => {
    processIfTag(sourceTextManager);
  };

  /**
   * @param {TextManager} textManager
   */
  const processIfTag = (textManager) => {
    textManager.next(openDelimiter());
    textManager.skipWhitespace();
    textManager.next('if');
    textManager.readRegexp(/^\s+/, true);
    textManager.skipWhitespace();
  };

  /**
   * @return {boolean}
   */
  const readElseifTag = () => {
    try {
      processElseifTag(sourceTextManager.lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  const eatElseifTag = () => {
    processElseifTag(sourceTextManager);
  };

  /**
   * @param {TextManager} textManager
   */
  const processElseifTag = (textManager) => {
    textManager.next(openDelimiter());
    textManager.skipWhitespace();
    textManager.next('elseif');
    textManager.readRegexp(/^\s+/, true);
    textManager.skipWhitespace();
  };

  /**
   * @return {boolean}
   */
  const readElseTag = () => {
    try {
      processElseTag(sourceTextManager.lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  const eatElseTag = () => {
    processElseTag(sourceTextManager);
  };

  /**
   * @param {TextManager} textManager
   */
  const processElseTag = (textManager) => {
    textManager.next(openDelimiter());
    textManager.skipWhitespace();
    textManager.next('else');
    textManager.skipWhitespace();
    textManager.next(closeDelimiter());
  };

  /**
   * @return {boolean}
   */
  const readEndIfTag = () => {
    try {
      processEndIfTag(sourceTextManager.lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  const eatEndIfTag = () => {
    processEndIfTag(sourceTextManager);
  };

  /**
   * @param {TextManager} textManager
   */
  const processEndIfTag = (textManager) => {
    textManager.next(openDelimiter());
    textManager.skipWhitespace();
    textManager.next('endif');
    textManager.skipWhitespace();
    textManager.next(closeDelimiter());
  };

  /**
   * @return {boolean}
   */
  const readForTag = () => {
    try {
      processForTag(sourceTextManager.lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  const eatForTag = () => {
    processForTag(sourceTextManager);
  };

  /**
   * @param {TextManager} textManager
   */
  const processForTag = (textManager) => {
    textManager.next(openDelimiter());
    textManager.skipWhitespace();
    textManager.next('for');
    textManager.readRegexp(/^\s+/, true);
    textManager.skipWhitespace();
  };

  /**
   * @return {boolean}
   */
  const readEndForTag = () => {
    try {
      processEndForTag(sourceTextManager.lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  const eatEndForTag = () => {
    processEndForTag(sourceTextManager);
  };

  /**
   * @param {TextManager} textManager
   */
  const processEndForTag = (textManager) => {
    textManager.next(openDelimiter());
    textManager.skipWhitespace();
    textManager.next('endfor');
    textManager.skipWhitespace();
    textManager.next(closeDelimiter());
  };

  // NOTE: currently not used.
  // eslint-disable-next-line no-unused-vars
  const readTmpVar = function () {
    return readRegex(/^\$\w+[^\w]/);
  };

  /**
   * @return {string}
   */
  const eatTmpVar = () => {
    try {
      return processTmpVar(sourceTextManager);
    } catch (e) {
      exception(e.message);
    }
  };

  /**
   * @param {TextManager} textManager
   * @return {string}
   * @throws {Error}
   */
  const processTmpVar = (textManager) => {
    let s = textManager.next('$');

    while (textManager.charMatch(/\w/)) {
      s += textManager.next(textManager.getChar());
    }

    if (s === '$') {
      throw new Error('tmp variable not found');
    }

    return s.slice(1);
  };

  /**
   * @return {boolean}
   */
  const readVar = () => {
    try {
      processVar(sourceTextManager.lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   * @return {Object}
   */
  const parseVar = () => {
    try {
      const parsed = processVar(sourceTextManager);

      return {
        type: 'var',
        keys: parsed.split('.'),
      };
    } catch (e) {
      exception(e.message);
    }
  };

  /**
   * @param {TextManager} textManager
   * @return {string}
   * @throws {Error}
   */
  const processVar = (textManager) => {
    let parsed = textManager.next('$');

    while (textManager.charMatch(/[\w.]/)) {
      parsed += textManager.next(textManager.getChar());
    }

    if (/^\$$|^\$\.|\.$|\.\./.test(parsed)) {
      throw new Error('invalid variable expression');
    }

    return parsed.slice(1);
  };

  /**
   * @return {boolean}
   */
  const readNull = () => {
    try {
      processNull(sourceTextManager.lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   * @return {Object}
   */
  const parseNull = () => {
    processNull(sourceTextManager);

    return {
      type: 'value',
      value: null,
    };
  };

  /**
   * @param {TextManager} textManager
   */
  const processNull = (textManager) => {
    const regexp = /^(null)[^\w]/;
    const matched = textManager.regexpMatched(regexp, 'null should be written');

    textManager.next(matched[1]);
  };

  /**
   * @return {boolean}
   */
  const readBool = () => {
    try {
      processBool(sourceTextManager.lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   * @return {Object}
   */
  const parseBool = () => {
    const matched = processBool(sourceTextManager);

    return {
      type: 'value',
      value: matched === 'true',
    };
  };

  /**
   * @param {TextManager} textManager
   */
  const processBool = (textManager) => {
    const regexp = /^(true|false)[^\w]/;
    const matched = textManager.regexpMatched(regexp, 'bool should be written');

    textManager.next(matched[1]);

    return matched[1];
  };

  /**
   * @return {boolean}
   */
  const readString = () => {
    try {
      processString(sourceTextManager.lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   * @return {Object}
   */
  const parseString = () => {
    const matched = processString(sourceTextManager);

    return {
      type: 'value',
      value: matched,
    };
  };

  /**
   * @param {TextManager} textManager
   * @return {string}
   */
  const processString = (textManager) => {
    const regexp = /^(["'])(?:\\\1|\s|\S)*?\1/;
    const matched = textManager.regexpMatched(regexp, 'string expression not closed');

    textManager.next(matched[0]);

    return matched[0].slice(1, -1).replace('\\' + matched[1], matched[1]);
  };

  /**
   * @return {boolean}
   */
  const readNumber = () => {
    try {
      processNumber(sourceTextManager.lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   * @return {Object}
   */
  const parseNumber = () => {
    try {
      const value = processNumber(sourceTextManager);

      return {
        type: 'value',
        value: value,
      };
    } catch (e) {
      exception(e.message);
    }
  };

  /**
   * @param {TextManager} textManager
   * @throws {Error}
   */
  const processNumber = (textManager) => {
    const regexp = /^[+-]?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/;
    const matched = textManager.regexpMatched(regexp);
    let value;

    if (matched && !isNaN(value = +(matched[0]))) {
      textManager.next(matched[0]);

      return value;
    } else {
      throw new Error('invalid number expression');
    }
  };

  /**
   * @return {boolean}
   */
  const readValue = () => {
    return readNull() || readBool() || readString() || readNumber();
  };

  const parseValue = () => {
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

  /**
   * @return {boolean}
   */
  const readAndOr = function () {
    try {
      processAndOr(sourceTextManager.lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   * @return {Object}
   */
  const parseAndOr = () => {
    const matched = processAndOr(sourceTextManager);

    return {
      type: 'andor',
      expr: matched,
    };
  };

  /**
   * @param {TextManager} textManager
   * @return {string}
   */
  const processAndOr = (textManager) => {
    const regexp = /^(and|or)[^\w]/;
    const matched = textManager.regexpMatched(regexp, '"and" or "or" should be written');

    textManager.next(matched[1]);

    return matched[1];
  };

  /**
   * @return {boolean}
   */
  const readComp = () => {
    try {
      processComp(sourceTextManager.lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   * @return {Object}
   */
  const parseComp = () => {
    const matched = processComp(sourceTextManager);

    return {
      type: 'comp',
      expr: matched,
    };
  };

  /**
   * @param {TextManager} textManager
   * @return {string}
   */
  const processComp = (textManager) => {
    const regexp = /^(?:lte|lt|gte|gt|===|==|!==|!=)/;
    const matched = textManager.regexpMatched(regexp, 'comparer should be written');

    textManager.next(matched[0]);

    return matched[0];
  }

  /**
   * @return {boolean}
   */
  const readRoundBracket = () => {
    try {
      processRoundBracket(sourceTextManager.lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   * @return {Object}
   */
  const parseRoundBracket = () => {
    processRoundBracket(sourceTextManager);

    return {
      type: 'roundBracket',
    };
  };

  /**
   * @param {TextManager} textManager
   */
  const processRoundBracket = (textManager) => {
    textManager.next('(');
  };

  /**
   * @return {boolean}
   */
  const readEndRoundBracket = () => {
    try {
      processEndRoundBracket(sourceTextManager.lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   * @return {Object}
   */
  const parseEndRoundBracket = () => {
    processEndRoundBracket(sourceTextManager);

    return {
      type: 'endRoundBracket',
    };
  };

  /**
   * @param {TextManager} textManager
   */
  const processEndRoundBracket = (textManager) => {
    textManager.next(')');
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
          if (charIs(closeDelimiter())) {
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
      } else if (charIs(openDelimiter())) {
        break;
      } else if (charIs(closeDelimiter())) {
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
      exception('literal block starts at [' + startLine + ', ' + startAt + '] not closed by ' + openDelimiter() + 'endliteral' + closeDelimiter());
    }

    return {
      type: 'literal',
      value: value,
    };
  };

  /**
   * @return {boolean}
   */
  const readHolderTag = () => {
    try {
      processHolderTag(sourceTextManager.lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   * @param {TextManager} textManager
   */
  const processHolderTag = (textManager) => {
    textManager.next(openDelimiter());
    textManager.skipWhitespace();
    textManager.readRegexp(/^\$/, true);
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
            } else if (charIs('|') || charIs(closeDelimiter())) {
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

          if (charIs(closeDelimiter())) {
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

      next(openDelimiter());

      skipWhitespace();

      keySection = parseVar();
      filterSection = getFilterSection();

      next(closeDelimiter());

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
      next(closeDelimiter());

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
        next(closeDelimiter());
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
      if (charIs(openDelimiter())) {
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
