const AstNode = require('./ast-node');

class ForLoopBody extends AstNode {
  type() {
    return 'for_loop_body';
  }

  /**
   * @param {ParseContext} context
   * @return {AstNodeParseResult}
   */
  parse(context) {
    if (context.read('for_loop_body_with_value')) {
      return context.parse('for_loop_body_with_value');
    }

    if (context.read('for_loop_body_with_key_and_value')) {
      return context.parse('for_loop_body_with_key_and_value');
    }

    throw new Error('syntax error');
  }
}

module.exports = ForLoopBody;
