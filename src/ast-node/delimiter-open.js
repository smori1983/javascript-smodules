const AstNode = require('./ast-node');

class DelimiterOpen extends AstNode {
  type() {
    return 'delimiter_open';
  }

  /**
   * @param {ParseContext} context
   * @return {AstNodeParseResult}
   */
  parse(context) {
    this._consume(context.config(), context.sourceTextManager());

    return {
      type: this.type(),
      expr: context.config().openDelimiter(),
    };
  }

  /**
   * @param {ParseConfig} config
   * @param {TextManager} tm
   * @private
   */
  _consume(config, tm) {
    tm.next(config.openDelimiter());
    tm.whitespace();
    tm.next('open');
    tm.whitespace();
    tm.next(config.closeDelimiter());
  }
}

module.exports = DelimiterOpen;
