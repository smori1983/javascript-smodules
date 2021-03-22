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
    const config = context.config();
    const tm = context.sourceTextManager();

    tm.whitespace();
    tm.next(config.openDelimiter());
    tm.whitespace();
    tm.next('endliteral');
    tm.whitespace();
    tm.next(config.closeDelimiter());

    return {
      type: this.type(),
    };
  }
}

module.exports = LiteralClose;
