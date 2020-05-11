const h = require('./lib');


module.exports = (fileInfo, api) => {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);


  /**
   * Do stuff
   * @returns {void}
   */
  const processJSX = () => {
    root.findJSXElements('div')
      .forEach(({node}) => {

      });
  };


  processJSX();
  console.log(h.astToSource(root));
};


module.exports.parser = 'flow';
