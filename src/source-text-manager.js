class SourceTextManager {
  /**
   * @param {string} sourceText
   */
  constructor(sourceText) {
    this._sourceText = sourceText;
    this._ptr = 0;
    this._ch = sourceText.charAt(0);
    this._len = sourceText.length;
    this._line = 1;
    this._at = 1;
  }

  /**
   * @return {boolean}
   */
  eatable() {
    return this._getPtr() < this._getLen();
  }

  /**
   * @return {number}
   * @private
   */
  _getPtr() {
    return this._ptr;
  }

  /**
   * @return {string}
   */
  getChar() {
    return this._ch;
  }

  /**
   * @param {string} value
   * @return {boolean}
   */
  charIs(value) {
    return this.getChar() === value;
  }

  /**
   * @param {RegExp} regexp
   * @return {boolean}
   */
  charMatch(regexp) {
    return regexp.test(this.getChar());
  }

  /**
   * @return {number}
   * @private
   */
  _getLen() {
    return this._len;
  }

  /**
   * @return {number}
   */
  getLine() {
    return this._line;
  }

  /**
   * @return {number}
   */
  getAt() {
    return this._at;
  }

  /**
   * @param {string} expr
   * @throws {Error}
   */
  next(expr) {
    expr = expr || this._ch;

    if (this.read(expr) === false) {
      throw new Error('syntax error');
    }

    this._position(expr);

    this._ptr += expr.length;
    this._ch = this._sourceText.charAt(this._ptr);

    return expr;
  }

  /**
   * @param {string} expr
   * @private
   */
  _position(expr) {
    let remaining = expr;

    while (remaining.length > 0) {
      if (remaining.slice(0, 1) === '\n') {
        this._line++;
        this._at = 1;
      } else {
        this._at++;
      }
      remaining = remaining.slice(1);
    }
  }

  /**
   * @return {string}
   */
  skipWhitespace() {
    let skipped = '';

    while (this.charMatch(/\s/)) {
      skipped = this.next(this.getChar());
    }

    return skipped;
  }

  /**
   * @param {string} expr
   * @return {boolean}
   */
  read(expr) {
    return this._sourceText.indexOf(expr, this._getPtr()) === this._getPtr();
  }

  /**
   * @param {RegExp} regexp
   * @return {boolean}
   */
  readRegexp(regexp) {
    return regexp.test(this._getText());
  }

  /**
   * @param {RegExp} regexp
   * @param {string} [errorMessage]
   * @return {RegExpMatchArray}
   * @throws {Error}
   */
  regexpMatched(regexp, errorMessage) {
    const result = this._getText().match(regexp);

    if (result === null && typeof errorMessage === 'string') {
      throw new Error(errorMessage);
    }

    return result;
  }

  /**
   * @return {string}
   * @private
   */
  _getText() {
    return this._sourceText.slice(this._getPtr());
  }
}

module.exports = SourceTextManager;
