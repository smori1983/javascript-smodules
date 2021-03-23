const AstNode = require('./ast-node');

class ConditionIf extends AstNode {
  type() {
    return 'if';
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
    tm.next('if');
    tm.whitespaceRequired();
    const ctrl = context.parse('condition_body');
    tm.whitespace();
    tm.next(context.config().closeDelimiter());
    const children = context.parse('main_in_block').children;

    return {
      type: this.type(),
      ctrl: ctrl,
      children: children,
    };
  }
}

module.exports = ConditionIf;
