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
    const tm = context.sourceTextManager();
    let k, v;

    v = context.parse('temp_var').expr;

    if (tm.readRegexp(/^\s*,\s*/)) {
      tm.whitespace();
      tm.next(',');
      tm.whitespace();
      k = v;
      v = context.parse('temp_var').expr;
    }

    tm.whitespaceRequired();
    tm.next('in');
    tm.whitespaceRequired();

    const array = context.parse('var');

    tm.whitespace();

    return {
      type: this.type(),
      tmp_k: k,
      tmp_v: v,
      keys: array.keys,
    };
  }
}

module.exports = ForLoopBody;
