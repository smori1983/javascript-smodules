const MainBase = require('./main-base');

class Main extends MainBase {
  type() {
    return 'main';
  }

  /**
   * @param {ParseContext} context
   * @return {AstNodeParseResult}
   */
  parse(context) {
    const children = [];
    const tm = context.sourceTextManager();

    while (!tm.eof()) {
      children.push(this._parseOne(context));
    }

    return {
      type: this.type(),
      children: children,
    };
  }
}

module.exports = Main;
