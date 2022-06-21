import { isArrow } from '../isArrow';
import { isLiteral} from '../isLiteral';
import { isExpression } from '../isExpression';


export const isValidAttrValue = node => (
  typeof node === 'undefined'
  || isArrow(node)
  || isLiteral(node)
  || isExpression(node)
);
