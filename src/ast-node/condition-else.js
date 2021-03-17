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

    const children = context.parse('main_in_block').children;

    return {
      type: this.type(),
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
    tm.whitespace();
    tm.next('else');
    tm.whitespace();
    tm.next(config.closeDelimiter());
  }
}

module.exports = ConditionElse;
