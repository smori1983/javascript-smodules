const AstNode = require('./ast-node');

class ConditionElseif extends AstNode {
  type() {
    return 'elseif';
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
    tm.next('elseif');
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

module.exports = ConditionElseif;
