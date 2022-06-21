import { getType } from '../getType';


export const isValidImportSpecifier = node => (
  ['ImportSpecifier', 'ImportDefaultSpecifier'].includes(getType(node))
);
