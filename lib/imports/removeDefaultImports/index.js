/**
 * @typedef {function}              defaultImportArgs
 * @param   {string}  [module]      Module name. Set to false to ignore
 * @param   {RegExp}  [importPath]  Import path matcher. Set to false to ignore
 * @returns {void}
 *//**
 * Remove named imports
 * @param   {function}  j     JSCodeShift instance
 * @param   {object}    root  AST-ified file content
 * @returns {function(defaultImportArgs): void}
 */
export const removeDefaultImports = (j, root) => (moduleName, importPath) => {
  const isExclusivelyDefaultImport = (importNode) => (
    importNode.specifiers.length === 1
    && importNode.specifiers[0].type === 'ImportDefaultSpecifier'
  );


  /**
   * Find an import specifier (import name) matching the moduleName in question.
   * If a no moduleName argument is passed to the parent fn, this test will
   * be ignored and will return true.
   * @param   {Node}    importNode
   * @returns {Boolean}
   */
  const isMatchingName = (importNode) => {
    if (moduleName === false) {
      return true;
    }

    return importNode.specifiers[0].local.name === moduleName;
  };


  /**
   * Find an import path matching the importPath in question.
   * If no importPath argument is passed to the parent fn, this
   * test will be ignored and will return true.
   * @param   {Node}    importNode
   * @returns {Boolean}
   */
  const isMatchingPath = (importNode) => {
    if (importPath === false) {
      return true;
    }

    return importPath.test(importNode.specifiers[0].source.value);
  };


  root
    .find('ImportDeclaration')
    .filter(({node}) => (
      isExclusivelyDefaultImport(node)
      && isMatchingName(node)
      && isMatchingPath(node)
    ))
    .forEach((path) => {
      j(path).remove();
    });
};
