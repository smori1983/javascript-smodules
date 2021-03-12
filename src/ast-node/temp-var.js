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
    const expr = this._process(context.sourceTextManager());

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
   * @param {TextManager} tm
   * @private
   */
  _process(tm) {
    let s = tm.next('$');

    while (tm.charMatch(/\w/)) {
      s += tm.next(tm.getChar());
    }

    if (s === '$') {
      throw new Error('tmp variable not found');
    }

    return s.slice(1);
  }
}

module.exports = TempVar;
