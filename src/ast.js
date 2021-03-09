const Hash = require('./data.hash');

const DelimiterOpen = require('./ast-node/delimiter-open');
const DelimiterClose = require('./ast-node/delimiter-close');
const LiteralOpen = require('./ast-node/literal-open');
const Literal = require('./ast-node/literal');
const LiteralClose = require('./ast-node/literal-close');
const TempVar = require('./ast-node/temp-var');
const Variable = require('./ast-node/variable');
const ValueNull = require('./ast-node/value-null');
const ValueBool = require('./ast-node/value-bool');
const ValueString = require('./ast-node/value-string');
const ValueNumber = require('./ast-node/value-number');
const Value = require('./ast-node/value');

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
    this._registerNode(new LiteralOpen());
    this._registerNode(new Literal());
    this._registerNode(new LiteralClose());
    this._registerNode(new TempVar());
    this._registerNode(new Variable());
    this._registerNode(new ValueNull());
    this._registerNode(new ValueBool());
    this._registerNode(new ValueString());
    this._registerNode(new ValueNumber());
    this._registerNode(new Value());
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
