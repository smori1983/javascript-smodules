const Ast = require('./ast');
const ReversePolishNodeHistory = require('./reverse-polish-node-history');
const ParseConfig = require('./parse-config');
const ParseContext = require('./parse-context');
const SourceTextManager = require('./source-text-manager');

const parser = () => {
  const that = {};

  /**
   * @type {ParseContext}
   */
  let context;

  /**
   * @return {boolean}
   */
  const readCloseTag = () => {
    try {
      processCloseTag(context.config(), context.sourceTextManager().lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   * @return {Object}
   */
  const parseCloseTag = () => {
    processCloseTag(context.config(), context.sourceTextManager());

    return {
      type: 'delimiter_close',
      expr: context.config().closeDelimiter(),
    }
  };

  /**
   * @param {ParseConfig} config
   * @param {TextManager} tm
   */
  const processCloseTag = (config, tm) => {
    tm.next(config.openDelimiter());
    tm.skipWhitespace();
    tm.next('close');
    tm.skipWhitespace();
    tm.next(config.closeDelimiter());
  };

  /**
   * @return {boolean}
   */
  const readLiteralTag = () => {
    try {
      processLiteralTag(context.config(), context.sourceTextManager().lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   * @return {Object}
   */
  const parseLiteralTag = () => {
    processLiteralTag(context.config(), context.sourceTextManager());

    return {
      type: 'literal_open',
    }
  };

  /**
   * @param {ParseConfig} config
   * @param {TextManager} tm
   */
  const processLiteralTag = (config, tm) => {
    tm.next(config.openDelimiter());
    tm.skipWhitespace();
    tm.next('literal');
    tm.skipWhitespace();
    tm.next(config.closeDelimiter());
  };

  /**
   * @return {boolean}
   */
  const readEndLiteralTag = () => {
    try {
      processEndLiteralTag(context.config(), context.sourceTextManager().lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   * @return {Object}
   */
  const parseEndLiteralTag = () => {
    processEndLiteralTag(context. config(), context.sourceTextManager());

    return {
      type: 'literal_close',
    };
  };

  /**
   * @param {ParseConfig} config
   * @param {TextManager} tm
   */
  const processEndLiteralTag = (config, tm) => {
    tm.next(config.openDelimiter());
    tm.skipWhitespace();
    tm.next('endliteral');
    tm.skipWhitespace();
    tm.next(config.closeDelimiter());
  };

  /**
   * @return {boolean}
   */
  const readIfTag = () => {
    try {
      processIfTag(context.config(), context.sourceTextManager().lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   * @return {Object}
   */
  const parseIfTag = () => {
    processIfTag(context.config(), context.sourceTextManager());

    const ctrl = parseConditionBody();
    context.sourceTextManager().next(context.config().closeDelimiter());
    const children = loop([], true);

    return {
      type: 'if',
      ctrl: ctrl,
      children: children,
    };
  };

  /**
   * @param {ParseConfig} config
   * @param {TextManager} tm
   */
  const processIfTag = (config, tm) => {
    tm.next(config.openDelimiter());
    tm.skipWhitespace();
    tm.next('if');
    tm.readRegexp(/^\s+/, true);
    tm.skipWhitespace();
  };

  /**
   * @return {boolean}
   */
  const readElseifTag = () => {
    try {
      processElseifTag(context.config(), context.sourceTextManager().lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   * @return {Object}
   */
  const parseElseifTag = () => {
    processElseifTag(context.config(), context.sourceTextManager());

    const ctrl = parseConditionBody();
    context.sourceTextManager().next(context.config().closeDelimiter());
    const children = loop([], true);

    return {
      type: 'elseif',
      ctrl: ctrl,
      children: children,
    };
  };

  /**
   * @param {ParseConfig} config
   * @param {TextManager} tm
   */
  const processElseifTag = (config, tm) => {
    tm.next(config.openDelimiter());
    tm.skipWhitespace();
    tm.next('elseif');
    tm.readRegexp(/^\s+/, true);
    tm.skipWhitespace();
  };

  /**
   * @return {boolean}
   */
  const readElseTag = () => {
    try {
      processElseTag(context.config(), context.sourceTextManager().lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   * @return {Object}
   */
  const parseElseTag = () => {
    processElseTag(context.config(), context.sourceTextManager());

    const children = loop([], true);

    return {
      type: 'else',
      children: children,
    };
  };

  /**
   * @param {ParseConfig} config
   * @param {TextManager} tm
   */
  const processElseTag = (config, tm) => {
    tm.next(config.openDelimiter());
    tm.skipWhitespace();
    tm.next('else');
    tm.skipWhitespace();
    tm.next(config.closeDelimiter());
  };

  /**
   * @return {boolean}
   */
  const readEndIfTag = () => {
    try {
      processEndIfTag(context.config(), context.sourceTextManager().lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   * @return {Object}
   */
  const parseEndIfTag = () => {
    processEndIfTag(context.config(), context.sourceTextManager());

    return {
      type: 'endif',
    };
  };

  /**
   * @param {ParseConfig} config
   * @param {TextManager} tm
   */
  const processEndIfTag = (config, tm) => {
    tm.next(config.openDelimiter());
    tm.skipWhitespace();
    tm.next('endif');
    tm.skipWhitespace();
    tm.next(config.closeDelimiter());
  };

  /**
   * @return {boolean}
   */
  const readForTag = () => {
    try {
      processForTag(context.config(), context.sourceTextManager().lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   * @return {Object}
   */
  const parseForTag = () => {
    processForTag(context.config(), context.sourceTextManager());

    return {
      type: 'for',
    }
  };

  /**
   * @param {ParseConfig} config
   * @param {TextManager} tm
   */
  const processForTag = (config, tm) => {
    tm.next(config.openDelimiter());
    tm.skipWhitespace();
    tm.next('for');
    tm.readRegexp(/^\s+/, true);
    tm.skipWhitespace();
  };

  /**
   * @return {boolean}
   */
  const readEndForTag = () => {
    try {
      processEndForTag(context.config(), context.sourceTextManager().lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   * @return {Object}
   */
  const parseEndForTag = () => {
    processEndForTag(context.config(), context.sourceTextManager());

    return {
      type: 'endfor',
    };
  };

  /**
   * @param {ParseConfig} config
   * @param {TextManager} tm
   */
  const processEndForTag = (config, tm) => {
    tm.next(config.openDelimiter());
    tm.skipWhitespace();
    tm.next('endfor');
    tm.skipWhitespace();
    tm.next(config.closeDelimiter());
  };

  /**
   * @return {Object}
   */
  const parseTmpVar = () => {
    try {
      const expr = processTmpVar(context.sourceTextManager());

      return {
        type: 'temp_var',
        expr: expr,
      };
    } catch (e) {
      context.exception(e.message);
    }
  };

  /**
   * @param {TextManager} tm
   * @return {string}
   * @throws {Error}
   */
  const processTmpVar = (tm) => {
    let s = tm.next('$');

    while (tm.charMatch(/\w/)) {
      s += tm.next(tm.getChar());
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
      processVar(context.sourceTextManager().lookaheadTextManager());

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
      const parsed = processVar(context.sourceTextManager());

      return {
        type: 'var',
        keys: parsed.split('.'),
      };
    } catch (e) {
      context.exception(e.message);
    }
  };

  /**
   * @param {TextManager} tm
   * @return {string}
   * @throws {Error}
   */
  const processVar = (tm) => {
    let parsed = tm.next('$');

    while (tm.charMatch(/[\w.]/)) {
      parsed += tm.next(tm.getChar());
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
      processNull(context.sourceTextManager().lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   * @return {Object}
   */
  const parseNull = () => {
    processNull(context.sourceTextManager());

    return {
      type: 'value',
      value: null,
    };
  };

  /**
   * @param {TextManager} tm
   */
  const processNull = (tm) => {
    const regexp = /^(null)[^\w]/;
    const matched = tm.regexpMatched(regexp, 'null should be written');

    tm.next(matched[1]);
  };

  /**
   * @return {boolean}
   */
  const readBool = () => {
    try {
      processBool(context.sourceTextManager().lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   * @return {Object}
   */
  const parseBool = () => {
    const matched = processBool(context.sourceTextManager());

    return {
      type: 'value',
      value: matched === 'true',
    };
  };

  /**
   * @param {TextManager} tm
   */
  const processBool = (tm) => {
    const regexp = /^(true|false)[^\w]/;
    const matched = tm.regexpMatched(regexp, 'bool should be written');

    tm.next(matched[1]);

    return matched[1];
  };

  /**
   * @return {boolean}
   */
  const readString = () => {
    try {
      processString(context.sourceTextManager().lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   * @return {Object}
   */
  const parseString = () => {
    const matched = processString(context.sourceTextManager());

    return {
      type: 'value',
      value: matched,
    };
  };

  /**
   * @param {TextManager} tm
   * @return {string}
   */
  const processString = (tm) => {
    const regexp = /^(["'])(?:\\\1|\s|\S)*?\1/;
    const matched = tm.regexpMatched(regexp, 'string expression not closed');

    tm.next(matched[0]);

    return matched[0].slice(1, -1).replace('\\' + matched[1], matched[1]);
  };

  /**
   * @return {boolean}
   */
  const readNumber = () => {
    try {
      processNumber(context.sourceTextManager().lookaheadTextManager());

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
      const value = processNumber(context.sourceTextManager());

      return {
        type: 'value',
        value: value,
      };
    } catch (e) {
      context.exception(e.message);
    }
  };

  /**
   * @param {TextManager} tm
   * @throws {Error}
   */
  const processNumber = (tm) => {
    const regexp = /^[+-]?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/;
    const matched = tm.regexpMatched(regexp);
    let value;

    if (matched && !isNaN(value = +(matched[0]))) {
      tm.next(matched[0]);

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
      context.exception('value should be written');
    }
  };

  /**
   * @return {boolean}
   */
  const readAndOr = () => {
    try {
      processAndOr(context.sourceTextManager().lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   * @return {Object}
   */
  const parseAndOr = () => {
    const matched = processAndOr(context.sourceTextManager());

    return {
      type: 'andor',
      expr: matched,
    };
  };

  /**
   * @param {TextManager} tm
   * @return {string}
   */
  const processAndOr = (tm) => {
    const regexp = /^(and|or)[^\w]/;
    const matched = tm.regexpMatched(regexp, '"and" or "or" should be written');

    tm.next(matched[1]);

    return matched[1];
  };

  /**
   * @return {boolean}
   */
  const readComp = () => {
    try {
      processComp(context.sourceTextManager().lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   * @return {Object}
   */
  const parseComp = () => {
    const matched = processComp(context.sourceTextManager());

    return {
      type: 'comp',
      expr: matched,
    };
  };

  /**
   * @param {TextManager} tm
   * @return {string}
   */
  const processComp = (tm) => {
    const regexp = /^(?:lte|lt|gte|gt|===|==|!==|!=)/;
    const matched = tm.regexpMatched(regexp, 'comparer should be written');

    tm.next(matched[0]);

    return matched[0];
  }

  /**
   * @return {boolean}
   */
  const readRoundBracket = () => {
    try {
      processRoundBracket(context.sourceTextManager().lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   * @return {Object}
   */
  const parseRoundBracket = () => {
    processRoundBracket(context.sourceTextManager());

    return {
      type: 'roundBracket',
    };
  };

  /**
   * @param {TextManager} tm
   */
  const processRoundBracket = (tm) => {
    tm.next('(');
  };

  /**
   * @return {boolean}
   */
  const readEndRoundBracket = () => {
    try {
      processEndRoundBracket(context.sourceTextManager().lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   * @return {Object}
   */
  const parseEndRoundBracket = () => {
    processEndRoundBracket(context.sourceTextManager());

    return {
      type: 'endRoundBracket',
    };
  };

  /**
   * @param {TextManager} tm
   */
  const processEndRoundBracket = (tm) => {
    tm.next(')');
  };

  const parseConditionBody = (() => {
    const getReversePolish = (() => {
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

      const getOrder = (section) => {
        // parseAndor() returns section.type with 'andor'.
        // Use section.expr instead.
        return order[section.type] || order[section.expr];
      };

      const parse = (sourceType) => {
        const transitableTypes = state[sourceType];
        let i, size, type, result;

        for (i = 0, size = transitableTypes.length; i < size; i++) {
          type = transitableTypes[i];

          if (type === 'error') {
            throw new Error('invalid condition expression');
          }

          if (method[type].read()) {
            result = method[type].parse();
            result.order = getOrder(result);

            return result;
          }
        }
      };

      const main = () => {
        const config = context.config();
        const tm = context.sourceTextManager();
        const history = new ReversePolishNodeHistory();
        let parsed, polish = [], stack = [], stackTop;

        while (!tm.eof()) {
          if (tm.charIs(config.closeDelimiter())) {
            break;
          }

          // history has at least 'start' type at the beginning.
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

          tm.skipWhitespace();
        }

        while (stack.length > 0) {
          polish.push(stack.pop());
        }

        history.finish();

        return polish;
      };

      return () => {
        return main();
      };
    })();

    return () => {
      try {
        return {
          stack: getReversePolish(),
        };
      } catch (e) {
        context.exception(e.message);
      }
    };
  })();

  const parseNormalBlock = () => {
    const config = context.config();
    const tm = context.sourceTextManager();
    let node;
    let value = '';

    while (!tm.eof()) {
      if (context.astNode('delimiter_open').read(context)) {
        node = context.astNode('delimiter_open').parse(context);
        value += node.expr;
      } else if (readCloseTag()) {
        node = parseCloseTag();
        value += node.expr;
      } else if (tm.charIs(config.openDelimiter())) {
        break;
      } else if (tm.charIs(config.closeDelimiter())) {
        context.exception('syntax error');
      } else {
        value += tm.next(tm.getChar());
      }
    }

    return {
      type: 'normal',
      value: value,
    };
  };

  const parseLiteralBlock = () => {
    const config = context.config();
    const tm = context.sourceTextManager();
    let node;
    let value = '';
    let closed = false;
    const startLine = tm.getLine();
    const startAt = tm.getAt();

    parseLiteralTag();

    while (!tm.eof()) {
      if (context.astNode('delimiter_open').read(context)) {
        node = context.astNode('delimiter_open').parse(context);
        value += node.expr;
      } else if (readCloseTag()) {
        node = parseCloseTag();
        value += node.expr;
      } else if (readEndLiteralTag()) {
        parseEndLiteralTag();
        closed = true;
        break;
      } else {
        value += tm.next(tm.getChar());
      }
    }

    if (closed === false) {
      context.exception('literal block starts at [' + startLine + ', ' + startAt + '] not closed by ' + config.openDelimiter() + 'endliteral' + config.closeDelimiter());
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
      processHolderTag(context.config(), context.sourceTextManager().lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   * @param {ParseConfig} config
   * @param {TextManager} tm
   */
  const processHolderTag = (config, tm) => {
    tm.next(config.openDelimiter());
    tm.skipWhitespace();
    tm.readRegexp(/^\$/, true);
  };

  const parseFilter = () => {
    /**
     * @param {ParseContext} context
     * @throws {Error}
     */
    const nameSection = (context) => {
      const tm = context.sourceTextManager();
      let name = '';

      tm.skipWhitespace();

      while (tm.charMatch(/[\w-]/)) {
        name += tm.next(tm.getChar());
      }

      if (name === '') {
        throw new Error('filter name not found');
      }

      return name;
    };

    /**
     * @param {ParseContext} context
     * @throws {Error}
     */
    const argumentSection = (context) => {
      const config = context.config();
      const tm = context.sourceTextManager();
      const args = [];

      tm.skipWhitespace();

      if (tm.charIs(':')) {
        tm.next(':');

        while (!tm.eof()) {
          tm.skipWhitespace();

          if (readValue() === false) {
            throw new Error('invalid filter args');
          }

          args.push(parseValue().value);

          tm.skipWhitespace();

          if (tm.charIs(',')) {
            tm.next(',');
          } else if (tm.charIs('|') || tm.charIs(config.closeDelimiter())) {
            break;
          } else {
            throw new Error('invalid filter args expression');
          }
        }
      }

      return args;
    };

    return {
      name: nameSection(context),
      args: argumentSection(context),
    };
  };

  const parseFilters = () => {
    const config = context.config();
    const tm = context.sourceTextManager();
    const filters = [];

    while (!tm.eof()) {
      tm.skipWhitespace();

      if (!tm.charIs('|')) {
        break;
      }

      tm.next('|');
      tm.skipWhitespace();

      filters.push(parseFilter());

      if (tm.charIs(config.closeDelimiter())) {
        break;
      } else if (!tm.charIs('|')) {
        throw new Error('syntax error');
      }
    }

    return {
      filters: filters,
    };
  };

  const parseHolderBlock = () => {
    const config = context.config();
    const tm = context.sourceTextManager();

    tm.next(config.openDelimiter());
    tm.skipWhitespace();

    const keySection = parseVar();
    const filterSection = parseFilters();

    tm.skipWhitespace();
    tm.next(config.closeDelimiter());

    return {
      type: 'holder',
      keys: keySection.keys,
      filters: filterSection.filters,
    };
  };

  const parseForLoopBody = () => {
    const tm = context.sourceTextManager();
    let k, v, array;

    v = parseTmpVar().expr;

    if (tm.readRegexp(/^\s*,\s*/)) {
      tm.skipWhitespace();
      tm.next(',');
      tm.skipWhitespace();
      k = v;
      v = parseTmpVar().expr;
    }

    tm.checkRegexp(/^\s+in\s+/, 'invalid for expression');
    tm.skipWhitespace();
    tm.next('in');
    tm.skipWhitespace();

    array = parseVar();

    tm.skipWhitespace();

    return {
      tmp_k: k,
      tmp_v: v,
      keys: array.keys,
    };
  };

  const parseForLoopBlock = () => {
    const config = context.config();
    const tm = context.sourceTextManager();
    parseForTag();
    const ctrl = parseForLoopBody();
    tm.next(config.closeDelimiter());

    const children = loop([], true);

    parseEndForTag();

    return {
      type: 'for_loop',
      ctrl: ctrl,
      children: children,
    };
  };

  const parseConditionBlock = () => {
    const branches = [];

    branches.push(parseIfTag());

    while (readElseifTag()) {
      branches.push(parseElseifTag());
    }

    if (readElseTag()) {
      branches.push(parseElseTag());
    }

    parseEndIfTag();

    return {
      type: 'condition',
      children: branches,
    };
  };

  const loop = (result, inBlock) => {
    const config = context.config();
    const tm = context.sourceTextManager();
    while (!tm.eof()) {
      if (tm.charIs(config.openDelimiter())) {
        if (inBlock && (readElseifTag() || readElseTag() || readEndIfTag() || readEndForTag())) {
          break;
        } else if (readLiteralTag()) {
          result.push(parseLiteralBlock());
        } else if (readIfTag()) {
          result.push(parseConditionBlock());
        } else if (readForTag()) {
          result.push(parseForLoopBlock());
        } else if (readHolderTag()) {
          result.push(parseHolderBlock());
        } else {
          context.exception('unknown tag');
        }
      } else {
        result.push(parseNormalBlock());
      }
    }

    return result;
  };


  that.parse = (content, source) => {
    const config = new ParseConfig();
    const sourceTextManager = new SourceTextManager(content);
    const ast = new Ast();
    context = new ParseContext(config, sourceTextManager, ast);

    return loop([]);
  };

  return that;
};

module.exports.init = () => {
  return parser();
};
