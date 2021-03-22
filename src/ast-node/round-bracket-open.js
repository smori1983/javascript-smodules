const AstNode = require('./ast-node');

class RoundBracketOpen extends AstNode {
  type() {
    return 'round_bracket_open';
  }

  /**
   * @param {ParseContext} context
   * @return {AstNodeParseResult}
   */
  parse(context) {
    const tm = context.sourceTextManager();

    tm.whitespace();
    const parsed = tm.next('(');

    return {
      type: this.type(),
      expr: parsed,
    };
  }
}

module.exports = RoundBracketOpen;
