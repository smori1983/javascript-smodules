const AstNode = require('./ast-node');

class Variable extends AstNode {
  type() {
    return 'var';
  }

  /**
   * @param {ParseContext} context
   * @return {AstNodeParseResult}
   */
  parse(context) {
    const tm = context.sourceTextManager();

    tm.whitespace();
    tm.next('$');

    const parsed = tm.consumeWhile(/[\w.]/);

    if (parsed === '' || /^\.|\.$|\.\./.test(parsed)) {
      throw new Error('invalid variable expression');
    }

    return {
      type: this.type(),
      keys: parsed.split('.'),
    };
  }
}

module.exports = Variable;
