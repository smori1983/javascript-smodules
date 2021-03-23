const AstNode = require('./ast-node');

class ForLoopOpen extends AstNode {
  type() {
    return 'for';
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
    tm.next('for');
    tm.whitespaceRequired();
    const ctrl = context.parse('for_loop_body');
    tm.whitespace();
    tm.consumeCloseDelimiter();

    return {
      type: this.type(),
      ctrl: ctrl,
    }
  }
}

module.exports = ForLoopOpen;
