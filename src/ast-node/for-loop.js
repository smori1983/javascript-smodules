const AstNode = require('./ast-node');

class ForLoop extends AstNode {
  type() {
    return 'for_loop';
  }

  /**
   * @param {ParseContext} context
   * @return {boolean}
   */
  read(context) {
    return context.read('for');
  }

  /**
   * @param {ParseContext} context
   * @return {AstNodeParseResult}
   */
  parse(context) {
    const config = context.config();
    const tm = context.sourceTextManager();

    context.parse('for');
    tm.whitespace();
    const ctrl = context.parse('for_loop_body');
    tm.whitespace();
    tm.next(config.closeDelimiter());

    const children = context.parse('main_in_block').children;

    context.parse('endfor');

    return {
      type: this.type(),
      ctrl: ctrl,
      children: children,
    };
  }
}

module.exports = ForLoop;
