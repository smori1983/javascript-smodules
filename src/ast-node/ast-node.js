class AstNode {
  /**
   * @return {string}
   */
  type() {
    return '';
  }

  /**
   * @param {ParseContext} context
   * @return {boolean}
   */
  read(context) {
    return false;
  }

  /**
   * @param {ParseContext} context
   * @return {Object}
   */
  parse(context) {
    return {};
  }
}

module.exports = AstNode;
