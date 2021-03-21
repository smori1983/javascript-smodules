const AstNode = require('./ast-node');

class OperatorComparison extends AstNode {
  type() {
    return 'comp';
  }

  /**
   * @param {ParseContext} context
   * @return {boolean}
   */
  read(context) {
    try {
      this._consume(context.config(), context.lookaheadTextManager());

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
    const matched = this._consume(context.config(), context.sourceTextManager());

    return {
      type: this.type(),
      expr: matched,
    };
  }

  /**
   * @param {ParseConfig} config
   * @param {TextManager} tm
   * @return {string}
   * @private
   */
  _consume(config, tm) {
    const regexp = /^(?:lte|lt|gte|gt|===|==|!==|!=)/;
    const matched = tm.regexpMatched(regexp, 'comparer should be written');

    tm.next(matched[0]);

    return matched[0];
  }
}

module.exports = OperatorComparison;
