import { isLiteral, isTruthyString } from '../../typeChecking';


/**
 * Determines whether given className attribute's uses a string literal,
 * following the syntax:
 * classNames="banana"
 * @param   {Node}    classNameAttr
 * @param   {object}  [classNameAttr.value]
 * @returns {boolean}
 */
export const isLiteralClassName = ({value}) => (
  isLiteral(value)
  && isTruthyString(value.value)
)
