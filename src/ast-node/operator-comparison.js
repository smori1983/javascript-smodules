const AstNode = require('./ast-node');

class OperatorComparison extends AstNode {
  type() {
    return 'comp';
  }

  /**
   * @param {ParseContext} context
   * @return {AstNodeParseResult}
   */
  parse(context) {
    const tm = context.sourceTextManager();
    const regexp = /^(?:lte|lt|gte|gt|===|==|!==|!=)/;

    tm.whitespace();
    const matched = tm.regexpMatched(regexp, 'comparer should be written');
    tm.next(matched[0]);

    return {
      type: this.type(),
      expr: matched[0],
    };
  }
}

module.exports = OperatorComparison;
