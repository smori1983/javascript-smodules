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
    const tm = context.sourceTextManager();
    const regexp = /^(true|false)[^\w]/;

    tm.whitespace();
    const matched = tm.regexpMatched(regexp, 'bool should be written');
    tm.next(matched[1]);

    return {
      type: 'value',
      value: matched[1] === 'true',
    };
  }
}

module.exports = ValueBool;
