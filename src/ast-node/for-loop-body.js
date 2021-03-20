const AstNode = require('./ast-node');

class ForLoopBody extends AstNode {
  type() {
    return 'for_loop_body';
  }

  /**
   * @param {ParseContext} context
   * @return {boolean}
   */
  read(context) {
    return true;
  }

  /**
   * @param {ParseContext} context
   * @return {AstNodeParseResult}
   */
  parse(context) {
    const tm = context.sourceTextManager();
    let k, v, array;

    v = context.parse('temp_var').expr;

    if (tm.readRegexp(/^\s*,\s*/)) {
      tm.whitespace();
      tm.next(',');
      tm.whitespace();
      k = v;
      v = context.parse('temp_var').expr;
    }

    tm.ensureWhitespace();
    tm.whitespace();
    tm.next('in');
    tm.ensureWhitespace();
    tm.whitespace();

    array = context.parse('var');

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
