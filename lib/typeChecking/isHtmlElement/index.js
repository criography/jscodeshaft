import { isElement } from '../isElement';


export const isHtmlElement = node => (
  isElement(node)
  && node.openingElement.name
  && node.openingElement.name.name
  && /[a-z]/.test(node.openingElement.name.name[0])
);
