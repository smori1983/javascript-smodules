const AstNode = require('./ast-node');

class ForLoopBodyWithValue extends AstNode {
  type() {
    return 'for_loop_body_with_value';
  }

  /**
   * @param {ParseContext} context
   * @return {AstNodeParseResult}
   */
  parse(context) {
    const tm = context.sourceTextManager();

    tm.whitespace();
    const v = context.parse('temp_var').expr;
    tm.whitespaceRequired();
    tm.next('in');
    tm.whitespaceRequired();
    const array = context.parse('var');

    return {
      type: this.type(),
      tmp_k: null,
      tmp_v: v,
      keys: array.keys,
    };
  }
}

module.exports = ForLoopBodyWithValue;
