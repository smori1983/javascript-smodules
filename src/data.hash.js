class Hash {
  constructor() {
    this._store = {};
  }

  /**
   * @param {string} key
   * @return {boolean}
   */
  has(key) {
    return this._store.hasOwnProperty(key);
  }

  /**
   * @param {string} key
   * @param {*} value
   */
  add(key, value) {
    this._store[key] = value;
  }

  /**
   * @param {string} key
   */
  remove(key) {
    if (this.has(key)) {
      delete this._store[key];
    }
  }

  clear() {
    this._store = {};
  }

  /**
   * @param {string} key
   * @return {*}
   */
  get(key) {
    return this._store[key];
  }

  /**
   * @return {string[]}
   */
  getKeys() {
    let keys = Object.keys(this._store);

    keys.sort();

    return keys;
  }
}

module.exports = Hash;
