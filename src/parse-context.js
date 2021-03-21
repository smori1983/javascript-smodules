class ParseContext {
  /**
   * @param {ParseConfig} config
   * @param {TextManager} stm
   * @param {Ast} ast
   */
  constructor(config, stm, ast) {
    this._config = config;
    this._stm = stm;
    this._ast = ast;
  }

  /**
   * @return {ParseConfig}
   */
  config() {
    return this._config;
  }

  /**
   * @return {TextManager}
   */
  sourceTextManager() {
    return this._stm;
  }

  /**
   * @return {LookaheadTextManager}
   */
  lookaheadTextManager() {
    return this.sourceTextManager().lookaheadTextManager();
  }

  /**
   * @return {Ast}
   */
  ast() {
    return this._ast;
  }

  /**
   * @param {string} type
   * @return {AstNode}
   */
  astNode(type) {
    return this.ast().node(type);
  }

  /**
   * @param {string} type
   * @return {boolean}
   */
  read(type) {
    const lookaheadContext = new ParseContext(
      this.config(),
      this.lookaheadTextManager(),
      this.ast()
    );

    try {
      this.astNode(type).parse(lookaheadContext);

      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * @param {string} type
   * @return {AstNodeParseResult}
   */
  parse(type) {
    return this.astNode(type).parse(this);
  }

  /**
   * @param {string} message
   * @throws {Error}
   */
  exception(message) {
    const tm = this.sourceTextManager();

    throw new Error('parser - ' + message + ' [' + tm.getLine() + ',' + tm.getAt() + ']');
  }
}

module.exports = ParseContext;
