import { isLiteral, isExpression } from '../../typeChecking';


/**
 * Determines whether given className attribute's uses a JSX string expression,
 * following the syntax:
 * classNames={"banana"}
 * @param   {Node}    classNameAttr
 * @param   {object}  [classNameAttr.value]
 * @returns {boolean}
 */
const isLiteralExpression = ({value}) => (
  isExpression(value)
  && isLiteral(value.expression)
  && Boolean(value.expression.value)
)
