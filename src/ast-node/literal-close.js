const AstNode = require('./ast-node');

class LiteralClose extends AstNode {
  type() {
    return 'literal_close';
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
    tm.next('endliteral');
    tm.whitespace();
    tm.consumeCloseDelimiter();

    return {
      type: this.type(),
    };
  }
}

module.exports = LiteralClose;
