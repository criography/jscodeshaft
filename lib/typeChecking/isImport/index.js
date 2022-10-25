import { getType } from '../getType';


export const isImport = node => getType(node) === 'ImportDeclaration';
