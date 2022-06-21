import {
  createImportDeclaration,
  createNamedImportSpecifier,
} from '../../createNode';


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
  if (!importPath || !Array.isArray(moduleNames) || !moduleNames.length) {
    return;
  }

  const imports = root.find('ImportDeclaration');
  const matchedImport = imports.filter(
    ({node}) => isImportMatchedByImportPath(importPath, node.source.value),
  );


  // found matching imports -> extend them
  if (matchedImport.length) {
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
  );

  // some imports are found, lets add ours at the bottom
  if (imports.length) {
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
