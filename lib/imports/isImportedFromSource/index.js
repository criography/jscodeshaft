import { isStringMatching } from '../../general';
import { isImportMatchedByImportPath } from '../isImportMatchedByImportPath';
import { getSpecifierNamesFromImport } from '../getSpecifierNamesFromImport';


/**
 * @typedef {function}  isImportedFromSourceArgs
 * @param   {string|RegExp}   specifierName   Module name.
 * @param   {string|RegExp}   importSource    Import source matcher.
 * @returns {boolean}
 *//**
 * Determine if {specifierName} has been imported from a specific {importSource},
 * which is either a path or package name.
 * This is useful if, for example, your codebase has multiple components
 * with the same name (internal or external) and you want to confirm you're
 * processing the right one.
 * @param   {Program} root  AST-ified file content
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
    .length,
);
