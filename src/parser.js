const Ast = require('./ast');
const ParseConfig = require('./parse-config');
const ParseContext = require('./parse-context');
const SourceTextManager = require('./source-text-manager');

class Parser {
  /**
   * @param {string} text
   * @return {AstNodeParseResult[]}
   */
  parse(text) {
    const config = new ParseConfig();
    const sourceTextManager = new SourceTextManager(text);
    const ast = new Ast();
    const context = new ParseContext(config, sourceTextManager, ast);

    return context.parse('main').children;
  }
}

module.exports = Parser;
