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
}

module.exports = ParseContext;
