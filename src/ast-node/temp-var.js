const AstNode = require('./ast-node');

class TempVar extends AstNode {
  type() {
    return 'temp_var';
  }

  /**
   * @param {ParseContext} context
   * @return {AstNodeParseResult}
   */
  parse(context) {
    const tm = context.sourceTextManager();

    tm.whitespace();
    const s = tm.next('$') + tm.consumeWhile(/\w/);

    if (s === '$') {
      throw new Error('tmp variable not found');
    }

    return {
      type: this.type(),
      expr: s.slice(1),
    };
  }
}

module.exports = TempVar;
