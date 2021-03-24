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

    const keySection = context.parse('var');
    const filterSection = context.parse('filter_chain');

    tm.whitespace();
    tm.consumeCloseDelimiter();

    return {
      type: this.type(),
      keys: keySection.keys,
      filters: filterSection.filters,
    };
  }
}

module.exports = Holder;
