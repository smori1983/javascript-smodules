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
    const tm = context.sourceTextManager();
    const regexp = /^(null)[^\w]/;

    tm.whitespace();
    const matched = tm.regexpMatched(regexp, 'null should be written');
    tm.next(matched[1]);

    return {
      type: 'value',
      value: null,
    };
  }
}

module.exports = ValueNull;
