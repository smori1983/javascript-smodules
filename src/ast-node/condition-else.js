const AstNode = require('./ast-node');

class ConditionElse extends AstNode {
  type() {
    return 'else';
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
    tm.next('else');
    tm.whitespace();
    tm.consumeCloseDelimiter();
    const children = context.parse('main_in_block').children;

    return {
      type: this.type(),
      children: children,
    };
  }
}

module.exports = ConditionElse;
