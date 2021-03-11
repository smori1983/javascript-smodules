/**
 * @typedef {Object} AstNodeParseResult
 * @property {string} type
 * @property {string} [expr]
 * @property {string[]} [keys]
 * @property {AstNodeParseResult[]} [stack]
 * @property {*} [value]
 */

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
   * @return {AstNodeParseResult}
   */
  parse(context) {
    return {
      type: '__undefined__',
    };
  }
}

module.exports = AstNode;
