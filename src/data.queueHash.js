const Hash = require('./data.hash');

class QueueHash {
  constructor() {
    this._hash = new Hash();
  }

  /**
   * @param {string} key
   * @param {*} value
   */
  pushTo(key, value) {
    const queue = this._hash.has(key) ? this._hash.get(key) : [];

    queue.push(value);

    this._hash.add(key, queue);
  }

  /**
   * @param {string} key
   * @return {number}
   */
  sizeOf(key) {
    if (this._hash.has(key)) {
      return this._hash.get(key).length;
    } else {
      return 0;
    }
  }

  /**
   * @param {string} key
   * @return {*}
   */
  popFrom(key) {
    if (this._hash.has(key)) {
      return this._hash.get(key).shift();
    }
  }

  /**
   * @param {string} key
   * @return {boolean}
   */
  has(key) {
    return this._hash.has(key);
  }

  /**
   * @param {string} key
   */
  remove(key) {
    this._hash.remove(key);
  }

  clear() {
    this._hash.clear();
  }

  /**
   * @return {string[]}
   */
  getKeys() {
    return this._hash.getKeys();
  }
}

module.exports = QueueHash;
