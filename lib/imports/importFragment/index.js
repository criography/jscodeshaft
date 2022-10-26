import { createNamedImportSpecifier } from '../../createNode';
import { hasFragment } from '../hasFragment';


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
        createNamedImportSpecifier(j)('Fragment', 'F'),
      );
    });
};
