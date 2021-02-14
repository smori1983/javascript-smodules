const Hash = require('./data.hash');

class FilterManager {
  constructor() {
    this.filters = new Hash();
  }

  /**
   * @param {string} name
   * @param {function} func
   */
  register(name, func) {
    if (typeof func === 'function') {
      this.filters.add(name, func);
    }
  }

  /**
   * @param {string} name
   * @return {function}
   * @throws {Error}
   */
  get(name) {
    if (this.filters.has(name)) {
      return this.filters.get(name);
    }

    throw new Error('filter "' + name + '" not found');
  }
}

module.exports = FilterManager;
