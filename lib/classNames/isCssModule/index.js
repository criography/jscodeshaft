/**
 * Determines whether given className attribute's is a CSS Module,
 * following the syntax of: classNames={style.banana}
 * @param   {Node}    classNameAttr
 * @returns {boolean}
 */
export const isCssModule = (classNameAttr) => (
  classNameAttr.value.expression.type === 'MemberExpression'
  && Boolean(
    classNameAttr.value.expression.object
    && /^styles?$/.test(classNameAttr.value.expression.object.name)
    && classNameAttr.value.expression.property
    && classNameAttr.value.expression.property.name
  )
);
