class Evaluator {
  /**
   * @param {FilterManager} filterManager
   */
  constructor(filterManager) {
    this._filterManager = filterManager;
  }

  /**
   * @param {Object[]} nodes
   * @param {Object[]} params
   * @return {string}
   */
  evaluate(nodes, params) {
    return this._loop(nodes, params);
  }

  /**
   * @param {Object[]} nodes
   * @param {Object[]} params
   * @return {string}
   * @private
   */
  _loop(nodes, params) {
    let result = '';

    nodes.forEach((node) => {
      if (node.type === 'normal' || node.type === 'literal') {
        result += node.value;
      } else if (node.type === 'holder') {
        result += this._applyFilters(this._getValue(node.keys, params), node.filters);
      } else if (node.type === 'condition') {
        result += this._evaluateCondition(node, params);
      } else if (node.type === 'for') {
        result += this._evaluateFor(node, params);
      }
    });

    return result;
  }

  /**
   * @param {*} value
   * @param {Object[]} filters
   * @return {*}
   * @private
   */
  _applyFilters(value, filters) {
    let result = value;

    filters.forEach((filter) => {
      result = this._filterManager.get(filter.name).apply(null, [result].concat(filter.args));
    });

    return result;
  }

  /**
   * @param {string[]} keys
   * @param {*[]} params
   * @param {boolean} [asis]
   * @return {string|*}
   * @private
   */
  _getValue(keys, params, asis) {
    let pIdx, i, len, value;

    for (pIdx = params.length - 1; pIdx >= 0; pIdx--) {
      value = params[pIdx];
      for (i = 0, len = keys.length; i < len; i++) {
        if (typeof value[keys[i]] === 'undefined') {
          value = null;
          break;
        } else {
          value = value[keys[i]];
        }
      }
      if (i === len) {
        break;
      }
    }

    if (asis) {
      return value;
    } else {
      return value === null ? '' : value.toString();
    }
  }

  /**
   * @param {Object} node
   * @param {Object[]} params
   * @return {string}
   * @private
   */
  _evaluateCondition(node, params) {
    let i, len, branch;
    let result = '';

    for (i = 0, len = node.branches.length; i < len; i++) {
      branch = node.branches[i];

      if (branch.type === 'if' || branch.type === 'elseif') {
        if (this._evaluateConditionBranch(branch.ctrl.stack, params)) {
          result = this._loop(branch.children, params);
          break;
        }
      } else {
        result = this._loop(branch.children, params);
      }
    }

    return result;
  }

  /**
   * @param {Object[]} nodeStack
   * @param {Object[]} params
   * @return {*}
   * @throws {Error}
   * @private
   */
  _evaluateConditionBranch(nodeStack, params) {
    let result = [], i, len, node, lval, rval;

    for (i = 0, len = nodeStack.length; i < len; i++) {
      node = nodeStack[i];

      if (node.type === 'value') {
        result.push(node.value);
      } else if (node.type === 'var') {
        result.push(this._getValue(node.keys, params, true));
      } else if (node.type === 'comp') {
        rval = result.pop();
        lval = result.pop();
        result.push(this._evaluateComp(lval, rval, node.expr));
      } else if (node.type === 'andor') {
        rval = result.pop();
        lval = result.pop();
        result.push(this._evaluateAndOr(lval, rval, node.expr));
      } else {
        throw new Error('unknown node type');
      }
    }

    if (result.length !== 1) {
      throw new Error('invalid condition expression');
    }

    return result[0];
  }

  /**
   * @param {*} lval
   * @param {*} rval
   * @param {string} operator
   * @return {boolean}
   * @throws {Error}
   * @private
   */
  _evaluateComp(lval, rval, operator) {
    if (operator === '===') {
      return lval === rval;
    } else if (operator === '==') {
      return lval == rval; // eslint-disable-line eqeqeq
    } else if (operator === '!==') {
      return lval !== rval;
    } else if (operator === '!=') {
      return lval != rval; // eslint-disable-line eqeqeq
    } else if (operator === 'lte') {
      return lval <= rval;
    } else if (operator === 'lt') {
      return lval < rval;
    } else if (operator === 'gte') {
      return lval >= rval;
    } else if (operator === 'gt') {
      return lval > rval;
    } else {
      throw new Error('invalid comparer');
    }
  }

  /**
   * @param {*} lval
   * @param {*} rval
   * @param {string} operator
   * @return {boolean}
   * @private
   */
  _evaluateAndOr(lval, rval, operator) {
    if (operator === 'and') {
      return lval && rval;
    } else if (operator === 'or') {
      return lval || rval;
    } else {
      throw new Error('unknown operator');
    }
  }

  /**
   * @param {Object} node
   * @param {Object[]} params
   * @return {string}
   * @private
   */
  _evaluateFor(node, params) {
    const collection = this._getValue(node.ctrl.keys, params, true);
    let result = '';

    if (Array.isArray(collection)) {
      collection.forEach((value, idx) => {
        const additional = {};

        if (node.ctrl.tmp_k) {
          additional[node.ctrl.tmp_k] = idx;
        }
        additional[node.ctrl.tmp_v] = value;

        params.push(additional);
        result += this._loop(node.children, params);
        params.pop();
      });
    }

    return result;
  }
}

module.exports = Evaluator;