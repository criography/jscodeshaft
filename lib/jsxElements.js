/**
 * @typedef {function}  elementArgs
 * @param   {string}    name        New element name
 * @param   {Node[]}    [children]  Element children nodes
 * @returns {Node}
 *//**
 * Create new element node
 * @param   {function}    j   JSCodeShift instance
 * @returns {function(elementArgs): Node}
 */
export const createElement = (j) => (name, children) => j.jsxElement(
  j.jsxOpeningElement(j.jsxIdentifier(name)),
  j.jsxClosingElement(j.jsxIdentifier(name)),
  children,
);


/**
 * @typedef {function}  renameElementArgs
 * @param   {string}    newName     New element name
 * @returns {Node}
 *//**
 * Renames given JSX element node
 * @param   {Node}  node  JSX Element node
 * @returns {function(renameElementArgs): Node}
 */
export const renameElement = node => newName => {
  node.openingElement.name.name = newName;

  if(node.closingElement){
    node.closingElement.name.name = newName;
  }

  return node;
}


export const renameAllElements = (j, root) => (oldName, newName) => {
  const elements = root.find(j.JSXElement, { openingElement: {name: {name: oldName}}})

  if(elements.length){
    elements.forEach(({node}) => {
      renameElement(node)(newName);
    })
  }
};
