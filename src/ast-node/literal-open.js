const AstNode = require('./ast-node');

class LiteralOpen extends AstNode {
  type() {
    return 'literal_open';
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
    tm.next('literal');
    tm.whitespace();
    tm.consumeCloseDelimiter();

    return {
      type: this.type(),
    };
  }
}

module.exports = LiteralOpen;
