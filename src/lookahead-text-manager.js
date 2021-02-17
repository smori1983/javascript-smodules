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
}

module.exports = LookaheadTextManager;
