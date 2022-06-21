import { isElement, isAttribute } from '../../typeChecking';


/**
 * @typedef {function}    addAttrsParams
 * @param   {Node|Node[]} attributes       1 or more attribute nodes
 * @returns {Node[]}      Mutated collection of attribute nodes
 *//**
 * Adds 1 pr more traversal to the given element node
 * @param   {function}  j     JSCodeShift instance
 * @param   {Node}      node  Element node to mutate
 * @returns {function(addAttrsParams)}
 */
export const addAttrs = (j, node) => (attributes) => {
  const isArray = Array.isArray(attributes);

  if (
    j
    && isElement(node)
    && (isAttribute(attributes) || isArray)
  ) {
    const attrs = getAttributes(node);
    if (isArray) {
      attrs.push(
        ...attributes.filter(attr => isAttribute(attr)),
      );
    } else {
      attrs.push(attributes);
    }
  }

  return getAttributes(node);
};
