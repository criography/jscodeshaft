/**
 * @typedef {function}  unwrapFunctionCallArgs
 * @param   {Node}      node    Function Call Expression node
 * @returns {void}
 *//**
 * Swaps given function call expression with it's immediate argument
 * @param   {function}  j     JSCodeShift instance
 * @returns {unwrapFunctionCallArgs}
 */
export const unwrapFunctionCall = j => node => {
  j(node).replaceWith(node.value.arguments[0]);
}
