const AstNode = require('./ast-node');

class LiteralClose extends AstNode {
  type() {
    return 'literal_close';
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
    };
  }

  /**
   * @param {ParseConfig} config
   * @param {TextManager} tm
   * @private
   */
  _process(config, tm) {
    tm.next(config.openDelimiter());
    tm.skipWhitespace();
    tm.next('endliteral');
    tm.skipWhitespace();
    tm.next(config.closeDelimiter());
  }
}

module.exports = LiteralClose;
