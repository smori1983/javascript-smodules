const AstNode = require('./ast-node');

class ForLoopClose extends AstNode {
  type() {
    return 'endfor';
  }

  /**
   * @param {ParseContext} context
   * @return {AstNodeParseResult}
   */
  parse(context) {
    this._consume(context.config(), context.sourceTextManager());

    return {
      type: this.type(),
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
    tm.next('endfor');
    tm.whitespace();
    tm.next(config.closeDelimiter());
  }
}

module.exports = ForLoopClose;
