import { isExpression, isTemplateLiteral } from '../../typeChecking';


/**
 * Determines whether given className attribute's uses a JSX template literal expression,
 * following the syntax:
 * classNames={`banana ${orange}`}
 * @param   {Node}    classNameAttr
 * @param   {object}  [classNameAttr.value]
 * @returns {boolean}
 */
export const isTemplateLiteralExpression = ({value}) => (
  isExpression(value)
  && isTemplateLiteral(value.expression)
  && value.expression.quasis.length > 0
)
