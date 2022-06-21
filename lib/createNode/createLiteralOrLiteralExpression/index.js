/**
 * @typedef {function}  createLiteralOrLiteralExpressionArgs
 * @param   {string}    val   Literal value
 * @returns {Node}
 *//**
 * Creates a literal value, which can be 1 of the following:
 * string | boolean | null | number | RegExp of type Literal.
 * @TODO add support for regex
 * @param   {function}    j   JSCodeShift instance
 * @returns {function(createLiteralOrLiteralExpressionArgs): (Node|null)}
 */
export const createLiteralOrLiteralExpression = j => val => {
  let output;

  if(typeof val === 'string') {
    output = j.literal(val);
  }else if(['number', 'boolean'].includes(typeof val) || val === null){
    output = j.jsxExpressionContainer(j.literal(val));
  }

  return output;
}
