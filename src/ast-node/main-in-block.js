const MainBase = require('./main-base');

class MainInBlock extends MainBase {
  type() {
    return 'main_in_block';
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
    const children = [];
    const tm = context.sourceTextManager();

    while (!tm.eof()) {
      if (context.read('elseif') || context.read('else') || context.read('endif') || context.read('endfor')) {
        break;
      }

      children.push(this._parseOne(context));
    }

    return {
      type: this.type(),
      children: children,
    };
  }
}

module.exports = MainInBlock;
