const AstNode = require('./ast-node');

class DelimiterClose extends AstNode {
  type() {
    return 'delimiter_close';
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
    tm.next('close');
    tm.whitespace();
    tm.next(config.closeDelimiter());

    return {
      type: this.type(),
      expr: context.config().closeDelimiter(),
    };
  }
}

module.exports = DelimiterClose;
