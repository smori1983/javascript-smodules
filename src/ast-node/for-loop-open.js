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
    const config = context.config();
    const tm = context.sourceTextManager();

    tm.whitespace();
    tm.next(config.openDelimiter());
    tm.whitespace();
    tm.next('for');
    tm.whitespaceRequired();
    const ctrl = context.parse('for_loop_body');
    tm.whitespace();
    tm.next(config.closeDelimiter());

    return {
      type: this.type(),
      ctrl: ctrl,
    }
  }
}

module.exports = ForLoopOpen;
