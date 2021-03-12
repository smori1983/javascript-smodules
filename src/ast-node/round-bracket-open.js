const AstNode = require('./ast-node');

class RoundBracketOpen extends AstNode {
  type() {
    return 'roundBracket';
  }

  /**
   * @param {ParseContext} context
   * @return {boolean}
   */
  read(context) {
    try {
      this._process(context.lookaheadTextManager());

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
    const parsed = this._process(context.sourceTextManager());

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
  _process(tm) {
    return tm.next('(');
  }
}

module.exports = RoundBracketOpen;
