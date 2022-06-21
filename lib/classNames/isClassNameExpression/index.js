import { isExpression } from '../../typeChecking';


/**
 * Determines whether given className attribute's is an expression,
 * following the syntax of (for example):
 * classNames={whatever} or classNames={whatever()}, etc
 * @param   {Node}    classNameAttr
 * @returns {boolean}
 */
export const isClassNameExpression = (classNameAttr) => (
  isExpression(classNameAttr.value)
  && Boolean(classNameAttr.value.expression)
);
