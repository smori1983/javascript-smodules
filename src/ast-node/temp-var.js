const AstNode = require('./ast-node');

class TempVar extends AstNode {
  type() {
    return 'temp_var';
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
    const expr = this._consume(context.config(), context.sourceTextManager());

    try {
      return {
        type: this.type(),
        expr: expr,
      };
    } catch (e) {
      context.exception(e.message);
    }
  }

  /**
   * @param {ParseConfig} config
   * @param {TextManager} tm
   * @private
   */
  _consume(config, tm) {
    const s = tm.next('$') + tm.consumeWhile(/\w/);

    if (s === '$') {
      throw new Error('tmp variable not found');
    }

    return s.slice(1);
  }
}

module.exports = TempVar;
