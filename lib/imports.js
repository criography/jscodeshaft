import {createImportSpecifier} from './createNode';

/**
 * @TODO needs support for mixed default and named import declarations
 */


/**
 * Find an import specifier matching the module in question
 * @param   {Node}    importNode
 * @returns {Boolean}
 */
export const hasFragment = (importNode) =>  importNode.specifiers.some(
  specifier => (
    specifier.type === 'ImportSpecifier'
    && specifier.imported.name === 'Fragment'
  )
);


/**
 * Ensure that Fragment is imported and exposed as `F`
 * @param   {function}  j     JSCodeShift instance
 * @param   {object}    root  AST-ified file content
 * @returns {void}
 */
export const  importFragment = (j, root) => {
  root
    .find('ImportDeclaration')
    .filter(({node}) => (
      node.source.value === 'react'
      && node.importKind === 'value'
      && !hasFragment(node)
    ))
    .forEach(({node}) => {
      node.specifiers.push(
        createImportSpecifier(j)('Fragment', 'F')
      );
    })
};


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
    if(!moduleName){
      return true;
    }

    return (
      importNode.specifiers && importNode.specifiers.find(specifier => (
        specifier.type === 'ImportSpecifier'
        && specifier.imported
        && specifier.imported.name === moduleName
      ))
    )
  };


  /**
   * Find an import path matching the importPath in question.
   * If no importPath argument is passed to the parent fn, this
   * test will match against `lendinvest-styleguide`.
   * If importPath argument is set as `false` to the parent,
   * this test will be ignored and will always return true.
   * @TODO remove default to make it platform agnostic
   * @param   {Node}              importNode
   * @param   {(RegExp|Boolean)}  [importPath]
   * @returns {Boolean}
   */
  const isMatchingPath = (importNode, importPath) => {
    if(importPath === false){
      return true;
    }

    return (
      Boolean(importPath)
      && (importPath || /^lendinvest-styleguide/).test(importNode.source.value)
    )
  }


  /**
   * Remove given moduleName from a collection of named imports
   * @param   {Node}  importNode
   * @returns {Node[]}
   */
  const getCleanedUpSpecifiers = importNode => importNode.specifiers.filter(
    specifier => specifier.imported.name !== moduleName
  );


  root
    .find('ImportDeclaration')
    .filter(({node}) => isMatchingName(node) && isMatchingPath(node))
    .forEach((path) => {
      // if multiple modules imported, remove the specifier
      if(path.node.specifiers.length > 1){
        path.node.specifiers = getCleanedUpSpecifiers(path.node);
        // if only 1 moduleName imported, remove whole import
      }else{
        j(path).remove()
      }
    });
};


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
    && importNode.specifiers[0].type==='ImportDefaultSpecifier'
  )


  /**
   * Find an import specifier (import name) matching the moduleName in question.
   * If a no moduleName argument is passed to the parent fn, this test will
   * be ignored and will return true.
   * @param   {Node}    importNode
   * @returns {Boolean}
   */
  const isMatchingName = (importNode) => {
    if(moduleName === false){
      return true
    }

    return importNode.specifiers[0].local.name === moduleName;
  }


  /**
   * Find an import path matching the importPath in question.
   * If no importPath argument is passed to the parent fn, this
   * test will be ignored and will return true.
   * @param   {Node}    importNode
   * @returns {Boolean}
   */
  const isMatchingPath = (importNode) => {
    if(importPath === false){
      return true
    }

    return importPath.test(importNode.specifiers[0].source.value);
  }


  root
    .find('ImportDeclaration')
    .filter(({node}) => (
      isExclusivelyDefaultImport(node)
      && isMatchingName(node)
      && isMatchingPath(node)
    ))
    .forEach((path) => {
      j(path).remove()
    });
}
