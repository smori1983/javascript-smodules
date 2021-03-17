const AstNode = require('./ast-node');

class OperatorLogical extends AstNode {
  type() {
    return 'andor';
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
    const matched = this._consume(context.sourceTextManager());

    return {
      type: this.type(),
      expr: matched,
    };
  }

  /**
   * @param {TextManager} tm
   * @return {string}
   * @private
   */
  _consume(tm) {
    const regexp = /^(and|or)[^\w]/;
    const matched = tm.regexpMatched(regexp, '"and" or "or" should be written');

    tm.next(matched[1]);

    return matched[1];
  }
}

module.exports = OperatorLogical;
