const Ast = require('./ast');
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

    const ctrl = context.parse('condition_body');
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

    const ctrl = context.parse('condition_body');
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

  const parseForLoopBlock = () => {
    const config = context.config();
    const tm = context.sourceTextManager();
    context.parse('for');
    const ctrl = context.parse('for_loop_body');
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

    context.parse('endif');

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
        if (inBlock && (readElseifTag() || readElseTag() || context.read('endif') || readEndForTag())) {
          break;
        }

        if (context.read('literal')) {
          result.push(context.parse('literal'));
        } else if (readIfTag()) {
          result.push(parseConditionBlock());
        } else if (context.read('for')) {
          result.push(parseForLoopBlock());
        } else if (context.read('holder')) {
          result.push(context.parse('holder'));
        } else {
          context.exception('unknown tag');
        }
      } else {
        result.push(context.parse('normal'));
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
