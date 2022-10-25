import { getType } from '../getType';


export const isAttribute = node => getType(node) === 'JSXAttribute';
