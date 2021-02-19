class TextManager {
  /**
   * @param {string} sourceText
   * @param {number} ptr
   * @param {number} line
   * @param {number} at
   */
  constructor(sourceText, ptr, line, at) {
    this._sourceText = sourceText;
    this._ptr = ptr;
    this._ch = sourceText.charAt(ptr);
    this._len = sourceText.length;
    this._line = line;
    this._at = at;
  }

  /**
   * @return {string}
   */
  getSourceText() {
    return this._sourceText;
  }

  /**
   * @return {boolean}
   */
  eatable() {
    return this.getPtr() < this._getLen();
  }

  /**
   * @return {number}
   */
  getPtr() {
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
    return this._sourceText.indexOf(expr, this.getPtr()) === this.getPtr();
  }

  /**
   * @param {RegExp} regexp
   * @param {boolean} [throwError]
   * @return {boolean}
   * @throws {Error}
   */
  readRegexp(regexp, throwError) {
    const result = regexp.test(this._getText());

    if (result === false && throwError === true) {
      throw new Error();
    }

    return result;
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
    return this._sourceText.slice(this.getPtr());
  }
}

module.exports = TextManager;