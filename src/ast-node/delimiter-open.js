const AstNode = require('./ast-node');

class DelimiterOpen extends AstNode {
  type() {
    return 'delimiter_open';
  }

  /**
   * @param {ParseContext} context
   * @return {AstNodeParseResult}
   */
  parse(context) {
    const config = context.config();
    const tm = context.sourceTextManager();

    tm.whitespace();
    tm.next(config.openDelimiter());
    tm.whitespace();
    tm.next('open');
    tm.whitespace();
    tm.next(config.closeDelimiter());

    return {
      type: this.type(),
      expr: context.config().openDelimiter(),
    };
  }
}

module.exports = DelimiterOpen;
