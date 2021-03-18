const AstNode = require('./ast-node');

class Variable extends AstNode {
  type() {
    return 'var';
  }

  /**
   * @param {ParseContext} context
   * @return {boolean}
   */
  read(context) {
    try {
      this._process(context.lookaheadTextManager());

      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * @param {ParseContext} context
   * @return {AstNodeParseResult}
   */
  parse(context) {
    try {
      const parsed = this._process(context.sourceTextManager());

      return {
        type: this.type(),
        keys: parsed.split('.'),
      };
    } catch (e) {
      context.exception(e.message);
    }
  }

  /**
   * @param {TextManager} tm
   * @return {string}
   * @throws {Error}
   * @private
   */
  _process(tm) {
    const parsed = tm.next('$') + tm.consumeWhile(/[\w.]/);

    if (/^\$$|^\$\.|\.$|\.\./.test(parsed)) {
      throw new Error('invalid variable expression');
    }

    return parsed.slice(1);
  }
}

module.exports = Variable;
