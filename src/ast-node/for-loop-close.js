const AstNode = require('./ast-node');

class ForLoopClose extends AstNode {
  type() {
    return 'endfor';
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
    tm.next('endfor');
    tm.whitespace();
    tm.next(config.closeDelimiter());

    return {
      type: this.type(),
    };
  }
}

module.exports = ForLoopClose;
