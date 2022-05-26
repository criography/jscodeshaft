import {
  createImportDeclaration,
  createNamedImportSpecifier,
} from "./createNode";



  /**
   * checks if the given node is a default import declaration
   * @param {Node} importNode
   * @returns {boolean}
   */
   export const isExclusivelyDefaultImport = (importNode) => (
   importNode.specifiers.length === 1 &&
   importNode.specifiers[0].type === "ImportDefaultSpecifier"
   );

/**
 * @TODO needs support for mixed default and named import declarations
 */

/**
 * Determines if given importNode matches against given importPath.
 * Returns false on unsupported values.
 * @param   {RegExp|string}   importPath
 * @param   {Node}            importNode
 * @returns {boolean}
 */
export const isImportMatchedByImportPath = (importPath, importNode) => {
  let _regEx;

  if (typeof importPath === "string") {
    _regEx = new RegExp(importPath);
  } else if (importPath instanceof RegExp) {
    _regEx = importPath;
  }
  return _regEx && importNode ? _regEx.test(importNode) : false;
};

/**
 * Extracts all imported names from given import.
 * @param   {Node}  importNode
 * @param   {('ImportDefaultSpecifier'|'ImportSpecifier')}  [type]
 * @returns {Node[]}
 */
export const getSpecifierNamesFromImport = (importNode, type) => {
  const output = {};

  importNode.specifiers.forEach((specifier) => {
    if (!type || type === specifier.type) {
      output[specifier.imported.name] = {
        alias: specifier?.local?.name || undefined,
        type: specifier.type,
      };
    }
  });

  return output;
};

/**
 * Find an import specifier matching the module in question
 * @param   {Node}    importNode
 * @returns {Boolean}
 */
export const hasFragment = (importNode) =>
  importNode.specifiers.some(
    (specifier) =>
      specifier.type === "ImportSpecifier" &&
      specifier.imported.name === "Fragment"
  );

/**
 * Ensure that Fragment is imported and exposed as `F`
 * @param   {function}  j     JSCodeShift instance
 * @param   {object}    root  AST-ified file content
 * @returns {void}
 */
export const importFragment = (j, root) => {
  root
    .find("ImportDeclaration")
    .filter(
      ({ node }) =>
        node.source.value === "react" &&
        node.importKind === "value" &&
        !hasFragment(node)
    )
    .forEach(({ node }) => {
      node.specifiers.push(createNamedImportSpecifier(j)("Fragment", "F"));
    });
};

/**
 * @typedef {function}  namedImportArgs
 * @param   {string}    [module]          Module name. Set to false to ignore
 * @param   {RegExp}    [importPath]      Import path matcher. Set to false to ignore
 * @returns {void}
 */ /**
 * Remove named imports
 * @param   {function}  j     JSCodeShift instance
 * @param   {object}    root  AST-ified file content
 * @returns {function(namedImportArgs): void}
 */
export const removeNamedImports = (j, root) => (moduleName, importPath) => {
  /**
   * Remove given moduleName from a collection of named imports
   * @param   {Node}  importNode
   * @returns {Node[]}
   */
  const getCleanedUpSpecifiers = (importNode) =>
    importNode.specifiers.filter(
      (specifier) => specifier.imported.name !== moduleName
    );
  getNamedImports(j, root, moduleName, importPath).forEach((path) => {
    // if multiple modules imported, remove the specifier
    if (path.node.specifiers.length > 1) {
      path.node.specifiers = getCleanedUpSpecifiers(path.node);
      // if only 1 moduleName imported, remove whole import
    } else {
      j(path).remove();
    }
  });
};

/**
   * Find an import specifier (import name) matching the moduleName in question.
   * If a falsy moduleName argument is passed to the parent fn, this test will
   * be ignored and will return true.
   * @param   {Node}    importNode
   * @param   {string}  moduleName
   * @returns {Boolean}
   */
 export const isImportIncludingSpecifier = (importNode, moduleName) => {
  if (!moduleName) {
    return true;
  }

  return isExclusivelyDefaultImport(importNode)
    ? importNode.specifiers[0].local.name === moduleName
    : importNode.specifiers &&
        importNode.specifiers.find(
          (specifier) =>
            specifier.type === "ImportSpecifier" &&
            specifier.imported &&
            specifier.imported.name === moduleName
        );
};

/**
 * Find an import path matching the importPath in question.
 * @param   {Node}    importNode
 * @param   {RegExp}  importPath ex: /^react/
 * @returns {Boolean}
 */
  export const isImportIncludingPath = (importNode, importPath) => {
  return importPath.test(importNode.source.value)
};

export const isNamedImportedFromPath = (j, root) => (moduleName, importPath) => {
    return getNamedImports(j, root, moduleName, importPath).length > 0;
};

export const isDefaultImportedFromPath = (j, root) => (moduleName, importPath) => {
    return getDefaultImports(j, root, moduleName, importPath).length > 0;
};

export const getNamedImports = (j, root, moduleName, importPath) => {
  return root
    .find("ImportDeclaration")
    .filter(
      ({ node }) =>  
        isImportIncludingSpecifier(node, moduleName) &&
        isImportIncludingPath(node, importPath) &&
        !isExclusivelyDefaultImport(node)
      
    );
};

export const getDefaultImports = (j, root, moduleName, importPath) => {
  return root
    .find("ImportDeclaration")
    .filter(
      ({ node }) =>
        isExclusivelyDefaultImport(node) &&
        isImportIncludingSpecifier(node, moduleName) &&
        isImportIncludingPath(node, importPath)
    );
};

/**
 * @typedef {function}              defaultImportArgs
 * @param   {string}  [module]      Module name. Set to false to ignore
 * @param   {RegExp}  [importPath]  Import path matcher. Set to false to ignore
 * @returns {void}
 */ /**
 * Remove named imports
 * @param   {function}  j     JSCodeShift instance
 * @param   {object}    root  AST-ified file content
 * @returns {function(defaultImportArgs): void}
 */
export const removeDefaultImports = (j, root) => (moduleName, importPath) => {
  getDefaultImports(j, root, moduleName, importPath).forEach((path) => {
    j(path).remove();
  });
};

/**
 * Determines the type of import node as one of the following:
 * 'mixed', 'default' or 'named'.
 * @param   {Node}  importNode
 * @returns {string}
 */
export const getImportTypes = (importNode) => {
  let isDefault = false;
  let isNamed = false;

  importNode.specifiers.some((specifier) => {
    if (specifier.type === "ImportSpecifier") {
      isNamed = true;
    }
  });
  importNode.specifiers.some((specifier) => {
    if (specifier.type === "ImportDefaultSpecifier") {
      isDefault = true;
    }
  });

  if (isDefault) {
    return isNamed ? "mixed" : "default";
  }
  return "named";
};

/**
 * @typedef {function}        addNamedImportArgs
 * @param   {(RegExp|string)} importPath    Import path matcher
 * @param   {string[]}        moduleNames   Module names. Set to false to ignore
 * @returns {void}
 */ /**
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

  const imports = root.find("ImportDeclaration");
  const matchedImport = imports.filter(({ node }) =>
    isImportMatchedByImportPath(importPath, node.source.value)
  );

  // found matching imports -> extend them
  if (matchedImport.length) {
    matchedImport.forEach(({ node }) => {
      const existingNames = Object.keys(getSpecifierNamesFromImport(node));
      const uniqueImportSpecifiers = moduleNames
        .filter((moduleName) => !existingNames.includes(moduleName))
        .map((moduleName) => createNamedImportSpecifier(j)(moduleName));

      node.specifiers.push(...uniqueImportSpecifiers);
    });

    return;
  }

  // no match found - create new import
  const newImportDeclaration = createImportDeclaration(j)(
    moduleNames.map((moduleName) => createNamedImportSpecifier(j)(moduleName)),
    importPath
  );

  // some imports are found, lets add ours at the bottom
  if (imports.length) {
    imports.paths()[imports.length - 1].insertAfter(newImportDeclaration);

    return;
  }

  // no imports found, let's create one at the top of the file.
  root.get().node.program.body.unshift(newImportDeclaration);
};
