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
    const tm = context.sourceTextManager();

    tm.whitespace();
    tm.consumeOpenDelimiter();
    tm.whitespace();
    tm.next('close');
    tm.whitespace();
    tm.consumeCloseDelimiter();

    return {
      type: this.type(),
      expr: context.config().closeDelimiter(),
    };
  }
}

module.exports = DelimiterClose;
