import { getType } from '../getType';


export const isObject = node => getType(node) === 'ObjectExpression';
