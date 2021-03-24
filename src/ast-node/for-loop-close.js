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
    const tm = context.sourceTextManager();

    tm.whitespace();
    tm.consumeOpenDelimiter();
    tm.whitespace();
    tm.next('endfor');
    tm.whitespace();
    tm.consumeCloseDelimiter();

    return {
      type: this.type(),
    };
  }
}

module.exports = ForLoopClose;
