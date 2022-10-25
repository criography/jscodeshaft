import { getType } from '../getType';


export const isTemplateLiteral = node => getType(node) === 'TemplateLiteral';
