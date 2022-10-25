import { getType } from '../getType';


export const isLiteral = node => getType(node) === 'Literal';
