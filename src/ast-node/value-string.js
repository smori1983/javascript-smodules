const AstNode = require('./ast-node');

class ValueString extends AstNode {
  type() {
    return 'value_string';
  }

  /**
   * @param {ParseContext} context
   * @return {AstNodeParseResult}
   */
  parse(context) {
    const matched = this._consume(context.config(), context.sourceTextManager());

    return {
      type: 'value',
      value: matched,
    };
  }

  /**
   * @param {ParseConfig} config
   * @param {TextManager} tm
   * @return {string}
   * @private
   */
  _consume(config, tm) {
    const regexp = /^(["'])(?:\\\1|\s|\S)*?\1/;
    const matched = tm.regexpMatched(regexp, 'string expression not closed');

    tm.next(matched[0]);

    return matched[0].slice(1, -1).replace('\\' + matched[1], matched[1]);
  }
}

module.exports = ValueString;
