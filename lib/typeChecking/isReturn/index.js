import { getType } from '../getType';


export const isReturn = node => getType(node) === 'ReturnStatement';
