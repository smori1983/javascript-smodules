const TextManager = require('./text-manager');

class LookaheadTextManager extends TextManager {
  /**
   * @param {string} sourceText
   * @param {number} ptr
   * @param {number} line
   * @param {number} at
   */
  constructor(sourceText, ptr, line, at) {
    super(sourceText, ptr, line, at);
  }

  /**
   * @return {LookaheadTextManager}
   */
  lookaheadTextManager() {
    return new LookaheadTextManager(
      this.getSourceText(),
      this.getPtr(),
      this.getLine(),
      this.getAt()
    );
  }
}

module.exports = LookaheadTextManager;
