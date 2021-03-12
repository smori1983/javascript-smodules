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
   * @return {Object}
   */
  const parseIfTag = () => {
    processIfTag(context.config(), context.sourceTextManager());

    const ctrl = context.parse('condition_body');
    context.sourceTextManager().next(context.config().closeDelimiter());
    const children = loopInBlock().children;

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
   * @return {Object}
   */
  const parseElseifTag = () => {
    processElseifTag(context.config(), context.sourceTextManager());

    const ctrl = context.parse('condition_body');
    context.sourceTextManager().next(context.config().closeDelimiter());
    const children = loopInBlock().children;

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
   * @return {Object}
   */
  const parseElseTag = () => {
    processElseTag(context.config(), context.sourceTextManager());

    const children = loopInBlock().children;

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

  const parseForLoopBlock = () => {
    const config = context.config();
    const tm = context.sourceTextManager();
    context.parse('for');
    const ctrl = context.parse('for_loop_body');
    tm.next(config.closeDelimiter());

    const children = loopInBlock().children;

    context.parse('endfor');

    return {
      type: 'for_loop',
      ctrl: ctrl,
      children: children,
    };
  };

  const parseConditionBlock = () => {
    const branches = [];

    branches.push(parseIfTag());

    while (context.read('elseif')) {
      branches.push(parseElseifTag());
    }

    if (context.read('else')) {
      branches.push(parseElseTag());
    }

    context.parse('endif');

    return {
      type: 'condition',
      children: branches,
    };
  };

  /**
   * @return {AstNodeParseResult}
   */
  const loop = () => {
    const children = [];
    const tm = context.sourceTextManager();

    while (!tm.eof()) {
      children.push(main());
    }

    return {
      type: 'main',
      children: children,
    };
  };

  /**
   * @return {AstNodeParseResult}
   */
  const loopInBlock = () => {
    const children = [];
    const tm = context.sourceTextManager();

    while (!tm.eof()) {
      if (context.read('elseif') || context.read('else') || context.read('endif') || context.read('endfor')) {
        break;
      }

      children.push(main());
    }

    return {
      type: 'main_in_block',
      children: children,
    };
  };

  const main = () => {
    const config = context.config();
    const tm = context.sourceTextManager();

    if (tm.charIs(config.openDelimiter())) {
      if (context.read('literal')) {
        return context.parse('literal');
      } else if (context.read('if')) {
        return parseConditionBlock();
      } else if (context.read('for')) {
        return parseForLoopBlock();
      } else if (context.read('holder')) {
        return context.parse('holder');
      } else {
        context.exception('unknown tag');
      }
    } else {
      return context.parse('normal');
    }
  };


  that.parse = (content, source) => {
    const config = new ParseConfig();
    const sourceTextManager = new SourceTextManager(content);
    const ast = new Ast();
    context = new ParseContext(config, sourceTextManager, ast);

    return loop().children;
  };

  return that;
};

module.exports.init = () => {
  return parser();
};
