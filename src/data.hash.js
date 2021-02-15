class Hash {
  constructor() {
    this.store = {};
  }

  /**
   * @param {string} key
   * @return {boolean}
   */
  has(key) {
    return this.store.hasOwnProperty(key);
  }

  /**
   * @param {string} key
   * @param {*} value
   */
  add(key, value) {
    this.store[key] = value;
  }

  /**
   * @param {string} key
   */
  remove(key) {
    if (this.has(key)) {
      delete this.store[key];
    }
  }

  clear() {
    this.store = {};
  }

  /**
   * @param {string} key
   * @return {*}
   */
  get(key) {
    return this.store[key];
  }

  /**
   * @return {string[]}
   */
  getKeys() {
    let keys = Object.keys(this.store);

    keys.sort();

    return keys;
  }
}

module.exports = Hash;
