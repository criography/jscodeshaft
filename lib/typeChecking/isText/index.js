import { getType } from '../getType';


export const isText = node => getType(node) === 'JSXText';
