import { isFunctionCallOf } from '../isFunctionCallOf';
import { unwrapFunctionCall } from '../unwrapFunctionCall';


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
