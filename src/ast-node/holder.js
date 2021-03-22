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
    const config = context.config();
    const tm = context.sourceTextManager();

    tm.next(config.openDelimiter());
    tm.whitespace();

    const keySection = context.parse('var');
    const filterSection = context.parse('filter_chain');

    tm.whitespace();
    tm.next(config.closeDelimiter());

    return {
      type: this.type(),
      keys: keySection.keys,
      filters: filterSection.filters,
    };
  }
}

module.exports = Holder;
