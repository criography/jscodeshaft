/**
 * Values set to "undefined", are represented as expressions
 * without "value" property. There's no obvious way to create
 * them so this workaround is used instead.
 * @param   {function}    j   JSCodeShift instance
 * @returns {Node|null}
 */
export const createUndefinedExpression = j => {
  if (j?.jsxExpressionContainer) {
    return j.jsxExpressionContainer(
      j.identifier('undefined'),
    );
  }

  return null;
}
