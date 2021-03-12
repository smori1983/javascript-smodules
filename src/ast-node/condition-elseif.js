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
    this._process(context.config(), context.sourceTextManager());

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
  _process(config, tm) {
    tm.next(config.openDelimiter());
    tm.skipWhitespace();
    tm.next('elseif');
    tm.readRegexp(/^\s+/, true);
    tm.skipWhitespace();
  }
}

module.exports = ConditionElseif;
