const AstNode = require('./ast-node');

class ValueBool extends AstNode {
  type() {
    return 'value_bool';
  }

  /**
   * @param {ParseContext} context
   * @return {AstNodeParseResult}
   */
  parse(context) {
    const matched = this._consume(context.config(), context.sourceTextManager());

    return {
      type: 'value',
      value: matched === 'true',
    };
  }

  /**
   * @param {ParseConfig} config
   * @param {TextManager} tm
   * @private
   */
  _consume(config, tm) {
    const regexp = /^(true|false)[^\w]/;
    const matched = tm.regexpMatched(regexp, 'bool should be written');

    tm.next(matched[1]);

    return matched[1];
  }
}

module.exports = ValueBool;
