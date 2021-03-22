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
    const parsed = tm.next('$') + tm.consumeWhile(/[\w.]/);

    if (/^\$$|^\$\.|\.$|\.\./.test(parsed)) {
      throw new Error('invalid variable expression');
    }

    return {
      type: this.type(),
      keys: parsed.slice(1).split('.'),
    };
  }
}

module.exports = Variable;
