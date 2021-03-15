class ConditionReversePolishHistory {
  constructor() {
    this._history = ['start'];
  }

  /**
   * @param {string} type
   * @throws {Error}
   */
  add(type) {
    if (type === 'comp' && this._get(2) === 'comp') {
      throw new Error('can not write comparer here');
    }

    this._history.push(type);

    if (this._calcRoundBracketBalance() < 0) {
      throw new Error('can not use ")" here');
    }
  }

  /**
   * @return {string|null}
   */
  latest() {
    return this._get(1);
  }

  /**
   * @throws {Error}
   */
  finish() {
    if (this._calcRoundBracketBalance() !== 0) {
      throw new Error('invalid usage of round bracket');
    }
    if (this._calcOperandOperatorBalance() !== 1) {
      throw new Error('invalid usage of operand or operator');
    }
  }

  /**
   * @param {number} index
   * @return {string|null}
   * @private
   */
  _get(index) {
    return this._history[this._history.length - index] || null;
  }

  /**
   * @return {number}
   * @private
   */
  _calcRoundBracketBalance() {
    let balance = 0;

    this._history.forEach((type) => {
      if (type === 'round_bracket_open') {
        balance++;
      } else if (type === 'round_bracket_close') {
        balance--;
      }
    });

    return balance;
  }

  /**
   * @return {number}
   * @private
   */
  _calcOperandOperatorBalance() {
    let balance = 0;

    this._history.forEach((type) => {
      if (type === 'var' || type === 'value') {
        balance++;
      } else if (type === 'comp' || type === 'andor') {
        balance--;
      }
    });

    return balance;
  }
}

module.exports = ConditionReversePolishHistory;
