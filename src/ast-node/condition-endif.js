const AstNote = require('./ast-node');

class ConditionEndif extends AstNote {
  type() {
    return 'endif';
  }

  /**
   * @param {ParseContext} context
   * @return {AstNodeParseResult}
   */
  parse(context) {
    this._consume(context.config(), context.sourceTextManager());

    return {
      type: this.type(),
    };
  }

  /**
   * @param {ParseConfig} config
   * @param {TextManager} tm
   * @private
   */
  _consume(config, tm) {
    tm.next(config.openDelimiter());
    tm.whitespace();
    tm.next('endif');
    tm.whitespace();
    tm.next(config.closeDelimiter());
  }
}

module.exports = ConditionEndif;
