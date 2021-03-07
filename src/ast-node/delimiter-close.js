const AstNode = require('./ast-node');

class DelimiterClose extends AstNode {
  type() {
    return 'delimiter_close';
  }

  read(context) {
    try {
      this._process(context.config(), context.sourceTextManager().lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  }

  parse(context) {
    this._process(context.config(), context.sourceTextManager());

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
  _process(config, tm) {
    tm.next(config.openDelimiter());
    tm.skipWhitespace();
    tm.next('close');
    tm.skipWhitespace();
    tm.next(config.closeDelimiter());
  }
}

module.exports = DelimiterClose;
