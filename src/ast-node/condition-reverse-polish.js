const History = require('./condition-reverse-polish-history');

class ConditionReversePolish {
  constructor() {
    // 'error' for sentinel.
    /* eslint-disable array-bracket-spacing */
    this._state = {
      'start':               ['round_bracket_open',                        'value', 'var',                  'error'],
      'round_bracket_open':  ['round_bracket_open',                        'value', 'var',                  'error'],
      'round_bracket_close': [                      'round_bracket_close',                         'andor', 'error'],
      'value':               [                      'round_bracket_close',                 'comp', 'andor', 'error'],
      'var':                 [                      'round_bracket_close',                 'comp', 'andor', 'error'],
      'comp':                [                                             'value', 'var',                  'error'],
      'andor':               ['round_bracket_open',                        'value', 'var',                  'error'],
    };
    /* eslint-enable */

    this._order = {
      'round_bracket_close': 1,
      'or':                  2,
      'and':                 3,
      'comp':                4,
      'value':               5,
      'var':                 5,
      'round_bracket_open':  6,
    };
  }

  /**
   * @param {ParseContext} context
   * @return {AstNodeParseResult[]}
   * @throws {Error}
   */
  parse(context) {
    const config = context.config();
    const tm = context.sourceTextManager();
    const history = new History();
    let next, polish = [], stack = [], stackTop;

    while (!tm.eof()) {
      if (tm.charIs(config.closeDelimiter())) {
        break;
      }

      // history has at least 'start' type at the beginning.
      next = this._parseNext(context, history.latest());

      history.add(next.type);

      while (stack.length > 0) {
        stackTop = stack.pop();

        if (next.order <= stackTop.order && stackTop.type !== 'round_bracket_open') {
          polish.push(stackTop);
        } else {
          stack.push(stackTop);
          break;
        }
      }

      if (next.type === 'round_bracket_close') {
        stack.pop();
      } else {
        stack.push(next);
      }

      tm.skipWhitespace();
    }

    while (stack.length > 0) {
      polish.push(stack.pop());
    }

    history.finish();

    return polish;
  }

  /**
   * @param {ParseContext} context
   * @param {string} sourceType
   * @return {AstNodeParseResult}
   * @private
   */
  _parseNext(context, sourceType) {
    const transitableTypes = this._state[sourceType];
    let i, size, type, result;

    for (i = 0, size = transitableTypes.length; i < size; i++) {
      type = transitableTypes[i];

      if (type === 'error') {
        throw new Error('invalid condition expression');
      }

      if (context.read(type)) {
        result = context.parse(type);
        result.order = this._getOrder(result);

        return result;
      }
    }
  }

  /**
   * @param node
   * @return {number}
   * @throws {Error}
   * @private
   */
  _getOrder(node) {
    // <andor> returns 'andor' for type.
    // Use 'expr' instead.
    const order = this._order[node.type] || this._order[node.expr];

    if (typeof order === 'undefined') {
      throw new Error('unknown node: ' + node);
    }

    return order;
  }
}

module.exports = ConditionReversePolish;
