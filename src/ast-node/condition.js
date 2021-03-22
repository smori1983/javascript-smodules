const AstNode = require('./ast-node');

class Condition extends AstNode {
  type() {
    return 'condition';
  }

  /**
   * @param {ParseContext} context
   * @return {AstNodeParseResult}
   */
  parse(context) {
    const branches = [];

    branches.push(context.parse('if'));

    while (context.read('elseif')) {
      branches.push(context.parse('elseif'));
    }

    if (context.read('else')) {
      branches.push(context.parse('else'));
    }

    context.parse('endif');

    return {
      type: this.type(),
      children: branches,
    };
  }
}

module.exports = Condition;
