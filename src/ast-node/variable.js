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
    const parsed = this._consume(context.config(), context.sourceTextManager());

    return {
      type: this.type(),
      keys: parsed.split('.'),
    };
  }

  /**
   * @param {ParseConfig} config
   * @param {TextManager} tm
   * @return {string}
   * @throws {Error}
   * @private
   */
  _consume(config, tm) {
    const parsed = tm.next('$') + tm.consumeWhile(/[\w.]/);

    if (/^\$$|^\$\.|\.$|\.\./.test(parsed)) {
      throw new Error('invalid variable expression');
    }

    return parsed.slice(1);
  }
}

module.exports = Variable;
