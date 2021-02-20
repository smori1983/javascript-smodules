const FilterManager = require('./filter-manager');
const Evaluator = require('./evaluator');
const parser = require('./parser');

/**
 * @param {string} source
 * @param {Object} param
 * @return {string}
 */
const render = (source, param) => {
  const filterManager = new FilterManager();
  const evaluator = new Evaluator(filterManager);
  const ast = parser.init().parse(source);

  return evaluator.evaluate(ast, [param]);
};

module.exports.render = render;
