import {
  createImportDeclaration,
  createNamedImportSpecifier,
} from './createNode';
import { isStringMatching } from './general';


/**
 * @TODO needs support for mixed default and named import declarations
 */


/**
 * Determines if given importNode matches against given importPathMatcher.
 * Returns false on unsupported values.
 * @param   {RegExp|string}   importPathMatcher
 * @param   {Node}            importNode
 * @returns {boolean}
 */
export const isImportMatchedByImportPath = (importPathMatcher, importNode) => {
  const pathString = importNode?.source?.value;

  return importNode
    ? isStringMatching(pathString, importPathMatcher)
    : false
}


/**
 * Extracts all imported names from given import.
 * @param   {Node}  importNode
 * @param   {('ImportDefaultSpecifier'|'ImportSpecifier')}  [type]
 * @returns {Node[]}
 */
export const getSpecifierNamesFromImport = (importNode, type) => {
  const output = {};

  importNode.specifiers.forEach(specifier => {
    if(!type || type === specifier.type){
      output[specifier.imported.name] = {
        alias: specifier?.local?.name || undefined,
        type: specifier.type,
      };
    }
  });

  return output;
};


/**
 * @typedef {function}  isImportedFromSourceArgs
 * @param   {string|RegExp}   specifierName   Module name.
 * @param   {string|RegExp}   importSource    Import source matcher.
 * @returns {boolean}
 *//**
 * Determine if {specifierName} has been imported from a specific {importSource},
 * which is a path or package name.
 * This is useful if, for example, your codebase has multiple components
 * with the same name (internal or external) and you want to confirm you're
 * processing the right one.
 * @param   {object}    root  AST-ified file content
 * @returns {function(isImportedFromSourceArgs): boolean}
 */
export const isImportedFromSource = root => (specifierName, importSource) => Boolean(
  root
    .find('ImportDeclaration')
    .filter(({node}) => (
      isImportMatchedByImportPath(importSource, node)
      && Object
        .values(getSpecifierNamesFromImport(node))
        .filter(({alias}) => isStringMatching(alias, specifierName))
        .length
    ))
    .length
);


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
export const importFragment = (j, root) => {
  root
    .find('ImportDeclaration')
    .filter(({node}) => (
      node.source.value === 'react'
      && node.importKind === 'value'
      && !hasFragment(node)
    ))
    .forEach(({node}) => {
      node.specifiers.push(
        createNamedImportSpecifier(j)('Fragment', 'F')
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
   * test will match against `@lendinvest/styleguide`.
   * If importPath argument is set as `false` to the parent,
   * this test will be ignored and will always return true.
   * @TODO remove default to make it platform agnostic
   * @param   {Node}    importNode
   * @returns {Boolean}
   */
  const isMatchingPath = (importNode) => {
    if(importPath === false){
      return true;
    }

    return (
      Boolean(importPath)
      && (importPath || /^@lendinvest\/styleguide/).test(importNode.source.value)
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


/**
 * Determines the type of import node as one of the following:
 * 'mixed', 'default' or 'named'.
 * @param   {Node}  importNode
 * @returns {string}
 */
export const getImportTypes = importNode => {
  let isDefault = false;
  let isNamed = false;

  importNode.specifiers.some(specifier => {
    if(specifier.type === 'ImportSpecifier'){
      isNamed = true;
    }
  })  ;
  importNode.specifiers.some(specifier => {
    if(specifier.type === 'ImportDefaultSpecifier'){
      isDefault = true;
    }
  });

  if(isDefault){
    return isNamed ? 'mixed' : 'default';
  }
  return 'named';
}


/**
 * @typedef {function}        addNamedImportArgs
 * @param   {(RegExp|string)} importPath    Import path matcher
 * @param   {string[]}        moduleNames   Module names. Set to false to ignore
 * @returns {void}
 *//**
 * @TODO allow for custom append spot
 * 1. Default import found: add named import
 * 2. Mixed (default + named) import found: append names to named part
 * 3. Named import found: append names
 * 4. No matched import found: create named import and append it
 *    at the end of the import list
 * 2. No import found create named import at the top of the file
 * @param   {function}  j     JSCodeShift instance
 * @param   {object}    root  AST-ified file content
 * @returns {function(addNamedImportArgs): void}
 */
export const addNamedImports = (j, root) => (importPath, moduleNames) => {
  if(!importPath || !Array.isArray(moduleNames) || !moduleNames.length){
    return;
  }

  const imports = root.find('ImportDeclaration');
  const matchedImport = imports.filter(
    ({node}) => isImportMatchedByImportPath(importPath, node.source.value)
  )


  // found matching imports -> extend them
  if(matchedImport.length){
    matchedImport.forEach(({node}) => {
      const existingNames = Object.keys(getSpecifierNamesFromImport(node));
      const uniqueImportSpecifiers = moduleNames
        .filter(moduleName => !existingNames.includes(moduleName))
        .map(moduleName => createNamedImportSpecifier(j)(moduleName));

      node.specifiers.push(...uniqueImportSpecifiers);
    });

    return;
  }

  // no match found - create new import
  const newImportDeclaration = createImportDeclaration(j)(
    moduleNames.map(moduleName => createNamedImportSpecifier(j)(moduleName)),
    importPath,
  )

  // some imports are found, lets add ours at the bottom
  if(imports.length){
    imports
      .paths()[imports.length - 1]
      .insertAfter(newImportDeclaration);

    return;
  }

  // no imports found, let's create one at the top of the file.
  root
    .get()
    .node
    .program
    .body
    .unshift(newImportDeclaration);

};
