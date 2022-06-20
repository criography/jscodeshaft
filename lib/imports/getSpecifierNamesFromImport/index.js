import {isImport} from '../typeChecking';


/**
 * Extracts all imported names from given import.
 * @param   {Node}  importNode
 * @param   {('ImportDefaultSpecifier'|'ImportSpecifier')}  [specifierType]
 * @returns {null|Object}
 */
export const getSpecifierNamesFromImport = (importNode, specifierType) => {
  if (!isImport(importNode) || !importNode?.specifiers) {
    return null;
  }

  const output = {};

  importNode.specifiers?.forEach(specifier => {
    if (!specifierType || specifierType === specifier.type) {
      const alias = specifier?.local?.name;

      output[specifier?.imported?.name || alias] = {
        alias,
        type: specifier.type,
      };
    }
  });


  return output;
};
