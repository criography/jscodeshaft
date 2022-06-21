/**
 * @typedef {function}  createTemplateElement
 * @param   {string}    val   Literal value
 * @param   {boolean}   val   Is the last quasi
 * @returns {Node}
 *//**
 * Creates a string literal Quasi (string literal) value.
 * @TODO figure out how to add expression fragments
 * @param   {function}    j   JSCodeShift instance
 * @returns {function(createTemplateElementArgs): (Node|null)}
 */
export const createTemplateElement = j => (val, tail = true) => j.templateElement({
  cooked:val, raw:val
}, tail);
