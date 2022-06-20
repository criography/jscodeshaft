import {renameElement} from '../renameElement';


export const renameAllElements = (j, root) => (oldName, newName) => {
  const elements = root.find(j.JSXElement, { openingElement: {name: {name: oldName}}})

  if(elements.length){
    elements.forEach(({node}) => {
      renameElement(node)(newName);
    })
  }
};
