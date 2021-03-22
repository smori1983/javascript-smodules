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
    const config = context.config();
    const tm = context.sourceTextManager();

    tm.whitespace();
    tm.next(config.openDelimiter());
    tm.whitespace();
    tm.next('endif');
    tm.whitespace();
    tm.next(config.closeDelimiter());

    return {
      type: this.type(),
    };
  }
}

module.exports = ConditionEndif;
