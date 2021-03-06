const AstNode = require('./ast-node');
const ReversePolish = require('./condition-reverse-polish');

class ConditionBody extends AstNode {
  constructor() {
    super();
    this._reversePolish = new ReversePolish();
  }

  type() {
    return 'condition_body';
  }

  /**
   * @param {ParseContext} context
   * @return {AstNodeParseResult}
   */
  parse(context) {
    return {
      type: this.type(),
      stack: this._reversePolish.parse(context),
    };
  }
}

module.exports = ConditionBody;
