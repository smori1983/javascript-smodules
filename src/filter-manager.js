const Hash = require('./data.hash');

class FilterManager {
  constructor() {
    this._filters = new Hash();

    this._registerDefaultFilters();
  }

  /**
   * @param {string} name
   * @param {function} func
   */
  register(name, func) {
    if (typeof func === 'function') {
      this._filters.add(name, func);
    }
  }

  /**
   * @param {string} name
   * @return {function}
   * @throws {Error}
   */
  get(name) {
    if (this._filters.has(name)) {
      return this._filters.get(name);
    }

    throw new Error('filter "' + name + '" not found');
  }

  _registerDefaultFilters() {
    this.register('h', (() => {
      const list = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#039;', // eslint-disable-line quotes
      };

      return (value) => {
        if (typeof value === 'undefined' || value === null) {
          return '' + value;
        }
        return value.toString().replace(/[<>&"']/g, (matched) => {
          return list[matched];
        });
      };
    })());

    this.register('raw', (value) => {
      return value;
    });
  }
}

module.exports = FilterManager;
