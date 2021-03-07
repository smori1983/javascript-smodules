const AstNode = require('./ast-node');

class ValueBool extends AstNode {
  type() {
    return 'value_bool';
  }

  /**
   * @param {ParseContext} context
   * @return {boolean}
   */
  read(context) {
    try {
      this._process(context.sourceTextManager().lookaheadTextManager());

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
    const matched = this._process(context.sourceTextManager());

    return {
      type: this.type(),
      value: matched === 'true',
    };
  }

  /**
   * @param {TextManager} tm
   * @private
   */
  _process(tm) {
    const regexp = /^(true|false)[^\w]/;
    const matched = tm.regexpMatched(regexp, 'bool should be written');

    tm.next(matched[1]);

    return matched[1];
  }
}

module.exports = ValueBool;
