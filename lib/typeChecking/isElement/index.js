import { getType } from '../getType';


export const isElement = node => getType(node) === 'JSXElement' && Boolean(node.openingElement);
