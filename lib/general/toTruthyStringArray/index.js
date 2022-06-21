import {isTruthyString} from '../../typeChecking';


/**
 * Ensures the input is 1 or more of truthy strings and expressed as array.
 * @param   {(string|string[])} input
 * @returns {string[]}
 */
export const toTruthyStringArray = (input) => {
  const output = [];

  if (isTruthyString(input)) {
    output.push(input);
  } else if (Array.isArray(input) && input.length > 0) {
    output.push(...input.filter(item => isTruthyString(item)));
  }

  return output;
};
