const AstNode = require('./ast-node');

class Literal extends AstNode {
  type() {
    return 'literal';
  }

  /**
   * @param {ParseContext} context
   * @return {boolean}
   */
  read(context) {
    return context.read('literal_open');
  }

  /**
   * @param {ParseContext} context
   * @return {AstNodeParseResult}
   */
  parse(context) {
    const config = context.config();
    const tm = context.sourceTextManager();
    let node;
    let value = '';
    let closed = false;
    const startLine = tm.getLine();
    const startAt = tm.getAt();

    context.parse('literal_open');

    while (!tm.eof()) {
      if (context.read('delimiter_open')) {
        node = context.parse('delimiter_open');
        value += node.expr;
      } else if (context.read('delimiter_close')) {
        node = context.parse('delimiter_close');
        value += node.expr;
      } else if (context.read('literal_close')) {
        context.parse('literal_close');
        closed = true;
        break;
      } else {
        value += tm.next(tm.getChar());
      }
    }

    if (closed === false) {
      context.exception('literal block starts at [' + startLine + ', ' + startAt + '] not closed by ' + config.openDelimiter() + 'endliteral' + config.closeDelimiter());
    }

    return {
      type: 'literal',
      value: value,
    };
  }
}

module.exports = Literal;
