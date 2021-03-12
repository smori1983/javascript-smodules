const AstNode = require('./ast-node');

class ValueString extends AstNode {
  type() {
    return 'value_string';
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
      type: 'value',
      value: matched,
    };
  }

  /**
   * @param {TextManager} tm
   * @return {string}
   * @private
   */
  _process(tm) {
    const regexp = /^(["'])(?:\\\1|\s|\S)*?\1/;
    const matched = tm.regexpMatched(regexp, 'string expression not closed');

    tm.next(matched[0]);

    return matched[0].slice(1, -1).replace('\\' + matched[1], matched[1]);
  }
}

module.exports = ValueString;
