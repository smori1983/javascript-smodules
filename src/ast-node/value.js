const AstNode = require('./ast-node');

class Value extends AstNode {
  type() {
    return 'value';
  }

  /**
   * @param {ParseContext} context
   * @return {AstNodeParseResult}
   */
  parse(context) {
    if (context.read('value_null')) {
      return context.parse('value_null');
    } else if (context.read('value_bool')) {
      return context.parse('value_bool');
    } else if (context.read('value_string')) {
      return context.parse('value_string');
    } else if (context.read('value_number')) {
      return context.parse('value_number');
    } else {
      context.exception('value should be written');
    }
  }
}

module.exports = Value;
