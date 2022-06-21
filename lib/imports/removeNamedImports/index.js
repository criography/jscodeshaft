/**
 * @typedef {function}  namedImportArgs
 * @param   {string}    [module]          Module name. Set to false to ignore
 * @param   {RegExp}    [importPath]      Import path matcher. Set to false to ignore
 * @returns {void}
 *//**
 * Remove named imports
 * @param   {function}  j     JSCodeShift instance
 * @param   {object}    root  AST-ified file content
 * @returns {function(namedImportArgs): void}
 */
export const removeNamedImports = (j, root) => (moduleName, importPath) => {
  /**
   * Find an import specifier (import name) matching the moduleName in question.
   * If a falsy moduleName argument is passed to the parent fn, this test will
   * be ignored and will return true.
   * @param   {Node}    importNode
   * @returns {Boolean}
   */
  const isMatchingName = (importNode) => {
    if (!moduleName) {
      return true;
    }

    return (
      importNode.specifiers && importNode.specifiers.find(specifier => (
      specifier.type === 'ImportSpecifier'
      && specifier.imported
      && specifier.imported.name === moduleName
      ))
    );
  };


  /**
   * Find an import path matching the importPath in question.
   * If no importPath argument is passed to the parent fn, this
   * test will match against `@lendinvest/styleguide`.
   * If importPath argument is set as `false` to the parent,
   * this test will be ignored and will always return true.
   * @TODO remove default to make it platform agnostic
   * @param   {Node}    importNode
   * @returns {Boolean}
   */
  const isMatchingPath = (importNode) => {
    if (importPath === false) {
      return true;
    }

    return (
      Boolean(importPath)
      && (importPath || /^@lendinvest\/styleguide/).test(importNode.source.value)
    );
  };


  /**
   * Remove given moduleName from a collection of named imports
   * @param   {Node}  importNode
   * @returns {Node[]}
   */
  const getCleanedUpSpecifiers = importNode => importNode.specifiers.filter(
    specifier => specifier.imported.name !== moduleName,
  );


  root
    .find('ImportDeclaration')
    .filter(({node}) => isMatchingName(node) && isMatchingPath(node))
    .forEach((path) => {
      // if multiple modules imported, remove the specifier
      if (path.node.specifiers.length > 1) {
        path.node.specifiers = getCleanedUpSpecifiers(path.node);
        // if only 1 moduleName imported, remove whole import
      } else {
        j(path).remove();
      }
    });
};
