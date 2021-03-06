const Hash = require('./data.hash');

const Main = require('./ast-node/main');
const MainInBlock = require('./ast-node/main-in-block');
const DelimiterOpen = require('./ast-node/delimiter-open');
const DelimiterClose = require('./ast-node/delimiter-close');
const Normal = require('./ast-node/normal');
const LiteralOpen = require('./ast-node/literal-open');
const Literal = require('./ast-node/literal');
const LiteralClose = require('./ast-node/literal-close');
const Holder = require('./ast-node/holder');
const Filter = require('./ast-node/filter');
const FilterChain = require('./ast-node/filter-chain');
const TempVar = require('./ast-node/temp-var');
const Variable = require('./ast-node/variable');
const ValueNull = require('./ast-node/value-null');
const ValueBool = require('./ast-node/value-bool');
const ValueString = require('./ast-node/value-string');
const ValueNumber = require('./ast-node/value-number');
const Value = require('./ast-node/value');
const OperatorLogical = require('./ast-node/operator-logical');
const OperatorComparison = require('./ast-node/operator-comparison');
const RoundBracketOpen = require('./ast-node/round-bracket-open');
const RoundBracketClose = require('./ast-node/round-bracket-close');
const Condition = require('./ast-node/condition');
const ConditionIf = require('./ast-node/condition-if');
const ConditionElseif = require('./ast-node/condition-elseif');
const ConditionElse = require('./ast-node/condition-else');
const ConditionEndif = require('./ast-node/condition-endif');
const ConditionBody = require('./ast-node/condition-body');
const ForLoop = require('./ast-node/for-loop');
const ForLoopOpen = require('./ast-node/for-loop-open');
const ForLoopClose = require('./ast-node/for-loop-close');
const ForLoopBody = require('./ast-node/for-loop-body');
const ForLoopBodyWithValue = require('./ast-node/for-loop-body-with-value');
const ForLoopBodyWithKeyAndValue = require('./ast-node/for-loop-body-with-key-and-value');

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
    this._registerNode(new Main());
    this._registerNode(new MainInBlock());
    this._registerNode(new DelimiterOpen());
    this._registerNode(new DelimiterClose());
    this._registerNode(new Normal());
    this._registerNode(new LiteralOpen());
    this._registerNode(new Literal());
    this._registerNode(new LiteralClose());
    this._registerNode(new Holder());
    this._registerNode(new Filter());
    this._registerNode(new FilterChain());
    this._registerNode(new TempVar());
    this._registerNode(new Variable());
    this._registerNode(new ValueNull());
    this._registerNode(new ValueBool());
    this._registerNode(new ValueString());
    this._registerNode(new ValueNumber());
    this._registerNode(new Value());
    this._registerNode(new OperatorLogical());
    this._registerNode(new OperatorComparison());
    this._registerNode(new RoundBracketOpen());
    this._registerNode(new RoundBracketClose());
    this._registerNode(new Condition());
    this._registerNode(new ConditionIf());
    this._registerNode(new ConditionElseif());
    this._registerNode(new ConditionElse());
    this._registerNode(new ConditionEndif());
    this._registerNode(new ConditionBody());
    this._registerNode(new ForLoop());
    this._registerNode(new ForLoopOpen());
    this._registerNode(new ForLoopClose());
    this._registerNode(new ForLoopBody());
    this._registerNode(new ForLoopBodyWithValue());
    this._registerNode(new ForLoopBodyWithKeyAndValue());
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
