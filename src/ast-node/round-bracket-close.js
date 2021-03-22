const AstNode = require('./ast-node');

class RoundBracketClose extends AstNode {
  type() {
    return 'round_bracket_close';
  }

  /**
   * @param {ParseContext} context
   * @return {AstNodeParseResult}
   */
  parse(context) {
    const tm = context.sourceTextManager();

    tm.whitespace();
    const parsed = tm.next(')');

    return {
      type: this.type(),
      expr: parsed,
    };
  }
}

module.exports = RoundBracketClose;
