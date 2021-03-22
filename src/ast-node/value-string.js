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
    const tm = context.sourceTextManager();
    const regexp = /^(["'])(?:\\\1|\s|\S)*?\1/;

    tm.whitespace();
    const matched = tm.regexpMatched(regexp, 'string expression not closed');
    tm.next(matched[0]);

    return {
      type: 'value',
      value: matched[0].slice(1, -1).replace('\\' + matched[1], matched[1]),
    };
  }
}

module.exports = ValueString;
