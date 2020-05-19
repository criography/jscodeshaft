export default (config, env, helpers) => {
  let { rule } = helpers.getLoadersByName(config, 'babel-loader')[0];
  let babelConfig = rule.options;

  babelConfig.plugins.push([require.resolve('babel-plugin-prismjs'), {
    "languages": ["javascript", "css", "markup", "js-extras", "js-templates", "jsx"],
    "plugins": ["line-numbers", "normalize-whitespace"],
    "theme": "tomorrow",
    "css": true
  }]);
};
