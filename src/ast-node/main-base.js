const AstNode = require('./ast-node');

class MainBase extends AstNode {
  /**
   * @param {ParseContext} context
   * @return {AstNodeParseResult}
   * @protected
   */
  _parseOne(context) {
    const config = context.config();
    const tm = context.sourceTextManager();

    if (tm.charIs(config.openDelimiter())) {
      if (context.read('literal')) {
        return context.parse('literal');
      } else if (context.read('condition')) {
        return context.parse('condition');
      } else if (context.read('for_loop')) {
        return context.parse('for_loop');
      } else if (context.read('holder')) {
        return context.parse('holder');
      } else {
        context.exception('unknown tag');
      }
    } else {
      return context.parse('normal');
    }
  }
}

module.exports = MainBase;
