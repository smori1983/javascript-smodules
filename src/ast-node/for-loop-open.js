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
    const config = context.config();
    const tm = context.sourceTextManager();

    this._consume(context.config(), context.sourceTextManager());
    tm.whitespace();
    const ctrl = context.parse('for_loop_body');
    tm.whitespace();
    tm.next(config.closeDelimiter());

    return {
      type: this.type(),
      ctrl: ctrl,
    }
  }

  /**
   * @param {ParseConfig} config
   * @param {TextManager} tm
   * @private
   */
  _consume(config, tm) {
    tm.next(config.openDelimiter());
    tm.whitespace();
    tm.next('for');
    tm.whitespaceRequired();
  }
}

module.exports = ForLoopOpen;
