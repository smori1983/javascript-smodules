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
    const tm = context.sourceTextManager();

    tm.whitespace();
    tm.consumeOpenDelimiter();
    tm.whitespace();
    tm.next('open');
    tm.whitespace();
    tm.consumeCloseDelimiter();

    return {
      type: this.type(),
      expr: context.config().openDelimiter(),
    };
  }
}

module.exports = DelimiterOpen;
