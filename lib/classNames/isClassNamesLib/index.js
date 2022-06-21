/**
 * Determines whether given className attribute's uses classnames library,
 * following one of the syntaxes:
 * classNames={cx(...)}
 * classNames={classnames(...)}
 * @param   {Node}    classNameAttr
 * @returns {boolean}
 */
export const isClassNamesLib = (classNameAttr) => (
  classNameAttr.value.expression.type === 'CallExpression'
  && ['classnames', 'cx'].includes(classNameAttr.value.expression.callee.name)
);
