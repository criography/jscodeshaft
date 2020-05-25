export default (config, env, helpers) => {
  /**
   * For whatever reason setting these via babelrc doesn't work
   * @returns {void}
   */
  const enablePrismJs = () => {
    const {rule: {options: babelConfig}} = helpers.getLoadersByName(config, 'babel-loader')[0];

    babelConfig.plugins.push([
      require.resolve('babel-plugin-prismjs'), {
        "languages": ["javascript", "css", "markup", "js-extras", "js-templates", "jsx"],
        "plugins": ["line-numbers", "normalize-whitespace"],
        "theme": "tomorrow",
        "css": true,
      },
    ]);
  };

  enablePrismJs();
};
