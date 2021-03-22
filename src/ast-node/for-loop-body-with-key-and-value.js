const AstNode = require('./ast-node');

class ForLoopBodyWithKeyAndValue extends AstNode {
  type() {
    return 'for_loop_body_with_key_and_value';
  }

  /**
   * @param {ParseContext} context
   * @return {AstNodeParseResult}
   */
  parse(context) {
    const tm = context.sourceTextManager();

    tm.whitespace();
    const k = context.parse('temp_var').expr;
    tm.whitespace();
    tm.next(',');
    tm.whitespace();
    const v = context.parse('temp_var').expr;
    tm.whitespaceRequired();
    tm.next('in');
    tm.whitespaceRequired();
    const array = context.parse('var');

    return {
      type: this.type(),
      tmp_k: k,
      tmp_v: v,
      keys: array.keys,
    };
  }
}

module.exports = ForLoopBodyWithKeyAndValue;
