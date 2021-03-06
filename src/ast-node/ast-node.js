/**
 * @typedef {Object} AstNodeParseResult
 * @property {string} type
 * @property {string} [expr]
 * @property {string[]} [keys]
 * @property {AstNodeParseResult[]} [stack]
 * @property {Object} [ctrl]
 * @property {*} [value]
 * @property {AstNodeParseResult[]} [children]
 */

/**
 * Base class for AST nodes.
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
   * @return {AstNodeParseResult}
   */
  parse(context) {
    return {
      type: '__undefined__',
    };
  }
}

module.exports = AstNode;
