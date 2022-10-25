import { getType } from '../getType'


export const isArrow = node => getType(node) === 'ArrowFunctionExpression';
