const TextManager = require('./text-manager');
const LookaheadTextManager = require('./lookahead-text-manager');

class SourceTextManager extends TextManager {
  /**
   * @param {string} sourceText
   */
  constructor(sourceText) {
    super(sourceText, 0, 1, 1);
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

module.exports = SourceTextManager;
