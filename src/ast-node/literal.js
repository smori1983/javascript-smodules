const AstNode = require('./ast-node');

class Literal extends AstNode {
  type() {
    return 'literal';
  }

  /**
   * @param {ParseContext} context
   * @return {AstNodeParseResult}
   */
  parse(context) {
    const config = context.config();
    const tm = context.sourceTextManager();
    const startLine = tm.getLine();
    const startAt = tm.getAt();
    let value = '';
    let closed = false;

    context.parse('literal_open');

    while (!tm.eof()) {
      if (tm.charIs(config.openDelimiter())) {
        if (context.read('delimiter_open')) {
          value += context.parse('delimiter_open').expr;
        } else if (context.read('delimiter_close')) {
          value += context.parse('delimiter_close').expr;
        } else if (context.read('literal_close')) {
          context.parse('literal_close');
          closed = true;
          break;
        }
      }
      value += tm.next(tm.getChar());
    }

    if (closed === false) {
      context.exception('literal block starts at [' + startLine + ', ' + startAt + '] not closed by ' + config.openDelimiter() + 'endliteral' + config.closeDelimiter());
    }

    return {
      type: this.type(),
      value: value,
    };
  }
}

module.exports = Literal;
