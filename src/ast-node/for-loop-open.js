const AstNode = require('./ast-node');

class ForLoopOpen extends AstNode {
  type() {
    return 'for';
  }

  /**
   * @param {ParseContext} context
   * @return {boolean}
   */
  read(context) {
    try {
      this._process(context.config(), context.lookaheadTextManager());

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
    this._process(context.config(), context.sourceTextManager());

    return {
      type: this.type(),
    }
  }

  /**
   * @param {ParseConfig} config
   * @param {TextManager} tm
   * @private
   */
  _process(config, tm) {
    tm.next(config.openDelimiter());
    tm.whitespace();
    tm.next('for');
    tm.readRegexp(/^\s+/, true);
    tm.whitespace();
  }
}

module.exports = ForLoopOpen;
