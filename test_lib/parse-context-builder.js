const Ast = require('./../src/ast');
const ParseConfig = require('./../src/parse-config');
const ParseContext = require('./../src/parse-context');
const SourceTextManager = require('./../src/source-text-manager');

/**
 * @param {string} text
 * @return {ParseContext}
 */
const build = (text) => {
  const config = new ParseConfig();
  const sourceTextManager = new SourceTextManager(text);
  const ast = new Ast();

  return new ParseContext(config, sourceTextManager, ast);
};

module.exports.build = build;
