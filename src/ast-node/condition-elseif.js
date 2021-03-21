const AstNode = require('./ast-node');

class ConditionElseif extends AstNode {
  type() {
    return 'elseif';
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
    this._consume(context.config(), context.sourceTextManager());

    const ctrl = context.parse('condition_body');
    context.sourceTextManager().next(context.config().closeDelimiter());
    const children = context.parse('main_in_block').children;

    return {
      type: this.type(),
      ctrl: ctrl,
      children: children,
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
    tm.next('elseif');
    tm.ensureWhitespace();
    tm.whitespace();
  }
}

module.exports = ConditionElseif;
