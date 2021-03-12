const AstNode = require('./ast-node');

class Normal extends AstNode {
  type() {
    return 'normal';
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
    let value = '';

    while (!tm.eof()) {
      if (context.read('delimiter_open')) {
        value += context.parse('delimiter_open').expr;
      } else if (context.read('delimiter_close')) {
        value += context.parse('delimiter_close').expr;
      } else if (tm.charIs(config.openDelimiter())) {
        break;
      } else if (tm.charIs(config.closeDelimiter())) {
        context.exception('syntax error');
      } else {
        value += tm.next(tm.getChar());
      }
    }

    return {
      type: this.type(),
      value: value,
    };
  }
}

module.exports = Normal;
