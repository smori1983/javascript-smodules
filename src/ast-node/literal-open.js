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
    const config = context.config();
    const tm = context.sourceTextManager();

    tm.whitespace();
    tm.next(config.openDelimiter());
    tm.whitespace();
    tm.next('literal');
    tm.whitespace();
    tm.next(config.closeDelimiter());

    return {
      type: this.type(),
    };
  }
}

module.exports = LiteralOpen;
