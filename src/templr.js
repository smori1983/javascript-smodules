const Evaluator = require('./evaluator');
const FilterManager = require('./filter-manager');
const Hash = require('./data.hash');
const Parser = require('./parser');

class Templr {
  constructor() {
    this._templates = new Hash();

    this._filterManager = new FilterManager();
    this._evaluator = new Evaluator(this._filterManager);
    this._parser = new Parser();
  }

  /**
   * @param {string} cacheId
   * @return {boolean}
   */
  hasCache(cacheId) {
    return this._templates.has(cacheId);
  }

  /**
   * @param {string} cacheId
   * @param {string} source
   */
  registerCache(cacheId, source) {
    const ast = this._parser.parse(source);

    this._templates.add(cacheId, ast);
  }

  clearCache() {
    this._templates.clear();
  }

  /**
   * @param {string} source
   * @param {Object} param
   * @return {string}
   */
  render(source, param) {
    const ast = this._parser.parse(source);

    return this._evaluator.evaluate(ast, [param]);
  }

  /**
   * @param {string} cacheId
   * @param {Object} param
   * @return {string}
   * @throws {Error}
   */
  renderCached(cacheId, param) {
    if (!this._templates.has(cacheId)) {
      throw new Error('template identified by "' + cacheId + '" not registered.');
    }

    const ast = this._templates.get(cacheId);

    return this._evaluator.evaluate(ast, [param]);
  }

  /**
   * @param {string} name
   * @param {function} func
   */
  addFilter(name, func) {
    this._filterManager.register(name, func);
  }
}

module.exports = Templr;
