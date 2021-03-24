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
    const tm = context.sourceTextManager();

    tm.whitespace();
    tm.consumeOpenDelimiter();
    tm.whitespace();
    tm.next('endif');
    tm.whitespace();
    tm.consumeCloseDelimiter();

    return {
      type: this.type(),
    };
  }
}

module.exports = ConditionEndif;
