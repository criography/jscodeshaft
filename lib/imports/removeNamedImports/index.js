import { getType} from '../../typeChecking';

/**
 * @typedef {function}  namedImportArgs
 * @param   {(string|RegExp)} [moduleName]  Module name. If falsy, the matching will be ignored
 * @param   {(string|RegExp)} [importPath]  Import path matcher. If falsy, the matching will be ignored
 * @returns {void}
 *//**
 * Remove named exports from import declarationsimports
 * @param   {function}  j     JSCodeShift instance
 * @param   {object}    root  AST-ified file content
 * @returns {function(namedImportArgs): void}
 */
export const removeNamedImports = (j, root) => (moduleName, importPath) => {
  const isDefaultImportSpecifier = specifier => getType(specifier) === 'ImportDefaultSpecifier';
  const isNamedImportSpecifier = specifier => getType(specifier) === 'ImportSpecifier';

  /**
   * @param   {string}          subject
   * @param   {(string|RegExp)} matcher
   * @returns {boolean}
   */
  const isStringOrRegexMatch = (subject, matcher) => {
    const isExactMatch = (
      typeof matcher === 'string'
      && subject === matcher
    );

    const isRegexMatch = (
      matcher instanceof RegExp
      && matcher.test(subject)
    );

    return isExactMatch || isRegexMatch;
  }


  /**
   * Find an import specifier (import name) matching the moduleName in question.
   * If a falsy moduleName argument is passed to the parent fn, this test will
   * be ignored and will match all import nodes.
   * @param   {Node}    importNode
   * @returns {Boolean}
   */
  const hasMatchingExport = (importNode) => {
    if (!moduleName) {
      return true;
    }

    return Boolean(
      importNode?.specifiers?.find(specifier => (
        isNamedImportSpecifier(specifier)
        && isStringOrRegexMatch(specifier?.imported?.name, moduleName)
      ))
    );
  };


  /**
   * Find an import path matching the importPath in question.
   * If no importPath argument is passed to the parent fn,
   * this test will be ignored and will always return true.
   * @TODO remove default to make it platform agnostic
   * @param   {Node}    importNode
   * @returns {Boolean}
   */
  const isMatchingPath = (importNode) => {
    if (!importPath) {
      return true;
    }

    return isStringOrRegexMatch(
      importNode?.source?.value,
      importPath
    );
  };


  /**
   * Remove given moduleName from a collection of named imports
   * @param   {Node}  importNode
   * @returns {Node[]}
   */
  const getCleanedUpSpecifiers = importNode => importNode.specifiers.filter(
    specifier => {
      if(isDefaultImportSpecifier(specifier)){
        return true;
      }

      if(isNamedImportSpecifier(specifier)){
        return (
          moduleName
          ? !isStringOrRegexMatch(specifier?.imported?.name, moduleName)
          : false
        );
      }
    }
  );


  /**
   * @param   {any}   input
   * @returns {boolean}
   */
  const isFalsyOrStringOrRegex = input => (
    !input
    || typeof input === 'string'
    || input instanceof RegExp
  );


  // exit early if param types are not respected
  if(!isFalsyOrStringOrRegex(moduleName) || !isFalsyOrStringOrRegex(importPath)){
    throw new Error('`moduleName` and `importPath` must be falsy, string or Regex');
  }


  root
    .find('ImportDeclaration')
    .filter(({node}) => hasMatchingExport(node) && isMatchingPath(node))
    .forEach((path) => {
      // if multiple modules imported,
      if (path.node.specifiers.length > 1) {
        const cleanedUpSpecifiers = getCleanedUpSpecifiers(path.node);

        // if some specifiers left, remove the one(s) matched
        if(cleanedUpSpecifiers.length > 0) {
          path.node.specifiers = getCleanedUpSpecifiers(path.node);

        // if nothing left, remove the whole import
        }else{
          j(path).remove();
        }

      // if only 1 moduleName imported, remove whole import
      } else {
        j(path).remove();
      }
    });
};
