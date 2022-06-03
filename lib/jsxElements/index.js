import {isText} from '../typeChecking';


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


/**
 * In some cases you need to get all children that are either elements,
 * literals or expressions and ignore all text nodes that are just whitespace.
 * @param   {Node[]} childrenNodes
 * @returns {Node[]}
 */
export const getMeaningfulChildren = childrenNodes => childrenNodes?.filter(
  childNode => {
    const isTextNode = isText(childNode);

    return !isTextNode || (
      isTextNode && Boolean(childNode.value.trim().length)
    )
  }
) || [];

