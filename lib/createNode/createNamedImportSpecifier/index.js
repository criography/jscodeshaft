/**
 * @typedef {function}  createNamedImportSpecifierArgs
 * @param   {string}    name          Imported module name
 * @param   {string}    [alias]       Optional imported module alias
 * @returns {Node}
 *//**
 * Create new named import specifier node
 * @TODO add support for default imports
 * @param   {function}    j   JSCodeShift instance
 * @returns {function(createNamedImportSpecifierArgs): Node}
 */
export const createNamedImportSpecifier = j => (name, alias = name) => (
  j.importSpecifier(
    j.identifier(name),
    j.identifier(alias),
  )
);
