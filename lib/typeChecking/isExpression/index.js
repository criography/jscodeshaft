import { getType } from '../getType';


export const isExpression = node => getType(node) === 'JSXExpressionContainer';
