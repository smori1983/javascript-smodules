const AstNode = require('./ast-node');

class Filter extends AstNode {
  type() {
    return 'filter';
  }

  /**
   * @param {ParseContext} context
   * @return {boolean}
   */
  read(context) {
    return true;
  }

  /**
   * @param {ParseContext} context
   * @return {AstNodeParseResult}
   */
  parse(context) {
    return {
      type: this.type(),
      name: this._nameSection(context),
      args: this._argumentSection(context),
    };
  }

  /**
   * @param {ParseContext} context
   * @throws {Error}
   */
  _nameSection(context) {
    const tm = context.sourceTextManager();
    let name = '';

    tm.skipWhitespace();

    while (tm.charMatch(/[\w-]/)) {
      name += tm.next(tm.getChar());
    }

    if (name === '') {
      throw new Error('filter name not found');
    }

    return name;
  }

  /**
   * @param {ParseContext} context
   * @throws {Error}
   */
  _argumentSection(context) {
    const config = context.config();
    const tm = context.sourceTextManager();
    const args = [];

    tm.skipWhitespace();

    if (tm.charIs(':')) {
      tm.next(':');

      while (!tm.eof()) {
        tm.skipWhitespace();

        if (context.read('value') === false) {
          throw new Error('invalid filter args');
        }

        args.push(context.parse('value').value);

        tm.skipWhitespace();

        if (tm.charIs(',')) {
          tm.next(',');
        } else if (tm.charIs('|') || tm.charIs(config.closeDelimiter())) {
          break;
        } else {
          throw new Error('invalid filter args expression');
        }
      }
    }

    return args;
  }
}

module.exports = Filter;
