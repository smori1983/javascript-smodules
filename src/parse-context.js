class ParseContext {
  /**
   * @param {ParseConfig} config
   * @param {SourceTextManager} stm
   */
  constructor(config, stm) {
    this._config = config;
    this._stm = stm;
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
   * @param {string} message
   * @throws {Error}
   */
  exception(message) {
    const tm = this.sourceTextManager();

    throw new Error('parser - ' + message + ' [' + tm.getLine() + ',' + tm.getAt() + ']');
  }
}

module.exports = ParseContext;
