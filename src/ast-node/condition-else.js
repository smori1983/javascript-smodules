const AstNode = require('./ast-node');

class ConditionElse extends AstNode {
  type() {
    return 'else';
  }

  /**
   * @param {ParseContext} context
   * @return {boolean}
   */
  read(context) {
    try {
      this._process(context.config(), context.sourceTextManager().lookaheadTextManager());

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
  }

  /**
   * @param {ParseConfig} config
   * @param {TextManager} tm
   * @private
   */
  _process(config, tm) {
    tm.next(config.openDelimiter());
    tm.skipWhitespace();
    tm.next('else');
    tm.skipWhitespace();
    tm.next(config.closeDelimiter());
  }
}

module.exports = ConditionElse;
