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
    if (specifier.type === 'ImportSpecifier') {
      isNamed = true;
    }
  });
  importNode.specifiers.some(specifier => {
    if (specifier.type === 'ImportDefaultSpecifier') {
      isDefault = true;
    }
  });

  if (isDefault) {
    return isNamed ? 'mixed' : 'default';
  }
  return 'named';
};
