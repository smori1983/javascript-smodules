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
   * @return {boolean}
   */
  const readVar = () => {
    return context.read('var');
  };

  /**
   * @return {Object}
   */
  const parseVar = () => {
    return context.parse('var');
  };

  /**
   * @return {boolean}
   */
  const readValue = () => {
    return context.read('value');
  };

  const parseValue = () => {
    return context.parse('value');
  };

  /**
   * @return {boolean}
   */
  const readAndOr = () => {
    return context.read('andor');
  };

  /**
   * @return {Object}
   */
  const parseAndOr = () => {
    return context.parse('andor');
  };

  /**
   * @return {boolean}
   */
  const readComp = () => {
    return context.read('comp');
  };

  /**
   * @return {Object}
   */
  const parseComp = () => {
    return context.parse('comp');
  };

  /**
   * @return {boolean}
   */
  const readRoundBracket = () => {
    return context.read('roundBracket');
  };

  /**
   * @return {Object}
   */
  const parseRoundBracket = () => {
    return context.parse('roundBracket');
  };

  /**
   * @return {boolean}
   */
  const readEndRoundBracket = () => {
    return context.read('endRoundBracket');
  };

  /**
   * @return {Object}
   */
  const parseEndRoundBracket = () => {
    return context.parse('endRoundBracket');
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
      if (context.read('delimiter_open')) {
        node = context.parse('delimiter_open');
        value += node.expr;
      } else if (context.read('delimiter_close')) {
        node = context.parse('delimiter_close');
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

          if (context.read('value') === false) {
            throw new Error('invalid filter args');
          }

          args.push(context.parse('value').value);

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

    const keySection = context.parse('var');
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

    v = context.parse('temp_var').expr;

    if (tm.readRegexp(/^\s*,\s*/)) {
      tm.skipWhitespace();
      tm.next(',');
      tm.skipWhitespace();
      k = v;
      v = context.parse('temp_var').expr;
    }

    tm.checkRegexp(/^\s+in\s+/, 'invalid for expression');
    tm.skipWhitespace();
    tm.next('in');
    tm.skipWhitespace();

    array = context.parse('var');

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
        } else if (context.read('literal')) {
          result.push(context.parse('literal'));
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
