const AstNode = require('./ast-node');

class ForLoop extends AstNode {
  type() {
    return 'for_loop';
  }

  /**
   * @param {ParseContext} context
   * @return {AstNodeParseResult}
   */
  parse(context) {
    const ctrl = context.parse('for').ctrl;
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
