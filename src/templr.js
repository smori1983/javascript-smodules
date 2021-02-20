const Evaluator = require('./evaluator');
const FilterManager = require('./filter-manager');
const parser = require('./parser');

class Templr {
  constructor() {
    this._filterManager = new FilterManager();
    this._evaluator = new Evaluator(this._filterManager);
    this._parser = parser.init();
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
}

module.exports = Templr;
