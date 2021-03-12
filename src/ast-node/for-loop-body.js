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
      tm.skipWhitespace();
      tm.next(',');
      tm.skipWhitespace();
      k = v;
      v = context.parse('temp_var').expr;
    }

    tm.checkRegexp(/^\s+in\s+/, 'invalid for expression');
    tm.skipWhitespace();
    tm.next('in');
    tm.skipWhitespace();

    array = context.parse('var');

    tm.skipWhitespace();

    return {
      type: this.type(),
      tmp_k: k,
      tmp_v: v,
      keys: array.keys,
    };
  }
}

module.exports = ForLoopBody;
