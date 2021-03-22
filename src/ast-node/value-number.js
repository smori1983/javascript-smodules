const AstNode = require('./ast-node');

class ValueNumber extends AstNode {
  type() {
    return 'value_number';
  }

  /**
   * @param {ParseContext} context
   * @return {AstNodeParseResult}
   */
  parse(context) {
    const tm = context.sourceTextManager();
    const regexp = /^[+-]?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/;
    let value;

    tm.whitespace();
    const matched = tm.regexpMatched(regexp);

    if (!matched || isNaN(value = +(matched[0]))) {
      throw new Error('invalid number expression');
    }

    tm.next(matched[0]);

    return {
      type: 'value',
      value: value,
    };
  }
}

module.exports = ValueNumber;
