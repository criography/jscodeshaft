/**
 * Find an import specifier matching the module in question
 * @param   {Node}    importNode
 * @returns {Boolean}
 */
export const hasFragment = (importNode) => importNode.specifiers.some(
  specifier => (
    specifier.type === 'ImportSpecifier'
    && specifier.imported.name === 'Fragment'
  ),
);
