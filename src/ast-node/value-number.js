const AstNode = require('./ast-node');

class ValueNumber extends AstNode {
  type() {
    return 'value_number';
  }

  /**
   * @param {ParseContext} context
   * @return {boolean}
   */
  read(context) {
    try {
      this._consume(context.config(), context.lookaheadTextManager());

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
      const value = this._consume(context.config(), context.sourceTextManager());

      return {
        type: 'value',
        value: value,
      };
    } catch (e) {
      context.exception(e.message);
    }
  }

  /**
   * @param {ParseConfig} config
   * @param {TextManager} tm
   * @return {string}
   * @private
   */
  _consume(config, tm) {
    const regexp = /^[+-]?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/;
    const matched = tm.regexpMatched(regexp);
    let value;

    if (matched && !isNaN(value = +(matched[0]))) {
      tm.next(matched[0]);

      return value;
    } else {
      throw new Error('invalid number expression');
    }
  }
}

module.exports = ValueNumber;
