import { getType } from '../getType';


export const isFunction = node => getType(node) === 'FunctionDeclaration';
