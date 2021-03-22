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
    const config = context.config();
    const tm = context.sourceTextManager();

    tm.whitespace();
    tm.next(config.openDelimiter());
    tm.whitespace();
    tm.next('else');
    tm.whitespace();
    tm.next(config.closeDelimiter());
    const children = context.parse('main_in_block').children;

    return {
      type: this.type(),
      children: children,
    };
  }
}

module.exports = ConditionElse;
