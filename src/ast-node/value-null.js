const AstNode = require('./ast-node');

class ValueNull extends AstNode {
  type() {
    return 'value_null';
  }

  /**
   * @param {ParseContext} context
   * @return {AstNodeParseResult}
   */
  parse(context) {
    this._consume(context.config(), context.sourceTextManager());

    return {
      type: 'value',
      value: null,
    };
  }

  /**
   * @param {ParseConfig} config
   * @param {TextManager} tm
   * @private
   */
  _consume(config, tm) {
    const regexp = /^(null)[^\w]/;
    const matched = tm.regexpMatched(regexp, 'null should be written');

    tm.next(matched[1]);
  }
}

module.exports = ValueNull;
