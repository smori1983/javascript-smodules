const AstNode = require('./ast-node');

class FilterChain extends AstNode {
  type() {
    return 'filter_chain';
  }

  /**
   * @param {ParseContext} context
   * @return {AstNodeParseResult}
   */
  parse(context) {
    const config = context.config();
    const tm = context.sourceTextManager();
    const filters = [];

    tm.whitespace();

    while (tm.charIs('|')) {
      tm.next('|');
      tm.whitespace();
      filters.push(context.parse('filter'));
      tm.whitespace();

      if (tm.charIs(config.closeDelimiter())) {
        break;
      }
    }

    return {
      type: this.type(),
      filters: filters,
    };
  }
}

module.exports = FilterChain;
