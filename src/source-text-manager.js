const TextManager = require('./text-manager');

class SourceTextManager extends TextManager {
  /**
   * @param {string} sourceText
   */
  constructor(sourceText) {
    super(sourceText, 0, 1, 1);
  }
}

module.exports = SourceTextManager;
