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
    const parsed = this._consume(context.config(), context.sourceTextManager());

    return {
      type: this.type(),
      expr: parsed,
    };
  }

  /**
   * @param {ParseConfig} config
   * @param {TextManager} tm
   * @return {string}
   * @private
   */
  _consume(config, tm) {
    return tm.next('(');
  }
}

module.exports = RoundBracketOpen;
