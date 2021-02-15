const Hash = require('./data.hash');

class QueueHash {
  constructor() {
    this.hash = new Hash();
  }

  /**
   * @param {string} key
   * @return {boolean}
   */
  has(key) {
    return this.hash.has(key);
  }

  /**
   * @param {string} key
   * @param {*} value
   */
  addTo(key, value) {
    const queue = this.hash.has(key) ? this.hash.get(key) : [];

    queue.push(value);

    this.hash.add(key, queue);
  }

  /**
   * @param {string} key
   */
  remove(key) {
    this.hash.remove(key);
  }

  clear() {
    this.hash.clear();
  }

  /**
   * @param {string} key
   * @return {number}
   */
  sizeOf(key) {
    if (this.hash.has(key)) {
      return this.hash.get(key).length;
    } else {
      return 0;
    }
  }

  /**
   * @param {string} key
   * @return {*}
   */
  getFrom(key) {
    if (this.hash.has(key)) {
      return this.hash.get(key).shift();
    }
  }

  /**
   * @return {string[]}
   */
  getKeys() {
    return this.hash.getKeys();
  }
}

module.exports = QueueHash;
