class ParseContext {
  /**
   * @param {ParseConfig} config
   * @param {SourceTextManager} stm
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
   * @return {SourceTextManager}
   */
  sourceTextManager() {
    return this._stm;
  }

  /**
   * @return {Ast}
   */
  ast() {
    return this._ast;
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
