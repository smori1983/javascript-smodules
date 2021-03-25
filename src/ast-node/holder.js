const AstNode = require('./ast-node');

class Holder extends AstNode {
  type() {
    return 'holder';
  }

  /**
   * @param {ParseContext} context
   * @return {AstNodeParseResult}
   */
  parse(context) {
    const tm = context.sourceTextManager();

    tm.whitespace();
    tm.consumeOpenDelimiter();
    tm.whitespace();

    const keys = context.parse('var').keys;
    const filters = context.parse('filter_chain').filters;

    tm.whitespace();
    tm.consumeCloseDelimiter();

    return {
      type: this.type(),
      keys: keys,
      filters: filters,
    };
  }
}

module.exports = Holder;
