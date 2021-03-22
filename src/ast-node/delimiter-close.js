const AstNode = require('./ast-node');

class DelimiterClose extends AstNode {
  type() {
    return 'delimiter_close';
  }

  /**
   * @param {ParseContext} context
   * @return {AstNodeParseResult}
   */
  parse(context) {
    this._consume(context.config(), context.sourceTextManager());

    return {
      type: this.type(),
      expr: context.config().closeDelimiter(),
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
    tm.next('close');
    tm.whitespace();
    tm.next(config.closeDelimiter());
  }
}

module.exports = DelimiterClose;
