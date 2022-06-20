import { isElement, isTruthyString } from '../../typeChecking';
import toTruthyStringArray from '../../general/toTruthyStringArray'

/**
 * @typedef {function}            removeAttrsParams
 * @param   {(string|string[])}   attrNames   Attribute name
 * @returns {Node[]}                          Mutated collection of attribute nodes
 *//**
 * Removes 1 or more traversal by name
 * @param   {function}  j     JSCodeShift instance
 * @param   {object}    node  Element node to manipulate
 * @returns {function(removeAttrsParams): Node[]}
 */
export const removeAttrs = (j, node) => attrNames => {
  let attrs = getAttributes(node);

  if (j && isElement(node) && (Array.isArray(attrNames) || isTruthyString(attrNames))) {
    const toRemove = toTruthyStringArray(attrNames);
    const filteredAttrs = attrs.filter(({name, type}) => (
      type === 'JSXSpreadAttribute'
      || (name && name.name && !toRemove.includes(name.name))
    ));

    node.openingElement.attributes = filteredAttrs;
  }

  return getAttributes(node);
};
