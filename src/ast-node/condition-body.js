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
    try {
      return {
        type: this.type(),
        stack: this._reversePolish.parse(context),
      };
    } catch (e) {
      context.exception(e.message);
    }
  }
}

module.exports = ConditionBody;
