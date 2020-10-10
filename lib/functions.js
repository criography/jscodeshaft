import {isFunctionCall} from './typeChecking';


/**
 * @typedef {function}  isFunctionCallOfArgs
 * @param   {string}    fname    Function name
 * @returns {void}
 *//**
 * Tests whether function call expression matches given fn name
 * @param  {object} node    Call Expression node to test
 * @return {isFunctionCallOfArgs}
 */
export const isFunctionCallOf = ({value}) => fname => (
  isFunctionCall(value)
  && value.callee.name === fname
)


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


/**
 * @typedef {function}  unwrapFromFunctionArgs
 * @param   {string}    [fname]   Function name
 * @returns {void}
 *//**
 * Removes the outermost function wrapper from an expression statement.
 * @param   {function}  j     JSCodeShift instance
 * @param   {object}    root  AST-ified file content
 * @returns {function(unwrapFromFunctionArgs): void}
 */
export const unwrapFromFunction = (j, root) => (fname) => {
  root
    .find('CallExpression')
    .filter(path => isFunctionCallOf(path)(fname))
    .forEach(path => unwrapFunctionCall(j)(path));
}
