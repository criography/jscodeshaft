/**
 * @typedef {function}  createStringLiteralArgs
 * @param   {string}    val   Literal value
 * @returns {Node}
 *//**
 * Creates a string literal value.
 * @param   {function}    j   JSCodeShift instance
 * @returns {function(createStringLiteralArgs): (Node|null)}
 */
export const createStringLiteral = j => val => j.stringLiteral(val);
