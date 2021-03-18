const AstNode = require('./ast-node');

class FilterChain extends AstNode {
  type() {
    return 'filter_chain';
  }

  /**
   * @param {ParseContext} context
   * @return {boolean}
   */
  read(context) {
    return true;
  }

  /**
   * @param {ParseContext} context
   * @return {AstNodeParseResult}
   */
  parse(context) {
    const config = context.config();
    const tm = context.sourceTextManager();
    const filters = [];

    while (!tm.eof()) {
      tm.whitespace();

      if (!tm.charIs('|')) {
        break;
      }

      tm.next('|');
      tm.whitespace();

      filters.push(context.parse('filter'));

      if (tm.charIs(config.closeDelimiter())) {
        break;
      } else if (!tm.charIs('|')) {
        throw new Error('syntax error');
      }
    }

    return {
      type: this.type(),
      filters: filters,
    };
  }
}

module.exports = FilterChain;
