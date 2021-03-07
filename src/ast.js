const Hash = require('./data.hash');

const DelimiterOpen = require('./ast-node/delimiter-open');
const DelimiterClose = require('./ast-node/delimiter-close');

class Ast {
  constructor() {
    this._nodes = new Hash();
    this._prepare();
  }

  /**
   * @param {string} type
   * @return {AstNode}
   * @throws {Error}
   */
  node(type) {
    if (this._nodes.has(type)) {
      return this._nodes.get(type);
    }

    throw new Error('Ast node definition not found: ' + type);
  }

  /**
   * @private
   */
  _prepare() {
    this._registerNode(new DelimiterOpen());
    this._registerNode(new DelimiterClose());
  }

  /**
   * @param {AstNode} node
   * @private
   */
  _registerNode(node) {
    this._nodes.add(node.type(), node);
  }
}

module.exports = Ast;
