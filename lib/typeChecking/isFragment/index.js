import { getType } from '../getType';


export const isFragment = node => getType(node) === 'JSXFragment';
