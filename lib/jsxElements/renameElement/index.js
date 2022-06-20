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
