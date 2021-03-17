const AstNode = require('./ast-node');

class RoundBracketOpen extends AstNode {
  type() {
    return 'round_bracket_open';
  }

  /**
   * @param {ParseContext} context
   * @return {boolean}
   */
  read(context) {
    try {
      this._consume(context.lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * @param {ParseContext} context
   * @return {AstNodeParseResult}
   */
  parse(context) {
    const parsed = this._consume(context.sourceTextManager());

    return {
      type: this.type(),
      expr: parsed,
    };
  }

  /**
   * @param {TextManager} tm
   * @return {string}
   * @private
   */
  _consume(tm) {
    return tm.next('(');
  }
}

module.exports = RoundBracketOpen;
