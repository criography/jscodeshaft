/**
 * @typedef {function}  swapAttrParams
 * @param   {string}    name   Existing attribute name
 * @param   {string}    attr   Attribute node to swap with
 * @returns {array}     Mutated collection of attribute nodes
 *//**
 * Swaps attribute by name with a new attribute node on a given element node
 * @param   {function}  j     JSCodeShift instance
 * @param   {object}    node  Element node to mutate
 * @returns {function(swapAttrParams): Node[]}
 */
export const swapAttr = (j, node) => (name, newAttr) => {
  const attrs = getAttributes(node);
  const targetIndex = attrs.findIndex(attr => attr.name.name === name);

  if (targetIndex >= 0) {
    attrs.splice(targetIndex, 1, newAttr);
  }

  return attrs;
};
