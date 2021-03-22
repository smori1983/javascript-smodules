const AstNode = require('./ast-node');

class OperatorLogical extends AstNode {
  type() {
    return 'andor';
  }

  /**
   * @param {ParseContext} context
   * @return {AstNodeParseResult}
   */
  parse(context) {
    const tm = context.sourceTextManager();
    const regexp = /^(and|or)[^\w]/;

    tm.whitespace();
    const matched = tm.regexpMatched(regexp, '"and" or "or" should be written');
    tm.next(matched[1]);

    return {
      type: this.type(),
      expr: matched[1],
    };
  }
}

module.exports = OperatorLogical;
